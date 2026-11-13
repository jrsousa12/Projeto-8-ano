/* Progresso do aluno: histórico de cada pergunta, caderno de erros, desempenho por área,
   treino adaptativo, simulado, ranking, sequência de acertos e "continuar de onde parou".
   Tudo fica salvo só neste aparelho, por aluno (perfil). Sem perfil ("Jogar sem salvar"), nada é gravado. */
"use strict";
/* ---------- rodada de perguntas (desafio final, caderno de erros, treino e simulado) ----------
   cfg: { m: modo, box, titulo, sim: true no simulado (sem dica e sem correção até o fim), tempo: segundos (simulado),
          rank: true para entrar no ranking, fim: função chamada no resultado, voltar: rótulo e ação do botão extra } */
const RODA = {};
function rodada(cfg, ids, retomar) {
  const st = retomar || { m: cfg.m, ids, i: 0, sc: 0, h: 0, miss: [], seq: 0, best: 0, resp: {}, rest: cfg.tempo ? cfg.tempo * 1000 : 0, rev: !!cfg.rev };
  /* uma rodada nova na mesma caixa para o relógio de outra (o simulado fica salvo para continuar) */
  Object.keys(RODA).forEach(k => { const o = RODA[k]; if (o.tm && o.cfg.box() === cfg.box()) { clearInterval(o.tm); if (!o.st.rev && !o.st.fim) PG.salvarRodada(k, o.st); } });
  RODA[cfg.m] = { cfg, st };
  if (!st.rev) PG.salvarRodada(cfg.m, st);
  mostrar(cfg.m);
}
function rodadaRelogio(m) {
  const R = RODA[m]; if (!R || !R.cfg.tempo) return;
  clearInterval(R.tm); let ult = Date.now();
  R.tm = setInterval(() => {
    const box = R.cfg.box();
    if (!box || box.dataset.m !== m || RODA[m] !== R) { clearInterval(R.tm); return; }
    const vis = box.isConnected && box.offsetParent !== null && !document.hidden;
    const agora = Date.now(); if (vis) R.st.rest -= agora - ult; ult = agora;
    const el = box.querySelector(".rel"); if (el) el.textContent = "⏱️ " + relogio(R.st.rest);
    if (vis && Math.round(R.st.rest / 1000) % 5 === 0) PG.salvarRodada(m, R.st);
    if (R.st.rest <= 0) { clearInterval(R.tm); R.st.rest = 0; R.st.i = R.st.ids.length; mostrar(m); }
  }, 1000);
}
const relogio = ms => { const s = Math.max(0, Math.ceil(ms / 1000)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
function mostrar(m) {
  const R = RODA[m], { cfg, st } = R, box = cfg.box();
  box.dataset.m = m;
  if (st.i >= st.ids.length) return resultado(m);
  const it = PG.item(st.ids[st.i]);
  if (!it) { st.i++; return mostrar(m); }
  HF = false;
  const n = st.ids.length;
  box.innerHTML = `<div class="qtop"><span>${cfg.titulo} · ${st.rev ? "Revisão · " : ""}Pergunta ${st.i + 1}/${n}</span><span>${cfg.sim ? `<span class="rel">⏱️ ${relogio(st.rest)}</span>` : `⭐ ${fmt(st.sc)} <span class="streak" title="Acertos seguidos">🔥 ${st.seq}</span>`}</span></div><div class="qbar"><i style="width:${st.i / n * 100}%"></i></div><div class="qq">${it.q}</div><div id="qo-${m}"></div><div class="why" id="qw-${m}"></div><div class="rnav"><button class="btn pri" id="qn-${m}" style="display:none">Próxima ▶</button>${cfg.sim ? ` <button class="btn" id="qp-${m}">Pular ▶</button>` : ""}</div>`;
  const od = $("#qo-" + m, box); let feito = false, okB = null;
  shuffle(it.o.map((t, k) => ({ t, k }))).forEach(x => {
    const b = document.createElement("button"); b.className = "opt"; b.textContent = x.t; if (x.k === it.a) okB = b;
    b.onclick = ev => {
      if (!ev || !ev.isTrusted || feito) return; feito = true; $$(".opt", od).forEach(y => y.disabled = true);
      const ok = x.k === it.a;
      if (!st.rev) PG.registrar(it.q, it.o, ok);
      if (ok) { st.sc += HF ? .5 : 1; st.seq++; st.best = Math.max(st.best, st.seq); } else { st.seq = 0; st.miss.push(it.id); }
      if (HF) st.h++;
      if (cfg.sim) { st.resp[it.id] = x.k; st.i++; PG.salvarRodada(m, st); mostrar(m); return; }
      beep(ok ? "ok" : "no");
      if (ok) { b.classList.add("ok"); $("#qw-" + m, box).innerHTML = "🎉 <b>Correto!</b> " + it.w; if (st.seq > 0 && st.seq % 5 === 0) burst(40); }
      else { b.classList.add("no"); okB.classList.add("ok"); $("#qw-" + m, box).innerHTML = "🤔 Não foi dessa vez. " + it.w; }
      st.i++; if (!st.rev) PG.salvarRodada(m, st);
      const nx = $("#qn-" + m, box); nx.style.display = "inline-block"; nx.textContent = st.i >= n ? "Ver resultado" : "Próxima ▶"; nx.onclick = () => mostrar(m); nx.focus();
    };
    od.appendChild(b);
  });
  if (cfg.sim) { $("#qp-" + m, box).onclick = () => { st.resp[it.id] = -1; st.i++; PG.salvarRodada(m, st); mostrar(m); }; rodadaRelogio(m); }
  else od.after(mkHint(od, okB, () => feito, () => {}));
}
function resultado(m) {
  const R = RODA[m], { cfg, st } = R, box = cfg.box(); clearInterval(R.tm); box.dataset.m = m;
  const n = st.ids.length;
  let sc = st.sc, revisao = "";
  if (cfg.sim) {
    /* simulado: corrige no fim; o que ficou sem resposta (ou o tempo acabou) aparece na revisão */
    sc = 0; const L = [];
    st.ids.forEach((id, k) => {
      const it = PG.item(id); if (!it) return; const r = st.resp[id];
      const ok = r === it.a; if (ok) sc++;
      L.push(`<li class="${ok ? "rok" : "rno"}"><b>${k + 1}.</b> ${it.q}<br>${ok ? "✅" : r === undefined || r === -1 ? "⏳ Sem resposta." : "❌ Você marcou: " + it.o[r] + "."} Correta: <b>${it.o[it.a]}</b>. <small>${it.w}</small></li>`);
    });
    st.miss = st.ids.filter(id => { const it = PG.item(id); return it && st.resp[id] !== it.a; });
    revisao = `<div class="review"><b>📋 Correção completa</b><ol class="sim">${L.join("")}</ol></div>`;
  }
  const pct = n ? sc / n : 0;
  const msg = pct >= .9 ? ["🏆", "Biólogo(a) Nível Máximo!"] : pct >= .7 ? ["🌟", "Muito bem, explorador(a)!"] : pct >= .5 ? ["👍", "Bom caminho! Revise a árvore dos animais."] : ["🌱", "Vamos explorar mais um pouquinho!"];
  let pos = -1;
  if (!st.rev && !st.fim) {
    st.fim = true;
    if (typeof NV !== "undefined") { if (m === "final" && pct >= .7) NV.marcar("jogo:final"); if (m === "simulado" && pct >= .6) NV.marcar("jogo:simulado"); if (m === "treino") NV.marcar("jogo:treino"); }
    if (cfg.sim) st.ids.forEach(id => { const it = PG.item(id), r = st.resp[id]; if (it && (r === undefined || r === -1)) PG.registrar(it.q, it.o, false); });
    PG.rodadaFeita(m, sc, n); if (cfg.rank && sc > 0) pos = PG.ranquear(m, sc, n);
    PG.salvarRodada(m, null);
  }
  const erros = st.miss.map(id => PG.item(id)).filter(Boolean);
  box.innerHTML = `<div class="final"><div class="big">${msg[0]}</div><h2>${msg[1]}</h2><p style="font-size:24px;margin:10px 0 6px">${st.rev ? "Revisão: " : ""}Você acertou <b>${fmt(sc)}</b> de ${n}</p>${cfg.sim ? (st.rest <= 0 ? `<p>⏰ O tempo acabou.</p>` : "") : `<p>🔥 Maior sequência de acertos: <b>${st.best}</b></p>`}${hintLine(st.h)}${pos >= 0 ? `<p class="rkmsg">🏆 Você ficou em <b>${pos + 1}º lugar</b> no ranking deste aparelho!</p>` : ""}${!cfg.sim && erros.length ? `<div class="review"><b>📚 Revise estes pontos:</b><ul>${erros.map(it => `<li>${it.q} <b>${it.o[it.a]}</b></li>`).join("")}</ul></div>` : ""}${revisao}${erros.length && !cfg.sim ? `<p class="hintn">📒 As perguntas que você errou foram para o seu caderno de erros (📊 Progresso).</p>` : ""}<div class="rnav">${erros.length ? `<button class="btn" id="rv-${m}">🔎 Rever só os ${erros.length} que errei</button> ` : ""}<button class="btn pri" id="ag-${m}">🔁 Jogar de novo</button>${cfg.voltar ? ` <button class="btn" id="vt-${m}">${cfg.voltar[0]}</button>` : ""}${typeof compartilhar === "function" && !st.rev ? ` <button class="btn" id="sh-${m}">📤 Compartilhar resultado</button>` : ""}</div>${cfg.rank ? rankHtml(m) : ""}</div>`;
  if (erros.length) $("#rv-" + m, box).onclick = () => rodada(Object.assign({}, cfg, { sim: false, tempo: 0, rank: false, rev: true }), shuffle(erros.map(it => it.id)));
  $("#ag-" + m, box).onclick = () => cfg.denovo();
  if (cfg.voltar) $("#vt-" + m, box).onclick = cfg.voltar[1];
  const sh = $("#sh-" + m, box); if (sh) sh.onclick = () => compartilhar(`${cfg.titulo} (Animais 8º ano): acertei ${fmt(sc)} de ${n}! 🔬`, sh);
  if (pct >= .7 && !st.rev) burst(180);
}
function rankHtml(m) {
  const L = PG.ranking(m); if (!L.length) return "";
  return `<div class="rk"><h3>🏆 Melhores pontuações neste aparelho</h3><ol>${L.map(e => `<li${e.n === PROF.cur ? ' class="eu"' : ""}><span>${esc(e.n)}</span><b>${fmt(e.s)}/${e.t}</b><small>${new Date(e.d).toLocaleDateString("pt-BR")}</small></li>`).join("")}</ol></div>`;
}
/* oferece continuar uma rodada salva; devolve true se havia uma */
function oferecerRetomar(cfg, novo) {
  const st = PG.lerRodada(cfg.m);
  if (!st || !Array.isArray(st.ids) || st.fim || st.i >= st.ids.length || !st.ids.every(id => PG.item(id))) return false;
  const box = cfg.box();
  box.innerHTML = `<div class="final"><div class="big">⏸️</div><h2>${cfg.titulo}</h2><p style="font-size:20px;margin:10px 0 18px">Você parou na pergunta <b>${st.i + 1} de ${st.ids.length}</b>${cfg.sim ? ` com <b>${relogio(st.rest)}</b> restando` : ""}.</p><button class="btn pri" id="rt-${cfg.m}">▶ Continuar de onde parei</button> <button class="btn" id="nv-${cfg.m}">🔁 Começar de novo</button></div>`;
  $("#rt-" + cfg.m, box).onclick = () => rodada(cfg, null, st);
  $("#nv-" + cfg.m, box).onclick = () => { PG.salvarRodada(cfg.m, null); novo(); };
  return true;
}

/* ---------- desafio final (aba 🎯) ---------- */
const qState = { started: false };
function cfgFinal() { return { m: "final", box: () => $("#qbox"), titulo: "🎯 Desafio final", rank: true, denovo: () => startQuiz(true) }; }
function startQuiz(forcar) {
  qState.started = true;
  const cfg = cfgFinal(), novo = () => rodada(cfg, shuffle(QZ).slice(0, 10).map(x => PG.idDe(x[0], x[1])));
  if (!forcar && oferecerRetomar(cfg, novo)) return;
  novo();
}

/* ---------- aba 📊 Meu progresso ---------- */
let prModo = "";
function prCfg(m) {
  const vt = ["◀ Voltar ao progresso", () => { prModo = ""; prRender(); }];
  if (m === "erros") return { m, box: () => $("#pgrun"), titulo: "📒 Caderno de erros", denovo: () => prIniciar("erros", true), voltar: vt };
  if (m === "treino") return { m, box: () => $("#pgrun"), titulo: "🧠 Treino inteligente", denovo: () => prIniciar("treino", true), voltar: vt };
  return { m: "simulado", box: () => $("#pgrun"), titulo: "📝 Simulado", sim: true, tempo: 20 * 60, rank: true, denovo: () => prIniciar("simulado", true), voltar: vt };
}
/* sai de uma rodada em andamento (ela continua salva) e volta ao resumo do progresso */
function prPausa() {
  if (!prModo) return;
  Object.keys(RODA).forEach(k => { const o = RODA[k]; clearInterval(o.tm); if (!o.st.rev && !o.st.fim && o.st.i < o.st.ids.length) PG.salvarRodada(k, o.st); });
  prModo = "";
}
function prIniciar(m, forcar, area) {
  prModo = m; prRender();
  const cfg = prCfg(m);
  const novo = () => {
    const ids = m === "erros" ? shuffle(PG.H.c.filter(id => PG.item(id))).slice(0, 10) : m === "treino" ? PG.sugerir(10, area) : PG.simulado();
    if (!ids.length) { $("#pgrun").innerHTML = `<div class="final"><div class="big">🎉</div><h2>Seu caderno de erros está vazio!</h2><p>Jogue os desafios: as perguntas que você errar aparecem aqui para treinar.</p><button class="btn" id="vt0">◀ Voltar ao progresso</button></div>`; $("#vt0").onclick = cfg.voltar[1]; return; }
    if (area) cfg.titulo = "🧠 Treino: " + PG.areas()[area].n;
    rodada(cfg, ids);
  };
  if (!forcar && !area && oferecerRetomar(cfg, novo)) return;
  novo();
}
function prRender() {
  const box = $("#pgbox"); if (!box) return;
  const nvb = $("#nvbox"); if (nvb) { nvb.hidden = !!prModo; if (!prModo && typeof NV !== "undefined") NV.aba("prog"); }
  if (prModo) { if (!$("#pgrun")) box.innerHTML = `<div id="pgrun"></div>`; return; }
  const H = PG.H, A = PG.resumo(), AR = PG.areas(), nome = PROF.cur;
  const erros = H.c.filter(id => PG.item(id)).length;
  const ordem = [...G.map(g => g.id), ...Object.keys(AR).filter(k => !G.some(g => g.id === k))];
  const barra = (a, k) => { const x = A[k] || { tot: 0, vis: 0, dom: 0, v: 0, ac: 0 }; const p = x.tot ? x.dom / x.tot * 100 : 0; const ac = x.v ? Math.round(x.ac / x.v * 100) : null;
    return `<div class="pgl"><span class="pgn">${AR[k].ic ? ICON[AR[k].ic]() : ""}${AR[k].n}</span><span class="pgb"><i style="width:${p}%;background:${AR[k].c}"></i></span><span class="pgt">${x.dom}/${x.tot} dominadas · vistas ${x.vis}${ac !== null ? ` · acertos ${ac}%` : ""}</span><button class="btn pgtr" data-a="${esc(k)}">Treinar</button></div>`; };
  const rodadas = H.r.slice(-10).reverse();
  const NM = { final: "🎯 Desafio final", erros: "📒 Caderno de erros", treino: "🧠 Treino", simulado: "📝 Simulado" };
  const salvos = ["erros", "treino", "simulado"].filter(m => { const s = PG.lerRodada(m); return s && !s.fim && s.i < (s.ids || []).length; });
  box.innerHTML = `<h2>📒 Caderno, treino e simulado</h2>
  <p class="sub">${nome ? `👤 <b>${esc(nome)}</b> · tudo fica salvo neste aparelho.` : `👤 Sem nome: o progresso <b>não</b> será salvo. Escolha um aluno na tela 🏠 Início.`}</p>
  <div class="pgcards">
   <div class="pgc" style="--c:#fb7185"><h3>📒 Caderno de erros</h3><p><b>${erros}</b> pergunta${erros === 1 ? "" : "s"} para treinar. Cada uma sai do caderno depois de 2 acertos seguidos.</p><div class="pgbt"><button class="btn pri" id="pg-erros"${erros ? "" : " disabled"}>Treinar com meus erros</button>${erros ? `<button class="btn" id="pg-lista">Ver a lista</button>` : ""}</div></div>
   <div class="pgc" style="--c:#a78bfa"><h3>🧠 Treino inteligente</h3><p>10 perguntas escolhidas para você: mais das que errou, das que nunca viu e das que não vê há tempo.</p><button class="btn pri" id="pg-treino">Começar o treino</button></div>
   <div class="pgc" style="--c:#38bdf8"><h3>📝 Simulado</h3><p>20 perguntas de todos os temas em 20 minutos. Sem dica e sem correção até o fim, como numa prova.</p><button class="btn pri" id="pg-sim">Fazer o simulado</button></div>
  </div>
  ${salvos.length ? `<p class="hintn">⏸️ Você tem ${salvos.map(m => NM[m]).join(" e ")} pela metade: toque no botão para continuar de onde parou.</p>` : ""}
  <div id="pglista"></div>
  <h3 class="pgh">📈 Desempenho por tema</h3><p class="sub">Uma pergunta está <b>dominada</b> quando você acerta 2 vezes seguidas.</p>
  <div class="pgarea">${ordem.map(k => barra(A, k)).join("")}</div>
  <h3 class="pgh">🗓️ Últimas rodadas</h3>
  ${rodadas.length ? `<div class="pgr">${rodadas.map(r => `<div class="pgrl"><span>${NM[r.m] || r.m}</span><span class="pgb"><i style="width:${r.n ? r.s / r.n * 100 : 0}%"></i></span><b>${fmt(r.s)}/${r.n}</b><small>${new Date(r.d).toLocaleDateString("pt-BR")}</small></div>`).join("")}</div>` : `<p class="sub">Nenhuma rodada ainda. Jogue o 🎯 Desafio final, o treino ou o simulado.</p>`}
  ${rankHtml("final") ? `<h3 class="pgh">🏆 Ranking deste aparelho</h3><div class="pgrk"><div><h4>🎯 Desafio final</h4>${rankHtml("final")}</div>${rankHtml("simulado") ? `<div><h4>📝 Simulado</h4>${rankHtml("simulado")}</div>` : ""}</div>` : ""}
  ${nome ? `<h3 class="pgh">📲 Levar meu progresso para outro aparelho</h3>
  <p class="sub">Copie o código e cole no outro aparelho (estrelas, caderno de erros e histórico).</p>
  <div class="pgx"><button class="btn" id="pg-exp">📋 Copiar meu código</button> <input id="pg-cod" placeholder="Cole aqui um código AN8-..." autocomplete="off"> <button class="btn" id="pg-imp">Trazer progresso</button></div><p class="hintn" id="pg-msg"></p>
  <p style="margin-top:14px"><button class="btn" id="pg-del">🗑️ Apagar o histórico de ${esc(nome)}</button></p>` : ""}`;
  $("#pg-erros").onclick = () => prIniciar("erros");
  $("#pg-treino").onclick = () => prIniciar("treino");
  $("#pg-sim").onclick = () => prIniciar("simulado");
  $$(".pgtr", box).forEach(b => b.onclick = () => prIniciar("treino", true, b.dataset.a));
  const li = $("#pg-lista"); if (li) li.onclick = () => { const L = H.c.map(id => PG.item(id)).filter(Boolean); $("#pglista").innerHTML = `<div class="review"><b>📒 Perguntas do caderno de erros</b><ul>${L.map(it => `<li>${it.q} <b>${it.o[it.a]}</b> <small>(${AR[it.ar].n})</small></li>`).join("")}</ul></div>`; li.remove(); };
  if (nome) {
    $("#pg-exp").onclick = async () => { const c = PG.exportar(); $("#pg-cod").value = c; let ok = false; try { await navigator.clipboard.writeText(c); ok = true; } catch (e) {} $("#pg-msg").textContent = ok ? "✅ Código copiado. Cole no outro aparelho, em 📊 Meu progresso." : "Selecione o código na caixa e copie."; $("#pg-cod").select(); };
    $("#pg-imp").onclick = () => { const v = $("#pg-cod").value; if (!v.trim()) { $("#pg-msg").textContent = "Cole o código no campo ao lado."; return; } if (v === PG.exportar()) { $("#pg-msg").textContent = "Esse é o código deste aparelho. Cole-o no outro aparelho."; return; } const e = PG.importar(v); if (e) $("#pg-msg").textContent = e; else { showTab("prog"); $("#pg-msg").textContent = "✅ Progresso trazido."; } };
    let t = 0; $("#pg-del").onclick = function () { if (!t) { this.textContent = "⚠️ Toque de novo para apagar"; t = setTimeout(() => { t = 0; if (this.isConnected) this.textContent = "🗑️ Apagar o histórico de " + nome; }, 4000); } else { clearTimeout(t); PG.limparHistorico(); prRender(); } };
  }
}

PG.carregar();
