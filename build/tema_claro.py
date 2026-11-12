#!/usr/bin/env python3
"""Gera tema-claro.css a partir do style.css.
O visual original é escuro, com superfícies brancas translúcidas (rgba(255,255,255,x)).
No tema claro, cada uma dessas regras ganha uma versão com superfícies escuras translúcidas
e textos escuros, valendo só quando <html data-theme="claro">.
Rode de novo depois de mudar cores no style.css: python3 build/tema_claro.py"""
import os, re
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + os.sep
css = open(A + 'style.css', encoding='utf-8').read()
css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)

# cores claras de texto (boas no fundo escuro) -> versões escuras legíveis no fundo claro
TEXTO = {'#fde68a': '#a16207', '#fbbf24': '#b45309', '#34d399': '#047857', '#fb7185': '#be123c',
         '#eaf6ff': '#0f172a', '#7dd3fc': '#0369a1', '#5eead4': '#0f766e', '#fff': '#0f172a', '#ffffff': '#0f172a'}
PROPS = ('background', 'background-color', 'border', 'border-color', 'border-top', 'border-bottom', 'border-left', 'border-right', 'box-shadow', 'outline', 'color')

def troca(prop, val):
    v = re.sub(r'rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*([\d.]+)\s*\)',
               lambda m: 'rgba(15,23,42,%s)' % round(min(1, float(m.group(1)) * 0.9 + 0.02), 3), val)
    v = re.sub(r'rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*([\d.]+)\s*\)',
               lambda m: 'rgba(255,255,255,%s)' % round(min(1, float(m.group(1)) * 2.5), 3), v)
    if prop == 'color':
        v = TEXTO.get(v.strip().lower(), v)
    return v

saida = []
def regras(bloco, prefixo_media=None):
    for m in re.finditer(r'([^{}]+)\{([^{}]*)\}', bloco):
        sel, corpo = m.group(1).strip(), m.group(2)
        if not sel or sel.startswith('@') or sel.startswith('from') or sel.startswith('to') or re.match(r'^[\d.%, ]+$', sel):
            continue
        novos = []
        for d in corpo.split(';'):
            if ':' not in d:
                continue
            p, v = d.split(':', 1)
            p = p.strip().lower()
            if p not in PROPS:
                continue
            nv = troca(p, v)
            if nv != v:
                novos.append('%s:%s' % (p, nv.strip()))
        if novos:
            seletores = ','.join(':where([data-theme=claro]) ' + s.strip() if not s.strip().startswith(('html', 'body')) else s.strip().replace('html', ':where([data-theme=claro])', 1).replace('body', ':where([data-theme=claro]) body', 1) for s in sel.split(','))
            saida.append(seletores + '{' + ';'.join(novos) + '}')

# separa @media (mantém o envoltório)
pos = 0
for m in re.finditer(r'@media[^{]+\{((?:[^{}]*\{[^{}]*\})*)\s*\}', css):
    regras(css[pos:m.start()])
    antes = len(saida)
    regras(m.group(1))
    if len(saida) > antes and 'print' not in m.group(0)[:30]:
        dentro = saida[antes:]
        del saida[antes:]
        saida.append(m.group(0).split('{', 1)[0].strip() + '{' + ''.join(dentro) + '}')
    else:
        del saida[antes:]
    pos = m.end()
regras(css[pos:])

FIXO = '''/* Tema claro: gerado por build/tema_claro.py a partir do style.css (não edite à mão as regras geradas).
   As regras do fim (ajustes) são fixas no gerador. */
'''
AJUSTES = '''
/* ---------- ajustes fixos do tema claro ---------- */
[data-theme=claro]{color-scheme:light}
[data-theme=claro] body{background:#eef6fb;color:#0f172a}
[data-theme=claro] .bg{background:radial-gradient(1200px 700px at 12% -10%,#a5f3fc 0%,transparent 60%),radial-gradient(1000px 700px at 105% 15%,#ddd6fe 0%,transparent 55%),radial-gradient(900px 600px at 50% 125%,#bbf7d0 0%,transparent 60%),#eef6fb}
[data-theme=claro] .bubble{background:radial-gradient(circle at 30% 30%,rgba(14,116,144,.25),rgba(14,116,144,.03))}
[data-theme=claro] .brand h1{background:linear-gradient(90deg,#b45309,#0f766e,#4338ca);-webkit-background-clip:text;background-clip:text}
[data-theme=claro] .btn.pri,[data-theme=claro] nav button.on,[data-theme=claro] .bbtn,[data-theme=claro] .hero,[data-theme=claro] .hero h2{color:#fff}
[data-theme=claro] .panel,[data-theme=claro] .opm,[data-theme=claro] .mdbox,[data-theme=claro] #inst{background:#fff;color:#0f172a}
[data-theme=claro] .box,[data-theme=claro] .card,[data-theme=claro] .ht,[data-theme=claro] .pgc,[data-theme=claro] nav button:not(.on),[data-theme=claro] .fs,[data-theme=claro] .score{background-color:rgba(255,255,255,.75)}
[data-theme=claro] .opt.ok{background:rgba(52,211,153,.3)}
[data-theme=claro] .opt.no{background:rgba(251,113,133,.28)}
[data-theme=claro] .hero .tag{background:rgba(0,0,0,.28);color:#fff}
[data-theme=claro] .know{background:linear-gradient(135deg,rgba(251,191,36,.25),rgba(251,113,133,.15))}
'''
open(A + 'tema-claro.css', 'w', encoding='utf-8').write(FIXO + '\n'.join(saida) + '\n' + AJUSTES)
print('tema-claro.css:', len(saida), 'regras geradas')
