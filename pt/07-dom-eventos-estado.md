# Lição 7 — O DOM, os eventos e o estado

**Tempo:** 2 × 45 min

**O que você constrói:** a tabela do painel, desenhada a partir dos dados

**O que você aprende:** desenhar a partir de dados em vez de escrever à mão; escutar eventos; separar estado, desenho e efeitos; `textContent` como hábito, e o ataque que ele evita

## Ao terminar, você vai conseguir

- Explicar a diferença entre o arquivo HTML e o DOM, e dizer qual dos dois muda quando o JavaScript escreve na página.
- Desenhar uma tabela completa a partir de um array de objetos, criando os elementos um por um e pendurando-os no documento.
- Explicar o que é um ataque XSS com um exemplo que você mesmo provoca, e por que `textContent` o evita e `innerHTML` o permite.
- Escutar um evento com `addEventListener`, ler o que aconteceu com o elemento por meio do objeto do evento e atender muitos botões com um único ouvinte (delegação).
- Separar o estado do painel (o que ele lembra), o desenho (como ele se vê) e os efeitos (o que ele escuta), e dizer em qual arquivo vive cada coisa.
- Navegar o painel só com o teclado e verificar que o foco não se perde quando a tabela é desenhada de novo.

## O porquê antes do como

**Ponto de partida.** Esta lição parte do painel como a lição 6 o deixou, na sua pasta `revisor`:

- `index.html`, o painel da lição 2 com as classes que as lições 4 e 5 lhe deram: o cabeçalho, o resumo com as suas quatro cifras escritas à mão, o campo de busca, os rádios, o botão “Revisar ahora” (“Revisar agora”) e a tabela com as suas cinco linhas escritas à mão. No `<head>` ele leva a linha `<script type="module" src="js/main.js">` que você incluiu na lição 6.
- `css/styles.css`, a folha de estilo das lições 3, 4 e 5: camadas, variáveis de cor, selos de estado e o layout que vai de 320 a 1440 pixels.
- `js/services.js`, um módulo que exporta o array `services` com os cinco serviços.
- `js/stats.js`, um módulo que exporta `countByStatus`, `averageResponseMs` e `summarize`.
- `js/main.js`, que por enquanto só escreve as contas no console do navegador.

Os dois módulos de dados e de contas não mudam em toda a lição: esta é a sua forma, a mesma da lição 6. A única coisa diferente é a primeira linha, o comentário que no repositório diz onde vive cada arquivo: o painel desta lição está em [`programas/07-dom-eventos-estado/panel/`](https://github.com/HabilMX/curso-web/tree/main/programas/07-dom-eventos-estado/panel).

```js
// panel/js/services.js
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
// panel/js/stats.js
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

Repare numa decisão da lição 6 que hoje cobra seu preço: um serviço fora do ar não tem tempo de resposta, e por isso o seu `responseMs` é `null` em vez de zero. Um zero diria “respondeu em zero milissegundos”, o que é mentira e ainda arruína a média. `averageResponseMs` já sabe deixar de fora os que não responderam, e hoje você verá que a tabela também precisa decidir o que mostrar no lugar deles.

**O que falta hoje ao painel.** Você tem os mesmos cinco serviços em dois lugares: em `js/services.js`, onde o JavaScript pode contá-los, e no HTML, onde uma pessoa pode vê-los. Ninguém garante que coincidam. Se amanhã Pagos cair e você alterar o array, a tabela continuará dizendo “Disponible” até que alguém se lembre de editar também o HTML. Se você incluir um sexto serviço, terá de copiar uma linha inteira, com o seu selo, sem errar numa tag. E o resumo tem o mesmo problema: você escreveu as suas quatro cifras à mão na lição 2, e as que a lição 6 calculou estão presas no console.

Duas cópias da mesma informação acabam se contradizendo. A saída é ter **uma única fonte da verdade**, os dados, e que a tela seja uma consequência: quando os dados mudam, desenha-se de novo. É isso que você constrói hoje.

**Que rota a lição segue.** São três ideias, nesta ordem. Primeiro o **DOM**, que é como o JavaScript vê e altera a página, e com ele você desenha a tabela a partir dos dados; ali mesmo aparece a regra de segurança mais rentável de toda a web, que cabe numa linha e que você vai ver quebrar com os seus próprios olhos. Segundo os **eventos**, que é como a página fica sabendo que alguém fez algo. Terceiro o **estado**, que é o que o painel lembra, e a separação que evita que o código vire um emaranhado assim que há mais de um botão.

Um aviso prático antes de começar: os módulos não carregam abrindo o arquivo com duplo clique (`file://`). Desde a lição 1 você trabalha com um servidor local. As páginas desta lição estão na pasta [`programas/07-dom-eventos-estado/`](https://github.com/HabilMX/curso-web/tree/main/programas/07-dom-eventos-estado) do [repositório do curso](https://github.com/HabilMX/curso-web): baixe-o (ou clone-o com o Git) no seu computador e ligue o servidor a partir da pasta `programas/` dele:

```bash
cd programas
python3 -m http.server 8000 --bind 127.0.0.1
```

E abra `http://127.0.0.1:8000/07-dom-eventos-estado/panel/`. O `--bind 127.0.0.1` faz com que só o seu computador possa ver a pasta; sem ele, o servidor atende a toda a rede local.

## Os conceitos

São três, e cada um traz o seu exemplo mínimo e o seu exemplo no `revisor`. Um lembrete de método que vale para toda a lição: **antes de executar cada figura, escreva no diário de bordo o que você acha que vai acontecer**. Prever e depois comprovar ensina mais que ler a resposta, porque, quando você erra, o erro fica gravado.

### 7.1 O DOM: a página como uma árvore que o JavaScript pode alterar

**O arquivo não é a página.** Quando o navegador recebe um arquivo HTML, o que ele tem nas mãos é texto. Ele o lê do começo ao fim e com isso constrói na memória uma estrutura de objetos, uma **árvore**: `html` contém `head` e `body`; `body` contém o cabeçalho, a tabela, os parágrafos; a tabela contém o seu corpo, o corpo as suas linhas, cada linha as suas células. Cada peça dessa árvore se chama **nó**, e a árvore completa, o **DOM** (de *Document Object Model*, o modelo de objetos do documento). A definição oficial vive no [padrão DOM](https://dom.spec.whatwg.org/); a explicação do MDN sobre [o que é o DOM](https://developer.mozilla.org/pt-BR/docs/Web/API/Document_Object_Model/Introduction) é a leitura recomendada para quem quiser o detalhe.

Essa distinção importa por três razões que você vai comprovar com as ferramentas do navegador:

1. **O que você vê no Inspetor é o DOM, não o arquivo.** Abra o seu `index.html` com o servidor, pressione `F12` e vá à aba do Inspetor. Se no seu HTML você escreveu uma tabela sem `<tbody>`, o Inspetor a mostrará mesmo assim: o navegador o acrescentou ao construir a árvore, porque o padrão manda. “Exibir código-fonte” mostra o arquivo; o Inspetor mostra a árvore viva.
2. **O JavaScript altera a árvore, não o arquivo.** Se um programa acrescenta uma linha, o arquivo `index.html` no seu disco continua idêntico. Recarregue a página e a mudança desaparece, porque o navegador lê o arquivo de novo e constrói a árvore de novo. Por isso você nunca vai “salvar” uma mudança do DOM: o DOM é reconstruído a cada vez, e o que se guarda são os dados e o código que o desenha.
3. **O Inspetor se atualiza sozinho.** Com o painel aberto, quando o código alterar a árvore você verá o nó modificado piscar. É a melhor forma de aprender: observe quais nós mudam e quais não.

**Ler e escrever na árvore.** O ponto de entrada é o objeto `document`, que representa a página completa. Com ele se *busca* um nó e depois se *lê* ou se *escreve* algo nele. Para buscar, `document.querySelector(selector)` recebe um seletor de CSS, a mesma linguagem da lição 3 (`#title` é o elemento com esse `id`, `.status` os dessa classe, `tbody` os dessa tag), e devolve **o primeiro** nó que coincide, ou **`null`** se nenhum coincide. Seu irmão `document.querySelectorAll(selector)` devolve **todos** os que coincidem, numa lista que se percorre com `for…of`. Para escrever texto em um nó, atribui-se à sua propriedade `textContent`.

Antes de executar a figura 7.1, **preveja**: que número o parágrafo vai mostrar, e o que o título vai dizer quando o programa terminar? A figura traz uma tabela de três linhas escrita à mão:

```html
<!-- fig07_01.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 7.1 — Leer y escribir el documento</title>
</head>
<body>
  <main>
    <h1 id="title">Servicios</h1>
    <table>
      <tbody>
        <tr><td>Catálogo</td><td>Disponible</td></tr>
        <tr><td>Pagos</td><td>Disponible</td></tr>
        <tr><td>Inventario</td><td>Caído</td></tr>
      </tbody>
    </table>
    <p id="count"></p>
  </main>

  <script type="module">
    // Leer: ¿cuántas filas hay en el documento?
    const rows = document.querySelectorAll("tr");

    // Escribir: poner esa cuenta en el párrafo.
    const paragraph = document.querySelector("#count");
    paragraph.textContent = `El documento tiene ${rows.length} filas.`;

    // Escribir otra vez: cambiar el texto del título.
    document.querySelector("#title").textContent = "Servicios (leídos por JavaScript)";
  </script>
</body>
</html>
```

O que se vê na página (o texto que o Chrome mostra, de cima para baixo), que no repositório está em [`programas/07-dom-eventos-estado/fig07_01.salida.txt`](https://github.com/HabilMX/curso-web/blob/main/programas/07-dom-eventos-estado/fig07_01.salida.txt):

```text
Servicios (leídos por JavaScript)
Catálogo	Disponible
Pagos	Disponible
Inventario	Caído

El documento tiene 3 filas.
```

Se a sua previsão foi “três linhas”, você acertou, e repare no que isso demonstra: `querySelectorAll("tr")` contou as linhas do *corpo*, e a tabela não tem cabeçalho de colunas. Se tivesse uma linha de cabeçalhos, seriam quatro. É o tipo de detalhe que se aprende contando, não lendo.

Mais duas coisas sobre essa figura. O `<script type="module">` está *depois* do conteúdo, mas daria no mesmo onde você o colocasse: um módulo sempre é executado quando o documento já terminou de ser lido, e isso evita o erro mais frequente do iniciante, que você verá na seção “O erro que você vai ver”. E a propriedade `textContent` é de **leitura e escrita**: `elemento.textContent` lhe dá o texto que há dentro, `elemento.textContent = "algo"` o substitui, apagando antes tudo o que o elemento continha, inclusive os seus filhos.

**Desenhar a partir de um array.** Para desenhar uma lista não se escreve o texto da lista: **criam-se nós** e **penduram-se** na árvore. São três passos, e os três são sempre os mesmos:

1. `document.createElement("li")` cria um elemento novo, solto na memória. Ainda não se vê, porque não pertence à árvore da página.
2. Dá-se a ele o seu conteúdo: `elemento.textContent = "..."`, ou os seus atributos e as suas classes.
3. `contenedor.append(elemento)` o pendura na árvore, no final dos filhos do contêiner. Nesse momento ele aparece na tela.

A figura 7.2 é a versão mínima de todo o desenho do painel: um array com três dos serviços da lição 6 e um laço que converte cada um em um elemento. **Preveja** o que dirá a linha de “Inventario”, o que não respondeu.

```html
<!-- fig07_02.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 7.2 — Dibujar una lista desde un arreglo</title>
</head>
<body>
  <main>
    <h1>Servicios</h1>
    <ul id="list"></ul>
  </main>

  <script type="module">
    const services = [
      { id: "catalog", name: "Catálogo", status: "available", responseMs: 120 },
      { id: "payments", name: "Pagos", status: "available", responseMs: 480 },
      { id: "inventory", name: "Inventario", status: "down", responseMs: null },
    ];

    const list = document.querySelector("#list");

    for (const service of services) {
      const item = document.createElement("li");                      // 1. crear el nodo
      item.textContent = service.responseMs === null                  // 2. su texto
        ? `${service.name}: sin respuesta`
        : `${service.name}: ${service.responseMs} ms`;
      list.append(item);                                              // 3. colgarlo del árbol
    }
  </script>
</body>
</html>
```

```text
Servicios
Catálogo: 120 ms
Pagos: 480 ms
Inventario: sin respuesta
```

Observe o que *não* há no HTML: não há nenhum `<li>`. A lista está vazia no arquivo e o Inspetor a mostra cheia. E observe algo que muda como você pensa: se amanhã o array tiver dez serviços, ou zero, o código não muda. **O desenho deixa de depender de quantos dados há.** Esse é o benefício de desenhar a partir dos dados. Repare também na linha de Inventario: o `null` da lição 6 não aparece como “null ms”, porque o código decide que texto corresponde à falta de dado. Essa decisão é do desenho, não dos dados.

`append` aceita vários argumentos de uma vez, e aceita também texto solto, que ele converte em um nó de texto. `replaceChildren(...nodos)` é o seu parente para desenhar *de novo*: esvazia o contêiner e coloca os nós novos em um único passo. Os três pontos são a propagação que você viu na [Lição 6](06-javascript-datos.md) (seção 6.2.6): repartem os elementos de um array como se fossem argumentos soltos. Os dois são “Baseline widely available”, isto é, funcionam em todos os navegadores atuais há anos; o MDN documenta [`append`](https://developer.mozilla.org/en-US/docs/Web/API/Element/append) e [`replaceChildren`](https://developer.mozilla.org/en-US/docs/Web/API/Element/replaceChildren) com a sua tabela de compatibilidade.

**Uma linha do painel, decisão por decisão.** A linha da tabela é a mesma ideia com mais peças, e cada peça tem uma razão. Esta é a função `createRow` de `js/view.js`, com a pequena função `label` que ela usa:

```js
// Lista cerrada de estados que el panel conoce. Un valor que no esté aquí no llega a una clase.
const LABELS = { available: "Disponible", down: "Caído" };

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
```

Leia-a devagar, porque cada linha responde a algo que você já aprendeu:

- **`th` com `scope = "row"` para o nome.** Na lição 2 você aprendeu que a primeira célula de cada linha é o *cabeçalho da linha*: um leitor de tela, ao chegar em “480 ms”, pode dizer “Pagos, Tiempo de respuesta, 480 ms”. Se você desenhasse um `td` por preguiça, a tabela se veria igual e deixaria de ser compreensível para quem não a vê.
- **O selo usa uma lista fechada.** `LABELS` é um objeto com os dois estados que o painel conhece, `available` e `down`, e o rótulo mostrado para cada um. `Object.hasOwn(LABELS, service.status)` pergunta se o estado é um deles, e só então ele é usado como parte do nome de uma classe: `status status-available` ou `status status-down`, as mesmas classes que a lição 3 pintou de verde e de vermelho. Um dado de fora que não esteja na lista não chega à classe e é mostrado como “Desconocido” (“Desconhecido”), com o selo sem cor que a lição 3 anunciou para esse caso. ([`Object.hasOwn`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn) é a forma moderna de perguntar “esta chave é do objeto?”, e é melhor que `LABELS[status]` a seco, porque um estado chamado `"constructor"` encontraria a função desse nome que todos os objetos herdam.)
- **“sin respuesta” para o `null`.** Mostrar “null ms” seria uma grosseria com quem lê. O `null` é uma decisão dos dados; traduzi-lo para algo legível é trabalho do desenho, e o texto é o mesmo que a tabela escrita à mão dizia desde a lição 2.
- **Um botão de verdade por linha.** Não uma célula clicável, não um `div`: um `<button type="button">`. Um botão recebe o foco com a tecla Tab e é ativado com Enter e com a barra de espaço **sem que você escreva uma linha**; um `div` clicável não faz nenhuma das duas coisas, e consertá-lo à mão dá mais código e um resultado pior. A primeira regra do ARIA diz assim: se existe um elemento nativo com o comportamento de que você precisa, use-o (o [Guia de práticas de autoria do WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/) a desenvolve).
- **O texto oculto “de Pagos”.** Cinco botões que dizem igualmente “Ver detalle” são cinco botões indistinguíveis para quem navega por voz ou com um leitor de tela, que pode pedir a lista de controles da página. O `<span class="visually-hidden">` acrescenta ao nome acessível de cada botão o do serviço: “Ver detalle de Pagos”. A classe o tira da vista sem retirá-lo da árvore de acessibilidade, e vive em `css/styles.css`.
- **`dataset.id`.** Os atributos que começam com `data-` são um lugar que o padrão reserva para os seus próprios dados. `button.dataset.id = "payments"` escreve `data-id="payments"`. É o `id` que a lição 6 separou do nome: o nome é o que se mostra e pode mudar; o `id` é o que identifica o serviço. Mais adiante você vai lê-lo de volta para saber *qual* serviço a pessoa quis ver. Um atributo `data-` guarda o seu valor como texto e o navegador não o interpreta, de modo que escrever ali um dado de fora não executa nada.
- **`classList`, `aria-pressed` e `String`.** `row.classList.add("selected")` acrescenta uma classe às que o elemento já tem sem apagar as demais (atribuir `className`, ao contrário, substitui todas). `aria-pressed` é um atributo de acessibilidade que converte o botão em um *botão de alternância*: um leitor de tela anuncia se ele está pressionado ou não, e a folha de estilo o usa para marcá-lo. Os atributos sempre guardam texto, por isso `String(isSelected)` converte o booleano `true` ou `false` no texto `"true"` ou `"false"` antes de escrevê-lo.
- **`setAttribute` não limpa nada.** É seguro *para estes dois atributos*, `data-id` e `aria-pressed`, porque o navegador nunca os executa. Mas `setAttribute` escreve o valor tal qual no atributo que você indicar, e alguns atributos são, sim, código: `button.setAttribute("onclick", texto)` converte esse texto em um programa que roda ao clicar, e `href` ou o `src` de um `<iframe>` aceitam endereços `javascript:`. O MDN adverte sobre isso na seção de segurança de [`setAttribute`](https://developer.mozilla.org/pt-BR/docs/Web/API/Element/setAttribute). A regra: um dado de fora só vai para atributos que não são executados, e nunca para um que comece com `on`.

**A regra que cabe numa linha: o texto de fora entra com `textContent`.** Até aqui você usou `textContent` sem que lhe dissessem por quê. É hora de ver por que importa, e a melhor forma é quebrá-lo de propósito.

Existe outra propriedade que parece fazer o mesmo: `innerHTML`. Parece-se muito. Mas há uma diferença de fundo: `textContent` trata o que você lhe dá **como texto**; `innerHTML` o trata **como código HTML** e o interpreta, igual a quando o navegador lê um arquivo. Com um nome como “Catálogo” as duas dão o mesmo resultado. Com um nome como `<b>Catálogo</b>` já não: uma põe letras em negrito e a outra mostra os sinais `<b>` tal qual.

Isso não seria grave se os dados fossem sempre seus. Mas o `revisor` existe para mostrar o que *outros reportam*: o nome de um serviço, uma mensagem de erro, uma descrição. Hoje estão no seu arquivo `js/services.js`; na lição 8 chegarão pela rede, e na 10 uma pessoa os escreverá em um formulário. Assim que um texto é controlado por alguém que não é você, ele é um **dado de fora**, e é preciso tratá-lo como se pudesse ser hostil.

Aqui vai o ataque, que se chama **XSS** (*cross-site scripting*, programação entre sites): um dado de fora que contém HTML com código ativo, e uma página que o interpreta. É uma das falhas de segurança mais frequentes da web, e a [OWASP](https://top10.owasp.org/2025/A05_2025-Injection/) a classifica entre as injeções na sua lista de 2025. A figura 7.3 é a versão **insegura** do desenho da lista. **Preveja** antes de abri-la: o terceiro nome é `<img src="x" onerror="document.title = '...'">`, que é uma imagem cujo endereço (`x`) não existe. O que você acha que se verá na lista, e o que acontecerá com o título da aba?

```html
<!-- fig07_03.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 7.3 — innerHTML con un dato de fuera (INSEGURO)</title>
</head>
<body>
  <main>
    <h1>Servicios (versión insegura, solo para ver el problema)</h1>
    <ul id="list"></ul>
  </main>

  <script type="module">
    // El tercer nombre lo escribió otra persona, no tú. Es un dato de fuera.
    const services = [
      { name: "Catálogo" },
      { name: "Pagos" },
      { name: `<img src="x" onerror="document.title = 'Se ejecutó código que venía en un dato'">` },
    ];

    const list = document.querySelector("#list");
    for (const service of services) {
      const item = document.createElement("li");
      item.innerHTML = service.name;   // <-- el navegador INTERPRETA el texto como HTML
      list.append(item);
    }
  </script>
</body>
</html>
```

```text
Lista visible:
• Catálogo
• Pagos
• 

Título de la pestaña (lo cambió el dato): Se ejecutó código que venía en un dato
```

A lista não mostra nada na terceira linha, e **a aba mudou de título**. Não havia nenhum programa que dissesse isso: quem disse foi um dado. O navegador criou a imagem, tentou carregar `x`, não conseguiu, disparou o evento de erro da imagem e executou o código que vinha dentro do atributo `onerror`. Hoje esse código muda um título, que é inofensivo. Mas é **código qualquer**, com as mesmas permissões que o seu: pode ler o que a página mostra, pode pedir informação ao servidor com a sessão de quem está olhando, pode mudar o que se vê para enganar. Quem escreveu o dado não precisou entrar no servidor nem conhecer o seu código; precisou apenas que a sua página o desenhasse com `innerHTML`.

Uma confusão frequente: “Se o `innerHTML` bloqueia `<script>`, já estou a salvo”. É verdade que um `<script>` inserido com `innerHTML` **não é executado**, e por isso muitos tutoriais dizem que é seguro. Mas a figura 7.3 acaba de demonstrar que não é preciso um `<script>`: um atributo de evento em uma imagem basta. O MDN adverte sobre isso na sua página de [`innerHTML`](https://developer.mozilla.org/pt-BR/docs/Web/API/Element/innerHTML), com este mesmo exemplo de `onerror`.

A figura 7.4 é idêntica **salvo uma linha**: usa `textContent`.

```html
<!-- fig07_04.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 7.4 — textContent con un dato de fuera</title>
</head>
<body>
  <main>
    <h1>Servicios (versión segura)</h1>
    <ul id="list"></ul>
  </main>

  <script type="module">
    // El tercer nombre lo escribió otra persona, no tú. Es un dato de fuera.
    const services = [
      { name: "Catálogo" },
      { name: "Pagos" },
      { name: `<img src="x" onerror="document.title = 'Se ejecutó código que venía en un dato'">` },
    ];

    const list = document.querySelector("#list");
    for (const service of services) {
      const item = document.createElement("li");
      item.textContent = service.name;  // <-- el navegador lo trata SIEMPRE como texto
      list.append(item);
    }
  </script>
</body>
</html>
```

```text
Lista visible:
• Catálogo
• Pagos
• <img src="x" onerror="document.title = 'Se ejecutó código que venía en un dato'">

Título de la pestaña: Fig. 7.4 — textContent con un dato de fuera
```

A terceira linha agora mostra o texto do ataque, completo e visível, e o título da aba continua sendo o que você escreveu. A imagem nunca foi criada: o navegador não leu `<img` como uma tag porque ao `textContent` não importa o que o texto parece. No Inspetor você verá que o HTML escreveu `&lt;img…&gt;`: os sinais foram *escapados*, isto é, substituídos pela sua representação de texto.

Essa é a regra: **todo texto que não foi você quem escreveu entra no documento com `textContent`**. E com ela vão outras da mesma família, que a OWASP reúne na sua [folha sobre XSS no DOM](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html) como os “sinks perigosos” (destinos perigosos), os lugares onde um dado vira código:

- `innerHTML`, `outerHTML` e `insertAdjacentHTML`: interpretam HTML.
- `document.write`: o mesmo, e ainda de forma tão desajeitada que já não se ensina.
- `eval(texto)` e `setTimeout("texto", …)` com uma string: executam texto como programa.
- Os atributos de evento escritos no HTML (`onclick="..."`, `onerror="..."`): são código em forma de texto.
- Atribuir um dado ao `href` de um link (ou ao `src` de um `<iframe>`) sem verificar de onde vem: um endereço que começa com `javascript:` executa código quando o link é seguido ou o quadro é carregado. O MDN explica que isso acontece nos lugares para onde se *navega*, não nos que apenas baixam um recurso, como o `src` de uma imagem ([esquema `javascript:`](https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/javascript)). No painel de hoje não há links com dados de fora, mas, assim que houver um, o endereço será validado primeiro.

Quando o `innerHTML` é aceitável? Quando o que você lhe dá é um texto fixo que você escreveu, sem uma única peça vinda de um dado. Mesmo assim, o hábito saudável é não o ter: uma linha com `innerHTML` que hoje é segura se converte, três meses depois, em uma linha insegura quando alguém cola nela uma variável. Se você nunca o usa, essa conversão não pode ocorrer, e revisar o código é procurar a palavra e comprovar que ela não está. Por isso um dos cinco critérios com que você sabe que terminou o curso é: *o texto que vem de fora é desenhado com `textContent`, nunca com `innerHTML`*.

> **O que vem por aí, e ainda não se usa.** Existem dois mecanismos mais novos para este mesmo problema. O primeiro são os *Trusted Types* (tipos de confiança), que fazem o navegador se recusar a aceitar uma string de texto em um sink perigoso; segundo a [web.dev](https://web.dev/articles/trusted-types), os principais navegadores o suportam apenas desde 2026, e por isso ainda é “recente”. O segundo é `Element.setHTML()`, junto com a API *Sanitizer*, que limpa o HTML antes de inseri-lo, e que o MDN ainda marca como “não Baseline”. Nenhum dos dois substitui o hábito de usar `textContent`, e este curso não os emprega no painel: ensina apenas o que já funciona em todos os navegadores. Na lição 11 você verá a outra rede de segurança que está, sim, em todos: a política de segurança de conteúdo (CSP), que é uma segunda camada e **não substitui** a primeira.

### 7.2 Os eventos: como a página fica sabendo que alguém fez algo

**Um evento é um aviso.** Quando alguém pressiona um botão, mexe o mouse, digita uma tecla ou termina de carregar uma imagem, o navegador anota isso como um **evento** e avisa a quem o tenha pedido. Quem pede é o seu código, e o faz assim:

```js
element.addEventListener("click", handler);
```

Dito em português: “quando ocorrer um `click` neste elemento, execute esta função”. A função se chama **ouvinte** (*listener*) ou manipulador. Três detalhes em que quase todos os iniciantes pisam:

1. **Passa-se a função, não se a chama.** `addEventListener("click", onClick)` entrega a função para que o navegador a execute quando o clique ocorrer. Se você escreve `onClick()` com parênteses, a executa *agora mesmo*, uma única vez, e entrega ao navegador o que essa chamada devolveu (que costuma ser `undefined`). O clique não fará nada e não haverá erro algum.
2. **O navegador entrega à função um objeto com os detalhes**, o objeto do evento, que por costume se chama `event`. Suas propriedades mais úteis: `event.type` (que tipo de evento foi), `event.target` (o elemento onde *ocorreu*) e `event.currentTarget` (o elemento onde está *posto o ouvinte*). A figura 7.5 as usa, junto com [`localName`](https://developer.mozilla.org/en-US/docs/Web/API/Element/localName), uma propriedade que todo elemento tem e que dá o nome da sua tag em minúsculas: para um `<button>`, o texto `"button"`. Serve para que a página diga *que tipo* de elemento recebeu o evento.
3. **O elemento certo dá o teclado de graça.** Um botão recebe o clique com o mouse, com toque na tela, com Enter e com a barra de espaço; tudo isso chega como o mesmo evento `click`. Se você tivesse usado um `div`, teria de escrever você mesmo o suporte ao teclado.

**Preveja:** o que dirá o parágrafo depois de dois cliques no botão?

```html
<!-- fig07_05.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 7.5 — Escuchar un clic</title>
  <style>
    /* Un blanco cómodo para el dedo o el mouse: WCAG 2.2 pide al menos 24 × 24 px; aquí mide 44. */
    button { min-height: 2.75rem; padding: 0.5rem 0.75rem; }
  </style>
</head>
<body>
  <main>
    <h1>Un botón y un contador</h1>
    <button type="button" id="counter">Contar un clic</button>
    <p id="result" role="status">Todavía no hay clics.</p>
  </main>

  <script type="module">
    const button = document.querySelector("#counter");
    const result = document.querySelector("#result");
    let clicks = 0;

    function onClick(event) {
      clicks += 1;
      result.textContent = `Clics: ${clicks}. Tipo de evento: ${event.type}. Lo recibió: <${event.currentTarget.localName}>.`;
    }

    button.addEventListener("click", onClick);   // pasa la función, NO la llama (sin paréntesis)
  </script>
</body>
</html>
```

```text
Tras dos clics:
Clics: 2. Tipo de evento: click. Lo recibió: <button>.
```

Duas observações que lhe serão úteis no painel. A primeira: a variável `clicks` vive *fora* da função e por isso sobrevive de um clique ao seguinte; guardar “o que aconteceu até agora” fora do ouvinte é o germe do que em 7.3 se chama estado. A segunda: o parágrafo tem `role="status"`, o que o torna uma **região dinâmica** (*live region*): quando o seu conteúdo muda, um leitor de tela o anuncia sem que a pessoa tenha de ir procurá-lo. É a maneira correta de avisar que “algo mudou” sem mover o foco; a regra de ouro das regiões dinâmicas é que **existam desde o início e vazias ou com o seu texto inicial**, e que apenas o seu conteúdo mude.

**Os eventos sobem.** Se você clica em um botão que está dentro de uma célula, que está dentro de uma linha, que está dentro do corpo da tabela, a quem o clique ocorreu? A todos. O navegador entrega o evento primeiro ao botão e depois **o faz subir** pela árvore: à célula, à linha, ao corpo, à tabela, ao `body`, até `document`. Isso se chama **borbulhamento** (*bubbling*), e está descrito no [padrão DOM](https://dom.spec.whatwg.org/#dispatching-events) e explicado passo a passo no [MDN](https://developer.mozilla.org/pt-BR/docs/Learn_web_development/Core/Scripting/Event_bubbling). Enquanto sobe, `event.target` não muda (continua sendo o elemento mais interno, onde se clicou) e `event.currentTarget` vai mudando (é sempre o elemento cujo ouvinte está sendo executado).

O borbulhamento permite uma técnica que você vai usar em quase todo programa com listas: a **delegação de eventos**. Em vez de pôr um ouvinte em cada botão, você põe **um só** no contêiner, e quando o evento subir, pergunta de onde ele veio. Por que isso é melhor aqui?

- **O painel desenha suas linhas de novo** (você verá em 7.3). Os botões velhos são descartados e criam-se botões novos; um ouvinte posto em um botão velho vai para o lixo com ele. O contêiner, o `<tbody>`, nunca é descartado, e o seu ouvinte continua.
- **Com 6 linhas ou com 600, o custo é o mesmo:** um ouvinte.
- **Os serviços que chegarem depois** (na lição 8 a tabela é preenchida após uma requisição de rede) ficam cobertos sem fazer nada.

Há uma armadilha, e ela se chama o ícone dentro do botão. Se o botão contém outro elemento, como um `<span>` com um símbolo, o clique pode cair no `span`, e então `event.target` é o `span`, não o botão. Um código ingênuo que pergunte `if (event.target === button)` deixará de funcionar assim que o designer acrescentar um ícone. A solução é `event.target.closest("button[data-name]")`: **`closest`** sobe a partir do elemento pelos seus ancestrais e devolve o primeiro que coincida com o seletor (começando pelo próprio elemento), ou `null` se não houver nenhum ([MDN: `closest`](https://developer.mozilla.org/pt-BR/docs/Web/API/Element/closest)). A figura 7.6 demonstra isso clicando sobre o ícone de propósito.

```html
<!-- fig07_06.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 7.6 — Un solo oyente para muchos botones</title>
  <style>
    /* Un blanco cómodo para el dedo o el mouse: WCAG 2.2 pide al menos 24 × 24 px; aquí mide 44. */
    button { min-height: 2.75rem; padding: 0.5rem 0.75rem; }
  </style>
</head>
<body>
  <main>
    <h1>Delegación de eventos</h1>
    <ul id="list"></ul>
    <p id="result" role="status">Ningún botón presionado.</p>
  </main>

  <script type="module">
    const names = ["Catálogo", "Pagos", "Inventario"];
    const list = document.querySelector("#list");
    const result = document.querySelector("#result");

    for (const name of names) {
      const item = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.name = name;                     // guarda el nombre en data-name
      const icon = document.createElement("span");    // un elemento DENTRO del botón
      icon.textContent = "▶ ";
      button.append(icon, `Ver ${name}`);
      item.append(button);
      list.append(item);
    }

    // UN solo oyente, en el contenedor. Los clics de todos los botones suben hasta aquí.
    list.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-name]");
      if (button === null) return;                    // el clic no fue en un botón
      result.textContent = `Presionaste: ${button.dataset.name} (target: <${event.target.localName}>)`;
    });
  </script>
</body>
</html>
```

```text
Tras hacer clic sobre el ícono del botón «Ver Pagos»:
Presionaste: Pagos (target: <span>)
```

Veja a saída: `target` foi o `<span>`, mas `closest` encontrou o botão e o seu `dataset.name` disse “Pagos”. E veja a linha `if (button === null) return;`: o ouvinte está na lista toda, então também recebe os cliques que caem no espaço entre os botões, e é preciso ignorá-los. É a primeira instrução de qualquer ouvinte delegado.

Um limite que convém conhecer: nem todos os eventos sobem. `focus` e `blur`, por exemplo, não borbulham (seus parentes `focusin` e `focusout` sim). Para os cliques e as teclas, que são os que você usará neste curso, a delegação funciona sem truques.

### 7.3 O estado, e a separação que evita o emaranhado

**O que é o estado.** O **estado** de uma aplicação é **o que ela lembra neste momento**. No painel são três coisas: a lista de serviços, se ela está ordenada por tempo de resposta ou não, e qual serviço está selecionado (ou nenhum). Repare que não disse “o que se vê”: o que se vê é *consequência* do estado. A ideia que ordena todo o resto é que **a tela é uma função do estado**: escreve-se uma função `render(state)` que, dado o estado, põe no documento o que corresponde, e cada vez que algo muda, muda-se o estado e chama-se `render` de novo.

O emaranhado que essa ideia evita se vê assim. Um programador iniciante resolve “ordenar” com um `if (button.textContent === "Ordenar por tiempo")`: pergunta *ao documento* em que situação está o painel. Funciona até que alguém mude o texto do botão, ou o traduza, ou acrescente outro botão que também precisa saber se está ordenado. Então a verdade vive em três lugares (o array, o texto do botão, a ordem das linhas na tela) e é preciso mantê-los de acordo à mão. É o mesmo problema das duas cópias com que a lição começou, só que agora dentro do próprio código. Com um estado explícito, a verdade vive em **um** objeto, e todo o resto é calculado.

**Três arquivos, três responsabilidades.** O painel se divide assim:

| Arquivo | Responsabilidade | Toca o documento? |
|---|---|---|
| `js/state.js` | O que o painel lembra e as únicas formas de alterá-lo | Não |
| `js/view.js` | Desenha um estado no documento | Sim, só para escrever |
| `js/main.js` | Junta as peças: escuta eventos, altera o estado, pede para desenhar | Sim, para escutar |

Aos eventos, ao desenho e a tudo o que *faz algo ao mundo* chama-se **efeitos**: separam-se do estado porque são o difícil de testar e de raciocinar. O estado, em contrapartida, são objetos e funções comuns, que você pode verificar sem abrir uma página. Este é o `js/state.js` completo:

```js
// panel/js/state.js
// El estado del panel y las únicas formas de cambiarlo.
// No toca el documento: por eso se puede probar sin pantalla.

export function createState(services) {
  return {
    services,           // los datos
    sortByTime: false,  // false = en el orden original; true = del más rápido al más lento
    selected: null,     // el id del servicio elegido, o null
  };
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

Detenha-se em `visible`. Devolve **o que deve ser mostrado** e o calcula a partir do estado a cada vez: se `sortByTime` é verdadeiro, ordena; se não, devolve a lista tal como chegou. Há dois detalhes que importam. O primeiro é `toSorted`, que você conheceu na lição 6: devolve uma **cópia** ordenada e deixa intacto o array dos dados. Se você usasse `sort`, que ordena o array sobre o qual é chamado, perderia para sempre a ordem de chegada, e o botão “Ordenar” já não teria a que voltar. O segundo é `a.responseMs ?? Infinity`: o operador `??` substitui um `null` pelo valor da direita, então um serviço sem medida é considerado infinitamente lento e vai para o final. (`??` só reage a `null` e `undefined`; `||`, ao contrário, trataria um zero como “falta”. Um tempo de zero seria suspeito, mas não é o mesmo que não ter medida.)

**A vantagem de separar se vê em um teste sem tela.** Como `js/state.js` não toca o documento, ele pode ser verificado com uma página quase vazia, `state-test.html`, que importa os dados e o módulo do estado e verifica seis fatos. Cada verificação é uma linha: uma descrição e uma condição que deve ser verdadeira.

```html
<!-- panel/state-test.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Prueba del estado (sin dibujar nada del panel)</title>
</head>
<body>
  <main>
    <h1>Prueba del estado</h1>
    <pre id="output"></pre>
  </main>
  <script type="module">
    import { services } from "./js/services.js";
    import { createState, toggleSort, select, visible } from "./js/state.js";

    const lines = [];
    function check(description, condition) {
      lines.push(`${condition ? "ok    " : "FALLA "} ${description}`);
    }
    const names = (list) => list.map((service) => service.name).join(", ");

    const state = createState(services);
    check("al inicio se ve el orden original", names(visible(state)) === "Catálogo, Pagos, Inventario, Notificaciones, Búsqueda");

    toggleSort(state);
    check("ordenado: del más rápido al más lento", names(visible(state)) === "Catálogo, Notificaciones, Pagos, Búsqueda, Inventario");
    check("ordenado: el que no tiene medida va al final (Inventario)", visible(state).at(-1).name === "Inventario");
    check("ordenar no cambia el arreglo original", names(state.services) === "Catálogo, Pagos, Inventario, Notificaciones, Búsqueda");

    select(state, "payments");
    check("seleccionar guarda el id", state.selected === "payments");
    select(state, "payments");
    check("seleccionar el mismo otra vez lo deselecciona", state.selected === null);

    document.querySelector("#output").textContent = lines.join("\n");
  </script>
</body>
</html>
```

Abra-a com o seu servidor em `…/07-dom-eventos-estado/panel/state-test.html`:

```text
Prueba del estado
ok     al inicio se ve el orden original
ok     ordenado: del más rápido al más lento
ok     ordenado: el que no tiene medida va al final (Inventario)
ok     ordenar no cambia el arreglo original
ok     seleccionar guarda el id
ok     seleccionar el mismo otra vez lo deselecciona
```

Se você mudar `visible` para usar `sort` em vez de `toSorted`, a verificação `ordenar no cambia el arreglo original` passa a `FALLA`. Faça isso, veja-a em vermelho e desfaça a mudança: assim você sabe que o teste protege algo de verdade. Repare por que a segunda verificação olha a ordem completa e não só o primeiro: Catálogo já era o mais rápido e o primeiro da lista, então “o primeiro é Catálogo” se cumpriria mesmo que a ordenação não fizesse nada. Um teste que não pode falhar não prova nada.

**O desenho.** Com o estado separado, `render` fica curto e repetitivo, que é justamente o que se quer. Este é o `js/view.js` completo; você já conhece `createRow` e `label`, e o novo são `describe`, que monta a frase do detalhe (`toLowerCase()` devolve o texto em minúsculas: “Disponible” passa a “disponible” no meio da frase), e a função `render` do final:

```js
// panel/js/view.js
// Dibuja el estado en el documento. Todo texto de los datos entra con textContent.
import { summarize } from "./stats.js";
import { visible, selectedService } from "./state.js";

// Lista cerrada de estados que el panel conoce. Un valor que no esté aquí no llega a una clase.
const LABELS = { available: "Disponible", down: "Caído" };

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

// elements = { total, available, down, average, body, detail, sortButton }
export function render(state, elements) {
  const { services } = state;
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

Veja as primeiras linhas de `render`: o resumo que você escreveu à mão na lição 2 agora é escrito por `summarize`, a função da lição 6, nos quatro `<dd>` do `<dl>`. As cifras são as mesmas; a diferença é que você já não as soma, e que no dia em que um serviço mudar, elas mudam sozinhas.

Observe que `render` recebe o estado e um objeto com os elementos do documento de que precisa (`elements`). Ela não os procura: eles lhe são passados. Assim `js/view.js` não depende de como se chame nenhum `id` no seu HTML, e o mesmo código serve para testar com elementos falsos.

Observe também quanto texto entra no documento, e por onde: o resumo, o nome, o estado, o tempo e o detalhe. **Todos entram com `textContent`.** O `revisor` não usa `innerHTML` nem uma única vez. Os números e o estado de um serviço são dados de fora ainda que hoje vivam no seu arquivo.

**O custo de desenhar tudo de novo.** `replaceChildren` descarta todas as linhas e põe linhas novas. É simples, é suficientemente rápido para cinco linhas ou para quinhentas, e tem um efeito que você deve entender porque afeta quem usa o teclado: **o botão que tinha o foco desaparece**. Se uma pessoa navega com Tab até “Ver detalle de Pagos” e pressiona Enter, o painel é desenhado de novo, o botão velho é descartado e o foco cai no `body`: a pessoa tem de percorrer toda a página desde o início para continuar. É um defeito de acessibilidade que não se vê com o mouse, e por isso ninguém o nota até que alguém o reporte. Testá-lo com o teclado, como pede o critério de encerramento do curso, é o que o detecta.

A solução está em `main.js`. Antes de alterar o estado, anota-se o `id` do serviço cujo botão tem o foco (`document.activeElement` é o elemento focado, e o seu `dataset.id` é o serviço); altera-se o estado; desenha-se; e devolve-se o foco ao botão novo que tenha o mesmo `data-id`. Para montar o seletor usa-se `CSS.escape`, que protege o `id` de caracteres que têm significado em um seletor, como aspas ou colchetes: os `id` chegam com os dados, a partir da lição 8 chegarão pela rede, e um como `pagos"norte` quebraria um seletor montado à mão ([MDN: `CSS.escape`](https://developer.mozilla.org/en-US/docs/Web/API/CSS/escape_static)). Este é o `js/main.js` completo. Substitui o da lição 6, que só escrevia no console:

```js
// panel/js/main.js
// Junta las piezas: crea el estado, escucha eventos y vuelve a dibujar.
import { services } from "./services.js";
import { createState, toggleSort, select } from "./state.js";
import { render } from "./view.js";

const elements = {
  total: document.querySelector("#summary-total"),
  available: document.querySelector("#summary-available"),
  down: document.querySelector("#summary-down"),
  average: document.querySelector("#summary-average"),
  body: document.querySelector("#services-body"),
  detail: document.querySelector("#detail"),
  sortButton: document.querySelector("#sort"),
};

const state = createState(services);

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

// Delegación: un solo oyente en el <tbody> atiende los botones de todas las filas.
elements.body.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-id]");
  if (button === null) return;
  update(() => select(state, button.dataset.id));
});

render(state, elements);
```

E o HTML. É o `index.html` que você já tinha, com mudanças pequenas, e nenhuma no que ele significa: os quatro `<dd>` do resumo perdem as suas cifras escritas à mão e ganham um `id`; o `<tbody>` perde as suas cinco linhas e ganha o seu, `services-body`; a tabela ganha uma quarta coluna, “Acción” (“Ação”), e o cabeçalho da dos tempos, a classe `number`; a barra de controles ganha o botão “Ordenar por tiempo de respuesta”, com o seu `aria-pressed`; e debaixo da tabela aparece `#detail`, uma região dinâmica vazia. O campo de busca e os rádios continuam ali sem fazer nada (a lição 10 os conecta), assim como “Revisar ahora” (a lição 8 o conecta). E a “Última revisión” do cabeçalho continua escrita à mão: ela se tornará verdadeira quando os dados chegarem de verdade, na lição 8.

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
    <p>Última revisión:
      <time datetime="2026-10-07T10:30:00-06:00">7 de octubre de 2026, 10:30</time>
    </p>
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

        <p><button type="button">Revisar ahora</button></p>
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
    <p>Datos de ejemplo escritos a mano.</p>
  </footer>
</body>
</html>
```

Por último, a folha de estilo. `css/styles.css` é a da lição 5 com uma mudança e um bloco novo. A mudança: a regra da lição 3 que alinhava à direita os tempos apontava para `th:last-child, td:last-child`, a última célula de cada linha. Com a coluna “Acción”, a última célula já não é a dos tempos, então a regra passa a apontar para uma classe, `.number`, que `createRow` põe na célula do tempo e o HTML no seu cabeçalho. Um seletor que depende da posição quebra assim que alguém acrescenta uma coluna; um com nome, não. O bloco novo vai no final do arquivo e **reabre** a camada `components`: uma camada pode ser aberta tantas vezes quantas forem necessárias, e o que se acrescenta se soma ao que ela já tinha, em ordem.

```css
@layer components {
  /* ---- Lección 7: la tabla que se dibuja desde los datos ---- */
  :root {
    --color-selected: #dbe9f8;
  }

  /* La fila del servicio elegido. */
  tr.selected {
    background: var(--color-selected);
  }

  /* Un botón que está «presionado» (aria-pressed="true") se distingue de los demás. */
  button[aria-pressed="true"] {
    background: var(--color-text);
  }

  /* Fuera de la vista, pero dentro del árbol de accesibilidad: lo lee un lector de pantalla. */
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  /* Un elemento con position: absolute se coloca respecto de su ancestro posicionado más
     cercano. Sin esta regla, el texto oculto de los botones escapa de la caja que se desplaza
     y ensancha la página entera a 320 px. */
  .table-scroll {
    position: relative;
  }
}
```

A cor nova é declarada como variável em `:root`, como pede a lição 3: o resto da folha não escreve cores soltas. E a última regra tem história. Ao testar o painel a 320 pixels sem ela, a página voltou a transbordar: media 498 px de largura. A culpada não era a tabela, que continua dentro da sua caixa, mas o texto oculto dos botões. Um elemento com `position: absolute` é posicionado em relação ao seu ancestral *posicionado* mais próximo e, se não houver nenhum, em relação à página inteira; assim ele escapava da caixa que rola e esticava o documento. Com `position: relative` em `.table-scroll`, a caixa passa a ser esse ancestral, o texto oculto fica dentro e a medida volta a 320. É o tipo de defeito que só encontra quem mede a 320 pixels depois de cada mudança, não só na lição do layout.

**Faça o teste completo.** Abra o painel. O resumo deve dizer 5 serviços verificados, 4 de 5 disponíveis, 1 fora do ar e 465 ms de resposta média: as cifras que você escreveu à mão na lição 2, calculadas agora pelas funções da lição 6 e escritas pelas desta. Clique em “Ordenar por tiempo de respuesta”: “Notificaciones” sobe para o segundo lugar, atrás de “Catálogo”, que já era o mais rápido, e “Inventario”, que não respondeu, vai para o último. Agora **sem tocar no mouse**: pressione Tab até chegar a um botão “Ver detalle”, pressione Enter e verifique que o detalhe aparece embaixo e que o foco continua nesse mesmo botão. É o comportamento que esta lição protege.

**Uma última verificação de segurança.** Inclua em `js/services.js` um serviço, com o seu `id`, cujo `name` seja `<img src="x" onerror="document.title = 'hackeado'">`, recarregue e observe que a tabela mostra esse texto, sem mais, e o título da aba não muda. Essa é a diferença entre um painel que desenha dados e um que os executa. Tire a linha ao terminar.

## O erro que você vai ver

O erro mais frequente de quem começa com o DOM é escrever o programa **antes** de existir o elemento que ele procura. A figura 7.7 o provoca de propósito, com um `<script>` comum (não um módulo) no `<head>`:

```html
<!-- fig07_07.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 7.7 — El script corre antes que el documento (ERROR A PROPÓSITO)</title>
  <!-- Un script CLÁSICO en el <head>, sin defer: se ejecuta en cuanto el navegador lo lee. -->
  <script>
    document.querySelector("#message").textContent = "Hola";
  </script>
</head>
<body>
  <main>
    <p id="message">Esperando…</p>
  </main>
</body>
</html>
```

Abra-a, abra o console com `F12` e você verá isto:

```text
Consola de Chrome:
Uncaught TypeError: Cannot set properties of null (setting 'textContent')

Consola de Firefox:
TypeError: document.querySelector(...) is null

La página se queda con «Esperando…».
```

A mensagem diz, traduzida: “Não é possível escrever a propriedade `textContent` de `null`”. É uma cadeia de causas:

1. Um `<script>` comum é executado **no instante em que o navegador o lê**. Como está no `<head>`, o navegador ainda não construiu o `<body>`.
2. `document.querySelector("#message")` procura um elemento que ainda não existe e devolve `null`, que é a resposta “não encontrei nada”.
3. `null.textContent = "Hola"` é uma operação impossível, porque `null` não tem propriedades. O JavaScript para ali.

Há três maneiras de consertá-lo, e a melhor é a que você já usa: **`<script type="module">`**, que é adiado sozinho, isto é, é executado quando o documento já foi lido ([MDN: o elemento `script`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Reference/Elements/script)). As outras são acrescentar `defer` a um script comum, ou pôr o script no final do `<body>`. Prefira o módulo: além disso, ele dá um escopo próprio às suas variáveis (não sujam o espaço global) e ativa o modo estrito sem que você peça.

Quando a mensagem for a mesma mas o script *estiver* num módulo, a causa é outra: um seletor mal escrito (`#mesage` em vez de `#message`) ou uma busca na página errada. **Leia a mensagem da direita para a esquerda**: que chamada devolveu `null`? Ponha `console.log(document.querySelector("#message"))` logo antes da linha que falha; se imprimir `null`, o problema é o seletor ou o momento, não o que você faz depois com ele.

## O que se faz errado

- **Escrever um dado de fora com `innerHTML`.** O custo é o ataque que você viu na figura 7.3: quem controla um texto controla a sua página. Corrige-se com `textContent` e com nada mais; escapar à mão os sinais `<` e `>` é a receita de todas as falhas que foram corrigidas uma por uma durante vinte anos.
- **Deixar um `onclick="..."` no HTML.** É código escrito dentro de um atributo: mistura a estrutura com o comportamento, só pode apontar para funções globais (e os módulos não as têm) e, como você verá na lição 11, uma política de segurança estrita o bloqueia por completo. Escreve-se `addEventListener` no JavaScript.
- **Um `div` ou um `span` com clique no lugar de um `button`.** Parece igual e não é alcançado com Tab nem ativado com Enter. Consertá-lo exige `tabindex`, um `role` e dois manipuladores de teclado, e mesmo assim fica pior que o botão nativo.
- **Perguntar ao documento qual é o estado.** `if (boton.textContent === …)` converte a tela na fonte da verdade. As duas cópias se contradizem assim que o texto muda. A verdade vive no objeto de estado.
- **Um ouvinte novo a cada desenho, sobre um elemento que não é descartado.** Se em `render` você escrevesse `elements.body.addEventListener(...)`, cada vez que se desenhasse de novo seria somado **outro** ouvinte ao mesmo `<tbody>`, e no segundo clique o detalhe seria selecionado e desselecionado duas vezes. Os ouvintes se registram **uma vez**, em `main.js`, não no desenho.
- **Modificar o array original ao ordenar.** `services.sort(...)` altera o array dos dados, e a ordem original se perde. Usa-se `toSorted`, que devolve uma cópia.
- **Ler medidas do documento enquanto você o escreve.** Acrescentar as linhas uma por uma não é, por si só, caro: o navegador espera o seu código terminar e calcula a posição de tudo uma única vez antes de pintar. O caro é intercalar leituras de medidas (`offsetHeight`, `getBoundingClientRect()`) entre uma escrita e outra, porque cada leitura o obriga a recalcular naquele instante; a web.dev chama isso de [*layout thrashing*](https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing). No painel, constroem-se primeiro todas as linhas e entregam-se juntas com `replaceChildren(...filas)` por outra razão: em um único passo tiram-se as linhas velhas e põem-se as novas, sem estados intermediários desenhados pela metade.
- **Montar um seletor à mão com um dado.** `querySelector('[data-id="' + id + '"]')` quebra com uma aspa no `id`. `CSS.escape` existe para isso.
- **Pôr um dado de fora como nome de classe sem verificá-lo.** `row.className = service.status` deixa o dado decidir que estilos se aplicam. Compara-se com uma lista fechada, como faz `createRow`.

## Exercícios

### Exercício 1 — Quebre o painel de propósito

Em `js/view.js`, mude a linha que escreve o nome do serviço para que use `innerHTML` em vez de `textContent`. Depois inclua em `js/services.js` um serviço cujo `name` seja `<img src="x" onerror="document.title = 'hackeado'">`. Antes de recarregar, escreva no seu diário de bordo o que você acha que se verá na linha e na aba. Recarregue, compare e depois desfaça as duas mudanças. Responda: que outros textos do painel, além do nome, seriam um caminho para o mesmo ataque se usassem `innerHTML`?

### Exercício 2 — O mais lento, no resumo

Acrescente ao resumo um quinto par: “Más lento” (“Mais lento”), com o nome e o tempo do serviço disponível que mais demora para responder, por exemplo “Búsqueda (950 ms)”. Se nenhum serviço respondeu, deve dizer “sin datos”. Decida, e justifique em uma frase, em que arquivo vai cada mudança: a conta, o lugar na página, a forma de encontrá-lo e o texto. É preciso tocar em `js/state.js`?

### Exercício 3 — Escape tira a seleção

Faça com que, ao pressionar a tecla Escape, a seleção do serviço seja removida, não importa onde esteja o foco. Dica: o evento se chama `keydown`, `evento.key` diz qual tecla foi, e se escuta em `document`. A sua mudança deve tocar em `js/state.js` e `js/main.js`, e **não** em `js/view.js`. Verifique com o teclado que, depois do Escape, o foco continua no botão em que estava.

## Soluções

### Solução 1

Em `createRow`, a linha `nameCell.textContent = service.name;` passa a `nameCell.innerHTML = service.name;`. Ao recarregar, a linha do serviço hostil não mostra o nome (a imagem não carrega e não deixa texto) e o título da aba muda para “hackeado”. Com a linha restaurada, a linha mostra o texto completo do ataque e o título não se mexe.

Resposta à pergunta: o **estado** (`service.status` passa pela lista fechada, então não é um caminho, mas seria se fosse escrito com `innerHTML`), o **tempo** (`${service.responseMs} ms`), o **resumo** e o **detalhe**: qualquer dado que venha de fora e seja escrito com `innerHTML` é um caminho. Um número tampouco está a salvo assim que o dado chega pela rede: nada garante que `responseMs` seja um número e não um texto com HTML. Por isso a regra não distingue entre “dados perigosos” e “dados inofensivos”: **nenhum entra com `innerHTML`**.

### Solução 2

A conta é uma pergunta sobre os dados e vai com as outras contas, em `js/stats.js`; o lugar na página é um par a mais do `<dl>`, em `index.html`; encontrar esse lugar é trabalho de `js/main.js`, que é quem conhece os `id`; e escrever o texto é desenho, então vai em `js/view.js`. `js/state.js` não muda, porque o mais lento é calculado a partir da lista e não é algo que o painel tenha de lembrar.

```js
// js/stats.js — al final del archivo
export function slowestService(list) {
  return list
    .filter((service) => service.status === "available")
    .toSorted((a, b) => b.responseMs - a.responseMs)[0] ?? null;
}
```

É a mesma ideia de `slowest` do Exercício 2 da lição 6, mas devolve o serviço inteiro e não o seu nome, porque o texto precisa dos dois dados. Com uma lista sem serviços disponíveis, `[0]` dá `undefined` e `?? null` o converte em `null`, que é a forma do curso de dizer “não há dado”. Em `index.html`, um par a mais no final do `<dl>`:

```html
<div>
  <dt>Más lento</dt>
  <dd id="summary-slowest"></dd>
</div>
```

Em `js/main.js`, `slowest: document.querySelector("#summary-slowest"),` dentro do objeto `elements`. E em `js/view.js`, importa-se junto a `summarize` e escreve-se em `render`, depois da média:

```js
import { summarize, slowestService } from "./stats.js";
// …
  const slowest = slowestService(services);
  elements.slowest.textContent = slowest === null ? "sin datos" : `${slowest.name} (${slowest.responseMs} ms)`;
```

O resumo diz “Más lento: Búsqueda (950 ms)”. E como o `<dl>` da lição 5 conta as suas próprias colunas, o quinto par se acomoda sozinho, sem tocar no CSS.

### Solução 3

Uma função nova em `js/state.js` (a única forma de alterar o estado é uma função do estado):

```js
export function clearSelection(state) {
  state.selected = null;
}
```

Em `js/main.js`, acrescenta-se `clearSelection` ao `import` e, antes da última linha (`render(state, elements);`), o ouvinte:

```js
// Escape quita la selección, esté donde esté el foco.
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") update(() => clearSelection(state));
});
```

Usa-se `update` e não `render` a seco para que o foco volte ao botão que o tinha. `js/view.js` não muda: já sabia desenhar o caso “sem seleção”.

## Como sei que consegui

- [ ] Com a pasta `programas/` do repositório servida no seu computador, ao abrir `07-dom-eventos-estado/fig07_03.html`, o título da aba muda para “Se ejecutó código que venía en un dato” (“Foi executado código que vinha em um dado”). Em `fig07_04.html`, não.
- [ ] Em `07-dom-eventos-estado/panel/`, o resumo diz 5, 4 de 5, 1 e 465 ms, e nenhuma dessas cifras está escrita no HTML.
- [ ] O `<tbody id="services-body">` do seu `index.html` não tem linhas escritas à mão, e o Inspetor mostra cinco.
- [ ] Só com o teclado: Tab chega a “Ver detalle de Pagos”, Enter mostra “Pagos: disponible, responde en 480 ms.” e o foco continua nesse botão.
- [ ] `state-test.html` mostra seis linhas que começam com `ok`.
- [ ] A 320 px de largura não há barra de rolagem horizontal: no console, `document.documentElement.scrollWidth <= document.documentElement.clientWidth` devolve `true`.
- [ ] O console do navegador não mostra nenhum erro no painel.
- [ ] Você procura a palavra `innerHTML` nos seus arquivos `.js` e ela não aparece.

**Revisão de lições anteriores** (responda sem olhar, e depois verifique):

1. Na lição 2: por que um `<button>` é melhor que um `<div>` com um clique?
2. Nas lições 4 e 5: o que faz `flex-wrap` e quando ele convém antes de uma consulta `@media`?
3. Na lição 6: por que um serviço fora do ar tem `responseMs: null` e não zero?

## Para ler mais

- [MDN — Introdução ao DOM](https://developer.mozilla.org/pt-BR/docs/Web/API/Document_Object_Model/Introduction) — o que é a árvore do documento e como se percorre; consultado em 7 de outubro de 2026.
- [MDN — Borbulhamento de eventos](https://developer.mozilla.org/pt-BR/docs/Learn_web_development/Core/Scripting/Event_bubbling) — `target`, `currentTarget` e delegação explicados passo a passo; consultado em 7 de outubro de 2026.
- [OWASP — Prevenção de XSS baseado no DOM](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html) — os sinks perigosos e por que `textContent` é a forma segura; consultado em 7 de outubro de 2026.
- [MDN — `Element.innerHTML`](https://developer.mozilla.org/pt-BR/docs/Web/API/Element/innerHTML) — o aviso de segurança com o exemplo de `onerror`; consultado em 7 de outubro de 2026.
