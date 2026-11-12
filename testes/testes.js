#!/usr/bin/env node
/* Testes de navegador: abrem o app no Chromium e conferem telas, jogos, estrelas e o modo sem internet.
   Uso (na pasta do projeto): npm install playwright && npx playwright install chromium && node testes/testes.js */
"use strict";
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const RAIZ = path.join(__dirname, "..");
const TIPOS = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".webmanifest": "application/manifest+json", ".json": "application/json", ".svg": "image/svg+xml" };

function servidor() {
  return new Promise(ok => {
    const s = http.createServer((req, res) => {
      let p = decodeURIComponent(req.url.split("?")[0].split("#")[0]);
      if (p.endsWith("/")) p += "index.html";
      const f = path.join(RAIZ, path.normalize(p));
      if (!f.startsWith(RAIZ) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
      res.writeHead(200, { "Content-Type": TIPOS[path.extname(f)] || "application/octet-stream" });
      fs.createReadStream(f).pipe(res);
    });
    s.listen(0, "127.0.0.1", () => ok(s));
  });
}

let falhas = 0, passos = 0;
function confere(cond, msg) { passos++; if (cond) console.log("  ok  " + msg); else { falhas++; console.log("  FALHOU  " + msg); } }

/* Devolve o texto da alternativa correta de uma pergunta, procurando em todos os bancos do app. */
/* fonte: "g" (grupos), "f" (desafio final) ou "m" (mini desafios); a mesma pergunta pode existir em mais de um banco */
const CERTA = `(q,fonte)=>{q=q.trim();
  if(fonte==="g")for(const g of G)for(const x of g.pool)if(x.q.trim()===q)return x.o[x.a];
  if(fonte==="f")for(const x of QZ)if(x[0].trim()===q)return x[1][x[2]];
  if(fonte==="m")for(const t in MINI)for(const x of MINI[t])if(x[0].trim()===q)return x[1][0];
  return null;}`;

async function responder(p, caixa, seletorPergunta, certo, fonte) {
  const q = await p.$eval(caixa + " " + seletorPergunta, e => e.textContent);
  const alvo = await p.evaluate(`(${CERTA})(${JSON.stringify(q)},${JSON.stringify(fonte)})`);
  if (alvo === null) throw new Error("pergunta não achada no banco: " + q);
  const opcoes = await p.$$(caixa + " .opt");
  for (const b of opcoes) {
    const t = await b.textContent();
    if ((t === alvo) === certo) { await b.click(); return; }
  }
  throw new Error("alternativa não achada: " + alvo);
}

const testes = {};

testes["abre sem erros e mostra todas as abas"] = async (p) => {
  const abas = await p.$$eval("#tabs button", bs => bs.map(b => b.dataset.t));
  confere(abas.length >= 11, abas.length + " abas no menu");
  for (const t of abas) {
    await p.click(`#tabs button[data-t="${t}"]`);
    const vis = await p.$eval("#" + t, e => getComputedStyle(e).display !== "none" && e.innerText.trim().length > 20);
    confere(vis, "aba " + t + " aparece com conteúdo");
  }
};

testes["ganha a estrela de um grupo e ela fica salva no perfil"] = async (p) => {
  await p.fill("#wn", "Teste");
  await p.click("#wok");
  await p.click('#tabs button[data-t="tree"]');
  await p.click("#b-inv .bbtn");
  await p.click("#card-porifero");
  for (let i = 0; i < 5; i++) {
    await responder(p, "#chal", "p", true, "g");
    await p.click("#chal #cn");
  }
  confere((await p.textContent("#stars")) === "1", "contador mostra 1 estrela");
  await p.reload();
  confere((await p.textContent("#stars")) === "1", "estrela continua depois de recarregar");
};

testes["desafio final: 10 perguntas, resultado e revisão dos erros"] = async (p) => {
  await p.click('#tabs button[data-t="quiz"]');
  for (let i = 0; i < 10; i++) {
    await responder(p, "#qbox", ".qq", i >= 2, "f");
    await p.click("#qn");
  }
  const fim = await p.textContent("#qbox");
  confere(/Você acertou\s*8\s*de 10/.test(fim), "resultado 8 de 10");
  confere(!!(await p.$("#rev")), "botão para rever os 2 erros");
};

testes["mini desafio de uma aba funciona"] = async (p) => {
  await p.click('#tabs button[data-t="temp"]');
  for (let i = 0; i < 5; i++) {
    await responder(p, "#temp .mini", ".mqq", true, "m");
    await p.click("#temp #mnb");
  }
  confere(/acertou\s*5\s*de 5/.test(await p.textContent("#temp .mini")), "5 de 5 no desafio da temperatura");
};

testes["classifique e quem é este? funcionam"] = async (p) => {
  await p.click('#tabs button[data-t="cls"]');
  for (let i = 0; i < 10; i++) { await p.click("#co .opt >> nth=0"); await p.click("#cn"); }
  confere(/Você classificou/.test(await p.textContent("#cbox")), "classifique chega ao resultado");
  await p.click('#tabs button[data-t="img"]');
  confere((await p.$$("#ibox .opt")).length >= 2, "quem é este? mostra alternativas");
};

testes["funciona sem internet depois da primeira visita"] = async (p, ctx, url) => {
  await p.evaluate(() => navigator.serviceWorker.ready);
  await p.reload();
  await p.waitForFunction(() => navigator.serviceWorker.controller);
  await ctx.setOffline(true);
  await p.reload();
  confere((await p.title()).includes("Animais"), "app abre com a internet desligada");
  await ctx.setOffline(false);
};

testes["arquivo único abre direto do computador"] = async (p) => {
  await p.goto("file://" + path.join(RAIZ, "animais-8ano.html"));
  confere((await p.$$("#tabs button")).length >= 11, "animais-8ano.html abre com o menu completo");
  await p.click('#tabs button[data-t="quiz"]');
  confere(!!(await p.$("#qbox .opt")), "desafio final funciona no arquivo único");
};

(async () => {
  const s = await servidor();
  const url = "http://127.0.0.1:" + s.address().port + "/index.html";
  const nav = await chromium.launch();
  const filtro = process.argv[2];
  for (const nome of Object.keys(testes)) {
    if (filtro && !nome.includes(filtro)) continue;
    console.log("• " + nome);
    const ctx = await nav.newContext({ viewport: { width: 1100, height: 900 } });
    const p = await ctx.newPage();
    const erros = [];
    p.on("pageerror", e => erros.push(e.message));
    p.on("console", m => { if (m.type() === "error") erros.push(m.text()); });
    try {
      await p.goto(url);
      await p.evaluate(() => { try { localStorage.setItem("an8inst", "no"); } catch (e) {} });
      await p.reload();
      await testes[nome](p, ctx, url);
    } catch (e) { falhas++; console.log("  FALHOU  " + e.message.split("\n")[0]); }
    confere(erros.length === 0, "sem erros no console" + (erros.length ? ": " + erros.join(" | ") : ""));
    await ctx.close();
  }
  await nav.close(); s.close();
  console.log("\n" + passos + " verificações, " + falhas + " falha(s).");
  process.exit(falhas ? 1 : 0);
})();
