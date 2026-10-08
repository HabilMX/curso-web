# Lição 11 — O painel terminado

**Tempo:** duas sessões de uns 90 min. Uma divisão que funciona: a primeira, “O porquê antes do como”, a revisão com o teclado (11.1), a política de segurança de conteúdo (11.2) e a medição de peso e desempenho (11.3), com o painel aberto e as ferramentas do navegador à mão; a segunda, publicar o site (11.4), os cinco critérios um por um sobre o endereço publicado (11.5) e os exercícios. Se publicar levar mais do que o previsto, a sessão dois é a que se alonga: a conta e os passos do serviço que você escolher não dependem de você.

**O que você constrói:** o `revisor` publicado como site estático, com os seus cabeçalhos de segurança e os seus números medidos

**O que você aprende:** a revisão com o teclado; a política de segurança de conteúdo (CSP) como cabeçalho do servidor; peso e desempenho; publicar um site estático

## Ao terminar, você vai conseguir

- Percorrer o painel completo só com o teclado, e dizer que critério de acessibilidade descumpre o que não se alcança, não se vê ou não tem saída.
- Escrever uma política de segurança de conteúdo (CSP), explicar o que cada diretiva bloqueia e por que o seu lugar é um cabeçalho do servidor e não só uma tag.
- Testar essa política no seu computador com os mesmos cabeçalhos que o servidor enviará, e ler no console as mensagens de violação.
- Medir o peso do painel e as suas métricas (LCP, CLS, INP), e dizer qual delas não aparece em um teste de carga de laboratório e por quê.
- Reservar o espaço do que chega tarde e pré-carregar os módulos, e verificar com números que ajudou.
- Publicar a pasta como site estático e verificar com `curl` que os cabeçalhos chegaram.
- Verificar um por um os cinco critérios com que o curso se encerra.

## O porquê antes do como

Até agora o seu painel funciona no seu computador, aberto pelo seu servidor, com o seu navegador e com dados que você escreveu. “Funciona na minha máquina” é uma frase que qualquer um que já publicou algo conhece bem, e é a distância entre um exercício e um produto. Esta lição percorre essa distância: revisa o painel como o revisaria uma pessoa que não é você, protege-o com mais uma camada, mede-o e coloca-o na internet.

O curso, além disso, prometeu um critério de saída. O [temário](README.md) diz que ele não termina quando você leu a lição 11, mas quando o seu painel cumpre cinco coisas. Nenhum programa as verifica por você: você as verifica, com as ferramentas do navegador, e esta lição diz como:

| # | O painel cumpre… | Onde se aprendeu | Onde se verifica hoje |
|---|---|---|---|
| 1 | Navega-se completo com o teclado | 2, 3, 4, 5 e 7 | 11.1 |
| 2 | Não há nem um erro no console | 8, 9 e 10 | 11.2 e 11.5 |
| 3 | Funciona a 320 px de largura sem transbordamento horizontal | 5 | 11.1 |
| 4 | Mostra os três estados: carregando, erro e vazio | 9 | 11.5 |
| 5 | O texto que vem de fora é desenhado com `textContent`, nunca com `innerHTML` | 7 | 11.2 e 11.5 |

A seção 11.5 fecha os cinco com um teste para cada um. Antes, três ideias novas: a política de segurança de conteúdo (11.2), medir o peso e o desempenho antes de tentar melhorá-los (11.3) e publicar um site estático (11.4). A 11.1 é uma revisão com o teclado, não uma ideia nova.

### O estado do painel ao final da lição 10

Esta lição parte de um painel concreto. Ao fechar a lição 10, o `revisor` tem tudo o que era da lição 9 mais o dos formulários:

- `index.html` com o cabeçalho (a “Última revisión” e a navegação), o resumo, e na seção de serviços os avisos (`#notice`, `#error-notice`), o botão “Reintentar” e uma zona de dados com o buscador, os rádios “Mostrar”, “Revisar ahora”, o botão de ordenar, o aviso da contagem e a tabela; e uma seção para incluir um serviço.
- `css/styles.css` com as camadas e as regras das lições 3, 4, 5, 7, 9 e 10.
- `js/stats.js`, `js/load.js`, `js/state.js`, `js/filters.js`, `js/form.js`, `js/view.js` e `js/main.js`, com os dados em `data/services.json` e `data/services-empty.json`.
- Um painel que filtra, ordena, inclui serviços com validação nativa e mensagens que um leitor de tela pode anunciar, e que aceita `?case=empty`, `?case=error`, `?case=invalid` e `?case=timeout`.

O que **ainda não tem**: nenhum cabeçalho de segurança (o servidor do Python só envia o mínimo), nenhuma medição de peso nem de velocidade, um ícone que é um atalho, e nenhum endereço que outra pessoa possa abrir. Nesta lição o painel passa para a pasta `11-el-panel-terminado/revisor/`, que é a lição 10 mais mudanças pequenas, todas explicadas abaixo: um arquivo de cabeçalhos, um ícone próprio, algumas linhas no `<head>` e um último bloco de CSS.

Tudo nesta lição usa o que você já tem: o servidor de sempre a partir da pasta `programas/` do [repositório do curso](https://github.com/HabilMX/curso-web) para as figuras (as desta lição estão em [`programas/11-el-panel-terminado/`](https://github.com/HabilMX/curso-web/tree/main/programas/11-el-panel-terminado)), e um servidor Python um pouco mais longo (um só, de umas 55 linhas, que você vê completo abaixo) para testar os cabeçalhos. Nem Node nem pacotes.

## Os conceitos

### 11.1 A revisão com o teclado

O critério 1 diz que o painel se navega completo com o teclado, sem usar o mouse. Verifica-se fazendo, não lendo o código. Há quatro perguntas, e cada uma corresponde a um critério das diretrizes de acessibilidade (WCAG 2.2):

1. **Alcança-se tudo?** Tudo o que se pode fazer com o mouse deve poder ser feito com o teclado ([2.1.1, Teclado](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html), nível A). Os elementos nativos —`<button>`, `<input>`, `<select>`— já o cumprem. O que quebra é o que você construiu à mão: um `<div>` com um clique.
2. **Vê-se onde você está?** O indicador de foco deve estar visível ([2.4.7, Foco visível](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html), nível AA). Por isso `css/styles.css` tem `:focus-visible { outline: 3px solid … }` desde a lição 3 e nunca um `outline: none`.
3. **A ordem faz sentido?** O foco deve percorrer os controles em uma ordem que conserve o significado e permita operar ([2.4.3, Ordem do foco](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html), nível A). A regra prática: a ordem do HTML é a ordem do foco, então não é preciso —e quase nunca convém— mexer nela com `tabindex` positivo.
4. **Pode-se sair?** Se o foco entra em um componente, deve poder sair dele só com o teclado ([2.1.2, Sem armadilhas de teclado](https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html), nível A).

E mais dois critérios da versão 2.2 que se cumprem sem esforço, se você os conhece: o foco não deve ficar totalmente coberto por conteúdo que você colocou ([2.4.11, Foco não obscurecido (mínimo)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html), nível AA; um cabeçalho fixo é o culpado típico, e o painel não tem nenhum) e os controles devem medir ao menos 24 × 24 pixels CSS ou ter espaço ao redor ([2.5.8, Tamanho do alvo (mínimo)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), nível AA; os campos e botões do painel têm uma altura mínima de 2.5 rem, que com o tamanho de letra padrão são 40 pixels: medido no Chrome, todos medem 40 de altura).

**Preveja:** no painel, quantas vezes você precisa pressionar Tab, começando na página recém-carregada, para chegar ao botão “Agregar servicio”? Pense no que há antes: os dois links da navegação, o buscador, o grupo de rádios, “Revisar ahora”, o botão de ordenar, a caixa da tabela, um botão “Ver detalle” para cada serviço, e os três campos do formulário.

Cole este fragmento no console com o painel aberto (`Ctrl+Shift+K` no Firefox, `F12` e a aba Console no Chrome). Ele lista, em ordem, tudo o que o teclado pode alcançar. A segunda condição do filtro deixa um só rádio por grupo, o marcado, porque um grupo de rádios é uma única parada de Tab (você viu na lição 2):

```js
const stops = [...document.querySelectorAll("a[href], button, input, select, textarea, [tabindex]")]
  .filter((e) => !e.disabled && e.tabIndex >= 0 && e.getClientRects().length > 0)
  .filter((e) => e.type !== "radio" || e.checked);
console.log(stops.map((e) =>
  `${e.tagName.toLowerCase()} · ${(e.labels?.[0]?.textContent ?? e.textContent).trim().slice(0, 30)} · tabindex ${e.tabIndex}`
).join("\n"));
```

No painel desta lição, com os cinco serviços carregados, imprime dezesseis linhas:

```text
a · Resumen · tabindex 0
a · Servicios · tabindex 0
input · Buscar servicio · tabindex 0
input · Todos · tabindex 0
button · Revisar ahora · tabindex 0
button · Ordenar por tiempo de respuest · tabindex 0
div · Estado de los servicios en la  · tabindex 0
button · Ver detalle de Catálogo · tabindex 0
button · Ver detalle de Pagos · tabindex 0
button · Ver detalle de Inventario · tabindex 0
button · Ver detalle de Notificaciones · tabindex 0
button · Ver detalle de Búsqueda · tabindex 0
input · Nombre * · tabindex 0
select · Estado * · tabindex 0
input · Tiempo de respuesta (ms) * · tabindex 0
button · Agregar servicio · tabindex 0
```

São dezesseis paradas, então a resposta à previsão é dezesseis vezes; eu verifiquei pressionando Tab de verdade, e o foco percorre exatamente essa lista e nessa ordem. O que importa na lista não é o número, mas o que **não** aparece: nenhum `tabindex` diferente de zero (todas dizem 0), nenhum link sem destino, e um único `div`, que está ali de propósito: é a caixa da tabela, que a lição 5 tornou focalizável para que o teclado possa rolá-la. Se no seu painel alguma linha diz `tabindex 3`, ou se uma ação do painel não aparece na lista, ali está o defeito.

O percurso completo, que leva dez minutos e vale a pena fazer devagar:

- Com Tab, avance por toda a página; com Shift+Tab, volte. Em cada parada, verifique que você vê o contorno de foco.
- No buscador, escreva `pag`: a tabela deve ficar com uma linha sem que você toque no mouse.
- No seletor de estado, mude-o com as setas.
- Em um botão “Ver detalle”, pressione Enter ou a barra de espaço: o detalhe aparece embaixo da tabela e o foco fica no mesmo botão (a lição 7 fez com que `update` o devolvesse ali depois de desenhar de novo).
- No formulário, com o foco em um campo, pressione Enter com tudo vazio: o foco salta para o primeiro campo com erro. Corrija e envie: o foco volta a “Nombre”.
- Abra `?case=error` e chegue a “Reintentar” só com Tab. Pressione-o: o foco fica nele (a lição 9 fez com que `load` o devolvesse).

**A 320 pixels.** O critério 3 pede que o painel funcione a 320 pixels de largura sem barra de rolagem horizontal. Não é um número arbitrário: é o critério de [refluxo (1.4.10)](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html), nível AA, que equivale a uma tela de 1280 pixels com zoom de 400 % e existe para quem amplia o texto. Verifica-se em uma linha do console:

```js
document.documentElement.scrollWidth <= document.documentElement.clientWidth
```

Se devolve `false`, algo está saindo. O painel chega a esta lição cumprindo-o desde a lição 5, que colocou a tabela em uma caixa que rola, e a lição 7 teve de defendê-lo: o texto oculto dos botões “Ver detalle” escapava dessa caixa e esticava a página a 498 px, até que `position: relative` em `.table-scroll` o devolveu para dentro. É a lição deste critério: não se cumpre uma vez, mede-se de novo depois de cada mudança.

**As ferramentas automáticas.** Antes de dar a revisão por boa, rode um auditor. Nesta lição usou-se o axe-core 4.14.0, o motor que está por trás de muitas extensões de acessibilidade, sobre o painel nas suas cinco situações (normal e os quatro casos de `?case=`): zero violações. Também o Lighthouse, que detalhamos mais abaixo, deu 100 em acessibilidade. Mas um zero não significa “acessível”: significa “nenhum defeito dos que uma máquina sabe reconhecer”. Uma máquina pode ver que um campo tem rótulo; não pode saber se a mensagem de erro se entende. Por isso o percurso com o teclado e, se puder, com um leitor de tela, não é substituído.

### 11.2 A política de segurança de conteúdo, como cabeçalho

**Duas camadas.** Na lição 7 você aprendeu a primeira defesa contra os ataques de injeção de código (XSS): o texto que vem de fora entra na página com `textContent`, que o trata como texto e nunca como HTML. É a defesa que conta, porque evita que o problema aconteça. Uma política de segurança de conteúdo —CSP, pela sigla em inglês— é uma segunda camada, para o dia em que a primeira falhar: um programador distraído que escreve `innerHTML` onde não devia, uma biblioteca de terceiros com um defeito. O MDN diz isso com as palavras exatas no seu [guia de CSP](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Guides/CSP): uma CSP não substitui o tratamento correto da entrada; é preciso fazer as duas coisas, para ter defesa em profundidade.

**O que é.** Uma CSP é uma lista de regras que **o servidor manda ao navegador** sobre o que a página pode carregar e executar. “Os scripts só podem vir do meu próprio site”, “as imagens, igual”, “a página não pode se conectar a mais ninguém”. O navegador as faz cumprir: se algo viola uma regra, bloqueia e anota no console. A política mais simples é `default-src 'self'`, que diz: tudo o que a página carregar deve vir da sua própria origem.

**Cabeçalho ou tag.** Uma CSP pode chegar de duas formas. Como um **cabeçalho da resposta** HTTP —`Content-Security-Policy: …`, a forma recomendada, que se envia com cada resposta, não só com a página— ou como uma tag `<meta http-equiv="Content-Security-Policy" content="…">` dentro do HTML. A tag existe para quem não controla o servidor, e por isso é usada nos sites estáticos mais simples. Mas não é a mesma coisa. O MDN adverte que a tag “não suporta todas as funções”: não pode entregar uma política em modo somente-relatório, e a diretiva `frame-ancestors` (que impede que outras páginas ponham a sua em um quadro) [não funciona dentro de uma tag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors). O cabeçalho, em contrapartida, cobre tudo.

Por isso o temário diz “CSP como cabeçalho do servidor”. Mas comecemos pela tag, que se pode testar com um arquivo e sem servidor especial.

**Preveja:** a figura 11.1 tem uma tag com a política `script-src 'self'` e dois scripts: um escrito dentro do HTML e outro em um arquivo do mesmo site. Qual é executado?

```html
<!-- fig11_01.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="Content-Security-Policy" content="script-src 'self'">
  <title>Una política que bloquea el script en línea</title>
  <link rel="icon" href="data:,">
</head>
<body>
  <main>
    <h1>Una política que bloquea el script en línea</h1>
    <p id="result" role="status">Ningún script se ha ejecutado.</p>
  </main>

  <script>
    document.getElementById("result").textContent = "El script en línea sí se ejecutó.";
  </script>
  <script src="fig11_01/external.js"></script>
</body>
</html>
```

```js
// fig11_01/external.js
document.getElementById("result").textContent = "El script externo sí se ejecutó.";
```

Abra-a em `http://127.0.0.1:8000/11-el-panel-terminado/fig11_01.html`, com o servidor ligado a partir da pasta `programas/` do repositório. Ao carregá-la, a página mostra:

```text
Una política que bloquea el script en línea
El script externo sí se ejecutó.
```

Só o script externo rodou. O que está dentro do HTML foi bloqueado, e o console diz por quê. É a mensagem que você verá mais vezes na vida com uma CSP, e convém lê-la completa:

```text
Executing inline script violates the following Content Security Policy directive 'script-src 'self''. Either the 'unsafe-inline' keyword, a hash ('sha256-bTp6bKDsmuoAZZxMFjB9R21R8gPJ7kRwjoDZhQv8XQo='), or a nonce ('nonce-...') is required to enable inline execution. The action has been blocked.
```

Leia por partes. “Executing inline script violates … `script-src 'self'`” diz o que foi bloqueado (um script em linha) e que regra o bloqueou. “Either the 'unsafe-inline' keyword, a hash, or a nonce is required to enable inline execution” enumera as três formas de permiti-lo: abrir a regra de vez, ou autorizar *esse* script em concreto com uma impressão digital (`hash`) ou um número de uso único (`nonce`). E “The action has been blocked” confirma que não foi executado. O `hash` da amostra é o desse script exato; no seu será igual, porque o script é o mesmo.

Repare no que isto significa para quem ataca: uma política assim impede, por si só, que um fragmento injetado —`<script>…</script>`, ou um atributo `onerror="…"`— seja executado, ainda que tenha chegado à página. E repare no que significa para você: **o seu código tem de viver em arquivos** e registrar seus eventos com `addEventListener`. O painel faz assim desde a lição 7. Por isso a política que escreveremos agora não lhe quebra nada.

**A política do painel, diretiva por diretiva.** Uma diretiva é uma regra para um tipo de recurso. A do `revisor` é esta:

| Diretiva | Valor | O que impede |
|---|---|---|
| `default-src` | `'none'` | qualquer carga que outra diretiva não autorize explicitamente |
| `script-src` | `'self'` | scripts que não sejam arquivos do mesmo site: em linha, de outro domínio, `eval()` |
| `style-src` | `'self'` | folhas de estilo de outros sites e atributos `style` escritos no HTML |
| `img-src` | `'self'` | imagens de outros sites e as do tipo `data:` |
| `connect-src` | `'self'` | que o `fetch` peça dados a outro domínio |
| `form-action` | `'none'` | que um formulário envie seus dados a algum lugar |
| `base-uri` | `'none'` | que alguém mude o endereço base com uma tag `<base>` |
| `frame-ancestors` | `'none'` | que outra página incorpore a sua em um quadro (só funciona como cabeçalho) |

`'self'` significa “a mesma origem que a página” (esquema, servidor e porta, os que você estudou na lição 0). As aspas simples fazem parte da palavra. `default-src` é o valor de reserva: se não há uma diretiva para um tipo de recurso, manda `default-src`. Começar por `'none'` obriga a permitir cada coisa de propósito, e é isso que se quer: uma lista curta que você pode ler completa.

O painel não usa fontes de outros sites, nem imagens externas, nem um único script de terceiros. Sua política pode ser tão fechada porque o seu código foi escrito por você, nos seus arquivos.

**O arquivo de cabeçalhos.** Os serviços de publicação de sites estáticos leem um arquivo chamado `_headers` (sem extensão) que está na pasta que você publica. [Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/headers/) e [Netlify](https://docs.netlify.com/manage/routing/headers/) o aceitam com a mesma sintaxe: uma linha com a rota à qual se aplica e, embaixo, com recuo, um cabeçalho por linha. Estes são os do `revisor`:

```text
# revisor/_headers
# Encabezados que el servidor debe enviar con cada respuesta.
# Cloudflare Pages y Netlify leen este archivo con esta misma sintaxis.
/*
  Content-Security-Policy: default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; form-action 'none'; base-uri 'none'; frame-ancestors 'none'
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
```

Além da CSP, tem outros dois cabeçalhos baratos. [`X-Content-Type-Options: nosniff`](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Reference/Headers/X-Content-Type-Options) diz ao navegador que não adivinhe o tipo de um arquivo: se a resposta diz que é texto, é texto, e um script só é executado se o servidor declara que é JavaScript. E [`Referrer-Policy: no-referrer`](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Reference/Headers/Referrer-Policy) evita que o navegador diga a outros sites de que página você vem; o painel não tem links para ninguém, então não custa nada.

**Testando no seu computador.** O servidor de sempre (`python3 -m http.server`) não lê `_headers`. Para ver o mesmo que verá o servidor onde você publicar, este programa em Python faz o mesmo que o `http.server` e além disso envia os cabeçalhos do arquivo. Serve qualquer pasta; leia-o completo, porque são umas 55 linhas e não há nada escondido:

```python
# headers-server.py
# Sirve una carpeta como lo hace `python3 -m http.server`, pero además envía los
# encabezados que declara el archivo _headers de esa carpeta. Así pruebas en tu
# computadora lo mismo que va a enviar el servidor donde publiques. Y, como el
# slow-server.py de la lección 9, entiende ?delay=MILISEGUNDOS para tardar a propósito.
#
# Uso:  python3 headers-server.py [carpeta] [puerto]
import fnmatch
import sys
import time
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlsplit

# Nadie necesita esperar más de diez segundos para ver el efecto.
MAX_DELAY_MS = 10000


def read_rules(folder):
    """Devuelve una lista de (patrón de ruta, encabezado, valor)."""
    rules = []
    pattern = None
    headers_file = Path(folder) / "_headers"
    if not headers_file.exists():
        return rules
    for line in headers_file.read_text(encoding="utf-8").splitlines():
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        if not line[0].isspace():
            pattern = line.strip()  # una ruta: "/*" o "/index.html"
            continue
        name, _, value = line.strip().partition(":")
        rules.append((pattern, name.strip(), value.strip()))
    return rules


class Handler(SimpleHTTPRequestHandler):
    rules = []

    def do_GET(self):
        # Lo mismo que slow-server.py: ?delay=3000 espera tres segundos antes de contestar.
        query = parse_qs(urlsplit(self.path).query)
        delay = query.get("delay", ["0"])[0]
        if delay.isdigit():
            time.sleep(min(int(delay), MAX_DELAY_MS) / 1000)
        try:
            super().do_GET()
        except (BrokenPipeError, ConnectionResetError):
            # El navegador se cansó de esperar y cerró la conexión.
            pass

    def end_headers(self):
        path = self.path.split("?", 1)[0]
        for pattern, name, value in self.rules:
            if fnmatch.fnmatch(path, pattern):
                self.send_header(name, value)
        super().end_headers()


def main():
    folder = sys.argv[1] if len(sys.argv) > 1 else "."
    port = int(sys.argv[2]) if len(sys.argv) > 2 else 8000
    Handler.rules = read_rules(folder)
    print(f"{len(Handler.rules)} encabezados leídos de {folder}/_headers", flush=True)
    server = ThreadingHTTPServer(
        ("127.0.0.1", port), partial(Handler, directory=folder)
    )
    print(f"Sirviendo {folder} en http://127.0.0.1:{port}  (Ctrl+C para parar)", flush=True)
    server.serve_forever()


main()
```

A partir da pasta `programas/11-el-panel-terminado/` do repositório baixado:

```bash
python3 headers-server.py revisor 8000
```

Deve imprimir `3 encabezados leídos de revisor/_headers` e o endereço. Abra-o e verifique, em outro terminal, que os cabeçalhos chegam:

```bash
curl -sI http://127.0.0.1:8000/ | grep -i -E "content-security|nosniff|referrer"
```

Devem sair as três linhas. Se não sai nenhuma, o servidor não leu o arquivo, e é melhor saber agora do que depois de publicar. (Para parar o servidor, `Ctrl+C`.) O código traz além disso o `?delay` do `slow-server.py` da lição 9 —as mesmas linhas, em `do_GET`—, para que `?case=timeout` continue provocando um tempo esgotado de verdade com este servidor.

**O erro que aparece assim que você a coloca.** Com essa política ativa, o console do painel da lição 10 diz algo que você não esperava:

```text
Loading the image 'data:,' violates the following Content Security Policy directive: "img-src 'self'". The action has been blocked.
```

É o ícone. Desde a lição 2, o painel leva `<link rel="icon" href="data:,">`, o truque do Exercício 2 da lição 1 para que o navegador não peça `/favicon.ico` e encha o console de erros 404; a lição 2 avisou que isso tinha um custo, e este é ele. Mas uma imagem `data:` não é do mesmo site, e a política (`img-src 'self'`) a bloqueia. Há duas saídas: abrir a política com `data:` em `img-src`, ou dar ao site um ícone próprio. A segunda é melhor, porque um site publicado deve ter ícone de qualquer maneira. O `revisor` traz um arquivo `favicon.svg` de duas linhas (um quadrado escuro com um círculo verde) e o `<head>` o liga com `<link rel="icon" href="favicon.svg" type="image/svg+xml">`:

```html
<!-- revisor/favicon.svg -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#1b1f24"/><circle cx="16" cy="16" r="7" fill="#1a7f37"/></svg>
```

A primeira linha é um comentário, como nas páginas; em um SVG é permitido antes da tag `<svg>`. Os principais navegadores atuais aceitam um ícone SVG (nesta lição comprovou-se no Chrome e no Firefox, não no Safari); um que não o aceite pedirá `/favicon.ico` e verá o 404, algo que em um painel interno você pode aceitar.

**Testar antes de impor.** Uma política nova pode quebrar algo que você não viu. A forma de descobrir sem quebrar ninguém é o cabeçalho irmão `Content-Security-Policy-Report-Only` ([MDN](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Reference/Headers/Content-Security-Policy-Report-Only)): a mesma política, mas o navegador apenas *anota* as violações e não bloqueia nada. Para testar, mude o nome do cabeçalho em `_headers`, recarregue e olhe o console. No Chrome 154, com o ícone `data:,` da lição 10 ainda colocado, a violação aparece como uma mensagem informativa: “Loading the image 'data:,' violates the following Content Security Policy directive: "img-src 'self'". The policy is report-only, so the violation has been logged but no further action has been taken.” O MDN adverte que, para que os relatórios sejam *enviados* a algum lugar, a política precisa da diretiva `report-to` e de um servidor que os receba; sem eles, você só vê o que sai no seu console. Para um site pequeno, ver o console basta. Quando não houver mensagens, você volta ao nome `Content-Security-Policy` e a política passa a ser imposta.

**O que uma CSP não faz.** Que isso não o leve a crer que o problema está resolvido. A figura 11.2 insere, com `innerHTML`, um nome com um ataque dentro (uma imagem quebrada com um atributo `onerror`), sob a mesma política:

```html
<!-- fig11_02.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="Content-Security-Policy" content="script-src 'self'">
  <title>La política no arregla el innerHTML</title>
  <link rel="icon" href="data:,">
</head>
<body>
  <main>
    <h1>La política no arregla el innerHTML</h1>
    <p id="result" role="status"></p>
    <div id="zone"></div>
  </main>

  <script src="fig11_02/inject.js"></script>
</body>
</html>
```

```js
// fig11_02/inject.js
// Un nombre que viene de fuera y trae un ataque dentro.
const incoming = '<img src="missing.png" onerror="document.title = \'atacado\'">';

// MAL: innerHTML interpreta el texto como HTML.
document.getElementById("zone").innerHTML = incoming;

const images = document.querySelectorAll("#zone img").length;
document.getElementById("result").textContent =
  `Imágenes inyectadas: ${images}. Título de la página: ${document.title}`;
```

Preveja: o atributo `onerror` é executado? A imagem fica na página?

```text
La política no arregla el innerHTML
Imágenes inyectadas: 1. Título de la página: La política no arregla el innerHTML
```

A imagem ficou: o HTML injetado está na página, `1`. Mas o título do documento não mudou: o atributo não foi executado, e o console diz por quê (além do 404 de uma imagem que não existe):

```text
Executing inline event handler violates the following Content Security Policy directive 'script-src 'self''. Either the 'unsafe-inline' keyword, a hash ('sha256-...'), or a nonce ('nonce-...') is required to enable inline execution. Note that hashes do not apply to event handlers, style attributes and javascript: navigations unless the 'unsafe-hashes' keyword is present. The action has been blocked.
```

Essa é a CSP fazendo o seu trabalho de segunda camada: conteve o dano. Mas o dano que de fato ocorreu —um HTML alheio dentro da sua página— é justamente o que `textContent` impede. A CSP não repara um `innerHTML` mal colocado; apenas reduz o que ele pode fazer. E nem todo ataque precisa de um script: quem injeta um formulário falso ou um texto enganoso não precisa executar nada.

**O que vem por aí.** Há dois mecanismos mais novos que atacam o mesmo problema por outro lado, e por ora não são base de nada do que você escreve aqui. **Trusted Types** ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API)) faz com que atribuir um texto solto a `innerHTML` lance um erro, se a política o exige com `require-trusted-types-for 'script'`; o MDN o marca como “Baseline 2026, recém-disponível” (desde fevereiro de 2026). **`setHTML()` e a API de saneamento** ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/setHTML)) limpariam o HTML antes de inseri-lo; o MDN o marca como disponibilidade limitada, não Baseline. A regra do curso se mantém: não são usados em produção até que sejam base. Para o seu painel, `textContent` já faz o trabalho.

**A tag, quando não há outra.** Se o site onde você publica não deixa enviar cabeçalhos —a documentação do GitHub Pages que foi consultada para preparar esta lição não descreve nenhuma maneira de fazê-lo, e por isso convém verificar com `curl -I` no seu site publicado—, a tag `<meta>` é melhor que nada. O `index.html` do painel **não a traz**, porque a sua política viaja em `_headers`; se você publica onde não se leem cabeçalhos, é você quem a acrescenta. É esta linha, com as mesmas diretivas do `_headers` menos `frame-ancestors`, que dentro de uma tag não funciona e o navegador ignora com um aviso:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; form-action 'none'; base-uri 'none'">
```

Vai o mais acima possível do `<head>`, logo embaixo de `<meta charset="utf-8">`: a [especificação da CSP](https://www.w3.org/TR/CSP3/) adverte que uma política em uma tag não se aplica ao que aparece antes dela, então um `<link>` ou um `<script>` escritos mais acima ficariam de fora. Comprovou-se assim, com o painel servido pelo `python3 -m http.server` de sempre (que não manda cabeçalhos) a partir de uma subpasta, como o serve o GitHub Pages: a tabela, os quatro casos de `?case=` e o console sem uma única mensagem, salvo o 404 provocado de `?case=error`. Você perderá `frame-ancestors` e o modo somente-relatório, e deverá dizer a si mesmo sem rodeios que o seu site tem uma CSP mais fraca que a de um servidor que, sim, manda cabeçalhos.

### 11.3 Peso e desempenho: medir antes de otimizar

A melhoria de desempenho mais comum é a que não era necessária. Vê-se um número alarmante, aplica-se uma receita de um artigo, e ninguém volta a medir. A disciplina desta seção é a contrária: **primeiro se mede, depois se decide, e no final se mede de novo.**

**O peso.** O primeiro que se mede é o mais simples: quantos bytes pesa o que o navegador baixa. A partir da pasta `revisor/`:

```bash
wc -c index.html favicon.svg css/*.css js/*.js data/services.json
```

O resultado, arredondado, e quanto pesaria cada tipo comprimido, calculado com `gzip -9 -c arquivo | wc -c`. Essa segunda coluna é uma **estimativa**, não uma medida do que trafega: os serviços de publicação costumam comprimir as respostas de texto, mas cada servidor decide se comprime e com que algoritmo (`gzip`, `br`…), e só o cabeçalho `Content-Encoding` da resposta diz o que foi aplicado de verdade ([RFC 9110, §8.4](https://www.rfc-editor.org/rfc/rfc9110.html#section-8.4)). Em 11.4 você o verifica com `curl` sobre o seu site publicado:

| Tipo | Arquivos | Bytes | Comprimido (aprox.) |
|---|---|---|---|
| HTML | `index.html` | 5,374 | 1,742 |
| CSS | `css/styles.css` | 11,192 | 3,722 |
| JavaScript | sete módulos | 20,731 | 8,577 |
| Dados | `data/services.json` | 439 | 211 |
| Ícone | `favicon.svg` | 194 | 180 |
| **Total** | | **37,930** | **uns 14,400** |

Trinta e sete mil bytes sem comprimir e uns catorze mil se o servidor comprime. A folha de estilo é metade do que parece: boa parte dos seus onze mil bytes são os comentários que explicam cada regra, e comprimidos quase desaparecem. Uma única fotografia de celular pesa centenas de vezes isso. As conclusões são três. Uma: para este painel, **reduzir bytes não é o problema**. Não é preciso minificar nem empacotar, e não vale a pena complicar um curso “sem uma única ferramenta de build” para economizar três quilobytes. Duas: o módulo mais pesado é `js/main.js` (7,165 bytes), porque é onde vive o formulário. Três: se algum dia o painel tivesse imagens, ali estaria o peso, e então sim seria preciso medir de novo.

**As três métricas.** O desempenho que uma pessoa sente se resume em três números, chamados de métricas web essenciais (Core Web Vitals), definidas pela [web.dev](https://web.dev/articles/vitals). Cada uma é avaliada no percentil 75 das visitas, isto é, o valor que 75 % das visitas igualam ou melhoram:

| Métrica | O que mede | Bom |
|---|---|---|
| [LCP](https://web.dev/articles/lcp) (pintura do maior conteúdo) | quando aparece o principal | 2.5 s ou menos |
| [INP](https://web.dev/articles/inp) (da interação à pintura seguinte) | quanto a página demora para responder a um clique, um toque ou uma tecla | 200 ms ou menos |
| [CLS](https://web.dev/articles/cls) (deslocamento acumulado de layout) | quanto a página se move sozinha, sem que a pessoa faça nada | 0.1 ou menos |

Para o INP, a web.dev considera deficiente tudo o que passar de 500 ms; para o CLS, o que passar de 0.25.

**Laboratório e campo.** Um detalhe que decide que ferramenta usar e em que acreditar. As métricas “de campo” são medidas com pessoas reais que usam a página. As de “laboratório” são medidas no seu computador, com um perfil simulado. LCP e CLS podem ser medidos nos dois lados. **O INP precisa que alguém interaja**, e isso muda tudo. Um teste de carga no laboratório —abrir a página e medir, sem tocá-la— não produz nenhum INP, porque ninguém clicou; o Lighthouse no seu modo normal é assim, e em seu lugar informa o *tempo total de bloqueio* (TBT), que a web.dev considera uma aproximação razoável mas não um substituto. *Pode-se* medir o INP no laboratório se você interage durante a medição, mas, como adverte o [guia do INP](https://web.dev/articles/inp), o número depende de que interações você fez; o que conta é o das pessoas reais, no campo. Por isso um 100 no Lighthouse não é “desempenho perfeito”: é “sem problemas no que o Lighthouse sabe medir”. Quando você tiver visitas reais, essas medidas estão na ferramenta de relatórios do seu serviço de publicação ou nos dados públicos do Chrome; enquanto isso, o que está ao seu alcance é o laboratório.

**Medir no console.** Para ver o LCP e o CLS do seu painel sem instalar nada, abra o painel e cole isto no console:

```js
const result = { lcp: null, cls: 0 };
new PerformanceObserver((list) => {
  result.lcp = Math.round(list.getEntries().at(-1).startTime);
}).observe({ type: "largest-contentful-paint", buffered: true });

let burst = 0;  // suma de la ráfaga (ventana de sesión) en curso
let burstStart = 0;
let lastShift = 0;
new PerformanceObserver((list) => {
  for (const shift of list.getEntries()) {
    if (shift.hadRecentInput) continue;
    const sameBurst = burst > 0
      && shift.startTime - lastShift < 1000
      && shift.startTime - burstStart < 5000;
    if (sameBurst) {
      burst += shift.value;
    } else {
      burst = shift.value;
      burstStart = shift.startTime;
    }
    lastShift = shift.startTime;
    result.cls = Math.max(result.cls, burst);
  }
}).observe({ type: "layout-shift", buffered: true });
setTimeout(() => console.log(result), 300);
```

`buffered: true` pede ao navegador as entradas que já ocorreram antes de você colar o código, e `hadRecentInput` descarta os saltos causados por algo que a pessoa fez (que não contam). O resto do segundo observador segue a [definição vigente do CLS](https://web.dev/articles/cls): os saltos não são somados todos, mas por **rajadas** (janelas de sessão). Um salto pertence à rajada em curso se chega menos de um segundo depois do anterior e a rajada ainda não tem cinco segundos; se não, começa uma rajada nova. O CLS é a rajada que mais somar (`Math.max`). Antes de 2021 o CLS era a soma de todos os saltos da vida da página, e por isso você ainda verá fragmentos que fazem `cls += value` sem mais: em uma página que fica aberta muito tempo, essa soma cresce sem limite e deixa de poder ser comparada com os limites de 0.1 e 0.25. No painel, os dois cálculos dão o mesmo, porque toda a carga produz um único salto; o fragmento correto é o que vale para qualquer página. No seu computador, sem limitar a rede, o painel dá um LCP de uns 20 a 60 ms e um CLS de quase 0: tão rápido que não há nada a melhorar. Mas isso é se enganar: o seu computador e a sua rede local não são os de quem abrirá o painel a partir de um celular.

**Um perfil lento.** Nas ferramentas do navegador, a aba **Rede** (no Chrome e no Firefox) permite escolher um perfil de conexão lenta. Para esta lição usou-se um perfil fixo, para que os números possam ser repetidos: 150 ms de latência por requisição e 200 KB/s de download, sem cache, com a janela a 1280 e a 320 pixels de largura, três corridas de cada uma. **São números simulados no Chrome 154 de forma automatizada**; os seus serão diferentes, e o que conta é a diferença entre antes e depois na sua máquina.

| | Painel da lição 10 | Painel desta lição |
|---|---|---|
| CLS a 1280 px | 0.077 | 0.001 |
| CLS a 320 px | 0.831 | 0.001 |
| LCP | de 420 a 440 ms | de 468 a 484 ms |
| A requisição de `data/services.json` começa em | uns 790 ms | uns 550 ms |
| A tabela aparece em | uns 950 ms | uns 715 ms |

Duas coisas mudaram muito e uma não mudou. O CLS a 1280 px estava abaixo do limite de 0.1, mas a 320 px era 0.831: mais de três vezes o limite do “deficiente”, na largura que mais importa. E a tabela, que é o que a pessoa veio ver, aparece uns 230 ms antes. O que não mudou é o LCP, e convém entender por quê: o maior elemento que o navegador pinta é o título “Revisor de servicios”, que está no HTML e é pintado antes de chegar qualquer dado; acelerar os dados não o move (as variações de algumas dezenas de milissegundos estão dentro do que muda de uma corrida a outra). Uma métrica mede o que mede: o LCP não sabe quando a sua tabela apareceu, e por isso esta lição mede também esse momento. Vejamos as causas.

**A cascata.** Na aba Rede, cada arquivo é uma barra, e a ordem em que as barras começam conta a história da carga. O navegador baixa `index.html`, e só então descobre `main.js`. Baixa `js/main.js`, e só então descobre que ele importa `js/load.js`, `js/state.js`, `js/view.js` e `js/form.js`. Baixa `js/state.js`, e só então descobre que importa `js/filters.js`; baixa `js/view.js`, e descobre `js/stats.js`. E a requisição dos dados só sai depois que tudo isso foi executado. Cada “só então” é uma viagem de ida e volta à rede; com 150 ms de latência, quatro níveis somam meio segundo, e a pessoa vê “Cargando servicios…” todo esse tempo.

A solução é dizer ao navegador, desde o início, que módulos ele vai precisar, com `rel="modulepreload"` ([MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/modulepreload)): no `<head>`, uma linha por módulo, para que os baixe todos em paralelo desde o primeiro momento. O MDN o situa como disponível em todos os navegadores desde setembro de 2023 e adverte para não pré-carregar *tudo*, para não tirar largura de banda do que é, sim, urgente. Com seis módulos de uns poucos quilobytes, não há risco.

**O salto.** O CLS saiu de uma medição com a API de instabilidade de layout, que além disso diz *que elementos* se moveram. No painel da lição 10, a 320 px, moviam-se o `<main>` e o `<nav>` (da posição vertical 134 para a 160), as linhas do resumo e o rodapé. Três causas, e as três são a mesma coisa: algo que **chega tarde** e empurra o que já estava. A primeira, a “Última revisión”: o cabeçalho diz “todavía no”, em uma linha, e quando chega a data, a 320 px, ocupa duas; tudo o que está embaixo desce 26 px. A segunda, as cifras do resumo: um `<dd>` vazio não tem altura, e quando é preenchido, a sua linha cresce. A terceira, o rodapé: enquanto carrega, a página é curta e o rodapé está à vista; quando a tabela aparece, ela o empurra para fora da tela, e o navegador conta isso como um salto.

A solução se chama **reservar o espaço**: você diz à página quanto vai ocupar o que chegará, antes de chegar. É um último bloco no final de `css/styles.css`, e o `<p>` da “Última revisión” ganha a classe `last-check` para poder ser alvo dele:

```css
@layer components {
  /* ---- Lección 11: reservar el hueco de lo que llega tarde ---- */
  /* Las cifras del resumen se escriben cuando llegan los datos. Un <dd> vacío no tiene
     altura; un espacio que no se ve le da su línea mientras tanto, del mismo alto que la cifra. */
  .summary dd:empty::before {
    content: "\00a0";
  }

  /* En una pantalla angosta, «Última revisión» y la fecha ocupan dos líneas cuando la
     fecha llega; se reservan desde el principio (2 × 1.6rem). */
  @media (width < 30rem) {
    .last-check {
      min-height: 3.2rem;
    }
  }

  /* El pie de página no tiene por qué verse mientras los datos llegan: con el contenido
     principal de al menos el alto de la ventana, la tabla que aparece ya no lo empuja
     dentro de la pantalla. align-content: start impide que la rejilla reparta ese alto
     de sobra entre sus renglones. */
  .layout {
    min-height: 100vh;
    align-content: start;
  }
}
```

Cada regra tem a sua história de medição. A do resumo foi testada primeiro como `min-height: 2rem` no `<dd>`, que parecia o óbvio, e piorou as coisas nas linhas compactas da lição 5: um `<dd>` vazio não tem linha de base, e a linha alinhada pela base (`align-items: baseline`) se acomodava de forma diferente do que com a cifra. Um espaço sem quebra (`\00a0`) gerado com `::before` tem, sim, linha de base, e o `<dd>` mede o mesmo vazio que cheio. Só é gerado enquanto o `<dd>` está vazio (`:empty`), e um espaço não é lido em voz alta. A regra do rodapé foi testada primeiro em `main`, e o salto piorou: a altura que sobrava era repartida entre as linhas da grade e movia as seções; `align-content: start` deixa tudo no alto. É a mesma ideia com que a lição 10 reservou a linha de cada erro de formulário, e o aviso da web.dev no seu guia de CLS vale aqui: reservar espaço é uma estimativa. Se o texto resulta mais longo, vai saltar um pouco; se mais curto, vai ficar um vazio. A decisão é de design: um vazio pequeno é melhor que um salto.

**O que não se fez, e por quê.** Não se minificou nada: o painel pesaria uns catorze quilobytes na rede com um servidor que comprima. Não se usou `loading="lazy"`: não há imagens; e quando houver, a imagem principal da página nunca deve levá-lo, porque atrasa o LCP. Não se usaram `async` nem `defer` no `<script>`: os módulos (`type="module"`) são adiados sozinhos. Cada uma dessas receitas é boa no seu lugar, e cada uma teria sido ruído aqui. Não otimizar o que já é bom faz parte da disciplina.

**O painel do Lighthouse.** Para fechar, o auditor. No Chrome: ferramentas do desenvolvedor, aba **Lighthouse**, “Analisar o carregamento da página”. A [documentação do Chrome](https://developer.chrome.com/docs/lighthouse/overview) lista hoje cinco grupos de verificações: desempenho, acessibilidade, boas práticas, SEO e um novo, “navegação por agentes” (*agentic browsing*), que mede quão fácil é para um programa automatizado entender e usar a página. Esse quinto grupo entrou na configuração de sempre na versão 13.3.0, de maio de 2026 ([notas da versão](https://github.com/GoogleChrome/lighthouse/releases/tag/v13.3.0)), e a sua própria [página de pontuação](https://developer.chrome.com/docs/lighthouse/agentic-browsing/scoring) adverte que é **experimental**, que se baseia em padrões ainda propostos e que não dá uma nota de 0 a 100, mas uma fração: quantas das suas verificações aplicáveis você passou. Sobre o painel terminado, o Lighthouse 13.5.0 o mostra como **2/2**: passam as duas que se aplicam (que a árvore de acessibilidade esteja bem formada e o CLS), e as outras cinco saem como “não se aplica”, porque revisam peças que o painel não tem (três sobre WebMCP, um arquivo `llms.txt` e um `ai-catalog.json`). Mesmo assim, aqui não é levado em conta: segue a regra do curso de não se apoiar no que ainda não é base. Para esta lição rodou-se o Lighthouse 13.5.0 a partir da sua linha de comando (você tem o mesmo motor no painel do Chrome, sem instalar nada) sobre o painel servido com os seus cabeçalhos, e deu 100 nas quatro categorias que, sim, são pontuadas de 0 a 100 —desempenho, acessibilidade, boas práticas e SEO—, com um LCP simulado de 1.4 s, um CLS de 0.001, um tempo total de bloqueio de 0 ms e 42 KiB no total. Esses 42 KiB não contradizem os catorze quilobytes de cima: o servidor Python **não comprime** (com `curl -sI -H "Accept-Encoding: gzip, br"` não aparece nenhum `Content-Encoding`), então o Lighthouse contou os 37.9 KB sem comprimir mais os cabeçalhos de cada resposta. Medido no Chrome sobre o mesmo servidor, o transferido soma 42,709 bytes, 41.7 KiB. O que o Lighthouse ainda assinalou, mesmo com 100, foi “Network dependency tree”: a cadeia de requisições que você vê na cascata. Um 100 e um aviso convivem bem; o aviso é informação, e o 100 não é uma meta.

### 11.4 Publicar um site estático

Um site estático é uma pasta de arquivos que um servidor entrega tal qual, sem executar nada da sua parte. É o que é o `revisor`: HTML, CSS, JavaScript que roda no navegador, e um JSON. “Publicar” é copiar essa pasta para um serviço que a serve pela internet com um endereço e, de preferência, com os seus cabeçalhos. Não há passo de construção, porque o painel nunca precisou dele.

**O que se publica.** O **conteúdo** de `revisor/` (não a pasta que o contém): `index.html` tem de ficar na raiz do site. Inclui `_headers`. Antes de enviá-lo, três revisões:

1. **Nada secreto.** O site será público; qualquer arquivo que você enviar pode ser lido por quem conhecer o endereço. No painel não há chaves, e a regra é que nunca haja.
2. **Os arquivos de testes.** `data/services-empty.json` e a tabela `CASES` de `js/main.js` existem para ver os estados do painel. Não prejudicam nada (a tabela é uma lista fechada que nunca usa o texto do endereço como endereço da requisição, como foi explicado na lição 9), mas decida se você quer um painel publicado com esse modo de testes ou sem ele.
3. **Os dados são de exemplo.** O `data/services.json` que você publica é o que qualquer um verá. Que um painel mostre serviços que não existem é legítimo para um exercício; diga isso no próprio site se o compartilhar.

**Onde.** Há várias opções gratuitas. Estas são as que foram consultadas para a lição, com o que as suas próprias páginas dizem, **em ordem de preferência**: as duas primeiras enviam os seus cabeçalhos; o GitHub Pages vai no final porque não o faz, e logo você verá o que perde por isso.

- **Cloudflare Pages.** Permite enviar uma pasta arrastando-a para o painel de controle (“Upload direto”: na seção Workers e Pages, “Create application”, “Get started”, “Drag and drop your files”; aceita uma pasta ou um zip), e deixa o site em `nome-do-projeto.pages.dev` ([guia](https://developers.cloudflare.com/pages/get-started/direct-upload/)). Lê `_headers` ([documentação](https://developers.cloudflare.com/pages/configuration/headers/)): até 100 regras, 2,000 caracteres por linha. A documentação consultada não diz expressamente se `_headers` é respeitado no upload direto; verifique com `curl`, como mais abaixo.
- **Netlify.** O “Netlify Drop” ([guia](https://docs.netlify.com/site-deploys/create-deploys/)) deixa arrastar uma pasta já construída e publicá-la sem conta e sem Git; o site anônimo é temporário, é preciso reivindicá-lo na primeira hora. Também lê `_headers` ([documentação](https://docs.netlify.com/manage/routing/headers/)).
- **GitHub Pages, a última opção.** Publica a partir de um repositório do GitHub, e somente de dois lugares de um ramo: a sua raiz (`/`) ou uma pasta chamada `/docs` ([documentação](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)); a outra via é um fluxo automatizado do GitHub Actions, que este curso não usa. Por isso o **conteúdo** de `revisor/` tem de ficar na raiz do repositório, não dentro de uma pasta `revisor/`. Com o plano gratuito, o repositório **tem de ser público** ([documentação](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)); as mudanças podem demorar até dez minutos para aparecer; e os seus [limites](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) incluem um site de 1 GB no máximo, um limite flexível de 100 GB de transferência por mês, e a proibição de usá-lo como hospedagem gratuita de um negócio. Como foi dito em 11.2, não há uma forma documentada de enviar cabeçalhos próprios; além disso, o GitHub Pages processa o site com o Jekyll, que por padrão [não publica os arquivos cujo nome começa com `_`](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll), então `_headers` nem sequer chega. Se você escolher o GitHub Pages, a CSP é você quem a põe: acrescente ao `<head>` de `index.html` a tag `<meta>` de 11.2 antes de enviá-lo.

**Por que o GitHub Pages fica no final: uma CSP mais fraca.** Pense na diferença entre uma regra que o servidor anuncia **antes** de entregar a página e uma nota escrita **dentro** da página. O cabeçalho chega primeiro, e o navegador o aplica a tudo; a tag `<meta>` só é lida quando o navegador já está lendo o HTML. Por isso a [especificação da CSP](https://www.w3.org/TR/CSP3/#meta-element) deixa fora da tag três diretivas: `frame-ancestors`, `sandbox` e `report-uri`, além de todo o modo somente-relatório. Para o painel, a perda que importa é a primeira: `frame-ancestors 'none'` é o que impede que outro site ponha a sua página dentro de um quadro (`<iframe>`) e a disfarce sob botões falsos para que alguém clique sem saber em quê (o [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors) diz expressamente que não funciona em `<meta>`). E a CSP não é a única coisa que viajava em `_headers`: `X-Content-Type-Options: nosniff` não tem versão em tag, então também se perde; `Referrer-Policy` tem, sim, `<meta name="referrer" content="no-referrer">` ([MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/referrer)), se você quiser conservá-la. Para um exercício com dados de exemplo, o risco é pequeno e publicar no GitHub Pages é legítimo; para um site de verdade, escolha um serviço que envie cabeçalhos.

Nenhuma das três precisa de Node nem de instalar nada, e as três servem para este exercício; o que não é secundário é o que vem a seguir.

**Publicar no GitHub Pages sem usar Git no terminal.** Na lição 1 você guardou registros com o Git no seu computador, mas o curso nunca lhe ensinou a enviá-los a um serviço como o GitHub, e para publicar não é preciso: o GitHub deixa enviar arquivos a partir do navegador. Se você escolher esta opção, são cinco passos, todos tomados da documentação do GitHub:

1. **Uma conta.** Se não tem, crie uma gratuita em `github.com`. O seu nome de usuário aparecerá no endereço do site.
2. **Um repositório público.** Acima à direita em qualquer página do GitHub, o botão **+** e depois **New repository**; dê-lhe um nome (por exemplo `revisor`), escolha a visibilidade **Public** e pressione **Create repository** ([documentação](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository)).
3. **Os arquivos.** Antes, acrescente ao seu `index.html` a tag `<meta>` da CSP (11.2). Depois, na página do repositório, **Add file** e depois **Upload files**, e arraste para a janela do navegador **o que há dentro** da sua pasta `revisor/` —`index.html`, `favicon.svg` e as pastas `css`, `js` e `data`—, não a pasta `revisor` em si: `index.html` tem de ficar na raiz. Escreva uma mensagem, como faria com `git commit`, e confirme ([documentação](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository); o navegador admite até 100 arquivos por vez e 25 MiB por arquivo, de sobra para o painel).
4. **Ligar o Pages.** No repositório, **Settings**, depois **Pages** na barra lateral; em “Build and deployment”, em **Source**, escolha **Deploy from a branch**, e no ramo escolha `main` e a pasta `/ (root)`; salve ([documentação](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)).
5. **O endereço.** Um site de um repositório fica em `https://<seu-usuario>.github.io/<repositorio>/` ([documentação](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages)), por exemplo `https://ana.github.io/revisor/`. Repare que o painel vive em uma **subpasta** do domínio, `/revisor/`. Funciona porque todas as rotas do painel são relativas (`css/styles.css`, `data/services.json`); uma rota que começasse com `/`, como `/css/styles.css`, procuraria na raiz do domínio e daria 404.

Se você já sabe usar `git push`, também serve, e o resultado é o mesmo; este curso não o ensina porque para publicar uma pasta você não precisa dele.

**Verificar o publicado.** A promessa de um serviço não é uma prova. Com o seu endereço já publicado (aqui `https://tu-sitio.example`), três verificações em um terminal:

```bash
curl -sI https://tu-sitio.example/ | grep -i -E "content-security|nosniff|referrer"
curl -sI -H "Accept-Encoding: gzip, br" https://tu-sitio.example/js/main.js | grep -i content-encoding
curl -s -o /dev/null -w "%{http_code}\n" https://tu-sitio.example/data/services.json
```

A primeira deve mostrar os seus três cabeçalhos; se não sai nenhum, o serviço não leu `_headers` e o seu site não tem a CSP, ainda que o arquivo esteja lá. No GitHub Pages não sairá nenhum, e é o esperado: ali a verificação é que o `index.html` publicado leve a tag `<meta>` (`curl -s https://tu-sitio.example/ | grep -i content-security`). A segunda diz se o serviço comprime as respostas de texto (deve aparecer `gzip` ou `br`). A terceira, `200`. Depois, abra o site no navegador com o console aberto e repita os cinco critérios da seção seguinte, agora sobre o endereço público. Uma rota que funcionava no seu computador pode quebrar ao publicar: ali se encontram as rotas absolutas escritas por engano e os nomes que só diferem em maiúsculas. No Linux Mint, `Main.js` e `main.js` são dois arquivos distintos, igual para o servidor, então esse erro você já teria visto no seu computador; mas no Windows e no macOS, cujos discos por padrão não distinguem maiúsculas de minúsculas ([Microsoft](https://learn.microsoft.com/en-us/windows/wsl/case-sensitivity), [Apple](https://support.apple.com/guide/disk-utility/file-system-formats-dsku19ed921c/mac)), um `<script src="js/Main.js">` funciona no computador e quebra ao publicar. Se mais alguém trabalha o painel a partir desses sistemas, aí está a causa.

**E o que não se publica.** O servidor Python com que você trabalhou (`python3 -m http.server`, e o `headers-server.py` desta lição) é uma ferramenta para desenvolver, não para servir ao público. Se você o liga sem `--bind 127.0.0.1`, ele escuta em todos os endereços do seu computador e qualquer um da sua rede pode ler a pasta a partir da qual você o lançou; a [documentação do Python](https://docs.python.org/3/library/http.server.html) adverte, além disso, que o módulo não é para produção e que só implementa verificações básicas de segurança. O nosso escuta somente em `127.0.0.1`, que é o endereço da sua própria máquina.

### 11.5 Os cinco critérios, um por um

Agora sim, o encerramento prometido. Para cada critério há um teste que você pode repetir e o resultado obtido ao preparar a lição, com o painel servido por `headers-server.py` e o console aberto, no Chrome 154. Se o seu resultado é diferente, o critério não está cumprido, e o curso não termina até que esteja.

**1. Navega-se completo com o teclado.** *Teste:* o percurso de 11.1, com o fragmento das paradas. *Resultado:* dezesseis paradas em uma ordem razoável, todas com `tabindex 0`, todas com contorno de foco visível (`outline` sólido de 3 px), e nenhuma armadilha: depois do último botão o foco volta ao início da página.

**2. Não há nem um erro no console.** *Teste:* recarregue o painel com o console aberto e percorra a lição 10 inteira (filtrar, ordenar, incluir, errar). *Resultado:* nenhuma mensagem, nem erro nem aviso, no percurso normal e em `?case=empty`, `?case=invalid` e `?case=timeout`. Uma exceção que você deve conhecer: `?case=error` pede um arquivo que não existe, e o navegador anota por conta própria “Failed to load resource: … 404”. É a requisição que você provocou de propósito e não um defeito do seu código; o critério é sobre o percurso normal. A única coisa que o sujou no caminho foi o ícone `data:,` ao ativar a CSP, e já foi corrigido (ver 11.2).

**3. Funciona a 320 px de largura.** *Teste:* a janela a 320 px (o modo de dispositivo das ferramentas) e a linha de 11.1. *Resultado:* `scrollWidth` e `clientWidth` valem 320 nas cinco situações: não há transbordamento.

**E se você passar a folha pelo validador.** Na lição 3 você adquiriu o costume de passar o seu `styles.css` pelo [validador de CSS do W3C](https://jigsaw.w3.org/css-validator/) antes de dar uma folha por boa, e convém mantê-lo. Com a folha terminada você verá algo que na lição 3 não saía: o validador responde com **dois erros**, “Property “container-type” doesn't exist” e “Unrecognized at-rule “@container””, além dos dois avisos de sempre sobre as variáveis. Assim respondeu ao enviar-lhe `revisor/css/styles.css` ao preparar a lição. Os dois erros vêm da consulta de contêiner que você acrescentou na lição 5, e não são erros da sua folha: as consultas de contêiner fazem parte da especificação [CSS Containment Module Level 3](https://www.w3.org/TR/css-contain-3/) e funcionam em todos os navegadores, como você viu na lição 5, mas o validador ainda não as reconhece. A regra prática: leia cada erro e decida; se o que ele marca é `container-type` ou `@container`, é uma limitação do validador e você o deixa. Qualquer outro erro, sim, se corrige, igual à lição 3.

**4. Mostra os três estados.** *Teste:* abra estes endereços sobre o painel publicado ou local.

| Endereço | Deve se ver |
|---|---|
| `/` | a tabela, “Mostrando 5 de 5 servicios.” |
| `/?case=empty` | “No hay servicios que revisar.”, sem tabela, com “Reintentar” e com o formulário para incluir o primeiro |
| `/?case=error` | “El servidor respondió con el código 404.”, com “Reintentar” |
| `/?case=timeout` | “Cargando servicios…” durante três segundos e depois “El servidor no respondió en 3000 ms.”, com “Reintentar”. No site publicado não há `?delay`, então ali a tabela carrega normal |

E para o estado “carregando”, que na sua máquina dura milissegundos, a aba Rede com um perfil lento, ou uma requisição que nunca responde. *Resultado:* os quatro endereços mostram o que diz a tabela, e com uma requisição de dados que não responde, “Cargando servicios…” aparece de imediato e, aos três segundos, o aviso diz “El servidor no respondió en 3000 ms.” com “Reintentar”.

**5. O texto que vem de fora é desenhado com `textContent`, nunca com `innerHTML`.** *Teste:* procure no seu código.

```bash
grep -n -E "innerHTML|outerHTML|insertAdjacentHTML|document\.write|eval\(" revisor/js/*.js
```

*Resultado:* nenhuma linha. E o teste funcional da lição 7 continua valendo: inclua um serviço chamado `<img src=x onerror=alert(1)>`; aparece como texto na tabela, tal qual, e não acontece mais nada. A CSP de 11.2 é o respaldo disto, não o seu substituto.

Cinco testes, cinco resultados. Se os cinco saem como acima no seu painel, o curso terminou. E para o critério 1 há uma segunda opinião automática: o axe-core 4.14.0 sobre as cinco situações do painel não encontrou nenhuma falha.

Este é o `index.html` terminado:

```html
<!-- revisor/index.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Revisor de servicios</title>
  <meta name="description" content="Panel que muestra el estado y el tiempo de respuesta de una lista de servicios.">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="css/styles.css">
  <link rel="modulepreload" href="js/state.js">
  <link rel="modulepreload" href="js/filters.js">
  <link rel="modulepreload" href="js/view.js">
  <link rel="modulepreload" href="js/stats.js">
  <link rel="modulepreload" href="js/load.js">
  <link rel="modulepreload" href="js/form.js">
  <script type="module" src="js/main.js"></script>
</head>
<body>
  <header class="page-header">
    <h1>Revisor de servicios</h1>
    <p class="last-check">Última revisión: <span id="checked-at">todavía no</span></p>
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

Em relação à lição 10, mudaram o `<head>` —a descrição da página, o ícone próprio e as seis linhas de `modulepreload`— e uma classe no cabeçalho, `last-check`, para reservar o seu espaço. O resto do `index.html`, os sete módulos e os dados são idênticos aos da lição 10, salvo a primeira linha, que no repositório diz onde vive cada arquivo; `css/styles.css` é o da lição 10 mais o bloco de 11.3.

## O erro que você vai ver

O da política que bloqueia o script em linha, que você já viu na figura 11.1. É a mensagem mais característica de uma CSP, e se lê em três tempos:

```text
Executing inline script violates the following Content Security Policy directive 'script-src 'self''. Either the 'unsafe-inline' keyword, a hash ('sha256-…'), or a nonce ('nonce-…') is required to enable inline execution. The action has been blocked.
```

*O que significa:* a página tentou executar um script que está escrito dentro do HTML, e a política (`script-src 'self'`) só admite scripts que sejam arquivos do mesmo site. *Como se conserta:* mova o código para um arquivo `.js` e carregue-o com `<script src="…">` ou, melhor, `<script type="module" src="…">`. As outras duas saídas que a mensagem nomeia —uma impressão digital ou um número de uso único— existem para casos especiais, e abrir tudo com `'unsafe-inline'` desfaz a proteção, então não é uma saída.

Uma variante, que aparece quando o código inline é um atributo (`onclick="…"` ou `onerror="…"`): a mensagem diz “Executing inline event handler violates…” e acrescenta uma nota: as impressões digitais não servem com os manipuladores de eventos. A saída correta é a mesma, `addEventListener` em um arquivo, e é a que o painel usa.

E mais uma, com uma causa distinta: se uma diretiva ausente cai em `default-src 'none'`, a mensagem diz: “Note that 'connect-src' was not explicitly set, so 'default-src' is used as a fallback”. Provoca-se no exercício 2.

## O que se faz errado

- **Copiar uma CSP da internet sem lê-la.** *Como se vê:* uma linha de duzentos caracteres com uma dúzia de domínios que o seu site nunca usa. *Custo:* cada domínio permitido é um lugar de onde se pode carregar código na sua página. Uma política é uma lista do que o seu site precisa, não do que outra pessoa usou.
- **`'unsafe-inline'` para que “pare de dar erros”.** *Como se vê:* um `script-src 'self' 'unsafe-inline'`. *Custo:* é abrir justamente o que a política fecha. Sem essa proteção, o cabeçalho fica de enfeite.
- **Acreditar que a CSP conserta o XSS.** *Como se vê:* “já tenho CSP, então posso usar `innerHTML`”. *Custo:* a figura 11.2 mostra: o HTML injetado fica na página. `textContent` é a defesa; a CSP, a segunda barreira.
- **Um site publicado sem verificar que os cabeçalhos chegaram.** *Como se vê:* o arquivo `_headers` está na pasta e ninguém fez `curl -I`. *Custo:* o serviço pode não lê-lo (ou lê-lo só em outro modo de envio); você tem uma política que existe no seu computador e não na internet.
- **Otimizar sem medir.** *Como se vê:* minificar, empacotar e adiar coisas porque “é o que se deve”. *Custo:* complexidade que você não comprou com nenhum número. Meça primeiro, mude uma coisa, meça de novo.
- **Medir só no seu computador.** *Como se vê:* “carrega em 70 milissegundos”. *Custo:* é a medida da máquina mais rápida e da rede mais curta que existe. Limite a rede nas ferramentas e olhe a cascata.
- **`loading="lazy"` na imagem principal.** *Como se vê:* uma receita de desempenho aplicada a todas as imagens. *Custo:* segundo a web.dev, piora o LCP, porque a imagem mais importante é pedida tarde. Só para as que estão fora da tela.
- **Servir ao público com `python3 -m http.server`, ou sem `--bind 127.0.0.1`.** *Como se vê:* ligar o servidor de desenvolvimento para que outros vejam a página. *Custo:* sem `--bind`, qualquer um na sua rede lê a pasta a partir da qual você o ligou; e em nenhum caso é um servidor feito para o público.
- **Enviar um arquivo com chaves para um site público.** *Como se vê:* um `.env`, uma chave em um `services.json`. *Custo:* a pasta inteira é legível por qualquer um com o endereço; e um segredo publicado deve ser dado por perdido, ainda que você o apague.

## Exercícios

### Exercício 1 — Ler uma política

Sem executar nada, diga o que faz cada uma destas duas políticas com o painel, e qual das duas lhe quebra algo: (a) `default-src 'self'`; (b) `default-src 'self'; script-src 'self' 'unsafe-inline'`. Depois, ponha a (a) no `_headers` do painel e abra-o: muda algo em relação à política do painel?

### Exercício 2 — Quebrar algo de propósito

Em uma cópia da pasta `revisor/`, tire `connect-src 'self';` do `_headers`, ligue `headers-server.py` sobre a cópia e abra o painel. Anote o que a pessoa vê na tela e o que o console diz. Depois conserte a política e verifique de novo.

### Exercício 3 — Medir você

Com o painel servido a partir do seu computador e um perfil de rede lento nas ferramentas do navegador, meça com o fragmento de 11.3 o CLS e o LCP do painel **sem** as seis linhas de `modulepreload` e **com** elas, três vezes cada um. Escreva no diário de bordo os seus seis números e uma frase: ajudou? quanto? Se não ajudou, escreva por que você acha que não.

## Soluções

**Exercício 1.** (a) Permite carregar qualquer coisa, mas somente do mesmo site, e como `default-src` é o valor de reserva, cobre scripts, estilos, imagens e conexões. Não bloqueia nada do que o painel faz: tudo vem da mesma origem. Muda somente no que **não** cobre: não inclui `form-action`, `base-uri` nem `frame-ancestors`, que não caem em `default-src`; isto é, é menos estrita que a do painel; com ela o painel se vê e funciona igual. (b) Parte do mesmo, mas com `'unsafe-inline'` em `script-src` permite scripts escritos dentro do HTML. Não quebra nada no painel, e é a pior das duas: fecha muito menos. A lição: uma política que “não quebra nada” não é por isso boa; é preciso olhar o que ela deixa aberto.

**Exercício 2.** Sem `connect-src`, a regra de reserva `default-src 'none'` bloqueia o `fetch`. A pessoa vê “No se pudo conectar con el servidor.” com o botão “Reintentar” (o painel trata a falha da rede como qualquer outra, e é uma boa razão pela qual `js/load.js` converte os erros em mensagens). O console diz, no Chrome 154: “Connecting to 'http://127.0.0.1:…/data/services.json' violates the following Content Security Policy directive: "default-src 'none'". Note that 'connect-src' was not explicitly set, so 'default-src' is used as a fallback. The action has been blocked.”, seguido de “Fetch API cannot load … Refused to connect because it violates the document's Content Security Policy”. Conserta-se devolvendo `connect-src 'self';`. O que se aprende: o painel degrada com elegância, mas a causa está no console, não na tela.

**Exercício 3.** Os números dependem da sua máquina; o que deve sair é a forma: com `modulepreload`, a requisição de `data/services.json` começa antes e a tabela aparece antes; o LCP, que é o título, quase não se move. Se você não vê diferença, não é um erro do exercício: com uma rede local rápida e sem limitar, a cascata é tão curta que não se nota. Limite a rede e tente de novo. Se o seu CLS já era 0 nos dois casos, isso também é um resultado: o salto que corrigimos aparece quando o resumo demora a chegar, então pode não ocorrer com uma rede rápida.

## Como sei que consegui

- [ ] `curl -sI http://127.0.0.1:8000/ | grep -i content-security`, com `headers-server.py revisor 8000` ligado, imprime a política da seção 11.2.
- [ ] A figura 11.1 (`fig11_01.html`) mostra “El script externo sí se ejecutó.” e o console traz a mensagem de “Executing inline script violates…”.
- [ ] A figura 11.2 mostra “Imágenes inyectadas: 1. Título de la página: La política no arregla el innerHTML” e o console traz “Executing inline event handler violates…”.
- [ ] Com o painel de `revisor/` servido com os seus cabeçalhos, o console está vazio no percurso normal.
- [ ] Os **cinco critérios** de 11.5 saem como descritos, cada um com o seu teste: dezesseis paradas de teclado, console vazio, 320 = 320, os quatro endereços com o seu aviso, e zero coincidências no `grep`.
- [ ] Você tem uma tabela própria com o peso do painel (`wc -c` e `gzip -9 -c … | wc -c`) e, pelo menos, o LCP e o CLS medidos com o fragmento do console.
- [ ] O painel está publicado em um endereço que não é `127.0.0.1`, e `curl -sI` sobre esse endereço mostra os três cabeçalhos (no GitHub Pages, em vez disso, o `index.html` publicado traz a tag `<meta>` da CSP). Se você não conseguiu publicá-lo, escreva no diário de bordo o que o impediu.

**Revisão de lições anteriores** (responda sem olhar, e depois verifique):

1. Na lição 1: por que um módulo de JavaScript não carrega se você abre o arquivo com `file://`, e o que você fez para evitá-lo?
2. Na lição 3: por que `* { box-sizing: border-box }` faz com que uma largura de 300 px seja 300 px ainda que haja preenchimento?
3. Na lição 7: por que `textContent` não executa um `<img onerror=…>`?
4. Na lição 10: qual é a diferença entre `:invalid` e `:user-invalid`?

Se alguma lhe escapou, anote-a no diário de bordo: o curso terminou, mas essa lista é o começo do que vem a seguir.

**E o que vem a seguir.** O painel que você construiu é refeito com tipos e com React no [curso de TypeScript](https://www.habil.mx/pt/cursos/typescript/) desta casa. Compare as duas versões: da comparação se aprende mais do que de começar outro projeto.

## Para ler mais

- [MDN — Content Security Policy (CSP)](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Guides/CSP): o guia completo, com as diretivas, o modo somente-relatório e a política estrita com `nonce`.
- [web.dev — Core Web Vitals](https://web.dev/articles/vitals): as três métricas, seus limites e a diferença entre laboratório e campo.
- [Documentação do Cloudflare Pages — Cabeçalhos personalizados](https://developers.cloudflare.com/pages/configuration/headers/): o arquivo `_headers` com a sua sintaxe e os seus limites.
- [W3C — Entender o WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/): cada critério de acessibilidade explicado, com as suas técnicas e as suas falhas típicas.
