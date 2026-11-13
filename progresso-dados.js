/* Dados de progresso do aluno (objeto PG): histórico, caderno de erros, desempenho por área. Usado por progresso.js. */
"use strict";
const PG = (() => {
  const HK = n => "an8h:" + n;            // histórico do aluno
  const RK = (n, m) => "an8r:" + n + ":" + m; // rodada em andamento (para continuar depois)
  const RANK = "an8rk";                    // ranking do aparelho
  const MEM = {};                          // sem perfil: só na memória
  const ler = k => { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; } };
  const gravar = (k, v) => { try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const vazio = () => ({ q: {}, c: [], r: [], at: {} });
  let H = vazio();

  /* ---------- todas as perguntas do app, com id estável (tirado do texto) ---------- */
  let IDX = null, LISTA = null;
  /* id = texto da pergunta + alternativas (há perguntas com o mesmo texto e alternativas diferentes) */
  const idDe = idPerg;
  const AREAS = {};
  function indice() {
    if (IDX) return IDX;
    IDX = {}; LISTA = [];
    const add = (q, o, a, w, ar) => { const id = idDe(q, o); if (IDX[id]) return; const it = { id, q, o, a, w, ar }; IDX[id] = it; LISTA.push(it); };
    G.forEach(g => { AREAS[g.id] = { n: g.n, c: g.c, ic: g.id }; g.pool.forEach(x => add(x.q, x.o, x.a, x.w, g.id)); });
    Object.keys(MINI).forEach(t => { AREAS[t] = { n: t.replace(/^Desafio (da|das|do|dos) /, "").replace(/^./, c => c.toUpperCase()), c: "#38bdf8" }; MINI[t].forEach(x => add(x[0], x[1], 0, x[2], t)); });
    AREAS.final = { n: "Desafio final", c: "#f472b6" };
    QZ.forEach(x => add(x[0], x[1], x[2], x[3], "final"));
    return IDX;
  }
  const item = id => indice()[id];
  const todas = () => { indice(); return LISTA; };

  /* ---------- histórico ---------- */
  function carregar() {
    const n = PROF.cur;
    if (!n) { H = MEM["~"] || (MEM["~"] = vazio()); return; }
    const d = ler(HK(n));
    H = d && d.q && Array.isArray(d.c) && Array.isArray(d.r) ? d : vazio();
    if (!H.at || typeof H.at !== "object") H.at = {};
    if (typeof prRender === "function") prRender();
  }
  const salvar = () => { if (PROF.cur) gravar(HK(PROF.cur), H); };
  /* registra uma resposta: atualiza vistas/acertos, sequência e o caderno de erros (sai após 2 acertos seguidos) */
  function registrar(q, o, ok) {
    const id = idDe(q, o); if (!item(id)) return;
    const r = H.q[id] || (H.q[id] = { v: 0, a: 0, s: 0, u: 0 });
    r.v++; r.u = Date.now();
    if (ok) { r.a++; r.s++; if (r.s >= 2) H.c = H.c.filter(x => x !== id); }
    else { r.s = 0; if (!H.c.includes(id)) H.c.push(id); }
    salvar();
    if (typeof NV !== "undefined") NV.atualiza();
  }
  /* atividade concluída (para o XP, o nível e as trilhas) */
  function marcar(a) { if (!H.at) H.at = {}; if (H.at[a]) return false; H.at[a] = Date.now(); salvar(); return true; }
  function rodadaFeita(m, sc, n) { H.r.push({ m, d: Date.now(), s: sc, n }); if (H.r.length > 60) H.r = H.r.slice(-60); salvar(); }
  const dominada = id => (H.q[id] || {}).s >= 2;

  /* desempenho por área */
  function resumo() {
    const A = {};
    todas().forEach(it => { const a = A[it.ar] || (A[it.ar] = { tot: 0, vis: 0, dom: 0, v: 0, ac: 0 }); a.tot++; const r = H.q[it.id]; if (r) { a.vis++; a.v += r.v; a.ac += r.a; if (r.s >= 2) a.dom++; } });
    return A;
  }

  /* treino adaptativo: mais perguntas do caderno de erros, das nunca vistas e das que não vê há tempo */
  function sugerir(n, area) {
    const agora = Date.now();
    const L = todas().filter(it => !area || it.ar === area).map(it => {
      const r = H.q[it.id]; let p;
      if (H.c.includes(it.id)) p = 6;
      else if (!r) p = 3;
      else if (r.s >= 2) p = 0.4 + Math.min(2, (agora - r.u) / 864e5 / 7);
      else p = 2;
      return { id: it.id, p: p * (0.5 + Math.random()) };
    });
    return L.sort((a, b) => b.p - a.p).slice(0, n).map(x => x.id);
  }
  /* simulado: uma pergunta de cada grupo e o resto do desafio final e dos mini desafios */
  function simulado() {
    const ids = shuffle(G).map(g => { const x = shuffle(g.pool)[0]; return idDe(x.q, x.o); });
    const resto = shuffle(todas().filter(it => !G.some(g => g.id === it.ar)));
    for (const it of resto) { if (ids.length >= 20) break; if (!ids.includes(it.id)) ids.push(it.id); }
    return shuffle(ids);
  }

  /* ---------- ranking do aparelho (desafio final e simulado) ---------- */
  function ranking(m) { const d = ler(RANK) || {}; return Array.isArray(d[m]) ? d[m] : []; }
  function ranquear(m, s, t) {
    if (!PROF.cur) return -1;
    const d = ler(RANK) || {}; const L = Array.isArray(d[m]) ? d[m] : [];
    const e = { n: PROF.cur, s, t, d: Date.now() }; L.push(e);
    L.sort((a, b) => b.s / b.t - a.s / a.t || a.d - b.d); d[m] = L.slice(0, 10); gravar(RANK, d);
    return d[m].indexOf(e);
  }

  /* ---------- rodada em andamento ---------- */
  const lerRodada = m => PROF.cur ? ler(RK(PROF.cur, m)) : (MEM["r:" + m] || null);
  const salvarRodada = (m, st) => { if (PROF.cur) gravar(RK(PROF.cur, m), st); else MEM["r:" + m] = st; };

  /* apaga tudo de um aluno (quando o perfil é apagado) */
  function apagar(n) {
    gravar(HK(n), null); ["final", "erros", "treino", "simulado"].forEach(m => gravar(RK(n, m), null));
    const d = ler(RANK); if (d) { Object.keys(d).forEach(m => { d[m] = d[m].filter(e => e.n !== n); }); gravar(RANK, d); }
  }
  function limparHistorico() { H = vazio(); salvar(); if (PROF.cur) ["final", "erros", "treino", "simulado"].forEach(m => gravar(RK(PROF.cur, m), null)); else Object.keys(MEM).forEach(k => delete MEM[k]); }

  /* ---------- levar o progresso para outro aparelho (código para copiar e colar) ---------- */
  function exportar() {
    if (!PROF.cur) return "";
    const r = PROF.p[PROF.cur] || { s: "", k: "" };
    const txt = JSON.stringify({ v: 1, n: PROF.cur, s: r.s, k: r.k, h: H });
    return "AN8-" + btoa(unescape(encodeURIComponent(txt)));
  }
  function importar(cod) {
    let d;
    try { d = JSON.parse(decodeURIComponent(escape(atob(String(cod).trim().replace(/^AN8-/, ""))))); } catch (e) { return "Código inválido. Copie o código inteiro, começando por AN8-."; }
    if (!d || d.v !== 1 || typeof d.n !== "string" || !d.n || d.n.length > 20 || !d.h || typeof d.h.q !== "object") return "Código inválido.";
    const n = Object.keys(PROF.p).find(x => x.toLowerCase() === d.n.toLowerCase()) || d.n;
    if (!PROF.p[n] && Object.keys(PROF.p).length >= 30) return "Limite de 30 alunos neste aparelho. Apague algum perfil.";
    /* estrelas: só valem se a assinatura confere (evita estrelas inventadas) */
    const minhas = profIds(n);
    const novas = typeof d.s === "string" && d.k === sigOf(d.n, d.s) ? d.s.split(",").filter(id => G.some(g => g.id === id)) : [];
    const ids = [...new Set([...minhas, ...novas])].sort().join(",");
    PROF.p[n] = { s: ids, k: sigOf(n, ids) };
    /* histórico: junta, ficando com o registro mais recente de cada pergunta */
    const atual = ler(HK(n)) || vazio();
    if (!nomeOk(n)) return "Código inválido.";
    Object.keys(d.h.q).filter(id => /^q[0-9a-f]+$/.test(id)).forEach(id => { const x = d.h.q[id]; if (!x || typeof x.v !== "number") return; if (!atual.q[id] || (x.u || 0) > (atual.q[id].u || 0)) atual.q[id] = { v: +x.v || 0, a: +x.a || 0, s: +x.s || 0, u: +x.u || 0 }; });
    if (Array.isArray(d.h.c)) atual.c = [...new Set([...atual.c, ...d.h.c.filter(id => typeof id === "string")])].filter(id => !(atual.q[id] && atual.q[id].s >= 2));
    if (Array.isArray(d.h.r)) { const vis = new Set(atual.r.map(x => x.d)); d.h.r.forEach(x => { if (x && typeof x.d === "number" && !vis.has(x.d)) atual.r.push({ m: String(x.m), d: x.d, s: +x.s || 0, n: +x.n || 0 }); }); atual.r.sort((a, b) => a.d - b.d); atual.r = atual.r.slice(-60); }
    if (d.h.at && typeof d.h.at === "object") { atual.at = atual.at || {}; Object.keys(d.h.at).forEach(k => { if (/^[a-z]+:?[^<>]*$/.test(k) && !/__proto__|constructor|prototype/.test(k) && k.length < 60 && !atual.at[k]) atual.at[k] = +d.h.at[k] || Date.now(); }); }
    gravar(HK(n), atual);
    switchTo(n);
    return "";
  }

  return { idDe, item, todas, carregar, registrar, marcar, rodadaFeita, dominada, resumo, sugerir, simulado, ranking, ranquear, lerRodada, salvarRodada, apagar, limparHistorico, exportar, importar, areas: () => (indice(), AREAS), get H() { return H; } };
})();
