/* Testes do progresso: caderno de erros, simulado, código para outro aparelho, XP, níveis e trilhas. */
"use strict";
const { confere, responder, abrir, perfil, finalCom, textoCaderno } = require("./apoio");
const testes = {};

testes["caderno de erros: erros entram e saem depois de 2 acertos seguidos"] = async (p) => {
  await perfil(p, "Ana");
  await finalCom(p, 2);
  await abrir(p, "prog");
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

testes["simulado: 20 perguntas, sem resposta conta na correção, ranking"] = async (p) => {
  await perfil(p, "Caio");
  await abrir(p, "prog");
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
  await abrir(p, "prog");
  await p.click("#pg-exp");
  const cod = await p.inputValue("#pg-cod");
  confere(cod.startsWith("AN8-"), "gera o código");
  await p.evaluate(() => { localStorage.clear(); localStorage.setItem("an8inst", "no"); });
  await p.reload();
  await perfil(p, "Outro");
  await abrir(p, "prog");
  await p.fill("#pg-cod", cod);
  await p.click("#pg-imp");
  confere(/Duda/.test(await p.textContent("#pgbox .sub")), "troca para o aluno do código");
  confere(/1\s*pergunta para treinar/.test(await textoCaderno(p)), "caderno de erros veio junto");
  await p.fill("#pg-cod", "AN8-bobagem");
  await p.click("#pg-imp");
  confere(/inválido/.test(await p.textContent("#pg-msg")), "código inválido é recusado");
};

testes["XP, níveis, atividades e trilhas"] = async (p) => {
  await perfil(p, "Eva");
  confere(/0 XP/.test(await p.textContent("#nvxp")), "começa com 0 XP");
  await p.click("#nvgo");
  confere(await p.$eval("#ov", e => e.classList.contains("show")), "Continuar a trilha abre o primeiro passo (Poríferos)");
  await p.click("#panel .x");
  confere(/10 XP/.test(await p.textContent("#nvxp")), "estudar um grupo vale 10 XP");
  await abrir(p, "trilhas");
  confere((await p.$$("#trbox .tr")).length === 7, "7 trilhas");
  confere(/1 de 16 passos/.test(await p.textContent("#trbox .tr")), "trilha dos invertebrados com 1 passo feito");
  await abrir(p, "prog");
  confere(/1 de \d+ atividades/.test(await p.textContent("#nvbox")), "Progresso conta as atividades");
  /* nível máximo só com 50% das atividades */
  const r = await p.evaluate(() => { const ids = NV.ATV.map(a => a.id).filter(id => !id.startsWith("estrela:"));
    const meta = Math.ceil(NV.META * NV.ATV.length); ids.slice(0, meta - 1).forEach(id => { PG.H.at[id] = 1; }); NV.atualiza(); const antes = NV.calcula().lv;
    PG.H.at[ids[meta - 1]] = 1; NV.atualiza(); return [antes, NV.calcula().lv]; });
  confere(r[0] < 10 && r[1] === 10, "nível 10 só com 50% das atividades (" + r.join(" → ") + ")");
};

module.exports = testes;
