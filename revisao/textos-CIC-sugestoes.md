# Revisão dos textos: Ciclos (CIC), sugestões de correção

Base: `revisao/textos-CIC.md` (9 avisos). Nada foi alterado no app; corrigir só com o "sim" do dono.
Textos em `extras.js` (`const CIC`): esquistossomose (`esq`), tênia (`ten`), lombriga (`lom`).

## 1. Números (conferidos em 2 fontes)

| Cartão | Texto do app | Resultado | Fontes |
|---|---|---|---|
| CIC.lom[4] | Lombriga adulta "pode medir mais de 20 cm" | Certo e cauteloso (a fêmea mede de 20 a 35 cm) | Fiocruz (Centro de Pesquisas René Rachou, tese T_75); Fiocruz (Cadernos de Saúde Pública) |
| CIC.lom[0] | Fêmea põe "milhares de ovos por dia" | Certo e cauteloso (as fontes dizem de 20 mil a 200 mil; por isso não pôr número) | Fiocruz; material da CAPES (eduCAPES) |
| CIC.ten[3] | Tênia "pode ter vários metros" | Certo (tênia do porco: 1,5 a 4 m; do boi: 4 a 12 m) | APTA (Governo de SP); eduCAPES |

Nenhuma mudança nos números. Observação: o site do Ministério da Saúde (gov.br) não abriu nesta sessão (rede bloqueada); as fontes acima vieram da Fiocruz e de órgãos públicos.

## 2. Termos técnicos (7 avisos)

- **larva** (CIC.esq[1]): "...cada ovo libera uma larva (forma jovem do verme) cheia de cílios (pelinhos que ajudam a nadar), o miracídio, ..."
- **hospedeiro intermediário** (CIC.esq[2]): "...o hospedeiro intermediário (animal onde o verme passa uma fase da vida antes de chegar à pessoa)."
- **larvas** (CIC.ten[2] e CIC.lom[2]): cada ciclo é uma tela separada, então explicar em cada uma (como no DIS): "larvas (formas jovens do verme)".
- **miracídio, cercárias, cisticercos** (títulos): já são explicados logo abaixo, na descrição do mesmo cartão. Sugestão: não mudar (aviso falso, porque o motor lê o título antes da descrição).

## 3. Frase longa (CIC.ten[4], 26 palavras)

"Se a pessoa engole ovos da tênia do porco, os cisticercos se formam no corpo dela. Os ovos vêm de água, verduras ou mãos sujas. Às vezes chegam até ao cérebro. É uma doença grave."

## 4. Saúde (sugestão extra, sem aviso do motor)

Acrescentar ao fim dos 3 cartões "Como prevenir" (CIC.esq[5], CIC.ten[5], CIC.lom[5]): "Com sintomas, procure uma Unidade de Saúde." (mesma frase do DIS e de `BANK4.nematodeo[6]`). Nenhum remédio é citado.
