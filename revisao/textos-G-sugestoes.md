# Revisão dos textos: Grupos (G), sugestões de correção

Base: `revisao/textos-G.md` (37 avisos em 13 cartões). Nada foi alterado no app; corrigir só com o "sim" do dono.
Textos em `dados.js` (`const G`).

## 1. Número (conferido em 2 fontes)

| Cartão | Texto do app | Resultado | Fontes |
|---|---|---|---|
| G[8].k | "mais de 90%" das espécies de peixes são ósseos | Certo e cauteloso: só os teleósteos (um grupo de peixes ósseos) já são cerca de 96% dos peixes vivos. | Britannica (Bony fish); Animal Diversity Web (Actinopterygii) |

Sugestão: não mudar.

## 2. Palavra que pode exagerar (G[1], "Todos aquáticos")

Certo: todos os cnidários vivem na água (a hidra vive em água doce; o resto, quase todo no mar). Sugestão: não mudar (aviso falso).

## 3. Termos técnicos

### Avisos falsos (o termo já está explicado no próprio cartão ou é o nome do grupo)

- sésseis (G[0]): já tem "(vivem fixos no fundo)".
- ecdise (G[6]): já tem "Troca do exoesqueleto: muda ou ecdise".
- ectotérmicos (G[8]): já tem "temperatura varia com o ambiente".
- nematódeos (G[3]): é o nome do próprio cartão.
- regeneração (G[0].k): explicada na sugestão de G[0].r abaixo.

### Sugestões (explicação curta na 1ª vez em cada cartão)

| Cartão | Hoje | Sugestão |
|---|---|---|
| G[0].sub | As esponjas filtradoras | sem mudar (explicado em f[2]: "puxam água para se alimentar") |
| G[0].r | ...gemulação ou regeneração) ou sexuada, com larva de vida livre. | ...gemulação ou regeneração, quando uma parte forma um animal novo) ou sexuada, com larva (filhote bem diferente do adulto) de vida livre. |
| G[0].p | ...são bioindicadoras de poluição da água. | ...são bioindicadoras (sua presença mostra como está o ambiente) de poluição da água. |
| G[2].f[1] | Vida livre (água ou terra úmida) ou parasitas | Vida livre (água ou terra úmida) ou parasitas (vivem dentro de outro ser vivo e o prejudicam) |
| G[2].r | Planária: fecundação cruzada, divisão ou regeneração. ... Tênias: sexuada por autofecundação. | Planária: fecundação cruzada (dois animais trocam gametas), divisão ou regeneração (crescer de novo a partir de um pedaço). ... Tênias: sexuada por autofecundação (o mesmo animal fecunda a si mesmo). |
| G[2].p | ...bioindicadoras da qualidade da água. | ...bioindicadoras (sua presença mostra) da qualidade da água. |
| G[3].f[1] | Vida livre ou parasitas | Vida livre ou parasitas (vivem dentro de outro ser vivo) |
| G[4].r | ...são hermafroditas, com fecundação cruzada. ... fecundação externa e larvas. | ...são hermafroditas (têm os dois sexos), com fecundação cruzada (um fecunda o outro). ... fecundação externa e larvas (filhotes diferentes do adulto). |
| G[5].r | As minhocas são hermafroditas e fazem fecundação cruzada. | As minhocas são hermafroditas (têm os dois sexos), mas uma fecunda a outra (fecundação cruzada). |
| G[6].f[1] | Exoesqueleto de quitina | Exoesqueleto (esqueleto por fora do corpo) de quitina |
| G[6].r | ...ou com metamorfose. Crustáceos passam por vários estágios larvais. | ...ou com metamorfose (grande mudança de forma até virar adulto). Crustáceos passam por várias fases de larva. |
| G[7].r | ...os ovos eclodem em larvas. As estrelas-do-mar também se regeneram. | ...dos ovos saem larvas (filhotes diferentes do adulto). As estrelas-do-mar também se regeneram (refazem partes perdidas). |
| G[8].f[2] | Linha lateral capta vibrações na água | Linha lateral (faixa sensível nos lados do corpo) capta vibrações na água |
| G[8].f[3] | Ósseos: bexiga natatória e opérculo | Ósseos: bexiga natatória (bolsa com gás que ajuda a flutuar) e opérculo (tampa das brânquias) |
| G[8].f[4] | Cartilaginosos: fendas branquiais | Cartilaginosos: fendas branquiais (aberturas das brânquias, sem tampa) |
| G[8].p | São bioindicadores da qualidade do ambiente... | São bioindicadores (mostram como está o ambiente) da qualidade... |
| G[9].f[0] | Ectotérmicos | Ectotérmicos: temperatura varia com o ambiente |
| G[9].r | A maioria tem metamorfose. | A maioria tem metamorfose (ex.: girino vira sapo). |
| G[9].p | São bioindicadores e importantes... | São bioindicadores (mostram como está o ambiente) e importantes... |
| G[10].f[0] | Primeiros vertebrados adaptados... | Primeiros vertebrados (animais com coluna) adaptados... |
| G[10].f[2] | Respiram por pulmões; são ectotérmicos | Respiram por pulmões; são ectotérmicos (temperatura varia com o ambiente) |
| G[10].r | Algumas cobras e lagartos são vivíparos. | Algumas cobras e lagartos são vivíparos (o filhote se desenvolve dentro da mãe e nasce formado). |
| G[11].f[0] | Endotérmicas | Endotérmicas: mantêm o corpo quente sozinhas |
| G[12].f[3] | Endotérmicos, com gordura isolante sob a pele | Endotérmicos (mantêm o corpo quente sozinhos), com gordura isolante sob a pele |
| G[12].r | Eutérios têm placenta... | Eutérios têm placenta (órgão que alimenta o filhote na barriga da mãe)... |

Antes de aplicar: conferir com `node build/buscar.js` que as explicações batem com o resto do app e rodar o motor de novo.
