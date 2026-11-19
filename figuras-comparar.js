/* ---------- figuras das perguntas: comparação lado a lado ----------
   Dois desenhos lado a lado (esquerda × direita). Mesmo formato dos moldes de simetria (figuras-perguntas.js):
   t = título, leg = legenda (só depois da resposta), s = desenho, r = rótulos (só depois da resposta).
   Nome do molde: "cmp:artro", "cmp:peixe", "cmp:temp". Qual pergunta usa qual molde fica no figuras-ligacao.js.
   Conferido em: Britannica ("How are insects different from arachnids?", arachnid, chondrichthyan)
   e nos textos do próprio app (grupos Artrópodes e Peixes, tela Temperatura do corpo). */
const FQCMP=(()=>{
 const tx=(x,y,t,c)=>`<text x="${x}" y="${y}" text-anchor="middle"${c?` class="${c}"`:""}>${t}</text>`;
 const div=`<line x1="100" y1="22" x2="100" y2="94" stroke="currentColor" stroke-opacity=".25" stroke-dasharray="4 4"/>`;
 const COR="#a16207",PERNA=`stroke="${COR}" stroke-width="2" fill="none" stroke-linecap="round"`;
 /* inseto visto de cima: cabeça, tórax e abdômen; 3 pares de patas saindo do tórax; 1 par de antenas na cabeça */
 const inseto=()=>{let p="";[52,58,64].forEach((y,i)=>{const d=[-8,0,8][i];
   p+=`<polyline points="44,${y} 34,${y-4+d/2} 28,${y+d}" ${PERNA}/><polyline points="56,${y} 66,${y-4+d/2} 72,${y+d}" ${PERNA}/>`;});
  return p+`<path d="M47 35 Q42 26 36 20 M53 35 Q58 26 64 20" ${PERNA}/>`+
   `<circle cx="50" cy="40" r="7" fill="${COR}"/><ellipse cx="50" cy="58" rx="6.5" ry="9" fill="#ca8a04"/><ellipse cx="50" cy="84" rx="9.5" ry="15" fill="${COR}"/>`;};
 /* aranha vista de cima: cefalotórax e abdômen; 4 pares de patas saindo do cefalotórax; sem antenas */
 const aranha=()=>{let p="";[42,48,54,60].forEach((y,i)=>{const d=[-14,-5,5,14][i];
   p+=`<polyline points="142,${y} 128,${y-8+d/2} 120,${y+d}" ${PERNA}/><polyline points="158,${y} 172,${y-8+d/2} 180,${y+d}" ${PERNA}/>`;});
  return p+`<ellipse cx="150" cy="51" rx="9" ry="11" fill="#ca8a04"/><ellipse cx="150" cy="80" rx="13" ry="17" fill="${COR}"/>`;};
 /* peixe ósseo (à esquerda): opérculo, a tampa curva atrás da cabeça */
 const osseo=`<path d="M18 60 L4 47 L6 60 L4 73 Z" fill="#0ea5e9"/><ellipse cx="50" cy="60" rx="34" ry="16" fill="#38bdf8"/>`+
  `<path d="M42 45 Q50 36 60 45" fill="#0ea5e9"/><circle cx="74" cy="56" r="2.6" fill="#0f172a"/>`+
  `<path d="M64 46 Q71 60 64 74" stroke="#0369a1" stroke-width="2.5" fill="none"/>`;
 /* peixe cartilaginoso (tubarão, à direita): fendas das brânquias à mostra, sem tampa */
 const tubarao=`<path d="M104 42 L122 57 Q150 47 182 54 Q194 59 182 64 Q150 72 122 63 L111 71 L116 60 Z" fill="#94a3b8"/>`+
  `<path d="M146 50 L152 36 L160 50 Z" fill="#94a3b8"/><circle cx="182" cy="57" r="2.2" fill="#0f172a"/>`+
  [160,164,168,172,176].map(x=>`<line x1="${x}" y1="56" x2="${x-1}" y2="64" stroke="#334155" stroke-width="1.6"/>`).join("");
 /* termômetro: nível de 0 a 1 */
 const termo=(x,n,cor)=>`<rect x="${x-4}" y="30" width="8" height="54" rx="4" fill="none" stroke="currentColor" stroke-width="1.5"/>`+
  `<rect x="${x-2}" y="${84-50*n}" width="4" height="${50*n}" fill="${cor}"/><circle cx="${x}" cy="88" r="6" fill="${cor}"/>`;
 const emj=(x,y,ch)=>`<text x="${x}" y="${y}" text-anchor="middle" style="font-size:34px">${ch}</text>`;
 return {
  artro:{t:"Inseto × aranha (vistos de cima)",
   leg:"<b>Inseto</b>: corpo em 3 partes (cabeça, tórax e abdômen), 3 pares de patas (6 patas) e 1 par de antenas. <b>Aranha</b> (um aracnídeo): corpo em 2 partes (cefalotórax, que é a cabeça unida ao tórax, e abdômen), 4 pares de patas (8 patas) e nenhuma antena.",
   s:div+inseto()+aranha()+tx(50,134,"Inseto")+tx(150,134,"Aranha"),
   r:tx(50,112,"3 partes · 6 patas","pq")+tx(50,122,"2 antenas","pq")+tx(150,112,"2 partes · 8 patas","pq")+tx(150,122,"sem antenas","pq")},
  peixe:{t:"Peixe ósseo × peixe cartilaginoso",
   leg:"<b>Peixe ósseo</b> (exemplo: tambaqui): esqueleto de osso e opérculo, a tampa que cobre as brânquias. <b>Peixe cartilaginoso</b> (exemplo: tubarão e raia): esqueleto de cartilagem (material firme e flexível, como o da orelha) e fendas branquiais (aberturas das brânquias) à mostra, sem tampa.",
   s:div+osseo+tubarao+tx(50,134,"Ósseo")+tx(150,134,"Cartilaginoso"),
   r:`<path d="M66 76 L60 96" stroke="currentColor" stroke-width="1"/><path d="M170 66 L160 96" stroke="currentColor" stroke-width="1"/>`+
    tx(50,106,"opérculo (tampa)","pq")+tx(50,118,"esqueleto de osso","pq")+tx(150,106,"fendas à mostra","pq")+tx(150,118,"esqueleto de cartilagem","pq")},
  temp:{t:"No mesmo dia frio: ave × lagarto",
   leg:"<b>Endotérmico</b> (aves e mamíferos): o próprio corpo produz calor e mantém a temperatura mais ou menos constante, mesmo no frio. <b>Ectotérmico</b> (peixes, anfíbios e répteis): a temperatura do corpo varia com a do ambiente; no frio, o corpo esfria e o animal procura o calor do sol.",
   s:div+tx(100,16,"❄️ dia frio","pq")+emj(36,72,"🐦")+termo(76,.8,"#ef4444")+emj(136,72,"🦎")+termo(176,.25,"#3b82f6")+tx(50,134,"Ave")+tx(150,134,"Lagarto"),
   r:tx(50,108,"corpo continua quente","pq")+tx(50,120,"(endotérmico)","pq")+tx(150,108,"corpo esfria","pq")+tx(150,120,"(ectotérmico)","pq")}
 };
})();
