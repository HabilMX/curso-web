# Lição 4 — Organizar com Flexbox e Grid

**Tempo:** duas sessões de cerca de 90 min. Uma divisão que funciona: na primeira, “O porquê antes do como” e o Flexbox (4.1), com a barra de controles; na segunda, o Grid (4.2), o painel organizado, levá-lo ao seu `revisor` (4.2.5) e os exercícios. Cada sessão termina em uma página que você pode abrir e medir.

**O que você constrói:** o painel organizado em uma tela larga

**O que você aprende:** uma dimensão com Flexbox e duas com Grid; os dois eixos, `gap`, `flex` e `flex-wrap`; colunas com `fr` e `repeat()`; medir com as ferramentas do navegador em vez de a olho

**De onde você vem.** Você traz o painel da [Lição 2](02-html-con-significado.md), escrito à mão com HTML que diz o que é cada coisa, e a folha de estilo da [Lição 3](03-css-cascada-caja.md), com as suas variáveis de cor, a sua caixa previsível e os seus selos de estado. Essa folha **ainda não organiza nada**: cada elemento vai abaixo do anterior, que é o que o navegador faz quando ninguém lhe pede outra coisa. Se por qualquer razão a sua cópia não coincidir com a dessas lições, não importa: a página `fig04_01.html` e a sua folha `fig04_01/styles.css` são exatamente esse ponto de partida, e você as tem completas mais abaixo. Todas as páginas desta lição estão em [`programas/04-flexbox-grid/`](https://github.com/HabilMX/curso-web/tree/main/programas/04-flexbox-grid) do [repositório do curso](https://github.com/HabilMX/curso-web). Repare num detalhe antes de abri-las: todas, menos o painel organizado, carregam a folha de partida com `<link rel="stylesheet" href="fig04_01/styles.css">`, um caminho *relativo* que o navegador procura na pasta `fig04_01` junto da página. Por isso funcionam se você baixa (ou clona com o Git) o repositório completo e liga o servidor a partir da sua pasta `programas/`, ou se copia cada página **junto com** a pasta `fig04_01`. Se você copiar só o `.html`, a página aparecerá sem estilos: o navegador pediu `fig04_01/styles.css`, o servidor respondeu `404` e a aba Rede das ferramentas mostra isso em vermelho. A `fig04_06.html`, o painel organizado com que a lição termina, usa do mesmo modo a sua própria folha, `fig04_06/styles.css`. Para esta lição você trabalha com dois arquivos da sua pasta `revisor`, `index.html` e `css/styles.css`, e, para os experimentos soltos, com páginas de teste ao lado. A partir da pasta do projeto, o servidor local continua sendo `python3 -m http.server 8000 --bind 127.0.0.1`.

**O que esta lição não faz.** Ainda não resolve o celular: que a página funcione com 320 pixels de largura é o tema completo da [Lição 5](05-pagina-adaptable.md), que parte justamente de onde esta termina. Tampouco toca em JavaScript. As cifras do resumo continuam escritas à mão; um programa as contará na Lição 6 e a Lição 7 as desenhará na tabela. Hoje só muda *onde* vai cada coisa e *quanto mede*, não *o que* diz.

## Ao terminar, você vai conseguir

- Explicar o que são um contêiner flex, os seus elementos e os seus dois eixos, e prever o que fazem `justify-content` e `align-items` antes de recarregar.
- Escrever uma barra de controles com `display: flex`, `flex-wrap`, `gap`, `align-items` e `flex`, e dizer quem fica com o espaço que sobra.
- Ler a propriedade `flex` como base, crescer e encolher, e reconhecer quando um elemento se recusa a encolher e como se permite que ele o faça.
- Escolher o Flexbox quando a distribuição é em uma única dimensão e o Grid quando são duas, e justificar a escolha com o painel à frente.
- Declarar uma grade com `grid-template-columns`, a unidade `fr` e `repeat()`, e explicar de onde saem as linhas que você não declarou.
- Medir com as ferramentas do navegador onde começa e onde termina cada caixa, em vez de julgar a olho.
- Manter a ordem do HTML como ordem de leitura, sem reorganizar com `order` o que o teclado percorre.

## O porquê antes do como

Abra `fig04_01.html` no seu servidor local, com a janela do navegador bem larga, como a de um computador de mesa. O que você vê é o painel tal como a Lição 3 o deixou: legível, com as suas cores e os seus selos, mas **organizado como uma lista de compras**. O título, a data e os links de navegação vão um embaixo do outro, embora sobre espaço para pô-los em uma única linha. As quatro cifras do resumo são quatro linhas, uma embaixo da outra, cada uma em toda a largura. O campo de busca, os filtros e o botão também estão empilhados. E a tabela fica lá embaixo, depois de todo o resto.

Meça em vez de supor. Medi com o Chrome 154, de forma automatizada e sem janela, com a janela a 1440 pixels: o conteúdo é uma coluna de 60 rem (960 px) centralizada, e dentro dela **cada caixa ocupa toda a largura que tem**: o título, a data e a navegação medem 928 px cada um, e dentro das seções, com o seu preenchimento, a cifra “Caídos” mede 878 px, igual à tabela e ao parágrafo onde vive o botão “Revisar ahora”. O botão não: mede uns 135 px, porque um botão é um elemento em linha e só ocupa o que o seu texto precisa; o que se estica é o parágrafo que o contém. Nada transborda e nada está mal escrito, mas o espaço é desperdiçado: para chegar à tabela, que é o que quem abre o painel vem ver, é preciso passar por três linhas de cabeçalho, quatro cifras e três controles, cada um na sua própria linha. As quatro cifras caberiam de sobra em uma única fila, e os três controles também.

A causa é uma só. **Até agora, o painel não decide como organizar o que leva dentro.** Um bloco vai embaixo do outro porque é o que faz o fluxo normal da página, e cada caixa mede toda a largura porque ninguém lhe disse outra coisa. Esta lição ensina a decidir com as duas ferramentas que o CSS tem para isso: o **Flexbox**, para distribuir coisas ao longo de uma linha, e o **Grid**, para organizá-las em linhas e colunas ao mesmo tempo.

Um aviso honesto desde o início, para que não o pegue de surpresa: ao terminar esta lição, o painel ficará bom em uma tela larga, e ainda **não** em um celular. Se você reduzir a janela a 320 pixels, a página continua transbordando. Isso não é um descuido: é um problema diferente, com as suas próprias ferramentas, e ocupa a lição seguinte inteira. Aqui você aprende a organizar; na Lição 5, a fazer com que a organização sirva em qualquer largura.

### Como você vai conferir

Uma organização se julga mal a olho: duas caixas que “parecem” da mesma largura diferem por vinte pixels, e um vão que “parece” uniforme não é. Por isso, nesta lição você vai medir, e a ferramenta você já tem: as ferramentas do navegador que conheceu na Lição 1.

Abra-as com `F12` e entre na aba de elementos (no Chrome e no Edge se chama “Elementos”; no Firefox, “Inspetor”). Passe o cursor sobre qualquer tag da árvore do documento: o navegador sombreia essa caixa na página e mostra uma pequena etiqueta com o seu nome e as suas medidas, por exemplo, em `fig04_01.html` a 1440 px, `dl 878 × 297.38` para a lista do resumo. O primeiro número é a largura e o segundo a altura, em pixels CSS. Se você clicar na tag, o painel da direita mostra na seção “Computado” (ou “Calculado”) a sua caixa completa: conteúdo, preenchimento, borda e margem. E quando um elemento é um contêiner flex ou grid, a árvore põe ao lado dele um pequeno selo que diz `flex` ou `grid`; ao clicar nele, o navegador desenha sobre a página as linhas da grade ou o contorno de cada elemento flex. Esse selo é a forma mais rápida de saber se uma propriedade de organização está agindo ou não.

Para saber onde **começa** e onde **termina** uma caixa, que é o que você vai usar para conferir a maioria dos resultados desta lição, serve o modo responsivo (o ícone de celular e tablet no Chrome e no Edge; `Ctrl`+`Shift`+`M` no Firefox): ali você escreve a largura exata da janela, e a régua de cima dá as posições. Quando nesta lição você ler “o título vai de 256 a 553 px”, significa que a sua borda esquerda está a 256 pixels da borda esquerda da janela e a sua borda direita a 553: o mesmo que você veria ao passar o cursor sobre ele com a janela nessa largura.

## Os conceitos

Duas ideias, nesta ordem: o **Flexbox**, que organiza coisas em uma linha, e o **Grid**, que organiza coisas em linhas e colunas ao mesmo tempo. Cada uma é explicada primeiro com um exemplo mínimo, numa página de teste que você pode abrir e medir, e depois é aplicada ao painel.

### 4.1 Flexbox: organizar em uma dimensão

#### 4.1.1 Contêiner, elementos e os dois eixos

Por padrão, os filhos de um elemento se organizam segundo o **fluxo normal**: os elementos de bloco (`<p>`, `<div>`, `<section>`) vão um embaixo do outro e ocupam toda a largura disponível, e os de linha (`<span>`, `<a>`, `<label>`) fluem como as palavras de uma linha. O fluxo normal é a razão por que o painel da lição anterior é uma coluna longa.

[O **Flexbox** é um modo de organização alternativo](https://www.w3.org/TR/css-flexbox-1/) que se ativa com uma única declaração sobre o *pai*:

```css
.container {
  display: flex;
}
```

Com ela, o pai se torna um **contêiner flex** e os seus filhos diretos se tornam **elementos flex**. Só os filhos diretos: os netos não ficam sabendo. A primeira coisa que se nota é que os filhos, que antes iam um embaixo do outro, agora vão um ao lado do outro, em uma fila. Mas o importante não é a fila: é que o contêiner agora **distribui o espaço** entre os seus filhos, e você diz a ele como.

O Flexbox trabalha com dois eixos, e quase todos os erros de iniciante vêm de confundi-los. O **eixo principal** é a direção em que os elementos se organizam; o **eixo transversal** é o perpendicular. Com o valor padrão, `flex-direction: row`, o eixo principal é horizontal (da esquerda para a direita em português) e o transversal é vertical. Se você escrever `flex-direction: column`, eles se trocam: o principal passa a ser vertical. Duas propriedades se apoiam nessa distinção, e por isso vale a pena aprendê-la antes dos nomes:

- `justify-content` distribui os elementos **ao longo do eixo principal**.
- `align-items` os alinha **ao longo do eixo transversal**.

Abra `fig04_02.html` para ver. É uma página de teste com duas caixas de linhas pontilhadas, cada uma com três elementos azuis de alturas diferentes:

```html
<!-- fig04_02.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Los dos ejes de Flexbox</title>
  <link rel="stylesheet" href="fig04_01/styles.css">
  <style>
    .box {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      gap: 0.5rem;
      height: 9rem;
      padding: 0.5rem;
      background: var(--color-surface);
      border: 2px dashed var(--color-border);
    }

    .box > div {
      padding: 0.5rem 1rem;
      color: #ffffff;
      background: var(--color-accent);
      border-radius: var(--radius);
    }

    .box > div:nth-child(2) { height: 5rem; }
    .box > div:nth-child(3) { height: 2.5rem; }

    .box-column {
      flex-direction: column;
      align-items: flex-start;
      height: 14rem;
    }
  </style>
</head>
<body>
  <main>
    <h1>Los dos ejes</h1>

    <h2>flex-direction: row (el eje principal es horizontal)</h2>
    <div class="box">
      <div>Uno</div>
      <div>Dos</div>
      <div>Tres</div>
    </div>

    <h2>flex-direction: column (el eje principal es vertical)</h2>
    <div class="box box-column">
      <div>Uno</div>
      <div>Dos</div>
      <div>Tres</div>
    </div>
  </main>
</body>
</html>
```

Na primeira caixa (`row`), `justify-content: space-between` cola “Uno” na borda esquerda, “Tres” na borda direita e deixa “Dos” no meio, com o espaço que sobra distribuído nos vãos. `align-items: center` centraliza os três verticalmente, por isso, embora tenham alturas diferentes, todos compartilham a mesma linha central. Na segunda caixa muda só a direção: o eixo principal agora é vertical, de modo que `justify-content: space-between` distribui para baixo (“Uno” em cima, “Tres” embaixo) e `align-items: flex-start` cola tudo na borda esquerda, que agora é a borda do eixo transversal. **As propriedades não mudaram de significado: mudaram de direção.** Isso é o que significa “os eixos”.

Os valores que você mais vai usar são poucos:

| Propriedade | Valor | O que faz |
|---|---|---|
| `justify-content` | `flex-start` (padrão) | Cola os elementos no início do eixo principal |
| `justify-content` | `center` | Junta-os no centro |
| `justify-content` | `space-between` | O primeiro no início, o último no final, o resto distribuído entre eles |
| `justify-content` | `flex-end` | Cola-os no final |
| `align-items` | `stretch` (padrão) | Cada elemento se estica até preencher o eixo transversal |
| `align-items` | `flex-start` / `center` / `flex-end` | Alinha no início, no centro ou no final do eixo transversal |
| `align-items` | `baseline` | Alinha pela linha de base do texto, útil quando os tamanhos de fonte diferem |

Um detalhe útil: o valor padrão de `align-items` é `stretch`, e por isso, assim que você ativa `display: flex`, os elementos de uma fila **que não têm uma altura própria** se esticam até a altura da fila e ficam todos igualmente altos. É um efeito colateral que surpreende na primeira vez. A condição importa: [o `stretch` só estica quem tem a altura em `auto`](https://developer.mozilla.org/pt-BR/docs/Web/CSS/align-items#stretch); um elemento com `height` escrita conserva a sua e fica colado no início do eixo transversal. Medi tirando da primeira caixa de `fig04_02.html` o `align-items: center`, para que fique o `stretch` padrão: a caixa mede 144 px por fora e restam 124 por dentro, descontados o seu preenchimento e a sua borda. “Uno”, que não tem altura própria, se esticou até esses 124 px; “Dos” e “Tres”, que a têm escrita (`5rem` e `2.5rem`), ficaram em 80 e 40 px, colados em cima.

#### 4.1.2 O espaço entre elementos: `gap`

Entre os elementos flex é preciso deixar ar. O costume antigo era pôr um `margin` em cada filho, e esbarrava-se em dois problemas: o último elemento fica com uma margem a mais, e quando os elementos descem de linha é preciso adivinhar quais margens sobram. [A propriedade `gap`, que se escreve no contêiner](https://www.w3.org/TR/css-align-3/), resolve as duas coisas: põe o espaço só *entre* elementos, nunca nas bordas, e igualmente na horizontal e na vertical. Você pode dar um valor (`gap: 1rem`) ou dois (`gap: 0.5rem 1rem`: primeiro o espaço entre linhas, depois o espaço entre colunas).

O `gap` funciona no Flexbox e no Grid, e hoje é uma das coisas que você pode usar sem medo, embora tenha chegado aos dois em datas diferentes, e convém saber disso porque você vai ver código antigo com margens no lugar. No Grid, [o MDN o marca como disponível em todos os navegadores desde outubro de 2017](https://developer.mozilla.org/pt-BR/docs/Web/CSS/gap). No Flexbox demorou mais: [o último navegador a aceitá-lo foi o Safari 14.1, em abril de 2021](https://web-platform-dx.github.io/web-features-explorer/features/flexbox-gap/), e a plataforma o considera de disponibilidade geral (*widely available*, que significa “disponível em todos há pelo menos 30 meses”) desde outubro de 2023. A regra que você seguirá neste curso é simples: **a separação entre irmãos quem põe é o pai com `gap`; as margens se reservam para separar um bloco que não é irmão.**

#### 4.1.3 Quanto mede cada elemento: `flex`

Até aqui distribuímos o espaço *que sobra*. Falta dizer o que acontece quando os elementos não cabem, ou quando sobra e algum deve aproveitá-lo. Três números controlam isso, e se escrevem juntos na propriedade `flex`:

```css
flex: <flex-grow> <flex-shrink> <flex-basis>;
```

- A **base** (`flex-basis`) é o tamanho de partida do elemento sobre o eixo principal. Com `auto` é o que ele teria pela sua propriedade de tamanho nesse eixo —`width` numa fila, `height` numa coluna ([assim a define a especificação](https://www.w3.org/TR/css-flexbox-1/#flex-basis-property))— ou, se não tem, pelo seu conteúdo.
- **Crescer** (`flex-grow`) diz quanto do espaço que sobra o elemento recebe. Com `0` não recebe nada. Com `1`, todos os elementos que valem `1` dividem o que sobra em partes iguais; um com `2` recebe o dobro de um com `1`.
- **Encolher** (`flex-shrink`) diz quanto o elemento cede quando falta espaço. Com `0` nunca cede; com `1` cede em proporção.

Os valores iniciais são `0 1 auto`: não cresce, sim encolhe, mede o que mede o seu conteúdo. Por isso, sem que você peça, um contêiner flex cheio de elementos se aperta antes de transbordar. Há atalhos que convém reconhecer: `flex: 1` significa `1 1 0` (“ocupe tudo o que sobrar, a partir de zero”), `flex: auto` é `1 1 auto`, e `flex: none` é `0 0 auto` (“tamanho fixo”).

Tem uma armadilha que custa uma tarde na primeira vez. Um elemento flex **não encolhe abaixo do tamanho mínimo do seu conteúdo**: uma palavra longa sem espaços, uma imagem, um campo de texto com largura fixa. [O MDN descreve assim](https://developer.mozilla.org/pt-BR/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox): um elemento pode encolher até o seu tamanho `min-content` e não mais. Quando isso acontece, o elemento fica largo e o contêiner transborda. A solução tem duas partes: dizer ao elemento que ele sim pode encolher mais, com `min-width: 0` (numa fila; numa coluna, onde o eixo principal é vertical, a propriedade equivalente é `min-height: 0`), e dar ao seu conteúdo uma maneira de caber em menos espaço (cortá-lo com reticências ou deixar que desça de linha). Só com a primeira parte, o elemento encolhe mas o texto sai dele.

Veja em `fig04_03.html`. São duas linhas iguais, cada uma com o nome de um serviço, o seu endereço (uma URL longa, que não tem espaços onde se partir) e o selo de estado. O endereço leva três declarações que pedem “se não couber, corte-se com reticências”: `overflow: hidden`, `white-space: nowrap` e `text-overflow: ellipsis`. A única diferença entre as duas linhas é a classe `can-shrink`, que acrescenta `min-width: 0` à caixa do nome:

```html
<!-- fig04_03.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>El mínimo de un elemento flex</title>
  <link rel="stylesheet" href="fig04_01/styles.css">
  <style>
    .service {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.5rem;
      border: 2px dashed var(--color-border);
    }

    .service-name {
      flex: 1 1 auto;
    }

    .service-name h2,
    .service-name p {
      margin: 0;
    }

    .address {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: var(--color-muted);
    }

    .can-shrink {
      min-width: 0;
    }
  </style>
</head>
<body>
  <main>
    <h1>El mínimo de un elemento flex</h1>

    <div class="service" id="one">
      <div class="service-name">
        <h2>Inventario</h2>
        <p class="address">https://inventario.example.com/salud/v2/estado-completo</p>
      </div>
      <span class="status status-down">Caído</span>
    </div>

    <div class="service" id="two">
      <div class="service-name can-shrink">
        <h2>Inventario</h2>
        <p class="address">https://inventario.example.com/salud/v2/estado-completo</p>
      </div>
      <span class="status status-down">Caído</span>
    </div>
  </main>
</body>
</html>
```

Medi a 320 px, a largura de um celular pequeno. Na primeira linha, a caixa do nome se recusa a medir menos que a URL completa (417 px), empurra o selo para fora da tela e a página mede **514 px**: transborda, embora o endereço “saiba” se cortar. O motivo é o de cima: o mínimo automático de um elemento flex é a largura do seu conteúdo, e a URL inteira é esse conteúdo. Na segunda linha, com `min-width: 0`, a caixa do nome baixa a 197 px, a URL é cortada com “…” e o selo fica dentro, a 26 px da borda direita da janela. A 768 px ou mais as duas linhas ficam iguais, porque ali a URL cabe completa: a armadilha só aparece quando falta espaço, e por isso passa despercebida na tela de quem programa.

No painel desta lição não é preciso: nenhum elemento flex do painel tem um conteúdo que se recuse a encolher. Mas a ideia volta na Lição 5 com outro nome: uma coluna `1fr` do Grid tem o mesmo mínimo automático, e a solução, `minmax(0, 1fr)`, é a mesma ideia de escrever o mínimo zero de propósito.

#### 4.1.4 `flex-wrap`: descer de linha em vez de se apertar

Por padrão, um contêiner flex tem `flex-wrap: nowrap`: todos os elementos vão em **uma única linha**, e se não cabem, encolhem (e se já não podem encolher, transbordam). Com `flex-wrap: wrap`, os elementos que não cabem **descem para a linha seguinte**. O MDN diz isso com uma frase útil: quando há várias linhas, cada uma se comporta como um contêiner flex à parte. Isso significa que `justify-content` e `flex-grow` agem dentro de cada linha, não sobre o conjunto.

A decisão de quem cabe em qual linha se toma com a *base* de cada elemento, antes de crescer ou encolher, mas ajustada pelos seus limites: se a base é menor que o seu `min-width` (ou maior que o seu `max-width`), conta o limite, e também contam as suas margens. [A especificação](https://www.w3.org/TR/css-flexbox-1/#algo-line-break) chama isso de *tamanho principal hipotético*. Medi no Chrome 154: dois elementos com base de 200 px cabem juntos numa fila de 500 px; se ao segundo você der `min-width: 320px`, ele desce para a linha seguinte, embora a sua base não tenha mudado. Aqui está o truque que sustenta quase tudo o que é “adaptável” sem escrever uma única media query, e que a Lição 5 vai aproveitar a fundo: **se você der a um elemento uma base razoável e permitir que ele cresça, o navegador cuida de organizá-lo**. Uma base de `14rem` diz “prefiro medir uns 224 px; ponha-me numa linha com quem couber ao meu lado; se sobrar espaço, reparta-o”. Numa tela larga, cabem vários na linha; numa estreita, cada um desce e ocupa a sua linha inteira. Ninguém escreveu “a 600 px faça tal coisa”: o conteúdo decide.

#### 4.1.5 Exemplo resolvido: a barra de controles

A seção “Servicios” do painel tem hoje três controles um embaixo do outro: o campo de busca com o seu rótulo, o grupo de filtros (os três botões de rádio) e o botão “Revisar ahora”. Numa tela larga o natural é uma única fila; num celular, três linhas. É o caso perfeito para o Flexbox, porque são irmãos que repartem *uma* linha.

Primeiro é preciso preparar o HTML. Você já tem os três controles; é preciso envolvê-los em um contêiner com nome para poder apontar para ele a partir do CSS. E o campo com o seu rótulo é agrupado para que viajem juntos. Esta é a única mudança de HTML deste passo:

```html
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
</div>
```

Observe o que *não* foi tocado: os elementos continuam sendo os da Lição 2, com os seus rótulos associados. A única coisa nova é um `div` contêiner e uma classe. O significado não mudou; só se acrescentou um lugar para apontar. Agora o CSS:

```html
<!-- fig04_04.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Barra de controles con Flexbox</title>
  <link rel="stylesheet" href="fig04_01/styles.css">
  <style>
    .controls {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      gap: 1rem;
    }

    .controls p,
    .controls fieldset {
      margin: 0;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      flex: 1 1 14rem;
    }

    .field input {
      width: 100%;
    }
  </style>
</head>
<body>
  <main>
    <h1>Barra de controles</h1>
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
    </div>
  </main>
</body>
</html>
```

Linha por linha:

- `.controls { display: flex; flex-wrap: wrap; ... }` ativa o Flexbox e permite descer de linha. Os três filhos diretos (o campo, o grupo e o botão) são agora elementos flex.
- `align-items: flex-end` os alinha pela borda inferior. Assim o campo, o grupo de filtros e o botão compartilham a mesma base, embora as suas alturas sejam diferentes, e parecem uma única barra. Com o valor padrão, `stretch`, o botão se esticaria até a altura do grupo.
- `gap: 1rem` põe o espaço entre eles, sem margens soltas.
- `.controls p, .controls fieldset { margin: 0 }` tira as margens que traziam por padrão; agora o espaço quem põe é o pai.
- Em `.field`, que é por sua vez um contêiner flex, `flex-direction: column` empilha o rótulo sobre o campo, e `flex: 1 1 14rem` diz ao campo: “meça 14rem de base, pode crescer, pode encolher”. É o único dos três que cresce, e por isso absorve o espaço que sobra da fila.
- `.field input { width: 100% }` faz o campo preencher o seu contêiner. Sem esta linha, o parágrafo `.field` cresceria, mas o campo ficaria com a largura que o navegador dá por padrão a um campo de texto, e o espaço ganho ficaria vazio à sua direita.

Carreguei esta página em cinco larguras (320, 375, 768, 1024 e 1440 px) e nas cinco a largura da página é igual à da janela: a barra não transborda em nenhuma. A 320 e a 375 px os controles formam três linhas; de 768 px em diante, uma única fila, com o campo ocupando tudo o que sobra. A 1440 px medi peça por peça: o campo vai de 256 a 672.5 px (416.5 de largura, muito mais que a sua base de 224), o grupo de rádios de 688.5 a 1033 e o botão de 1049 a 1184, colado na borda direita do conteúdo. Entre peça e peça, os 16 px do `gap`.


Há uma propriedade do Flexbox que você deve conhecer, justamente para não usá-la de qualquer jeito: `order`. Permite mudar a ordem *visual* dos elementos sem mexer no HTML. O problema é que o teclado e o leitor de tela seguem a ordem do **código**, não a da tela: quem navega com Tab saltaria de um lado a outro da barra sem entender por quê. Isso descumpre o [critério 1.3.2 (“Sequência significativa”)](https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html) e [o 2.4.3 (“Ordem do foco”)](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html) das diretrizes. Regra do curso: **a ordem do HTML é a ordem de leitura; se uma caixa deve ir primeiro, escreve-se primeiro.**

### 4.2 Grid: organizar em duas dimensões

#### 4.2.1 Flexbox ou Grid: a pergunta que decide

O Flexbox organiza em **uma linha** (com fileiras que descem se você permitir). [O Grid organiza em **linhas e colunas ao mesmo tempo**](https://www.w3.org/TR/css-grid-2/): define uma grade e coloca cada elemento em uma célula. Parecem-se em que os dois começam com uma declaração `display` no pai e os dois aceitam `gap`. Diferem em quem manda.

No Flexbox **manda o conteúdo**: os elementos são os que pedem espaço e o contêiner o distribui. Por isso é perfeito para uma barra de controles, um cabeçalho com título e data, uma fila de botões: grupos de coisas cujo tamanho depende do que dizem. No Grid **manda a grade**: as colunas existem primeiro, e os elementos se organizam nelas, de modo que ficam alinhados tanto na horizontal quanto na vertical. Por isso é perfeito para cartões de resumo, um quadro de cifras ou o esqueleto da página.

Uma pergunta prática para decidir: *quero que as coisas da segunda linha fiquem alinhadas com as da primeira?* Se sim, é Grid. Se cada linha se organiza por conta própria, é Flexbox. E não são excludentes: no painel você vai usar as duas, uma dentro da outra.

#### 4.2.2 Colunas, `fr` e `repeat()`

Para ativar o Grid escreve-se `display: grid` no pai, e diz-se a ele quantas colunas tem com `grid-template-columns`:

```css
.summary {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.75rem;
}
```

A unidade nova é `fr`, de *fração*: “uma parte do espaço disponível”. Três colunas de `1fr` repartem a largura em três partes iguais; `1fr 2fr` daria à segunda o dobro da primeira; `200px 1fr` fixa a primeira coluna e deixa a segunda com todo o resto. Repetir três vezes a mesma coisa cansa, e por isso existe o `repeat()`: `repeat(3, 1fr)` é o mesmo que `1fr 1fr 1fr`.

Não é preciso dizer quantas linhas há. Se há seis elementos e três colunas, o navegador cria duas linhas sozinho. [O MDN as chama de **grade implícita**](https://developer.mozilla.org/pt-BR/docs/Web/CSS/CSS_grid_layout/Basic_concepts_of_grid_layout): a que se estende quando há conteúdo fora do que você declarou (a declarada é a *explícita*). A sua altura se controla com `grid-auto-rows`; por padrão, cada linha mede o que o seu conteúdo pedir.

Uma forma de se convencer de que você entendeu a grade implícita: com quatro elementos e `repeat(2, 1fr)`, quantas linhas há? Duas, de dois elementos cada uma, e ninguém as declarou. O Exercício 2 pede que você confirme isso com as cifras do resumo.

#### 4.2.3 Exemplo resolvido: o resumo em quatro colunas

O resumo do painel é o caso de manual para o Grid: quatro cifras que convém ver juntas, cada uma com o seu nome em cima e o seu valor embaixo, e alinhadas entre si. Antes do CSS, o HTML. O resumo da Lição 2 é uma lista de descrição (`<dl>`) com quatro grupos de termo e valor, e não há nada a mudar no seu significado. Só se acrescenta a ele uma classe para apontar:

```html
<dl class="summary">
```

Tampouco é preciso tocar nas quatro caixas (`div`) que já envolviam cada par de termo e valor: cada uma se torna um elemento da grade. Isto é o que acontece quando o HTML já tinha a estrutura correta: o Grid só lê o que já estava escrito. A página de teste `fig04_05.html` declara quatro colunas iguais:

```html
<!-- fig04_05.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Resumen en cuatro columnas fijas</title>
  <link rel="stylesheet" href="fig04_01/styles.css">
  <style>
    .summary {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0 1rem;
      margin: 0;
    }
  </style>
</head>
<body>
  <main>
    <h1>Resumen</h1>
    <dl class="summary">
      <div>
        <dt>Servicios revisados</dt>
        <dd>5</dd>
      </div>
      <div>
        <dt>Disponibles</dt>
        <dd>4 de 5</dd>
      </div>
      <div>
        <dt>Caídos</dt>
        <dd>1</dd>
      </div>
      <div>
        <dt>Respuesta promedio</dt>
        <dd>465 ms</dd>
      </div>
    </dl>
  </main>
</body>
</html>
```

Linha por linha: `display: grid` torna a lista um contêiner grid e os seus quatro `div` em elementos da grade; `grid-template-columns: repeat(4, 1fr)` pede quatro colunas que repartem a largura em partes iguais; `gap: 0 1rem` não deixa espaço entre linhas (há uma só) e deixa 16 px entre colunas; e `margin: 0` tira a margem que a lista de descrição traz por padrão, para que o espaço quem ponha seja quem a contém. Medi a 1440 e a 1024 px: as quatro cifras ficam em uma única fila, cada coluna de **220 px** exatos, com 16 px entre uma e outra. As contas fecham: o contêiner mede 928 px, os três vãos somam 48, e os 880 restantes divididos por quatro dão 220.

Uma pergunta razoável antes de seguir: *mudar o `display` de um elemento com significado próprio tira o seu significado?* Conferi no Chrome 154 com a árvore de acessibilidade: a lista de descrição com `display: grid` conserva os seus termos e as suas definições, e até uma tabela com `display: grid` conserva o seu papel de tabela. Em outros navegadores e com outros leitores de tela não há garantia: [Adrian Roselli, que há anos mede isso](https://adrianroselli.com/2020/11/under-engineered-responsive-tables.html), adverte que mudar o `display` de uma tabela pode tirar a navegação por células de quem usa um leitor. Como não é preciso correr o risco, a regra do curso é: **não se muda o `display` de uma tabela; muda-se o do seu envoltório**. A Lição 5 coloca isso em prática.

E agora a parte honesta do exemplo. Reduza a janela a 320 px e meça de novo: as quatro cifras se apertam, partem-se em várias linhas cada uma, e mesmo assim a página **mede 344 px de largura**, mais que a janela. Quatro colunas fixas são uma boa decisão quando há espaço e uma má quando não há, e o `1fr` tem um mínimo escondido que não deixa a coluna encolher além da sua palavra mais longa. Por que isso acontece, e a linha de CSS que faz a grade **contar sozinha** quantas colunas cabem, são o primeiro conceito da Lição 5. Por ora, fique com a pergunta que você saberá responder ao terminá-la: *quantas colunas cabem a 320 px, e quem deveria decidir?*

#### 4.2.4 O painel organizado

Com o que foi visto você já tem todas as peças para organizar o painel completo em uma tela larga. O painel da lição é `fig04_06.html`. As mudanças em relação à Lição 2 são poucas, e nenhuma muda o que o HTML diz: a classe `page-header` no cabeçalho, a classe `summary` na lista de descrição, e o `div.controls` com o seu `p.field` ao redor dos três controles, tal como em 4.1.5. A tabela fica exatamente igual.

```html
<!-- fig04_06.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Revisor de servicios</title>
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="fig04_06/styles.css">
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

  <main>
    <section id="summary">
      <h2>Resumen</h2>
      <dl class="summary">
        <div>
          <dt>Servicios revisados</dt>
          <dd>5</dd>
        </div>
        <div>
          <dt>Disponibles</dt>
          <dd>4 de 5</dd>
        </div>
        <div>
          <dt>Caídos</dt>
          <dd>1</dd>
        </div>
        <div>
          <dt>Respuesta promedio</dt>
          <dd>465 ms</dd>
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
      </div>

      <table>
        <caption>Estado de los servicios en la última revisión</caption>
        <thead>
          <tr>
            <th scope="col">Servicio</th>
            <th scope="col">Estado</th>
            <th scope="col">Tiempo de respuesta</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Catálogo</th>
            <td><span class="status status-available">Disponible</span></td>
            <td>120 ms</td>
          </tr>
          <tr>
            <th scope="row">Pagos</th>
            <td><span class="status status-available">Disponible</span></td>
            <td>480 ms</td>
          </tr>
          <tr>
            <th scope="row">Inventario</th>
            <td><span class="status status-down">Caído</span></td>
            <td>sin respuesta</td>
          </tr>
          <tr>
            <th scope="row">Notificaciones</th>
            <td><span class="status status-available">Disponible</span></td>
            <td>310 ms</td>
          </tr>
          <tr>
            <th scope="row">Búsqueda</th>
            <td><span class="status status-available">Disponible</span></td>
            <td>950 ms</td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>

  <footer>
    <p>Datos de ejemplo escritos a mano.</p>
  </footer>
</body>
</html>
```

Um aviso antes de olhar a folha: o cabeçalho em fila (`.page-header`) é o passo 1 do Exercício 1. Se você quiser resolvê-lo por conta própria, faça-o antes de ler o CSS. A folha é a da Lição 3 **sem tocar em nenhuma das suas regras**, com um bloco novo no final da camada `components`; os comentários indicam onde começa:

```css
/* fig04_06/styles.css */
/* La hoja del panel al terminar la Lección 4: la de la Lección 3, sin tocar una
   sola de sus reglas, más un bloque al final con Flexbox y Grid. */

/* El orden de las capas se declara una sola vez, arriba. La última gana. */
@layer reset, base, components;

@layer reset {
  /* La caja: el ancho que escribes es el ancho que se ve. */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  /* El navegador no hace que los campos hereden la letra del texto. */
  input,
  button {
    font: inherit;
  }
}

@layer base {
  /* Las decisiones del panel viven aquí, con nombres que dicen para qué sirven. */
  :root {
    --color-text: #1b1f24;
    --color-muted: #57606a;
    --color-page: #f6f8fa;
    --color-surface: #ffffff;
    --color-border: #d0d7de;
    --color-control: #6e7781;
    --color-accent: #0b5cad;

    --color-available-text: #0f5132;
    --color-available-bg: #d1e7dd;
    --color-down-text: #842029;
    --color-down-bg: #f8d7da;

    --space-1: 0.25rem;
    --space-2: 0.5rem;
    --space-3: 1rem;
    --space-4: 1.5rem;
    --space-5: 2.5rem;

    --font-body: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    --line-height: 1.6;
    --radius: 0.375rem;
  }

  body {
    margin: 0;
    background: var(--color-page);
    color: var(--color-text);
    font-family: var(--font-body);
    line-height: var(--line-height);
  }

  /* Un ancho cómodo para leer, centrado: auto reparte el espacio sobrante. */
  header,
  main,
  footer {
    max-width: 60rem;
    margin: 0 auto;
    padding: var(--space-3);
  }

  h1 {
    margin: 0 0 var(--space-2);
    font-size: 2rem;
    line-height: 1.2;
  }

  h2 {
    margin: 0 0 var(--space-3);
    font-size: 1.375rem;
    line-height: 1.3;
  }

  a {
    color: var(--color-accent);
  }

  /* Que el foco del teclado se vea siempre: nunca outline: none sin reemplazo. */
  :focus-visible {
    outline: 3px solid var(--color-accent);
    outline-offset: 2px;
  }

  footer {
    color: var(--color-muted);
  }
}

@layer components {
  /* Cada sección es una hoja blanca sobre el fondo de la página. */
  section {
    margin-bottom: var(--space-4);
    padding: var(--space-3) var(--space-4);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
  }

  /* El resumen: cada par nombre-valor en su renglón. */
  dl div {
    padding: var(--space-2) 0;
    border-bottom: 1px solid var(--color-border);
  }

  dl div:last-child {
    border-bottom: 0;
  }

  dt {
    color: var(--color-muted);
  }

  dd {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }

  /* Los controles. */
  label {
    margin-right: var(--space-3);
  }

  input[type="search"] {
    min-height: 2.5rem;
    padding: var(--space-1) var(--space-2);
    border: 1px solid var(--color-control);
    border-radius: var(--radius);
  }

  fieldset {
    margin: var(--space-3) 0;
    padding: var(--space-2) var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
  }

  button {
    min-height: 2.5rem;
    padding: var(--space-1) var(--space-3);
    border: 0;
    border-radius: var(--radius);
    background: var(--color-accent);
    color: var(--color-surface);
    font-weight: 600;
    cursor: pointer;
  }

  button:hover {
    background: var(--color-text);
  }

  /* La tabla. */
  table {
    width: 100%;
    margin-top: var(--space-3);
    border-collapse: collapse;
  }

  caption {
    padding-bottom: var(--space-2);
    color: var(--color-muted);
    text-align: left;
  }

  th,
  td {
    padding: var(--space-2) var(--space-3);
    border-bottom: 1px solid var(--color-border);
    text-align: left;
  }

  /* Los números a la derecha y con cifras del mismo ancho para que alineen. */
  th:last-child,
  td:last-child {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }

  /* La insignia de estado: una sola regla, y las variantes solo cambian variables. */
  .status {
    display: inline-block;
    padding: 0 var(--space-2);
    border-radius: 999px;
    background: var(--badge-bg);
    color: var(--badge-text);
    font-size: 0.875rem;
    font-weight: 600;
  }

  .status-available {
    --badge-bg: var(--color-available-bg);
    --badge-text: var(--color-available-text);
  }

  .status-down {
    --badge-bg: var(--color-down-bg);
    --badge-text: var(--color-down-text);
  }

  /* ---- Lección 4: Flexbox y Grid ---- */

  /* Flexbox, una dimensión: el encabezado se reparte en una fila y baja
     de renglón cuando no cabe. */
  .page-header {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--space-1) var(--space-3);
  }

  .page-header p {
    margin: 0;
  }

  /* La barra de controles: tres hermanos en una línea; solo el campo crece. */
  .controls {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: var(--space-3);
  }

  .controls p,
  .controls fieldset {
    margin: 0;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    flex: 1 1 14rem;
  }

  .field input {
    width: 100%;
  }

  /* Grid, dos dimensiones: las cuatro cifras del resumen en cuatro columnas
     iguales. En un teléfono no caben; la Lección 5 lo resuelve. */
  .summary {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0 var(--space-3);
    margin: 0;
  }
}
```

O bloco novo tem três partes, e você já conhece cada uma. O cabeçalho (`.page-header`) é um contêiner flex que distribui os seus três filhos com `space-between`, os alinha pela linha de base do texto e lhes permite descer de linha; o seu parágrafo perde a margem para que a data não fique mais baixa que o título. A barra de controles (`.controls`, `.field`) é a de 4.1.5, com os números trocados pelas variáveis de espaço da Lição 3 (`var(--space-3)` é o mesmo `1rem`). E o resumo (`.summary`) é a grade de quatro colunas de 4.2.3. O que *não* mudou importa tanto quanto o que mudou: as camadas, as variáveis, o foco e os selos são os da Lição 3. A organização se soma ao que havia; não o reescreve.

Meça. A 1440 px, com a ferramenta de inspeção, o título do cabeçalho vai de 256 a 553 px, a data de 617 a 938 e a navegação de 1002 a 1184, colada na borda direita do conteúdo: uma única fila. As quatro cifras do resumo ficam em uma fila de quatro colunas de 207.5 px (medem menos que os 220 da página de teste porque agora vivem dentro de uma seção, com o seu preenchimento e a sua borda). E a barra de controles é uma única fila, com o campo de 281 a 647.5 px, os rádios de 663.5 a 1008 e o botão de 1024 a 1159. O que na página de partida eram dez linhas empilhadas são agora três faixas: o cabeçalho, o resumo e a barra, com a tabela logo abaixo. A tabela, que é o que se vem ver, sobe mais de 400 pixels: em `fig04_01.html` começava a 859 px do topo da página, e em `fig04_06.html` começa a 419.

A 768 px tudo continua sem transbordar, e o cabeçalho e a barra já se distribuem em mais de uma linha por conta própria, graças ao `flex-wrap`. A 375 e 320 px, em contrapartida, a página mede **414 px**: a tabela continua mais larga que a janela, como desde a Lição 3, e agora a acompanha o resumo, cujas quatro colunas fixas chegam até os 369 px. Esse é o ponto exato onde começa a Lição 5.

#### 4.2.5 Leve-o ao seu `revisor`

Até aqui você trabalhou com as páginas do repositório. Falta o passo que converte o aprendido no seu projeto: que o **seu** `revisor` fique igual a `fig04_06.html`, medido e guardado no Git. São quatro passos, e nenhum pede que você escreva algo novo.

**1. A folha.** Abra o seu `~/revisor/css/styles.css` e cole no final da camada `components`, logo antes da última chave de fechamento `}`, o bloco que começa com o comentário `/* ---- Lección 4: Flexbox y Grid ---- */` (você o tem completo acima, ou em `fig04_06/styles.css` do repositório). Não apague nada do que havia: o bloco só acrescenta. Se preferir, você pode substituir a folha inteira por `fig04_06/styles.css`, que é a da Lição 3 com esse bloco; mas se na Lição 3 você fez mudanças próprias na sua folha (outra cor, outro tamanho), substituí-la as apagaria, e nesse caso convém colar só o bloco.

**2. A página.** No seu `~/revisor/index.html` faça as três mudanças do HTML:

- `<header>` passa a ser `<header class="page-header">`.
- `<dl>` passa a ser `<dl class="summary">`.
- O campo de busca, o `<fieldset>` e o parágrafo do botão ficam dentro de um `<div class="controls">`, e o parágrafo do campo leva `class="field"`, tal como em 4.1.5. Cuide de onde você fecha o `div`: depois do parágrafo do botão e antes da tabela.

Você também pode copiar `fig04_06.html` completa sobre o seu `index.html`, com uma precaução: no repositório, o seu `<link>` aponta para `fig04_06/styles.css`; no seu projeto deve dizer `href="css/styles.css"`, como desde a Lição 3. Se você não o mudar, a página aparecerá sem estilos.

**3. Meça.** A partir da pasta do projeto, ligue o servidor:

```bash
$ cd ~/revisor
$ python3 -m http.server 8000 --bind 127.0.0.1
```

Abra `http://127.0.0.1:8000/`, ative o modo responsivo com a janela a 1440 px e compare o seu painel com `fig04_06.html` na mesma largura: o cabeçalho em uma fila, as quatro cifras em uma fila e a barra de controles em uma fila. Passe o cursor sobre `.summary` na aba de elementos: deve ter o selo `grid`, e `.controls` e `.page-header` o selo `flex`. Se algum não o tiver, é uma classe que não foi escrita ou um `div` que foi fechado em outro lugar. Não se preocupe se a 320 px o seu painel ainda transborda: o da lição também, e pela mesma razão.

**4. Guarde no Git.** Pare o servidor com `Ctrl`+`C` (ou abra outro terminal) e pergunte ao Git o que mudou, como na Lição 1:

```bash
$ git status
En la rama main
Cambios no rastreados para el commit:
  (usa "git add <archivo>..." para actualizar lo que será confirmado)
  (usa "git restore <archivo>..." para descartar los cambios en el directorio de trabajo)
	modificados:     css/styles.css
	modificados:     index.html

sin cambios agregados al commit (usa "git add" y/o "git commit -a")
```

São justamente os dois arquivos que você tocou. (Se aparecer algum a mais, é uma mudança sua de antes que você não guardou: revise-a com `git diff` antes de decidir se vai neste commit.) Confira com `git diff` que as mudanças sejam as que você queria, e guarde-as:

```bash
$ git add index.html css/styles.css
$ git commit -m "Acomoda el panel con Flexbox y Grid"
$ git status
En la rama main
nada para hacer commit, el árbol de trabajo está limpio
```

O `git commit` imprime uma linha com o código do commit e quantas linhas mudaram; os números dependem dos seus arquivos. Com isso, o seu `revisor` fica pronto para a Lição 5, que parte exatamente daqui.

A folha de partida, `fig04_01/styles.css`, é a da Lição 3 tal qual; você a tem completa a seguir, caso queira comparar ou não tenha a da lição anterior:

```css
/* fig04_01/styles.css */
/* La hoja del panel tal como la deja la Lección 3, sin un solo cambio: todavía
   no acomoda nada, y cada cosa va debajo de la anterior. */

/* El orden de las capas se declara una sola vez, arriba. La última gana. */
@layer reset, base, components;

@layer reset {
  /* La caja: el ancho que escribes es el ancho que se ve. */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  /* El navegador no hace que los campos hereden la letra del texto. */
  input,
  button {
    font: inherit;
  }
}

@layer base {
  /* Las decisiones del panel viven aquí, con nombres que dicen para qué sirven. */
  :root {
    --color-text: #1b1f24;
    --color-muted: #57606a;
    --color-page: #f6f8fa;
    --color-surface: #ffffff;
    --color-border: #d0d7de;
    --color-control: #6e7781;
    --color-accent: #0b5cad;

    --color-available-text: #0f5132;
    --color-available-bg: #d1e7dd;
    --color-down-text: #842029;
    --color-down-bg: #f8d7da;

    --space-1: 0.25rem;
    --space-2: 0.5rem;
    --space-3: 1rem;
    --space-4: 1.5rem;
    --space-5: 2.5rem;

    --font-body: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    --line-height: 1.6;
    --radius: 0.375rem;
  }

  body {
    margin: 0;
    background: var(--color-page);
    color: var(--color-text);
    font-family: var(--font-body);
    line-height: var(--line-height);
  }

  /* Un ancho cómodo para leer, centrado: auto reparte el espacio sobrante. */
  header,
  main,
  footer {
    max-width: 60rem;
    margin: 0 auto;
    padding: var(--space-3);
  }

  h1 {
    margin: 0 0 var(--space-2);
    font-size: 2rem;
    line-height: 1.2;
  }

  h2 {
    margin: 0 0 var(--space-3);
    font-size: 1.375rem;
    line-height: 1.3;
  }

  a {
    color: var(--color-accent);
  }

  /* Que el foco del teclado se vea siempre: nunca outline: none sin reemplazo. */
  :focus-visible {
    outline: 3px solid var(--color-accent);
    outline-offset: 2px;
  }

  footer {
    color: var(--color-muted);
  }
}

@layer components {
  /* Cada sección es una hoja blanca sobre el fondo de la página. */
  section {
    margin-bottom: var(--space-4);
    padding: var(--space-3) var(--space-4);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
  }

  /* El resumen: cada par nombre-valor en su renglón. */
  dl div {
    padding: var(--space-2) 0;
    border-bottom: 1px solid var(--color-border);
  }

  dl div:last-child {
    border-bottom: 0;
  }

  dt {
    color: var(--color-muted);
  }

  dd {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }

  /* Los controles. */
  label {
    margin-right: var(--space-3);
  }

  input[type="search"] {
    min-height: 2.5rem;
    padding: var(--space-1) var(--space-2);
    border: 1px solid var(--color-control);
    border-radius: var(--radius);
  }

  fieldset {
    margin: var(--space-3) 0;
    padding: var(--space-2) var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
  }

  button {
    min-height: 2.5rem;
    padding: var(--space-1) var(--space-3);
    border: 0;
    border-radius: var(--radius);
    background: var(--color-accent);
    color: var(--color-surface);
    font-weight: 600;
    cursor: pointer;
  }

  button:hover {
    background: var(--color-text);
  }

  /* La tabla. */
  table {
    width: 100%;
    margin-top: var(--space-3);
    border-collapse: collapse;
  }

  caption {
    padding-bottom: var(--space-2);
    color: var(--color-muted);
    text-align: left;
  }

  th,
  td {
    padding: var(--space-2) var(--space-3);
    border-bottom: 1px solid var(--color-border);
    text-align: left;
  }

  /* Los números a la derecha y con cifras del mismo ancho para que alineen. */
  th:last-child,
  td:last-child {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }

  /* La insignia de estado: una sola regla, y las variantes solo cambian variables. */
  .status {
    display: inline-block;
    padding: 0 var(--space-2);
    border-radius: 999px;
    background: var(--badge-bg);
    color: var(--badge-text);
    font-size: 0.875rem;
    font-weight: 600;
  }

  .status-available {
    --badge-bg: var(--color-available-bg);
    --badge-text: var(--color-available-text);
  }

  .status-down {
    --badge-bg: var(--color-down-bg);
    --badge-text: var(--color-down-text);
  }
}
```

e a página de partida, `fig04_01.html`, é o painel da Lição 2 com um `<link>` para essa folha:

```html
<!-- fig04_01.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Revisor de servicios</title>
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="fig04_01/styles.css">
</head>
<body>
  <header>
    <h1>Revisor de servicios</h1>
    <p>Última revisión:
      <time datetime="2026-10-07T10:30:00-06:00">7 de octubre de 2026, 10:30</time>
    </p>
    <nav>
      <p>Ir a: <a href="#summary">Resumen</a> o <a href="#services">Servicios</a></p>
    </nav>
  </header>

  <main>
    <section id="summary">
      <h2>Resumen</h2>
      <dl>
        <div>
          <dt>Servicios revisados</dt>
          <dd>5</dd>
        </div>
        <div>
          <dt>Disponibles</dt>
          <dd>4 de 5</dd>
        </div>
        <div>
          <dt>Caídos</dt>
          <dd>1</dd>
        </div>
        <div>
          <dt>Respuesta promedio</dt>
          <dd>465 ms</dd>
        </div>
      </dl>
    </section>

    <section id="services">
      <h2>Servicios</h2>

      <p>
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

      <table>
        <caption>Estado de los servicios en la última revisión</caption>
        <thead>
          <tr>
            <th scope="col">Servicio</th>
            <th scope="col">Estado</th>
            <th scope="col">Tiempo de respuesta</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Catálogo</th>
            <td><span class="status status-available">Disponible</span></td>
            <td>120 ms</td>
          </tr>
          <tr>
            <th scope="row">Pagos</th>
            <td><span class="status status-available">Disponible</span></td>
            <td>480 ms</td>
          </tr>
          <tr>
            <th scope="row">Inventario</th>
            <td><span class="status status-down">Caído</span></td>
            <td>sin respuesta</td>
          </tr>
          <tr>
            <th scope="row">Notificaciones</th>
            <td><span class="status status-available">Disponible</span></td>
            <td>310 ms</td>
          </tr>
          <tr>
            <th scope="row">Búsqueda</th>
            <td><span class="status status-available">Disponible</span></td>
            <td>950 ms</td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>

  <footer>
    <p>Datos de ejemplo escritos a mano.</p>
  </footer>
</body>
</html>
```

## O erro que você vai ver

Os erros de organização quase nunca são mensagens: são uma página que parece “errada” sem dizer por quê. Os dois que você mais vai encontrar com o Flexbox se aprendem melhor provocando-os de propósito. O primeiro não deixa nenhum rastro no console, só uma pista discreta nas ferramentas do navegador; o segundo se vê assim que a janela se estreita.

**Um erro de organização que não avisa: a propriedade que não faz nada.** Abra `fig04_07.html`. É uma barra de três botões com `justify-content: space-between`, e os botões ficam colados à esquerda, um atrás do outro, sem se distribuir:

```html
<!-- fig04_07.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Una propiedad de Flexbox sin contenedor</title>
  <link rel="stylesheet" href="fig04_01/styles.css">
  <style>
    .controls {
      justify-content: space-between;
      gap: 0.75rem;
    }
  </style>
</head>
<body>
  <main>
    <h1>Los botones no se reparten</h1>
    <div class="controls">
      <button type="button">Todos</button>
      <button type="button">Disponibles</button>
      <button type="button">Caídos</button>
    </div>
  </main>
</body>
</html>
```

Não há nada no console. O navegador não considera isso um erro: simplesmente ignora a propriedade, porque `justify-content` não tem efeito num bloco normal ([só age em contêineres flex, grid ou de várias colunas](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/justify-content)), e `.controls` é um bloco normal (falta `display: flex`). O que há é uma pista nas ferramentas do navegador: abra a aba de elementos, selecione `.controls` e olhe o seu painel de estilos; a declaração `justify-content: space-between` aparece atenuada, com um ícone de aviso ao lado que, ao passar o cursor, explica que a propriedade não tem efeito porque o elemento não é um contêiner flex nem um grid. (O texto exato muda conforme o navegador e o seu idioma; o ícone e a declaração atenuada são o sinal.) A correção é uma linha: `display: flex`. **Quando uma propriedade de organização “não faz nada”, a primeira coisa que se confere é se o seu pai é um contêiner.**

**O elemento que não encolhe.** O segundo caso é o de 4.1.3, e vale a pena reconhecê-lo de longe porque se disfarça: você abre `fig04_03.html` a 320 px e aparece uma barra de rolagem horizontal, embora o texto longo tenha tudo o que precisa para se cortar com reticências. O sinal é que o elemento que passa da borda é o **contêiner** do texto, não o texto: ao passar o cursor na aba de elementos, a caixa `.service-name` da primeira linha mede 417 px numa janela de 320. Um elemento flex não encolhe abaixo do seu conteúdo mínimo, e uma URL sem espaços é um conteúdo mínimo enorme. A correção são as duas partes que você já conhece: `min-width: 0` no elemento flex, e uma maneira de caber para o seu conteúdo. Se você puser só a segunda, o texto “sabe” se cortar, mas a sua caixa nunca pede isso a ele.

## O que se faz errado

**Separar os irmãos com margens em cada filho.** `margin-right: 1rem` em cada botão de uma barra. O último fica com uma margem que sobra, e quando a barra desce de linha as margens já não coincidem com os vãos. Custo: ajustes com `:last-child` e números mágicos que ninguém entende um mês depois. Correção: o espaço entre irmãos quem põe é o pai com `gap`.

**Pôr a propriedade de organização no filho e não no pai.** `justify-content` ou `grid-template-columns` em cada cartão, em vez de no contêiner que os distribui. Não fazem nada, e não há erro que o diga: é o caso de `fig04_07.html` com outro disfarce. Antes de escrever uma propriedade de organização, pergunte-se quem distribui; ali é que ela vai.

**Usar `order` para reorganizar o que se lê.** Reordenar com CSS algo que o teclado percorre em outra ordem. Custo: o Tab salta de um lado a outro e um leitor de tela lê numa ordem que não coincide com o que se vê. Resolve-se escrevendo o HTML na ordem em que deve ser lido.

**Larguras fixas em pixels para tudo.** `width: 640px` numa coluna, `input { width: 20rem }` num campo. Ficam bem na tela de quem os escreve e atrapalham em qualquer outra. O painel se salvou disso porque a folha da Lição 3 não deu largura fixa a nada, e a barra de controles desta lição tampouco: deu ao campo uma **base** (`14rem`) que pode crescer e encolher, que não é o mesmo que uma largura. A alternativa a um número escrito: `width: 100%`, `max-width`, ou deixar a largura para o `flex` e o `grid`.

## Exercícios

### Exercício 1 — O cabeçalho em uma fila

O `<header>` do painel tem três filhos: o título `<h1>`, o parágrafo de “Última revisión” e o `<nav>` com os dois links. Em `fig04_01.html` vão um embaixo do outro. Use o Flexbox, sem tocar no HTML, em dois passos:

1. Faça deles uma fila, com o título colado à esquerda, o `<nav>` colado na borda direita e a data distribuída entre os dois, de modo que num celular estreito desçam de linha em vez de se apertar.
2. Agora mude de ideia: o título à esquerda e **os outros dois juntos** na borda direita, um ao lado do outro.

Meça os dois passos a 1440 e a 320 px com as ferramentas, olhando onde começa e onde termina cada filho, e confira que a 320 px o cabeçalho não sai da janela.

### Exercício 2 — Duas colunas, duas linhas

Copie `fig04_05.html` e troque `repeat(4, 1fr)` por `repeat(2, 1fr)`. Antes de recarregar, **preveja**: quantas linhas haverá, quem as declarou e quanto medirá cada cartão a 1440 px? Depois meça a 1440, 768 e 320 px. A página transborda a 320 px como transbordava a de quatro colunas? Explique por que sim ou por que não.

### Exercício 3 — Quem fica com o que sobra

Em `fig04_04.html`, a 1440 px, o campo de busca mede muito mais que a sua base de 14 rem. Troque o seu `flex: 1 1 14rem` por `flex: 0 1 14rem` (só o primeiro número). Preveja o que acontece com o campo, com o botão e com o espaço que sobra; depois meça a largura do campo e a posição do botão, e explique a diferença com o que diz cada um dos três números de `flex`.

## Soluções

### Solução 1

**Passo 1.** O cabeçalho precisa de três coisas: ser contêiner flex, descer de linha e distribuir os filhos. Com `justify-content: space-between` o primeiro filho fica à esquerda, o último à direita e o do centro, entre os dois. É o mesmo que faz a regra `.page-header` da folha do painel, que em vez do nome do elemento usa uma classe e em vez dos números, as variáveis de espaço:

```css
header {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.25rem 1rem;
}
```

Com `flex-wrap: wrap`, quando os três não cabem em uma linha, o último desce sozinho, sem media query. Os dois valores de `gap` separam as linhas (0.25 rem) menos que as colunas (1 rem). O alinhamento `baseline` põe o título e os textos pequenos sobre a mesma linha de texto, o que fica melhor do que alinhar pela borda inferior das caixas. Medi em `fig04_06.html`: a 1440 px o título vai de 256 a 553 px, a data de 617 a 938 e o `<nav>` de 1002 a 1184, colado na borda direita do conteúdo; a 320 px os três descem, um por linha, e o cabeçalho mede justamente os 320 px da janela.

**Passo 2.** `space-between` não serve para juntar os dois da direita: distribui o que sobra em *todos* os vãos, e por isso a data fica no meio. O que é preciso é que o que sobra vá para um único vão, o que fica depois do título. Isso quem faz é uma **margem automática**: num contêiner flex, [uma margem `auto` fica com todo o espaço que sobra](https://developer.mozilla.org/pt-BR/docs/Web/CSS/CSS_flexible_box_layout/Aligning_items_in_a_flex_container) do seu lado, e empurra os que vêm depois até o final. Mudam-se duas linhas:

```css
header {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: flex-start;
  gap: 0.25rem 1rem;
}

header h1 {
  margin-right: auto;
}
```

`justify-content` volta ao seu valor de partida, que não distribui nada, e o `margin-right: auto` do título absorve todo o espaço livre da linha. Medido igual, a 1440 px: o título continua de 256 a 553, a data passa a ir de 665 a 986 e o `<nav>` de 1002 a 1184; entre os dois ficam justamente os 16 px do `gap`. A 320 px o resultado é o mesmo do passo 1 (um por linha). A outra saída, agrupar a data e o `<nav>` em um `div` próprio, também funciona, mas muda o HTML para resolver algo que é só de organização.

O painel da lição fica com o passo 1: a data no meio separa visualmente o título da navegação. As duas são corretas; o que importa é saber qual você pediu e com que ferramenta se consegue cada uma.

### Solução 2

Há **duas linhas** de dois cartões cada uma, e ninguém as declarou: `grid-template-columns` só fala de colunas, e quando os quatro elementos não cabem nas duas colunas declaradas, o navegador cria a segunda linha por conta própria. É a grade implícita de 4.2.2. Medi: a 1440 px cada cartão mede **456 px** (928 menos um vão de 16, dividido por dois); a 768 px, 360; e a 320 px, 136, sem transbordar: a página mede 320.

Por que esta não transborda e a de quatro colunas sim? Porque o mínimo escondido do `1fr` continua ali, mas agora só precisa caber a metade das palavras longas em cada linha: duas colunas com o seu piso, mais um vão, cabem nos 288 px que a página deixa. Repare no que isso ensina: o número de colunas que convém **depende da largura**, e escrevê-lo à mão obriga a escolher um só para todas as larguras. Que a grade o conte sozinha é justamente o que você aprenderá na Lição 5.

### Solução 3

Com `flex: 0 1 14rem` o campo **deixa de crescer**: mede a sua base, 224 px, em vez dos 416.5 que media. O grupo de rádios e o botão não mudam de tamanho (nenhum crescia), então se deslocam para a esquerda: o botão, que terminava em 1184 px, colado na borda direita do conteúdo, agora termina em 991.5. Os 192.5 px que sobram ficam vazios no final da linha.

Os três números explicam. O primeiro, *crescer*, diz quanto do que sobra o elemento recebe; com `1`, o campo era o único que pedia o que sobrava e levava tudo, e com `0` ninguém o pede e ele fica onde cai (no final, porque `justify-content` vale `flex-start`). O segundo, *encolher*, continua em `1`: se a barra se estreita, o campo ainda cede. O terceiro, a *base*, não mudou: 14 rem. Por isso na barra do painel o campo leva `1` no início: é a peça que convém que aproveite o espaço, porque um campo de busca mais largo deixa ver mais do que se escreve.

## Como sei que consegui

- [ ] Você consegue dizer, antes de recarregar, o que fazem `justify-content: space-between` e `align-items: center` em uma fila, e o que muda com `flex-direction: column`; `fig04_02.html` dá razão a você.
- [ ] `fig04_04.html` a 1440 px é uma única fila com o campo ocupando o que sobra, e a 320 px são três linhas, sem transbordar.
- [ ] Você consegue explicar por que a primeira linha de `fig04_03.html` transborda a 320 px e a segunda não.
- [ ] Em `fig04_06.html` a 1440 px o cabeçalho, o resumo e a barra são três faixas de uma fila cada uma, e a ferramenta de inspeção mostra o selo `grid` em `.summary` e `flex` em `.page-header` e `.controls`.
- [ ] Com Tab, o foco passa na mesma ordem da Lição 3: link “Resumen”, link “Servicios”, campo de busca, grupo de rádios e botão “Revisar ahora”. A organização não mudou a ordem de leitura.
- [ ] Você consegue dizer com uma pergunta quando usar Flexbox e quando Grid, e dar um exemplo do painel para cada um.
- [ ] O seu `~/revisor` (servido a partir da sua pasta em `http://127.0.0.1:8000/`) fica igual a `fig04_06.html` a 1440 px, e `git log --oneline` mostra o commit com a organização.

## Resumo

Para fixar o que você acabou de ver, responda sem olhar a lição:

1. Que eixo controla `justify-content` e qual controla `align-items`? O que muda quando você põe `flex-direction: column`?
2. Por que `gap` é melhor que uma margem em cada filho?
3. O que significa `flex: 1 1 14rem` em um elemento, dito com as suas palavras?
4. Por que um elemento flex com uma URL longa dentro pode fazer a página transbordar, e que duas coisas o resolvem?
5. Qual é a pergunta que decide entre Flexbox e Grid?
6. Com seis elementos e `repeat(3, 1fr)`, quantas linhas há e quem as declarou?
7. Por que não se reorganiza com `order` o que o teclado percorre?

Se alguma resposta emperrar, volte ao trecho correspondente: é sinal de que ali ficou uma peça frouxa, não de que você não serve para isto.

## Para ler mais

- [MDN, “Conceitos básicos de flexbox”](https://developer.mozilla.org/pt-BR/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox) — a explicação dos eixos, `flex-wrap` e os três valores de `flex`, na qual esta lição se apoia. Consultado em 7 de outubro de 2026.
- [MDN, “Conceitos básicos de layout de grade”](https://developer.mozilla.org/pt-BR/docs/Web/CSS/CSS_grid_layout/Basic_concepts_of_grid_layout) — grade explícita e implícita, `fr`, `repeat()` e `minmax()`. Consultado em 7 de outubro de 2026.
- [MDN, “Alinhando itens em um contêiner flex”](https://developer.mozilla.org/pt-BR/docs/Web/CSS/CSS_flexible_box_layout/Aligning_items_in_a_flex_container) — `justify-content`, `align-items` e as margens automáticas do Exercício 1, com desenhos de cada valor. Consultado em 7 de outubro de 2026.
