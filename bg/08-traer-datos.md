# Урок 8 — Извличане на данни: promise, fetch и async/await

**Време:** 2 × 45 минути

**Какво изграждаш:** таблото, което поисква данните си от JSON файл на сървъра, вместо да ги носи написани в кода

**Какво научаваш:** какво е promise (обещание); `fetch` в две стъпки; `response.ok`; `async`/`await`; `try`/`catch` около заявката

## След урока ще можеш да

- Обясняваш какво е promise, в кои три състояния може да бъде и защо бавните операции връщат такъв, вместо резултата си.
- Обясняваш защо `fetch` се нуждае от две стъпки (отговорът и тялото му) и ги пишеш първо с `.then`, а после с `async`/`await`.
- Казваш при кои случаи promise на `fetch` се отхвърля и при кои не, и проверяваш `response.ok`, за да не приемеш за добър отговор с грешка.
- Променяш таблото така, че да поисква данните си от `data/services.json`, без да пипаш изчисленията, подредбата и чертането.
- Разпознаваш съобщението „Unexpected token '<'“ и знаеш къде да търсиш причината му.

## Защо, преди как

**Изходна точка.** Този урок тръгва от таблото, както го остави урок 7. Твоето табло чертае таблицата и обобщението от данните, а структурата, която остана, е тази:

- `index.html`, с празни `<tbody>` и четирите `<dd>` на обобщението, бутона „Ordenar por tiempo de respuesta“ (Подреди по време за отговор) и региона за подробностите (`#detail`).
- `css/styles.css`, стиловият лист от уроци 3, 4, 5 и 7.
- `js/services.js`, който експортира масива `services` и който `main.js` импортира **при стартиране**.
- `js/stats.js`, със `summarize` и двете изчисления от урок 6.
- `js/state.js`, със състоянието на таблото (списък, подредба, избор) и функциите, които го променят.
- `js/view.js`, който чертае състоянието в документа, винаги с `textContent`.
- `js/main.js`, който слуша събитията, променя състоянието и чертае наново.

Днес се променя само едно нещо от същината: `js/services.js` изчезва, а услугите отиват да живеят в `data/services.json`, в папката `data`, която създаде в Упражнение 1 на урок 1, файл, който таблото **поисква** от сървъра. Останалото от таблото (изчисленията, подредбата, изборът, безопасното чертане) си остава каквото беше. Това, че е възможно, е доказателство, че разделянето от урок 7 си е заслужавало. И две неща, които урок 2 остави написани, без да работят, се изпълняват днес: бутонът „Revisar ahora“ (Провери сега), който отново поисква данните, и „Última revisión“ (Последна проверка) в заглавната част, която престава да бъде измислен час и казва кога наистина са пристигнали данните.

Това е файлът: същите пет услуги от урок 6, записани в JSON. Ключовете са в двойни кавички, а паднала услуга носи `null`, правилата, които урок 6 описа в 6.2.2:

```json
[
  { "id": "catalog", "name": "Catálogo", "status": "available", "responseMs": 120 },
  { "id": "payments", "name": "Pagos", "status": "available", "responseMs": 480 },
  { "id": "inventory", "name": "Inventario", "status": "down", "responseMs": null },
  { "id": "notifications", "name": "Notificaciones", "status": "available", "responseMs": 310 },
  { "id": "search", "name": "Búsqueda", "status": "available", "responseMs": 950 }
]
```

**Защо модулът не стига.** Докато данните бяха в модул, таблото тръгваше с тях в ръка: браузърът не можеше да начертае таблицата, без да ги е прочел, защото идваха в същия пакет с кода. Един истински доклад не работи така. Данните ги произвежда друга програма, в друг момент, и се променят, без никой да пипа кода на таблото: услуга, която пада в три сутринта, не може да чака някой да редактира `services.js` и да публикува отново. Затова данните живеят на друго място, а за да ги получиш, трябва да направиш HTTP заявка, същата, която изучи в урок 0: изпраща се, чака се, получава се. Да отделиш кода от данните е и онова, което позволява същото табло да служи за всякакъв списък от услуги: в деня, когато някой поиска да провери своите, сменя файла, не програмата.

Една заявка, за разлика от модул, **отнема време**. И това налага да мислиш по различен начин, защото програмата не може да остане замръзнала в очакване на отговора: страницата трябва да продължи да обслужва щракванията и клавиатурата междувременно. Този урок е за това чакане: как се пише програма, която поисква нещо, продължава живота си и подема работата, когато отговорът пристигне. Частта, която го прави възможно, се казва **promise** (обещание) и е най-важната идея на урока.

Да поискаш нещо по мрежата може и да **се обърка** по няколко начина: файлът не съществува, сървърът не отговаря, отговорът не е онова, което си очаквал. Днес ще научиш да **откриваш** всяка грешка в кода, което е първата стъпка и онази, която най-често се забравя. Да ги покажеш на екрана така, че човек да разбере какво се е случило, да сложиш граница на чакането и да поискаш данни от друг сървър е темата на урок 9, който тръгва от таблото, което довършиш днес. Разделянето на два урока има причина: първо трябва да се разбере добре пътят, който минава успешно, защото всяка грешка е отклонение от този път.

**Какъв път следва.** Първо **promise** и двете фази на `fetch`, с `.then`, така, както се пишеше уебът години наред и както ще срещаш много код. Второ `async` и `await`, които казват същото във вид на непрекъснат текст, с `try`/`catch`, който вече познаваш. Трето, таблото: нов модул, който поисква данните, и три файла, които се променят малко, за да ги получат.

**Какво ти трябва включено.** Само обичайният локален сървър. Страниците на този урок са в [`programas/08-traer-datos/`](https://github.com/HabilMX/curso-web/tree/main/programas/08-traer-datos) на [хранилището на курса](https://github.com/HabilMX/curso-web); с хранилището, изтеглено на компютъра ти, стартирай сървъра от неговата папка `programas/`:

```bash
cd programas
python3 -m http.server 8000 --bind 127.0.0.1
```

Отвори `http://127.0.0.1:8000/08-traer-datos/panel/`. Помни предупреждението от урок 1: `fetch` и модулите не работят с `file://`, защото файл, отворен така, няма произход, който да може да чете други. [Стандартът за URL](https://url.spec.whatwg.org/#concept-url-origin) оставя на всеки браузър да реши какъв произход има един локален файл и при съмнение препоръчва непрозрачен; Chrome 154 го прави така (в конзолата на страница, отворена с двойно щракване, `self.origin` отговаря `"null"`) и затова блокира тези четения. Не е нужно нищо друго: нито Node, нито пакети.

## Понятията

Те са три. Както в урок 7: преди да изпълниш всяка фигура, **запиши в дневника какво мислиш, че ще се случи**.

### 8.1 Promise и `fetch` в две стъпки

**Promise е резултат, който още не е пристигнал.** Когато поискаш нещо по мрежата, JavaScript не стои и не чака със скръстени ръце: страницата трябва да продължи да отговаря на щракванията, на колелото на мишката, на клавиатурата. Затова бавните операции не връщат резултата си, а обект, който го представлява: **promise** (*Promise*, обещание). Един promise е в един от три момента: **изчакващ** (*pending*, още няма резултат), **изпълнен** (*fulfilled*, пристигнал е резултат) или **отхвърлен** (*rejected*, нещо се е провалило). След като е изпълнен или отхвърлен, вече не се променя. Формалното определение е в [спецификацията на ECMAScript](https://tc39.es/ecma262/#sec-promise-objects); обяснението на MDN [как да използваш promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) е най-ясното четиво.

Помага едно сравнение. Когато поръчаш храна на гише и ти дадат жетон с номер, жетонът не е храната: той е обещанието, че храната ще дойде. Докато чакаш, можеш да седнеш, да си побъбриш или да погледнеш телефона; не стоиш неподвижен пред гишето. Когато извикат номера ти, жетонът се „изпълнява“ и получаваш храната; ако ястието е свършило, жетонът се „отхвърля“ и ти дават обяснение. А вече осребрен жетон не се осребрява втори път. Promise в JavaScript е този жетон.

С promise се прави същото като със събитие: казва му се какво да направи, когато настъпи. Методът `.then(función)` регистрира „когато се изпълниш, изпълни това с резултата си“, а методът `.catch(función)` регистрира „ако се отхвърлиш, изпълни това с причината“. Всеки `.then` на свой ред връща друг promise и затова могат да се свързват във верига. Има и трети, `.finally(función)`, който се изпълнява и в двата случая, изпълни се promise-ът или се отхвърли; служи за онова, което трябва да се направи, каквото и да стане, като например да се запише резултатът в страницата.

**`fetch` се нуждае от две стъпки.** Функцията `fetch(dirección)` иска ресурс по HTTP и връща promise за **отговор** (`Response`). Но този promise се изпълнява, щом пристигнат **заглавните части** (*headers*) на отговора, не когато пристигне цялото съдържание. Същото виждаш в раздела „Мрежа“ на инструментите на браузъра: първо пристига редът за състоянието (`200 OK`) и заглавните части, а после, малко по малко, тялото. Затова има втора стъпка: `respuesta.json()` чете тялото, интерпретира го като JSON и връща **друг promise**, който се изпълнява с получения обект. Документирано е в [MDN: използване на `fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).

Защо да се раздели така, а не да се предаде всичко наведнъж? Защото със заглавните части вече могат да се вземат решения, преди да се хаби време за тялото: ако кодът казва, че файлът не съществува, няма смисъл да четеш и анализираш страница с грешка, като че ли са данни. И защото тялото може да е огромно: видео или файл от няколко мегабайта пристига на части и програмата може да реши как да го чете. За таблото тялото е малко, но правилото е същото.

**Предскажи:** фигура 8.1 поисква `panel/data/services.json` в две стъпки и записва три данни от отговора, преди да прочете тялото. Какво мислиш, че ще кажат `ok` и видът на съдържанието?

```html
<!-- fig08_01.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 8.1 — fetch en dos pasos</title>
</head>
<body>
  <main>
    <h1>Fig. 8.1 — fetch en dos pasos</h1>
    <pre id="output">Cargando…</pre>
  </main>

  <script type="module">
    const output = document.querySelector("#output");
    const lines = [];

    fetch("panel/data/services.json")                   // paso 1: llega la respuesta
      .then((response) => {
        lines.push(`estado HTTP: ${response.status}`);
        lines.push(`ok: ${response.ok}`);
        lines.push(`tipo de contenido: ${response.headers.get("content-type")}`);
        return response.json();                         // paso 2: se lee el cuerpo (otra promesa)
      })
      .then((services) => {
        lines.push(`servicios recibidos: ${services.length}`);
        lines.push(`el primero: ${services[0].name}`);
        output.textContent = lines.join("\n");
      });
  </script>
</body>
</html>
```

```text
estado HTTP: 200
ok: true
tipo de contenido: application/json
servicios recibidos: 5
el primero: Catálogo
```

Спри се на всяка част, защото всичките ще ти трябват:

- **`response.status`** е HTTP кодът от урок 0: 200 е „ето го“, 404 е „няма такова нещо“, 500 е „сървърът се счупи“.
- **`response.ok`** е удобство: `true` е, когато кодът е между 200 и 299. Ще го използваш непрекъснато, по причината, която следва.
- **`response.headers.get("content-type")`** казва какъв вид съдържание е обявил сървърът. Тук `application/json`: локалният сървър го определя по разширението `.json`.
- **Първият `.then`** завършва с `return response.json()`. Този `return` е онова, което свързва двете стъпки: вторият `.then` получава вече масива с услуги, не promise.

**404 не е грешка за `fetch`.** Това е точката на урока с най-големи последици и почти никой не я очаква. Помисли как трябва да се държи promise, ако поискаш файл, който не съществува. Много хора предполагат, че се отхвърля, защото „нещо се е объркало“. **Предскажи** какво прави фигура 8.2, която иска `missing.json`, файл, който не съществува: изпълнява ли се `.then`, или `.catch`?

```html
<!-- fig08_02.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 8.2 — un 404 no rechaza la promesa</title>
</head>
<body>
  <main>
    <h1>Fig. 8.2 — un 404 no rechaza la promesa</h1>
    <pre id="output">Cargando…</pre>
  </main>

  <script type="module">
    const output = document.querySelector("#output");
    const lines = [];

    fetch("missing.json")
      .then((response) => {
        lines.push("la promesa SE CUMPLIÓ (no se rechazó)");
        lines.push(`estado HTTP: ${response.status}`);
        lines.push(`ok: ${response.ok}`);
      })
      .catch((error) => {
        lines.push(`la promesa se rechazó: ${error.message}`);   // esto NO se ejecuta con un 404
      })
      .finally(() => {
        output.textContent = lines.join("\n");
      });
  </script>
</body>
</html>
```

```text
la promesa SE CUMPLIÓ (no se rechazó)
estado HTTP: 404
ok: false
```

Promise **се изпълни**. От гледна точка на `fetch` сървърът отговори (каза „не намерих това“) и комуникацията мина добре; `ok` е `false` и `status` е 404, но `.catch` не се изпълни. Ако кодът ти прави `fetch(url).then(r => r.json())`, без да гледа `ok`, 404 или 500 се третират като добри данни. Тогава се проваля по-нататък, далеч от причината, със смущаващо съобщение (ще го видиш в „Грешката, която ще видиш“). Правилото е: **promise се отхвърля, когато няма отговор, който страницата да може да използва —не е пристигнал никакъв, или е пристигнал, но браузърът не позволява да се прочете, както става с CORS—; всеки четим отговор, дори грешка, го изпълнява**.

Пълният списък, за да не го забравиш. Последните два реда ще ги предизвикаш в урок 9; тук са, защото таблицата е полезна само пълна:

| Ситуация | Promise на `fetch` | Как го откриваш |
|---|---|---|
| Пристига отговор 200 до 299 | се изпълнява | `response.ok === true` |
| Пристига отговор 404, 500 или друг код за грешка | **се изпълнява** | `response.ok === false` |
| Няма връзка, сървърът не съществува или е изключен | се отхвърля с `TypeError` | `catch` |
| Браузърът блокира четенето заради CORS | се отхвърля с `TypeError` | `catch` |
| Изтича времевият лимит **преди** да пристигнат заглавните части | се отхвърля с `TimeoutError` | `catch` и `error.name` |

Забележи, че два реда от таблицата произвеждат същия `TypeError`. Не е недоглеждане: от кода на страницата **не може да се различи** липса на връзка от блокиране по CORS, отчасти нарочно: така чужда страница не получава информация за мрежата на онзи, който я посещава. Обяснението какво е станало е в конзолата и ще го прочетеш в урок 9.

### 8.2 `async`, `await` и `try` около заявката

**Същата програма, написана по права линия.** Свързването на `.then` работи, но програма с три или четири стъпки и обработка на грешки се превръща в стълба от функции във функции. През 2017 г. JavaScript добави синтаксис, за да се напише същото, като че ли кодът наистина чака: `async` и `await`. Не е нещо друго: **това е същият promise с друга форма**. Прилага се така:

- Функция, маркирана с **`async`**, винаги връща promise. Онова, което функцията `return`-не, е стойността, с която този promise се изпълнява, а ако функцията хвърли грешка, promise се отхвърля.
- Вътре в нея **`await promesa`** паузира *тази функция* (не страницата), докато promise не се изпълни, и предава резултата му. Ако promise се отхвърли, `await` хвърля грешката като изключение, което се прихваща с обичайния `try`/`catch`.
- Извън `async` функция `await` може да се използва само на най-горното ниво на **модул**, какъвто е случаят със `<script type="module">` на фигурите от този урок. (Още едно предимство на модулите.) Документирано е в [MDN: `async function`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) и [`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await).

Върни се към жетона от гишето: `await` е да кажеш „чакам тук, докато извикат номера ми“. Разликата с реалния живот е, че чака **само тази функция**; останалата страница продължава да работи. Затова `await` не замразява нищо: браузърът отделя функцията на пауза, обслужва останалото и я подема точно на този ред, когато promise се изпълни.

Във фигурата, която следва, се появяват наново три части, които урок 6 представи в „Да решаваш, да повтаряш и да сигнализираш за грешка“: `if (condición) { … }`, който изпълнява блок само когато условието е вярно; `throw new Error("texto")`, който създава обект за грешка с това съобщение (`new` е онова, което произвежда нов обект по калъп, тук `Error`) и го **хвърля**, тоест прекъсва функцията на този ред; и `try { … } catch (error) { … }`, който опитва първия блок и, ако нещо се хвърли вътре в него, скача във втория с грешката в ръка. Ако някоя от трите не ти звучи позната, върни се към този раздел, преди да продължиш: тук се използват непрекъснато.

Фигура 8.3 е същият `fetch` от 8.1, сега по права линия, с проверката на `ok`, която липсваше, и изпробван срещу добрия файл и срещу този, който не съществува. **Предскажи** какво ще каже за всеки:

```html
<!-- fig08_03.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 8.3 — async y await, con la revisión de ok</title>
</head>
<body>
  <main>
    <h1>Fig. 8.3 — async y await, con la revisión de ok</h1>
    <pre id="output">Cargando…</pre>
  </main>

  <script type="module">
    const output = document.querySelector("#output");

    async function requestServices(url) {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`El servidor respondió con el código ${response.status}.`);
      }
      return await response.json();
    }

    async function tryUrl(url) {
      try {
        const services = await requestServices(url);
        return `${url}: llegaron ${services.length} servicios`;
      } catch (error) {
        return `${url}: falló — ${error.message}`;
      }
    }

    const results = [await tryUrl("panel/data/services.json"), await tryUrl("missing.json")];
    output.textContent = results.join("\n");
  </script>
</body>
</html>
```

```text
panel/data/services.json: llegaron 5 servicios
missing.json: falló — El servidor respondió con el código 404.
```

Сравни с фигура 8.1 и обърни внимание на три промени: изчезнаха вложените функции; стъпка 1 и стъпка 2 се виждат като два реда с `await`; и се появи `if (!response.ok) throw new Error(...)`, който превръща отговор с грешка в истинска грешка, и така `catch` на онзи, който я извиква, я третира като всяка друга неуспешна операция. **Този `if` е най-важният ред на урока.** Ако ще запомниш само един, нека е този.

Прочети и как се разпределя работата между двете функции. `requestServices` не решава какво да прави при грешка: само я **съобщава**, като хвърля грешка с ясно съобщение. `tryUrl` е онази, която решава: прихваща грешката и я превръща в ред текст. Това е същото разделение, което ще използваш в таблото: модулът, който поисква данните, съобщава; онзи, който го извиква, решава какво да прави.

И едно невнимание, което наистина води до реални грешки: да забравиш `await`. `const services = requestServices(url)` без `await` не дава услугите, а *promise* за услугите; ако го отпечаташ, ще видиш `Promise { <pending> }`, а ако го използваш като масив, нищо не работи. Няма грешка, когато го забравиш, само абсурден резултат.

**В какъв ред стават нещата.** Една `async` функция не се паузира, когато я извикаш: изпълнява се нормално, ред по ред, **до първия `await`**. Там се отделя настрана и онзи, който я е извикал, продължава със следващия си ред. Когато promise се изпълни, функцията продължава от този `await`. Това обяснява нещо, което обърква много в началото: кодът, написан *след* извикването на една `async` функция, може да се изпълни *преди* кода, написан *вътре* в нея, след нейния `await`. Упражнение 3 те моли да предскажеш този ред; направи го спокойно, защото разбирането му ти спестява часове дебъгване.

### 8.3 Таблото поисква данните си

С казаното дотук вече можеш да промениш таблото. Файловете са пет и си струва първо да видиш целия план, преди кода:

| Файл | Какво се променя | Защо |
|---|---|---|
| `js/services.js` | изчезва | данните вече живеят в `data/services.json` |
| `js/load.js` | е нов | поисква данните и връща масив, или хвърля грешка |
| `js/state.js` | състоянието стартира без услуги и помни кога са пристигнали | при отваряне на страницата още няма данни |
| `js/view.js` | записва часа на „Última revisión“ | часът престава да бъде написан на ръка |
| `index.html` | две нови `id` | за да намери кодът часа и бутона „Revisar ahora“ |
| `js/main.js` | поисква данните при стартиране и с „Revisar ahora“ | той е, който събира частите |

`js/stats.js` и `css/styles.css` не се променят. Това, че най-голямата промяна на таблото досега оставя непокътнати изчисленията и външния вид, е наградата, че в урок 7 разделихме отговорностите.

**Стъпка 1: модулът, който поисква данните.** Новият модул, `js/load.js`, се пише с едно правило: **не пипа документа**. Поисква данните и връща масив, или хвърля грешка със съобщение. Не знае дали има таблица, известие или човек, който гледа; кой решава как да се покаже, е друг файл. Това е същото разпределение като във фигура 8.3: `requestServices` съобщаваше, а `tryUrl` решаваше.

Преди кода, един нов инструмент и два познати. В края има малка функция, `isService`, която използва два инструмента от урок 6 —`typeof`, който казва от какъв тип е една стойност, и `every`, който пита дали **всички** елементи на масив изпълняват условие— и един нов, `Number.isFinite(valor)`, който е верен само за истинско число (не за текста `"120"`, не за `NaN`, не за `Infinity`).

```js
// panel/js/load.js
// Pide la lista de servicios y devuelve un arreglo, o lanza un Error.
// No toca el documento.

export async function loadServices(url) {
  // Paso 1: la respuesta.
  const response = await fetch(url);

  // fetch NO rechaza con un 404 o un 500: hay que mirarlo.
  if (!response.ok) {
    throw new Error(`El servidor respondió con el código ${response.status}.`);
  }

  // Paso 2: el cuerpo, leído como JSON.
  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("La respuesta no es una lista de servicios.");
  }
  if (!data.every(isService)) {
    throw new Error("Algún servicio de la lista llegó incompleto o con datos de otro tipo.");
  }
  return data;
}

// Un servicio, tal como lo entiende el panel: un objeto (no null) con sus cuatro claves,
// cada una del tipo que el resto del código espera.
function isService(item) {
  return typeof item === "object" && item !== null &&
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.status === "string" &&
    (item.responseMs === null || Number.isFinite(item.responseMs));
}
```

Прочети кода с тези въпроси:

- **Къде са двете стъпки?** В двата реда с `await`: `await fetch(url)` носи отговора, а `await response.json()` чете тялото му. Между тях е проверката на `ok`, на единственото място, където има смисъл: с отговора в ръка и преди да се хаби време за тялото.
- **Защо тук няма никакъв `try`?** Защото този модул не решава нищо за грешките: ако `fetch` се отхвърли или `json()` не може да прочете тялото, грешката продължава пътя си към онзи, който е извикал `loadServices`, който знае какво да прави. `try`, който прихваща грешка само за да я хвърли отново същата, не носи нищо. В урок 9 този файл ще има `try`, защото там всяка грешка ще се **преведе** на различно изречение.
- **Какво правят `Array.isArray` и `isService`?** Проверяват формата на данна отвън, преди да я пуснат. `Array.isArray` гледа дали онова, което е пристигнало, е списък; `data.every(isService)` гледа дали **всеки** елемент е обект с `id`, `name` и `status` текстови, и `responseMs` число или `null`. Втората проверка не е украса. Файл с `[null]` е напълно валиден JSON и е масив; без нея този `null` би стигнал до `summarize`, който би се опитал да прочете `service.status` от `null`, и програмата би спряла с `TypeError` далеч от причината. Същото с `"responseMs": "120"`, написано в кавички: средното би сумирало текстове. По-пълна валидация —позволени стойности, диапазони, излишни ключове, съобщения, които казват *кой* елемент се е провалил— е темата на урок 6 от [курса по TypeScript](https://www.habil.mx/bg/courses/typescript/). А другата защита остава в сила: таблото чертае всичко с `textContent`, а значката използва затворен списък, така че странен текст изглежда странно, но не изпълнява нищо.

**Стъпка 2: състоянието стартира празно.** В урок 7 `createState(services)` получаваше услугите, защото при стартиране те вече бяха там. Сега не: при отваряне на страницата още няма нито една, трябва да се поискат. Така че `createState()` вече не получава нищо и започва с празен списък, и се появява функция, `loadSucceeded`, която запазва онова, което е пристигнало. Запазва и ново поле, `checkedAt`: **моментът**, в който са пристигнали данните, който е онова, което заглавната част ще покаже. Този момент го подава онзи, който зарежда, като обект `Date` (`new Date()` произвежда такъв с текущата дата и час). И деселектира избраната услуга, защото след нова проверка списъкът може да е различен и избраната може вече да не съществува.

```js
// panel/js/state.js
// El estado del panel y las únicas formas de cambiarlo.
// No toca el documento: por eso se puede probar sin pantalla.

export function createState() {
  return {
    services: [],           // vacío al arrancar: los datos hay que pedirlos
    checkedAt: null,        // cuándo llegaron los datos por última vez (un Date), o null
    sortByTime: false,      // false = en el orden original; true = del más rápido al más lento
    selected: null,         // el id del servicio elegido, o null
  };
}

export function loadSucceeded(state, services, checkedAt) {
  state.services = services;
  state.checkedAt = checkedAt;
  state.selected = null;
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

Останалата част от файла е от урок 7 без промени: подреждането, изборът и изчисляването на видимото не зависят от това откъде са дошли данните.

**Стъпка 3: изгледът записва часа.** Изгледът получава функция, `renderCheckedAt`, която създава елемент `<time>`, като онзи, който написа на ръка в урок 2, с данната за машините в `dateTime` (`toISOString()` я дава във формата, който изисква стандартът) и текста за хората, направен от [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat), който в `es-MX` записва нещо като „7 de octubre de 2026 a las 12:03 p.m.“ (7 октомври 2026 в 12:03 следобед). Това е същият вид форматиращ инструмент, който урок 6 използва за числата, сега за дати. Ако още нищо не е пристигнало, `checkedAt` е `null` и функцията не прави нищо: заглавната част остава с „todavía no“ (още не), защото измислен час, в табло, което наистина проверява, би бил лъжа. Останалата част от `render` е от урок 7, с един ред повече в началото.

```js
// panel/js/view.js
// Dibuja el estado en el documento, con la hora en que llegaron los datos.
// Todo texto de los datos entra con textContent.
import { summarize } from "./stats.js";
import { visible, selectedService } from "./state.js";

// Lista cerrada de estados que el panel conoce. Un valor que no esté aquí no llega a una clase.
const LABELS = { available: "Disponible", down: "Caído" };

// La fecha y la hora de la última revisión, escritas para una persona y a la manera de México.
const TIME_FORMAT = new Intl.DateTimeFormat("es-MX", { dateStyle: "long", timeStyle: "short" });

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

function renderCheckedAt(checkedAt, target) {
  if (checkedAt === null) return;
  const time = document.createElement("time");
  time.dateTime = checkedAt.toISOString();
  time.textContent = TIME_FORMAT.format(checkedAt);
  target.replaceChildren(time);
}

// elements = { checkedAt, total, available, down, average, body, detail, sortButton }
export function render(state, elements) {
  const { services } = state;
  renderCheckedAt(state.checkedAt, elements.checkedAt);

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

**Стъпка 4: HTML получава две имена.** Това е `index.html` от урок 7 с две промени: заглавната част оставя часа, написан на ръка, и носи на негово място `<span id="checked-at">todavía no</span>`, а „Revisar ahora“ получава `id`, което урок 2 обяви, `check-now`. Без тези `id` кодът нямаше да има как да намери двата елемента.

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
    <p>Última revisión: <span id="checked-at">todavía no</span></p>
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

        <p><button type="button" id="check-now">Revisar ahora</button></p>
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
    <p>Datos de ejemplo del archivo data/services.json.</p>
  </footer>
</body>
</html>
```

**Стъпка 5: `main.js` поисква данните.** Вече не импортира `services.js`: импортира `loadServices` и извиква нова функция, `load`, при стартиране и всеки път, когато някой натисне „Revisar ahora“. Преди да я прочетеш, една подробност в записа, която се появява за първи път: `let services;` декларира променливата **без стойност**, извън `try`, а вътре в `try` ѝ се присвоява. Нужно е да е така, защото променлива, декларирана вътре в блок `{ … }`, съществува само вътре в този блок, а `services` е нужна после, извън него.

```js
// panel/js/main.js
// Junta las piezas: pide los datos, guarda el resultado en el estado y dibuja.
import { loadServices } from "./load.js";
import { createState, loadSucceeded, toggleSort, select } from "./state.js";
import { render } from "./view.js";

const elements = {
  checkedAt: document.querySelector("#checked-at"),
  total: document.querySelector("#summary-total"),
  available: document.querySelector("#summary-available"),
  down: document.querySelector("#summary-down"),
  average: document.querySelector("#summary-average"),
  body: document.querySelector("#services-body"),
  detail: document.querySelector("#detail"),
  sortButton: document.querySelector("#sort"),
  checkNow: document.querySelector("#check-now"),
};

const state = createState();

async function load() {
  let services;
  try {
    services = await loadServices("data/services.json");
  } catch (error) {
    // Por ahora la falla solo queda en la consola. La lección 9 la lleva a la pantalla.
    console.error(`No se pudieron cargar los servicios: ${error.message}`);
    return;
  }
  loadSucceeded(state, services, new Date());
  render(state, elements);
}

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
elements.checkNow.addEventListener("click", load);

// Delegación: un solo oyente en el <tbody> atiende los botones de todas las filas.
elements.body.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-id]");
  if (button === null) return;
  update(() => select(state, button.dataset.id));
});

load();
```

Функцията `load` има три части и редът има значение:

1. **Опитва** да поиска данните, вътре в `try`.
2. Ако се провали, **съобщава** в конзолата с `console.error` и приключва с `return`. Таблицата остава каквато е била.
3. Ако е минало добре, **запазва** в състоянието и **чертае**.

Обърни внимание, че `try` обгръща **само заявката**, не чертането. Ако чертането имаше програмна грешка, не искаме `catch` да я прихване и да я маскира като „не можаха да се заредят услугите“: искаме да я видим в конзолата такава, каквато е, с файла и реда ѝ. Един `try`, голям колкото цялата функция, крие грешки, които нямат нищо общо с мрежата.

И бъди честен за онова, което това табло още не прави: ако заявката се провали, човекът не вижда нищо. Таблицата остава празна, обобщението също, а единствената следа е в конзолата, която никой освен онзи, който програмира, не отваря. Докато зарежда, също не се вижда никакво известие. Това е табло, което работи по щастливия път и което **открива** грешките, но още не ги **разказва**. Да ги разкажеш добре —зареждане, грешка и празно, всяко със своето известие и обявено на екранен четец— е работата на урок 9, а това разделяне ти позволява да видиш ясно какво добавя всяка част.

**Как го проверяваш.** Със стартиран сървър отвори `http://127.0.0.1:8000/08-traer-datos/panel/`. Обобщението трябва да казва 5, 4 от 5, 1 и 465 ms, както в урок 7, а заглавната част — датата и часа на този момент. Натисни „Ordenar por tiempo de respuesta“ и избери услуга: всичко работи както преди, защото тези части не са се променили. Натисни „Revisar ahora“ с клавиатурата: часът в заглавната част се записва наново и фокусът остава на бутона, защото бутонът никога не изчезва. Така беше проверено в Chrome 154, също и с прозорец на 320 px, където страницата не прелива.

Сега предизвикай грешка, за да видиш какво прави таблото с нея. В `js/main.js` смени временно `"data/services.json"` с `"data/missing.json"` и презареди. Таблицата и обобщението остават празни, заглавната част продължава да казва „todavía no“ и конзолата на Chrome показва два червени реда: този на браузъра, `Failed to load resource: the server responded with a status of 404 (File not found)`, и твоя, `No se pudieron cargar los servicios: El servidor respondió con el código 404.` (Не можаха да се заредят услугите: Сървърът отговори с код 404.). Първият го пише браузърът по своя воля при всеки отговор с грешка; вторият е онзи, който написа твоят `catch`. Върни промяната, когато свършиш.

## Грешката, която ще видиш

**`Unexpected token '<'`.** Това е следствие от забравянето на `ok` или от сочене към грешен адрес, който освен това не отговаря с грешка, а със страница. Фигура 8.4 поисква HTML страница и я чете, като че ли е JSON:

```html
<!-- fig08_04.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 8.4 — leer como JSON algo que no lo es</title>
</head>
<body>
  <main>
    <h1>Fig. 8.4 — leer como JSON algo que no lo es</h1>
    <pre id="output">Cargando…</pre>
  </main>

  <script type="module">
    const output = document.querySelector("#output");

    const response = await fetch("fig08_01.html");   // existe, responde 200... pero es una página
    output.textContent = `código: ${response.status}, ok: ${response.ok}\ntipo: ${response.headers.get("content-type")}`;
    try {
      await response.json();
    } catch (error) {
      output.textContent += `\n${error.name}: ${error.message}`;
    }
  </script>
</body>
</html>
```

```text
código: 200, ok: true
tipo: text/html
SyntaxError: Unexpected token '<', "<!-- fig08"... is not valid JSON
```

(Третият ред е съобщението на Chrome; Firefox казва нещо като „JSON.parse: unexpected character at line 1 column 1“, но името, `SyntaxError`, е същото.) Прочети го спокойно: сървърът отговори **200**, `ok` е `true` и нямаше никакъв проблем с връзката. Повредата е в съдържанието: обявеният вид е `text/html`, а `.json()` се натъкна, на първия знак, на `<`, с който започва страницата (тук това от коментара `<!-- fig08_01.html -->`; в друга страница би било това от `<!DOCTYPE html>`), който не може да се появи в JSON. В кавички Chrome ти показва първите знаци от онова, което е пристигнало, и това е най-добрата следа: ако започват с `<`, пристигнала ти е страница.

„Unexpected token '<'“ е почти винаги подписът на „пристигна ми HTML страница там, където очаквах JSON“: грешно написан адрес, страница с грешка от сървъра или пренасочване към екрана за вход. Провери в раздела „Мрежа“ какво е пристигнало наистина: кодът, видът на съдържанието и, в изгледа на отговора, текстът. Ако направиш опита в таблото, като смениш в `main.js` адреса с `"index.html"`, конзолата казва `No se pudieron cargar los servicios: Unexpected token '<', "<!-- panel"... is not valid JSON`: същата грешка, сега прихваната от твоя `catch`. Това е съобщение за онзи, който програмира, не за онзи, който използва таблото; в урок 9 ще го превърнеш в изречение, което всеки разбира.

## Какво се прави погрешно

- **Да не проверяваш `response.ok`.** Това е грешката от фигура 8.2. 404 или 500 влиза в програмата, като че ли са данни, и истинската повреда се появява далеч от причината. Поправката е редът `if (!response.ok) throw …`, винаги.
- **Да оставиш `catch` празен.** `catch {}` кара всяка грешка да изчезне без следа: таблото просто не показва нищо и никой не знае защо. Всеки `catch` трябва да прави нещо видимо: да уведоми човека или да остави подробността в конзолата.
- **Да обгръщаш всичко в един `try`.** Ако `try` обхваща заявката *и* чертането, програмна грешка в чертането се представя като мрежова повреда. `try` е около онова, което може да се провали по външни причини, и нищо повече.
- **Да забравиш `await`.** Стойността, която получаваш, е promise, не резултатът. Ако нещо показва `[object Promise]` на екрана, това е то.
- **Да смесваш заявката с чертането.** Функция, която прави `fetch` и едновременно изгражда редове, не може да се тества, нито да се използва повторно. `js/load.js` поисква, `js/state.js` помни, `js/view.js` чертае.
- **Да показваш с `innerHTML` данните, които са пристигнали.** Онова, което идва отвън, е данна отвън, дори да идва от собствения ти сървър, защото утре този сървър може да е друг. Принципът от урок 7 остава в сила без промяна.
- **Да отваряш таблото с `file://`.** `fetch` не може да чете локални файлове от страница, отворена с двойно щракване. Ако конзолата говори за CORS и адресът започва с `file://`, причината е тази: сервирай папката с `python3 -m http.server`.

## Упражнения

### Упражнение 1 — Фигура 8.2, с `await`

Препиши фигура 8.2 с `await` и `try`/`catch` вместо `.then`, `.catch` и `.finally`. Страницата трябва да показва точно същите три реда като оригинала. Преди да я напишеш, реши коя част от оригиналния код се превръща в `try`, коя в `catch` и какво става с `.finally`.

### Упражнение 2 — По едно съобщение за всеки вид проблем

Днес всеки код за грешка произвежда „El servidor respondió con el código N.“ Промени го така, че 404 да казва „No se encontró la lista de servicios.“ (Не беше намерен списъкът с услуги.), а код от 500 нагоре да казва „El servidor tuvo un problema (código N). Intenta de nuevo en un momento.“ (Сървърът имаше проблем (код N). Опитай отново след малко.) Останалите кодове запазват сегашното съобщение. Реши в кой файл отива промяната и защо не пипа нито `js/view.js`, нито `js/state.js`.

### Упражнение 3 — В какъв ред?

Преди да го изпълниш, запиши в дневника си в какъв ред ще се появят петте реда, които тази програма пише. После го запази като `order.html` в папката `08-traer-datos/` на твоето копие на `programas/`, отвори го със стартиран сървър и сравни.

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <link rel="icon" href="data:,">
  <title>¿En qué orden?</title>
</head>
<body>
  <pre id="output"></pre>
  <script type="module">
    const lines = [];

    async function countServices() {
      lines.push("1: dentro de la función, antes del await");
      const response = await fetch("panel/data/services.json");
      const services = await response.json();
      lines.push("2: dentro de la función, después del await");
      return services.length;
    }

    lines.push("A: antes de llamar");
    const pending = countServices();
    lines.push("B: después de llamar, sin await");
    const count = await pending;
    lines.push(`C: llegaron ${count}`);

    document.querySelector("#output").textContent = lines.join("\n");
  </script>
</body>
</html>
```

## Решения

### Решение 1

`.then` се превръща в тялото на `try`, `.catch` в `catch`, а `.finally` в реда, който следва `try`/`catch`, който се изпълнява и в двата случая, защото нито един от двата блока не завършва функцията:

```html
  <script type="module">
    const output = document.querySelector("#output");
    const lines = [];

    try {
      const response = await fetch("missing.json");
      lines.push("la promesa SE CUMPLIÓ (no se rechazó)");
      lines.push(`estado HTTP: ${response.status}`);
      lines.push(`ok: ${response.ok}`);
    } catch (error) {
      lines.push(`la promesa se rechazó: ${error.message}`);   // esto NO se ejecuta con un 404
    }
    output.textContent = lines.join("\n");
  </script>
```

С останалата част от страницата, същата като във фигура 8.2, Chrome показва същите три реда: `la promesa SE CUMPLIÓ (no se rechazó)`, `estado HTTP: 404` и `ok: false`. `await` не променя правилото: 404 изпълнява promise и затова `catch` не се изпълнява, макар „нещо да се е объркало“.

### Решение 2

Отива в `js/load.js`, защото именно там един технически резултат се превежда на изречение; `js/view.js` само чертае онова, което получава, а `js/state.js` само го запазва. Променя се `throw` на `if (!response.ok)` и се добавя функция в края на файла:

```js
  if (!response.ok) {
    throw new Error(statusMessage(response.status));
  }
```

```js
// Un mensaje distinto según de quién es el problema.
function statusMessage(code) {
  if (code === 404) return "No se encontró la lista de servicios.";
  if (code >= 500) return `El servidor tuvo un problema (código ${code}). Intenta de nuevo en un momento.`;
  return `El servidor respondió con el código ${code}.`;
}
```

За да го провериш, смени временно в `js/main.js` адреса с `"data/missing.json"`: конзолата вече казва `No se pudieron cargar los servicios: No se encontró la lista de servicios.`. Статичният сървър на курса не може да произведе 500, така че този клон се проверява с трик: смени временно `code === 404` с `code === 999` и `code >= 500` с `code >= 400`, презареди и трябва да се появи „El servidor tuvo un problema (código 404)…“. Върни двете промени, когато свършиш. Засега съобщението се чете само в конзолата; в урок 9 ще се появи на екрана, без да ти се налага да пипаш този файл.

### Решение 3

Редът е A, 1, B, 2, C:

```text
A: antes de llamar
1: dentro de la función, antes del await
B: después de llamar, sin await
2: dentro de la función, después del await
C: llegaron 5
```

„A“ е първо, защото е първият ред, който се изпълнява. При извикването на `countServices` функцията **започва да се изпълнява веднага** и записва „1“; когато стигне до първия `await`, се отделя настрана и връща на онзи, който я е извикал, изчакващ promise. Затова „B“ излиза преди „2“: главната програма продължи със следващия си ред, докато заявката пътуваше. Когато главната програма стигне до `await pending`, се отделя и тя; заявката приключва, функцията продължава и записва „2“, нейният promise се изпълнява с 5, а главната програма продължава и записва „C“. Така го показва Chrome 154. Ако си предсказал A, B, 1, 2, C, помислил си, че функцията не започва, докато някой не я изчака; ако си предсказал A, 1, 2, B, C, помислил си, че `await` замразява цялата програма. И двете грешки са често срещани и затова си струва да го видиш веднъж.

## Как разбирам, че съм успял

- [ ] Със сервирана на компютъра ти папка `programas/` на хранилището `08-traer-datos/fig08_01.html` показва `ok: true` и `servicios recibidos: 5`; `fig08_02.html` показва `ok: false` и `estado HTTP: 404`, без да се изпълни `.catch`.
- [ ] `fig08_03.html` показва един ред, който е пристигнал добре, и един, който се е провалил с код 404.
- [ ] В твоето табло обобщението казва 5, 4 от 5, 1 и 465 ms, заглавната част казва датата и часа, в които са пристигнали данните, а `js/services.js` вече не съществува.
- [ ] Когато натиснеш „Revisar ahora“, часът в заглавната част се записва наново и фокусът остава на бутона.
- [ ] С адрес, сменен на `data/missing.json`, конзолата показва твоето съобщение с кода 404 и нищо друго не се чупи.
- [ ] Подреждането и изборът на услуга работят както в урок 7.
- [ ] Търсиш `innerHTML` във файловете си `.js` и не се появява.

**Преговор на предишни уроци** (отговори, без да гледаш, и после провери):

1. В урок 0: кои две неща пътуват в един HTTP отговор преди съдържанието и кое от тях е кодът 404?
2. В урок 6: какво връща `averageResponseMs`, когато никоя услуга няма измерване, и защо `null`, а не нула?
3. В урок 7: защо `js/view.js` използва `textContent`, а не `innerHTML`, дори данните да идват от собствения ти сървър?

## За допълнително четене

- [MDN — Използване на Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) — справката за `fetch`: `ok`, тялото, заглавните части и видовете грешки; посетено на 7 октомври 2026 г.
- [MDN — Как да използваш promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) — `.then`, `.catch` и веригата, стъпка по стъпка; посетено на 7 октомври 2026 г.
- [MDN — `async function`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) — какво връща една `async` функция и как се държи `await` вътре в нея; посетено на 7 октомври 2026 г.
