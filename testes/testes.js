#!/usr/bin/env node
/* Testes de navegador: abrem o app no Chromium e conferem telas, jogos, estrelas e o modo sem internet.
   Os testes ficam em arquivos por assunto (t_*.js); as peças comuns, em apoio.js.
   Uso (na pasta do projeto): npm install playwright && npx playwright install chromium
     node testes/testes.js                 → todos
     node testes/testes.js t_jogos t_telas → só esses arquivos
     node testes/testes.js "simulado"      → só os testes com esse trecho no nome */
"use strict";
const fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const { servidor, placar, confere } = require("./apoio");

/* ordem fixa; arquivo t_*.js novo entra no fim automaticamente */
const ORDEM = ["t_telas", "t_jogos", "t_conteudo", "t_progresso", "t_editor", "t_offline", "t_figuras"];
const todos = fs.readdirSync(__dirname).filter(f => /^t_.*\.js$/.test(f)).map(f => f.slice(0, -3));
const arquivos = [...ORDEM.filter(a => todos.includes(a)), ...todos.filter(a => !ORDEM.includes(a))];

const args = process.argv.slice(2);
const escolhidos = args.filter(a => a.startsWith("t_")).map(a => a.replace(/\.js$/, ""));
const filtro = args.find(a => !a.startsWith("t_"));
for (const a of escolhidos) if (!todos.includes(a)) { console.log("Arquivo de teste não existe: testes/" + a + ".js"); process.exit(1); }

(async () => {
  const s = await servidor();
  const url = "http://127.0.0.1:" + s.address().port + "/index.html";
  const nav = await chromium.launch();
  for (const arq of arquivos) {
    if (escolhidos.length && !escolhidos.includes(arq)) continue;
    const testes = require("./" + arq);
    for (const nome of Object.keys(testes)) {
      if (filtro && !nome.includes(filtro)) continue;
      console.log("• " + nome + "  (" + arq + ")");
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
      } catch (e) { placar.falhas++; console.log("  FALHOU  " + e.message.split("\n")[0]); }
      confere(erros.length === 0, "sem erros no console" + (erros.length ? ": " + erros.join(" | ") : ""));
      await ctx.close();
    }
  }
  await nav.close(); s.close();
  console.log("\n" + placar.passos + " verificações, " + placar.falhas + " falha(s).");
  process.exit(placar.falhas ? 1 : 0);
})();
