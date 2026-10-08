# Lesson 7 — The DOM, events and state

**Time:** 2 × 45 min

**What you build:** the dashboard table, drawn from the data

**What you learn:** drawing from data instead of writing by hand; listening to events; separating state, drawing and effects; `textContent` as a habit, and the attack it prevents

## By the end you will be able to

- Explain the difference between the HTML file and the DOM, and say which of the two changes when JavaScript writes to the page.
- Draw a complete table from an array of objects, creating the elements one by one and hanging them on the document.
- Explain what an XSS attack is with an example you provoke yourself, and why `textContent` prevents it and `innerHTML` allows it.
- Listen to an event with `addEventListener`, read what happened to the element using the event object, and handle many buttons with a single listener (delegation).
- Separate the dashboard's state (what it remembers), drawing (how it looks) and effects (what it listens to), and say which file each thing lives in.
- Navigate the dashboard with the keyboard alone and check that focus is not lost when the table is redrawn.

## The why before the how

**Starting point.** This lesson starts from the dashboard as Lesson 6 left it, in your `revisor` folder:

- `index.html`, the dashboard from Lesson 2 with the classes that lessons 4 and 5 gave it: the header, the summary with its four figures written by hand, the search field, the radios, the “Revisar ahora” (Check now) button and the table with its five rows written by hand. In the `<head>` it carries the line `<script type="module" src="js/main.js">` that you added in Lesson 6.
- `css/styles.css`, the stylesheet from lessons 3, 4 and 5: layers, color variables, status badges and the layout that goes from 320 to 1440 pixels.
- `js/services.js`, a module that exports the `services` array with the five services.
- `js/stats.js`, a module that exports `countByStatus`, `averageResponseMs` and `summarize`.
- `js/main.js`, which for now only writes the calculations to the browser console.

The two modules for the data and the calculations do not change throughout the lesson: this is their shape, the same as in Lesson 6. The only difference is the first line, the comment that in the repository says where each file lives: this lesson's dashboard is in [`programas/07-dom-eventos-estado/panel/`](https://github.com/HabilMX/curso-web/tree/main/programas/07-dom-eventos-estado/panel).

```js
// panel/js/services.js
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
// panel/js/stats.js
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

Notice a decision from Lesson 6 that pays off today: a service that is down has no response time, and that is why its `responseMs` is `null` instead of zero. A zero would say “it responded in zero milliseconds”, which is a lie and also ruins the average. `averageResponseMs` already knows how to leave out those that did not respond, and today you will see that the table also has to decide what to show in their place.

**What the dashboard is missing today.** You have the same five services in two places: in `js/services.js`, where JavaScript can count them, and in the HTML, where a person can see them. Nobody guarantees that they match. If Pagos goes down tomorrow and you change the array, the table will keep saying “Disponible” (Available) until someone remembers to edit the HTML too. If you add a sixth service, you have to copy a whole row, with its badge, without getting a tag wrong. And the summary has the same problem: you wrote its four figures by hand in Lesson 2, and the ones Lesson 6 calculated are locked in the console.

Two copies of the same information end up contradicting each other. The way out is to have **a single source of truth**, the data, and to have the screen be a consequence: when the data changes, it is drawn again. That is what you build today.

**The route the lesson follows.** There are three ideas, in this order. First the **DOM**, which is how JavaScript sees and changes the page, and with it you draw the table from the data; right there appears the most profitable security rule on the whole web, which fits on one line and which you will see broken with your own eyes. Second **events**, which is how the page finds out that someone did something. Third **state**, which is what the dashboard remembers, and the separation that keeps the code from turning into a tangle as soon as there is more than one button.

A practical warning before starting: modules do not load by opening the file with a double click (`file://`). Since Lesson 1 you work with a local server. This lesson's pages are in the [`programas/07-dom-eventos-estado/`](https://github.com/HabilMX/curso-web/tree/main/programas/07-dom-eventos-estado) folder of the [course repository](https://github.com/HabilMX/curso-web): download it (or clone it with Git) onto your computer and start the server from its `programas/` folder:

```bash
cd programas
python3 -m http.server 8000 --bind 127.0.0.1
```

And open `http://127.0.0.1:8000/07-dom-eventos-estado/panel/`. The `--bind 127.0.0.1` makes only your computer able to see the folder; without it, the server serves the whole local network.

## The concepts

There are three, and each one brings its minimal example and its example in the `revisor`. A reminder of method that holds for the whole lesson: **before running each figure, write in the logbook what you think is going to happen**. Predicting and then checking teaches more than reading the answer, because when you are wrong, the mistake stays engraved.

### 7.1 The DOM: the page as a tree that JavaScript can change

**The file is not the page.** When the browser receives an HTML file, what it has in its hands is text. It reads it from beginning to end and with it builds in memory a structure of objects, a **tree**: `html` contains `head` and `body`; `body` contains the header, the table, the paragraphs; the table contains its body, the body its rows, each row its cells. Each piece of that tree is called a **node**, and the whole tree, the **DOM** (for *Document Object Model*). The official definition lives in the [DOM standard](https://dom.spec.whatwg.org/); MDN's explanation of [what the DOM is](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction) is the recommended reading for whoever wants the detail.

That distinction matters for three reasons that you will check with the browser tools:

1. **What you see in the Inspector is the DOM, not the file.** Open your `index.html` with the server, press `F12` and go to the Inspector tab. If in your HTML you wrote a table without `<tbody>`, the Inspector will show it to you anyway: the browser added it when building the tree, because the standard requires it. “View source” shows the file; the Inspector shows the live tree.
2. **JavaScript changes the tree, not the file.** If a program adds a row, the `index.html` file on your disk stays identical. Reload the page and the change disappears, because the browser reads the file again and builds the tree again. That is why you will never “save” a DOM change: the DOM is rebuilt every time, and what is saved is the data and the code that draws it.
3. **The Inspector updates by itself.** With the dashboard open, when the code changes the tree you will see the modified node flash. It is the best way to learn: watch which nodes change and which do not.

**Reading and writing the tree.** The entry point is the `document` object, which represents the whole page. With it you *look for* a node and then *read* or *write* something in it. To search, `document.querySelector(selector)` receives a CSS selector, the same language as in Lesson 3 (`#title` is the element with that `id`, `.status` those of that class, `tbody` those of that tag), and returns **the first** node that matches, or **`null`** if none does. Its sibling `document.querySelectorAll(selector)` returns **all** that match, in a list that is traversed with `for…of`. To write text into a node you assign it to its `textContent` property.

Before running figure 7.1, **predict**: what number will the paragraph show, and what will the heading say when the program ends? The figure has a three-row table written by hand:

```html
<!-- fig07_01.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 7.1 — Leer y escribir el documento</title>
</head>
<body>
  <main>
    <h1 id="title">Servicios</h1>
    <table>
      <tbody>
        <tr><td>Catálogo</td><td>Disponible</td></tr>
        <tr><td>Pagos</td><td>Disponible</td></tr>
        <tr><td>Inventario</td><td>Caído</td></tr>
      </tbody>
    </table>
    <p id="count"></p>
  </main>

  <script type="module">
    // Leer: ¿cuántas filas hay en el documento?
    const rows = document.querySelectorAll("tr");

    // Escribir: poner esa cuenta en el párrafo.
    const paragraph = document.querySelector("#count");
    paragraph.textContent = `El documento tiene ${rows.length} filas.`;

    // Escribir otra vez: cambiar el texto del título.
    document.querySelector("#title").textContent = "Servicios (leídos por JavaScript)";
  </script>
</body>
</html>
```

What is seen on the page (the text Chrome shows, from top to bottom), which in the repository is in [`programas/07-dom-eventos-estado/fig07_01.salida.txt`](https://github.com/HabilMX/curso-web/blob/main/programas/07-dom-eventos-estado/fig07_01.salida.txt):

```text
Servicios (leídos por JavaScript)
Catálogo	Disponible
Pagos	Disponible
Inventario	Caído

El documento tiene 3 filas.
```

If your prediction was “three rows”, you were right, and notice what that demonstrates: `querySelectorAll("tr")` counted the rows of the *body*, and the table has no column header. If it had had a row of headers, there would be four. It is the kind of detail learned by counting, not by reading.

Two more things about that figure. The `<script type="module">` is *after* the content, but it would not matter where you put it: a module always runs when the document has already been read, and that avoids the most frequent beginner error, which you will see in the section “The error you will see”. And the `textContent` property is **read and write**: `elemento.textContent` gives you the text inside, `elemento.textContent = "algo"` replaces it, first erasing everything the element contained, its children included.

**Drawing from an array.** To draw a list you do not write the text of the list: you **create nodes** and **hang** them on the tree. There are three steps, and the three steps are always the same:

1. `document.createElement("li")` creates a new element, loose in memory. It is not visible yet, because it does not belong to the page's tree.
2. Its content is set: `elemento.textContent = "..."`, or its attributes and classes.
3. `contenedor.append(elemento)` hangs it on the tree, at the end of the container's children. At that moment it appears on screen.

Figure 7.2 is the minimal version of all the dashboard's drawing: an array with three of the services from Lesson 6 and a loop that turns each one into an element. **Predict** what the “Inventario” line, the one that did not respond, will say.

```html
<!-- fig07_02.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 7.2 — Dibujar una lista desde un arreglo</title>
</head>
<body>
  <main>
    <h1>Servicios</h1>
    <ul id="list"></ul>
  </main>

  <script type="module">
    const services = [
      { id: "catalog", name: "Catálogo", status: "available", responseMs: 120 },
      { id: "payments", name: "Pagos", status: "available", responseMs: 480 },
      { id: "inventory", name: "Inventario", status: "down", responseMs: null },
    ];

    const list = document.querySelector("#list");

    for (const service of services) {
      const item = document.createElement("li");                      // 1. crear el nodo
      item.textContent = service.responseMs === null                  // 2. su texto
        ? `${service.name}: sin respuesta`
        : `${service.name}: ${service.responseMs} ms`;
      list.append(item);                                              // 3. colgarlo del árbol
    }
  </script>
</body>
</html>
```

```text
Servicios
Catálogo: 120 ms
Pagos: 480 ms
Inventario: sin respuesta
```

Observe what is *not* in the HTML: there is no `<li>` at all. The list is empty in the file and the Inspector shows it full. And observe something that changes how you think: if tomorrow the array has ten services, or zero, the code does not change. **The drawing stops depending on how much data there is.** That is the benefit of drawing from the data. Notice also the Inventario line: the `null` from Lesson 6 does not appear as “null ms”, because the code decides which text corresponds to the lack of data. That decision belongs to the drawing, not to the data.

`append` accepts several arguments at once, and also accepts loose text, which it converts into a text node. `replaceChildren(...nodos)` is its relative for *re*drawing: it empties the container and puts the new nodes in a single step. The three dots are the spread you saw in [Lesson 6](06-javascript-datos.md) (section 6.2.6): they distribute the elements of an array as if they were loose arguments. Both are “Baseline widely available”, that is, they work in all current browsers and have for years; MDN documents [`append`](https://developer.mozilla.org/en-US/docs/Web/API/Element/append) and [`replaceChildren`](https://developer.mozilla.org/en-US/docs/Web/API/Element/replaceChildren) with its compatibility table.

**A dashboard row, decision by decision.** The table row is the same idea with more pieces, and each piece has a reason. This is the `createRow` function from `js/view.js`, with the small `label` function it uses:

```js
// Lista cerrada de estados que el panel conoce. Un valor que no esté aquí no llega a una clase.
const LABELS = { available: "Disponible", down: "Caído" };

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
```

Read it slowly, because each line answers something you have already learned:

- **`th` with `scope = "row"` for the name.** In Lesson 2 you learned that the first cell of each row is the *row header*: a screen reader, on reaching “480 ms”, can say “Pagos, Tiempo de respuesta (Response time), 480 ms”. If you drew a `td` out of laziness, the table would look the same and would stop being understandable for someone who cannot see it.
- **The badge uses a closed list.** `LABELS` is an object with the two statuses the dashboard knows, `available` and `down`, and the label shown for each. `Object.hasOwn(LABELS, service.status)` asks whether the status is one of them, and only then is it used as part of a class name: `status status-available` or `status status-down`, the same classes that Lesson 3 painted green and red. A piece of outside data that is not in the list does not reach the class and is shown as “Desconocido” (Unknown), with the uncolored badge that Lesson 3 announced for that case. ([`Object.hasOwn`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn) is the modern way of asking “does this object itself have this key?”, and it is better than a bare `LABELS[status]`, because a status named `"constructor"` would find the function of that name that all objects inherit.)
- **“sin respuesta” (no response) for the `null`.** Showing “null ms” would be rude to whoever reads. The `null` is a decision of the data; translating it into something readable is the drawing's job, and the text is the same one the hand-written table said since Lesson 2.
- **A real button per row.** Not a clickable cell, not a `div`: a `<button type="button">`. A button receives focus with the Tab key and is activated with Enter and with the space bar **without you writing a line**; a clickable `div` does neither, and fixing it by hand is more code and a worse result. The first rule of ARIA says it this way: if a native element exists with the behavior you need, use it (the [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/) develops it).
- **The hidden text “de Pagos” (of Pagos).** Five buttons that all say “Ver detalle” (View detail) are five indistinguishable buttons for someone navigating by voice or with a screen reader, which can ask for the list of controls on the page. The `<span class="visually-hidden">` adds the service's name to each button's accessible name: “Ver detalle de Pagos”. The class takes it out of view without removing it from the accessibility tree, and it lives in `css/styles.css`.
- **`dataset.id`.** Attributes that start with `data-` are a place the standard reserves for your own data. `button.dataset.id = "payments"` writes `data-id="payments"`. It is the `id` that Lesson 6 separated from the name: the name is what is shown and can change; the `id` is what identifies the service. Later you will read it back to know *which* service the person wanted to see. A `data-` attribute stores its value as text and the browser does not interpret it, so writing outside data there executes nothing.
- **`classList`, `aria-pressed` and `String`.** `row.classList.add("selected")` adds a class to those the element already has without erasing the others (assigning `className`, on the other hand, replaces them all). `aria-pressed` is an accessibility attribute that turns the button into a *toggle button*: a screen reader announces whether it is pressed or not, and the stylesheet uses it to mark it. Attributes always store text, which is why `String(isSelected)` converts the Boolean `true` or `false` into the text `"true"` or `"false"` before writing it.
- **`setAttribute` cleans nothing.** It is safe *for these two attributes*, `data-id` and `aria-pressed`, because the browser never executes them. But `setAttribute` writes the value as is into whichever attribute you tell it, and some attributes are indeed code: `button.setAttribute("onclick", texto)` turns that text into a program that runs on click, and `href` or the `src` of an `<iframe>` accept `javascript:` addresses. MDN warns about it in the security section of [`setAttribute`](https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute). The rule: outside data goes only into attributes that are not executed, and never into one that starts with `on`.

**The rule that fits on one line: outside text goes in with `textContent`.** So far you have used `textContent` without being told why. It is time to see why it matters, and the best way is to break it on purpose.

There is another property that seems to do the same thing: `innerHTML`. It looks very similar. But there is a fundamental difference: `textContent` treats what you give it **as text**; `innerHTML` treats it **as HTML code** and interprets it, just as when the browser reads a file. With a name like “Catálogo” the two give the same result. With a name like `<b>Catálogo</b>` they no longer do: one puts bold letters and the other shows the `<b>` signs as they are.

That would not be serious if the data were always yours. But the `revisor` exists to show what *others report*: a service's name, an error message, a description. Today they are in your `js/services.js` file; in Lesson 8 they will arrive over the network, and in 10 a person will type them into a form. As soon as a text is controlled by someone who is not you, it is **outside data**, and it has to be treated as if it could be hostile.

Here comes the attack, which is called **XSS** (*cross-site scripting*): outside data that contains HTML with active code, and a page that interprets it. It is one of the most frequent security flaws on the web, and [OWASP](https://top10.owasp.org/2025/A05_2025-Injection/) classifies it among injections in its 2025 list. Figure 7.3 is the **insecure** version of drawing the list. **Predict** before opening it: the third name is `<img src="x" onerror="document.title = '...'">`, which is an image whose address (`x`) does not exist. What do you think will be seen in the list, and what will happen to the tab's title?

```html
<!-- fig07_03.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 7.3 — innerHTML con un dato de fuera (INSEGURO)</title>
</head>
<body>
  <main>
    <h1>Servicios (versión insegura, solo para ver el problema)</h1>
    <ul id="list"></ul>
  </main>

  <script type="module">
    // El tercer nombre lo escribió otra persona, no tú. Es un dato de fuera.
    const services = [
      { name: "Catálogo" },
      { name: "Pagos" },
      { name: `<img src="x" onerror="document.title = 'Se ejecutó código que venía en un dato'">` },
    ];

    const list = document.querySelector("#list");
    for (const service of services) {
      const item = document.createElement("li");
      item.innerHTML = service.name;   // <-- el navegador INTERPRETA el texto como HTML
      list.append(item);
    }
  </script>
</body>
</html>
```

```text
Lista visible:
• Catálogo
• Pagos
• 

Título de la pestaña (lo cambió el dato): Se ejecutó código que venía en un dato
```

The list shows nothing on the third line, and **the tab changed its title**. There was no program saying that: a piece of data said it. The browser created the image, tried to load `x`, could not, fired the image's error event and executed the code that came inside the `onerror` attribute. Today that code changes a title, which is harmless. But it is **arbitrary code**, with the same permissions as yours: it can read what the page shows, it can request information from the server with the session of whoever is looking, it can change what is seen in order to deceive. Whoever wrote the data did not need to get into the server or know your code; they only needed your page to draw it with `innerHTML`.

A frequent confusion: “If `innerHTML` blocks `<script>`, I am already safe.” It is true that a `<script>` inserted with `innerHTML` **does not run**, and that is why many tutorials say it is safe. But figure 7.3 has just demonstrated that a `<script>` is not needed: an event attribute on an image is enough. MDN warns about it on its [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) page, with this same `onerror` example.

Figure 7.4 is identical **except for one line**: it uses `textContent`.

```html
<!-- fig07_04.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 7.4 — textContent con un dato de fuera</title>
</head>
<body>
  <main>
    <h1>Servicios (versión segura)</h1>
    <ul id="list"></ul>
  </main>

  <script type="module">
    // El tercer nombre lo escribió otra persona, no tú. Es un dato de fuera.
    const services = [
      { name: "Catálogo" },
      { name: "Pagos" },
      { name: `<img src="x" onerror="document.title = 'Se ejecutó código que venía en un dato'">` },
    ];

    const list = document.querySelector("#list");
    for (const service of services) {
      const item = document.createElement("li");
      item.textContent = service.name;  // <-- el navegador lo trata SIEMPRE como texto
      list.append(item);
    }
  </script>
</body>
</html>
```

```text
Lista visible:
• Catálogo
• Pagos
• <img src="x" onerror="document.title = 'Se ejecutó código que venía en un dato'">

Título de la pestaña: Fig. 7.4 — textContent con un dato de fuera
```

The third line now shows the text of the attack, complete and visible, and the tab's title is still the one you wrote. The image was never created: the browser did not read `<img` as a tag because `textContent` does not care what it looks like. In the Inspector you will see that the HTML wrote `&lt;img…&gt;`: the signs were *escaped*, that is, replaced by their text representation.

That is the rule: **all text you did not write yourself enters the document with `textContent`**. And with it go others of the same family, which OWASP gathers in its [DOM-based XSS cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html) as the “dangerous sinks”, the places where a piece of data becomes code:

- `innerHTML`, `outerHTML` and `insertAdjacentHTML`: they interpret HTML.
- `document.write`: the same, and in such a clumsy way that it is no longer taught.
- `eval(texto)` and `setTimeout("texto", …)` with a string: they execute text as a program.
- Event attributes written in the HTML (`onclick="..."`, `onerror="..."`): they are code in the form of text.
- Assigning a piece of data to a link's `href` (or an `<iframe>`'s `src`) without checking where it comes from: an address that starts with `javascript:` executes code when the link is followed or the frame is loaded. MDN explains that this happens in the places one *navigates* to, not in those that only download a resource, such as an image's `src` ([`javascript:` scheme](https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/javascript)). In today's dashboard there are no links with outside data, but as soon as there is one, the address is validated first.

When is `innerHTML` acceptable? When what you give it is a fixed text that you wrote, without a single piece that comes from data. Even so, the healthy habit is not to have it: a line with `innerHTML` that is safe today becomes, three months later, an insecure line when someone pastes a variable into it. If you never use it, that conversion cannot happen, and reviewing the code is searching for the word and checking that it is not there. That is why one of the five criteria by which you know you have finished the course is: *text that comes from outside is drawn with `textContent`, never with `innerHTML`*.

> **What is coming, and is not used yet.** There are two newer mechanisms for this same problem. The first is *Trusted Types*, which make the browser refuse to accept a text string in a dangerous sink; according to [web.dev](https://web.dev/articles/trusted-types), the main browsers support it only since 2026, and that is why it is still “recent”. The second is `Element.setHTML()`, together with the *Sanitizer* API, which cleans the HTML before inserting it, and which MDN still marks as “not Baseline”. Neither replaces the habit of using `textContent`, and this course does not use them in the dashboard: it teaches only what already works in all browsers. In Lesson 11 you will see the other safety net that is in all of them: the content security policy (CSP), which is a second layer and **does not replace** the first.

### 7.2 Events: how the page finds out that someone did something

**An event is a notice.** When someone presses a button, moves the mouse, types a key or an image finishes loading, the browser notes it as an **event** and notifies whoever asked for it. The one who asks is your code, and it does so like this:

```js
element.addEventListener("click", handler);
```

Said in plain English: “when a `click` occurs on this element, run this function”. The function is called a **listener** or handler. Three details that almost all beginners trip over:

1. **The function is passed, not called.** `addEventListener("click", onClick)` hands over the function so that the browser runs it when the click happens. If you write `onClick()` with parentheses, you run it *right now*, once, and hand the browser whatever that call returned (usually `undefined`). The click will do nothing and there will be no error at all.
2. **The browser hands the function an object with the details**, the event object, which by convention is called `event`. Its most useful properties: `event.type` (what type of event it was), `event.target` (the element where it *occurred*) and `event.currentTarget` (the element where the *listener is placed*). Figure 7.5 uses them, together with [`localName`](https://developer.mozilla.org/en-US/docs/Web/API/Element/localName), a property every element has that gives the name of its tag in lowercase: for a `<button>`, the text `"button"`. It lets the page say *what kind* of element received the event.
3. **The right element gives you the keyboard for free.** A button receives the click with the mouse, with a touch on screen, with Enter and with the space bar; all of that arrives as the same `click` event. If you had used a `div`, you would have to write the keyboard support yourself.

**Predict:** what will the paragraph say after two clicks on the button?

```html
<!-- fig07_05.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 7.5 — Escuchar un clic</title>
  <style>
    /* Un blanco cómodo para el dedo o el mouse: WCAG 2.2 pide al menos 24 × 24 px; aquí mide 44. */
    button { min-height: 2.75rem; padding: 0.5rem 0.75rem; }
  </style>
</head>
<body>
  <main>
    <h1>Un botón y un contador</h1>
    <button type="button" id="counter">Contar un clic</button>
    <p id="result" role="status">Todavía no hay clics.</p>
  </main>

  <script type="module">
    const button = document.querySelector("#counter");
    const result = document.querySelector("#result");
    let clicks = 0;

    function onClick(event) {
      clicks += 1;
      result.textContent = `Clics: ${clicks}. Tipo de evento: ${event.type}. Lo recibió: <${event.currentTarget.localName}>.`;
    }

    button.addEventListener("click", onClick);   // pasa la función, NO la llama (sin paréntesis)
  </script>
</body>
</html>
```

```text
Tras dos clics:
Clics: 2. Tipo de evento: click. Lo recibió: <button>.
```

Two observations that will be useful in the dashboard. The first: the `clicks` variable lives *outside* the function and so survives from one click to the next; storing “what has happened so far” outside the listener is the seed of what in 7.3 is called state. The second: the paragraph has `role="status"`, which makes it a **live region**: when its content changes, a screen reader announces it without the person having to go looking for it. It is the right way to announce that “something changed” without moving focus; the golden rule of live regions is that they **exist from the start, empty or with their initial text**, and that only their content changes.

**Events bubble up.** If you click a button that is inside a cell, which is inside a row, which is inside the table body, to whom did the click happen? To all of them. The browser hands the event first to the button and then **sends it up** the tree: to the cell, to the row, to the body, to the table, to the `body`, up to `document`. This is called **bubbling**, and it is described in the [DOM standard](https://dom.spec.whatwg.org/#dispatching-events) and explained step by step in [MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling). While it goes up, `event.target` does not change (it is still the innermost element, where the click was made) and `event.currentTarget` keeps changing (it is always the element whose listener is running).

Bubbling allows a technique that you will use in almost every program with lists: **event delegation**. Instead of putting a listener on each button, you put **a single one** on the container, and when the event comes up, you ask where it came from. Why is it better here?

- **The dashboard redraws its rows** (you will see it in 7.3). The old buttons are thrown away and new buttons are created; a listener placed on an old button goes to the trash with it. The container, the `<tbody>`, is never thrown away, and its listener stays.
- **With 6 rows or with 600, the cost is the same:** one listener.
- **Services that arrive later** (in Lesson 8 the table is filled after a network request) are covered without doing anything.

There is a trap, and it is called the icon inside the button. If the button contains another element, such as a `<span>` with a symbol, the click may land on the `span`, and then `event.target` is the `span`, not the button. Naive code that asks `if (event.target === button)` will stop working as soon as the designer adds an icon. The solution is `event.target.closest("button[data-name]")`: **`closest`** goes up from the element through its ancestors and returns the first one that matches the selector (starting with the element itself), or `null` if there is none ([MDN: `closest`](https://developer.mozilla.org/en-US/docs/Web/API/Element/closest)). Figure 7.6 demonstrates it by clicking on the icon on purpose.

```html
<!-- fig07_06.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 7.6 — Un solo oyente para muchos botones</title>
  <style>
    /* Un blanco cómodo para el dedo o el mouse: WCAG 2.2 pide al menos 24 × 24 px; aquí mide 44. */
    button { min-height: 2.75rem; padding: 0.5rem 0.75rem; }
  </style>
</head>
<body>
  <main>
    <h1>Delegación de eventos</h1>
    <ul id="list"></ul>
    <p id="result" role="status">Ningún botón presionado.</p>
  </main>

  <script type="module">
    const names = ["Catálogo", "Pagos", "Inventario"];
    const list = document.querySelector("#list");
    const result = document.querySelector("#result");

    for (const name of names) {
      const item = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.name = name;                     // guarda el nombre en data-name
      const icon = document.createElement("span");    // un elemento DENTRO del botón
      icon.textContent = "▶ ";
      button.append(icon, `Ver ${name}`);
      item.append(button);
      list.append(item);
    }

    // UN solo oyente, en el contenedor. Los clics de todos los botones suben hasta aquí.
    list.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-name]");
      if (button === null) return;                    // el clic no fue en un botón
      result.textContent = `Presionaste: ${button.dataset.name} (target: <${event.target.localName}>)`;
    });
  </script>
</body>
</html>
```

```text
Tras hacer clic sobre el ícono del botón «Ver Pagos»:
Presionaste: Pagos (target: <span>)
```

Look at the output: `target` was the `<span>`, but `closest` found the button and its `dataset.name` said “Pagos”. And look at the line `if (button === null) return;`: the listener is on the whole list, so it also receives the clicks that land in the space between buttons, and they have to be ignored. It is the first instruction of any delegated listener.

A limit worth knowing: not all events bubble up. `focus` and `blur`, for example, do not bubble (their relatives `focusin` and `focusout` do). For clicks and keys, which are the ones you will use in this course, delegation works without tricks.

### 7.3 State, and the separation that avoids the tangle

**What state is.** The **state** of an application is **what it remembers at this moment**. In the dashboard it is three things: the list of services, whether it is sorted by response time or not, and which service is selected (or none). Notice that I did not say “what is seen”: what is seen is a *consequence* of the state. The idea that organizes everything else is that **the screen is a function of the state**: you write a function `render(state)` that, given the state, puts into the document what corresponds, and every time something changes, the state is changed and `render` is called again.

The tangle this idea avoids looks like this. A beginner programmer solves “sort” with an `if (button.textContent === "Ordenar por tiempo")`: asks *the document* what situation the dashboard is in. It works until someone changes the button's text, or translates it, or adds another button that also needs to know whether it is sorted. Then the truth lives in three places (the array, the button's text, the order of the rows on screen) and they have to be kept in agreement by hand. It is the same problem of the two copies the lesson began with, only now inside the code itself. With an explicit state, the truth lives in **one** object, and everything else is calculated.

**Three files, three responsibilities.** The dashboard is split like this:

| File | Responsibility | Does it touch the document? |
|---|---|---|
| `js/state.js` | What the dashboard remembers and the only ways of changing it | No |
| `js/view.js` | Draws a state into the document | Yes, only to write |
| `js/main.js` | Puts the pieces together: listens to events, changes the state, asks for drawing | Yes, to listen |

Events, drawing and everything that *does something to the world* are called **effects**: they are kept apart from the state because they are what is hard to test and to reason about. The state, on the other hand, is ordinary objects and functions, which you can verify without opening a page. This is the complete `js/state.js`:

```js
// panel/js/state.js
// El estado del panel y las únicas formas de cambiarlo.
// No toca el documento: por eso se puede probar sin pantalla.

export function createState(services) {
  return {
    services,           // los datos
    sortByTime: false,  // false = en el orden original; true = del más rápido al más lento
    selected: null,     // el id del servicio elegido, o null
  };
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

Stop at `visible`. It returns **what must be shown** and calculates it from the state each time: if `sortByTime` is true, it sorts; if not, it returns the list as it arrived. There are two details that matter. The first is `toSorted`, which you met in Lesson 6: it returns a sorted **copy** and leaves the data array intact. If you used `sort`, which sorts the array it is called on, you would lose the arrival order forever, and the “Ordenar” (Sort) button would have nothing to go back to. The second is `a.responseMs ?? Infinity`: the `??` operator replaces a `null` with the value on the right, so a service without a measurement is considered infinitely slow and goes to the end. (`??` only reacts to `null` and `undefined`; `||`, on the other hand, would treat a zero as “missing”. A time of zero would be suspicious, but it is not the same as having no measurement.)

**The advantage of separating shows in a test without a screen.** Since `js/state.js` does not touch the document, it can be checked with an almost empty page, `state-test.html`, which imports the data and the state module and verifies six facts. Each check is one line: a description and a condition that must be true.

```html
<!-- panel/state-test.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Prueba del estado (sin dibujar nada del panel)</title>
</head>
<body>
  <main>
    <h1>Prueba del estado</h1>
    <pre id="output"></pre>
  </main>
  <script type="module">
    import { services } from "./js/services.js";
    import { createState, toggleSort, select, visible } from "./js/state.js";

    const lines = [];
    function check(description, condition) {
      lines.push(`${condition ? "ok    " : "FALLA "} ${description}`);
    }
    const names = (list) => list.map((service) => service.name).join(", ");

    const state = createState(services);
    check("al inicio se ve el orden original", names(visible(state)) === "Catálogo, Pagos, Inventario, Notificaciones, Búsqueda");

    toggleSort(state);
    check("ordenado: del más rápido al más lento", names(visible(state)) === "Catálogo, Notificaciones, Pagos, Búsqueda, Inventario");
    check("ordenado: el que no tiene medida va al final (Inventario)", visible(state).at(-1).name === "Inventario");
    check("ordenar no cambia el arreglo original", names(state.services) === "Catálogo, Pagos, Inventario, Notificaciones, Búsqueda");

    select(state, "payments");
    check("seleccionar guarda el id", state.selected === "payments");
    select(state, "payments");
    check("seleccionar el mismo otra vez lo deselecciona", state.selected === null);

    document.querySelector("#output").textContent = lines.join("\n");
  </script>
</body>
</html>
```

Open it with your server at `…/07-dom-eventos-estado/panel/state-test.html`:

```text
Prueba del estado
ok     al inicio se ve el orden original
ok     ordenado: del más rápido al más lento
ok     ordenado: el que no tiene medida va al final (Inventario)
ok     ordenar no cambia el arreglo original
ok     seleccionar guarda el id
ok     seleccionar el mismo otra vez lo deselecciona
```

If you change `visible` so that it uses `sort` instead of `toSorted`, the check `ordenar no cambia el arreglo original` (sorting does not change the original array) turns to `FALLA` (FAILS). Do it, see it in red, and undo the change: that way you know the test protects something for real. Notice why the second check looks at the complete order and not only the first: Catálogo was already the fastest and the first in the list, so “the first is Catálogo” would hold even if the sorting did nothing. A test that cannot fail tests nothing.

**The drawing.** With the state separated, `render` ends up short and repetitive, which is just what you want. This is the complete `js/view.js`; you already know `createRow` and `label`, and what is new is `describe`, which builds the detail sentence (`toLowerCase()` returns the text in lowercase: “Disponible” becomes “disponible” in mid-sentence), and the `render` function at the end:

```js
// panel/js/view.js
// Dibuja el estado en el documento. Todo texto de los datos entra con textContent.
import { summarize } from "./stats.js";
import { visible, selectedService } from "./state.js";

// Lista cerrada de estados que el panel conoce. Un valor que no esté aquí no llega a una clase.
const LABELS = { available: "Disponible", down: "Caído" };

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

// elements = { total, available, down, average, body, detail, sortButton }
export function render(state, elements) {
  const { services } = state;
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

Look at the first lines of `render`: the summary you wrote by hand in Lesson 2 is now written by `summarize`, the function from Lesson 6, into the four `<dd>` of the `<dl>`. The figures are the same; the difference is that you no longer add them up, and that the day a service changes, they change by themselves.

Observe that `render` receives the state and an object with the document elements it needs (`elements`). It does not look for them: they are handed to it. That way `js/view.js` does not depend on what any `id` in your HTML is called, and the same code works for testing with fake elements.

Observe also how much text enters the document, and through where: the summary, the name, the status, the time and the detail. **All of it enters with `textContent`.** The `revisor` does not use `innerHTML` even once. A service's numbers and status are outside data even if today they live in your file.

**The cost of redrawing everything.** `replaceChildren` discards all the rows and puts in new rows. It is simple, it is fast enough for five rows or for five hundred, and it has an effect you must understand because it affects whoever uses the keyboard: **the button that had focus disappears**. If a person navigates with Tab to “Ver detalle de Pagos” and presses Enter, the dashboard is drawn again, the old button is thrown away, and focus falls on the `body`: the person has to go through the whole page again from the top to continue. It is an accessibility defect that is not seen with the mouse, and so nobody notices it until someone reports it. Testing with the keyboard, as the course's closing criterion asks, is what detects it.

The solution is in `main.js`. Before changing the state, the `id` of the service whose button has focus is noted (`document.activeElement` is the focused element, and its `dataset.id` is the service); the state is changed; it is drawn; and focus is given back to the new button that has the same `data-id`. To build the selector, `CSS.escape` is used, which protects the `id` from characters that have meaning in a selector, such as quotation marks or brackets: `id`s arrive with the data, from Lesson 8 they will arrive over the network, and one like `pagos"norte` would break a selector built by hand ([MDN: `CSS.escape`](https://developer.mozilla.org/en-US/docs/Web/API/CSS/escape_static)). This is the complete `js/main.js`. It replaces the one from Lesson 6, which only wrote to the console:

```js
// panel/js/main.js
// Junta las piezas: crea el estado, escucha eventos y vuelve a dibujar.
import { services } from "./services.js";
import { createState, toggleSort, select } from "./state.js";
import { render } from "./view.js";

const elements = {
  total: document.querySelector("#summary-total"),
  available: document.querySelector("#summary-available"),
  down: document.querySelector("#summary-down"),
  average: document.querySelector("#summary-average"),
  body: document.querySelector("#services-body"),
  detail: document.querySelector("#detail"),
  sortButton: document.querySelector("#sort"),
};

const state = createState(services);

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

// Delegación: un solo oyente en el <tbody> atiende los botones de todas las filas.
elements.body.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-id]");
  if (button === null) return;
  update(() => select(state, button.dataset.id));
});

render(state, elements);
```

And the HTML. It is the `index.html` you brought, with small changes, and none of them changes what it means: the four `<dd>` of the summary lose their hand-written figures and gain an `id`; the `<tbody>` loses its five rows and gains its own, `services-body`; the table gains a fourth column, “Acción” (Action), and the header of the time column, the class `number`; the controls bar gains the “Ordenar por tiempo de respuesta” (Sort by response time) button, with its `aria-pressed`; and below the table appears `#detail`, an empty live region. The search field and the radios are still there doing nothing (Lesson 10 connects them), as is “Revisar ahora” (Lesson 8 connects it). And the “Última revisión” (Last check) in the header is still written by hand: it will become true when the data really arrives, in Lesson 8.

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

        <p><button type="button">Revisar ahora</button></p>
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
    <p>Datos de ejemplo escritos a mano.</p>
  </footer>
</body>
</html>
```

Finally, the stylesheet. `css/styles.css` is the one from Lesson 5 with one change and one new block. The change: the Lesson 3 rule that right-aligned the times pointed at `th:last-child, td:last-child`, the last cell of each row. With the “Acción” column, the last cell is no longer the times one, so the rule now points at a class, `.number`, which `createRow` puts on the time cell and the HTML on its header. A selector that depends on position breaks as soon as someone adds a column; a named one does not. The new block goes at the end of the file and **reopens** the `components` layer: a layer can be opened as many times as needed, and what is added is added to what it already had, in order.

```css
@layer components {
  /* ---- Lección 7: la tabla que se dibuja desde los datos ---- */
  :root {
    --color-selected: #dbe9f8;
  }

  /* La fila del servicio elegido. */
  tr.selected {
    background: var(--color-selected);
  }

  /* Un botón que está «presionado» (aria-pressed="true") se distingue de los demás. */
  button[aria-pressed="true"] {
    background: var(--color-text);
  }

  /* Fuera de la vista, pero dentro del árbol de accesibilidad: lo lee un lector de pantalla. */
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  /* Un elemento con position: absolute se coloca respecto de su ancestro posicionado más
     cercano. Sin esta regla, el texto oculto de los botones escapa de la caja que se desplaza
     y ensancha la página entera a 320 px. */
  .table-scroll {
    position: relative;
  }
}
```

The new color is declared as a variable in `:root`, as Lesson 3 asks: the rest of the stylesheet writes no loose colors. And the last rule has a story. When testing the dashboard at 320 pixels without it, the page overflowed again: it was 498 px wide. The culprit was not the table, which stays inside its box, but the buttons' hidden text. An element with `position: absolute` is placed relative to its nearest *positioned* ancestor, and if there is none, relative to the whole page; that is how it escaped from the scrolling box and stretched the document. With `position: relative` on `.table-scroll`, the box becomes that ancestor, the hidden text stays inside and the measurement goes back to 320. It is the kind of defect that only whoever measures at 320 pixels after every change finds, not only in the layout lesson.

**Run the complete test.** Open the dashboard. The summary must say 5 services checked, 4 of 5 available, 1 down and 465 ms of average response time: the figures you wrote by hand in Lesson 2, now calculated by the functions of Lesson 6 and written by those of this one. Click “Ordenar por tiempo de respuesta”: “Notificaciones” rises to second place, behind “Catálogo”, which was already the fastest, and “Inventario”, which did not respond, goes to the end. Now **without touching the mouse**: press Tab until you reach a “Ver detalle” button, press Enter and check that the detail appears below and that focus stays on that same button. It is the behavior this lesson protects.

**One last security check.** Add to `js/services.js` a service, with its `id`, whose `name` is `<img src="x" onerror="document.title = 'hackeado'">`, reload and observe that the table shows that text, plain and simple, and the tab's title does not change. That is the difference between a dashboard that draws data and one that executes it. Remove the line when you finish.

## The error you will see

The most frequent error for someone starting with the DOM is writing the program **before** the element it looks for exists. Figure 7.7 provokes it on purpose, with an ordinary `<script>` (not a module) in the `<head>`:

```html
<!-- fig07_07.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 7.7 — El script corre antes que el documento (ERROR A PROPÓSITO)</title>
  <!-- Un script CLÁSICO en el <head>, sin defer: se ejecuta en cuanto el navegador lo lee. -->
  <script>
    document.querySelector("#message").textContent = "Hola";
  </script>
</head>
<body>
  <main>
    <p id="message">Esperando…</p>
  </main>
</body>
</html>
```

Open it, open the console with `F12` and you will see this:

```text
Consola de Chrome:
Uncaught TypeError: Cannot set properties of null (setting 'textContent')

Consola de Firefox:
TypeError: document.querySelector(...) is null

La página se queda con «Esperando…».
```

The message says, translated: “Cannot set property `textContent` of `null`”. It is a chain of causes:

1. An ordinary `<script>` runs **the instant the browser reads it**. Since it is in the `<head>`, the browser has not yet built the `<body>`.
2. `document.querySelector("#message")` looks for an element that does not exist yet and returns `null`, which is the answer “I found nothing”.
3. `null.textContent = "Hola"` is an impossible operation, because `null` has no properties. JavaScript stops there.

There are three ways of fixing it, and the best is the one you already use: **`<script type="module">`**, which defers itself, that is, runs when the document has already been read ([MDN: the `script` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script)). The others are adding `defer` to an ordinary script, or putting the script at the end of the `<body>`. Prefer the module: it also gives your variables their own scope (they do not dirty the global space) and turns on strict mode without your asking.

When the message is the same but the script *is* in a module, the cause is another: a misspelled selector (`#mesage` instead of `#message`) or a search on the wrong page. **Read the message from right to left**: which call returned `null`? Put `console.log(document.querySelector("#message"))` right before the line that fails; if it prints `null`, the problem is the selector or the timing, not what you do with it afterwards.

## What gets done wrong

- **Writing outside data with `innerHTML`.** The cost is the attack you saw in figure 7.3: whoever controls a text controls your page. It is fixed with `textContent` and nothing else; escaping the `<` and `>` signs by hand is the recipe for all the flaws that were fixed one by one over twenty years.
- **Leaving an `onclick="..."` in the HTML.** It is code written inside an attribute: it mixes structure with behavior, it can only point to global functions (and modules do not have them) and, as you will see in Lesson 11, a strict security policy blocks it completely. You write `addEventListener` in the JavaScript.
- **A `div` or a `span` with a click instead of a `button`.** It looks the same and it cannot be reached with Tab or activated with Enter. Fixing it demands `tabindex`, a `role` and two keyboard handlers, and even so it ends up worse than the native button.
- **Asking the document what the state is.** `if (boton.textContent === …)` turns the screen into the source of truth. The two copies contradict each other as soon as the text changes. The truth lives in the state object.
- **A new listener on every drawing, on an element that is not thrown away.** If in `render` you wrote `elements.body.addEventListener(...)`, every time it was redrawn **another** listener would be added to the same `<tbody>`, and on the second click the detail would be selected and deselected twice. Listeners are registered **once**, in `main.js`, not in the drawing.
- **Modifying the original array when sorting.** `services.sort(...)` changes the data array, and the original order is lost. You use `toSorted`, which returns a copy.
- **Reading measurements from the document while you write it.** Adding rows one by one is not, by itself, expensive: the browser waits for your code to finish and calculates the position of everything once before painting. What is expensive is interleaving reads of measurements (`offsetHeight`, `getBoundingClientRect()`) between one write and the next, because each read forces it to recalculate at that instant; web.dev calls it [*layout thrashing*](https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing). In the dashboard all the rows are built first and handed over together with `replaceChildren(...filas)` for another reason: in a single step the old rows are removed and the new ones put in, with no intermediate half-drawn states.
- **Building a selector by hand with a piece of data.** `querySelector('[data-id="' + id + '"]')` breaks with a quotation mark in the `id`. `CSS.escape` exists for this.
- **Putting outside data as a class name without checking it.** `row.className = service.status` lets the data decide which styles are applied. It is compared against a closed list, as `createRow` does.

## Exercises

### Exercise 1 — Break the dashboard on purpose

In `js/view.js`, change the line that writes the service's name so that it uses `innerHTML` instead of `textContent`. Then add to `js/services.js` a service whose `name` is `<img src="x" onerror="document.title = 'hackeado'">`. Before reloading, write in your logbook what you think will be seen in the row and in the tab. Reload, compare, and then undo both changes. Answer: which other texts in the dashboard, besides the name, would be a path for the same attack if they used `innerHTML`?

### Exercise 2 — The slowest, in the summary

Add to the summary a fifth pair: “Más lento” (Slowest), with the name and the time of the available service that takes longest to respond, for example “Búsqueda (950 ms)”. If no service responded, it must say “sin datos” (no data). Decide, and justify in one sentence, in which file each change goes: the calculation, the place on the page, the way of finding it and the text. Does `js/state.js` need to be touched?

### Exercise 3 — Escape clears the selection

Make it so that, when the Escape key is pressed, the service's selection is cleared, no matter where focus is. Hint: the event is called `keydown`, `evento.key` says which key it was, and it is listened to on `document`. Your change must touch `js/state.js` and `js/main.js`, and **not** `js/view.js`. Check with the keyboard that, after Escape, focus is still on the button it was on.

## Solutions

### Solution 1

In `createRow`, the line `nameCell.textContent = service.name;` becomes `nameCell.innerHTML = service.name;`. On reloading, the hostile service's row does not show the name (the image does not load and leaves no text) and the tab's title changes to “hackeado”. With the line restored, the row shows the complete text of the attack and the title does not move.

Answer to the question: the **status** (`service.status` goes through the closed list, so it is not a path, but it would be if it were written with `innerHTML`), the **time** (`${service.responseMs} ms`), the **summary** and the **detail**: any piece of data that comes from outside and is written with `innerHTML` is a path. A number is not safe either as soon as the data arrives over the network: nothing guarantees that `responseMs` is a number and not a text with HTML. That is why the rule does not distinguish between “dangerous data” and “harmless data”: **none enters with `innerHTML`**.

### Solution 2

The calculation is a question about the data and goes with the other calculations, in `js/stats.js`; the place on the page is one more pair of the `<dl>`, in `index.html`; finding that place is the job of `js/main.js`, which is the one that knows the `id`s; and writing the text is drawing, so it goes in `js/view.js`. `js/state.js` does not change, because the slowest is calculated from the list and is not something the dashboard has to remember.

```js
// js/stats.js — al final del archivo
export function slowestService(list) {
  return list
    .filter((service) => service.status === "available")
    .toSorted((a, b) => b.responseMs - a.responseMs)[0] ?? null;
}
```

It is the same idea as `slowest` from Exercise 2 of Lesson 6, but it returns the whole service and not its name, because the text needs both pieces of data. With a list with no available services, `[0]` gives `undefined` and `?? null` turns it into `null`, which is the course's way of saying “there is no data”. In `index.html`, one more pair at the end of the `<dl>`:

```html
<div>
  <dt>Más lento</dt>
  <dd id="summary-slowest"></dd>
</div>
```

In `js/main.js`, `slowest: document.querySelector("#summary-slowest"),` inside the `elements` object. And in `js/view.js`, it is imported alongside `summarize` and written in `render`, after the average:

```js
import { summarize, slowestService } from "./stats.js";
// …
  const slowest = slowestService(services);
  elements.slowest.textContent = slowest === null ? "sin datos" : `${slowest.name} (${slowest.responseMs} ms)`;
```

The summary says “Más lento: Búsqueda (950 ms)”. And since the `<dl>` from Lesson 5 counts its own columns, the fifth pair fits in by itself, without touching the CSS.

### Solution 3

A new function in `js/state.js` (the only way of changing the state is a function of the state):

```js
export function clearSelection(state) {
  state.selected = null;
}
```

In `js/main.js`, `clearSelection` is added to the `import` and, before the last line (`render(state, elements);`), the listener:

```js
// Escape quita la selección, esté donde esté el foco.
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") update(() => clearSelection(state));
});
```

`update` is used and not a bare `render` so that focus goes back to the button that had it. `js/view.js` does not change: it already knew how to draw the “no selection” case.

## How I know I got it

- [ ] With the repository's `programas/` folder served on your computer, when you open `07-dom-eventos-estado/fig07_03.html`, the tab's title changes to “Se ejecutó código que venía en un dato” (Code that came in a piece of data was run). In `fig07_04.html`, it does not.
- [ ] In `07-dom-eventos-estado/panel/`, the summary says 5, 4 of 5, 1 and 465 ms, and none of those figures is written in the HTML.
- [ ] The `<tbody id="services-body">` of your `index.html` has no hand-written rows, and the Inspector shows five.
- [ ] With the keyboard alone: Tab reaches “Ver detalle de Pagos”, Enter shows “Pagos: disponible, responde en 480 ms.” (Pagos: available, responds in 480 ms.) and focus stays on that button.
- [ ] `state-test.html` shows six lines that start with `ok`.
- [ ] At 320 px wide there is no horizontal scroll bar: in the console, `document.documentElement.scrollWidth <= document.documentElement.clientWidth` returns `true`.
- [ ] The browser console shows no error in the dashboard.
- [ ] You search for the word `innerHTML` in your `.js` files and it does not appear.

**Review of earlier lessons** (answer them without looking, and then check):

1. In Lesson 2: why is a `<button>` better than a `<div>` with a click?
2. In lessons 4 and 5: what does `flex-wrap` do and when is it better than an `@media` query?
3. In Lesson 6: why does a service that is down have `responseMs: null` and not zero?

## Further reading

- [MDN — Introduction to the DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction) — what the document tree is and how it is traversed; accessed on October 7, 2026.
- [MDN — Event bubbling](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling) — `target`, `currentTarget` and delegation explained step by step; accessed on October 7, 2026.
- [OWASP — DOM-based XSS prevention](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html) — the dangerous sinks and why `textContent` is the safe way; accessed on October 7, 2026.
- [MDN — `Element.innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) — the security warning with the `onerror` example; accessed on October 7, 2026.
