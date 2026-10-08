# Lesson 2 — HTML with meaning

**Time:** two sessions of about 90 minutes. A split that works: the first one, “The why before the how”, the document and the elements with meaning (2.1) and the table (2.2); the second one, the controls (2.3), the complete dashboard written by hand, “The error you will see” and the exercises. Each session ends in a page that you can open and validate.

**What you build:** the skeleton of the `revisor` dashboard, written by hand

**What you learn:** choosing the element for what it means and not for how it looks; headings, tables, buttons, links and labels

**The pages of this lesson.** All the figures are in [`programas/02-html-con-significado/`](https://github.com/HabilMX/curso-web/tree/main/programas/02-html-con-significado) of the [course repository](https://github.com/HabilMX/curso-web), each with its expected output next to it. Open them with the local server you started in Lesson 1.

## By the end you will be able to

- Write a complete HTML document from scratch and explain what each line of its head is for: `<!DOCTYPE html>`, `lang`, `charset`, `viewport` and `<title>`.
- Choose between `<header>`, `<nav>`, `<main>`, `<section>` and `<footer>` instead of a `<div>`, and say what whoever uses the page gains from it.
- Build an accessible table, with a caption, column headers and row headers, and decide when a piece of data deserves not a table but a list.
- Tell a link from a button by what each one promises, and check it with the Tab key.
- Associate each field with its label in the two ways that exist (explicit and implicit), group options with `<fieldset>` and `<legend>`, and explain why a `placeholder` is not a label.
- Run a page through the official validator, read its messages and fix what they point out.

## The why before the how

Imagine you hand the dashboard to four different people. The first opens it on a big screen and handles it with the mouse: for them almost any page works, because they see the result. The second has an injured wrist and handles everything with the keyboard: they move forward with the Tab key and activates with Enter. The third is a blind person who listens to it with a screen reader, a program that reads aloud what is on the page and lets you jump from one heading to another. The fourth is not a person: it is the search engine that is going to decide what your page says in its results.

The last three have something in common: **they do not look at pixels, they read the structure**. The keyboard needs to know which things can be activated. The screen reader needs to know what a heading is, what a table is, what a button is. The search engine needs to know what the main content is and what the footer is. And all of that is given by the HTML, not by color or font size.

That is why this lesson is called “HTML with meaning”. HTML is not “the language that draws the page”: it is the language that **says what each thing is**. Drawing it is the job of CSS, which you will see in Lesson 3; making it react is the job of JavaScript, starting with Lesson 6. Today you will not write a single style rule, and that is on purpose: the page will come out ugly, with the browser's default appearance, and even so it will be usable by all four people. A page that is only usable when it is pretty is not finished, it is just wearing makeup.

What is missing today is concrete: the `revisor` does not exist yet. By the end of this lesson you will have its complete skeleton: a header, a summary, a search field, a filter, a button and a table with five services, all written by hand with sample data. It does not filter or search anything yet: that comes later. What it will have from today is a structure that does not need to be redone afterwards. The order of the lesson is this: first the document and the elements that give structure (section 2.1), then data in the shape of a table (2.2) and at the end the controls, which are buttons, links and labels (2.3). Each section ends in a page you can open and try.

## The concepts

Start by saving today's work in your project folder, the same one where you left the first `index.html` in [Lesson 1](01-entorno-ciclo-trabajo.md). From that folder start the local server with `python3 -m http.server 8000 --bind 127.0.0.1`, as in Lesson 1, and open `http://localhost:8000/` in the browser every time you save a change. If the page did not change, reload with Ctrl+Shift+R, which ignores what the browser had stored.

### 2.1 The document and the elements with meaning

#### 2.1.1 What an element is

An HTML document is text with marks. Each mark is called a **tag** and almost always comes in a pair: an opening one, like `<h1>`, and a closing one, like `</h1>`. What lies between the two is the content. The complete pair, with its content, is called an **element**. By writing `<h1>Revisor de servicios</h1>` you have created an element that says: “this is a first-level heading, and its text is 'Revisor de servicios'”.

Some tags carry **attributes**, which are extra data of the form `name="value"` inside the opening tag. In `<a href="#services">` the attribute is `href` and its value is `#services`. An attribute you will see on almost every page today is **`id`**: it gives an element a name that cannot be repeated in the document, such as `id="services"`. A link whose `href` starts with `#` leads to the part of the same page that has that `id`: `<a href="#services">` jumps to the element with `id="services"`. Later, CSS and JavaScript will use that same name to find the element. Another frequent attribute is **`class`**: it also gives the element a name, but unlike `id` it can be repeated across many elements, and one element can carry several separated by spaces (`class="status status-available"`). It is there so CSS can give the same appearance to all those that carry it; **it does not change what the element means**, and that is why a `<div class="title">` is still a box without meaning, even if its name says “title”. Some elements have no content and so carry no closing tag; they are called **empty elements**: `<meta>`, `<input>` and `<img>` are the ones you will see today.

When the browser receives your file it does not “draw” it directly. It reads it from top to bottom and builds with it a structure in memory shaped like a tree: the document is the root, inside go `<head>` and `<body>`, inside `<body>` go the headings, the paragraphs, the table, and so on. That tree is called the **DOM** (Document Object Model) and will come back in Lesson 7, where JavaScript will walk through it and change it. For now it is enough for you to know that what the browser shows, what the keyboard walks through and what the screen reader reads come out of that tree, not out of your text file.

An uncomfortable consequence: **the browser forgives almost everything**. If you forget to close a paragraph or put an element where it does not go, it does not warn you; it guesses what you meant with some [very precise rules written in the specification](https://html.spec.whatwg.org/multipage/parsing.html) and builds the tree as best it can. That is good for whoever visits a badly written page, but bad for whoever writes it: the error is not seen, it is only noticed afterwards, in another browser or with another kind of user. That is why in this lesson you will use a validator, a program that checks your HTML against the standard's rules and tells you what the browser kept quiet about.

#### 2.1.2 The minimum of a complete document

This is the smallest page that is complete. Save it as `pagina.html` in your folder and open it:

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

The block below is what the page shows when loaded, reduced to its text. (The paragraph reads “This is the smallest page that is complete.”) The important part is in the lines above that are not seen. Each one exists for a concrete reason.

**`<!DOCTYPE html>`** always goes first. It looks like a tag, but it is a declaration: it tells the browser “this page follows the current standard”. Without it, browsers enter what they call **[quirks mode](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Quirks_mode_and_standards_mode)**: they imitate the mistakes of browsers from twenty-five years ago so that old pages keep looking the way they used to, and several size-calculation rules change silently. Whoever forgets the `DOCTYPE` does not get an error: they get a page that looks slightly different and do not know why. Always write it, exactly as it is.

**`<html lang="es">`** is the root of the document and declares the language. It seems like a courtesy detail and it is not. The screen reader uses it to choose the voice and the pronunciation: without `lang`, it may read your Spanish text with English rules, and the result is incomprehensible. The browser uses it to offer to translate the page and to choose the quotation marks of the `<q>` element according to the language, and CSS uses it to know with which dictionary to break hyphenated words at the end of the line when you ask for it with `hyphens: auto` (by default it breaks none; I checked it in Chrome 154). It is, besides, an accessibility criterion with a name and number in the W3C guidelines ([WCAG 3.1.1, “Language of Page”](https://www.w3.org/WAI/WCAG22/Understanding/language-of-page.html)). The value `es` means Spanish; if someday you need Mexican Spanish in particular, it is written `es-MX`.

**`<meta charset="utf-8">`** says with which character code the file is stored. UTF-8 is the one that represents ñ, accents and the opening signs (¿ ¡) without problems. If you omit it and your editor saved in UTF-8, you may see “CatÃ¡logo” instead of “Catálogo”: the browser guessed another encoding. The [specification](https://html.spec.whatwg.org/multipage/semantics.html) also asks that this line appear completely within the first 1,024 bytes of the file, so it goes at the beginning of the `<head>`, before the title.

**`<meta name="viewport" content="width=device-width, initial-scale=1">`** is the line most often forgotten and the one that hurts most on a phone. Mobile browsers were born in a world of pages made for desktops, and in order not to break them they pretend by default that the screen is much wider than it is (on the order of 980 px) and then shrink it so it fits. With this line you tell it “do not pretend: use the real width of the device and a scale of 1”. Without it, Lesson 5 cannot work, because no adaptive design adapts to a width that the browser is lying about.

**`<title>`** is the document's title, which is not the same as the `<h1>` heading. It appears in the tab, in the history, in the bookmarks and, above all, it is **the first thing a screen reader announces when opening the page** and what almost all search engines show as the result's title. Another accessibility guideline requires it by name ([WCAG 2.4.2, “Page Titled”](https://www.w3.org/WAI/WCAG22/Understanding/page-titled.html)). A title such as “Untitled document” or “index” is a page without a name. Write one that says which page it is.

Also notice, in the page above, what is inside `<body>`: a `<main>` that wraps everything. It is the first element with meaning that you meet, and the next section is about them.

#### 2.1.3 Meaning: the difference between a `div` and a `main`

Here is the central idea of the lesson, and it is worth seeing with a contrast. The two following pages say exactly the same thing and, with the default appearance, look almost the same. The first uses only `<div>`:

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

The second uses the elements that say what each thing is:

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

(The text of both pages reads: “Services checker”, “Summary”, “Services”, “4 of 5 services available.”, “Catalog, Payments, Inventory, Notifications and Search.” and “Sample data written by hand.”)

To see the difference there is no need to look at the screen. Open the browser's developer tools (the F12 key, or right-click and “Inspect”), go to the elements tab and look for the **accessibility** panel: Chrome shows it next to the styles, and Firefox brings it as a tab of its own. There appears the **[accessibility tree](https://www.w3.org/TR/html-aam-1.0/)**, which is what the browser hands to screen readers. I measured it with Chrome 154 on both pages. From the first, these are the only things it recognizes: two links and a lot of loose text. From the second, this:

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

Each word on the left is a **role**: what the thing is. `<header>` at the top level of `<body>` becomes a `banner`, `<nav>` a `navigation`, `<main>` a `main`, `<footer>` a `contentinfo`. Screen readers let you [jump directly](https://www.w3.org/WAI/tutorials/page-structure/) from one to another (“go to the main content”, “list the headings”). On the first page, whoever does not see the screen has to listen to everything in order, from the beginning, every time they come in. On the second, they jump to `main` and start reading.

That is **meaning** (the guidelines call it [info and relationships](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html)): the page says, with the element's name, what role each piece plays. Three clarifications avoid the most common mistakes.

The first: **`<header>` and `<footer>` are only `banner` and `contentinfo` when they belong to the whole page**, that is, when they are not inside a `<main>`, `<section>`, `<article>`, `<aside>` or `<nav>`. It makes no difference if they are inside a `<div>`: I measured it in Chrome 154, and a `<header>` inside a `<div>` is still a `banner`, while one inside `<main>` stops being one. Inside a `<section>` or an `<article>` they are the header or footer of that part, not of the page, and the browser treats them so. (An **`<article>`** is a block with meaning of its own, which would be understood loose on another page: a news item, a comment, a service's card. You will use it in the second exercise.) The second: **a `<section>` without a name is not a landmark**. It groups content of one topic, and the convention is that it starts with a heading, but it only becomes a navigable region if you give it a name, and that needs ARIA attributes that we do not see yet. That is why it does not appear in the tree above. Use it to group, not to decorate. The third: **a page has a single `<main>`**: it is the content that changes from one page to another, without the header and footer that repeat.

The second page does not look better, and it does not have to: the eye was never the problem. Whoever listens to the first knows there are two links and a heap of text, and has to guess the rest. Whoever listens to the second knows where they are at every moment.

**[Headings are an index.](https://www.w3.org/WAI/tutorials/page-structure/headings/)** Whoever uses a screen reader can ask for the list of the page's headings and read it as one reads a book's index; there are also extensions that show it to anyone. For that index to be useful, the levels mean **hierarchy, not size**: `<h1>` is the page's title (just one: a firmly established convention, although the standard allows more), `<h2>` are its sections, `<h3>` the parts of a section. Levels are not skipped: from an `<h2>` you go down to an `<h3>`, not to an `<h4>`, just as a book does not go from chapter 1 to section 1.1.1. Choosing `<h4>` because “the h2 looks too big” is the beginner's most common mistake, and it is fixed by next lesson's CSS, not by the HTML. The W3C validator warns about skips. You will see it in the errors section.

To make it clear what the index of the dashboard you are going to build looks like, this is how a screen reader would read it:

```text
nivel 1: Revisor de servicios
  nivel 2: Resumen
  nivel 2: Servicios
```

Short, and enough. If in the future you add a service's detail inside “Servicios”, that part would be level 3, and the index would still be coherent.

**What ARIA is not.** You have probably seen in some code attributes such as `role="button"` or `aria-label="..."`. They are **ARIA**, a set of attributes that lets you add meaning to an element that has none. It exists for the cases HTML does not cover. Its first rule, in [the guide the W3C maintains](https://www.w3.org/TR/using-aria/), says that **if there is an HTML element with the meaning and behavior you need, you use it**. A `<button>` already comes with the button role, the ability to receive focus, activation with Enter and with the space bar. A `<div role="button">` brings only the role: the rest you have to write yourself, and almost nobody writes it completely. The [ARIA practices guide](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/) sums it up in one sentence worth remembering: *a role is a promise*. If you say something is a button, you commit to it behaving like one. That is why, in this course, **in this lesson and the next you will not write a single line of ARIA**: almost everything the dashboard needs is solved by native HTML, and where HTML falls short we will tell you at the right time.

#### 2.1.4 Text with meaning: lists, data and dates

Inside sections, text is also chosen for what it is. There are three ways to group similar things, and each one means something different:

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

`<ul>` is an **unordered list**: elements that go together but could be swapped in place. `<ol>` is an **ordered list**: if you move an element, the meaning changes (here, from slowest to fastest). `<dl>` is a **[description list](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl)**: pairs of name and value, like “Disponibles: 4 de 5” (Available: 4 of 5). It is the correct form for the dashboard's summary, and almost nobody uses it; in its place you see `<div>` with bold text that a screen reader does not know is a name and its value. In the `<dl>`, each name is a `<dt>` and each value a `<dd>`; the standard allows grouping them with a `<div>` when you want to give them a hook for styling, as here.

A detail that seems minor: the [`<time>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time) element. Inside it carries the text the person sees (“7 de octubre de 2026, 10:30”), but its `datetime` attribute carries the same date in the format a machine understands: year, month, day, hour and offset from UTC (`-06:00` is the time of central Mexico, which since 2022 no longer changes for daylight saving). The text can change language or style and the data stays intact. Search engines, extensions and, later, your own JavaScript can read it without interpreting “7 de octubre”.

And a question you will soon ask yourself: why not a `<br>` between lines, or spaces to indent? Because `<br>` means “line break inside a single paragraph” (a poem, a postal address), not “a bit more space”. Space is appearance and is the job of CSS. Every time you use a content mark to get a visual effect, you are lying about what something is.

### 2.2 Data shaped like a table

#### 2.2.1 When a table and when not

A table is the right tool when the data has **two dimensions that cross**: rows that are things and columns that are properties of those things, and each cell says “this property, of this thing”. The dashboard is exactly that: each service (row) has a status and a response time (columns). If the data has a single dimension, it is a list. If it is pairs of name and value, it is a `<dl>`.

There was a time, twenty years ago, when tables were used to arrange the page in columns, because there was no other tool. Today that practice is a mistake, for two reasons: the screen reader announces “table of three columns” over something that is not a table, and the layout breaks on a phone. The rule with no exceptions is: **table for data, never for layout**. Layout is the topic of Lesson 4.

#### 2.2.2 The pieces of an accessible table

Look at the dashboard's table, with three of its five services so as not to repeat:

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

[A table is assembled from nested pieces](https://www.w3.org/WAI/tutorials/tables/), and each has its job:

- **`<table>`** wraps everything.
- **`<caption>`** is the table's title. It goes as the first child and it is what a screen reader announces on arriving (“Estado de los servicios en la última revisión, tabla de 3 columnas y 3 filas” — Status of the services at the last check, table of 3 columns and 3 rows). It is better than a loose heading before the table, because it stays attached to it.
- **`<thead>` and `<tbody>`** separate the row of titles from the rows of data. Later, CSS can style the header without touching the body, and the browser can repeat the header on every page when printing.
- **`<tr>`** is a row.
- **`<th>`** is a **header cell** and **`<td>`** a data cell. This is the distinction that matters most in the whole table.

And inside `<th>`, the `scope` attribute says what the header points to: `scope="col"` if it heads a column, `scope="row"` if it heads a row. In the first row the `<th>` title columns; in the others, the first `<th>` of each row is the service's name and titles its row.

What is all this for? Because whoever uses a screen reader does not see the whole table: they move cell by cell with the arrows, and in each cell they need to know what it corresponds to. With the `<th>` properly placed, on reaching “120 ms” the reader announces “Catálogo, Tiempo de respuesta, 120 ms”. Without them, they only hear “120 ms” and have to remember which row and which column they were in. If you put `<td>` instead of `<th>` on the service's name, the page looks the same and the experience breaks, and no validator warns you. That is the reason this lesson insists that HTML is **checked with accessibility tools and with the keyboard**, not just by looking at it.

#### 2.2.3 An empty cell lies

Look at the last row: the service `Inventario` is down and so it has no response time. What do you put in that cell? There are three temptations, and two are wrong. Leaving it empty leaves the screen reader announcing “blank”, without saying whether it is an oversight or an absence. Putting `0 ms` is worse: it is false data, because a service that did not respond did not respond in zero milliseconds, and that would later ruin the average. The honest thing is to say what happened: “sin respuesta” (no response). It is text, not a number, and that decision (the response time may **not exist**) comes back when you compute the average in Lesson 6.

### 2.3 Controls: button, link and label

#### 2.3.1 A link goes to a place; a button does something

The Tab key walks through the elements the user can interact with, and the following page is an experiment worth doing with your hands:

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

(The page's title reads “Four things that look like controls”; “Ir al resultado” is “Go to the result”, “Revisar ahora” is “Check now” and the last paragraph reads “The page ends here.”)

Open it and press Tab repeatedly. I checked this experiment with Chrome 154: **the key stops only twice**, on the link and on the button, and then leaves the page. The `<div>` with the text “Revisar ahora” and the `<span>` with “Ir al resultado” **do not receive focus**. For the keyboard, they do not exist. With Lesson 3's CSS you could make them look identical to a button and a link, and they would still be unreachable without a mouse, and for the screen reader they would still be text.

See what you get for free with each true element:

- **`<a href="...">`** is a **link**: it promises to take you to another place (another page, or another part of the same one, like `#result`). For free it brings focus with Tab, activation with Enter, right-click to copy the address, middle-click to open it in another tab and the ability to remember which links you visited. Without `href` the `<a>` is not a link: it is a marker without a destination.
- **`<button>`** is a **button**: it promises to do something on this page. It brings focus, activation with Enter and with the space bar, and the “disabled” state with the `disabled` attribute.

The rule that sums up both: **if the action leads to another address, it is a link; if it changes something right here, it is a button.** “Ir a Servicios” (Go to Services) is a link. “Revisar ahora” (Check now) is a button. Getting it wrong produces oddities you will already have seen: a “button” that is a link and does not activate with the space bar, or a “link” that is a button and cannot be opened in another tab.

A note about `type="button"`. When a `<button>` is inside a form (you will see it in Lesson 10) and declares no type, [the standard](https://html.spec.whatwg.org/multipage/forms.html) assigns it `submit`: it submits the form and reloads the page. It is one of the most frequent surprises. Declaring `type="button"` on every button that submits nothing spares you that. Today the “Revisar ahora” button does nothing, because the page has no JavaScript yet. In Lesson 8 it will request the dashboard's data again, and for that the HTML you write today will only need one more `id`.

#### 2.3.2 A field without a label is a field without a name

The last control for today is the search field. The rule is simple and always broken: **every field needs a visible and associated label**. “Associated” means the browser knows that that text belongs to that field. There are two ways to associate it and both are on the following page:

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

(The labels read “Search service”, “Service name”, “Show”, and the three options “All”, “Available” and “Down”.)

The first is the **[explicit association](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label)**: the `<label>` carries `for="search"` and the field carries `id="search"`; the value of `for` is the field's `id`, and that coincidence is the bond. The second is the **implicit association**: the field goes inside the `<label>` and no `id` is needed. Both work; the explicit one is more flexible because the label and the field can be in different places in the document, and the implicit one is shorter. To check that the bond is real, click on the text “Buscar servicio”: the cursor jumps to the field. I checked it by automating that click in Chrome, and the field receives focus. That is a visible gain: a much bigger click target for whoever has poor aim, or touches with a finger.

Behind it something happens that is worth naming. Every interactive element has an **[accessible name](https://developer.mozilla.org/en-US/docs/Glossary/Accessible_name)**: the text with which a screen reader announces it. The browser computes it with fixed rules, and for a field, the associated label is the main source. In Chrome's accessibility tree, the field above appears as `searchbox "Buscar servicio"`: a role and a name. If there were no label (nor another clue from which to take a name), `searchbox` would appear alone: a box without a name. And an audit tool, like those you will see later, flags it with the message *“Form elements must have labels”*.

**The `placeholder` is not a label.** It is that gray hint that appears inside the field and disappears when you type. The temptation to use it as a label is strong because it saves space, but it fails on three sides: it disappears just when you need to remember what you had to type, its gray color usually has little contrast with the background, and it is not a label for the browser: it creates no association and you cannot click on it to reach the field. The browser only takes it as a fallback name when there is no label; I measured it in Chrome 154, and a search field without `<label>` and with `placeholder="Buscar servicio"` is announced as `searchbox "Buscar servicio"`. It is a browser patch, not a label that the person can see. Use it, at most, for a format example (`ej. catalogo`, “e.g. catalogo”), never as the only name.

The third piece is the **group**. Three radio buttons (“Todos”, “Disponibles”, “Caídos”) form a single question: *what do you want to show?* The `<fieldset>` groups the controls that go together and the `<legend>` is the group's title, which the screen reader announces before each option. Radios that share the same `name` already behave as a group for the browser: only one can be checked. And that is why, in the Tab key experiment, **the whole group counts as a single stop**; you enter with Tab and switch options with the arrows. I measured it in the complete dashboard: the Tab key stops five times (two links, the search field, the radio group and the button).

Notice a design decision: the filter is a group of radios and not three buttons. It is a choice among mutually exclusive options, which is exactly what a radio button means. Whoever reads the code understands the intention without a comment.

#### 2.3.3 When to use `div` and `span` after all

After so much praise of meaning, a clarification: `<div>` and `<span>` are not bad. They are the elements that **mean nothing**, and that is useful when you need to group something only to style it or to find it later with JavaScript. `<div>` groups as a block and `<span>` groups inside a line. The rule is one of order: **first look for the element with meaning; only if none exists, use `div` or `span`**. On most pages you see, the opposite happens.

You will see a `<span class="status status-available">` inside the dashboard's table. It is there for this: the “Disponible” status is nothing but text, but we need a place where next lesson's CSS puts a colored badge. It is the `class` attribute you met in 2.1.1: a name for CSS to point at, which does not change what the element means.

## Worked example: the complete dashboard

You now know all the pieces. This is the page that puts them together, the skeleton of the `revisor`, with five sample services. Save it as `index.html` in your `revisor` folder, in place of Lesson 1's `index.html`: from today, that file is the dashboard, and the following lessons will make it grow. Read it from top to bottom with the map in your head: what each thing is, why that element and not another.

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

Go through the decisions, because that is where the learning is:

- **The empty icon** (`<link rel="icon" href="data:,">`) is the line from Exercise 2 of Lesson 1: it tells the browser that the page has no icon, so it does not request `/favicon.ico` and does not dirty the console with a 404. It is a shortcut, and it has a cost you will see in Lesson 11, when the dashboard is published with a security policy and this icon is swapped for a real one.
- **The page header** (`<header>`) groups the title, the date of the last check and the navigation. By hanging from the `<body>` it is the `banner`. The title is the only `<h1>`.
- **The navigation** (`<nav>`) has two links, because they lead to other parts of the page: that is what a link does. They are written inside a sentence (“Ir a: … o …”, “Go to: … or …”); the accessibility guidelines ask that touch targets be at least 24 × 24 pixels or have enough space around them ([WCAG 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)), and they expressly exempt links that go inside a sentence, because their size is imposed by the line of text. Writing them in a sentence does not make them bigger: it separates them with words and leaves them inside that exception, without a line of CSS. Two loose links, one next to the other, would have neither of the two things. In Lesson 4 you will see a real menu.
- **The summary** is a `<dl>`: names and values. Notice the calculation, because it is used again: there are 5 services, 4 available and 1 down; the average response of 465 ms is the average of the **four that responded** (120 + 480 + 310 + 950 = 1,860; 1,860 / 4 = 465). The down service does not count as zero.
- **The controls** are the three you know: a field with a label, a group of radios with a title and a button of explicit type. None is inside a form yet; the form, with submission and validation, is the topic of Lesson 10.
- **The table** carries a caption, column and row headers, and a cell that tells the truth about the down service.
- **The footer** (`<footer>`) says where the data comes from: sample data, written by hand.

Now do what no reader of this code does: **use it the way the other three people from the beginning would**. Press Tab from the start and count the stops: there should be five, and the focus should go in order from top to bottom. Open the developer tools' accessibility panel and check that you see `banner`, `main` and `contentinfo`. Run the page through the official validator, as explained in the next section. If all three tests pass, your HTML does what it says.

## The error you will see

HTML errors are almost never shown by the browser. A validator shows them. The W3C's is called the [*Nu Html Checker*](https://validator.w3.org/nu/) and lives at `https://validator.w3.org/nu/`; there you can upload a file or paste the code into a text box. On purpose we are going to break the page to learn to read its response. This one has six defects:

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

When pasted into the validator, this is what it answers (copied from the real result):

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

It is in English, and it is the English of the documentation you will read your whole career, so it is worth learning to read it. Each message brings the line and the column where it happens. One by one:

1. **The `DOCTYPE` is missing.** You already know why it matters: without it the browser enters quirks mode. It is fixed by writing `<!DOCTYPE html>` as the first line.
2. **A `<button>` inside an `<a>`.** It is a common mistake and has a reason: an interactive element cannot live inside another. What is activated on click, the button or the link? Browsers do not agree. You pick one: if the control leads to another place, a link; if it does something here, a button.
3. **An `<img>` without `alt`.** The [`alt`](https://www.w3.org/WAI/tutorials/images/decision-tree/) attribute is the text the screen reader reads in place of the image. If the image provides information, the `alt` describes it; if it is just decoration, it is left empty (`alt=""`) so that it is ignored. It is never omitted. The dashboard has no images, and even so this is the web's most frequent error, which is why I include it.
4. **A `</p>` without its `<p>`.** It is the consequence of an HTML rule: a `<p>` can only contain text and inline elements, not a `<div>`. The browser closes the paragraph before the `<div>` on its own, and the closing tag you wrote is left orphaned. That is why the message says “no p element in scope”: the browser closed it, without telling you.
5. **`lang` is missing.** It appears as a warning, not as an error, but you already know what it costs.
6. **The `<h4>` after the `<h1>`.** The validator did the count: it skipped two levels. You fix it with `<h2>`.

Notice what it did **not** say. The `<input>` without a label, with only a `placeholder`, passed without a warning: the validator checks that the syntax is legal, not that the page is usable. Other tools detect that, the accessibility audit ones. The browser brings one in its developer tools (in Chrome it is called Lighthouse), and almost all rely on an engine called axe, which on this same page answers, among other things, with these real messages:

```text
heading-order: Heading levels should only increase by one
html-has-lang: <html> element must have a lang attribute
image-alt: Images must have alternative text
```

And on a variant of the dashboard with the `<label>` removed, `label: Form elements must have labels`. **The two kinds of tool are complementary**: the validator catches what the standard forbids and the audit catches what leaves someone unable to use the page. There is a third kind of error that neither of the two catches: changing a `<th>` to a `<td>` produces no message at all, although it breaks the table's announcement. For that one, only testing with the keyboard and with the accessibility tree works.

## What gets done wrong

**1. Building controls with `div` or `span`.** The case of the page with the four things: a `<div>` that says “Revisar ahora”. *Cost:* nobody with a keyboard reaches it, no screen reader announces it as a button, and rebuilding focus, the space bar and the disabled state by hand is work the browser has already done. Fix: a `<button type="button">`.

**2. Choosing the heading for its size.** An `<h4>` because the `<h2>` “looks big”, or a bold `<p>` because “it is already a title”. *Cost:* the heading index is left full of gaps or empty, and whoever navigates by headings finds nothing. Fix: choose the level by hierarchy; size belongs to CSS.

**3. Using tables to lay out the page.** *Cost:* the screen reader announces tables where there is no data, the page does not adapt to a phone and the code is hard to read. Fix: a table only for data with rows and columns that cross.

**4. All the cells as `<td>`.** The hardest case to see, because the page looks perfect. *Cost:* the screen reader announces “120 ms” without saying whose or of what. Fix: `<th scope="col">` on the column titles and `<th scope="row">` on the row's name.

**5. The `placeholder` as the only label.** *Cost:* the hint disappears when typing, it usually has little contrast and the field depends on a fallback name that the person stops seeing as soon as they type. Fix: a visible `<label>`, associated with `for` and `id` or wrapping the field.

**6. A link that acts as a button, or a button that acts as a link.** An `<a href="#">` that triggers an action, or a `<button>` that navigates. *Cost:* middle-click, the space bar, copying the address and the history break. Fix: “goes to a place” is a link, “does something” is a button.

**7. `<br>` and `&nbsp;` to give space.** *Cost:* a screen reader may read “blank line” or breaks that mean nothing, and the space is tied to the text. Fix: space belongs to CSS.

**8. Not putting `alt` on an image.** *Cost:* the image is invisible to whoever cannot see it. Fix: an `alt` that says what function the image serves, or `alt=""` if it is pure decoration.

## Exercises

### Exercise 1 — Count the stops

With the complete dashboard open on your local server, let go of the mouse and use only the keyboard. Press Tab from the start and write down, in order, what the focus stops on each time. Then change `<button type="button">` to `<div>` in your copy, reload and count again. How many fewer stops do you have? What stopped being possible?

### Exercise 2 — From `div` to meaning

This fragment shows a service “card” written only with `div` and `span`. Rewrite it with the elements that say what each thing is, without changing the text that is read:

```html
<div class="card">
  <div class="card-title">Pagos</div>
  <div class="card-row"><span>Estado</span> <span>Disponible</span></div>
  <div class="card-row"><span>Respuesta</span> <span>480 ms</span></div>
  <div class="card-action" onclick="check()">Revisar este servicio</div>
</div>
```

A hint: there are two pairs of name and value, one action and a title that deserves to be a heading.

### Exercise 3 — Add a service and redo the numbers

Add a sixth service to the dashboard, `Correo`, available and with a 210 ms response. Then update the summary by hand: how many services there are, how many are available, how many are down and what the average response is. Remember which services the average is computed from.

### Exercise 4 — Break three things and see which ones show

In a copy of the dashboard make three changes: remove the `<label>` from the search field, change the second `<h2>` to an `<h4>` and change `<th scope="row">Pagos</th>` to `<td>Pagos</td>`. Run the copy through the official validator. Which of the three defects does it point out? For those it does not, how would you discover them?

## Solutions

### Solution 1

With the real button, the focus stops five times, in this order: the “Resumen” link, the “Servicios” link, the search field, the radio group (a single stop, and inside it you switch with the arrows) and the “Revisar ahora” button. Then the focus leaves the page toward the browser's bar. With the `<div>` there are **four** stops, one fewer: the button stopped receiving focus, so it **can no longer be activated without a mouse**. That is the difference between a control and something that looks like a control.

### Solution 2

The title is a heading (`<h3>`, because it hangs from the “Servicios” section, which is level 2), the two pairs of name and value are a description list, and the action is a button. Since the `onclick` is JavaScript inside the HTML and we do not use it yet, it is removed: who listens for the click will be seen in Lesson 7.

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

`<article>` was used because the card is a unit with meaning of its own, which would be understood loose on another page; a `<div>` would also be valid if you do not want to declare that idea. What is not valid is leaving the title as a `<div>` or the action as a `<div>`.

### Solution 3

With the sixth service, the summary ends up like this: **6** services checked, **5 of 6** available, **1** down. The average response is computed with the five that responded: 120 + 480 + 310 + 950 + 210 = 2,070, and 2,070 / 5 = **414 ms**. The down service still does not enter the average, because it has no response time. The new row respects the structure of the others:

```html
<tr>
  <th scope="row">Correo</th>
  <td><span class="status status-available">Disponible</span></td>
  <td>210 ms</td>
</tr>
```

If you calculated 345 ms (2,070 / 6), you counted the down one as if it had responded in zero, which is exactly the error that section 2.2.3 describes.

### Solution 4

The validator points out **only one**: the `<h4>` after the `<h2>`, with the message *“The heading “h4” (with computed level 4) follows the heading “h2” (with computed level 2), skipping 1 heading level”* (I checked it with a real copy of the dashboard). It does not point out the missing `<label>`, because a field without a label is legal HTML; you would discover it with an audit tool, which answers *“Form elements must have labels”*, or with the accessibility tree, where the field appears without a name. The `<td>` instead of the `<th>` is not pointed out by either of the two tools: it is discovered with the accessibility tree (the row's name is no longer associated with the cells) or, better, by listening to the table with a screen reader. Moral: passing the validator is necessary and not sufficient.

## How I know I got it

- [ ] The dashboard opens at `http://localhost:8000/` served with `python3 -m http.server 8000 --bind 127.0.0.1`, with no errors in the console tab of the browser's developer tools.
- [ ] The Tab key stops exactly five times inside the page (two links, the field, the radio group and the button), in order from top to bottom.
- [ ] The accessibility panel of the browser's developer tools shows `banner`, `navigation`, `main` and `contentinfo`, and the headings come out in the order 1, 2, 2.
- [ ] When pasting the page into `https://validator.w3.org/nu/` the response is *“Document checking completed. No errors or warnings to show.”*
- [ ] When clicking on the text “Buscar servicio” the cursor jumps to the search field.
- [ ] You can explain in your own words why a `<div>` that says “Revisar ahora” is not a button, and why `120 ms` without its `<th>` is orphaned data.

## Further reading

- [WHATWG HTML Standard, “Sections”](https://html.spec.whatwg.org/multipage/sections.html) — the source that decides what `<header>`, `<nav>`, `<main>`, `<section>` and `<footer>` mean, and when each one is a landmark. Accessed on October 7, 2026.
- [MDN, “Structuring content with HTML”](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content) — Mozilla's learning module that follows the same order as this lesson, with practical challenges on tables and structure. Accessed on October 7, 2026.
- [W3C WAI, tables tutorial](https://www.w3.org/WAI/tutorials/tables/) — how to build tables that a screen reader can walk through, with examples of simple and complex headers. Accessed on October 7, 2026.
- [W3C WAI, “Using ARIA”](https://www.w3.org/TR/using-aria/) — the guide to ARIA's rules, starting with “if a native HTML element exists, use it”. Accessed on October 7, 2026.
