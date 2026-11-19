#!/bin/bash
# Trava: este projeto (8º ano) não pode mudar nada no projeto de Física.
# Recusa gravar arquivos da Física e comandos de terminal que citem a pasta dela.
entrada=$(cat)
if printf '%s' "$entrada" | grep -qiE 'Projeto-Plataforma-de-Fisica|projeto-plataforma-de-fisica'; then
  echo "Bloqueado: nesta conversa só o projeto do 8º ano pode ser alterado. A Física não pode ser modificada." >&2
  exit 2
fi
exit 0
