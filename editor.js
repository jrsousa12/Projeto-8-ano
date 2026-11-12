/* Editor de questões: o professor cria, edita e oculta perguntas e gera o banco-proprio.js para os alunos.
   O trabalho fica salvo neste aparelho (localStorage "an8ed") até ser publicado. */
"use strict";
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = t => String(t).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const CHAVE = "an8ed";
try { const t = localStorage.getItem("an8tema"); if (t === "claro" || (t === "auto" && matchMedia("(prefers-color-scheme: light)").matches)) document.documentElement.dataset.theme = "claro"; } catch (e) {}

/* lugares onde uma pergunta pode aparecer */
const LUGARES = [
  ...G.map(g => [g.id, (g.t === "inv" ? "🐚 " : "🦴 ") + g.n + " (desafio do grupo)"]),
  ["final", "🎯 Desafio final"],
  ...Object.keys(MQ0).map(t => [t, "🎯 " + t + " (aba)"])
];
const nomeLugar = g => (LUGARES.find(l => l[0] === g) || [g, g])[1];

/* perguntas que já vêm no app (a correta sempre na posição 0 aqui) */
const DOAPP = [];
G.forEach(g => {
  DOAPP.push({ g: g.id, q: g.q.q, o: [g.q.o[g.q.a], ...g.q.o.filter((_, k) => k !== g.q.a)], w: g.q.w });
  [EXTRA, EXTRA2, BANK3].forEach(B => (B[g.id] || []).forEach(x => DOAPP.push({ g: g.id, q: x[0], o: x[1], w: x[2] })));
});
QZ.forEach(x => DOAPP.push({ g: "final", q: x[0], o: [x[1][x[2]], ...x[1].filter((_, k) => k !== x[2])], w: x[3] }));
Object.keys(MQ0).forEach(t => [...MQ0[t], ...(MQX[t] || [])].forEach(x => DOAPP.push({ g: t, q: x[0], o: x[1], w: x[2] })));
DOAPP.forEach(x => { x.id = idPerg(x.q, x.o); x.app = true; });

/* estado do editor */
const publicado = () => ({
  perguntas: (PROPRIO.perguntas || []).map(x => ({ id: idPerg(x.q, x.o), g: x.g, q: x.q, o: x.o.slice(), w: x.w || "" })),
  ocultas: (PROPRIO.ocultas || []).slice()
});
let E;
try { E = JSON.parse(localStorage.getItem(CHAVE) || "null"); } catch (e) { E = null; }
if (!E || !Array.isArray(E.perguntas) || !Array.isArray(E.ocultas)) E = publicado();
const salvar = () => { try { localStorage.setItem(CHAVE, JSON.stringify(E)); } catch (e) {} resumo(); };
let editando = null;

function msg(id, t, ok) { const el = $(id); el.textContent = t; el.className = "ed-msg" + (ok ? " ok" : t ? " erro" : ""); }

/* ---------- formulário ---------- */
function opcoesLugar(sel, todas) {
  sel.innerHTML = (todas ? `<option value="">Todos os lugares</option>` : "") + LUGARES.map(l => `<option value="${esc(l[0])}">${esc(l[1])}</option>`).join("");
}
function lerForm() {
  const o = [0, 1, 2, 3].map(i => $("#f-o" + i).value.replace(/\s+/g, " ").trim()).filter((t, i) => i < 3 || t);
  return { g: $("#f-g").value, q: $("#f-q").value.replace(/\s+/g, " ").trim(), o, w: $("#f-w").value.replace(/\s+/g, " ").trim() };
}
function conferir(x, ignorar) {
  if (!x.q) return "Escreva a pergunta.";
  if (x.o.length < 3 || x.o.slice(0, 3).some(t => !t)) return "Preencha a alternativa correta e pelo menos duas erradas.";
  const n = x.o.map(t => t.toLowerCase());
  if (new Set(n).size !== n.length) return "Há alternativas repetidas.";
  if (!x.w) return "Escreva a explicação: ela ajuda o aluno a entender o erro.";
  const id = idPerg(x.q, x.o);
  if ([...DOAPP, ...E.perguntas].some(y => y.id === id && y.id !== ignorar)) return "Essa pergunta já existe.";
  return "";
}
function preencher(x) {
  $("#f-g").value = x.g; $("#f-q").value = x.q; $("#f-w").value = x.w || "";
  [0, 1, 2, 3].forEach(i => { $("#f-o" + i).value = x.o[i] || ""; });
}
function limparForm() { editando = null; preencher({ g: $("#f-g").value, q: "", o: [], w: "" }); $("#ed-form-tit").textContent = "➕ Nova pergunta"; $("#f-cancelar").hidden = true; $("#f-salvar").textContent = "Salvar pergunta"; }
$("#f-salvar").onclick = () => {
  const x = lerForm(), e = conferir(x, editando);
  if (e) { msg("#f-msg", e); return; }
  x.id = idPerg(x.q, x.o);
  if (editando) { const i = E.perguntas.findIndex(y => y.id === editando); if (i >= 0) E.perguntas[i] = x; }
  else E.perguntas.push(x);
  salvar(); const era = editando; limparForm(); lista();
  msg("#f-msg", era ? "✅ Pergunta alterada." : "✅ Pergunta criada. Lembre de gerar o arquivo para os alunos.", true);
};
$("#f-cancelar").onclick = () => { limparForm(); msg("#f-msg", ""); };

/* ---------- lista ---------- */
function lista() {
  const g = $("#l-g").value, b = $("#l-busca").value.trim().toLowerCase(), tipo = $("#l-tipo").value;
  const oc = new Set(E.ocultas);
  const L = [...E.perguntas.map(x => Object.assign({ minha: true }, x)), ...DOAPP].filter(x =>
    (!g || x.g === g) && (!b || (x.q + " " + x.o.join(" ")).toLowerCase().includes(b)) &&
    (!tipo || (tipo === "minha" ? x.minha : oc.has(x.id))));
  $("#l-cont").textContent = L.length + " pergunta" + (L.length === 1 ? "" : "s") + (L.length > 200 ? " (mostrando as 200 primeiras; use a busca)" : "");
  $("#l-lista").innerHTML = L.slice(0, 200).map(x => `<div class="ed-q${oc.has(x.id) ? " oculta" : ""}${x.minha ? " minha" : ""}" data-id="${x.id}">
    <div class="ed-qt"><span class="ed-tag">${x.minha ? "✏️ minha" : "do app"}</span><span class="ed-lugar">${esc(nomeLugar(x.g))}</span>${oc.has(x.id) ? `<span class="ed-tag oc">🙈 oculta</span>` : ""}</div>
    <p><b>${x.minha ? esc(x.q) : x.q}</b></p>
    <ul>${x.o.map((t, k) => `<li class="${k === 0 ? "c" : ""}">${k === 0 ? "✅" : "❌"} ${x.minha ? esc(t) : t}</li>`).join("")}</ul>
    ${x.w ? `<p class="ed-w">💬 ${x.minha ? esc(x.w) : x.w}</p>` : ""}
    <div class="ed-acoes">${x.minha ? `<button class="btn" data-a="editar">✏️ Editar</button><button class="btn" data-a="apagar">🗑️ Apagar</button>` : `<button class="btn" data-a="ocultar">${oc.has(x.id) ? "👁️ Mostrar de novo" : "🙈 Ocultar dos alunos"}</button><button class="btn" data-a="copiar">📄 Usar como modelo</button>`}</div></div>`).join("");
  $$("#l-lista [data-a]").forEach(bt => bt.onclick = () => acao(bt.dataset.a, bt.closest(".ed-q").dataset.id, bt));
}
function acao(a, id, bt) {
  const x = [...E.perguntas, ...DOAPP].find(y => y.id === id); if (!x) return;
  if (a === "ocultar") {
    if (E.ocultas.includes(id)) E.ocultas = E.ocultas.filter(y => y !== id);
    else {
      const resta = DOAPP.filter(y => y.g === x.g && !E.ocultas.includes(y.id)).length - 1 + E.perguntas.filter(y => y.g === x.g).length;
      E.ocultas.push(id);
      if (resta < 5) msg("#ed-msg", "⚠️ " + nomeLugar(x.g) + " ficou com só " + resta + " pergunta(s). O desafio usa 5 por rodada.");
    }
    salvar(); lista();
  } else if (a === "copiar" || a === "editar") {
    preencher(x);
    if (a === "editar") { editando = id; $("#ed-form-tit").textContent = "✏️ Editar pergunta"; $("#f-cancelar").hidden = false; $("#f-salvar").textContent = "Salvar alteração"; }
    else { editando = null; $("#ed-form-tit").textContent = "➕ Nova pergunta (a partir de um modelo)"; $("#f-cancelar").hidden = false; }
    msg("#f-msg", a === "copiar" ? "Mude o que quiser e salve. A pergunta original continua no app (oculte-a se quiser substituir)." : "", true);
    $("#ed-form-box").scrollIntoView({ behavior: "smooth" }); $("#f-q").focus();
  } else if (a === "apagar") {
    if (bt.dataset.ok !== "1") { bt.dataset.ok = "1"; bt.textContent = "⚠️ Toque de novo para apagar"; setTimeout(() => { if (bt.isConnected) { bt.dataset.ok = ""; bt.textContent = "🗑️ Apagar"; } }, 4000); return; }
    E.perguntas = E.perguntas.filter(y => y.id !== id); if (editando === id) limparForm(); salvar(); lista();
  }
}
["#l-g", "#l-tipo"].forEach(s => $(s).onchange = lista);
$("#l-busca").oninput = lista;

/* ---------- arquivo para os alunos e cópias ---------- */
function textoArquivo() {
  const dados = { perguntas: E.perguntas.map(x => ({ g: x.g, q: x.q, o: x.o, w: x.w })), ocultas: E.ocultas.filter(id => DOAPP.some(y => y.id === id)) };
  return `/* Perguntas próprias do professor e perguntas ocultadas.
   Este arquivo é gerado pelo editor (editor.html → "Gerar arquivo para os alunos").
   Para os alunos receberem as mudanças, envie o arquivo novo ao GitHub no lugar deste. */
"use strict";
const PROPRIO = ${JSON.stringify(dados, null, 1).replace(/<\//g, "<\\/")};
`;
}
function baixar(nome, txt, tipo) {
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([txt], { type: tipo })); a.download = nome;
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
}
$("#ed-gerar").onclick = () => { baixar("banco-proprio.js", textoArquivo(), "text/javascript"); msg("#ed-msg", "✅ Arquivo banco-proprio.js baixado. Agora envie-o ao GitHub (Add file → Upload files).", true); };
$("#ed-exp").onclick = () => { baixar("perguntas-animais-8ano.json", JSON.stringify(E, null, 1), "application/json"); msg("#ed-msg", "✅ Cópia salva. Use Importar para trazê-la de volta ou para outro computador.", true); };
$("#ed-imp").onchange = async ev => {
  const f = ev.target.files[0]; ev.target.value = ""; if (!f) return;
  try {
    const d = JSON.parse(await f.text());
    if (!d || !Array.isArray(d.perguntas) || !Array.isArray(d.ocultas)) throw 0;
    const ok = d.perguntas.filter(x => x && typeof x.q === "string" && Array.isArray(x.o) && x.o.length >= 2 && LUGARES.some(l => l[0] === x.g))
      .map(x => ({ id: idPerg(x.q, x.o), g: x.g, q: String(x.q), o: x.o.map(String), w: String(x.w || "") }));
    E = { perguntas: ok, ocultas: d.ocultas.filter(id => typeof id === "string") };
    salvar(); limparForm(); lista(); msg("#ed-msg", "✅ Cópia importada: " + ok.length + " pergunta(s) suas.", true);
  } catch (e) { msg("#ed-msg", "Esse arquivo não é uma cópia do editor."); }
};
$("#ed-desfazer").onclick = function () {
  if (this.dataset.ok !== "1") { this.dataset.ok = "1"; this.textContent = "⚠️ Toque de novo: descarta o que não foi publicado"; setTimeout(() => { this.dataset.ok = ""; this.textContent = "↩️ Voltar ao arquivo publicado"; }, 4000); return; }
  E = publicado(); salvar(); limparForm(); lista(); this.dataset.ok = ""; this.textContent = "↩️ Voltar ao arquivo publicado"; msg("#ed-msg", "Voltou ao banco-proprio.js publicado.", true);
};
function resumo() {
  const mudou = JSON.stringify(publicado()) !== JSON.stringify({ perguntas: E.perguntas.map(x => ({ id: x.id, g: x.g, q: x.q, o: x.o, w: x.w })), ocultas: E.ocultas });
  $("#ed-resumo").innerHTML = `📊 ${DOAPP.length} perguntas do app · <b>${E.perguntas.length}</b> suas · <b>${E.ocultas.length}</b> ocultas${mudou ? ` · <span class="ed-pend">⚠️ há mudanças ainda não publicadas</span>` : " · tudo publicado"}`;
}

opcoesLugar($("#f-g")); opcoesLugar($("#l-g"), true);
resumo(); lista();
