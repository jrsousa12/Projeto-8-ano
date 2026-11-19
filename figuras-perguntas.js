/* ---------- figuras das perguntas: moldes de desenho ----------
   Cada molde devolve o desenho de uma pergunta. Qual pergunta usa qual molde fica no figuras-ligacao.js.
   "antes": aparece com a pergunta (sem dar a resposta); a parte com classe "fqr" e a legenda só aparecem depois da resposta.
   "tarde": o desenho inteiro só aparece depois da resposta (porque mostraria a resposta).
   Conferido em: Britannica (radial symmetry, cnidarian, echinoderm) e Animal Diversity Web (Cnidaria).
   As etapas da metamorfose são as mesmas da tela "Metamorfose" (MS, em simulacoes.js). */
const FQ=(()=>{
 const V='viewBox="0 0 200 140"';
 const eixo=(x1,y1,x2,y2)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
 const raio=(n,r,a0)=>Array.from({length:n},(_,k)=>{const a=(a0+k*360/n)*Math.PI/180;return [100+r*Math.cos(a),70+r*Math.sin(a)];});
 const eixos=(n,r)=>raio(n,r,-90).map(([x,y])=>eixo(x.toFixed(1),y.toFixed(1),(200-x).toFixed(1),(140-y).toFixed(1))).join("");
 const lado=(x,y,t,anc)=>`<text x="${x}" y="${y}" text-anchor="${anc||"middle"}">${t}</text>`;
 const estrela=()=>{const p=[];for(let k=0;k<10;k++){const r=k%2?22:58,a=(-90+k*36)*Math.PI/180;p.push((100+r*Math.cos(a)).toFixed(1)+","+(70+r*Math.sin(a)).toFixed(1));}return p.join(" ");};
 const SIM={
  /* estrela-do-mar adulta: 5 braços, 5 linhas que passam pelo centro */
  estrela:{t:"Estrela-do-mar adulta vista de cima",leg:"<b>Simetria radial</b> (em geral com 5 partes): as partes iguais ficam ao redor do centro, como os raios de uma roda.",
   s:`<polygon points="${estrela()}" fill="#fb923c" stroke="#c2410c" stroke-width="3" stroke-linejoin="round"/>${raio(5,36,-90).map(([x,y])=>`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="#fed7aa"/>`).join("")}<circle cx="100" cy="70" r="7" fill="#fdba74"/>`,
   r:`<g class="fqe">${eixos(5,66)}</g>`},
  /* água-viva vista de cima: corpo em forma de sino, 4 braços e tentáculos na borda */
  aguaviva:{t:"Água-viva vista de cima",leg:"<b>Simetria radial</b>: várias linhas passando pelo centro dividem o corpo em partes iguais.",
   s:`${raio(16,52,0).map(([x,y])=>`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="#c4b5fd"/>`).join("")}<circle cx="100" cy="70" r="50" fill="#a5b4fc" opacity=".85" stroke="#6366f1" stroke-width="2"/>${raio(4,22,45).map(([x,y])=>`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9" fill="none" stroke="#f0abfc" stroke-width="4"/>`).join("")}<path d="M100 54V86M84 70H116" stroke="#e879f9" stroke-width="5" stroke-linecap="round"/>`,
   r:`<g class="fqe">${eixos(4,66)}${raio(4,66,-45).map(([x,y])=>eixo(x.toFixed(1),y.toFixed(1),(200-x).toFixed(1),(140-y).toFixed(1))).join("")}</g>`},
  /* planária vista de cima, cabeça para cima: uma só linha, ao longo do corpo */
  planaria:{t:"Planária vista de cima",leg:"<b>Simetria bilateral</b>: uma só linha, da cabeça à cauda, divide o corpo em lado direito e lado esquerdo, parecidos como num espelho.",
   s:`<path d="M100 10 Q112 12 122 22 Q114 26 112 34 Q116 70 108 122 Q100 134 92 122 Q84 70 88 34 Q86 26 78 22 Q88 12 100 10Z" fill="#a8a29e" stroke="#57534e" stroke-width="2.5"/><circle cx="94" cy="24" r="3" fill="#fff"/><circle cx="106" cy="24" r="3" fill="#fff"/><circle cx="94" cy="24" r="1.5" fill="#111"/><circle cx="106" cy="24" r="1.5" fill="#111"/>`,
   r:`<g class="fqe">${eixo(100,4,100,136)}</g>${lado(86,80,"lado esquerdo","end")}${lado(114,80,"lado direito","start")}`},
  /* minhoca vista de cima, cabeça para a direita: a linha corre ao longo do corpo */
  minhoca:{t:"Minhoca vista de cima (cabeça à direita)",leg:"<b>Simetria bilateral</b>: uma só linha, ao longo do corpo, separa o lado direito do lado esquerdo.",
   s:`<rect x="16" y="58" width="168" height="24" rx="12" fill="#f9a8d4" stroke="#be185d" stroke-width="2"/>${Array.from({length:15},(_,k)=>`<path d="M${30+k*10} 59V81" stroke="#db2777" stroke-width="1.2"/>`).join("")}<rect x="134" y="57" width="22" height="26" rx="6" fill="#f472b6"/>`,
   r:`<g class="fqe">${eixo(6,70,194,70)}</g>${lado(100,46,"lado esquerdo")}${lado(100,104,"lado direito")}`},
  /* esponja: forma irregular, sem linha que a divida em partes iguais */
  esponja:{t:"Esponja (porífero)",leg:"<b>Sem simetria definida</b>: a forma é irregular, e nenhuma linha divide o corpo em partes iguais.",
   s:`<path d="M60 128 Q50 96 58 70 Q52 44 66 26 Q76 18 82 34 Q86 50 96 44 Q104 16 120 22 Q132 30 124 56 Q140 62 146 86 Q150 112 136 128Z" fill="#facc15" stroke="#a16207" stroke-width="2.5"/><ellipse cx="74" cy="30" rx="6" ry="3" fill="#713f12"/><ellipse cx="114" cy="26" rx="7" ry="3.5" fill="#713f12"/><ellipse cx="136" cy="70" rx="5" ry="2.5" fill="#713f12"/>${[[72,70],[90,92],[110,80],[124,104],[80,110],[100,62],[70,94],[118,50]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.2" fill="#ca8a04"/>`).join("")}`,
   r:""}
 };
 const META={ins:"Metamorfose completa (exemplo: borboleta)",gaf:"Metamorfose incompleta (exemplo: gafanhoto)",sapo:"Metamorfose do sapo"};
 const molde=nome=>{const [tipo,k]=nome.split(":");if(tipo==="sim")return SIM[k]?{tipo,k}:null;if(tipo==="meta")return META[k]&&typeof MS!=="undefined"&&MS[k]?{tipo,k}:null;return null;};
 function htmlSim(k,tarde){const m=SIM[k];
  return `<figure class="fq${tarde?" tarde":""}" data-fq="sim:${k}"><svg ${V} role="img" aria-label="${m.t}">${m.s}<g class="fqr">${m.r}</g></svg><figcaption><span class="fqt">${m.t}</span><span class="fqleg">${m.leg}</span></figcaption></figure>`;}
 function htmlMeta(k){
  return `<figure class="fq tarde" data-fq="meta:${k}"><div class="fqst"></div><figcaption><span class="fqt">${META[k]}</span><span class="fqleg"><b class="fqet"></b> <span class="fqed"></span></span><span class="fqdots"></span></figcaption></figure>`;}
 /* passo a passo da metamorfose: troca a etapa a cada 2,6 s e para na última; os botões escolhem a etapa */
 function tocar(fig){const L=MS[fig.dataset.fq.split(":")[1]];let i=0,tm=null;
  const pinta=()=>{fig.querySelector(".fqst").innerHTML=L[i].s;fig.querySelector(".fqet").textContent=L[i].t;fig.querySelector(".fqed").textContent=L[i].d;
   fig.querySelectorAll(".fqdots button").forEach((b,j)=>b.classList.toggle("on",j===i));};
  fig.querySelector(".fqdots").innerHTML=L.map((x,j)=>`<button type="button" class="dot" data-i="${j}">${x.t.replace(/^\d+\.\s*/,"").replace(/\s*\(.*\)/,"")}</button>`).join("");
  fig.querySelectorAll(".fqdots button").forEach(b=>b.onclick=()=>{clearInterval(tm);i=+b.dataset.i;pinta();});
  pinta();tm=setInterval(()=>{if(!fig.isConnected||i>=L.length-1){clearInterval(tm);return;}i++;pinta();},2600);}
 return {
  /* põe a figura da pergunta antes das alternativas (ou nada, se a pergunta não tem figura) */
  por(antesDe,texto){const L=typeof FQLIG!=="undefined"&&FQLIG[String(texto).trim()];if(!L||!antesDe)return null;
   const [nome,quando]=L,m=molde(nome);if(!m)return null;
   const d=document.createElement("div");d.innerHTML=m.tipo==="sim"?htmlSim(m.k,quando==="tarde"):htmlMeta(m.k);
   const fig=d.firstChild;antesDe.parentNode.insertBefore(fig,antesDe);return fig;},
  /* depois da resposta: mostra as linhas, a legenda e a animação */
  revelar(caixa){if(!caixa)return;caixa.querySelectorAll(".fq:not(.rev)").forEach(f=>{f.classList.add("rev");if(f.dataset.fq.startsWith("meta:"))tocar(f);});},
  molde,SIM,META};
})();
