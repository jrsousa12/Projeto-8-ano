# Instruções para o Claude neste repositório

Este projeto prioriza a economia de contexto e tokens. As regras abaixo são obrigatórias, mas a economia nunca dispensa a pesquisa de fontes nem os testes.

## Contexto do projeto

- **App:** Ciências do 8º ano (Animais), usado por alunos no Pará (13 a 14 anos). Todo o texto em português do Brasil, com linguagem simples.
- **Dono:** professor que não programa. Responda sempre em português do Brasil simples, sem jargão (inclusive resumos, avisos e commits).
- **Textos para os alunos:** explique cada termo técnico na primeira vez que aparecer; prefira frases curtas.
- **Stack:** PWA em HTML + CSS + JavaScript puro (sem framework nem bundler); scripts de apoio em Python 3 e Node.
- **Comandos** (detalhes em `build/CLAUDE.md` e `testes/CLAUDE.md`):
  - Durante o trabalho: `python3 build/rapido.py` (só o ligado ao que mudou).
  - Procurar um fato no app: `node build/buscar.js palavra [outra] [--tudo]`.
  - Antes de publicar: `bash build/tudo.sh` (gera os arquivos automáticos e roda tudo).
  - Perguntas novas: `python3 build/novas.py modelo <destino> [n]` → preencher o rascunho em `build/novas/` → `verificar` → `aplicar` (grava no `dados.js`).
  - Avulsos: `node validar-banco.js`; `node testes/testes.js [t_assunto]` (precisa de `playwright@1.63.0`); `python3 build/tema_claro.py`.
  - Lint: não há. `/protocolo-token` reaplica estas regras (origem oficial no projeto de Física).
- **Arquivos gerados (não editar à mão):** `animais-8ano.html` e a versão do cache em `sw.js` (atualizados pelo GitHub no `main`), `tema-claro.css`.
- **Visual:** dividido em `estilo-base.css`, `estilo-painel.css`, `estilo-telas.css` e `estilo-progresso.css`, carregados nessa ordem (a ordem importa). Estilo novo vai no arquivo da parte do app; arquivo de estilo novo entra no `index.html`, no `editor.html`, no `ARQ` do `sw.js` e na lista `ARQS` do `build/tema_claro.py`.
- **Próxima tarefa** (detalhes em `NOTAS.md`): revisar as perguntas que já existem (alternativa errada que pode ser considerada certa; explicação que contradiz outra parte do app). Resultado em relatório curto; corrigir só com o "sim" do dono.

## Onde ficam as regras

- Este arquivo é carregado em toda sessão: só regras globais, comandos e convenções, em bullets curtos.
- Regras e exceções de uma subpasta vão para um `CLAUDE.md` dentro dela. Exceção: "Pesquisa padrão" e "Formato das perguntas" ficam aqui, porque `dados.js` está na raiz.

## Pesquisa padrão para conteúdo conceitual (obrigatório)

Antes de criar, editar ou corrigir qualquer parte conceitual (textos dos grupos, perguntas e explicações, fauna, verminoses, ciclos, curiosidades, naturalistas, atividades):

1. Primeiro procure no próprio app com `node build/buscar.js palavra [outra]` (procura no `dados.js`, nos outros arquivos do app e no `FONTES-CONFIAVEIS.md`; não use `grep` no `dados.js`, que tem linhas enormes). Se o fato já está lá e a tarefa não é alterá-lo nem corrigi-lo, reaproveite-o sem pesquisar de novo.
2. Para conteúdo novo, alterado ou corrigido, consulte as fontes de `FONTES-CONFIAVEIS.md`, na ordem e com as regras de lá. Use WebSearch/WebFetch com `allowed_domains` restrito aos domínios listados nesse arquivo.
3. Números e datas precisam de duas fontes que concordem; se divergirem, use a forma mais cautelosa.
4. Conteúdo de saúde só a partir do Ministério da Saúde, da Fiocruz ou da OPAS/OMS. Nunca indique remédio; oriente a procurar a Unidade de Saúde.
5. Nas perguntas, confira também que **nenhuma alternativa errada pode ser considerada correta** e que a explicação não contradiz outra parte do app (use `node build/buscar.js`).
6. Se a informação vier de uma fonte que ainda não está no app, acrescente-a em `FONTES` ou `FONTES_MAIS` (`dados.js`).
7. Na resposta ao usuário, diga quais fontes foram consultadas para cada mudança conceitual.

## Depois de qualquer mudança

- **Publicação:** o dono do repositório autorizou que toda atualização vá direto para o `main` (sem pull request), depois que o verificador e os testes passarem.
- **Antes de publicar:** `bash build/tudo.sh` (tema claro → versão do cache → arquivo único → sintaxe → perguntas → todos os testes) precisa terminar em "Tudo certo.". Os arquivos gerados que ele mudar vão no commit.
- **Robô do `main`:** depois de cada push, o GitHub faz um commit no `main` (versão do cache e arquivo único). Antes de publicar de novo: `git fetch origin main`, `git rebase origin/main`, testes outra vez. Nunca force o push no `main`.
- **Commits que vão junto:** antes de enviar ao `main`, liste com `git log --oneline origin/main..HEAD` e informe ao usuário todos os commits enviados. Envie também ao branch da sessão.
- **Tarefas em etapas:** um único commit no final, salvo pedido do usuário.
- **Arquivo novo (`.js`, `.css`, `.html`):** acrescente-o à lista `ARQ` do `sw.js` (manual) e confira se o `build/arquivo-unico.py` o inclui. Imagens: `.webp` em `img/animais/` (a lista `IMGS` é gerada pelo `versao.py`).

## Formato das perguntas (`dados.js`)

Ver o README.md. Na maioria dos bancos, a primeira alternativa é a correta (o app embaralha ao mostrar). No `QZ` (Desafio final), o terceiro campo é a posição da correta.

## Edição e leitura

- Prefira edições pontuais a reescrever o arquivo inteiro.
- Leia só o necessário: localize com `grep -n` e leia o trecho (offset/limit). Não releia o que já foi lido na sessão.
- Em tarefas complexas, apresente o plano em passos e valide com o usuário antes de editar.
- O dono pode indicar arquivos com `@nome`.
- Arquivos de dados ou gerados (linhas longas): vale o tamanho, não o número de linhas. Nunca leia inteiro.

## Motores, testes e recursos de apoio

- **Motor** = script que faz um trabalho repetido (gerar, converter, conferir, corrigir em lote) e devolve só um resumo curto. Se a mesma tarefa for feita à mão pela 2ª ou 3ª vez, proponha um motor; crie só com aprovação, pequeno e testado, e anote em "Comandos".
- **Testes guardados:** todo teste criado numa tarefa vira parte permanente da bateria (um arquivo por assunto). Antes de criar, procure um teste existente e amplie-o; não reescreva testes que já existem.
- **Testes seletivos:** durante a tarefa, `python3 build/rapido.py`; a bateria completa (`--tudo`), no fim e antes de publicar.
- **Relatórios longos** vão para arquivo (`.md`/`.txt`); na conversa, só o resumo.
- **Memória do projeto:** decisões e pendências em `NOTAS.md`; leia antes de propor algo e anote ali cada decisão nova do dono.
- Tipos de motor e de recurso de apoio: seções 8 e 9 de `.claude/skills/protocolo-token/modelo-CLAUDE.md` (ler só quando for propor um).

## Tamanho de arquivo e alertas de contexto

- Código novo: até 300 linhas por arquivo (ideal: menos de 200), cada arquivo com uma responsabilidade.
- Arquivos já acima do limite (hoje nenhum): avise uma vez por sessão e sugira a divisão, sem travar a tarefa. Só divida com aprovação do usuário; dividir exige atualizar `sw.js`, `build/arquivo-unico.py` e os testes.
- Fora do limite: `dados.js` (dados) e os arquivos gerados (`animais-8ano.html`, `tema-claro.css`).
- Avise em uma frase (o que cresceu e por que importa) e sugira a ação:
  - mesma tarefa, conversa longa → `/compact` com direcionamento (ex.: `/compact mantenha as decisões e os arquivos alterados`);
  - tarefa concluída ou assunto novo → `/clear` (só sugerir: o usuário executa);
  - arquivo grande demais → propor a divisão.
- Avise também ao perceber que está relendo trechos sem necessidade.
- Dicas ao dono (uma frase, quando couber): uma tarefa por conversa; `@nome` quando souber o arquivo; pedidos diretos; "sim"/"não" basta.

## Saída de terminal

- Use flags de silêncio (`-q`, `--silent`) ou filtre a saída (ex.: `| tail -20`, `| grep -E "FAIL|Erro"`).
- No `sw.js` e no `animais-8ano.html` (linhas enormes), corte a saída das buscas (ex.: `grep ... | cut -c1-200`).
- Filtrar não é esconder: sempre relate falhas e erros ao usuário.

## Manutenção deste arquivo

- Mantenha este `CLAUDE.md` abaixo de 200 linhas; regras de domínio que crescerem vão para um `CLAUDE.md` de subpasta.
- Revise-o a cada mudança estrutural (nova stack, novo módulo, novo fluxo de build).
