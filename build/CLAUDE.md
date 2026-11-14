# Regras da pasta build/ (ferramentas)

## Conferência rápida — `python3 build/rapido.py`

- Olha o que mudou desde o `origin/main` (commits + arquivos não enviados) e roda só o necessário.
- `--listar` mostra o plano sem rodar; `--tudo` roda a bateria completa.
- Sempre roda: `node --check` nos `.js` mudados e `node validar-banco.js`. Se algum `estilo-*.css` mudou, roda antes o `tema_claro.py`.
- A regra "o que mudou → testes" vive no `MAPA` do `rapido.py` (a primeira regra que combina vale):

| Mudou | Testes de navegador |
|---|---|
| `*.md`, `.github/`, `.claude/`, `validar-banco.js`, ferramentas de `build/` | nenhum |
| `banco-proprio.js`, `editor.*` | `t_editor` |
| `jogos.js` | `t_jogos` |
| `conteudo.js` | `t_jogos`, `t_telas`, `t_progresso` |
| `extras.js`, `simulacoes.js` | `t_conteudo`, `t_telas` |
| `arte.js` | `t_telas`, `t_jogos`, `t_offline` |
| `img/` | `t_jogos`, `t_offline` |
| `instalar.js` | `t_telas`, `t_offline` |
| `progresso.js`, `progresso-dados.js` | `t_progresso`, `t_jogos`, `t_editor` |
| `nivel.js` | `t_progresso`, `t_jogos` |
| `tema-claro.css`, `tema_claro.py` | `t_telas` |
| `animais-8ano.html`, `arquivo-unico.py`, `versao.py` | `t_offline` |
| um `testes/t_*.js` | ele mesmo |
| `dados.js`, `util.js`, `app.js`, `estilo-*.css`, `index.html`, `sw.js`, manifesto, ícones, `testes/apoio.js`, `testes/testes.js` | todos |
| arquivo fora do mapa | todos (seguro, mas mais lento) |

- Arquivo novo do app, de teste ou ferramenta: acrescente-o ao `MAPA` e a esta tabela.

## Busca no app — `node build/buscar.js palavra [outra]`

- Carrega `util.js`, `dados.js` e `banco-proprio.js` como o navegador e procura em todos os textos; cada pergunta conta como um item (as palavras podem estar no enunciado e na resposta).
- Mostra onde está (ex.: `QZ[24][0]`, `G[2].k`, `MQ0["Desafio dos ciclos"][8][0]`) e um trecho; depois procura linha a linha nos outros `.js`/`.html` e no `FONTES-CONFIAVEIS.md`.
- `--tudo` mostra o item inteiro; `--max N` muda o limite (20); entre aspas = frase exata.
- Não procura no `animais-8ano.html` nem no `sw.js` (gerados).

## Gerador de perguntas — `python3 build/novas.py`

- `modelo <destino> [n]` cria `build/novas/<destino>_DATA.json`; destino = id do grupo, `final` ou parte do nome de um desafio das abas.
- Campos: `q`, `certa`, `erradas` (3), `e`, `fontes` (`nome`, `para`, `url`), `onde_conferi`.
- `verificar [arq]`: erro bloqueia (molde não preenchido, fonte fora do `FONTES-CONFIAVEIS.md`, saúde sem MS/Fiocruz/OPAS, remédio, repetida, alternativas repetidas ou "todas/nenhuma das anteriores"); aviso alerta (frase > 25 palavras, certa muito mais comprida, número com uma fonte só, pergunta parecida). Relatório em `build/novas/relatorio.md` (fora do git).
- `aplicar arq`: grava em `BANK4.<grupo>`, `QZ` (posição da certa varia) ou `MQX.<aba>`; fonte nova vai para `FONTES_MAIS`; roda o `validar-banco.js` e desfaz se falhar; o rascunho vai para `build/novas/aplicadas/`.
- `teste`: confere o gerador numa cópia temporária (rodado pelo `rapido.py` quando ele muda e pelo `tudo.sh`).

## Comando único — `bash build/tudo.sh`

- Ordem: `tema_claro.py` → `versao.py` → `arquivo-unico.py` → sintaxe de todos os `.js` → `validar-banco.js` → teste do gerador → todos os testes de navegador.
- O arquivo único é gerado antes dos testes, para o `t_offline` testar a versão nova.
- Os gerados (`tema-claro.css`, `sw.js`, `animais-8ano.html`) saem iguais aos do robô do GitHub; se mudarem, vão no commit.
- Termina em "Tudo certo." ou "Há falhas" (com o teste e a verificação que falharam).

## Scripts de geração (os mesmos que o robô roda no `main`)

- `tema_claro.py`: gera o `tema-claro.css` a partir dos `estilo-*.css` (lista `ARQS`, na ordem do `index.html`).
- `versao.py`: recalcula a versão do cache e a lista `IMGS` do `sw.js`.
- `arquivo-unico.py`: gera o `animais-8ano.html` (app inteiro em um arquivo, com as imagens embutidas, sem o editor).

## Tempos medidos (14/11/2026)

- Bateria completa ~70 s; `tudo.sh` ~80 s. Não vale rodar testes em paralelo (ganho pequeno).
