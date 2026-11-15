#!/bin/bash
# Ao abrir uma sessão na nuvem: garante o Playwright que os testes usam (testes/testes.js).
# Só instala se faltar. O Chromium já vem na nuvem; não rodar "playwright install".
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-.}"

if ! node -e 'require("playwright")' 2>/dev/null; then
  npm install -q --no-save playwright@1.63.0 \
    || echo "Aviso: não instalou o Playwright (rede?); os testes no navegador vão falhar." >&2
fi
