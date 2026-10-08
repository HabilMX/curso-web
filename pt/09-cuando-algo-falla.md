# Lição 9 — Quando algo falha: tempos limite, estados, CORS e várias requisições

**Tempo:** 2 × 45 min

**O que você constrói:** o painel que sempre diz o que está acontecendo: carregando, erro ou vazio, com um tempo limite para não esperar sem fim

**O que você aprende:** tempo limite com `AbortSignal.timeout`; distinguir as falhas pelo nome; os três estados: carregando, erro e vazio; o erro de CORS; várias requisições ao mesmo tempo com `Promise.allSettled`

## Ao terminar, você vai conseguir

- Pôr em cada requisição um tempo limite e distinguir no código um tempo esgotado de uma falha de conexão e de uma resposta que não é JSON.
- Traduzir cada falha técnica em uma frase que a pessoa que usa o painel possa entender.
- Mostrar no painel as três situações que não são “deu tudo certo”: carregando, erro e vazio, cada uma com o seu aviso e a sua forma de ser anunciada a um leitor de tela.
- Explicar por que “vazio” não é um erro e por que não se guarda como mais uma fase, mas se deduz.
- Reconhecer no console o erro de CORS, explicar quem o produz e quem o conserta.
- Pedir várias coisas ao mesmo tempo sem que uma falha leve o resultado das demais, com `Promise.allSettled`.

## O porquê antes do como

**Ponto de partida.** Esta lição parte do painel como a lição 8 o deixou. O seu painel já pede seus dados a `data/services.json`, e a estrutura que ficou é esta:

- `index.html`, com o `<tbody>` e os quatro `<dd>` do resumo vazios, a hora em `#checked-at`, o botão `#check-now` (“Revisar ahora”), o botão “Ordenar por tiempo de respuesta” e a região do detalhe (`#detail`).
- `css/styles.css`, a folha de estilo das lições 3, 4, 5 e 7.
- `data/services.json`, com os cinco serviços.
- `js/load.js`, que pede os dados em dois passos, verifica `response.ok` e a forma do que chegou, e lança um erro se algo não bate.
- `js/stats.js`, com `summarize` e as duas contas da lição 6.
- `js/state.js`, com a lista, a hora de chegada, a ordem e a seleção, e `loadSucceeded` para guardar o que chegou.
- `js/view.js`, que desenha o estado e a hora, sempre com `textContent`.
- `js/main.js`, que pede os dados ao iniciar e com “Revisar ahora”, e deixa no console qualquer falha.

E um arquivo novo para hoje, `data/services-empty.json`, o parente da lista para o caso vazio:

```json
[]
```

Uma lista sem elementos, que é JSON válido: o servidor a entregará com um 200, e será o painel quem decidirá o que isso significa.

**O que falta hoje ao painel.** O painel da lição 8 funciona quando tudo dá certo, e **detecta** as falhas, mas não as conta: deixa-as no console, que ninguém além de quem programa abre. Um relatório real vive em um mundo onde acontecem coisas que um módulo local nunca enfrenta:

1. **Demora.** Entre a página aparecer e os dados chegarem há um intervalo, que pode ser de milissegundos ou de segundos. O que a pessoa vê enquanto isso? Uma tabela vazia parece um painel quebrado.
2. **Falha.** O servidor pode estar desligado, o arquivo pode ter sido movido, a conexão pode cair. O que a pessoa vê então? Hoje, nada: a página parece congelada.
3. **Chega vazio.** O servidor responde bem, mas a lista não tem nenhum serviço. Não é uma falha, mas tampouco é uma tabela. O que a pessoa vê?
4. **Não responde.** O servidor recebe a requisição e nunca responde. A promessa do `fetch` fica pendente para sempre, sem se cumprir nem ser rejeitada, e nem sequer há um erro para capturar.

Um painel terminado mostra **as três** primeiras situações como telas distintas, e converte a quarta em um erro com um limite de tempo. É o quarto dos cinco critérios com que você sabe que terminou o curso: *mostra os três estados, carregando, erro e vazio*. Esta lição deixa isso cumprido.

**Por que importa tanto.** A maioria dos tutoriais ensina o caminho feliz e para por aí, porque é o que fica bonito numa demonstração. Mas quem usa um painel de serviços o abre justamente quando suspeita que algo vai mal. Se nesse momento a página fica em branco, ou diz “não há serviços” porque a rede falhou, a pessoa toma uma decisão ruim: espera quando devia agir, ou se tranquiliza quando devia se preocupar. Um painel que mente nas suas falhas é pior que não ter painel. Por isso esta lição é, para quem usa o `revisor`, a mais importante do curso.

**Que rota segue.** Primeiro o **tempo limite**, para que uma requisição não espere para sempre, e o módulo `js/load.js` na sua versão completa, que distingue cada falha pelo nome e a traduz em uma frase. Segundo **os três estados** na tela, que é a parte que as pessoas veem e quase ninguém ensina. Terceiro, **várias requisições ao mesmo tempo**, de que o `revisor` precisará quando verificar muitos serviços. E no final, o erro que mais cedo ou mais tarde qualquer um que pede dados a outro lugar encontra: o **CORS**.

**O que você precisa ter ligado.** Só o servidor local de sempre (e, para a última figura, um segundo servidor que você ligará ali mesmo). As páginas desta lição estão em [`programas/09-cuando-algo-falla/`](https://github.com/HabilMX/curso-web/tree/main/programas/09-cuando-algo-falla) do [repositório do curso](https://github.com/HabilMX/curso-web); com o repositório baixado no seu computador, ligue o servidor a partir da pasta `programas/` dele:

```bash
cd programas
python3 -m http.server 8000 --bind 127.0.0.1
```

Abra `http://127.0.0.1:8000/09-cuando-algo-falla/panel/`. Como na lição 8, `fetch` e os módulos não funcionam com `file://`. Nada mais é necessário: nem Node nem pacotes.

## Os conceitos

São três. Como nas lições anteriores: antes de executar cada figura, **escreva no diário de bordo o que você acha que vai acontecer**.

### 9.1 Não esperar para sempre: o tempo limite

**O problema.** Lembre da tabela de 8.1: a promessa do `fetch` se cumpre quando chega uma resposta e é rejeitada quando não há conexão. Mas há uma terceira maneira de uma requisição dar errado, e é a mais cruel porque não produz nenhum erro: **não acontece nada**. O servidor não responde, a rede está travada, e a promessa fica pendente, sem se cumprir nem ser rejeitada. Um painel sem tempo limite fica com “Cargando…” para sempre; a pessoa não sabe se espera, se recarrega ou se desiste. A solução é decidir quanto se está disposto a esperar e cortar ali.

O mecanismo é um **sinal de cancelamento**. O `fetch` aceita nas suas opções um `signal`, e se esse sinal é “ativado” antes de a requisição terminar, o `fetch` a aborta e a sua promessa é rejeitada. Para o caso do tempo limite há uma peça pronta: `AbortSignal.timeout(milissegundos)` cria um sinal que se ativa sozinho quando passa esse tempo, e o erro com que a promessa é rejeitada se chama `TimeoutError` ([MDN: `AbortSignal.timeout`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static)). Usa-se assim: `fetch(url, { signal: AbortSignal.timeout(3000) })`. O segundo argumento do `fetch` é um objeto de opções, como os que você conheceu na lição 6; `signal` é uma das suas chaves.

É uma função relativamente recente: está disponível nos principais navegadores desde abril de 2024, e o MDN a rotula “Baseline 2024”. Ela completa os trinta meses que separam “recém-disponível” de “amplamente disponível” justamente por estas datas, então, se no seu navegador não aparecer, atualize-o. Antes dela se escrevia à mão com `AbortController` e um `setTimeout`; já não é preciso.

Para ver o erro é preciso um servidor que de fato demore, e o do `python3 -m http.server` responde em um par de milissegundos. Por isso esta lição traz um próprio, `slow-server.py`: serve a pasta igual ao de sempre, mas, se o endereço leva `?delay=3000`, espera esses três mil milissegundos antes de responder. Não precisa instalar nada; usa apenas a biblioteca que o Python traz. Desligue o servidor de sempre (Ctrl+C) e, a partir da pasta `programas/`, ligue este no lugar dele, na mesma porta:

```bash
python3 09-cuando-algo-falla/slow-server.py
```

Ele serve as mesmas páginas em `http://127.0.0.1:8000/`, então todo o resto funciona igual. Este é o seu código; você não precisa escrevê-lo, mas vale a pena lê-lo, porque é curto e você já conhece quase tudo o que ele faz:

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

O importante está em `do_GET`, a função que atende cada requisição: lê o número que vem depois de `delay=`, dorme esse tempo com `time.sleep` (que conta em segundos, por isso se divide por mil) e depois responde como o servidor de sempre. As outras duas peças: `ThreadingHTTPServer` atende cada requisição separadamente, para que uma requisição adormecida não detenha as demais; e o `except` final cala o aviso que o Python daria quando o navegador, cansado de esperar, desliga antes de receber a resposta, que é justamente o que se quer provocar. O resto (`?delay` é ignorado se não for um número, e nunca se espera mais de dez segundos) serve para que ninguém o use por engano para travar o seu computador.

A figura 9.1 pede os dados com `?delay=3000` e um limite de **um segundo**. O servidor demora três; o limite sempre ganha, porque a diferença não é de milissegundos, mas de dois segundos completos. Ao preparar esta lição, deu `TimeoutError` em 10 de 10 cargas no Chrome 154, sempre a um segundo do início. E a prova de controle, também em 10 de 10: servida com o `python3 -m http.server` de sempre, que não entende `?delay` e responde logo, a mesma página diz “alcanzó a responder: el límite no se cumplió” (“conseguiu responder: o limite não se cumpriu”). Se você vê essa frase, não é um erro do seu código: é que você está com o servidor que não demora ligado.

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

A mensagem, `signal timed out`, é o texto do Chrome; o Firefox escreve outro, mas o **nome** do erro é o mesmo em todos os navegadores porque a especificação o fixa. Por isso o código pergunta sempre pelo nome e nunca pela mensagem. O nome do erro é `TimeoutError`. É a maneira de distinguir no código um “não respondeu a tempo” de um “não há conexão” (`TypeError`). Há outro nome parecido, `AbortError`, que aparece quando alguém cancela de propósito com um `AbortController`; você não o usa hoje.

Duas precisões técnicas que saem caro se você não as souber. A primeira: **o limite continua correndo enquanto o corpo é lido.** Se o servidor manda os cabeçalhos imediatamente mas fica pela metade com o conteúdo, a promessa do `fetch` se cumpre, e é `response.json()` que é rejeitada com `TimeoutError` ao chegar ao limite. É a precisão que a última linha da tabela de 8.1 deixava pendente: o tempo esgotado rejeita a promessa do `fetch` só se ocorrer **antes** de chegarem os cabeçalhos; depois, a promessa já se cumpriu e não pode “des-cumprir-se”, então o que é rejeitado é a leitura do corpo. Em um teste com um servidor que enviava o começo de um array e esperava quatro segundos pelo resto, com um limite de um segundo os cabeçalhos chegaram aos 2 ms e a leitura do corpo foi rejeitada com `TimeoutError` aos 1005. Por isso o código do painel verifica `TimeoutError` nos **dois** passos. A segunda: o segundo da figura é para a demonstração. No painel, o limite são três segundos, que é o suficiente para uma conexão ruim e curto o bastante para que a pessoa não se desespere.

**O módulo que pede os dados, completo.** Na lição 8, `js/load.js` deixava passar os erros tal como vinham: o `TypeError` de uma rede caída, o `SyntaxError` de um JSON quebrado. Servia para quem programa, que os lê no console, mas não para quem usa o painel, que precisa de uma frase que entenda. Agora o módulo **traduz**: captura cada falha, olha o seu nome e lança no lugar dela um erro com uma mensagem para pessoas. Segue com a sua regra de sempre: **não toca o documento**. Quem decide como mostrar é a view.

Antes do código, dois detalhes de escrita que aparecem nele pela primeira vez. O primeiro: em `loadServices(url, timeoutMs = 3000)`, o `= 3000` é um **valor padrão** do parâmetro; se quem chama não passa o segundo argumento, `timeoutMs` vale 3000. O segundo: `let response;` e `let data;` declaram as variáveis **sem valor** fora de cada `try`, e dentro do `try` elas recebem uma atribuição, o mesmo truque que `main.js` usou na lição 8 com `services`: uma variável declarada dentro de um bloco `{ … }` só existe dentro desse bloco.

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

Leia o código com estas perguntas:

- **Por que há dois `try`?** Porque são dois passos com duas classes de falha distintas. O primeiro captura o que ocorre antes de ter resposta: não há conexão, ou o tempo se esgotou. O segundo, o que ocorre ao ler o corpo, e ali há três casos que não se devem confundir. Segundo o [MDN sobre `Response.json()`](https://developer.mozilla.org/en-US/docs/Web/API/Response/json), a leitura pode ser rejeitada com `SyntaxError` (o texto não é JSON), com um erro de aborto (aqui, o `TimeoutError` do limite) ou com `TypeError`. O `TypeError` não diz uma coisa só: pode ser que a conexão tenha caído no meio ou que o corpo não tenha podido ser decodificado (o MDN dá o exemplo de um cabeçalho `Content-Encoding` errado). A partir do código não se distingue qual dos dois foi, então a mensagem diz só o que é seguro: “No se pudo leer completa la respuesta del servidor.” (“Não foi possível ler a resposta do servidor por completo.”). Por isso o segundo `catch` pergunta pelo nome: só um `SyntaxError` merece a frase “não é JSON válido”; dizê-la diante de uma conexão cortada mandaria a pessoa procurar um erro no arquivo que não existe.
- **Por que as mensagens são nossas e não o `error.message` do navegador?** Porque a mensagem do navegador é escrita para programadores, em inglês, e muda entre Chrome e Firefox (“Failed to fetch”, “NetworkError when attempting to fetch resource”). Quem usa o painel precisa de uma frase que entenda. O detalhe técnico, para quem depura, já está no console.
- **O que mudou em relação à lição 8?** Os dois `try`, o tempo limite e a tradução das mensagens. A verificação de `ok`, a de `Array.isArray` e a de `isService` são as mesmas. Lembre por que existe a última: um arquivo com `[null]` é JSON perfeitamente válido e é um array; sem `isService`, esse `null` chegava até `summarize`, que tentava ler `service.status` de `null`, e o programa parava com um `TypeError` *fora* de qualquer `try`: o painel ficava sem aviso, sem tabela e sem explicação. Com a verificação, esse caso termina no aviso vermelho “Algún servicio de la lista llegó incompleto o con datos de otro tipo.” (“Algum serviço da lista chegou incompleto ou com dados de outro tipo.”), que foi o que se comprovou no Chrome ao preparar a lição.

### 9.2 Os três estados: carregando, erro e vazio

**O que é uma fase.** O painel da lição 8 tinha um estado com a lista, a hora, a ordem e a seleção. Agora precisa saber mais uma coisa: **em que momento da carga está**. Acrescenta-se um campo, `phase`, com três valores possíveis:

- `"loading"`: foi pedido e ainda não há resultado.
- `"error"`: foi pedido e falhou; em `errorMessage` fica o texto para a pessoa.
- `"ready"`: chegou uma lista.

E agora a decisão de projeto mais fina da lição. Restava uma quarta situação, **“vazio”**: a lista chegou bem, mas não tem nenhum serviço. É uma quarta fase? Não: é uma **consequência**. Não é preciso guardá-la, ela se *deduz* do que já está guardado: `phase === "ready"` e `services.length === 0`. Guardar dois fatos que podem ser deduzidos um do outro é a receita para que um dia se contradigam. A função `situation` faz a dedução em um só lugar, devolve `"empty"` nesse caso, e a tela toda pergunta a ela.

Um lembrete de escrita antes do código: `select` usa o **operador ternário**, `condição ? valorSeSim : valorSeNão`, que a lição 6 apresentou em “Decidir, repetir e avisar de um erro”. É um `if` que *devolve um valor* e por isso cabe dentro de uma atribuição: `state.selected === id ? null : id` vale `null` se o serviço já estava escolhido e `id` se não.

Em relação à lição 8 mudam três coisas: `createState` ganha dois campos, `phase` (que começa em `"loading"`) e `errorMessage`; `loadSucceeded` além disso passa a fase para `"ready"`; e aparecem três funções, `startLoading`, `loadFailed` e `situation`. O resto fica igual.

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

**Duas coisas que convém distinguir.** A primeira: um erro e um vazio se parecem de longe e são opostos. Um erro é “não consegui descobrir”; um vazio é “descobri e não há nada”. Ao primeiro se oferece **tentar de novo**, porque pode ser que da próxima vez funcione. Ao segundo também se deixa perguntar de novo, porque uma lista vazia hoje pode ter serviços dentro de um minuto; mas sem o aviso vermelho, porque não é uma falha. Um painel que diz “erro” quando a lista está vazia mente, e um que diz “não há serviços” quando a rede falhou mente pior, porque a pessoa conclui que está tudo bem.

A segunda: as transições são poucas e estão todas escritas. O painel começa em `"loading"`; dali passa a `"ready"` ou a `"error"`; e volta a `"loading"` só por uma ação da pessoa: “Reintentar”, a partir de um erro ou de uma lista vazia, ou “Revisar ahora”, com os dados à vista. Não há outro caminho. Ter tão poucas faz com que o código seja fácil de raciocinar.

**Desenhar as três situações, e anunciá-las.** A view já sabia desenhar a tabela e a hora. O novo está em `render`, que primeiro pergunta `situation(state)` e mostra uma ou outra tela, e em uma função pequena que sai dela: `renderSummary`, que é o que na lição 8 vivia dentro de `render`. Repare como `render` se organiza: no início decide que avisos e que zonas se veem, depois o resumo, e só se a situação é `"ready"` segue com a tabela.

Duas peças de escrita que convém reconhecer antes de lê-lo. A primeira é uma cadeia de ternários: `a ? x : b ? y : z` se lê “se `a`, `x`; se não, se `b`, `y`; se não, `z`”, e assim o aviso escolhe entre três textos em uma só expressão. A segunda é [`Object.hasOwn(objeto, chave)`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn), que devolve `true` somente se o objeto tem essa chave **escrita nele mesmo**. É necessária porque todo objeto do JavaScript herda propriedades que ninguém escreveu, como `constructor` ou `toString`: `LABELS["toString"]` não é `undefined`, é uma função. Com `Object.hasOwn(LABELS, status)`, um estado que não seja `available` nem `down` é reconhecido como desconhecido, ainda que se chame `toString`. E um `for (const cell of [...])` percorre uma lista escrita ali mesmo, como qualquer `for…of` da lição 6.

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

Duas decisões deste arquivo. A primeira, o resumo: enquanto carrega ou quando falha, as suas quatro cifras ficam vazias, porque não há nada a contar; mas no caso vazio diz 0, 0 de 0, 0 e “sin datos” (“sem dados”), porque zero serviços **é** um resultado, e o resumo tem de dizer o mesmo que o aviso. A segunda, como sempre: tudo entra com `textContent`, inclusive a mensagem de erro, que também é um texto que você não escreveu naquele momento. A hora continua sendo escrita por `renderCheckedAt`, a da lição 8: se uma verificação falha, o cabeçalho conserva a hora da última que deu certo, que é justamente o que a pessoa precisa saber. E uma terceira, sobre “Reintentar”: ele é mostrado com um erro **e** com uma lista vazia. “Revisar ahora” vive dentro de `#data-zone`, que nesses dois casos está oculta; sem “Reintentar”, depois de um vazio não restaria nenhum botão para voltar a perguntar, e a pessoa teria de recarregar a página. Pela mesma razão, ao terminar uma carga `main.js` devolve o foco a “Revisar ahora” só se a tabela ficou à vista, e a “Reintentar” nos outros dois casos.

O que está por trás do HTML importa tanto quanto o JavaScript, porque aqui vive a acessibilidade dos estados. É o `index.html` da lição 8 com uma mudança: a seção de serviços ganha os avisos, o botão “Reintentar” e uma zona, `#data-zone`, que envolve tudo o que só faz sentido com dados: a barra de controles, a tabela e o detalhe.

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

- **Duas regiões de aviso, presentes desde o início.** `#notice` tem `role="status"` e `#error-notice` tem `role="alert"`. São **regiões dinâmicas** (*live regions*): quando o seu texto muda, um leitor de tela o anuncia. `status` o faz com cortesia, esperando que termine o que estava dizendo; `alert` interrompe, e se reserva para o que a pessoa precisa saber já. Por isso “Cargando” e “No hay servicios” vão na primeira e as falhas na segunda. A regra técnica é que as regiões devem **existir antes de o seu conteúdo mudar**; se são criadas com a mensagem já dentro, muitos leitores não a anunciam.
- **`Cargando servicios…` já está no HTML.** Antes de rodar o primeiro byte de JavaScript, a pessoa vê que algo está acontecendo. Quando `main.js` inicia, escreve de novo o mesmo texto, o que não produz nenhuma mudança visível.
- **`hidden` para o que não corresponde.** A zona dos dados e o botão “Reintentar” são ocultados com o atributo `hidden`, que os tira da vista **e** da árvore de acessibilidade. Assim um leitor de tela não percorre uma tabela vazia.
- **“Reintentar” é um botão de verdade**, e o seu ouvinte é registrado uma só vez.

A folha ganha dois blocos no final de `css/styles.css`. O primeiro reabre a camada `reset` para uma única regra: o que leva o atributo `hidden` não se vê, diga o que disser qualquer outra regra. É o único `!important` da folha, e vai na primeira camada de propósito: entre declarações com `!important`, a ordem das camadas se inverte —a mesma inversão que a lição 3 contou para as origens—, então na primeira camada ele vence todas. Não é um remendo para vencer outra regra; é uma garantia: o oculto fica oculto. O segundo bloco dá forma aos avisos, e tem uma armadilha que convém ver devagar. Um aviso vazio não deveria desenhar um quadro sem texto, então é preciso “apagá-lo” enquanto está vazio. A saída óbvia, `display: none`, é justamente a errada: um elemento com `display: none` sai também da árvore de acessibilidade, e então a região dinâmica deixa de existir para o leitor de tela até receber texto, que é exatamente o que a regra anterior proíbe. Mediu-se no Chrome 154: com `display: none`, `#notice` e `#error-notice` vazios não apareciam na árvore de acessibilidade; com a regra abaixo, que apenas tira a margem, o preenchimento e a borda, aparecem como `status` e `alert` e medem 0 px de altura. Veem-se igual (nada) e continuam vigiados.

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

O aviso de erro usa as cores do selo “Caído” (“Fora do ar”), que a lição 3 já mediu: 7.08 para 1 de contraste.

O último pedaço é `js/main.js`, que pede os dados e guarda o resultado no estado. Três ferramentas aparecem nele pela primeira vez, e convém saber o que fazem antes de lê-lo:

- **`location.search`** é a parte do endereço da página que vai a partir do sinal `?`: em `…/panel/?case=empty` vale `"?case=empty"`. [`new URLSearchParams(texto)`](https://developer.mozilla.org/pt-BR/docs/Web/API/URLSearchParams) a divide em pares nome–valor, e `.get("case")` devolve o valor de `case`, ou `null` se o endereço não o traz.
- **`document.activeElement`** é o elemento que tem o foco neste momento: o botão que você acabou de pressionar com o teclado, o campo onde você escreve, ou o `<body>` se nada o tem.
- **`?.`**, o encadeamento opcional da lição 6: `document.activeElement?.dataset?.id` lê o `id` do botão focado se houver, e dá `undefined` em vez de parar com um erro se algum dos passos não existir. (A função `update` que o usa é a da lição 7, sem mudanças.)

Com isso, o arquivo:

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

Duas coisas deste arquivo merecem ser explicadas. A primeira é `load()`, que mudou em relação à lição 8: agora passa a `"loading"`, desenha, tenta e, em qualquer dos dois desfechos, guarda no estado e desenha de novo. Já não há `console.error`: a falha tem o seu lugar na tela. O `try`/`catch` continua **só em volta da requisição**, não do desenho, pela mesma razão da lição 8: se o desenho tivesse um erro de programação, não queremos que ele o disfarce de “não foi possível conectar”; queremos vê-lo no console. E uma lição da 7 que volta: o botão que pediu a carga, “Revisar ahora” ou “Reintentar”, fica oculto enquanto se carrega, e um elemento oculto perde o foco, que cai no `<body>`. Por isso `load()` anota no início se o foco estava em um desses dois botões e, ao terminar, o devolve ao que corresponde: “Reintentar” se voltou a falhar, “Revisar ahora” se os dados chegaram. Sem essas linhas, quem usa o teclado teria de percorrer a página desde o alto depois de cada verificação.

A segunda é a tabela `CASES`. Para que você possa ver cada situação sem quebrar nada, o painel aceita no endereço `?case=empty`, `?case=error`, `?case=invalid` ou `?case=timeout`. Repare que o texto do endereço **não é usado como endereço da requisição**: apenas escolhe uma opção entre cinco que nós escrevemos. Se o painel fizesse `fetch(params.get("url"))`, qualquer um poderia lhe mandar um link que fizesse o *seu* painel pedir e desenhar o que ele quisesse. `Object.hasOwn` evita que `?case=constructor` encontre um valor herdado.

**Ver os três estados.** Com o servidor ligado, abra `…/09-cuando-algo-falla/panel/` e faça este percurso; são os seus testes da lição:

| Endereço | O que você deve ver |
|---|---|
| `panel/` | A tabela, o resumo em 5, 4 de 5, 1 e 465 ms, e no cabeçalho a data e a hora em que os dados chegaram |
| `panel/?case=empty` | “No hay servicios que revisar.”, sem tabela, com o botão “Reintentar” para voltar a perguntar; o resumo em zero |
| `panel/?case=error` | “El servidor respondió con el código 404.”, com o botão “Reintentar” |
| `panel/?case=invalid` | “La respuesta no es JSON válido.” (pede `index.html`, que não é JSON) |
| `panel/?case=timeout` | com `slow-server.py`: “Cargando servicios…” durante três segundos e depois “El servidor no respondió en 3000 ms.”, com “Reintentar”. Com o servidor de sempre, a tabela normal: não há quem demore |

Para o estado **“carregando”**, que na sua máquina dura milissegundos, há duas maneiras de vê-lo. A mais simples é `?case=timeout` com `slow-server.py` ligado: o aviso fica três segundos antes de mudar para o erro. A outra, que serve com qualquer servidor, são as ferramentas do navegador: abra a aba **Rede**, escolha um perfil de velocidade lento (no Chrome, “3G”; no Firefox, “GPRS”; os nomes dos perfis mudam entre versões) e recarregue; e com a opção “Sem conexão”, pressione “Reintentar” depois de um erro e você verá “No se pudo conectar con el servidor.” (“Não foi possível conectar ao servidor.”). Ver cada estado com os próprios olhos é a parte em que mais se aprende; não a pule.

**O teste que fecha a seção.** Com `?case=error`, navegue só com o teclado até “Reintentar”, pressione Enter e observe que o aviso não desaparece (continua falhando, porque o arquivo continua não existindo) e que o foco continua em “Reintentar”. Faça o mesmo com “Revisar ahora” no painel normal: a hora do cabeçalho muda e o foco fica no botão. E uma medição que não se pula: com a janela a 320 px, nos cinco casos, `document.documentElement.scrollWidth <= document.documentElement.clientWidth` deve devolver `true`; eu verifiquei e devolve `true` nos cinco, graças à caixa que rola da lição 5 e à regra `position: relative` da lição 7. Com um leitor de tela ligado (no Linux Mint, o Orca costuma ser ativado com `Super+Alt+S`), o aviso vermelho deve ser anunciado sem que você mova o foco.

### 9.3 Várias requisições ao mesmo tempo

**O problema.** O `revisor` de verdade vai verificar muitos serviços, e cada um pode responder, demorar ou falhar por conta própria. Quando as requisições não dependem uma da outra, não se espera uma para lançar a seguinte: lançam-se todas e espera-se o conjunto. Pedi-las uma após a outra, com um `await` dentro de um laço, faz a verificação demorar a **soma** de todas; lançá-las juntas faz demorar o que demorar **a mais lenta**.

**As duas formas de esperar um conjunto.** `Promise.all(lista)` recebe uma lista de promessas e devolve uma só, que se cumpre quando todas se cumprem. Mas **é rejeitada assim que uma falha**, e descarta o resultado das demais, o contrário do que você quer num relatório em que um serviço fora do ar é parte do resultado, não um motivo para jogar fora os outros. Para isso existe `Promise.allSettled`, que espera todas e devolve para cada uma um objeto que diz se foi cumprida (`status: "fulfilled"`, com o seu `value`) ou rejeitada (`status: "rejected"`, com a sua `reason`). É “Baseline” desde julho de 2020 ([MDN: `allSettled`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)).

Antes da figura, uma peça de escrita: `urls.map(request)` aplica a função `request` a cada endereço e devolve um array com o que cada chamada devolve. Como `request` é `async`, cada chamada devolve uma promessa: o resultado é **um array de promessas**, todas já a caminho, que é justamente o que `allSettled` espera receber. E no `map` final, o segundo parâmetro, `i`, é a posição de cada resultado, que serve para recuperar o endereço que lhe corresponde: `allSettled` devolve os resultados **na mesma ordem** em que recebeu as promessas, não importa qual terminou primeiro. A figura 9.2 pede três arquivos, um deles inexistente:

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

O arquivo que falta não levou os outros dois: cada um traz o seu próprio desfecho. O painel de hoje lê um único arquivo e não a usa; você a guarda para quando o `revisor` pedir a cada serviço o seu próprio estado, e então cada linha da tabela poderá ter o seu próprio “falhou” sem que o resto do painel fique sabendo.

## O erro que você vai ver

**O erro de CORS.** É o primeiro que qualquer um que peça dados a outro lugar encontra. O painel pede um arquivo do **seu próprio** servidor, e por isso não o vê; para provocá-lo, a figura 9.3 pede o mesmo arquivo a *outro* servidor.

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

Suba um segundo servidor a partir da pasta do painel, em outro terminal e também dentro do repositório baixado:

```bash
cd programas/09-cuando-algo-falla/panel
python3 -m http.server 8001 --bind 127.0.0.1
```

Com o primeiro servidor (o da porta 8000) ainda ligado, abra `http://127.0.0.1:8000/09-cuando-algo-falla/fig09_03.html`. A página diz:

```text
esta página vive en: http://127.0.0.1:8000
voy a pedir a:        http://127.0.0.1:8001
fetch falló: TypeError: Failed to fetch
```

(“Failed to fetch” é a mensagem do Chrome; o nome, `TypeError`, é o mesmo em todos os navegadores.) E o console do Chrome mostra, em vermelho:

```text
Access to fetch at 'http://127.0.0.1:8001/data/services.json' from origin 'http://127.0.0.1:8000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

(No Firefox o console diz outra coisa —começa com “Cross-Origin Request Blocked”— e a mensagem do erro é “NetworkError when attempting to fetch resource.”, mas o erro que o seu código recebe continua se chamando `TypeError`, como diz a [especificação do Fetch](https://fetch.spec.whatwg.org/#fetch-method) e a tabela de 8.1: a página imprimiria `TypeError: NetworkError when attempting to fetch resource.`. É o mesmo problema.)

Para entendê-lo é preciso uma definição. A **origem** de uma página é a combinação de três coisas: o esquema (`http`), o servidor (`127.0.0.1`) e a porta (`8000`). Dois endereços com uma porta diferente são origens diferentes ainda que seja a mesma máquina, e é isso que acontece aqui. A **política de mesma origem** do navegador diz que uma página pode ler livremente o que vem da sua origem, e não o que vem de outra, a menos que essa outra o permita ([MDN: política de mesma origem](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Same-origin_policy)). A forma de permitir se chama **CORS** (*cross-origin resource sharing*, compartilhamento de recursos entre origens): o servidor dono dos dados acrescenta à sua resposta o cabeçalho `Access-Control-Allow-Origin`, com a origem à qual dá permissão ([MDN: CORS](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Guides/CORS)).

Três ideias que corrigem os mal-entendidos mais comuns:

1. **A requisição saiu, sim.** Se você abre a aba Rede, verá a requisição e a sua resposta (esta, inclusive, com um 200). O que o navegador **bloqueia é que o seu código leia essa resposta**. O CORS não protege o servidor, que já recebeu a requisição: protege quem usa o navegador, para que uma página alheia não leia coisas suas sem permissão.
2. **Conserta-se no servidor, não no seu código.** Não há nada a escrever no painel para contornar o bloqueio. Quem controla o servidor deve acrescentar o cabeçalho. Se o servidor não é seu, pede-se ao dono; ou o painel e os dados são servidos a partir da mesma origem, como faz este curso.
3. **Há “soluções” que não são.** A extensão que “desativa o CORS”, o serviço público que reenvia as requisições, ou a opção `mode: "no-cors"` do `fetch` (que dá uma resposta “opaca” que o código não pode ler) fazem o erro sumir do console sem resolver nada: ou deixam o seu navegador desprotegido, ou mandam os dados de quem usa o seu painel para um terceiro. O `mode: "no-cors"` é o pior, porque parece que funciona.

E uma consequência para o painel: se algum dia o `revisor` pedisse seus dados a outra origem sem permissão, a pessoa veria “No se pudo conectar con el servidor.”, porque a partir do código um bloqueio por CORS é indistinguível de uma rede caída. A frase é verdadeira do ponto de vista da pessoa: o painel não conseguiu obter os dados. A causa exata está no console, para quem depura.

Feche o segundo servidor com `Ctrl+C` ao terminar.

## O que se faz errado

- **Uma requisição sem tempo limite.** Um servidor que não responde deixa a página em “Cargando…” sem fim, o que é pior que um erro porque não diz o que fazer. `AbortSignal.timeout` custa uma linha.
- **Perguntar pela mensagem em vez do nome.** `error.message` muda entre navegadores e versões; `error.name` (`TimeoutError`, `TypeError`, `SyntaxError`) é fixado pela especificação. O código decide pelo nome.
- **Um painel que só sabe o caso feliz.** Se a tabela é a única coisa que o código sabe desenhar, uma falha se vê como uma página em branco. Os três estados não são um enfeite: são parte do produto.
- **Tratar o vazio como erro, ou o erro como vazio.** Oferecem-se à pessoa coisas diferentes, e confundi-los faz com que ela decida mal.
- **Criar a região dinâmica com a mensagem já dentro, ou ocultá-la com `display: none`.** Nos dois casos o leitor de tela não anuncia nada. A região existe desde o início, vazia, e só o seu texto muda.
- **Mostrar com `innerHTML` a mensagem de erro ou os dados que chegaram.** O que vem de fora é um dado de fora, ainda que venha do seu próprio servidor, porque amanhã esse servidor pode ser outro. O princípio da lição 7 continua vigente sem mudanças.
- **Usar `await` dentro de um laço para requisições independentes.** `for (const url of urls) { await fetch(url) }` faz uma requisição, espera, faz a seguinte, espera: demora a soma de todas. Lançam-se todas ao mesmo tempo e espera-se o conjunto com `Promise.allSettled`.
- **Usar o endereço do navegador como endereço da requisição.** Um endereço que vem da barra do navegador é um dado de fora. Escolhe-se entre opções que você escreveu, como faz a tabela `CASES`.
- **“Consertar” o CORS a partir da página.** Nem `mode: "no-cors"` nem uma extensão o resolvem; quem o conserta é o servidor que dá os dados.

## Exercícios

### Exercício 1 — Os cinco casos e quem os produz

Abra o painel com cada um dos cinco casos da tabela de 9.2 e com a opção “Sem conexão” da aba Rede. No seu diário de bordo, para cada um, escreva a mensagem que apareceu e a **linha de `js/load.js`** que a produziu. Depois responda: quais dos seis casos nunca mostram um código de status na aba Rede, e por quê?

### Exercício 2 — Quanto demorou a verificação

Faça com que, quando os dados chegam bem, o painel mostre embaixo do detalhe “La revisión tardó 12 ms.” (“A verificação demorou 12 ms.”), com os milissegundos que passaram entre pedir os dados e tê-los. `performance.now()` dá o momento atual em milissegundos, com decimais; a diferença entre duas chamadas é o que passou entre elas. Decida onde se **mede**, onde se **guarda** e onde se **escreve**, e verifique que, se você clica em “Ordenar”, a cifra não muda, e que, se clica em “Revisar ahora”, muda.

### Exercício 3 — Quantas listas chegaram

Copie a figura 9.2 como `count.html` na mesma pasta e mude-a para que, embaixo das três linhas, escreva uma quarta com o resumo: “Llegaron 2 de 3.” (“Chegaram 2 de 3.”). Use `filter` sobre o resultado de `allSettled`, sem pedir nada de novo. Depois acrescente à lista de endereços `"panel/data/otro-que-no-existe.json"` e verifique que o resumo passa a “Llegaron 2 de 4.” sem que você mude mais nada.

## Soluções

### Solução 1

As mensagens e de onde saem, em `js/load.js`:

| Caso | Mensagem | Linha que a produz |
|---|---|---|
| normal | (nenhuma: a tabela) | `return data;` |
| `?case=empty` | “No hay servicios que revisar.” | não é de `js/load.js`: quem decide é `situation` em `js/state.js` |
| `?case=error` | “El servidor respondió con el código 404.” | o `throw` dentro de `if (!response.ok)` |
| `?case=invalid` | “La respuesta no es JSON válido.” | o `throw` do ramo `SyntaxError` do segundo `catch` |
| `?case=timeout` (com `slow-server.py`) | “El servidor no respondió en 3000 ms.” | o `throw` do primeiro `catch`, ramo `TimeoutError` |
| Sem conexão | “No se pudo conectar con el servidor.” | o `throw` final do primeiro `catch` |

Mostram código de status na aba Rede os quatro casos em que o servidor de fato respondeu: normal (200), vazio (200), erro (404) e inválido (200, tipo `text/html`). Os que **nunca** o têm são “timeout” (a requisição fica pendente três segundos e é abortada sem ter recebido resposta) e “Sem conexão” (não houve com quem falar). A tabela de 8.1 marca **três** situações como “é rejeitada”: sem conexão, bloqueio por CORS e tempo esgotado. Estes dois casos são duas delas; a terceira, CORS, não aparece no painel porque ele pede à sua própria origem, e você a viu à parte com a figura 9.3. Nos demais casos, a promessa se cumpriu e o painel teve de verificar `ok` ou o conteúdo por conta própria.

### Solução 2

São três trabalhos e vão em três arquivos. **Medir** é um efeito —consulta o relógio em volta da requisição—, então vai em `js/main.js`, junto à chamada a `loadServices`. **Guardar** a cifra é estado: é um fato que o painel lembra até a carga seguinte. E **escrevê-la** é desenho. Em `js/state.js`, um campo a mais e um parâmetro a mais:

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

Em `js/main.js`, dentro de `load()`, mede-se antes e depois da requisição:

```js
  const start = performance.now();
  try {
    const services = await loadServices(current.url, current.timeoutMs);
    loadSucceeded(state, services, new Date(), Math.round(performance.now() - start));
  } catch (error) {
    loadFailed(state, error.message);
  }
```

Em `index.html`, `<p id="duration"></p>` embaixo de `#detail`, dentro de `#data-zone`; em `js/main.js`, `duration: document.querySelector("#duration"),` no objeto `elements`; e em `js/view.js`, no final de `render`:

```js
  elements.duration.textContent = `La revisión tardó ${state.durationMs} ms.`;
```

“Ordenar” não muda a cifra porque só muda `sortByTime`: a cifra só é guardada quando chegam dados. “Revisar ahora” a muda, sim, porque volta a passar por `loadSucceeded`. Se você a tivesse calculado dentro de `render` com `performance.now()`, teria medido outra coisa —quanto passou desde que a página foi aberta até o desenho— e ela mudaria a cada clique.

### Solução 3

Depois de construir as linhas, contam-se os resultados cumpridos e acrescenta-se a quarta:

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

`filter` deixa apenas os resultados com `status` igual a `"fulfilled"`, e `.length` os conta. Contra `results.length`, e não contra um 3 escrito à mão, o resumo se ajusta sozinho quando a lista muda: com o quarto endereço, o Chrome 154 mostra `panel/data/otro-que-no-existe.json: falló, código 404` e `Llegaron 2 de 4.`. É a forma de pensar do `revisor`: o número de serviços sai dos dados, nunca do código.

## Como sei que consegui

- [ ] Com a pasta `programas/` servida por `slow-server.py`, `09-cuando-algo-falla/fig09_01.html` mostra `TimeoutError`; com `python3 -m http.server`, a mesma página diz “alcanzó a responder”.
- [ ] `fig09_02.html` mostra duas listas que chegaram e uma que falhou com o código 404.
- [ ] No seu painel, o resumo diz 5, 4 de 5, 1 e 465 ms e o cabeçalho diz a data e a hora em que os dados chegaram.
- [ ] Os quatro casos com `?case=` mostram o aviso da tabela de 9.2 (o de `timeout`, com `slow-server.py`), e “Reintentar” aparece nos três que são erro e no vazio, nunca junto à tabela.
- [ ] Depois de pressionar “Revisar ahora” ou “Reintentar” com o teclado, o foco continua nesse botão.
- [ ] A 320 px de largura não há transbordamento horizontal em nenhum dos cinco casos.
- [ ] Com `?case=timeout` e `slow-server.py`, ou com um perfil de velocidade lento na aba Rede, consegue-se ver “Cargando servicios…”.
- [ ] Com “Sem conexão” e “Reintentar” o painel diz “No se pudo conectar con el servidor.”
- [ ] O console só mostra o erro de rede dos casos que você provocou de propósito, e nenhuma exceção do seu código.

**Revisão de lições anteriores** (responda sem olhar, e depois verifique):

1. Na lição 0: o que é uma origem, e que três partes de um endereço a formam?
2. Na lição 7: por que é preciso devolver o foco ao botão depois de desenhar de novo?
3. Na lição 8: por que a promessa do `fetch` se cumpre com um 404, e que linha de `js/load.js` o converte em um erro?

## Para ler mais

- [MDN — `AbortSignal.timeout()`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static) — o tempo limite e o `TimeoutError`, com a sua tabela de compatibilidade; consultado em 7 de outubro de 2026.
- [MDN — Compartilhamento de recursos entre origens (CORS)](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Guides/CORS) — o que é a origem e por que o servidor é quem o conserta; consultado em 7 de outubro de 2026.
- [MDN — Regiões dinâmicas do ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions) — `status`, `alert` e por que a região deve existir antes de o seu texto mudar; consultado em 7 de outubro de 2026.
- [MDN — `Promise.allSettled()`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled) — esperar um conjunto de promessas sem que uma falha leve as demais; consultado em 7 de outubro de 2026.
