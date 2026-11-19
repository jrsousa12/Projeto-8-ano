#!/usr/bin/env node
/* Teste guardado do motor de revisão dos textos (build/revisar_textos.js).
   Uso: node build/t_revisar_textos.js   (rodado pelo rapido.py quando o motor ou a ficha mudam, e pelo tudo.sh)
   Para cada aviso: um caso que DEVE avisar e um parecido que NÃO deve (alarme falso). */
"use strict";
const fs = require("fs"), path = require("path");
const M = require("./revisar_textos.js");
const ficha = JSON.parse(fs.readFileSync(path.join(__dirname, "fichas", "textos.json"), "utf8"));
let falhas = 0, total = 0;
const item = (textos, extra = {}) => ({ bloco: "PA", id: "PA[9] Teste", nome: "", cient: "", textos: textos.map((s, i) => ({ onde: `PA[9][${i}]`, s })), ...extra });
const tipos = (it, todos = []) => M.analisar([it], ficha, todos).map(a => a.tipo);
function caso(nome, ok) { total++; if (!ok) { falhas++; console.log(`  FALHOU: ${nome}`); } }
const tem = (t, it, todos) => tipos(it, todos).includes(t);

console.log("• ficha");
caso("ficha real está no formato", M.checar_ficha(ficha).length === 0);
caso("ficha quebrada é recusada", M.checar_ficha({ termos: [], exageros: "x", palavras_max: 2 }).length >= 4);

console.log("• números");
caso("número com unidade avisa", tem("numero", item(["Pode passar de 2 metros."])));
caso("numeração de passo não avisa", !tem("numero", item(["1. Ovos chegam à água"])));
caso("lê milhões de anos", JSON.stringify(M.numeros("há 400 milhões de anos")[0]).includes('"uni":"anos"'));
const pira = item(["O pirarucu pode passar de 3 metros."], { nome: "Pirarucu" });
caso("número diferente em outra parte avisa", tem("diverge", pira, [{ onde: "QZ[0][0]", s: "O pirarucu mede até 2 metros." }]));
caso("mesmo número em outra parte não avisa", !tem("diverge", pira, [{ onde: "QZ[0][0]", s: "O pirarucu chega a 3 metros." }]));
caso("outro animal não avisa", !tem("diverge", pira, [{ onde: "QZ[0][0]", s: "O boto mede até 2 metros." }]));

console.log("• termos técnicos");
caso("termo sem explicação avisa", tem("termo", item(["As esponjas são sésseis."])));
caso("termo com parênteses não avisa", !tem("termo", item(["As esponjas são sésseis (vivem fixas)."])));
caso("termo dentro de parênteses não avisa", !tem("termo", item(["Vivem fixas no fundo (sésseis)."])));
caso("'chamadas' antes do termo não avisa", !tem("termo", item(["Na carne ficam bolinhas chamadas cisticercos."])));
caso("só a 1ª vez no cartão conta", tipos(item(["São sésseis.", "Sésseis e filtradoras (puxam água)."])).filter(t => t === "termo").length === 1);

console.log("• frases, exageros, remédio");
const longa = Array(30).fill("palavra").join(" ") + ".", curta = Array(20).fill("palavra").join(" ") + ".";
caso("frase longa avisa", tem("frase", item([longa])));
caso("frase curta não avisa", !tem("frase", item([curta])));
caso("exagero avisa", tem("exagero", item(["A pele fica sempre úmida."])));
caso("palavra dentro de outra não avisa", !tem("exagero", item(["Ele é unicamente aquático."])));
caso("remédio avisa", tem("remedio", item(["Tome vermífugo todo ano."])));
caso("remendo não avisa", !tem("remedio", item(["Faça um remendo na rede."])));

console.log("• saúde (verminoses)");
const dis = s => item([s], { bloco: "DIS", id: "DIS[9] Teste" });
caso("verminose sem orientação avisa", tem("saude", dis("Lavar as mãos e ter saneamento básico.")));
caso("verminose com Unidade de Saúde não avisa", !tem("saude", dis("Com sintomas, procure a Unidade de Saúde.")));
caso("fauna não recebe aviso de saúde", !tem("saude", item(["Lavar as mãos."])));

console.log("• nomes científicos");
caso("nome fora do padrão avisa", tem("cientifico", item(["x"], { cient: "inia geoffrensis" })));
caso("nome no padrão não avisa", !tem("cientifico", item(["x"], { cient: "Inia geoffrensis" })));
const boto = item(["x"], { cient: "Inia geoffrensis" });
caso("gênero com minúscula em outra parte avisa", tem("cientifico", boto, [{ onde: "QZ[1][0]", s: "O inia geoffrensis vive no rio." }]));
caso("espécie trocada em outra parte avisa", tem("cientifico", boto, [{ onde: "QZ[1][0]", s: "Inia boliviensis vive no rio." }]));
caso("nome certo em outra parte não avisa", !tem("cientifico", boto, [{ onde: "QZ[1][0]", s: "Inia geoffrensis vive no rio." }]));

console.log("• avisos já conferidos");
const conf = { ...ficha, conferidos: ["numero | PA[9][0] | 2 metros"] };
const sep = txt => M.separar(M.analisar([item([txt])], conf, []), conf);
caso("aviso conferido sai do relatório", sep("Pode passar de 2 metros.").novos.length === 0 && sep("Pode passar de 2 metros.").conferidos === 1);
caso("número mudou: o aviso volta", sep("Pode passar de 3 metros.").novos.length === 1);
caso("conferido sem aviso é apontado", sep("Pode passar de 3 metros.").sobrando.length === 1);
caso("conferido fora do formato é recusado", M.checar_ficha({ ...ficha, conferidos: ["numero 2 metros"] }).length === 1);

console.log("• app de verdade");
const app = M.carregar(), itens = M.cartoes(app);
for (const b of M.BLOCOS) caso(`bloco ${b} tem cartões`, itens.some(i => i.bloco === b));
caso("os ciclos (extras.js) foram lidos", itens.filter(i => i.bloco === "CIC").every(i => i.textos.length >= 10));
caso("textos sem marcas de HTML", itens.every(i => i.textos.every(t => !/<\/?[a-z]/.test(t.s))));
caso("DIS: o nome do grupo ([2]) fica fora da revisão", itens.filter(i => i.bloco === "DIS").every(i => i.textos.every(t => !/\]\[2\]$/.test(t.onde))));
let av = []; try { av = M.analisar(itens, ficha, []); } catch (e) { console.log("  " + e.message); }
caso("o pente-fino roda no app inteiro", av.length > 0);

console.log(falhas ? `${falhas} de ${total} caso(s) falharam.` : `motor de revisão dos textos: ${total} casos certos.`);
process.exitCode = falhas ? 1 : 0;
