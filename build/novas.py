#!/usr/bin/env python3
"""Gerador de perguntas novas: molde em branco, conferência e entrada no dados.js.

Uso (na pasta do projeto):
  python3 build/novas.py modelo <destino> [n]   cria build/novas/<destino>_AAAA-MM-DD.json com n moldes (padrão 5)
  python3 build/novas.py verificar [arq.json..] confere os rascunhos (padrão: todos em build/novas/)
  python3 build/novas.py aplicar arq.json       confere e, sem erro, grava no dados.js
  python3 build/novas.py teste                  confere o próprio gerador (numa cópia, sem mexer no app)
Destino: id de um grupo (porifero, ave...), "final" (Desafio final) ou parte do nome de um
desafio das abas (temperatura, metamorfose, fauna, verminoses).
Grupo → BANK4; final → QZ; abas → MQX. Erro bloqueia; aviso só alerta. Relatório em build/novas/relatorio.md.
"""
import datetime, difflib, json, os, re, shutil, subprocess, sys, tempfile, unicodedata, urllib.parse

RAIZ = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
NOVAS = os.path.join(RAIZ, "build", "novas")
SAUDE_HOSTS = ("fiocruz.br", "paho.org", "who.int")
RX_SAUDE = re.compile(r"verminos|doen[cç]a|sintoma|transmi|contamin|infec|parasit|tratamento|preven|picad|sa[uú]de")
RX_REMEDIO = re.compile(r"verm[ií]fug|albendazol|mebendazol|praziquantel|ivermectina|antibi[oó]tic|automedica", re.I)
RX_REMEDIO_LEVE = re.compile(r"rem[eé]dio|medicament", re.I)
RX_PROIBIDA = re.compile(r"todas as (anteriores|alternativas)|nenhuma das (anteriores|alternativas)", re.I)
RX_MOLDE = re.compile(r"ESCREVA|\.\.\.")
MAX_PALAVRAS = 25

# ----------------------------------------------------------------- leitura do app
JS_DUMP = r"""
const fs=require("fs"),vm=require("vm"),p=require("path"),D=process.argv[1]+p.sep,c={};vm.createContext(c);
let s=fs.readFileSync(D+"util.js","utf8")+"\n"+fs.readFileSync(D+"dados.js","utf8");
if(fs.existsSync(D+"banco-proprio.js"))s+="\n"+fs.readFileSync(D+"banco-proprio.js","utf8");
vm.runInContext(s+";this.X={G,EXTRA,EXTRA2,BANK3,BANK4,QZ,MQX,MQ0,FONTES_MAIS,P:typeof PROPRIO==='undefined'?null:PROPRIO}",c);
const X=c.X,q=[];
X.G.forEach(g=>q.push(["G."+g.id,g.q.q]));
["EXTRA","EXTRA2","BANK3","BANK4"].forEach(n=>Object.keys(X[n]).forEach(k=>X[n][k].forEach((x,i)=>q.push([n+"."+k+"["+i+"]",x[0]]))));
X.QZ.forEach((x,i)=>q.push(["QZ["+i+"]",x[0]]));
["MQ0","MQX"].forEach(n=>Object.keys(X[n]).forEach(k=>X[n][k].forEach((x,i)=>q.push([n+'."'+k+'"['+i+"]",x[0]]))));
if(X.P)(X.P.perguntas||[]).forEach((x,i)=>q.push(["banco-proprio["+i+"]",x.q]));
console.log(JSON.stringify({perguntas:q,grupos:X.G.map(g=>g.id),abas:Object.keys(X.MQX),nqz:X.QZ.length,
 fontes:X.FONTES_MAIS,tam:{BANK4:Object.fromEntries(Object.entries(X.BANK4).map(([k,v])=>[k,v.length])),
 MQX:Object.fromEntries(Object.entries(X.MQX).map(([k,v])=>[k,v.length]))}}));
"""

def app():
    r = subprocess.run(["node", "-e", JS_DUMP, RAIZ], capture_output=True, text=True)
    if r.returncode: sys.exit("Não consegui ler o dados.js:\n" + r.stderr[-800:])
    return json.loads(r.stdout)

def dominios():
    txt = open(os.path.join(RAIZ, "FONTES-CONFIAVEIS.md"), encoding="utf8").read()
    return sorted({urllib.parse.urlparse(u).hostname for u in re.findall(r"https?://[^\s|)>]+", txt)} - {None})

def norm(t):
    t = unicodedata.normalize("NFD", str(t).lower())
    return re.sub(r"[^a-z0-9]+", " ", "".join(c for c in t if unicodedata.category(c) != "Mn")).strip()

def destino(nome, A):
    """Devolve ("BANK4", id) / ("QZ", None) / ("MQX", título), ou None."""
    if nome in A["grupos"]: return ("BANK4", nome)
    if norm(nome) in ("final", "desafio final"): return ("QZ", None)
    achou = [t for t in A["abas"] if norm(nome) and norm(nome) in norm(t)]
    return ("MQX", achou[0]) if len(achou) == 1 else None

# ----------------------------------------------------------------- conferência
def host_ok(url, doms):
    h = urllib.parse.urlparse(url).hostname or ""
    return any(h == d or h.endswith("." + d.removeprefix("www.")) or h == d.removeprefix("www.") for d in doms)

def saude_ok(url):
    u = urllib.parse.urlparse(url); h = u.hostname or ""
    return any(h == d or h.endswith("." + d) for d in SAUDE_HOSTS) or (h == "www.gov.br" and u.path.startswith("/saude"))

def frases_longas(t):
    return [f for f in re.split(r"(?<=[.!?])\s+", t) if len(f.split()) > MAX_PALAVRAS]

def conferir(arq, A, doms, novas_vistas):
    """Confere um rascunho. Devolve (destino, erros, avisos)."""
    E, W = [], []
    try: d = json.load(open(arq, encoding="utf8"))
    except Exception as ex: return None, [f"arquivo ilegível ({ex})"], []
    dest = destino(str(d.get("destino", "")), A)
    if not dest: E.append(f'destino "{d.get("destino")}" não existe (use um grupo, "final" ou um desafio das abas)')
    ps = d.get("perguntas")
    if not isinstance(ps, list) or not ps: return dest, E + ["não há perguntas"], W
    saude_dest = bool(dest and dest[0] == "MQX" and "vermin" in norm(dest[1]))
    for i, p in enumerate(ps, 1):
        L = f"pergunta {i}"
        q, certa, err, e = (str(p.get(k, "")).strip() if k != "erradas" else p.get(k) or [] for k in ("q", "certa", "erradas", "e"))
        err = [str(x).strip() for x in err] if isinstance(err, list) else []
        fontes = p.get("fontes") or []
        for nome, v in (("enunciado (q)", q), ("resposta certa", certa), ("explicação (e)", e), ("onde conferi", str(p.get("onde_conferi", "")).strip())):
            if not v: E.append(f"{L}: falta {nome}")
            elif RX_MOLDE.search(v): E.append(f"{L}: {nome} ainda tem o texto do molde")
        if len(err) < 2: E.append(f"{L}: precisa de pelo menos 2 alternativas erradas")
        elif len(err) != 3: W.append(f"{L}: o app costuma ter 4 alternativas (aqui são {len(err) + 1})")
        alts = [certa] + err
        if any(not a for a in alts): E.append(f"{L}: há alternativa vazia")
        if any(RX_MOLDE.search(a) for a in alts): E.append(f"{L}: alternativa ainda com o texto do molde")
        if len({norm(a) for a in alts}) != len(alts): E.append(f"{L}: alternativas repetidas (ou a certa aparece entre as erradas)")
        if any(RX_PROIBIDA.search(a) for a in alts): E.append(f'{L}: não use "todas/nenhuma das anteriores" (o app embaralha as alternativas)')
        if err and certa and len(certa) > 1.6 * max(len(x) for x in err) and len(certa) - max(len(x) for x in err) >= 15:
            W.append(f"{L}: a certa é bem mais comprida que as erradas (isso entrega a resposta)")
        for t in (q, e):
            for f in frases_longas(t): W.append(f'{L}: frase com mais de {MAX_PALAVRAS} palavras: "{f[:70]}…"')
        tudo = " ".join([q, e] + alts)
        # fontes
        if not isinstance(fontes, list) or not fontes: E.append(f"{L}: falta a fonte"); fontes = []
        urls = [str(f.get("url", "")).strip() if isinstance(f, dict) else "" for f in fontes]
        for f, u in zip(fontes, urls):
            if not u.startswith("https://") or not urllib.parse.urlparse(u).hostname: E.append(f"{L}: fonte sem endereço https:// ({u or 'vazio'})")
            elif not host_ok(u, doms): E.append(f"{L}: {urllib.parse.urlparse(u).hostname} não está no FONTES-CONFIAVEIS.md")
            if not isinstance(f, dict) or not str(f.get("nome", "")).strip() or RX_MOLDE.search(str(f.get("nome", ""))):
                E.append(f"{L}: fonte sem nome")
        if (saude_dest or RX_SAUDE.search(norm(tudo))) and not any(saude_ok(u) for u in urls):
            E.append(f"{L}: assunto de saúde precisa de fonte do Ministério da Saúde, da Fiocruz ou da OPAS/OMS")
        if RX_REMEDIO.search(tudo): E.append(f"{L}: o app nunca indica remédio (oriente a procurar a Unidade de Saúde)")
        elif RX_REMEDIO_LEVE.search(tudo): W.append(f"{L}: fala de remédio; confira que não indica nenhum")
        if re.search(r"\d", tudo) and len({u for u in urls if u}) < 2:
            W.append(f"{L}: tem número ou data; a regra pede duas fontes que concordem")
        # repetidas
        nq = norm(q)
        if nq:
            for onde, outra in A["perguntas"] + novas_vistas:
                r = difflib.SequenceMatcher(None, nq, norm(outra)).ratio()
                if r >= 0.9: E.append(f'{L}: igual ou quase igual a {onde} ("{outra[:60]}")'); break
                if r >= 0.75: W.append(f'{L}: parecida com {onde} ("{outra[:60]}")'); break
            novas_vistas.append((f"{os.path.basename(arq)} {L}", q))
    return dest, E, W

def verificar(arqs, salvar=True):
    A, doms, vistas, linhas, total_e = app(), dominios(), [], ["# Relatório do gerador de perguntas", ""], 0
    for arq in arqs:
        dest, E, W = conferir(arq, A, doms, vistas)
        total_e += len(E)
        nome = os.path.basename(arq)
        print(f"{nome}: {len(E)} erro(s), {len(W)} aviso(s)")
        linhas.append(f"## {nome} ({len(E)} erro(s), {len(W)} aviso(s))")
        for m in E: print("  ERRO: " + m); linhas.append("- ERRO: " + m)
        for m in W: print("  aviso: " + m); linhas.append("- aviso: " + m)
        linhas.append("")
    if salvar:
        os.makedirs(NOVAS, exist_ok=True)
        open(os.path.join(NOVAS, "relatorio.md"), "w", encoding="utf8").write("\n".join(linhas))
    return total_e

# ----------------------------------------------------------------- gravação no dados.js
def _fim_lista(s, i):
    """s[i] é '[' ou '{'; devolve a posição do fechamento correspondente (pula textos e comentários)."""
    pilha, n = [], len(s)
    while i < n:
        c = s[i]
        if c in "\"'`":
            j = i + 1
            while s[j] != c: j += 2 if s[j] == "\\" else 1
            i = j
        elif s.startswith("/*", i): i = s.index("*/", i) + 1
        elif s.startswith("//", i): i = s.index("\n", i)
        elif c in "[{": pilha.append(c)
        elif c in "]}":
            pilha.pop()
            if not pilha: return i
        i += 1
    raise ValueError("lista sem fechamento")

def _inserir(s, inicio, itens):
    """Acrescenta os itens no fim da lista que começa em s[inicio] == '['."""
    fim = _fim_lista(s, inicio)
    corpo = s[inicio + 1:fim].strip()
    return s[:fim] + ("," if corpo else "") + "\n" + ",\n".join(itens) + s[fim:]

def _js(v): return json.dumps(v, ensure_ascii=False)

def _categoria(url, fontes):
    h = urllib.parse.urlparse(url).hostname
    for f in fontes:
        if len(f) > 3 and urllib.parse.urlparse(f[3]).hostname == h: return f[0]
    if saude_ok(url) and not h.endswith(".br"): return "Saúde internacional"
    return "Órgãos oficiais brasileiros" if h.endswith("gov.br") else "Museus e institutos de pesquisa" if h.endswith(".br") else "Zoologia e história da ciência"

def aplicar(arq):
    if verificar([arq]): print("Há erros: nada foi gravado."); return 1
    A, d = app(), json.load(open(arq, encoding="utf8"))
    tipo, chave = destino(d["destino"], A)
    caminho = os.path.join(RAIZ, "dados.js")
    s = original = open(caminho, encoding="utf8").read()
    itens = []
    for k, p in enumerate(d["perguntas"]):
        alts = [p["certa"].strip()] + [x.strip() for x in p["erradas"]]
        if tipo == "QZ":
            pos = (A["nqz"] + k) % len(alts); alts.insert(pos, alts.pop(0))
            itens.append(_js([p["q"].strip(), alts, pos, p["e"].strip()]))
        else: itens.append(_js([p["q"].strip(), alts, p["e"].strip()]))
    if tipo == "QZ": ini = s.index("[", s.index("const QZ="))
    else:
        bloco = s.index("const " + tipo + "={")
        m = re.compile(r'(^|\n)\s*(' + re.escape(chave) + r'|"' + re.escape(chave) + r'")\s*:\s*\[').search(s, bloco)
        ini = m.end() - 1
    s = _inserir(s, ini, itens)
    novas_f, urls = [], set()
    for p in d["perguntas"]:
        for f in p["fontes"]:
            u = f["url"].strip()
            if u in s or u in urls: continue
            urls.add(u)
            novas_f.append(_js([_categoria(u, A["fontes"]), f["nome"].strip(), str(f.get("para") or "perguntas novas").strip(), u]))
    if novas_f: s = _inserir(s, s.index("[", s.index("const FONTES_MAIS=")), novas_f)
    open(caminho, "w", encoding="utf8").write(s)
    depois = app()
    antes_n = len(A["perguntas"]); esperado = antes_n + len(itens)
    r = subprocess.run(["node", "validar-banco.js"], cwd=RAIZ, capture_output=True, text=True)
    if r.returncode or len(depois["perguntas"]) != esperado:
        open(caminho, "w", encoding="utf8").write(original)
        print("O validar-banco.js reclamou; o dados.js voltou ao que era:\n" + (r.stdout + r.stderr)[-1500:]); return 1
    os.makedirs(os.path.join(NOVAS, "aplicadas"), exist_ok=True)
    shutil.move(arq, os.path.join(NOVAS, "aplicadas", os.path.basename(arq)))
    print(f"{len(itens)} pergunta(s) gravada(s) em {tipo}{'.' + chave if chave else ''}; {len(novas_f)} fonte(s) nova(s) em FONTES_MAIS.")
    print(r.stdout.strip().splitlines()[-1])
    return 0

# ----------------------------------------------------------------- molde em branco
def molde(n=1):
    return [{"q": "ESCREVA o enunciado (frase curta; explique o termo técnico na 1ª vez)",
             "certa": "ESCREVA a resposta certa", "erradas": ["ESCREVA errada 1", "ESCREVA errada 2", "ESCREVA errada 3"],
             "e": "ESCREVA a explicação curta (por que a certa está certa)",
             "fontes": [{"nome": "ESCREVA o nome da fonte", "para": "assunto", "url": "https://"}],
             "onde_conferi": "ESCREVA em que parte da fonte está o fato"} for _ in range(n)]

def modelo(nome, n):
    A = app(); dest = destino(nome, A)
    if not dest: print(f'Destino "{nome}" não existe. Grupos: {", ".join(A["grupos"])}; "final"; abas: {"; ".join(A["abas"])}'); return 1
    os.makedirs(NOVAS, exist_ok=True)
    arq = os.path.join(NOVAS, f"{norm(dest[1] or 'final').replace(' ', '-')}_{datetime.date.today()}.json")
    if os.path.exists(arq): print("Já existe: " + arq); return 1
    json.dump({"destino": dest[1] or "final", "perguntas": molde(n)}, open(arq, "w", encoding="utf8"), ensure_ascii=False, indent=2)
    print("Molde criado: " + os.path.relpath(arq, RAIZ)); return 0

# ----------------------------------------------------------------- teste do próprio gerador
def teste():
    global RAIZ, NOVAS
    real, falhas = RAIZ, []
    with tempfile.TemporaryDirectory() as tmp:
        for f in ("util.js", "dados.js", "banco-proprio.js", "validar-banco.js", "FONTES-CONFIAVEIS.md"):
            if os.path.exists(os.path.join(real, f)): shutil.copy(os.path.join(real, f), tmp)
        RAIZ, NOVAS = tmp, os.path.join(tmp, "build", "novas"); os.makedirs(NOVAS)
        bom = {"q": "Pergunta de teste do gerador sobre o boto", "certa": "Certa de teste", "erradas": ["Errada um", "Errada dois", "Errada três"],
               "e": "Explicação de teste.", "fontes": [{"nome": "INPA", "para": "teste", "url": "https://www.gov.br/inpa/teste-gerador"}],
               "onde_conferi": "página de teste"}
        casos = {  # nome: (destino, alterações, trecho esperado no erro; None = sem erro)
            "bom": ("mamifero", {}, None),
            "molde": ("ave", molde(1)[0], "texto do molde"),
            "repetida": ("ave", {"q": A0["perguntas"][0][1]} if (A0 := app()) else {}, "quase igual"),
            "fonte fora": ("ave", {"fontes": [{"nome": "Blog", "url": "https://www.todamateria.com.br/x"}]}, "não está no FONTES"),
            "saude": ("verminoses", {"q": "Pergunta de teste do gerador sobre lombrigas"}, "assunto de saúde"),
            "remedio": ("mamifero", {"e": "Tome albendazol."}, "nunca indica remédio"),
            "alternativas": ("final", {"erradas": ["Certa de teste", "Outra"]}, "repetidas"),
            "anteriores": ("final", {"erradas": ["A", "B", "Todas as anteriores"]}, "anteriores"),
            "destino": ("tubarao", {}, "não existe"),
        }
        A, doms = app(), dominios()
        for nome, (dest, mud, esperado) in casos.items():
            arq = os.path.join(NOVAS, nome.replace(" ", "-") + ".json")
            json.dump({"destino": dest, "perguntas": [dict(bom, **mud)]}, open(arq, "w", encoding="utf8"), ensure_ascii=False)
            _, E, _ = conferir(arq, A, doms, [])
            if (esperado is None) != (not E) or (esperado and not any(esperado in e for e in E)):
                falhas.append(f"caso {nome}: esperado {esperado!r}, veio {E}")
        # aplicar em cada tipo de destino (grupo, final, aba) e conferir que entrou
        for i, dest in enumerate(("mamifero", "final", "verminoses")):
            arq = os.path.join(NOVAS, f"aplicar{i}.json")
            p = dict(bom, q=f"Pergunta de teste número {i} do gerador, {dest}", fontes=[{"nome": "Fiocruz", "url": f"https://portal.fiocruz.br/teste-{i}"}])
            json.dump({"destino": dest, "perguntas": [p]}, open(arq, "w", encoding="utf8"), ensure_ascii=False)
            with open(os.devnull, "w") as nada:
                velho, sys.stdout = sys.stdout, nada
                try: ok = aplicar(arq) == 0
                finally: sys.stdout = velho
            if not ok: falhas.append(f"aplicar em {dest} falhou")
        B = app()
        if len(B["perguntas"]) != len(A["perguntas"]) + 3: falhas.append("aplicar: o número de perguntas não aumentou 3")
        if B["tam"]["BANK4"]["mamifero"] != A["tam"]["BANK4"]["mamifero"] + 1: falhas.append("aplicar: não entrou no BANK4.mamifero")
        if B["nqz"] != A["nqz"] + 1: falhas.append("aplicar: não entrou no QZ")
        if len(B["fontes"]) != len(A["fontes"]) + 3: falhas.append("aplicar: fontes novas não entraram em FONTES_MAIS")
    RAIZ, NOVAS = real, os.path.join(real, "build", "novas")
    for f in falhas: print("FALHOU: " + f)
    print(f"teste do gerador: {len(casos) + 3} casos, {len(falhas)} falha(s)")
    return 1 if falhas else 0

if __name__ == "__main__":
    a = sys.argv[1:]; cmd = a[0] if a else ""
    if cmd == "modelo" and len(a) >= 2: sys.exit(modelo(a[1], int(a[2]) if len(a) > 2 else 5))
    if cmd == "verificar":
        arqs = a[1:] or sorted(os.path.join(NOVAS, f) for f in os.listdir(NOVAS) if f.endswith(".json")) if os.path.isdir(NOVAS) or a[1:] else []
        if not arqs: print("Nenhum rascunho em build/novas/."); sys.exit(0)
        e = verificar(arqs); print("Sem erros." if not e else f"{e} erro(s)."); sys.exit(1 if e else 0)
    if cmd == "aplicar" and len(a) == 2: sys.exit(aplicar(a[1]))
    if cmd == "teste": sys.exit(teste())
    print(__doc__); sys.exit(1)
