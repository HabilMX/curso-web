# Lección 1 — Tu equipo y el ciclo de trabajo

**Tiempo:** 90 min (o 2 × 45)

**Qué construyes:** el entorno de trabajo —carpeta, editor, servidor local, herramientas del navegador y Git— y el primer `index.html` del `revisor`, abierto desde tu propio servidor.

**Qué aprendes:** editor, terminal y carpetas; servidor local desde el primer día; las herramientas del navegador; un primer registro en Git.

**Las páginas de esta lección.** Todas están en [`programas/01-entorno-ciclo-trabajo/`](https://github.com/HabilMX/curso-web/tree/main/programas/01-entorno-ciclo-trabajo) del [repositorio del curso](https://github.com/HabilMX/curso-web). Aquí las vas a escribir tú, paso a paso; la carpeta sirve para comparar tu copia con la buena cuando algo no coincida.

## Al terminar vas a poder

- Moverte por las carpetas desde la terminal (`pwd`, `ls`, `cd`, `mkdir`) y crear la carpeta del proyecto en tu directorio personal.
- Escribir un `index.html` en el editor, guardarlo y verlo en el navegador desde un servidor local que levantas con `python3 -m http.server`.
- Explicar por qué un módulo de JavaScript no carga desde `file://` y reconocer el mensaje del navegador cuando eso ocurre.
- Usar el Inspector, la Consola y la pestaña Red para ver qué recibió el navegador, qué errores hubo y qué peticiones registró tu servidor.
- Distinguir «Ver código fuente» del Inspector, y explicar por qué pueden mostrar cosas distintas.
- Guardar tu primer registro en Git y leerlo con `git status`, `git diff` y `git log --oneline`.

## El porqué antes del cómo

Vas a repetir un mismo gesto cientos de veces a lo largo del curso: cambiar una línea, guardar, ir al [navegador](https://developer.mozilla.org/en-US/docs/Glossary/Browser), recargar, mirar qué pasó. Ese ciclo —escribir, guardar, recargar, inspeccionar— es el [ritmo real](https://web.dev/learn) de quien hace páginas web, y de él depende cuánto aprendes por hora. Si cada vuelta cuesta diez segundos de fricción innecesaria, o si el resultado que ves no coincide con el que verá cualquier otra persona, el cansancio llega antes que la comprensión. Un entorno bien armado es lo que hace que te equivoques rápido y entiendas por qué.

Y hay una razón más concreta, que la [Lección 0](00-como-funciona-la-web.md) dejó planteada: una página no es lo mismo si la abres con doble clic sobre el archivo que si la sirve un servidor. El documento que abres con doble clic llega por `file://`, sin conversación HTTP, sin códigos de estado y sin un [origen](https://www.rfc-editor.org/rfc/rfc6454) utilizable: el navegador le asigna uno «opaco», que no coincide con ningún otro, y ya verás qué consecuencias tiene. El mismo documento servido por `http://localhost:8000` llega como llegará el día que lo publiques. Si desarrollas en la primera forma, vas a ver «funcionar» cosas que fallarán al publicar, y —peor— vas a ver fallar cosas de las que tu código no tiene la culpa. Por eso este curso levanta un servidor local desde el primer día: no para presumir, sino para que lo que ves en tu pantalla sea [lo que verá el mundo](https://resilientwebdesign.com/).

Lo que sí tiene un costo es la primera hora, y por eso conviene hacerla con orden. La lección tiene tres bloques. Primero **el taller**: la [terminal](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Environment_setup/Command_line), las carpetas y el editor, que son donde pasarás el tiempo. Después **el ciclo de ver**: el servidor local y las herramientas del navegador, que te dicen qué está pasando. Por último **el punto de retorno**: [Git](https://git-scm.com/docs/gittutorial), que guarda el estado de tu trabajo para que equivocarte no sea grave. Al final tendrás una carpeta `revisor` con una [primera página](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website), funcionando desde tu servidor, con un primer registro guardado.

Una nota sobre el sistema. El curso supone **[Linux Mint](https://linuxmint-installation-guide.readthedocs.io/en/latest/)**, y el 7 de octubre de 2026 la versión que ofrece su sitio como la vigente es la [22.3](https://linuxmint.com/download.php) («Zena»), en sus tres ediciones: Cinnamon, Xfce y MATE. Todo lo de esta lección es igual en las tres; lo único que cambia es el aspecto del menú. La versión 22 de Mint se construye sobre Ubuntu 24.04, y por eso trae Python 3.12 y una versión de Git de la serie 2.43; si la tuya difiere ligeramente, no importa, nada de lo que usamos es reciente.

## Los conceptos

Son tres, y los vas a usar en este orden en cada sesión de trabajo del curso.

### 1.1 El taller: terminal, carpetas y editor

#### La terminal: escribir lo que antes hacías con el mouse

La **terminal** es una ventana donde, en lugar de hacer clic, escribes órdenes. Puede parecer un paso atrás; es lo contrario. Una orden escrita se puede repetir, pegar en un mensaje, guardar en un archivo y automatizar, cosas que un clic no permite. Además, casi todo lo que vas a aprender en tu carrera de programación —servidores, Git, herramientas— se maneja desde ahí. Para abrirla en Mint, presiona `Ctrl`+`Alt`+`T`, o búscala como «Terminal» en el menú.

Lo que verás es una línea parecida a esta:

```text
ana@mint:~$ 
```

Se lee así: `ana` es tu usuario, `mint` el nombre de tu computadora, `:` separa, `~` es **dónde estás** (más abajo, qué significa) y `$` quiere decir «estoy lista para que escribas». **El `$` no se escribe nunca.** En los ejemplos de este curso, una línea que empieza con `$ ` es una orden que tú escribes (sin ese símbolo), y las líneas que le siguen son lo que la terminal responde. Cada orden termina al presionar `Enter`. (La Lección 0 ya te adelantó esta convención; aquí la ves con tu propia terminal enfrente.)

Tres [atajos](https://missing.csail.mit.edu/2020/course-shell/) que te ahorran la mitad del tecleo, desde hoy: la tecla `Tab` completa los nombres (escribe las primeras letras de una carpeta y presiona `Tab`); las flechas arriba y abajo recorren las órdenes que ya escribiste; y `Ctrl`+`C` **interrumpe** lo que esté corriendo, que usarás para detener tu servidor. Y un cuarto, `Ctrl`+`L`, que limpia la pantalla sin borrar nada.

#### Dónde estás: las carpetas y las rutas

La terminal siempre está «parada» en una carpeta, y las órdenes actúan sobre ella salvo que les digas otra cosa. Para saber en cuál estás, está [`pwd`](https://man7.org/linux/man-pages/man1/pwd.1.html) (*print working directory*, imprime el directorio de trabajo):

```bash
$ pwd
/home/ana
```

Esa es tu **carpeta personal**, o *home*: el lugar donde viven tus archivos, y el que la terminal abre por omisión. Se abrevia con el símbolo `~`, por eso en el aviso de arriba decía `~`. Fíjate en que la ruta usa las mismas barras que las URL de la Lección 0, y funciona por el mismo principio: un camino que va de la raíz hacia dentro. Y, como en las URL, hay rutas **absolutas** (empiezan en la raíz, con `/`, o en tu carpeta personal, con `~`) y rutas **relativas** (parten de donde estás, sin barra inicial). Dos nombres especiales completan el vocabulario: `.` significa «esta carpeta» y `..` significa «la carpeta de arriba».

Con cuatro órdenes ya te mueves por todo el sistema:

| Orden | Qué hace | Ejemplo |
|---|---|---|
| `pwd` | dice en qué carpeta estás | `pwd` |
| [`ls`](https://man7.org/linux/man-pages/man1/ls.1.html) | lista lo que hay en la carpeta actual | `ls` · `ls -a` muestra también lo oculto |
| `cd` | cambia de carpeta | `cd Documentos` · `cd ..` sube un nivel · `cd` solo, vuelve a tu casa |
| [`mkdir`](https://man7.org/linux/man-pages/man1/mkdir.1.html) | crea una carpeta | `mkdir revisor` |

Un archivo o una carpeta cuyo nombre empieza con punto (`.git`, `.gitignore`) está **oculto**: `ls` no lo muestra a menos que le pidas `ls -a`. Los administradores de archivos gráficos también los esconden; en el de Mint ([Nemo](https://linuxmint-user-guide.readthedocs.io/en/latest/)) se muestran u ocultan con `Ctrl`+`H`. Lo vas a necesitar para ver la carpeta de Git.

Linux distingue mayúsculas de minúsculas: `Revisor` y `revisor` son carpetas distintas. Recuerda la regla que nació en la Lección 0: **minúsculas, sin espacios y sin acentos** en todo lo que creas. Si algún día necesitas un espacio, la terminal te obligará a escribir comillas o barras, y es un buen aviso de que ese nombre va a dar problemas.

Crea ya la carpeta del proyecto y entra en ella:

```bash
$ cd ~
$ mkdir revisor
$ cd revisor
$ pwd
/home/ana/revisor
$ ls
```

El último `ls` no imprime nada, porque la carpeta está vacía, y eso es lo correcto. Si en vez de eso la terminal te responde `mkdir: no se puede crear el directorio «revisor»: El archivo ya existe`, ya habías creado una con ese nombre; entra con `cd revisor` y sigue. (A propósito, no existe en este curso ninguna orden que borre cosas: cuando algo se borra desde la terminal, no hay papelera, y empezar por ahí es una mala idea. Si algún día quieres borrar, hazlo desde el administrador de archivos, que sí tiene papelera.)

#### El editor

Una página web es un archivo de **texto plano**: letras, números y símbolos, sin formato. Eso quiere decir que **no se escribe en un procesador de textos** (como LibreOffice Writer), que guarda además tipografías, márgenes y estilos que el navegador no entiende. Se escribe en un **editor de código**, que guarda solo el texto y, además, te ayuda: colorea según el lenguaje, sangra solo, avisa de paréntesis sin cerrar.

Linux Mint trae uno sencillo, **Xed**, que sirve. En este curso usaremos **Visual Studio Code** (VS Code), un editor gratuito de uso muy extendido, porque muestra el árbol de carpetas del proyecto, trae una terminal integrada y se usa igual en cualquier sistema, de modo que lo que aprendas aquí lo reutilizas donde sea. Si prefieres otro editor, funcionará: lo único que el curso exige es que guarde texto plano, en [UTF-8](https://www.rfc-editor.org/rfc/rfc3629) y con saltos de línea de Linux.

Para instalar VS Code en Mint, la [documentación oficial del editor](https://code.visualstudio.com/docs/setup/linux) indica descargar el paquete `.deb` desde su sitio, en la sección de descargas para Linux (elige la opción `.deb` de 64 bits), y luego instalarlo desde la terminal. Si lo bajaste con Firefox, el archivo quedó en tu carpeta de descargas (en español, `~/Descargas`):

```bash
$ cd ~/Descargas
$ sudo apt install ./code_*.deb
```

Dos cosas nuevas en esa línea. `apt` es el **[gestor de paquetes](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Environment_setup/Installing_software)** de Mint: el programa que instala, actualiza y quita software, resolviendo solo las dependencias. Y `sudo` es la palabra que significa «hazlo con permisos de administrador»: instalar programas para todo el sistema los requiere, y por eso `sudo` te pide **tu contraseña**. Cuando la escribas no verás nada en pantalla, ni asteriscos: no es que no funcione, es una medida para que nadie la lea por encima del hombro. Escríbela completa y presiona `Enter`. Una regla de higiene que conviene tener desde el primer día: **no pegues en la terminal un comando con `sudo` que no entiendas**; con él, la máquina hace lo que le dices sin preguntar si estás seguro. (Ese paquete, de paso, configura un repositorio para que el editor se actualice con el resto del sistema, como describe la propia documentación de VS Code.)

Con el editor instalado, ábrelo **sobre la carpeta del proyecto**, no sobre un archivo suelto. Desde la terminal, ya dentro de `~/revisor`, escribe:

```bash
$ code .
```

El punto es la carpeta actual: acabas de abrir el editor «parado» en `revisor`. A la izquierda verás el explorador de archivos con la carpeta (vacía), y en la barra de abajo, información del archivo. Al abrirla por primera vez, VS Code te preguntará si confías en los autores de la carpeta: es una carpeta tuya, di que sí. Después, activa el [guardado automático](https://code.visualstudio.com/docs/editor/codebasics) para que no tengas que acordarte de guardar: en el menú **Archivo**, marca **Autoguardado**. Verás que sigue siendo útil presionar `Ctrl`+`S` por costumbre; el autoguardado es una red de seguridad, no un sustituto. Si tu editor te ofrece completar bloques enteros de código por ti, desactívalo mientras aprendes: escribir cada línea con tus manos [forma parte de aprender](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Soft_skills).

Dentro del editor, con la combinación `Ctrl` más la tecla de comilla invertida abres una terminal integrada que ya está parada en la carpeta del proyecto. Es la comodidad que más se usa, y la que vas a necesitar cuando el servidor ocupe una terminal y quieras otra: con el botón `+` de ese panel abres una segunda.

### 1.2 El ciclo de ver: servidor local y herramientas del navegador

#### La primera página

Crea el primer archivo del proyecto: en el explorador de VS Code, con el botón de «Nuevo archivo» (o `Ctrl`+`N` y luego guardar), llámalo `index.html`. Escribe esto:

```html
<!-- fig01_01.html -->
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
    <p>Aquí vivirá el estado de tus servicios.</p>
  </main>
</body>
</html>
```

```text
Revisor de servicios
Aquí vivirá el estado de tus servicios.
```

(La primera línea, el comentario `<!-- fig01_01.html -->`, es la forma en que el repositorio del curso identifica este ejemplo; puedes copiarla o no, es un comentario que el navegador no muestra. El segundo bloque es lo que verás en la ventana.)

No te pido que entiendas cada [etiqueta](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Basic_HTML_syntax) hoy; la Lección 2 está dedicada a eso. Para que el archivo no sea un texto opaco, esto es lo mínimo: `<!DOCTYPE html>` le dice al navegador que lea la página con las reglas modernas; `lang="es"` declara el idioma, que importa a los lectores de pantalla; `<meta charset="utf-8">` declara la codificación (es lo que hace que «á» y «ñ» se vean bien; debe estar cerca del principio); la etiqueta con `viewport` hace que la página se adapte al ancho de un teléfono, y la usaremos mucho en la Lección 5; `<title>` es el texto de la pestaña. Todo lo que está dentro de `<body>` es lo que se ve en la ventana: un encabezado (`<h1>`) y un párrafo (`<p>`) dentro de la región principal (`<main>`).

Guarda con `Ctrl`+`S`. Hay dos formas de verlo en el navegador. La primera es la que todo el mundo intenta: doble clic sobre el archivo en el administrador de archivos. Pruébala. Funciona, y en la barra de direcciones verás algo como `file:///home/ana/revisor/index.html`. Fíjate en el esquema: `file`, no `http`. Aquí no hay servidor ni conversación; el navegador leyó el archivo del disco, tal cual.

Para una página de un solo archivo, eso basta. Para un proyecto con más de un archivo que se cargan entre sí, ya no. Veamos por qué con una prueba pequeña, hecha a propósito.

#### Un módulo que no carga

Más adelante en el curso vas a dividir el JavaScript del panel en archivos pequeños que se importan unos a otros. Eso se llama **[módulos](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)**, y se cargan con [`<script type="module">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script). Mira cómo se ve con un ejemplo mínimo: una página y un archivo de JavaScript que cambia su texto. (No necesitas entender el JavaScript todavía —viene en la Lección 6—; basta con saber que esa única línea busca el párrafo cuyo identificador es `status` y le cambia el texto.)

Reemplaza el contenido de `index.html` con esta versión y crea al lado, en la misma carpeta, un archivo `main.js` con el programa. Fíjate en el atributo `src="main.js"`: es una URL relativa (Lección 0) que significa «el archivo `main.js` que está junto a esta página».

```html
<!-- fig01_02.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Revisor de servicios</title>
  <script type="module" src="main.js"></script>
</head>
<body>
  <main>
    <h1>Revisor de servicios</h1>
    <p id="status">Esperando al módulo.</p>
  </main>
</body>
</html>
```

```js
// main.js
document.querySelector("#status").textContent = "El módulo cargó.";
```

```text
Revisor de servicios
El módulo cargó.
```

(En el repositorio del curso esta página se llama `fig01_02.html` y su programa `main.js`, uno junto al otro; en **tu** carpeta la página se llama `index.html`. Los dos bloques se copian tal cual. El tercer bloque es lo que debes ver cuando todo funciona.)

Ahora ábrela con doble clic, como antes. Verás el texto «Esperando al módulo.» y **no** «El módulo cargó.»: el programa no se ejecutó. Y nadie te avisó en la ventana. Esto es un fallo silencioso de los más desconcertantes, y se explica en la sección «El error que vas a ver»: el aviso está en la [Consola](https://firefox-source-docs.mozilla.org/devtools-user/web_console/index.html) del navegador, que aprenderás a abrir en unos minutos.

La razón de fondo la dejó planteada la Lección 0. Los módulos se descargan con una petición que el navegador hace «en modo de origen cruzado» (el mecanismo que se llama [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)), es decir, sujeta a la [política del mismo origen](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy). Una página abierta desde `file://` tiene un [origen opaco](https://url.spec.whatwg.org/#concept-url-origin), y el navegador no le permite hacer esa descarga. La solución no es un truco en el código: es entregar el proyecto por HTTP, como lo hará el mundo real.

#### El servidor local: `python3 -m http.server`

Hace falta un [servidor web](https://developer.mozilla.org/en-US/docs/Glossary/Server), y no uno pesado: uno mínimo que lea archivos de la carpeta y los entregue por HTTP. Tu computadora ya trae uno, incluido en Python. Ya estás en la carpeta del proyecto; desde la terminal, escribe:

```bash
$ python3 -m http.server 8000 --bind 127.0.0.1
Serving HTTP on 127.0.0.1 port 8000 (http://127.0.0.1:8000/) ...
```

Desmenuza cada pieza de esa línea, porque cada una responde algo de la Lección 0:

- `python3 -m http.server` ejecuta (`-m`, «módulo») el servidor web que viene en la biblioteca estándar de Python. No hay que instalar nada; es lo único de Python que este curso usa.
- `8000` es el **puerto**: la «puerta» en que escucha. Es un número arbitrario mayor que 1024; el 8000 es una costumbre. Si tu carpeta usa otro, lo escribes igual en la URL.
- `--bind 127.0.0.1` limita el servidor a **tu propia máquina**. Es una precaución que importa: por omisión, este servidor escucha en *todas* las interfaces de red, y la documentación de Python advierte que no está pensado para producción. Con `--bind 127.0.0.1` solo te escuchas a ti mismo.
- La línea que imprime dice en qué dirección sirve la carpeta actual.

La terminal quedó «ocupada»: no te devuelve el aviso `$`, porque el servidor sigue corriendo y escribiendo ahí lo que ocurra. Déjala así y abre otra (en VS Code, el botón `+` del panel de terminal; o una ventana nueva). Para detenerlo, algún día, vuelves a esa terminal y presionas `Ctrl`+`C`.

Ahora abre el navegador y escribe `http://localhost:8000/` (`localhost` es un nombre [reservado para tu propia máquina](https://www.rfc-editor.org/rfc/rfc6761)). Como viste en la Lección 0, ese nombre corresponde a dos direcciones, `127.0.0.1` y la de IPv6, `::1`; el servidor solo escucha en la primera, y el navegador, si no le contestan en una, prueba la otra (lo comprobé con Chrome, Firefox y `curl`). Si algún día `localhost` no te abre la página, escribe la dirección que imprimió el servidor, `http://127.0.0.1:8000/`. La página que ves es la misma, pero ahora el texto dice **«El módulo cargó.»**: el programa se ejecutó. La diferencia es exactamente el esquema: antes `file://`, ahora `http://`.

Mira lo que escribió la terminal del servidor mientras tanto, que es la conversación de la Lección 0 en versión resumida:

```text
127.0.0.1 - - [07/Oct/2026 10:55:10] "GET / HTTP/1.1" 200 -
127.0.0.1 - - [07/Oct/2026 10:55:10] "GET /main.js HTTP/1.1" 200 -
127.0.0.1 - - [07/Oct/2026 10:55:10] code 404, message File not found
127.0.0.1 - - [07/Oct/2026 10:55:10] "GET /favicon.ico HTTP/1.1" 404 -
```

Cada línea es una petición que llegó. Se lee: quién la hizo (`127.0.0.1`, tú), cuándo, la línea de petición entre comillas (método, ruta y versión) y el código de estado. Tres cosas para notar. **Una:** un solo acceso a la página produjo **tres** peticiones, no una: el HTML, el programa que el HTML pide, y algo que tú no pediste. Es el mecanismo de la Lección 0, a pequeña escala. **Dos:** el HTML se pidió con `GET /`, la ruta que escribiste, que es una carpeta y no un archivo; el servidor contestó con el `index.html` de esa carpeta, la convención que viste en la Lección 0. El registro anota lo que se pidió, no el archivo que se entregó. **Tres:** el [`404`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/404) de `/favicon.ico` no es un error tuyo. El **[favicon](https://html.spec.whatwg.org/multipage/)** es el pequeño icono de la pestaña; los navegadores lo piden por su cuenta, en esa ruta, sin que lo digas en ninguna parte. Como no hay ninguno, el servidor responde «no encontrado». Es inofensivo y te enseña algo importante: *el navegador hace peticiones que tu página no pidió.* En el Ejercicio 2 lo silenciarás.

Puedes ver también lo que el servidor contesta *a nivel de encabezados*, con [`curl`](https://curl.se/docs/manpage.html) (instálalo, si no lo tienes, con `sudo apt install curl`; su [tutorial oficial](https://curl.se/docs/tutorial.html) enseña el resto de sus opciones):

```bash
$ curl -i http://127.0.0.1:8000/main.js
HTTP/1.0 200 OK
Server: SimpleHTTP/0.6 Python/3.12.12
Date: Wed, 07 Oct 2026 19:17:38 GMT
Content-type: text/javascript
Content-Length: 81
Last-Modified: Wed, 07 Oct 2026 19:17:38 GMT

// main.js
document.querySelector("#status").textContent = "El módulo cargó.";
```

(Esta salida la medí en otra computadora, con Python 3.12.12; en Linux Mint 22 la línea `Server` dirá la versión que trae el sistema, `Python/3.12.3` al momento de escribir. Las fechas serán otras, y `Content-Length` solo coincidirá si copiaste el archivo tal cual, con su comentario.) Reconoces todo: la línea de estado con [`HTTP/1.0`](https://www.rfc-editor.org/rfc/rfc1945) —este servidor de práctica usa esa versión por omisión—, el [`Content-type`](https://developer.mozilla.org/en-US/docs/Glossary/MIME_type) calculado por la extensión del archivo (`.js` → `text/javascript`; MDN documenta el encabezado completo en [`Content-Type`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Type)), el tamaño del cuerpo, la fecha de modificación. Es tu propio servidor, hablando el idioma de la Lección 0.

Dos observaciones sobre el uso diario. Si olvidas en qué carpeta lo arrancaste, recuerda que **el servidor publica la carpeta desde la que lo ejecutas**: arrancarlo en tu carpeta personal publicaría, para quien pueda alcanzar el servidor, todo lo que hay ahí (por eso `--bind 127.0.0.1` y por eso siempre `cd revisor` primero). Y si cambias un archivo y recargas, el servidor entrega la versión nueva sin reiniciarse; no hay que detenerlo cada vez, solo cuando cambias de proyecto.

#### Las herramientas del navegador

Tu navegador tiene un taller incorporado para ver por dentro lo que se cargó: las **[herramientas del desarrollador](https://developer.chrome.com/docs/devtools/overview)**. Se abren con `F12` (o `Ctrl`+`Shift`+`I`) y se dividen en pestañas. Usaremos Firefox, que viene con Mint; en los navegadores basados en Chromium hay las mismas con nombres casi idénticos. Para esta lección, tres pestañas bastan:

**[Inspector](https://firefox-source-docs.mozilla.org/devtools-user/page_inspector/index.html).** Muestra el documento como el navegador lo entiende: un árbol de elementos. Haz clic derecho en el párrafo de la página y elige **Inspeccionar**: se abre el Inspector, con el elemento resaltado. Puedes expandir y contraer el árbol, y hasta editar un texto con doble clic para ver el efecto (solo dura hasta recargar: es un experimento, no cambia tu archivo). Verás aquí «El módulo cargó.».

Y aquí está una de las ideas más valiosas de la lección. Con la página abierta, presiona `Ctrl`+`U`, que abre **Ver código fuente**. Ahí verás el HTML tal como llegó del servidor, con «Esperando al módulo.» en el párrafo. **El código fuente es lo que el servidor envió; el Inspector es lo que el navegador tiene ahora, después de ejecutar el JavaScript.** Pueden ser distintos, y en el panel lo serán casi siempre, porque el JavaScript lo dibujará. Cuando algo «no aparece» en pantalla, mirar ambos te dice si el servidor no lo envió o si tu programa no lo dibujó. Sin esa distinción, es fácil perder una tarde.

**Consola.** Es donde el navegador escribe sus avisos y los errores de tu JavaScript, cada uno con el archivo y la línea que lo causó. Ábrela y déjala visible mientras trabajes. Una regla que adoptaremos como criterio de salida del curso: **la Consola debe estar vacía** (ni errores ni avisos). Con la página servida, la tuya lo estará, con una excepción que conviene conocer: Chrome anota en la Consola el `404` del `favicon.ico` del que hablamos arriba (lo medí; en otros navegadores puede no aparecer), y desaparece en cuanto hagas el Ejercicio 2. Con la página abierta por `file://`, tendrá el error del módulo que vimos arriba.

**[Red](https://firefox-source-docs.mozilla.org/devtools-user/network_monitor/index.html).** La conocías de la Lección 0. Ahora, con tu servidor, es mucho más reveladora: abre la pestaña, recarga con `F5` y verás tres filas: el documento, el `main.js` y el `favicon.ico`, con sus estados `200`, `200` y `404`. Son las mismas tres líneas que escribió tu servidor, vistas desde el otro lado. Haz clic en la de `main.js` y mira los encabezados: el `Content-type: text/javascript` de arriba, con su servidor. Ahí mismo marca **Desactivar [caché](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/304)** (una casilla en la barra de la pestaña o en su menú de ajustes, según tu versión): mientras las herramientas estén abiertas, el navegador no reutilizará copias viejas. Resuelve el problema de «editó y no se ve el cambio» antes de que aparezca. Con las herramientas cerradas, la [caché](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching) vuelve a actuar; si dudas, `Ctrl`+`Shift`+`R` fuerza una recarga que la ignora.

Ya está completo el ciclo. Cada vez que cambies algo, la rutina es siempre la misma: **editas, guardas, recargas, miras la Consola y la [pestaña Red](https://developer.chrome.com/docs/devtools/network).** Si algo no aparece, lo primero que se mira es la Consola.

### 1.3 El punto de retorno: Git

#### Qué problema resuelve

Tarde o temprano, cambiarás algo que funcionaba y dejará de funcionar, y no recordarás exactamente qué tocaste. Sin un registro, la salida es deshacer a mano lo que crees que cambiaste. **Git** es un sistema de **[control de versiones](https://git-scm.com/book/es/v2/Inicio---Sobre-el-Control-de-Versiones-Fundamentos-de-Git)**: un programa que guarda, a tu orden, fotografías del estado de tu carpeta, cada una con un mensaje que dice qué cambió y por qué. Con ellas puedes ver qué se modificó, comparar con cualquier punto anterior y volver atrás. Es la herramienta más usada del mundo para esto, y la verás en cualquier equipo; el curso *Missing Semester* del MIT le dedica [una clase entera](https://missing.csail.mit.edu/2020/version-control/), si quieres entender cómo guarda la historia por dentro.

No lo confundas con GitHub o GitLab: Git funciona **solo en tu máquina**, sin internet. Los servicios como GitHub son lugares donde puedes *compartir* un repositorio de Git; aquí no los necesitamos todavía. Para esta lección, Git es tu historial personal.

Hay un modelo mental que lo hace entendible, y son tres zonas. Tus archivos viven en la **carpeta de trabajo**, donde los editas. Cuando algo está listo para guardarse, lo pasas al **[área de preparación](https://git-scm.com/book/es/v2/Fundamentos-de-Git-Guardando-cambios-en-el-Repositorio)** (*stage*): una sala de espera donde decides exactamente qué entrará en la próxima fotografía. Y la fotografía misma, que se llama **commit** (confirmación), queda guardada en el **repositorio**. Tres pasos, tres órdenes: `git add` mueve a la sala de espera, [`git commit`](https://git-scm.com/docs/git-commit) toma la fotografía.

#### Preparar Git, una vez

Primero, dile quién eres: cada commit lleva un autor. Se hace una sola vez en tu cuenta de la computadora, con tus datos reales (el correo es solo una etiqueta; no se envía a ningún lado):

```bash
$ git config --global user.name "Ana Pérez"
$ git config --global user.email "ana@example.com"
```

Si Git no está instalado (`git --version` te lo dice), se instala con `sudo apt install git`.

#### El primer registro

En la carpeta del proyecto, crea el repositorio con [`git init`](https://git-scm.com/docs/git-init). La opción `-b main` le pone `main` como nombre a la rama principal, que es la costumbre actual:

```bash
$ git init -b main
Inicializado repositorio Git vacío en /home/ana/revisor/.git/
```

Git creó una carpeta oculta, `.git`, que es donde vive todo el historial. No la toques a mano; si la borras, pierdes el historial. Pregúntale cómo ve el proyecto:

```bash
$ git status
En la rama main

No hay commits todavía

Archivos sin seguimiento:
  (usa "git add <archivo>..." para incluirlo a lo que será confirmado)
	index.html
	main.js

no hay nada agregado al commit pero hay archivos sin seguimiento presentes (usa "git add" para hacerles seguimiento)
```

[`git status`](https://git-scm.com/docs/git-status) es la orden que más vas a ejecutar: dice dónde está cada cosa. Aquí te informa que `index.html` y `main.js` están **sin seguimiento**: existen en la carpeta de trabajo, pero Git todavía no los conoce. Pásalos los dos a la sala de espera (`git add` acepta varios nombres) y vuelve a preguntar:

```bash
$ git add index.html main.js
$ git status
En la rama main

No hay commits todavía

Cambios a ser confirmados:
  (usa "git rm --cached <archivo>..." para sacar del área de stage)
	nuevos archivos: index.html
	nuevos archivos: main.js

```

Ahora los dos figuran bajo «Cambios a ser confirmados»: está en la sala de espera. Toma la fotografía con un mensaje:

```bash
$ git commit -m "Primer index.html del revisor"
[main (commit-raíz) ff110e5] Primer index.html del revisor
 2 files changed, 18 insertions(+)
 create mode 100644 index.html
 create mode 100644 main.js
```

Lo que dice: se guardó un commit en la rama `main`, identificado por el código `ff110e5` (los primeros caracteres de su huella; la tuya será otra), con dos archivos que cambiaron y las líneas que se añadieron (el número depende de cuántas líneas tengan tus archivos). Esa línea de resumen sale en inglés aunque tu sistema esté en español: Git no la traduce. Para verlo en la lista del historial:

```bash
$ git log --oneline
ff110e5 Primer index.html del revisor
```

Un commit por línea, el más reciente arriba. Ya tienes tu primer punto de retorno.

#### El ciclo con Git

El patrón es siempre el mismo y es corto: **cambias, miras qué cambió, preparas, guardas.** Edita el `index.html` (por ejemplo, cambia el texto del párrafo) y pregunta qué se modificó con [`git diff`](https://git-scm.com/docs/git-diff), que muestra línea por línea lo que cambió respecto del último commit (las líneas con `-` se quitaron; las líneas con `+` se agregaron):

```bash
$ git diff
diff --git a/index.html b/index.html
index 05c31c2..9de2d09 100644
--- a/index.html
+++ b/index.html
@@ -10,7 +10,7 @@
 <body>
   <main>
     <h1>Revisor de servicios</h1>
-    <p id="status">Esperando al módulo.</p>
+    <p id="status">Cargando el módulo.</p>
   </main>
 </body>
 </html>
```

(En este ejemplo se cambió el texto del párrafo: la línea con `-` es la de antes y la de `+`, la de ahora; Git muestra además tres renglones de contexto arriba y abajo. Los números de la línea `index` dependen del contenido exacto de tu archivo, así que los tuyos pueden ser otros.) Verlo antes de guardar es la mejor costumbre de Git: atrapa errores, como un cambio que no pretendías. Luego, `git add` y `git commit` de nuevo.

Algunas reglas de uso que ahorran dolores de cabeza. **Los mensajes dicen qué y por qué**, en una frase corta: «Agrega la tabla de servicios» sirve; «cambios» y «asdf» no sirven, porque dentro de un mes no te dirán nada. **Un commit por idea**: no mezcles en el mismo un arreglo y una función nueva. Y la costumbre del curso: **al terminar cada lección, un commit** con el estado en que quedó el panel. Así, si la Lección 8 te destroza algo, la 7 sigue intacta y recuperable. Una última nota: Git no sigue las carpetas vacías, solo archivos; por eso `css/`, `js/` o `data/` no aparecerán en `git status` hasta que tengan algo dentro.

## El error que vas a ver

Hay tres errores casi inevitables en esta lección. Reprodúcelos a propósito: verlos aquí, con la causa a la mano, es mucho más barato que toparte con ellos solo.

### El módulo bloqueado por CORS

Abre `index.html` (la versión del módulo, `fig01_02`) con doble clic, para que la barra diga `file:///…`. Abre la Consola con `F12`. En Chrome, el mensaje que se midió el 7 de octubre de 2026 (con la ruta adaptada a Linux, el resto textual) es:

```text
Access to script at 'file:///home/ana/revisor/main.js' from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: chrome, chrome-experimental-site-token-provider, chrome-extension, chrome-untrusted, data, http, https, isolated-app.
```

En Firefox, el mensaje tiene otra redacción y menciona un motivo que la documentación de Mozilla describe así: **«[Reason: CORS request not HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS/Errors/CORSRequestNotHttp)»**, es decir, que la solicitud de origen cruzado no es HTTP; en un Firefox en español, esa parte aparecerá traducida. Aunque cambia la redacción, la información es la misma.

**Qué significa:** la página tiene `origin 'null'` —el [origen opaco](https://html.spec.whatwg.org/multipage/browsers.html#concept-origin-opaque) de los archivos locales—, y pidió un módulo; una petición de ese tipo solo puede hacerse sobre HTTP o [HTTPS](https://developer.mozilla.org/en-US/docs/Glossary/HTTPS), y la tuya estaba en `file://`. Por eso el programa no se ejecutó. **Cómo se arregla:** sirviendo la carpeta con `python3 -m http.server`, como hiciste. No hay nada que reparar en el código.

### Address already in use

Si arrancas el servidor y ya había uno en esa puerta —porque lo dejaste corriendo en otra terminal—, Python responde con un error largo cuya última línea es la que importa. En Linux es:

```text
OSError: [Errno 98] Address already in use
```

(En otros sistemas el número cambia; la frase es la misma. El 98 es el valor de [`EADDRINUSE`](https://man7.org/linux/man-pages/man3/errno.3.html), «dirección en uso», en Linux.) **Qué significa:** otro programa ya escucha en el puerto 8000; solo uno puede hacerlo a la vez. **Cómo se arregla:** si es tu propio servidor olvidado, ve a su terminal y detenlo con `Ctrl`+`C`; o usa otra puerta: `python3 -m http.server 8001 --bind 127.0.0.1` (y entonces la URL es `http://localhost:8001`).

### La identidad de Git

Si olvidas el paso de [`git config`](https://git-scm.com/docs/git-config) y tu sistema no puede deducir un correo razonable, el primer `git commit` se rehúsa con un mensaje que empieza con `Identidad del autor desconocido` y termina con `fatal: no es posible auto-detectar la dirección de correo` (si tu sistema está en inglés: `Author identity unknown` y `fatal: unable to auto-detect email address`). En ocasiones Git sí deduce un nombre y un correo con base en tu usuario y el nombre de la máquina, y hace el commit mostrándote un aviso de que revises que sean correctos. **Qué significa:** Git se niega a guardar un registro sin saber a nombre de quién va. **Cómo se arregla:** corre las dos órdenes de `git config --global` de arriba (y, si el commit ya salió con la identidad automática, `git commit --amend --reset-author` la reemplaza).

## Lo que se hace mal

**Desarrollar abriendo el archivo con doble clic.** Funciona hasta el día en que dejas de ver algo que debería funcionar: módulos, `fetch`, fuentes. Costo: horas atribuyendo a tu código un fallo del origen. Corrección: siempre el servidor local, desde la primera línea.

**Arrancar el servidor en la carpeta equivocada.** Un `python3 -m http.server` lanzado en tu carpeta personal, sin `--bind`, publica todo lo que hay ahí hacia toda la red local. En una instalación nueva de Mint, el cortafuegos suele venir desactivado, así que nada lo frenaría. Costo: tus documentos expuestos en una red de cafetería. Corrección: `cd revisor` antes de arrancar, y `--bind 127.0.0.1` siempre.

**Escribir en un procesador de textos.** Un `.docx` renombrado a `.html` no es un HTML. Costo: una página llena de símbolos. Corrección: editor de código, texto plano, UTF-8.

**Poner espacios, acentos o mayúsculas en los nombres.** `Mi Página.html` se ve bien hoy y rompe mañana, en la terminal y en la URL (la Lección 0 explicó por qué). Corrección: `mi-pagina.html`.

**Recargar sin mirar la Consola.** El error está escrito, con archivo y línea, y nadie lo lee. Costo: depurar a ciegas. Corrección: la Consola abierta siempre.

**Un commit que dice «cambios».** Sirve el día que lo escribes y no sirve nunca más. Corrección: una frase que diga qué y por qué.

**Pegar comandos con `sudo` sin leerlos.** Con `sudo` la máquina obedece sin preguntar. Corrección: antes de presionar `Enter`, sabe qué hace cada palabra.

## Ejercicios

### Ejercicio 1 — La estructura del proyecto

Dentro de `~/revisor`, crea tres carpetas: `css`, `js` y `data`, con una sola orden (pista: `mkdir` acepta varios nombres). Verifica con `ls`. Después pregúntale a Git con `git status`: ¿las lista como cambios? ¿Por qué?

### Ejercicio 2 — Silenciar el favicon

Con el servidor corriendo y la pestaña Red abierta, recarga la página y anota el estado de `favicon.ico`. Añade dentro del `<head>` de la página [`<link rel="icon" href="data:,">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/link), guarda, recarga con `Ctrl`+`Shift`+`R` y vuelve a mirar. ¿Qué cambió en la pestaña Red y en el registro del servidor? Investiga qué significa un esquema [`data:`](https://url.spec.whatwg.org/) (pista: la Lección 0 enseñó las partes de una URL).

### Ejercicio 3 — Fuente contra Inspector, y un segundo commit

Sirve la versión de la página con el módulo (la de `fig01_02`). Abre «Ver código fuente» (`Ctrl`+`U`) y el Inspector. Anota qué dice el párrafo en cada uno y explica la diferencia. Luego cambia el texto del encabezado, mira el cambio con `git diff`, y guárdalo con un segundo commit. ¿Cómo se ve ahora [`git log --oneline`](https://git-scm.com/docs/git-log)?

### Ejercicio 4 — Provocar y leer un 404

Con el servidor corriendo, renombra el archivo `main.js` a `principal.js` desde el administrador de archivos (sin tocar el HTML) y recarga. Anota, en este orden: lo que ve la persona en la página, lo que dice la Consola, el estado que muestra la pestaña Red, y la línea que escribió el servidor. Después arréglalo y comprueba que la Consola quedó vacía.

## Soluciones

### Ejercicio 1 — La estructura del proyecto

```bash
$ mkdir css js data
$ ls
css  data  index.html  js  main.js
$ git status
En la rama main
nada para hacer commit, el árbol de trabajo está limpio
```

Git no las lista porque **solo sigue archivos, no carpetas**; una carpeta vacía no tiene nada que registrar. Aparecerán en `git status` en cuanto contengan un archivo. (Si ya habías cambiado `index.html` sin guardar un commit, `git status` te lo mostrará como modificado; eso es otro asunto.)

### Ejercicio 2 — Silenciar el favicon

La página queda así:

```html
<!-- fig01_03.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Revisor de servicios</title>
  <link rel="icon" href="data:,">
</head>
<body>
  <main>
    <h1>Revisor de servicios</h1>
    <p>Aquí vivirá el estado de tus servicios.</p>
  </main>
</body>
</html>
```

```text
Revisor de servicios
Aquí vivirá el estado de tus servicios.
```

Antes: una fila con `favicon.ico` y estado `404`, y en el servidor `code 404, message File not found`. Después: ya no hay petición a `favicon.ico`, porque el propio HTML declara el icono. El esquema `data:` es una URL que **lleva el contenido dentro de sí misma**, en lugar de apuntar a un lugar donde pedirlo; la que escribimos, `data:,`, contiene un contenido vacío, es decir, un icono invisible, y por eso el navegador no necesita pedir nada. (La página de ejemplo `example.com`, de la Lección 0, hace exactamente lo mismo.) Más adelante pondremos un icono de verdad.

### Ejercicio 3 — Fuente contra Inspector, y un segundo commit

«Ver código fuente» muestra `Esperando al módulo.`; el Inspector muestra `El módulo cargó.`. La diferencia es que el código fuente es lo que el servidor envió, antes de ejecutar JavaScript, y el Inspector es el estado actual del documento, después de que `main.js` cambió el texto.

```bash
$ git diff
…
-    <h1>Revisor de servicios</h1>
+    <h1>Revisor de servicios web</h1>
$ git add index.html
$ git commit -m "Aclara el titulo del revisor"
$ git log --oneline
3a91c0e Aclara el titulo del revisor
ff110e5 Primer index.html del revisor
```

Dos commits, el más reciente arriba; los códigos de la izquierda serán otros en tu máquina.

### Ejercicio 4 — Provocar y leer un 404

Lo que ve la persona: la página con «Esperando al módulo.», sin ningún aviso en la ventana. En el servidor, aparecen estas líneas (se midió el 7 de octubre de 2026):

```text
127.0.0.1 - - [07/Oct/2026 10:56:09] code 404, message File not found
127.0.0.1 - - [07/Oct/2026 10:56:09] "GET /main.js HTTP/1.1" 404 -
```

La pestaña Red muestra la fila de `main.js` con estado `404`. La Consola muestra un error al cargar el módulo; su redacción depende del navegador y suele mencionar el estado `404` o que el servidor respondió con un tipo de contenido que no es JavaScript —la página de error del servidor es HTML—, y es el encabezado `Content-Type` de la Lección 0 en acción. El arreglo es devolver el nombre al archivo (`main.js`). La lección es la misma que en la Lección 0: la página sin programa no es un misterio, es una petición secundaria que falló, y se ve en tres lugares a la vez.

## Cómo sé que lo logré

- `pwd` dentro de la carpeta del proyecto imprime `/home/<tu usuario>/revisor`.
- `python3 -m http.server 8000 --bind 127.0.0.1` imprime `Serving HTTP on 127.0.0.1 port 8000 (http://127.0.0.1:8000/) ...` y `http://localhost:8000/` muestra la página.
- Con la página servida (y el `favicon` silenciado del Ejercicio 2), la **Consola está vacía** y la pestaña Red muestra el documento con estado `200`.
- Abierta la misma página con doble clic (`file://`), la Consola sí muestra el error del módulo, y sabes explicar por qué.
- `git log --oneline` imprime al menos un commit con un mensaje que explica qué guardaste, y `git status` dice `nada para hacer commit, el árbol de trabajo está limpio`.
- Sin mirar la lección, puedes responder: ¿qué muestra «Ver código fuente» que no muestre el Inspector, y al revés?

Si todo está en orden, tu entorno ya es el de cualquier profesional de la web, y el resto del curso se hace sobre él. Anota en la [bitácora](https://github.com/HabilMX/curso-web/blob/main/es/bitacora.md) lo que te costó. En la Lección 2 escribirás el esqueleto del panel con HTML que dice lo que significa. Y si quieres ver desde ahora adónde llega el camino, el [curso de TypeScript](https://www.habil.mx/es/cursos/typescript/) de esta casa rehace este mismo panel con tipos y con React.

## Para leer más

- [Cómo manejar los archivos de un proyecto, de MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Environment_setup/Dealing_with_files) — la guía de MDN para organizar los archivos de un proyecto, un buen complemento de esta lección.
- [Documentación de `http.server`, de Python](https://docs.python.org/3/library/http.server.html) — todas las opciones del servidor que usamos, y la advertencia de seguridad sobre su uso.
- [Pro Git, el libro oficial, en español](https://git-scm.com/book/es/v2) — el capítulo «Fundamentos de Git» es el siguiente paso natural.
- [The Missing Semester of Your CS Education (MIT)](https://missing.csail.mit.edu/) — un curso gratuito sobre la terminal, el editor y el control de versiones, que explica por qué estas herramientas merecen tu tiempo.
