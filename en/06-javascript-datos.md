# Lesson 6 — JavaScript and the data model

**Time:** 90 min (or 2 × 45)

**What you build:** the dashboard's data and its calculations

**What you learn:** values, objects, arrays and functions; decisions, loops and errors; modules; the array of services, how many are up and the average response time

**Where you come from.** You bring the dashboard from [Lesson 5](05-pagina-adaptable.md): the meaningful HTML from [Lesson 2](02-html-con-significado.md), the stylesheet from Lesson 3 and the layout from lessons 4 and 5, which adapts from 320 to 1440 px. It is a dashboard that looks good, but **everything it says is typed by hand**: “5 servicios revisados” (5 services checked), “4 de 5 disponibles” (4 of 5 available), “1 caído” (1 down), “465 ms” of average response time. You added up those four figures yourself with a calculator in Lesson 2, and if a service changes today you have to add them up again. That is what this lesson takes out of the way. You work in your `revisor` folder, in the `js/` subfolder you created in [Lesson 1](01-entorno-ciclo-trabajo.md), and you keep serving everything with `python3 -m http.server 8000 --bind 127.0.0.1`: no step in this lesson needs you to install anything else.

**What this lesson does not do.** It does not touch the page. The results of today's programs appear in the **console** of the browser developer tools, not in the dashboard. How they get drawn in the table is the subject of [Lesson 7](07-dom-eventos-estado.md), and where the data comes from when it is not written inside the program itself, that of [Lesson 8](08-traer-datos.md). Today we solve the underlying problem first: **how a service is represented, how a list of them is stored and how the figures are calculated from that list**.

## By the end you will be able to

- Store a value with `const` or `let`, say what type it is with `typeof` and explain why `120 === "120"` gives `false`.
- Represent a service as an object with properties and the list of services as an array of objects, and read or change any piece of their data.
- Go through an array with `filter`, `map`, `find`, `some`, `every` and `reduce`, or step by step with `for…of`; decide with `if`, `else` and the ternary operator; signal an error with `throw` and catch it with `try…catch`, and read `new` and the three dots `...` when they appear.
- Write the dashboard's two calculations —how many services are available and the average response time— as functions that receive the list and return a number.
- Explain why a carelessly calculated average gives 372 ms where the correct answer is 465, and fix it.
- Split the program into modules (`export` and `import`), load it with `<script type="module">` and explain why that module does not open with a double click.
- Read the five most frequent error messages of this stage and say what caused them.

## The why before the how

Look at the dashboard summary as it was left in Lesson 2. It says there are 5 services, that 4 are available, that 1 is down and that the average response time is 465 ms. Each of those figures was obtained by looking at the table and doing a calculation. Now imagine that the on-call team for the mail service asks to add it to the dashboard: you have to write a new row in the table and, **separately**, change the 5 to a 6, the “4 of 5” to “5 of 6” and average again. If you forget one of the four, the dashboard contradicts itself: the table counts six rows and the summary says five. In Exercise 3 of Lesson 2 you did it by hand and saw how hard it is not to make a mistake.

The problem is that **the same piece of data is written in two places**, and two copies of a piece of data always end up differing. The solution is to write it once, in a place a program can read, and have everything else —the table rows, the 5, the “4 of 5”, the 465 ms— derived from there. That is the idea of this lesson, and of the next one: **the data is kept apart, and what you see is calculated from it**.

For that you need a programming language, and the web's is **JavaScript**. It is the programming language that every browser runs on its own, without installing anything: HTML says what each thing is, CSS says how it looks and JavaScript says what it does. It must not be confused with Java, which is another language with no relation (the similarity of the names is historical and misleading). [Its specification is called **ECMAScript**](https://tc39.es/ecma262/) and Ecma International publishes it every year; [the current edition in October 2026 is the 17th, from June of this year](https://ecma-international.org/publications-and-standards/standards/ecma-262/). For what you do today you do not need to know what each edition brings, but it is worth knowing that a standard exists with an owner and a version, just like HTML and CSS: what you learn works the same way in every browser.

### How a program runs in the browser

A program is a list of instructions that run **one after another, from top to bottom**. The browser has an engine that reads them and runs them. There are two ways of seeing what it does. The first is the **console** of the [browser developer tools](https://developer.chrome.com/docs/devtools/console): open them with `F12` and go to the Console tab. Everything the program prints with `console.log(...)` appears there, and the errors too. The second is the page itself, which from Lesson 7 on will be drawn with the data.

Today you work only with the console. Each program in this lesson is a page whose only mission is to run a program and leave its result in view. Each one has a text that says “Abre la consola de las herramientas del navegador (F12) para ver el resultado” (Open the browser developer tools console (F12) to see the result), and that is the only visible part. They are in [`programas/06-javascript-datos/`](https://github.com/HabilMX/curso-web/tree/main/programas/06-javascript-datos), in the course repository. To run them, download it and, from that folder, [start the local server and open the page](https://docs.python.org/3/library/http.server.html):

```bash
$ python3 -m http.server 8000 --bind 127.0.0.1
Serving HTTP on 127.0.0.1 port 8000 (http://127.0.0.1:8000/) ...
```

(What matters is that it stays waiting: the terminal does not give control back to you. To stop it, `Ctrl`+`C`.) Every time you change a file, reload the page with `Ctrl`+`Shift`+`R`.

### A program seen from the outside: what you wrote by hand, calculated

Before getting into the syntax, the concrete goal. By the end of the lesson you will have three small files in your `js/` folder: one with the data, another with the two calculations and another that uses them. And when you open the dashboard you will see, in the console, these four lines:

```text
Disponibles: 4
Caídos: 1
Respuesta promedio: 465 ms
{"available":4,"down":1,"averageMs":465}
```

The same figures you wrote by hand in Lesson 2, but now produced by a program from the data. If you add a service and reload, they change by themselves. With that destination in mind, the road has three stretches, one per concept: first the simplest values, then the objects and arrays used to represent the data —and, with them, how a program decides, repeats and signals an error— and finally how the program is divided into files.

## The concepts

### 6.1 Values and variables

#### 6.1.1 The values the dashboard has

A service's data comes in a few kinds. A name (“Catálogo”) is a **text**, which in programming is called a **string** and is written between quotation marks. A response time (120) is a **number**. Whether a service is up or down is a yes-or-no question, and its value is called a **Boolean**: `true` or `false`. And there are two values that mean “nothing” and that, at first, get confused: `null` and `undefined`. That is why it is worth seeing the six together. According to the [MDN guide on grammar and types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types), JavaScript has eight types of values: seven primitive (Boolean, `null`, `undefined`, number, `BigInt`, string and symbol) and one compound, the object. In this course you will use strings, numbers, Booleans, `null` and `undefined`, and objects; `BigInt` and symbols do not appear.

Open `fig06_01.html` and its console:

```html
<!-- fig06_01.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Valores y variables</title>
</head>
<body>
  <main>
    <h1>Valores y variables</h1>
    <p>Abre la consola de las herramientas del navegador (F12) para ver el resultado.</p>
  </main>
  <script type="module">
    const name = "Catálogo";
    let responseMs = 120;
    const isUp = true;

    console.log(typeof name, typeof responseMs, typeof isUp);

    responseMs = responseMs + 30;
    console.log(`${name} respondió en ${responseMs} ms`);

    const noAnswer = null;
    let notYet;
    console.log(typeof noAnswer, typeof notYet);

    console.log(120 === "120", 120 == "120");
    console.log(0.1 + 0.2, 0.1 + 0.2 === 0.3);
    console.log(Number("abc"), Number.isNaN(Number("abc")));
  </script>
</body>
</html>
```

The console shows:

```text
string number boolean
Catálogo respondió en 150 ms
object undefined
false true
0.30000000000000004 false
NaN true
```

Line by line:

- `const name = "Catálogo";` **declares a variable**: a name that stores a value. Afterwards you can use `name` wherever you need the text. `typeof` asks what type a value is, and returns `"string"`, `"number"` or `"boolean"`; according to the [`typeof` operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof), that is the name of the type.
- `let responseMs = 120;` also declares a variable, but with `let`, because its value is going to change: `responseMs = responseMs + 30;` stores a new value (150). The template with backticks, `` `${name} respondió en ${responseMs} ms` ``, is called a [template literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals): what goes between `${` and `}` is calculated and put into the text.
- `typeof noAnswer` gives `"object"` for `null`. It is an oddity from the language's origins, [a bug that was never fixed so as not to break old programs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof). It does not mean `null` is an object. If you need to know whether something is `null`, compare it directly: `valor === null`.
- `120 === "120"` gives `false` and `120 == "120"` gives `true`. Here is a rule that saves you an afternoon: **always compare with three signs, `===`**. The triple equals compares the value *and* its type; the double equals tries to convert one of the two before comparing, and those conversions have unintuitive rules (the [MDN article on equality](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness) lists them). There is not a single case in the `revisor` where `==` helps, and there are many where it gets in the way.
- `0.1 + 0.2` gives `0.30000000000000004`. It is not a JavaScript flaw but a consequence of how numbers with decimals are stored in any language that uses the IEEE 754 standard: all JavaScript numbers are 64-bit floating point, according to the [`Number` documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number), with about 15 to 17 significant digits. Some simple decimals do not fit exactly in binary, and are approximated. Practical consequence: **do not compare with `===` the result of a calculation with decimals expecting an exact value**; compare with a tolerance (that the difference be smaller than, say, `0.000001`) or work with integers, and for money, in cents. Comparing with `===` is correct when the number did not come out of a calculation, such as a `120` written as is: the problem is not the `===`, it is the rounding in the calculation. The dashboard's response times are whole milliseconds, so you will not run into this today; it is still worth having seen it once.
- `Number("abc")` gives [`NaN`, which means “not a number”](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN) and is, curiously, a value of type number. Since `NaN === NaN` gives `false`, comparing does not work to ask whether something is `NaN`; the clearest way is `Number.isNaN(valor)`. There are others, such as `valor !== valor` (`NaN` is the only value different from itself), but that one reads like a trick, and this course uses `Number.isNaN`. It will appear further down, as a symptom of a badly done calculation.

#### 6.1.2 `const`, `let` and why not `var` anymore

You have already used two ways of declaring. The third, `var`, is the one old tutorials bring, and this course does not use it. [MDN's table sums it up](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types): `var` lives in the whole function where it is declared (and, if it is declared outside any function, in the whole module or the whole script, according to [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var)), it is “hoisted” (it is given existence, with the value `undefined`, from the beginning of that scope even if you declare it further down) and it lets you redeclare the same name without complaint, whereas `let` and `const` live only inside the pair of braces where they are declared and do not exist before their declaration. An error that `var` hides, `let` and `const` shout, and that is what you want.

The course rule is: **use `const` by default; use `let` only when you really are going to reassign**. This has nothing to do with speed but with reading: if you see `const total = ...`, you know `total` is not going to change anywhere further down; if you see `let total`, you know you have to look for where it changes.

There is a nuance that surprises people. `const` prevents *reassigning* the name, but it does not prevent *changing what is inside* the value if that value is an object or an array. You will see it in the next section.

### 6.2 Objects, arrays and functions: the data model

Here is the heart of the lesson. Loose values are not enough: a service is not a number or a text, it is *a set of data that go together* (a name, a status, a time), and the dashboard does not have one service, it has a *list* of them. Two ways of grouping are needed: the object, which puts together data of different kinds under names, and the array, which puts together many things in an order. JavaScript lets you mix values of any type in the same array (texts, numbers, objects, other arrays); in the dashboard, by convention and so that it reads easily, each array stores things of a single kind: only services.

#### 6.2.1 The object: a service

An **object** is a collection of **name: value** pairs, written between braces. The names are called **properties**. This is how a dashboard service is represented:

```js
const service = {
  id: "catalog",
  name: "Catálogo",
  status: "available",
  responseMs: 120,
  url: "https://catalogo.example/salud",
};
```

Four design decisions that are worth more than the syntax:

- The property names are **in English** (`name`, `status`, `responseMs`) and the values shown to the reader, in Spanish. It is a convention of the course: what is code (file names, property names, function names) stays the same in all editions and matches the technical documentation, which is in English; what the person reads is translated.
- `status` is a text with **two possible values**, `"available"` and `"down"`. It is not a Boolean `isUp` on purpose: a text admits more values than a yes/no without changing the shape of the data, and tomorrow there may be a third status, such as “slow”.
- `responseMs` carries the **unit in the name**. A bare number (“120”) does not say whether it is seconds or milliseconds; `responseMs` does. It is a habit that saves errors: the unit goes in the name, not in the memory of whoever reads.
- `id` is different from `name`: the name is what is shown and it can change (“Catálogo” becomes “Catálogo de productos”); the `id` is what identifies the service and does not change.

A property is read with a dot (`service.name`) or with brackets and quotation marks (`service["status"]`). Brackets are useful when the property name is in a variable. [A property is changed just like a variable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects): `service.responseMs = 135;`. And here is what I said before: `service` was declared with `const`, and even so `service.responseMs` can be changed. `const` guarantees that the name `service` keeps pointing at the same object; it does not freeze the object's contents.

If you ask for a property that does not exist, there is no error: it gives `undefined`. And if you ask for a property *of* something that is `undefined` or `null`, there is an error, and it is the most frequent of all (you will see it in “The error you will see”). For those situations there are two operators. **Optional chaining** `?.` says “if what is on the left is `null` or `undefined`, do not go on and return `undefined`”; according to [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining), it has been available in all browsers since July 2020. [The **nullish coalescing operator**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing) `??` says “if what is on the left is `null` or `undefined`, use this other thing”; it has been available in all browsers since 2020 (the [web platform features explorer](https://web-platform-dx.github.io/web-features-explorer/features/nullish-coalescing/) declares it “widely available” since March 2023, the label given 30 months after the last browser has it). Together it reads like this: `service.owner?.team ?? "sin responsable"`.

Open `fig06_02.html` and you will see all of this together:

```html
<!-- fig06_02.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Un servicio como objeto</title>
</head>
<body>
  <main>
    <h1>Un servicio como objeto</h1>
    <p>Abre la consola de las herramientas del navegador (F12) para ver el resultado.</p>
  </main>
  <script type="module">
    const service = {
      id: "catalog",
      name: "Catálogo",
      status: "available",
      responseMs: 120,
      url: "https://catalogo.example/salud",
    };

    console.log(service.name);
    console.log(service["status"]);

    service.responseMs = 135;
    console.log(service.responseMs);

    console.log(service.owner);
    console.log(service.owner?.team);
    console.log(service.owner?.team ?? "sin responsable");

    const { name, responseMs } = service;
    console.log(name, responseMs);

    const copy = { ...service, status: "down", responseMs: null };
    console.log(service.status, copy.status);

    const text = JSON.stringify(service);
    console.log(text);
    console.log(JSON.parse(text).name);
  </script>
</body>
</html>
```

The console shows:

```text
Catálogo
available
135
undefined
undefined
sin responsable
Catálogo 135
available down
{"id":"catalog","name":"Catálogo","status":"available","responseMs":135,"url":"https://catalogo.example/salud"}
Catálogo
```

Three more things appear on that page. **Destructuring**, `const { name, responseMs } = service;`, pulls several properties out of an object at once into variables with the same name ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)). **Spread**, `{ ...service, status: "down" }`, copies the properties of one object into a new one and lets you change some of them, and it is a shallow copy: it copies one level, not the objects that may be inside the objects ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)). After `copy`, `service.status` is still `"available"`: the original was not modified. And **JSON**.

#### 6.2.2 JSON: the object turned into text

`JSON.stringify(service)` converts the object into a text, and `JSON.parse(texto)` does the reverse. That text is JSON (*JavaScript Object Notation*): a format for writing data that **any language can read**, not only JavaScript. It is the format in which the dashboard will receive its data in Lesson 8, and the standard that defines it is short, [ECMA-404](https://ecma-international.org/publications-and-standards/standards/ecma-404/) (the IETF's [RFC 8259](https://www.rfc-editor.org/rfc/rfc8259) is its equivalent for the internet).

It looks like a JavaScript object, but it is stricter, and the differences are the ones that produce beginner errors, according to the [MDN table](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON): property names **always** go between double quotation marks, strings also go between double quotation marks (never single), **comments are not allowed**, **a trailing comma is not allowed** after the last element, and `undefined` does not exist. A JSON file with an extra comma cannot be read, and the error message that `JSON.parse` gives varies by browser. Today you do not work with JSON files; all you need is that, when they appear, you recognize that they are a way of writing what you already know how to write in JavaScript.

#### 6.2.3 The array: the list of services

An **array** is an ordered list of values between square brackets. The elements are numbered from **zero**: the first is `services[0]`, the second `services[1]`, and their count is in `services.length`. This numbering from zero is the cause of the most common error with arrays: an array of five elements has positions from 0 to 4, and asking for the 5th gives `undefined`. To ask for the last element without counting, there is `.at(-1)`: negative numbers count from the end, and [`at()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at) has been available in all browsers since March 2022.

The dashboard's list of services is an array of objects, one per table row:

```js
const services = [
  { id: "catalog", name: "Catálogo", status: "available", responseMs: 120 },
  { id: "payments", name: "Pagos", status: "available", responseMs: 480 },
  { id: "inventory", name: "Inventario", status: "down", responseMs: null },
  { id: "notifications", name: "Notificaciones", status: "available", responseMs: 310 },
  { id: "search", name: "Búsqueda", status: "available", responseMs: 950 },
];
```

Notice the service that is down: its `responseMs` is **`null`**, not `0` or a text such as `"sin respuesta"`. It is the most important modeling decision of the lesson. A service that is down **did not respond**, and “did not respond” is not the same as “responded in zero milliseconds”: using `0` would make the average reward it for being down. `null` says precisely “there is no data here”. The text “sin respuesta” (no response) that you see in the table is a matter of presentation; the data stores a `null`.

Now, what you do with an array is almost always the same: **ask all its elements things at once**. For that there are methods, and each one receives a function that says what to do with each element. Before seeing them, that function.

#### 6.2.4 Functions: named instructions

A **function** is a named piece of program that receives input data (**parameters**), does something and returns a result with `return`. It is declared like this:

```js
function countByStatus(list, status) {
  return list.filter((service) => service.status === status).length;
}
```

`countByStatus` receives a list and a status, and returns how many services in the list have that status. It is used by writing its name with the data between parentheses: `countByStatus(services, "available")` returns `4`. Two properties make a function good, and they apply to all those of the dashboard. First: that it be **pure**, that is, that it not depend on anything outside or change anything outside: everything it uses comes in through its parameters, and everything it produces goes out through its `return`. If you call it twice with the same data, it gives the same result both times. Second: that it have **a single job** and its name say so: `countByStatus` counts; `averageResponseMs` averages. A function like that can be tested on its own and can be reused; Lesson 7 will call them from several places.

Inside `countByStatus` an **arrow function** appears: `(service) => service.status === status`. It is a function without a name, written short: to the left of the arrow, the parameters; to the right, what it returns ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)). It is equivalent to `function (service) { return service.status === status; }`. It is used mostly to pass it to the array methods, which are what comes next.

#### 6.2.5 The array methods

Open `fig06_03.html`:

```html
<!-- fig06_03.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Una lista de servicios</title>
</head>
<body>
  <main>
    <h1>Una lista de servicios</h1>
    <p>Abre la consola de las herramientas del navegador (F12) para ver el resultado.</p>
  </main>
  <script type="module">
    const services = [
      { id: "catalog", name: "Catálogo", status: "available", responseMs: 120 },
      { id: "payments", name: "Pagos", status: "available", responseMs: 480 },
      { id: "inventory", name: "Inventario", status: "down", responseMs: null },
      { id: "notifications", name: "Notificaciones", status: "available", responseMs: 310 },
      { id: "search", name: "Búsqueda", status: "available", responseMs: 950 },
    ];

    console.log(services.length, services[0].name, services.at(-1).name);

    const available = services.filter((service) => service.status === "available");
    console.log(available.length);

    const names = services.map((service) => service.name);
    console.log(names.join(", "));

    const payments = services.find((service) => service.id === "payments");
    console.log(payments.responseMs);

    console.log(services.some((service) => service.status === "down"));
    console.log(services.every((service) => service.status === "down"));

    const slowestFirst = available.toSorted((a, b) => b.responseMs - a.responseMs);
    console.log(slowestFirst.map((service) => service.name).join(" > "));
    console.log(available[0].name);
  </script>
</body>
</html>
```

The console shows:

```text
5 Catálogo Búsqueda
4
Catálogo, Pagos, Inventario, Notificaciones, Búsqueda
480
true
false
Búsqueda > Pagos > Notificaciones > Catálogo
Catálogo
```

Each method receives an arrow function and calls it with the elements, in order. `filter` and `map` call it with **all** of them. `find`, `some` and `every`, on the other hand, stop as soon as they can give the answer ([MDN describes it](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#iterative_methods)): `find` and `some` at the first element that meets the condition, `every` at the first that does not. With the dashboard list, `some` checks Catálogo, Pagos and Inventario, finds the one that is down and no longer looks at Notificaciones or Búsqueda; `every` stops at Catálogo, which is not down. I measured it by counting the calls: 3 and 1.

- [`filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) returns a **new array** with only the elements for which the function returns `true`. It is the dashboard's “query”: the available ones are `services.filter((service) => service.status === "available")`, and there are 4.
- [`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) returns a new array of the same size, where each element is what the function returned for the original. Here it pulls out the names; in Lesson 7 it will produce the table rows.
- [`find`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find) returns **the first** element that meets the condition, or `undefined` if none does. Here it looks for the service whose `id` equals `"payments"` and keeps its `responseMs` (480).
- [`some`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some) asks “does **any** meet it?” and [`every`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every) asks “do **all** meet it?”. Both return `true` or `false`. Is any service down? Yes (`some` gives `true`). Are all of them down? No (`every` gives `false`).
- [`toSorted`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted) sorts **without touching the original** and returns a sorted copy. According to MDN, it has been available in all browsers since July 2023, and the [features explorer](https://web-platform-dx.github.io/web-features-explorer/features/array-by-copy/) declares it “widely available” since January 4, 2026. The last line demonstrates it: after sorting `available` from highest to lowest, `available[0].name` is still “Catálogo”; the original did not change.

The sorting function needs an explanation, because it is the one people trip over most. `toSorted` and its older sibling `sort` receive a **comparator function** with two elements, `a` and `b`, that returns a number: negative if `a` goes first, positive if it goes after, zero if they tie. `b.responseMs - a.responseMs` returns a positive when `b` is larger, which means `a` goes after: descending order. And the trap: if you do not pass a comparator, `sort` converts everything to text and sorts it as text, so `[10, 9, 1].sort()` gives `[1, 10, 9]` (I measured it) and not `[1, 9, 10]`, because “10” goes before “9” alphabetically. In addition, [`sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) **modifies the original array**; that is why the course rule is to use `toSorted`, which never modifies it.

#### 6.2.6 Deciding, repeating and signaling an error

Up to here, each program ran from top to bottom without skipping anything: all the lines, once each. The dashboard's calculations need three more things. **Deciding**: “if the service did not respond, do not add it”. **Repeating**: “do this with each service in the list”. And **signaling an error**: “this piece of data makes no sense; stop and say so”. In addition, there are two pieces of syntax you will see from here on: the word `new` and the three dots `...`. First the idea of each one, then the code, and at the end two pages that run them all.

**Deciding with `if` and `else`.** An [`if` statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) receives a **condition** between parentheses: almost always, an expression that gives `true` or `false`, such as `service.status === "available"`. Strictly speaking, `if` accepts any value and converts it: `false`, `0`, `""` (the empty text), `null`, `undefined` and `NaN` count as false (they are called [*falsy*](https://developer.mozilla.org/en-US/docs/Glossary/Falsy); the complete list has a couple more oddities), and everything else counts as true (*truthy*). That is why `if ("sí")` enters the block and `if (0)` does not. In this course you write conditions that already give `true` or `false`, so that they read without having to think about conversions. If the condition is true, the block of braces that follows is run; if it is false, it is skipped. With `else` you write the other path: what is done when the condition was false. And when there are more than two paths they are chained with `else if`: the program checks the conditions in order and takes **the first** path whose condition is met; the rest are no longer checked. In daily life you do it without thinking: “if it rains, I take an umbrella; if not, if it is sunny, I take a cap; if not, I take nothing”. A detail of form: when the block has a single statement, the braces can be omitted and everything is written on one line (`if (button === null) return;`). In this course they are omitted only on those short lines.

**Inverting a condition with `!`.** The [`!` operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_NOT) reads “not”: `!true` is `false` and `!false` is `true`. It is useful to write the condition the other way round without changing it: `if (!allUp)` reads “if not all are up”.

**Deciding a value with the ternary operator.** Many times the decision is not “what do I do” but “what value do I use”. For that there is the [conditional operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator), which is called **ternary** because it has three parts: `condition ? valueIfYes : valueIfNo`. The whole expression *evaluates to* one of the two, so it can be stored in a variable or put into a template literal. `` responseMs === null ? "sin respuesta" : `${responseMs} ms` `` says: “if there is no data, the text is ‘sin respuesta’; if there is, it is the number with its unit”. Use it when each path is a short value; if each path has several statements, an `if` reads better.

**Repeating with `for…of`.** The methods in the previous section (`filter`, `map`…) go through an array internally. Sometimes it is convenient to go through it yourself, step by step, and for that there is the [`for…of`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of) loop: `for (const service of services) { … }` runs the block **once for each element**, in order, and on each pass `service` is the element of that pass. It is declared with `const` because within one pass it does not change; on the next pass it is another variable with the next element. Inside the loop, the [`continue`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/continue) statement says “this pass ends here; go on to the next element”. And a shorthand operator appears: `total += service.responseMs` is the same as `total = total + service.responseMs` (that is why `total` is declared with `let`: it changes on each pass).

Open `fig06_04.html`, and before looking at the console **predict** which line the loop prints for Inventario and what the final total is:

```html
<!-- fig06_04.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Decidir y repetir</title>
</head>
<body>
  <main>
    <h1>Decidir y repetir</h1>
    <p>Abre la consola de las herramientas del navegador (F12) para ver el resultado.</p>
  </main>
  <script type="module">
    const services = [
      { id: "catalog", name: "Catálogo", status: "available", responseMs: 120 },
      { id: "payments", name: "Pagos", status: "available", responseMs: 480 },
      { id: "inventory", name: "Inventario", status: "down", responseMs: null },
      { id: "notifications", name: "Notificaciones", status: "available", responseMs: 310 },
      { id: "search", name: "Búsqueda", status: "available", responseMs: 950 },
    ];

    // if / else: una decisión con dos caminos.
    const first = services[0];
    if (first.status === "available") {
      console.log(`${first.name} está disponible.`);
    } else {
      console.log(`${first.name} está caído.`);
    }

    // else if: más de dos caminos; se toma el primero cuya condición se cumpla.
    const payments = services[1];
    if (payments.responseMs === null) {
      console.log(`${payments.name} no respondió.`);
    } else if (payments.responseMs > 500) {
      console.log(`${payments.name} respondió lento.`);
    } else {
      console.log(`${payments.name} respondió a tiempo.`);
    }

    // ! invierte un booleano.
    const allUp = services.every((service) => service.status === "available");
    console.log(allUp, !allUp);

    // El operador ternario: una decisión que produce un valor.
    const inventory = services[2];
    const time = inventory.responseMs === null ? "sin respuesta" : `${inventory.responseMs} ms`;
    console.log(`${inventory.name}: ${time}`);

    // for...of: las mismas instrucciones para cada elemento, uno tras otro.
    let total = 0;
    for (const service of services) {
      if (service.responseMs === null) {
        console.log(`${service.name}: sin respuesta, no se suma`);
        continue;
      }
      total += service.responseMs;
      console.log(`${service.name}: ${service.responseMs} ms, van ${total}`);
    }
    console.log(`Total: ${total} ms`);
  </script>
</body>
</html>
```

The console shows:

```text
Catálogo está disponible.
Pagos respondió a tiempo.
false true
Inventario: sin respuesta
Catálogo: 120 ms, van 120
Pagos: 480 ms, van 600
Inventario: sin respuesta, no se suma
Notificaciones: 310 ms, van 910
Búsqueda: 950 ms, van 1860
Total: 1860 ms
```

Follow the loop pass by pass, as if you were the engine: `total` starts at 0; on the Catálogo pass it becomes 120, on Pagos 600; on the Inventario pass the condition `service.responseMs === null` is true, the warning is printed and `continue` skips the rest of that pass, so `total` stays at 600; then 910 and 1,860. Pagos took the last path of its `if…else if…else` because 480 is neither `null` nor greater than 500. And `allUp` is `false` because Inventario is down, so `!allUp` is `true`. Notice that the loop does by hand the same thing `reduce` will do in the next section, and with the same care: the one that did not respond is not added.

**Signaling an error with `throw`, and catching it with `try…catch`.** There are situations in which a function cannot do its job: it received a response time that is not a number, or a file that does not exist. Returning just any value would hide the problem. The right thing is to **throw** an error with the [`throw`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw) statement: `throw new Error("mensaje")`. At that instant the function stops and the error “goes up” to whoever called it, and to whoever called that one, and so on until someone catches it. If nobody catches it, the program stops and the console shows it in red: that is how the errors in the section “The error you will see” look.

Catching it is saying beforehand “try this, and if it fails, do this other thing”. That is [`try…catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch): inside `try { … }` goes what may fail; if a statement throws an error, the ones that follow inside the `try` **are no longer run** and the program jumps to the `catch (error) { … }` block, where `error` is what was thrown. After the `catch`, the program goes on normally. A JavaScript error is an object with two properties that you will read a lot: `error.name`, the type of error (`Error`, `TypeError`…), and `error.message`, the text that explains it.

**Creating an object with `new`.** In the `throw` the word `new` appeared. Some objects are not written with braces but **manufactured** with a *constructor*, a special function that builds an object of a certain type and leaves it ready to use. The [`new` operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new) is the way of asking for it: `new Error("Sin conexión")` manufactures an error object with that message, and `new Intl.NumberFormat("es-MX")` manufactures a number formatter for Mexican Spanish, which you will see in the next section. By convention, constructor names start with a capital letter (`Error`, `Intl.NumberFormat`, and later `AbortController` or `FormData`). In this course you will not write constructors of your own; you will only use the ones the browser provides.

**The three dots: spread.** You already saw it in 6.2.1 with objects: `{ ...service, status: "down" }` copies the properties of `service` into a new object and lets you change some. The [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) does the same in two other places. **In an array**, `[...times, 210]` creates a new array with the elements of `times` and one more at the end; `times` does not change. **In a function call**, `Math.max(...times)` “scatters” the elements of the array as if you had written them one by one, separated by commas: `Math.max(120, 480, 310, 950)`. It is useful with functions that receive any number of arguments, such as `Math.max` or, in Lesson 7, `replaceChildren`.

Open `fig06_05.html`. **Predict** first: is “Esta línea no se ejecuta.” (This line is not run.) printed? How big is `times` after creating `withMail`?

```html
<!-- fig06_05.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Avisar de un error, new y propagación</title>
</head>
<body>
  <main>
    <h1>Avisar de un error, new y propagación</h1>
    <p>Abre la consola de las herramientas del navegador (F12) para ver el resultado.</p>
  </main>
  <script type="module">
    // throw: avisar de que algo no tiene sentido y detener lo que se estaba haciendo.
    function checkResponseMs(value) {
      if (typeof value !== "number") {
        throw new Error(`Se esperaba un número y llegó: ${value}`);
      }
      return value;
    }

    // try / catch: intentar algo y, si falla, seguir por otro camino.
    try {
      console.log(checkResponseMs(120));
      console.log(checkResponseMs("rápido"));
      console.log("Esta línea no se ejecuta.");
    } catch (error) {
      console.log(`Se atrapó un ${error.name}: ${error.message}`);
    }
    console.log("El programa sigue.");

    // new: crear un objeto nuevo a partir de un constructor.
    const failure = new Error("Sin conexión");
    console.log(failure.message);
    const format = new Intl.NumberFormat("es-MX");
    console.log(format.format(1860));

    // ...: la propagación, en una llamada, en un arreglo y en un objeto.
    const times = [120, 480, 310, 950];
    console.log(Math.max(...times));
    const withMail = [...times, 210];
    console.log(withMail.length, times.length);
    const mail = { id: "mail", name: "Correo", status: "available", responseMs: 210 };
    const mailDown = { ...mail, status: "down", responseMs: null };
    console.log(mail.status, mailDown.status, mailDown.name);
  </script>
</body>
</html>
```

The console shows:

```text
120
Se atrapó un Error: Se esperaba un número y llegó: rápido
El programa sigue.
Sin conexión
1,860
950
5 4
available down Correo
```

The first call to `checkResponseMs` receives a number and returns it: 120 is printed. The second receives the text `"rápido"`; `typeof` says `"string"`, the `if` condition is met and the error is thrown. The next line of the `try` is never run, the `catch` receives the error and prints its name and its message, and the program goes on. Then `new` manufactures an error that is not thrown (an error is an object like any other: throwing it is a separate decision) and a formatter that writes 1,860 with the thousands comma used in Mexico. Finally, spread: `Math.max(...times)` gives 950; `withMail` has 5 elements and `times` still has 4; and `mailDown` is a copy of `mail` with two properties changed and the name intact, while `mail` is still available.

With this you have all the pieces of the dashboard's calculations. If you want to see the same ideas with other examples, the MDN guide devotes a chapter to [control flow and error handling](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling) and another to [loops](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration).

#### 6.2.7 The dashboard's calculations

With everything above, the calculations are written. The first you already have: `countByStatus`. The second, the average, is the one that teaches the most. In `fig06_06.html`:

```html
<!-- fig06_06.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Cuentas con funciones</title>
</head>
<body>
  <main>
    <h1>Cuentas con funciones</h1>
    <p>Abre la consola de las herramientas del navegador (F12) para ver el resultado.</p>
  </main>
  <script type="module">
    const services = [
      { id: "catalog", name: "Catálogo", status: "available", responseMs: 120 },
      { id: "payments", name: "Pagos", status: "available", responseMs: 480 },
      { id: "inventory", name: "Inventario", status: "down", responseMs: null },
      { id: "notifications", name: "Notificaciones", status: "available", responseMs: 310 },
      { id: "search", name: "Búsqueda", status: "available", responseMs: 950 },
    ];

    function countByStatus(list, status) {
      return list.filter((service) => service.status === status).length;
    }

    function averageResponseMs(list) {
      const answered = list.filter((service) => Number.isFinite(service.responseMs));
      if (answered.length === 0) {
        return null;
      }
      const total = answered.reduce((sum, service) => sum + service.responseMs, 0);
      return total / answered.length;
    }

    console.log(countByStatus(services, "available"));
    console.log(countByStatus(services, "down"));
    console.log(averageResponseMs(services));
    console.log(averageResponseMs([]));

    const withoutSearch = services.filter((service) => service.id !== "search");
    const average = averageResponseMs(withoutSearch);
    console.log(average);
    console.log(Math.round(average));
    console.log(average.toFixed(1), typeof average.toFixed(1));
    console.log(new Intl.NumberFormat("es-MX", { maximumFractionDigits: 1 }).format(average));
  </script>
</body>
</html>
```

The console shows:

```text
4
1
465
null
303.3333333333333
303
303.3 string
303.3
```

`averageResponseMs` does three things, and each one is a decision:

1. **It keeps only the services that have a measured time** (`filter`). The test is [`Number.isFinite(service.responseMs)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite), which answers `true` only when the value is a real number: not `null`, not a text such as `"120"`, not `NaN`. A service that is down carries `null` and is left out. Notice that the question is “do I have a number to average?” and not “what status is it in?”: if tomorrow a new status appeared, say “slow”, with its measured time, it would enter the average without changing the function.
2. **If none is left, it returns `null`** and not a number. Averaging nothing is not zero: it is having no data, and again `null` says it precisely. Without that guard, dividing by zero would give `NaN`.
3. **It adds up with `reduce` and divides by how many there are.**

[`reduce`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) is the hardest method to read and the one most worth understanding. It goes through the array with an **accumulator**: a variable that stores the result so far. It receives two things: a function of two parameters (the accumulator and the current element) that returns the accumulator's new value, and the accumulator's **initial value**. In `answered.reduce((sum, service) => sum + service.responseMs, 0)`, the accumulator `sum` starts at `0`, and for each service its `responseMs` is added to it: 0 + 120 = 120, 120 + 480 = 600, 600 + 310 = 910, 910 + 950 = 1,860. The result, 1,860, is divided by 4 and gives 465, the figure you wrote by hand in Lesson 2.

The last lines of the page show how a number with decimals is presented. With `withoutSearch` (the services without the search one) the average is 303.3333333333333; that number, as is, is not shown to anyone. There are three ways of rounding it and each returns something different: [`Math.round`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round) returns a whole **number** (303); [`toFixed(1)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed) returns a **text** with one decimal (“303.3”, and the console confirms it with `typeof`, which says `string`), so you cannot keep adding with it without converting it; and [`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat), which formats according to language and country, available in all browsers since 2017. With `"es-MX"` it uses the decimal point used in Mexico. The rule: **you calculate with full-precision numbers and round only at the end, to display them**.

#### 6.2.8 The average that goes wrong

There is a way of writing the average that looks right and gives a different figure, with no error in the console. It is in `fig06_07.html`:

```html
<!-- fig06_07.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>El promedio que sale mal</title>
</head>
<body>
  <main>
    <h1>El promedio que sale mal</h1>
    <p>Abre la consola de las herramientas del navegador (F12) para ver el resultado.</p>
  </main>
  <script type="module">
    const services = [
      { id: "catalog", name: "Catálogo", status: "available", responseMs: 120 },
      { id: "payments", name: "Pagos", status: "available", responseMs: 480 },
      { id: "inventory", name: "Inventario", status: "down", responseMs: null },
      { id: "notifications", name: "Notificaciones", status: "available", responseMs: 310 },
      { id: "search", name: "Búsqueda", status: "available", responseMs: 950 },
    ];

    const total = services.reduce((sum, service) => sum + service.responseMs, 0);
    console.log(total, total / services.length);

    console.log(null + 1, undefined + 1, "5" + 1, "5" - 1);

    const first = [].reduce((sum, service) => sum + service.responseMs, 0);
    console.log(first);

    try {
      [].reduce((sum, service) => sum + service.responseMs);
    } catch (error) {
      console.log(error.name + ": " + error.message);
    }
  </script>
</body>
</html>
```

The console shows:

```text
1860 372
1 NaN 51 4
0
TypeError: Reduce of empty array with no initial value
```

The first line adds up the times of **all** the services, including the one that is down, and divides by **five**. It gives 372 instead of 465. Why did it not fail when adding a `null`? Because JavaScript, on meeting `120 + null`, **converts the `null` into zero** without warning. The sum still gives 1,860 (the down service contributed zero), but the division is by 5 and not by 4. The result is a plausible number, 372, that looks like a response time and that nobody suspects, and the dashboard would show the wrong figure with complete confidence. **This is the typical silent error of data: there is no message, there is a number that is not the right one.** The second line shows the family of conversions it comes from: `null + 1` is `1`, `undefined + 1` is `NaN`, `"5" + 1` is `"51"` (the `+` with a text concatenates) and `"5" - 1` is `4` (the `-` does convert). You can learn each rule, but it is cheaper to follow this one: **before calculating, check that the data exists**, which is what `filter` does in the function above.

The last two lines show a limit of `reduce`. With an empty array and an initial value (`0`), it returns the initial value. Without an initial value, it tries to use the first element as the accumulator, there is no first element and it throws a `TypeError` (the `try…catch` of 6.2.6 catches it), whose text I copied from Chrome's console: “Reduce of empty array with no initial value”. Another browser may word it differently. The rule: **`reduce` always takes an initial value**.

### 6.3 Modules: splitting the program into files

#### 6.3.1 Why split

So far, the whole program lived inside one page. That is fine for an experiment and becomes unmanageable as soon as the dashboard has data, calculations and (from Lesson 7) drawing. There is a simple way of organizing what you write: **each file does one thing**. One file stores the data, another the calculations, another ties everything together. Whoever opens the project knows where to look, and the calculations file can be reused with other data.

For one file to be able to use something from another, a mechanism is needed, and that mechanism is the **module**. A JavaScript file is a module when it is loaded as one; what it declares inside is **private** unless you mark it with `export`, and another file brings it in with `import`. The three files of the dashboard are:

```js
// fig06_08/services.js
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
// fig06_08/stats.js
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

```js
// fig06_08/main.js
import { services } from "./services.js";
import { summarize } from "./stats.js";

const summary = summarize(services);

console.log(`Disponibles: ${summary.available}`);
console.log(`Caídos: ${summary.down}`);
console.log(
  summary.averageMs === null
    ? "Respuesta promedio: sin datos"
    : `Respuesta promedio: ${summary.averageMs} ms`,
);
console.log(JSON.stringify(summary));
```

`services.js` exports the `services` array. `stats.js` exports three functions: the two calculations and a third, `summarize`, that gathers them into an object with the three figures of the summary. `main.js` imports what it needs from each, calculates, and sends the result to the console. According to the [MDN documentation on modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), an `import { services } from "./services.js";` declaration brings in by name what the other file exported with [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) (the names between braces have to match exactly), and the path starts with `./` to say “in the same folder as this file”.

That is the shape of the data the dashboard will have in the following lessons. Notice `summarize`: it returns an **object** with `available`, `down` and `averageMs`. It is exactly the summary from Lesson 2, and in Lesson 7 it will be drawn on screen.

#### 6.3.2 How a module is loaded

The page that runs it is `fig06_08.html`:

```html
<!-- fig06_08.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Los datos del panel y sus cuentas</title>
  <script type="module" src="fig06_08/main.js"></script>
</head>
<body>
  <main>
    <h1>Los datos del panel y sus cuentas</h1>
    <p>Abre la consola de las herramientas del navegador (F12) para ver el resultado.</p>
  </main>
</body>
</html>
```

Everything is in one line: `<script type="module" src="fig06_08/main.js"></script>`. The `type="module"` attribute tells the browser that this file is a module and not a classic script, according to the [HTML standard](https://html.spec.whatwg.org/multipage/scripting.html) and the [`script` element reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script). Three consequences of that, which MDN lists and which are worth learning all at once:

- **It defers itself.** A module runs *after* the browser has read all the HTML. You need neither `defer` nor to put it at the end of the `<body>`: it can be loaded from the `<head>`.
- **It uses strict mode.** A module always works in [strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode), which turns a few things the language used to tolerate silently into errors (for example, assigning a value to a variable you never declared: without strict mode, that typo silently creates a global variable; in strict mode, it is a `ReferenceError`).
- **It has its own scope.** What a module declares is not visible from outside, not even from the console: if `main.js` has a variable `summary`, typing `summary` in the console does not find it. It is an advantage: two files can use the same name without stepping on each other. And an inconvenience for whoever debugs: to inspect something you print it with `console.log`.

When you open `fig06_08.html` in the browser, the console shows:

```text
Disponibles: 4
Caídos: 1
Respuesta promedio: 465 ms
{"available":4,"down":1,"averageMs":465}
```

The same four figures you wrote by hand, now calculated. And now, the step that closes the lesson in the project: in the `revisor` folder, put the three files in `js/` (`js/services.js`, `js/stats.js`, `js/main.js`; the `import` path does not change because they are still in the same folder) and add to the `<head>` of your `index.html`:

```html
<script type="module" src="js/main.js"></script>
```

Reload `index.html`: the page looks exactly the same, but in the console the four lines above appear. Compare each one with what the dashboard summary says: 4 available, 1 down, 465 ms. If they match, the data model reproduces what you had calculated by hand. If you add a service to the array and reload, the console figures change, and the summary written in the HTML does not: that will be the work of Lesson 7.

#### 6.3.3 Why it does not open with a double click

If you open `fig06_08.html` with a double click in the file manager, the address starts with `file:///` and the console shows a red error. I copied it from Chrome 154 (another browser words it differently):

```text
Access to script at 'file:///.../programas/06-javascript-datos/fig06_08/main.js' from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: chrome, chrome-experimental-site-token-provider, chrome-extension, chrome-untrusted, data, http, https, isolated-app.
```

It is what Lesson 1 anticipated. Modules are requested with the same mechanism the browser uses to request things from other sites, and that mechanism demands a network protocol (`http` or `https`), not a read from disk. With `file://` the page's origin is `null` and the request is blocked. The solution is not to tinker with the browser: it is to open the page from the local server (`python3 -m http.server 8000 --bind 127.0.0.1`, and `http://localhost:8000/`). It is the reason the course installs the server from the first lesson.

## The error you will see

This stage has five messages that you will read many times. They are learned best by provoking them on purpose. All five are copied from the Chrome 154 console with the pages in [`programas/06-javascript-datos/`](https://github.com/HabilMX/curso-web/tree/main/programas/06-javascript-datos); the browser you use may word them differently, but they say the same thing.

### `Cannot read properties of undefined (reading 'name')`

The most frequent JavaScript error. Open `fig06_09.html`:

```html
<!-- fig06_09.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Leer algo que no existe</title>
</head>
<body>
  <main>
    <h1>Leer algo que no existe</h1>
    <p>Abre la consola de las herramientas del navegador (F12) para ver el resultado.</p>
  </main>
  <script type="module">
    const services = [
      { id: "catalog", name: "Catálogo", status: "available", responseMs: 120 },
      { id: "payments", name: "Pagos", status: "available", responseMs: 480 },
      { id: "inventory", name: "Inventario", status: "down", responseMs: null },
      { id: "notifications", name: "Notificaciones", status: "available", responseMs: 310 },
      { id: "search", name: "Búsqueda", status: "available", responseMs: 950 },
    ];

    const sixth = services[5];
    console.log(sixth.name);
  </script>
</body>
</html>
```

The console shows, in red:

```text
Cannot read properties of undefined (reading 'name')
```

Read it from right to left: the program tried to read the property `name` of something that is `undefined`. Of what? Of `services[5]`. The array has five elements, with positions from 0 to 4, and asking for the 5th gives `undefined`; and asking `undefined` for a property is an error ([MDN explains it in more detail](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cant_access_property)). To the right of the message, the console shows the file and the line where it happened; when you click on it, the tools open that line. There are two solutions: confirm that you do not go past the end (`services.length`, `.at(-1)`), or, if the element may not exist, use `?.`: `services[5]?.name` gives `undefined` without an error.

### `Assignment to constant variable.`

In `fig06_10.html`, `const total = 0; total = total + 120;`:

```html
<!-- fig06_10.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Reasignar una constante</title>
</head>
<body>
  <main>
    <h1>Reasignar una constante</h1>
    <p>Abre la consola de las herramientas del navegador (F12) para ver el resultado.</p>
  </main>
  <script type="module">
    const total = 0;
    total = total + 120;
    console.log(total);
  </script>
</body>
</html>
```

The message is literally that, and it says what you did: you tried to reassign a `const` ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Invalid_const_assignment)). If the value is going to change, the variable should have been `let`.

### `Cannot use import statement outside a module`

In `fig06_11.html`, the same `main.js`, but with `<script src="...">` without `type="module"`:

```html
<!-- fig06_11.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Un import sin type="module"</title>
  <script src="fig06_08/main.js"></script>
</head>
<body>
  <main>
    <h1>Un import sin type="module"</h1>
  </main>
</body>
</html>
```

The console shows:

```text
Cannot use import statement outside a module
```

An `import` is only understood inside a module; a classic script does not know what it is. It is fixed by adding `type="module"` to the `<script>`.

### `The requested module './fig06_08/services.js' does not provide an export named 'servicios'`

In `fig06_12.html`, one module asks for a name that the other file does not export:

```html
<!-- fig06_12.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Importar lo que no se exportó</title>
  <script type="module">
    import { servicios } from "./fig06_08/services.js";

    console.log(servicios.length);
  </script>
</head>
<body>
  <main>
    <h1>Importar lo que no se exportó</h1>
  </main>
</body>
</html>
```

The console shows:

```text
The requested module './fig06_08/services.js' does not provide an export named 'servicios'
```

It says clearly which file and which name. The file exports `services` (in English) and here `servicios` was requested: a misspelled name, and names have to match character by character. It is fixed by writing the name as it is in the `export`.

### `Access to script ... has been blocked by CORS policy`

It is the one from section 6.3.3, the one that appears when you open with a double click instead of using the server.

## What gets done wrong

**Writing `var`.** You already saw why: it lives in the whole function, it is hoisted and it allows redeclaring, so it hides errors that `let` and `const` show. Cost: a name that changes value from a corner of the program you did not expect.

**Comparing with `==`.** `120 == "120"` gives `true`; in a dashboard that receives data from outside, a time that arrives as text would pass the comparisons as a number. With `===`, the discrepancy stands out.

**Storing a number as text.** `responseMs: "120"` looks the same and no longer is: `"120" + 1` gives `"1201"`. Data that are quantities are stored as numbers, without quotation marks, and the unit goes in the name.

**Representing “did not respond” with `0`, with `""` or with `"sin respuesta"`.** With `0` the average rewards the service that is down; with a text, the sum becomes a concatenation or a `NaN`. A missing piece of data is stored as `null`, and the functions decide what to do with it.

**Averaging without filtering.** It is the 372 instead of the 465 from 6.2.8: a credible number, with no error and wrong. Before averaging, you have to keep what does have data.

**Using `sort()` where a copy was wanted.** `sort` changes the original array, and whoever used it further up sees it reordered without knowing why. With `toSorted` it does not happen. And without a comparator function, it sorts as text: `[10, 9, 1]` gives `[1, 10, 9]`.

**Going on calculating with a number already rounded to text.** `toFixed` returns a text. If you add it, you concatenate. You round at the end, only to display.

**A `reduce` without an initial value.** It works until the day the array arrives empty, and then it throws a `TypeError` at the worst moment.

**The same data written in two places.** It is the problem the lesson starts with: the table says six rows and the summary says five. The data lives in one place; the rest is calculated.

## Exercises

### Exercise 1 — Add a service and watch the figures change

In your copy of `services.js`, add a sixth service: `Correo`, `id` `"mail"`, available, with 210 ms. Without touching `stats.js` or `main.js`, reload the page and write down the three figures. Before reloading, predict the numbers: how many services will be available and what will the average be. Does the prediction match what comes out?

### Exercise 2 — The slowest

Write in `stats.js` a function `slowest(list, n)` that returns the **names** of the `n` available services with the highest response time, from slowest to fastest. It must not modify the list it receives. Test it with `n = 2` and with an `n` greater than the number of available services, and with an empty list. Hint: chain `filter`, `toSorted`, `slice` and `map`. Of the four, [`slice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) is the only one you have not seen: `lista.slice(inicio, fin)` returns a **new** array with the elements from position `inicio` up to the one before `fin`, without touching the original. `[10, 20, 30].slice(0, 2)` gives `[10, 20]`: the first two.

### Exercise 3 — Count all the statuses at once

`countByStatus` goes through the list once for each status you ask it about. Write `countsByStatus(list)` that goes through it **only once** with `reduce` and returns an object with one property for each status that appears, for example `{ available: 4, down: 1 }`. It must return an object with no properties for an empty list. Hint: the accumulator is an object, and `counts[service.status] ?? 0` gives you the current count or zero if the status had not been seen yet. And a question for after you solve it: what happens if some service arrives with the status `"toString"`?

### Exercise 4 — Provoke four errors and read them

In a copy of the project, provoke these four errors one by one and write down the exact message your browser shows: (a) ask for a service that does not exist and read its `name`; (b) import a misspelled name; (c) reassign a `const`; (d) remove `type="module"` from the `<script>`. For each one, write in a sentence what the message means and what the fix is.

## Solutions

### Solution 1

With six services (five available, one down), the prediction is: Disponibles (Available) 5, Caídos (Down) 1, and the average of the five that responded is (120 + 480 + 310 + 950 + 210) / 5 = 2,070 / 5 = 414. I checked it by running the program: it gives 414. The service that is down still does not count toward the average. The important thing about the exercise is what you did **not** have to touch: neither the calculations nor the main program. You changed the data, which lives in one place, and everything else was recalculated. That is the gain from separating data and calculations.

### Solution 2

The available ones are filtered (the ones that are down have no time), a copy is sorted from highest to lowest, the first `n` are taken and the name is extracted:

```js
export function slowest(list, n) {
  return list
    .filter((service) => service.status === "available")
    .toSorted((a, b) => b.responseMs - a.responseMs)
    .slice(0, n)
    .map((service) => service.name);
}
```

With the five original services, `slowest(services, 2)` returns `["Búsqueda", "Pagos"]` (950 and 480). With `n` equal to 10 it returns the four available ones, `["Búsqueda", "Pagos", "Notificaciones", "Catálogo"]`: `slice(0, n)` does not fail if `n` is greater than the length, it simply returns everything. With an empty list it returns `[]`. The original list does not change, because `filter` and `toSorted` return copies. If you had used `sort` on `list`, you would have reordered the dashboard's data without anyone noticing.

### Solution 3

```js
export function countsByStatus(list) {
  return list.reduce((counts, service) => {
    counts[service.status] = (counts[service.status] ?? 0) + 1;
    return counts;
  }, Object.create(null));
}
```

For the five services it returns `{ available: 4, down: 1 }`, and for `[]` it returns an object with no properties (the initial value, because there are no elements). The accumulator is the object passed as the second argument of `reduce`.

**Why `Object.create(null)` and not `{}`.** It is the answer to the question in the statement. An object written as `{}` is not completely empty: it [inherits](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) from JavaScript a handful of properties you do not see, such as `toString`. If a service arrives with the status `"toString"`, `counts["toString"] ?? 0` does not give `0` but that inherited function, and the count comes out as garbage text: `'function toString() { [native code] }1'`. With the status `"__proto__"` it is worse: the assignment creates no property at all. I measured it with both versions. [`Object.create(null)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create) manufactures an object with **nothing inherited**, a clean dictionary where only what you store is present, and with it `"toString"` and `"__proto__"` count 1 like any other status. Today you write the statuses yourself, but from Lesson 8 they will arrive from outside, and a piece of data from outside can carry any text. For each service, `counts[service.status] ?? 0` is the count already there for that status, or zero if it is the first time it appears; one is added to it and it is stored. It is a variant where the accumulator **is** modified, which is normal in `reduce`: what is never modified is the input list. If in the future there is a third status, `countsByStatus` counts it without changing a single line.

### Solution 4

(a) `Cannot read properties of undefined (reading 'name')`. A position that does not exist was requested and a property was asked of the resulting `undefined`. Fix: check the array's limit, or `services[n]?.name`.

(b) `The requested module './services.js' does not provide an export named 'servicios'` (the path changes depending on the file). The `import` name does not match the `export` one. Fix: write it the same, character by character.

(c) `Assignment to constant variable.` A `const` was reassigned. Fix: if it is going to change, declare it with `let`; if not, do not reassign it.

(d) `Cannot use import statement outside a module`. The `<script>` does not declare `type="module"`. Fix: add it.

## How I know I got it

- [ ] When you open `fig06_08.html` from `http://localhost:8000/`, the console shows exactly four lines: `Disponibles: 4`, `Caídos: 1`, `Respuesta promedio: 465 ms` and `{"available":4,"down":1,"averageMs":465}`, and no red error.
- [ ] Your `index.html` loads `js/main.js` with `<script type="module">`, looks the same as before, and the console shows the same four lines, which match the figures written in the summary.
- [ ] When you open `fig06_08.html` with a double click (`file://`), the CORS error appears and you can explain why.
- [ ] `fig06_07.html` shows `1860 372` and you can explain why 372 is wrong and 465 is right.
- [ ] If you add the mail service with 210 ms, the console shows 5 available, 1 down and 414 ms without you touching `stats.js`.
- [ ] You can write from memory a function that receives the list of services and returns how many are in a given status, using `filter` and `length`.
- [ ] You can explain in your own words the difference between `const` and `let`, between `===` and `==`, between `sort` and `toSorted`, and why a service that is down has `responseMs: null` and not `0`.

## Summary

Answer without looking at the lesson:

1. What type of value does `typeof` give for `120`, for `"120"` and for `true`? And why does `120 === "120"` give `false`?
2. What is the difference between `const` and `let`, and which do you use by default?
3. How is a service represented, and how is the list of services? Why does the service that is down carry `null` and not `0`?
4. What does `filter` return, what does `find`, what does `some`? Which modifies the original array, `sort` or `toSorted`?
5. What two things must an average function do before dividing?
6. In a `try…catch`, what happens to the lines of the `try` that follow the one that threw an error? And when is a ternary better than an `if`?
7. What figure comes out when you average the dashboard's five services without filtering out the one that is down, and why is it not the right one?
8. What does `type="module"` do in a `<script>` and why does a module not load with `file://`?

## Further reading

- [MDN, “JavaScript Guide”](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide) — Mozilla's official guide, from grammar and types to modules, in the same order as this lesson. Accessed on October 7, 2026.
- [MDN, “JavaScript modules”](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) — `import`, `export`, a module's scope and the `file://` error. Accessed on October 7, 2026.
- [MDN, “Indexed collections”](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Indexed_collections) — arrays and their methods with more examples. Accessed on October 7, 2026.
- [ECMAScript language specification](https://tc39.es/ecma262/) — the ultimate source for what each operator means; not a text to learn from, but to consult when a doubt is not resolved elsewhere. Accessed on October 7, 2026.
