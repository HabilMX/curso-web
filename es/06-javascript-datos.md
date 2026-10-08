# Lección 6 — JavaScript y el modelo de datos

**Tiempo:** 90 min (o 2 × 45)

**Qué construyes:** los datos del panel y sus cuentas

**Qué aprendes:** valores, objetos, arreglos y funciones; decisiones, ciclos y errores; módulos; el arreglo de servicios, cuántos están arriba y el promedio de respuesta

**De dónde vienes.** Traes el panel de la [Lección 5](05-pagina-adaptable.md): el HTML con significado de la [Lección 2](02-html-con-significado.md), la hoja de estilos de la Lección 3 y el acomodo de las lecciones 4 y 5, que se adapta de 320 a 1440 px. Es un panel que se ve bien, pero **todo lo que dice está escrito a mano**: «5 servicios revisados», «4 de 5 disponibles», «1 caído», «465 ms» de respuesta promedio. Las cuatro cifras las sumaste tú con una calculadora en la Lección 2, y si hoy cambia un servicio hay que volver a sumarlas. Eso es lo que esta lección quita de en medio. Trabajas en tu carpeta `revisor`, en la subcarpeta `js/` que creaste en la [Lección 1](01-entorno-ciclo-trabajo.md), y sigues sirviendo todo con `python3 -m http.server 8000 --bind 127.0.0.1`: ningún paso de esta lección necesita instalar nada más.

**Qué no hace esta lección.** No toca la página. Los resultados de los programas de hoy aparecen en la **consola** de las herramientas del navegador, no en el panel. Cómo se dibujan en la tabla es el tema de la [Lección 7](07-dom-eventos-estado.md), y de dónde vienen los datos cuando no están escritos en el propio programa, el de la [Lección 8](08-traer-datos.md). Hoy se resuelve primero el problema de fondo: **cómo se representa un servicio, cómo se guarda una lista de ellos y cómo se calculan las cifras a partir de esa lista**.

## Al terminar vas a poder

- Guardar un valor con `const` o `let`, decir de qué tipo es con `typeof` y explicar por qué `120 === "120"` da `false`.
- Representar un servicio como un objeto con propiedades y la lista de servicios como un arreglo de objetos, y leer o cambiar cualquier dato de ellos.
- Recorrer un arreglo con `filter`, `map`, `find`, `some`, `every` y `reduce`, o paso a paso con `for…of`; decidir con `if`, `else` y el operador ternario; avisar de un error con `throw` y atraparlo con `try…catch`, y leer `new` y los tres puntos `...` cuando aparezcan.
- Escribir las dos cuentas del panel —cuántos servicios están disponibles y el promedio de respuesta— como funciones que reciben la lista y devuelven un número.
- Explicar por qué un promedio calculado sin cuidado da 372 ms donde la respuesta correcta es 465, y arreglarlo.
- Partir el programa en módulos (`export` e `import`), cargarlo con `<script type="module">` y explicar por qué ese módulo no abre con doble clic.
- Leer los cinco mensajes de error más frecuentes de esta etapa y decir qué los causó.

## El porqué antes del cómo

Mira el resumen del panel tal como quedó en la Lección 2. Dice que hay 5 servicios, que 4 están disponibles, que 1 está caído y que la respuesta promedio es de 465 ms. Cada una de esas cifras se obtuvo mirando la tabla y haciendo una cuenta. Ahora imagina que la guardia del servicio de correo pide agregarlo al panel: hay que escribir una fila nueva en la tabla y, **por separado**, cambiar el 5 por un 6, el «4 de 5» por «5 de 6» y volver a promediar. Si se te olvida una de las cuatro, el panel se contradice a sí mismo: la tabla cuenta seis filas y el resumen dice cinco. En el Ejercicio 3 de la Lección 2 lo hiciste a mano y viste cuánto cuesta no equivocarse.

El problema es que **el mismo dato está escrito en dos sitios**, y dos copias de un dato siempre terminan por diferir. La solución es escribirlo una sola vez, en un lugar que un programa pueda leer, y que todo lo demás —las filas de la tabla, el 5, el «4 de 5», los 465 ms— se obtenga de ahí. Esa es la idea de esta lección, y de la siguiente: **los datos van aparte, y lo que se ve se calcula a partir de ellos**.

Para eso hace falta un lenguaje de programación, y el de la web es **JavaScript**. Es el lenguaje de programación que todos los navegadores ejecutan por su cuenta, sin instalar nada: HTML dice qué es cada cosa, CSS dice cómo se ve y JavaScript dice qué hace. No hay que confundirlo con Java, que es otro lenguaje sin relación (el parecido de los nombres es histórico y engañoso). [Su especificación se llama **ECMAScript**](https://tc39.es/ecma262/) y la publica Ecma International cada año; [la edición vigente en octubre de 2026 es la 17.ª, de junio de este año](https://ecma-international.org/publications-and-standards/standards/ecma-262/). Para lo que haces hoy no necesitas saber qué trae cada edición, pero sí conviene saber que existe un estándar con un dueño y una versión, igual que HTML y CSS: lo que aprendes funciona de la misma forma en todos los navegadores.

### Cómo se ejecuta un programa en el navegador

Un programa es una lista de instrucciones que se ejecutan **una tras otra, de arriba abajo**. El navegador trae un motor que las lee y las ejecuta. Hay dos formas de ver lo que hace. La primera es la **consola** de las [herramientas del navegador](https://developer.chrome.com/docs/devtools/console): ábrelas con `F12` y entra a la pestaña «Consola». Ahí aparece todo lo que el programa manda imprimir con `console.log(...)`, y también los errores. La segunda es la propia página, que desde la Lección 7 se dibujará con los datos.

Hoy trabajas solo con la consola. Cada programa de esta lección es una página cuya única misión es ejecutar un programa y dejar su resultado a la vista. Cada una tiene un texto que dice «Abre la consola de las herramientas del navegador (F12) para ver el resultado», y esa es la única parte visible. Están en [`programas/06-javascript-datos/`](https://github.com/HabilMX/curso-web/tree/main/programas/06-javascript-datos), en el repositorio del curso. Para ejecutarlas, descárgalo y, desde esa carpeta, [levanta el servidor local y abre la página](https://docs.python.org/3/library/http.server.html):

```bash
$ python3 -m http.server 8000 --bind 127.0.0.1
Serving HTTP on 127.0.0.1 port 8000 (http://127.0.0.1:8000/) ...
```

(Lo que importa es que se queda esperando: la terminal no te devuelve el control. Para detenerlo, `Ctrl`+`C`.) Cada vez que cambies un archivo, recarga la página con `Ctrl`+`Shift`+`R`.

### Un programa que se ve desde afuera: lo que escribiste a mano, calculado

Antes de entrar a la sintaxis, el objetivo concreto. Al final de la lección vas a tener tres archivos pequeños en tu carpeta `js/`: uno con los datos, otro con las dos cuentas y otro que las usa. Y al abrir el panel verás, en la consola, estas cuatro líneas:

```text
Disponibles: 4
Caídos: 1
Respuesta promedio: 465 ms
{"available":4,"down":1,"averageMs":465}
```

Las mismas cifras que escribiste a mano en la Lección 2, pero ahora producidas por un programa a partir de los datos. Si agregas un servicio y recargas, cambian solas. Con ese destino en mente, el camino tiene tres tramos, uno por concepto: primero los valores más sencillos, luego los objetos y los arreglos con que se representan los datos —y, con ellos, cómo decide, repite y avisa de un error un programa—, y por último cómo se reparte el programa en archivos.

## Los conceptos

### 6.1 Valores y variables

#### 6.1.1 Los valores que tiene el panel

Los datos de un servicio son de pocas clases. Un nombre («Catálogo») es un **texto**, que en programación se llama **cadena** (*string*) y se escribe entre comillas. Un tiempo de respuesta (120) es un **número**. Que un servicio esté arriba o abajo es una pregunta de sí o no, y su valor se llama **booleano**: `true` o `false`. Y hay dos valores que significan «nada» y que, al principio, se confunden: `null` y `undefined`. Por eso conviene ver los seis juntos. Según la [guía de MDN sobre gramática y tipos](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types), JavaScript tiene ocho tipos de valores: siete primitivos (booleano, `null`, `undefined`, número, `BigInt`, cadena y símbolo) y uno compuesto, el objeto. En este curso usarás cadenas, números, booleanos, `null` y `undefined`, y los objetos; `BigInt` y los símbolos no aparecen.

Abre `fig06_01.html` y su consola:

```html
<!-- fig06_01.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Valores y variables</title>
</head>
<body>
  <main>
    <h1>Valores y variables</h1>
    <p>Abre la consola de las herramientas del navegador (F12) para ver el resultado.</p>
  </main>
  <script type="module">
    const name = "Catálogo";
    let responseMs = 120;
    const isUp = true;

    console.log(typeof name, typeof responseMs, typeof isUp);

    responseMs = responseMs + 30;
    console.log(`${name} respondió en ${responseMs} ms`);

    const noAnswer = null;
    let notYet;
    console.log(typeof noAnswer, typeof notYet);

    console.log(120 === "120", 120 == "120");
    console.log(0.1 + 0.2, 0.1 + 0.2 === 0.3);
    console.log(Number("abc"), Number.isNaN(Number("abc")));
  </script>
</body>
</html>
```

La consola muestra:

```text
string number boolean
Catálogo respondió en 150 ms
object undefined
false true
0.30000000000000004 false
NaN true
```

Línea por línea:

- `const name = "Catálogo";` **declara una variable**: un nombre que guarda un valor. Después se puede usar `name` donde se necesite el texto. `typeof` pregunta de qué tipo es un valor, y devuelve `"string"`, `"number"` o `"boolean"`; según el [operador `typeof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof), ese es el nombre del tipo.
- `let responseMs = 120;` también declara una variable, pero con `let`, porque su valor va a cambiar: `responseMs = responseMs + 30;` guarda un nuevo valor (150). La plantilla con comillas invertidas, `` `${name} respondió en ${responseMs} ms` ``, se llama [plantilla de texto](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals): lo que va entre `${` y `}` se calcula y se mete en el texto.
- `typeof noAnswer` da `"object"` para `null`. Es una rareza de los orígenes del lenguaje, [un error que nunca se corrigió para no romper los programas viejos](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof). No significa que `null` sea un objeto. Si necesitas saber si algo es `null`, compáralo directamente: `valor === null`.
- `120 === "120"` da `false` y `120 == "120"` da `true`. Aquí hay una regla que te ahorra una tarde: **compara siempre con tres signos, `===`**. El triple igual compara el valor *y* su tipo; el doble igual intenta convertir uno de los dos antes de comparar, y esas conversiones tienen reglas poco intuitivas (el [artículo de MDN sobre igualdad](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness) las enumera). No hay un solo caso del `revisor` en que `==` ayude y muchos en que estorba.
- `0.1 + 0.2` da `0.30000000000000004`. No es un fallo de JavaScript sino de cómo se guardan los números con decimales en cualquier lenguaje que use la norma IEEE 754: todos los números de JavaScript son de punto flotante de 64 bits, según la [documentación de `Number`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number), con unos 15 a 17 dígitos significativos. Algunos decimales sencillos no caben exactos en binario, y se aproximan. Consecuencia práctica: **no compares con `===` el resultado de una cuenta con decimales esperando un valor exacto**; se compara con una tolerancia (que la diferencia sea menor que, por ejemplo, `0.000001`) o se trabaja con enteros, y para dinero, en centavos. Comparar con `===` sí es correcto cuando el número no salió de una cuenta, como un `120` escrito tal cual: el problema no es el `===`, es el redondeo de la cuenta. Los tiempos de respuesta del panel son milisegundos enteros, así que no te toparás con esto hoy; sí conviene haberlo visto una vez.
- `Number("abc")` da [`NaN`, que significa «no es un número»](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN) (*not a number*) y es, curiosamente, un valor de tipo número. Como `NaN === NaN` da `false`, para preguntar si algo es `NaN` no sirve compararlo; la forma más clara es `Number.isNaN(valor)`. Hay otras, como `valor !== valor` (`NaN` es el único valor distinto de sí mismo), pero esa se lee como un truco, y en este curso se usa `Number.isNaN`. Aparecerá más abajo, como síntoma de una cuenta mal hecha.

#### 6.1.2 `const`, `let` y por qué `var` ya no

Ya usaste dos formas de declarar. La tercera, `var`, es la que traen los tutoriales viejos, y en este curso no se usa. [La tabla de MDN lo resume](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types): `var` vive en toda la función donde se declara (y, si se declara fuera de cualquier función, en todo el módulo o en todo el script, según [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var)), se «iza» (se le da existencia, con valor `undefined`, desde el principio de ese ámbito aunque la declares más abajo) y permite redeclarar el mismo nombre sin protestar, mientras que `let` y `const` viven solo dentro del par de llaves donde se declaran y no existen antes de su declaración. Un error que `var` esconde, `let` y `const` lo gritan, y eso es lo que se quiere.

La regla del curso es: **usa `const` por omisión; usa `let` solo cuando de verdad vayas a reasignar**. Esto no tiene que ver con la velocidad sino con la lectura: si ves `const total = ...`, sabes que `total` no va a cambiar en ningún lugar más abajo; si ves `let total`, sabes que hay que buscar dónde cambia.

Hay un matiz que sorprende. `const` impide *reasignar* el nombre, no impide *cambiar lo que hay dentro* del valor si ese valor es un objeto o un arreglo. Lo verás en el apartado siguiente.

### 6.2 Objetos, arreglos y funciones: el modelo de datos

Aquí está el corazón de la lección. Los valores sueltos no alcanzan: un servicio no es un número ni un texto, es *un conjunto de datos que van juntos* (un nombre, un estado, un tiempo), y el panel no tiene un servicio, tiene una *lista* de ellos. Hacen falta dos formas de agrupar: el objeto, que junta datos de distinta clase bajo nombres, y el arreglo, que junta muchas cosas en un orden. JavaScript deja mezclar en un mismo arreglo valores de cualquier tipo (textos, números, objetos, otros arreglos); en el panel, por costumbre y para que se lea fácil, cada arreglo guarda cosas de una sola clase: puros servicios.

#### 6.2.1 El objeto: un servicio

Un **objeto** es una colección de pares **nombre: valor**, escrita entre llaves. Los nombres se llaman **propiedades**. Así se representa un servicio del panel:

```js
const service = {
  id: "catalog",
  name: "Catálogo",
  status: "available",
  responseMs: 120,
  url: "https://catalogo.example/salud",
};
```

Cuatro decisiones de diseño que valen más que la sintaxis:

- Los nombres de las propiedades están **en inglés** (`name`, `status`, `responseMs`) y los valores que se muestran al lector, en español. Es una convención del curso: lo que es código (nombres de archivo, de propiedad, de función) queda igual en todas las ediciones y coincide con la documentación técnica, que es en inglés; lo que lee la persona se traduce.
- `status` es un texto con **dos valores posibles**, `"available"` y `"down"`. No es un booleano `isUp` a propósito: un texto admite más valores que un sí/no sin cambiar la forma del dato, y mañana puede haber un tercer estado, como «lento».
- `responseMs` lleva la **unidad en el nombre**. Un número solo («120») no dice si son segundos o milisegundos; `responseMs` sí. Es un hábito que ahorra errores: la unidad va en el nombre, no en la memoria de quien lee.
- `id` es distinto de `name`: el nombre es lo que se muestra y puede cambiar («Catálogo» pasa a «Catálogo de productos»); el `id` es lo que identifica al servicio y no cambia.

Se lee una propiedad con un punto (`service.name`) o con corchetes y comillas (`service["status"]`). Los corchetes sirven cuando el nombre de la propiedad está en una variable. [Se cambia una propiedad igual que una variable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects): `service.responseMs = 135;`. Y aquí está lo que decía antes: `service` se declaró con `const`, y aun así se puede cambiar `service.responseMs`. `const` protege que el nombre `service` siga apuntando al mismo objeto; no congela el contenido del objeto.

Si pides una propiedad que no existe, no hay error: da `undefined`. Y si pides una propiedad *de* algo que es `undefined` o `null`, sí hay error, y es el más frecuente de todos (lo vas a ver en «El error que vas a ver»). Para esas situaciones existen dos operadores. El **encadenamiento opcional** `?.` dice «si lo de la izquierda es `null` o `undefined`, no sigas y devuelve `undefined`»; según [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining), está disponible en todos los navegadores desde julio de 2020. [El **operador de coalescencia nula**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing) `??` dice «si lo de la izquierda es `null` o `undefined`, usa esto otro»; está disponible en todos los navegadores desde 2020 (el [explorador de características de la plataforma](https://web-platform-dx.github.io/web-features-explorer/features/nullish-coalescing/) lo declara «ampliamente disponible» desde marzo de 2023, la etiqueta que se da 30 meses después de que lo tiene el último navegador). Juntos se lee así: `service.owner?.team ?? "sin responsable"`.

Abre `fig06_02.html` y verás todo esto junto:

```html
<!-- fig06_02.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Un servicio como objeto</title>
</head>
<body>
  <main>
    <h1>Un servicio como objeto</h1>
    <p>Abre la consola de las herramientas del navegador (F12) para ver el resultado.</p>
  </main>
  <script type="module">
    const service = {
      id: "catalog",
      name: "Catálogo",
      status: "available",
      responseMs: 120,
      url: "https://catalogo.example/salud",
    };

    console.log(service.name);
    console.log(service["status"]);

    service.responseMs = 135;
    console.log(service.responseMs);

    console.log(service.owner);
    console.log(service.owner?.team);
    console.log(service.owner?.team ?? "sin responsable");

    const { name, responseMs } = service;
    console.log(name, responseMs);

    const copy = { ...service, status: "down", responseMs: null };
    console.log(service.status, copy.status);

    const text = JSON.stringify(service);
    console.log(text);
    console.log(JSON.parse(text).name);
  </script>
</body>
</html>
```

La consola muestra:

```text
Catálogo
available
135
undefined
undefined
sin responsable
Catálogo 135
available down
{"id":"catalog","name":"Catálogo","status":"available","responseMs":135,"url":"https://catalogo.example/salud"}
Catálogo
```

Tres cosas más aparecen en esa página. La **desestructuración**, `const { name, responseMs } = service;`, saca de un objeto varias propiedades a la vez en variables con el mismo nombre ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)). La **propagación**, `{ ...service, status: "down" }`, copia las propiedades de un objeto en otro nuevo y deja cambiar algunas, y es una copia superficial: copia un nivel, no los objetos que haya dentro de los objetos ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)). Después de `copy`, `service.status` sigue siendo `"available"`: no se modificó el original. Y **JSON**.

#### 6.2.2 JSON: el objeto hecho texto

`JSON.stringify(service)` convierte el objeto en un texto, y `JSON.parse(texto)` hace el camino inverso. Ese texto es JSON (*JavaScript Object Notation*): un formato para escribir datos que **cualquier lenguaje puede leer**, no solo JavaScript. Es el formato en que el panel va a recibir sus datos en la Lección 8, y la norma que lo define es corta, la [ECMA-404](https://ecma-international.org/publications-and-standards/standards/ecma-404/) (la [RFC 8259](https://www.rfc-editor.org/rfc/rfc8259) del IETF es su equivalente para internet).

Se parece a un objeto de JavaScript, pero es más estricto, y las diferencias son las que producen errores de principiante, según la [tabla de MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON): los nombres de las propiedades **siempre** van entre comillas dobles, las cadenas también van entre comillas dobles (nunca sencillas), **no se admiten comentarios**, **no se admite la coma final** después del último elemento, y no existe `undefined`. Un archivo JSON con una coma de más no se lee, y el mensaje de error que da `JSON.parse` varía según el navegador. Hoy no se trabaja con archivos JSON; solo hace falta que, cuando aparezcan, reconozcas que son una forma de escribir lo que ya sabes escribir en JavaScript.

#### 6.2.3 El arreglo: la lista de servicios

Un **arreglo** (*array*) es una lista ordenada de valores entre corchetes. Los elementos se numeran desde **cero**: el primero es `services[0]`, el segundo `services[1]`, y su cantidad está en `services.length`. Esta numeración desde cero es la causa del error más común con arreglos: un arreglo de cinco elementos tiene posiciones de 0 a 4, y pedir la 5 da `undefined`. Para pedir el último elemento sin contar, existe `.at(-1)`: los números negativos cuentan desde el final, y [`at()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at) está disponible en todos los navegadores desde marzo de 2022.

La lista de servicios del panel es un arreglo de objetos, uno por fila de la tabla:

```js
const services = [
  { id: "catalog", name: "Catálogo", status: "available", responseMs: 120 },
  { id: "payments", name: "Pagos", status: "available", responseMs: 480 },
  { id: "inventory", name: "Inventario", status: "down", responseMs: null },
  { id: "notifications", name: "Notificaciones", status: "available", responseMs: 310 },
  { id: "search", name: "Búsqueda", status: "available", responseMs: 950 },
];
```

Fíjate en el servicio caído: su `responseMs` es **`null`**, no `0` ni un texto como `"sin respuesta"`. Es la decisión de modelo más importante de la lección. Un servicio caído **no respondió**, y «no respondió» no es lo mismo que «respondió en cero milisegundos»: usar `0` haría que el promedio lo premiara por estar caído. `null` dice con precisión «aquí no hay dato». El texto «sin respuesta» que ves en la tabla es cosa de la presentación; el dato guarda un `null`.

Ahora, lo que se hace con un arreglo es casi siempre lo mismo: **preguntarle cosas a todos sus elementos a la vez**. Para eso hay métodos, y cada uno recibe una función que dice qué hacer con cada elemento. Antes de verlos, esa función.

#### 6.2.4 Funciones: instrucciones con nombre

Una **función** es un trozo de programa con nombre que recibe datos de entrada (**parámetros**), hace algo y devuelve un resultado con `return`. Se declara así:

```js
function countByStatus(list, status) {
  return list.filter((service) => service.status === status).length;
}
```

`countByStatus` recibe una lista y un estado, y devuelve cuántos servicios de la lista tienen ese estado. Se usa escribiendo su nombre con los datos entre paréntesis: `countByStatus(services, "available")` devuelve `4`. Dos propiedades hacen buena a una función, y se aplican a todas las del panel. Primera: que sea **pura**, es decir, que no dependa de nada de afuera ni cambie nada de afuera: todo lo que usa entra por sus parámetros, y todo lo que produce sale por su `return`. Si la llamas dos veces con los mismos datos, da lo mismo las dos veces. Segunda: que tenga **un solo trabajo** y su nombre lo diga: `countByStatus` cuenta; `averageResponseMs` promedia. Una función así se puede probar sola y se puede reutilizar; la Lección 7 las va a llamar desde varios lugares.

Dentro de `countByStatus` aparece una **función flecha**: `(service) => service.status === status`. Es una función sin nombre, escrita en corto: a la izquierda de la flecha, los parámetros; a la derecha, lo que devuelve ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)). Equivale a `function (service) { return service.status === status; }`. Se usa sobre todo para pasársela a los métodos de los arreglos, que son lo que sigue.

#### 6.2.5 Los métodos del arreglo

Abre `fig06_03.html`:

```html
<!-- fig06_03.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Una lista de servicios</title>
</head>
<body>
  <main>
    <h1>Una lista de servicios</h1>
    <p>Abre la consola de las herramientas del navegador (F12) para ver el resultado.</p>
  </main>
  <script type="module">
    const services = [
      { id: "catalog", name: "Catálogo", status: "available", responseMs: 120 },
      { id: "payments", name: "Pagos", status: "available", responseMs: 480 },
      { id: "inventory", name: "Inventario", status: "down", responseMs: null },
      { id: "notifications", name: "Notificaciones", status: "available", responseMs: 310 },
      { id: "search", name: "Búsqueda", status: "available", responseMs: 950 },
    ];

    console.log(services.length, services[0].name, services.at(-1).name);

    const available = services.filter((service) => service.status === "available");
    console.log(available.length);

    const names = services.map((service) => service.name);
    console.log(names.join(", "));

    const payments = services.find((service) => service.id === "payments");
    console.log(payments.responseMs);

    console.log(services.some((service) => service.status === "down"));
    console.log(services.every((service) => service.status === "down"));

    const slowestFirst = available.toSorted((a, b) => b.responseMs - a.responseMs);
    console.log(slowestFirst.map((service) => service.name).join(" > "));
    console.log(available[0].name);
  </script>
</body>
</html>
```

La consola muestra:

```text
5 Catálogo Búsqueda
4
Catálogo, Pagos, Inventario, Notificaciones, Búsqueda
480
true
false
Búsqueda > Pagos > Notificaciones > Catálogo
Catálogo
```

Cada método recibe una función flecha y la llama con los elementos, en orden. `filter` y `map` la llaman con **todos**. `find`, `some` y `every`, en cambio, se detienen en cuanto ya pueden dar la respuesta ([MDN lo describe](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#iterative_methods)): `find` y `some` en el primer elemento que cumple, `every` en el primero que no cumple. Con la lista del panel, `some` revisa Catálogo, Pagos e Inventario, encuentra el caído y ya no mira Notificaciones ni Búsqueda; `every` se detiene en Catálogo, que no está caído. Lo medí contando las llamadas: 3 y 1.

- [`filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) devuelve un **arreglo nuevo** con solo los elementos para los que la función devuelve `true`. Es la «consulta» del panel: los disponibles son `services.filter((service) => service.status === "available")`, y son 4.
- [`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) devuelve un arreglo nuevo del mismo tamaño, donde cada elemento es lo que devolvió la función para el original. Aquí saca los nombres; en la Lección 7 sacará las filas de la tabla.
- [`find`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find) devuelve **el primer** elemento que cumple la condición, o `undefined` si ninguno la cumple. Aquí busca el servicio con `id` igual a `"payments"` y se queda con su `responseMs` (480).
- [`some`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some) pregunta «¿cumple **alguno**?» y [`every`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every) pregunta «¿cumplen **todos**?». Los dos devuelven `true` o `false`. ¿Hay algún servicio caído? Sí (`some` da `true`). ¿Están todos caídos? No (`every` da `false`).
- [`toSorted`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted) ordena **sin tocar el original** y devuelve una copia ordenada. Según MDN, está disponible en todos los navegadores desde julio de 2023, y el [explorador de características](https://web-platform-dx.github.io/web-features-explorer/features/array-by-copy/) lo declara «ampliamente disponible» desde el 4 de enero de 2026. La última línea lo demuestra: después de ordenar `available` de mayor a menor, `available[0].name` sigue siendo «Catálogo»; el original no cambió.

La función de ordenar necesita una explicación, porque es la que más se tropieza. `toSorted` y su hermano más viejo `sort` reciben una **función comparadora** con dos elementos, `a` y `b`, que devuelve un número: negativo si `a` va antes, positivo si va después, cero si empatan. `b.responseMs - a.responseMs` devuelve un positivo cuando `b` es mayor, o sea que `a` va después: orden descendente. Y la trampa: si no le pasas comparadora, `sort` convierte todo a texto y lo ordena como texto, de modo que `[10, 9, 1].sort()` da `[1, 10, 9]` (lo medí) y no `[1, 9, 10]`, porque «10» va antes que «9» alfabéticamente. Además, [`sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) **modifica el arreglo original**; por eso la regla del curso es usar `toSorted`, que nunca lo modifica.

#### 6.2.6 Decidir, repetir y avisar de un error

Hasta aquí, cada programa se ejecutaba de arriba abajo sin saltarse nada: todas las líneas, una vez cada una. Las cuentas del panel necesitan tres cosas más. **Decidir**: «si el servicio no respondió, no lo sumes». **Repetir**: «haz esto con cada servicio de la lista». Y **avisar de un error**: «este dato no tiene sentido; detente y dilo». Además, hay dos piezas de sintaxis que vas a ver a partir de aquí: la palabra `new` y los tres puntos `...`. Primero la idea de cada una, luego el código, y al final dos páginas que las ejecutan todas.

**Decidir con `if` y `else`.** Una [instrucción `if`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) recibe una **condición** entre paréntesis: casi siempre, una expresión que da `true` o `false`, como `service.status === "available"`. En rigor, `if` acepta cualquier valor y lo convierte: `false`, `0`, `""` (el texto vacío), `null`, `undefined` y `NaN` cuentan como falsos (se les llama [*falsy*](https://developer.mozilla.org/en-US/docs/Glossary/Falsy); la lista completa trae un par de rarezas más), y todo lo demás cuenta como verdadero (*truthy*). Por eso `if ("sí")` entra al bloque y `if (0)` no. En este curso se escriben condiciones que ya dan `true` o `false`, para que se lean sin tener que pensar en conversiones. Si la condición es verdadera, se ejecuta el bloque de llaves que sigue; si es falsa, se lo salta. Con `else` se escribe el otro camino: lo que se hace cuando la condición fue falsa. Y cuando hay más de dos caminos se encadenan con `else if`: el programa revisa las condiciones en orden y toma **el primer** camino cuya condición se cumpla; los demás ya no se revisan. En la vida diaria lo haces sin pensarlo: «si llueve, llevo paraguas; si no, si hace sol, llevo gorra; si no, no llevo nada». Un detalle de forma: cuando el bloque tiene una sola instrucción, las llaves se pueden omitir y se escribe todo en un renglón (`if (button === null) return;`). En este curso se omiten solo en esos renglones cortos.

**Invertir una condición con `!`.** El [operador `!`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_NOT) se lee «no»: `!true` es `false` y `!false` es `true`. Sirve para escribir la condición al revés sin cambiarla: `if (!allUp)` se lee «si no están todos arriba».

**Decidir un valor con el operador ternario.** Muchas veces la decisión no es «qué hago» sino «qué valor uso». Para eso existe el [operador condicional](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator), que se llama **ternario** porque tiene tres partes: `condición ? valorSiSí : valorSiNo`. La expresión entera *vale* uno de los dos, así que se puede guardar en una variable o meter en una plantilla de texto. `` responseMs === null ? "sin respuesta" : `${responseMs} ms` `` dice: «si no hay dato, el texto es "sin respuesta"; si lo hay, es el número con su unidad». Úsalo cuando cada camino sea un valor corto; si cada camino tiene varias instrucciones, un `if` se lee mejor.

**Repetir con `for…of`.** Los métodos de la sección anterior (`filter`, `map`…) recorren un arreglo por dentro. A veces conviene recorrerlo tú, paso a paso, y para eso está el ciclo [`for…of`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of): `for (const service of services) { … }` ejecuta el bloque **una vez por cada elemento**, en orden, y en cada vuelta `service` es el elemento de esa vuelta. Se declara con `const` porque dentro de una vuelta no cambia; en la siguiente vuelta es otra variable con el siguiente elemento. Dentro del ciclo, la instrucción [`continue`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/continue) dice «esta vuelta termina aquí; pasa al siguiente elemento». Y aparece un operador abreviado: `total += service.responseMs` es lo mismo que `total = total + service.responseMs` (por eso `total` se declara con `let`: cambia en cada vuelta).

Abre `fig06_04.html`, y antes de mirar la consola **predice** qué línea imprime el ciclo para Inventario y cuál es el total final:

```html
<!-- fig06_04.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Decidir y repetir</title>
</head>
<body>
  <main>
    <h1>Decidir y repetir</h1>
    <p>Abre la consola de las herramientas del navegador (F12) para ver el resultado.</p>
  </main>
  <script type="module">
    const services = [
      { id: "catalog", name: "Catálogo", status: "available", responseMs: 120 },
      { id: "payments", name: "Pagos", status: "available", responseMs: 480 },
      { id: "inventory", name: "Inventario", status: "down", responseMs: null },
      { id: "notifications", name: "Notificaciones", status: "available", responseMs: 310 },
      { id: "search", name: "Búsqueda", status: "available", responseMs: 950 },
    ];

    // if / else: una decisión con dos caminos.
    const first = services[0];
    if (first.status === "available") {
      console.log(`${first.name} está disponible.`);
    } else {
      console.log(`${first.name} está caído.`);
    }

    // else if: más de dos caminos; se toma el primero cuya condición se cumpla.
    const payments = services[1];
    if (payments.responseMs === null) {
      console.log(`${payments.name} no respondió.`);
    } else if (payments.responseMs > 500) {
      console.log(`${payments.name} respondió lento.`);
    } else {
      console.log(`${payments.name} respondió a tiempo.`);
    }

    // ! invierte un booleano.
    const allUp = services.every((service) => service.status === "available");
    console.log(allUp, !allUp);

    // El operador ternario: una decisión que produce un valor.
    const inventory = services[2];
    const time = inventory.responseMs === null ? "sin respuesta" : `${inventory.responseMs} ms`;
    console.log(`${inventory.name}: ${time}`);

    // for...of: las mismas instrucciones para cada elemento, uno tras otro.
    let total = 0;
    for (const service of services) {
      if (service.responseMs === null) {
        console.log(`${service.name}: sin respuesta, no se suma`);
        continue;
      }
      total += service.responseMs;
      console.log(`${service.name}: ${service.responseMs} ms, van ${total}`);
    }
    console.log(`Total: ${total} ms`);
  </script>
</body>
</html>
```

La consola muestra:

```text
Catálogo está disponible.
Pagos respondió a tiempo.
false true
Inventario: sin respuesta
Catálogo: 120 ms, van 120
Pagos: 480 ms, van 600
Inventario: sin respuesta, no se suma
Notificaciones: 310 ms, van 910
Búsqueda: 950 ms, van 1860
Total: 1860 ms
```

Sigue el ciclo vuelta por vuelta, como si fueras el motor: `total` empieza en 0; en la vuelta de Catálogo pasa a 120, en la de Pagos a 600; en la de Inventario la condición `service.responseMs === null` es verdadera, se imprime el aviso y `continue` salta el resto de esa vuelta, así que `total` sigue en 600; luego 910 y 1,860. Pagos tomó el último camino de su `if…else if…else` porque 480 no es `null` ni es mayor que 500. Y `allUp` es `false` porque Inventario está caído, de modo que `!allUp` es `true`. Fíjate en que el ciclo hace a mano lo mismo que hará `reduce` en la sección siguiente, y con el mismo cuidado: el que no respondió no se suma.

**Avisar de un error con `throw`, y atraparlo con `try…catch`.** Hay situaciones en que una función no puede hacer su trabajo: le llegó un tiempo de respuesta que no es un número, o un archivo que no existe. Devolver un valor cualquiera escondería el problema. Lo correcto es **lanzar** un error con la instrucción [`throw`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw): `throw new Error("mensaje")`. En ese instante la función se detiene y el error «sube» a quien la llamó, y a quien llamó a esa, y así hasta que alguien lo atrape. Si nadie lo atrapa, el programa se detiene y la consola lo muestra en rojo: así se ven los errores de la sección «El error que vas a ver».

Atraparlo es decir de antemano «intenta esto, y si falla, haz esto otro». Eso es [`try…catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch): dentro de `try { … }` va lo que puede fallar; si una instrucción lanza un error, las que siguen dentro del `try` **ya no se ejecutan** y el programa salta al bloque `catch (error) { … }`, donde `error` es lo que se lanzó. Después del `catch`, el programa sigue normalmente. Un error de JavaScript es un objeto con dos propiedades que vas a leer mucho: `error.name`, el tipo de error (`Error`, `TypeError`…), y `error.message`, el texto que lo explica.

**Crear un objeto con `new`.** En el `throw` apareció la palabra `new`. Algunos objetos no se escriben con llaves sino que se **fabrican** con un *constructor*, una función especial que arma un objeto de cierto tipo y lo deja listo para usarse. El [operador `new`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new) es la forma de pedírselo: `new Error("Sin conexión")` fabrica un objeto de error con ese mensaje, y `new Intl.NumberFormat("es-MX")` fabrica un formateador de números para el español de México, que verás en la sección siguiente. Por convención, los nombres de los constructores empiezan con mayúscula (`Error`, `Intl.NumberFormat`, y más adelante `AbortController` o `FormData`). En este curso no vas a escribir constructores propios; solo vas a usar los que trae el navegador.

**Los tres puntos: la propagación.** Ya la viste en 6.2.1 con objetos: `{ ...service, status: "down" }` copia las propiedades de `service` en un objeto nuevo y deja cambiar algunas. La [sintaxis de propagación](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) (*spread*) hace lo mismo en otros dos lugares. **En un arreglo**, `[...times, 210]` crea un arreglo nuevo con los elementos de `times` y uno más al final; `times` no cambia. **En una llamada a función**, `Math.max(...times)` «desparrama» los elementos del arreglo como si los hubieras escrito uno por uno, separados por comas: `Math.max(120, 480, 310, 950)`. Es útil con funciones que reciben cualquier cantidad de argumentos, como `Math.max` o, en la Lección 7, `replaceChildren`.

Abre `fig06_05.html`. **Predice** antes: ¿se imprime «Esta línea no se ejecuta.»? ¿Qué tamaño tiene `times` después de crear `withMail`?

```html
<!-- fig06_05.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Avisar de un error, new y propagación</title>
</head>
<body>
  <main>
    <h1>Avisar de un error, new y propagación</h1>
    <p>Abre la consola de las herramientas del navegador (F12) para ver el resultado.</p>
  </main>
  <script type="module">
    // throw: avisar de que algo no tiene sentido y detener lo que se estaba haciendo.
    function checkResponseMs(value) {
      if (typeof value !== "number") {
        throw new Error(`Se esperaba un número y llegó: ${value}`);
      }
      return value;
    }

    // try / catch: intentar algo y, si falla, seguir por otro camino.
    try {
      console.log(checkResponseMs(120));
      console.log(checkResponseMs("rápido"));
      console.log("Esta línea no se ejecuta.");
    } catch (error) {
      console.log(`Se atrapó un ${error.name}: ${error.message}`);
    }
    console.log("El programa sigue.");

    // new: crear un objeto nuevo a partir de un constructor.
    const failure = new Error("Sin conexión");
    console.log(failure.message);
    const format = new Intl.NumberFormat("es-MX");
    console.log(format.format(1860));

    // ...: la propagación, en una llamada, en un arreglo y en un objeto.
    const times = [120, 480, 310, 950];
    console.log(Math.max(...times));
    const withMail = [...times, 210];
    console.log(withMail.length, times.length);
    const mail = { id: "mail", name: "Correo", status: "available", responseMs: 210 };
    const mailDown = { ...mail, status: "down", responseMs: null };
    console.log(mail.status, mailDown.status, mailDown.name);
  </script>
</body>
</html>
```

La consola muestra:

```text
120
Se atrapó un Error: Se esperaba un número y llegó: rápido
El programa sigue.
Sin conexión
1,860
950
5 4
available down Correo
```

La primera llamada a `checkResponseMs` recibe un número y lo devuelve: se imprime 120. La segunda recibe el texto `"rápido"`; `typeof` dice `"string"`, se cumple la condición del `if` y se lanza el error. La línea siguiente del `try` nunca se ejecuta, el `catch` recibe el error e imprime su nombre y su mensaje, y el programa sigue. Luego `new` fabrica un error que no se lanza (un error es un objeto como cualquier otro: lanzarlo es una decisión aparte) y un formateador que escribe 1,860 con la coma de miles que se usa en México. Por último, la propagación: `Math.max(...times)` da 950; `withMail` tiene 5 elementos y `times` sigue con 4; y `mailDown` es una copia de `mail` con dos propiedades cambiadas y el nombre intacto, mientras que `mail` sigue disponible.

Con esto tienes todas las piezas de las cuentas del panel. Si quieres ver las mismas ideas con otros ejemplos, la guía de MDN dedica un capítulo al [control de flujo y el manejo de errores](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling) y otro a los [ciclos](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration).

#### 6.2.7 Las cuentas del panel

Con todo lo anterior se escriben las cuentas. La primera ya la tienes: `countByStatus`. La segunda, el promedio, es la que enseña más. En `fig06_06.html`:

```html
<!-- fig06_06.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Cuentas con funciones</title>
</head>
<body>
  <main>
    <h1>Cuentas con funciones</h1>
    <p>Abre la consola de las herramientas del navegador (F12) para ver el resultado.</p>
  </main>
  <script type="module">
    const services = [
      { id: "catalog", name: "Catálogo", status: "available", responseMs: 120 },
      { id: "payments", name: "Pagos", status: "available", responseMs: 480 },
      { id: "inventory", name: "Inventario", status: "down", responseMs: null },
      { id: "notifications", name: "Notificaciones", status: "available", responseMs: 310 },
      { id: "search", name: "Búsqueda", status: "available", responseMs: 950 },
    ];

    function countByStatus(list, status) {
      return list.filter((service) => service.status === status).length;
    }

    function averageResponseMs(list) {
      const answered = list.filter((service) => Number.isFinite(service.responseMs));
      if (answered.length === 0) {
        return null;
      }
      const total = answered.reduce((sum, service) => sum + service.responseMs, 0);
      return total / answered.length;
    }

    console.log(countByStatus(services, "available"));
    console.log(countByStatus(services, "down"));
    console.log(averageResponseMs(services));
    console.log(averageResponseMs([]));

    const withoutSearch = services.filter((service) => service.id !== "search");
    const average = averageResponseMs(withoutSearch);
    console.log(average);
    console.log(Math.round(average));
    console.log(average.toFixed(1), typeof average.toFixed(1));
    console.log(new Intl.NumberFormat("es-MX", { maximumFractionDigits: 1 }).format(average));
  </script>
</body>
</html>
```

La consola muestra:

```text
4
1
465
null
303.3333333333333
303
303.3 string
303.3
```

`averageResponseMs` hace tres cosas, y cada una es una decisión:

1. **Se queda solo con los servicios que traen un tiempo medido** (`filter`). La prueba es [`Number.isFinite(service.responseMs)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite), que responde `true` solo cuando el valor es un número de verdad: no `null`, no un texto como `"120"`, no `NaN`. Un servicio caído trae `null` y queda fuera. Fíjate en que la pregunta es «¿tengo un número que promediar?» y no «¿en qué estado está?»: si mañana apareciera un estado nuevo, digamos «lento», con su tiempo medido, entraría al promedio sin cambiar la función.
2. **Si no queda ninguno, devuelve `null`** y no un número. Promediar nada no es cero: es no tener dato, y de nuevo `null` lo dice con precisión. Sin esa guarda, dividir entre cero daría `NaN`.
3. **Suma con `reduce` y divide entre cuántos son.**

[`reduce`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) es el método más difícil de leer y el que más conviene entender. Recorre el arreglo con un **acumulador**: una variable que guarda el resultado hasta el momento. Recibe dos cosas: una función de dos parámetros (el acumulador y el elemento actual) que devuelve el nuevo valor del acumulador, y el **valor inicial** del acumulador. En `answered.reduce((sum, service) => sum + service.responseMs, 0)`, el acumulador `sum` empieza en `0`, y por cada servicio se le suma su `responseMs`: 0 + 120 = 120, 120 + 480 = 600, 600 + 310 = 910, 910 + 950 = 1,860. El resultado, 1,860, se divide entre 4 y da 465, la cifra que escribiste a mano en la Lección 2.

Las últimas líneas de la página muestran cómo se presenta un número con decimales. Con `withoutSearch` (los servicios sin el de búsqueda) el promedio es 303.3333333333333; ese número, tal cual, no se le enseña a nadie. Hay tres formas de redondearlo y cada una devuelve algo distinto: [`Math.round`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round) devuelve un **número** entero (303); [`toFixed(1)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed) devuelve un **texto** con un decimal («303.3», y la consola lo confirma con `typeof`, que dice `string`), de modo que no se puede seguir sumando con él sin convertirlo; y [`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat), que formatea según el idioma y el país, disponible en todos los navegadores desde 2017. Con `"es-MX"` usa el punto decimal que se usa en México. La regla: **se calcula con números completos y se redondea solo al final, para mostrarlo**.

#### 6.2.8 El promedio que sale mal

Hay una forma de escribir el promedio que parece correcta y da una cifra distinta, sin ningún error en la consola. Está en `fig06_07.html`:

```html
<!-- fig06_07.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>El promedio que sale mal</title>
</head>
<body>
  <main>
    <h1>El promedio que sale mal</h1>
    <p>Abre la consola de las herramientas del navegador (F12) para ver el resultado.</p>
  </main>
  <script type="module">
    const services = [
      { id: "catalog", name: "Catálogo", status: "available", responseMs: 120 },
      { id: "payments", name: "Pagos", status: "available", responseMs: 480 },
      { id: "inventory", name: "Inventario", status: "down", responseMs: null },
      { id: "notifications", name: "Notificaciones", status: "available", responseMs: 310 },
      { id: "search", name: "Búsqueda", status: "available", responseMs: 950 },
    ];

    const total = services.reduce((sum, service) => sum + service.responseMs, 0);
    console.log(total, total / services.length);

    console.log(null + 1, undefined + 1, "5" + 1, "5" - 1);

    const first = [].reduce((sum, service) => sum + service.responseMs, 0);
    console.log(first);

    try {
      [].reduce((sum, service) => sum + service.responseMs);
    } catch (error) {
      console.log(error.name + ": " + error.message);
    }
  </script>
</body>
</html>
```

La consola muestra:

```text
1860 372
1 NaN 51 4
0
TypeError: Reduce of empty array with no initial value
```

La primera línea suma los tiempos de **todos** los servicios, incluido el caído, y divide entre **cinco**. Da 372 en lugar de 465. ¿Por qué no falló al sumar un `null`? Porque JavaScript, al encontrarse `120 + null`, **convierte el `null` en cero** sin avisar. La suma sigue dando 1,860 (el caído aportó cero), pero la división es entre 5 y no entre 4. El resultado es un número verosímil, 372, que se parece a un tiempo de respuesta y que nadie sospecha, y el panel mostraría la cifra equivocada con total seguridad. **Este es el error silencioso típico de los datos: no hay mensaje, hay un número que no es el correcto.** La segunda línea muestra la familia de conversiones de la que sale: `null + 1` es `1`, `undefined + 1` es `NaN`, `"5" + 1` es `"51"` (el `+` con un texto concatena) y `"5" - 1` es `4` (el `-` sí convierte). Se puede aprender cada regla, pero es más barato seguir esta: **antes de calcular, comprueba que el dato exista**, que es lo que hace `filter` en la función de arriba.

Las dos últimas líneas muestran un límite de `reduce`. Con un arreglo vacío y un valor inicial (`0`), devuelve el valor inicial. Sin valor inicial, intenta usar el primer elemento como acumulador, no hay primer elemento y lanza un `TypeError` (lo atrapa el `try…catch` de 6.2.6), cuyo texto copié de la consola de Chrome: «Reduce of empty array with no initial value». Otro navegador puede redactarlo distinto. La regla: **`reduce` siempre lleva valor inicial**.

### 6.3 Módulos: repartir el programa en archivos

#### 6.3.1 Por qué partir

Hasta ahora, todo el programa vivía dentro de una página. Eso sirve para un experimento y se vuelve inmanejable en cuanto el panel tiene datos, cuentas y (desde la Lección 7) dibujo. Hay una forma sencilla de ordenar lo que escribes: **cada archivo hace una cosa**. Un archivo guarda los datos, otro las cuentas, otro une todo. Quien abre el proyecto sabe dónde buscar, y el archivo de las cuentas se puede reusar con otros datos.

Para que un archivo pueda usar lo de otro hace falta un mecanismo, y ese mecanismo es el **módulo**. Un archivo de JavaScript es un módulo cuando se carga como tal; lo que declara dentro es **privado** a menos que lo marques con `export`, y otro archivo lo trae con `import`. Los tres archivos del panel son:

```js
// fig06_08/services.js
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
// fig06_08/stats.js
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

```js
// fig06_08/main.js
import { services } from "./services.js";
import { summarize } from "./stats.js";

const summary = summarize(services);

console.log(`Disponibles: ${summary.available}`);
console.log(`Caídos: ${summary.down}`);
console.log(
  summary.averageMs === null
    ? "Respuesta promedio: sin datos"
    : `Respuesta promedio: ${summary.averageMs} ms`,
);
console.log(JSON.stringify(summary));
```

`services.js` exporta el arreglo `services`. `stats.js` exporta tres funciones: las dos cuentas y una tercera, `summarize`, que las junta en un objeto con las tres cifras del resumen. `main.js` importa lo que necesita de cada uno, calcula, y manda el resultado a la consola. Según la [documentación de MDN sobre módulos](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), una declaración `import { services } from "./services.js";` trae por su nombre lo que el otro archivo exportó con [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) (los nombres entre llaves tienen que coincidir exactamente), y la ruta empieza con `./` para decir «en la misma carpeta que este archivo».

Esa es la forma de los datos que tendrá el panel en las lecciones siguientes. Fíjate en `summarize`: devuelve un **objeto** con `available`, `down` y `averageMs`. Es exactamente el resumen de la Lección 2, y en la Lección 7 se dibujará en pantalla.

#### 6.3.2 Cómo se carga un módulo

La página que lo ejecuta es `fig06_08.html`:

```html
<!-- fig06_08.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Los datos del panel y sus cuentas</title>
  <script type="module" src="fig06_08/main.js"></script>
</head>
<body>
  <main>
    <h1>Los datos del panel y sus cuentas</h1>
    <p>Abre la consola de las herramientas del navegador (F12) para ver el resultado.</p>
  </main>
</body>
</html>
```

Todo está en una línea: `<script type="module" src="fig06_08/main.js"></script>`. El atributo `type="module"` le dice al navegador que ese archivo es un módulo y no un guion clásico, según el [estándar HTML](https://html.spec.whatwg.org/multipage/scripting.html) y la [referencia del elemento `script`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script). Tres consecuencias de eso, que MDN enumera y que vale la pena aprender de una vez:

- **Se difiere solo.** Un módulo se ejecuta *después* de que el navegador leyó todo el HTML. No hace falta `defer` ni ponerlo al final del `<body>`: se puede cargar desde el `<head>`.
- **Usa el modo estricto.** Un módulo funciona siempre en [modo estricto](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode), que convierte en errores unas cuantas cosas que el lenguaje antes toleraba en silencio (por ejemplo, asignarle un valor a una variable que nunca declaraste: sin modo estricto, ese error de dedo crea en silencio una variable global; en modo estricto, es un `ReferenceError`).
- **Tiene su propio ámbito.** Lo que declara un módulo no es visible desde fuera, ni siquiera desde la consola: si en `main.js` hay una variable `summary`, escribir `summary` en la consola no la encuentra. Es una ventaja: dos archivos pueden usar el mismo nombre sin pisarse. Y una incomodidad para quien depura: para inspeccionar algo se imprime con `console.log`.

Al abrir `fig06_08.html` en el navegador, la consola muestra:

```text
Disponibles: 4
Caídos: 1
Respuesta promedio: 465 ms
{"available":4,"down":1,"averageMs":465}
```

Las mismas cuatro cifras que escribiste a mano, ahora calculadas. Y ahora, el paso que cierra la lección en el proyecto: en la carpeta `revisor`, pon los tres archivos en `js/` (`js/services.js`, `js/stats.js`, `js/main.js`; la ruta de los `import` no cambia porque siguen en la misma carpeta) y agrega en el `<head>` de tu `index.html`:

```html
<script type="module" src="js/main.js"></script>
```

Recarga `index.html`: la página se ve exactamente igual, pero en la consola aparecen las cuatro líneas de arriba. Compara cada una con lo que dice el resumen del panel: 4 disponibles, 1 caído, 465 ms. Si coinciden, el modelo de datos reproduce lo que habías calculado a mano. Si agregas un servicio al arreglo y recargas, las cifras de la consola cambian, y el resumen escrito en el HTML no: ese será el trabajo de la Lección 7.

#### 6.3.3 Por qué no abre con doble clic

Si abres `fig06_08.html` con doble clic en el administrador de archivos, la dirección empieza con `file:///` y la consola muestra un error rojo. Lo copié de Chrome 154 (otro navegador lo redacta distinto):

```text
Access to script at 'file:///.../programas/06-javascript-datos/fig06_08/main.js' from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: chrome, chrome-experimental-site-token-provider, chrome-extension, chrome-untrusted, data, http, https, isolated-app.
```

Es lo que anticipó la Lección 1. Los módulos se piden con el mismo mecanismo con que el navegador pide cosas a otros sitios, y ese mecanismo exige un protocolo de red (`http` o `https`), no una lectura de disco. Con `file://` el origen de la página es `null` y la petición se bloquea. La solución no es tocar el navegador: es abrir la página desde el servidor local (`python3 -m http.server 8000 --bind 127.0.0.1`, y `http://localhost:8000/`). Es la razón por la que el curso instala el servidor desde la primera lección.

## El error que vas a ver

Esta etapa tiene cinco mensajes que vas a leer muchas veces. Se aprenden mejor provocándolos a propósito. Los cinco están copiados de la consola de Chrome 154 con las páginas de [`programas/06-javascript-datos/`](https://github.com/HabilMX/curso-web/tree/main/programas/06-javascript-datos); el navegador que uses puede redactarlos distinto, pero dicen lo mismo.

### `Cannot read properties of undefined (reading 'name')`

El error más frecuente de JavaScript. Abre `fig06_09.html`:

```html
<!-- fig06_09.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Leer algo que no existe</title>
</head>
<body>
  <main>
    <h1>Leer algo que no existe</h1>
    <p>Abre la consola de las herramientas del navegador (F12) para ver el resultado.</p>
  </main>
  <script type="module">
    const services = [
      { id: "catalog", name: "Catálogo", status: "available", responseMs: 120 },
      { id: "payments", name: "Pagos", status: "available", responseMs: 480 },
      { id: "inventory", name: "Inventario", status: "down", responseMs: null },
      { id: "notifications", name: "Notificaciones", status: "available", responseMs: 310 },
      { id: "search", name: "Búsqueda", status: "available", responseMs: 950 },
    ];

    const sixth = services[5];
    console.log(sixth.name);
  </script>
</body>
</html>
```

La consola muestra, en rojo:

```text
Cannot read properties of undefined (reading 'name')
```

Léelo de derecha a izquierda: el programa quiso leer la propiedad `name` de algo que es `undefined`. ¿De qué? De `services[5]`. El arreglo tiene cinco elementos, con posiciones de 0 a 4, y pedir la 5 da `undefined`; y pedirle una propiedad a `undefined` es un error ([MDN lo explica con más detalle](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cant_access_property)). A la derecha del mensaje, la consola muestra el archivo y la línea en que ocurrió; al hacer clic en ella, las herramientas abren esa línea. Las soluciones son dos: confirmar que no te pasas del final (`services.length`, `.at(-1)`), o, si el elemento puede no existir, usar `?.`: `services[5]?.name` da `undefined` sin error.

### `Assignment to constant variable.`

En `fig06_10.html`, `const total = 0; total = total + 120;`:

```html
<!-- fig06_10.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Reasignar una constante</title>
</head>
<body>
  <main>
    <h1>Reasignar una constante</h1>
    <p>Abre la consola de las herramientas del navegador (F12) para ver el resultado.</p>
  </main>
  <script type="module">
    const total = 0;
    total = total + 120;
    console.log(total);
  </script>
</body>
</html>
```

El mensaje es literalmente ese, y dice lo que hiciste: intentaste reasignar una `const` ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Invalid_const_assignment)). Si el valor va a cambiar, la variable debía ser `let`.

### `Cannot use import statement outside a module`

En `fig06_11.html`, la misma `main.js`, pero con `<script src="...">` sin `type="module"`:

```html
<!-- fig06_11.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Un import sin type="module"</title>
  <script src="fig06_08/main.js"></script>
</head>
<body>
  <main>
    <h1>Un import sin type="module"</h1>
  </main>
</body>
</html>
```

La consola muestra:

```text
Cannot use import statement outside a module
```

Un `import` solo se entiende dentro de un módulo; un guion clásico no sabe qué es. Se arregla agregando `type="module"` al `<script>`.

### `The requested module './fig06_08/services.js' does not provide an export named 'servicios'`

En `fig06_12.html`, un módulo pide un nombre que el otro archivo no exporta:

```html
<!-- fig06_12.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Importar lo que no se exportó</title>
  <script type="module">
    import { servicios } from "./fig06_08/services.js";

    console.log(servicios.length);
  </script>
</head>
<body>
  <main>
    <h1>Importar lo que no se exportó</h1>
  </main>
</body>
</html>
```

La consola muestra:

```text
The requested module './fig06_08/services.js' does not provide an export named 'servicios'
```

Dice con claridad qué archivo y qué nombre. El archivo exporta `services` (en inglés) y aquí se pidió `servicios`: un nombre mal escrito, y los nombres tienen que coincidir carácter por carácter. Se corrige escribiendo el nombre como está en el `export`.

### `Access to script ... has been blocked by CORS policy`

Es el de la sección 6.3.3, el que sale cuando abres con doble clic en vez de usar el servidor.

## Lo que se hace mal

**Escribir `var`.** Ya viste por qué: vive en toda la función, se iza y permite redeclarar, así que esconde errores que `let` y `const` muestran. Costo: un nombre que cambia de valor desde un rincón del programa que no esperabas.

**Comparar con `==`.** `120 == "120"` da `true`; en un panel que recibe datos de fuera, un tiempo que llega como texto pasaría las comparaciones por número. Con `===`, la discrepancia salta a la vista.

**Guardar un número como texto.** `responseMs: "120"` parece lo mismo y ya no lo es: `"120" + 1` da `"1201"`. Los datos que son cantidades se guardan como números, sin comillas, y la unidad va en el nombre.

**Representar «no respondió» con `0`, con `""` o con `"sin respuesta"`.** Con `0` el promedio premia al servicio caído; con un texto, la suma se vuelve una concatenación o un `NaN`. Un dato que falta se guarda como `null`, y las funciones deciden qué hacer con él.

**Promediar sin filtrar.** Es el 372 en lugar del 465 de 6.2.8: un número creíble, sin error y equivocado. Antes de promediar, hay que quedarse con lo que sí tiene dato.

**Usar `sort()` donde se quería una copia.** `sort` cambia el arreglo original, y quien lo usaba más arriba lo ve reordenado sin saber por qué. Con `toSorted` no ocurre. Y sin función comparadora, ordena como texto: `[10, 9, 1]` da `[1, 10, 9]`.

**Seguir calculando con un número ya redondeado a texto.** `toFixed` devuelve un texto. Si lo sumas, concatenas. Se redondea al final, solo para mostrar.

**Un `reduce` sin valor inicial.** Funciona hasta el día en que el arreglo llega vacío, y entonces lanza un `TypeError` en el peor momento.

**Los mismos datos escritos en dos sitios.** Es el problema con que empieza la lección: la tabla dice seis filas y el resumen dice cinco. Los datos viven en un solo lugar; lo demás se calcula.

## Ejercicios

### Ejercicio 1 — Agrega un servicio y mira cambiar las cifras

En tu copia de `services.js`, agrega un sexto servicio: `Correo`, `id` `"mail"`, disponible, con 210 ms. Sin tocar `stats.js` ni `main.js`, recarga la página y anota las tres cifras. Antes de recargar, predice los números: cuántos servicios disponibles habrá y cuál será el promedio. ¿Coincide la predicción con lo que sale?

### Ejercicio 2 — Los más lentos

Escribe en `stats.js` una función `slowest(list, n)` que devuelva los **nombres** de los `n` servicios disponibles con mayor tiempo de respuesta, del más lento al más rápido. No debe modificar la lista que recibe. Pruébala con `n = 2` y con un `n` mayor que la cantidad de servicios disponibles, y con una lista vacía. Pista: encadena `filter`, `toSorted`, `slice` y `map`. De los cuatro, [`slice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) es el único que no has visto: `lista.slice(inicio, fin)` devuelve un arreglo **nuevo** con los elementos desde la posición `inicio` hasta la anterior a `fin`, sin tocar el original. `[10, 20, 30].slice(0, 2)` da `[10, 20]`: los dos primeros.

### Ejercicio 3 — Contar todos los estados de una vez

`countByStatus` recorre la lista una vez por cada estado que le preguntas. Escribe `countsByStatus(list)` que la recorra **una sola vez** con `reduce` y devuelva un objeto con una propiedad por cada estado que aparezca, por ejemplo `{ available: 4, down: 1 }`. Debe devolver un objeto sin propiedades para una lista vacía. Pista: el acumulador es un objeto, y `counts[service.status] ?? 0` te da el conteo actual o cero si el estado todavía no se había visto. Y una pregunta para después de resolverlo: ¿qué pasa si algún servicio llega con el estado `"toString"`?

### Ejercicio 4 — Provoca cuatro errores y léelos

En una copia del proyecto, provoca uno por uno estos cuatro errores y apunta el mensaje exacto que muestra tu navegador: (a) pedir un servicio que no existe y leer su `name`; (b) importar un nombre mal escrito; (c) reasignar una `const`; (d) quitar `type="module"` del `<script>`. Para cada uno, escribe en una frase qué significa el mensaje y cuál es la corrección.

## Soluciones

### Solución 1

Con seis servicios (cinco disponibles, uno caído), la predicción es: Disponibles 5, Caídos 1, y el promedio de los cinco que respondieron es (120 + 480 + 310 + 950 + 210) / 5 = 2,070 / 5 = 414. Lo verifiqué ejecutando el programa: da 414. El servicio caído sigue sin contar para el promedio. Lo importante del ejercicio es lo que **no** hubo que tocar: ni las cuentas ni el programa principal. Cambiaste los datos, que viven en un solo sitio, y todo lo demás se recalculó. Esa es la ganancia de separar datos y cuentas.

### Solución 2

Se filtran los disponibles (los caídos no tienen tiempo), se ordena una copia de mayor a menor, se toman los primeros `n` y se extrae el nombre:

```js
export function slowest(list, n) {
  return list
    .filter((service) => service.status === "available")
    .toSorted((a, b) => b.responseMs - a.responseMs)
    .slice(0, n)
    .map((service) => service.name);
}
```

Con los cinco servicios originales, `slowest(services, 2)` devuelve `["Búsqueda", "Pagos"]` (950 y 480). Con `n` igual a 10 devuelve los cuatro disponibles, `["Búsqueda", "Pagos", "Notificaciones", "Catálogo"]`: `slice(0, n)` no falla si `n` es mayor que el largo, simplemente devuelve todo. Con una lista vacía devuelve `[]`. La lista original no cambia, porque `filter` y `toSorted` devuelven copias. Si hubieras usado `sort` sobre `list`, habrías reordenado los datos del panel sin que nadie se enterara.

### Solución 3

```js
export function countsByStatus(list) {
  return list.reduce((counts, service) => {
    counts[service.status] = (counts[service.status] ?? 0) + 1;
    return counts;
  }, Object.create(null));
}
```

Para los cinco servicios devuelve `{ available: 4, down: 1 }`, y para `[]` devuelve un objeto sin propiedades (el valor inicial, porque no hay elementos). El acumulador es el objeto que se pasa como segundo argumento de `reduce`.

**Por qué `Object.create(null)` y no `{}`.** Es la respuesta a la pregunta del enunciado. Un objeto escrito como `{}` no está vacío del todo: [hereda](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) de JavaScript un puñado de propiedades que no ves, como `toString`. Si un servicio llega con el estado `"toString"`, `counts["toString"] ?? 0` no da `0` sino esa función heredada, y la cuenta sale como texto basura: `'function toString() { [native code] }1'`. Con el estado `"__proto__"` es peor: la asignación no crea ninguna propiedad. Lo medí con las dos versiones. [`Object.create(null)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create) fabrica un objeto **sin nada heredado**, un diccionario limpio donde solo está lo que tú guardas, y con él `"toString"` y `"__proto__"` cuentan 1 como cualquier otro estado. Hoy los estados los escribes tú, pero desde la Lección 8 llegarán de fuera, y un dato de fuera puede traer cualquier texto. Para cada servicio, `counts[service.status] ?? 0` es el conteo que ya había de ese estado, o cero si es la primera vez que aparece; se le suma uno y se guarda. Es una variante donde el acumulador **sí** se modifica, que es lo normal en `reduce`: lo que nunca se modifica es la lista de entrada. Si en el futuro hay un tercer estado, `countsByStatus` lo cuenta sin cambiar una sola línea.

### Solución 4

(a) `Cannot read properties of undefined (reading 'name')`. Se pidió una posición que no existe y se le pidió una propiedad al `undefined` resultante. Corrección: comprobar el límite del arreglo, o `services[n]?.name`.

(b) `The requested module './services.js' does not provide an export named 'servicios'` (la ruta cambia según el archivo). El nombre del `import` no coincide con el del `export`. Corrección: escribirlo igual, carácter por carácter.

(c) `Assignment to constant variable.` Se reasignó una `const`. Corrección: si va a cambiar, declararla con `let`; si no, no reasignarla.

(d) `Cannot use import statement outside a module`. El `<script>` no declara `type="module"`. Corrección: agregarlo.

## Cómo sé que lo logré

- [ ] Al abrir `fig06_08.html` desde `http://localhost:8000/`, la consola muestra exactamente cuatro líneas: `Disponibles: 4`, `Caídos: 1`, `Respuesta promedio: 465 ms` y `{"available":4,"down":1,"averageMs":465}`, y ningún error en rojo.
- [ ] Tu `index.html` carga `js/main.js` con `<script type="module">`, se ve igual que antes, y la consola muestra las mismas cuatro líneas, que coinciden con las cifras escritas en el resumen.
- [ ] Al abrir `fig06_08.html` con doble clic (`file://`), aparece el error de CORS y sabes explicar por qué.
- [ ] `fig06_07.html` muestra `1860 372` y puedes explicar por qué 372 está mal y 465 está bien.
- [ ] Si agregas el servicio de correo con 210 ms, la consola muestra 5 disponibles, 1 caído y 414 ms sin que toques `stats.js`.
- [ ] Puedes escribir de memoria una función que reciba la lista de servicios y devuelva cuántos están en un estado dado, usando `filter` y `length`.
- [ ] Puedes explicar con tus palabras la diferencia entre `const` y `let`, entre `===` y `==`, entre `sort` y `toSorted`, y por qué un servicio caído tiene `responseMs: null` y no `0`.

## Resumen

Responde sin mirar la lección:

1. ¿Qué tipo de valor da `typeof` para `120`, para `"120"` y para `true`? ¿Y por qué `120 === "120"` da `false`?
2. ¿Qué diferencia hay entre `const` y `let`, y cuál usas por omisión?
3. ¿Cómo se representa un servicio, y cómo la lista de servicios? ¿Por qué el servicio caído lleva `null` y no `0`?
4. ¿Qué devuelve `filter`, qué `find`, qué `some`? ¿Cuál modifica el arreglo original, `sort` o `toSorted`?
5. ¿Qué dos cosas debe hacer una función de promedio antes de dividir?
6. En un `try…catch`, ¿qué pasa con las líneas del `try` que siguen a la que lanzó un error? ¿Y cuándo conviene un ternario en lugar de un `if`?
7. ¿Qué cifra sale al promediar los cinco servicios del panel sin filtrar el caído, y por qué no es la correcta?
8. ¿Qué hace `type="module"` en un `<script>` y por qué un módulo no carga con `file://`?

## Para leer más

- [MDN, «Guía de JavaScript»](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide) — la guía oficial de Mozilla, desde la gramática y los tipos hasta los módulos, en el mismo orden que esta lección. En inglés, como casi toda la documentación oficial. Consultado el 7 de octubre de 2026.
- [MDN, «Módulos de JavaScript»](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) — `import`, `export`, el ámbito de un módulo y el error de `file://`. Consultado el 7 de octubre de 2026.
- [MDN, «Colecciones indexadas»](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Indexed_collections) — los arreglos y sus métodos con más ejemplos. Consultado el 7 de octubre de 2026.
- [Especificación del lenguaje ECMAScript](https://tc39.es/ecma262/) — la fuente última de lo que significa cada operador; no es un texto para aprender, sino para consultar cuando una duda no se resuelve en otra parte. Consultado el 7 de octubre de 2026.
