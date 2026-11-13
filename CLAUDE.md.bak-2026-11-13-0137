# Instruções para o Claude neste repositório

App de Ciências do 8º ano (Animais), usado por alunos no Pará. Todo o texto do app é em português do Brasil, com linguagem simples para alunos de 13 a 14 anos.

## Pesquisa padrão para conteúdo conceitual (obrigatório)

Antes de criar, editar ou corrigir qualquer parte conceitual (textos dos grupos, perguntas e explicações, fauna, verminoses, ciclos, curiosidades, naturalistas, atividades):

1. Consulte as fontes de `FONTES-CONFIAVEIS.md`, seguindo a ordem e as regras de lá. Use WebSearch/WebFetch, de preferência restringindo os domínios (`allowed_domains`) aos dessas fontes, por exemplo `gov.br`, `fiocruz.br`, `paho.org`, `who.int`, `cdc.gov`, `icmbio.gov.br`, `butantan.gov.br`, `mamiraua.org.br`, `animaldiversity.org`, `britannica.com`.
2. Números e datas precisam de duas fontes que concordem; se divergirem, use a forma mais cautelosa.
3. Conteúdo de saúde só a partir do Ministério da Saúde, da Fiocruz ou da OPAS/OMS. Nunca indique remédio; oriente a procurar a Unidade de Saúde.
4. Nas perguntas, confira também que **nenhuma alternativa errada pode ser considerada correta** e que a explicação não contradiz outra parte do app (use `grep` em `dados.js`, `app.js` e `extras.js`).
5. Se a informação vier de uma fonte que ainda não está no app, acrescente-a em `FONTES` ou `FONTES_MAIS` (`dados.js`).
6. Na resposta ao usuário, diga quais fontes foram consultadas para cada mudança conceitual.

## Depois de qualquer mudança

- **Publicação:** o dono do repositório autorizou que toda atualização vá direto para o `main` (sem pull request), depois que o verificador e os testes passarem.

- `node validar-banco.js` (confere as perguntas).
- `node testes/testes.js` (testes de navegador; precisa de `playwright@1.63.0`).
- Se mudar o `style.css`: `python3 build/tema_claro.py`.
- A versão do cache (`sw.js`) e o `animais-8ano.html` são atualizados pelo GitHub no `main`; para testar localmente, rode `python3 build/versao.py` e `python3 build/arquivo-unico.py`.

## Formato das perguntas (`dados.js`)

Ver o README.md. Na maioria dos bancos, a primeira alternativa é a correta (o app embaralha ao mostrar). No `QZ` (Desafio final), o terceiro campo é a posição da correta.
