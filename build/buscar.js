#!/usr/bin/env node
/* Procura um fato no próprio app antes de pesquisar fora (passo 1 da "Pesquisa padrão").
   Uso: node build/buscar.js palavra [outra ...] [--max 20] [--tudo]
   - Acha os textos do dados.js (e do banco-proprio.js) que tenham TODAS as palavras, sem diferenciar
     maiúsculas e acentos, e mostra onde estão (ex.: QZ[12][0], G[3].pool[2].w) e um trecho curto.
   - Também procura nos outros arquivos do app e no FONTES-CONFIAVEIS.md (arquivo:linha + trecho).
   - --tudo mostra o item inteiro de cada achado (ex.: a pergunta com alternativas e explicação). */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const RAIZ = path.join(__dirname, "..");
const args = process.argv.slice(2);
let max = 20, tudo = false;
const termos = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--max") max = +args[++i];
  else if (args[i] === "--tudo") tudo = true;
  else termos.push(args[i]);
}
if (!termos.length) { console.log("Uso: node build/buscar.js palavra [outra ...] [--max 20] [--tudo]"); process.exit(1); }
const norm = s => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const T = termos.map(norm);
const tem = s => { const n = norm(s); return T.every(t => n.includes(t)); };
const corta = (s, n) => (s.length > n ? s.slice(0, n) + "…" : s);
const trecho = (s, larg = 70) => {
  s = String(s).replace(/\s+/g, " ");
  const k = Math.max(0, norm(s).indexOf(T[0]));
  const a = Math.max(0, k - larg), b = Math.min(s.length, k + T[0].length + larg);
  return (a ? "…" : "") + s.slice(a, b) + (b < s.length ? "…" : "");
};

// 1) dados do app: carrega os arquivos como o navegador faria e percorre todos os textos
const ctx = { console: { log() {}, warn() {}, error() {} } }; ctx.window = ctx; vm.createContext(ctx);
const ARQ_DADOS = ["util.js", "dados.js", "banco-proprio.js"];
let codigo = "";
for (const f of ARQ_DADOS) {
  const p = path.join(RAIZ, f);
  if (!fs.existsSync(p)) continue;
  const s = fs.readFileSync(p, "utf8");
  try { vm.runInContext(s, ctx, { filename: f }); codigo += s; } catch (e) { console.log(`(não consegui carregar ${f}: ${e.message.split("\n")[0]})`); }
}
const nomes = [...new Set((codigo.match(/^(?:const|let|var) +([A-Za-z_$][\w$]*)/gm) || []).map(l => l.split(/ +/)[1]))];
const achados = [];
const visto = new Set();
/* "item" = objeto ou lista pequena (ex.: uma pergunta com alternativas); a busca vale para o item inteiro */
const fundo = v => (v && typeof v === "object" ? 1 + Math.max(0, ...Object.values(v).map(fundo)) : 0);
const sub = (onde, k) => (/^\d+$/.test(k) ? `${onde}[${k}]` : /^[A-Za-z_$][\w$]*$/.test(k) ? `${onde}.${k}` : `${onde}["${k}"]`);
function anda(v, onde) {
  if (typeof v === "string") { if (tem(v)) achados.push({ onde, v }); return; }
  if (!v || typeof v !== "object" || visto.has(v)) return;
  visto.add(v);
  if (fundo(v) <= 2) { if (tem(JSON.stringify(v))) achados.push({ onde, v }); return; }
  for (const k of Object.keys(v)) anda(v[k], sub(onde, k));
}
for (const n of nomes) { let v; try { v = vm.runInContext(n, ctx); } catch (e) { continue; } if (typeof v !== "function") anda(v, n); }

/* no resumo: o primeiro texto do item que tem a 1ª palavra */
function primeiro(v, onde) {
  if (typeof v === "string") return norm(v).includes(T[0]) ? [onde, v] : null;
  if (!v || typeof v !== "object") return null;
  for (const k of Object.keys(v)) { const r = primeiro(v[k], sub(onde, k)); if (r) return r; }
  return null;
}
console.log("== Dados do app (dados.js, banco-proprio.js)");
let n = 0;
for (const a of achados) {
  if (++n > max) continue;
  if (tudo) console.log(`${a.onde}: ${typeof a.v === "string" ? a.v : corta(JSON.stringify(a.v, null, 1).replace(/\n\s*/g, " "), 900)}`);
  else { const [o, t] = primeiro(a.v, a.onde) || [a.onde, JSON.stringify(a.v)]; console.log(`${o}: ${trecho(t)}`); }
}
if (n > max) console.log(`… e mais ${n - max} (use --max)`);
if (!n) console.log("(nada)");

// 2) outros arquivos do app: arquivo:linha + trecho
console.log("== Outros arquivos");
const FORA = new Set([...ARQ_DADOS, "sw.js"]);
const outros = fs.readdirSync(RAIZ).filter(f => (/\.(js|html)$/.test(f) && !FORA.has(f) && f !== "animais-8ano.html") || f === "FONTES-CONFIAVEIS.md").sort();
let m = 0;
for (const f of outros) {
  fs.readFileSync(path.join(RAIZ, f), "utf8").split("\n").forEach((l, i) => {
    if (tem(l) && ++m <= max) console.log(`${f}:${i + 1} ${trecho(l)}`);
  });
}
if (m > max) console.log(`… e mais ${m - max} (use --max)`);
if (!m) console.log("(nada)");
