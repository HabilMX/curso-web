# Lesson 1 — Your machine and the work cycle

**Time:** 90 min (or 2 × 45)

**What you build:** the work environment —folder, editor, local server, browser developer tools and Git— and the `revisor`'s first `index.html`, opened from your own server.

**What you learn:** editor, terminal and folders; a local server from day one; the browser's developer tools; a first commit in Git.

**The pages of this lesson.** All of them are in [`programas/01-entorno-ciclo-trabajo/`](https://github.com/HabilMX/curso-web/tree/main/programas/01-entorno-ciclo-trabajo) of the [course repository](https://github.com/HabilMX/curso-web). Here you will write them yourself, step by step; the folder is there to compare your copy with the good one when something does not match.

## By the end you will be able to

- Move around folders from the terminal (`pwd`, `ls`, `cd`, `mkdir`) and create the project folder in your home directory.
- Write an `index.html` in the editor, save it and see it in the browser from a local server that you start with `python3 -m http.server`.
- Explain why a JavaScript module does not load from `file://` and recognize the browser's message when that happens.
- Use the Inspector, the Console and the Network tab to see what the browser received, what errors there were and what requests your server logged.
- Tell “View source” apart from the Inspector, and explain why they can show different things.
- Save your first commit in Git and read it with `git status`, `git diff` and `git log --oneline`.

## The why before the how

You are going to repeat the same gesture hundreds of times throughout the course: change a line, save, go to the [browser](https://developer.mozilla.org/en-US/docs/Glossary/Browser), reload, see what happened. That cycle —write, save, reload, inspect— is the [real rhythm](https://web.dev/learn) of whoever makes web pages, and how much you learn per hour depends on it. If every turn costs ten seconds of needless friction, or if the result you see does not match the one anybody else will see, tiredness arrives before understanding. A well-built environment is what lets you make mistakes quickly and understand why.

And there is one more concrete reason, which [Lesson 0](00-como-funciona-la-web.md) already raised: a page is not the same if you open it by double-clicking the file as when a server serves it. The document you open with a double click arrives through `file://`, with no HTTP conversation, no status codes and no usable [origin](https://www.rfc-editor.org/rfc/rfc6454): the browser assigns it an “opaque” one, which matches no other, and you will soon see what consequences that has. The same document served from `http://localhost:8000` arrives the way it will arrive the day you publish it. If you develop the first way, you will see things “work” that will fail when you publish, and —worse— you will see things fail that are not your code's fault. That is why this course starts a local server from day one: not to show off, but so that what you see on your screen is [what the world will see](https://resilientwebdesign.com/).

What does have a cost is the first hour, and that is why it is worth doing in order. The lesson has three blocks. First **the workshop**: the [terminal](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Environment_setup/Command_line), folders and the editor, which are where you will spend your time. Then **the cycle of seeing**: the local server and the browser's developer tools, which tell you what is going on. Last, **the point of return**: [Git](https://git-scm.com/docs/gittutorial), which saves the state of your work so that making a mistake is not serious. At the end you will have a `revisor` folder with a [first page](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website), working from your server, with a first commit saved.

A note on the system. The course assumes **[Linux Mint](https://linuxmint-installation-guide.readthedocs.io/en/latest/)**, and on October 7, 2026 the version its site offers as current is [22.3](https://linuxmint.com/download.php) (“Zena”), in its three editions: Cinnamon, Xfce and MATE. Everything in this lesson is the same in all three; the only thing that changes is the look of the menu. Mint 22 is built on Ubuntu 24.04, and for that reason it ships Python 3.12 and a Git version of the 2.43 series; if yours differs slightly, it does not matter, nothing we use is recent.

## The concepts

There are three, and you will use them in this order in every work session of the course.

### 1.1 The workshop: terminal, folders and editor

#### The terminal: typing what you used to do with the mouse

The **terminal** is a window where, instead of clicking, you type commands. It may seem like a step backward; it is the opposite. A typed command can be repeated, pasted into a message, saved in a file and automated, things a click does not allow. Besides, almost everything you will learn in your programming career —servers, Git, tools— is handled from there. To open it on Mint, press `Ctrl`+`Alt`+`T`, or search for it as “Terminal” in the menu.

What you will see is a line like this:

```text
ana@mint:~$ 
```

It reads like this: `ana` is your user, `mint` the name of your computer, `:` separates, `~` is **where you are** (below, what it means) and `$` means “I am ready for you to type”. **The `$` is never typed.** In this course's examples, a line that starts with `$ ` is a command that you type (without that symbol), and the lines that follow it are what the terminal answers. Each command ends by pressing `Enter`. (Lesson 0 already gave you this convention in advance; here you see it with your own terminal in front of you.)

Three [shortcuts](https://missing.csail.mit.edu/2020/course-shell/) that save you half the typing, starting today: the `Tab` key completes names (type the first letters of a folder and press `Tab`); the up and down arrows go through the commands you have already typed; and `Ctrl`+`C` **interrupts** whatever is running, which you will use to stop your server. And a fourth, `Ctrl`+`L`, which clears the screen without deleting anything.

#### Where you are: folders and paths

The terminal is always “standing” in a folder, and commands act on it unless you tell them otherwise. To know which one you are in, there is [`pwd`](https://man7.org/linux/man-pages/man1/pwd.1.html) (*print working directory*):

```bash
$ pwd
/home/ana
```

That is your **home folder**, or *home*: the place where your files live, and the one the terminal opens by default. It is abbreviated with the symbol `~`, which is why the prompt above said `~`. Notice that the path uses the same slashes as the URLs of Lesson 0, and works on the same principle: a road that goes from the root inward. And, as with URLs, there are **absolute** paths (they start at the root, with `/`, or in your home folder, with `~`) and **relative** paths (they start from where you are, without a leading slash). Two special names complete the vocabulary: `.` means “this folder” and `..` means “the folder above”.

With four commands you already move around the whole system:

| Command | What it does | Example |
|---|---|---|
| `pwd` | says which folder you are in | `pwd` |
| [`ls`](https://man7.org/linux/man-pages/man1/ls.1.html) | lists what is in the current folder | `ls` · `ls -a` also shows what is hidden |
| `cd` | changes folder | `cd Documentos` · `cd ..` goes up one level · `cd` alone returns to your home |
| [`mkdir`](https://man7.org/linux/man-pages/man1/mkdir.1.html) | creates a folder | `mkdir revisor` |

A file or folder whose name starts with a dot (`.git`, `.gitignore`) is **hidden**: `ls` does not show it unless you ask for `ls -a`. Graphical file managers hide them too; in Mint's file manager ([Nemo](https://linuxmint-user-guide.readthedocs.io/en/latest/)) they are shown or hidden with `Ctrl`+`H`. You will need it to see the Git folder.

Linux distinguishes uppercase from lowercase: `Revisor` and `revisor` are different folders. Remember the rule born in Lesson 0: **lowercase, no spaces and no accents** in everything you create. If someday you need a space, the terminal will force you to write quotes or backslashes, and it is a good warning that that name is going to cause problems.

Create the project folder now and go into it:

```bash
$ cd ~
$ mkdir revisor
$ cd revisor
$ pwd
/home/ana/revisor
$ ls
```

The last `ls` prints nothing, because the folder is empty, and that is correct. If instead the terminal answers `mkdir: no se puede crear el directorio «revisor»: El archivo ya existe` (Spanish for “cannot create directory 'revisor': File exists”), you had already created one with that name; go in with `cd revisor` and carry on. (By the way, this course contains no command that deletes things: when something is deleted from the terminal, there is no trash can, and starting there is a bad idea. If someday you want to delete, do it from the file manager, which does have a trash can.)

#### The editor

A web page is a **plain text** file: letters, numbers and symbols, without formatting. That means it is **not written in a word processor** (such as LibreOffice Writer), which also saves typefaces, margins and styles that the browser does not understand. It is written in a **code editor**, which saves only the text and, besides, helps you: it colors according to the language, indents on its own, warns of unclosed parentheses.

Linux Mint comes with a simple one, **Xed**, which works. In this course we will use **Visual Studio Code** (VS Code), a free, very widely used editor, because it shows the project's folder tree, has an integrated terminal and is used the same on any system, so what you learn here you reuse anywhere. If you prefer another editor, it will work: the only thing the course demands is that it saves plain text, in [UTF-8](https://www.rfc-editor.org/rfc/rfc3629) and with Linux line breaks.

To install VS Code on Mint, the editor's [official documentation](https://code.visualstudio.com/docs/setup/linux) says to download the `.deb` package from its site, in the downloads section for Linux (choose the 64-bit `.deb` option), and then install it from the terminal. If you downloaded it with Firefox, the file ended up in your downloads folder (in Spanish, `~/Descargas`):

```bash
$ cd ~/Descargas
$ sudo apt install ./code_*.deb
```

Two new things in that line. `apt` is Mint's **[package manager](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Environment_setup/Installing_software)**: the program that installs, updates and removes software, resolving the dependencies on its own. And `sudo` is the word that means “do it with administrator permissions”: installing programs for the whole system requires them, and that is why `sudo` asks you for **your password**. When you type it you will see nothing on screen, not even asterisks: it is not that it does not work, it is a measure so nobody reads it over your shoulder. Type it in full and press `Enter`. A hygiene rule worth having from the first day: **do not paste into the terminal a command with `sudo` that you do not understand**; with it, the machine does what you tell it without asking whether you are sure. (That package, by the way, sets up a repository so the editor is updated along with the rest of the system, as VS Code's own documentation describes.)

With the editor installed, open it **on the project folder**, not on a loose file. From the terminal, already inside `~/revisor`, type:

```bash
$ code .
```

The dot is the current folder: you have just opened the editor “standing” in `revisor`. On the left you will see the file explorer with the folder (empty), and in the bar at the bottom, information about the file. When you open it for the first time, VS Code will ask whether you trust the authors of the folder: it is your own folder, say yes. Then turn on [auto save](https://code.visualstudio.com/docs/editor/codebasics) so you do not have to remember to save: in the **File** menu, check **Auto Save**. You will see that pressing `Ctrl`+`S` out of habit is still useful; auto save is a safety net, not a substitute. If your editor offers to complete whole blocks of code for you, turn it off while you learn: typing each line with your own hands is [part of learning](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Soft_skills).

Inside the editor, with the combination `Ctrl` plus the backtick key you open an integrated terminal that is already standing in the project folder. It is the most used convenience, and the one you will need when the server occupies one terminal and you want another: with the `+` button of that panel you open a second one.

### 1.2 The cycle of seeing: local server and browser developer tools

#### The first page

Create the project's first file: in VS Code's explorer, with the “New File” button (or `Ctrl`+`N` and then save), call it `index.html`. Type this:

```html
<!-- fig01_01.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Revisor de servicios</title>
</head>
<body>
  <main>
    <h1>Revisor de servicios</h1>
    <p>Aquí vivirá el estado de tus servicios.</p>
  </main>
</body>
</html>
```

```text
Revisor de servicios
Aquí vivirá el estado de tus servicios.
```

(The first line, the comment `<!-- fig01_01.html -->`, is the way the course repository identifies this example; you can copy it or not, it is a comment that the browser does not show. The second block is what you will see in the window. The page is in Spanish: “Revisor de servicios” means “Services checker” and the paragraph reads “The state of your services will live here”.)

I am not asking you to understand every [tag](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Basic_HTML_syntax) today; Lesson 2 is devoted to that. So the file is not opaque text, this is the minimum: `<!DOCTYPE html>` tells the browser to read the page with the modern rules; `lang="es"` declares the language, which matters to screen readers; `<meta charset="utf-8">` declares the encoding (it is what makes “á” and “ñ” display correctly; it must be near the beginning); the tag with `viewport` makes the page adapt to a phone's width, and we will use it a lot in Lesson 5; `<title>` is the text of the tab. Everything inside `<body>` is what is seen in the window: a heading (`<h1>`) and a paragraph (`<p>`) inside the main region (`<main>`).

Save with `Ctrl`+`S`. There are two ways to see it in the browser. The first is the one everybody tries: double-click the file in the file manager. Try it. It works, and in the address bar you will see something like `file:///home/ana/revisor/index.html`. Notice the scheme: `file`, not `http`. There is no server or conversation here; the browser read the file from disk, just as it is.

For a single-file page, that is enough. For a project with more than one file that load each other, it no longer is. Let us see why with a small test, done on purpose.

#### A module that does not load

Later in the course you will split the dashboard's JavaScript into small files that import one another. That is called **[modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)**, and they are loaded with [`<script type="module">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script). See how it looks with a minimal example: a page and a JavaScript file that changes its text. (You do not need to understand the JavaScript yet —it comes in Lesson 6—; it is enough to know that that single line looks for the paragraph whose identifier is `status` and changes its text.)

Replace the content of `index.html` with this version and create next to it, in the same folder, a file `main.js` with the program. Look at the attribute `src="main.js"`: it is a relative URL (Lesson 0) meaning “the `main.js` file that is next to this page”.

```html
<!-- fig01_02.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Revisor de servicios</title>
  <script type="module" src="main.js"></script>
</head>
<body>
  <main>
    <h1>Revisor de servicios</h1>
    <p id="status">Esperando al módulo.</p>
  </main>
</body>
</html>
```

```js
// main.js
document.querySelector("#status").textContent = "El módulo cargó.";
```

```text
Revisor de servicios
El módulo cargó.
```

(In the course repository this page is called `fig01_02.html` and its program `main.js`, one next to the other; in **your** folder the page is called `index.html`. Both blocks are copied as they are. The third block is what you should see when everything works. The paragraph's text, “Esperando al módulo.”, means “Waiting for the module.” and “El módulo cargó.” means “The module loaded.”)

Now open it with a double click, as before. You will see the text “Esperando al módulo.” and **not** “El módulo cargó.”: the program did not run. And nobody warned you in the window. This is one of the most bewildering silent failures, and it is explained in the section “The error you will see”: the warning is in the browser's [Console](https://firefox-source-docs.mozilla.org/devtools-user/web_console/index.html), which you will learn to open in a few minutes.

Lesson 0 already laid out the underlying reason. Modules are downloaded with a request that the browser makes “in cross-origin mode” (the mechanism called [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)), that is, subject to the [same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy). A page opened from `file://` has an [opaque origin](https://url.spec.whatwg.org/#concept-url-origin), and the browser does not allow it to make that download. The solution is not a trick in the code: it is to deliver the project over HTTP, as the real world will.

#### The local server: `python3 -m http.server`

A [web server](https://developer.mozilla.org/en-US/docs/Glossary/Server) is needed, and not a heavy one: a minimal one that reads files from the folder and delivers them over HTTP. Your computer already has one, included in Python. You are already in the project folder; from the terminal, type:

```bash
$ python3 -m http.server 8000 --bind 127.0.0.1
Serving HTTP on 127.0.0.1 port 8000 (http://127.0.0.1:8000/) ...
```

Break down each piece of that line, because each one answers something from Lesson 0:

- `python3 -m http.server` runs (`-m`, “module”) the web server that comes in Python's standard library. Nothing needs to be installed; it is the only thing from Python that this course uses.
- `8000` is the **port**: the “door” it listens on. It is an arbitrary number greater than 1024; 8000 is just a habit. If your folder uses another, you write it the same way in the URL.
- `--bind 127.0.0.1` limits the server to **your own machine**. It is a precaution that matters: by default, this server listens on *all* network interfaces, and Python's documentation warns that it is not meant for production. With `--bind 127.0.0.1` you only listen to yourself.
- The line it prints says at what address it serves the current folder.

The terminal was left “busy”: it does not give you back the `$` prompt, because the server keeps running and writing there whatever happens. Leave it like that and open another (in VS Code, the `+` button of the terminal panel; or a new window). To stop it, someday, you go back to that terminal and press `Ctrl`+`C`.

Now open the browser and type `http://localhost:8000/` (`localhost` is a name [reserved for your own machine](https://www.rfc-editor.org/rfc/rfc6761)). As you saw in Lesson 0, that name corresponds to two addresses, `127.0.0.1` and the IPv6 one, `::1`; the server only listens on the first, and the browser, if it gets no answer on one, tries the other (I checked it with Chrome, Firefox and `curl`). If someday `localhost` does not open the page for you, type the address the server printed, `http://127.0.0.1:8000/`. The page you see is the same, but now the text says **“El módulo cargó.”**: the program ran. The difference is exactly the scheme: before `file://`, now `http://`.

Look at what the server's terminal wrote meanwhile, which is the conversation of Lesson 0 in summarized form:

```text
127.0.0.1 - - [07/Oct/2026 10:55:10] "GET / HTTP/1.1" 200 -
127.0.0.1 - - [07/Oct/2026 10:55:10] "GET /main.js HTTP/1.1" 200 -
127.0.0.1 - - [07/Oct/2026 10:55:10] code 404, message File not found
127.0.0.1 - - [07/Oct/2026 10:55:10] "GET /favicon.ico HTTP/1.1" 404 -
```

Each line is a request that arrived. It reads: who made it (`127.0.0.1`, you), when, the request line in quotes (method, path and version) and the status code. Three things to notice. **One:** a single visit to the page produced **three** requests, not one: the HTML, the program the HTML asks for, and something you did not ask for. It is the mechanism of Lesson 0, on a small scale. **Two:** the HTML was requested with `GET /`, the path you typed, which is a folder and not a file; the server answered with that folder's `index.html`, the convention you saw in Lesson 0. The log records what was asked for, not the file that was delivered. **Three:** the [`404`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/404) for `/favicon.ico` is not your mistake. The **[favicon](https://html.spec.whatwg.org/multipage/)** is the tab's small icon; browsers request it on their own, at that path, without you saying so anywhere. Since there is none, the server answers “not found”. It is harmless and teaches you something important: *the browser makes requests that your page did not ask for.* In Exercise 2 you will silence it.

You can also see what the server answers *at the header level*, with [`curl`](https://curl.se/docs/manpage.html) (install it, if you do not have it, with `sudo apt install curl`; its [official tutorial](https://curl.se/docs/tutorial.html) teaches the rest of its options):

```bash
$ curl -i http://127.0.0.1:8000/main.js
HTTP/1.0 200 OK
Server: SimpleHTTP/0.6 Python/3.12.12
Date: Wed, 07 Oct 2026 19:17:38 GMT
Content-type: text/javascript
Content-Length: 81
Last-Modified: Wed, 07 Oct 2026 19:17:38 GMT

// main.js
document.querySelector("#status").textContent = "El módulo cargó.";
```

(I measured this output on another computer, with Python 3.12.12; on Linux Mint 22 the `Server` line will say the version the system ships, `Python/3.12.3` at the time of writing. The dates will be different, and `Content-Length` will only match if you copied the file as it is, with its comment.) You recognize everything: the status line with [`HTTP/1.0`](https://www.rfc-editor.org/rfc/rfc1945) —this practice server uses that version by default—, the [`Content-type`](https://developer.mozilla.org/en-US/docs/Glossary/MIME_type) computed from the file's extension (`.js` → `text/javascript`; MDN documents the full header under [`Content-Type`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Type)), the body size, the modification date. It is your own server, speaking the language of Lesson 0.

Two observations about daily use. If you forget which folder you started it in, remember that **the server publishes the folder you run it from**: starting it in your home folder would publish, to whoever can reach the server, everything there (that is why `--bind 127.0.0.1` and why always `cd revisor` first). And if you change a file and reload, the server delivers the new version without restarting; you do not have to stop it every time, only when you switch projects.

#### The browser's developer tools

Your browser has a built-in workshop for looking inside at what was loaded: the **[developer tools](https://developer.chrome.com/docs/devtools/overview)**. They open with `F12` (or `Ctrl`+`Shift`+`I`) and are divided into tabs. We will use Firefox, which comes with Mint; Chromium-based browsers have the same ones with almost identical names. For this lesson, three tabs are enough:

**[Inspector](https://firefox-source-docs.mozilla.org/devtools-user/page_inspector/index.html).** It shows the document as the browser understands it: a tree of elements. Right-click the page's paragraph and choose **Inspect**: the Inspector opens, with the element highlighted. You can expand and collapse the tree, and even edit a text with a double click to see the effect (it only lasts until you reload: it is an experiment, it does not change your file). Here you will see “El módulo cargó.”.

And here is one of the most valuable ideas of the lesson. With the page open, press `Ctrl`+`U`, which opens **View Source**. There you will see the HTML as it arrived from the server, with “Esperando al módulo.” in the paragraph. **The source is what the server sent; the Inspector is what the browser has now, after running the JavaScript.** They can be different, and in the dashboard they almost always will be, because JavaScript will draw it. When something “does not appear” on screen, looking at both tells you whether the server did not send it or your program did not draw it. Without that distinction, it is easy to lose an afternoon.

**Console.** It is where the browser writes its warnings and the errors of your JavaScript, each with the file and line that caused it. Open it and keep it visible while you work. A rule we will adopt as an exit criterion of the course: **the Console must be empty** (no errors and no warnings). With the page served, yours will be, with one exception worth knowing: Chrome notes in the Console the `404` for the `favicon.ico` we spoke of above (I measured it; in other browsers it may not appear), and it disappears as soon as you do Exercise 2. With the page opened through `file://`, it will have the module error we saw above.

**[Network](https://firefox-source-docs.mozilla.org/devtools-user/network_monitor/index.html).** You knew it from Lesson 0. Now, with your server, it is much more revealing: open the tab, reload with `F5` and you will see three rows: the document, `main.js` and `favicon.ico`, with their statuses `200`, `200` and `404`. They are the same three lines your server wrote, seen from the other side. Click the `main.js` one and look at the headers: the `Content-type: text/javascript` from above, with its server. Right there check **Disable [cache](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/304)** (a checkbox in the tab's bar or in its settings menu, depending on your version): while the tools are open, the browser will not reuse old copies. It solves the problem of “I edited and the change does not show” before it appears. With the tools closed, the [cache](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching) acts again; if in doubt, `Ctrl`+`Shift`+`R` forces a reload that ignores it.

The cycle is now complete. Every time you change something, the routine is always the same: **edit, save, reload, look at the Console and the [Network tab](https://developer.chrome.com/docs/devtools/network).** If something does not appear, the first thing to look at is the Console.

### 1.3 The point of return: Git

#### What problem it solves

Sooner or later, you will change something that worked and it will stop working, and you will not remember exactly what you touched. Without a record, the way out is to undo by hand what you think you changed. **Git** is a **[version control](https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control)** system: a program that saves, on your command, photographs of the state of your folder, each with a message that says what changed and why. With them you can see what was modified, compare with any earlier point and go back. It is the most used tool in the world for this, and you will see it in any team; MIT's *Missing Semester* course devotes [an entire class](https://missing.csail.mit.edu/2020/version-control/) to it, if you want to understand how it stores history inside.

Do not confuse it with GitHub or GitLab: Git works **only on your machine**, with no internet. Services like GitHub are places where you can *share* a Git repository; we do not need them here yet. For this lesson, Git is your personal history.

There is a mental model that makes it understandable, and it is three zones. Your files live in the **working folder**, where you edit them. When something is ready to be saved, you move it to the **[staging area](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository)** (*stage*): a waiting room where you decide exactly what will go into the next photograph. And the photograph itself, called a **commit**, is saved in the **repository**. Three steps, three commands: `git add` moves to the waiting room, [`git commit`](https://git-scm.com/docs/git-commit) takes the photograph.

#### Setting up Git, once

First, tell it who you are: every commit carries an author. It is done only once in your computer account, with your real details (the email is just a label; it is not sent anywhere):

```bash
$ git config --global user.name "Ana Pérez"
$ git config --global user.email "ana@example.com"
```

If Git is not installed (`git --version` tells you), it is installed with `sudo apt install git`.

#### The first commit

In the project folder, create the repository with [`git init`](https://git-scm.com/docs/git-init). The `-b main` option names the main branch `main`, which is the usual convention today:

```bash
$ git init -b main
Inicializado repositorio Git vacío en /home/ana/revisor/.git/
```

Git created a hidden folder, `.git`, which is where the whole history lives. Do not touch it by hand; if you delete it, you lose the history. Ask it how it sees the project (the Git messages appear here in Spanish, as on a system set to Spanish; the one above says “Initialized empty Git repository in …”):

```bash
$ git status
En la rama main

No hay commits todavía

Archivos sin seguimiento:
  (usa "git add <archivo>..." para incluirlo a lo que será confirmado)
	index.html
	main.js

no hay nada agregado al commit pero hay archivos sin seguimiento presentes (usa "git add" para hacerles seguimiento)
```

[`git status`](https://git-scm.com/docs/git-status) is the command you will run most: it says where each thing is. Here it tells you that `index.html` and `main.js` are **untracked** (“Archivos sin seguimiento”): they exist in the working folder, but Git does not know them yet. Move both of them to the waiting room (`git add` accepts several names) and ask again:

```bash
$ git add index.html main.js
$ git status
En la rama main

No hay commits todavía

Cambios a ser confirmados:
  (usa "git rm --cached <archivo>..." para sacar del área de stage)
	nuevos archivos: index.html
	nuevos archivos: main.js

```

Now both appear under “Cambios a ser confirmados” (“Changes to be committed”): they are in the waiting room. Take the photograph with a message:

```bash
$ git commit -m "Primer index.html del revisor"
[main (commit-raíz) ff110e5] Primer index.html del revisor
 2 files changed, 18 insertions(+)
 create mode 100644 index.html
 create mode 100644 main.js
```

What it says: a commit was saved on the `main` branch, identified by the code `ff110e5` (the first characters of its fingerprint; yours will be different), with two files that changed and the lines that were added (the number depends on how many lines your files have). That summary line comes out in English even if your system is in Spanish: Git does not translate it. To see it in the history list:

```bash
$ git log --oneline
ff110e5 Primer index.html del revisor
```

One commit per line, the most recent on top. You now have your first point of return.

#### The cycle with Git

The pattern is always the same and it is short: **change, see what changed, stage, save.** Edit `index.html` (for example, change the paragraph's text) and ask what was modified with [`git diff`](https://git-scm.com/docs/git-diff), which shows line by line what changed with respect to the last commit (lines with `-` were removed; lines with `+` were added):

```bash
$ git diff
diff --git a/index.html b/index.html
index 05c31c2..9de2d09 100644
--- a/index.html
+++ b/index.html
@@ -10,7 +10,7 @@
 <body>
   <main>
     <h1>Revisor de servicios</h1>
-    <p id="status">Esperando al módulo.</p>
+    <p id="status">Cargando el módulo.</p>
   </main>
 </body>
 </html>
```

(In this example the paragraph's text was changed: the line with `-` is the earlier one and the one with `+`, the current one; Git also shows three lines of context above and below. The numbers on the `index` line depend on the exact content of your file, so yours may be different.) Looking at it before saving is Git's best habit: it catches mistakes, such as a change you did not intend. Then, `git add` and `git commit` again.

Some rules of use that save headaches. **Messages say what and why**, in a short sentence: “Agrega la tabla de servicios” (Adds the services table) is fine; “cambios” (changes) and “asdf” are not, because in a month they will tell you nothing. **One commit per idea**: do not mix a fix and a new function in the same one. And the course's habit: **at the end of each lesson, a commit** with the state the dashboard was left in. That way, if Lesson 8 wrecks something for you, 7 is still intact and recoverable. One last note: Git does not track empty folders, only files; that is why `css/`, `js/` or `data/` will not appear in `git status` until they have something inside.

## The error you will see

There are three almost inevitable errors in this lesson. Reproduce them on purpose: seeing them here, with the cause at hand, is much cheaper than running into them alone.

### The module blocked by CORS

Open `index.html` (the module version, `fig01_02`) with a double click, so that the bar says `file:///…`. Open the Console with `F12`. In Chrome, the message measured on October 7, 2026 (with the path adapted to Linux, the rest verbatim) is:

```text
Access to script at 'file:///home/ana/revisor/main.js' from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: chrome, chrome-experimental-site-token-provider, chrome-extension, chrome-untrusted, data, http, https, isolated-app.
```

In Firefox, the message is worded differently and mentions a reason that Mozilla's documentation describes like this: **“[Reason: CORS request not HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS/Errors/CORSRequestNotHttp)”**, that is, that the cross-origin request is not HTTP; in a Spanish-language Firefox, that part will appear translated. Although the wording changes, the information is the same.

**What it means:** the page has `origin 'null'` —the [opaque origin](https://html.spec.whatwg.org/multipage/browsers.html#concept-origin-opaque) of local files—, and it asked for a module; a request of that kind can only be made over HTTP or [HTTPS](https://developer.mozilla.org/en-US/docs/Glossary/HTTPS), and yours was on `file://`. That is why the program did not run. **How to fix it:** by serving the folder with `python3 -m http.server`, as you did. There is nothing to repair in the code.

### Address already in use

If you start the server and there was already one on that door —because you left it running in another terminal—, Python answers with a long error whose last line is the one that matters. On Linux it is:

```text
OSError: [Errno 98] Address already in use
```

(On other systems the number changes; the phrase is the same. 98 is the value of [`EADDRINUSE`](https://man7.org/linux/man-pages/man3/errno.3.html), “address in use”, on Linux.) **What it means:** another program is already listening on port 8000; only one can do so at a time. **How to fix it:** if it is your own forgotten server, go to its terminal and stop it with `Ctrl`+`C`; or use another door: `python3 -m http.server 8001 --bind 127.0.0.1` (and then the URL is `http://localhost:8001`).

### Git's identity

If you forget the [`git config`](https://git-scm.com/docs/git-config) step and your system cannot deduce a reasonable email, the first `git commit` refuses with a message that begins with `Identidad del autor desconocido` and ends with `fatal: no es posible auto-detectar la dirección de correo` (if your system is in English: `Author identity unknown` and `fatal: unable to auto-detect email address`). Sometimes Git does deduce a name and an email from your user and the machine's name, and makes the commit showing you a notice to check that they are correct. **What it means:** Git refuses to save a commit without knowing in whose name it goes. **How to fix it:** run the two `git config --global` commands from above (and, if the commit already went out with the automatic identity, `git commit --amend --reset-author` replaces it).

## What gets done wrong

**Developing by opening the file with a double click.** It works until the day you stop seeing something that should work: modules, `fetch`, fonts. Cost: hours blaming your code for an origin failure. Fix: always the local server, from the first line.

**Starting the server in the wrong folder.** A `python3 -m http.server` launched in your home folder, without `--bind`, publishes everything there to the whole local network. On a fresh Mint installation, the firewall usually comes turned off, so nothing would stop it. Cost: your documents exposed on a coffee-shop network. Fix: `cd revisor` before starting, and `--bind 127.0.0.1` always.

**Writing in a word processor.** A `.docx` renamed to `.html` is not an HTML. Cost: a page full of symbols. Fix: code editor, plain text, UTF-8.

**Putting spaces, accents or uppercase letters in names.** `Mi Página.html` looks fine today and breaks tomorrow, in the terminal and in the URL (Lesson 0 explained why). Fix: `mi-pagina.html`.

**Reloading without looking at the Console.** The error is written, with file and line, and nobody reads it. Cost: debugging blind. Fix: the Console always open.

**A commit that says “cambios”.** It is useful the day you write it and never again. Fix: a sentence that says what and why.

**Pasting commands with `sudo` without reading them.** With `sudo` the machine obeys without asking. Fix: before pressing `Enter`, know what each word does.

## Exercises

### Exercise 1 — The project structure

Inside `~/revisor`, create three folders: `css`, `js` and `data`, with a single command (hint: `mkdir` accepts several names). Check with `ls`. Then ask Git with `git status`: does it list them as changes? Why?

### Exercise 2 — Silencing the favicon

With the server running and the Network tab open, reload the page and note the status of `favicon.ico`. Add inside the page's `<head>` [`<link rel="icon" href="data:,">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/link), save, reload with `Ctrl`+`Shift`+`R` and look again. What changed in the Network tab and in the server's log? Find out what a [`data:`](https://url.spec.whatwg.org/) scheme means (hint: Lesson 0 taught the parts of a URL).

### Exercise 3 — Source versus Inspector, and a second commit

Serve the version of the page with the module (the one from `fig01_02`). Open “View Source” (`Ctrl`+`U`) and the Inspector. Note what the paragraph says in each one and explain the difference. Then change the heading's text, look at the change with `git diff`, and save it with a second commit. How does [`git log --oneline`](https://git-scm.com/docs/git-log) look now?

### Exercise 4 — Provoking and reading a 404

With the server running, rename the file `main.js` to `principal.js` from the file manager (without touching the HTML) and reload. Note, in this order: what the person sees on the page, what the Console says, the status the Network tab shows, and the line the server wrote. Then fix it and check that the Console is empty.

## Solutions

### Exercise 1 — The project structure

```bash
$ mkdir css js data
$ ls
css  data  index.html  js  main.js
$ git status
En la rama main
nada para hacer commit, el árbol de trabajo está limpio
```

Git does not list them because it **only tracks files, not folders**; an empty folder has nothing to record. They will appear in `git status` as soon as they contain a file. (If you had already changed `index.html` without saving a commit, `git status` will show it as modified; that is another matter.) The last line of the output, “nada para hacer commit, el árbol de trabajo está limpio”, means “nothing to commit, working tree clean”.

### Exercise 2 — Silencing the favicon

The page ends up like this:

```html
<!-- fig01_03.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Revisor de servicios</title>
  <link rel="icon" href="data:,">
</head>
<body>
  <main>
    <h1>Revisor de servicios</h1>
    <p>Aquí vivirá el estado de tus servicios.</p>
  </main>
</body>
</html>
```

```text
Revisor de servicios
Aquí vivirá el estado de tus servicios.
```

Before: a row with `favicon.ico` and status `404`, and on the server `code 404, message File not found`. After: there is no request for `favicon.ico` any more, because the HTML itself declares the icon. The `data:` scheme is a URL that **carries the content inside itself**, instead of pointing to a place to request it from; the one we wrote, `data:,`, contains empty content, that is, an invisible icon, and that is why the browser does not need to request anything. (The example page `example.com`, from Lesson 0, does exactly the same.) Later we will put in a real icon.

### Exercise 3 — Source versus Inspector, and a second commit

“View Source” shows `Esperando al módulo.`; the Inspector shows `El módulo cargó.`. The difference is that the source is what the server sent, before running JavaScript, and the Inspector is the document's current state, after `main.js` changed the text.

```bash
$ git diff
…
-    <h1>Revisor de servicios</h1>
+    <h1>Revisor de servicios web</h1>
$ git add index.html
$ git commit -m "Aclara el titulo del revisor"
$ git log --oneline
3a91c0e Aclara el titulo del revisor
ff110e5 Primer index.html del revisor
```

Two commits, the most recent on top; the codes on the left will be different on your machine.

### Exercise 4 — Provoking and reading a 404

What the person sees: the page with “Esperando al módulo.”, without any warning in the window. On the server, these lines appear (measured on October 7, 2026):

```text
127.0.0.1 - - [07/Oct/2026 10:56:09] code 404, message File not found
127.0.0.1 - - [07/Oct/2026 10:56:09] "GET /main.js HTTP/1.1" 404 -
```

The Network tab shows the `main.js` row with status `404`. The Console shows an error when loading the module; its wording depends on the browser and usually mentions the `404` status or that the server answered with a content type that is not JavaScript —the server's error page is HTML—, and it is the `Content-Type` header of Lesson 0 in action. The fix is to give the file its name back (`main.js`). The lesson is the same as in Lesson 0: the page without its program is not a mystery, it is a secondary request that failed, and it can be seen in three places at once.

## How I know I got it

- `pwd` inside the project folder prints `/home/<your user>/revisor`.
- `python3 -m http.server 8000 --bind 127.0.0.1` prints `Serving HTTP on 127.0.0.1 port 8000 (http://127.0.0.1:8000/) ...` and `http://localhost:8000/` shows the page.
- With the page served (and the `favicon` silenced from Exercise 2), the **Console is empty** and the Network tab shows the document with status `200`.
- With the same page opened by double click (`file://`), the Console does show the module error, and you can explain why.
- `git log --oneline` prints at least one commit with a message that explains what you saved, and `git status` says `nada para hacer commit, el árbol de trabajo está limpio`.
- Without looking at the lesson, you can answer: what does “View Source” show that the Inspector does not, and the other way around?

If everything is in order, your environment is already that of any web professional, and the rest of the course is done on it. Write down in the [logbook](https://github.com/HabilMX/curso-web/blob/main/en/bitacora.md) what gave you trouble. In Lesson 2 you will write the dashboard's skeleton with HTML that says what it means. And if you want to see from now where the road leads, this house's [TypeScript course](https://www.habil.mx/en/courses/typescript/) rebuilds this same dashboard with types and with React.

## Further reading

- [Dealing with files, from MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Environment_setup/Dealing_with_files) — MDN's guide to organizing a project's files, a good complement to this lesson.
- [Python's `http.server` documentation](https://docs.python.org/3/library/http.server.html) — all the options of the server we use, and the security warning about its use.
- [Pro Git, the official book](https://git-scm.com/book/en/v2) — the “Git Basics” chapter is the natural next step.
- [The Missing Semester of Your CS Education (MIT)](https://missing.csail.mit.edu/) — a free course on the terminal, the editor and version control, which explains why these tools deserve your time.
