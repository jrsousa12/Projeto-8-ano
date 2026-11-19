#!/bin/bash
# Comando único antes de publicar no main: gera os arquivos automáticos e roda todas as conferências.
# Uso (na pasta do projeto): bash build/tudo.sh
# Ordem: tema claro → versão do cache → arquivo único → sintaxe → perguntas → gerador → revisões → todos os testes de navegador.
# Os arquivos gerados (tema-claro.css, sw.js, animais-8ano.html) ficam prontos para ir no commit;
# o robô do GitHub gera os mesmos no main, então não há conflito.
cd "$(dirname "$0")/.." || exit 1
falhou=0

etapa() {  # etapa "nome" comando...  → mostra só a última linha; na falha, as linhas de erro
  local nome="$1"; shift
  local saida
  if saida=$("$@" 2>&1); then
    echo "✔ $nome: $(echo "$saida" | tail -1 | cut -c1-160)"
  else
    falhou=1
    echo "✘ $nome:"
    # testes: o nome do teste (linha "•") e a verificação que falhou; outros erros: o fim da saída
    if echo "$saida" | grep -q "FALHOU"; then
      echo "$saida" | awk '/^•/{t=$0; next} /FALHOU/{if(t){print t; t=""} print} END{}' ; echo "$saida" | tail -1
    else
      echo "$saida" | tail -15
    fi | head -30 | cut -c1-200 | sed 's/^/   /'
  fi
}

etapa "tema claro" python3 build/tema_claro.py
etapa "versão do cache" python3 build/versao.py
etapa "arquivo único" python3 build/arquivo-unico.py
sintaxe() { for f in *.js testes/*.js build/*.js; do node --check "$f" || return 1; done; echo "todos os .js sem erro"; }
etapa "sintaxe" sintaxe
etapa "perguntas" node validar-banco.js
etapa "gerador de perguntas" python3 build/novas.py teste
etapa "motor de revisão dos textos" node build/t_revisar_textos.js
etapa "revisão das perguntas" python3 build/t_revisar_perguntas.py
etapa "motor das ilustrações" python3 build/t_imagens.py
etapa "testes de navegador" node testes/testes.js

gerados=$(git status --short tema-claro.css sw.js animais-8ano.html | cut -c4-)
[ -n "$gerados" ] && echo "Arquivos gerados que mudaram (vão no commit): $(echo $gerados)"
if [ $falhou = 0 ]; then echo; echo "Tudo certo."; else echo; echo "Há falhas (veja acima)."; exit 1; fi
