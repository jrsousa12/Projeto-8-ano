/* Testes das figuras das perguntas (figuras-perguntas.js + figuras-ligacao.js). */
"use strict";
const { confere, responder, abrir } = require("./apoio");
const testes = {};

testes["figuras: toda ligação aponta para uma pergunta e um molde que existem"] = async (p) => {
  const r = await p.evaluate(() => {
    const tx = new Set();
    G.forEach(g => g.pool.forEach(x => tx.add(x.q.trim())));
    QZ.forEach(x => tx.add(x[0].trim()));
    for (const t in MINI) MINI[t].forEach(x => tx.add(x[0].trim()));
    const ch = Object.keys(FQLIG);
    return { n: ch.length, semPerg: ch.filter(k => !tx.has(k)), semMolde: ch.filter(k => !FQ.molde(FQLIG[k][0]) || !["antes", "tarde"].includes(FQLIG[k][1])) };
  });
  confere(r.n >= 70, r.n + " perguntas com figura");
  confere(!r.semPerg.length, "todo enunciado existe num banco" + (r.semPerg.length ? ": " + r.semPerg.join(" | ") : ""));
  confere(!r.semMolde.length, "todo molde existe" + (r.semMolde.length ? ": " + r.semMolde.join(" | ") : ""));
};

testes["figuras: simetria no desafio do grupo (linhas só depois da resposta)"] = async (p) => {
  const T = "Qual é a simetria do corpo dos platelmintos?";
  await p.evaluate(t => { const g = G.find(x => x.id === "platelminto"); g.pool = g.pool.filter(x => x.q === t); }, T);
  await abrir(p, "tree");
  await p.click("#b-inv .bbtn");
  await p.click("#card-platelminto");
  confere(await p.$eval("#chal .fq", e => e.dataset.fq) === "sim:planaria", "pergunta mostra a planária");
  const antes = await p.$eval("#chal .fq", e => [getComputedStyle(e.querySelector(".fqr")).opacity, getComputedStyle(e.querySelector(".fqleg")).display]);
  confere(antes[0] === "0" && antes[1] === "none", "antes da resposta: sem linha e sem legenda");
  await responder(p, "#chal", "p", false, "g");
  await p.waitForTimeout(700);
  const depois = await p.$eval("#chal .fq", e => [getComputedStyle(e.querySelector(".fqr")).opacity, e.querySelector(".fqleg").textContent]);
  confere(depois[0] === "1" && /bilateral/.test(depois[1]), "depois da resposta: linha e legenda da simetria bilateral");
};

testes["figuras: metamorfose animada só depois da resposta, no desafio final"] = async (p) => {
  const T = "Qual é a ordem das fases da metamorfose completa?";
  await p.evaluate(t => { const k = QZ.filter(x => x[0] === t); QZ.length = 0; for (let i = 0; i < 10; i++) QZ.push(k[0]); }, T);
  await abrir(p, "quiz");
  confere(await p.$eval("#quiz .fq", e => e.dataset.fq === "meta:ins" && getComputedStyle(e).display === "none"), "antes da resposta a figura fica escondida");
  await responder(p, "#quiz", ".qq", true, "f");
  confere(await p.$eval("#quiz .fq", e => getComputedStyle(e).display !== "none" && !!e.querySelector(".fqst svg")), "depois da resposta a figura aparece");
  confere(await p.$$eval("#quiz .fq .fqdots .dot", l => l.length) === 4, "4 etapas (ovo, larva, pupa, adulto)");
  await p.click("#quiz .fq .fqdots .dot >> nth=2");
  confere(/Pupa/.test(await p.textContent("#quiz .fq .fqet")), "botão escolhe a etapa da pupa");
  confere(await p.evaluate(() => !document.querySelector("#meta .fq")), "a tela Metamorfose continua sem figura extra");
};

testes["figuras: ciclo do verme abre na etapa da pergunta, só depois da resposta"] = async (p) => {
  const T = "Qual larva do esquistossomo penetra na pele humana?";
  await p.evaluate(t => { const g = G.find(x => x.id === "platelminto"); g.pool = g.pool.filter(x => x.q === t); }, T);
  await abrir(p, "tree");
  await p.click("#b-inv .bbtn");
  await p.click("#card-platelminto");
  confere(await p.$eval("#chal .fq", e => e.dataset.fq === "cic:esq:5" && getComputedStyle(e).display === "none"), "antes da resposta a figura do ciclo fica escondida");
  await responder(p, "#chal", "p", false, "g");
  confere(await p.$eval("#chal .fq", e => getComputedStyle(e).display !== "none" && !!e.querySelector(".fqst svg")), "depois da resposta o ciclo aparece");
  confere(await p.$$eval("#chal .fq .fqdots .dot", l => l.length) === 6, "6 etapas do ciclo da esquistossomose");
  confere(/Entram pela pele/.test(await p.textContent("#chal .fq .fqet")), "abre na etapa 5 (cercárias entram pela pele)");
  await p.waitForTimeout(2900);
  confere(/Entram pela pele/.test(await p.textContent("#chal .fq .fqet")), "no ciclo a etapa não muda sozinha");
  await p.click("#chal .fq .fqdots .dot >> nth=2");
  confere(/caramujo/.test(await p.textContent("#chal .fq .fqet")), "botão escolhe a etapa do caramujo");
  const sem = await p.evaluate(() => ["#cic", "#meta", "#temp"].filter(s => { const d = document.createElement("div");
    document.querySelector(s + " .box").appendChild(d); const f = FQ.por(d, "Qual é o hospedeiro intermediário do esquistossomo?"); d.remove(); if (f) f.remove(); return !!f; }));
  confere(!sem.length, "telas Ciclos, Metamorfose e Temperatura ficam sem figura" + (sem.length ? ": " + sem.join(" ") : ""));
};

testes["figuras: comparação lado a lado só depois da resposta, no desafio final"] = async (p) => {
  const T = "Quantas patas tem uma aranha?";
  await p.evaluate(t => { const k = QZ.filter(x => x[0] === t); QZ.length = 0; for (let i = 0; i < 10; i++) QZ.push(k[0]); }, T);
  await abrir(p, "quiz");
  confere(await p.$eval("#quiz .fq", e => e.dataset.fq === "cmp:artro" && getComputedStyle(e).display === "none"), "antes da resposta a comparação fica escondida");
  await responder(p, "#quiz", ".qq", true, "f");
  await p.waitForTimeout(700);
  const r = await p.$eval("#quiz .fq", e => [getComputedStyle(e).display, getComputedStyle(e.querySelector(".fqr")).opacity, e.querySelector(".fqleg").textContent]);
  confere(r[0] !== "none" && r[1] === "1", "depois da resposta aparecem o desenho e os rótulos");
  confere(/4 pares de patas/.test(r[2]) && /3 pares de patas/.test(r[2]), "legenda compara inseto e aranha");
  const tam = await p.evaluate(() => ["artro", "peixe", "temp", "resp", "cor", "col", "ovo", "pele"].map(k => [k, !!FQ.molde("cmp:" + k)]).filter(x => !x[1]).map(x => x[0]));
  confere(!tam.length, "os 8 moldes de comparação existem" + (tam.length ? ": " + tam.join(" ") : ""));
};

[["Quantas cavidades tem o coração de um sapo?", "cmp:cor", /2 átrios e 1 ventrículo/],
 ["Como os insetos respiram?", "cmp:resp", /Traqueias/],
 ["O que todos os vertebrados têm?", "cmp:col", /vértebras/],
 ["O que significa ser vivíparo?", "cmp:ovo", /placenta/],
 ["Como é a pele dos répteis?", "cmp:pele", /Escamas/]].forEach(([T, m, leg]) => {
  testes["figuras: " + m + " só depois da resposta, com a legenda certa"] = async (p) => {
    await p.evaluate(t => { const k = QZ.concat(G.flatMap(g => g.pool.map(x => [x.q, x.o, x.a, x.w]))).filter(x => x[0] === t);
      QZ.length = 0; for (let i = 0; i < 10; i++) QZ.push(k[0]); }, T);
    await abrir(p, "quiz");
    confere(await p.$eval("#quiz .fq", (e, m) => e.dataset.fq === m && getComputedStyle(e).display === "none", m), m + ": escondida antes da resposta");
    await responder(p, "#quiz", ".qq", true, "f");
    await p.waitForTimeout(700);
    confere(leg.test(await p.$eval("#quiz .fq .fqleg", e => getComputedStyle(e).display !== "none" ? e.textContent : "")), m + ": legenda aparece depois da resposta");
  };
});

module.exports = testes;
