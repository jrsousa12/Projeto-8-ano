# Revisão dos textos: Fauna do Pará (PA), sugestões de correção

Base: `revisao/textos-PA.md` (4 avisos em 12 cartões). Nada foi alterado no app; corrigir só com o "sim" do dono.
Textos em `dados.js` (`const PA`).

## 1. Erro encontrado: o boto não é "exclusivo da bacia amazônica" (PA[0])

O boto-cor-de-rosa (*Inia geoffrensis*) vive nas bacias do Amazonas **e do Orinoco** (Venezuela e Colômbia). Fontes: Animal Diversity Web, Britannica, artigo do Instituto Mamirauá sobre mercúrio em botos "das bacias do Amazonas e do Orinoco".

Sugestão: "Golfinho de água doce dos rios da Amazônia (e também da bacia do rio Orinoco, na Venezuela e na Colômbia). É mamífero: respira ar pelos pulmões e amamenta os filhotes."
Versão mais curta: "Golfinho de água doce que vive nos rios da Amazônia. É mamífero: …"

Nenhuma outra parte do app diz "exclusivo" sobre o boto (`buscar.js`).

## 2. Números (conferidos em 2 fontes)

| Cartão | Texto do app | Resultado | Fontes |
|---|---|---|---|
| PA[2] | Pirarucu "pode passar de 2 metros" | Certo: chega a cerca de 3 m (Britannica, INPA/Acta Amazonica); Mamirauá registrou 2,9 m. A forma "pode passar de 2 metros" já é cautelosa e combina com `QZ[66]`, `QZ[138]` e `BANK3`. Sem mudança. | Britannica; Acta Amazonica (INPA); Instituto Mamirauá |
| PA[6] | Harpia: "as asas abertas podem passar de 2 metros" | As fontes divergem: "até 2 m" (Britannica, verbete principal) e "média de 2 m" (Animal Diversity Web); outra página da Britannica fala em até 2,24 m. Pela regra, usar a forma mais cautelosa. | Britannica; Animal Diversity Web |

Sugestão para PA[6]: "…as asas abertas chegam a cerca de 2 metros."

## 3. Termo técnico (PA[6], "endotérmica")

Sugestão: "Ave endotérmica (mantém o corpo quente sozinha), de penas e ossos leves." (mesma explicação de `G[11]` e `G[12]`).

## 4. Os outros 9 cartões

Lidos um a um. Conferidos:
- Onça-pintada: maior felino das Américas (IUCN, Britannica) e terceiro maior do mundo, depois do tigre e do leão (Smithsonian/STRI; Britannica confirma tigre e leão como os maiores).
- Guará: a população mais numerosa do Brasil fica no norte (Amapá e litoral do Pará e do Maranhão) (ICMBio).

Sem mudança nos outros. Observação: em PA[2], "urucu" e "urucum" são o mesmo termo; o app usa "urucum", mais conhecido. Sem mudança.

## Fontes desta revisão

- Animal Diversity Web: *Inia geoffrensis*, *Arapaima gigas*, *Harpia harpyja*
- Encyclopaedia Britannica: Amazon river dolphin, pirarucu, harpy eagle, jaguar
- Instituto Mamirauá (artigos sobre boto e pirarucu); Acta Amazonica (INPA)
- IUCN Red List (*Panthera onca*); Smithsonian Tropical Research Institute
- ICMBio (guias de aves e avaliação do guará)
Todas já estão na lista de `FONTES-CONFIAVEIS.md`; nenhuma fonte nova a acrescentar no app.
