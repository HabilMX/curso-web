# Lección 4 — Acomodar con Flexbox y Grid

**Tiempo:** dos sesiones de unos 90 min. Un reparto que funciona: la primera, «El porqué antes del cómo» y Flexbox (4.1), con la barra de controles; la segunda, Grid (4.2), el panel acomodado, llevarlo a tu `revisor` (4.2.5) y los ejercicios. Cada sesión termina en una página que puedes abrir y medir.

**Qué construyes:** el panel acomodado en una pantalla ancha

**Qué aprendes:** una dimensión con Flexbox y dos con Grid; los dos ejes, `gap`, `flex` y `flex-wrap`; columnas con `fr` y `repeat()`; medir con las herramientas del navegador en vez de a ojo

**De dónde vienes.** Traes el panel de la [Lección 2](02-html-con-significado.md), escrito a mano con HTML que dice qué es cada cosa, y la hoja de estilos de la [Lección 3](03-css-cascada-caja.md), con sus variables de color, su caja predecible y sus insignias de estado. Esa hoja **todavía no acomoda nada**: cada elemento va debajo del anterior, que es lo que hace el navegador cuando nadie le pide otra cosa. Si por cualquier razón tu copia no coincide con la de esas lecciones, no importa: la página `fig04_01.html` y su hoja `fig04_01/styles.css` son exactamente ese punto de partida, y la tienes completa más abajo. Todas las páginas de esta lección están en [`programas/04-flexbox-grid/`](https://github.com/HabilMX/curso-web/tree/main/programas/04-flexbox-grid) del [repositorio del curso](https://github.com/HabilMX/curso-web). Fíjate en un detalle antes de abrirlas: todas menos el panel acomodado cargan la hoja de partida con `<link rel="stylesheet" href="fig04_01/styles.css">`, una ruta *relativa* que el navegador busca en la carpeta `fig04_01` junto a la página. Por eso funcionan si descargas (o clonas con Git) el repositorio completo y enciendes el servidor desde su carpeta `programas/`, o si copias cada página **junto con** la carpeta `fig04_01`. Si copias solo el `.html`, la página se verá sin estilos: el navegador pidió `fig04_01/styles.css`, el servidor respondió `404` y la pestaña Red de las herramientas te lo muestra en rojo. La `fig04_06.html`, el panel acomodado con que termina la lección, usa de igual modo su propia hoja, `fig04_06/styles.css`. Para esta lección trabajas con dos archivos de tu carpeta `revisor`, `index.html` y `css/styles.css`, y, para los experimentos sueltos, con páginas de prueba a su lado. Desde la carpeta del proyecto, el servidor local sigue siendo `python3 -m http.server 8000 --bind 127.0.0.1`.

**Qué no hace esta lección.** No resuelve todavía el teléfono: que la página sirva a 320 píxeles de ancho es el tema completo de la [Lección 5](05-pagina-adaptable.md), que parte justo de donde termina esta. Tampoco toca JavaScript. Las cifras del resumen siguen escritas a mano; las contará un programa en la Lección 6 y las dibujará en la tabla la Lección 7. Hoy solo cambia *dónde* va cada cosa y *cuánto mide*, no *qué* dice.

## Al terminar vas a poder

- Explicar qué son un contenedor flex, sus elementos y sus dos ejes, y predecir qué hacen `justify-content` y `align-items` antes de recargar.
- Escribir una barra de controles con `display: flex`, `flex-wrap`, `gap`, `align-items` y `flex`, y decir quién se queda con el espacio que sobra.
- Leer la propiedad `flex` como base, crecer y encoger, y reconocer cuándo un elemento se niega a encogerse y cómo se le permite.
- Elegir Flexbox cuando el reparto es en una sola dimensión y Grid cuando son dos, y justificar la elección con el panel delante.
- Declarar una rejilla con `grid-template-columns`, la unidad `fr` y `repeat()`, y explicar de dónde salen las filas que no declaraste.
- Medir con las herramientas del navegador dónde empieza y dónde termina cada caja, en vez de juzgar a ojo.
- Mantener el orden del HTML como orden de lectura, sin reacomodar con `order` lo que el teclado recorre.

## El porqué antes del cómo

Abre `fig04_01.html` en tu servidor local, con la ventana del navegador bien ancha, como la de una computadora de escritorio. Lo que ves es el panel tal como lo dejó la Lección 3: legible, con sus colores y sus insignias, pero **acomodado como una lista de compras**. El título, la fecha y los enlaces de navegación van uno debajo del otro, aunque sobra espacio para ponerlos en una sola línea. Las cuatro cifras del resumen son cuatro renglones, uno debajo del otro, cada uno a todo lo ancho. El campo de búsqueda, los filtros y el botón también van apilados. Y la tabla queda hasta abajo, después de todo lo demás.

Mídelo en vez de suponerlo. Lo medí con Chrome 154, de forma automatizada y sin ventana, con la ventana a 1440 píxeles: el contenido es una columna de 60 rem (960 px) centrada, y dentro de ella **cada caja ocupa todo el ancho que tiene**: el título, la fecha y la navegación miden 928 px cada uno, y dentro de las secciones, con su relleno, la cifra «Caídos» mide 878 px, igual que la tabla y que el párrafo donde vive el botón «Revisar ahora». El botón no: mide unos 135 px, porque un botón es un elemento en línea y solo ocupa lo que necesita su texto; lo que se estira es el párrafo que lo contiene. Nada se desborda y nada está mal escrito, pero el espacio se desperdicia: para llegar a la tabla, que es lo que quien abre el panel viene a ver, hay que pasar por tres renglones de encabezado, cuatro cifras y tres controles, cada uno en su propio renglón. Las cuatro cifras cabrían de sobra en una sola fila, y los tres controles también.

La causa es una sola. **Hasta ahora, el panel no decide cómo acomodar lo que lleva dentro.** Un bloque va debajo de otro porque es lo que hace el flujo normal de la página, y cada caja mide todo el ancho porque nadie le dijo otra cosa. Esta lección le enseña a decidir con las dos herramientas que CSS tiene para eso: **Flexbox**, para repartir cosas a lo largo de una línea, y **Grid**, para acomodarlas en filas y columnas a la vez.

Una advertencia honesta desde el principio, para que no te tome por sorpresa: al terminar esta lección, el panel se verá bien en una pantalla ancha, y todavía **no** en un teléfono. Si achicas la ventana a 320 píxeles, la página se sigue desbordando. Eso no es un descuido: es un problema distinto, con sus propias herramientas, y ocupa la lección siguiente completa. Aquí aprendes a acomodar; en la Lección 5, a que el acomodo sirva en cualquier ancho.

### Cómo vas a comprobar

Un acomodo se juzga mal a ojo: dos cajas que «parecen» del mismo ancho difieren por veinte píxeles, y un hueco que «parece» parejo no lo es. Por eso en esta lección vas a medir, y la herramienta ya la tienes: las herramientas del navegador que conociste en la Lección 1.

Ábrelas con `F12` y entra a la pestaña de elementos (en Chrome y Edge se llama «Elementos»; en Firefox, «Inspector»). Pasa el cursor sobre cualquier etiqueta del árbol del documento: el navegador sombrea esa caja en la página y muestra una etiqueta pequeña con su nombre y sus medidas, por ejemplo, en `fig04_01.html` a 1440 px, `dl 878 × 297.38` para la lista del resumen. El primer número es el ancho y el segundo el alto, en píxeles CSS. Si haces clic en la etiqueta, el panel de la derecha te muestra en la sección «Computado» (o «Calculado») su caja completa: contenido, relleno, borde y margen. Y cuando un elemento es un contenedor flex o grid, el árbol le pone al lado una pequeña insignia que dice `flex` o `grid`; al hacer clic en ella, el navegador dibuja sobre la página las líneas de la rejilla o el contorno de cada elemento flex. Esa insignia es la forma más rápida de saber si una propiedad de acomodo está actuando o no.

Para saber dónde **empieza** y dónde **termina** una caja, que es lo que vas a usar para comprobar la mayoría de los resultados de esta lección, sirve el modo adaptable (el icono de teléfono y tableta en Chrome y Edge; `Ctrl`+`Shift`+`M` en Firefox): ahí escribes el ancho exacto de la ventana, y la regla de arriba te da las posiciones. Cuando en esta lección leas «el título va de 256 a 553 px», significa que su borde izquierdo está a 256 píxeles del borde izquierdo de la ventana y su borde derecho a 553: lo mismo que verías al pasar el cursor sobre él con la ventana a ese ancho.

## Los conceptos

Dos ideas, en este orden: **Flexbox**, que acomoda cosas en una línea, y **Grid**, que acomoda cosas en filas y columnas a la vez. Cada una se explica primero con un ejemplo mínimo, en una página de prueba que puedes abrir y medir, y después se aplica al panel.

### 4.1 Flexbox: acomodar en una dimensión

#### 4.1.1 Contenedor, elementos y los dos ejes

Por omisión, los hijos de un elemento se acomodan según el **flujo normal**: los elementos de bloque (`<p>`, `<div>`, `<section>`) van uno debajo de otro y ocupan todo el ancho disponible, y los de línea (`<span>`, `<a>`, `<label>`) fluyen como las palabras de un renglón. El flujo normal es la razón por la que el panel de la lección anterior es una columna larga.

[**Flexbox** es un modo de acomodo alternativo](https://www.w3.org/TR/css-flexbox-1/) que se activa con una sola declaración sobre el *padre*:

```css
.container {
  display: flex;
}
```

Con ella, el padre se vuelve un **contenedor flex** y sus hijos directos se vuelven **elementos flex**. Solo los hijos directos: los nietos no se enteran. Lo primero que se nota es que los hijos, que antes iban uno debajo de otro, ahora van uno al lado de otro, en una fila. Pero lo importante no es la fila: es que el contenedor ahora **reparte el espacio** entre sus hijos, y tú le dices cómo.

Flexbox trabaja con dos ejes, y casi todos los errores de principiante vienen de confundirlos. El **eje principal** es la dirección en que se acomodan los elementos; el **eje transversal** es el perpendicular. Con el valor por omisión, `flex-direction: row`, el eje principal es horizontal (de izquierda a derecha en español) y el transversal es vertical. Si escribes `flex-direction: column`, se intercambian: el principal pasa a ser vertical. Dos propiedades se apoyan en esa distinción, y por eso vale la pena aprenderla antes que los nombres:

- `justify-content` reparte los elementos **a lo largo del eje principal**.
- `align-items` los alinea **a lo ancho del eje transversal**.

Abre `fig04_02.html` para verlo. Es una página de prueba con dos cajas de líneas punteadas, cada una con tres elementos azules de alturas distintas:

```html
<!-- fig04_02.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Los dos ejes de Flexbox</title>
  <link rel="stylesheet" href="fig04_01/styles.css">
  <style>
    .box {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      gap: 0.5rem;
      height: 9rem;
      padding: 0.5rem;
      background: var(--color-surface);
      border: 2px dashed var(--color-border);
    }

    .box > div {
      padding: 0.5rem 1rem;
      color: #ffffff;
      background: var(--color-accent);
      border-radius: var(--radius);
    }

    .box > div:nth-child(2) { height: 5rem; }
    .box > div:nth-child(3) { height: 2.5rem; }

    .box-column {
      flex-direction: column;
      align-items: flex-start;
      height: 14rem;
    }
  </style>
</head>
<body>
  <main>
    <h1>Los dos ejes</h1>

    <h2>flex-direction: row (el eje principal es horizontal)</h2>
    <div class="box">
      <div>Uno</div>
      <div>Dos</div>
      <div>Tres</div>
    </div>

    <h2>flex-direction: column (el eje principal es vertical)</h2>
    <div class="box box-column">
      <div>Uno</div>
      <div>Dos</div>
      <div>Tres</div>
    </div>
  </main>
</body>
</html>
```

En la primera caja (`row`), `justify-content: space-between` pega «Uno» al borde izquierdo, «Tres» al borde derecho y deja «Dos» en medio, con el espacio sobrante repartido en los huecos. `align-items: center` centra los tres verticalmente, por eso aunque tienen alturas diferentes todos comparten la misma línea central. En la segunda caja cambia solo la dirección: el eje principal es ahora vertical, de modo que `justify-content: space-between` reparte hacia abajo («Uno» arriba, «Tres» abajo) y `align-items: flex-start` pega todo al borde izquierdo, que ahora es el borde del eje transversal. **Las propiedades no cambiaron de significado: cambiaron de dirección.** Eso es lo que significa «los ejes».

Los valores que más vas a usar son pocos:

| Propiedad | Valor | Qué hace |
|---|---|---|
| `justify-content` | `flex-start` (por omisión) | Pega los elementos al inicio del eje principal |
| `justify-content` | `center` | Los junta en el centro |
| `justify-content` | `space-between` | Primero al inicio, último al final, el resto repartido entre ellos |
| `justify-content` | `flex-end` | Los pega al final |
| `align-items` | `stretch` (por omisión) | Cada elemento se estira hasta llenar el eje transversal |
| `align-items` | `flex-start` / `center` / `flex-end` | Alinea al inicio, al centro o al final del eje transversal |
| `align-items` | `baseline` | Alinea por la línea base del texto, útil cuando los tamaños de letra difieren |

Un detalle útil: el valor por omisión de `align-items` es `stretch`, y por eso, en cuanto activas `display: flex`, los elementos de una fila **que no tienen una altura propia** se estiran hasta la altura de la fila y se vuelven todos igual de altos. Es un efecto secundario que sorprende la primera vez. La condición importa: [`stretch` solo estira a quien tiene la altura en `auto`](https://developer.mozilla.org/en-US/docs/Web/CSS/align-items#stretch); un elemento con `height` escrita conserva la suya y se queda pegado al inicio del eje transversal. Lo medí quitándole a la primera caja de `fig04_02.html` el `align-items: center`, para que quede el `stretch` por omisión: la caja mide 144 px por fuera y le quedan 124 por dentro, descontados su relleno y su borde. «Uno», que no tiene altura propia, se estiró a esos 124 px; «Dos» y «Tres», que la tienen escrita (`5rem` y `2.5rem`), se quedaron en 80 y 40 px, pegados arriba.

#### 4.1.2 El espacio entre elementos: `gap`

Entre los elementos flex hay que dejar aire. La costumbre antigua era ponerle un `margin` a cada hijo, y se tropezaba con dos problemas: el último elemento queda con un margen de sobra, y cuando los elementos bajan de renglón hay que adivinar qué márgenes sobran. [La propiedad `gap`, que se escribe en el contenedor](https://www.w3.org/TR/css-align-3/), resuelve las dos cosas: pone el espacio solo *entre* elementos, nunca en los bordes, y lo mismo en horizontal que en vertical. Puedes dar un valor (`gap: 1rem`) o dos (`gap: 0.5rem 1rem`: primero el espacio entre renglones, luego el espacio entre columnas).

`gap` funciona en Flexbox y en Grid, y hoy es una de las cosas que puedes usar sin miedo, aunque llegó a los dos en fechas distintas, y conviene saberlo porque vas a ver código viejo con márgenes en su lugar. En Grid, [MDN lo marca como disponible en todos los navegadores desde octubre de 2017](https://developer.mozilla.org/en-US/docs/Web/CSS/gap). En Flexbox tardó más: [el último navegador en aceptarlo fue Safari 14.1, en abril de 2021](https://web-platform-dx.github.io/web-features-explorer/features/flexbox-gap/), y la plataforma lo da por de disponibilidad general (*widely available*, que significa «disponible en todos desde hace al menos 30 meses») desde octubre de 2023. La regla que seguirás en este curso es sencilla: **la separación entre hermanos la pone el padre con `gap`; los márgenes se reservan para separar un bloque del que no es su hermano.**

#### 4.1.3 Cuánto mide cada elemento: `flex`

Hasta aquí repartimos el espacio *sobrante*. Falta decir qué pasa cuando los elementos no caben, o cuando sobra y alguno debe aprovecharlo. Tres números controlan eso, y se escriben juntos en la propiedad `flex`:

```css
flex: <flex-grow> <flex-shrink> <flex-basis>;
```

- La **base** (`flex-basis`) es el tamaño de partida del elemento sobre el eje principal. Con `auto` es el que tendría por su propiedad de tamaño en ese eje —`width` en una fila, `height` en una columna ([así lo define la especificación](https://www.w3.org/TR/css-flexbox-1/#flex-basis-property))— o, si no tiene, por su contenido.
- **Crecer** (`flex-grow`) dice cuánto del espacio sobrante recibe el elemento. Con `0` no recibe nada. Con `1`, todos los elementos que valen `1` se reparten el sobrante en partes iguales; uno con `2` recibe el doble que uno con `1`.
- **Encoger** (`flex-shrink`) dice cuánto cede el elemento cuando falta espacio. Con `0` no cede nunca; con `1` cede en proporción.

Los valores iniciales son `0 1 auto`: no crece, sí encoge, mide lo que mide su contenido. Por eso, sin que lo pidas, un contenedor flex lleno de elementos se aprieta antes de desbordar. Hay atajos que conviene reconocer: `flex: 1` significa `1 1 0` («ocupa todo lo que sobre, desde cero»), `flex: auto` es `1 1 auto`, y `flex: none` es `0 0 auto` («tamaño fijo»).

Tiene una trampa que cuesta una tarde la primera vez. Un elemento flex **no encoge por debajo del tamaño mínimo de su contenido**: una palabra larga sin espacios, una imagen, un campo de texto con un ancho fijo. [MDN lo describe así](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox): un elemento puede encogerse hasta su tamaño `min-content` y no más. Cuando eso pasa, el elemento se queda ancho y el contenedor desborda. La solución tiene dos partes: decirle al elemento que sí puede encogerse más, con `min-width: 0` (en una fila; en una columna, donde el eje principal es vertical, la propiedad equivalente es `min-height: 0`), y darle a su contenido una manera de caber en menos espacio (cortarlo con puntos suspensivos o dejar que baje de renglón). Con la primera parte sola, el elemento se encoge pero el texto se sale de él.

Míralo en `fig04_03.html`. Son dos renglones iguales, cada uno con el nombre de un servicio, su dirección (una URL larga, que no tiene espacios donde partirse) y la insignia de estado. La dirección lleva tres declaraciones que piden «si no cabes, córtate con puntos suspensivos»: `overflow: hidden`, `white-space: nowrap` y `text-overflow: ellipsis`. La única diferencia entre los dos renglones es la clase `can-shrink`, que agrega `min-width: 0` a la caja del nombre:

```html
<!-- fig04_03.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>El mínimo de un elemento flex</title>
  <link rel="stylesheet" href="fig04_01/styles.css">
  <style>
    .service {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.5rem;
      border: 2px dashed var(--color-border);
    }

    .service-name {
      flex: 1 1 auto;
    }

    .service-name h2,
    .service-name p {
      margin: 0;
    }

    .address {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: var(--color-muted);
    }

    .can-shrink {
      min-width: 0;
    }
  </style>
</head>
<body>
  <main>
    <h1>El mínimo de un elemento flex</h1>

    <div class="service" id="one">
      <div class="service-name">
        <h2>Inventario</h2>
        <p class="address">https://inventario.example.com/salud/v2/estado-completo</p>
      </div>
      <span class="status status-down">Caído</span>
    </div>

    <div class="service" id="two">
      <div class="service-name can-shrink">
        <h2>Inventario</h2>
        <p class="address">https://inventario.example.com/salud/v2/estado-completo</p>
      </div>
      <span class="status status-down">Caído</span>
    </div>
  </main>
</body>
</html>
```

Lo medí a 320 px, el ancho de un teléfono pequeño. En el primer renglón, la caja del nombre se niega a medir menos que la URL completa (417 px), empuja la insignia fuera de la pantalla y la página mide **514 px**: desborda, aunque la dirección «sabe» cortarse. El motivo es el de arriba: el mínimo automático de un elemento flex es el ancho de su contenido, y la URL entera es ese contenido. En el segundo renglón, con `min-width: 0`, la caja del nombre baja a 197 px, la URL se corta con «…» y la insignia queda dentro, a 26 px del borde derecho de la ventana. A 768 px o más los dos renglones se ven iguales, porque ahí la URL cabe completa: la trampa solo aparece cuando falta espacio, y por eso pasa desapercibida en la pantalla de quien programa.

En el panel de esta lección no hace falta: ningún elemento flex del panel tiene un contenido que se niegue a encogerse. Pero la idea vuelve en la Lección 5 con otro nombre: una columna `1fr` de Grid tiene el mismo mínimo automático, y la solución, `minmax(0, 1fr)`, es la misma idea de escribir el mínimo cero a propósito.

#### 4.1.4 `flex-wrap`: bajar de renglón en vez de apretarse

Por omisión, un contenedor flex tiene `flex-wrap: nowrap`: todos los elementos van en **un solo renglón**, y si no caben, se encogen (y si ya no pueden encogerse, desbordan). Con `flex-wrap: wrap`, los elementos que no caben **bajan al renglón siguiente**. MDN lo dice con una frase útil: cuando hay varios renglones, cada uno se comporta como un contenedor flex aparte. Eso significa que `justify-content` y `flex-grow` actúan dentro de cada renglón, no sobre el conjunto.

La decisión de quién cabe en qué renglón se toma con la *base* de cada elemento, antes de crecer o encoger, pero ajustada por sus límites: si la base es menor que su `min-width` (o mayor que su `max-width`), cuenta el límite, y también cuentan sus márgenes. [La especificación](https://www.w3.org/TR/css-flexbox-1/#algo-line-break) lo llama *tamaño principal hipotético*. Lo medí en Chrome 154: dos elementos con base de 200 px caben juntos en una fila de 500 px; si al segundo le pones `min-width: 320px`, baja al renglón siguiente, aunque su base no cambió. Aquí está el truco que sostiene casi todo lo «adaptable» sin escribir una sola consulta de medios, y que la Lección 5 va a aprovechar a fondo: **si le das a un elemento una base razonable y le permites crecer, el navegador se ocupa de acomodarlo**. Una base de `14rem` dice «prefiero medir unos 224 px; ponme en un renglón con quien quepa a mi lado; si sobra espacio, repártelo». En una pantalla ancha, caben varios en el renglón; en una angosta, cada uno baja y ocupa su renglón entero. Nadie escribió «a 600 px haz tal cosa»: el contenido decide.

#### 4.1.5 Ejemplo resuelto: la barra de controles

La sección «Servicios» del panel tiene hoy tres controles uno debajo de otro: el campo de búsqueda con su etiqueta, el grupo de filtros (los tres botones de radio) y el botón «Revisar ahora». En una pantalla ancha lo natural es una sola fila; en un teléfono, tres renglones. Es el caso perfecto para Flexbox, porque son hermanos que se reparten *una* línea.

Primero hay que preparar el HTML. Ya tienes los tres controles; hay que envolverlos en un contenedor con nombre para poder apuntarle desde el CSS. Y el campo con su etiqueta se agrupa para que viajen juntos. Este es el único cambio de HTML de este paso:

```html
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
```

Observa lo que *no* se tocó: los elementos siguen siendo los de la Lección 2, con sus etiquetas asociadas. Lo único nuevo es un `div` contenedor y una clase. El significado no cambió; solo se agregó un lugar al cual apuntar. Ahora el CSS:

```html
<!-- fig04_04.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Barra de controles con Flexbox</title>
  <link rel="stylesheet" href="fig04_01/styles.css">
  <style>
    .controls {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      gap: 1rem;
    }

    .controls p,
    .controls fieldset {
      margin: 0;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      flex: 1 1 14rem;
    }

    .field input {
      width: 100%;
    }
  </style>
</head>
<body>
  <main>
    <h1>Barra de controles</h1>
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
  </main>
</body>
</html>
```

Línea por línea:

- `.controls { display: flex; flex-wrap: wrap; ... }` activa Flexbox y permite bajar de renglón. Los tres hijos directos (el campo, el grupo y el botón) son ahora elementos flex.
- `align-items: flex-end` los alinea por su borde inferior. Así el campo, el grupo de filtros y el botón comparten la misma base, aunque sus alturas sean distintas, y se ven como una sola barra. Con el valor por omisión, `stretch`, el botón se estiraría hasta la altura del grupo.
- `gap: 1rem` pone el espacio entre ellos, sin márgenes sueltos.
- `.controls p, .controls fieldset { margin: 0 }` quita los márgenes que traían por omisión; ahora el espacio lo pone el padre.
- En `.field`, que es a su vez un contenedor flex, `flex-direction: column` apila la etiqueta sobre el campo, y `flex: 1 1 14rem` le dice al campo: «mide 14rem de base, puedes crecer, puedes encogerte». Es el único de los tres que crece, y por eso absorbe el espacio sobrante de la fila.
- `.field input { width: 100% }` hace que el campo llene a su contenedor. Sin esta línea, el párrafo `.field` crecería, pero el campo se quedaría con el ancho que el navegador le da por omisión a un campo de texto, y el espacio ganado quedaría vacío a su derecha.

Cargué esta página en cinco anchos (320, 375, 768, 1024 y 1440 px) y en los cinco el ancho de la página es igual al de la ventana: la barra no desborda en ninguno. A 320 y a 375 px los controles forman tres renglones; de 768 px en adelante, una sola fila, con el campo ocupando todo lo que sobra. A 1440 px lo medí pieza por pieza: el campo va de 256 a 672.5 px (416.5 de ancho, mucho más que su base de 224), el grupo de radios de 688.5 a 1033 y el botón de 1049 a 1184, pegado al borde derecho del contenido. Entre pieza y pieza, los 16 px del `gap`.


Hay una propiedad de Flexbox de la que debes saber, justamente para no usarla a la ligera: `order`. Permite cambiar el orden *visual* de los elementos sin mover el HTML. El problema es que el teclado y el lector de pantalla siguen el orden del **código**, no el de la pantalla: quien navega con Tab saltaría de un lado a otro de la barra sin entender por qué. Eso incumple el [criterio 1.3.2 («Secuencia significativa»)](https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html) y [el 2.4.3 («Orden del foco»)](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html) de las pautas. Regla del curso: **el orden del HTML es el orden de lectura; si una caja debe ir primero, se escribe primero.**

### 4.2 Grid: acomodar en dos dimensiones

#### 4.2.1 Flexbox o Grid: la pregunta que lo decide

Flexbox acomoda en **una línea** (con renglones que bajan si lo permites). [Grid acomoda en **filas y columnas a la vez**](https://www.w3.org/TR/css-grid-2/): define una rejilla y coloca cada elemento en una celda. Se parecen en que los dos empiezan con una declaración `display` en el padre y los dos aceptan `gap`. Se diferencian en quién manda.

En Flexbox **manda el contenido**: los elementos son los que piden espacio y el contenedor lo reparte. Por eso es perfecto para una barra de controles, un encabezado con título y fecha, una fila de botones: grupos de cosas cuyo tamaño depende de lo que dicen. En Grid **manda la rejilla**: las columnas existen primero, y los elementos se acomodan en ellas, de modo que quedan alineados tanto en horizontal como en vertical. Por eso es perfecto para tarjetas de resumen, un tablero de cifras o el esqueleto de la página.

Una pregunta práctica para decidir: *¿quiero que las cosas de la segunda fila queden alineadas con las de la primera?* Si sí, es Grid. Si cada renglón se acomoda por su cuenta, es Flexbox. Y no son excluyentes: en el panel vas a usar las dos, una dentro de la otra.

#### 4.2.2 Columnas, `fr` y `repeat()`

Para activar Grid se escribe `display: grid` en el padre, y se le dice cuántas columnas tiene con `grid-template-columns`:

```css
.summary {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.75rem;
}
```

La unidad nueva es `fr`, de *fracción*: «una parte del espacio disponible». Tres columnas de `1fr` reparten el ancho en tres partes iguales; `1fr 2fr` daría a la segunda el doble que a la primera; `200px 1fr` fija la primera columna y deja a la segunda con todo lo demás. Repetir tres veces lo mismo cansa, y por eso existe `repeat()`: `repeat(3, 1fr)` es lo mismo que `1fr 1fr 1fr`.

No hace falta decirle cuántas filas hay. Si hay seis elementos y tres columnas, el navegador crea dos filas solo. [MDN las llama la **rejilla implícita**](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Basic_concepts_of_grid_layout): la que se extiende cuando hay contenido fuera de lo que declaraste (la declarada es la *explícita*). Su altura se controla con `grid-auto-rows`; por omisión, cada fila mide lo que su contenido pida.

Una forma de convencerte de que entendiste la rejilla implícita: con cuatro elementos y `repeat(2, 1fr)`, ¿cuántas filas hay? Dos, de dos elementos cada una, y nadie las declaró. El Ejercicio 2 te pide comprobarlo con las cifras del resumen.

#### 4.2.3 Ejemplo resuelto: el resumen en cuatro columnas

El resumen del panel es el caso de manual para Grid: cuatro cifras que conviene ver juntas, cada una con su nombre arriba y su valor abajo, y alineadas entre sí. Antes del CSS, el HTML. El resumen de la Lección 2 es una lista de descripción (`<dl>`) con cuatro grupos de término y valor, y no hay nada que cambiar en su significado. Solo se le agrega una clase para apuntarle:

```html
<dl class="summary">
```

Tampoco hace falta tocar las cuatro cajas (`div`) que ya envolvían cada par de término y valor: cada una se vuelve un elemento de la rejilla. Esto es lo que pasa cuando el HTML ya tenía la estructura correcta: Grid solo lee lo que ya estaba escrito. La página de prueba `fig04_05.html` declara cuatro columnas iguales:

```html
<!-- fig04_05.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Resumen en cuatro columnas fijas</title>
  <link rel="stylesheet" href="fig04_01/styles.css">
  <style>
    .summary {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
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

Línea por línea: `display: grid` vuelve a la lista un contenedor grid y a sus cuatro `div` en elementos de la rejilla; `grid-template-columns: repeat(4, 1fr)` pide cuatro columnas que se reparten el ancho en partes iguales; `gap: 0 1rem` no deja espacio entre filas (hay una sola) y deja 16 px entre columnas; y `margin: 0` quita el margen que la lista de descripción trae por omisión, para que el espacio lo ponga quien la contiene. Lo medí a 1440 y a 1024 px: las cuatro cifras quedan en una sola fila, cada columna de **220 px** exactos, con 16 px entre una y otra. Las cuentas cuadran: el contenedor mide 928 px, los tres huecos suman 48, y los 880 restantes divididos entre cuatro dan 220.

Una pregunta razonable antes de seguir: *¿cambiar el `display` de un elemento con significado propio le quita su significado?* Lo comprobé en Chrome 154 con el árbol de accesibilidad: la lista de descripción con `display: grid` conserva sus términos y sus definiciones, y hasta una tabla con `display: grid` conserva su rol de tabla. En otros navegadores y con otros lectores de pantalla no hay garantía: [Adrian Roselli, que lleva años midiendo esto](https://adrianroselli.com/2020/11/under-engineered-responsive-tables.html), advierte que cambiar el `display` de una tabla puede quitarle la navegación por celdas a quien usa un lector. Como no hace falta correr el riesgo, la regla del curso es: **no se cambia el `display` de una tabla; se cambia el de su envoltorio**. La Lección 5 lo pone en práctica.

Y ahora la parte honesta del ejemplo. Achica la ventana a 320 px y mide otra vez: las cuatro cifras se aprietan, se parten en varios renglones cada una, y aun así la página **mide 344 px de ancho**, más que la ventana. Cuatro columnas fijas son una buena decisión cuando hay espacio y una mala cuando no lo hay, y `1fr` tiene un mínimo escondido que no deja encogerse a la columna más allá de su palabra más larga. Por qué pasa eso, y la línea de CSS que hace que la rejilla **cuente sola** cuántas columnas caben, son el primer concepto de la Lección 5. Por ahora, quédate con la pregunta que vas a saber contestar al terminarla: *¿cuántas columnas caben a 320 px, y quién debería decidirlo?*

#### 4.2.4 El panel acomodado

Con lo anterior ya tienes todas las piezas para acomodar el panel completo en una pantalla ancha. El panel de la lección es `fig04_06.html`. Los cambios respecto de la Lección 2 son pocos, y ninguno cambia lo que el HTML dice: la clase `page-header` en el encabezado, la clase `summary` en la lista de descripción, y el `div.controls` con su `p.field` alrededor de los tres controles, tal como en 4.1.5. La tabla se queda exactamente igual.

```html
<!-- fig04_06.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Revisor de servicios</title>
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="fig04_06/styles.css">
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

Una advertencia antes de mirar la hoja: el encabezado en fila (`.page-header`) es el paso 1 del Ejercicio 1. Si quieres resolverlo por tu cuenta, hazlo antes de leer el CSS. La hoja es la de la Lección 3 **sin tocar una sola de sus reglas**, con un bloque nuevo al final de la capa `components`; los comentarios señalan dónde empieza:

```css
/* fig04_06/styles.css */
/* La hoja del panel al terminar la Lección 4: la de la Lección 3, sin tocar una
   sola de sus reglas, más un bloque al final con Flexbox y Grid. */

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

El bloque nuevo tiene tres partes, y ya conoces cada una. El encabezado (`.page-header`) es un contenedor flex que reparte sus tres hijos con `space-between`, los alinea por la línea base del texto y les permite bajar de renglón; su párrafo pierde el margen para que la fecha no quede más baja que el título. La barra de controles (`.controls`, `.field`) es la de 4.1.5, con los números cambiados por las variables de espacio de la Lección 3 (`var(--space-3)` es el mismo `1rem`). Y el resumen (`.summary`) es la rejilla de cuatro columnas de 4.2.3. Lo que *no* cambió importa tanto como lo que sí: las capas, las variables, el foco y las insignias son los de la Lección 3. El acomodo se suma a lo que había; no lo reescribe.

Mídelo. A 1440 px, con la herramienta de inspección, el título del encabezado va de 256 a 553 px, la fecha de 617 a 938 y la navegación de 1002 a 1184, pegada al borde derecho del contenido: una sola fila. Las cuatro cifras del resumen quedan en una fila de cuatro columnas de 207.5 px (miden menos que los 220 de la página de prueba porque ahora viven dentro de una sección, con su relleno y su borde). Y la barra de controles es una sola fila, con el campo de 281 a 647.5 px, los radios de 663.5 a 1008 y el botón de 1024 a 1159. Lo que en la página de partida eran diez renglones apilados son ahora tres franjas: el encabezado, el resumen y la barra, con la tabla justo debajo. La tabla, que es lo que se viene a ver, sube más de 400 píxeles: en `fig04_01.html` empezaba a 859 px de la parte de arriba de la página, y en `fig04_06.html` empieza a 419.

A 768 px todo sigue sin desbordar, y el encabezado y la barra ya se reparten en más de un renglón por su cuenta, gracias a `flex-wrap`. A 375 y 320 px, en cambio, la página mide **414 px**: la tabla sigue más ancha que la ventana, como desde la Lección 3, y ahora la acompaña el resumen, cuyas cuatro columnas fijas llegan hasta los 369 px. Ese es el punto exacto donde empieza la Lección 5.

#### 4.2.5 Llévalo a tu `revisor`

Hasta aquí trabajaste con las páginas del repositorio. Falta el paso que convierte lo aprendido en tu proyecto: que **tu** `revisor` quede igual que `fig04_06.html`, medido y guardado en Git. Son cuatro pasos, y ninguno pide escribir nada nuevo.

**1. La hoja.** Abre tu `~/revisor/css/styles.css` y pega al final de la capa `components`, justo antes de la última llave de cierre `}`, el bloque que empieza con el comentario `/* ---- Lección 4: Flexbox y Grid ---- */` (lo tienes completo arriba, o en `fig04_06/styles.css` del repositorio). No borres nada de lo que había: el bloque solo agrega. Si prefieres, puedes reemplazar la hoja entera por `fig04_06/styles.css`, que es la de la Lección 3 con ese bloque; pero si en la Lección 3 le hiciste cambios propios a tu hoja (otro color, otro tamaño), reemplazarla los borraría, y en ese caso conviene pegar solo el bloque.

**2. La página.** En tu `~/revisor/index.html` haz los tres cambios del HTML:

- `<header>` pasa a ser `<header class="page-header">`.
- `<dl>` pasa a ser `<dl class="summary">`.
- El campo de búsqueda, el `<fieldset>` y el párrafo del botón quedan dentro de un `<div class="controls">`, y el párrafo del campo lleva `class="field"`, tal como en 4.1.5. Cuida dónde cierras el `div`: después del párrafo del botón y antes de la tabla.

También puedes copiar `fig04_06.html` completa sobre tu `index.html`, con una precaución: en el repositorio, su `<link>` apunta a `fig04_06/styles.css`; en tu proyecto debe decir `href="css/styles.css"`, como desde la Lección 3. Si no lo cambias, la página se verá sin estilos.

**3. Mide.** Desde la carpeta del proyecto, enciende el servidor:

```bash
$ cd ~/revisor
$ python3 -m http.server 8000 --bind 127.0.0.1
```

Abre `http://127.0.0.1:8000/`, activa el modo adaptable con la ventana a 1440 px y compara tu panel con `fig04_06.html` al mismo ancho: el encabezado en una fila, las cuatro cifras en una fila y la barra de controles en una fila. Pasa el cursor sobre `.summary` en la pestaña de elementos: debe tener la insignia `grid`, y `.controls` y `.page-header` la insignia `flex`. Si alguna no la tiene, es una clase que no se escribió o un `div` que se cerró en otro lugar. No te preocupes si a 320 px tu panel todavía desborda: el de la lección también, y por la misma razón.

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
$ git commit -m "Acomoda el panel con Flexbox y Grid"
$ git status
En la rama main
nada para hacer commit, el árbol de trabajo está limpio
```

El `git commit` imprime una línea con el código del commit y cuántas líneas cambiaron; los números dependen de tus archivos. Con eso, tu `revisor` queda listo para la Lección 5, que parte exactamente de aquí.

La hoja de partida, `fig04_01/styles.css`, es la de la Lección 3 tal cual; la tienes completa a continuación, por si quieres comparar o no tienes la de la lección anterior:

```css
/* fig04_01/styles.css */
/* La hoja del panel tal como la deja la Lección 3, sin un solo cambio: todavía
   no acomoda nada, y cada cosa va debajo de la anterior. */

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
}
```

y la página de partida, `fig04_01.html`, es el panel de la Lección 2 con un `<link>` a esa hoja:

```html
<!-- fig04_01.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Revisor de servicios</title>
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="fig04_01/styles.css">
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

## El error que vas a ver

Los errores de acomodo casi nunca son mensajes: son una página que se ve «mal» sin decir por qué. Los dos que más vas a encontrar con Flexbox se aprenden mejor provocándolos a propósito. El primero no deja ninguna huella en la consola, solo una pista discreta en las herramientas del navegador; el segundo se ve en cuanto la ventana se angosta.

**Un error de acomodo que no avisa: la propiedad que no hace nada.** Abre `fig04_07.html`. Es una barra de tres botones con `justify-content: space-between`, y los botones se quedan pegados a la izquierda, uno tras otro, sin repartirse:

```html
<!-- fig04_07.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Una propiedad de Flexbox sin contenedor</title>
  <link rel="stylesheet" href="fig04_01/styles.css">
  <style>
    .controls {
      justify-content: space-between;
      gap: 0.75rem;
    }
  </style>
</head>
<body>
  <main>
    <h1>Los botones no se reparten</h1>
    <div class="controls">
      <button type="button">Todos</button>
      <button type="button">Disponibles</button>
      <button type="button">Caídos</button>
    </div>
  </main>
</body>
</html>
```

No hay nada en la consola. El navegador no considera esto un error: simplemente ignora la propiedad, porque `justify-content` no tiene efecto en un bloque normal ([solo actúa en contenedores flex, grid o de varias columnas](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/justify-content)), y `.controls` es un bloque normal (falta `display: flex`). Lo que sí hay es una pista en las herramientas del navegador: abre la pestaña de elementos, selecciona `.controls` y mira su panel de estilos; la declaración `justify-content: space-between` aparece atenuada, con un icono de aviso al lado que, al pasar el cursor, explica que la propiedad no tiene efecto porque el elemento no es un contenedor flex ni uno grid. (El texto exacto cambia según el navegador y su idioma; el icono y la declaración atenuada son la señal.) La corrección es una línea: `display: flex`. **Cuando una propiedad de acomodo «no hace nada», lo primero que se revisa es si su padre es un contenedor.**

**El elemento que no se encoge.** El segundo caso es el de 4.1.3, y vale la pena reconocerlo de lejos porque se disfraza: abres `fig04_03.html` a 320 px y aparece una barra de desplazamiento horizontal, aunque el texto largo tiene todo lo necesario para cortarse con puntos suspensivos. La señal es que el elemento que se pasa del borde es el **contenedor** del texto, no el texto: al pasar el cursor por la pestaña de elementos, la caja `.service-name` del primer renglón mide 417 px en una ventana de 320. Un elemento flex no se encoge por debajo de su contenido mínimo, y una URL sin espacios es un contenido mínimo enorme. La corrección son las dos partes que ya conoces: `min-width: 0` en el elemento flex, y una manera de caber para su contenido. Si solo pones la segunda, el texto «sabe» cortarse, pero su caja nunca se lo pide.

## Lo que se hace mal

**Separar a los hermanos con márgenes en cada hijo.** `margin-right: 1rem` en cada botón de una barra. El último queda con un margen que sobra, y cuando la barra baja de renglón los márgenes ya no coinciden con los huecos. Costo: ajustes con `:last-child` y números mágicos que nadie entiende un mes después. Corrección: el espacio entre hermanos lo pone el padre con `gap`.

**Poner la propiedad de acomodo en el hijo y no en el padre.** `justify-content` o `grid-template-columns` en cada tarjeta, en vez de en el contenedor que las reparte. No hacen nada, y no hay error que lo diga: es el caso de `fig04_07.html` con otro disfraz. Antes de escribir una propiedad de acomodo, pregúntate quién reparte; ahí va.

**Usar `order` para reacomodar lo que se lee.** Reordenar con CSS algo que el teclado recorre en otro orden. Costo: Tab salta de un lado a otro y un lector de pantalla lee en un orden que no coincide con lo que se ve. Se arregla escribiendo el HTML en el orden en que debe leerse.

**Anchos fijos en píxeles para todo.** `width: 640px` en una columna, `input { width: 20rem }` en un campo. Se ven bien en la pantalla de quien los escribió y estorban en cualquier otra. El panel se salvó de esto porque la hoja de la Lección 3 no le dio a nada un ancho fijo, y la barra de controles de esta lección tampoco: le dio al campo una **base** (`14rem`) que puede crecer y encogerse, que no es lo mismo que un ancho. La alternativa a un número escrito: `width: 100%`, `max-width`, o dejar el ancho a `flex` y a `grid`.

## Ejercicios

### Ejercicio 1 — El encabezado en una fila

El `<header>` del panel tiene tres hijos: el título `<h1>`, el párrafo de «Última revisión» y el `<nav>` con los dos enlaces. En `fig04_01.html` van uno debajo de otro. Usa Flexbox, sin tocar el HTML, en dos pasos:

1. Hazlos una fila, con el título pegado a la izquierda, el `<nav>` pegado al borde derecho y la fecha repartida entre los dos, de modo que en un teléfono estrecho bajen de renglón en vez de apretarse.
2. Ahora cambia de idea: el título a la izquierda y **los otros dos juntos** al borde derecho, uno al lado del otro.

Mide los dos pasos a 1440 y a 320 px con las herramientas, mirando dónde empieza y dónde termina cada hijo, y comprueba que a 320 px el encabezado no se sale de la ventana.

### Ejercicio 2 — Dos columnas, dos filas

Copia `fig04_05.html` y cambia `repeat(4, 1fr)` por `repeat(2, 1fr)`. Antes de recargar, **predice**: ¿cuántas filas habrá, quién las declaró y cuánto medirá cada tarjeta a 1440 px? Después mide a 1440, 768 y 320 px. ¿Desborda la página a 320 px como desbordaba la de cuatro columnas? Explica por qué sí o por qué no.

### Ejercicio 3 — Quién se queda con lo que sobra

En `fig04_04.html`, a 1440 px, el campo de búsqueda mide mucho más que su base de 14 rem. Cambia su `flex: 1 1 14rem` por `flex: 0 1 14rem` (solo el primer número). Predice qué le pasa al campo, al botón y al espacio que sobra; después mide el ancho del campo y la posición del botón, y explica la diferencia con lo que dice cada uno de los tres números de `flex`.

## Soluciones

### Solución 1

**Paso 1.** El encabezado necesita tres cosas: que sea contenedor flex, que baje de renglón y que los hijos se repartan. Con `justify-content: space-between` el primer hijo queda a la izquierda, el último a la derecha y el del centro, entre los dos. Es lo mismo que hace la regla `.page-header` de la hoja del panel, que en vez del nombre del elemento usa una clase y en vez de los números, las variables de espacio:

```css
header {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.25rem 1rem;
}
```

Con `flex-wrap: wrap`, cuando los tres no caben en un renglón, el último baja solo, sin consulta de medios. Los dos valores de `gap` separan los renglones (0.25 rem) menos que las columnas (1 rem). La alineación `baseline` pone el título y los textos pequeños sobre la misma línea de texto, que se ve mejor que alinear por el borde inferior de las cajas. Lo medí en `fig04_06.html`: a 1440 px el título va de 256 a 553 px, la fecha de 617 a 938 y el `<nav>` de 1002 a 1184, pegado al borde derecho del contenido; a 320 px los tres bajan, uno por renglón, y el encabezado mide justo los 320 px de la ventana.

**Paso 2.** `space-between` no sirve para juntar a los dos de la derecha: reparte el sobrante en *todos* los huecos, y por eso la fecha queda en medio. Lo que hace falta es que el sobrante vaya a un solo hueco, el que está después del título. Eso lo hace un **margen automático**: en un contenedor flex, [un margen `auto` se queda con todo el espacio sobrante](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Aligning_items_in_a_flex_container) de su lado, y empuja a los que vienen después hasta el final. Se cambian dos líneas:

```css
header {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: flex-start;
  gap: 0.25rem 1rem;
}

header h1 {
  margin-right: auto;
}
```

`justify-content` vuelve a su valor de partida, que no reparte nada, y el `margin-right: auto` del título absorbe todo el espacio libre del renglón. Medido igual, a 1440 px: el título sigue de 256 a 553, la fecha pasa a ir de 665 a 986 y el `<nav>` de 1002 a 1184; entre los dos quedan justo los 16 px del `gap`. A 320 px el resultado es el mismo que en el paso 1 (uno por renglón). La otra salida, agrupar la fecha y el `<nav>` en un `div` propio, también funciona, pero cambia el HTML para resolver algo que es solo de acomodo.

El panel de la lección se queda con el paso 1: la fecha en medio separa visualmente el título de la navegación. Las dos son correctas; lo que importa es saber cuál pediste y con qué herramienta se logra cada una.

### Solución 2

Hay **dos filas** de dos tarjetas cada una, y nadie las declaró: `grid-template-columns` solo habla de columnas, y cuando los cuatro elementos no caben en las dos columnas declaradas, el navegador crea la segunda fila por su cuenta. Es la rejilla implícita de 4.2.2. Lo medí: a 1440 px cada tarjeta mide **456 px** (928 menos un hueco de 16, entre dos); a 768 px, 360; y a 320 px, 136, sin desbordar: la página mide 320.

¿Por qué esta no desborda y la de cuatro columnas sí? Porque el mínimo escondido de `1fr` sigue ahí, pero ahora solo tiene que caber la mitad de las palabras largas en cada fila: dos columnas con su piso, más un hueco, caben en los 288 px que deja la página. Fíjate en lo que eso enseña: el número de columnas que conviene **depende del ancho**, y escribirlo a mano obliga a elegir uno solo para todos los anchos. Que la rejilla lo cuente sola es justo lo que aprenderás en la Lección 5.

### Solución 3

Con `flex: 0 1 14rem` el campo **deja de crecer**: mide su base, 224 px, en vez de los 416.5 que medía. El grupo de radios y el botón no cambian de tamaño (ninguno crecía), así que se recorren a la izquierda: el botón, que terminaba en 1184 px, pegado al borde derecho del contenido, ahora termina en 991.5. Los 192.5 px que sobran se quedan vacíos al final del renglón.

Los tres números lo explican. El primero, *crecer*, dice cuánto del sobrante recibe el elemento; con `1`, el campo era el único que pedía sobrante y se lo llevaba todo, y con `0` nadie lo pide y se queda donde cae (al final, porque `justify-content` vale `flex-start`). El segundo, *encoger*, sigue en `1`: si la barra se angosta, el campo todavía cede. El tercero, la *base*, no cambió: 14 rem. Por eso en la barra del panel el campo lleva `1` al principio: es la pieza que conviene que aproveche el espacio, porque un campo de búsqueda más ancho deja ver más de lo que se escribe.

## Cómo sé que lo logré

- [ ] Puedes decir, antes de recargar, qué hacen `justify-content: space-between` y `align-items: center` en una fila, y qué cambia con `flex-direction: column`; `fig04_02.html` te da la razón.
- [ ] `fig04_04.html` a 1440 px es una sola fila con el campo ocupando lo que sobra, y a 320 px son tres renglones, sin desbordar.
- [ ] Puedes explicar por qué el primer renglón de `fig04_03.html` desborda a 320 px y el segundo no.
- [ ] En `fig04_06.html` a 1440 px el encabezado, el resumen y la barra son tres franjas de una fila cada una, y la herramienta de inspección muestra la insignia `grid` en `.summary` y `flex` en `.page-header` y `.controls`.
- [ ] Con Tab, el foco pasa en el mismo orden que en la Lección 3: enlace «Resumen», enlace «Servicios», campo de búsqueda, grupo de radios y botón «Revisar ahora». El acomodo no cambió el orden de lectura.
- [ ] Puedes decir con una pregunta cuándo usar Flexbox y cuándo Grid, y poner un ejemplo del panel para cada uno.
- [ ] Tu `~/revisor` (servido desde su carpeta en `http://127.0.0.1:8000/`) se ve igual que `fig04_06.html` a 1440 px, y `git log --oneline` muestra el commit con el acomodo.

## Resumen

Para fijar lo que acabas de ver, responde sin mirar la lección:

1. ¿Qué eje controla `justify-content` y cuál `align-items`? ¿Qué cambia cuando pones `flex-direction: column`?
2. ¿Por qué `gap` es mejor que un margen en cada hijo?
3. ¿Qué significa `flex: 1 1 14rem` en un elemento, dicho con tus palabras?
4. ¿Por qué un elemento flex con una URL larga dentro puede hacer desbordar la página, y qué dos cosas lo arreglan?
5. ¿Cuál es la pregunta que decide entre Flexbox y Grid?
6. Con seis elementos y `repeat(3, 1fr)`, ¿cuántas filas hay y quién las declaró?
7. ¿Por qué no se reacomoda con `order` lo que el teclado recorre?

Si alguna respuesta se te atora, vuelve al apartado correspondiente: es señal de que ahí quedó una pieza floja, no de que no sirvas para esto.

## Para leer más

- [MDN, «Conceptos básicos de Flexbox»](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox) — la explicación de los ejes, `flex-wrap` y los tres valores de `flex`, en la que se apoya esta lección. En inglés, como casi toda la documentación oficial. Consultado el 7 de octubre de 2026.
- [MDN, «Conceptos básicos de Grid»](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Basic_concepts_of_grid_layout) — rejilla explícita e implícita, `fr`, `repeat()` y `minmax()`. Consultado el 7 de octubre de 2026.
- [MDN, «Alinear elementos en un contenedor flex»](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Aligning_items_in_a_flex_container) — `justify-content`, `align-items` y los márgenes automáticos del Ejercicio 1, con dibujos de cada valor. Consultado el 7 de octubre de 2026.
