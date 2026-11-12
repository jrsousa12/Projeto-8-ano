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

/* ---------- ilustrações ---------- */
const turtle=(sh,dk,sp)=>`<svg viewBox="0 0 120 80"><ellipse cx="60" cy="72" rx="42" ry="4.5" fill="rgba(0,0,0,.22)"/>
<g class="lg"><ellipse cx="34" cy="64" rx="7" ry="9" fill="#7f8f58"/></g><g class="lg" style="animation-delay:-.4s"><ellipse cx="82" cy="64" rx="7" ry="9" fill="#7f8f58"/></g>
<path d="M12 62 Q12 24 58 24 Q104 24 104 62Z" fill="${sh}"/><path d="M12 62h92v6H12z" fill="#d9c58c"/>
<path d="M36 62 Q38 38 58 33 Q78 38 80 62M58 26V62M24 56 Q30 40 40 34M92 56 Q86 40 76 34" fill="none" stroke="${dk}" stroke-width="2"/>
<ellipse cx="108" cy="52" rx="10" ry="7" fill="#7f8f58"/><circle cx="112" cy="49" r="2" fill="#111"/>${sp}<path d="M12 60l-9 3 9 3z" fill="#7f8f58"/></svg>`;
const wv='<path d="M0 74 Q15 70 30 74 T60 74 T90 74 T120 74" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="2"/>';
const ART={
tartaruga:()=>turtle("#7a6a3a","#54461f",'<ellipse cx="106" cy="47" rx="3.5" ry="1.8" fill="#facc15"/>'),
tracaja:()=>turtle("#5f6b45","#3f4a2c",'<circle cx="105" cy="47" r="1.8" fill="#facc15"/><circle cx="110" cy="54" r="1.5" fill="#facc15"/><circle cx="103" cy="53" r="1.5" fill="#facc15"/>'),
jacare:()=>`<svg viewBox="0 0 120 80"><g class="tl"><path d="M2 54 Q22 40 44 48 L44 60 Q22 64 2 54Z" fill="#4a5a38"/></g>
<g class="lg"><rect x="46" y="58" width="8" height="12" rx="4" fill="#3f4d2f"/></g><g class="lg" style="animation-delay:-.4s"><rect x="78" y="58" width="8" height="12" rx="4" fill="#3f4d2f"/></g>
<rect x="38" y="42" width="62" height="20" rx="10" fill="#566f40"/><path d="M92 44 Q108 40 118 46 L118 54 Q106 60 92 60Z" fill="#566f40"/>
<path d="M92 56 L118 53" stroke="#2f3b22" stroke-width="1.6"/><path d="M99 54l2 3 2-3M108 53.5l2 3 2-3" fill="#fff"/>
<circle cx="100" cy="41" r="4.5" fill="#566f40"/><circle cx="101.5" cy="40" r="1.9" fill="#facc15"/><circle cx="102" cy="40" r=".8" fill="#111"/>
<path d="M44 42l3-5 3 5zM54 42l3-5 3 5zM64 42l3-5 3 5zM74 42l3-5 3 5zM84 42l3-5 3 5z" fill="#3b4a2b"/></svg>`,
onca:()=>`<svg viewBox="0 0 120 80"><ellipse cx="58" cy="76" rx="40" ry="3.5" fill="rgba(0,0,0,.22)"/>
<g class="tl"><path d="M26 42 Q4 40 6 20 Q7 13 13 16 Q12 30 28 36Z" fill="#e8a33a"/></g>
<g class="lg"><rect x="30" y="54" width="9" height="21" rx="4.5" fill="#d9942c"/></g><g class="lg" style="animation-delay:-.4s"><rect x="44" y="54" width="9" height="21" rx="4.5" fill="#e8a33a"/></g>
<g class="lg" style="animation-delay:-.4s"><rect x="72" y="54" width="9" height="21" rx="4.5" fill="#d9942c"/></g><g class="lg"><rect x="86" y="54" width="9" height="21" rx="4.5" fill="#e8a33a"/></g>
<ellipse cx="58" cy="44" rx="36" ry="17" fill="#f0b04a"/><ellipse cx="58" cy="55" rx="30" ry="6" fill="#f8dca0"/>
<circle cx="98" cy="32" r="13" fill="#f0b04a"/><circle cx="90" cy="21" r="4.5" fill="#f0b04a"/><circle cx="106" cy="21" r="4.5" fill="#f0b04a"/>
<ellipse cx="107" cy="38" rx="8" ry="6" fill="#f8dca0"/><ellipse cx="113" cy="35" rx="2.6" ry="2" fill="#3b2a12"/><path class="tg" d="M106 42q2 9 6 1z" fill="#fb7185"/>
<circle cx="102" cy="29" r="2.4" fill="#fff"/><circle cx="102.8" cy="29" r="1.3" fill="#111"/>
<g fill="none" stroke="#3b2a12" stroke-width="2.2"><circle cx="40" cy="40" r="4"/><circle cx="54" cy="36" r="4"/><circle cx="68" cy="40" r="4"/><circle cx="82" cy="37" r="4"/><circle cx="48" cy="50" r="3.5"/><circle cx="62" cy="49" r="3.5"/><circle cx="76" cy="49" r="3.5"/></g>
<g fill="#3b2a12"><circle cx="40" cy="40" r="1"/><circle cx="54" cy="36" r="1"/><circle cx="68" cy="40" r="1"/><circle cx="82" cy="37" r="1"/><circle cx="96" cy="27" r="1.2"/><circle cx="92" cy="35" r="1.2"/></g></svg>`,
guara:()=>`<svg viewBox="0 0 120 80"><g class="lg"><path d="M54 52V78" stroke="#f08080" stroke-width="3" stroke-linecap="round"/></g><g class="lg" style="animation-delay:-.4s"><path d="M64 52V78" stroke="#f08080" stroke-width="3" stroke-linecap="round"/></g>
<path d="M32 42 Q22 44 16 54 Q30 52 40 48Z" fill="#e0322b"/><ellipse cx="56" cy="42" rx="26" ry="14" fill="#e0322b"/>
<path d="M74 40 Q92 34 90 22 Q89 14 94 14" fill="none" stroke="#e0322b" stroke-width="7" stroke-linecap="round"/>
<circle cx="96" cy="14" r="6.5" fill="#e0322b"/><path d="M100 12 Q118 12 116 34 Q110 20 99 18Z" fill="#2b2b2b"/><circle cx="97" cy="12" r="1.6" fill="#111"/>
<path d="M36 40 Q54 48 76 40 Q60 56 36 40Z" fill="#ff6b61" opacity=".6"/></svg>`,
boto:()=>`<svg viewBox="0 0 120 80"><path d="M12 50 Q38 22 76 32 Q94 36 104 42 L119 43 L119 48 L102 50 Q86 64 54 64 Q26 64 12 50Z" fill="#f4a9bd"/>
<path d="M30 40 Q44 24 60 28 Q52 34 36 44Z" fill="#e58aa4"/><path d="M12 50 Q2 44 0 32 Q10 38 18 44Z M12 50 Q0 56 0 68 Q10 60 18 54Z" fill="#e58aa4"/>
<path d="M60 56 Q68 72 80 70 Q74 62 70 56Z" fill="#e58aa4"/><circle cx="92" cy="40" r="2.2" fill="#333"/><path d="M96 48 Q106 50 118 47" stroke="#d0708a" stroke-width="1.5" fill="none"/>${wv}</svg>`,
peixeboi:()=>`<svg viewBox="0 0 120 80"><ellipse cx="14" cy="42" rx="14" ry="12" fill="#7a8896"/><ellipse cx="60" cy="42" rx="42" ry="21" fill="#8795a3"/>
<ellipse cx="100" cy="44" rx="16" ry="14" fill="#8795a3"/><ellipse cx="112" cy="49" rx="7" ry="5.5" fill="#6e7b88"/><circle cx="105" cy="38" r="1.9" fill="#111"/>
<ellipse cx="84" cy="58" rx="13" ry="5" transform="rotate(30 84 58)" fill="#6e7b88"/><path d="M110 55q3 3 6 0" stroke="#4d5964" stroke-width="1.2" fill="none"/>${wv}</svg>`,
pirarucu:()=>`<svg viewBox="0 0 120 80"><path d="M14 40 L0 26 Q8 40 0 54Z" fill="#c2410c"/><ellipse cx="56" cy="40" rx="48" ry="14" fill="#6f7f5a"/><ellipse cx="26" cy="40" rx="22" ry="13" fill="#b4351a" opacity=".9"/>
<path d="M92 32 Q108 33 118 42 Q108 50 92 48Z" fill="#6f7f5a"/><circle cx="106" cy="38" r="2" fill="#111"/><path d="M104 45 L118 43" stroke="#3d4a33" stroke-width="1.4"/>
<path d="M32 28 Q40 18 52 28Z M34 52 Q42 62 52 52Z" fill="#b4351a"/><path d="M80 48 Q86 60 92 56 Q88 52 86 48Z" fill="#5a6a47"/>
<g stroke="#4f5e3d" fill="none" stroke-width="1.2" opacity=".7"><path d="M60 30q4 5 0 10M68 30q4 5 0 10M76 31q4 5 0 10M52 38q4 5 0 10M60 40q4 5 0 10M68 40q4 5 0 10M76 41q4 5 0 8"/></g>${wv}</svg>`,
caranguejo:()=>`<svg viewBox="0 0 120 80"><g stroke="#4a5784" stroke-width="3.5" stroke-linecap="round" fill="none"><path d="M36 50 L16 58 L10 70M38 54 L22 68 L18 78M42 58 L34 74M84 50 L104 58 L110 70M82 54 L98 68 L102 78M78 58 L86 74"/></g>
<path d="M50 32v-9M70 32v-9" stroke="#4a5784" stroke-width="3" stroke-linecap="round"/><circle cx="50" cy="21" r="4" fill="#fff"/><circle cx="70" cy="21" r="4" fill="#fff"/><circle cx="51" cy="21" r="1.8" fill="#111"/><circle cx="71" cy="21" r="1.8" fill="#111"/>
<ellipse cx="60" cy="46" rx="27" ry="17" fill="#5d6c9a"/><path d="M60 32v28M42 40q10 8 18 6M78 40q-10 8-18 6" stroke="#47547f" stroke-width="1.6" fill="none"/>
<path d="M84 40 Q98 34 102 20" stroke="#4a5784" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M96 18 Q112 6 114 24 Q106 26 102 20Z" fill="#d97757"/>
<path d="M36 40 Q24 36 20 28" stroke="#4a5784" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M14 26 Q22 16 26 28Z" fill="#d97757"/></svg>`,
harpia:()=>`<svg viewBox="0 0 120 80"><rect x="0" y="68" width="120" height="7" rx="3" fill="#6b4a2b"/>
<path d="M44 68 Q38 32 60 24 Q82 32 76 68Z" fill="#555e6b"/><path d="M52 68 Q50 44 60 40 Q70 44 68 68Z" fill="#f1f1ee"/>
<path d="M50 48 Q60 54 70 48" stroke="#2f3640" stroke-width="4" fill="none"/>
<circle cx="60" cy="20" r="12" fill="#9aa3ad"/><path d="M52 12 L44 2M60 9 L60 -1M68 12 L76 2" stroke="#2f3640" stroke-width="3" stroke-linecap="round"/>
<path d="M65 23 Q80 22 76 36 Q70 31 65 29Z" fill="#2f3640"/><circle cx="64" cy="18" r="2.2" fill="#fff"/><circle cx="64.6" cy="18" r="1.2" fill="#111"/>
<path d="M50 68 l-4 9 M54 68 l-1 10 M66 68 l1 10 M70 68 l4 9" stroke="#e6c84f" stroke-width="3" stroke-linecap="round"/></svg>`,
sapo:()=>`<svg viewBox="0 0 120 80"><ellipse cx="58" cy="72" rx="38" ry="4" fill="rgba(0,0,0,.2)"/>
<path d="M32 60 Q16 54 12 72 L38 72 Q46 66 42 58Z" fill="#7a5b38"/><rect x="78" y="58" width="7" height="14" rx="3.5" fill="#7a5b38"/>
<ellipse cx="58" cy="52" rx="34" ry="20" fill="#8b6b45"/><ellipse cx="88" cy="42" rx="18" ry="14" fill="#8b6b45"/>
<circle cx="92" cy="30" r="7.5" fill="#d9c27a"/><circle cx="93" cy="30" r="3.4" fill="#111"/><path d="M70 36 Q78 30 84 38 Q78 46 70 42Z" fill="#6f5232"/>
<path d="M96 49 Q104 52 108 47" stroke="#4a3520" stroke-width="2" fill="none"/>
<g fill="#6f5232"><circle cx="46" cy="44" r="2.6"/><circle cx="56" cy="38" r="2.2"/><circle cx="40" cy="54" r="2.4"/><circle cx="58" cy="52" r="2.6"/><circle cx="68" cy="56" r="2.2"/><circle cx="50" cy="62" r="2.2"/></g>
<ellipse cx="60" cy="64" rx="22" ry="6" fill="#d8c79c" opacity=".7"/></svg>`,
ariranha:()=>`<svg viewBox="0 0 120 80"><path d="M0 62 Q15 56 30 62 T60 62 T90 62 T120 62 V80 H0Z" fill="rgba(56,140,190,.45)"/>
<path d="M6 52 Q-2 50 0 44 Q10 46 16 50Z" fill="#4a2f1b"/><path d="M4 54 Q20 40 46 42 Q78 40 96 44 Q108 48 108 56 Q100 64 88 62 Q60 68 30 64 Q12 64 4 54Z" fill="#5a3a22"/>
<circle cx="100" cy="44" r="12" fill="#5a3a22"/><ellipse cx="109" cy="48" rx="7" ry="5.5" fill="#6d4a2e"/><ellipse cx="112" cy="46" rx="2.2" ry="1.6" fill="#111"/>
<circle cx="102" cy="40" r="2" fill="#111"/><circle cx="94" cy="34" r="3" fill="#5a3a22"/><path d="M92 54 Q102 64 114 54 Q104 60 92 54Z" fill="#f1ddb0"/>
<path d="M112 50 l8 -2M112 52 l8 2" stroke="#e5d3a8" stroke-width="1" /><ellipse cx="84" cy="62" rx="7" ry="4" fill="#4a2f1b"/></svg>`
};
const DISART={
caramujo:`<svg viewBox="0 0 120 80"><path d="M8 66 Q60 58 112 66 L112 72 H8Z" fill="#8a9a5b"/><path d="M92 64 Q104 40 110 28" stroke="#8a9a5b" stroke-width="10" stroke-linecap="round" fill="none"/><circle cx="52" cy="40" r="26" fill="#d9a066"/><circle cx="52" cy="40" r="18" fill="none" stroke="#8a5a2b" stroke-width="3"/><circle cx="52" cy="40" r="10" fill="none" stroke="#8a5a2b" stroke-width="3"/><circle cx="52" cy="40" r="3" fill="#8a5a2b"/><circle cx="108" cy="26" r="2.4" fill="#111"/></svg>`,
tenia:`<svg viewBox="0 0 120 80"><path d="M8 54 Q22 26 38 54 T68 54 T98 50" fill="none" stroke="#f0e2c4" stroke-width="12" stroke-linecap="round"/><path d="M8 54 Q22 26 38 54 T68 54 T98 50" fill="none" stroke="#b59b6a" stroke-width="12" stroke-dasharray="1.6 8"/><circle cx="104" cy="48" r="8" fill="#f0e2c4"/><circle cx="102" cy="46" r="1.6" fill="#7c6a40"/><circle cx="107" cy="46" r="1.6" fill="#7c6a40"/><circle cx="102" cy="51" r="1.6" fill="#7c6a40"/><circle cx="107" cy="51" r="1.6" fill="#7c6a40"/></svg>`,
lombriga:`<svg viewBox="0 0 120 80"><path d="M10 60 Q30 20 52 50 T96 36 Q108 32 112 40" fill="none" stroke="#f3a6a0" stroke-width="13" stroke-linecap="round"/><path d="M10 60 Q30 20 52 50 T96 36" fill="none" stroke="#dd7f78" stroke-width="13" stroke-dasharray="1.2 11"/><circle cx="108" cy="38" r="1.6" fill="#7a2f2a"/></svg>`,
amarelao:`<svg viewBox="0 0 120 80"><path d="M14 30 Q36 8 56 30 T98 26" fill="none" stroke="#f0c53c" stroke-width="8" stroke-linecap="round"/><path d="M16 62 Q38 40 58 62 T100 58" fill="none" stroke="#e0a82a" stroke-width="8" stroke-linecap="round"/><path d="M96 24l6-2M98 56l6-2" stroke="#8a6a12" stroke-width="3" stroke-linecap="round"/></svg>`,
mosquito:`<svg viewBox="0 0 120 80"><ellipse cx="50" cy="26" rx="20" ry="7" transform="rotate(-25 50 26)" fill="rgba(255,255,255,.6)"/><ellipse cx="62" cy="24" rx="20" ry="6" transform="rotate(-10 62 24)" fill="rgba(255,255,255,.45)"/><ellipse cx="50" cy="44" rx="22" ry="8" fill="#6b5a4a"/><circle cx="76" cy="42" r="7" fill="#6b5a4a"/><path d="M82 43 L110 50" stroke="#333" stroke-width="2.2" stroke-linecap="round"/><circle cx="78" cy="39" r="1.8" fill="#fff"/><path d="M38 38v14M46 37v14M54 37v14" stroke="#e8ddd0" stroke-width="2"/><path d="M40 50l-8 14M50 52l-2 16M60 50l8 14M66 46l12 12" stroke="#4a3c30" stroke-width="2" stroke-linecap="round" fill="none"/></svg>`
};
const emo=e=>`<svg viewBox="0 0 120 80"><text x="60" y="62" font-size="56" text-anchor="middle">${e}</text></svg>`;

/* ---------- temperatura ---------- */
const col=t=>`hsl(${Math.max(0,230-t*5.2)} 90% 55%)`;
let T=25;
const lerp=(a,b,k)=>a+(b-a)*k;
const hex=h=>[1,3,5].map(i=>parseInt(h.substr(i,2),16));
function mixc(c1,c2,k){const a=hex(c1),b=hex(c2);return "rgb("+a.map((v,i)=>Math.round(lerp(v,b[i],k))).join(",")+")";}
function skyAt(t){return t<21?[mixc("#8fa6c2","#6ec1ee",t/21),mixc("#c9d6e6","#bfe6fa",t/21)]:[mixc("#6ec1ee","#ffb25e",(t-21)/21),mixc("#bfe6fa","#ffe3a8",(t-21)/21)];}
const WAVE='M0 8 Q10 4 20 8 T40 8 T60 8 T80 8 T100 8 T120 8 T140 8 T160 8 T180 8 T200 8 T220 8 T240 8 T260 8 T280 8 T300 8 T320 8 T340 8 T360 8 T380 8 T400 8';
const BG_E=id=>`<svg class="bgs" viewBox="0 0 400 240" preserveAspectRatio="none"><defs><linearGradient id="sk${id}" x1="0" y1="0" x2="0" y2="1"><stop class="s0" offset="0" stop-color="#6ec1ee"/><stop class="s1" offset="1" stop-color="#bfe6fa"/></linearGradient></defs>
<rect width="400" height="240" fill="url(#sk${id})"/>
<path d="M0 112 Q40 84 80 104 T160 98 T240 102 T320 90 T400 104 V150 H0Z" fill="#1f6b3a"/><path d="M0 128 Q50 104 100 124 T200 118 T300 122 T400 114 V160 H0Z" fill="#166534"/>
<rect y="146" width="400" height="38" fill="#2b8bb8"/><path d="${WAVE}" transform="translate(0,150)" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="2"/>
<path d="M0 182 Q60 172 120 180 T260 178 T400 180 V240 H0Z" fill="#e3c887"/>
<ellipse cx="62" cy="214" rx="64" ry="13" fill="rgba(0,0,0,.2)"/>
<path d="M64 96 Q70 150 60 214" stroke="#6b4a2b" stroke-width="8" fill="none" stroke-linecap="round"/>
<ellipse cx="62" cy="84" rx="58" ry="24" fill="#15803d"/><ellipse cx="30" cy="96" rx="30" ry="16" fill="#166534"/><ellipse cx="96" cy="98" rx="30" ry="15" fill="#14532d"/></svg>`;
const BG_N=id=>`<svg class="bgs" viewBox="0 0 400 240" preserveAspectRatio="none"><defs><linearGradient id="sk${id}" x1="0" y1="0" x2="0" y2="1"><stop class="s0" offset="0" stop-color="#6ec1ee"/><stop class="s1" offset="1" stop-color="#bfe6fa"/></linearGradient></defs>
<rect width="400" height="240" fill="url(#sk${id})"/>
<path d="M0 120 Q30 80 60 112 T130 100 T200 112 T270 94 T340 110 T400 98 V170 H0Z" fill="#14532d"/>
<g fill="#0f3d22"><rect x="180" y="60" width="9" height="120"/><rect x="250" y="50" width="11" height="130"/><rect x="330" y="64" width="9" height="116"/></g>
<g fill="#166534"><ellipse cx="184" cy="62" rx="34" ry="20"/><ellipse cx="255" cy="52" rx="38" ry="22"/><ellipse cx="334" cy="66" rx="32" ry="18"/></g>
<path d="M0 176 Q100 164 200 172 T400 168 V240 H0Z" fill="#3f7d2a"/><path d="M0 196 Q100 188 200 194 T400 190 V240 H0Z" fill="#6b4f2a"/>
<ellipse cx="316" cy="214" rx="82" ry="17" fill="#2b8bb8"/>
<ellipse cx="62" cy="214" rx="64" ry="13" fill="rgba(0,0,0,.22)"/>
<path d="M64 90 Q70 150 60 214" stroke="#5a3d20" stroke-width="9" fill="none" stroke-linecap="round"/>
<ellipse cx="62" cy="80" rx="60" ry="26" fill="#15803d"/><ellipse cx="28" cy="94" rx="30" ry="16" fill="#166534"/><ellipse cx="98" cy="96" rx="30" ry="15" fill="#14532d"/></svg>`;
const FG_E='<svg class="fgs" viewBox="0 0 400 240" preserveAspectRatio="none"><rect y="156" width="400" height="26" fill="rgba(43,139,184,.6)"/><path d="'+WAVE+'" transform="translate(0,150)" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="2"/></svg>';
const FG_N='<svg class="fgs" viewBox="0 0 400 240" preserveAspectRatio="none"><ellipse cx="316" cy="212" rx="80" ry="12" fill="rgba(43,139,184,.55)"/></svg>';
const SCN=[];
function mkScene(sel,id,bg,fg){
 const el=$(sel);
 el.innerHTML=bg(id)+`<div class="sun"></div><div class="cl" style="left:12%;top:10%;width:14%"></div><div class="cl" style="left:50%;top:6%;width:11%"></div>`+fg+`<div class="tint"></div>`;
 const o={el,sun:$(".sun",el),cls:$$(".cl",el),tint:$(".tint",el),s0:$(".s0",el),s1:$(".s1",el),acts:[]};SCN.push(o);return o;}
function mkAct(sc,svg,o){
 const d=document.createElement("div");d.className="act";d.style.cssText=`width:${o.w}%;bottom:${o.y}%;z-index:${o.z||3}`;
 d.innerHTML=`<div class="fl">${svg}</div><span class="em"></span>`;sc.el.appendChild(d);
 const a=Object.assign({d,fl:d.firstChild,em:$(".em",d),x:o.x,dir:1,t:0,walk:false,pf:0},o);sc.acts.push(a);return a;}
const sE=mkScene("#scE","E",BG_E,FG_E),sN=mkScene("#scN","N",BG_N,FG_N);
// ectotérmicos: velocidade depende da temperatura
const spE=(t,m)=>t<6?0:t<18?lerp(4,16,(t-6)/12)*m:lerp(16,30,Math.min(1,(t-18)/16))*m;
mkAct(sE,ART.jacare(),{w:26,y:24,x:300,min:200,max:350,z:1,kind:"jac",speed:t=>spE(t,1.1),hot:35,baseY:24});
mkAct(sE,ART.tartaruga(),{w:21,y:5,x:240,min:130,max:360,z:3,kind:"tar",speed:t=>spE(t,1),hot:35,shade:62,shSp:26});
// endotérmicos: ritmo constante em qualquer temperatura
mkAct(sN,ART.onca(),{w:25,y:5,x:250,min:120,max:370,z:3,kind:"onc",speed:t=>38,hot:35,shade:62,shSp:38});
mkAct(sN,ART.guara(),{w:15,y:11,x:316,min:262,max:372,z:1,kind:"gua",speed:t=>9,hot:99});
let lastT=performance.now();
function tick(now){const dt=Math.min(.05,(now-lastT)/1000);lastT=now;
 SCN.forEach(sc=>sc.acts.forEach(a=>{
  const hot=T>=a.hot;let sp=a.speed(T);
  if(a.shade!==undefined&&hot){const dx=a.shade-a.x;if(Math.abs(dx)>3){a.dir=Math.sign(dx);a.x+=a.dir*a.shSp*dt;a.walk=true;sp=a.shSp;}else{a.walk=false;sp=0;}}
  else{if(sp>0){a.x+=a.dir*sp*dt;if(a.x>a.max){a.x=a.max;a.dir=-1;}if(a.x<a.min){a.x=a.min;a.dir=1;}}a.walk=sp>.5;if(a.kind==="jac"&&hot)a.walk=false;}
  a.d.style.left=(a.x/4)+"%";
  const cold=T<12;let sc2=1;if(a.kind==="gua"&&cold)sc2=1.08;
  a.fl.style.transform=`scaleX(${a.dir}) scale(${sc2})`;
  a.d.classList.toggle("still",!a.walk);
  a.d.style.setProperty("--st",Math.max(.22,Math.min(1.6,10/Math.max(sp,1.5)))+"s");
  if(a.kind==="jac"){a.d.style.bottom=(hot?a.baseY-6:a.baseY)+"%";}
  if(sc===sN){a.d.classList.toggle("hotb",a.kind==="onc"&&hot);a.fl.classList.toggle("shiver",cold&&a.kind!=="gua"||T<6&&a.kind==="gua");
   if(cold){a.pf-=dt;if(a.pf<=0){a.pf=.9;const p=document.createElement("i");p.className="pf";p.style.left=(a.dir>0?"88%":"12%");p.style.top="26%";p.style.setProperty("--px",(a.dir*14)+"px");a.d.appendChild(p);setTimeout(()=>p.remove(),1500);}}}
  else{a.fl.style.filter=(T<10&&a.kind!=="gua")?"saturate(.55) brightness(.9) hue-rotate(15deg)":"none";}
 }));
 requestAnimationFrame(tick);}
requestAnimationFrame(tick);
function emoji(a,t){if(a.kind==="tar"||a.kind==="jac")return t<6?"🥶":t>=35?"🥵":t<14?"🐌":"";if(a.kind==="onc")return t<12?"🥶":t>=35?"🥵":"";return"";}
function paintScene(t){
 SCN.forEach(sc=>{const [c0,c1]=skyAt(t);sc.s0.setAttribute("stop-color",c0);sc.s1.setAttribute("stop-color",c1);
  const hotk=Math.max(0,(t-26)/16),cold=Math.max(0,(14-t)/14);
  sc.sun.style.transform=`scale(${.55+hotk*1.1+(t>=14&&t<26?(t-14)/12*.45:0)})`;
  sc.sun.style.opacity=t<10?.35:1;
  sc.sun.style.background=t<12?"radial-gradient(#eef6ff,#c7dcf5)":t<30?"radial-gradient(#fff6a8,#fbbf24)":"radial-gradient(#fff3b0,#f97316)";
  sc.sun.style.boxShadow=t>=30?`0 0 ${20+hotk*60}px ${5+hotk*18}px rgba(255,140,30,.65)`:"none";
  sc.cls.forEach(c=>c.style.opacity=t<20?Math.min(.95,.25+cold*.9):0);
  sc.tint.style.background=t>=28?`rgba(255,120,20,${((t-28)/14*.22).toFixed(3)})`:t<14?`rgba(60,120,255,${(cold*.3).toFixed(3)})`:"transparent";
  sc.acts.forEach(a=>{a.em.textContent=emoji(a,t);});});}
function setTemp(t){t=+t;T=t;$("#amb").textContent=t;
 $("#fE").style.height=(t/45*100)+"%";$("#fE").style.background=col(t);$("#dE").textContent=t+"°";
 const n=37;$("#fN").style.height=(n/45*100)+"%";$("#fN").style.background=col(n);$("#dN").textContent=n+"°";
 let e;if(t<6)e="🥶 Muito frio! A tartaruga fica parada e o jacaré quase não se mexe: sem calor do ambiente, o corpo fica sem energia para se mover.";
 else if(t<20)e="😐 Frio: a tartaruga anda devagar e o jacaré nada com preguiça. O corpo esfria junto com o ambiente.";
 else if(t<35)e="😄 Temperatura boa! A tartaruga anda ligeira e o jacaré nada à vontade.";else e="🥵 Quente demais! A tartaruga procura a sombra da árvore e o jacaré se afunda na água para não superaquecer.";
 $("#sE").textContent=e;
 let n2;if(t<12)n2="🥶 A onça continua andando no mesmo ritmo e o corpo segue estável. Ela treme e solta vapor ao respirar: gasta energia dos alimentos para manter o calor, e os pelos ajudam a isolar.";
 else if(t<35)n2="😊 Onça e guará mantêm a temperatura do corpo sozinhos, usando a energia dos alimentos. O ritmo é o mesmo de sempre.";else n2="💦 Mesmo no calor, o corpo se mantém estável. A onça ofega e procura a sombra para se refrescar.";
 $("#sN").textContent=n2;paintScene(t);}
$("#sl").oninput=e=>setTemp(e.target.value);setTemp(25);

/* ---------- metamorfose ---------- */
const MS={
ins:[
{t:"1. Ovo",d:"A fêmea põe ovos, geralmente sobre uma folha. Insetos têm reprodução sexuada com produção de ovos.",s:`<svg viewBox="0 0 160 160"><path d="M10 120 Q80 70 150 110 Q90 140 10 120Z" fill="#22c55e"/><path d="M20 118 Q80 96 140 112" stroke="#15803d" stroke-width="3" fill="none"/><g fill="#fef9c3" stroke="#facc15" stroke-width="2"><ellipse cx="64" cy="98" rx="7" ry="9"/><ellipse cx="82" cy="94" rx="7" ry="9"/><ellipse cx="100" cy="98" rx="7" ry="9"/></g></svg>`},
{t:"2. Larva (lagarta)",d:"O ovo eclode. A larva come muito e cresce, trocando de exoesqueleto (muda).",s:`<svg viewBox="0 0 160 160"><g>${[0,1,2,3,4,5].map(i=>`<circle class="ring" style="--i:${i}" cx="${40+i*15}" cy="90" r="11" fill="${i%2?"#4ade80":"#22c55e"}"/>`).join("")}<circle class="ring" style="--i:6" cx="132" cy="90" r="13" fill="#f97316"/><circle cx="137" cy="86" r="3" fill="#fff"/><circle cx="138" cy="86" r="1.4" fill="#111"/></g></svg>`},
{t:"3. Pupa (crisálida)",d:"A lagarta se prende a um galho e se transforma por dentro. Parece parada, mas o corpo está mudando!",s:`<svg viewBox="0 0 160 160"><path d="M20 24 H140" stroke="#78350f" stroke-width="8" stroke-linecap="round"/><g class="swing"><path d="M80 24 V44" stroke="#a16207" stroke-width="3"/><path d="M80 44 Q106 64 94 112 Q80 134 66 112 Q54 64 80 44Z" fill="#84cc16"/><path d="M68 66 Q80 72 92 66 M66 84 Q80 90 94 84 M68 102 Q80 108 92 102" stroke="#3f6212" stroke-width="2.5" fill="none"/></g></svg>`},
{t:"4. Adulto (borboleta)",d:"O adulto sai da pupa, abre as asas e voa. É a metamorfose completa: ovo, larva, pupa e adulto.",s:`<svg viewBox="0 0 160 160"><g class="wingl"><path d="M80 76 Q104 20 142 40 Q150 78 100 90Z" fill="#38bdf8"/><path d="M80 90 Q110 92 124 124 Q92 134 80 100Z" fill="#6366f1"/><circle cx="116" cy="58" r="8" fill="#fde68a"/></g><g class="wing"><path d="M80 76 Q56 20 18 40 Q10 78 60 90Z" fill="#38bdf8"/><path d="M80 90 Q50 92 36 124 Q68 134 80 100Z" fill="#6366f1"/><circle cx="44" cy="58" r="8" fill="#fde68a"/></g><rect x="75" y="62" width="10" height="64" rx="5" fill="#1e293b"/><path d="M78 62 Q68 40 58 34 M82 62 Q92 40 102 34" stroke="#1e293b" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`}],
sapo:[
{t:"1. Ovos",d:"Os anfíbios fazem fecundação externa, na água ou em locais úmidos. Os ovos ficam em uma massa gelatinosa.",s:`<svg viewBox="0 0 160 160"><g fill="#bae6fd" stroke="#38bdf8" stroke-width="2" opacity=".95">${[[50,92],[72,86],[94,92],[116,88],[60,112],[84,110],[106,112],[72,66],[96,70]].map(c=>`<circle cx="${c[0]}" cy="${c[1]}" r="11"/>`).join("")}</g><g fill="#1e293b">${[[50,92],[72,86],[94,92],[116,88],[60,112],[84,110],[106,112],[72,66],[96,70]].map(c=>`<circle cx="${c[0]}" cy="${c[1]}" r="4"/>`).join("")}</g></svg>`},
{t:"2. Girino",d:"Do ovo nasce o girino, que vive na água, tem cauda e respira por brânquias.",s:`<svg viewBox="0 0 160 160"><g class="swim"><g class="tail"><path d="M70 80 Q110 60 138 82 Q110 100 70 82Z" fill="#374151"/></g><ellipse cx="56" cy="80" rx="30" ry="22" fill="#4b5563"/><circle cx="44" cy="72" r="5" fill="#fff"/><circle cx="43" cy="72" r="2.4" fill="#111"/></g></svg>`},
{t:"3. Girino com pernas",d:"Crescem as pernas, a cauda vai diminuindo e os pulmões se desenvolvem. É a metamorfose!",s:`<svg viewBox="0 0 160 160"><g class="swim"><path d="M76 82 Q104 72 124 84 Q104 94 76 84Z" fill="#4b5563"/><ellipse cx="60" cy="80" rx="30" ry="22" fill="#6b7280"/><circle cx="46" cy="70" r="5" fill="#fff"/><circle cx="45" cy="70" r="2.4" fill="#111"/><g stroke="#16a34a" stroke-width="7" stroke-linecap="round" fill="none"><path d="M70 98 L84 116 L96 112"/><path d="M52 98 L48 118 L60 120"/></g></g></svg>`},
{t:"4. Sapo adulto",d:"O sapo adulto respira por pulmões e pela pele, vive na terra úmida e volta à água para se reproduzir.",s:ICONSVG.anfibio()}]};
const GAF=(k,w)=>`<svg viewBox="0 0 160 160"><g transform="translate(80 110) scale(${k}) translate(-80 -110)"><g class="bob">
<path d="M82 98 L96 66 L116 118" stroke="#4d7c0f" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M70 100 L66 124 M60 100 L52 122" stroke="#4d7c0f" stroke-width="5" stroke-linecap="round"/>
<ellipse cx="102" cy="94" rx="36" ry="13" fill="#84cc16"/><circle cx="66" cy="90" r="13" fill="#a3e635"/><circle cx="46" cy="84" r="12" fill="#84cc16"/>
<circle cx="42" cy="81" r="4.2" fill="#fff"/><circle cx="41" cy="81" r="2" fill="#111"/><path d="M40 70 Q34 56 24 50" stroke="#4d7c0f" stroke-width="3" fill="none" stroke-linecap="round"/>
${w?`<g class="wing"><path d="M70 82 Q110 56 142 84 Q108 96 70 90Z" fill="#fde68a" opacity=".78" stroke="#ca8a04" stroke-width="2"/></g>`:""}</g></g></svg>`;
MS.gaf=[
{t:"1. Ovo",d:"A fêmea põe os ovos no solo. Na metamorfose incompleta não existem larva nem pupa.",s:`<svg viewBox="0 0 160 160"><path d="M0 118 Q80 100 160 118 V160 H0Z" fill="#78350f"/><g fill="#fef3c7" stroke="#d97706" stroke-width="2">${[[50,116],[68,110],[86,116],[104,110],[122,116]].map(c=>`<ellipse cx="${c[0]}" cy="${c[1]}" rx="6" ry="11" transform="rotate(${c[0]%2?-12:12} ${c[0]} ${c[1]})"/>`).join("")}</g></svg>`},
{t:"2. Ninfa",d:"Nasce a ninfa: parece um adulto em miniatura, mas sem asas. Cresce trocando de exoesqueleto (muda ou ecdise).",s:GAF(.62,false)},
{t:"3. Adulto",d:"Depois de várias mudas surgem as asas e o animal fica adulto. Metamorfose incompleta: ovo, ninfa e adulto.",s:GAF(1,true)}];
let mode="ins",stI=0,timer=null;
function renderStage(){const L=MS[mode],s=L[stI];if(stI===L.length-1&&typeof NV!=="undefined")NV.marcar("meta:"+mode);$("#stg").innerHTML=s.s;$("#stT").textContent=s.t;$("#stD").textContent=s.d;
 $("#dots").innerHTML=L.map((x,i)=>`<button class="dot ${i===stI?"on":""}" data-i="${i}">${x.t.replace(/^\d+\.\s*/,"").replace(/\s*\(.*\)/,"")}</button>`).join("");
 $$("#dots .dot").forEach(b=>b.onclick=()=>{stop();stI=+b.dataset.i;renderStage();});}
function stop(){clearInterval(timer);timer=null;$("#play").textContent="▶ Reproduzir";}
$("#play").onclick=()=>{if(timer){stop();return;}stI=0;renderStage();$("#play").textContent="⏸ Pausar";
 timer=setInterval(()=>{if(stI>=MS[mode].length-1){stop();burst(40);return;}stI++;renderStage();},2600);};
$$("[data-m]").forEach(b=>b.onclick=()=>{stop();mode=b.dataset.m;stI=0;$$("[data-m]").forEach(x=>x.classList.toggle("on",x===b));renderStage();});
renderStage();

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

/* ---------- classifique ---------- */

const cS={started:false,order:[],i:0,score:0,streak:0,best:0,wrong:[],missed:[],hints:0,review:false};
function startCls(list){cS.started=true;cS.review=!!list;cS.order=list?shuffle(list):shuffle(AN).slice(0,10);cS.i=0;cS.score=0;cS.streak=0;cS.best=0;cS.wrong=[];cS.missed=[];cS.hints=0;renderCls();}
function renderCls(){const box=$("#cbox"),S=cS;
 if(S.i>=S.order.length){const pct=S.score/S.order.length;
  box.innerHTML=`<div class="final"><div class="big">${pct>=.9?"🏆":pct>=.6?"🌟":"🌱"}</div><h2>${S.review?"Revisão: ":""}Você classificou ${fmt(S.score)} de ${S.order.length}</h2><p style="margin:8px 0">🔥 Maior sequência: <b>${S.best}</b></p>${hintLine(S.hints)}${S.wrong.length?`<div class="review"><b>📚 Revise:</b><ul>${S.wrong.map(x=>`<li>${x}</li>`).join("")}</ul></div>`:""}${S.missed.length?`<button class="btn" id="crev">🔎 Rever só os ${S.missed.length} que errei</button> `:""}<button class="btn pri" id="cagain">🔁 Jogar de novo</button></div>`;
  if(!S.review&&pct>=.7&&typeof NV!=="undefined")NV.marcar("jogo:cls");$("#cagain").onclick=()=>startCls();if(S.missed.length)$("#crev").onclick=()=>startCls(S.missed.slice());if(pct>=.7)burst(160);return;}
 const [nome,gid]=S.order[S.i],g=G.find(x=>x.id===gid);
 box.innerHTML=`<h2>🧩 Em qual grupo ele está?</h2><p class="sub">Leia o nome do animal e escolha o grupo certo.</p><div class="qtop"><span>Animal ${S.i+1}/${S.order.length}</span><span>⭐ ${fmt(S.score)} <span class="streak">🔥 ${S.streak}</span></span></div><div class="qbar"><i style="width:${S.i/S.order.length*100}%"></i></div><div class="big-name">${nome}</div><div id="co"></div><div class="why" id="cw"></div><div style="margin-top:14px"><button class="btn pri" id="cn" style="display:none">Próximo ▶</button></div>`;
 let okG=null,cdone=false;const opts=shuffle([g,...shuffle(G.filter(x=>x.id!==gid)).slice(0,3)]);
 opts.forEach(o=>{const b=document.createElement("button");b.className="opt";b.innerHTML=ICON[o.id]()+o.n;if(o===g)okG=b;
  b.onclick=ev=>{if(!ev||!ev.isTrusted||cdone)return;cdone=true;$$(".opt",$("#co")).forEach(x=>x.disabled=true);
   if(o===g){b.classList.add("ok");S.score+=HF?.5:1;S.streak++;S.best=Math.max(S.best,S.streak);$("#cw").innerHTML=`🎉 <b>Isso!</b> ${nome}: grupo <b>${g.n}</b>. ${g.f[0]}.`;if(S.streak>=3)burst(30);}
   else{b.classList.add("no");S.streak=0;S.missed.push(S.order[S.i]);S.wrong.push(`<b>${nome}</b>: ${g.n}`);okG.classList.add("ok");$("#cw").innerHTML=`🤔 Quase! ${nome}: grupo <b>${g.n}</b>. ${g.f[0]}.`;}
   $("#cn").style.display="inline-block";$("#cn").onclick=()=>{S.i++;renderCls();};};
  $("#co").appendChild(b);});
 $("#co").after(mkHint($("#co"),okG,()=>cdone,()=>{S.hints++;}));}

/* ---------- modo projeção ---------- */

/* ---------- confete ---------- */
const cv=$("#cf"),cx=cv.getContext("2d");let ps=[],run=false;
function fit(){cv.width=innerWidth;cv.height=innerHeight;}fit();addEventListener("resize",fit);
function burst(n){const cs=["#fbbf24","#f472b6","#38bdf8","#34d399","#a78bfa","#fb923c"];
 for(let i=0;i<n;i++)ps.push({x:innerWidth/2+(Math.random()-.5)*200,y:innerHeight*.35,vx:(Math.random()-.5)*14,vy:-Math.random()*13-3,s:5+Math.random()*7,r:Math.random()*6,vr:(Math.random()-.5)*.4,c:cs[i%cs.length],l:130+Math.random()*60});
 if(!run){run=true;requestAnimationFrame(loop);}}
function loop(){cx.clearRect(0,0,cv.width,cv.height);ps=ps.filter(p=>p.l>0);
 ps.forEach(p=>{p.vy+=.38;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;p.l--;cx.save();cx.translate(p.x,p.y);cx.rotate(p.r);cx.globalAlpha=Math.min(1,p.l/40);cx.fillStyle=p.c;cx.fillRect(-p.s/2,-p.s/3,p.s,p.s*.6);cx.restore();});
 if(ps.length)requestAnimationFrame(loop);else run=false;}

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
/* ---------- Quem é este? (jogo com imagens) ---------- */

const emjSvg=e=>`<svg viewBox="0 0 120 120"><text x="60" y="94" font-size="92" text-anchor="middle">${e}</text></svg>`;
const EMJIMG={"polvo":"a-polvo","lula":"a-lula","caracol":"a-caracol","ostra":"a-ostra","abelha":"a-abelha","formiga":"a-formiga","grilo":"a-grilo","aranha":"a-aranha","escorpião":"a-escorpiao","caranguejo":"a-caranguejo","lagosta":"a-lagosta","camarão":"a-camarao","borboleta":"a-borboleta","joaninha":"a-joaninha","lagarta":"a-lagarta","tubarão":"a-tubarao","baiacu":"a-baiacu","peixe-tropical":"a-peixe-tropical","sardinha":"a-sardinha","sapo":"a-sapo","tartaruga":"a-tartaruga","lagarto":"a-lagarto","serpente":"a-serpente","jacaré":"a-jacare","pinguim":"a-pinguim","coruja":"a-coruja","papagaio":"a-papagaio","pato":"a-pato","águia":"a-aguia","flamingo":"a-flamingo","pavão":"a-pavao","passarinho":"a-passarinho","baleia":"a-baleia","golfinho":"a-golfinho","morcego":"a-morcego","canguru":"a-canguru","coala":"a-coala","preguiça":"a-preguica","elefante":"a-elefante","macaco":"a-macaco","cavalo":"a-cavalo","cachorro":"a-cachorro","gato":"a-gato","lontra":"a-lontra"};
const IMGALL=[...PA.flatMap((a,i)=>[{k:"n",i},{k:"g",i}]),...G.map(g=>({k:"c",id:g.id})),...EMJ.map((x,i)=>({k:"e",i}))];
const iS={started:false,order:[],i:0,score:0,hints:0,missed:[],review:false};
function startImg(list){iS.started=true;iS.review=!!list;iS.order=list?shuffle(list):shuffle(IMGALL).slice(0,10);iS.i=0;iS.score=0;iS.hints=0;iS.missed=[];renderImg();}
function renderImg(){const box=$("#ibox"),S=iS;
 if(S.i>=S.order.length){const pct=S.score/S.order.length;
  box.innerHTML=`<div class="final"><div class="big">${pct>=.9?"🏆":pct>=.6?"🌟":"🌱"}</div><h2>${S.review?"Revisão: ":""}Você acertou ${fmt(S.score)} de ${S.order.length}</h2>${hintLine(S.hints)}${S.missed.length?`<button class="btn" id="irev">🔎 Rever só os ${S.missed.length} que errei</button> `:""}<button class="btn pri" id="iagain">🔁 Jogar de novo</button></div>`;
  if(!S.review&&pct>=.7&&typeof NV!=="undefined")NV.marcar("jogo:img");
  $("#iagain").onclick=()=>startImg();if(S.missed.length)$("#irev").onclick=()=>startImg(S.missed.slice());if(pct>=.7)burst(140);return;}
 const it=S.order[S.i];let svg,ask,right,pool;
 if(it.k==="n"){svg=paArt(it.i);ask="Que animal da Amazônia é este?";right=PA[it.i][0];pool=PA.filter((_,j)=>j!==it.i).map(x=>x[0]);}
 else if(it.k==="g"){const g=G.find(x=>x.id===PA[it.i][2]);svg=paArt(it.i);ask="A qual grupo este animal pertence?";right=g.n;pool=G.filter(x=>x!==g).map(x=>x.n);}
 else if(it.k==="e"){const x=EMJ[it.i],g=G.find(y=>y.id===x[1]);svg=EMJIMG[x[0]]?imgAni(EMJIMG[x[0]],"Ilustração do animal"):emjSvg(x[2]);ask="Este animal é o(a) "+x[0]+". A qual grupo ele pertence?";right=g.n;pool=G.filter(y=>y!==g).map(y=>y.n);}
 else{const g=G.find(x=>x.id===it.id);svg=ICON[g.id]();ask="Que grupo de animais aparece na imagem?";right=g.n;pool=G.filter(x=>x!==g).map(x=>x.n);}
 box.innerHTML=`<h2>🖼️ Quem é este?</h2><p class="sub">Olhe a imagem com atenção e escolha a resposta.</p><div class="qtop"><span>Imagem ${S.i+1}/${S.order.length}</span><span>⭐ ${fmt(S.score)}</span></div><div class="qbar"><i style="width:${S.i/S.order.length*100}%"></i></div><div class="imgq">${svg}</div><div class="qq">${ask}</div><div id="io"></div><div class="why" id="iw"></div><div style="margin-top:14px"><button class="btn pri" id="in" style="display:none">Próxima ▶</button></div>`;
 const od=$("#io");let okI=null,idone=false;
 shuffle([right,...shuffle(pool).slice(0,3)]).forEach(t=>{const b=document.createElement("button");b.className="opt";b.textContent=t;const ok=t===right;if(ok)okI=b;
  b.onclick=ev=>{if(!ev||!ev.isTrusted||idone)return;idone=true;$$(".opt",od).forEach(y=>y.disabled=true);
   if(ok){b.classList.add("ok");S.score+=HF?.5:1;beep("ok");$("#iw").innerHTML="🎉 <b>Correto!</b> É "+right+".";}
   else{b.classList.add("no");okI.classList.add("ok");beep("no");S.missed.push(it);$("#iw").innerHTML="🤔 Quase! A resposta certa é <b>"+right+"</b>.";}
   $("#in").style.display="inline-block";$("#in").onclick=()=>{S.i++;renderImg();};};od.appendChild(b);});
 od.after(mkHint(od,okI,()=>idone,()=>{S.hints++;}));}

/* ---------- instalar na tela inicial e tela cheia automática ---------- */
const isWeb=/^https?:$/.test(location.protocol);
const standalone=()=>{try{return matchMedia("(display-mode: standalone)").matches||matchMedia("(display-mode: fullscreen)").matches||navigator.standalone===true;}catch(e){return false;}};
let dip=null,autoFs=LSg("an8fs")!=="no",instHid=false;
if(isWeb){try{const l=document.createElement("link");l.rel="manifest";l.href="manifest.webmanifest";document.head.appendChild(l);
 if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});}catch(e){}}
function instHelp(){const ios=/iphone|ipad|ipod/i.test(navigator.userAgent);
 if(dip)return "Toque em Instalar para pôr o app na tela inicial. Ele abre em tela cheia.";
 return (ios?"No iPhone/iPad: toque em Compartilhar e depois em “Adicionar à Tela de Início”.":"No Chrome do celular: toque em ⋮ e depois em “Instalar app” ou “Adicionar à tela inicial”.")+(isWeb?"":" Para abrir como app em tela cheia, publique o pacote em um endereço https (veja o LEIA-ME).");}
function hideInst(){const b=$("#inst");if(b)b.remove();}
function showInst(force){if(standalone()||instHid||(!force&&LSg("an8inst")==="no"))return;hideInst();
 const b=document.createElement("div");b.id="inst";
 b.innerHTML=`<div class="it">📲 <b>Instalar na tela inicial</b><span>${instHelp()}</span></div><div class="ib">${dip?`<button class="btn pri" id="instOk">Instalar</button>`:""}<button class="btn" id="instNo">Agora não</button><button class="btn" id="instNever">Não mostrar mais</button></div>`;
 document.body.appendChild(b);setTimeout(()=>{if(b.isConnected){instHid=true;b.remove();}},15000);
 if($("#instOk"))$("#instOk").onclick=async()=>{try{dip.prompt();await dip.userChoice;}catch(e){}dip=null;hideInst();};
 $("#instNo").onclick=()=>{instHid=true;hideInst();};
 $("#instNever").onclick=()=>{LSs("an8inst","no");hideInst();};}
addEventListener("beforeinstallprompt",e=>{e.preventDefault();dip=e;showInst();});
addEventListener("appinstalled",()=>{dip=null;hideInst();});
$("#ai").onclick=()=>{$("#opm").classList.remove("show");LSs("an8inst","");instHid=false;if(dip)showInst(true);else showInst(true);};
$("#af").onclick=function(){autoFs=!autoFs;LSs("an8fs",autoFs?"sim":"no");this.setAttribute("aria-pressed",autoFs);this.textContent="⛶ Tela cheia automática: "+(autoFs?"sim":"não");};
$("#af").textContent="⛶ Tela cheia automática: "+(autoFs?"sim":"não");$("#af").setAttribute("aria-pressed",autoFs);
document.addEventListener("pointerdown",ev=>{if(!ev.isTrusted||!autoFs||document.fullscreenElement||standalone())return;
 try{const r=document.documentElement.requestFullscreen();if(r&&r.catch)r.catch(()=>{});}catch(e){}},{once:true});
setTimeout(()=>showInst(),1500);

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
