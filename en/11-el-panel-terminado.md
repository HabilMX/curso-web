# Lesson 11 — The finished dashboard

**Time:** two sessions of about 90 minutes. A split that works: the first one, “The why before the how”, the keyboard review (11.1), the content security policy (11.2) and the measurement of weight and performance (11.3), with the dashboard open and the browser developer tools at hand; the second one, publishing the site (11.4), the five criteria one by one on the published address (11.5) and the exercises. If publishing takes you longer than planned, session two is the one that stretches: the account and the steps of the service you choose are not up to you.

**What you build:** the `revisor` published as a static site, with its security headers and its measured numbers

**What you learn:** the keyboard review; the content security policy (CSP) as a server header; weight and performance; publishing a static site

## By the end you will be able to

- Go through the whole dashboard with the keyboard alone, and say which accessibility criterion is broken by what cannot be reached, cannot be seen or has no way out.
- Write a content security policy (CSP), explain what each directive blocks and why its place is a server header and not only a tag.
- Test that policy on your computer with the same headers the server will send, and read the violation messages in the console.
- Measure the dashboard's weight and its metrics (LCP, CLS, INP), and say which of them does not appear in a lab load test and why.
- Reserve the space for what arrives late and preload the modules, and check with numbers that it helped.
- Publish the folder as a static site and verify with `curl` that the headers arrived.
- Check one by one the five criteria with which the course closes.

## The why before the how

Until now your dashboard works on your computer, opened by your server, with your browser and with data you wrote. “It works on my machine” is a phrase that anyone who has published something knows well, and it is the distance between an exercise and a product. This lesson covers that distance: it reviews the dashboard as a person who is not you would, protects it with one more layer, measures it and puts it on the internet.

The course also promised an exit criterion. The [syllabus](README.md) says it does not end when you have read Lesson 11, but when your dashboard meets five things. No program checks them for you: you check them yourself, with the browser developer tools, and this lesson tells you how:

| # | The dashboard meets… | Where it was learned | Where it is checked today |
|---|---|---|---|
| 1 | It can be navigated completely with the keyboard | 2, 3, 4, 5 and 7 | 11.1 |
| 2 | There is not a single error in the console | 8, 9 and 10 | 11.2 and 11.5 |
| 3 | It works at 320 px wide without horizontal overflow | 5 | 11.1 |
| 4 | It shows the three states: loading, error and empty | 9 | 11.5 |
| 5 | Text that comes from outside is drawn with `textContent`, never with `innerHTML` | 7 | 11.2 and 11.5 |

Section 11.5 closes the five with a test for each. Before that, three new ideas: the content security policy (11.2), measuring weight and performance before trying to improve them (11.3) and publishing a static site (11.4). 11.1 is a keyboard review, not a new idea.

### The dashboard's state at the close of Lesson 10

This lesson starts from a concrete dashboard. At the close of Lesson 10, the `revisor` has everything from Lesson 9 plus the forms:

- `index.html` with the header (the “Última revisión” (Last check) and the navigation), the summary, and in the services section the notices (`#notice`, `#error-notice`), the “Reintentar” (Retry) button and a data zone with the search field, the “Mostrar” (Show) radios, “Revisar ahora” (Check now), the sort button, the count notice and the table; and a section for adding a service.
- `css/styles.css` with the layers and the rules from lessons 3, 4, 5, 7, 9 and 10.
- `js/stats.js`, `js/load.js`, `js/state.js`, `js/filters.js`, `js/form.js`, `js/view.js` and `js/main.js`, with the data in `data/services.json` and `data/services-empty.json`.
- A dashboard that filters, sorts, adds services with native validation and messages that a screen reader can announce, and that accepts `?case=empty`, `?case=error`, `?case=invalid` and `?case=timeout`.

What it **does not have yet**: any security header (the Python server only sends the minimum), any measurement of weight or speed, an icon that is a shortcut, and any address another person can open. In this lesson the dashboard moves to the `11-el-panel-terminado/revisor/` folder, which is Lesson 10 plus small changes, all explained below: a headers file, an icon of its own, a few lines in the `<head>` and one last block of CSS.

Everything in this lesson uses what you already have: the usual server from the `programas/` folder of the [course repository](https://github.com/HabilMX/curso-web) for the figures (this lesson's are in [`programas/11-el-panel-terminado/`](https://github.com/HabilMX/curso-web/tree/main/programas/11-el-panel-terminado)), and a slightly longer Python server (just one, of about 55 lines, which you see in full below) to test the headers. No Node and no packages.

## The concepts

### 11.1 The keyboard review

Criterion 1 says the dashboard can be navigated completely with the keyboard, without using the mouse. It is checked by doing it, not by reading the code. There are four questions, and each corresponds to a criterion of the accessibility guidelines (WCAG 2.2):

1. **Can everything be reached?** Everything that can be done with the mouse must be doable with the keyboard ([2.1.1, Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html), level A). Native elements —`<button>`, `<input>`, `<select>`— already meet it. What breaks is what you built by hand: a `<div>` with a click.
2. **Can you see where you are?** The focus indicator must be visible ([2.4.7, Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html), level AA). That is why `css/styles.css` has `:focus-visible { outline: 3px solid … }` since Lesson 3 and never an `outline: none`.
3. **Does the order make sense?** Focus must go through the controls in an order that preserves meaning and allows operation ([2.4.3, Focus Order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html), level A). The practical rule: the HTML order is the focus order, so there is no need —and it is almost never advisable— to touch it with a positive `tabindex`.
4. **Can you get out?** If focus enters a component, it must be able to leave it with the keyboard alone ([2.1.2, No Keyboard Trap](https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html), level A).

And two more criteria of version 2.2 that are met effortlessly, if you know them: focus must not be completely covered by content you placed ([2.4.11, Focus Not Obscured (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html), level AA; a fixed header is the typical culprit, and the dashboard has none) and controls must measure at least 24 × 24 CSS pixels or have space around them ([2.5.8, Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), level AA; the dashboard's fields and buttons have a minimum height of 2.5 rem, which with the default font size is 40 pixels: measured in Chrome, all are 40 high).

**Predict:** in the dashboard, how many times do you have to press Tab, starting on the freshly loaded page, to reach the “Agregar servicio” (Add service) button? Think about what comes before: the two navigation links, the search field, the radio group, “Revisar ahora”, the sort button, the table's box, a “Ver detalle” (View detail) button for each service, and the three form fields.

Paste this fragment into the console with the dashboard open (`Ctrl+Shift+K` in Firefox, `F12` and the Console tab in Chrome). It lists, in order, everything the keyboard can reach. The filter's second condition leaves a single radio per group, the checked one, because a radio group is a single Tab stop (you saw it in Lesson 2):

```js
const stops = [...document.querySelectorAll("a[href], button, input, select, textarea, [tabindex]")]
  .filter((e) => !e.disabled && e.tabIndex >= 0 && e.getClientRects().length > 0)
  .filter((e) => e.type !== "radio" || e.checked);
console.log(stops.map((e) =>
  `${e.tagName.toLowerCase()} · ${(e.labels?.[0]?.textContent ?? e.textContent).trim().slice(0, 30)} · tabindex ${e.tabIndex}`
).join("\n"));
```

In this lesson's dashboard, with the five services loaded, it prints sixteen lines:

```text
a · Resumen · tabindex 0
a · Servicios · tabindex 0
input · Buscar servicio · tabindex 0
input · Todos · tabindex 0
button · Revisar ahora · tabindex 0
button · Ordenar por tiempo de respuest · tabindex 0
div · Estado de los servicios en la  · tabindex 0
button · Ver detalle de Catálogo · tabindex 0
button · Ver detalle de Pagos · tabindex 0
button · Ver detalle de Inventario · tabindex 0
button · Ver detalle de Notificaciones · tabindex 0
button · Ver detalle de Búsqueda · tabindex 0
input · Nombre * · tabindex 0
select · Estado * · tabindex 0
input · Tiempo de respuesta (ms) * · tabindex 0
button · Agregar servicio · tabindex 0
```

There are sixteen stops, so the answer to the prediction is sixteen times; I checked it by really pressing Tab, and focus goes through exactly that list and in that order. What matters about the list is not the number but what does **not** appear: no `tabindex` other than zero (they all say 0), no link without a destination, and a single `div`, which is there on purpose: it is the table's box, which Lesson 5 made focusable so that the keyboard can scroll it. If in your dashboard some line says `tabindex 3`, or if an action of the dashboard does not appear in the list, that is where the defect is.

The complete walkthrough, which takes ten minutes and is worth doing slowly:

- With Tab, move through the whole page; with Shift+Tab, go back. At each stop, check that you see the focus outline.
- In the search field, type `pag`: the table must be left with one row without your touching the mouse.
- In the status selector, change it with the arrows.
- On a “Ver detalle” button, press Enter or the space bar: the detail appears below the table and focus stays on the same button (Lesson 7 made `update` return it there after redrawing).
- In the form, with focus in a field, press Enter with everything empty: focus jumps to the first field with an error. Correct and submit: focus returns to “Nombre” (Name).
- Open `?case=error` and reach “Reintentar” with Tab alone. Press it: focus stays on it (Lesson 9 made `load` return it).

**At 320 pixels.** Criterion 3 asks that the dashboard work at 320 pixels wide without a horizontal scroll bar. It is not an arbitrary number: it is the [reflow criterion (1.4.10)](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html), level AA, which is equivalent to a 1280-pixel screen with zoom at 400% and exists for whoever enlarges text. It is checked in one line of the console:

```js
document.documentElement.scrollWidth <= document.documentElement.clientWidth
```

If it returns `false`, something sticks out. The dashboard arrives at this lesson meeting it since Lesson 5, which put the table in a box that scrolls, and Lesson 7 had to defend it: the hidden text of the “Ver detalle” buttons escaped from that box and stretched the page to 498 px, until `position: relative` on `.table-scroll` brought it back inside. It is the lesson of this criterion: it is not met once, it is measured again after every change.

**Automatic tools.** Before accepting the review as good, run an auditor. In this lesson axe-core 4.14.0 was used, the engine behind many accessibility extensions, on the dashboard in its five situations (normal and the four `?case=` cases): zero violations. Also Lighthouse, which we detail below, gave 100 in accessibility. But a zero does not mean “accessible”: it means “none of the defects a machine knows how to recognize”. A machine can see that a field has a label; it cannot know whether the error message is understood. That is why nothing replaces the walkthrough with the keyboard and, if you can, with a screen reader.

### 11.2 The content security policy, as a header

**Two layers.** In Lesson 7 you learned the first defense against code injection attacks (XSS): text that comes from outside enters the page with `textContent`, which treats it as text and never as HTML. It is the defense that counts, because it prevents the problem from happening. A content security policy —CSP— is a second layer, for the day the first fails: a distracted programmer who writes `innerHTML` where they should not, a third-party library with a defect. MDN says it in exact words in its [CSP guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP): a CSP is not a substitute for correct handling of input; both things must be done, to have defense in depth.

**What it is.** A CSP is a list of rules that **the server sends to the browser** about what the page may load and run. “Scripts may only come from my own site”, “images, the same”, “the page cannot connect to anybody else”. The browser enforces them: if something violates a rule, it blocks it and notes it in the console. The simplest policy is `default-src 'self'`, which says: everything the page loads must come from its own origin.

**Header or tag.** A CSP can arrive in two ways. As an HTTP **response header** —`Content-Security-Policy: …`, the recommended way, which is sent with every response, not only with the page— or as a `<meta http-equiv="Content-Security-Policy" content="…">` tag inside the HTML. The tag exists for whoever does not control the server, and so it is used in the simplest static sites. But it is not the same. MDN warns that the tag “does not support all the features”: it cannot deliver a policy in report-only mode, and the `frame-ancestors` directive (which prevents other pages from putting you in a frame) [does not work inside a tag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors). The header, on the other hand, covers everything.

That is why the syllabus says “CSP as a server header”. But let us start with the tag, which can be tested with a file and without a special server.

**Predict:** figure 11.1 has a tag with the policy `script-src 'self'` and two scripts: one written inside the HTML and another in a file of the same site. Which one runs?

```html
<!-- fig11_01.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="Content-Security-Policy" content="script-src 'self'">
  <title>Una política que bloquea el script en línea</title>
  <link rel="icon" href="data:,">
</head>
<body>
  <main>
    <h1>Una política que bloquea el script en línea</h1>
    <p id="result" role="status">Ningún script se ha ejecutado.</p>
  </main>

  <script>
    document.getElementById("result").textContent = "El script en línea sí se ejecutó.";
  </script>
  <script src="fig11_01/external.js"></script>
</body>
</html>
```

```js
// fig11_01/external.js
document.getElementById("result").textContent = "El script externo sí se ejecutó.";
```

Open it at `http://127.0.0.1:8000/11-el-panel-terminado/fig11_01.html`, with the server running from the repository's `programas/` folder. When loaded, the page shows:

```text
Una política que bloquea el script en línea
El script externo sí se ejecutó.
```

Only the external script ran. The one inside the HTML was blocked, and the console says why. It is the message you will see most often in your life with a CSP, and it is worth reading in full:

```text
Executing inline script violates the following Content Security Policy directive 'script-src 'self''. Either the 'unsafe-inline' keyword, a hash ('sha256-bTp6bKDsmuoAZZxMFjB9R21R8gPJ7kRwjoDZhQv8XQo='), or a nonce ('nonce-...') is required to enable inline execution. The action has been blocked.
```

Read it in parts. “Executing inline script violates … `script-src 'self'`” says what was blocked (an inline script) and which rule blocked it. “Either the 'unsafe-inline' keyword, a hash, or a nonce is required to enable inline execution” lists the three ways of allowing it: open the rule completely, or authorize *that* specific script with a fingerprint (`hash`) or a one-use number (`nonce`). And “The action has been blocked” confirms it did not run. The sample's `hash` is that of that exact script; in yours it will be the same, because the script is the same.

Notice what this means for an attacker: a policy like this prevents, by itself, an injected fragment —`<script>…</script>`, or an `onerror="…"` attribute— from running, even if it has reached the page. And notice what it means for you: **your code has to live in files** and register its events with `addEventListener`. The dashboard does it that way since Lesson 7. That is why the policy we will write now breaks nothing in it.

**The dashboard's policy, directive by directive.** A directive is a rule for a type of resource. The `revisor`'s is this one:

| Directive | Value | What it prevents |
|---|---|---|
| `default-src` | `'none'` | any load that another directive does not explicitly authorize |
| `script-src` | `'self'` | scripts that are not files of the same site: inline, from another domain, `eval()` |
| `style-src` | `'self'` | stylesheets from other sites and `style` attributes written in the HTML |
| `img-src` | `'self'` | images from other sites and `data:` ones |
| `connect-src` | `'self'` | `fetch` requesting data from another domain |
| `form-action` | `'none'` | a form sending its data anywhere |
| `base-uri` | `'none'` | someone changing the base address with a `<base>` tag |
| `frame-ancestors` | `'none'` | another page embedding yours in a frame (only works as a header) |

`'self'` means “the same origin as the page” (scheme, host and port, the ones you studied in Lesson 0). The single quotation marks are part of the word. `default-src` is the fallback value: if there is no directive for a type of resource, `default-src` rules. Starting with `'none'` forces you to allow each thing on purpose, and that is what you want: a short list you can read in full.

The dashboard uses no fonts from other sites, no external images, not a single third-party script. Its policy can be this closed because you wrote its code, in your files.

**The headers file.** Static site publishing services read a file called `_headers` (no extension) that sits in the folder you publish. [Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/headers/) and [Netlify](https://docs.netlify.com/manage/routing/headers/) accept it with the same syntax: a line with the path it applies to, and below, indented, one header per line. These are the `revisor`'s:

```text
# revisor/_headers
# Encabezados que el servidor debe enviar con cada respuesta.
# Cloudflare Pages y Netlify leen este archivo con esta misma sintaxis.
/*
  Content-Security-Policy: default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; form-action 'none'; base-uri 'none'; frame-ancestors 'none'
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
```

Besides the CSP, it has two other cheap headers. [`X-Content-Type-Options: nosniff`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Content-Type-Options) tells the browser not to guess a file's type: if the response says it is text, it is text, and a script only runs if the server declares it to be JavaScript. And [`Referrer-Policy: no-referrer`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Referrer-Policy) prevents the browser from telling other sites which page you come from; the dashboard links to nobody, so it costs nothing.

**Testing it on your computer.** The usual server (`python3 -m http.server`) does not read `_headers`. To see the same thing the server where you publish will see, this Python program does the same as `http.server` and also sends the file's headers. It serves any folder; read it in full, because it is about 55 lines and there is nothing hidden:

```python
# headers-server.py
# Sirve una carpeta como lo hace `python3 -m http.server`, pero además envía los
# encabezados que declara el archivo _headers de esa carpeta. Así pruebas en tu
# computadora lo mismo que va a enviar el servidor donde publiques. Y, como el
# slow-server.py de la lección 9, entiende ?delay=MILISEGUNDOS para tardar a propósito.
#
# Uso:  python3 headers-server.py [carpeta] [puerto]
import fnmatch
import sys
import time
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlsplit

# Nadie necesita esperar más de diez segundos para ver el efecto.
MAX_DELAY_MS = 10000


def read_rules(folder):
    """Devuelve una lista de (patrón de ruta, encabezado, valor)."""
    rules = []
    pattern = None
    headers_file = Path(folder) / "_headers"
    if not headers_file.exists():
        return rules
    for line in headers_file.read_text(encoding="utf-8").splitlines():
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        if not line[0].isspace():
            pattern = line.strip()  # una ruta: "/*" o "/index.html"
            continue
        name, _, value = line.strip().partition(":")
        rules.append((pattern, name.strip(), value.strip()))
    return rules


class Handler(SimpleHTTPRequestHandler):
    rules = []

    def do_GET(self):
        # Lo mismo que slow-server.py: ?delay=3000 espera tres segundos antes de contestar.
        query = parse_qs(urlsplit(self.path).query)
        delay = query.get("delay", ["0"])[0]
        if delay.isdigit():
            time.sleep(min(int(delay), MAX_DELAY_MS) / 1000)
        try:
            super().do_GET()
        except (BrokenPipeError, ConnectionResetError):
            # El navegador se cansó de esperar y cerró la conexión.
            pass

    def end_headers(self):
        path = self.path.split("?", 1)[0]
        for pattern, name, value in self.rules:
            if fnmatch.fnmatch(path, pattern):
                self.send_header(name, value)
        super().end_headers()


def main():
    folder = sys.argv[1] if len(sys.argv) > 1 else "."
    port = int(sys.argv[2]) if len(sys.argv) > 2 else 8000
    Handler.rules = read_rules(folder)
    print(f"{len(Handler.rules)} encabezados leídos de {folder}/_headers", flush=True)
    server = ThreadingHTTPServer(
        ("127.0.0.1", port), partial(Handler, directory=folder)
    )
    print(f"Sirviendo {folder} en http://127.0.0.1:{port}  (Ctrl+C para parar)", flush=True)
    server.serve_forever()


main()
```

From the `programas/11-el-panel-terminado/` folder of the downloaded repository:

```bash
python3 headers-server.py revisor 8000
```

It must print `3 encabezados leídos de revisor/_headers` (3 headers read from revisor/_headers) and the address. Open it and check, in another terminal, that the headers arrive:

```bash
curl -sI http://127.0.0.1:8000/ | grep -i -E "content-security|nosniff|referrer"
```

The three lines must come out. If none comes out, the server did not read the file, and it is better to know now than after publishing. (To stop the server, `Ctrl+C`.) The code also carries the `?delay` of Lesson 9's `slow-server.py` —the same lines, in `do_GET`—, so that `?case=timeout` keeps provoking a real timeout with this server.

**The error that appears as soon as you turn it on.** With that policy active, the console of the Lesson 10 dashboard says something you did not expect:

```text
Loading the image 'data:,' violates the following Content Security Policy directive: "img-src 'self'". The action has been blocked.
```

It is the icon. Since Lesson 2, the dashboard carries `<link rel="icon" href="data:,">`, the trick from Exercise 2 of Lesson 1 so that the browser does not request `/favicon.ico` and fill the console with 404 errors; Lesson 2 warned that it had a cost, and this is it. But a `data:` image is not from the same site, and the policy (`img-src 'self'`) blocks it. There are two ways out: open the policy with `data:` in `img-src`, or give the site an icon of its own. The second is better, because a published site should have an icon anyway. The `revisor` brings a two-line `favicon.svg` file (a dark square with a green circle) and the `<head>` links it with `<link rel="icon" href="favicon.svg" type="image/svg+xml">`:

```html
<!-- revisor/favicon.svg -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#1b1f24"/><circle cx="16" cy="16" r="7" fill="#1a7f37"/></svg>
```

The first line is a comment, as in web pages; in an SVG it is allowed before the `<svg>` tag. The main current browsers accept an SVG icon (in this lesson it was checked in Chrome and Firefox, not in Safari); one that does not accept it will request `/favicon.ico` and see the 404, something you can accept in an internal dashboard.

**Test before imposing.** A new policy can break something you did not see. The way to find out without breaking anyone is the sibling header `Content-Security-Policy-Report-Only` ([MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy-Report-Only)): the same policy, but the browser only *notes* the violations and blocks nothing. To try it, change the header's name in `_headers`, reload and look at the console. In Chrome 154, with the Lesson 10 `data:,` icon still in place, the violation appears as an informational message: “Loading the image 'data:,' violates the following Content Security Policy directive: "img-src 'self'". The policy is report-only, so the violation has been logged but no further action has been taken.” MDN warns that, for the reports to be *sent* somewhere, the policy needs the `report-to` directive and a server that receives them; without them, you only see what comes out in your console. For a small site, looking at the console is enough. When there are no messages, you go back to the name `Content-Security-Policy` and the policy begins to be enforced.

**What a CSP does not do.** Do not let it lead you to believe the problem is solved. Figure 11.2 inserts, with `innerHTML`, a name with an attack inside (a broken image with an `onerror` attribute), under the same policy:

```html
<!-- fig11_02.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="Content-Security-Policy" content="script-src 'self'">
  <title>La política no arregla el innerHTML</title>
  <link rel="icon" href="data:,">
</head>
<body>
  <main>
    <h1>La política no arregla el innerHTML</h1>
    <p id="result" role="status"></p>
    <div id="zone"></div>
  </main>

  <script src="fig11_02/inject.js"></script>
</body>
</html>
```

```js
// fig11_02/inject.js
// Un nombre que viene de fuera y trae un ataque dentro.
const incoming = '<img src="missing.png" onerror="document.title = \'atacado\'">';

// MAL: innerHTML interpreta el texto como HTML.
document.getElementById("zone").innerHTML = incoming;

const images = document.querySelectorAll("#zone img").length;
document.getElementById("result").textContent =
  `Imágenes inyectadas: ${images}. Título de la página: ${document.title}`;
```

Predict: does the `onerror` attribute run? Does the image stay on the page?

```text
La política no arregla el innerHTML
Imágenes inyectadas: 1. Título de la página: La política no arregla el innerHTML
```

The image stayed: the injected HTML is on the page, `1`. But the document's title did not change: the attribute did not run, and the console says why (besides the 404 of an image that does not exist):

```text
Executing inline event handler violates the following Content Security Policy directive 'script-src 'self''. Either the 'unsafe-inline' keyword, a hash ('sha256-...'), or a nonce ('nonce-...') is required to enable inline execution. Note that hashes do not apply to event handlers, style attributes and javascript: navigations unless the 'unsafe-hashes' keyword is present. The action has been blocked.
```

That is the CSP doing its job as a second layer: it contained the damage. But the damage that did happen —foreign HTML inside your page— is exactly what `textContent` prevents. The CSP does not repair a badly placed `innerHTML`; it only reduces what it can do. And not every attack needs a script: someone who injects a fake form or a misleading text does not need to run anything.

**What is coming.** There are two newer mechanisms that attack the same problem from another side, and for now they are not the basis of anything you write here. **Trusted Types** ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API)) make assigning a loose text to `innerHTML` throw an error, if the policy demands it with `require-trusted-types-for 'script'`; MDN marks it as “Baseline 2026, newly available” (since February 2026). **`setHTML()` and the Sanitizer API** ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/setHTML)) would clean the HTML before inserting it; MDN marks it as limited availability, not Baseline. The course rule stands: they are not used in production until they are Baseline. For your dashboard, `textContent` already does the job.

**The tag, when there is no other way.** If the site where you publish does not let you send headers —the GitHub Pages documentation consulted to prepare this lesson describes no way of doing it, and so it is wise to check with `curl -I` on your published site—, the `<meta>` tag is better than nothing. The dashboard's `index.html` **does not carry it**, because its policy travels in `_headers`; if you publish where headers are not read, you add it yourself. It is this line, with the same directives as `_headers` minus `frame-ancestors`, which does not work inside a tag and the browser ignores with a warning:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; form-action 'none'; base-uri 'none'">
```

It goes as high as possible in the `<head>`, right below `<meta charset="utf-8">`: the [CSP specification](https://www.w3.org/TR/CSP3/) warns that a policy in a tag does not apply to what appears before it, so a `<link>` or a `<script>` written higher up would be left out. It was checked this way, with the dashboard served by the usual `python3 -m http.server` (which sends no headers) from a subfolder, as GitHub Pages serves it: the table, the four `?case=` cases and the console without a single message, except the provoked 404 of `?case=error`. You will lose `frame-ancestors` and the report-only mode, and you must tell yourself plainly that your site has a weaker CSP than that of a server that does send headers.

### 11.3 Weight and performance: measure before optimizing

The most common performance improvement is the one that was not needed. An alarming number is seen, a recipe from an article is applied, and nobody measures again. The discipline of this section is the opposite: **first you measure, then you decide, and at the end you measure again.**

**The weight.** The first thing measured is the simplest: how many bytes what the browser downloads weighs. From the `revisor/` folder:

```bash
wc -c index.html favicon.svg css/*.css js/*.js data/services.json
```

The result, rounded, and what each type would weigh compressed, calculated with `gzip -9 -c file | wc -c`. That second column is an **estimate**, not a measure of what travels: publishing services usually compress text responses, but each server decides whether to compress and with which algorithm (`gzip`, `br`…), and only the response's `Content-Encoding` header says what was really applied ([RFC 9110, §8.4](https://www.rfc-editor.org/rfc/rfc9110.html#section-8.4)). In 11.4 you check it with `curl` on your published site:

| Type | Files | Bytes | Compressed (approx.) |
|---|---|---|---|
| HTML | `index.html` | 5,374 | 1,742 |
| CSS | `css/styles.css` | 11,192 | 3,722 |
| JavaScript | seven modules | 20,731 | 8,577 |
| Data | `data/services.json` | 439 | 211 |
| Icon | `favicon.svg` | 194 | 180 |
| **Total** | | **37,930** | **about 14,400** |

Thirty-seven thousand bytes uncompressed and about fourteen thousand if the server compresses. The stylesheet is half of what it seems: a good part of its eleven thousand bytes are the comments explaining each rule, and compressed they almost disappear. A single phone photograph weighs hundreds of times that. The conclusions are three. One: for this dashboard, **reducing bytes is not the problem**. There is no need to minify or bundle, and it is not worth complicating a course “without a single build tool” to save three kilobytes. Two: the heaviest module is `js/main.js` (7,165 bytes), because it is where the form lives. Three: if one day the dashboard had images, that is where the weight would be, and then yes you would have to measure again.

**The three metrics.** The performance a person feels is summed up in three numbers, called the Core Web Vitals, defined by [web.dev](https://web.dev/articles/vitals). Each is evaluated at the 75th percentile of visits, that is, the value that 75% of visits match or improve on:

| Metric | What it measures | Good |
|---|---|---|
| [LCP](https://web.dev/articles/lcp) (Largest Contentful Paint) | when the main content appears | 2.5 s or less |
| [INP](https://web.dev/articles/inp) (Interaction to Next Paint) | how long the page takes to respond to a click, a tap or a key | 200 ms or less |
| [CLS](https://web.dev/articles/cls) (Cumulative Layout Shift) | how much the page moves by itself, without the person doing anything | 0.1 or less |

For INP, web.dev considers poor anything over 500 ms; for CLS, anything over 0.25.

**Lab and field.** A detail that decides which tool to use and what to believe from it. “Field” metrics are measured with real people using the page. “Lab” ones are measured on your computer, with a simulated profile. LCP and CLS can be measured on both sides. **INP needs someone to interact**, and that changes everything. A load test in the lab —opening the page and measuring, without touching it— produces no INP, because nobody clicked; Lighthouse in its normal mode is like that, and instead it reports *total blocking time* (TBT), which web.dev considers a reasonable approximation but not a substitute. INP *can* be measured in the lab if you interact during the measurement, but, as the [INP guide](https://web.dev/articles/inp) warns, the number depends on which interactions you made; the one that counts is that of real people, in the field. That is why a 100 in Lighthouse is not “perfect performance”: it is “no problems in what Lighthouse knows how to measure”. When you have real visits, those measurements are in your publishing service's reports tool or in Chrome's public data; meanwhile, what is within your reach is the lab.

**Measuring in the console.** To see your dashboard's LCP and CLS without installing anything, open the dashboard, and paste this in the console:

```js
const result = { lcp: null, cls: 0 };
new PerformanceObserver((list) => {
  result.lcp = Math.round(list.getEntries().at(-1).startTime);
}).observe({ type: "largest-contentful-paint", buffered: true });

let burst = 0;  // suma de la ráfaga (ventana de sesión) en curso
let burstStart = 0;
let lastShift = 0;
new PerformanceObserver((list) => {
  for (const shift of list.getEntries()) {
    if (shift.hadRecentInput) continue;
    const sameBurst = burst > 0
      && shift.startTime - lastShift < 1000
      && shift.startTime - burstStart < 5000;
    if (sameBurst) {
      burst += shift.value;
    } else {
      burst = shift.value;
      burstStart = shift.startTime;
    }
    lastShift = shift.startTime;
    result.cls = Math.max(result.cls, burst);
  }
}).observe({ type: "layout-shift", buffered: true });
setTimeout(() => console.log(result), 300);
```

`buffered: true` asks the browser for the entries that already happened before you pasted the code, and `hadRecentInput` discards the shifts caused by something the person did (which do not count). The rest of the second observer follows the [current definition of CLS](https://web.dev/articles/cls): shifts are not all added up, but by **bursts** (session windows). A shift belongs to the current burst if it arrives less than a second after the previous one and the burst has not yet lasted five seconds; if not, a new burst begins. The CLS is the burst that adds up the most (`Math.max`). Before 2021 CLS was the sum of all the shifts in the page's life, and that is why you will still see fragments that just do `cls += value`: in a page that stays open a long time, that sum grows without limit and can no longer be compared with the thresholds of 0.1 and 0.25. In the dashboard, the two calculations give the same result, because the whole load produces a single shift; the correct fragment is the one that works for any page. On your computer, without throttling the network, the dashboard gives an LCP of about 20 to 60 ms and a CLS of almost 0: so fast there is nothing to improve. But that is fooling yourself: your computer and your local network are not those of whoever will open the dashboard from a phone.

**A slow profile.** In the browser developer tools, the **Network** tab (in Chrome and in Firefox) lets you choose a slow connection profile. For this lesson a fixed profile was used, so that the numbers can be repeated: 150 ms of latency per request and 200 KB/s of download, without cache, with the window at 1280 and at 320 pixels wide, three runs of each. **They are simulated numbers in Chrome 154, in an automated way**; yours will be different, and what counts is the difference between before and after on your machine.

| | Lesson 10 dashboard | This lesson's dashboard |
|---|---|---|
| CLS at 1280 px | 0.077 | 0.001 |
| CLS at 320 px | 0.831 | 0.001 |
| LCP | 420 to 440 ms | 468 to 484 ms |
| The request for `data/services.json` starts at | about 790 ms | about 550 ms |
| The table appears at | about 950 ms | about 715 ms |

Two things changed a lot and one did not change. The CLS at 1280 px was under the 0.1 threshold, but at 320 px it was 0.831: more than three times the limit of “poor”, at the width that matters most. And the table, which is what the person came to see, appears about 230 ms earlier. What did not change is the LCP, and it is worth understanding why: the largest element the browser paints is the title “Revisor de servicios” (Services checker), which is in the HTML and is painted before any data arrives; speeding up the data does not move it (the variations of a few tens of milliseconds are within what changes from one run to another). A metric measures what it measures: the LCP does not know when your table appeared, and that is why this lesson also measures that moment. Let us look at the causes.

**The waterfall.** In the Network tab, each file is a bar, and the order in which the bars start tells the story of the load. The browser downloads `index.html`, and only then discovers `main.js`. It downloads `js/main.js`, and only then discovers that it imports `js/load.js`, `js/state.js`, `js/view.js` and `js/form.js`. It downloads `js/state.js`, and only then discovers that it imports `js/filters.js`; it downloads `js/view.js`, and discovers `js/stats.js`. And the data request does not go out until all of that has been run. Each “only then” is a round trip to the network; with 150 ms of latency, four levels add up to half a second, and the person sees “Cargando servicios…” (Loading services…) all that time.

The solution is to tell the browser, from the start, which modules it is going to need, with `rel="modulepreload"` ([MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/modulepreload)): in the `<head>`, one line per module, so that it downloads them all in parallel from the first moment. MDN places it as available in all browsers since September 2023 and warns not to preload *everything*, so as not to take bandwidth away from what is urgent. With six modules of a few kilobytes, there is no risk.

**The shift.** The CLS came from a measurement with the layout instability API, which also says *which elements* moved. In the Lesson 10 dashboard, at 320 px, the `<main>` and the `<nav>` moved (from vertical position 134 to 160), the summary rows and the footer. Three causes, and all three are the same thing: something that **arrives late** and pushes what was already there. The first, the “Última revisión”: the header says “todavía no” (not yet), on one line, and when the date arrives, at 320 px, it takes two; everything below goes down 26 px. The second, the summary figures: an empty `<dd>` has no height, and when it is filled, its row grows. The third, the footer: while loading, the page is short and the footer is in view; when the table appears, it pushes it off the screen, and the browser counts that as a shift.

The solution is called **reserving the space**: you tell the page how much what will arrive will occupy, before it arrives. It is one last block at the end of `css/styles.css`, and the “Última revisión” `<p>` gains the class `last-check` so it can be targeted:

```css
@layer components {
  /* ---- Lección 11: reservar el hueco de lo que llega tarde ---- */
  /* Las cifras del resumen se escriben cuando llegan los datos. Un <dd> vacío no tiene
     altura; un espacio que no se ve le da su línea mientras tanto, del mismo alto que la cifra. */
  .summary dd:empty::before {
    content: "\00a0";
  }

  /* En una pantalla angosta, «Última revisión» y la fecha ocupan dos líneas cuando la
     fecha llega; se reservan desde el principio (2 × 1.6rem). */
  @media (width < 30rem) {
    .last-check {
      min-height: 3.2rem;
    }
  }

  /* El pie de página no tiene por qué verse mientras los datos llegan: con el contenido
     principal de al menos el alto de la ventana, la tabla que aparece ya no lo empuja
     dentro de la pantalla. align-content: start impide que la rejilla reparta ese alto
     de sobra entre sus renglones. */
  .layout {
    min-height: 100vh;
    align-content: start;
  }
}
```

Each rule has its measurement story. The summary one was first tried as `min-height: 2rem` on the `<dd>`, which seemed the obvious thing, and made things worse in the compact rows from Lesson 5: an empty `<dd>` has no baseline, and the row aligned by the baseline (`align-items: baseline`) settled differently than with the figure. A non-breaking space (`\00a0`) generated with `::before` does have a baseline, and the `<dd>` measures the same empty or full. It is generated only while the `<dd>` is empty (`:empty`), and a space is not read aloud. The footer rule was first tried on `main`, and the shift got worse: the extra height was divided among the grid rows and moved the sections; `align-content: start` leaves everything at the top. It is the same idea with which Lesson 10 reserved the line for each form error, and web.dev's warning in its CLS guide applies here: reserving space is an estimate. If the text turns out longer, it will shift a little; if shorter, there will be a gap. The decision is one of design: a small gap is better than a shift.

**What was not done, and why.** Nothing was minified: the dashboard would weigh about fourteen kilobytes over the network with a server that compresses. `loading="lazy"` was not used: there are no images; and when there are, the page's main image must never carry it, because it delays the LCP. Neither `async` nor `defer` was used on the `<script>`: modules (`type="module"`) defer themselves. Each of these recipes is good in its place, and each would have been noise here. Not optimizing what is already good is part of the discipline.

**The Lighthouse panel.** To close, the auditor. In Chrome: developer tools, **Lighthouse** tab, “Analyze page load”. The [Chrome documentation](https://developer.chrome.com/docs/lighthouse/overview) today lists five groups of checks: performance, accessibility, best practices, SEO and a new one, “agentic browsing”, which measures how easy it is for an automated program to understand and use the page. That fifth group entered the usual configuration in version 13.3.0, of May 2026 ([release notes](https://github.com/GoogleChrome/lighthouse/releases/tag/v13.3.0)), and its own [scoring page](https://developer.chrome.com/docs/lighthouse/agentic-browsing/scoring) warns that it is **experimental**, that it is based on standards that are still proposed and that it does not give a score from 0 to 100, but a fraction: how many of its applicable checks you passed. On the finished dashboard, Lighthouse 13.5.0 shows it as **2/2**: the two that apply pass (that the accessibility tree is well formed and the CLS), and the other five come out as “not applicable”, because they check pieces the dashboard does not have (three about WebMCP, an `llms.txt` file and an `ai-catalog.json`). Even so, it is not taken into account here, following the course rule of not relying on what is not yet Baseline. For this lesson Lighthouse 13.5.0 was run from its command line (you have the same engine in Chrome's panel, without installing anything) on the dashboard served with its headers, and it gave 100 in the four categories that are scored from 0 to 100 —performance, accessibility, best practices and SEO—, with a simulated LCP of 1.4 s, a CLS of 0.001, a total blocking time of 0 ms and 42 KiB in total. Those 42 KiB do not contradict the fourteen kilobytes above: the Python server **does not compress** (with `curl -sI -H "Accept-Encoding: gzip, br"` no `Content-Encoding` appears), so Lighthouse counted the 37.9 KB uncompressed plus the headers of each response. Measured in Chrome on the same server, what was transferred adds up to 42,709 bytes, 41.7 KiB. What Lighthouse still flagged, even with 100, was “Network dependency tree”: the chain of requests you see in the waterfall. A 100 and a warning coexist well; the warning is information, and the 100 is not a goal.

### 11.4 Publishing a static site

A static site is a folder of files that a server delivers as is, without running anything on your behalf. It is what the `revisor` is: HTML, CSS, JavaScript that runs in the browser, and a JSON. “Publishing” is copying that folder to a service that serves it over the internet with an address and, preferably, with your headers. There is no build step, because the dashboard never needed one.

**What is published.** The **contents** of `revisor/` (not the folder that contains it): `index.html` has to end up at the site's root. It includes `_headers`. Before uploading it, three checks:

1. **Nothing secret.** The site will be public; any file you upload can be read by whoever knows the address. In the dashboard there are no keys, and the rule is that there never be any.
2. **The test files.** `data/services-empty.json` and the `CASES` table in `js/main.js` exist to see the dashboard's states. They harm nothing (the table is a closed list that never uses the address text as the request's address, as explained in Lesson 9), but decide whether you want a published dashboard with that test mode or without it.
3. **The data is example data.** The `data/services.json` you publish is what anyone will see. A dashboard showing services that do not exist is legitimate for an exercise; say so on the site itself if you share it.

**Where.** There are several free options. These are the ones consulted for the lesson, with what their own pages say, **in order of preference**: the first two send your headers; GitHub Pages goes last because it does not, and you will see right away what you lose because of that.

- **Cloudflare Pages.** It lets you upload a folder by dragging it to the control panel (“Direct Upload”: in the Workers and Pages section, “Create application”, “Get started”, “Drag and drop your files”; it accepts a folder or a zip), and leaves the site at `project-name.pages.dev` ([guide](https://developers.cloudflare.com/pages/get-started/direct-upload/)). It reads `_headers` ([documentation](https://developers.cloudflare.com/pages/configuration/headers/)): up to 100 rules, 2,000 characters per line. The documentation consulted does not say expressly whether `_headers` is respected in direct upload; check it with `curl`, as below.
- **Netlify.** “Netlify Drop” ([guide](https://docs.netlify.com/site-deploys/create-deploys/)) lets you drag an already built folder and publish it without an account and without Git; the anonymous site is temporary, you have to claim it within the first hour. It also reads `_headers` ([documentation](https://docs.netlify.com/manage/routing/headers/)).
- **GitHub Pages, the last option.** It publishes from a GitHub repository, and only from two places on a branch: its root (`/`) or a folder called `/docs` ([documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)); the other route is an automated GitHub Actions workflow, which this course does not use. That is why the **contents** of `revisor/` have to end up at the repository's root, not inside a `revisor/` folder. With the free plan, the repository **has to be public** ([documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)); changes can take up to ten minutes to show; and its [limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) include a site of 1 GB at most, a soft limit of 100 GB of transfer per month, and the prohibition of using it as free hosting for a business. As said in 11.2, there is no documented way of sending your own headers; moreover, GitHub Pages processes the site with Jekyll, which by default [does not publish files whose name starts with `_`](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll), so `_headers` does not even arrive. If you choose GitHub Pages, you put the CSP yourself: add to the `<head>` of `index.html` the `<meta>` tag from 11.2 before uploading it.

**Why GitHub Pages goes last: a weaker CSP.** Think about the difference between a rule the server announces **before** delivering the page and a note written **inside** the page. The header arrives first, and the browser applies it to everything; the `<meta>` tag is only read when the browser is already reading the HTML. That is why the [CSP specification](https://www.w3.org/TR/CSP3/#meta-element) leaves three directives out of the tag: `frame-ancestors`, `sandbox` and `report-uri`, as well as the whole report-only mode. For the dashboard, the loss that matters is the first: `frame-ancestors 'none'` is what prevents another site from putting your page inside a frame (`<iframe>`) and disguising it under fake buttons so that someone clicks without knowing on what ([MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors) says expressly that it does not work in `<meta>`). And the CSP is not the only thing that traveled in `_headers`: `X-Content-Type-Options: nosniff` has no tag version, so it is lost too; `Referrer-Policy` does have one, `<meta name="referrer" content="no-referrer">` ([MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/referrer)), if you want to keep it. For an exercise with example data, the risk is small and publishing on GitHub Pages is legitimate; for a real site, choose a service that sends headers.

None of the three needs Node or installing anything, and all three serve for this exercise; what is not secondary is what follows.

**Publishing on GitHub Pages without using Git in the terminal.** In Lesson 1 you saved commits with Git on your computer, but the course never taught you to upload them to a service like GitHub, and to publish it is not necessary: GitHub lets you upload files from the browser. If you choose this option, there are five steps, all taken from GitHub's documentation:

1. **An account.** If you do not have one, create a free one at `github.com`. Your username will appear in the site's address.
2. **A public repository.** At the top right of any GitHub page, the **+** button and then **New repository**; give it a name (for example `revisor`), choose the **Public** visibility and press **Create repository** ([documentation](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository)).
3. **The files.** First, add to your `index.html` the CSP `<meta>` tag (11.2). Then, on the repository page, **Add file** and then **Upload files**, and drag to the browser window **what is inside** your `revisor/` folder —`index.html`, `favicon.svg` and the `css`, `js` and `data` folders—, not the `revisor` folder itself: `index.html` has to end up at the root. Write a message, as you would with `git commit`, and confirm ([documentation](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository); the browser admits up to 100 files at a time and 25 MiB per file, more than enough for the dashboard).
4. **Turn on Pages.** In the repository, **Settings**, then **Pages** in the sidebar; under “Build and deployment”, in **Source**, choose **Deploy from a branch**, and for the branch choose `main` and the folder `/ (root)`; save ([documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)).
5. **The address.** A repository's site ends up at `https://<your-username>.github.io/<repository>/` ([documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages)), for example `https://ana.github.io/revisor/`. Notice that the dashboard lives in a **subfolder** of the domain, `/revisor/`. It works because all the dashboard's paths are relative (`css/styles.css`, `data/services.json`); a path that started with `/`, such as `/css/styles.css`, would look at the domain's root and give a 404.

If you already know how to use `git push`, that works too, and the result is the same; this course does not teach it because to publish a folder you do not need it.

**Verifying what is published.** A service's promise is not proof. With your address already published (here `https://tu-sitio.example`), three checks in a terminal:

```bash
curl -sI https://tu-sitio.example/ | grep -i -E "content-security|nosniff|referrer"
curl -sI -H "Accept-Encoding: gzip, br" https://tu-sitio.example/js/main.js | grep -i content-encoding
curl -s -o /dev/null -w "%{http_code}\n" https://tu-sitio.example/data/services.json
```

The first must show your three headers; if none comes out, the service did not read `_headers` and your site does not have the CSP, even though the file is there. On GitHub Pages none will come out, and that is expected: there the check is that the published `index.html` carries the `<meta>` tag (`curl -s https://tu-sitio.example/ | grep -i content-security`). The second says whether the service compresses text responses (`gzip` or `br` must appear). The third, `200`. Afterwards, open the site in the browser with the console open and repeat the five criteria of the next section, now on the public address. A path that worked on your computer can break when published: that is where absolute paths written by mistake and names that differ only in capitals show up. On Linux Mint, `Main.js` and `main.js` are two different files, just as for the server, so you would already have seen that error on your computer; but on Windows and macOS, whose disks by default do not distinguish capitals from lowercase ([Microsoft](https://learn.microsoft.com/en-us/windows/wsl/case-sensitivity), [Apple](https://support.apple.com/guide/disk-utility/file-system-formats-dsku19ed921c/mac)), a `<script src="js/Main.js">` works on the computer and breaks when published. If someone else works on the dashboard from those systems, that is the cause.

**And what is not published.** The Python server you worked with (`python3 -m http.server`, and this lesson's `headers-server.py`) is a tool for developing, not for serving the public. If you start it without `--bind 127.0.0.1`, it listens on all your computer's addresses and anyone on your network can read the folder you launched it from; the [Python documentation](https://docs.python.org/3/library/http.server.html) warns, moreover, that the module is not for production and that it only implements basic security checks. Ours listens only on `127.0.0.1`, which is your own machine's address.

### 11.5 The five criteria, one by one

Now, the promised close. For each criterion there is a test you can repeat and the result obtained when preparing the lesson, with the dashboard served by `headers-server.py` and the console open, in Chrome 154. If your result is different, the criterion is not met, and it is not finished until it is.

**1. It can be navigated completely with the keyboard.** *Test:* the 11.1 walkthrough, with the stops fragment. *Result:* sixteen stops in a reasonable order, all with `tabindex 0`, all with a visible focus outline (a solid 3 px `outline`), and no trap: after the last button focus returns to the beginning of the page.

**2. There is not a single error in the console.** *Test:* reload the dashboard with the console open and go through the whole of Lesson 10 (filter, sort, add, make a mistake). *Result:* no message, neither error nor warning, in the normal walkthrough and in `?case=empty`, `?case=invalid` and `?case=timeout`. An exception you must know: `?case=error` requests a file that does not exist, and the browser notes on its own “Failed to load resource: … 404”. It is the request you provoked on purpose and not a defect in your code; the criterion is about the normal walkthrough. The only thing that dirtied it along the way was the `data:,` icon when the CSP was activated, and it was already fixed (see 11.2).

**3. It works at 320 px wide.** *Test:* the window at 320 px (the tools' device mode) and the line from 11.1. *Result:* `scrollWidth` and `clientWidth` are both 320 in the five situations: there is no overflow.

**And if you pass the stylesheet through the validator.** In Lesson 3 you took up the habit of passing your `styles.css` through the [W3C CSS validator](https://jigsaw.w3.org/css-validator/) before accepting a stylesheet as good, and it is worth keeping. With the finished stylesheet you will see something that did not come up in Lesson 3: the validator answers with **two errors**, “Property “container-type” doesn't exist” and “Unrecognized at-rule “@container””, besides the usual two warnings about variables. That is how it answered when sending it `revisor/css/styles.css` while preparing the lesson. The two errors come from the container query you added in Lesson 5, and they are not errors in your stylesheet: container queries are part of the [CSS Containment Module Level 3](https://www.w3.org/TR/css-contain-3/) specification and work in all browsers, as you saw in Lesson 5, but the validator does not recognize them yet. The practical rule: read each error and decide; if what it flags is `container-type` or `@container`, it is a limitation of the validator and you leave it. Any other error is fixed, just as in Lesson 3.

**4. It shows the three states.** *Test:* open these addresses on the published or local dashboard.

| Address | What should be seen |
|---|---|
| `/` | the table, “Mostrando 5 de 5 servicios.” (Showing 5 of 5 services.) |
| `/?case=empty` | “No hay servicios que revisar.” (There are no services to check.), no table, with “Reintentar” and with the form for adding the first one |
| `/?case=error` | “El servidor respondió con el código 404.” (The server responded with code 404.), with “Reintentar” |
| `/?case=timeout` | “Cargando servicios…” for three seconds and then “El servidor no respondió en 3000 ms.” (The server did not respond in 3000 ms.), with “Reintentar”. On the published site there is no `?delay`, so there the table loads normally |

And for the “loading” state, which on your machine lasts milliseconds, the Network tab with a slow profile, or a request that never answers. *Result:* the four addresses show what the table says, and with a data request that does not respond, “Cargando servicios…” appears immediately and, at three seconds, the notice says “El servidor no respondió en 3000 ms.” with “Reintentar”.

**5. Text that comes from outside is drawn with `textContent`, never with `innerHTML`.** *Test:* search your code.

```bash
grep -n -E "innerHTML|outerHTML|insertAdjacentHTML|document\.write|eval\(" revisor/js/*.js
```

*Result:* not a single line. And the functional test from Lesson 7 still holds: add a service called `<img src=x onerror=alert(1)>`; it appears as text in the table, as is, and nothing else happens. The CSP in 11.2 is the backup for this, not its substitute.

Five tests, five results. If all five come out as above in your dashboard, the course is finished. And for criterion 1 there is a second automatic opinion: axe-core 4.14.0 on the dashboard's five situations found no fault.

This is the finished `index.html`:

```html
<!-- revisor/index.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Revisor de servicios</title>
  <meta name="description" content="Panel que muestra el estado y el tiempo de respuesta de una lista de servicios.">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="css/styles.css">
  <link rel="modulepreload" href="js/state.js">
  <link rel="modulepreload" href="js/filters.js">
  <link rel="modulepreload" href="js/view.js">
  <link rel="modulepreload" href="js/stats.js">
  <link rel="modulepreload" href="js/load.js">
  <link rel="modulepreload" href="js/form.js">
  <script type="module" src="js/main.js"></script>
</head>
<body>
  <header class="page-header">
    <h1>Revisor de servicios</h1>
    <p class="last-check">Última revisión: <span id="checked-at">todavía no</span></p>
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

Compared with Lesson 10, the `<head>` changed —the page description, the icon of its own and the six `modulepreload` lines— and so did a class on the header, `last-check`, to reserve its space. The rest of `index.html`, the seven modules and the data are identical to those of Lesson 10, except the first line, which in the repository says where each file lives; `css/styles.css` is the one from Lesson 10 plus the block from 11.3.

## The error you will see

The one about the policy that blocks the inline script, which you already saw in figure 11.1. It is the most characteristic message of a CSP, and it is read in three beats:

```text
Executing inline script violates the following Content Security Policy directive 'script-src 'self''. Either the 'unsafe-inline' keyword, a hash ('sha256-…'), or a nonce ('nonce-…') is required to enable inline execution. The action has been blocked.
```

*What it means:* the page tried to run a script that is written inside the HTML, and the policy (`script-src 'self'`) only admits scripts that are files of the same site. *How it is fixed:* move the code to a `.js` file and load it with `<script src="…">` or, better, `<script type="module" src="…">`. The other two ways out that the message names —a fingerprint or a one-use number— exist for special cases, and opening everything with `'unsafe-inline'` undoes the protection, so it is not a way out.

A variant, which appears when the inline code is an attribute (`onclick="…"` or `onerror="…"`): the message says “Executing inline event handler violates…” and adds a note: fingerprints do not work with event handlers. The correct way out is the same, `addEventListener` in a file, and it is the one the dashboard uses.

And one more, with a different cause: if an absent directive falls to `default-src 'none'`, the message says so: “Note that 'connect-src' was not explicitly set, so 'default-src' is used as a fallback”. It is provoked in Exercise 2.

## What gets done wrong

- **Copying a CSP from the internet without reading it.** *What it looks like:* a two-hundred-character line with a dozen domains your site never uses. *Cost:* each allowed domain is a place from which code can be loaded into your page. A policy is a list of what your site needs, not of what someone else used.
- **`'unsafe-inline'` so that it “stops giving errors”.** *What it looks like:* a `script-src 'self' 'unsafe-inline'`. *Cost:* it is opening exactly what the policy closes. Without that protection, the header is left as decoration.
- **Believing the CSP fixes XSS.** *What it looks like:* “I already have a CSP, so I can use `innerHTML`”. *Cost:* figure 11.2 shows it: the injected HTML stays on the page. `textContent` is the defense; the CSP, the second barrier.
- **A published site without checking that the headers arrived.** *What it looks like:* the `_headers` file is in the folder and nobody did `curl -I`. *Cost:* the service may not read it (or read it only in another upload mode); you have a policy that exists on your computer and not on the internet.
- **Optimizing without measuring.** *What it looks like:* minifying, bundling and deferring things because “you should”. *Cost:* complexity you did not buy with any number. Measure first, change one thing, measure again.
- **Measuring only on your computer.** *What it looks like:* “it loads in 70 milliseconds”. *Cost:* it is the measurement of the fastest machine and the shortest network that exists. Throttle the network in the tools and look at the waterfall.
- **`loading="lazy"` on the main image.** *What it looks like:* a performance recipe applied to all images. *Cost:* according to web.dev, it worsens the LCP, because the most important image is requested late. Only for those that are off screen.
- **Serving the public with `python3 -m http.server`, or without `--bind 127.0.0.1`.** *What it looks like:* starting the development server so that others see the page. *Cost:* without `--bind`, anyone on your network reads the folder you started it from; and in no case is it a server made for the public.
- **Uploading a file with keys to a public site.** *What it looks like:* a `.env`, a key in a `services.json`. *Cost:* the whole folder is readable by anyone with the address; and a published secret must be considered lost, even if you delete it.

## Exercises

### Exercise 1 — Reading a policy

Without running anything, say what each of these two policies does with the dashboard, and which of the two breaks something: (a) `default-src 'self'`; (b) `default-src 'self'; script-src 'self' 'unsafe-inline'`. Then, put (a) in the dashboard's `_headers` and open it: does anything change compared with the dashboard's policy?

### Exercise 2 — Break something on purpose

In a copy of the `revisor/` folder, remove `connect-src 'self';` from `_headers`, start `headers-server.py` on the copy and open the dashboard. Write down what the person sees on screen and what the console says. Then fix the policy and check again.

### Exercise 3 — Measure it yourself

With the dashboard served from your computer and a slow network profile in the browser developer tools, measure with the fragment from 11.3 the dashboard's CLS and LCP **without** the six `modulepreload` lines and **with** them, three times each. Write in the logbook your six numbers and a sentence: did it help? how much? If it did not help, write why you think it did not.

## Solutions

**Exercise 1.** (a) It allows loading anything, but only from the same site, and since `default-src` is the fallback value, it covers scripts, styles, images and connections. It blocks nothing the dashboard does: everything comes from the same origin. It changes only in what it does **not** cover: it does not include `form-action`, `base-uri` or `frame-ancestors`, which do not fall back to `default-src`; that is, it is less strict than the dashboard's; with it the dashboard looks and works the same. (b) It starts from the same thing, but with `'unsafe-inline'` in `script-src` it allows scripts written inside the HTML. It breaks nothing in the dashboard, and it is the worse of the two: it closes much less. The lesson: a policy that “breaks nothing” is not good for that reason; you have to look at what it leaves open.

**Exercise 2.** Without `connect-src`, the fallback rule `default-src 'none'` blocks the `fetch`. The person sees “No se pudo conectar con el servidor.” (Could not connect to the server.) with the “Reintentar” button (the dashboard treats the network failure like any other, and it is a good reason why `js/load.js` turns errors into messages). The console says, in Chrome 154: “Connecting to 'http://127.0.0.1:…/data/services.json' violates the following Content Security Policy directive: "default-src 'none'". Note that 'connect-src' was not explicitly set, so 'default-src' is used as a fallback. The action has been blocked.”, followed by “Fetch API cannot load … Refused to connect because it violates the document's Content Security Policy”. It is fixed by putting `connect-src 'self';` back. What is learned: the dashboard degrades gracefully, but the cause is in the console, not on the screen.

**Exercise 3.** The numbers depend on your machine; what should come out is the shape: with `modulepreload`, the `data/services.json` request starts earlier and the table appears earlier; the LCP, which is the title, hardly moves. If you see no difference, it is not an error in the exercise: with a fast local network and no throttling, the waterfall is so short it is not noticeable. Throttle the network and try again. If your CLS was already 0 in both cases, that is also a result: the shift we corrected appears when the summary takes time to arrive, so it may not occur with a fast network.

## How I know I got it

- [ ] `curl -sI http://127.0.0.1:8000/ | grep -i content-security`, with `headers-server.py revisor 8000` running, prints the policy from section 11.2.
- [ ] Figure 11.1 (`fig11_01.html`) shows “El script externo sí se ejecutó.” (The external script did run.) and the console carries the “Executing inline script violates…” message.
- [ ] Figure 11.2 shows “Imágenes inyectadas: 1. Título de la página: La política no arregla el innerHTML” (Injected images: 1. Page title: The policy does not fix innerHTML) and the console carries “Executing inline event handler violates…”.
- [ ] With the `revisor/` dashboard served with its headers, the console is empty in the normal walkthrough.
- [ ] The **five criteria** of 11.5 come out as described, each with its test: sixteen keyboard stops, an empty console, 320 = 320, the four addresses with their notice, and zero matches in the `grep`.
- [ ] You have a table of your own with the dashboard's weight (`wc -c` and `gzip -9 -c … | wc -c`) and, at least, the LCP and the CLS measured with the console fragment.
- [ ] The dashboard is published at an address that is not `127.0.0.1`, and `curl -sI` on that address shows the three headers (on GitHub Pages, instead, the published `index.html` carries the CSP `<meta>` tag). If you could not publish it, write in the logbook what prevented it.

**Review of earlier lessons** (answer them without looking, and then check):

1. In Lesson 1: why does a JavaScript module not load if you open the file with `file://`, and what did you do to avoid it?
2. In Lesson 3: why does `* { box-sizing: border-box }` make a width of 300 px be 300 px even with padding?
3. In Lesson 7: why does `textContent` not run an `<img onerror=…>`?
4. In Lesson 10: what is the difference between `:invalid` and `:user-invalid`?

If any of them escaped you, write it down in the logbook: the course is finished, but that list is the beginning of what comes next.

**And what comes next.** The dashboard you built is redone with types and with React in this house's [TypeScript course](https://www.habil.mx/en/courses/typescript/). Compare the two versions: more is learned from the comparison than from starting another project.

## Further reading

- [MDN — Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP): the complete guide, with the directives, the report-only mode and the strict policy with `nonce`.
- [web.dev — Core Web Vitals](https://web.dev/articles/vitals): the three metrics, their thresholds and the difference between lab and field.
- [Cloudflare Pages documentation — Custom headers](https://developers.cloudflare.com/pages/configuration/headers/): the `_headers` file with its syntax and its limits.
- [W3C — Understanding WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/): each accessibility criterion explained, with its techniques and its typical failures.
