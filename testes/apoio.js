/* Peças comuns dos testes de navegador: servidor local, conferência, responder perguntas e abrir telas.
   Usado por todos os arquivos t_*.js; quem roda tudo é o testes.js. */
"use strict";
const http = require("http"), fs = require("fs"), path = require("path");
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

const placar = { falhas: 0, passos: 0 };
function confere(cond, msg) { placar.passos++; if (cond) console.log("  ok  " + msg); else { placar.falhas++; console.log("  FALHOU  " + msg); } }

/* Devolve o texto da alternativa correta de uma pergunta, procurando em todos os bancos do app. */
/* fonte: "g" (grupos), "f" (desafio final), "m" (mini desafios) ou "p" (progresso); a mesma pergunta pode existir em mais de um banco */
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

/* abre uma tela pelo menu: as seções pelo menu de baixo e as telas pelos cartões da seção */
const HUBS = { tree: "estudar", fic: "estudar", temp: "estudar", meta: "estudar", pa: "estudar", dis: "estudar", cic: "estudar", nat: "estudar", prat: "estudar", quiz: "jogar", cls: "jogar", img: "jogar" };
async function abrir(p, t) {
  if (!HUBS[t]) { await p.click(`#tabs button[data-t="${t}"]`); return; }
  await p.click(`#tabs button[data-t="${HUBS[t]}"]`);
  await p.click(`#${HUBS[t]} .ht[data-t="${t}"]`);
}

async function perfil(p, nome) { await abrir(p, "home"); await p.fill("#wn", nome); await p.click("#wok"); }
async function finalCom(p, erros) {
  await abrir(p, "quiz");
  for (let i = 0; i < 10; i++) { await responder(p, "#qbox", ".qq", i >= erros, "f"); await p.click("#qn-final"); }
}
const textoCaderno = p => p.textContent("#pgbox .pgc");

/* tira o modo offline (service worker e cache), para o navegador buscar um banco-proprio.js simulado */
const semCache = p => p.evaluate(async () => { for (const r of await navigator.serviceWorker.getRegistrations()) await r.unregister(); for (const k of await caches.keys()) await caches.delete(k); });

module.exports = { RAIZ, servidor, placar, confere, responder, HUBS, abrir, perfil, finalCom, textoCaderno, semCache };
