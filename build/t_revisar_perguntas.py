#!/usr/bin/env python3
"""Teste guardado da revisão das perguntas (build/revisar_perguntas.py).
Para cada aviso: um caso que deve gerá-lo e um parecido que não deve (alarme falso).
Também confere as fichas (formato e sugestões) numa pasta temporária e o pente-fino no banco real.
Uso: python3 build/t_revisar_perguntas.py"""
import json, os, sys, tempfile
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import revisar_perguntas as R

falhas, n = [], 0
def ok(cond, nome):
    global n; n += 1
    if not cond: falhas.append(nome)

def tipos(q, o, a=0, e="Explicação."): return {t for t, _ in R.checar(q, o, a, e)}

# (nome, enunciado, alternativas, posição da certa, explicação, aviso esperado ou None)
CASOS = [
    ("longa", "Como as esponjas se alimentam?", ["Filtrando a água que passa pelos poros do corpo", "Caçando", "Raspando", "Mordendo"], 0, "x", "longa"),
    ("longa não", "Como as esponjas se alimentam?", ["Filtrando a água", "Caçando presas", "Raspando rochas", "Mordendo algas"], 0, "x", None),
    ("absoluta", "Onde vivem os peixes?", ["Na água", "Sempre em terra", "Só no ar", "Nunca na água"], 0, "x", "absoluta"),
    ("absoluta não", "Onde vivem os peixes?", ["Só na água", "Sempre em terra", "No ar", "Nunca na água"], 0, "x", None),
    ("eco", "Qual estrutura respiratória dos peixes retira oxigênio da água?", ["Brânquias, a estrutura respiratória", "Pulmões", "Pele", "Traqueias"], 0, "x", "eco"),
    ("eco não", "Qual estrutura respiratória dos peixes retira oxigênio da água?", ["Brânquias, a estrutura respiratória", "Pulmões, outra estrutura", "Pele, uma estrutura fina", "Traqueias finas"], 0, "x", None),
    ("repetida", "Qual é a ave?", ["Pato", "pato ", "Sapo", "Cobra"], 0, "x", "repetida"),
    ("repetida não", "Qual é a ave?", ["Pato", "Rato", "Sapo", "Cobra"], 0, "x", None),
    ("anteriores", "Qual é o mamífero?", ["Boto", "Pirarucu", "Tracajá", "Todas as anteriores"], 0, "x", "anteriores"),
    ("anteriores não", "Qual é o mamífero?", ["Boto", "Pirarucu", "Tracajá", "Todas as aves"], 0, "x", None),
    ("negacao", "Qual destes animais não é um mamífero?", ["Pirarucu", "Boto", "Onça", "Morcego"], 0, "x", "negacao"),
    ("negacao maiúscula", "Qual destes animais NÃO é um mamífero?", ["Pirarucu", "Boto", "Onça", "Morcego"], 0, "x", None),
    ("negacao característica", "Qual réptil não tem patas?", ["Cobra", "Jacaré", "Tartaruga", "Lagarto"], 0, "x", None),
    ("sem_e", "Qual é a ave?", ["Pato", "Rato", "Sapo", "Cobra"], 0, " ", "sem_e"),
    ("certa noutra posição", "Onde vivem os peixes?", ["Sempre em terra", "Só no ar", "Na água", "Nunca na água"], 2, "x", "absoluta"),
]
for nome, q, o, a, e, esp in CASOS:
    t = tipos(q, o, a, e)
    if esp and esp != "longa": t.discard("longa")  # alternativa certa comprida de propósito no caso
    ok((t == {esp}) if esp else not t, f"caso '{nome}': esperado {esp}, veio {sorted(t)}")

ok(R.assunto("aba:Desafio da fauna do Pará") == "fauna-do-para", "assunto da aba da fauna do Pará")
ok(R.assunto("aba:Desafio dos ciclos") == "ciclos" and R.assunto("ave") == "ave", "assunto de aba e de grupo")

# fichas numa pasta temporária
with tempfile.TemporaryDirectory() as tmp:
    velho, R.FICHAS = R.FICHAS, tmp
    boa = {"_leia": "teste", "teoria": [{"palavras": ["baleia", "respira"], "ideia": "A baleia respira por brânquias",
                                        "por_que": "Baleia é mamífero: respira por pulmões.", "fonte": "https://exemplo"}]}
    ruim = {"teoria": [{"palavras": ["só uma"], "ideia": "x"}, {"palavras": ["xx", "yy"], "ideia": "y", "por_que": "z"}]}
    json.dump(boa, open(os.path.join(tmp, "mamifero.json"), "w"), ensure_ascii=False)
    json.dump(ruim, open(os.path.join(tmp, "ave.json"), "w"), ensure_ascii=False)
    json.dump({"outro": 1}, open(os.path.join(tmp, "textos.json"), "w"))
    R.ficha.cache_clear()
    ok(R.fichas_existentes() == ["ave", "mamifero"], "a ficha dos textos não entra como ficha de perguntas")
    ok(R.checar_ficha("mamifero") == [], "ficha boa sem erro")
    ok(len(R.checar_ficha("ave")) == 2, "ficha ruim: 2 erros (palavras/por_que e fonte)")
    q, o = "Como a baleia respira?", ["Por pulmões", "Pela pele", "Por traqueias", "Pelo bico"]
    ok([t["ideia"] for t in R.ideias("mamifero", q, "", o)] == [boa["teoria"][0]["ideia"]], "sugestão da ficha do grupo")
    ok(len(R.ideias("final", q, "", o)) == 1, "Desafio final usa todas as fichas")
    ok(R.ideias("mamifero", "Como a baleia nada?", "", o) == [], "1 palavra só não liga a ideia")
    ok(R.ideias("mamifero", q, "", o[:3] + ["A baleia respira por brânquias"]) == [], "ideia já presente não é sugerida")
    ok(R.ideias("mamifero", q, "", o[:3] + ["Por brânquias"]) == [], "ideia já presente com outras palavras não é sugerida")
    R.FICHAS = velho; R.ficha.cache_clear()

    # pente-fino no banco real, com o relatório na pasta temporária
    tot, cont, _ = R.pente_fino(saida=os.path.join(tmp, "p.md"))
    ok(tot >= 700, f"pente-fino leu {tot} perguntas (esperado 700 ou mais)")
    ok(open(os.path.join(tmp, "p.md"), encoding="utf-8").read().startswith("# Revisão das perguntas"), "relatório gravado")

# perguntas novas: o novas.py verificar usa a mesma revisão
import novas
with tempfile.TemporaryDirectory() as tmp:
    arq = os.path.join(tmp, "r.json"); p = {"q": "Pergunta de teste da revisão sobre onde vivem os peixes", "certa": "Na água",
        "erradas": ["Sempre em terra", "Só no ar", "Nunca na água"], "e": "Teste.", "fontes": [{"nome": "x", "url": "https://x"}], "onde_conferi": "x"}
    json.dump({"destino": "peixe", "perguntas": [p]}, open(arq, "w"), ensure_ascii=False)
    _, _, W = novas.conferir(arq, novas.app(), novas.dominios(), [])
    ok(any("sempre/nunca/só" in w for w in W), "novas.py verificar avisa pista 'sempre/nunca/só'")

for f in falhas: print("FALHOU: " + f)
print(f"revisão das perguntas: {n} verificações, {len(falhas)} falha(s).")
sys.exit(1 if falhas else 0)
