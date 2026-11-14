# Regras da pasta testes/ (testes de navegador)

- `testes.js` só roda; os testes ficam em `t_*.js`, um arquivo por assunto: `t_telas`, `t_jogos`, `t_conteudo`, `t_progresso`, `t_editor`, `t_offline`.
- Peças comuns (servidor local, `confere`, `responder`, `abrir`, `perfil`, `finalCom`, `semCache`) ficam em `apoio.js`. Não copie essas peças para os testes: importe-as.
- Rodar: `node testes/testes.js` (todos), `node testes/testes.js t_jogos t_telas` (só esses arquivos) ou `node testes/testes.js "simulado"` (só os nomes com esse trecho).
- No container da nuvem o Playwright já vem instalado; em outro computador: `npm install --no-save playwright@1.63.0 && npx playwright install chromium`.
- Teste novo: entra no arquivo do assunto (amplie um teste existente quando der). Assunto novo: crie `t_<assunto>.js`, acrescente-o à lista `ORDEM` do `testes.js` e ao `MAPA` do `build/rapido.py`.
- Cada teste recebe `(p, ctx, url)` numa página nova, já sem o aviso de instalação; o "sem erros no console" é conferido sozinho no fim de cada teste.
- Os testes não podem depender da ordem nem uns dos outros.
