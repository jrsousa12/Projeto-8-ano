# Receita: motor de teoria (e de cálculo) calibrado por fichas

Para projetos com **questões** (quiz, simulado, lista de exercícios, banco de provas) em qualquer matéria.
Exemplo pronto: `jrsousa12/projeto-plataforma-de-fisica`, `build/novas_teoria.py`, `build/novas_fichas.py` e `build/fichas/`.

## Ideia central
- **Um motor de cada tipo para todas as áreas**, nunca um motor por área. Senão a mesma correção teria de ser feita em N lugares.
- O que muda de uma área para outra fica numa **ficha de dados** (`fichas/<area>.json`), sem programação. Calibrar = acrescentar itens na ficha.

## Ficha (formato)
```json
{
 "_leia": "o que é cada parte",
 "calculo": [{"tipo": "inverso|fator|soma|sem_quadrado", "var": "regex do nome da variável", "valor": 2, "frase": "Erro do aluno com {nome}."}],
 "teoria":  [{"palavras": ["2+ termos do enunciado"], "ideia": "ideia errada comum", "por_que": "explicação curta do erro"}]
}
```
- `calculo`: erros de conta típicos da área. O motor refaz a conta com o erro e usa o resultado como alternativa errada, já com a explicação.
- `teoria`: ideias erradas comuns dos alunos, sugeridas como alternativa errada quando o enunciado tem **2 ou mais** das `palavras` (com 1 só, as ligações saem por acaso).
- Só a matéria do projeto muda o conteúdo (física, química, história...). O formato é o mesmo.

## Motor de teoria: o que confere (só avisos, nunca altera questões)
1. A certa bem mais longa que as erradas (mais de 1,6 vez a média e mais de 15 letras de diferença).
2. Palavras absolutas ("sempre", "nunca", "apenas") em 2 ou mais erradas e não na certa.
3. Só a certa repete palavras do enunciado (eco).
4. Alternativas repetidas: comparar o texto cru (minúsculas, sem espaços duplos). Normalizar demais apaga expoentes (10⁶ = 10³).
5. "Todas/nenhuma das anteriores" quando o app **embaralha** as alternativas. Usar a frase inteira, não a palavra solta "acima".
6. Pergunta negativa ("não é", "incorreta", "exceto") sem destaque em MAIÚSCULAS.
7. Erradas sem explicação.
8. Sugestões da ficha (até 2 por questão).

## Comandos
- `verificar <arquivo>`: as questões novas passam pelo motor (avisos + sugestões).
- `teoria`: pente-fino do banco inteiro, com resumo de uma linha por tipo de aviso e detalhes num `.md`. Ler só o resumo.

## Antes de criar (perguntar ao dono)
- O app embaralha as alternativas? Se sim, não conferir a letra do gabarito. Se não, acrescentar a checagem "gabarito concentrado numa letra".
- Quais são as áreas? Haverá uma ficha para cada, com 6 a 10 ideias erradas, escritas com o dono ou conferidas por ele.

## Qualidade e tamanho
- Motor com menos de 200 linhas. Ficha com o formato conferido por uma função (`checar_ficha`).
- Teste guardado: um caso que deve gerar cada aviso e um caso parecido que **não** deve (alarme falso).
- Rodar o pente-fino no banco real e olhar 5 a 10 avisos de cada tipo antes de dar por pronto: ajustar as regras que dão alarme falso.
