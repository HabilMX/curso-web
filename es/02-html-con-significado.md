# Lección 2 — HTML con significado

**Tiempo:** dos sesiones de unos 90 min. Un reparto que funciona: la primera, «El porqué antes del cómo», el documento y los elementos con significado (2.1) y la tabla (2.2); la segunda, los controles (2.3), el panel completo escrito a mano, «El error que vas a ver» y los ejercicios. Cada sesión termina en una página que puedes abrir y validar.

**Qué construyes:** el esqueleto del panel `revisor`, escrito a mano

**Qué aprendes:** elegir el elemento por lo que significa y no por cómo se ve; encabezados, tablas, botones, enlaces y etiquetas

**Las páginas de esta lección.** Todas las figuras están en [`programas/02-html-con-significado/`](https://github.com/HabilMX/curso-web/tree/main/programas/02-html-con-significado) del [repositorio del curso](https://github.com/HabilMX/curso-web), cada una con su salida esperada al lado. Ábrelas con el servidor local que encendiste en la Lección 1.

## Al terminar vas a poder

- Escribir desde cero un documento HTML completo y explicar para qué sirve cada línea de su cabecera: `<!DOCTYPE html>`, `lang`, `charset`, `viewport` y `<title>`.
- Elegir entre `<header>`, `<nav>`, `<main>`, `<section>` y `<footer>` en lugar de un `<div>`, y decir qué gana quien usa la página con ello.
- Construir una tabla accesible, con título, encabezados de columna y encabezados de fila, y decidir cuándo un dato no merece tabla sino lista.
- Distinguir un enlace de un botón por lo que cada uno promete, y comprobarlo con la tecla Tab.
- Asociar cada campo con su etiqueta de las dos maneras que existen (explícita e implícita), agrupar opciones con `<fieldset>` y `<legend>`, y explicar por qué un `placeholder` no es una etiqueta.
- Pasar una página por el validador oficial, leer sus mensajes y arreglar lo que señalan.

## El porqué antes del cómo

Imagina que le entregas el panel a cuatro personas distintas. La primera lo abre en una pantalla grande y lo maneja con el mouse: para ella casi cualquier página funciona, porque ve el resultado. La segunda tiene la muñeca lastimada y maneja todo con el teclado: avanza con la tecla Tab y activa con Enter. La tercera es una persona ciega que lo escucha con un lector de pantalla, un programa que lee en voz alta lo que hay en la página y deja saltar de un encabezado a otro. La cuarta no es una persona: es el buscador que va a decidir qué dice tu página en sus resultados.

Las tres últimas tienen algo en común: **no miran los píxeles, leen la estructura**. El teclado necesita saber qué cosas se pueden activar. El lector de pantalla necesita saber qué es un título, qué es una tabla, qué es un botón. El buscador necesita saber qué es el contenido principal y qué es el pie de página. Y todo eso se lo da el HTML, no el color ni el tamaño de letra.

Por eso esta lección se llama «HTML con significado». El HTML no es «el lenguaje que dibuja la página»: es el lenguaje que **dice qué es cada cosa**. Dibujarla es trabajo del CSS, que verás en la Lección 3; hacer que reaccione es trabajo de JavaScript, a partir de la Lección 6. Hoy no vas a escribir una sola regla de estilo, y eso es a propósito: la página saldrá fea, con la apariencia por omisión del navegador, y aun así será usable por las cuatro personas. Una página que solo es usable cuando está bonita no está terminada, está maquillada.

Lo que hoy falta es concreto: el `revisor` todavía no existe. Al terminar esta lección tendrás su esqueleto completo: un encabezado, un resumen, un campo de búsqueda, un filtro, un botón y una tabla con cinco servicios, todo escrito a mano con datos de ejemplo. Todavía no filtra ni busca nada: eso llega más adelante. Lo que sí tendrá desde hoy es una estructura que no hay que rehacer después. El orden de la lección es este: primero el documento y los elementos que dan estructura (la sección 2.1), después los datos con forma de tabla (2.2) y al final los controles, que son los botones, los enlaces y las etiquetas (2.3). Cada sección termina en una página que puedes abrir y probar.

## Los conceptos

Empieza guardando el trabajo de hoy en la carpeta de tu proyecto, la misma donde dejaste el primer `index.html` en la [Lección 1](01-entorno-ciclo-trabajo.md). Desde esa carpeta levanta el servidor local con `python3 -m http.server 8000 --bind 127.0.0.1`, como en la Lección 1, y abre `http://localhost:8000/` en el navegador cada vez que guardes un cambio. Si la página no cambió, recarga con Ctrl+Shift+R, que ignora lo que el navegador tenía guardado.

### 2.1 El documento y los elementos con significado

#### 2.1.1 Qué es un elemento

Un documento HTML es texto con marcas. Cada marca se llama **etiqueta** y casi siempre viene en pareja: una de apertura, como `<h1>`, y una de cierre, como `</h1>`. Lo que queda entre las dos es el contenido. La pareja completa, con su contenido, se llama **elemento**. Al escribir `<h1>Revisor de servicios</h1>` has creado un elemento que dice: «esto es un encabezado de primer nivel, y su texto es "Revisor de servicios"».

Algunas etiquetas llevan **atributos**, que son datos extra con la forma `nombre="valor"` dentro de la etiqueta de apertura. En `<a href="#services">` el atributo es `href` y su valor es `#services`. Un atributo que verás en casi todas las páginas de hoy es **`id`**: le pone a un elemento un nombre que no se puede repetir en el documento, como `id="services"`. Un enlace cuyo `href` empieza con `#` lleva a la parte de la misma página que tiene ese `id`: `<a href="#services">` salta al elemento con `id="services"`. Más adelante, el CSS y JavaScript usarán ese mismo nombre para encontrar el elemento. Otro atributo frecuente es **`class`**: también le pone un nombre al elemento, pero a diferencia de `id` se puede repetir en muchos elementos, y un mismo elemento puede llevar varios separados por espacios (`class="status status-available"`). Sirve para que el CSS le dé la misma apariencia a todos los que lo llevan; **no cambia lo que el elemento significa**, y por eso un `<div class="title">` sigue siendo una caja sin significado, aunque su nombre diga «título». Algunos elementos no tienen contenido y por eso no llevan etiqueta de cierre; se llaman **elementos vacíos**: `<meta>`, `<input>` e `<img>` son los que verás hoy.

Cuando el navegador recibe tu archivo no lo «dibuja» directamente. Lo lee de arriba abajo y construye con él una estructura en memoria con forma de árbol: el documento es la raíz, dentro van `<head>` y `<body>`, dentro de `<body>` van los encabezados, los párrafos, la tabla, y así sucesivamente. Ese árbol se llama **DOM** (modelo de objetos del documento) y volverá a aparecer en la Lección 7, donde JavaScript lo recorrerá y lo cambiará. Por ahora basta con que sepas que lo que el navegador muestra, lo que el teclado recorre y lo que el lector de pantalla lee salen de ese árbol, no de tu archivo de texto.

Una consecuencia incómoda: **el navegador perdona casi todo**. Si olvidas cerrar un párrafo o pones un elemento donde no va, no te avisa; adivina lo que quisiste decir con unas [reglas muy precisas que están escritas en la especificación](https://html.spec.whatwg.org/multipage/parsing.html) y arma el árbol como puede. Eso es bueno para quien visita una página mal escrita, pero malo para quien la escribe: el error no se ve, solo se nota después, en otro navegador o en otro tipo de usuario. Por eso en esta lección usarás un validador, un programa que revisa tu HTML contra las reglas del estándar y te dice lo que el navegador calló.

#### 2.1.2 Lo mínimo de un documento completo

Esta es la página más pequeña que está completa. Guárdala como `pagina.html` en tu carpeta y ábrela:

```html
<!-- fig02_01.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Revisor de servicios</title>
</head>
<body>
  <main>
    <h1>Revisor de servicios</h1>
    <p>Esta es la página más pequeña que está completa.</p>
  </main>
</body>
</html>
```

```text
Revisor de servicios
Esta es la página más pequeña que está completa.
```

El bloque de abajo es lo que muestra la página al cargarla, reducido a su texto. Lo importante está en las líneas de arriba que no se ven. Cada una existe por una razón concreta.

**`<!DOCTYPE html>`** va siempre primero. Parece una etiqueta, pero es una declaración: le dice al navegador «esta página sigue el estándar actual». Sin ella, los navegadores entran en lo que llaman **[modo de compatibilidad](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Quirks_mode_and_standards_mode)** (*quirks mode*): imitan los errores de navegadores de hace veinticinco años para que las páginas viejas sigan viéndose como se veían, y varias reglas de cálculo de tamaños cambian en silencio. Quien olvida el `DOCTYPE` no recibe un error: recibe una página que se ve ligeramente distinta y no sabe por qué. Escríbelo siempre, tal cual.

**`<html lang="es">`** es la raíz del documento y declara el idioma. Parece un detalle de cortesía y no lo es. El lector de pantalla elige con él la voz y la pronunciación: sin `lang`, puede leer tu texto en español con las reglas del inglés, y el resultado es incomprensible. El navegador lo usa para ofrecer traducir la página y para elegir las comillas del elemento `<q>` según el idioma, y el CSS lo usa para saber con qué diccionario partir palabras con guion al final de la línea cuando se lo pides con `hyphens: auto` (por omisión no parte ninguna; lo comprobé en Chrome 154). Es, además, un criterio de accesibilidad con nombre y número en las pautas de la W3C ([WCAG 3.1.1, «Idioma de la página»](https://www.w3.org/WAI/WCAG22/Understanding/language-of-page.html)). El valor `es` significa español; si algún día necesitas el español de México en particular, se escribe `es-MX`.

**`<meta charset="utf-8">`** dice con qué código de caracteres está guardado el archivo. UTF-8 es el que representa las ñ, los acentos y los signos de apertura (¿ ¡) sin problemas. Si lo omites y tu editor guardó en UTF-8, es posible que veas «CatÃ¡logo» en lugar de «Catálogo»: el navegador adivinó otra codificación. La [especificación](https://html.spec.whatwg.org/multipage/semantics.html) pide, además, que esta línea aparezca completa dentro de los primeros 1,024 bytes del archivo, así que va al principio del `<head>`, antes del título.

**`<meta name="viewport" content="width=device-width, initial-scale=1">`** es la línea que más se olvida y la que más duele en un teléfono. Los navegadores móviles nacieron en un mundo de páginas hechas para escritorio, y para no romperlas fingen por omisión que la pantalla es mucho más ancha de lo que es (del orden de 980 px) y después la encogen para que quepa. Con esta línea le dices «no finjas: usa el ancho real del dispositivo y una escala de 1». Sin ella, la Lección 5 no puede funcionar, porque ningún diseño adaptable se adapta a un ancho que el navegador está mintiendo.

**`<title>`** es el título del documento, que no es lo mismo que el encabezado `<h1>`. Aparece en la pestaña, en el historial, en los marcadores y, sobre todo, es **lo primero que anuncia un lector de pantalla al abrir la página** y lo que casi todos los buscadores muestran como título del resultado. Otra pauta de accesibilidad lo exige por nombre ([WCAG 2.4.2, «Página titulada»](https://www.w3.org/WAI/WCAG22/Understanding/page-titled.html)). Un título como «Documento sin título» o «index» es una página sin nombre. Escribe uno que diga qué página es.

Observa también, en la página de arriba, lo que hay dentro de `<body>`: un `<main>` que envuelve todo. Es el primer elemento con significado que conoces y el siguiente apartado trata de ellos.

#### 2.1.3 Significado: la diferencia entre un `div` y un `main`

Aquí está la idea central de la lección, y conviene verla con un contraste. Las dos páginas siguientes dicen exactamente lo mismo y, con la apariencia por omisión, se ven casi igual. La primera usa solo `<div>`:

```html
<!-- fig02_02.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Revisor de servicios (todo con div)</title>
</head>
<body>
  <div class="top">
    <div class="title">Revisor de servicios</div>
    <div class="links">
      <div><a href="#summary">Resumen</a></div>
      <div><a href="#services">Servicios</a></div>
    </div>
  </div>
  <div class="content">
    <div id="summary">
      <div class="subtitle">Resumen</div>
      <div>4 de 5 servicios disponibles.</div>
    </div>
    <div id="services">
      <div class="subtitle">Servicios</div>
      <div>Catálogo, Pagos, Inventario, Notificaciones y Búsqueda.</div>
    </div>
  </div>
  <div class="bottom">Datos de ejemplo escritos a mano.</div>
</body>
</html>
```

```text
Revisor de servicios
Resumen
Servicios
Resumen
4 de 5 servicios disponibles.
Servicios
Catálogo, Pagos, Inventario, Notificaciones y Búsqueda.
Datos de ejemplo escritos a mano.
```

La segunda usa los elementos que dicen qué es cada cosa:

```html
<!-- fig02_03.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Revisor de servicios (con significado)</title>
</head>
<body>
  <header>
    <h1>Revisor de servicios</h1>
    <nav>
      <p>Ir a: <a href="#summary">Resumen</a> o <a href="#services">Servicios</a></p>
    </nav>
  </header>
  <main>
    <section id="summary">
      <h2>Resumen</h2>
      <p>4 de 5 servicios disponibles.</p>
    </section>
    <section id="services">
      <h2>Servicios</h2>
      <p>Catálogo, Pagos, Inventario, Notificaciones y Búsqueda.</p>
    </section>
  </main>
  <footer>
    <p>Datos de ejemplo escritos a mano.</p>
  </footer>
</body>
</html>
```

```text
Revisor de servicios
Ir a: Resumen o Servicios
Resumen
4 de 5 servicios disponibles.
Servicios
Catálogo, Pagos, Inventario, Notificaciones y Búsqueda.
Datos de ejemplo escritos a mano.
```

Para ver la diferencia no hace falta mirar la pantalla. Abre las herramientas del navegador (tecla F12, o clic derecho y «Inspeccionar»), ve a la pestaña de elementos y busca el panel de **accesibilidad**: Chrome lo muestra junto a los estilos, y Firefox lo trae como pestaña propia. Ahí aparece el **[árbol de accesibilidad](https://www.w3.org/TR/html-aam-1.0/)**, que es lo que el navegador entrega a los lectores de pantalla. Lo medí con Chrome 154 sobre las dos páginas. De la primera, estas son las únicas cosas que reconoce: dos enlaces y mucho texto suelto. De la segunda, esto:

```text
RootWebArea "Revisor de servicios (con significado)"
  banner
    heading "Revisor de servicios" (nivel 1)
    navigation
      link "Resumen"
      link "Servicios"
  main
    heading "Resumen" (nivel 2)
    heading "Servicios" (nivel 2)
  contentinfo
```

Cada palabra de la izquierda es un **rol**: lo que la cosa es. `<header>` en el nivel superior del `<body>` se convierte en un `banner`, `<nav>` en `navigation`, `<main>` en `main`, `<footer>` en `contentinfo`. Los lectores de pantalla permiten [saltar directamente](https://www.w3.org/WAI/tutorials/page-structure/) de uno a otro («ve al contenido principal», «lista los encabezados»). En la primera página, quien no ve la pantalla tiene que escuchar todo en orden, desde el principio, cada vez que entra. En la segunda, salta a `main` y empieza a leer.

Eso es **significado** (las pautas lo llaman [información y relaciones](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html)): la página dice, con el nombre del elemento, qué papel juega cada trozo. Tres precisiones evitan los errores más comunes.

La primera: **`<header>` y `<footer>` solo son `banner` y `contentinfo` cuando son de la página entera**, es decir, cuando no están dentro de un `<main>`, `<section>`, `<article>`, `<aside>` o `<nav>`. Da igual que estén dentro de un `<div>`: lo medí en Chrome 154, y un `<header>` dentro de un `<div>` sigue siendo `banner`, mientras que uno dentro de `<main>` deja de serlo. Dentro de un `<section>` o de un `<article>` son el encabezado o el pie de esa parte, no de la página, y el navegador los trata así. (Un **`<article>`** es un bloque con sentido propio, que se entendería suelto en otra página: una noticia, un comentario, la tarjeta de un servicio. Lo usarás en el segundo ejercicio.) La segunda: **un `<section>` sin nombre no es un punto de referencia**. Agrupa contenido de un mismo tema, y la costumbre es que empiece con un encabezado, pero solo se vuelve una región navegable si le das nombre, y eso necesita atributos de ARIA que todavía no vemos. Por eso en el árbol de arriba no aparece. Úsalo para agrupar, no para decorar. La tercera: **una página tiene un solo `<main>`**: es el contenido que cambia de una página a otra, sin el encabezado ni el pie que se repiten.

La segunda página no se ve mejor, y no tiene por qué: el ojo nunca fue el problema. Quien escucha la primera sabe que hay dos enlaces y un montón de texto, y tiene que adivinar el resto. Quien escucha la segunda sabe dónde está en cada momento.

**[Los encabezados son un índice.](https://www.w3.org/WAI/tutorials/page-structure/headings/)** Quien usa un lector de pantalla puede pedir la lista de encabezados de la página y leerla como se lee el índice de un libro; también hay extensiones que lo muestran a cualquiera. Para que ese índice sirva, los niveles significan **jerarquía, no tamaño**: `<h1>` es el título de la página (uno solo, la costumbre sólida aunque el estándar permita más), `<h2>` son sus secciones, `<h3>` las partes de una sección. No se saltan niveles: de un `<h2>` se baja a un `<h3>`, no a un `<h4>`, igual que un libro no pasa del capítulo 1 al apartado 1.1.1. Elegir `<h4>` porque «el h2 se ve muy grande» es el error más común del principiante, y lo arregla el CSS de la próxima lección, no el HTML. El validador de la W3C avisa de los saltos. Lo verás en la sección de errores.

Para que quede claro cómo se ve el índice del panel que vas a construir, así lo leería un lector de pantalla:

```text
nivel 1: Revisor de servicios
  nivel 2: Resumen
  nivel 2: Servicios
```

Corto, y suficiente. Si en el futuro agregas el detalle de un servicio dentro de «Servicios», esa parte sería un nivel 3, y el índice seguiría siendo coherente.

**Lo que ARIA no es.** Probablemente ya viste en algún código atributos como `role="button"` o `aria-label="..."`. Son **ARIA**, un conjunto de atributos que permite añadir significado a un elemento que no lo tiene. Existe para los casos que el HTML no cubre. Su primera regla, en [la guía que mantiene la W3C](https://www.w3.org/TR/using-aria/), dice que **si hay un elemento HTML con el significado y el comportamiento que necesitas, lo uses**. Un `<button>` ya trae el rol de botón, la posibilidad de recibir el foco, la activación con Enter y con la barra espaciadora. Un `<div role="button">` solo trae el rol: lo demás lo tienes que escribir tú, y casi nadie lo escribe completo. La [guía de prácticas de ARIA](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/) lo resume en una frase que conviene recordar: *un rol es una promesa*. Si dices que algo es un botón, te comprometes a que se comporte como uno. Por eso, en este curso, **en esta lección y en la siguiente no escribirás una sola línea de ARIA**: casi todo lo que el panel necesita lo resuelve el HTML nativo, y donde el HTML no alcance te lo diremos en su momento.

#### 2.1.4 Texto con significado: listas, datos y fechas

Dentro de las secciones, el texto también se elige por lo que es. Hay tres formas de agrupar cosas parecidas, y cada una significa algo distinto:

```html
<!-- fig02_04.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Resumen del revisor</title>
</head>
<body>
  <main>
    <h1>Resumen</h1>
    <p>Última revisión:
      <time datetime="2026-10-07T10:30:00-06:00">7 de octubre de 2026, 10:30</time>
    </p>

    <h2>Como lista de datos con nombre</h2>
    <dl>
      <div>
        <dt>Servicios revisados</dt>
        <dd>5</dd>
      </div>
      <div>
        <dt>Disponibles</dt>
        <dd>4 de 5</dd>
      </div>
      <div>
        <dt>Caídos</dt>
        <dd>1</dd>
      </div>
    </dl>

    <h2>Como lista simple</h2>
    <ul>
      <li>Catálogo</li>
      <li>Pagos</li>
      <li>Inventario</li>
    </ul>

    <h2>Como lista con orden</h2>
    <ol>
      <li>Búsqueda: 950 ms</li>
      <li>Pagos: 480 ms</li>
      <li>Notificaciones: 310 ms</li>
    </ol>
  </main>
</body>
</html>
```

```text
Resumen

Última revisión: 7 de octubre de 2026, 10:30

Como lista de datos con nombre
Servicios revisados
5
Disponibles
4 de 5
Caídos
1
Como lista simple
Catálogo
Pagos
Inventario
Como lista con orden
Búsqueda: 950 ms
Pagos: 480 ms
Notificaciones: 310 ms
```

`<ul>` es una **lista sin orden**: elementos que van juntos pero que se podrían intercambiar de lugar. `<ol>` es una **lista con orden**: si cambias un elemento de sitio, cambia el sentido (aquí, del más lento al más rápido). `<dl>` es una **[lista de descripción](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl)**: pares de nombre y valor, como «Disponibles: 4 de 5». Es la forma correcta del resumen del panel, y casi nadie la usa; en su lugar se ven `<div>` con texto en negritas que un lector de pantalla no sabe que son un nombre y su valor. En el `<dl>`, cada nombre es un `<dt>` y cada valor un `<dd>`; el estándar permite agruparlos con un `<div>` cuando quieres darles un gancho para el estilo, como aquí.

Un detalle que parece menor: el elemento [`<time>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time). Dentro lleva el texto que ve la persona («7 de octubre de 2026, 10:30»), pero su atributo `datetime` lleva la misma fecha en el formato que entiende una máquina: año, mes, día, hora y desplazamiento respecto a UTC (`-06:00` es la hora del centro de México, que desde 2022 ya no cambia por horario de verano). El texto puede cambiar de idioma o de estilo y el dato queda intacto. Los buscadores, las extensiones y, más adelante, tu propio JavaScript pueden leerlo sin interpretar «7 de octubre».

Y una pregunta que te harás pronto: ¿por qué no un `<br>` entre las líneas, o espacios para sangrar? Porque `<br>` significa «salto de línea dentro de un mismo párrafo» (un poema, una dirección postal), no «un poco más de espacio». El espacio es apariencia y es trabajo del CSS. Cada vez que uses una marca de contenido para conseguir un efecto visual, estás mintiendo sobre lo que algo es.

### 2.2 Datos con forma de tabla

#### 2.2.1 Cuándo una tabla y cuándo no

Una tabla es la herramienta correcta cuando los datos tienen **dos dimensiones que se cruzan**: filas que son cosas y columnas que son propiedades de esas cosas, y cada celda dice «esta propiedad, de esta cosa». El panel es justo eso: cada servicio (fila) tiene un estado y un tiempo de respuesta (columnas). Si los datos tienen una sola dimensión, es una lista. Si son pares de nombre y valor, es un `<dl>`.

Hubo una época, hace veinte años, en que se usaban tablas para acomodar la página en columnas, porque no había otra herramienta. Hoy esa costumbre es un error, por dos razones: el lector de pantalla anuncia «tabla de tres columnas» sobre algo que no es una tabla, y la maqueta se rompe en un teléfono. La regla que no tiene excepciones es: **tabla para datos, nunca para acomodar**. El acomodo es el tema de la Lección 4.

#### 2.2.2 Las piezas de una tabla accesible

Mira la tabla del panel, con tres de sus cinco servicios para no repetir:

```html
<!-- fig02_05.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Tabla de servicios</title>
</head>
<body>
  <main>
    <h1>Servicios</h1>
    <table>
      <caption>Estado de los servicios en la última revisión</caption>
      <thead>
        <tr>
          <th scope="col">Servicio</th>
          <th scope="col">Estado</th>
          <th scope="col">Tiempo de respuesta</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">Catálogo</th>
          <td>Disponible</td>
          <td>120 ms</td>
        </tr>
        <tr>
          <th scope="row">Pagos</th>
          <td>Disponible</td>
          <td>480 ms</td>
        </tr>
        <tr>
          <th scope="row">Inventario</th>
          <td>Caído</td>
          <td>sin respuesta</td>
        </tr>
      </tbody>
    </table>
  </main>
</body>
</html>
```

```text
Servicios
Estado de los servicios en la última revisión
Servicio	Estado	Tiempo de respuesta
Catálogo	Disponible	120 ms
Pagos	Disponible	480 ms
Inventario	Caído	sin respuesta
```

[Una tabla se arma con piezas anidadas](https://www.w3.org/WAI/tutorials/tables/), y cada una tiene su trabajo:

- **`<table>`** envuelve todo.
- **`<caption>`** es el título de la tabla. Va como primer hijo y es lo que un lector de pantalla anuncia al llegar («Estado de los servicios en la última revisión, tabla de 3 columnas y 3 filas»). Es mejor que un encabezado suelto antes de la tabla, porque queda unido a ella.
- **`<thead>` y `<tbody>`** separan la fila de títulos de las filas de datos. Más adelante, el CSS puede dar estilo al encabezado sin tocar el cuerpo, y el navegador puede repetir el encabezado en cada página al imprimir.
- **`<tr>`** es una fila.
- **`<th>`** es una **celda de encabezado** y **`<td>`** una celda de dato. Esta es la distinción que más importa de toda la tabla.

Y dentro de `<th>`, el atributo `scope` dice a qué apunta el encabezado: `scope="col"` si encabeza una columna, `scope="row"` si encabeza una fila. En la primera fila los `<th>` titulan columnas; en las demás, el primer `<th>` de cada fila es el nombre del servicio y titula su fila.

¿Para qué todo esto? Porque quien usa un lector de pantalla no ve la tabla completa: se mueve celda por celda con las flechas, y en cada celda necesita saber a qué corresponde. Con los `<th>` bien puestos, al llegar a «120 ms» el lector anuncia «Catálogo, Tiempo de respuesta, 120 ms». Sin ellos, solo oye «120 ms» y tiene que acordarse de en qué fila y en qué columna estaba. Si pones `<td>` en lugar de `<th>` en el nombre del servicio, la página se ve igual y la experiencia se rompe, y ningún validador te lo avisa. Esa es la razón por la que esta lección insiste en que el HTML se **comprueba con herramientas de accesibilidad y con el teclado**, no solo mirándolo.

#### 2.2.3 Una celda vacía miente

Mira la última fila: el servicio `Inventario` está caído y por eso no tiene tiempo de respuesta. ¿Qué pones en esa celda? Hay tres tentaciones, y dos están mal. Dejarla vacía deja al lector de pantalla anunciando «en blanco», sin decir si es un olvido o una ausencia. Poner `0 ms` es peor: es un dato falso, porque un servicio que no respondió no respondió en cero milisegundos, y eso arruinaría después el promedio. Lo honesto es decir lo que pasó: «sin respuesta». Es un texto, no un número, y esa decisión (el tiempo de respuesta puede **no existir**) vuelve cuando calcules el promedio en la Lección 6.

### 2.3 Controles: botón, enlace y etiqueta

#### 2.3.1 Un enlace va a un lugar; un botón hace algo

Con la tecla Tab se recorren los elementos con los que el usuario puede interactuar, y la página siguiente es un experimento que vale la pena hacer con las manos:

```html
<!-- fig02_06.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Cuatro cosas que parecen controles</title>
</head>
<body>
  <main>
    <h1>Cuatro cosas que parecen controles</h1>
    <p><a href="#result">Ir al resultado</a></p>
    <p><button type="button">Revisar ahora</button></p>
    <div>Revisar ahora</div>
    <span>Ir al resultado</span>
    <p id="result">Aquí termina la página.</p>
  </main>
</body>
</html>
```

```text
Cuatro cosas que parecen controles
Ir al resultado
Revisar ahora
Revisar ahora
Ir al resultado
Aquí termina la página.
```

Ábrela y presiona Tab repetidamente. Comprobé este experimento con Chrome 154: **la tecla se detiene solo dos veces**, en el enlace y en el botón, y después sale de la página. El `<div>` con el texto «Revisar ahora» y el `<span>` con «Ir al resultado» **no reciben el foco**. Para el teclado, no existen. Con el CSS de la Lección 3 podrías hacer que se vieran idénticos a un botón y a un enlace, y seguirían inalcanzables sin mouse, y para el lector de pantalla seguirían siendo texto.

Mira qué recibes gratis con cada elemento verdadero:

- **`<a href="...">`** es un **enlace**: promete llevarte a otro lugar (otra página, o otra parte de la misma, como `#result`). Gratis trae foco con Tab, activación con Enter, clic derecho para copiar la dirección, clic con la rueda para abrirlo en otra pestaña y la posibilidad de recordar qué enlaces visitaste. Sin `href` el `<a>` no es un enlace: es un marcador sin destino.
- **`<button>`** es un **botón**: promete hacer algo en esta página. Trae foco, activación con Enter y con la barra espaciadora, y el estado de «deshabilitado» con el atributo `disabled`.

La regla que resume los dos: **si la acción lleva a otra dirección, es un enlace; si cambia algo aquí mismo, es un botón.** «Ir a Servicios» es un enlace. «Revisar ahora» es un botón. Equivocarte produce rarezas que ya habrás visto: un «botón» que es un enlace y no se activa con la barra espaciadora, o un «enlace» que es un botón y no se puede abrir en otra pestaña.

Una nota sobre `type="button"`. Cuando un `<button>` está dentro de un formulario (lo verás en la Lección 10) y no declara tipo, [el estándar](https://html.spec.whatwg.org/multipage/forms.html) le asigna `submit`: envía el formulario y recarga la página. Es una de las sorpresas más frecuentes. Declarar `type="button"` en todo botón que no envía nada te la ahorra. Hoy el botón «Revisar ahora» no hace nada, porque la página no tiene JavaScript todavía. En la Lección 8 volverá a pedir los datos del panel, y para eso el HTML que escribes hoy solo necesitará un `id` más.

#### 2.3.2 Un campo sin etiqueta es un campo sin nombre

El último control de hoy es el campo de búsqueda. La regla es sencilla y se rompe siempre: **cada campo necesita una etiqueta visible y asociada**. «Asociada» quiere decir que el navegador sabe que ese texto pertenece a ese campo. Hay dos maneras de asociarla y las dos están en la página siguiente:

```html
<!-- fig02_07.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Etiquetas y grupos</title>
</head>
<body>
  <main>
    <h1>Etiquetas y grupos</h1>

    <p>
      <label for="search">Buscar servicio</label>
      <input type="search" id="search" name="search">
    </p>

    <p>
      <label>
        Nombre del servicio
        <input type="text" name="name">
      </label>
    </p>

    <fieldset>
      <legend>Mostrar</legend>
      <label><input type="radio" name="filter" value="all" checked> Todos</label>
      <label><input type="radio" name="filter" value="available"> Disponibles</label>
      <label><input type="radio" name="filter" value="down"> Caídos</label>
    </fieldset>
  </main>
</body>
</html>
```

```text
Etiquetas y grupos

Buscar servicio 

Nombre del servicio 

Mostrar
 Todos  Disponibles  Caídos
```

La primera es la **[asociación explícita](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label)**: el `<label>` lleva `for="search"` y el campo lleva `id="search"`; el valor de `for` es el `id` del campo, y esa coincidencia es la unión. La segunda es la **asociación implícita**: el campo va dentro del `<label>` y no hace falta ningún `id`. Las dos funcionan; la explícita es más flexible porque la etiqueta y el campo pueden estar en sitios distintos del documento, y la implícita es más corta. Para comprobar que la unión es real, haz clic sobre el texto «Buscar servicio»: el cursor salta al campo. Lo comprobé automatizando ese clic en Chrome, y el campo recibe el foco. Esa es una ganancia visible: un blanco de clic mucho más grande para quien tiene mala puntería, o toca con el dedo.

Detrás ocurre algo que conviene nombrar. Todo elemento interactivo tiene un **[nombre accesible](https://developer.mozilla.org/en-US/docs/Glossary/Accessible_name)**: el texto con el que un lector de pantalla lo anuncia. El navegador lo calcula con reglas fijas, y para un campo, la etiqueta asociada es la fuente principal. En el árbol de accesibilidad de Chrome, el campo de arriba aparece como `searchbox "Buscar servicio"`: un rol y un nombre. Si no hubiera etiqueta (ni otra pista de la que sacar un nombre), aparecería `searchbox` a secas: un cuadro sin nombre. Y una herramienta de auditoría, como las que verás más adelante, lo marca con el mensaje *«Form elements must have labels»*.

**El `placeholder` no es una etiqueta.** Es esa pista gris que aparece dentro del campo y desaparece al escribir. La tentación de usarlo como etiqueta es fuerte porque ahorra espacio, pero falla por tres lados: desaparece justo cuando necesitas recordar qué tenías que escribir, su color gris suele tener poco contraste con el fondo, y no es una etiqueta para el navegador: no crea ninguna asociación y no se puede hacer clic en él para llegar al campo. El navegador solo lo toma como nombre de reserva cuando no hay etiqueta; lo medí en Chrome 154, y un campo de búsqueda sin `<label>` y con `placeholder="Buscar servicio"` se anuncia como `searchbox "Buscar servicio"`. Es un remiendo del navegador, no una etiqueta que la persona pueda ver. Úsalo, si acaso, para un ejemplo de formato (`ej. catalogo`), nunca como único nombre.

La tercera pieza es el **grupo**. Tres botones de radio («Todos», «Disponibles», «Caídos») forman una sola pregunta: *¿qué quieres mostrar?* El `<fieldset>` agrupa los controles que van juntos y el `<legend>` es el título del grupo, que el lector de pantalla anuncia antes de cada opción. Los radios que comparten el mismo `name` ya se comportan como un grupo para el navegador: solo uno puede estar marcado. Y por eso, en el experimento de la tecla Tab, **el grupo entero cuenta como una sola parada**; se entra con Tab y se cambia de opción con las flechas. Lo medí en el panel completo: la tecla Tab se detiene cinco veces (dos enlaces, el campo de búsqueda, el grupo de radios y el botón).

Fíjate en una decisión de diseño: el filtro es un grupo de radios y no tres botones. Es una elección entre opciones excluyentes, que es justo lo que significa un botón de radio. Quien lee el código entiende la intención sin un comentario.

#### 2.3.3 Cuándo sí usar `div` y `span`

Después de tanto elogio al significado, una aclaración: `<div>` y `<span>` no son malos. Son los elementos que **no significan nada**, y eso es útil cuando necesitas agrupar algo solo para darle estilo o para encontrarlo después con JavaScript. `<div>` agrupa en bloque y `<span>` agrupa dentro de una línea. La regla es de orden: **primero busca el elemento con significado; solo si no existe, usa `div` o `span`**. En la mayoría de las páginas que ves, ocurre al revés.

Verás un `<span class="status status-available">` dentro de la tabla del panel. Sirve para esto: el estado «Disponible» no es otra cosa que texto, pero necesitamos un lugar donde el CSS de la próxima lección ponga una insignia de color. Es el atributo `class` que conociste en 2.1.1: un nombre para que el CSS le apunte, que no cambia lo que el elemento significa.

## Ejemplo resuelto: el panel completo

Ya conoces todas las piezas. Esta es la página que las junta, el esqueleto del `revisor`, con cinco servicios de ejemplo. Guárdala como `index.html` en tu carpeta `revisor`, en lugar del `index.html` de la Lección 1: desde hoy, ese archivo es el panel, y las lecciones siguientes lo van a hacer crecer. Léela de arriba abajo con el mapa en la cabeza: qué es cada cosa, por qué ese elemento y no otro.

```html
<!-- fig02_08.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Revisor de servicios</title>
  <link rel="icon" href="data:,">
</head>
<body>
  <header>
    <h1>Revisor de servicios</h1>
    <p>Última revisión:
      <time datetime="2026-10-07T10:30:00-06:00">7 de octubre de 2026, 10:30</time>
    </p>
    <nav>
      <p>Ir a: <a href="#summary">Resumen</a> o <a href="#services">Servicios</a></p>
    </nav>
  </header>

  <main>
    <section id="summary">
      <h2>Resumen</h2>
      <dl>
        <div>
          <dt>Servicios revisados</dt>
          <dd>5</dd>
        </div>
        <div>
          <dt>Disponibles</dt>
          <dd>4 de 5</dd>
        </div>
        <div>
          <dt>Caídos</dt>
          <dd>1</dd>
        </div>
        <div>
          <dt>Respuesta promedio</dt>
          <dd>465 ms</dd>
        </div>
      </dl>
    </section>

    <section id="services">
      <h2>Servicios</h2>

      <p>
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

      <table>
        <caption>Estado de los servicios en la última revisión</caption>
        <thead>
          <tr>
            <th scope="col">Servicio</th>
            <th scope="col">Estado</th>
            <th scope="col">Tiempo de respuesta</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Catálogo</th>
            <td><span class="status status-available">Disponible</span></td>
            <td>120 ms</td>
          </tr>
          <tr>
            <th scope="row">Pagos</th>
            <td><span class="status status-available">Disponible</span></td>
            <td>480 ms</td>
          </tr>
          <tr>
            <th scope="row">Inventario</th>
            <td><span class="status status-down">Caído</span></td>
            <td>sin respuesta</td>
          </tr>
          <tr>
            <th scope="row">Notificaciones</th>
            <td><span class="status status-available">Disponible</span></td>
            <td>310 ms</td>
          </tr>
          <tr>
            <th scope="row">Búsqueda</th>
            <td><span class="status status-available">Disponible</span></td>
            <td>950 ms</td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>

  <footer>
    <p>Datos de ejemplo escritos a mano.</p>
  </footer>
</body>
</html>
```

```text
Revisor de servicios

Última revisión: 7 de octubre de 2026, 10:30

Ir a: Resumen o Servicios

Resumen
Servicios revisados
5
Disponibles
4 de 5
Caídos
1
Respuesta promedio
465 ms
Servicios

Buscar servicio 

Mostrar
 Todos  Disponibles  Caídos

Revisar ahora

Estado de los servicios en la última revisión
Servicio	Estado	Tiempo de respuesta
Catálogo	Disponible	120 ms
Pagos	Disponible	480 ms
Inventario	Caído	sin respuesta
Notificaciones	Disponible	310 ms
Búsqueda	Disponible	950 ms

Datos de ejemplo escritos a mano.
```

Recorre las decisiones, porque ahí está lo que se aprende:

- **El icono vacío** (`<link rel="icon" href="data:,">`) es la línea del Ejercicio 2 de la Lección 1: le dice al navegador que la página no tiene icono, para que no pida `/favicon.ico` y no ensucie la consola con un 404. Es un atajo, y tiene un costo que verás en la Lección 11, cuando el panel se publique con una política de seguridad y este icono se cambie por uno de verdad.
- **El encabezado de la página** (`<header>`) agrupa el título, la fecha de la última revisión y la navegación. Por colgar del `<body>` es el `banner`. El título es el único `<h1>`.
- **La navegación** (`<nav>`) tiene dos enlaces, porque llevan a otras partes de la página: eso es lo que hace un enlace. Están escritos dentro de una frase («Ir a: … o …»); las pautas de accesibilidad piden que los objetivos táctiles tengan al menos 24 × 24 píxeles o espacio suficiente a su alrededor ([WCAG 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)), y exceptúan expresamente los enlaces que van dentro de una frase, porque su tamaño lo impone la línea de texto. Escribirlos en una frase no los hace más grandes: los separa con palabras y los deja dentro de esa excepción, sin una línea de CSS. Dos enlaces sueltos, uno junto al otro, no tendrían ninguna de las dos cosas. En la Lección 4 verás un menú de verdad.
- **El resumen** es un `<dl>`: nombres y valores. Fíjate en el cálculo, porque se vuelve a usar: son 5 servicios, 4 disponibles y 1 caído; la respuesta promedio de 465 ms es el promedio de los **cuatro que respondieron** (120 + 480 + 310 + 950 = 1,860; 1,860 / 4 = 465). El servicio caído no cuenta como cero.
- **Los controles** son los tres que conoces: un campo con etiqueta, un grupo de radios con título y un botón de tipo explícito. Ninguno está dentro de un formulario todavía; el formulario, con envío y validación, es el tema de la Lección 10.
- **La tabla** lleva título, encabezados de columna y de fila, y una celda que dice la verdad sobre el servicio caído.
- **El pie** (`<footer>`) dice de dónde salen los datos: de ejemplo y escritos a mano.

Ahora haz lo que ningún lector de este código hace: **úsala como la usarían las otras tres personas del principio**. Presiona Tab desde el principio y cuenta las paradas: deberían ser cinco, y el foco debería ir en orden de arriba abajo. Abre el panel de accesibilidad de las herramientas del navegador y comprueba que ves `banner`, `main` y `contentinfo`. Pasa la página por el validador oficial, como se explica en la sección siguiente. Si las tres pruebas salen bien, tu HTML hace lo que dice.

## El error que vas a ver

Los errores de HTML casi nunca los muestra el navegador. Los muestra un validador. El de la W3C se llama [*Nu Html Checker*](https://validator.w3.org/nu/) y vive en `https://validator.w3.org/nu/`; ahí puedes subir un archivo o pegar el código en una caja de texto. A propósito vamos a romper la página para aprender a leer su respuesta. Esta tiene seis defectos:

```html
<!-- fig02_09.html -->
<html>
<head>
  <title>Revisor roto</title>
</head>
<body>
  <h1>Revisor de servicios</h1>
  <h4>Servicios</h4>
  <input type="search" placeholder="Buscar servicio">
  <a href="#result"><button>Revisar ahora</button></a>
  <img src="logo.png">
  <p id="result">
    <div>4 de 5 disponibles</div>
  </p>
</body>
</html>
```

Al pegarla en el validador, esto responde (copiado del resultado real):

```text
Error: Start tag seen without seeing a doctype first. Expected “<!DOCTYPE html>”.
From line 1, column 23; to line 2, column 6
Error: The element “button” must not appear as a descendant of the “a” element.
From line 10, column 21; to line 10, column 28
Error: An “img” element must have an “alt” attribute, except under certain conditions. For details, consult guidance on providing text alternatives for images.
From line 11, column 3; to line 11, column 22
Error: No “p” element in scope but a “p” end tag seen.
From line 14, column 3; to line 14, column 6
Warning: Consider adding a “lang” attribute to the “html” start tag to declare the language of this document.
From line 1, column 23; to line 2, column 6
Error: The heading “h4” (with computed level 4) follows the heading “h1” (with computed level 1), skipping 2 heading levels.
From line 8, column 3; to line 8, column 6
There were errors.
```

Está en inglés, y es el inglés de la documentación que leerás toda tu carrera, así que vale la pena aprender a leerlo. Cada mensaje trae la línea y la columna donde ocurre. Uno por uno:

1. **Falta el `DOCTYPE`.** Ya sabes por qué importa: sin él el navegador entra en modo de compatibilidad. Se arregla escribiendo `<!DOCTYPE html>` como primera línea.
2. **Un `<button>` dentro de un `<a>`.** Es un error común y tiene una razón: un elemento interactivo no puede vivir dentro de otro. ¿Qué se activa al hacer clic, el botón o el enlace? Los navegadores no se ponen de acuerdo. Se elige uno: si el control lleva a otro lugar, un enlace; si hace algo aquí, un botón.
3. **Una `<img>` sin `alt`.** El atributo [`alt`](https://www.w3.org/WAI/tutorials/images/decision-tree/) es el texto que lee el lector de pantalla en lugar de la imagen. Si la imagen aporta información, el `alt` la describe; si es solo adorno, se pone vacío (`alt=""`) para que se ignore. Nunca se omite. El panel no tiene imágenes, y aun así este es el error más frecuente de la web, por eso lo incluyo.
4. **Un `</p>` sin su `<p>`.** Es la consecuencia de una regla del HTML: un `<p>` solo puede contener texto y elementos de línea, no un `<div>`. El navegador cierra el párrafo antes del `<div>` por su cuenta, y la etiqueta de cierre que escribiste queda huérfana. Por eso el mensaje dice «no hay ningún p abierto»: lo cerró el navegador, sin avisarte.
5. **Falta `lang`.** Aparece como advertencia, no como error, pero ya sabes lo que cuesta.
6. **El `<h4>` después del `<h1>`.** El validador hizo la cuenta: saltó dos niveles. Lo corriges con `<h2>`.

Fíjate en lo que **no** dijo. El `<input>` sin etiqueta, con solo un `placeholder`, pasó sin aviso: el validador revisa que la sintaxis sea legal, no que la página sea usable. Eso lo detectan otras herramientas, las de auditoría de accesibilidad. El navegador trae una en sus herramientas de desarrollo (en Chrome se llama Lighthouse), y casi todas se apoyan en un motor llamado axe, que sobre esta misma página responde, entre otras cosas, con estos mensajes reales:

```text
heading-order: Heading levels should only increase by one
html-has-lang: <html> element must have a lang attribute
image-alt: Images must have alternative text
```

Y sobre una variante del panel con el `<label>` quitado, `label: Form elements must have labels`. **Los dos tipos de herramienta son complementarios**: el validador atrapa lo que el estándar prohíbe y la auditoría atrapa lo que deja a alguien sin poder usar la página. Hay un tercer tipo de error que ninguna de las dos atrapa: cambiar un `<th>` por un `<td>` no produce mensaje alguno, aunque rompa el anuncio de la tabla. Para ese, solo sirve probar con el teclado y con el árbol de accesibilidad.

## Lo que se hace mal

**1. Construir controles con `div` o `span`.** El caso de la página de las cuatro cosas: un `<div>` que dice «Revisar ahora». *Costo:* nadie con teclado lo alcanza, ningún lector de pantalla lo anuncia como botón, y reconstruir el foco, la barra espaciadora y el estado deshabilitado a mano es trabajo que el navegador ya hizo. Arreglo: un `<button type="button">`.

**2. Elegir el encabezado por su tamaño.** Un `<h4>` porque el `<h2>` «se ve grande», o un `<p>` en negritas porque «ya es un título». *Costo:* el índice de encabezados queda lleno de huecos o vacío, y quien navega por encabezados no encuentra nada. Arreglo: elige el nivel por jerarquía; el tamaño es del CSS.

**3. Usar tablas para acomodar la página.** *Costo:* el lector de pantalla anuncia tablas donde no hay datos, la página no se adapta a un teléfono y el código es difícil de leer. Arreglo: tabla solo para datos con filas y columnas que se cruzan.

**4. Todas las celdas como `<td>`.** El caso más difícil de ver, porque la página se ve perfecta. *Costo:* el lector de pantalla anuncia «120 ms» sin decir de quién ni de qué. Arreglo: `<th scope="col">` en los títulos de columna y `<th scope="row">` en el nombre de la fila.

**5. El `placeholder` como única etiqueta.** *Costo:* la pista desaparece al escribir, suele tener poco contraste y el campo depende de un nombre de reserva que la persona deja de ver en cuanto escribe. Arreglo: un `<label>` visible, asociado con `for` e `id` o envolviendo al campo.

**6. Un enlace que hace de botón, o un botón que hace de enlace.** Un `<a href="#">` que dispara una acción, o un `<button>` que navega. *Costo:* se rompen el clic con la rueda, la barra espaciadora, el copiado de la dirección, el historial. Arreglo: «va a un lugar» es enlace, «hace algo» es botón.

**7. `<br>` y `&nbsp;` para dar espacio.** *Costo:* un lector de pantalla puede leer «línea en blanco» o saltos que no significan nada, y el espacio queda atado al texto. Arreglo: el espacio es del CSS.

**8. No poner `alt` a una imagen.** *Costo:* la imagen es invisible para quien no la ve. Arreglo: `alt` que diga qué función cumple la imagen, o `alt=""` si es puro adorno.

## Ejercicios

### Ejercicio 1 — Cuenta las paradas

Con el panel completo abierto en tu servidor local, suelta el mouse y usa solo el teclado. Presiona Tab desde el principio y apunta, en orden, en qué se detiene el foco cada vez. Después cambia `<button type="button">` por `<div>` en tu copia, recarga y vuelve a contar. ¿Cuántas paradas menos tienes? ¿Qué dejó de ser posible?

### Ejercicio 2 — De `div` a significado

Este fragmento muestra una «tarjeta» de un servicio escrita solo con `div` y `span`. Reescríbelo con los elementos que dicen qué es cada cosa, sin cambiar el texto que se lee:

```html
<div class="card">
  <div class="card-title">Pagos</div>
  <div class="card-row"><span>Estado</span> <span>Disponible</span></div>
  <div class="card-row"><span>Respuesta</span> <span>480 ms</span></div>
  <div class="card-action" onclick="check()">Revisar este servicio</div>
</div>
```

Una pista: son dos pares de nombre y valor, una acción y un título que merece ser un encabezado.

### Ejercicio 3 — Agrega un servicio y rehaz las cuentas

Agrega al panel un sexto servicio, `Correo`, disponible y con 210 ms de respuesta. Después actualiza el resumen a mano: cuántos servicios hay, cuántos están disponibles, cuántos caídos y cuál es la respuesta promedio. Recuerda de qué servicios se calcula el promedio.

### Ejercicio 4 — Rompe tres cosas y mira cuáles se notan

En una copia del panel haz tres cambios: quita el `<label>` del campo de búsqueda, cambia el segundo `<h2>` por un `<h4>` y cambia el `<th scope="row">Pagos</th>` por `<td>Pagos</td>`. Pasa la copia por el validador oficial. ¿Cuáles de los tres defectos señala? Para los que no, ¿cómo los descubrirías?

## Soluciones

### Solución 1

Con el botón real, el foco se detiene cinco veces, en este orden: el enlace «Resumen», el enlace «Servicios», el campo de búsqueda, el grupo de radios (una sola parada, y dentro de él se cambia con las flechas) y el botón «Revisar ahora». Después el foco sale de la página hacia la barra del navegador. Con el `<div>` quedan **cuatro** paradas, una menos: el botón dejó de recibir el foco, así que **ya no se puede activar sin mouse**. Esa es la diferencia entre un control y algo que parece un control.

### Solución 2

El título es un encabezado (`<h3>`, porque cuelga de la sección «Servicios», que es de nivel 2), los dos pares de nombre y valor son una lista de descripción, y la acción es un botón. Como el `onclick` es JavaScript dentro del HTML y todavía no lo usamos, se quita: quién escucha el clic se verá en la Lección 7.

```html
<article>
  <h3>Pagos</h3>
  <dl>
    <div>
      <dt>Estado</dt>
      <dd>Disponible</dd>
    </div>
    <div>
      <dt>Respuesta</dt>
      <dd>480 ms</dd>
    </div>
  </dl>
  <button type="button">Revisar este servicio</button>
</article>
```

Se usó `<article>` porque la tarjeta es una unidad con sentido propio, que se entendería suelta en otra página; un `<div>` también sería válido si no quieres declarar esa idea. Lo que no es válido es dejar el título como un `<div>` o la acción como un `<div>`.

### Solución 3

Con el sexto servicio, el resumen queda así: **6** servicios revisados, **5 de 6** disponibles, **1** caído. La respuesta promedio se calcula con los cinco que respondieron: 120 + 480 + 310 + 950 + 210 = 2,070, y 2,070 / 5 = **414 ms**. El servicio caído sigue sin entrar en el promedio, porque no tiene tiempo de respuesta. La fila nueva respeta la estructura de las demás:

```html
<tr>
  <th scope="row">Correo</th>
  <td><span class="status status-available">Disponible</span></td>
  <td>210 ms</td>
</tr>
```

Si calculaste 345 ms (2,070 / 6), contaste el caído como si hubiera respondido en cero, que es exactamente el error que la sección 2.2.3 describe.

### Solución 4

El validador señala **solo uno**: el `<h4>` después del `<h2>`, con el mensaje *«The heading “h4” (with computed level 4) follows the heading “h2” (with computed level 2), skipping 1 heading level»* (lo comprobé con una copia real del panel). El `<label>` faltante no lo señala, porque un campo sin etiqueta es HTML legal; lo descubrirías con una herramienta de auditoría, que responde *«Form elements must have labels»*, o con el árbol de accesibilidad, donde el campo aparece sin nombre. El `<td>` en lugar del `<th>` no lo señala ninguna de las dos herramientas: se descubre con el árbol de accesibilidad (el nombre de la fila ya no se asocia a las celdas) o, mejor, escuchando la tabla con un lector de pantalla. Moraleja: pasar el validador es necesario y no es suficiente.

## Cómo sé que lo logré

- [ ] El panel abre en `http://localhost:8000/` servido con `python3 -m http.server 8000 --bind 127.0.0.1`, sin errores en la pestaña de consola de las herramientas del navegador.
- [ ] La tecla Tab se detiene exactamente cinco veces dentro de la página (dos enlaces, el campo, el grupo de radios y el botón), en orden de arriba abajo.
- [ ] El panel de accesibilidad de las herramientas del navegador muestra `banner`, `navigation`, `main` y `contentinfo`, y los encabezados salen en el orden 1, 2, 2.
- [ ] Al pegar la página en `https://validator.w3.org/nu/` la respuesta es *«Document checking completed. No errors or warnings to show.»*
- [ ] Al hacer clic sobre el texto «Buscar servicio» el cursor salta al campo de búsqueda.
- [ ] Puedes explicar con tus palabras por qué un `<div>` que dice «Revisar ahora» no es un botón, y por qué `120 ms` sin su `<th>` es un dato huérfano.

## Para leer más

- (en inglés, como casi toda la documentación oficial) [Estándar HTML del WHATWG, «Sections»](https://html.spec.whatwg.org/multipage/sections.html) — la fuente que decide qué significan `<header>`, `<nav>`, `<main>`, `<section>` y `<footer>`, y cuándo cada uno es un punto de referencia. Consultado el 7 de octubre de 2026.
- [MDN, «Estructurar contenido con HTML»](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content) — el módulo de aprendizaje de Mozilla que sigue el mismo orden que esta lección, con retos prácticos de tablas y de estructura. Consultado el 7 de octubre de 2026.
- [W3C WAI, tutorial de tablas](https://www.w3.org/WAI/tutorials/tables/) — cómo se construyen tablas que un lector de pantalla puede recorrer, con ejemplos de encabezados simples y complejos. Consultado el 7 de octubre de 2026.
- [W3C WAI, «Notas sobre el uso de ARIA en HTML»](https://www.w3.org/TR/using-aria/) — la guía de las reglas de ARIA, empezando por «si existe un elemento HTML nativo, úsalo». Consultado el 7 de octubre de 2026.
