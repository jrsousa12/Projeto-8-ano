/* Curiosidades (tela inicial), naturalistas, ciclos dos vermes (animação passo a passo) e fontes. */
"use strict";

/* ---------- curiosidade da tela inicial ---------- */
let curI = Math.floor(Math.random() * CUR.length);
function renderCuri() {
  const el = $("#curi"); if (!el) return;
  const [gid, txt] = CUR[curI], g = G.find(x => x.id === gid);
  el.innerHTML = `<div class="curic">${g ? ICON[g.id]() : ""}</div><div><b>💡 Curiosidade${g ? " · " + g.n : ""}</b><p>${txt}</p></div><button class="btn" id="curn" title="Mostra outra curiosidade">🔄 Outra</button>`;
  $("#curn").onclick = () => { curI = (curI + 1 + Math.floor(Math.random() * (CUR.length - 1))) % CUR.length; renderCuri(); };
}
renderCuri();

/* ---------- naturalistas ---------- */
/* retrato ilustrado simples (desenho próprio, sem foto) */
function retrato(o, fundo) {
  const pele = o.pele, cab = o.cab;
  const cabelo = o.peruca
    ? `<g fill="${cab}"><circle cx="38" cy="52" r="11"/><circle cx="36" cy="66" r="10"/><circle cx="82" cy="52" r="11"/><circle cx="84" cy="66" r="10"/><path d="M36 46 Q60 18 84 46 Q60 36 36 46Z"/></g>`
    : o.careca
      ? `<g fill="${cab}"><path d="M37 58 Q36 44 42 40 L44 62Z"/><path d="M83 58 Q84 44 78 40 L76 62Z"/></g>`
      : `<path d="M38 56 Q36 28 60 28 Q84 28 82 56 Q76 40 60 40 Q46 40 38 56Z" fill="${cab}"/>`;
  const barba = o.barba ? `<path d="M42 64 Q44 92 60 94 Q76 92 78 64 Q72 78 60 78 Q48 78 42 64Z" fill="${o.barba}"/>` : "";
  const oculos = o.oculos ? `<g fill="none" stroke="#1f2937" stroke-width="2"><circle cx="51" cy="58" r="6"/><circle cx="69" cy="58" r="6"/><path d="M57 58 H63"/></g>` : "";
  return `<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="56" fill="${fundo || "#1e3a5f"}"/><path d="M18 118 Q22 90 60 88 Q98 90 102 118Z" fill="${o.roupa}"/><path d="M52 82 H68 V92 Q60 96 52 92Z" fill="${pele}"/><ellipse cx="60" cy="60" rx="21" ry="25" fill="${pele}"/>${cabelo}<circle cx="51" cy="58" r="2.4" fill="#1f2937"/><circle cx="69" cy="58" r="2.4" fill="#1f2937"/><path d="M60 60 Q58 67 61 68" stroke="#9a6b4f" stroke-width="1.6" fill="none"/>${barba}<path d="M53 73 Q60 77 67 73" stroke="#7c2d12" stroke-width="2" fill="none" stroke-linecap="round"/>${oculos}</svg>`;
}
const NATC = ["#f59e0b", "#14b8a6", "#8b5cf6", "#38bdf8", "#22c55e", "#fb923c", "#f472b6"];
const NATL = NAT.map((n, i) => ({
  c: NATC[i % NATC.length], svg: retrato(n[6]), name: n[0], tag: n[1] + " · " + n[2], sub: n[3],
  html: `<h3>Quem foi</h3><p>${n[4]}</p><h3>Quando e onde</h3><p>${n[1]} · ${n[2]}</p><div class="know">💡 <b>Você sabia?</b> ${n[5]}</div>`
}));
cardsFor("#natg", NATL);
mini("#nat", "Desafio dos naturalistas", MQ0["Desafio dos naturalistas"]);

/* ---------- ciclos dos vermes (passo a passo animado) ---------- */
const E = (x, y, s, ch, cls) => `<text x="${x}" y="${y}" font-size="${s}" text-anchor="middle"${cls ? ` class="${cls}"` : ""}>${ch}</text>`;
const AGUA = `<rect x="0" y="92" width="160" height="68" fill="#38bdf8" opacity=".55"/><path d="M0 92 Q20 86 40 92 T80 92 T120 92 T160 92" fill="none" stroke="#e0f2fe" stroke-width="3"/>`;
const SOLO = `<path d="M0 112 Q80 100 160 112 V160 H0Z" fill="#92400e"/>`;
const OVO = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="4.5" ry="3" fill="#fef3c7" stroke="#b45309" stroke-width="1.4"/>`;
const OVOS = L => L.map(c => OVO(c[0], c[1])).join("");
const MIRA = (x, y) => `<g class="swim"><ellipse cx="${x}" cy="${y}" rx="8" ry="5" fill="#fde68a"/>${[-6, -2, 2, 6].map(d => `<path d="M${x + d} ${y - 5} l-1 -4 M${x + d} ${y + 5} l-1 4" stroke="#fde68a" stroke-width="1.2"/>`).join("")}</g>`;
const CERC = (x, y) => `<g class="swim"><ellipse cx="${x}" cy="${y}" rx="4" ry="3" fill="#fef9c3"/><path d="M${x + 4} ${y} l8 0 l4 -4 M${x + 12} ${y} l4 4" stroke="#fef9c3" stroke-width="1.6" fill="none"/></g>`;
const CARA = (x, y, k) => `<g transform="translate(${x} ${y}) scale(${k})">${DISART.caramujo.replace("<svg ", "<svg width=\"120\" height=\"80\" ")}</g>`;
const LARVA = (x, y) => `<path class="wig" d="M${x} ${y} q4 -5 8 0 t8 0" stroke="#fde68a" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
const INTEST = `<path d="M20 60 H140 Q150 60 150 72 Q150 84 140 84 H30 Q20 84 20 96 Q20 108 30 108 H140" fill="none" stroke="#fda4af" stroke-width="20" stroke-linecap="round" opacity=".8"/>`;
const CENA = inner => `<svg viewBox="0 0 160 160"><rect width="160" height="160" rx="18" fill="#0b2545" opacity=".35"/>${inner}</svg>`;
const CIC = {
  esq: [
    { t: "1. Ovos chegam à água", d: "Sem esgoto tratado, as fezes de uma pessoa doente chegam aos rios e lagoas. Junto vêm os ovos do esquistossomo.", s: CENA(`${AGUA}<rect x="0" y="54" width="54" height="16" rx="4" fill="#94a3b8"/><path d="M54 62 Q66 66 70 92" stroke="#a16207" stroke-width="7" fill="none" opacity=".75"/>${OVOS([[70, 104], [84, 112], [62, 120], [92, 128], [76, 136]])}`) },
    { t: "2. Nasce o miracídio", d: "Na água doce, cada ovo libera uma larva cheia de cílios, o miracídio, que nada à procura de um caramujo.", s: CENA(`${AGUA}${MIRA(60, 116)}${MIRA(104, 132)}${OVOS([[40, 134]])}`) },
    { t: "3. Dentro do caramujo", d: "O miracídio entra no caramujo (Biomphalaria), o hospedeiro intermediário. Lá dentro ele se multiplica muito.", s: CENA(`${AGUA}${CARA(20, 72, 1)}${MIRA(128, 104)}<path d="M118 104 L100 104" stroke="#fde68a" stroke-width="2" stroke-dasharray="3 3"/>`) },
    { t: "4. Saem as cercárias", d: "O caramujo libera na água milhares de cercárias, larvas com cauda em forquilha.", s: CENA(`${AGUA}${CARA(10, 72, .9)}${CERC(100, 102)}${CERC(118, 118)}${CERC(96, 132)}${CERC(126, 140)}${CERC(80, 146)}`) },
    { t: "5. Entram pela pele", d: "Quem entra na água contaminada pode ser infectado: as cercárias atravessam a pele. Os vermes adultos vivem nas veias do intestino e do fígado.", s: CENA(`${AGUA}${E(80, 104, 70, "🦵")}${CERC(40, 126)}${CERC(118, 120)}${CERC(54, 144)}${CERC(110, 146)}`) },
    { t: "6. Como prevenir", d: "Saneamento básico (esgoto tratado), evitar banho em água doce com risco e tratar as pessoas doentes quebram o ciclo.", s: CENA(`${E(52, 76, 44, "🚰")}${E(110, 76, 44, "🏞️")}${E(52, 132, 40, "💊")}${E(110, 132, 40, "🚫")}`) }],
  ten: [
    { t: "1. Ovos no ambiente", d: "A pessoa com tênia no intestino elimina pedaços do verme (proglotes) cheios de ovos nas fezes. Sem saneamento, eles ficam no solo.", s: CENA(`${SOLO}<g transform="translate(16 40) scale(1.1)">${DISART.tenia.replace("<svg ", "<svg width=\"120\" height=\"80\" ")}</g>${OVOS([[40, 122], [70, 130], [96, 120], [124, 132], [58, 144]])}`) },
    { t: "2. O porco come os ovos", d: "O porco criado solto come os ovos junto com restos de fezes.", s: CENA(`${SOLO}${E(80, 100, 64, "🐖", "bob")}${OVOS([[40, 130], [120, 128], [100, 144]])}`) },
    { t: "3. Cisticercos na carne", d: "No porco, os ovos viram larvas chamadas cisticercos, que ficam na carne (a canjiquinha).", s: CENA(`${E(80, 110, 80, "🥩")}${[[66, 76], [92, 84], [74, 100], [100, 104], [84, 66]].map(c => `<circle cx="${c[0]}" cy="${c[1]}" r="5" fill="#f8fafc" stroke="#cbd5e1"/>`).join("")}`) },
    { t: "4. Teníase", d: "Quem come carne de porco (ou de boi) crua ou mal passada com cisticercos fica com a tênia adulta no intestino. Ela pode ter vários metros de comprimento.", s: CENA(`${INTEST}<path class="wig" d="M30 84 Q60 74 90 84 T140 84" stroke="#f0e2c4" stroke-width="5" fill="none" stroke-dasharray="6 2"/>${E(130, 40, 30, "🍖")}`) },
    { t: "5. Cisticercose", d: "Se a pessoa engole ovos da tênia do porco (água, verduras ou mãos sujas), os cisticercos se formam no corpo dela, às vezes até no cérebro. É uma doença grave.", s: CENA(`${E(80, 108, 80, "🧠")}${[[62, 72], [96, 78], [78, 92], [102, 100]].map(c => `<circle cx="${c[0]}" cy="${c[1]}" r="5" fill="#f8fafc" stroke="#94a3b8"/>`).join("")}${E(30, 150, 26, "🥬")}${E(130, 150, 26, "💧")}`) },
    { t: "6. Como prevenir", d: "Comer carne bem cozida e inspecionada, lavar as mãos e as verduras, beber água tratada e ter saneamento básico.", s: CENA(`${E(52, 76, 44, "🔥")}${E(110, 76, 44, "🧼")}${E(52, 132, 40, "🥬")}${E(110, 132, 40, "🚰")}`) }],
  lom: [
    { t: "1. Ovos no solo", d: "As fezes de uma pessoa com lombriga contaminam o solo com muitos ovos. Uma fêmea põe milhares de ovos por dia.", s: CENA(`${SOLO}${OVOS([[30, 120], [52, 128], [76, 118], [98, 132], [120, 122], [140, 136], [64, 146], [110, 148]])}${E(80, 76, 40, "☀️")}`) },
    { t: "2. Os ovos chegam à boca", d: "Os ovos chegam à boca por água não tratada, verduras mal lavadas ou mãos sujas.", s: CENA(`${E(44, 74, 40, "🥬")}${E(116, 74, 40, "💧")}${E(80, 136, 46, "✋")}${OVOS([[70, 100], [92, 104], [80, 116]])}`) },
    { t: "3. Larvas no intestino", d: "No intestino, os ovos liberam larvas, que atravessam a parede do intestino e entram no sangue.", s: CENA(`${INTEST}${LARVA(40, 84)}${LARVA(84, 60)}${LARVA(110, 108)}`) },
    { t: "4. Passagem pelos pulmões", d: "Pelo sangue, as larvas chegam aos pulmões. Depois sobem pela traqueia até a garganta e são engolidas de novo. Podem causar tosse.", s: CENA(`${E(80, 116, 84, "🫁")}${LARVA(56, 70)}${LARVA(92, 60)}${LARVA(76, 92)}<path d="M80 50 V22" stroke="#fde68a" stroke-width="2" stroke-dasharray="4 3"/>`) },
    { t: "5. Lombrigas adultas", d: "De volta ao intestino, as larvas viram lombrigas adultas, vermes cilíndricos (nematódeos) que podem medir mais de 20 cm.", s: CENA(`${INTEST}<path class="wig" d="M34 84 Q54 74 74 84 T114 84" stroke="#fde68a" stroke-width="6" fill="none" stroke-linecap="round"/><path class="wig" d="M40 108 Q64 98 88 108 T132 108" stroke="#fef3c7" stroke-width="6" fill="none" stroke-linecap="round"/>`) },
    { t: "6. Como prevenir", d: "Lavar as mãos antes de comer e depois de ir ao banheiro, lavar bem as verduras, beber água tratada e ter saneamento básico.", s: CENA(`${E(52, 76, 44, "🧼")}${E(110, 76, 44, "🥬")}${E(52, 132, 40, "🚰")}${E(110, 132, 40, "🚽")}`) }]
};
let cM = "esq", cI = 0, cT = null;
function cRender() {
  const L = CIC[cM], s = L[cI];
  $("#cstg").innerHTML = s.s; $("#cT").textContent = s.t; $("#cD").textContent = s.d;
  $("#cdots").innerHTML = L.map((x, i) => `<button class="dot ${i === cI ? "on" : ""}" data-i="${i}">${x.t.replace(/^\d+\.\s*/, "")}</button>`).join("");
  $$("#cdots .dot").forEach(b => b.onclick = () => { cStop(); cI = +b.dataset.i; cRender(); });
}
function cStop() { clearInterval(cT); cT = null; $("#cplay").textContent = "▶ Reproduzir"; }
$("#cplay").onclick = () => {
  if (cT) { cStop(); return; }
  cI = 0; cRender(); $("#cplay").textContent = "⏸ Pausar";
  cT = setInterval(() => { if (cI >= CIC[cM].length - 1) { cStop(); return; } cI++; cRender(); }, 3600);
};
$$("[data-c]").forEach(b => b.onclick = () => { cStop(); cM = b.dataset.c; cI = 0; $$("[data-c]").forEach(x => x.classList.toggle("on", x === b)); cRender(); });
cRender();
mini("#cic", "Desafio dos ciclos", MQ0["Desafio dos ciclos"]);

/* ---------- fontes ---------- */
function abrirFontes() {
  $("#opm").classList.remove("show");
  const grupos = [...new Set(FONTES_MAIS.map(f => f[0]))];
  openMd("📚 Fontes e referências", `<h3>Fontes usadas</h3><ul>${FONTES.map(f => `<li><b>${f[0]}:</b> ${f[1]}</li>`).join("")}</ul>
  <h3>Fontes confiáveis para consulta</h3>${grupos.map(g => `<h4>${g}</h4><ul>${FONTES_MAIS.filter(f => f[0] === g).map(f => `<li><b>${f[3] ? `<a href="${f[3]}" target="_blank" rel="noopener noreferrer">${f[1]}</a>` : f[1]}:</b> ${f[2]}</li>`).join("")}</ul>`).join("")}`);
}
$("#fo").onclick = abrirFontes;
