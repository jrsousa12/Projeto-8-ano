# Receita: travas de leitura e barra de contexto

Duas proteções automáticas do Claude Code (não dependem de o Claude lembrar das regras).
Ficam em `.claude/settings.json` + `.claude/hooks/` do projeto. Referência pronta: `projeto-plataforma-de-fisica`.

## 1. Trava de arquivos enormes

Para arquivos de dados com linhas gigantes (ver detecção em `motor-questao.md`) ou gerados.
Só faz sentido **depois** de existir o motor de item único; o aviso da trava aponta para ele.

`.claude/settings.json` (juntar com o que já existir, nunca substituir):

```json
{
  "permissions": { "deny": ["Read(**/<padrão-dos-dados>)"] },
  "hooks": { "PreToolUse": [{ "matcher": "Bash", "hooks": [{ "type": "command",
    "command": "bash \"$CLAUDE_PROJECT_DIR/.claude/hooks/bloquear-bancos.sh\"" }] }] }
}
```

`.claude/hooks/bloquear-bancos.sh` (trocar `PADRAO` e o comando do aviso):

```bash
#!/bin/bash
# Impede ler os arquivos de dados com cat/grep/sed etc.; usar o motor de item único.
PADRAO='perguntas-[^ ]*\.js|figuras-animq-auto-dados\.js'
cmd=$(jq -r '.tool_input.command // ""')
if echo "$cmd" | grep -qE '\b(cat|grep|rg|sed|head|tail|less|more|awk|cut)\b' &&
   echo "$cmd" | grep -qE "$PADRAO"; then
  echo "Bloqueado: não ler os dados direto (gasta muitos tokens). Use: <comando do motor>" >&2
  exit 2
fi
exit 0
```

Testar antes de entregar (precisa de `jq`): leitura do dado → código 2; o motor e `ls` → 0.
```bash
t(){ echo "{\"tool_input\":{\"command\":\"$1\"}}" | bash .claude/hooks/bloquear-bancos.sh >/dev/null 2>&1; echo "$? <- $1"; }
t "grep x <arquivo-de-dados>"; t "<comando do motor>"; t "ls"
```

## 2. Barra de contexto

Mostra ao dono quanto da conversa já foi usado, para ele mesmo decidir `/compact` ou `/clear`.
No notebook, preferir instalar em `~/.claude/settings.json` (vale para todos os projetos); na nuvem, no projeto.

```json
{ "statusLine": { "type": "command",
  "command": "bash \"$CLAUDE_PROJECT_DIR/.claude/hooks/barra-contexto.sh\"" } }
```
(Global: copiar o script para `~/.claude/hooks/` e usar esse caminho no `command`.)

`barra-contexto.sh`:

```bash
#!/bin/bash
# Barra de status: modelo e quanto do contexto da conversa já foi usado.
j=$(cat)
modelo=$(echo "$j" | jq -r '.model.display_name // "?"')
pct=$(echo "$j" | jq -r '.context_window.used_percentage // empty' | cut -d. -f1)
if [ -z "$pct" ]; then echo "$modelo | contexto: ?"; exit 0; fi
aviso=""
[ "$pct" -ge 50 ] && aviso=" — pense em /compact"
[ "$pct" -ge 80 ] && aviso=" — use /compact ou /clear"
echo "$modelo | contexto: ${pct}%${aviso}"
```

Testar: `echo '{"model":{"display_name":"X"},"context_window":{"used_percentage":63}}' | bash barra-contexto.sh`.

## Avisos

- `chmod +x .claude/hooks/*.sh`; conferir o JSON com `jq -e . .claude/settings.json` (JSON quebrado desliga tudo).
- Só valem na **próxima sessão** (ou depois de o dono abrir `/hooks`); dizer isso ao dono.
- Registrar no `CLAUDE.md`, seção 8: "Travas e barra: `.claude/settings.json` + `.claude/hooks/`".
