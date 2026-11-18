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

- **Publicar sem esperar (18/11/2026, decisão do dono: "Sempre faça isso"):** quando a tarefa terminar e o `tudo.sh` der "Tudo certo.", publicar no `main` na hora, sem esperar a conferência do dono; ele confere depois e aponta o que mudar.

## Pendências (esperando decisão do dono)

- **Feito (18/11/2026, Conversa B):** 19 fichas de ideias erradas comuns em `build/fichas/` (139 itens, 6 a 9 por ficha), cada uma com `fonte` do `FONTES-CONFIAVEIS.md` (verminoses e ciclos: só MS/Fiocruz, mais CDC DPDx no ciclo da lombriga). Lista para conferir: `revisao/fichas.md`. O pente-fino passou a dar 329 sugestões. Ficou de fora: "minhoca cortada vira duas" (a fonte mostra que depende do corte) e "caramujo-africano transmite esquistossomose" (só havia fontes de prefeituras).
- **Feito (18/11/2026, com o "sim" do dono):** fichas publicadas no `main`. Itens a trocar ou tirar: é só o dono apontar.
- **Esperando o "sim" do dono:** corrigir os avisos do pente-fino (`revisao/perguntas.md`, 18/11/2026: `longa` 201, `absoluta` 21). Correções simples podem ser feitas com Sonnet.
- **Feito (18/11/2026, com o "sim" do dono):** revisão das perguntas (`build/revisar_perguntas.py`, teste `build/t_revisar_perguntas.py`, ligada ao `novas.py verificar`, ao `rapido.py` e ao `tudo.sh`). Decisão: trabalho dividido em duas conversas (A: ferramenta; B: fichas), um commit em cada.

- **Feito (18/11/2026):** protocolo-token reaplicado a partir da Física: comando já igual; `CLAUDE.md` ganhou 2 regras (teste novo no `MAPA` do `rapido.py`; `NOTAS.md` acima de ~150 linhas → histórico). Sem arquivo de código acima de 300 linhas; `dados.js` tem linhas curtas (máx. ~1 000 caracteres), então não precisa de motor de item único nem de trava.

- **Regra (15/11/2026, decisão do dono):** a próxima tarefa fica só aqui, nesta seção. O `CLAUDE.md` apenas aponta para cá.
- **Próxima tarefa:** continuar a revisão dos textos com o motor (`revisao/textos.md`): bloco `PR`; conferir nas fontes confiáveis e corrigir só com o "sim" do dono.
- **Feito (18/11/2026, com o "sim" do dono):** bloco `NAT` revisado (`revisao/textos-NAT-sugestoes.md`): Wallace e Darwin não estavam na reunião de 1858 (Darwin Online), também na pergunta do "Desafio dos naturalistas"; "8 mil novas" de Bates como estimativa dele (Darwin Online, van Wyhe); Lamarck "com a ajuda da filha Cornélie" (Museu de Paris, fonte nova); Lineu e a edição de 1758 (Britannica, NHM); vertebrados/invertebrados explicados. Avisos que sobram: datas já conferidas.
- **Tarefa seguinte (18/11/2026, pedido do dono):** planejar um motor de imagens e animações para o 8º ano; mostrar o plano e só criar com o "sim" do dono.
- **Feito (18/11/2026, com o "sim" do dono):** 3 ajustes do bloco `PA` aplicados: boto "dos rios da Amazônia e também da bacia do rio Orinoco"; harpia "asas chegam a cerca de 2 metros"; "endotérmica (mantém o corpo quente sozinha)". Os 2 avisos de número que sobram (pirarucu, harpia) já foram conferidos.
- **Feito (18/11/2026):** bloco `PA` revisado (`revisao/textos-PA-sugestoes.md`): 1 erro (boto "exclusivo da bacia amazônica"; Animal Diversity Web, Britannica, Mamirauá), harpia com a forma mais cautelosa (Britannica, Animal Diversity Web), "endotérmica" a explicar. Pirarucu, onça-pintada e guará conferidos, sem mudança.
- **Feito (18/11/2026, com o "sim" do dono):** bloco `G` revisado (`revisao/textos-G-sugestoes.md`): "mais de 90%" dos peixes são ósseos conferido (Britannica, Animal Diversity Web); 27 termos explicados entre parênteses (larva, parasita, bioindicador, hermafrodita, fecundação cruzada, ecto/endotérmico, vivíparo, placenta etc.). Os 7 avisos que sobraram são falsos.
- **Feito (18/11/2026, com o "sim" do dono):** bloco `CUR` revisado (`revisao/textos-CUR-sugestoes.md`): insetos "cerca de 1 milhão" de espécies (Britannica, Animal Diversity Web; Smithsonian diz "mais de"), tubarões "mais de 400 milhões de anos" conferido (Smithsonian, NOAA); "pólipo", "artrópodes" e "regenerar" explicados; "sempre úmida" da minhoca mantido.
- **Feito (18/11/2026, com o "sim" do dono):** bloco `CIC` revisado (`revisao/textos-CIC-sugestoes.md`): números conferidos (lombriga 20 a 35 cm, "milhares de ovos", tênia "vários metros"; Fiocruz, eduCAPES, APTA), "larva", "cílios" e "hospedeiro intermediário" explicados, frases longas divididas, "procure uma Unidade de Saúde" nos 3 cartões de prevenção. Os avisos que sobraram (títulos miracídio, cercárias, cisticercos, larvas) são falsos: o termo é explicado na descrição do mesmo cartão.
- **Feito (15/11/2026, com o "sim" do dono):** bloco `DIS` revisado (`revisao/textos-DIS-sugestoes.md`): datas da filariose conferidas (OMS, Fiocruz, OPAS, Ministério da Saúde), "procure uma Unidade de Saúde" nos 4 cartões que faltavam, "parasita" e "larvas" explicados em cada cartão, frase longa dividida, curiosidade de Belém e Recife. O motor deixa de olhar o nome do grupo (`DIS[i][2]`). Os 3 avisos de número que sobram já foram conferidos.
- **Feito (15/11/2026, com o "sim" do dono):** motor de revisão dos textos (`build/revisar_textos.js`, ficha `build/fichas/textos.json`, teste `build/t_revisar_textos.js`, ligado ao `rapido.py` e ao `tudo.sh`). 1ª rodada: 64 cartões, 110 avisos (41 números, 59 termos, 4 exageros, 2 frases longas, 4 verminoses sem orientar a procurar a Unidade de Saúde).
- **Feito (15/11/2026):** protocolo-token atualizado a partir da Física (`main` em `c03ad5e`): 5 arquivos em `.claude/skills/protocolo-token/`, barra de contexto e preparo da sessão na nuvem (`.claude/settings.json` + `.claude/hooks/`), dicas novas no `CLAUDE.md`. Motor de item único e trava de leitura: não precisa (maior linha do `dados.js` ~1 000 letras).
- **Feito (16/11/2026):** tela inicial ganhou o bloco "👪 Para pais e responsáveis" (o que o aluno pode fazer e cuidados com a LGPD). Sem nada de nuvem (decisão do dono). Lei conferida no Planalto e no Serpro.
- **Feito (16/11/2026, pedido do dono):** a estrela de cada grupo virou **insígnia** (a ilustração do grupo numa medalha dourada no cartão). O contador "🏅 n/13 insígnias" abre o menu "Minhas insígnias" (13 grupos; os não ganhos aparecem apagados). O nome interno `stars`/`estrela:` não mudou (para não perder o progresso salvo). Teste em `testes/t_jogos.js`.
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
