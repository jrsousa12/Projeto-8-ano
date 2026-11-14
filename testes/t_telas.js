/* Testes das telas: menu, voltar e opções (tema, vibração, compartilhar). */
"use strict";
const { confere, HUBS, abrir, finalCom } = require("./apoio");
const testes = {};

testes["abre sem erros e mostra todas as abas"] = async (p) => {
  const menu = await p.$$eval("#tabs button", bs => bs.map(b => b.dataset.t));
  confere(menu.join() === "home,trilhas,estudar,jogar,prog", "menu com 5 seções");
  for (const t of [...menu, ...Object.keys(HUBS)]) {
    await abrir(p, t);
    const vis = await p.$eval("#" + t, e => getComputedStyle(e).display !== "none" && e.innerText.trim().length > 20);
    confere(vis, "aba " + t + " aparece com conteúdo");
  }
};

testes["menu: voltar da tela para a seção e da seção para o início"] = async (p) => {
  await abrir(p, "dis");
  confere(/Estudar/.test(await p.textContent("#trilho")), "caminho mostra a seção Estudar");
  await p.click("#bk");
  await p.waitForFunction(() => document.querySelector("#estudar").classList.contains("on"));
  confere(true, "Voltar leva da tela para a seção");
  await p.click("#bk");
  await p.waitForFunction(() => document.querySelector("#home").classList.contains("on"));
  confere(true, "Voltar leva da seção para o início");
  await abrir(p, "cic");
  await p.click('#tabs button[data-t="jogar"]');
  confere(await p.$eval("#jogar", e => e.classList.contains("on")), "trocar de seção pelo menu");
  await p.click('#tabs button[data-t="home"]');
  await p.waitForFunction(() => document.querySelector("#home").classList.contains("on"));
  confere(true, "Início volta para a tela inicial");
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

module.exports = testes;
