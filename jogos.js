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

/* ---------- confete ---------- */
const cv=$("#cf"),cx=cv.getContext("2d");let ps=[],run=false;
function fit(){cv.width=innerWidth;cv.height=innerHeight;}fit();addEventListener("resize",fit);
function burst(n){const cs=["#fbbf24","#f472b6","#38bdf8","#34d399","#a78bfa","#fb923c"];
 for(let i=0;i<n;i++)ps.push({x:innerWidth/2+(Math.random()-.5)*200,y:innerHeight*.35,vx:(Math.random()-.5)*14,vy:-Math.random()*13-3,s:5+Math.random()*7,r:Math.random()*6,vr:(Math.random()-.5)*.4,c:cs[i%cs.length],l:130+Math.random()*60});
 if(!run){run=true;requestAnimationFrame(loop);}}
function loop(){cx.clearRect(0,0,cv.width,cv.height);ps=ps.filter(p=>p.l>0);
 ps.forEach(p=>{p.vy+=.38;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;p.l--;cx.save();cx.translate(p.x,p.y);cx.rotate(p.r);cx.globalAlpha=Math.min(1,p.l/40);cx.fillStyle=p.c;cx.fillRect(-p.s/2,-p.s/3,p.s,p.s*.6);cx.restore();});
 if(ps.length)requestAnimationFrame(loop);else run=false;}

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
