# Curso de Fundamentos da web — do zero a um painel que qualquer pessoa consegue usar

**Por Dorian Chávez, fundador da Hábil e arquiteto de integração.**

**Para quem é:** quem nunca escreveu uma página, e quem copia trechos que funcionam sem saber por quê. Não se supõe experiência prévia com nenhuma linguagem: cada conceito é explicado quando aparece, e se explica por que ele existe, não só como se escreve.

**O que você vai terminar sabendo:** construir uma página completa, entender o que você escreveu e conseguir explicar isso a outra pessoa. E ficar com o critério para ler a documentação da plataforma por conta própria.

**Para onde segue:** este curso é o degrau anterior ao [curso de TypeScript](https://www.habil.mx/pt/cursos/typescript/) desta casa, que refaz este mesmo painel com tipos e com React.

**O que você precisa antes de começar:** um computador com Linux Mint e saber abrir um terminal. A [Lição 1](01-entorno-ciclo-trabajo.md) instala tudo do zero.

## O projeto que você vai construir

O **`revisor`**: um painel que mostra o estado de uma lista de serviços —nome, estado e tempo de resposta— com seu resumo, seus filtros e seu formulário. Com HTML, CSS e JavaScript puros, **sem uma única biblioteca**, lendo seus dados de um arquivo JSON do próprio projeto.

Começa na lição 2 e cresce a cada lição. É o mesmo problema dos cursos de Go, Rust e TypeScript desta casa: quando você seguir para o TypeScript, vai refazer este painel, e comparando as duas versões se aprende mais do que começando outro projeto.

## As doze lições

| Lição | | O que você constrói | O que você aprende |
|---|---|---|---|
| 0 | [Como a web funciona](00-como-funciona-la-web.md) | nada ainda (leitura) | URL, DNS, HTTP, requisição e resposta; o que o navegador faz e o que o servidor faz; a aba Rede |
| 1 | [Seu computador e o ciclo de trabalho](01-entorno-ciclo-trabajo.md) | o ambiente e o primeiro `index.html` | editor, terminal e pastas; servidor local desde o primeiro dia; as ferramentas do navegador; um primeiro registro no Git |
| 2 | [HTML com significado](02-html-con-significado.md) | o esqueleto do painel | escolher o elemento pelo que ele significa; títulos, tabelas, botões e rótulos; o painel escrito à mão |
| 3 | [CSS: cascata, especificidade e caixa](03-css-cascada-caja.md) | o painel legível | de onde vem cada estilo e qual vence; o modelo de caixa e `box-sizing`; variáveis de cor e tipografia |
| 4 | [Organizar com Flexbox e Grid](04-flexbox-grid.md) | o painel organizado em uma tela larga | uma dimensão com Flexbox e duas com Grid; os dois eixos, `gap`, `flex` e `flex-wrap`; colunas com `fr` e `repeat()` |
| 5 | [Uma página que funciona em qualquer tela](05-pagina-adaptable.md) | o painel que funciona em um celular | a tag `viewport`; `minmax()` e `auto-fit` antes de `@media`; a tabela que rola dentro da sua caixa; `@container`; de 320 a 1440 px |
| 6 | [JavaScript e o modelo de dados](06-javascript-datos.md) | os dados do painel e suas contas | valores, objetos, arrays e funções; decidir, repetir e avisar de um erro; módulos; quantos serviços estão no ar e a média de resposta |
| 7 | [O DOM, os eventos e o estado](07-dom-eventos-estado.md) | a tabela que é desenhada a partir dos dados | desenhar a partir de dados; escutar eventos; separar estado e desenho; `textContent` como hábito, e o XSS que ele evita |
| 8 | [Trazer dados: promessas, fetch e async/await](08-traer-datos.md) | o painel que pede seus dados a um arquivo JSON | o que é uma promessa; `fetch` em dois passos; `response.ok`; `async`/`await` |
| 9 | [Quando algo falha: tempos limite, estados, CORS e várias requisições](09-cuando-algo-falla.md) | o painel que sempre diz o que está acontecendo | tempo limite; os três estados: carregando, erro e vazio; o erro de CORS; várias requisições com `Promise.allSettled` |
| 10 | [Formulários e validação](10-formularios-validacion.md) | incluir e filtrar serviços | a validação que o navegador já traz; `:user-invalid`; dizer o erro para que um leitor de tela o anuncie |
| 11 | [O painel terminado](11-el-panel-terminado.md) | o `revisor` publicado | revisão com o teclado; CSP como cabeçalho do servidor; peso e desempenho; publicar um site estático |

No fim de cada lição há exercícios com suas soluções. E o [diário de bordo](https://github.com/HabilMX/curso-web/blob/main/pt/bitacora.md) é seu: anote ali o que foi difícil para você.

## Dois critérios que atravessam todo o curso

**A acessibilidade e a segurança não são lições, são costumes.** Não há um módulo final de acessibilidade: há HTML nativo na 2, teclado na 3, na 4 e na 5, `textContent` na 7, validação nativa na 10 e a revisão na 11. Um tema deixado para o final é um tema que não se aprende.

**Só se ensina o que já funciona em todos os navegadores.** O que ainda não funciona aparece em um quadro “o que vem por aí” e se diz que não deve ser usado em produção. Um curso que ensina o que acabou de sair envelhece em seis meses.

## Como você sabe que terminou

O curso não acaba quando você leu a lição 11, e sim quando o seu painel cumpre estas cinco coisas. Nenhum programa as verifica por você: você mesmo as confere, com as ferramentas do navegador, e a seção “Como sei que consegui” de cada lição diz como:

1. **Navega-se completo com o teclado**, sem usar o mouse.
2. **Não há nem um erro no console** do navegador.
3. **Funciona a 320 px de largura** sem transbordamento horizontal.
4. **Mostra os três estados**: carregando, erro e vazio. Não só o caso em que tudo dá certo.
5. **O texto que vem de fora é desenhado com `textContent`**, nunca com `innerHTML`.
