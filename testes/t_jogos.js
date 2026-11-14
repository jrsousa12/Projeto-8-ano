/* Testes dos desafios e jogos: estrela dos grupos, desafio final, classifique e "Quem é este?". */
"use strict";
const { confere, responder, abrir, perfil } = require("./apoio");
const testes = {};

testes["ganha a estrela de um grupo e ela fica salva no perfil"] = async (p) => {
  await p.fill("#wn", "Teste");
  await p.click("#wok");
  await abrir(p, "tree");
  await p.click("#b-inv .bbtn");
  await p.click("#card-porifero");
  for (let i = 0; i < 5; i++) {
    await responder(p, "#chal", "p", true, "g");
    await p.click("#chal #cn");
  }
  confere(await p.$eval("#card-porifero", e => e.classList.contains("star")), "cartão dos poríferos ganha a estrela");
  confere(/Nível 2/.test(await p.textContent("#nvt")), "subiu para o nível 2 (estudar + estrela + acertos)");
  await p.reload();
  confere(await p.$eval("#card-porifero", e => e.classList.contains("star")), "estrela continua depois de recarregar");
  confere(/Nível 2/.test(await p.textContent("#nvt")), "nível continua depois de recarregar");
};

testes["desafio final: 10 perguntas, resultado e revisão dos erros"] = async (p) => {
  await abrir(p, "quiz");
  for (let i = 0; i < 10; i++) {
    await responder(p, "#qbox", ".qq", i >= 2, "f");
    await p.click("#qn-final");
  }
  const fim = await p.textContent("#qbox");
  confere(/Você acertou\s*8\s*de 10/.test(fim), "resultado 8 de 10");
  confere(/Maior sequência de acertos:\s*8/.test(fim), "maior sequência 8");
  confere(!!(await p.$("#rv-final")), "botão para rever os 2 erros");
};

testes["continua o desafio final de onde parou"] = async (p) => {
  await perfil(p, "Bia");
  await abrir(p, "quiz");
  for (let i = 0; i < 3; i++) { await responder(p, "#qbox", ".qq", true, "f"); await p.click("#qn-final"); }
  await p.reload();
  await abrir(p, "quiz");
  confere(/parou na pergunta\s*4 de 10/.test(await p.textContent("#qbox")), "oferece continuar da pergunta 4");
  await p.click("#rt-final");
  confere(/Pergunta 4\/10/.test(await p.textContent("#qbox .qtop")), "continua na pergunta 4");
  confere(/⭐ 3/.test(await p.textContent("#qbox .qtop")), "mantém os 3 pontos");
};

testes["classifique e quem é este? funcionam"] = async (p) => {
  await abrir(p, "cls");
  for (let i = 0; i < 10; i++) { await p.click("#co .opt >> nth=0"); await p.click("#cn"); }
  confere(/Você classificou/.test(await p.textContent("#cbox")), "classifique chega ao resultado");
  await abrir(p, "img");
  confere((await p.$$("#ibox .opt")).length >= 2, "quem é este? mostra alternativas");
};

module.exports = testes;
