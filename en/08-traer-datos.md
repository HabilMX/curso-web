# Lesson 8 — Fetching data: promises, fetch and async/await

**Time:** 2 × 45 min

**What you build:** the dashboard that requests its data from a JSON file on the server, instead of carrying it written in the code

**What you learn:** what a promise is; `fetch` in two steps; `response.ok`; `async`/`await`; a `try`/`catch` around the request

## By the end you will be able to

- Explain what a promise is, which three moments it can be in and why slow operations return one instead of their result.
- Explain why `fetch` needs two steps (the response and its body) and write them first with `.then` and then with `async`/`await`.
- Say which cases make `fetch`'s promise reject and which do not, and check `response.ok` so as not to accept an error response as good.
- Change the dashboard so that it requests its data from `data/services.json` without touching the calculations, the sorting or the drawing.
- Recognize the message “Unexpected token '<'” and know where to look for its cause.

## The why before the how

**Starting point.** This lesson starts from the dashboard as Lesson 7 left it. Your dashboard draws the table and the summary from the data, and the structure that remained is this:

- `index.html`, with the `<tbody>` and the four `<dd>` of the summary empty, the “Ordenar por tiempo de respuesta” (Sort by response time) button and the detail region (`#detail`).
- `css/styles.css`, the stylesheet from lessons 3, 4, 5 and 7.
- `js/services.js`, which exports the `services` array and which `main.js` imports **on startup**.
- `js/stats.js`, with `summarize` and the two calculations from Lesson 6.
- `js/state.js`, with the dashboard's state (list, order, selection) and the functions that change it.
- `js/view.js`, which draws the state into the document, always with `textContent`.
- `js/main.js`, which listens to events, changes the state and draws again.

Today only one thing changes at the core: `js/services.js` disappears, and the services come to live in `data/services.json`, inside the `data` folder that you created in Exercise 1 of Lesson 1, a file that the dashboard **requests** from the server. The rest of the dashboard (the calculations, the sorting, the selection, the safe drawing) stays as it was. That this is possible is the proof that the separation in Lesson 7 was worth it. And two things that Lesson 2 left written without working come true today: the “Revisar ahora” (Check now) button, which requests the data again, and the “Última revisión” (Last check) in the header, which stops being an invented time and says when the data really arrived.

This is the file: the same five services from Lesson 6, written in JSON. The keys go between double quotation marks and the service that is down carries `null`, the rules that Lesson 6 described in 6.2.2:

```json
[
  { "id": "catalog", "name": "Catálogo", "status": "available", "responseMs": 120 },
  { "id": "payments", "name": "Pagos", "status": "available", "responseMs": 480 },
  { "id": "inventory", "name": "Inventario", "status": "down", "responseMs": null },
  { "id": "notifications", "name": "Notificaciones", "status": "available", "responseMs": 310 },
  { "id": "search", "name": "Búsqueda", "status": "available", "responseMs": 950 }
]
```

**Why the module is not enough.** While the data was in a module, the dashboard started up with it in hand: the browser could not draw the table without having read it, because it came in the same package as the code. A real report does not work that way. The data is produced by another program, at another time, and changes without anyone touching the dashboard's code: a service that goes down at three in the morning cannot wait for someone to edit `services.js` and publish again. That is why the data lives somewhere else, and to obtain it you have to make an HTTP request, the same one you studied in Lesson 0: it is sent, you wait, it is received. Separating the code from the data is also what lets the same dashboard serve any list of services: the day someone wants to check their own, they change the file, not the program.

A request, unlike a module, **takes time**. And that forces you to think differently, because the program cannot stay frozen waiting for the response: the page has to keep handling clicks and the keyboard in the meantime. This lesson is about that wait: how to write a program that asks for something, carries on with its life and picks the work back up when the response arrives. The piece that makes it possible is called a **promise**, and it is the most important idea of the lesson.

Asking for something over the network can also **go wrong** in several ways: the file does not exist, the server does not answer, the response is not what you expected. Today you will learn to **detect** each failure in the code, which is the first step and the one most often forgotten. Showing them on the screen in a way that a person understands what happened, putting a limit on the wait and requesting data from another server is the subject of Lesson 9, which starts from the dashboard you finish today. Splitting it into two lessons has a reason: first you have to understand well the path that goes right, because each failure is a deviation from that path.

**The route it follows.** First the **promise** and the two phases of `fetch`, with `.then`, which is how the web was written for years and how you will find a lot of code. Second `async` and `await`, which say the same thing in the form of continuous text, with the `try`/`catch` you already know. Third, the dashboard: a new module that requests the data and three files that change a little to receive it.

**What you need running.** Only the usual local server. This lesson's pages are in [`programas/08-traer-datos/`](https://github.com/HabilMX/curso-web/tree/main/programas/08-traer-datos) of the [course repository](https://github.com/HabilMX/curso-web); with the repository downloaded onto your computer, start the server from its `programas/` folder:

```bash
cd programas
python3 -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000/08-traer-datos/panel/`. Keep in mind the warning from Lesson 1: `fetch` and modules do not work with `file://`, because a file opened that way has no origin that can read others. The [URL standard](https://url.spec.whatwg.org/#concept-url-origin) lets each browser decide what origin a local file has and recommends, when in doubt, an opaque one; Chrome 154 does so (in the console of a page opened with a double click, `self.origin` answers `"null"`), and that is why it blocks those reads. Nothing else is needed: neither Node nor packages.

## The concepts

There are three. As in Lesson 7: before running each figure, **write in the logbook what you think is going to happen**.

### 8.1 The promise and `fetch` in two steps

**A promise is a result that has not arrived yet.** When you ask for something over the network, JavaScript does not stay waiting with its arms crossed: the page has to keep responding to clicks, to the mouse wheel, to the keyboard. That is why slow operations do not return their result, but an object that represents it: a **promise** (*Promise*). A promise is in one of three moments: **pending** (there is no result yet), **fulfilled** (a result arrived) or **rejected** (something failed). Once fulfilled or rejected, it no longer changes. The formal definition is in the [ECMAScript specification](https://tc39.es/ecma262/#sec-promise-objects); MDN's explanation of [how to use promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) is the clearest reading.

A comparison helps. When you order food at a counter and they give you a token with a number, the token is not the food: it is the promise that the food will arrive. While you wait you can sit down, chat or check your phone; you do not stay motionless in front of the counter. When they call your number, the token is “fulfilled” and you pick up the food; if the dish ran out, the token is “rejected” and they give you an explanation. And a token that has already been redeemed is not redeemed again. A JavaScript promise is that token.

With a promise you do the same thing as with an event: you tell it what to do when it happens. The `.then(function)` method registers “when you are fulfilled, run this with your result” and the `.catch(function)` method registers “if you are rejected, run this with the reason”. Each `.then` in turn returns another promise, and that is why they can be chained. There is a third, `.finally(function)`, which runs in both cases, whether it is fulfilled or rejected; it is useful for what has to be done no matter what happens, such as writing the result on the page.

**`fetch` needs two steps.** The `fetch(address)` function requests a resource over HTTP and returns a promise of a **response** (`Response`). But that promise is fulfilled as soon as the response **headers** arrive, not when all the content arrives. It is the same thing you see in the Network tab of the browser developer tools: first the status line (`200 OK`) and the headers arrive, and afterwards, little by little, the body. That is why there is a second step: `respuesta.json()` reads the body, interprets it as JSON, and returns **another promise** that is fulfilled with the resulting object. It is documented in [MDN: using `fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).

Why separate it like this and not deliver everything at once? Because with the headers you can already make decisions before spending time on the body: if the code says the file does not exist, there is no point in reading and parsing an error page as if it were data. And because the body can be enormous: a video or a file of several megabytes arrives in parts, and the program can decide how to read it. For the dashboard, the body is small, but the rule is the same.

**Predict:** figure 8.1 requests `panel/data/services.json` in two steps and writes three pieces of data about the response before reading the body. What do you think `ok` and the content type will say?

```html
<!-- fig08_01.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 8.1 — fetch en dos pasos</title>
</head>
<body>
  <main>
    <h1>Fig. 8.1 — fetch en dos pasos</h1>
    <pre id="output">Cargando…</pre>
  </main>

  <script type="module">
    const output = document.querySelector("#output");
    const lines = [];

    fetch("panel/data/services.json")                   // paso 1: llega la respuesta
      .then((response) => {
        lines.push(`estado HTTP: ${response.status}`);
        lines.push(`ok: ${response.ok}`);
        lines.push(`tipo de contenido: ${response.headers.get("content-type")}`);
        return response.json();                         // paso 2: se lee el cuerpo (otra promesa)
      })
      .then((services) => {
        lines.push(`servicios recibidos: ${services.length}`);
        lines.push(`el primero: ${services[0].name}`);
        output.textContent = lines.join("\n");
      });
  </script>
</body>
</html>
```

```text
estado HTTP: 200
ok: true
tipo de contenido: application/json
servicios recibidos: 5
el primero: Catálogo
```

Stop at each piece, because you will need them all:

- **`response.status`** is the HTTP code from Lesson 0: 200 is “here it is”, 404 is “that does not exist”, 500 is “the server broke”.
- **`response.ok`** is a convenience: it is `true` when the code is between 200 and 299. You will use it all the time, for the reason that follows.
- **`response.headers.get("content-type")`** says what type of content the server declared. Here `application/json`: the local server deduces it from the `.json` extension.
- The **first `.then`** ends with `return response.json()`. That `return` is what chains the two steps: the second `.then` already receives the array of services, not the promise.

**A 404 is not a failure for `fetch`.** This is the point of the lesson with the most consequences, and almost nobody expects it. Think about how the promise should behave if you request a file that does not exist. Many people assume it is rejected, because “something went wrong”. **Predict** what figure 8.2 does, which requests `missing.json`, a file that does not exist: does the `.then` run or the `.catch`?

```html
<!-- fig08_02.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 8.2 — un 404 no rechaza la promesa</title>
</head>
<body>
  <main>
    <h1>Fig. 8.2 — un 404 no rechaza la promesa</h1>
    <pre id="output">Cargando…</pre>
  </main>

  <script type="module">
    const output = document.querySelector("#output");
    const lines = [];

    fetch("missing.json")
      .then((response) => {
        lines.push("la promesa SE CUMPLIÓ (no se rechazó)");
        lines.push(`estado HTTP: ${response.status}`);
        lines.push(`ok: ${response.ok}`);
      })
      .catch((error) => {
        lines.push(`la promesa se rechazó: ${error.message}`);   // esto NO se ejecuta con un 404
      })
      .finally(() => {
        output.textContent = lines.join("\n");
      });
  </script>
</body>
</html>
```

```text
la promesa SE CUMPLIÓ (no se rechazó)
estado HTTP: 404
ok: false
```

The promise **was fulfilled**. From `fetch`'s point of view, the server answered (it said “I did not find that”) and the communication went fine; `ok` is `false` and the `status` is 404, but the `.catch` did not run. If your code does `fetch(url).then(r => r.json())` without looking at `ok`, a 404 or a 500 is treated as good data. Then it fails further on, far from the cause, with a baffling message (you will see it in “The error you will see”). The rule is: **the promise is rejected when there is no response the page can use —none arrived, or one arrived but the browser does not let it be read, as happens with CORS—; any readable response, even an error, fulfills it**.

The complete list, so you do not forget. You will provoke the last rows in Lesson 9; they are here because the table is only useful when complete:

| Situation | `fetch`'s promise | How you detect it |
|---|---|---|
| A 200 to 299 response arrives | is fulfilled | `response.ok === true` |
| A 404, 500 or other error code response arrives | **is fulfilled** | `response.ok === false` |
| No connection, the server does not exist or is off | is rejected with `TypeError` | `catch` |
| The browser blocks the read because of CORS | is rejected with `TypeError` | `catch` |
| The time limit runs out **before** the headers arrive | is rejected with `TimeoutError` | `catch` and `error.name` |

Observe that two rows of the table produce the same `TypeError`. It is not an oversight: from the page's code you **cannot tell apart** a lack of connection from a CORS block, partly on purpose: that way a foreign page does not obtain information about the visitor's network. The explanation of what happened is in the console, and you will read it in Lesson 9.

### 8.2 `async`, `await` and the `try` around the request

**The same program, written in a straight line.** Chaining `.then` works, but a program with three or four steps and error handling becomes a staircase of functions inside functions. In 2017, JavaScript added a syntax to write the same thing as if the code really waited: `async` and `await`. It is nothing else: **it is the same promise in another form**. It is applied like this:

- A function marked **`async`** always returns a promise. What the function `return`s is the value with which that promise is fulfilled, and if the function throws an error, the promise is rejected.
- Inside it, **`await promise`** pauses *that function* (not the page) until the promise is fulfilled, and hands over its result. If the promise is rejected, `await` throws the error as an exception, which is caught with the usual `try`/`catch`.
- Outside an `async` function, `await` can only be used at the top level of a **module**, which is the case of the `<script type="module">` in this lesson's figures. (It is another advantage of modules.) It is documented in [MDN: `async function`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) and [`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await).

Go back to the counter token: `await` is saying “I will wait here until my number is called”. The difference from real life is that the one who waits is **only that function**; the rest of the page keeps working. That is why `await` freezes nothing: the browser sets the paused function aside, handles everything else and resumes it right at that line when the promise is fulfilled.

In the figure that follows, three pieces that Lesson 6 presented in “Deciding, repeating and signaling an error” reappear: `if (condition) { … }`, which runs a block only when the condition is true; `throw new Error("text")`, which creates an error object with that message (`new` is what manufactures a new object from a mold, here `Error`) and **throws** it, that is, interrupts the function at that line; and `try { … } catch (error) { … }`, which tries the first block and, if something is thrown inside it, jumps to the second with the error in hand. If any of the three does not ring a bell, go back to that section before continuing: they are used all the time here.

Figure 8.3 is the same `fetch` as in 8.1, now in a straight line, with the `ok` check that was missing, and tested against the good file and against the one that does not exist. **Predict** what it will say for each:

```html
<!-- fig08_03.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 8.3 — async y await, con la revisión de ok</title>
</head>
<body>
  <main>
    <h1>Fig. 8.3 — async y await, con la revisión de ok</h1>
    <pre id="output">Cargando…</pre>
  </main>

  <script type="module">
    const output = document.querySelector("#output");

    async function requestServices(url) {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`El servidor respondió con el código ${response.status}.`);
      }
      return await response.json();
    }

    async function tryUrl(url) {
      try {
        const services = await requestServices(url);
        return `${url}: llegaron ${services.length} servicios`;
      } catch (error) {
        return `${url}: falló — ${error.message}`;
      }
    }

    const results = [await tryUrl("panel/data/services.json"), await tryUrl("missing.json")];
    output.textContent = results.join("\n");
  </script>
</body>
</html>
```

```text
panel/data/services.json: llegaron 5 servicios
missing.json: falló — El servidor respondió con el código 404.
```

Compare with figure 8.1 and notice three changes: the nested functions disappeared; step 1 and step 2 look like two lines with `await`; and `if (!response.ok) throw new Error(...)` appeared, which turns an error response into a real error, and so the `catch` of whoever calls it treats it like any other failure. **That `if` is the most important line of the lesson.** If you are only going to remember one, let it be this one.

Also read how the work is divided between the two functions. `requestServices` does not decide what to do about a failure: it only **announces** it, throwing an error with a clear message. `tryUrl` is the one that decides: it catches the error and turns it into a line of text. It is the same division you will use in the dashboard: the module that requests the data announces; whoever calls it decides what to do.

And a caution that does produce real errors: forgetting the `await`. `const services = requestServices(url)` without `await` does not give you the services, it gives you the *promise* of the services; if you print it you will see `Promise { <pending> }` and if you use it as an array, nothing works. There is no error when you forget it, only an absurd result.

**In what order things happen.** An `async` function does not pause when called: it runs normally, line by line, **until the first `await`**. There it sets itself aside, and whoever called it carries on with its next line. When the promise is fulfilled, the function continues from that `await`. This explains something that confuses many people at first: the code written *after* calling an `async` function can run *before* the code written *inside* it, after its `await`. Exercise 3 asks you to predict that order; do it calmly, because understanding it saves you hours of debugging.

### 8.3 The dashboard requests its data

With the above you can now change the dashboard. There are five files, and it is worth seeing the complete plan first, before the code:

| File | What changes | Why |
|---|---|---|
| `js/services.js` | disappears | the data now lives in `data/services.json` |
| `js/load.js` | is new | requests the data and returns an array, or throws an error |
| `js/state.js` | the state starts without services and remembers when they arrived | when the page opens there is no data yet |
| `js/view.js` | writes the time of the “Última revisión” | the time stops being written by hand |
| `index.html` | two new `id`s | so that the code finds the time and the “Revisar ahora” button |
| `js/main.js` | requests the data on startup and with “Revisar ahora” | it is the one that puts the pieces together |

`js/stats.js` and `css/styles.css` do not change. That the biggest change to the dashboard so far leaves the calculations and the look intact is the reward for having separated the responsibilities in Lesson 7.

**Step 1: the module that requests the data.** The new module, `js/load.js`, is written with one rule: **it does not touch the document**. It requests the data and returns an array, or throws an error with a message. It does not know whether there is a table, a notice or a person looking; how to show it is decided by another file. It is the same split as in figure 8.3: `requestServices` announced and `tryUrl` decided.

Before the code, one new tool and two familiar ones. At the end there is a small function, `isService`, that uses two tools from Lesson 6 —`typeof`, which says what type a value is, and `every`, which asks whether **all** the elements of an array meet a condition— and a new one, `Number.isFinite(value)`, which is true only for a real number (not for the text `"120"`, nor for `NaN`, nor for `Infinity`).

```js
// panel/js/load.js
// Pide la lista de servicios y devuelve un arreglo, o lanza un Error.
// No toca el documento.

export async function loadServices(url) {
  // Paso 1: la respuesta.
  const response = await fetch(url);

  // fetch NO rechaza con un 404 o un 500: hay que mirarlo.
  if (!response.ok) {
    throw new Error(`El servidor respondió con el código ${response.status}.`);
  }

  // Paso 2: el cuerpo, leído como JSON.
  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("La respuesta no es una lista de servicios.");
  }
  if (!data.every(isService)) {
    throw new Error("Algún servicio de la lista llegó incompleto o con datos de otro tipo.");
  }
  return data;
}

// Un servicio, tal como lo entiende el panel: un objeto (no null) con sus cuatro claves,
// cada una del tipo que el resto del código espera.
function isService(item) {
  return typeof item === "object" && item !== null &&
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.status === "string" &&
    (item.responseMs === null || Number.isFinite(item.responseMs));
}
```

Read the code with these questions:

- **Where are the two steps?** In the two lines with `await`: `await fetch(url)` brings the response and `await response.json()` reads its body. Between the two is the `ok` check, in the only place where it makes sense: with the response in hand and before spending time on the body.
- **Why is there no `try` here?** Because this module decides nothing about failures: if `fetch` is rejected or `json()` cannot read the body, the error goes on its way to whoever called `loadServices`, who is the one who knows what to do. A `try` that catches an error only to throw it again the same adds nothing. In Lesson 9 this file will have a `try`, because there each failure will be **translated** into a different sentence.
- **What do `Array.isArray` and `isService` do?** They check the shape of a piece of outside data before letting it through. `Array.isArray` checks that what arrived is a list; `data.every(isService)` checks that **each** element is an object with a text `id`, `name` and `status`, and `responseMs` a number or `null`. The second check is not an ornament. A file with `[null]` is perfectly valid JSON and is an array; without it, that `null` would reach `summarize`, which would try to read `service.status` of `null`, and the program would stop with a `TypeError` far from the cause. The same with a `"responseMs": "120"` written between quotation marks: the average would add up texts. A more complete validation —allowed values, ranges, extra keys, messages that say *which* element failed— is the subject of Lesson 6 of the [TypeScript course](https://www.habil.mx/en/courses/typescript/). And the other defense is still standing: the dashboard draws everything with `textContent` and the badge uses a closed list, so a strange text looks strange, but executes nothing.

**Step 2: the state starts empty.** In Lesson 7, `createState(services)` received the services, because they were already there at startup. Now they are not: when the page opens there are none yet, they have to be requested. So `createState()` no longer receives anything and starts with an empty list, and a function appears, `loadSucceeded`, that stores what arrived. It also stores a new field, `checkedAt`: the **moment** the data arrived, which is what the header is going to show. That moment is passed in by whoever loads, as a `Date` object (`new Date()` manufactures one with the current date and time). And it deselects the chosen service, because after a new check the list may be different and the chosen one may no longer exist.

```js
// panel/js/state.js
// El estado del panel y las únicas formas de cambiarlo.
// No toca el documento: por eso se puede probar sin pantalla.

export function createState() {
  return {
    services: [],           // vacío al arrancar: los datos hay que pedirlos
    checkedAt: null,        // cuándo llegaron los datos por última vez (un Date), o null
    sortByTime: false,      // false = en el orden original; true = del más rápido al más lento
    selected: null,         // el id del servicio elegido, o null
  };
}

export function loadSucceeded(state, services, checkedAt) {
  state.services = services;
  state.checkedAt = checkedAt;
  state.selected = null;
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

The rest of the file is the one from Lesson 7 unchanged: sorting, choosing and calculating what is visible do not depend on where the data came from.

**Step 3: the view writes the time.** The view gains a function, `renderCheckedAt`, that creates a `<time>` element, like the one you wrote by hand in Lesson 2, with the data for machines in `dateTime` (`toISOString()` gives it in the format the standard asks for) and the text for people made by [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat), which in `es-MX` writes something like “7 de octubre de 2026 a las 12:03 p.m.” (October 7, 2026 at 12:03 p.m.). It is the same type of formatter that Lesson 6 used for numbers, now for dates. If nothing has arrived yet, `checkedAt` is `null` and the function does nothing: the header keeps “todavía no” (not yet), because an invented time, in a dashboard that really checks, would be a lie. The rest of `render` is the one from Lesson 7, with one more line at the beginning.

```js
// panel/js/view.js
// Dibuja el estado en el documento, con la hora en que llegaron los datos.
// Todo texto de los datos entra con textContent.
import { summarize } from "./stats.js";
import { visible, selectedService } from "./state.js";

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

// elements = { checkedAt, total, available, down, average, body, detail, sortButton }
export function render(state, elements) {
  const { services } = state;
  renderCheckedAt(state.checkedAt, elements.checkedAt);

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

**Step 4: the HTML gains two names.** It is the `index.html` from Lesson 7 with two changes: the header drops the hand-written time and carries in its place `<span id="checked-at">todavía no</span>`, and “Revisar ahora” gains the `id` that Lesson 2 announced, `check-now`. Without those `id`s, the code would have no way of finding those two elements.

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

        <p><button type="button" id="check-now">Revisar ahora</button></p>
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
    <p>Datos de ejemplo del archivo data/services.json.</p>
  </footer>
</body>
</html>
```

**Step 5: `main.js` requests the data.** It no longer imports `services.js`: it imports `loadServices` and calls a new function, `load`, on startup and every time someone presses “Revisar ahora”. Before reading it, a detail of writing that appears for the first time: `let services;` declares the variable **without a value**, outside the `try`, and inside the `try` it is assigned. It is needed this way because a variable declared inside a `{ … }` block only exists inside that block, and `services` is needed afterwards, outside it.

```js
// panel/js/main.js
// Junta las piezas: pide los datos, guarda el resultado en el estado y dibuja.
import { loadServices } from "./load.js";
import { createState, loadSucceeded, toggleSort, select } from "./state.js";
import { render } from "./view.js";

const elements = {
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
  let services;
  try {
    services = await loadServices("data/services.json");
  } catch (error) {
    // Por ahora la falla solo queda en la consola. La lección 9 la lleva a la pantalla.
    console.error(`No se pudieron cargar los servicios: ${error.message}`);
    return;
  }
  loadSucceeded(state, services, new Date());
  render(state, elements);
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

// Delegación: un solo oyente en el <tbody> atiende los botones de todas las filas.
elements.body.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-id]");
  if (button === null) return;
  update(() => select(state, button.dataset.id));
});

load();
```

The `load` function has three parts, and the order matters:

1. **It tries** to request the data, inside a `try`.
2. If it fails, it **announces** it in the console with `console.error` and ends with `return`. The table stays as it was.
3. If it went well, it **stores** into the state and **draws**.

Notice that the `try` wraps **only the request**, not the drawing. If the drawing had a programming error, we do not want the `catch` to catch it and disguise it as “the services could not be loaded”: we want to see it in the console as it is, with its file and its line. A `try` as big as the whole function hides errors that have nothing to do with the network.

And be honest about what this dashboard still does not do: if the request fails, the person sees nothing. The table stays empty, the summary too, and the only clue is in the console, which nobody but the programmer opens. While it loads, no notice is visible either. It is a dashboard that works on the happy path and that **detects** failures, but does not yet **tell** them. Telling them well —loading, error and empty, each with its notice and announced to a screen reader— is the work of Lesson 9, and this separation lets you see clearly what each part adds.

**How you check it.** With the server running, open `http://127.0.0.1:8000/08-traer-datos/panel/`. The summary must say 5, 4 of 5, 1 and 465 ms, as in Lesson 7, and the header, the date and time of this moment. Press “Ordenar por tiempo de respuesta” and choose a service: everything works the same as before, because those parts did not change. Press “Revisar ahora” with the keyboard: the header's time is written again and focus stays on the button, because the button never disappears. It was checked this way in Chrome 154, also with the window at 320 px, where the page does not overflow.

Now provoke a failure, to see what the dashboard does with it. In `js/main.js`, temporarily change `"data/services.json"` to `"data/missing.json"` and reload. The table and the summary stay empty, the header still says “todavía no”, and Chrome's console shows two red lines: the browser's, `Failed to load resource: the server responded with a status of 404 (File not found)`, and yours, `No se pudieron cargar los servicios: El servidor respondió con el código 404.` (The services could not be loaded: The server responded with code 404.). The first is written by the browser on its own for any error response; the second is the one your `catch` wrote. Undo the change when you finish.

## The error you will see

**`Unexpected token '<'`.** It is the consequence of forgetting `ok` or of pointing to a wrong address that, besides, does not answer with an error but with a page. Figure 8.4 requests an HTML page and reads it as if it were JSON:

```html
<!-- fig08_04.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 8.4 — leer como JSON algo que no lo es</title>
</head>
<body>
  <main>
    <h1>Fig. 8.4 — leer como JSON algo que no lo es</h1>
    <pre id="output">Cargando…</pre>
  </main>

  <script type="module">
    const output = document.querySelector("#output");

    const response = await fetch("fig08_01.html");   // existe, responde 200... pero es una página
    output.textContent = `código: ${response.status}, ok: ${response.ok}\ntipo: ${response.headers.get("content-type")}`;
    try {
      await response.json();
    } catch (error) {
      output.textContent += `\n${error.name}: ${error.message}`;
    }
  </script>
</body>
</html>
```

```text
código: 200, ok: true
tipo: text/html
SyntaxError: Unexpected token '<', "<!-- fig08"... is not valid JSON
```

(The third line is Chrome's message; Firefox says something like “JSON.parse: unexpected character at line 1 column 1”, but the name, `SyntaxError`, is the same.) Read it calmly: the server answered **200**, `ok` is `true`, and there was no connection problem. The failure is in the content: the declared type is `text/html`, and `.json()` ran into, at the first character, the `<` that the page starts with (here, the one in the comment `<!-- fig08_01.html -->`; on another page it would be the one in `<!DOCTYPE html>`), which cannot appear in JSON. Between quotation marks, Chrome shows you the first characters of what arrived, and that is the best clue: if they start with `<`, a page arrived.

“Unexpected token '<'” is almost always the signature of “an HTML page reached me where I expected JSON”: a misspelled address, a server error page, or a redirect to the login screen. Check in the Network tab what really arrived: the code, the content type and, in the response view, the text. If you try it in the dashboard, changing the address in `main.js` to `"index.html"`, the console says `No se pudieron cargar los servicios: Unexpected token '<', "<!-- panel"... is not valid JSON`: the same error, now caught by your `catch`. It is a message for the programmer, not for whoever uses the dashboard; in Lesson 9 you will translate it into a sentence anyone can understand.

## What gets done wrong

- **Not checking `response.ok`.** It is the error of figure 8.2. A 404 or a 500 enters the program as if it were data, and the real failure appears far from the cause. The fix is the line `if (!response.ok) throw …`, always.
- **Leaving the `catch` empty.** `catch {}` makes any failure vanish without a trace: the dashboard simply shows nothing and nobody knows why. Every `catch` must do something visible: notify the person, or leave the detail in the console.
- **Wrapping everything in a single `try`.** If the `try` covers the request *and* the drawing, a programming error in the drawing presents itself as a network failure. The `try` goes around what can fail for outside causes, and nothing more.
- **Forgetting the `await`.** The value you get is a promise, not the result. If something shows `[object Promise]` on screen, this is it.
- **Mixing the request with the drawing.** A function that does `fetch` and at the same time builds rows cannot be tested or reused. `js/load.js` requests, `js/state.js` remembers, `js/view.js` draws.
- **Showing the data that arrived with `innerHTML`.** What comes from outside is outside data, even if it comes from your own server, because tomorrow that server may be another one. The principle from Lesson 7 remains in force unchanged.
- **Opening the dashboard with `file://`.** `fetch` cannot read local files from a page opened with a double click. If the console talks about CORS and the address starts with `file://`, that is the cause: serve the folder with `python3 -m http.server`.

## Exercises

### Exercise 1 — Figure 8.2, with `await`

Rewrite figure 8.2 with `await` and `try`/`catch` instead of `.then`, `.catch` and `.finally`. The page must show exactly the same three lines as the original. Before writing it, decide which part of the original code becomes the `try`, which the `catch` and what happens to the `.finally`.

### Exercise 2 — One message per type of problem

Today any error code produces “El servidor respondió con el código N.” (The server responded with code N.) Change it so that a 404 says “No se encontró la lista de servicios.” (The list of services was not found.) and a code of 500 or higher says “El servidor tuvo un problema (código N). Intenta de nuevo en un momento.” (The server had a problem (code N). Try again in a moment.) The other codes keep the current message. Decide in which file the change goes and why it touches neither `js/view.js` nor `js/state.js`.

### Exercise 3 — In what order?

Before running it, write in your logbook in what order the five lines this program writes will appear. Then save it as `order.html` in the `08-traer-datos/` folder of your copy of `programas/`, open it with the server running and compare.

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <link rel="icon" href="data:,">
  <title>¿En qué orden?</title>
</head>
<body>
  <pre id="output"></pre>
  <script type="module">
    const lines = [];

    async function countServices() {
      lines.push("1: dentro de la función, antes del await");
      const response = await fetch("panel/data/services.json");
      const services = await response.json();
      lines.push("2: dentro de la función, después del await");
      return services.length;
    }

    lines.push("A: antes de llamar");
    const pending = countServices();
    lines.push("B: después de llamar, sin await");
    const count = await pending;
    lines.push(`C: llegaron ${count}`);

    document.querySelector("#output").textContent = lines.join("\n");
  </script>
</body>
</html>
```

## Solutions

### Solution 1

The `.then` becomes the body of the `try`, the `.catch` the `catch`, and the `.finally` the line that follows the `try`/`catch`, which runs in both cases because neither of the two blocks ends the function:

```html
  <script type="module">
    const output = document.querySelector("#output");
    const lines = [];

    try {
      const response = await fetch("missing.json");
      lines.push("la promesa SE CUMPLIÓ (no se rechazó)");
      lines.push(`estado HTTP: ${response.status}`);
      lines.push(`ok: ${response.ok}`);
    } catch (error) {
      lines.push(`la promesa se rechazó: ${error.message}`);   // esto NO se ejecuta con un 404
    }
    output.textContent = lines.join("\n");
  </script>
```

With the rest of the page equal to figure 8.2, Chrome shows the same three lines: `la promesa SE CUMPLIÓ (no se rechazó)` (the promise WAS FULFILLED (it was not rejected)), `estado HTTP: 404` (HTTP status: 404) and `ok: false`. The `await` does not change the rule: a 404 fulfills the promise, and that is why the `catch` does not run even though “something went wrong”.

### Solution 2

It goes in `js/load.js`, because that is where a technical result is translated into a sentence; `js/view.js` only draws what it receives and `js/state.js` only stores it. The `throw` of the `if (!response.ok)` is changed and a function is added at the end of the file:

```js
  if (!response.ok) {
    throw new Error(statusMessage(response.status));
  }
```

```js
// Un mensaje distinto según de quién es el problema.
function statusMessage(code) {
  if (code === 404) return "No se encontró la lista de servicios.";
  if (code >= 500) return `El servidor tuvo un problema (código ${code}). Intenta de nuevo en un momento.`;
  return `El servidor respondió con el código ${code}.`;
}
```

To check it, temporarily change the address in `js/main.js` to `"data/missing.json"`: the console now says `No se pudieron cargar los servicios: No se encontró la lista de servicios.`. The course's static server cannot produce a 500, so that branch is checked with a trick: temporarily change `code === 404` to `code === 999` and `code >= 500` to `code >= 400`, reload and “El servidor tuvo un problema (código 404)…” should appear. Undo both changes when you finish. For now the message is only read in the console; in Lesson 9 it will appear on the screen without your having to touch this file.

### Solution 3

The order is A, 1, B, 2, C:

```text
A: antes de llamar
1: dentro de la función, antes del await
B: después de llamar, sin await
2: dentro de la función, después del await
C: llegaron 5
```

“A” goes first because it is the first line that runs. When `countServices` is called, the function **starts running immediately** and writes “1”; on reaching the first `await` it sets itself aside and hands back to whoever called it a pending promise. That is why “B” comes out before “2”: the main program carried on with its next line while the request was traveling. When the main program reaches `await pending`, it sets itself aside too; the request finishes, the function continues and writes “2”, its promise is fulfilled with 5, and the main program continues and writes “C”. That is how Chrome 154 shows it. If you predicted A, B, 1, 2, C, you thought the function does not start until someone awaits it; if you predicted A, 1, 2, B, C, you thought `await` freezes the whole program. Both mistakes are common, and that is why it is worth seeing it once.

## How I know I got it

- [ ] With the repository's `programas/` folder served on your computer, `08-traer-datos/fig08_01.html` shows `ok: true` and `servicios recibidos: 5` (services received: 5); `fig08_02.html` shows `ok: false` and `estado HTTP: 404` without the `.catch` running.
- [ ] `fig08_03.html` shows one line that arrived fine and one that failed with code 404.
- [ ] In your dashboard, the summary says 5, 4 of 5, 1 and 465 ms, the header says the date and time at which the data arrived, and `js/services.js` no longer exists.
- [ ] When you press “Revisar ahora”, the header's time is written again and focus stays on the button.
- [ ] With the address changed to `data/missing.json`, the console shows your message with code 404, and nothing else breaks.
- [ ] Sorting and choosing a service work the same as in Lesson 7.
- [ ] You search for `innerHTML` in your `.js` files and it does not appear.

**Review of earlier lessons** (answer them without looking, and then check):

1. In Lesson 0: which two things travel in an HTTP response before the content, and which of them is the 404 code?
2. In Lesson 6: what does `averageResponseMs` return when no service has a measurement, and why `null` and not zero?
3. In Lesson 7: why does `js/view.js` use `textContent` and not `innerHTML` even though the data comes from your own server?

## Further reading

- [MDN — Using the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) — the `fetch` reference: `ok`, the body, the headers and the types of error; accessed on October 7, 2026.
- [MDN — How to use promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) — `.then`, `.catch` and chaining, step by step; accessed on October 7, 2026.
- [MDN — `async function`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) — what an `async` function returns and how `await` behaves inside it; accessed on October 7, 2026.
