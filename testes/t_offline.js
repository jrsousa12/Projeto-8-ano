/* Testes sem internet e do arquivo único (animais-8ano.html aberto direto do computador). */
"use strict";
const path = require("path");
const { RAIZ, confere, abrir } = require("./apoio");
const testes = {};

testes["funciona sem internet depois da primeira visita"] = async (p, ctx) => {
  await p.evaluate(() => navigator.serviceWorker.ready);
  await p.reload();
  await p.waitForFunction(() => navigator.serviceWorker.controller);
  await ctx.setOffline(true);
  await p.reload();
  confere((await p.title()).includes("Animais"), "app abre com a internet desligada");
  await abrir(p, "img");
  await p.waitForTimeout(500);
  confere(await p.evaluate(() => (L => L.length > 0 && L.every(i => !i.complete || i.naturalWidth > 0))([...document.querySelectorAll("img")])), "imagens carregam com a internet desligada");
  await ctx.setOffline(false);
};

testes["arquivo único abre direto do computador"] = async (p) => {
  await p.goto("file://" + path.join(RAIZ, "animais-8ano.html"));
  confere((await p.$$("#tabs button")).length === 5, "animais-8ano.html abre com o menu completo");
  await abrir(p, "quiz");
  confere(!!(await p.$("#qbox .opt")), "desafio final funciona no arquivo único");
};

module.exports = testes;
