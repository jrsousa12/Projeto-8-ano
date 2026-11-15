# Notas do projeto (decisões e pendências)

Leia antes de propor algo; anote aqui cada decisão nova do dono, com a data.

## Decisões

- **Publicação direto no `main`**, sem pull request, depois que o `bash build/tudo.sh` termina em "Tudo certo.". Também vai ao branch da sessão.
- **Protocolo-token** aplicado a partir do projeto de Física (14/11/2026). O comando `/protocolo-token` fica em `.claude/skills/protocolo-token/`; a origem oficial é o projeto de Física.
- **Testes por assunto** (`testes/t_*.js`) com peças comuns em `testes/apoio.js` (14/11/2026).
- **Testes em paralelo: não.** A bateria leva ~70 s; o ganho seria pequeno (14/11/2026).
- **Ferramentas copiadas da Física e adaptadas:** conferência rápida (`build/rapido.py`), busca no app (`build/buscar.js`) e comando único (`build/tudo.sh`) (14/11/2026).
- **Gerador de perguntas** (`build/novas.py`, adaptado da Física, sem a parte de contas): molde → conferência (fonte da lista confiável, saúde só MS/Fiocruz/OPAS, nada de remédio, repetidas, alternativas) → grava em `BANK4` (grupo), `QZ` (final) ou `MQX` (abas) e a fonte nova em `FONTES_MAIS` (14/11/2026).
- **Arquivos gerados** (`tema-claro.css`, `sw.js`, `animais-8ano.html`): podem ir no commit quando o `tudo.sh` os mudar; saem iguais aos do robô do GitHub.

- **`style.css` dividido** em 4 arquivos (`estilo-base`, `estilo-painel`, `estilo-telas`, `estilo-progresso`), na mesma ordem e com o mesmo conteúdo; o tema claro saiu igual (14/11/2026).

## Pendências (esperando decisão do dono)

- **Próxima tarefa (escolhida pelo dono em 15/11/2026): revisão das perguntas existentes.** Procurar alternativas erradas que possam ser consideradas certas e explicações que contradizem outra parte do app (`node build/buscar.js`). Fazer por banco ou por grupo, gravar o relatório em arquivo e mostrar só o resumo; corrigir só depois do "sim" do dono, conferindo nas fontes confiáveis.
  - **Feito (15/11/2026):** os 13 grupos (EXTRA, EXTRA2, BANK3, BANK4; 390 perguntas) foram revisados (`revisao/rodada-1` a `rodada-3`) e as correções aplicadas com o "sim" do dono.
  - **A fazer (decisão do dono em 15/11/2026):** revisar o Desafio final (`QZ`, 209 perguntas, blocos de ~50, relatório `revisao/rodada-4-qz-1a50.md` e seguintes) e depois `MQX`/`MQ0`.

- **Endereço do repositório:** o GitHub avisa que ele agora se chama `jrsousa12/Projeto-8-ano` (com P maiúsculo). Os envios funcionam pelo nome antigo; não é preciso fazer nada.
