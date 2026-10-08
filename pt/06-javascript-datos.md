# Lição 6 — JavaScript e o modelo de dados

**Tempo:** 90 min (ou 2 × 45)

**O que você constrói:** os dados do painel e as suas contas

**O que você aprende:** valores, objetos, arrays e funções; decisões, laços e erros; módulos; o array de serviços, quantos estão no ar e a média de resposta

**De onde você vem.** Você traz o painel da [Lição 5](05-pagina-adaptable.md): o HTML com significado da [Lição 2](02-html-con-significado.md), a folha de estilo da Lição 3 e o layout das lições 4 e 5, que se adapta de 320 a 1440 px. É um painel que tem boa aparência, mas **tudo o que ele diz está escrito à mão**: “5 serviços verificados”, “4 de 5 disponíveis”, “1 fora do ar”, “465 ms” de resposta média. Essas quatro cifras foram somadas por você com uma calculadora na Lição 2, e, se hoje um serviço mudar, é preciso somar tudo de novo. É isso que esta lição tira do caminho. Você trabalha na sua pasta `revisor`, na subpasta `js/` que criou na [Lição 1](01-entorno-ciclo-trabajo.md), e continua servindo tudo com `python3 -m http.server 8000 --bind 127.0.0.1`: nenhum passo desta lição exige instalar mais nada.

**O que esta lição não faz.** Ela não mexe na página. Os resultados dos programas de hoje aparecem no **console** das ferramentas do navegador, não no painel. Como eles são desenhados na tabela é o tema da [Lição 7](07-dom-eventos-estado.md), e de onde vêm os dados quando não estão escritos no próprio programa, o da [Lição 8](08-traer-datos.md). Hoje se resolve primeiro o problema de fundo: **como se representa um serviço, como se guarda uma lista deles e como se calculam as cifras a partir dessa lista**.

## Ao terminar, você vai conseguir

- Guardar um valor com `const` ou `let`, dizer de que tipo ele é com `typeof` e explicar por que `120 === "120"` dá `false`.
- Representar um serviço como um objeto com propriedades e a lista de serviços como um array de objetos, e ler ou alterar qualquer dado deles.
- Percorrer um array com `filter`, `map`, `find`, `some`, `every` e `reduce`, ou passo a passo com `for…of`; decidir com `if`, `else` e o operador ternário; avisar de um erro com `throw` e capturá-lo com `try…catch`, e ler `new` e os três pontos `...` quando aparecerem.
- Escrever as duas contas do painel —quantos serviços estão disponíveis e a média de resposta— como funções que recebem a lista e devolvem um número.
- Explicar por que uma média calculada sem cuidado dá 372 ms onde a resposta correta é 465, e corrigi-la.
- Dividir o programa em módulos (`export` e `import`), carregá-lo com `<script type="module">` e explicar por que esse módulo não abre com duplo clique.
- Ler as cinco mensagens de erro mais frequentes desta etapa e dizer o que as causou.

## O porquê antes do como

Olhe o resumo do painel como ficou na Lição 2. Ele diz que há 5 serviços, que 4 estão disponíveis, que 1 está fora do ar e que a resposta média é de 465 ms. Cada uma dessas cifras foi obtida olhando a tabela e fazendo uma conta. Agora imagine que a equipe de plantão do serviço de e-mail peça para incluí-lo no painel: é preciso escrever uma linha nova na tabela e, **separadamente**, trocar o 5 por um 6, o “4 de 5” por “5 de 6” e calcular a média de novo. Se você esquecer uma das quatro, o painel se contradiz: a tabela conta seis linhas e o resumo diz cinco. No Exercício 3 da Lição 2 você fez isso à mão e viu quanto custa não errar.

O problema é que **o mesmo dado está escrito em dois lugares**, e duas cópias de um dado sempre acabam diferindo. A solução é escrevê-lo uma só vez, num lugar que um programa possa ler, e obter dali todo o resto —as linhas da tabela, o 5, o “4 de 5”, os 465 ms. Essa é a ideia desta lição, e da seguinte: **os dados ficam à parte, e o que se vê é calculado a partir deles**.

Para isso é preciso uma linguagem de programação, e a da web é o **JavaScript**. É a linguagem de programação que todos os navegadores executam por conta própria, sem instalar nada: o HTML diz o que cada coisa é, o CSS diz como ela se vê e o JavaScript diz o que ela faz. Não se deve confundi-lo com Java, que é outra linguagem sem relação (a semelhança dos nomes é histórica e enganosa). [Sua especificação se chama **ECMAScript**](https://tc39.es/ecma262/) e é publicada pela Ecma International todo ano; [a edição vigente em outubro de 2026 é a 17.ª, de junho deste ano](https://ecma-international.org/publications-and-standards/standards/ecma-262/). Para o que você faz hoje, não precisa saber o que cada edição traz, mas convém saber que existe um padrão com um dono e uma versão, assim como o HTML e o CSS: o que você aprende funciona da mesma forma em todos os navegadores.

### Como um programa é executado no navegador

Um programa é uma lista de instruções que se executam **uma após a outra, de cima para baixo**. O navegador traz um motor que as lê e as executa. Há duas formas de ver o que ele faz. A primeira é o **console** das [ferramentas do navegador](https://developer.chrome.com/docs/devtools/console): abra-as com `F12` e entre na aba “Console”. Ali aparece tudo o que o programa manda imprimir com `console.log(...)`, e também os erros. A segunda é a própria página, que, a partir da Lição 7, será desenhada com os dados.

Hoje você trabalha só com o console. Cada programa desta lição é uma página cuja única missão é executar um programa e deixar o resultado à vista. Cada uma tem um texto que diz “Abre la consola de las herramientas del navegador (F12) para ver el resultado” (“Abra o console das ferramentas do navegador (F12) para ver o resultado”), e essa é a única parte visível. Elas estão em [`programas/06-javascript-datos/`](https://github.com/HabilMX/curso-web/tree/main/programas/06-javascript-datos), no repositório do curso. Para executá-las, baixe-o e, a partir dessa pasta, [suba o servidor local e abra a página](https://docs.python.org/3/library/http.server.html):

```bash
$ python3 -m http.server 8000 --bind 127.0.0.1
Serving HTTP on 127.0.0.1 port 8000 (http://127.0.0.1:8000/) ...
```

(O que importa é que ele fica esperando: o terminal não devolve o controle. Para interrompê-lo, `Ctrl`+`C`.) Cada vez que você mudar um arquivo, recarregue a página com `Ctrl`+`Shift`+`R`.

### Um programa que se vê de fora: o que você escreveu à mão, calculado

Antes de entrar na sintaxe, o objetivo concreto. No final da lição você terá três arquivos pequenos na sua pasta `js/`: um com os dados, outro com as duas contas e outro que as usa. E, ao abrir o painel, você verá no console estas quatro linhas:

```text
Disponibles: 4
Caídos: 1
Respuesta promedio: 465 ms
{"available":4,"down":1,"averageMs":465}
```

As mesmas cifras que você escreveu à mão na Lição 2, mas agora produzidas por um programa a partir dos dados. Se você incluir um serviço e recarregar, elas mudam sozinhas. Com esse destino em mente, o caminho tem três trechos, um por conceito: primeiro os valores mais simples; depois os objetos e os arrays com que os dados são representados —e, com eles, como um programa decide, repete e avisa de um erro—; e, por fim, como o programa é repartido em arquivos.

## Os conceitos

### 6.1 Valores e variáveis

#### 6.1.1 Os valores que o painel tem

Os dados de um serviço são de poucas classes. Um nome (“Catálogo”) é um **texto**, que em programação se chama **string** (cadeia de caracteres) e se escreve entre aspas. Um tempo de resposta (120) é um **número**. Que um serviço esteja no ar ou fora é uma pergunta de sim ou não, e seu valor se chama **booleano**: `true` ou `false`. E há dois valores que significam “nada” e que, no começo, se confundem: `null` e `undefined`. Por isso convém ver os seis juntos. Segundo o [guia do MDN sobre gramática e tipos](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Grammar_and_types), o JavaScript tem oito tipos de valores: sete primitivos (booleano, `null`, `undefined`, número, `BigInt`, string e símbolo) e um composto, o objeto. Neste curso você usará strings, números, booleanos, `null` e `undefined`, e objetos; `BigInt` e símbolos não aparecem.

Abra `fig06_01.html` e o seu console:

```html
<!-- fig06_01.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Valores y variables</title>
</head>
<body>
  <main>
    <h1>Valores y variables</h1>
    <p>Abre la consola de las herramientas del navegador (F12) para ver el resultado.</p>
  </main>
  <script type="module">
    const name = "Catálogo";
    let responseMs = 120;
    const isUp = true;

    console.log(typeof name, typeof responseMs, typeof isUp);

    responseMs = responseMs + 30;
    console.log(`${name} respondió en ${responseMs} ms`);

    const noAnswer = null;
    let notYet;
    console.log(typeof noAnswer, typeof notYet);

    console.log(120 === "120", 120 == "120");
    console.log(0.1 + 0.2, 0.1 + 0.2 === 0.3);
    console.log(Number("abc"), Number.isNaN(Number("abc")));
  </script>
</body>
</html>
```

O console mostra:

```text
string number boolean
Catálogo respondió en 150 ms
object undefined
false true
0.30000000000000004 false
NaN true
```

Linha por linha:

- `const name = "Catálogo";` **declara uma variável**: um nome que guarda um valor. Depois se pode usar `name` onde o texto for necessário. `typeof` pergunta de que tipo é um valor e devolve `"string"`, `"number"` ou `"boolean"`; segundo o [operador `typeof`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/typeof), esse é o nome do tipo.
- `let responseMs = 120;` também declara uma variável, mas com `let`, porque seu valor vai mudar: `responseMs = responseMs + 30;` guarda um novo valor (150). O modelo com crases, `` `${name} respondió en ${responseMs} ms` ``, chama-se [template literal](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Template_literals): o que vai entre `${` e `}` é calculado e inserido no texto.
- `typeof noAnswer` dá `"object"` para `null`. É uma esquisitice das origens da linguagem, [um erro que nunca foi corrigido para não quebrar os programas antigos](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/typeof). Isso não significa que `null` seja um objeto. Se você precisa saber se algo é `null`, compare diretamente: `valor === null`.
- `120 === "120"` dá `false` e `120 == "120"` dá `true`. Aqui há uma regra que lhe poupa uma tarde: **compare sempre com três sinais, `===`**. O triplo igual compara o valor *e* o seu tipo; o duplo igual tenta converter um dos dois antes de comparar, e essas conversões têm regras pouco intuitivas (o [artigo do MDN sobre igualdade](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness) as enumera). Não existe um único caso do `revisor` em que `==` ajude, e há muitos em que atrapalha.
- `0.1 + 0.2` dá `0.30000000000000004`. Não é uma falha do JavaScript, e sim de como se guardam os números com decimais em qualquer linguagem que use a norma IEEE 754: todos os números do JavaScript são de ponto flutuante de 64 bits, segundo a [documentação de `Number`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Number), com uns 15 a 17 dígitos significativos. Alguns decimais simples não cabem exatos em binário e são aproximados. Consequência prática: **não compare com `===` o resultado de uma conta com decimais esperando um valor exato**; compara-se com uma tolerância (que a diferença seja menor que, por exemplo, `0.000001`) ou se trabalha com inteiros e, para dinheiro, em centavos. Comparar com `===` é correto quando o número não saiu de uma conta, como um `120` escrito tal qual: o problema não é o `===`, é o arredondamento da conta. Os tempos de resposta do painel são milissegundos inteiros, então você não vai topar com isso hoje; convém, sim, tê-lo visto uma vez.
- `Number("abc")` dá [`NaN`, que significa “não é um número”](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/NaN) (*not a number*) e é, curiosamente, um valor do tipo número. Como `NaN === NaN` dá `false`, para perguntar se algo é `NaN` não adianta compará-lo; a forma mais clara é `Number.isNaN(valor)`. Há outras, como `valor !== valor` (`NaN` é o único valor diferente de si mesmo), mas essa se lê como um truque, e neste curso se usa `Number.isNaN`. Ele aparecerá mais adiante, como sintoma de uma conta malfeita.

#### 6.1.2 `const`, `let` e por que `var` não mais

Você já usou duas formas de declarar. A terceira, `var`, é a que os tutoriais antigos trazem, e neste curso não é usada. [A tabela do MDN a resume](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Grammar_and_types): `var` vive na função inteira onde é declarada (e, se for declarada fora de qualquer função, em todo o módulo ou em todo o script, segundo o [MDN](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/var)), é “elevada” (*hoisting*: passa a existir, com valor `undefined`, desde o início desse escopo ainda que você a declare mais abaixo) e permite redeclarar o mesmo nome sem reclamar, ao passo que `let` e `const` vivem apenas dentro do par de chaves onde são declaradas e não existem antes da sua declaração. Um erro que o `var` esconde, o `let` e o `const` gritam, e é isso que se quer.

A regra do curso é: **use `const` por padrão; use `let` somente quando de fato for reatribuir**. Isso não tem a ver com velocidade, e sim com leitura: se você vê `const total = ...`, sabe que `total` não vai mudar em lugar nenhum mais abaixo; se vê `let total`, sabe que é preciso procurar onde ele muda.

Há um detalhe que surpreende. `const` impede *reatribuir* o nome, não impede *mudar o que há dentro* do valor se esse valor for um objeto ou um array. Você verá isso no tópico seguinte.

### 6.2 Objetos, arrays e funções: o modelo de dados

Aqui está o coração da lição. Os valores soltos não bastam: um serviço não é um número nem um texto, é *um conjunto de dados que andam juntos* (um nome, um estado, um tempo), e o painel não tem um serviço, tem uma *lista* deles. São necessárias duas formas de agrupar: o objeto, que junta dados de classes diferentes sob nomes, e o array, que junta muitas coisas numa ordem. O JavaScript deixa misturar num mesmo array valores de qualquer tipo (textos, números, objetos, outros arrays); no painel, por costume e para que se leia com facilidade, cada array guarda coisas de uma só classe: puros serviços.

#### 6.2.1 O objeto: um serviço

Um **objeto** é uma coleção de pares **nome: valor**, escrita entre chaves. Os nomes se chamam **propriedades**. Assim se representa um serviço do painel:

```js
const service = {
  id: "catalog",
  name: "Catálogo",
  status: "available",
  responseMs: 120,
  url: "https://catalogo.example/salud",
};
```

Quatro decisões de projeto que valem mais que a sintaxe:

- Os nomes das propriedades estão **em inglês** (`name`, `status`, `responseMs`) e os valores mostrados ao leitor, em espanhol. É uma convenção do curso: o que é código (nomes de arquivo, de propriedade, de função) fica igual em todas as edições e coincide com a documentação técnica, que é em inglês; o que a pessoa lê é traduzido.
- `status` é um texto com **dois valores possíveis**, `"available"` e `"down"`. Não é um booleano `isUp` de propósito: um texto admite mais valores que um sim/não sem mudar a forma do dado, e amanhã pode haver um terceiro estado, como “lento”.
- `responseMs` leva a **unidade no nome**. Um número solto (“120”) não diz se são segundos ou milissegundos; `responseMs` diz. É um hábito que poupa erros: a unidade vai no nome, não na memória de quem lê.
- `id` é diferente de `name`: o nome é o que se mostra e pode mudar (“Catálogo” passa a “Catálogo de produtos”); o `id` é o que identifica o serviço e não muda.

Lê-se uma propriedade com um ponto (`service.name`) ou com colchetes e aspas (`service["status"]`). Os colchetes servem quando o nome da propriedade está numa variável. [Uma propriedade se altera como uma variável](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Working_with_objects): `service.responseMs = 135;`. E aqui está o que eu dizia antes: `service` foi declarado com `const`, e mesmo assim se pode alterar `service.responseMs`. O `const` protege que o nome `service` continue apontando para o mesmo objeto; não congela o conteúdo do objeto.

Se você pede uma propriedade que não existe, não há erro: dá `undefined`. E se pede uma propriedade *de* algo que é `undefined` ou `null`, aí sim há erro, e é o mais frequente de todos (você o verá em “O erro que você vai ver”). Para essas situações existem dois operadores. O **encadeamento opcional** `?.` diz “se o que está à esquerda é `null` ou `undefined`, não continue e devolva `undefined`”; segundo o [MDN](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/Optional_chaining), está disponível em todos os navegadores desde julho de 2020. [O **operador de coalescência nula**](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing) `??` diz “se o que está à esquerda é `null` ou `undefined`, use este outro”; está disponível em todos os navegadores desde 2020 (o [explorador de recursos da plataforma](https://web-platform-dx.github.io/web-features-explorer/features/nullish-coalescing/) o declara “amplamente disponível” desde março de 2023, o rótulo dado 30 meses depois de o último navegador passar a tê-lo). Juntos se lê assim: `service.owner?.team ?? "sin responsable"`.

Abra `fig06_02.html` e você verá tudo isso junto:

```html
<!-- fig06_02.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Un servicio como objeto</title>
</head>
<body>
  <main>
    <h1>Un servicio como objeto</h1>
    <p>Abre la consola de las herramientas del navegador (F12) para ver el resultado.</p>
  </main>
  <script type="module">
    const service = {
      id: "catalog",
      name: "Catálogo",
      status: "available",
      responseMs: 120,
      url: "https://catalogo.example/salud",
    };

    console.log(service.name);
    console.log(service["status"]);

    service.responseMs = 135;
    console.log(service.responseMs);

    console.log(service.owner);
    console.log(service.owner?.team);
    console.log(service.owner?.team ?? "sin responsable");

    const { name, responseMs } = service;
    console.log(name, responseMs);

    const copy = { ...service, status: "down", responseMs: null };
    console.log(service.status, copy.status);

    const text = JSON.stringify(service);
    console.log(text);
    console.log(JSON.parse(text).name);
  </script>
</body>
</html>
```

O console mostra:

```text
Catálogo
available
135
undefined
undefined
sin responsable
Catálogo 135
available down
{"id":"catalog","name":"Catálogo","status":"available","responseMs":135,"url":"https://catalogo.example/salud"}
Catálogo
```

Mais três coisas aparecem nessa página. A **desestruturação**, `const { name, responseMs } = service;`, extrai de um objeto várias propriedades de uma vez para variáveis com o mesmo nome ([MDN](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)). A **propagação** (*spread*), `{ ...service, status: "down" }`, copia as propriedades de um objeto para outro novo e deixa alterar algumas, e é uma cópia rasa: copia um nível, não os objetos que houver dentro dos objetos ([MDN](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/Spread_syntax)). Depois de `copy`, `service.status` continua sendo `"available"`: o original não foi modificado. E o **JSON**.

#### 6.2.2 JSON: o objeto transformado em texto

`JSON.stringify(service)` converte o objeto em um texto, e `JSON.parse(texto)` faz o caminho inverso. Esse texto é JSON (*JavaScript Object Notation*): um formato para escrever dados que **qualquer linguagem pode ler**, não só o JavaScript. É o formato em que o painel vai receber seus dados na Lição 8, e a norma que o define é curta, a [ECMA-404](https://ecma-international.org/publications-and-standards/standards/ecma-404/) (a [RFC 8259](https://www.rfc-editor.org/rfc/rfc8259) da IETF é a sua equivalente para a internet).

Ele se parece com um objeto do JavaScript, mas é mais rigoroso, e as diferenças são as que produzem erros de iniciante, segundo a [tabela do MDN](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/JSON): os nomes das propriedades **sempre** vão entre aspas duplas, as strings também vão entre aspas duplas (nunca simples), **não se admitem comentários**, **não se admite a vírgula final** depois do último elemento, e não existe `undefined`. Um arquivo JSON com uma vírgula a mais não é lido, e a mensagem de erro que o `JSON.parse` dá varia conforme o navegador. Hoje não se trabalha com arquivos JSON; basta que, quando eles aparecerem, você reconheça que são uma forma de escrever o que já sabe escrever em JavaScript.

#### 6.2.3 O array: a lista de serviços

Um **array** é uma lista ordenada de valores entre colchetes. Os elementos são numerados a partir do **zero**: o primeiro é `services[0]`, o segundo `services[1]`, e sua quantidade está em `services.length`. Essa numeração a partir do zero é a causa do erro mais comum com arrays: um array de cinco elementos tem posições de 0 a 4, e pedir a 5 dá `undefined`. Para pedir o último elemento sem contar, existe `.at(-1)`: os números negativos contam a partir do final, e [`at()`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/at) está disponível em todos os navegadores desde março de 2022.

A lista de serviços do painel é um array de objetos, um por linha da tabela:

```js
const services = [
  { id: "catalog", name: "Catálogo", status: "available", responseMs: 120 },
  { id: "payments", name: "Pagos", status: "available", responseMs: 480 },
  { id: "inventory", name: "Inventario", status: "down", responseMs: null },
  { id: "notifications", name: "Notificaciones", status: "available", responseMs: 310 },
  { id: "search", name: "Búsqueda", status: "available", responseMs: 950 },
];
```

Repare no serviço fora do ar: seu `responseMs` é **`null`**, não `0` nem um texto como `"sin respuesta"`. É a decisão de modelo mais importante da lição. Um serviço fora do ar **não respondeu**, e “não respondeu” não é o mesmo que “respondeu em zero milissegundos”: usar `0` faria a média premiá-lo por estar fora do ar. `null` diz com precisão “aqui não há dado”. O texto “sin respuesta” (“sem resposta”) que você vê na tabela é coisa da apresentação; o dado guarda um `null`.

Agora, o que se faz com um array é quase sempre o mesmo: **perguntar coisas a todos os seus elementos de uma vez**. Para isso há métodos, e cada um recebe uma função que diz o que fazer com cada elemento. Antes de vê-los, essa função.

#### 6.2.4 Funções: instruções com nome

Uma **função** é um trecho de programa com nome que recebe dados de entrada (**parâmetros**), faz algo e devolve um resultado com `return`. Declara-se assim:

```js
function countByStatus(list, status) {
  return list.filter((service) => service.status === status).length;
}
```

`countByStatus` recebe uma lista e um estado, e devolve quantos serviços da lista têm esse estado. Usa-se escrevendo o seu nome com os dados entre parênteses: `countByStatus(services, "available")` devolve `4`. Duas propriedades tornam boa uma função, e se aplicam a todas as do painel. A primeira: que seja **pura**, isto é, que não dependa de nada de fora nem altere nada de fora: tudo o que ela usa entra pelos parâmetros, e tudo o que produz sai pelo `return`. Se você a chama duas vezes com os mesmos dados, dá o mesmo resultado nas duas. A segunda: que tenha **um único trabalho** e seu nome o diga: `countByStatus` conta; `averageResponseMs` calcula a média. Uma função assim pode ser testada sozinha e pode ser reutilizada; a Lição 7 vai chamá-las de vários lugares.

Dentro de `countByStatus` aparece uma **função de seta**: `(service) => service.status === status`. É uma função sem nome, escrita de forma curta: à esquerda da seta, os parâmetros; à direita, o que ela devolve ([MDN](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Functions/Arrow_functions)). Equivale a `function (service) { return service.status === status; }`. Usa-se sobretudo para passá-la aos métodos dos arrays, que é o que vem a seguir.

#### 6.2.5 Os métodos do array

Abra `fig06_03.html`:

```html
<!-- fig06_03.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Una lista de servicios</title>
</head>
<body>
  <main>
    <h1>Una lista de servicios</h1>
    <p>Abre la consola de las herramientas del navegador (F12) para ver el resultado.</p>
  </main>
  <script type="module">
    const services = [
      { id: "catalog", name: "Catálogo", status: "available", responseMs: 120 },
      { id: "payments", name: "Pagos", status: "available", responseMs: 480 },
      { id: "inventory", name: "Inventario", status: "down", responseMs: null },
      { id: "notifications", name: "Notificaciones", status: "available", responseMs: 310 },
      { id: "search", name: "Búsqueda", status: "available", responseMs: 950 },
    ];

    console.log(services.length, services[0].name, services.at(-1).name);

    const available = services.filter((service) => service.status === "available");
    console.log(available.length);

    const names = services.map((service) => service.name);
    console.log(names.join(", "));

    const payments = services.find((service) => service.id === "payments");
    console.log(payments.responseMs);

    console.log(services.some((service) => service.status === "down"));
    console.log(services.every((service) => service.status === "down"));

    const slowestFirst = available.toSorted((a, b) => b.responseMs - a.responseMs);
    console.log(slowestFirst.map((service) => service.name).join(" > "));
    console.log(available[0].name);
  </script>
</body>
</html>
```

O console mostra:

```text
5 Catálogo Búsqueda
4
Catálogo, Pagos, Inventario, Notificaciones, Búsqueda
480
true
false
Búsqueda > Pagos > Notificaciones > Catálogo
Catálogo
```

Cada método recebe uma função de seta e a chama com os elementos, em ordem. `filter` e `map` a chamam com **todos**. `find`, `some` e `every`, por outro lado, param assim que já podem dar a resposta ([o MDN descreve](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array#iterative_methods)): `find` e `some` no primeiro elemento que cumpre, `every` no primeiro que não cumpre. Com a lista do painel, `some` examina Catálogo, Pagos e Inventario, encontra o que está fora do ar e já não olha Notificaciones nem Búsqueda; `every` para em Catálogo, que não está fora do ar. Eu medi contando as chamadas: 3 e 1.

- [`filter`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) devolve um **array novo** com somente os elementos para os quais a função devolve `true`. É a “consulta” do painel: os disponíveis são `services.filter((service) => service.status === "available")`, e são 4.
- [`map`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/map) devolve um array novo do mesmo tamanho, onde cada elemento é o que a função devolveu para o original. Aqui ele extrai os nomes; na Lição 7 extrairá as linhas da tabela.
- [`find`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/find) devolve **o primeiro** elemento que cumpre a condição, ou `undefined` se nenhum a cumpre. Aqui ele procura o serviço com `id` igual a `"payments"` e fica com o seu `responseMs` (480).
- [`some`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/some) pergunta “*algum* cumpre?” e [`every`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/every) pergunta “*todos* cumprem?”. Os dois devolvem `true` ou `false`. Há algum serviço fora do ar? Sim (`some` dá `true`). Estão todos fora do ar? Não (`every` dá `false`).
- [`toSorted`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted) ordena **sem tocar no original** e devolve uma cópia ordenada. Segundo o MDN, está disponível em todos os navegadores desde julho de 2023, e o [explorador de recursos](https://web-platform-dx.github.io/web-features-explorer/features/array-by-copy/) o declara “amplamente disponível” desde 4 de janeiro de 2026. A última linha o demonstra: depois de ordenar `available` do maior para o menor, `available[0].name` continua sendo “Catálogo”; o original não mudou.

A função de ordenar precisa de uma explicação, porque é a que mais faz tropeçar. `toSorted` e o seu irmão mais velho `sort` recebem uma **função comparadora** com dois elementos, `a` e `b`, que devolve um número: negativo se `a` vai antes, positivo se vai depois, zero se empatam. `b.responseMs - a.responseMs` devolve um positivo quando `b` é maior, ou seja, `a` vai depois: ordem decrescente. E a armadilha: se você não passa um comparador, `sort` converte tudo em texto e ordena como texto, de modo que `[10, 9, 1].sort()` dá `[1, 10, 9]` (eu medi) e não `[1, 9, 10]`, porque “10” vem antes de “9” alfabeticamente. Além disso, [`sort`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) **modifica o array original**; por isso a regra do curso é usar `toSorted`, que nunca o modifica.

#### 6.2.6 Decidir, repetir e avisar de um erro

Até aqui, cada programa era executado de cima para baixo sem pular nada: todas as linhas, uma vez cada. As contas do painel precisam de mais três coisas. **Decidir**: “se o serviço não respondeu, não o some”. **Repetir**: “faça isto com cada serviço da lista”. E **avisar de um erro**: “este dado não faz sentido; pare e diga”. Além disso, há duas peças de sintaxe que você verá daqui em diante: a palavra `new` e os três pontos `...`. Primeiro a ideia de cada uma, depois o código e, no final, duas páginas que executam todas elas.

**Decidir com `if` e `else`.** Uma [instrução `if`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/if...else) recebe uma **condição** entre parênteses: quase sempre, uma expressão que dá `true` ou `false`, como `service.status === "available"`. A rigor, o `if` aceita qualquer valor e o converte: `false`, `0`, `""` (o texto vazio), `null`, `undefined` e `NaN` contam como falsos (chamam-se [*falsy*](https://developer.mozilla.org/pt-BR/docs/Glossary/Falsy); a lista completa traz mais um par de esquisitices), e todo o resto conta como verdadeiro (*truthy*). Por isso `if ("sí")` entra no bloco e `if (0)` não. Neste curso se escrevem condições que já dão `true` ou `false`, para que se leiam sem ter de pensar em conversões. Se a condição é verdadeira, executa-se o bloco de chaves que vem a seguir; se é falsa, ele é pulado. Com `else` se escreve o outro caminho: o que se faz quando a condição foi falsa. E quando há mais de dois caminhos, encadeiam-se com `else if`: o programa examina as condições em ordem e toma **o primeiro** caminho cuja condição se cumpra; os demais já não são examinados. Na vida diária você faz isso sem pensar: “se chover, levo guarda-chuva; se não, se fizer sol, levo boné; se não, não levo nada”. Um detalhe de forma: quando o bloco tem uma única instrução, as chaves podem ser omitidas e tudo se escreve numa linha (`if (button === null) return;`). Neste curso elas são omitidas só nessas linhas curtas.

**Inverter uma condição com `!`.** O [operador `!`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/Logical_NOT) se lê “não”: `!true` é `false` e `!false` é `true`. Serve para escrever a condição ao contrário sem mudá-la: `if (!allUp)` se lê “se não estão todos no ar”.

**Decidir um valor com o operador ternário.** Muitas vezes a decisão não é “o que eu faço”, e sim “que valor eu uso”. Para isso existe o [operador condicional](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/Conditional_operator), que se chama **ternário** porque tem três partes: `condição ? valorSeSim : valorSeNão`. A expressão inteira *vale* um dos dois, então pode ser guardada numa variável ou colocada num template literal. `` responseMs === null ? "sin respuesta" : `${responseMs} ms` `` diz: “se não há dado, o texto é "sin respuesta"; se há, é o número com a sua unidade”. Use-o quando cada caminho for um valor curto; se cada caminho tem várias instruções, um `if` se lê melhor.

**Repetir com `for…of`.** Os métodos da seção anterior (`filter`, `map`…) percorrem um array por dentro. Às vezes convém percorrê-lo você mesmo, passo a passo, e para isso existe o laço [`for…of`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/for...of): `for (const service of services) { … }` executa o bloco **uma vez para cada elemento**, em ordem, e em cada volta `service` é o elemento dessa volta. Declara-se com `const` porque dentro de uma volta ele não muda; na volta seguinte é outra variável com o elemento seguinte. Dentro do laço, a instrução [`continue`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/continue) diz “esta volta termina aqui; passe ao próximo elemento”. E aparece um operador abreviado: `total += service.responseMs` é o mesmo que `total = total + service.responseMs` (por isso `total` é declarado com `let`: muda a cada volta).

Abra `fig06_04.html` e, antes de olhar o console, **preveja** qual linha o laço imprime para Inventario e qual é o total final:

```html
<!-- fig06_04.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Decidir y repetir</title>
</head>
<body>
  <main>
    <h1>Decidir y repetir</h1>
    <p>Abre la consola de las herramientas del navegador (F12) para ver el resultado.</p>
  </main>
  <script type="module">
    const services = [
      { id: "catalog", name: "Catálogo", status: "available", responseMs: 120 },
      { id: "payments", name: "Pagos", status: "available", responseMs: 480 },
      { id: "inventory", name: "Inventario", status: "down", responseMs: null },
      { id: "notifications", name: "Notificaciones", status: "available", responseMs: 310 },
      { id: "search", name: "Búsqueda", status: "available", responseMs: 950 },
    ];

    // if / else: una decisión con dos caminos.
    const first = services[0];
    if (first.status === "available") {
      console.log(`${first.name} está disponible.`);
    } else {
      console.log(`${first.name} está caído.`);
    }

    // else if: más de dos caminos; se toma el primero cuya condición se cumpla.
    const payments = services[1];
    if (payments.responseMs === null) {
      console.log(`${payments.name} no respondió.`);
    } else if (payments.responseMs > 500) {
      console.log(`${payments.name} respondió lento.`);
    } else {
      console.log(`${payments.name} respondió a tiempo.`);
    }

    // ! invierte un booleano.
    const allUp = services.every((service) => service.status === "available");
    console.log(allUp, !allUp);

    // El operador ternario: una decisión que produce un valor.
    const inventory = services[2];
    const time = inventory.responseMs === null ? "sin respuesta" : `${inventory.responseMs} ms`;
    console.log(`${inventory.name}: ${time}`);

    // for...of: las mismas instrucciones para cada elemento, uno tras otro.
    let total = 0;
    for (const service of services) {
      if (service.responseMs === null) {
        console.log(`${service.name}: sin respuesta, no se suma`);
        continue;
      }
      total += service.responseMs;
      console.log(`${service.name}: ${service.responseMs} ms, van ${total}`);
    }
    console.log(`Total: ${total} ms`);
  </script>
</body>
</html>
```

O console mostra:

```text
Catálogo está disponible.
Pagos respondió a tiempo.
false true
Inventario: sin respuesta
Catálogo: 120 ms, van 120
Pagos: 480 ms, van 600
Inventario: sin respuesta, no se suma
Notificaciones: 310 ms, van 910
Búsqueda: 950 ms, van 1860
Total: 1860 ms
```

Siga o laço volta por volta, como se você fosse o motor: `total` começa em 0; na volta de Catálogo passa a 120, na de Pagos a 600; na de Inventario a condição `service.responseMs === null` é verdadeira, imprime-se o aviso e `continue` pula o resto dessa volta, de modo que `total` continua em 600; depois 910 e 1,860. Pagos tomou o último caminho do seu `if…else if…else` porque 480 não é `null` nem é maior que 500. E `allUp` é `false` porque Inventario está fora do ar, de modo que `!allUp` é `true`. Repare que o laço faz à mão o mesmo que o `reduce` fará na seção seguinte, e com o mesmo cuidado: quem não respondeu não é somado.

**Avisar de um erro com `throw`, e capturá-lo com `try…catch`.** Há situações em que uma função não consegue fazer o seu trabalho: chegou a ela um tempo de resposta que não é um número, ou um arquivo que não existe. Devolver um valor qualquer esconderia o problema. O correto é **lançar** um erro com a instrução [`throw`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/throw): `throw new Error("mensagem")`. Nesse instante a função para e o erro “sobe” até quem a chamou, e até quem chamou essa, e assim por diante, até que alguém o capture. Se ninguém o captura, o programa para e o console o mostra em vermelho: é assim que se veem os erros da seção “O erro que você vai ver”.

Capturá-lo é dizer de antemão “tente isto e, se falhar, faça aquilo”. Isso é o [`try…catch`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/try...catch): dentro de `try { … }` vai o que pode falhar; se uma instrução lança um erro, as que vêm depois dentro do `try` **já não são executadas** e o programa salta para o bloco `catch (error) { … }`, onde `error` é o que foi lançado. Depois do `catch`, o programa segue normalmente. Um erro do JavaScript é um objeto com duas propriedades que você vai ler muito: `error.name`, o tipo de erro (`Error`, `TypeError`…), e `error.message`, o texto que o explica.

**Criar um objeto com `new`.** No `throw` apareceu a palavra `new`. Alguns objetos não se escrevem com chaves, mas são **fabricados** com um *construtor*, uma função especial que monta um objeto de certo tipo e o deixa pronto para uso. O [operador `new`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/new) é a forma de pedir isso: `new Error("Sin conexión")` fabrica um objeto de erro com essa mensagem, e `new Intl.NumberFormat("es-MX")` fabrica um formatador de números para o espanhol do México, que você verá na seção seguinte. Por convenção, os nomes dos construtores começam com maiúscula (`Error`, `Intl.NumberFormat` e, mais adiante, `AbortController` ou `FormData`). Neste curso você não vai escrever construtores próprios; só vai usar os que o navegador traz.

**Os três pontos: a propagação.** Você já a viu em 6.2.1 com objetos: `{ ...service, status: "down" }` copia as propriedades de `service` para um objeto novo e deixa alterar algumas. A [sintaxe de espalhamento](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/Spread_syntax) (*spread*) faz o mesmo em outros dois lugares. **Num array**, `[...times, 210]` cria um array novo com os elementos de `times` e mais um no final; `times` não muda. **Numa chamada de função**, `Math.max(...times)` “espalha” os elementos do array como se você os tivesse escrito um por um, separados por vírgulas: `Math.max(120, 480, 310, 950)`. É útil com funções que recebem qualquer quantidade de argumentos, como `Math.max` ou, na Lição 7, `replaceChildren`.

Abra `fig06_05.html`. **Preveja** antes: será impressa “Esta línea no se ejecuta.” (“Esta linha não é executada.”)? Que tamanho tem `times` depois de criar `withMail`?

```html
<!-- fig06_05.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Avisar de un error, new y propagación</title>
</head>
<body>
  <main>
    <h1>Avisar de un error, new y propagación</h1>
    <p>Abre la consola de las herramientas del navegador (F12) para ver el resultado.</p>
  </main>
  <script type="module">
    // throw: avisar de que algo no tiene sentido y detener lo que se estaba haciendo.
    function checkResponseMs(value) {
      if (typeof value !== "number") {
        throw new Error(`Se esperaba un número y llegó: ${value}`);
      }
      return value;
    }

    // try / catch: intentar algo y, si falla, seguir por otro camino.
    try {
      console.log(checkResponseMs(120));
      console.log(checkResponseMs("rápido"));
      console.log("Esta línea no se ejecuta.");
    } catch (error) {
      console.log(`Se atrapó un ${error.name}: ${error.message}`);
    }
    console.log("El programa sigue.");

    // new: crear un objeto nuevo a partir de un constructor.
    const failure = new Error("Sin conexión");
    console.log(failure.message);
    const format = new Intl.NumberFormat("es-MX");
    console.log(format.format(1860));

    // ...: la propagación, en una llamada, en un arreglo y en un objeto.
    const times = [120, 480, 310, 950];
    console.log(Math.max(...times));
    const withMail = [...times, 210];
    console.log(withMail.length, times.length);
    const mail = { id: "mail", name: "Correo", status: "available", responseMs: 210 };
    const mailDown = { ...mail, status: "down", responseMs: null };
    console.log(mail.status, mailDown.status, mailDown.name);
  </script>
</body>
</html>
```

O console mostra:

```text
120
Se atrapó un Error: Se esperaba un número y llegó: rápido
El programa sigue.
Sin conexión
1,860
950
5 4
available down Correo
```

A primeira chamada a `checkResponseMs` recebe um número e o devolve: imprime-se 120. A segunda recebe o texto `"rápido"`; `typeof` diz `"string"`, cumpre-se a condição do `if` e o erro é lançado. A linha seguinte do `try` nunca é executada, o `catch` recebe o erro e imprime o seu nome e a sua mensagem, e o programa segue. Depois, `new` fabrica um erro que não é lançado (um erro é um objeto como qualquer outro: lançá-lo é uma decisão à parte) e um formatador que escreve 1,860 com a vírgula de milhar usada no México. Por último, a propagação: `Math.max(...times)` dá 950; `withMail` tem 5 elementos e `times` continua com 4; e `mailDown` é uma cópia de `mail` com duas propriedades alteradas e o nome intacto, enquanto `mail` continua disponível.

Com isso você tem todas as peças das contas do painel. Se quiser ver as mesmas ideias com outros exemplos, o guia do MDN dedica um capítulo ao [controle de fluxo e tratamento de erros](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Control_flow_and_error_handling) e outro aos [laços](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Loops_and_iteration).

#### 6.2.7 As contas do painel

Com tudo o que foi visto, as contas se escrevem. A primeira você já tem: `countByStatus`. A segunda, a média, é a que mais ensina. Em `fig06_06.html`:

```html
<!-- fig06_06.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Cuentas con funciones</title>
</head>
<body>
  <main>
    <h1>Cuentas con funciones</h1>
    <p>Abre la consola de las herramientas del navegador (F12) para ver el resultado.</p>
  </main>
  <script type="module">
    const services = [
      { id: "catalog", name: "Catálogo", status: "available", responseMs: 120 },
      { id: "payments", name: "Pagos", status: "available", responseMs: 480 },
      { id: "inventory", name: "Inventario", status: "down", responseMs: null },
      { id: "notifications", name: "Notificaciones", status: "available", responseMs: 310 },
      { id: "search", name: "Búsqueda", status: "available", responseMs: 950 },
    ];

    function countByStatus(list, status) {
      return list.filter((service) => service.status === status).length;
    }

    function averageResponseMs(list) {
      const answered = list.filter((service) => Number.isFinite(service.responseMs));
      if (answered.length === 0) {
        return null;
      }
      const total = answered.reduce((sum, service) => sum + service.responseMs, 0);
      return total / answered.length;
    }

    console.log(countByStatus(services, "available"));
    console.log(countByStatus(services, "down"));
    console.log(averageResponseMs(services));
    console.log(averageResponseMs([]));

    const withoutSearch = services.filter((service) => service.id !== "search");
    const average = averageResponseMs(withoutSearch);
    console.log(average);
    console.log(Math.round(average));
    console.log(average.toFixed(1), typeof average.toFixed(1));
    console.log(new Intl.NumberFormat("es-MX", { maximumFractionDigits: 1 }).format(average));
  </script>
</body>
</html>
```

O console mostra:

```text
4
1
465
null
303.3333333333333
303
303.3 string
303.3
```

`averageResponseMs` faz três coisas, e cada uma é uma decisão:

1. **Fica só com os serviços que trazem um tempo medido** (`filter`). O teste é [`Number.isFinite(service.responseMs)`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite), que responde `true` somente quando o valor é um número de verdade: não `null`, não um texto como `"120"`, não `NaN`. Um serviço fora do ar traz `null` e fica de fora. Repare que a pergunta é “tenho um número para calcular a média?” e não “em que estado está?”: se amanhã aparecesse um estado novo, digamos “lento”, com o seu tempo medido, ele entraria na média sem mudar a função.
2. **Se não sobra nenhum, devolve `null`** e não um número. Calcular a média de nada não é zero: é não ter dado, e novamente `null` diz isso com precisão. Sem essa guarda, dividir por zero daria `NaN`.
3. **Soma com `reduce` e divide pela quantidade deles.**

[`reduce`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) é o método mais difícil de ler e o que mais convém entender. Percorre o array com um **acumulador**: uma variável que guarda o resultado até o momento. Recebe duas coisas: uma função de dois parâmetros (o acumulador e o elemento atual) que devolve o novo valor do acumulador, e o **valor inicial** do acumulador. Em `answered.reduce((sum, service) => sum + service.responseMs, 0)`, o acumulador `sum` começa em `0`, e para cada serviço soma-se o seu `responseMs`: 0 + 120 = 120, 120 + 480 = 600, 600 + 310 = 910, 910 + 950 = 1,860. O resultado, 1,860, é dividido por 4 e dá 465, a cifra que você escreveu à mão na Lição 2.

As últimas linhas da página mostram como se apresenta um número com decimais. Com `withoutSearch` (os serviços sem o de busca), a média é 303.3333333333333; esse número, tal qual, não se mostra a ninguém. Há três formas de arredondá-lo e cada uma devolve algo diferente: [`Math.round`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Math/round) devolve um **número** inteiro (303); [`toFixed(1)`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed) devolve um **texto** com um decimal (“303.3”, e o console o confirma com `typeof`, que diz `string`), de modo que não se pode continuar somando com ele sem convertê-lo; e [`Intl.NumberFormat`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat), que formata segundo o idioma e o país, disponível em todos os navegadores desde 2017. Com `"es-MX"` ele usa o ponto decimal que se usa no México. A regra: **calcula-se com números completos e arredonda-se só no final, para mostrar**.

#### 6.2.8 A média que sai errada

Há uma forma de escrever a média que parece correta e dá uma cifra diferente, sem nenhum erro no console. Está em `fig06_07.html`:

```html
<!-- fig06_07.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>El promedio que sale mal</title>
</head>
<body>
  <main>
    <h1>El promedio que sale mal</h1>
    <p>Abre la consola de las herramientas del navegador (F12) para ver el resultado.</p>
  </main>
  <script type="module">
    const services = [
      { id: "catalog", name: "Catálogo", status: "available", responseMs: 120 },
      { id: "payments", name: "Pagos", status: "available", responseMs: 480 },
      { id: "inventory", name: "Inventario", status: "down", responseMs: null },
      { id: "notifications", name: "Notificaciones", status: "available", responseMs: 310 },
      { id: "search", name: "Búsqueda", status: "available", responseMs: 950 },
    ];

    const total = services.reduce((sum, service) => sum + service.responseMs, 0);
    console.log(total, total / services.length);

    console.log(null + 1, undefined + 1, "5" + 1, "5" - 1);

    const first = [].reduce((sum, service) => sum + service.responseMs, 0);
    console.log(first);

    try {
      [].reduce((sum, service) => sum + service.responseMs);
    } catch (error) {
      console.log(error.name + ": " + error.message);
    }
  </script>
</body>
</html>
```

O console mostra:

```text
1860 372
1 NaN 51 4
0
TypeError: Reduce of empty array with no initial value
```

A primeira linha soma os tempos de **todos** os serviços, inclusive o que está fora do ar, e divide por **cinco**. Dá 372 em vez de 465. Por que não falhou ao somar um `null`? Porque o JavaScript, ao encontrar `120 + null`, **converte o `null` em zero** sem avisar. A soma continua dando 1,860 (o que está fora do ar contribuiu com zero), mas a divisão é por 5 e não por 4. O resultado é um número verossímil, 372, que se parece com um tempo de resposta e do qual ninguém desconfia, e o painel mostraria a cifra errada com total segurança. **Este é o erro silencioso típico dos dados: não há mensagem, há um número que não é o correto.** A segunda linha mostra a família de conversões de onde isso sai: `null + 1` é `1`, `undefined + 1` é `NaN`, `"5" + 1` é `"51"` (o `+` com um texto concatena) e `"5" - 1` é `4` (o `-` converte, sim). Dá para aprender cada regra, mas é mais barato seguir esta: **antes de calcular, verifique se o dado existe**, que é o que o `filter` faz na função acima.

As duas últimas linhas mostram um limite do `reduce`. Com um array vazio e um valor inicial (`0`), ele devolve o valor inicial. Sem valor inicial, tenta usar o primeiro elemento como acumulador, não há primeiro elemento e lança um `TypeError` (quem o captura é o `try…catch` de 6.2.6), cujo texto eu copiei do console do Chrome: “Reduce of empty array with no initial value”. Outro navegador pode redigi-lo de forma diferente. A regra: **`reduce` sempre leva valor inicial**.

### 6.3 Módulos: repartir o programa em arquivos

#### 6.3.1 Por que dividir

Até agora, todo o programa vivia dentro de uma página. Isso serve para um experimento e se torna ingerenciável assim que o painel tem dados, contas e (a partir da Lição 7) desenho. Há uma forma simples de organizar o que você escreve: **cada arquivo faz uma coisa**. Um arquivo guarda os dados, outro as contas, outro une tudo. Quem abre o projeto sabe onde procurar, e o arquivo das contas pode ser reutilizado com outros dados.

Para que um arquivo possa usar o que é de outro, é preciso um mecanismo, e esse mecanismo é o **módulo**. Um arquivo JavaScript é um módulo quando é carregado como tal; o que ele declara dentro é **privado**, a menos que você o marque com `export`, e outro arquivo o traz com `import`. Os três arquivos do painel são:

```js
// fig06_08/services.js
// Los datos del panel. Cada servicio es un objeto; la lista es un arreglo.
// responseMs vale null cuando el servicio no respondió.
export const services = [
  { id: "catalog", name: "Catálogo", status: "available", responseMs: 120 },
  { id: "payments", name: "Pagos", status: "available", responseMs: 480 },
  { id: "inventory", name: "Inventario", status: "down", responseMs: null },
  { id: "notifications", name: "Notificaciones", status: "available", responseMs: 310 },
  { id: "search", name: "Búsqueda", status: "available", responseMs: 950 },
];
```

```js
// fig06_08/stats.js
// Las cuentas del panel. Son funciones puras: reciben la lista, devuelven un
// valor y no tocan nada de afuera.

export function countByStatus(list, status) {
  return list.filter((service) => service.status === status).length;
}

export function averageResponseMs(list) {
  const answered = list.filter((service) => Number.isFinite(service.responseMs));
  if (answered.length === 0) {
    return null;
  }
  const total = answered.reduce((sum, service) => sum + service.responseMs, 0);
  return total / answered.length;
}

export function summarize(list) {
  const average = averageResponseMs(list);
  return {
    available: countByStatus(list, "available"),
    down: countByStatus(list, "down"),
    averageMs: average === null ? null : Math.round(average),
  };
}
```

```js
// fig06_08/main.js
import { services } from "./services.js";
import { summarize } from "./stats.js";

const summary = summarize(services);

console.log(`Disponibles: ${summary.available}`);
console.log(`Caídos: ${summary.down}`);
console.log(
  summary.averageMs === null
    ? "Respuesta promedio: sin datos"
    : `Respuesta promedio: ${summary.averageMs} ms`,
);
console.log(JSON.stringify(summary));
```

`services.js` exporta o array `services`. `stats.js` exporta três funções: as duas contas e uma terceira, `summarize`, que as junta num objeto com as três cifras do resumo. `main.js` importa o que precisa de cada um, calcula e manda o resultado para o console. Segundo a [documentação do MDN sobre módulos](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Modules), uma declaração `import { services } from "./services.js";` traz pelo nome o que o outro arquivo exportou com [`export`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/export) (os nomes entre chaves precisam coincidir exatamente), e o caminho começa com `./` para dizer “na mesma pasta que este arquivo”.

Essa é a forma dos dados que o painel terá nas lições seguintes. Repare em `summarize`: ele devolve um **objeto** com `available`, `down` e `averageMs`. É exatamente o resumo da Lição 2, e na Lição 7 será desenhado na tela.

#### 6.3.2 Como um módulo é carregado

A página que o executa é `fig06_08.html`:

```html
<!-- fig06_08.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Los datos del panel y sus cuentas</title>
  <script type="module" src="fig06_08/main.js"></script>
</head>
<body>
  <main>
    <h1>Los datos del panel y sus cuentas</h1>
    <p>Abre la consola de las herramientas del navegador (F12) para ver el resultado.</p>
  </main>
</body>
</html>
```

Tudo está numa linha: `<script type="module" src="fig06_08/main.js"></script>`. O atributo `type="module"` diz ao navegador que esse arquivo é um módulo e não um script clássico, segundo o [padrão HTML](https://html.spec.whatwg.org/multipage/scripting.html) e a [referência do elemento `script`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Reference/Elements/script). Três consequências disso, que o MDN enumera e que vale a pena aprender de uma vez:

- **É adiado sozinho.** Um módulo é executado *depois* que o navegador leu todo o HTML. Não é preciso `defer` nem colocá-lo no final do `<body>`: pode ser carregado a partir do `<head>`.
- **Usa o modo estrito.** Um módulo funciona sempre em [modo estrito](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Strict_mode), que converte em erros algumas coisas que a linguagem antes tolerava em silêncio (por exemplo, atribuir um valor a uma variável que você nunca declarou: sem modo estrito, esse erro de digitação cria em silêncio uma variável global; em modo estrito, é um `ReferenceError`).
- **Tem o seu próprio escopo.** O que um módulo declara não é visível de fora, nem mesmo pelo console: se em `main.js` há uma variável `summary`, escrever `summary` no console não a encontra. É uma vantagem: dois arquivos podem usar o mesmo nome sem se atropelar. E um incômodo para quem depura: para inspecionar algo, imprime-se com `console.log`.

Ao abrir `fig06_08.html` no navegador, o console mostra:

```text
Disponibles: 4
Caídos: 1
Respuesta promedio: 465 ms
{"available":4,"down":1,"averageMs":465}
```

As mesmas quatro cifras que você escreveu à mão, agora calculadas. E agora, o passo que fecha a lição no projeto: na pasta `revisor`, coloque os três arquivos em `js/` (`js/services.js`, `js/stats.js`, `js/main.js`; o caminho dos `import` não muda porque continuam na mesma pasta) e inclua no `<head>` do seu `index.html`:

```html
<script type="module" src="js/main.js"></script>
```

Recarregue `index.html`: a página se vê exatamente igual, mas no console aparecem as quatro linhas de cima. Compare cada uma com o que diz o resumo do painel: 4 disponíveis, 1 fora do ar, 465 ms. Se coincidem, o modelo de dados reproduz o que você tinha calculado à mão. Se você incluir um serviço no array e recarregar, as cifras do console mudam, e o resumo escrito no HTML não: esse será o trabalho da Lição 7.

#### 6.3.3 Por que não abre com duplo clique

Se você abre `fig06_08.html` com duplo clique no gerenciador de arquivos, o endereço começa com `file:///` e o console mostra um erro vermelho. Copiei-o do Chrome 154 (outro navegador o redige de forma diferente):

```text
Access to script at 'file:///.../programas/06-javascript-datos/fig06_08/main.js' from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: chrome, chrome-experimental-site-token-provider, chrome-extension, chrome-untrusted, data, http, https, isolated-app.
```

É o que a Lição 1 antecipou. Os módulos são pedidos com o mesmo mecanismo com que o navegador pede coisas a outros sites, e esse mecanismo exige um protocolo de rede (`http` ou `https`), não uma leitura de disco. Com `file://`, a origem da página é `null` e a requisição é bloqueada. A solução não é mexer no navegador: é abrir a página a partir do servidor local (`python3 -m http.server 8000 --bind 127.0.0.1`, e `http://localhost:8000/`). É a razão pela qual o curso instala o servidor desde a primeira lição.

## O erro que você vai ver

Esta etapa tem cinco mensagens que você vai ler muitas vezes. Aprendem-se melhor provocando-as de propósito. As cinco foram copiadas do console do Chrome 154 com as páginas de [`programas/06-javascript-datos/`](https://github.com/HabilMX/curso-web/tree/main/programas/06-javascript-datos); o navegador que você usar pode redigi-las de forma diferente, mas elas dizem o mesmo.

### `Cannot read properties of undefined (reading 'name')`

O erro mais frequente do JavaScript. Abra `fig06_09.html`:

```html
<!-- fig06_09.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Leer algo que no existe</title>
</head>
<body>
  <main>
    <h1>Leer algo que no existe</h1>
    <p>Abre la consola de las herramientas del navegador (F12) para ver el resultado.</p>
  </main>
  <script type="module">
    const services = [
      { id: "catalog", name: "Catálogo", status: "available", responseMs: 120 },
      { id: "payments", name: "Pagos", status: "available", responseMs: 480 },
      { id: "inventory", name: "Inventario", status: "down", responseMs: null },
      { id: "notifications", name: "Notificaciones", status: "available", responseMs: 310 },
      { id: "search", name: "Búsqueda", status: "available", responseMs: 950 },
    ];

    const sixth = services[5];
    console.log(sixth.name);
  </script>
</body>
</html>
```

O console mostra, em vermelho:

```text
Cannot read properties of undefined (reading 'name')
```

Leia-o da direita para a esquerda: o programa quis ler a propriedade `name` de algo que é `undefined`. De quê? De `services[5]`. O array tem cinco elementos, com posições de 0 a 4, e pedir a 5 dá `undefined`; e pedir uma propriedade a `undefined` é um erro ([o MDN explica com mais detalhe](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cant_access_property)). À direita da mensagem, o console mostra o arquivo e a linha em que ocorreu; ao clicar nela, as ferramentas abrem essa linha. As soluções são duas: confirmar que você não passa do final (`services.length`, `.at(-1)`) ou, se o elemento pode não existir, usar `?.`: `services[5]?.name` dá `undefined` sem erro.

### `Assignment to constant variable.`

Em `fig06_10.html`, `const total = 0; total = total + 120;`:

```html
<!-- fig06_10.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Reasignar una constante</title>
</head>
<body>
  <main>
    <h1>Reasignar una constante</h1>
    <p>Abre la consola de las herramientas del navegador (F12) para ver el resultado.</p>
  </main>
  <script type="module">
    const total = 0;
    total = total + 120;
    console.log(total);
  </script>
</body>
</html>
```

A mensagem é literalmente essa e diz o que você fez: tentou reatribuir uma `const` ([MDN](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Errors/Invalid_const_assignment)). Se o valor vai mudar, a variável devia ser `let`.

### `Cannot use import statement outside a module`

Em `fig06_11.html`, o mesmo `main.js`, mas com `<script src="...">` sem `type="module"`:

```html
<!-- fig06_11.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Un import sin type="module"</title>
  <script src="fig06_08/main.js"></script>
</head>
<body>
  <main>
    <h1>Un import sin type="module"</h1>
  </main>
</body>
</html>
```

O console mostra:

```text
Cannot use import statement outside a module
```

Um `import` só é entendido dentro de um módulo; um script clássico não sabe o que é isso. Corrige-se acrescentando `type="module"` ao `<script>`.

### `The requested module './fig06_08/services.js' does not provide an export named 'servicios'`

Em `fig06_12.html`, um módulo pede um nome que o outro arquivo não exporta:

```html
<!-- fig06_12.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Importar lo que no se exportó</title>
  <script type="module">
    import { servicios } from "./fig06_08/services.js";

    console.log(servicios.length);
  </script>
</head>
<body>
  <main>
    <h1>Importar lo que no se exportó</h1>
  </main>
</body>
</html>
```

O console mostra:

```text
The requested module './fig06_08/services.js' does not provide an export named 'servicios'
```

Diz com clareza qual arquivo e qual nome. O arquivo exporta `services` (em inglês) e aqui se pediu `servicios`: um nome escrito errado, e os nomes precisam coincidir caractere por caractere. Corrige-se escrevendo o nome como está no `export`.

### `Access to script ... has been blocked by CORS policy`

É o da seção 6.3.3, o que aparece quando você abre com duplo clique em vez de usar o servidor.

## O que se faz errado

**Escrever `var`.** Você já viu por quê: vive na função inteira, é elevada e permite redeclarar, de modo que esconde erros que `let` e `const` mostram. Custo: um nome que muda de valor a partir de um canto do programa que você não esperava.

**Comparar com `==`.** `120 == "120"` dá `true`; num painel que recebe dados de fora, um tempo que chega como texto passaria nas comparações como número. Com `===`, a discrepância salta aos olhos.

**Guardar um número como texto.** `responseMs: "120"` parece o mesmo e já não é: `"120" + 1` dá `"1201"`. Os dados que são quantidades se guardam como números, sem aspas, e a unidade vai no nome.

**Representar “não respondeu” com `0`, com `""` ou com `"sin respuesta"`.** Com `0`, a média premia o serviço fora do ar; com um texto, a soma vira uma concatenação ou um `NaN`. Um dado que falta se guarda como `null`, e as funções decidem o que fazer com ele.

**Calcular a média sem filtrar.** É o 372 em vez do 465 de 6.2.8: um número crível, sem erro e errado. Antes de calcular a média, é preciso ficar com o que de fato tem dado.

**Usar `sort()` onde se queria uma cópia.** `sort` altera o array original, e quem o usava mais acima o vê reordenado sem saber por quê. Com `toSorted` isso não ocorre. E, sem função comparadora, ordena como texto: `[10, 9, 1]` dá `[1, 10, 9]`.

**Continuar calculando com um número já arredondado para texto.** `toFixed` devolve um texto. Se você o soma, concatena. Arredonda-se no final, só para mostrar.

**Um `reduce` sem valor inicial.** Funciona até o dia em que o array chega vazio, e então lança um `TypeError` no pior momento.

**Os mesmos dados escritos em dois lugares.** É o problema com que a lição começa: a tabela diz seis linhas e o resumo diz cinco. Os dados vivem em um só lugar; o resto é calculado.

## Exercícios

### Exercício 1 — Inclua um serviço e veja as cifras mudarem

Na sua cópia de `services.js`, inclua um sexto serviço: `Correo`, `id` `"mail"`, disponível, com 210 ms. Sem mexer em `stats.js` nem em `main.js`, recarregue a página e anote as três cifras. Antes de recarregar, preveja os números: quantos serviços disponíveis haverá e qual será a média. A previsão coincide com o que sai?

### Exercício 2 — Os mais lentos

Escreva em `stats.js` uma função `slowest(list, n)` que devolva os **nomes** dos `n` serviços disponíveis com maior tempo de resposta, do mais lento ao mais rápido. Ela não deve modificar a lista que recebe. Teste-a com `n = 2`, com um `n` maior que a quantidade de serviços disponíveis e com uma lista vazia. Dica: encadeie `filter`, `toSorted`, `slice` e `map`. Dos quatro, [`slice`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) é o único que você ainda não viu: `lista.slice(inicio, fim)` devolve um array **novo** com os elementos desde a posição `inicio` até a anterior a `fim`, sem tocar no original. `[10, 20, 30].slice(0, 2)` dá `[10, 20]`: os dois primeiros.

### Exercício 3 — Contar todos os estados de uma vez

`countByStatus` percorre a lista uma vez para cada estado que você pergunta. Escreva `countsByStatus(list)` que a percorra **uma única vez** com `reduce` e devolva um objeto com uma propriedade para cada estado que aparecer, por exemplo `{ available: 4, down: 1 }`. Deve devolver um objeto sem propriedades para uma lista vazia. Dica: o acumulador é um objeto, e `counts[service.status] ?? 0` lhe dá a contagem atual ou zero se o estado ainda não tinha sido visto. E uma pergunta para depois de resolver: o que acontece se algum serviço chegar com o estado `"toString"`?

### Exercício 4 — Provoque quatro erros e leia-os

Numa cópia do projeto, provoque um por um estes quatro erros e anote a mensagem exata que o seu navegador mostra: (a) pedir um serviço que não existe e ler o seu `name`; (b) importar um nome escrito errado; (c) reatribuir uma `const`; (d) tirar `type="module"` do `<script>`. Para cada um, escreva em uma frase o que a mensagem significa e qual é a correção.

## Soluções

### Solução 1

Com seis serviços (cinco disponíveis, um fora do ar), a previsão é: “Disponibles” 5, “Caídos” 1, e a média dos cinco que responderam é (120 + 480 + 310 + 950 + 210) / 5 = 2,070 / 5 = 414. Eu verifiquei executando o programa: dá 414. O serviço fora do ar continua não contando para a média. O importante do exercício é o que **não** foi preciso tocar: nem as contas nem o programa principal. Você mudou os dados, que vivem em um só lugar, e todo o resto foi recalculado. Esse é o ganho de separar dados e contas.

### Solução 2

Filtram-se os disponíveis (os que estão fora do ar não têm tempo), ordena-se uma cópia do maior para o menor, tomam-se os primeiros `n` e extrai-se o nome:

```js
export function slowest(list, n) {
  return list
    .filter((service) => service.status === "available")
    .toSorted((a, b) => b.responseMs - a.responseMs)
    .slice(0, n)
    .map((service) => service.name);
}
```

Com os cinco serviços originais, `slowest(services, 2)` devolve `["Búsqueda", "Pagos"]` (950 e 480). Com `n` igual a 10, devolve os quatro disponíveis, `["Búsqueda", "Pagos", "Notificaciones", "Catálogo"]`: `slice(0, n)` não falha se `n` é maior que o comprimento, simplesmente devolve tudo. Com uma lista vazia devolve `[]`. A lista original não muda, porque `filter` e `toSorted` devolvem cópias. Se você tivesse usado `sort` sobre `list`, teria reordenado os dados do painel sem que ninguém percebesse.

### Solução 3

```js
export function countsByStatus(list) {
  return list.reduce((counts, service) => {
    counts[service.status] = (counts[service.status] ?? 0) + 1;
    return counts;
  }, Object.create(null));
}
```

Para os cinco serviços devolve `{ available: 4, down: 1 }`, e para `[]` devolve um objeto sem propriedades (o valor inicial, porque não há elementos). O acumulador é o objeto passado como segundo argumento do `reduce`.

**Por que `Object.create(null)` e não `{}`.** É a resposta à pergunta do enunciado. Um objeto escrito como `{}` não está totalmente vazio: [herda](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Object) do JavaScript um punhado de propriedades que você não vê, como `toString`. Se um serviço chega com o estado `"toString"`, `counts["toString"] ?? 0` não dá `0`, e sim essa função herdada, e a conta sai como texto lixo: `'function toString() { [native code] }1'`. Com o estado `"__proto__"` é pior: a atribuição não cria nenhuma propriedade. Eu medi com as duas versões. [`Object.create(null)`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Object/create) fabrica um objeto **sem nada herdado**, um dicionário limpo onde só está o que você guarda, e com ele `"toString"` e `"__proto__"` contam 1 como qualquer outro estado. Hoje os estados são escritos por você, mas a partir da Lição 8 chegarão de fora, e um dado de fora pode trazer qualquer texto. Para cada serviço, `counts[service.status] ?? 0` é a contagem que já havia desse estado, ou zero se é a primeira vez que ele aparece; soma-se um e guarda-se. É uma variante em que o acumulador **é** modificado, o que é normal no `reduce`: o que nunca se modifica é a lista de entrada. Se no futuro houver um terceiro estado, `countsByStatus` o conta sem mudar uma única linha.

### Solução 4

(a) `Cannot read properties of undefined (reading 'name')`. Pediu-se uma posição que não existe e pediu-se uma propriedade ao `undefined` resultante. Correção: verificar o limite do array, ou `services[n]?.name`.

(b) `The requested module './services.js' does not provide an export named 'servicios'` (o caminho muda conforme o arquivo). O nome do `import` não coincide com o do `export`. Correção: escrevê-lo igual, caractere por caractere.

(c) `Assignment to constant variable.` Reatribuiu-se uma `const`. Correção: se vai mudar, declará-la com `let`; se não, não reatribuí-la.

(d) `Cannot use import statement outside a module`. O `<script>` não declara `type="module"`. Correção: acrescentá-lo.

## Como sei que consegui

- [ ] Ao abrir `fig06_08.html` a partir de `http://localhost:8000/`, o console mostra exatamente quatro linhas: `Disponibles: 4`, `Caídos: 1`, `Respuesta promedio: 465 ms` e `{"available":4,"down":1,"averageMs":465}`, e nenhum erro em vermelho.
- [ ] O seu `index.html` carrega `js/main.js` com `<script type="module">`, vê-se igual a antes, e o console mostra as mesmas quatro linhas, que coincidem com as cifras escritas no resumo.
- [ ] Ao abrir `fig06_08.html` com duplo clique (`file://`), aparece o erro de CORS e você sabe explicar por quê.
- [ ] `fig06_07.html` mostra `1860 372` e você consegue explicar por que 372 está errado e 465 está certo.
- [ ] Se você incluir o serviço de e-mail com 210 ms, o console mostra 5 disponíveis, 1 fora do ar e 414 ms sem que você toque em `stats.js`.
- [ ] Você consegue escrever de memória uma função que receba a lista de serviços e devolva quantos estão em um estado dado, usando `filter` e `length`.
- [ ] Você consegue explicar com as suas palavras a diferença entre `const` e `let`, entre `===` e `==`, entre `sort` e `toSorted`, e por que um serviço fora do ar tem `responseMs: null` e não `0`.

## Resumo

Responda sem olhar a lição:

1. Que tipo de valor o `typeof` dá para `120`, para `"120"` e para `true`? E por que `120 === "120"` dá `false`?
2. Que diferença há entre `const` e `let`, e qual você usa por padrão?
3. Como se representa um serviço, e como a lista de serviços? Por que o serviço fora do ar leva `null` e não `0`?
4. O que devolve `filter`, o que `find`, o que `some`? Qual modifica o array original, `sort` ou `toSorted`?
5. Que duas coisas deve fazer uma função de média antes de dividir?
6. Num `try…catch`, o que acontece com as linhas do `try` que vêm depois da que lançou um erro? E quando convém um ternário em vez de um `if`?
7. Que cifra sai ao calcular a média dos cinco serviços do painel sem filtrar o que está fora do ar, e por que ela não é a correta?
8. O que faz `type="module"` num `<script>` e por que um módulo não carrega com `file://`?

## Para ler mais

- [MDN, “Guia de JavaScript”](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide) — o guia oficial da Mozilla, desde a gramática e os tipos até os módulos, na mesma ordem desta lição. Consultado em 7 de outubro de 2026.
- [MDN, “Módulos JavaScript”](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Modules) — `import`, `export`, o escopo de um módulo e o erro de `file://`. Consultado em 7 de outubro de 2026.
- [MDN, “Coleções indexadas”](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Indexed_collections) — os arrays e seus métodos com mais exemplos. Consultado em 7 de outubro de 2026.
- [Especificação da linguagem ECMAScript](https://tc39.es/ecma262/) — a fonte última do que significa cada operador; não é um texto para aprender, e sim para consultar quando uma dúvida não se resolve em outro lugar. Consultado em 7 de outubro de 2026.
