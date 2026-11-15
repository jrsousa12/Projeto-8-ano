---
name: protocolo-token
description: Aplica o protocolo de economia de tokens e contexto do dono a um projeto (novo ou já iniciado) e, no computador do dono, oferece instalá-lo para todos os projetos. Use quando o dono digitar /protocolo-token ou pedir "aplique o protocolo-token".
---

# /protocolo-token

Aplica as regras de `modelo-CLAUDE.md` (nesta mesma pasta) ao projeto atual.
Responder sempre em PT-BR simples: o dono é professor e não programa.

**Origem oficial**: repositório `jrsousa12/projeto-plataforma-de-fisica`, pasta `.claude/skills/protocolo-token/`. Se esta pasta não existir no projeto atual, buscar os arquivos de lá (`SKILL.md`, `modelo-CLAUDE.md`, `motor-teoria.md`, `motor-questao.md`, `travas-e-barra.md`) (GitHub) antes de seguir.

## Passo 1 — Onde estou?

- `CLAUDE_CODE_REMOTE=true` no ambiente → **nuvem**. Pular para o Passo 2.
- Caso contrário → **computador do dono (notebook)**. Fazer o Passo 1A.

### 1A. Instalação global (só no notebook)

Verificar `~/.claude/CLAUDE.md` e `~/.claude/skills/protocolo-token/`. Para o que faltar, **perguntar** ao dono (AskUserQuestion), explicando em uma frase cada:

1. **Arquivo global** `~/.claude/CLAUDE.md`: "faz as regras valerem em todos os projetos deste computador, sem copiar nada". Criar com as seções 1 a 10 do modelo + as linhas de **Público** e **Idioma** (sem o resto da seção 0, que é de cada projeto). Se o arquivo já existir: acrescentar só o que falta, nunca apagar.
2. **Comando global** `~/.claude/skills/protocolo-token/`: "faz o /protocolo-token funcionar em qualquer projeto deste computador". Copiar os cinco arquivos desta pasta.
3. **Barra de contexto global** (`~/.claude/settings.json`): "mostra embaixo quanto da conversa já foi usado, em todos os projetos". Seguir a parte 2 de `travas-e-barra.md`.

4. **Rede da nuvem** (indicação, não instalação): lembrar o dono de, no claude.ai, abrir Configurações → Ambientes e, no ambiente usado pelo projeto, deixar marcada a opção de liberar os sites de pacotes (pypi.org, npm). Sem ela, o gancho de início de sessão (`session-start.sh`) não consegue instalar o que faltar. Se o nome do ambiente tiver acento, sugerir tirar (ex.: "Plataforma de Fisica"): com acento, o Claude não consegue mudar a sessão para ele. Na nuvem, não insistir: o dono já recusou uma vez (15/11/2026) e prefere decidir pelo computador.

Se o dono recusar, seguir sem instalar.

## Passo 2 — O projeto já tem `CLAUDE.md` na raiz?

### Não (projeto novo)
1. Olhar só o essencial para preencher a seção 0: lista de arquivos da raiz, `README` (início), arquivos de build/teste (`package.json`, `requirements.txt`, `Makefile` etc.).
2. Criar `CLAUDE.md` a partir do modelo, preenchendo a seção 0. O que não der para descobrir, **perguntar** ao dono; não inventar.
3. Se o arquivo global já existir (Passo 1A), as seções 1 a 10 podem virar uma linha: "Segue o protocolo-token (`~/.claude/CLAUDE.md`)". Na nuvem, manter as seções completas, porque o global não existe lá.

### Sim (projeto já iniciado)
1. Ler o `CLAUDE.md` atual (só ele).
2. Comparar com o modelo e acrescentar **apenas** as regras que faltam, no lugar certo. Nunca apagar nem reescrever regras do dono; em conflito, perguntar.
3. Se passar de 200 linhas, propor mover trechos para `CLAUDE.md` de subpastas.

## Passo 3 — Arquivos acima do limite

Listar arquivos de código com mais de 300 linhas, ignorando dependências e gerados:

```bash
git ls-files | grep -vE '(node_modules|vendor|dist|\.min\.|\.lock|\.json$|\.md$)' \
  | xargs wc -l 2>/dev/null | awk '$1>300 && $2!="total"' | sort -rn | head -20
```

Mostrar a lista ao dono e **propor** (não executar) a divisão de cada um, ou registrá-lo como exceção tolerada no `CLAUDE.md`, conforme o dono decidir.

## Passo 3B — Motores e automações

1. Listar os scripts que o projeto já tem (pasta de build/ferramentas, `package.json` "scripts", `Makefile`) e registrá-los em "Comandos úteis" da seção 0, com uma frase cada.
2. Comparar com os tipos das seções 8 e 9 do modelo e com as tarefas que se repetem no projeto (ver histórico do git e notas do dono).
3. Dados em linhas enormes: rodar a detecção de `motor-questao.md` (nesta pasta). Se houver arquivo de dados com linha acima de ~2 000 caracteres e não existir motor de item único, incluí-lo na proposta, seguindo a receita.
4. Testes: ver se existem testes guardados por assunto e um jeito de rodar só os ligados ao que mudou; se faltar, incluir na proposta.
5. **Propor** (não criar) os motores que faltam, em lista curta: o que faria, quanto trabalho/tokens poupa. Criar só os que o dono aprovar, já pequenos e testados.

## Passo 3C — Motor de teoria (só em projeto com questões)

Se o projeto tiver banco de questões (quiz, simulado, provas), seguir `motor-teoria.md` (nesta pasta):
1. Ver se já existe motor que confere questões de teoria e de cálculo. Se existir um motor por área, propor juntar em um só, com fichas.
2. **Perguntar** ao dono: quais são as áreas e se o app embaralha as alternativas.
3. Ver também o motor de item único (`motor-questao.md`): quase todo banco de questões precisa dele para mexer em uma questão sem abrir o banco.
4. **Propor** o motor + as fichas (uma por área). Criar só com o plano aprovado, já com teste guardado e rodando o pente-fino no banco real.

## Passo 3D — Travas e barra de contexto

Seguir `travas-e-barra.md` (nesta pasta):
1. Se houver arquivos de dados com linhas enormes **e** motor de item único: **propor** a trava que impede o Claude de lê-los direto.
2. Se a barra de contexto não estiver instalada (nem global, nem no projeto): **propor** instalá-la.
3. Criar só o que o dono aprovar; testar os scripts antes e avisar que valem a partir da próxima sessão.

## Passo 4 — Levar o comando junto

Se o projeto não tiver `.claude/skills/protocolo-token/`, copiar os cinco arquivos (`SKILL.md`, `modelo-CLAUDE.md`, `motor-teoria.md`, `motor-questao.md`, `travas-e-barra.md`) para lá, para que o `/protocolo-token` funcione nas próximas sessões desse projeto (inclusive na nuvem).

## Passo 5 — Fechar

- Resumo curto em PT-BR: o que foi criado/alterado e o que ficou pendente de decisão.
- Commit/push só seguindo as regras de branch da sessão; mensagem em PT-BR.
- Mostrar ao dono as dicas da seção 10 do modelo (lista curta).
- Lembrar: ao trocar de assunto depois disso, usar `/clear`.
