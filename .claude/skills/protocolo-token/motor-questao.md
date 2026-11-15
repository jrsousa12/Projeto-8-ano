# Receita: motor de item único (mostrar, buscar e alterar sem abrir o arquivo de dados)

Para projetos com arquivos de dados em **linhas enormes** (bancos de questões, JSON minificado, listas geradas).
Problema: `grep` pelo id devolve a linha inteira (ex.: 130 KB ≈ 35 mil tokens) e ler por intervalo de linhas não ajuda.
Exemplo pronto: `build/questao.py` + `build/t_questao.py` do projeto de física (Projeto-Plataforma-de-Fisica).

## Como detectar
```bash
git ls-files | grep -vE '(node_modules|vendor|dist|\.min\.|\.lock)' | while read f; do
  m=$(awk '{ if (length>m) m=length } END {print m+0}' "$f"); [ "$m" -gt 2000 ] && echo "$m $f"; done | sort -rn | head
```
Arquivo de dados editado à mão ou pelo Claude com linha acima de ~2 000 caracteres → propor o motor.

## Funcionalidades (todas com saída curta)
- **Mostrar**: `motor ID [ID...]` imprime só o item (formatado), com o arquivo e o banco de onde veio.
- **Campos**: `motor ID -c q,e` mostra só os campos pedidos.
- **Buscar**: `motor --busca texto` lista id + início do enunciado dos itens que contêm o texto, e o total.
- **Alterar texto**: `motor ID campo="valor"`.
- **Alterar como JSON**: `motor ID campo:=json` (números, listas, objetos; ex.: `a:=2`, `'o:=["A","B"]'`).
- **Apagar campo**: `motor ID -x campo`.
- Id inexistente, mais de um id ao alterar ou troca do próprio id → erro claro, nada é gravado.
- Ao alterar, imprime só "ID alterada em ARQUIVO: campos que mudaram". Depois, rodar o validador do projeto.

## Regras de construção
- Achar o **trecho exato** de cada item (em JSON: `json.JSONDecoder().raw_decode` item a item) e trocar **só esse trecho**; o resto do arquivo fica byte a byte igual. Não regravar o arquivo inteiro: os geradores podem ter usado separadores diferentes.
- Manter o estilo do trecho original (com ou sem espaços depois de `,` e `:`; acentos sem escape).
- Pasta dos dados trocável por variável de ambiente (ex.: `QUESTAO_RAIZ`), para o teste trabalhar numa cópia.
- Menos de 200 linhas; ajuda (`-h`) com os exemplos de uso no topo do arquivo.

## Teste guardado (obrigatório)
Em cópia temporária dos dados: mostrar um item de cada arquivo (saída pequena); id inexistente falha; busca dá total;
alterar texto + JSON + campo novo e conferir; troca de id falha; desfazer e conferir que **todos os arquivos voltaram idênticos**.
Ligar o teste no mapa de testes seletivos (dados e o próprio motor).

## Registrar
- `CLAUDE.md`, seção 1 (arquivos de dados): "nunca ler nem dar `grep` no banco; usar o motor" + os comandos.
- `CLAUDE.md`, seção 8: linha "Item único".
