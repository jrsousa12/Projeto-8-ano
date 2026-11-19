/* ---------- ligação pergunta → figura ----------
   Chave: o enunciado da pergunta, igual ao do banco. Valor: [molde, quando].
   Moldes: "sim:estrela", "sim:aguaviva", "sim:planaria", "sim:minhoca", "sim:esponja" (simetria);
           "meta:ins" (completa), "meta:gaf" (incompleta), "meta:sapo" (sapo). Ver figuras-perguntas.js.
   quando: "antes" = o desenho aparece com a pergunta e a resposta (linhas e legenda) só depois;
           "tarde" = o desenho inteiro só aparece depois da resposta.
   O teste t_figuras confere que cada enunciado existe num banco e que cada molde existe.
   As perguntas da tela "Metamorfose" ficam sem figura: a animação já está logo acima delas. */
const FQLIG={
"Qual é a simetria do corpo dos cnidários?":["sim:aguaviva","antes"],
"Qual destes grupos tem simetria radial quando adulto?":["sim:aguaviva","tarde"],
"Como é a simetria dos equinodermos adultos?":["sim:estrela","antes"],
"Qual é a simetria dos equinodermos adultos?":["sim:estrela","antes"],
"Quanto à forma do corpo, a maioria das esponjas…":["sim:esponja","antes"],
"Qual é a simetria do corpo dos platelmintos?":["sim:planaria","antes"],
"Qual é a simetria dos anelídeos?":["sim:minhoca","antes"],
"Como se chama o filhote de inseto de metamorfose completa que lembra um verme?":["meta:ins","tarde"],
"Qual fase NÃO existe na metamorfose completa?":["meta:ins","tarde"],
"Qual inseto tem metamorfose completa?":["meta:ins","tarde"],
"Em qual fase a borboleta fica imóvel, dentro da crisálida?":["meta:ins","tarde"],
"O que é metamorfose?":["meta:ins","tarde"],
"Qual é a ordem das fases da metamorfose completa?":["meta:ins","tarde"],
"Qual destes insetos faz metamorfose completa?":["meta:ins","tarde"],
"Em qual fase da metamorfose completa o inseto mais se alimenta?":["meta:ins","tarde"],
"Como é a metamorfose do mosquito Aedes aegypti?":["meta:ins","tarde"],
"Na metamorfose incompleta do gafanhoto, o filhote se chama...":["meta:gaf","tarde"],
"Qual animal tem fase de ninfa?":["meta:gaf","tarde"],
"Qual inseto faz metamorfose incompleta?":["meta:gaf","tarde"],
"Qual é a ordem correta do ciclo de vida do sapo?":["meta:sapo","tarde"],
"Qual destes vertebrados faz metamorfose?":["meta:sapo","tarde"],
"Na metamorfose do sapo, quem respira por brânquias?":["meta:sapo","tarde"],
"O que acontece com a cauda do girino de sapo?":["meta:sapo","tarde"],
"Por qual estrutura o girino respira?":["meta:sapo","tarde"]
};
