# Lección 3 — CSS: cascada, especificidad y caja

**Tiempo:** dos sesiones de unos 90 min. Un reparto que funciona: la primera, «El porqué antes del cómo» y la cascada (3.1), con sus figuras para predecir qué regla gana; la segunda, la caja (3.2), las variables (3.3), el panel legible, «El error que vas a ver» y los ejercicios. Cada sesión termina en una página que puedes abrir y medir.

**Qué construyes:** el panel `revisor`, ya legible: tipografía, colores, una tabla ordenada y las insignias de estado

**Qué aprendes:** de dónde viene cada estilo y cuál gana; el modelo de caja y `box-sizing`; variables de color y tipografía

**Las páginas de esta lección.** Todas las figuras están en [`programas/03-css-cascada-caja/`](https://github.com/HabilMX/curso-web/tree/main/programas/03-css-cascada-caja) del [repositorio del curso](https://github.com/HabilMX/curso-web), cada una con su salida esperada al lado; la hoja del panel legible está en `fig03_08/styles.css`. Ábrelas con tu servidor local, como en la Lección 1.

## Al terminar vas a poder

- Conectar una hoja de estilos a una página y escribir reglas con selectores de elemento, de clase, de identificador y de estado.
- Predecir qué regla gana cuando dos chocan, calculando su especificidad y aplicando el orden de la cascada, sin recurrir a `!important`.
- Calcular a mano el ancho real de una caja con `content-box` y con `border-box`, y comprobarlo en las herramientas del navegador.
- Declarar variables de color, espacio y tipografía, y usarlas para que un cambio de decisión se haga en un solo lugar.
- Comprobar con cifras que un color de texto cumple el contraste mínimo y que el foco del teclado se ve.
- Leer los mensajes del validador de CSS y reconocer los dos errores que no producen mensaje alguno.

## El porqué antes del cómo

Al terminar la Lección 2 el panel funcionaba y se veía como una página de 1995: letra con serifas, un botón gris del sistema, una tabla sin líneas donde las columnas se pegan unas con otras. Eso no es un defecto del HTML; es lo que el navegador hace cuando nadie le dice cómo dibujar. Todo navegador trae su propia hoja de estilos, y es la que has estado viendo.

Hoy le decimos cómo queremos que se vea. El panel debe poder leerse: un tipo de letra legible, tamaños que jerarquicen, una tabla con filas separadas y números alineados, y una insignia de color junto al estado de cada servicio para que se distinga de un vistazo lo que está bien de lo que está caído. Ese es el resultado visible.

Lo que de verdad aprendes hoy es otra cosa, y es lo que separa a quien escribe CSS de quien lo sufre. **Casi todos los problemas de CSS son de uno de dos tipos: «mi regla no se aplica» y «mi caja no mide lo que escribí».** El primero se llama cascada y el segundo modelo de caja. Quien no entiende la cascada resuelve cada conflicto subiendo la fuerza: más selectores, un identificador, un `!important`, y después otro `!important` para vencer al primero. Quien no entiende la caja acaba restando píxeles a ojo hasta que algo cabe. Los dos terminan con una hoja de estilos en la que nadie se atreve a tocar nada.

Por eso la lección va en este orden. Primero la **cascada** (sección 3.1): cómo el navegador decide, entre varias reglas que pelean por el mismo elemento, cuál se queda. Después la **caja** (3.2): cuánto mide de verdad cada elemento. Y al final las **variables** (3.3), que te dejan escribir cada decisión una sola vez: el color del texto, la separación, la letra. En cada sección hay una página que puedes abrir, cambiar y romper. La del final es el panel completo.

Un criterio atraviesa todo: el CSS de esta lección **no esconde nada de lo que aprendiste en la anterior**. El foco del teclado se ve, el estado no depende solo del color, los textos tienen contraste suficiente. Se comprueba con números, no a ojo.

## Los conceptos

### 3.1 De dónde viene cada estilo y cuál gana

#### 3.1.1 Una regla, de punta a punta

Una hoja de estilos es una lista de **reglas**. Cada regla tiene dos mitades: el **selector**, que dice a qué elementos se aplica, y el **bloque de declaraciones** entre llaves, que dice qué cambia en ellos. Cada declaración es un par `propiedad: valor;` y cierra con punto y coma.

```html
<!-- fig03_01.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Mi primer estilo</title>
  <style>
    h1 {
      color: #0b5cad;
    }
    p {
      max-width: 40rem;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <main>
    <h1>Revisor de servicios</h1>
    <p>Cada regla tiene un selector, que dice a qué elementos se aplica, y declaraciones entre llaves, que dicen qué cambia en ellos.</p>
  </main>
</body>
</html>
```

```text
Revisor de servicios
Cada regla tiene un selector, que dice a qué elementos se aplica, y declaraciones entre llaves, que dicen qué cambia en ellos.
```

En esa página, `h1` es un selector que significa «todos los encabezados de primer nivel»; la declaración `color: #0b5cad;` cambia el color del texto a un azul escrito en hexadecimal (dos cifras para el rojo, dos para el verde y dos para el azul). La segunda regla limita el ancho de los párrafos a `40rem` (el `rem` es una unidad que vale el tamaño de la letra de la página, 16 píxeles por omisión, así que son 640 píxeles; la verás a fondo en 3.2.3) y separa las líneas con una altura de `1.6` veces el tamaño de la letra. El texto de salida se ve igual que sin estilos, y es la razón por la que en este curso, además del texto, se comprueban los valores calculados: el color de ese `<h1>`, medido en Chrome 154, es `rgb(11, 92, 173)`, que es el mismo azul en otra notación.

Hay tres maneras de conectar CSS a una página, y conviene saber las tres para saber por qué se prefiere una:

1. **Una hoja externa**, con `<link rel="stylesheet" href="styles.css">` dentro de `<head>`. Es la que usarás en el panel. El navegador la guarda en memoria y la reutiliza en todas las páginas del sitio, y el mismo archivo se puede abrir y cambiar sin tocar el HTML.
2. **Un bloque `<style>`** dentro de `<head>`, como arriba. Es práctico para un experimento de una sola página, y por eso lo usarán las figuras de esta lección. En un sitio real conviene evitarlo, por una razón de seguridad que verás en la Lección 11.
3. **El atributo `style`** puesto sobre un elemento (`<p style="color: red">`). Tiene una fuerza especial en la cascada, que verás enseguida, y es justo por eso que casi nunca conviene: mezcla la apariencia con el contenido y es muy difícil de vencer sin trucos.

#### 3.1.2 Los selectores que necesitas hoy

Un selector es una pregunta que el navegador le hace a cada elemento: «¿eres tú?». Estos son los que usarás en el panel, del más general al más preciso:

- **De tipo** (por nombre de elemento): `p`, `table`, `h2`. Se aplica a todos los de ese tipo.
- **De clase**: `.status`. El punto indica que busca elementos cuyo atributo `class` contenga ese nombre. Un elemento puede tener varias clases separadas por espacios (`class="status status-down"`), y una clase puede estar en muchos elementos. Es la herramienta principal del CSS, y es la razón por la que en la Lección 2 pusiste `class` a las insignias.
- **De identificador**: `#summary`. El signo de número (`#`) busca el único elemento con ese `id`. Un `id` no se puede repetir en una página.
- **De atributo**: `input[type="search"]`. Corchetes: elementos que tienen ese atributo con ese valor.
- **De pseudoclase**: `a:hover`, `:focus-visible`, `td:last-child`. Los dos puntos señalan un **estado** o una **posición** del elemento: cuando el mouse está encima, cuando el teclado lo tiene enfocado, cuando es el último hijo de su padre.
- **De descendiente**: `dl div` (con un espacio). Elementos `div` que están dentro de un `dl`, a cualquier profundidad.
- **Lista**: `th, td` (con coma). Es una abreviatura de dos reglas con las mismas declaraciones.

Un selector se lee de derecha a izquierda: en `dl div:last-child`, el objetivo es un `div` que es último hijo, y solo cuenta si además está dentro de un `dl`. Los selectores se pueden combinar sin espacio: `p.alert` es un `<p>` que además tiene la clase `alert`.

#### 3.1.3 Cuando dos reglas chocan: la cascada

Aquí está el concepto central de la lección. Casi nunca hay una sola regla sobre un elemento. Hay la hoja del navegador, tu hoja, otra regla más abajo en tu hoja, y a veces un atributo `style`. Cuando varias reglas dan valores distintos a la misma propiedad del mismo elemento, el navegador tiene que elegir una. La palabra *cascada* de «hojas de estilo en cascada» (CSS, por sus siglas en inglés) es el nombre del algoritmo con el que elige. No es magia ni es azar: son pasos, en un orden fijo que está [escrito en la especificación](https://www.w3.org/TR/css-cascade-5/), y el primero que desempata decide.

Esta es la lista, resumida y en el orden en que se aplica. Para cada propiedad de cada elemento, el navegador:

1. **Descarta las reglas que no aplican**: las que no seleccionan a ese elemento o que traen un valor inválido.
2. **Compara el origen y la importancia.** Hay tres orígenes: la hoja del navegador, la del usuario (preferencias del lector, que casi nadie usa) y la tuya, la del autor. Entre declaraciones normales, gana la del autor. Con `!important` el orden se invierte, para que el lector con necesidades especiales pueda vencer al autor.
3. **Compara los estilos del atributo `style`.** Una declaración puesta en el atributo `style` le gana a las que vienen de las hojas, sin importar su especificidad.
4. **Compara las capas** (`@layer`), un mecanismo que verás en 3.1.5. Entre declaraciones normales, las que están en una capa declarada más tarde ganan a las de una capa anterior; y las que no están en ninguna capa ganan a todas las que sí. Con `!important` ese orden se invierte, igual que con los orígenes.
5. **Compara la especificidad** del selector, que es el tema del siguiente apartado.
6. **Si todo lo anterior empata, gana la última.** La regla que aparece más abajo en la hoja.

Dos cosas importan de esta lista. **Primera: el orden de las reglas es el último criterio, no el primero.** Mucha gente cree que «la última regla gana» y se confunde cuando no ocurre. Solo gana la última cuando los criterios anteriores empataron. **Segunda: cada paso decide por completo.** Si un paso da ganador, los siguientes ni se miran; una regla con diez identificadores en su selector no puede vencer a una declaración con `!important`.

#### 3.1.4 Especificidad: contar con tres cifras

La especificidad es el quinto paso, el que casi siempre decide. Es una medida de **qué tan preciso es un [selector](https://www.w3.org/TR/selectors-4/#specificity)**, y se calcula con tres cifras que se escriben (A, B, C):

- **A** cuenta los identificadores (`#summary`).
- **B** cuenta las clases, los atributos y las pseudoclases (`.status`, `[type="search"]`, `:hover`, `:last-child`).
- **C** cuenta los tipos de elemento (`p`, `table`) y los pseudoelementos (`::before`).

El selector universal `*` no suma nada. Y se comparan las cifras **de izquierda a derecha, una por una, no como un número de tres dígitos**: primero A; si empatan, B; si empatan, C. Un solo identificador (1,0,0) vence a cualquier número de clases, aunque sean mil, porque A se compara primero. Por eso el navegador ve a `#summary` como mucho más fuerte que `.status`.

Algunos ejemplos, con su cuenta:

| Selector | Cuenta (A, B, C) | Por qué |
|---|---|---|
| `p` | (0, 0, 1) | un tipo |
| `.alert` | (0, 1, 0) | una clase |
| `p.alert` | (0, 1, 1) | una clase y un tipo |
| `a:hover` | (0, 1, 1) | una pseudoclase y un tipo |
| `input[type="search"]` | (0, 1, 1) | un atributo y un tipo |
| `dl div:last-child` | (0, 1, 2) | una pseudoclase y dos tipos |
| `#summary dd` | (1, 0, 1) | un identificador y un tipo |
| `:where(.card) p` | (0, 0, 1) | `:where()` siempre vale cero |

La última fila merece una explicación. `:where()` y `:is()` son pseudoclases que reciben una lista de selectores. La diferencia entre ambas es justo su especificidad: **[`:where()`](https://developer.mozilla.org/en-US/docs/Web/CSS/:where) siempre vale cero** y `:is()` toma la del más específico de sus argumentos. Con `:where()` puedes escribir un estilo base que cualquiera sobrescribe sin esfuerzo. La usarás para eso, más adelante, y la ves en uso en el primer ejercicio.

Veamos todo junto. La siguiente página tiene cuatro párrafos y cinco reglas de color que se disputan:

```html
<!-- fig03_02.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>¿Quién gana?</title>
  <style>
    p { color: dimgray; }
    .alert { color: saddlebrown; }
    p.alert { color: crimson; }
    #three, #four { color: royalblue; }
    p { color: black; }
  </style>
</head>
<body>
  <main>
    <h1>¿Quién gana?</h1>
    <p>Uno: solo el nombre del elemento.</p>
    <p class="alert">Dos: con una clase.</p>
    <p class="alert" id="three">Tres: con clase e identificador.</p>
    <p class="alert" id="four" style="color: darkgreen">Cuatro: con el atributo style.</p>
  </main>
</body>
</html>
```

```text
¿Quién gana?
Uno: solo el nombre del elemento.
Dos: con una clase.
Tres: con clase e identificador.
Cuatro: con el atributo style.
```

Antes de leer la respuesta, haz tu propia apuesta con las dos listas de arriba. Yo medí los colores calculados en Chrome 154 y esto fue lo que salió:

- **Uno** es negro (`rgb(0, 0, 0)`). Solo le aplican `p { dimgray }` y `p { black }`. Las dos tienen la misma especificidad, (0,0,1), así que decide el orden y gana la última: negro. Este es el caso en que «la última gana» es verdad.
- **Dos** es carmesí (`rgb(220, 20, 60)`). Le aplican tres reglas: `p` (0,0,1), `.alert` (0,1,0) y `p.alert` (0,1,1). Gana la de mayor especificidad, `p.alert`, **aunque esté antes que `p { black }`**. El orden no se mira, porque el paso anterior ya desempató.
- **Tres** es azul real (`rgb(65, 105, 225)`). Su identificador da (1,0,0) y vence a todas las reglas anteriores.
- **Cuatro** es verde oscuro (`rgb(0, 100, 0)`). Tiene el mismo identificador que el tres, pero el atributo `style` se compara antes que la especificidad, y gana. Es el caso que la sección 3.1.1 anunciaba: por eso un `style` puesto en el HTML es tan difícil de vencer desde la hoja.

Hay una cuenta que deberías hacer de memoria al ver este resultado: **el elemento Tres tiene cinco reglas de color que lo seleccionan (las dos de `p`, `.alert`, `p.alert` y la del identificador), y la que ganó es la que menos se parece a «lo último que escribí».** Si no comprendes el orden de la lista, la única herramienta que te queda es subir la fuerza, y la fuerza solo se puede subir hasta un punto.

#### 3.1.5 Capas: la salida limpia

Las capas (`@layer`) existen para cuando los criterios de especificidad se vuelven un estorbo. Una capa es un grupo con nombre de reglas; declaras el **orden de las capas** una vez, y entre capas manda ese orden, **sin mirar la especificidad**.

```html
<!-- fig03_03.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Capas</title>
  <style>
    @layer base, components, overrides;

    @layer base {
      a { color: gray; }
    }
    @layer components {
      .link { color: green; }
    }
    @layer overrides {
      a { color: blue; }
    }
    .plain { color: purple; }
  </style>
</head>
<body>
  <main>
    <h1>Capas</h1>
    <p><a href="#uno" class="link">Un enlace con clase, en la capa components</a></p>
    <p><a href="#dos">Un enlace sin clase</a></p>
    <p><a href="#tres" class="plain">Un enlace con una regla sin capa</a></p>
  </main>
</body>
</html>
```

```text
Capas
Un enlace con clase, en la capa components
Un enlace sin clase
Un enlace con una regla sin capa
```

La primera línea del bloque `<style>` declara el orden: `base`, después `components`, después `overrides`. La última capa gana. Mira el primer enlace: el selector `.link` tiene especificidad (0,1,0) y el selector `a` de la capa `overrides` solo (0,0,1); en una hoja sin capas, ganaría `.link`. Aquí gana `a`, y el enlace es azul (`rgb(0, 0, 255)`), porque su capa va después. El segundo enlace también es azul. El tercero es morado: `.plain` no está en ninguna capa, y las declaraciones normales **sin capa ganan a todas las que sí la tienen**.

Esto es lo que hace útil a las capas. Puedes ordenar tu hoja en el orden en que quieres que ganen las cosas (un restablecimiento al principio, después los estilos del cuerpo, después los componentes), y la especificidad solo cuenta dentro de cada capa. Nadie necesita un `!important` para vencer a una regla que está en una capa anterior. Y la regla sin capa es la puerta de emergencia: si alguien escribe una hoja sin capas, gana a todo. Todo esto vale para las declaraciones normales; [la especificación](https://www.w3.org/TR/css-cascade-5/#cascade-layering) invierte el orden para las que llevan `!important`: entre ellas gana la **primera** capa, y una declaración `!important` dentro de una capa vence a una `!important` sin capa. Es otra razón para no usarlo: rompe la intuición de que lo último manda.

Las capas están disponibles de forma general en los navegadores desde marzo de 2022; [el sitio de referencia de Mozilla](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer) las marca como «Widely available». El panel de hoy las usa.

#### 3.1.6 La herencia: lo que no necesita regla

Falta una pieza, y es la que explica por qué a veces un elemento tiene un estilo sin que ninguna regla le hable. Algunas propiedades **[se heredan](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Inheritance)**: si un elemento no tiene valor propio, toma el de su padre. El color del texto, el tipo de letra, el tamaño y la altura de línea se heredan. Otras no: el margen, el relleno, el borde y el fondo son de cada elemento, y no pasan a sus hijos (si el borde se heredara, cada párrafo dentro de una tarjeta tendría su propio marco).

```html
<!-- fig03_04.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Herencia</title>
  <style>
    article {
      color: darkgreen;
      font-style: italic;
      border: 2px solid black;
      padding: 1rem;
    }
  </style>
</head>
<body>
  <main>
    <h1>Herencia</h1>
    <article>
      <p>Este párrafo hereda el color y la cursiva, pero no el borde.</p>
      <p><label>Un campo: <input type="text" value="no hereda la fuente"></label></p>
    </article>
  </main>
</body>
</html>
```

```text
Herencia
Este párrafo hereda el color y la cursiva, pero no el borde.
Un campo:
```

Lo medí en Chrome 154. El párrafo tiene el color verde oscuro y la cursiva del `<article>` (los hereda), y su borde es de `0px`: no lo heredó. La etiqueta, que es un elemento de texto, también hereda el verde. Y el campo de texto, no: su color calculado es negro y su cursiva es `normal`. Un campo de formulario no hereda de su padre la letra ni el color porque la hoja de estilos del navegador les da valores propios. En mi equipo, el campo usaba Arial a 13.33 px mientras el párrafo usaba 16 px; los valores exactos dependen del sistema operativo, pero la diferencia existe en todos. Es la razón por la que el panel trae la regla `font: inherit` para sus campos y botones: sin ella, el campo de búsqueda se ve como de otra página.

Hay cuatro palabras que dejan mandar a mano sobre la herencia: `inherit` (toma el valor del padre, aunque la propiedad normalmente no se herede), `initial` (el valor inicial de la especificación), `unset` (hereda si la propiedad es heredable, y si no, usa el inicial) y `revert` (deshace los estilos del autor y vuelve al valor que pondría el origen anterior: la hoja del usuario si existe, y si no, la del navegador). De ellas, `inherit` es la que usarás.

Y una advertencia del orden en que ocurre todo. **La herencia es lo más débil que existe**: un valor heredado pierde ante cualquier regla que apunte al elemento, por débil que sea. Por eso `* { color: black }`, con su especificidad cero, rompe el color heredado de todo el documento: le «habla» a cada elemento directamente.

#### 3.1.7 El `!important` y cómo se llega a necesitarlo

La declaración [`!important`](https://developer.mozilla.org/en-US/docs/Web/CSS/important) va al final de un valor (`color: red !important;`) y cambia su paso en la cascada: pasa a un grupo que le gana a todas las declaraciones normales, con cualquier selector. Es una herramienta de emergencia con un caso de uso legítimo, que es la hoja de estilos de un usuario que necesita letra grande. Para quien escribe una hoja de autor, es casi siempre una señal de que hay un conflicto sin entender.

El camino a la guerra de `!important` es siempre el mismo. Una regla no gana; se le sube la especificidad; sube la de otra regla cercana; alguien agrega un `!important`; la regla que debía vencerlo necesita otro `!important`; y a partir de ahí cada cambio exige uno más. La salida no es subir la fuerza, sino **bajarla**: escribir selectores con la especificidad más baja que funcione y dejar que el orden, las capas y `:where()` hagan el trabajo. En el cuarto ejercicio tienes una hoja con ese problema para deshacerlo.

Una herramienta te hace esto mucho más fácil: **el [inspector del navegador](https://developer.chrome.com/docs/devtools/css)**. Haz clic derecho sobre cualquier elemento y elige «Inspeccionar». En el panel de estilos verás todas las reglas que le aplican, en el orden en que las evalúa la cascada, y las que perdieron aparecen **tachadas**. En el panel de valores calculados (*Computed*) verás el valor final de cada propiedad y, al desplegarlo, qué regla lo puso. Cuando una regla «no hace caso», la respuesta casi siempre está ahí, a dos clics.

### 3.2 Cada elemento es una caja

#### 3.2.1 Las cuatro capas de una caja

Para el CSS, todo elemento es una caja rectangular. Esa caja tiene cuatro zonas anidadas, de adentro hacia afuera:

- **El contenido**: el texto o los elementos hijos.
- **El relleno** (*padding*): espacio entre el contenido y el borde. Es parte de la caja y toma su fondo.
- **El borde** (*border*): una línea alrededor del relleno.
- **El margen** (*margin*): espacio entre este borde y la caja vecina. Es transparente y no toma fondo.

Y hay una pregunta que decide si tu página mide lo que escribiste: cuando escribes `width: 300px`, ¿ese ancho es del contenido, o de la caja con relleno y borde? La respuesta histórica, que sigue siendo la que el navegador aplica si nadie le dice otra cosa, es **del contenido**. (Hay excepciones en la hoja del propio navegador: lo medí en Chrome 154, y los botones, las listas desplegables `<select>`, los campos de búsqueda y las tablas ya traen `border-box`; un campo de texto normal o un `<div>`, no.) Se llama [`box-sizing: content-box`](https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing). Con ella, el relleno y el borde se **suman** por fuera:

```html
<!-- fig03_05.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Cajas</title>
  <style>
    .box {
      width: 300px;
      padding: 20px;
      border: 5px solid black;
      margin: 10px;
      background: #cfe2ff;
    }
    .border-box {
      box-sizing: border-box;
    }
  </style>
</head>
<body>
  <main>
    <h1>Cajas</h1>
    <div class="box">Caja con content-box (lo normal sin reglas)</div>
    <div class="box border-box">Caja con border-box</div>
  </main>
</body>
</html>
```

```text
Cajas
Caja con content-box (lo normal sin reglas)
Caja con border-box
```

Las dos cajas tienen la misma regla de ancho, `width: 300px`. La cuenta de la primera, con `content-box`: 300 de contenido, más 20 de relleno a cada lado (40), más 5 de borde a cada lado (10): **350 píxeles de ancho total**. La de la segunda, con `box-sizing: border-box`, el ancho de 300 ya **incluye** el relleno y el borde, y el contenido se queda con lo que sobra: 300 − 40 − 10 = **250**. Lo medí en Chrome 154: la primera mide 350 píxeles de ancho y la segunda 300. La propiedad `width` calculada vale `300px` en las dos; lo que cambia es lo que significa.

Ahora imagina el problema real. Tienes una tarjeta dentro de una columna de 500 píxeles, y le pones `width: 100%` para que llene la columna, 16 píxeles de relleno para que el texto respire y un borde de 2 píxeles. Con `content-box`, la tarjeta mide 500 de contenido + 32 de relleno + 4 de borde = 536 píxeles: **se sale de su columna por 36 píxeles**, y aparece una barra de desplazamiento horizontal. El principiante resuelve esto a prueba y error. Quien sabe de la caja lo resuelve con una línea.

La línea es `box-sizing: border-box`, y es la costumbre de casi todo el CSS profesional: con ella, el ancho que escribes es el ancho que ves, y el relleno y el borde se restan del contenido por dentro. Se escribe una sola vez, para todos los elementos, y aparece en la primera capa del panel:

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

Tres selectores separados por coma: todos los elementos y los dos pseudoelementos que el CSS puede insertar antes y después del contenido de cada uno. Se los incluye para que ninguna caja generada se escape del criterio.

Para ver la caja de cualquier elemento, el inspector tiene un diagrama: en Chrome, en el panel de valores calculados; en Firefox, en la [pestaña de «Diseño»](https://firefox-source-docs.mozilla.org/devtools-user/page_inspector/how_to/examine_and_edit_the_box_model/index.html). Es un rectángulo dentro de otro con los cuatro grosores anotados. **Cuando una caja no mida lo que esperas, no restes píxeles: abre el diagrama y mira cuál de las cuatro zonas es la que sobra.**

#### 3.2.2 Bloque, en línea y los márgenes que se juntan

Hay una segunda regla que explica casos que desconciertan: no todas las cajas se comportan igual. La propiedad [`display`](https://developer.mozilla.org/en-US/docs/Web/CSS/display) decide cómo se coloca una caja respecto de sus vecinas. Tres valores explican la mayoría de los casos de hoy:

- **`block`**: la caja ocupa una línea completa. Acepta `width` y `height`, y sus cuatro márgenes. Son así los párrafos, los encabezados, las secciones, las tablas.
- **`inline`**: la caja fluye dentro de una línea de texto, como una palabra. **Ignora `width` y `height`** y sus márgenes verticales. Son así los `<span>`, los enlaces y las etiquetas `<strong>`.
- **`inline-block`**: fluye como una palabra, pero se deja dimensionar como un bloque. Es lo que necesita una insignia.

```html
<!-- fig03_06.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Display</title>
  <style>
    .sample {
      width: 200px;
      height: 40px;
      background: #cfe2ff;
    }
    .as-block { display: block; }
    .as-inline { display: inline; }
    .as-inline-block { display: inline-block; }
  </style>
</head>
<body>
  <main>
    <h1>Display</h1>
    <span class="sample as-block">block</span>
    <span class="sample as-inline">inline</span>
    <span class="sample as-inline-block">inline-block</span>
  </main>
</body>
</html>
```

```text
Display
block
inline inline-block
```

Los tres `<span>` tienen la misma regla `width: 200px; height: 40px;`. Lo medí: el `block` y el `inline-block` miden 200 × 40. El `inline` mide **36 × 18**: su ancho y alto salen del texto «inline», porque a una caja en línea se le ignoran las dimensiones. Si alguna vez escribes un `width` y «no hace nada», fíjate primero en el `display` del elemento. El `<span class="status">` del panel necesita relleno a los lados y esquinas redondeadas, y por eso se declara `display: inline-block`.

La otra rareza de las cajas son los márgenes. Cuando dos bloques están uno encima del otro y el de arriba tiene un margen inferior y el de abajo un margen superior, el espacio entre ellos **no es la suma de los dos**: los márgenes se **juntan** y queda el mayor.

```html
<!-- fig03_07.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Márgenes</title>
  <style>
    .first  { margin: 0 0 20px; background: #cfe2ff; }
    .second { margin: 30px 0 0;  background: #d1e7dd; }
  </style>
</head>
<body>
  <main>
    <h1>Márgenes</h1>
    <p class="first">Primer párrafo: margen inferior de 20 px.</p>
    <p class="second">Segundo párrafo: margen superior de 30 px.</p>
  </main>
</body>
</html>
```

```text
Márgenes
Primer párrafo: margen inferior de 20 px.
Segundo párrafo: margen superior de 30 px.
```

Si los márgenes se sumaran, habría 50 píxeles entre los dos párrafos. Lo medí: hay **30**. Se llama *[colapso de márgenes](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_box_model/Mastering_margin_collapsing)* y solo ocurre entre márgenes **verticales** de bloques vecinos (y entre un bloque y su primer hijo, cuando no hay relleno ni borde que los separe). El relleno no colapsa jamás, y los elementos dentro de un contenedor flexible o de una rejilla, que verás en la Lección 4, tampoco. Si tu espacio vertical no suma, es esto. La costumbre que lo evita es escribir los márgenes en una sola dirección (por ejemplo, todos hacia abajo) y dejar que el colapso trabaje de tu lado.

#### 3.2.3 Unidades: píxeles, rem y porcentajes

Para escribir un tamaño necesitas elegir una unidad, y la elección tiene consecuencias de accesibilidad que no se ven en la pantalla del que programa.

- **`px`** es un píxel de CSS. Es una medida fija. Úsala para lo que no debe crecer con el texto: un borde de 1 px, una sombra.
- **[`rem`](https://developer.mozilla.org/en-US/docs/Web/CSS/length)** es el tamaño de la letra de la raíz del documento. Por omisión los navegadores la ponen en 16 px, así que `1rem` son 16 px y `2rem` son 32. La diferencia con `px` es la que importa: **el lector puede cambiar su tamaño de letra preferido en la configuración del navegador**, y todo lo escrito en `rem` crece con él, mientras lo escrito en `px` no. Le queda el zoom de la página (Ctrl y +), que agranda todo, incluidos los `px`, y que las pautas aceptan como forma de cumplir; pero quien ya fijó su tamaño de letra preferido para leer en todos los sitios ve que tu página lo ignora, y tiene que hacer zoom en ella cada vez. Por eso el panel escribe sus tamaños de letra y casi todas sus separaciones en `rem`. Es el criterio que las pautas de accesibilidad llaman cambiar el tamaño del texto ([WCAG 1.4.4](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html)).
- **`%`** es un porcentaje del contenedor: `width: 100%` es «tan ancho como mi padre».
- **`ch`** es el ancho de la cifra cero en la letra actual. Sirve para limitar el ancho de un texto: a más de unos 75 caracteres por línea el ojo se pierde al saltar a la siguiente.

Una línea más sobre la altura de línea. Se escribe `line-height: 1.6`, **sin unidad**: un número solo significa «1.6 veces el tamaño de la letra de cada elemento», y los hijos lo heredan como multiplicador. Con una unidad (`1.6rem`) se hereda como una cantidad fija, y un encabezado grande quedaría con las líneas pegadas.

### 3.3 Variables: cada decisión, una sola vez

#### 3.3.1 Propiedades personalizadas

Imagina que el azul del panel aparece en el título, en los enlaces, en el botón, en el contorno del foco. Son cuatro lugares. El día que alguien dice «mejor un azul más oscuro», o «el cliente quiere verde», tienes que encontrar los cuatro y cambiarlos sin olvidar ninguno. El CSS resuelve esto con **[propiedades personalizadas](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)**, que se conocen como **variables**.

Una variable es una propiedad cuyo nombre **tú inventas** y siempre empieza con dos guiones. Se declara dentro de una regla, y se usa con la función `var()`:

```css
:root {
  --color-accent: #0b5cad;
}

a {
  color: var(--color-accent);
}

button {
  background: var(--color-accent);
}
```

`:root` es la pseudoclase que selecciona la raíz del documento (el elemento `<html>`), y se usa como el lugar canónico de las variables globales. Las variables **se heredan**, como el color: una variable declarada en `:root` está disponible en todo el documento, y una declarada en un elemento está disponible en él y en sus descendientes. Eso se usa para el truco que mueve las insignias del panel, que verás en un momento.

Hay una disciplina de nombres que vale más que cualquier otro consejo: **el nombre dice para qué sirve, no cómo se ve.** `--color-accent` es un buen nombre; `--blue` es una trampa, porque el día que el acento sea verde, la variable `--blue` valdrá verde y nadie entenderá el código. Lo mismo con `--color-down-text` para el texto del estado caído, o `--space-3` para una separación. Una variable es una **decisión** con nombre.

Y tres variables que merecen una explicación aparte son las de la insignia. Fíjate en cómo se resuelve el color de las dos insignias, la verde de «Disponible» y la roja de «Caído», con una sola regla:

```css
.status {
  background: var(--badge-bg);
  color: var(--badge-text);
}

.status-available {
  --badge-bg: var(--color-available-bg);
  --badge-text: var(--color-available-text);
}

.status-down {
  --badge-bg: var(--color-down-bg);
  --badge-text: var(--color-down-text);
}
```

La regla `.status` sabe **cómo** se dibuja una insignia, pero no de qué color; las dos clases siguientes solo dicen **de qué color**, cambiando dos variables. Gracias a la herencia de las variables, `.status` las ve. Esta forma de escribir tiene una ventaja que ya notarás: agregar un tercer estado en el futuro es agregar una clase de tres líneas, sin tocar la regla de la insignia. Una nota: una insignia que solo tenga la clase `status` y ninguna de las otras dos queda sin color de fondo, porque las variables que usa no existen. Es el comportamiento correcto y se verá en la sección de errores.

#### 3.3.2 Tipografía y espacio

Las variables no son solo para colores. El panel declara su escala de separaciones (`--space-1` a `--space-5`, de un cuarto de `rem` a dos y medio) y su familia de letra:

```css
--font-body: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
```

Una lista de familias se lee de izquierda a derecha como «usa la primera que exista, y si no la siguiente». [`system-ui`](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family) pide la letra con la que el sistema operativo dibuja sus propios menús, que es la más legible en cada plataforma y no se descarga de ningún lado. Las demás son los nombres de la letra del sistema de cada plataforma, por si el navegador no entiende `system-ui`, y la última, `sans-serif`, es una familia genérica, que es la red de seguridad. No hace falta descargar ninguna fuente para empezar.

La **escala** de espacios tiene un propósito que no es estético. Cuando cada separación del panel sale de las mismas cinco medidas, la página tiene un ritmo, y cuando alguien quiere más aire, cambia una medida y todo se acomoda. Las alturas de línea (`1.6` para el cuerpo y `1.2` para los encabezados, que son cortos) cierran el sistema.

Una propiedad pequeña que hace diferencia en una tabla de números: [`font-variant-numeric: tabular-nums`](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric). Con ella, todas las cifras ocupan el mismo ancho, así que `120 ms` y `950 ms` se alinean cifra por cifra. Es lo que hace que una columna de tiempos se pueda comparar de un vistazo. El panel la aplica a la columna de tiempos junto con `text-align: right`.

#### 3.3.3 Contraste y foco: lo que se mide

Las pautas de accesibilidad (WCAG 2.2) piden que el texto normal tenga una relación de contraste de **al menos 4.5 a 1** contra su fondo ([criterio 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)), y que los componentes de la interfaz y el indicador de foco lleguen a **3 a 1** (1.4.11). La relación se calcula con una fórmula sobre la luminosidad de los dos colores, y no tienes que aprendértela: el selector de color de las herramientas del navegador la calcula, y hay verificadores en línea como [el de WebAIM](https://webaim.org/resources/contrastchecker/). Lo que sí necesitas es el hábito de **medir antes de elegir**. Estas son las cifras de los colores del panel, que calculé con la fórmula de la W3C:

| Combinación | Contraste | Mínimo |
|---|---|---|
| Texto principal sobre el fondo blanco | 16.56 : 1 | 4.5 |
| Texto atenuado (`--color-muted`) sobre blanco | 6.39 : 1 | 4.5 |
| Texto atenuado sobre el fondo de la página | 6.00 : 1 | 4.5 |
| Enlaces y botón sobre blanco | 6.67 : 1 | 4.5 |
| Letras blancas del botón sobre el acento | 6.67 : 1 | 4.5 |
| Insignia «Disponible» | 7.21 : 1 | 4.5 |
| Insignia «Caído» | 7.08 : 1 | 4.5 |
| Borde del campo de búsqueda sobre blanco | 4.55 : 1 | 3 |
| Anillo del foco sobre blanco | 6.67 : 1 | 3 |

Una cifra es una decisión que se puede revisar. «Se ve bien» no.

Hay un segundo criterio sobre el color, y es que **el color no puede ser la única forma de comunicar algo** ([WCAG 1.4.1, «Uso del color»](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)). La insignia roja de «Caído» se distingue del verde para quien ve colores, pero una persona con daltonismo rojo-verde puede no distinguir esos dos. Por eso la insignia lleva además **texto** («Caído»): lo dice con palabras, y el color solo refuerza. Esa decisión ya la tomaste en la Lección 2 al escribir «Caído» dentro del `<span>`. El CSS la mejora sin cambiarla.

Y el foco. En la lección anterior hiciste la prueba de la tecla Tab; pero el navegador te mostraba el foco con su aro por omisión. Es común, en la hoja de un principiante, encontrar `outline: none` para «quitar ese contorno feo». Es un error con costo: quien navega con el teclado queda sin saber dónde está. El criterio de las pautas es que el foco sea visible ([WCAG 2.4.7](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html)). La herramienta correcta es la pseudoclase **[`:focus-visible`](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible)**, que selecciona un elemento enfocado **cuando el navegador cree que el foco debe mostrarse**: con el teclado sí, y al hacer clic con el mouse sobre un botón, normalmente no. Así puedes dar un contorno propio, visible y firme, sin que moleste a quien usa el mouse. Está disponible de forma general en los navegadores desde marzo de 2022.

## Ejemplo resuelto: el panel legible

Ya tienes las tres ideas. Esta es la hoja del panel completo; recórrela por capas, que es como está escrita.

```css
/* fig03_08/styles.css */

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

Y la página, que es la de la Lección 2 con una sola línea nueva en `<head>`: el enlace a la hoja. En el repositorio la hoja vive en `fig03_08/styles.css`; en tu proyecto guárdala como `css/styles.css`, dentro de la carpeta `css` que creaste en el Ejercicio 1 de la Lección 1, y escribe `href="css/styles.css"`.

```html
<!-- fig03_08.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Revisor de servicios</title>
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="fig03_08/styles.css">
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

El texto es el mismo de la Lección 2, y es lo correcto: el CSS no cambia lo que la página dice, solo cómo se dibuja. Abre la página en tu servidor local y observa lo que sí cambió. Las decisiones, una por una:

- **Tres capas en orden:** `reset` (la caja y las fuentes de los controles), `base` (variables, cuerpo, encabezados, enlaces, foco) y `components` (secciones, resumen, controles, tabla, insignias). Como cada regla vive en una capa y entre capas manda el orden, **no hay un solo `!important` ni hace falta que ninguno de los selectores sea especialmente específico**. Si el día de mañana alguien escribe una regla sin capa, esa gana a todo: es la puerta de emergencia, y por eso se escribe con intención.
- **Todas las decisiones, en `:root`:** colores, separaciones, letra. El resto de la hoja no contiene un solo color escrito en hexadecimal; todo sale de `var()`. Para cambiar el azul del panel entero, se cambia una línea. Es el ejercicio 3.
- **`margin: 0 auto` con `max-width: 60rem`:** el contenido tiene un ancho máximo cómodo, y `auto` en los márgenes laterales reparte el espacio sobrante a los dos lados. Es la forma de centrar un bloque con ancho.
- **`:focus-visible`:** un aro de 3 píxeles en el color de acento, separado 2 píxeles del elemento. Presiona Tab: el aro aparece en el enlace, en el campo, en el grupo de radios y en el botón. Lo comprobé en Chrome: el botón enfocado con el teclado tiene un contorno `solid` de `3px` y color `rgb(11, 92, 173)`.
- **La tabla:** `border-collapse: collapse` junta los bordes de las celdas en una sola línea (por omisión cada celda dibuja los suyos, con un hueco entre ellos). Las celdas llevan relleno para que respiren, y las líneas se limitan a la parte de abajo de cada fila.
- **Los números:** `th:last-child, td:last-child` selecciona la última celda de cada fila, que es la de tiempos, y la alinea a la derecha con cifras tabulares. Fíjate en que el `<th>` del nombre de fila no se ve afectado: es el primer hijo de su fila, no el último.
- **Las insignias:** una regla, dos variantes, y el texto sigue ahí: el color solo refuerza lo que dice la palabra.
- **El botón:** mide al menos `2.5rem` de alto (40 píxeles con la letra de 16), por encima del mínimo de 24 × 24 que piden las pautas para los objetivos táctiles ([WCAG 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)). El campo de búsqueda también mide 40.

Y una cuenta honesta antes de cerrar. Con el navegador a 1000 píxeles de ancho, el panel se ve bien. **Si lo achicas a 320 píxeles, que es el ancho de un teléfono pequeño, aparece una barra de desplazamiento horizontal**: medí que el documento mide 414 píxeles de ancho sobre una ventana de 320. La tabla con sus tres columnas no cabe. No es un descuido de esta lección: es el tema de la siguiente. Hoy el panel es legible; en las lecciones 4 y 5 se acomoda y se vuelve adaptable.

## El error que vas a ver

El navegador no muestra errores de CSS. Si escribes mal una propiedad o un valor, simplemente **ignora la declaración** y sigue. Eso hace que los errores de CSS sean silenciosos, y por eso se suelen buscar donde se manifiestan («¿por qué mi título no es azul?») y no donde nacieron. Para verlos hay dos instrumentos: el validador de CSS de la W3C, y el inspector del navegador, donde una declaración inválida aparece tachada o marcada.

Esta página tiene cuatro errores de sintaxis y una variable mal escrita:

```html
<!-- fig03_09.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Estilos que no hacen caso</title>
  <style>
    h1 {
      colour: navy;
    }
    p {
      color: #12;
    }
    table {
      width: 100 px;
    }
    .status {
      padding: 0.25rem 0.5rem
      border-radius: 999px;
    }
    .note {
      color: var(--color-textt);
    }
  </style>
</head>
<body>
  <main>
    <h1>Estilos que no hacen caso</h1>
    <p>Ninguna de estas reglas hace lo que el autor quería.</p>
    <p class="note">Este párrafo usa una variable que no existe.</p>
  </main>
</body>
</html>
```

El [validador de CSS de la W3C](https://jigsaw.w3.org/css-validator/) vive en `https://jigsaw.w3.org/css-validator/` y acepta un archivo, una dirección o el texto pegado. Esto responde sobre el bloque de estilos de arriba (copiado del resultado real):

```text
Line : 3 h1
       Property “colour” doesn't exist. The closest matching property name is “color” : 
       navy
Line : 6 p
       (Value Error : color (nullcolors.html#propdef-color))
       “#12” is not a valid color 3 or 6 hexadecimals numbers : 
Line : 9 table
       (Value Error : width (nullvisudet.html#propdef-width))
       Too many values or values are not recognized : 
Line : 13 .status
       (Value Error : padding (nullbox.html#propdef-padding))
       Missing a semicolon before the property name “border-radius”
```

Cada mensaje trae la línea del archivo y el selector donde ocurre. Uno por uno:

1. **`colour` no existe.** La ortografía británica de «color». Y el mensaje te dice cuál es la propiedad que quisiste escribir. El navegador ignoró la declaración y el título quedó negro; no hubo aviso.
2. **`#12` no es un color.** Un color hexadecimal tiene 3 o 6 cifras (y 4 u 8 si lleva transparencia). El valor se descartó.
3. **`100 px`** tiene un espacio. Para el CSS son dos valores, y el ancho solo acepta uno: se escribe `100px`, pegado.
4. **Falta un punto y coma** al final de la declaración de `padding`. El navegador leyó `0.25rem 0.5rem border-radius: 999px` como un solo valor inválido, y **perdió las dos declaraciones**. Es el error más común, y el que más sorprende, porque una línea mal cerrada se lleva también la de abajo.

El error de la variable es otro: `var(--color-textt)` tiene una `t` de más y la variable no existe. El validador **no lo detecta** (su aviso sobre el panel dice que, por su naturaleza dinámica, las variables no se revisan de forma estática). El navegador tampoco protesta: lo medí en Chrome y el párrafo quedó con el color negro de siempre, el del texto heredado. Una variable que no existe hace que la declaración sea inválida *en el momento de calcular el valor*, y la propiedad vuelve a su valor heredado o inicial, en silencio. La forma de encontrarla es la que ya conoces: en el inspector, la declaración aparece marcada, y el valor calculado del párrafo no es el que esperabas. Otra buena costumbre: una variable puede llevar un valor de reserva como segundo argumento, `var(--color-text, black)`, que se usa cuando la variable no existe.

Una última comprobación sobre el panel de este capítulo: pasé su hoja por el mismo validador y respondió «Congratulations! No Error Found», con solo dos avisos que dicen que las variables no se revisan de forma estática.

## Lo que se hace mal

**1. Resolver un conflicto subiendo la fuerza.** Más selectores, un identificador, un `!important`. *Costo:* cada parche exige otro más fuerte, y la hoja acaba imposible de cambiar. Arreglo: calcula la especificidad de las dos reglas, baja la que no necesita ser fuerte, y ordena con capas.

**2. Usar identificadores para dar estilo.** `#summary dd { ... }`. *Costo:* un identificador pesa (1,0,0), que vence a mil clases, y la única forma de vencerlo es otro identificador. Arreglo: el estilo va con clases o con selectores de elemento; el `id` queda para los enlaces internos y para las etiquetas.

**3. El atributo `style` en el HTML.** *Costo:* le gana a casi todo y mezcla apariencia con contenido; para cambiar un color tienes que editar el HTML en cien lugares. Arreglo: una clase.

**4. `outline: none` sin reemplazo.** *Costo:* el usuario de teclado queda sin saber dónde está. Arreglo: `:focus-visible` con un contorno propio.

**5. Tamaños de letra en `px`.** *Costo:* quien agranda el tamaño de letra desde la configuración del navegador no ve efecto, y solo le queda hacer zoom a tu página cada vez. Arreglo: `rem`.

**6. Comunicar el estado solo con el color.** Una insignia que solo es roja o verde. *Costo:* se pierde para quien no distingue esos colores y para quien usa un lector de pantalla. Arreglo: la palabra siempre; el color, de refuerzo.

**7. Restar píxeles a ojo.** `width: 280px` para que «quepa» con el relleno. *Costo:* el número depende de un cálculo que nadie escribió, y se rompe al cambiar el relleno. Arreglo: `box-sizing: border-box` para todos y el ancho que de verdad quieres.

**8. Nombrar las variables por su color.** `--blue`, `--red`. *Costo:* el día que cambia la decisión, el nombre miente. Arreglo: nombres por función, como `--color-accent`.

**9. Copiar valores sueltos en cada regla.** El mismo `#0b5cad` en cinco lugares. *Costo:* cambiarlo es buscar y reemplazar, y siempre se olvida uno. Arreglo: una variable.

## Ejercicios

### Ejercicio 1 — Predice antes de abrir

Dada esta página, escribe de qué color será cada elemento de la lista (A, B y C) **antes** de abrirla. Después ábrela y compara. Por último, cambia **una sola cosa** en una regla para que B se vea verde y C carmesí, sin usar `!important`:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Predice antes de abrir</title>
  <style>
    li { color: black; }
    #list li { color: navy; }
    .done { color: green; }
    li.urgent { color: crimson; }
  </style>
</head>
<body>
  <ul id="list">
    <li>A</li>
    <li class="done">B</li>
    <li class="done urgent">C</li>
  </ul>
</body>
</html>
```

### Ejercicio 2 — La tarjeta que se sale

Una tarjeta tiene `width: 100%`, `padding: 16px` y `border: 2px solid black`, dentro de una columna de 500 px de ancho. Calcula a mano cuánto mide la tarjeta con `content-box` y cuánto con `border-box`. Después escribe la página, mídela con el inspector y comprueba tu cuenta.

### Ejercicio 3 — Cambiar el acento en una línea

Cambia el color de acento del panel a otro de tu elección editando **una sola línea** de la hoja. Antes de elegirlo, comprueba con el selector de color de las herramientas del navegador o con el verificador de WebAIM que cumple 4.5 : 1 sobre blanco. Después contesta: ¿qué cosas del panel cambiaron de color con esa sola línea?

### Ejercicio 4 — Deshacer una guerra de `!important`

Esta hoja tiene un `!important` que impide que la insignia de «Caído» se vea roja. Arréglala **quitándolo y sin agregar otro**, y sin cambiar el HTML:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Guerra de important</title>
  <style>
    .status { color: gray !important; padding: 0 8px; }
    .status-down { color: red; }
  </style>
</head>
<body>
  <p><span class="status status-down">Caído</span></p>
</body>
</html>
```

## Soluciones

### Solución 1

Las tres son **azules** (`navy`, `rgb(0, 0, 128)`). La regla `#list li` tiene especificidad (1,0,1), con un identificador, y vence a todas las demás: `.done` es (0,1,0) y `li.urgent` es (0,1,1), y ninguna llega a tener identificador. Es la trampa de usar identificadores para dar estilo: una vez que uno aparece, ninguna clase puede competir.

Para que B sea verde y C carmesí hay que **bajar** la fuerza de esa regla, no subir la de las otras. `:where()` vale cero, así que `:where(#list) li` tiene especificidad (0,0,1):

```css
li { color: black; }
:where(#list) li { color: navy; }
.done { color: green; }
li.urgent { color: crimson; }
```

Con ese cambio, lo medí en Chrome 154: A es azul (`rgb(0, 0, 128)`), B verde (`rgb(0, 128, 0)`) y C carmesí (`rgb(220, 20, 60)`). A sigue azul porque `:where(#list) li` y `li` empatan en (0,0,1) y gana la que está más abajo.

### Solución 2

Con `content-box`: 500 de ancho del contenido + 32 de relleno (16 + 16) + 4 de borde (2 + 2) = **536 píxeles**, que se sale por 36 píxeles de la columna de 500. Con `border-box`: el ancho de `100%` (500) ya incluye todo, así que mide **500**. Mi medición coincidió: 536 y 500.

```css
.wrap { width: 500px; }
.card { width: 100%; padding: 16px; border: 2px solid black; }
.card.fixed { box-sizing: border-box; }
```

### Solución 3

Hay que cambiar la línea `--color-accent` dentro de `:root`. Por ejemplo, `#6f2da8` (un morado) da 8.03 : 1 sobre blanco, que cumple holgadamente. Un color como `#9a4dff` se ve vivo y **no cumple**: 4.30 : 1, por debajo de 4.5. Con esa única línea cambian de color: los enlaces, el fondo del botón, el contorno del foco y, de rebote, el texto del botón, que es blanco (`--color-surface`) y también necesita contraste suficiente contra el nuevo acento. Esa es la ventaja de nombrar la decisión y no el color: cuatro lugares, una línea. Y la lección que acompaña: al cambiar una variable hay que revisar **todas** las combinaciones donde participa, no solo la que tenías en mente.

### Solución 4

El `!important` hace que `.status` gane a todo. Al quitarlo, las dos reglas tienen la misma especificidad (0,1,0) y decide el orden: `.status-down` va después, así que gana, y el texto es rojo. Un ajuste que además hace la hoja más sólida es usar el patrón de variables de la sección 3.3.1:

```css
.status { color: var(--badge-text); padding: 0 8px; }
.status-down { --badge-text: red; }
```

Con ese patrón no hay conflicto posible: la regla `.status` nunca dice un color, solo lee una variable. Y quien necesite otra variante agrega una clase de una línea. Antes de usarlo, mide que `red` sobre el fondo real cumpla el contraste.

## Cómo sé que lo logré

- [ ] El panel abre en `http://localhost:8000/` con la hoja aplicada, sin errores en la consola de las herramientas del navegador.
- [ ] El validador de CSS (`https://jigsaw.w3.org/css-validator/`) responde «Congratulations! No Error Found» sobre tu `styles.css`.
- [ ] Al presionar Tab ves un aro azul de 3 píxeles alrededor del enlace, del campo, de los radios y del botón, y buscar `outline: none` en tu hoja no da ningún resultado.
- [ ] En el inspector, sobre la caja con `border-box` de `fig03_05.html`, el diagrama de la caja muestra un contenido de 250 píxeles de ancho (300 menos 40 de relleno y 10 de borde), y sobre la otra, 300.
- [ ] Puedes predecir el color de los cuatro párrafos de `fig03_02.html` antes de abrirla, diciendo qué paso de la cascada desempata cada uno.
- [ ] Cada color de texto de tu hoja cumple 4.5 : 1 contra su fondo, y puedes decir con qué herramienta lo mediste.
- [ ] Cambiar el valor de `--color-accent` cambia, a la vez, los enlaces, el botón y el aro del foco.

## Para leer más

- [MDN, «Handling conflicts» (cascada, especificidad y herencia)](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Handling_conflicts) — el artículo de aprendizaje de Mozilla sobre este mismo tema, con retos de práctica. En inglés. Consultado el 7 de octubre de 2026.
- [W3C, «CSS Cascading and Inheritance Level 5»](https://www.w3.org/TR/css-cascade-5/) — la especificación donde está escrito el algoritmo de la cascada, con sus capas y su orden. En inglés. Consultada el 7 de octubre de 2026.
- [MDN, «The box model»](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Box_model) — la caja, el relleno, el borde y el margen con diagramas y `box-sizing`. En inglés. Consultado el 7 de octubre de 2026.
- [web.dev, «Learn CSS»](https://web.dev/learn/css) — curso gratuito de Google por temas, útil como referencia ordenada de selectores, caja, cascada y herencia. En inglés. Consultado el 7 de octubre de 2026.
