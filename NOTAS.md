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

- **Regra (15/11/2026, decisão do dono):** a próxima tarefa fica só aqui, nesta seção. O `CLAUDE.md` apenas aponta para cá.
- **Próxima tarefa (15/11/2026):** criar um motor de revisão dos textos que não são perguntas (fauna do Pará, naturalistas, verminoses, curiosidades) e atualizar o protocolo-token a partir da Física. Plano esperando o "sim" do dono:
  - **Motor de revisão dos textos** (`build/revisar_textos.js` + ficha `build/fichas/textos.json`, que o dono amplia sem programar). Lê `G`, `PA`, `DIS`, `CUR`, `NAT`, `PR` (`dados.js`), `conteudo.js` e `extras.js`. Só avisa, nunca altera. Aponta: (1) números e datas com o trecho, para conferir em 2 fontes, e o mesmo fato com número diferente em outra parte do app (inclusive perguntas); (2) termo técnico sem explicação na 1ª vez (lista na ficha); (3) frase com mais de 25 palavras; (4) saúde: menção a remédio e verminose sem "Unidade de Saúde"; (5) exageros ("sempre", "nunca", "único", "exclusivo"); (6) nome científico fora do padrão ou diferente entre partes do app. Relatório em `revisao/textos-….md`, resumo curto na conversa. Teste guardado (cada aviso aparece quando deve e não aparece quando não deve), ligado ao `build/rapido.py`. Depois: conferir nas fontes, bloco por bloco, e corrigir só com o "sim".
  - **Protocolo-token (origem: Física, `main` em `c03ad5e`, conferido em 15/11/2026):** copiar os 5 arquivos para `.claude/skills/protocolo-token/` (hoje há 2; faltam `motor-questao.md`, `motor-teoria.md`, `travas-e-barra.md`); barra de contexto (`.claude/settings.json` + `.claude/hooks/barra-contexto.sh`, vale na próxima sessão); instalação automática do Playwright ao abrir sessão na nuvem (`.claude/hooks/session-start.sh`); dicas novas no `CLAUDE.md` (`/model` Sonnet/Haiku em tarefa simples; barra perto de 50% → `/compact`). Não precisa: motor de item único e trava de leitura (maior linha do `dados.js` ~1 000 letras, limite 2 000). Lembrete ao dono: no claude.ai, Configurações → Ambientes, liberar os sites de pacotes.
  - No fim: `bash build/tudo.sh`, um commit, push no `main` e no branch da sessão.
- **Decisão (15/11/2026):** `QZ[18]` e `QZ[129]` ficam como estão (o dono não quer as melhorias opcionais).

- **Concluída (15/11/2026): revisão das perguntas existentes.** Procurar alternativas erradas que possam ser consideradas certas e explicações que contradizem outra parte do app (`node build/buscar.js`). Fazer por banco ou por grupo, gravar o relatório em arquivo e mostrar só o resumo; corrigir só depois do "sim" do dono, conferindo nas fontes confiáveis.
  - **Feito (15/11/2026):** os 13 grupos (EXTRA, EXTRA2, BANK3, BANK4; 390 perguntas) foram revisados (`revisao/rodada-1` a `rodada-3`) e as correções aplicadas com o "sim" do dono.
  - **A fazer (decisão do dono em 15/11/2026):** revisar o Desafio final (`QZ`, 209 perguntas, blocos de ~50, relatório `revisao/rodada-4-qz-1a50.md` e seguintes) e depois `MQX`/`MQ0`.
  - **Feito (15/11/2026):** bloco 1 do `QZ` (perguntas 1–50) revisado: `revisao/rodada-4-qz-1a50.md` (1 ponto a corrigir, 2 de baixo risco).
  - **Feito (15/11/2026):** bloco 2 do `QZ` (perguntas 51–100) revisado: `revisao/rodada-5-qz-51a100.md` (1 ponto a corrigir, 2 de baixo risco).
  - **Feito (15/11/2026):** bloco 3 do `QZ` (perguntas 101–150) revisado: `revisao/rodada-6-qz-101a150.md` (nenhum ponto grave, 3 de baixo risco).
  - **Feito (15/11/2026):** bloco 4 do `QZ` (perguntas 151–209) revisado: `revisao/rodada-7-qz-151a209.md` (nenhum ponto grave). Corrigidos `QZ[46]` e `QZ[99]` com o "sim" do dono; `QZ[18]` e `QZ[129]` (opcionais) ficaram como estão. Próximo: `MQX`/`MQ0`.
  - **Feito (15/11/2026):** bloco 1 dos desafios temáticos (temperatura, metamorfose e fauna do Pará; 48 perguntas de `MQX`/`MQ0`) revisado: `revisao/rodada-8-mq-bloco1.md` (nenhum ponto grave; 1 melhoria opcional em `MQX` temperatura [2]). Próximo: bloco 2 (verminoses, naturalistas e ciclos; 40 perguntas).
  - **Feito (15/11/2026):** bloco 2 dos desafios temáticos (verminoses, naturalistas e ciclos; 40 perguntas) revisado: `revisao/rodada-9-mq-bloco2.md` (1 ponto a corrigir: `MQ0` verminoses [4], filariose). Próximo: aplicar as correções com o "sim" do dono.
  - **Feito (15/11/2026):** corrigidos `MQ0` verminoses [4] ("No Brasil", Barbeiro e Mosca-doméstica no lugar de Anopheles e Aedes) e `MQX` temperatura [2] ("Para trocar as penas" no lugar de "Para secar a pele"), com o "sim" do dono. Revisão de todas as perguntas concluída.
  - **Passos para a revisão do Desafio final (é só o dono dizer "sim" para começar):**
    1. Revisar em blocos de ~50 perguntas (1–50, 51–100, 101–150, 151–209). Um relatório por bloco: `revisao/rodada-4-qz-1a50.md`, `rodada-5-qz-51a100.md` e assim por diante. Para listar o bloco, use `node` com `vm` (como nas rodadas 1–3); no `QZ`, o 3º campo é a posição da correta.
    2. Procurar alternativa errada que possa ser defendida como certa e explicação que contradiz outra parte do app (`node build/buscar.js`). Conferir números (2 fontes) e saúde (só MS, Fiocruz ou OPAS/OMS).
    3. Gravar o relatório em arquivo e mostrar só o resumo ao dono. Esperar o "sim" para ir ao bloco seguinte.
    4. No fim, corrigir tudo de uma vez, só com o "sim" do dono: conferir nas fontes confiáveis, `bash build/tudo.sh`, um commit, push no `main` e no branch da sessão.
    5. Depois, fazer o mesmo com os desafios temáticos (`MQX`/`MQ0`, ~100 perguntas).

- **Endereço do repositório:** o GitHub avisa que ele agora se chama `jrsousa12/Projeto-8-ano` (com P maiúsculo). Os envios funcionam pelo nome antigo; não é preciso fazer nada.
