# Lección 9 — Cuando algo falla: tiempos límite, estados, CORS y varias peticiones

**Tiempo:** 2 × 45 min

**Qué construyes:** el panel que dice siempre qué está pasando: cargando, error o vacío, con un tiempo límite para no esperar sin fin

**Qué aprendes:** tiempo límite con `AbortSignal.timeout`; distinguir las fallas por su nombre; los tres estados: cargando, error y vacío; el error de CORS; varias peticiones a la vez con `Promise.allSettled`

## Al terminar vas a poder

- Ponerle a cada petición un tiempo límite y distinguir en el código un tiempo agotado de una falla de conexión y de una respuesta que no es JSON.
- Traducir cada falla técnica a una frase que la persona que usa el panel pueda entender.
- Mostrar en el panel las tres situaciones que no son «todo salió bien»: cargando, error y vacío, cada una con su aviso y su forma de anunciarse a un lector de pantalla.
- Explicar por qué «vacío» no es un error y por qué no se guarda como una fase más, sino que se deduce.
- Reconocer en la consola el error de CORS, explicar quién lo produce y quién lo arregla.
- Pedir varias cosas a la vez sin que una falla se lleve el resultado de las demás, con `Promise.allSettled`.

## El porqué antes del cómo

**Punto de partida.** Esta lección parte del panel tal como lo dejó la lección 8. Tu panel ya pide sus datos a `data/services.json`, y la estructura que quedó es esta:

- `index.html`, con el `<tbody>` y los cuatro `<dd>` del resumen vacíos, la hora en `#checked-at`, el botón `#check-now` («Revisar ahora»), el botón «Ordenar por tiempo de respuesta» y la región del detalle (`#detail`).
- `css/styles.css`, la hoja de las lecciones 3, 4, 5 y 7.
- `data/services.json`, con los cinco servicios.
- `js/load.js`, que pide los datos en dos pasos, revisa `response.ok` y la forma de lo que llegó, y lanza un error si algo no cuadra.
- `js/stats.js`, con `summarize` y las dos cuentas de la lección 6.
- `js/state.js`, con la lista, la hora de llegada, el orden y la selección, y `loadSucceeded` para guardar lo que llegó.
- `js/view.js`, que dibuja el estado y la hora, siempre con `textContent`.
- `js/main.js`, que pide los datos al arrancar y con «Revisar ahora», y deja en la consola cualquier falla.

Y un archivo nuevo para hoy, `data/services-empty.json`, el pariente de la lista para el caso vacío:

```json
[]
```

Una lista sin elementos, que es JSON válido: el servidor la entregará con un 200, y será el panel quien decida qué significa.

**Qué le falta hoy al panel.** El panel de la lección 8 funciona cuando todo sale bien, y **detecta** las fallas, pero no las cuenta: las deja en la consola, que nadie fuera de quien programa abre. Un reporte real vive en un mundo donde pasan cosas que a un módulo local nunca le pasan:

1. **Tarda.** Entre que la página aparece y que llegan los datos hay un intervalo, que puede ser de milisegundos o de segundos. ¿Qué ve la persona mientras tanto? Una tabla vacía parece un panel roto.
2. **Falla.** El servidor puede estar apagado, el archivo puede haberse movido, la conexión puede cortarse. ¿Qué ve la persona entonces? Hoy, nada: la página parece congelada.
3. **Llega vacío.** El servidor responde bien, pero la lista no tiene ningún servicio. No es una falla, pero tampoco es una tabla. ¿Qué ve la persona?
4. **No contesta.** El servidor recibe la petición y nunca responde. La promesa de `fetch` se queda pendiente para siempre, sin cumplirse ni rechazarse, y ni siquiera hay un error que atrapar.

Un panel terminado muestra **las tres** primeras situaciones como pantallas distintas, y convierte la cuarta en un error con un límite de tiempo. Es el cuarto de los cinco criterios con que sabes que terminaste el curso: *muestra los tres estados, cargando, error y vacío*. Esta lección te lo deja cumplido.

**Por qué importa tanto.** La mayoría de los tutoriales enseñan el camino feliz y se detienen ahí, porque es lo que se ve bien en una demostración. Pero quien usa un panel de servicios lo abre justo cuando sospecha que algo anda mal. Si en ese momento la página se queda en blanco, o dice «no hay servicios» porque la red falló, la persona toma una mala decisión: espera cuando debía actuar, o se tranquiliza cuando debía preocuparse. Un panel que miente en sus fallas es peor que no tener panel. Por eso esta lección es, para quien usa el `revisor`, la más importante del curso.

**Qué ruta sigue.** Primero el **tiempo límite**, para que una petición no espere para siempre, y el módulo `js/load.js` en su versión completa, que distingue cada falla por su nombre y la traduce a una frase. Segundo **los tres estados** en pantalla, que es la parte que la gente ve y casi nadie enseña. Tercero, **varias peticiones a la vez**, que el `revisor` necesitará cuando revise muchos servicios. Y al final, el error que tarde o temprano encuentra cualquiera que pide datos a otro lugar: **CORS**.

**Lo que necesitas encendido.** Solo el servidor local de siempre (y, para la última figura, un segundo servidor que encenderás ahí mismo). Las páginas de esta lección están en [`programas/09-cuando-algo-falla/`](https://github.com/HabilMX/curso-web/tree/main/programas/09-cuando-algo-falla) del [repositorio del curso](https://github.com/HabilMX/curso-web); con el repositorio descargado en tu computadora, enciende el servidor desde su carpeta `programas/`:

```bash
cd programas
python3 -m http.server 8000 --bind 127.0.0.1
```

Abre `http://127.0.0.1:8000/09-cuando-algo-falla/panel/`. Como en la lección 8, `fetch` y los módulos no funcionan con `file://`. Nada más hace falta: ni Node ni paquetes.

## Los conceptos

Son tres. Como en las lecciones anteriores: antes de ejecutar cada figura, **escribe en la bitácora qué crees que va a pasar**.

### 9.1 No esperar para siempre: el tiempo límite

**El problema.** Recuerda la tabla de 8.1: la promesa de `fetch` se cumple cuando llega una respuesta y se rechaza cuando no hay conexión. Pero hay una tercera manera de que una petición salga mal, y es la más cruel porque no produce ningún error: **no pasa nada**. El servidor no contesta, la red está colgada, y la promesa se queda pendiente, sin cumplirse ni rechazarse. Un panel sin tiempo límite se queda con «Cargando…» para siempre; la persona no sabe si esperar, recargar o rendirse. La solución es decidir cuánto se está dispuesto a esperar y cortar ahí.

El mecanismo es una **señal de cancelación**. `fetch` acepta en sus opciones una `signal`, y si esa señal se «activa» antes de que termine la petición, `fetch` la aborta y su promesa se rechaza. Para el caso del tiempo límite hay una pieza lista: `AbortSignal.timeout(milisegundos)` crea una señal que se activa sola cuando pasa ese tiempo, y el error con que se rechaza se llama `TimeoutError` ([MDN: `AbortSignal.timeout`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static)). Se usa así: `fetch(url, { signal: AbortSignal.timeout(3000) })`. El segundo argumento de `fetch` es un objeto de opciones, como los que conociste en la lección 6; `signal` es una de sus claves.

Es una función relativamente reciente: está disponible en los navegadores principales desde abril de 2024, y MDN la etiqueta «Baseline 2024». Cumple los treinta meses que separan «recién disponible» de «ampliamente disponible» justo por estas fechas, así que si en tu navegador no aparece, actualízalo. Antes de ella se escribía a mano con `AbortController` y un `setTimeout`; ya no hace falta.

Para ver el error hace falta un servidor que de verdad tarde, y el de `python3 -m http.server` contesta en un par de milisegundos. Por eso esta lección trae uno propio, `slow-server.py`: sirve la carpeta igual que el de siempre, pero si la dirección lleva `?delay=3000`, espera esos tres mil milisegundos antes de contestar. No necesita instalar nada; usa solo la biblioteca que trae Python. Apaga el servidor de siempre (Ctrl+C) y, desde la carpeta `programas/`, enciende este en su lugar, en la misma puerta:

```bash
python3 09-cuando-algo-falla/slow-server.py
```

Sirve las mismas páginas en `http://127.0.0.1:8000/`, así que todo lo demás funciona igual. Este es su código; no tienes que escribirlo, pero vale la pena leerlo, porque es corto y ya conoces casi todo lo que hace:

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

Lo importante está en `do_GET`, la función que atiende cada petición: lee el número que viene después de `delay=`, se duerme ese tiempo con `time.sleep` (que cuenta en segundos, por eso se divide entre mil), y después contesta como el servidor de siempre. Las otras dos piezas: `ThreadingHTTPServer` atiende cada petición por separado, para que una petición dormida no detenga a las demás; y el `except` final calla el aviso que Python daría cuando el navegador, cansado de esperar, cuelga antes de recibir la respuesta, que es justo lo que se quiere provocar. El resto (`?delay` se ignora si no es un número, y nunca se esperan más de diez segundos) es para que nadie lo use por error para colgar tu computadora.

La figura 9.1 pide los datos con `?delay=3000` y un límite de **un segundo**. El servidor tarda tres; el límite gana siempre, porque la diferencia no es de milisegundos sino de dos segundos completos. Al preparar esta lección dio `TimeoutError` en 10 de 10 cargas en Chrome 154, siempre a un segundo de empezar. Y la prueba de control, también en 10 de 10: servida con el `python3 -m http.server` de siempre, que no entiende `?delay` y contesta enseguida, la misma página dice «alcanzó a responder: el límite no se cumplió». Si ves esa frase, no es un error de tu código: es que tienes encendido el servidor que no tarda.

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

El mensaje, `signal timed out`, es el texto de Chrome; Firefox escribe otro, pero el **nombre** del error es el mismo en todos los navegadores porque lo fija la especificación. Por eso el código pregunta siempre por el nombre y nunca por el mensaje. El nombre del error es `TimeoutError`. Es la manera de distinguir en el código un «no respondió a tiempo» de un «no hay conexión» (`TypeError`). Hay otro nombre parecido, `AbortError`, que aparece cuando alguien cancela a propósito con un `AbortController`; no lo usas hoy.

Dos precisiones técnicas que cuestan caro si no las sabes. La primera: **el límite sigue corriendo mientras se lee el cuerpo.** Si el servidor manda las cabeceras de inmediato pero se queda a medias con el contenido, la promesa de `fetch` se cumple, y es `response.json()` la que se rechaza con `TimeoutError` al llegar al límite. Es la precisión que la última fila de la tabla de 8.1 dejaba pendiente: el tiempo agotado rechaza la promesa de `fetch` solo si ocurre **antes** de que lleguen las cabeceras; después, la promesa ya se cumplió y no puede «des-cumplirse», así que lo que se rechaza es la lectura del cuerpo. En una prueba con un servidor que enviaba el principio de un arreglo y esperaba cuatro segundos para el resto, con un límite de un segundo las cabeceras llegaron a los 2 ms y la lectura del cuerpo se rechazó con `TimeoutError` a los 1005. Por eso el código del panel revisa `TimeoutError` en **los dos** pasos. La segunda: el segundo de la figura es para la demostración. En el panel, el límite son tres segundos, que es lo suficiente para una conexión mala y lo bastante corto para que la persona no se desespere.

**El módulo que pide los datos, completo.** En la lección 8, `js/load.js` dejaba pasar los errores tal como venían: el `TypeError` de una red caída, el `SyntaxError` de un JSON roto. Servía para quien programa, que los lee en la consola, pero no para quien usa el panel, que necesita una frase que entienda. Ahora el módulo **traduce**: atrapa cada falla, mira su nombre y lanza en su lugar un error con un mensaje para personas. Sigue con su regla de siempre: **no toca el documento**. Quien decide cómo mostrarlo es la vista.

Antes del código, dos detalles de escritura que aparecen en él por primera vez. El primero: en `loadServices(url, timeoutMs = 3000)`, el `= 3000` es un **valor por omisión** del parámetro; si quien llama no pasa el segundo argumento, `timeoutMs` vale 3000. El segundo: `let response;` y `let data;` declaran las variables **sin valor** fuera de cada `try`, y dentro del `try` se les asigna, el mismo truco que `main.js` usó en la lección 8 con `services`: una variable declarada dentro de un bloque `{ … }` solo existe dentro de ese bloque.

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

Lee el código con estas preguntas:

- **¿Por qué hay dos `try`?** Porque son dos pasos con dos clases de falla distintas. El primero atrapa lo que ocurre antes de tener respuesta: no hay conexión, o se agotó el tiempo. El segundo, lo que ocurre al leer el cuerpo, y ahí hay tres casos que no se deben confundir. Según [MDN sobre `Response.json()`](https://developer.mozilla.org/en-US/docs/Web/API/Response/json), la lectura puede rechazarse con `SyntaxError` (el texto no es JSON), con un error de aborto (aquí, el `TimeoutError` del límite) o con `TypeError`. El `TypeError` no dice una sola cosa: puede ser que la conexión se cortó a medias o que el cuerpo no se pudo decodificar (MDN da el ejemplo de un encabezado `Content-Encoding` equivocado). Desde el código no se distingue cuál de las dos fue, así que el mensaje dice solo lo que es seguro: «No se pudo leer completa la respuesta del servidor.». Por eso el segundo `catch` pregunta por el nombre: solo un `SyntaxError` merece la frase «no es JSON válido»; decirla ante una conexión cortada mandaría a la persona a buscar un error en el archivo que no existe.
- **¿Por qué los mensajes son nuestros y no el `error.message` del navegador?** Porque el mensaje del navegador está escrito para programadores, en inglés, y cambia entre Chrome y Firefox («Failed to fetch», «NetworkError when attempting to fetch resource»). Quien usa el panel necesita una frase que entienda. El detalle técnico, para quien depura, ya está en la consola.
- **¿Qué cambió respecto de la lección 8?** Los dos `try`, el tiempo límite y la traducción de los mensajes. La revisión de `ok`, la de `Array.isArray` y la de `isService` son las mismas. Recuerda por qué está la última: un archivo con `[null]` es JSON perfectamente válido y es un arreglo; sin `isService`, ese `null` llegaba hasta `summarize`, que intentaba leer `service.status` de `null`, y el programa se detenía con un `TypeError` *fuera* de cualquier `try`: el panel se quedaba sin aviso, sin tabla y sin explicación. Con la comprobación, ese caso termina en el aviso rojo «Algún servicio de la lista llegó incompleto o con datos de otro tipo.», que es lo que se comprobó en Chrome al preparar la lección.

### 9.2 Los tres estados: cargando, error y vacío

**Qué es una fase.** El panel de la lección 8 tenía un estado con la lista, la hora, el orden y la selección. Ahora necesita saber algo más: **en qué momento de la carga está**. Se agrega un campo, `phase`, con tres valores posibles:

- `"loading"`: se pidió y todavía no hay resultado.
- `"error"`: se pidió y falló; en `errorMessage` queda el texto para la persona.
- `"ready"`: llegó una lista.

Y ahora la decisión de diseño más fina de la lección. Quedaba una cuarta situación, **«vacío»**: la lista llegó bien, pero no tiene ningún servicio. ¿Es una cuarta fase? No: es una **consecuencia**. No hay que guardarla, se *deduce* de lo que ya está guardado: `phase === "ready"` y `services.length === 0`. Guardar dos hechos que se pueden deducir el uno del otro es la receta para que algún día se contradigan. La función `situation` hace la deducción en un solo lugar, devuelve `"empty"` en ese caso, y toda la pantalla le pregunta a ella.

Un recordatorio de escritura antes del código: `select` usa el **operador ternario**, `condición ? valorSiSí : valorSiNo`, que la lección 6 presentó en «Decidir, repetir y avisar de un error». Es un `if` que *devuelve un valor* y por eso cabe dentro de una asignación: `state.selected === id ? null : id` vale `null` si el servicio ya estaba elegido y `id` si no.

Respecto de la lección 8 cambian tres cosas: `createState` gana dos campos, `phase` (que empieza en `"loading"`) y `errorMessage`; `loadSucceeded` además pasa la fase a `"ready"`; y aparecen tres funciones, `startLoading`, `loadFailed` y `situation`. Lo demás se queda igual.

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

**Dos cosas que conviene distinguir.** La primera: un error y un vacío se parecen desde lejos y son opuestos. Un error es «no pude averiguar»; un vacío es «averigüé y no hay nada». Al primero se le ofrece **reintentar**, porque puede que la próxima vez funcione. Al segundo también se le deja volver a preguntar, porque una lista vacía hoy puede tener servicios dentro de un minuto; pero sin el aviso rojo, porque no es una falla. Un panel que dice «error» cuando la lista está vacía miente, y uno que dice «no hay servicios» cuando falló la red miente peor, porque la persona concluye que todo está bien.

La segunda: las transiciones son pocas y están todas escritas. El panel arranca en `"loading"`; de ahí pasa a `"ready"` o a `"error"`; y vuelve a `"loading"` solo por una acción de la persona: «Reintentar», desde un error o desde una lista vacía, o «Revisar ahora», con los datos a la vista. No hay otro camino. Tener tan pocas hace que el código sea fácil de razonar.

**Dibujar las tres situaciones, y anunciarlas.** La vista ya sabía dibujar la tabla y la hora. Lo nuevo está en `render`, que primero pregunta `situation(state)` y muestra una u otra pantalla, y en una función pequeña que sale de ella: `renderSummary`, que es lo que en la lección 8 vivía dentro de `render`. Fíjate cómo se organiza `render`: al principio decide qué avisos y qué zonas se ven, después el resumen, y solo si la situación es `"ready"` sigue con la tabla.

Dos piezas de escritura que conviene reconocer antes de leerlo. La primera es una cadena de ternarios: `a ? x : b ? y : z` se lee «si `a`, `x`; si no, si `b`, `y`; si no, `z`», y así el aviso elige entre tres textos en una sola expresión. La segunda es [`Object.hasOwn(objeto, clave)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn), que devuelve `true` solo si el objeto tiene esa clave **escrita en él mismo**. Hace falta porque todo objeto de JavaScript hereda propiedades que nadie escribió, como `constructor` o `toString`: `LABELS["toString"]` no es `undefined`, es una función. Con `Object.hasOwn(LABELS, status)`, un estado que no sea `available` ni `down` se reconoce como desconocido, aunque se llame `toString`. Y un `for (const cell of [...])` recorre una lista escrita ahí mismo, como cualquier `for…of` de la lección 6.

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

Dos decisiones de este archivo. La primera, el resumen: mientras carga o cuando falla, sus cuatro cifras quedan vacías, porque no hay nada que contar; pero en el caso vacío dice 0, 0 de 0, 0 y «sin datos», porque cero servicios **es** un resultado, y el resumen tiene que decir lo mismo que el aviso. La segunda, como siempre: todo entra con `textContent`, incluido el mensaje de error, que también es un texto que no escribiste en ese momento. La hora la sigue escribiendo `renderCheckedAt`, la de la lección 8: si una revisión falla, el encabezado conserva la hora de la última que salió bien, que es justo lo que la persona necesita saber. Y una tercera, sobre «Reintentar»: se muestra con un error **y** con una lista vacía. «Revisar ahora» vive dentro de `#data-zone`, que en esos dos casos está oculta; sin «Reintentar», después de un vacío no quedaría ningún botón para volver a preguntar, y la persona tendría que recargar la página. Por la misma razón, al terminar una carga `main.js` devuelve el foco a «Revisar ahora» solo si la tabla quedó a la vista, y a «Reintentar» en los otros dos casos.

Lo que hay detrás del HTML importa tanto como el JavaScript, porque aquí vive la accesibilidad de los estados. Es el `index.html` de la lección 8 con un cambio: la sección de servicios gana los avisos, el botón «Reintentar» y una zona, `#data-zone`, que envuelve todo lo que solo tiene sentido con datos: la barra de controles, la tabla y el detalle.

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

- **Dos regiones de aviso, presentes desde el principio.** `#notice` tiene `role="status"` y `#error-notice` tiene `role="alert"`. Son **regiones vivas**: cuando cambia su texto, un lector de pantalla lo anuncia. `status` lo hace con cortesía, esperando a que termine lo que estaba diciendo; `alert` interrumpe, y se reserva para lo que la persona necesita saber ya. Por eso «Cargando» y «No hay servicios» van en la primera y las fallas en la segunda. La regla técnica es que las regiones deben **existir antes de que su contenido cambie**; si se crean con el mensaje ya dentro, muchos lectores no lo anuncian.
- **`Cargando servicios…` ya está en el HTML.** Antes de que corra el primer byte de JavaScript, la persona ve que algo está pasando. Cuando `main.js` arranca, vuelve a escribir el mismo texto, que no produce ningún cambio visible.
- **`hidden` para lo que no corresponde.** La zona de los datos y el botón «Reintentar» se ocultan con el atributo `hidden`, que los saca de la vista **y** del árbol de accesibilidad. Así un lector de pantalla no recorre una tabla vacía.
- **«Reintentar» es un botón real**, y su oyente se registra una sola vez.

La hoja gana dos bloques al final de `css/styles.css`. El primero reabre la capa `reset` para una sola regla: lo que lleva el atributo `hidden` no se ve, diga lo que diga cualquier otra regla. Es el único `!important` de la hoja, y va en la primera capa a propósito: entre declaraciones con `!important`, el orden de las capas se invierte —la misma inversión que la lección 3 contó para los orígenes—, así que en la primera capa gana a todas. No es un parche para vencer a otra regla; es una garantía: lo oculto se queda oculto. El segundo bloque da forma a los avisos, y tiene una trampa que conviene ver despacio. Un aviso vacío no debería dibujar un recuadro sin texto, así que hay que «apagarlo» mientras está vacío. La salida obvia, `display: none`, es justo la equivocada: un elemento con `display: none` sale también del árbol de accesibilidad, y entonces la región viva deja de existir para el lector de pantalla hasta que recibe texto, que es exactamente lo que la regla anterior prohíbe. Se midió en Chrome 154: con `display: none`, `#notice` y `#error-notice` vacíos no aparecían en el árbol de accesibilidad; con la regla de abajo, que solo les quita el margen, el relleno y el borde, aparecen como `status` y `alert` y miden 0 px de alto. Se ven igual (nada) y siguen vigiladas.

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

El aviso de error usa los colores de la insignia «Caído», que la lección 3 ya midió: 7.08 a 1 de contraste.

El último pedazo es `js/main.js`, que pide los datos y guarda el resultado en el estado. Tres herramientas aparecen en él por primera vez, y conviene saber qué hacen antes de leerlo:

- **`location.search`** es la parte de la dirección de la página que va desde el signo `?`: en `…/panel/?case=empty` vale `"?case=empty"`. [`new URLSearchParams(texto)`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) la parte en pares nombre–valor, y `.get("case")` devuelve el valor de `case`, o `null` si la dirección no lo trae.
- **`document.activeElement`** es el elemento que tiene el foco en este momento: el botón que acabas de presionar con el teclado, el campo donde escribes, o el `<body>` si nada lo tiene.
- **`?.`**, el encadenamiento opcional de la lección 6: `document.activeElement?.dataset?.id` lee el `id` del botón enfocado si lo hay, y da `undefined` en lugar de detenerse con un error si alguno de los pasos no existe. (La función `update` que lo usa es la de la lección 7, sin cambios.)

Con eso, el archivo:

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

Dos cosas de este archivo merecen explicarse. La primera es `load()`, que cambió respecto de la lección 8: ahora pasa a `"loading"`, dibuja, intenta, y en cualquiera de los dos desenlaces guarda en el estado y vuelve a dibujar. Ya no hay `console.error`: la falla tiene su lugar en la pantalla. El `try`/`catch` sigue **solo alrededor de la petición**, no del dibujado, por la misma razón de la lección 8: si el dibujado tuviera un error de programación, no queremos que lo disfrace de «no se pudo conectar»; queremos verlo en la consola. Y una lección de la 7 que vuelve: el botón que pidió la carga, «Revisar ahora» o «Reintentar», queda oculto mientras se carga, y un elemento oculto pierde el foco, que cae en el `<body>`. Por eso `load()` anota al principio si el foco estaba en uno de esos dos botones y, al terminar, se lo devuelve al que corresponda: «Reintentar» si volvió a fallar, «Revisar ahora» si llegaron los datos. Sin esas líneas, quien usa el teclado tendría que recorrer la página desde arriba después de cada revisión.

La segunda es la tabla `CASES`. Para que puedas ver cada situación sin romper nada, el panel acepta en la dirección `?case=empty`, `?case=error`, `?case=invalid` o `?case=timeout`. Fíjate en que el texto de la dirección **no se usa como dirección de la petición**: solo elige una opción entre cinco que escribimos nosotros. Si el panel hiciera `fetch(params.get("url"))`, cualquiera podría mandarte un enlace que haga que *tu* panel pida y dibuje lo que él quiera. `Object.hasOwn` evita que `?case=constructor` encuentre un valor heredado.

**Ver los tres estados.** Con el servidor encendido, abre `…/09-cuando-algo-falla/panel/` y recorre este recorrido; son tus pruebas de la lección:

| Dirección | Lo que debes ver |
|---|---|
| `panel/` | La tabla, el resumen en 5, 4 de 5, 1 y 465 ms, y en el encabezado la fecha y la hora en que llegaron los datos |
| `panel/?case=empty` | «No hay servicios que revisar.», sin tabla, con el botón «Reintentar» para volver a preguntar; el resumen en cero |
| `panel/?case=error` | «El servidor respondió con el código 404.», con el botón «Reintentar» |
| `panel/?case=invalid` | «La respuesta no es JSON válido.» (pide `index.html`, que no es JSON) |
| `panel/?case=timeout` | con `slow-server.py`: «Cargando servicios…» durante tres segundos y después «El servidor no respondió en 3000 ms.», con «Reintentar». Con el servidor de siempre, la tabla normal: no hay quién tarde |

Para el estado **«cargando»**, que en tu máquina dura milisegundos, hay dos maneras de verlo. La más sencilla es `?case=timeout` con `slow-server.py` encendido: el aviso se queda tres segundos antes de cambiar al error. La otra, que sirve con cualquier servidor, son las herramientas del navegador: abre la pestaña **Red**, elige un perfil de velocidad lento (en Chrome, «3G»; en Firefox, «GPRS»; los nombres de los perfiles cambian entre versiones), y recarga; y con la opción «Sin conexión», presiona «Reintentar» tras un error y verás «No se pudo conectar con el servidor.». Ver cada estado con tus propios ojos es la parte que más se aprende; no te la saltes.

**La prueba que cierra la sección.** Con `?case=error`, navega solo con el teclado hasta «Reintentar», presiona Enter y observa que el aviso no desaparece (sigue fallando, porque el archivo sigue sin existir) y que el foco sigue en «Reintentar». Haz lo mismo con «Revisar ahora» en el panel normal: la hora del encabezado cambia y el foco se queda en el botón. Y una medición que no se salta: con la ventana a 320 px, en los cinco casos, `document.documentElement.scrollWidth <= document.documentElement.clientWidth` debe devolver `true`; lo comprobé y devuelve `true` en los cinco, gracias a la caja que se desplaza de la lección 5 y a la regla `position: relative` de la lección 7. Con un lector de pantalla encendido (en Linux Mint, Orca suele activarse con `Super+Alt+S`), el aviso rojo debe anunciarse sin que muevas el foco.

### 9.3 Varias peticiones a la vez

**El problema.** El `revisor` de verdad va a revisar muchos servicios, y cada uno puede responder, tardar o fallar por su cuenta. Cuando las peticiones no dependen una de otra, no se espera la una para lanzar la siguiente: se lanzan todas y se espera el conjunto. Pedirlas una tras otra, con un `await` dentro de un ciclo, hace que la revisión tarde la **suma** de todas; lanzarlas juntas hace que tarde lo que tarde **la más lenta**.

**Las dos formas de esperar un conjunto.** `Promise.all(lista)` recibe una lista de promesas y devuelve una sola, que se cumple cuando se cumplen todas. Pero **se rechaza en cuanto una falla**, y descarta el resultado de las demás, lo contrario de lo que quieres en un reporte donde un servicio caído es parte del resultado, no un motivo para tirar los otros. Para eso existe `Promise.allSettled`, que espera a todas y devuelve para cada una un objeto que dice si se cumplió (`status: "fulfilled"`, con su `value`) o se rechazó (`status: "rejected"`, con su `reason`). Es «Baseline» desde julio de 2020 ([MDN: `allSettled`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)).

Antes de la figura, una pieza de escritura: `urls.map(request)` aplica la función `request` a cada dirección y devuelve un arreglo con lo que devuelve cada llamada. Como `request` es `async`, cada llamada devuelve una promesa: el resultado es **un arreglo de promesas**, todas ya en camino, que es justo lo que `allSettled` espera recibir. Y en el `map` final, el segundo parámetro, `i`, es la posición de cada resultado, que sirve para recuperar la dirección que le corresponde: `allSettled` devuelve los resultados **en el mismo orden** en que recibió las promesas, sin importar cuál terminó primero. La figura 9.2 pide tres archivos, uno de ellos inexistente:

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

El archivo que falta no se llevó a los otros dos: cada uno trae su propio desenlace. El panel de hoy lee un solo archivo y no la usa; la guardas para cuando el `revisor` pida a cada servicio su propio estado, y entonces cada fila de la tabla podrá tener su propio «falló» sin que el resto del panel se entere.

## El error que vas a ver

**El error de CORS.** Es el primero que se encuentra cualquiera que pida datos a otro lugar. El panel pide un archivo de **su propio** servidor, y por eso no lo ve; para provocarlo, la figura 9.3 pide el mismo archivo a *otro* servidor.

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

Levanta un segundo servidor desde la carpeta del panel, en otra terminal y también dentro del repositorio descargado:

```bash
cd programas/09-cuando-algo-falla/panel
python3 -m http.server 8001 --bind 127.0.0.1
```

Con el primer servidor (el del puerto 8000) aún encendido, abre `http://127.0.0.1:8000/09-cuando-algo-falla/fig09_03.html`. La página dice:

```text
esta página vive en: http://127.0.0.1:8000
voy a pedir a:        http://127.0.0.1:8001
fetch falló: TypeError: Failed to fetch
```

(«Failed to fetch» es el mensaje de Chrome; el nombre, `TypeError`, es el mismo en todos los navegadores.) Y la consola de Chrome muestra, en rojo:

```text
Access to fetch at 'http://127.0.0.1:8001/data/services.json' from origin 'http://127.0.0.1:8000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

(En Firefox la consola dice otra cosa —empieza con «Cross-Origin Request Blocked»— y el mensaje del error es «NetworkError when attempting to fetch resource.», pero el error que recibe tu código sigue llamándose `TypeError`, como dice la [especificación de Fetch](https://fetch.spec.whatwg.org/#fetch-method) y la tabla de 8.1: la página imprimiría `TypeError: NetworkError when attempting to fetch resource.`. Es el mismo problema.)

Para entenderlo hace falta una definición. El **origen** de una página es la combinación de tres cosas: el esquema (`http`), el servidor (`127.0.0.1`) y el puerto (`8000`). Dos direcciones con un puerto distinto son orígenes distintos aunque sea la misma máquina, y eso es lo que pasa aquí. La **política del mismo origen** del navegador dice que una página puede leer libremente lo que viene de su origen, y no lo que viene de otro, salvo que ese otro lo permita ([MDN: política del mismo origen](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Same-origin_policy)). La forma de permitirlo se llama **CORS** (*cross-origin resource sharing*, compartir recursos entre orígenes): el servidor dueño de los datos añade a su respuesta la cabecera `Access-Control-Allow-Origin`, con el origen al que le da permiso ([MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)).

Tres ideas que corrigen los malentendidos más comunes:

1. **La petición sí salió.** Si abres la pestaña Red verás la solicitud y su respuesta (esta, incluso, con un 200). Lo que el navegador **bloquea es que tu código lea esa respuesta**. CORS no protege al servidor, que ya recibió la petición: protege a quien usa el navegador, de que una página ajena lea cosas suyas sin permiso.
2. **Se arregla en el servidor, no en tu código.** No hay nada que escribir en el panel para saltarse el bloqueo. Quien controla el servidor debe agregar la cabecera. Si el servidor no es tuyo, se le pide al dueño; o el panel y los datos se sirven desde el mismo origen, como hace este curso.
3. **Hay «soluciones» que no lo son.** La extensión que «desactiva CORS», el servicio público que reenvía las peticiones, o la opción `mode: "no-cors"` de `fetch` (que da una respuesta «opaca» que el código no puede leer) hacen que el error desaparezca de la consola sin resolver nada: o dejan tu navegador desprotegido, o mandan los datos de quienes usan tu panel a un tercero. El `mode: "no-cors"` es la peor, porque parece que funciona.

Y una consecuencia para el panel: si algún día el `revisor` pidiera sus datos a otro origen sin permiso, la persona vería «No se pudo conectar con el servidor.», porque desde el código un bloqueo por CORS es indistinguible de una red caída. La frase es cierta desde donde la ve la persona: el panel no pudo obtener los datos. La causa exacta está en la consola, para quien depura.

Cierra el segundo servidor con `Ctrl+C` al terminar.

## Lo que se hace mal

- **Una petición sin tiempo límite.** Un servidor que no contesta deja la página en «Cargando…» sin fin, que es peor que un error porque no dice qué hacer. `AbortSignal.timeout` cuesta una línea.
- **Preguntar por el mensaje en lugar del nombre.** `error.message` cambia entre navegadores y versiones; `error.name` (`TimeoutError`, `TypeError`, `SyntaxError`) lo fija la especificación. El código decide por el nombre.
- **Un panel que solo sabe el caso feliz.** Si la tabla es lo único que el código sabe dibujar, un fallo se ve como una página en blanco. Los tres estados no son un adorno: son parte del producto.
- **Tratar el vacío como error, o el error como vacío.** Se les ofrecen cosas distintas a la persona, y confundirlos hace que decida mal.
- **Crear la región viva con el mensaje ya dentro, u ocultarla con `display: none`.** En los dos casos el lector de pantalla no anuncia nada. La región existe desde el principio, vacía, y solo cambia su texto.
- **Mostrar con `innerHTML` el mensaje de error o los datos que llegaron.** Lo que viene de fuera es un dato de fuera, aunque venga de tu propio servidor, porque mañana ese servidor puede ser otro. El principio de la lección 7 sigue vigente sin cambios.
- **Usar `await` dentro de un ciclo para peticiones independientes.** `for (const url of urls) { await fetch(url) }` hace una petición, espera, hace la siguiente, espera: tarda la suma de todas. Se lanzan todas a la vez y se espera el conjunto con `Promise.allSettled`.
- **Usar la dirección del navegador como dirección de la petición.** Una dirección que viene de la barra del navegador es un dato de fuera. Se elige entre opciones que tú escribiste, como hace la tabla `CASES`.
- **«Arreglar» CORS desde la página.** Ni `mode: "no-cors"` ni una extensión lo resuelven; lo arregla el servidor que da los datos.

## Ejercicios

### Ejercicio 1 — Los cinco casos y quién los produce

Abre el panel con cada uno de los cinco casos de la tabla de 9.2 y con la opción «Sin conexión» de la pestaña Red. En tu bitácora, para cada uno, escribe el mensaje que apareció y la **línea de `js/load.js`** que lo produjo. Después responde: ¿cuáles de los seis casos nunca muestran un código de estado en la pestaña Red, y por qué?

### Ejercicio 2 — Cuánto tardó la revisión

Haz que, cuando los datos llegan bien, el panel muestre debajo del detalle «La revisión tardó 12 ms.», con los milisegundos que pasaron entre pedir los datos y tenerlos. `performance.now()` da el momento actual en milisegundos, con decimales; la diferencia entre dos llamadas es lo que pasó entre ellas. Decide dónde se **mide**, dónde se **guarda** y dónde se **escribe**, y comprueba que si das clic en «Ordenar» la cifra no cambia, y que si das clic en «Revisar ahora», sí.

### Ejercicio 3 — Cuántas listas llegaron

Copia la figura 9.2 como `count.html` en la misma carpeta y cámbiala para que, debajo de las tres líneas, escriba una cuarta con el resumen: «Llegaron 2 de 3.». Usa `filter` sobre el resultado de `allSettled`, sin volver a pedir nada. Después agrega a la lista de direcciones `"panel/data/otro-que-no-existe.json"` y comprueba que el resumen pasa a «Llegaron 2 de 4.» sin que cambies nada más.

## Soluciones

### Solución 1

Los mensajes y de dónde salen, en `js/load.js`:

| Caso | Mensaje | Línea que lo produce |
|---|---|---|
| normal | (ninguno: la tabla) | `return data;` |
| `?case=empty` | «No hay servicios que revisar.» | no es de `js/load.js`: lo decide `situation` en `js/state.js` |
| `?case=error` | «El servidor respondió con el código 404.» | el `throw` dentro de `if (!response.ok)` |
| `?case=invalid` | «La respuesta no es JSON válido.» | el `throw` de la rama `SyntaxError` del segundo `catch` |
| `?case=timeout` (con `slow-server.py`) | «El servidor no respondió en 3000 ms.» | el `throw` del primer `catch`, rama `TimeoutError` |
| Sin conexión | «No se pudo conectar con el servidor.» | el `throw` final del primer `catch` |

Muestran código de estado en la pestaña Red los cuatro casos en que el servidor sí contestó: normal (200), vacío (200), error (404) e inválido (200, tipo `text/html`). Los que **nunca** lo tienen son «timeout» (la petición queda pendiente tres segundos y se aborta sin haber recibido respuesta) y «Sin conexión» (no hubo con quién hablar). La tabla de 8.1 marca **tres** situaciones como «se rechaza»: sin conexión, bloqueo por CORS y tiempo agotado. Estos dos casos son dos de ellas; la tercera, CORS, no aparece en el panel porque pide a su propio origen, y la viste aparte con la figura 9.3. En los demás casos, la promesa se cumplió y el panel tuvo que revisar `ok` o el contenido por su cuenta.

### Solución 2

Son tres trabajos y van en tres archivos. **Medir** es un efecto —consulta el reloj alrededor de la petición—, así que va en `js/main.js`, junto a la llamada a `loadServices`. **Guardar** la cifra es estado: es un hecho que el panel recuerda hasta la siguiente carga. Y **escribirla** es dibujado. En `js/state.js`, un campo más y un parámetro más:

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

En `js/main.js`, dentro de `load()`, se mide antes y después de la petición:

```js
  const start = performance.now();
  try {
    const services = await loadServices(current.url, current.timeoutMs);
    loadSucceeded(state, services, new Date(), Math.round(performance.now() - start));
  } catch (error) {
    loadFailed(state, error.message);
  }
```

En `index.html`, `<p id="duration"></p>` debajo de `#detail`, dentro de `#data-zone`; en `js/main.js`, `duration: document.querySelector("#duration"),` en el objeto `elements`; y en `js/view.js`, al final de `render`:

```js
  elements.duration.textContent = `La revisión tardó ${state.durationMs} ms.`;
```

«Ordenar» no cambia la cifra porque solo cambia `sortByTime`: la cifra se guarda únicamente al llegar datos. «Revisar ahora» sí la cambia, porque vuelve a pasar por `loadSucceeded`. Si la hubieras calculado dentro de `render` con `performance.now()`, habrías medido otra cosa —cuánto pasó desde que se abrió la página hasta el dibujado— y cambiaría con cada clic.

### Solución 3

Después de construir las líneas, se cuentan los resultados cumplidos y se agrega la cuarta:

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

`filter` deja solo los resultados con `status` igual a `"fulfilled"`, y `.length` los cuenta. Contra `results.length`, y no contra un 3 escrito a mano, el resumen se ajusta solo cuando cambia la lista: con la cuarta dirección, Chrome 154 muestra `panel/data/otro-que-no-existe.json: falló, código 404` y `Llegaron 2 de 4.`. Es la forma de pensar del `revisor`: el número de servicios sale de los datos, nunca del código.

## Cómo sé que lo logré

- [ ] Con la carpeta `programas/` servida por `slow-server.py`, `09-cuando-algo-falla/fig09_01.html` muestra `TimeoutError`; con `python3 -m http.server`, la misma página dice «alcanzó a responder».
- [ ] `fig09_02.html` muestra dos listas que llegaron y una que falló con el código 404.
- [ ] En tu panel, el resumen dice 5, 4 de 5, 1 y 465 ms y el encabezado dice la fecha y la hora en que llegaron los datos.
- [ ] Los cuatro casos con `?case=` muestran el aviso de la tabla de 9.2 (el de `timeout`, con `slow-server.py`), y «Reintentar» aparece en los tres que son error y en el vacío, nunca junto a la tabla.
- [ ] Tras presionar «Revisar ahora» o «Reintentar» con el teclado, el foco sigue en ese botón.
- [ ] A 320 px de ancho no hay desbordamiento horizontal en ninguno de los cinco casos.
- [ ] Con `?case=timeout` y `slow-server.py`, o con un perfil de velocidad lento en la pestaña Red, se alcanza a ver «Cargando servicios…».
- [ ] Con «Sin conexión» y «Reintentar» el panel dice «No se pudo conectar con el servidor.»
- [ ] La consola solo muestra el error de red de los casos que provocaste a propósito, y ninguna excepción de tu código.

**Repaso de lecciones anteriores** (respóndelas sin mirar, y después comprueba):

1. En la lección 0: ¿qué es un origen, y qué tres partes de una dirección lo forman?
2. En la lección 7: ¿por qué hay que devolverle el foco al botón después de volver a dibujar?
3. En la lección 8: ¿por qué la promesa de `fetch` se cumple con un 404, y qué línea de `js/load.js` lo convierte en un error?

## Para leer más

- [MDN — `AbortSignal.timeout()`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static) — el tiempo límite y el `TimeoutError`, con su tabla de compatibilidad; consultado el 7 de octubre de 2026.
- [MDN — Intercambio de recursos de origen cruzado (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS) — qué es el origen y por qué lo arregla el servidor; consultado el 7 de octubre de 2026.
- [MDN — Regiones vivas de ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions) — `status`, `alert` y por qué la región debe existir antes de que cambie su texto; consultado el 7 de octubre de 2026.
- [MDN — `Promise.allSettled()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled) — esperar un conjunto de promesas sin que una falla se lleve a las demás; consultado el 7 de octubre de 2026.
