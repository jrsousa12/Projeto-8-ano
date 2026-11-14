/* Testes do conteúdo de estudo: mini desafios, curiosidades, naturalistas, ciclos, metamorfose e fontes. */
"use strict";
const { confere, responder, abrir } = require("./apoio");
const testes = {};

testes["mini desafio de uma aba funciona"] = async (p) => {
  await abrir(p, "temp");
  for (let i = 0; i < 5; i++) {
    await responder(p, "#temp .mini", ".mqq", true, "m");
    await p.click("#temp #mnb");
  }
  confere(/acertou\s*5\s*de 5/.test(await p.textContent("#temp .mini")), "5 de 5 no desafio da temperatura");
};

testes["curiosidade, naturalistas, ciclos dos vermes e fontes"] = async (p) => {
  const c1 = await p.textContent("#curi p");
  confere(c1.length > 20, "curiosidade na tela inicial");
  await p.click("#curn");
  confere((await p.textContent("#curi p")) !== c1, "botão mostra outra curiosidade");
  await abrir(p, "nat");
  confere((await p.$$("#natg .card")).length === 7, "7 naturalistas");
  await p.click("#natg .card >> nth=6");
  confere(/Museu Paraense Emílio Goeldi/.test(await p.textContent("#panel")), "painel do Goeldi abre");
  await p.click("#panel .x");
  for (let i = 0; i < 5; i++) { await responder(p, "#nat .mini", ".mqq", true, "m"); await p.click("#nat #mnb"); }
  confere(/acertou\s*5\s*de 5/.test(await p.textContent("#nat .mini")), "desafio dos naturalistas");
  await abrir(p, "cic");
  for (const m of ["esq", "ten", "lom"]) {
    await p.click(`[data-c="${m}"]`);
    const n = (await p.$$("#cdots .dot")).length;
    await p.click(`#cdots .dot >> nth=${n - 1}`);
    confere(n === 6 && /prevenir/.test(await p.textContent("#cT")), "ciclo " + m + ": 6 etapas até a prevenção");
  }
  await abrir(p, "meta");
  await p.click("#dots .dot >> nth=2");
  confere(/Pupa/.test(await p.textContent("#stT")), "metamorfose continua funcionando");
  await p.click("#op"); await p.click("#fo");
  confere(/ICMBio/.test(await p.textContent("#md")), "tela de fontes");
  confere((await p.$$('#md a[href^="https://"]')).length >= 20 && !/revisado pelo professor/.test(await p.textContent("#md")), "fontes confiáveis com links e sem o aviso antigo");
};

module.exports = testes;
