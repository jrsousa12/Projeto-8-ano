#!/usr/bin/env python3
"""Recalcula a versão do cache do sw.js a partir do conteúdo dos arquivos do app.
Assim, sempre que algo muda, os celulares com o app instalado baixam a versão nova."""
import hashlib, os, re
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + os.sep
sw = open(A + 'sw.js', encoding='utf-8').read()
lista = re.search(r'ARQ\s*=\s*\[(.*?)\]', sw, re.S).group(1)
arqs = [x[2:] if x.startswith('./') else x for x in re.findall(r'"([^"]+)"', lista)]
# ilustrações: a lista do sw.js acompanha a pasta img/animais
imgs = sorted('img/animais/' + f for f in os.listdir(A + 'img/animais') if f.endswith('.webp')) if os.path.isdir(A + 'img/animais') else []
sw = re.sub(r'const IMGS = \[.*?\];', 'const IMGS = [' + ', '.join('"./' + f + '"' for f in imgs) + '];', sw, count=1, flags=re.S)
arqs += imgs
h = hashlib.sha1()
for f in sorted(a for a in arqs if a):
    p = A + f
    if os.path.exists(p):
        h.update(f.encode()); h.update(open(p, 'rb').read())
    else:
        print('aviso: arquivo listado no sw.js não existe:', f)
v = 'animais-8ano-' + h.hexdigest()[:8]
novo = re.sub(r'const V = "[^"]*"', 'const V = "%s"' % v, sw, count=1)
if True:
    open(A + 'sw.js', 'w', encoding='utf-8').write(novo)
print('cache:', v)
