# Lição 10 — Formulários e validação

**Tempo:** duas sessões de uns 90 min. Uma divisão que funciona: a primeira, “O porquê antes do como” e de 10.1 a 10.4 (o que o navegador já valida, `validity` e `setCustomValidity`, `:user-invalid` e o erro escrito onde se lê), com as suas figuras abertas no navegador; a segunda, 10.5 completa, que monta o painel em sete passos e cada um é verificado antes do seguinte, e depois “O erro que você vai ver” e os exercícios. Cada sessão termina em algo que você pode abrir e testar.

**O que você constrói:** o formulário para incluir serviços no `revisor` e os filtros para buscar entre eles

**O que você aprende:** a validação que o navegador já traz, `:user-invalid`, e como dizer um erro para que um leitor de tela o anuncie

## Ao terminar, você vai conseguir

- Escolher o `type` de um campo e os atributos (`required`, `minlength`, `pattern`, `min`, `max`, `step`) que fazem o navegador validar sem uma linha de JavaScript.
- Ler que regra um campo descumpre com `validity`, e escrever uma regra própria com `setCustomValidity` sem deixar o campo inválido para sempre.
- Explicar a diferença entre `:invalid` e `:user-invalid`, e por que um formulário não deve abrir em vermelho.
- Mostrar um erro como texto na página, associado ao seu campo com `aria-describedby` e `aria-invalid`, de modo que um leitor de tela o anuncie.
- Escrever um filtro como função pura e conectá-lo a um campo de busca e a um seletor.
- Dizer, com um exemplo, por que validar no navegador não é segurança.

## O porquê antes do como

Até a lição anterior o `revisor` só olha: traz um arquivo com serviços, desenha-o e calcula quantos estão disponíveis e quanto demoram em média. Olhar é a metade do trabalho de quem opera um conjunto de serviços. A outra metade é agir: cadastrar um que acabou de nascer, e encontrar rápido o que está dando problema quando a lista deixa de caber em uma tela.

As duas coisas são formulários. Um formulário é o lugar da página onde uma pessoa entrega dados ao programa, e isso o torna diferente de tudo o que você fez até agora. Os serviços do arquivo JSON foram escritos por você, ou por um programa que você conhece. O que alguém digita em um campo de texto foi escrito por uma pessoa com pressa, com o celular em uma mão, que pode deixar o campo vazio, pôr um nome que já existe, escrever “mil” onde se esperava um número, ou colar um texto de duzentos caracteres. Na lição 7 você aprendeu que os dados de fora não são confiáveis ao serem desenhados (`textContent`, nunca `innerHTML`). Na lição 8 aprendeu a olhar `response.ok` antes de dar por boa uma resposta, e na 9, que uma requisição pode falhar de várias maneiras e que cada falha é traduzida em uma frase que a pessoa entenda. Esta lição acrescenta a terceira porta de entrada: o que a pessoa escreve.

Há uma boa notícia, e é a razão de esta lição ser curta em JavaScript: **o navegador já sabe validar formulários**. Sabe há anos. Com alguns poucos atributos de HTML —que você já conhece da lição 2, porque são parte da semântica dos campos— o navegador impede o envio de um formulário incompleto, avisa o que falta e move o foco para o campo errado. A má notícia é a que ocupa a segunda metade da lição: o que o navegador mostra por conta própria é uma bolha que desaparece em segundos, não pode ser estilizada, está no idioma do navegador e nem sempre chega a quem usa um leitor de tela. Um painel que qualquer pessoa possa usar precisa que o erro fique escrito na página, junto ao campo, onde possa ser relido.

Por isso a ordem da lição é a mesma que convém seguir sempre: primeiro o que o navegador faz de graça, depois o momento correto de mostrar o erro, e no final o texto do erro. Se você começa escrevendo JavaScript, acaba reescrevendo, pior, o que já vinha pronto.

### O estado do painel ao final da lição 9

Esta lição parte de um painel concreto, e é melhor dizê-lo com todas as letras do que deixar que você o suponha. Ao fechar a lição 9, o `revisor` tem estas peças:

| Peça | O que faz | De que lição vem |
|---|---|---|
| `index.html` | o esqueleto: cabeçalho com a “Última revisión”, o resumo, e na seção de serviços as zonas de aviso (`#notice` e `#error-notice`, presentes desde o início), o botão “Reintentar” e uma zona de dados com a barra de controles —o buscador e os rádios “Mostrar”, ainda sem efeito, “Revisar ahora” e “Ordenar”—, a tabela com o seu `caption` e o detalhe | 2, 4, 5, 7, 8 e 9 |
| `css/styles.css` | camadas, variáveis de cor, selos de estado (`status-available`, `status-down`), o layout, a tabela, o foco visível, a classe `.visually-hidden` e os avisos | 3, 4, 5, 7 e 9 |
| `js/stats.js` | `countByStatus`, `averageResponseMs` e `summarize`, funções puras sobre o array de serviços | 6 |
| `js/load.js` | `loadServices(url, timeoutMs)`: `fetch` com tempo limite, verifica `response.ok` e lança um `Error` com uma mensagem que uma pessoa pode ler | 8 e 9 |
| `js/state.js` | o estado (`phase`, `services`, `errorMessage`, `checkedAt`, `sortByTime`, `selected`) e as únicas funções que o alteram | 7, 8 e 9 |
| `js/view.js` | `render(state, elements)`: desenha as três situações (carregando, erro, vazio), o resumo, a hora e a tabela, sempre com `textContent` | 7, 8 e 9 |
| `js/main.js` | junta as peças: carrega, escuta eventos, altera o estado e desenha de novo; aceita `?case=empty`, `?case=error`, `?case=invalid` e `?case=timeout` para ver cada situação | 8 e 9 |
| `data/services.json` e `data/services-empty.json` | os cinco serviços de exemplo com as chaves `id`, `name`, `status` (`available` ou `down`) e `responseMs`; e uma lista vazia | 6 e 8 |

Com esse painel aberto em `http://127.0.0.1:8000/09-cuando-algo-falla/panel/` (o servidor é ligado a partir da pasta `programas/` do [repositório do curso](https://github.com/HabilMX/curso-web), baixado no seu computador, como na lição 9; para que `?case=timeout` de fato esgote o tempo, ligue-o com `python3 09-cuando-algo-falla/slow-server.py`, como ali), o resumo diz 5, 4 de 5, 1 e 465 ms, e a tabela tem cinco linhas, cada uma com o seu botão “Ver detalle”.

O que o painel **ainda não tem**: nenhuma forma de incluir um serviço, e um buscador e um grupo de rádios que estão na página desde a lição 2 sem fazer nada. A lição 2 avisou: “Todavía no filtra ni busca nada: eso llega más adelante” (“Ainda não filtra nem busca nada: isso vem mais adiante”). Hoje vem: você constrói o formulário para incluir, e faz o buscador e os rádios filtrarem. Nesta lição os arquivos estão em `10-formularios-validacion/panel/`, que é o painel da lição 9 mais o que é novo.

## Os conceitos

Há três ideias novas nesta lição, e elas se apoiam uma na outra: a validação que o navegador traz (10.1 e 10.2), o momento em que convém mostrar o erro (10.3) e o erro escrito onde se lê (10.4). A seção 10.5 junta as três no painel.

Antes de começar, uma instrução de hábito para todas as lições a partir desta: **preveja antes de executar**. Cada vez que você vir um programa, antes de abri-lo escreva no seu diário de bordo o que você acha que vai acontecer. Acertar dá gosto, mas errar ensina mais: a distância entre o que você previu e o que ocorreu é exatamente o que falta você entender.

### 10.1 O navegador já sabe validar

Comecemos pelo concreto. A página abaixo é um formulário para pedir um aviso quando um serviço cair: um e-mail, o nome do serviço e quanto ele deve demorar para contar como problema. Leia-a e preveja: o que acontece se você pressiona “Pedir aviso” com tudo vazio? E se escreve `dorian@` no e-mail?

O programa do final é curto e faz uma só coisa: quando o formulário é enviado, escreve o que foi capturado. Usa uma peça nova, `new FormData(form)`. Lembre de “Decidir, repetir e avisar de um erro”, na lição 6, que `new` fabrica um objeto novo a partir de um molde; este molde, [`FormData`](https://developer.mozilla.org/pt-BR/docs/Web/API/FormData), lê todos os campos do formulário pelo seu atributo `name`, e `data.get("email")` devolve o que foi escrito no campo chamado `email`. Você o verá de novo, com mais detalhe, no painel.

```html
<!-- fig10_01.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Avisarme cuando caiga un servicio</title>
  <link rel="icon" href="data:,">
</head>
<body>
  <main>
    <h1>Avisarme cuando caiga un servicio</h1>
    <p>Los campos marcados con * son obligatorios.</p>

    <form id="alert-form">
      <p>
        <label for="email">Correo *</label><br>
        <input id="email" name="email" type="email" required autocomplete="email">
      </p>
      <p>
        <label for="service">Servicio *</label><br>
        <input id="service" name="service" type="text" required minlength="2">
      </p>
      <p>
        <label for="threshold">Avisar si responde en más de (ms)</label><br>
        <input id="threshold" name="threshold" type="number" min="100" max="60000" step="100" value="1000">
      </p>
      <button type="submit">Pedir aviso</button>
    </form>

    <p id="result" role="status"></p>
  </main>

  <script type="module">
    const form = document.getElementById("alert-form");
    const result = document.getElementById("result");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      result.textContent =
        `Aviso pedido: ${data.get("email")} recibirá un correo si ` +
        `${data.get("service")} tarda más de ${data.get("threshold")} ms.`;
    });
  </script>
</body>
</html>
```

Abra-a com o servidor local que você já conhece (ligado a partir da pasta `programas/` do repositório; esta página está em [`programas/10-formularios-validacion/`](https://github.com/HabilMX/curso-web/tree/main/programas/10-formularios-validacion), em `http://127.0.0.1:8000/10-formularios-validacion/fig10_01.html`) e pressione o botão sem escrever nada. Sem uma linha de JavaScript que valide, o navegador **não envia** o formulário, move o foco para o e-mail e mostra uma bolha que diz que falta preencher o campo. Escreva `dorian@` e pressione de novo: o navegador diz que o endereço está incompleto, e o diz com uma frase precisa (Chrome em espanhol: “Ingresa texto después del signo "@"…”; outro navegador usa outras palavras). Com `ana@ejemplo.mx` e um nome de serviço, o formulário é de fato enviado e o pequeno programa de baixo escreve o resultado.

A página, ao ser carregada, mostra apenas isto:

```text
Avisarme cuando caiga un servicio
Los campos marcados con * son obligatorios.
Correo *
Servicio *
Avisar si responde en más de (ms)
Pedir aviso
```

Tudo isso saiu de quatro atributos. Vamos um por um, porque são a caixa de ferramentas da validação e vale a pena saber o que cada um promete.

**`required`** diz que o campo não pode estar vazio. É o mais usado e o mais simples: em um campo de texto significa “ao menos um caractere”, em uma caixa de seleção “marcada”, e em um `<select>` “há uma opção escolhida, e não é a de convite”. Este último caso tem uma regra precisa que surpreende: se a **primeira** opção tem `value=""` (como “Elige un estado” no formulário do painel), a [especificação do HTML](https://html.spec.whatwg.org/multipage/form-elements.html#placeholder-label-option) a chama de *opção de convite* e, se for a que está escolhida, o campo conta como vazio. Repare que a regra é sobre a primeira opção, não sobre qualquer valor vazio: ao preparar esta lição comprovou-se no Chrome que uma segunda opção com `value=""` deixa o `<select required>` como válido. É a forma padrão de pôr uma opção de convite sem que alguém possa enviá-la por acidente, e por isso ela vai sempre primeiro.

**`type`** não muda apenas o teclado que aparece no celular: também valida. Um `type="email"` rejeita o que não se parece com um endereço, um `type="url"` o que não se parece com uma URL e um `type="number"` o que não é um número. Uma advertência honesta sobre `email`: o navegador aceita `a@b` porque, segundo a especificação, um endereço sem ponto no domínio é válido (existem em redes internas). O que se valida é a *forma*, não que o e-mail exista. Para saber se existe há uma única prova: mandar uma mensagem e esperar que alguém a abra.

**`minlength` e `maxlength`** limitam o comprimento. `maxlength` impede escrever além do limite, em silêncio, e por isso tem má fama: a pessoa digita e não acontece nada, sem explicação. Use-o quando o limite for real (um campo do banco de dados com esse tamanho) e avise quanto resta. `minlength`, por outro lado, só é verificado quando a pessoa *edita* o campo. Se o HTML traz um valor inicial que já viola `minlength`, o navegador não o marca; ao preparar esta lição comprovou-se com `value="ab"` e `minlength="5"`: a bandeira `tooShort` continua apagada até que alguém digite.

**Um parêntese necessário: as expressões regulares.** O atributo que vem a seguir, `pattern`, recebe uma *expressão regular*, e mais adiante o painel usará outra em JavaScript. Uma **expressão regular** é um padrão escrito em uma minilinguagem que descreve uma família de textos: em vez de dizer “o texto é `Pagos`”, diz “o texto começa com uma letra e depois traz qualquer coisa”. A maioria dos caracteres vale por si mesma (`a` é a letra `a`), e alguns têm um significado especial. Os que você vai ver nesta lição são estes:

| Peça | Significa |
|---|---|
| `.` | um caractere qualquer |
| `\S` | um caractere que **não** é espaço (o `S` maiúsculo nega `\s`, “um espaço”) |
| `\w` | uma letra sem acento, um dígito ou um sublinhado |
| `*` | o anterior, zero ou mais vezes |
| `+` | o anterior, uma ou mais vezes |
| `?` | o anterior é opcional: zero ou uma vez |
| `( … )` | agrupa várias peças para que `*`, `+` ou `?` se apliquem ao grupo completo |
| `[ … ]` | um caractere qualquer dos que estão entre colchetes |
| `^` e `$` | o início e o fim do texto |

Um exemplo resolvido, o do formulário do painel: `\S(.*\S)?`. Lê-se da esquerda para a direita: um caractere que não é espaço; depois, opcionalmente, um grupo formado por “qualquer coisa” e outro caractere que não é espaço. Dito em palavras: começa e termina com algo que não é um espaço, e no meio pode haver o que for, espaços inclusive. Verifique com casos: `Pagos` cumpre; `A` cumpre (o grupo opcional não aparece); `Mis pagos` cumpre (o espaço está no meio); ` Pagos` e `Pagos ` não cumprem, e tampouco o texto vazio. Esses seis casos foram verificados no motor do JavaScript tal como o navegador os compila. Em JavaScript, uma expressão regular se escreve entre barras, `/…/`, e depois da última barra vão as suas **bandeiras** (*flags*), letras que mudam como ela é aplicada: `g` (todas as ocorrências, não só a primeira) e `u` ou `v` (entender bem os caracteres do Unicode, como as letras com acento). O guia de [expressões regulares do MDN](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Regular_expressions) tem a lista completa; para esta lição basta a tabela.

**`pattern`** recebe uma expressão regular que o valor completo deve cumprir (a expressão é ancorada: é como se levasse `^` no início e `$` no fim). No formulário do painel, `pattern="\S(.*\S)?"` diz “começa e termina com algo que não seja um espaço”. Duas armadilhas: a primeira é que os navegadores atuais compilam o padrão em um modo estrito (a bandeira `v`), no qual um hífen solto dentro de um conjunto, como em `[\w-]+`, é um erro de sintaxe. O padrão inválido não avisa de forma ruidosa: o navegador o ignora e o campo fica sem regra, com uma mensagem apenas no console. A segunda armadilha é a gêmea: um padrão esperto demais rejeita dados reais, como um sobrenome com apóstrofo ou um nome com acento. Um padrão não é um ato de fé, é uma regra que alguém tem de manter.

**`min`, `max` e `step`** servem para os campos numéricos (e de data). `min="0" max="60000"` fixa a faixa. `step` fixa a grade de valores válidos, e aqui há um detalhe que pesa: a grade é contada a partir de `min`. Com `min="0" step="100"` são válidos 0, 100, 200…, de modo que 1050 é inválido ainda que esteja dentro da faixa.

Um comentário sobre `type="number"`, porque a decisão não é óbvia. O campo numérico valida sozinho, rejeita o que não é número e oferece setas para subir e descer. “Número”, atenção, não é “só dígitos”: também aceita um sinal, decimais (se `step` os permite) e até a notação científica; ao preparar esta lição comprovou-se no Chrome 154 que `1e2` é um valor válido e vale 100. Além disso, essas setas são ativadas sem querer com a rodinha do mouse, e quem usa um leitor de tela não encontra uma caixa de texto, e sim um “botão de número” que sobe e desce: o seu papel implícito é `spinbutton`, segundo o [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/number). O sistema de design do governo britânico, que investigou o tema com usuários reais, recomenda `type="text"` com `inputmode="numeric"` para números que não são incrementados (o [GOV.UK Design System](https://design-system.service.gov.uk/components/text-input/) o argumenta com a sua pesquisa), e a [documentação do MDN sobre `type="number"`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/number) faz a mesma ressalva para códigos postais ou cartões. O tempo de resposta do `revisor` é, sim, uma quantidade com faixa (“quantos milissegundos”), então usamos `type="number"` com `min` e `max`; se o seu campo fosse um número de protocolo, você usaria texto com `inputmode`.

E mais um atributo, que não valida mas pertence a este tema: **`autocomplete`**. Diz ao navegador (e a quem lê você com tecnologia assistiva) que tipo de dado o campo pede. `autocomplete="email"` faz o navegador oferecer o e-mail guardado, e o critério [1.3.5 das diretrizes de acessibilidade (WCAG 2.2)](https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html) pede que os campos que coletam dados pessoais declarem o seu propósito de forma que uma máquina entenda. Os campos do `revisor` (nome de um serviço, estado, milissegundos) não são dados pessoais, então ali não cabe um valor da lista; por isso o formulário do painel leva `autocomplete="off"`: não queremos que o navegador sugira nomes de serviços que alguém escreveu em outro site. A lista de valores permitidos está na [documentação do MDN sobre `autocomplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete).

### Duas coisas que a validação do navegador não é

**Não é segurança.** É comodidade. O MDN o diz sem rodeios no seu [guia de validação de formulários](https://developer.mozilla.org/pt-BR/docs/Learn_web_development/Extensions/Forms/Form_validation): a validação no cliente não deve ser considerada uma medida de segurança exaustiva, porque é muito fácil de contornar. Quem quiser enviar um valor inválido não usa o seu formulário: abre as ferramentas do navegador, tira o atributo `required` com um clique, ou nem sequer usa um navegador e manda a requisição com uma ferramenta de linha de comando. A validação do cliente existe para que a pessoa honesta erre menos. A validação que protege é a que o servidor repete, e você terá de escrevê-la lá quando o seu painel tiver um (no [curso de TypeScript](https://www.habil.mx/pt/cursos/typescript/) desta casa o painel ganha um servidor, e esse é o momento).

Neste curso o painel não tem servidor: o que você incluir vive na memória da página e desaparece ao recarregar. Essa é uma limitação dita de frente, não um descuido; o que se aplica é o hábito: **cada dado que entra é validado na fronteira por onde entra**.

**Não é o único mecanismo.** `novalidate` no `<form>` desliga a validação automática ao enviar, e `formnovalidate` em um botão a desliga para esse botão (útil em um “Salvar rascunho”). Desligá-la não desativa a API de validação que veremos a seguir: o formulário continua podendo perguntar a cada campo se é válido. No painel não usaremos `novalidate`: queremos que o navegador continue bloqueando o envio, e mudaremos apenas *como a mensagem é mostrada*.

Um último detalhe do envio: um campo com `disabled` fica fora de tudo. Não é validado, não conta para `checkValidity()` e não é enviado com o formulário. Ao preparar esta lição comprovou-se com um campo `required` e `disabled` vazio: `willValidate` é falso, `validity.valid` é verdadeiro e o campo não aparece em `FormData`. O painel aproveita isso: se o serviço está fora do ar não faz sentido pedir o seu tempo de resposta, então esse campo é desativado e deixa de ser obrigatório por si só.

### 10.2 Ler o estado de um campo: `validity` e `setCustomValidity`

A validação nativa tem duas metades. Os atributos a *declaram*; a **API de validação de restrições** (Constraint Validation API, descrita no [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Constraint_validation) e na [especificação do HTML](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#constraints)) permite *perguntar* e *acrescentar regras* a partir do JavaScript.

Cada campo tem uma propriedade `validity` ([`ValidityState`](https://developer.mozilla.org/pt-BR/docs/Web/API/ValidityState)): um objeto com uma bandeira para cada regra que pode ser descumprida. As que você usará:

| Bandeira | Acende quando |
|---|---|
| `valueMissing` | o campo é `required` e está vazio |
| `typeMismatch` | o valor não tem a forma do `type` (e-mail, URL) |
| `patternMismatch` | o valor não cumpre o `pattern` |
| `tooShort` | a pessoa escreveu menos que `minlength` |
| `rangeUnderflow` / `rangeOverflow` | o número fica abaixo de `min` ou acima de `max` |
| `stepMismatch` | o número não cai na grade de `step` |
| `badInput` | a pessoa escreveu algo que o campo não consegue converter (em um `type="number"`, um `-` solto) |
| `customError` | o seu código chamou `setCustomValidity` com uma mensagem |
| `valid` | nenhuma das anteriores |

A página a seguir percorre essas bandeiras com uma forma de laço que você ainda não usou: **`for…in`**. Você já conhece `for…of` da lição 6, em “Decidir, repetir e avisar de um erro”: percorre os **valores** de uma lista. `for (const flag in objeto)` percorre outra coisa: os **nomes das propriedades** de um objeto, um por volta, como texto. Com `{ valueMissing: true, tooShort: false }`, `flag` valeria `"valueMissing"` na primeira volta e `"tooShort"` na segunda. Para ler o valor de uma propriedade cujo nome está guardado em uma variável usam-se colchetes: `control.validity[flag]` é `control.validity.valueMissing` quando `flag` vale `"valueMissing"`. Um detalhe técnico que aqui trabalha a seu favor: `for…in` também visita as propriedades que o objeto herda do seu molde, e as bandeiras de `validity` vivem justamente ali, no molde `ValidityState`; por isso o laço as encontra todas ([MDN: `for…in`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/for...in)). Em um objeto escrito por você, onde as propriedades herdadas não interessam, percorre-se com `Object.keys` ou filtra-se com `Object.hasOwn`, como na lição 9.

Antes de ler a página a seguir, preveja: se você escreve `-5` em um campo numérico com `min="0"` e `step="100"`, que bandeiras se acendem? (Uma só resposta é provável; duas é a correta.)

```html
<!-- fig10_02.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Las banderas de validity</title>
  <link rel="icon" href="data:,">
  <style>
    input { font: inherit; padding: 0.5rem; }
    pre { background: #f4f6f8; padding: 0.75rem; }
  </style>
</head>
<body>
  <main>
    <h1>Las banderas de validity</h1>

    <p>
      <label for="time">Tiempo de respuesta (ms)</label><br>
      <input id="time" type="number" required min="0" max="60000" step="100">
    </p>
    <p>
      <label for="name">Nombre (no puede ser «admin»)</label><br>
      <input id="name" type="text" required minlength="3">
    </p>

    <h2>Banderas activas</h2>
    <pre id="report" role="status"></pre>
  </main>

  <script type="module">
    const time = document.getElementById("time");
    const name = document.getElementById("name");
    const report = document.getElementById("report");

    function activeFlags(control) {
      const flags = [];
      for (const flag in control.validity) {
        if (control.validity[flag] === true && flag !== "valid") {
          flags.push(flag);
        }
      }
      return flags.length === 0 ? "ninguna (valid: true)" : flags.join(", ");
    }

    function validateName() {
      // Sin la rama que limpia, el campo se quedaría inválido para siempre.
      name.setCustomValidity(
        name.value.toLowerCase() === "admin" ? "Ese nombre está reservado." : "",
      );
    }

    function show() {
      report.textContent =
        `tiempo -> ${activeFlags(time)}\n` + `nombre -> ${activeFlags(name)}`;
    }

    for (const control of [time, name]) {
      control.addEventListener("input", () => {
        validateName();
        show();
      });
    }
    show();
  </script>
</body>
</html>
```

A página percorre as propriedades de `validity` e lista as que valem `true`. Ao abri-la, os dois campos vazios descumprem o seu `required`:

```text
Las banderas de validity
Tiempo de respuesta (ms)
Nombre (no puede ser «admin»)
Banderas activas
tiempo -> valueMissing
nombre -> valueMissing
```

Escreva `-5` no tempo e você verá `rangeUnderflow, stepMismatch`: está abaixo de `min` e além disso cai fora da grade de 100 em 100 contando a partir de 0. Por isso eu disse que uma só resposta é o provável e duas a correta: **várias bandeiras podem estar acesas ao mesmo tempo**, e por isso um programa que mostra mensagens tem de decidir qual vai primeiro. Com `1050` só sobe `stepMismatch`; com `70000`, `rangeOverflow`. No nome, escrever `ad` acende `tooShort`, e escrever `admin` apaga essa bandeira e acende `customError`.

Essa última é a regra própria. `setCustomValidity("texto")` diz ao campo “considere-se inválido, e este é o motivo”; o navegador além disso a usa como o texto da sua bolha. Ela traz uma armadilha que causa um erro clássico: **uma mensagem não vazia deixa o campo inválido para sempre**. O navegador não sabe quando a sua regra já se cumpre; é você quem deve chamar `setCustomValidity("")` assim que o valor estiver correto. Na página, a função `validateName` faz isso com uma única expressão (um ternário): se o nome é `admin` põe a mensagem, e se não põe a string vazia. Tirar esse segundo ramo é o erro mais fácil de cometer e o mais difícil de entender de fora, porque o campo “parece bem” e o formulário não é enviado.

Um dado útil antes de seguir: dois métodos permitem perguntar por todo o formulário. `checkValidity()` devolve `true` ou `false` e dispara o evento `invalid` em cada campo inválido, sem mostrar nada. `reportValidity()` faz o mesmo e além disso mostra a bolha do navegador. Quando você envia um formulário com o botão, o navegador chama a segunda por você.

### 10.3 `:user-invalid`: mostrar o erro quando é a hora

Há uma pergunta de design que parece de gosto e é de respeito: quando se pinta um campo de vermelho? A resposta ingênua é “quando é inválido”. O problema é que um campo `required` recém-carregado é inválido desde o primeiro instante: está vazio. Se você pinta de vermelho tudo o que é inválido, a pessoa abre o formulário e encontra um quadro de erros antes de ter feito qualquer coisa. É como se um caixa o repreendesse por ainda não ter chegado com o dinheiro.

A pseudoclasse `:invalid` faz exatamente isso: coincide com todo campo que descumpre uma regra, desde que a página carrega. Sua sucessora `:user-invalid` ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/:user-invalid), disponível em todos os navegadores desde novembro de 2023) coincide somente quando a pessoa já interveio: quando modificou o campo e saiu dele, ou quando tentou enviar o formulário. É a regra que já descreve o que você quis desde o início.

A página a seguir usa três peças pequenas para mostrar o que o navegador sabe. `elemento.matches(":user-invalid")` pergunta se o elemento cumpre esse seletor de CSS neste momento, e devolve `true` ou `false`. `setTimeout(show)`, sem tempo, pede “execute `show` assim que terminar o que está acontecendo”, para ler o estado *depois* de o navegador atualizá-lo. E o `true` no final de `addEventListener` escuta na fase de captura; a razão é explicada em 10.4, com o evento `invalid`.

Preveja antes de abrir a página: há dois campos obrigatórios e vazios, um estilizado com `:invalid` e outro com `:user-invalid`. Qual aparece vermelho ao carregar?

```html
<!-- fig10_03.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>:invalid contra :user-invalid</title>
  <link rel="icon" href="data:,">
  <style>
    input { font: inherit; padding: 0.5rem; border: 3px solid #8a949e; }
    #old-field:invalid { border-color: #b3261e; }
    #new-field:user-invalid { border-color: #b3261e; }
    pre { background: #f4f6f8; padding: 0.75rem; overflow-wrap: anywhere; white-space: pre-wrap; }
  </style>
</head>
<body>
  <main>
    <h1>:invalid contra :user-invalid</h1>

    <form id="form">
      <p>
        <label for="old-field">Con :invalid (rojo desde que abres la página)</label><br>
        <input id="old-field" required>
      </p>
      <p>
        <label for="new-field">Con :user-invalid (rojo cuando la persona ya intervino)</label><br>
        <input id="new-field" required>
      </p>
      <button type="submit">Enviar</button>
    </form>

    <h2>Lo que el navegador sabe</h2>
    <pre id="report" role="status"></pre>
  </main>

  <script type="module">
    const form = document.getElementById("form");
    const newField = document.getElementById("new-field");
    const report = document.getElementById("report");

    function show() {
      report.textContent =
        `valueMissing: ${newField.validity.valueMissing}\n` +
        `:invalid: ${newField.matches(":invalid")}\n` +
        `:user-invalid: ${newField.matches(":user-invalid")}`;
    }

    form.addEventListener("submit", (event) => event.preventDefault());
    for (const type of ["input", "focusout", "invalid"]) {
      form.addEventListener(type, () => setTimeout(show), true);
    }
    show();
  </script>
</body>
</html>
```

Ao carregá-la, o relatório de baixo diz o que o navegador sabe do segundo campo:

```text
:invalid contra :user-invalid
Con :invalid (rojo desde que abres la página)
Con :user-invalid (rojo cuando la persona ya intervino)
Enviar
Lo que el navegador sabe
valueMissing: true
:invalid: true
:user-invalid: false
```

O primeiro campo já está vermelho e o segundo não, ainda que ambos estejam igualmente vazios. Isso torna visível a última linha: `:invalid` é verdadeiro e `:user-invalid` é falso. Agora faça isto, nesta ordem:

1. Clique no segundo campo, escreva uma letra, apague-a e pressione Tab. O relatório muda: `:user-invalid` passa a verdadeiro e o campo fica vermelho.
2. Recarregue e pressione “Enviar” sem tocar em nada: os dois aparecem vermelhos e o relatório também marca `:user-invalid` como verdadeiro.

Aqui vai uma diferença entre navegadores que merece ser dita porque pode confundi-lo ao comparar. Se você clica em um campo vazio e sai dele **sem escrever nada**, o Chrome 154 deixa `:user-invalid` em falso, mas o Firefox 155 o põe em verdadeiro. As duas coisas foram comprovadas ao preparar esta lição; no Safari não foi testado. A especificação deixa margem no que conta como “interveio”, e a consequência prática é uma regra de design: **não dependa de `:user-invalid` para os campos que a pessoa pulou**. Para esses, o momento seguro é o envio, que em todos os navegadores marca tudo.

O estilo do painel usa as duas coisas ao mesmo tempo, e é o que você verá em `css/styles.css`: `.field :user-invalid, .field [aria-invalid="true"] { … }`. A primeira parte pinta o que o navegador decide marcar; a segunda o que o nosso código marca. Não é redundância, é cobertura: por qualquer dos dois caminhos o campo se vê em erro.

E um lembrete de acessibilidade que acompanha a cor: **vermelho não é uma mensagem**. Um campo com borda vermelha e nada mais é invisível para quem não distingue o vermelho e mudo para quem usa um leitor de tela. A cor acompanha; o texto informa. É isso que vem a seguir.

### 10.4 O erro escrito onde se lê

A bolha do navegador cumpre uma função, mas tem quatro limites que importam. Desaparece em poucos segundos, de modo que quem precisa de mais tempo para ler já não a tem. Não pode ser estilizada. Aparece no idioma do navegador e com as palavras do fabricante (ao preparar esta lição, o Chrome em espanhol disse “Ingresa texto después del signo "@". La dirección "dorian@" está incompleta.”; em outro navegador ou idioma seria outra frase). E com um leitor de tela, o seu anúncio depende de cada combinação de navegador e leitor. As diretrizes de acessibilidade o advertem no documento que explica o critério [3.3.1, Identificação de erros](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html) (nível A): o erro deve ser identificado e descrito **em texto**, e esse mesmo documento recomenda não depender apenas da validação nativa pelos seus limites com a ampliação de tela, a permanência da mensagem e os erros múltiplos.

A solução cabe em quatro peças, e você as verá juntas em uma página mínima antes de usá-las no painel.

**Primeira peça: a mensagem é um parágrafo da página**, que existe desde o início (vazio) e é preenchido quando há um erro. Vive junto ao campo e é escrito com `textContent`.

**Segunda peça: o campo aponta para a sua mensagem com `aria-describedby`.** Este atributo ([MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-describedby)) diz à tecnologia assistiva: “o texto desse elemento descreve este campo”. O rótulo (`<label>`) dá o *nome* do campo e é lido primeiro; a descrição é lida depois. Quando o foco cai no campo, o leitor diz algo como “Correo, caixa de edição, Escribe tu correo”. Aceita vários identificadores separados por espaço: no painel, cada campo aponta para a sua ajuda (“Al menos 2 caracteres”) e para o seu erro. Comprovou-se na árvore de acessibilidade do Chrome: a descrição do campo do nome saiu como “Al menos 2 caracteres. No puede repetirse. Escribe el nombre del servicio.”.

**Terceira peça: `aria-invalid="true"` marca o campo como inválido** ([MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-invalid)). Assim o leitor pode dizer “inválido” ao chegar. O MDN esclarece quando colocá-lo: *depois* de tentar enviar ou de validar, nunca desde que a página carrega em um campo vazio, porque seria o mesmo quadro vermelho de antes, mas falado.

**Quarta peça: o foco é levado ao primeiro campo com erro.** É o que o navegador fazia com a sua bolha, e ao desligá-la é preciso fazê-lo à mão. Quem navega com teclado cai exatamente onde deve corrigir, e quem usa leitor de tela ouve de imediato o nome, o erro e o estado. É também a maior ajuda para o critério de operar tudo com teclado ([2.1.1](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html), nível A).

Como se desliga a bolha sem desligar a validação? Com o evento **`invalid`**. Cada vez que o navegador verifica um campo e o encontra inválido, dispara `invalid` sobre ele ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event)), e se o seu código chama `preventDefault()`, o navegador não mostra a sua bolha. Dois cuidados: o evento **não sobe pela árvore** (não borbulha), então um ouvinte posto no `<form>` só o recebe se você o registrar na fase de captura (o terceiro argumento `true`); comprovou-se com um ouvinte normal no formulário e ele não recebeu nada. E como você cancelou o evento, o navegador tampouco move o foco: você o faz.

Preveja o que esta página fará com o campo vazio e com `dorian` (sem arroba):

```html
<!-- fig10_04.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Un campo, un error que se lee</title>
  <link rel="icon" href="data:,">
  <style>
    input { font: inherit; padding: 0.5rem; border: 2px solid #8a949e; }
    [aria-invalid="true"] { border-color: #b3261e; }
    .error { color: #b3261e; font-weight: 600; min-height: 1.5rem; margin: 0.25rem 0; }
  </style>
</head>
<body>
  <main>
    <h1>Un campo, un error que se lee</h1>

    <form id="form">
      <p>
        <label for="email">Correo *</label><br>
        <input id="email" name="email" type="email" required autocomplete="email"
               aria-describedby="email-error">
      </p>
      <p id="email-error" class="error"></p>
      <button type="submit">Pedir aviso</button>
    </form>
    <p id="result" role="status"></p>
  </main>

  <script type="module">
    const form = document.getElementById("form");
    const email = document.getElementById("email");
    const error = document.getElementById("email-error");
    const result = document.getElementById("result");

    function message() {
      if (email.validity.valueMissing) return "Escribe tu correo.";
      if (email.validity.typeMismatch) return "Falta algo: un correo se ve así, nombre@dominio.mx.";
      return "";
    }

    email.addEventListener("invalid", (event) => {
      event.preventDefault();
      error.textContent = message();
      email.setAttribute("aria-invalid", "true");
      email.focus();
    });

    email.addEventListener("input", () => {
      if (!email.hasAttribute("aria-invalid")) {
        return;
      }
      error.textContent = message();
      if (email.validity.valid) {
        email.removeAttribute("aria-invalid");
      }
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      result.textContent = `Aviso pedido para ${email.value}.`;
    });
  </script>
</body>
</html>
```

Ao carregá-la mostra apenas o formulário:

```text
Un campo, un error que se lee
Correo *
Pedir aviso
```

Pressione o botão com o campo vazio: aparece “Escribe tu correo.”, o campo fica vermelho e o foco cai nele. Escreva `dorian` e, enquanto digita, a mensagem é atualizada para “Falta algo: un correo se ve así, nombre@dominio.mx.”; quando o valor se torna válido, a mensagem e a marca desaparecem. Observe três decisões do código. A mensagem depende da bandeira (`valueMissing` ou `typeMismatch`), não do texto do navegador, e por isso está no seu idioma e com a sua voz. A atualização enquanto se escreve só ocorre se o campo já estava marcado, para não repreender quem ainda não terminou. E a mensagem diz **o que fazer**, não só o que está errado: [3.3.3, Sugestão diante de erros](https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html), quando a sugestão é conhecida.

### Os avisos de estado: `role="status"` e `role="alert"`

Falta uma peça: as mensagens que não pertencem a um campo. “Serviço incluído”, “há 3 campos com erro”, “mostrando 2 de 5 serviços”. Quem vê a tela as vê; quem usa um leitor de tela precisa que sejam anunciadas **sem mover o foco**. É isso que o critério [4.1.3, Mensagens de status](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) (nível AA) pede. Resolve-se com uma *região dinâmica*: um elemento cujo conteúdo, quando muda, o leitor lê sem que ninguém o visite.

Há duas, e a diferença é a urgência. Com **`role="status"`** ([MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/status_role)) o aviso é cortês: o leitor espera terminar de ler o que estava lendo. Com **`role="alert"`** ([MDN](https://developer.mozilla.org/pt-BR/docs/Web/Accessibility/ARIA/Reference/Roles/alert_role)) ele interrompe. O MDN pede para usar o segundo com cuidado, porque interromper é um incômodo reservado ao que não pode esperar (uma falha de conexão, não “5 resultados”). No painel, `#notice` (carregando ou vazio), `#count` e `#form-result` são `status`, e `#error-notice` (o serviço não pôde ser carregado) é `alert`.

E a regra que mais se quebra, que o MDN coloca em primeiro lugar: **o contêiner tem de existir na página antes de o seu conteúdo mudar**. Se você cria o parágrafo com o seu texto ao mesmo tempo, muitos leitores não o anunciam, porque o que observam é uma *mudança* dentro de uma região já conhecida. Por isso os três elementos estão no HTML, vazios, desde o início, e por isso a folha de estilo nunca os desliga com `display: none` enquanto estão vazios: isso os tiraria da árvore de acessibilidade, como foi medido na lição 9.

Um limite que se diz de frente: o que se pôde comprovar ao preparar esta lição é o estado que o navegador entrega à tecnologia assistiva (a árvore de acessibilidade com as descrições e o estado `invalid`, e que as regiões dinâmicas mudam de texto no momento correto). O que não se fez foi ouvir a saída de um leitor de tela real. Quando você terminar a lição, faça esse teste você mesmo com o leitor que o seu sistema traz; é o único que conta.

### 10.5 No painel: incluir e filtrar

Agora tudo junto. O painel ganha duas coisas: que o buscador e os rádios da lição 2 filtrem a tabela, e o formulário para incluir um serviço. Comecemos pelas decisões, antes do código.

**Os controles já estavam lá.** O campo “Buscar servicio” e o grupo “Mostrar”, com os seus rádios Todos, Disponibles e Caídos, estão na página desde a lição 2, com os seus rótulos e o seu `<fieldset>`. Não é preciso inventar um buscador: basta escutá-los. É o ganho de ter escrito o HTML pelo que significa desde o início.

**O filtro é uma função pura.** `filterServices(services, filter)` recebe o array e as condições, e devolve o array filtrado, sem tocar na página. É o mesmo estilo de `js/stats.js`, e por isso pode ser testado sem tela, como você fez com o estado na lição 7. Normaliza o texto antes de comparar (tira acentos e maiúsculas) para que `catalo` encontre `Catálogo`: `normalize("NFD")` ([MDN](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)) separa cada letra do seu acento, e uma expressão regular apaga as marcas.

**O estado ganha um campo.** `state.filter` guarda o texto e o estado escolhido; `visible(state)` filtra primeiro e ordena depois. Não se filtra mexendo em linhas do DOM: filtra-se *desenhando de novo a partir dos dados*, como você aprendeu na lição 7.

**A contagem é anunciada com atraso.** A tabela é atualizada a cada tecla, mas o aviso “Mostrando 3 de 5 servicios.” espera 400 ms desde a última tecla. Sem essa espera, um leitor de tela anunciaria “Mostrando 4… Mostrando 3… Mostrando 1…” letra por letra, e o que devia ajudar atrapalha. É um `setTimeout` ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout)) que é cancelado e rearmado a cada tecla.

**O formulário aproveita o que já existe.** Os atributos fazem a validação; o programa só muda o lugar onde a mensagem é mostrada. O nome deve ser único: é uma regra que o navegador não conhece, então vai com `setCustomValidity` e a sua limpeza. O tempo de resposta é desativado se o serviço está fora do ar. Cada campo sempre reserva a linha da sua mensagem (`min-height`), para que a página não pule quando alguém erra; na lição 11 você verá que esses saltos são medidos.

**O formulário serve também com a lista vazia.** Com `?case=empty` o painel diz “No hay servicios que revisar.” e não há tabela. Ali o formulário continua visível: é a forma de cadastrar o primeiro. E também está “Reintentar”, que a lição 9 mostra com a lista vazia porque “Revisar ahora” vive na zona de dados, oculta nesse caso. Por isso a zona do formulário depende da fase (`"ready"`) e não de haver linhas.

**Depois de incluir, avisa-se e volta-se ao primeiro campo.** A mensagem diz quantos serviços há agora e, se o filtro atual oculta o novo, diz isso também: sem isso, quem filtra por “Caídos” e inclui um disponível veria que “não aconteceu nada”.

Os arquivos novos são `js/filters.js` e `js/form.js` (este traduz as bandeiras de `validity` em frases e lê o formulário). Mudam `js/state.js`, `js/view.js`, `js/main.js`, `index.html` e `css/styles.css`. Ficam como a lição 9 os deixou: `js/load.js`, `js/stats.js`, `data/services.json` e `data/services-empty.json`.

Você vai construí-lo em **sete passos**, das peças puras às que tocam a página. Cada passo tem a mesma forma: primeiro **o que o arquivo faz e por quê**, depois **o seu código**, e no final **como você verifica** que ficou bem antes de passar ao seguinte. A ordem não é caprichosa: até o passo 6 o painel continua funcionando exatamente como na lição 9, porque cada peça nova é acrescentada sem que ninguém a use ainda, e assim qualquer erro que apareça é do último passo que você deu. Só o passo 7 conecta tudo. As verificações com o console usam `await import("./js/archivo.js")`, que carrega um módulo a partir do console das ferramentas do navegador com o painel aberto e deixa você chamar as suas funções à mão.

#### Passo 1 — `js/filters.js`: que serviços passam no filtro

**O que faz e por quê.** Decide que serviços cumprem o texto buscado e o estado escolhido. É o arquivo mais curto da lição e o que mais convém entender, porque não sabe nada da página: recebe um array e devolve outro. Tem duas funções. `normalize(text)` deixa um texto pronto para comparar: `normalize("NFD")` separa cada letra do seu acento (o “á” vira “a” mais uma marca de acento), e depois `.replace(/\p{Diacritic}/gu, "")` apaga as marcas. Essa `/\p{Diacritic}/gu` é uma expressão regular como as do parêntese de 10.1: `\p{Diacritic}` significa “qualquer caractere que o Unicode classifica como marca diacrítica”, isto é, os acentos e o trema; a bandeira `g` faz com que todas sejam apagadas e não só a primeira, e a `u` é a que permite escrever `\p{…}`. Depois, `toLowerCase()` passa tudo para minúsculas e `trim()` tira os espaços das pontas. A segunda função, `filterServices`, usa o `filter` da lição 6 com uma condição dupla: o nome normalizado **inclui** (`includes`) o texto buscado, e o estado é o escolhido ou se escolheu “Todos”.

```js
// panel/js/filters.js
// Decide qué servicios pasan el filtro. Son funciones puras: no tocan el documento.

// Quita acentos y mayúsculas para que "catalo" encuentre "Catálogo".
export function normalize(text) {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

// filter = { text: "", status: "all" | "available" | "down" }
export function filterServices(services, filter) {
  const wanted = normalize(filter.text);
  return services.filter((service) => {
    const nameMatches = normalize(service.name).includes(wanted);
    const statusMatches = filter.status === "all" || service.status === filter.status;
    return nameMatches && statusMatches;
  });
}
```

**Como você verifica.** Com o painel aberto (ainda se vê igual ao da lição 9), escreva no console `const f = await import("./js/filters.js")` e depois `f.normalize("  CATÁLOGO ")`. Deve responder `"catalogo"`: sem acento, sem maiúsculas e sem espaços. Foi assim que se comprovou no Chrome 154.

#### Passo 2 — `js/state.js`: o estado aprende a filtrar

**O que faz e por quê.** É o estado da lição 9 com um campo a mais e três funções novas. O novo é `filter`, `changeFilter`, `nameExists`, `addService` e que `visible` filtre antes de ordenar. Três ferramentas do JavaScript aparecem aqui pela primeira vez. [`Object.assign(destino, mudanças)`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) copia para `destino` cada propriedade de `mudanças` e deixa intactas as demais: se `state.filter` é `{ text: "cat", status: "all" }` e chega `{ status: "down" }`, o resultado é `{ text: "cat", status: "down" }`. Por isso `changeFilter` pode receber só o que mudou, venha do buscador ou dos rádios. `some`, da lição 6, responde se **pelo menos um** serviço cumpre a condição, que é justamente a pergunta “esse nome já existe?”. E `push` acrescenta um elemento ao final de um array; aqui o array é, sim, alterado, porque incluir um serviço é precisamente alterar a lista.

```js
// panel/js/state.js
// El estado del panel y las únicas formas de cambiarlo.
// No toca el documento: por eso se puede probar sin pantalla.
import { filterServices, normalize } from "./filters.js";

export function createState() {
  return {
    phase: "loading",       // "loading" | "error" | "ready"
    services: [],
    errorMessage: null,     // texto para la persona, solo en la fase "error"
    checkedAt: null,        // cuándo llegaron los datos por última vez (un Date), o null
    sortByTime: false,      // false = en el orden original; true = del más rápido al más lento
    selected: null,         // el id del servicio elegido, o null
    filter: { text: "", status: "all" },
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

// changes = { text } o { status }: solo se pisa lo que llega.
export function changeFilter(state, changes) {
  Object.assign(state.filter, changes);
}

export function nameExists(state, name) {
  const wanted = normalize(name);
  return state.services.some((service) => normalize(service.name) === wanted);
}

export function addService(state, service) {
  state.services.push(service);
}

// Lo que se debe mostrar, calculado a partir del estado cada vez: primero se filtra,
// luego se ordena. filter y toSorted devuelven copias: el arreglo de los datos no se toca.
export function visible(state) {
  const filtered = filterServices(state.services, state.filter);
  if (!state.sortByTime) {
    return filtered;
  }
  // Los que no tienen medida (null) van al final.
  return filtered.toSorted((a, b) => (a.responseMs ?? Infinity) - (b.responseMs ?? Infinity));
}

export function selectedService(state) {
  return state.services.find((service) => service.id === state.selected) ?? null;
}
```

**Como você verifica.** Recarregue o painel: deve se ver **igual ao da lição 9**, com cinco linhas e o resumo em 5, 4 de 5, 1 e 465 ms. Parece que não aconteceu nada, e é isso que se busca: o filtro começa em “Todos” e com o texto vazio, então deixa passar todos, e ninguém o altera ainda. Se você vê algo diferente, o erro está neste arquivo. A verificação de fundo é o passo 3.

#### Passo 3 — O teste sem tela

**O que faz e por quê.** Antes de tocar na página, um teste que não precisa de tela, como o da lição 7. Preveja quantas linhas dirão `ok`:

```html
<!-- panel/filters-test.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Prueba de los filtros (sin dibujar nada del panel)</title>
</head>
<body>
  <h1>Prueba de los filtros</h1>
  <pre id="output"></pre>
  <script type="module">
    import { normalize, filterServices } from "./js/filters.js";
    import { createState, loadSucceeded, changeFilter, nameExists, addService, toggleSort, visible } from "./js/state.js";

    const services = [
      { id: "catalog", name: "Catálogo", status: "available", responseMs: 120 },
      { id: "payments", name: "Pagos", status: "available", responseMs: 480 },
      { id: "inventory", name: "Inventario", status: "down", responseMs: null },
      { id: "notifications", name: "Notificaciones", status: "available", responseMs: 310 },
      { id: "search", name: "Búsqueda", status: "available", responseMs: 950 },
    ];

    const lines = [];
    function check(description, condition) {
      lines.push(`${condition ? "ok    " : "FALLA "} ${description}`);
    }
    const names = (list) => list.map((service) => service.name).join(", ");
    const all = (text) => ({ text, status: "all" });

    check("normalize quita acentos y mayúsculas", normalize("  CATÁLOGO ") === "catalogo");
    check("sin filtro pasan todos", filterServices(services, all("")).length === 5);
    check("«catalo» encuentra Catálogo", names(filterServices(services, all("catalo"))) === "Catálogo");
    check("«BUSQUEDA» encuentra Búsqueda: ni la «ú» ni las mayúsculas importan", names(filterServices(services, all("BUSQUEDA"))) === "Búsqueda");
    check("el estado «down» deja solo Inventario", names(filterServices(services, { text: "", status: "down" })) === "Inventario");
    check("texto y estado se combinan: «o» y «available» deja tres", names(filterServices(services, { text: "o", status: "available" })) === "Catálogo, Pagos, Notificaciones");
    check("filtrar no cambia el arreglo original", services.length === 5);

    const state = createState();
    loadSucceeded(state, services, new Date());
    check("nameExists ignora mayúsculas y acentos", nameExists(state, "catalogo") === true);
    check("nameExists dice que no a un nombre nuevo", nameExists(state, "Facturas") === false);

    changeFilter(state, { status: "down" });
    addService(state, { id: "billing", name: "Facturas", status: "available", responseMs: 230 });
    check("un servicio nuevo que no cumple el filtro se agrega pero no se ve", state.services.length === 6 && names(visible(state)) === "Inventario");

    changeFilter(state, { text: "o", status: "all" });
    toggleSort(state);
    check("el orden se aplica después del filtro: con «o», del más rápido al más lento", names(visible(state)) === "Catálogo, Notificaciones, Pagos, Inventario");

    document.querySelector("#output").textContent = lines.join("\n");
  </script>
</body>
</html>
```

Abra-a em `…/10-formularios-validacion/panel/filters-test.html` e compare com o que você previu:

```text
Prueba de los filtros
ok     normalize quita acentos y mayúsculas
ok     sin filtro pasan todos
ok     «catalo» encuentra Catálogo
ok     «BUSQUEDA» encuentra Búsqueda: ni la «ú» ni las mayúsculas importan
ok     el estado «down» deja solo Inventario
ok     texto y estado se combinan: «o» y «available» deja tres
ok     filtrar no cambia el arreglo original
ok     nameExists ignora mayúsculas y acentos
ok     nameExists dice que no a un nombre nuevo
ok     un servicio nuevo que no cumple el filtro se agrega pero no se ve
ok     el orden se aplica después del filtro: con «o», del más rápido al más lento
```

Repare na verificação da combinação: com “o” só passariam quatro (também Inventario) e com “available” sozinho, outros quatro (também Búsqueda); os três que saem provam que as duas condições são aplicadas ao mesmo tempo. Um teste cujo resultado seria o mesmo com uma só condição não provaria a combinação.

#### Passo 4 — `index.html`: os controles que faltavam

**O que faz e por quê.** Em relação à lição 9 mudam poucas coisas: o `<fieldset>` dos rádios ganha um `id` para ser escutado; aparecem o aviso da contagem, `#count`, e um `id` na caixa da tabela, `#table-zone`, para ocultá-la quando nenhum serviço passa no filtro; a seção de serviços ganha a classe `layout-tall`, que é explicada com os estilos; e no final de `<main>` chega a seção nova, “Agregar un servicio” (“Incluir um serviço”). Repare na relação de cada campo com a sua ajuda e o seu erro por `aria-describedby`, nos elementos com `role="status"` (que existem vazios desde o início), e em que a zona do formulário começa oculta:

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

    <section id="services" class="layout-tall">
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

          <fieldset id="status-filter">
            <legend>Mostrar</legend>
            <label><input type="radio" name="filter" value="all" checked> Todos</label>
            <label><input type="radio" name="filter" value="available"> Disponibles</label>
            <label><input type="radio" name="filter" value="down"> Caídos</label>
          </fieldset>

          <p><button type="button" id="check-now">Revisar ahora</button></p>
          <p><button type="button" id="sort" aria-pressed="false">Ordenar por tiempo de respuesta</button></p>
        </div>

        <p id="count" class="notice" role="status"></p>

        <div class="table-scroll" id="table-zone" role="region" aria-labelledby="table-caption" tabindex="0">
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

    <section id="add-zone" aria-labelledby="add-title" hidden>
      <h2 id="add-title">Agregar un servicio</h2>
      <p>Los campos marcados con * son obligatorios.</p>

      <form id="add-form" class="form-grid" autocomplete="off">
        <div class="field">
          <label for="new-name">Nombre *</label>
          <input id="new-name" name="name" type="text" required minlength="2"
                 pattern="\S(.*\S)?" aria-describedby="new-name-hint new-name-error">
          <p id="new-name-hint" class="hint">Al menos 2 caracteres. No puede repetirse.</p>
          <p id="new-name-error" class="field-error"></p>
        </div>

        <div class="field">
          <label for="new-status">Estado *</label>
          <select id="new-status" name="status" required aria-describedby="new-status-error">
            <option value="">Elige un estado</option>
            <option value="available">Disponible</option>
            <option value="down">Caído</option>
          </select>
          <p id="new-status-error" class="field-error"></p>
        </div>

        <div class="field">
          <label for="new-response-ms">Tiempo de respuesta (ms) *</label>
          <input id="new-response-ms" name="responseMs" type="number" required min="0" max="60000" step="1"
                 aria-describedby="new-response-ms-hint new-response-ms-error">
          <p id="new-response-ms-hint" class="hint">De 0 a 60 000. Si el servicio está caído, no se pide.</p>
          <p id="new-response-ms-error" class="field-error"></p>
        </div>

        <button type="submit">Agregar servicio</button>
        <p id="form-result" class="notice" role="status"></p>
      </form>
    </section>
  </main>

  <footer>
    <p>Datos de ejemplo del archivo data/services.json.</p>
  </footer>
</body>
</html>
```

**Como você verifica.** Recarregue: o painel continua mostrando o mesmo, e o formulário novo **não aparece**. Está correto: a seção começa com `hidden`, e a view da lição 9 não sabe que ela existe, então ninguém a mostra. No console, `document.querySelector("#add-zone").hidden` deve devolver `true`.

#### Passo 5 — `css/styles.css`: o formulário e o seu layout

**O que faz e por quê.** Um bloco a mais no final de `css/styles.css`, que reabre mais uma vez a camada `components`. Três coisas merecem ser olhadas. A primeira é a regra de `.layout-tall`: em uma tela larga, a grade de duas colunas da lição 5 poria a seção nova na linha seguinte, embaixo da tabela, com um vazio enorme ao lado dela; se a seção de serviços ocupa duas linhas (`grid-row: span 2`), o formulário sobe para a coluna esquerda, logo embaixo do resumo. A segunda é o seletor de erro, `.field :user-invalid, .field [aria-invalid="true"]`: leva `.field` na frente porque, sem ele, pesaria menos que `.field input`, a regra que dá a borda a todos os campos, e perderia. É a especificidade da lição 3 fazendo o seu trabalho, e a saída é escrever o seletor que corresponde, não um `!important`. A terceira é a linha reservada para o erro. E algo que não está: nenhuma regra para que a tabela caiba a 320 px. Não é preciso, porque a tabela rola dentro da sua caixa desde a lição 5; a medição a 320 px dá 320 nos sete passos do percurso com que se fecha o passo 7.

```css
@layer components {
  /* ---- Lección 10: el formulario para agregar un servicio ---- */
  /* En una pantalla ancha, la sección de servicios ocupa los dos renglones de la derecha
     y el formulario sube a la columna izquierda, justo debajo del resumen. */
  @media (width >= 64em) {
    .layout-tall {
      grid-row: span 2;
    }
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(14rem, 100%), 1fr));
    gap: var(--space-3);
    align-items: start;
  }

  /* El botón y el aviso del formulario van en su propio renglón. */
  .form-grid > button,
  .form-grid > .notice {
    grid-column: 1 / -1;
    justify-self: start;
  }

  select {
    font: inherit;
  }

  /* Los campos del formulario se ven como el de búsqueda de la Lección 3. */
  .field input,
  .field select {
    min-height: 2.5rem;
    padding: var(--space-1) var(--space-2);
    border: 1px solid var(--color-control);
    border-radius: var(--radius);
    background: var(--color-surface);
    color: inherit;
  }

  .field input:disabled {
    background: var(--color-page);
  }

  .hint {
    margin: 0;
    color: var(--color-muted);
    font-size: 0.875rem;
  }

  /* Cada campo reserva siempre la línea de su error: si el mensaje apareciera empujando
     todo lo de abajo, la página daría un salto cada vez que alguien se equivoca
     (y los saltos se miden: Lección 11). */
  .field-error {
    min-height: 1.5rem;
    margin: 0;
    color: var(--color-down-text);
    font-weight: 600;
  }

  /* El error se ve cuando el navegador sabe que la persona intervino (:user-invalid)
     o cuando nuestro código lo marcó (aria-invalid). Con .field delante, el selector
     pesa más que «.field input» y gana sin !important. */
  .field :user-invalid,
  .field [aria-invalid="true"] {
    border-color: var(--color-down-text);
    background: var(--color-down-bg);
  }
}
```

**Como você verifica.** Com a janela com mais de 1024 px de largura (64em), escreva no console `getComputedStyle(document.querySelector("#services")).gridRowStart`. Deve responder `"span 2"`; em uma janela mais estreita, `"auto"`, porque a regra vive dentro do `@media`.

#### Passo 6 — `js/form.js`: de bandeiras a frases

**O que faz e por quê.** Traduz as bandeiras de `validity` em frases. Cada campo tem a sua tabela de mensagens. A busca percorre as bandeiras na ordem em que estão escritas (por isso, com `-5`, sai “No puede ser negativo.” e não a mensagem da grade), e se não há frase própria usa o texto do navegador como último recurso. `readService` monta o serviço a partir do formulário com as mesmas chaves de `data/services.json`, e dá a ele um `id` novo com [`crypto.randomUUID()`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID), que gera um identificador que não se repete: o `id` da lição 6 é o que identifica um serviço, e um que nasce no formulário também precisa do seu. (Essa função só existe em páginas seguras: servidas por `https`, ou a partir da sua própria máquina, como `127.0.0.1`.) Duas peças de escrita que você já conhece: o laço `for (const flag in forControl)` percorre os nomes das propriedades da tabela de mensagens, como o `for…in` da figura 10.2, e `MESSAGES[control.id] ?? {}` usa a coalescência nula da lição 6 para que um campo sem tabela própria receba um objeto vazio em vez de `undefined`.

```js
// panel/js/form.js
// Traduce lo que el navegador sabe de un campo a una frase para la persona, y lee el
// formulario. No dibuja nada: recibe un control y devuelve texto.

// Para cada campo, qué decir según la regla que incumple (las banderas de `validity`).
const MESSAGES = {
  "new-name": {
    valueMissing: "Escribe el nombre del servicio.",
    tooShort: "Usa al menos 2 caracteres.",
    patternMismatch: "Sin espacios al inicio ni al final.",
  },
  "new-status": {
    valueMissing: "Elige el estado del servicio.",
  },
  "new-response-ms": {
    valueMissing: "Escribe el tiempo en milisegundos.",
    badInput: "Escribe un número, como 250.",
    rangeUnderflow: "No puede ser negativo.",
    rangeOverflow: "El máximo es 60 000 ms.",
    stepMismatch: "Escribe un número entero.",
  },
};

// Devuelve el texto del error de un control, o "" si el control es válido.
// El orden de las banderas en MESSAGES es el orden de prioridad: varias pueden
// estar encendidas a la vez y se dice una sola, la primera.
export function errorMessage(control) {
  if (!control.willValidate || control.validity.valid) {
    return "";
  }
  if (control.validity.customError) {
    return control.validationMessage; // el texto que puso setCustomValidity
  }
  const forControl = MESSAGES[control.id] ?? {};
  for (const flag in forControl) {
    if (control.validity[flag]) {
      return forControl[flag];
    }
  }
  return control.validationMessage; // último recurso: el texto del navegador
}

// Lee un formulario ya validado y arma el servicio con las mismas claves que data/services.json.
// Un campo desactivado no viaja en FormData: un servicio caído queda con responseMs en null.
export function readService(form) {
  const data = new FormData(form);
  const time = data.get("responseMs");
  return {
    id: crypto.randomUUID(), // un identificador nuevo, que no choca con ninguno
    name: data.get("name").trim(),
    status: data.get("status"),
    responseMs: time === null ? null : Number(time),
  };
}
```

**Como você verifica.** Agora que o HTML do passo 4 já tem os campos, escreva no console `const form = await import("./js/form.js")` e depois `form.errorMessage(document.querySelector("#new-name"))`. Deve responder `"Escribe el nombre del servicio."`: o campo está vazio, é `required`, e a função traduziu a bandeira `valueMissing` na frase da sua tabela. Que a seção esteja oculta não muda nada, porque `hidden` não tira um campo da validação; `disabled`, sim.

#### Passo 7 — `js/view.js` e `js/main.js`, juntos

**O que faz e por quê.** É o passo que conecta tudo, e por isso são dois arquivos que vão juntos. Na view, `renderCount` é nova e é exportada à parte para que `main.js` possa atrasá-la; `render` também decide quando se vê a zona do formulário e quando a tabela (sem linhas, ela é ocultada).

E `js/main.js` cresce com dois blocos no final, os filtros e o formulário. Antes de lê-lo, estas são as decisões que você vai encontrar nele, cada uma com a sua razão:

- O ouvinte dos rádios está no `<fieldset>` e não em cada rádio: o evento `change` sobe pela árvore, como o `click` da lição 7, então um só atende aos três.
- No ouvinte de `invalid`, a condição `event.target === form.querySelector(":invalid")` é verdadeira só para o primeiro campo inválido na ordem do documento. Por isso o foco e o aviso geral ocorrem uma vez, ainda que o navegador dispare o evento três vezes.
- No ouvinte de `input`, a primeira linha esvazia o aviso do formulário: se uma pessoa corrige e segue escrevendo, “No se agregó: hay 3 campos con error” já não é verdade e não deve ficar.
- No ouvinte de `focusout`, a condição olha `:user-invalid` ou a marca própria. É o momento de mostrar o erro de um campo que a pessoa edita e abandona. Usa `focusout` e não `blur` porque `focusout` sobe pela árvore ([MDN](https://developer.mozilla.org/pt-BR/docs/Web/API/Element/focusout_event)), e um só ouvinte no formulário atende aos três campos.
- No de `submit`, `FormData` ([MDN](https://developer.mozilla.org/pt-BR/docs/Web/API/FormData)) lê o formulário pelo atributo `name` de cada campo, e os campos desativados não entram. Por isso um serviço fora do ar não traz `responseMs` e `readService` guarda `null`, que é o que `js/stats.js` e a tabela já entendem.

Um aviso sobre a ordem: **não recarregue entre os dois arquivos**. A view nova espera elementos (`addZone`, `tableZone`, `count`) que só o `main.js` novo lhe entrega. Se você salva `view.js`, recarrega e ainda tem o `main.js` da lição 9, a tabela fica vazia e o console do Chrome diz `Cannot set properties of undefined (setting 'hidden')`: a view tentou ocultar uma zona que ninguém lhe passou. Comprovou-se assim ao preparar a lição; se acontecer com você, não é um erro da sua view: falta o arquivo seguinte.

Primeiro a view:

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

// El aviso de cuántos servicios se ven. Vive aparte porque a veces se anuncia con retraso (ver main.js).
export function renderCount(state, elements) {
  const total = state.services.length;
  const shown = visible(state).length;
  elements.count.textContent = shown === 0
    ? "Ningún servicio coincide con el filtro."
    : `Mostrando ${shown} de ${total} ${total === 1 ? "servicio" : "servicios"}.`;
}

// elements = { notice, errorNotice, retry, dataZone, addZone, tableZone, count, checkedAt,
//              total, available, down, average, body, detail, sortButton }
// options.count = false deja el aviso del conteo como estaba (main.js lo actualiza después).
export function render(state, elements, options = {}) {
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
  // El formulario también sirve cuando la lista llegó vacía: ahí se da de alta el primero.
  elements.addZone.hidden = state.phase !== "ready";
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
  elements.tableZone.hidden = rows.length === 0;
  if (options.count !== false) {
    renderCount(state, elements);
  }

  const chosen = selectedService(state);
  elements.detail.textContent = chosen === null ? "Elige un servicio para ver su detalle." : describe(chosen);
}
```

Depois a lógica. Leia `js/main.js` de cima para baixo: primeiro o que você já tinha (carga, ordem, seleção) e depois os filtros e o formulário, com um comentário que explica o porquê de cada bloco:

```js
// panel/js/main.js
// Junta las piezas: pide los datos, guarda el resultado en el estado y dibuja.
import { loadServices } from "./load.js";
import {
  createState, startLoading, loadSucceeded, loadFailed, toggleSort, select,
  changeFilter, nameExists, addService, visible, situation,
} from "./state.js";
import { render, renderCount } from "./view.js";
import { errorMessage, readService } from "./form.js";

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
  addZone: document.querySelector("#add-zone"),
  tableZone: document.querySelector("#table-zone"),
  count: document.querySelector("#count"),
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

// ---- filtros ----
// La tabla se redibuja con cada tecla, pero el aviso del conteo espera a que la persona deje de
// escribir: un lector de pantalla no debe leer "Mostrando 4", "Mostrando 3", "Mostrando 1" letra por letra.
let timer;
function announceCountLater() {
  clearTimeout(timer);
  timer = setTimeout(() => renderCount(state, elements), 400);
}

document.querySelector("#search").addEventListener("input", (event) => {
  changeFilter(state, { text: event.target.value });
  render(state, elements, { count: false });
  announceCountLater();
});

// Un solo oyente para los tres radios: el evento change sube hasta el <fieldset>.
document.querySelector("#status-filter").addEventListener("change", (event) => {
  changeFilter(state, { status: event.target.value });
  render(state, elements);
});

// ---- formulario: agregar un servicio ----
const form = document.querySelector("#add-form");
const nameField = document.querySelector("#new-name");
const statusField = document.querySelector("#new-status");
const timeField = document.querySelector("#new-response-ms");
const formResult = document.querySelector("#form-result");

// Escribe (o borra) el texto del error de un campo y marca el campo para los lectores de pantalla.
function paint(control) {
  const text = errorMessage(control);
  document.querySelector(`#${control.id}-error`).textContent = text;
  if (text === "") {
    control.removeAttribute("aria-invalid");
  } else {
    control.setAttribute("aria-invalid", "true");
  }
}

// Un servicio caído no tiene tiempo de respuesta: se desactiva el campo (y deja de validarse).
function syncTime() {
  const down = statusField.value === "down";
  timeField.disabled = down;
  if (down) {
    timeField.value = "";
    paint(timeField);
  }
}

// La regla que el navegador no conoce: el nombre no puede repetirse. SIEMPRE con su rama que limpia.
function validateUniqueName() {
  nameField.setCustomValidity(
    nameExists(state, nameField.value) ? "Ya existe un servicio con ese nombre." : "",
  );
}

// El navegador dispara "invalid" en cada campo inválido cuando se intenta enviar. Cancelarlo apaga su
// burbuja; en su lugar escribimos el mensaje en la página, donde se queda y un lector de pantalla lo lee.
// "invalid" no sube por el árbol: por eso se escucha en la fase de captura (el tercer argumento).
form.addEventListener("invalid", (event) => {
  event.preventDefault();
  paint(event.target);
  if (event.target === form.querySelector(":invalid")) {
    const howMany = form.querySelectorAll(":invalid").length;
    formResult.textContent = howMany === 1
      ? "No se agregó: hay 1 campo con error."
      : `No se agregó: hay ${howMany} campos con error.`;
    event.target.focus();
  }
}, true);

form.addEventListener("input", (event) => {
  const control = event.target;
  formResult.textContent = "";
  if (control === nameField) validateUniqueName();
  if (control === statusField) syncTime();
  if (control.getAttribute("aria-invalid") === "true") paint(control);
});

form.addEventListener("focusout", (event) => {
  const control = event.target;
  if (control.matches(":user-invalid") || control.hasAttribute("aria-invalid")) paint(control);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const service = readService(form);
  addService(state, service);
  form.reset();
  syncTime();
  render(state, elements);
  const hidden = visible(state).includes(service) ? "" : " El filtro actual lo oculta.";
  formResult.textContent =
    `Servicio «${service.name}» agregado. Ahora hay ${state.services.length}.${hidden}`;
  nameField.focus();
});

load();
```

**Como você verifica.** Teste agora o painel, com o servidor ligado a partir da pasta `programas/` do repositório, em `http://127.0.0.1:8000/10-formularios-validacion/panel/`. Estes passos foram comprovados no Chrome 154 com a janela a 320 px de largura:

1. Escreva `catalo` em “Buscar servicio”: fica uma linha e, meio segundo depois, o aviso diz “Mostrando 1 de 5 servicios.”.
2. Marque “Caídos” no grupo “Mostrar” sem apagar o texto: nenhuma linha coincide, a tabela é ocultada e o aviso diz “Ningún servicio coincide con el filtro.”. Apague o texto e fica só `Inventario`.
3. Marque “Todos” de novo e pressione “Agregar servicio” com tudo vazio: o foco cai em “Nombre”, aparecem três mensagens vermelhas e o aviso diz “No se agregó: hay 3 campos con error.”.
4. Escreva `catalogo`, escolha “Disponible” e escreva `100`: ao pressionar “Agregar servicio”, o nome diz “Ya existe un servicio con ese nombre.” (nem as maiúsculas nem o acento importam).
5. Mude o nome para `facturas` e o tempo para `-5`: a mensagem diz “No puede ser negativo.”. Corrija para `230`: a mensagem desaparece ao digitar e, ao enviar, o aviso diz “Servicio «facturas» agregado. Ahora hay 6.”. O resumo passa a 6 serviços verificados, 5 de 6 disponíveis, 1 fora do ar e 418 ms de resposta média.
6. Escolha “Caído” como estado: o campo do tempo é desativado e esvaziado. Escreva um nome novo e envie: o serviço é incluído sem tempo, e na tabela aparece “sin respuesta”.
7. Abra `?case=empty`: aparecem “No hay servicios que revisar.”, “Reintentar” e o formulário. Inclua um serviço: a tabela aparece com uma linha e “Reintentar” é ocultado, porque “Revisar ahora” volta a estar à vista.

O console, durante todo o percurso, fica em branco.

## O erro que você vai ver

A mensagem é do console e aparece quando você envia um formulário em que há um campo obrigatório que a pessoa não pode ver. A página o provoca de propósito: o segundo campo é `required` mas está oculto com `display: none`.

```html
<!-- fig10_05.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Un campo obligatorio que no se puede ver</title>
  <link rel="icon" href="data:,">
</head>
<body>
  <main>
    <h1>Un campo obligatorio que no se puede ver</h1>

    <form id="form">
      <p>
        <label for="email">Correo *</label>
        <input id="email" name="email" type="email" required>
      </p>
      <p>
        <label for="note">Nota *</label>
        <input id="note" name="note" type="text" required style="display: none">
      </p>
      <button type="submit">Enviar</button>
    </form>
  </main>
</body>
</html>
```

Abra-a, escreva um e-mail válido e pressione “Enviar”. Não acontece nada visível: o formulário não é enviado e não há bolha. No console aparece:

```text
An invalid form control with name='note' is not focusable.
```

O navegador tentou fazer o de sempre: encontrar o primeiro campo inválido e enviar o foco para ele para mostrar a mensagem. Mas um campo oculto não pode receber foco, então não há onde mostrá-la, e o envio fica bloqueado sem que a pessoa saiba por quê. O texto da mensagem é do navegador (Chrome 154; em outro navegador a frase muda) e na sua forma `name='note'` leva o atributo `name` do campo culpado, o que lhe diz qual procurar.

Há três consertos, em ordem de preferência. Se o campo não é necessário, tire o `required` enquanto estiver oculto. Se é preciso que exista mas não se veja, desative-o com `disabled` (fica fora da validação, como você viu com o tempo do painel). E se deve se ver assim que é ativado, mostre-o antes de tentar enviar. O que não se conserta é silenciar a mensagem: é o sintoma de que alguém deixou uma armadilha no formulário.

## O que se faz errado

**Tratar a validação do cliente como proteção.** *Como se vê:* “o formulário já valida o e-mail, então está pronto”. *Custo:* qualquer um a contorna com dois cliques nas ferramentas do navegador ou enviando a requisição sem navegador. Se o seu painel tem um servidor, a regra se repete ali; se não tem, o dado não deve ser perigoso por si mesmo, e por isso o painel o desenha com `textContent`.

**Pintar `:invalid` desde o início.** *Como se vê:* o formulário abre em vermelho. *Custo:* quem chega se sente repreendido antes de começar, e quem usa um leitor de tela ouve uma lista de erros em campos que nem viu. Use `:user-invalid` ou a marca própria depois da primeira tentativa.

**Pôr uma mensagem em `setCustomValidity` e não limpá-la.** *Como se vê:* um campo que “parece bem” e não deixa enviar. *Custo:* é o erro mais difícil de depurar da lição, porque não há nenhuma mensagem de erro do programa. Cada ramo que põe uma mensagem precisa do seu ramo que a tira; o painel faz isso em uma linha com um condicional.

**Um `pattern` com sintaxe inválida.** *Como se vê:* `pattern="[\w-]+"` e a regra nunca é aplicada. *Custo:* o console do Chrome diz “Pattern attribute value [\w-]+ is not a valid regular expression”, mas o formulário não mostra nada, de modo que a regra desaparece em silêncio. Escape o hífen (`[\w\-]+`) e, sobretudo, teste com um valor que deveria falhar.

**O erro só em cor, só na bolha ou só no `placeholder`.** *Como se vê:* um campo com borda vermelha e nada mais, ou uma dica dentro do campo em cinza claro que desaparece ao digitar. *Custo:* perde quem não distingue cores, quem usa um leitor de tela e quem precisa reler. O rótulo é um rótulo (`<label>`), o erro é texto, e os dois vivem fora do campo.

**Um `type="number"` para o que não é uma quantidade.** *Como se vê:* um campo de protocolo, de telefone ou de código postal com setas de subir e descer. *Custo:* o valor muda com a rodinha do mouse sem querer, perdem-se os zeros à esquerda, e o leitor de tela anuncia um botão para subir e descer (`spinbutton`) onde não há nenhuma quantidade para subir nem descer. Para esses dados, texto com `inputmode="numeric"`.

**Anunciar cada tecla.** *Como se vê:* o aviso do filtro muda a cada letra. *Custo:* o leitor de tela vira uma metralhadora e quem o usa se perde. Espere a pessoa terminar de escrever, como faz o painel com os seus 400 ms.

**Desativar o botão de enviar até que tudo seja válido.** *Como se vê:* um botão cinza sem explicação. *Custo:* quem não vê o botão desativado não sabe por que não avança, e não há nenhuma mensagem que o explique. Deixe o botão ativo e explique o que falta no momento da tentativa.

## Exercícios

### Exercício 1 — Prever as bandeiras

Sem abrir nada, escreva que bandeiras de `validity` se acendem em cada caso, e verifique depois com `fig10_02.html`: (a) campo vazio com `required`; (b) `250` em um campo com `min="0" max="60000" step="100"`; (c) `-100` nesse mesmo campo; (d) `60050` nesse mesmo campo.

### Exercício 2 — Uma regra própria no painel

Acrescente ao formulário do painel uma segunda regra para o nome: não pode ser `admin` nem `test` (não importam as maiúsculas). Deve usar `setCustomValidity`, limpar a mensagem quando o nome estiver correto e mostrar um texto próprio que diga o que fazer, não só o que está errado. Verifique que o campo volta a ser válido ao corrigi-lo.

### Exercício 3 — Limpar os filtros

Acrescente um botão “Limpiar filtros” (“Limpar filtros”) à barra de controles. Ao pressioná-lo deve: esvaziar o texto, marcar “Todos” de novo, desenhar a tabela de novo e devolver o foco ao campo de busca. Pense no que acontece com a região `role="status"` se o texto da contagem não muda.

## Soluções

**Exercício 1.** (a) `valueMissing`. (b) `stepMismatch`: 250 está dentro da faixa mas não é múltiplo de 100 contando a partir de 0. (c) `rangeUnderflow`; além disso, `-100` é, sim, múltiplo de 100, então `stepMismatch` **não** se acende. (d) `rangeOverflow` e `stepMismatch`, porque 60050 também cai fora da grade. Se você errou em (c), a lição está em que `step` e `min` não são independentes: a grade é medida a partir de `min`, e um valor pode estar fora da faixa sem estar fora da grade.

**Exercício 2.** Mude `validateUniqueName` em `js/main.js` para que decida entre três casos e limpe no último:

```js
const RESERVED = ["admin", "test"];

function validateUniqueName() {
  const value = nameField.value.trim().toLowerCase();
  if (RESERVED.includes(value)) {
    nameField.setCustomValidity(`«${value}» está reservado. Elige un nombre que describa el servicio.`);
  } else if (nameExists(state, nameField.value)) {
    nameField.setCustomValidity("Ya existe un servicio con ese nombre.");
  } else {
    nameField.setCustomValidity("");
  }
}
```

O ramo final é o que evita que o campo fique inválido para sempre. Como `errorMessage` já lê `validationMessage` quando há `customError`, não é preciso tocar em mais nada. Verifique o caso em que você escreve `admin`, envia (aparece a mensagem) e depois corrige para `admin2`: a mensagem desaparece ao digitar.

**Exercício 3.** Em `index.html`, dentro da barra de controles, junto a “Revisar ahora”, um `<p><button type="button" id="clear-filters">Limpiar filtros</button></p>`. Em `js/main.js`:

```js
document.querySelector("#clear-filters").addEventListener("click", () => {
  changeFilter(state, { text: "", status: "all" });
  document.querySelector("#search").value = "";
  document.querySelector('input[name="filter"][value="all"]').checked = true;
  render(state, elements);
  document.querySelector("#search").focus();
});
```

A contagem é desenhada de novo sozinha, porque `render()` chama `renderCount()`. Mas há uma armadilha: se o texto do aviso já era “Mostrando 5 de 5 servicios.”, o conteúdo não muda e os leitores de tela costumam não repeti-lo. É um bom caso de que *não anunciar* é correto: não há nada de novo a dizer (uma região dinâmica anuncia mudanças, não repetições). Se você quiser anunciar a ação em si, escreva “Filtros limpiados.” no aviso do formulário ou em uma região própria.

## Como sei que consegui

As verificações são mensuráveis. Ligue o servidor a partir da pasta `programas/` do repositório baixado e abra o painel:

```bash
cd programas
python3 -m http.server 8000 --bind 127.0.0.1
```

Abra `http://127.0.0.1:8000/10-formularios-validacion/panel/`.

- [ ] **Teclado:** só com Tab, Shift+Tab, Enter e as setas você chega à busca, aos rádios, a “Revisar ahora”, ao botão de ordenar, aos botões “Ver detalle”, aos três campos e ao botão de incluir; vê-se o contorno de foco em cada um; e você inclui um serviço sem tocar no mouse.
- [ ] **Console:** na aba Console não há nenhum erro nem aviso depois de recarregar e de percorrer os sete passos do percurso com que se fecha a seção 10.5.
- [ ] **320 px:** no modo de dispositivo das ferramentas, a 320 px de largura não aparece barra de rolagem horizontal. No console, `document.documentElement.scrollWidth <= document.documentElement.clientWidth` devolve `true`.
- [ ] **Os erros se leem:** com o formulário vazio, depois de pressionar “Agregar servicio”, `document.querySelector("#new-name").getAttribute("aria-invalid")` devolve `"true"` e `document.querySelector("#new-name-error").textContent` devolve uma frase.
- [ ] **O filtro:** com o texto `catalo`, `document.querySelectorAll("#services-body tr").length` devolve `1`.
- [ ] **O campo desativado fica fora:** com “Caído” escolhido, `document.querySelector("#new-response-ms").disabled` devolve `true`.
- [ ] **Sem tela:** `filters-test.html` mostra onze linhas e todas começam com `ok`.
- [ ] **Leitor de tela:** ative o que o seu sistema traz (no Linux Mint, o Orca) e repita o passo 3 da seção 10.5. Deve dizer o nome do campo, a sua descrição e que não é válido.
- [ ] **As figuras:** `fig10_05.html` deixa no console a mensagem de “An invalid form control… is not focusable”, e as demais não deixam nenhum erro.

E como encerramento, **três perguntas de lições anteriores**; responda sem olhar e depois verifique:

1. Na lição 2: que elemento de HTML dá nome a um campo, e por que um `placeholder` não o substitui?
2. Na lição 7: por que `js/view.js` usa `textContent` e não `innerHTML` ainda que os dados venham do seu próprio servidor?
3. Na lição 8: o que o `fetch` devolve diante de um 404, e o que é preciso verificar para não tratá-lo como dados?

Anote no diário de bordo o que você não conseguiu responder. Essa lista é a sua revisão de amanhã.

## Para ler mais

- [Validação de formulários no cliente, no MDN](https://developer.mozilla.org/pt-BR/docs/Learn_web_development/Extensions/Forms/Form_validation): o guia completo, com a API de validação e os exemplos de mensagens próprias.
- [3.3.1 Identificação de erros, nas diretrizes WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html): o que o critério exige e que técnicas o cumprem.
- [`:user-invalid`, no MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/:user-invalid): quando coincide e quando não.
- [Campos de texto, no sistema de design do governo britânico](https://design-system.service.gov.uk/components/text-input/): o guia mais cuidadoso sobre `type="number"`, `inputmode`, `autocomplete` e `maxlength`.
