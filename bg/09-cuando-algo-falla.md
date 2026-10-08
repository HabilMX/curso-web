# Урок 9 — Когато нещо се провали: времеви лимити, състояния, CORS и няколко заявки

**Време:** 2 × 45 минути

**Какво изграждаш:** таблото, което винаги казва какво се случва: зарежда се, грешка или празно, с времеви лимит, за да не чака безкрайно

**Какво научаваш:** времеви лимит с `AbortSignal.timeout`; да различаваш повредите по името им; трите състояния: зарежда се, грешка и празно; грешката CORS; няколко заявки наведнъж с `Promise.allSettled`

## След урока ще можеш да

- Слагаш на всяка заявка времеви лимит и различаваш в кода изтекло време от повреда във връзката и от отговор, който не е JSON.
- Превеждаш всяка техническа повреда на изречение, което човекът, който използва таблото, може да разбере.
- Показваш в таблото трите ситуации, които не са „всичко мина добре“: зарежда се, грешка и празно, всяка със своето известие и с начин да бъде обявена на екранен четец.
- Обясняваш защо „празно“ не е грешка и защо не се пази като още една фаза, а се извежда.
- Разпознаваш в конзолата грешката CORS, обясняваш кой я произвежда и кой я поправя.
- Поискваш няколко неща наведнъж, без една повреда да отнесе резултата на останалите, с `Promise.allSettled`.

## Защо, преди как

**Изходна точка.** Този урок тръгва от таблото, както го остави урок 8. Твоето табло вече поисква данните си от `data/services.json`, а структурата, която остана, е тази:

- `index.html`, с празни `<tbody>` и четирите `<dd>` на обобщението, часа в `#checked-at`, бутона `#check-now` („Revisar ahora“, Провери сега), бутона „Ordenar por tiempo de respuesta“ (Подреди по време за отговор) и региона за подробностите (`#detail`).
- `css/styles.css`, стиловият лист от уроци 3, 4, 5 и 7.
- `data/services.json`, с петте услуги.
- `js/load.js`, който поисква данните в две стъпки, проверява `response.ok` и формата на пристигналото, и хвърля грешка, ако нещо не се връзва.
- `js/stats.js`, със `summarize` и двете изчисления от урок 6.
- `js/state.js`, със списъка, часа на пристигане, подредбата и избора, и `loadSucceeded`, за да запази пристигналото.
- `js/view.js`, който чертае състоянието и часа, винаги с `textContent`.
- `js/main.js`, който поисква данните при стартиране и с „Revisar ahora“ и оставя в конзолата всяка повреда.

И един нов файл за днес, `data/services-empty.json`, роднината на списъка за празния случай:

```json
[]
```

Списък без елементи, който е валиден JSON: сървърът ще го предаде с 200 и таблото ще бъде онова, което ще реши какво означава.

**Какво липсва днес на таблото.** Таблото от урок 8 работи, когато всичко мине добре, и **открива** повредите, но не ги **разказва**: оставя ги в конзолата, която никой освен онзи, който програмира, не отваря. Един истински доклад живее в свят, където стават неща, които на локален модул никога не се случват:

1. **Бави се.** Между момента, в който страницата се появи, и момента, в който пристигнат данните, има интервал, който може да е милисекунди или секунди. Какво вижда човекът междувременно? Празна таблица изглежда като счупено табло.
2. **Проваля се.** Сървърът може да е изключен, файлът може да е преместен, връзката може да се прекъсне. Какво вижда човекът тогава? Днес нищо: страницата изглежда замръзнала.
3. **Пристига празно.** Сървърът отговаря добре, но списъкът няма нито една услуга. Не е повреда, но не е и таблица. Какво вижда човекът?
4. **Не отговаря.** Сървърът получава заявката и никога не отговаря. Promise на `fetch` остава изчакващ завинаги, нито се изпълнява, нито се отхвърля, и дори няма грешка, която да се прихване.

Завършеното табло показва **първите три** ситуации като различни екрани и превръща четвъртата в грешка с времеви лимит. Това е четвъртият от петте критерия, по които разбираш, че си завършил курса: *показва трите състояния, зарежда се, грешка и празно*. Този урок ти го оставя изпълнен.

**Защо е толкова важно.** Повечето уроци преподават щастливия път и спират дотам, защото той изглежда добре в демонстрация. Но онзи, който използва табло за услуги, го отваря точно когато подозира, че нещо не е наред. Ако в този момент страницата остане празна или каже „няма услуги“, защото мрежата се е провалила, човекът взема лошо решение: чака, когато е трябвало да действа, или се успокоява, когато е трябвало да се разтревожи. Табло, което лъже при повредите си, е по-лошо от липсата на табло. Затова този урок е, за онзи, който използва `revisor`, най-важният в курса.

**Какъв път следва.** Първо **времевият лимит**, за да не чака една заявка завинаги, и модулът `js/load.js` в пълния му вид, който различава всяка повреда по името ѝ и я превежда на изречение. Второ **трите състояния** на екрана, което е частта, която хората виждат и която почти никой не преподава. Трето, **няколко заявки наведнъж**, които ще трябват на `revisor`, когато проверява много услуги. И накрая грешката, която рано или късно срещне всеки, който иска данни от друго място: **CORS**.

**Какво ти трябва включено.** Само обичайният локален сървър (и, за последната фигура, втори сървър, който ще включиш на място). Страниците на този урок са в [`programas/09-cuando-algo-falla/`](https://github.com/HabilMX/curso-web/tree/main/programas/09-cuando-algo-falla) на [хранилището на курса](https://github.com/HabilMX/curso-web); с хранилището, изтеглено на компютъра ти, стартирай сървъра от неговата папка `programas/`:

```bash
cd programas
python3 -m http.server 8000 --bind 127.0.0.1
```

Отвори `http://127.0.0.1:8000/09-cuando-algo-falla/panel/`. Както в урок 8, `fetch` и модулите не работят с `file://`. Не е нужно нищо друго: нито Node, нито пакети.

## Понятията

Те са три. Както в предишните уроци: преди да изпълниш всяка фигура, **запиши в дневника какво мислиш, че ще се случи**.

### 9.1 Да не чакаме завинаги: времевият лимит

**Проблемът.** Спомни си таблицата от 8.1: promise на `fetch` се изпълнява, когато пристигне отговор, и се отхвърля, когато няма връзка. Но има трети начин една заявка да мине зле и той е най-жестокият, защото не произвежда никаква грешка: **не става нищо**. Сървърът не отговаря, мрежата е увиснала и promise остава изчакващ, нито изпълнен, нито отхвърлен. Табло без времеви лимит остава с „Cargando…“ (Зарежда се…) завинаги; човекът не знае дали да чака, да презареди, или да се откаже. Решението е да решиш колко си готов да чакаш и да прекъснеш там.

Механизмът е **сигнал за прекъсване**. `fetch` приема в опциите си `signal` и ако този сигнал се „активира“, преди заявката да приключи, `fetch` я прекъсва и promise се отхвърля. За случая с времевия лимит има готова част: `AbortSignal.timeout(milisegundos)` създава сигнал, който се активира сам, когато мине това време, а грешката, с която се отхвърля, се казва `TimeoutError` ([MDN: `AbortSignal.timeout`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static)). Използва се така: `fetch(url, { signal: AbortSignal.timeout(3000) })`. Вторият аргумент на `fetch` е обект с опции, като онези, които опозна в урок 6; `signal` е един от ключовете му.

Функцията е сравнително нова: налична е в основните браузъри от април 2024 г., а MDN я етикетира „Baseline 2024“. Тридесетте месеца, които делят „току-що достъпна“ от „широко достъпна“, се изпълват точно около тези дати, така че ако в браузъра ти не се появява, обнови го. Преди нея се пишеше на ръка с `AbortController` и `setTimeout`; вече не е нужно.

За да видиш грешката, е нужен сървър, който наистина се бави, а този на `python3 -m http.server` отговаря за няколко милисекунди. Затова този урок носи собствен, `slow-server.py`: сервира папката като обичайния, но ако адресът носи `?delay=3000`, изчаква тези три хиляди милисекунди, преди да отговори. Не изисква да инсталираш нищо; използва само библиотеката, която носи Python. Изключи обичайния сървър (Ctrl+C) и от папката `programas/` включи този на негово място, на същия порт:

```bash
python3 09-cuando-algo-falla/slow-server.py
```

Сервира същите страници на `http://127.0.0.1:8000/`, така че всичко останало работи по същия начин. Това е кодът му; не е нужно да го пишеш, но си струва да го прочетеш, защото е кратък и вече познаваш почти всичко, което прави:

```python
# slow-server.py
# Sirve una carpeta como lo hace `python3 -m http.server`, pero puede tardar a
# propósito: si la dirección lleva ?delay=MILISEGUNDOS, espera ese tiempo antes de
# contestar. Sirve para ver un tiempo límite que de verdad se agota.
#
# Uso:  python3 slow-server.py [carpeta] [puerto]
import sys
import time
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlsplit

# Nadie necesita esperar más de diez segundos para ver el efecto.
MAX_DELAY_MS = 10000


class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        query = parse_qs(urlsplit(self.path).query)
        delay = query.get("delay", ["0"])[0]
        if delay.isdigit():
            time.sleep(min(int(delay), MAX_DELAY_MS) / 1000)
        try:
            super().do_GET()
        except (BrokenPipeError, ConnectionResetError):
            # El navegador se cansó de esperar y cerró la conexión: es justo lo que se quería ver.
            pass


def main():
    folder = sys.argv[1] if len(sys.argv) > 1 else "."
    port = int(sys.argv[2]) if len(sys.argv) > 2 else 8000
    server = ThreadingHTTPServer(
        ("127.0.0.1", port), partial(Handler, directory=folder)
    )
    print(f"Sirviendo {folder} en http://127.0.0.1:{port}, con ?delay  (Ctrl+C para parar)", flush=True)
    server.serve_forever()


main()
```

Важното е в `do_GET`, функцията, която обслужва всяка заявка: чете числото, което идва след `delay=`, заспива за това време с `time.sleep` (който брои в секунди, затова се дели на хиляда) и после отговаря като обичайния сървър. Другите две части: `ThreadingHTTPServer` обслужва всяка заявка поотделно, за да не спре една заспала заявка останалите; и последният `except` заглушава предупреждението, което Python би дал, когато браузърът, уморен да чака, затвори, преди да получи отговора, което е точно онова, което искаме да предизвикаме. Останалото (`?delay` се игнорира, ако не е число, и никога не се чака повече от десет секунди) е, за да не го използва някой по погрешка, за да увеси компютъра ти.

Фигура 9.1 поисква данните с `?delay=3000` и лимит от **една секунда**. Сървърът се бави три; лимитът печели винаги, защото разликата не е от милисекунди, а от цели две секунди. При подготовката на този урок даде `TimeoutError` в 10 от 10 зареждания в Chrome 154, винаги на една секунда от началото. И контролният опит, също в 10 от 10: сервирана с обичайния `python3 -m http.server`, който не разбира `?delay` и отговаря веднага, същата страница казва „alcanzó a responder: el límite no se cumplió“ (успя да отговори: лимитът не се изпълни). Ако видиш това изречение, не е грешка в твоя код: имаш включен сървъра, който не се бави.

```html
<!-- fig09_01.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 9.1 — el tiempo límite</title>
</head>
<body>
  <main>
    <h1>Fig. 9.1 — el tiempo límite</h1>
    <pre id="output">Cargando…</pre>
  </main>

  <script type="module">
    const output = document.querySelector("#output");

    try {
      // Un límite de 1 segundo para una respuesta que slow-server.py demora 3 (?delay=3000).
      // Con el servidor de siempre, ?delay se ignora y la respuesta llega a tiempo.
      await fetch("panel/data/services.json?delay=3000", { signal: AbortSignal.timeout(1000) });
      output.textContent = "alcanzó a responder: el límite no se cumplió";
    } catch (error) {
      output.textContent = `nombre del error: ${error.name}\nmensaje: ${error.message}`;
    }
  </script>
</body>
</html>
```

```text
nombre del error: TimeoutError
mensaje: signal timed out
```

Съобщението, `signal timed out`, е текстът на Chrome; Firefox пише друг, но **името** на грешката е същото във всички браузъри, защото го определя спецификацията. Затова кодът пита винаги за името и никога за съобщението. Името на грешката е `TimeoutError`. Това е начинът в кода да се различи „не отговори навреме“ от „няма връзка“ (`TypeError`). Има друго подобно име, `AbortError`, което се появява, когато някой отмени нарочно с `AbortController`; днес не го използваш.

Две технически уточнения, които излизат скъпо, ако не ги знаеш. Първото: **лимитът продължава да тече, докато се чете тялото.** Ако сървърът прати заглавните части веднага, но остане наполовина със съдържанието, promise на `fetch` се изпълнява и е `response.json()` онзи, който се отхвърля с `TimeoutError`, когато стигне лимита. Това е уточнението, което последният ред от таблицата в 8.1 оставяше висящо: изтеклото време отхвърля promise на `fetch` само ако стане **преди** да пристигнат заглавните части; след това promise вече е изпълнен и не може да се „разизпълни“, така че онова, което се отхвърля, е четенето на тялото. В един опит със сървър, който изпращаше началото на масив и чакаше четири секунди за останалото, с лимит от една секунда заглавните части пристигнаха на 2 ms, а четенето на тялото се отхвърли с `TimeoutError` на 1005. Затова кодът на таблото проверява за `TimeoutError` и в **двете** стъпки. Второто: секундата във фигурата е за демонстрацията. В таблото лимитът е три секунди, което е достатъчно за лоша връзка и достатъчно кратко, за да не се отчае човекът.

**Модулът, който поисква данните, пълен.** В урок 8 `js/load.js` оставяше грешките да минат такива, каквито идват: `TypeError` от паднала мрежа, `SyntaxError` от счупен JSON. Служеше на онзи, който програмира и ги чете в конзолата, но не на онзи, който използва таблото и се нуждае от изречение, което разбира. Сега модулът **превежда**: прихваща всяка повреда, поглежда името ѝ и вместо нея хвърля грешка със съобщение за хора. Продължава с обичайното си правило: **не пипа документа**. Кой решава как да се покаже, е изгледът.

Преди кода, две подробности в записа, които се появяват в него за първи път. Първата: в `loadServices(url, timeoutMs = 3000)` стойността `= 3000` е **стойност по подразбиране** на параметъра; ако извикващият не подаде втория аргумент, `timeoutMs` е 3000. Втората: `let response;` и `let data;` декларират променливите **без стойност** извън всеки `try`, а вътре в `try` им се присвоява, същият трик, който `main.js` използва в урок 8 със `services`: променлива, декларирана вътре в блок `{ … }`, съществува само вътре в този блок.

```js
// panel/js/load.js
// Pide la lista de servicios y devuelve un arreglo, o lanza un Error con un mensaje
// que una persona pueda leer. No toca el documento.

export async function loadServices(url, timeoutMs = 3000) {
  // Paso 1: la respuesta. Aquí fallan la red, el tiempo límite y los estados HTTP.
  let response;
  try {
    response = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
  } catch (error) {
    if (error.name === "TimeoutError") {
      throw new Error(`El servidor no respondió en ${timeoutMs} ms.`);
    }
    throw new Error("No se pudo conectar con el servidor.");
  }

  // fetch NO rechaza con un 404 o un 500: hay que mirarlo.
  if (!response.ok) {
    throw new Error(`El servidor respondió con el código ${response.status}.`);
  }

  // Paso 2: el cuerpo. El límite de tiempo sigue corriendo mientras se lee.
  let data;
  try {
    data = await response.json();
  } catch (error) {
    if (error.name === "TimeoutError") {
      throw new Error(`El servidor no terminó de responder en ${timeoutMs} ms.`);
    }
    if (error.name === "SyntaxError") {
      throw new Error("La respuesta no es JSON válido.");
    }
    // Cualquier otra falla al leer el cuerpo: la conexión se cortó a medias o el cuerpo
    // no se pudo decodificar. Desde aquí no se sabe cuál de las dos fue.
    throw new Error("No se pudo leer completa la respuesta del servidor.");
  }

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

- **Защо има два `try`?** Защото са две стъпки с два вида повреда. Първият прихваща онова, което става преди да има отговор: няма връзка или е изтекло времето. Вторият — онова, което става при четене на тялото, и там има три случая, които не бива да се бъркат. Според [MDN за `Response.json()`](https://developer.mozilla.org/en-US/docs/Web/API/Response/json) четенето може да се отхвърли със `SyntaxError` (текстът не е JSON), с грешка за прекъсване (тук `TimeoutError` от лимита) или с `TypeError`. `TypeError` не казва едно-единствено нещо: може връзката да се е прекъснала наполовина или тялото да не е могло да се декодира (MDN дава за пример погрешна заглавна част `Content-Encoding`). От кода не се различава кое от двете е било, така че съобщението казва само онова, което е сигурно: „No se pudo leer completa la respuesta del servidor.“ (Не можа да се прочете целият отговор на сървъра.). Затова вторият `catch` пита за името: само `SyntaxError` заслужава изречението „не е валиден JSON“; да го кажеш при прекъсната връзка би пратило човека да търси грешка във файла, която не съществува.
- **Защо съобщенията са наши, а не `error.message` на браузъра?** Защото съобщението на браузъра е писано за програмисти, на английски, и се различава между Chrome и Firefox („Failed to fetch“, „NetworkError when attempting to fetch resource“). Онзи, който използва таблото, се нуждае от изречение, което разбира. Техническата подробност, за онзи, който дебъгва, вече е в конзолата.
- **Какво се промени спрямо урок 8?** Двата `try`, времевият лимит и превеждането на съобщенията. Проверката на `ok`, на `Array.isArray` и на `isService` са същите. Спомни си защо е последната: файл с `[null]` е напълно валиден JSON и е масив; без `isService` този `null` стигаше до `summarize`, който се опитваше да прочете `service.status` от `null`, и програмата спираше с `TypeError` *извън* всеки `try`: таблото оставаше без известие, без таблица и без обяснение. С проверката този случай завършва в червеното известие „Algún servicio de la lista llegó incompleto o con datos de otro tipo.“ (Някоя услуга от списъка е пристигнала непълна или с данни от друг вид.), което е онова, което беше проверено в Chrome при подготовката на урока.

### 9.2 Трите състояния: зарежда се, грешка и празно

**Какво е фаза.** Таблото от урок 8 имаше състояние със списъка, часа, подредбата и избора. Сега му трябва да знае още нещо: **в кой момент от зареждането е**. Добавя се поле `phase` с три възможни стойности:

- `"loading"`: поискано е и още няма резултат.
- `"error"`: поискано е и се е провалило; в `errorMessage` остава текстът за човека.
- `"ready"`: пристигнал е списък.

И сега най-финото проектантско решение на урока. Оставаше четвърта ситуация, **„празно“**: списъкът е пристигнал добре, но няма нито една услуга. Фаза ли е четвъртата? Не: тя е **следствие**. Не е нужно да се пази, *извежда се* от онова, което вече е запазено: `phase === "ready"` и `services.length === 0`. Да пазиш два факта, които могат да се изведат един от друг, е рецептата някой ден да си противоречат. Функцията `situation` прави извеждането на едно място, връща `"empty"` в този случай и целият екран пита нея.

Едно напомняне за записа преди кода: `select` използва **тернарния оператор**, `condición ? valorSiSí : valorSiNo`, който урок 6 представи в „Да решаваш, да повтаряш и да сигнализираш за грешка“. Това е `if`, който *връща стойност* и затова се побира в присвояване: `state.selected === id ? null : id` е `null`, ако услугата вече е била избрана, и `id`, ако не.

Спрямо урок 8 се променят три неща: `createState` получава две полета, `phase` (което започва от `"loading"`) и `errorMessage`; `loadSucceeded` освен това минава фазата на `"ready"`; и се появяват три функции, `startLoading`, `loadFailed` и `situation`. Останалото си остава същото.

```js
// panel/js/state.js
// El estado del panel y las únicas formas de cambiarlo.
// No toca el documento: por eso se puede probar sin pantalla.

export function createState() {
  return {
    phase: "loading",       // "loading" | "error" | "ready"
    services: [],
    errorMessage: null,     // texto para la persona, solo en la fase "error"
    checkedAt: null,        // cuándo llegaron los datos por última vez (un Date), o null
    sortByTime: false,      // false = en el orden original; true = del más rápido al más lento
    selected: null,         // el id del servicio elegido, o null
  };
}

export function startLoading(state) {
  state.phase = "loading";
  state.errorMessage = null;
}

export function loadSucceeded(state, services, checkedAt) {
  state.phase = "ready";
  state.services = services;
  state.checkedAt = checkedAt;
  state.selected = null;
}

export function loadFailed(state, message) {
  state.phase = "error";
  state.errorMessage = message;
}

// Lo que la pantalla debe mostrar: "empty" no es una fase que se guarde, se DEDUCE.
// Una lista vacía que llegó bien es un resultado válido, no un error.
export function situation(state) {
  if (state.phase === "ready" && state.services.length === 0) return "empty";
  return state.phase;
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

**Две неща, които си струва да се различават.** Първото: грешката и празното си приличат отдалеч и са противоположни. Грешката е „не можах да разбера“; празното е „разбрах и няма нищо“. На първото се предлага **повторен опит**, защото може следващия път да проработи. На второто също се оставя възможност да се попита отново, защото празен списък днес може след минута да има услуги вътре; но без червеното известие, защото не е повреда. Табло, което казва „грешка“, когато списъкът е празен, лъже, а такова, което казва „няма услуги“, когато мрежата се е провалила, лъже по-лошо, защото човекът заключава, че всичко е наред.

Второто: преходите са малко и всичките са написани. Таблото стартира в `"loading"`; оттам минава в `"ready"` или в `"error"`; и се връща в `"loading"` само по действие на човека: „Reintentar“ (Опитай отново), от грешка или от празен списък, или „Revisar ahora“, с данните на показ. Друг път няма. Това, че са толкова малко, прави кода лесен за разсъждаване.

**Да се начертаят трите ситуации и да се обявят.** Изгледът вече знаеше да чертае таблицата и часа. Новото е в `render`, който първо пита `situation(state)` и показва един или друг екран, и в една малка функция, която излиза от нея: `renderSummary`, която в урок 8 живееше вътре в `render`. Обърни внимание как е устроен `render`: в началото решава кои известия и кои зони се виждат, после обобщението, и само ако ситуацията е `"ready"`, продължава с таблицата.

Две части от записа, които си струва да разпознаеш преди да го прочетеш. Първата е верига от тернарни оператори: `a ? x : b ? y : z` се чете „ако `a`, `x`; иначе, ако `b`, `y`; иначе `z`“, и така известието избира между три текста с един израз. Втората е [`Object.hasOwn(objeto, clave)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn), който връща `true` само ако обектът има този ключ **записан в самия него**. Нужно е, защото всеки обект в JavaScript наследява свойства, които никой не е писал, като `constructor` или `toString`: `LABELS["toString"]` не е `undefined`, а функция. С `Object.hasOwn(LABELS, status)` състояние, което не е нито `available`, нито `down`, се разпознава като неизвестно, дори да се казва `toString`. А `for (const cell of [...])` обхожда списък, написан на място, като всеки `for…of` от урок 6.

```js
// panel/js/view.js
// Dibuja el estado en el documento, con sus tres situaciones: cargando, error y vacío.
// Todo texto de los datos entra con textContent.
import { summarize } from "./stats.js";
import { situation, visible, selectedService } from "./state.js";

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

function renderSummary(services, elements) {
  const summary = summarize(services);
  elements.total.textContent = String(services.length);
  elements.available.textContent = `${summary.available} de ${services.length}`;
  elements.down.textContent = String(summary.down);
  elements.average.textContent = summary.averageMs === null ? "sin datos" : `${summary.averageMs} ms`;
}

// elements = { notice, errorNotice, retry, dataZone, checkedAt,
//              total, available, down, average, body, detail, sortButton }
export function render(state, elements) {
  const current = situation(state);

  // Un solo lugar decide qué se ve. Los textos de aviso son nuestros, no vienen de fuera.
  elements.notice.textContent =
    current === "loading" ? "Cargando servicios…" :
    current === "empty" ? "No hay servicios que revisar." : "";
  elements.errorNotice.textContent = current === "error" ? state.errorMessage : "";
  // Tras un error o una lista vacía hay que poder pedir otra vez, y «Revisar ahora» vive
  // en la zona de datos, que en esos dos casos está oculta: por eso se muestra «Reintentar».
  elements.retry.hidden = current !== "error" && current !== "empty";
  elements.dataZone.hidden = current !== "ready";
  renderCheckedAt(state.checkedAt, elements.checkedAt);

  // Cargando o con error no hay cifras que mostrar; vacío sí: cero servicios es un resultado.
  if (current === "loading" || current === "error") {
    for (const cell of [elements.total, elements.available, elements.down, elements.average]) {
      cell.textContent = "";
    }
  } else {
    renderSummary(state.services, elements);
  }

  if (current !== "ready") {
    elements.body.replaceChildren();
    elements.detail.textContent = "";
    return;
  }

  elements.sortButton.setAttribute("aria-pressed", String(state.sortByTime));

  const rows = visible(state).map((service) => createRow(service, service.id === state.selected));
  elements.body.replaceChildren(...rows);

  const chosen = selectedService(state);
  elements.detail.textContent = chosen === null ? "Elige un servicio para ver su detalle." : describe(chosen);
}
```

Две решения в този файл. Първото, обобщението: докато зарежда или когато се провали, четирите му числа остават празни, защото няма какво да се брои; но в празния случай казва 0, 0 от 0, 0 и „sin datos“ (няма данни), защото нула услуги **е** резултат, а обобщението трябва да казва същото като известието. Второто, както винаги: всичко влиза с `textContent`, включително съобщението за грешка, което също е текст, който не си писал в този момент. Часът продължава да го пише `renderCheckedAt`, този от урок 8: ако една проверка се провали, заглавната част запазва часа на последната, която е минала добре, което е точно онова, което човекът трябва да знае. И трето, за „Reintentar“: показва се при грешка **и** при празен списък. „Revisar ahora“ живее в `#data-zone`, която в тези два случая е скрита; без „Reintentar“ след празно не би останал нито един бутон, за да се попита отново, и човекът би трябвало да презареди страницата. По същата причина, когато зареждането приключи, `main.js` връща фокуса на „Revisar ahora“ само ако таблицата е останала на показ, а на „Reintentar“ в другите два случая.

Онова, което стои зад HTML, има толкова значение, колкото и JavaScript, защото тук живее достъпността на състоянията. Това е `index.html` от урок 8 с една промяна: секцията с услугите получава известията, бутона „Reintentar“ и една зона, `#data-zone`, която обгръща всичко, което има смисъл само с данни: лентата с контроли, таблицата и подробностите.

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

      <!-- Las dos zonas de aviso existen desde el principio: así los lectores de pantalla
           las vigilan antes de que aparezca el primer mensaje. -->
      <p id="notice" class="notice" role="status">Cargando servicios…</p>
      <p id="error-notice" class="notice notice-error" role="alert"></p>
      <button type="button" id="retry" hidden>Reintentar</button>

      <div id="data-zone" hidden>
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
      </div>
    </section>
  </main>

  <footer>
    <p>Datos de ejemplo del archivo data/services.json.</p>
  </footer>
</body>
</html>
```

- **Два региона за известия, налични от самото начало.** `#notice` има `role="status"`, а `#error-notice` има `role="alert"`. Те са **живи региони**: когато текстът им се промени, екранният четец го обявява. `status` го прави любезно, като изчаква да свърши онова, което е казвал; `alert` прекъсва и се резервира за онова, което човекът трябва да знае веднага. Затова „Cargando“ и „No hay servicios“ са в първия, а повредите във втория. Техническото правило е, че регионите трябва да **съществуват, преди съдържанието им да се промени**; ако се създадат със съобщението вече вътре, много четци не го обявяват.
- **`Cargando servicios…` вече е в HTML.** Преди да се изпълни първият байт JavaScript, човекът вижда, че нещо се случва. Когато `main.js` стартира, пише отново същия текст, което не произвежда никаква видима промяна.
- **`hidden` за онова, което не съответства.** Зоната с данните и бутонът „Reintentar“ се скриват с атрибута `hidden`, който ги изважда от погледа **и** от дървото за достъпност. Така екранният четец не обхожда празна таблица.
- **„Reintentar“ е истински бутон**, а слушателят му се регистрира само веднъж.

Стиловият лист получава два блока в края на `css/styles.css`. Първият отваря наново слоя `reset` за едно-единствено правило: онова, което носи атрибута `hidden`, не се вижда, каквото и да казва което и да е друго правило. Това е единственият `!important` в стиловия лист и е в първия слой нарочно: между декларации с `!important` редът на слоевете се обръща —същото обръщане, което урок 3 разказа за произходите—, така че в първия слой печели над всички. Не е кръпка, за да победи друго правило, а гаранция: скритото остава скрито. Вторият блок оформя известията и има уловка, която си струва да се види бавно. Празно известие не бива да чертае рамка без текст, така че трябва да се „изгаси“, докато е празно. Очевидният изход, `display: none`, е точно грешният: елемент с `display: none` излиза и от дървото за достъпност и тогава живият регион престава да съществува за екранния четец, докато не получи текст, което е точно онова, което предишното правило забранява. Измерено е в Chrome 154: с `display: none` празните `#notice` и `#error-notice` не се появяваха в дървото за достъпност; с правилото по-долу, което само им отнема външния отстъп, вътрешния отстъп и рамката, те се появяват като `status` и `alert` и са високи 0 px. Виждат се същото (нищо) и остават наблюдавани.

```css
@layer reset {
  /* ---- Lección 9 ---- */
  /* Lo que lleva el atributo hidden no se ve, diga lo que diga otra regla. Entre
     declaraciones con !important el orden de las capas se invierte: en la primera
     capa, esta gana a todas. */
  [hidden] {
    display: none !important;
  }
}

@layer components {
  /* ---- Lección 9: los avisos de carga, error y vacío ---- */
  .notice {
    margin: var(--space-3) 0;
    padding: var(--space-2) var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
  }

  /* Un aviso vacío no ocupa lugar, pero NO se oculta con display: none, que lo sacaría
     del árbol de accesibilidad: la región tiene que seguir ahí, vigilada, antes de que
     llegue el primer mensaje. Basta con quitarle el borde, el relleno y el margen. */
  .notice:empty {
    margin: 0;
    padding: 0;
    border: 0;
  }

  .notice-error {
    border-color: var(--color-down-text);
    background: var(--color-down-bg);
    color: var(--color-down-text);
  }
}
```

Известието за грешка използва цветовете на значката „Caído“ (Паднала), които урок 3 вече измери: 7.08 към 1 контраст.

Последното парче е `js/main.js`, което поисква данните и запазва резултата в състоянието. В него за първи път се появяват три инструмента и си струва да знаеш какво правят, преди да го прочетеш:

- **`location.search`** е частта от адреса на страницата, която започва от знака `?`: в `…/panel/?case=empty` е `"?case=empty"`. [`new URLSearchParams(texto)`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) я разделя на двойки име–стойност, а `.get("case")` връща стойността на `case`, или `null`, ако адресът не я носи.
- **`document.activeElement`** е елементът, който в този момент има фокуса: бутонът, който току-що си натиснал с клавиатурата, полето, в което пишеш, или `<body>`, ако нищо не го има.
- **`?.`**, опционалното верижно свързване от урок 6: `document.activeElement?.dataset?.id` чете `id` на фокусирания бутон, ако има такъв, и дава `undefined`, вместо да спре с грешка, ако някоя от стъпките не съществува. (Функцията `update`, която го използва, е тази от урок 7, без промяна.)

С това, файлът:

```js
// panel/js/main.js
// Junta las piezas: pide los datos, guarda el resultado en el estado y dibuja.
import { loadServices } from "./load.js";
import { createState, startLoading, loadSucceeded, loadFailed, toggleSort, select, situation } from "./state.js";
import { render } from "./view.js";

// Casos de prueba para ver cada situación sin romper nada: index.html?case=empty
// Es una lista cerrada: el texto de la dirección elige UNA de estas opciones, nunca se usa como dirección.
const CASES = {
  normal: { url: "data/services.json", timeoutMs: 3000 },
  empty: { url: "data/services-empty.json", timeoutMs: 3000 },
  error: { url: "data/missing.json", timeoutMs: 3000 },
  invalid: { url: "index.html", timeoutMs: 3000 },
  // ?delay=5000 solo lo entiende slow-server.py, que tarda 5 s en contestar; el límite son 3 s.
  timeout: { url: "data/services.json?delay=5000", timeoutMs: 3000 },
};
const requested = new URLSearchParams(location.search).get("case");
const current = Object.hasOwn(CASES, requested) ? CASES[requested] : CASES.normal;

const elements = {
  notice: document.querySelector("#notice"),
  errorNotice: document.querySelector("#error-notice"),
  retry: document.querySelector("#retry"),
  dataZone: document.querySelector("#data-zone"),
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
  // El botón que pidió la carga se oculta mientras carga, y con él se va el foco:
  // se anota para devolverlo al terminar.
  const fromButton = document.activeElement === elements.checkNow || document.activeElement === elements.retry;
  startLoading(state);
  render(state, elements);
  try {
    loadSucceeded(state, await loadServices(current.url, current.timeoutMs), new Date());
  } catch (error) {
    loadFailed(state, error.message);
  }
  render(state, elements);
  if (fromButton) {
    (situation(state) === "ready" ? elements.checkNow : elements.retry).focus();
  }
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
elements.retry.addEventListener("click", load);

// Delegación: un solo oyente en el <tbody> atiende los botones de todas las filas.
elements.body.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-id]");
  if (button === null) return;
  update(() => select(state, button.dataset.id));
});

load();
```

Две неща от този файл заслужават обяснение. Първото е `load()`, което се промени спрямо урок 8: сега минава в `"loading"`, чертае, опитва и при двата изхода записва в състоянието и чертае наново. Вече няма `console.error`: повредата има място на екрана. `try`/`catch` остава **само около заявката**, не около чертането, по същата причина като в урок 8: ако чертането имаше програмна грешка, не искаме да я маскира като „не можа да се свърже“; искаме да я видим в конзолата. И един урок от 7, който се връща: бутонът, който е поискал зареждането, „Revisar ahora“ или „Reintentar“, остава скрит, докато се зарежда, а скрит елемент губи фокуса, който пада на `<body>`. Затова `load()` в началото отбелязва дали фокусът е бил на един от тези два бутона и, когато свърши, го връща на съответния: „Reintentar“, ако отново се е провалило, „Revisar ahora“, ако са пристигнали данните. Без тези редове онзи, който използва клавиатурата, би трябвало да обхожда страницата отгоре след всяка проверка.

Второто е таблицата `CASES`. За да можеш да видиш всяка ситуация, без да чупиш нищо, таблото приема в адреса `?case=empty`, `?case=error`, `?case=invalid` или `?case=timeout`. Обърни внимание, че текстът от адреса **не се използва като адрес на заявката**: само избира една опция от пет, които ние сме написали. Ако таблото правеше `fetch(params.get("url"))`, всеки би могъл да ти прати връзка, която кара *твоето* табло да поиска и да начертае онова, което той иска. `Object.hasOwn` не позволява на `?case=constructor` да намери наследена стойност.

**Да видим трите състояния.** Със стартиран сървър отвори `…/09-cuando-algo-falla/panel/` и мини през този обход; това са проверките ти за урока:

| Адрес | Онова, което трябва да видиш |
|---|---|
| `panel/` | Таблицата, обобщението на 5, 4 от 5, 1 и 465 ms, и в заглавната част датата и часа, в които са пристигнали данните |
| `panel/?case=empty` | „No hay servicios que revisar.“ (Няма услуги за проверка.), без таблица, с бутона „Reintentar“, за да се попита отново; обобщението на нула |
| `panel/?case=error` | „El servidor respondió con el código 404.“ (Сървърът отговори с код 404.), с бутона „Reintentar“ |
| `panel/?case=invalid` | „La respuesta no es JSON válido.“ (Отговорът не е валиден JSON.) (поисква `index.html`, който не е JSON) |
| `panel/?case=timeout` | със `slow-server.py`: „Cargando servicios…“ три секунди и после „El servidor no respondió en 3000 ms.“ (Сървърът не отговори за 3000 ms.), с „Reintentar“. С обичайния сървър, нормалната таблица: няма кой да се бави |

За състоянието **„зарежда се“**, което на твоята машина трае милисекунди, има два начина да го видиш. По-простият е `?case=timeout` с включен `slow-server.py`: известието остава три секунди, преди да се смени с грешката. Другият, който върши работа с всеки сървър, са инструментите на браузъра: отвори раздела **Мрежа**, избери бавен профил на скоростта (в Chrome „3G“; във Firefox „GPRS“; имената на профилите се менят между версиите) и презареди; и с опцията „Без връзка“ натисни „Reintentar“ след грешка и ще видиш „No se pudo conectar con el servidor.“ (Не можа да се свърже със сървъра.). Да видиш всяко състояние със собствените си очи е частта, от която най-много се учи; не я пропускай.

**Проверката, която затваря раздела.** С `?case=error` навигирай само с клавиатурата до „Reintentar“, натисни Enter и забележи, че известието не изчезва (продължава да се проваля, защото файлът продължава да не съществува) и че фокусът остава на „Reintentar“. Направи същото с „Revisar ahora“ в нормалното табло: часът в заглавната част се променя и фокусът остава на бутона. И едно измерване, което не се пропуска: с прозорец на 320 px, в петте случая, `document.documentElement.scrollWidth <= document.documentElement.clientWidth` трябва да връща `true`; проверих го и връща `true` и в петте, благодарение на кутията от урок 5, която се превърта, и на правилото `position: relative` от урок 7. С включен екранен четец (в Linux Mint Orca обикновено се включва със `Super+Alt+S`) червеното известие трябва да се обяви, без да местиш фокуса.

### 9.3 Няколко заявки наведнъж

**Проблемът.** Истинският `revisor` ще проверява много услуги и всяка може да отговори, да се забави или да се провали сама. Когато заявките не зависят една от друга, не се чака едната, за да се изпрати следващата: изпращат се всички и се чака съвкупността. Да ги поискаш една след друга, с `await` вътре в цикъл, кара проверката да трае **сбора** от всички; да ги пуснеш заедно я кара да трае колкото **най-бавната**.

**Двата начина да се изчака съвкупност.** `Promise.all(lista)` получава списък от promise и връща един, който се изпълнява, когато се изпълнят всички. Но **се отхвърля, щом една се провали**, и отхвърля резултата на останалите, обратното на онова, което искаш в доклад, където паднала услуга е част от резултата, а не причина да изхвърлиш останалите. За това има `Promise.allSettled`, който чака всички и връща за всяка обект, който казва дали се е изпълнила (`status: "fulfilled"`, с `value`) или е била отхвърлена (`status: "rejected"`, с `reason`). Той е „Baseline“ от юли 2020 г. ([MDN: `allSettled`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)).

Преди фигурата, една част от записа: `urls.map(request)` прилага функцията `request` към всеки адрес и връща масив с онова, което връща всяко извикване. Тъй като `request` е `async`, всяко извикване връща promise: резултатът е **масив от promise**, всички вече на път, което е точно онова, което `allSettled` очаква да получи. А в последния `map` вторият параметър, `i`, е позицията на всеки резултат, която служи, за да се възстанови адресът, който му съответства: `allSettled` връща резултатите **в същия ред**, в който е получил promise, независимо кое е приключило първо. Фигура 9.2 поисква три файла, един от тях несъществуващ:

```html
<!-- fig09_02.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 9.2 — varias peticiones a la vez con allSettled</title>
</head>
<body>
  <main>
    <h1>Fig. 9.2 — varias peticiones a la vez con allSettled</h1>
    <pre id="output">Cargando…</pre>
  </main>

  <script type="module">
    const output = document.querySelector("#output");

    async function request(url) {
      const response = await fetch(url, { signal: AbortSignal.timeout(3000) });
      if (!response.ok) throw new Error(`código ${response.status}`);
      return await response.json();
    }

    const urls = ["panel/data/services.json", "missing.json", "panel/data/services-empty.json"];
    const results = await Promise.allSettled(urls.map(request));

    output.textContent = results.map((result, i) =>
      result.status === "fulfilled"
        ? `${urls[i]}: bien, ${result.value.length} elementos`
        : `${urls[i]}: falló, ${result.reason.message}`
    ).join("\n");
  </script>
</body>
</html>
```

```text
panel/data/services.json: bien, 5 elementos
missing.json: falló, código 404
panel/data/services-empty.json: bien, 0 elementos
```

Файлът, който липсва, не отнесе другите два: всеки носи свой изход. Днешното табло чете един-единствен файл и не го използва; запази го за когато `revisor` поиска от всяка услуга собственото ѝ състояние, и тогава всеки ред на таблицата ще може да има свое „провали се“, без останалата част от таблото да разбере.

## Грешката, която ще видиш

**Грешката CORS.** Това е първата, която среща всеки, който иска данни от друго място. Таблото поисква файл от **собствения си** сървър и затова не я вижда; за да я предизвикаш, фигура 9.3 поисква същия файл от *друг* сървър.

```html
<!-- fig09_03.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 9.3 — pedir datos a otro origen</title>
</head>
<body>
  <main>
    <h1>Fig. 9.3 — pedir datos a otro origen</h1>
    <pre id="output">Cargando…</pre>
  </main>

  <script type="module">
    const output = document.querySelector("#output");
    output.textContent = `esta página vive en: ${location.origin}\nvoy a pedir a:        http://127.0.0.1:8001`;

    try {
      const response = await fetch("http://127.0.0.1:8001/data/services.json");
      output.textContent += `\nllegó con el código ${response.status}`;
    } catch (error) {
      output.textContent += `\nfetch falló: ${error.name}: ${error.message}`;
    }
  </script>
</body>
</html>
```

Стартирай втори сървър от папката на таблото, в друг терминал и също вътре в изтегленото хранилище:

```bash
cd programas/09-cuando-algo-falla/panel
python3 -m http.server 8001 --bind 127.0.0.1
```

С първия сървър (този на порт 8000) още включен, отвори `http://127.0.0.1:8000/09-cuando-algo-falla/fig09_03.html`. Страницата казва:

```text
esta página vive en: http://127.0.0.1:8000
voy a pedir a:        http://127.0.0.1:8001
fetch falló: TypeError: Failed to fetch
```

(„Failed to fetch“ е съобщението на Chrome; името, `TypeError`, е същото във всички браузъри.) А конзолата на Chrome показва, в червено:

```text
Access to fetch at 'http://127.0.0.1:8001/data/services.json' from origin 'http://127.0.0.1:8000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

(Във Firefox конзолата казва друго —започва с „Cross-Origin Request Blocked“— и съобщението на грешката е „NetworkError when attempting to fetch resource.“, но грешката, която получава твоят код, продължава да се казва `TypeError`, както казва [спецификацията на Fetch](https://fetch.spec.whatwg.org/#fetch-method) и таблицата от 8.1: страницата би отпечатала `TypeError: NetworkError when attempting to fetch resource.`. Проблемът е същият.)

За да се разбере, е нужно определение. **Произходът** (*origin*) на една страница е комбинацията от три неща: схемата (`http`), сървърът (`127.0.0.1`) и портът (`8000`). Два адреса с различен порт са различни произходи, дори да е същата машина, и това е, което става тук. **Политиката за същия произход** на браузъра казва, че една страница може свободно да чете онова, което идва от нейния произход, а не онова, което идва от друг, освен ако този друг не го позволи ([MDN: политика за същия произход](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Same-origin_policy)). Начинът да се позволи се нарича **CORS** (*cross-origin resource sharing*, споделяне на ресурси между произходи): сървърът, собственик на данните, добавя към отговора си заглавната част `Access-Control-Allow-Origin`, с произхода, на който дава разрешение ([MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)).

Три идеи, които поправят най-честите недоразумения:

1. **Заявката е излязла.** Ако отвориш раздела „Мрежа“, ще видиш заявката и отговора ѝ (този дори с 200). Онова, което браузърът **блокира, е твоят код да прочете този отговор**. CORS не защитава сървъра, който вече е получил заявката: защитава онзи, който използва браузъра, от това чужда страница да чете неща негови без разрешение.
2. **Поправя се в сървъра, не в кода ти.** Няма какво да напишеш в таблото, за да прескочиш блокирането. Онзи, който контролира сървъра, трябва да добави заглавната част. Ако сървърът не е твой, иска се от собственика; или таблото и данните се сервират от един и същ произход, както прави този курс.
3. **Има „решения“, които не са такива.** Разширението, което „изключва CORS“, публичната услуга, която препраща заявките, или опцията `mode: "no-cors"` на `fetch` (която дава „непрозрачен“ отговор, който кодът не може да прочете), правят така, че грешката да изчезне от конзолата, без да решат нищо: или оставят браузъра ти незащитен, или пращат данните на онези, които използват таблото ти, на трета страна. `mode: "no-cors"` е най-лошото, защото изглежда, че работи.

И едно следствие за таблото: ако някой ден `revisor` поиска данните си от друг произход без разрешение, човекът би видял „No se pudo conectar con el servidor.“, защото от кода блокиране по CORS не се различава от паднала мрежа. Изречението е вярно оттам, откъдето го вижда човекът: таблото не можа да получи данните. Точната причина е в конзолата, за онзи, който дебъгва.

Затвори втория сървър с `Ctrl+C`, когато свършиш.

## Какво се прави погрешно

- **Заявка без времеви лимит.** Сървър, който не отговаря, оставя страницата в „Cargando…“ без край, което е по-лошо от грешка, защото не казва какво да се прави. `AbortSignal.timeout` струва един ред.
- **Да питаш за съобщението вместо за името.** `error.message` се променя между браузъри и версии; `error.name` (`TimeoutError`, `TypeError`, `SyntaxError`) го определя спецификацията. Кодът решава по името.
- **Табло, което знае само щастливия случай.** Ако таблицата е единственото, което кодът знае да чертае, една повреда изглежда като празна страница. Трите състояния не са украса: те са част от продукта.
- **Да третираш празното като грешка или грешката като празно.** На човека му се предлагат различни неща и объркването им го кара да реши погрешно.
- **Да създадеш живия регион със съобщението вече вътре или да го скриеш с `display: none`.** И в двата случая екранният четец не обявява нищо. Регионът съществува от самото начало, празен, и се променя само текстът му.
- **Да показваш с `innerHTML` съобщението за грешка или данните, които са пристигнали.** Онова, което идва отвън, е данна отвън, дори да идва от собствения ти сървър, защото утре този сървър може да е друг. Принципът от урок 7 остава в сила без промяна.
- **Да използваш `await` вътре в цикъл за независими заявки.** `for (const url of urls) { await fetch(url) }` прави една заявка, чака, прави следващата, чака: трае сбора от всички. Пускат се всички наведнъж и съвкупността се чака с `Promise.allSettled`.
- **Да използваш адреса на браузъра като адрес на заявката.** Адрес, който идва от адресната лента, е данна отвън. Избира се между опции, които си написал ти, както прави таблицата `CASES`.
- **Да „поправяш“ CORS от страницата.** Нито `mode: "no-cors"`, нито разширение го решават; поправя го сървърът, който дава данните.

## Упражнения

### Упражнение 1 — Петте случая и кой ги произвежда

Отвори таблото с всеки от петте случая от таблицата в 9.2 и с опцията „Без връзка“ от раздела Мрежа. В дневника си за всеки запиши съобщението, което се е появило, и **реда от `js/load.js`**, който го е произвел. После отговори: кои от шестте случая никога не показват код на състоянието в раздела Мрежа и защо?

### Упражнение 2 — Колко трая проверката

Направи така, че когато данните пристигнат добре, таблото да показва под подробностите „La revisión tardó 12 ms.“ (Проверката отне 12 ms.), с милисекундите, които са минали между поискването на данните и получаването им. `performance.now()` дава текущия момент в милисекунди, с десетични знаци; разликата между две извиквания е онова, което е минало между тях. Реши къде се **мери**, къде се **запазва** и къде се **пише**, и провери, че ако щракнеш „Ordenar“, числото не се променя, а ако щракнеш „Revisar ahora“, се променя.

### Упражнение 3 — Колко списъка пристигнаха

Копирай фигура 9.2 като `count.html` в същата папка и я промени така, че под трите реда да пише четвърти с обобщението: „Llegaron 2 de 3.“ (Пристигнаха 2 от 3.). Използвай `filter` върху резултата от `allSettled`, без да поискаш нищо наново. После добави към списъка с адреси `"panel/data/otro-que-no-existe.json"` и провери, че обобщението става „Llegaron 2 de 4.“, без да променяш нищо друго.

## Решения

### Решение 1

Съобщенията и откъде идват, в `js/load.js`:

| Случай | Съобщение | Ред, който го произвежда |
|---|---|---|
| нормален | (никакво: таблицата) | `return data;` |
| `?case=empty` | „No hay servicios que revisar.“ | не е от `js/load.js`: решава го `situation` в `js/state.js` |
| `?case=error` | „El servidor respondió con el código 404.“ | `throw` вътре в `if (!response.ok)` |
| `?case=invalid` | „La respuesta no es JSON válido.“ | `throw` на клона `SyntaxError` на втория `catch` |
| `?case=timeout` (със `slow-server.py`) | „El servidor no respondió en 3000 ms.“ | `throw` на първия `catch`, клон `TimeoutError` |
| Без връзка | „No se pudo conectar con el servidor.“ | последният `throw` на първия `catch` |

Показват код на състоянието в раздела Мрежа четирите случая, в които сървърът наистина е отговорил: нормален (200), празен (200), грешка (404) и невалиден (200, вид `text/html`). Онези, които **никога** нямат такъв, са „timeout“ (заявката остава изчакваща три секунди и се прекъсва, без да е получила отговор) и „Без връзка“ (нямаше с кого да се говори). Таблицата от 8.1 отбелязва **три** ситуации като „се отхвърля“: без връзка, блокиране по CORS и изтекло време. Тези два случая са две от тях; третата, CORS, не се появява в таблото, защото то иска от собствения си произход, и я видя отделно с фигура 9.3. В останалите случаи promise се е изпълнил и таблото е трябвало само да провери `ok` или съдържанието.

### Решение 2

Това са три работи и отиват в три файла. **Измерването** е ефект —пита часовника около заявката—, така че отива в `js/main.js`, до извикването на `loadServices`. **Запазването** на числото е състояние: факт, който таблото помни до следващото зареждане. А **записването** му е чертане. В `js/state.js`, още едно поле и още един параметър:

```js
// js/state.js — en createState()
durationMs: null,       // cuánto tardó la última carga que salió bien, o null
// js/state.js — loadSucceeded recibe la cifra y la guarda
export function loadSucceeded(state, services, checkedAt, durationMs) {
  state.phase = "ready";
  state.services = services;
  state.checkedAt = checkedAt;
  state.durationMs = durationMs;
  state.selected = null;
}
```

В `js/main.js`, вътре в `load()`, се мери преди и след заявката:

```js
  const start = performance.now();
  try {
    const services = await loadServices(current.url, current.timeoutMs);
    loadSucceeded(state, services, new Date(), Math.round(performance.now() - start));
  } catch (error) {
    loadFailed(state, error.message);
  }
```

В `index.html`, `<p id="duration"></p>` под `#detail`, вътре в `#data-zone`; в `js/main.js`, `duration: document.querySelector("#duration"),` в обекта `elements`; и в `js/view.js`, в края на `render`:

```js
  elements.duration.textContent = `La revisión tardó ${state.durationMs} ms.`;
```

„Ordenar“ не променя числото, защото променя само `sortByTime`: числото се запазва единствено при пристигане на данни. „Revisar ahora“ го променя, защото отново минава през `loadSucceeded`. Ако го беше изчислил вътре в `render` с `performance.now()`, щеше да измериш друго нещо —колко е минало от отварянето на страницата до чертането— и щеше да се променя при всяко щракване.

### Решение 3

След като се построят редовете, преброяват се изпълнените резултати и се добавя четвъртият:

```js
    const lines = results.map((result, i) =>
      result.status === "fulfilled"
        ? `${urls[i]}: bien, ${result.value.length} elementos`
        : `${urls[i]}: falló, ${result.reason.message}`
    );
    const arrived = results.filter((result) => result.status === "fulfilled").length;
    lines.push(`Llegaron ${arrived} de ${results.length}.`);
    output.textContent = lines.join("\n");
```

`filter` оставя само резултатите със `status`, равен на `"fulfilled"`, а `.length` ги брои. Спрямо `results.length`, а не спрямо написана на ръка 3, обобщението се нагажда само, когато списъкът се промени: с четвъртия адрес Chrome 154 показва `panel/data/otro-que-no-existe.json: falló, código 404` и `Llegaron 2 de 4.`. Това е начинът на мислене на `revisor`: броят на услугите излиза от данните, никога от кода.

## Как разбирам, че съм успял

- [ ] С папката `programas/`, сервирана от `slow-server.py`, `09-cuando-algo-falla/fig09_01.html` показва `TimeoutError`; с `python3 -m http.server` същата страница казва „alcanzó a responder“.
- [ ] `fig09_02.html` показва два списъка, които са пристигнали, и един, който се е провалил с код 404.
- [ ] В твоето табло обобщението казва 5, 4 от 5, 1 и 465 ms, а заглавната част казва датата и часа, в които са пристигнали данните.
- [ ] Четирите случая с `?case=` показват известието от таблицата в 9.2 (този с `timeout`, със `slow-server.py`) и „Reintentar“ се появява в трите, които са грешка, и в празния, никога заедно с таблицата.
- [ ] След натискане на „Revisar ahora“ или „Reintentar“ с клавиатурата фокусът остава на този бутон.
- [ ] При ширина 320 px няма хоризонтално преливане в нито един от петте случая.
- [ ] С `?case=timeout` и `slow-server.py`, или с бавен профил на скоростта в раздела Мрежа, успяваш да видиш „Cargando servicios…“.
- [ ] С „Без връзка“ и „Reintentar“ таблото казва „No se pudo conectar con el servidor.“
- [ ] Конзолата показва само мрежовата грешка на случаите, които си предизвикал нарочно, и нито едно изключение от твоя код.

**Преговор на предишни уроци** (отговори, без да гледаш, и после провери):

1. В урок 0: какво е произход и кои три части на един адрес го образуват?
2. В урок 7: защо трябва да се върне фокусът на бутона, след като се чертае наново?
3. В урок 8: защо promise на `fetch` се изпълнява при 404 и кой ред от `js/load.js` го превръща в грешка?

## За допълнително четене

- [MDN — `AbortSignal.timeout()`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static) — времевият лимит и `TimeoutError`, с таблицата им за съвместимост; посетено на 7 октомври 2026 г.
- [MDN — Споделяне на ресурси между произходи (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS) — какво е произход и защо го поправя сървърът; посетено на 7 октомври 2026 г.
- [MDN — Живи региони на ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions) — `status`, `alert` и защо регионът трябва да съществува, преди текстът му да се промени; посетено на 7 октомври 2026 г.
- [MDN — `Promise.allSettled()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled) — да се изчака съвкупност от promise, без една повреда да отнесе останалите; посетено на 7 октомври 2026 г.
