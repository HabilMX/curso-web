# Lesson 5 — A page that works on any screen

**Time:** two sessions of about 90 minutes. A split that works: the first one, “The why before the how” (the 320, the `viewport` tag and how to measure) and the columns that count themselves (5.1); the second one, the table that scrolls, `@media`, `@container`, the finished dashboard, taking it to your `revisor` (5.2.7) and the exercises. Each session ends in a page that you can open and measure.

**What you build:** the dashboard that works on a phone

**What you learn:** what the `viewport` tag does; adaptive with `minmax()` and `auto-fit` before `@media`; the table that scrolls inside its box; `@media` for the page and `@container` for the box; from 320 to 1440 px without overflow

**Where you come from.** You bring the dashboard from [Lesson 4](04-flexbox-grid.md), laid out with Flexbox and Grid: the header in a row, the summary's four figures in four columns and the controls bar on one line. On a wide screen it looks good; on a phone, not yet. All the pages of this lesson are in [`programas/05-pagina-adaptable/`](https://github.com/HabilMX/curso-web/tree/main/programas/05-pagina-adaptable) of the [course repository](https://github.com/HabilMX/curso-web), and the starting point is `fig05_01.html`, which is the dashboard Lesson 4 ended with, as it is. Its stylesheet, `fig05_01/styles.css`, is a **copy** of `fig04_06/styles.css`, the previous lesson's stylesheet: it is repeated on purpose, so that this folder works on its own, without depending on another lesson's folder. This lesson's test pages load it with `<link rel="stylesheet" href="fig05_01/styles.css">`, a *relative* path that the browser looks for in the `fig05_01` folder next to the page; if you copy only a `.html`, without that folder, the page will look unstyled and the Network tab will show you the stylesheet's `404`. The finished dashboard, `fig05_06.html`, uses its own stylesheet, `fig05_06/styles.css`. If your `revisor` did not end up the same at the end of Lesson 4, it does not matter: you have `fig05_01.html` and its stylesheet in full at the end of 5.2.6. You work again with the `index.html` and `css/styles.css` of your `revisor` folder, and the local server is still `python3 -m http.server 8000 --bind 127.0.0.1`.

**What this lesson does not do.** It does not touch JavaScript, except for one line that you will paste into the console to measure. The summary's figures are still written by hand; a program will count them in Lesson 6 and Lesson 7 will draw them in the table. Today, as in the previous lesson, only *where* each thing goes and *how big* it is changes.

## By the end you will be able to

- Explain what the `viewport` tag tells a phone and what happens without it: the page is drawn in a virtual window wider than the screen (980 px in Chrome) and shrunk.
- Check with a measurement, not by eye, that a page does not overflow between 320 and 1440 px, and find the culprit when it does.
- Declare columns that count themselves with `repeat(auto-fit, minmax(min(100%, 11rem), 1fr))` and explain what each piece of that line does.
- Explain why `1fr` is not enough in a column that will contain something wide, and write `minmax(0, 1fr)` in its place.
- Let a wide table scroll inside its own box without losing its semantics and without leaving out whoever uses the keyboard.
- Decide when a media query (`@media`) is needed, when a container one (`@container`) and when neither.
- Take the adaptive dashboard to your `revisor`, measure it at five widths and save it in Git.

## The why before the how

It is two in the morning and the phone of whoever is on call rings. They open the dashboard to see which service went down. They do not have a computer at hand: they have a handheld screen and a thumb. What they need to know fits in one sentence (“Inventario is not responding”), but the page, as the previous lesson left it, makes them work harder than necessary.

Measure it instead of assuming it. Open `fig05_01.html` on your local server, open the browser's developer tools with `F12` and turn on responsive screen mode (in Chrome and Edge it is the phone and tablet icon; in Firefox it is `Ctrl`+`Shift`+`M`). Set the width to 320 pixels. You will see a horizontal scroll bar: the page is wider than the screen, and whoever uses it has to drag sideways to see a three-column table. I measured it with Chrome 154, automated and windowless, and this is what it gave: at 320 px the page measures **414 px wide**, the same figure Lesson 3 and Lesson 4 closed with; at 375 px it also measures 414; at 768 px, 1024 px and 1440 px it measures exactly what the window does, with nothing left over. Two elements go past the edge. The first is the table, which with its three columns and each cell's padding reaches 414 px. The second is new, and the previous lesson brought it: the summary, whose four fixed columns do not fit on a phone and reach 369 px. The rest —the header, the search field, the radios, the button— already fits, because they drop to the next row with `flex-wrap` and because no stylesheet gave them a fixed width. It is a virtue worth not losing.

And at the opposite extreme a minor debt remains: on a 1440 px screen the content is still a 60 rem (960 px) column in the center, with two empty strips at the sides, and the table sits below the summary, when the two would fit side by side.

Both things have the same cause. **The dashboard lays out, but does not adapt.** The summary's four columns are four at any width, because that is how they were written; the table measures what its content measures, because nobody told it otherwise; and the page is a single column even when there is room to spare. This lesson is the one that teaches it to decide according to the space it has.

### What “320 pixels” means and why it is the number

A **CSS pixel** is not a physical dot of the screen. It is a unit that the browser keeps constant on purpose, so that a 100 px wide box looks about the same size on a high-density screen as on an ordinary one. A phone with a screen 1,080 physical dots wide usually declares itself as a window of some 360 to 430 CSS pixels (the exact figure varies by model); each CSS pixel is painted with several physical dots. When a stylesheet says `width: 320px`, it speaks in this unit.

The 320 comes from a public rule: [success criterion 1.4.10 (“Reflow”)](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) of the Web Content Accessibility Guidelines 2.2, which asks that content be presentable “without loss of information or functionality, and without requiring scrolling in two dimensions” in a window equivalent to 320 CSS pixels wide. The reason is magnification: that width is equivalent to opening the page on a 1,280 px screen and zooming to 400%. [A person with low vision who enlarges the text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html) until it reads comfortably is, without knowing it, turning their monitor into a 320 px screen. If the page overflows there, that person has to drag the page from side to side to read each line. The 320 is not a quirk of old phones: it is everyone's floor.

The same standard has an exception worth knowing from now on, because you will use it with judgment: the parts of content that **require a two-dimensional layout for usage or meaning** —maps, video, and also data tables— may scroll. But the exception covers only that part: the table's title and what surrounds it do have to rearrange. Further down, in concept 5.2, the services table will scroll *inside its box* and everything else will lay itself out.


### The tag you already wrote without knowing what it did

In Lesson 2 you put in the `<head>` the line `<meta name="viewport" content="width=device-width, initial-scale=1">` because “that is how it is done”. Now you will see why. The phones of the early years of the mobile web met pages made for desktop computers and, so as not to show them broken, invented a trick: **they draw the page in a virtual window wider than the screen —typically 980 pixels— and then shrink the result** so it fits. That behavior is still the default for a page that declares nothing. [MDN documents it](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Viewport_meta_element) and uses 980 px as an example, but no standard fixes that figure: each browser chooses its own. Chrome uses 980, as you will measure in a moment; another browser or another phone may give you a different number, and what does not change is the effect: a window wider than the screen, and everything tiny.

The `viewport` tag asks the browser to use the device's real width. The proof is in `fig05_02.html`, a page that on purpose does not carry it. I measured it with Chrome 154 on an emulated 390 px wide phone: without the tag, `window.innerWidth` is **980**; with it (as in `fig05_03.html`, which you will see in 5.1.2) it is **390**. Everything you learn in this lesson depends on that: a rule like “from 64 em wide” means nothing if the browser thinks the window measures 980 px when it measures 390.


This is the test page, complete:

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

A warning that MDN repeats and that the accessibility standard backs: **do not take away the reader's ability to zoom the page**. There are tutorials that add `user-scalable=no` or `maximum-scale=1` to stop the phone from zooming when a field is tapped. Whoever has low vision uses that zoom to read. That line stays on its own, just as it is.

### How you will check

There are two ways to verify that a page does not overflow, and you will use both throughout the lesson.

The first is to look: the developer tools' responsive mode, with a width of 320 px. If a horizontal scroll bar appears on the page (not inside a particular box), it overflows.

The second is to measure, because the eye misjudges by a few pixels. Open the tools' console tab, paste this line and press `Enter`:

```js
document.documentElement.scrollWidth > document.documentElement.clientWidth
```

It is JavaScript, which you are not studying yet: you will understand it completely in Lesson 6, and for now all you need to know is what it asks. `clientWidth` is the visible width of the page and `scrollWidth` is the width its content actually takes up. If the second exceeds the first, the content is wider than the window and `true` is returned. **If it returns `false`, there is no overflow.** In `fig05_01.html` with the window at 320 px, that line returns `true`; at the end of the lesson, with your finished dashboard, it will return `false` at all widths.

## The concepts

Two ideas, in this order: the **columns that count themselves**, which solve the summary without writing a single window-width number; and **adaptivity**, which is not one more tool but a way of using Flexbox and Grid so that the page lays itself out, with media and container queries only for what really needs them. Each is first explained with a minimal example and then with the dashboard.

### 5.1 Columns that count themselves

#### 5.1.1 The `1fr` trap: the hidden minimum

`repeat(4, 1fr)` has a problem that shows as soon as the screen narrows: it is always four columns, whatever the widths. You saw it at the end of section 4.2.3 of Lesson 4, with the previous lesson's page [`fig04_05.html`](https://github.com/HabilMX/curso-web/blob/main/programas/04-flexbox-grid/fig04_05.html), which declares the summary's four figures in four fixed columns: at 1024 px and at 1440 px it looks good, but at 320 px the four figures squeeze together and the page **measures 344 px wide** (at 375 px they already fit, barely).

There is a subtle reason, worth understanding because it is Grid's most common trap: **`1fr` is not “a fraction” plain and simple. It is `minmax(auto, 1fr)`**. The column's minimum is `auto`, which means “whatever the narrowest possible content measures”, and a column does not shrink below that. Here, the longest word of each figure sets a floor for its column. I measured it: the four floors add up to 280 px, and the three 16 px gaps, another 48; that is 328 px, more than the 288 the page leaves at 320 px after its padding, so the grid overflows instead of shrinking.

The practical consequence is important: **writing more columns than fit does not shrink them; it overflows them**. And writing fewer (Exercise 2 of Lesson 4 tried two) wastes space on a wide screen. No fixed number of columns works for all widths. What is needed is to tell the browser *how wide a column is at minimum* and let it count how many fit.

#### 5.1.2 `minmax()`, `auto-fit` and `min()`

[`minmax(minimum, maximum)` is the function](https://developer.mozilla.org/en-US/docs/Web/CSS/minmax) that lets you set a column's floor and ceiling yourself. `minmax(11rem, 1fr)` says: “this column measures at least 11rem (176 px) and, if there is room, grows by sharing it with the others”. With that floor known, the browser already knows how many columns fit in a given width. And here is the piece that ties everything together:

```css
grid-template-columns: repeat(auto-fit, minmax(min(100%, 11rem), 1fr));
```

It reads from the inside out:

1. `minmax(11rem, 1fr)`: each column measures from 176 px upward.
2. `repeat(auto-fit, ...)`: **repeats the column as many times as fits**. It is not told how many; the browser counts.
3. `min(100%, 11rem)`: the floor is the smaller of 11rem and 100% of the container. Without this piece, in a container narrower than 176 px (a narrow sidebar, a phone with 150 px of usable width) the column would not fit and would overflow; with it, the floor never exceeds the available width. [`min()` is a CSS function](https://www.w3.org/TR/css-values-4/) that returns the smaller of its arguments, and [MDN marks it as available in all browsers since July 2020](https://developer.mozilla.org/en-US/docs/Web/CSS/min); [the platform considers it widely available since January 2023](https://web-platform-dx.github.io/web-features-explorer/features/min-max-clamp/), after the customary 30 months.

There are two words that look alike and do not do the same: `auto-fill` and `auto-fit`. Both count how many columns fit. The difference appears when there are fewer items than possible columns: `auto-fill` keeps the empty columns (the space stays reserved, although there is nothing there) and `auto-fit` collapses them to zero, so the items that do exist stretch and take up the whole row. I measured it leaving only two figures in the `fig05_03.html` page below, with the window at 1440 px (Lesson 3's stylesheet limits the content to 60 rem, so the container measures 928 px): with `auto-fill`, four 220 px columns fit and the two cards stay in the first two, with half a row empty; with `auto-fit` the two measure 456 px and fill the row. For the dashboard's summary, `auto-fit`: we want the figures that exist to take up the whole row, not leave a gap.

The page with the solution is `fig05_03.html`. It is identical to `fig04_05.html` except for that line (and for the path of its stylesheet, which is this folder's copy):

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

I measured five widths: 320, 375, 768, 1024 and 1440 px. In all of them, the page's width equals the window's; it does not overflow. At 320 px the four figures form a column, each 288 px; at 1024 and 1440 they take up a single row, of four 220 px columns. Nobody wrote “at such a width, one column”: the browser did the count with the 11 rem floor.

#### 5.1.3 The other `1fr` trap: a grid that inflates

There is a variant of the same trap that will bite you when you use Grid for the skeleton of the whole page, and that is why you make it a habit from today. Think of a page with a single column: `display: grid` plain, or with `grid-template-columns: 1fr`. If some child has wide content (a table, for example), the column inflates until it accommodates it, because its `auto` minimum is the width of the narrowest possible content. The result: the table does not scroll inside its box, but **drags the whole page along**.

I measured it in the final dashboard, changing only `minmax(0, 1fr)` to `1fr` in the page's grid: at 320 px, the page overflows again, and now measures 439 px, even though the table is inside its box with `overflow-x: auto`. With `minmax(0, 1fr)` it is 320. The solution, always, is to write the zero minimum on purpose: `minmax(0, 1fr)` says “this column may shrink to nothing if need be; do not inflate it because of the content”. **When a grid will contain something potentially wide, the column is written `minmax(0, 1fr)`, not `1fr`.**

#### 5.1.4 Worked example: the dashboard's summary

In the dashboard, the summary already has its class since Lesson 4 (`<dl class="summary">`), and the HTML is not touched. The only thing that changes is one line of the stylesheet's `.summary` rule: `repeat(4, 1fr)` becomes the line of the columns that count themselves.

```css
.summary {
  container-type: inline-size;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 11rem), 1fr));
  gap: 0 var(--space-3);
  margin: 0;
}
```

The first declaration, `container-type: inline-size`, you do not know yet: it prepares the summary for a container query and is explained in 5.2.4. The other three are the usual ones. With this change, the second culprit of the overflow disappears: the summary measures what its section allows at any width, and on a phone the figures arrange themselves one below another. The first remains, the table, which needs another tool.

### 5.2 Adaptive: let the content decide

#### 5.2.1 Fluidity first, query afterwards

What you have done so far is already “adaptive”, although you did not write a single media query. The controls bar of Lesson 4 drops to the next row on its own when it does not fit; the summary counts its columns by itself. The technique is called **intrinsic design**: instead of saying “at such a width, do such a thing”, the browser is given a floor, a ceiling and a preference (`flex: 1 1 14rem`, `minmax(11rem, 1fr)`) and it decides with whatever width it has. It has an advantage that is not appreciated until compared: **it works with widths nobody foresaw**. A tablet in portrait, a half-size window, a foldable phone, a screen with enlarged text: none was on your list of “devices”, and all of them lay out the same.


The order of the tools, from the one that writes least to the one that writes most, is:

1. **Normal flow.** If the content fits in a column, leave it in a column.
2. **Flexbox with `flex-wrap` and reasonable bases.** For groups of things that share a line.
3. **Grid with `repeat(auto-fit, minmax(...))`.** For cards and boards.
4. **Media or container query.** Only when the page's *organization* changes and there is no way to ask for it with the previous tools.

#### 5.2.2 The table: scrolling inside its box

The other overflow remains, the table's. A data table cannot be “split” without destroying what it means: if you turned each row into a card, you would lose the comparison of columns, which is exactly what a table is for. It is the case that the reflow standard exempts: a table may require two dimensions. The solution is **to let the table keep its width and let its box scroll**:

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

The new element is a `div` with `overflow-x: auto`, which says: “if the content is wider than me, show a horizontal scroll bar *inside me*, not on the page”. With that, the whole page measures 320 px (the window's width) and only the table slides. I measured this page at the five widths and the page's overflow is zero in all of them.

The `div`'s three attributes deserve an explanation, because they are a deliberate exception to the rule of “do not put accessibility attributes that are not needed”:

- `tabindex="0"` makes the box receive focus with the Tab key. Without it, someone who uses only the keyboard cannot scroll the table: the arrow keys only scroll a region that has focus. It is what [criterion 2.1.1 (“Keyboard”)](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html) demands. [Chrome, since its version 132](https://developer.chrome.com/blog/keyboard-focusable-scrollers), makes a scrolling container focusable by itself when it has no focusable children, but other browsers do not guarantee it, so it is written by hand.
- `role="region"` and `aria-labelledby="table-caption"` give it a name —the table's caption— so that a screen reader says “Estado de los servicios en la última revisión, region” on arriving, instead of a mute “group”. It is the recipe Adrian Roselli publishes, and an update of his from 2026 clarifies that the role may be optional for complying with the standard; the name helps all the same.

I checked the final dashboard with the keyboard: with Tab, focus goes through the “Resumen” link, the “Servicios” link, the search field, the radio group (a single stop, because the radio buttons of a group count as one), the “Revisar ahora” button and, last, the table's box, identified as `region`. With focus on the box, the left and right arrows scroll the table. And the focus outline that Lesson 3 defined with `:focus-visible` is seen around the box, so that whoever navigates with a keyboard knows where they are.

#### 5.2.3 When `@media` is needed after all

There is still a change that neither Flexbox nor Grid ask for on their own: on a 1440 px screen the summary and the table fit side by side, and on a 375 px one they do not. That is not deciding how many columns fit in a row: it is deciding **how the entire page is organized**. For that there are **media queries** (`@media`): [rules that apply only if the window meets a condition](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries).

[The modern syntax uses comparisons](https://www.w3.org/TR/mediaqueries-4/), as in mathematics:

```css
@media (width >= 64em) {
  .layout {
    grid-template-columns: 20rem minmax(0, 1fr);
  }
}
```

It says: “when the window's width is 64 em or more, the page's grid has a 20 rem column and another that takes the rest”. The `(width >= 64em)` form is called **range syntax**: browsers have understood it since 2022 and 2023 [(Chrome and Edge 104, Firefox 102, Safari 16.4) and the platform considers it widely available since September 2025](https://web-platform-dx.github.io/web-features-explorer/features/media-query-range-syntax/). It used to be written `(min-width: 64em)`, which means exactly the same; you will see it in any earlier code.

Two decisions of the rule deserve an explanation:

**The unit is `em`, not `px`.** The breakpoint is measured in `em` (an `em` is the browser's font size, 16 px by default). That way, if someone enlarges the browser's base font size, the breakpoint moves with it: 64 em is equivalent to 1,024 px only if the reader did not touch their setting; if they left it at 150%, it is equivalent to 1,536 px, and the page changes organization at the right moment for *that* font size. [MDN recommends it](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_design): breakpoints in relative units age better.

**The phone layout is written first.** The base rule (without `@media`) is the narrow width's: one column. What is for the large width is *added* inside the query. This is called **mobile first** and the reason is practical: the simplest goes first and is what devices with fewer resources receive, without overhead; the complex is added only where there is room for it. The opposite order (writing the desktop's first and then undoing it with `max-width`) forces you to cancel rules, and each cancellation is a place to go wrong.

And a warning that acts as a counterweight: **a breakpoint is chosen not for a device, but for the content**. The right question is not “how wide is an iPhone?”, but “from what width does what is there stop looking good?”. Drag the window's edge until something breaks or looks wasted; that is where the breakpoint goes. The list of phone models changes every year; the content does not.

#### 5.2.4 The box decides, not the window: `@container`

There is a case that `@media` does not solve well. Look at `fig05_05.html`. In a wide window, the summary column measures 20 rem (320 px); in a 375 px phone window, the summary takes up the whole width: 343 px. They are two situations with about the same width for the summary and window widths of 1440 and 375. A media query (which only sees the window) would have to guess how much space the summary has in each case. What really matters is **the width of the box it is in**, not the window's.


For that there are **container queries**. A box is declared as a queryable container and then its width is asked about:

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

Four pieces:

- [`container-type: inline-size` declares](https://www.w3.org/TR/css-contain-3/) `.summary` as a container queryable by its width.
- `@container (width < 24rem)` applies the rules inside only if **that container** measures less than 24 rem (384 px). The condition has the same range syntax as `@media`.
- Inside the query, the summary's four boxes become compact rows (`display: flex`, with the term on the left and the value on the right). It is what you see in the sidebar and on the phone: one row per figure, instead of a tall square.
- `white-space: nowrap` is insurance: it prevents “465 ms” from splitting into two lines if the compact row narrows further. With the Lesson 3 stylesheet's font sizes it did not turn out to be needed (I measured it: the figure takes a single 32 px line with the rule and without it, in the sidebar and on a 375 px phone), but it costs one line and protects the day someone enlarges the text or the figure is longer.

Two restrictions that are better learned at once. First: **a container query can only change the container's descendants, not the container itself.** That is why the rules point at `.summary div` and not at `.summary`. Second: `container-type: inline-size` means the container's width no longer depends on its content (the parent gives it), and that is why it is declared on a box whose width comes from outside, like a grid or a column.

[Container queries work in the three main engines](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries) since February 2023 (Chrome and Edge 105, Safari 16, Firefox 110) and the platform considers them widely available since [August 14, 2025](https://web-platform-dx.github.io/web-features-explorer/features/container-queries/). When a component is going to live in places with different widths —a sidebar, a main column, a pop-up window—, this is the right tool.

A notice for the validating habit you learned in Lesson 3. If you run this stylesheet through [the W3C CSS validator](https://jigsaw.w3.org/css-validator/), it no longer answers “Congratulations! No Error Found”: I checked it by sending it `fig05_06/styles.css` and it answered with two errors, “La propiedad “container-type” no existe” and “la regla-arroba “@container” no está implementada” (the validator answered in Spanish: “the property “container-type” does not exist” and “the at-rule “@container” is not implemented”). They are not errors of your stylesheet, but a limitation of the validator, which does not yet know container queries although browsers have used them since 2023. When you validate, check that the only errors are those two; any other is indeed yours.

#### 5.2.5 Size of the targets

One more thing, which shows above all on a touch screen, where the thumb is less precise than the cursor, but which holds for any pointer: the mouse, a stylus or the finger. [Criterion 2.5.8 of the standard (“Target Size (Minimum)”)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) asks that targets activated with a pointer measure at least **24 by 24 CSS pixels**, with exceptions (if there is enough space around, if the target is inside a sentence, if the size is set by the browser). Those who need it most are people with hand tremors or with little movement precision, whatever device they use. In the dashboard, the buttons and the search field carry `min-height: 2.5rem` (40 px) since Lesson 3: more than one and a half times the minimum, because 24 px is a floor, not the size a thumb hits comfortably.

#### 5.2.6 The lesson's finished dashboard

With all of the above, the lesson's complete dashboard is `fig05_06.html`. The HTML changes with respect to Lesson 4's dashboard are three, and none changes what the HTML says: the `layout` class on `<main>`, the `div.table-scroll` with its table inside, and the `id="table-caption"` on the table's caption, which the wrapper's `aria-labelledby` points to.

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

And this is the complete stylesheet, which is Lesson 4's with the adaptive layout added (the comments mark which lesson each part comes from):

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

With respect to Lesson 4's stylesheet there are two adjustments, one change and three new rules, and nothing else. The adjustments: the maximum width of `header`, `main` and `footer` goes up from 60 to 80 rem, so that on a wide screen the two columns are not squeezed; and the sections lose their `margin-bottom`, because inside the grid the separation is set by `.layout`'s `gap`, which is Lesson 4's rule (4.1.2): spacing between siblings is set by the parent. The change: the `.summary` rule drops `repeat(4, 1fr)` for the columns that count themselves and adds `container-type`, as in 5.1.4. The new rules go in the layout block, which now gathers those of the two lessons: `.layout` with `minmax(0, 1fr)` and, from 64 em, two columns; the summary's container query; and the `.table-scroll`. The header, the controls bar, the layers, the variables, the focus and the badges stay as they were: adaptivity is added to what was there, it does not rewrite it. (The order of the rules inside the block changed with respect to Lesson 4: first the page, then the summary, then the controls. It is the order in which they are read by whoever opens the file from top to bottom, and it does not alter the result, because none of those rules competes with another for the same property.)

This lesson's starting point, `fig05_01.html`, is Lesson 4's dashboard with its `<link>` pointing to the copy of the stylesheet that lives in this folder; you have it in full below, in case you want to compare or do not have the previous lesson's:

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

and its stylesheet, `fig05_01/styles.css`, is `fig04_06/styles.css` without a single change except for the comments at the top:

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

Measure the finished dashboard as you measured the initial one. I measured `fig05_06.html` at 320, 375, 768, 1024 and 1440 px: the page's width equals the window's in all five, and the console comparison returns `false`. At 1440 px the summary ends up in a 20 rem column on the left and the table on the right, with the controls bar above the table in a single row; at 320 px, everything in one column, with the table scrolling inside its box. The **phone's** width, which was the problem that opened the lesson, no longer is.

#### 5.2.7 Take it to your `revisor`

So far you worked with the repository's pages. What is missing is the step that turns what you learned into your project: making **your** `revisor` end up the same as `fig05_06.html`, measured and saved in Git. There are four steps, and none asks you to write anything new.

**1. The stylesheet.** Open `fig05_06/styles.css` (in the repository, or copy it from the complete block above) and paste its content into your `~/revisor/css/styles.css`, in place of what was there. You can replace it entirely because it is Lesson 4's stylesheet with the adjustments and rules you have just read: nothing is lost. If in the earlier lessons you made changes of your own to your stylesheet (another color, another size), then do not replace it: make the two adjustments by hand (the maximum width of `header`, `main` and `footer` goes up to `80rem`; `section` loses its `margin-bottom`), change the `.summary` rule to the one in 5.1.4, and add to Lesson 4's block the `.layout` rule with its `@media`, the summary's `@container` and the `.table-scroll`.

**2. The page.** In your `~/revisor/index.html` make the HTML changes, which are those of the list in 5.2.6:

- `<main>` becomes `<main class="layout">`.
- The table ends up inside `<div class="table-scroll" role="region" aria-labelledby="table-caption" tabindex="0">`, just as in 5.2.2.
- The one that gets forgotten: the `<caption>` carries `id="table-caption"`. Without that `id`, the wrapper's `aria-labelledby` points to nothing and the region is left without a name.

You can also copy `fig05_06.html` in full over your `index.html`, with one precaution: in the repository, its `<link>` points to `fig05_06/styles.css`; in your project it must say `href="css/styles.css"`, as since Lesson 3. If you do not change it, the page will look unstyled.

**3. Measure.** From the project folder, start the server:

```bash
$ cd ~/revisor
$ python3 -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000/`, turn on responsive mode and repeat the lesson's measurement: the console line must return `false` at 320, 375, 768, 1024 and 1440 px, and the page must look the same as `fig05_06.html` at the same widths. I did it with a `revisor` folder put together like this: at 320 px the page measures 320 and the table's box 238 px, with the table scrolling inside; at 1440 px, the two columns. If something does not match, compare your file with the repository's: it is almost always a class that was not written or a `div` that was closed somewhere else.

**4. Save it in Git.** Stop the server with `Ctrl`+`C` (or open another terminal) and ask Git what changed, as in Lesson 1:

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

They are exactly the two files you touched. (If any other appears, it is an earlier change of yours that you did not save: check it with `git diff` before deciding whether it goes in this commit.) Check with `git diff` that the changes are the ones you wanted, and save them:

```bash
$ git add index.html css/styles.css
$ git commit -m "Adapta el panel a cualquier ancho de pantalla"
$ git status
En la rama main
nada para hacer commit, el árbol de trabajo está limpio
```

`git commit` prints a line with the commit's code and how many lines changed; the numbers depend on your files. With that, your `revisor` is ready for Lesson 6, which starts exactly from here.

## The error you will see

Layout errors are almost never messages: they are a page that looks “wrong” without saying why. In this lesson there are two, and both are measured. The first you have just seen in the `viewport` tag: without it, the page does not overflow, but everything looks tiny, and the only clue is the `window.innerWidth` number. The second is the one that opened the lesson.

**The page wider than the window.** Open `fig05_01.html` at 320 px. The signal is the horizontal scroll bar, or the console:

```js
document.documentElement.scrollWidth > document.documentElement.clientWidth
```

which answers `true`. To find *who* goes past, in the tools hover over the elements in the elements panel: the browser shades the area of each one, and the one that comes out of the window's right edge is the culprit. In `fig05_01.html` there are two: the table, which reaches 414 px, and the summary, which reaches 369. You already have both solutions: the wrapper with `overflow-x: auto` for the table, and the columns that count themselves for the summary. A tip for when there are several culprits: fix one, measure again and look for the next. The page measures what the **widest** one measures, so while one remains, the measurement keeps giving `true` even though you fixed the other, and it is easy to believe the fix did not work.

**And a confusing variant:** the table is already in its box with `overflow-x: auto`, and even so the page is still wider than the window. It is the inflated grid of section 5.1.3: the page's column is declared as `1fr` and expands by the table's width. It is fixed with `minmax(0, 1fr)`. If you run into this in another project, you now know where to look: not at the table, but at the column that contains it.

## What gets done wrong

**A media query per device.** `@media (width: 390px) { ... }` “for the iPhone”. It covers a single width, of a single model, of a single year. A foldable phone, a half-size window or a screen with enlarged text fall between those points, and there the page is not planned for. Cost: a list of devices that grows every year and is never up to date.

**Hiding the overflow instead of fixing it.** `body { overflow-x: hidden }` makes the scroll bar disappear and leaves the content cut off: what is beyond the edge can no longer be seen or reached. It is worse than the defect, because it *looks* fixed. Criterion 1.4.10 asks that no information be lost when enlarging; cutting the page off is losing it.

**Turning the table into something else so that it “fits”.** Changing the `display` of `table`, `tr` and `td` to `block` or `grid`, or rebuilding the table with `div`. It can take away the table role and cell navigation from whoever uses a screen reader. In Chrome 154 the table with `display: grid` kept its role, but the course's rule does not depend on the same happening in every browser and reader: the table is left as a table and wrapped.

**Removing zoom “so it does not move”.** `user-scalable=no` or `maximum-scale=1` in the `viewport` tag. It prevents zooming in on the page, which is what whoever has low vision uses to read it.

**Giving a container of uncertain width a `1fr` column.** It is the inflated grid of 5.1.3: it goes unnoticed as long as the content is short and blows up the day a wide table, a long identifier or a URL without spaces arrives. It costs an afternoon, because the culprit seems to be the content and it is the column.

## Exercises

### Exercise 1 — Fewer figures, same columns

Copy `fig05_03.html` and leave only three figures in the summary: remove “Respuesta promedio”. Without touching the CSS, measure each card's width at 768, 1024 and 1440 px (the browser's developer tools give you each element's width when you select it). Then change `auto-fit` to `auto-fill`, measure again at those three widths and explain at which there was a difference and why (use what you saw with two cards in 5.1.2).

### Exercise 2 — Break the page's grid on purpose

In a copy of `fig05_06.html`, change `minmax(0, 1fr)` to `1fr` in the `.layout` rule. Measure the page's width at 320 px with the console line. How much does it give? Then find with the browser's developer tools which element makes the grid grow and explain why, if the table was already in its box with `overflow-x: auto`, the page overflows all the same.

### Exercise 3 — A breakpoint decided by the content

In `fig05_06.html`, the controls bar goes from three rows (at 320 px) to two and then to one as the window widens. Without looking at a single phone model, find with responsive mode the window width at which it goes from two rows to one, and write it down. Then keep widening: from 1024 px, and up to a little more than 1160, the bar takes up two rows again. Explain both findings with the sum of what each piece measures.

## Solutions

### Solution 1

I measured it with three cards with an 11 rem floor. With `auto-fit`: at 768 px, three 235 px columns; at 1024 and at 1440 px, three 299 px columns. The last two measurements are equal because the stylesheet limits the content to 60 rem since Lesson 3: from a 960 px window onward, the container no longer grows and measures 928 px. With `auto-fill` the result is identical at 768, and different at 1024 and at 1440: there four 220 px columns fit, the three cards take up the first three and one empty column is left on the right.

The difference only appears when there are **fewer cards than possible columns**, and that happens at 1024 and at 1440 px. At 768 px exactly three columns fit for three cards and none is left over. `auto-fit` collapses the columns without content and lets those that have it stretch; `auto-fill` keeps them, even if they are empty.

### Solution 2

With `1fr` in the page's grid, the measurement gives **439** at 320 px (the comparison returns `true`): it is what the table measures, plus its section's padding and the page's. The element that widens everything is the grid's column, and the section that contains it. The table is indeed inside its box, with `overflow-x: auto`, but the box cannot be narrower than its column, and the `1fr` column has a minimum of `auto`, which is the content's minimum width, table included. So the column inflates, the box inflates with it, and the box no longer has anything to scroll: now everything fits in a wide box, which in turn overflows the page. With `minmax(0, 1fr)` the minimum is zero, the column measures what the window allows and the table, which is still wide, scrolls inside a 238 px box.

### Solution 3

The bar fits in one row when its box measures at least what its three pieces add up to plus the two spaces between them. I measured it in `fig05_06.html`: the field has a basis of `14rem` (224 px), the radio group measures 345 px (each label carries the 1 rem right margin Lesson 3 gave it), the button 135 px, and the `gap` puts 16 px twice. The sum is 224 + 345 + 135 + 32 = **736 px**. In that zone the page is a single column, and the controls' box measures the window's width minus 82 px: 32 of `main`'s padding, 48 of the section's padding and 2 of its border. So the bar goes to one row with a window of **818 px**, which was exactly the first width that gave a single row when measuring pixel by pixel.

The second finding is the one that teaches most: at 1024 px the page changes to two columns (`@media (width >= 64em)`), and the controls' box is left at 598 px, which is less than 736: the bar splits again into two rows. Only from 1162 px does the box recover 736 px and fit in one again. **The width that matters to the bar is not the window's, but its box's**, and its box's width does not grow evenly with the window's, because in between the page changed organization. That is why `flex-wrap` solves this without any written number: the bar drops to the next row when its box is narrow, whether because of the window or because of a side column. If you had written a media query with “818 px”, it would have been right at 820 and wrong at 1024.

## How I know I got it

- [ ] `fig05_01.html` at 320 px returns `true` with the console line (the page's width is 414 px), and `fig05_06.html` returns `false` at 320, 375, 768, 1024 and 1440 px.
- [ ] `fig05_02.html` on an emulated 390 px phone shows `window.innerWidth` of 980; `fig05_03.html` on the same phone shows 390.
- [ ] In `fig05_06.html` at 1440 px the summary is on the left in one column and the table on the right; at 320 px everything goes in a single column, and only the table scrolls sideways, inside its box.
- [ ] With Tab, focus goes in this order: “Resumen” link, “Servicios” link, search field, radio group, “Revisar ahora” button and the table's box (which is announced as a region). With focus on the box, the arrows scroll the table.
- [ ] The buttons and the search field measure at least 40 px high (`min-height: 2.5rem`, since Lesson 3), and the browser's inspection tool confirms it.
- [ ] You can explain in your own words what each piece of `repeat(auto-fit, minmax(min(100%, 11rem), 1fr))` does, why `1fr` by itself is not enough in a column that will contain something wide, and what the difference is between a media query and a container one, with an example from the dashboard for each.
- [ ] Your `~/revisor` (served from its folder at `http://127.0.0.1:8000/`) looks the same as `fig05_06.html`, returns `false` at the five widths, and `git log --oneline` shows the commit with the adaptive dashboard.

## Summary

To consolidate what you have just seen, answer without looking at the lesson:

1. What does a phone's browser do with a page that does not carry the `viewport` tag, and what figure did we measure?
2. Where does the 320 come from and whom does it protect, besides whoever uses a phone?
3. Why does `repeat(4, 1fr)` overflow at 320 px, if `1fr` is “a fraction of the space”?
4. What is the difference between `auto-fill` and `auto-fit`, and which did you use for the summary?
5. Why is a wide table wrapped and not rebuilt with another `display`? What three attributes does its wrapper carry and what is each for?
6. Why is the breakpoint written in `em` and chosen by looking at the content, not a phone model?
7. Why can `@container` not change the container itself?

If you get stuck on any answer, go back to the corresponding section: it is a sign that a piece is loose there, not that you are no good at this.

## Further reading

- [MDN, “Responsive design”](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_design) — Mozilla's learning module on `viewport`, mobile first and breakpoints. Accessed on October 7, 2026.
- [W3C, “Understanding Success Criterion 1.4.10: Reflow”](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) — where the 320 comes from and what part of the content may scroll. Accessed on October 7, 2026.
- [MDN, “Container queries”](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries) — how a queryable container is declared, the syntax of `@container` and why a query cannot change its own container. Accessed on October 7, 2026.
