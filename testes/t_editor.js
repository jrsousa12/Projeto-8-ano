/* Testes do editor do professor e da segurança (nomes perigosos, HTML nas perguntas, relógio do simulado). */
"use strict";
const fs = require("fs");
const { confere, abrir, perfil, semCache } = require("./apoio");
const testes = {};

testes["editor: cria e oculta perguntas e o app dos alunos recebe"] = async (p, ctx, url) => {
  const ed = url.replace("index.html", "editor.html");
  await p.goto(ed);
  await p.click("#f-salvar");
  confere(/Escreva a pergunta/.test(await p.textContent("#f-msg")), "não salva pergunta vazia");
  await p.selectOption("#f-g", "porifero");
  await p.fill("#f-q", "Pergunta de teste do professor?");
  await p.fill("#f-o0", "Certa"); await p.fill("#f-o1", "Errada 1"); await p.fill("#f-o2", "Errada 1");
  await p.fill("#f-w", "Explicação de teste.");
  await p.click("#f-salvar");
  confere(/repetidas/.test(await p.textContent("#f-msg")), "recusa alternativas repetidas");
  await p.fill("#f-o2", "Errada 2");
  await p.click("#f-salvar");
  confere(/criada/.test(await p.textContent("#f-msg")), "cria a pergunta");
  const oculta = await p.evaluate(() => QZ[0][0]);
  await p.fill("#l-busca", oculta);
  await p.click('#l-lista .ed-q:not(.minha) [data-a="ocultar"]');
  confere(/1<\/b> ocultas/.test(await p.innerHTML("#ed-resumo")), "oculta uma pergunta do Desafio final");
  await p.reload();
  confere(/1<\/b> suas/.test(await p.innerHTML("#ed-resumo")), "o trabalho continua salvo no aparelho");
  const [down] = await Promise.all([p.waitForEvent("download"), p.click("#ed-gerar")]);
  const arq = fs.readFileSync(await down.path(), "utf8");
  confere(down.suggestedFilename() === "banco-proprio.js" && /Pergunta de teste do professor/.test(arq), "gera o banco-proprio.js");
  /* o app dos alunos com o arquivo novo (sem o cache do modo offline, para o navegador buscar o arquivo) */
  await semCache(p);
  const q = await ctx.newPage();
  await q.route("**/banco-proprio.js", r => r.fulfill({ status: 200, contentType: "text/javascript", body: arq }));
  await q.goto(url);
  confere(await q.evaluate(() => G.find(g => g.id === "porifero").pool.some(x => x.q === "Pergunta de teste do professor?")), "pergunta nova entra no desafio dos poríferos");
  confere(await q.evaluate(t => !QZ.some(x => x[0] === t), oculta), "pergunta oculta sai do Desafio final");
  await q.close();
};

testes["segurança: nomes perigosos, perguntas com HTML e relógio do simulado"] = async (p, ctx, url) => {
  await p.fill("#wn", "__proto__"); await p.click("#wok");
  confere(/outro nome/.test(await p.textContent("#wmsg")), "nome __proto__ é recusado");
  /* pergunta do professor com marcação HTML não vira código na página */
  await semCache(p);
  const q = await ctx.newPage();
  const ruim = 'const PROPRIO={"perguntas":[{"g":"final","q":"<img src=x id=xss>Teste?","o":["<b id=xss2>A</b>","B","C"],"w":"<i id=xss3>w</i>"}],"ocultas":[]};';
  await q.route("**/banco-proprio.js", r => r.fulfill({ status: 200, contentType: "text/javascript", body: ruim }));
  await q.goto(url);
  const it = await q.evaluate(() => QZ[QZ.length - 1]);
  confere(!/[<>]/.test(it[0] + it[1].join("") + it[3]), "perguntas do professor ficam sem < e >");
  await q.close();
  /* começar um treino com um simulado em andamento: o relógio do simulado para e não invade o treino */
  await perfil(p, "Gil");
  await abrir(p, "prog");
  await p.click("#pg-sim");
  await p.evaluate(() => { RODA.simulado.st.rest = 1500; });
  await abrir(p, "jogar");
  await p.click('#jogar .ht[data-pr="treino"]');
  await p.waitForTimeout(2500);
  confere(/Treino/.test(await p.textContent("#pgrun .qtop")), "o treino continua na tela");
  await p.click('#tabs button[data-t="prog"]');
  confere(!(await p.$eval("#nvbox", e => e.hidden)), "tocar em Progresso durante uma rodada volta ao resumo");
};

module.exports = testes;
