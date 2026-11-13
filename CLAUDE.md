# Instruções para o Claude neste repositório

Este projeto prioriza a economia de contexto e tokens. As regras abaixo são obrigatórias, mas a economia nunca dispensa a pesquisa de fontes nem os testes.

## Contexto do projeto

- **App:** Ciências do 8º ano (Animais), usado por alunos no Pará (13 a 14 anos). Todo o texto em português do Brasil, com linguagem simples.
- **Stack:** PWA em HTML + CSS + JavaScript puro (sem framework nem bundler); scripts de apoio em Python 3 e Node.
- **Comandos:**
  - Validar perguntas: `node validar-banco.js`
  - Testes de navegador: `node testes/testes.js` (precisa de `playwright@1.63.0`)
  - Tema claro (se mudar o `style.css`): `python3 build/tema_claro.py`
  - Teste local de versão e arquivo único: `python3 build/versao.py` e `python3 build/arquivo-unico.py`
  - Lint: não há.
- **Arquivos gerados (não editar à mão):** `animais-8ano.html` e a versão do cache em `sw.js` (atualizados pelo GitHub no `main`), `tema-claro.css`.

## Onde ficam as regras

- Este arquivo é carregado em toda sessão: só regras globais, comandos e convenções, em bullets curtos.
- Regras e exceções de uma subpasta vão para um `CLAUDE.md` dentro dela. Exceção: "Pesquisa padrão" e "Formato das perguntas" ficam aqui, porque `dados.js` está na raiz.

## Pesquisa padrão para conteúdo conceitual (obrigatório)

Antes de criar, editar ou corrigir qualquer parte conceitual (textos dos grupos, perguntas e explicações, fauna, verminoses, ciclos, curiosidades, naturalistas, atividades):

1. Primeiro procure no próprio app (`grep` em `dados.js` e no `FONTES-CONFIAVEIS.md`). Se o fato já está lá e a tarefa não é alterá-lo nem corrigi-lo, reaproveite-o sem pesquisar de novo.
2. Para conteúdo novo, alterado ou corrigido, consulte as fontes de `FONTES-CONFIAVEIS.md`, na ordem e com as regras de lá. Use WebSearch/WebFetch com `allowed_domains` restrito aos domínios listados nesse arquivo.
3. Números e datas precisam de duas fontes que concordem; se divergirem, use a forma mais cautelosa.
4. Conteúdo de saúde só a partir do Ministério da Saúde, da Fiocruz ou da OPAS/OMS. Nunca indique remédio; oriente a procurar a Unidade de Saúde.
5. Nas perguntas, confira também que **nenhuma alternativa errada pode ser considerada correta** e que a explicação não contradiz outra parte do app (use `grep` em `dados.js`, `app.js` e `extras.js`).
6. Se a informação vier de uma fonte que ainda não está no app, acrescente-a em `FONTES` ou `FONTES_MAIS` (`dados.js`).
7. Na resposta ao usuário, diga quais fontes foram consultadas para cada mudança conceitual.
## Depois de qualquer mudança

- **Publicação:** o dono do repositório autorizou que toda atualização vá direto para o `main` (sem pull request), depois que o verificador e os testes passarem.
- **Antes de publicar:** rode os comandos de "Contexto do projeto": tema claro (se mudou o `style.css`) → validar perguntas → testes de navegador. Para testar localmente a versão do cache e o arquivo único, use os scripts de `build/`.

## Formato das perguntas (`dados.js`)

Ver o README.md. Na maioria dos bancos, a primeira alternativa é a correta (o app embaralha ao mostrar). No `QZ` (Desafio final), o terceiro campo é a posição da correta.

## Edição e leitura

- Prefira edições pontuais a reescrever o arquivo inteiro.
- Leia só o necessário: localize com `grep -n` e leia o trecho (offset/limit). Não releia o que já foi lido na sessão.
- Em tarefas complexas, apresente o plano em passos e valide com o usuário antes de editar.

## Tamanho de arquivo e alertas de contexto

- Código novo: até 300 linhas por arquivo (ideal: menos de 200), cada arquivo com uma responsabilidade.
- Arquivos já acima do limite (hoje `app.js`, `style.css`, `progresso.js`): avise uma vez por sessão e sugira a divisão, sem travar a tarefa. Só divida com aprovação do usuário; dividir exige atualizar `sw.js`, `build/arquivo-unico.py` e os testes.
- Fora do limite: `dados.js` (dados) e os arquivos gerados (`animais-8ano.html`, `tema-claro.css`).
- Avise em uma frase (o que cresceu e por que importa) e sugira a ação:
  - mesma tarefa, conversa longa → `/compact` com direcionamento (ex.: `/compact mantenha as decisões e os arquivos alterados`);
  - tarefa concluída ou assunto novo → `/clear` (só sugerir: o usuário executa);
  - arquivo grande demais → propor a divisão.
- Avise também ao perceber que está relendo trechos sem necessidade.

## Saída de terminal

- Use flags de silêncio (`-q`, `--silent`) ou filtre a saída (ex.: `| tail -20`, `| grep -E "FAIL|Erro"`).
- Filtrar não é esconder: sempre relate falhas e erros ao usuário.

## Manutenção deste arquivo

- Mantenha este `CLAUDE.md` abaixo de 200 linhas; regras de domínio que crescerem vão para um `CLAUDE.md` de subpasta.
- Revise-o a cada mudança estrutural (nova stack, novo módulo, novo fluxo de build).
