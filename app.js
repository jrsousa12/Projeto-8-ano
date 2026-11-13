"use strict";
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
let pmode="g";
const LSg=k=>{try{return localStorage.getItem(k);}catch(e){return null;}},LSs=(k,v)=>{try{localStorage.setItem(k,v);}catch(e){}};
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};

/* ---------- fundo de bolhas ---------- */
for(let i=0;i<26;i++){const b=document.createElement("div");b.className="bubble";const s=8+Math.random()*34;
 b.style.cssText=`width:${s}px;height:${s}px;left:${Math.random()*100}vw;--dx:${(Math.random()*80-40)}px;animation-duration:${12+Math.random()*18}s;animation-delay:${-Math.random()*20}s`;document.body.appendChild(b);}

/* ---------- ilustrações ---------- */
const star5=(cx,cy,R,r)=>{let p=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,k=i%2?r:R;p.push((cx+k*Math.cos(a)).toFixed(1)+","+(cy+k*Math.sin(a)).toFixed(1));}return p.join(" ");};
/* ilustrações (slides do 8º ano): no arquivo único elas vêm embutidas em IMGDATA */
const imgSrc=n=>(typeof IMGDATA!=="undefined"&&IMGDATA[n])||("img/animais/"+n+".webp");
const imgAni=(n,alt,cls)=>`<img class="ani${cls?" "+cls:""}" src="${imgSrc(n)}" alt="${alt||""}" draggable="false">`;
const ICON={
porifero:()=>`<svg viewBox="0 0 120 120"><path d="M6 108 Q60 98 114 108 L114 116 L6 116Z" fill="#475569"/><g class="bob">
<rect x="20" y="50" width="24" height="58" rx="12" fill="#fbbf24"/><ellipse cx="32" cy="52" rx="9" ry="4" fill="#b45309"/>
<rect x="48" y="30" width="28" height="78" rx="14" fill="#f59e0b"/><ellipse cx="62" cy="32" rx="11" ry="5" fill="#92400e"/>
<rect x="82" y="58" width="22" height="50" rx="11" fill="#fcd34d"/><ellipse cx="93" cy="60" rx="8.5" ry="3.5" fill="#b45309"/>
<g fill="#b45309" opacity=".55"><circle cx="32" cy="76" r="2.4"/><circle cx="30" cy="92" r="2.4"/><circle cx="62" cy="58" r="2.6"/><circle cx="60" cy="80" r="2.6"/><circle cx="64" cy="96" r="2.6"/><circle cx="93" cy="82" r="2.2"/><circle cx="92" cy="96" r="2.2"/></g></g>
<circle class="sb" style="--d:0s" cx="62" cy="24" r="3" fill="#fff"/><circle class="sb" style="--d:.9s" cx="34" cy="44" r="2.5" fill="#fff"/><circle class="sb" style="--d:1.7s" cx="93" cy="52" r="2.5" fill="#fff"/></svg>`,
cnidario:()=>`<svg viewBox="0 0 120 120"><g class="jelly">
<g fill="none" stroke="#f5d0fe" stroke-width="4" stroke-linecap="round">
<path class="tent" style="--d:0s" d="M38 64 q-7 12 0 24 t0 24"/><path class="tent" style="--d:.3s" d="M50 66 q-7 12 0 24 t0 24"/><path class="tent" style="--d:.6s" d="M62 66 q-7 12 0 24 t0 24"/><path class="tent" style="--d:.2s" d="M74 66 q-7 12 0 24 t0 24"/><path class="tent" style="--d:.5s" d="M86 64 q-7 12 0 24 t0 24"/></g>
<g class="pulse"><path d="M20 66 Q20 14 60 14 Q100 14 100 66 Q82 56 60 66 Q38 56 20 66Z" fill="#e879f9"/><path d="M34 42 Q60 22 86 42" stroke="#fff" stroke-width="4" fill="none" opacity=".55" stroke-linecap="round"/><circle cx="46" cy="52" r="3" fill="#fff" opacity=".6"/><circle cx="74" cy="50" r="3" fill="#fff" opacity=".6"/></g></g></svg>`,
platelminto:()=>`<svg viewBox="0 0 120 120"><g class="wig"><path d="M14 64 Q38 36 66 52 Q92 68 108 52 Q100 88 64 82 Q32 78 14 64Z" fill="#fdba74"/><path d="M30 62 Q56 50 80 64 Q96 70 102 58" stroke="#ea580c" stroke-width="4" fill="none" opacity=".55" stroke-linecap="round"/>
<circle cx="26" cy="58" r="6" fill="#fff"/><circle cx="29" cy="68" r="6" fill="#fff"/><circle cx="27.5" cy="59.5" r="2.6" fill="#111"/><circle cx="30.5" cy="67" r="2.6" fill="#111"/></g></svg>`,
nematodeo:()=>`<svg viewBox="0 0 120 120"><path d="M14 70 C34 40,54 100,74 70 S104 52,108 62" fill="none" stroke="#fde68a" stroke-width="11" stroke-linecap="round"><animate attributeName="d" dur="2.2s" repeatCount="indefinite" values="M14 70 C34 40,54 100,74 70 S104 52,108 62;M14 62 C34 92,54 44,74 76 S104 86,108 70;M14 70 C34 40,54 100,74 70 S104 52,108 62"/></path><circle cx="16" cy="68" r="2" fill="#92400e"/></svg>`,
molusco:()=>`<svg viewBox="0 0 120 120"><path d="M4 100 H116" stroke="#475569" stroke-width="6" stroke-linecap="round"/><g class="creep">
<path d="M14 98 Q10 78 28 78 L98 84 Q110 86 108 98Z" fill="#fcd34d"/><g stroke="#fcd34d" stroke-width="3" stroke-linecap="round"><path class="ant" d="M20 80 L16 62"/><path class="ant" style="animation-delay:.3s" d="M28 78 L30 60"/></g><circle cx="16" cy="61" r="3.2" fill="#fcd34d"/><circle cx="30" cy="59" r="3.2" fill="#fcd34d"/>
<circle cx="72" cy="58" r="30" fill="#fb7185"/><circle cx="72" cy="58" r="21" fill="none" stroke="#fff" stroke-width="3.5" opacity=".5"/><circle cx="72" cy="58" r="12" fill="none" stroke="#fff" stroke-width="3.5" opacity=".5"/><circle cx="72" cy="58" r="4" fill="#fff" opacity=".6"/>
<circle cx="22" cy="88" r="2" fill="#111"/></g></svg>`,
anelideo:()=>{let r="";for(let i=0;i<9;i++){r+=`<circle class="ring" style="--i:${i}" cx="${14+i*11.5}" cy="${68}" r="${i==0?10:9}" fill="${i%2?"#fb7185":"#fda4af"}"/>`;}return `<svg viewBox="0 0 120 120">${r}<circle cx="11" cy="65" r="1.8" fill="#111"/><rect x="40" y="58" width="20" height="20" rx="8" fill="#be123c" opacity=".35"/></svg>`;},
artropode:()=>`<svg viewBox="0 0 120 120"><g class="bob"><g stroke="#1e293b" stroke-width="3.2" stroke-linecap="round" fill="none">
<path class="leg" style="--d:0s" d="M56 66 L40 92"/><path class="leg" style="--d:.25s" d="M62 68 L62 98"/><path class="leg" style="--d:.1s" d="M68 66 L88 92"/>
<path d="M40 54 Q30 40 24 36"/><path d="M44 52 Q40 38 40 32"/></g>
<ellipse cx="90" cy="62" rx="20" ry="14" fill="#f97316"/><circle cx="62" cy="62" r="10" fill="#fb923c"/><circle cx="40" cy="58" r="11" fill="#f97316"/>
<circle cx="36" cy="55" r="3.4" fill="#fff"/><circle cx="35" cy="55" r="1.6" fill="#111"/><path d="M84 52 Q92 48 100 54" stroke="#fed7aa" stroke-width="3" fill="none" stroke-linecap="round"/></g></svg>`,
equinodermo:()=>{let d="";for(let i=0;i<5;i++){const a=-Math.PI/2+i*2*Math.PI/5;for(let k=1;k<=3;k++)d+=`<circle cx="${(60+k*13*Math.cos(a)).toFixed(1)}" cy="${(62+k*13*Math.sin(a)).toFixed(1)}" r="${3.2-k*.4}" fill="#fde68a"/>`;}
 return `<svg viewBox="0 0 120 120"><g class="spinslow"><polygon points="${star5(60,62,52,22)}" fill="#fb923c" stroke="#ea580c" stroke-width="3" stroke-linejoin="round"/>${d}<circle cx="60" cy="62" r="5" fill="#fde68a"/></g></svg>`;},
peixe:()=>`<svg viewBox="0 0 120 120"><g class="swim"><g class="tail"><polygon points="84,60 112,38 112,82" fill="#0284c7" stroke="#0284c7" stroke-width="4" stroke-linejoin="round"/></g>
<path d="M44 40 Q56 24 70 40Z" fill="#0ea5e9"/><ellipse cx="56" cy="60" rx="34" ry="23" fill="#38bdf8"/><path d="M52 40 Q64 60 52 80" stroke="#fbbf24" stroke-width="7" fill="none" opacity=".85"/><path d="M68 42 Q80 60 68 78" stroke="#fbbf24" stroke-width="7" fill="none" opacity=".85"/>
<path d="M36 50 Q31 60 36 70" stroke="#0369a1" stroke-width="3" fill="none"/><circle cx="34" cy="56" r="6.5" fill="#fff"/><circle cx="32.5" cy="56" r="3.2" fill="#111"/><path d="M24 66 Q29 70 34 67" stroke="#0369a1" stroke-width="3" fill="none" stroke-linecap="round"/></g>
<circle class="sb" style="--d:0s" cx="20" cy="46" r="3" fill="#fff"/><circle class="sb" style="--d:1.2s" cx="14" cy="56" r="2.2" fill="#fff"/></svg>`,
anfibio:()=>`<svg viewBox="0 0 120 120"><ellipse cx="60" cy="72" rx="40" ry="28" fill="#4ade80"/><ellipse cx="60" cy="82" rx="26" ry="16" fill="#bbf7d0"/>
<circle cx="38" cy="44" r="15" fill="#4ade80"/><circle cx="82" cy="44" r="15" fill="#4ade80"/><circle cx="38" cy="43" r="9.5" fill="#fff"/><circle cx="82" cy="43" r="9.5" fill="#fff"/>
<circle class="blink" cx="39" cy="44" r="5" fill="#111"/><circle class="blink" cx="81" cy="44" r="5" fill="#111"/>
<path d="M30 74 Q60 96 90 74" stroke="#166534" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse class="croak" cx="60" cy="86" rx="10" ry="6" fill="#fb7185" opacity=".85"/>
<circle cx="55" cy="60" r="2" fill="#166534"/><circle cx="65" cy="60" r="2" fill="#166534"/><circle cx="24" cy="66" r="5" fill="#f9a8d4" opacity=".6"/><circle cx="96" cy="66" r="5" fill="#f9a8d4" opacity=".6"/></svg>`,
reptil:()=>`<svg viewBox="0 0 120 120"><g class="bob"><polygon points="22,86 6,92 22,78" fill="#84cc16"/>
<rect x="34" y="82" width="16" height="18" rx="7" fill="#84cc16"/><rect x="76" y="82" width="16" height="18" rx="7" fill="#84cc16"/>
<g class="head"><circle cx="106" cy="68" r="11" fill="#84cc16"/><circle cx="110" cy="65" r="3.2" fill="#fff"/><circle cx="111" cy="65" r="1.5" fill="#111"/><path d="M104 74 Q109 77 113 73" stroke="#3f6212" stroke-width="2" fill="none" stroke-linecap="round"/></g>
<path d="M18 86 Q18 30 60 30 Q102 30 102 86Z" fill="#16a34a"/><path d="M60 30 V86 M38 40 Q34 62 36 86 M82 40 Q86 62 84 86 M20 62 H100" stroke="#bbf7d0" stroke-width="3" fill="none" opacity=".5"/><rect x="18" y="84" width="84" height="9" rx="4.5" fill="#a16207"/></g></svg>`,
ave:()=>`<svg viewBox="0 0 120 120"><g class="bob"><path d="M32 78 L6 100 L14 106 L42 88Z" fill="#ef4444"/><path d="M36 82 L14 108 L22 110 L46 90Z" fill="#fbbf24"/>
<ellipse cx="62" cy="70" rx="32" ry="26" fill="#3b82f6"/><ellipse cx="68" cy="78" rx="20" ry="16" fill="#fbbf24"/>
<g class="flap"><path d="M64 54 Q26 42 18 84 Q46 88 66 70Z" fill="#1d4ed8"/><path d="M60 58 Q36 54 28 78" stroke="#60a5fa" stroke-width="3" fill="none"/></g>
<circle cx="88" cy="44" r="17" fill="#fde047"/><path d="M98 38 Q116 42 106 58 Q100 52 98 46Z" fill="#1f2937"/><circle cx="90" cy="38" r="5.6" fill="#fff"/><circle cx="91.5" cy="38" r="2.6" fill="#111"/>
<path d="M56 96 V108 M72 96 V108" stroke="#92400e" stroke-width="3.5" stroke-linecap="round"/></g></svg>`,
mamifero:()=>`<svg viewBox="0 0 120 120"><g class="tilt"><circle cx="22" cy="62" r="13" fill="#92400e"/><circle cx="98" cy="62" r="13" fill="#92400e"/><circle cx="22" cy="62" r="7" fill="#fdba74"/><circle cx="98" cy="62" r="7" fill="#fdba74"/>
<circle cx="60" cy="62" r="36" fill="#92400e"/><path d="M52 28 Q60 14 68 28" stroke="#92400e" stroke-width="7" fill="none" stroke-linecap="round"/>
<ellipse cx="60" cy="72" rx="26" ry="23" fill="#fdba74"/><path d="M60 48 Q42 50 38 66 Q50 54 60 62 Q70 54 82 66 Q78 50 60 48Z" fill="#fdba74"/>
<ellipse class="blink" cx="48" cy="62" rx="4.6" ry="5.4" fill="#1f2937"/><ellipse class="blink" cx="72" cy="62" rx="4.6" ry="5.4" fill="#1f2937"/><circle cx="46.5" cy="60" r="1.5" fill="#fff"/><circle cx="70.5" cy="60" r="1.5" fill="#fff"/>
<ellipse cx="55" cy="76" rx="2" ry="2.6" fill="#92400e"/><ellipse cx="65" cy="76" rx="2" ry="2.6" fill="#92400e"/><path d="M46 85 Q60 96 74 85" stroke="#7c2d12" stroke-width="3.4" fill="none" stroke-linecap="round"/></g></svg>`
};
const ICONSVG=Object.assign({},ICON);
G.forEach(g=>{ICON[g.id]=()=>imgAni("g-"+g.id,g.n);});

/* ---------- conteúdo ---------- */

/* ---------- árvore ---------- */

/* ---------- +4 perguntas por grupo (total 5) ; 1ª opção = correta, embaralhadas ao exibir ---------- */

G.forEach(g=>{g.qs=[g.q,...EXTRA[g.id].map(x=>({q:x[0],o:x[1],a:0,w:x[2]}))];});

G.forEach(g=>{g.pool=[...g.qs,...EXTRA2[g.id].map(x=>({q:x[0],o:x[1],a:0,w:x[2]}))];});

G.forEach(g=>{g.pool=[...g.pool,...BANK3[g.id],...(BANK4[g.id]||[])].map(x=>Array.isArray(x)?{q:x[0],o:x[1],a:0,w:x[2]}:x);});
/* perguntas do professor (banco-proprio.js, gerado pelo editor): acrescenta as novas e tira as ocultadas */
(function(){if(typeof PROPRIO==="undefined"||!PROPRIO)return;
 const oc=new Set(Array.isArray(PROPRIO.ocultas)?PROPRIO.ocultas:[]);
 const tira=(arr,f)=>{for(let i=arr.length-1;i>=0;i--)if(oc.has(f(arr[i])))arr.splice(i,1);};
 if(oc.size){G.forEach(g=>tira(g.pool,x=>idPerg(x.q,x.o)));tira(QZ,x=>idPerg(x[0],x[1]));
  [MQ0,MQX].forEach(M=>Object.keys(M).forEach(t=>tira(M[t],x=>idPerg(x[0],x[1]))));}
 const limpa=t=>String(t).replace(/</g,"‹").replace(/>/g,"›");
 (Array.isArray(PROPRIO.perguntas)?PROPRIO.perguntas:[]).forEach(x=>{
  if(!x||typeof x.q!=="string"||!Array.isArray(x.o)||x.o.length<2)return;
  x={g:x.g,q:limpa(x.q),o:x.o.map(limpa),w:limpa(x.w||"")};const w=x.w;
  const g=G.find(y=>y.id===x.g);
  if(g)g.pool.push({q:x.q,o:x.o,a:0,w});
  else if(x.g==="final")QZ.push([x.q,x.o,0,w]);
  else if(MQ0[x.g])(MQX[x.g]||(MQX[x.g]=[])).push([x.q,x.o,w]);});})();

const stars=new Set(), seen=new Set();
G.forEach((g,i)=>{const b=document.createElement("button");b.className="card";b.id="card-"+g.id;b.style.cssText=`--c:${g.c};--i:${G.filter(x=>x.t===g.t).indexOf(g)}`;
 b.innerHTML=ICON[g.id]()+`<b>${g.n}</b>`;b.onclick=()=>openPanel(i);$("#c-"+g.t).appendChild(b);});
$$(".bbtn").forEach(btn=>btn.onclick=()=>{const br=btn.parentElement;br.classList.toggle("open");
 if(br.classList.contains("open")){$$(".card",br).forEach(c=>{c.style.animation="none";void c.offsetWidth;c.style.animation=""});}});
function updScore(){if(typeof NV!=="undefined")NV.atualiza();
 G.forEach(g=>{const c=$("#card-"+g.id);c.classList.toggle("star",stars.has(g.id));c.classList.toggle("seen",seen.has(g.id)&&!stars.has(g.id));});}

/* ---------- progresso salvo neste aparelho (com assinatura) ---------- */
const SALT="an8-prof-ivaldo-2026";

const PK="an8v2",esc=t=>String(t).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const PROF={cur:"",p:Object.create(null)};
const nomeOk=n=>typeof n==="string"&&n.length>0&&n.length<=20&&!/^(__proto__|constructor|prototype)$/i.test(n);let whoMode="",whoAnon=false;
const sigOf=(n,ids)=>hsh(n+"|"+ids+SALT);
function writeAll(){try{localStorage.setItem(PK,JSON.stringify(PROF));}catch(e){}}
function readAll(){try{const d=JSON.parse(localStorage.getItem(PK)||"null");
 if(d&&d.p&&typeof d.p==="object"){Object.keys(d.p).slice(0,30).forEach(n=>{const r=d.p[n];if(nomeOk(n)&&r&&typeof r.s==="string"&&r.k===sigOf(n,r.s))PROF.p[n]={s:r.s,k:r.k};});
  if(nomeOk(d.cur)&&PROF.p[d.cur])PROF.cur=d.cur;}
 else{const o=JSON.parse(localStorage.getItem("an8v1")||"null");
  if(o&&typeof o.s==="string"&&o.k===hsh(o.s+SALT)&&o.s){PROF.p["Aluno"]={s:o.s,k:sigOf("Aluno",o.s)};PROF.cur="Aluno";writeAll();}}}catch(e){}}
const profIds=n=>{const r=PROF.p[n];return r?(r.s?r.s.split(",").filter(id=>G.some(g=>g.id===id)):[]):[];};
function saveProg(){if(!PROF.cur)return;const ids=[...stars].sort().join(",");PROF.p[PROF.cur]={s:ids,k:sigOf(PROF.cur,ids)};writeAll();}
function loadProfile(){stars.clear();seen.clear();if(PROF.cur)profIds(PROF.cur).forEach(id=>{stars.add(id);seen.add(id);});
 if(typeof PG!=="undefined"){PG.carregar();if(typeof NV!=="undefined")NV.recomeca();qState.started=false;if($("#quiz").classList.contains("on"))startQuiz();}}
function switchTo(n){PROF.cur=n;if(!PROF.p[n])PROF.p[n]={s:"",k:sigOf(n,"")};whoMode="";whoAnon=false;writeAll();loadProfile();updScore();renderWho();}
function clearProg(){stars.clear();seen.clear();saveProg();updScore();renderWho();}
function renderWho(){const w=$("#who");if(!w)return;const names=Object.keys(PROF.p),cur=PROF.cur;
 if(cur&&whoMode!=="pick"){w.innerHTML=`<span>👤 <b>${esc(cur)}</b> · ⭐ ${stars.size}/13</span><button class="btn" id="wsw">Trocar aluno</button>`;$("#wsw").onclick=()=>{whoMode="pick";renderWho();};return;}
 if(!cur&&whoAnon&&whoMode!=="pick"){w.innerHTML=`<span>👤 Sem nome · as estrelas <b>não</b> serão salvas</span><button class="btn" id="wsw">Escolher aluno</button>`;$("#wsw").onclick=()=>{whoMode="pick";renderWho();};return;}
 w.innerHTML=`<div class="wtt">${cur?"Trocar de aluno":"👤 Quem vai jogar?"}</div>${names.length?`<div class="wlist">${names.map(n=>`<button class="btn wb" data-n="${esc(n)}">${esc(n)} <small>⭐ ${profIds(n).length}</small></button>`).join("")}</div>`:""}<div class="wnew"><input id="wn" maxlength="20" placeholder="Digite um nome novo" autocomplete="off"><button class="btn pri" id="wok">Começar</button></div><div class="wex">${cur?`<button class="btn" id="wcn">Voltar</button> <button class="btn" id="wdel">🗑️ Apagar o perfil de ${esc(cur)}</button>`:`<button class="btn" id="wan">Jogar sem salvar</button>`}</div><p class="wnote" id="wmsg">💾 As estrelas ficam salvas só neste aparelho.</p>`;
 $$(".wb",w).forEach(b=>b.onclick=()=>switchTo(b.dataset.n));
 const ok=()=>{const n=$("#wn").value.replace(/\s+/g," ").trim();if(!n){$("#wmsg").textContent="Escreva um nome para começar.";return;}
  if(!nomeOk(n)){$("#wmsg").textContent="Escolha outro nome.";return;}
  const ex=Object.keys(PROF.p).find(x=>x.toLowerCase()===n.toLowerCase());if(ex){switchTo(ex);return;}
  if(names.length>=30){$("#wmsg").textContent="Limite de 30 alunos neste aparelho. Apague algum perfil.";return;}switchTo(n);};
 $("#wok").onclick=ok;$("#wn").onkeydown=e=>{if(e.key==="Enter")ok();};
 if($("#wcn"))$("#wcn").onclick=()=>{whoMode="";renderWho();};
 if($("#wan"))$("#wan").onclick=()=>{whoAnon=true;whoMode="";renderWho();};
 if($("#wdel")){let t=0;$("#wdel").onclick=function(){if(!t){this.textContent="⚠️ Toque de novo para apagar";t=setTimeout(()=>{t=0;if(this.isConnected)this.textContent="🗑️ Apagar o perfil de "+cur;},4000);}
  else{clearTimeout(t);PG.apagar(cur);delete PROF.p[cur];PROF.cur="";whoMode="";whoAnon=false;writeAll();loadProfile();updScore();renderWho();}};}}

/* ---------- painel do animal ---------- */
let cur=0;
function openPanel(i){pmode="g";cur=i;const g=G[i];seen.add(g.id);if(typeof NV!=="undefined")NV.marcar("estudar:"+g.id);updScore();
 const p=$("#panel");p.style.setProperty("--c",g.c);
 let sp="";for(let k=0;k<9;k++)sp+=`<i class="spark" style="left:${8+Math.random()*84}%;top:${8+Math.random()*84}%;animation-delay:${Math.random()*3}s"></i>`;
 p.innerHTML=`<button class="x" aria-label="Fechar">✕</button><div class="pgrid">
 <div class="hero">${sp}${imgAni("p-"+g.id,"Ilustração: "+g.n,"heroimg")}<h2>${g.n}</h2><span class="tag">${g.tag}</span><p style="opacity:.9">${g.sub}</p></div>
 <div class="info"><h3>Como são</h3><ul>${g.f.map(x=>`<li>${x}</li>`).join("")}</ul>
 <h3>Como se reproduzem</h3><p>${g.r}</p><h3>Papel na natureza</h3><p>${g.p}</p>
 <h3>Exemplos</h3><div class="chips">${g.e.map((x,k)=>`<span class="chip" style="--i:${Math.min(k,7)}">${x}</span>`).join("")}</div>
 <div class="know">💡 <b>Você sabia?</b> ${g.k}</div>
 <div class="chal" id="chal"></div></div></div>
 <div class="pnav"><button class="btn" id="pv">◀ Anterior</button><button class="btn pri" id="nx">Próximo ▶</button></div>`;
 runChal(g,p);
 $(".x",p).onclick=closePanel;$("#pv",p).onclick=()=>openPanel((cur+G.length-1)%G.length);$("#nx",p).onclick=()=>openPanel((cur+1)%G.length);
 if(!$("#ov").classList.contains("show"))pushLayer(hidePanel);$("#ov").classList.add("show");document.body.style.overflow="hidden";p.scrollTop=0;$(".x",p).focus();}

/* ---------- dica (tira 2 alternativas erradas) ---------- */
let HF=false;const fmt=n=>String(n).replace(".",",");
function mkHint(od,okBtn,isDone,used){HF=false;const h=document.createElement("button");h.className="btn hint";h.type="button";h.textContent="💡 Dica: tira 2 erradas (vale meio ponto)";
 h.onclick=ev=>{if(!ev||!ev.isTrusted||isDone()||h.disabled)return;h.disabled=true;HF=true;used();
  shuffle($$(".opt",od).filter(x=>x!==okBtn&&!x.disabled)).slice(0,2).forEach(x=>{x.disabled=true;x.classList.add("gone");});};
 const w=document.createElement("div");w.className="hintrow";w.appendChild(h);return w;}
const hintLine=n=>n?`<p class="hintn">💡 Dicas usadas: <b>${n}</b></p>`:"";
/* ---------- desafio: sorteia 5 do banco ---------- */
const PASS=3;let soundOn=false;
let AC=null;
/* vibração (celular) e tema: preferências do aparelho */
let vibOn=LSg("an8vib")!=="no";
function vibrar(kind){if(!vibOn||!navigator.vibrate)return;try{navigator.vibrate(kind==="ok"||kind===true?40:kind==="no"||kind===false?[70,50,70]:[30,40,30,40,120]);}catch(e){}}
const TEMAS=[["escuro","🌙 Tema: escuro"],["claro","☀️ Tema: claro"],["auto","🌓 Tema: automático"]];
let tema=LSg("an8tema")||"escuro";if(!TEMAS.some(t=>t[0]===tema))tema="escuro";
function aplicaTema(){const claro=tema==="claro"||(tema==="auto"&&matchMedia("(prefers-color-scheme: light)").matches);
 if(claro)document.documentElement.dataset.theme="claro";else delete document.documentElement.dataset.theme;
 const b=$("#tm");if(b)b.textContent=TEMAS.find(t=>t[0]===tema)[1];}
try{matchMedia("(prefers-color-scheme: light)").addEventListener("change",aplicaTema);}catch(e){}
/* compartilhar um resultado: menu do celular (WhatsApp etc.) ou copia o texto */
async function compartilhar(txt,btn){
 if(navigator.share){try{await navigator.share({text:txt});return;}catch(e){if(e&&e.name==="AbortError")return;}}
 let ok=false;try{await navigator.clipboard.writeText(txt);ok=true;}catch(e){}
 if(btn){const t=btn.textContent;btn.textContent=ok?"✅ Texto copiado":"📋 "+txt;setTimeout(()=>{if(btn.isConnected)btn.textContent=t;},ok?2500:6000);}}
function beep(kind){vibrar(kind);if(!soundOn)return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const seq=kind==="ok"?[[660,0],[880,.12]]:kind==="no"?[[200,0]]:[[660,0],[880,.12],[1100,.24]];
 seq.forEach(([f,t])=>{const o=AC.createOscillator(),g=AC.createGain();o.frequency.value=f;o.type="sine";g.gain.value=.08;o.connect(g);g.connect(AC.destination);o.start(AC.currentTime+t);o.stop(AC.currentTime+t+.18);});}catch(e){}}
function runChal(g,p){
 const box=$("#chal",p);let qi=0,hits=0,tm=null,missed=[],hints=0,review=false;let qs=shuffle(g.pool.slice()).slice(0,5);
 const dots=()=>qs.map((_,k)=>`<i class="${k<qi?"d":k===qi?"c":""}"></i>`).join("");
 function finish(Q,right,why){
  if(!right)missed.push(Q);clearInterval(tm);if(!review)PG.registrar(Q.q,Q.o,right);$$(".opt",box).forEach(x=>x.disabled=true);
  $("#why",box).innerHTML=why+" "+Q.w;
  const last=qi===qs.length-1;
  $("#cnx",box).innerHTML=`<button class="btn pri" id="cn">${last?"Ver resultado":"Próxima pergunta ▶"}</button>`;
  $("#cn",box).onclick=()=>{qi++;last?end():show();};$("#cn",box).focus();}
 function show(){
  const Q=qs[qi];let okBtn=null,answered=false;
  box.innerHTML=`<div class="cprog"><span>🎯 Pergunta ${qi+1} de ${qs.length}</span><span class="dots">${dots()}</span></div><p>${Q.q}</p><div id="opts"></div><div class="why" id="why"></div><div id="cnx"></div>`;
  const od=$("#opts",box);
  shuffle(Q.o.map((t,k)=>({t,ok:k===Q.a}))).forEach(o=>{const b=document.createElement("button");b.className="opt";b.textContent=o.t;if(o.ok)okBtn=b;
   b.onclick=ev=>{
    if(!ev||!ev.isTrusted||answered)return;answered=true;
    if(o.ok){hits+=HF?.5:1;b.classList.add("ok");beep("ok");finish(Q,true,"🎉 <b>Isso mesmo!</b>");}
    else{b.classList.add("no");okBtn.classList.add("ok");beep("no");finish(Q,false,"🤔 Quase!");}};
   od.appendChild(b);});
  od.after(mkHint(od,okBtn,()=>answered,()=>{hints++;}));
 }
 function end(){
  clearInterval(tm);const ok=!review&&hits>=PASS;
  const msg=review?"🔎 Revisão concluída! Você treinou de novo os pontos que errou. A estrela vem das perguntas sorteadas.":(ok?"⭐ Muito bem! Você ganhou a estrela de "+g.n+".":"Para ganhar a estrela são necessários "+PASS+" acertos. Leia de novo o painel e tente outra vez!");
  box.innerHTML=`<div class="cprog"><span>🏁 Resultado</span><span class="dots">${qs.map(()=>"<i class='d'></i>").join("")}</span></div><p>Você acertou ${fmt(hits)} de ${qs.length}.</p>${hintLine(hints)}<div class="why">${msg}</div><div id="cnx">${missed.length?`<button class="btn" id="rv">🔎 Rever só os que errei</button> `:""}<button class="btn pri" id="cn">🔄 Jogar de novo (novas perguntas)</button></div>`;
  $("#cn",box).onclick=()=>{qi=0;hits=0;hints=0;review=false;missed=[];qs=shuffle(g.pool.slice()).slice(0,5);show();};
  if(missed.length)$("#rv",box).onclick=()=>{qs=shuffle(missed.slice());missed=[];qi=0;hits=0;review=true;show();};
  if(ok&&!stars.has(g.id)){stars.add(g.id);saveProg();updScore();burst(50);beep("star");if(stars.size===13){setTimeout(()=>{burst(260);},500);}}
 }
 show();
}
/* ---------- janelas: resumo e gabarito (funcionam offline, imprimíveis) ---------- */
function openMd(title,html){
 let m=$("#md");const had=!!m;if(m)m.remove();
 m=document.createElement("div");m.id="md";m.setAttribute("role","dialog");m.setAttribute("aria-label",title);
 m.innerHTML=`<div class="mdbox"><div class="mdbar"><h2>${title}</h2><span><button class="btn pri" id="mdp">🖨️ Imprimir</button> <button class="btn" id="mdx">✕ Fechar</button></span></div><div class="mdbody">${html}</div></div>`;
 document.body.appendChild(m);
 if(!had)pushLayer(()=>{const x=$("#md");if(x)x.remove();});
 $("#mdx").onclick=goBack;
 $("#mdp").onclick=()=>{document.body.classList.add("printing");window.print();setTimeout(()=>document.body.classList.remove("printing"),500);};
 $("#mdx").focus();}
function hidePanel(){$("#ov").classList.remove("show");document.body.style.overflow="";}
function closePanel(){if($("#ov").classList.contains("show"))goBack();}
$("#ov").addEventListener("click",e=>{if(e.target.id==="ov")closePanel();});
document.addEventListener("keydown",e=>{if(!$("#ov").classList.contains("show"))return;
 if(e.key==="Escape")closePanel();if(pmode==="g"){if(e.key==="ArrowRight")openPanel((cur+1)%G.length);if(e.key==="ArrowLeft")openPanel((cur+G.length-1)%G.length);}else{if(e.key==="ArrowRight")openDet(LD,(curD+1)%LD.length);if(e.key==="ArrowLeft")openDet(LD,(curD+LD.length-1)%LD.length);}});

/* ---------- voltar: botão e gesto (modal → painel → aba → início) ---------- */
const LAY=[];let TABL=false;
function updBack(){const b=$("#bk");if(b)b.hidden=LAY.length===0;}
function pushLayer(fn){LAY.push(fn);try{history.pushState({l:LAY.length},"");}catch(e){}updBack();}
function goBack(){if(!LAY.length)return;try{history.back();}catch(e){const f=LAY.pop();f();updBack();}}
window.addEventListener("popstate",e=>{const l=(e.state&&typeof e.state.l==="number")?e.state.l:0;while(LAY.length>l){const f=LAY.pop();f();}updBack();});
try{history.replaceState({l:0},"");}catch(e){}
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&$("#md"))goBack();});
/* ---------- abas ---------- */
/* cada tela pertence a uma seção do menu */
const HUB={home:"home",trilhas:"trilhas",estudar:"estudar",jogar:"jogar",prog:"prog",tree:"estudar",fic:"estudar",temp:"estudar",meta:"estudar",pa:"estudar",dis:"estudar",cic:"estudar",nat:"estudar",prat:"estudar",quiz:"jogar",cls:"jogar",img:"jogar"};
const HUBN={trilhas:"🧭 Trilhas",estudar:"📚 Estudar",jogar:"🎮 Jogar",prog:"📊 Progresso"};
let abaAtual="home";
function trilho(t){const el=$("#trilho");if(!el)return;const h=HUB[t]||"home";
 if(t===h||h==="home"){el.hidden=true;return;}
 const ht=$('#'+h+' .ht[data-t="'+t+'"] b');el.hidden=false;
 el.innerHTML=`<button class="trl" data-h="${h}">${HUBN[h]}</button> <span>›</span> <b>${ht?ht.textContent:t}</b>`;
 $(".trl",el).onclick=()=>irPara(h);}
function showTab(t){abaAtual=t;$$("#tabs button").forEach(x=>x.classList.toggle("on",x.dataset.t===(HUB[t]||t)));trilho(t);if(typeof NV!=="undefined")NV.aba(t);
 $$("main section").forEach(x=>x.classList.toggle("on",x.id===t));
 if(t==="quiz"&&!qState.started)startQuiz();if(t==="prog")prRender();if(t==="cls"&&!cS.started)startCls();if(t==="img"&&!iS.started)startImg();if(t==="fic"&&!$("#fbox").children.length)renderFic();
 window.scrollTo(0,0);const on=$("#tabs button.on");if(on)on.scrollIntoView({inline:"center",block:"nearest"});}
/* Voltar: de uma tela volta para a seção dela; da seção volta para o Início */
let SUBL=false,depois=null,hubIdx=0;
function irPara(t){const h=HUB[t]||"home";
 if(t==="home"){if(TABL){const k=LAY.length-hubIdx;if(k>0){try{history.go(-k);}catch(e){while(LAY.length>hubIdx)LAY.pop()();updBack();}}}else showTab("home");return;}
 if(!TABL){TABL=true;hubIdx=LAY.length;pushLayer(()=>{TABL=false;SUBL=false;showTab("home");});}
 if(t===h){if(SUBL){depois=t;goBack();}else showTab(t);return;}
 if(!SUBL){SUBL=true;const origem=(abaAtual!=="home"&&abaAtual===HUB[abaAtual])?abaAtual:h;pushLayer(()=>{SUBL=false;const d=depois;depois=null;showTab(d||origem);});}
 showTab(t);}
$$("#tabs button").forEach(b=>b.onclick=()=>{if(b.dataset.t==="prog"&&typeof prPausa==="function")prPausa();irPara(b.dataset.t);});
$("#bk").onclick=goBack;

/* ---------- desafio final ---------- */

/* ---------- fauna do Pará ---------- */

/* ---------- mini desafios por aba (1ª opção = correta) ---------- */
const MINI={};

function mini(sel,title,Q0){
 const bank=[...Q0,...(MQX[title]||[])];MINI[title]=bank;
 const box=document.createElement("div");box.className="mini";$(sel+" .box").appendChild(box);
 let qs,qi,hits,missed=[],hints=0,rv=false;
 function start(){qs=shuffle(bank).slice(0,5);qi=0;hits=0;missed=[];hints=0;rv=false;show();}
 function show(){
  const q=qs[qi];
  box.innerHTML=`<h3>🎯 ${title}</h3><div class="cprog"><span>Pergunta ${qi+1} de ${qs.length}</span><span class="dots">${qs.map((_,k)=>`<i class="${k<qi?"d":k===qi?"c":""}"></i>`).join("")}</span></div><p class="mqq">${q[0]}</p><div class="mo"></div><div class="why"></div><div class="mnx"></div>`;
  const od=$(".mo",box),w=$(".why",box),nx=$(".mnx",box);let okB=null,done=false;
  shuffle(q[1].map((t,k)=>({t,ok:k===0}))).forEach(o=>{const b=document.createElement("button");b.className="opt";b.textContent=o.t;if(o.ok)okB=b;
   b.onclick=ev=>{if(!ev||!ev.isTrusted||done)return;done=true;$$(".opt",od).forEach(x=>x.disabled=true);
    if(!rv)PG.registrar(q[0],q[1],o.ok);
    if(o.ok){hits+=HF?.5:1;b.classList.add("ok");beep("ok");}else{b.classList.add("no");okB.classList.add("ok");beep("no");missed.push(q);}
    w.innerHTML=(o.ok?"🎉 <b>Isso mesmo!</b> ":"🤔 Quase! ")+q[2];
    const last=qi===qs.length-1;nx.innerHTML=`<button class="btn pri" id="mnb">${last?"Ver resultado":"Próxima pergunta ▶"}</button>`;
    $("#mnb",nx).onclick=()=>{qi++;last?end():show();};$("#mnb",nx).focus();};
   od.appendChild(b);});
  od.after(mkHint(od,okB,()=>done,()=>{hints++;}));}
 function end(){
  box.innerHTML=`<h3>🎯 ${title}</h3><p class="mres">🏁 Você acertou <b>${fmt(hits)}</b> de ${qs.length}.</p>${hintLine(hints)}${missed.length?`<button class="btn" id="mrv">🔎 Rever só os que errei</button> `:""}<button class="btn pri" id="mrs">🔁 Jogar de novo (outras perguntas)</button>`;
  if(missed.length)$("#mrv",box).onclick=()=>{qs=shuffle(missed.slice());missed=[];qi=0;hits=0;rv=true;show();};
  if(hits===qs.length){burst(60);beep("star");}
  if(!rv&&hits>=3&&typeof NV!=="undefined")NV.marcar("mini:"+title);
  $("#mrs",box).onclick=start;}
 start();}
mini("#temp","Desafio da temperatura",MQ0["Desafio da temperatura"]);
mini("#meta","Desafio da metamorfose",MQ0["Desafio da metamorfose"]);
mini("#pa","Desafio da fauna do Pará",MQ0["Desafio da fauna do Pará"]);

/* ---------- doenças e prevenção ---------- */

const DIC=["#38bdf8","#f59e0b","#fb7185","#facc15","#a78bfa"],DIK=["caramujo","tenia","lombriga","amarelao","mosquito"];
const DISL=DIS.map((d,i)=>({c:DIC[i],svg:DISART[DIK[i]],name:d[0],tag:d[2],sub:d[1],
 html:`<h3>Parasita</h3><p><i>${d[1]}</i> • ${d[2]}</p><h3>Como se pega</h3><p>${d[3]}</p><h3>Como prevenir</h3><p>${d[4]}</p>${d[5]?`<div class="know">💡 ${d[5]}</div>`:""}<div class="warnb">⚕️ Com sintomas, procure uma Unidade de Saúde. Remédio só com orientação profissional.</div>`}));
cardsFor("#disg",DISL);
mini("#dis","Desafio das verminoses",MQ0["Desafio das verminoses"]);

/* ---------- atividades práticas ---------- */
const PRIC=["#34d399","#a78bfa","#fbbf24","#38bdf8"],PREM=["🔎","🦋","🥤","🧽"];

/* ---------- painel genérico (igual ao dos grupos) ---------- */
let LD=[],curD=0;
function openDet(L,i){pmode="d";LD=L;curD=i;const x=L[i];if(x.aid&&typeof NV!=="undefined")NV.marcar(x.aid);const p=$("#panel");p.style.setProperty("--c",x.c);
 let sp="";for(let k=0;k<9;k++)sp+=`<i class="spark" style="left:${8+Math.random()*84}%;top:${8+Math.random()*84}%;animation-delay:${Math.random()*3}s"></i>`;
 p.innerHTML=`<button class="x" aria-label="Fechar">✕</button><div class="pgrid"><div class="hero">${sp}${x.svg}<h2>${x.name}</h2><span class="tag">${x.tag}</span><p style="opacity:.9">${x.sub||""}</p></div><div class="info">${x.html}</div></div>
 <div class="pnav"><button class="btn" id="pv">◀ Anterior</button><button class="btn pri" id="nx">Próximo ▶</button></div>`;
 $(".x",p).onclick=closePanel;$("#pv",p).onclick=()=>openDet(L,(i+L.length-1)%L.length);$("#nx",p).onclick=()=>openDet(L,(i+1)%L.length);
 if(x.after)x.after(p);
 if(!$("#ov").classList.contains("show"))pushLayer(hidePanel);$("#ov").classList.add("show");document.body.style.overflow="hidden";p.scrollTop=0;$(".x",p).focus();}
function cardsFor(sel,L,cls){const el=$(sel);el.innerHTML=L.map((x,k)=>`<button class="card ${cls||""}" style="--c:${x.c}" data-i="${k}">${x.svg}<b>${x.name}</b></button>`).join("");
 $$(".card",el).forEach(b=>b.onclick=()=>openDet(L,+b.dataset.i));}

/* ---------- fauna do Pará ---------- */
const PAK=["boto","peixeboi","pirarucu","jacare","tracaja","caranguejo","harpia","sapo","tartaruga","guara","onca","ariranha"];
const PAC=["#f472b6","#94a3b8","#a3b18a","#65a30d","#84cc16","#6366f1","#64748b","#b08968","#a16207","#ef4444","#f59e0b","#a16207"];
/* animais da fauna do Pará que já têm ilustração; os outros usam o desenho do app */
const PAIMG={"boto":"a-boto","peixeboi":"a-peixe-boi","pirarucu":"a-pirarucu","jacare":"a-jacare-acu","tracaja":"a-tracaja","caranguejo":"a-caranguejo-uca","harpia":"a-harpia","sapo":"a-sapo-cururu","tartaruga":"a-tartaruga-amazonia","guara":"a-guara","onca":"a-onca","ariranha":"a-ariranha"};
const paArt=i=>PAIMG[PAK[i]]?imgAni(PAIMG[PAK[i]],"Ilustração: "+PA[i][0]):ART[PAK[i]]();
const PAL=PA.map((a,i)=>({c:PAC[i],svg:paArt(i),name:a[0],tag:"Fauna da Amazônia",sub:a[1],
 html:`<h3>Sobre ele</h3><p>${a[3]}</p><h3>Nome científico</h3><p><i>${a[1]}</i></p><h3>Qual é o grupo dele?</h3><div id="rv"><button class="btn pri" id="rvb">👀 Revelar o grupo</button></div>`,
 after:p=>{$("#rvb",p).onclick=()=>{$("#rv",p).innerHTML=`<div class="know">✅ <b>${NG[a[2]]}</b></div>`;};}}));
cardsFor("#pag",PAL,"pc");

function prHtml(a){return `<h3>Objetivo</h3><p>${a.o}</p><h3>Materiais</h3><p>${a.m}</p><h3>Passo a passo</h3><ol>${a.p.map(x=>`<li>${x}</li>`).join("")}</ol><h3>Para pensar</h3><p>${a.q}</p><div class="warnb">⚠️ ${a.c}</div>`;}
const PRL=PR.map((a,i)=>({c:PRIC[i],svg:emo(PREM[i]),name:a.t.replace(/^\d\.\s*/,""),tag:"Atividade individual",sub:a.o,html:prHtml(a)}));
cardsFor("#pratg",PRL);

/* ---------- modo projeção ---------- */

/* ---------- tela cheia ---------- */
$("#fs").onclick=()=>{try{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();}catch(e){}};
readAll();loadProfile();updScore();renderWho();

/* ---------- ficha da aula ---------- */
function renderFic(){const box=$("#fbox");
 const card=(g,i)=>`<button class="fcard" data-i="${i}" style="--c:${g.c}"><div class="fh">${ICON[g.id]()}<div><b>${g.n}</b><small>${g.tag}</small></div></div><ul>${g.f.slice(0,3).map(x=>`<li>${x}</li>`).join("")}</ul><p class="fe"><b>Exemplos:</b> ${g.e.slice(0,5).join(", ")}</p><p class="fk">💡 ${g.k}</p></button>`;
 box.innerHTML=`<h2>📄 Ficha da aula</h2><p class="sub">Resumo dos 13 grupos. Toque em um cartão para abrir o painel completo.</p><div class="ffil"><button class="btn on" data-f="all">Todos</button><button class="btn" data-f="inv">Invertebrados</button><button class="btn" data-f="ver">Vertebrados</button></div><div class="fgrid">${G.map(card).join("")}</div>`;
 $$(".fcard",box).forEach(b=>b.onclick=()=>openPanel(+b.dataset.i));
 $$(".ffil .btn",box).forEach(b=>b.onclick=()=>{$$(".ffil .btn",box).forEach(x=>x.classList.toggle("on",x===b));const f=b.dataset.f;
  $$(".fcard",box).forEach(c=>{const g=G[+c.dataset.i];c.style.display=(f==="all"||(f==="inv"&&g.t==="inv")||(f==="ver"&&g.t!=="inv"))?"":"none";});});}
let zpT=0;$("#zp").onclick=function(ev){if(!ev||!ev.isTrusted)return;const b=this;
 if(!zpT){b.textContent="⚠️ Toque de novo para apagar";zpT=setTimeout(()=>{zpT=0;b.textContent="🗑️ Zerar estrelas do aluno";},4000);}
 else{clearTimeout(zpT);zpT=0;b.textContent="🗑️ Zerar estrelas do aluno";clearProg();$("#opm").classList.remove("show");}};
$("#vb").onclick=function(){vibOn=!vibOn;LSs("an8vib",vibOn?"yes":"no");this.textContent="📳 Vibração: "+(vibOn?"sim":"não");this.setAttribute("aria-pressed",vibOn);if(vibOn)vibrar("ok");};
{const b=$("#vb");b.textContent="📳 Vibração: "+(vibOn?"sim":"não");b.setAttribute("aria-pressed",vibOn);}
$("#tm").onclick=()=>{tema=TEMAS[(TEMAS.findIndex(t=>t[0]===tema)+1)%TEMAS.length][0];LSs("an8tema",tema);aplicaTema();};
aplicaTema();
$("#sn").onclick=function(){soundOn=!soundOn;this.textContent=(soundOn?"🔊":"🔇")+" Som: "+(soundOn?"sim":"não");this.setAttribute("aria-pressed",soundOn);beep("ok");};
$("#op").onclick=e=>{e.stopPropagation();const m=$("#opm");m.classList.toggle("show");$("#op").setAttribute("aria-expanded",m.classList.contains("show"));};
document.addEventListener("click",e=>{if(!e.target.closest(".opw"))$("#opm").classList.remove("show");});
$$(".ht").forEach(b=>b.onclick=()=>{if(b.dataset.pr){irPara("prog");prIniciar(b.dataset.pr);}else irPara(b.dataset.t);});
