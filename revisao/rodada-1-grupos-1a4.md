# Revisão das perguntas — rodada 1 (15/11/2026)

Grupos: esponjas (poríferos), cnidários, platelmintos, nematódeos. 4 bancos por grupo (EXTRA, EXTRA2, BANK3, BANK4) = 120 perguntas.
Nada foi alterado no app. Correções só com o "sim" do dono.

Legenda: **A** = alternativa errada que pode ser defendida como certa; **B** = explicação confusa ou que contradiz outra parte do app; **C** = número a confirmar; **D** = só redação (baixo risco).

## Problemas mais sérios

1. **A — `BANK3.platelminto[8]`** "Qual doença é transmitida pelo contato com água contaminada de lagoas e rios?"
   Correta: Esquistossomose. Errada: **Ascaridíase**. O próprio app diz (`EXTRA.nematodeo[2]`, `BANK3.nematodeo[6]`) que a ascaridíase se pega com **água** contaminada. Um aluno pode defender essa alternativa.
   Sugestão: "Qual verminose se pega quando a larva entra pela pele, em água de lagoas e rios com caramujos?" (ou trocar "Ascaridíase" por "Teníase", que não vem da água).

2. **B — `BANK3.nematodeo[0]`**: a explicação "A cutícula protege o corpo, inclusive dos parasitas dentro do hospedeiro" dá a entender que a cutícula protege **contra** parasitas.
   Sugestão: "A cutícula protege o corpo. Nos vermes parasitas, ela ajuda a resistir dentro do corpo do hospedeiro."

## Números a confirmar (precisam de 2 fontes da lista)

3. **C — `BANK4.nematodeo[4]`**: "Cerca de 200 mil" ovos por dia da fêmea da lombriga. Não encontrei esse número no Ministério da Saúde, na Fiocruz nem na OPAS/OMS. Se não for confirmado, sugiro trocar por algo sem número exato ("Milhares de ovos por dia").
4. **C — `EXTRA2.nematodeo[1]`** (explicação): "a verminose intestinal humana mais disseminada no mundo". A OMS cita a lombriga entre as principais, mas a página dela não diz que é a primeira. Sugestão mais cautelosa: "É uma das verminoses intestinais mais comuns no mundo."

## Só redação (baixo risco)

5. **D — `EXTRA.cnidario[1]`** "Qual destes **cnidários**…": mas polvo e esponja, que estão entre as alternativas, não são cnidários. Sugestão: "Qual destes animais vive apenas como pólipo?"
6. **D — `BANK3.platelminto[2]`** "Qual destes **platelmintos**…": a lombriga não é platelminto. Mesma correção ("Qual destes vermes…").
7. **D — `EXTRA.porifero[0]` e `BANK3.porifero[6]`**: "espículas de **cálcio**". O certo é "de **calcário**" (carbonato de cálcio). O `G[0]` diz "minerais".
8. **D — `BANK4.porifero[3]`** a alternativa errada "Areia para o esqueleto": algumas esponjas colam grãos de areia no esqueleto. O risco é pequeno, mas dá para trocar por "Sangue".

## Sem problemas

As outras 112 perguntas estão coerentes entre si e com o resto do app (conferido com `node build/buscar.js`).

## Fontes consultadas
- OMS, infecções por helmintos transmitidos pelo solo: https://www.who.int/news-room/fact-sheets/detail/soil-transmitted-helminth-infections
- OPAS/OMS, helmintíases transmitidas pelo solo: https://www.paho.org/en/topics/soil-transmitted-helminthiasis
- Ministério da Saúde, folder "Verminoses": https://www.gov.br/saude/pt-br/campanhas-da-saude/2021/zoonoses/acesse-as-pecas/FolderVerminoses.pdf
