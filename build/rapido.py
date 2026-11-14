#!/usr/bin/env python3
"""Conferência rápida: olha o que mudou desde o origin/main e roda só o necessário.

Uso (na pasta do projeto):
  python3 build/rapido.py           → roda as conferências e os testes ligados ao que mudou
  python3 build/rapido.py --listar  → só mostra o plano, sem rodar
  python3 build/rapido.py --tudo    → roda a bateria completa (antes de publicar)

Sempre roda: node --check nos .js mudados e node validar-banco.js.
Se algum estilo-*.css mudou, roda antes o build/tema_claro.py (gera o tema-claro.css).
Arquivo que não está no MAPA → roda todos os testes (seguro, mas mais lento).
"""
import fnmatch, os, subprocess, sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TODOS = "todos"

# o que mudou → arquivos de teste (testes/t_*.js). Lista vazia = nenhum teste de navegador.
# A primeira regra que combina vale. Arquivo novo do app ou de teste: acrescente aqui.
MAPA = [
    (["*.md", "LEIA-ME.txt", ".github/*", ".claude/*", ".gitignore"], []),
    (["testes/apoio.js", "testes/testes.js"], TODOS),
    (["testes/t_*.js"], "ele mesmo"),
    (["validar-banco.js"], []),
    (["banco-proprio.js", "editor.js", "editor.html", "editor.css"], ["t_editor"]),
    (["jogos.js"], ["t_jogos"]),
    (["conteudo.js"], ["t_jogos", "t_telas", "t_progresso"]),
    (["extras.js", "simulacoes.js"], ["t_conteudo", "t_telas"]),
    (["arte.js"], ["t_telas", "t_jogos", "t_offline"]),
    (["img/*"], ["t_jogos", "t_offline"]),
    (["instalar.js"], ["t_telas", "t_offline"]),
    (["progresso.js", "progresso-dados.js"], ["t_progresso", "t_jogos", "t_editor"]),
    (["nivel.js"], ["t_progresso", "t_jogos"]),
    (["tema-claro.css", "build/tema_claro.py"], ["t_telas"]),
    (["animais-8ano.html", "build/arquivo-unico.py", "build/versao.py"], ["t_offline"]),
    (["build/rapido.py", "build/buscar.js", "build/tudo.sh"], []),
    # dados.js, util.js, app.js, estilo-*.css, index.html, sw.js, manifesto e ícones: usados por tudo
    (["dados.js", "util.js", "app.js", "estilo-*.css", "index.html", "sw.js", "manifest.webmanifest", "icon-*"], TODOS),
]


def sh(cmd):
    return subprocess.run(cmd, cwd=RAIZ, capture_output=True, text=True)


def mudados():
    if sh(["git", "rev-parse", "--verify", "-q", "origin/main"]).returncode:
        sys.exit("Não achei o origin/main. Rode antes: git fetch origin main")
    diff = sh(["git", "diff", "--name-only", "origin/main"]).stdout.split()
    novos = sh(["git", "ls-files", "--others", "--exclude-standard"]).stdout.split()
    return sorted(set(diff + novos))


def plano(arquivos):
    """Devolve (lista de testes ou TODOS, arquivos fora do mapa)."""
    testes, fora = set(), []
    for f in arquivos:
        regra = next((alvo for padroes, alvo in MAPA if any(fnmatch.fnmatch(f, p) for p in padroes)), None)
        if regra is None:
            fora.append(f)
            regra = TODOS
        if regra == TODOS:
            return TODOS, fora
        if regra == "ele mesmo":
            regra = [os.path.basename(f)[:-3]] if os.path.exists(os.path.join(RAIZ, f)) else TODOS
            if regra == TODOS:
                return TODOS, fora
        testes.update(regra)
    return sorted(testes), fora


def etapa(nome, cmd):
    r = sh(cmd)
    saida = (r.stdout + r.stderr).strip().splitlines()
    if r.returncode == 0:
        print(f"✔ {nome}: {saida[-1] if saida else 'ok'}")
        return True
    print(f"✘ {nome}:")
    # só as falhas, cada uma com o nome do teste (linha "•") antes; sem falha marcada, o fim da saída
    ruins, teste = [], None
    for l in saida:
        if l.startswith("•"):
            teste = l
        elif "FALHOU" in l:
            if teste:
                ruins.append(teste)
                teste = None
            ruins.append(l)
    ruins = (ruins + saida[-1:]) if ruins else saida[-15:]
    for l in ruins[-30:]:
        print("   " + l[:200])
    return False


def main():
    listar, tudo = "--listar" in sys.argv, "--tudo" in sys.argv
    arquivos = [f for f in mudados() if os.path.exists(os.path.join(RAIZ, f)) or not f.endswith(".js")]
    testes, fora = (TODOS, []) if tudo else plano(arquivos)
    js = [f for f in arquivos if f.endswith(".js") and os.path.exists(os.path.join(RAIZ, f))]
    print("Mudou desde o origin/main: " + (", ".join(arquivos) if arquivos else "nada"))
    if fora:
        print("Fora do MAPA (por isso roda tudo): " + ", ".join(fora))
    print("Testes de navegador: " + ("todos" if testes == TODOS else (", ".join(testes) or "nenhum")))
    if listar:
        return 0
    ok = True
    if any(a.startswith("estilo-") for a in arquivos) or tudo:
        ok &= etapa("tema claro", ["python3", "build/tema_claro.py"])
    for f in js:
        ok &= etapa("sintaxe " + f, ["node", "--check", f])
    ok &= etapa("perguntas", ["node", "validar-banco.js"])
    if testes:
        ok &= etapa("testes de navegador", ["node", "testes/testes.js"] + ([] if testes == TODOS else testes))
    print("\nTudo certo." if ok else "\nHá falhas (veja acima).")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
