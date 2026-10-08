# Lección 0 — Cómo funciona la web

**Tiempo:** dos sesiones de unos 90 min. Un reparto que funciona: la primera, «El porqué antes del cómo», la dirección (0.1) y la conversación (0.2), con la terminal abierta para repetir cada `curl` y cada `dig`; la segunda, quién hace qué (0.3) con la pestaña Red, «El error que vas a ver» y los ejercicios. Es una lección de leer y mirar, pero se lee con la terminal y el navegador al lado, no de corrido.

**Qué construyes:** nada todavía; esta lección es de lectura y de mirar. Construyes el mapa mental que va a sostener las otras once.

**Qué aprendes:** URL, DNS, HTTP, petición y respuesta; qué hace el navegador y qué el servidor; la pestaña Red de las herramientas del navegador.

**Las páginas de esta lección.** La única página de ejemplo, `fig00_01.html`, está en [`programas/00-como-funciona-la-web/`](https://github.com/HabilMX/curso-web/tree/main/programas/00-como-funciona-la-web) del [repositorio del curso](https://github.com/HabilMX/curso-web). No necesitas abrirla hoy: basta con leerla aquí, y en la Lección 1 aprenderás a servirla desde tu computadora.

## Al terminar vas a poder

- Descomponer una URL en esquema, host, puerto, ruta, consulta y fragmento, y decir cuál de esas partes decide a qué máquina se llama y cuál decide qué se le pide.
- Explicar qué hace el DNS, y distinguir su trabajo del trabajo de HTTP.
- Leer una petición y una respuesta HTTP —línea inicial, encabezados, cuerpo— y decir qué significa el código de estado de la respuesta.
- Explicar por qué una sola página son muchas peticiones, y qué decide el navegador y qué decide el servidor en cada una.
- Decir qué parte de tu código corre en la máquina de quien visita la página, y qué consecuencia tiene eso para la seguridad.
- Abrir la pestaña Red de las herramientas del navegador, encontrar la petición principal de una página y leer su estado, su tipo, su tamaño y su tiempo.
- Ante un fallo, decir en cuál de tres capas ocurrió —el nombre, la conexión o la respuesta— antes de cambiar nada.

## El porqué antes del cómo

Imagina a la persona que opera los servicios de una empresa. Son las siete de la mañana, abre el panel del `revisor` —el proyecto que vas a construir a lo largo del curso— y ve una fila que dice «cargando…» y no cambia. ¿Qué pasó? Puede ser que su [conexión](https://developer.mozilla.org/en-US/docs/Glossary/TCP) a internet se cayó. Puede ser que el nombre del servidor ya no apunte a ningún lado. Puede ser que el servidor esté encendido pero que ese archivo ya no exista. Puede ser que exista, pero que el servidor tarde medio minuto en entregarlo. O puede ser que todo haya llegado bien y que tu propio código no sepa dibujarlo. Cinco causas, un solo síntoma, y la persona que mira la pantalla no puede distinguir una de otra. Tú sí vas a poder, pero solo si sabes qué ocurre entre el momento en que alguien escribe una dirección y el momento en que ve la página.

Ese es el trabajo de esta lección. No escribe una sola línea del panel, y aun así es la que más errores te va a ahorrar. La mayor parte de lo que más desconcierta a quien empieza —un `404`, un [mensaje](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages) que habla de «[CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)», una página que se ve sin estilos, un módulo que no carga, un dato que llega vacío— no son fallas del lenguaje: son malentendidos sobre esta conversación. Quien no tiene el mapa se pone a cambiar código al azar; quien lo tiene pregunta primero «¿en cuál de los pasos se rompió?» y casi siempre la respuesta está a la vista en menos de un minuto.

El mapa cabe en una frase: **el [navegador](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work) pregunta, el servidor responde, y todo lo demás es el detalle de cómo se dicen las cosas.** Es la misma idea con la que nació la web: la [propuesta que Tim Berners-Lee escribió en 1989](https://www.w3.org/History/1989/proposal.html) describía documentos enlazados que un programa le pide a otro, y el [primer sitio web](https://info.cern.ch/hypertext/WWW/TheProject.html), que el CERN conserva, todavía se puede abrir y leer. Esta lección desarrolla ese detalle en tres piezas, y cada una trae su ejemplo real, medido el 7 de octubre de 2026 contra una página pública que existe justo para eso. Primero, la dirección: qué es una [URL](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_URL) y cómo un nombre como `example.com` se convierte en una máquina concreta. Segundo, la conversación: qué se dicen exactamente el [navegador](https://web.dev/articles/howbrowserswork) y el servidor, palabra por palabra. Tercero, el reparto de tareas: qué hace cada uno, dónde vive tu código y cómo se mira todo esto con la [pestaña Red](https://firefox-source-docs.mozilla.org/devtools-user/network_monitor/index.html) del navegador.

No necesitas instalar nada para seguirla, salvo en los ejercicios, que usan el navegador y la [terminal](https://missing.csail.mit.edu/). Como la lección te muestra órdenes de terminal desde la primera sección, aquí va lo mínimo para leerlas; la [Lección 1](01-entorno-ciclo-trabajo.md) lo desarrolla con calma:

- **La terminal** es una ventana donde, en lugar de hacer clic, escribes órdenes. En Linux Mint se abre con `Ctrl`+`Alt`+`T`.
- **El signo `$` no se escribe.** En los bloques del curso, una línea que empieza con `$ ` es una orden que tú tecleas *sin* ese signo, y que terminas presionando `Enter`. Las líneas que le siguen, sin `$`, son lo que la terminal responde: no se escriben, se leen.
- **Una orden es un programa seguido de opciones.** En `curl -I https://example.com`, `curl` es el programa (uno que descarga direcciones web), `-I` es una opción («muéstrame solo los encabezados») y la URL es lo que le pides.
- **La barra vertical `|` conecta dos órdenes**: lo que imprime la primera entra a la segunda en lugar de salir a la pantalla. Verás `| head -3`, que deja pasar solo las tres primeras líneas. En el teclado latinoamericano, la `|` está en la tecla a la izquierda del `1`.
- **`/dev/null` es un archivo especial de Linux que desecha todo lo que recibe.** Cuando veas `curl … -o /dev/null`, la opción `-o` («guarda el contenido en…») manda la página a ese basurero, y en la pantalla quedan solo los avisos de la conversación, que es lo que queremos mirar.

Si una orden te responde `command not found`, ese programa no está instalado: la Lección 1 explica cómo se instala con `sudo apt install` y por qué se escribe `sudo` delante. Y si no puedes usar una terminal ahora, no te detengas: lee las salidas que se muestran, que son reales, y haz los ejercicios de terminal cuando tengas la Lección 1 terminada.

Un último aviso de método. En esta lección vas a ver mucho texto crudo: líneas que el navegador y el servidor se intercambian, tal cual. No es para memorizarlo. Es para que pierdas el miedo a que la web sea una caja negra: no lo es, es una conversación en texto que se puede leer, y una vez que la has leído una vez, ya no se te olvida que se puede.

## Los conceptos

Hay tres, y se apoyan uno en otro. Léelos en orden.

### 0.1 La dirección: URL y DNS

#### Una URL es una dirección con partes

Cuando escribes algo en la barra del navegador, o haces clic en un enlace, lo que usas es una **URL** (en inglés *Uniform Resource Locator*, localizador uniforme de recursos). Se parece a una dirección postal: no es un nombre cualquiera, tiene partes, cada parte responde una pregunta distinta, y el orden importa. Tomemos una URL inventada pero completa, de las que podría usar el `revisor`:

```text
https://example.com:8443/data/services.json?status=down&sort=name#row-3
```

Léela de izquierda a derecha y dale nombre a cada pedazo:

| Parte | En el ejemplo | Qué responde |
|---|---|---|
| **Esquema** | `https` | ¿En qué idioma hablamos? (el protocolo: HTTP, cifrado con [TLS](https://www.rfc-editor.org/rfc/rfc8446)) |
| **Host** (anfitrión) | `example.com` | ¿A qué máquina le hablo? |
| **Puerto** | `8443` | ¿A cuál de las puertas de esa máquina toco? |
| **Ruta** | `/data/services.json` | ¿Qué recurso pido? |
| **Consulta** | `?status=down&sort=name` | ¿Con qué condiciones, o con qué datos extra? |
| **Fragmento** | `#row-3` | ¿A qué parte del documento ya recibido me lleva el navegador? |

Estas partes están definidas en el estándar de las URL (el *[URL Standard](https://url.spec.whatwg.org/)* de WHATWG, la organización que mantiene [HTML](https://html.spec.whatwg.org/multipage/) y casi todo el entorno del navegador) y, más antiguo y más corto, en el [RFC 3986](https://www.rfc-editor.org/rfc/rfc3986) de la IETF. Si alguna vez necesitas saber algo exacto sobre ellas —por ejemplo, qué caracteres puede llevar una ruta— ahí está la respuesta; no tienes que memorizarlas.

Hay cuatro detalles que conviene fijar desde ahora porque cada uno te va a salvar de un tropiezo:

**El puerto casi nunca se escribe.** Una máquina puede escuchar en miles de «puertas» numeradas a la vez; cada servicio atiende en una. Por convención, la web sin cifrar usa la 80 y la [web cifrada](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts) usa la 443, y el navegador las supone cuando no escribes nada. Por eso `https://example.com` y `https://example.com:443` son lo mismo. Cuando en la Lección 1 levantes un servidor en tu computadora, usará otra puerta —la 8000— y entonces sí tendrás que escribirla: `http://localhost:8000`.

**El fragmento no viaja.** Todo lo que está a la izquierda del `#` se manda al servidor; el fragmento, no. Se queda en el navegador, que lo usa para desplazarte a la parte de la página que tiene ese identificador. Es una de las confusiones más comunes de quien empieza: «le mandé al servidor `#row-3` y no lo recibió». Es correcto que no lo recibiera, y lo vas a comprobar con tus propios ojos en la [pestaña Red](https://developer.chrome.com/docs/devtools/network).

**La ruta no es una carpeta.** `/data/services.json` *parece* un camino de carpetas y, en un servidor sencillo de archivos como el que vas a usar, de hecho coincide con uno. Pero eso es una decisión del servidor, no una ley: hay servidores donde `/users/42` no corresponde a ningún archivo y la respuesta se calcula al momento. Para el navegador, la ruta es solo un texto que le entrega al servidor para que decida qué contestar. Y una convención útil: cuando la ruta termina en `/`, la mayoría de los servidores de archivos entregan el `index.html` de esa carpeta. Por eso la dirección de una página principal puede ser simplemente `https://example.com/`.

**Mayúsculas y minúsculas no valen igual en todas partes.** El host no distingue: `Example.COM` y `example.com` son el mismo. La ruta, en cambio, sí suele distinguir. Lo que en tu computadora con Windows o con macOS funciona como `Logo.PNG`, en un servidor Linux —que es donde casi siempre vive un sitio— puede dar «no encontrado» si el archivo se llama `logo.png`. La regla del curso nace de aquí: **nombres de archivo en minúsculas, sin espacios y sin acentos.**

Hablando de espacios y acentos: una URL solo puede contener un conjunto reducido de caracteres. Los demás se escriben con **[codificación porcentual](https://developer.mozilla.org/en-US/docs/Glossary/Percent-encoding)**: el carácter se convierte en sus bytes (en [UTF-8](https://www.rfc-editor.org/rfc/rfc3629)) y cada byte se escribe como `%` más dos cifras hexadecimales. Un espacio es `%20`; la `ñ` son dos bytes, `%C3%B1`. Así, un archivo llamado `mi página.html` se pediría como `mi%20p%C3%A1gina.html`. El navegador lo hace por ti, pero el día que veas esa «sopa de porcentajes» en una barra de direcciones o en un registro del servidor, ya sabrás de qué se trata, y ya sabrás por qué es mejor no ponerle espacios ni acentos a tus archivos.

#### URL absolutas y relativas

Hasta aquí vimos una URL entera. Pero en una página casi nunca escribes la dirección completa de cada archivo. Escribes algo como `css/estilo.css`, y el navegador la completa tomando como base la dirección de la página en la que está. Eso es una **URL relativa**, y la vas a usar en todas las lecciones que siguen, así que vale la pena ver cómo se resuelve. Supón que la página actual es `http://localhost:8000/panel/index.html`:

| Lo que escribes | Cómo se lee | Resultado |
|---|---|---|
| `estilo.css` | misma carpeta que la página | `http://localhost:8000/panel/estilo.css` |
| `css/estilo.css` | una subcarpeta de la carpeta actual | `http://localhost:8000/panel/css/estilo.css` |
| `../estilo.css` | subir una carpeta | `http://localhost:8000/estilo.css` |
| `/estilo.css` | desde la raíz del sitio, sin importar dónde estés | `http://localhost:8000/estilo.css` |

La diferencia entre `css/estilo.css` (sin barra inicial) y `/css/estilo.css` (con barra inicial) es la causa de muchos «en mi máquina sí se ve». La primera depende de dónde esté la página; la segunda, no. En este curso vamos a preferir las relativas sin barra inicial para los archivos propios, porque así el proyecto se puede mover de carpeta sin romperse.

#### El DNS: el directorio que convierte nombres en direcciones

Ya sabes leer una URL. Falta [resolver](https://www.rfc-editor.org/rfc/rfc9499) un problema que quizá no habías notado: las computadoras no se encuentran por nombre. Se encuentran por **[dirección IP](https://developer.mozilla.org/en-US/docs/Glossary/IP_Address)**, que es un número. Una dirección IPv4 son cuatro números entre 0 y 255 separados por puntos (`104.20.23.154`); una IPv6 es más larga y se escribe en hexadecimal, y existe porque las direcciones IPv4 se acabaron. Un humano recuerda `example.com`; la red necesita el número. Entre los dos está el **[DNS](https://www.rfc-editor.org/rfc/rfc1034)** (*Domain Name System*, sistema de [nombres de dominio](https://www.rfc-editor.org/rfc/rfc1035)), que es, simplificando mucho, un directorio telefónico distribuido: tú le das un nombre y te devuelve una o varias direcciones.

«Distribuido» es la palabra importante. No existe un directorio central único que alguien tenga que mantener: sería un cuello de botella y un punto único de falla. El [DNS](https://developer.mozilla.org/en-US/docs/Glossary/DNS) es una jerarquía. El nombre `example.com` se lee de derecha a izquierda: el punto final (que casi siempre se omite) es la **raíz**; `com` es el dominio de nivel superior; `example` es un dominio dentro de `com`. Cada nivel lo administra alguien distinto, y cada administrador solo sabe a quién preguntarle por el nivel de abajo. Así funciona la consulta completa, que en la práctica se hace por ti:

1. Tu computadora le pregunta a su **resolvedor**: un servidor DNS que le asignó tu red (el de tu proveedor, el de tu empresa) o que tú elegiste. Si el resolvedor ya tiene la respuesta guardada, contesta de inmediato y se acabó.
2. Si no, el resolvedor pregunta a un **servidor raíz**. La raíz no sabe dónde está `example.com`, pero sabe quién administra `com`, y le dice a quién preguntar.
3. El resolvedor pregunta a los servidores de `com`. Tampoco saben la dirección final, pero sí quién administra `example.com`, y lo dicen.
4. El resolvedor pregunta a los **servidores autoritativos** de `example.com`: los que tienen la respuesta de verdad. Esos contestan con las direcciones.
5. El resolvedor se las entrega a tu computadora y las guarda un rato por si alguien se las vuelve a pedir.

Eso se puede ver. Con la herramienta `dig` (en Mint se instala con `sudo apt install bind9-dnsutils`) preguntas por los registros de tipo `A`, que son los que asocian un nombre con una dirección IPv4. Esta es la salida real que obtuve el 7 de octubre de 2026:

```bash
$ dig example.com +noall +answer
example.com.		240	IN	A	172.66.147.243
example.com.		240	IN	A	104.20.23.154
```

Cada renglón dice: el nombre, el **TTL** (*time to live*, tiempo de vida) en segundos, la clase (`IN`, de internet), el tipo de registro (`A`) y la dirección. Dos observaciones. Primera: hay dos direcciones para un solo nombre; es normal, los servicios grandes reparten la carga entre varias máquinas. Segunda: el TTL de 240 significa «puedes guardar esta respuesta cuatro minutos antes de volver a preguntar». Esa memoria es lo que hace al DNS rápido, y también es la razón por la que un cambio de dirección no se ve en todo el mundo al mismo tiempo: unos resolvedores todavía tienen la respuesta vieja guardada. Cuando en la Lección 11 publiques tu sitio, vas a recordar este párrafo.

Si preguntas por los servidores de la zona `com`, la respuesta muestra la jerarquía en acción:

```bash
$ dig +short NS com | head -3
g.gtld-servers.net.
f.gtld-servers.net.
m.gtld-servers.net.
```

(Son trece nombres, de `a.gtld-servers.net` a `m.gtld-servers.net`; en la práctica cada uno es en realidad una flota de máquinas repartidas por el mundo.) Tu computadora nunca necesita saber esto; el resolvedor sí.

Dos precisiones para no confundirte después. **El DNS no es la web:** también lo usa el correo electrónico y casi todo lo que usa internet. Hace una sola cosa —nombre a dirección— y no sabe nada de páginas. Y **`localhost` es un nombre especial**: está [reservado](https://www.iana.org/domains/reserved) para significar «esta misma computadora» y se resuelve sin salir de ella, a las direcciones de *bucle local* (*loopback*): `127.0.0.1` en IPv4 y `::1` en IPv6. El estándar que lo reserva es el [RFC 6761](https://www.rfc-editor.org/rfc/rfc6761). Que sean dos importa en un detalle de la Lección 1: si un programa escucha solo en una de ellas, el navegador que no obtiene respuesta en la otra la prueba también. Cuando tu navegador abra `http://localhost:8000`, no habrá viaje por internet: hablará con un programa que corre en tu propia máquina.

Una nota de privacidad, nada más. Por tradición las consultas DNS viajan sin cifrar, de modo que quien está en el camino puede enterarse de qué nombres consultas. Existe una variante cifrada, DNS sobre HTTPS ([RFC 8484](https://www.rfc-editor.org/rfc/rfc8484)), que algunos navegadores activan. No cambia nada de lo que aprendes aquí; solo te conviene saber que la privacidad del nombre y la privacidad de la página son dos cosas distintas.

### 0.2 La conversación: HTTP

#### Del nombre a la conexión

Con la dirección IP en la mano, el navegador abre una **conexión** con esa máquina, en la puerta indicada. Lo hace con [TCP](https://www.rfc-editor.org/rfc/rfc9293), un protocolo cuyo trabajo es que dos computadoras se pongan de acuerdo en hablar y garanticen que lo que uno envía llega completo y en orden. Empieza con un breve intercambio de tres mensajes (el «saludo de tres vías») y a partir de ahí hay un canal abierto.

Si el esquema es `https`, antes de decir nada interesante se hace un segundo saludo, esta vez para cifrar el canal: el navegador y el servidor negocian una clave secreta y el servidor presenta su **credencial TLS**: un documento digital, firmado por una autoridad en la que tu navegador confía, que demuestra que es de verdad el dueño del nombre que dice ser. Esa es la parte «S» de HTTPS (seguro), y la hace un protocolo llamado [TLS](https://developer.mozilla.org/en-US/docs/Web/Security/Transport_Layer_Security). Puedes verla en la salida de `curl -v`, una herramienta que descarga una URL y cuenta lo que hace:

```bash
$ curl -v https://example.com -o /dev/null
* Host example.com:443 was resolved.
* IPv4: 104.20.23.154, 172.66.147.243
*   Trying 104.20.23.154:443...
* Connected to example.com (104.20.23.154) port 443
* SSL connection using TLSv1.3 / AEAD-CHACHA20-POLY1305-SHA256
* Server certificate:
*  subject: CN=example.com
*  SSL certificate verify ok.
```

Cada línea cuenta un paso que acabas de aprender: el nombre se resolvió (DNS), se probó la primera dirección (conexión), se negoció TLS 1.3 (cifrado) y la credencial del servidor se comprobó (`verify ok`). (Recorté la salida para que quepa; la completa trae también las líneas del saludo y de la petición. La medí con `curl` 8.7.1 en macOS; el `curl` de Linux Mint 22, el 8.5.0, usa otra biblioteca de cifrado, así que algunas líneas —sobre todo la que nombra el algoritmo después de `TLSv1.3`— se redactan distinto. Los pasos son los mismos.) Todo esto ocurrió *antes* de que se pidiera la página.

Conviene fijar qué te da y qué no te da el candado de HTTPS. **Te da** tres cosas: confidencialidad (quien está en el camino no puede leer lo que pides ni lo que recibes), integridad (nadie puede modificarlo sin que se note) y autenticidad (estás hablando con el titular del nombre que se comprobó). **No te da** ninguna garantía sobre las intenciones de ese titular: una página de engaño puede tener candado perfectamente válido. Y tampoco oculta *con quién* hablas: quien está en el camino puede saber que te conectaste a `example.com`, aunque no qué página pediste ni qué recibiste.

#### La petición y la respuesta

Con el canal abierto empieza HTTP (*HyperText Transfer Protocol*, protocolo de transferencia de hipertexto), que es un esquema de pregunta y respuesta: **el cliente envía una petición, el servidor devuelve una respuesta, y ahí termina el intercambio.** El servidor nunca empieza una conversación por su cuenta; solo contesta. Esa asimetría es la columna vertebral de la web.

Lo asombroso es lo simple que es. En su versión 1.1, la petición es texto que puedes leer. Esta es la que [`curl`](https://curl.se/docs/manpage.html) mandó a `example.com`, forzando esa versión con `--http1.1` para poder verla en claro:

```http
GET / HTTP/1.1
Host: example.com
User-Agent: curl/8.7.1
Accept: */*

```

Y esta es la respuesta, también medida el 7 de octubre de 2026 (la parte de los [encabezados](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers); el cuerpo lo vemos enseguida):

```http
HTTP/1.1 200 OK
Date: Wed, 07 Oct 2026 16:53:12 GMT
Content-Type: text/html; charset=utf-8
Transfer-Encoding: chunked
Connection: keep-alive
Server: cloudflare
last-modified: Fri, 02 Oct 2026 16:11:02 GMT
allow: GET, HEAD
Accept-Ranges: bytes
Age: 2482
cf-cache-status: HIT
CF-RAY: a46e6bb0cd40cb67-DFW
alt-svc: h3=":443"; ma=86400

```

Los dos mensajes tienen la misma forma de tres partes, que es la forma de todo mensaje en HTTP/1.1 (las versiones más nuevas, que verás enseguida, llevan las mismas partes empacadas de otra manera):

1. **La línea inicial.** En la petición se llama *línea de petición* y lleva tres palabras: el **método** ([`GET`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods), «dame»), el **objetivo** (`/`, la ruta que viste en la URL) y la **versión** del protocolo. En la respuesta se llama *línea de estado* y lleva la versión, el **[código de estado](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status)** (`200`) y una frase corta (`OK`) que es solo para que la lea un humano.
2. **Los encabezados.** Renglones de la forma `Nombre: valor`, uno por línea. Son metadatos: información *sobre* la petición o la respuesta, no el contenido en sí.
3. **Una línea en blanco** y, después, **el cuerpo**: el contenido (en una petición `GET` casi siempre no hay; en la respuesta, aquí, es el HTML de la página).

Esa línea en blanco es la que separa los encabezados del cuerpo. Un detalle técnico que explica por qué la petición de arriba termina con una línea vacía.

Ahora los encabezados que aparecieron, para que no sean un texto opaco. De la petición: [`Host`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Host) dice a qué nombre se dirige la petición. Parece redundante —ya nos conectamos a la dirección— pero una sola máquina puede servir cientos de sitios, y es `Host` lo que le dice cuál de ellos quieres. `User-Agent` se presenta (aquí, [`curl`](https://curl.se/docs/tutorial.html), con la versión de la máquina donde medí; el tuyo dirá la suya; tu navegador pone una cadena larga con su nombre y su versión). `Accept` dice qué tipos de contenido se aceptan (`*/*`: cualquiera). De la respuesta: `Date` es la hora del servidor. [`Content-Type`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Type) es **el más importante para ti**, y lo vamos a retomar abajo. `Server` identifica el programa que contestó. `last-modified` es cuándo cambió por última vez el recurso. `allow` lista los [métodos](https://www.iana.org/assignments/http-methods/http-methods.xhtml) que acepta ese recurso. `Age` dice cuántos segundos lleva guardada esa copia en una [caché](https://www.rfc-editor.org/rfc/rfc9111) intermedia, y `alt-svc` avisa que el mismo servidor también habla HTTP/3. El resto (`Transfer-Encoding`, `Connection`, `Accept-Ranges`) son detalles de cómo se transmite y no los necesitas todavía. Verás también encabezados con prefijos del proveedor, como `cf-cache-status`: son extras que añade la infraestructura de quien sirve la página, no parte del protocolo.

Y el cuerpo de esa respuesta es, simplemente, un archivo HTML:

```html
<!-- fig00_01.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Página de ejemplo</title>
</head>
<body>
  <main>
    <h1>Página de ejemplo</h1>
    <p>Este texto viaja del servidor al navegador dentro de una respuesta HTTP.</p>
  </main>
</body>
</html>
```

```text
Página de ejemplo
Este texto viaja del servidor al navegador dentro de una respuesta HTTP.
```

(El segundo bloque es lo que verías en pantalla al cargar la página; el significado de cada etiqueta lo vemos en la Lección 2. Por ahora basta con ver que es solo texto.) Si un servidor sirviera ese archivo, la respuesta completa sería esta, con los saltos de línea que marca el protocolo:

```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Length: 290

<!-- fig00_01.html -->
<!DOCTYPE html>
...
```

`Content-Length` dice cuántos bytes mide el cuerpo, para que el navegador sepa cuándo terminó; 290 es lo que mide ese archivo. No es una respuesta que hayamos capturado de un servidor real —es la que produciría uno—, y en la Lección 1 verás una auténtica, de tu propio servidor.

Una aclaración que va a evitarte una confusión. Si le quitas a `curl` la opción `--http1.1` y le pides solo los encabezados (`-I`), la respuesta empieza distinto. Esto es lo que dio el 7 de octubre de 2026 (recortado a las primeras líneas):

```bash
$ curl -I https://example.com
HTTP/2 200
date: Wed, 07 Oct 2026 20:42:08 GMT
content-type: text/html; charset=utf-8
server: cloudflare
```

Por omisión, `curl` y el servidor acordaron `HTTP/2 200`, no `HTTP/1.1 200 OK`, y los nombres de los encabezados llegan en minúsculas. HTTP tiene [versiones](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Evolution_of_HTTP). La 1.1 ([RFC 9112](https://www.rfc-editor.org/rfc/rfc9112)) es la de texto que acabas de leer. La 2 ([RFC 9113](https://www.rfc-editor.org/rfc/rfc9113)) y la 3 ([RFC 9114](https://www.rfc-editor.org/rfc/rfc9114), sobre un transporte distinto llamado QUIC, [RFC 9000](https://www.rfc-editor.org/rfc/rfc9000)) envían lo mismo en formato binario —y con los encabezados comprimidos—, más eficiente y que ya no se puede leer a simple vista. **Lo que cambia es el empaque; el significado —métodos, [códigos de estado](https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml), encabezados— es el mismo en las tres** y está definido una sola vez, en el RFC 9110. Por eso aprender la forma en texto no es un ejercicio de nostalgia: es aprender el idioma, con la ventaja de que se lee. Verás que el servidor de tu computadora contesta con `HTTP/1.0` ([RFC 1945](https://www.rfc-editor.org/rfc/rfc1945)), una versión todavía más antigua: sirve para un servidor de práctica y, otra vez, el significado no cambia.

#### Los métodos: qué se le pide al servidor

El método es el verbo de la petición. Los que importan en este curso son pocos:

| Método | Para qué | ¿Cambia algo en el servidor? |
|---|---|---|
| `GET` | pedir un recurso | no |
| `POST` | enviar datos para que el servidor los procese (crear algo, por ejemplo) | normalmente sí |
| `PUT` | reemplazar un recurso con el que envías | sí |
| `DELETE` | borrar un recurso | sí |
| `HEAD` | igual que `GET`, pero sin el cuerpo: solo los encabezados | no |

El RFC 9110 les da dos propiedades con nombres precisos. Un método es **seguro** cuando no pretende cambiar nada en el servidor: `GET` y `HEAD` lo son, y por eso el navegador puede repetirlos, precargarlos o guardarlos sin miedo. Un método es **[idempotente](https://developer.mozilla.org/en-US/docs/Glossary/Idempotent)** cuando repetirlo da el mismo resultado que hacerlo una vez: `PUT` y `DELETE` lo son (borrar dos veces lo mismo deja el mismo mundo que borrarlo una), `POST` no (enviar dos veces un pedido puede crear dos pedidos). Esa diferencia explica por qué, si recargas una página que resultó de un `POST`, el navegador te advierte antes de reenviar. Por ahora todo lo que necesitas es: **cargar una página es un `GET`**, y la Lección 10 usará `GET` y `POST` desde los formularios.

#### Los códigos de estado: quién tiene el problema

Los códigos de estado son tres cifras, y la primera ya te dice casi todo: la familia.

| Familia | Significa | Los que vas a ver |
|---|---|---|
| **1xx** | informativo, sigue la conversación | casi nunca |
| **2xx** | éxito | `200 OK`, `201 Created`, `204 No Content` |
| **3xx** | [redirección](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Redirections): lo que buscas está en otro lado | `301` y `302` (otra dirección), `304 Not Modified` (usa tu copia) |
| **4xx** | error **del cliente**: la petición no es válida o no se puede atender | `400`, `401`, `403`, `404 Not Found`, `429 Too Many Requests` |
| **5xx** | error **del servidor**: la petición era válida pero falló al atenderla | `500`, `502 Bad Gateway`, `503 Service Unavailable`, `504 Gateway Timeout` |

La distinción 4xx / 5xx es oro para depurar porque señala por dónde empezar a buscar: un `404` dice «no encontré lo que pediste» (o, a veces, «no te voy a decir si existe»); un `500` dice «me topé con un problema inesperado de mi lado al atenderte». No siempre es tan limpio —un servidor mal programado puede contestar `500` a una petición que sí estaba mal—, pero como primera pista casi nunca falla. Cuando el panel `revisor` ponga una fila en rojo porque un servicio contestó `503`, estará traduciendo exactamente este vocabulario, y su columna de estado nace de aquí. La lista oficial completa vive en un registro de la IANA, que es la autoridad que asigna estos números.

Dos advertencias que se pagan caro más adelante. **Un `404` es una respuesta correcta y completa.** El servidor contestó, con un cuerpo (normalmente una página que dice «no encontrado») y todo; simplemente la respuesta es «no tengo eso». Desde el punto de vista del navegador la conversación salió bien. Esto va a importar en la Lección 8, porque la función [`fetch`](https://fetch.spec.whatwg.org/) de JavaScript trata a un `404` como una conversación que *salió bien* y no como un error: te toca mirar el estado tú. Segunda advertencia: **la familia 2xx dice que el servidor atendió la petición, no que el resultado sea el que tú esperabas.** Un `200` con un cuerpo que dice «error» (existe, y es una mala práctica) es un `200`.

#### Content-Type: cómo decide el navegador qué hacer con lo que recibe

Vuelve al encabezado `Content-Type: text/html; charset=utf-8`. Dice dos cosas: el tipo del contenido (`text/html`, un **tipo [MIME](https://www.iana.org/assignments/media-types/media-types.xhtml)**, formado por un tipo y un subtipo) y la codificación de los caracteres (`utf-8`, que es la que permite escribir «ñ» y «á»). **El navegador decide qué hacer con un archivo, ante todo, por este encabezado, no por la extensión del nombre.** Si el servidor dice `text/html`, lo interpreta como página; si dice `text/plain`, lo muestra como texto sin interpretarlo, aunque se llame `index.html`; si dice `text/css`, lo trata como estilos; si dice `text/javascript`, como un programa; si dice `application/json`, como datos. Hay un matiz: cuando el encabezado falta o es dudoso, el navegador a veces «olfatea» los primeros bytes para adivinar el tipo (el [estándar que lo regula](https://mimesniff.spec.whatwg.org/) lo llama *MIME sniffing*). Para lo que más te importa en el curso no adivina: un módulo de JavaScript o una hoja de estilos con el tipo equivocado simplemente no se usan.

Los tipos que vas a ver en este curso son pocos y conviene reconocerlos:

| Tipo [MIME](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/MIME_types) | Qué es | Lección |
|---|---|---|
| `text/html` | un documento HTML | 2 |
| `text/css` | una hoja de estilos | 3 |
| `text/javascript` | un programa (el [RFC 9239](https://www.rfc-editor.org/rfc/rfc9239) fijó este nombre como el oficial) | 6 |
| `application/json` | datos en JSON | 8 |
| `image/png`, `image/svg+xml` | imágenes | 11 |

Verás que este encabezado es el protagonista de una de las fallas más desconcertantes de la Lección 1: cuando el servidor contesta «no encontrado» con una página HTML en lugar del módulo de JavaScript que esperabas, el navegador se queja de que recibió el tipo equivocado. Ya sabrás por qué.

#### La memoria de la web: sin estado, con caché

HTTP no tiene memoria. Cada petición es independiente: el servidor no sabe, por sí mismo, que eres la misma persona que hace dos segundos pidió otra cosa. Se dice que es un protocolo **sin estado**. Cuando un sitio necesita recordarte (que ya iniciaste sesión, por ejemplo), lo hace con un truco encima de HTTP: te entrega una pequeña pieza de información llamada *[cookie](https://www.rfc-editor.org/rfc/rfc6265)* (mediante el encabezado `Set-Cookie`, que [MDN explica con ejemplos](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies)) y tu navegador la devuelve en las peticiones siguientes a ese sitio, mientras siga vigente (la propia cookie trae reglas que limitan a qué dominio y a qué rutas acompaña). Nuestro `revisor` no la necesita; la mencionamos para que sepas que existe y que la «memoria» no está en el protocolo sino puesta encima.

Lo que sí va a afectar tu día a día es la **[caché](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching)**. Para no descargar lo mismo mil veces, el navegador guarda copias de las respuestas y, según los encabezados, decide si puede reutilizarlas sin preguntar o si debe preguntar «¿cambió desde la última vez?». Si la copia todavía está vigente, el navegador la usa sin preguntar nada. Si ya venció, pregunta, y si el archivo no cambió, el servidor contesta `304 Not Modified` sin cuerpo y el navegador vuelve a usar la suya ([RFC 9111](https://www.rfc-editor.org/rfc/rfc9111#section-4.3)). Es una gran idea para el visitante y una trampa para quien programa: editas un archivo, recargas, y ves la versión de hace diez minutos. La pestaña Red tiene una casilla para desactivarla mientras trabajas, y vas a necesitarla desde la Lección 1.

### 0.3 Quién hace qué: el navegador, el servidor y tu código

#### El servidor: un programa que escucha

Un **servidor** no es una máquina especial con aspecto distinto: es un programa que está escuchando en una puerta, esperando peticiones, y que sabe contestarlas. Un servidor web puede hacer dos clases de cosa. En el caso sencillo, **lee un archivo del disco y lo envía tal cual**: pides `/data/services.json` y te manda el archivo que está en esa ruta. A eso se le llama servir contenido **estático**, y es lo que hará el servidor de práctica de tu computadora, y también el sitio que publicarás en la Lección 11. En el caso complejo, **ejecuta un programa por cada petición** —consulta una base de datos, calcula, arma la respuesta— y entonces el contenido es **dinámico**. Este curso solo necesita lo primero: el panel lee un archivo JSON del propio proyecto, así que no hay nada que programar del lado del servidor.

Retén esto: el servidor *no sabe nada de tu pantalla*. No sabe qué tan ancha es, si hay un lector de pantalla, si tu código falló. Solo contesta peticiones. Y, en el caso estático, tampoco ejecuta tu JavaScript: lo entrega.

#### El navegador: hace mucho más que mostrar

El navegador es el **cliente**, y su nombre técnico, *agente de usuario*, describe bien su papel: actúa en nombre de la persona. Su trabajo, desde que escribes la URL hasta que ves algo, es esta cadena (la describe con detalle la documentación de MDN y el artículo clásico de web.dev sobre cómo funcionan los navegadores):

1. **Resuelve el nombre y abre la conexión** (lo que vimos en 0.1 y 0.2).
2. **Pide el documento principal** con un `GET`. Recibe el HTML.
3. **Lo lee y construye el [DOM](https://dom.spec.whatwg.org/)**, el *Document Object Model*: una representación en forma de árbol de la página, con un nodo por cada etiqueta. Es el árbol sobre el que trabajará tu JavaScript (Lección 7).
4. **Descubre qué más necesita.** Mientras lee el HTML, se encuentra con referencias a otros archivos: una hoja de estilos con `<link>`, un programa con `<script>`, una imagen con `<img>`. **Cada una es otra petición**, con su propia ruta y su propio `GET`, que el navegador lanza a menudo en paralelo.
5. **Aplica los estilos** y calcula la geometría: qué mide cada cosa y dónde va.
6. **Ejecuta el JavaScript**, que puede modificar el árbol y hacer todavía más peticiones (cuando en la Lección 8 uses `fetch`, será exactamente esto).
7. **Pinta** el resultado en pantalla.

Dibujado como una línea de tiempo para la página mínima de arriba, más una hoja de estilos y un programa, queda así:

```text
tiempo →
navegador:  GET /index.html ─────────┐
servidor:                            └─ 200, HTML ──┐
navegador:                                          ├─ GET /css/main.css ─┐
                                                    ├─ GET /js/main.js  ──┤
servidor:                                           │                     └─ 200, 200
navegador:                                                                  construye, aplica, ejecuta y pinta
```

La consecuencia práctica es fundamental: **una página no es una descarga, son varias**, y cada una puede salir bien o mal por separado. Una página que «se ve sin estilos» no es un misterio de CSS; es, casi siempre, que la petición de la hoja de estilos devolvió un `404`, porque la ruta está mal escrita. Y lo vas a ver con tus ojos en un momento.

#### Los tres lenguajes, y de quién es cada uno

Ahora se entiende por qué la web se construye con tres lenguajes y no con uno. **HTML** describe el contenido y su significado: esto es un título, esto es una tabla, esto es un botón. **CSS** describe la presentación: colores, tamaños, cómo se acomoda. **JavaScript** describe el comportamiento: qué ocurre cuando alguien hace clic, cómo se piden y dibujan datos. Lo normal es que cada uno viaje como un archivo distinto, con su propio tipo MIME, y que el navegador los junte (también se puede escribir CSS y JavaScript dentro del propio HTML, con las etiquetas `<style>` y `<script>`, y entonces viajan dentro de él). El orden en que los vas a aprender —HTML, CSS, JavaScript— es también el orden de dependencia: una página debe tener sentido solo con HTML, mejorar con CSS y volverse interactiva con JavaScript. Es la idea de la *mejora progresiva*, que el libro *Resilient Web Design*, de Jeremy Keith, desarrolla con más calma y que vale la pena como lectura complementaria.

#### Lo que llega al navegador es de quien lo recibe

Aquí hay una idea que este curso va a repetir con insistencia, así que mejor entenderla en su [origen](https://www.rfc-editor.org/rfc/rfc6454). El HTML, el CSS y el JavaScript viajan hasta la máquina de la persona que visita la página, y ahí se ejecutan. **Todo lo que le entregas al navegador es legible y modificable por quien lo recibe.** Cualquiera puede abrir «Ver código fuente», leer tu JavaScript, cambiar valores desde las herramientas del navegador, o ni siquiera usar el navegador y mandar a mano la petición que quiera. De eso se siguen dos reglas que serán costumbres a lo largo de todo el curso:

- **Nada que deba permanecer secreto puede vivir en el código que mandas al navegador.** Una contraseña, una llave de servicio, un dato privado: si está ahí, ya se publicó.
- **Nada de lo que vuelva desde el navegador, o venga de fuera, es de fiar.** Una validación hecha en el navegador mejora la experiencia, pero no protege nada: quien quiera saltársela, se la salta. Y un texto que viene de fuera, como el nombre de un servicio, debe tratarse siempre como texto y nunca como código. En la Lección 7 verás qué pasa si no (se llama XSS) y por qué la propiedad `textContent` es la defensa.

La seguridad de la web no es un tema que se agrega al final: viene de este reparto de papeles. Quien sabe dónde corre su código sabe también qué puede garantizar.

#### El origen: quién puede leerle qué a quién

Existe una regla que el navegador aplica por tu seguridad y que más de una vez te va a parecer una molestia: la **política del [mismo origen](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)**. Un **[origen](https://developer.mozilla.org/en-US/docs/Glossary/Origin)** es la combinación de esquema, host y puerto. Una página solo puede leer libremente respuestas del mismo origen que ella; leer las de otro origen requiere permiso explícito del otro servidor (ese permiso se llama CORS y lo estudiamos en la Lección 9). Compara:

| Dirección | ¿Mismo origen que `https://example.com/`? | Por qué |
|---|---|---|
| `https://example.com/otra/ruta` | sí | esquema, host y puerto coinciden; la ruta no cuenta |
| `http://example.com/` | no | cambia el esquema |
| `https://www.example.com/` | no | cambia el host |
| `https://example.com:8443/` | no | cambia el puerto |

Hay un caso especial que te va a morder en la Lección 1: una página abierta directamente desde un archivo (`file:///home/ana/revisor/index.html`) no tiene un origen utilizable; los navegadores le asignan uno «opaco» y por eso le prohíben hacer cosas que a una página servida por HTTP sí le permiten. La solución es la que ya intuyes: servir tu proyecto con un servidor local, aunque sea mínimo.

#### La pestaña Red: ver la conversación

Todo lo anterior se puede ver, no solo creer. Las **herramientas del navegador** (en inglés *DevTools*) se abren con la tecla `F12`, o con `Ctrl`+`Shift`+`I`, y traen varias pestañas. La que nos importa hoy es **Red** (*Network*), que registra cada petición que hace la página. En Firefox, el navegador que viene con Linux Mint, también se abre con `Ctrl`+`Shift`+`E`; en los navegadores basados en Chromium, se llama igual y está en el mismo menú.

Tres reglas de uso, que ahorran los primeros tropiezos:

1. **Ábrela antes de cargar la página.** La pestaña registra mientras está abierta; lo que ocurrió antes no aparece. Abre las herramientas, entra a la pestaña Red, y *entonces* recarga con `F5`.
2. **Mira las columnas.** Cada petición es una fila. Las que importan: **Estado** (el código: `200`, `404`…), **Método** (`GET`), **Dominio** y **Archivo** (a quién y qué se pidió), **Tipo** (el tipo MIME, el `Content-Type` que vimos), **Transferido** y **Tamaño** (cuántos bytes viajaron y cuántos pesa ya descomprimido) y **Tiempo** (cuánto tardó).
3. **Haz clic en una fila.** Se abre un panel con los **encabezados** de la petición y de la respuesta, tal y como los vimos escritos arriba, además del cuerpo y del desglose de tiempos.

Con eso en la mano, la página de ejemplo `https://example.com` es un buen primer laboratorio: es minúscula y su contenido está pensado para ser inocuo. Cuando la escribí, el 7 de octubre de 2026, esa página pedía dos cosas: el documento HTML y un pequeño programa (`/s.js`) que ella misma enlaza; si hoy ves algo distinto, la tarea es la misma. En la fila del documento verás `GET`, el dominio, `200`, tipo `html`, y, en el panel de encabezados, las mismas líneas que `curl` mostró.

Y aquí cierra el hilo con el proyecto. La columna **Tiempo** es la idea que el `revisor` va a mostrar para cada servicio: cuánto pasó entre que la petición salió y la respuesta llegó. Y la columna **Estado** es la que decidirá si una fila del panel dice «arriba» o «caído». El `revisor` es, en pequeño, esta pestaña Red hecha producto: una lista de peticiones a servicios, cada una con su estado y su tiempo de respuesta. Por eso empezamos aquí.

## El error que vas a ver

Esta lección se aprende rompiendo cosas a propósito, porque los fallos de la web tienen tres formas claras y reconocerlas es la habilidad central. Provócalas tú; ninguna tiene riesgo.

**Primera forma: el nombre no se resuelve (falla del DNS).** Pide una dirección que no existe. El dominio `.invalid` está reservado justo para eso ([RFC 2606](https://www.rfc-editor.org/rfc/rfc2606)): nunca va a existir.

```bash
$ curl -sS https://nombre-que-no-existe.invalid
curl: (6) Could not resolve host: nombre-que-no-existe.invalid
```

El navegador muestra algo equivalente: «No se puede encontrar el servidor» o «Hmm. We're having trouble finding that site». El número entre paréntesis es el código de salida de `curl` (el 6 significa «no se pudo resolver el nombre»). **Qué significa:** la falla ocurrió *antes* de conectar con nadie, en la consulta DNS. El nombre está mal escrito, o no existe, o tu resolvedor no responde. **Cómo se arregla:** revisa la ortografía del nombre, y si el nombre es correcto, revisa tu conexión a internet.

**Segunda forma: nadie atiende en esa puerta (falla de la conexión).** Pide algo a tu propia computadora donde no hay ningún servidor.

```bash
$ curl -sS http://localhost:8000
curl: (7) Failed to connect to localhost port 8000 after 0 ms: Couldn't connect to server
```

El navegador dice «No se puede conectar» o `ERR_CONNECTION_REFUSED`. **Qué significa:** el nombre se resolvió y la máquina existe, pero ningún programa escucha en esa puerta. **Cómo se arregla:** el servidor está apagado, o escucha en otra puerta; arráncalo, o corrige el número. Fíjate en la diferencia con el caso anterior: aquí sí hubo una dirección a la que llegar.

**Tercera forma: hubo respuesta y es una mala noticia (falla de HTTP).** Pide un recurso que no existe en un servidor que sí existe.

```bash
$ curl -sI https://example.com/nada.html | head -1
HTTP/2 404 
```

**Qué significa:** todo el camino funcionó —nombre, conexión, cifrado, petición—, el servidor entendió y contestó que no tiene ese recurso. **Cómo se arregla:** la ruta está mal escrita, o el archivo no está donde dices. En el navegador, abre `https://example.com/nada.html` y mira la pestaña Red: verás una fila con estado `404` y, a pesar de eso, una página dibujada en pantalla. Esa es la prueba de lo que dijimos antes: un `404` es una respuesta.

Con esas tres formas puedes ordenar cualquier síntoma en un mapa de tres capas, que es la herramienta de depuración más útil de esta lección:

| ¿Hasta dónde llegó la conversación? | Capa | Síntoma típico | Qué revisar |
|---|---|---|---|
| No se resolvió el nombre | **Nombre** (DNS) | `Could not resolve host`, «no se encuentra el servidor» | ortografía, conexión, resolvedor |
| Se resolvió, pero nadie contesta en la puerta | **Conexión** (TCP/TLS) | `Failed to connect`, `ERR_CONNECTION_REFUSED`, credencial TLS inválida o vencida | que el servidor esté encendido, puerta, vigencia de la credencial TLS |
| Hubo respuesta con código 4xx o 5xx | **Respuesta** (HTTP) | `404`, `500`, `503` | ruta, permisos, estado del servidor |

Antes de cambiar una línea de código, pregúntate en cuál fila estás.

## Lo que se hace mal

**Decir «el servidor está caído» ante cualquier falla.** Un `404`, un tiempo agotado, una credencial TLS vencida y un nombre mal escrito son cuatro problemas distintos con cuatro arreglos distintos. Costo: horas buscando en el lugar equivocado. Corrección: mira primero el código de estado y la capa (la tabla de arriba).

**Escribir los archivos con mayúsculas, espacios o acentos.** `Logo Principal.PNG` funciona en tu computadora y se rompe en el servidor Linux donde publicarás. Costo: un `404` que solo aparece al publicar, el peor momento. Corrección: minúsculas, guiones en lugar de espacios, sin acentos: `logo-principal.png`.

**Confiar en el candado como si fuera un sello de calidad.** HTTPS dice que el canal es privado y que el nombre es auténtico, no que el sitio sea honesto ni que esté libre de errores. Costo: creer en un sitio por una señal que no prometía eso. Corrección: HTTPS es necesario, nunca suficiente.

**Esconder algo en el código del navegador.** Una llave «ofuscada» en JavaScript sigue estando en la máquina de cualquiera que abra la página. Costo: una filtración que no se puede retirar. Corrección: lo secreto vive en un servidor, nunca en lo que se envía al navegador.

**Depurar recargando.** Recargar diez veces «a ver si ahora sí» sin abrir la pestaña Red es adivinar. Costo: tiempo, y la tentación de cambiar código que no estaba mal. Corrección: abre la pestaña Red, recarga, y lee qué petición falló y con qué estado.

**No saber qué versión del archivo estás viendo.** La caché entrega la copia vieja mientras tú editas la nueva. Costo: depurar un problema que ya arreglaste. Corrección: durante el desarrollo, con las herramientas abiertas, marca «Desactivar caché» en la pestaña Red.

## Ejercicios

Los dos primeros usan lápiz y la terminal; el tercero, el navegador; el cuarto junta todo.

### Ejercicio 1 — Parte la URL

Escribe en una hoja las partes de estas tres URL (esquema, host, puerto —aunque no esté escrito—, ruta, consulta, fragmento) y responde: ¿cuáles dos comparten origen?

1. `https://example.com/data/services.json?status=down#row-3`
2. `http://localhost:8000/index.html`
3. `https://example.com:443/css/main.css`

### Ejercicio 2 — Lee una conversación con `curl`

Con `curl` instalado (si no, `sudo apt install curl`), ejecuta `curl -I https://example.com` y `curl -v https://example.com -o /dev/null`. Responde por escrito: (a) ¿qué versión de HTTP y qué código de estado devolvió? (b) ¿cuál es el `Content-Type`? (c) ¿qué versión de TLS se negoció? (d) ¿cuántas direcciones IP resolvió el nombre?

### Ejercicio 3 — Cuenta las peticiones de una página

Abre Firefox, abre las herramientas (`F12`), ve a la pestaña **Red** y *después* escribe `https://example.com`. (a) ¿Cuántas filas aparecen? (b) Para la primera: método, estado, tipo, tamaño. (c) Marca «Desactivar caché», recarga con `F5` y compara la columna Transferido con la carga anterior. (d) Ahora visita `https://example.com/nada.html`: ¿qué estado tiene la fila y por qué se ve una página a pesar de eso?

### Ejercicio 4 — Clasifica los síntomas

Para cada síntoma, di en qué capa ocurrió (nombre, conexión o respuesta) y qué revisarías primero: (a) `curl: (7) Failed to connect to localhost port 8000`; (b) la página aparece, pero sin ningún estilo, y en la pestaña Red la hoja de estilos tiene estado `404`; (c) `curl: (6) Could not resolve host`; (d) el navegador muestra una página «502 Bad Gateway»; (e) abres el panel desde un archivo y no carga un módulo de JavaScript (pista: piensa en el origen).

## Soluciones

### Ejercicio 1 — Parte la URL

1. Esquema `https`; host `example.com`; puerto 443 (el que el navegador supone para `https`); ruta `/data/services.json`; consulta `?status=down`; fragmento `#row-3`.
2. Esquema `http`; host `localhost`; puerto `8000`; ruta `/index.html`; sin consulta ni fragmento.
3. Esquema `https`; host `example.com`; puerto `443` (escrito, aunque es el que ya se suponía); ruta `/css/main.css`; sin consulta ni fragmento.

La 1 y la 3 comparten origen: mismo esquema (`https`), mismo host (`example.com`) y mismo puerto (443 en ambas, escrito o no). Que tengan rutas distintas no cuenta. La 2 cambia de esquema, de host y de puerto.

### Ejercicio 2 — Lee una conversación con `curl`

Los valores de este ejemplo son los que obtuve el 7 de octubre de 2026; los tuyos pueden diferir en lo que sea variable (fechas, direcciones), no en la forma.

(a) `HTTP/2 200`: versión 2 del protocolo, código `200` (éxito). (b) `text/html; charset=utf-8`. (c) `TLSv1.3`, en la línea `SSL connection using TLSv1.3 …`. (d) Dos: `104.20.23.154` y `172.66.147.243` (línea `IPv4:` de la salida). Si en tu salida el protocolo es `HTTP/1.1`, tu `curl` negoció la versión anterior y es igualmente correcto: el significado no cambia.

### Ejercicio 3 — Cuenta las peticiones de una página

(a) Dos al escribir esto (el documento y el programa `/s.js`); si hoy hay otro número, anota el que ves. (b) `GET`, `200`, tipo `html`, un tamaño de unos cientos de bytes. (c) Con la caché desactivada, la columna Transferido muestra el tamaño real descargado en cada recarga; con la caché activa puede aparecer «en caché» o un valor menor o nulo, porque el navegador reutilizó su copia. (d) Estado `404`: el servidor contestó que no tiene ese recurso, pero su respuesta incluye una página que dice precisamente eso, y el navegador la dibuja. La conversación salió bien; el recurso no existe.

### Ejercicio 4 — Clasifica los síntomas

(a) **Conexión.** El nombre se resolvió y la máquina existe, pero nadie escucha en la puerta 8000: revisa que el servidor esté encendido y que sea esa puerta. (b) **Respuesta**, en una petición secundaria: el documento principal salió bien y la hoja de estilos devolvió `404`; revisa la ruta del `<link>` y las mayúsculas del nombre del archivo. (c) **Nombre.** No hubo ni conexión: revisa la ortografía del host y tu conexión. (d) **Respuesta**: un código 5xx. Contestó un servidor intermedio (una *puerta de enlace* o *proxy*), que le pasó tu petición al servidor real y recibió de él una respuesta inválida ([RFC 9110 §15.6.3](https://www.rfc-editor.org/rfc/rfc9110#section-15.6.3)). Si el servidor real simplemente no hubiera contestado a tiempo, el código sería otro: `504 Gateway Timeout`. No es algo que arregles en tu página: se informa a quien administra el servicio. (e) **Origen:** el navegador no deja a una página de `file://` cargar módulos porque su origen es opaco; la solución, que verás en la Lección 1, es servir la carpeta por HTTP.

## Cómo sé que lo logré

Esta lección es de comprensión, y eso también se puede medir. Estás listo para la siguiente cuando:

- `curl -I https://example.com` te imprime en la primera línea un `HTTP/2 200` (o `HTTP/1.1 200 OK`) y sabes explicar cada palabra de esa línea.
- Puedes tomar una URL cualquiera y señalar su esquema, host, puerto, ruta, consulta y fragmento sin ayuda, y sabes cuál de ellos no viaja al servidor.
- Abriste la pestaña Red **antes** de cargar una página, encontraste la petición principal y leíste su estado, su tipo y su tiempo.
- Ante los tres errores de la sección «El error que vas a ver», dices la capa correcta sin consultar la tabla.
- Puedes explicar con tus palabras, en dos frases, por qué «cargar una página» son varias peticiones y por qué lo que le entregas al navegador no puede ser secreto.

Si alguna de las cinco no te sale, vuelve a la subsección correspondiente; son las bases de las once lecciones que siguen. Y anota en la [bitácora](https://github.com/HabilMX/curso-web/blob/main/es/bitacora.md) lo que te costó: es la parte del curso que solo tú lees.

## Para leer más

- [Cómo funciona la web, de MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works) — la misma historia contada por quienes mantienen la documentación de la plataforma, con más imágenes.
- [Panorama de HTTP, de MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview) — el siguiente paso si quieres ver HTTP más a fondo, incluyendo los encabezados que aquí solo nombramos.
- [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110) — la definición oficial de métodos, códigos y encabezados; es una referencia, se consulta, no se lee de corrido.
- [Resilient Web Design, de Jeremy Keith](https://resilientwebdesign.com/) — la historia y la filosofía de la web, y el origen de la idea de construir por capas.
