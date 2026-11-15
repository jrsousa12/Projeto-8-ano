# Diretrizes de Eficiência de Contexto e Tokens

Este projeto prioriza a economia de contexto e tokens. Estas diretrizes são de cumprimento obrigatório.

## 0. Contexto do Projeto

- **Stack**: (linguagens, frameworks, onde é publicado)
- **Comandos úteis**:
  - Build: (comando)
  - Testes: (rápido durante a tarefa; completo no fim)
  - Lint: (comando, ou "não há")
- **Convenções**: (nomes, pastas, arquivos gerados que não se editam à mão)
- **Próximas tarefas**: (lista numerada, ou "nenhuma")
- **Público**: o dono é professor e não programa; explicar em português simples.
- **Idioma**: responder sempre em português do Brasil (PT-BR), inclusive resumos, avisos e mensagens de commit.

> Mantenha esta seção curta. Regras de um domínio vão no `CLAUDE.md` do subdiretório.

---

## 1. Modularização e Limite de Tamanho de Arquivo

- **Limite**: nenhum arquivo de código acima de **300 linhas**; ideal abaixo de **200**.
- **Ação corretiva**: ao ler um arquivo acima do limite, a primeira tarefa é **propor um plano de modularização** antes de qualquer outra edição.
- **Arquivos de dados** (linhas longas, gerados, bancos): o critério é o tamanho, não as linhas. Nunca ler inteiro; localizar com `grep` e ler só o trecho. Se as linhas forem enormes (o `grep` traz tudo), usar o **motor de item único** (seção 8): nunca ler nem dar `grep` nesses arquivos.
- **Exceções toleradas**: (listar aqui, com o motivo e a data da decisão do dono)
- **Novas funcionalidades**: já nascem em módulos pequenos, uma responsabilidade por arquivo.

## 2. Hierarquia de Contexto (CLAUDE.md)

- **Raiz**: só regras globais, comandos e convenções.
- **Subdiretórios**: um `CLAUDE.md` por pasta-chave, com as regras daquele domínio e suas exceções locais.
- **Concisão**: bullets e cabeçalhos; nada de prosa longa.

## 3. Edição e Leitura de Código

- **Edições cirúrgicas**: editar o trecho, não reescrever o arquivo.
- **Leitura sob demanda**: só os arquivos/trechos da tarefa, com `grep` e intervalos de linhas. O dono pode indicar arquivos com `@nome`.
- **Plano antes do código**: em tarefas complexas, descrever os passos e validar com o dono antes de mexer.
- **Motores para tarefas repetitivas**: se uma tarefa se repete (gerar, converter, conferir ou corrigir em lote), criar um script (motor) que a faça, em vez de refazê-la à mão a cada vez; depois, só rodar o motor e ler o resumo da saída (tipos na seção 8).

## 4. Higiene de Comandos

- **Silenciar** comandos barulhentos (`-q`, `--silent`) ou filtrar (`| grep -E "(FAIL|PASS|Error)"`).
- **Saída concisa**: nunca despejar logs inteiros no contexto.

## 5. Protocolo de Sessão

- **Mudança de assunto** → lembrar o dono de usar `/clear`.
- **Mesma tarefa, conversa longa** → sugerir `/compact` com direcionamento (ex.: `/compact mantenha as decisões e os arquivos alterados`).
- Só o dono pode executar `/clear` e `/compact`.

## 6. Vigia de Contexto

- **Alertar** quando: um arquivo em edição se aproxima de 300 linhas; a conversa acumula informação repetida; houver releitura desnecessária; a mesma tarefa for feita à mão pela 2ª ou 3ª vez (propor um motor, seção 8).
- **Como**: uma frase com o motivo + a ação (`/compact`, `/clear` ou modularizar).
- **Regra de ouro**: nunca editar arquivo acima do limite sem **perguntar** antes. A decisão é sempre do dono.

## 7. Manutenção deste Arquivo

- Manter abaixo de **200 linhas**; o excedente vai para os `CLAUDE.md` dos subdiretórios.
- Revisar a cada mudança estrutural (nova stack, módulo ou fluxo de build).

## 8. Motores e Automações

Motor = script que faz o trabalho pesado e devolve só um resumo curto. Criar quando a tarefa se repete; propor ao dono antes (plano aprovado), registrar em "Comandos úteis" (seção 0) e manter cada motor pequeno (seção 1). Tipos que valem a pena:

- **Comando único de build**: um script que roda tudo em ordem (montar, versionar, validar, gerar docs), cada etapa com `| tail -2`.
- **Validador/auditor**: confere dados em lote (formato, cálculo, unidades, links) e lista só os erros.
- **Gerador de conteúdo**: cria itens novos (questões, páginas, registros) a partir de dados mínimos, já conferidos.
- **Motor de teoria e de cálculo** (projetos com questões): um motor de cada tipo para todas as áreas + uma ficha de dados por área (erros típicos e ideias erradas comuns). Calibrar = editar a ficha. Receita: `motor-teoria.md` do protocolo-token.
- **Moldes e kit de peças**: partes prontas reaproveitáveis; o novo se monta com elas, nunca recopiando código.
- **Catálogo/índice**: gera um `.md` curto do que já existe (chave + frase), para achar o que reaproveitar sem abrir arquivos grandes.
- **Extrator de dados**: exporta só o pedaço necessário (ex.: JSON de um banco), em vez de ler o arquivo inteiro.
- **Motor de item único** (dados em linhas enormes): mostra um item pelo id (`ID`, `-c campos`), busca por texto (`--busca`), altera (`campo=texto`, `campo:=json`, `-x campo`) trocando só o trecho do item, com teste guardado. Receita: `motor-questao.md` do protocolo-token.
- **Correção em lote**: acha e corrige um mesmo erro em todos os arquivos de uma vez.
- **Gerados automáticos**: versão, tabelas do README, listas; nunca editar à mão (anotar na seção 0).
- **Testes guardados**: todo teste criado numa tarefa vira arquivo permanente (um por assunto, ex.: `testes/t_<assunto>`), nunca descartável. Antes de criar, procurar um teste existente e ampliá-lo; não reescrever testes que já existem.
- **Testes seletivos**: um mapa "arquivo alterado → testes ligados" escolhe só os testes fundamentais da tarefa (incluído ou modificado); teste novo entra no mapa na hora. Suíte completa só no fim da tarefa ou antes de publicar.
- **Ajudantes comuns de teste**: abrir navegador, simular serviço externo etc. num só módulo usado por todos os testes.
- **Revisão em lote**: capturas/relatórios de muitos itens de uma vez, em vez de um por um.
- **Memória do projeto**: listas de ideias e pendências (`IDEIAS.md`, `NOTAS.md`) para não redescobrir decisões. Quando passarem de ~150 linhas, mover o que já foi feito para um arquivo de histórico.
- **Travas e barra**: `.claude/settings.json` + `.claude/hooks/` impedem ler dados enormes direto e mostram o % do contexto usado (receita: `travas-e-barra.md` do protocolo-token).

## 9. Recursos de Apoio (criar quando o projeto pedir)

- **Modelos e exemplos**: esqueletos gerados por comando e uma pasta `exemplos/`; começar copiando, nunca do zero.
- **Cache de consultas externas**: guardar páginas/respostas da internet já consultadas e reusá-las, em vez de buscar de novo.
- **Lista de fontes confiáveis**: arquivo com os sites aceitos; dispensa pesquisar fontes a cada tarefa.
- **Registro do que já foi feito**: arquivo (ex.: `.jsonl`) com os itens já aplicados; não refazer nem reconferir.
- **Guias passo a passo**: receitas curtas em `.md` para cada processo repetido; seguir a receita em vez de redescobrir.
- **Fonte única da verdade**: cada lista (itens, páginas, configurações) num só arquivo, lido por todos os scripts.
- **Relatórios em arquivo**: saída longa vai para um `.md`/`.txt`; na conversa, só o resumo.


## 10. Dicas para o Dono (lembrar quando couber, em uma frase)

- Uma tarefa por conversa; `/clear` ao trocar de assunto.
- Indicar o arquivo com `@nome` quando souber qual é.
- Pedidos diretos ("faça X em Y"); responder "sim"/"não" às perguntas basta.
- Tarefa simples (corrigir um texto, trocar um valor): `/model` com Sonnet ou Haiku; Opus para planos e tarefas difíceis.
- Olhar a barra de contexto embaixo: perto de 50%, `/compact`; ao terminar o assunto, `/clear`.
- Decisões tomadas ficam anotadas (`NOTAS.md`), para não serem perguntadas de novo.

