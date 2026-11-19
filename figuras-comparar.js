/* ---------- figuras das perguntas: comparação lado a lado ----------
   Dois desenhos lado a lado (esquerda × direita). Mesmo formato dos moldes de simetria (figuras-perguntas.js):
   t = título, leg = legenda (só depois da resposta), s = desenho, r = rótulos (só depois da resposta).
   Nome do molde: "cmp:artro", "cmp:peixe", "cmp:temp", "cmp:resp", "cmp:cor", "cmp:col", "cmp:ovo", "cmp:pele". Qual pergunta usa qual molde fica no figuras-ligacao.js.
   Conferido em: Britannica ("How are insects different from arachnids?", arachnid, chondrichthyan)
   e nos textos do próprio app (grupos Artrópodes e Peixes, tela Temperatura do corpo).
   Respiração, coração e coluna: fatos já presentes nas perguntas do app; átrio, ventrículo e vértebras
   conferidos na Britannica (circulatory system: vertebrates e amphibians; vertebral column).
   Ovos e cobertura do corpo: fatos já presentes nos textos e perguntas do app (grupos Anfíbios, Répteis, Aves, Mamíferos, Peixes). */
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
 /* divisórias verticais para 3 ou 4 colunas */
 const divs=xs=>xs.map(x=>`<line x1="${x}" y1="22" x2="${x}" y2="98" stroke="currentColor" stroke-opacity=".25" stroke-dasharray="4 4"/>`).join("");
 const RESP=`stroke-width="2.2" fill="none" stroke-linecap="round"`;
 /* respiração: brânquias (filamentos vermelhos), pulmões, traqueias (tubos que se ramificam), pele úmida (minhoca) */
 const branq=[13,19,25,31,37].map(x=>`<path d="M${x} 62 q4 13 0 28" stroke="#dc2626" ${RESP}/>`).join("");
 const pulm=`<path d="M75 58 V70 M75 70 L68 76 M75 70 L82 76" stroke="#be185d" ${RESP}/><ellipse cx="66" cy="82" rx="7.5" ry="13" fill="#f9a8d4"/><ellipse cx="84" cy="82" rx="7.5" ry="13" fill="#f9a8d4"/>`;
 const traq=`<path d="M125 58 V96 M125 66 L113 74 M125 66 L137 74 M125 78 L111 88 M125 78 L139 88 M113 74 L109 82 M137 74 L141 82" stroke="#a16207" ${RESP}/>`;
 const pele=`<path d="M156 84 q5 -7 10 0 t10 0 t10 0" stroke="#f472b6" stroke-width="7" fill="none" stroke-linecap="round"/>`+
  [[162,70],[176,66],[188,72]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.2" fill="#38bdf8"/>`).join("")+`<text x="175" y="60" text-anchor="middle" class="pq">O₂</text>`;
 /* coração em caixas: átrios em cima (claros), ventrículos embaixo (escuros) */
 const cav=(x,y,w,h,cor)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="${cor}" stroke="#7f1d1d" stroke-width="1.5"/>`;
 const AT="#fca5a5",VE="#dc2626";
 const coracoes=cav(18,40,30,24,AT)+cav(18,66,30,28,VE)+
  cav(84,40,15,24,AT)+cav(101,40,15,24,AT)+cav(84,66,32,28,VE)+
  cav(151,40,15,24,AT)+cav(168,40,15,24,AT)+cav(151,66,15,28,VE)+cav(168,66,15,28,VE);
 const letras=[[33,56,"A"],[33,84,"V"],[91.5,56,"A"],[108.5,56,"A"],[100,84,"V"],[158.5,56,"A"],[175.5,56,"A"],[158.5,84,"V"],[175.5,84,"V"]].map(([x,y,t])=>tx(x,y,t)).join("");
 /* peixe com a coluna (vértebras) e o crânio à mostra × minhoca, só de anéis, sem ossos */
 const vert=`<ellipse cx="50" cy="60" rx="38" ry="17" fill="#bae6fd"/><path d="M14 60 L2 48 L4 60 L2 72 Z" fill="#bae6fd"/>`+
  [18,25,32,39,46,53,60].map(x=>`<rect x="${x}" y="56" width="5.5" height="8" rx="1.5" fill="#f8fafc" stroke="#475569" stroke-width="1"/>`).join("")+
  `<ellipse cx="74" cy="60" rx="9" ry="8" fill="#f8fafc" stroke="#475569" stroke-width="1.2"/><circle cx="77" cy="57" r="2" fill="#0f172a"/>`;
 const minh=[0,1,2,3,4,5,6,7,8].map(i=>`<ellipse cx="${116+i*8.5}" cy="${60+Math.sin(i*.8)*7}" rx="5.5" ry="7" fill="#f472b6" stroke="#be185d" stroke-width="1"/>`).join("");
 /* ovos: sem casca (massa gelatinosa na água) × com casca (em terra) × filhote no útero, ligado à placenta */
 const agua=`<path d="M6 100 q7 -5 14 0 t14 0 t14 0 t14 0" stroke="#38bdf8" stroke-width="2" fill="none"/>`;
 const gel=[[22,80],[32,76],[42,81],[27,89],[38,90],[33,83]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5" fill="#bae6fd" fill-opacity=".8" stroke="#7dd3fc"/><circle cx="${x}" cy="${y}" r="1.8" fill="#0f172a"/>`).join("");
 const ovoC=`<path d="M70 98 H130" stroke="#a16207" stroke-width="2"/><ellipse cx="100" cy="84" rx="11" ry="14" fill="#fef3c7" stroke="#a16207" stroke-width="2"/>`;
 const utero=`<ellipse cx="167" cy="82" rx="20" ry="16" fill="#fbcfe8" stroke="#be185d" stroke-width="1.5"/>`+
  `<path d="M160 88 q-6 -10 4 -14 q9 -3 9 6 q0 7 -7 9 Z" fill="#f9a8d4" stroke="#be185d" stroke-width="1.2"/><circle cx="168" cy="76" r="4" fill="#f9a8d4" stroke="#be185d" stroke-width="1.2"/>`+
  `<path d="M169 86 Q176 90 179 82" stroke="#be185d" stroke-width="1.5" fill="none"/><ellipse cx="181" cy="78" rx="4" ry="6" fill="#be185d"/>`;
 /* cobertura do corpo: penas, escamas, pelos e pele nua e úmida (um pedaço de cada, visto de perto) */
 const penas=[[12,70],[24,70],[36,70],[18,82],[30,82],[12,94],[24,94],[36,94]].map(([x,y])=>`<path d="M${x} ${y-8} Q${x+7} ${y} ${x} ${y+8} Q${x-7} ${y} ${x} ${y-8} Z M${x} ${y-8} V${y+8}" fill="#fde68a" stroke="#a16207" stroke-width="1"/>`).join("");
 const escamas=[64,72,80,88].map((y,i)=>[0,1,2,3].map(j=>`<path d="M${58+j*9+(i%2)*4.5} ${y} a5 5 0 0 0 10 0" fill="#86efac" stroke="#15803d" stroke-width="1.2"/>`).join("")).join("");
 const pelos=Array.from({length:22},(_,i)=>{const x=104+(i%11)*4,y=i<11?74:90;return `<path d="M${x} ${y} q3 6 1 12" stroke="#92400e" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;}).join("");
 const nua=`<rect x="155" y="66" width="40" height="32" rx="10" fill="#4ade80"/>`+[[164,74],[180,78],[170,88],[188,90]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.4" fill="#e0f2fe" stroke="#0284c7" stroke-width=".8"/>`).join("");
 const emjp=(x,y,ch)=>`<text x="${x}" y="${y}" text-anchor="middle" style="font-size:22px">${ch}</text>`;
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
   r:tx(50,108,"corpo continua quente","pq")+tx(50,120,"(endotérmico)","pq")+tx(150,108,"corpo esfria","pq")+tx(150,120,"(ectotérmico)","pq")},
  resp:{t:"Como os animais respiram",
   leg:"<b>Brânquias</b>: tiram da água o oxigênio dissolvido (peixes, girinos e a maioria dos crustáceos e moluscos aquáticos). <b>Pulmões</b>: tiram o oxigênio do ar (anfíbios adultos, répteis, aves e mamíferos; golfinhos e baleias sobem à superfície para respirar). <b>Traqueias</b>: tubinhos que levam o ar direto às células (insetos). <b>Pele fina e úmida</b>: a troca de gases acontece pela pele (minhoca; o sapo usa a pele e também os pulmões).",
   s:divs([50,100,150])+emj(25,46,"🐟")+branq+emj(75,46,"🐬")+pulm+emj(125,46,"🦗")+traq+pele+tx(25,134,"Peixe")+tx(75,134,"Golfinho")+tx(125,134,"Inseto")+tx(175,134,"Minhoca"),
   r:tx(25,112,"brânquias","pq")+tx(75,112,"pulmões","pq")+tx(125,112,"traqueias","pq")+tx(175,112,"pele úmida","pq")},
  cor:{t:"Cavidades do coração",
   leg:"Cada cavidade é uma “sala” do coração. <b>Átrio</b> (A): recebe o sangue que chega ao coração. <b>Ventrículo</b> (V): bombeia o sangue para fora. <b>Peixe</b>: 2 cavidades (1 átrio e 1 ventrículo). <b>Sapo</b> (anfíbio): 3 (2 átrios e 1 ventrículo); a maioria dos répteis também tem 3. <b>Aves e mamíferos</b>: 4 (2 átrios e 2 ventrículos), sem mistura do sangue rico com o sangue pobre em oxigênio. Jacarés e crocodilos também têm 4 cavidades, mas ainda há um pouco de mistura de sangue.",
   s:divs([66,133])+coracoes+tx(33,134,"Peixe")+tx(100,134,"Sapo")+tx(167,134,"Ave"),
   r:letras+tx(33,110,"2 cavidades","pq")+tx(100,110,"3 cavidades","pq")+tx(167,110,"4 cavidades","pq")+tx(167,121,"(e mamíferos)","pq")},
  col:{t:"Com coluna × sem coluna",
   leg:"<b>Vertebrado</b> (peixes, anfíbios, répteis, aves e mamíferos): tem coluna vertebral, uma fileira de peças chamadas vértebras (de osso ou, nos tubarões e raias, de cartilagem), e crânio. <b>Invertebrado</b> (exemplo: minhoca): não tem coluna vertebral. Não ter coluna não quer dizer não ter sustentação: a minhoca usa músculos e a pressão do líquido do corpo, o besouro tem um esqueleto por fora (exoesqueleto) e a estrela-do-mar tem placas de calcário por dentro da pele.",
   s:div+vert+minh+tx(50,134,"Vertebrado")+tx(150,134,"Invertebrado"),
   r:tx(50,104,"coluna vertebral","pq")+tx(50,116,"e crânio","pq")+tx(150,104,"sem coluna","pq")+tx(150,116,"e sem ossos","pq")},
  ovo:{t:"Como nasce o filhote",
   leg:"<b>Ovo sem casca dura</b> (anfíbios e muitos peixes): fica numa massa gelatinosa, posta na água ou em lugar bem úmido. <b>Ovo com casca</b> (aves e répteis): é posto em terra; a casca é calcária e dura nas aves e, em muitos répteis, flexível como couro. Quem nasce de ovo é <b>ovíparo</b>; até dois mamíferos, o ornitorrinco e a equidna, botam ovos. <b>Vivíparo</b> (a maioria dos mamíferos, como o cachorro e o ser humano): o filhote cresce dentro da mãe, no útero, ligado à placenta (órgão que alimenta o filhote na barriga da mãe), e nasce formado.",
   s:divs([66,133])+emj(33,46,"🐸")+gel+agua+emj(100,46,"🐔")+ovoC+emj(167,46,"🐶")+utero+tx(33,134,"Sapo")+tx(100,134,"Ave")+tx(167,134,"Mamífero"),
   r:tx(33,112,"sem casca","pq")+tx(33,123,"dura, na água","pq")+tx(100,112,"com casca","pq")+tx(100,123,"(em terra)","pq")+tx(167,112,"no útero","pq")+tx(167,123,"(placenta)","pq")},
  pele:{t:"O que cobre o corpo",
   leg:"<b>Penas</b>: só as aves têm; são de queratina (a mesma substância das unhas) e ajudam a voar e a guardar o calor. <b>Escamas</b>: nos peixes, cobertas de muco (camada escorregadia) e protegem o corpo; nos répteis, são secas, de queratina, e evitam a perda de água. <b>Pelos</b>: só os mamíferos têm; guardam o calor do corpo (isolamento térmico). <b>Pele nua, fina e úmida</b> (anfíbios): sem escamas, com glândulas que a mantêm úmida; por ela também entra parte do oxigênio.",
   s:divs([50,100,150])+emj(25,46,"🐦")+penas+emjp(64,44,"🐟")+emjp(86,44,"🦎")+escamas+emj(125,46,"🐱")+pelos+emj(175,46,"🐸")+nua+tx(25,134,"Ave")+tx(75,125,"Peixe e")+tx(75,137,"réptil")+tx(125,134,"Mamífero")+tx(175,134,"Anfíbio"),
   r:tx(25,112,"penas","pq")+tx(75,112,"escamas","pq")+tx(125,112,"pelos","pq")+tx(175,108,"pele nua","pq")+tx(175,118,"e úmida","pq")}
 };
})();
