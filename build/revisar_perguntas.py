#!/usr/bin/env python3
"""Revisão das perguntas: procura pistas que entregam a resposta e sugere ideias erradas comuns (fichas).
Só avisa, nunca altera o dados.js.

Uso (na pasta do projeto):
  python3 build/revisar_perguntas.py           pente-fino em todas as perguntas; resumo aqui, detalhes em revisao/perguntas.md
  python3 build/revisar_perguntas.py fichas    confere o formato das fichas (build/fichas/<assunto>.json)
Teste guardado: python3 build/t_revisar_perguntas.py. Também usado pelo novas.py verificar (perguntas novas).

Avisos: longa (certa bem mais comprida), absoluta (sempre/nunca/só só nas erradas), eco (só a certa repete
o enunciado), repetida, anteriores ("todas/nenhuma das anteriores": o app embaralha), negacao (NÃO sem
maiúsculas), sem_e (sem explicação). Sugestões das fichas: até 2 ideias erradas por pergunta.
"""
import datetime, difflib, functools, json, os, re, subprocess, sys, unicodedata

RAIZ = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
FICHAS = os.path.join(RAIZ, "build", "fichas")
NAO_FICHA = {"textos"}  # outras fichas da pasta, que não são de perguntas
NOMES = {"longa": "certa bem mais comprida", "absoluta": "sempre/nunca/só só nas erradas", "eco": "só a certa repete o enunciado",
         "repetida": "alternativas repetidas", "anteriores": "todas/nenhuma das anteriores", "negacao": "NÃO sem maiúsculas",
         "sem_e": "sem explicação"}

ABSOLUTAS = re.compile(r"\b(sempre|nunca|jamais|so|somente|apenas|todos|todas|nenhum|nenhuma|qualquer)\b")
ANTERIORES = re.compile(r"\b(todas|nenhuma) (as |das )?(anteriores|alternativas|acima)\b")
NEGACAO = re.compile(r"\b(incorreta|incorretas|errada|erradas|falsa|falsas|exceto)\b|\b(qual|quais|que)\b.{0,40}\bnao (e|sao|pertence|pertencem|faz parte|fazem parte|corresponde|representa|e exemplo|sao exemplos)\b")
DESTAQUE = re.compile(r"\b(NÃO|INCORRETA|INCORRETAS|ERRADA|ERRADAS|FALSA|FALSAS|EXCETO)\b")
VAZIAS = set("a o as os de da do das dos em no na nos nas um uma uns umas e ou que se por para com sem ao aos mais menos "
             "quando qual quais como sua seu suas seus ser sao esta este isso esse essa elas eles animal animais".split())

JS = r"""
const fs=require("fs"),vm=require("vm"),p=require("path"),D=process.argv[1]+p.sep,c={};vm.createContext(c);
let s=fs.readFileSync(D+"util.js","utf8")+"\n"+fs.readFileSync(D+"dados.js","utf8");
if(fs.existsSync(D+"banco-proprio.js"))s+="\n"+fs.readFileSync(D+"banco-proprio.js","utf8");
vm.runInContext(s+";this.X={G,EXTRA,EXTRA2,BANK3,BANK4,QZ,MQX,MQ0,P:typeof PROPRIO==='undefined'?null:PROPRIO}",c);
const X=c.X,L=[],add=(loc,area,q,o,a,e)=>L.push({loc,area,q,o,a,e:e||""});
X.G.forEach((g,i)=>add("G["+i+"].q",g.id,g.q.q,g.q.o,g.q.a,g.q.w));
["EXTRA","EXTRA2","BANK3","BANK4"].forEach(n=>Object.keys(X[n]).forEach(k=>X[n][k].forEach((x,i)=>add(n+"."+k+"["+i+"]",k,x[0],x[1],0,x[2]))));
X.QZ.forEach((x,i)=>add("QZ["+i+"]","final",x[0],x[1],x[2],x[3]));
["MQ0","MQX"].forEach(n=>Object.keys(X[n]).forEach(k=>X[n][k].forEach((x,i)=>add(n+'["'+k+'"]['+i+"]","aba:"+k,x[0],x[1],0,x[2]))));
if(X.P)(X.P.perguntas||[]).forEach((x,i)=>add("banco-proprio["+i+"]",x.g,x.q,x.o,0,x.w));
console.log(JSON.stringify(L));
"""


def norm(t):
    t = unicodedata.normalize("NFD", str(t).lower())
    return re.sub(r"[^a-z0-9]+", " ", "".join(c for c in t if unicodedata.category(c) != "Mn")).strip()


def assunto(nome):
    """Nome da ficha: id do grupo, "final" ou a aba ("Desafio da fauna do Pará" → "fauna-do-para")."""
    if nome.startswith("aba:"): nome = re.sub(r"^desafio d[aeo]s? ", "", norm(nome[4:]))
    return norm(nome).replace(" ", "-")


def perguntas(raiz=None):
    r = subprocess.run(["node", "-e", JS, raiz or RAIZ], capture_output=True, text=True)
    if r.returncode: sys.exit("Não consegui ler o dados.js:\n" + r.stderr[-800:])
    return json.loads(r.stdout)


def _palavras(t): return {w for w in norm(t).split() if len(w) >= 5 and w not in VAZIAS}


def checar(q, o, a, e):
    """Avisos de uma pergunta: lista de (tipo, mensagem)."""
    if not isinstance(o, list) or len(o) < 2 or not isinstance(a, int) or not 0 <= a < len(o): return [("repetida", "alternativas ou posição da certa inválidas")]
    R = []
    o = [str(x) for x in o]; erradas = [x for i, x in enumerate(o) if i != a]
    if len({re.sub(r"\s+", " ", x).strip().lower() for x in o}) < len(o): R.append(("repetida", "há alternativas repetidas"))
    media = sum(len(x) for x in erradas) / len(erradas)
    if len(o[a]) > 1.6 * media and len(o[a]) == max(len(x) for x in o) and len(o[a]) - media > 15:
        R.append(("longa", f"a certa tem {len(o[a])} letras e as erradas {media:.0f} em média; encurte a certa ou alongue as erradas"))
    abs_e = sum(1 for x in erradas if ABSOLUTAS.search(norm(x)))
    if abs_e >= 2 and not ABSOLUTAS.search(norm(o[a])):
        R.append(("absoluta", f"{abs_e} erradas usam 'sempre/nunca/só' e a certa não; a pista entrega a resposta"))
    pq = _palavras(q); eco = [len(pq & _palavras(x)) for x in o]
    if eco[a] >= 2 and all(n == 0 for i, n in enumerate(eco) if i != a):
        R.append(("eco", "só a certa repete palavras do enunciado; use essas palavras também numa errada"))
    if any(ANTERIORES.search(norm(x)) for x in o):
        R.append(("anteriores", "'todas/nenhuma das anteriores' perde o sentido: o app embaralha as alternativas"))
    if NEGACAO.search(norm(q)) and not DESTAQUE.search(q):
        R.append(("negacao", "pergunta negativa: escreva NÃO / EXCETO em maiúsculas"))
    if not str(e or "").strip(): R.append(("sem_e", "falta a explicação"))
    return R


@functools.lru_cache(None)
def ficha(nome):
    p = os.path.join(FICHAS, f"{nome}.json")
    return json.load(open(p, encoding="utf-8")) if os.path.exists(p) else {"teoria": []}


def fichas_existentes():
    return sorted(f[:-5] for f in os.listdir(FICHAS) if f.endswith(".json") and f[:-5] not in NAO_FICHA) if os.path.isdir(FICHAS) else []


def checar_ficha(nome):
    """Erros de formato de uma ficha (lista vazia = tudo certo)."""
    try: f = ficha(nome)
    except Exception as ex: return [f"{nome}: arquivo ilegível ({ex})"]
    err = [] if isinstance(f.get("teoria"), list) else [f"{nome}: falta a lista 'teoria'"]
    for i, t in enumerate(f.get("teoria") or []):
        if not isinstance(t, dict) or not t.get("ideia") or not t.get("por_que") or not isinstance(t.get("palavras"), list) or len(t["palavras"]) < 2:
            err.append(f"{nome} teoria[{i}]: precisa de 'palavras' (2 ou mais), 'ideia' e 'por_que'")
        elif not t.get("fonte"): err.append(f"{nome} teoria[{i}]: falta a 'fonte' (site do FONTES-CONFIAVEIS.md)")
    return err


def ideias(nome, q, e, o, max_n=2):
    """Ideias erradas da ficha ligadas ao enunciado (2+ palavras) e que ainda não estão nas alternativas.
    No Desafio final ("final") vale a ficha de qualquer assunto."""
    txt = " " + norm(f"{q} {e}") + " "; alts = [norm(x) for x in o]; out = []
    for f in (fichas_existentes() if nome == "final" else [nome]):
        for t in ficha(f).get("teoria", []):
            pts = sum(1 for p in t.get("palavras", []) if " " + norm(p) in txt)
            ja = any(difflib.SequenceMatcher(None, norm(t["ideia"]), a).ratio() > .6 for a in alts)
            if pts >= 2 and not ja: out.append((pts, t))
    return [t for _, t in sorted(out, key=lambda x: -x[0])[:max_n]]


def pente_fino(raiz=None, saida=None):
    """Confere todas as perguntas; devolve (total, contagem por tipo, nº de sugestões)."""
    L = perguntas(raiz); cont, por_tipo, sug = {}, {}, []
    for p in L:
        for tipo, m in checar(p["q"], p["o"], p["a"], p["e"]):
            cont[tipo] = cont.get(tipo, 0) + 1
            por_tipo.setdefault(tipo, []).append(f'- `{p["loc"]}` "{p["q"][:90]}": {m}')
        for t in ideias(assunto(p["area"]), p["q"], p["e"], p["o"]):
            sug.append(f'- `{p["loc"]}` "{p["q"][:70]}": usar como errada "{t["ideia"]}" ({t["por_que"]})')
    linhas = [f"# Revisão das perguntas ({datetime.date.today()})", "", f"{len(L)} perguntas, {sum(cont.values())} aviso(s), {len(sug)} sugestão(ões).",
              "Só avisos: nada foi alterado. Corrigir só com o \"sim\" do dono.", ""]
    for tipo in sorted(por_tipo, key=lambda k: -cont[k]): linhas += [f"## {tipo}: {NOMES[tipo]} ({cont[tipo]})", ""] + por_tipo[tipo] + [""]
    if sug: linhas += [f"## Sugestões das fichas ({len(sug)})", ""] + sug + [""]
    saida = saida or os.path.join(RAIZ, "revisao", "perguntas.md")
    os.makedirs(os.path.dirname(saida), exist_ok=True)
    open(saida, "w", encoding="utf-8").write("\n".join(linhas))
    return len(L), cont, len(sug)


if __name__ == "__main__":
    a = sys.argv[1:]
    if a[:1] == ["fichas"]:
        nomes = fichas_existentes(); err = [m for n in nomes for m in checar_ficha(n)]
        for m in err: print("ERRO: " + m)
        print(f"Fichas: {len(nomes)}, {len(err)} erro(s)."); sys.exit(1 if err else 0)
    if a: print(__doc__); sys.exit(1)
    tot, cont, nsug = pente_fino()
    print(f"Perguntas: {tot}, {sum(cont.values())} aviso(s): " + (", ".join(f"{k} {v}" for k, v in sorted(cont.items(), key=lambda x: -x[1])) or "nenhum") + f"; {nsug} sugestão(ões) das fichas.")
    print("Detalhes: revisao/perguntas.md")
