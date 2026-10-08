# Урок 7 — DOM, събитията и състоянието

**Време:** 2 × 45 минути

**Какво изграждаш:** таблицата на таблото, изчертана от данните

**Какво научаваш:** да чертаеш от данни, вместо да пишеш на ръка; да слушаш събития; да разделяш състояние, чертане и ефекти; `textContent` като навик и атаката, която той предотвратява

## След урока ще можеш да

- Обясняваш разликата между HTML файла и DOM и казваш кое от двете се променя, когато JavaScript пише в страницата.
- Чертаеш цяла таблица от масив от обекти, като създаваш елементите един по един и ги закачаш към документа.
- Обясняваш какво е XSS атака с пример, който сам предизвикваш, и защо `textContent` я предотвратява, а `innerHTML` я позволява.
- Слушаш събитие с `addEventListener`, четеш какво се е случило с елемента чрез обекта на събитието и обслужваш много бутони с един-единствен слушател (делегиране).
- Разделяш състоянието на таблото (какво помни), чертането (как изглежда) и ефектите (какво слуша) и казваш в кой файл живее всяко от тях.
- Навигираш по таблото само с клавиатурата и проверяваш, че фокусът не се губи, когато таблицата се изчертава наново.

## Защо, преди как

**Изходна точка.** Този урок тръгва от таблото, както го остави урок 6, в папката ти `revisor`:

- `index.html`, таблото от урок 2 с класовете, които му сложиха уроци 4 и 5: заглавната част, обобщението с четирите му числа, написани на ръка, полето за търсене, радио бутоните, бутона „Revisar ahora“ (Провери сега) и таблицата с петте ѝ реда, написани на ръка. В `<head>` има реда `<script type="module" src="js/main.js">`, който добави в урок 6.
- `css/styles.css`, стиловият лист от уроци 3, 4 и 5: слоеве, променливи за цветове, значки за състояние и подредбата, която върви от 320 до 1440 пиксела.
- `js/services.js`, модул, който експортира масива `services` с петте услуги.
- `js/stats.js`, модул, който експортира `countByStatus`, `averageResponseMs` и `summarize`.
- `js/main.js`, който засега само записва изчисленията в конзолата на браузъра.

Двата модула с данните и с изчисленията не се променят през целия урок: това е тяхната форма, същата като в урок 6. Единственото различно е първият ред, коментарът, който в хранилището казва къде живее всеки файл: таблото от този урок е в [`programas/07-dom-eventos-estado/panel/`](https://github.com/HabilMX/curso-web/tree/main/programas/07-dom-eventos-estado/panel).

```js
// panel/js/services.js
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
// panel/js/stats.js
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

Обърни внимание на едно решение от урок 6, което днес се плаща: паднала услуга няма време за отговор и затова нейното `responseMs` е `null`, а не нула. Нулата би казала „отговори за нула милисекунди“, което е лъжа и освен това разваля средното. `averageResponseMs` вече знае да оставя настрана онези, които не са отговорили, а днес ще видиш, че и таблицата трябва да реши какво да покаже на тяхно място.

**Какво липсва днес на таблото.** Имаш същите пет услуги на две места: в `js/services.js`, където JavaScript може да ги брои, и в HTML, където човек може да ги види. Никой не гарантира, че съвпадат. Ако утре Pagos падне и промениш масива, таблицата ще продължи да казва „Disponible“ (Налична), докато някой не се сети да редактира и HTML. Ако добавиш шеста услуга, трябва да копираш цял ред със значката му, без да сбъркаш някой таг. И обобщението има същия проблем: четирите му числа ги написа на ръка в урок 2, а онези, които изчисли урок 6, са затворени в конзолата.

Две копия на една и съща информация накрая си противоречат. Изходът е да има **един-единствен източник на истината**, данните, а екранът да е следствие: когато данните се променят, се чертае наново. Това изграждаш днес.

**Какъв път следва урокът.** Три идеи, в този ред. Първо **DOM**, който е начинът, по който JavaScript вижда и променя страницата, и с него чертаеш таблицата от данните; там се появява и най-доходното правило за сигурност в целия уеб, което се побира в един ред и което ще видиш как се нарушава с очите си. Второ **събитията**, които са начинът, по който страницата научава, че някой е направил нещо. Трето **състоянието**, което е онова, което таблото помни, и разделянето, което не позволява кодът да се превърне в кълбо, щом има повече от един бутон.

Едно практическо предупреждение, преди да започнем: модулите не се зареждат, ако отвориш файла с двойно щракване (`file://`). От урок 1 работиш с локален сървър. Страниците на този урок са в папката [`programas/07-dom-eventos-estado/`](https://github.com/HabilMX/curso-web/tree/main/programas/07-dom-eventos-estado) на [хранилището на курса](https://github.com/HabilMX/curso-web): изтегли го (или го клонирай с Git) на компютъра си и стартирай сървъра от неговата папка `programas/`:

```bash
cd programas
python3 -m http.server 8000 --bind 127.0.0.1
```

И отвори `http://127.0.0.1:8000/07-dom-eventos-estado/panel/`. `--bind 127.0.0.1` прави така, че само твоят компютър да може да вижда папката; без него сървърът обслужва цялата локална мрежа.

## Понятията

Те са три и всяко носи минималния си пример и примера си в `revisor`. Едно напомняне за метод, което важи за целия урок: **преди да изпълниш всяка фигура, запиши в дневника какво мислиш, че ще се случи**. Да предскажеш и после да провериш учи повече от четенето на отговора, защото когато сгрешиш, грешката остава запечатана.

### 7.1 DOM: страницата като дърво, което JavaScript може да променя

**Файлът не е страницата.** Когато браузърът получи HTML файл, в ръцете му има текст. Чете го от начало до край и с него изгражда в паметта структура от обекти, **дърво**: `html` съдържа `head` и `body`; `body` съдържа заглавната част, таблицата, абзаците; таблицата съдържа тялото си, тялото редовете си, всеки ред клетките си. Всяко парче от това дърво се нарича **възел**, а цялото дърво —**DOM** (от *Document Object Model*, обектният модел на документа). Официалното определение е в [стандарта DOM](https://dom.spec.whatwg.org/); обяснението на MDN [какво е DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction) е препоръчителното четиво за онзи, който иска подробности.

Тази разлика има значение по три причини, които ще провериш с инструментите на браузъра:

1. **Онова, което виждаш в Инспектора, е DOM, не файлът.** Отвори своя `index.html` със сървъра, натисни `F12` и иди в раздела на Инспектора. Ако в HTML си написал таблица без `<tbody>`, Инспекторът въпреки това ще ти го покаже: браузърът го е добавил, докато е изграждал дървото, защото стандартът го изисква. „Преглед на изходния код“ показва файла; Инспекторът показва живото дърво.
2. **JavaScript променя дървото, не файла.** Ако една програма добави ред, файлът `index.html` на диска ти остава същият. Презареди страницата и промяната изчезва, защото браузърът отново чете файла и отново изгражда дървото. Затова никога няма да „запазиш“ промяна на DOM: DOM се изгражда наново всеки път, а онова, което се запазва, са данните и кодът, който го чертае.
3. **Инспекторът се обновява сам.** Когато таблото е отворено и кодът промени дървото, ще видиш как промененият възел просветва. Това е най-добрият начин да учиш: гледай кои възли се променят и кои не.

**Четене и писане в дървото.** Входната точка е обектът `document`, който представлява цялата страница. С него се *търси* възел и после се *чете* или *пише* нещо в него. За търсене `document.querySelector(selector)` получава CSS селектор, същия език от урок 3 (`#title` е елементът с този `id`, `.status` тези с този клас, `tbody` тези с този таг), и връща **първия** възел, който съвпада, или **`null`**, ако никой не съвпада. Брат му `document.querySelectorAll(selector)` връща **всички**, които съвпадат, в списък, който се обхожда с `for…of`. За да запишеш текст във възел, го присвояваш на свойството му `textContent`.

Преди да изпълниш фигура 7.1, **предскажи**: какво число ще покаже абзацът и какво ще каже заглавието, когато програмата свърши? Фигурата носи таблица от три реда, написана на ръка:

```html
<!-- fig07_01.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 7.1 — Leer y escribir el documento</title>
</head>
<body>
  <main>
    <h1 id="title">Servicios</h1>
    <table>
      <tbody>
        <tr><td>Catálogo</td><td>Disponible</td></tr>
        <tr><td>Pagos</td><td>Disponible</td></tr>
        <tr><td>Inventario</td><td>Caído</td></tr>
      </tbody>
    </table>
    <p id="count"></p>
  </main>

  <script type="module">
    // Leer: ¿cuántas filas hay en el documento?
    const rows = document.querySelectorAll("tr");

    // Escribir: poner esa cuenta en el párrafo.
    const paragraph = document.querySelector("#count");
    paragraph.textContent = `El documento tiene ${rows.length} filas.`;

    // Escribir otra vez: cambiar el texto del título.
    document.querySelector("#title").textContent = "Servicios (leídos por JavaScript)";
  </script>
</body>
</html>
```

Онова, което се вижда на страницата (текстът, който показва Chrome, отгоре надолу), и което в хранилището е в [`programas/07-dom-eventos-estado/fig07_01.salida.txt`](https://github.com/HabilMX/curso-web/blob/main/programas/07-dom-eventos-estado/fig07_01.salida.txt):

```text
Servicios (leídos por JavaScript)
Catálogo	Disponible
Pagos	Disponible
Inventario	Caído

El documento tiene 3 filas.
```

Ако предсказанието ти е било „три реда“, познал си и обърни внимание какво доказва това: `querySelectorAll("tr")` преброи редовете на *тялото*, а таблицата няма заглавен ред с колоните. Ако имаше ред със заглавия, щяха да са четири. Това е вид подробност, която се учи с броене, а не с четене.

Още две неща за тази фигура. `<script type="module">` е *след* съдържанието, но би било все едно къде го слагаш: един модул винаги се изпълнява, когато документът вече е прочетен докрай, и това избягва най-честата грешка на начинаещия, която ще видиш в раздела „Грешката, която ще видиш“. И свойството `textContent` е за **четене и писане**: `elemento.textContent` ти дава текста, който има вътре, `elemento.textContent = "algo"` го заменя, като преди това изтрива всичко, което елементът е съдържал, включително децата му.

**Чертане от масив.** За да начертаеш списък, не се пише текстът на списъка: **създават се възли** и се **закачат** към дървото. Стъпките са три и са винаги едни и същи:

1. `document.createElement("li")` създава нов елемент, свободен в паметта. Още не се вижда, защото не принадлежи на дървото на страницата.
2. Задава му се съдържанието: `elemento.textContent = "..."`, или атрибутите и класовете му.
3. `contenedor.append(elemento)` го закача към дървото, в края на децата на контейнера. В този момент се появява на екрана.

Фигура 7.2 е минималната версия на цялото чертане на таблото: масив с три от услугите от урок 6 и цикъл, който превръща всяка в елемент. **Предскажи** какво ще каже редът за „Inventario“, която не е отговорила.

```html
<!-- fig07_02.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 7.2 — Dibujar una lista desde un arreglo</title>
</head>
<body>
  <main>
    <h1>Servicios</h1>
    <ul id="list"></ul>
  </main>

  <script type="module">
    const services = [
      { id: "catalog", name: "Catálogo", status: "available", responseMs: 120 },
      { id: "payments", name: "Pagos", status: "available", responseMs: 480 },
      { id: "inventory", name: "Inventario", status: "down", responseMs: null },
    ];

    const list = document.querySelector("#list");

    for (const service of services) {
      const item = document.createElement("li");                      // 1. crear el nodo
      item.textContent = service.responseMs === null                  // 2. su texto
        ? `${service.name}: sin respuesta`
        : `${service.name}: ${service.responseMs} ms`;
      list.append(item);                                              // 3. colgarlo del árbol
    }
  </script>
</body>
</html>
```

```text
Servicios
Catálogo: 120 ms
Pagos: 480 ms
Inventario: sin respuesta
```

Забележи какво *няма* в HTML: няма нито един `<li>`. Списъкът е празен във файла, а Инспекторът го показва пълен. И забележи нещо, което променя начина, по който мислиш: ако утре масивът има десет услуги или нула, кодът не се променя. **Чертането престава да зависи от това колко данни има.** Това е ползата от чертането от данните. Обърни внимание и на реда за Inventario: `null` от урок 6 не се появява като „null ms“, защото кодът решава какъв текст съответства на липсата на данна. Това решение е на чертането, не на данните.

`append` приема няколко аргумента наведнъж и приема и самотен текст, който превръща във възел за текст. `replaceChildren(...nodos)` е негов роднина за *повторно* чертане: изпразва контейнера и поставя новите възли с една стъпка. Трите точки са разпростирането, което видя в [Урок 6](06-javascript-datos.md) (раздел 6.2.6): разпределят елементите на един масив като самостоятелни аргументи. И двата са „Baseline widely available“ (широко достъпни в Baseline), тоест работят във всички съвременни браузъри от години; MDN документира [`append`](https://developer.mozilla.org/en-US/docs/Web/API/Element/append) и [`replaceChildren`](https://developer.mozilla.org/en-US/docs/Web/API/Element/replaceChildren) с таблицата им за съвместимост.

**Един ред на таблото, решение по решение.** Редът на таблицата е същата идея с повече части, и всяка част има причина. Това е функцията `createRow` от `js/view.js` с малката функция `label`, която използва:

```js
// Lista cerrada de estados que el panel conoce. Un valor que no esté aquí no llega a una clase.
const LABELS = { available: "Disponible", down: "Caído" };

function label(status) {
  return Object.hasOwn(LABELS, status) ? LABELS[status] : "Desconocido";
}

function createRow(service, isSelected) {
  const row = document.createElement("tr");
  if (isSelected) row.classList.add("selected");

  const nameCell = document.createElement("th");
  nameCell.scope = "row";
  nameCell.textContent = service.name;

  const statusCell = document.createElement("td");
  const badge = document.createElement("span");
  badge.className = Object.hasOwn(LABELS, service.status) ? `status status-${service.status}` : "status";
  badge.textContent = label(service.status);
  statusCell.append(badge);

  const timeCell = document.createElement("td");
  timeCell.className = "number";
  timeCell.textContent = service.responseMs === null ? "sin respuesta" : `${service.responseMs} ms`;

  const actionCell = document.createElement("td");
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.id = service.id;
  button.setAttribute("aria-pressed", String(isSelected));
  const hint = document.createElement("span");
  hint.className = "visually-hidden";
  hint.textContent = ` de ${service.name}`;
  button.append("Ver detalle", hint);
  actionCell.append(button);

  row.append(nameCell, statusCell, timeCell, actionCell);
  return row;
}
```

Чети я бавно, защото всеки ред отговаря на нещо, което вече си научил:

- **`th` с `scope = "row"` за името.** В урок 2 научи, че първата клетка на всеки ред е *заглавието на реда*: екранен четец, когато стигне до „480 ms“, може да каже „Pagos, Tiempo de respuesta (Време за отговор), 480 ms“. Ако от мързел начертаеш `td`, таблицата ще изглежда същата и ще престане да бъде разбираема за онзи, който не я вижда.
- **Значката използва затворен списък.** `LABELS` е обект с двете състояния, които таблото познава, `available` и `down`, и етикета, който се показва за всяко. `Object.hasOwn(LABELS, service.status)` пита дали състоянието е едно от тях и само тогава се използва като част от името на клас: `status status-available` или `status status-down`, същите класове, които урок 3 боядиса в зелено и червено. Данна отвън, която не е в списъка, не стига до класа и се показва като „Desconocido“ (Неизвестно), със значката без цвят, която урок 3 обяви за този случай. ([`Object.hasOwn`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn) е съвременният начин да попиташ „този ключ на обекта ли е?“ и е по-добър от гол `LABELS[status]`, защото състояние на име `"constructor"` би намерило функцията с това име, която всички обекти наследяват.)
- **„sin respuesta“ (без отговор) за `null`.** Да се покаже „null ms“ би било грубо към онзи, който чете. `null` е решение на данните; да се преведе на нещо четимо е работа на чертането, а текстът е същият, който ръчно написаната таблица казваше от урок 2.
- **Истински бутон на всеки ред.** Не кликаема клетка, не `div`: `<button type="button">`. Бутонът получава фокус с клавиша Tab и се активира с Enter и с интервала, **без да напишеш нито един ред**; един кликаем `div` не прави нито едното, нито другото, а поправянето на ръка е повече код и по-лош резултат. Първото правило на ARIA го казва така: ако съществува роден елемент с поведението, от което се нуждаеш, използвай го (развива го [Ръководството за практики при създаване на WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/)).
- **Скритият текст „de Pagos“ (на Pagos).** Пет бутона, които всички казват „Ver detalle“ (Виж подробности), са пет неразличими бутона за онзи, който навигира с глас или с екранен четец и може да поиска списъка с контролите на страницата. `<span class="visually-hidden">` добавя към достъпното име на всеки бутон името на услугата: „Ver detalle de Pagos“. Класът го маха от погледа, без да го маха от дървото за достъпност, и живее в `css/styles.css`.
- **`dataset.id`.** Атрибутите, които започват с `data-`, са място, което стандартът резервира за твои собствени данни. `button.dataset.id = "payments"` записва `data-id="payments"`. Това е `id`, което урок 6 отдели от името: името е онова, което се показва и може да се промени; `id` е онова, което идентифицира услугата. По-нататък ще го прочетеш обратно, за да разбереш *коя* услуга е поискал да види човекът. Атрибутът `data-` пази стойността си като текст и браузърът не я интерпретира, така че да запишеш там данна отвън не изпълнява нищо.
- **`classList`, `aria-pressed` и `String`.** `row.classList.add("selected")` добавя клас към онези, които елементът вече има, без да изтрива останалите (докато присвояването на `className` ги заменя всичките). `aria-pressed` е атрибут за достъпност, който превръща бутона в *бутон за превключване*: екранният четец обявява дали е натиснат, или не, а стиловият лист го използва, за да го отбележи. Атрибутите винаги пазят текст, затова `String(isSelected)` превръща булевата стойност `true` или `false` в текста `"true"` или `"false"`, преди да я запише.
- **`setAttribute` не чисти нищо.** Безопасен е *за тези два атрибута*, `data-id` и `aria-pressed`, защото браузърът никога не ги изпълнява. Но `setAttribute` записва стойността такава, каквато е, в атрибута, който му кажеш, а някои атрибути са код: `button.setAttribute("onclick", texto)` превръща този текст в програма, която се изпълнява при щракване, а `href` или `src` на `<iframe>` приемат адреси `javascript:`. MDN предупреждава за това в раздела за сигурност на [`setAttribute`](https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute). Правилото: данна отвън отива само в атрибути, които не се изпълняват, и никога в такъв, който започва с `on`.

**Правилото, което се побира в един ред: текстът отвън влиза с `textContent`.** Дотук използваше `textContent`, без да ти казвам защо. Време е да видиш защо има значение, а най-добрият начин е да го счупиш нарочно.

Съществува друго свойство, което изглежда прави същото: `innerHTML`. Много си приличат. Но има основна разлика: `textContent` третира онова, което му даваш, **като текст**; `innerHTML` го третира **като HTML код** и го интерпретира, както когато браузърът чете файл. С име като „Catálogo“ двете дават същия резултат. С име като `<b>Catálogo</b>` вече не: едното слага удебелени букви, а другото показва знаците `<b>` такива, каквито са.

Това не би било сериозно, ако данните винаги бяха твои. Но `revisor` съществува, за да показва онова, което *докладват други*: името на услуга, съобщение за грешка, описание. Днес те са във файла ти `js/services.js`; в урок 8 ще пристигнат по мрежата, а в 10 ще ги пише човек във форма. Щом един текст се контролира от някой, който не си ти, той е **данна отвън** и трябва да се третира така, като че ли може да е враждебна.

Ето атаката, която се нарича **XSS** (*cross-site scripting*, междусайтово скриптиране): данна отвън, която съдържа HTML с активен код, и страница, която я интерпретира. Това е един от най-честите пропуски в сигурността на уеба, а [OWASP](https://top10.owasp.org/2025/A05_2025-Injection/) я класифицира сред инжекциите в списъка си от 2025 г. Фигура 7.3 е **несигурната** версия на чертането на списъка. **Предскажи**, преди да я отвориш: третото име е `<img src="x" onerror="document.title = '...'">`, което е картинка, чийто адрес (`x`) не съществува. Какво мислиш, че ще се види в списъка и какво ще стане със заглавието на раздела?

```html
<!-- fig07_03.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 7.3 — innerHTML con un dato de fuera (INSEGURO)</title>
</head>
<body>
  <main>
    <h1>Servicios (versión insegura, solo para ver el problema)</h1>
    <ul id="list"></ul>
  </main>

  <script type="module">
    // El tercer nombre lo escribió otra persona, no tú. Es un dato de fuera.
    const services = [
      { name: "Catálogo" },
      { name: "Pagos" },
      { name: `<img src="x" onerror="document.title = 'Se ejecutó código que venía en un dato'">` },
    ];

    const list = document.querySelector("#list");
    for (const service of services) {
      const item = document.createElement("li");
      item.innerHTML = service.name;   // <-- el navegador INTERPRETA el texto como HTML
      list.append(item);
    }
  </script>
</body>
</html>
```

```text
Lista visible:
• Catálogo
• Pagos
• 

Título de la pestaña (lo cambió el dato): Se ejecutó código que venía en un dato
```

Списъкът не показва нищо на третия ред и **разделът смени заглавието си**. Нямаше програма, която да го казва: каза го една данна. Браузърът създаде картинката, опита да зареди `x`, не успя, задейства събитието за грешка на картинката и изпълни кода, който идваше вътре в атрибута `onerror`. Днес този код сменя заглавие, което е безобидно. Но е **какъв да е код**, със същите права като твоя: може да чете онова, което страницата показва, може да иска информация от сървъра със сесията на онзи, който гледа, може да променя онова, което се вижда, за да заблуди. Онзи, който е написал данната, не е имал нужда да влиза в сървъра, нито да познава кода ти; имал е нужда само страницата ти да я начертае с `innerHTML`.

Често объркване: „Щом `innerHTML` блокира `<script>`, вече съм защитен“. Вярно е, че `<script>`, вмъкнат с `innerHTML`, **не се изпълнява**, и затова много уроци казват, че е безопасно. Но фигура 7.3 току-що показа, че не е нужен `<script>`: атрибут за събитие върху картинка е достатъчен. MDN предупреждава за това на страницата си за [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML), със същия този пример с `onerror`.

Фигура 7.4 е идентична **с изключение на един ред**: използва `textContent`.

```html
<!-- fig07_04.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 7.4 — textContent con un dato de fuera</title>
</head>
<body>
  <main>
    <h1>Servicios (versión segura)</h1>
    <ul id="list"></ul>
  </main>

  <script type="module">
    // El tercer nombre lo escribió otra persona, no tú. Es un dato de fuera.
    const services = [
      { name: "Catálogo" },
      { name: "Pagos" },
      { name: `<img src="x" onerror="document.title = 'Se ejecutó código que venía en un dato'">` },
    ];

    const list = document.querySelector("#list");
    for (const service of services) {
      const item = document.createElement("li");
      item.textContent = service.name;  // <-- el navegador lo trata SIEMPRE como texto
      list.append(item);
    }
  </script>
</body>
</html>
```

```text
Lista visible:
• Catálogo
• Pagos
• <img src="x" onerror="document.title = 'Se ejecutó código que venía en un dato'">

Título de la pestaña: Fig. 7.4 — textContent con un dato de fuera
```

Третият ред вече показва текста на атаката, цял и видим, а заглавието на раздела остава онова, което ти си написал. Картинката никога не е създадена: браузърът не е прочел `<img` като таг, защото на `textContent` не му е важно на какво прилича. В Инспектора ще видиш, че HTML е записал `&lt;img…&gt;`: знаците са били *екранирани*, тоест заменени с текстовото си представяне.

Това е правилото: **всеки текст, който не си написал ти, влиза в документа с `textContent`**. И с него вървят други от същото семейство, които OWASP събира в своя [лист за XSS в DOM](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html) като „опасни приемници“ (*sinks*), места, където една данна се превръща в код:

- `innerHTML`, `outerHTML` и `insertAdjacentHTML`: интерпретират HTML.
- `document.write`: същото, и то по толкова непохватен начин, че вече не се преподава.
- `eval(texto)` и `setTimeout("texto", …)` с низ: изпълняват текст като програма.
- Атрибутите за събитие, написани в HTML (`onclick="..."`, `onerror="..."`): са код във вид на текст.
- Присвояване на данна към `href` на връзка (или към `src` на `<iframe>`), без да провериш откъде идва: адрес, който започва с `javascript:`, изпълнява код, когато се последва връзката или се зареди рамката. MDN обяснява, че това става на места, където се *навигира*, не там, където само се изтегля ресурс, като `src` на картинка ([схемата `javascript:`](https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/javascript)). В днешното табло няма връзки с данни отвън, но щом има една, адресът първо се валидира.

Кога е приемлив `innerHTML`? Когато даваш на него фиксиран текст, който си написал ти, без нито едно парче, което идва от данна. Въпреки това здравият навик е да не го имаш: ред с `innerHTML`, който днес е безопасен, три месеца по-късно се превръща в несигурен ред, когато някой му залепи променлива. Ако никога не го използваш, това превръщане не може да се случи, а прегледът на кода е да потърсиш думата и да провериш, че я няма. Затова един от петте критерия, по които разбираш, че си завършил курса, е: *текстът, който идва отвън, се чертае с `textContent`, никога с `innerHTML`*.

> **Какво предстои и още не се използва.** Съществуват два по-нови механизма за същия проблем. Първият са *Trusted Types* (доверени типове), които карат браузъра да откаже да приеме низ в опасен приемник; според [web.dev](https://web.dev/articles/trusted-types) основните браузъри го поддържат едва от 2026 г., и затова още е „скорошно“. Вторият е `Element.setHTML()`, заедно с API-то *Sanitizer*, което чисти HTML, преди да го вмъкне, и което MDN още маркира като „не Baseline“. Никой от двата не заменя навика да използваш `textContent`, и този курс не ги използва в таблото: преподава само онова, което вече работи във всички браузъри. В урок 11 ще видиш другата мрежа за сигурност, която наистина е във всички: политиката за сигурност на съдържанието (CSP), която е втори слой и **не замества** първия.

### 7.2 Събитията: как страницата научава, че някой е направил нещо

**Събитието е известие.** Когато някой натисне бутон, помръдне мишката, натисне клавиш или приключи зареждането на картинка, браузърът го отбелязва като **събитие** и го съобщава на онзи, който го е поискал. Онзи, който го иска, е твоят код, и го прави така:

```js
element.addEventListener("click", handler);
```

Казано на български: „когато настъпи `click` върху този елемент, изпълни тази функция“. Функцията се нарича **слушател** (*listener*) или обработчик. Три подробности, в които почти всички начинаещи се препъват:

1. **Подава се функцията, не се извиква.** `addEventListener("click", onClick)` предава функцията, за да я изпълни браузърът, когато настъпи щракването. Ако напишеш `onClick()` със скоби, я изпълняваш *още сега*, веднъж, и предаваш на браузъра онова, което това извикване е върнало (обикновено `undefined`). Щракването няма да прави нищо и няма да има никаква грешка.
2. **Браузърът предава на функцията обект с подробностите**, обекта на събитието, който по навик се казва `event`. Най-полезните му свойства: `event.type` (какъв вид събитие е било), `event.target` (елементът, където *е станало*) и `event.currentTarget` (елементът, където *е поставен слушателят*). Фигура 7.5 ги използва заедно с [`localName`](https://developer.mozilla.org/en-US/docs/Web/API/Element/localName), свойство, което има всеки елемент и което дава името на тага му с малки букви: за `<button>` — текстът `"button"`. Служи, за да каже страницата *какъв вид* елемент е получил събитието.
3. **Правилният елемент дава клавиатурата безплатно.** Бутонът получава щракването с мишка, с докосване на екрана, с Enter и с интервала; всичко това пристига като едно и също събитие `click`. Ако беше използвал `div`, трябваше сам да напишеш поддръжката на клавиатурата.

**Предскажи:** какво ще каже абзацът след две щраквания върху бутона?

```html
<!-- fig07_05.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 7.5 — Escuchar un clic</title>
  <style>
    /* Un blanco cómodo para el dedo o el mouse: WCAG 2.2 pide al menos 24 × 24 px; aquí mide 44. */
    button { min-height: 2.75rem; padding: 0.5rem 0.75rem; }
  </style>
</head>
<body>
  <main>
    <h1>Un botón y un contador</h1>
    <button type="button" id="counter">Contar un clic</button>
    <p id="result" role="status">Todavía no hay clics.</p>
  </main>

  <script type="module">
    const button = document.querySelector("#counter");
    const result = document.querySelector("#result");
    let clicks = 0;

    function onClick(event) {
      clicks += 1;
      result.textContent = `Clics: ${clicks}. Tipo de evento: ${event.type}. Lo recibió: <${event.currentTarget.localName}>.`;
    }

    button.addEventListener("click", onClick);   // pasa la función, NO la llama (sin paréntesis)
  </script>
</body>
</html>
```

```text
Tras dos clics:
Clics: 2. Tipo de evento: click. Lo recibió: <button>.
```

Две наблюдения, които ще ти послужат в таблото. Първото: променливата `clicks` живее *извън* функцията и затова оцелява от едно щракване до следващото; да пазиш „онова, което е станало дотук“ извън слушателя е зародишът на онова, което в 7.3 се нарича състояние. Второто: абзацът има `role="status"`, което го прави **жив регион**: когато съдържанието му се промени, екранният четец го обявява, без човекът да трябва да го търси. Това е правилният начин да се съобщи, че „нещо се е променило“, без да се мести фокусът; златното правило на живите региони е да **съществуват от самото начало, празни или с началния си текст**, и да се променя само съдържанието им.

**Събитията се изкачват.** Ако щракнеш върху бутон, който е в клетка, която е в ред, който е в тялото на таблицата, на кого е станало щракването? На всички. Браузърът предава събитието първо на бутона и после **го изкачва** по дървото: към клетката, към реда, към тялото, към таблицата, към `body`, до `document`. Това се нарича **изплуване** (*bubbling*) и е описано в [стандарта DOM](https://dom.spec.whatwg.org/#dispatching-events) и обяснено стъпка по стъпка в [MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling). Докато се изкачва, `event.target` не се променя (остава най-вътрешният елемент, където е щракнато), а `event.currentTarget` се сменя (винаги е елементът, чийто слушател се изпълнява в момента).

Изплуването позволява техника, която ще използваш в почти всяка програма със списъци: **делегиране на събития**. Вместо да поставяш слушател на всеки бутон, поставяш **един-единствен** на контейнера, и когато събитието се изкачи, питаш откъде е дошло. Защо е по-добре тук?

- **Таблото чертае редовете си наново** (ще го видиш в 7.3). Старите бутони се изхвърлят и се създават нови бутони; слушател, поставен на стар бутон, отива на боклука заедно с него. Контейнерът, `<tbody>`, никога не се изхвърля и слушателят му остава.
- **С 6 реда или с 600 цената е същата:** един слушател.
- **Услугите, които пристигнат по-късно** (в урок 8 таблицата се пълни след мрежова заявка), са покрити, без да правиш нищо.

Има уловка и се казва иконата в бутона. Ако бутонът съдържа друг елемент, като `<span>` със символ, щракването може да падне върху `span` и тогава `event.target` е `span`, не бутонът. Наивен код, който пита `if (event.target === button)`, ще спре да работи, щом дизайнерът добави икона. Решението е `event.target.closest("button[data-name]")`: **`closest`** се изкачва от елемента по предците му и връща първия, който съвпада със селектора (започвайки от самия елемент), или `null`, ако няма такъв ([MDN: `closest`](https://developer.mozilla.org/en-US/docs/Web/API/Element/closest)). Фигура 7.6 го показва, като нарочно щраква върху иконата.

```html
<!-- fig07_06.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 7.6 — Un solo oyente para muchos botones</title>
  <style>
    /* Un blanco cómodo para el dedo o el mouse: WCAG 2.2 pide al menos 24 × 24 px; aquí mide 44. */
    button { min-height: 2.75rem; padding: 0.5rem 0.75rem; }
  </style>
</head>
<body>
  <main>
    <h1>Delegación de eventos</h1>
    <ul id="list"></ul>
    <p id="result" role="status">Ningún botón presionado.</p>
  </main>

  <script type="module">
    const names = ["Catálogo", "Pagos", "Inventario"];
    const list = document.querySelector("#list");
    const result = document.querySelector("#result");

    for (const name of names) {
      const item = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.name = name;                     // guarda el nombre en data-name
      const icon = document.createElement("span");    // un elemento DENTRO del botón
      icon.textContent = "▶ ";
      button.append(icon, `Ver ${name}`);
      item.append(button);
      list.append(item);
    }

    // UN solo oyente, en el contenedor. Los clics de todos los botones suben hasta aquí.
    list.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-name]");
      if (button === null) return;                    // el clic no fue en un botón
      result.textContent = `Presionaste: ${button.dataset.name} (target: <${event.target.localName}>)`;
    });
  </script>
</body>
</html>
```

```text
Tras hacer clic sobre el ícono del botón «Ver Pagos»:
Presionaste: Pagos (target: <span>)
```

Виж изхода: `target` беше `<span>`, но `closest` намери бутона и неговото `dataset.name` каза „Pagos“. И виж реда `if (button === null) return;`: слушателят е върху целия списък, така че получава и щракванията, които падат в пространството между бутоните, и те трябва да се игнорират. Това е първата инструкция на всеки делегиран слушател.

Една граница, която си струва да знаеш: не всички събития се изкачват. `focus` и `blur`, например, не изплуват (роднините им `focusin` и `focusout` изплуват). За щракванията и клавишите, които са онези, които ще използваш в този курс, делегирането работи без трикове.

### 7.3 Състоянието и разделянето, което избягва кълбото

**Какво е състоянието.** **Състоянието** на едно приложение е **онова, което помни в този момент**. В таблото са три неща: списъкът с услуги, дали е подреден по време за отговор или не, и коя услуга е избрана (или никоя). Обърни внимание, че не казах „онова, което се вижда“: онова, което се вижда, е *следствие* от състоянието. Идеята, която подрежда всичко останало, е, че **екранът е функция на състоянието**: пише се функция `render(state)`, която по дадено състояние поставя в документа онова, което съответства, и всеки път, когато нещо се промени, се променя състоянието и `render` се извиква отново.

Кълбото, което тази идея избягва, изглежда така. Начинаещият програмист решава „подреди“ с `if (button.textContent === "Ordenar por tiempo")` (Подреди по време): пита *документа* в каква ситуация е таблото. Работи, докато някой смени текста на бутона или го преведе, или добави друг бутон, който също трябва да знае дали е подредено. Тогава истината живее на три места (масивът, текстът на бутона, редът на редовете на екрана) и трябва да се поддържат съгласувани на ръка. Това е същият проблем с двете копия, с който започна урокът, само че сега вътре в самия код. С явно състояние истината живее в **един** обект, а всичко останало се изчислява.

**Три файла, три отговорности.** Таблото се разделя така:

| Файл | Отговорност | Пипа ли документа? |
|---|---|---|
| `js/state.js` | Какво помни таблото и единствените начини да го променяш | Не |
| `js/view.js` | Чертае едно състояние в документа | Да, само за да пише |
| `js/main.js` | Събира частите: слуша събития, променя състоянието, иска чертане | Да, за да слуша |

Събитията, чертането и всичко, което *прави нещо със света*, се наричат **ефекти**: отделят се от състоянието, защото са трудното за тестване и за разсъждаване. Състоянието, напротив, са обикновени обекти и функции, които можеш да провериш, без да отваряш страница. Това е целият `js/state.js`:

```js
// panel/js/state.js
// El estado del panel y las únicas formas de cambiarlo.
// No toca el documento: por eso se puede probar sin pantalla.

export function createState(services) {
  return {
    services,           // los datos
    sortByTime: false,  // false = en el orden original; true = del más rápido al más lento
    selected: null,     // el id del servicio elegido, o null
  };
}

export function toggleSort(state) {
  state.sortByTime = !state.sortByTime;
}

// Elegir el que ya estaba elegido lo deselecciona.
export function select(state, id) {
  state.selected = state.selected === id ? null : id;
}

// Lo que se debe mostrar, calculado a partir del estado cada vez.
// toSorted devuelve una copia ordenada: el arreglo de los datos no se toca.
export function visible(state) {
  if (!state.sortByTime) {
    return state.services;
  }
  // Los que no tienen medida (null) van al final.
  return state.services.toSorted((a, b) => (a.responseMs ?? Infinity) - (b.responseMs ?? Infinity));
}

export function selectedService(state) {
  return state.services.find((service) => service.id === state.selected) ?? null;
}
```

Спри се на `visible`. Връща **онова, което трябва да се покаже**, и го изчислява от състоянието всеки път: ако `sortByTime` е истина, подрежда; ако не, връща списъка такъв, какъвто е пристигнал. Има две подробности, които имат значение. Първата е `toSorted`, който познаваш от урок 6: връща подредено **копие** и оставя непокътнат масива с данните. Ако използваше `sort`, който подрежда масива, върху който се извиква, завинаги би загубил реда на пристигане и бутонът „Ordenar“ нямаше да има към какво да се върне. Втората е `a.responseMs ?? Infinity`: операторът `??` замества `null` със стойността отдясно, така че услуга без измерване се счита за безкрайно бавна и отива накрая. (`??` реагира само на `null` и `undefined`; `||`, напротив, би третирал нулата като „липсва“. Време нула би било подозрително, но не е същото като да нямаш измерване.)

**Предимството на разделянето се вижда в тест без екран.** Тъй като `js/state.js` не пипа документа, може да се провери с почти празна страница, `state-test.html`, която импортира данните и модула за състоянието и проверява шест факта. Всяка проверка е един ред: описание и условие, което трябва да е вярно.

```html
<!-- panel/state-test.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Prueba del estado (sin dibujar nada del panel)</title>
</head>
<body>
  <main>
    <h1>Prueba del estado</h1>
    <pre id="output"></pre>
  </main>
  <script type="module">
    import { services } from "./js/services.js";
    import { createState, toggleSort, select, visible } from "./js/state.js";

    const lines = [];
    function check(description, condition) {
      lines.push(`${condition ? "ok    " : "FALLA "} ${description}`);
    }
    const names = (list) => list.map((service) => service.name).join(", ");

    const state = createState(services);
    check("al inicio se ve el orden original", names(visible(state)) === "Catálogo, Pagos, Inventario, Notificaciones, Búsqueda");

    toggleSort(state);
    check("ordenado: del más rápido al más lento", names(visible(state)) === "Catálogo, Notificaciones, Pagos, Búsqueda, Inventario");
    check("ordenado: el que no tiene medida va al final (Inventario)", visible(state).at(-1).name === "Inventario");
    check("ordenar no cambia el arreglo original", names(state.services) === "Catálogo, Pagos, Inventario, Notificaciones, Búsqueda");

    select(state, "payments");
    check("seleccionar guarda el id", state.selected === "payments");
    select(state, "payments");
    check("seleccionar el mismo otra vez lo deselecciona", state.selected === null);

    document.querySelector("#output").textContent = lines.join("\n");
  </script>
</body>
</html>
```

Отвори я със сървъра си на `…/07-dom-eventos-estado/panel/state-test.html`:

```text
Prueba del estado
ok     al inicio se ve el orden original
ok     ordenado: del más rápido al más lento
ok     ordenado: el que no tiene medida va al final (Inventario)
ok     ordenar no cambia el arreglo original
ok     seleccionar guarda el id
ok     seleccionar el mismo otra vez lo deselecciona
```

Ако промениш `visible`, за да използва `sort` вместо `toSorted`, проверката `ordenar no cambia el arreglo original` (подреждането не променя оригиналния масив) става `FALLA` (ПРОВАЛЯ). Направи го, виж го в червено и върни промяната: така знаеш, че тестът наистина пази нещо. Обърни внимание защо втората проверка гледа целия ред, а не само първия: Catálogo вече беше най-бързата и първата в списъка, така че „първата е Catálogo“ би било изпълнено, дори подреждането да не правеше нищо. Тест, който не може да се провали, не доказва нищо.

**Чертането.** С отделеното състояние `render` излиза кратко и повтарящо се, което е точно онова, което искаме. Това е целият `js/view.js`; вече познаваш `createRow` и `label`, а новото са `describe`, която сглобява изречението за подробностите (`toLowerCase()` връща текста с малки букви: „Disponible“ става „disponible“ в средата на изречението), и функцията `render` в края:

```js
// panel/js/view.js
// Dibuja el estado en el documento. Todo texto de los datos entra con textContent.
import { summarize } from "./stats.js";
import { visible, selectedService } from "./state.js";

// Lista cerrada de estados que el panel conoce. Un valor que no esté aquí no llega a una clase.
const LABELS = { available: "Disponible", down: "Caído" };

function label(status) {
  return Object.hasOwn(LABELS, status) ? LABELS[status] : "Desconocido";
}

function createRow(service, isSelected) {
  const row = document.createElement("tr");
  if (isSelected) row.classList.add("selected");

  const nameCell = document.createElement("th");
  nameCell.scope = "row";
  nameCell.textContent = service.name;

  const statusCell = document.createElement("td");
  const badge = document.createElement("span");
  badge.className = Object.hasOwn(LABELS, service.status) ? `status status-${service.status}` : "status";
  badge.textContent = label(service.status);
  statusCell.append(badge);

  const timeCell = document.createElement("td");
  timeCell.className = "number";
  timeCell.textContent = service.responseMs === null ? "sin respuesta" : `${service.responseMs} ms`;

  const actionCell = document.createElement("td");
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.id = service.id;
  button.setAttribute("aria-pressed", String(isSelected));
  const hint = document.createElement("span");
  hint.className = "visually-hidden";
  hint.textContent = ` de ${service.name}`;
  button.append("Ver detalle", hint);
  actionCell.append(button);

  row.append(nameCell, statusCell, timeCell, actionCell);
  return row;
}

function describe(service) {
  const time = service.responseMs === null ? "sin respuesta" : `responde en ${service.responseMs} ms`;
  return `${service.name}: ${label(service.status).toLowerCase()}, ${time}.`;
}

// elements = { total, available, down, average, body, detail, sortButton }
export function render(state, elements) {
  const { services } = state;
  const summary = summarize(services);
  elements.total.textContent = String(services.length);
  elements.available.textContent = `${summary.available} de ${services.length}`;
  elements.down.textContent = String(summary.down);
  elements.average.textContent = summary.averageMs === null ? "sin datos" : `${summary.averageMs} ms`;

  elements.sortButton.setAttribute("aria-pressed", String(state.sortByTime));

  const rows = visible(state).map((service) => createRow(service, service.id === state.selected));
  elements.body.replaceChildren(...rows);

  const chosen = selectedService(state);
  elements.detail.textContent = chosen === null ? "Elige un servicio para ver su detalle." : describe(chosen);
}
```

Виж първите редове на `render`: обобщението, което написа на ръка в урок 2, сега го записва `summarize`, функцията от урок 6, в четирите `<dd>` на `<dl>`. Числата са същите; разликата е, че вече не ги смяташ ти и че в деня, когато една услуга се промени, те се променят сами.

Забележи, че `render` получава състоянието и обект с елементите на документа, от които се нуждае (`elements`). Не ги търси тя: подават ѝ се. Така `js/view.js` не зависи от това как се казва някой `id` в твоя HTML и същият код върши работа за тест с въображаеми елементи.

Забележи и колко текст влиза в документа и откъде: обобщението, името, състоянието, времето и подробностите. **Всички влизат с `textContent`.** `revisor` не използва `innerHTML` нито веднъж. Числата и състоянието на една услуга са данни отвън, дори днес да живеят във файла ти.

**Цената на повторното чертане на всичко.** `replaceChildren` изхвърля всички редове и поставя нови. Просто е, достатъчно бързо е за пет реда или за петстотин и има ефект, който трябва да разбереш, защото засяга онзи, който използва клавиатурата: **бутонът, който е имал фокуса, изчезва**. Ако човек навигира с Tab до „Ver detalle de Pagos“ и натисне Enter, таблото се чертае наново, старият бутон се изхвърля и фокусът пада върху `body`: човекът трябва да обходи отново цялата страница отгоре, за да продължи. Това е недостатък в достъпността, който не се вижда с мишка и затова никой не го забелязва, докато някой не го докладва. Да го изпробваш с клавиатурата, както изисква заключителният критерий на курса, е онова, което го открива.

Решението е в `main.js`. Преди да се промени състоянието, се отбелязва `id` на услугата, чийто бутон има фокуса (`document.activeElement` е фокусираният елемент, а неговото `dataset.id` е услугата); променя се състоянието; чертае се; и фокусът се връща на новия бутон, който има същото `data-id`. За да се сглоби селекторът, се използва `CSS.escape`, който пази `id` от знаци със значение в селектор, като кавички или квадратни скоби: `id` пристигат с данните, от урок 8 ще пристигат по мрежата, а такова като `pagos"norte` би счупило селектор, сглобен на ръка ([MDN: `CSS.escape`](https://developer.mozilla.org/en-US/docs/Web/API/CSS/escape_static)). Това е целият `js/main.js`. Замества онзи от урок 6, който само пишеше в конзолата:

```js
// panel/js/main.js
// Junta las piezas: crea el estado, escucha eventos y vuelve a dibujar.
import { services } from "./services.js";
import { createState, toggleSort, select } from "./state.js";
import { render } from "./view.js";

const elements = {
  total: document.querySelector("#summary-total"),
  available: document.querySelector("#summary-available"),
  down: document.querySelector("#summary-down"),
  average: document.querySelector("#summary-average"),
  body: document.querySelector("#services-body"),
  detail: document.querySelector("#detail"),
  sortButton: document.querySelector("#sort"),
};

const state = createState(services);

// Cambiar el estado y dibujar. Al volver a dibujar las filas, el botón que tenía el foco
// desaparece y aparece otro igual: hay que devolverle el foco a quien lo tenía.
function update(change) {
  const focusedId = document.activeElement?.dataset?.id;
  change();
  render(state, elements);
  if (focusedId !== undefined) {
    elements.body.querySelector(`button[data-id="${CSS.escape(focusedId)}"]`)?.focus();
  }
}

elements.sortButton.addEventListener("click", () => update(() => toggleSort(state)));

// Delegación: un solo oyente en el <tbody> atiende los botones de todas las filas.
elements.body.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-id]");
  if (button === null) return;
  update(() => select(state, button.dataset.id));
});

render(state, elements);
```

И HTML. Това е `index.html`, който носеше, с малки промени, и никоя от тях не засяга значението: четирите `<dd>` на обобщението губят числата си, написани на ръка, и получават `id`; `<tbody>` губи петте си реда и получава свой, `services-body`; таблицата получава четвърта колона, „Acción“ (Действие), а заглавието на колоната с времената получава класа `number`; лентата с контроли получава бутона „Ordenar por tiempo de respuesta“ (Подреди по време за отговор) с неговия `aria-pressed`; и под таблицата се появява `#detail`, празен жив регион. Полето за търсене и радио бутоните си стоят там, без да правят нищо (свързва ги урок 10), както и „Revisar ahora“ (свързва го урок 8). А „Última revisión“ (Последна проверка) в заглавната част си остава написана на ръка: ще стане истинска, когато данните наистина пристигнат, в урок 8.

```html
<!-- panel/index.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Revisor de servicios</title>
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="css/styles.css">
  <script type="module" src="js/main.js"></script>
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
        <p><button type="button" id="sort" aria-pressed="false">Ordenar por tiempo de respuesta</button></p>
      </div>

      <div class="table-scroll" role="region" aria-labelledby="table-caption" tabindex="0">
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
    </section>
  </main>

  <footer>
    <p>Datos de ejemplo escritos a mano.</p>
  </footer>
</body>
</html>
```

Накрая, стиловият лист. `css/styles.css` е този от урок 5 с една промяна и един нов блок. Промяната: правилото от урок 3, което подравняваше вдясно времената, сочеше към `th:last-child, td:last-child`, последната клетка на всеки ред. С колоната „Acción“ последната клетка вече не е тази с времената, затова правилото започва да сочи към клас, `.number`, който `createRow` слага на клетката с времето, а HTML на заглавието ѝ. Селектор, който зависи от позицията, се чупи, щом някой добави колона; такъв с име не се чупи. Новият блок е в края на файла и **отваря наново** слоя `components`: слой може да се отваря толкова пъти, колкото е нужно, и онова, което се добавя, се прибавя към онова, което вече е имал, по ред.

```css
@layer components {
  /* ---- Lección 7: la tabla que se dibuja desde los datos ---- */
  :root {
    --color-selected: #dbe9f8;
  }

  /* La fila del servicio elegido. */
  tr.selected {
    background: var(--color-selected);
  }

  /* Un botón que está «presionado» (aria-pressed="true") se distingue de los demás. */
  button[aria-pressed="true"] {
    background: var(--color-text);
  }

  /* Fuera de la vista, pero dentro del árbol de accesibilidad: lo lee un lector de pantalla. */
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  /* Un elemento con position: absolute se coloca respecto de su ancestro posicionado más
     cercano. Sin esta regla, el texto oculto de los botones escapa de la caja que se desplaza
     y ensancha la página entera a 320 px. */
  .table-scroll {
    position: relative;
  }
}
```

Новият цвят се декларира като променлива в `:root`, както изисква урок 3: останалата част от стиловия лист не пише отделни цветове. А последното правило има история. Когато изпробвах таблото на 320 пиксела без него, страницата отново преля: беше широка 498 px. Виновна не беше таблицата, която си остава в кутията си, а скритият текст на бутоните. Елемент с `position: absolute` се разполага спрямо най-близкия си *позициониран* предшественик, а ако няма такъв, спрямо цялата страница; така той излизаше от кутията, която се превърта, и разтягаше документа. С `position: relative` на `.table-scroll` кутията става този предшественик, скритият текст остава вътре и измерването се връща на 320. Това е вид недостатък, който открива само онзи, който мери на 320 пиксела след всяка промяна, не само в урока за подредбата.

**Направи пълната проверка.** Отвори таблото. Обобщението трябва да казва 5 проверени услуги, 4 от 5 налични, 1 паднала и 465 ms средно време за отговор: числата, които написа на ръка в урок 2, сега изчислени от функциите на урок 6 и записани от тези на този. Щракни върху „Ordenar por tiempo de respuesta“: „Notificaciones“ се качва на второ място, след „Catálogo“, която вече беше най-бързата, а „Inventario“, която не е отговорила, отива на последно. Сега **без да докосваш мишката**: натискай Tab, докато стигнеш до бутон „Ver detalle“, натисни Enter и провери, че подробностите се появяват отдолу и че фокусът остава на същия този бутон. Това е поведението, което този урок пази.

**Една последна проверка за сигурност.** Добави в `js/services.js` услуга, с нейния `id`, чието `name` е `<img src="x" onerror="document.title = 'hackeado'">`, презареди и забележи, че таблицата показва този текст, и нищо повече, а заглавието на раздела не се променя. Това е разликата между табло, което чертае данни, и такова, което ги изпълнява. Махни реда, когато свършиш.

## Грешката, която ще видиш

Най-честата грешка на онзи, който започва с DOM, е да напише програмата **преди** да съществува елементът, който търси. Фигура 7.7 я предизвиква нарочно, с обикновен `<script>` (не модул) в `<head>`:

```html
<!-- fig07_07.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 7.7 — El script corre antes que el documento (ERROR A PROPÓSITO)</title>
  <!-- Un script CLÁSICO en el <head>, sin defer: se ejecuta en cuanto el navegador lo lee. -->
  <script>
    document.querySelector("#message").textContent = "Hola";
  </script>
</head>
<body>
  <main>
    <p id="message">Esperando…</p>
  </main>
</body>
</html>
```

Отвори я, отвори конзолата с `F12` и ще видиш това:

```text
Consola de Chrome:
Uncaught TypeError: Cannot set properties of null (setting 'textContent')

Consola de Firefox:
TypeError: document.querySelector(...) is null

La página se queda con «Esperando…».
```

Съобщението казва, преведено: „Не може да се запише свойството `textContent` на `null`“. Това е верига от причини:

1. Обикновеният `<script>` се изпълнява **в мига, в който браузърът го прочете**. Тъй като е в `<head>`, браузърът още не е изградил `<body>`.
2. `document.querySelector("#message")` търси елемент, който още не съществува, и връща `null`, отговорът „не намерих нищо“.
3. `null.textContent = "Hola"` е невъзможна операция, защото `null` няма свойства. JavaScript спира там.

Има три начина да се поправи и най-добрият е онзи, който вече използваш: **`<script type="module">`**, който се отлага сам, тоест изпълнява се, когато документът вече е прочетен ([MDN: елементът `script`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script)). Другите са да добавиш `defer` към обикновен скрипт или да поставиш скрипта в края на `<body>`. Предпочети модула: освен това дава на променливите ти собствена област на видимост (не замърсяват глобалното пространство) и включва строгия режим, без да го искаш.

Когато съобщението е същото, но скриптът *е* в модул, причината е друга: грешно написан селектор (`#mesage` вместо `#message`) или търсене в грешната страница. **Чети съобщението отдясно наляво**: кое извикване върна `null`? Сложи `console.log(document.querySelector("#message"))` точно преди реда, който се проваля; ако отпечата `null`, проблемът е селекторът или моментът, а не онова, което правиш после с него.

## Какво се прави погрешно

- **Да запишеш данна отвън с `innerHTML`.** Цената е атаката, която видя във фигура 7.3: който контролира един текст, контролира страницата ти. Поправя се с `textContent` и с нищо друго; да екранираш на ръка знаците `<` и `>` е рецептата на всички пропуски, които са били поправяни един по един в продължение на двайсет години.
- **Да оставиш `onclick="..."` в HTML.** Това е код, написан в атрибут: смесва структурата с поведението, може да сочи само към глобални функции (а модулите нямат такива) и, както ще видиш в урок 11, строга политика за сигурност го блокира изцяло. Пише се `addEventListener` в JavaScript.
- **`div` или `span` с щракване вместо `button`.** Изглежда същото и не се достига с Tab, нито се активира с Enter. За да се поправи, са нужни `tabindex`, `role` и два обработчика за клавиатурата, и въпреки това остава по-лошо от родния бутон.
- **Да питаш документа какво е състоянието.** `if (boton.textContent === …)` превръща екрана в източник на истината. Двете копия си противоречат, щом се промени текстът. Истината живее в обекта на състоянието.
- **Нов слушател при всяко чертане, върху елемент, който не се изхвърля.** Ако в `render` напишеш `elements.body.addEventListener(...)`, всеки път, когато се чертае наново, към същия `<tbody>` ще се прибавя **още един** слушател и при второто щракване подробностите ще бъдат избрани и отменени два пъти. Слушателите се регистрират **веднъж**, в `main.js`, не в чертането.
- **Да променяш оригиналния масив при подреждане.** `services.sort(...)` променя масива с данните и първоначалният ред се губи. Използва се `toSorted`, който връща копие.
- **Да четеш размери от документа, докато го пишеш.** Да добавяш редовете един по един сам по себе си не е скъпо: браузърът изчаква кодът ти да свърши и изчислява позицията на всичко само веднъж, преди да нарисува. Скъпо е да редуваш четене на размери (`offsetHeight`, `getBoundingClientRect()`) между запис и запис, защото всяко четене го принуждава да преизчислява в този миг; web.dev го нарича [*layout thrashing*](https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing). В таблото първо се изграждат всички редове и се предават заедно с `replaceChildren(...filas)` по друга причина: с една стъпка се махат старите редове и се слагат новите, без междинни наполовина начертани състояния.
- **Да сглобяваш селектор на ръка с данна.** `querySelector('[data-id="' + id + '"]')` се чупи с кавичка в `id`. `CSS.escape` съществува за това.
- **Да поставяш данна отвън като име на клас, без да я провериш.** `row.className = service.status` оставя данната да решава какви стилове се прилагат. Сравнява се със затворен списък, както прави `createRow`.

## Упражнения

### Упражнение 1 — Счупи таблото нарочно

В `js/view.js` промени реда, който записва името на услугата, така че да използва `innerHTML` вместо `textContent`. После добави в `js/services.js` услуга, чието `name` е `<img src="x" onerror="document.title = 'hackeado'">`. Преди да презаредиш, запиши в дневника си какво мислиш, че ще се види в реда и в раздела. Презареди, сравни и после върни двете промени. Отговори: кои други текстове на таблото, освен името, биха били път за същата атака, ако използваха `innerHTML`?

### Упражнение 2 — Най-бавната, в обобщението

Добави към обобщението пета двойка: „Más lento“ (Най-бавна), с името и времето на наличната услуга, която най-много се бави да отговори, например „Búsqueda (950 ms)“. Ако никоя услуга не е отговорила, трябва да казва „sin datos“ (няма данни). Реши и обоснови с едно изречение в кой файл отива всяка промяна: изчислението, мястото в страницата, начинът да се намери и текстът. Трябва ли да се пипа `js/state.js`?

### Упражнение 3 — Escape маха избора

Направи така, че при натискане на клавиша Escape изборът на услугата да се маха, без значение къде е фокусът. Подсказка: събитието се казва `keydown`, `evento.key` казва кой клавиш е бил, и се слуша върху `document`. Промяната ти трябва да пипа `js/state.js` и `js/main.js`, и **не** `js/view.js`. Провери с клавиатурата, че след Escape фокусът остава на бутона, на който е бил.

## Решения

### Решение 1

В `createRow` редът `nameCell.textContent = service.name;` става `nameCell.innerHTML = service.name;`. При презареждане редът на враждебната услуга не показва името (картинката не се зарежда и не оставя текст), а заглавието на раздела се сменя на „hackeado“. С върнатия ред редът показва целия текст на атаката и заглавието не помръдва.

Отговор на въпроса: **състоянието** (`service.status` минава през затворения списък, така че не е път, но би бил, ако се записваше с `innerHTML`), **времето** (`${service.responseMs} ms`), **обобщението** и **подробностите**: всяка данна, която идва отвън и се записва с `innerHTML`, е път. Нито числото е в безопасност, щом данната пристига по мрежата: нищо не гарантира, че `responseMs` е число, а не текст с HTML. Затова правилото не прави разлика между „опасни данни“ и „безобидни данни“: **никоя не влиза с `innerHTML`**.

### Решение 2

Изчислението е въпрос към данните и върви с другите изчисления, в `js/stats.js`; мястото в страницата е още една двойка в `<dl>`, в `index.html`; да се намери това място е работа на `js/main.js`, който познава `id`; а да се запише текстът е чертане, така че отива в `js/view.js`. `js/state.js` не се променя, защото най-бавната се изчислява от списъка и не е нещо, което таблото трябва да помни.

```js
// js/stats.js — al final del archivo
export function slowestService(list) {
  return list
    .filter((service) => service.status === "available")
    .toSorted((a, b) => b.responseMs - a.responseMs)[0] ?? null;
}
```

Това е същата идея като `slowest` от Упражнение 2 на урок 6, но връща цялата услуга, а не името ѝ, защото на текста са нужни и двете данни. При списък без налични услуги `[0]` дава `undefined`, а `?? null` го превръща в `null`, начинът на курса да каже „няма данна“. В `index.html` още една двойка в края на `<dl>`:

```html
<div>
  <dt>Más lento</dt>
  <dd id="summary-slowest"></dd>
</div>
```

В `js/main.js`, `slowest: document.querySelector("#summary-slowest"),` вътре в обекта `elements`. А в `js/view.js` се импортира заедно със `summarize` и се записва в `render`, след средното:

```js
import { summarize, slowestService } from "./stats.js";
// …
  const slowest = slowestService(services);
  elements.slowest.textContent = slowest === null ? "sin datos" : `${slowest.name} (${slowest.responseMs} ms)`;
```

Обобщението казва „Más lento: Búsqueda (950 ms)“. И тъй като `<dl>` от урок 5 си брои сам колоните, петата двойка се нагажда сама, без да пипаш CSS.

### Решение 3

Нова функция в `js/state.js` (единственият начин да се промени състоянието е функция на състоянието):

```js
export function clearSelection(state) {
  state.selected = null;
}
```

В `js/main.js` се добавя `clearSelection` към `import` и, преди последния ред (`render(state, elements);`), слушателят:

```js
// Escape quita la selección, esté donde esté el foco.
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") update(() => clearSelection(state));
});
```

Използва се `update`, а не гол `render`, за да се върне фокусът на бутона, който го е имал. `js/view.js` не се променя: вече е знаел да чертае случая „без избор“.

## Как разбирам, че съм успял

- [ ] Със сервирана на компютъра ти папка `programas/` на хранилището, когато отвориш `07-dom-eventos-estado/fig07_03.html`, заглавието на раздела се сменя на „Se ejecutó código que venía en un dato“ (Изпълни се код, който идваше в една данна). Във `fig07_04.html` не се сменя.
- [ ] В `07-dom-eventos-estado/panel/` обобщението казва 5, 4 от 5, 1 и 465 ms и нито едно от тези числа не е написано в HTML.
- [ ] `<tbody id="services-body">` в твоя `index.html` няма редове, написани на ръка, а Инспекторът показва пет.
- [ ] Само с клавиатурата: Tab стига до „Ver detalle de Pagos“, Enter показва „Pagos: disponible, responde en 480 ms.“ (Pagos: налична, отговаря за 480 ms.) и фокусът остава на този бутон.
- [ ] `state-test.html` показва шест реда, които започват с `ok`.
- [ ] При ширина 320 px няма хоризонтална лента за превъртане: в конзолата `document.documentElement.scrollWidth <= document.documentElement.clientWidth` връща `true`.
- [ ] Конзолата на браузъра не показва никаква грешка в таблото.
- [ ] Търсиш думата `innerHTML` във файловете си `.js` и не се появява.

**Преговор на предишни уроци** (отговори, без да гледаш, и после провери):

1. В урок 2: защо `<button>` е по-добър от `<div>` с щракване?
2. В уроци 4 и 5: какво прави `flex-wrap` и кога е за предпочитане пред заявка `@media`?
3. В урок 6: защо паднала услуга има `responseMs: null`, а не нула?

## За допълнително четене

- [MDN — Въведение в DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction) — какво е дървото на документа и как се обхожда; посетено на 7 октомври 2026 г.
- [MDN — Изплуване на събитията](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling) — `target`, `currentTarget` и делегиране, обяснени стъпка по стъпка; посетено на 7 октомври 2026 г.
- [OWASP — Предотвратяване на XSS, базиран на DOM](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html) — опасните приемници и защо `textContent` е безопасният начин; посетено на 7 октомври 2026 г.
- [MDN — `Element.innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) — предупреждението за сигурност с примера с `onerror`; посетено на 7 октомври 2026 г.
