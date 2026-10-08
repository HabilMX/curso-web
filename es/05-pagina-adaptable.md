# Lección 5 — Una página que sirve en cualquier pantalla

**Tiempo:** dos sesiones de unos 90 min. Un reparto que funciona: la primera, «El porqué antes del cómo» (el 320, la etiqueta `viewport` y cómo medir) y las columnas que se cuentan solas (5.1); la segunda, la tabla que se desplaza, `@media`, `@container`, el panel terminado, llevarlo a tu `revisor` (5.2.7) y los ejercicios. Cada sesión termina en una página que puedes abrir y medir.

**Qué construyes:** el panel que sirve en un teléfono

**Qué aprendes:** qué hace la etiqueta `viewport`; adaptable con `minmax()` y `auto-fit` antes de `@media`; la tabla que se desplaza en su caja; `@media` para la página y `@container` para la caja; de 320 a 1440 px sin desbordamiento

**De dónde vienes.** Traes el panel de la [Lección 4](04-flexbox-grid.md), acomodado con Flexbox y Grid: el encabezado en una fila, las cuatro cifras del resumen en cuatro columnas y la barra de controles en una línea. En una pantalla ancha se ve bien; en un teléfono, todavía no. Todas las páginas de esta lección están en [`programas/05-pagina-adaptable/`](https://github.com/HabilMX/curso-web/tree/main/programas/05-pagina-adaptable) del [repositorio del curso](https://github.com/HabilMX/curso-web), y el punto de partida es `fig05_01.html`, que es el panel con que terminó la Lección 4 tal cual. Su hoja, `fig05_01/styles.css`, es una **copia** de `fig04_06/styles.css`, la hoja de la lección anterior: está repetida a propósito, para que esta carpeta funcione sola, sin depender de la carpeta de otra lección. Las páginas de prueba de esta lección la cargan con `<link rel="stylesheet" href="fig05_01/styles.css">`, una ruta *relativa* que el navegador busca en la carpeta `fig05_01` junto a la página; si copias solo un `.html`, sin esa carpeta, la página se verá sin estilos y la pestaña Red te mostrará el `404` de la hoja. El panel terminado, `fig05_06.html`, usa su propia hoja, `fig05_06/styles.css`. Si tu `revisor` no quedó igual al terminar la Lección 4, no importa: tienes completos `fig05_01.html` y su hoja al final de 5.2.6. Trabajas otra vez con `index.html` y `css/styles.css` de tu carpeta `revisor`, y el servidor local sigue siendo `python3 -m http.server 8000 --bind 127.0.0.1`.

**Qué no hace esta lección.** No toca JavaScript, salvo una línea que vas a pegar en la consola para medir. Las cifras del resumen siguen escritas a mano; las contará un programa en la Lección 6 y las dibujará en la tabla la Lección 7. Hoy, como en la lección anterior, solo cambia *dónde* va cada cosa y *cuánto mide*.

## Al terminar vas a poder

- Explicar qué le dice a un teléfono la etiqueta `viewport` y qué pasa sin ella: la página se dibuja en una ventana virtual más ancha que la pantalla (980 px en Chrome) y se encoge.
- Comprobar con una medición, no a ojo, que una página no desborda entre 320 y 1440 px, y encontrar al culpable cuando sí desborda.
- Declarar columnas que se cuentan solas con `repeat(auto-fit, minmax(min(100%, 11rem), 1fr))` y explicar qué hace cada pieza de esa línea.
- Explicar por qué `1fr` no basta en una columna que contendrá algo ancho, y escribir `minmax(0, 1fr)` en su lugar.
- Dejar que una tabla ancha se desplace dentro de su propia caja sin perder su semántica y sin dejar fuera a quien usa el teclado.
- Decidir cuándo hace falta una consulta de medios (`@media`), cuándo una de contenedor (`@container`) y cuándo ninguna.
- Llevar el panel adaptable a tu `revisor`, medirlo en cinco anchos y guardarlo en Git.

## El porqué antes del cómo

Son las dos de la madrugada y a quien está de guardia le suena el teléfono. Abre el panel para ver qué servicio se cayó. No tiene computadora a la mano: tiene una pantalla de mano y un pulgar. Lo que necesita saber cabe en una frase («Inventario no responde»), pero la página, tal como la dejó la lección anterior, le hace trabajar de más.

Mídelo en vez de suponerlo. Abre `fig05_01.html` en tu servidor local, abre las herramientas del navegador con `F12` y activa el modo de pantalla adaptable (en Chrome y en Edge es el icono de teléfono y tableta; en Firefox es `Ctrl`+`Shift`+`M`). Pon el ancho en 320 píxeles. Verás una barra de desplazamiento horizontal: la página es más ancha que la pantalla, y quien la usa tiene que arrastrar hacia los lados para ver una tabla de tres columnas. Lo medí con Chrome 154, de forma automatizada y sin ventana, y dio esto: a 320 px la página mide **414 px de ancho**, la misma cifra con que cerraron la Lección 3 y la Lección 4; a 375 px también mide 414; a 768 px, 1024 px y 1440 px mide justo lo que la ventana, sin sobrar nada. Dos elementos se pasan del borde. El primero es la tabla, que con sus tres columnas y el relleno de cada celda llega hasta los 414 px. El segundo es nuevo, y lo trajo la lección anterior: el resumen, cuyas cuatro columnas fijas no caben en un teléfono y llegan hasta los 369 px. Lo demás —el encabezado, el campo de búsqueda, los radios, el botón— ya cabe, porque bajan de renglón con `flex-wrap` y porque ninguna hoja les puso un ancho fijo. Es una virtud que conviene no perder.

Y en el extremo contrario queda una deuda menor: en una pantalla de 1440 px el contenido sigue siendo una columna de 60 rem (960 px) en el centro, con dos franjas vacías a los lados, y la tabla queda debajo del resumen, cuando los dos cabrían lado a lado.

Las dos cosas tienen la misma causa. **El panel acomoda, pero no se adapta.** Las cuatro columnas del resumen son cuatro en cualquier ancho, porque así se escribieron; la tabla mide lo que mide su contenido, porque nadie le dijo otra cosa; y la página es una sola columna aunque sobre espacio. Esta lección es la que le enseña a decidir según el espacio que tiene.

### Qué significa «320 píxeles» y por qué es el número

Un **píxel CSS** no es un punto físico de la pantalla. Es una unidad que el navegador mantiene constante a propósito, para que una caja de 100 px de ancho se vea del mismo tamaño aproximado en una pantalla de alta densidad que en una común. Un teléfono con una pantalla de 1,080 puntos físicos de ancho suele declararse a sí mismo como una ventana de unos 360 a 430 píxeles CSS (la cifra exacta varía por modelo); cada píxel CSS se pinta con varios puntos físicos. Cuando una hoja de estilos dice `width: 320px`, habla en esta unidad.

El 320 sale de una regla pública: [el criterio de éxito 1.4.10 («Reflujo»)](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) de las Pautas de Accesibilidad para el Contenido Web 2.2, que pide que el contenido pueda presentarse «sin pérdida de información o funcionalidad, y sin necesidad de desplazarse en dos dimensiones» en una ventana equivalente a 320 píxeles CSS de ancho. La razón es el aumento: ese ancho equivale a abrir la página en una pantalla de 1,280 px y acercarla al 400 %. [Una persona con baja visión que agranda el texto](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html) hasta que se lee con comodidad está, sin saberlo, convirtiendo su monitor en una pantalla de 320 px. Si la página desborda ahí, esa persona tiene que arrastrar la página de lado a lado para leer cada renglón. El 320 no es una manía de teléfonos viejos: es el piso de todos.

La misma norma trae una excepción que conviene conocer desde ahora, porque la vas a usar con criterio: las partes del contenido que **requieren un diseño en dos dimensiones para su uso o significado** —mapas, video, y también tablas de datos— pueden desplazarse. Pero la excepción cubre solo esa parte: el título de la tabla y lo que la rodea sí tienen que reacomodarse. Más abajo, en el concepto 5.2, la tabla de servicios se desplazará *dentro de su caja* y todo lo demás se acomodará solo.


### La etiqueta que ya escribiste sin saber qué hacía

En la Lección 2 pusiste en el `<head>` la línea `<meta name="viewport" content="width=device-width, initial-scale=1">` porque «así se hace». Ahora se entiende. Los teléfonos de los primeros años de la web móvil se encontraron con páginas hechas para computadoras de escritorio y, para no mostrarlas rotas, inventaron un truco: **dibujan la página en una ventana virtual más ancha que la pantalla —típicamente de 980 píxeles— y después encogen el resultado** para que quepa. Ese comportamiento sigue siendo el predeterminado para una página que no declara nada. [MDN lo documenta](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Viewport_meta_element) y usa 980 px como ejemplo, pero ninguna norma fija esa cifra: cada navegador elige la suya. Chrome usa 980, como vas a medir enseguida; otro navegador u otro teléfono puede darte un número distinto, y lo que no cambia es el efecto: una ventana más ancha que la pantalla, y todo diminuto.

La etiqueta `viewport` le pide al navegador que use el ancho real del dispositivo. La prueba está en `fig05_02.html`, una página que a propósito no la lleva. La medí con Chrome 154 en un teléfono emulado de 390 px de ancho: sin la etiqueta, `window.innerWidth` vale **980**; con ella (como en `fig05_03.html`, que verás en 5.1.2) vale **390**. Todo lo que aprendas en esta lección depende de eso: una regla como «a partir de 64 em de ancho» no significa nada si el navegador cree que la ventana mide 980 px cuando mide 390.


Esta es la página de la prueba, completa:

```html
<!-- fig05_02.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Página sin la etiqueta de ventana</title>
  <link rel="stylesheet" href="fig05_01/styles.css">
</head>
<body>
  <h1>Revisor de servicios</h1>
  <p>Esta página se ve bien en una computadora y diminuta en un teléfono.</p>
</body>
</html>
```

Una advertencia que MDN repite y que la norma de accesibilidad respalda: **no le quites al lector la posibilidad de acercar la página**. Hay tutoriales que agregan `user-scalable=no` o `maximum-scale=1` para evitar que el teléfono haga zoom al tocar un campo. Quien tiene baja visión usa ese zoom para leer. Esa línea es la que se queda sola, tal como está.

### Cómo vas a comprobar

Hay dos formas de verificar que una página no se desborda, y vas a usar las dos durante toda la lección.

La primera es mirar: el modo adaptable de las herramientas del navegador, con un ancho de 320 px. Si aparece una barra de desplazamiento horizontal en la página (no dentro de una caja concreta), desborda.

La segunda es medir, porque el ojo se equivoca por pocos píxeles. Abre la pestaña de consola de las herramientas, pega esta línea y presiona `Enter`:

```js
document.documentElement.scrollWidth > document.documentElement.clientWidth
```

Es JavaScript, que todavía no estudias: lo vas a entender completo en la Lección 6, y por ahora solo hace falta saber qué pregunta. `clientWidth` es el ancho visible de la página y `scrollWidth` es el ancho que realmente ocupa su contenido. Si el segundo supera al primero, el contenido es más ancho que la ventana y se devuelve `true`. **Si devuelve `false`, no hay desbordamiento.** En `fig05_01.html` con la ventana a 320 px, esa línea devuelve `true`; al final de la lección, con tu panel terminado, devolverá `false` en todos los anchos.

## Los conceptos

Dos ideas, en este orden: las **columnas que se cuentan solas**, que resuelven el resumen sin escribir un solo número de ancho de ventana; y **lo adaptable**, que no es una herramienta más sino una manera de usar Flexbox y Grid para que la página se acomode sola, con las consultas de medios y de contenedor solo para lo que de verdad las necesita. Cada una se explica primero con un ejemplo mínimo y después con el panel.

### 5.1 Columnas que se cuentan solas

#### 5.1.1 La trampa de `1fr`: el mínimo escondido

`repeat(4, 1fr)` tiene un problema que se ve en cuanto la pantalla se angosta: siempre son cuatro columnas, sean cuales sean los anchos. Lo viste al final de la sección 4.2.3 de la Lección 4, con la página [`fig04_05.html`](https://github.com/HabilMX/curso-web/blob/main/programas/04-flexbox-grid/fig04_05.html) de la lección anterior, que declara las cuatro cifras del resumen en cuatro columnas fijas: a 1024 px y a 1440 px se ve bien, pero a 320 px las cuatro cifras se aprietan y la página **mide 344 px de ancho** (a 375 px ya caben, apenas).

Hay una razón sutil, que vale la pena entender porque es la trampa más común de Grid: **`1fr` no es «una fracción» a secas. Es `minmax(auto, 1fr)`**. El mínimo de la columna es `auto`, que significa «lo que mida el contenido más angosto posible», y una columna no se encoge por debajo de eso. Aquí, la palabra más larga de cada cifra fija un piso para su columna. Lo medí: los cuatro pisos suman 280 px, y los tres huecos de 16 px, otros 48; son 328 px, más que los 288 que deja la página a 320 px después de su relleno, así que la rejilla desborda en lugar de encogerse.

La consecuencia práctica es importante: **escribir más columnas de las que caben no las encoge; las desborda**. Y escribir menos (el Ejercicio 2 de la Lección 4 probó con dos) desperdicia espacio en una pantalla ancha. Ningún número fijo de columnas sirve para todos los anchos. Lo que hace falta es decirle al navegador *cuánto mide como mínimo una columna* y dejar que él cuente cuántas caben.

#### 5.1.2 `minmax()`, `auto-fit` y `min()`

[`minmax(mínimo, máximo)` es la función](https://developer.mozilla.org/en-US/docs/Web/CSS/minmax) que permite fijar tú el piso y el techo de una columna. `minmax(11rem, 1fr)` dice: «esta columna mide al menos 11rem (176 px) y, si hay espacio, crece repartiéndolo con las demás». Con ese piso conocido, el navegador ya sabe cuántas columnas caben en un ancho dado. Y aquí está la pieza que une todo:

```css
grid-template-columns: repeat(auto-fit, minmax(min(100%, 11rem), 1fr));
```

Se lee de adentro hacia afuera:

1. `minmax(11rem, 1fr)`: cada columna mide de 176 px hacia arriba.
2. `repeat(auto-fit, ...)`: **repite la columna tantas veces como quepa**. No se le dice cuántas; el navegador cuenta.
3. `min(100%, 11rem)`: el piso es el menor entre 11rem y el 100 % del contenedor. Sin esta pieza, en un contenedor más angosto que 176 px (una barra lateral estrecha, un teléfono de 150 px de ancho útil) la columna no cabría y desbordaría; con ella, el piso nunca supera el ancho disponible. [`min()` es una función de CSS](https://www.w3.org/TR/css-values-4/) que devuelve el menor de sus argumentos, y [MDN la marca como disponible en todos los navegadores desde julio de 2020](https://developer.mozilla.org/en-US/docs/Web/CSS/min); [la plataforma la da por de disponibilidad general desde enero de 2023](https://web-platform-dx.github.io/web-features-explorer/features/min-max-clamp/), los 30 meses de rigor después.

Hay dos palabras que se parecen y no hacen lo mismo: `auto-fill` y `auto-fit`. Las dos cuentan cuántas columnas caben. La diferencia aparece cuando hay menos elementos que columnas posibles: `auto-fill` conserva las columnas vacías (el espacio queda reservado, aunque no haya nada ahí) y `auto-fit` las colapsa a cero, de modo que los elementos que sí hay se estiran y ocupan todo el renglón. Lo medí dejando solo dos cifras en la página `fig05_03.html` de abajo, con la ventana a 1440 px (la hoja de la Lección 3 limita el contenido a 60 rem, así que el contenedor mide 928 px): con `auto-fill` caben cuatro columnas de 220 px y las dos tarjetas se quedan en las dos primeras, con media fila vacía; con `auto-fit` las dos miden 456 px y llenan la fila. Para el resumen del panel, `auto-fit`: queremos que las cifras que haya ocupen el renglón completo, no que dejen un hueco.

La página con la solución es `fig05_03.html`. Es idéntica a `fig04_05.html` salvo por esa línea (y por la ruta de su hoja, que es la copia de esta carpeta):

```html
<!-- fig05_03.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Resumen que cuenta sus columnas</title>
  <link rel="stylesheet" href="fig05_01/styles.css">
  <style>
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 11rem), 1fr));
      gap: 0 1rem;
      margin: 0;
    }
  </style>
</head>
<body>
  <main>
    <h1>Resumen</h1>
    <dl class="summary">
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
  </main>
</body>
</html>
```

Medí cinco anchos: 320, 375, 768, 1024 y 1440 px. En todos, el ancho de la página es igual al de la ventana; no desborda. A 320 px las cuatro cifras forman una columna, cada una de 288 px; a 1024 y 1440 ocupan una sola fila, de cuatro columnas de 220 px. Nadie escribió «a tal ancho, una columna»: el navegador hizo la cuenta con el piso de 11 rem.

#### 5.1.3 La otra trampa de `1fr`: una rejilla que se infla

Hay una variante de la misma trampa que te va a morder cuando uses Grid para el esqueleto de toda la página, y por eso la conviertes en hábito desde hoy. Piensa en una página con una sola columna: `display: grid` sin más, o con `grid-template-columns: 1fr`. Si algún hijo tiene contenido ancho (una tabla, por ejemplo), la columna se infla hasta acomodarlo, porque su mínimo `auto` es el ancho del contenido más angosto posible. El resultado: la tabla no se desplaza dentro de su caja, sino que **arrastra a toda la página**.

Lo medí en el panel final, cambiando solo `minmax(0, 1fr)` por `1fr` en la rejilla de la página: a 320 px, la página vuelve a desbordar, y ahora mide 439 px, aunque la tabla esté dentro de su caja con `overflow-x: auto`. Con `minmax(0, 1fr)` vale 320. La solución, siempre, es escribir el mínimo cero a propósito: `minmax(0, 1fr)` dice «esta columna puede encogerse hasta nada si hace falta; no la infles por el contenido». **Cuando una rejilla va a contener algo potencialmente ancho, la columna se escribe `minmax(0, 1fr)`, no `1fr`.**

#### 5.1.4 Ejemplo resuelto: el resumen del panel

En el panel, el resumen ya tiene su clase desde la Lección 4 (`<dl class="summary">`), y el HTML no se toca. Lo único que cambia es una línea de la regla `.summary` de la hoja: `repeat(4, 1fr)` se vuelve la línea de las columnas que se cuentan solas.

```css
.summary {
  container-type: inline-size;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 11rem), 1fr));
  gap: 0 var(--space-3);
  margin: 0;
}
```

La primera declaración, `container-type: inline-size`, todavía no la conoces: prepara al resumen para una consulta de contenedor y se explica en 5.2.4. Las otras tres son las de siempre. Con este cambio, el segundo culpable del desbordamiento desaparece: el resumen mide lo que su sección le permite en cualquier ancho, y en un teléfono las cifras se acomodan una debajo de otra. Queda el primero, la tabla, que necesita otra herramienta.

### 5.2 Adaptable: que el contenido decida

#### 5.2.1 Primero la fluidez, después la consulta

Lo que hiciste hasta aquí ya es «adaptable», aunque no escribiste una sola consulta de medios. La barra de controles de la Lección 4 baja de renglón sola cuando no cabe; el resumen cuenta sus columnas solo. La técnica se llama **diseño intrínseco**: en vez de decir «a tal ancho, haz tal cosa», se le da al navegador un piso, un techo y una preferencia (`flex: 1 1 14rem`, `minmax(11rem, 1fr)`) y él decide con el ancho que tenga. Tiene una ventaja que no se aprecia hasta que se compara: **funciona con anchos que nadie previó**. Una tableta en vertical, una ventana a medio tamaño, un teléfono plegable, una pantalla con la letra agrandada: ninguno estaba en tu lista de «dispositivos», y todos se acomodan igual.


El orden de las herramientas, de la que menos escribe a la que más, es:

1. **Flujo normal.** Si el contenido cabe en una columna, déjalo en una columna.
2. **Flexbox con `flex-wrap` y bases razonables.** Para grupos de cosas que se reparten una línea.
3. **Grid con `repeat(auto-fit, minmax(...))`.** Para tarjetas y tableros.
4. **Consulta de medios o de contenedor.** Solo cuando cambia la *organización* de la página y no hay manera de pedirlo con las herramientas anteriores.

#### 5.2.2 La tabla: desplazarse dentro de su caja

Queda el otro desbordamiento, el de la tabla. Una tabla de datos no se puede «partir» sin destruir lo que significa: si convirtieras cada fila en una tarjeta, perderías la comparación de columnas, que es justo para lo que sirve una tabla. Es el caso que la norma de reflujo exceptúa: una tabla puede requerir dos dimensiones. La solución es **dejar que la tabla conserve su ancho y que su caja se desplace**:

```html
<!-- fig05_04.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Tabla que se desplaza sola</title>
  <link rel="stylesheet" href="fig05_01/styles.css">
  <style>
    .table-scroll {
      overflow-x: auto;
    }
  </style>
</head>
<body>
  <main>
    <h1>Servicios</h1>
    <div class="table-scroll" role="region" aria-labelledby="table-caption" tabindex="0">
      <table>
        <caption id="table-caption">Estado de los servicios en la última revisión</caption>
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
    </div>
  </main>
</body>
</html>
```

El elemento nuevo es un `div` con `overflow-x: auto`, que dice: «si el contenido es más ancho que yo, muestra una barra de desplazamiento horizontal *dentro de mí*, no en la página». Con eso, la página entera mide 320 px (el ancho de la ventana) y solo la tabla se desliza. Medí esta página en los cinco anchos y el desbordamiento de la página es cero en todos.

Los tres atributos del `div` merecen explicación, porque son una excepción deliberada a la regla de «no pongas atributos de accesibilidad que no hacen falta»:

- `tabindex="0"` hace que la caja reciba el foco con la tecla Tab. Sin él, alguien que use solo el teclado no puede desplazar la tabla: las flechas solo desplazan una región que tiene el foco. Es lo que exige [el criterio 2.1.1 («Teclado»)](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html). [Chrome, desde su versión 132](https://developer.chrome.com/blog/keyboard-focusable-scrollers), hace enfocable por sí solo un contenedor que se desplaza y que no tiene hijos enfocables, pero otros navegadores no lo garantizan, así que se escribe a mano.
- `role="region"` y `aria-labelledby="table-caption"` le dan un nombre —el de la leyenda de la tabla— para que un lector de pantalla diga «Estado de los servicios en la última revisión, región» al llegar, en lugar de un mudo «grupo». Es la receta que publica Adrian Roselli, y una actualización suya de 2026 aclara que el rol puede ser opcional para cumplir la norma; el nombre ayuda de todas formas.

Comprobé con el teclado el panel final: con Tab, el foco pasa por el enlace «Resumen», el enlace «Servicios», el campo de búsqueda, el grupo de radios (una sola parada, porque los botones de radio de un grupo cuentan como una), el botón «Revisar ahora» y, por último, la caja de la tabla, identificada como `region`. Con el foco en la caja, las flechas izquierda y derecha desplazan la tabla. Y el contorno de foco que definió la Lección 3 con `:focus-visible` se ve alrededor de la caja, de modo que quien navega con teclado sabe dónde está.

#### 5.2.3 Cuándo sí hace falta `@media`

Todavía hay un cambio que ni Flexbox ni Grid piden por sí solos: en una pantalla de 1440 px el resumen y la tabla caben lado a lado, y en una de 375 px no. Eso no es decidir cuántas columnas caben en un renglón: es decidir **cómo se organiza la página entera**. Para eso existen las **consultas de medios** (`@media`): [reglas que solo se aplican si la ventana cumple una condición](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries).

[La sintaxis moderna usa comparaciones](https://www.w3.org/TR/mediaqueries-4/), como en matemáticas:

```css
@media (width >= 64em) {
  .layout {
    grid-template-columns: 20rem minmax(0, 1fr);
  }
}
```

Dice: «cuando el ancho de la ventana sea de 64 em o más, la rejilla de la página tiene una columna de 20 rem y otra que toma el resto». La forma `(width >= 64em)` se llama **sintaxis de rango**: los navegadores la entienden desde 2022 y 2023 [(Chrome y Edge 104, Firefox 102, Safari 16.4) y la plataforma la considera de disponibilidad general desde septiembre de 2025](https://web-platform-dx.github.io/web-features-explorer/features/media-query-range-syntax/). Antes se escribía `(min-width: 64em)`, que significa exactamente lo mismo; la verás en cualquier código anterior.

Dos decisiones de la regla merecen explicarse:

**La unidad es `em`, no `px`.** El punto de quiebre se mide en `em` (una `em` es el tamaño de letra del navegador, 16 px por omisión). Así, si alguien agranda el tamaño base de letra del navegador, el punto de quiebre se mueve con él: 64 em equivalen a 1,024 px solo si el lector no tocó su configuración; si la dejó al 150 %, equivalen a 1,536 px, y la página cambia de organización en el momento adecuado para *esa* letra. [MDN lo recomienda](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_design): los puntos de quiebre en unidades relativas envejecen mejor.

**Se escribe primero lo del teléfono.** La regla base (sin `@media`) es la del ancho angosto: una columna. Lo del ancho grande se *agrega* dentro de la consulta. Esto se llama **mobile first** y la razón es práctica: lo más simple va primero y es lo que reciben, sin sobrecarga, los dispositivos con menos recursos; lo complejo se añade solo donde hay espacio para ello. El orden contrario (escribir primero lo de escritorio y luego deshacerlo con `max-width`) obliga a anular reglas, y cada anulación es un lugar donde equivocarse.

Y una advertencia que hace de contrapeso: **un punto de quiebre no se elige por un dispositivo, sino por el contenido**. La pregunta correcta no es «¿qué ancho tiene un iPhone?», sino «¿a partir de qué ancho deja de verse bien lo que hay?». Arrastra el borde de la ventana hasta que algo se rompa o se vea desperdiciado; ahí va el punto de quiebre. La lista de modelos de teléfono cambia cada año; el contenido, no.

#### 5.2.4 La caja decide, no la ventana: `@container`

Hay un caso que `@media` no resuelve bien. Mira `fig05_05.html`. En una ventana ancha, la columna del resumen mide 20 rem (320 px); en una ventana de teléfono de 375 px, el resumen ocupa todo el ancho: 343 px. Son dos situaciones con el mismo ancho aproximado en el resumen y anchos de ventana de 1440 y 375. Una consulta de medios (que solo ve la ventana) tendría que adivinar cuánto espacio tiene el resumen en cada caso. Lo que realmente importa es **el ancho de la caja donde está**, no el de la ventana.


Para eso están las **consultas de contenedor**. Se declara una caja como contenedor consultable y después se pregunta por su ancho:

```html
<!-- fig05_05.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Dos preguntas distintas: la ventana y la caja</title>
  <link rel="stylesheet" href="fig05_01/styles.css">
  <style>
    .layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 1.5rem;
      align-items: start;
    }

    /* La separación la pone el gap de la rejilla, no el margen de la Lección 3. */
    .layout section {
      margin-bottom: 0;
    }

    /* La ventana decide cómo se reparten las dos piezas de la página. */
    @media (width >= 64em) {
      .layout {
        grid-template-columns: 20rem minmax(0, 1fr);
      }
    }

    /* La caja decide cómo se acomoda lo que lleva dentro. */
    .summary {
      container-type: inline-size;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 11rem), 1fr));
      gap: 0 1rem;
      margin: 0;
    }

    @container (width < 24rem) {
      .summary div {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 1rem;
      }

      .summary dd {
        white-space: nowrap;
      }
    }
  </style>
</head>
<body>
  <h1>La página en dos piezas</h1>
  <main class="layout">
    <section id="summary">
      <h2>Resumen</h2>
      <dl class="summary">
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
      <p>Aquí va la tabla.</p>
    </section>
  </main>
</body>
</html>
```

Cuatro piezas:

- [`container-type: inline-size` declara](https://www.w3.org/TR/css-contain-3/) `.summary` como contenedor consultable por su ancho.
- `@container (width < 24rem)` aplica las reglas de dentro solo si **ese contenedor** mide menos de 24 rem (384 px). La condición tiene la misma sintaxis de rango que `@media`.
- Dentro de la consulta, las cuatro cajas del resumen pasan a ser filas compactas (`display: flex`, con el término a la izquierda y el valor a la derecha). Es lo que ves en la barra lateral y en el teléfono: una fila por cifra, en vez de un cuadrado alto.
- `white-space: nowrap` es un seguro: impide que «465 ms» se parta en dos líneas si la fila compacta se angosta más. Con la letra de la hoja de la Lección 3 no llegó a hacer falta (lo medí: la cifra ocupa una sola línea de 32 px con la regla y sin ella, en la barra lateral y en un teléfono de 375 px), pero cuesta una línea y protege el día en que alguien agrande la letra o la cifra sea más larga.

Dos restricciones que aprendes mejor de una vez. Primera: **una consulta de contenedor solo puede cambiar a los descendientes del contenedor, no al contenedor mismo.** Por eso las reglas apuntan a `.summary div` y no a `.summary`. Segunda: `container-type: inline-size` significa que el ancho del contenedor ya no depende de su contenido (se lo da el padre), y por eso se declara en una caja cuyo ancho viene de afuera, como una rejilla o una columna.

[Las consultas de contenedor funcionan en los tres motores principales](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries) desde febrero de 2023 (Chrome y Edge 105, Safari 16, Firefox 110) y la plataforma las da por de disponibilidad general desde [el 14 de agosto de 2025](https://web-platform-dx.github.io/web-features-explorer/features/container-queries/). Cuando un componente va a vivir en lugares con anchos distintos —una barra lateral, una columna principal, una ventana emergente—, esta es la herramienta correcta.

Un aviso para el hábito de validar que aprendiste en la Lección 3. Si pasas esta hoja por [el validador de CSS del W3C](https://jigsaw.w3.org/css-validator/), ya no responde «Congratulations! No Error Found»: lo comprobé enviándole `fig05_06/styles.css` y respondió con dos errores, «La propiedad “container-type” no existe» y «la regla-arroba “@container” no está implementada». No son errores de tu hoja, sino una limitación del validador, que todavía no conoce las consultas de contenedor aunque los navegadores las usan desde 2023. Cuando valides, revisa que los únicos errores sean esos dos; cualquier otro sí es tuyo.

#### 5.2.5 Tamaño de los objetivos

Una cosa más, que se nota sobre todo en una pantalla táctil, donde el pulgar es menos preciso que el cursor, pero que vale para cualquier puntero: el mouse, una pluma o el dedo. [El criterio 2.5.8 de la norma («Tamaño del objetivo, mínimo»)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) pide que los objetivos que se activan con un puntero midan al menos **24 por 24 píxeles CSS**, con excepciones (si hay suficiente espacio alrededor, si el objetivo está dentro de una frase, si el tamaño lo fija el navegador). Quien más lo necesita son las personas con temblor en las manos o con poca precisión de movimiento, uses el dispositivo que uses. En el panel, los botones y el campo de búsqueda llevan `min-height: 2.5rem` (40 px) desde la Lección 3: más de vez y media el mínimo, porque 24 px es un piso, no la medida que un pulgar acierta con comodidad.

#### 5.2.6 El panel terminado de la lección

Con todo lo anterior, el panel completo de la lección es `fig05_06.html`. Los cambios de HTML respecto del panel de la Lección 4 son tres, y ninguno cambia lo que el HTML dice: la clase `layout` en `<main>`, el `div.table-scroll` con su tabla dentro, y el `id="table-caption"` en la leyenda de la tabla, al que apunta el `aria-labelledby` del envoltorio.

```html
<!-- fig05_06.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Revisor de servicios</title>
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="fig05_06/styles.css">
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
      </div>

      <div class="table-scroll" role="region" aria-labelledby="table-caption" tabindex="0">
        <table>
          <caption id="table-caption">Estado de los servicios en la última revisión</caption>
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
      </div>
    </section>
  </main>

  <footer>
    <p>Datos de ejemplo escritos a mano.</p>
  </footer>
</body>
</html>
```

Y esta es la hoja de estilos completa, que es la de la Lección 4 con el acomodo adaptable añadido (los comentarios señalan de qué lección viene cada parte):

```css
/* fig05_06/styles.css */
/* La hoja del panel al terminar la Lección 5: la de la Lección 3, con sus mismas
   capas y variables, más el acomodo de la Lección 4 (Flexbox y Grid) y el de la
   Lección 5 (cualquier pantalla). Cada cambio lleva un comentario con su lección. */

/* El orden de las capas se declara una sola vez, arriba. La última gana. */
@layer reset, base, components;

@layer reset {
  /* La caja: el ancho que escribes es el ancho que se ve. */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  /* El navegador no hace que los campos hereden la letra del texto. */
  input,
  button {
    font: inherit;
  }
}

@layer base {
  /* Las decisiones del panel viven aquí, con nombres que dicen para qué sirven. */
  :root {
    --color-text: #1b1f24;
    --color-muted: #57606a;
    --color-page: #f6f8fa;
    --color-surface: #ffffff;
    --color-border: #d0d7de;
    --color-control: #6e7781;
    --color-accent: #0b5cad;

    --color-available-text: #0f5132;
    --color-available-bg: #d1e7dd;
    --color-down-text: #842029;
    --color-down-bg: #f8d7da;

    --space-1: 0.25rem;
    --space-2: 0.5rem;
    --space-3: 1rem;
    --space-4: 1.5rem;
    --space-5: 2.5rem;

    --font-body: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    --line-height: 1.6;
    --radius: 0.375rem;
  }

  body {
    margin: 0;
    background: var(--color-page);
    color: var(--color-text);
    font-family: var(--font-body);
    line-height: var(--line-height);
  }

  /* Un ancho cómodo para leer, centrado: auto reparte el espacio sobrante.
     Lección 5: de 60 a 80 rem, porque en una pantalla ancha ahora caben dos columnas. */
  header,
  main,
  footer {
    max-width: 80rem;
    margin: 0 auto;
    padding: var(--space-3);
  }

  h1 {
    margin: 0 0 var(--space-2);
    font-size: 2rem;
    line-height: 1.2;
  }

  h2 {
    margin: 0 0 var(--space-3);
    font-size: 1.375rem;
    line-height: 1.3;
  }

  a {
    color: var(--color-accent);
  }

  /* Que el foco del teclado se vea siempre: nunca outline: none sin reemplazo. */
  :focus-visible {
    outline: 3px solid var(--color-accent);
    outline-offset: 2px;
  }

  footer {
    color: var(--color-muted);
  }
}

@layer components {
  /* Cada sección es una hoja blanca sobre el fondo de la página.
     Lección 5: sin margen inferior; la separación la pone el gap de .layout. */
  section {
    padding: var(--space-3) var(--space-4);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
  }

  /* El resumen: cada par nombre-valor en su renglón. */
  dl div {
    padding: var(--space-2) 0;
    border-bottom: 1px solid var(--color-border);
  }

  dl div:last-child {
    border-bottom: 0;
  }

  dt {
    color: var(--color-muted);
  }

  dd {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }

  /* Los controles. */
  label {
    margin-right: var(--space-3);
  }

  input[type="search"] {
    min-height: 2.5rem;
    padding: var(--space-1) var(--space-2);
    border: 1px solid var(--color-control);
    border-radius: var(--radius);
  }

  fieldset {
    margin: var(--space-3) 0;
    padding: var(--space-2) var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
  }

  button {
    min-height: 2.5rem;
    padding: var(--space-1) var(--space-3);
    border: 0;
    border-radius: var(--radius);
    background: var(--color-accent);
    color: var(--color-surface);
    font-weight: 600;
    cursor: pointer;
  }

  button:hover {
    background: var(--color-text);
  }

  /* La tabla. */
  table {
    width: 100%;
    margin-top: var(--space-3);
    border-collapse: collapse;
  }

  caption {
    padding-bottom: var(--space-2);
    color: var(--color-muted);
    text-align: left;
  }

  th,
  td {
    padding: var(--space-2) var(--space-3);
    border-bottom: 1px solid var(--color-border);
    text-align: left;
  }

  /* Los números a la derecha y con cifras del mismo ancho para que alineen. */
  th:last-child,
  td:last-child {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }

  /* La insignia de estado: una sola regla, y las variantes solo cambian variables. */
  .status {
    display: inline-block;
    padding: 0 var(--space-2);
    border-radius: 999px;
    background: var(--badge-bg);
    color: var(--badge-text);
    font-size: 0.875rem;
    font-weight: 600;
  }

  .status-available {
    --badge-bg: var(--color-available-bg);
    --badge-text: var(--color-available-text);
  }

  .status-down {
    --badge-bg: var(--color-down-bg);
    --badge-text: var(--color-down-text);
  }

  /* ---- Lecciones 4 y 5: el acomodo ---- */

  /* Lección 5. Las dos piezas de la página: la ventana decide si van una sobre otra
     o lado a lado. minmax(0, 1fr) y no 1fr: la columna no se infla con la tabla. */
  .layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--space-4);
    align-items: start;
  }

  @media (width >= 64em) {
    .layout {
      grid-template-columns: 20rem minmax(0, 1fr);
    }
  }

  /* Grid, dos dimensiones (Lección 4); las columnas se cuentan solas (Lección 5). */
  .summary {
    container-type: inline-size;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 11rem), 1fr));
    gap: 0 var(--space-3);
    margin: 0;
  }

  /* Lección 5. La caja, no la ventana, decide si cada cifra va en una fila compacta. */
  @container (width < 24rem) {
    .summary div {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: var(--space-3);
    }

    .summary dd {
      white-space: nowrap;
    }
  }

  /* Lección 4. Flexbox, una dimensión: el encabezado y la barra de controles
     se parten en renglones cuando no caben. */
  .page-header {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--space-1) var(--space-3);
  }

  .page-header p {
    margin: 0;
  }

  .controls {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: var(--space-3);
  }

  .controls p,
  .controls fieldset {
    margin: 0;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    flex: 1 1 14rem;
  }

  .field input {
    width: 100%;
  }

  /* Lección 5. La tabla conserva su semántica: lo que se desplaza es su envoltorio. */
  .table-scroll {
    overflow-x: auto;
  }
}
```

Respecto de la hoja de la Lección 4 hay dos ajustes, un cambio y tres reglas nuevas, y nada más. Los ajustes: el ancho máximo de `header`, `main` y `footer` sube de 60 a 80 rem, para que en una pantalla ancha las dos columnas no se aprieten; y las secciones pierden su `margin-bottom`, porque dentro de la rejilla la separación la pone el `gap` de `.layout`, que es la regla de la Lección 4 (4.1.2): la separación entre hermanos la pone el padre. El cambio: la regla `.summary` deja `repeat(4, 1fr)` por las columnas que se cuentan solas y agrega `container-type`, como en 5.1.4. Las reglas nuevas van en el bloque del acomodo, que ahora junta lo de las dos lecciones: `.layout` con `minmax(0, 1fr)` y, a partir de 64 em, dos columnas; la consulta de contenedor del resumen; y el `.table-scroll`. El encabezado, la barra de controles, las capas, las variables, el foco y las insignias se quedan como estaban: lo adaptable se suma a lo que había, no lo reescribe. (El orden de las reglas dentro del bloque cambió respecto de la Lección 4: primero la página, después el resumen, después los controles. Es el orden en que las lee quien abre el archivo de arriba abajo, y no altera el resultado, porque ninguna de esas reglas compite con otra por la misma propiedad.)

El punto de partida de esta lección, `fig05_01.html`, es el panel de la Lección 4 con su `<link>` apuntando a la copia de la hoja que vive en esta carpeta; lo tienes completo a continuación, por si quieres comparar o no tienes el de la lección anterior:

```html
<!-- fig05_01.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Revisor de servicios</title>
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="fig05_01/styles.css">
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

  <main>
    <section id="summary">
      <h2>Resumen</h2>
      <dl class="summary">
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
      </div>

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

y su hoja, `fig05_01/styles.css`, es `fig04_06/styles.css` sin un solo cambio salvo los comentarios de arriba:

```css
/* fig05_01/styles.css */
/* La hoja del panel tal como la deja la Lección 4 (es fig04_06/styles.css, copiada
   aquí para que esta carpeta funcione sola): la de la Lección 3 más Flexbox y Grid.
   Todavía no se adapta a una pantalla angosta. */

/* El orden de las capas se declara una sola vez, arriba. La última gana. */
@layer reset, base, components;

@layer reset {
  /* La caja: el ancho que escribes es el ancho que se ve. */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  /* El navegador no hace que los campos hereden la letra del texto. */
  input,
  button {
    font: inherit;
  }
}

@layer base {
  /* Las decisiones del panel viven aquí, con nombres que dicen para qué sirven. */
  :root {
    --color-text: #1b1f24;
    --color-muted: #57606a;
    --color-page: #f6f8fa;
    --color-surface: #ffffff;
    --color-border: #d0d7de;
    --color-control: #6e7781;
    --color-accent: #0b5cad;

    --color-available-text: #0f5132;
    --color-available-bg: #d1e7dd;
    --color-down-text: #842029;
    --color-down-bg: #f8d7da;

    --space-1: 0.25rem;
    --space-2: 0.5rem;
    --space-3: 1rem;
    --space-4: 1.5rem;
    --space-5: 2.5rem;

    --font-body: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    --line-height: 1.6;
    --radius: 0.375rem;
  }

  body {
    margin: 0;
    background: var(--color-page);
    color: var(--color-text);
    font-family: var(--font-body);
    line-height: var(--line-height);
  }

  /* Un ancho cómodo para leer, centrado: auto reparte el espacio sobrante. */
  header,
  main,
  footer {
    max-width: 60rem;
    margin: 0 auto;
    padding: var(--space-3);
  }

  h1 {
    margin: 0 0 var(--space-2);
    font-size: 2rem;
    line-height: 1.2;
  }

  h2 {
    margin: 0 0 var(--space-3);
    font-size: 1.375rem;
    line-height: 1.3;
  }

  a {
    color: var(--color-accent);
  }

  /* Que el foco del teclado se vea siempre: nunca outline: none sin reemplazo. */
  :focus-visible {
    outline: 3px solid var(--color-accent);
    outline-offset: 2px;
  }

  footer {
    color: var(--color-muted);
  }
}

@layer components {
  /* Cada sección es una hoja blanca sobre el fondo de la página. */
  section {
    margin-bottom: var(--space-4);
    padding: var(--space-3) var(--space-4);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
  }

  /* El resumen: cada par nombre-valor en su renglón. */
  dl div {
    padding: var(--space-2) 0;
    border-bottom: 1px solid var(--color-border);
  }

  dl div:last-child {
    border-bottom: 0;
  }

  dt {
    color: var(--color-muted);
  }

  dd {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }

  /* Los controles. */
  label {
    margin-right: var(--space-3);
  }

  input[type="search"] {
    min-height: 2.5rem;
    padding: var(--space-1) var(--space-2);
    border: 1px solid var(--color-control);
    border-radius: var(--radius);
  }

  fieldset {
    margin: var(--space-3) 0;
    padding: var(--space-2) var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
  }

  button {
    min-height: 2.5rem;
    padding: var(--space-1) var(--space-3);
    border: 0;
    border-radius: var(--radius);
    background: var(--color-accent);
    color: var(--color-surface);
    font-weight: 600;
    cursor: pointer;
  }

  button:hover {
    background: var(--color-text);
  }

  /* La tabla. */
  table {
    width: 100%;
    margin-top: var(--space-3);
    border-collapse: collapse;
  }

  caption {
    padding-bottom: var(--space-2);
    color: var(--color-muted);
    text-align: left;
  }

  th,
  td {
    padding: var(--space-2) var(--space-3);
    border-bottom: 1px solid var(--color-border);
    text-align: left;
  }

  /* Los números a la derecha y con cifras del mismo ancho para que alineen. */
  th:last-child,
  td:last-child {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }

  /* La insignia de estado: una sola regla, y las variantes solo cambian variables. */
  .status {
    display: inline-block;
    padding: 0 var(--space-2);
    border-radius: 999px;
    background: var(--badge-bg);
    color: var(--badge-text);
    font-size: 0.875rem;
    font-weight: 600;
  }

  .status-available {
    --badge-bg: var(--color-available-bg);
    --badge-text: var(--color-available-text);
  }

  .status-down {
    --badge-bg: var(--color-down-bg);
    --badge-text: var(--color-down-text);
  }

  /* ---- Lección 4: Flexbox y Grid ---- */

  /* Flexbox, una dimensión: el encabezado se reparte en una fila y baja
     de renglón cuando no cabe. */
  .page-header {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--space-1) var(--space-3);
  }

  .page-header p {
    margin: 0;
  }

  /* La barra de controles: tres hermanos en una línea; solo el campo crece. */
  .controls {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: var(--space-3);
  }

  .controls p,
  .controls fieldset {
    margin: 0;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    flex: 1 1 14rem;
  }

  .field input {
    width: 100%;
  }

  /* Grid, dos dimensiones: las cuatro cifras del resumen en cuatro columnas
     iguales. En un teléfono no caben; la Lección 5 lo resuelve. */
  .summary {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0 var(--space-3);
    margin: 0;
  }
}
```

Mide el panel terminado como mediste el inicial. Medí `fig05_06.html` en 320, 375, 768, 1024 y 1440 px: el ancho de la página es igual al de la ventana en los cinco, y la comparación de la consola devuelve `false`. A 1440 px el resumen queda en una columna de 20 rem a la izquierda y la tabla a la derecha, con la barra de controles encima de la tabla en una sola fila; a 320 px, todo en una columna, con la tabla desplazándose dentro de su caja. El ancho **del teléfono**, que era el problema que abrió la lección, ya no lo es.

#### 5.2.7 Llévalo a tu `revisor`

Hasta aquí trabajaste con las páginas del repositorio. Falta el paso que convierte lo aprendido en tu proyecto: que **tu** `revisor` quede igual que `fig05_06.html`, medido y guardado en Git. Son cuatro pasos, y ninguno pide escribir nada nuevo.

**1. La hoja.** Abre `fig05_06/styles.css` (en el repositorio, o cópiala del bloque completo de arriba) y pega su contenido en tu `~/revisor/css/styles.css`, en lugar de lo que había. Puedes reemplazarla entera porque es la hoja de la Lección 4 con los ajustes y las reglas que acabas de leer: no se pierde nada. Si en las lecciones anteriores le hiciste cambios propios a tu hoja (otro color, otro tamaño), entonces no la reemplaces: haz a mano los dos ajustes (el ancho máximo de `header`, `main` y `footer` sube a `80rem`; `section` pierde su `margin-bottom`), cambia la regla `.summary` por la de 5.1.4, y agrega al bloque de la Lección 4 la regla `.layout` con su `@media`, el `@container` del resumen y el `.table-scroll`.

**2. La página.** En tu `~/revisor/index.html` haz los cambios del HTML, que son los de la lista de 5.2.6:

- `<main>` pasa a ser `<main class="layout">`.
- La tabla queda dentro de `<div class="table-scroll" role="region" aria-labelledby="table-caption" tabindex="0">`, tal como en 5.2.2.
- El que se olvida: el `<caption>` lleva `id="table-caption"`. Sin ese `id`, el `aria-labelledby` del envoltorio apunta a nada y la región se queda sin nombre.

También puedes copiar `fig05_06.html` completa sobre tu `index.html`, con una precaución: en el repositorio, su `<link>` apunta a `fig05_06/styles.css`; en tu proyecto debe decir `href="css/styles.css"`, como desde la Lección 3. Si no lo cambias, la página se verá sin estilos.

**3. Mide.** Desde la carpeta del proyecto, enciende el servidor:

```bash
$ cd ~/revisor
$ python3 -m http.server 8000 --bind 127.0.0.1
```

Abre `http://127.0.0.1:8000/`, activa el modo adaptable y repite la medición de la lección: la línea de la consola debe devolver `false` a 320, 375, 768, 1024 y 1440 px, y la página debe verse igual que `fig05_06.html` en los mismos anchos. Lo hice con una carpeta `revisor` armada así: a 320 px la página mide 320 y la caja de la tabla 238 px, con la tabla desplazándose dentro; a 1440 px, las dos columnas. Si algo no coincide, compara tu archivo con el del repositorio: casi siempre es una clase que no se escribió o un `div` que se cerró en otro lugar.

**4. Guárdalo en Git.** Detén el servidor con `Ctrl`+`C` (o abre otra terminal) y pregúntale a Git qué cambió, como en la Lección 1:

```bash
$ git status
En la rama main
Cambios no rastreados para el commit:
  (usa "git add <archivo>..." para actualizar lo que será confirmado)
  (usa "git restore <archivo>..." para descartar los cambios en el directorio de trabajo)
	modificados:     css/styles.css
	modificados:     index.html

sin cambios agregados al commit (usa "git add" y/o "git commit -a")
```

Son justo los dos archivos que tocaste. (Si aparece alguno más, es un cambio tuyo de antes que no guardaste: revísalo con `git diff` antes de decidir si va en este commit.) Revisa con `git diff` que los cambios sean los que querías, y guárdalos:

```bash
$ git add index.html css/styles.css
$ git commit -m "Adapta el panel a cualquier ancho de pantalla"
$ git status
En la rama main
nada para hacer commit, el árbol de trabajo está limpio
```

El `git commit` imprime una línea con el código del commit y cuántas líneas cambiaron; los números dependen de tus archivos. Con eso, tu `revisor` queda listo para la Lección 6, que parte exactamente de aquí.

## El error que vas a ver

Los errores de acomodo casi nunca son mensajes: son una página que se ve «mal» sin decir por qué. En esta lección hay dos, y los dos se miden. El primero lo acabas de ver en la etiqueta `viewport`: sin ella, la página no desborda, pero todo se ve diminuto, y la única pista es el número de `window.innerWidth`. El segundo es el que abrió la lección.

**La página más ancha que la ventana.** Abre `fig05_01.html` a 320 px. La señal es la barra de desplazamiento horizontal, o la consola:

```js
document.documentElement.scrollWidth > document.documentElement.clientWidth
```

que responde `true`. Para encontrar *quién* se pasa, en las herramientas pasa el cursor por los elementos del panel de elementos: el navegador sombrea el área de cada uno, y el que sale del borde derecho de la ventana es el culpable. En `fig05_01.html` son dos: la tabla, que llega a los 414 px, y el resumen, que llega a los 369. Las dos soluciones ya las tienes: el envoltorio con `overflow-x: auto` para la tabla, y las columnas que se cuentan solas para el resumen. Un consejo para cuando haya varios culpables: arregla uno, mide otra vez y busca el siguiente. La página mide lo que mide el **más** ancho, así que mientras quede uno, la medición sigue dando `true` aunque hayas arreglado el otro, y es fácil creer que el arreglo no funcionó.

**Y una variante que confunde:** la tabla ya está en su caja con `overflow-x: auto`, y aun así la página sigue más ancha que la ventana. Es la rejilla inflada del apartado 5.1.3: la columna de la página está declarada como `1fr` y se expande por el ancho de la tabla. Se arregla con `minmax(0, 1fr)`. Si te topas con esto en otro proyecto, ya sabes dónde mirar: no en la tabla, sino en la columna que la contiene.

## Lo que se hace mal

**Una consulta de medios por dispositivo.** `@media (width: 390px) { ... }` «para el iPhone». Cubre un solo ancho, de un solo modelo, de un año. Un teléfono plegable, una ventana a medio tamaño o una pantalla con letra agrandada caen entre esos puntos, y ahí la página no está pensada. Costo: una lista de dispositivos que crece cada año y que nunca está al día.

**Esconder el desbordamiento en vez de arreglarlo.** `body { overflow-x: hidden }` hace desaparecer la barra de desplazamiento y deja el contenido cortado: lo que está más allá del borde ya no se puede ver ni alcanzar. Es peor que el defecto, porque *parece* arreglado. El criterio 1.4.10 pide que no se pierda información al agrandar; recortar la página es perderla.

**Convertir la tabla en otra cosa para que «quepa».** Cambiar el `display` de `table`, `tr` y `td` por `block` o `grid`, o rehacer la tabla con `div`. Puede quitarle el rol de tabla y la navegación por celdas a quien usa un lector de pantalla. En Chrome 154 la tabla con `display: grid` conservó su rol, pero la regla del curso no depende de que lo mismo ocurra en cada navegador y lector: se deja la tabla como tabla y se envuelve.

**Quitar el zoom «para que no se mueva».** `user-scalable=no` o `maximum-scale=1` en la etiqueta `viewport`. Impide acercar la página, que es lo que quien tiene baja visión usa para leerla.

**Dar a un contenedor de ancho incierto una columna `1fr`.** Es la rejilla inflada de 5.1.3: pasa desapercibida mientras el contenido sea corto y estalla el día que llega una tabla ancha, un identificador largo o una URL sin espacios. Cuesta una tarde, porque el culpable parece ser el contenido y es la columna.

## Ejercicios

### Ejercicio 1 — Menos cifras, mismas columnas

Copia `fig05_03.html` y deja en el resumen solo tres cifras: quita «Respuesta promedio». Sin tocar el CSS, mide el ancho de cada tarjeta a 768, 1024 y 1440 px (las herramientas del navegador te dan el ancho de cada elemento al seleccionarlo). Después cambia `auto-fit` por `auto-fill`, mide de nuevo en esos tres anchos y explica en cuáles hubo diferencia y por qué (usa lo que viste con dos tarjetas en 5.1.2).

### Ejercicio 2 — Rompe la rejilla de la página a propósito

En una copia de `fig05_06.html`, cambia `minmax(0, 1fr)` por `1fr` en la regla de `.layout`. Mide el ancho de la página a 320 px con la línea de la consola. ¿Cuánto da? Después busca con las herramientas del navegador qué elemento hace crecer a la rejilla y explica por qué, si la tabla ya estaba en su caja con `overflow-x: auto`, la página igual desborda.

### Ejercicio 3 — Un punto de quiebre que decide el contenido

En `fig05_06.html`, la barra de controles pasa de tres renglones (a 320 px) a dos y luego a uno al ensanchar la ventana. Sin mirar un solo modelo de teléfono, encuentra con el modo adaptable el ancho de ventana en que pasa de dos renglones a uno, y apúntalo. Después sigue ensanchando: a partir de 1024 px, y hasta un poco más de 1160, la barra vuelve a ocupar dos renglones. Explica los dos hallazgos con la suma de lo que mide cada pieza.

## Soluciones

### Solución 1

Lo medí con tres tarjetas de piso de 11 rem. Con `auto-fit`: a 768 px, tres columnas de 235 px; a 1024 y a 1440 px, tres columnas de 299 px. Las dos últimas medidas son iguales porque la hoja limita el contenido a 60 rem desde la Lección 3: a partir de 960 px de ventana, el contenedor ya no crece y mide 928 px. Con `auto-fill` el resultado es idéntico a 768, y distinto a 1024 y a 1440: ahí caben cuatro columnas de 220 px, las tres tarjetas ocupan las primeras tres y queda una columna vacía a la derecha.

La diferencia solo aparece cuando hay **menos tarjetas que columnas posibles**, y eso pasa a 1024 y a 1440 px. A 768 px caben justo tres columnas para tres tarjetas y no sobra ninguna. `auto-fit` colapsa las columnas sin contenido y deja que las que sí lo tienen se estiren; `auto-fill` las conserva, aunque estén vacías.

### Solución 2

Con `1fr` en la rejilla de la página, la medición da **439** a 320 px (la comparación devuelve `true`): es lo que mide la tabla, más el relleno de su sección y el de la página. El elemento que ensancha todo es la columna de la rejilla, y la sección que la contiene. La tabla sí está dentro de su caja, con `overflow-x: auto`, pero la caja no puede ser más estrecha que su columna, y la columna `1fr` tiene un mínimo de `auto`, que es el ancho mínimo del contenido, tabla incluida. Entonces la columna se infla, la caja se infla con ella, y la caja ya no tiene nada que desplazar: ahora todo cabe en una caja ancha, que a su vez desborda la página. Con `minmax(0, 1fr)` el mínimo es cero, la columna mide lo que la ventana permite y la tabla, que sigue siendo ancha, se desplaza dentro de una caja de 238 px.

### Solución 3

La barra cabe en un renglón cuando su caja mide al menos lo que suman sus tres piezas más los dos espacios entre ellas. Lo medí en `fig05_06.html`: el campo tiene una base de `14rem` (224 px), el grupo de radios mide 345 px (cada etiqueta lleva el margen derecho de 1 rem que le dio la Lección 3), el botón 135 px, y el `gap` pone 16 px dos veces. La suma es 224 + 345 + 135 + 32 = **736 px**. En esa zona del panel la página es una sola columna, y la caja de los controles mide el ancho de la ventana menos 82 px: 32 de relleno de `main`, 48 de relleno de la sección y 2 de su borde. Así que la barra pasa a un renglón con una ventana de **818 px**, que fue justo el primer ancho que dio una sola fila al medir de píxel en píxel.

El segundo hallazgo es el que enseña más: a 1024 px la página cambia a dos columnas (`@media (width >= 64em)`), y la caja de los controles queda en 598 px, que es menos de 736: la barra vuelve a partirse en dos renglones. Solo a partir de 1162 px la caja recupera 736 px y vuelve a caber en uno. **El ancho que le importa a la barra no es el de la ventana, sino el de su caja**, y el ancho de su caja no crece de forma pareja con el de la ventana, porque en medio la página cambió de organización. Por eso `flex-wrap` resuelve esto sin ningún número escrito: la barra baja de renglón cuando su caja es angosta, sea por la ventana o por una columna lateral. Si hubieras escrito una consulta de medios con «818 px», habría acertado a 820 y fallado a 1024.

## Cómo sé que lo logré

- [ ] `fig05_01.html` a 320 px devuelve `true` con la línea de la consola (el ancho de la página es de 414 px), y `fig05_06.html` devuelve `false` en 320, 375, 768, 1024 y 1440 px.
- [ ] `fig05_02.html` en un teléfono emulado de 390 px muestra `window.innerWidth` de 980; `fig05_03.html` en el mismo teléfono muestra 390.
- [ ] En `fig05_06.html` a 1440 px el resumen está a la izquierda en una columna y la tabla a la derecha; a 320 px todo va en una sola columna, y solo la tabla se desplaza hacia los lados, dentro de su caja.
- [ ] Con Tab, el foco pasa en este orden: enlace «Resumen», enlace «Servicios», campo de búsqueda, grupo de radios, botón «Revisar ahora» y la caja de la tabla (que se anuncia como región). Con el foco en la caja, las flechas desplazan la tabla.
- [ ] Los botones y el campo de búsqueda miden al menos 40 px de alto (`min-height: 2.5rem`, desde la Lección 3), y la herramienta de inspección del navegador lo confirma.
- [ ] Puedes explicar con tus palabras qué hace cada pieza de `repeat(auto-fit, minmax(min(100%, 11rem), 1fr))`, por qué `1fr` de por sí no basta en una columna que contendrá algo ancho, y qué diferencia hay entre una consulta de medios y una de contenedor, con un ejemplo del panel para cada una.
- [ ] Tu `~/revisor` (servido desde su carpeta en `http://127.0.0.1:8000/`) se ve igual que `fig05_06.html`, devuelve `false` en los cinco anchos, y `git log --oneline` muestra el commit con el panel adaptable.

## Resumen

Para fijar lo que acabas de ver, responde sin mirar la lección:

1. ¿Qué hace el navegador de un teléfono con una página que no lleva la etiqueta `viewport`, y qué cifra medimos?
2. ¿De dónde sale el 320 y a quién protege, además de a quien usa un teléfono?
3. ¿Por qué `repeat(4, 1fr)` desborda a 320 px, si `1fr` es «una fracción del espacio»?
4. ¿En qué se diferencian `auto-fill` y `auto-fit`, y cuál usaste para el resumen?
5. ¿Por qué una tabla ancha se envuelve y no se rehace con otro `display`? ¿Qué tres atributos lleva su envoltorio y para qué sirve cada uno?
6. ¿Por qué el punto de quiebre se escribe en `em` y se elige mirando el contenido, no un modelo de teléfono?
7. ¿Por qué `@container` no puede cambiar el propio contenedor?

Si alguna respuesta se te atora, vuelve al apartado correspondiente: es señal de que ahí quedó una pieza floja, no de que no sirvas para esto.

## Para leer más

- [MDN, «Diseño web adaptable»](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_design) — el módulo de aprendizaje de Mozilla sobre `viewport`, mobile first y puntos de quiebre. Consultado el 7 de octubre de 2026.
- [W3C, «Comprender el criterio 1.4.10: Reflujo»](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) — de dónde sale el 320 y qué parte del contenido puede desplazarse. Consultado el 7 de octubre de 2026.
- [MDN, «Consultas de contenedor»](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries) — cómo se declara un contenedor consultable, la sintaxis de `@container` y por qué una consulta no puede cambiar su propio contenedor. Consultado el 7 de octubre de 2026.
