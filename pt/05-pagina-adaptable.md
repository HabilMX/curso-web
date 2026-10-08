# Lição 5 — Uma página que funciona em qualquer tela

**Tempo:** duas sessões de cerca de 90 min. Uma divisão que funciona: na primeira, “O porquê antes do como” (o 320, a tag `viewport` e como medir) e as colunas que se contam sozinhas (5.1); na segunda, a tabela que rola, `@media`, `@container`, o painel terminado, levá-lo ao seu `revisor` (5.2.7) e os exercícios. Cada sessão termina em uma página que você pode abrir e medir.

**O que você constrói:** o painel que funciona em um celular

**O que você aprende:** o que faz a tag `viewport`; adaptável com `minmax()` e `auto-fit` antes de `@media`; a tabela que rola dentro da sua caixa; `@media` para a página e `@container` para a caixa; de 320 a 1440 px sem transbordamento

**De onde você vem.** Você traz o painel da [Lição 4](04-flexbox-grid.md), organizado com Flexbox e Grid: o cabeçalho em uma fila, as quatro cifras do resumo em quatro colunas e a barra de controles em uma linha. Numa tela larga fica bom; num celular, ainda não. Todas as páginas desta lição estão em [`programas/05-pagina-adaptable/`](https://github.com/HabilMX/curso-web/tree/main/programas/05-pagina-adaptable) do [repositório do curso](https://github.com/HabilMX/curso-web), e o ponto de partida é `fig05_01.html`, que é o painel com que terminou a Lição 4 tal qual. A sua folha, `fig05_01/styles.css`, é uma **cópia** de `fig04_06/styles.css`, a folha da lição anterior: está repetida de propósito, para que esta pasta funcione sozinha, sem depender da pasta de outra lição. As páginas de teste desta lição a carregam com `<link rel="stylesheet" href="fig05_01/styles.css">`, um caminho *relativo* que o navegador procura na pasta `fig05_01` junto da página; se você copiar só um `.html`, sem essa pasta, a página aparecerá sem estilos e a aba Rede mostrará o `404` da folha. O painel terminado, `fig05_06.html`, usa a sua própria folha, `fig05_06/styles.css`. Se o seu `revisor` não ficou igual ao terminar a Lição 4, não importa: você tem completos `fig05_01.html` e a sua folha no final de 5.2.6. Você trabalha de novo com `index.html` e `css/styles.css` da sua pasta `revisor`, e o servidor local continua sendo `python3 -m http.server 8000 --bind 127.0.0.1`.

**O que esta lição não faz.** Não toca em JavaScript, salvo uma linha que você vai colar no console para medir. As cifras do resumo continuam escritas à mão; um programa as contará na Lição 6 e a Lição 7 as desenhará na tabela. Hoje, como na lição anterior, só muda *onde* vai cada coisa e *quanto mede*.

## Ao terminar, você vai conseguir

- Explicar o que a tag `viewport` diz a um celular e o que acontece sem ela: a página é desenhada em uma janela virtual mais larga que a tela (980 px no Chrome) e é encolhida.
- Conferir com uma medição, não a olho, que uma página não transborda entre 320 e 1440 px, e encontrar o culpado quando transborda.
- Declarar colunas que se contam sozinhas com `repeat(auto-fit, minmax(min(100%, 11rem), 1fr))` e explicar o que faz cada peça dessa linha.
- Explicar por que `1fr` não basta numa coluna que conterá algo largo, e escrever `minmax(0, 1fr)` no lugar.
- Deixar que uma tabela larga role dentro da sua própria caixa sem perder a sua semântica e sem deixar de fora quem usa o teclado.
- Decidir quando é preciso uma media query (`@media`), quando uma de contêiner (`@container`) e quando nenhuma.
- Levar o painel adaptável ao seu `revisor`, medi-lo em cinco larguras e guardá-lo no Git.

## O porquê antes do como

São duas da madrugada e o celular de quem está de plantão toca. A pessoa abre o painel para ver qual serviço caiu. Não tem um computador à mão: tem uma tela de mão e um polegar. O que ela precisa saber cabe em uma frase (“Inventario não responde”), mas a página, tal como a lição anterior a deixou, faz com que ela trabalhe a mais.

Meça em vez de supor. Abra `fig05_01.html` no seu servidor local, abra as ferramentas do navegador com `F12` e ative o modo responsivo (no Chrome e no Edge é o ícone de celular e tablet; no Firefox é `Ctrl`+`Shift`+`M`). Ponha a largura em 320 pixels. Você verá uma barra de rolagem horizontal: a página é mais larga que a tela, e quem a usa tem de arrastar para os lados para ver uma tabela de três colunas. Medi com o Chrome 154, de forma automatizada e sem janela, e deu isto: a 320 px a página mede **414 px de largura**, a mesma cifra com que fecharam a Lição 3 e a Lição 4; a 375 px também mede 414; a 768 px, 1024 px e 1440 px mede justamente o que a janela, sem sobrar nada. Dois elementos passam da borda. O primeiro é a tabela, que com as suas três colunas e o preenchimento de cada célula chega até os 414 px. O segundo é novo, e foi trazido pela lição anterior: o resumo, cujas quatro colunas fixas não cabem num celular e chegam até os 369 px. O resto —o cabeçalho, o campo de busca, os rádios, o botão— já cabe, porque descem de linha com `flex-wrap` e porque nenhuma folha pôs a eles uma largura fixa. É uma virtude que convém não perder.

E no extremo contrário fica uma dívida menor: numa tela de 1440 px o conteúdo continua sendo uma coluna de 60 rem (960 px) no centro, com duas faixas vazias dos lados, e a tabela fica embaixo do resumo, quando as duas caberiam lado a lado.

As duas coisas têm a mesma causa. **O painel organiza, mas não se adapta.** As quatro colunas do resumo são quatro em qualquer largura, porque assim foram escritas; a tabela mede o que mede o seu conteúdo, porque ninguém lhe disse outra coisa; e a página é uma única coluna embora sobre espaço. Esta lição é a que ensina o painel a decidir conforme o espaço que tem.

### O que significa “320 pixels” e por que é o número

Um **pixel CSS** não é um ponto físico da tela. É uma unidade que o navegador mantém constante de propósito, para que uma caixa de 100 px de largura apareça com aproximadamente o mesmo tamanho numa tela de alta densidade e numa comum. Um celular com uma tela de 1,080 pontos físicos de largura costuma declarar a si mesmo como uma janela de uns 360 a 430 pixels CSS (a cifra exata varia por modelo); cada pixel CSS é pintado com vários pontos físicos. Quando uma folha de estilo diz `width: 320px`, fala nesta unidade.

O 320 sai de uma regra pública: [o critério de sucesso 1.4.10 (“Refluxo”, *Reflow*)](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) das Diretrizes de Acessibilidade para Conteúdo Web 2.2, que pede que o conteúdo possa ser apresentado “sem perda de informação ou funcionalidade, e sem necessidade de rolar em duas dimensões” numa janela equivalente a 320 pixels CSS de largura. A razão é a ampliação: essa largura equivale a abrir a página numa tela de 1,280 px e aproximá-la a 400 %. [Uma pessoa com baixa visão que amplia o texto](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html) até que se leia com conforto está, sem saber, convertendo o seu monitor numa tela de 320 px. Se a página transborda ali, essa pessoa tem de arrastar a página de um lado a outro para ler cada linha. O 320 não é uma mania de celulares antigos: é o piso de todos.

A mesma norma traz uma exceção que convém conhecer desde já, porque você a usará com critério: as partes do conteúdo que **requerem um layout em duas dimensões para o seu uso ou significado** —mapas, vídeo, e também tabelas de dados— podem rolar. Mas a exceção cobre só essa parte: o título da tabela e o que a rodeia sim têm de se reorganizar. Mais abaixo, no conceito 5.2, a tabela de serviços rolará *dentro da sua caixa* e todo o resto se organizará sozinho.


### A tag que você já escreveu sem saber o que fazia

Na Lição 2 você pôs no `<head>` a linha `<meta name="viewport" content="width=device-width, initial-scale=1">` porque “é assim que se faz”. Agora se entende. Os celulares dos primeiros anos da web móvel toparam com páginas feitas para computadores de mesa e, para não mostrá-las quebradas, inventaram um truque: **desenham a página em uma janela virtual mais larga que a tela —tipicamente de 980 pixels— e depois encolhem o resultado** para que caiba. Esse comportamento continua sendo o padrão para uma página que não declara nada. [O MDN o documenta](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Viewport_meta_element) e usa 980 px como exemplo, mas nenhuma norma fixa essa cifra: cada navegador escolhe a sua. O Chrome usa 980, como você vai medir logo em seguida; outro navegador ou outro celular pode dar a você um número diferente, e o que não muda é o efeito: uma janela mais larga que a tela, e tudo diminuto.

A tag `viewport` pede ao navegador que use a largura real do dispositivo. A prova está em `fig05_02.html`, uma página que de propósito não a leva. Medi-a com o Chrome 154 em um celular emulado de 390 px de largura: sem a tag, `window.innerWidth` vale **980**; com ela (como em `fig05_03.html`, que você verá em 5.1.2) vale **390**. Tudo o que você aprender nesta lição depende disso: uma regra como “a partir de 64 em de largura” não significa nada se o navegador acha que a janela mede 980 px quando mede 390.


Esta é a página do teste, completa:

```html
<!-- fig05_02.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Página sin la etiqueta de ventana</title>
  <link rel="stylesheet" href="fig05_01/styles.css">
</head>
<body>
  <h1>Revisor de servicios</h1>
  <p>Esta página se ve bien en una computadora y diminuta en un teléfono.</p>
</body>
</html>
```

Um aviso que o MDN repete e que a norma de acessibilidade respalda: **não tire do leitor a possibilidade de aproximar a página**. Há tutoriais que acrescentam `user-scalable=no` ou `maximum-scale=1` para evitar que o celular dê zoom ao tocar num campo. Quem tem baixa visão usa esse zoom para ler. Essa linha é a que fica sozinha, tal como está.

### Como você vai conferir

Há duas formas de verificar que uma página não transborda, e você vai usar as duas durante toda a lição.

A primeira é olhar: o modo responsivo das ferramentas do navegador, com uma largura de 320 px. Se aparecer uma barra de rolagem horizontal na página (não dentro de uma caixa concreta), transborda.

A segunda é medir, porque o olho erra por poucos pixels. Abra a aba do console das ferramentas, cole esta linha e pressione `Enter`:

```js
document.documentElement.scrollWidth > document.documentElement.clientWidth
```

É JavaScript, que você ainda não estuda: você o entenderá por completo na Lição 6, e por ora só é preciso saber o que ele pergunta. `clientWidth` é a largura visível da página e `scrollWidth` é a largura que o seu conteúdo realmente ocupa. Se a segunda supera a primeira, o conteúdo é mais largo que a janela e devolve-se `true`. **Se devolve `false`, não há transbordamento.** Em `fig05_01.html` com a janela a 320 px, essa linha devolve `true`; no final da lição, com o seu painel terminado, devolverá `false` em todas as larguras.

## Os conceitos

Duas ideias, nesta ordem: as **colunas que se contam sozinhas**, que resolvem o resumo sem escrever um único número de largura de janela; e o **adaptável**, que não é uma ferramenta a mais mas uma maneira de usar Flexbox e Grid para que a página se organize sozinha, com as media queries e as consultas de contêiner só para o que de fato precisa delas. Cada uma é explicada primeiro com um exemplo mínimo e depois com o painel.

### 5.1 Colunas que se contam sozinhas

#### 5.1.1 A armadilha do `1fr`: o mínimo escondido

`repeat(4, 1fr)` tem um problema que se vê assim que a tela se estreita: são sempre quatro colunas, sejam quais forem as larguras. Você viu isso no final da seção 4.2.3 da Lição 4, com a página [`fig04_05.html`](https://github.com/HabilMX/curso-web/blob/main/programas/04-flexbox-grid/fig04_05.html) da lição anterior, que declara as quatro cifras do resumo em quatro colunas fixas: a 1024 px e a 1440 px fica bom, mas a 320 px as quatro cifras se apertam e a página **mede 344 px de largura** (a 375 px já cabem, por pouco).

Há uma razão sutil, que vale a pena entender porque é a armadilha mais comum do Grid: **`1fr` não é “uma fração” e ponto. É `minmax(auto, 1fr)`**. O mínimo da coluna é `auto`, que significa “o que meça o conteúdo mais estreito possível”, e uma coluna não encolhe abaixo disso. Aqui, a palavra mais longa de cada cifra fixa um piso para a sua coluna. Medi: os quatro pisos somam 280 px, e os três vãos de 16 px, outros 48; são 328 px, mais que os 288 que a página deixa a 320 px depois do seu preenchimento, então a grade transborda em vez de encolher.

A consequência prática é importante: **escrever mais colunas do que cabem não as encolhe; as faz transbordar**. E escrever menos (o Exercício 2 da Lição 4 tentou com duas) desperdiça espaço numa tela larga. Nenhum número fixo de colunas serve para todas as larguras. O que é preciso é dizer ao navegador *quanto mede no mínimo uma coluna* e deixar que ele conte quantas cabem.

#### 5.1.2 `minmax()`, `auto-fit` e `min()`

[`minmax(mínimo, máximo)` é a função](https://developer.mozilla.org/en-US/docs/Web/CSS/minmax) que permite a você fixar o piso e o teto de uma coluna. `minmax(11rem, 1fr)` diz: “esta coluna mede ao menos 11rem (176 px) e, se há espaço, cresce repartindo-o com as demais”. Com esse piso conhecido, o navegador já sabe quantas colunas cabem em uma largura dada. E aqui está a peça que une tudo:

```css
grid-template-columns: repeat(auto-fit, minmax(min(100%, 11rem), 1fr));
```

Lê-se de dentro para fora:

1. `minmax(11rem, 1fr)`: cada coluna mede de 176 px para cima.
2. `repeat(auto-fit, ...)`: **repete a coluna tantas vezes quantas couberem**. Não se diz a ele quantas; o navegador conta.
3. `min(100%, 11rem)`: o piso é o menor entre 11rem e os 100 % do contêiner. Sem esta peça, num contêiner mais estreito que 176 px (uma barra lateral estreita, um celular de 150 px de largura útil) a coluna não caberia e transbordaria; com ela, o piso nunca supera a largura disponível. [`min()` é uma função do CSS](https://www.w3.org/TR/css-values-4/) que devolve o menor dos seus argumentos, e [o MDN a marca como disponível em todos os navegadores desde julho de 2020](https://developer.mozilla.org/en-US/docs/Web/CSS/min); [a plataforma a considera de disponibilidade geral desde janeiro de 2023](https://web-platform-dx.github.io/web-features-explorer/features/min-max-clamp/), os 30 meses de rigor depois.

Há duas palavras que se parecem e não fazem o mesmo: `auto-fill` e `auto-fit`. As duas contam quantas colunas cabem. A diferença aparece quando há menos elementos do que colunas possíveis: `auto-fill` conserva as colunas vazias (o espaço fica reservado, embora não haja nada ali) e `auto-fit` as colapsa a zero, de modo que os elementos que existem se esticam e ocupam toda a linha. Medi deixando só duas cifras na página `fig05_03.html` de baixo, com a janela a 1440 px (a folha da Lição 3 limita o conteúdo a 60 rem, então o contêiner mede 928 px): com `auto-fill` cabem quatro colunas de 220 px e os dois cartões ficam nas duas primeiras, com meia fila vazia; com `auto-fit` os dois medem 456 px e preenchem a fila. Para o resumo do painel, `auto-fit`: queremos que as cifras que existirem ocupem a linha completa, não que deixem um buraco.

A página com a solução é `fig05_03.html`. É idêntica a `fig04_05.html` salvo por essa linha (e pelo caminho da sua folha, que é a cópia desta pasta):

```html
<!-- fig05_03.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Resumen que cuenta sus columnas</title>
  <link rel="stylesheet" href="fig05_01/styles.css">
  <style>
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 11rem), 1fr));
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

Medi cinco larguras: 320, 375, 768, 1024 e 1440 px. Em todas, a largura da página é igual à da janela; não transborda. A 320 px as quatro cifras formam uma coluna, cada uma de 288 px; a 1024 e a 1440 ocupam uma única fila, de quatro colunas de 220 px. Ninguém escreveu “a tal largura, uma coluna”: o navegador fez a conta com o piso de 11 rem.

#### 5.1.3 A outra armadilha do `1fr`: uma grade que incha

Há uma variante da mesma armadilha que vai morder você quando usar o Grid para o esqueleto da página inteira, e por isso você a converte em hábito desde hoje. Pense numa página com uma única coluna: `display: grid` sem mais, ou com `grid-template-columns: 1fr`. Se algum filho tem conteúdo largo (uma tabela, por exemplo), a coluna incha até acomodá-lo, porque o seu mínimo `auto` é a largura do conteúdo mais estreito possível. O resultado: a tabela não rola dentro da sua caixa, mas **arrasta a página inteira**.

Medi no painel final, mudando só `minmax(0, 1fr)` por `1fr` na grade da página: a 320 px, a página volta a transbordar, e agora mede 439 px, embora a tabela esteja dentro da sua caixa com `overflow-x: auto`. Com `minmax(0, 1fr)` vale 320. A solução, sempre, é escrever o mínimo zero de propósito: `minmax(0, 1fr)` diz “esta coluna pode encolher até nada se for preciso; não a infle pelo conteúdo”. **Quando uma grade vai conter algo potencialmente largo, a coluna se escreve `minmax(0, 1fr)`, não `1fr`.**

#### 5.1.4 Exemplo resolvido: o resumo do painel

No painel, o resumo já tem a sua classe desde a Lição 4 (`<dl class="summary">`), e o HTML não é tocado. A única coisa que muda é uma linha da regra `.summary` da folha: `repeat(4, 1fr)` vira a linha das colunas que se contam sozinhas.

```css
.summary {
  container-type: inline-size;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 11rem), 1fr));
  gap: 0 var(--space-3);
  margin: 0;
}
```

A primeira declaração, `container-type: inline-size`, você ainda não conhece: prepara o resumo para uma consulta de contêiner e é explicada em 5.2.4. As outras três são as de sempre. Com esta mudança, o segundo culpado do transbordamento desaparece: o resumo mede o que a sua seção permite em qualquer largura, e num celular as cifras se organizam uma embaixo da outra. Resta o primeiro, a tabela, que precisa de outra ferramenta.

### 5.2 Adaptável: que o conteúdo decida

#### 5.2.1 Primeiro a fluidez, depois a consulta

O que você fez até aqui já é “adaptável”, embora você não tenha escrito uma única media query. A barra de controles da Lição 4 desce de linha sozinha quando não cabe; o resumo conta as suas colunas sozinho. A técnica se chama **design intrínseco**: em vez de dizer “a tal largura, faça tal coisa”, dá-se ao navegador um piso, um teto e uma preferência (`flex: 1 1 14rem`, `minmax(11rem, 1fr)`) e ele decide com a largura que tiver. Tem uma vantagem que não se aprecia até que se compare: **funciona com larguras que ninguém previu**. Um tablet na vertical, uma janela pela metade, um celular dobrável, uma tela com a fonte aumentada: nenhum estava na sua lista de “dispositivos”, e todos se organizam igual.


A ordem das ferramentas, da que menos escreve à que mais escreve, é:

1. **Fluxo normal.** Se o conteúdo cabe em uma coluna, deixe-o em uma coluna.
2. **Flexbox com `flex-wrap` e bases razoáveis.** Para grupos de coisas que repartem uma linha.
3. **Grid com `repeat(auto-fit, minmax(...))`.** Para cartões e quadros.
4. **Media query ou consulta de contêiner.** Só quando muda a *organização* da página e não há como pedi-la com as ferramentas anteriores.

#### 5.2.2 A tabela: rolar dentro da sua caixa

Resta o outro transbordamento, o da tabela. Uma tabela de dados não pode ser “partida” sem destruir o que significa: se você convertesse cada linha em um cartão, perderia a comparação de colunas, que é justamente para o que serve uma tabela. É o caso que a norma de refluxo exceta: uma tabela pode requerer duas dimensões. A solução é **deixar que a tabela conserve a sua largura e que a sua caixa role**:

```html
<!-- fig05_04.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Tabla que se desplaza sola</title>
  <link rel="stylesheet" href="fig05_01/styles.css">
  <style>
    .table-scroll {
      overflow-x: auto;
    }
  </style>
</head>
<body>
  <main>
    <h1>Servicios</h1>
    <div class="table-scroll" role="region" aria-labelledby="table-caption" tabindex="0">
      <table>
        <caption id="table-caption">Estado de los servicios en la última revisión</caption>
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
    </div>
  </main>
</body>
</html>
```

O elemento novo é um `div` com `overflow-x: auto`, que diz: “se o conteúdo é mais largo que eu, mostre uma barra de rolagem horizontal *dentro de mim*, não na página”. Com isso, a página inteira mede 320 px (a largura da janela) e só a tabela desliza. Medi esta página nas cinco larguras e o transbordamento da página é zero em todas.

Os três atributos do `div` merecem explicação, porque são uma exceção deliberada à regra de “não ponha atributos de acessibilidade que não fazem falta”:

- `tabindex="0"` faz com que a caixa receba o foco com a tecla Tab. Sem ele, alguém que use só o teclado não consegue rolar a tabela: as setas só rolam uma região que tem o foco. É o que exige [o critério 2.1.1 (“Teclado”)](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html). [O Chrome, desde a sua versão 132](https://developer.chrome.com/blog/keyboard-focusable-scrollers), torna focalizável por si só um contêiner que rola e que não tem filhos focalizáveis, mas outros navegadores não o garantem, então se escreve à mão.
- `role="region"` e `aria-labelledby="table-caption"` dão a ele um nome —o da legenda da tabela— para que um leitor de tela diga “Estado de los servicios en la última revisión, região” (“Estado dos serviços na última revisão, região”) ao chegar, em vez de um mudo “grupo”. É a receita que Adrian Roselli publica, e uma atualização dele de 2026 esclarece que o papel pode ser opcional para cumprir a norma; o nome ajuda de qualquer forma.

Conferi com o teclado o painel final: com Tab, o foco passa pelo link “Resumen”, o link “Servicios”, o campo de busca, o grupo de rádios (uma única parada, porque os botões de rádio de um grupo contam como um), o botão “Revisar ahora” e, por último, a caixa da tabela, identificada como `region`. Com o foco na caixa, as setas esquerda e direita rolam a tabela. E o contorno de foco que a Lição 3 definiu com `:focus-visible` se vê ao redor da caixa, de modo que quem navega com o teclado sabe onde está.

#### 5.2.3 Quando sim é preciso `@media`

Ainda há uma mudança que nem o Flexbox nem o Grid pedem por si sós: numa tela de 1440 px o resumo e a tabela cabem lado a lado, e numa de 375 px não. Isso não é decidir quantas colunas cabem em uma linha: é decidir **como se organiza a página inteira**. Para isso existem as **media queries** (`@media`): [regras que só se aplicam se a janela cumpre uma condição](https://developer.mozilla.org/pt-BR/docs/Web/CSS/CSS_media_queries/Using_media_queries).

[A sintaxe moderna usa comparações](https://www.w3.org/TR/mediaqueries-4/), como na matemática:

```css
@media (width >= 64em) {
  .layout {
    grid-template-columns: 20rem minmax(0, 1fr);
  }
}
```

Diz: “quando a largura da janela for de 64 em ou mais, a grade da página tem uma coluna de 20 rem e outra que toma o resto”. A forma `(width >= 64em)` se chama **sintaxe de intervalo**: os navegadores a entendem desde 2022 e 2023 [(Chrome e Edge 104, Firefox 102, Safari 16.4) e a plataforma a considera de disponibilidade geral desde setembro de 2025](https://web-platform-dx.github.io/web-features-explorer/features/media-query-range-syntax/). Antes se escrevia `(min-width: 64em)`, que significa exatamente o mesmo; você a verá em qualquer código anterior.

Duas decisões da regra merecem ser explicadas:

**A unidade é `em`, não `px`.** O ponto de quebra é medido em `em` (um `em` é o tamanho da fonte do navegador, 16 px por padrão). Assim, se alguém aumenta o tamanho base da fonte do navegador, o ponto de quebra se move com ele: 64 em equivalem a 1,024 px só se o leitor não mexeu na sua configuração; se a deixou a 150 %, equivalem a 1,536 px, e a página muda de organização no momento adequado para *essa* fonte. [O MDN o recomenda](https://developer.mozilla.org/pt-BR/docs/Learn_web_development/Core/CSS_layout/Responsive_design): os pontos de quebra em unidades relativas envelhecem melhor.

**Escreve-se primeiro o do celular.** A regra base (sem `@media`) é a da largura estreita: uma coluna. O da largura grande é *acrescentado* dentro da consulta. Isto se chama **mobile first** e a razão é prática: o mais simples vem primeiro e é o que recebem, sem sobrecarga, os dispositivos com menos recursos; o complexo é acrescentado só onde há espaço para isso. A ordem contrária (escrever primeiro o de desktop e depois desfazê-lo com `max-width`) obriga a anular regras, e cada anulação é um lugar onde errar.

E um aviso que faz de contrapeso: **um ponto de quebra não se escolhe por um dispositivo, mas pelo conteúdo**. A pergunta correta não é “que largura tem um iPhone?”, e sim “a partir de que largura deixa de ficar bom o que há?”. Arraste a borda da janela até que algo se quebre ou fique desperdiçado; ali vai o ponto de quebra. A lista de modelos de celular muda todo ano; o conteúdo, não.

#### 5.2.4 A caixa decide, não a janela: `@container`

Há um caso que `@media` não resolve bem. Veja `fig05_05.html`. Numa janela larga, a coluna do resumo mede 20 rem (320 px); numa janela de celular de 375 px, o resumo ocupa toda a largura: 343 px. São duas situações com a mesma largura aproximada no resumo e larguras de janela de 1440 e 375. Uma media query (que só vê a janela) teria de adivinhar quanto espaço o resumo tem em cada caso. O que realmente importa é **a largura da caixa onde ele está**, não a da janela.


Para isso estão as **consultas de contêiner**. Declara-se uma caixa como contêiner consultável e depois se pergunta pela sua largura:

```html
<!-- fig05_05.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Dos preguntas distintas: la ventana y la caja</title>
  <link rel="stylesheet" href="fig05_01/styles.css">
  <style>
    .layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 1.5rem;
      align-items: start;
    }

    /* La separación la pone el gap de la rejilla, no el margen de la Lección 3. */
    .layout section {
      margin-bottom: 0;
    }

    /* La ventana decide cómo se reparten las dos piezas de la página. */
    @media (width >= 64em) {
      .layout {
        grid-template-columns: 20rem minmax(0, 1fr);
      }
    }

    /* La caja decide cómo se acomoda lo que lleva dentro. */
    .summary {
      container-type: inline-size;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 11rem), 1fr));
      gap: 0 1rem;
      margin: 0;
    }

    @container (width < 24rem) {
      .summary div {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 1rem;
      }

      .summary dd {
        white-space: nowrap;
      }
    }
  </style>
</head>
<body>
  <h1>La página en dos piezas</h1>
  <main class="layout">
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
      <p>Aquí va la tabla.</p>
    </section>
  </main>
</body>
</html>
```

Quatro peças:

- [`container-type: inline-size` declara](https://www.w3.org/TR/css-contain-3/) `.summary` como contêiner consultável pela sua largura.
- `@container (width < 24rem)` aplica as regras de dentro só se **esse contêiner** mede menos de 24 rem (384 px). A condição tem a mesma sintaxe de intervalo que `@media`.
- Dentro da consulta, as quatro caixas do resumo passam a ser linhas compactas (`display: flex`, com o termo à esquerda e o valor à direita). É o que você vê na barra lateral e no celular: uma linha por cifra, em vez de um quadrado alto.
- `white-space: nowrap` é um seguro: impede que “465 ms” se parta em duas linhas se a linha compacta se estreitar mais. Com a fonte da folha da Lição 3 não chegou a ser necessário (medi: a cifra ocupa uma única linha de 32 px com a regra e sem ela, na barra lateral e num celular de 375 px), mas custa uma linha e protege no dia em que alguém aumentar a fonte ou a cifra for mais longa.

Duas restrições que se aprendem melhor de uma vez. Primeira: **uma consulta de contêiner só pode mudar os descendentes do contêiner, não o próprio contêiner.** Por isso as regras apontam para `.summary div` e não para `.summary`. Segunda: `container-type: inline-size` significa que a largura do contêiner já não depende do seu conteúdo (quem a dá é o pai), e por isso se declara numa caixa cuja largura vem de fora, como uma grade ou uma coluna.

[As consultas de contêiner funcionam nos três motores principais](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries) desde fevereiro de 2023 (Chrome e Edge 105, Safari 16, Firefox 110) e a plataforma as considera de disponibilidade geral desde [14 de agosto de 2025](https://web-platform-dx.github.io/web-features-explorer/features/container-queries/). Quando um componente vai viver em lugares com larguras diferentes —uma barra lateral, uma coluna principal, uma janela pop-up—, esta é a ferramenta correta.

Um aviso para o hábito de validar que você aprendeu na Lição 3. Se você passar esta folha pelo [validador de CSS do W3C](https://jigsaw.w3.org/css-validator/), ele já não responde “Congratulations! No Error Found”: conferi enviando a ele `fig05_06/styles.css` e respondeu com dois erros, “La propiedad “container-type” no existe” e “la regla-arroba “@container” no está implementada” (as mensagens, na tradução do validador: “a propriedade ‘container-type’ não existe” e “a at-rule ‘@container’ não está implementada”). Não são erros da sua folha, e sim uma limitação do validador, que ainda não conhece as consultas de contêiner embora os navegadores as usem desde 2023. Quando você validar, confira que os únicos erros sejam esses dois; qualquer outro sim é seu.

#### 5.2.5 Tamanho dos alvos

Uma coisa mais, que se nota sobretudo numa tela de toque, onde o polegar é menos preciso que o cursor, mas que vale para qualquer ponteiro: o mouse, uma caneta ou o dedo. [O critério 2.5.8 da norma (“Tamanho do alvo, mínimo”)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) pede que os alvos que se ativam com um ponteiro meçam ao menos **24 por 24 pixels CSS**, com exceções (se há espaço suficiente ao redor, se o alvo está dentro de uma frase, se o tamanho é fixado pelo navegador). Quem mais precisa disso são as pessoas com tremor nas mãos ou com pouca precisão de movimento, use o dispositivo que usar. No painel, os botões e o campo de busca levam `min-height: 2.5rem` (40 px) desde a Lição 3: mais de uma vez e meia o mínimo, porque 24 px é um piso, não a medida que um polegar acerta com conforto.

#### 5.2.6 O painel terminado da lição

Com tudo o que foi dito, o painel completo da lição é `fig05_06.html`. As mudanças de HTML em relação ao painel da Lição 4 são três, e nenhuma muda o que o HTML diz: a classe `layout` em `<main>`, o `div.table-scroll` com a sua tabela dentro, e o `id="table-caption"` na legenda da tabela, para o qual aponta o `aria-labelledby` do envoltório.

```html
<!-- fig05_06.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Revisor de servicios</title>
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="fig05_06/styles.css">
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

      <div class="table-scroll" role="region" aria-labelledby="table-caption" tabindex="0">
        <table>
          <caption id="table-caption">Estado de los servicios en la última revisión</caption>
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
      </div>
    </section>
  </main>

  <footer>
    <p>Datos de ejemplo escritos a mano.</p>
  </footer>
</body>
</html>
```

E esta é a folha de estilo completa, que é a da Lição 4 com a organização adaptável acrescentada (os comentários indicam de que lição vem cada parte):

```css
/* fig05_06/styles.css */
/* La hoja del panel al terminar la Lección 5: la de la Lección 3, con sus mismas
   capas y variables, más el acomodo de la Lección 4 (Flexbox y Grid) y el de la
   Lección 5 (cualquier pantalla). Cada cambio lleva un comentario con su lección. */

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

  /* Un ancho cómodo para leer, centrado: auto reparte el espacio sobrante.
     Lección 5: de 60 a 80 rem, porque en una pantalla ancha ahora caben dos columnas. */
  header,
  main,
  footer {
    max-width: 80rem;
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
  /* Cada sección es una hoja blanca sobre el fondo de la página.
     Lección 5: sin margen inferior; la separación la pone el gap de .layout. */
  section {
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

  /* ---- Lecciones 4 y 5: el acomodo ---- */

  /* Lección 5. Las dos piezas de la página: la ventana decide si van una sobre otra
     o lado a lado. minmax(0, 1fr) y no 1fr: la columna no se infla con la tabla. */
  .layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--space-4);
    align-items: start;
  }

  @media (width >= 64em) {
    .layout {
      grid-template-columns: 20rem minmax(0, 1fr);
    }
  }

  /* Grid, dos dimensiones (Lección 4); las columnas se cuentan solas (Lección 5). */
  .summary {
    container-type: inline-size;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 11rem), 1fr));
    gap: 0 var(--space-3);
    margin: 0;
  }

  /* Lección 5. La caja, no la ventana, decide si cada cifra va en una fila compacta. */
  @container (width < 24rem) {
    .summary div {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: var(--space-3);
    }

    .summary dd {
      white-space: nowrap;
    }
  }

  /* Lección 4. Flexbox, una dimensión: el encabezado y la barra de controles
     se parten en renglones cuando no caben. */
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

  /* Lección 5. La tabla conserva su semántica: lo que se desplaza es su envoltorio. */
  .table-scroll {
    overflow-x: auto;
  }
}
```

Em relação à folha da Lição 4 há dois ajustes, uma mudança e três regras novas, e nada mais. Os ajustes: a largura máxima de `header`, `main` e `footer` sobe de 60 para 80 rem, para que numa tela larga as duas colunas não se apertem; e as seções perdem o seu `margin-bottom`, porque dentro da grade a separação quem põe é o `gap` de `.layout`, que é a regra da Lição 4 (4.1.2): a separação entre irmãos quem põe é o pai. A mudança: a regra `.summary` troca `repeat(4, 1fr)` pelas colunas que se contam sozinhas e acrescenta `container-type`, como em 5.1.4. As regras novas vão no bloco da organização, que agora junta o das duas lições: `.layout` com `minmax(0, 1fr)` e, a partir de 64 em, duas colunas; a consulta de contêiner do resumo; e o `.table-scroll`. O cabeçalho, a barra de controles, as camadas, as variáveis, o foco e os selos ficam como estavam: o adaptável se soma ao que havia, não o reescreve. (A ordem das regras dentro do bloco mudou em relação à Lição 4: primeiro a página, depois o resumo, depois os controles. É a ordem em que as lê quem abre o arquivo de cima para baixo, e não altera o resultado, porque nenhuma dessas regras compete com outra pela mesma propriedade.)

O ponto de partida desta lição, `fig05_01.html`, é o painel da Lição 4 com o seu `<link>` apontando para a cópia da folha que vive nesta pasta; você o tem completo a seguir, caso queira comparar ou não tenha o da lição anterior:

```html
<!-- fig05_01.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Revisor de servicios</title>
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="fig05_01/styles.css">
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

e a sua folha, `fig05_01/styles.css`, é `fig04_06/styles.css` sem uma única mudança salvo os comentários de cima:

```css
/* fig05_01/styles.css */
/* La hoja del panel tal como la deja la Lección 4 (es fig04_06/styles.css, copiada
   aquí para que esta carpeta funcione sola): la de la Lección 3 más Flexbox y Grid.
   Todavía no se adapta a una pantalla angosta. */

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

Meça o painel terminado como você mediu o inicial. Medi `fig05_06.html` em 320, 375, 768, 1024 e 1440 px: a largura da página é igual à da janela nas cinco, e a comparação do console devolve `false`. A 1440 px o resumo fica em uma coluna de 20 rem à esquerda e a tabela à direita, com a barra de controles em cima da tabela em uma única fila; a 320 px, tudo em uma coluna, com a tabela rolando dentro da sua caixa. A largura **do celular**, que era o problema que abriu a lição, já não é.

#### 5.2.7 Leve-o ao seu `revisor`

Até aqui você trabalhou com as páginas do repositório. Falta o passo que converte o aprendido no seu projeto: que o **seu** `revisor` fique igual a `fig05_06.html`, medido e guardado no Git. São quatro passos, e nenhum pede que você escreva algo novo.

**1. A folha.** Abra `fig05_06/styles.css` (no repositório, ou copie-a do bloco completo de cima) e cole o seu conteúdo no seu `~/revisor/css/styles.css`, no lugar do que havia. Você pode substituí-la inteira porque é a folha da Lição 4 com os ajustes e as regras que você acabou de ler: não se perde nada. Se nas lições anteriores você fez mudanças próprias na sua folha (outra cor, outro tamanho), então não a substitua: faça à mão os dois ajustes (a largura máxima de `header`, `main` e `footer` sobe para `80rem`; `section` perde o seu `margin-bottom`), troque a regra `.summary` pela de 5.1.4, e acrescente ao bloco da Lição 4 a regra `.layout` com o seu `@media`, o `@container` do resumo e o `.table-scroll`.

**2. A página.** No seu `~/revisor/index.html` faça as mudanças do HTML, que são as da lista de 5.2.6:

- `<main>` passa a ser `<main class="layout">`.
- A tabela fica dentro de `<div class="table-scroll" role="region" aria-labelledby="table-caption" tabindex="0">`, tal como em 5.2.2.
- O que se esquece: o `<caption>` leva `id="table-caption"`. Sem esse `id`, o `aria-labelledby` do envoltório aponta para o nada e a região fica sem nome.

Você também pode copiar `fig05_06.html` completa sobre o seu `index.html`, com uma precaução: no repositório, o seu `<link>` aponta para `fig05_06/styles.css`; no seu projeto deve dizer `href="css/styles.css"`, como desde a Lição 3. Se você não o mudar, a página aparecerá sem estilos.

**3. Meça.** A partir da pasta do projeto, ligue o servidor:

```bash
$ cd ~/revisor
$ python3 -m http.server 8000 --bind 127.0.0.1
```

Abra `http://127.0.0.1:8000/`, ative o modo responsivo e repita a medição da lição: a linha do console deve devolver `false` a 320, 375, 768, 1024 e 1440 px, e a página deve ficar igual a `fig05_06.html` nas mesmas larguras. Fiz isso com uma pasta `revisor` montada assim: a 320 px a página mede 320 e a caixa da tabela 238 px, com a tabela rolando dentro; a 1440 px, as duas colunas. Se algo não coincidir, compare o seu arquivo com o do repositório: quase sempre é uma classe que não foi escrita ou um `div` que foi fechado em outro lugar.

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
$ git commit -m "Adapta el panel a cualquier ancho de pantalla"
$ git status
En la rama main
nada para hacer commit, el árbol de trabajo está limpio
```

O `git commit` imprime uma linha com o código do commit e quantas linhas mudaram; os números dependem dos seus arquivos. Com isso, o seu `revisor` fica pronto para a Lição 6, que parte exatamente daqui.

## O erro que você vai ver

Os erros de organização quase nunca são mensagens: são uma página que parece “errada” sem dizer por quê. Nesta lição há dois, e os dois se medem. O primeiro você acabou de ver na tag `viewport`: sem ela, a página não transborda, mas tudo fica diminuto, e a única pista é o número de `window.innerWidth`. O segundo é o que abriu a lição.

**A página mais larga que a janela.** Abra `fig05_01.html` a 320 px. O sinal é a barra de rolagem horizontal, ou o console:

```js
document.documentElement.scrollWidth > document.documentElement.clientWidth
```

que responde `true`. Para encontrar *quem* passa da borda, nas ferramentas passe o cursor pelos elementos do painel de elementos: o navegador sombreia a área de cada um, e o que sai pela borda direita da janela é o culpado. Em `fig05_01.html` são dois: a tabela, que chega aos 414 px, e o resumo, que chega aos 369. As duas soluções você já tem: o envoltório com `overflow-x: auto` para a tabela, e as colunas que se contam sozinhas para o resumo. Um conselho para quando houver vários culpados: conserte um, meça de novo e procure o seguinte. A página mede o que mede o **mais** largo, então enquanto restar um, a medição continua dando `true` ainda que você tenha consertado o outro, e é fácil acreditar que a correção não funcionou.

**E uma variante que confunde:** a tabela já está na sua caixa com `overflow-x: auto`, e mesmo assim a página continua mais larga que a janela. É a grade inchada do trecho 5.1.3: a coluna da página está declarada como `1fr` e se expande pela largura da tabela. Corrige-se com `minmax(0, 1fr)`. Se você topar com isso em outro projeto, já sabe onde olhar: não na tabela, mas na coluna que a contém.

## O que se faz errado

**Uma media query por dispositivo.** `@media (width: 390px) { ... }` “para o iPhone”. Cobre uma única largura, de um único modelo, de um ano. Um celular dobrável, uma janela pela metade ou uma tela com fonte aumentada caem entre esses pontos, e ali a página não foi pensada. Custo: uma lista de dispositivos que cresce todo ano e que nunca está em dia.

**Esconder o transbordamento em vez de consertá-lo.** `body { overflow-x: hidden }` faz desaparecer a barra de rolagem e deixa o conteúdo cortado: o que está além da borda já não pode ser visto nem alcançado. É pior que o defeito, porque *parece* consertado. O critério 1.4.10 pede que não se perca informação ao ampliar; cortar a página é perdê-la.

**Converter a tabela em outra coisa para que “caiba”.** Mudar o `display` de `table`, `tr` e `td` para `block` ou `grid`, ou refazer a tabela com `div`. Pode tirar o papel de tabela e a navegação por células de quem usa um leitor de tela. No Chrome 154 a tabela com `display: grid` conservou o seu papel, mas a regra do curso não depende de que o mesmo ocorra em cada navegador e leitor: deixa-se a tabela como tabela e envolve-se.

**Tirar o zoom “para que não se mexa”.** `user-scalable=no` ou `maximum-scale=1` na tag `viewport`. Impede de aproximar a página, que é o que quem tem baixa visão usa para lê-la.

**Dar a um contêiner de largura incerta uma coluna `1fr`.** É a grade inchada de 5.1.3: passa despercebida enquanto o conteúdo for curto e estoura no dia em que chega uma tabela larga, um identificador longo ou uma URL sem espaços. Custa uma tarde, porque o culpado parece ser o conteúdo e é a coluna.

## Exercícios

### Exercício 1 — Menos cifras, mesmas colunas

Copie `fig05_03.html` e deixe no resumo só três cifras: tire “Respuesta promedio”. Sem tocar no CSS, meça a largura de cada cartão a 768, 1024 e 1440 px (as ferramentas do navegador dão a você a largura de cada elemento ao selecioná-lo). Depois troque `auto-fit` por `auto-fill`, meça de novo nessas três larguras e explique em quais houve diferença e por quê (use o que você viu com dois cartões em 5.1.2).

### Exercício 2 — Quebre a grade da página de propósito

Numa cópia de `fig05_06.html`, troque `minmax(0, 1fr)` por `1fr` na regra de `.layout`. Meça a largura da página a 320 px com a linha do console. Quanto dá? Depois procure com as ferramentas do navegador que elemento faz a grade crescer e explique por que, se a tabela já estava na sua caixa com `overflow-x: auto`, a página transborda igual.

### Exercício 3 — Um ponto de quebra que o conteúdo decide

Em `fig05_06.html`, a barra de controles passa de três linhas (a 320 px) a duas e depois a uma ao alargar a janela. Sem olhar um único modelo de celular, encontre com o modo responsivo a largura de janela em que passa de duas linhas a uma, e anote-a. Depois siga alargando: a partir de 1024 px, e até um pouco mais de 1160, a barra volta a ocupar duas linhas. Explique os dois achados com a soma do que mede cada peça.

## Soluções

### Solução 1

Medi com três cartões de piso de 11 rem. Com `auto-fit`: a 768 px, três colunas de 235 px; a 1024 e a 1440 px, três colunas de 299 px. As duas últimas medidas são iguais porque a folha limita o conteúdo a 60 rem desde a Lição 3: a partir de 960 px de janela, o contêiner já não cresce e mede 928 px. Com `auto-fill` o resultado é idêntico a 768, e diferente a 1024 e a 1440: ali cabem quatro colunas de 220 px, os três cartões ocupam as três primeiras e fica uma coluna vazia à direita.

A diferença só aparece quando há **menos cartões do que colunas possíveis**, e isso ocorre a 1024 e a 1440 px. A 768 px cabem justamente três colunas para três cartões e não sobra nenhuma. `auto-fit` colapsa as colunas sem conteúdo e deixa que as que o têm se estiquem; `auto-fill` as conserva, embora estejam vazias.

### Solução 2

Com `1fr` na grade da página, a medição dá **439** a 320 px (a comparação devolve `true`): é o que mede a tabela, mais o preenchimento da sua seção e o da página. O elemento que alarga tudo é a coluna da grade, e a seção que a contém. A tabela sim está dentro da sua caixa, com `overflow-x: auto`, mas a caixa não pode ser mais estreita que a sua coluna, e a coluna `1fr` tem um mínimo de `auto`, que é a largura mínima do conteúdo, tabela incluída. Então a coluna incha, a caixa incha com ela, e a caixa já não tem nada para rolar: agora tudo cabe numa caixa larga, que por sua vez transborda a página. Com `minmax(0, 1fr)` o mínimo é zero, a coluna mede o que a janela permite e a tabela, que continua sendo larga, rola dentro de uma caixa de 238 px.

### Solução 3

A barra cabe em uma linha quando a sua caixa mede ao menos o que somam as suas três peças mais os dois espaços entre elas. Medi em `fig05_06.html`: o campo tem uma base de `14rem` (224 px), o grupo de rádios mede 345 px (cada rótulo leva a margem direita de 1 rem que a Lição 3 deu a ele), o botão 135 px, e o `gap` põe 16 px duas vezes. A soma é 224 + 345 + 135 + 32 = **736 px**. Nessa zona do painel a página é uma única coluna, e a caixa dos controles mede a largura da janela menos 82 px: 32 de preenchimento de `main`, 48 de preenchimento da seção e 2 da sua borda. Assim, a barra passa a uma linha com uma janela de **818 px**, que foi justamente a primeira largura que deu uma única fila ao medir pixel a pixel.

O segundo achado é o que mais ensina: a 1024 px a página muda para duas colunas (`@media (width >= 64em)`), e a caixa dos controles fica em 598 px, que é menos que 736: a barra volta a se partir em duas linhas. Só a partir de 1162 px a caixa recupera 736 px e volta a caber em uma. **A largura que importa à barra não é a da janela, mas a da sua caixa**, e a largura da sua caixa não cresce de forma uniforme com a da janela, porque no meio a página mudou de organização. Por isso o `flex-wrap` resolve isso sem nenhum número escrito: a barra desce de linha quando a sua caixa é estreita, seja pela janela ou por uma coluna lateral. Se você tivesse escrito uma media query com “818 px”, teria acertado a 820 e errado a 1024.

## Como sei que consegui

- [ ] `fig05_01.html` a 320 px devolve `true` com a linha do console (a largura da página é de 414 px), e `fig05_06.html` devolve `false` em 320, 375, 768, 1024 e 1440 px.
- [ ] `fig05_02.html` num celular emulado de 390 px mostra `window.innerWidth` de 980; `fig05_03.html` no mesmo celular mostra 390.
- [ ] Em `fig05_06.html` a 1440 px o resumo está à esquerda em uma coluna e a tabela à direita; a 320 px tudo vai em uma única coluna, e só a tabela rola para os lados, dentro da sua caixa.
- [ ] Com Tab, o foco passa nesta ordem: link “Resumen”, link “Servicios”, campo de busca, grupo de rádios, botão “Revisar ahora” e a caixa da tabela (que é anunciada como região). Com o foco na caixa, as setas rolam a tabela.
- [ ] Os botões e o campo de busca medem ao menos 40 px de altura (`min-height: 2.5rem`, desde a Lição 3), e a ferramenta de inspeção do navegador o confirma.
- [ ] Você consegue explicar com as suas palavras o que faz cada peça de `repeat(auto-fit, minmax(min(100%, 11rem), 1fr))`, por que `1fr` por si só não basta numa coluna que conterá algo largo, e que diferença há entre uma media query e uma de contêiner, com um exemplo do painel para cada uma.
- [ ] O seu `~/revisor` (servido a partir da sua pasta em `http://127.0.0.1:8000/`) fica igual a `fig05_06.html`, devolve `false` nas cinco larguras, e `git log --oneline` mostra o commit com o painel adaptável.

## Resumo

Para fixar o que você acabou de ver, responda sem olhar a lição:

1. O que faz o navegador de um celular com uma página que não leva a tag `viewport`, e que cifra medimos?
2. De onde sai o 320 e a quem protege, além de quem usa um celular?
3. Por que `repeat(4, 1fr)` transborda a 320 px, se `1fr` é “uma fração do espaço”?
4. Em que se diferenciam `auto-fill` e `auto-fit`, e qual você usou para o resumo?
5. Por que uma tabela larga se envolve e não se refaz com outro `display`? Que três atributos leva o seu envoltório e para que serve cada um?
6. Por que o ponto de quebra se escreve em `em` e se escolhe olhando o conteúdo, não um modelo de celular?
7. Por que `@container` não pode mudar o próprio contêiner?

Se alguma resposta emperrar, volte ao trecho correspondente: é sinal de que ali ficou uma peça frouxa, não de que você não serve para isto.

## Para ler mais

- [MDN, “Design responsivo”](https://developer.mozilla.org/pt-BR/docs/Learn_web_development/Core/CSS_layout/Responsive_design) — o módulo de aprendizado da Mozilla sobre `viewport`, mobile first e pontos de quebra. Consultado em 7 de outubro de 2026.
- [W3C, “Entendendo o critério 1.4.10: Refluxo”](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) — de onde sai o 320 e que parte do conteúdo pode rolar. Em inglês. Consultado em 7 de outubro de 2026.
- [MDN, “Consultas de contêiner”](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries) — como se declara um contêiner consultável, a sintaxe de `@container` e por que uma consulta não pode mudar o seu próprio contêiner. Consultado em 7 de outubro de 2026.
