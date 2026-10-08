# Lição 2 — HTML com significado

**Tempo:** duas sessões de cerca de 90 min. Uma divisão que funciona: na primeira, “O porquê antes do como”, o documento e os elementos com significado (2.1) e a tabela (2.2); na segunda, os controles (2.3), o painel completo escrito à mão, “O erro que você vai ver” e os exercícios. Cada sessão termina em uma página que você pode abrir e validar.

**O que você constrói:** o esqueleto do painel `revisor`, escrito à mão

**O que você aprende:** escolher o elemento pelo que ele significa e não por como ele aparece; títulos, tabelas, botões, links e rótulos

**As páginas desta lição.** Todas as figuras estão em [`programas/02-html-con-significado/`](https://github.com/HabilMX/curso-web/tree/main/programas/02-html-con-significado) do [repositório do curso](https://github.com/HabilMX/curso-web), cada uma com a sua saída esperada ao lado. Abra-as com o servidor local que você ligou na Lição 1.

## Ao terminar, você vai conseguir

- Escrever do zero um documento HTML completo e explicar para que serve cada linha do seu cabeçalho: `<!DOCTYPE html>`, `lang`, `charset`, `viewport` e `<title>`.
- Escolher entre `<header>`, `<nav>`, `<main>`, `<section>` e `<footer>` em vez de um `<div>`, e dizer o que ganha quem usa a página com isso.
- Construir uma tabela acessível, com título, cabeçalhos de coluna e cabeçalhos de linha, e decidir quando um dado não merece tabela e sim lista.
- Distinguir um link de um botão pelo que cada um promete, e conferir isso com a tecla Tab.
- Associar cada campo ao seu rótulo das duas maneiras que existem (explícita e implícita), agrupar opções com `<fieldset>` e `<legend>`, e explicar por que um `placeholder` não é um rótulo.
- Passar uma página pelo validador oficial, ler suas mensagens e corrigir o que elas apontam.

## O porquê antes do como

Imagine que você entrega o painel a quatro pessoas diferentes. A primeira o abre numa tela grande e o maneja com o mouse: para ela quase qualquer página funciona, porque vê o resultado. A segunda está com o pulso machucado e maneja tudo com o teclado: avança com a tecla Tab e ativa com Enter. A terceira é uma pessoa cega que o escuta com um leitor de tela, um programa que lê em voz alta o que há na página e permite saltar de um título a outro. A quarta não é uma pessoa: é o buscador que vai decidir o que a sua página diz nos resultados dele.

As três últimas têm algo em comum: **não olham os pixels, leem a estrutura**. O teclado precisa saber quais coisas podem ser ativadas. O leitor de tela precisa saber o que é um título, o que é uma tabela, o que é um botão. O buscador precisa saber o que é o conteúdo principal e o que é o rodapé. E tudo isso é o HTML que dá, não a cor nem o tamanho da letra.

Por isso esta lição se chama “HTML com significado”. O HTML não é “a linguagem que desenha a página”: é a linguagem que **diz o que é cada coisa**. Desenhá-la é trabalho do CSS, que você verá na Lição 3; fazê-la reagir é trabalho do JavaScript, a partir da Lição 6. Hoje você não vai escrever uma única regra de estilo, e isso é de propósito: a página vai ficar feia, com a aparência padrão do navegador, e mesmo assim será utilizável pelas quatro pessoas. Uma página que só é utilizável quando está bonita não está terminada, está maquiada.

O que falta hoje é concreto: o `revisor` ainda não existe. Ao terminar esta lição você terá o esqueleto completo dele: um cabeçalho, um resumo, um campo de busca, um filtro, um botão e uma tabela com cinco serviços, tudo escrito à mão com dados de exemplo. Ainda não filtra nem busca nada: isso vem mais adiante. O que ele terá desde hoje é uma estrutura que não precisa ser refeita depois. A ordem da lição é esta: primeiro o documento e os elementos que dão estrutura (a seção 2.1), depois os dados em forma de tabela (2.2) e no fim os controles, que são os botões, os links e os rótulos (2.3). Cada seção termina em uma página que você pode abrir e testar.

## Os conceitos

Comece guardando o trabalho de hoje na pasta do seu projeto, a mesma onde você deixou o primeiro `index.html` na [Lição 1](01-entorno-ciclo-trabajo.md). A partir dessa pasta, suba o servidor local com `python3 -m http.server 8000 --bind 127.0.0.1`, como na Lição 1, e abra `http://localhost:8000/` no navegador cada vez que salvar uma mudança. Se a página não mudou, recarregue com Ctrl+Shift+R, que ignora o que o navegador tinha guardado.

### 2.1 O documento e os elementos com significado

#### 2.1.1 O que é um elemento

Um documento HTML é texto com marcas. Cada marca se chama **tag** e quase sempre vem em par: uma de abertura, como `<h1>`, e uma de fechamento, como `</h1>`. O que fica entre as duas é o conteúdo. O par completo, com o seu conteúdo, se chama **elemento**. Ao escrever `<h1>Revisor de servicios</h1>` você criou um elemento que diz: “isto é um título de primeiro nível, e o seu texto é ‘Revisor de servicios’” (“Revisor de serviços”).

Algumas tags levam **atributos**, que são dados extras com a forma `nome="valor"` dentro da tag de abertura. Em `<a href="#services">` o atributo é `href` e o seu valor é `#services`. Um atributo que você verá em quase todas as páginas de hoje é **`id`**: dá a um elemento um nome que não pode se repetir no documento, como `id="services"`. Um link cujo `href` começa com `#` leva à parte da mesma página que tem esse `id`: `<a href="#services">` salta para o elemento com `id="services"`. Mais adiante, o CSS e o JavaScript usarão esse mesmo nome para encontrar o elemento. Outro atributo frequente é **`class`**: também dá um nome ao elemento, mas, diferentemente do `id`, pode se repetir em muitos elementos, e um mesmo elemento pode levar vários separados por espaços (`class="status status-available"`). Serve para que o CSS dê a mesma aparência a todos os que o levam; **não muda o que o elemento significa**, e por isso um `<div class="title">` continua sendo uma caixa sem significado, ainda que o seu nome diga “título”. Alguns elementos não têm conteúdo e por isso não levam tag de fechamento; chamam-se **elementos vazios**: `<meta>`, `<input>` e `<img>` são os que você verá hoje.

Quando o navegador recebe o seu arquivo, não o “desenha” diretamente. Lê-o de cima para baixo e constrói com ele uma estrutura na memória em forma de árvore: o documento é a raiz, dentro vão `<head>` e `<body>`, dentro de `<body>` vão os títulos, os parágrafos, a tabela, e assim por diante. Essa árvore se chama **DOM** (modelo de objetos do documento) e voltará a aparecer na Lição 7, onde o JavaScript a percorrerá e a modificará. Por ora basta que você saiba que o que o navegador mostra, o que o teclado percorre e o que o leitor de tela lê saem dessa árvore, não do seu arquivo de texto.

Uma consequência incômoda: **o navegador perdoa quase tudo**. Se você esquecer de fechar um parágrafo ou pôr um elemento onde ele não vai, ele não avisa; adivinha o que você quis dizer com umas [regras muito precisas escritas na especificação](https://html.spec.whatwg.org/multipage/parsing.html) e monta a árvore como pode. Isso é bom para quem visita uma página mal escrita, mas ruim para quem a escreve: o erro não se vê, só se nota depois, em outro navegador ou em outro tipo de usuário. Por isso, nesta lição você usará um validador, um programa que confere o seu HTML contra as regras do padrão e diz o que o navegador calou.

#### 2.1.2 O mínimo de um documento completo

Esta é a menor página que está completa. Salve-a como `pagina.html` na sua pasta e abra-a:

```html
<!-- fig02_01.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Revisor de servicios</title>
</head>
<body>
  <main>
    <h1>Revisor de servicios</h1>
    <p>Esta es la página más pequeña que está completa.</p>
  </main>
</body>
</html>
```

```text
Revisor de servicios
Esta es la página más pequeña que está completa.
```

O bloco de baixo é o que a página mostra ao carregar, reduzido ao seu texto. O importante está nas linhas de cima que não se veem. Cada uma existe por uma razão concreta.

**`<!DOCTYPE html>`** vai sempre primeiro. Parece uma tag, mas é uma declaração: diz ao navegador “esta página segue o padrão atual”. Sem ela, os navegadores entram no que chamam de **[modo de compatibilidade](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Guides/Quirks_mode_and_standards_mode)** (*quirks mode*): imitam os erros de navegadores de vinte e cinco anos atrás para que as páginas antigas continuem aparecendo como apareciam, e várias regras de cálculo de tamanhos mudam em silêncio. Quem esquece o `DOCTYPE` não recebe um erro: recebe uma página que aparece ligeiramente diferente e não sabe por quê. Escreva-o sempre, tal qual.

**`<html lang="es">`** é a raiz do documento e declara o idioma. Parece um detalhe de cortesia e não é. O leitor de tela escolhe com ele a voz e a pronúncia: sem `lang`, pode ler o seu texto em espanhol com as regras do inglês, e o resultado é incompreensível. O navegador o usa para oferecer traduzir a página e para escolher as aspas do elemento `<q>` conforme o idioma, e o CSS o usa para saber com que dicionário separar palavras com hífen no fim da linha quando você pede isso com `hyphens: auto` (por padrão não separa nenhuma; conferi no Chrome 154). É, além disso, um critério de acessibilidade com nome e número nas diretrizes do W3C ([WCAG 3.1.1, “Idioma da página”](https://www.w3.org/WAI/WCAG22/Understanding/language-of-page.html)). O valor `es` significa espanhol; se algum dia você precisar do espanhol do México em particular, escreve-se `es-MX`.

**`<meta charset="utf-8">`** diz com que código de caracteres o arquivo está guardado. O UTF-8 é o que representa os ñ, os acentos e os sinais de abertura do espanhol (¿ ¡) sem problemas. Se você o omitir e o seu editor salvou em UTF-8, é possível que você veja “CatÃ¡logo” em vez de “Catálogo”: o navegador adivinhou outra codificação. A [especificação](https://html.spec.whatwg.org/multipage/semantics.html) pede, além disso, que essa linha apareça completa dentro dos primeiros 1,024 bytes do arquivo, então ela vai no início do `<head>`, antes do título.

**`<meta name="viewport" content="width=device-width, initial-scale=1">`** é a linha que mais se esquece e a que mais dói num celular. Os navegadores móveis nasceram num mundo de páginas feitas para desktop, e para não quebrá-las fingem por padrão que a tela é muito mais larga do que é (da ordem de 980 px) e depois a encolhem para que caiba. Com esta linha você diz “não finja: use a largura real do dispositivo e uma escala de 1”. Sem ela, a Lição 5 não pode funcionar, porque nenhum design adaptável se adapta a uma largura sobre a qual o navegador está mentindo.

**`<title>`** é o título do documento, que não é a mesma coisa que o título `<h1>`. Aparece na aba, no histórico, nos favoritos e, sobretudo, é **a primeira coisa que um leitor de tela anuncia ao abrir a página** e o que quase todos os buscadores mostram como título do resultado. Outra diretriz de acessibilidade o exige por nome ([WCAG 2.4.2, “Página com título”](https://www.w3.org/WAI/WCAG22/Understanding/page-titled.html)). Um título como “Documento sem título” ou “index” é uma página sem nome. Escreva um que diga que página é.

Observe também, na página de cima, o que há dentro de `<body>`: um `<main>` que envolve tudo. É o primeiro elemento com significado que você conhece e o próximo trecho trata deles.

#### 2.1.3 Significado: a diferença entre um `div` e um `main`

Aqui está a ideia central da lição, e convém vê-la com um contraste. As duas páginas seguintes dizem exatamente a mesma coisa e, com a aparência padrão, parecem quase iguais. A primeira usa só `<div>`:

```html
<!-- fig02_02.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Revisor de servicios (todo con div)</title>
</head>
<body>
  <div class="top">
    <div class="title">Revisor de servicios</div>
    <div class="links">
      <div><a href="#summary">Resumen</a></div>
      <div><a href="#services">Servicios</a></div>
    </div>
  </div>
  <div class="content">
    <div id="summary">
      <div class="subtitle">Resumen</div>
      <div>4 de 5 servicios disponibles.</div>
    </div>
    <div id="services">
      <div class="subtitle">Servicios</div>
      <div>Catálogo, Pagos, Inventario, Notificaciones y Búsqueda.</div>
    </div>
  </div>
  <div class="bottom">Datos de ejemplo escritos a mano.</div>
</body>
</html>
```

```text
Revisor de servicios
Resumen
Servicios
Resumen
4 de 5 servicios disponibles.
Servicios
Catálogo, Pagos, Inventario, Notificaciones y Búsqueda.
Datos de ejemplo escritos a mano.
```

A segunda usa os elementos que dizem o que é cada coisa:

```html
<!-- fig02_03.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Revisor de servicios (con significado)</title>
</head>
<body>
  <header>
    <h1>Revisor de servicios</h1>
    <nav>
      <p>Ir a: <a href="#summary">Resumen</a> o <a href="#services">Servicios</a></p>
    </nav>
  </header>
  <main>
    <section id="summary">
      <h2>Resumen</h2>
      <p>4 de 5 servicios disponibles.</p>
    </section>
    <section id="services">
      <h2>Servicios</h2>
      <p>Catálogo, Pagos, Inventario, Notificaciones y Búsqueda.</p>
    </section>
  </main>
  <footer>
    <p>Datos de ejemplo escritos a mano.</p>
  </footer>
</body>
</html>
```

```text
Revisor de servicios
Ir a: Resumen o Servicios
Resumen
4 de 5 servicios disponibles.
Servicios
Catálogo, Pagos, Inventario, Notificaciones y Búsqueda.
Datos de ejemplo escritos a mano.
```

Para ver a diferença não é preciso olhar a tela. Abra as ferramentas do navegador (tecla F12, ou clique com o botão direito e “Inspecionar”), vá à aba de elementos e procure o painel de **acessibilidade**: o Chrome o mostra junto aos estilos, e o Firefox o traz como aba própria. Ali aparece a **[árvore de acessibilidade](https://www.w3.org/TR/html-aam-1.0/)**, que é o que o navegador entrega aos leitores de tela. Medi com o Chrome 154 nas duas páginas. Da primeira, estas são as únicas coisas que ele reconhece: dois links e muito texto solto. Da segunda, isto:

```text
RootWebArea "Revisor de servicios (con significado)"
  banner
    heading "Revisor de servicios" (nivel 1)
    navigation
      link "Resumen"
      link "Servicios"
  main
    heading "Resumen" (nivel 2)
    heading "Servicios" (nivel 2)
  contentinfo
```

Cada palavra da esquerda é um **papel** (*role*): o que a coisa é. `<header>` no nível superior do `<body>` se converte em um `banner`, `<nav>` em `navigation`, `<main>` em `main`, `<footer>` em `contentinfo`. Os leitores de tela permitem [saltar diretamente](https://www.w3.org/WAI/tutorials/page-structure/) de um a outro (“vá ao conteúdo principal”, “liste os títulos”). Na primeira página, quem não vê a tela tem de ouvir tudo em ordem, desde o início, toda vez que entra. Na segunda, salta para `main` e começa a ler.

Isso é **significado** (as diretrizes chamam de [informações e relações](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html)): a página diz, com o nome do elemento, que papel cada pedaço desempenha. Três precisões evitam os erros mais comuns.

A primeira: **`<header>` e `<footer>` só são `banner` e `contentinfo` quando são da página inteira**, ou seja, quando não estão dentro de um `<main>`, `<section>`, `<article>`, `<aside>` ou `<nav>`. Tanto faz que estejam dentro de um `<div>`: medi no Chrome 154, e um `<header>` dentro de um `<div>` continua sendo `banner`, enquanto um dentro de `<main>` deixa de ser. Dentro de um `<section>` ou de um `<article>` eles são o cabeçalho ou o rodapé daquela parte, não da página, e o navegador os trata assim. (Um **`<article>`** é um bloco com sentido próprio, que seria entendido solto em outra página: uma notícia, um comentário, o cartão de um serviço. Você o usará no segundo exercício.) A segunda: **um `<section>` sem nome não é um ponto de referência**. Agrupa conteúdo de um mesmo tema, e o costume é que comece com um título, mas só vira uma região navegável se você der um nome a ele, e isso precisa de atributos do ARIA que ainda não vemos. Por isso na árvore de cima ele não aparece. Use-o para agrupar, não para decorar. A terceira: **uma página tem um único `<main>`**: é o conteúdo que muda de uma página para outra, sem o cabeçalho nem o rodapé que se repetem.

A segunda página não fica mais bonita, e não precisa: o olho nunca foi o problema. Quem ouve a primeira sabe que há dois links e um monte de texto, e tem de adivinhar o resto. Quem ouve a segunda sabe onde está a cada momento.

**[Os títulos são um índice.](https://www.w3.org/WAI/tutorials/page-structure/headings/)** Quem usa um leitor de tela pode pedir a lista de títulos da página e lê-la como se lê o índice de um livro; também há extensões que o mostram a qualquer pessoa. Para que esse índice sirva, os níveis significam **hierarquia, não tamanho**: `<h1>` é o título da página (um só, o costume sólido ainda que o padrão permita mais), `<h2>` são as suas seções, `<h3>` as partes de uma seção. Não se pulam níveis: de um `<h2>` se desce a um `<h3>`, não a um `<h4>`, assim como um livro não passa do capítulo 1 para o item 1.1.1. Escolher `<h4>` porque “o h2 fica muito grande” é o erro mais comum do iniciante, e quem o resolve é o CSS da próxima lição, não o HTML. O validador do W3C avisa dos saltos. Você o verá na seção de erros.

Para deixar claro como fica o índice do painel que você vai construir, assim um leitor de tela o leria:

```text
nivel 1: Revisor de servicios
  nivel 2: Resumen
  nivel 2: Servicios
```

Curto, e suficiente. Se no futuro você adicionar o detalhe de um serviço dentro de “Servicios” (“Serviços”), essa parte seria um nível 3, e o índice continuaria coerente.

**O que o ARIA não é.** Provavelmente você já viu em algum código atributos como `role="button"` ou `aria-label="..."`. São **ARIA**, um conjunto de atributos que permite acrescentar significado a um elemento que não o tem. Existe para os casos que o HTML não cobre. A primeira regra dele, no [guia que o W3C mantém](https://www.w3.org/TR/using-aria/), diz que **se há um elemento HTML com o significado e o comportamento de que você precisa, você deve usá-lo**. Um `<button>` já traz o papel de botão, a possibilidade de receber o foco, a ativação com Enter e com a barra de espaço. Um `<div role="button">` só traz o papel: o resto você tem de escrever, e quase ninguém escreve completo. O [guia de práticas do ARIA](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/) resume isso numa frase que convém lembrar: *um papel é uma promessa*. Se você diz que algo é um botão, compromete-se a que se comporte como um. Por isso, neste curso, **nesta lição e na seguinte você não escreverá uma única linha de ARIA**: quase tudo o que o painel precisa o HTML nativo resolve, e onde o HTML não alcançar nós diremos no momento certo.

#### 2.1.4 Texto com significado: listas, dados e datas

Dentro das seções, o texto também se escolhe pelo que é. Há três formas de agrupar coisas parecidas, e cada uma significa algo diferente:

```html
<!-- fig02_04.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Resumen del revisor</title>
</head>
<body>
  <main>
    <h1>Resumen</h1>
    <p>Última revisión:
      <time datetime="2026-10-07T10:30:00-06:00">7 de octubre de 2026, 10:30</time>
    </p>

    <h2>Como lista de datos con nombre</h2>
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
    </dl>

    <h2>Como lista simple</h2>
    <ul>
      <li>Catálogo</li>
      <li>Pagos</li>
      <li>Inventario</li>
    </ul>

    <h2>Como lista con orden</h2>
    <ol>
      <li>Búsqueda: 950 ms</li>
      <li>Pagos: 480 ms</li>
      <li>Notificaciones: 310 ms</li>
    </ol>
  </main>
</body>
</html>
```

```text
Resumen

Última revisión: 7 de octubre de 2026, 10:30

Como lista de datos con nombre
Servicios revisados
5
Disponibles
4 de 5
Caídos
1
Como lista simple
Catálogo
Pagos
Inventario
Como lista con orden
Búsqueda: 950 ms
Pagos: 480 ms
Notificaciones: 310 ms
```

`<ul>` é uma **lista sem ordem**: itens que vão juntos mas que poderiam trocar de lugar. `<ol>` é uma **lista com ordem**: se você muda um item de lugar, muda o sentido (aqui, do mais lento ao mais rápido). `<dl>` é uma **[lista de descrição](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/dl)**: pares de nome e valor, como “Disponibles: 4 de 5” (“Disponíveis: 4 de 5”). É a forma correta do resumo do painel, e quase ninguém a usa; no lugar dela se veem `<div>` com texto em negrito que um leitor de tela não sabe que são um nome e o seu valor. No `<dl>`, cada nome é um `<dt>` e cada valor um `<dd>`; o padrão permite agrupá-los com um `<div>` quando você quer dar a eles um gancho para o estilo, como aqui.

Um detalhe que parece menor: o elemento [`<time>`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/time). Dentro leva o texto que a pessoa vê (“7 de octubre de 2026, 10:30”, ou seja, 7 de outubro de 2026, 10h30), mas o seu atributo `datetime` leva a mesma data no formato que uma máquina entende: ano, mês, dia, hora e deslocamento em relação ao UTC (`-06:00` é a hora do centro do México, que desde 2022 já não muda por horário de verão). O texto pode mudar de idioma ou de estilo e o dado fica intacto. Os buscadores, as extensões e, mais adiante, o seu próprio JavaScript podem lê-lo sem interpretar “7 de octubre”.

E uma pergunta que você fará em breve: por que não um `<br>` entre as linhas, ou espaços para recuar? Porque `<br>` significa “quebra de linha dentro de um mesmo parágrafo” (um poema, um endereço postal), não “um pouco mais de espaço”. O espaço é aparência e é trabalho do CSS. Toda vez que você usar uma marca de conteúdo para conseguir um efeito visual, está mentindo sobre o que algo é.

### 2.2 Dados em forma de tabela

#### 2.2.1 Quando uma tabela e quando não

Uma tabela é a ferramenta correta quando os dados têm **duas dimensões que se cruzam**: linhas que são coisas e colunas que são propriedades dessas coisas, e cada célula diz “esta propriedade, desta coisa”. O painel é justamente isso: cada serviço (linha) tem um estado e um tempo de resposta (colunas). Se os dados têm uma única dimensão, é uma lista. Se são pares de nome e valor, é um `<dl>`.

Houve uma época, há vinte anos, em que se usavam tabelas para organizar a página em colunas, porque não havia outra ferramenta. Hoje esse costume é um erro, por duas razões: o leitor de tela anuncia “tabela de três colunas” sobre algo que não é uma tabela, e o layout quebra num celular. A regra que não tem exceções é: **tabela para dados, nunca para organizar**. A organização é o tema da Lição 4.

#### 2.2.2 As peças de uma tabela acessível

Veja a tabela do painel, com três dos seus cinco serviços para não repetir:

```html
<!-- fig02_05.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Tabla de servicios</title>
</head>
<body>
  <main>
    <h1>Servicios</h1>
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
          <td>Disponible</td>
          <td>120 ms</td>
        </tr>
        <tr>
          <th scope="row">Pagos</th>
          <td>Disponible</td>
          <td>480 ms</td>
        </tr>
        <tr>
          <th scope="row">Inventario</th>
          <td>Caído</td>
          <td>sin respuesta</td>
        </tr>
      </tbody>
    </table>
  </main>
</body>
</html>
```

```text
Servicios
Estado de los servicios en la última revisión
Servicio	Estado	Tiempo de respuesta
Catálogo	Disponible	120 ms
Pagos	Disponible	480 ms
Inventario	Caído	sin respuesta
```

[Uma tabela se monta com peças aninhadas](https://www.w3.org/WAI/tutorials/tables/), e cada uma tem o seu trabalho:

- **`<table>`** envolve tudo.
- **`<caption>`** é o título da tabela. Vai como primeiro filho e é o que um leitor de tela anuncia ao chegar (“Estado de los servicios en la última revisión, tabla de 3 columnas y 3 filas”, isto é, “Estado dos serviços na última revisão, tabela de 3 colunas e 3 linhas”). É melhor que um título solto antes da tabela, porque fica unido a ela.
- **`<thead>` e `<tbody>`** separam a linha de títulos das linhas de dados. Mais adiante, o CSS pode dar estilo ao cabeçalho sem tocar o corpo, e o navegador pode repetir o cabeçalho em cada página ao imprimir.
- **`<tr>`** é uma linha.
- **`<th>`** é uma **célula de cabeçalho** e **`<td>`** uma célula de dado. Esta é a distinção que mais importa de toda a tabela.

E dentro de `<th>`, o atributo `scope` diz a que o cabeçalho aponta: `scope="col"` se encabeça uma coluna, `scope="row"` se encabeça uma linha. Na primeira linha os `<th>` intitulam colunas; nas demais, o primeiro `<th>` de cada linha é o nome do serviço e intitula a sua linha.

Para que tudo isso? Porque quem usa um leitor de tela não vê a tabela completa: move-se célula por célula com as setas, e em cada célula precisa saber a que ela corresponde. Com os `<th>` bem postos, ao chegar a “120 ms” o leitor anuncia “Catálogo, Tiempo de respuesta, 120 ms” (“Catálogo, Tempo de resposta, 120 ms”). Sem eles, só ouve “120 ms” e tem de lembrar em que linha e em que coluna estava. Se você puser `<td>` em vez de `<th>` no nome do serviço, a página parece igual e a experiência se quebra, e nenhum validador avisa. Essa é a razão por que esta lição insiste em que o HTML se **confere com ferramentas de acessibilidade e com o teclado**, não só olhando para ele.

#### 2.2.3 Uma célula vazia mente

Olhe a última linha: o serviço `Inventario` está fora do ar e por isso não tem tempo de resposta. O que você põe nessa célula? Há três tentações, e duas estão erradas. Deixá-la vazia faz o leitor de tela anunciar “em branco”, sem dizer se é um esquecimento ou uma ausência. Pôr `0 ms` é pior: é um dado falso, porque um serviço que não respondeu não respondeu em zero milissegundos, e isso arruinaria depois a média. O honesto é dizer o que aconteceu: “sin respuesta” (“sem resposta”). É um texto, não um número, e essa decisão (o tempo de resposta pode **não existir**) volta quando você calcular a média na Lição 6.

### 2.3 Controles: botão, link e rótulo

#### 2.3.1 Um link vai a um lugar; um botão faz algo

Com a tecla Tab percorrem-se os elementos com os quais o usuário pode interagir, e a página seguinte é um experimento que vale a pena fazer com as mãos:

```html
<!-- fig02_06.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Cuatro cosas que parecen controles</title>
</head>
<body>
  <main>
    <h1>Cuatro cosas que parecen controles</h1>
    <p><a href="#result">Ir al resultado</a></p>
    <p><button type="button">Revisar ahora</button></p>
    <div>Revisar ahora</div>
    <span>Ir al resultado</span>
    <p id="result">Aquí termina la página.</p>
  </main>
</body>
</html>
```

```text
Cuatro cosas que parecen controles
Ir al resultado
Revisar ahora
Revisar ahora
Ir al resultado
Aquí termina la página.
```

Abra-a e pressione Tab repetidamente. Conferi esse experimento com o Chrome 154: **a tecla para só duas vezes**, no link e no botão, e depois sai da página. O `<div>` com o texto “Revisar ahora” (“Revisar agora”) e o `<span>` com “Ir al resultado” (“Ir ao resultado”) **não recebem o foco**. Para o teclado, não existem. Com o CSS da Lição 3 você poderia fazer que parecessem idênticos a um botão e a um link, e continuariam inalcançáveis sem mouse, e para o leitor de tela continuariam sendo texto.

Veja o que você recebe de graça com cada elemento verdadeiro:

- **`<a href="...">`** é um **link**: promete levar você a outro lugar (outra página, ou outra parte da mesma, como `#result`). De graça traz foco com Tab, ativação com Enter, clique com o botão direito para copiar o endereço, clique com a roda para abri-lo em outra aba e a possibilidade de lembrar quais links você visitou. Sem `href` o `<a>` não é um link: é um marcador sem destino.
- **`<button>`** é um **botão**: promete fazer algo nesta página. Traz foco, ativação com Enter e com a barra de espaço, e o estado de “desabilitado” com o atributo `disabled`.

A regra que resume os dois: **se a ação leva a outro endereço, é um link; se muda algo aqui mesmo, é um botão.** “Ir a Servicios” é um link. “Revisar ahora” é um botão. Errar produz esquisitices que você já terá visto: um “botão” que é um link e não se ativa com a barra de espaço, ou um “link” que é um botão e não se pode abrir em outra aba.

Uma nota sobre `type="button"`. Quando um `<button>` está dentro de um formulário (você verá na Lição 10) e não declara tipo, [o padrão](https://html.spec.whatwg.org/multipage/forms.html) atribui a ele `submit`: envia o formulário e recarrega a página. É uma das surpresas mais frequentes. Declarar `type="button"` em todo botão que não envia nada poupa você dela. Hoje o botão “Revisar ahora” não faz nada, porque a página ainda não tem JavaScript. Na Lição 8 ele voltará a pedir os dados do painel, e para isso o HTML que você escreve hoje só precisará de mais um `id`.

#### 2.3.2 Um campo sem rótulo é um campo sem nome

O último controle de hoje é o campo de busca. A regra é simples e se quebra sempre: **cada campo precisa de um rótulo visível e associado**. “Associado” quer dizer que o navegador sabe que aquele texto pertence àquele campo. Há duas maneiras de associá-lo e as duas estão na página seguinte:

```html
<!-- fig02_07.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Etiquetas y grupos</title>
</head>
<body>
  <main>
    <h1>Etiquetas y grupos</h1>

    <p>
      <label for="search">Buscar servicio</label>
      <input type="search" id="search" name="search">
    </p>

    <p>
      <label>
        Nombre del servicio
        <input type="text" name="name">
      </label>
    </p>

    <fieldset>
      <legend>Mostrar</legend>
      <label><input type="radio" name="filter" value="all" checked> Todos</label>
      <label><input type="radio" name="filter" value="available"> Disponibles</label>
      <label><input type="radio" name="filter" value="down"> Caídos</label>
    </fieldset>
  </main>
</body>
</html>
```

```text
Etiquetas y grupos

Buscar servicio 

Nombre del servicio 

Mostrar
 Todos  Disponibles  Caídos
```

A primeira é a **[associação explícita](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/label)**: o `<label>` leva `for="search"` e o campo leva `id="search"`; o valor de `for` é o `id` do campo, e essa coincidência é a união. A segunda é a **associação implícita**: o campo vai dentro do `<label>` e não é preciso nenhum `id`. As duas funcionam; a explícita é mais flexível porque o rótulo e o campo podem estar em lugares diferentes do documento, e a implícita é mais curta. Para conferir que a união é real, clique sobre o texto “Buscar servicio” (“Buscar serviço”): o cursor salta para o campo. Conferi automatizando esse clique no Chrome, e o campo recebe o foco. Esse é um ganho visível: um alvo de clique muito maior para quem tem pouca pontaria, ou toca com o dedo.

Por trás acontece algo que convém nomear. Todo elemento interativo tem um **[nome acessível](https://developer.mozilla.org/en-US/docs/Glossary/Accessible_name)**: o texto com que um leitor de tela o anuncia. O navegador o calcula com regras fixas, e para um campo o rótulo associado é a fonte principal. Na árvore de acessibilidade do Chrome, o campo de cima aparece como `searchbox "Buscar servicio"`: um papel e um nome. Se não houvesse rótulo (nem outra pista de que extrair um nome), apareceria `searchbox` e mais nada: uma caixa sem nome. E uma ferramenta de auditoria, como as que você verá mais adiante, o marca com a mensagem *“Form elements must have labels”*.

**O `placeholder` não é um rótulo.** É aquela dica cinza que aparece dentro do campo e some ao escrever. A tentação de usá-lo como rótulo é forte porque economiza espaço, mas falha por três lados: desaparece justamente quando você precisa lembrar o que tinha de escrever, a sua cor cinza costuma ter pouco contraste com o fundo, e não é um rótulo para o navegador: não cria nenhuma associação e não se pode clicar nele para chegar ao campo. O navegador só o toma como nome de reserva quando não há rótulo; medi no Chrome 154, e um campo de busca sem `<label>` e com `placeholder="Buscar servicio"` é anunciado como `searchbox "Buscar servicio"`. É um remendo do navegador, não um rótulo que a pessoa possa ver. Use-o, quando muito, para um exemplo de formato (`ej. catalogo`, ou seja, “p. ex. catalogo”), nunca como único nome.

A terceira peça é o **grupo**. Três botões de rádio (“Todos”, “Disponibles”, “Caídos”, isto é, “Todos”, “Disponíveis”, “Fora do ar”) formam uma única pergunta: *o que você quer mostrar?* O `<fieldset>` agrupa os controles que vão juntos e o `<legend>` é o título do grupo, que o leitor de tela anuncia antes de cada opção. Os rádios que compartilham o mesmo `name` já se comportam como um grupo para o navegador: só um pode estar marcado. E por isso, no experimento da tecla Tab, **o grupo inteiro conta como uma única parada**; entra-se com Tab e muda-se de opção com as setas. Medi no painel completo: a tecla Tab para cinco vezes (dois links, o campo de busca, o grupo de rádios e o botão).

Repare numa decisão de design: o filtro é um grupo de rádios e não três botões. É uma escolha entre opções excludentes, que é justamente o que significa um botão de rádio. Quem lê o código entende a intenção sem um comentário.

#### 2.3.3 Quando usar, sim, `div` e `span`

Depois de tanto elogio ao significado, um esclarecimento: `<div>` e `<span>` não são ruins. São os elementos que **não significam nada**, e isso é útil quando você precisa agrupar algo só para dar estilo a ele ou para encontrá-lo depois com JavaScript. `<div>` agrupa em bloco e `<span>` agrupa dentro de uma linha. A regra é de ordem: **primeiro procure o elemento com significado; só se não existir, use `div` ou `span`**. Na maioria das páginas que você vê, ocorre o contrário.

Você verá um `<span class="status status-available">` dentro da tabela do painel. Serve para isto: o estado “Disponible” (“Disponível”) não é outra coisa que texto, mas precisamos de um lugar onde o CSS da próxima lição ponha um selo de cor. É o atributo `class` que você conheceu em 2.1.1: um nome para o CSS apontar, que não muda o que o elemento significa.

## Exemplo resolvido: o painel completo

Você já conhece todas as peças. Esta é a página que as junta, o esqueleto do `revisor`, com cinco serviços de exemplo. Salve-a como `index.html` na sua pasta `revisor`, no lugar do `index.html` da Lição 1: a partir de hoje, esse arquivo é o painel, e as lições seguintes vão fazê-lo crescer. Leia-a de cima para baixo com o mapa na cabeça: o que é cada coisa, por que esse elemento e não outro.

```html
<!-- fig02_08.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Revisor de servicios</title>
  <link rel="icon" href="data:,">
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

```text
Revisor de servicios

Última revisión: 7 de octubre de 2026, 10:30

Ir a: Resumen o Servicios

Resumen
Servicios revisados
5
Disponibles
4 de 5
Caídos
1
Respuesta promedio
465 ms
Servicios

Buscar servicio 

Mostrar
 Todos  Disponibles  Caídos

Revisar ahora

Estado de los servicios en la última revisión
Servicio	Estado	Tiempo de respuesta
Catálogo	Disponible	120 ms
Pagos	Disponible	480 ms
Inventario	Caído	sin respuesta
Notificaciones	Disponible	310 ms
Búsqueda	Disponible	950 ms

Datos de ejemplo escritos a mano.
```

Percorra as decisões, porque ali está o que se aprende:

- **O ícone vazio** (`<link rel="icon" href="data:,">`) é a linha do Exercício 2 da Lição 1: diz ao navegador que a página não tem ícone, para que ele não peça `/favicon.ico` e não suje o console com um 404. É um atalho, e tem um custo que você verá na Lição 11, quando o painel for publicado com uma política de segurança e este ícone for trocado por um de verdade.
- **O cabeçalho da página** (`<header>`) agrupa o título, a data da última revisão e a navegação. Por pender do `<body>` é o `banner`. O título é o único `<h1>`.
- **A navegação** (`<nav>`) tem dois links, porque levam a outras partes da página: isso é o que um link faz. Estão escritos dentro de uma frase (“Ir a: … o …”, isto é, “Ir para: … ou …”); as diretrizes de acessibilidade pedem que os alvos de toque tenham ao menos 24 × 24 pixels ou espaço suficiente ao redor ([WCAG 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)), e excetuam expressamente os links que vão dentro de uma frase, porque o tamanho deles é imposto pela linha de texto. Escrevê-los numa frase não os torna maiores: separa-os com palavras e os deixa dentro dessa exceção, sem uma linha de CSS. Dois links soltos, um junto do outro, não teriam nenhuma das duas coisas. Na Lição 4 você verá um menu de verdade.
- **O resumo** é um `<dl>`: nomes e valores. Repare na conta, porque ela volta a ser usada: são 5 serviços, 4 disponíveis e 1 fora do ar; a resposta média de 465 ms é a média dos **quatro que responderam** (120 + 480 + 310 + 950 = 1,860; 1,860 / 4 = 465). O serviço fora do ar não conta como zero.
- **Os controles** são os três que você conhece: um campo com rótulo, um grupo de rádios com título e um botão de tipo explícito. Nenhum está dentro de um formulário ainda; o formulário, com envio e validação, é o tema da Lição 10.
- **A tabela** leva título, cabeçalhos de coluna e de linha, e uma célula que diz a verdade sobre o serviço fora do ar.
- **O rodapé** (`<footer>`) diz de onde saem os dados: de exemplo e escritos à mão.

Agora faça o que nenhum leitor deste código faz: **use-a como a usariam as outras três pessoas do início**. Pressione Tab desde o começo e conte as paradas: devem ser cinco, e o foco deve ir em ordem de cima para baixo. Abra o painel de acessibilidade das ferramentas do navegador e confira que você vê `banner`, `main` e `contentinfo`. Passe a página pelo validador oficial, como se explica na seção seguinte. Se as três provas saírem bem, o seu HTML faz o que diz.

## O erro que você vai ver

Os erros de HTML quase nunca são mostrados pelo navegador. Quem os mostra é um validador. O do W3C se chama [*Nu Html Checker*](https://validator.w3.org/nu/) e vive em `https://validator.w3.org/nu/`; ali você pode enviar um arquivo ou colar o código numa caixa de texto. De propósito, vamos quebrar a página para aprender a ler a resposta dele. Esta tem seis defeitos:

```html
<!-- fig02_09.html -->
<html>
<head>
  <title>Revisor roto</title>
</head>
<body>
  <h1>Revisor de servicios</h1>
  <h4>Servicios</h4>
  <input type="search" placeholder="Buscar servicio">
  <a href="#result"><button>Revisar ahora</button></a>
  <img src="logo.png">
  <p id="result">
    <div>4 de 5 disponibles</div>
  </p>
</body>
</html>
```

Ao colá-la no validador, ele responde isto (copiado do resultado real):

```text
Error: Start tag seen without seeing a doctype first. Expected “<!DOCTYPE html>”.
From line 1, column 23; to line 2, column 6
Error: The element “button” must not appear as a descendant of the “a” element.
From line 10, column 21; to line 10, column 28
Error: An “img” element must have an “alt” attribute, except under certain conditions. For details, consult guidance on providing text alternatives for images.
From line 11, column 3; to line 11, column 22
Error: No “p” element in scope but a “p” end tag seen.
From line 14, column 3; to line 14, column 6
Warning: Consider adding a “lang” attribute to the “html” start tag to declare the language of this document.
From line 1, column 23; to line 2, column 6
Error: The heading “h4” (with computed level 4) follows the heading “h1” (with computed level 1), skipping 2 heading levels.
From line 8, column 3; to line 8, column 6
There were errors.
```

Está em inglês, e é o inglês da documentação que você lerá a carreira inteira, então vale a pena aprender a lê-lo. Cada mensagem traz a linha e a coluna onde ocorre. Uma por uma:

1. **Falta o `DOCTYPE`.** Você já sabe por que importa: sem ele o navegador entra em modo de compatibilidade. Corrige-se escrevendo `<!DOCTYPE html>` como primeira linha.
2. **Um `<button>` dentro de um `<a>`.** É um erro comum e tem uma razão: um elemento interativo não pode viver dentro de outro. O que se ativa ao clicar, o botão ou o link? Os navegadores não entram em acordo. Escolhe-se um: se o controle leva a outro lugar, um link; se faz algo aqui, um botão.
3. **Uma `<img>` sem `alt`.** O atributo [`alt`](https://www.w3.org/WAI/tutorials/images/decision-tree/) é o texto que o leitor de tela lê no lugar da imagem. Se a imagem traz informação, o `alt` a descreve; se é só enfeite, põe-se vazio (`alt=""`) para que seja ignorada. Nunca se omite. O painel não tem imagens, e mesmo assim este é o erro mais frequente da web, por isso o incluí.
4. **Um `</p>` sem o seu `<p>`.** É a consequência de uma regra do HTML: um `<p>` só pode conter texto e elementos de linha, não um `<div>`. O navegador fecha o parágrafo antes do `<div>` por conta própria, e a tag de fechamento que você escreveu fica órfã. Por isso a mensagem diz “não há nenhum p aberto”: quem o fechou foi o navegador, sem avisar você.
5. **Falta `lang`.** Aparece como advertência, não como erro, mas você já sabe o que custa.
6. **O `<h4>` depois do `<h1>`.** O validador fez a conta: saltou dois níveis. Você corrige com `<h2>`.

Repare no que ele **não** disse. O `<input>` sem rótulo, com só um `placeholder`, passou sem aviso: o validador confere que a sintaxe seja legal, não que a página seja utilizável. Isso é detectado por outras ferramentas, as de auditoria de acessibilidade. O navegador traz uma nas suas ferramentas de desenvolvimento (no Chrome se chama Lighthouse), e quase todas se apoiam num motor chamado axe, que sobre esta mesma página responde, entre outras coisas, com estas mensagens reais:

```text
heading-order: Heading levels should only increase by one
html-has-lang: <html> element must have a lang attribute
image-alt: Images must have alternative text
```

E sobre uma variante do painel com o `<label>` removido, `label: Form elements must have labels`. **Os dois tipos de ferramenta são complementares**: o validador pega o que o padrão proíbe e a auditoria pega o que deixa alguém sem poder usar a página. Há um terceiro tipo de erro que nenhuma das duas pega: trocar um `<th>` por um `<td>` não produz mensagem alguma, embora quebre o anúncio da tabela. Para esse, só serve testar com o teclado e com a árvore de acessibilidade.

## O que se faz errado

**1. Construir controles com `div` ou `span`.** O caso da página das quatro coisas: um `<div>` que diz “Revisar ahora”. *Custo:* ninguém com teclado o alcança, nenhum leitor de tela o anuncia como botão, e reconstruir o foco, a barra de espaço e o estado desabilitado à mão é trabalho que o navegador já fez. Correção: um `<button type="button">`.

**2. Escolher o título pelo seu tamanho.** Um `<h4>` porque o `<h2>` “fica grande”, ou um `<p>` em negrito porque “já é um título”. *Custo:* o índice de títulos fica cheio de buracos ou vazio, e quem navega por títulos não encontra nada. Correção: escolha o nível pela hierarquia; o tamanho é do CSS.

**3. Usar tabelas para organizar a página.** *Custo:* o leitor de tela anuncia tabelas onde não há dados, a página não se adapta a um celular e o código é difícil de ler. Correção: tabela só para dados com linhas e colunas que se cruzam.

**4. Todas as células como `<td>`.** O caso mais difícil de ver, porque a página fica perfeita. *Custo:* o leitor de tela anuncia “120 ms” sem dizer de quem nem de quê. Correção: `<th scope="col">` nos títulos de coluna e `<th scope="row">` no nome da linha.

**5. O `placeholder` como único rótulo.** *Custo:* a dica desaparece ao escrever, costuma ter pouco contraste e o campo depende de um nome de reserva que a pessoa deixa de ver assim que escreve. Correção: um `<label>` visível, associado com `for` e `id` ou envolvendo o campo.

**6. Um link que faz de botão, ou um botão que faz de link.** Um `<a href="#">` que dispara uma ação, ou um `<button>` que navega. *Custo:* quebram-se o clique com a roda, a barra de espaço, a cópia do endereço, o histórico. Correção: “vai a um lugar” é link, “faz algo” é botão.

**7. `<br>` e `&nbsp;` para dar espaço.** *Custo:* um leitor de tela pode ler “linha em branco” ou saltos que não significam nada, e o espaço fica atado ao texto. Correção: o espaço é do CSS.

**8. Não pôr `alt` em uma imagem.** *Custo:* a imagem é invisível para quem não a vê. Correção: `alt` que diga que função a imagem cumpre, ou `alt=""` se é puro enfeite.

## Exercícios

### Exercício 1 — Conte as paradas

Com o painel completo aberto no seu servidor local, solte o mouse e use só o teclado. Pressione Tab desde o início e anote, em ordem, em que o foco para cada vez. Depois troque `<button type="button">` por `<div>` na sua cópia, recarregue e conte de novo. Quantas paradas a menos você tem? O que deixou de ser possível?

### Exercício 2 — De `div` a significado

Este fragmento mostra um “cartão” de um serviço escrito só com `div` e `span`. Reescreva-o com os elementos que dizem o que é cada coisa, sem mudar o texto que se lê:

```html
<div class="card">
  <div class="card-title">Pagos</div>
  <div class="card-row"><span>Estado</span> <span>Disponible</span></div>
  <div class="card-row"><span>Respuesta</span> <span>480 ms</span></div>
  <div class="card-action" onclick="check()">Revisar este servicio</div>
</div>
```

Uma dica: são dois pares de nome e valor, uma ação e um título que merece um elemento de título.

### Exercício 3 — Adicione um serviço e refaça as contas

Adicione ao painel um sexto serviço, `Correo`, disponível e com 210 ms de resposta. Depois atualize o resumo à mão: quantos serviços há, quantos estão disponíveis, quantos fora do ar e qual é a resposta média. Lembre de quais serviços se calcula a média.

### Exercício 4 — Quebre três coisas e veja quais se notam

Numa cópia do painel faça três mudanças: tire o `<label>` do campo de busca, troque o segundo `<h2>` por um `<h4>` e troque o `<th scope="row">Pagos</th>` por `<td>Pagos</td>`. Passe a cópia pelo validador oficial. Quais dos três defeitos ele aponta? Para os que ele não aponta, como você os descobriria?

## Soluções

### Solução 1

Com o botão real, o foco para cinco vezes, nesta ordem: o link “Resumen”, o link “Servicios”, o campo de busca, o grupo de rádios (uma única parada, e dentro dele se muda com as setas) e o botão “Revisar ahora”. Depois o foco sai da página rumo à barra do navegador. Com o `<div>` ficam **quatro** paradas, uma a menos: o botão deixou de receber o foco, então **já não se pode ativar sem mouse**. Essa é a diferença entre um controle e algo que parece um controle.

### Solução 2

O título é um elemento de título (`<h3>`, porque pende da seção “Servicios”, que é de nível 2), os dois pares de nome e valor são uma lista de descrição, e a ação é um botão. Como o `onclick` é JavaScript dentro do HTML e ainda não o usamos, ele é retirado: quem escuta o clique se verá na Lição 7.

```html
<article>
  <h3>Pagos</h3>
  <dl>
    <div>
      <dt>Estado</dt>
      <dd>Disponible</dd>
    </div>
    <div>
      <dt>Respuesta</dt>
      <dd>480 ms</dd>
    </div>
  </dl>
  <button type="button">Revisar este servicio</button>
</article>
```

Usou-se `<article>` porque o cartão é uma unidade com sentido próprio, que seria entendida solta em outra página; um `<div>` também seria válido se você não quiser declarar essa ideia. O que não é válido é deixar o título como um `<div>` ou a ação como um `<div>`.

### Solução 3

Com o sexto serviço, o resumo fica assim: **6** serviços revisados, **5 de 6** disponíveis, **1** fora do ar. A resposta média é calculada com os cinco que responderam: 120 + 480 + 310 + 950 + 210 = 2,070, e 2,070 / 5 = **414 ms**. O serviço fora do ar continua sem entrar na média, porque não tem tempo de resposta. A linha nova respeita a estrutura das demais:

```html
<tr>
  <th scope="row">Correo</th>
  <td><span class="status status-available">Disponible</span></td>
  <td>210 ms</td>
</tr>
```

Se você calculou 345 ms (2,070 / 6), contou o que está fora do ar como se tivesse respondido em zero, que é exatamente o erro que a seção 2.2.3 descreve.

### Solução 4

O validador aponta **só um**: o `<h4>` depois do `<h2>`, com a mensagem *“The heading “h4” (with computed level 4) follows the heading “h2” (with computed level 2), skipping 1 heading level”* (conferi com uma cópia real do painel). O `<label>` ausente ele não aponta, porque um campo sem rótulo é HTML legal; você o descobriria com uma ferramenta de auditoria, que responde *“Form elements must have labels”*, ou com a árvore de acessibilidade, onde o campo aparece sem nome. O `<td>` no lugar do `<th>` não é apontado por nenhuma das duas ferramentas: descobre-se com a árvore de acessibilidade (o nome da linha já não se associa às células) ou, melhor, escutando a tabela com um leitor de tela. Moral da história: passar pelo validador é necessário e não é suficiente.

## Como sei que consegui

- [ ] O painel abre em `http://localhost:8000/` servido com `python3 -m http.server 8000 --bind 127.0.0.1`, sem erros na aba do console das ferramentas do navegador.
- [ ] A tecla Tab para exatamente cinco vezes dentro da página (dois links, o campo, o grupo de rádios e o botão), em ordem de cima para baixo.
- [ ] O painel de acessibilidade das ferramentas do navegador mostra `banner`, `navigation`, `main` e `contentinfo`, e os títulos saem na ordem 1, 2, 2.
- [ ] Ao colar a página em `https://validator.w3.org/nu/` a resposta é *“Document checking completed. No errors or warnings to show.”*
- [ ] Ao clicar sobre o texto “Buscar servicio” o cursor salta para o campo de busca.
- [ ] Você consegue explicar com as suas palavras por que um `<div>` que diz “Revisar ahora” não é um botão, e por que `120 ms` sem o seu `<th>` é um dado órfão.

## Para ler mais

- (em inglês, como quase toda a documentação oficial) [Padrão HTML do WHATWG, “Sections”](https://html.spec.whatwg.org/multipage/sections.html) — a fonte que decide o que significam `<header>`, `<nav>`, `<main>`, `<section>` e `<footer>`, e quando cada um é um ponto de referência. Consultado em 7 de outubro de 2026.
- [MDN, “Estruturando conteúdo com HTML”](https://developer.mozilla.org/pt-BR/docs/Learn_web_development/Core/Structuring_content) — o módulo de aprendizado da Mozilla que segue a mesma ordem desta lição, com desafios práticos de tabelas e de estrutura. Consultado em 7 de outubro de 2026.
- [W3C WAI, tutorial de tabelas](https://www.w3.org/WAI/tutorials/tables/) — como se constroem tabelas que um leitor de tela consegue percorrer, com exemplos de cabeçalhos simples e complexos. Consultado em 7 de outubro de 2026.
- [W3C WAI, “Notas sobre o uso de ARIA em HTML”](https://www.w3.org/TR/using-aria/) — o guia das regras do ARIA, começando por “se existe um elemento HTML nativo, use-o”. Consultado em 7 de outubro de 2026.
