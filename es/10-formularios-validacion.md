# Lección 10 — Formularios y validación

**Tiempo:** dos sesiones de unos 90 min. Un reparto que funciona: la primera, «El porqué antes del cómo» y de 10.1 a 10.4 (lo que el navegador ya valida, `validity` y `setCustomValidity`, `:user-invalid` y el error escrito donde se lee), con sus figuras abiertas en el navegador; la segunda, 10.5 completa, que arma el panel en siete pasos y cada uno se comprueba antes del siguiente, y después «El error que vas a ver» y los ejercicios. Cada sesión termina en algo que puedes abrir y probar.

**Qué construyes:** el formulario para agregar servicios al `revisor` y los filtros para buscar entre ellos

**Qué aprendes:** la validación que el navegador ya trae, `:user-invalid`, y cómo decir un error para que un lector de pantalla lo anuncie

## Al terminar vas a poder

- Elegir el `type` de un campo y los atributos (`required`, `minlength`, `pattern`, `min`, `max`, `step`) que hacen que el navegador valide sin una línea de JavaScript.
- Leer qué regla incumple un campo con `validity`, y escribir una regla propia con `setCustomValidity` sin dejar el campo inválido para siempre.
- Explicar la diferencia entre `:invalid` y `:user-invalid`, y por qué un formulario no debe abrirse en rojo.
- Mostrar un error como texto en la página, asociado a su campo con `aria-describedby` y `aria-invalid`, de modo que un lector de pantalla lo anuncie.
- Escribir un filtro como función pura y conectarlo a un campo de búsqueda y a un selector.
- Decir, con un ejemplo, por qué validar en el navegador no es seguridad.

## El porqué antes del cómo

Hasta la lección anterior el `revisor` solo mira: trae un archivo con servicios, lo dibuja y calcula cuántos están disponibles y cuánto tardan en promedio. Mirar es la mitad del trabajo de quien opera un conjunto de servicios. La otra mitad es actuar: dar de alta uno que acaba de nacer, y encontrar rápido el que está dando problemas cuando la lista deja de caber en una pantalla.

Las dos cosas son formularios. Un formulario es el lugar de la página donde una persona le entrega datos al programa, y eso lo vuelve distinto de todo lo que hiciste hasta ahora. Los servicios del archivo JSON los escribiste tú, o los escribió un programa que conoces. Lo que alguien teclee en un campo de texto lo escribió una persona con prisa, con el teléfono en una mano, que puede dejar el campo vacío, poner un nombre que ya existe, escribir «mil» donde se esperaba un número, o pegar un texto de doscientos caracteres. En la lección 7 aprendiste que los datos de fuera no se confían al dibujarlos (`textContent`, nunca `innerHTML`). En la lección 8 aprendiste a mirar `response.ok` antes de dar por buena una respuesta, y en la 9, que una petición puede fallar de varias maneras y que cada falla se traduce a una frase que la persona entienda. Esta lección agrega la tercera puerta de entrada: lo que escribe la persona.

Hay una buena noticia, y es la razón de que esta lección sea corta en JavaScript: **el navegador ya sabe validar formularios**. Lleva años sabiéndolo. Con unos cuantos atributos de HTML —que ya conoces de la lección 2, porque son parte de la semántica de los campos— el navegador impide enviar un formulario incompleto, avisa qué falta y mueve el foco al campo equivocado. La mala noticia es la que ocupa la segunda mitad de la lección: lo que el navegador muestra por su cuenta es una burbuja que desaparece en segundos, no se puede estilizar, está en el idioma del navegador y no siempre llega a quien usa un lector de pantalla. Un panel que cualquiera pueda usar necesita que el error quede escrito en la página, junto al campo, donde se pueda releer.

Por eso el orden de la lección es el mismo que conviene seguir siempre: primero lo que el navegador hace gratis, después el momento correcto para mostrar el error, y al final el texto del error. Si empiezas por escribir JavaScript, terminas reescribiendo, peor, lo que ya venía hecho.

### El estado del panel al cierre de la lección 9

Esta lección parte de un panel concreto, y es mejor decirlo con todas sus letras que dejar que lo supongas. Al cerrar la lección 9, el `revisor` tiene estas piezas:

| Pieza | Qué hace | De qué lección viene |
|---|---|---|
| `index.html` | el esqueleto: encabezado con la «Última revisión», el resumen, y en la sección de servicios las zonas de aviso (`#notice` y `#error-notice`, presentes desde el principio), el botón «Reintentar» y una zona de datos con la barra de controles —el buscador y los radios «Mostrar», todavía sin efecto, «Revisar ahora» y «Ordenar»—, la tabla con su `caption` y el detalle | 2, 4, 5, 7, 8 y 9 |
| `css/styles.css` | capas, variables de color, insignias de estado (`status-available`, `status-down`), el acomodo, la tabla, el foco visible, la clase `.visually-hidden` y los avisos | 3, 4, 5, 7 y 9 |
| `js/stats.js` | `countByStatus`, `averageResponseMs` y `summarize`, funciones puras sobre el arreglo de servicios | 6 |
| `js/load.js` | `loadServices(url, timeoutMs)`: `fetch` con tiempo límite, revisa `response.ok`, y lanza un `Error` con un mensaje que una persona puede leer | 8 y 9 |
| `js/state.js` | el estado (`phase`, `services`, `errorMessage`, `checkedAt`, `sortByTime`, `selected`) y las únicas funciones que lo cambian | 7, 8 y 9 |
| `js/view.js` | `render(state, elements)`: dibuja las tres situaciones (cargando, error, vacío), el resumen, la hora y la tabla, siempre con `textContent` | 7, 8 y 9 |
| `js/main.js` | junta las piezas: carga, escucha eventos, cambia el estado y vuelve a dibujar; acepta `?case=empty`, `?case=error`, `?case=invalid` y `?case=timeout` para ver cada situación | 8 y 9 |
| `data/services.json` y `data/services-empty.json` | los cinco servicios de ejemplo con las claves `id`, `name`, `status` (`available` o `down`) y `responseMs`; y una lista vacía | 6 y 8 |

Con ese panel abierto en `http://127.0.0.1:8000/09-cuando-algo-falla/panel/` (el servidor se enciende desde la carpeta `programas/` del [repositorio del curso](https://github.com/HabilMX/curso-web), descargado en tu computadora, como en la lección 9; para que `?case=timeout` de verdad agote el tiempo, enciéndelo con `python3 09-cuando-algo-falla/slow-server.py`, como allí), el resumen dice 5, 4 de 5, 1 y 465 ms, y la tabla tiene cinco filas, cada una con su botón «Ver detalle».

Lo que el panel **todavía no tiene**: ninguna forma de agregar un servicio, y un buscador y un grupo de radios que están en la página desde la lección 2 sin hacer nada. La lección 2 lo avisó: «Todavía no filtra ni busca nada: eso llega más adelante». Hoy llega: construyes el formulario para agregar, y haces que el buscador y los radios filtren. En esta lección los archivos están en `10-formularios-validacion/panel/`, que es el panel de la lección 9 más lo nuevo.

## Los conceptos

Hay tres ideas nuevas en esta lección, y se apoyan una en la otra: la validación que trae el navegador (10.1 y 10.2), el momento en que conviene mostrar el error (10.3) y el error escrito donde se lee (10.4). La sección 10.5 junta las tres en el panel.

Antes de empezar, una instrucción de hábito para todas las lecciones desde esta: **predice antes de ejecutar**. Cada vez que veas un programa, antes de abrirlo escribe en tu bitácora qué crees que va a pasar. Acertar da gusto, pero equivocarse enseña más: el hueco entre lo que predijiste y lo que ocurrió es exactamente lo que te falta por entender.

### 10.1 El navegador ya sabe validar

Empecemos por lo concreto. La página de abajo es un formulario para pedir un aviso cuando un servicio caiga: un correo, el nombre del servicio y cuánto debe tardar para que cuente como problema. Léela y predice: ¿qué pasa si presionas «Pedir aviso» con todo vacío? ¿Y si escribes `dorian@` en el correo?

El programa del final es corto y solo hace una cosa: cuando el formulario se envía, escribe lo que se capturó. Usa una pieza nueva, `new FormData(form)`. Recuerda de «Decidir, repetir y avisar de un error», en la lección 6, que `new` fabrica un objeto nuevo a partir de un molde; este molde, [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData), lee todos los campos del formulario por su atributo `name`, y `data.get("email")` devuelve lo que se escribió en el campo que se llama `email`. Lo verás de nuevo, con más detalle, en el panel.

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

Ábrela con el servidor local que ya conoces (encendido desde la carpeta `programas/` del repositorio; esta página está en [`programas/10-formularios-validacion/`](https://github.com/HabilMX/curso-web/tree/main/programas/10-formularios-validacion), en `http://127.0.0.1:8000/10-formularios-validacion/fig10_01.html`) y presiona el botón sin escribir nada. Sin una línea de JavaScript que valide, el navegador **no envía** el formulario, mueve el foco al correo y muestra una burbuja que dice que falta llenar el campo. Escribe `dorian@` y vuelve a presionar: el navegador dice que la dirección está incompleta, y lo dice con una frase precisa (Chrome en español: «Ingresa texto después del signo "@"…»; otro navegador usa otras palabras). Con `ana@ejemplo.mx` y un nombre de servicio, el formulario sí se envía y el pequeño programa de abajo escribe el resultado.

La página, al cargarla, muestra solo esto:

```text
Avisarme cuando caiga un servicio
Los campos marcados con * son obligatorios.
Correo *
Servicio *
Avisar si responde en más de (ms)
Pedir aviso
```

Todo eso salió de cuatro atributos. Vamos uno por uno, porque son la caja de herramientas de la validación y vale la pena saber qué promete cada uno.

**`required`** dice que el campo no puede estar vacío. Es el más usado y el más simple: en un campo de texto significa «al menos un carácter», en una casilla «marcada», y en un `<select>` «hay una opción elegida, y no es la de invitación». Este último caso tiene una regla precisa que sorprende: si la **primera** opción tiene `value=""` (como «Elige un estado» en el formulario del panel), la [especificación de HTML](https://html.spec.whatwg.org/multipage/form-elements.html#placeholder-label-option) la llama *opción de invitación* y, si es la que está elegida, el campo cuenta como vacío. Fíjate en que la regla es sobre la primera opción, no sobre cualquier valor vacío: al preparar esta lección se comprobó en Chrome que una segunda opción con `value=""` sí deja el `<select required>` como válido. Es la forma estándar de poner una opción de invitación sin que alguien pueda enviarla por accidente, y por eso va siempre primero.

**`type`** no solo cambia el teclado que aparece en el teléfono: también valida. Un `type="email"` rechaza lo que no se parece a una dirección, un `type="url"` lo que no se parece a una URL y un `type="number"` lo que no es un número. Una advertencia honesta sobre `email`: el navegador acepta `a@b` porque, según la especificación, una dirección sin punto en el dominio es válida (existen en redes internas). Lo que valida es la *forma*, no que el correo exista. Para saber si existe hay una sola prueba: mandar un mensaje y esperar a que alguien lo abra.

**`minlength` y `maxlength`** limitan la longitud. `maxlength` impide escribir más allá del límite, en silencio, y por eso tiene mala fama: la persona teclea y no pasa nada, sin explicación. Úsalo cuando el límite sea real (un campo de la base de datos con ese tamaño) y avisa cuánto queda. `minlength`, en cambio, solo se comprueba cuando la persona *edita* el campo. Si el HTML trae un valor inicial que ya viola `minlength`, el navegador no lo marca; al preparar esta lección se comprobó con `value="ab"` y `minlength="5"`: la bandera `tooShort` sigue apagada hasta que alguien teclee.

**Un paréntesis necesario: las expresiones regulares.** El atributo que sigue, `pattern`, recibe una *expresión regular*, y más adelante el panel usará otra en JavaScript. Una **expresión regular** es un patrón escrito en un mini-lenguaje que describe una familia de textos: en lugar de decir «el texto es `Pagos`», dice «el texto empieza con una letra y luego trae cualquier cosa». La mayoría de los caracteres valen por sí mismos (`a` es la letra `a`), y unos cuantos tienen un significado especial. Los que vas a ver en esta lección son estos:

| Pieza | Significa |
|---|---|
| `.` | un carácter cualquiera |
| `\S` | un carácter que **no** es espacio (la `S` mayúscula niega a `\s`, «un espacio») |
| `\w` | una letra sin acento, un dígito o un guion bajo |
| `*` | lo anterior, cero o más veces |
| `+` | lo anterior, una o más veces |
| `?` | lo anterior es opcional: cero o una vez |
| `( … )` | agrupa varias piezas para que `*`, `+` o `?` se apliquen al grupo completo |
| `[ … ]` | un carácter cualquiera de los que están entre corchetes |
| `^` y `$` | el principio y el final del texto |

Un ejemplo resuelto, el del formulario del panel: `\S(.*\S)?`. Se lee de izquierda a derecha: un carácter que no es espacio; luego, opcionalmente, un grupo formado por «cualquier cosa» y otro carácter que no es espacio. Dicho en palabras: empieza y termina con algo que no es un espacio, y en medio puede haber lo que sea, espacios incluidos. Compruébalo con casos: `Pagos` cumple; `A` cumple (el grupo opcional no aparece); `Mis pagos` cumple (el espacio está en medio); ` Pagos` y `Pagos ` no cumplen, y tampoco el texto vacío. Esos seis casos se comprobaron en el motor de JavaScript tal como los compila el navegador. En JavaScript, una expresión regular se escribe entre diagonales, `/…/`, y después de la última diagonal van sus **banderas**, letras que cambian cómo se aplica: `g` (todas las coincidencias, no solo la primera) y `u` o `v` (entender bien los caracteres de Unicode, como las letras con acento). La guía de [expresiones regulares de MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions) tiene la lista completa; para esta lección basta la tabla.

**`pattern`** recibe una expresión regular que el valor completo debe cumplir (la expresión está anclada: es como si llevara `^` al principio y `$` al final). En el formulario del panel, `pattern="\S(.*\S)?"` dice «empieza y termina con algo que no sea un espacio». Dos trampas: la primera es que los navegadores actuales compilan el patrón en un modo estricto (la bandera `v`), en el que un guion suelto dentro de un conjunto, como en `[\w-]+`, es un error de sintaxis. El patrón inválido no avisa de forma ruidosa: el navegador lo ignora y el campo queda sin regla, con un mensaje solo en la consola. La segunda trampa es la gemela: un patrón demasiado ingenioso rechaza datos reales, como un apellido con apóstrofo o un nombre con acento. Un patrón no es un acto de fe, es una regla que alguien tiene que mantener.

**`min`, `max` y `step`** sirven para los campos numéricos (y de fecha). `min="0" max="60000"` fija el rango. `step` fija la cuadrícula de valores válidos, y aquí hay un detalle que pesa: la cuadrícula se cuenta desde `min`. Con `min="0" step="100"` son válidos 0, 100, 200…, de modo que 1050 es inválido aunque esté dentro del rango.

Un comentario sobre `type="number"`, porque la decisión no es obvia. El campo numérico valida solo, rechaza lo que no es número y ofrece flechas para subir y bajar. «Número», ojo, no es «solo dígitos»: también acepta un signo, decimales (si `step` los permite) y hasta la notación científica; al preparar esta lección se comprobó en Chrome 154 que `1e2` es un valor válido y vale 100. Además, esas flechas se activan sin querer con la rueda del mouse, y quien usa un lector de pantalla no encuentra un cuadro de texto, sino un «botón de número» que sube y baja: su rol implícito es `spinbutton`, según [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/number). El sistema de diseño del gobierno británico, que investigó el tema con usuarios reales, recomienda `type="text"` con `inputmode="numeric"` para números que no se incrementan (el [GOV.UK Design System](https://design-system.service.gov.uk/components/text-input/) lo argumenta con su investigación), y la [documentación de MDN sobre `type="number"`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/number) hace la misma salvedad para códigos postales o tarjetas. El tiempo de respuesta del `revisor` sí es una cantidad con rango («cuántos milisegundos»), así que usamos `type="number"` con `min` y `max`; si tu campo fuera un número de folio, usarías texto con `inputmode`.

Y un atributo más, que no valida pero pertenece a este tema: **`autocomplete`**. Le dice al navegador (y a quien te lee con tecnología de asistencia) qué clase de dato pide el campo. `autocomplete="email"` hace que el navegador ofrezca el correo guardado, y el criterio [1.3.5 de las pautas de accesibilidad (WCAG 2.2)](https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html) pide que los campos que recogen datos personales declaren su propósito de forma que una máquina lo entienda. Los campos del `revisor` (nombre de un servicio, estado, milisegundos) no son datos personales, así que ahí no corresponde un valor de la lista; por eso el formulario del panel lleva `autocomplete="off"`: no queremos que el navegador sugiera nombres de servicios que alguien escribió en otro sitio. La lista de valores permitidos está en la [documentación de MDN sobre `autocomplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete).

### Dos cosas que la validación del navegador no es

**No es seguridad.** Es comodidad. MDN lo dice sin rodeos en su [guía de validación de formularios](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation): la validación en el cliente no debe considerarse una medida de seguridad exhaustiva, porque es muy fácil de saltar. Quien quiera enviar un valor inválido no usa tu formulario: abre las herramientas del navegador, quita el atributo `required` de un clic, o ni siquiera usa un navegador y manda la petición con una herramienta de línea de comandos. La validación del cliente existe para que la persona honrada se equivoque menos. La validación que protege es la que repite el servidor, y la tendrás que escribir allá cuando tu panel tenga uno (en el [curso de TypeScript](https://www.habil.mx/es/cursos/typescript/) de esta casa el panel recibe un servidor, y ese es el momento).

En este curso el panel no tiene servidor: lo que agregues vive en la memoria de la página y desaparece al recargar. Eso es una limitación que se dice de frente, no un descuido; lo que sí aplica es el hábito: **cada dato que entra se valida en el borde donde entra**.

**No es el único mecanismo.** `novalidate` en el `<form>` apaga la validación automática al enviar, y `formnovalidate` en un botón la apaga para ese botón (útil en un «Guardar borrador»). Apagarla no desactiva la API de validación que veremos a continuación: el formulario sigue pudiendo preguntarle a cada campo si es válido. En el panel no usaremos `novalidate`: queremos que el navegador siga bloqueando el envío, y cambiaremos solo *cómo se muestra* el mensaje.

Un último detalle del envío: un campo con `disabled` queda fuera de todo. No se valida, no cuenta para `checkValidity()` y no se envía con el formulario. Al preparar esta lección se comprobó con un campo `required` y `disabled` vacío: `willValidate` es falso, `validity.valid` es verdadero y el campo no aparece en `FormData`. El panel lo aprovecha: si el servicio está caído no tiene sentido pedir su tiempo de respuesta, así que ese campo se desactiva y deja de ser obligatorio por sí solo.

### 10.2 Leer el estado de un campo: `validity` y `setCustomValidity`

La validación nativa tiene dos mitades. Los atributos la *declaran*; la **API de validación de restricciones** (Constraint Validation API, está descrita en [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Constraint_validation) y en la [especificación de HTML](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#constraints)) te deja *preguntar* y *añadir reglas* desde JavaScript.

Cada campo tiene una propiedad `validity` ([`ValidityState`](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState)): un objeto con una bandera por cada regla que se puede incumplir. Las que usarás:

| Bandera | Se enciende cuando |
|---|---|
| `valueMissing` | el campo es `required` y está vacío |
| `typeMismatch` | el valor no tiene la forma del `type` (correo, URL) |
| `patternMismatch` | el valor no cumple el `pattern` |
| `tooShort` | la persona escribió menos que `minlength` |
| `rangeUnderflow` / `rangeOverflow` | el número queda por debajo de `min` o por encima de `max` |
| `stepMismatch` | el número no cae en la cuadrícula de `step` |
| `badInput` | la persona escribió algo que el campo no puede convertir (en un `type="number"`, un `-` suelto) |
| `customError` | tu código llamó a `setCustomValidity` con un mensaje |
| `valid` | ninguna de las anteriores |

La página que sigue recorre esas banderas con una forma de ciclo que todavía no has usado: **`for…in`**. Ya conoces `for…of` de la lección 6, en «Decidir, repetir y avisar de un error»: recorre los **valores** de una lista. `for (const flag in objeto)` recorre otra cosa: los **nombres de las propiedades** de un objeto, uno por vuelta, como texto. Con `{ valueMissing: true, tooShort: false }`, `flag` valdría `"valueMissing"` en la primera vuelta y `"tooShort"` en la segunda. Para leer el valor de una propiedad cuyo nombre está guardado en una variable se usan corchetes: `control.validity[flag]` es `control.validity.valueMissing` cuando `flag` vale `"valueMissing"`. Un detalle técnico que aquí trabaja a tu favor: `for…in` también visita las propiedades que el objeto hereda de su molde, y las banderas de `validity` viven justo ahí, en el molde `ValidityState`; por eso el ciclo las encuentra todas ([MDN: `for…in`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in)). En un objeto escrito por ti, donde las propiedades heredadas no interesan, se recorre con `Object.keys` o se filtra con `Object.hasOwn`, como en la lección 9.

Antes de leer la página que sigue, predice: si escribes `-5` en un campo numérico con `min="0"` y `step="100"`, ¿qué banderas se encienden? (Una sola respuesta es probable; dos es la correcta.)

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

La página recorre las propiedades de `validity` y lista las que valen `true`. Al abrirla, los dos campos vacíos incumplen su `required`:

```text
Las banderas de validity
Tiempo de respuesta (ms)
Nombre (no puede ser «admin»)
Banderas activas
tiempo -> valueMissing
nombre -> valueMissing
```

Escribe `-5` en el tiempo y verás `rangeUnderflow, stepMismatch`: está por debajo de `min` y además cae fuera de la cuadrícula de 100 en 100 contando desde 0. Por eso dije que una sola respuesta es lo probable y dos la correcta: **varias banderas pueden estar encendidas a la vez**, y por eso un programa que muestra mensajes tiene que decidir cuál va primero. Con `1050` solo sube `stepMismatch`; con `70000`, `rangeOverflow`. En el nombre, escribir `ad` enciende `tooShort`, y escribir `admin` apaga esa bandera y enciende `customError`.

Esa última es la regla propia. `setCustomValidity("texto")` le dice al campo «considérate inválido, y este es el motivo»; el navegador además la usa como el texto de su burbuja. Lleva una trampa que causa un error clásico: **un mensaje no vacío deja el campo inválido para siempre**. El navegador no sabe cuándo tu regla ya se cumple; eres tú quien debe llamar a `setCustomValidity("")` en cuanto el valor sea correcto. En la página, la función `validateName` lo hace con una sola expresión (un ternario): si el nombre es `admin` pone el mensaje, y si no pone la cadena vacía. Quitar esa segunda rama es el error más fácil de cometer y el más difícil de entender desde fuera, porque el campo «se ve bien» y el formulario no se envía.

Un dato de utilidad antes de seguir: dos métodos permiten preguntar por todo el formulario. `checkValidity()` devuelve `true` o `false` y dispara el evento `invalid` en cada campo inválido, sin mostrar nada. `reportValidity()` hace lo mismo y además muestra la burbuja del navegador. Cuando envías un formulario con el botón, el navegador llama por ti a la segunda.

### 10.3 `:user-invalid`: mostrar el error cuando toca

Hay una pregunta de diseño que parece de gusto y es de respeto: ¿cuándo se pinta un campo de rojo? La respuesta ingenua es «cuando es inválido». El problema es que un campo `required` recién cargado es inválido desde el primer instante: está vacío. Si pintas de rojo todo lo inválido, la persona abre el formulario y encuentra un tablero de errores antes de haber hecho nada. Es como si un cajero te regañara por no haber llegado todavía con el dinero.

La pseudoclase `:invalid` hace justo eso: coincide con todo campo que incumple una regla, desde que carga la página. Su sucesora `:user-invalid` ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/:user-invalid), disponible en todos los navegadores desde noviembre de 2023) coincide solo cuando la persona ya intervino: cuando modificó el campo y salió de él, o cuando intentó enviar el formulario. Es la regla que ya describe lo que quisiste desde el principio.

La página que sigue usa tres piezas pequeñas para mostrar lo que el navegador sabe. `elemento.matches(":user-invalid")` pregunta si el elemento cumple ese selector de CSS en este momento, y devuelve `true` o `false`. `setTimeout(show)`, sin tiempo, pide «ejecuta `show` en cuanto termine lo que está pasando», para leer el estado *después* de que el navegador lo actualizó. Y el `true` al final de `addEventListener` escucha en la fase de captura; la razón se explica en 10.4, con el evento `invalid`.

Predice antes de abrir la página: hay dos campos obligatorios y vacíos, uno estilizado con `:invalid` y otro con `:user-invalid`. ¿Cuál se ve rojo al cargar?

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

Al cargarla, el informe de abajo dice lo que el navegador sabe del segundo campo:

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

El primer campo ya está rojo y el segundo no, aunque ambos están igual de vacíos. Eso lo hace visible la última línea: `:invalid` es verdadero y `:user-invalid` es falso. Ahora haz esto, en este orden:

1. Haz clic en el segundo campo, escribe una letra, bórrala y presiona Tab. El informe cambia: `:user-invalid` pasa a verdadero y el campo se pone rojo.
2. Recarga y presiona «Enviar» sin tocar nada: los dos se ven rojos y el informe también marca `:user-invalid` como verdadero.

Aquí va una diferencia entre navegadores que merece decirse porque te puede confundir al comparar. Si haces clic en un campo vacío y sales de él **sin escribir nada**, Chrome 154 deja `:user-invalid` en falso, pero Firefox 155 lo pone en verdadero. Las dos cosas se comprobaron al preparar esta lección; en Safari no se probó. La especificación deja margen en qué cuenta como «intervino», y la consecuencia práctica es una regla de diseño: **no dependas de `:user-invalid` para los campos que la persona se saltó**. Para esos, el momento seguro es el envío, que en todos los navegadores marca todo.

El estilo del panel usa las dos cosas a la vez, y es lo que verás en `css/styles.css`: `.field :user-invalid, .field [aria-invalid="true"] { … }`. La primera parte pinta lo que el navegador decide marcar; la segunda lo que nuestro código marca. No es redundancia, es cobertura: por cualquiera de los dos caminos el campo se ve en error.

Y un recordatorio de accesibilidad que va con el color: **rojo no es un mensaje**. Un campo con borde rojo y nada más es invisible para quien no distingue el rojo y mudo para quien usa un lector de pantalla. El color acompaña; el texto informa. Eso es lo que sigue.

### 10.4 El error escrito donde se lee

La burbuja del navegador cumple una función, pero tiene cuatro límites que importan. Desaparece en pocos segundos, de modo que quien necesita más tiempo para leer ya no la tiene. No se puede estilizar. Sale en el idioma del navegador y con las palabras del fabricante (al preparar esta lección, Chrome en español dijo «Ingresa texto después del signo "@". La dirección "dorian@" está incompleta.»; en otro navegador o idioma sería otra frase). Y con un lector de pantalla, su anuncio depende de cada combinación de navegador y lector. Las pautas de accesibilidad lo advierten en el documento que explica el criterio [3.3.1, Identificación de errores](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html) (nivel A): el error debe identificarse y describirse **en texto**, y ese documento mismo recomienda no depender solo de la validación nativa por sus límites con la ampliación de pantalla, la permanencia del mensaje y los errores múltiples.

La solución cabe en cuatro piezas, y las verás juntas en una página mínima antes de usarlas en el panel.

**Primera pieza: el mensaje es un párrafo de la página**, que existe desde el principio (vacío) y se llena cuando hay un error. Vive junto al campo y se escribe con `textContent`.

**Segunda pieza: el campo apunta a su mensaje con `aria-describedby`.** Este atributo ([MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-describedby)) le dice a la tecnología de asistencia: «el texto de ese elemento describe este campo». La etiqueta (`<label>`) da el *nombre* del campo y se lee primero; la descripción se lee después. Cuando el foco cae en el campo, el lector dice algo como «Correo, cuadro de edición, Escribe tu correo». Acepta varios identificadores separados por espacio: en el panel, cada campo apunta a su ayuda («Al menos 2 caracteres») y a su error. Se comprobó en el árbol de accesibilidad de Chrome: la descripción del campo del nombre salió como «Al menos 2 caracteres. No puede repetirse. Escribe el nombre del servicio.».

**Tercera pieza: `aria-invalid="true"` marca el campo como inválido** ([MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-invalid)). Así el lector puede decir «no válido» al llegar. MDN aclara cuándo ponerlo: *después* de intentar enviar o de validar, nunca desde que carga la página en un campo vacío, porque sería el mismo tablero rojo de antes, pero hablado.

**Cuarta pieza: el foco se lleva al primer campo con error.** Es lo que el navegador hacía con su burbuja, y al apagarla hay que hacerlo a mano. Quien navega con teclado cae justo donde debe corregir, y quien usa lector de pantalla oye de inmediato el nombre, el error y el estado. Es también la ayuda más grande para el criterio de operar todo con teclado ([2.1.1](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html), nivel A).

¿Cómo se apaga la burbuja sin apagar la validación? Con el evento **`invalid`**. Cada vez que el navegador comprueba un campo y lo encuentra inválido, dispara `invalid` sobre él ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event)), y si tu código llama a `preventDefault()`, el navegador no muestra su burbuja. Dos cuidados: el evento **no sube por el árbol** (no burbujea), así que un oyente puesto en el `<form>` solo lo recibe si lo registras en la fase de captura (el tercer argumento `true`); se comprobó con un oyente normal en el formulario y no recibió nada. Y como cancelaste el evento, el navegador tampoco mueve el foco: lo haces tú.

Predice qué hará esta página con el campo vacío y con `dorian` (sin arroba):

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

Al cargarla muestra solo el formulario:

```text
Un campo, un error que se lee
Correo *
Pedir aviso
```

Presiona el botón con el campo vacío: aparece «Escribe tu correo.», el campo se pone rojo y el foco cae en él. Escribe `dorian` y, mientras tecleas, el mensaje se actualiza a «Falta algo: un correo se ve así, nombre@dominio.mx.»; cuando el valor se vuelve válido, el mensaje y la marca desaparecen. Observa tres decisiones del código. El mensaje depende de la bandera (`valueMissing` o `typeMismatch`), no del texto del navegador, y por eso está en tu idioma y con tu voz. La actualización mientras escribe solo ocurre si el campo ya estaba marcado, para no regañar a quien todavía no termina. Y el mensaje dice **qué hacer**, no solo qué está mal: [3.3.3, Sugerencia ante errores](https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html), cuando se conoce la sugerencia.

### Los avisos de estado: `role="status"` y `role="alert"`

Falta una pieza: los mensajes que no pertenecen a un campo. «Servicio agregado», «hay 3 campos con error», «mostrando 2 de 5 servicios». Quien ve la pantalla los ve; quien usa un lector de pantalla necesita que se anuncien **sin mover el foco**. Eso es lo que pide el criterio [4.1.3, Mensajes de estado](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) (nivel AA). Se resuelve con una *región viva*: un elemento cuyo contenido, cuando cambia, el lector lee sin que nadie lo visite.

Hay dos, y la diferencia es la urgencia. Con **`role="status"`** ([MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/status_role)) el aviso es cortés: el lector espera a que termine de leer lo que estaba leyendo. Con **`role="alert"`** ([MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/alert_role)) interrumpe. MDN pide usar el segundo con cuidado, porque interrumpir es una molestia reservada para lo que no puede esperar (un fallo de conexión, no «5 resultados»). En el panel, `#notice` (cargando o vacío), `#count` y `#form-result` son `status`, y `#error-notice` (el servicio no pudo cargar) es `alert`.

Y la regla que más se rompe, que MDN pone en primer lugar: **el contenedor tiene que existir en la página antes de que cambie su contenido**. Si creas el párrafo con su texto al mismo tiempo, muchos lectores no lo anuncian, porque lo que observan es un *cambio* dentro de una región ya conocida. Por eso los tres elementos están en el HTML, vacíos, desde el principio, y por eso la hoja de estilos nunca los apaga con `display: none` mientras están vacíos: eso los sacaría del árbol de accesibilidad, como se midió en la lección 9.

Un límite que se dice de frente: lo que se pudo comprobar al preparar esta lección es el estado que el navegador entrega a la tecnología de asistencia (el árbol de accesibilidad con las descripciones y el estado `invalid`, y que las regiones vivas cambian de texto en el momento correcto). Lo que no se hizo es oír la salida de un lector de pantalla real. Cuando termines la lección, haz esa prueba tú con el lector que traiga tu sistema; es la única que cuenta.

### 10.5 En el panel: agregar y filtrar

Ahora todo junto. El panel gana dos cosas: que el buscador y los radios de la lección 2 filtren la tabla, y el formulario para agregar un servicio. Empecemos por las decisiones, antes del código.

**Los controles ya estaban.** El campo «Buscar servicio» y el grupo «Mostrar», con sus radios Todos, Disponibles y Caídos, están en la página desde la lección 2, con sus etiquetas y su `<fieldset>`. No hace falta inventar un buscador: solo escucharlos. Es la ganancia de haber escrito el HTML por lo que significa desde el principio.

**El filtro es una función pura.** `filterServices(services, filter)` recibe el arreglo y las condiciones, y devuelve el arreglo filtrado, sin tocar la página. Es el mismo estilo de `js/stats.js`, y por eso se puede probar sin pantalla, como hiciste con el estado en la lección 7. Normaliza el texto antes de comparar (quita acentos y mayúsculas) para que `catalo` encuentre `Catálogo`: `normalize("NFD")` ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)) separa cada letra de su acento, y una expresión regular borra las marcas.

**El estado crece un campo.** `state.filter` guarda el texto y el estado elegido; `visible(state)` filtra primero y ordena después. No se filtra tocando filas del DOM: se filtra *dibujando otra vez desde los datos*, como aprendiste en la lección 7.

**El conteo se anuncia con retraso.** La tabla se actualiza con cada tecla, pero el aviso «Mostrando 3 de 5 servicios.» espera 400 ms desde la última tecla. Sin esa espera, un lector de pantalla anunciaría «Mostrando 4… Mostrando 3… Mostrando 1…» letra por letra, y lo que debía ayudar estorba. Es un `setTimeout` ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout)) que se cancela y se vuelve a armar en cada tecla.

**El formulario aprovecha lo que ya hay.** Los atributos hacen la validación; el programa solo cambia el lugar donde se muestra el mensaje. El nombre debe ser único: es una regla que el navegador no conoce, así que va con `setCustomValidity` y su limpieza. El tiempo de respuesta se desactiva si el servicio está caído. Cada campo reserva siempre la línea de su mensaje (`min-height`), para que la página no salte cuando alguien se equivoca; en la lección 11 verás que esos saltos se miden.

**El formulario sirve también con la lista vacía.** Con `?case=empty` el panel dice «No hay servicios que revisar.» y no hay tabla. Ahí el formulario sigue visible: es la forma de dar de alta el primero. Y también está «Reintentar», que la lección 9 muestra con la lista vacía porque «Revisar ahora» vive en la zona de datos, oculta en ese caso. Por eso la zona del formulario depende de la fase (`"ready"`) y no de que haya filas.

**Después de agregar, se avisa y se vuelve al primer campo.** El mensaje dice cuántos servicios hay ahora y, si el filtro actual oculta el nuevo, lo dice también: sin eso, quien filtra por «Caídos» y agrega uno disponible vería que «no pasó nada».

Los archivos nuevos son `js/filters.js` y `js/form.js` (este traduce las banderas de `validity` a frases y lee el formulario). Cambian `js/state.js`, `js/view.js`, `js/main.js`, `index.html` y `css/styles.css`. Quedan como los dejó la lección 9: `js/load.js`, `js/stats.js`, `data/services.json` y `data/services-empty.json`.

Lo vas a construir en **siete pasos**, de las piezas puras a las que tocan la página. Cada paso tiene la misma forma: primero **qué hace el archivo y por qué**, después **su código**, y al final **cómo compruebas** que quedó bien antes de pasar al siguiente. El orden no es caprichoso: hasta el paso 6 el panel sigue funcionando exactamente como en la lección 9, porque cada pieza nueva se agrega sin que nadie la use todavía, y así cualquier error que aparezca es del último paso que diste. Solo el paso 7 conecta todo. Las comprobaciones con la consola usan `await import("./js/archivo.js")`, que carga un módulo desde la consola de las herramientas del navegador con el panel abierto y te deja llamar a sus funciones a mano.

#### Paso 1 — `js/filters.js`: qué servicios pasan el filtro

**Qué hace y por qué.** Decide qué servicios cumplen el texto buscado y el estado elegido. Es el archivo más corto de la lección y el que más conviene entender, porque no sabe nada de la página: recibe un arreglo y devuelve otro. Tiene dos funciones. `normalize(text)` deja un texto listo para comparar: `normalize("NFD")` separa cada letra de su acento (la «á» se vuelve «a» más una marca de acento), y luego `.replace(/\p{Diacritic}/gu, "")` borra las marcas. Esa `/\p{Diacritic}/gu` es una expresión regular como las del paréntesis de 10.1: `\p{Diacritic}` significa «cualquier carácter que Unicode clasifica como marca diacrítica», es decir, los acentos y la diéresis; la bandera `g` hace que se borren todas y no solo la primera, y la `u` es la que permite escribir `\p{…}`. Después, `toLowerCase()` pasa todo a minúsculas y `trim()` quita los espacios de los extremos. La segunda función, `filterServices`, usa el `filter` de la lección 6 con una condición doble: el nombre normalizado **incluye** (`includes`) el texto buscado, y el estado es el elegido o se eligió «Todos».

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

**Cómo lo compruebas.** Con el panel abierto (todavía se ve igual que en la lección 9), escribe en la consola `const f = await import("./js/filters.js")` y después `f.normalize("  CATÁLOGO ")`. Debe responder `"catalogo"`: sin acento, sin mayúsculas y sin espacios. Así se comprobó en Chrome 154.

#### Paso 2 — `js/state.js`: el estado aprende a filtrar

**Qué hace y por qué.** Es el estado de la lección 9 con un campo más y tres funciones nuevas. Lo nuevo es `filter`, `changeFilter`, `nameExists`, `addService` y que `visible` filtre antes de ordenar. Tres herramientas de JavaScript aparecen aquí por primera vez. [`Object.assign(destino, cambios)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) copia en `destino` cada propiedad de `cambios` y deja intactas las demás: si `state.filter` es `{ text: "cat", status: "all" }` y llega `{ status: "down" }`, el resultado es `{ text: "cat", status: "down" }`. Por eso `changeFilter` puede recibir solo lo que cambió, venga del buscador o de los radios. `some`, de la lección 6, responde si **al menos un** servicio cumple la condición, que es justo la pregunta «¿ya existe ese nombre?». Y `push` agrega un elemento al final de un arreglo; aquí sí se cambia el arreglo, porque agregar un servicio es precisamente cambiar la lista.

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

**Cómo lo compruebas.** Recarga el panel: debe verse **igual que en la lección 9**, con cinco filas y el resumen en 5, 4 de 5, 1 y 465 ms. Parece que no pasó nada, y eso es lo que se busca: el filtro arranca en «Todos» y con el texto vacío, así que deja pasar a todos, y nadie lo cambia todavía. Si ves algo distinto, el error está en este archivo. La comprobación de fondo es el paso 3.

#### Paso 3 — La prueba sin pantalla

**Qué hace y por qué.** Antes de tocar la página, una prueba que no necesita pantalla, como la de la lección 7. Predice cuántas líneas dirán `ok`:

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

Ábrela en `…/10-formularios-validacion/panel/filters-test.html` y compara con lo que predijiste:

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

Fíjate en la comprobación de la combinación: con «o» solo pasarían cuatro (también Inventario) y con «available» solo, otros cuatro (también Búsqueda); los tres que salen prueban que se aplican las dos condiciones a la vez. Una prueba cuyo resultado sería el mismo con una sola condición no probaría la combinación.

#### Paso 4 — `index.html`: los controles que faltaban

**Qué hace y por qué.** Respecto de la lección 9 cambian pocas cosas: el `<fieldset>` de los radios gana un `id` para escucharlo; aparecen el aviso del conteo, `#count`, y un `id` en la caja de la tabla, `#table-zone`, para ocultarla cuando ningún servicio pasa el filtro; la sección de servicios gana la clase `layout-tall`, que se explica con los estilos; y al final de `<main>` llega la sección nueva, «Agregar un servicio». Fíjate en la relación de cada campo con su ayuda y su error por `aria-describedby`, en los elementos con `role="status"` (que existen vacíos desde el principio), y en que la zona del formulario empieza oculta:

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

**Cómo lo compruebas.** Recarga: el panel sigue mostrando lo mismo, y el formulario nuevo **no aparece**. Es correcto: la sección empieza con `hidden`, y la vista de la lección 9 no sabe que existe, así que nadie la muestra. En la consola, `document.querySelector("#add-zone").hidden` debe devolver `true`.

#### Paso 5 — `css/styles.css`: el formulario y su acomodo

**Qué hace y por qué.** Un bloque más al final de `css/styles.css`, que reabre otra vez la capa `components`. Tres cosas merecen mirarse. La primera es la regla de `.layout-tall`: en una pantalla ancha, la rejilla de dos columnas de la lección 5 pondría la sección nueva en el renglón siguiente, debajo de la tabla, con un hueco enorme junto a ella; si la sección de servicios ocupa dos renglones (`grid-row: span 2`), el formulario sube a la columna izquierda, justo debajo del resumen. La segunda es el selector de error, `.field :user-invalid, .field [aria-invalid="true"]`: lleva `.field` delante porque, sin él, pesaría menos que `.field input`, la regla que da el borde a todos los campos, y perdería. Es la especificidad de la lección 3 haciendo su trabajo, y la salida es escribir el selector que corresponde, no un `!important`. La tercera es la línea reservada para el error. Y algo que no está: ninguna regla para que la tabla quepa a 320 px. No hace falta, porque la tabla se desplaza dentro de su caja desde la lección 5; la medición a 320 px da 320 en los siete pasos del recorrido con que cierra el paso 7.

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

**Cómo lo compruebas.** Con la ventana a más de 1024 px de ancho (64em), escribe en la consola `getComputedStyle(document.querySelector("#services")).gridRowStart`. Debe responder `"span 2"`; en una ventana más angosta, `"auto"`, porque la regla vive dentro del `@media`.

#### Paso 6 — `js/form.js`: de banderas a frases

**Qué hace y por qué.** Traduce las banderas de `validity` a frases. Cada campo tiene su tabla de mensajes. La búsqueda recorre las banderas en el orden en que están escritas (por eso, con `-5`, sale «No puede ser negativo.» y no el mensaje de la cuadrícula), y si no hay frase propia usa el texto del navegador como último recurso. `readService` arma el servicio desde el formulario con las mismas claves de `data/services.json`, y le da un `id` nuevo con [`crypto.randomUUID()`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID), que genera un identificador que no se repite: el `id` de la lección 6 es lo que identifica a un servicio, y uno que nace en el formulario también necesita el suyo. (Esa función solo existe en páginas seguras: servidas por `https`, o desde tu propia máquina, como `127.0.0.1`.) Dos piezas de escritura que ya conoces: el ciclo `for (const flag in forControl)` recorre los nombres de las propiedades de la tabla de mensajes, como el `for…in` de la figura 10.2, y `MESSAGES[control.id] ?? {}` usa la coalescencia nula de la lección 6 para que un campo sin tabla propia reciba un objeto vacío en lugar de `undefined`.

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

**Cómo lo compruebas.** Ahora que el HTML del paso 4 ya tiene los campos, escribe en la consola `const form = await import("./js/form.js")` y después `form.errorMessage(document.querySelector("#new-name"))`. Debe responder `"Escribe el nombre del servicio."`: el campo está vacío, es `required`, y la función tradujo la bandera `valueMissing` a la frase de su tabla. Que la sección esté oculta no cambia nada, porque `hidden` no saca a un campo de la validación; `disabled`, sí.

#### Paso 7 — `js/view.js` y `js/main.js`, juntos

**Qué hace y por qué.** Es el paso que conecta todo, y por eso son dos archivos que van juntos. En la vista, `renderCount` es nueva y se exporta aparte para que `main.js` pueda retrasarla; `render` también decide cuándo se ve la zona del formulario y cuándo la tabla (sin filas, se oculta).

Y `js/main.js` crece con dos bloques al final, los filtros y el formulario. Antes de leerlo, estas son las decisiones que vas a encontrar en él, cada una con su razón:

- El oyente de los radios está en el `<fieldset>` y no en cada radio: el evento `change` sube por el árbol, como el `click` de la lección 7, así que uno solo atiende a los tres.
- En el oyente de `invalid`, la condición `event.target === form.querySelector(":invalid")` es verdadera solo para el primer campo inválido en el orden del documento. Por eso el foco y el aviso general ocurren una vez, aunque el navegador dispare el evento tres veces.
- En el oyente de `input`, la primera línea vacía el aviso del formulario: si una persona corrige y sigue escribiendo, «No se agregó: hay 3 campos con error» ya no es verdad y no debe quedarse.
- En el oyente de `focusout`, la condición mira `:user-invalid` o la marca propia. Es el momento de mostrar el error de un campo que la persona edita y abandona. Usa `focusout` y no `blur` porque `focusout` sí sube por el árbol ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/focusout_event)), y un solo oyente en el formulario atiende a los tres campos.
- En el de `submit`, `FormData` ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/FormData)) lee el formulario por el atributo `name` de cada campo, y los campos desactivados no entran. Por eso un servicio caído no trae `responseMs` y `readService` guarda `null`, que es lo que ya entienden `js/stats.js` y la tabla.

Un aviso sobre el orden: **no recargues entre los dos archivos**. La vista nueva espera elementos (`addZone`, `tableZone`, `count`) que solo el `main.js` nuevo le entrega. Si guardas `view.js`, recargas y todavía tienes el `main.js` de la lección 9, la tabla se queda vacía y la consola de Chrome dice `Cannot set properties of undefined (setting 'hidden')`: la vista intentó ocultar una zona que nadie le pasó. Se comprobó así al preparar la lección; si te pasa, no es un error de tu vista: falta el archivo siguiente.

Primero la vista:

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

Después la lógica. Lee `js/main.js` de arriba abajo: primero lo que ya tenías (carga, orden, selección) y después los filtros y el formulario, con un comentario que explica el porqué de cada bloque:

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

**Cómo lo compruebas.** Prueba ahora el panel, con el servidor encendido desde la carpeta `programas/` del repositorio, en `http://127.0.0.1:8000/10-formularios-validacion/panel/`. Estos pasos se comprobaron en Chrome 154 con la ventana a 320 px de ancho:

1. Escribe `catalo` en «Buscar servicio»: queda una fila y, medio segundo después, el aviso dice «Mostrando 1 de 5 servicios.».
2. Marca «Caídos» en el grupo «Mostrar» sin borrar el texto: ninguna fila coincide, la tabla se oculta y el aviso dice «Ningún servicio coincide con el filtro.». Borra el texto y queda solo `Inventario`.
3. Vuelve a marcar «Todos» y presiona «Agregar servicio» con todo vacío: el foco cae en «Nombre», aparecen tres mensajes rojos y el aviso dice «No se agregó: hay 3 campos con error.».
4. Escribe `catalogo`, elige «Disponible» y escribe `100`: al presionar «Agregar servicio», el nombre dice «Ya existe un servicio con ese nombre.» (ni las mayúsculas ni el acento importan).
5. Cambia el nombre a `facturas` y el tiempo a `-5`: el mensaje dice «No puede ser negativo.». Corrígelo a `230`: el mensaje desaparece al teclear y, al enviar, el aviso dice «Servicio «facturas» agregado. Ahora hay 6.». El resumen pasa a 6 servicios revisados, 5 de 6 disponibles, 1 caído y 418 ms de respuesta promedio.
6. Elige «Caído» como estado: el campo del tiempo se desactiva y se vacía. Escribe un nombre nuevo y envía: el servicio se agrega sin tiempo, y en la tabla aparece «sin respuesta».
7. Abre `?case=empty`: aparecen «No hay servicios que revisar.», «Reintentar» y el formulario. Agrega un servicio: la tabla aparece con una fila y «Reintentar» se oculta, porque «Revisar ahora» vuelve a estar a la vista.

La consola, durante todo el recorrido, queda en blanco.
## El error que vas a ver

El mensaje es de la consola y aparece cuando envías un formulario en el que hay un campo obligatorio que la persona no puede ver. La página lo provoca a propósito: el segundo campo es `required` pero está oculto con `display: none`.

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

Ábrela, escribe un correo válido y presiona «Enviar». No pasa nada visible: el formulario no se envía y no hay burbuja. En la consola aparece:

```text
An invalid form control with name='note' is not focusable.
```

El navegador intentó hacer lo de siempre: encontrar el primer campo inválido y enviar el foco hacia él para mostrar el mensaje. Pero un campo oculto no puede recibir foco, así que no hay dónde mostrarlo, y el envío se queda bloqueado sin que la persona sepa por qué. El texto del mensaje es del navegador (Chrome 154; en otro navegador la frase cambia) y en su forma `name='note'` lleva el atributo `name` del campo culpable, lo cual te dice cuál buscar.

Hay tres arreglos, en orden de preferencia. Si el campo no se necesita, quita el `required` mientras esté oculto. Si hace falta que exista pero no se vea, desactívalo con `disabled` (queda fuera de la validación, como viste con el tiempo del panel). Y si debe verse en cuanto se activa, muéstralo antes de intentar enviar. Lo que no se arregla es silenciar el mensaje: es el síntoma de que alguien dejó una trampa en el formulario.

## Lo que se hace mal

**Tratar la validación del cliente como protección.** *Cómo se ve:* «el formulario ya valida el correo, así que ya está». *Costo:* cualquiera la salta con dos clics en las herramientas del navegador o enviando la petición sin navegador. Si tu panel tiene un servidor, la regla se repite allí; si no lo tiene, el dato no debe ser peligroso por sí mismo, y por eso el panel lo dibuja con `textContent`.

**Pintar `:invalid` desde el inicio.** *Cómo se ve:* el formulario se abre en rojo. *Costo:* quien llega se siente regañado antes de empezar, y quien usa un lector de pantalla oye una lista de errores en campos que ni ha visto. Usa `:user-invalid` o la marca propia después del primer intento.

**Poner un mensaje en `setCustomValidity` y no limpiarlo.** *Cómo se ve:* un campo que «se ve bien» y no deja enviar. *Costo:* es el error más difícil de depurar de la lección, porque no hay ningún mensaje de error del programa. Cada rama que pone un mensaje necesita su rama que lo quita; el panel lo hace en una línea con un condicional.

**Un `pattern` con sintaxis inválida.** *Cómo se ve:* `pattern="[\w-]+"` y la regla no se aplica nunca. *Costo:* la consola de Chrome dice «Pattern attribute value [\w-]+ is not a valid regular expression», pero el formulario no muestra nada, de modo que la regla desaparece en silencio. Escapa el guion (`[\w\-]+`) y, sobre todo, prueba con un valor que debería fallar.

**El error solo en color, solo en la burbuja o solo en el `placeholder`.** *Cómo se ve:* un campo con borde rojo y nada más, o una pista dentro del campo en gris claro que desaparece al teclear. *Costo:* pierde a quien no distingue colores, a quien usa un lector de pantalla y a quien necesita releer. La etiqueta es una etiqueta (`<label>`), el error es texto, y las dos viven fuera del campo.

**Un `type="number"` para lo que no es una cantidad.** *Cómo se ve:* un campo de folio, de teléfono o de código postal con flechas de subir y bajar. *Costo:* se cambia el valor con la rueda del mouse sin querer, se pierden los ceros a la izquierda, y el lector de pantalla anuncia un botón para subir y bajar (`spinbutton`) donde no hay ninguna cantidad que subir ni bajar. Para esos datos, texto con `inputmode="numeric"`.

**Anunciar cada tecla.** *Cómo se ve:* el aviso del filtro cambia con cada letra. *Costo:* el lector de pantalla se vuelve una metralleta y quien lo usa se pierde. Espera a que la persona termine de escribir, como hace el panel con sus 400 ms.

**Desactivar el botón de enviar hasta que todo sea válido.** *Cómo se ve:* un botón gris sin explicación. *Costo:* quien no ve el botón desactivado no sabe por qué no avanza, y no hay ningún mensaje que lo explique. Deja el botón activo y explica qué falta en el momento del intento.

## Ejercicios

### Ejercicio 1 — Predecir las banderas

Sin abrir nada, escribe qué banderas de `validity` se encienden en cada caso, y comprueba después con `fig10_02.html`: (a) campo vacío con `required`; (b) `250` en un campo con `min="0" max="60000" step="100"`; (c) `-100` en ese mismo campo; (d) `60050` en ese mismo campo.

### Ejercicio 2 — Una regla propia en el panel

Agrega al formulario del panel una segunda regla para el nombre: no puede ser `admin` ni `test` (sin importar mayúsculas). Debe usar `setCustomValidity`, limpiar el mensaje cuando el nombre sea correcto y mostrar un texto propio que diga qué hacer, no solo qué está mal. Comprueba que el campo vuelve a ser válido al corregirlo.

### Ejercicio 3 — Limpiar los filtros

Agrega un botón «Limpiar filtros» a la barra de controles. Al presionarlo debe: vaciar el texto, volver a marcar «Todos», redibujar la tabla y devolver el foco al campo de búsqueda. Piensa qué ocurre con la región `role="status"` si el texto del conteo no cambia.

## Soluciones

**Ejercicio 1.** (a) `valueMissing`. (b) `stepMismatch`: 250 está dentro del rango pero no es múltiplo de 100 contando desde 0. (c) `rangeUnderflow`; además, `-100` sí es múltiplo de 100, así que `stepMismatch` **no** se enciende. (d) `rangeOverflow` y `stepMismatch`, porque 60050 también cae fuera de la cuadrícula. Si fallaste en (c), la lección está en que `step` y `min` no son independientes: la cuadrícula se mide desde `min`, y un valor puede estar fuera de rango sin estar fuera de la cuadrícula.

**Ejercicio 2.** Cambia `validateUniqueName` en `js/main.js` para que decida entre tres casos y limpie en el último:

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

La rama final es la que evita que el campo quede inválido para siempre. Como `errorMessage` ya lee `validationMessage` cuando hay `customError`, no hay que tocar nada más. Comprueba el caso en que escribes `admin`, envías (aparece el mensaje) y luego corriges a `admin2`: el mensaje desaparece al teclear.

**Ejercicio 3.** En `index.html`, dentro de la barra de controles, junto a «Revisar ahora», un `<p><button type="button" id="clear-filters">Limpiar filtros</button></p>`. En `js/main.js`:

```js
document.querySelector("#clear-filters").addEventListener("click", () => {
  changeFilter(state, { text: "", status: "all" });
  document.querySelector("#search").value = "";
  document.querySelector('input[name="filter"][value="all"]').checked = true;
  render(state, elements);
  document.querySelector("#search").focus();
});
```

El conteo se vuelve a dibujar solo, porque `render()` llama a `renderCount()`. Pero hay una trampa: si el texto del aviso ya era «Mostrando 5 de 5 servicios.», el contenido no cambia y los lectores de pantalla suelen no repetirlo. Es un buen caso de que *no anunciar* es correcto: no hay nada nuevo que decir (una región viva anuncia cambios, no repeticiones). Si quisieras anunciar la acción misma, escribe «Filtros limpiados.» en el aviso del formulario o en una región propia.

## Cómo sé que lo logré

Las comprobaciones son medibles. Enciende el servidor desde la carpeta `programas/` del repositorio descargado y abre el panel:

```bash
cd programas
python3 -m http.server 8000 --bind 127.0.0.1
```

Abre `http://127.0.0.1:8000/10-formularios-validacion/panel/`.

- [ ] **Teclado:** con solo Tab, Shift+Tab, Enter y las flechas llegas a la búsqueda, a los radios, a «Revisar ahora», al botón de ordenar, a los botones «Ver detalle», a los tres campos y al botón de agregar; se ve el contorno de foco en cada uno; y agregas un servicio sin tocar el mouse.
- [ ] **Consola:** en la pestaña Consola no hay ningún error ni aviso después de recargar y de recorrer los siete pasos del recorrido con que cierra la sección 10.5.
- [ ] **320 px:** en el modo de dispositivo de las herramientas, a 320 px de ancho no aparece barra de desplazamiento horizontal. En la consola, `document.documentElement.scrollWidth <= document.documentElement.clientWidth` devuelve `true`.
- [ ] **Los errores se leen:** con el formulario vacío, tras presionar «Agregar servicio», `document.querySelector("#new-name").getAttribute("aria-invalid")` devuelve `"true"` y `document.querySelector("#new-name-error").textContent` devuelve una frase.
- [ ] **El filtro:** con el texto `catalo`, `document.querySelectorAll("#services-body tr").length` devuelve `1`.
- [ ] **El campo desactivado queda fuera:** con «Caído» elegido, `document.querySelector("#new-response-ms").disabled` devuelve `true`.
- [ ] **Sin pantalla:** `filters-test.html` muestra once líneas y todas empiezan con `ok`.
- [ ] **Lector de pantalla:** activa el que traiga tu sistema (en Linux Mint, Orca) y repite el paso 3 de la sección 10.5. Debe decir el nombre del campo, su descripción y que no es válido.
- [ ] **Las figuras:** `fig10_05.html` deja en la consola el mensaje de «An invalid form control… is not focusable», y las demás no dejan ningún error.

Y como cierre, **tres preguntas de lecciones anteriores**; respóndelas sin mirar y después comprueba:

1. En la lección 2: ¿qué elemento de HTML da nombre a un campo, y por qué un `placeholder` no lo sustituye?
2. En la lección 7: ¿por qué `js/view.js` usa `textContent` y no `innerHTML` aunque los datos vengan de tu propio servidor?
3. En la lección 8: ¿qué devuelve `fetch` ante un 404, y qué hay que revisar para no tratarlo como datos?

Anota en la bitácora lo que no pudiste responder. Esa lista es tu repaso de mañana.

## Para leer más

- [Validación de formularios en el cliente, en MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation): la guía completa, con la API de validación y los ejemplos de mensajes propios.
- [3.3.1 Identificación de errores, en las pautas WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html): qué exige el criterio y qué técnicas lo cumplen.
- [`:user-invalid`, en MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/:user-invalid): cuándo coincide y cuándo no.
- [Campos de texto, en el sistema de diseño del gobierno británico](https://design-system.service.gov.uk/components/text-input/): la guía más cuidadosa sobre `type="number"`, `inputmode`, `autocomplete` y `maxlength`.
