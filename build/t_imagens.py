#!/usr/bin/env python3
"""Teste guardado do motor das ilustrações (build/imagens.py).
Trabalha numa cópia temporária do projeto (variável IMAGENS_RAIZ); o projeto real só é lido.
Uso: python3 build/t_imagens.py"""
import json, os, random, re, shutil, subprocess, sys, tempfile

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(AQUI)
falhas, n = [], 0


def ok(cond, nome):
    global n; n += 1
    if not cond: falhas.append(nome)


def roda(args, raiz):
    env = dict(os.environ, IMAGENS_RAIZ=raiz)
    return subprocess.run(["python3", os.path.join(AQUI, "imagens.py")] + args, capture_output=True, text=True, env=env)


def mapa(raiz, arq, nome):
    return json.loads(re.search(r"const " + nome + r"=(\{.*?\});", open(os.path.join(raiz, arq), encoding="utf-8").read()).group(1))


# 1. o projeto real não tem erro
r = roda(["listar"], RAIZ)
ok(r.returncode == 0 and "0 erro(s)" in r.stdout, "listar no projeto real sem erro")

with tempfile.TemporaryDirectory() as tmp:
    for f in ("dados.js", "conteudo.js", "jogos.js"): shutil.copy(os.path.join(RAIZ, f), tmp)
    shutil.copytree(os.path.join(RAIZ, "img"), os.path.join(tmp, "img"))
    from PIL import Image
    random.seed(1)
    grande = os.path.join(tmp, "grande.png")  # imagem grande e "difícil" (ruído), maior que o limite
    Image.frombytes("RGB", (1200, 900), bytes(random.randrange(256) for _ in range(1200 * 900 * 3))).save(grande)
    simples = os.path.join(tmp, "simples.png")
    Image.new("RGBA", (800, 1000), (40, 160, 90, 255)).save(simples)

    # 2. adicionar e ligar ao jogo "Quem é este?"
    r = roda(["adicionar", simples, "a-polvo-novo", "--emj", "polvo"], tmp)
    novo = os.path.join(tmp, "img", "animais", "a-polvo-novo.webp")
    ok(r.returncode == 0 and os.path.exists(novo), "adicionar grava o .webp")
    if os.path.exists(novo):
        im = Image.open(novo)
        ok(im.format == "WEBP" and max(im.size) <= 420 and os.path.getsize(novo) <= 40 * 1024, "convertida, reduzida e até 40 KB")
    m = mapa(tmp, "jogos.js", "EMJIMG")
    ok(m.get("polvo") == "a-polvo-novo" and m.get("lula") == "a-lula", "EMJIMG ligado sem estragar o resto")
    ok(subprocess.run(["node", "--check", os.path.join(tmp, "jogos.js")]).returncode == 0, "jogos.js continua válido")
    r = roda(["listar"], tmp)
    sem_uso = open(os.path.join(tmp, "revisao", "imagens.md"), encoding="utf-8").read().split("sem uso:")[1].split(";")[0]
    ok(r.returncode == 0 and "a-polvo" not in sem_uso, "imagem antiga continua em uso (jogo de classificar)")
    m = mapa(tmp, "jogos.js", "ANIMG"); m.pop("Polvo")
    s = open(os.path.join(tmp, "jogos.js"), encoding="utf-8").read()
    open(os.path.join(tmp, "jogos.js"), "w", encoding="utf-8").write(re.sub(r"const ANIMG=\{.*?\};", lambda _: "const ANIMG=" + json.dumps(m, ensure_ascii=False) + ";", s, count=1))
    r = roda(["listar"], tmp)
    ok(r.returncode == 0 and "a-polvo" in open(os.path.join(tmp, "revisao", "imagens.md"), encoding="utf-8").read().split("sem uso:")[1].split(";")[0], "imagem antiga aparece como sem uso")

    # 3. fauna do Pará
    r = roda(["adicionar", simples, "a-boto-novo", "--pa", "boto"], tmp)
    ok(r.returncode == 0 and mapa(tmp, "conteudo.js", "PAIMG").get("boto") == "a-boto-novo", "PAIMG ligado")
    ok(subprocess.run(["node", "--check", os.path.join(tmp, "conteudo.js")]).returncode == 0, "conteudo.js continua válido")

    # 3b. jogo de classificar (nome como no AN)
    r = roda(["adicionar", simples, "a-tilapia", "--an", "Tilápia"], tmp)
    m = mapa(tmp, "jogos.js", "ANIMG")
    ok(r.returncode == 0 and m.get("Tilápia") == "a-tilapia" and m.get("Lula") == "a-lula", "ANIMG ligado sem estragar o resto")
    r = roda(["listar"], tmp)
    ok(r.returncode == 0 and "49 de 191" in open(os.path.join(tmp, "revisao", "imagens.md"), encoding="utf-8").read(), "listar conta o jogo de classificar")

    # 4. grupo: tamanho da ilustração grande
    r = roda(["adicionar", simples, "p-porifero", "--substituir"], tmp)
    im = Image.open(os.path.join(tmp, "img", "animais", "p-porifero.webp"))
    ok(r.returncode == 0 and im.size[0] <= 534 and im.size[1] <= 720, "ilustração do grupo no tamanho certo")

    # 5. recusas (nada muda)
    antes = sorted(os.listdir(os.path.join(tmp, "img", "animais")))
    for args, nome in [
        ([simples, "a-polvo-novo"], "já existe sem --substituir"),
        ([simples, "A-Polvo"], "nome inválido"),
        ([simples, "g-dragao"], "grupo desconhecido"),
        ([simples, "a-x", "--pa", "dragao"], "chave da fauna desconhecida"),
        ([simples, "a-x", "--emj", "dragao"], "animal do jogo desconhecido"),
        ([simples, "g-porifero", "--pa", "boto"], "--pa em grupo"),
        ([simples, "a-x", "--an", "tilápia"], "animal do classificar escrito diferente"),
        ([os.path.join(tmp, "nao-existe.png"), "a-x"], "arquivo inexistente"),
    ]:
        r = roda(["adicionar"] + args, tmp)
        ok(r.returncode != 0 and "Erro" in (r.stdout + r.stderr), "recusa: " + nome)
    ok(sorted(os.listdir(os.path.join(tmp, "img", "animais"))) == antes, "recusas não gravam nada")

    # 6. imagem muito difícil: reduz ou recusa, nunca grava acima do limite
    r = roda(["adicionar", grande, "a-ruido"], tmp)
    arq = os.path.join(tmp, "img", "animais", "a-ruido.webp")
    ok(not os.path.exists(arq) or os.path.getsize(arq) <= 40 * 1024, "nunca grava acima do limite")

    # 7. imagem que falta vira erro
    os.remove(os.path.join(tmp, "img", "animais", "g-molusco.webp"))
    r = roda(["listar"], tmp)
    ok(r.returncode == 1 and "g-molusco" in r.stdout, "imagem que falta é erro")

if falhas:
    print("\n".join("FALHOU: " + f for f in falhas)); print(f"{len(falhas)} de {n} verificações falharam.")
    sys.exit(1)
print(f"motor das ilustrações: {n} verificações certas.")
