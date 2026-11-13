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
