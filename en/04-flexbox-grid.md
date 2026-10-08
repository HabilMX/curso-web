# Lesson 4 — Laying out with Flexbox and Grid

**Time:** two sessions of about 90 minutes. A split that works: the first one, “The why before the how” and Flexbox (4.1), with the controls bar; the second one, Grid (4.2), the laid-out dashboard, taking it to your `revisor` (4.2.5) and the exercises. Each session ends in a page that you can open and measure.

**What you build:** the dashboard laid out on a wide screen

**What you learn:** one dimension with Flexbox and two with Grid; the two axes, `gap`, `flex` and `flex-wrap`; columns with `fr` and `repeat()`; measuring with the browser's developer tools instead of by eye

**Where you come from.** You bring the dashboard from [Lesson 2](02-html-con-significado.md), written by hand with HTML that says what each thing is, and the stylesheet from [Lesson 3](03-css-cascada-caja.md), with its color variables, its predictable box and its status badges. That stylesheet **does not lay out anything yet**: each element goes below the previous one, which is what the browser does when nobody asks it for anything else. If for any reason your copy does not match the one in those lessons, it does not matter: the page `fig04_01.html` and its stylesheet `fig04_01/styles.css` are exactly that starting point, and you have it in full further down. All the pages of this lesson are in [`programas/04-flexbox-grid/`](https://github.com/HabilMX/curso-web/tree/main/programas/04-flexbox-grid) of the [course repository](https://github.com/HabilMX/curso-web). Notice a detail before opening them: all except the laid-out dashboard load the starting stylesheet with `<link rel="stylesheet" href="fig04_01/styles.css">`, a *relative* path that the browser looks for in the `fig04_01` folder next to the page. That is why they work if you download (or clone with Git) the whole repository and start the server from its `programas/` folder, or if you copy each page **together with** the `fig04_01` folder. If you copy only the `.html`, the page will look unstyled: the browser requested `fig04_01/styles.css`, the server answered `404` and the Network tab of the developer tools shows it to you in red. `fig04_06.html`, the laid-out dashboard that the lesson ends with, likewise uses its own stylesheet, `fig04_06/styles.css`. For this lesson you work with two files of your `revisor` folder, `index.html` and `css/styles.css`, and, for the loose experiments, with test pages next to them. From the project folder, the local server is still `python3 -m http.server 8000 --bind 127.0.0.1`.

**What this lesson does not do.** It does not yet solve the phone: making the page work at 320 pixels wide is the whole topic of [Lesson 5](05-pagina-adaptable.md), which starts exactly where this one ends. It does not touch JavaScript either. The summary's figures are still written by hand; a program will count them in Lesson 6 and Lesson 7 will draw them in the table. Today only *where* each thing goes and *how big* it is changes, not *what* it says.

## By the end you will be able to

- Explain what a flex container, its items and its two axes are, and predict what `justify-content` and `align-items` do before reloading.
- Write a controls bar with `display: flex`, `flex-wrap`, `gap`, `align-items` and `flex`, and say who gets the leftover space.
- Read the `flex` property as basis, grow and shrink, and recognize when an item refuses to shrink and how it is allowed to.
- Choose Flexbox when the distribution is in a single dimension and Grid when it is in two, and justify the choice with the dashboard in front of you.
- Declare a grid with `grid-template-columns`, the `fr` unit and `repeat()`, and explain where the rows you did not declare come from.
- Measure with the browser's developer tools where each box starts and ends, instead of judging by eye.
- Keep the HTML's order as the reading order, without rearranging with `order` what the keyboard walks through.

## The why before the how

Open `fig04_01.html` on your local server, with the browser window very wide, like a desktop computer's. What you see is the dashboard as Lesson 3 left it: readable, with its colors and its badges, but **laid out like a shopping list**. The title, the date and the navigation links go one below the other, although there is room to put them on a single line. The summary's four figures are four rows, one below the other, each across the whole width. The search field, the filters and the button are also stacked. And the table ends up at the bottom, after everything else.

Measure it instead of assuming it. I measured it with Chrome 154, automated and windowless, with the window at 1440 pixels: the content is a 60 rem (960 px) centered column, and inside it **every box takes up all the width it has**: the title, the date and the navigation each measure 928 px, and inside the sections, with their padding, the “Caídos” figure measures 878 px, like the table and like the paragraph where the “Revisar ahora” button lives. The button does not: it measures about 135 px, because a button is an inline element and only takes up what its text needs; what stretches is the paragraph that contains it. Nothing overflows and nothing is badly written, but space is wasted: to reach the table, which is what whoever opens the dashboard comes to see, you have to go past three rows of header, four figures and three controls, each in its own row. The four figures would fit in a single row with room to spare, and so would the three controls.

There is a single cause. **Until now, the dashboard does not decide how to lay out what it carries inside.** A block goes below another because that is what normal page flow does, and each box measures the whole width because nobody told it otherwise. This lesson teaches it to decide with the two tools CSS has for that: **Flexbox**, to distribute things along a line, and **Grid**, to arrange them in rows and columns at once.

An honest warning from the start, so it does not catch you by surprise: at the end of this lesson, the dashboard will look good on a wide screen, and still **not** on a phone. If you shrink the window to 320 pixels, the page still overflows. That is not an oversight: it is a different problem, with its own tools, and it takes up the whole next lesson. Here you learn to lay out; in Lesson 5, to make the layout work at any width.

### How you will check

A layout is hard to judge by eye: two boxes that “look” the same width differ by twenty pixels, and a gap that “looks” even is not. That is why in this lesson you will measure, and you already have the tool: the browser's developer tools that you met in Lesson 1.

Open them with `F12` and go into the elements tab (in Chrome and Edge it is called “Elements”; in Firefox, “Inspector”). Hover over any tag in the document tree: the browser shades that box on the page and shows a small label with its name and its measurements, for example, in `fig04_01.html` at 1440 px, `dl 878 × 297.38` for the summary list. The first number is the width and the second the height, in CSS pixels. If you click the tag, the panel on the right shows you in the “Computed” section its complete box: content, padding, border and margin. And when an element is a flex or grid container, the tree puts a small badge next to it that says `flex` or `grid`; when you click it, the browser draws over the page the grid's lines or the outline of each flex item. That badge is the fastest way to know whether a layout property is acting or not.

To know where a box **starts** and where it **ends**, which is what you will use to check most of this lesson's results, responsive mode helps (the phone and tablet icon in Chrome and Edge; `Ctrl`+`Shift`+`M` in Firefox): there you type the exact width of the window, and the ruler at the top gives you the positions. When in this lesson you read “the title goes from 256 to 553 px”, it means its left edge is 256 pixels from the window's left edge and its right edge at 553: the same as you would see by hovering over it with the window at that width.

## The concepts

Two ideas, in this order: **Flexbox**, which arranges things in a line, and **Grid**, which arranges things in rows and columns at once. Each is first explained with a minimal example, in a test page that you can open and measure, and then applied to the dashboard.

### 4.1 Flexbox: laying out in one dimension

#### 4.1.1 Container, items and the two axes

By default, an element's children are arranged according to **normal flow**: block elements (`<p>`, `<div>`, `<section>`) go one below another and take up all the available width, and inline ones (`<span>`, `<a>`, `<label>`) flow like the words of a line. Normal flow is the reason the previous lesson's dashboard is a long column.

[**Flexbox** is an alternative layout mode](https://www.w3.org/TR/css-flexbox-1/) that is activated with a single declaration on the *parent*:

```css
.container {
  display: flex;
}
```

With it, the parent becomes a **flex container** and its direct children become **flex items**. Only the direct children: the grandchildren do not notice. The first thing you notice is that the children, which used to go one below another, now go side by side, in a row. But what matters is not the row: it is that the container now **distributes the space** among its children, and you tell it how.

Flexbox works with two axes, and almost all beginner mistakes come from confusing them. The **main axis** is the direction in which the items are arranged; the **cross axis** is the perpendicular one. With the default value, `flex-direction: row`, the main axis is horizontal (left to right in English) and the cross axis is vertical. If you write `flex-direction: column`, they swap: the main one becomes vertical. Two properties rest on that distinction, and that is why it is worth learning it before the names:

- `justify-content` distributes the items **along the main axis**.
- `align-items` aligns them **across the cross axis**.

Open `fig04_02.html` to see it. It is a test page with two dotted-line boxes, each with three blue items of different heights:

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

In the first box (`row`), `justify-content: space-between` sticks “Uno” to the left edge, “Tres” to the right edge and leaves “Dos” in the middle, with the leftover space distributed in the gaps. `align-items: center` centers the three vertically, so although they have different heights they all share the same center line. In the second box only the direction changes: the main axis is now vertical, so `justify-content: space-between` distributes downward (“Uno” on top, “Tres” at the bottom) and `align-items: flex-start` sticks everything to the left edge, which is now the cross axis's edge. **The properties did not change meaning: they changed direction.** That is what “the axes” means.

The values you will use most are few:

| Property | Value | What it does |
|---|---|---|
| `justify-content` | `flex-start` (default) | Sticks the items to the start of the main axis |
| `justify-content` | `center` | Gathers them in the center |
| `justify-content` | `space-between` | First at the start, last at the end, the rest distributed between them |
| `justify-content` | `flex-end` | Sticks them to the end |
| `align-items` | `stretch` (default) | Each item stretches to fill the cross axis |
| `align-items` | `flex-start` / `center` / `flex-end` | Aligns to the start, the center or the end of the cross axis |
| `align-items` | `baseline` | Aligns by the text baseline, useful when font sizes differ |

A useful detail: the default value of `align-items` is `stretch`, and that is why, as soon as you turn on `display: flex`, the items in a row **that have no height of their own** stretch to the height of the row and all become equally tall. It is a side effect that surprises the first time. The condition matters: [`stretch` only stretches whoever has the height at `auto`](https://developer.mozilla.org/en-US/docs/Web/CSS/align-items#stretch); an element with a written `height` keeps its own and stays stuck to the start of the cross axis. I measured it by removing `align-items: center` from the first box of `fig04_02.html`, so that the default `stretch` remains: the box measures 144 px on the outside and has 124 left on the inside, after subtracting its padding and border. “Uno”, which has no height of its own, stretched to those 124 px; “Dos” and “Tres”, which have one written (`5rem` and `2.5rem`), stayed at 80 and 40 px, stuck to the top.

#### 4.1.2 The space between items: `gap`

Between flex items some air has to be left. The old habit was to put a `margin` on each child, and it ran into two problems: the last item is left with an extra margin, and when items drop to the next row you have to guess which margins are left over. [The `gap` property, which is written on the container](https://www.w3.org/TR/css-align-3/), solves both: it puts the space only *between* items, never at the edges, and the same horizontally as vertically. You can give one value (`gap: 1rem`) or two (`gap: 0.5rem 1rem`: first the space between rows, then the space between columns).

`gap` works in Flexbox and in Grid, and today it is one of the things you can use without fear, although it arrived in the two at different dates, and it is worth knowing because you will see old code with margins in its place. In Grid, [MDN marks it as available in all browsers since October 2017](https://developer.mozilla.org/en-US/docs/Web/CSS/gap). In Flexbox it took longer: [the last browser to accept it was Safari 14.1, in April 2021](https://web-platform-dx.github.io/web-features-explorer/features/flexbox-gap/), and the platform considers it *widely available* (which means “available in all of them for at least 30 months”) since October 2023. The rule you will follow in this course is simple: **spacing between siblings is set by the parent with `gap`; margins are reserved for separating a block from one that is not its sibling.**

#### 4.1.3 How big each item is: `flex`

So far we have distributed the *leftover* space. What is missing is what happens when the items do not fit, or when there is some left over and one must take advantage of it. Three numbers control that, and they are written together in the `flex` property:

```css
flex: <flex-grow> <flex-shrink> <flex-basis>;
```

- The **basis** (`flex-basis`) is the item's starting size on the main axis. With `auto` it is the one it would have from its size property on that axis —`width` in a row, `height` in a column ([as the specification defines it](https://www.w3.org/TR/css-flexbox-1/#flex-basis-property))— or, if it has none, from its content.
- **Grow** (`flex-grow`) says how much of the leftover space the item receives. With `0` it receives nothing. With `1`, all the items worth `1` share the leftover in equal parts; one with `2` receives double that of one with `1`.
- **Shrink** (`flex-shrink`) says how much the item yields when space is lacking. With `0` it never yields; with `1` it yields in proportion.

The initial values are `0 1 auto`: it does not grow, it does shrink, it measures what its content measures. That is why, without your asking, a flex container full of items squeezes together before overflowing. There are shorthands worth recognizing: `flex: 1` means `1 1 0` (“take everything that is left over, starting from zero”), `flex: auto` is `1 1 auto`, and `flex: none` is `0 0 auto` (“fixed size”).

There is a trap that costs an afternoon the first time. A flex item **does not shrink below its content's minimum size**: a long word with no spaces, an image, a text field with a fixed width. [MDN describes it like this](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox): an item can shrink to its `min-content` size and no further. When that happens, the item stays wide and the container overflows. The solution has two parts: telling the item that it can shrink further, with `min-width: 0` (in a row; in a column, where the main axis is vertical, the equivalent property is `min-height: 0`), and giving its content a way to fit in less space (cutting it with an ellipsis or letting it wrap to the next line). With the first part alone, the item shrinks but the text spills out of it.

See it in `fig04_03.html`. They are two identical rows, each with a service's name, its address (a long URL, which has no spaces to break at) and the status badge. The address carries three declarations that ask “if you do not fit, cut yourself with an ellipsis”: `overflow: hidden`, `white-space: nowrap` and `text-overflow: ellipsis`. The only difference between the two rows is the class `can-shrink`, which adds `min-width: 0` to the name's box:

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

I measured it at 320 px, the width of a small phone. In the first row, the name's box refuses to measure less than the complete URL (417 px), pushes the badge off the screen and the page measures **514 px**: it overflows, although the address “knows” how to cut itself. The reason is the one above: a flex item's automatic minimum is the width of its content, and the entire URL is that content. In the second row, with `min-width: 0`, the name's box drops to 197 px, the URL is cut with “…” and the badge stays inside, 26 px from the window's right edge. At 768 px or more the two rows look the same, because there the URL fits completely: the trap only appears when space is lacking, and that is why it goes unnoticed on the programmer's screen.

In this lesson's dashboard it is not needed: no flex item in the dashboard has content that refuses to shrink. But the idea returns in Lesson 5 under another name: a Grid `1fr` column has the same automatic minimum, and the solution, `minmax(0, 1fr)`, is the same idea of writing the minimum zero on purpose.

#### 4.1.4 `flex-wrap`: dropping to the next row instead of squeezing

By default, a flex container has `flex-wrap: nowrap`: all the items go in **a single row**, and if they do not fit, they shrink (and if they can no longer shrink, they overflow). With `flex-wrap: wrap`, the items that do not fit **drop to the next row**. MDN puts it in a useful sentence: when there are several rows, each behaves like a separate flex container. That means `justify-content` and `flex-grow` act inside each row, not over the whole.

The decision of who fits in which row is made with each item's *basis*, before growing or shrinking, but adjusted by its limits: if the basis is less than its `min-width` (or greater than its `max-width`), the limit counts, and its margins count too. [The specification](https://www.w3.org/TR/css-flexbox-1/#algo-line-break) calls it the *hypothetical main size*. I measured it in Chrome 154: two items with a 200 px basis fit together in a 500 px row; if you give the second one `min-width: 320px`, it drops to the next row, although its basis did not change. Here is the trick that supports almost everything “adaptive” without writing a single media query, and that Lesson 5 will take full advantage of: **if you give an item a reasonable basis and allow it to grow, the browser takes care of laying it out**. A basis of `14rem` says “I prefer to measure about 224 px; put me in a row with whoever fits beside me; if there is room left, share it”. On a wide screen, several fit in the row; on a narrow one, each drops and takes up its whole row. Nobody wrote “at 600 px do such-and-such”: the content decides.

#### 4.1.5 Worked example: the controls bar

The dashboard's “Servicios” section today has three controls one below another: the search field with its label, the group of filters (the three radio buttons) and the “Revisar ahora” button. On a wide screen the natural thing is a single row; on a phone, three rows. It is the perfect case for Flexbox, because they are siblings sharing *one* line.

First the HTML has to be prepared. You already have the three controls; they have to be wrapped in a named container so CSS can point at it. And the field with its label is grouped so they travel together. This is the only HTML change in this step:

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

Notice what was *not* touched: the elements are still those of Lesson 2, with their associated labels. The only new things are a container `div` and a class. The meaning did not change; only a place to point at was added. Now the CSS:

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

Line by line:

- `.controls { display: flex; flex-wrap: wrap; ... }` turns on Flexbox and allows dropping to the next row. The three direct children (the field, the group and the button) are now flex items.
- `align-items: flex-end` aligns them by their bottom edge. That way the field, the group of filters and the button share the same base, although their heights are different, and look like a single bar. With the default value, `stretch`, the button would stretch to the group's height.
- `gap: 1rem` puts the space between them, without loose margins.
- `.controls p, .controls fieldset { margin: 0 }` removes the margins they carried by default; now the space is set by the parent.
- In `.field`, which is in turn a flex container, `flex-direction: column` stacks the label over the field, and `flex: 1 1 14rem` tells the field: “measure 14rem as a basis, you may grow, you may shrink”. It is the only one of the three that grows, and that is why it absorbs the row's leftover space.
- `.field input { width: 100% }` makes the field fill its container. Without this line, the `.field` paragraph would grow, but the field would keep the width the browser gives a text field by default, and the gained space would be left empty to its right.

I loaded this page at five widths (320, 375, 768, 1024 and 1440 px) and in all five the page's width equals the window's: the bar overflows at none. At 320 and 375 px the controls form three rows; from 768 px on, a single row, with the field taking up everything that is left over. At 1440 px I measured it piece by piece: the field goes from 256 to 672.5 px (416.5 wide, much more than its basis of 224), the radio group from 688.5 to 1033 and the button from 1049 to 1184, stuck to the content's right edge. Between one piece and the next, the 16 px of the `gap`.


There is a Flexbox property you should know about, precisely so as not to use it lightly: `order`. It lets you change the *visual* order of the items without moving the HTML. The problem is that the keyboard and the screen reader follow the **code's** order, not the screen's: whoever navigates with Tab would jump from one side of the bar to the other without understanding why. That fails the guidelines' [criterion 1.3.2 (“Meaningful Sequence”)](https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html) and [2.4.3 (“Focus Order”)](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html). The course's rule: **the HTML's order is the reading order; if a box must go first, it is written first.**

### 4.2 Grid: laying out in two dimensions

#### 4.2.1 Flexbox or Grid: the question that decides

Flexbox arranges in **a line** (with rows that drop if you allow it). [Grid arranges in **rows and columns at once**](https://www.w3.org/TR/css-grid-2/): it defines a grid and places each item in a cell. They are alike in that both start with a `display` declaration on the parent and both accept `gap`. They differ in who is in charge.

In Flexbox **the content is in charge**: the items are the ones that ask for space and the container distributes it. That is why it is perfect for a controls bar, a header with title and date, a row of buttons: groups of things whose size depends on what they say. In Grid **the grid is in charge**: the columns exist first, and the items are placed in them, so that they end up aligned both horizontally and vertically. That is why it is perfect for summary cards, a board of figures or the page's skeleton.

A practical question to decide: *do I want the things in the second row to be aligned with those in the first?* If so, it is Grid. If each row lays itself out on its own, it is Flexbox. And they are not mutually exclusive: in the dashboard you will use both, one inside the other.

#### 4.2.2 Columns, `fr` and `repeat()`

To activate Grid you write `display: grid` on the parent, and tell it how many columns it has with `grid-template-columns`:

```css
.summary {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.75rem;
}
```

The new unit is `fr`, for *fraction*: “one part of the available space”. Three `1fr` columns distribute the width in three equal parts; `1fr 2fr` would give the second double the first; `200px 1fr` fixes the first column and leaves the second with everything else. Repeating the same thing three times is tiring, and that is why `repeat()` exists: `repeat(3, 1fr)` is the same as `1fr 1fr 1fr`.

You do not need to tell it how many rows there are. If there are six items and three columns, the browser creates two rows on its own. [MDN calls them the **implicit grid**](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Basic_concepts_of_grid_layout): the one that extends when there is content outside of what you declared (the declared one is the *explicit* one). Its height is controlled with `grid-auto-rows`; by default, each row measures what its content asks for.

A way to convince yourself that you understood the implicit grid: with four items and `repeat(2, 1fr)`, how many rows are there? Two, with two items each, and nobody declared them. Exercise 2 asks you to check it with the summary's figures.

#### 4.2.3 Worked example: the summary in four columns

The dashboard's summary is the textbook case for Grid: four figures that are best seen together, each with its name on top and its value below, and aligned with each other. Before the CSS, the HTML. Lesson 2's summary is a description list (`<dl>`) with four groups of term and value, and there is nothing to change in its meaning. Only a class is added to it to point at it:

```html
<dl class="summary">
```

There is no need to touch the four boxes (`div`) that already wrapped each pair of term and value either: each becomes a grid item. This is what happens when the HTML already had the right structure: Grid just reads what was already written. The test page `fig04_05.html` declares four equal columns:

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

Line by line: `display: grid` turns the list into a grid container and its four `div` into grid items; `grid-template-columns: repeat(4, 1fr)` asks for four columns that share the width in equal parts; `gap: 0 1rem` leaves no space between rows (there is only one) and leaves 16 px between columns; and `margin: 0` removes the margin the description list carries by default, so that the space is set by whoever contains it. I measured it at 1440 and at 1024 px: the four figures end up in a single row, each column exactly **220 px**, with 16 px between one and the next. The numbers add up: the container measures 928 px, the three gaps total 48, and the remaining 880 divided by four gives 220.

A reasonable question before moving on: *does changing the `display` of an element with a meaning of its own take away its meaning?* I checked it in Chrome 154 with the accessibility tree: the description list with `display: grid` keeps its terms and definitions, and even a table with `display: grid` keeps its table role. In other browsers and with other screen readers there is no guarantee: [Adrian Roselli, who has been measuring this for years](https://adrianroselli.com/2020/11/under-engineered-responsive-tables.html), warns that changing a table's `display` can take away cell navigation from whoever uses a reader. Since there is no need to run the risk, the course's rule is: **a table's `display` is not changed; its wrapper's is**. Lesson 5 puts it into practice.

And now the honest part of the example. Shrink the window to 320 px and measure again: the four figures squeeze together, each splits into several rows, and even so the page **measures 344 px wide**, more than the window. Four fixed columns are a good decision when there is space and a bad one when there is not, and `1fr` has a hidden minimum that does not let the column shrink beyond its longest word. Why that happens, and the line of CSS that makes the grid **count by itself** how many columns fit, are the first concept of Lesson 5. For now, keep the question you will know how to answer when you finish it: *how many columns fit at 320 px, and who should decide?*

#### 4.2.4 The laid-out dashboard

With the above you already have all the pieces to lay out the complete dashboard on a wide screen. The lesson's dashboard is `fig04_06.html`. The changes with respect to Lesson 2 are few, and none changes what the HTML says: the `page-header` class on the header, the `summary` class on the description list, and the `div.controls` with its `p.field` around the three controls, just as in 4.1.5. The table stays exactly the same.

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

A warning before looking at the stylesheet: the row header (`.page-header`) is step 1 of Exercise 1. If you want to solve it on your own, do it before reading the CSS. The stylesheet is Lesson 3's **without touching a single one of its rules**, with a new block at the end of the `components` layer; the comments mark where it starts:

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

The new block has three parts, and you already know each one. The header (`.page-header`) is a flex container that distributes its three children with `space-between`, aligns them by the text baseline and allows them to drop to the next row; its paragraph loses the margin so that the date does not end up lower than the title. The controls bar (`.controls`, `.field`) is the one from 4.1.5, with the numbers replaced by Lesson 3's spacing variables (`var(--space-3)` is the same `1rem`). And the summary (`.summary`) is the four-column grid of 4.2.3. What did *not* change matters as much as what did: the layers, the variables, the focus and the badges are Lesson 3's. The layout is added to what was there; it does not rewrite it.

Measure it. At 1440 px, with the inspection tool, the header's title goes from 256 to 553 px, the date from 617 to 938 and the navigation from 1002 to 1184, stuck to the content's right edge: a single row. The summary's four figures end up in a row of four columns of 207.5 px (they measure less than the test page's 220 because now they live inside a section, with its padding and border). And the controls bar is a single row, with the field from 281 to 647.5 px, the radios from 663.5 to 1008 and the button from 1024 to 1159. What in the starting page were ten stacked rows are now three strips: the header, the summary and the bar, with the table right below. The table, which is what one comes to see, moves up more than 400 pixels: in `fig04_01.html` it started 859 px from the top of the page, and in `fig04_06.html` it starts at 419.

At 768 px nothing overflows yet, and the header and the bar already distribute themselves over more than one row on their own, thanks to `flex-wrap`. At 375 and 320 px, on the other hand, the page measures **414 px**: the table is still wider than the window, as since Lesson 3, and now it is accompanied by the summary, whose four fixed columns reach 369 px. That is the exact point where Lesson 5 begins.

#### 4.2.5 Take it to your `revisor`

So far you worked with the repository's pages. What is missing is the step that turns what you learned into your project: making **your** `revisor` end up the same as `fig04_06.html`, measured and saved in Git. There are four steps, and none asks you to write anything new.

**1. The stylesheet.** Open your `~/revisor/css/styles.css` and paste at the end of the `components` layer, right before the last closing brace `}`, the block that starts with the comment `/* ---- Lección 4: Flexbox y Grid ---- */` (you have it in full above, or in the repository's `fig04_06/styles.css`). Do not delete anything that was there: the block only adds. If you prefer, you can replace the whole stylesheet with `fig04_06/styles.css`, which is Lesson 3's with that block; but if in Lesson 3 you made changes of your own to your stylesheet (another color, another size), replacing it would erase them, and in that case it is better to paste just the block.

**2. The page.** In your `~/revisor/index.html` make the three HTML changes:

- `<header>` becomes `<header class="page-header">`.
- `<dl>` becomes `<dl class="summary">`.
- The search field, the `<fieldset>` and the button's paragraph end up inside a `<div class="controls">`, and the field's paragraph carries `class="field"`, just as in 4.1.5. Take care where you close the `div`: after the button's paragraph and before the table.

You can also copy `fig04_06.html` in full over your `index.html`, with one precaution: in the repository, its `<link>` points to `fig04_06/styles.css`; in your project it must say `href="css/styles.css"`, as since Lesson 3. If you do not change it, the page will look unstyled.

**3. Measure.** From the project folder, start the server:

```bash
$ cd ~/revisor
$ python3 -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000/`, turn on responsive mode with the window at 1440 px and compare your dashboard with `fig04_06.html` at the same width: the header in a row, the four figures in a row and the controls bar in a row. Hover over `.summary` in the elements tab: it must have the `grid` badge, and `.controls` and `.page-header` the `flex` badge. If one does not have it, it is a class that was not written or a `div` that was closed somewhere else. Do not worry if at 320 px your dashboard still overflows: the lesson's does too, and for the same reason.

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
$ git commit -m "Acomoda el panel con Flexbox y Grid"
$ git status
En la rama main
nada para hacer commit, el árbol de trabajo está limpio
```

`git commit` prints a line with the commit's code and how many lines changed; the numbers depend on your files. With that, your `revisor` is ready for Lesson 5, which starts exactly from here.

The starting stylesheet, `fig04_01/styles.css`, is Lesson 3's as it is; you have it in full below, in case you want to compare or do not have the previous lesson's:

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

and the starting page, `fig04_01.html`, is Lesson 2's dashboard with a `<link>` to that stylesheet:

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

## The error you will see

Layout errors are almost never messages: they are a page that looks “wrong” without saying why. The two you will meet most with Flexbox are best learned by provoking them on purpose. The first leaves no trace in the console, only a discreet clue in the browser's developer tools; the second is seen as soon as the window narrows.

**A layout error that does not warn: the property that does nothing.** Open `fig04_07.html`. It is a bar of three buttons with `justify-content: space-between`, and the buttons stay stuck to the left, one after another, without distributing themselves:

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

There is nothing in the console. The browser does not consider this an error: it simply ignores the property, because `justify-content` has no effect on a normal block ([it only acts on flex, grid or multi-column containers](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/justify-content)), and `.controls` is a normal block (`display: flex` is missing). What there is, is a clue in the browser's developer tools: open the elements tab, select `.controls` and look at its styles panel; the declaration `justify-content: space-between` appears dimmed, with a warning icon beside it that, when you hover over it, explains that the property has no effect because the element is neither a flex container nor a grid one. (The exact text changes with the browser and its language; the icon and the dimmed declaration are the signal.) The fix is one line: `display: flex`. **When a layout property “does nothing”, the first thing to check is whether its parent is a container.**

**The element that does not shrink.** The second case is that of 4.1.3, and it is worth recognizing from afar because it is disguised: you open `fig04_03.html` at 320 px and a horizontal scroll bar appears, although the long text has everything it needs to cut itself with an ellipsis. The signal is that the element that goes past the edge is the text's **container**, not the text: when hovering in the elements tab, the first row's `.service-name` box measures 417 px in a 320 window. A flex item does not shrink below its minimum content, and a URL without spaces is an enormous minimum content. The fix is the two parts you already know: `min-width: 0` on the flex item, and a way to fit for its content. If you only put the second, the text “knows” how to cut itself, but its box never asks it to.

## What gets done wrong

**Separating siblings with margins on each child.** `margin-right: 1rem` on each button of a bar. The last one is left with an extra margin, and when the bar drops to another row the margins no longer coincide with the gaps. Cost: adjustments with `:last-child` and magic numbers nobody understands a month later. Fix: the space between siblings is set by the parent with `gap`.

**Putting the layout property on the child and not on the parent.** `justify-content` or `grid-template-columns` on each card, instead of on the container that distributes them. They do nothing, and there is no error saying so: it is the case of `fig04_07.html` in another disguise. Before writing a layout property, ask yourself who distributes; that is where it goes.

**Using `order` to rearrange what is read.** Reordering with CSS something the keyboard walks through in another order. Cost: Tab jumps from one side to the other and a screen reader reads in an order that does not match what is seen. It is fixed by writing the HTML in the order in which it should be read.

**Fixed pixel widths for everything.** `width: 640px` on a column, `input { width: 20rem }` on a field. They look good on the screen of whoever wrote them and get in the way on any other. The dashboard was spared this because Lesson 3's stylesheet gave nothing a fixed width, and this lesson's controls bar did not either: it gave the field a **basis** (`14rem`) that can grow and shrink, which is not the same as a width. The alternative to a written number: `width: 100%`, `max-width`, or leaving the width to `flex` and `grid`.

## Exercises

### Exercise 1 — The header in a row

The dashboard's `<header>` has three children: the `<h1>` title, the “Última revisión” paragraph and the `<nav>` with the two links. In `fig04_01.html` they go one below another. Use Flexbox, without touching the HTML, in two steps:

1. Make them a row, with the title stuck to the left, the `<nav>` stuck to the right edge and the date distributed between the two, so that on a narrow phone they drop to the next row instead of squeezing.
2. Now change your mind: the title on the left and **the other two together** at the right edge, one next to the other.

Measure both steps at 1440 and at 320 px with the tools, looking at where each child starts and ends, and check that at 320 px the header does not go outside the window.

### Exercise 2 — Two columns, two rows

Copy `fig04_05.html` and change `repeat(4, 1fr)` to `repeat(2, 1fr)`. Before reloading, **predict**: how many rows will there be, who declared them and how wide will each card measure at 1440 px? Then measure at 1440, 768 and 320 px. Does the page overflow at 320 px as the four-column one did? Explain why or why not.

### Exercise 3 — Who gets what is left over

In `fig04_04.html`, at 1440 px, the search field measures much more than its basis of 14 rem. Change its `flex: 1 1 14rem` to `flex: 0 1 14rem` (only the first number). Predict what happens to the field, to the button and to the leftover space; then measure the field's width and the button's position, and explain the difference with what each of `flex`'s three numbers says.

## Solutions

### Solution 1

**Step 1.** The header needs three things: to be a flex container, to drop to the next row and for the children to distribute themselves. With `justify-content: space-between` the first child ends up on the left, the last on the right and the middle one between the two. It is the same as what the `.page-header` rule in the dashboard's stylesheet does, which instead of the element's name uses a class and instead of the numbers, the spacing variables:

```css
header {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.25rem 1rem;
}
```

With `flex-wrap: wrap`, when the three do not fit in a row, the last one drops on its own, without a media query. The two `gap` values separate the rows (0.25 rem) less than the columns (1 rem). The `baseline` alignment puts the title and the small texts on the same line of text, which looks better than aligning by the boxes' bottom edge. I measured it in `fig04_06.html`: at 1440 px the title goes from 256 to 553 px, the date from 617 to 938 and the `<nav>` from 1002 to 1184, stuck to the content's right edge; at 320 px the three drop, one per row, and the header measures exactly the window's 320 px.

**Step 2.** `space-between` does not work for bringing the two on the right together: it distributes the leftover in *all* the gaps, and that is why the date ends up in the middle. What is needed is for the leftover to go into a single gap, the one after the title. An **auto margin** does that: in a flex container, [an `auto` margin takes all the leftover space](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Aligning_items_in_a_flex_container) on its side, and pushes those that come after it to the end. Two lines are changed:

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

`justify-content` goes back to its starting value, which distributes nothing, and the title's `margin-right: auto` absorbs all the row's free space. Measured the same way, at 1440 px: the title still goes from 256 to 553, the date now goes from 665 to 986 and the `<nav>` from 1002 to 1184; between the two there are exactly the 16 px of the `gap`. At 320 px the result is the same as in step 1 (one per row). The other way out, grouping the date and the `<nav>` in a `div` of their own, also works, but it changes the HTML to solve something that is purely layout.

The lesson's dashboard keeps step 1: the date in the middle visually separates the title from the navigation. Both are correct; what matters is knowing which one you asked for and with what tool each is achieved.

### Solution 2

There are **two rows** of two cards each, and nobody declared them: `grid-template-columns` only talks about columns, and when the four items do not fit in the two declared columns, the browser creates the second row on its own. It is the implicit grid of 4.2.2. I measured it: at 1440 px each card measures **456 px** (928 minus a 16 gap, between two); at 768 px, 360; and at 320 px, 136, without overflowing: the page measures 320.

Why does this one not overflow and the four-column one does? Because `1fr`'s hidden minimum is still there, but now only half of the long words has to fit in each row: two columns with their floor, plus a gap, fit in the 288 px the page leaves. Notice what that teaches: the number of columns that is appropriate **depends on the width**, and writing it by hand forces you to choose a single one for all widths. Having the grid count it by itself is exactly what you will learn in Lesson 5.

### Solution 3

With `flex: 0 1 14rem` the field **stops growing**: it measures its basis, 224 px, instead of the 416.5 it measured. The radio group and the button do not change size (neither was growing), so they shift to the left: the button, which ended at 1184 px, stuck to the content's right edge, now ends at 991.5. The 192.5 px that are left over stay empty at the end of the row.

The three numbers explain it. The first, *grow*, says how much of the leftover the item receives; with `1`, the field was the only one asking for leftover and took it all, and with `0` nobody asks for it and it stays where it falls (at the end, because `justify-content` is `flex-start`). The second, *shrink*, is still `1`: if the bar narrows, the field still yields. The third, the *basis*, did not change: 14 rem. That is why in the dashboard's bar the field carries `1` at the start: it is the piece that should take advantage of the space, because a wider search field lets you see more of what you type.

## How I know I got it

- [ ] You can say, before reloading, what `justify-content: space-between` and `align-items: center` do in a row, and what changes with `flex-direction: column`; `fig04_02.html` proves you right.
- [ ] `fig04_04.html` at 1440 px is a single row with the field taking up what is left over, and at 320 px it is three rows, without overflowing.
- [ ] You can explain why the first row of `fig04_03.html` overflows at 320 px and the second does not.
- [ ] In `fig04_06.html` at 1440 px the header, the summary and the bar are three strips of one row each, and the inspection tool shows the `grid` badge on `.summary` and `flex` on `.page-header` and `.controls`.
- [ ] With Tab, focus moves in the same order as in Lesson 3: “Resumen” link, “Servicios” link, search field, radio group and “Revisar ahora” button. The layout did not change the reading order.
- [ ] You can say with one question when to use Flexbox and when Grid, and give an example from the dashboard for each.
- [ ] Your `~/revisor` (served from its folder at `http://127.0.0.1:8000/`) looks the same as `fig04_06.html` at 1440 px, and `git log --oneline` shows the commit with the layout.

## Summary

To consolidate what you have just seen, answer without looking at the lesson:

1. Which axis does `justify-content` control and which `align-items`? What changes when you set `flex-direction: column`?
2. Why is `gap` better than a margin on each child?
3. What does `flex: 1 1 14rem` mean on an element, in your own words?
4. Why can a flex item with a long URL inside make the page overflow, and what two things fix it?
5. What is the question that decides between Flexbox and Grid?
6. With six items and `repeat(3, 1fr)`, how many rows are there and who declared them?
7. Why is what the keyboard walks through not rearranged with `order`?

If you get stuck on any answer, go back to the corresponding section: it is a sign that a piece is loose there, not that you are no good at this.

## Further reading

- [MDN, “Basic concepts of flexbox”](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox) — the explanation of the axes, `flex-wrap` and the three values of `flex`, on which this lesson rests. Accessed on October 7, 2026.
- [MDN, “Basic concepts of grid layout”](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Basic_concepts_of_grid_layout) — explicit and implicit grid, `fr`, `repeat()` and `minmax()`. Accessed on October 7, 2026.
- [MDN, “Aligning items in a flex container”](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Aligning_items_in_a_flex_container) — `justify-content`, `align-items` and the auto margins of Exercise 1, with drawings of each value. Accessed on October 7, 2026.
