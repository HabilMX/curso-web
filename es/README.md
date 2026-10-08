# Curso de Fundamentos de la web — de cero a un panel que cualquiera puede usar

**Por Dorian Chávez, fundador de Hábil y arquitecto de integración.**

**Para quién es:** quien nunca ha escrito una página, y quien copia fragmentos que funcionan sin saber por qué. No se supone experiencia previa con ningún lenguaje: cada concepto se explica cuando aparece, y se explica por qué existe, no solo cómo se escribe.

**Qué vas a terminar sabiendo:** construir una página completa, entender lo que escribiste y poder explicárselo a alguien más. Y quedarte con el criterio para leer la documentación de la plataforma por tu cuenta.

**Dónde sigue:** este curso es el escalón previo al [curso de TypeScript](https://www.habil.mx/es/cursos/typescript/) de esta casa, que rehace este mismo panel con tipos y con React.

**Lo que necesitas antes de empezar:** una computadora con Linux Mint y saber abrir una terminal. La [Lección 1](01-entorno-ciclo-trabajo.md) instala todo desde cero.

## El proyecto que vas a construir

El **`revisor`**: un panel que muestra el estado de una lista de servicios —nombre, estado y tiempo de respuesta— con su resumen, sus filtros y su formulario. Con HTML, CSS y JavaScript puros, **sin una sola librería**, leyendo sus datos de un archivo JSON del propio proyecto.

Empieza en la lección 2 y crece en cada lección. Es el mismo problema de los cursos de Go, Rust y TypeScript de esta casa: cuando sigas a TypeScript vas a rehacer este panel, y de comparar las dos versiones se aprende más que de empezar otro proyecto.

## Las doce lecciones

| Lección | | Qué construyes | Qué aprendes |
|---|---|---|---|
| 0 | [Cómo funciona la web](00-como-funciona-la-web.md) | nada todavía (lectura) | URL, DNS, HTTP, petición y respuesta; qué hace el navegador y qué el servidor; la pestaña Red |
| 1 | [Tu equipo y el ciclo de trabajo](01-entorno-ciclo-trabajo.md) | el entorno y el primer `index.html` | editor, terminal y carpetas; servidor local desde el primer día; las herramientas del navegador; un primer registro en Git |
| 2 | [HTML con significado](02-html-con-significado.md) | el esqueleto del panel | elegir el elemento por lo que significa; encabezados, tablas, botones y etiquetas; el panel escrito a mano |
| 3 | [CSS: cascada, especificidad y caja](03-css-cascada-caja.md) | el panel legible | de dónde viene cada estilo y cuál gana; el modelo de caja y `box-sizing`; variables de color y tipografía |
| 4 | [Acomodar con Flexbox y Grid](04-flexbox-grid.md) | el panel acomodado en una pantalla ancha | una dimensión con Flexbox y dos con Grid; los dos ejes, `gap`, `flex` y `flex-wrap`; columnas con `fr` y `repeat()` |
| 5 | [Una página que sirve en cualquier pantalla](05-pagina-adaptable.md) | el panel que sirve en un teléfono | la etiqueta `viewport`; `minmax()` y `auto-fit` antes de `@media`; la tabla que se desplaza en su caja; `@container`; de 320 a 1440 px |
| 6 | [JavaScript y el modelo de datos](06-javascript-datos.md) | los datos del panel y sus cuentas | valores, objetos, arreglos y funciones; decidir, repetir y avisar de un error; módulos; cuántos servicios están arriba y el promedio de respuesta |
| 7 | [El DOM, los eventos y el estado](07-dom-eventos-estado.md) | la tabla que se dibuja desde los datos | dibujar desde datos; escuchar eventos; separar estado y dibujado; `textContent` como hábito, y el XSS que evita |
| 8 | [Traer datos: promesas, fetch y async/await](08-traer-datos.md) | el panel que pide sus datos a un archivo JSON | qué es una promesa; `fetch` en dos pasos; `response.ok`; `async`/`await` |
| 9 | [Cuando algo falla: tiempos límite, estados, CORS y varias peticiones](09-cuando-algo-falla.md) | el panel que dice siempre qué está pasando | tiempo límite; los tres estados: cargando, error y vacío; el error de CORS; varias peticiones con `Promise.allSettled` |
| 10 | [Formularios y validación](10-formularios-validacion.md) | agregar y filtrar servicios | la validación que el navegador ya trae; `:user-invalid`; decir el error para que un lector de pantalla lo anuncie |
| 11 | [El panel terminado](11-el-panel-terminado.md) | el `revisor` publicado | repaso con el teclado; CSP como encabezado del servidor; peso y rendimiento; publicar un sitio estático |

Al final de cada lección hay ejercicios con sus soluciones. Y la [bitácora](https://github.com/HabilMX/curso-web/blob/main/es/bitacora.md) es tuya: anota ahí lo que te costó.

## Dos criterios que atraviesan todo el curso

**La accesibilidad y la seguridad no son lecciones, son costumbres.** No hay un módulo final de accesibilidad: hay HTML nativo en la 2, teclado en la 3, la 4 y la 5, `textContent` en la 7, validación nativa en la 10 y el repaso en la 11. Un tema que se deja al final es un tema que no se aprende.

**Solo se enseña lo que ya funciona en todos los navegadores.** Lo que todavía no, aparece en un recuadro «lo que viene» y se dice que no se use en producción. Un curso que enseña lo que acaba de salir envejece en seis meses.

## Cómo sabes que terminaste

El curso no se acaba cuando leíste la lección 11, sino cuando tu panel cumple estas cinco cosas. Ningún programa las revisa por ti: las compruebas tú, con las herramientas del navegador, y la sección «Cómo sé que lo logré» de cada lección te dice cómo:

1. **Se navega completo con el teclado**, sin usar el mouse.
2. **No hay ni un error en la consola** del navegador.
3. **Funciona a 320 px de ancho** sin desbordamiento horizontal.
4. **Muestra los tres estados**: cargando, error y vacío. No solo el caso en que todo sale bien.
5. **El texto que viene de fuera se dibuja con `textContent`**, nunca con `innerHTML`.
