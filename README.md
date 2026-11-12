# Projeto-8-ano

Aplicativo de Ciências do 8º ano: **Animais (invertebrados e vertebrados)**. Funciona no navegador e no celular, sem internet depois da primeira visita. Instruções de instalação para a turma: veja o `LEIA-ME.txt`.

## Arquivos

| Arquivo | Para que serve |
|---|---|
| `index.html` | Telas do app |
| `style.css` | Visual (cores, tamanhos, animações) |
| `tema-claro.css` | Tema claro (gerado por `build/tema_claro.py` a partir do `style.css`) |
| `util.js` | Funções usadas pelo app e pelo editor (identificador das perguntas) |
| `banco-proprio.js` | **Perguntas do professor** e perguntas ocultadas (gerado pelo editor) |
| `editor.html`, `editor.js`, `editor.css` | Editor de questões para o professor |
| `FONTES-CONFIAVEIS.md` | Fontes confiáveis para conferir e corrigir o conteúdo |
| `CLAUDE.md` | Regras para o Claude ao editar o app (inclui a pesquisa padrão nessas fontes) |
| `dados.js` | **Conteúdo**: os 13 grupos, todas as perguntas, fauna do Pará, doenças e atividades práticas |
| `app.js` | Funcionamento do app (jogos, estrelas, perfis, telas) |
| `extras.js` | Curiosidade da tela inicial, aba Naturalistas (retratos desenhados no app), aba Ciclos dos vermes (animação passo a passo) e tela de Fontes |
| `progresso.js` | Meu progresso: caderno de erros, desempenho por tema, treino inteligente, simulado, ranking, continuar de onde parou e código para levar o progresso a outro aparelho |
| `animais-8ano.html` | O app inteiro em um só arquivo, para abrir direto ou mandar por WhatsApp (gerado automaticamente) |
| `manifest.webmanifest`, `sw.js`, `icon-*.png` | Instalação no celular e uso sem internet |
| `validar-banco.js` | Confere as perguntas (gabarito, alternativas repetidas ou vazias, grupos inexistentes) |
| `testes/testes.js` | Testes de navegador: abrem o app no Chromium e conferem telas e jogos |
| `build/versao.py` | Recalcula a versão do cache do `sw.js` |
| `build/arquivo-unico.py` | Gera o `animais-8ano.html` |
| `.github/workflows/` | Conferências automáticas no GitHub (aba **Actions**) |

## Recursos do aluno (aba 📊 Meu progresso)

- **Caderno de erros:** toda pergunta errada (em qualquer desafio) entra no caderno. "Treinar com meus erros" refaz essas perguntas; cada uma sai depois de 2 acertos seguidos.
- **Desempenho por tema:** perguntas vistas e dominadas em cada um dos 13 grupos e nos desafios das abas, com botão para treinar só aquele tema.
- **Treino inteligente:** 10 perguntas com prioridade para as do caderno, as nunca vistas e as que o aluno não vê há tempo.
- **Simulado:** 20 perguntas de todos os temas em 20 minutos, sem dica e sem correção até o fim; a correção completa mostra também as que ficaram sem resposta. O relógio para quando o aluno sai da tela.
- **Continuar de onde parou:** o Desafio final, o caderno, o treino e o simulado guardam a rodada; ao voltar, o app pergunta se quer continuar.
- **Ranking e sequência 🔥:** melhores pontuações do Desafio final e do simulado neste aparelho, e contador de acertos seguidos.
- **Levar para outro aparelho:** o aluno copia um código (AN8-...) e cola no outro aparelho; vêm as estrelas, o caderno e o histórico.

Sem perfil ("Jogar sem salvar"), nada disso é gravado.

Em **⚙️ Opções**: som, **vibração** (celular), **tema** escuro, claro ou automático (segue o aparelho) e tela cheia. Os resultados do Desafio final, do treino e do simulado têm o botão **📤 Compartilhar resultado** (WhatsApp etc.; no computador, copia o texto).

## Editor de questões (para o professor)

Abra `editor.html` (no app: **⚙️ Opções → ✏️ Editor de questões**). Nele dá para:

- **criar** perguntas para o desafio de qualquer um dos 13 grupos, para o Desafio final ou para os desafios das abas;
- **editar** e **apagar** as suas perguntas;
- **ocultar** perguntas do app que você não quer usar (e mostrar de novo depois);
- usar uma pergunta do app **como modelo** para uma nova.

O trabalho fica salvo no aparelho. Para os alunos receberem: **⬇️ Gerar arquivo para os alunos** baixa o `banco-proprio.js`; envie-o ao GitHub (Add file → Upload files), substituindo o antigo. O GitHub confere as perguntas e atualiza a versão do app sozinho. **Exportar/Importar cópia (JSON)** serve para levar o trabalho para outro computador.

## Onde ficam as perguntas (`dados.js`)

- `G`: os 13 grupos. Cada um tem a pergunta principal `q` (`a` é a posição da correta, começando em 0).
- `EXTRA`, `EXTRA2`, `BANK3`: mais perguntas de cada grupo, no formato `["pergunta", ["correta", "errada", ...], "explicação"]`. **A primeira alternativa é sempre a correta**; o app embaralha ao mostrar.
- `QZ`: Desafio final, no formato `["pergunta", [alternativas], posição da correta, "explicação"]`.
- `MQ0` e `MQX`: mini desafios das abas (Temperatura, Metamorfose, Fauna do Pará, Verminoses). Primeira alternativa = correta.
- `AN`: animais do jogo Classifique (`["nome", "grupo"]`). `EMJ`: animais do jogo Quem é este?.
- `PA`: fauna do Pará. `DIS`: verminoses. `PR`: atividades práticas.
- `CUR`: curiosidades da tela inicial (`["grupo", "texto"]`). `NAT`: naturalistas. `FONTES` e `FONTES_MAIS`: tela de fontes.

Depois de editar, rode `node validar-banco.js` (precisa do Node.js). No GitHub, a mesma conferência roda sozinha.

## Automático no GitHub (aba Actions)

- **Validar app** (a cada envio): confere a sintaxe dos arquivos, as perguntas e roda os testes de navegador. Um X vermelho mostra qual passo falhou.
- **Atualizar versão do app** (só no `main`): recalcula a versão do cache do `sw.js`, para os celulares com o app instalado baixarem a versão nova, e gera de novo o `animais-8ano.html`. Se algo mudou, grava um commit automático.

Assim, dá para editar arquivos direto pelo site do GitHub sem rodar nada no computador.

## Rodar os testes no computador

```
npm install --no-save playwright@1.63.0
npx playwright install chromium
node testes/testes.js
```
