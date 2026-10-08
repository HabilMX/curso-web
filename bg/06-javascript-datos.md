# Урок 6 — JavaScript и моделът на данните

**Време:** 90 минути (или 2 × 45)

**Какво изграждаш:** данните на таблото и изчисленията по тях

**Какво научаваш:** стойности, обекти, масиви и функции; решения, цикли и грешки; модули; масивът с услугите, колко от тях работят и средното време за отговор

**Откъде идваш.** Носиш таблото от [Урок 5](05-pagina-adaptable.md): HTML със смисъл от [Урок 2](02-html-con-significado.md), стиловия лист от Урок 3 и подредбата от уроци 4 и 5, която се нагажда от 320 до 1440 px. Таблото изглежда добре, но **всичко, което казва, е написано на ръка**: „5 проверени услуги“, „4 от 5 налични“, „1 паднала“, „465 ms“ средно време за отговор. И четирите числа ги събра ти с калкулатор в Урок 2, а ако днес се промени една услуга, трябва да ги събереш отново. Точно това маха този урок. Работиш в папката си `revisor`, в подпапката `js/`, която създаде в [Урок 1](01-entorno-ciclo-trabajo.md), и продължаваш да сервираш всичко с `python3 -m http.server 8000 --bind 127.0.0.1`: нито една стъпка от този урок не изисква да инсталираш още нещо.

**Какво не прави този урок.** Не пипа страницата. Резултатите от днешните програми се появяват в **конзолата** на инструментите на браузъра, а не в таблото. Как се изчертават в таблицата е темата на [Урок 7](07-dom-eventos-estado.md), а откъде идват данните, когато не са написани в самата програма, е темата на [Урок 8](08-traer-datos.md). Днес първо се решава основният проблем: **как се представя една услуга, как се пази списък от тях и как се изчисляват числата от този списък**.

## След урока ще можеш да

- Запазваш стойност с `const` или `let`, казваш от какъв тип е с `typeof` и обясняваш защо `120 === "120"` дава `false`.
- Представяш една услуга като обект със свойства, а списъка с услуги като масив от обекти, и четеш или променяш всяка тяхна данна.
- Обхождаш масив с `filter`, `map`, `find`, `some`, `every` и `reduce`, или стъпка по стъпка с `for…of`; вземаш решение с `if`, `else` и тернарния оператор; сигнализираш за грешка с `throw` и я прихващаш с `try…catch`, и четеш `new` и трите точки `...`, когато се появят.
- Пишеш двете изчисления на таблото —колко услуги са налични и средното време за отговор— като функции, които получават списъка и връщат число.
- Обясняваш защо небрежно изчислена средна стойност дава 372 ms там, където верният отговор е 465, и я поправяш.
- Разделяш програмата на модули (`export` и `import`), зареждаш я с `<script type="module">` и обясняваш защо този модул не се отваря с двойно щракване.
- Четеш петте най-чести съобщения за грешка на този етап и казваш какво ги е причинило.

## Защо, преди как

Погледни обобщението на таблото, както остана в Урок 2. Казва, че има 5 услуги, че 4 са налични, че 1 е паднала и че средното време за отговор е 465 ms. Всяко от тези числа е получено, като е погледната таблицата и е направена сметка. Сега си представи, че дежурният на пощенската услуга поиска тя да бъде добавена към таблото: трябва да се напише нов ред в таблицата и, **отделно**, да се смени 5 на 6, „4 от 5“ на „5 от 6“ и да се преизчисли средното. Ако забравиш едно от четирите, таблото си противоречи: таблицата брои шест реда, а обобщението казва пет. В Упражнение 3 от Урок 2 го направи на ръка и видя колко трудно е да не сгрешиш.

Проблемът е, че **една и съща данна е записана на две места**, а две копия на една данна винаги в крайна сметка се разминават. Решението е да я запишеш само веднъж, на място, което една програма може да чете, а всичко останало —редовете на таблицата, 5-ицата, „4 от 5“, 465-те ms— да се получава оттам. Това е идеята на този урок и на следващия: **данните стоят отделно, а онова, което се вижда, се изчислява от тях**.

За това е нужен програмен език, а езикът на уеба е **JavaScript**. Това е езикът, който всички браузъри изпълняват сами, без нищо за инсталиране: HTML казва какво е всяко нещо, CSS казва как изглежда, а JavaScript казва какво прави. Не го бъркай с Java, който е друг език без връзка с него (приликата в имената е историческа и подвеждаща). [Спецификацията му се казва **ECMAScript**](https://tc39.es/ecma262/) и се публикува всяка година от Ecma International; [действащото издание през октомври 2026 г. е 17-ото, от юни тази година](https://ecma-international.org/publications-and-standards/standards/ecma-262/). За това, което правиш днес, не ти трябва да знаеш какво носи всяко издание, но си струва да знаеш, че съществува стандарт със собственик и версия, също като HTML и CSS: онова, което учиш, работи по един и същ начин във всички браузъри.

### Как се изпълнява една програма в браузъра

Програмата е списък от инструкции, които се изпълняват **една след друга, отгоре надолу**. Браузърът носи двигател, който ги чете и изпълнява. Има два начина да видиш какво прави. Първият е **конзолата** на [инструментите на браузъра](https://developer.chrome.com/docs/devtools/console): отвори ги с `F12` и влез в раздела „Конзола“. Там се появява всичко, което програмата изпрати за печат с `console.log(...)`, а също и грешките. Вторият начин е самата страница, която от Урок 7 нататък ще се изчертава с данните.

Днес работиш само с конзолата. Всяка програма в този урок е страница, чиято единствена задача е да изпълни една програма и да остави резултата ѝ на показ. Всяка има текст, който казва „Abre la consola de las herramientas del navegador (F12) para ver el resultado“ (Отвори конзолата на инструментите на браузъра (F12), за да видиш резултата), и това е единствената видима част. Намират се в [`programas/06-javascript-datos/`](https://github.com/HabilMX/curso-web/tree/main/programas/06-javascript-datos), в хранилището на курса. За да ги изпълниш, изтегли го и от тази папка [стартирай локалния сървър и отвори страницата](https://docs.python.org/3/library/http.server.html):

```bash
$ python3 -m http.server 8000 --bind 127.0.0.1
Serving HTTP on 127.0.0.1 port 8000 (http://127.0.0.1:8000/) ...
```

(Важното е, че остава да чака: терминалът не ти връща управлението. За да го спреш, `Ctrl`+`C`.) Всеки път, когато промениш файл, презареждай страницата с `Ctrl`+`Shift`+`R`.

### Програма, която се вижда отвън: онова, което написа на ръка, изчислено

Преди да влезем в синтаксиса, конкретната цел. В края на урока ще имаш три малки файла в папката си `js/`: един с данните, един с двете изчисления и един, който ги използва. А когато отвориш таблото, ще видиш в конзолата тези четири реда:

```text
Disponibles: 4
Caídos: 1
Respuesta promedio: 465 ms
{"available":4,"down":1,"averageMs":465}
```

Същите числа, които написа на ръка в Урок 2, но вече произведени от програма по данните. Ако добавиш услуга и презаредиш, те се променят сами. С тази цел пред очи пътят има три отсечки, по една за всяко понятие: първо най-простите стойности, после обектите и масивите, с които се представят данните —и, заедно с тях, как една програма решава, повтаря и сигнализира за грешка—, и накрая как програмата се разпределя във файлове.

## Понятията

### 6.1 Стойности и променливи

#### 6.1.1 Стойностите на таблото

Данните за една услуга са от малко видове. Името („Catálogo“) е **текст**, който в програмирането се нарича **низ** (*string*) и се пише в кавички. Времето за отговор (120) е **число**. Дали една услуга работи или не, е въпрос с отговор да или не, и стойността му се нарича **булева** (*boolean*): `true` или `false`. И има две стойности, които означават „нищо“ и които в началото се бъркат: `null` и `undefined`. Затова си струва да ги видим и шестте заедно. Според [ръководството на MDN за граматиката и типовете](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types) JavaScript има осем вида стойности: седем примитивни (булева, `null`, `undefined`, число, `BigInt`, низ и символ) и един съставен, обектът. В този курс ще използваш низове, числа, булеви стойности, `null` и `undefined`, и обекти; `BigInt` и символите не се появяват.

Отвори `fig06_01.html` и конзолата му:

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

Конзолата показва:

```text
string number boolean
Catálogo respondió en 150 ms
object undefined
false true
0.30000000000000004 false
NaN true
```

Ред по ред:

- `const name = "Catálogo";` **декларира променлива**: име, което пази стойност. После можеш да използваш `name` навсякъде, където е нужен текстът. `typeof` пита от какъв тип е една стойност и връща `"string"`, `"number"` или `"boolean"`; според [оператора `typeof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof) това е името на типа.
- `let responseMs = 120;` също декларира променлива, но с `let`, защото стойността ѝ ще се промени: `responseMs = responseMs + 30;` запазва нова стойност (150). Шаблонът с обратни кавички, `` `${name} respondió en ${responseMs} ms` ``, се нарича [шаблонен низ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) (*template literal*): каквото е между `${` и `}`, се изчислява и се вмъква в текста.
- `typeof noAnswer` дава `"object"` за `null`. Това е странност от зората на езика, [грешка, която никога не е била поправена, за да не се счупят старите програми](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof). Не означава, че `null` е обект. Ако трябва да разбереш дали нещо е `null`, сравни го директно: `valor === null`.
- `120 === "120"` дава `false`, а `120 == "120"` дава `true`. Ето правило, което ти спестява цял следобед: **сравнявай винаги с три знака, `===`**. Тройното равно сравнява стойността *и* типа ѝ; двойното равно се опитва да преобразува едната от двете, преди да сравни, а тези преобразувания имат неинтуитивни правила (ги изброява [статията на MDN за равенството](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness)). Няма нито един случай в `revisor`, в който `==` помага, а има много, в които пречи.
- `0.1 + 0.2` дава `0.30000000000000004`. Това не е грешка на JavaScript, а на начина, по който се пазят числата с десетични знаци във всеки език, който използва стандарта IEEE 754: всички числа в JavaScript са с плаваща запетая от 64 бита, според [документацията на `Number`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number), с около 15 до 17 значещи цифри. Някои прости десетични дроби не се побират точно в двоична система и се приближават. Практическо следствие: **не сравнявай с `===` резултата от сметка с десетични знаци, очаквайки точна стойност**; сравнява се с допуск (разликата да е по-малка от, да речем, `0.000001`) или се работи с цели числа, а за пари —в стотинки. Сравнението с `===` е вярно, когато числото не е излязло от сметка, като `120`, написано направо: проблемът не е в `===`, а в закръглението на сметката. Времената за отговор на таблото са цели милисекунди, така че днес няма да се натъкнеш на това; но си струва да си го видял веднъж.
- `Number("abc")` дава [`NaN`, което означава „не е число“](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN) (*not a number*) и е, колкото и странно да звучи, стойност от тип число. Тъй като `NaN === NaN` дава `false`, за да попиташ дали нещо е `NaN`, сравнението не върши работа; най-ясният начин е `Number.isNaN(valor)`. Има и други, като `valor !== valor` (`NaN` е единствената стойност, различна от самата себе си), но този се чете като трик, и в този курс се използва `Number.isNaN`. Ще се появи по-нататък като симптом на зле направена сметка.

#### 6.1.2 `const`, `let` и защо вече не `var`

Вече си използвал два начина за деклариране. Третият, `var`, е онзи от старите уроци, и в този курс не се използва. [Таблицата на MDN го обобщава](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types): `var` живее в цялата функция, където е декларирана (а ако е декларирана извън всяка функция, в целия модул или целия скрипт, според [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var)), „издига се“ (получава съществуване, със стойност `undefined`, от началото на тази област, дори да я декларираш по-надолу) и позволява да декларираш същото име отново, без да възрази, докато `let` и `const` живеят само в двойката фигурни скоби, където са декларирани, и не съществуват преди декларацията си. Грешка, която `var` крие, `let` и `const` я изкрещяват, и точно това искаме.

Правилото на курса е: **използвай `const` по подразбиране; използвай `let` само когато наистина ще присвояваш наново**. Това няма връзка със скоростта, а с четенето: ако видиш `const total = ...`, знаеш, че `total` няма да се промени никъде по-надолу; ако видиш `let total`, знаеш, че трябва да потърсиш къде се променя.

Има нюанс, който изненадва. `const` пречи да *присвоиш наново* името, но не пречи да *промениш съдържанието* на стойността, ако тя е обект или масив. Ще го видиш в следващия раздел.

### 6.2 Обекти, масиви и функции: моделът на данните

Тук е сърцето на урока. Единичните стойности не стигат: една услуга не е нито число, нито текст, тя е *съвкупност от данни, които вървят заедно* (име, състояние, време), а таблото няма една услуга, а *списък* от тях. Трябват два начина за групиране: обектът, който събира данни от различен вид под имена, и масивът, който събира много неща в определен ред. JavaScript позволява в един и същ масив да се смесват стойности от всякакъв тип (текстове, числа, обекти, други масиви); в таблото, по навик и за да се чете лесно, всеки масив пази неща от един-единствен вид: само услуги.

#### 6.2.1 Обектът: една услуга

**Обектът** е колекция от двойки **име: стойност**, записана във фигурни скоби. Имената се наричат **свойства**. Така се представя една услуга на таблото:

```js
const service = {
  id: "catalog",
  name: "Catálogo",
  status: "available",
  responseMs: 120,
  url: "https://catalogo.example/salud",
};
```

Четири проектантски решения, които тежат повече от синтаксиса:

- Имената на свойствата са **на английски** (`name`, `status`, `responseMs`), а стойностите, които се показват на читателя, са на испански. Това е конвенция на курса: онова, което е код (имена на файлове, на свойства, на функции), остава еднакво във всички издания и съвпада с техническата документация, която е на английски; онова, което чете човекът, се превежда.
- `status` е текст с **две възможни стойности**, `"available"` и `"down"`. Нарочно не е булевата стойност `isUp`: текстът допуска повече стойности от да/не, без да променя формата на данната, а утре може да има трето състояние, например „бавна“.
- `responseMs` носи **мерната единица в името**. Едно голо число („120“) не казва дали са секунди или милисекунди; `responseMs` го казва. Това е навик, който спестява грешки: единицата е в името, а не в паметта на онзи, който чете.
- `id` е различно от `name`: името е онова, което се показва, и може да се промени („Catálogo“ става „Catálogo de productos“); `id` е онова, което идентифицира услугата, и не се променя.

Свойство се чете с точка (`service.name`) или с квадратни скоби и кавички (`service["status"]`). Квадратните скоби вършат работа, когато името на свойството е в променлива. [Свойство се променя като променлива](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects): `service.responseMs = 135;`. И ето какво казвах преди: `service` е декларирана с `const`, а въпреки това може да се промени `service.responseMs`. `const` пази името `service` да сочи все към същия обект; не замразява съдържанието на обекта.

Ако поискаш свойство, което не съществува, няма грешка: получаваш `undefined`. А ако поискаш свойство *на* нещо, което е `undefined` или `null`, грешка има, и тя е най-честата от всички (ще я видиш в „Грешката, която ще видиш“). За тези ситуации има два оператора. **Опционалното верижно свързване** `?.` казва „ако онова отляво е `null` или `undefined`, не продължавай и върни `undefined`“; според [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) е налично във всички браузъри от юли 2020 г. [**Операторът за нулево обединяване**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing) (*nullish coalescing*) `??` казва „ако онова отляво е `null` или `undefined`, използвай това друго“; наличен е във всички браузъри от 2020 г. ([изследователят на функциите на платформата](https://web-platform-dx.github.io/web-features-explorer/features/nullish-coalescing/) го обявява за „широко достъпен“ от март 2023 г., етикетът, който се дава 30 месеца след като го е получил и последният браузър). Заедно се четат така: `service.owner?.team ?? "sin responsable"`.

Отвори `fig06_02.html` и ще видиш всичко това заедно:

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

Конзолата показва:

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

В тази страница се появяват още три неща. **Деструктурирането**, `const { name, responseMs } = service;`, изважда от един обект няколко свойства наведнъж в променливи със същото име ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)). **Разпростирането** (*spread*), `{ ...service, status: "down" }`, копира свойствата на един обект в друг, нов, и позволява да промениш някои от тях, и е плитко копие: копира едно ниво, не обектите, които има вътре в обектите ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)). След `copy`, `service.status` все още е `"available"`: оригиналът не е променен. И **JSON**.

#### 6.2.2 JSON: обектът, превърнат в текст

`JSON.stringify(service)` превръща обекта в текст, а `JSON.parse(texto)` върви в обратната посока. Този текст е JSON (*JavaScript Object Notation*): формат за записване на данни, който **може да чете всеки език**, не само JavaScript. Това е форматът, в който таблото ще получава данните си в Урок 8, а стандартът, който го определя, е кратък, [ECMA-404](https://ecma-international.org/publications-and-standards/standards/ecma-404/) ([RFC 8259](https://www.rfc-editor.org/rfc/rfc8259) на IETF е неговият еквивалент за интернет).

Прилича на обект на JavaScript, но е по-строг, и разликите са онези, които пораждат грешките на начинаещите, според [таблицата на MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON): имената на свойствата **винаги** са в двойни кавички, низовете също са в двойни кавички (никога в единични), **коментари не се допускат**, **не се допуска завършваща запетая** след последния елемент, и `undefined` не съществува. Един JSON файл с излишна запетая не се чете, а съобщението за грешка, което дава `JSON.parse`, се различава според браузъра. Днес не работиш с JSON файлове; нужно е само, когато се появят, да разпознаеш, че са начин да се запише онова, което вече умееш да записваш в JavaScript.

#### 6.2.3 Масивът: списъкът с услуги

**Масивът** (*array*) е подреден списък от стойности в квадратни скоби. Елементите се номерират от **нула**: първият е `services[0]`, вторият `services[1]`, а броят им е в `services.length`. Това номериране от нула е причината за най-честата грешка с масиви: масив от пет елемента има позиции от 0 до 4, а ако поискаш петата, получаваш `undefined`. За да поискаш последния елемент, без да броиш, има `.at(-1)`: отрицателните числа броят от края, а [`at()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at) е наличен във всички браузъри от март 2022 г.

Списъкът с услуги на таблото е масив от обекти, по един за всеки ред от таблицата:

```js
const services = [
  { id: "catalog", name: "Catálogo", status: "available", responseMs: 120 },
  { id: "payments", name: "Pagos", status: "available", responseMs: 480 },
  { id: "inventory", name: "Inventario", status: "down", responseMs: null },
  { id: "notifications", name: "Notificaciones", status: "available", responseMs: 310 },
  { id: "search", name: "Búsqueda", status: "available", responseMs: 950 },
];
```

Обърни внимание на падналата услуга: нейното `responseMs` е **`null`**, не `0` и не текст като `"sin respuesta"`. Това е най-важното решение в модела на урока. Паднала услуга **не е отговорила**, а „не е отговорила“ не е същото като „отговори за нула милисекунди“: ако използваш `0`, средното ще я възнагради за това, че е паднала. `null` казва точно „тук няма данна“. Текстът „sin respuesta“, който виждаш в таблицата, е работа на представянето; данната пази `null`.

Сега, онова, което се прави с един масив, е почти винаги едно и също: **да зададеш въпроси на всичките му елементи наведнъж**. За това има методи, и всеки получава функция, която казва какво да се направи с всеки елемент. Преди да ги видим, тази функция.

#### 6.2.4 Функции: именувани инструкции

**Функцията** е парче програма с име, което получава входни данни (**параметри**), прави нещо и връща резултат с `return`. Декларира се така:

```js
function countByStatus(list, status) {
  return list.filter((service) => service.status === status).length;
}
```

`countByStatus` получава списък и състояние и връща колко от услугите в списъка имат това състояние. Използва се, като напишеш името ѝ с данните в скоби: `countByStatus(services, "available")` връща `4`. Две свойства правят една функция добра и се прилагат към всички функции на таблото. Първо: да е **чиста**, тоест да не зависи от нищо отвън и да не променя нищо отвън: всичко, което използва, влиза през параметрите ѝ, а всичко, което произвежда, излиза през `return`. Ако я извикаш два пъти със същите данни, дава същото и двата пъти. Второ: да има **една-единствена задача**, и името ѝ да я казва: `countByStatus` брои; `averageResponseMs` усреднява. Такава функция може да се тества сама и може да се използва повторно; Урок 7 ще ги извиква от няколко места.

Вътре в `countByStatus` се появява **стрелкова функция**: `(service) => service.status === status`. Това е функция без име, записана накратко: отляво на стрелката са параметрите; отдясно е онова, което връща ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)). Равностойна е на `function (service) { return service.status === status; }`. Използва се най-вече, за да се подаде на методите на масивите, които са следващата тема.

#### 6.2.5 Методите на масива

Отвори `fig06_03.html`:

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

Конзолата показва:

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

Всеки метод получава стрелкова функция и я извиква с елементите, по ред. `filter` и `map` я извикват с **всички**. `find`, `some` и `every`, напротив, спират веднага щом могат да дадат отговора ([MDN го описва](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#iterative_methods)): `find` и `some` при първия елемент, който отговаря на условието, `every` при първия, който не отговаря. При списъка на таблото `some` проверява Catálogo, Pagos и Inventario, намира падналата и вече не поглежда Notificaciones и Búsqueda; `every` спира при Catálogo, която не е паднала. Измерих го, като преброих извикванията: 3 и 1.

- [`filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) връща **нов масив** само с елементите, за които функцията връща `true`. Това е „заявката“ на таблото: наличните са `services.filter((service) => service.status === "available")`, и са 4.
- [`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) връща нов масив със същия размер, в който всеки елемент е онова, което функцията е върнала за оригинала. Тук изважда имената; в Урок 7 ще извади редовете на таблицата.
- [`find`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find) връща **първия** елемент, който отговаря на условието, или `undefined`, ако никой не отговаря. Тук търси услугата с `id`, равно на `"payments"`, и взема нейното `responseMs` (480).
- [`some`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some) пита „отговаря ли **някой**?“, а [`every`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every) пита „отговарят ли **всички**?“. И двата връщат `true` или `false`. Има ли някоя паднала услуга? Да (`some` дава `true`). Всички ли са паднали? Не (`every` дава `false`).
- [`toSorted`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted) подрежда **без да пипа оригинала** и връща подредено копие. Според MDN е наличен във всички браузъри от юли 2023 г., а [изследователят на функциите](https://web-platform-dx.github.io/web-features-explorer/features/array-by-copy/) го обявява за „широко достъпен“ от 4 януари 2026 г. Последният ред го доказва: след като подредиш `available` от по-голямо към по-малко, `available[0].name` все още е „Catálogo“; оригиналът не се е променил.

Функцията за подреждане се нуждае от обяснение, защото именно в нея най-често се спъват. `toSorted` и по-старият му брат `sort` получават **функция за сравнение** с два елемента, `a` и `b`, която връща число: отрицателно, ако `a` е преди, положително, ако е след, нула, ако са равни. `b.responseMs - a.responseMs` връща положително число, когато `b` е по-голямо, тоест `a` отива след: низходящ ред. И уловката: ако не подадеш функция за сравнение, `sort` превръща всичко в текст и го подрежда като текст, така че `[10, 9, 1].sort()` дава `[1, 10, 9]` (измерих го), а не `[1, 9, 10]`, защото „10“ е преди „9“ по азбучен ред. Освен това [`sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) **променя оригиналния масив**; затова правилото на курса е да се използва `toSorted`, който никога не го променя.

#### 6.2.6 Да решаваш, да повтаряш и да сигнализираш за грешка

Досега всяка програма се изпълняваше отгоре надолу, без да прескача нищо: всички редове, по веднъж. Изчисленията на таблото се нуждаят от още три неща. **Да решаваш**: „ако услугата не е отговорила, не я събирай“. **Да повтаряш**: „направи това с всяка услуга от списъка“. И **да сигнализираш за грешка**: „тази данна няма смисъл; спри и го кажи“. Освен това има две части от синтаксиса, които ще виждаш оттук нататък: думата `new` и трите точки `...`. Първо идеята на всяка, после кодът, и накрая две страници, които ги изпълняват всичките.

**Решаване с `if` и `else`.** [Инструкцията `if`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) получава **условие** в скоби: почти винаги израз, който дава `true` или `false`, като `service.status === "available"`. Строго погледнато, `if` приема всяка стойност и я преобразува: `false`, `0`, `""` (празният текст), `null`, `undefined` и `NaN` се броят за неверни (наричат се [*falsy*](https://developer.mozilla.org/en-US/docs/Glossary/Falsy); пълният списък носи още няколко странности), а всичко останало се брои за вярно (*truthy*). Затова `if ("sí")` влиза в блока, а `if (0)` не влиза. В този курс се пишат условия, които вече дават `true` или `false`, за да се четат, без да се мисли за преобразувания. Ако условието е вярно, изпълнява се блокът във фигурни скоби, който следва; ако е невярно, прескача се. С `else` се пише другият път: онова, което се прави, когато условието е било невярно. А когато има повече от два пътя, те се свързват с `else if`: програмата проверява условията по ред и поема **първия** път, чието условие е изпълнено; останалите вече не се проверяват. В ежедневието го правиш, без да мислиш: „ако вали, нося чадър; иначе, ако е слънчево, нося шапка; иначе не нося нищо“. Един детайл за формата: когато блокът има само една инструкция, фигурните скоби могат да се пропуснат и всичко се пише на един ред (`if (button === null) return;`). В този курс се пропускат само при такива къси редове.

**Обръщане на условие с `!`.** [Операторът `!`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_NOT) се чете „не“: `!true` е `false`, а `!false` е `true`. Служи, за да напишеш условието наобратно, без да го променяш: `if (!allUp)` се чете „ако не всички работят“.

**Избор на стойност с тернарния оператор.** Често решението не е „какво правя“, а „коя стойност използвам“. За това има [условен оператор](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator), който се нарича **тернарен**, защото има три части: `condición ? valorSiSí : valorSiNo`. Целият израз *е равен* на едната от двете стойности, така че може да се запази в променлива или да се вмъкне в шаблонен низ. `` responseMs === null ? "sin respuesta" : `${responseMs} ms` `` казва: „ако няма данна, текстът е ‚sin respuesta‘; ако има, е числото с единицата му“. Използвай го, когато всеки път е кратка стойност; ако всеки път има няколко инструкции, `if` се чете по-добре.

**Повторение с `for…of`.** Методите от предишния раздел (`filter`, `map`…) обхождат масива отвътре. Понякога е удобно да го обходиш ти, стъпка по стъпка, и за това служи цикълът [`for…of`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of): `for (const service of services) { … }` изпълнява блока **по веднъж за всеки елемент**, по ред, и във всеки оборот `service` е елементът на този оборот. Декларира се с `const`, защото в рамките на един оборот не се променя; в следващия оборот е друга променлива със следващия елемент. Вътре в цикъла инструкцията [`continue`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/continue) казва „този оборот свършва тук; мини към следващия елемент“. И се появява един съкратен оператор: `total += service.responseMs` е същото като `total = total + service.responseMs` (затова `total` се декларира с `let`: променя се във всеки оборот).

Отвори `fig06_04.html` и преди да погледнеш конзолата **предскажи** какъв ред отпечатва цикълът за Inventario и колко е крайният общ сбор:

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

Конзолата показва:

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

Проследи цикъла оборот по оборот, като че ли си двигателят: `total` започва от 0; в оборота на Catálogo става 120, в този на Pagos 600; в оборота на Inventario условието `service.responseMs === null` е вярно, отпечатва се предупреждението и `continue` прескача останалото от този оборот, така че `total` остава 600; после 910 и 1,860. Pagos поема последния път на своя `if…else if…else`, защото 480 не е `null` и не е по-голямо от 500. А `allUp` е `false`, защото Inventario е паднала, така че `!allUp` е `true`. Обърни внимание, че цикълът прави на ръка същото, което ще направи `reduce` в следващия раздел, и със същата грижа: онази, която не е отговорила, не се събира.

**Сигнализиране за грешка с `throw` и прихващането ѝ с `try…catch`.** Има ситуации, в които една функция не може да си свърши работата: получила е време за отговор, което не е число, или файл, който не съществува. Връщането на каква да е стойност би скрило проблема. Правилното е да **хвърлиш** грешка с инструкцията [`throw`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw): `throw new Error("mensaje")`. В този миг функцията спира и грешката „се изкачва“ до онзи, който я е извикал, и до онзи, който е извикал него, и така докато някой не я прихване. Ако никой не я прихване, програмата спира и конзолата я показва в червено: така изглеждат грешките от раздела „Грешката, която ще видиш“.

Да я прихванеш означава да кажеш предварително „опитай това, а ако се провали, направи онова“. Това е [`try…catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch): в `try { … }` е онова, което може да се провали; ако някоя инструкция хвърли грешка, следващите вътре в `try` **вече не се изпълняват** и програмата скача към блока `catch (error) { … }`, където `error` е онова, което е било хвърлено. След `catch` програмата продължава нормално. Грешката в JavaScript е обект с две свойства, които ще четеш много: `error.name`, видът на грешката (`Error`, `TypeError`…), и `error.message`, текстът, който я обяснява.

**Създаване на обект с `new`.** В `throw` се появи думата `new`. Някои обекти не се пишат с фигурни скоби, а се **произвеждат** с *конструктор*, специална функция, която сглобява обект от определен вид и го оставя готов за употреба. [Операторът `new`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new) е начинът да го поискаш: `new Error("Sin conexión")` произвежда обект за грешка с това съобщение, а `new Intl.NumberFormat("es-MX")` произвежда форматиращ инструмент за числа според испанския от Мексико, който ще видиш в следващия раздел. По конвенция имената на конструкторите започват с главна буква (`Error`, `Intl.NumberFormat`, а по-нататък `AbortController` или `FormData`). В този курс няма да пишеш собствени конструктори; ще използваш само тези, които носи браузърът.

**Трите точки: разпростирането.** Вече го видя в 6.2.1 с обекти: `{ ...service, status: "down" }` копира свойствата на `service` в нов обект и позволява да промениш някои. [Синтаксисът за разпростиране](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) (*spread*) прави същото на още две места. **В масив** `[...times, 210]` създава нов масив с елементите на `times` и още един накрая; `times` не се променя. **В извикване на функция** `Math.max(...times)` „разпилява“ елементите на масива, като че ли си ги написал един по един, разделени със запетаи: `Math.max(120, 480, 310, 950)`. Полезно е с функции, които получават произволен брой аргументи, като `Math.max` или, в Урок 7, `replaceChildren`.

Отвори `fig06_05.html`. **Предскажи** преди това: отпечатва ли се „Esta línea no se ejecuta.“ (Този ред не се изпълнява.)? Какъв е размерът на `times` след създаването на `withMail`?

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

Конзолата показва:

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

Първото извикване на `checkResponseMs` получава число и го връща: отпечатва се 120. Второто получава текста `"rápido"`; `typeof` казва `"string"`, условието на `if` е изпълнено и се хвърля грешката. Следващият ред на `try` никога не се изпълнява, `catch` получава грешката и отпечатва името и съобщението ѝ, и програмата продължава. После `new` произвежда грешка, която не се хвърля (грешката е обект като всеки друг: да я хвърлиш е отделно решение), и форматиращ инструмент, който записва 1,860 със запетаята за хилядите, която се използва в Мексико. Накрая разпростирането: `Math.max(...times)` дава 950; `withMail` има 5 елемента, а `times` остава с 4; и `mailDown` е копие на `mail` с две променени свойства и непроменено име, докато `mail` остава налично.

С това имаш всички части на изчисленията на таблото. Ако искаш да видиш същите идеи с други примери, ръководството на MDN посвещава една глава на [управлението на потока и обработката на грешки](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling) и друга на [циклите](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration).

#### 6.2.7 Изчисленията на таблото

С всичко казано дотук се пишат изчисленията. Първото вече го имаш: `countByStatus`. Второто, средната стойност, е онова, което учи най-много. В `fig06_06.html`:

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

Конзолата показва:

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

`averageResponseMs` прави три неща и всяко е решение:

1. **Оставя само услугите, които носят измерено време** (`filter`). Проверката е [`Number.isFinite(service.responseMs)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite), която отговаря `true` само когато стойността е истинско число: не `null`, не текст като `"120"`, не `NaN`. Паднала услуга носи `null` и остава извън. Обърни внимание, че въпросът е „имам ли число, което да усредня?“, а не „в какво състояние е?“: ако утре се появи ново състояние, да речем „бавна“, с измерено време, тя би влязла в средното, без да се променя функцията.
2. **Ако не остане нито една, връща `null`**, а не число. Да усредниш нищо не е нула: означава да нямаш данна, и пак `null` го казва точно. Без тази защита делението на нула би дало `NaN`.
3. **Сумира с `reduce` и дели на колко са.**

[`reduce`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) е най-трудният за четене метод и онзи, който най-много си струва да се разбере. Обхожда масива с **акумулатор**: променлива, която пази резултата дотук. Получава две неща: функция с два параметъра (акумулатора и текущия елемент), която връща новата стойност на акумулатора, и **началната стойност** на акумулатора. В `answered.reduce((sum, service) => sum + service.responseMs, 0)` акумулаторът `sum` започва от `0`, и за всяка услуга му се прибавя нейното `responseMs`: 0 + 120 = 120, 120 + 480 = 600, 600 + 310 = 910, 910 + 950 = 1,860. Резултатът, 1,860, се дели на 4 и дава 465, числото, което написа на ръка в Урок 2.

Последните редове на страницата показват как се представя число с десетични знаци. С `withoutSearch` (услугите без търсенето) средното е 303.3333333333333; това число, такова, каквото е, не се показва на никого. Има три начина да се закръгли и всеки връща нещо различно: [`Math.round`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round) връща цяло **число** (303); [`toFixed(1)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed) връща **текст** с един десетичен знак („303.3“, и конзолата го потвърждава с `typeof`, който казва `string`), така че с него не може да се продължи със събиране, без да се преобразува; и [`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat), който форматира според езика и държавата, наличен във всички браузъри от 2017 г. С `"es-MX"` използва десетичната точка, която се използва в Мексико. Правилото: **изчислява се с пълни числа и се закръглява само накрая, за да се покаже**.

#### 6.2.8 Средното, което излиза грешно

Има начин да се напише средното, който изглежда правилен и дава различно число, без никаква грешка в конзолата. Той е във `fig06_07.html`:

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

Конзолата показва:

```text
1860 372
1 NaN 51 4
0
TypeError: Reduce of empty array with no initial value
```

Първият ред сумира времената на **всички** услуги, включително падналата, и дели на **пет**. Дава 372 вместо 465. Защо не се провали при събирането на `null`? Защото JavaScript, когато срещне `120 + null`, **превръща `null` в нула**, без да предупреди. Сборът пак е 1,860 (падналата е добавила нула), но делението е на 5, а не на 4. Резултатът е правдоподобно число, 372, което прилича на време за отговор и към което никой не храни подозрение, и таблото би показало погрешното число с пълна увереност. **Това е типичната тиха грешка в данните: няма съобщение, има число, което не е вярното.** Вторият ред показва семейството преобразувания, от което идва: `null + 1` е `1`, `undefined + 1` е `NaN`, `"5" + 1` е `"51"` (`+` с текст слепва) и `"5" - 1` е `4` (`-` преобразува). Може да се научи всяко правило, но е по-евтино да спазваш това: **преди да изчисляваш, провери дали данната съществува**, което е точно онова, което прави `filter` във функцията по-горе.

Последните два реда показват една граница на `reduce`. С празен масив и начална стойност (`0`) връща началната стойност. Без начална стойност се опитва да използва първия елемент като акумулатор, няма първи елемент и хвърля `TypeError` (прихваща го `try…catch` от 6.2.6), чийто текст копирах от конзолата на Chrome: „Reduce of empty array with no initial value“. Друг браузър може да го формулира различно. Правилото: **`reduce` винаги носи начална стойност**.

### 6.3 Модули: разпределяне на програмата във файлове

#### 6.3.1 Защо да се дели

Досега цялата програма живееше в една страница. Това върши работа за един опит и става неуправляемо, щом таблото има данни, изчисления и (от Урок 7) чертане. Има прост начин да подредиш онова, което пишеш: **всеки файл върши едно нещо**. Един файл пази данните, друг изчисленията, трети свързва всичко. Който отвори проекта, знае къде да търси, а файлът с изчисленията може да се използва повторно с други данни.

За да може един файл да използва нещо от друг, е нужен механизъм, и този механизъм е **модулът**. Един JavaScript файл е модул, когато се зарежда като такъв; онова, което декларира вътре, е **частно**, освен ако не го маркираш с `export`, а друг файл го взема с `import`. Трите файла на таблото са:

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

`services.js` експортира масива `services`. `stats.js` експортира три функции: двете изчисления и трета, `summarize`, която ги събира в един обект с трите числа на обобщението. `main.js` импортира онова, от което се нуждае от всеки, изчислява и изпраща резултата към конзолата. Според [документацията на MDN за модулите](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) декларацията `import { services } from "./services.js";` взема по име онова, което другият файл е експортирал с [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) (имената във фигурни скоби трябва да съвпадат точно), а пътят започва с `./`, за да каже „в същата папка като този файл“.

Това е формата на данните, които таблото ще има в следващите уроци. Обърни внимание на `summarize`: връща **обект** с `available`, `down` и `averageMs`. Това е точно обобщението от Урок 2, и в Урок 7 ще се изчертае на екрана.

#### 6.3.2 Как се зарежда един модул

Страницата, която го изпълнява, е `fig06_08.html`:

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

Всичко е на един ред: `<script type="module" src="fig06_08/main.js"></script>`. Атрибутът `type="module"` казва на браузъра, че този файл е модул, а не класически скрипт, според [стандарта на HTML](https://html.spec.whatwg.org/multipage/scripting.html) и [справката за елемента `script`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script). Три следствия от това, които MDN изброява и които си струва да научиш наведнъж:

- **Отлага се сам.** Един модул се изпълнява *след* като браузърът е прочел целия HTML. Не е нужен `defer`, нито да го слагаш в края на `<body>`: може да се зареди от `<head>`.
- **Използва строг режим.** Един модул работи винаги в [строг режим](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode), който превръща в грешки няколко неща, които езикът преди е търпял мълчаливо (например присвояването на стойност на променлива, която никога не си декларирал: без строг режим тази печатна грешка тихо създава глобална променлива; в строг режим е `ReferenceError`).
- **Има собствена област на видимост.** Онова, което модулът декларира, не се вижда отвън, дори от конзолата: ако в `main.js` има променлива `summary`, писането на `summary` в конзолата не я намира. Това е предимство: два файла могат да използват едно и също име, без да се тъпчат. И неудобство за онзи, който дебъгва: за да провериш нещо, го отпечатваш с `console.log`.

Когато отвориш `fig06_08.html` в браузъра, конзолата показва:

```text
Disponibles: 4
Caídos: 1
Respuesta promedio: 465 ms
{"available":4,"down":1,"averageMs":465}
```

Същите четири числа, които написа на ръка, но вече изчислени. А сега стъпката, която затваря урока в проекта: в папката `revisor` сложи трите файла в `js/` (`js/services.js`, `js/stats.js`, `js/main.js`; пътят в `import` не се променя, защото остават в същата папка) и добави в `<head>` на твоя `index.html`:

```html
<script type="module" src="js/main.js"></script>
```

Презареди `index.html`: страницата изглежда точно същата, но в конзолата се появяват четирите реда отгоре. Сравни всеки от тях с онова, което казва обобщението на таблото: 4 налични, 1 паднала, 465 ms. Ако съвпадат, моделът на данните възпроизвежда онова, което си изчислил на ръка. Ако добавиш услуга към масива и презаредиш, числата в конзолата се променят, а обобщението, написано в HTML, не: това ще бъде работата на Урок 7.

#### 6.3.3 Защо не се отваря с двойно щракване

Ако отвориш `fig06_08.html` с двойно щракване във файловия мениджър, адресът започва с `file:///` и конзолата показва червена грешка. Копирах я от Chrome 154 (друг браузър я формулира различно):

```text
Access to script at 'file:///.../programas/06-javascript-datos/fig06_08/main.js' from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: chrome, chrome-experimental-site-token-provider, chrome-extension, chrome-untrusted, data, http, https, isolated-app.
```

Това е онова, което Урок 1 предвиди. Модулите се искат със същия механизъм, с който браузърът иска неща от други сайтове, а този механизъм изисква мрежов протокол (`http` или `https`), не четене от диска. При `file://` произходът на страницата е `null` и заявката се блокира. Решението не е да пипаш браузъра, а да отвориш страницата от локалния сървър (`python3 -m http.server 8000 --bind 127.0.0.1` и `http://localhost:8000/`). Това е причината курсът да инсталира сървъра от първия урок.

## Грешката, която ще видиш

Този етап има пет съобщения, които ще четеш много пъти. Най-добре се научават, като ги предизвикаш нарочно. И петте са копирани от конзолата на Chrome 154 със страниците от [`programas/06-javascript-datos/`](https://github.com/HabilMX/curso-web/tree/main/programas/06-javascript-datos); браузърът, който използваш, може да ги формулира различно, но казват същото.

### `Cannot read properties of undefined (reading 'name')`

Най-честата грешка в JavaScript. Отвори `fig06_09.html`:

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

Конзолата показва, в червено:

```text
Cannot read properties of undefined (reading 'name')
```

Чети я отдясно наляво: програмата поиска да прочете свойството `name` на нещо, което е `undefined`. На какво? На `services[5]`. Масивът има пет елемента, с позиции от 0 до 4, а ако поискаш петата, получаваш `undefined`; а да поискаш свойство от `undefined` е грешка ([MDN го обяснява по-подробно](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cant_access_property)). Отдясно на съобщението конзолата показва файла и реда, на който е станало; ако щракнеш върху него, инструментите отварят този ред. Решенията са две: да се увериш, че не надхвърляш края (`services.length`, `.at(-1)`), или, ако елементът може да не съществува, да използваш `?.`: `services[5]?.name` дава `undefined` без грешка.

### `Assignment to constant variable.`

Във `fig06_10.html`, `const total = 0; total = total + 120;`:

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

Съобщението е буквално това и казва какво си направил: опитал си да присвоиш наново `const` ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Invalid_const_assignment)). Ако стойността ще се променя, променливата е трябвало да бъде `let`.

### `Cannot use import statement outside a module`

Във `fig06_11.html`, същият `main.js`, но с `<script src="...">` без `type="module"`:

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

Конзолата показва:

```text
Cannot use import statement outside a module
```

Един `import` се разбира само в модул; класическият скрипт не знае какво е. Поправя се, като добавиш `type="module"` към `<script>`.

### `The requested module './fig06_08/services.js' does not provide an export named 'servicios'`

Във `fig06_12.html` един модул иска име, което другият файл не експортира:

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

Конзолата показва:

```text
The requested module './fig06_08/services.js' does not provide an export named 'servicios'
```

Казва ясно кой файл и кое име. Файлът експортира `services` (на английски), а тук е поискано `servicios`: грешно написано име, а имената трябва да съвпадат знак по знак. Поправя се, като напишеш името така, както е в `export`.

### `Access to script ... has been blocked by CORS policy`

Това е онова от раздел 6.3.3, което излиза, когато отвориш с двойно щракване, вместо да използваш сървъра.

## Какво се прави погрешно

**Да пишеш `var`.** Вече видя защо: живее в цялата функция, издига се и позволява повторна декларация, така че крие грешки, които `let` и `const` показват. Цена: име, което сменя стойността си от ъгъл на програмата, който не си очаквал.

**Да сравняваш с `==`.** `120 == "120"` дава `true`; в табло, което получава данни отвън, време, което пристига като текст, би минало сравненията като число. С `===` несъответствието се набива на очи.

**Да пазиш число като текст.** `responseMs: "120"` изглежда същото и вече не е: `"120" + 1` дава `"1201"`. Данните, които са количества, се пазят като числа, без кавички, а единицата е в името.

**Да представяш „не е отговорила“ с `0`, с `""` или с `"sin respuesta"`.** С `0` средното възнаграждава паднала услуга; с текст сумата се превръща в слепване или в `NaN`. Липсваща данна се пази като `null`, а функциите решават какво да правят с нея.

**Да усредняваш без филтриране.** Това е 372 вместо 465 от 6.2.8: правдоподобно число, без грешка и погрешно. Преди да усредниш, трябва да останеш само с онова, което има данна.

**Да използваш `sort()` там, където искаш копие.** `sort` променя оригиналния масив и онзи, който го е използвал по-горе, го вижда преподреден, без да знае защо. С `toSorted` това не се случва. А без функция за сравнение подрежда като текст: `[10, 9, 1]` дава `[1, 10, 9]`.

**Да продължаваш да смяташ с число, вече закръглено до текст.** `toFixed` връща текст. Ако го събереш, слепваш. Закръглява се накрая, само за да се покаже.

**`reduce` без начална стойност.** Работи до деня, в който масивът пристигне празен, и тогава хвърля `TypeError` в най-лошия момент.

**Едни и същи данни, записани на две места.** Това е проблемът, с който започва урокът: таблицата казва шест реда, а обобщението казва пет. Данните живеят на едно място; всичко останало се изчислява.

## Упражнения

### Упражнение 1 — Добави услуга и гледай как се променят числата

В твоето копие на `services.js` добави шеста услуга: `Correo`, `id` `"mail"`, налична, с 210 ms. Без да пипаш `stats.js` и `main.js`, презареди страницата и запиши трите числа. Преди да презаредиш, предскажи числата: колко налични услуги ще има и колко ще е средното. Съвпада ли предсказанието с онова, което излиза?

### Упражнение 2 — Най-бавните

Напиши в `stats.js` функция `slowest(list, n)`, която връща **имената** на `n` налични услуги с най-голямо време за отговор, от най-бавната към най-бързата. Не бива да променя списъка, който получава. Изпробвай я с `n = 2`, с `n`, по-голямо от броя на наличните услуги, и с празен списък. Подсказка: свържи във верига `filter`, `toSorted`, `slice` и `map`. От четирите [`slice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) е единственият, който не си виждал: `lista.slice(inicio, fin)` връща **нов** масив с елементите от позиция `inicio` до тази преди `fin`, без да пипа оригинала. `[10, 20, 30].slice(0, 2)` дава `[10, 20]`: първите два.

### Упражнение 3 — Преброй всички състояния наведнъж

`countByStatus` обхожда списъка веднъж за всяко състояние, за което питаш. Напиши `countsByStatus(list)`, която го обхожда **само веднъж** с `reduce` и връща обект с по едно свойство за всяко състояние, което се срещне, например `{ available: 4, down: 1 }`. За празен списък трябва да върне обект без свойства. Подсказка: акумулаторът е обект, а `counts[service.status] ?? 0` ти дава текущия брой или нула, ако състоянието още не е било срещано. И един въпрос за след като го решиш: какво става, ако някоя услуга пристигне със състояние `"toString"`?

### Упражнение 4 — Предизвикай четири грешки и ги прочети

В копие на проекта предизвикай една по една тези четири грешки и запиши точното съобщение, което показва твоят браузър: (а) поискай услуга, която не съществува, и прочети `name` ѝ; (б) импортирай грешно написано име; (в) присвои наново `const`; (г) махни `type="module"` от `<script>`. За всяка напиши в едно изречение какво означава съобщението и коя е поправката.

## Решения

### Решение 1

С шест услуги (пет налични, една паднала) предсказанието е: Disponibles 5, Caídos 1, а средното на петте, които са отговорили, е (120 + 480 + 310 + 950 + 210) / 5 = 2,070 / 5 = 414. Проверих го, като изпълних програмата: дава 414. Падналата услуга продължава да не се брои в средното. Важното в упражнението е онова, което **не** трябваше да пипаш: нито изчисленията, нито главната програма. Промени данните, които живеят на едно място, и всичко останало се преизчисли. Това е печалбата от разделянето на данни и изчисления.

### Решение 2

Филтрират се наличните (падналите нямат време), подрежда се копие от по-голямо към по-малко, взимат се първите `n` и се изважда името:

```js
export function slowest(list, n) {
  return list
    .filter((service) => service.status === "available")
    .toSorted((a, b) => b.responseMs - a.responseMs)
    .slice(0, n)
    .map((service) => service.name);
}
```

С петте оригинални услуги `slowest(services, 2)` връща `["Búsqueda", "Pagos"]` (950 и 480). С `n`, равно на 10, връща четирите налични, `["Búsqueda", "Pagos", "Notificaciones", "Catálogo"]`: `slice(0, n)` не се проваля, ако `n` е по-голямо от дължината, просто връща всичко. С празен списък връща `[]`. Оригиналният списък не се променя, защото `filter` и `toSorted` връщат копия. Ако беше използвал `sort` върху `list`, щеше да преподредиш данните на таблото, без никой да разбере.

### Решение 3

```js
export function countsByStatus(list) {
  return list.reduce((counts, service) => {
    counts[service.status] = (counts[service.status] ?? 0) + 1;
    return counts;
  }, Object.create(null));
}
```

За петте услуги връща `{ available: 4, down: 1 }`, а за `[]` връща обект без свойства (началната стойност, защото няма елементи). Акумулаторът е обектът, който се подава като втори аргумент на `reduce`.

**Защо `Object.create(null)`, а не `{}`.** Това е отговорът на въпроса от условието. Обект, написан като `{}`, не е съвсем празен: [наследява](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) от JavaScript шепа свойства, които не виждаш, като `toString`. Ако една услуга пристигне със състояние `"toString"`, `counts["toString"] ?? 0` не дава `0`, а тази наследена функция, и броят излиза като боклучав текст: `'function toString() { [native code] }1'`. Със състояние `"__proto__"` е по-лошо: присвояването не създава никакво свойство. Измерих го с двете версии. [`Object.create(null)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create) произвежда обект **без нищо наследено**, чист речник, в който има само онова, което ти запазиш, и с него `"toString"` и `"__proto__"` се броят по 1 като всяко друго състояние. Днес състоянията ги пишеш ти, но от Урок 8 нататък ще идват отвън, а данна отвън може да носи какъвто и да е текст. За всяка услуга `counts[service.status] ?? 0` е броят, който вече е имало от това състояние, или нула, ако се появява за първи път; прибавя се едно и се запазва. Това е вариант, в който акумулаторът **се** променя, което е нормалното при `reduce`: онова, което никога не се променя, е списъкът на входа. Ако в бъдеще има трето състояние, `countsByStatus` го брои, без да промениш нито един ред.

### Решение 4

(а) `Cannot read properties of undefined (reading 'name')`. Поискана е позиция, която не съществува, и на получения `undefined` е поискано свойство. Поправка: провери границата на масива или `services[n]?.name`.

(б) `The requested module './services.js' does not provide an export named 'servicios'` (пътят се сменя според файла). Името в `import` не съвпада с това в `export`. Поправка: напиши го еднакво, знак по знак.

(в) `Assignment to constant variable.` Присвоено е наново `const`. Поправка: ако ще се променя, декларирай го с `let`; ако не, не го присвоявай наново.

(г) `Cannot use import statement outside a module`. `<script>` не декларира `type="module"`. Поправка: добави го.

## Как разбирам, че съм успял

- [ ] Когато отвориш `fig06_08.html` от `http://localhost:8000/`, конзолата показва точно четири реда: `Disponibles: 4`, `Caídos: 1`, `Respuesta promedio: 465 ms` и `{"available":4,"down":1,"averageMs":465}`, и нито една грешка в червено.
- [ ] Твоят `index.html` зарежда `js/main.js` с `<script type="module">`, изглежда както преди, и конзолата показва същите четири реда, които съвпадат с числата, написани в обобщението.
- [ ] Когато отвориш `fig06_08.html` с двойно щракване (`file://`), се появява грешката за CORS и можеш да обясниш защо.
- [ ] `fig06_07.html` показва `1860 372` и можеш да обясниш защо 372 е погрешно, а 465 е правилно.
- [ ] Ако добавиш пощенската услуга с 210 ms, конзолата показва 5 налични, 1 паднала и 414 ms, без да пипаш `stats.js`.
- [ ] Можеш да напишеш по памет функция, която получава списъка с услуги и връща колко са в дадено състояние, с `filter` и `length`.
- [ ] Можеш да обясниш със свои думи разликата между `const` и `let`, между `===` и `==`, между `sort` и `toSorted`, и защо паднала услуга има `responseMs: null`, а не `0`.

## Обобщение

Отговори, без да гледаш урока:

1. Какъв тип стойност дава `typeof` за `120`, за `"120"` и за `true`? И защо `120 === "120"` дава `false`?
2. Каква е разликата между `const` и `let` и кое използваш по подразбиране?
3. Как се представя една услуга и как списъкът с услуги? Защо падналата услуга носи `null`, а не `0`?
4. Какво връща `filter`, какво `find`, какво `some`? Кое променя оригиналния масив, `sort` или `toSorted`?
5. Кои две неща трябва да направи една функция за средна стойност, преди да раздели?
6. В един `try…catch` какво става с редовете на `try`, които следват онзи, който е хвърлил грешка? И кога е по-удобен тернарен оператор вместо `if`?
7. Кое число излиза, когато усредниш петте услуги на таблото, без да филтрираш падналата, и защо не е правилното?
8. Какво прави `type="module"` в един `<script>` и защо един модул не се зарежда с `file://`?

## За допълнително четене

- [MDN, „Ръководство за JavaScript“](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide) — официалното ръководство на Mozilla, от граматиката и типовете до модулите, в същия ред като този урок. На английски, както почти цялата официална документация. Посетено на 7 октомври 2026 г.
- [MDN, „JavaScript модули“](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) — `import`, `export`, областта на видимост на един модул и грешката при `file://`. Посетено на 7 октомври 2026 г.
- [MDN, „Индексирани колекции“](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Indexed_collections) — масивите и методите им с повече примери. Посетено на 7 октомври 2026 г.
- [Спецификация на езика ECMAScript](https://tc39.es/ecma262/) — крайният източник за значението на всеки оператор; не е текст за учене, а за справка, когато съмнение не се разрешава другаде. Посетено на 7 октомври 2026 г.
