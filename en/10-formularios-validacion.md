# Lesson 10 — Forms and validation

**Time:** two sessions of about 90 minutes. A split that works: the first one, “The why before the how” and 10.1 to 10.4 (what the browser already validates, `validity` and `setCustomValidity`, `:user-invalid` and the error written where it is read), with its figures open in the browser; the second one, the whole of 10.5, which builds the dashboard in seven steps with each one checked before the next, and then “The error you will see” and the exercises. Each session ends in something you can open and try.

**What you build:** the form for adding services to the `revisor` and the filters for searching among them

**What you learn:** the validation the browser already provides, `:user-invalid`, and how to word an error so that a screen reader announces it

## By the end you will be able to

- Choose a field's `type` and the attributes (`required`, `minlength`, `pattern`, `min`, `max`, `step`) that make the browser validate without a line of JavaScript.
- Read which rule a field breaks with `validity`, and write a rule of your own with `setCustomValidity` without leaving the field invalid forever.
- Explain the difference between `:invalid` and `:user-invalid`, and why a form must not open in red.
- Show an error as text on the page, tied to its field with `aria-describedby` and `aria-invalid`, so that a screen reader announces it.
- Write a filter as a pure function and connect it to a search field and a selector.
- Say, with an example, why validating in the browser is not security.

## The why before the how

Up to the previous lesson the `revisor` only looks: it brings a file of services, draws it and calculates how many are available and how long they take on average. Looking is half the work of whoever operates a set of services. The other half is acting: registering one that has just been born, and quickly finding the one that is giving trouble when the list no longer fits on one screen.

Both things are forms. A form is the place on the page where a person hands data to the program, and that makes it different from everything you have done so far. You wrote the services in the JSON file yourself, or a program you know wrote them. What someone types into a text field was written by a person in a hurry, with a phone in one hand, who may leave the field empty, put a name that already exists, write “mil” (a thousand) where a number was expected, or paste a two-hundred-character text. In Lesson 7 you learned that outside data is not trusted when drawing it (`textContent`, never `innerHTML`). In Lesson 8 you learned to look at `response.ok` before accepting a response as good, and in 9, that a request can fail in several ways and that each failure is translated into a sentence the person understands. This lesson adds the third entry door: what the person types.

There is good news, and it is the reason this lesson is short on JavaScript: **the browser already knows how to validate forms**. It has known for years. With a few HTML attributes —which you already know from Lesson 2, because they are part of the semantics of fields— the browser prevents sending an incomplete form, tells you what is missing and moves focus to the field that has the problem. The bad news is what occupies the second half of the lesson: what the browser shows on its own is a bubble that disappears in seconds, cannot be styled, is in the browser's language and does not always reach whoever uses a screen reader. A dashboard anyone can use needs the error to stay written on the page, next to the field, where it can be reread.

That is why the order of the lesson is the one that is always worth following: first what the browser does for free, then the right moment to show the error, and finally the text of the error. If you start by writing JavaScript, you end up rewriting, worse, what came ready-made.

### The dashboard's state at the close of Lesson 9

This lesson starts from a concrete dashboard, and it is better to say so in full than to let you assume it. At the close of Lesson 9, the `revisor` has these pieces:

| Piece | What it does | Which lesson it comes from |
|---|---|---|
| `index.html` | the skeleton: header with the “Última revisión” (Last check), the summary, and in the services section the notice zones (`#notice` and `#error-notice`, present from the start), the “Reintentar” (Retry) button and a data zone with the controls bar —the search field and the “Mostrar” (Show) radios, still without effect, “Revisar ahora” (Check now) and “Ordenar” (Sort)—, the table with its `caption` and the detail | 2, 4, 5, 7, 8 and 9 |
| `css/styles.css` | layers, color variables, status badges (`status-available`, `status-down`), the layout, the table, the visible focus, the `.visually-hidden` class and the notices | 3, 4, 5, 7 and 9 |
| `js/stats.js` | `countByStatus`, `averageResponseMs` and `summarize`, pure functions over the array of services | 6 |
| `js/load.js` | `loadServices(url, timeoutMs)`: `fetch` with a time limit, checks `response.ok`, and throws an `Error` with a message a person can read | 8 and 9 |
| `js/state.js` | the state (`phase`, `services`, `errorMessage`, `checkedAt`, `sortByTime`, `selected`) and the only functions that change it | 7, 8 and 9 |
| `js/view.js` | `render(state, elements)`: draws the three situations (loading, error, empty), the summary, the time and the table, always with `textContent` | 7, 8 and 9 |
| `js/main.js` | puts the pieces together: loads, listens to events, changes the state and draws again; accepts `?case=empty`, `?case=error`, `?case=invalid` and `?case=timeout` to see each situation | 8 and 9 |
| `data/services.json` and `data/services-empty.json` | the five example services with the keys `id`, `name`, `status` (`available` or `down`) and `responseMs`; and an empty list | 6 and 8 |

With that dashboard open at `http://127.0.0.1:8000/09-cuando-algo-falla/panel/` (the server is started from the `programas/` folder of the [course repository](https://github.com/HabilMX/curso-web), downloaded onto your computer, as in Lesson 9; for `?case=timeout` to really time out, start it with `python3 09-cuando-algo-falla/slow-server.py`, as there), the summary says 5, 4 of 5, 1 and 465 ms, and the table has five rows, each with its “Ver detalle” (View detail) button.

What the dashboard **does not have yet**: no way of adding a service, and a search field and a group of radios that have been on the page since Lesson 2 doing nothing. Lesson 2 announced it: “Todavía no filtra ni busca nada: eso llega más adelante” (It does not filter or search anything yet: that comes later). Today it comes: you build the form for adding, and you make the search field and the radios filter. In this lesson the files are in `10-formularios-validacion/panel/`, which is the Lesson 9 dashboard plus what is new.

## The concepts

There are three new ideas in this lesson, and they lean on one another: the validation the browser provides (10.1 and 10.2), the moment when it is convenient to show the error (10.3) and the error written where it is read (10.4). Section 10.5 brings the three together in the dashboard.

Before starting, a habit for all the lessons from this one on: **predict before running**. Every time you see a program, before opening it write in your logbook what you think is going to happen. Being right feels good, but being wrong teaches more: the gap between what you predicted and what happened is exactly what you still have to understand.

### 10.1 The browser already knows how to validate

Let us start with something concrete. The page below is a form for requesting a notice when a service goes down: an email, the service name and how long it must take to count as a problem. Read it and predict: what happens if you press “Pedir aviso” (Request notice) with everything empty? And if you type `dorian@` in the email?

The program at the end is short and does only one thing: when the form is submitted, it writes what was captured. It uses a new piece, `new FormData(form)`. Remember from “Deciding, repeating and signaling an error”, in Lesson 6, that `new` manufactures a new object from a mold; this mold, [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData), reads all the form's fields by their `name` attribute, and `data.get("email")` returns what was typed in the field called `email`. You will see it again, in more detail, in the dashboard.

```html
<!-- fig10_01.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Avisarme cuando caiga un servicio</title>
  <link rel="icon" href="data:,">
</head>
<body>
  <main>
    <h1>Avisarme cuando caiga un servicio</h1>
    <p>Los campos marcados con * son obligatorios.</p>

    <form id="alert-form">
      <p>
        <label for="email">Correo *</label><br>
        <input id="email" name="email" type="email" required autocomplete="email">
      </p>
      <p>
        <label for="service">Servicio *</label><br>
        <input id="service" name="service" type="text" required minlength="2">
      </p>
      <p>
        <label for="threshold">Avisar si responde en más de (ms)</label><br>
        <input id="threshold" name="threshold" type="number" min="100" max="60000" step="100" value="1000">
      </p>
      <button type="submit">Pedir aviso</button>
    </form>

    <p id="result" role="status"></p>
  </main>

  <script type="module">
    const form = document.getElementById("alert-form");
    const result = document.getElementById("result");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      result.textContent =
        `Aviso pedido: ${data.get("email")} recibirá un correo si ` +
        `${data.get("service")} tarda más de ${data.get("threshold")} ms.`;
    });
  </script>
</body>
</html>
```

Open it with the local server you already know (started from the repository's `programas/` folder; this page is in [`programas/10-formularios-validacion/`](https://github.com/HabilMX/curso-web/tree/main/programas/10-formularios-validacion), at `http://127.0.0.1:8000/10-formularios-validacion/fig10_01.html`) and press the button without typing anything. Without a line of JavaScript that validates, the browser **does not submit** the form, moves focus to the email and shows a bubble saying the field needs to be filled in. Type `dorian@` and press again: the browser says the address is incomplete, and it says so with a precise sentence (Chrome in Spanish: “Ingresa texto después del signo "@"…” (Enter text after the "@" sign…); another browser uses other words). With `ana@ejemplo.mx` and a service name, the form does get submitted and the small program below writes the result.

When loaded, the page shows only this:

```text
Avisarme cuando caiga un servicio
Los campos marcados con * son obligatorios.
Correo *
Servicio *
Avisar si responde en más de (ms)
Pedir aviso
```

All of that came from four attributes. Let us go one by one, because they are the validation toolbox and it is worth knowing what each one promises.

**`required`** says the field cannot be empty. It is the most used and the simplest: in a text field it means “at least one character”, in a checkbox “checked”, and in a `<select>` “an option is chosen, and it is not the invitation one”. This last case has a precise rule that surprises: if the **first** option has `value=""` (like “Elige un estado” (Choose a status) in the dashboard's form), the [HTML specification](https://html.spec.whatwg.org/multipage/form-elements.html#placeholder-label-option) calls it a *placeholder label option* and, if it is the one chosen, the field counts as empty. Notice that the rule is about the first option, not about just any empty value: when preparing this lesson it was checked in Chrome that a second option with `value=""` does leave the `<select required>` valid. It is the standard way to put an invitation option without anyone being able to submit it by accident, and that is why it always goes first.

**`type`** not only changes the keyboard that appears on the phone: it also validates. A `type="email"` rejects what does not look like an address, a `type="url"` what does not look like a URL and a `type="number"` what is not a number. An honest warning about `email`: the browser accepts `a@b` because, according to the specification, an address without a dot in the domain is valid (they exist on internal networks). What it validates is the *shape*, not that the email exists. To know whether it exists there is only one test: send a message and wait for someone to open it.

**`minlength` and `maxlength`** limit the length. `maxlength` prevents typing beyond the limit, silently, and so has a bad reputation: the person types and nothing happens, with no explanation. Use it when the limit is real (a database field of that size) and say how much is left. `minlength`, on the other hand, is only checked when the person *edits* the field. If the HTML brings an initial value that already violates `minlength`, the browser does not flag it; when preparing this lesson it was checked with `value="ab"` and `minlength="5"`: the `tooShort` flag stays off until someone types.

**A necessary parenthesis: regular expressions.** The next attribute, `pattern`, receives a *regular expression*, and later the dashboard will use another one in JavaScript. A **regular expression** is a pattern written in a mini-language that describes a family of texts: instead of saying “the text is `Pagos`”, it says “the text starts with a letter and then has anything”. Most characters stand for themselves (`a` is the letter `a`), and a few have a special meaning. The ones you will see in this lesson are these:

| Piece | Means |
|---|---|
| `.` | any one character |
| `\S` | one character that is **not** a space (the capital `S` negates `\s`, “a space”) |
| `\w` | an unaccented letter, a digit or an underscore |
| `*` | the preceding, zero or more times |
| `+` | the preceding, one or more times |
| `?` | the preceding is optional: zero or one time |
| `( … )` | groups several pieces so that `*`, `+` or `?` apply to the whole group |
| `[ … ]` | any one character among those between the brackets |
| `^` and `$` | the start and the end of the text |

A worked example, the one from the dashboard's form: `\S(.*\S)?`. It reads from left to right: one character that is not a space; then, optionally, a group formed by “anything” and another character that is not a space. Put in words: it starts and ends with something that is not a space, and in the middle there can be whatever, spaces included. Check it with cases: `Pagos` passes; `A` passes (the optional group does not appear); `Mis pagos` passes (the space is in the middle); ` Pagos` and `Pagos ` do not pass, and neither does the empty text. Those six cases were checked in the JavaScript engine as the browser compiles them. In JavaScript, a regular expression is written between slashes, `/…/`, and after the last slash go its **flags**, letters that change how it is applied: `g` (all the matches, not only the first) and `u` or `v` (understand Unicode characters properly, such as accented letters). MDN's guide to [regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions) has the complete list; for this lesson the table is enough.

**`pattern`** receives a regular expression that the whole value must meet (the expression is anchored: it is as if it carried `^` at the start and `$` at the end). In the dashboard's form, `pattern="\S(.*\S)?"` says “starts and ends with something that is not a space”. Two traps: the first is that current browsers compile the pattern in a strict mode (the `v` flag), in which a loose hyphen inside a set, as in `[\w-]+`, is a syntax error. The invalid pattern does not warn loudly: the browser ignores it and the field is left with no rule, with a message only in the console. The second trap is its twin: a pattern that is too clever rejects real data, such as a surname with an apostrophe or a name with an accent. A pattern is not an act of faith, it is a rule that someone has to maintain.

**`min`, `max` and `step`** are for numeric (and date) fields. `min="0" max="60000"` sets the range. `step` sets the grid of valid values, and here there is a detail that weighs: the grid is counted from `min`. With `min="0" step="100"`, 0, 100, 200… are valid, so 1050 is invalid even though it is inside the range.

A comment on `type="number"`, because the decision is not obvious. The numeric field validates on its own, rejects what is not a number and offers arrows to go up and down. “Number”, careful, is not “digits only”: it also accepts a sign, decimals (if `step` allows them) and even scientific notation; when preparing this lesson it was checked in Chrome 154 that `1e2` is a valid value and equals 100. In addition, those arrows are activated by accident with the mouse wheel, and whoever uses a screen reader does not find a text box, but a “number button” that goes up and down: its implicit role is `spinbutton`, according to [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/number). The British government's design system, which researched the subject with real users, recommends `type="text"` with `inputmode="numeric"` for numbers that are not incremented (the [GOV.UK Design System](https://design-system.service.gov.uk/components/text-input/) argues it with its research), and the [MDN documentation on `type="number"`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/number) makes the same caveat for postal codes or cards. The `revisor`'s response time is a quantity with a range (“how many milliseconds”), so we use `type="number"` with `min` and `max`; if your field were a reference number, you would use text with `inputmode`.

And one more attribute, which does not validate but belongs to this topic: **`autocomplete`**. It tells the browser (and whoever reads you with assistive technology) what kind of data the field asks for. `autocomplete="email"` makes the browser offer the saved email, and criterion [1.3.5 of the accessibility guidelines (WCAG 2.2)](https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html) asks that fields that collect personal data declare their purpose in a way a machine understands. The `revisor`'s fields (a service's name, status, milliseconds) are not personal data, so no value from the list applies there; that is why the dashboard's form carries `autocomplete="off"`: we do not want the browser to suggest service names someone typed elsewhere. The list of allowed values is in the [MDN documentation on `autocomplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete).

### Two things that the browser's validation is not

**It is not security.** It is convenience. MDN says so bluntly in its [form validation guide](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation): client-side validation should not be considered an exhaustive security measure, because it is very easy to bypass. Whoever wants to submit an invalid value does not use your form: they open the browser developer tools, remove the `required` attribute with a click, or do not even use a browser and send the request with a command-line tool. Client validation exists so that the honest person makes fewer mistakes. The validation that protects is the one the server repeats, and you will have to write it there when your dashboard has one (in this house's [TypeScript course](https://www.habil.mx/en/courses/typescript/) the dashboard gets a server, and that is the moment).

In this course the dashboard has no server: what you add lives in the page's memory and disappears on reload. That is a limitation that is stated openly, not an oversight; what does apply is the habit: **every piece of data that comes in is validated at the border where it comes in**.

**It is not the only mechanism.** `novalidate` on the `<form>` turns off automatic validation on submit, and `formnovalidate` on a button turns it off for that button (useful in a “Save draft”). Turning it off does not deactivate the validation API that we will see next: the form can still ask each field whether it is valid. In the dashboard we will not use `novalidate`: we want the browser to keep blocking the submission, and we will change only *how the message is shown*.

One last detail about submitting: a field with `disabled` is left out of everything. It is not validated, does not count for `checkValidity()` and is not sent with the form. When preparing this lesson it was checked with an empty `required` and `disabled` field: `willValidate` is false, `validity.valid` is true and the field does not appear in `FormData`. The dashboard takes advantage of it: if the service is down there is no point asking for its response time, so that field is disabled and stops being required on its own.

### 10.2 Reading a field's state: `validity` and `setCustomValidity`

Native validation has two halves. The attributes *declare* it; the **Constraint Validation API** (described in [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Constraint_validation) and in the [HTML specification](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#constraints)) lets you *ask* and *add rules* from JavaScript.

Each field has a `validity` property ([`ValidityState`](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState)): an object with a flag for each rule that can be broken. The ones you will use:

| Flag | Turns on when |
|---|---|
| `valueMissing` | the field is `required` and empty |
| `typeMismatch` | the value does not have the shape of the `type` (email, URL) |
| `patternMismatch` | the value does not meet the `pattern` |
| `tooShort` | the person typed less than `minlength` |
| `rangeUnderflow` / `rangeOverflow` | the number is below `min` or above `max` |
| `stepMismatch` | the number does not fall on the `step` grid |
| `badInput` | the person typed something the field cannot convert (in a `type="number"`, a stray `-`) |
| `customError` | your code called `setCustomValidity` with a message |
| `valid` | none of the above |

The following page goes through those flags with a form of loop you have not used yet: **`for…in`**. You already know `for…of` from Lesson 6, in “Deciding, repeating and signaling an error”: it goes through the **values** of a list. `for (const flag in object)` goes through something else: the **property names** of an object, one per pass, as text. With `{ valueMissing: true, tooShort: false }`, `flag` would be `"valueMissing"` on the first pass and `"tooShort"` on the second. To read the value of a property whose name is stored in a variable, brackets are used: `control.validity[flag]` is `control.validity.valueMissing` when `flag` is `"valueMissing"`. A technical detail that works in your favor here: `for…in` also visits the properties that the object inherits from its mold, and the `validity` flags live right there, in the `ValidityState` mold; that is why the loop finds them all ([MDN: `for…in`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in)). In an object written by you, where inherited properties are of no interest, it is traversed with `Object.keys` or filtered with `Object.hasOwn`, as in Lesson 9.

Before reading the page that follows, predict: if you type `-5` in a numeric field with `min="0"` and `step="100"`, which flags turn on? (One answer is likely; two is the correct one.)

```html
<!-- fig10_02.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Las banderas de validity</title>
  <link rel="icon" href="data:,">
  <style>
    input { font: inherit; padding: 0.5rem; }
    pre { background: #f4f6f8; padding: 0.75rem; }
  </style>
</head>
<body>
  <main>
    <h1>Las banderas de validity</h1>

    <p>
      <label for="time">Tiempo de respuesta (ms)</label><br>
      <input id="time" type="number" required min="0" max="60000" step="100">
    </p>
    <p>
      <label for="name">Nombre (no puede ser «admin»)</label><br>
      <input id="name" type="text" required minlength="3">
    </p>

    <h2>Banderas activas</h2>
    <pre id="report" role="status"></pre>
  </main>

  <script type="module">
    const time = document.getElementById("time");
    const name = document.getElementById("name");
    const report = document.getElementById("report");

    function activeFlags(control) {
      const flags = [];
      for (const flag in control.validity) {
        if (control.validity[flag] === true && flag !== "valid") {
          flags.push(flag);
        }
      }
      return flags.length === 0 ? "ninguna (valid: true)" : flags.join(", ");
    }

    function validateName() {
      // Sin la rama que limpia, el campo se quedaría inválido para siempre.
      name.setCustomValidity(
        name.value.toLowerCase() === "admin" ? "Ese nombre está reservado." : "",
      );
    }

    function show() {
      report.textContent =
        `tiempo -> ${activeFlags(time)}\n` + `nombre -> ${activeFlags(name)}`;
    }

    for (const control of [time, name]) {
      control.addEventListener("input", () => {
        validateName();
        show();
      });
    }
    show();
  </script>
</body>
</html>
```

The page goes through the properties of `validity` and lists those that are `true`. When opened, the two empty fields break their `required`:

```text
Las banderas de validity
Tiempo de respuesta (ms)
Nombre (no puede ser «admin»)
Banderas activas
tiempo -> valueMissing
nombre -> valueMissing
```

Type `-5` in the time and you will see `rangeUnderflow, stepMismatch`: it is below `min` and also falls outside the 100-by-100 grid counted from 0. That is why I said one answer is likely and two is the correct one: **several flags can be on at once**, and so a program that shows messages has to decide which goes first. With `1050` only `stepMismatch` goes up; with `70000`, `rangeOverflow`. In the name, typing `ad` turns on `tooShort`, and typing `admin` turns that flag off and turns on `customError`.

That last one is the custom rule. `setCustomValidity("text")` tells the field “consider yourself invalid, and this is the reason”; the browser also uses it as the text of its bubble. It carries a trap that causes a classic error: **a non-empty message leaves the field invalid forever**. The browser does not know when your rule is already met; you are the one who must call `setCustomValidity("")` as soon as the value is correct. In the page, the `validateName` function does it with a single expression (a ternary): if the name is `admin` it sets the message, and if not it sets the empty string. Removing that second branch is the easiest mistake to make and the hardest to understand from outside, because the field “looks fine” and the form does not submit.

A useful fact before going on: two methods let you ask about the whole form. `checkValidity()` returns `true` or `false` and fires the `invalid` event on each invalid field, showing nothing. `reportValidity()` does the same and also shows the browser's bubble. When you submit a form with the button, the browser calls the second one for you.

### 10.3 `:user-invalid`: showing the error when it is time

There is a design question that seems a matter of taste and is a matter of respect: when is a field painted red? The naive answer is “when it is invalid”. The problem is that a freshly loaded `required` field is invalid from the first instant: it is empty. If you paint everything invalid red, the person opens the form and finds a board of errors before having done anything. It is as if a cashier scolded you for not having arrived yet with the money.

The `:invalid` pseudo-class does exactly that: it matches every field that breaks a rule, from the moment the page loads. Its successor `:user-invalid` ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/:user-invalid), available in all browsers since November 2023) matches only when the person has already intervened: when they modified the field and left it, or when they tried to submit the form. It is the rule that already describes what you wanted from the start.

The page that follows uses three small pieces to show what the browser knows. `element.matches(":user-invalid")` asks whether the element meets that CSS selector at this moment, and returns `true` or `false`. `setTimeout(show)`, without a time, asks “run `show` as soon as what is happening ends”, to read the state *after* the browser has updated it. And the `true` at the end of `addEventListener` listens in the capture phase; the reason is explained in 10.4, with the `invalid` event.

Predict before opening the page: there are two required, empty fields, one styled with `:invalid` and the other with `:user-invalid`. Which looks red on loading?

```html
<!-- fig10_03.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>:invalid contra :user-invalid</title>
  <link rel="icon" href="data:,">
  <style>
    input { font: inherit; padding: 0.5rem; border: 3px solid #8a949e; }
    #old-field:invalid { border-color: #b3261e; }
    #new-field:user-invalid { border-color: #b3261e; }
    pre { background: #f4f6f8; padding: 0.75rem; overflow-wrap: anywhere; white-space: pre-wrap; }
  </style>
</head>
<body>
  <main>
    <h1>:invalid contra :user-invalid</h1>

    <form id="form">
      <p>
        <label for="old-field">Con :invalid (rojo desde que abres la página)</label><br>
        <input id="old-field" required>
      </p>
      <p>
        <label for="new-field">Con :user-invalid (rojo cuando la persona ya intervino)</label><br>
        <input id="new-field" required>
      </p>
      <button type="submit">Enviar</button>
    </form>

    <h2>Lo que el navegador sabe</h2>
    <pre id="report" role="status"></pre>
  </main>

  <script type="module">
    const form = document.getElementById("form");
    const newField = document.getElementById("new-field");
    const report = document.getElementById("report");

    function show() {
      report.textContent =
        `valueMissing: ${newField.validity.valueMissing}\n` +
        `:invalid: ${newField.matches(":invalid")}\n` +
        `:user-invalid: ${newField.matches(":user-invalid")}`;
    }

    form.addEventListener("submit", (event) => event.preventDefault());
    for (const type of ["input", "focusout", "invalid"]) {
      form.addEventListener(type, () => setTimeout(show), true);
    }
    show();
  </script>
</body>
</html>
```

When loaded, the report below says what the browser knows about the second field:

```text
:invalid contra :user-invalid
Con :invalid (rojo desde que abres la página)
Con :user-invalid (rojo cuando la persona ya intervino)
Enviar
Lo que el navegador sabe
valueMissing: true
:invalid: true
:user-invalid: false
```

The first field is already red and the second is not, although both are equally empty. The last line makes that visible: `:invalid` is true and `:user-invalid` is false. Now do this, in this order:

1. Click on the second field, type a letter, delete it and press Tab. The report changes: `:user-invalid` becomes true and the field turns red.
2. Reload and press “Enviar” (Submit) without touching anything: both look red and the report also marks `:user-invalid` as true.

Here is a difference between browsers that deserves mention because it may confuse you when comparing. If you click on an empty field and leave it **without typing anything**, Chrome 154 leaves `:user-invalid` false, but Firefox 155 makes it true. Both were checked when preparing this lesson; it was not tested in Safari. The specification leaves room for what counts as “intervened”, and the practical consequence is a design rule: **do not depend on `:user-invalid` for the fields the person skipped**. For those, the safe moment is the submission, which in all browsers marks everything.

The dashboard's style uses both things at once, and it is what you will see in `css/styles.css`: `.field :user-invalid, .field [aria-invalid="true"] { … }`. The first part paints what the browser decides to mark; the second what our code marks. It is not redundancy, it is coverage: by either path the field shows as in error.

And an accessibility reminder that goes with color: **red is not a message**. A field with a red border and nothing else is invisible to whoever cannot tell red apart and mute to whoever uses a screen reader. The color accompanies; the text informs. That is what comes next.

### 10.4 The error written where it is read

The browser's bubble serves a function, but it has four limits that matter. It disappears in a few seconds, so whoever needs more time to read no longer has it. It cannot be styled. It comes out in the browser's language and with the manufacturer's words (when preparing this lesson, Chrome in Spanish said “Ingresa texto después del signo "@". La dirección "dorian@" está incompleta.”; in another browser or language it would be another sentence). And with a screen reader, its announcement depends on each combination of browser and reader. The accessibility guidelines warn of it in the document that explains criterion [3.3.1, Error Identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html) (level A): the error must be identified and described **in text**, and that same document recommends not depending only on native validation because of its limits with screen magnification, the permanence of the message and multiple errors.

The solution fits in four pieces, and you will see them together in a minimal page before using them in the dashboard.

**First piece: the message is a paragraph of the page**, which exists from the start (empty) and is filled when there is an error. It lives next to the field and is written with `textContent`.

**Second piece: the field points to its message with `aria-describedby`.** This attribute ([MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-describedby)) tells assistive technology: “the text of that element describes this field”. The label (`<label>`) gives the field's *name* and is read first; the description is read afterwards. When focus lands on the field, the reader says something like “Correo, edit box, Escribe tu correo” (Email, edit box, Type your email). It accepts several identifiers separated by a space: in the dashboard, each field points to its help (“Al menos 2 caracteres” (At least 2 characters)) and to its error. It was checked in Chrome's accessibility tree: the description of the name field came out as “Al menos 2 caracteres. No puede repetirse. Escribe el nombre del servicio.” (At least 2 characters. It cannot be repeated. Type the service name.).

**Third piece: `aria-invalid="true"` marks the field as invalid** ([MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-invalid)). That way the reader can say “invalid” on arriving. MDN clarifies when to set it: *after* trying to submit or validate, never from the page loading on an empty field, because it would be the same red board as before, but spoken.

**Fourth piece: focus is taken to the first field with an error.** It is what the browser did with its bubble, and when you turn it off it has to be done by hand. Whoever navigates with a keyboard lands exactly where they must correct, and whoever uses a screen reader immediately hears the name, the error and the state. It is also the biggest help for the criterion of operating everything with a keyboard ([2.1.1](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html), level A).

How do you turn off the bubble without turning off the validation? With the **`invalid`** event. Every time the browser checks a field and finds it invalid, it fires `invalid` on it ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event)), and if your code calls `preventDefault()`, the browser does not show its bubble. Two cautions: the event **does not go up the tree** (it does not bubble), so a listener placed on the `<form>` only receives it if you register it in the capture phase (the third argument `true`); it was checked with a normal listener on the form and it received nothing. And since you canceled the event, the browser does not move focus either: you do it.

Predict what this page will do with the empty field and with `dorian` (without an at sign):

```html
<!-- fig10_04.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Un campo, un error que se lee</title>
  <link rel="icon" href="data:,">
  <style>
    input { font: inherit; padding: 0.5rem; border: 2px solid #8a949e; }
    [aria-invalid="true"] { border-color: #b3261e; }
    .error { color: #b3261e; font-weight: 600; min-height: 1.5rem; margin: 0.25rem 0; }
  </style>
</head>
<body>
  <main>
    <h1>Un campo, un error que se lee</h1>

    <form id="form">
      <p>
        <label for="email">Correo *</label><br>
        <input id="email" name="email" type="email" required autocomplete="email"
               aria-describedby="email-error">
      </p>
      <p id="email-error" class="error"></p>
      <button type="submit">Pedir aviso</button>
    </form>
    <p id="result" role="status"></p>
  </main>

  <script type="module">
    const form = document.getElementById("form");
    const email = document.getElementById("email");
    const error = document.getElementById("email-error");
    const result = document.getElementById("result");

    function message() {
      if (email.validity.valueMissing) return "Escribe tu correo.";
      if (email.validity.typeMismatch) return "Falta algo: un correo se ve así, nombre@dominio.mx.";
      return "";
    }

    email.addEventListener("invalid", (event) => {
      event.preventDefault();
      error.textContent = message();
      email.setAttribute("aria-invalid", "true");
      email.focus();
    });

    email.addEventListener("input", () => {
      if (!email.hasAttribute("aria-invalid")) {
        return;
      }
      error.textContent = message();
      if (email.validity.valid) {
        email.removeAttribute("aria-invalid");
      }
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      result.textContent = `Aviso pedido para ${email.value}.`;
    });
  </script>
</body>
</html>
```

When loaded it shows only the form:

```text
Un campo, un error que se lee
Correo *
Pedir aviso
```

Press the button with the field empty: “Escribe tu correo.” (Type your email.) appears, the field turns red and focus lands on it. Type `dorian` and, while you type, the message updates to “Falta algo: un correo se ve así, nombre@dominio.mx.” (Something is missing: an email looks like this, name@domain.mx.); when the value becomes valid, the message and the mark disappear. Observe three decisions in the code. The message depends on the flag (`valueMissing` or `typeMismatch`), not on the browser's text, and so it is in your language and in your voice. The update while typing only happens if the field was already marked, so as not to scold someone who has not finished yet. And the message says **what to do**, not only what is wrong: [3.3.3, Error Suggestion](https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html), when the suggestion is known.

### Status notices: `role="status"` and `role="alert"`

One piece is missing: messages that do not belong to a field. “Servicio agregado” (Service added), “there are 3 fields with errors”, “showing 2 of 5 services”. Whoever sees the screen sees them; whoever uses a screen reader needs them to be announced **without moving focus**. That is what criterion [4.1.3, Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) (level AA) asks for. It is solved with a *live region*: an element whose content, when it changes, the reader reads without anyone visiting it.

There are two, and the difference is urgency. With **`role="status"`** ([MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/status_role)) the notice is polite: the reader waits until it has finished reading what it was reading. With **`role="alert"`** ([MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/alert_role)) it interrupts. MDN asks that the second be used carefully, because interrupting is a nuisance reserved for what cannot wait (a connection failure, not “5 results”). In the dashboard, `#notice` (loading or empty), `#count` and `#form-result` are `status`, and `#error-notice` (the service could not load) is `alert`.

And the rule that is broken most, which MDN puts first: **the container has to exist on the page before its content changes**. If you create the paragraph with its text at the same time, many readers do not announce it, because what they observe is a *change* inside an already known region. That is why the three elements are in the HTML, empty, from the start, and why the stylesheet never turns them off with `display: none` while they are empty: that would take them out of the accessibility tree, as measured in Lesson 9.

A limit that is stated openly: what could be checked when preparing this lesson is the state the browser hands to assistive technology (the accessibility tree with the descriptions and the `invalid` state, and that the live regions change text at the right moment). What was not done is listening to the output of a real screen reader. When you finish the lesson, do that test yourself with the reader your system comes with; it is the only one that counts.

### 10.5 In the dashboard: adding and filtering

Now everything together. The dashboard gains two things: that the search field and the radios from Lesson 2 filter the table, and the form for adding a service. Let us start with the decisions, before the code.

**The controls were already there.** The “Buscar servicio” (Search service) field and the “Mostrar” group, with its Todos (All), Disponibles (Available) and Caídos (Down) radios, have been on the page since Lesson 2, with their labels and their `<fieldset>`. There is no need to invent a search box: you only have to listen to them. It is the gain from having written the HTML for what it means from the start.

**The filter is a pure function.** `filterServices(services, filter)` receives the array and the conditions, and returns the filtered array, without touching the page. It is the same style as `js/stats.js`, and so it can be tested without a screen, as you did with the state in Lesson 7. It normalizes the text before comparing (removes accents and capitals) so that `catalo` finds `Catálogo`: `normalize("NFD")` ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)) separates each letter from its accent, and a regular expression erases the marks.

**The state grows a field.** `state.filter` stores the text and the chosen status; `visible(state)` filters first and sorts afterwards. Filtering is not done by touching DOM rows: it is done by *drawing again from the data*, as you learned in Lesson 7.

**The count is announced with a delay.** The table updates with every key, but the notice “Mostrando 3 de 5 servicios.” (Showing 3 of 5 services.) waits 400 ms from the last key. Without that wait, a screen reader would announce “Mostrando 4… Mostrando 3… Mostrando 1…” letter by letter, and what was meant to help gets in the way. It is a `setTimeout` ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout)) that is canceled and set up again on every key.

**The form takes advantage of what is already there.** The attributes do the validation; the program only changes the place where the message is shown. The name must be unique: it is a rule the browser does not know, so it goes with `setCustomValidity` and its cleanup. The response time is disabled if the service is down. Each field always reserves the line for its message (`min-height`), so that the page does not jump when someone makes a mistake; in Lesson 11 you will see that those jumps are measured.

**The form also works with the empty list.** With `?case=empty` the dashboard says “No hay servicios que revisar.” and there is no table. There the form stays visible: it is the way to register the first one. And “Reintentar” is also there, which Lesson 9 shows with the empty list because “Revisar ahora” lives in the data zone, hidden in that case. That is why the form zone depends on the phase (`"ready"`) and not on there being rows.

**After adding, it announces and returns to the first field.** The message says how many services there are now and, if the current filter hides the new one, it says so too: without that, whoever filters by “Caídos” and adds an available one would see that “nothing happened”.

The new files are `js/filters.js` and `js/form.js` (this one translates the `validity` flags into sentences and reads the form). `js/state.js`, `js/view.js`, `js/main.js`, `index.html` and `css/styles.css` change. They stay as Lesson 9 left them: `js/load.js`, `js/stats.js`, `data/services.json` and `data/services-empty.json`.

You will build it in **seven steps**, from the pure pieces to the ones that touch the page. Each step has the same form: first **what the file does and why**, then **its code**, and finally **how you check** it came out right before moving on to the next. The order is not capricious: until step 6 the dashboard keeps working exactly as in Lesson 9, because each new piece is added without anyone using it yet, and so any error that appears is from the last step you took. Only step 7 connects everything. The checks with the console use `await import("./js/archivo.js")`, which loads a module from the browser developer tools console with the dashboard open and lets you call its functions by hand.

#### Step 1 — `js/filters.js`: which services pass the filter

**What it does and why.** It decides which services meet the searched text and the chosen status. It is the shortest file of the lesson and the one most worth understanding, because it knows nothing about the page: it receives an array and returns another. It has two functions. `normalize(text)` leaves a text ready to compare: `normalize("NFD")` separates each letter from its accent (the “á” becomes “a” plus an accent mark), and then `.replace(/\p{Diacritic}/gu, "")` erases the marks. That `/\p{Diacritic}/gu` is a regular expression like the ones in the parenthesis of 10.1: `\p{Diacritic}` means “any character that Unicode classifies as a diacritic mark”, that is, the accents and the diaeresis; the `g` flag makes all of them be erased and not only the first, and the `u` is the one that allows writing `\p{…}`. Afterwards, `toLowerCase()` turns everything to lowercase and `trim()` removes the spaces at the ends. The second function, `filterServices`, uses the `filter` from Lesson 6 with a double condition: the normalized name **includes** (`includes`) the searched text, and the status is the chosen one or “Todos” was chosen.

```js
// panel/js/filters.js
// Decide qué servicios pasan el filtro. Son funciones puras: no tocan el documento.

// Quita acentos y mayúsculas para que "catalo" encuentre "Catálogo".
export function normalize(text) {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

// filter = { text: "", status: "all" | "available" | "down" }
export function filterServices(services, filter) {
  const wanted = normalize(filter.text);
  return services.filter((service) => {
    const nameMatches = normalize(service.name).includes(wanted);
    const statusMatches = filter.status === "all" || service.status === filter.status;
    return nameMatches && statusMatches;
  });
}
```

**How you check it.** With the dashboard open (it still looks the same as in Lesson 9), type in the console `const f = await import("./js/filters.js")` and then `f.normalize("  CATÁLOGO ")`. It must answer `"catalogo"`: no accent, no capitals and no spaces. That is how it was checked in Chrome 154.

#### Step 2 — `js/state.js`: the state learns to filter

**What it does and why.** It is the Lesson 9 state with one more field and three new functions. What is new is `filter`, `changeFilter`, `nameExists`, `addService` and that `visible` filters before sorting. Three JavaScript tools appear here for the first time. [`Object.assign(target, changes)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) copies into `target` each property of `changes` and leaves the others intact: if `state.filter` is `{ text: "cat", status: "all" }` and `{ status: "down" }` arrives, the result is `{ text: "cat", status: "down" }`. That is why `changeFilter` can receive only what changed, whether it comes from the search field or from the radios. `some`, from Lesson 6, answers whether **at least one** service meets the condition, which is exactly the question “does that name already exist?”. And `push` adds an element to the end of an array; here the array does change, because adding a service is precisely changing the list.

```js
// panel/js/state.js
// El estado del panel y las únicas formas de cambiarlo.
// No toca el documento: por eso se puede probar sin pantalla.
import { filterServices, normalize } from "./filters.js";

export function createState() {
  return {
    phase: "loading",       // "loading" | "error" | "ready"
    services: [],
    errorMessage: null,     // texto para la persona, solo en la fase "error"
    checkedAt: null,        // cuándo llegaron los datos por última vez (un Date), o null
    sortByTime: false,      // false = en el orden original; true = del más rápido al más lento
    selected: null,         // el id del servicio elegido, o null
    filter: { text: "", status: "all" },
  };
}

export function startLoading(state) {
  state.phase = "loading";
  state.errorMessage = null;
}

export function loadSucceeded(state, services, checkedAt) {
  state.phase = "ready";
  state.services = services;
  state.checkedAt = checkedAt;
  state.selected = null;
}

export function loadFailed(state, message) {
  state.phase = "error";
  state.errorMessage = message;
}

// Lo que la pantalla debe mostrar: "empty" no es una fase que se guarde, se DEDUCE.
// Una lista vacía que llegó bien es un resultado válido, no un error.
export function situation(state) {
  if (state.phase === "ready" && state.services.length === 0) return "empty";
  return state.phase;
}

export function toggleSort(state) {
  state.sortByTime = !state.sortByTime;
}

// Elegir el que ya estaba elegido lo deselecciona.
export function select(state, id) {
  state.selected = state.selected === id ? null : id;
}

// changes = { text } o { status }: solo se pisa lo que llega.
export function changeFilter(state, changes) {
  Object.assign(state.filter, changes);
}

export function nameExists(state, name) {
  const wanted = normalize(name);
  return state.services.some((service) => normalize(service.name) === wanted);
}

export function addService(state, service) {
  state.services.push(service);
}

// Lo que se debe mostrar, calculado a partir del estado cada vez: primero se filtra,
// luego se ordena. filter y toSorted devuelven copias: el arreglo de los datos no se toca.
export function visible(state) {
  const filtered = filterServices(state.services, state.filter);
  if (!state.sortByTime) {
    return filtered;
  }
  // Los que no tienen medida (null) van al final.
  return filtered.toSorted((a, b) => (a.responseMs ?? Infinity) - (b.responseMs ?? Infinity));
}

export function selectedService(state) {
  return state.services.find((service) => service.id === state.selected) ?? null;
}
```

**How you check it.** Reload the dashboard: it must look **the same as in Lesson 9**, with five rows and the summary at 5, 4 of 5, 1 and 465 ms. It seems nothing happened, and that is what is wanted: the filter starts at “Todos” and with empty text, so it lets everyone through, and nobody changes it yet. If you see something different, the error is in this file. The real check is step 3.

#### Step 3 — The test without a screen

**What it does and why.** Before touching the page, a test that needs no screen, like the one in Lesson 7. Predict how many lines will say `ok`:

```html
<!-- panel/filters-test.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Prueba de los filtros (sin dibujar nada del panel)</title>
</head>
<body>
  <h1>Prueba de los filtros</h1>
  <pre id="output"></pre>
  <script type="module">
    import { normalize, filterServices } from "./js/filters.js";
    import { createState, loadSucceeded, changeFilter, nameExists, addService, toggleSort, visible } from "./js/state.js";

    const services = [
      { id: "catalog", name: "Catálogo", status: "available", responseMs: 120 },
      { id: "payments", name: "Pagos", status: "available", responseMs: 480 },
      { id: "inventory", name: "Inventario", status: "down", responseMs: null },
      { id: "notifications", name: "Notificaciones", status: "available", responseMs: 310 },
      { id: "search", name: "Búsqueda", status: "available", responseMs: 950 },
    ];

    const lines = [];
    function check(description, condition) {
      lines.push(`${condition ? "ok    " : "FALLA "} ${description}`);
    }
    const names = (list) => list.map((service) => service.name).join(", ");
    const all = (text) => ({ text, status: "all" });

    check("normalize quita acentos y mayúsculas", normalize("  CATÁLOGO ") === "catalogo");
    check("sin filtro pasan todos", filterServices(services, all("")).length === 5);
    check("«catalo» encuentra Catálogo", names(filterServices(services, all("catalo"))) === "Catálogo");
    check("«BUSQUEDA» encuentra Búsqueda: ni la «ú» ni las mayúsculas importan", names(filterServices(services, all("BUSQUEDA"))) === "Búsqueda");
    check("el estado «down» deja solo Inventario", names(filterServices(services, { text: "", status: "down" })) === "Inventario");
    check("texto y estado se combinan: «o» y «available» deja tres", names(filterServices(services, { text: "o", status: "available" })) === "Catálogo, Pagos, Notificaciones");
    check("filtrar no cambia el arreglo original", services.length === 5);

    const state = createState();
    loadSucceeded(state, services, new Date());
    check("nameExists ignora mayúsculas y acentos", nameExists(state, "catalogo") === true);
    check("nameExists dice que no a un nombre nuevo", nameExists(state, "Facturas") === false);

    changeFilter(state, { status: "down" });
    addService(state, { id: "billing", name: "Facturas", status: "available", responseMs: 230 });
    check("un servicio nuevo que no cumple el filtro se agrega pero no se ve", state.services.length === 6 && names(visible(state)) === "Inventario");

    changeFilter(state, { text: "o", status: "all" });
    toggleSort(state);
    check("el orden se aplica después del filtro: con «o», del más rápido al más lento", names(visible(state)) === "Catálogo, Notificaciones, Pagos, Inventario");

    document.querySelector("#output").textContent = lines.join("\n");
  </script>
</body>
</html>
```

Open it at `…/10-formularios-validacion/panel/filters-test.html` and compare with what you predicted:

```text
Prueba de los filtros
ok     normalize quita acentos y mayúsculas
ok     sin filtro pasan todos
ok     «catalo» encuentra Catálogo
ok     «BUSQUEDA» encuentra Búsqueda: ni la «ú» ni las mayúsculas importan
ok     el estado «down» deja solo Inventario
ok     texto y estado se combinan: «o» y «available» deja tres
ok     filtrar no cambia el arreglo original
ok     nameExists ignora mayúsculas y acentos
ok     nameExists dice que no a un nombre nuevo
ok     un servicio nuevo que no cumple el filtro se agrega pero no se ve
ok     el orden se aplica después del filtro: con «o», del más rápido al más lento
```

Notice the combination check: with “o” only four would pass (Inventario too) and with “available” alone, another four (Búsqueda too); the three that come out prove that the two conditions are applied at once. A test whose result would be the same with a single condition would not test the combination.

#### Step 4 — `index.html`: the controls that were missing

**What it does and why.** Compared with Lesson 9, few things change: the radios' `<fieldset>` gains an `id` so it can be listened to; the count notice, `#count`, appears, and an `id` on the table's box, `#table-zone`, to hide it when no service passes the filter; the services section gains the class `layout-tall`, which is explained with the styles; and at the end of `<main>` the new section arrives, “Agregar un servicio” (Add a service). Notice each field's relationship with its help and its error through `aria-describedby`, the elements with `role="status"` (which exist empty from the start), and that the form zone starts hidden:

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

    <section id="services" class="layout-tall">
      <h2>Servicios</h2>

      <!-- Las dos zonas de aviso existen desde el principio: así los lectores de pantalla
           las vigilan antes de que aparezca el primer mensaje. -->
      <p id="notice" class="notice" role="status">Cargando servicios…</p>
      <p id="error-notice" class="notice notice-error" role="alert"></p>
      <button type="button" id="retry" hidden>Reintentar</button>

      <div id="data-zone" hidden>
        <div class="controls">
          <p class="field">
            <label for="search">Buscar servicio</label>
            <input type="search" id="search" name="search">
          </p>

          <fieldset id="status-filter">
            <legend>Mostrar</legend>
            <label><input type="radio" name="filter" value="all" checked> Todos</label>
            <label><input type="radio" name="filter" value="available"> Disponibles</label>
            <label><input type="radio" name="filter" value="down"> Caídos</label>
          </fieldset>

          <p><button type="button" id="check-now">Revisar ahora</button></p>
          <p><button type="button" id="sort" aria-pressed="false">Ordenar por tiempo de respuesta</button></p>
        </div>

        <p id="count" class="notice" role="status"></p>

        <div class="table-scroll" id="table-zone" role="region" aria-labelledby="table-caption" tabindex="0">
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
      </div>
    </section>

    <section id="add-zone" aria-labelledby="add-title" hidden>
      <h2 id="add-title">Agregar un servicio</h2>
      <p>Los campos marcados con * son obligatorios.</p>

      <form id="add-form" class="form-grid" autocomplete="off">
        <div class="field">
          <label for="new-name">Nombre *</label>
          <input id="new-name" name="name" type="text" required minlength="2"
                 pattern="\S(.*\S)?" aria-describedby="new-name-hint new-name-error">
          <p id="new-name-hint" class="hint">Al menos 2 caracteres. No puede repetirse.</p>
          <p id="new-name-error" class="field-error"></p>
        </div>

        <div class="field">
          <label for="new-status">Estado *</label>
          <select id="new-status" name="status" required aria-describedby="new-status-error">
            <option value="">Elige un estado</option>
            <option value="available">Disponible</option>
            <option value="down">Caído</option>
          </select>
          <p id="new-status-error" class="field-error"></p>
        </div>

        <div class="field">
          <label for="new-response-ms">Tiempo de respuesta (ms) *</label>
          <input id="new-response-ms" name="responseMs" type="number" required min="0" max="60000" step="1"
                 aria-describedby="new-response-ms-hint new-response-ms-error">
          <p id="new-response-ms-hint" class="hint">De 0 a 60 000. Si el servicio está caído, no se pide.</p>
          <p id="new-response-ms-error" class="field-error"></p>
        </div>

        <button type="submit">Agregar servicio</button>
        <p id="form-result" class="notice" role="status"></p>
      </form>
    </section>
  </main>

  <footer>
    <p>Datos de ejemplo del archivo data/services.json.</p>
  </footer>
</body>
</html>
```

**How you check it.** Reload: the dashboard still shows the same, and the new form **does not appear**. That is correct: the section starts with `hidden`, and the Lesson 9 view does not know it exists, so nobody shows it. In the console, `document.querySelector("#add-zone").hidden` must return `true`.

#### Step 5 — `css/styles.css`: the form and its layout

**What it does and why.** One more block at the end of `css/styles.css`, which reopens the `components` layer once again. Three things deserve a look. The first is the `.layout-tall` rule: on a wide screen, the two-column grid from Lesson 5 would put the new section on the next row, below the table, with a huge gap next to it; if the services section takes two rows (`grid-row: span 2`), the form goes up to the left column, right below the summary. The second is the error selector, `.field :user-invalid, .field [aria-invalid="true"]`: it carries `.field` in front because, without it, it would weigh less than `.field input`, the rule that gives the border to all fields, and would lose. It is the specificity from Lesson 3 doing its job, and the way out is to write the right selector, not an `!important`. The third is the line reserved for the error. And something that is not there: no rule for the table to fit at 320 px. It is not needed, because the table scrolls inside its box since Lesson 5; the measurement at 320 px gives 320 in all seven steps of the walkthrough that closes step 7.

```css
@layer components {
  /* ---- Lección 10: el formulario para agregar un servicio ---- */
  /* En una pantalla ancha, la sección de servicios ocupa los dos renglones de la derecha
     y el formulario sube a la columna izquierda, justo debajo del resumen. */
  @media (width >= 64em) {
    .layout-tall {
      grid-row: span 2;
    }
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(14rem, 100%), 1fr));
    gap: var(--space-3);
    align-items: start;
  }

  /* El botón y el aviso del formulario van en su propio renglón. */
  .form-grid > button,
  .form-grid > .notice {
    grid-column: 1 / -1;
    justify-self: start;
  }

  select {
    font: inherit;
  }

  /* Los campos del formulario se ven como el de búsqueda de la Lección 3. */
  .field input,
  .field select {
    min-height: 2.5rem;
    padding: var(--space-1) var(--space-2);
    border: 1px solid var(--color-control);
    border-radius: var(--radius);
    background: var(--color-surface);
    color: inherit;
  }

  .field input:disabled {
    background: var(--color-page);
  }

  .hint {
    margin: 0;
    color: var(--color-muted);
    font-size: 0.875rem;
  }

  /* Cada campo reserva siempre la línea de su error: si el mensaje apareciera empujando
     todo lo de abajo, la página daría un salto cada vez que alguien se equivoca
     (y los saltos se miden: Lección 11). */
  .field-error {
    min-height: 1.5rem;
    margin: 0;
    color: var(--color-down-text);
    font-weight: 600;
  }

  /* El error se ve cuando el navegador sabe que la persona intervino (:user-invalid)
     o cuando nuestro código lo marcó (aria-invalid). Con .field delante, el selector
     pesa más que «.field input» y gana sin !important. */
  .field :user-invalid,
  .field [aria-invalid="true"] {
    border-color: var(--color-down-text);
    background: var(--color-down-bg);
  }
}
```

**How you check it.** With the window wider than 1024 px (64em), type in the console `getComputedStyle(document.querySelector("#services")).gridRowStart`. It must answer `"span 2"`; in a narrower window, `"auto"`, because the rule lives inside the `@media`.

#### Step 6 — `js/form.js`: from flags to sentences

**What it does and why.** It translates the `validity` flags into sentences. Each field has its table of messages. The search goes through the flags in the order in which they are written (that is why, with `-5`, “No puede ser negativo.” (It cannot be negative.) comes out and not the grid's message), and if there is no sentence of its own it uses the browser's text as a last resort. `readService` builds the service from the form with the same keys as `data/services.json`, and gives it a new `id` with [`crypto.randomUUID()`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID), which generates an identifier that is not repeated: the `id` from Lesson 6 is what identifies a service, and one that is born in the form also needs its own. (That function only exists on secure pages: served over `https`, or from your own machine, such as `127.0.0.1`.) Two pieces of syntax you already know: the `for (const flag in forControl)` loop goes through the property names of the messages table, like the `for…in` of figure 10.2, and `MESSAGES[control.id] ?? {}` uses the nullish coalescing from Lesson 6 so that a field without its own table receives an empty object instead of `undefined`.

```js
// panel/js/form.js
// Traduce lo que el navegador sabe de un campo a una frase para la persona, y lee el
// formulario. No dibuja nada: recibe un control y devuelve texto.

// Para cada campo, qué decir según la regla que incumple (las banderas de `validity`).
const MESSAGES = {
  "new-name": {
    valueMissing: "Escribe el nombre del servicio.",
    tooShort: "Usa al menos 2 caracteres.",
    patternMismatch: "Sin espacios al inicio ni al final.",
  },
  "new-status": {
    valueMissing: "Elige el estado del servicio.",
  },
  "new-response-ms": {
    valueMissing: "Escribe el tiempo en milisegundos.",
    badInput: "Escribe un número, como 250.",
    rangeUnderflow: "No puede ser negativo.",
    rangeOverflow: "El máximo es 60 000 ms.",
    stepMismatch: "Escribe un número entero.",
  },
};

// Devuelve el texto del error de un control, o "" si el control es válido.
// El orden de las banderas en MESSAGES es el orden de prioridad: varias pueden
// estar encendidas a la vez y se dice una sola, la primera.
export function errorMessage(control) {
  if (!control.willValidate || control.validity.valid) {
    return "";
  }
  if (control.validity.customError) {
    return control.validationMessage; // el texto que puso setCustomValidity
  }
  const forControl = MESSAGES[control.id] ?? {};
  for (const flag in forControl) {
    if (control.validity[flag]) {
      return forControl[flag];
    }
  }
  return control.validationMessage; // último recurso: el texto del navegador
}

// Lee un formulario ya validado y arma el servicio con las mismas claves que data/services.json.
// Un campo desactivado no viaja en FormData: un servicio caído queda con responseMs en null.
export function readService(form) {
  const data = new FormData(form);
  const time = data.get("responseMs");
  return {
    id: crypto.randomUUID(), // un identificador nuevo, que no choca con ninguno
    name: data.get("name").trim(),
    status: data.get("status"),
    responseMs: time === null ? null : Number(time),
  };
}
```

**How you check it.** Now that the HTML from step 4 already has the fields, type in the console `const form = await import("./js/form.js")` and then `form.errorMessage(document.querySelector("#new-name"))`. It must answer `"Escribe el nombre del servicio."`: the field is empty, it is `required`, and the function translated the `valueMissing` flag into the sentence from its table. That the section is hidden changes nothing, because `hidden` does not take a field out of validation; `disabled` does.

#### Step 7 — `js/view.js` and `js/main.js`, together

**What it does and why.** It is the step that connects everything, and that is why they are two files that go together. In the view, `renderCount` is new and is exported separately so that `main.js` can delay it; `render` also decides when the form zone is seen and when the table is (with no rows, it is hidden).

And `js/main.js` grows with two blocks at the end, the filters and the form. Before reading it, these are the decisions you will find in it, each with its reason:

- The radios' listener is on the `<fieldset>` and not on each radio: the `change` event goes up the tree, like the `click` from Lesson 7, so a single one handles all three.
- In the `invalid` listener, the condition `event.target === form.querySelector(":invalid")` is true only for the first invalid field in document order. That is why the focus and the general notice happen once, even though the browser fires the event three times.
- In the `input` listener, the first line empties the form's notice: if a person corrects and keeps typing, “No se agregó: hay 3 campos con error” (Not added: there are 3 fields with errors) is no longer true and must not remain.
- In the `focusout` listener, the condition looks at `:user-invalid` or our own mark. It is the moment to show the error of a field that the person edits and leaves. It uses `focusout` and not `blur` because `focusout` does go up the tree ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/focusout_event)), and a single listener on the form handles the three fields.
- In the `submit` one, `FormData` ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/FormData)) reads the form by each field's `name` attribute, and disabled fields do not get in. That is why a service that is down does not bring `responseMs` and `readService` stores `null`, which is what `js/stats.js` and the table already understand.

A warning about the order: **do not reload between the two files**. The new view expects elements (`addZone`, `tableZone`, `count`) that only the new `main.js` hands to it. If you save `view.js`, reload and still have the `main.js` from Lesson 9, the table stays empty and Chrome's console says `Cannot set properties of undefined (setting 'hidden')`: the view tried to hide a zone that nobody passed to it. It was checked this way when preparing the lesson; if it happens to you, it is not an error in your view: the next file is missing.

First the view:

```js
// panel/js/view.js
// Dibuja el estado en el documento, con sus tres situaciones: cargando, error y vacío.
// Todo texto de los datos entra con textContent.
import { summarize } from "./stats.js";
import { situation, visible, selectedService } from "./state.js";

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

function renderSummary(services, elements) {
  const summary = summarize(services);
  elements.total.textContent = String(services.length);
  elements.available.textContent = `${summary.available} de ${services.length}`;
  elements.down.textContent = String(summary.down);
  elements.average.textContent = summary.averageMs === null ? "sin datos" : `${summary.averageMs} ms`;
}

// El aviso de cuántos servicios se ven. Vive aparte porque a veces se anuncia con retraso (ver main.js).
export function renderCount(state, elements) {
  const total = state.services.length;
  const shown = visible(state).length;
  elements.count.textContent = shown === 0
    ? "Ningún servicio coincide con el filtro."
    : `Mostrando ${shown} de ${total} ${total === 1 ? "servicio" : "servicios"}.`;
}

// elements = { notice, errorNotice, retry, dataZone, addZone, tableZone, count, checkedAt,
//              total, available, down, average, body, detail, sortButton }
// options.count = false deja el aviso del conteo como estaba (main.js lo actualiza después).
export function render(state, elements, options = {}) {
  const current = situation(state);

  // Un solo lugar decide qué se ve. Los textos de aviso son nuestros, no vienen de fuera.
  elements.notice.textContent =
    current === "loading" ? "Cargando servicios…" :
    current === "empty" ? "No hay servicios que revisar." : "";
  elements.errorNotice.textContent = current === "error" ? state.errorMessage : "";
  // Tras un error o una lista vacía hay que poder pedir otra vez, y «Revisar ahora» vive
  // en la zona de datos, que en esos dos casos está oculta: por eso se muestra «Reintentar».
  elements.retry.hidden = current !== "error" && current !== "empty";
  elements.dataZone.hidden = current !== "ready";
  // El formulario también sirve cuando la lista llegó vacía: ahí se da de alta el primero.
  elements.addZone.hidden = state.phase !== "ready";
  renderCheckedAt(state.checkedAt, elements.checkedAt);

  // Cargando o con error no hay cifras que mostrar; vacío sí: cero servicios es un resultado.
  if (current === "loading" || current === "error") {
    for (const cell of [elements.total, elements.available, elements.down, elements.average]) {
      cell.textContent = "";
    }
  } else {
    renderSummary(state.services, elements);
  }

  if (current !== "ready") {
    elements.body.replaceChildren();
    elements.detail.textContent = "";
    return;
  }

  elements.sortButton.setAttribute("aria-pressed", String(state.sortByTime));

  const rows = visible(state).map((service) => createRow(service, service.id === state.selected));
  elements.body.replaceChildren(...rows);
  elements.tableZone.hidden = rows.length === 0;
  if (options.count !== false) {
    renderCount(state, elements);
  }

  const chosen = selectedService(state);
  elements.detail.textContent = chosen === null ? "Elige un servicio para ver su detalle." : describe(chosen);
}
```

Then the logic. Read `js/main.js` from top to bottom: first what you already had (loading, sorting, selection) and then the filters and the form, with a comment that explains the why of each block:

```js
// panel/js/main.js
// Junta las piezas: pide los datos, guarda el resultado en el estado y dibuja.
import { loadServices } from "./load.js";
import {
  createState, startLoading, loadSucceeded, loadFailed, toggleSort, select,
  changeFilter, nameExists, addService, visible, situation,
} from "./state.js";
import { render, renderCount } from "./view.js";
import { errorMessage, readService } from "./form.js";

// Casos de prueba para ver cada situación sin romper nada: index.html?case=empty
// Es una lista cerrada: el texto de la dirección elige UNA de estas opciones, nunca se usa como dirección.
const CASES = {
  normal: { url: "data/services.json", timeoutMs: 3000 },
  empty: { url: "data/services-empty.json", timeoutMs: 3000 },
  error: { url: "data/missing.json", timeoutMs: 3000 },
  invalid: { url: "index.html", timeoutMs: 3000 },
  // ?delay=5000 solo lo entiende slow-server.py, que tarda 5 s en contestar; el límite son 3 s.
  timeout: { url: "data/services.json?delay=5000", timeoutMs: 3000 },
};
const requested = new URLSearchParams(location.search).get("case");
const current = Object.hasOwn(CASES, requested) ? CASES[requested] : CASES.normal;

const elements = {
  notice: document.querySelector("#notice"),
  errorNotice: document.querySelector("#error-notice"),
  retry: document.querySelector("#retry"),
  dataZone: document.querySelector("#data-zone"),
  addZone: document.querySelector("#add-zone"),
  tableZone: document.querySelector("#table-zone"),
  count: document.querySelector("#count"),
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
  // El botón que pidió la carga se oculta mientras carga, y con él se va el foco:
  // se anota para devolverlo al terminar.
  const fromButton = document.activeElement === elements.checkNow || document.activeElement === elements.retry;
  startLoading(state);
  render(state, elements);
  try {
    loadSucceeded(state, await loadServices(current.url, current.timeoutMs), new Date());
  } catch (error) {
    loadFailed(state, error.message);
  }
  render(state, elements);
  if (fromButton) {
    (situation(state) === "ready" ? elements.checkNow : elements.retry).focus();
  }
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
elements.retry.addEventListener("click", load);

// Delegación: un solo oyente en el <tbody> atiende los botones de todas las filas.
elements.body.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-id]");
  if (button === null) return;
  update(() => select(state, button.dataset.id));
});

// ---- filtros ----
// La tabla se redibuja con cada tecla, pero el aviso del conteo espera a que la persona deje de
// escribir: un lector de pantalla no debe leer "Mostrando 4", "Mostrando 3", "Mostrando 1" letra por letra.
let timer;
function announceCountLater() {
  clearTimeout(timer);
  timer = setTimeout(() => renderCount(state, elements), 400);
}

document.querySelector("#search").addEventListener("input", (event) => {
  changeFilter(state, { text: event.target.value });
  render(state, elements, { count: false });
  announceCountLater();
});

// Un solo oyente para los tres radios: el evento change sube hasta el <fieldset>.
document.querySelector("#status-filter").addEventListener("change", (event) => {
  changeFilter(state, { status: event.target.value });
  render(state, elements);
});

// ---- formulario: agregar un servicio ----
const form = document.querySelector("#add-form");
const nameField = document.querySelector("#new-name");
const statusField = document.querySelector("#new-status");
const timeField = document.querySelector("#new-response-ms");
const formResult = document.querySelector("#form-result");

// Escribe (o borra) el texto del error de un campo y marca el campo para los lectores de pantalla.
function paint(control) {
  const text = errorMessage(control);
  document.querySelector(`#${control.id}-error`).textContent = text;
  if (text === "") {
    control.removeAttribute("aria-invalid");
  } else {
    control.setAttribute("aria-invalid", "true");
  }
}

// Un servicio caído no tiene tiempo de respuesta: se desactiva el campo (y deja de validarse).
function syncTime() {
  const down = statusField.value === "down";
  timeField.disabled = down;
  if (down) {
    timeField.value = "";
    paint(timeField);
  }
}

// La regla que el navegador no conoce: el nombre no puede repetirse. SIEMPRE con su rama que limpia.
function validateUniqueName() {
  nameField.setCustomValidity(
    nameExists(state, nameField.value) ? "Ya existe un servicio con ese nombre." : "",
  );
}

// El navegador dispara "invalid" en cada campo inválido cuando se intenta enviar. Cancelarlo apaga su
// burbuja; en su lugar escribimos el mensaje en la página, donde se queda y un lector de pantalla lo lee.
// "invalid" no sube por el árbol: por eso se escucha en la fase de captura (el tercer argumento).
form.addEventListener("invalid", (event) => {
  event.preventDefault();
  paint(event.target);
  if (event.target === form.querySelector(":invalid")) {
    const howMany = form.querySelectorAll(":invalid").length;
    formResult.textContent = howMany === 1
      ? "No se agregó: hay 1 campo con error."
      : `No se agregó: hay ${howMany} campos con error.`;
    event.target.focus();
  }
}, true);

form.addEventListener("input", (event) => {
  const control = event.target;
  formResult.textContent = "";
  if (control === nameField) validateUniqueName();
  if (control === statusField) syncTime();
  if (control.getAttribute("aria-invalid") === "true") paint(control);
});

form.addEventListener("focusout", (event) => {
  const control = event.target;
  if (control.matches(":user-invalid") || control.hasAttribute("aria-invalid")) paint(control);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const service = readService(form);
  addService(state, service);
  form.reset();
  syncTime();
  render(state, elements);
  const hidden = visible(state).includes(service) ? "" : " El filtro actual lo oculta.";
  formResult.textContent =
    `Servicio «${service.name}» agregado. Ahora hay ${state.services.length}.${hidden}`;
  nameField.focus();
});

load();
```

**How you check it.** Now try the dashboard, with the server running from the repository's `programas/` folder, at `http://127.0.0.1:8000/10-formularios-validacion/panel/`. These steps were checked in Chrome 154 with the window at 320 px wide:

1. Type `catalo` in “Buscar servicio”: one row remains and, half a second later, the notice says “Mostrando 1 de 5 servicios.”.
2. Select “Caídos” in the “Mostrar” group without deleting the text: no row matches, the table is hidden and the notice says “Ningún servicio coincide con el filtro.” (No service matches the filter.). Delete the text and only `Inventario` remains.
3. Select “Todos” again and press “Agregar servicio” (Add service) with everything empty: focus lands on “Nombre” (Name), three red messages appear and the notice says “No se agregó: hay 3 campos con error.”.
4. Type `catalogo`, choose “Disponible” (Available) and type `100`: when you press “Agregar servicio”, the name says “Ya existe un servicio con ese nombre.” (A service with that name already exists.) (neither capitals nor the accent matter).
5. Change the name to `facturas` and the time to `-5`: the message says “No puede ser negativo.”. Correct it to `230`: the message disappears as you type and, on submitting, the notice says “Servicio «facturas» agregado. Ahora hay 6.” (Service “facturas” added. There are now 6.). The summary goes to 6 services checked, 5 of 6 available, 1 down and 418 ms of average response time.
6. Choose “Caído” (Down) as the status: the time field is disabled and emptied. Type a new name and submit: the service is added without a time, and in the table “sin respuesta” appears.
7. Open `?case=empty`: “No hay servicios que revisar.”, “Reintentar” and the form appear. Add a service: the table appears with one row and “Reintentar” is hidden, because “Revisar ahora” is in view again.

The console, throughout the whole walkthrough, stays blank.
## The error you will see

The message is from the console and appears when you submit a form in which there is a required field that the person cannot see. The page provokes it on purpose: the second field is `required` but hidden with `display: none`.

```html
<!-- fig10_05.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Un campo obligatorio que no se puede ver</title>
  <link rel="icon" href="data:,">
</head>
<body>
  <main>
    <h1>Un campo obligatorio que no se puede ver</h1>

    <form id="form">
      <p>
        <label for="email">Correo *</label>
        <input id="email" name="email" type="email" required>
      </p>
      <p>
        <label for="note">Nota *</label>
        <input id="note" name="note" type="text" required style="display: none">
      </p>
      <button type="submit">Enviar</button>
    </form>
  </main>
</body>
</html>
```

Open it, type a valid email and press “Enviar”. Nothing visible happens: the form is not submitted and there is no bubble. This appears in the console:

```text
An invalid form control with name='note' is not focusable.
```

The browser tried to do what it always does: find the first invalid field and send focus to it to show the message. But a hidden field cannot receive focus, so there is nowhere to show it, and the submission is left blocked without the person knowing why. The text of the message is the browser's (Chrome 154; in another browser the sentence changes) and in its `name='note'` form it carries the `name` attribute of the guilty field, which tells you which one to look for.

There are three fixes, in order of preference. If the field is not needed, remove the `required` while it is hidden. If it needs to exist but not be seen, disable it with `disabled` (it is left out of validation, as you saw with the dashboard's time). And if it must be seen as soon as it is activated, show it before trying to submit. What cannot be fixed is silencing the message: it is the symptom that someone left a trap in the form.

## What gets done wrong

**Treating client validation as protection.** *What it looks like:* “the form already validates the email, so it is done”. *Cost:* anyone bypasses it with two clicks in the browser developer tools or by sending the request without a browser. If your dashboard has a server, the rule is repeated there; if it does not, the data must not be dangerous in itself, and that is why the dashboard draws it with `textContent`.

**Painting `:invalid` from the start.** *What it looks like:* the form opens in red. *Cost:* whoever arrives feels scolded before starting, and whoever uses a screen reader hears a list of errors in fields they have not even seen. Use `:user-invalid` or your own mark after the first attempt.

**Putting a message in `setCustomValidity` and not clearing it.** *What it looks like:* a field that “looks fine” and does not let you submit. *Cost:* it is the hardest error of the lesson to debug, because there is no error message from the program. Each branch that sets a message needs its branch that removes it; the dashboard does it in one line with a conditional.

**A `pattern` with invalid syntax.** *What it looks like:* `pattern="[\w-]+"` and the rule is never applied. *Cost:* Chrome's console says “Pattern attribute value [\w-]+ is not a valid regular expression”, but the form shows nothing, so the rule disappears silently. Escape the hyphen (`[\w\-]+`) and, above all, test with a value that should fail.

**The error only in color, only in the bubble or only in the `placeholder`.** *What it looks like:* a field with a red border and nothing else, or a hint inside the field in light gray that disappears when you type. *Cost:* it loses whoever cannot tell colors apart, whoever uses a screen reader and whoever needs to reread. The label is a label (`<label>`), the error is text, and both live outside the field.

**A `type="number"` for what is not a quantity.** *What it looks like:* a reference-number, phone or postal-code field with up and down arrows. *Cost:* the value is changed with the mouse wheel by accident, leading zeros are lost, and the screen reader announces a button for going up and down (`spinbutton`) where there is no quantity to raise or lower. For that data, text with `inputmode="numeric"`.

**Announcing every key.** *What it looks like:* the filter's notice changes with every letter. *Cost:* the screen reader becomes a machine gun and whoever uses it gets lost. Wait until the person finishes typing, as the dashboard does with its 400 ms.

**Disabling the submit button until everything is valid.** *What it looks like:* a gray button with no explanation. *Cost:* whoever does not see the disabled button does not know why they cannot move forward, and there is no message to explain it. Leave the button active and explain what is missing at the moment of the attempt.

## Exercises

### Exercise 1 — Predict the flags

Without opening anything, write which `validity` flags turn on in each case, and check afterwards with `fig10_02.html`: (a) an empty field with `required`; (b) `250` in a field with `min="0" max="60000" step="100"`; (c) `-100` in that same field; (d) `60050` in that same field.

### Exercise 2 — A rule of your own in the dashboard

Add to the dashboard's form a second rule for the name: it cannot be `admin` or `test` (regardless of capitals). It must use `setCustomValidity`, clear the message when the name is correct and show a text of its own that says what to do, not only what is wrong. Check that the field becomes valid again when you correct it.

### Exercise 3 — Clear the filters

Add a “Limpiar filtros” (Clear filters) button to the controls bar. When pressed it must: empty the text, select “Todos” again, redraw the table and return focus to the search field. Think about what happens with the `role="status"` region if the count's text does not change.

## Solutions

**Exercise 1.** (a) `valueMissing`. (b) `stepMismatch`: 250 is inside the range but is not a multiple of 100 counting from 0. (c) `rangeUnderflow`; furthermore, `-100` is a multiple of 100, so `stepMismatch` does **not** turn on. (d) `rangeOverflow` and `stepMismatch`, because 60050 also falls outside the grid. If you got (c) wrong, the lesson is that `step` and `min` are not independent: the grid is measured from `min`, and a value can be out of range without being off the grid.

**Exercise 2.** Change `validateUniqueName` in `js/main.js` so that it decides among three cases and clears in the last:

```js
const RESERVED = ["admin", "test"];

function validateUniqueName() {
  const value = nameField.value.trim().toLowerCase();
  if (RESERVED.includes(value)) {
    nameField.setCustomValidity(`«${value}» está reservado. Elige un nombre que describa el servicio.`);
  } else if (nameExists(state, nameField.value)) {
    nameField.setCustomValidity("Ya existe un servicio con ese nombre.");
  } else {
    nameField.setCustomValidity("");
  }
}
```

The final branch is the one that prevents the field from being left invalid forever. Since `errorMessage` already reads `validationMessage` when there is a `customError`, nothing else needs to be touched. Check the case in which you type `admin`, submit (the message appears) and then correct to `admin2`: the message disappears as you type.

**Exercise 3.** In `index.html`, inside the controls bar, next to “Revisar ahora”, a `<p><button type="button" id="clear-filters">Limpiar filtros</button></p>`. In `js/main.js`:

```js
document.querySelector("#clear-filters").addEventListener("click", () => {
  changeFilter(state, { text: "", status: "all" });
  document.querySelector("#search").value = "";
  document.querySelector('input[name="filter"][value="all"]').checked = true;
  render(state, elements);
  document.querySelector("#search").focus();
});
```

The count is redrawn by itself, because `render()` calls `renderCount()`. But there is a trap: if the notice's text was already “Mostrando 5 de 5 servicios.”, the content does not change and screen readers usually do not repeat it. It is a good case of *not announcing* being correct: there is nothing new to say (a live region announces changes, not repetitions). If you wanted to announce the action itself, write “Filtros limpiados.” (Filters cleared.) in the form's notice or in a region of its own.

## How I know I got it

The checks are measurable. Start the server from the downloaded repository's `programas/` folder and open the dashboard:

```bash
cd programas
python3 -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000/10-formularios-validacion/panel/`.

- [ ] **Keyboard:** with only Tab, Shift+Tab, Enter and the arrows you reach the search, the radios, “Revisar ahora”, the sort button, the “Ver detalle” buttons, the three fields and the add button; the focus outline is visible on each; and you add a service without touching the mouse.
- [ ] **Console:** in the Console tab there is no error or warning after reloading and going through the seven steps of the walkthrough that closes section 10.5.
- [ ] **320 px:** in the tools' device mode, at 320 px wide no horizontal scroll bar appears. In the console, `document.documentElement.scrollWidth <= document.documentElement.clientWidth` returns `true`.
- [ ] **Errors are read:** with the form empty, after pressing “Agregar servicio”, `document.querySelector("#new-name").getAttribute("aria-invalid")` returns `"true"` and `document.querySelector("#new-name-error").textContent` returns a sentence.
- [ ] **The filter:** with the text `catalo`, `document.querySelectorAll("#services-body tr").length` returns `1`.
- [ ] **The disabled field stays out:** with “Caído” chosen, `document.querySelector("#new-response-ms").disabled` returns `true`.
- [ ] **Without a screen:** `filters-test.html` shows eleven lines and all of them start with `ok`.
- [ ] **Screen reader:** turn on the one your system comes with (on Linux Mint, Orca) and repeat step 3 of section 10.5. It must say the field's name, its description and that it is not valid.
- [ ] **The figures:** `fig10_05.html` leaves in the console the message “An invalid form control… is not focusable”, and the others leave no error.

And as a close, **three questions from earlier lessons**; answer them without looking and then check:

1. In Lesson 2: which HTML element gives a field its name, and why does a `placeholder` not replace it?
2. In Lesson 7: why does `js/view.js` use `textContent` and not `innerHTML` even though the data comes from your own server?
3. In Lesson 8: what does `fetch` return for a 404, and what must be checked so as not to treat it as data?

Write in the logbook what you could not answer. That list is tomorrow's review.

## Further reading

- [Client-side form validation, on MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation): the complete guide, with the validation API and the examples of custom messages.
- [3.3.1 Error Identification, in the WCAG 2.2 guidelines](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html): what the criterion requires and which techniques meet it.
- [`:user-invalid`, on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/:user-invalid): when it matches and when it does not.
- [Text input, in the British government's design system](https://design-system.service.gov.uk/components/text-input/): the most careful guide on `type="number"`, `inputmode`, `autocomplete` and `maxlength`.
