# Lição 8 — Trazer dados: promessas, fetch e async/await

**Tempo:** 2 × 45 min

**O que você constrói:** o painel que pede seus dados a um arquivo JSON do servidor, em vez de trazê-los escritos no código

**O que você aprende:** o que é uma promessa; `fetch` em dois passos; `response.ok`; `async`/`await`; um `try`/`catch` em volta da requisição

## Ao terminar, você vai conseguir

- Explicar o que é uma promessa, em quais três momentos ela pode estar e por que as operações lentas devolvem uma em vez do seu resultado.
- Explicar por que o `fetch` precisa de dois passos (a resposta e o seu corpo) e escrevê-los primeiro com `.then` e depois com `async`/`await`.
- Dizer em que casos a promessa do `fetch` é rejeitada e em quais não, e verificar `response.ok` para não dar por boa uma resposta de erro.
- Mudar o painel para que peça seus dados a `data/services.json` sem mexer nas contas, na ordem nem no desenho.
- Reconhecer a mensagem “Unexpected token '<'” e saber onde procurar a sua causa.

## O porquê antes do como

**Ponto de partida.** Esta lição parte do painel como a lição 7 o deixou. O seu painel desenha a tabela e o resumo a partir dos dados, e a estrutura que ficou é esta:

- `index.html`, com o `<tbody>` e os quatro `<dd>` do resumo vazios, o botão “Ordenar por tiempo de respuesta” e a região do detalhe (`#detail`).
- `css/styles.css`, a folha de estilo das lições 3, 4, 5 e 7.
- `js/services.js`, que exporta o array `services` e que `main.js` importa **ao iniciar**.
- `js/stats.js`, com `summarize` e as duas contas da lição 6.
- `js/state.js`, com o estado do painel (lista, ordem, seleção) e as funções que o alteram.
- `js/view.js`, que desenha o estado no documento, sempre com `textContent`.
- `js/main.js`, que escuta os eventos, altera o estado e desenha de novo.

Hoje muda uma única coisa de fundo: `js/services.js` desaparece, e os serviços passam a viver em `data/services.json`, dentro da pasta `data` que você criou no Exercício 1 da lição 1, um arquivo que o painel **pede** ao servidor. O resto do painel (as contas, a ordem, a seleção, o desenho seguro) fica como estava. Que isso seja possível é a prova de que a separação da lição 7 valeu a pena. E duas coisas que a lição 2 deixou escritas sem funcionar se cumprem hoje: o botão “Revisar ahora” (“Revisar agora”), que volta a pedir os dados, e a “Última revisión” (“Última verificação”) do cabeçalho, que deixa de ser uma hora inventada e diz quando os dados chegaram de verdade.

Este é o arquivo: os mesmos cinco serviços da lição 6, escritos em JSON. As chaves vão entre aspas duplas e o serviço fora do ar leva `null`, as regras que a lição 6 descreveu em 6.2.2:

```json
[
  { "id": "catalog", "name": "Catálogo", "status": "available", "responseMs": 120 },
  { "id": "payments", "name": "Pagos", "status": "available", "responseMs": 480 },
  { "id": "inventory", "name": "Inventario", "status": "down", "responseMs": null },
  { "id": "notifications", "name": "Notificaciones", "status": "available", "responseMs": 310 },
  { "id": "search", "name": "Búsqueda", "status": "available", "responseMs": 950 }
]
```

**Por que o módulo não basta.** Enquanto os dados estavam em um módulo, o painel iniciava com eles na mão: o navegador não podia desenhar a tabela sem tê-los lido, porque vinham no mesmo pacote que o código. Um relatório real não funciona assim. Os dados são produzidos por outro programa, em outro momento, e mudam sem que ninguém toque no código do painel: um serviço que cai às três da manhã não pode esperar que alguém edite `services.js` e publique de novo. Por isso os dados vivem em outro lugar, e para obtê-los é preciso fazer uma requisição HTTP, a mesma que você estudou na lição 0: envia-se, espera-se, recebe-se. Separar o código dos dados é também o que permite que o mesmo painel sirva para qualquer lista de serviços: no dia em que alguém quiser verificar os seus, muda o arquivo, não o programa.

Uma requisição, ao contrário de um módulo, **demora**. E isso obriga a pensar de outra maneira, porque o programa não pode ficar congelado esperando a resposta: a página tem de continuar atendendo os cliques e o teclado enquanto isso. Esta lição é sobre essa espera: como se escreve um programa que pede algo, segue com a sua vida e retoma o trabalho quando a resposta chega. A peça que torna isso possível se chama **promessa**, e é a ideia mais importante da lição.

Pedir algo pela rede também pode **dar errado** de várias maneiras: o arquivo não existe, o servidor não responde, a resposta não é o que você esperava. Hoje você vai aprender a **detectar** cada falha no código, que é o primeiro passo e o que mais se esquece. Mostrá-las na tela de modo que uma pessoa entenda o que aconteceu, pôr um limite na espera e pedir dados a outro servidor é o tema da lição 9, que parte do painel que você terminar hoje. Separar em duas lições tem uma razão: primeiro é preciso entender bem o caminho que dá certo, porque cada falha é um desvio desse caminho.

**Que rota segue.** Primeiro a **promessa** e as duas fases do `fetch`, com `.then`, que é como a web foi escrita durante anos e como você vai encontrar muito código. Segundo `async` e `await`, que dizem o mesmo em forma de texto corrido, com o `try`/`catch` que você já conhece. Terceiro, o painel: um módulo novo que pede os dados e três arquivos que mudam um pouco para recebê-los.

**O que você precisa ter ligado.** Só o servidor local de sempre. As páginas desta lição estão em [`programas/08-traer-datos/`](https://github.com/HabilMX/curso-web/tree/main/programas/08-traer-datos) do [repositório do curso](https://github.com/HabilMX/curso-web); com o repositório baixado no seu computador, ligue o servidor a partir da pasta `programas/` dele:

```bash
cd programas
python3 -m http.server 8000 --bind 127.0.0.1
```

Abra `http://127.0.0.1:8000/08-traer-datos/panel/`. Tenha presente o aviso da lição 1: `fetch` e os módulos não funcionam com `file://`, porque um arquivo aberto assim não tem uma origem que possa ler outras. O [padrão de URL](https://url.spec.whatwg.org/#concept-url-origin) deixa cada navegador decidir que origem tem um arquivo local e recomenda, na dúvida, uma opaca; o Chrome 154 faz assim (no console de uma página aberta com duplo clique, `self.origin` responde `"null"`), e por isso bloqueia essas leituras. Nada mais é necessário: nem Node nem pacotes.

## Os conceitos

São três. Como na lição 7: antes de executar cada figura, **escreva no diário de bordo o que você acha que vai acontecer**.

### 8.1 A promessa e o `fetch` em dois passos

**Uma promessa é um resultado que ainda não chegou.** Quando você pede algo pela rede, o JavaScript não fica esperando de braços cruzados: a página tem de continuar respondendo aos cliques, à rodinha do mouse, ao teclado. Por isso as operações lentas não devolvem o seu resultado, e sim um objeto que o representa: uma **promessa** (*Promise*). Uma promessa está em um de três momentos: **pendente** (ainda não há resultado), **cumprida** (chegou um resultado) ou **rejeitada** (algo falhou). Depois de cumprida ou rejeitada, ela não muda mais. A definição formal está na [especificação do ECMAScript](https://tc39.es/ecma262/#sec-promise-objects); a explicação do MDN sobre [como usar promessas](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Using_promises) é a leitura mais clara.

Uma comparação ajuda. Quando você pede comida no balcão e lhe dão uma senha com um número, a senha não é a comida: é a promessa de que a comida chegará. Enquanto espera, você pode sentar, bater papo ou olhar o celular; não fica imóvel diante do balcão. Quando chamam o seu número, a senha se “cumpre” e você retira a comida; se o prato acabou, a senha é “rejeitada” e lhe dão uma explicação. E uma senha já usada não se usa de novo. Uma promessa do JavaScript é essa senha.

Com uma promessa faz-se o mesmo que com um evento: diz-se a ela o que fazer quando ocorrer. O método `.then(função)` registra “quando você se cumprir, execute isto com o seu resultado” e o método `.catch(função)` registra “se você for rejeitada, execute isto com o motivo”. Cada `.then` devolve por sua vez outra promessa, e por isso podem ser encadeados. Há um terceiro, `.finally(função)`, que é executado nos dois casos, seja cumprida ou rejeitada; serve para o que é preciso fazer aconteça o que acontecer, como escrever o resultado na página.

**O `fetch` precisa de dois passos.** A função `fetch(endereço)` pede um recurso por HTTP e devolve uma promessa de uma **resposta** (`Response`). Mas essa promessa se cumpre assim que chegam os **cabeçalhos** da resposta, não quando chega todo o conteúdo. É o mesmo que você vê na aba Rede das ferramentas do navegador: primeiro chega a linha de status (`200 OK`) e os cabeçalhos, e depois, aos poucos, o corpo. Por isso há um segundo passo: `respuesta.json()` lê o corpo, interpreta-o como JSON e devolve **outra promessa** que se cumpre com o objeto resultante. Está documentado em [MDN: usar `fetch`](https://developer.mozilla.org/pt-BR/docs/Web/API/Fetch_API/Using_Fetch).

Por que separar assim e não entregar tudo de uma vez? Porque com os cabeçalhos já se podem tomar decisões antes de gastar tempo com o corpo: se o código diz que o arquivo não existe, não adianta ler e analisar uma página de erro como se fossem dados. E porque o corpo pode ser enorme: um vídeo ou um arquivo de vários megabytes chega por partes, e o programa pode decidir como lê-lo. Para o painel, o corpo é pequeno, mas a regra é a mesma.

**Preveja:** a figura 8.1 pede `panel/data/services.json` em dois passos e escreve três dados da resposta antes de ler o corpo. O que você acha que dirão `ok` e o tipo de conteúdo?

```html
<!-- fig08_01.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 8.1 — fetch en dos pasos</title>
</head>
<body>
  <main>
    <h1>Fig. 8.1 — fetch en dos pasos</h1>
    <pre id="output">Cargando…</pre>
  </main>

  <script type="module">
    const output = document.querySelector("#output");
    const lines = [];

    fetch("panel/data/services.json")                   // paso 1: llega la respuesta
      .then((response) => {
        lines.push(`estado HTTP: ${response.status}`);
        lines.push(`ok: ${response.ok}`);
        lines.push(`tipo de contenido: ${response.headers.get("content-type")}`);
        return response.json();                         // paso 2: se lee el cuerpo (otra promesa)
      })
      .then((services) => {
        lines.push(`servicios recibidos: ${services.length}`);
        lines.push(`el primero: ${services[0].name}`);
        output.textContent = lines.join("\n");
      });
  </script>
</body>
</html>
```

```text
estado HTTP: 200
ok: true
tipo de contenido: application/json
servicios recibidos: 5
el primero: Catálogo
```

Detenha-se em cada peça, porque você vai precisar de todas:

- **`response.status`** é o código HTTP da lição 0: 200 é “aqui está”, 404 é “isso não existe”, 500 é “o servidor quebrou”.
- **`response.ok`** é uma comodidade: é `true` quando o código está entre 200 e 299. Você vai usá-lo a toda hora, pela razão que vem a seguir.
- **`response.headers.get("content-type")`** diz que tipo de conteúdo o servidor declarou. Aqui `application/json`: o servidor local o deduz da extensão `.json`.
- O **primeiro `.then`** termina com `return response.json()`. Esse `return` é o que encadeia os dois passos: o segundo `.then` já recebe o array de serviços, não a promessa.

**Um 404 não é uma falha para o `fetch`.** Este é o ponto da lição com mais consequências, e quase ninguém o espera. Pense em como a promessa deveria se comportar se você pede um arquivo que não existe. Muita gente supõe que ela é rejeitada, porque “algo deu errado”. **Preveja** o que faz a figura 8.2, que pede `missing.json`, um arquivo que não existe: o `.then` é executado ou o `.catch`?

```html
<!-- fig08_02.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 8.2 — un 404 no rechaza la promesa</title>
</head>
<body>
  <main>
    <h1>Fig. 8.2 — un 404 no rechaza la promesa</h1>
    <pre id="output">Cargando…</pre>
  </main>

  <script type="module">
    const output = document.querySelector("#output");
    const lines = [];

    fetch("missing.json")
      .then((response) => {
        lines.push("la promesa SE CUMPLIÓ (no se rechazó)");
        lines.push(`estado HTTP: ${response.status}`);
        lines.push(`ok: ${response.ok}`);
      })
      .catch((error) => {
        lines.push(`la promesa se rechazó: ${error.message}`);   // esto NO se ejecuta con un 404
      })
      .finally(() => {
        output.textContent = lines.join("\n");
      });
  </script>
</body>
</html>
```

```text
la promesa SE CUMPLIÓ (no se rechazó)
estado HTTP: 404
ok: false
```

A promessa **se cumpriu**. Do ponto de vista do `fetch`, o servidor respondeu (disse “não encontrei isso”) e a comunicação correu bem; `ok` é `false` e o `status` é 404, mas o `.catch` não foi executado. Se o seu código faz `fetch(url).then(r => r.json())` sem olhar `ok`, um 404 ou um 500 são tratados como dados bons. Então ele falha mais adiante, longe da causa, com uma mensagem desconcertante (você verá em “O erro que você vai ver”). A regra é: **a promessa é rejeitada quando não há uma resposta que a página possa usar —nenhuma chegou, ou chegou mas o navegador não deixa lê-la, como acontece com o CORS—; qualquer resposta legível, mesmo um erro, a cumpre**.

A lista completa, para que você não esqueça. As duas últimas linhas você vai provocar na lição 9; estão aqui porque a tabela só é útil completa:

| Situação | A promessa do `fetch` | Como você detecta |
|---|---|---|
| Chega uma resposta 200 a 299 | cumpre-se | `response.ok === true` |
| Chega uma resposta 404, 500 ou outro código de erro | **cumpre-se** | `response.ok === false` |
| Não há conexão, o servidor não existe ou está desligado | é rejeitada com `TypeError` | `catch` |
| O navegador bloqueia a leitura por CORS | é rejeitada com `TypeError` | `catch` |
| O tempo limite se esgota **antes** de chegarem os cabeçalhos | é rejeitada com `TimeoutError` | `catch` e `error.name` |

Observe que duas linhas da tabela produzem o mesmo `TypeError`. Não é um descuido: a partir do código da página **não se pode distinguir** uma falta de conexão de um bloqueio por CORS, em parte de propósito: assim uma página alheia não obtém informação sobre a rede de quem a visita. A explicação do que aconteceu está no console, e você a lerá na lição 9.

### 8.2 `async`, `await` e o `try` em volta da requisição

**O mesmo programa, escrito em linha reta.** Encadear `.then` funciona, mas um programa com três ou quatro passos e um tratamento de erros vira uma escada de funções dentro de funções. Em 2017, o JavaScript acrescentou uma sintaxe para escrever o mesmo como se o código esperasse de verdade: `async` e `await`. Não é outra coisa: **é a mesma promessa com outra forma**. Aplica-se assim:

- Uma função marcada com **`async`** sempre devolve uma promessa. O valor que a função devolve com `return` é aquele com que essa promessa se cumpre, e se a função lança um erro, a promessa é rejeitada.
- Dentro dela, **`await promesa`** pausa *essa função* (não a página) até que a promessa se cumpra, e entrega o seu resultado. Se a promessa é rejeitada, `await` lança o erro como uma exceção, que se captura com o `try`/`catch` de sempre.
- Fora de uma função `async`, `await` só pode ser usado no nível superior de um **módulo**, que é o caso dos `<script type="module">` das figuras desta lição. (É outra vantagem dos módulos.) Está documentado em [MDN: `async function`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/async_function) e [`await`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/await).

Volte à senha do balcão: `await` é dizer “eu espero aqui até chamarem o meu número”. A diferença com a vida real é que quem espera é **somente essa função**; o resto da página continua trabalhando. Por isso `await` não congela nada: o navegador deixa de lado a função em pausa, atende o resto e a retoma exatamente nessa linha quando a promessa se cumpre.

Na figura a seguir reaparecem três peças que a lição 6 apresentou em “Decidir, repetir e avisar de um erro”: `if (condição) { … }`, que executa um bloco apenas quando a condição é verdadeira; `throw new Error("texto")`, que cria um objeto de erro com essa mensagem (`new` é o que fabrica um objeto novo a partir de um molde, aqui `Error`) e o **lança**, isto é, interrompe a função nessa linha; e `try { … } catch (error) { … }`, que tenta o primeiro bloco e, se algo for lançado dentro dele, salta para o segundo com o erro na mão. Se alguma das três não lhe soa familiar, volte a essa seção antes de seguir: aqui elas são usadas a toda hora.

A figura 8.3 é o mesmo `fetch` da 8.1, agora em linha reta, com a verificação de `ok` que faltava, e testada contra o arquivo bom e contra o que não existe. **Preveja** o que dirá para cada um:

```html
<!-- fig08_03.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 8.3 — async y await, con la revisión de ok</title>
</head>
<body>
  <main>
    <h1>Fig. 8.3 — async y await, con la revisión de ok</h1>
    <pre id="output">Cargando…</pre>
  </main>

  <script type="module">
    const output = document.querySelector("#output");

    async function requestServices(url) {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`El servidor respondió con el código ${response.status}.`);
      }
      return await response.json();
    }

    async function tryUrl(url) {
      try {
        const services = await requestServices(url);
        return `${url}: llegaron ${services.length} servicios`;
      } catch (error) {
        return `${url}: falló — ${error.message}`;
      }
    }

    const results = [await tryUrl("panel/data/services.json"), await tryUrl("missing.json")];
    output.textContent = results.join("\n");
  </script>
</body>
</html>
```

```text
panel/data/services.json: llegaron 5 servicios
missing.json: falló — El servidor respondió con el código 404.
```

Compare com a figura 8.1 e repare em três mudanças: desapareceram as funções aninhadas; o passo 1 e o passo 2 se veem como duas linhas com `await`; e apareceu `if (!response.ok) throw new Error(...)`, que converte uma resposta de erro em um erro de verdade, e assim o `catch` de quem chama a trata como qualquer outra falha. **Esse `if` é a linha mais importante da lição.** Se você só vai lembrar de uma, que seja esta.

Leia também como o trabalho se divide entre as duas funções. `requestServices` não decide o que fazer com uma falha: só a **avisa**, lançando um erro com uma mensagem clara. `tryUrl` é quem decide: captura o erro e o converte em uma linha de texto. É a mesma divisão que você vai usar no painel: o módulo que pede os dados avisa; quem o chama decide o que fazer.

E um cuidado que produz erros reais: esquecer o `await`. `const services = requestServices(url)` sem `await` não dá os serviços, dá a *promessa* dos serviços; se você a imprime, verá `Promise { <pending> }` e, se a usa como array, nada funciona. Não há um erro ao esquecê-lo, só um resultado absurdo.

**Em que ordem as coisas acontecem.** Uma função `async` não pausa ao ser chamada: é executada normalmente, linha por linha, **até o primeiro `await`**. Ali ela se põe de lado, e quem a chamou segue com a sua próxima linha. Quando a promessa se cumpre, a função continua a partir desse `await`. Isso explica algo que confunde muito no começo: o código que está escrito *depois* de chamar uma função `async` pode ser executado *antes* do código que está escrito *dentro* dela, depois do seu `await`. O Exercício 3 pede que você preveja essa ordem; faça-o com calma, porque entendê-la poupa horas de depuração.

### 8.3 O painel pede seus dados

Com o que foi visto, você já pode mudar o painel. São cinco arquivos, e vale a pena ver primeiro o plano completo, antes do código:

| Arquivo | O que muda | Por quê |
|---|---|---|
| `js/services.js` | desaparece | os dados agora vivem em `data/services.json` |
| `js/load.js` | é novo | pede os dados e devolve um array, ou lança um erro |
| `js/state.js` | o estado começa sem serviços e lembra quando chegaram | ao abrir a página ainda não há dados |
| `js/view.js` | escreve a hora da “Última revisión” | a hora deixa de estar escrita à mão |
| `index.html` | dois `id` novos | para que o código encontre a hora e o botão “Revisar ahora” |
| `js/main.js` | pede os dados ao iniciar e com “Revisar ahora” | é quem junta as peças |

`js/stats.js` e `css/styles.css` não mudam. Que a maior mudança do painel até agora deixe intactos as contas e o aspecto é a recompensa de ter separado as responsabilidades na lição 7.

**Passo 1: o módulo que pede os dados.** O módulo novo, `js/load.js`, é escrito com uma regra: **não toca o documento**. Pede os dados e devolve um array, ou lança um erro com uma mensagem. Não sabe se há uma tabela, um aviso ou uma pessoa olhando; quem decide como mostrar é outro arquivo. É a mesma divisão da figura 8.3: `requestServices` avisava e `tryUrl` decidia.

Antes do código, uma ferramenta nova e duas conhecidas. No final há uma função pequena, `isService`, que usa duas ferramentas da lição 6 —`typeof`, que diz de que tipo é um valor, e `every`, que pergunta se **todos** os elementos de um array cumprem uma condição— e uma nova, `Number.isFinite(valor)`, que é verdadeira somente para um número de verdade (não para o texto `"120"`, nem para `NaN`, nem para `Infinity`).

```js
// panel/js/load.js
// Pide la lista de servicios y devuelve un arreglo, o lanza un Error.
// No toca el documento.

export async function loadServices(url) {
  // Paso 1: la respuesta.
  const response = await fetch(url);

  // fetch NO rechaza con un 404 o un 500: hay que mirarlo.
  if (!response.ok) {
    throw new Error(`El servidor respondió con el código ${response.status}.`);
  }

  // Paso 2: el cuerpo, leído como JSON.
  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("La respuesta no es una lista de servicios.");
  }
  if (!data.every(isService)) {
    throw new Error("Algún servicio de la lista llegó incompleto o con datos de otro tipo.");
  }
  return data;
}

// Un servicio, tal como lo entiende el panel: un objeto (no null) con sus cuatro claves,
// cada una del tipo que el resto del código espera.
function isService(item) {
  return typeof item === "object" && item !== null &&
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.status === "string" &&
    (item.responseMs === null || Number.isFinite(item.responseMs));
}
```

Leia o código com estas perguntas:

- **Onde estão os dois passos?** Nas duas linhas com `await`: `await fetch(url)` traz a resposta e `await response.json()` lê o seu corpo. Entre as duas está a verificação de `ok`, no único lugar em que faz sentido: com a resposta na mão e antes de gastar tempo com o corpo.
- **Por que não há nenhum `try` aqui?** Porque este módulo não decide nada sobre as falhas: se o `fetch` é rejeitado ou o `json()` não consegue ler o corpo, o erro segue o seu caminho até quem chamou `loadServices`, que é quem sabe o que fazer. Um `try` que captura um erro só para lançá-lo de novo igual não acrescenta nada. Na lição 9 este arquivo terá, sim, `try`, porque ali cada falha será **traduzida** em uma frase diferente.
- **O que fazem `Array.isArray` e `isService`?** Verificam a forma de um dado de fora antes de deixá-lo passar. `Array.isArray` confere que o que chegou seja uma lista; `data.every(isService)` confere que **cada** elemento seja um objeto com `id`, `name` e `status` de texto, e `responseMs` número ou `null`. A segunda verificação não é um enfeite. Um arquivo com `[null]` é JSON perfeitamente válido e é um array; sem ela, esse `null` chegaria até `summarize`, que tentaria ler `service.status` de `null`, e o programa pararia com um `TypeError` longe da causa. O mesmo com um `"responseMs": "120"` escrito entre aspas: a média somaria textos. Uma validação mais completa —valores permitidos, faixas, chaves sobrando, mensagens que digam *qual* elemento falhou— é o tema da lição 6 do [curso de TypeScript](https://www.habil.mx/pt/cursos/typescript/). E a outra defesa continua de pé: o painel desenha tudo com `textContent` e o selo usa uma lista fechada, então um texto estranho se vê estranho, mas não executa nada.

**Passo 2: o estado começa vazio.** Na lição 7, `createState(services)` recebia os serviços, porque ao iniciar eles já estavam lá. Agora não: ao abrir a página ainda não há nenhum, é preciso pedi-los. Então `createState()` já não recebe nada e começa com uma lista vazia, e aparece uma função, `loadSucceeded`, que guarda o que chegou. Guarda também um campo novo, `checkedAt`: o **momento** em que os dados chegaram, que é o que o cabeçalho vai mostrar. Esse momento é passado por quem carrega, como um objeto `Date` (`new Date()` fabrica um com a data e a hora atuais). E ela desmarca o serviço escolhido, porque depois de uma nova verificação a lista pode ser diferente e o escolhido poderia já não existir.

```js
// panel/js/state.js
// El estado del panel y las únicas formas de cambiarlo.
// No toca el documento: por eso se puede probar sin pantalla.

export function createState() {
  return {
    services: [],           // vacío al arrancar: los datos hay que pedirlos
    checkedAt: null,        // cuándo llegaron los datos por última vez (un Date), o null
    sortByTime: false,      // false = en el orden original; true = del más rápido al más lento
    selected: null,         // el id del servicio elegido, o null
  };
}

export function loadSucceeded(state, services, checkedAt) {
  state.services = services;
  state.checkedAt = checkedAt;
  state.selected = null;
}

export function toggleSort(state) {
  state.sortByTime = !state.sortByTime;
}

// Elegir el que ya estaba elegido lo deselecciona.
export function select(state, id) {
  state.selected = state.selected === id ? null : id;
}

// Lo que se debe mostrar, calculado a partir del estado cada vez.
// toSorted devuelve una copia ordenada: el arreglo de los datos no se toca.
export function visible(state) {
  if (!state.sortByTime) {
    return state.services;
  }
  // Los que no tienen medida (null) van al final.
  return state.services.toSorted((a, b) => (a.responseMs ?? Infinity) - (b.responseMs ?? Infinity));
}

export function selectedService(state) {
  return state.services.find((service) => service.id === state.selected) ?? null;
}
```

O resto do arquivo é o da lição 7 sem mudanças: ordenar, escolher e calcular o visível não dependem de onde vieram os dados.

**Passo 3: a view escreve a hora.** A view ganha uma função, `renderCheckedAt`, que cria um elemento `<time>`, como o que você escreveu à mão na lição 2, com o dado para as máquinas em `dateTime` (`toISOString()` o dá no formato que o padrão pede) e o texto para as pessoas feito por [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat), que em `es-MX` escreve algo como “7 de octubre de 2026 a las 12:03 p.m.”. É o mesmo tipo de formatador que a lição 6 usou para os números, agora para datas. Se ainda não chegou nada, `checkedAt` é `null` e a função não faz nada: o cabeçalho fica com “todavía no” (“ainda não”), porque uma hora inventada, em um painel que de fato verifica, seria uma mentira. O resto de `render` é o da lição 7, com uma linha a mais no início.

```js
// panel/js/view.js
// Dibuja el estado en el documento, con la hora en que llegaron los datos.
// Todo texto de los datos entra con textContent.
import { summarize } from "./stats.js";
import { visible, selectedService } from "./state.js";

// Lista cerrada de estados que el panel conoce. Un valor que no esté aquí no llega a una clase.
const LABELS = { available: "Disponible", down: "Caído" };

// La fecha y la hora de la última revisión, escritas para una persona y a la manera de México.
const TIME_FORMAT = new Intl.DateTimeFormat("es-MX", { dateStyle: "long", timeStyle: "short" });

function label(status) {
  return Object.hasOwn(LABELS, status) ? LABELS[status] : "Desconocido";
}

function createRow(service, isSelected) {
  const row = document.createElement("tr");
  if (isSelected) row.classList.add("selected");

  const nameCell = document.createElement("th");
  nameCell.scope = "row";
  nameCell.textContent = service.name;

  const statusCell = document.createElement("td");
  const badge = document.createElement("span");
  badge.className = Object.hasOwn(LABELS, service.status) ? `status status-${service.status}` : "status";
  badge.textContent = label(service.status);
  statusCell.append(badge);

  const timeCell = document.createElement("td");
  timeCell.className = "number";
  timeCell.textContent = service.responseMs === null ? "sin respuesta" : `${service.responseMs} ms`;

  const actionCell = document.createElement("td");
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.id = service.id;
  button.setAttribute("aria-pressed", String(isSelected));
  const hint = document.createElement("span");
  hint.className = "visually-hidden";
  hint.textContent = ` de ${service.name}`;
  button.append("Ver detalle", hint);
  actionCell.append(button);

  row.append(nameCell, statusCell, timeCell, actionCell);
  return row;
}

function describe(service) {
  const time = service.responseMs === null ? "sin respuesta" : `responde en ${service.responseMs} ms`;
  return `${service.name}: ${label(service.status).toLowerCase()}, ${time}.`;
}

function renderCheckedAt(checkedAt, target) {
  if (checkedAt === null) return;
  const time = document.createElement("time");
  time.dateTime = checkedAt.toISOString();
  time.textContent = TIME_FORMAT.format(checkedAt);
  target.replaceChildren(time);
}

// elements = { checkedAt, total, available, down, average, body, detail, sortButton }
export function render(state, elements) {
  const { services } = state;
  renderCheckedAt(state.checkedAt, elements.checkedAt);

  const summary = summarize(services);
  elements.total.textContent = String(services.length);
  elements.available.textContent = `${summary.available} de ${services.length}`;
  elements.down.textContent = String(summary.down);
  elements.average.textContent = summary.averageMs === null ? "sin datos" : `${summary.averageMs} ms`;

  elements.sortButton.setAttribute("aria-pressed", String(state.sortByTime));

  const rows = visible(state).map((service) => createRow(service, service.id === state.selected));
  elements.body.replaceChildren(...rows);

  const chosen = selectedService(state);
  elements.detail.textContent = chosen === null ? "Elige un servicio para ver su detalle." : describe(chosen);
}
```

**Passo 4: o HTML ganha dois nomes.** É o `index.html` da lição 7 com duas mudanças: o cabeçalho deixa a hora escrita à mão e leva em seu lugar `<span id="checked-at">todavía no</span>`, e “Revisar ahora” ganha o `id` que a lição 2 anunciou, `check-now`. Sem esses `id`, o código não teria como encontrar esses dois elementos.

```html
<!-- panel/index.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Revisor de servicios</title>
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="css/styles.css">
  <script type="module" src="js/main.js"></script>
</head>
<body>
  <header class="page-header">
    <h1>Revisor de servicios</h1>
    <p>Última revisión: <span id="checked-at">todavía no</span></p>
    <nav>
      <p>Ir a: <a href="#summary">Resumen</a> o <a href="#services">Servicios</a></p>
    </nav>
  </header>

  <main class="layout">
    <section id="summary">
      <h2>Resumen</h2>
      <dl class="summary">
        <div>
          <dt>Servicios revisados</dt>
          <dd id="summary-total"></dd>
        </div>
        <div>
          <dt>Disponibles</dt>
          <dd id="summary-available"></dd>
        </div>
        <div>
          <dt>Caídos</dt>
          <dd id="summary-down"></dd>
        </div>
        <div>
          <dt>Respuesta promedio</dt>
          <dd id="summary-average"></dd>
        </div>
      </dl>
    </section>

    <section id="services">
      <h2>Servicios</h2>

      <div class="controls">
        <p class="field">
          <label for="search">Buscar servicio</label>
          <input type="search" id="search" name="search">
        </p>

        <fieldset>
          <legend>Mostrar</legend>
          <label><input type="radio" name="filter" value="all" checked> Todos</label>
          <label><input type="radio" name="filter" value="available"> Disponibles</label>
          <label><input type="radio" name="filter" value="down"> Caídos</label>
        </fieldset>

        <p><button type="button" id="check-now">Revisar ahora</button></p>
        <p><button type="button" id="sort" aria-pressed="false">Ordenar por tiempo de respuesta</button></p>
      </div>

      <div class="table-scroll" role="region" aria-labelledby="table-caption" tabindex="0">
        <table>
          <caption id="table-caption">Estado de los servicios en la última revisión</caption>
          <thead>
            <tr>
              <th scope="col">Servicio</th>
              <th scope="col">Estado</th>
              <th scope="col" class="number">Tiempo de respuesta</th>
              <th scope="col">Acción</th>
            </tr>
          </thead>
          <tbody id="services-body"></tbody>
        </table>
      </div>

      <p id="detail" role="status"></p>
    </section>
  </main>

  <footer>
    <p>Datos de ejemplo del archivo data/services.json.</p>
  </footer>
</body>
</html>
```

**Passo 5: `main.js` pede os dados.** Já não importa `services.js`: importa `loadServices` e chama uma função nova, `load`, ao iniciar e cada vez que alguém pressiona “Revisar ahora”. Antes de lê-la, um detalhe de escrita que aparece pela primeira vez: `let services;` declara a variável **sem valor**, fora do `try`, e dentro do `try` ela recebe uma atribuição. É necessário assim porque uma variável declarada dentro de um bloco `{ … }` só existe dentro desse bloco, e `services` é necessária depois, fora dele.

```js
// panel/js/main.js
// Junta las piezas: pide los datos, guarda el resultado en el estado y dibuja.
import { loadServices } from "./load.js";
import { createState, loadSucceeded, toggleSort, select } from "./state.js";
import { render } from "./view.js";

const elements = {
  checkedAt: document.querySelector("#checked-at"),
  total: document.querySelector("#summary-total"),
  available: document.querySelector("#summary-available"),
  down: document.querySelector("#summary-down"),
  average: document.querySelector("#summary-average"),
  body: document.querySelector("#services-body"),
  detail: document.querySelector("#detail"),
  sortButton: document.querySelector("#sort"),
  checkNow: document.querySelector("#check-now"),
};

const state = createState();

async function load() {
  let services;
  try {
    services = await loadServices("data/services.json");
  } catch (error) {
    // Por ahora la falla solo queda en la consola. La lección 9 la lleva a la pantalla.
    console.error(`No se pudieron cargar los servicios: ${error.message}`);
    return;
  }
  loadSucceeded(state, services, new Date());
  render(state, elements);
}

// Cambiar el estado y dibujar. Al volver a dibujar las filas, el botón que tenía el foco
// desaparece y aparece otro igual: hay que devolverle el foco a quien lo tenía.
function update(change) {
  const focusedId = document.activeElement?.dataset?.id;
  change();
  render(state, elements);
  if (focusedId !== undefined) {
    elements.body.querySelector(`button[data-id="${CSS.escape(focusedId)}"]`)?.focus();
  }
}

elements.sortButton.addEventListener("click", () => update(() => toggleSort(state)));
elements.checkNow.addEventListener("click", load);

// Delegación: un solo oyente en el <tbody> atiende los botones de todas las filas.
elements.body.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-id]");
  if (button === null) return;
  update(() => select(state, button.dataset.id));
});

load();
```

A função `load` tem três partes, e a ordem importa:

1. **Tenta** pedir os dados, dentro de um `try`.
2. Se falha, **avisa** no console com `console.error` e termina com `return`. A tabela fica como estava.
3. Se deu certo, **guarda** no estado e **desenha**.

Repare que o `try` envolve **somente a requisição**, não o desenho. Se o desenho tivesse um erro de programação, não queremos que o `catch` o capture e o disfarce de “não foi possível carregar os serviços”: queremos vê-lo no console tal qual, com o seu arquivo e a sua linha. Um `try` tão grande quanto a função inteira esconde erros que não têm nada a ver com a rede.

E seja honesto com o que este painel ainda não faz: se a requisição falha, a pessoa não vê nada. A tabela fica vazia, o resumo também, e a única pista está no console, que ninguém além de quem programa abre. Enquanto carrega, tampouco se vê nenhum aviso. É um painel que funciona no caminho feliz e que **detecta** as falhas, mas ainda não as **conta**. Contá-las bem —carregando, erro e vazio, cada uma com o seu aviso e anunciada a um leitor de tela— é o trabalho da lição 9, e essa separação deixa você ver com clareza o que cada parte acrescenta.

**Como você verifica.** Com o servidor ligado, abra `http://127.0.0.1:8000/08-traer-datos/panel/`. O resumo deve dizer 5, 4 de 5, 1 e 465 ms, como na lição 7, e o cabeçalho, a data e a hora deste momento. Pressione “Ordenar por tiempo de respuesta” e escolha um serviço: tudo funciona igual a antes, porque essas partes não mudaram. Pressione “Revisar ahora” com o teclado: a hora do cabeçalho é escrita de novo e o foco fica no botão, porque o botão nunca desaparece. Foi assim que se verificou no Chrome 154, também com a janela a 320 px, onde a página não transborda.

Agora provoque uma falha, para ver o que o painel faz com ela. Em `js/main.js`, troque temporariamente `"data/services.json"` por `"data/missing.json"` e recarregue. A tabela e o resumo ficam vazios, o cabeçalho continua dizendo “todavía no”, e o console do Chrome mostra duas linhas vermelhas: a do navegador, `Failed to load resource: the server responded with a status of 404 (File not found)`, e a sua, `No se pudieron cargar los servicios: El servidor respondió con el código 404.` (“Não foi possível carregar os serviços: O servidor respondeu com o código 404.”). A primeira é escrita pelo navegador por conta própria diante de qualquer resposta de erro; a segunda é a que o seu `catch` escreveu. Desfaça a mudança ao terminar.

## O erro que você vai ver

**`Unexpected token '<'`.** É a consequência de esquecer o `ok` ou de apontar para um endereço errado que, além disso, não responde com um erro, mas com uma página. A figura 8.4 pede uma página HTML e a lê como se fosse JSON:

```html
<!-- fig08_04.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 8.4 — leer como JSON algo que no lo es</title>
</head>
<body>
  <main>
    <h1>Fig. 8.4 — leer como JSON algo que no lo es</h1>
    <pre id="output">Cargando…</pre>
  </main>

  <script type="module">
    const output = document.querySelector("#output");

    const response = await fetch("fig08_01.html");   // existe, responde 200... pero es una página
    output.textContent = `código: ${response.status}, ok: ${response.ok}\ntipo: ${response.headers.get("content-type")}`;
    try {
      await response.json();
    } catch (error) {
      output.textContent += `\n${error.name}: ${error.message}`;
    }
  </script>
</body>
</html>
```

```text
código: 200, ok: true
tipo: text/html
SyntaxError: Unexpected token '<', "<!-- fig08"... is not valid JSON
```

(A terceira linha é a mensagem do Chrome; o Firefox diz algo como “JSON.parse: unexpected character at line 1 column 1”, mas o nome, `SyntaxError`, é o mesmo.) Leia com calma: o servidor respondeu **200**, `ok` é `true`, e não houve nenhum problema de conexão. A falha está no conteúdo: o tipo declarado é `text/html`, e o `.json()` esbarrou, no primeiro caractere, no `<` com que a página começa (aqui, o do comentário `<!-- fig08_01.html -->`; em outra página seria o de `<!DOCTYPE html>`), que não pode aparecer em JSON. Entre aspas, o Chrome mostra os primeiros caracteres do que chegou, e essa é a melhor pista: se começam com `<`, chegou uma página.

“Unexpected token '<'” é quase sempre a assinatura de “chegou uma página HTML onde eu esperava JSON”: um endereço mal escrito, uma página de erro do servidor, ou um redirecionamento para a tela de login. Veja na aba Rede o que realmente chegou: o código, o tipo de conteúdo e, na visualização da resposta, o texto. Se você fizer o teste no painel, trocando em `main.js` o endereço por `"index.html"`, o console diz `No se pudieron cargar los servicios: Unexpected token '<', "<!-- panel"... is not valid JSON`: o mesmo erro, agora capturado pelo seu `catch`. É uma mensagem para quem programa, não para quem usa o painel; na lição 9 você vai traduzi-la para uma frase que qualquer um entenda.

## O que se faz errado

- **Não verificar `response.ok`.** É o erro da figura 8.2. Um 404 ou um 500 entra no programa como se fossem dados, e a falha real aparece longe da causa. A correção é a linha `if (!response.ok) throw …`, sempre.
- **Deixar o `catch` vazio.** `catch {}` faz qualquer falha desaparecer sem deixar rastro: o painel simplesmente não mostra nada e ninguém sabe por quê. Todo `catch` deve fazer algo visível: avisar a pessoa, ou deixar o detalhe no console.
- **Envolver tudo em um único `try`.** Se o `try` abrange a requisição *e* o desenho, um erro de programação no desenho se apresenta como uma falha de rede. O `try` vai em volta do que pode falhar por causas de fora, e nada mais.
- **Esquecer o `await`.** O valor que você obtém é uma promessa, não o resultado. Se algo mostra `[object Promise]` na tela, é isto.
- **Misturar a requisição com o desenho.** Uma função que faz `fetch` e ao mesmo tempo constrói linhas não pode ser testada nem reutilizada. `js/load.js` pede, `js/state.js` lembra, `js/view.js` desenha.
- **Mostrar com `innerHTML` os dados que chegaram.** O que vem de fora é um dado de fora, ainda que venha do seu próprio servidor, porque amanhã esse servidor pode ser outro. O princípio da lição 7 continua vigente sem mudanças.
- **Abrir o painel com `file://`.** O `fetch` não pode ler arquivos locais a partir de uma página aberta com duplo clique. Se o console fala de CORS e o endereço começa com `file://`, a causa é essa: sirva a pasta com `python3 -m http.server`.

## Exercícios

### Exercício 1 — A figura 8.2, com `await`

Reescreva a figura 8.2 com `await` e `try`/`catch` em vez de `.then`, `.catch` e `.finally`. A página deve mostrar exatamente as mesmas três linhas que a original. Antes de escrevê-la, decida que parte do código original se converte no `try`, qual no `catch` e o que acontece com o `.finally`.

### Exercício 2 — Uma mensagem por tipo de problema

Hoje qualquer código de erro produz “El servidor respondió con el código N.” Mude-o para que um 404 diga “No se encontró la lista de servicios.” e um código de 500 em diante diga “El servidor tuvo un problema (código N). Intenta de nuevo en un momento.” Os demais códigos conservam a mensagem atual. Decida em que arquivo vai a mudança e por que ela não toca nem `js/view.js` nem `js/state.js`.

### Exercício 3 — Em que ordem?

Antes de executá-lo, escreva no seu diário de bordo em que ordem aparecerão as cinco linhas que este programa escreve. Depois salve-o como `order.html` na pasta `08-traer-datos/` da sua cópia de `programas/`, abra-o com o servidor ligado e compare.

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <link rel="icon" href="data:,">
  <title>¿En qué orden?</title>
</head>
<body>
  <pre id="output"></pre>
  <script type="module">
    const lines = [];

    async function countServices() {
      lines.push("1: dentro de la función, antes del await");
      const response = await fetch("panel/data/services.json");
      const services = await response.json();
      lines.push("2: dentro de la función, después del await");
      return services.length;
    }

    lines.push("A: antes de llamar");
    const pending = countServices();
    lines.push("B: después de llamar, sin await");
    const count = await pending;
    lines.push(`C: llegaron ${count}`);

    document.querySelector("#output").textContent = lines.join("\n");
  </script>
</body>
</html>
```

## Soluções

### Solução 1

O `.then` se converte no corpo do `try`, o `.catch` no `catch`, e o `.finally` na linha que vem depois do `try`/`catch`, que é executada nos dois casos porque nenhum dos dois blocos termina a função:

```html
  <script type="module">
    const output = document.querySelector("#output");
    const lines = [];

    try {
      const response = await fetch("missing.json");
      lines.push("la promesa SE CUMPLIÓ (no se rechazó)");
      lines.push(`estado HTTP: ${response.status}`);
      lines.push(`ok: ${response.ok}`);
    } catch (error) {
      lines.push(`la promesa se rechazó: ${error.message}`);   // esto NO se ejecuta con un 404
    }
    output.textContent = lines.join("\n");
  </script>
```

Com o resto da página igual à figura 8.2, o Chrome mostra as mesmas três linhas: `la promesa SE CUMPLIÓ (no se rechazó)`, `estado HTTP: 404` e `ok: false`. O `await` não muda a regra: um 404 cumpre a promessa, e por isso o `catch` não é executado ainda que “algo tenha dado errado”.

### Solução 2

Vai em `js/load.js`, porque é ali que se traduz um resultado técnico em uma frase; `js/view.js` só desenha o que recebe e `js/state.js` só o guarda. Muda-se o `throw` do `if (!response.ok)` e acrescenta-se uma função no final do arquivo:

```js
  if (!response.ok) {
    throw new Error(statusMessage(response.status));
  }
```

```js
// Un mensaje distinto según de quién es el problema.
function statusMessage(code) {
  if (code === 404) return "No se encontró la lista de servicios.";
  if (code >= 500) return `El servidor tuvo un problema (código ${code}). Intenta de nuevo en un momento.`;
  return `El servidor respondió con el código ${code}.`;
}
```

Para verificar, troque temporariamente em `js/main.js` o endereço por `"data/missing.json"`: o console diz agora `No se pudieron cargar los servicios: No se encontró la lista de servicios.`. O servidor estático do curso não pode produzir um 500, então esse ramo se verifica com um truque: troque temporariamente `code === 404` por `code === 999` e `code >= 500` por `code >= 400`, recarregue e deve aparecer “El servidor tuvo un problema (código 404)…”. Desfaça as duas mudanças ao terminar. Por ora a mensagem só se lê no console; na lição 9 ela aparecerá na tela sem que você tenha de tocar neste arquivo.

### Solução 3

A ordem é A, 1, B, 2, C:

```text
A: antes de llamar
1: dentro de la función, antes del await
B: después de llamar, sin await
2: dentro de la función, después del await
C: llegaron 5
```

“A” vem primeiro porque é a primeira linha que se executa. Ao chamar `countServices`, a função **começa a ser executada imediatamente** e escreve “1”; ao chegar ao primeiro `await`, ela se põe de lado e devolve a quem a chamou uma promessa pendente. Por isso “B” sai antes de “2”: o programa principal seguiu com a sua próxima linha enquanto a requisição viajava. Quando o programa principal chega a `await pending`, ele também se põe de lado; a requisição termina, a função continua e escreve “2”, a sua promessa se cumpre com 5, e o programa principal segue e escreve “C”. É assim que o Chrome 154 mostra. Se você previu A, B, 1, 2, C, pensou que a função não começa até que alguém a espere; se previu A, 1, 2, B, C, pensou que `await` congela todo o programa. Os dois erros são comuns, e por isso vale a pena ver isso uma vez.

## Como sei que consegui

- [ ] Com a pasta `programas/` do repositório servida no seu computador, `08-traer-datos/fig08_01.html` mostra `ok: true` e `servicios recibidos: 5`; `fig08_02.html` mostra `ok: false` e `estado HTTP: 404` sem que o `.catch` seja executado.
- [ ] `fig08_03.html` mostra uma linha que chegou bem e uma que falhou com o código 404.
- [ ] No seu painel, o resumo diz 5, 4 de 5, 1 e 465 ms, o cabeçalho diz a data e a hora em que os dados chegaram, e `js/services.js` já não existe.
- [ ] Ao pressionar “Revisar ahora”, a hora do cabeçalho é escrita de novo e o foco fica no botão.
- [ ] Com o endereço trocado para `data/missing.json`, o console mostra a sua mensagem com o código 404, e nada mais quebra.
- [ ] Ordenar e escolher um serviço funcionam igual à lição 7.
- [ ] Você procura `innerHTML` nos seus arquivos `.js` e ele não aparece.

**Revisão de lições anteriores** (responda sem olhar, e depois verifique):

1. Na lição 0: que duas coisas viajam em uma resposta HTTP antes do conteúdo, e qual delas é o código 404?
2. Na lição 6: o que `averageResponseMs` devolve quando nenhum serviço tem medida, e por que `null` e não zero?
3. Na lição 7: por que `js/view.js` usa `textContent` e não `innerHTML` ainda que os dados venham do seu próprio servidor?

## Para ler mais

- [MDN — Usando a Fetch API](https://developer.mozilla.org/pt-BR/docs/Web/API/Fetch_API/Using_Fetch) — a referência do `fetch`: `ok`, o corpo, os cabeçalhos e os tipos de erro; consultado em 7 de outubro de 2026.
- [MDN — Como usar promessas](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Using_promises) — `.then`, `.catch` e o encadeamento, passo a passo; consultado em 7 de outubro de 2026.
- [MDN — `async function`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/async_function) — o que uma função `async` devolve e como o `await` se comporta dentro dela; consultado em 7 de outubro de 2026.
