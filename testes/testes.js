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
const CERTA = `(q,fonte,ops)=>{q=q.trim();
  if(fonte==="g")for(const g of G)for(const x of g.pool)if(x.q.trim()===q)return x.o[x.a];
  if(fonte==="f")for(const x of QZ)if(x[0].trim()===q)return x[1][x[2]];
  if(fonte==="m")for(const t in MINI)for(const x of MINI[t])if(x[0].trim()===q)return x[1][0];
  if(fonte==="p"){const it=PG.item(PG.idDe(q,ops));return it?it.o[it.a]:null;}
  return null;}`;

async function responder(p, caixa, seletorPergunta, certo, fonte) {
  const q = await p.$eval(caixa + " " + seletorPergunta, e => e.textContent);
  const ops = await p.$$eval(caixa + " .opt", bs => bs.map(b => b.textContent));
  const alvo = await p.evaluate(`(${CERTA})(${JSON.stringify(q)},${JSON.stringify(fonte)},${JSON.stringify(ops)})`);
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
    await p.click("#qn-final");
  }
  const fim = await p.textContent("#qbox");
  confere(/Você acertou\s*8\s*de 10/.test(fim), "resultado 8 de 10");
  confere(/Maior sequência de acertos:\s*8/.test(fim), "maior sequência 8");
  confere(!!(await p.$("#rv-final")), "botão para rever os 2 erros");
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

async function perfil(p, nome) { await p.click('#tabs button[data-t="home"]'); await p.fill("#wn", nome); await p.click("#wok"); }
async function finalCom(p, erros) {
  await p.click('#tabs button[data-t="quiz"]');
  for (let i = 0; i < 10; i++) { await responder(p, "#qbox", ".qq", i >= erros, "f"); await p.click("#qn-final"); }
}
const textoCaderno = p => p.textContent("#pgbox .pgc");

testes["caderno de erros: erros entram e saem depois de 2 acertos seguidos"] = async (p) => {
  await perfil(p, "Ana");
  await finalCom(p, 2);
  await p.click('#tabs button[data-t="prog"]');
  confere(/2\s*perguntas para treinar/.test(await textoCaderno(p)), "2 perguntas no caderno");
  confere((await p.$$("#pgbox .pgl")).length === 20, "desempenho com 20 temas");
  for (let volta = 0; volta < 2; volta++) {
    await p.click("#pg-erros");
    for (let i = 0; i < 2; i++) { await responder(p, "#pgrun", ".qq", true, "p"); await p.click("#qn-erros"); }
    await p.click("#vt-erros");
  }
  confere(/0\s*perguntas para treinar/.test(await textoCaderno(p)), "caderno vazio depois de 2 acertos seguidos em cada");
  confere((await p.$$("#pgbox .pgrl")).length === 3, "3 rodadas no histórico");
};

testes["continua o desafio final de onde parou"] = async (p) => {
  await perfil(p, "Bia");
  await p.click('#tabs button[data-t="quiz"]');
  for (let i = 0; i < 3; i++) { await responder(p, "#qbox", ".qq", true, "f"); await p.click("#qn-final"); }
  await p.reload();
  await p.click('#tabs button[data-t="quiz"]');
  confere(/parou na pergunta\s*4 de 10/.test(await p.textContent("#qbox")), "oferece continuar da pergunta 4");
  await p.click("#rt-final");
  confere(/Pergunta 4\/10/.test(await p.textContent("#qbox .qtop")), "continua na pergunta 4");
  confere(/⭐ 3/.test(await p.textContent("#qbox .qtop")), "mantém os 3 pontos");
};

testes["simulado: 20 perguntas, sem resposta conta na correção, ranking"] = async (p) => {
  await perfil(p, "Caio");
  await p.click('#tabs button[data-t="prog"]');
  await p.click("#pg-sim");
  confere(/Pergunta 1\/20/.test(await p.textContent("#pgrun .qtop")), "simulado com 20 perguntas");
  confere(!(await p.$("#pgrun .hint")), "simulado sem dica");
  for (let i = 0; i < 5; i++) await responder(p, "#pgrun", ".qq", true, "p");
  for (let i = 5; i < 20; i++) await p.click("#qp-simulado");
  const t = await p.textContent("#pgrun");
  confere(/acertou\s*5\s*de 20/.test(t), "5 de 20");
  confere((await p.$$("#pgrun ol.sim li")).length === 20 && /Sem resposta/.test(t), "correção completa com as sem resposta");
  confere(/1º lugar/.test(t), "entra no ranking");
};

testes["leva o progresso para outro aparelho com um código"] = async (p) => {
  await perfil(p, "Duda");
  await finalCom(p, 1);
  await p.click('#tabs button[data-t="prog"]');
  await p.click("#pg-exp");
  const cod = await p.inputValue("#pg-cod");
  confere(cod.startsWith("AN8-"), "gera o código");
  await p.evaluate(() => { localStorage.clear(); localStorage.setItem("an8inst", "no"); });
  await p.reload();
  await perfil(p, "Outro");
  await p.click('#tabs button[data-t="prog"]');
  await p.fill("#pg-cod", cod);
  await p.click("#pg-imp");
  confere(/Duda/.test(await p.textContent("#pgbox .sub")), "troca para o aluno do código");
  confere(/1\s*pergunta para treinar/.test(await textoCaderno(p)), "caderno de erros veio junto");
  await p.fill("#pg-cod", "AN8-bobagem");
  await p.click("#pg-imp");
  confere(/inválido/.test(await p.textContent("#pg-msg")), "código inválido é recusado");
};

testes["opções: tema claro, vibração e compartilhar resultado"] = async (p) => {
  await p.click("#op"); await p.click("#tm");
  confere((await p.getAttribute("html", "data-theme")) === "claro", "tema claro ligado");
  await p.reload();
  confere((await p.getAttribute("html", "data-theme")) === "claro", "tema claro continua depois de recarregar");
  await p.click("#op"); await p.click("#tm");
  confere(/automático/.test(await p.textContent("#tm")), "terceira opção: automático");
  await p.click("#vb");
  confere(/não/.test(await p.textContent("#vb")), "vibração desligada");
  await p.reload();
  confere(/não/.test(await p.textContent("#vb")), "vibração continua desligada depois de recarregar");
  await p.evaluate(() => { window.__txt = null; Object.defineProperty(navigator, "share", { value: t => { window.__txt = t.text; return Promise.resolve(); }, configurable: true }); });
  await finalCom(p, 0);
  await p.click("#sh-final");
  confere(/acertei 10 de 10/.test(await p.evaluate(() => window.__txt)), "compartilha o texto do resultado");
};

testes["curiosidade, naturalistas, ciclos dos vermes e fontes"] = async (p) => {
  const c1 = await p.textContent("#curi p");
  confere(c1.length > 20, "curiosidade na tela inicial");
  await p.click("#curn");
  confere((await p.textContent("#curi p")) !== c1, "botão mostra outra curiosidade");
  await p.click('#tabs button[data-t="nat"]');
  confere((await p.$$("#natg .card")).length === 7, "7 naturalistas");
  await p.click("#natg .card >> nth=6");
  confere(/Museu Paraense Emílio Goeldi/.test(await p.textContent("#panel")), "painel do Goeldi abre");
  await p.click("#panel .x");
  for (let i = 0; i < 5; i++) { await responder(p, "#nat .mini", ".mqq", true, "m"); await p.click("#nat #mnb"); }
  confere(/acertou\s*5\s*de 5/.test(await p.textContent("#nat .mini")), "desafio dos naturalistas");
  await p.click('#tabs button[data-t="cic"]');
  for (const m of ["esq", "ten", "lom"]) {
    await p.click(`[data-c="${m}"]`);
    const n = (await p.$$("#cdots .dot")).length;
    await p.click(`#cdots .dot >> nth=${n - 1}`);
    confere(n === 6 && /prevenir/.test(await p.textContent("#cT")), "ciclo " + m + ": 6 etapas até a prevenção");
  }
  await p.click('#tabs button[data-t="meta"]');
  await p.click("#dots .dot >> nth=2");
  confere(/Pupa/.test(await p.textContent("#stT")), "metamorfose continua funcionando");
  await p.click("#op"); await p.click("#fo");
  confere(/ICMBio/.test(await p.textContent("#md")), "tela de fontes");
};

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
  await p.evaluate(async () => { for (const r of await navigator.serviceWorker.getRegistrations()) await r.unregister(); for (const k of await caches.keys()) await caches.delete(k); });
  const q = await ctx.newPage();
  await q.route("**/banco-proprio.js", r => r.fulfill({ status: 200, contentType: "text/javascript", body: arq }));
  await q.goto(url);
  confere(await q.evaluate(() => G.find(g => g.id === "porifero").pool.some(x => x.q === "Pergunta de teste do professor?")), "pergunta nova entra no desafio dos poríferos");
  confere(await q.evaluate(t => !QZ.some(x => x[0] === t), oculta), "pergunta oculta sai do Desafio final");
  await q.close();
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
