#!/usr/bin/env node
/* Confere o conteúdo do app (dados.js e, se existir, banco-proprio.js).
   Uso: node validar-banco.js
   Aponta: perguntas sem texto, alternativas vazias ou repetidas, gabarito fora das alternativas,
   grupos que não existem e perguntas repetidas. Termina com erro se achar algum problema. */
"use strict";
const fs = require("fs"), vm = require("vm"), path = require("path");
const D = __dirname + path.sep;
const ctx = { console };
vm.createContext(ctx);
let codigo = fs.readFileSync(D + "util.js", "utf8") + "\n" + fs.readFileSync(D + "dados.js", "utf8");
if (fs.existsSync(D + "banco-proprio.js")) codigo += "\n" + fs.readFileSync(D + "banco-proprio.js", "utf8");
vm.runInContext(codigo + "\n;this.X={G,EXTRA,EXTRA2,BANK3,BANK4,QZ,PA,NG,MQX,MQ0,DIS,PR,AN,EMJ,CUR,NAT,FONTES,FONTES_MAIS,PROPRIO:typeof PROPRIO==='undefined'?null:PROPRIO};", ctx);
const X = ctx.X;
const erros = [], avisos = [];
const ids = new Set(X.G.map(g => g.id));
const txt = v => typeof v === "string" && v.trim().length > 0;

/* uma pergunta: texto, alternativas, índice da correta, explicação */
function pergunta(onde, q, o, a, w) {
  if (!txt(q)) erros.push(onde + ": pergunta sem texto");
  if (!Array.isArray(o) || o.length < 2) { erros.push(onde + ": precisa de pelo menos 2 alternativas"); return; }
  o.forEach((x, i) => { if (!txt(x)) erros.push(onde + ": alternativa " + (i + 1) + " vazia"); });
  const norm = o.map(x => String(x).trim().toLowerCase());
  if (new Set(norm).size !== norm.length) erros.push(onde + ": alternativas repetidas (" + o.join(" | ") + ")");
  if (!Number.isInteger(a) || a < 0 || a >= o.length) erros.push(onde + ": gabarito fora das alternativas (" + a + ")");
  if (!txt(w)) avisos.push(onde + ": sem explicação");
}
/* a mesma pergunta em bancos diferentes é permitida (aparece em jogos diferentes); dentro do mesmo banco, não */
const vistas = new Map();
function repetida(onde, q) {
  const k = onde.split(/[[.]/)[0] + "|" + String(q).trim().toLowerCase();
  if (vistas.has(k)) avisos.push(onde + ": mesma pergunta que " + vistas.get(k) + ' ("' + String(q).slice(0, 60) + '")');
  else vistas.set(k, onde);
}

/* grupos */
if (ids.size !== X.G.length) erros.push("G: há grupos com o mesmo id");
X.G.forEach((g, i) => {
  const onde = "G[" + i + "] " + g.id;
  ["id", "t", "n", "c", "tag", "sub", "r", "p", "k"].forEach(c => { if (!txt(g[c])) erros.push(onde + ": falta o campo " + c); });
  if (g.t !== "inv" && g.t !== "vert") erros.push(onde + ": t deve ser inv ou vert");
  ["f", "e"].forEach(c => { if (!Array.isArray(g[c]) || !g[c].length) erros.push(onde + ": falta a lista " + c); });
  if (!g.q) erros.push(onde + ": falta a pergunta principal (q)");
  else { pergunta(onde + " q", g.q.q, g.q.o, g.q.a, g.q.w); repetida(onde + " q", g.q.q); }
});

/* bancos por grupo (1ª alternativa = correta) */
["EXTRA", "EXTRA2", "BANK3", "BANK4"].forEach(nome => {
  const B = X[nome];
  Object.keys(B).forEach(gid => {
    if (!ids.has(gid)) erros.push(nome + "." + gid + ": grupo não existe");
    B[gid].forEach((x, i) => { const onde = nome + "." + gid + "[" + i + "]"; pergunta(onde, x[0], x[1], 0, x[2]); repetida(onde, x[0]); });
  });
});
["EXTRA", "EXTRA2", "BANK3", "BANK4"].forEach(nome => X.G.forEach(g => { if (!X[nome][g.id]) erros.push(nome + ": falta o grupo " + g.id); }));

/* desafio final (índice da correta no 3º campo) */
X.QZ.forEach((x, i) => { const onde = "QZ[" + i + "]"; pergunta(onde, x[0], x[1], x[2], x[3]); repetida(onde, x[0]); });

/* mini desafios das abas */
const titulos = new Set([...Object.keys(X.MQ0), ...Object.keys(X.MQX)]);
Object.keys(X.MQX).forEach(t => { if (!X.MQ0[t]) avisos.push('MQX."' + t + '": não há mini desafio com esse título (as perguntas não aparecem)'); });
titulos.forEach(t => [...(X.MQ0[t] || []), ...(X.MQX[t] || [])].forEach((x, i) => { const onde = '"' + t + '"[' + i + "]"; pergunta(onde, x[0], x[1], 0, x[2]); repetida(onde, x[0]); }));

/* jogos */
X.AN.forEach((x, i) => { if (!txt(x[0]) || !ids.has(x[1])) erros.push("AN[" + i + "] " + x[0] + ": grupo inexistente " + x[1]); });
X.EMJ.forEach((x, i) => { if (!txt(x[0]) || !ids.has(x[1]) || !txt(x[2])) erros.push("EMJ[" + i + "] " + x[0] + ": dados incompletos ou grupo inexistente"); });
const nomes = new Map();
X.AN.forEach((x, i) => { const k = x[0].toLowerCase(); if (nomes.has(k) && nomes.get(k) !== x[1]) erros.push("AN: " + x[0] + " aparece em dois grupos"); nomes.set(k, x[1]); });
X.PA.forEach((x, i) => { if (!txt(x[0]) || !txt(x[1]) || !X.NG[x[2]] || !txt(x[3])) erros.push("PA[" + i + "] " + x[0] + ": dados incompletos ou grupo inexistente " + x[2]); });
X.DIS.forEach((x, i) => { if (!Array.isArray(x) || x.slice(0, 5).some(v => !txt(v))) erros.push("DIS[" + i + "]: campo vazio (o 6º, curiosidade, é opcional)"); });
X.PR.forEach((x, i) => ["t", "o", "m", "p", "q", "c"].forEach(c => { if (!x[c] || (typeof x[c] === "string" && !x[c].trim())) erros.push("PR[" + i + "]: falta o campo " + c); }));

/* curiosidades, naturalistas e fontes */
X.CUR.forEach((x, i) => { if (!ids.has(x[0]) || !txt(x[1])) erros.push("CUR[" + i + "]: grupo inexistente ou texto vazio"); });
X.NAT.forEach((x, i) => { if (x.slice(0, 6).some(v => !txt(v)) || !x[6] || !x[6].pele || !x[6].roupa) erros.push("NAT[" + i + "] " + x[0] + ": campo vazio ou retrato incompleto"); });
X.FONTES.forEach((x, i) => { if (!txt(x[0]) || !txt(x[1])) erros.push("FONTES[" + i + "]: campo vazio"); });
X.FONTES_MAIS.forEach((x, i) => { if (![0, 1, 2].every(k => txt(x[k])) || (x[3] && !/^https:\/\//.test(x[3]))) erros.push("FONTES_MAIS[" + i + "]: campo vazio ou endereço sem https"); });

/* perguntas próprias do professor (banco-proprio.js, gerado pelo editor) */
if (X.PROPRIO) {
  (X.PROPRIO.perguntas || []).forEach((x, i) => {
    const onde = "banco-proprio[" + i + "]";
    if (x.g !== "final" && !ids.has(x.g) && !titulos.has(x.g)) erros.push(onde + ": destino inexistente " + x.g);
    pergunta(onde, x.q, x.o, 0, x.w); repetida(onde, x.q);
  });
  const todas = new Set();
  X.G.forEach(g => { todas.add(ctx.idPerg(g.q.q, g.q.o)); ["EXTRA", "EXTRA2", "BANK3", "BANK4"].forEach(n => (X[n][g.id] || []).forEach(x => todas.add(ctx.idPerg(x[0], x[1])))); });
  X.QZ.forEach(x => todas.add(ctx.idPerg(x[0], x[1])));
  titulos.forEach(t => [...(X.MQ0[t] || []), ...(X.MQX[t] || [])].forEach(x => todas.add(ctx.idPerg(x[0], x[1]))));
  (X.PROPRIO.ocultas || []).forEach(id => { if (!todas.has(id)) avisos.push("banco-proprio: pergunta oculta " + id + " não existe mais no app"); });
}

const total = X.G.length + Object.values(X.EXTRA).flat().length + Object.values(X.EXTRA2).flat().length + Object.values(X.BANK3).flat().length + Object.values(X.BANK4).flat().length + X.QZ.length + [...titulos].reduce((s, t) => s + (X.MQ0[t] || []).length + (X.MQX[t] || []).length, 0);
avisos.forEach(a => console.log("aviso: " + a));
erros.forEach(e => console.log("ERRO: " + e));
console.log(total + " perguntas conferidas, " + erros.length + " erro(s), " + avisos.length + " aviso(s).");
process.exit(erros.length ? 1 : 0);
