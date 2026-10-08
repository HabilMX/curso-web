# Lesson 0 — How the web works

**Time:** two sessions of about 90 minutes. A split that works: the first one, “The why before the how”, the address (0.1) and the conversation (0.2), with the terminal open to repeat every `curl` and every `dig`; the second one, who does what (0.3) with the Network tab, “The error you will see” and the exercises. It is a lesson for reading and looking, but you read it with the terminal and the browser next to you, not straight through.

**What you build:** nothing yet; this lesson is for reading and looking. You build the mental map that will hold up the other eleven.

**What you learn:** URL, DNS, HTTP, request and response; what the browser does and what the server does; the Network tab of the browser's developer tools.

**The pages of this lesson.** The only example page, `fig00_01.html`, is in [`programas/00-como-funciona-la-web/`](https://github.com/HabilMX/curso-web/tree/main/programas/00-como-funciona-la-web) of the [course repository](https://github.com/HabilMX/curso-web). You do not need to open it today: reading it here is enough, and in Lesson 1 you will learn to serve it from your own computer.

## By the end you will be able to

- Break a URL down into scheme, host, port, path, query and fragment, and say which of those parts decides which machine gets called and which decides what is asked of it.
- Explain what DNS does, and tell its job apart from the job of HTTP.
- Read an HTTP request and response —start line, headers, body— and say what the response's status code means.
- Explain why a single page is many requests, and what the browser decides and what the server decides in each one.
- Say which part of your code runs on the machine of whoever visits the page, and what consequence that has for security.
- Open the Network tab of the browser's developer tools, find a page's main request and read its status, its type, its size and its time.
- When something fails, say which of three layers it happened in —the name, the connection or the response— before changing anything.

## The why before the how

Picture the person who operates a company's services. It is seven in the morning, they open the `revisor` dashboard —the project you will build throughout the course— and see a row that says “cargando…” (loading…) and does not change. What happened? Maybe their internet [connection](https://developer.mozilla.org/en-US/docs/Glossary/TCP) went down. Maybe the server's name no longer points anywhere. Maybe the server is on but that file no longer exists. Maybe it exists, but the server takes half a minute to deliver it. Or maybe everything arrived fine and your own code does not know how to draw it. Five causes, one symptom, and the person looking at the screen cannot tell one from another. You will be able to, but only if you know what happens between the moment someone types an address and the moment they see the page.

That is the work of this lesson. It writes not a single line of the dashboard, and even so it is the one that will save you the most errors. Most of what bewilders beginners most —a `404`, a [message](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages) that talks about “[CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)”, a page that shows up without styles, a module that does not load, a piece of data that arrives empty— are not failures of the language: they are misunderstandings about this conversation. Whoever lacks the map starts changing code at random; whoever has it asks first “in which of the steps did it break?” and almost always the answer is in plain sight in under a minute.

The map fits in one sentence: **the [browser](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work) asks, the server answers, and everything else is the detail of how things get said.** It is the same idea the web was born with: the [proposal Tim Berners-Lee wrote in 1989](https://www.w3.org/History/1989/proposal.html) described linked documents that one program asks of another, and the [first website](https://info.cern.ch/hypertext/WWW/TheProject.html), which CERN preserves, can still be opened and read. This lesson develops that detail in three pieces, and each comes with its real example, measured on October 7, 2026 against a public page that exists for exactly that. First, the address: what a [URL](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_URL) is and how a name like `example.com` becomes a specific machine. Second, the conversation: what exactly the [browser](https://web.dev/articles/howbrowserswork) and the server say to each other, word for word. Third, the division of labor: what each one does, where your code lives and how all of this is looked at with the browser's [Network tab](https://firefox-source-docs.mozilla.org/devtools-user/network_monitor/index.html).

You do not need to install anything to follow it, except for the exercises, which use the browser and the [terminal](https://missing.csail.mit.edu/). Since the lesson shows you terminal commands from the very first section, here is the minimum to read them; [Lesson 1](01-entorno-ciclo-trabajo.md) develops it calmly:

- **The terminal** is a window where, instead of clicking, you type commands. On Linux Mint it opens with `Ctrl`+`Alt`+`T`.
- **The `$` sign is not typed.** In the course's blocks, a line that starts with `$ ` is a command that you type *without* that sign, and finish by pressing `Enter`. The lines that follow it, without `$`, are what the terminal answers: they are not typed, they are read.
- **A command is a program followed by options.** In `curl -I https://example.com`, `curl` is the program (one that downloads web addresses), `-I` is an option (“show me only the headers”) and the URL is what you ask for.
- **The vertical bar `|` connects two commands**: what the first prints goes into the second instead of going to the screen. You will see `| head -3`, which lets only the first three lines through. On a Latin American keyboard, the `|` is on the key to the left of the `1`.
- **`/dev/null` is a special Linux file that discards everything it receives.** When you see `curl … -o /dev/null`, the `-o` option (“save the content in…”) sends the page to that dump, and on the screen only the notices about the conversation remain, which is what we want to look at.

If a command answers `command not found`, that program is not installed: Lesson 1 explains how it is installed with `sudo apt install` and why `sudo` is written in front. And if you cannot use a terminal right now, do not stop: read the outputs that are shown, which are real, and do the terminal exercises when you have finished Lesson 1.

One last note on method. In this lesson you will see a lot of raw text: lines that the browser and the server exchange, just as they are. It is not meant to be memorized. It is so that you lose the fear that the web is a black box: it is not, it is a conversation in text that can be read, and once you have read it once, you do not forget that it can be.

## The concepts

There are three, and they lean on one another. Read them in order.

### 0.1 The address: URL and DNS

#### A URL is an address with parts

When you type something in the browser's bar, or click a link, what you use is a **URL** (*Uniform Resource Locator*). It resembles a postal address: it is not just any name, it has parts, each part answers a different question, and the order matters. Let us take an invented but complete URL, the kind the `revisor` might use:

```text
https://example.com:8443/data/services.json?status=down&sort=name#row-3
```

Read it from left to right and name each piece:

| Part | In the example | What it answers |
|---|---|---|
| **Scheme** | `https` | In what language do we talk? (the protocol: HTTP, encrypted with [TLS](https://www.rfc-editor.org/rfc/rfc8446)) |
| **Host** | `example.com` | Which machine do I talk to? |
| **Port** | `8443` | Which of that machine's doors do I knock on? |
| **Path** | `/data/services.json` | Which resource do I ask for? |
| **Query** | `?status=down&sort=name` | With what conditions, or with what extra data? |
| **Fragment** | `#row-3` | Which part of the already received document does the browser take me to? |

These parts are defined in the URL standard (WHATWG's *[URL Standard](https://url.spec.whatwg.org/)*, the organization that maintains [HTML](https://html.spec.whatwg.org/multipage/) and nearly the whole browser environment) and, older and shorter, in the IETF's [RFC 3986](https://www.rfc-editor.org/rfc/rfc3986). If you ever need to know something exact about them —for example, which characters a path may contain— the answer is there; you do not have to memorize them.

There are four details worth pinning down now because each will save you from a stumble:

**The port is almost never written.** A machine can listen on thousands of numbered “doors” at once; each service answers on one. By convention, the unencrypted web uses 80 and the [encrypted web](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts) uses 443, and the browser assumes them when you write nothing. That is why `https://example.com` and `https://example.com:443` are the same. When in Lesson 1 you start a server on your computer, it will use another door —8000— and then you will have to write it: `http://localhost:8000`.

**The fragment does not travel.** Everything to the left of the `#` is sent to the server; the fragment is not. It stays in the browser, which uses it to scroll you to the part of the page that has that identifier. It is one of the most common confusions for beginners: “I sent the server `#row-3` and it did not receive it”. It is correct that it did not receive it, and you will check this with your own eyes in the [Network tab](https://developer.chrome.com/docs/devtools/network).

**The path is not a folder.** `/data/services.json` *looks like* a path of folders and, on a simple file server like the one you will use, it does in fact match one. But that is a decision of the server, not a law: there are servers where `/users/42` corresponds to no file at all and the response is computed on the spot. For the browser, the path is just a text it hands to the server so the server decides what to answer. And a useful convention: when the path ends in `/`, most file servers deliver that folder's `index.html`. That is why a main page's address can simply be `https://example.com/`.

**Uppercase and lowercase are not equal everywhere.** The host does not distinguish: `Example.COM` and `example.com` are the same. The path, on the other hand, usually does. What works on your Windows or macOS computer as `Logo.PNG` may give “not found” on a Linux server —which is where a site almost always lives— if the file is called `logo.png`. The course's rule is born here: **file names in lowercase, with no spaces and no accents.**

Speaking of spaces and accents: a URL can only contain a reduced set of characters. The rest are written with **[percent-encoding](https://developer.mozilla.org/en-US/docs/Glossary/Percent-encoding)**: the character is turned into its bytes (in [UTF-8](https://www.rfc-editor.org/rfc/rfc3629)) and each byte is written as `%` plus two hexadecimal digits. A space is `%20`; the `ñ` is two bytes, `%C3%B1`. So a file called `mi página.html` would be requested as `mi%20p%C3%A1gina.html`. The browser does it for you, but the day you see that “percent soup” in an address bar or in a server log, you will know what it is, and you will know why it is better not to put spaces or accents in your files.

#### Absolute and relative URLs

So far we have seen a whole URL. But in a page you almost never write the complete address of each file. You write something like `css/estilo.css`, and the browser completes it taking as a base the address of the page it is on. That is a **relative URL**, and you will use it in every lesson that follows, so it is worth seeing how it is resolved. Suppose the current page is `http://localhost:8000/panel/index.html`:

| What you write | How it reads | Result |
|---|---|---|
| `estilo.css` | same folder as the page | `http://localhost:8000/panel/estilo.css` |
| `css/estilo.css` | a subfolder of the current folder | `http://localhost:8000/panel/css/estilo.css` |
| `../estilo.css` | go up one folder | `http://localhost:8000/estilo.css` |
| `/estilo.css` | from the site's root, no matter where you are | `http://localhost:8000/estilo.css` |

The difference between `css/estilo.css` (no leading slash) and `/css/estilo.css` (with a leading slash) is the cause of many “it looks fine on my machine”. The first depends on where the page is; the second does not. In this course we will prefer relative URLs without a leading slash for our own files, because that way the project can be moved to another folder without breaking.

#### DNS: the directory that turns names into addresses

You already know how to read a URL. What is left is to [resolve](https://www.rfc-editor.org/rfc/rfc9499) a problem you may not have noticed: computers do not find each other by name. They find each other by **[IP address](https://developer.mozilla.org/en-US/docs/Glossary/IP_Address)**, which is a number. An IPv4 address is four numbers between 0 and 255 separated by dots (`104.20.23.154`); an IPv6 one is longer and is written in hexadecimal, and it exists because IPv4 addresses ran out. A human remembers `example.com`; the network needs the number. Between the two sits **[DNS](https://www.rfc-editor.org/rfc/rfc1034)** (*Domain Name System*, the system of [domain names](https://www.rfc-editor.org/rfc/rfc1035)), which is, simplifying a lot, a distributed phone book: you give it a name and it gives you back one or several addresses.

“Distributed” is the important word. There is no single central directory that someone has to maintain: it would be a bottleneck and a single point of failure. [DNS](https://developer.mozilla.org/en-US/docs/Glossary/DNS) is a hierarchy. The name `example.com` is read from right to left: the final dot (which is almost always omitted) is the **root**; `com` is the top-level domain; `example` is a domain inside `com`. Each level is administered by someone different, and each administrator only knows whom to ask about the level below. This is how the complete lookup works, which in practice is done for you:

1. Your computer asks its **resolver**: a DNS server that your network assigned to it (your provider's, your company's) or that you chose. If the resolver already has the answer stored, it answers immediately and that is the end of it.
2. If not, the resolver asks a **root server**. The root does not know where `example.com` is, but it knows who administers `com`, and tells it whom to ask.
3. The resolver asks the `com` servers. They do not know the final address either, but they do know who administers `example.com`, and they say so.
4. The resolver asks the **authoritative servers** of `example.com`: the ones that have the real answer. Those answer with the addresses.
5. The resolver hands them to your computer and keeps them for a while in case someone asks for them again.

This can be seen. With the `dig` tool (on Mint it is installed with `sudo apt install bind9-dnsutils`) you ask for the records of type `A`, which are the ones that associate a name with an IPv4 address. This is the real output I got on October 7, 2026:

```bash
$ dig example.com +noall +answer
example.com.		240	IN	A	172.66.147.243
example.com.		240	IN	A	104.20.23.154
```

Each row says: the name, the **TTL** (*time to live*) in seconds, the class (`IN`, for internet), the record type (`A`) and the address. Two observations. First: there are two addresses for a single name; that is normal, big services spread the load across several machines. Second: the TTL of 240 means “you may keep this answer for four minutes before asking again”. That memory is what makes DNS fast, and it is also the reason a change of address is not seen all over the world at the same time: some resolvers still have the old answer stored. When you publish your site in Lesson 11, you will remember this paragraph.

If you ask for the servers of the `com` zone, the answer shows the hierarchy in action:

```bash
$ dig +short NS com | head -3
g.gtld-servers.net.
f.gtld-servers.net.
m.gtld-servers.net.
```

(There are thirteen names, from `a.gtld-servers.net` to `m.gtld-servers.net`; in practice each one is actually a fleet of machines spread around the world.) Your computer never needs to know this; the resolver does.

Two clarifications so you do not get confused later. **DNS is not the web:** email also uses it, and almost everything that uses the internet. It does a single thing —name to address— and knows nothing about pages. And **`localhost` is a special name**: it is [reserved](https://www.iana.org/domains/reserved) to mean “this very computer” and it is resolved without leaving it, to the *loopback* addresses: `127.0.0.1` in IPv4 and `::1` in IPv6. The standard that reserves it is [RFC 6761](https://www.rfc-editor.org/rfc/rfc6761). That there are two matters in a detail of Lesson 1: if a program listens on only one of them, a browser that gets no answer on the other tries that one too. When your browser opens `http://localhost:8000`, there will be no trip across the internet: it will talk to a program running on your own machine.

A privacy note, nothing more. By tradition DNS queries travel unencrypted, so whoever is along the way can find out which names you look up. There is an encrypted variant, DNS over HTTPS ([RFC 8484](https://www.rfc-editor.org/rfc/rfc8484)), which some browsers turn on. It changes nothing of what you learn here; you just should know that the privacy of the name and the privacy of the page are two different things.

### 0.2 The conversation: HTTP

#### From the name to the connection

With the IP address in hand, the browser opens a **connection** with that machine, at the indicated door. It does so with [TCP](https://www.rfc-editor.org/rfc/rfc9293), a protocol whose job is for two computers to agree to talk and to guarantee that what one sends arrives complete and in order. It starts with a brief exchange of three messages (the “three-way handshake”) and from then on there is an open channel.

If the scheme is `https`, before saying anything interesting a second handshake takes place, this time to encrypt the channel: the browser and the server negotiate a secret key and the server presents its **TLS certificate**: a digital document, signed by an authority your browser trusts, that proves it is truly the owner of the name it claims to be. That is the “S” part of HTTPS (secure), and it is done by a protocol called [TLS](https://developer.mozilla.org/en-US/docs/Web/Security/Transport_Layer_Security). You can see it in the output of `curl -v`, a tool that downloads a URL and tells you what it is doing:

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

Each line tells a step you have just learned: the name was resolved (DNS), the first address was tried (connection), TLS 1.3 was negotiated (encryption) and the server's certificate was checked (`verify ok`). (I trimmed the output to make it fit; the complete one also includes the handshake and request lines. I measured it with `curl` 8.7.1 on macOS; the `curl` of Linux Mint 22, version 8.5.0, uses a different encryption library, so some lines —above all the one that names the algorithm after `TLSv1.3`— are worded differently. The steps are the same.) All of this happened *before* the page was requested.

It is worth being clear about what the HTTPS padlock gives you and what it does not. It **gives you** three things: confidentiality (whoever is along the way cannot read what you ask for or what you receive), integrity (nobody can modify it without it being noticed) and authenticity (you are talking to the holder of the name that was verified). It **gives you no** guarantee about that holder's intentions: a scam page can have a perfectly valid padlock. And it does not hide *who* you are talking to either: whoever is along the way can know that you connected to `example.com`, though not which page you asked for or what you received.

#### The request and the response

With the channel open, HTTP begins (*HyperText Transfer Protocol*), which is a scheme of question and answer: **the client sends a request, the server returns a response, and that is where the exchange ends.** The server never starts a conversation on its own; it only answers. That asymmetry is the backbone of the web.

The astonishing thing is how simple it is. In its version 1.1, the request is text that you can read. This is the one [`curl`](https://curl.se/docs/manpage.html) sent to `example.com`, forcing that version with `--http1.1` so it could be seen in the clear:

```http
GET / HTTP/1.1
Host: example.com
User-Agent: curl/8.7.1
Accept: */*

```

And this is the response, also measured on October 7, 2026 (the [headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers) part; we see the body right away):

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

Both messages have the same three-part shape, which is the shape of every message in HTTP/1.1 (the newer versions, which you will see in a moment, carry the same parts packed in another way):

1. **The start line.** In the request it is called the *request line* and carries three words: the **method** ([`GET`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods), “give me”), the **target** (`/`, the path you saw in the URL) and the protocol **version**. In the response it is called the *status line* and carries the version, the **[status code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status)** (`200`) and a short phrase (`OK`) that is only there for a human to read.
2. **The headers.** Rows of the form `Name: value`, one per line. They are metadata: information *about* the request or the response, not the content itself.
3. **A blank line** and, after it, **the body**: the content (in a `GET` request there is almost never one; in the response, here, it is the page's HTML).

That blank line is what separates the headers from the body. A technical detail that explains why the request above ends with an empty line.

Now the headers that appeared, so they are not opaque text. From the request: [`Host`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Host) says which name the request is addressed to. It seems redundant —we already connected to the address— but a single machine can serve hundreds of sites, and it is `Host` that tells it which of them you want. `User-Agent` introduces itself (here, [`curl`](https://curl.se/docs/tutorial.html), with the version of the machine where I measured; yours will say its own; your browser sends a long string with its name and version). `Accept` says which content types are accepted (`*/*`: any). From the response: `Date` is the server's time. [`Content-Type`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Type) is **the most important one for you**, and we will come back to it below. `Server` identifies the program that answered. `last-modified` is when the resource last changed. `allow` lists the [methods](https://www.iana.org/assignments/http-methods/http-methods.xhtml) that resource accepts. `Age` says how many seconds that copy has been stored in an intermediate [cache](https://www.rfc-editor.org/rfc/rfc9111), and `alt-svc` announces that the same server also speaks HTTP/3. The rest (`Transfer-Encoding`, `Connection`, `Accept-Ranges`) are details of how it is transmitted and you do not need them yet. You will also see headers with vendor prefixes, such as `cf-cache-status`: they are extras added by the infrastructure of whoever serves the page, not part of the protocol.

And the body of that response is, simply, an HTML file:

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

(The second block is what you would see on screen when loading the page; the meaning of each tag we see in Lesson 2. For now it is enough to see that it is just text.) If a server served that file, the complete response would be this, with the line breaks the protocol dictates:

```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Length: 290

<!-- fig00_01.html -->
<!DOCTYPE html>
...
```

`Content-Length` says how many bytes the body measures, so the browser knows when it has finished; 290 is what that file measures. It is not a response we captured from a real server —it is the one a server would produce—, and in Lesson 1 you will see an authentic one, from your own server.

A clarification that will spare you a confusion. If you take the `--http1.1` option off `curl` and ask only for the headers (`-I`), the response begins differently. This is what it gave on October 7, 2026 (trimmed to the first lines):

```bash
$ curl -I https://example.com
HTTP/2 200
date: Wed, 07 Oct 2026 20:42:08 GMT
content-type: text/html; charset=utf-8
server: cloudflare
```

By default, `curl` and the server agreed on `HTTP/2 200`, not `HTTP/1.1 200 OK`, and the header names arrive in lowercase. HTTP has [versions](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Evolution_of_HTTP). Version 1.1 ([RFC 9112](https://www.rfc-editor.org/rfc/rfc9112)) is the text one you have just read. Versions 2 ([RFC 9113](https://www.rfc-editor.org/rfc/rfc9113)) and 3 ([RFC 9114](https://www.rfc-editor.org/rfc/rfc9114), over a different transport called QUIC, [RFC 9000](https://www.rfc-editor.org/rfc/rfc9000)) send the same thing in binary format —and with compressed headers—, which is more efficient and can no longer be read at a glance. **What changes is the packaging; the meaning —methods, [status codes](https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml), headers— is the same in all three** and is defined only once, in RFC 9110. That is why learning the text form is not an exercise in nostalgia: it is learning the language, with the advantage that it can be read. You will see that the server on your computer answers with `HTTP/1.0` ([RFC 1945](https://www.rfc-editor.org/rfc/rfc1945)), an even older version: it works for a practice server and, once again, the meaning does not change.

#### Methods: what is asked of the server

The method is the request's verb. The ones that matter in this course are few:

| Method | What for | Does it change anything on the server? |
|---|---|---|
| `GET` | ask for a resource | no |
| `POST` | send data for the server to process (to create something, for example) | normally yes |
| `PUT` | replace a resource with the one you send | yes |
| `DELETE` | delete a resource | yes |
| `HEAD` | same as `GET`, but without the body: only the headers | no |

RFC 9110 gives them two properties with precise names. A method is **safe** when it does not intend to change anything on the server: `GET` and `HEAD` are, and that is why the browser can repeat them, preload them or store them without fear. A method is **[idempotent](https://developer.mozilla.org/en-US/docs/Glossary/Idempotent)** when repeating it gives the same result as doing it once: `PUT` and `DELETE` are (deleting the same thing twice leaves the same world as deleting it once), `POST` is not (sending an order twice can create two orders). That difference explains why, if you reload a page that resulted from a `POST`, the browser warns you before resending. For now all you need is this: **loading a page is a `GET`**, and Lesson 10 will use `GET` and `POST` from forms.

#### Status codes: who has the problem

Status codes are three digits, and the first one already tells you almost everything: the family.

| Family | It means | The ones you will see |
|---|---|---|
| **1xx** | informational, the conversation continues | almost never |
| **2xx** | success | `200 OK`, `201 Created`, `204 No Content` |
| **3xx** | [redirection](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Redirections): what you are looking for is somewhere else | `301` and `302` (another address), `304 Not Modified` (use your copy) |
| **4xx** | **client** error: the request is not valid or cannot be served | `400`, `401`, `403`, `404 Not Found`, `429 Too Many Requests` |
| **5xx** | **server** error: the request was valid but serving it failed | `500`, `502 Bad Gateway`, `503 Service Unavailable`, `504 Gateway Timeout` |

The 4xx / 5xx distinction is gold for debugging because it points to where to start looking: a `404` says “I did not find what you asked for” (or, sometimes, “I am not going to tell you whether it exists”); a `500` says “I ran into an unexpected problem on my side while serving you”. It is not always that clean —a badly programmed server can answer `500` to a request that really was wrong—, but as a first clue it almost never fails. When the `revisor` dashboard puts a row in red because a service answered `503`, it will be translating exactly this vocabulary, and its status column is born from here. The complete official list lives in an IANA registry, the authority that assigns these numbers.

Two warnings that are paid for dearly later. **A `404` is a correct and complete response.** The server answered, with a body (normally a page that says “not found”) and everything; it is simply that the answer is “I do not have that”. From the browser's point of view the conversation went well. This will matter in Lesson 8, because JavaScript's [`fetch`](https://fetch.spec.whatwg.org/) function treats a `404` as a conversation that *went well* and not as an error: it is up to you to look at the status. Second warning: **the 2xx family says the server handled the request, not that the result is the one you expected.** A `200` with a body that says “error” (it exists, and it is bad practice) is a `200`.

#### Content-Type: how the browser decides what to do with what it receives

Go back to the header `Content-Type: text/html; charset=utf-8`. It says two things: the type of the content (`text/html`, a **[MIME](https://www.iana.org/assignments/media-types/media-types.xhtml) type**, made of a type and a subtype) and the character encoding (`utf-8`, the one that lets you write “ñ” and “á”). **The browser decides what to do with a file, above all, by this header, not by the extension of the name.** If the server says `text/html`, it interprets it as a page; if it says `text/plain`, it shows it as text without interpreting it, even if it is called `index.html`; if it says `text/css`, it treats it as styles; if it says `text/javascript`, as a program; if it says `application/json`, as data. There is a nuance: when the header is missing or doubtful, the browser sometimes “sniffs” the first bytes to guess the type (the [standard that governs it](https://mimesniff.spec.whatwg.org/) calls it *MIME sniffing*). For what matters most to you in the course it does not guess: a JavaScript module or a stylesheet with the wrong type is simply not used.

The types you will see in this course are few and worth recognizing:

| [MIME](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/MIME_types) type | What it is | Lesson |
|---|---|---|
| `text/html` | an HTML document | 2 |
| `text/css` | a stylesheet | 3 |
| `text/javascript` | a program ([RFC 9239](https://www.rfc-editor.org/rfc/rfc9239) fixed this name as the official one) | 6 |
| `application/json` | data in JSON | 8 |
| `image/png`, `image/svg+xml` | images | 11 |

You will see that this header is the protagonist of one of the most bewildering failures of Lesson 1: when the server answers “not found” with an HTML page instead of the JavaScript module you expected, the browser complains that it received the wrong type. You will already know why.

#### The web's memory: stateless, with a cache

HTTP has no memory. Each request is independent: the server does not know, by itself, that you are the same person who asked for something else two seconds ago. It is said to be a **stateless** protocol. When a site needs to remember you (that you have already logged in, for example), it does so with a trick on top of HTTP: it hands you a small piece of information called a *[cookie](https://www.rfc-editor.org/rfc/rfc6265)* (through the `Set-Cookie` header, which [MDN explains with examples](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies)) and your browser returns it in the following requests to that site, as long as it remains valid (the cookie itself carries rules that limit which domain and which paths it accompanies). Our `revisor` does not need it; we mention it so you know it exists and that the “memory” is not in the protocol but placed on top of it.

What will affect your day-to-day is the **[cache](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching)**. To avoid downloading the same thing a thousand times, the browser stores copies of responses and, depending on the headers, decides whether it can reuse them without asking or whether it must ask “has it changed since last time?”. If the copy is still valid, the browser uses it without asking anything. If it has already expired, it asks, and if the file did not change, the server answers `304 Not Modified` with no body and the browser reuses its own ([RFC 9111](https://www.rfc-editor.org/rfc/rfc9111#section-4.3)). It is a great idea for the visitor and a trap for whoever programs: you edit a file, reload, and see the version from ten minutes ago. The Network tab has a checkbox to turn it off while you work, and you will need it from Lesson 1.

### 0.3 Who does what: the browser, the server and your code

#### The server: a program that listens

A **server** is not a special machine with a different look: it is a program that is listening on a door, waiting for requests, and that knows how to answer them. A web server can do two kinds of things. In the simple case, **it reads a file from disk and sends it as it is**: you ask for `/data/services.json` and it sends you the file that is at that path. That is called serving **static** content, and it is what the practice server on your computer will do, and also the site you will publish in Lesson 11. In the complex case, **it runs a program for each request** —queries a database, computes, assembles the response— and then the content is **dynamic**. This course only needs the first: the dashboard reads a JSON file from the project itself, so there is nothing to program on the server side.

Keep this: the server *knows nothing about your screen*. It does not know how wide it is, whether there is a screen reader, whether your code failed. It only answers requests. And, in the static case, it does not run your JavaScript either: it delivers it.

#### The browser: it does much more than display

The browser is the **client**, and its technical name, *user agent*, describes its role well: it acts on behalf of the person. Its job, from the moment you type the URL until you see something, is this chain (described in detail by MDN's documentation and web.dev's classic article on how browsers work):

1. **It resolves the name and opens the connection** (what we saw in 0.1 and 0.2).
2. **It asks for the main document** with a `GET`. It receives the HTML.
3. **It reads it and builds the [DOM](https://dom.spec.whatwg.org/)**, the *Document Object Model*: a tree-shaped representation of the page, with one node for each tag. It is the tree your JavaScript will work on (Lesson 7).
4. **It discovers what else it needs.** While reading the HTML, it comes across references to other files: a stylesheet with `<link>`, a program with `<script>`, an image with `<img>`. **Each one is another request**, with its own path and its own `GET`, which the browser often launches in parallel.
5. **It applies the styles** and computes the geometry: how big each thing is and where it goes.
6. **It runs the JavaScript**, which can modify the tree and make even more requests (when you use `fetch` in Lesson 8, it will be exactly this).
7. **It paints** the result on screen.

Drawn as a timeline for the minimal page above, plus a stylesheet and a program, it looks like this:

```text
tiempo →
navegador:  GET /index.html ─────────┐
servidor:                            └─ 200, HTML ──┐
navegador:                                          ├─ GET /css/main.css ─┐
                                                    ├─ GET /js/main.js  ──┤
servidor:                                           │                     └─ 200, 200
navegador:                                                                  construye, aplica, ejecuta y pinta
```

The practical consequence is fundamental: **a page is not one download, it is several**, and each one can go well or badly separately. A page that “shows up without styles” is not a CSS mystery; it is, almost always, that the stylesheet's request returned a `404`, because the path is misspelled. And you will see it with your own eyes in a moment.

#### The three languages, and what each one is responsible for

Now you can see why the web is built with three languages and not one. **HTML** describes the content and its meaning: this is a heading, this is a table, this is a button. **CSS** describes the presentation: colors, sizes, how things are arranged. **JavaScript** describes the behavior: what happens when someone clicks, how data is requested and drawn. Normally each one travels as a separate file, with its own MIME type, and the browser puts them together (it is also possible to write CSS and JavaScript inside the HTML itself, with the `<style>` and `<script>` tags, and then they travel inside it). The order in which you will learn them —HTML, CSS, JavaScript— is also the order of dependence: a page must make sense with HTML alone, improve with CSS and become interactive with JavaScript. It is the idea of *progressive enhancement*, which the book *Resilient Web Design*, by Jeremy Keith, develops more calmly and which is worth reading alongside this lesson.

#### What reaches the browser belongs to whoever receives it

Here is an idea that this course will repeat with insistence, so it is better to understand it at its [origin](https://www.rfc-editor.org/rfc/rfc6454). The HTML, the CSS and the JavaScript travel to the machine of the person who visits the page, and there they are run. **Everything you hand to the browser is readable and modifiable by whoever receives it.** Anyone can open “View source”, read your JavaScript, change values from the browser's tools, or not even use the browser and send by hand whatever request they want. Two rules follow from this that will be habits throughout the course:

- **Nothing that must remain secret can live in the code you send to the browser.** A password, a service key, a private piece of data: if it is there, it has already been published.
- **Nothing that comes back from the browser, or comes from outside, can be trusted.** A validation done in the browser improves the experience, but protects nothing: whoever wants to skip it, skips it. And a text that comes from outside, such as a service's name, must always be treated as text and never as code. In Lesson 7 you will see what happens if not (it is called XSS) and why the `textContent` property is the defense.

The web's security is not a topic added at the end: it comes from this division of roles. Whoever knows where their code runs also knows what they can guarantee.

#### The origin: who can read what from whom

There is a rule the browser applies for your security and that more than once will seem like a nuisance: the **[same-origin](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy) policy**. An **[origin](https://developer.mozilla.org/en-US/docs/Glossary/Origin)** is the combination of scheme, host and port. A page can only freely read responses from the same origin as itself; reading those of another origin requires explicit permission from the other server (that permission is called CORS and we study it in Lesson 9). Compare:

| Address | Same origin as `https://example.com/`? | Why |
|---|---|---|
| `https://example.com/otra/ruta` | yes | scheme, host and port match; the path does not count |
| `http://example.com/` | no | the scheme changes |
| `https://www.example.com/` | no | the host changes |
| `https://example.com:8443/` | no | the port changes |

There is a special case that will bite you in Lesson 1: a page opened directly from a file (`file:///home/ana/revisor/index.html`) has no usable origin; browsers assign it an “opaque” one and for that reason forbid it from doing things that a page served over HTTP is allowed to do. The solution is the one you already sense: serve your project with a local server, even a minimal one.

#### The Network tab: seeing the conversation

All of the above can be seen, not just believed. The **browser's developer tools** (*DevTools*) open with the `F12` key, or with `Ctrl`+`Shift`+`I`, and come with several tabs. The one that matters today is **Network** (in the Spanish interface, **Red**), which records every request the page makes. In Firefox, the browser that comes with Linux Mint, it also opens with `Ctrl`+`Shift`+`E`; in Chromium-based browsers, it is named the same and is in the same menu.

Three rules of use, which spare you the first stumbles:

1. **Open it before loading the page.** The tab records while it is open; what happened before does not appear. Open the tools, go to the Network tab, and *then* reload with `F5`.
2. **Look at the columns.** Each request is a row. The ones that matter: **Status** (the code: `200`, `404`…), **Method** (`GET`), **Domain** and **File** (to whom and what was asked), **Type** (the MIME type, the `Content-Type` we saw), **Transferred** and **Size** (how many bytes traveled and how much it weighs once decompressed) and **Time** (how long it took).
3. **Click on a row.** A panel opens with the **headers** of the request and the response, exactly as we saw them written above, plus the body and the breakdown of timings.

With that in hand, the example page `https://example.com` is a good first laboratory: it is tiny and its content is designed to be harmless. When I wrote this, on October 7, 2026, that page asked for two things: the HTML document and a small program (`/s.js`) that it itself links; if today you see something different, the task is the same. In the document's row you will see `GET`, the domain, `200`, type `html`, and, in the headers panel, the same lines that `curl` showed.

And here the thread closes with the project. The **Time** column is the idea the `revisor` will show for each service: how much time passed between the request leaving and the response arriving. And the **Status** column is the one that will decide whether a dashboard row says “arriba” (up) or “caído” (down). The `revisor` is, in miniature, this Network tab turned into a product: a list of requests to services, each with its status and its response time. That is why we start here.

## The error you will see

This lesson is learned by breaking things on purpose, because failures on the web have three clear shapes and recognizing them is the central skill. Provoke them yourself; none carries any risk.

**First shape: the name does not resolve (DNS failure).** Ask for an address that does not exist. The `.invalid` domain is reserved exactly for that ([RFC 2606](https://www.rfc-editor.org/rfc/rfc2606)): it will never exist.

```bash
$ curl -sS https://nombre-que-no-existe.invalid
curl: (6) Could not resolve host: nombre-que-no-existe.invalid
```

The browser shows something equivalent: “No se puede encontrar el servidor” (Spanish interface) or “Hmm. We're having trouble finding that site”. The number in parentheses is `curl`'s exit code (6 means “the name could not be resolved”). **What it means:** the failure happened *before* connecting with anyone, in the DNS lookup. The name is misspelled, or does not exist, or your resolver does not respond. **How to fix it:** check the name's spelling, and if the name is correct, check your internet connection.

**Second shape: nobody answers at that door (connection failure).** Ask your own computer for something where there is no server.

```bash
$ curl -sS http://localhost:8000
curl: (7) Failed to connect to localhost port 8000 after 0 ms: Couldn't connect to server
```

The browser says “No se puede conectar” (Spanish interface) or `ERR_CONNECTION_REFUSED`. **What it means:** the name resolved and the machine exists, but no program is listening at that door. **How to fix it:** the server is off, or listens on another door; start it, or correct the number. Note the difference from the previous case: here there was an address to arrive at.

**Third shape: there was a response and it is bad news (HTTP failure).** Ask for a resource that does not exist on a server that does exist.

```bash
$ curl -sI https://example.com/nada.html | head -1
HTTP/2 404 
```

**What it means:** the whole path worked —name, connection, encryption, request—, the server understood and answered that it does not have that resource. **How to fix it:** the path is misspelled, or the file is not where you say. In the browser, open `https://example.com/nada.html` and look at the Network tab: you will see a row with status `404` and, despite that, a page drawn on screen. That is the proof of what we said before: a `404` is a response.

With those three shapes you can sort any symptom into a three-layer map, which is the most useful debugging tool of this lesson:

| How far did the conversation get? | Layer | Typical symptom | What to check |
|---|---|---|---|
| The name did not resolve | **Name** (DNS) | `Could not resolve host`, “server not found” | spelling, connection, resolver |
| It resolved, but nobody answers at the door | **Connection** (TCP/TLS) | `Failed to connect`, `ERR_CONNECTION_REFUSED`, invalid or expired TLS certificate | that the server is on, door, validity of the TLS certificate |
| There was a response with a 4xx or 5xx code | **Response** (HTTP) | `404`, `500`, `503` | path, permissions, server state |

Before changing a line of code, ask yourself which row you are in.

## What gets done wrong

**Saying “the server is down” for any failure.** A `404`, a timeout, an expired TLS certificate and a misspelled name are four different problems with four different fixes. Cost: hours looking in the wrong place. Fix: look first at the status code and the layer (the table above).

**Writing files with uppercase letters, spaces or accents.** `Logo Principal.PNG` works on your computer and breaks on the Linux server where you will publish. Cost: a `404` that only appears when publishing, the worst moment. Fix: lowercase, hyphens instead of spaces, no accents: `logo-principal.png`.

**Trusting the padlock as if it were a quality seal.** HTTPS says the channel is private and the name is authentic, not that the site is honest or free of errors. Cost: believing in a site because of a signal that did not promise that. Fix: HTTPS is necessary, never sufficient.

**Hiding something in the browser's code.** An “obfuscated” key in JavaScript is still on the machine of anyone who opens the page. Cost: a leak that cannot be withdrawn. Fix: what is secret lives on a server, never in what is sent to the browser.

**Debugging by reloading.** Reloading ten times “to see if it works now” without opening the Network tab is guessing. Cost: time, and the temptation to change code that was not wrong. Fix: open the Network tab, reload, and read which request failed and with what status.

**Not knowing which version of the file you are looking at.** The cache delivers the old copy while you edit the new one. Cost: debugging a problem you have already fixed. Fix: during development, with the tools open, check “Disable cache” in the Network tab.

## Exercises

The first two use pencil and the terminal; the third, the browser; the fourth puts everything together.

### Exercise 1 — Split the URL

Write on a sheet the parts of these three URLs (scheme, host, port —even if it is not written—, path, query, fragment) and answer: which two share an origin?

1. `https://example.com/data/services.json?status=down#row-3`
2. `http://localhost:8000/index.html`
3. `https://example.com:443/css/main.css`

### Exercise 2 — Read a conversation with `curl`

With `curl` installed (if not, `sudo apt install curl`), run `curl -I https://example.com` and `curl -v https://example.com -o /dev/null`. Answer in writing: (a) what HTTP version and what status code did it return? (b) what is the `Content-Type`? (c) what TLS version was negotiated? (d) how many IP addresses did the name resolve to?

### Exercise 3 — Count a page's requests

Open Firefox, open the tools (`F12`), go to the **Network** tab (**Red** in the Spanish interface) and *then* type `https://example.com`. (a) How many rows appear? (b) For the first one: method, status, type, size. (c) Check “Disable cache”, reload with `F5` and compare the Transferred column with the previous load. (d) Now visit `https://example.com/nada.html`: what status does the row have and why is a page shown despite that?

### Exercise 4 — Classify the symptoms

For each symptom, say in which layer it happened (name, connection or response) and what you would check first: (a) `curl: (7) Failed to connect to localhost port 8000`; (b) the page appears, but without any styles, and in the Network tab the stylesheet has status `404`; (c) `curl: (6) Could not resolve host`; (d) the browser shows a “502 Bad Gateway” page; (e) you open the dashboard from a file and a JavaScript module does not load (hint: think about the origin).

## Solutions

### Exercise 1 — Split the URL

1. Scheme `https`; host `example.com`; port 443 (the one the browser assumes for `https`); path `/data/services.json`; query `?status=down`; fragment `#row-3`.
2. Scheme `http`; host `localhost`; port `8000`; path `/index.html`; no query or fragment.
3. Scheme `https`; host `example.com`; port `443` (written, although it is the one already assumed); path `/css/main.css`; no query or fragment.

The 1st and the 3rd share an origin: same scheme (`https`), same host (`example.com`) and same port (443 in both, written or not). That they have different paths does not count. The 2nd differs in scheme, host and port.

### Exercise 2 — Read a conversation with `curl`

The values in this example are the ones I got on October 7, 2026; yours may differ in whatever is variable (dates, addresses), not in the form.

(a) `HTTP/2 200`: version 2 of the protocol, code `200` (success). (b) `text/html; charset=utf-8`. (c) `TLSv1.3`, in the line `SSL connection using TLSv1.3 …`. (d) Two: `104.20.23.154` and `172.66.147.243` (the `IPv4:` line of the output). If in your output the protocol is `HTTP/1.1`, your `curl` negotiated the earlier version and that is equally correct: the meaning does not change.

### Exercise 3 — Count a page's requests

(a) Two at the time of writing (the document and the `/s.js` program); if today there is another number, write down the one you see. (b) `GET`, `200`, type `html`, a size of a few hundred bytes. (c) With the cache disabled, the Transferred column shows the real size downloaded on each reload; with the cache enabled it may show “cached” or a smaller or null value, because the browser reused its copy. (d) Status `404`: the server answered that it does not have that resource, but its response includes a page that says precisely that, and the browser draws it. The conversation went well; the resource does not exist.

### Exercise 4 — Classify the symptoms

(a) **Connection.** The name resolved and the machine exists, but nobody listens at door 8000: check that the server is on and that it is that door. (b) **Response**, in a secondary request: the main document went fine and the stylesheet returned `404`; check the `<link>` path and the uppercase letters in the file name. (c) **Name.** There was not even a connection: check the host's spelling and your connection. (d) **Response**: a 5xx code. An intermediate server answered (a *gateway* or *proxy*), which passed your request to the real server and received an invalid response from it ([RFC 9110 §15.6.3](https://www.rfc-editor.org/rfc/rfc9110#section-15.6.3)). If the real server had simply not answered in time, the code would be another: `504 Gateway Timeout`. It is not something you fix in your page: it is reported to whoever administers the service. (e) **Origin:** the browser does not let a `file://` page load modules because its origin is opaque; the solution, which you will see in Lesson 1, is to serve the folder over HTTP.

## How I know I got it

This lesson is about understanding, and that can also be measured. You are ready for the next one when:

- `curl -I https://example.com` prints on the first line an `HTTP/2 200` (or `HTTP/1.1 200 OK`) and you can explain each word of that line.
- You can take any URL and point out its scheme, host, port, path, query and fragment without help, and you know which of them does not travel to the server.
- You opened the Network tab **before** loading a page, found the main request and read its status, its type and its time.
- Faced with the three errors of the section “The error you will see”, you name the correct layer without consulting the table.
- You can explain in your own words, in two sentences, why “loading a page” is several requests and why what you hand to the browser cannot be secret.

If any of the five does not work out, go back to the corresponding subsection; they are the foundations of the eleven lessons that follow. And write down in the [logbook](https://github.com/HabilMX/curso-web/blob/main/en/bitacora.md) what gave you trouble: it is the part of the course that only you read.

## Further reading

- [How the web works, from MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works) — the same story told by those who maintain the platform's documentation, with more images.
- [An overview of HTTP, from MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview) — the next step if you want to see HTTP in more depth, including the headers that we only name here.
- [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110) — the official definition of methods, codes and headers; it is a reference, you consult it, you do not read it straight through.
- [Resilient Web Design, by Jeremy Keith](https://resilientwebdesign.com/) — the history and philosophy of the web, and the origin of the idea of building in layers.
