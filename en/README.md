# Web Fundamentals Course — from zero to a dashboard anyone can use

**By Dorian Chávez, founder of Hábil and integration architect.**

**Who it is for:** anyone who has never written a web page, and anyone who copies snippets that work without knowing why. No prior experience with any language is assumed: every concept is explained when it appears, and it is explained why it exists, not just how to write it.

**What you will know by the end:** how to build a complete page, understand what you wrote and be able to explain it to someone else. And you will keep the judgment to read the platform's documentation on your own.

**Where it goes next:** this course is the step before this house's [TypeScript course](https://www.habil.mx/en/courses/typescript/), which rebuilds this same dashboard with types and with React.

**What you need before you start:** a computer with Linux Mint and knowing how to open a terminal. [Lesson 1](01-entorno-ciclo-trabajo.md) installs everything from scratch.

## The project you are going to build

The **`revisor`** (“checker”): a dashboard that shows the status of a list of services —name, status and response time— with its summary, its filters and its form. With plain HTML, CSS and JavaScript, **without a single library**, reading its data from a JSON file in the project itself.

It starts in Lesson 2 and grows in every lesson. It is the same problem as the Go, Rust and TypeScript courses of this house: when you move on to TypeScript you will rebuild this dashboard, and comparing the two versions teaches more than starting another project.

## The twelve lessons

| Lesson | | What you build | What you learn |
|---|---|---|---|
| 0 | [How the web works](00-como-funciona-la-web.md) | nothing yet (reading) | URL, DNS, HTTP, request and response; what the browser does and what the server does; the Network tab |
| 1 | [Your machine and the work cycle](01-entorno-ciclo-trabajo.md) | the environment and the first `index.html` | editor, terminal and folders; a local server from day one; the browser's tools; a first commit in Git |
| 2 | [HTML with meaning](02-html-con-significado.md) | the dashboard's skeleton | choosing the element for what it means; headings, tables, buttons and labels; the dashboard written by hand |
| 3 | [CSS: cascade, specificity and the box](03-css-cascada-caja.md) | the readable dashboard | where each style comes from and which one wins; the box model and `box-sizing`; color and typography variables |
| 4 | [Laying out with Flexbox and Grid](04-flexbox-grid.md) | the dashboard laid out on a wide screen | one dimension with Flexbox and two with Grid; the two axes, `gap`, `flex` and `flex-wrap`; columns with `fr` and `repeat()` |
| 5 | [A page that works on any screen](05-pagina-adaptable.md) | the dashboard that works on a phone | the `viewport` tag; `minmax()` and `auto-fit` before `@media`; the table that scrolls inside its box; `@container`; from 320 to 1440 px |
| 6 | [JavaScript and the data model](06-javascript-datos.md) | the dashboard's data and its calculations | values, objects, arrays and functions; deciding, repeating and reporting an error; modules; how many services are up and the average response time |
| 7 | [The DOM, events and state](07-dom-eventos-estado.md) | the table drawn from the data | drawing from data; listening to events; separating state from drawing; `textContent` as a habit, and the XSS it prevents |
| 8 | [Fetching data: promises, fetch and async/await](08-traer-datos.md) | the dashboard that asks a JSON file for its data | what a promise is; `fetch` in two steps; `response.ok`; `async`/`await` |
| 9 | [When something fails: timeouts, states, CORS and several requests](09-cuando-algo-falla.md) | the dashboard that always says what is happening | timeout; the three states: loading, error and empty; the CORS error; several requests with `Promise.allSettled` |
| 10 | [Forms and validation](10-formularios-validacion.md) | adding and filtering services | the validation the browser already provides; `:user-invalid`; stating the error so a screen reader announces it |
| 11 | [The finished dashboard](11-el-panel-terminado.md) | the published `revisor` | a review with the keyboard; CSP as a server header; weight and performance; publishing a static site |

At the end of each lesson there are exercises with their solutions. And the [logbook](https://github.com/HabilMX/curso-web/blob/main/en/bitacora.md) is yours: write down there what gave you trouble.

## Two principles that run through the whole course

**Accessibility and security are not lessons, they are habits.** There is no final accessibility module: there is native HTML in Lesson 2, the keyboard in 3, 4 and 5, `textContent` in 7, native validation in 10 and the review in 11. A topic left for the end is a topic that does not get learned.

**Only what already works in every browser is taught.** What does not yet appears in a “what is coming” box and you are told not to use it in production. A course that teaches what has just come out gets old in six months.

## How you know you are done

The course does not end when you have read Lesson 11, but when your dashboard meets these five things. No program checks them for you: you check them yourself, with the browser's tools, and the “How I know I got it” section of each lesson tells you how:

1. **It can be navigated completely with the keyboard**, without using the mouse.
2. **There is not a single error in the browser's console.**
3. **It works at 320 px wide** with no horizontal overflow.
4. **It shows the three states**: loading, error and empty. Not just the case where everything goes well.
5. **Text that comes from outside is drawn with `textContent`**, never with `innerHTML`.
