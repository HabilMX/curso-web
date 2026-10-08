# Lesson 9 — When something fails: timeouts, states, CORS and several requests

**Time:** 2 × 45 min

**What you build:** the dashboard that always says what is happening: loading, error or empty, with a time limit so as not to wait forever

**What you learn:** timeout with `AbortSignal.timeout`; telling failures apart by their name; the three states: loading, error and empty; the CORS error; several requests at once with `Promise.allSettled`

## By the end you will be able to

- Put a time limit on each request and tell apart in the code a timeout from a connection failure and from a response that is not JSON.
- Translate each technical failure into a sentence that the person using the dashboard can understand.
- Show in the dashboard the three situations that are not “everything went well”: loading, error and empty, each with its notice and its way of being announced to a screen reader.
- Explain why “empty” is not an error and why it is not stored as one more phase, but deduced.
- Recognize the CORS error in the console, explain who produces it and who fixes it.
- Request several things at once without one failure taking away the result of the others, with `Promise.allSettled`.

## The why before the how

**Starting point.** This lesson starts from the dashboard as Lesson 8 left it. Your dashboard already requests its data from `data/services.json`, and the structure that remained is this:

- `index.html`, with the `<tbody>` and the four `<dd>` of the summary empty, the time in `#checked-at`, the `#check-now` button (“Revisar ahora”, Check now), the “Ordenar por tiempo de respuesta” (Sort by response time) button and the detail region (`#detail`).
- `css/styles.css`, the stylesheet from lessons 3, 4, 5 and 7.
- `data/services.json`, with the five services.
- `js/load.js`, which requests the data in two steps, checks `response.ok` and the shape of what arrived, and throws an error if something does not add up.
- `js/stats.js`, with `summarize` and the two calculations from Lesson 6.
- `js/state.js`, with the list, the arrival time, the order and the selection, and `loadSucceeded` to store what arrived.
- `js/view.js`, which draws the state and the time, always with `textContent`.
- `js/main.js`, which requests the data on startup and with “Revisar ahora”, and leaves any failure in the console.

And a new file for today, `data/services-empty.json`, the sibling of the list for the empty case:

```json
[]
```

A list with no elements, which is valid JSON: the server will deliver it with a 200, and it will be the dashboard that decides what it means.

**What the dashboard is missing today.** The Lesson 8 dashboard works when everything goes well, and it **detects** failures, but it does not tell them: it leaves them in the console, which nobody but the programmer opens. A real report lives in a world where things happen that never happen to a local module:

1. **It takes time.** Between the page appearing and the data arriving there is an interval, which can be milliseconds or seconds. What does the person see in the meantime? An empty table looks like a broken dashboard.
2. **It fails.** The server may be off, the file may have been moved, the connection may drop. What does the person see then? Today, nothing: the page looks frozen.
3. **It arrives empty.** The server answers fine, but the list has no services. It is not a failure, but it is not a table either. What does the person see?
4. **It does not answer.** The server receives the request and never responds. `fetch`'s promise stays pending forever, neither fulfilled nor rejected, and there is not even an error to catch.

A finished dashboard shows **the first three** situations as different screens, and turns the fourth into an error with a time limit. It is the fourth of the five criteria by which you know you have finished the course: *it shows the three states, loading, error and empty*. This lesson leaves it fulfilled for you.

**Why it matters so much.** Most tutorials teach the happy path and stop there, because it is what looks good in a demo. But whoever uses a services dashboard opens it precisely when they suspect something is wrong. If at that moment the page stays blank, or says “no services” because the network failed, the person makes a bad decision: waits when they should act, or calms down when they should worry. A dashboard that lies about its failures is worse than having no dashboard. That is why this lesson is, for whoever uses the `revisor`, the most important of the course.

**The route it follows.** First the **time limit**, so that a request does not wait forever, and the `js/load.js` module in its complete version, which tells each failure apart by its name and translates it into a sentence. Second **the three states** on screen, which is the part people see and almost nobody teaches. Third, **several requests at once**, which the `revisor` will need when it checks many services. And at the end, the error that sooner or later anyone who requests data from another place runs into: **CORS**.

**What you need running.** Only the usual local server (and, for the last figure, a second server that you will start right there). This lesson's pages are in [`programas/09-cuando-algo-falla/`](https://github.com/HabilMX/curso-web/tree/main/programas/09-cuando-algo-falla) of the [course repository](https://github.com/HabilMX/curso-web); with the repository downloaded onto your computer, start the server from its `programas/` folder:

```bash
cd programas
python3 -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000/09-cuando-algo-falla/panel/`. As in Lesson 8, `fetch` and modules do not work with `file://`. Nothing else is needed: neither Node nor packages.

## The concepts

There are three. As in the earlier lessons: before running each figure, **write in the logbook what you think is going to happen**.

### 9.1 Not waiting forever: the time limit

**The problem.** Remember the table in 8.1: `fetch`'s promise is fulfilled when a response arrives and rejected when there is no connection. But there is a third way for a request to go wrong, and it is the cruelest because it produces no error: **nothing happens**. The server does not answer, the network is hung, and the promise stays pending, neither fulfilled nor rejected. A dashboard without a time limit stays with “Cargando…” (Loading…) forever; the person does not know whether to wait, reload or give up. The solution is to decide how long you are willing to wait and cut off there.

The mechanism is an **abort signal**. `fetch` accepts a `signal` in its options, and if that signal is “activated” before the request ends, `fetch` aborts it and its promise is rejected. For the time limit case there is a ready-made piece: `AbortSignal.timeout(milliseconds)` creates a signal that activates by itself when that time passes, and the error with which it is rejected is called `TimeoutError` ([MDN: `AbortSignal.timeout`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static)). It is used like this: `fetch(url, { signal: AbortSignal.timeout(3000) })`. `fetch`'s second argument is an options object, like the ones you met in Lesson 6; `signal` is one of its keys.

It is a relatively recent function: it has been available in the main browsers since April 2024, and MDN labels it “Baseline 2024”. It completes the thirty months that separate “newly available” from “widely available” right around these dates, so if it does not appear in your browser, update it. Before it, it was written by hand with an `AbortController` and a `setTimeout`; that is no longer necessary.

To see the error you need a server that really takes time, and the `python3 -m http.server` one answers in a couple of milliseconds. That is why this lesson brings one of its own, `slow-server.py`: it serves the folder just like the usual one, but if the address carries `?delay=3000`, it waits those three thousand milliseconds before answering. It needs no installation; it uses only the library that comes with Python. Turn off the usual server (Ctrl+C) and, from the `programas/` folder, start this one in its place, on the same port:

```bash
python3 09-cuando-algo-falla/slow-server.py
```

It serves the same pages at `http://127.0.0.1:8000/`, so everything else works the same. This is its code; you do not have to write it, but it is worth reading, because it is short and you already know almost everything it does:

```python
# slow-server.py
# Sirve una carpeta como lo hace `python3 -m http.server`, pero puede tardar a
# propósito: si la dirección lleva ?delay=MILISEGUNDOS, espera ese tiempo antes de
# contestar. Sirve para ver un tiempo límite que de verdad se agota.
#
# Uso:  python3 slow-server.py [carpeta] [puerto]
import sys
import time
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlsplit

# Nadie necesita esperar más de diez segundos para ver el efecto.
MAX_DELAY_MS = 10000


class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        query = parse_qs(urlsplit(self.path).query)
        delay = query.get("delay", ["0"])[0]
        if delay.isdigit():
            time.sleep(min(int(delay), MAX_DELAY_MS) / 1000)
        try:
            super().do_GET()
        except (BrokenPipeError, ConnectionResetError):
            # El navegador se cansó de esperar y cerró la conexión: es justo lo que se quería ver.
            pass


def main():
    folder = sys.argv[1] if len(sys.argv) > 1 else "."
    port = int(sys.argv[2]) if len(sys.argv) > 2 else 8000
    server = ThreadingHTTPServer(
        ("127.0.0.1", port), partial(Handler, directory=folder)
    )
    print(f"Sirviendo {folder} en http://127.0.0.1:{port}, con ?delay  (Ctrl+C para parar)", flush=True)
    server.serve_forever()


main()
```

The important part is in `do_GET`, the function that handles each request: it reads the number that comes after `delay=`, sleeps that long with `time.sleep` (which counts in seconds, which is why it divides by a thousand), and then answers like the usual server. The other two pieces: `ThreadingHTTPServer` handles each request separately, so that a sleeping request does not stop the others; and the final `except` silences the warning Python would give when the browser, tired of waiting, hangs up before receiving the response, which is exactly what you want to provoke. The rest (`?delay` is ignored if it is not a number, and it never waits more than ten seconds) is so that nobody uses it by mistake to hang your computer.

Figure 9.1 requests the data with `?delay=3000` and a limit of **one second**. The server takes three; the limit always wins, because the difference is not milliseconds but two whole seconds. When preparing this lesson it gave `TimeoutError` in 10 of 10 loads in Chrome 154, always one second after starting. And the control test, also 10 of 10: served with the usual `python3 -m http.server`, which does not understand `?delay` and answers right away, the same page says “alcanzó a responder: el límite no se cumplió” (it managed to respond: the limit was not reached). If you see that sentence, it is not an error in your code: it means you have the server that does not delay running.

```html
<!-- fig09_01.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 9.1 — el tiempo límite</title>
</head>
<body>
  <main>
    <h1>Fig. 9.1 — el tiempo límite</h1>
    <pre id="output">Cargando…</pre>
  </main>

  <script type="module">
    const output = document.querySelector("#output");

    try {
      // Un límite de 1 segundo para una respuesta que slow-server.py demora 3 (?delay=3000).
      // Con el servidor de siempre, ?delay se ignora y la respuesta llega a tiempo.
      await fetch("panel/data/services.json?delay=3000", { signal: AbortSignal.timeout(1000) });
      output.textContent = "alcanzó a responder: el límite no se cumplió";
    } catch (error) {
      output.textContent = `nombre del error: ${error.name}\nmensaje: ${error.message}`;
    }
  </script>
</body>
</html>
```

```text
nombre del error: TimeoutError
mensaje: signal timed out
```

The message, `signal timed out`, is Chrome's text; Firefox writes another, but the **name** of the error is the same in all browsers because the specification fixes it. That is why the code always asks for the name and never for the message. The error's name is `TimeoutError`. It is the way to tell apart in the code a “did not respond in time” from a “there is no connection” (`TypeError`). There is another similar name, `AbortError`, which appears when someone cancels on purpose with an `AbortController`; you do not use it today.

Two technical clarifications that cost dearly if you do not know them. The first: **the limit keeps running while the body is read.** If the server sends the headers immediately but stops halfway through the content, `fetch`'s promise is fulfilled, and it is `response.json()` that is rejected with `TimeoutError` on reaching the limit. It is the clarification that the last row of the table in 8.1 left pending: the timeout rejects `fetch`'s promise only if it occurs **before** the headers arrive; afterwards, the promise has already been fulfilled and cannot be “un-fulfilled”, so what is rejected is the reading of the body. In a test with a server that sent the beginning of an array and waited four seconds for the rest, with a limit of one second the headers arrived at 2 ms and the reading of the body was rejected with `TimeoutError` at 1005. That is why the dashboard's code checks for `TimeoutError` in **both** steps. The second: the one second in the figure is for the demonstration. In the dashboard, the limit is three seconds, which is enough for a bad connection and short enough that the person does not lose patience.

**The module that requests the data, complete.** In Lesson 8, `js/load.js` let errors through just as they came: the `TypeError` of a downed network, the `SyntaxError` of broken JSON. It served the programmer, who reads them in the console, but not whoever uses the dashboard, who needs a sentence they understand. Now the module **translates**: it catches each failure, looks at its name and throws in its place an error with a message for people. It keeps its usual rule: **it does not touch the document**. How to show it is decided by the view.

Before the code, two writing details that appear in it for the first time. The first: in `loadServices(url, timeoutMs = 3000)`, the `= 3000` is a **default value** for the parameter; if the caller does not pass the second argument, `timeoutMs` is 3000. The second: `let response;` and `let data;` declare the variables **without a value** outside each `try`, and inside the `try` they are assigned, the same trick that `main.js` used in Lesson 8 with `services`: a variable declared inside a `{ … }` block only exists inside that block.

```js
// panel/js/load.js
// Pide la lista de servicios y devuelve un arreglo, o lanza un Error con un mensaje
// que una persona pueda leer. No toca el documento.

export async function loadServices(url, timeoutMs = 3000) {
  // Paso 1: la respuesta. Aquí fallan la red, el tiempo límite y los estados HTTP.
  let response;
  try {
    response = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
  } catch (error) {
    if (error.name === "TimeoutError") {
      throw new Error(`El servidor no respondió en ${timeoutMs} ms.`);
    }
    throw new Error("No se pudo conectar con el servidor.");
  }

  // fetch NO rechaza con un 404 o un 500: hay que mirarlo.
  if (!response.ok) {
    throw new Error(`El servidor respondió con el código ${response.status}.`);
  }

  // Paso 2: el cuerpo. El límite de tiempo sigue corriendo mientras se lee.
  let data;
  try {
    data = await response.json();
  } catch (error) {
    if (error.name === "TimeoutError") {
      throw new Error(`El servidor no terminó de responder en ${timeoutMs} ms.`);
    }
    if (error.name === "SyntaxError") {
      throw new Error("La respuesta no es JSON válido.");
    }
    // Cualquier otra falla al leer el cuerpo: la conexión se cortó a medias o el cuerpo
    // no se pudo decodificar. Desde aquí no se sabe cuál de las dos fue.
    throw new Error("No se pudo leer completa la respuesta del servidor.");
  }

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

- **Why are there two `try`s?** Because they are two steps with two different kinds of failure. The first catches what happens before there is a response: there is no connection, or the time ran out. The second, what happens when reading the body, and there are three cases there that must not be confused. According to [MDN on `Response.json()`](https://developer.mozilla.org/en-US/docs/Web/API/Response/json), the read can be rejected with `SyntaxError` (the text is not JSON), with an abort error (here, the limit's `TimeoutError`) or with `TypeError`. The `TypeError` does not say just one thing: it may be that the connection was cut halfway or that the body could not be decoded (MDN gives the example of a wrong `Content-Encoding` header). From the code you cannot tell which of the two it was, so the message says only what is safe: “No se pudo leer completa la respuesta del servidor.” (The server's response could not be read in full.). That is why the second `catch` asks for the name: only a `SyntaxError` deserves the sentence “is not valid JSON”; saying it for a cut connection would send the person looking for an error in the file that does not exist.
- **Why are the messages ours and not the browser's `error.message`?** Because the browser's message is written for programmers, in English, and changes between Chrome and Firefox (“Failed to fetch”, “NetworkError when attempting to fetch resource”). Whoever uses the dashboard needs a sentence they understand. The technical detail, for whoever debugs, is already in the console.
- **What changed compared to Lesson 8?** The two `try`s, the time limit and the translation of the messages. The `ok` check, the `Array.isArray` one and the `isService` one are the same. Remember why the last one is there: a file with `[null]` is perfectly valid JSON and is an array; without `isService`, that `null` reached `summarize`, which tried to read `service.status` of `null`, and the program stopped with a `TypeError` *outside* any `try`: the dashboard was left with no notice, no table and no explanation. With the check, that case ends in the red notice “Algún servicio de la lista llegó incompleto o con datos de otro tipo.” (Some service in the list arrived incomplete or with data of another type.), which is what was checked in Chrome when preparing the lesson.

### 9.2 The three states: loading, error and empty

**What a phase is.** The Lesson 8 dashboard had a state with the list, the time, the order and the selection. Now it needs to know something more: **what moment of the loading it is in**. A field is added, `phase`, with three possible values:

- `"loading"`: it was requested and there is no result yet.
- `"error"`: it was requested and failed; `errorMessage` holds the text for the person.
- `"ready"`: a list arrived.

And now the finest design decision of the lesson. There remained a fourth situation, **“empty”**: the list arrived fine, but it has no services. Is it a fourth phase? No: it is a **consequence**. It does not have to be stored, it is *deduced* from what is already stored: `phase === "ready"` and `services.length === 0`. Storing two facts that can be deduced from each other is the recipe for them contradicting each other someday. The `situation` function makes the deduction in a single place, returns `"empty"` in that case, and the whole screen asks it.

A writing reminder before the code: `select` uses the **ternary operator**, `condition ? valueIfYes : valueIfNo`, which Lesson 6 presented in “Deciding, repeating and signaling an error”. It is an `if` that *returns a value* and so fits inside an assignment: `state.selected === id ? null : id` is `null` if the service was already chosen and `id` if not.

Compared with Lesson 8, three things change: `createState` gains two fields, `phase` (which starts at `"loading"`) and `errorMessage`; `loadSucceeded` also moves the phase to `"ready"`; and three functions appear, `startLoading`, `loadFailed` and `situation`. The rest stays the same.

```js
// panel/js/state.js
// El estado del panel y las únicas formas de cambiarlo.
// No toca el documento: por eso se puede probar sin pantalla.

export function createState() {
  return {
    phase: "loading",       // "loading" | "error" | "ready"
    services: [],
    errorMessage: null,     // texto para la persona, solo en la fase "error"
    checkedAt: null,        // cuándo llegaron los datos por última vez (un Date), o null
    sortByTime: false,      // false = en el orden original; true = del más rápido al más lento
    selected: null,         // el id del servicio elegido, o null
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

**Two things worth telling apart.** The first: an error and an empty list look alike from afar and are opposites. An error is “I could not find out”; an empty result is “I found out and there is nothing”. The first is offered **retrying**, because next time it may work. The second is also allowed to ask again, because a list that is empty today may have services in it in a minute; but without the red notice, because it is not a failure. A dashboard that says “error” when the list is empty lies, and one that says “no services” when the network failed lies worse, because the person concludes that everything is fine.

The second: the transitions are few and all written out. The dashboard starts in `"loading"`; from there it moves to `"ready"` or to `"error"`; and it goes back to `"loading"` only through an action by the person: “Reintentar” (Retry), from an error or from an empty list, or “Revisar ahora”, with the data in view. There is no other path. Having so few makes the code easy to reason about.

**Drawing the three situations, and announcing them.** The view already knew how to draw the table and the time. What is new is in `render`, which first asks `situation(state)` and shows one screen or another, and in a small function that comes out of it: `renderSummary`, which is what in Lesson 8 lived inside `render`. Notice how `render` is organized: at the start it decides which notices and which zones are visible, then the summary, and only if the situation is `"ready"` does it go on to the table.

Two pieces of writing worth recognizing before reading it. The first is a chain of ternaries: `a ? x : b ? y : z` reads “if `a`, `x`; if not, if `b`, `y`; if not, `z`”, and that way the notice chooses among three texts in a single expression. The second is [`Object.hasOwn(object, key)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn), which returns `true` only if the object has that key **written on itself**. It is needed because every JavaScript object inherits properties that nobody wrote, such as `constructor` or `toString`: `LABELS["toString"]` is not `undefined`, it is a function. With `Object.hasOwn(LABELS, status)`, a status that is neither `available` nor `down` is recognized as unknown, even if it is called `toString`. And a `for (const cell of [...])` goes through a list written right there, like any `for…of` from Lesson 6.

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

// elements = { notice, errorNotice, retry, dataZone, checkedAt,
//              total, available, down, average, body, detail, sortButton }
export function render(state, elements) {
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

  const chosen = selectedService(state);
  elements.detail.textContent = chosen === null ? "Elige un servicio para ver su detalle." : describe(chosen);
}
```

Two decisions in this file. The first, the summary: while it loads or when it fails, its four figures are left empty, because there is nothing to count; but in the empty case it says 0, 0 of 0, 0 and “sin datos” (no data), because zero services **is** a result, and the summary has to say the same as the notice. The second, as always: everything enters with `textContent`, including the error message, which is also a text that you did not write at that moment. The time is still written by `renderCheckedAt`, the one from Lesson 8: if a check fails, the header keeps the time of the last one that went well, which is just what the person needs to know. And a third, about “Reintentar”: it is shown with an error **and** with an empty list. “Revisar ahora” lives inside `#data-zone`, which in those two cases is hidden; without “Reintentar”, after an empty result there would be no button left to ask again, and the person would have to reload the page. For the same reason, when a load finishes `main.js` returns focus to “Revisar ahora” only if the table was left in view, and to “Reintentar” in the other two cases.

What is behind the HTML matters as much as the JavaScript, because here lives the accessibility of the states. It is the `index.html` from Lesson 8 with one change: the services section gains the notices, the “Reintentar” button and a zone, `#data-zone`, that wraps everything that only makes sense with data: the controls bar, the table and the detail.

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
      </div>
    </section>
  </main>

  <footer>
    <p>Datos de ejemplo del archivo data/services.json.</p>
  </footer>
</body>
</html>
```

- **Two notice regions, present from the start.** `#notice` has `role="status"` and `#error-notice` has `role="alert"`. They are **live regions**: when their text changes, a screen reader announces it. `status` does so politely, waiting for it to finish what it was saying; `alert` interrupts, and is reserved for what the person needs to know right now. That is why “Cargando” and “No hay servicios” go in the first and the failures in the second. The technical rule is that regions must **exist before their content changes**; if they are created with the message already inside, many readers do not announce it.
- **`Cargando servicios…` is already in the HTML.** Before the first byte of JavaScript runs, the person sees that something is happening. When `main.js` starts, it writes the same text again, which produces no visible change.
- **`hidden` for what does not apply.** The data zone and the “Reintentar” button are hidden with the `hidden` attribute, which takes them out of view **and** of the accessibility tree. That way a screen reader does not go through an empty table.
- **“Reintentar” is a real button**, and its listener is registered only once.

The stylesheet gains two blocks at the end of `css/styles.css`. The first reopens the `reset` layer for a single rule: what carries the `hidden` attribute is not seen, whatever any other rule says. It is the only `!important` in the stylesheet, and it goes in the first layer on purpose: among `!important` declarations, the order of the layers is inverted —the same inversion that Lesson 3 told about for the origins—, so in the first layer it beats all the others. It is not a patch to beat another rule; it is a guarantee: what is hidden stays hidden. The second block shapes the notices, and it has a trap worth looking at slowly. An empty notice should not draw a box with no text, so it has to be “turned off” while it is empty. The obvious way out, `display: none`, is exactly the wrong one: an element with `display: none` also leaves the accessibility tree, and then the live region ceases to exist for the screen reader until it receives text, which is exactly what the previous rule forbids. It was measured in Chrome 154: with `display: none`, the empty `#notice` and `#error-notice` did not appear in the accessibility tree; with the rule below, which only removes their margin, padding and border, they appear as `status` and `alert` and measure 0 px in height. They look the same (nothing) and stay watched.

```css
@layer reset {
  /* ---- Lección 9 ---- */
  /* Lo que lleva el atributo hidden no se ve, diga lo que diga otra regla. Entre
     declaraciones con !important el orden de las capas se invierte: en la primera
     capa, esta gana a todas. */
  [hidden] {
    display: none !important;
  }
}

@layer components {
  /* ---- Lección 9: los avisos de carga, error y vacío ---- */
  .notice {
    margin: var(--space-3) 0;
    padding: var(--space-2) var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
  }

  /* Un aviso vacío no ocupa lugar, pero NO se oculta con display: none, que lo sacaría
     del árbol de accesibilidad: la región tiene que seguir ahí, vigilada, antes de que
     llegue el primer mensaje. Basta con quitarle el borde, el relleno y el margen. */
  .notice:empty {
    margin: 0;
    padding: 0;
    border: 0;
  }

  .notice-error {
    border-color: var(--color-down-text);
    background: var(--color-down-bg);
    color: var(--color-down-text);
  }
}
```

The error notice uses the colors of the “Caído” (Down) badge, which Lesson 3 already measured: 7.08 to 1 contrast.

The last piece is `js/main.js`, which requests the data and stores the result in the state. Three tools appear in it for the first time, and it is worth knowing what they do before reading it:

- **`location.search`** is the part of the page's address that goes from the `?` sign: in `…/panel/?case=empty` it is `"?case=empty"`. [`new URLSearchParams(text)`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) splits it into name–value pairs, and `.get("case")` returns the value of `case`, or `null` if the address does not carry it.
- **`document.activeElement`** is the element that has focus at this moment: the button you have just pressed with the keyboard, the field where you type, or the `<body>` if nothing has it.
- **`?.`**, the optional chaining from Lesson 6: `document.activeElement?.dataset?.id` reads the `id` of the focused button if there is one, and gives `undefined` instead of stopping with an error if any of the steps does not exist. (The `update` function that uses it is the one from Lesson 7, unchanged.)

With that, the file:

```js
// panel/js/main.js
// Junta las piezas: pide los datos, guarda el resultado en el estado y dibuja.
import { loadServices } from "./load.js";
import { createState, startLoading, loadSucceeded, loadFailed, toggleSort, select, situation } from "./state.js";
import { render } from "./view.js";

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

load();
```

Two things in this file deserve explaining. The first is `load()`, which changed compared with Lesson 8: now it moves to `"loading"`, draws, tries, and in either of the two outcomes stores into the state and draws again. There is no longer a `console.error`: the failure has its place on the screen. The `try`/`catch` is still **only around the request**, not the drawing, for the same reason as in Lesson 8: if the drawing had a programming error, we do not want it disguised as “could not connect”; we want to see it in the console. And a lesson from 7 that returns: the button that asked for the load, “Revisar ahora” or “Reintentar”, is hidden while loading, and a hidden element loses focus, which falls on the `<body>`. That is why `load()` notes at the start whether focus was on one of those two buttons and, when it finishes, gives it back to the right one: “Reintentar” if it failed again, “Revisar ahora” if the data arrived. Without those lines, whoever uses the keyboard would have to go through the page from the top after every check.

The second is the `CASES` table. So that you can see each situation without breaking anything, the dashboard accepts in the address `?case=empty`, `?case=error`, `?case=invalid` or `?case=timeout`. Notice that the address text is **not used as the request's address**: it only chooses one option among five that we wrote. If the dashboard did `fetch(params.get("url"))`, anyone could send you a link that makes *your* dashboard request and draw whatever they want. `Object.hasOwn` prevents `?case=constructor` from finding an inherited value.

**Seeing the three states.** With the server running, open `…/09-cuando-algo-falla/panel/` and go through this route; they are your tests for the lesson:

| Address | What you should see |
|---|---|
| `panel/` | The table, the summary at 5, 4 of 5, 1 and 465 ms, and in the header the date and time at which the data arrived |
| `panel/?case=empty` | “No hay servicios que revisar.” (There are no services to check.), no table, with the “Reintentar” button to ask again; the summary at zero |
| `panel/?case=error` | “El servidor respondió con el código 404.” (The server responded with code 404.), with the “Reintentar” button |
| `panel/?case=invalid` | “La respuesta no es JSON válido.” (The response is not valid JSON.) (requests `index.html`, which is not JSON) |
| `panel/?case=timeout` | with `slow-server.py`: “Cargando servicios…” for three seconds and then “El servidor no respondió en 3000 ms.” (The server did not respond in 3000 ms.), with “Reintentar”. With the usual server, the normal table: nothing is slow |

For the **“loading”** state, which on your machine lasts milliseconds, there are two ways to see it. The simplest is `?case=timeout` with `slow-server.py` running: the notice stays for three seconds before changing to the error. The other, which works with any server, is the browser developer tools: open the **Network** tab, choose a slow speed profile (in Chrome, “3G”; in Firefox, “GPRS”; profile names change between versions), and reload; and with the “Offline” option (“Sin conexión” in a Spanish-language browser), press “Reintentar” after an error and you will see “No se pudo conectar con el servidor.” (Could not connect to the server.). Seeing each state with your own eyes is the part you learn the most from; do not skip it.

**The test that closes the section.** With `?case=error`, navigate with the keyboard alone to “Reintentar”, press Enter and observe that the notice does not disappear (it keeps failing, because the file still does not exist) and that focus stays on “Reintentar”. Do the same with “Revisar ahora” in the normal dashboard: the header's time changes and focus stays on the button. And a measurement you do not skip: with the window at 320 px, in all five cases, `document.documentElement.scrollWidth <= document.documentElement.clientWidth` must return `true`; I checked it and it returns `true` in all five, thanks to the scrolling box from Lesson 5 and the `position: relative` rule from Lesson 7. With a screen reader on (on Linux Mint, Orca is usually activated with `Super+Alt+S`), the red notice must be announced without you moving focus.

### 9.3 Several requests at once

**The problem.** The real `revisor` is going to check many services, and each one can respond, take time or fail on its own. When the requests do not depend on one another, you do not wait for one to launch the next: you launch them all and wait for the set. Requesting them one after another, with an `await` inside a loop, makes the check take the **sum** of all of them; launching them together makes it take as long as **the slowest one**.

**The two ways of waiting for a set.** `Promise.all(list)` receives a list of promises and returns a single one, which is fulfilled when all are fulfilled. But it **is rejected as soon as one fails**, and discards the result of the others, the opposite of what you want in a report where a service that is down is part of the result, not a reason to throw away the others. For that there is `Promise.allSettled`, which waits for all of them and returns for each one an object that says whether it was fulfilled (`status: "fulfilled"`, with its `value`) or rejected (`status: "rejected"`, with its `reason`). It is “Baseline” since July 2020 ([MDN: `allSettled`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)).

Before the figure, a writing detail: `urls.map(request)` applies the `request` function to each address and returns an array with what each call returns. Since `request` is `async`, each call returns a promise: the result is **an array of promises**, all already on their way, which is exactly what `allSettled` expects to receive. And in the final `map`, the second parameter, `i`, is the position of each result, which is useful for recovering the address that corresponds to it: `allSettled` returns the results **in the same order** in which it received the promises, regardless of which finished first. Figure 9.2 requests three files, one of them nonexistent:

```html
<!-- fig09_02.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 9.2 — varias peticiones a la vez con allSettled</title>
</head>
<body>
  <main>
    <h1>Fig. 9.2 — varias peticiones a la vez con allSettled</h1>
    <pre id="output">Cargando…</pre>
  </main>

  <script type="module">
    const output = document.querySelector("#output");

    async function request(url) {
      const response = await fetch(url, { signal: AbortSignal.timeout(3000) });
      if (!response.ok) throw new Error(`código ${response.status}`);
      return await response.json();
    }

    const urls = ["panel/data/services.json", "missing.json", "panel/data/services-empty.json"];
    const results = await Promise.allSettled(urls.map(request));

    output.textContent = results.map((result, i) =>
      result.status === "fulfilled"
        ? `${urls[i]}: bien, ${result.value.length} elementos`
        : `${urls[i]}: falló, ${result.reason.message}`
    ).join("\n");
  </script>
</body>
</html>
```

```text
panel/data/services.json: bien, 5 elementos
missing.json: falló, código 404
panel/data/services-empty.json: bien, 0 elementos
```

The missing file did not take the other two with it: each one brings its own outcome. Today's dashboard reads a single file and does not use it; you keep it for when the `revisor` asks each service for its own status, and then each row of the table can have its own “failed” without the rest of the dashboard noticing.

## The error you will see

**The CORS error.** It is the first one anyone who requests data from another place runs into. The dashboard requests a file from **its own** server, and so it does not see it; to provoke it, figure 9.3 requests the same file from *another* server.

```html
<!-- fig09_03.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 9.3 — pedir datos a otro origen</title>
</head>
<body>
  <main>
    <h1>Fig. 9.3 — pedir datos a otro origen</h1>
    <pre id="output">Cargando…</pre>
  </main>

  <script type="module">
    const output = document.querySelector("#output");
    output.textContent = `esta página vive en: ${location.origin}\nvoy a pedir a:        http://127.0.0.1:8001`;

    try {
      const response = await fetch("http://127.0.0.1:8001/data/services.json");
      output.textContent += `\nllegó con el código ${response.status}`;
    } catch (error) {
      output.textContent += `\nfetch falló: ${error.name}: ${error.message}`;
    }
  </script>
</body>
</html>
```

Start a second server from the dashboard folder, in another terminal and also inside the downloaded repository:

```bash
cd programas/09-cuando-algo-falla/panel
python3 -m http.server 8001 --bind 127.0.0.1
```

With the first server (the one on port 8000) still running, open `http://127.0.0.1:8000/09-cuando-algo-falla/fig09_03.html`. The page says:

```text
esta página vive en: http://127.0.0.1:8000
voy a pedir a:        http://127.0.0.1:8001
fetch falló: TypeError: Failed to fetch
```

(“Failed to fetch” is Chrome's message; the name, `TypeError`, is the same in all browsers.) And Chrome's console shows, in red:

```text
Access to fetch at 'http://127.0.0.1:8001/data/services.json' from origin 'http://127.0.0.1:8000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

(In Firefox the console says something else —it starts with “Cross-Origin Request Blocked”— and the error's message is “NetworkError when attempting to fetch resource.”, but the error your code receives is still called `TypeError`, as the [Fetch specification](https://fetch.spec.whatwg.org/#fetch-method) and the table in 8.1 say: the page would print `TypeError: NetworkError when attempting to fetch resource.`. It is the same problem.)

To understand it a definition is needed. A page's **origin** is the combination of three things: the scheme (`http`), the host (`127.0.0.1`) and the port (`8000`). Two addresses with a different port are different origins even if it is the same machine, and that is what happens here. The browser's **same-origin policy** says that a page can freely read what comes from its origin, and not what comes from another, unless that other allows it ([MDN: same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Same-origin_policy)). The way to allow it is called **CORS** (*cross-origin resource sharing*): the server that owns the data adds to its response the `Access-Control-Allow-Origin` header, with the origin to which it gives permission ([MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)).

Three ideas that correct the most common misunderstandings:

1. **The request did go out.** If you open the Network tab you will see the request and its response (this one, even, with a 200). What the browser **blocks is your code reading that response**. CORS does not protect the server, which has already received the request: it protects whoever uses the browser, from a foreign page reading things of theirs without permission.
2. **It is fixed on the server, not in your code.** There is nothing to write in the dashboard to get around the block. Whoever controls the server must add the header. If the server is not yours, you ask the owner; or the dashboard and the data are served from the same origin, as this course does.
3. **There are “solutions” that are not.** The extension that “disables CORS”, the public service that forwards requests, or `fetch`'s `mode: "no-cors"` option (which gives an “opaque” response that the code cannot read) make the error disappear from the console without solving anything: either they leave your browser unprotected, or they send the data of the people who use your dashboard to a third party. `mode: "no-cors"` is the worst, because it looks like it works.

And a consequence for the dashboard: if someday the `revisor` requested its data from another origin without permission, the person would see “No se pudo conectar con el servidor.”, because from the code a CORS block is indistinguishable from a downed network. The sentence is true from where the person sees it: the dashboard could not obtain the data. The exact cause is in the console, for whoever debugs.

Close the second server with `Ctrl+C` when you finish.

## What gets done wrong

- **A request without a time limit.** A server that does not answer leaves the page at “Cargando…” forever, which is worse than an error because it does not say what to do. `AbortSignal.timeout` costs one line.
- **Asking for the message instead of the name.** `error.message` changes between browsers and versions; `error.name` (`TimeoutError`, `TypeError`, `SyntaxError`) is fixed by the specification. The code decides by the name.
- **A dashboard that only knows the happy case.** If the table is the only thing the code knows how to draw, a failure looks like a blank page. The three states are not an ornament: they are part of the product.
- **Treating empty as an error, or the error as empty.** The person is offered different things, and confusing them makes them decide badly.
- **Creating the live region with the message already inside, or hiding it with `display: none`.** In both cases the screen reader announces nothing. The region exists from the start, empty, and only its text changes.
- **Showing the error message or the data that arrived with `innerHTML`.** What comes from outside is outside data, even if it comes from your own server, because tomorrow that server may be another one. The principle from Lesson 7 remains in force unchanged.
- **Using `await` inside a loop for independent requests.** `for (const url of urls) { await fetch(url) }` makes one request, waits, makes the next, waits: it takes the sum of all of them. All are launched at once and the set is awaited with `Promise.allSettled`.
- **Using the browser's address as the request's address.** An address that comes from the browser bar is outside data. You choose among options that you wrote, as the `CASES` table does.
- **“Fixing” CORS from the page.** Neither `mode: "no-cors"` nor an extension solves it; it is fixed by the server that gives the data.

## Exercises

### Exercise 1 — The five cases and who produces them

Open the dashboard with each of the five cases in the 9.2 table and with the “Offline” option of the Network tab. In your logbook, for each one, write the message that appeared and the **line of `js/load.js`** that produced it. Then answer: which of the six cases never show a status code in the Network tab, and why?

### Exercise 2 — How long the check took

Make it so that, when the data arrives fine, the dashboard shows below the detail “La revisión tardó 12 ms.” (The check took 12 ms.), with the milliseconds that passed between requesting the data and having it. `performance.now()` gives the current moment in milliseconds, with decimals; the difference between two calls is what passed between them. Decide where it is **measured**, where it is **stored** and where it is **written**, and check that if you click “Ordenar” the figure does not change, and that if you click “Revisar ahora”, it does.

### Exercise 3 — How many lists arrived

Copy figure 9.2 as `count.html` in the same folder and change it so that, below the three lines, it writes a fourth with the summary: “Llegaron 2 de 3.” (2 of 3 arrived.). Use `filter` on the result of `allSettled`, without requesting anything again. Then add `"panel/data/otro-que-no-existe.json"` to the list of addresses and check that the summary becomes “Llegaron 2 de 4.” without your changing anything else.

## Solutions

### Solution 1

The messages and where they come from, in `js/load.js`:

| Case | Message | Line that produces it |
|---|---|---|
| normal | (none: the table) | `return data;` |
| `?case=empty` | “No hay servicios que revisar.” | not from `js/load.js`: `situation` in `js/state.js` decides it |
| `?case=error` | “El servidor respondió con el código 404.” | the `throw` inside `if (!response.ok)` |
| `?case=invalid` | “La respuesta no es JSON válido.” | the `throw` of the `SyntaxError` branch of the second `catch` |
| `?case=timeout` (with `slow-server.py`) | “El servidor no respondió en 3000 ms.” | the `throw` of the first `catch`, `TimeoutError` branch |
| Offline | “No se pudo conectar con el servidor.” | the final `throw` of the first `catch` |

The four cases in which the server did answer show a status code in the Network tab: normal (200), empty (200), error (404) and invalid (200, type `text/html`). The ones that **never** have it are “timeout” (the request stays pending for three seconds and is aborted without having received a response) and “Offline” (there was nobody to talk to). The table in 8.1 marks **three** situations as “is rejected”: no connection, CORS block and timeout. These two cases are two of them; the third, CORS, does not appear in the dashboard because it requests from its own origin, and you saw it separately with figure 9.3. In the other cases, the promise was fulfilled and the dashboard had to check `ok` or the content on its own.

### Solution 2

They are three jobs and they go in three files. **Measuring** is an effect —it consults the clock around the request—, so it goes in `js/main.js`, next to the call to `loadServices`. **Storing** the figure is state: it is a fact the dashboard remembers until the next load. And **writing** it is drawing. In `js/state.js`, one more field and one more parameter:

```js
// js/state.js — en createState()
durationMs: null,       // cuánto tardó la última carga que salió bien, o null
// js/state.js — loadSucceeded recibe la cifra y la guarda
export function loadSucceeded(state, services, checkedAt, durationMs) {
  state.phase = "ready";
  state.services = services;
  state.checkedAt = checkedAt;
  state.durationMs = durationMs;
  state.selected = null;
}
```

In `js/main.js`, inside `load()`, it is measured before and after the request:

```js
  const start = performance.now();
  try {
    const services = await loadServices(current.url, current.timeoutMs);
    loadSucceeded(state, services, new Date(), Math.round(performance.now() - start));
  } catch (error) {
    loadFailed(state, error.message);
  }
```

In `index.html`, `<p id="duration"></p>` below `#detail`, inside `#data-zone`; in `js/main.js`, `duration: document.querySelector("#duration"),` in the `elements` object; and in `js/view.js`, at the end of `render`:

```js
  elements.duration.textContent = `La revisión tardó ${state.durationMs} ms.`;
```

“Ordenar” does not change the figure because it only changes `sortByTime`: the figure is stored only when data arrives. “Revisar ahora” does change it, because it goes through `loadSucceeded` again. If you had calculated it inside `render` with `performance.now()`, you would have measured something else —how much passed from when the page was opened until the drawing— and it would change with every click.

### Solution 3

After building the lines, the fulfilled results are counted and the fourth is added:

```js
    const lines = results.map((result, i) =>
      result.status === "fulfilled"
        ? `${urls[i]}: bien, ${result.value.length} elementos`
        : `${urls[i]}: falló, ${result.reason.message}`
    );
    const arrived = results.filter((result) => result.status === "fulfilled").length;
    lines.push(`Llegaron ${arrived} de ${results.length}.`);
    output.textContent = lines.join("\n");
```

`filter` leaves only the results whose `status` equals `"fulfilled"`, and `.length` counts them. Against `results.length`, and not against a hand-written 3, the summary adjusts by itself when the list changes: with the fourth address, Chrome 154 shows `panel/data/otro-que-no-existe.json: falló, código 404` and `Llegaron 2 de 4.`. It is the way of thinking of the `revisor`: the number of services comes from the data, never from the code.

## How I know I got it

- [ ] With the `programas/` folder served by `slow-server.py`, `09-cuando-algo-falla/fig09_01.html` shows `TimeoutError`; with `python3 -m http.server`, the same page says “alcanzó a responder”.
- [ ] `fig09_02.html` shows two lists that arrived and one that failed with code 404.
- [ ] In your dashboard, the summary says 5, 4 of 5, 1 and 465 ms and the header says the date and time at which the data arrived.
- [ ] The four cases with `?case=` show the notice from the 9.2 table (the `timeout` one, with `slow-server.py`), and “Reintentar” appears in the three that are errors and in the empty one, never next to the table.
- [ ] After pressing “Revisar ahora” or “Reintentar” with the keyboard, focus stays on that button.
- [ ] At 320 px wide there is no horizontal overflow in any of the five cases.
- [ ] With `?case=timeout` and `slow-server.py`, or with a slow speed profile in the Network tab, you manage to see “Cargando servicios…”.
- [ ] With “Offline” and “Reintentar” the dashboard says “No se pudo conectar con el servidor.”
- [ ] The console shows only the network error of the cases you provoked on purpose, and no exception from your code.

**Review of earlier lessons** (answer them without looking, and then check):

1. In Lesson 0: what is an origin, and which three parts of an address form it?
2. In Lesson 7: why must focus be given back to the button after redrawing?
3. In Lesson 8: why is `fetch`'s promise fulfilled with a 404, and which line of `js/load.js` turns it into an error?

## Further reading

- [MDN — `AbortSignal.timeout()`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static) — the time limit and the `TimeoutError`, with its compatibility table; accessed on October 7, 2026.
- [MDN — Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS) — what the origin is and why the server fixes it; accessed on October 7, 2026.
- [MDN — ARIA live regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions) — `status`, `alert` and why the region must exist before its text changes; accessed on October 7, 2026.
- [MDN — `Promise.allSettled()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled) — waiting for a set of promises without one failure taking the others with it; accessed on October 7, 2026.
