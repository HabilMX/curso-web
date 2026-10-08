# Lección 8 — Traer datos: promesas, fetch y async/await

**Tiempo:** 2 × 45 min

**Qué construyes:** el panel que pide sus datos a un archivo JSON del servidor, en lugar de traerlos escritos en el código

**Qué aprendes:** qué es una promesa; `fetch` en dos pasos; `response.ok`; `async`/`await`; un `try`/`catch` alrededor de la petición

## Al terminar vas a poder

- Explicar qué es una promesa, en qué tres momentos puede estar y por qué las operaciones lentas devuelven una en lugar de su resultado.
- Explicar por qué `fetch` necesita dos pasos (la respuesta y su cuerpo) y escribirlos primero con `.then` y después con `async`/`await`.
- Decir qué casos hacen que la promesa de `fetch` se rechace y cuáles no, y revisar `response.ok` para no dar por buena una respuesta de error.
- Cambiar el panel para que pida sus datos a `data/services.json` sin tocar las cuentas, el orden ni el dibujado.
- Reconocer el mensaje «Unexpected token '<'» y saber dónde buscar su causa.

## El porqué antes del cómo

**Punto de partida.** Esta lección parte del panel tal como lo dejó la lección 7. Tu panel dibuja la tabla y el resumen desde los datos, y la estructura que quedó es esta:

- `index.html`, con el `<tbody>` y los cuatro `<dd>` del resumen vacíos, el botón «Ordenar por tiempo de respuesta» y la región del detalle (`#detail`).
- `css/styles.css`, la hoja de las lecciones 3, 4, 5 y 7.
- `js/services.js`, que exporta el arreglo `services` y que `main.js` importa **al arrancar**.
- `js/stats.js`, con `summarize` y las dos cuentas de la lección 6.
- `js/state.js`, con el estado del panel (lista, orden, selección) y las funciones que lo cambian.
- `js/view.js`, que dibuja el estado en el documento, siempre con `textContent`.
- `js/main.js`, que escucha los eventos, cambia el estado y vuelve a dibujar.

Hoy se cambia una sola cosa de fondo: `js/services.js` desaparece, y los servicios pasan a vivir en `data/services.json`, dentro de la carpeta `data` que creaste en el Ejercicio 1 de la lección 1, un archivo que el panel **pide** al servidor. El resto del panel (las cuentas, el orden, la selección, el dibujado seguro) se queda como estaba. Que eso sea posible es la prueba de que la separación de la lección 7 valió la pena. Y dos cosas que la lección 2 dejó escritas sin funcionar se cumplen hoy: el botón «Revisar ahora», que vuelve a pedir los datos, y la «Última revisión» del encabezado, que deja de ser una hora inventada y dice cuándo llegaron los datos de verdad.

Este es el archivo: los mismos cinco servicios de la lección 6, escritos en JSON. Las claves van entre comillas dobles y el servicio caído lleva `null`, las reglas que la lección 6 describió en 6.2.2:

```json
[
  { "id": "catalog", "name": "Catálogo", "status": "available", "responseMs": 120 },
  { "id": "payments", "name": "Pagos", "status": "available", "responseMs": 480 },
  { "id": "inventory", "name": "Inventario", "status": "down", "responseMs": null },
  { "id": "notifications", "name": "Notificaciones", "status": "available", "responseMs": 310 },
  { "id": "search", "name": "Búsqueda", "status": "available", "responseMs": 950 }
]
```

**Por qué no basta con el módulo.** Mientras los datos estaban en un módulo, el panel arrancaba con ellos en la mano: el navegador no podía dibujar la tabla sin haberlos leído, porque venían en el mismo paquete que el código. Un reporte real no funciona así. Los datos los produce otro programa, en otro momento, y cambian sin que nadie toque el código del panel: un servicio que se cae a las tres de la mañana no puede esperar a que alguien edite `services.js` y vuelva a publicar. Por eso los datos viven en otro lugar, y para obtenerlos hay que hacer una petición HTTP, la misma que estudiaste en la lección 0: se envía, se espera, se recibe. Separar el código de los datos es también lo que permite que el mismo panel sirva para cualquier lista de servicios: el día que alguien quiera revisar los suyos, cambia el archivo, no el programa.

Una petición, a diferencia de un módulo, **tarda**. Y eso obliga a pensar de otra manera, porque el programa no puede quedarse congelado esperando la respuesta: la página tiene que seguir atendiendo los clics y el teclado mientras tanto. Esta lección es sobre esa espera: cómo se escribe un programa que pide algo, sigue con su vida y retoma el trabajo cuando la respuesta llega. La pieza que lo hace posible se llama **promesa**, y es la idea más importante de la lección.

Pedir algo por la red también puede **salir mal** de varias maneras: el archivo no existe, el servidor no contesta, la respuesta no es lo que esperabas. Hoy vas a aprender a **detectar** cada falla en el código, que es el primer paso y el que más se olvida. Mostrarlas en la pantalla de forma que una persona entienda qué pasó, ponerle un límite a la espera y pedir datos a otro servidor es el tema de la lección 9, que parte del panel que termines hoy. Separarlo en dos lecciones tiene una razón: primero hay que entender bien el camino que sale bien, porque cada falla es una desviación de ese camino.

**Qué ruta sigue.** Primero la **promesa** y las dos fases de `fetch`, con `.then`, que es como se escribió la web durante años y como vas a encontrar mucho código. Segundo `async` y `await`, que dicen lo mismo en forma de texto corrido, con el `try`/`catch` que ya conoces. Tercero, el panel: un módulo nuevo que pide los datos y tres archivos que cambian un poco para recibirlos.

**Lo que necesitas encendido.** Solo el servidor local de siempre. Las páginas de esta lección están en [`programas/08-traer-datos/`](https://github.com/HabilMX/curso-web/tree/main/programas/08-traer-datos) del [repositorio del curso](https://github.com/HabilMX/curso-web); con el repositorio descargado en tu computadora, enciende el servidor desde su carpeta `programas/`:

```bash
cd programas
python3 -m http.server 8000 --bind 127.0.0.1
```

Abre `http://127.0.0.1:8000/08-traer-datos/panel/`. Ten presente la advertencia de la lección 1: `fetch` y los módulos no funcionan con `file://`, porque un archivo abierto así no tiene un origen que pueda leer a otros. El [estándar de URL](https://url.spec.whatwg.org/#concept-url-origin) deja a cada navegador decidir qué origen tiene un archivo local y recomienda, en la duda, uno opaco; Chrome 154 lo hace así (en la consola de una página abierta con doble clic, `self.origin` responde `"null"`), y por eso bloquea esas lecturas. Nada más hace falta: ni Node ni paquetes.

## Los conceptos

Son tres. Como en la lección 7: antes de ejecutar cada figura, **escribe en la bitácora qué crees que va a pasar**.

### 8.1 La promesa y `fetch` en dos pasos

**Una promesa es un resultado que todavía no llega.** Cuando pides algo por la red, JavaScript no se queda esperando con los brazos cruzados: la página tiene que seguir respondiendo a los clics, a la rueda del mouse, al teclado. Por eso las operaciones lentas no devuelven su resultado, sino un objeto que lo representa: una **promesa** (*Promise*). Una promesa está en uno de tres momentos: **pendiente** (todavía no hay resultado), **cumplida** (llegó un resultado) o **rechazada** (algo falló). Una vez cumplida o rechazada, ya no cambia. La definición formal está en la [especificación de ECMAScript](https://tc39.es/ecma262/#sec-promise-objects); la explicación de MDN sobre [cómo usar promesas](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) es la lectura más clara.

Una comparación ayuda. Cuando pides comida en una ventanilla y te dan una ficha con un número, la ficha no es la comida: es la promesa de que la comida llegará. Mientras esperas puedes sentarte, platicar o revisar el teléfono; no te quedas inmóvil frente a la ventanilla. Cuando llaman tu número, la ficha se «cumple» y recoges la comida; si se acabó el platillo, la ficha se «rechaza» y te dan una explicación. Y una ficha ya cobrada no se vuelve a cobrar. Una promesa de JavaScript es esa ficha.

Con una promesa se hace lo mismo que con un evento: se le dice qué hacer cuando ocurra. El método `.then(función)` registra «cuando te cumplas, ejecuta esto con tu resultado» y el método `.catch(función)` registra «si te rechazas, ejecuta esto con el motivo». Cada `.then` devuelve a su vez otra promesa, y por eso se pueden encadenar. Hay un tercero, `.finally(función)`, que se ejecuta en los dos casos, se cumpla o se rechace; sirve para lo que hay que hacer pase lo que pase, como escribir el resultado en la página.

**`fetch` necesita dos pasos.** La función `fetch(dirección)` pide un recurso por HTTP y devuelve una promesa de una **respuesta** (`Response`). Pero esa promesa se cumple en cuanto llegan las **cabeceras** de la respuesta, no cuando llega todo el contenido. Es lo mismo que ves en la pestaña Red de las herramientas del navegador: primero llega la línea de estado (`200 OK`) y las cabeceras, y después, poco a poco, el cuerpo. Por eso hay un segundo paso: `respuesta.json()` lee el cuerpo, lo interpreta como JSON, y devuelve **otra promesa** que se cumple con el objeto resultante. Está documentado en [MDN: usar `fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).

¿Por qué separarlo así y no entregar todo de una vez? Porque con las cabeceras ya se pueden tomar decisiones antes de gastar tiempo en el cuerpo: si el código dice que el archivo no existe, no tiene caso leer y analizar una página de error como si fueran datos. Y porque el cuerpo puede ser enorme: un video o un archivo de varios megabytes llega por partes, y el programa puede decidir cómo leerlo. Para el panel, el cuerpo es pequeño, pero la regla es la misma.

**Predice:** la figura 8.1 pide `panel/data/services.json` en dos pasos y escribe tres datos de la respuesta antes de leer el cuerpo. ¿Qué crees que dirán `ok` y el tipo de contenido?

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

Detente en cada pieza, porque todas las vas a necesitar:

- **`response.status`** es el código HTTP de la lección 0: 200 es «aquí está», 404 es «no existe eso», 500 es «el servidor se rompió».
- **`response.ok`** es una comodidad: es `true` cuando el código está entre 200 y 299. Lo vas a usar a cada rato, por la razón que sigue.
- **`response.headers.get("content-type")`** dice qué tipo de contenido declaró el servidor. Aquí `application/json`: el servidor local lo deduce de la extensión `.json`.
- El **primer `.then`** termina con `return response.json()`. Ese `return` es lo que encadena los dos pasos: el segundo `.then` recibe ya el arreglo de servicios, no la promesa.

**Un 404 no es una falla para `fetch`.** Este es el punto de la lección con más consecuencias, y casi nadie lo espera. Piensa cómo debería comportarse la promesa si pides un archivo que no existe. Mucha gente supone que se rechaza, porque «algo salió mal». **Predice** qué hace la figura 8.2, que pide `missing.json`, un archivo que no existe: ¿se ejecuta el `.then` o el `.catch`?

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

La promesa **se cumplió**. Desde el punto de vista de `fetch`, el servidor contestó (dijo «no encontré eso») y la comunicación salió bien; `ok` es `false` y el `status` es 404, pero el `.catch` no se ejecutó. Si tu código hace `fetch(url).then(r => r.json())` sin mirar `ok`, un 404 o un 500 se tratan como datos buenos. Entonces falla más adelante, lejos de la causa, con un mensaje desconcertante (lo verás en «El error que vas a ver»). La regla es: **la promesa se rechaza cuando no hay una respuesta que la página pueda usar —no llegó ninguna, o llegó pero el navegador no deja leerla, como pasa con CORS—; cualquier respuesta legible, incluso un error, la cumple**.

La lista completa, para que no se te olvide. Las dos últimas filas las vas a provocar en la lección 9; están aquí porque la tabla solo es útil completa:

| Situación | La promesa de `fetch` | Cómo lo detectas |
|---|---|---|
| Llega una respuesta 200 a 299 | se cumple | `response.ok === true` |
| Llega una respuesta 404, 500 u otro código de error | **se cumple** | `response.ok === false` |
| No hay conexión, el servidor no existe o está apagado | se rechaza con `TypeError` | `catch` |
| El navegador bloquea la lectura por CORS | se rechaza con `TypeError` | `catch` |
| Se agota el tiempo límite **antes** de que lleguen las cabeceras | se rechaza con `TimeoutError` | `catch` y `error.name` |

Observa que dos filas de la tabla producen el mismo `TypeError`. No es un descuido: desde el código de la página **no se puede distinguir** una falta de conexión de un bloqueo por CORS, en parte a propósito: así una página ajena no obtiene información sobre la red de quien la visita. La explicación de qué pasó está en la consola, y la leerás en la lección 9.

### 8.2 `async`, `await` y el `try` alrededor de la petición

**El mismo programa, escrito en línea recta.** Encadenar `.then` funciona, pero un programa con tres o cuatro pasos y un manejo de errores se vuelve una escalera de funciones dentro de funciones. En 2017, JavaScript agregó una sintaxis para escribir lo mismo como si el código esperara de verdad: `async` y `await`. No es otra cosa: **es la misma promesa con otra forma**. Se aplica así:

- Una función marcada **`async`** siempre devuelve una promesa. Lo que `return`ee la función es el valor con que esa promesa se cumple, y si la función lanza un error, la promesa se rechaza.
- Dentro de ella, **`await promesa`** pausa *esa función* (no la página) hasta que la promesa se cumpla, y entrega su resultado. Si la promesa se rechaza, `await` lanza el error como una excepción, que se atrapa con el `try`/`catch` de siempre.
- Fuera de una función `async`, `await` solo se puede usar en el nivel superior de un **módulo**, que es el caso de los `<script type="module">` de las figuras de esta lección. (Es otra ventaja de los módulos.) Se documenta en [MDN: `async function`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) y [`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await).

Vuelve a la ficha de la ventanilla: `await` es decir «me espero aquí hasta que llamen mi número». La diferencia con la vida real es que quien se espera es **solo esa función**; el resto de la página sigue trabajando. Por eso `await` no congela nada: el navegador aparta la función en pausa, atiende lo demás y la retoma justo en esa línea cuando la promesa se cumple.

En la figura que sigue reaparecen tres piezas que la lección 6 presentó en «Decidir, repetir y avisar de un error»: `if (condición) { … }`, que ejecuta un bloque solo cuando la condición es verdadera; `throw new Error("texto")`, que crea un objeto de error con ese mensaje (`new` es lo que fabrica un objeto nuevo a partir de un molde, aquí `Error`) y lo **lanza**, es decir, interrumpe la función en esa línea; y `try { … } catch (error) { … }`, que intenta el primer bloque y, si algo se lanza dentro de él, salta al segundo con el error en la mano. Si alguna de las tres no te suena, vuelve a esa sección antes de seguir: aquí se usan a cada rato.

La figura 8.3 es el mismo `fetch` de la 8.1, ahora en línea recta, con la revisión de `ok` que faltaba, y probada contra el archivo bueno y contra el que no existe. **Predice** qué dirá para cada uno:

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

Compara con la figura 8.1 y fíjate en tres cambios: desaparecieron las funciones anidadas; el paso 1 y el paso 2 se ven como dos líneas con `await`; y apareció `if (!response.ok) throw new Error(...)`, que convierte una respuesta de error en un error de verdad, y así el `catch` de quien llama la trata como cualquier otra falla. **Ese `if` es la línea más importante de la lección.** Si solo vas a recordar una, que sea esta.

Lee también cómo se reparte el trabajo entre las dos funciones. `requestServices` no decide qué hacer con una falla: solo la **avisa**, lanzando un error con un mensaje claro. `tryUrl` es quien decide: atrapa el error y lo convierte en una línea de texto. Es la misma división que vas a usar en el panel: el módulo que pide los datos avisa; quien lo llama decide qué hacer.

Y un cuidado que sí produce errores reales: olvidar el `await`. `const services = requestServices(url)` sin `await` no da los servicios, da la *promesa* de los servicios; si la imprimes verás `Promise { <pending> }` y si la usas como arreglo, nada funciona. No hay un error al olvidarlo, solo un resultado absurdo.

**En qué orden pasan las cosas.** Una función `async` no se pausa al llamarla: se ejecuta normalmente, línea por línea, **hasta el primer `await`**. Ahí se aparta, y quien la llamó sigue con su siguiente línea. Cuando la promesa se cumple, la función continúa desde ese `await`. Esto explica algo que confunde mucho al principio: el código que está escrito *después* de llamar a una función `async` puede ejecutarse *antes* que el código que está escrito *dentro* de ella, después de su `await`. El Ejercicio 3 te pide predecir ese orden; hazlo con calma, porque entenderlo te ahorra horas de depuración.

### 8.3 El panel pide sus datos

Con lo anterior ya puedes cambiar el panel. Son cinco archivos, y vale la pena ver primero el plan completo, antes del código:

| Archivo | Qué cambia | Por qué |
|---|---|---|
| `js/services.js` | desaparece | los datos ahora viven en `data/services.json` |
| `js/load.js` | es nuevo | pide los datos y devuelve un arreglo, o lanza un error |
| `js/state.js` | el estado arranca sin servicios y recuerda cuándo llegaron | al abrir la página todavía no hay datos |
| `js/view.js` | escribe la hora de la «Última revisión» | la hora deja de estar escrita a mano |
| `index.html` | dos `id` nuevos | para que el código encuentre la hora y el botón «Revisar ahora» |
| `js/main.js` | pide los datos al arrancar y con «Revisar ahora» | es quien junta las piezas |

`js/stats.js` y `css/styles.css` no cambian. Que el cambio más grande del panel hasta ahora deje intactos las cuentas y el aspecto es la recompensa de haber separado las responsabilidades en la lección 7.

**Paso 1: el módulo que pide los datos.** El módulo nuevo, `js/load.js`, se escribe con una regla: **no toca el documento**. Pide los datos y devuelve un arreglo, o lanza un error con un mensaje. No sabe si hay una tabla, un aviso o una persona mirando; quien decide cómo mostrarlo es otro archivo. Es el mismo reparto de la figura 8.3: `requestServices` avisaba y `tryUrl` decidía.

Antes del código, una herramienta nueva y dos conocidas. Al final hay una función pequeña, `isService`, que usa dos herramientas de la lección 6 —`typeof`, que dice de qué tipo es un valor, y `every`, que pregunta si **todos** los elementos de un arreglo cumplen una condición— y una nueva, `Number.isFinite(valor)`, que es verdadera solo para un número de verdad (no para el texto `"120"`, ni para `NaN`, ni para `Infinity`).

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

Lee el código con estas preguntas:

- **¿Dónde están los dos pasos?** En las dos líneas con `await`: `await fetch(url)` trae la respuesta y `await response.json()` lee su cuerpo. Entre las dos está la revisión de `ok`, en el único lugar donde tiene sentido: con la respuesta en la mano y antes de gastar tiempo en el cuerpo.
- **¿Por qué no hay ningún `try` aquí?** Porque este módulo no decide nada sobre las fallas: si `fetch` se rechaza o `json()` no puede leer el cuerpo, el error sigue su camino hacia quien llamó a `loadServices`, que es quien sabe qué hacer. Un `try` que atrapa un error solo para volver a lanzarlo igual no aporta nada. En la lección 9 este archivo sí tendrá `try`, porque ahí cada falla se va a **traducir** a una frase distinta.
- **¿Qué hacen `Array.isArray` y `isService`?** Comprueban la forma de un dato de fuera antes de dejarlo pasar. `Array.isArray` mira que lo que llegó sea una lista; `data.every(isService)` mira que **cada** elemento sea un objeto con `id`, `name` y `status` de texto, y `responseMs` número o `null`. La segunda comprobación no es un adorno. Un archivo con `[null]` es JSON perfectamente válido y es un arreglo; sin ella, ese `null` llegaría hasta `summarize`, que intentaría leer `service.status` de `null`, y el programa se detendría con un `TypeError` lejos de la causa. Lo mismo con un `"responseMs": "120"` escrito entre comillas: el promedio sumaría textos. Una validación más completa —valores permitidos, rangos, claves de sobra, mensajes que digan *qué* elemento falló— es el tema de la lección 6 del [curso de TypeScript](https://www.habil.mx/es/cursos/typescript/). Y la otra defensa sigue en pie: el panel dibuja todo con `textContent` y la insignia usa una lista cerrada, así que un texto raro se ve raro, pero no ejecuta nada.

**Paso 2: el estado arranca vacío.** En la lección 7, `createState(services)` recibía los servicios, porque al arrancar ya estaban. Ahora no: al abrir la página todavía no hay ninguno, hay que pedirlos. Así que `createState()` ya no recibe nada y empieza con una lista vacía, y aparece una función, `loadSucceeded`, que guarda lo que llegó. Guarda también un campo nuevo, `checkedAt`: el **momento** en que llegaron los datos, que es lo que el encabezado va a mostrar. Ese momento lo pasa quien carga, como un objeto `Date` (`new Date()` fabrica uno con la fecha y la hora actuales). Y deselecciona el servicio elegido, porque después de una revisión nueva la lista puede ser distinta y el elegido podría ya no existir.

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

El resto del archivo es el de la lección 7 sin cambios: ordenar, elegir y calcular lo visible no dependen de dónde vinieron los datos.

**Paso 3: la vista escribe la hora.** La vista gana una función, `renderCheckedAt`, que crea un elemento `<time>`, como el que escribiste a mano en la lección 2, con el dato para las máquinas en `dateTime` (`toISOString()` lo da en el formato que pide el estándar) y el texto para las personas hecho por [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat), que en `es-MX` escribe algo como «7 de octubre de 2026 a las 12:03 p.m.». Es el mismo tipo de formateador que la lección 6 usó para los números, ahora para fechas. Si todavía no ha llegado nada, `checkedAt` es `null` y la función no hace nada: el encabezado se queda con «todavía no», porque una hora inventada, en un panel que de verdad revisa, sería una mentira. El resto de `render` es el de la lección 7, con una línea más al principio.

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

**Paso 4: el HTML gana dos nombres.** Es el `index.html` de la lección 7 con dos cambios: el encabezado deja la hora escrita a mano y lleva en su lugar `<span id="checked-at">todavía no</span>`, y «Revisar ahora» gana el `id` que la lección 2 anunció, `check-now`. Sin esos `id`, el código no tendría cómo encontrar esos dos elementos.

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

**Paso 5: `main.js` pide los datos.** Ya no importa `services.js`: importa `loadServices` y llama a una función nueva, `load`, al arrancar y cada vez que alguien presiona «Revisar ahora». Antes de leerla, un detalle de escritura que aparece por primera vez: `let services;` declara la variable **sin valor**, fuera del `try`, y dentro del `try` se le asigna. Hace falta así porque una variable declarada dentro de un bloque `{ … }` solo existe dentro de ese bloque, y `services` se necesita después, fuera de él.

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

La función `load` tiene tres partes, y el orden importa:

1. **Intenta** pedir los datos, dentro de un `try`.
2. Si falla, **avisa** en la consola con `console.error` y termina con `return`. La tabla se queda como estaba.
3. Si salió bien, **guarda** en el estado y **dibuja**.

Fíjate en que el `try` envuelve **solo la petición**, no el dibujado. Si el dibujado tuviera un error de programación, no queremos que el `catch` lo atrape y lo disfrace de «no se pudieron cargar los servicios»: queremos verlo en la consola tal cual, con su archivo y su línea. Un `try` tan grande como la función entera esconde errores que no tienen nada que ver con la red.

Y sé honesto con lo que este panel todavía no hace: si la petición falla, la persona no ve nada. La tabla se queda vacía, el resumen también, y la única pista está en la consola, que nadie fuera de quien programa abre. Mientras carga, tampoco se ve ningún aviso. Es un panel que funciona en el camino feliz y que **detecta** las fallas, pero todavía no las **cuenta**. Contarlas bien —cargando, error y vacío, cada una con su aviso y anunciada a un lector de pantalla— es el trabajo de la lección 9, y esta separación te deja ver con claridad qué agrega cada parte.

**Cómo lo compruebas.** Con el servidor encendido, abre `http://127.0.0.1:8000/08-traer-datos/panel/`. El resumen debe decir 5, 4 de 5, 1 y 465 ms, como en la lección 7, y el encabezado, la fecha y la hora de este momento. Presiona «Ordenar por tiempo de respuesta» y elige un servicio: todo funciona igual que antes, porque esas partes no cambiaron. Presiona «Revisar ahora» con el teclado: la hora del encabezado se vuelve a escribir y el foco se queda en el botón, porque el botón nunca desaparece. Así se comprobó en Chrome 154, también con la ventana a 320 px, donde la página no se desborda.

Ahora provoca una falla, para ver qué hace el panel con ella. En `js/main.js`, cambia temporalmente `"data/services.json"` por `"data/missing.json"` y recarga. La tabla y el resumen se quedan vacíos, el encabezado sigue diciendo «todavía no», y la consola de Chrome muestra dos líneas rojas: la del navegador, `Failed to load resource: the server responded with a status of 404 (File not found)`, y la tuya, `No se pudieron cargar los servicios: El servidor respondió con el código 404.`. La primera la escribe el navegador por su cuenta ante cualquier respuesta de error; la segunda es la que escribió tu `catch`. Deshaz el cambio al terminar.

## El error que vas a ver

**`Unexpected token '<'`.** Es la consecuencia de olvidar `ok` o de apuntar a una dirección equivocada que, además, no responde con un error sino con una página. La figura 8.4 pide una página HTML y la lee como si fuera JSON:

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

(La tercera línea es el mensaje de Chrome; Firefox dice algo como «JSON.parse: unexpected character at line 1 column 1», pero el nombre, `SyntaxError`, es el mismo.) Léelo con calma: el servidor respondió **200**, `ok` es `true`, y no hubo ningún problema de conexión. El fallo está en el contenido: el tipo declarado es `text/html`, y `.json()` se topó, en el primer carácter, con el `<` con que empieza la página (aquí, el del comentario `<!-- fig08_01.html -->`; en otra página sería el de `<!DOCTYPE html>`), que no puede aparecer en JSON. Entre comillas, Chrome te muestra los primeros caracteres de lo que llegó, y esa es la mejor pista: si empiezan con `<`, te llegó una página.

«Unexpected token '<'» es casi siempre la firma de «me llegó una página HTML donde esperaba JSON»: una dirección mal escrita, una página de error del servidor, o una redirección a la pantalla de inicio de sesión. Revisa en la pestaña Red qué llegó realmente: el código, el tipo de contenido y, en la vista de la respuesta, el texto. Si haces la prueba en el panel, cambiando en `main.js` la dirección por `"index.html"`, la consola dice `No se pudieron cargar los servicios: Unexpected token '<', "<!-- panel"... is not valid JSON`: el mismo error, ahora atrapado por tu `catch`. Es un mensaje para quien programa, no para quien usa el panel; en la lección 9 lo vas a traducir a una frase que cualquiera entienda.

## Lo que se hace mal

- **No revisar `response.ok`.** Es el error de la figura 8.2. Un 404 o un 500 entra al programa como si fueran datos, y el fallo real aparece lejos de la causa. La corrección es la línea `if (!response.ok) throw …`, siempre.
- **Dejar el `catch` vacío.** `catch {}` hace que cualquier falla desaparezca sin dejar rastro: el panel simplemente no muestra nada y nadie sabe por qué. Todo `catch` debe hacer algo visible: avisar a la persona, o dejar el detalle en la consola.
- **Envolver todo en un solo `try`.** Si el `try` abarca la petición *y* el dibujado, un error de programación en el dibujado se presenta como una falla de red. El `try` va alrededor de lo que puede fallar por causas de fuera, y nada más.
- **Olvidar el `await`.** El valor que obtienes es una promesa, no el resultado. Si algo muestra `[object Promise]` en pantalla, es esto.
- **Mezclar la petición con el dibujado.** Una función que hace `fetch` y a la vez construye filas no se puede probar ni reutilizar. `js/load.js` pide, `js/state.js` recuerda, `js/view.js` dibuja.
- **Mostrar con `innerHTML` los datos que llegaron.** Lo que viene de fuera es un dato de fuera, aunque venga de tu propio servidor, porque mañana ese servidor puede ser otro. El principio de la lección 7 sigue vigente sin cambios.
- **Abrir el panel con `file://`.** `fetch` no puede leer archivos locales desde una página abierta con doble clic. Si la consola habla de CORS y la dirección empieza con `file://`, la causa es esa: sirve la carpeta con `python3 -m http.server`.

## Ejercicios

### Ejercicio 1 — La figura 8.2, con `await`

Reescribe la figura 8.2 con `await` y `try`/`catch` en lugar de `.then`, `.catch` y `.finally`. La página debe mostrar exactamente las mismas tres líneas que la original. Antes de escribirla, decide qué parte del código original se convierte en el `try`, cuál en el `catch` y qué pasa con el `.finally`.

### Ejercicio 2 — Un mensaje por tipo de problema

Hoy cualquier código de error produce «El servidor respondió con el código N.» Cámbialo para que un 404 diga «No se encontró la lista de servicios.» y un código de 500 en adelante diga «El servidor tuvo un problema (código N). Intenta de nuevo en un momento.» Los demás códigos conservan el mensaje actual. Decide en qué archivo va el cambio y por qué no toca ni `js/view.js` ni `js/state.js`.

### Ejercicio 3 — ¿En qué orden?

Antes de ejecutarlo, escribe en tu bitácora en qué orden aparecerán las cinco líneas que escribe este programa. Después guárdalo como `order.html` en la carpeta `08-traer-datos/` de tu copia de `programas/`, ábrelo con el servidor encendido y compara.

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

## Soluciones

### Solución 1

El `.then` se convierte en el cuerpo del `try`, el `.catch` en el `catch`, y el `.finally` en la línea que sigue al `try`/`catch`, que se ejecuta en los dos casos porque ninguno de los dos bloques termina la función:

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

Con el resto de la página igual a la figura 8.2, Chrome muestra las mismas tres líneas: `la promesa SE CUMPLIÓ (no se rechazó)`, `estado HTTP: 404` y `ok: false`. El `await` no cambia la regla: un 404 cumple la promesa, y por eso el `catch` no se ejecuta aunque «algo salió mal».

### Solución 2

Va en `js/load.js`, porque es ahí donde se traduce un resultado técnico a una frase; `js/view.js` solo dibuja lo que recibe y `js/state.js` solo lo guarda. Se cambia el `throw` del `if (!response.ok)` y se agrega una función al final del archivo:

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

Para comprobarlo, cambia temporalmente en `js/main.js` la dirección por `"data/missing.json"`: la consola dice ahora `No se pudieron cargar los servicios: No se encontró la lista de servicios.`. El servidor estático del curso no puede producir un 500, así que esa rama se comprueba con un truco: cambia temporalmente `code === 404` por `code === 999` y `code >= 500` por `code >= 400`, recarga y debe aparecer «El servidor tuvo un problema (código 404)…». Deshaz los dos cambios al terminar. Por ahora el mensaje solo se lee en la consola; en la lección 9 aparecerá en la pantalla sin que tengas que tocar este archivo.

### Solución 3

El orden es A, 1, B, 2, C:

```text
A: antes de llamar
1: dentro de la función, antes del await
B: después de llamar, sin await
2: dentro de la función, después del await
C: llegaron 5
```

«A» va primero porque es la primera línea que se ejecuta. Al llamar a `countServices`, la función **empieza a ejecutarse de inmediato** y escribe «1»; al llegar al primer `await` se aparta y le devuelve a quien la llamó una promesa pendiente. Por eso «B» sale antes que «2»: el programa principal siguió con su siguiente línea mientras la petición viajaba. Cuando el programa principal llega a `await pending`, se aparta él también; la petición termina, la función continúa y escribe «2», su promesa se cumple con 5, y el programa principal sigue y escribe «C». Así lo muestra Chrome 154. Si predijiste A, B, 1, 2, C, pensaste que la función no empieza hasta que alguien la espera; si predijiste A, 1, 2, B, C, pensaste que `await` congela todo el programa. Los dos errores son comunes, y por eso vale la pena verlo una vez.

## Cómo sé que lo logré

- [ ] Con la carpeta `programas/` del repositorio servida en tu computadora, `08-traer-datos/fig08_01.html` muestra `ok: true` y `servicios recibidos: 5`; `fig08_02.html` muestra `ok: false` y `estado HTTP: 404` sin que se ejecute el `.catch`.
- [ ] `fig08_03.html` muestra una línea que llegó bien y una que falló con el código 404.
- [ ] En tu panel, el resumen dice 5, 4 de 5, 1 y 465 ms, el encabezado dice la fecha y la hora en que llegaron los datos, y `js/services.js` ya no existe.
- [ ] Al presionar «Revisar ahora», la hora del encabezado se vuelve a escribir y el foco se queda en el botón.
- [ ] Con la dirección cambiada a `data/missing.json`, la consola muestra tu mensaje con el código 404, y nada más se rompe.
- [ ] Ordenar y elegir un servicio funcionan igual que en la lección 7.
- [ ] Buscas `innerHTML` en tus archivos `.js` y no aparece.

**Repaso de lecciones anteriores** (respóndelas sin mirar, y después comprueba):

1. En la lección 0: ¿qué dos cosas viajan en una respuesta HTTP antes del contenido, y cuál de ellas es el código 404?
2. En la lección 6: ¿qué devuelve `averageResponseMs` cuando ningún servicio tiene medida, y por qué `null` y no cero?
3. En la lección 7: ¿por qué `js/view.js` usa `textContent` y no `innerHTML` aunque los datos vengan de tu propio servidor?

## Para leer más

- [MDN — Usar la API Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) — la referencia de `fetch`: `ok`, el cuerpo, las cabeceras y los tipos de error; consultado el 7 de octubre de 2026.
- [MDN — Cómo usar promesas](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) — `.then`, `.catch` y el encadenamiento, paso a paso; consultado el 7 de octubre de 2026.
- [MDN — `async function`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) — qué devuelve una función `async` y cómo se comporta `await` dentro de ella; consultado el 7 de octubre de 2026.
