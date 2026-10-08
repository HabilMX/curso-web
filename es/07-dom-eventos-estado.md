# Lección 7 — El DOM, los eventos y el estado

**Tiempo:** 2 × 45 min

**Qué construyes:** la tabla del panel, dibujada desde los datos

**Qué aprendes:** dibujar desde datos en vez de escribir a mano; escuchar eventos; separar estado, dibujado y efectos; `textContent` como hábito, y el ataque que evita

## Al terminar vas a poder

- Explicar la diferencia entre el archivo HTML y el DOM, y decir cuál de los dos cambia cuando JavaScript escribe en la página.
- Dibujar una tabla completa a partir de un arreglo de objetos, creando los elementos uno por uno y colgándolos del documento.
- Explicar qué es un ataque XSS con un ejemplo que tú mismo provoques, y por qué `textContent` lo evita y `innerHTML` lo permite.
- Escuchar un evento con `addEventListener`, leer qué le pasó al elemento con el objeto del evento, y atender muchos botones con un solo oyente (delegación).
- Separar el estado del panel (qué recuerda), el dibujado (cómo se ve) y los efectos (qué escucha), y decir en qué archivo vive cada cosa.
- Navegar el panel solo con el teclado y comprobar que el foco no se pierde cuando la tabla se vuelve a dibujar.

## El porqué antes del cómo

**Punto de partida.** Esta lección parte del panel tal como lo dejó la lección 6, en tu carpeta `revisor`:

- `index.html`, el panel de la lección 2 con las clases que le pusieron las lecciones 4 y 5: el encabezado, el resumen con sus cuatro cifras escritas a mano, el campo de búsqueda, los radios, el botón «Revisar ahora» y la tabla con sus cinco filas escritas a mano. En el `<head>` lleva la línea `<script type="module" src="js/main.js">` que agregaste en la lección 6.
- `css/styles.css`, la hoja de las lecciones 3, 4 y 5: capas, variables de color, insignias de estado y el acomodo que va de 320 a 1440 píxeles.
- `js/services.js`, un módulo que exporta el arreglo `services` con los cinco servicios.
- `js/stats.js`, un módulo que exporta `countByStatus`, `averageResponseMs` y `summarize`.
- `js/main.js`, que por ahora solo escribe las cuentas en la consola del navegador.

Los dos módulos de datos y de cuentas no cambian en toda la lección: esta es su forma, la misma de la lección 6. Lo único distinto es la primera línea, el comentario que en el repositorio dice dónde vive cada archivo: el panel de esta lección está en [`programas/07-dom-eventos-estado/panel/`](https://github.com/HabilMX/curso-web/tree/main/programas/07-dom-eventos-estado/panel).

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

Fíjate en una decisión de la lección 6 que hoy se cobra: un servicio caído no tiene tiempo de respuesta, y por eso su `responseMs` es `null` en lugar de cero. Un cero diría «respondió en cero milisegundos», que es mentira y además arruina el promedio. `averageResponseMs` ya sabe dejar fuera a los que no respondieron, y hoy verás que la tabla también tiene que decidir qué mostrar en su lugar.

**Qué le falta hoy al panel.** Tienes los mismos cinco servicios en dos lugares: en `js/services.js`, donde JavaScript puede contarlos, y en el HTML, donde una persona puede verlos. Nadie garantiza que coincidan. Si mañana Pagos se cae y cambias el arreglo, la tabla seguirá diciendo «Disponible» hasta que alguien se acuerde de editar también el HTML. Si agregas un sexto servicio, tienes que copiar una fila entera, con su insignia, sin equivocarte en una etiqueta. Y el resumen tiene el mismo problema: sus cuatro cifras las escribiste a mano en la lección 2, y las que calculó la lección 6 están encerradas en la consola.

Dos copias de la misma información terminan contradiciéndose. La salida es tener **una sola fuente de verdad**, los datos, y que la pantalla sea una consecuencia: cuando cambian los datos, se vuelve a dibujar. Eso es lo que construyes hoy.

**Qué ruta sigue la lección.** Son tres ideas, en este orden. Primero el **DOM**, que es cómo JavaScript ve y cambia la página, y con él dibujas la tabla desde los datos; ahí mismo aparece la regla de seguridad más rentable de toda la web, que cabe en una línea y que vas a ver romperse con tus propios ojos. Segundo los **eventos**, que es cómo la página se entera de que alguien hizo algo. Tercero el **estado**, que es lo que el panel recuerda, y la separación que evita que el código se convierta en un enredo en cuanto hay más de un botón.

Una advertencia práctica antes de empezar: los módulos no cargan abriendo el archivo con doble clic (`file://`). Desde la lección 1 trabajas con un servidor local. Las páginas de esta lección están en la carpeta [`programas/07-dom-eventos-estado/`](https://github.com/HabilMX/curso-web/tree/main/programas/07-dom-eventos-estado) del [repositorio del curso](https://github.com/HabilMX/curso-web): descárgalo (o clónalo con Git) en tu computadora y enciende el servidor desde su carpeta `programas/`:

```bash
cd programas
python3 -m http.server 8000 --bind 127.0.0.1
```

Y abre `http://127.0.0.1:8000/07-dom-eventos-estado/panel/`. El `--bind 127.0.0.1` hace que solo tu computadora pueda ver la carpeta; sin él, el servidor atiende a toda la red local.

## Los conceptos

Son tres, y cada uno trae su ejemplo mínimo y su ejemplo en el `revisor`. Un recordatorio de método que vale para toda la lección: **antes de ejecutar cada figura, escribe en la bitácora qué crees que va a pasar**. Predecir y luego comprobar enseña más que leer la respuesta, porque cuando te equivocas, el error se queda grabado.

### 7.1 El DOM: la página como un árbol que JavaScript puede cambiar

**El archivo no es la página.** Cuando el navegador recibe un archivo HTML, lo que tiene en las manos es texto. Lo lee de principio a fin y con él construye en memoria una estructura de objetos, un **árbol**: `html` contiene a `head` y a `body`; `body` contiene al encabezado, a la tabla, a los párrafos; la tabla contiene a su cuerpo, el cuerpo a sus filas, cada fila a sus celdas. A cada pieza de ese árbol se le llama **nodo**, y al árbol completo, el **DOM** (por *Document Object Model*, el modelo de objetos del documento). La definición oficial vive en el [estándar DOM](https://dom.spec.whatwg.org/); la explicación de MDN sobre [qué es el DOM](https://developer.mozilla.org/es/docs/Web/API/Document_Object_Model/Introduction) es la lectura recomendada para quien quiera el detalle.

Esa distinción importa por tres razones que vas a comprobar con las herramientas del navegador:

1. **Lo que ves en el Inspector es el DOM, no el archivo.** Abre tu `index.html` con el servidor, presiona `F12` y ve a la pestaña del Inspector. Si en tu HTML escribiste una tabla sin `<tbody>`, el Inspector te lo mostrará de todos modos: el navegador lo agregó al construir el árbol, porque así lo manda el estándar. «Ver código fuente» muestra el archivo; el Inspector muestra el árbol vivo.
2. **JavaScript cambia el árbol, no el archivo.** Si un programa agrega una fila, el archivo `index.html` en tu disco sigue idéntico. Recarga la página y el cambio desaparece, porque el navegador vuelve a leer el archivo y vuelve a construir el árbol. Por eso nunca vas a «guardar» un cambio del DOM: el DOM se reconstruye cada vez, y lo que se guarda son los datos y el código que lo dibuja.
3. **El Inspector se actualiza solo.** Con el panel abierto, cuando el código cambie el árbol verás destellar el nodo modificado. Es la mejor forma de aprender: mira qué nodos cambian y cuáles no.

**Leer y escribir el árbol.** El punto de entrada es el objeto `document`, que representa la página completa. Con él se *busca* un nodo y luego se *lee* o se *escribe* algo en él. Para buscar, `document.querySelector(selector)` recibe un selector de CSS, el mismo lenguaje de la lección 3 (`#title` es el elemento con ese `id`, `.status` los de esa clase, `tbody` los de esa etiqueta), y devuelve **el primer** nodo que coincide, o **`null`** si ninguno coincide. Su hermano `document.querySelectorAll(selector)` devuelve **todos** los que coinciden, en una lista que se recorre con `for…of`. Para escribir texto en un nodo se asigna a su propiedad `textContent`.

Antes de ejecutar la figura 7.1, **predice**: ¿qué número va a mostrar el párrafo, y qué va a decir el encabezado cuando termine el programa? La figura trae una tabla de tres filas escrita a mano:

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

Lo que se ve en la página (el texto que muestra Chrome, de arriba abajo), que en el repositorio está en [`programas/07-dom-eventos-estado/fig07_01.salida.txt`](https://github.com/HabilMX/curso-web/blob/main/programas/07-dom-eventos-estado/fig07_01.salida.txt):

```text
Servicios (leídos por JavaScript)
Catálogo	Disponible
Pagos	Disponible
Inventario	Caído

El documento tiene 3 filas.
```

Si tu predicción fue «tres filas», acertaste, y fíjate en lo que eso demuestra: `querySelectorAll("tr")` contó las filas del *cuerpo*, y la tabla no tiene encabezado de columnas. Si hubiera tenido una fila de encabezados, serían cuatro. Es la clase de detalle que se aprende contando, no leyendo.

Dos cosas más sobre esa figura. El `<script type="module">` está *después* del contenido, pero daría igual dónde lo pusieras: un módulo siempre se ejecuta cuando el documento ya se terminó de leer, y eso evita el error más frecuente del principiante, que verás en la sección «El error que vas a ver». Y la propiedad `textContent` es de **lectura y escritura**: `elemento.textContent` te da el texto que hay dentro, `elemento.textContent = "algo"` lo reemplaza, borrando antes todo lo que contuviera el elemento, incluidos sus hijos.

**Dibujar desde un arreglo.** Para dibujar una lista no se escribe el texto de la lista: se **crean nodos** y se **cuelgan** del árbol. Son tres pasos, y los tres pasos son siempre los mismos:

1. `document.createElement("li")` crea un elemento nuevo, suelto en la memoria. Todavía no se ve, porque no pertenece al árbol de la página.
2. Se le pone su contenido: `elemento.textContent = "..."`, o sus atributos y sus clases.
3. `contenedor.append(elemento)` lo cuelga del árbol, al final de los hijos del contenedor. En ese momento aparece en pantalla.

La figura 7.2 es la versión mínima de todo el dibujado del panel: un arreglo con tres de los servicios de la lección 6 y un ciclo que convierte cada uno en un elemento. **Predice** qué dirá la línea de «Inventario», el que no respondió.

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

Observa lo que *no* hay en el HTML: no hay ningún `<li>`. La lista está vacía en el archivo y el Inspector la muestra llena. Y observa algo que cambia cómo piensas: si mañana el arreglo tiene diez servicios, o cero, el código no cambia. **El dibujado deja de depender de cuántos datos hay.** Ese es el beneficio de dibujar desde los datos. Fíjate también en la línea de Inventario: el `null` de la lección 6 no aparece como «null ms», porque el código decide qué texto le corresponde a la falta de dato. Esa decisión es del dibujado, no de los datos.

`append` acepta varios argumentos a la vez, y acepta también texto suelto, que convierte en un nodo de texto. `replaceChildren(...nodos)` es su pariente para *volver* a dibujar: vacía el contenedor y pone los nodos nuevos en un solo paso. Los tres puntos son la propagación que viste en la [Lección 6](06-javascript-datos.md) (sección 6.2.6): reparten los elementos de un arreglo como si fueran argumentos sueltos. Los dos son «Baseline widely available», es decir, funcionan en todos los navegadores actuales desde hace años; MDN documenta [`append`](https://developer.mozilla.org/en-US/docs/Web/API/Element/append) y [`replaceChildren`](https://developer.mozilla.org/en-US/docs/Web/API/Element/replaceChildren) con su tabla de compatibilidad.

**Una fila del panel, decisión por decisión.** La fila de la tabla es la misma idea con más piezas, y cada pieza tiene una razón. Esta es la función `createRow` de `js/view.js`, con la pequeña función `label` que usa:

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

Léela despacio, porque cada línea responde a algo que ya aprendiste:

- **`th` con `scope = "row"` para el nombre.** En la lección 2 aprendiste que la primera celda de cada fila es el *encabezado de la fila*: un lector de pantalla, al llegar a «480 ms», puede decir «Pagos, Tiempo de respuesta, 480 ms». Si dibujaras un `td` por pereza, la tabla se vería igual y dejaría de ser comprensible para quien no la ve.
- **La insignia usa una lista cerrada.** `LABELS` es un objeto con los dos estados que el panel conoce, `available` y `down`, y la etiqueta que se muestra para cada uno. `Object.hasOwn(LABELS, service.status)` pregunta si el estado es uno de ellos, y solo entonces se usa como parte del nombre de una clase: `status status-available` o `status status-down`, las mismas clases que la lección 3 pintó de verde y de rojo. Un dato de fuera que no esté en la lista no llega a la clase y se muestra como «Desconocido», con la insignia sin color que la lección 3 anunció para ese caso. ([`Object.hasOwn`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn) es la forma moderna de preguntar «¿esta clave es del objeto?», y es mejor que `LABELS[status]` a secas, porque un estado llamado `"constructor"` encontraría la función de ese nombre que todos los objetos heredan.)
- **«sin respuesta» para el `null`.** Mostrar «null ms» sería una grosería para quien lee. El `null` es una decisión de los datos; traducirlo a algo legible es trabajo del dibujado, y el texto es el mismo que la tabla escrita a mano decía desde la lección 2.
- **Un botón de verdad por fila.** No una celda clicable, no un `div`: un `<button type="button">`. Un botón recibe el foco con la tecla Tab y se activa con Enter y con la barra espaciadora **sin que escribas una línea**; un `div` clicable no hace ninguna de las dos cosas, y arreglarlo a mano es más código y peor resultado. La primera regla de ARIA lo dice así: si existe un elemento nativo con el comportamiento que necesitas, úsalo (la [Guía de prácticas de autoría de WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/) la desarrolla).
- **El texto oculto «de Pagos».** Cinco botones que dicen igual «Ver detalle» son cinco botones indistinguibles para quien navega por voz o con un lector de pantalla, que puede pedir la lista de controles de la página. El `<span class="visually-hidden">` agrega al nombre accesible de cada botón el del servicio: «Ver detalle de Pagos». La clase lo saca de la vista sin quitarlo del árbol de accesibilidad, y vive en `css/styles.css`.
- **`dataset.id`.** Los atributos que empiezan con `data-` son un lugar que el estándar reserva para tus propios datos. `button.dataset.id = "payments"` escribe `data-id="payments"`. Es el `id` que la lección 6 separó del nombre: el nombre es lo que se muestra y puede cambiar; el `id` es lo que identifica al servicio. Más adelante lo vas a leer de vuelta para saber *qué* servicio quiso ver la persona. Un atributo `data-` guarda su valor como texto y el navegador no lo interpreta, así que escribir ahí un dato de fuera no ejecuta nada.
- **`classList`, `aria-pressed` y `String`.** `row.classList.add("selected")` agrega una clase a las que ya tenga el elemento sin borrar las demás (asignar `className`, en cambio, las reemplaza todas). `aria-pressed` es un atributo de accesibilidad que convierte el botón en un *botón de alternar*: un lector de pantalla anuncia si está presionado o no, y la hoja de estilos lo usa para marcarlo. Los atributos siempre guardan texto, por eso `String(isSelected)` convierte el booleano `true` o `false` en el texto `"true"` o `"false"` antes de escribirlo.
- **`setAttribute` no limpia nada.** Es seguro *para estos dos atributos*, `data-id` y `aria-pressed`, porque el navegador nunca los ejecuta. Pero `setAttribute` escribe el valor tal cual en el atributo que le digas, y algunos atributos sí son código: `button.setAttribute("onclick", texto)` convierte ese texto en un programa que corre al hacer clic, y `href` o el `src` de un `<iframe>` aceptan direcciones `javascript:`. MDN lo advierte en la sección de seguridad de [`setAttribute`](https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute). La regla: un dato de fuera solo va a atributos que no se ejecutan, y nunca a uno que empiece con `on`.

**La regla que cabe en una línea: el texto de fuera entra con `textContent`.** Hasta aquí has usado `textContent` sin que te dijera por qué. Es hora de ver por qué importa, y la mejor forma es romperlo a propósito.

Existe otra propiedad que parece hacer lo mismo: `innerHTML`. Se parece mucho. Pero hay una diferencia de fondo: `textContent` trata lo que le das **como texto**; `innerHTML` lo trata **como código HTML** y lo interpreta, igual que cuando el navegador lee un archivo. Con un nombre como «Catálogo» las dos dan el mismo resultado. Con un nombre como `<b>Catálogo</b>` ya no: una pone letras negritas y la otra muestra los signos `<b>` tal cual.

Eso no sería grave si los datos fueran siempre tuyos. Pero el `revisor` existe para mostrar lo que *reportan otros*: el nombre de un servicio, un mensaje de error, una descripción. Hoy están en tu archivo `js/services.js`; en la lección 8 llegarán por la red, y en la 10 los escribirá una persona en un formulario. En cuanto un texto lo controla alguien que no eres tú, es un **dato de fuera**, y hay que tratarlo como si pudiera ser hostil.

Aquí va el ataque, que se llama **XSS** (*cross-site scripting*, programación entre sitios): un dato de fuera que contiene HTML con código activo, y una página que lo interpreta. Es una de las fallas de seguridad más frecuentes de la web, y [OWASP](https://top10.owasp.org/2025/A05_2025-Injection/) la clasifica dentro de las inyecciones en su lista de 2025. La figura 7.3 es la versión **insegura** del dibujado de la lista. **Predice** antes de abrirla: el tercer nombre es `<img src="x" onerror="document.title = '...'">`, que es una imagen cuya dirección (`x`) no existe. ¿Qué crees que se verá en la lista, y qué pasará con el título de la pestaña?

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

La lista no muestra nada en el tercer renglón, y **la pestaña cambió de título**. No había ningún programa que dijera eso: lo dijo un dato. El navegador creó la imagen, intentó cargar `x`, no pudo, disparó el evento de error de la imagen y ejecutó el código que venía dentro del atributo `onerror`. Hoy ese código cambia un título, que es inofensivo. Pero es **código cualquiera**, con los mismos permisos que el tuyo: puede leer lo que la página muestra, puede pedir información al servidor con la sesión de quien está mirando, puede cambiar lo que se ve para engañar. El que escribió el dato no necesitó entrar al servidor ni conocer tu código; solo necesitó que tu página lo dibujara con `innerHTML`.

Una confusión frecuente: «Si `innerHTML` bloquea `<script>`, ya estoy a salvo». Es cierto que un `<script>` insertado con `innerHTML` **no se ejecuta**, y por eso muchos tutoriales dicen que es seguro. Pero la figura 7.3 acaba de demostrar que no hace falta un `<script>`: un atributo de evento en una imagen basta. MDN lo advierte en su página de [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML), con este mismo ejemplo de `onerror`.

La figura 7.4 es idéntica **salvo una línea**: usa `textContent`.

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

El tercer renglón ahora muestra el texto del ataque, completo y visible, y el título de la pestaña sigue siendo el que escribiste. La imagen nunca se creó: el navegador no leyó `<img` como una etiqueta porque a `textContent` no le importa lo que parece. En el Inspector verás que el HTML escribió `&lt;img…&gt;`: los signos se *escaparon*, es decir, se reemplazaron por su representación de texto.

Esa es la regla: **todo texto que no escribiste tú entra al documento con `textContent`**. Y con ella van otras de la misma familia, que OWASP reúne en su [hoja sobre XSS en el DOM](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html) como los «sumideros peligrosos», los lugares donde un dato se vuelve código:

- `innerHTML`, `outerHTML` e `insertAdjacentHTML`: interpretan HTML.
- `document.write`: lo mismo, y además de forma tan torpe que ya no se enseña.
- `eval(texto)` y `setTimeout("texto", …)` con una cadena: ejecutan texto como programa.
- Los atributos de evento escritos en el HTML (`onclick="..."`, `onerror="..."`): son código en forma de texto.
- Asignar un dato al `href` de un enlace (o al `src` de un `<iframe>`) sin comprobar de dónde viene: una dirección que empieza con `javascript:` ejecuta código cuando se sigue el enlace o se carga el marco. MDN explica que eso pasa en los lugares a donde se *navega*, no en los que solo descargan un recurso, como el `src` de una imagen ([esquema `javascript:`](https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/javascript)). En el panel de hoy no hay enlaces con datos de fuera, pero en cuanto haya uno, la dirección se valida primero.

¿Cuándo es aceptable `innerHTML`? Cuando lo que le das es un texto fijo que escribiste tú, sin una sola pieza que venga de un dato. Aun así, la costumbre sana es no tenerlo: una línea con `innerHTML` que hoy es segura se convierte, tres meses después, en una línea insegura cuando alguien le pega una variable. Si nunca lo usas, esa conversión no puede ocurrir, y revisar el código es buscar la palabra y comprobar que no está. Por eso uno de los cinco criterios con que sabes que terminaste el curso es: *el texto que viene de fuera se dibuja con `textContent`, nunca con `innerHTML`*.

> **Lo que viene, y todavía no se usa.** Existen dos mecanismos más nuevos para este mismo problema. El primero son los *Trusted Types* (tipos de confianza), que hacen que el navegador se niegue a aceptar una cadena de texto en un sumidero peligroso; según [web.dev](https://web.dev/articles/trusted-types), los navegadores principales lo soportan apenas desde 2026, y por eso todavía es «reciente». El segundo es `Element.setHTML()`, junto con la API *Sanitizer*, que limpia el HTML antes de insertarlo, y que MDN todavía marca como «no Baseline». Ninguno de los dos reemplaza el hábito de usar `textContent`, y este curso no los emplea en el panel: enseña solo lo que ya funciona en todos los navegadores. En la lección 11 verás la otra red de seguridad que sí está en todos: la política de seguridad de contenido (CSP), que es una segunda capa y **no sustituye** a la primera.

### 7.2 Los eventos: cómo se entera la página de que alguien hizo algo

**Un evento es un aviso.** Cuando alguien presiona un botón, mueve el mouse, escribe una tecla o se termina de cargar una imagen, el navegador lo anota como un **evento** y se lo avisa a quien lo haya pedido. Quien lo pide es tu código, y lo hace así:

```js
element.addEventListener("click", handler);
```

Dicho en español: «cuando ocurra un `click` en este elemento, ejecuta esta función». A la función se le llama **oyente** (*listener*) o manejador. Tres detalles que casi todos los principiantes pisan:

1. **Se pasa la función, no se llama.** `addEventListener("click", onClick)` entrega la función para que el navegador la ejecute cuando ocurra el clic. Si escribes `onClick()` con paréntesis, la ejecutas *ahora mismo*, una sola vez, y le entregas al navegador lo que esa llamada devolvió (que suele ser `undefined`). El clic no hará nada y no habrá error alguno.
2. **El navegador le entrega a la función un objeto con los detalles**, el objeto del evento, que por costumbre se llama `event`. Sus propiedades más útiles: `event.type` (qué tipo de evento fue), `event.target` (el elemento donde *ocurrió*) y `event.currentTarget` (el elemento donde está *puesto el oyente*). La figura 7.5 los usa, junto con [`localName`](https://developer.mozilla.org/en-US/docs/Web/API/Element/localName), una propiedad que tiene todo elemento y que da el nombre de su etiqueta en minúsculas: para un `<button>`, el texto `"button"`. Sirve para que la página diga *qué clase* de elemento recibió el evento.
3. **El elemento correcto da el teclado gratis.** Un botón recibe el clic con el mouse, con toque en pantalla, con Enter y con la barra espaciadora; todo eso llega como el mismo evento `click`. Si hubieras usado un `div`, tendrías que escribir tú el soporte para el teclado.

**Predice:** ¿qué dirá el párrafo después de dos clics en el botón?

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

Dos observaciones que te van a servir en el panel. La primera: la variable `clicks` vive *fuera* de la función y por eso sobrevive de un clic al siguiente; guardar «lo que ha pasado hasta ahora» fuera del oyente es el germen de lo que en 7.3 se llama estado. La segunda: el párrafo tiene `role="status"`, lo que lo vuelve una **región viva**: cuando su contenido cambia, un lector de pantalla lo anuncia sin que la persona tenga que ir a buscarlo. Es la manera correcta de avisar que «algo cambió» sin mover el foco; la regla de oro de las regiones vivas es que **existan desde el principio y vacías o con su texto inicial**, y que solo cambie su contenido.

**Los eventos suben.** Si haces clic en un botón que está dentro de una celda, que está dentro de una fila, que está dentro del cuerpo de la tabla, ¿a quién le ocurrió el clic? A todos. El navegador entrega el evento primero al botón y luego **lo sube** por el árbol: a la celda, a la fila, al cuerpo, a la tabla, al `body`, hasta `document`. A eso se le llama **burbujeo** (*bubbling*), y está descrito en el [estándar DOM](https://dom.spec.whatwg.org/#dispatching-events) y explicado paso a paso en [MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling). Mientras sube, `event.target` no cambia (sigue siendo el elemento más interno, donde se hizo clic) y `event.currentTarget` va cambiando (es siempre el elemento cuyo oyente se está ejecutando).

El burbujeo permite una técnica que vas a usar en casi todo programa con listas: la **delegación de eventos**. En lugar de poner un oyente a cada botón, pones **uno solo** en el contenedor, y cuando el evento suba, preguntas desde dónde vino. ¿Por qué es mejor aquí?

- **El panel vuelve a dibujar sus filas** (lo verás en 7.3). Los botones viejos se tiran y se crean botones nuevos; un oyente puesto en un botón viejo se va a la basura con él. El contenedor, el `<tbody>`, no se tira nunca, y su oyente sigue.
- **Con 6 filas o con 600, el costo es el mismo:** un oyente.
- **Los servicios que lleguen después** (en la lección 8 la tabla se llena tras una petición de red) quedan cubiertos sin hacer nada.

Hay una trampa, y se llama el ícono dentro del botón. Si el botón contiene otro elemento, como un `<span>` con un símbolo, el clic puede caer en el `span`, y entonces `event.target` es el `span`, no el botón. Un código ingenuo que pregunte `if (event.target === button)` dejará de funcionar en cuanto el diseñador agregue un ícono. La solución es `event.target.closest("button[data-name]")`: **`closest`** sube desde el elemento por sus ancestros y devuelve el primero que coincida con el selector (empezando por el propio elemento), o `null` si no hay ninguno ([MDN: `closest`](https://developer.mozilla.org/en-US/docs/Web/API/Element/closest)). La figura 7.6 lo demuestra haciendo clic sobre el ícono a propósito.

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

Mira la salida: `target` fue el `<span>`, pero `closest` encontró el botón y su `dataset.name` dijo «Pagos». Y mira la línea `if (button === null) return;`: el oyente está en toda la lista, así que también recibe los clics que caen en el espacio entre botones, y hay que ignorarlos. Es la primera instrucción de cualquier oyente delegado.

Un límite que conviene conocer: no todos los eventos suben. `focus` y `blur`, por ejemplo, no burbujean (sus parientes `focusin` y `focusout` sí). Para los clics y las teclas, que son los que usarás en este curso, la delegación funciona sin trucos.

### 7.3 El estado, y la separación que evita el enredo

**Qué es el estado.** El **estado** de una aplicación es **lo que recuerda en este momento**. En el panel son tres cosas: la lista de servicios, si está ordenada por tiempo de respuesta o no, y cuál servicio está seleccionado (o ninguno). Fíjate que no dije «lo que se ve»: lo que se ve es *consecuencia* del estado. La idea que ordena todo lo demás es que **la pantalla es una función del estado**: se escribe una función `render(state)` que, dado el estado, pone en el documento lo que corresponde, y cada vez que algo cambia, se cambia el estado y se vuelve a llamar a `render`.

El enredo que esta idea evita se ve así. Un programador principiante resuelve «ordenar» con un `if (button.textContent === "Ordenar por tiempo")`: pregunta *al documento* en qué situación está el panel. Funciona hasta que alguien cambia el texto del botón, o lo traduce, o agrega otro botón que también necesita saber si está ordenado. Entonces la verdad vive en tres lugares (el arreglo, el texto del botón, el orden de las filas en pantalla) y hay que mantenerlos de acuerdo a mano. Es el mismo problema de las dos copias con el que empezó la lección, solo que ahora dentro del propio código. Con un estado explícito, la verdad vive en **un** objeto, y todo lo demás se calcula.

**Tres archivos, tres responsabilidades.** El panel se parte así:

| Archivo | Responsabilidad | ¿Toca el documento? |
|---|---|---|
| `js/state.js` | Qué recuerda el panel y las únicas formas de cambiarlo | No |
| `js/view.js` | Dibuja un estado en el documento | Sí, solo para escribir |
| `js/main.js` | Junta las piezas: escucha eventos, cambia el estado, pide dibujar | Sí, para escuchar |

A los eventos, al dibujado y a todo lo que *hace algo al mundo* se les llama **efectos**: se separan del estado porque son lo difícil de probar y de razonar. El estado, en cambio, son objetos y funciones comunes, que puedes verificar sin abrir una página. Este es `js/state.js` completo:

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

Detente en `visible`. Devuelve **lo que debe mostrarse** y lo calcula del estado cada vez: si `sortByTime` es verdadero, ordena; si no, devuelve la lista tal como llegó. Hay dos detalles que importan. El primero es `toSorted`, que conociste en la lección 6: devuelve una **copia** ordenada y deja intacto el arreglo de los datos. Si usaras `sort`, que ordena el arreglo sobre el que se llama, perderías para siempre el orden de llegada, y el botón «Ordenar» ya no tendría a qué volver. El segundo es `a.responseMs ?? Infinity`: el operador `??` sustituye un `null` por el valor de la derecha, así que un servicio sin medida se considera infinitamente lento y se va al final. (`??` solo reacciona a `null` y `undefined`; `||`, en cambio, trataría un cero como «falta». Un tiempo de cero sería sospechoso, pero no es lo mismo que no tener medida.)

**La ventaja de separar se ve en una prueba sin pantalla.** Como `js/state.js` no toca el documento, se puede comprobar con una página casi vacía, `state-test.html`, que importa los datos y el módulo del estado y verifica seis hechos. Cada comprobación es una línea: una descripción y una condición que debe ser verdadera.

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

Ábrela con tu servidor en `…/07-dom-eventos-estado/panel/state-test.html`:

```text
Prueba del estado
ok     al inicio se ve el orden original
ok     ordenado: del más rápido al más lento
ok     ordenado: el que no tiene medida va al final (Inventario)
ok     ordenar no cambia el arreglo original
ok     seleccionar guarda el id
ok     seleccionar el mismo otra vez lo deselecciona
```

Si cambias `visible` para que use `sort` en lugar de `toSorted`, la comprobación `ordenar no cambia el arreglo original` se pone en `FALLA`. Hazlo, míralo en rojo, y deshaz el cambio: así sabes que la prueba protege algo de verdad. Fíjate en por qué la segunda comprobación mira el orden completo y no solo el primero: Catálogo ya era el más rápido y el primero de la lista, así que «el primero es Catálogo» se cumpliría aunque el orden no hiciera nada. Una prueba que no puede fallar no prueba nada.

**El dibujado.** Con el estado separado, `render` queda corto y repetitivo, que es justo lo que se quiere. Este es `js/view.js` completo; ya conoces `createRow` y `label`, y lo nuevo son `describe`, que arma la frase del detalle (`toLowerCase()` devuelve el texto en minúsculas: «Disponible» pasa a «disponible» a media frase), y la función `render` del final:

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

Mira las primeras líneas de `render`: el resumen que escribiste a mano en la lección 2 lo escribe ahora `summarize`, la función de la lección 6, en los cuatro `<dd>` del `<dl>`. Las cifras son las mismas; la diferencia es que ya no las sumas tú, y que el día que cambie un servicio, cambian solas.

Observa que `render` recibe el estado y un objeto con los elementos del documento que necesita (`elements`). No los busca ella: se los pasan. Así `js/view.js` no depende de cómo se llame ningún `id` en tu HTML, y el mismo código sirve para probar con elementos de mentira.

Observa también cuánto texto entra al documento, y por dónde: el resumen, el nombre, el estado, el tiempo y el detalle. **Todos entran con `textContent`.** El `revisor` no usa `innerHTML` ni una sola vez. Los números y el estado de un servicio son datos de fuera aunque hoy vivan en tu archivo.

**El costo de volver a dibujar todo.** `replaceChildren` descarta todas las filas y pone filas nuevas. Es simple, es suficientemente rápido para cinco filas o para quinientas, y tiene un efecto que debes entender porque afecta a quien usa el teclado: **el botón que tenía el foco desaparece**. Si una persona navega con Tab hasta «Ver detalle de Pagos» y presiona Enter, el panel se vuelve a dibujar, el botón viejo se tira, y el foco cae en el `body`: la persona tiene que volver a recorrer toda la página desde arriba para seguir. Es un defecto de accesibilidad que no se ve con el mouse, y por eso nadie lo nota hasta que alguien lo reporta. Probarlo con el teclado, como pide el criterio de cierre del curso, es lo que lo detecta.

La solución está en `main.js`. Antes de cambiar el estado, se anota el `id` del servicio cuyo botón tiene el foco (`document.activeElement` es el elemento enfocado, y su `dataset.id` es el servicio); se cambia el estado; se dibuja; y se le devuelve el foco al botón nuevo que tenga el mismo `data-id`. Para armar el selector se usa `CSS.escape`, que protege el `id` de caracteres que tienen significado en un selector, como comillas o corchetes: los `id` llegan con los datos, desde la lección 8 llegarán por la red, y uno como `pagos"norte` rompería un selector armado a mano ([MDN: `CSS.escape`](https://developer.mozilla.org/en-US/docs/Web/API/CSS/escape_static)). Este es `js/main.js` completo. Reemplaza al de la lección 6, que solo escribía en la consola:

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

Y el HTML. Es el `index.html` que traías, con cambios pequeños, y ninguno de lo que significa: los cuatro `<dd>` del resumen pierden sus cifras escritas a mano y ganan un `id`; el `<tbody>` pierde sus cinco filas y gana el suyo, `services-body`; la tabla gana una cuarta columna, «Acción», y el encabezado de la de tiempos, la clase `number`; la barra de controles gana el botón «Ordenar por tiempo de respuesta», con su `aria-pressed`; y debajo de la tabla aparece `#detail`, una región viva vacía. El campo de búsqueda y los radios siguen ahí sin hacer nada (los conecta la lección 10), igual que «Revisar ahora» (lo conecta la lección 8). Y la «Última revisión» del encabezado sigue escrita a mano: se volverá verdadera cuando los datos lleguen de verdad, en la lección 8.

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

Por último, la hoja. `css/styles.css` es la de la lección 5 con un cambio y un bloque nuevo. El cambio: la regla de la lección 3 que alineaba a la derecha los tiempos apuntaba a `th:last-child, td:last-child`, la última celda de cada fila. Con la columna «Acción», la última celda ya no es la de los tiempos, así que la regla pasa a apuntar a una clase, `.number`, que `createRow` pone en la celda del tiempo y el HTML en su encabezado. Un selector que depende de la posición se rompe en cuanto alguien agrega una columna; uno con nombre, no. El bloque nuevo va al final del archivo y **reabre** la capa `components`: una capa se puede abrir tantas veces como haga falta, y lo que se agrega se suma a lo que ya tenía, en orden.

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

El color nuevo se declara como variable en `:root`, como pide la lección 3: el resto de la hoja no escribe colores sueltos. Y la última regla tiene historia. Al probar el panel a 320 píxeles sin ella, la página volvió a desbordar: medía 498 px de ancho. La culpable no era la tabla, que sigue dentro de su caja, sino el texto oculto de los botones. Un elemento con `position: absolute` se coloca respecto de su ancestro *posicionado* más cercano, y si no hay ninguno, respecto de la página entera; así escapaba de la caja que se desplaza y estiraba el documento. Con `position: relative` en `.table-scroll`, la caja pasa a ser ese ancestro, el texto oculto se queda adentro y la medición vuelve a 320. Es el tipo de defecto que solo encuentra quien mide a 320 píxeles después de cada cambio, no solo en la lección del acomodo.

**Haz la prueba completa.** Abre el panel. El resumen debe decir 5 servicios revisados, 4 de 5 disponibles, 1 caído y 465 ms de respuesta promedio: las cifras que escribiste a mano en la lección 2, calculadas ahora por las funciones de la lección 6 y escritas por las de esta. Haz clic en «Ordenar por tiempo de respuesta»: «Notificaciones» sube al segundo lugar, detrás de «Catálogo», que ya era el más rápido, y «Inventario», que no respondió, se va al último. Ahora **sin tocar el mouse**: presiona Tab hasta llegar a un botón «Ver detalle», presiona Enter y comprueba que el detalle aparece abajo y que el foco sigue en ese mismo botón. Es el comportamiento que esta lección protege.

**Una última comprobación de seguridad.** Agrega a `js/services.js` un servicio, con su `id`, cuyo `name` sea `<img src="x" onerror="document.title = 'hackeado'">`, recarga y observa que la tabla muestra ese texto, sin más, y el título de la pestaña no cambia. Esa es la diferencia entre un panel que dibuja datos y uno que los ejecuta. Quita la línea al terminar.

## El error que vas a ver

El error más frecuente de quien empieza con el DOM es escribir el programa **antes** de que exista el elemento que busca. La figura 7.7 lo provoca a propósito, con un `<script>` común (no un módulo) en el `<head>`:

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

Ábrela, abre la consola con `F12` y verás esto:

```text
Consola de Chrome:
Uncaught TypeError: Cannot set properties of null (setting 'textContent')

Consola de Firefox:
TypeError: document.querySelector(...) is null

La página se queda con «Esperando…».
```

El mensaje dice, traducido: «No se puede escribir la propiedad `textContent` de `null`». Es una cadena de causas:

1. Un `<script>` común se ejecuta **en el instante en que el navegador lo lee**. Como está en el `<head>`, el navegador todavía no ha construido el `<body>`.
2. `document.querySelector("#message")` busca un elemento que aún no existe y devuelve `null`, que es la respuesta «no encontré nada».
3. `null.textContent = "Hola"` es una operación imposible, porque `null` no tiene propiedades. JavaScript se detiene ahí.

Hay tres maneras de arreglarlo, y la mejor es la que ya usas: **`<script type="module">`**, que se difiere solo, es decir, se ejecuta cuando el documento ya se leyó ([MDN: el elemento `script`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script)). Las otras son agregar `defer` a un script común, o poner el script al final del `<body>`. Prefiere el módulo: además da un ámbito propio a tus variables (no ensucian el espacio global) y activa el modo estricto sin que lo pidas.

Cuando el mensaje sea el mismo pero el script *sí* esté en un módulo, la causa es otra: un selector mal escrito (`#mesage` en lugar de `#message`) o una búsqueda en la página equivocada. **Lee el mensaje de derecha a izquierda**: ¿qué llamada devolvió `null`? Pon `console.log(document.querySelector("#message"))` justo antes de la línea que falla; si imprime `null`, el problema es el selector o el momento, no lo que haces después con él.

## Lo que se hace mal

- **Escribir un dato de fuera con `innerHTML`.** El costo es el ataque que viste en la figura 7.3: quien controla un texto controla tu página. Se corrige con `textContent` y con nada más; escapar a mano los signos `<` y `>` es la receta de todas las fallas que se corrigieron una por una durante veinte años.
- **Dejar un `onclick="..."` en el HTML.** Es código escrito dentro de un atributo: mezcla la estructura con el comportamiento, solo puede apuntar a funciones globales (y los módulos no las tienen) y, como verás en la lección 11, una política de seguridad estricta lo bloquea por completo. Se escribe `addEventListener` en el JavaScript.
- **Un `div` o un `span` con clic en lugar de un `button`.** Se ve igual y no se alcanza con Tab ni se activa con Enter. Arreglarlo exige `tabindex`, un `role` y dos manejadores de teclado, y aun así queda peor que el botón nativo.
- **Preguntarle al documento cuál es el estado.** `if (boton.textContent === …)` convierte la pantalla en la fuente de la verdad. Las dos copias se contradicen en cuanto cambia el texto. La verdad vive en el objeto de estado.
- **Un oyente nuevo en cada dibujado, sobre un elemento que no se tira.** Si en `render` escribieras `elements.body.addEventListener(...)`, cada vez que se volviera a dibujar se sumaría **otro** oyente al mismo `<tbody>`, y al segundo clic el detalle se seleccionaría y se deseleccionaría dos veces. Los oyentes se registran **una vez**, en `main.js`, no en el dibujado.
- **Modificar el arreglo original al ordenar.** `services.sort(...)` cambia el arreglo de los datos, y el orden original se pierde. Se usa `toSorted`, que devuelve una copia.
- **Leer medidas del documento mientras lo escribes.** Agregar las filas una por una no es, por sí solo, caro: el navegador espera a que tu código termine y calcula la posición de todo una sola vez antes de pintar. Lo caro es intercalar lecturas de medidas (`offsetHeight`, `getBoundingClientRect()`) entre escritura y escritura, porque cada lectura lo obliga a recalcular en ese instante; web.dev lo llama [*layout thrashing*](https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing). En el panel se construyen todas las filas primero y se entregan juntas con `replaceChildren(...filas)` por otra razón: en un solo paso se quitan las filas viejas y se ponen las nuevas, sin estados intermedios a medio dibujar.
- **Armar un selector a mano con un dato.** `querySelector('[data-id="' + id + '"]')` se rompe con una comilla en el `id`. `CSS.escape` existe para esto.
- **Poner un dato de fuera como nombre de clase sin comprobarlo.** `row.className = service.status` deja que el dato decida qué estilos se aplican. Se compara contra una lista cerrada, como hace `createRow`.

## Ejercicios

### Ejercicio 1 — Rompe el panel a propósito

En `js/view.js`, cambia la línea que escribe el nombre del servicio para que use `innerHTML` en lugar de `textContent`. Luego agrega a `js/services.js` un servicio cuyo `name` sea `<img src="x" onerror="document.title = 'hackeado'">`. Antes de recargar, escribe en tu bitácora qué crees que se verá en la fila y en la pestaña. Recarga, compara, y después deshaz los dos cambios. Responde: ¿qué otros textos del panel, además del nombre, serían un camino para el mismo ataque si usaran `innerHTML`?

### Ejercicio 2 — El más lento, en el resumen

Agrega al resumen un quinto par: «Más lento», con el nombre y el tiempo del servicio disponible que más tarda en responder, por ejemplo «Búsqueda (950 ms)». Si ningún servicio respondió, debe decir «sin datos». Decide, y justifica en una frase, en qué archivo va cada cambio: la cuenta, el lugar en la página, la forma de encontrarlo y el texto. ¿Hay que tocar `js/state.js`?

### Ejercicio 3 — Escape quita la selección

Haz que, al presionar la tecla Escape, se quite la selección del servicio, sin importar dónde esté el foco. Pista: el evento se llama `keydown`, `evento.key` dice qué tecla fue, y se escucha en `document`. Tu cambio debe tocar `js/state.js` y `js/main.js`, y **no** `js/view.js`. Comprueba con el teclado que, después de Escape, el foco sigue en el botón en que estaba.

## Soluciones

### Solución 1

En `createRow`, la línea `nameCell.textContent = service.name;` pasa a `nameCell.innerHTML = service.name;`. Al recargar, la fila del servicio hostil no muestra el nombre (la imagen no carga y no deja texto) y el título de la pestaña cambia a «hackeado». Con la línea restaurada, la fila muestra el texto completo del ataque y el título no se mueve.

Respuesta a la pregunta: el **estado** (`service.status` se pasa por la lista cerrada, así que no es un camino, pero lo sería si se escribiera con `innerHTML`), el **tiempo** (`${service.responseMs} ms`), el **resumen** y el **detalle**: cualquier dato que venga de fuera y se escriba con `innerHTML` es un camino. Un número tampoco está a salvo en cuanto el dato llega por la red: nada garantiza que `responseMs` sea un número y no un texto con HTML. Por eso la regla no distingue entre «datos peligrosos» y «datos inofensivos»: **ninguno entra con `innerHTML`**.

### Solución 2

La cuenta es una pregunta sobre los datos y va con las otras cuentas, en `js/stats.js`; el lugar en la página es un par más del `<dl>`, en `index.html`; encontrar ese lugar es trabajo de `js/main.js`, que es quien conoce los `id`; y escribir el texto es dibujado, así que va en `js/view.js`. `js/state.js` no cambia, porque el más lento se calcula a partir de la lista y no es algo que el panel tenga que recordar.

```js
// js/stats.js — al final del archivo
export function slowestService(list) {
  return list
    .filter((service) => service.status === "available")
    .toSorted((a, b) => b.responseMs - a.responseMs)[0] ?? null;
}
```

Es la misma idea que `slowest` del Ejercicio 2 de la lección 6, pero devuelve el servicio entero y no su nombre, porque el texto necesita los dos datos. Con una lista sin servicios disponibles, `[0]` da `undefined` y `?? null` lo convierte en `null`, que es la forma del curso de decir «no hay dato». En `index.html`, un par más al final del `<dl>`:

```html
<div>
  <dt>Más lento</dt>
  <dd id="summary-slowest"></dd>
</div>
```

En `js/main.js`, `slowest: document.querySelector("#summary-slowest"),` dentro del objeto `elements`. Y en `js/view.js`, se importa junto a `summarize` y se escribe en `render`, después del promedio:

```js
import { summarize, slowestService } from "./stats.js";
// …
  const slowest = slowestService(services);
  elements.slowest.textContent = slowest === null ? "sin datos" : `${slowest.name} (${slowest.responseMs} ms)`;
```

El resumen dice «Más lento: Búsqueda (950 ms)». Y como el `<dl>` de la lección 5 cuenta sus propias columnas, el quinto par se acomoda solo, sin tocar el CSS.

### Solución 3

Una función nueva en `js/state.js` (la única forma de cambiar el estado es una función del estado):

```js
export function clearSelection(state) {
  state.selected = null;
}
```

En `js/main.js`, se agrega `clearSelection` al `import` y, antes de la última línea (`render(state, elements);`), el oyente:

```js
// Escape quita la selección, esté donde esté el foco.
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") update(() => clearSelection(state));
});
```

Se usa `update` y no `render` a secas para que el foco vuelva al botón que lo tenía. `js/view.js` no cambia: ya sabía dibujar el caso «sin selección».

## Cómo sé que lo logré

- [ ] Con la carpeta `programas/` del repositorio servida en tu computadora, al abrir `07-dom-eventos-estado/fig07_03.html`, el título de la pestaña cambia a «Se ejecutó código que venía en un dato». En `fig07_04.html`, no.
- [ ] En `07-dom-eventos-estado/panel/`, el resumen dice 5, 4 de 5, 1 y 465 ms, y ninguna de esas cifras está escrita en el HTML.
- [ ] El `<tbody id="services-body">` de tu `index.html` no tiene filas escritas a mano, y el Inspector muestra cinco.
- [ ] Con solo el teclado: Tab llega a «Ver detalle de Pagos», Enter muestra «Pagos: disponible, responde en 480 ms.» y el foco sigue en ese botón.
- [ ] `state-test.html` muestra seis líneas que empiezan con `ok`.
- [ ] A 320 px de ancho no hay barra de desplazamiento horizontal: en la consola, `document.documentElement.scrollWidth <= document.documentElement.clientWidth` devuelve `true`.
- [ ] La consola del navegador no muestra ningún error en el panel.
- [ ] Buscas la palabra `innerHTML` en tus archivos `.js` y no aparece.

**Repaso de lecciones anteriores** (respóndelas sin mirar, y después comprueba):

1. En la lección 2: ¿por qué un `<button>` es mejor que un `<div>` con un clic?
2. En las lecciones 4 y 5: ¿qué hace `flex-wrap` y cuándo conviene antes que una consulta `@media`?
3. En la lección 6: ¿por qué un servicio caído tiene `responseMs: null` y no cero?

## Para leer más

- [MDN — Introducción al DOM](https://developer.mozilla.org/es/docs/Web/API/Document_Object_Model/Introduction) — qué es el árbol del documento y cómo se recorre; consultado el 7 de octubre de 2026.
- [MDN — Burbujeo de eventos](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling) — `target`, `currentTarget` y delegación explicados paso a paso; consultado el 7 de octubre de 2026.
- [OWASP — Prevención de XSS basado en el DOM](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html) — los sumideros peligrosos y por qué `textContent` es la forma segura; consultado el 7 de octubre de 2026.
- [MDN — `Element.innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) — la advertencia de seguridad con el ejemplo de `onerror`; consultado el 7 de octubre de 2026.
