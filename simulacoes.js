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
