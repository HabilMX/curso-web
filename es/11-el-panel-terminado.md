# Lección 11 — El panel terminado

**Tiempo:** dos sesiones de unos 90 min. Un reparto que funciona: la primera, «El porqué antes del cómo», el repaso con el teclado (11.1), la política de seguridad de contenido (11.2) y la medición de peso y rendimiento (11.3), con el panel abierto y las herramientas del navegador a la mano; la segunda, publicar el sitio (11.4), los cinco criterios uno por uno sobre la dirección publicada (11.5) y los ejercicios. Si publicar te lleva más de lo previsto, la sesión dos es la que se alarga: la cuenta y los pasos del servicio que elijas no dependen de ti.

**Qué construyes:** el `revisor` publicado como sitio estático, con sus encabezados de seguridad y sus números medidos

**Qué aprendes:** el repaso con el teclado; la política de seguridad de contenido (CSP) como encabezado del servidor; peso y rendimiento; publicar un sitio estático

## Al terminar vas a poder

- Recorrer el panel completo solo con el teclado, y decir qué criterio de accesibilidad incumple lo que no se alcanza, no se ve o no tiene salida.
- Escribir una política de seguridad de contenido (CSP), explicar qué bloquea cada directiva y por qué su lugar es un encabezado del servidor y no solo una etiqueta.
- Probar esa política en tu computadora con los mismos encabezados que enviará el servidor, y leer en la consola los mensajes de violación.
- Medir el peso del panel y sus métricas (LCP, CLS, INP), y decir cuál de ellas no aparece en una prueba de carga de laboratorio y por qué.
- Reservar el espacio de lo que llega tarde y precargar los módulos, y comprobar con números que ayudó.
- Publicar la carpeta como sitio estático y verificar con `curl` que los encabezados llegaron.
- Comprobar uno por uno los cinco criterios con que se cierra el curso.

## El porqué antes del cómo

Hasta ahora tu panel funciona en tu computadora, abierto por tu servidor, con tu navegador y con datos que tú escribiste. «Funciona en mi máquina» es una frase que cualquiera que haya publicado algo conoce bien, y es la distancia entre un ejercicio y un producto. Esta lección recorre esa distancia: revisa el panel como lo revisaría una persona que no es tú, lo protege con una capa más, lo mide y lo pone en internet.

El curso, además, prometió un criterio de salida. El [temario](README.md) dice que no se acaba cuando leíste la lección 11, sino cuando tu panel cumple cinco cosas. Ningún programa las revisa por ti: las compruebas tú, con las herramientas del navegador, y esta lección te dice cómo:

| # | El panel cumple… | Dónde se aprendió | Dónde se comprueba hoy |
|---|---|---|---|
| 1 | Se navega completo con el teclado | 2, 3, 4, 5 y 7 | 11.1 |
| 2 | No hay ni un error en la consola | 8, 9 y 10 | 11.2 y 11.5 |
| 3 | Funciona a 320 px de ancho sin desbordamiento horizontal | 5 | 11.1 |
| 4 | Muestra los tres estados: cargando, error y vacío | 9 | 11.5 |
| 5 | El texto que viene de fuera se dibuja con `textContent`, nunca con `innerHTML` | 7 | 11.2 y 11.5 |

La sección 11.5 cierra los cinco con una prueba para cada uno. Antes, tres ideas nuevas: la política de seguridad de contenido (11.2), medir el peso y el rendimiento antes de intentar mejorarlos (11.3) y publicar un sitio estático (11.4). La 11.1 es un repaso con el teclado, no una idea nueva.

### El estado del panel al cierre de la lección 10

Esta lección parte de un panel concreto. Al cerrar la lección 10, el `revisor` tiene todo lo de la lección 9 más lo de formularios:

- `index.html` con el encabezado (la «Última revisión» y la navegación), el resumen, y en la sección de servicios los avisos (`#notice`, `#error-notice`), el botón «Reintentar» y una zona de datos con el buscador, los radios «Mostrar», «Revisar ahora», el botón de ordenar, el aviso del conteo y la tabla; y una sección para agregar un servicio.
- `css/styles.css` con las capas y las reglas de las lecciones 3, 4, 5, 7, 9 y 10.
- `js/stats.js`, `js/load.js`, `js/state.js`, `js/filters.js`, `js/form.js`, `js/view.js` y `js/main.js`, con los datos en `data/services.json` y `data/services-empty.json`.
- Un panel que filtra, ordena, agrega servicios con validación nativa y mensajes que un lector de pantalla puede anunciar, y que acepta `?case=empty`, `?case=error`, `?case=invalid` y `?case=timeout`.

Lo que **todavía no tiene**: ningún encabezado de seguridad (el servidor de Python solo envía lo mínimo), ninguna medición de peso ni de velocidad, un icono que es un atajo, y ninguna dirección que otra persona pueda abrir. En esta lección el panel pasa a la carpeta `11-el-panel-terminado/revisor/`, que es la lección 10 más cambios pequeños, todos explicados abajo: un archivo de encabezados, un icono propio, unas líneas en el `<head>` y un último bloque de CSS.

Todo lo de esta lección usa lo que ya tienes: el servidor de siempre desde la carpeta `programas/` del [repositorio del curso](https://github.com/HabilMX/curso-web) para las figuras (las de esta lección están en [`programas/11-el-panel-terminado/`](https://github.com/HabilMX/curso-web/tree/main/programas/11-el-panel-terminado)), y un servidor de Python un poco más largo (uno solo, de unas 55 líneas, que ves completo abajo) para probar los encabezados. Ni Node ni paquetes.

## Los conceptos

### 11.1 El repaso con el teclado

El criterio 1 dice que el panel se navega completo con el teclado, sin usar el mouse. Se comprueba haciéndolo, no leyendo el código. Hay cuatro preguntas, y cada una corresponde a un criterio de las pautas de accesibilidad (WCAG 2.2):

1. **¿Se alcanza todo?** Todo lo que se puede hacer con el mouse debe poder hacerse con el teclado ([2.1.1, Teclado](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html), nivel A). Los elementos nativos —`<button>`, `<input>`, `<select>`— ya lo cumplen. Lo que se rompe es lo que construiste a mano: un `<div>` con un clic.
2. **¿Se ve dónde estás?** El indicador de foco debe estar visible ([2.4.7, Foco visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html), nivel AA). Por eso `css/styles.css` tiene `:focus-visible { outline: 3px solid … }` desde la lección 3 y nunca un `outline: none`.
3. **¿El orden tiene sentido?** El foco debe recorrer los controles en un orden que conserve el significado y permita operar ([2.4.3, Orden del foco](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html), nivel A). La regla práctica: el orden del HTML es el orden del foco, así que no hace falta —y casi nunca conviene— tocarlo con `tabindex` positivo.
4. **¿Se puede salir?** Si el foco entra a un componente, debe poder salir de él solo con el teclado ([2.1.2, Sin trampas de teclado](https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html), nivel A).

Y dos criterios más de la versión 2.2 que se cumplen sin esfuerzo, si se saben: el foco no debe quedar totalmente tapado por contenido que tú pusiste ([2.4.11, Foco no oculto (mínimo)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html), nivel AA; un encabezado fijo es el culpable típico, y el panel no tiene ninguno) y los controles deben medir al menos 24 × 24 píxeles CSS o tener espacio alrededor ([2.5.8, Tamaño del objetivo (mínimo)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), nivel AA; los campos y botones del panel tienen un alto mínimo de 2.5 rem, que con el tamaño de letra por omisión son 40 píxeles: medido en Chrome, todos miden 40 de alto).

**Predice:** en el panel, ¿cuántas veces tienes que presionar Tab, empezando en la página recién cargada, para llegar al botón «Agregar servicio»? Piensa en lo que hay antes: los dos enlaces de la navegación, el buscador, el grupo de radios, «Revisar ahora», el botón de ordenar, la caja de la tabla, un botón «Ver detalle» por cada servicio, y los tres campos del formulario.

Pega este fragmento en la consola con el panel abierto (`Ctrl+Shift+K` en Firefox, `F12` y la pestaña Consola en Chrome). Lista, en orden, todo lo que el teclado puede alcanzar. La segunda condición del filtro deja un solo radio por grupo, el marcado, porque un grupo de radios es una sola parada de Tab (lo viste en la lección 2):

```js
const stops = [...document.querySelectorAll("a[href], button, input, select, textarea, [tabindex]")]
  .filter((e) => !e.disabled && e.tabIndex >= 0 && e.getClientRects().length > 0)
  .filter((e) => e.type !== "radio" || e.checked);
console.log(stops.map((e) =>
  `${e.tagName.toLowerCase()} · ${(e.labels?.[0]?.textContent ?? e.textContent).trim().slice(0, 30)} · tabindex ${e.tabIndex}`
).join("\n"));
```

En el panel de esta lección, con los cinco servicios cargados, imprime dieciséis líneas:

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

Son dieciséis paradas, así que la respuesta a la predicción es dieciséis veces; lo comprobé presionando Tab de verdad, y el foco recorre exactamente esa lista y en ese orden. Lo que importa de la lista no es el número sino lo que **no** aparece: ningún `tabindex` distinto de cero (todas dicen 0), ningún enlace sin destino, y un solo `div`, que está ahí a propósito: es la caja de la tabla, que la lección 5 hizo enfocable para que el teclado pueda desplazarla. Si en tu panel alguna línea dice `tabindex 3`, o si una acción del panel no aparece en la lista, ahí está el defecto.

El recorrido completo, que lleva diez minutos y vale la pena hacer despacio:

- Con Tab, avanza por toda la página; con Shift+Tab, retrocede. En cada parada, comprueba que ves el contorno de foco.
- En el buscador, escribe `pag`: la tabla debe quedarse con una fila sin que toques el mouse.
- En el selector de estado, cámbialo con las flechas.
- En un botón «Ver detalle», presiona Enter o la barra espaciadora: el detalle aparece debajo de la tabla y el foco se queda en el mismo botón (la lección 7 hizo que `update` lo devolviera ahí después de redibujar).
- En el formulario, con el foco en un campo, presiona Enter con todo vacío: el foco salta al primer campo con error. Corrige y envía: el foco vuelve a «Nombre».
- Abre `?case=error` y llega a «Reintentar» solo con Tab. Presiónalo: el foco se queda en él (la lección 9 hizo que `load` lo devolviera).

**A 320 píxeles.** El criterio 3 pide que el panel funcione a 320 píxeles de ancho sin barra de desplazamiento horizontal. No es un número arbitrario: es el criterio de [reflujo (1.4.10)](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html), nivel AA, que equivale a una pantalla de 1280 píxeles con el zoom al 400 % y existe para quien amplía el texto. Se comprueba en una línea de la consola:

```js
document.documentElement.scrollWidth <= document.documentElement.clientWidth
```

Si devuelve `false`, algo se sale. El panel llega a esta lección cumpliéndolo desde la lección 5, que metió la tabla en una caja que se desplaza, y la lección 7 tuvo que defenderlo: el texto oculto de los botones «Ver detalle» escapaba de esa caja y estiraba la página a 498 px, hasta que `position: relative` en `.table-scroll` lo devolvió adentro. Es la lección de este criterio: no se cumple una vez, se vuelve a medir después de cada cambio.

**Las herramientas automáticas.** Antes de dar por buena la revisión, corre un auditor. En esta lección se usó axe-core 4.14.0, el motor que está detrás de muchas extensiones de accesibilidad, sobre el panel en sus cinco situaciones (normal y los cuatro casos de `?case=`): cero violaciones. También Lighthouse, que más abajo detallamos, dio 100 en accesibilidad. Pero un cero no significa «accesible»: significa «ningún defecto de los que una máquina sabe reconocer». Una máquina puede ver que un campo tiene etiqueta; no puede saber si el mensaje de error se entiende. Por eso el recorrido con el teclado y, si puedes, con un lector de pantalla, no se sustituye.

### 11.2 La política de seguridad de contenido, como encabezado

**Dos capas.** En la lección 7 aprendiste la primera defensa contra los ataques de inyección de código (XSS): el texto que viene de fuera entra a la página con `textContent`, que lo trata como texto y nunca como HTML. Es la defensa que cuenta, porque evita que el problema ocurra. Una política de seguridad de contenido —CSP, por sus siglas en inglés— es una segunda capa, para el día en que la primera falle: un programador distraído que escribe `innerHTML` donde no debía, una biblioteca de terceros con un defecto. MDN lo dice con las palabras exactas en su [guía de CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP): una CSP no sustituye el tratamiento correcto de la entrada; hay que hacer ambas cosas, para tener defensa en profundidad.

**Qué es.** Una CSP es una lista de reglas que **el servidor le manda al navegador** sobre qué puede cargar y ejecutar la página. «Los scripts solo pueden venir de mi propio sitio», «las imágenes, igual», «la página no puede conectarse a nadie más». El navegador las hace cumplir: si algo viola una regla, lo bloquea y lo anota en la consola. La política más simple es `default-src 'self'`, que dice: todo lo que la página cargue debe venir de su propio origen.

**Encabezado o etiqueta.** Una CSP puede llegar de dos formas. Como un **encabezado de la respuesta** HTTP —`Content-Security-Policy: …`, la forma recomendada, que se envía con cada respuesta, no solo con la página— o como una etiqueta `<meta http-equiv="Content-Security-Policy" content="…">` dentro del HTML. La etiqueta existe para quien no controla el servidor, y por eso se usa en los sitios estáticos más simples. Pero no es lo mismo. MDN advierte que la etiqueta «no soporta todas las funciones»: no puede entregar una política en modo solo-informe, y la directiva `frame-ancestors` (que impide que otras páginas te metan en un marco) [no funciona dentro de una etiqueta](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors). El encabezado, en cambio, cubre todo.

Por eso el temario dice «CSP como encabezado del servidor». Pero empecemos por la etiqueta, que se puede probar con un archivo y sin servidor especial.

**Predice:** la figura 11.1 tiene una etiqueta con la política `script-src 'self'` y dos scripts: uno escrito dentro del HTML y otro en un archivo del mismo sitio. ¿Cuál se ejecuta?

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

Ábrela en `http://127.0.0.1:8000/11-el-panel-terminado/fig11_01.html`, con el servidor encendido desde la carpeta `programas/` del repositorio. Al cargarla, la página muestra:

```text
Una política que bloquea el script en línea
El script externo sí se ejecutó.
```

Solo corrió el script externo. El que está dentro del HTML fue bloqueado, y la consola dice por qué. Es el mensaje que verás más veces en tu vida con una CSP, y conviene que lo leas completo:

```text
Executing inline script violates the following Content Security Policy directive 'script-src 'self''. Either the 'unsafe-inline' keyword, a hash ('sha256-bTp6bKDsmuoAZZxMFjB9R21R8gPJ7kRwjoDZhQv8XQo='), or a nonce ('nonce-...') is required to enable inline execution. The action has been blocked.
```

Léelo por partes. «Executing inline script violates … `script-src 'self'`» dice qué se bloqueó (un script en línea) y qué regla lo bloqueó. «Either the 'unsafe-inline' keyword, a hash, or a nonce is required to enable inline execution» enumera las tres formas de permitirlo: abrir la regla del todo, o autorizar *ese* script en concreto con una huella (`hash`) o un número de un solo uso (`nonce`). Y «The action has been blocked» confirma que no se ejecutó. El `hash` de la muestra es el de ese script exacto; en el tuyo será igual, porque el script es el mismo.

Fíjate en lo que esto significa para quien ataca: una política así impide, por sí sola, que un fragmento inyectado —`<script>…</script>`, o un atributo `onerror="…"`— se ejecute, aunque haya llegado a la página. Y fíjate en lo que significa para ti: **tu código tiene que vivir en archivos** y registrar sus eventos con `addEventListener`. El panel lo hace así desde la lección 7. Por eso la política que escribiremos ahora no le rompe nada.

**La política del panel, directiva por directiva.** Una directiva es una regla para un tipo de recurso. La del `revisor` es esta:

| Directiva | Valor | Qué impide |
|---|---|---|
| `default-src` | `'none'` | cualquier carga que otra directiva no autorice explícitamente |
| `script-src` | `'self'` | scripts que no sean archivos del mismo sitio: en línea, de otro dominio, `eval()` |
| `style-src` | `'self'` | hojas de estilo de otros sitios y atributos `style` escritos en el HTML |
| `img-src` | `'self'` | imágenes de otros sitios y las de tipo `data:` |
| `connect-src` | `'self'` | que `fetch` pida datos a otro dominio |
| `form-action` | `'none'` | que un formulario envíe sus datos a alguna parte |
| `base-uri` | `'none'` | que alguien cambie la dirección base con una etiqueta `<base>` |
| `frame-ancestors` | `'none'` | que otra página incruste la tuya en un marco (solo funciona como encabezado) |

`'self'` significa «el mismo origen que la página» (esquema, servidor y puerto, los que estudiaste en la lección 0). Las comillas simples forman parte de la palabra. `default-src` es el valor de reserva: si no hay una directiva para un tipo de recurso, manda `default-src`. Empezar por `'none'` obliga a permitir cada cosa a propósito, y eso es lo que se quiere: una lista corta que puedes leer completa.

El panel no usa fuentes de otros sitios, ni imágenes externas, ni un solo script de terceros. Su política puede ser así de cerrada porque su código lo escribiste tú, en tus archivos.

**El archivo de encabezados.** Los servicios de publicación de sitios estáticos leen un archivo llamado `_headers` (sin extensión) que está en la carpeta que publicas. [Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/headers/) y [Netlify](https://docs.netlify.com/manage/routing/headers/) lo aceptan con la misma sintaxis: una línea con la ruta a la que aplica, y debajo, con sangría, un encabezado por línea. Estos son los del `revisor`:

```text
# revisor/_headers
# Encabezados que el servidor debe enviar con cada respuesta.
# Cloudflare Pages y Netlify leen este archivo con esta misma sintaxis.
/*
  Content-Security-Policy: default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; form-action 'none'; base-uri 'none'; frame-ancestors 'none'
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
```

Además de la CSP, tiene otros dos encabezados baratos. [`X-Content-Type-Options: nosniff`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Content-Type-Options) le dice al navegador que no adivine el tipo de un archivo: si la respuesta dice que es texto, es texto, y un script solo se ejecuta si el servidor declara que es JavaScript. Y [`Referrer-Policy: no-referrer`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Referrer-Policy) evita que el navegador le diga a otros sitios de qué página vienes; el panel no enlaza a nadie, así que no cuesta nada.

**Probarlo en tu computadora.** El servidor de siempre (`python3 -m http.server`) no lee `_headers`. Para ver lo mismo que verá el servidor donde publiques, este programa de Python hace lo mismo que `http.server` y además envía los encabezados del archivo. Sirve cualquier carpeta; léelo completo, porque son unas 55 líneas y no hay nada escondido:

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

Desde la carpeta `programas/11-el-panel-terminado/` del repositorio descargado:

```bash
python3 headers-server.py revisor 8000
```

Debe imprimir `3 encabezados leídos de revisor/_headers` y la dirección. Ábrela y comprueba, en otra terminal, que los encabezados llegan:

```bash
curl -sI http://127.0.0.1:8000/ | grep -i -E "content-security|nosniff|referrer"
```

Deben salir las tres líneas. Si no sale ninguna, el servidor no leyó el archivo, y es mejor saberlo ahora que después de publicar. (Para parar el servidor, `Ctrl+C`.) El código trae además el `?delay` del `slow-server.py` de la lección 9 —las mismas líneas, en `do_GET`—, para que `?case=timeout` siga provocando un tiempo agotado de verdad con este servidor.

**El error que aparece apenas la pones.** Con esa política activa, la consola del panel de la lección 10 dice algo que no esperabas:

```text
Loading the image 'data:,' violates the following Content Security Policy directive: "img-src 'self'". The action has been blocked.
```

Es el icono. Desde la lección 2, el panel lleva `<link rel="icon" href="data:,">`, el truco del Ejercicio 2 de la lección 1 para que el navegador no pida `/favicon.ico` y llene la consola de errores 404; la lección 2 avisó que tenía un costo, y este es. Pero una imagen `data:` no es del mismo sitio, y la política (`img-src 'self'`) la bloquea. Hay dos salidas: abrir la política con `data:` en `img-src`, o darle al sitio un icono propio. La segunda es mejor, porque un sitio publicado debe tener icono de todos modos. El `revisor` trae un archivo `favicon.svg` de dos líneas (un cuadro oscuro con un círculo verde) y el `<head>` lo enlaza con `<link rel="icon" href="favicon.svg" type="image/svg+xml">`:

```html
<!-- revisor/favicon.svg -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#1b1f24"/><circle cx="16" cy="16" r="7" fill="#1a7f37"/></svg>
```

La primera línea es un comentario, como en las páginas; en un SVG está permitido antes de la etiqueta `<svg>`. Los navegadores principales actuales aceptan un icono SVG (en esta lección se comprobó en Chrome y Firefox, no en Safari); uno que no lo acepte pedirá `/favicon.ico` y verá el 404, algo que en un panel interno puedes aceptar.

**Probar antes de imponer.** Una política nueva puede romper algo que no viste. La forma de averiguarlo sin romper a nadie es el encabezado hermano `Content-Security-Policy-Report-Only` ([MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy-Report-Only)): la misma política, pero el navegador solo *anota* las violaciones y no bloquea nada. Para probarlo, cambia el nombre del encabezado en `_headers`, recarga y mira la consola. En Chrome 154, con el icono `data:,` de la lección 10 todavía puesto, la violación aparece como un mensaje informativo: «Loading the image 'data:,' violates the following Content Security Policy directive: "img-src 'self'". The policy is report-only, so the violation has been logged but no further action has been taken.» MDN advierte que, para que los informes se *envíen* a algún lugar, la política necesita la directiva `report-to` y un servidor que los reciba; sin ellos, solo ves lo que sale en tu consola. Para un sitio pequeño, ver la consola basta. Cuando no haya mensajes, vuelves al nombre `Content-Security-Policy` y la política pasa a imponerse.

**Lo que una CSP no hace.** Que no te lleve a creer que el problema está resuelto. La figura 11.2 inserta, con `innerHTML`, un nombre con un ataque dentro (una imagen rota con un atributo `onerror`), bajo la misma política:

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

Predice: ¿se ejecuta el atributo `onerror`? ¿Queda la imagen en la página?

```text
La política no arregla el innerHTML
Imágenes inyectadas: 1. Título de la página: La política no arregla el innerHTML
```

La imagen quedó: el HTML inyectado está en la página, `1`. Pero el título del documento no cambió: el atributo no se ejecutó, y la consola dice por qué (además del 404 de una imagen que no existe):

```text
Executing inline event handler violates the following Content Security Policy directive 'script-src 'self''. Either the 'unsafe-inline' keyword, a hash ('sha256-...'), or a nonce ('nonce-...') is required to enable inline execution. Note that hashes do not apply to event handlers, style attributes and javascript: navigations unless the 'unsafe-hashes' keyword is present. The action has been blocked.
```

Esa es la CSP haciendo su trabajo de segunda capa: contuvo el daño. Pero el daño que sí ocurrió —un HTML ajeno dentro de tu página— es justamente el que `textContent` impide. La CSP no repara un `innerHTML` mal puesto; solo reduce lo que puede hacer. Y no todo ataque necesita un script: alguien que inyecta un formulario falso o un texto engañoso no necesita ejecutar nada.

**Lo que viene.** Hay dos mecanismos más nuevos que atacan el mismo problema desde otro lado, y por ahora no son base de nada que escribas aquí. **Trusted Types** ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API)) hace que asignar un texto suelto a `innerHTML` lance un error, si la política lo exige con `require-trusted-types-for 'script'`; MDN lo marca como «Baseline 2026, recién disponible» (desde febrero de 2026). **`setHTML()` y la API de saneamiento** ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/setHTML)) limpiarían el HTML antes de insertarlo; MDN lo marca como disponibilidad limitada, no Baseline. La regla del curso se mantiene: no se usan en producción hasta que sean base. Para tu panel, `textContent` hace ya el trabajo.

**La etiqueta, cuando no hay otra.** Si el sitio donde publicas no te deja enviar encabezados —la documentación de GitHub Pages que se consultó para preparar esta lección no describe ninguna manera de hacerlo, y por eso conviene comprobarlo con `curl -I` en tu sitio publicado—, la etiqueta `<meta>` es mejor que nada. El `index.html` del panel **no la trae**, porque su política viaja en `_headers`; si publicas donde no se leen encabezados, la agregas tú. Es esta línea, con las mismas directivas del `_headers` menos `frame-ancestors`, que dentro de una etiqueta no funciona y el navegador ignora con un aviso:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; form-action 'none'; base-uri 'none'">
```

Va lo más arriba posible del `<head>`, justo debajo de `<meta charset="utf-8">`: la [especificación de CSP](https://www.w3.org/TR/CSP3/) advierte que una política en una etiqueta no se aplica a lo que aparece antes de ella, así que un `<link>` o un `<script>` escritos más arriba quedarían fuera. Se comprobó así, con el panel servido por el `python3 -m http.server` de siempre (que no manda encabezados) desde una subcarpeta, como lo sirve GitHub Pages: la tabla, los cuatro casos de `?case=` y la consola sin un solo mensaje, salvo el 404 provocado de `?case=error`. Perderás `frame-ancestors` y el modo solo-informe, y deberás decirte sin rodeos que tu sitio tiene una CSP más débil que la de un servidor que sí manda encabezados.

### 11.3 Peso y rendimiento: medir antes de optimizar

La mejora de rendimiento más común es la que no hacía falta. Se ve un número alarmante, se aplica una receta de un artículo, y nadie vuelve a medir. La disciplina de esta sección es la contraria: **primero se mide, después se decide, y al final se vuelve a medir.**

**El peso.** Lo primero que se mide es lo más sencillo: cuántos bytes pesa lo que el navegador descarga. Desde la carpeta `revisor/`:

```bash
wc -c index.html favicon.svg css/*.css js/*.js data/services.json
```

El resultado, redondeado, y lo que pesaría cada tipo comprimido, calculado con `gzip -9 -c archivo | wc -c`. Esa segunda columna es una **estimación**, no una medida de lo que viaja: los servicios de publicación suelen comprimir las respuestas de texto, pero cada servidor decide si comprime y con qué algoritmo (`gzip`, `br`…), y solo el encabezado `Content-Encoding` de la respuesta dice qué se aplicó de verdad ([RFC 9110, §8.4](https://www.rfc-editor.org/rfc/rfc9110.html#section-8.4)). En 11.4 lo compruebas con `curl` sobre tu sitio publicado:

| Tipo | Archivos | Bytes | Comprimido (aprox.) |
|---|---|---|---|
| HTML | `index.html` | 5,374 | 1,742 |
| CSS | `css/styles.css` | 11,192 | 3,722 |
| JavaScript | siete módulos | 20,731 | 8,577 |
| Datos | `data/services.json` | 439 | 211 |
| Icono | `favicon.svg` | 194 | 180 |
| **Total** | | **37,930** | **unos 14,400** |

Treinta y siete mil bytes sin comprimir y unos catorce mil si el servidor comprime. La hoja de estilos es la mitad de lo que parece: buena parte de sus once mil bytes son los comentarios que explican cada regla, y comprimidos casi desaparecen. Una sola fotografía de celular pesa cientos de veces eso. Las conclusiones son tres. Una: para este panel, **reducir bytes no es el problema**. No hace falta minificar ni empaquetar, y no vale la pena complicar un curso «sin una sola herramienta de construcción» para ahorrar tres kilobytes. Dos: el módulo más pesado es `js/main.js` (7,165 bytes), porque es donde vive el formulario. Tres: si algún día el panel tuviera imágenes, ahí estaría el peso, y entonces sí habría que medir otra vez.

**Las tres métricas.** El rendimiento que siente una persona se resume en tres números, llamados las métricas web esenciales (Core Web Vitals), definidas por [web.dev](https://web.dev/articles/vitals). Cada una se evalúa en el percentil 75 de las visitas, es decir, el valor que el 75 % de las visitas igualan o mejoran:

| Métrica | Qué mide | Bueno |
|---|---|---|
| [LCP](https://web.dev/articles/lcp) (pintura del contenido más grande) | cuándo aparece lo principal | 2.5 s o menos |
| [INP](https://web.dev/articles/inp) (de la interacción a la siguiente pintura) | cuánto tarda la página en responder a un clic, un toque o una tecla | 200 ms o menos |
| [CLS](https://web.dev/articles/cls) (desplazamiento acumulado de diseño) | cuánto se mueve la página sola, sin que la persona haga nada | 0.1 o menos |

Para INP, web.dev considera deficiente todo lo que pase de 500 ms; para CLS, lo que pase de 0.25.

**Laboratorio y campo.** Un detalle que decide qué herramienta usar y qué creerle. Las métricas «de campo» se miden con personas reales que usan la página. Las de «laboratorio» se miden en tu computadora, con un perfil simulado. LCP y CLS se pueden medir en ambos lados. **INP necesita que alguien interactúe**, y eso cambia todo. Una prueba de carga en el laboratorio —abrir la página y medir, sin tocarla— no produce ningún INP, porque nadie hizo clic; Lighthouse en su modo normal es así, y en su lugar informa el *tiempo total de bloqueo* (TBT), que web.dev considera una aproximación razonable pero no un sustituto. Se *puede* medir INP en el laboratorio si interactúas tú durante la medición, pero, como advierte la [guía de INP](https://web.dev/articles/inp), el número depende de qué interacciones hiciste; el que cuenta es el de las personas reales, en el campo. Por eso un 100 en Lighthouse no es «rendimiento perfecto»: es «sin problemas en lo que Lighthouse sabe medir». Cuando tengas visitas reales, esas medidas están en la herramienta de informes de tu servicio de publicación o en los datos públicos de Chrome; mientras tanto, lo que está a tu alcance es el laboratorio.

**Medir en la consola.** Para ver LCP y CLS de tu panel sin instalar nada, abre el panel, y pega esto en la consola:

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

`buffered: true` pide al navegador las entradas que ya ocurrieron antes de que pegaras el código, y `hadRecentInput` descarta los saltos causados por algo que la persona hizo (que no cuentan). El resto del segundo observador sigue la [definición vigente de CLS](https://web.dev/articles/cls): los saltos no se suman todos, sino por **ráfagas** (ventanas de sesión). Un salto pertenece a la ráfaga en curso si llega menos de un segundo después del anterior y la ráfaga no lleva todavía cinco segundos; si no, empieza una ráfaga nueva. El CLS es la ráfaga que más sume (`Math.max`). Antes de 2021 el CLS era la suma de todos los saltos de la vida de la página, y por eso verás todavía fragmentos que hacen `cls += value` sin más: en una página que se queda abierta mucho tiempo, esa suma crece sin límite y deja de poder compararse con los umbrales de 0.1 y 0.25. En el panel, los dos cálculos dan lo mismo, porque toda la carga produce un solo salto; el fragmento correcto es el que vale para cualquier página. En tu computadora, sin limitar la red, el panel da un LCP de unos 20 a 60 ms y un CLS de casi 0: tan rápido que no hay nada que mejorar. Pero eso es engañarse: tu computadora y tu red local no son las de quien abrirá el panel desde un teléfono.

**Un perfil lento.** En las herramientas del navegador, la pestaña **Red** (en Chrome y en Firefox) permite elegir un perfil de conexión lenta. Para esta lección se usó un perfil fijo, para que los números se puedan repetir: 150 ms de latencia por petición y 200 KB/s de descarga, sin caché, con la ventana a 1280 y a 320 píxeles de ancho, tres corridas de cada una. **Son números simulados en Chrome 154 de forma automatizada**; los tuyos serán distintos, y lo que cuenta es la diferencia entre antes y después en tu máquina.

| | Panel de la lección 10 | Panel de esta lección |
|---|---|---|
| CLS a 1280 px | 0.077 | 0.001 |
| CLS a 320 px | 0.831 | 0.001 |
| LCP | de 420 a 440 ms | de 468 a 484 ms |
| La petición de `data/services.json` empieza en | unos 790 ms | unos 550 ms |
| La tabla aparece en | unos 950 ms | unos 715 ms |

Dos cosas cambiaron mucho y una no cambió. El CLS a 1280 px estaba bajo el umbral de 0.1, pero a 320 px era 0.831: más de tres veces el límite de lo «deficiente», en el ancho que más importa. Y la tabla, que es lo que la persona vino a ver, aparece unos 230 ms antes. Lo que no cambió es el LCP, y conviene entender por qué: el elemento más grande que pinta el navegador es el título «Revisor de servicios», que está en el HTML y se pinta antes de que llegue ningún dato; acelerar los datos no lo mueve (las variaciones de unas decenas de milisegundos están dentro de lo que cambia de una corrida a otra). Una métrica mide lo que mide: el LCP no sabe cuándo apareció tu tabla, y por eso esta lección mide también ese momento. Veamos las causas.

**La cascada.** En la pestaña Red, cada archivo es una barra, y el orden en que empiezan las barras cuenta la historia de la carga. El navegador descarga `index.html`, y solo entonces descubre `main.js`. Descarga `js/main.js`, y solo entonces descubre que importa `js/load.js`, `js/state.js`, `js/view.js` y `js/form.js`. Descarga `js/state.js`, y solo entonces descubre que importa `js/filters.js`; descarga `js/view.js`, y descubre `js/stats.js`. Y la petición de los datos no sale hasta que todo eso se ejecutó. Cada «solo entonces» es un viaje de ida y vuelta a la red; con 150 ms de latencia, cuatro niveles suman medio segundo, y la persona ve «Cargando servicios…» todo ese tiempo.

La solución es decirle al navegador, desde el principio, qué módulos va a necesitar, con `rel="modulepreload"` ([MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/modulepreload)): en el `<head>`, una línea por módulo, para que los descargue todos en paralelo desde el primer momento. MDN lo ubica como disponible en todos los navegadores desde septiembre de 2023 y advierte no precargar *todo*, para no quitarle ancho de banda a lo que sí es urgente. Con seis módulos de unos pocos kilobytes, no hay riesgo.

**El salto.** El CLS salió de una medición con la API de inestabilidad de diseño, que además dice *qué elementos* se movieron. En el panel de la lección 10, a 320 px, se movían el `<main>` y el `<nav>` (de la posición vertical 134 a la 160), las filas del resumen y el pie de página. Tres causas, y las tres son lo mismo: algo que **llega tarde** y empuja lo que ya estaba. La primera, la «Última revisión»: el encabezado dice «todavía no», en una línea, y cuando llega la fecha, a 320 px, ocupa dos; todo lo de abajo baja 26 px. La segunda, las cifras del resumen: un `<dd>` vacío no tiene altura, y cuando se llena, su fila crece. La tercera, el pie: mientras se carga, la página es corta y el pie está a la vista; cuando aparece la tabla, lo empuja fuera de la pantalla, y el navegador cuenta eso como un salto.

La solución se llama **reservar el espacio**: le dices a la página cuánto va a ocupar lo que llegará, antes de que llegue. Es un último bloque al final de `css/styles.css`, y el `<p>` de la «Última revisión» gana la clase `last-check` para poder apuntarle:

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

Cada regla tiene su historia de medición. La del resumen se probó primero como `min-height: 2rem` en el `<dd>`, que parecía lo obvio, y empeoró las cosas en las filas compactas de la lección 5: un `<dd>` vacío no tiene línea de base, y la fila alineada por la base (`align-items: baseline`) se acomodaba distinto que con la cifra. Un espacio de no separación (`\00a0`) generado con `::before` sí tiene línea de base, y el `<dd>` mide lo mismo vacío que lleno. Solo se genera mientras el `<dd>` está vacío (`:empty`), y un espacio no se lee en voz alta. La regla del pie se probó primero en `main`, y el salto empeoró: el alto de sobra se repartía entre los renglones de la rejilla y movía las secciones; `align-content: start` lo deja todo arriba. Es la misma idea con la que la lección 10 reservó la línea de cada error de formulario, y la advertencia de web.dev en su guía de CLS vale aquí: reservar espacio es una estimación. Si el texto resulta más largo, saltará un poco; si más corto, quedará un hueco. La decisión es de diseño: un hueco chico es mejor que un salto.

**Lo que no se hizo, y por qué.** No se minificó nada: el panel pesaría unos catorce kilobytes en la red con un servidor que comprima. No se usó `loading="lazy"`: no hay imágenes; y cuando las haya, la imagen principal de la página nunca debe llevarlo, porque retrasa el LCP. No se usaron `async` ni `defer` en el `<script>`: los módulos (`type="module"`) se difieren solos. Cada una de estas recetas es buena en su lugar, y cada una habría sido ruido aquí. No optimizar lo que ya es bueno es parte de la disciplina.

**El panel de Lighthouse.** Para cerrar, el auditor. En Chrome: herramientas del desarrollador, pestaña **Lighthouse**, «Analizar la carga de la página». La [documentación de Chrome](https://developer.chrome.com/docs/lighthouse/overview) lista hoy cinco grupos de revisiones: rendimiento, accesibilidad, mejores prácticas, SEO y uno nuevo, «navegación por agentes» (*agentic browsing*), que mide qué tan fácil le resulta a un programa automatizado entender y usar la página. Ese quinto grupo entró a la configuración de siempre en la versión 13.3.0, de mayo de 2026 ([notas de la versión](https://github.com/GoogleChrome/lighthouse/releases/tag/v13.3.0)), y su propia [página de puntuación](https://developer.chrome.com/docs/lighthouse/agentic-browsing/scoring) advierte que es **experimental**, que se basa en estándares todavía propuestos y que no da una calificación de 0 a 100, sino una fracción: cuántas de sus comprobaciones aplicables pasaste. Sobre el panel terminado, Lighthouse 13.5.0 lo muestra como **2/2**: pasan las dos que aplican (que el árbol de accesibilidad esté bien formado y el CLS), y las otras cinco salen como «no aplica», porque revisan piezas que el panel no tiene (tres sobre WebMCP, un archivo `llms.txt` y un `ai-catalog.json`). Aun así, aquí no se toma en cuenta: sigue la regla del curso de no apoyarse en lo que todavía no es base. Para esta lección se corrió Lighthouse 13.5.0 desde su línea de comandos (tú tienes el mismo motor en el panel de Chrome, sin instalar nada) sobre el panel servido con sus encabezados, y dio 100 en las cuatro categorías que sí se califican de 0 a 100 —rendimiento, accesibilidad, mejores prácticas y SEO—, con un LCP simulado de 1.4 s, un CLS de 0.001, un tiempo total de bloqueo de 0 ms y 42 KiB en total. Esos 42 KiB no contradicen los catorce kilobytes de arriba: el servidor de Python **no comprime** (con `curl -sI -H "Accept-Encoding: gzip, br"` no aparece ningún `Content-Encoding`), así que Lighthouse contó los 37.9 KB sin comprimir más los encabezados de cada respuesta. Medido en Chrome sobre el mismo servidor, lo transferido suma 42,709 bytes, 41.7 KiB. Lo que Lighthouse todavía señaló, aun con 100, fue «Network dependency tree»: la cadena de peticiones que ves en la cascada. Un 100 y una advertencia conviven bien; la advertencia es información, y el 100 no es una meta.

### 11.4 Publicar un sitio estático

Un sitio estático es una carpeta de archivos que un servidor entrega tal cual, sin ejecutar nada de tu parte. Es lo que es el `revisor`: HTML, CSS, JavaScript que corre en el navegador, y un JSON. «Publicar» es copiar esa carpeta a un servicio que la sirve por internet con una dirección y, de preferencia, con tus encabezados. No hay paso de construcción, porque el panel nunca lo necesitó.

**Qué se publica.** El **contenido** de `revisor/` (no la carpeta que lo contiene): `index.html` tiene que quedar en la raíz del sitio. Incluye `_headers`. Antes de subirlo, tres revisiones:

1. **Nada secreto.** El sitio será público; cualquier archivo que subas, lo puede leer quien conozca la dirección. En el panel no hay claves, y la regla es que nunca las haya.
2. **Los archivos de pruebas.** `data/services-empty.json` y la tabla `CASES` de `js/main.js` existen para ver los estados del panel. No dañan nada (la tabla es una lista cerrada que nunca usa el texto de la dirección como dirección de la petición, como se explicó en la lección 9), pero decide si quieres un panel publicado con ese modo de pruebas o sin él.
3. **Los datos son de ejemplo.** El `data/services.json` que publicas es el que cualquiera verá. Que un panel muestre servicios que no existen es legítimo para un ejercicio; dilo en el propio sitio si lo compartes.

**Dónde.** Hay varias opciones gratuitas. Estas son las que se consultaron para la lección, con lo que sus propias páginas dicen, **en orden de preferencia**: las dos primeras envían tus encabezados; GitHub Pages va al final porque no lo hace, y enseguida verás qué pierdes por eso.

- **Cloudflare Pages.** Permite subir una carpeta arrastrándola al panel de control («Subida directa»: en la sección Workers y Pages, «Create application», «Get started», «Drag and drop your files»; acepta una carpeta o un zip), y deja el sitio en `nombre-del-proyecto.pages.dev` ([guía](https://developers.cloudflare.com/pages/get-started/direct-upload/)). Lee `_headers` ([documentación](https://developers.cloudflare.com/pages/configuration/headers/)): hasta 100 reglas, 2,000 caracteres por línea. La documentación consultada no dice expresamente si `_headers` se respeta en la subida directa; compruébalo con `curl`, como más abajo.
- **Netlify.** «Netlify Drop» ([guía](https://docs.netlify.com/site-deploys/create-deploys/)) deja arrastrar una carpeta ya construida y publicarla sin cuenta y sin Git; el sitio anónimo es temporal, hay que reclamarlo en la primera hora. También lee `_headers` ([documentación](https://docs.netlify.com/manage/routing/headers/)).
- **GitHub Pages, la última opción.** Publica desde un repositorio de GitHub, y solo desde dos lugares de una rama: su raíz (`/`) o una carpeta llamada `/docs` ([documentación](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)); la otra vía es un flujo automatizado de GitHub Actions, que este curso no usa. Por eso el **contenido** de `revisor/` tiene que quedar en la raíz del repositorio, no dentro de una carpeta `revisor/`. Con el plan gratuito, el repositorio **tiene que ser público** ([documentación](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)); los cambios pueden tardar hasta diez minutos en verse; y sus [límites](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) incluyen un sitio de 1 GB como máximo, un límite blando de 100 GB de transferencia al mes, y la prohibición de usarlo como alojamiento gratuito de un negocio. Como se dijo en 11.2, no hay una forma documentada de enviar encabezados propios; además, GitHub Pages procesa el sitio con Jekyll, que por omisión [no publica los archivos cuyo nombre empieza con `_`](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll), así que `_headers` ni siquiera llega. Si eliges GitHub Pages, la CSP la pones tú: agrega al `<head>` de `index.html` la etiqueta `<meta>` de 11.2 antes de subirlo.

**Por qué GitHub Pages queda al final: una CSP más débil.** Piensa en la diferencia entre una regla que el servidor anuncia **antes** de entregar la página y una nota escrita **dentro** de la página. El encabezado llega primero, y el navegador lo aplica a todo; la etiqueta `<meta>` solo se lee cuando el navegador ya está leyendo el HTML. Por eso la [especificación de CSP](https://www.w3.org/TR/CSP3/#meta-element) deja fuera de la etiqueta tres directivas: `frame-ancestors`, `sandbox` y `report-uri`, además de todo el modo solo-informe. Para el panel, la pérdida que importa es la primera: `frame-ancestors 'none'` es lo que impide que otro sitio meta tu página dentro de un marco (`<iframe>`) y la disfrace bajo botones falsos para que alguien haga clic sin saber en qué ([MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors) dice expresamente que no funciona en `<meta>`). Y la CSP no es lo único que viajaba en `_headers`: `X-Content-Type-Options: nosniff` no tiene versión en etiqueta, así que también se pierde; `Referrer-Policy` sí la tiene, `<meta name="referrer" content="no-referrer">` ([MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/referrer)), si quieres conservarla. Para un ejercicio con datos de ejemplo, el riesgo es pequeño y publicar en GitHub Pages es legítimo; para un sitio de verdad, elige un servicio que mande encabezados.

Ninguna de las tres necesita Node ni instalar nada, y las tres sirven para este ejercicio; lo que no es secundario es lo que sigue.

**Publicar en GitHub Pages sin usar Git en la terminal.** En la lección 1 guardaste registros con Git en tu computadora, pero el curso nunca te enseñó a subirlos a un servicio como GitHub, y para publicar no hace falta: GitHub deja subir archivos desde el navegador. Si eliges esta opción, son cinco pasos, todos tomados de la documentación de GitHub:

1. **Una cuenta.** Si no tienes, crea una gratuita en `github.com`. Tu nombre de usuario aparecerá en la dirección del sitio.
2. **Un repositorio público.** Arriba a la derecha de cualquier página de GitHub, el botón **+** y luego **New repository**; ponle un nombre (por ejemplo `revisor`), elige la visibilidad **Public** y presiona **Create repository** ([documentación](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository)).
3. **Los archivos.** Antes, agrega a tu `index.html` la etiqueta `<meta>` de la CSP (11.2). Después, en la página del repositorio, **Add file** y luego **Upload files**, y arrastra a la ventana del navegador **lo que hay dentro** de tu carpeta `revisor/` —`index.html`, `favicon.svg` y las carpetas `css`, `js` y `data`—, no la carpeta `revisor` misma: `index.html` tiene que quedar en la raíz. Escribe un mensaje, como harías con `git commit`, y confirma ([documentación](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository); el navegador admite hasta 100 archivos por vez y 25 MiB por archivo, de sobra para el panel).
4. **Encender Pages.** En el repositorio, **Settings**, luego **Pages** en la barra lateral; en «Build and deployment», en **Source**, elige **Deploy from a branch**, y en la rama elige `main` y la carpeta `/ (root)`; guarda ([documentación](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)).
5. **La dirección.** Un sitio de un repositorio queda en `https://<tu-usuario>.github.io/<repositorio>/` ([documentación](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages)), por ejemplo `https://ana.github.io/revisor/`. Fíjate en que el panel vive en una **subcarpeta** del dominio, `/revisor/`. Funciona porque todas las rutas del panel son relativas (`css/styles.css`, `data/services.json`); una ruta que empezara con `/`, como `/css/styles.css`, buscaría en la raíz del dominio y daría 404.

Si ya sabes usar `git push`, también sirve, y el resultado es el mismo; este curso no lo enseña porque para publicar una carpeta no lo necesitas.

**Verificar lo publicado.** Una promesa de un servicio no es una prueba. Con tu dirección ya publicada (aquí `https://tu-sitio.example`), tres comprobaciones en una terminal:

```bash
curl -sI https://tu-sitio.example/ | grep -i -E "content-security|nosniff|referrer"
curl -sI -H "Accept-Encoding: gzip, br" https://tu-sitio.example/js/main.js | grep -i content-encoding
curl -s -o /dev/null -w "%{http_code}\n" https://tu-sitio.example/data/services.json
```

La primera debe mostrar tus tres encabezados; si no sale ninguno, el servicio no leyó `_headers` y tu sitio no tiene la CSP, aunque el archivo esté ahí. En GitHub Pages no saldrá ninguno, y es lo esperado: ahí la comprobación es que el `index.html` publicado lleve la etiqueta `<meta>` (`curl -s https://tu-sitio.example/ | grep -i content-security`). La segunda dice si el servicio comprime las respuestas de texto (debe aparecer `gzip` o `br`). La tercera, `200`. Después, abre el sitio en el navegador con la consola abierta y repite los cinco criterios de la sección siguiente, ahora sobre la dirección pública. Una ruta que funcionaba en tu computadora puede romperse al publicar: ahí se encuentran las rutas absolutas escritas por error y los nombres que solo difieren en mayúsculas. En Linux Mint, `Main.js` y `main.js` son dos archivos distintos, igual que para el servidor, así que ese error ya lo habrías visto en tu computadora; pero en Windows y en macOS, cuyos discos por omisión no distinguen mayúsculas de minúsculas ([Microsoft](https://learn.microsoft.com/en-us/windows/wsl/case-sensitivity), [Apple](https://support.apple.com/guide/disk-utility/file-system-formats-dsku19ed921c/mac)), un `<script src="js/Main.js">` funciona en la computadora y se rompe al publicar. Si alguien más trabaja el panel desde esos sistemas, ahí tienes la causa.

**Y lo que no se publica.** El servidor de Python con el que trabajaste (`python3 -m http.server`, y el `headers-server.py` de esta lección) es una herramienta para desarrollar, no para servir al público. Si lo enciendes sin `--bind 127.0.0.1`, escucha en todas las direcciones de tu computadora y cualquiera de tu red puede leer la carpeta desde donde lo lanzaste; la [documentación de Python](https://docs.python.org/3/library/http.server.html) advierte, además, que el módulo no es para producción y que solo implementa comprobaciones básicas de seguridad. El nuestro escucha solo en `127.0.0.1`, que es la dirección de tu propia máquina.

### 11.5 Los cinco criterios, uno por uno

Ahora sí, el cierre prometido. Para cada criterio hay una prueba que puedes repetir y el resultado que se obtuvo al preparar la lección, con el panel servido por `headers-server.py` y la consola abierta, en Chrome 154. Si tu resultado es distinto, el criterio no está cumplido, y no se acaba hasta que lo esté.

**1. Se navega completo con el teclado.** *Prueba:* el recorrido de 11.1, con el fragmento de las paradas. *Resultado:* dieciséis paradas en un orden razonable, todas con `tabindex 0`, todas con contorno de foco visible (`outline` sólido de 3 px), y ninguna trampa: tras el último botón el foco vuelve al principio de la página.

**2. No hay ni un error en la consola.** *Prueba:* recarga el panel con la consola abierta y recorre la lección 10 entera (filtrar, ordenar, agregar, equivocarte). *Resultado:* ningún mensaje, ni error ni aviso, en el recorrido normal y en `?case=empty`, `?case=invalid` y `?case=timeout`. Una excepción que debes conocer: `?case=error` pide un archivo que no existe, y el navegador anota por su cuenta «Failed to load resource: … 404». Es la petición que provocaste a propósito y no un defecto de tu código; el criterio es sobre el recorrido normal. Lo único que lo ensució en el camino fue el icono `data:,` al activar la CSP, y ya se corrigió (ver 11.2).

**3. Funciona a 320 px de ancho.** *Prueba:* la ventana a 320 px (el modo de dispositivo de las herramientas) y la línea de 11.1. *Resultado:* `scrollWidth` y `clientWidth` valen 320 en las cinco situaciones: no hay desbordamiento.

**Y si pasas la hoja por el validador.** En la lección 3 tomaste la costumbre de pasar tu `styles.css` por el [validador de CSS del W3C](https://jigsaw.w3.org/css-validator/) antes de dar una hoja por buena, y conviene mantenerla. Con la hoja terminada vas a ver algo que en la lección 3 no salía: el validador responde con **dos errores**, «Property “container-type” doesn't exist» y «Unrecognized at-rule “@container”», además de los dos avisos de siempre sobre las variables. Así respondió al enviarle `revisor/css/styles.css` al preparar la lección. Los dos errores vienen de la consulta de contenedor que agregaste en la lección 5, y no son errores de tu hoja: las consultas de contenedor son parte de la especificación [CSS Containment Module Level 3](https://www.w3.org/TR/css-contain-3/) y funcionan en todos los navegadores, como viste en la lección 5, pero el validador todavía no las reconoce. La regla práctica: lee cada error y decide; si lo que marca es `container-type` o `@container`, es una limitación del validador y lo dejas. Cualquier otro error sí se corrige, igual que en la lección 3.

**4. Muestra los tres estados.** *Prueba:* abre estas direcciones sobre el panel publicado o local.

| Dirección | Debe verse |
|---|---|
| `/` | la tabla, «Mostrando 5 de 5 servicios.» |
| `/?case=empty` | «No hay servicios que revisar.», sin tabla, con «Reintentar» y con el formulario para agregar el primero |
| `/?case=error` | «El servidor respondió con el código 404.», con «Reintentar» |
| `/?case=timeout` | «Cargando servicios…» durante tres segundos y después «El servidor no respondió en 3000 ms.», con «Reintentar». En el sitio publicado no hay `?delay`, así que ahí la tabla carga normal |

Y para el estado «cargando», que en tu máquina dura milisegundos, la pestaña Red con un perfil lento, o una petición que nunca contesta. *Resultado:* las cuatro direcciones muestran lo que dice la tabla, y con una petición de datos que no responde, «Cargando servicios…» aparece de inmediato y, a los tres segundos, el aviso dice «El servidor no respondió en 3000 ms.» con «Reintentar».

**5. El texto que viene de fuera se dibuja con `textContent`, nunca con `innerHTML`.** *Prueba:* busca en tu código.

```bash
grep -n -E "innerHTML|outerHTML|insertAdjacentHTML|document\.write|eval\(" revisor/js/*.js
```

*Resultado:* ninguna línea. Y la prueba funcional de la lección 7 sigue valiendo: agrega un servicio llamado `<img src=x onerror=alert(1)>`; aparece como texto en la tabla, tal cual, y no pasa nada más. La CSP de 11.2 es el respaldo de esto, no su sustituto.

Cinco pruebas, cinco resultados. Si los cinco salen como arriba en tu panel, el curso terminó. Y para el criterio 1 hay una segunda opinión automática: axe-core 4.14.0 sobre las cinco situaciones del panel no encontró ninguna falta.

Este es el `index.html` terminado:

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

Respecto de la lección 10 cambiaron el `<head>` —la descripción de la página, el icono propio y las seis líneas de `modulepreload`— y una clase en el encabezado, `last-check`, para reservar su espacio. El resto del `index.html`, los siete módulos y los datos son idénticos a los de la lección 10, salvo la primera línea, que en el repositorio dice dónde vive cada archivo; `css/styles.css` es el de la lección 10 más el bloque de 11.3.

## El error que vas a ver

El de la política que bloquea el script en línea, que ya viste en la figura 11.1. Es el mensaje más característico de una CSP, y se lee en tres tiempos:

```text
Executing inline script violates the following Content Security Policy directive 'script-src 'self''. Either the 'unsafe-inline' keyword, a hash ('sha256-…'), or a nonce ('nonce-…') is required to enable inline execution. The action has been blocked.
```

*Qué significa:* la página intentó ejecutar un script que está escrito dentro del HTML, y la política (`script-src 'self'`) solo admite scripts que sean archivos del mismo sitio. *Cómo se arregla:* mueve el código a un archivo `.js` y cárgalo con `<script src="…">` o, mejor, `<script type="module" src="…">`. Las otras dos salidas que el mensaje nombra —una huella o un número de un solo uso— existen para casos especiales, y abrirlo todo con `'unsafe-inline'` deshace la protección, así que no es una salida.

Una variante, que aparece cuando el código inline es un atributo (`onclick="…"` o `onerror="…"`): el mensaje dice «Executing inline event handler violates…» y añade una nota: las huellas no sirven con los manejadores de eventos. La salida correcta es la misma, `addEventListener` en un archivo, y es la que usa el panel.

Y una más, con una causa distinta: si una directiva ausente cae en `default-src 'none'`, el mensaje lo dice: «Note that 'connect-src' was not explicitly set, so 'default-src' is used as a fallback». Se provoca en el ejercicio 2.

## Lo que se hace mal

- **Copiar una CSP de internet sin leerla.** *Cómo se ve:* una línea de doscientos caracteres con una docena de dominios que tu sitio nunca usa. *Costo:* cada dominio permitido es un lugar desde donde se puede cargar código en tu página. Una política es una lista de lo que tu sitio necesita, no de lo que alguien más usó.
- **`'unsafe-inline'` para que «deje de dar errores».** *Cómo se ve:* un `script-src 'self' 'unsafe-inline'`. *Costo:* es abrir justo lo que la política cierra. Sin esa protección, el encabezado queda de adorno.
- **Creer que la CSP arregla el XSS.** *Cómo se ve:* «ya tengo CSP, entonces puedo usar `innerHTML`». *Costo:* la figura 11.2 lo muestra: el HTML inyectado queda en la página. `textContent` es la defensa; la CSP, la segunda barrera.
- **Un sitio publicado sin comprobar que los encabezados llegaron.** *Cómo se ve:* el archivo `_headers` está en la carpeta y nadie hizo `curl -I`. *Costo:* el servicio puede no leerlo (o leerlo solo en otro modo de subida); tienes una política que existe en tu computadora y no en internet.
- **Optimizar sin medir.** *Cómo se ve:* minificar, empaquetar y diferir cosas porque «se debe». *Costo:* complejidad que no compraste con ningún número. Mide primero, cambia una cosa, mide otra vez.
- **Medir solo en tu computadora.** *Cómo se ve:* «carga en 70 milisegundos». *Costo:* es la medida del equipo más rápido y la red más corta que existe. Limita la red en las herramientas y mira la cascada.
- **`loading="lazy"` en la imagen principal.** *Cómo se ve:* una receta de rendimiento aplicada a todas las imágenes. *Costo:* según web.dev, empeora el LCP, porque la imagen más importante se pide tarde. Solo para las que están fuera de la pantalla.
- **Servir al público con `python3 -m http.server`, o sin `--bind 127.0.0.1`.** *Cómo se ve:* encender el servidor de desarrollo para que otros vean la página. *Costo:* sin `--bind`, cualquiera en tu red lee la carpeta desde la que lo encendiste; y en ningún caso es un servidor hecho para el público.
- **Subir un archivo con claves a un sitio público.** *Cómo se ve:* un `.env`, una clave en un `services.json`. *Costo:* la carpeta entera es legible por cualquiera con la dirección; y un secreto publicado se debe dar por perdido, aunque lo borres.

## Ejercicios

### Ejercicio 1 — Leer una política

Sin ejecutar nada, di qué hace cada una de estas dos políticas con el panel, y cuál de las dos le rompe algo: (a) `default-src 'self'`; (b) `default-src 'self'; script-src 'self' 'unsafe-inline'`. Después, pon la (a) en el `_headers` del panel y ábrelo: ¿cambia algo respecto a la política del panel?

### Ejercicio 2 — Romper algo a propósito

En una copia de la carpeta `revisor/`, quita `connect-src 'self';` del `_headers`, enciende `headers-server.py` sobre la copia y abre el panel. Anota qué ve la persona en pantalla y qué dice la consola. Después arregla la política y vuelve a comprobar.

### Ejercicio 3 — Medir tú

Con el panel servido desde tu computadora y un perfil de red lento en las herramientas del navegador, mide con el fragmento de 11.3 el CLS y el LCP del panel **sin** las seis líneas de `modulepreload` y **con** ellas, tres veces cada uno. Escribe en la bitácora tus seis números y una frase: ¿ayudó? ¿cuánto? Si no ayudó, escribe por qué crees que no.

## Soluciones

**Ejercicio 1.** (a) Permite cargar cualquier cosa, pero solo del mismo sitio, y como `default-src` es el valor de reserva, cubre scripts, estilos, imágenes y conexiones. No bloquea nada de lo que el panel hace: todo viene del mismo origen. Cambia solo en lo que **no** cubre: no incluye `form-action`, `base-uri` ni `frame-ancestors`, que no caen en `default-src`; es decir, es menos estricta que la del panel; con ella el panel se ve y funciona igual. (b) Parte de lo mismo, pero con `'unsafe-inline'` en `script-src` permite scripts escritos dentro del HTML. No le rompe nada al panel, y es la peor de las dos: cierra mucho menos. La lección: una política que «no rompe nada» no es por eso buena; hay que mirar lo que deja abierto.

**Ejercicio 2.** Sin `connect-src`, la regla de reserva `default-src 'none'` bloquea el `fetch`. La persona ve «No se pudo conectar con el servidor.» con el botón «Reintentar» (el panel trata el fallo de la red como cualquier otro, y es una buena razón por la que `js/load.js` convierte los errores en mensajes). La consola dice, en Chrome 154: «Connecting to 'http://127.0.0.1:…/data/services.json' violates the following Content Security Policy directive: "default-src 'none'". Note that 'connect-src' was not explicitly set, so 'default-src' is used as a fallback. The action has been blocked.», seguido de «Fetch API cannot load … Refused to connect because it violates the document's Content Security Policy». Se arregla devolviendo `connect-src 'self';`. Lo que se aprende: el panel degrada con elegancia, pero la causa está en la consola, no en la pantalla.

**Ejercicio 3.** Los números dependen de tu máquina; lo que debe salir es la forma: con `modulepreload`, la petición de `data/services.json` empieza antes y la tabla aparece antes; el LCP, que es el título, casi no se mueve. Si no ves diferencia, no es un error del ejercicio: con una red local rápida y sin limitar, la cascada es tan corta que no se nota. Limita la red y vuelve a intentarlo. Si tu CLS ya era 0 en ambos casos, eso también es un resultado: el salto que corregimos aparece cuando el resumen tarda en llegar, así que puede no producirse con una red rápida.

## Cómo sé que lo logré

- [ ] `curl -sI http://127.0.0.1:8000/ | grep -i content-security`, con `headers-server.py revisor 8000` encendido, imprime la política de la sección 11.2.
- [ ] La figura 11.1 (`fig11_01.html`) muestra «El script externo sí se ejecutó.» y la consola trae el mensaje de «Executing inline script violates…».
- [ ] La figura 11.2 muestra «Imágenes inyectadas: 1. Título de la página: La política no arregla el innerHTML» y la consola trae «Executing inline event handler violates…».
- [ ] Con el panel de `revisor/` servido con sus encabezados, la consola está vacía en el recorrido normal.
- [ ] Los **cinco criterios** de 11.5 salen como se describen, cada uno con su prueba: dieciséis paradas de teclado, consola vacía, 320 = 320, las cuatro direcciones con su aviso, y cero coincidencias en el `grep`.
- [ ] Tienes una tabla propia con el peso del panel (`wc -c` y `gzip -9 -c … | wc -c`) y, al menos, el LCP y el CLS medidos con el fragmento de la consola.
- [ ] El panel está publicado en una dirección que no es `127.0.0.1`, y `curl -sI` sobre esa dirección muestra los tres encabezados (en GitHub Pages, en su lugar, el `index.html` publicado trae la etiqueta `<meta>` de la CSP). Si no pudiste publicarlo, escribe en la bitácora qué lo impidió.

**Repaso de lecciones anteriores** (respóndelas sin mirar, y después comprueba):

1. En la lección 1: ¿por qué un módulo de JavaScript no carga si abres el archivo con `file://`, y qué hiciste para evitarlo?
2. En la lección 3: ¿por qué `* { box-sizing: border-box }` hace que un ancho de 300 px sea 300 px aunque haya relleno?
3. En la lección 7: ¿por qué `textContent` no ejecuta un `<img onerror=…>`?
4. En la lección 10: ¿cuál es la diferencia entre `:invalid` y `:user-invalid`?

Si alguna se te escapó, anótala en la bitácora: el curso terminó, pero esa lista es el principio de lo que sigue.

**Y lo que sigue.** El panel que construiste se rehace con tipos y con React en el [curso de TypeScript](https://www.habil.mx/es/cursos/typescript/) de esta casa. Compara las dos versiones: de la comparación se aprende más que de empezar otro proyecto.

## Para leer más

- [MDN — Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP): la guía completa, con las directivas, el modo solo-informe y la política estricta con `nonce`.
- [web.dev — Core Web Vitals](https://web.dev/articles/vitals): las tres métricas, sus umbrales y la diferencia entre laboratorio y campo.
- [Documentación de Cloudflare Pages — Encabezados personalizados](https://developers.cloudflare.com/pages/configuration/headers/): el archivo `_headers` con su sintaxis y sus límites.
- [W3C — Entender WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/): cada criterio de accesibilidad explicado, con sus técnicas y sus fallos típicos.
