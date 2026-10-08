# Lição 1 — Seu computador e o ciclo de trabalho

**Tempo:** 90 min (ou 2 × 45)

**O que você constrói:** o ambiente de trabalho —pasta, editor, servidor local, ferramentas do navegador e Git— e o primeiro `index.html` do `revisor`, aberto a partir do seu próprio servidor.

**O que você aprende:** editor, terminal e pastas; servidor local desde o primeiro dia; as ferramentas do navegador; um primeiro registro no Git.

**As páginas desta lição.** Todas estão em [`programas/01-entorno-ciclo-trabajo/`](https://github.com/HabilMX/curso-web/tree/main/programas/01-entorno-ciclo-trabajo) do [repositório do curso](https://github.com/HabilMX/curso-web). Aqui você vai escrevê-las, passo a passo; a pasta serve para comparar a sua cópia com a boa quando algo não coincidir.

## Ao terminar, você vai conseguir

- Mover-se pelas pastas a partir do terminal (`pwd`, `ls`, `cd`, `mkdir`) e criar a pasta do projeto no seu diretório pessoal.
- Escrever um `index.html` no editor, salvá-lo e vê-lo no navegador a partir de um servidor local que você sobe com `python3 -m http.server`.
- Explicar por que um módulo de JavaScript não carrega a partir de `file://` e reconhecer a mensagem do navegador quando isso ocorre.
- Usar o Inspetor, o Console e a aba Rede para ver o que o navegador recebeu, que erros houve e que requisições o seu servidor registrou.
- Distinguir “Exibir código-fonte” do Inspetor, e explicar por que eles podem mostrar coisas diferentes.
- Guardar o seu primeiro registro no Git e lê-lo com `git status`, `git diff` e `git log --oneline`.

## O porquê antes do como

Você vai repetir um mesmo gesto centenas de vezes ao longo do curso: mudar uma linha, salvar, ir ao [navegador](https://developer.mozilla.org/pt-BR/docs/Glossary/Browser), recarregar, olhar o que aconteceu. Esse ciclo —escrever, salvar, recarregar, inspecionar— é o [ritmo real](https://web.dev/learn) de quem faz páginas web, e dele depende quanto você aprende por hora. Se cada volta custa dez segundos de atrito desnecessário, ou se o resultado que você vê não coincide com o que qualquer outra pessoa verá, o cansaço chega antes da compreensão. Um ambiente bem montado é o que faz você errar rápido e entender por quê.

E há uma razão mais concreta, que a [Lição 0](00-como-funciona-la-web.md) já levantou: uma página não é a mesma coisa se você a abre com um duplo clique no arquivo ou se um servidor a serve. O documento que você abre com duplo clique chega por `file://`, sem conversa HTTP, sem códigos de status e sem uma [origem](https://www.rfc-editor.org/rfc/rfc6454) utilizável: o navegador atribui a ele uma “opaca”, que não coincide com nenhuma outra, e você vai ver que consequências isso tem. O mesmo documento servido por `http://localhost:8000` chega como chegará no dia em que você o publicar. Se você desenvolve da primeira forma, vai ver “funcionar” coisas que falharão ao publicar, e —pior— vai ver falhar coisas de que o seu código não tem culpa. Por isso este curso sobe um servidor local desde o primeiro dia: não para se exibir, mas para que o que você vê na sua tela seja [o que o mundo verá](https://resilientwebdesign.com/).

O que de fato tem um custo é a primeira hora, e por isso convém fazê-la com ordem. A lição tem três blocos. Primeiro **a oficina**: o [terminal](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Environment_setup/Command_line), as pastas e o editor, que é onde você passará o tempo. Depois **o ciclo de ver**: o servidor local e as ferramentas do navegador, que dizem a você o que está acontecendo. Por último **o ponto de retorno**: o [Git](https://git-scm.com/docs/gittutorial), que guarda o estado do seu trabalho para que errar não seja grave. No fim você terá uma pasta `revisor` com uma [primeira página](https://developer.mozilla.org/pt-BR/docs/Learn_web_development/Getting_started/Your_first_website), funcionando a partir do seu servidor, com um primeiro registro guardado.

Uma nota sobre o sistema. O curso supõe o **[Linux Mint](https://linuxmint-installation-guide.readthedocs.io/en/latest/)**, e em 7 de outubro de 2026 a versão que o site dele oferece como vigente é a [22.3](https://linuxmint.com/download.php) (“Zena”), em suas três edições: Cinnamon, Xfce e MATE. Tudo nesta lição é igual nas três; a única coisa que muda é o aspecto do menu. A versão 22 do Mint é construída sobre o Ubuntu 24.04, e por isso traz o Python 3.12 e uma versão do Git da série 2.43; se a sua difere ligeiramente, não importa, nada do que usamos é recente.

## Os conceitos

São três, e você vai usá-los nesta ordem em cada sessão de trabalho do curso.

### 1.1 A oficina: terminal, pastas e editor

#### O terminal: escrever o que antes você fazia com o mouse

O **terminal** é uma janela onde, em vez de clicar, você digita comandos. Pode parecer um passo atrás; é o contrário. Um comando escrito pode ser repetido, colado numa mensagem, guardado num arquivo e automatizado, coisas que um clique não permite. Além disso, quase tudo o que você vai aprender na sua carreira de programação —servidores, Git, ferramentas— é operado a partir dali. Para abri-lo no Mint, pressione `Ctrl`+`Alt`+`T`, ou procure “Terminal” no menu.

O que você verá é uma linha parecida com esta:

```text
ana@mint:~$ 
```

Lê-se assim: `ana` é o seu usuário, `mint` o nome do seu computador, `:` separa, `~` é **onde você está** (mais abaixo, o que significa) e `$` quer dizer “estou pronto para você escrever”. **O `$` nunca se digita.** Nos exemplos deste curso, uma linha que começa com `$ ` é um comando que você digita (sem esse símbolo), e as linhas que vêm depois são o que o terminal responde. Cada comando termina ao pressionar `Enter`. (A Lição 0 já adiantou essa convenção; aqui você a vê com o seu próprio terminal à frente.)

Três [atalhos](https://missing.csail.mit.edu/2020/course-shell/) que poupam metade da digitação, desde hoje: a tecla `Tab` completa os nomes (digite as primeiras letras de uma pasta e pressione `Tab`); as setas para cima e para baixo percorrem os comandos que você já digitou; e `Ctrl`+`C` **interrompe** o que estiver rodando, que você usará para parar o seu servidor. E um quarto, `Ctrl`+`L`, que limpa a tela sem apagar nada.

#### Onde você está: as pastas e os caminhos

O terminal sempre está “parado” numa pasta, e os comandos agem sobre ela a menos que você diga outra coisa. Para saber em qual você está, existe o [`pwd`](https://man7.org/linux/man-pages/man1/pwd.1.html) (*print working directory*, imprime o diretório de trabalho):

```bash
$ pwd
/home/ana
```

Essa é a sua **pasta pessoal**, ou *home*: o lugar onde vivem os seus arquivos, e o que o terminal abre por padrão. Ela se abrevia com o símbolo `~`, por isso no aviso de cima dizia `~`. Repare que o caminho usa as mesmas barras que as URLs da Lição 0, e funciona pelo mesmo princípio: um caminho que vai da raiz para dentro. E, como nas URLs, há caminhos **absolutos** (começam na raiz, com `/`, ou na sua pasta pessoal, com `~`) e caminhos **relativos** (partem de onde você está, sem barra inicial). Dois nomes especiais completam o vocabulário: `.` significa “esta pasta” e `..` significa “a pasta de cima”.

Com quatro comandos você já se move por todo o sistema:

| Comando | O que faz | Exemplo |
|---|---|---|
| `pwd` | diz em que pasta você está | `pwd` |
| [`ls`](https://man7.org/linux/man-pages/man1/ls.1.html) | lista o que há na pasta atual | `ls` · `ls -a` mostra também o oculto |
| `cd` | muda de pasta | `cd Documentos` · `cd ..` sobe um nível · `cd` sozinho volta para a sua casa |
| [`mkdir`](https://man7.org/linux/man-pages/man1/mkdir.1.html) | cria uma pasta | `mkdir revisor` |

Um arquivo ou uma pasta cujo nome começa com ponto (`.git`, `.gitignore`) está **oculto**: o `ls` não o mostra a menos que você peça `ls -a`. Os gerenciadores de arquivos gráficos também os escondem; no do Mint ([Nemo](https://linuxmint-user-guide.readthedocs.io/en/latest/)) eles são mostrados ou ocultados com `Ctrl`+`H`. Você vai precisar disso para ver a pasta do Git.

O Linux distingue maiúsculas de minúsculas: `Revisor` e `revisor` são pastas diferentes. Lembre-se da regra que nasceu na Lição 0: **minúsculas, sem espaços e sem acentos** em tudo o que você cria. Se algum dia precisar de um espaço, o terminal vai obrigá-lo a escrever aspas ou barras, e é um bom aviso de que esse nome vai dar problemas.

Crie já a pasta do projeto e entre nela:

```bash
$ cd ~
$ mkdir revisor
$ cd revisor
$ pwd
/home/ana/revisor
$ ls
```

O último `ls` não imprime nada, porque a pasta está vazia, e isso é o correto. Se, em vez disso, o terminal responder `mkdir: no se puede crear el directorio «revisor»: El archivo ya existe` (a mensagem do sistema em espanhol; no seu ela virá em português ou inglês), você já havia criado uma com esse nome; entre com `cd revisor` e siga em frente. (A propósito, não existe neste curso nenhum comando que apague coisas: quando algo é apagado pelo terminal, não há lixeira, e começar por aí é uma má ideia. Se algum dia você quiser apagar, faça-o pelo gerenciador de arquivos, que tem lixeira.)

#### O editor

Uma página web é um arquivo de **texto simples**: letras, números e símbolos, sem formatação. Isso quer dizer que **ela não se escreve em um processador de texto** (como o LibreOffice Writer), que guarda além disso tipografias, margens e estilos que o navegador não entende. Escreve-se em um **editor de código**, que guarda só o texto e, além disso, ajuda você: colore conforme a linguagem, indenta sozinho, avisa de parênteses sem fechar.

O Linux Mint traz um simples, o **Xed**, que serve. Neste curso usaremos o **Visual Studio Code** (VS Code), um editor gratuito de uso muito difundido, porque mostra a árvore de pastas do projeto, traz um terminal integrado e se usa igual em qualquer sistema, de modo que o que você aprender aqui você reaproveita onde for. Se você prefere outro editor, funcionará: a única coisa que o curso exige é que ele guarde texto simples, em [UTF-8](https://www.rfc-editor.org/rfc/rfc3629) e com quebras de linha do Linux.

Para instalar o VS Code no Mint, a [documentação oficial do editor](https://code.visualstudio.com/docs/setup/linux) indica baixar o pacote `.deb` do site dele, na seção de downloads para Linux (escolha a opção `.deb` de 64 bits), e depois instalá-lo pelo terminal. Se você o baixou com o Firefox, o arquivo ficou na sua pasta de downloads (no bloco abaixo aparece `~/Descargas`, o nome que ela tem num sistema em espanhol; no seu, em português, é `~/Downloads`):

```bash
$ cd ~/Descargas
$ sudo apt install ./code_*.deb
```

Duas coisas novas nessa linha. `apt` é o **[gerenciador de pacotes](https://developer.mozilla.org/pt-BR/docs/Learn_web_development/Getting_started/Environment_setup/Installing_software)** do Mint: o programa que instala, atualiza e remove software, resolvendo sozinho as dependências. E `sudo` é a palavra que significa “faça com permissões de administrador”: instalar programas para todo o sistema as requer, e por isso o `sudo` pede **a sua senha**. Quando você a digitar, não verá nada na tela, nem asteriscos: não é que não funcione, é uma medida para que ninguém a leia por cima do seu ombro. Digite-a completa e pressione `Enter`. Uma regra de higiene que convém ter desde o primeiro dia: **não cole no terminal um comando com `sudo` que você não entenda**; com ele, a máquina faz o que você diz sem perguntar se você tem certeza. (Esse pacote, aliás, configura um repositório para que o editor seja atualizado junto com o resto do sistema, como descreve a própria documentação do VS Code.)

Com o editor instalado, abra-o **sobre a pasta do projeto**, não sobre um arquivo solto. A partir do terminal, já dentro de `~/revisor`, digite:

```bash
$ code .
```

O ponto é a pasta atual: você acabou de abrir o editor “parado” em `revisor`. À esquerda você verá o explorador de arquivos com a pasta (vazia), e na barra de baixo, informações do arquivo. Ao abri-la pela primeira vez, o VS Code vai perguntar se você confia nos autores da pasta: é uma pasta sua, diga que sim. Depois, ative o [salvamento automático](https://code.visualstudio.com/docs/editor/codebasics) para que você não precise se lembrar de salvar: no menu **Arquivo**, marque **Salvamento Automático**. Você verá que continua sendo útil pressionar `Ctrl`+`S` por costume; o salvamento automático é uma rede de segurança, não um substituto. Se o seu editor se oferece para completar blocos inteiros de código por você, desative-o enquanto aprende: escrever cada linha com as suas próprias mãos [faz parte de aprender](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Soft_skills).

Dentro do editor, com a combinação `Ctrl` mais a tecla de crase você abre um terminal integrado que já está parado na pasta do projeto. É a comodidade mais usada, e a que você vai precisar quando o servidor ocupar um terminal e você quiser outro: com o botão `+` desse painel você abre um segundo.

### 1.2 O ciclo de ver: servidor local e ferramentas do navegador

#### A primeira página

Crie o primeiro arquivo do projeto: no explorador do VS Code, com o botão de “Novo arquivo” (ou `Ctrl`+`N` e depois salvar), chame-o de `index.html`. Escreva isto:

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

(A primeira linha, o comentário `<!-- fig01_01.html -->`, é a forma como o repositório do curso identifica este exemplo; você pode copiá-la ou não, é um comentário que o navegador não mostra. O segundo bloco é o que você verá na janela.)

Não peço que você entenda cada [tag](https://developer.mozilla.org/pt-BR/docs/Learn_web_development/Core/Structuring_content/Basic_HTML_syntax) hoje; a Lição 2 é dedicada a isso. Para que o arquivo não seja um texto opaco, isto é o mínimo: `<!DOCTYPE html>` diz ao navegador que leia a página com as regras modernas; `lang="es"` declara o idioma, que importa aos leitores de tela; `<meta charset="utf-8">` declara a codificação (é o que faz “á” e “ñ” aparecerem bem; deve estar perto do início); a tag com `viewport` faz a página se adaptar à largura de um celular, e a usaremos muito na Lição 5; `<title>` é o texto da aba. Tudo o que está dentro de `<body>` é o que se vê na janela: um título (`<h1>`) e um parágrafo (`<p>`) dentro da região principal (`<main>`).

Salve com `Ctrl`+`S`. Há duas formas de vê-lo no navegador. A primeira é a que todo mundo tenta: duplo clique no arquivo no gerenciador de arquivos. Experimente. Funciona, e na barra de endereços você verá algo como `file:///home/ana/revisor/index.html`. Repare no esquema: `file`, não `http`. Aqui não há servidor nem conversa; o navegador leu o arquivo do disco, tal qual.

Para uma página de um único arquivo, isso basta. Para um projeto com mais de um arquivo que se carregam entre si, já não. Vejamos por quê com um pequeno teste, feito de propósito.

#### Um módulo que não carrega

Mais adiante no curso você vai dividir o JavaScript do painel em arquivos pequenos que se importam uns aos outros. Isso se chama **[módulos](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Modules)**, e eles são carregados com [`<script type="module">`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Reference/Elements/script). Veja como fica com um exemplo mínimo: uma página e um arquivo de JavaScript que muda o texto dela. (Você ainda não precisa entender o JavaScript —vem na Lição 6—; basta saber que essa única linha procura o parágrafo cujo identificador é `status` e muda o texto dele.)

Substitua o conteúdo de `index.html` por esta versão e crie ao lado, na mesma pasta, um arquivo `main.js` com o programa. Repare no atributo `src="main.js"`: é uma URL relativa (Lição 0) que significa “o arquivo `main.js` que está junto desta página”.

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

(No repositório do curso esta página se chama `fig01_02.html` e o seu programa `main.js`, um ao lado do outro; na **sua** pasta a página se chama `index.html`. Os dois blocos são copiados tal qual. O terceiro bloco é o que você deve ver quando tudo funciona.)

Agora abra-a com duplo clique, como antes. Você verá o texto “Esperando al módulo.” (“Esperando o módulo.”) e **não** “El módulo cargó.” (“O módulo carregou.”): o programa não foi executado. E ninguém avisou você na janela. Esta é uma das falhas silenciosas mais desconcertantes, e é explicada na seção “O erro que você vai ver”: o aviso está no [Console](https://firefox-source-docs.mozilla.org/devtools-user/web_console/index.html) do navegador, que você aprenderá a abrir em poucos minutos.

A razão de fundo a Lição 0 já levantou. Os módulos são baixados com uma requisição que o navegador faz “em modo de origem cruzada” (o mecanismo que se chama [CORS](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Guides/CORS)), ou seja, sujeita à [política de mesma origem](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy). Uma página aberta a partir de `file://` tem uma [origem opaca](https://url.spec.whatwg.org/#concept-url-origin), e o navegador não permite que ela faça esse download. A solução não é um truque no código: é entregar o projeto por HTTP, como fará o mundo real.

#### O servidor local: `python3 -m http.server`

Faz falta um [servidor web](https://developer.mozilla.org/pt-BR/docs/Glossary/Server), e não um pesado: um mínimo que leia arquivos da pasta e os entregue por HTTP. O seu computador já traz um, incluído no Python. Você já está na pasta do projeto; a partir do terminal, digite:

```bash
$ python3 -m http.server 8000 --bind 127.0.0.1
Serving HTTP on 127.0.0.1 port 8000 (http://127.0.0.1:8000/) ...
```

Destrinche cada peça dessa linha, porque cada uma responde algo da Lição 0:

- `python3 -m http.server` executa (`-m`, “módulo”) o servidor web que vem na biblioteca padrão do Python. Não é preciso instalar nada; é a única coisa do Python que este curso usa.
- `8000` é a **porta**: a “porta” em que ele escuta. É um número arbitrário maior que 1024; o 8000 é um costume. Se a sua pasta usar outro, você o escreve igual na URL.
- `--bind 127.0.0.1` limita o servidor à **sua própria máquina**. É uma precaução que importa: por padrão, este servidor escuta em *todas* as interfaces de rede, e a documentação do Python adverte que ele não foi pensado para produção. Com `--bind 127.0.0.1` você só escuta a si mesmo.
- A linha que ele imprime diz em que endereço serve a pasta atual.

O terminal ficou “ocupado”: não devolve o aviso `$`, porque o servidor continua rodando e escrevendo ali o que acontece. Deixe-o assim e abra outro (no VS Code, o botão `+` do painel de terminal; ou uma janela nova). Para pará-lo, algum dia, você volta a esse terminal e pressiona `Ctrl`+`C`.

Agora abra o navegador e digite `http://localhost:8000/` (`localhost` é um nome [reservado para a sua própria máquina](https://www.rfc-editor.org/rfc/rfc6761)). Como você viu na Lição 0, esse nome corresponde a dois endereços, `127.0.0.1` e o de IPv6, `::1`; o servidor só escuta no primeiro, e o navegador, se não respondem em um, tenta o outro (conferi com Chrome, Firefox e `curl`). Se algum dia o `localhost` não abrir a página, digite o endereço que o servidor imprimiu, `http://127.0.0.1:8000/`. A página que você vê é a mesma, mas agora o texto diz **“El módulo cargó.”**: o programa foi executado. A diferença é exatamente o esquema: antes `file://`, agora `http://`.

Veja o que o terminal do servidor escreveu enquanto isso, que é a conversa da Lição 0 em versão resumida:

```text
127.0.0.1 - - [07/Oct/2026 10:55:10] "GET / HTTP/1.1" 200 -
127.0.0.1 - - [07/Oct/2026 10:55:10] "GET /main.js HTTP/1.1" 200 -
127.0.0.1 - - [07/Oct/2026 10:55:10] code 404, message File not found
127.0.0.1 - - [07/Oct/2026 10:55:10] "GET /favicon.ico HTTP/1.1" 404 -
```

Cada linha é uma requisição que chegou. Lê-se: quem a fez (`127.0.0.1`, você), quando, a linha de requisição entre aspas (método, caminho e versão) e o código de status. Três coisas a notar. **Uma:** um único acesso à página produziu **três** requisições, não uma: o HTML, o programa que o HTML pede, e algo que você não pediu. É o mecanismo da Lição 0, em pequena escala. **Duas:** o HTML foi pedido com `GET /`, o caminho que você digitou, que é uma pasta e não um arquivo; o servidor respondeu com o `index.html` dessa pasta, a convenção que você viu na Lição 0. O registro anota o que foi pedido, não o arquivo que foi entregue. **Três:** o [`404`](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Reference/Status/404) de `/favicon.ico` não é um erro seu. O **[favicon](https://html.spec.whatwg.org/multipage/)** é o pequeno ícone da aba; os navegadores o pedem por conta própria, nesse caminho, sem que você diga em lugar nenhum. Como não há nenhum, o servidor responde “não encontrado”. É inofensivo e ensina algo importante: *o navegador faz requisições que a sua página não pediu.* No Exercício 2 você vai silenciá-lo.

Você pode ver também o que o servidor responde *no nível dos cabeçalhos*, com o [`curl`](https://curl.se/docs/manpage.html) (instale-o, se não o tiver, com `sudo apt install curl`; o [tutorial oficial](https://curl.se/docs/tutorial.html) dele ensina o resto das opções):

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

(Esta saída eu medi em outro computador, com o Python 3.12.12; no Linux Mint 22 a linha `Server` dirá a versão que o sistema traz, `Python/3.12.3` no momento em que escrevo. As datas serão outras, e o `Content-Length` só coincidirá se você copiou o arquivo tal qual, com o seu comentário.) Você reconhece tudo: a linha de status com [`HTTP/1.0`](https://www.rfc-editor.org/rfc/rfc1945) —este servidor de prática usa essa versão por padrão—, o [`Content-type`](https://developer.mozilla.org/en-US/docs/Glossary/MIME_type) calculado pela extensão do arquivo (`.js` → `text/javascript`; o MDN documenta o cabeçalho completo em [`Content-Type`](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Reference/Headers/Content-Type)), o tamanho do corpo, a data de modificação. É o seu próprio servidor, falando o idioma da Lição 0.

Duas observações sobre o uso diário. Se você esquecer em que pasta o iniciou, lembre-se de que **o servidor publica a pasta a partir da qual você o executa**: iniciá-lo na sua pasta pessoal publicaria, para quem conseguisse alcançar o servidor, tudo o que há ali (por isso `--bind 127.0.0.1` e por isso sempre `cd revisor` primeiro). E se você muda um arquivo e recarrega, o servidor entrega a versão nova sem reiniciar; não é preciso pará-lo a cada vez, só quando você muda de projeto.

#### As ferramentas do navegador

O seu navegador tem uma oficina incorporada para ver por dentro o que foi carregado: as **[ferramentas do desenvolvedor](https://developer.chrome.com/docs/devtools/overview)**. Abrem-se com `F12` (ou `Ctrl`+`Shift`+`I`) e se dividem em abas. Usaremos o Firefox, que vem com o Mint; nos navegadores baseados em Chromium há as mesmas com nomes quase idênticos. Para esta lição, três abas bastam:

**[Inspetor](https://firefox-source-docs.mozilla.org/devtools-user/page_inspector/index.html).** Mostra o documento como o navegador o entende: uma árvore de elementos. Clique com o botão direito no parágrafo da página e escolha **Inspecionar**: abre-se o Inspetor, com o elemento destacado. Você pode expandir e recolher a árvore, e até editar um texto com duplo clique para ver o efeito (só dura até recarregar: é um experimento, não muda o seu arquivo). Aqui você verá “El módulo cargó.”.

E aqui está uma das ideias mais valiosas da lição. Com a página aberta, pressione `Ctrl`+`U`, que abre **Exibir código-fonte**. Ali você verá o HTML tal como chegou do servidor, com “Esperando al módulo.” no parágrafo. **O código-fonte é o que o servidor enviou; o Inspetor é o que o navegador tem agora, depois de executar o JavaScript.** Podem ser diferentes, e no painel quase sempre serão, porque o JavaScript o desenhará. Quando algo “não aparece” na tela, olhar ambos diz se o servidor não o enviou ou se o seu programa não o desenhou. Sem essa distinção, é fácil perder uma tarde.

**Console.** É onde o navegador escreve seus avisos e os erros do seu JavaScript, cada um com o arquivo e a linha que o causou. Abra-o e deixe-o visível enquanto trabalha. Uma regra que adotaremos como critério de saída do curso: **o Console deve estar vazio** (nem erros nem avisos). Com a página servida, o seu estará, com uma exceção que convém conhecer: o Chrome anota no Console o `404` do `favicon.ico` de que falamos acima (medi; em outros navegadores pode não aparecer), e ele desaparece assim que você fizer o Exercício 2. Com a página aberta por `file://`, ele terá o erro do módulo que vimos acima.

**[Rede](https://firefox-source-docs.mozilla.org/devtools-user/network_monitor/index.html).** Você a conhecia da Lição 0. Agora, com o seu servidor, é muito mais reveladora: abra a aba, recarregue com `F5` e você verá três linhas: o documento, o `main.js` e o `favicon.ico`, com seus status `200`, `200` e `404`. São as mesmas três linhas que o seu servidor escreveu, vistas do outro lado. Clique na de `main.js` e olhe os cabeçalhos: o `Content-type: text/javascript` de cima, com o seu servidor. Ali mesmo marque **Desativar [cache](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Reference/Status/304)** (uma caixa de seleção na barra da aba ou no menu de ajustes dela, conforme a sua versão): enquanto as ferramentas estiverem abertas, o navegador não reutilizará cópias velhas. Resolve o problema de “editei e a mudança não aparece” antes que ele surja. Com as ferramentas fechadas, o [cache](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Guides/Caching) volta a agir; se tiver dúvida, `Ctrl`+`Shift`+`R` força um recarregamento que o ignora.

O ciclo já está completo. Toda vez que você mudar algo, a rotina é sempre a mesma: **edita, salva, recarrega, olha o Console e a [aba Rede](https://developer.chrome.com/docs/devtools/network).** Se algo não aparece, a primeira coisa a olhar é o Console.

### 1.3 O ponto de retorno: Git

#### Que problema resolve

Mais cedo ou mais tarde, você vai mudar algo que funcionava e deixará de funcionar, e não se lembrará exatamente do que mexeu. Sem um registro, a saída é desfazer à mão o que você acha que mudou. O **Git** é um sistema de **[controle de versões](https://git-scm.com/book/pt-br/v2/Primeiros-Passos-Sobre-Controle-de-Vers%c3%a3o)**: um programa que guarda, por ordem sua, fotografias do estado da sua pasta, cada uma com uma mensagem que diz o que mudou e por quê. Com elas você pode ver o que foi modificado, comparar com qualquer ponto anterior e voltar atrás. É a ferramenta mais usada do mundo para isso, e você a verá em qualquer equipe; o curso *Missing Semester* do MIT dedica a ela [uma aula inteira](https://missing.csail.mit.edu/2020/version-control/), se você quiser entender como ela guarda o histórico por dentro.

Não o confunda com GitHub ou GitLab: o Git funciona **só na sua máquina**, sem internet. Os serviços como o GitHub são lugares onde você pode *compartilhar* um repositório Git; aqui ainda não precisamos deles. Para esta lição, o Git é o seu histórico pessoal.

Há um modelo mental que o torna compreensível, e são três zonas. Seus arquivos vivem na **pasta de trabalho**, onde você os edita. Quando algo está pronto para ser guardado, você o passa para a **[área de preparação](https://git-scm.com/book/pt-br/v2/Fundamentos-do-Git-Gravando-Altera%c3%a7%c3%b5es-no-Reposit%c3%b3rio)** (*stage*): uma sala de espera onde você decide exatamente o que entrará na próxima fotografia. E a fotografia em si, que se chama **commit** (confirmação), fica guardada no **repositório**. Três passos, três comandos: `git add` move para a sala de espera, [`git commit`](https://git-scm.com/docs/git-commit) tira a fotografia.

#### Preparar o Git, uma vez

Primeiro, diga a ele quem você é: cada commit leva um autor. Isso se faz uma única vez na sua conta do computador, com os seus dados reais (o e-mail é só um rótulo; não é enviado a lugar nenhum):

```bash
$ git config --global user.name "Ana Pérez"
$ git config --global user.email "ana@example.com"
```

Se o Git não estiver instalado (`git --version` diz), instala-se com `sudo apt install git`.

#### O primeiro registro

Na pasta do projeto, crie o repositório com [`git init`](https://git-scm.com/docs/git-init). A opção `-b main` dá o nome `main` ao ramo principal, que é o costume atual:

```bash
$ git init -b main
Inicializado repositorio Git vacío en /home/ana/revisor/.git/
```

O Git criou uma pasta oculta, `.git`, que é onde vive todo o histórico. Não mexa nela à mão; se você a apagar, perde o histórico. Pergunte a ele como vê o projeto:

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

[`git status`](https://git-scm.com/docs/git-status) é o comando que você mais vai executar: diz onde está cada coisa. Aqui ele informa que `index.html` e `main.js` estão **sem rastreamento**: existem na pasta de trabalho, mas o Git ainda não os conhece. Passe os dois para a sala de espera (`git add` aceita vários nomes) e pergunte de novo:

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

Agora os dois constam sob “Cambios a ser confirmados” (“Alterações a serem confirmadas”): estão na sala de espera. Tire a fotografia com uma mensagem:

```bash
$ git commit -m "Primer index.html del revisor"
[main (commit-raíz) ff110e5] Primer index.html del revisor
 2 files changed, 18 insertions(+)
 create mode 100644 index.html
 create mode 100644 main.js
```

O que diz: foi guardado um commit no ramo `main`, identificado pelo código `ff110e5` (os primeiros caracteres da impressão digital dele; a do seu será outra), com dois arquivos que mudaram e as linhas que foram adicionadas (o número depende de quantas linhas os seus arquivos tenham). Essa linha de resumo sai em inglês mesmo que o seu sistema esteja em outro idioma: o Git não a traduz. Para vê-lo na lista do histórico:

```bash
$ git log --oneline
ff110e5 Primer index.html del revisor
```

Um commit por linha, o mais recente em cima. Você já tem o seu primeiro ponto de retorno.

#### O ciclo com o Git

O padrão é sempre o mesmo e é curto: **muda, olha o que mudou, prepara, guarda.** Edite o `index.html` (por exemplo, mude o texto do parágrafo) e pergunte o que foi modificado com [`git diff`](https://git-scm.com/docs/git-diff), que mostra linha por linha o que mudou em relação ao último commit (as linhas com `-` foram removidas; as linhas com `+` foram adicionadas):

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

(Neste exemplo mudou-se o texto do parágrafo: a linha com `-` é a de antes e a de `+`, a de agora; o Git mostra além disso três linhas de contexto em cima e embaixo. Os números da linha `index` dependem do conteúdo exato do seu arquivo, então os seus podem ser outros.) Vê-lo antes de guardar é o melhor costume do Git: pega erros, como uma mudança que você não pretendia. Depois, `git add` e `git commit` de novo.

Algumas regras de uso que poupam dores de cabeça. **As mensagens dizem o quê e por quê**, numa frase curta: “Agrega la tabla de servicios” (“Adiciona a tabela de serviços”) serve; “cambios” (“mudanças”) e “asdf” não servem, porque daqui a um mês não dirão nada a você. **Um commit por ideia**: não misture no mesmo uma correção e uma função nova. E o costume do curso: **ao terminar cada lição, um commit** com o estado em que o painel ficou. Assim, se a Lição 8 estragar algo, a 7 continua intacta e recuperável. Uma última nota: o Git não acompanha pastas vazias, só arquivos; por isso `css/`, `js/` ou `data/` não aparecerão no `git status` até que tenham algo dentro.

## O erro que você vai ver

Há três erros quase inevitáveis nesta lição. Reproduza-os de propósito: vê-los aqui, com a causa à mão, é muito mais barato do que topar com eles sozinho.

### O módulo bloqueado pelo CORS

Abra o `index.html` (a versão do módulo, `fig01_02`) com duplo clique, para que a barra diga `file:///…`. Abra o Console com `F12`. No Chrome, a mensagem que foi medida em 7 de outubro de 2026 (com o caminho adaptado ao Linux, o resto textual) é:

```text
Access to script at 'file:///home/ana/revisor/main.js' from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: chrome, chrome-experimental-site-token-provider, chrome-extension, chrome-untrusted, data, http, https, isolated-app.
```

No Firefox, a mensagem tem outra redação e menciona um motivo que a documentação da Mozilla descreve assim: **“[Reason: CORS request not HTTP](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Guides/CORS/Errors/CORSRequestNotHttp)”**, ou seja, que a requisição de origem cruzada não é HTTP; num Firefox em português, essa parte aparecerá traduzida. Embora a redação mude, a informação é a mesma.

**O que significa:** a página tem `origin 'null'` —a [origem opaca](https://html.spec.whatwg.org/multipage/browsers.html#concept-origin-opaque) dos arquivos locais—, e pediu um módulo; uma requisição desse tipo só pode ser feita sobre HTTP ou [HTTPS](https://developer.mozilla.org/pt-BR/docs/Glossary/HTTPS), e a sua estava em `file://`. Por isso o programa não foi executado. **Como se resolve:** servindo a pasta com `python3 -m http.server`, como você fez. Não há nada a consertar no código.

### Address already in use

Se você iniciar o servidor e já havia um nessa porta —porque o deixou rodando em outro terminal—, o Python responde com um erro longo cuja última linha é a que importa. No Linux é:

```text
OSError: [Errno 98] Address already in use
```

(Em outros sistemas o número muda; a frase é a mesma. O 98 é o valor de [`EADDRINUSE`](https://man7.org/linux/man-pages/man3/errno.3.html), “endereço em uso”, no Linux.) **O que significa:** outro programa já escuta na porta 8000; só um pode fazê-lo por vez. **Como se resolve:** se é o seu próprio servidor esquecido, vá ao terminal dele e pare-o com `Ctrl`+`C`; ou use outra porta: `python3 -m http.server 8001 --bind 127.0.0.1` (e então a URL é `http://localhost:8001`).

### A identidade do Git

Se você esquecer o passo do [`git config`](https://git-scm.com/docs/git-config) e o seu sistema não conseguir deduzir um e-mail razoável, o primeiro `git commit` se recusa com uma mensagem que começa com `Identidad del autor desconocido` e termina com `fatal: no es posible auto-detectar la dirección de correo` (a redação em espanhol; no seu sistema virá em português ou, em inglês: `Author identity unknown` e `fatal: unable to auto-detect email address`). Às vezes o Git de fato deduz um nome e um e-mail com base no seu usuário e no nome da máquina, e faz o commit mostrando um aviso para você conferir se estão corretos. **O que significa:** o Git se nega a guardar um registro sem saber em nome de quem ele vai. **Como se resolve:** rode os dois comandos de `git config --global` de cima (e, se o commit já saiu com a identidade automática, `git commit --amend --reset-author` a substitui).

## O que se faz errado

**Desenvolver abrindo o arquivo com duplo clique.** Funciona até o dia em que você deixa de ver algo que deveria funcionar: módulos, `fetch`, fontes. Custo: horas atribuindo ao seu código uma falha da origem. Correção: sempre o servidor local, desde a primeira linha.

**Iniciar o servidor na pasta errada.** Um `python3 -m http.server` lançado na sua pasta pessoal, sem `--bind`, publica tudo o que há ali para toda a rede local. Numa instalação nova do Mint, o firewall costuma vir desativado, então nada o impediria. Custo: seus documentos expostos numa rede de cafeteria. Correção: `cd revisor` antes de iniciar, e `--bind 127.0.0.1` sempre.

**Escrever em um processador de texto.** Um `.docx` renomeado para `.html` não é um HTML. Custo: uma página cheia de símbolos. Correção: editor de código, texto simples, UTF-8.

**Pôr espaços, acentos ou maiúsculas nos nomes.** `Mi Página.html` parece bem hoje e quebra amanhã, no terminal e na URL (a Lição 0 explicou por quê). Correção: `mi-pagina.html`.

**Recarregar sem olhar o Console.** O erro está escrito, com arquivo e linha, e ninguém o lê. Custo: depurar às cegas. Correção: o Console sempre aberto.

**Um commit que diz “cambios”.** Serve no dia em que você o escreve e nunca mais. Correção: uma frase que diga o quê e por quê.

**Colar comandos com `sudo` sem lê-los.** Com `sudo` a máquina obedece sem perguntar. Correção: antes de pressionar `Enter`, saiba o que cada palavra faz.

## Exercícios

### Exercício 1 — A estrutura do projeto

Dentro de `~/revisor`, crie três pastas: `css`, `js` e `data`, com um único comando (dica: `mkdir` aceita vários nomes). Verifique com `ls`. Depois pergunte ao Git com `git status`: ele as lista como mudanças? Por quê?

### Exercício 2 — Silenciar o favicon

Com o servidor rodando e a aba Rede aberta, recarregue a página e anote o status de `favicon.ico`. Adicione dentro do `<head>` da página [`<link rel="icon" href="data:,">`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Reference/Elements/link), salve, recarregue com `Ctrl`+`Shift`+`R` e olhe de novo. O que mudou na aba Rede e no registro do servidor? Pesquise o que significa um esquema [`data:`](https://url.spec.whatwg.org/) (dica: a Lição 0 ensinou as partes de uma URL).

### Exercício 3 — Código-fonte contra Inspetor, e um segundo commit

Sirva a versão da página com o módulo (a de `fig01_02`). Abra “Exibir código-fonte” (`Ctrl`+`U`) e o Inspetor. Anote o que o parágrafo diz em cada um e explique a diferença. Depois mude o texto do título, veja a mudança com `git diff`, e guarde-a com um segundo commit. Como fica agora o [`git log --oneline`](https://git-scm.com/docs/git-log)?

### Exercício 4 — Provocar e ler um 404

Com o servidor rodando, renomeie o arquivo `main.js` para `principal.js` pelo gerenciador de arquivos (sem tocar no HTML) e recarregue. Anote, nesta ordem: o que a pessoa vê na página, o que o Console diz, o status que a aba Rede mostra, e a linha que o servidor escreveu. Depois conserte e confira que o Console ficou vazio.

## Soluções

### Exercício 1 — A estrutura do projeto

```bash
$ mkdir css js data
$ ls
css  data  index.html  js  main.js
$ git status
En la rama main
nada para hacer commit, el árbol de trabajo está limpio
```

O Git não as lista porque **só acompanha arquivos, não pastas**; uma pasta vazia não tem nada a registrar. Elas aparecerão no `git status` assim que contiverem um arquivo. (Se você já havia mudado o `index.html` sem guardar um commit, o `git status` o mostrará como modificado; isso é outro assunto.)

### Exercício 2 — Silenciar o favicon

A página fica assim:

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

Antes: uma linha com `favicon.ico` e status `404`, e no servidor `code 404, message File not found`. Depois: já não há requisição a `favicon.ico`, porque o próprio HTML declara o ícone. O esquema `data:` é uma URL que **leva o conteúdo dentro de si mesma**, em vez de apontar para um lugar onde pedi-lo; a que escrevemos, `data:,`, contém um conteúdo vazio, ou seja, um ícone invisível, e por isso o navegador não precisa pedir nada. (A página de exemplo `example.com`, da Lição 0, faz exatamente o mesmo.) Mais adiante poremos um ícone de verdade.

### Exercício 3 — Código-fonte contra Inspetor, e um segundo commit

“Exibir código-fonte” mostra `Esperando al módulo.`; o Inspetor mostra `El módulo cargó.`. A diferença é que o código-fonte é o que o servidor enviou, antes de executar o JavaScript, e o Inspetor é o estado atual do documento, depois de o `main.js` mudar o texto.

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

Dois commits, o mais recente em cima; os códigos da esquerda serão outros na sua máquina.

### Exercício 4 — Provocar e ler um 404

O que a pessoa vê: a página com “Esperando al módulo.”, sem nenhum aviso na janela. No servidor, aparecem estas linhas (medidas em 7 de outubro de 2026):

```text
127.0.0.1 - - [07/Oct/2026 10:56:09] code 404, message File not found
127.0.0.1 - - [07/Oct/2026 10:56:09] "GET /main.js HTTP/1.1" 404 -
```

A aba Rede mostra a linha de `main.js` com status `404`. O Console mostra um erro ao carregar o módulo; a redação dele depende do navegador e costuma mencionar o status `404` ou que o servidor respondeu com um tipo de conteúdo que não é JavaScript —a página de erro do servidor é HTML—, e é o cabeçalho `Content-Type` da Lição 0 em ação. A correção é devolver o nome ao arquivo (`main.js`). A lição é a mesma da Lição 0: a página sem programa não é um mistério, é uma requisição secundária que falhou, e se vê em três lugares ao mesmo tempo.

## Como sei que consegui

- `pwd` dentro da pasta do projeto imprime `/home/<seu usuário>/revisor`.
- `python3 -m http.server 8000 --bind 127.0.0.1` imprime `Serving HTTP on 127.0.0.1 port 8000 (http://127.0.0.1:8000/) ...` e `http://localhost:8000/` mostra a página.
- Com a página servida (e o `favicon` silenciado do Exercício 2), o **Console está vazio** e a aba Rede mostra o documento com status `200`.
- Aberta a mesma página com duplo clique (`file://`), o Console de fato mostra o erro do módulo, e você sabe explicar por quê.
- `git log --oneline` imprime ao menos um commit com uma mensagem que explica o que você guardou, e `git status` diz `nada para hacer commit, el árbol de trabajo está limpio` (a mensagem em espanhol: “nada a confirmar, árvore de trabalho limpa”; no seu sistema pode vir em português ou inglês).
- Sem olhar a lição, você consegue responder: o que “Exibir código-fonte” mostra que o Inspetor não mostra, e ao contrário?

Se tudo está em ordem, o seu ambiente já é o de qualquer profissional da web, e o resto do curso se faz sobre ele. Anote no [diário de bordo](https://github.com/HabilMX/curso-web/blob/main/pt/bitacora.md) o que foi difícil para você. Na Lição 2 você escreverá o esqueleto do painel com HTML que diz o que significa. E se você quiser ver desde já aonde o caminho leva, o [curso de TypeScript](https://www.habil.mx/pt/cursos/typescript/) desta casa refaz este mesmo painel com tipos e com React.

## Para ler mais

- [Como lidar com os arquivos de um projeto, do MDN](https://developer.mozilla.org/pt-BR/docs/Learn_web_development/Getting_started/Environment_setup/Dealing_with_files) — o guia do MDN para organizar os arquivos de um projeto, um bom complemento desta lição.
- [Documentação do `http.server`, do Python](https://docs.python.org/pt-br/3/library/http.server.html) — todas as opções do servidor que usamos, e o aviso de segurança sobre o seu uso.
- [Pro Git, o livro oficial, em português](https://git-scm.com/book/pt-br/v2) — o capítulo “Fundamentos de Git” é o próximo passo natural.
- [The Missing Semester of Your CS Education (MIT)](https://missing.csail.mit.edu/) — um curso gratuito sobre o terminal, o editor e o controle de versões, que explica por que essas ferramentas merecem o seu tempo.
