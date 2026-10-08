# Leçon 1 — Ton poste et le cycle de travail

**Durée :** 90 min (ou 2 × 45)

**Ce que tu construis :** l'environnement de travail —dossier, éditeur, serveur local, outils du navigateur et Git— et le premier `index.html` du `revisor`, ouvert depuis ton propre serveur.

**Ce que tu apprends :** éditeur, terminal et dossiers ; serveur local dès le premier jour ; les outils du navigateur ; un premier enregistrement dans Git.

**Les pages de cette leçon.** Elles se trouvent toutes dans [`programas/01-entorno-ciclo-trabajo/`](https://github.com/HabilMX/curso-web/tree/main/programas/01-entorno-ciclo-trabajo) du [dépôt du cours](https://github.com/HabilMX/curso-web). Ici, c'est toi qui les écriras, pas à pas ; le dossier sert à comparer ta copie avec la bonne quand quelque chose ne coïncide pas.

## À la fin, tu seras capable de

- Te déplacer dans les dossiers depuis le terminal (`pwd`, `ls`, `cd`, `mkdir`) et créer le dossier du projet dans ton répertoire personnel.
- Écrire un `index.html` dans l'éditeur, l'enregistrer et le voir dans le navigateur depuis un serveur local que tu lances avec `python3 -m http.server`.
- Expliquer pourquoi un module JavaScript ne se charge pas depuis `file://` et reconnaître le message du navigateur quand cela arrive.
- Utiliser l'Inspecteur, la Console et l'onglet Réseau pour voir ce que le navigateur a reçu, quelles erreurs il y a eu et quelles requêtes ton serveur a enregistrées.
- Distinguer « Code source de la page » de l'Inspecteur, et expliquer pourquoi ils peuvent montrer des choses différentes.
- Faire ton premier enregistrement dans Git et le lire avec `git status`, `git diff` et `git log --oneline`.

## Le pourquoi avant le comment

Tu vas répéter le même geste des centaines de fois tout au long du cours : changer une ligne, enregistrer, aller au [navigateur](https://developer.mozilla.org/fr/docs/Glossary/Browser), recharger, regarder ce qui s'est passé. Ce cycle —écrire, enregistrer, recharger, inspecter— est le [rythme réel](https://web.dev/learn) de celui qui fait des pages web, et de lui dépend ce que tu apprends par heure. Si chaque tour coûte dix secondes de friction inutile, ou si le résultat que tu vois ne coïncide pas avec celui que verra n'importe qui d'autre, la fatigue arrive avant la compréhension. Un environnement bien monté est ce qui te fait te tromper vite et comprendre pourquoi.

Et il y a une raison plus concrète, que la [Leçon 0](00-como-funciona-la-web.md) a laissée en suspens : une page n'est pas la même si tu l'ouvres en double-cliquant sur le fichier ou si un serveur la sert. Le document que tu ouvres en double-cliquant arrive par `file://`, sans conversation HTTP, sans codes d'état et sans [origine](https://www.rfc-editor.org/rfc/rfc6454) utilisable : le navigateur lui en attribue une « opaque », qui ne coïncide avec aucune autre, et tu verras bientôt quelles en sont les conséquences. Le même document servi par `http://localhost:8000` arrive comme il arrivera le jour où tu le publieras. Si tu développes de la première façon, tu verras « fonctionner » des choses qui échoueront à la publication, et —pire— tu verras échouer des choses dont ton code n'est pas coupable. C'est pourquoi ce cours lance un serveur local dès le premier jour : pas pour frimer, mais pour que ce que tu vois sur ton écran soit [ce que le monde verra](https://resilientwebdesign.com/).

Ce qui a bien un coût, c'est la première heure, et il convient donc de la faire avec méthode. La leçon a trois blocs. D'abord **l'atelier** : le [terminal](https://developer.mozilla.org/fr/docs/Learn_web_development/Getting_started/Environment_setup/Command_line), les dossiers et l'éditeur, qui sont l'endroit où tu passeras ton temps. Ensuite **le cycle du regard** : le serveur local et les outils du navigateur, qui te disent ce qui se passe. Enfin **le point de retour** : [Git](https://git-scm.com/docs/gittutorial), qui enregistre l'état de ton travail pour que te tromper ne soit pas grave. À la fin tu auras un dossier `revisor` avec une [première page](https://developer.mozilla.org/fr/docs/Learn_web_development/Getting_started/Your_first_website), qui fonctionne depuis ton serveur, avec un premier enregistrement sauvegardé.

Une note sur le système. Le cours suppose **[Linux Mint](https://linuxmint-installation-guide.readthedocs.io/en/latest/)**, et le 7 octobre 2026 la version que son site propose comme actuelle est la [22.3](https://linuxmint.com/download.php) (« Zena »), dans ses trois éditions : Cinnamon, Xfce et MATE. Tout ce qui est dans cette leçon est identique dans les trois ; la seule chose qui change est l'aspect du menu. La version 22 de Mint est construite sur Ubuntu 24.04, et c'est pourquoi elle apporte Python 3.12 et une version de Git de la série 2.43 ; si la tienne diffère légèrement, peu importe, rien de ce que nous utilisons n'est récent.

## Les concepts

Ils sont trois, et tu les utiliseras dans cet ordre à chaque session de travail du cours.

### 1.1 L'atelier : terminal, dossiers et éditeur

#### Le terminal : écrire ce que tu faisais avant à la souris

Le **terminal** est une fenêtre où, au lieu de cliquer, tu écris des commandes. Cela peut sembler un pas en arrière ; c'est le contraire. Une commande écrite peut se répéter, se coller dans un message, se sauvegarder dans un fichier et s'automatiser, des choses qu'un clic ne permet pas. De plus, presque tout ce que tu vas apprendre dans ta carrière de programmeur —serveurs, Git, outils— se manie depuis là. Pour l'ouvrir sous Mint, appuie sur `Ctrl`+`Alt`+`T`, ou cherche « Terminal » dans le menu.

Ce que tu verras est une ligne ressemblant à celle-ci :

```text
ana@mint:~$ 
```

Elle se lit ainsi : `ana` est ton utilisateur, `mint` le nom de ton ordinateur, `:` sépare, `~` est **l'endroit où tu es** (plus bas, ce que cela signifie) et `$` veut dire « je suis prêt à ce que tu écrives ». **Le `$` ne s'écrit jamais.** Dans les exemples de ce cours, une ligne qui commence par `$ ` est une commande que tu écris (sans ce symbole), et les lignes qui suivent sont ce que le terminal répond. Chaque commande se termine en appuyant sur `Entrée`. (La Leçon 0 t'avait déjà annoncé cette convention ; ici, tu la vois avec ton propre terminal devant toi.)

Trois [raccourcis](https://missing.csail.mit.edu/2020/course-shell/) qui t'épargnent la moitié de la frappe, dès aujourd'hui : la touche `Tab` complète les noms (écris les premières lettres d'un dossier et appuie sur `Tab`) ; les flèches haut et bas parcourent les commandes que tu as déjà écrites ; et `Ctrl`+`C` **interrompt** ce qui est en cours d'exécution, ce que tu utiliseras pour arrêter ton serveur. Et un quatrième, `Ctrl`+`L`, qui efface l'écran sans rien supprimer.

#### Où tu es : les dossiers et les chemins

Le terminal est toujours « posé » dans un dossier, et les commandes agissent sur lui sauf si tu leur dis autre chose. Pour savoir dans lequel tu es, il y a [`pwd`](https://man7.org/linux/man-pages/man1/pwd.1.html) (*print working directory*, affiche le répertoire de travail) :

```bash
$ pwd
/home/ana
```

C'est ton **dossier personnel**, ou *home* : l'endroit où vivent tes fichiers, et celui que le terminal ouvre par défaut. Il s'abrège avec le symbole `~`, c'est pourquoi dans l'invite ci-dessus il y avait `~`. Remarque que le chemin utilise les mêmes barres obliques que les URL de la Leçon 0, et fonctionne selon le même principe : un chemin qui va de la racine vers l'intérieur. Et, comme dans les URL, il y a des chemins **absolus** (ils commencent à la racine, avec `/`, ou dans ton dossier personnel, avec `~`) et des chemins **relatifs** (ils partent de l'endroit où tu es, sans barre oblique initiale). Deux noms spéciaux complètent le vocabulaire : `.` signifie « ce dossier » et `..` signifie « le dossier du dessus ».

Avec quatre commandes, tu te déplaces déjà dans tout le système :

| Commande | Ce qu'elle fait | Exemple |
|---|---|---|
| `pwd` | dit dans quel dossier tu es | `pwd` |
| [`ls`](https://man7.org/linux/man-pages/man1/ls.1.html) | liste ce qu'il y a dans le dossier actuel | `ls` · `ls -a` montre aussi ce qui est caché |
| `cd` | change de dossier | `cd Documentos` · `cd ..` monte d'un niveau · `cd` seul revient chez toi |
| [`mkdir`](https://man7.org/linux/man-pages/man1/mkdir.1.html) | crée un dossier | `mkdir revisor` |

Un fichier ou un dossier dont le nom commence par un point (`.git`, `.gitignore`) est **caché** : `ls` ne le montre pas à moins que tu ne demandes `ls -a`. Les gestionnaires de fichiers graphiques les cachent aussi ; dans celui de Mint ([Nemo](https://linuxmint-user-guide.readthedocs.io/en/latest/)) on les affiche ou on les masque avec `Ctrl`+`H`. Tu en auras besoin pour voir le dossier de Git.

Linux distingue majuscules et minuscules : `Revisor` et `revisor` sont des dossiers différents. Rappelle-toi la règle née dans la Leçon 0 : **minuscules, sans espaces et sans accents** dans tout ce que tu crées. Si un jour tu as besoin d'une espace, le terminal t'obligera à écrire des guillemets ou des barres obliques inverses, et c'est un bon signal que ce nom va causer des problèmes.

Crée dès maintenant le dossier du projet et entres-y :

```bash
$ cd ~
$ mkdir revisor
$ cd revisor
$ pwd
/home/ana/revisor
$ ls
```

Le dernier `ls` n'affiche rien, parce que le dossier est vide, et c'est ce qu'il faut. Si, à la place, le terminal te répond `mkdir: no se puede crear el directorio «revisor»: El archivo ya existe` (« impossible de créer le répertoire "revisor" : le fichier existe déjà », dans un système en espagnol), c'est que tu en avais déjà créé un avec ce nom ; entres-y avec `cd revisor` et continue. (Soit dit en passant, il n'existe dans ce cours aucune commande qui supprime des choses : quand quelque chose est supprimé depuis le terminal, il n'y a pas de corbeille, et commencer par là est une mauvaise idée. Si un jour tu veux supprimer, fais-le depuis le gestionnaire de fichiers, qui, lui, a une corbeille.)

#### L'éditeur

Une page web est un fichier de **texte brut** : lettres, chiffres et symboles, sans mise en forme. Cela veut dire qu'**on ne l'écrit pas dans un traitement de texte** (comme LibreOffice Writer), qui enregistre aussi des polices, des marges et des styles que le navigateur ne comprend pas. On l'écrit dans un **éditeur de code**, qui n'enregistre que le texte et, en plus, t'aide : il colore selon le langage, indente tout seul, signale les parenthèses non fermées.

Linux Mint en apporte un simple, **Xed**, qui convient. Dans ce cours nous utiliserons **Visual Studio Code** (VS Code), un éditeur gratuit très répandu, parce qu'il montre l'arborescence des dossiers du projet, apporte un terminal intégré et s'utilise de la même façon sur n'importe quel système, de sorte que ce que tu apprends ici, tu le réutilises partout. Si tu préfères un autre éditeur, cela marchera : la seule chose que le cours exige est qu'il enregistre du texte brut, en [UTF-8](https://www.rfc-editor.org/rfc/rfc3629) et avec les sauts de ligne de Linux.

Pour installer VS Code sous Mint, la [documentation officielle de l'éditeur](https://code.visualstudio.com/docs/setup/linux) indique de télécharger le paquet `.deb` depuis son site, dans la section des téléchargements pour Linux (choisis l'option `.deb` 64 bits), puis de l'installer depuis le terminal. Si tu l'as téléchargé avec Firefox, le fichier est resté dans ton dossier de téléchargements (sur un système en espagnol, `~/Descargas` ; sur un système en français, `~/Téléchargements`) :

```bash
$ cd ~/Descargas
$ sudo apt install ./code_*.deb
```

Deux choses nouvelles dans cette ligne. `apt` est le **[gestionnaire de paquets](https://developer.mozilla.org/fr/docs/Learn_web_development/Getting_started/Environment_setup/Installing_software)** de Mint : le programme qui installe, met à jour et retire les logiciels, en résolvant seul les dépendances. Et `sudo` est le mot qui signifie « fais-le avec les permissions d'administrateur » : installer des programmes pour tout le système les exige, et c'est pourquoi `sudo` te demande **ton mot de passe**. Quand tu l'écriras, tu ne verras rien à l'écran, pas même des astérisques : ce n'est pas que cela ne fonctionne pas, c'est une mesure pour que personne ne le lise par-dessus ton épaule. Écris-le en entier et appuie sur `Entrée`. Une règle d'hygiène qu'il convient d'avoir dès le premier jour : **ne colle pas dans le terminal une commande avec `sudo` que tu ne comprends pas** ; avec lui, la machine fait ce que tu lui dis sans demander si tu es sûr. (Ce paquet, au passage, configure un dépôt pour que l'éditeur se mette à jour avec le reste du système, comme le décrit la documentation de VS Code elle-même.)

Une fois l'éditeur installé, ouvre-le **sur le dossier du projet**, pas sur un fichier isolé. Depuis le terminal, déjà dans `~/revisor`, écris :

```bash
$ code .
```

Le point est le dossier actuel : tu viens d'ouvrir l'éditeur « posé » sur `revisor`. À gauche tu verras l'explorateur de fichiers avec le dossier (vide), et dans la barre du bas, des informations sur le fichier. À la première ouverture, VS Code te demandera si tu fais confiance aux auteurs du dossier : c'est un dossier à toi, dis oui. Ensuite, active l'[enregistrement automatique](https://code.visualstudio.com/docs/editor/codebasics) pour ne pas avoir à penser à enregistrer : dans le menu **Fichier**, coche **Enregistrement automatique**. Tu verras qu'il reste utile d'appuyer sur `Ctrl`+`S` par habitude ; l'enregistrement automatique est un filet de sécurité, pas un substitut. Si ton éditeur te propose de compléter à ta place des blocs entiers de code, désactive-le pendant que tu apprends : écrire chaque ligne de tes mains [fait partie de l'apprentissage](https://developer.mozilla.org/fr/docs/Learn_web_development/Getting_started/Soft_skills).

Dans l'éditeur, avec la combinaison `Ctrl` plus la touche de l'accent grave, tu ouvres un terminal intégré qui est déjà posé dans le dossier du projet. C'est le confort le plus utilisé, et celui dont tu auras besoin quand le serveur occupera un terminal et que tu en voudras un autre : avec le bouton `+` de ce volet, tu en ouvres un second.

### 1.2 Le cycle du regard : serveur local et outils du navigateur

#### La première page

Crée le premier fichier du projet : dans l'explorateur de VS Code, avec le bouton « Nouveau fichier » (ou `Ctrl`+`N` puis enregistrer), appelle-le `index.html`. Écris ceci :

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

(La première ligne, le commentaire `<!-- fig01_01.html -->`, est la façon dont le dépôt du cours identifie cet exemple ; tu peux la copier ou non, c'est un commentaire que le navigateur n'affiche pas. Le second bloc est ce que tu verras dans la fenêtre.)

Je ne te demande pas de comprendre chaque [balise](https://developer.mozilla.org/fr/docs/Learn_web_development/Core/Structuring_content/Basic_HTML_syntax) aujourd'hui ; la Leçon 2 y est consacrée. Pour que le fichier ne soit pas un texte opaque, voici le minimum : `<!DOCTYPE html>` dit au navigateur de lire la page avec les règles modernes ; `lang="es"` déclare la langue, ce qui importe aux lecteurs d'écran ; `<meta charset="utf-8">` déclare l'encodage (c'est ce qui fait que « á » et « ñ » s'affichent bien ; elle doit être près du début) ; la balise avec `viewport` fait que la page s'adapte à la largeur d'un téléphone, et nous l'utiliserons beaucoup dans la Leçon 5 ; `<title>` est le texte de l'onglet. Tout ce qui est dans `<body>` est ce qui se voit dans la fenêtre : un titre (`<h1>`) et un paragraphe (`<p>`) dans la région principale (`<main>`).

Enregistre avec `Ctrl`+`S`. Il y a deux façons de le voir dans le navigateur. La première est celle que tout le monde tente : double-clic sur le fichier dans le gestionnaire de fichiers. Essaie-la. Elle fonctionne, et dans la barre d'adresse tu verras quelque chose comme `file:///home/ana/revisor/index.html`. Remarque le schéma : `file`, pas `http`. Ici il n'y a ni serveur ni conversation ; le navigateur a lu le fichier sur le disque, tel quel.

Pour une page d'un seul fichier, cela suffit. Pour un projet avec plus d'un fichier qui se chargent mutuellement, non. Voyons pourquoi avec un petit test, fait exprès.

#### Un module qui ne se charge pas

Plus loin dans le cours tu vas diviser le JavaScript du tableau de bord en petits fichiers qui s'importent les uns les autres. Cela s'appelle des **[modules](https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Modules)**, et ils se chargent avec [`<script type="module">`](https://developer.mozilla.org/fr/docs/Web/HTML/Reference/Elements/script). Regarde à quoi cela ressemble avec un exemple minimal : une page et un fichier JavaScript qui change son texte. (Tu n'as pas besoin de comprendre le JavaScript encore —il arrive dans la Leçon 6— ; il suffit de savoir que cette unique ligne cherche le paragraphe dont l'identifiant est `status` et change son texte.)

Remplace le contenu de `index.html` par cette version et crée à côté, dans le même dossier, un fichier `main.js` avec le programme. Remarque l'attribut `src="main.js"` : c'est une URL relative (Leçon 0) qui signifie « le fichier `main.js` qui est à côté de cette page ».

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

(Dans le dépôt du cours, cette page s'appelle `fig01_02.html` et son programme `main.js`, l'un à côté de l'autre ; dans **ton** dossier, la page s'appelle `index.html`. Les deux blocs se copient tels quels. Le troisième bloc est ce que tu dois voir quand tout fonctionne.)

Ouvre-la maintenant avec un double-clic, comme avant. Tu verras le texte « Esperando al módulo. » et **non** « El módulo cargó. » : le programme ne s'est pas exécuté. Et personne ne t'a prévenu dans la fenêtre. C'est un échec silencieux parmi les plus déconcertants, et il s'explique dans la section « L'erreur que tu vas voir » : l'avertissement est dans la [Console](https://firefox-source-docs.mozilla.org/devtools-user/web_console/index.html) du navigateur, que tu apprendras à ouvrir dans quelques minutes.

La raison de fond, la Leçon 0 l'avait déjà posée. Les modules se téléchargent avec une requête que le navigateur fait « en mode d'origine croisée » (le mécanisme qu'on appelle [CORS](https://developer.mozilla.org/fr/docs/Web/HTTP/Guides/CORS)), c'est-à-dire soumise à la [politique de même origine](https://developer.mozilla.org/fr/docs/Web/Security/Defenses/Same-origin_policy). Une page ouverte depuis `file://` a une [origine opaque](https://url.spec.whatwg.org/#concept-url-origin), et le navigateur ne lui permet pas de faire ce téléchargement. La solution n'est pas une astuce dans le code : c'est de livrer le projet par HTTP, comme le fera le monde réel.

#### Le serveur local : `python3 -m http.server`

Il faut un [serveur web](https://developer.mozilla.org/fr/docs/Glossary/Server), et pas un lourd : un serveur minimal qui lit les fichiers du dossier et les livre par HTTP. Ton ordinateur en a déjà un, inclus dans Python. Tu es déjà dans le dossier du projet ; depuis le terminal, écris :

```bash
$ python3 -m http.server 8000 --bind 127.0.0.1
Serving HTTP on 127.0.0.1 port 8000 (http://127.0.0.1:8000/) ...
```

Décortique chaque pièce de cette ligne, car chacune répond à quelque chose de la Leçon 0 :

- `python3 -m http.server` exécute (`-m`, « module ») le serveur web qui vient dans la bibliothèque standard de Python. Il n'y a rien à installer ; c'est la seule chose de Python que ce cours utilise.
- `8000` est le **port** : la « porte » sur laquelle il écoute. C'est un nombre arbitraire supérieur à 1024 ; le 8000 est une habitude. Si ton dossier en utilise un autre, tu l'écris pareil dans l'URL.
- `--bind 127.0.0.1` limite le serveur à **ta propre machine**. C'est une précaution qui compte : par défaut, ce serveur écoute sur *toutes* les interfaces réseau, et la documentation de Python avertit qu'il n'est pas pensé pour la production. Avec `--bind 127.0.0.1`, il n'écoute que toi.
- La ligne qu'il imprime dit à quelle adresse il sert le dossier actuel.

Le terminal est resté « occupé » : il ne te rend pas l'invite `$`, parce que le serveur continue de tourner et d'écrire là ce qui se passe. Laisse-le ainsi et ouvres-en un autre (dans VS Code, le bouton `+` du volet de terminal ; ou une nouvelle fenêtre). Pour l'arrêter, un jour, tu retournes à ce terminal et tu appuies sur `Ctrl`+`C`.

Ouvre maintenant le navigateur et écris `http://localhost:8000/` (`localhost` est un nom [réservé à ta propre machine](https://www.rfc-editor.org/rfc/rfc6761)). Comme tu l'as vu dans la Leçon 0, ce nom correspond à deux adresses, `127.0.0.1` et celle d'IPv6, `::1` ; le serveur n'écoute que sur la première, et le navigateur, si on ne lui répond pas sur l'une, essaie l'autre (je l'ai vérifié avec Chrome, Firefox et `curl`). Si un jour `localhost` ne t'ouvre pas la page, écris l'adresse qu'a imprimée le serveur, `http://127.0.0.1:8000/`. La page que tu vois est la même, mais maintenant le texte dit **« El módulo cargó. »** : le programme s'est exécuté. La différence est exactement le schéma : avant `file://`, maintenant `http://`.

Regarde ce que le terminal du serveur a écrit entre-temps, qui est la conversation de la Leçon 0 en version résumée :

```text
127.0.0.1 - - [07/Oct/2026 10:55:10] "GET / HTTP/1.1" 200 -
127.0.0.1 - - [07/Oct/2026 10:55:10] "GET /main.js HTTP/1.1" 200 -
127.0.0.1 - - [07/Oct/2026 10:55:10] code 404, message File not found
127.0.0.1 - - [07/Oct/2026 10:55:10] "GET /favicon.ico HTTP/1.1" 404 -
```

Chaque ligne est une requête qui est arrivée. Elle se lit : qui l'a faite (`127.0.0.1`, toi), quand, la ligne de requête entre guillemets (méthode, chemin et version) et le code d'état. Trois choses à noter. **Une :** un seul accès à la page a produit **trois** requêtes, pas une : le HTML, le programme que le HTML demande, et quelque chose que tu n'as pas demandé. C'est le mécanisme de la Leçon 0, à petite échelle. **Deux :** le HTML a été demandé avec `GET /`, le chemin que tu as écrit, qui est un dossier et non un fichier ; le serveur a répondu avec le `index.html` de ce dossier, la convention que tu as vue dans la Leçon 0. Le journal note ce qui a été demandé, pas le fichier qui a été livré. **Trois :** le [`404`](https://developer.mozilla.org/fr/docs/Web/HTTP/Reference/Status/404) de `/favicon.ico` n'est pas une erreur de ta part. Le **[favicon](https://html.spec.whatwg.org/multipage/)** est la petite icône de l'onglet ; les navigateurs la demandent de leur propre chef, à ce chemin, sans que tu le dises nulle part. Comme il n'y en a aucune, le serveur répond « introuvable ». C'est inoffensif et cela t'apprend quelque chose d'important : *le navigateur fait des requêtes que ta page n'a pas demandées.* Dans l'Exercice 2 tu le réduiras au silence.

Tu peux aussi voir ce que le serveur répond *au niveau des en-têtes*, avec [`curl`](https://curl.se/docs/manpage.html) (installe-le, si tu ne l'as pas, avec `sudo apt install curl` ; son [tutoriel officiel](https://curl.se/docs/tutorial.html) enseigne le reste de ses options) :

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

(J'ai mesuré cette sortie sur un autre ordinateur, avec Python 3.12.12 ; sous Linux Mint 22, la ligne `Server` indiquera la version qu'apporte le système, `Python/3.12.3` au moment d'écrire. Les dates seront autres, et `Content-Length` ne coïncidera que si tu as copié le fichier tel quel, avec son commentaire.) Tu reconnais tout : la ligne d'état avec [`HTTP/1.0`](https://www.rfc-editor.org/rfc/rfc1945) —ce serveur d'entraînement utilise cette version par défaut—, le [`Content-type`](https://developer.mozilla.org/fr/docs/Glossary/MIME_type) calculé d'après l'extension du fichier (`.js` → `text/javascript` ; MDN documente l'en-tête complet dans [`Content-Type`](https://developer.mozilla.org/fr/docs/Web/HTTP/Reference/Headers/Content-Type)), la taille du corps, la date de modification. C'est ton propre serveur, qui parle la langue de la Leçon 0.

Deux observations sur l'usage quotidien. Si tu oublies dans quel dossier tu l'as lancé, rappelle-toi que **le serveur publie le dossier depuis lequel tu l'exécutes** : le lancer dans ton dossier personnel publierait, pour qui pourrait atteindre le serveur, tout ce qui s'y trouve (c'est pourquoi `--bind 127.0.0.1` et c'est pourquoi toujours `cd revisor` d'abord). Et si tu modifies un fichier et recharges, le serveur livre la nouvelle version sans redémarrer ; il n'y a pas à l'arrêter à chaque fois, seulement quand tu changes de projet.

#### Les outils du navigateur

Ton navigateur a un atelier intégré pour voir de l'intérieur ce qui a été chargé : les **[outils de développement](https://developer.chrome.com/docs/devtools/overview)**. Ils s'ouvrent avec `F12` (ou `Ctrl`+`Maj`+`I`) et se divisent en onglets. Nous utiliserons Firefox, qui vient avec Mint ; dans les navigateurs basés sur Chromium il y a les mêmes avec des noms presque identiques. Pour cette leçon, trois onglets suffisent :

**[Inspecteur](https://firefox-source-docs.mozilla.org/devtools-user/page_inspector/index.html).** Il montre le document tel que le navigateur le comprend : un arbre d'éléments. Fais un clic droit sur le paragraphe de la page et choisis **Examiner** : l'Inspecteur s'ouvre, avec l'élément mis en évidence. Tu peux développer et replier l'arbre, et même modifier un texte avec un double-clic pour voir l'effet (cela ne dure que jusqu'au rechargement : c'est une expérience, cela ne change pas ton fichier). Tu verras ici « El módulo cargó. ».

Et voici l'une des idées les plus précieuses de la leçon. Avec la page ouverte, appuie sur `Ctrl`+`U`, qui ouvre **Code source de la page**. Tu y verras le HTML tel qu'il est arrivé du serveur, avec « Esperando al módulo. » dans le paragraphe. **Le code source est ce que le serveur a envoyé ; l'Inspecteur est ce que le navigateur a maintenant, après avoir exécuté le JavaScript.** Ils peuvent être différents, et dans le tableau de bord ils le seront presque toujours, parce que le JavaScript le dessinera. Quand quelque chose « n'apparaît pas » à l'écran, regarder les deux te dit si le serveur ne l'a pas envoyé ou si ton programme ne l'a pas dessiné. Sans cette distinction, il est facile de perdre un après-midi.

**Console.** C'est là que le navigateur écrit ses avertissements et les erreurs de ton JavaScript, chacun avec le fichier et la ligne qui l'a causé. Ouvre-la et laisse-la visible pendant que tu travailles. Une règle que nous adopterons comme critère de sortie du cours : **la Console doit être vide** (ni erreurs ni avertissements). Avec la page servie, la tienne le sera, avec une exception qu'il convient de connaître : Chrome note dans la Console le `404` du `favicon.ico` dont nous avons parlé plus haut (je l'ai mesuré ; dans d'autres navigateurs il peut ne pas apparaître), et il disparaît dès que tu fais l'Exercice 2. Avec la page ouverte par `file://`, elle aura l'erreur du module que nous avons vue plus haut.

**[Réseau](https://firefox-source-docs.mozilla.org/devtools-user/network_monitor/index.html).** Tu la connaissais de la Leçon 0. Maintenant, avec ton serveur, elle est beaucoup plus révélatrice : ouvre l'onglet, recharge avec `F5` et tu verras trois lignes : le document, le `main.js` et le `favicon.ico`, avec leurs états `200`, `200` et `404`. Ce sont les mêmes trois lignes qu'a écrites ton serveur, vues de l'autre côté. Clique sur celle de `main.js` et regarde les en-têtes : le `Content-type: text/javascript` de plus haut, avec son serveur. Là même, coche **Désactiver le [cache](https://developer.mozilla.org/fr/docs/Web/HTTP/Reference/Status/304)** (une case dans la barre de l'onglet ou dans son menu de réglages, selon ta version) : tant que les outils seront ouverts, le navigateur ne réutilisera pas de vieilles copies. Cela résout le problème du « j'ai modifié et je ne vois pas le changement » avant qu'il n'apparaisse. Avec les outils fermés, le [cache](https://developer.mozilla.org/fr/docs/Web/HTTP/Guides/Caching) agit de nouveau ; en cas de doute, `Ctrl`+`Maj`+`R` force un rechargement qui l'ignore.

Le cycle est maintenant complet. Chaque fois que tu changes quelque chose, la routine est toujours la même : **tu modifies, tu enregistres, tu recharges, tu regardes la Console et l'[onglet Réseau](https://developer.chrome.com/docs/devtools/network).** Si quelque chose n'apparaît pas, la première chose que l'on regarde est la Console.

### 1.3 Le point de retour : Git

#### Quel problème il résout

Tôt ou tard, tu changeras quelque chose qui fonctionnait et cela cessera de fonctionner, et tu ne te rappelleras pas exactement ce que tu as touché. Sans enregistrement, la sortie est d'annuler à la main ce que tu crois avoir changé. **Git** est un système de **[gestion de versions](https://git-scm.com/book/fr/v2/Démarrage-rapide-À-propos-de-la-gestion-de-version)** : un programme qui enregistre, sur ton ordre, des photographies de l'état de ton dossier, chacune avec un message qui dit ce qui a changé et pourquoi. Avec elles tu peux voir ce qui a été modifié, comparer avec n'importe quel point antérieur et revenir en arrière. C'est l'outil le plus utilisé au monde pour cela, et tu le verras dans n'importe quelle équipe ; le cours *Missing Semester* du MIT lui consacre [un cours entier](https://missing.csail.mit.edu/2020/version-control/), si tu veux comprendre comment il enregistre l'historique de l'intérieur.

Ne le confonds pas avec GitHub ou GitLab : Git fonctionne **seulement sur ta machine**, sans internet. Les services comme GitHub sont des lieux où tu peux *partager* un dépôt Git ; ici nous n'en avons pas encore besoin. Pour cette leçon, Git est ton historique personnel.

Il y a un modèle mental qui le rend compréhensible, et ce sont trois zones. Tes fichiers vivent dans le **dossier de travail**, où tu les modifies. Quand quelque chose est prêt à être enregistré, tu le passes dans la **[zone de préparation](https://git-scm.com/book/fr/v2/Les-bases-de-Git-Enregistrer-des-modifications-dans-le-dépôt)** (*stage*) : une salle d'attente où tu décides exactement ce qui entrera dans la prochaine photographie. Et la photographie elle-même, qui s'appelle **commit** (validation), reste enregistrée dans le **dépôt**. Trois pas, trois commandes : `git add` déplace vers la salle d'attente, [`git commit`](https://git-scm.com/docs/git-commit) prend la photographie.

#### Préparer Git, une fois

D'abord, dis-lui qui tu es : chaque commit porte un auteur. Cela se fait une seule fois sur ton compte de l'ordinateur, avec tes données réelles (le courriel n'est qu'une étiquette ; il n'est envoyé nulle part) :

```bash
$ git config --global user.name "Ana Pérez"
$ git config --global user.email "ana@example.com"
```

Si Git n'est pas installé (`git --version` te le dit), il s'installe avec `sudo apt install git`.

#### Le premier enregistrement

Dans le dossier du projet, crée le dépôt avec [`git init`](https://git-scm.com/docs/git-init). L'option `-b main` donne à la branche principale le nom `main`, qui est l'habitude actuelle :

```bash
$ git init -b main
Inicializado repositorio Git vacío en /home/ana/revisor/.git/
```

Git a créé un dossier caché, `.git`, qui est l'endroit où vit tout l'historique. Ne le touche pas à la main ; si tu le supprimes, tu perds l'historique. Demande-lui comment il voit le projet :

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

[`git status`](https://git-scm.com/docs/git-status) est la commande que tu exécuteras le plus : elle dit où se trouve chaque chose. Ici elle t'informe que `index.html` et `main.js` sont **non suivis** (« Archivos sin seguimiento » dans la sortie en espagnol) : ils existent dans le dossier de travail, mais Git ne les connaît pas encore. Passe-les tous les deux dans la salle d'attente (`git add` accepte plusieurs noms) et demande à nouveau :

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

Maintenant les deux figurent sous « Cambios a ser confirmados » (« modifications qui seront validées ») : ils sont dans la salle d'attente. Prends la photographie avec un message :

```bash
$ git commit -m "Primer index.html del revisor"
[main (commit-raíz) ff110e5] Primer index.html del revisor
 2 files changed, 18 insertions(+)
 create mode 100644 index.html
 create mode 100644 main.js
```

Ce que cela dit : un commit a été enregistré dans la branche `main`, identifié par le code `ff110e5` (les premiers caractères de son empreinte ; la tienne sera autre), avec deux fichiers qui ont changé et les lignes qui ont été ajoutées (le nombre dépend du nombre de lignes de tes fichiers). Cette ligne de résumé sort en anglais même si ton système n'est pas en anglais (dans l'exemple, il est en espagnol) : Git ne la traduit pas. Pour le voir dans la liste de l'historique :

```bash
$ git log --oneline
ff110e5 Primer index.html del revisor
```

Un commit par ligne, le plus récent en haut. Tu as maintenant ton premier point de retour.

#### Le cycle avec Git

Le schéma est toujours le même et il est court : **tu changes, tu regardes ce qui a changé, tu prépares, tu enregistres.** Modifie le `index.html` (par exemple, change le texte du paragraphe) et demande ce qui a été modifié avec [`git diff`](https://git-scm.com/docs/git-diff), qui montre ligne par ligne ce qui a changé par rapport au dernier commit (les lignes avec `-` ont été retirées ; les lignes avec `+` ont été ajoutées) :

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

(Dans cet exemple, on a changé le texte du paragraphe : la ligne avec `-` est celle d'avant et celle avec `+`, celle de maintenant ; Git montre aussi trois lignes de contexte au-dessus et en dessous. Les nombres de la ligne `index` dépendent du contenu exact de ton fichier, donc les tiens peuvent être autres.) Le voir avant d'enregistrer est la meilleure habitude de Git : elle attrape les erreurs, comme un changement que tu ne comptais pas faire. Ensuite, `git add` et `git commit` à nouveau.

Quelques règles d'usage qui épargnent des maux de tête. **Les messages disent quoi et pourquoi**, en une phrase courte : « Agrega la tabla de servicios » (« Ajoute le tableau des services ») convient ; « cambios » et « asdf » ne conviennent pas, parce que dans un mois ils ne te diront rien. **Un commit par idée** : ne mélange pas dans le même une correction et une nouvelle fonction. Et l'habitude du cours : **à la fin de chaque leçon, un commit** avec l'état dans lequel est resté le tableau de bord. Ainsi, si la Leçon 8 te détruit quelque chose, la 7 reste intacte et récupérable. Une dernière note : Git ne suit pas les dossiers vides, seulement les fichiers ; c'est pourquoi `css/`, `js/` ou `data/` n'apparaîtront pas dans `git status` tant qu'ils n'auront rien dedans.

## L'erreur que tu vas voir

Il y a trois erreurs presque inévitables dans cette leçon. Reproduis-les exprès : les voir ici, avec la cause sous la main, coûte beaucoup moins cher que de tomber dessus tout seul.

### Le module bloqué par CORS

Ouvre `index.html` (la version du module, `fig01_02`) avec un double-clic, pour que la barre dise `file:///…`. Ouvre la Console avec `F12`. Dans Chrome, le message qui a été mesuré le 7 octobre 2026 (avec le chemin adapté à Linux, le reste textuel) est :

```text
Access to script at 'file:///home/ana/revisor/main.js' from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: chrome, chrome-experimental-site-token-provider, chrome-extension, chrome-untrusted, data, http, https, isolated-app.
```

Dans Firefox, le message a une autre rédaction et mentionne un motif que la documentation de Mozilla décrit ainsi : **« [Reason: CORS request not HTTP](https://developer.mozilla.org/fr/docs/Web/HTTP/Guides/CORS/Errors/CORSRequestNotHttp) »**, c'est-à-dire que la requête d'origine croisée n'est pas HTTP ; dans un Firefox en français, cette partie apparaîtra traduite. Même si la rédaction change, l'information est la même.

**Ce que cela signifie :** la page a `origin 'null'` —l'[origine opaque](https://html.spec.whatwg.org/multipage/browsers.html#concept-origin-opaque) des fichiers locaux—, et elle a demandé un module ; une requête de ce type ne peut se faire que sur HTTP ou [HTTPS](https://developer.mozilla.org/fr/docs/Glossary/HTTPS), et la tienne était sur `file://`. C'est pourquoi le programme ne s'est pas exécuté. **Comment on y remédie :** en servant le dossier avec `python3 -m http.server`, comme tu l'as fait. Il n'y a rien à réparer dans le code.

### Address already in use

Si tu lances le serveur et qu'il y en avait déjà un sur cette porte —parce que tu l'as laissé tourner dans un autre terminal—, Python répond par une longue erreur dont la dernière ligne est celle qui compte. Sous Linux, c'est :

```text
OSError: [Errno 98] Address already in use
```

(Sur d'autres systèmes le nombre change ; la phrase est la même. Le 98 est la valeur de [`EADDRINUSE`](https://man7.org/linux/man-pages/man3/errno.3.html), « adresse déjà utilisée », sous Linux.) **Ce que cela signifie :** un autre programme écoute déjà sur le port 8000 ; un seul peut le faire à la fois. **Comment on y remédie :** si c'est ton propre serveur oublié, va à son terminal et arrête-le avec `Ctrl`+`C` ; ou utilise une autre porte : `python3 -m http.server 8001 --bind 127.0.0.1` (et alors l'URL est `http://localhost:8001`).

### L'identité de Git

Si tu oublies l'étape de [`git config`](https://git-scm.com/docs/git-config) et que ton système ne peut pas déduire un courriel raisonnable, le premier `git commit` refuse avec un message qui commence par `Identidad del autor desconocido` et se termine par `fatal: no es posible auto-detectar la dirección de correo` (si ton système est en anglais : `Author identity unknown` et `fatal: unable to auto-detect email address`). Parfois Git déduit bien un nom et un courriel à partir de ton utilisateur et du nom de la machine, et fait le commit en te montrant un avertissement pour que tu vérifies qu'ils sont corrects. **Ce que cela signifie :** Git refuse d'enregistrer une trace sans savoir au nom de qui elle va. **Comment on y remédie :** exécute les deux commandes `git config --global` ci-dessus (et, si le commit est déjà parti avec l'identité automatique, `git commit --amend --reset-author` la remplace).

## Ce qui se fait de travers

**Développer en ouvrant le fichier avec un double-clic.** Cela fonctionne jusqu'au jour où tu cesses de voir quelque chose qui devrait fonctionner : modules, `fetch`, polices. Coût : des heures à attribuer à ton code un échec de l'origine. Correction : toujours le serveur local, dès la première ligne.

**Lancer le serveur dans le mauvais dossier.** Un `python3 -m http.server` lancé dans ton dossier personnel, sans `--bind`, publie tout ce qui s'y trouve vers tout le réseau local. Dans une installation neuve de Mint, le pare-feu est généralement désactivé, donc rien ne l'arrêterait. Coût : tes documents exposés sur le réseau d'un café. Correction : `cd revisor` avant de lancer, et `--bind 127.0.0.1` toujours.

**Écrire dans un traitement de texte.** Un `.docx` renommé en `.html` n'est pas un HTML. Coût : une page pleine de symboles. Correction : éditeur de code, texte brut, UTF-8.

**Mettre des espaces, des accents ou des majuscules dans les noms.** `Mi Página.html` semble correct aujourd'hui et casse demain, dans le terminal et dans l'URL (la Leçon 0 a expliqué pourquoi). Correction : `mi-pagina.html`.

**Recharger sans regarder la Console.** L'erreur est écrite, avec le fichier et la ligne, et personne ne la lit. Coût : déboguer à l'aveugle. Correction : la Console toujours ouverte.

**Un commit qui dit « cambios ».** Il sert le jour où tu l'écris et ne sert plus jamais ensuite. Correction : une phrase qui dise quoi et pourquoi.

**Coller des commandes avec `sudo` sans les lire.** Avec `sudo`, la machine obéit sans demander. Correction : avant d'appuyer sur `Entrée`, sache ce que fait chaque mot.

## Exercices

### Exercice 1 — La structure du projet

Dans `~/revisor`, crée trois dossiers : `css`, `js` et `data`, avec une seule commande (indice : `mkdir` accepte plusieurs noms). Vérifie avec `ls`. Ensuite demande à Git avec `git status` : les liste-t-il comme des modifications ? Pourquoi ?

### Exercice 2 — Réduire le favicon au silence

Avec le serveur en marche et l'onglet Réseau ouvert, recharge la page et note l'état de `favicon.ico`. Ajoute dans le `<head>` de la page [`<link rel="icon" href="data:,">`](https://developer.mozilla.org/fr/docs/Web/HTML/Reference/Elements/link), enregistre, recharge avec `Ctrl`+`Maj`+`R` et regarde à nouveau. Qu'est-ce qui a changé dans l'onglet Réseau et dans le journal du serveur ? Cherche ce que signifie un schéma [`data:`](https://url.spec.whatwg.org/) (indice : la Leçon 0 a enseigné les parties d'une URL).

### Exercice 3 — Source contre Inspecteur, et un second commit

Sers la version de la page avec le module (celle de `fig01_02`). Ouvre « Code source de la page » (`Ctrl`+`U`) et l'Inspecteur. Note ce que dit le paragraphe dans chacun et explique la différence. Ensuite change le texte du titre, regarde le changement avec `git diff`, et enregistre-le avec un second commit. À quoi ressemble maintenant [`git log --oneline`](https://git-scm.com/docs/git-log) ?

### Exercice 4 — Provoquer et lire un 404

Avec le serveur en marche, renomme le fichier `main.js` en `principal.js` depuis le gestionnaire de fichiers (sans toucher au HTML) et recharge. Note, dans cet ordre : ce que voit la personne dans la page, ce que dit la Console, l'état que montre l'onglet Réseau, et la ligne qu'a écrite le serveur. Ensuite répare-le et vérifie que la Console est restée vide.

## Solutions

### Exercice 1 — La structure du projet

```bash
$ mkdir css js data
$ ls
css  data  index.html  js  main.js
$ git status
En la rama main
nada para hacer commit, el árbol de trabajo está limpio
```

Git ne les liste pas parce qu'il **ne suit que les fichiers, pas les dossiers** ; un dossier vide n'a rien à enregistrer. Ils apparaîtront dans `git status` dès qu'ils contiendront un fichier. (Si tu avais déjà modifié `index.html` sans enregistrer de commit, `git status` te le montrera comme modifié ; c'est une autre affaire.)

### Exercice 2 — Réduire le favicon au silence

La page devient ainsi :

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

Avant : une ligne avec `favicon.ico` et l'état `404`, et dans le serveur `code 404, message File not found`. Après : il n'y a plus de requête vers `favicon.ico`, parce que le HTML lui-même déclare l'icône. Le schéma `data:` est une URL qui **porte le contenu en elle-même**, au lieu de pointer vers un endroit où le demander ; celle que nous avons écrite, `data:,`, contient un contenu vide, c'est-à-dire une icône invisible, et c'est pourquoi le navigateur n'a rien à demander. (La page d'exemple `example.com`, de la Leçon 0, fait exactement la même chose.) Plus tard nous mettrons une vraie icône.

### Exercice 3 — Source contre Inspecteur, et un second commit

« Code source de la page » montre `Esperando al módulo.` ; l'Inspecteur montre `El módulo cargó.`. La différence est que le code source est ce que le serveur a envoyé, avant d'exécuter le JavaScript, et l'Inspecteur est l'état actuel du document, après que `main.js` a changé le texte.

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

Deux commits, le plus récent en haut ; les codes à gauche seront autres sur ta machine.

### Exercice 4 — Provoquer et lire un 404

Ce que voit la personne : la page avec « Esperando al módulo. », sans aucun avertissement dans la fenêtre. Dans le serveur, ces lignes apparaissent (mesuré le 7 octobre 2026) :

```text
127.0.0.1 - - [07/Oct/2026 10:56:09] code 404, message File not found
127.0.0.1 - - [07/Oct/2026 10:56:09] "GET /main.js HTTP/1.1" 404 -
```

L'onglet Réseau montre la ligne de `main.js` avec l'état `404`. La Console montre une erreur au chargement du module ; sa rédaction dépend du navigateur et mentionne en général l'état `404` ou que le serveur a répondu avec un type de contenu qui n'est pas du JavaScript —la page d'erreur du serveur est du HTML—, et c'est l'en-tête `Content-Type` de la Leçon 0 en action. La réparation est de rendre son nom au fichier (`main.js`). La leçon est la même que dans la Leçon 0 : la page sans programme n'est pas un mystère, c'est une requête secondaire qui a échoué, et cela se voit à trois endroits à la fois.

## Comment savoir que j'ai réussi

- `pwd` dans le dossier du projet imprime `/home/<ton utilisateur>/revisor`.
- `python3 -m http.server 8000 --bind 127.0.0.1` imprime `Serving HTTP on 127.0.0.1 port 8000 (http://127.0.0.1:8000/) ...` et `http://localhost:8000/` affiche la page.
- Avec la page servie (et le `favicon` réduit au silence de l'Exercice 2), la **Console est vide** et l'onglet Réseau montre le document avec l'état `200`.
- La même page ouverte avec un double-clic (`file://`), la Console montre bien l'erreur du module, et tu sais expliquer pourquoi.
- `git log --oneline` imprime au moins un commit avec un message qui explique ce que tu as enregistré, et `git status` dit `nada para hacer commit, el árbol de trabajo está limpio` (« rien à valider, la copie de travail est propre »).
- Sans regarder la leçon, tu peux répondre : que montre « Code source de la page » que ne montre pas l'Inspecteur, et inversement ?

Si tout est en ordre, ton environnement est déjà celui de n'importe quel professionnel du web, et le reste du cours se fait dessus. Note dans le [journal de bord](https://github.com/HabilMX/curso-web/blob/main/fr/bitacora.md) ce qui t'a coûté. Dans la Leçon 2 tu écriras le squelette du tableau de bord avec du HTML qui dit ce qu'il signifie. Et si tu veux voir dès maintenant où mène le chemin, le [cours de TypeScript](https://www.habil.mx/fr/cours/typescript/) de la maison refait ce même tableau de bord avec des types et avec React.

## Pour aller plus loin

- [Gérer les fichiers d'un projet, de MDN](https://developer.mozilla.org/fr/docs/Learn_web_development/Getting_started/Environment_setup/Dealing_with_files) — le guide de MDN pour organiser les fichiers d'un projet, un bon complément de cette leçon.
- [Documentation de `http.server`, de Python](https://docs.python.org/3/library/http.server.html) — toutes les options du serveur que nous utilisons, et l'avertissement de sécurité sur son usage.
- [Pro Git, le livre officiel, en français](https://git-scm.com/book/fr/v2) — le chapitre « Les bases de Git » est la suite naturelle.
- [The Missing Semester of Your CS Education (MIT)](https://missing.csail.mit.edu/) — un cours gratuit sur le terminal, l'éditeur et la gestion de versions, qui explique pourquoi ces outils méritent ton temps.
