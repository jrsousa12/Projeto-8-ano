/* XP, níveis, atividades e trilhas.
   - Cada atividade concluída pela primeira vez vale XP (estudar um grupo, ganhar uma estrela, explorar uma tela,
     vencer um desafio...). Cada pergunta acertada também vale XP (mais na primeira vez).
   - Os níveis 1 a 9 dependem do XP. O nível 10 (o último) só é alcançado com pelo menos 70% de todas as atividades.
   - O XP é calculado a partir do que está salvo (estrelas e histórico), por isso vai junto no código AN8-... */
"use strict";
const NV = (() => {
  const META = 0.7;
  const NIVEIS = [
    [0, "🔍", "Observador(a)"], [60, "🧭", "Explorador(a)"], [150, "🌿", "Coletor(a) da mata"], [300, "📓", "Naturalista júnior"],
    [500, "🔬", "Pesquisador(a)"], [750, "🐾", "Zoólogo(a) aprendiz"], [1050, "🦎", "Zoólogo(a)"], [1400, "🌳", "Biólogo(a) de campo"],
    [1800, "🐊", "Especialista da Amazônia"], [Infinity, "🏆", "Mestre dos Animais"]];
  const XPC = { estudar: 10, estrela: 50, explorar: 10, mini: 30, jogo: 40, trilha: 100 };

  /* mini desafios: título → tela */
  const MINIS = [["Desafio da temperatura", "temp"], ["Desafio da metamorfose", "meta"], ["Desafio da fauna do Pará", "pa"], ["Desafio das verminoses", "dis"], ["Desafio dos ciclos", "cic"], ["Desafio dos naturalistas", "nat"]];
  const nomeMini = t => t.replace(/^Desafio (da|das|do|dos) /, "").replace(/^./, c => c.toUpperCase());

  /* listas de cartões ganham o id da atividade (contado quando o cartão é aberto) */
  [[PAL, "pa"], [DISL, "dis"], [PRL, "prat"], [NATL, "nat"]].forEach(([L, k]) => L.forEach((x, i) => { x.aid = k + ":" + i; }));

  /* ---------- catálogo de atividades ---------- */
  const ATV = [];
  const add = (id, cat, nome, xp, ir) => ATV.push({ id, cat, nome, xp, ir });
  const abrirGrupo = (g, desafio) => () => {
    irPara("tree"); const br = $("#b-" + g.t); if (!br.classList.contains("open")) br.classList.add("open");
    openPanel(G.indexOf(g)); if (desafio) setTimeout(() => { const c = $("#chal"); if (c) c.scrollIntoView({ behavior: "smooth", block: "center" }); }, 350);
  };
  G.forEach(g => add("estudar:" + g.id, "Estudar os grupos", g.n, XPC.estudar, abrirGrupo(g)));
  G.forEach(g => add("estrela:" + g.id, "Estrelas dos grupos", "⭐ " + g.n + " (3 de 5 no desafio)", XPC.estrela, abrirGrupo(g, true)));
  const cartao = (L, t, i) => () => { irPara(t); openDet(L, i); };
  add("temp", "Explorar", "Temperatura: mexa no controle", XPC.explorar, () => irPara("temp"));
  [["ins", "Metamorfose da borboleta"], ["gaf", "Metamorfose do gafanhoto"], ["sapo", "Metamorfose do sapo"]].forEach(([m, n]) => add("meta:" + m, "Explorar", n + " até o fim", XPC.explorar, () => { irPara("meta"); const b = $('[data-m="' + m + '"]'); if (b) b.click(); }));
  [["esq", "Ciclo da esquistossomose"], ["ten", "Ciclo da tênia"], ["lom", "Ciclo da lombriga"]].forEach(([m, n]) => add("cic:" + m, "Explorar", n + " até a prevenção", XPC.explorar, () => { irPara("cic"); const b = $('[data-c="' + m + '"]'); if (b) b.click(); }));
  add("fic", "Explorar", "Ficha da aula", XPC.explorar, () => irPara("fic"));
  PAL.forEach((x, i) => add(x.aid, "Fauna do Pará", x.name, XPC.explorar, cartao(PAL, "pa", i)));
  DISL.forEach((x, i) => add(x.aid, "Vermes e doenças", x.name, XPC.explorar, cartao(DISL, "dis", i)));
  NATL.forEach((x, i) => add(x.aid, "Naturalistas", x.name, XPC.explorar, cartao(NATL, "nat", i)));
  PRL.forEach((x, i) => add(x.aid, "Atividades práticas", x.name, XPC.explorar, cartao(PRL, "prat", i)));
  MINIS.forEach(([t, aba]) => add("mini:" + t, "Desafios das telas", "🎯 " + t + " (3 de 5)", XPC.mini, () => { irPara(aba); setTimeout(() => { const m = $("#" + aba + " .mini"); if (m) m.scrollIntoView({ behavior: "smooth", block: "center" }); }, 300); }));
  add("jogo:final", "Jogos", "🎯 Desafio final com 70% ou mais", XPC.jogo, () => irPara("quiz"));
  add("jogo:cls", "Jogos", "🧩 Classifique com 70% ou mais", XPC.jogo, () => irPara("cls"));
  add("jogo:img", "Jogos", "🖼️ Quem é este? com 70% ou mais", XPC.jogo, () => irPara("img"));
  add("jogo:treino", "Jogos", "🧠 Terminar um treino inteligente", XPC.jogo, () => { irPara("prog"); prIniciar("treino"); });
  add("jogo:simulado", "Jogos", "📝 Simulado com 60% ou mais", XPC.jogo, () => { irPara("prog"); prIniciar("simulado"); });
  const PORID = Object.fromEntries(ATV.map(a => [a.id, a]));

  /* ---------- trilhas ---------- */
  const inv = G.filter(g => g.t === "inv"), vert = G.filter(g => g.t === "vert");
  const TRILHAS = [
    { id: "inv", ic: "🐚", n: "Invertebrados", d: "Das esponjas às estrelas-do-mar: estude cada grupo e ganhe a estrela dele.", p: inv.flatMap(g => ["estudar:" + g.id, "estrela:" + g.id]) },
    { id: "vert", ic: "🦴", n: "Vertebrados e temperatura", d: "Peixes, anfíbios, répteis, aves e mamíferos, e quem esquenta sozinho.", p: [...vert.flatMap(g => ["estudar:" + g.id, "estrela:" + g.id]), "temp", "mini:Desafio da temperatura"] },
    { id: "meta", ic: "🦋", n: "Metamorfose e ciclos", d: "Como os animais mudam de forma e como os vermes passam de um hospedeiro a outro.", p: ["meta:ins", "meta:gaf", "meta:sapo", "mini:Desafio da metamorfose", "cic:esq", "cic:ten", "cic:lom", "mini:Desafio dos ciclos"] },
    { id: "saude", ic: "🦠", n: "Saúde e prevenção", d: "As verminoses, como se pega e como evitar.", p: [...DISL.map(x => x.aid), "mini:Desafio das verminoses"] },
    { id: "amaz", ic: "🐊", n: "Amazônia e Pará", d: "Conheça a fauna da nossa região.", p: [...PAL.map(x => x.aid), "mini:Desafio da fauna do Pará"] },
    { id: "nat", ic: "🧑‍🔬", n: "Naturalistas e classificação", d: "Quem estudou os animais e como eles são classificados.", p: [...NATL.map(x => x.aid), "mini:Desafio dos naturalistas", "jogo:cls", "jogo:img"] },
    { id: "final", ic: "🏆", n: "Rumo ao topo", d: "Os grandes desafios: tudo o que você aprendeu.", p: ["fic", ...PRL.map(x => x.aid), "jogo:treino", "jogo:final", "jogo:simulado"] }];

  /* ---------- estado ---------- */
  const feita = id => id.startsWith("estrela:") ? stars.has(id.slice(8)) : !!(PG.H.at && PG.H.at[id]);
  function calcula() {
    let xp = 0, n = 0;
    ATV.forEach(a => { if (feita(a.id)) { xp += a.xp; n++; } });
    const trOk = TRILHAS.filter(t => t.p.every(feita));
    xp += trOk.length * XPC.trilha;
    Object.values(PG.H.q || {}).forEach(r => { if (r.a > 0) xp += 5 + Math.min(r.a - 1, 4); });
    const pct = n / ATV.length;
    let lv = 1; for (let i = 0; i < 9; i++) if (xp >= NIVEIS[i][0]) lv = i + 1;
    if (pct >= META) lv = 10;
    return { xp, n, tot: ATV.length, pct, lv, trOk };
  }
  let ult = null, iniciado = false;
  function atualiza() {
    if (typeof PG === "undefined" || !PG.H) return;
    const e = calcula();
    const [base, ic, nome] = NIVEIS[e.lv - 1];
    const prox = e.lv < 9 ? NIVEIS[e.lv][0] : null;
    const fr = e.lv >= 10 ? 1 : e.lv === 9 ? Math.min(1, e.pct / META) : (e.xp - base) / (prox - base);
    $("#nvt").textContent = ic + " Nível " + e.lv;
    $("#nvxp").textContent = e.xp + " XP";
    $("#nvbar").style.width = Math.round(fr * 100) + "%";
    if (iniciado && ult && e.lv > ult.lv) subiu(e.lv);
    if (iniciado && ult && e.trOk.length > ult.trOk.length) { const t = e.trOk.find(x => !ult.trOk.includes(x)); if (t) aviso("🎉 Trilha concluída: " + t.ic + " " + t.n + " (+" + XPC.trilha + " XP)"); }
    ult = e;
    if ($("#home").classList.contains("on")) renderHome();
    if ($("#trilhas").classList.contains("on")) renderTrilhas();
    if ($("#prog").classList.contains("on")) renderNv();
  }
  function marcar(id) {
    if (!PORID[id] || id.startsWith("estrela:")) return;
    if (PG.marcar(id)) { aviso("✅ " + PORID[id].nome + " · +" + PORID[id].xp + " XP", true); atualiza(); }
  }
  /* quando o perfil muda, o nível é recalculado sem festa */
  function recomeca() { ult = null; atualiza(); }
  function subiu(lv) {
    const [, ic, nome] = NIVEIS[lv - 1];
    aviso(`⬆️ Você subiu para o nível ${lv}: ${ic} ${nome}!`);
    burst(lv === 10 ? 300 : 120); beep("star");
  }
  let avT = null;
  function aviso(txt, leve) {
    let el = $("#nvtoast");
    if (!el) { el = document.createElement("div"); el.id = "nvtoast"; el.setAttribute("role", "status"); document.body.appendChild(el); }
    el.textContent = txt; el.className = "show" + (leve ? " leve" : "");
    clearTimeout(avT); avT = setTimeout(() => { el.className = ""; }, leve ? 1800 : 3600);
  }
  function aba(t) {
    if (t === "fic") marcar("fic");
    if (t === "home") renderHome();
    if (t === "trilhas") renderTrilhas();
    if (t === "prog") renderNv();
  }

  /* ---------- telas ---------- */
  const barra = (f, c) => `<span class="nvbar"><i style="width:${Math.round(f * 100)}%${c ? ";background:" + c : ""}"></i></span>`;
  function cartaoNivel(e) {
    const [base, ic, nome] = NIVEIS[e.lv - 1];
    const prox = e.lv < 9 ? NIVEIS[e.lv] : null;
    const falta = e.lv < 9 ? `Faltam <b>${prox[0] - e.xp} XP</b> para o nível ${e.lv + 1} (${prox[1]} ${prox[2]}).`
      : e.lv === 9 ? `Para o último nível (🏆 ${NIVEIS[9][2]}), conclua <b>${Math.ceil(META * e.tot)}</b> das ${e.tot} atividades. Faltam <b>${Math.max(0, Math.ceil(META * e.tot) - e.n)}</b>.`
        : "Você chegou ao nível máximo! 🎉";
    const fr = e.lv >= 10 ? 1 : e.lv === 9 ? Math.min(1, e.pct / META) : (e.xp - base) / (prox[0] - base);
    return `<div class="nvcard"><div class="nvic">${ic}</div><div class="nvinfo"><div class="nvtop"><b>Nível ${e.lv} · ${nome}</b><span>${e.xp} XP</span></div>${barra(fr)}<p>${falta}</p><p class="nvpct">✅ ${e.n} de ${e.tot} atividades concluídas (${Math.round(e.pct * 100)}%) · o último nível pede 70%.</p></div></div>`;
  }
  function proximoPasso() {
    for (const t of TRILHAS) { const i = t.p.findIndex(id => !feita(id)); if (i >= 0 && t.p.slice(0, i).length) return [t, t.p[i]]; }
    for (const t of TRILHAS) { const id = t.p.find(x => !feita(x)); if (id) return [t, id]; }
    return null;
  }
  function renderHome() {
    const el = $("#hnv"); if (!el) return;
    const e = ult || calcula(), pp = proximoPasso();
    el.innerHTML = cartaoNivel(e) + (pp ? `<div class="nvcont"><div><small>🧭 Continue a trilha ${pp[0].ic} ${pp[0].n}</small><b>${PORID[pp[1]].nome}</b></div><button class="btn pri" id="nvgo">▶ Continuar</button></div>` : "");
    if (pp) $("#nvgo").onclick = () => PORID[pp[1]].ir();
  }
  function renderTrilhas() {
    const box = $("#trbox"); if (!box) return;
    box.innerHTML = `<h2>🧭 Trilhas</h2><p class="sub">Caminhos guiados: siga os passos em ordem. Cada passo vale XP e cada trilha completa vale <b>+${XPC.trilha} XP</b>.</p><div class="trs">${TRILHAS.map(t => {
      const ok = t.p.filter(feita).length, prox = t.p.find(x => !feita(x));
      return `<div class="tr${ok === t.p.length ? " ok" : ""}"><div class="trh"><span class="tric">${t.ic}</span><div><b>${t.n}</b><small>${t.d}</small></div></div>${barra(ok / t.p.length)}<div class="trf"><span>${ok} de ${t.p.length} passos${ok === t.p.length ? " · ✅ concluída" : ""}</span>${prox ? `<button class="btn pri" data-go="${esc(prox)}">${ok ? "▶ Continuar" : "▶ Começar"}</button>` : ""}</div><details><summary>Ver os passos</summary><ol>${t.p.map(id => `<li class="${feita(id) ? "f" : ""}"><button class="trp" data-go="${esc(id)}">${feita(id) ? "✅" : "⬜"} ${PORID[id].nome}</button></li>`).join("")}</ol></details></div>`;
    }).join("")}</div>`;
    $$("[data-go]", box).forEach(b => b.onclick = () => PORID[b.dataset.go].ir());
  }
  function renderNv() {
    const box = $("#nvbox"); if (!box) return;
    box.hidden = !!prModo;
    if (prModo) return;
    const e = ult || calcula();
    const cats = [...new Set(ATV.map(a => a.cat))];
    box.innerHTML = `<h2>📊 Progresso</h2><p class="sub">${PROF.cur ? `👤 <b>${esc(PROF.cur)}</b> · ⭐ ${stars.size}/13 estrelas` : "👤 Sem nome: o progresso não será salvo."}</p>${cartaoNivel(e)}
     <h3 class="pgh">🧭 Trilhas</h3><div class="nvtr">${TRILHAS.map(t => { const ok = t.p.filter(feita).length; return `<button class="nvt${ok === t.p.length ? " ok" : ""}" data-tr="1"><span>${t.ic} ${t.n}</span>${barra(ok / t.p.length)}<small>${ok}/${t.p.length}</small></button>`; }).join("")}</div>
     <h3 class="pgh">✅ Atividades</h3><p class="sub">Toque em uma atividade que falta para ir até ela.</p>
     <div class="nvcats">${cats.map(c => { const L = ATV.filter(a => a.cat === c), ok = L.filter(a => feita(a.id)).length; return `<details class="nvcat"><summary><b>${c}</b><span>${ok}/${L.length}</span>${barra(ok / L.length)}</summary><ul>${L.map(a => `<li class="${feita(a.id) ? "f" : ""}"><button class="trp" data-go="${esc(a.id)}">${feita(a.id) ? "✅" : "⬜"} ${a.nome} <small>+${a.xp} XP</small></button></li>`).join("")}</ul></details>`; }).join("")}</div>
     <p class="hintn">Como ganhar XP: estudar um grupo +${XPC.estudar} · estrela de um grupo +${XPC.estrela} · explorar uma tela ou cartão +${XPC.explorar} · desafio de tela +${XPC.mini} · jogo +${XPC.jogo} · trilha completa +${XPC.trilha} · cada pergunta acertada pela primeira vez +5 (e +1 nas próximas vezes, até 4).</p>`;
    $$("[data-go]", box).forEach(b => b.onclick = () => PORID[b.dataset.go].ir());
    $$("[data-tr]", box).forEach(b => b.onclick = () => irPara("trilhas"));
  }

  $("#sl").addEventListener("input", () => marcar("temp"));
  $("#nvb").onclick = () => irPara("prog");
  atualiza(); iniciado = true; renderHome();
  return { atualiza, marcar, recomeca, aba, calcula, ATV, TRILHAS, NIVEIS, META };
})();
