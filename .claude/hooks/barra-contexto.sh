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
