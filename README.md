# Curso de Fundamentos de la web — de cero a un panel que cualquiera puede usar


**Por Dorian Chávez, fundador de Hábil y arquitecto de integración.**

**Cada lección de este curso se mide en cada cambio —su profundidad, que cumpla la plantilla, que las traducciones correspondan al español y que no se publique material interno—, y la comprobación se corre con un comando que cualquiera puede repetir.**
Los guiones que la hacen viven en [`herramientas/`](herramientas/) y se corren desde la raíz del repositorio; cada lección dice cuál le toca.

> El curso está en cinco idiomas: español (el original), inglés, francés, portugués de Brasil y búlgaro.

## Dónde está el contenido

- **[Español — el curso completo](es/README.md)** ← empieza aquí
- **[English — the full course](en/README.md)**
- **[Français — le cours complet](fr/README.md)**
- **[Português (Brasil) — o curso completo](pt/README.md)**
- **[Български — пълният курс](bg/README.md)**
- **[`programas/`](programas/)** — todas las páginas del curso, listas para abrir

## Para quién es

Quien nunca ha escrito una página y quiere entender la web por dentro, y quien copia fragmentos que funcionan sin saber por qué. **Es el escalón previo al curso de TypeScript de esta casa**, que hoy supone que ya sabes JavaScript y salta a React sin bases de HTML ni CSS. No se supone experiencia previa con ningún lenguaje.

## El proyecto que crece

El **`revisor`**: un panel que muestra el estado de una lista de servicios —nombre, estado y tiempo de respuesta— con su resumen, sus filtros y su formulario. **Se construye con HTML, CSS y JavaScript puros, sin una sola librería**, y lee sus datos de un archivo JSON del propio proyecto.

Es el mismo `revisor` de los cursos de Go, Rust y TypeScript, y eso es deliberado: **quien siga a TypeScript va a rehacer este panel con tipos y con React**, y de comparar las dos versiones se aprende más que de empezar otro proyecto. Lo que cambia es la herramienta, no el problema.

Un solo proyecto desde la lección 2, que crece lección a lección. Ningún curso gratuito de este nivel que se revisó lo hace así: enseñan temas sueltos y dejan el producto para el final, cuando ya no hay tiempo.

## Las lecciones

Numeración única y continua: «Lección N», de la 0 a la 11 — **doce lecciones**.

| # | Lección | Qué construyes | Qué aprendes |
|---|---|---|---|
| 0 | Cómo funciona la web | nada todavía (lectura) | URL, DNS, HTTP, petición y respuesta; qué hace el navegador y qué el servidor; la pestaña Red |
| 1 | Tu equipo y el ciclo de trabajo | el entorno y el primer `index.html` | editor, terminal y carpetas; servidor local desde el primer día; las herramientas del navegador; un primer registro en Git |
| 2 | HTML con significado | el esqueleto del panel | elegir el elemento por lo que significa; encabezados, tablas, botones y etiquetas; el panel escrito a mano |
| 3 | CSS: cascada, especificidad y caja | el panel legible | de dónde viene cada estilo y cuál gana; el modelo de caja y `box-sizing`; variables de color y tipografía |
| 4 | Acomodar con Flexbox y Grid | el panel acomodado en una pantalla ancha | una dimensión con Flexbox y dos con Grid; los dos ejes, `gap`, `flex` y `flex-wrap`; columnas con `fr` y `repeat()` |
| 5 | Una página que sirve en cualquier pantalla | el panel que sirve en un teléfono | la etiqueta `viewport`; `minmax()` y `auto-fit` antes de `@media`; la tabla que se desplaza en su caja; `@container`; de 320 a 1440 px |
| 6 | JavaScript y el modelo de datos | los datos del panel y sus cuentas | valores, objetos, arreglos y funciones; decidir, repetir y avisar de un error; módulos; cuántos servicios están arriba y el promedio de respuesta |
| 7 | El DOM, los eventos y el estado | la tabla que se dibuja desde los datos | dibujar desde datos; escuchar eventos; separar estado y dibujado; `textContent` como hábito, y el XSS que evita |
| 8 | Traer datos: promesas, fetch y async/await | el panel que pide sus datos a un archivo JSON | qué es una promesa; `fetch` en dos pasos; `response.ok`; `async`/`await` |
| 9 | Cuando algo falla: tiempos límite, estados, CORS y varias peticiones | el panel que dice siempre qué está pasando | tiempo límite; los tres estados: cargando, error y vacío; el error de CORS; varias peticiones con `Promise.allSettled` |
| 10 | Formularios y validación | agregar y filtrar servicios | la validación que el navegador ya trae; `:user-invalid`; decir el error para que un lector de pantalla lo anuncie |
| 11 | El panel terminado | el `revisor` publicado | repaso con el teclado; CSP como encabezado del servidor; peso y rendimiento; publicar un sitio estático |

Lo que la tabla promete por lección es lo que la lección trae.

**La accesibilidad y la seguridad no son lecciones: son criterios de todas.** El HTML nativo primero en la 2, el teclado en la 3, la 4 y la 5, `textContent` en la 7, la validación nativa en la 10, y el repaso con la CSP en la 11. Se enseñan donde aparecen, no en un módulo final que nadie alcanza.

**Solo se enseña lo que ya funciona en todos los navegadores** —lo que la plataforma llama Baseline «widely available»—: `@layer`, consultas de contenedor, `gap`, `:focus-visible`, `<dialog>`, `:user-invalid`. Lo que todavía no, aparece en un recuadro «lo que viene», y se dice que no se use en producción.

**Lo que este curso NO enseña, a propósito:** jQuery, maquetación con `float`, Bootstrap, Sass, `this` y los prototipos. Son el pasado de la web o atajos que esconden lo que hay debajo; quien entienda estas doce lecciones los aprende en una tarde si alguna vez los necesita.

## La plantilla de cada lección

Igual en todas:

1. **Encabezado:** «Lección N — título», tiempo (dos sesiones de unos 90 min en las siete lecciones largas; 2 × 45 en tres, y 90 min en dos) y «Al terminar vas a poder…» (3 a 7 objetivos medibles).
2. **El porqué antes del cómo:** qué necesita quien usa el panel, y qué le falta hoy.
3. **Los conceptos**, uno por sección, **máximo tres nuevos por lección**: explicación, ejemplo mínimo y ejemplo en el `revisor`.
4. **El error que vas a ver:** el mensaje real del navegador o del validador, qué significa y cómo se arregla. Se provoca a propósito.
5. **Lo que se hace mal** (antipatrones), con su costo.
6. **Ejercicios** (2 a 4), de menor a mayor, con sus **soluciones** aparte.
7. **Cómo sé que lo logré:** medible. Tal comando da tal salida; se navega con el teclado; no hay errores en la consola.
8. **Para leer más:** 2 a 4 fuentes, la documentación oficial primero.

## Cómo ver que las páginas funcionan

Desde la raíz del repositorio: `herramientas/medir-profundidad.sh` comprueba la profundidad de cada lección, `herramientas/verificar-plantilla.sh` que cada una cumpla la plantilla, y `herramientas/verificar-traducciones.sh` que los cinco idiomas correspondan. Las tres salen con código distinto de cero si algo no cumple.

En tu computadora solo hace falta **Python 3**, que ya viene instalado en macOS y en Linux (en Windows se baja de [python.org](https://www.python.org/downloads/)). Se usa únicamente para levantar un servidor local: el curso no necesita Node.js ni instalar paquetes.

```bash
cd programas/<la-carpeta-de-la-lección>
python3 -m http.server 8000        # el servidor local; abre http://localhost:8000
```

🔴 **Un curso de navegador no se verifica como uno de consola, y ahí hay un hueco, dicho a propósito.** Una página no «imprime» una salida que se pueda comparar: para comprobarla hay que cargarla de verdad en un navegador y contrastar el resultado. **Ese paso todavía no existe**, y por eso no aparece arriba ni en la verificación automática. Lo que hoy se comprueba de las páginas es que estén donde la lección dice y con su salida esperada al lado; **no** que al cargarlas produzcan esa salida.

**La consecuencia, sin adornos: una regresión en el código de una página no la detecta nada hoy.** Que la página haga lo que la lección promete es responsabilidad de quien escribe la lección. El guion que lo automatice se agrega a `.github/workflows/verificar.yml` **el día que exista y corra**, no antes: un paso que invoca algo inexistente deja la corrida en rojo desde el primer día y entrena a todos a ignorar el rojo.

Cada página es un `figNN_NN.html` dentro de la carpeta de su lección, con su salida esperada al lado (`figNN_NN.salida.txt`). Las que a propósito están mal traen `figNN_NN.error-esperado.txt`, con el mensaje que la lección enseña a leer. Las que necesitan varios archivos traen los demás en `figNN_NN/`.

**Las lecciones son la fuente; `programas/` guarda las páginas de cada una.** Hoy las dos se escriben a la par y **nada comprueba que coincidan**: no hay guion que extraiga los bloques de código de `es/*.md` y los compare contra los archivos. Mientras no exista, que lo que lees y lo que ejecutas sean lo mismo depende de quien edita — y es el segundo hueco que falta cerrar.

## Qué hay en el repositorio

| | |
|---|---|
| `es/` | el curso en español, una lección por archivo |
| `en/`, `fr/`, `pt/`, `bg/` | las traducciones, una lección por archivo |
| `programas/` | las páginas de las lecciones (con su salida esperada) |
| `herramientas/` | los guiones que verifican el curso y las versiones fijadas de las herramientas |
| `.github/workflows/verificar.yml` | la verificación automática que corre en cada cambio |
| `verificar-publicable.sh` | revisa que el material no contenga rutas internas ni claves antes de publicarlo |
| `LICENSE.md` | CC BY-SA 4.0 |

## La profundidad se mide

Cada lección va de **5,749 a 10,017 palabras de explicación, con mediana de 7,910** — remedido el 7-oct-2026 a las 15:45 sobre las doce lecciones —, muy por encima de la vara que este curso comparte con los de Go, Rust y TypeScript. `herramientas/medir-profundidad.sh` cuenta las **palabras de explicación** (lo que está fuera de los bloques de código) y exige dos varas absolutas: **piso de 3,000 palabras por lección y mediana de 4,000 para el curso**. Sale con código 1 si no cumple, así que la verificación automática se pone roja.

Se cuentan palabras y no líneas porque **las líneas se inflan**: una frase por línea suma muchas líneas sin explicar más. Y las varas son absolutas y no «la mitad de la mediana del curso» porque ese criterio se muerde la cola: unas lecciones flacas bajan la mediana y entonces pasan. Un criterio relativo garantiza uniformidad, no profundidad.

## Qué es una página y qué es un fragmento

**No todo bloque de código de este curso es una página completa.** Una **página** se abre y funciona sola: su bloque empieza con un comentario `<!-- figNN_NN.html -->` y trae, justo después, el resultado real de cargarla. Ese resultado está escrito, no comprobado por una máquina (ver «Cómo ver que las páginas funcionan»). Un **fragmento** es una ilustración que no pretende funcionar por sí sola, y por eso no se verifica; se reconoce porque su bloque no empieza con ese comentario.

## Reglas del repositorio

- **Licencia CC BY-SA 4.0** (ver `LICENSE.md`): el material es público y se puede reusar citando la fuente.
- **Multiidioma:** `es/` es el original; las otras cuatro son traducciones, y `herramientas/verificar-traducciones.sh` avisa cuando alguna quedó vieja respecto al español.
- **El código no se traduce.** Los nombres de archivo, los datos y los identificadores quedan en inglés (`status`, `responseMs`, `available`, `down`); se traduce la prosa: las explicaciones, los ejercicios, los errores y el glosario. **Los textos que el panel muestra en pantalla van dentro del código, así que tampoco se traducen**: el código es idéntico en las cinco ediciones y el salto a la documentación técnica, que está en inglés, es menos abrupto.
- `./verificar-publicable.sh` antes de publicar. Falla cerrado (si no pudo buscar, sale en error, no en verde) y trae autoprueba: siembra un patrón y exige detectarlo.
- Sin emojis en los títulos de las lecciones.
