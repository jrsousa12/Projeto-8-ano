# Revisão dos textos: Doenças (DIS), sugestões de correção

Base: `revisao/textos-DIS.md` (16 avisos). Nada foi alterado no app; corrigir só com o "sim" do dono.

## 1. Datas (conferidas em 2 fontes)

| Cartão | Texto do app | Resultado | Fontes |
|---|---|---|---|
| DIS[4] | OMS reconheceu a eliminação em 2024 | Certo | OMS (notícia de 01/10/2024); Fiocruz (10/2024); OPAS (11/11/2024) |
| DIS[4] | Último caso confirmado em 2017 | Certo, com ajuste fino: as fontes falam em "último caso de **transmissão** registrado" | Fiocruz; Ministério da Saúde (BVS) |
| DIS[4] | Transmissão em Belém nos anos 1950 | Certo (inquérito nacional dos anos 1950: 11 cidades, Belém com o maior índice) | Ministério da Saúde, Síntese Epidemiológica da Filariose (2006); Agência Fiocruz |

Sugestão para DIS[4][4]: "...o último caso de transmissão registrado foi em 2017."
Opcional para DIS[4][5]: "Curiosidade: Belém (PA) e Recife (PE) foram os maiores focos da doença no Brasil desde os anos 1950."

## 2. Saúde (4 avisos)

Acrescentar ao fim da prevenção de DIS[1], DIS[2], DIS[3] e DIS[4]: "Com sintomas, procure uma Unidade de Saúde." (mesma frase já usada em `BANK4.nematodeo[6]`). Nenhum remédio é citado.

## 3. Termos técnicos (8 avisos)

- **parasita** (DIS[0][3], 1ª vez nos cartões): "O parasita (ser vivo que vive à custa de outro e o prejudica) passa por..."
- **larvas** (DIS[1][3], 1ª vez): "...mal cozida com larvas (formas jovens do verme)." Nos cartões seguintes, deixar como está.
- **Nematódeo** (campo de grupo de DIS[2], [3], [4]): é só o nome do grupo, explicado no cartão dos Nematódeos. Sugestão: não mudar e acrescentar a palavra à lista de termos conhecidos em `build/fichas/textos.json`, para o motor parar de avisar.

## 4. Frase longa (DIS[1][4], 27 palavras)

"Comer só carne bem cozida e com selo de inspeção. Lavar as mãos e ter saneamento básico. Impedir que porcos e bois tenham acesso a fezes humanas."
