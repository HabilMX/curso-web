# Lesson 3 — CSS: cascade, specificity and the box

**Time:** two sessions of about 90 minutes. A split that works: the first one, “The why before the how” and the cascade (3.1), with its figures for predicting which rule wins; the second one, the box (3.2), variables (3.3), the readable dashboard, “The error you will see” and the exercises. Each session ends in a page that you can open and measure.

**What you build:** the `revisor` dashboard, now readable: typography, colors, a tidy table and the status badges

**What you learn:** where each style comes from and which one wins; the box model and `box-sizing`; color and typography variables

**The pages of this lesson.** All the figures are in [`programas/03-css-cascada-caja/`](https://github.com/HabilMX/curso-web/tree/main/programas/03-css-cascada-caja) of the [course repository](https://github.com/HabilMX/curso-web), each with its expected output next to it; the readable dashboard's stylesheet is in `fig03_08/styles.css`. Open them with your local server, as in Lesson 1.

## By the end you will be able to

- Connect a stylesheet to a page and write rules with element, class, identifier and state selectors.
- Predict which rule wins when two collide, by computing their specificity and applying the order of the cascade, without resorting to `!important`.
- Compute by hand the real width of a box with `content-box` and with `border-box`, and check it in the browser's developer tools.
- Declare color, spacing and typography variables, and use them so that a change of decision is made in a single place.
- Check with numbers that a text color meets the minimum contrast and that keyboard focus is visible.
- Read the CSS validator's messages and recognize the two errors that produce no message at all.

## The why before the how

At the end of Lesson 2 the dashboard worked and looked like a 1995 page: serif lettering, a gray system button, a table without lines where the columns stick to each other. That is not a defect of HTML; it is what the browser does when nobody tells it how to draw. Every browser ships its own stylesheet, and it is the one you have been seeing.

Today we tell it how we want it to look. The dashboard must be readable: a legible typeface, sizes that give hierarchy, a table with separated rows and aligned numbers, and a colored badge next to each service's status so that what is fine can be told from what is down at a glance. That is the visible result.

What you really learn today is something else, and it is what separates whoever writes CSS from whoever suffers it. **Almost all CSS problems are of one of two kinds: “my rule is not applied” and “my box does not measure what I wrote”.** The first is called the cascade and the second the box model. Whoever does not understand the cascade resolves every conflict by raising the force: more selectors, an identifier, an `!important`, and then another `!important` to beat the first. Whoever does not understand the box ends up subtracting pixels by eye until something fits. Both end up with a stylesheet nobody dares touch anything in.

That is why the lesson goes in this order. First the **cascade** (section 3.1): how the browser decides, among several rules fighting over the same element, which one stays. Then the **box** (3.2): how big each element really is. And at the end the **variables** (3.3), which let you write each decision only once: the text color, the spacing, the typeface. In each section there is a page you can open, change and break. The one at the end is the complete dashboard.

One criterion runs through everything: this lesson's CSS **hides nothing of what you learned in the previous one**. Keyboard focus is visible, status does not depend on color alone, texts have enough contrast. It is checked with numbers, not by eye.

## The concepts

### 3.1 Where each style comes from and which one wins

#### 3.1.1 A rule, end to end

A stylesheet is a list of **rules**. Each rule has two halves: the **selector**, which says which elements it applies to, and the **declaration block** between braces, which says what changes in them. Each declaration is a `property: value;` pair and closes with a semicolon.

```html
<!-- fig03_01.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Mi primer estilo</title>
  <style>
    h1 {
      color: #0b5cad;
    }
    p {
      max-width: 40rem;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <main>
    <h1>Revisor de servicios</h1>
    <p>Cada regla tiene un selector, que dice a qué elementos se aplica, y declaraciones entre llaves, que dicen qué cambia en ellos.</p>
  </main>
</body>
</html>
```

```text
Revisor de servicios
Cada regla tiene un selector, que dice a qué elementos se aplica, y declaraciones entre llaves, que dicen qué cambia en ellos.
```

In that page, `h1` is a selector that means “all first-level headings”; the declaration `color: #0b5cad;` changes the text color to a blue written in hexadecimal (two digits for red, two for green and two for blue). The second rule limits the paragraphs' width to `40rem` (`rem` is a unit equal to the page's font size, 16 pixels by default, so that is 640 pixels; you will see it in depth in 3.2.3) and separates the lines with a height of `1.6` times the font size. The output text looks the same as without styles, and that is why in this course, besides the text, the computed values are checked: the color of that `<h1>`, measured in Chrome 154, is `rgb(11, 92, 173)`, which is the same blue in another notation.

There are three ways to connect CSS to a page, and it is worth knowing all three to know why one is preferred:

1. **An external stylesheet**, with `<link rel="stylesheet" href="styles.css">` inside `<head>`. It is the one you will use in the dashboard. The browser keeps it in memory and reuses it on all the site's pages, and the same file can be opened and changed without touching the HTML.
2. **A `<style>` block** inside `<head>`, as above. It is handy for a single-page experiment, and that is why this lesson's figures will use it. On a real site it is best avoided, for a security reason you will see in Lesson 11.
3. **The `style` attribute** placed on an element (`<p style="color: red">`). It has a special force in the cascade, which you will see right away, and that is precisely why it is almost never advisable: it mixes appearance with content and is very hard to beat without tricks.

#### 3.1.2 The selectors you need today

A selector is a question the browser asks each element: “is it you?”. These are the ones you will use in the dashboard, from the most general to the most precise:

- **Type** (by element name): `p`, `table`, `h2`. It applies to all of that type.
- **Class**: `.status`. The dot indicates it looks for elements whose `class` attribute contains that name. An element can have several classes separated by spaces (`class="status status-down"`), and a class can be on many elements. It is CSS's main tool, and it is the reason why in Lesson 2 you put `class` on the badges.
- **Identifier**: `#summary`. The number sign (`#`) looks for the one element with that `id`. An `id` cannot be repeated on a page.
- **Attribute**: `input[type="search"]`. Square brackets: elements that have that attribute with that value.
- **Pseudo-class**: `a:hover`, `:focus-visible`, `td:last-child`. The colon signals a **state** or a **position** of the element: when the mouse is over it, when the keyboard has it focused, when it is the last child of its parent.
- **Descendant**: `dl div` (with a space). `div` elements that are inside a `dl`, at any depth.
- **List**: `th, td` (with a comma). It is shorthand for two rules with the same declarations.

A selector is read from right to left: in `dl div:last-child`, the target is a `div` that is a last child, and it only counts if it is also inside a `dl`. Selectors can be combined without a space: `p.alert` is a `<p>` that also has the class `alert`.

#### 3.1.3 When two rules collide: the cascade

Here is the lesson's central concept. There is almost never just one rule on an element. There is the browser's stylesheet, your stylesheet, another rule further down in your stylesheet, and sometimes a `style` attribute. When several rules give different values to the same property of the same element, the browser has to pick one. The word *cascade* in “cascading style sheets” (CSS) is the name of the algorithm with which it picks. It is neither magic nor chance: it is steps, in a fixed order that is [written in the specification](https://www.w3.org/TR/css-cascade-5/), and the first one that breaks the tie decides.

This is the list, summarized and in the order in which it is applied. For each property of each element, the browser:

1. **Discards the rules that do not apply**: those that do not select that element or that carry an invalid value.
2. **Compares origin and importance.** There are three origins: the browser's stylesheet, the user's (the reader's preferences, which almost nobody uses) and yours, the author's. Among normal declarations, the author's wins. With `!important` the order is reversed, so that a reader with special needs can beat the author.
3. **Compares the styles of the `style` attribute.** A declaration placed in the `style` attribute beats those coming from stylesheets, regardless of their specificity.
4. **Compares layers** (`@layer`), a mechanism you will see in 3.1.5. Among normal declarations, those in a layer declared later beat those in an earlier layer; and those in no layer beat all those that are in one. With `!important` that order is reversed, just like with origins.
5. **Compares the specificity** of the selector, which is the topic of the next section.
6. **If everything above ties, the last one wins.** The rule that appears furthest down in the stylesheet.

Two things matter in this list. **First: the order of the rules is the last criterion, not the first.** Many people believe that “the last rule wins” and get confused when it does not happen. The last one only wins when the earlier criteria tied. **Second: each step decides completely.** If one step gives a winner, the following ones are not even looked at; a rule with ten identifiers in its selector cannot beat a declaration with `!important`.

#### 3.1.4 Specificity: counting with three figures

Specificity is the fifth step, the one that almost always decides. It is a measure of **how precise a [selector](https://www.w3.org/TR/selectors-4/#specificity) is**, and it is computed with three figures written (A, B, C):

- **A** counts identifiers (`#summary`).
- **B** counts classes, attributes and pseudo-classes (`.status`, `[type="search"]`, `:hover`, `:last-child`).
- **C** counts element types (`p`, `table`) and pseudo-elements (`::before`).

The universal selector `*` adds nothing. And the figures are compared **from left to right, one by one, not as a three-digit number**: first A; if they tie, B; if they tie, C. A single identifier (1,0,0) beats any number of classes, even a thousand, because A is compared first. That is why the browser sees `#summary` as much stronger than `.status`.

Some examples, with their count:

| Selector | Count (A, B, C) | Why |
|---|---|---|
| `p` | (0, 0, 1) | one type |
| `.alert` | (0, 1, 0) | one class |
| `p.alert` | (0, 1, 1) | one class and one type |
| `a:hover` | (0, 1, 1) | one pseudo-class and one type |
| `input[type="search"]` | (0, 1, 1) | one attribute and one type |
| `dl div:last-child` | (0, 1, 2) | one pseudo-class and two types |
| `#summary dd` | (1, 0, 1) | one identifier and one type |
| `:where(.card) p` | (0, 0, 1) | `:where()` is always worth zero |

The last row deserves an explanation. `:where()` and `:is()` are pseudo-classes that receive a list of selectors. The difference between the two is precisely their specificity: **[`:where()`](https://developer.mozilla.org/en-US/docs/Web/CSS/:where) is always worth zero** and `:is()` takes that of the most specific of its arguments. With `:where()` you can write a base style that anyone overrides effortlessly. You will use it for that, later on, and you see it in use in the first exercise.

Let us see it all together. The following page has four paragraphs and five color rules that compete for them:

```html
<!-- fig03_02.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>¿Quién gana?</title>
  <style>
    p { color: dimgray; }
    .alert { color: saddlebrown; }
    p.alert { color: crimson; }
    #three, #four { color: royalblue; }
    p { color: black; }
  </style>
</head>
<body>
  <main>
    <h1>¿Quién gana?</h1>
    <p>Uno: solo el nombre del elemento.</p>
    <p class="alert">Dos: con una clase.</p>
    <p class="alert" id="three">Tres: con clase e identificador.</p>
    <p class="alert" id="four" style="color: darkgreen">Cuatro: con el atributo style.</p>
  </main>
</body>
</html>
```

```text
¿Quién gana?
Uno: solo el nombre del elemento.
Dos: con una clase.
Tres: con clase e identificador.
Cuatro: con el atributo style.
```

(The page's heading reads “Who wins?” and the paragraphs are “One: only the element's name”, “Two: with a class”, “Three: with class and identifier” and “Four: with the style attribute”.)

Before reading the answer, make your own bet with the two lists above. I measured the computed colors in Chrome 154 and this is what came out:

- **One** is black (`rgb(0, 0, 0)`). Only `p { dimgray }` and `p { black }` apply to it. Both have the same specificity, (0,0,1), so the order decides and the last one wins: black. This is the case where “the last one wins” is true.
- **Two** is crimson (`rgb(220, 20, 60)`). Three rules apply to it: `p` (0,0,1), `.alert` (0,1,0) and `p.alert` (0,1,1). The one with the highest specificity wins, `p.alert`, **even though it comes before `p { black }`**. The order is not looked at, because the previous step already broke the tie.
- **Three** is royal blue (`rgb(65, 105, 225)`). Its identifier gives (1,0,0) and beats all the earlier rules.
- **Four** is dark green (`rgb(0, 100, 0)`). It has the same identifier as three, but the `style` attribute is compared before specificity, and wins. It is the case that section 3.1.1 announced: that is why a `style` placed in the HTML is so hard to beat from the stylesheet.

There is a count you should do from memory on seeing this result: **element Three has five color rules selecting it (the two `p` ones, `.alert`, `p.alert` and the identifier's), and the one that won is the one that least resembles “the last thing I wrote”.** If you do not understand the order of the list, the only tool you are left with is raising the force, and force can only be raised up to a point.

#### 3.1.5 Layers: the clean way out

Layers (`@layer`) exist for when specificity criteria become a nuisance. A layer is a named group of rules; you declare the **order of the layers** once, and between layers that order is what counts, **without looking at specificity**.

```html
<!-- fig03_03.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Capas</title>
  <style>
    @layer base, components, overrides;

    @layer base {
      a { color: gray; }
    }
    @layer components {
      .link { color: green; }
    }
    @layer overrides {
      a { color: blue; }
    }
    .plain { color: purple; }
  </style>
</head>
<body>
  <main>
    <h1>Capas</h1>
    <p><a href="#uno" class="link">Un enlace con clase, en la capa components</a></p>
    <p><a href="#dos">Un enlace sin clase</a></p>
    <p><a href="#tres" class="plain">Un enlace con una regla sin capa</a></p>
  </main>
</body>
</html>
```

```text
Capas
Un enlace con clase, en la capa components
Un enlace sin clase
Un enlace con una regla sin capa
```

(The links read “A link with a class, in the components layer”, “A link without a class” and “A link with a rule without a layer”.)

The first line of the `<style>` block declares the order: `base`, then `components`, then `overrides`. The last layer wins. Look at the first link: the `.link` selector has specificity (0,1,0) and the `a` selector in the `overrides` layer only (0,0,1); in a stylesheet without layers, `.link` would win. Here `a` wins, and the link is blue (`rgb(0, 0, 255)`), because its layer comes later. The second link is also blue. The third is purple: `.plain` is in no layer, and normal declarations **without a layer beat all those that have one**.

This is what makes layers useful. You can order your stylesheet in the order in which you want things to win (a reset at the start, then the body's styles, then the components), and specificity only counts inside each layer. Nobody needs an `!important` to beat a rule that is in an earlier layer. And the layerless rule is the emergency door: if someone writes a stylesheet without layers, it beats everything. All this holds for normal declarations; [the specification](https://www.w3.org/TR/css-cascade-5/#cascade-layering) reverses the order for those carrying `!important`: among them the **first** layer wins, and an `!important` declaration inside a layer beats an `!important` one without a layer. It is one more reason not to use it: it breaks the intuition that the last one rules.

Layers have been generally available in browsers since March 2022; [Mozilla's reference site](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer) marks them as “Widely available”. Today's dashboard uses them.

#### 3.1.6 Inheritance: what needs no rule

One piece is missing, and it is the one that explains why an element sometimes has a style although no rule speaks to it. Some properties are **[inherited](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Inheritance)**: if an element has no value of its own, it takes its parent's. Text color, typeface, size and line height are inherited. Others are not: margin, padding, border and background belong to each element, and do not pass to their children (if the border were inherited, each paragraph inside a card would have its own frame).

```html
<!-- fig03_04.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Herencia</title>
  <style>
    article {
      color: darkgreen;
      font-style: italic;
      border: 2px solid black;
      padding: 1rem;
    }
  </style>
</head>
<body>
  <main>
    <h1>Herencia</h1>
    <article>
      <p>Este párrafo hereda el color y la cursiva, pero no el borde.</p>
      <p><label>Un campo: <input type="text" value="no hereda la fuente"></label></p>
    </article>
  </main>
</body>
</html>
```

```text
Herencia
Este párrafo hereda el color y la cursiva, pero no el borde.
Un campo:
```

I measured it in Chrome 154. The paragraph has the `<article>`'s dark green color and italics (it inherits them), and its border is `0px`: it did not inherit it. The label, which is a text element, also inherits the green. And the text field does not: its computed color is black and its italic is `normal`. A form field does not inherit the typeface or color from its parent because the browser's stylesheet gives them values of their own. On my machine, the field used Arial at 13.33 px while the paragraph used 16 px; the exact values depend on the operating system, but the difference exists on all of them. It is the reason the dashboard carries the `font: inherit` rule for its fields and buttons: without it, the search field looks like it is from another page.

There are four words that let you take control over inheritance by hand: `inherit` (takes the parent's value, even if the property is not normally inherited), `initial` (the specification's initial value), `unset` (inherits if the property is inheritable, and if not, uses the initial one) and `revert` (undoes the author's styles and goes back to the value the previous origin would set: the user's stylesheet if it exists, and if not, the browser's). Of these, `inherit` is the one you will use.

And a warning about the order in which everything happens. **Inheritance is the weakest thing there is**: an inherited value loses to any rule that points at the element, however weak. That is why `* { color: black }`, with its zero specificity, breaks the color inherited by the whole document: it “speaks” to each element directly.

#### 3.1.7 `!important` and how one comes to need it

The [`!important`](https://developer.mozilla.org/en-US/docs/Web/CSS/important) declaration goes at the end of a value (`color: red !important;`) and changes its step in the cascade: it moves to a group that beats all normal declarations, with any selector. It is an emergency tool with one legitimate use case, which is the stylesheet of a user who needs large print. For whoever writes an author stylesheet, it is almost always a sign that there is a conflict nobody has understood.

The road to the `!important` war is always the same. A rule does not win; its specificity is raised; that of another nearby rule goes up; someone adds an `!important`; the rule that was supposed to beat it needs another `!important`; and from then on each change demands one more. The way out is not to raise the force, but to **lower** it: write selectors with the lowest specificity that works and let order, layers and `:where()` do the work. In the fourth exercise you have a stylesheet with that problem to undo.

One tool makes this much easier: **the [browser's inspector](https://developer.chrome.com/docs/devtools/css)**. Right-click any element and choose “Inspect”. In the styles panel you will see all the rules that apply to it, in the order in which the cascade evaluates them, and the ones that lost appear **struck through**. In the computed values panel (*Computed*) you will see the final value of each property and, when expanding it, which rule set it. When a rule “does not obey”, the answer is almost always there, two clicks away.

### 3.2 Every element is a box

#### 3.2.1 The four layers of a box

For CSS, every element is a rectangular box. That box has four nested zones, from the inside out:

- **The content**: the text or the child elements.
- **The padding**: space between the content and the border. It is part of the box and takes its background.
- **The border**: a line around the padding.
- **The margin**: space between this border and the neighboring box. It is transparent and takes no background.

And there is a question that decides whether your page measures what you wrote: when you write `width: 300px`, is that width the content's, or the box's with padding and border? The historical answer, which is still the one the browser applies if nobody tells it otherwise, is **the content's**. (There are exceptions in the browser's own stylesheet: I measured it in Chrome 154, and buttons, `<select>` dropdowns, search fields and tables already come with `border-box`; a normal text field or a `<div>` do not.) It is called [`box-sizing: content-box`](https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing). With it, padding and border are **added** on the outside:

```html
<!-- fig03_05.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Cajas</title>
  <style>
    .box {
      width: 300px;
      padding: 20px;
      border: 5px solid black;
      margin: 10px;
      background: #cfe2ff;
    }
    .border-box {
      box-sizing: border-box;
    }
  </style>
</head>
<body>
  <main>
    <h1>Cajas</h1>
    <div class="box">Caja con content-box (lo normal sin reglas)</div>
    <div class="box border-box">Caja con border-box</div>
  </main>
</body>
</html>
```

```text
Cajas
Caja con content-box (lo normal sin reglas)
Caja con border-box
```

(The boxes' text reads “Box with content-box (the normal without rules)” and “Box with border-box”.)

Both boxes have the same width rule, `width: 300px`. The first one's count, with `content-box`: 300 of content, plus 20 of padding on each side (40), plus 5 of border on each side (10): **350 pixels of total width**. The second one's, with `box-sizing: border-box`, the width of 300 already **includes** the padding and the border, and the content keeps what is left: 300 − 40 − 10 = **250**. I measured it in Chrome 154: the first measures 350 pixels wide and the second 300. The computed `width` property is `300px` on both; what changes is what it means.

Now imagine the real problem. You have a card inside a 500-pixel column, and you give it `width: 100%` so it fills the column, 16 pixels of padding so the text breathes and a 2-pixel border. With `content-box`, the card measures 500 of content + 32 of padding + 4 of border = 536 pixels: **it sticks out of its column by 36 pixels**, and a horizontal scroll bar appears. The beginner solves this by trial and error. Whoever knows the box solves it with one line.

The line is `box-sizing: border-box`, and it is the standard practice of nearly all professional CSS: with it, the width you write is the width you see, and padding and border are subtracted from the content on the inside. It is written once, for all elements, and appears in the dashboard's first layer:

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

Three selectors separated by commas: all elements and the two pseudo-elements that CSS can insert before and after the content of each. They are included so that no generated box escapes the criterion.

To see any element's box, the inspector has a diagram: in Chrome, in the computed values panel; in Firefox, in the [Layout tab](https://firefox-source-docs.mozilla.org/devtools-user/page_inspector/how_to/examine_and_edit_the_box_model/index.html). It is a rectangle inside another with the four thicknesses annotated. **When a box does not measure what you expect, do not subtract pixels: open the diagram and see which of the four zones is too big.**

#### 3.2.2 Block, inline and the margins that join

There is a second rule that explains bewildering cases: not all boxes behave the same. The [`display`](https://developer.mozilla.org/en-US/docs/Web/CSS/display) property decides how a box is placed with respect to its neighbors. Three values explain most of today's cases:

- **`block`**: the box takes up a whole line. It accepts `width` and `height`, and its four margins. Paragraphs, headings, sections and tables are like this.
- **`inline`**: the box flows inside a line of text, like a word. It **ignores `width` and `height`** and its vertical margins. `<span>`, links and `<strong>` tags are like this.
- **`inline-block`**: it flows like a word, but lets itself be sized like a block. It is what a badge needs.

```html
<!-- fig03_06.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Display</title>
  <style>
    .sample {
      width: 200px;
      height: 40px;
      background: #cfe2ff;
    }
    .as-block { display: block; }
    .as-inline { display: inline; }
    .as-inline-block { display: inline-block; }
  </style>
</head>
<body>
  <main>
    <h1>Display</h1>
    <span class="sample as-block">block</span>
    <span class="sample as-inline">inline</span>
    <span class="sample as-inline-block">inline-block</span>
  </main>
</body>
</html>
```

```text
Display
block
inline inline-block
```

The three `<span>` have the same rule `width: 200px; height: 40px;`. I measured it: the `block` and the `inline-block` measure 200 × 40. The `inline` measures **36 × 18**: its width and height come from the text “inline”, because dimensions are ignored for an inline box. If you ever write a `width` and it “does nothing”, look first at the element's `display`. The dashboard's `<span class="status">` needs padding at the sides and rounded corners, and that is why it is declared `display: inline-block`.

The other oddity of boxes is margins. When two blocks are one on top of the other and the upper one has a bottom margin and the lower one a top margin, the space between them **is not the sum of the two**: the margins **join** and the larger one remains.

```html
<!-- fig03_07.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Márgenes</title>
  <style>
    .first  { margin: 0 0 20px; background: #cfe2ff; }
    .second { margin: 30px 0 0;  background: #d1e7dd; }
  </style>
</head>
<body>
  <main>
    <h1>Márgenes</h1>
    <p class="first">Primer párrafo: margen inferior de 20 px.</p>
    <p class="second">Segundo párrafo: margen superior de 30 px.</p>
  </main>
</body>
</html>
```

```text
Márgenes
Primer párrafo: margen inferior de 20 px.
Segundo párrafo: margen superior de 30 px.
```

(The paragraphs read “First paragraph: bottom margin of 20 px.” and “Second paragraph: top margin of 30 px.”)

If the margins added up, there would be 50 pixels between the two paragraphs. I measured it: there are **30**. It is called *[margin collapsing](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_box_model/Mastering_margin_collapsing)* and only happens between **vertical** margins of neighboring blocks (and between a block and its first child, when there is no padding or border separating them). Padding never collapses, and neither do elements inside a flexible container or a grid, which you will see in Lesson 4. If your vertical space does not add up, this is it. The habit that avoids it is to write margins in a single direction (for example, all downward) and let the collapsing work on your side.

#### 3.2.3 Units: pixels, rem and percentages

To write a size you need to choose a unit, and the choice has accessibility consequences that are not seen on the programmer's screen.

- **`px`** is a CSS pixel. It is a fixed measure. Use it for what should not grow with the text: a 1 px border, a shadow.
- **[`rem`](https://developer.mozilla.org/en-US/docs/Web/CSS/length)** is the font size of the document's root. By default browsers set it to 16 px, so `1rem` is 16 px and `2rem` is 32. The difference with `px` is the one that matters: **the reader can change their preferred font size in the browser's settings**, and everything written in `rem` grows with it, while what is written in `px` does not. What is left is the page zoom (Ctrl and +), which enlarges everything, `px` included, and which the guidelines accept as a way of complying; but whoever has already set their preferred font size to read on all sites sees that your page ignores it, and has to zoom into it every time. That is why the dashboard writes its font sizes and almost all its spacing in `rem`. It is the criterion the accessibility guidelines call resizing text ([WCAG 1.4.4](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html)).
- **`%`** is a percentage of the container: `width: 100%` is “as wide as my parent”.
- **`ch`** is the width of the digit zero in the current typeface. It serves to limit the width of a text: beyond some 75 characters per line the eye gets lost when jumping to the next one.

One more line about line height. It is written `line-height: 1.6`, **without a unit**: a bare number means “1.6 times each element's font size”, and the children inherit it as a multiplier. With a unit (`1.6rem`) it is inherited as a fixed quantity, and a large heading would end up with its lines stuck together.

### 3.3 Variables: each decision, only once

#### 3.3.1 Custom properties

Imagine the dashboard's blue appears in the title, in the links, in the button, in the focus outline. That is four places. The day someone says “let's make it a darker blue”, or “the client wants green”, you have to find all four and change them without forgetting any. CSS solves this with **[custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)**, known as **variables**.

A variable is a property whose name **you invent** and always starts with two hyphens. It is declared inside a rule, and used with the `var()` function:

```css
:root {
  --color-accent: #0b5cad;
}

a {
  color: var(--color-accent);
}

button {
  background: var(--color-accent);
}
```

`:root` is the pseudo-class that selects the document's root (the `<html>` element), and it is used as the canonical place for global variables. Variables **are inherited**, like color: a variable declared in `:root` is available throughout the document, and one declared on an element is available on it and its descendants. That is used for the trick that drives the dashboard's badges, which you will see in a moment.

There is a naming discipline worth more than any other advice: **the name says what it is for, not how it looks.** `--color-accent` is a good name; `--blue` is a trap, because the day the accent is green, the `--blue` variable will hold green and nobody will understand the code. The same with `--color-down-text` for the down status's text, or `--space-3` for a spacing. A variable is a named **decision**.

And three variables that deserve a separate explanation are the badge's. Notice how the color of the two badges, the green “Disponible” and the red “Caído”, is resolved with a single rule:

```css
.status {
  background: var(--badge-bg);
  color: var(--badge-text);
}

.status-available {
  --badge-bg: var(--color-available-bg);
  --badge-text: var(--color-available-text);
}

.status-down {
  --badge-bg: var(--color-down-bg);
  --badge-text: var(--color-down-text);
}
```

The `.status` rule knows **how** a badge is drawn, but not in what color; the next two classes only say **in what color**, by changing two variables. Thanks to variable inheritance, `.status` sees them. This way of writing has an advantage you will soon notice: adding a third status in the future is adding a three-line class, without touching the badge rule. A note: a badge that has only the `status` class and neither of the other two is left without a background color, because the variables it uses do not exist. It is the correct behavior and will be seen in the errors section.

#### 3.3.2 Typography and spacing

Variables are not just for colors. The dashboard declares its scale of spacings (`--space-1` to `--space-5`, from a quarter of a `rem` to two and a half) and its typeface family:

```css
--font-body: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
```

A list of families is read from left to right as “use the first one that exists, and if not the next”. [`system-ui`](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family) asks for the typeface with which the operating system draws its own menus, which is the most legible on each platform and is not downloaded from anywhere. The others are the names of each platform's system typeface, in case the browser does not understand `system-ui`, and the last one, `sans-serif`, is a generic family, which is the safety net. No font needs to be downloaded to get started.

The spacing **scale** has a purpose that is not aesthetic. When every spacing in the dashboard comes from the same five measures, the page has a rhythm, and when someone wants more air, they change one measure and everything adjusts. The line heights (`1.6` for the body and `1.2` for the headings, which are short) close the system.

A small property that makes a difference in a table of numbers: [`font-variant-numeric: tabular-nums`](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric). With it, all digits take the same width, so `120 ms` and `950 ms` line up digit by digit. It is what makes a column of times comparable at a glance. The dashboard applies it to the times column together with `text-align: right`.

#### 3.3.3 Contrast and focus: what gets measured

The accessibility guidelines (WCAG 2.2) ask that normal text have a contrast ratio of **at least 4.5 to 1** against its background ([criterion 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)), and that interface components and the focus indicator reach **3 to 1** (1.4.11). The ratio is computed with a formula over the luminance of the two colors, and you do not have to learn it: the browser developer tools' color picker computes it, and there are online checkers such as [WebAIM's](https://webaim.org/resources/contrastchecker/). What you do need is the habit of **measuring before choosing**. These are the figures for the dashboard's colors, which I computed with the W3C formula:

| Combination | Contrast | Minimum |
|---|---|---|
| Main text on the white background | 16.56 : 1 | 4.5 |
| Muted text (`--color-muted`) on white | 6.39 : 1 | 4.5 |
| Muted text on the page background | 6.00 : 1 | 4.5 |
| Links and button on white | 6.67 : 1 | 4.5 |
| The button's white letters on the accent | 6.67 : 1 | 4.5 |
| “Disponible” badge | 7.21 : 1 | 4.5 |
| “Caído” badge | 7.08 : 1 | 4.5 |
| Search field border on white | 4.55 : 1 | 3 |
| Focus ring on white | 6.67 : 1 | 3 |

A figure is a decision that can be reviewed. “It looks good” is not.

There is a second criterion about color, and it is that **color cannot be the only way of communicating something** ([WCAG 1.4.1, “Use of Color”](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)). The red “Caído” badge is told apart from the green for whoever sees colors, but a person with red-green color blindness may not distinguish those two. That is why the badge also carries **text** (“Caído”): it says it with words, and color only reinforces. You already made that decision in Lesson 2 when writing “Caído” inside the `<span>`. CSS improves it without changing it.

And focus. In the previous lesson you did the Tab key test; but the browser showed you focus with its default ring. It is common, in a beginner's stylesheet, to find `outline: none` to “remove that ugly outline”. It is a mistake with a cost: whoever navigates with the keyboard is left not knowing where they are. The guidelines' criterion is that focus be visible ([WCAG 2.4.7](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html)). The right tool is the pseudo-class **[`:focus-visible`](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible)**, which selects a focused element **when the browser believes the focus should be shown**: with the keyboard yes, and when clicking a button with the mouse, normally not. That way you can give an outline of your own, visible and firm, without bothering whoever uses the mouse. It has been generally available in browsers since March 2022.

## Worked example: the readable dashboard

You now have the three ideas. This is the complete dashboard's stylesheet; go through it by layers, which is how it is written.

```css
/* fig03_08/styles.css */

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

And the page, which is Lesson 2's with a single new line in `<head>`: the link to the stylesheet. In the repository the stylesheet lives at `fig03_08/styles.css`; in your project save it as `css/styles.css`, inside the `css` folder you created in Exercise 1 of Lesson 1, and write `href="css/styles.css"`.

```html
<!-- fig03_08.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Revisor de servicios</title>
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="fig03_08/styles.css">
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

The text is the same as Lesson 2's, and that is as it should be: CSS does not change what the page says, only how it is drawn. Open the page on your local server and observe what did change. The decisions, one by one:

- **Three layers in order:** `reset` (the box and the controls' fonts), `base` (variables, body, headings, links, focus) and `components` (sections, summary, controls, table, badges). Since each rule lives in a layer and between layers it is the order that decides, **there is not a single `!important` and none of the selectors needs to be especially specific**. If tomorrow someone writes a rule without a layer, that one beats everything: it is the emergency door, and that is why it is written on purpose.
- **All decisions, in `:root`:** colors, spacings, typeface. The rest of the stylesheet contains not a single color written in hexadecimal; everything comes from `var()`. To change the whole dashboard's blue, one line is changed. It is Exercise 3.
- **`margin: 0 auto` with `max-width: 60rem`:** the content has a comfortable maximum width, and `auto` on the side margins distributes the leftover space to both sides. It is the way to center a block with a width.
- **`:focus-visible`:** a 3-pixel ring in the accent color, separated 2 pixels from the element. Press Tab: the ring appears on the link, on the field, on the radio group and on the button. I checked it in Chrome: the button focused with the keyboard has a `solid` outline of `3px` and color `rgb(11, 92, 173)`.
- **The table:** `border-collapse: collapse` joins the cells' borders into a single line (by default each cell draws its own, with a gap between them). The cells carry padding so they breathe, and the lines are limited to the bottom of each row.
- **The numbers:** `th:last-child, td:last-child` selects the last cell of each row, which is the times one, and aligns it to the right with tabular digits. Notice that the row-name `<th>` is not affected: it is the first child of its row, not the last.
- **The badges:** one rule, two variants, and the text is still there: color only reinforces what the word says.
- **The button:** it measures at least `2.5rem` in height (40 pixels with a 16-pixel font), above the 24 × 24 minimum the guidelines ask for touch targets ([WCAG 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)). The search field also measures 40.

And an honest count before closing. With the browser at 1000 pixels wide, the dashboard looks good. **If you shrink it to 320 pixels, which is the width of a small phone, a horizontal scroll bar appears**: I measured that the document measures 414 pixels wide in a 320 window. The table with its three columns does not fit. It is not an oversight of this lesson: it is the topic of the next one. Today the dashboard is readable; in lessons 4 and 5 it gets laid out and becomes adaptive.

## The error you will see

The browser does not show CSS errors. If you misspell a property or a value, it simply **ignores the declaration** and moves on. That makes CSS errors silent, and that is why they are usually looked for where they show up (“why is my title not blue?”) and not where they were born. To see them there are two instruments: the W3C CSS validator, and the browser's inspector, where an invalid declaration appears struck through or marked.

This page has four syntax errors and one misspelled variable:

```html
<!-- fig03_09.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Estilos que no hacen caso</title>
  <style>
    h1 {
      colour: navy;
    }
    p {
      color: #12;
    }
    table {
      width: 100 px;
    }
    .status {
      padding: 0.25rem 0.5rem
      border-radius: 999px;
    }
    .note {
      color: var(--color-textt);
    }
  </style>
</head>
<body>
  <main>
    <h1>Estilos que no hacen caso</h1>
    <p>Ninguna de estas reglas hace lo que el autor quería.</p>
    <p class="note">Este párrafo usa una variable que no existe.</p>
  </main>
</body>
</html>
```

The [W3C CSS validator](https://jigsaw.w3.org/css-validator/) lives at `https://jigsaw.w3.org/css-validator/` and accepts a file, an address or pasted text. This is what it answers about the style block above (copied from the real result):

```text
Line : 3 h1
       Property “colour” doesn't exist. The closest matching property name is “color” : 
       navy
Line : 6 p
       (Value Error : color (nullcolors.html#propdef-color))
       “#12” is not a valid color 3 or 6 hexadecimals numbers : 
Line : 9 table
       (Value Error : width (nullvisudet.html#propdef-width))
       Too many values or values are not recognized : 
Line : 13 .status
       (Value Error : padding (nullbox.html#propdef-padding))
       Missing a semicolon before the property name “border-radius”
```

Each message brings the file's line and the selector where it happens. One by one:

1. **`colour` does not exist.** The British spelling of “color”. And the message tells you which property you meant to write. The browser ignored the declaration and the title stayed black; there was no warning.
2. **`#12` is not a color.** A hexadecimal color has 3 or 6 digits (and 4 or 8 if it carries transparency). The value was discarded.
3. **`100 px`** has a space. For CSS they are two values, and width only accepts one: it is written `100px`, joined.
4. **A semicolon is missing** at the end of the `padding` declaration. The browser read `0.25rem 0.5rem border-radius: 999px` as a single invalid value, and **lost both declarations**. It is the most common error, and the one that surprises most, because a badly closed line takes the one below down with it.

The variable's error is another one: `var(--color-textt)` has an extra `t` and the variable does not exist. The validator **does not detect it** (its warning about the dashboard says that, because of their dynamic nature, variables are not checked statically). The browser does not complain either: I measured it in Chrome and the paragraph stayed with the usual black color, that of the inherited text. A variable that does not exist makes the declaration invalid *at the moment of computing the value*, and the property goes back to its inherited or initial value, silently. The way to find it is the one you already know: in the inspector, the declaration appears marked, and the paragraph's computed value is not the one you expected. Another good habit: a variable can carry a fallback value as a second argument, `var(--color-text, black)`, which is used when the variable does not exist.

One last check on this chapter's dashboard: I ran its stylesheet through the same validator and it answered “Congratulations! No Error Found”, with only two warnings saying that variables are not checked statically.

## What gets done wrong

**1. Resolving a conflict by raising the force.** More selectors, an identifier, an `!important`. *Cost:* each patch demands another stronger one, and the stylesheet ends up impossible to change. Fix: compute the specificity of the two rules, lower the one that does not need to be strong, and order with layers.

**2. Using identifiers to style.** `#summary dd { ... }`. *Cost:* an identifier weighs (1,0,0), which beats a thousand classes, and the only way to beat it is another identifier. Fix: style goes with classes or element selectors; the `id` is left for internal links and labels.

**3. The `style` attribute in the HTML.** *Cost:* it beats almost everything and mixes appearance with content; to change a color you have to edit the HTML in a hundred places. Fix: a class.

**4. `outline: none` without a replacement.** *Cost:* the keyboard user is left not knowing where they are. Fix: `:focus-visible` with an outline of your own.

**5. Font sizes in `px`.** *Cost:* whoever enlarges the font size from the browser's settings sees no effect, and is only left with zooming into your page every time. Fix: `rem`.

**6. Communicating status with color alone.** A badge that is only red or green. *Cost:* it is lost for whoever cannot tell those colors apart and for whoever uses a screen reader. Fix: the word always; color, as reinforcement.

**7. Subtracting pixels by eye.** `width: 280px` so that it “fits” with the padding. *Cost:* the number depends on a calculation nobody wrote, and it breaks when the padding changes. Fix: `box-sizing: border-box` for all and the width you really want.

**8. Naming variables by their color.** `--blue`, `--red`. *Cost:* the day the decision changes, the name lies. Fix: names by function, like `--color-accent`.

**9. Copying loose values into each rule.** The same `#0b5cad` in five places. *Cost:* changing it is search and replace, and one is always forgotten. Fix: a variable.

## Exercises

### Exercise 1 — Predict before opening

Given this page, write down what color each element of the list (A, B and C) will be **before** opening it. Then open it and compare. Finally, change **one single thing** in a rule so that B looks green and C crimson, without using `!important`:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Predice antes de abrir</title>
  <style>
    li { color: black; }
    #list li { color: navy; }
    .done { color: green; }
    li.urgent { color: crimson; }
  </style>
</head>
<body>
  <ul id="list">
    <li>A</li>
    <li class="done">B</li>
    <li class="done urgent">C</li>
  </ul>
</body>
</html>
```

### Exercise 2 — The card that sticks out

A card has `width: 100%`, `padding: 16px` and `border: 2px solid black`, inside a column 500 px wide. Compute by hand how wide the card is with `content-box` and how wide with `border-box`. Then write the page, measure it with the inspector and check your count.

### Exercise 3 — Changing the accent in one line

Change the dashboard's accent color to another of your choice by editing **a single line** of the stylesheet. Before choosing it, check with the browser developer tools' color picker or with WebAIM's checker that it meets 4.5 : 1 on white. Then answer: what things in the dashboard changed color with that single line?

### Exercise 4 — Undoing an `!important` war

This stylesheet has an `!important` that prevents the “Caído” badge from looking red. Fix it **by removing it and without adding another**, and without changing the HTML:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Guerra de important</title>
  <style>
    .status { color: gray !important; padding: 0 8px; }
    .status-down { color: red; }
  </style>
</head>
<body>
  <p><span class="status status-down">Caído</span></p>
</body>
</html>
```

## Solutions

### Solution 1

All three are **blue** (`navy`, `rgb(0, 0, 128)`). The `#list li` rule has specificity (1,0,1), with an identifier, and beats all the others: `.done` is (0,1,0) and `li.urgent` is (0,1,1), and none of them has an identifier. It is the trap of using identifiers to style: once one appears, no class can compete.

For B to be green and C crimson you have to **lower** that rule's force, not raise that of the others. `:where()` is worth zero, so `:where(#list) li` has specificity (0,0,1):

```css
li { color: black; }
:where(#list) li { color: navy; }
.done { color: green; }
li.urgent { color: crimson; }
```

With that change, I measured it in Chrome 154: A is blue (`rgb(0, 0, 128)`), B green (`rgb(0, 128, 0)`) and C crimson (`rgb(220, 20, 60)`). A stays blue because `:where(#list) li` and `li` tie at (0,0,1) and the one further down wins.

### Solution 2

With `content-box`: 500 of content width + 32 of padding (16 + 16) + 4 of border (2 + 2) = **536 pixels**, which sticks out by 36 pixels from the 500 column. With `border-box`: the `100%` width (500) already includes everything, so it measures **500**. My measurement matched: 536 and 500.

```css
.wrap { width: 500px; }
.card { width: 100%; padding: 16px; border: 2px solid black; }
.card.fixed { box-sizing: border-box; }
```

### Solution 3

You have to change the `--color-accent` line inside `:root`. For example, `#6f2da8` (a purple) gives 8.03 : 1 on white, which comfortably complies. A color like `#9a4dff` looks lively and **does not comply**: 4.30 : 1, below 4.5. With that single line, these change color: the links, the button's background, the focus outline and, as a side effect, the button's text, which is white (`--color-surface`) and also needs enough contrast against the new accent. That is the advantage of naming the decision and not the color: four places, one line. And the lesson that goes with it: when changing a variable you have to check **all** the combinations it takes part in, not just the one you had in mind.

### Solution 4

The `!important` makes `.status` beat everything. When it is removed, the two rules have the same specificity (0,1,0) and the order decides: `.status-down` comes later, so it wins, and the text is red. An adjustment that also makes the stylesheet sturdier is to use the variables pattern from section 3.3.1:

```css
.status { color: var(--badge-text); padding: 0 8px; }
.status-down { --badge-text: red; }
```

With that pattern no conflict is possible: the `.status` rule never says a color, it only reads a variable. And whoever needs another variant adds a one-line class. Before using it, measure that `red` on the real background meets the contrast.

## How I know I got it

- [ ] The dashboard opens at `http://localhost:8000/` with the stylesheet applied, with no errors in the console of the browser's developer tools.
- [ ] The CSS validator (`https://jigsaw.w3.org/css-validator/`) answers “Congratulations! No Error Found” on your `styles.css`.
- [ ] When pressing Tab you see a 3-pixel blue ring around the link, the field, the radios and the button, and searching for `outline: none` in your stylesheet gives no result.
- [ ] In the inspector, on the `border-box` box of `fig03_05.html`, the box diagram shows content 250 pixels wide (300 minus 40 of padding and 10 of border), and on the other, 300.
- [ ] You can predict the color of the four paragraphs of `fig03_02.html` before opening it, saying which step of the cascade breaks each tie.
- [ ] Every text color in your stylesheet meets 4.5 : 1 against its background, and you can say with what tool you measured it.
- [ ] Changing the value of `--color-accent` changes, at the same time, the links, the button and the focus ring.

## Further reading

- [MDN, “Handling conflicts” (cascade, specificity and inheritance)](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Handling_conflicts) — Mozilla's learning article on this same topic, with practice challenges. Accessed on October 7, 2026.
- [W3C, “CSS Cascading and Inheritance Level 5”](https://www.w3.org/TR/css-cascade-5/) — the specification where the cascade algorithm is written, with its layers and its order. Accessed on October 7, 2026.
- [MDN, “The box model”](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Box_model) — the box, padding, border and margin with diagrams and `box-sizing`. Accessed on October 7, 2026.
- [web.dev, “Learn CSS”](https://web.dev/learn/css) — a free course from Google by topic, useful as an ordered reference of selectors, box, cascade and inheritance. Accessed on October 7, 2026.
