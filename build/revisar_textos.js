#!/usr/bin/env node
/* Motor de revisão dos textos que não são perguntas (só avisa, nunca altera nada).
   Uso: node build/revisar_textos.js [bloco ...]
     blocos: G (grupos), PA (fauna do Pará), DIS (verminoses), CIC (ciclos), CUR (curiosidades),
             NAT (naturalistas), PR (atividades). Sem bloco = todos.
   Mostra um resumo curto e grava o relatório em revisao/textos.md (ou textos-<blocos>.md).
   Avisos: numero (conferir em 2 fontes), diverge (mesmo fato com número diferente em outra parte
   do app), termo (palavra técnica sem explicação na 1ª vez no cartão), frase (longa demais),
   remedio, saude (verminose sem orientar atendimento), exagero, cientifico (nome fora do padrão).
   Calibrar: build/fichas/textos.json. */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const RAIZ = process.env.TEXTOS_RAIZ || path.join(__dirname, "..");
const FICHA = path.join(__dirname, "fichas", "textos.json");
const BLOCOS = ["G", "PA", "DIS", "CIC", "CUR", "NAT", "PR"];
const TIPOS = { numero: "números e datas para conferir em 2 fontes", diverge: "mesmo fato com número diferente em outra parte do app",
  termo: "termo técnico sem explicação na 1ª vez", frase: "frase longa", remedio: "menção a remédio",
  saude: "verminose sem orientar a procurar atendimento", exagero: "palavra que pode exagerar", cientifico: "nome científico fora do padrão" };

const norm = s => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const limpa = s => String(s).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
const trecho = (s, k, n = 50) => (k > n ? "…" : "") + s.slice(Math.max(0, k - n), k + n).trim() + (k + n < s.length ? "…" : "");

function checar_ficha(f) {
  const erros = [];
  for (const k of ["termos", "exageros", "remedio", "saude_ok"])
    if (!Array.isArray(f[k]) || !f[k].length || f[k].some(x => typeof x !== "string" || !x.trim())) erros.push(`"${k}" precisa ser uma lista de textos`);
  if (f.conferidos !== undefined && (!Array.isArray(f.conferidos) || f.conferidos.some(x => typeof x !== "string" || x.split(" | ").length !== 3)))
    erros.push(`"conferidos" precisa ser uma lista de textos no formato "tipo | lugar | palavra"`);
  if (!(f.palavras_max > 5)) erros.push(`"palavras_max" precisa ser um número maior que 5`);
  return erros;
}

// ---- carregar o app (como o navegador) e montar os cartões de texto ----
function carregar() {
  const ctx = { console: { log() {}, warn() {}, error() {} } }; ctx.window = ctx; vm.createContext(ctx);
  for (const f of ["util.js", "dados.js"])
    vm.runInContext(fs.readFileSync(path.join(RAIZ, f), "utf8").replace(/^(const|let) /gm, "var "), ctx, { filename: f });
  const ext = fs.readFileSync(path.join(RAIZ, "extras.js"), "utf8");
  const CIC = {}; let chave = null;
  for (const l of ext.slice(ext.indexOf("const CIC")).split("\n")) {
    const c = l.match(/^\s{2}(\w+): \[/); if (c) chave = c[1];
    const m = l.match(/\{ t: "([^"]*)", d: "([^"]*)"/); if (m && chave) (CIC[chave] = CIC[chave] || []).push(m);
    if (/^\};/.test(l)) break;
  }
  return { ctx, CIC };
}

function cartoes({ ctx, CIC }) {
  const L = [], add = (bloco, id, nome, cient, campos) =>
    L.push({ bloco, id, nome, cient, textos: campos.filter(([, s]) => typeof s === "string" && s.trim()).map(([o, s]) => ({ onde: o, s: limpa(s) })) });
  ctx.G.forEach((g, i) => add("G", `G[${i}] ${g.n}`, g.n, "", [["sub", g.sub], ...g.f.map((s, j) => [`f[${j}]`, s]), ["r", g.r], ["p", g.p], ["k", g.k]].map(([o, s]) => [`G[${i}].${o}`, s])));
  ctx.PA.forEach((p, i) => add("PA", `PA[${i}] ${p[0]}`, p[0], p[1], p.map((s, j) => [`PA[${i}][${j}]`, s]).filter((_, j) => j >= 3)));
  // DIS[i][2] é só o nome do grupo (ex.: "Nematódeo"), já explicado no cartão do grupo: não entra
  ctx.DIS.forEach((d, i) => add("DIS", `DIS[${i}] ${d[0]}`, d[0], d[1], d.map((s, j) => [`DIS[${i}][${j}]`, s]).filter((_, j) => j >= 3)));
  for (const k in CIC) add("CIC", `CIC.${k}`, "", "", CIC[k].flatMap((m, j) => [[`CIC.${k}[${j}].t`, m[1]], [`CIC.${k}[${j}].d`, m[2]]]));
  ctx.CUR.forEach((c, i) => add("CUR", `CUR[${i}] (${c[0]})`, "", "", [[`CUR[${i}][1]`, c[1]]]));
  ctx.NAT.forEach((n, i) => add("NAT", `NAT[${i}] ${n[0]}`, n[0], "", n.map((s, j) => [`NAT[${i}][${j}]`, s]).filter((_, j) => j >= 1)));
  ctx.PR.forEach((p, i) => add("PR", `PR[${i}] ${p.t}`, "", "", [["o", p.o], ["m", p.m], ...p.p.map((s, j) => [`p[${j}]`, s]), ["q", p.q], ["c", p.c]].map(([o, s]) => [`PR[${i}].${o}`, s])));
  return L;
}

// todos os textos do app (perguntas inclusive), para achar divergências
function todosTextos({ ctx, CIC }) {
  const out = [], anda = (v, onde) => {
    if (typeof v === "string") out.push({ onde, s: limpa(v) });
    else if (v && typeof v === "object") for (const k in v) anda(v[k], Array.isArray(v) ? `${onde}[${k}]` : `${onde}.${k}`);
  };
  for (const k of ["G", "EXTRA", "EXTRA2", "BANK3", "BANK4", "QZ", "MQX", "MQ0", "PA", "DIS", "CUR", "NAT", "PR"]) if (ctx[k]) anda(ctx[k], k);
  for (const k in CIC) CIC[k].forEach((m, j) => out.push({ onde: `CIC.${k}[${j}].d`, s: m[2] }));
  return out;
}

// ---- conferências ----
const UNI = [["a.C.", "a.C."], ["d.C.", "d.C."], ["%", "%"], ["°C", "°C"], ["cm", "cm"], ["mm", "mm"], ["km", "km"], ["kg", "kg"], ["quilos", "kg"],
  ["metros", "m"], ["metro", "m"], ["m", "m"], ["toneladas", "t"], ["anos", "anos"], ["ano", "anos"], ["dias", "dias"], ["meses", "meses"], ["horas", "horas"], ["litros", "L"]];
const RE_NUM = new RegExp(String.raw`(\d+(?:[.,]\d+)?)(?:\s?(milh(?:ão|ões)|bilh(?:ão|ões)|mil(?![\wà-ú])))?(?:\s?(?:de )?(${UNI.map(u => u[0].replace(/\./g, "\\.")).join("|")})(?![\wà-ú]))?`, "g");
function numeros(s) {
  const r = []; let m; RE_NUM.lastIndex = 0;
  while ((m = RE_NUM.exec(s))) r.push({ k: m.index, txt: m[0].trim(), val: m[1] + (m[2] ? " " + m[2] : ""), uni: m[3] ? UNI.find(u => u[0] === m[3])[1] : "" });
  return r;
}
const nomesCient = it => String(it.cient || "").split(/ e |, /).map(c => c.replace(/\(.*?\)/g, "").trim()).filter(Boolean);
const frases = s => s.split(/(?<=[.!?])\s+/).filter(Boolean);
const temPalavra = (s, p) => new RegExp(`(^|[^a-z])${norm(p).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z]|$)`).test(norm(s));

function explicado(s, k, len) {
  const antes = s.slice(0, k), depois = s.slice(k + len).replace(/^[\wà-úÀ-Ú-]*/, "");
  if ((antes.match(/\(/g) || []).length > (antes.match(/\)/g) || []).length) return true;
  if (/^(\s?\(|\s?:|,? (é|são|que|ou seja)\b|\s?—|\s?–)/.test(depois)) return true;
  return /(chamad[oa]s?|conhecid[oa]s?|o nome de|ou seja,?)\s*$/i.test(norm(antes).slice(-40));
}

function analisar(itens, ficha, todos) {
  const av = [], pega = (tipo, it, onde, msg) => av.push({ tipo, bloco: it.bloco, item: it.id, onde, msg });
  for (const it of itens) {
    const vistos = new Set();
    for (const { onde, s } of it.textos) {
      for (const n of numeros(s)) if (!(n.k === 0 && /^\d+\.\s/.test(s))) pega("numero", it, onde, `${n.txt}: "${trecho(s, n.k)}"`);
      for (const f of frases(s)) { const w = f.split(/\s+/).length; if (w > ficha.palavras_max) pega("frase", it, onde, `${w} palavras: "${f.slice(0, 90)}…"`); }
      for (const p of ficha.exageros) if (temPalavra(s, p)) pega("exagero", it, onde, `"${p}": "${trecho(s, norm(s).search(new RegExp(norm(p))))}"`);
      for (const p of ficha.remedio) if (norm(s).includes(norm(p))) pega("remedio", it, onde, `"${p}": "${trecho(s, norm(s).indexOf(norm(p)))}"`);
      for (const t of ficha.termos) {
        if (vistos.has(t)) continue;
        const re = new RegExp(`(^|[^a-z])(${norm(t)})`), m = norm(s).match(re);
        if (!m) continue;
        vistos.add(t);
        const k = m.index + m[1].length;
        if (!explicado(s, k, t.length)) pega("termo", it, onde, `"${t.includes(" ") ? s.slice(k, k + t.length) : s.slice(k).match(/^[\wà-úÀ-Ú-]+/)[0]}": "${trecho(s, k)}"`);
      }
    }
    if (it.bloco === "DIS" && !it.textos.some(({ s }) => ficha.saude_ok.some(p => temPalavra(s, p) || norm(s).includes(norm(p) + " ")))) pega("saude", it, "", "não orienta a procurar a Unidade de Saúde");
    for (const n of nomesCient(it)) if (!/^[A-Z][a-z]+( [a-z]+)?( spp?\.)?$/.test(n)) pega("cientifico", it, "", `"${n}" (padrão: Gênero espécie)`);
    const apelidos = [it.nome, ...nomesCient(it)].filter(a => a && a.length > 3);
    const meus = new Set(it.textos.map(t => t.onde));
    const nums = it.textos.flatMap(({ onde, s }) => frases(s).filter(f => apelidos.some(a => norm(f).includes(norm(a))) || it.bloco !== "G")
      .flatMap(f => numeros(f).filter(n => n.uni)));
    for (const n of nums) for (const o of todos) {
      if (meus.has(o.onde) || o.onde.startsWith(it.id.split(" ")[0] + "[")) continue;
      for (const f of frases(o.s)) if (apelidos.some(a => norm(f).includes(norm(a)))) {
        const out = numeros(f).filter(x => x.uni === n.uni && x.val !== n.val);
        if (out.length && !numeros(f).some(x => x.uni === n.uni && x.val === n.val)) pega("diverge", it, o.onde, `aqui "${n.txt}", lá "${out.map(x => x.txt).join(", ")}": "${f.slice(0, 110)}"`);
      }
    }
  }
  // nome científico escrito diferente em outra parte do app (gênero com minúscula ou espécie que não existe no app)
  const conhecidos = new Set(itens.flatMap(nomesCient)), generos = new Map();
  for (const it of itens) for (const n of nomesCient(it)) generos.set(n.split(" ")[0], it);
  for (const o of todos) for (const [gen, it] of generos) {
    const re = new RegExp(`\\b(${gen}) ([a-z]{4,})\\b`, "gi"); let m;
    while ((m = re.exec(o.s))) {
      const nome = m[0], certo = gen + " " + m[2];
      if (m[1] !== gen && conhecidos.has(certo)) pega("cientifico", it, o.onde, `"${nome}": o gênero começa com maiúscula`);
      else if (m[1] === gen && !conhecidos.has(nome) && /(us|is|a|um|i|ae|ii|er|es)$/.test(m[2]) && !/^(que|com|para|pela|pelo)$/.test(m[2])) pega("cientifico", it, o.onde, `"${nome}" não aparece nos nomes oficiais do app`);
    }
  }
  const unicos = new Map(av.map(a => [a.tipo + a.item + a.onde + a.msg, a]));
  return [...unicos.values()];
}

/* Avisos já conferidos pelo dono ficam na ficha ("tipo | lugar | palavra") e saem do relatório.
   Se o texto mudar (outro número, outra palavra), o aviso volta. */
const chave = a => `${a.tipo} | ${a.onde} | ${a.msg.split(': "')[0].replace(/"/g, "")}`;
function separar(av, ficha) {
  const lista = new Set(ficha.conferidos || []), novos = av.filter(a => !lista.has(chave(a)));
  const usados = new Set(av.map(chave)), sobrando = [...lista].filter(c => !usados.has(c));
  return { novos, conferidos: av.length - novos.length, sobrando };
}

function relatorio(av, blocos) {
  const md = [`# Revisão dos textos (${blocos.join(", ")})`, "", "Gerado por `node build/revisar_textos.js`. São avisos para conferir, não erros certos.", ""];
  for (const b of blocos) {
    const doBloco = av.filter(a => a.bloco === b); if (!doBloco.length) continue;
    md.push(`## ${b}`, "");
    for (const item of [...new Set(doBloco.map(a => a.item))]) {
      md.push(`### ${item}`);
      for (const a of doBloco.filter(x => x.item === item)) md.push(`- **${a.tipo}**${a.onde ? ` (${a.onde})` : ""}: ${a.msg}`);
      md.push("");
    }
  }
  return md.join("\n");
}

function main() {
  const ficha = JSON.parse(fs.readFileSync(FICHA, "utf8")), erros = checar_ficha(ficha);
  if (erros.length) { console.log("Ficha com problema (build/fichas/textos.json):\n- " + erros.join("\n- ")); return 1; }
  const pedidos = process.argv.slice(2).map(s => s.toUpperCase()), ruins = pedidos.filter(b => !BLOCOS.includes(b));
  if (ruins.length) { console.log(`Bloco desconhecido: ${ruins.join(", ")}. Use: ${BLOCOS.join(", ")}`); return 1; }
  const blocos = pedidos.length ? pedidos : BLOCOS, app = carregar();
  const itens = cartoes(app).filter(i => blocos.includes(i.bloco)), { novos: av, conferidos, sobrando } = separar(analisar(itens, ficha, todosTextos(app)), ficha);
  const arq = path.join("revisao", pedidos.length ? `textos-${blocos.join("-")}.md` : "textos.md");
  fs.mkdirSync(path.join(RAIZ, "revisao"), { recursive: true });
  fs.writeFileSync(path.join(RAIZ, arq), relatorio(av, blocos));
  console.log(`Revisados: ${itens.length} cartões (${blocos.join(", ")}), ${itens.reduce((n, i) => n + i.textos.length, 0)} textos.`);
  for (const t in TIPOS) { const n = av.filter(a => a.tipo === t).length; if (n) console.log(`- ${t}: ${n} (${TIPOS[t]})`); }
  if (conferidos) console.log(`Já conferidos (fora do relatório): ${conferidos}`);
  if (sobrando.length && !pedidos.length) console.log(`Na lista de conferidos, mas sem aviso (texto mudou? pode tirar da ficha): ${sobrando.length}\n- ` + sobrando.join("\n- "));
  console.log(`Total: ${av.length} aviso(s) novo(s). Relatório: ${arq}`);
  return 0;
}

module.exports = { analisar, separar, chave, todosTextos, checar_ficha, numeros, explicado, cartoes, carregar, BLOCOS };
if (require.main === module) process.exitCode = main();
