# Lição 0 — Como a web funciona

**Tempo:** duas sessões de cerca de 90 min. Uma divisão que funciona: na primeira, “O porquê antes do como”, o endereço (0.1) e a conversa (0.2), com o terminal aberto para repetir cada `curl` e cada `dig`; na segunda, quem faz o quê (0.3) com a aba Rede, “O erro que você vai ver” e os exercícios. É uma lição de ler e observar, mas se lê com o terminal e o navegador ao lado, não de uma só vez.

**O que você constrói:** nada ainda; esta lição é de leitura e de observação. Você constrói o mapa mental que vai sustentar as outras onze.

**O que você aprende:** URL, DNS, HTTP, requisição e resposta; o que o navegador faz e o que o servidor faz; a aba Rede das ferramentas do navegador.

**As páginas desta lição.** A única página de exemplo, `fig00_01.html`, está em [`programas/00-como-funciona-la-web/`](https://github.com/HabilMX/curso-web/tree/main/programas/00-como-funciona-la-web) do [repositório do curso](https://github.com/HabilMX/curso-web). Você não precisa abri-la hoje: basta lê-la aqui, e na Lição 1 você vai aprender a servi-la a partir do seu computador.

## Ao terminar, você vai conseguir

- Decompor uma URL em esquema, host, porta, caminho, consulta e fragmento, e dizer qual dessas partes decide para qual máquina se liga e qual decide o que se pede a ela.
- Explicar o que o DNS faz, e distinguir o trabalho dele do trabalho do HTTP.
- Ler uma requisição e uma resposta HTTP —linha inicial, cabeçalhos, corpo— e dizer o que significa o código de status da resposta.
- Explicar por que uma única página são muitas requisições, e o que o navegador decide e o que o servidor decide em cada uma.
- Dizer qual parte do seu código roda na máquina de quem visita a página, e que consequência isso tem para a segurança.
- Abrir a aba Rede das ferramentas do navegador, encontrar a requisição principal de uma página e ler seu status, seu tipo, seu tamanho e seu tempo.
- Diante de uma falha, dizer em qual de três camadas ela ocorreu —o nome, a conexão ou a resposta— antes de mudar qualquer coisa.

## O porquê antes do como

Imagine a pessoa que opera os serviços de uma empresa. São sete da manhã, ela abre o painel do `revisor` —o projeto que você vai construir ao longo do curso— e vê uma linha que diz “carregando…” e não muda. O que aconteceu? Pode ser que a [conexão](https://developer.mozilla.org/pt-BR/docs/Glossary/TCP) dela com a internet tenha caído. Pode ser que o nome do servidor já não aponte para lugar nenhum. Pode ser que o servidor esteja ligado, mas aquele arquivo não exista mais. Pode ser que exista, mas o servidor leve meio minuto para entregá-lo. Ou pode ser que tudo tenha chegado bem e que o seu próprio código não saiba desenhá-lo. Cinco causas, um único sintoma, e a pessoa que olha para a tela não consegue distinguir uma da outra. Você vai conseguir, mas só se souber o que acontece entre o momento em que alguém digita um endereço e o momento em que vê a página.

Esse é o trabalho desta lição. Ela não escreve uma única linha do painel, e mesmo assim é a que mais erros vai poupar você de cometer. A maior parte do que mais desconcerta quem está começando —um `404`, uma [mensagem](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Guides/Messages) que fala de “[CORS](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Guides/CORS)”, uma página que aparece sem estilos, um módulo que não carrega, um dado que chega vazio— não são falhas da linguagem: são mal-entendidos sobre essa conversa. Quem não tem o mapa começa a mudar código ao acaso; quem o tem pergunta primeiro “em qual dos passos quebrou?” e quase sempre a resposta está à vista em menos de um minuto.

O mapa cabe em uma frase: **o [navegador](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work) pergunta, o servidor responde, e todo o resto é o detalhe de como as coisas são ditas.** É a mesma ideia com a qual a web nasceu: a [proposta que Tim Berners-Lee escreveu em 1989](https://www.w3.org/History/1989/proposal.html) descrevia documentos interligados que um programa pede a outro, e o [primeiro site da web](https://info.cern.ch/hypertext/WWW/TheProject.html), que o CERN conserva, ainda pode ser aberto e lido. Esta lição desenvolve esse detalhe em três peças, e cada uma traz seu exemplo real, medido em 7 de outubro de 2026 contra uma página pública que existe justamente para isso. Primeiro, o endereço: o que é uma [URL](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_URL) e como um nome como `example.com` se converte em uma máquina concreta. Segundo, a conversa: o que exatamente o [navegador](https://web.dev/articles/howbrowserswork) e o servidor dizem um ao outro, palavra por palavra. Terceiro, a divisão de tarefas: o que cada um faz, onde vive o seu código e como tudo isso se observa com a [aba Rede](https://firefox-source-docs.mozilla.org/devtools-user/network_monitor/index.html) do navegador.

Você não precisa instalar nada para acompanhá-la, exceto nos exercícios, que usam o navegador e o [terminal](https://missing.csail.mit.edu/). Como a lição mostra comandos de terminal desde a primeira seção, aqui vai o mínimo para lê-los; a [Lição 1](01-entorno-ciclo-trabajo.md) o desenvolve com calma:

- **O terminal** é uma janela onde, em vez de clicar, você digita comandos. No Linux Mint ele se abre com `Ctrl`+`Alt`+`T`.
- **O sinal `$` não se digita.** Nos blocos do curso, uma linha que começa com `$ ` é um comando que você digita *sem* esse sinal, e que termina pressionando `Enter`. As linhas que vêm depois, sem `$`, são o que o terminal responde: não se digitam, se leem.
- **Um comando é um programa seguido de opções.** Em `curl -I https://example.com`, `curl` é o programa (um que baixa endereços web), `-I` é uma opção (“mostre-me só os cabeçalhos”) e a URL é o que você pede a ele.
- **A barra vertical `|` conecta dois comandos**: o que o primeiro imprime entra no segundo em vez de sair na tela. Você verá `| head -3`, que deixa passar só as três primeiras linhas. No teclado latino-americano, a `|` fica na tecla à esquerda do `1`.
- **`/dev/null` é um arquivo especial do Linux que descarta tudo o que recebe.** Quando você vir `curl … -o /dev/null`, a opção `-o` (“guarde o conteúdo em…”) manda a página para essa lixeira, e na tela ficam só os avisos da conversa, que é o que queremos observar.

Se um comando responder `command not found`, esse programa não está instalado: a Lição 1 explica como se instala com `sudo apt install` e por que se escreve `sudo` antes. E se você não puder usar um terminal agora, não pare: leia as saídas que são mostradas, que são reais, e faça os exercícios de terminal quando tiver concluído a Lição 1.

Um último aviso de método. Nesta lição você vai ver muito texto cru: linhas que o navegador e o servidor trocam entre si, tal qual. Não é para memorizar. É para que você perca o medo de que a web seja uma caixa-preta: não é, é uma conversa em texto que se pode ler, e depois de lê-la uma vez, você não esquece mais que isso é possível.

## Os conceitos

São três, e um se apoia no outro. Leia-os em ordem.

### 0.1 O endereço: URL e DNS

#### Uma URL é um endereço com partes

Quando você digita algo na barra do navegador, ou clica em um link, o que você usa é uma **URL** (em inglês *Uniform Resource Locator*, localizador uniforme de recursos). Ela se parece com um endereço postal: não é um nome qualquer, tem partes, cada parte responde a uma pergunta diferente, e a ordem importa. Tomemos uma URL inventada, mas completa, dessas que o `revisor` poderia usar:

```text
https://example.com:8443/data/services.json?status=down&sort=name#row-3
```

Leia-a da esquerda para a direita e dê nome a cada pedaço:

| Parte | No exemplo | O que responde |
|---|---|---|
| **Esquema** | `https` | Em que língua conversamos? (o protocolo: HTTP, cifrado com [TLS](https://www.rfc-editor.org/rfc/rfc8446)) |
| **Host** (anfitrião) | `example.com` | Com qual máquina eu falo? |
| **Porta** | `8443` | Em qual das portas dessa máquina eu bato? |
| **Caminho** | `/data/services.json` | Que recurso eu peço? |
| **Consulta** | `?status=down&sort=name` | Com que condições, ou com que dados extras? |
| **Fragmento** | `#row-3` | Para qual parte do documento já recebido o navegador me leva? |

Essas partes estão definidas no padrão das URLs (o *[URL Standard](https://url.spec.whatwg.org/)* da WHATWG, a organização que mantém o [HTML](https://html.spec.whatwg.org/multipage/) e quase todo o ambiente do navegador) e, mais antigo e mais curto, na [RFC 3986](https://www.rfc-editor.org/rfc/rfc3986) da IETF. Se algum dia você precisar saber algo exato sobre elas —por exemplo, quais caracteres um caminho pode conter— a resposta está ali; você não precisa memorizá-las.

Há quatro detalhes que convém fixar desde já, porque cada um vai livrar você de um tropeço:

**A porta quase nunca se escreve.** Uma máquina pode escutar em milhares de “portas” numeradas ao mesmo tempo; cada serviço atende em uma. Por convenção, a web sem cifra usa a 80 e a [web cifrada](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts) usa a 443, e o navegador as supõe quando você não escreve nada. Por isso `https://example.com` e `https://example.com:443` são a mesma coisa. Quando, na Lição 1, você subir um servidor no seu computador, ele usará outra porta —a 8000— e então sim você terá de escrevê-la: `http://localhost:8000`.

**O fragmento não viaja.** Tudo o que está à esquerda do `#` é enviado ao servidor; o fragmento, não. Ele fica no navegador, que o usa para rolar você até a parte da página que tem esse identificador. É uma das confusões mais comuns de quem está começando: “mandei `#row-3` para o servidor e ele não recebeu”. É correto que não tenha recebido, e você vai comprovar isso com os seus próprios olhos na [aba Rede](https://developer.chrome.com/docs/devtools/network).

**O caminho não é uma pasta.** `/data/services.json` *parece* um caminho de pastas e, num servidor simples de arquivos como o que você vai usar, de fato coincide com um. Mas isso é uma decisão do servidor, não uma lei: há servidores em que `/users/42` não corresponde a nenhum arquivo e a resposta é calculada na hora. Para o navegador, o caminho é só um texto que ele entrega ao servidor para que decida o que responder. E uma convenção útil: quando o caminho termina em `/`, a maioria dos servidores de arquivos entrega o `index.html` dessa pasta. Por isso o endereço de uma página principal pode ser simplesmente `https://example.com/`.

**Maiúsculas e minúsculas não valem igual em todo lugar.** O host não distingue: `Example.COM` e `example.com` são o mesmo. O caminho, em contrapartida, costuma distinguir. O que no seu computador com Windows ou macOS funciona como `Logo.PNG`, num servidor Linux —que é onde quase sempre vive um site— pode dar “não encontrado” se o arquivo se chama `logo.png`. A regra do curso nasce daqui: **nomes de arquivo em minúsculas, sem espaços e sem acentos.**

Falando em espaços e acentos: uma URL só pode conter um conjunto reduzido de caracteres. Os demais se escrevem com **[codificação percentual](https://developer.mozilla.org/en-US/docs/Glossary/Percent-encoding)**: o caractere é convertido nos seus bytes (em [UTF-8](https://www.rfc-editor.org/rfc/rfc3629)) e cada byte se escreve como `%` mais dois algarismos hexadecimais. Um espaço é `%20`; o `ñ` são dois bytes, `%C3%B1`. Assim, um arquivo chamado `mi página.html` seria pedido como `mi%20p%C3%A1gina.html`. O navegador faz isso por você, mas no dia em que você vir essa “sopa de porcentagens” numa barra de endereços ou num registro do servidor, já saberá do que se trata, e já saberá por que é melhor não pôr espaços nem acentos nos seus arquivos.

#### URLs absolutas e relativas

Até aqui vimos uma URL inteira. Mas numa página você quase nunca escreve o endereço completo de cada arquivo. Você escreve algo como `css/estilo.css`, e o navegador o completa tomando como base o endereço da página em que está. Isso é uma **URL relativa**, e você vai usá-la em todas as lições que vêm a seguir, então vale a pena ver como ela se resolve. Suponha que a página atual seja `http://localhost:8000/panel/index.html`:

| O que você escreve | Como se lê | Resultado |
|---|---|---|
| `estilo.css` | mesma pasta da página | `http://localhost:8000/panel/estilo.css` |
| `css/estilo.css` | uma subpasta da pasta atual | `http://localhost:8000/panel/css/estilo.css` |
| `../estilo.css` | subir uma pasta | `http://localhost:8000/estilo.css` |
| `/estilo.css` | a partir da raiz do site, não importa onde você esteja | `http://localhost:8000/estilo.css` |

A diferença entre `css/estilo.css` (sem barra inicial) e `/css/estilo.css` (com barra inicial) é a causa de muitos “na minha máquina aparece”. A primeira depende de onde está a página; a segunda, não. Neste curso vamos preferir as relativas sem barra inicial para os arquivos próprios, porque assim o projeto pode ser movido de pasta sem quebrar.

#### O DNS: o diretório que converte nomes em endereços

Você já sabe ler uma URL. Falta [resolver](https://www.rfc-editor.org/rfc/rfc9499) um problema que talvez você não tivesse notado: os computadores não se encontram por nome. Encontram-se por **[endereço IP](https://developer.mozilla.org/pt-BR/docs/Glossary/IP_Address)**, que é um número. Um endereço IPv4 são quatro números entre 0 e 255 separados por pontos (`104.20.23.154`); um IPv6 é mais longo e se escreve em hexadecimal, e existe porque os endereços IPv4 acabaram. Um humano lembra de `example.com`; a rede precisa do número. Entre os dois está o **[DNS](https://www.rfc-editor.org/rfc/rfc1034)** (*Domain Name System*, sistema de [nomes de domínio](https://www.rfc-editor.org/rfc/rfc1035)), que é, simplificando muito, uma lista telefônica distribuída: você lhe dá um nome e ele devolve um ou vários endereços.

“Distribuído” é a palavra importante. Não existe um diretório central único que alguém tenha de manter: seria um gargalo e um ponto único de falha. O [DNS](https://developer.mozilla.org/en-US/docs/Glossary/DNS) é uma hierarquia. O nome `example.com` se lê da direita para a esquerda: o ponto final (que quase sempre se omite) é a **raiz**; `com` é o domínio de nível superior; `example` é um domínio dentro de `com`. Cada nível é administrado por alguém diferente, e cada administrador só sabe a quem perguntar pelo nível de baixo. Assim funciona a consulta completa, que, na prática, é feita no seu lugar:

1. Seu computador pergunta ao seu **resolvedor**: um servidor DNS que a sua rede lhe atribuiu (o do seu provedor, o da sua empresa) ou que você mesmo escolheu. Se o resolvedor já tem a resposta guardada, responde de imediato e acabou.
2. Se não, o resolvedor pergunta a um **servidor raiz**. A raiz não sabe onde está `example.com`, mas sabe quem administra `com`, e diz a quem perguntar.
3. O resolvedor pergunta aos servidores de `com`. Eles também não sabem o endereço final, mas sabem quem administra `example.com`, e dizem.
4. O resolvedor pergunta aos **servidores autoritativos** de `example.com`: os que têm a resposta de verdade. Esses respondem com os endereços.
5. O resolvedor os entrega ao seu computador e os guarda por um tempo, caso alguém volte a pedi-los.

Isso pode ser visto. Com a ferramenta `dig` (no Mint se instala com `sudo apt install bind9-dnsutils`) você pergunta pelos registros do tipo `A`, que são os que associam um nome a um endereço IPv4. Esta é a saída real que obtive em 7 de outubro de 2026:

```bash
$ dig example.com +noall +answer
example.com.		240	IN	A	172.66.147.243
example.com.		240	IN	A	104.20.23.154
```

Cada linha diz: o nome, o **TTL** (*time to live*, tempo de vida) em segundos, a classe (`IN`, de internet), o tipo de registro (`A`) e o endereço. Duas observações. Primeira: há dois endereços para um único nome; é normal, os serviços grandes repartem a carga entre várias máquinas. Segunda: o TTL de 240 significa “você pode guardar esta resposta por quatro minutos antes de voltar a perguntar”. Essa memória é o que torna o DNS rápido, e também é a razão pela qual uma mudança de endereço não é vista no mundo todo ao mesmo tempo: alguns resolvedores ainda têm a resposta velha guardada. Quando, na Lição 11, você publicar o seu site, vai se lembrar deste parágrafo.

Se você perguntar pelos servidores da zona `com`, a resposta mostra a hierarquia em ação:

```bash
$ dig +short NS com | head -3
g.gtld-servers.net.
f.gtld-servers.net.
m.gtld-servers.net.
```

(São treze nomes, de `a.gtld-servers.net` a `m.gtld-servers.net`; na prática cada um é, na verdade, uma frota de máquinas espalhadas pelo mundo.) Seu computador nunca precisa saber isso; o resolvedor, sim.

Duas precisões para você não se confundir depois. **O DNS não é a web:** o correio eletrônico também o usa, e quase tudo o que usa a internet. Ele faz uma única coisa —nome para endereço— e não sabe nada de páginas. E **`localhost` é um nome especial**: está [reservado](https://www.iana.org/domains/reserved) para significar “este mesmo computador” e se resolve sem sair dele, para os endereços de *loopback* (laço local): `127.0.0.1` em IPv4 e `::1` em IPv6. O padrão que o reserva é a [RFC 6761](https://www.rfc-editor.org/rfc/rfc6761). Que sejam dois importa em um detalhe da Lição 1: se um programa escuta só em um deles, o navegador que não obtém resposta no outro tenta também ali. Quando o seu navegador abrir `http://localhost:8000`, não haverá viagem pela internet: ele falará com um programa que roda na sua própria máquina.

Uma nota de privacidade, só isso. Por tradição, as consultas DNS viajam sem cifra, de modo que quem está no caminho pode saber quais nomes você consulta. Existe uma variante cifrada, DNS sobre HTTPS ([RFC 8484](https://www.rfc-editor.org/rfc/rfc8484)), que alguns navegadores ativam. Ela não muda nada do que você aprende aqui; só convém saber que a privacidade do nome e a privacidade da página são duas coisas diferentes.

### 0.2 A conversa: HTTP

#### Do nome à conexão

Com o endereço IP em mãos, o navegador abre uma **conexão** com essa máquina, na porta indicada. Ele o faz com o [TCP](https://www.rfc-editor.org/rfc/rfc9293), um protocolo cujo trabalho é fazer dois computadores combinarem de conversar e garantir que o que um envia chegue completo e em ordem. Começa com uma breve troca de três mensagens (o “aperto de mão em três vias”) e, a partir daí, há um canal aberto.

Se o esquema é `https`, antes de dizer qualquer coisa interessante se faz um segundo cumprimento, desta vez para cifrar o canal: o navegador e o servidor negociam uma chave secreta e o servidor apresenta a sua **credencial TLS**: um documento digital, assinado por uma autoridade em que o seu navegador confia, que demonstra que ele é de verdade o dono do nome que diz ser. Essa é a parte “S” do HTTPS (seguro), e quem a realiza é um protocolo chamado [TLS](https://developer.mozilla.org/en-US/docs/Web/Security/Transport_Layer_Security). Você pode vê-la na saída de `curl -v`, uma ferramenta que baixa uma URL e conta o que faz:

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

Cada linha conta um passo que você acabou de aprender: o nome foi resolvido (DNS), o primeiro endereço foi testado (conexão), o TLS 1.3 foi negociado (cifra) e a credencial do servidor foi verificada (`verify ok`). (Cortei a saída para que caiba; a completa traz também as linhas do cumprimento e da requisição. Medi com o `curl` 8.7.1 no macOS; o `curl` do Linux Mint 22, o 8.5.0, usa outra biblioteca de cifra, então algumas linhas —sobretudo a que nomeia o algoritmo depois de `TLSv1.3`— são redigidas de outro jeito. Os passos são os mesmos.) Tudo isso ocorreu *antes* de a página ser pedida.

Convém fixar o que o cadeado do HTTPS lhe dá e o que não lhe dá. **Dá** três coisas: confidencialidade (quem está no caminho não pode ler o que você pede nem o que recebe), integridade (ninguém pode modificar isso sem que se perceba) e autenticidade (você está falando com o titular do nome que foi verificado). **Não dá** nenhuma garantia sobre as intenções desse titular: uma página de golpe pode ter um cadeado perfeitamente válido. E também não oculta *com quem* você fala: quem está no caminho pode saber que você se conectou a `example.com`, embora não saiba que página você pediu nem o que recebeu.

#### A requisição e a resposta

Com o canal aberto começa o HTTP (*HyperText Transfer Protocol*, protocolo de transferência de hipertexto), que é um esquema de pergunta e resposta: **o cliente envia uma requisição, o servidor devolve uma resposta, e aí termina a troca.** O servidor nunca inicia uma conversa por conta própria; só responde. Essa assimetria é a coluna vertebral da web.

O espantoso é como é simples. Na versão 1.1, a requisição é texto que você pode ler. Esta é a que o [`curl`](https://curl.se/docs/manpage.html) mandou a `example.com`, forçando essa versão com `--http1.1` para poder vê-la às claras:

```http
GET / HTTP/1.1
Host: example.com
User-Agent: curl/8.7.1
Accept: */*

```

E esta é a resposta, também medida em 7 de outubro de 2026 (a parte dos [cabeçalhos](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Reference/Headers); o corpo vemos logo em seguida):

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

As duas mensagens têm a mesma forma de três partes, que é a forma de toda mensagem em HTTP/1.1 (as versões mais novas, que você verá logo mais, levam as mesmas partes empacotadas de outra maneira):

1. **A linha inicial.** Na requisição se chama *linha de requisição* e leva três palavras: o **método** ([`GET`](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Reference/Methods), “dê-me”), o **alvo** (`/`, o caminho que você viu na URL) e a **versão** do protocolo. Na resposta se chama *linha de status* e leva a versão, o **[código de status](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Reference/Status)** (`200`) e uma frase curta (`OK`) que é só para um humano ler.
2. **Os cabeçalhos.** Linhas da forma `Nome: valor`, uma por linha. São metadados: informação *sobre* a requisição ou a resposta, não o conteúdo em si.
3. **Uma linha em branco** e, depois, **o corpo**: o conteúdo (numa requisição `GET` quase sempre não há; na resposta, aqui, é o HTML da página).

Essa linha em branco é a que separa os cabeçalhos do corpo. Um detalhe técnico que explica por que a requisição de cima termina com uma linha vazia.

Agora os cabeçalhos que apareceram, para que não sejam um texto opaco. Da requisição: [`Host`](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Reference/Headers/Host) diz a qual nome a requisição se dirige. Parece redundante —já nos conectamos ao endereço— mas uma única máquina pode servir centenas de sites, e é o `Host` que diz a ela qual deles você quer. `User-Agent` se apresenta (aqui, [`curl`](https://curl.se/docs/tutorial.html), com a versão da máquina onde medi; o seu dirá a sua; o seu navegador põe uma cadeia longa com o nome e a versão dele). `Accept` diz que tipos de conteúdo são aceitos (`*/*`: qualquer um). Da resposta: `Date` é a hora do servidor. [`Content-Type`](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Reference/Headers/Content-Type) é **o mais importante para você**, e vamos retomá-lo abaixo. `Server` identifica o programa que respondeu. `last-modified` é quando o recurso mudou pela última vez. `allow` lista os [métodos](https://www.iana.org/assignments/http-methods/http-methods.xhtml) que esse recurso aceita. `Age` diz quantos segundos essa cópia está guardada em um [cache](https://www.rfc-editor.org/rfc/rfc9111) intermediário, e `alt-svc` avisa que o mesmo servidor também fala HTTP/3. O resto (`Transfer-Encoding`, `Connection`, `Accept-Ranges`) são detalhes de como se transmite e você ainda não precisa deles. Você também verá cabeçalhos com prefixos do provedor, como `cf-cache-status`: são extras que a infraestrutura de quem serve a página acrescenta, não fazem parte do protocolo.

E o corpo dessa resposta é, simplesmente, um arquivo HTML:

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

(O segundo bloco é o que você veria na tela ao carregar a página; o significado de cada tag vemos na Lição 2. Por ora basta ver que é só texto.) Se um servidor servisse esse arquivo, a resposta completa seria esta, com as quebras de linha que o protocolo marca:

```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Length: 290

<!-- fig00_01.html -->
<!DOCTYPE html>
...
```

`Content-Length` diz quantos bytes o corpo mede, para que o navegador saiba quando terminou; 290 é o que esse arquivo mede. Não é uma resposta que tenhamos capturado de um servidor real —é a que um produziria—, e na Lição 1 você verá uma autêntica, do seu próprio servidor.

Um esclarecimento que vai evitar uma confusão. Se você tirar do `curl` a opção `--http1.1` e pedir só os cabeçalhos (`-I`), a resposta começa diferente. Isto é o que deu em 7 de outubro de 2026 (cortado nas primeiras linhas):

```bash
$ curl -I https://example.com
HTTP/2 200
date: Wed, 07 Oct 2026 20:42:08 GMT
content-type: text/html; charset=utf-8
server: cloudflare
```

Por padrão, o `curl` e o servidor combinaram `HTTP/2 200`, não `HTTP/1.1 200 OK`, e os nomes dos cabeçalhos chegam em minúsculas. O HTTP tem [versões](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Evolution_of_HTTP). A 1.1 ([RFC 9112](https://www.rfc-editor.org/rfc/rfc9112)) é a de texto que você acabou de ler. A 2 ([RFC 9113](https://www.rfc-editor.org/rfc/rfc9113)) e a 3 ([RFC 9114](https://www.rfc-editor.org/rfc/rfc9114), sobre um transporte diferente chamado QUIC, [RFC 9000](https://www.rfc-editor.org/rfc/rfc9000)) enviam o mesmo em formato binário —e com os cabeçalhos comprimidos—, mais eficiente e que já não se pode ler a olho nu. **O que muda é a embalagem; o significado —métodos, [códigos de status](https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml), cabeçalhos— é o mesmo nas três** e está definido uma única vez, na RFC 9110. Por isso aprender a forma em texto não é um exercício de nostalgia: é aprender o idioma, com a vantagem de que se lê. Você verá que o servidor do seu computador responde com `HTTP/1.0` ([RFC 1945](https://www.rfc-editor.org/rfc/rfc1945)), uma versão ainda mais antiga: serve para um servidor de prática e, mais uma vez, o significado não muda.

#### Os métodos: o que se pede ao servidor

O método é o verbo da requisição. Os que importam neste curso são poucos:

| Método | Para quê | Muda algo no servidor? |
|---|---|---|
| `GET` | pedir um recurso | não |
| `POST` | enviar dados para que o servidor os processe (criar algo, por exemplo) | normalmente sim |
| `PUT` | substituir um recurso pelo que você envia | sim |
| `DELETE` | apagar um recurso | sim |
| `HEAD` | igual a `GET`, mas sem o corpo: só os cabeçalhos | não |

A RFC 9110 dá a eles duas propriedades com nomes precisos. Um método é **seguro** quando não pretende mudar nada no servidor: `GET` e `HEAD` são, e por isso o navegador pode repeti-los, pré-carregá-los ou guardá-los sem medo. Um método é **[idempotente](https://developer.mozilla.org/pt-BR/docs/Glossary/Idempotent)** quando repeti-lo dá o mesmo resultado que fazê-lo uma vez: `PUT` e `DELETE` são (apagar duas vezes a mesma coisa deixa o mesmo mundo que apagá-la uma), `POST` não é (enviar duas vezes um pedido pode criar dois pedidos). Essa diferença explica por que, se você recarrega uma página que resultou de um `POST`, o navegador avisa antes de reenviar. Por ora, tudo o que você precisa é: **carregar uma página é um `GET`**, e a Lição 10 usará `GET` e `POST` a partir dos formulários.

#### Os códigos de status: quem tem o problema

Os códigos de status são três algarismos, e o primeiro já diz quase tudo: a família.

| Família | Significa | Os que você vai ver |
|---|---|---|
| **1xx** | informativo, a conversa continua | quase nunca |
| **2xx** | sucesso | `200 OK`, `201 Created`, `204 No Content` |
| **3xx** | [redirecionamento](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Guides/Redirections): o que você procura está em outro lugar | `301` e `302` (outro endereço), `304 Not Modified` (use a sua cópia) |
| **4xx** | erro **do cliente**: a requisição não é válida ou não pode ser atendida | `400`, `401`, `403`, `404 Not Found`, `429 Too Many Requests` |
| **5xx** | erro **do servidor**: a requisição era válida, mas falhou ao ser atendida | `500`, `502 Bad Gateway`, `503 Service Unavailable`, `504 Gateway Timeout` |

A distinção 4xx / 5xx vale ouro para depurar porque indica por onde começar a procurar: um `404` diz “não encontrei o que você pediu” (ou, às vezes, “não vou lhe dizer se existe”); um `500` diz “topei com um problema inesperado do meu lado ao atender você”. Nem sempre é tão limpo —um servidor mal programado pode responder `500` a uma requisição que de fato estava errada—, mas como primeira pista quase nunca falha. Quando o painel `revisor` pintar uma linha de vermelho porque um serviço respondeu `503`, estará traduzindo exatamente este vocabulário, e a coluna de estado dele nasce daqui. A lista oficial completa vive em um registro da IANA, que é a autoridade que atribui esses números.

Dois avisos que se pagam caro mais adiante. **Um `404` é uma resposta correta e completa.** O servidor respondeu, com um corpo (normalmente uma página que diz “não encontrado”) e tudo; simplesmente a resposta é “não tenho isso”. Do ponto de vista do navegador, a conversa correu bem. Isso vai importar na Lição 8, porque a função [`fetch`](https://fetch.spec.whatwg.org/) do JavaScript trata um `404` como uma conversa que *correu bem* e não como um erro: cabe a você olhar o status. Segundo aviso: **a família 2xx diz que o servidor atendeu a requisição, não que o resultado seja o que você esperava.** Um `200` com um corpo que diz “erro” (existe, e é uma má prática) é um `200`.

#### Content-Type: como o navegador decide o que fazer com o que recebe

Volte ao cabeçalho `Content-Type: text/html; charset=utf-8`. Ele diz duas coisas: o tipo do conteúdo (`text/html`, um **tipo [MIME](https://www.iana.org/assignments/media-types/media-types.xhtml)**, formado por um tipo e um subtipo) e a codificação dos caracteres (`utf-8`, que é a que permite escrever “ñ” e “á”). **O navegador decide o que fazer com um arquivo, antes de tudo, por este cabeçalho, não pela extensão do nome.** Se o servidor diz `text/html`, ele o interpreta como página; se diz `text/plain`, mostra como texto sem interpretá-lo, mesmo que se chame `index.html`; se diz `text/css`, trata como estilos; se diz `text/javascript`, como um programa; se diz `application/json`, como dados. Há uma nuance: quando o cabeçalho falta ou é duvidoso, o navegador às vezes “fareja” os primeiros bytes para adivinhar o tipo (o [padrão que regula isso](https://mimesniff.spec.whatwg.org/) chama de *MIME sniffing*). Para o que mais importa a você no curso, ele não adivinha: um módulo de JavaScript ou uma folha de estilo com o tipo errado simplesmente não são usados.

Os tipos que você vai ver neste curso são poucos e convém reconhecê-los:

| Tipo [MIME](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Guides/MIME_types) | O que é | Lição |
|---|---|---|
| `text/html` | um documento HTML | 2 |
| `text/css` | uma folha de estilo | 3 |
| `text/javascript` | um programa (a [RFC 9239](https://www.rfc-editor.org/rfc/rfc9239) fixou este nome como o oficial) | 6 |
| `application/json` | dados em JSON | 8 |
| `image/png`, `image/svg+xml` | imagens | 11 |

Você verá que este cabeçalho é o protagonista de uma das falhas mais desconcertantes da Lição 1: quando o servidor responde “não encontrado” com uma página HTML em vez do módulo de JavaScript que você esperava, o navegador reclama de ter recebido o tipo errado. Você já saberá por quê.

#### A memória da web: sem estado, com cache

O HTTP não tem memória. Cada requisição é independente: o servidor não sabe, por si só, que você é a mesma pessoa que dois segundos atrás pediu outra coisa. Diz-se que é um protocolo **sem estado**. Quando um site precisa se lembrar de você (que você já fez login, por exemplo), faz isso com um truque em cima do HTTP: entrega a você uma pequena peça de informação chamada *[cookie](https://www.rfc-editor.org/rfc/rfc6265)* (por meio do cabeçalho `Set-Cookie`, que o [MDN explica com exemplos](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Guides/Cookies)) e o seu navegador a devolve nas requisições seguintes a esse site, enquanto ela estiver vigente (o próprio cookie traz regras que limitam a que domínio e a que caminhos ele acompanha). O nosso `revisor` não precisa dele; mencionamos para que você saiba que existe e que a “memória” não está no protocolo, e sim colocada por cima.

O que vai afetar o seu dia a dia é o **[cache](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Guides/Caching)**. Para não baixar a mesma coisa mil vezes, o navegador guarda cópias das respostas e, segundo os cabeçalhos, decide se pode reutilizá-las sem perguntar ou se deve perguntar “mudou desde a última vez?”. Se a cópia ainda está vigente, o navegador a usa sem perguntar nada. Se já venceu, pergunta, e se o arquivo não mudou, o servidor responde `304 Not Modified` sem corpo e o navegador volta a usar a sua ([RFC 9111](https://www.rfc-editor.org/rfc/rfc9111#section-4.3)). É uma ótima ideia para o visitante e uma armadilha para quem programa: você edita um arquivo, recarrega, e vê a versão de dez minutos atrás. A aba Rede tem uma caixa de seleção para desativá-lo enquanto você trabalha, e você vai precisar dela desde a Lição 1.

### 0.3 Quem faz o quê: o navegador, o servidor e o seu código

#### O servidor: um programa que escuta

Um **servidor** não é uma máquina especial com aspecto diferente: é um programa que está escutando numa porta, esperando requisições, e que sabe respondê-las. Um servidor web pode fazer duas classes de coisa. No caso simples, **lê um arquivo do disco e o envia tal qual**: você pede `/data/services.json` e ele manda o arquivo que está nesse caminho. A isso se chama servir conteúdo **estático**, e é o que fará o servidor de prática do seu computador, e também o site que você publicará na Lição 11. No caso complexo, **executa um programa a cada requisição** —consulta um banco de dados, calcula, monta a resposta— e então o conteúdo é **dinâmico**. Este curso só precisa do primeiro: o painel lê um arquivo JSON do próprio projeto, então não há nada a programar do lado do servidor.

Guarde isto: o servidor *não sabe nada da sua tela*. Não sabe quão larga ela é, se há um leitor de tela, se o seu código falhou. Só responde requisições. E, no caso estático, tampouco executa o seu JavaScript: ele o entrega.

#### O navegador: faz muito mais do que mostrar

O navegador é o **cliente**, e seu nome técnico, *agente de usuário*, descreve bem o seu papel: ele age em nome da pessoa. Seu trabalho, desde que você digita a URL até ver algo, é esta cadeia (descrita em detalhe na documentação do MDN e no artigo clássico do web.dev sobre como os navegadores funcionam):

1. **Resolve o nome e abre a conexão** (o que vimos em 0.1 e 0.2).
2. **Pede o documento principal** com um `GET`. Recebe o HTML.
3. **Lê-o e constrói o [DOM](https://dom.spec.whatwg.org/)**, o *Document Object Model*: uma representação em forma de árvore da página, com um nó para cada tag. É a árvore sobre a qual o seu JavaScript vai trabalhar (Lição 7).
4. **Descobre o que mais precisa.** Enquanto lê o HTML, encontra referências a outros arquivos: uma folha de estilo com `<link>`, um programa com `<script>`, uma imagem com `<img>`. **Cada uma é outra requisição**, com seu próprio caminho e seu próprio `GET`, que o navegador costuma disparar em paralelo.
5. **Aplica os estilos** e calcula a geometria: quanto mede cada coisa e onde ela vai.
6. **Executa o JavaScript**, que pode modificar a árvore e fazer ainda mais requisições (quando, na Lição 8, você usar `fetch`, será exatamente isso).
7. **Pinta** o resultado na tela.

Desenhado como uma linha do tempo para a página mínima de cima, mais uma folha de estilo e um programa, fica assim:

```text
tiempo →
navegador:  GET /index.html ─────────┐
servidor:                            └─ 200, HTML ──┐
navegador:                                          ├─ GET /css/main.css ─┐
                                                    ├─ GET /js/main.js  ──┤
servidor:                                           │                     └─ 200, 200
navegador:                                                                  construye, aplica, ejecuta y pinta
```

A consequência prática é fundamental: **uma página não é um download, são vários**, e cada um pode dar certo ou errado separadamente. Uma página que “aparece sem estilos” não é um mistério de CSS; é, quase sempre, que a requisição da folha de estilo devolveu um `404`, porque o caminho está mal escrito. E você vai ver isso com os seus olhos daqui a pouco.

#### As três linguagens, e de quem é cada uma

Agora se entende por que a web é construída com três linguagens e não com uma. O **HTML** descreve o conteúdo e o seu significado: isto é um título, isto é uma tabela, isto é um botão. O **CSS** descreve a apresentação: cores, tamanhos, como se organiza. O **JavaScript** descreve o comportamento: o que acontece quando alguém clica, como os dados são pedidos e desenhados. O normal é que cada um viaje como um arquivo diferente, com seu próprio tipo MIME, e que o navegador os junte (também se pode escrever CSS e JavaScript dentro do próprio HTML, com as tags `<style>` e `<script>`, e então eles viajam dentro dele). A ordem em que você vai aprendê-los —HTML, CSS, JavaScript— é também a ordem de dependência: uma página deve fazer sentido só com HTML, melhorar com CSS e tornar-se interativa com JavaScript. É a ideia do *aprimoramento progressivo*, que o livro *Resilient Web Design*, de Jeremy Keith, desenvolve com mais calma e que vale a pena como leitura complementar.

#### O que chega ao navegador pertence a quem o recebe

Aqui há uma ideia que este curso vai repetir com insistência, então é melhor entendê-la em sua [origem](https://www.rfc-editor.org/rfc/rfc6454). O HTML, o CSS e o JavaScript viajam até a máquina da pessoa que visita a página, e ali são executados. **Tudo o que você entrega ao navegador é legível e modificável por quem o recebe.** Qualquer um pode abrir “Exibir código-fonte”, ler o seu JavaScript, mudar valores a partir das ferramentas do navegador, ou nem sequer usar o navegador e mandar à mão a requisição que quiser. Disso decorrem duas regras que serão costumes ao longo de todo o curso:

- **Nada que deva permanecer secreto pode viver no código que você manda ao navegador.** Uma senha, uma chave de serviço, um dado privado: se está ali, já foi publicado.
- **Nada do que volta do navegador, ou vem de fora, é confiável.** Uma validação feita no navegador melhora a experiência, mas não protege nada: quem quiser contorná-la, contorna. E um texto que vem de fora, como o nome de um serviço, deve ser tratado sempre como texto e nunca como código. Na Lição 7 você verá o que acontece se não for assim (chama-se XSS) e por que a propriedade `textContent` é a defesa.

A segurança da web não é um tema que se acrescenta no final: vem dessa divisão de papéis. Quem sabe onde roda o seu código sabe também o que pode garantir.

#### A origem: quem pode ler o quê de quem

Existe uma regra que o navegador aplica pela sua segurança e que mais de uma vez vai lhe parecer um incômodo: a **política de [mesma origem](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)**. Uma **[origem](https://developer.mozilla.org/pt-BR/docs/Glossary/Origin)** é a combinação de esquema, host e porta. Uma página só pode ler livremente respostas da mesma origem que ela; ler as de outra origem requer permissão explícita do outro servidor (essa permissão se chama CORS e a estudamos na Lição 9). Compare:

| Endereço | Mesma origem que `https://example.com/`? | Por quê |
|---|---|---|
| `https://example.com/otra/ruta` | sim | esquema, host e porta coincidem; o caminho não conta |
| `http://example.com/` | não | o esquema muda |
| `https://www.example.com/` | não | o host muda |
| `https://example.com:8443/` | não | a porta muda |

Há um caso especial que vai morder você na Lição 1: uma página aberta diretamente de um arquivo (`file:///home/ana/revisor/index.html`) não tem uma origem utilizável; os navegadores atribuem a ela uma “opaca” e por isso a proíbem de fazer coisas que a uma página servida por HTTP são permitidas. A solução é a que você já intui: servir o seu projeto com um servidor local, ainda que mínimo.

#### A aba Rede: ver a conversa

Tudo o que foi dito antes pode ser visto, não apenas acreditado. As **ferramentas do navegador** (em inglês *DevTools*) se abrem com a tecla `F12`, ou com `Ctrl`+`Shift`+`I`, e trazem várias abas. A que nos interessa hoje é **Rede** (*Network*), que registra cada requisição que a página faz. No Firefox, o navegador que vem com o Linux Mint, ela também se abre com `Ctrl`+`Shift`+`E`; nos navegadores baseados em Chromium, tem o mesmo nome e está no mesmo menu.

Três regras de uso, que poupam os primeiros tropeços:

1. **Abra-a antes de carregar a página.** A aba registra enquanto está aberta; o que ocorreu antes não aparece. Abra as ferramentas, entre na aba Rede, e *então* recarregue com `F5`.
2. **Olhe as colunas.** Cada requisição é uma linha. As que importam: **Status** (o código: `200`, `404`…), **Método** (`GET`), **Domínio** e **Arquivo** (a quem e o que se pediu), **Tipo** (o tipo MIME, o `Content-Type` que vimos), **Transferido** e **Tamanho** (quantos bytes viajaram e quanto pesa já descomprimido) e **Tempo** (quanto demorou).
3. **Clique em uma linha.** Abre-se um painel com os **cabeçalhos** da requisição e da resposta, tal como os vimos escritos acima, além do corpo e do detalhamento dos tempos.

Com isso em mãos, a página de exemplo `https://example.com` é um bom primeiro laboratório: é minúscula e seu conteúdo foi pensado para ser inócuo. Quando a escrevi, em 7 de outubro de 2026, essa página pedia duas coisas: o documento HTML e um pequeno programa (`/s.js`) que ela mesma referencia; se hoje você vir algo diferente, a tarefa é a mesma. Na linha do documento você verá `GET`, o domínio, `200`, tipo `html`, e, no painel de cabeçalhos, as mesmas linhas que o `curl` mostrou.

E aqui se fecha o fio com o projeto. A coluna **Tempo** é a ideia que o `revisor` vai mostrar para cada serviço: quanto passou entre a requisição sair e a resposta chegar. E a coluna **Status** é a que decidirá se uma linha do painel diz “no ar” ou “fora do ar”. O `revisor` é, em pequeno, esta aba Rede transformada em produto: uma lista de requisições a serviços, cada uma com seu estado e seu tempo de resposta. Por isso começamos aqui.

## O erro que você vai ver

Esta lição se aprende quebrando coisas de propósito, porque as falhas da web têm três formas claras e reconhecê-las é a habilidade central. Provoque-as você mesmo; nenhuma oferece risco.

**Primeira forma: o nome não se resolve (falha do DNS).** Peça um endereço que não existe. O domínio `.invalid` está reservado justamente para isso ([RFC 2606](https://www.rfc-editor.org/rfc/rfc2606)): nunca vai existir.

```bash
$ curl -sS https://nombre-que-no-existe.invalid
curl: (6) Could not resolve host: nombre-que-no-existe.invalid
```

O navegador mostra algo equivalente: “Não foi possível encontrar o servidor” ou “Hmm. We're having trouble finding that site”. O número entre parênteses é o código de saída do `curl` (o 6 significa “não foi possível resolver o nome”). **O que significa:** a falha ocorreu *antes* de conectar com quem quer que fosse, na consulta DNS. O nome está mal escrito, ou não existe, ou o seu resolvedor não responde. **Como se resolve:** confira a ortografia do nome, e se o nome estiver correto, confira a sua conexão com a internet.

**Segunda forma: ninguém atende nessa porta (falha da conexão).** Peça algo ao seu próprio computador onde não há nenhum servidor.

```bash
$ curl -sS http://localhost:8000
curl: (7) Failed to connect to localhost port 8000 after 0 ms: Couldn't connect to server
```

O navegador diz “Não foi possível conectar” ou `ERR_CONNECTION_REFUSED`. **O que significa:** o nome foi resolvido e a máquina existe, mas nenhum programa escuta nessa porta. **Como se resolve:** o servidor está desligado, ou escuta em outra porta; inicie-o, ou corrija o número. Repare na diferença para o caso anterior: aqui sim havia um endereço a que chegar.

**Terceira forma: houve resposta e é uma má notícia (falha de HTTP).** Peça um recurso que não existe num servidor que existe.

```bash
$ curl -sI https://example.com/nada.html | head -1
HTTP/2 404 
```

**O que significa:** todo o caminho funcionou —nome, conexão, cifra, requisição—, o servidor entendeu e respondeu que não tem esse recurso. **Como se resolve:** o caminho está mal escrito, ou o arquivo não está onde você diz. No navegador, abra `https://example.com/nada.html` e olhe a aba Rede: você verá uma linha com status `404` e, apesar disso, uma página desenhada na tela. Essa é a prova do que dissemos antes: um `404` é uma resposta.

Com essas três formas você pode ordenar qualquer sintoma em um mapa de três camadas, que é a ferramenta de depuração mais útil desta lição:

| Até onde chegou a conversa? | Camada | Sintoma típico | O que conferir |
|---|---|---|---|
| O nome não foi resolvido | **Nome** (DNS) | `Could not resolve host`, “servidor não encontrado” | ortografia, conexão, resolvedor |
| Foi resolvido, mas ninguém responde na porta | **Conexão** (TCP/TLS) | `Failed to connect`, `ERR_CONNECTION_REFUSED`, credencial TLS inválida ou vencida | que o servidor esteja ligado, porta, validade da credencial TLS |
| Houve resposta com código 4xx ou 5xx | **Resposta** (HTTP) | `404`, `500`, `503` | caminho, permissões, estado do servidor |

Antes de mudar uma linha de código, pergunte a si mesmo em qual linha você está.

## O que se faz errado

**Dizer “o servidor caiu” diante de qualquer falha.** Um `404`, um tempo esgotado, uma credencial TLS vencida e um nome mal escrito são quatro problemas diferentes com quatro soluções diferentes. Custo: horas procurando no lugar errado. Correção: olhe primeiro o código de status e a camada (a tabela de cima).

**Escrever os arquivos com maiúsculas, espaços ou acentos.** `Logo Principal.PNG` funciona no seu computador e quebra no servidor Linux onde você vai publicar. Custo: um `404` que só aparece ao publicar, o pior momento. Correção: minúsculas, hifens em vez de espaços, sem acentos: `logo-principal.png`.

**Confiar no cadeado como se fosse um selo de qualidade.** O HTTPS diz que o canal é privado e que o nome é autêntico, não que o site seja honesto nem que esteja livre de erros. Custo: acreditar num site por um sinal que não prometia isso. Correção: HTTPS é necessário, nunca suficiente.

**Esconder algo no código do navegador.** Uma chave “ofuscada” em JavaScript continua estando na máquina de qualquer pessoa que abra a página. Custo: um vazamento que não se pode retirar. Correção: o que é secreto vive num servidor, nunca no que se envia ao navegador.

**Depurar recarregando.** Recarregar dez vezes “para ver se agora vai” sem abrir a aba Rede é adivinhar. Custo: tempo, e a tentação de mudar código que não estava errado. Correção: abra a aba Rede, recarregue, e leia qual requisição falhou e com que status.

**Não saber qual versão do arquivo você está vendo.** O cache entrega a cópia velha enquanto você edita a nova. Custo: depurar um problema que você já resolveu. Correção: durante o desenvolvimento, com as ferramentas abertas, marque “Desativar cache” na aba Rede.

## Exercícios

Os dois primeiros usam lápis e o terminal; o terceiro, o navegador; o quarto junta tudo.

### Exercício 1 — Parta a URL

Escreva numa folha as partes destas três URLs (esquema, host, porta —ainda que não esteja escrita—, caminho, consulta, fragmento) e responda: quais duas compartilham origem?

1. `https://example.com/data/services.json?status=down#row-3`
2. `http://localhost:8000/index.html`
3. `https://example.com:443/css/main.css`

### Exercício 2 — Leia uma conversa com `curl`

Com o `curl` instalado (se não, `sudo apt install curl`), execute `curl -I https://example.com` e `curl -v https://example.com -o /dev/null`. Responda por escrito: (a) que versão de HTTP e que código de status foram devolvidos? (b) qual é o `Content-Type`? (c) que versão de TLS foi negociada? (d) quantos endereços IP o nome resolveu?

### Exercício 3 — Conte as requisições de uma página

Abra o Firefox, abra as ferramentas (`F12`), vá à aba **Rede** e *depois* digite `https://example.com`. (a) Quantas linhas aparecem? (b) Para a primeira: método, status, tipo, tamanho. (c) Marque “Desativar cache”, recarregue com `F5` e compare a coluna Transferido com o carregamento anterior. (d) Agora visite `https://example.com/nada.html`: que status tem a linha e por que uma página aparece apesar disso?

### Exercício 4 — Classifique os sintomas

Para cada sintoma, diga em que camada ocorreu (nome, conexão ou resposta) e o que você conferiria primeiro: (a) `curl: (7) Failed to connect to localhost port 8000`; (b) a página aparece, mas sem nenhum estilo, e na aba Rede a folha de estilo tem status `404`; (c) `curl: (6) Could not resolve host`; (d) o navegador mostra uma página “502 Bad Gateway”; (e) você abre o painel a partir de um arquivo e um módulo de JavaScript não carrega (dica: pense na origem).

## Soluções

### Exercício 1 — Parta a URL

1. Esquema `https`; host `example.com`; porta 443 (a que o navegador supõe para `https`); caminho `/data/services.json`; consulta `?status=down`; fragmento `#row-3`.
2. Esquema `http`; host `localhost`; porta `8000`; caminho `/index.html`; sem consulta nem fragmento.
3. Esquema `https`; host `example.com`; porta `443` (escrita, embora seja a que já se supunha); caminho `/css/main.css`; sem consulta nem fragmento.

A 1 e a 3 compartilham origem: mesmo esquema (`https`), mesmo host (`example.com`) e mesma porta (443 em ambas, escrita ou não). Que tenham caminhos diferentes não conta. A 2 muda de esquema, de host e de porta.

### Exercício 2 — Leia uma conversa com `curl`

Os valores deste exemplo são os que obtive em 7 de outubro de 2026; os seus podem diferir no que for variável (datas, endereços), não na forma.

(a) `HTTP/2 200`: versão 2 do protocolo, código `200` (sucesso). (b) `text/html; charset=utf-8`. (c) `TLSv1.3`, na linha `SSL connection using TLSv1.3 …`. (d) Dois: `104.20.23.154` e `172.66.147.243` (linha `IPv4:` da saída). Se na sua saída o protocolo é `HTTP/1.1`, o seu `curl` negociou a versão anterior e está igualmente correto: o significado não muda.

### Exercício 3 — Conte as requisições de uma página

(a) Duas ao escrever isto (o documento e o programa `/s.js`); se hoje há outro número, anote o que você vê. (b) `GET`, `200`, tipo `html`, um tamanho de algumas centenas de bytes. (c) Com o cache desativado, a coluna Transferido mostra o tamanho real baixado a cada recarga; com o cache ativo pode aparecer “em cache” ou um valor menor ou nulo, porque o navegador reutilizou a sua cópia. (d) Status `404`: o servidor respondeu que não tem esse recurso, mas a resposta dele inclui uma página que diz justamente isso, e o navegador a desenha. A conversa correu bem; o recurso não existe.

### Exercício 4 — Classifique os sintomas

(a) **Conexão.** O nome foi resolvido e a máquina existe, mas ninguém escuta na porta 8000: confira que o servidor esteja ligado e que seja essa a porta. (b) **Resposta**, numa requisição secundária: o documento principal deu certo e a folha de estilo devolveu `404`; confira o caminho do `<link>` e as maiúsculas do nome do arquivo. (c) **Nome.** Nem houve conexão: confira a ortografia do host e a sua conexão. (d) **Resposta**: um código 5xx. Respondeu um servidor intermediário (um *gateway* ou *proxy*), que passou a sua requisição ao servidor real e recebeu dele uma resposta inválida ([RFC 9110 §15.6.3](https://www.rfc-editor.org/rfc/rfc9110#section-15.6.3)). Se o servidor real simplesmente não tivesse respondido a tempo, o código seria outro: `504 Gateway Timeout`. Não é algo que você resolva na sua página: informa-se a quem administra o serviço. (e) **Origem:** o navegador não deixa uma página de `file://` carregar módulos porque sua origem é opaca; a solução, que você verá na Lição 1, é servir a pasta por HTTP.

## Como sei que consegui

Esta lição é de compreensão, e isso também pode ser medido. Você está pronto para a próxima quando:

- `curl -I https://example.com` imprime para você na primeira linha um `HTTP/2 200` (ou `HTTP/1.1 200 OK`) e você sabe explicar cada palavra dessa linha.
- Você consegue pegar uma URL qualquer e apontar seu esquema, host, porta, caminho, consulta e fragmento sem ajuda, e sabe qual deles não viaja ao servidor.
- Você abriu a aba Rede **antes** de carregar uma página, encontrou a requisição principal e leu seu status, seu tipo e seu tempo.
- Diante dos três erros da seção “O erro que você vai ver”, você diz a camada correta sem consultar a tabela.
- Você consegue explicar com suas palavras, em duas frases, por que “carregar uma página” são várias requisições e por que o que você entrega ao navegador não pode ser secreto.

Se alguma das cinco não der certo, volte à subseção correspondente; são as bases das onze lições que vêm a seguir. E anote no [diário de bordo](https://github.com/HabilMX/curso-web/blob/main/pt/bitacora.md) o que foi difícil para você: é a parte do curso que só você lê.

## Para ler mais

- [Como a web funciona, do MDN](https://developer.mozilla.org/pt-BR/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works) — a mesma história contada por quem mantém a documentação da plataforma, com mais imagens.
- [Visão geral do HTTP, do MDN](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Guides/Overview) — o próximo passo se você quiser ver o HTTP mais a fundo, incluindo os cabeçalhos que aqui só nomeamos.
- [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110) — a definição oficial de métodos, códigos e cabeçalhos; é uma referência, se consulta, não se lê de uma vez.
- [Resilient Web Design, de Jeremy Keith](https://resilientwebdesign.com/) — a história e a filosofia da web, e a origem da ideia de construir por camadas.
