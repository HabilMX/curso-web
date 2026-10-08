# Leçon 2 — Du HTML qui a du sens

**Durée :** deux sessions d'environ 90 min. Une répartition qui marche : la première, « Le pourquoi avant le comment », le document et les éléments porteurs de sens (2.1) et le tableau (2.2) ; la seconde, les contrôles (2.3), le tableau de bord complet écrit à la main, « L'erreur que tu vas voir » et les exercices. Chaque session se termine par une page que tu peux ouvrir et valider.

**Ce que tu construis :** le squelette du tableau de bord `revisor`, écrit à la main

**Ce que tu apprends :** choisir l'élément pour ce qu'il signifie et non pour son apparence ; titres, tableaux, boutons, liens et libellés

**Les pages de cette leçon.** Toutes les figures se trouvent dans [`programas/02-html-con-significado/`](https://github.com/HabilMX/curso-web/tree/main/programas/02-html-con-significado) du [dépôt du cours](https://github.com/HabilMX/curso-web), chacune avec sa sortie attendue à côté. Ouvre-les avec le serveur local que tu as allumé dans la Leçon 1.

## À la fin, tu seras capable de

- Écrire de zéro un document HTML complet et expliquer à quoi sert chaque ligne de son en-tête : `<!DOCTYPE html>`, `lang`, `charset`, `viewport` et `<title>`.
- Choisir entre `<header>`, `<nav>`, `<main>`, `<section>` et `<footer>` plutôt qu'un `<div>`, et dire ce qu'y gagne celui qui utilise la page.
- Construire un tableau accessible, avec titre, en-têtes de colonne et en-têtes de ligne, et décider quand une donnée ne mérite pas un tableau mais une liste.
- Distinguer un lien d'un bouton par ce que chacun promet, et le vérifier avec la touche Tab.
- Associer chaque champ à son libellé des deux manières qui existent (explicite et implicite), regrouper des options avec `<fieldset>` et `<legend>`, et expliquer pourquoi un `placeholder` n'est pas un libellé.
- Faire passer une page par le validateur officiel, lire ses messages et corriger ce qu'ils signalent.

## Le pourquoi avant le comment

Imagine que tu remets le tableau de bord à quatre personnes différentes. La première l'ouvre sur un grand écran et le manie à la souris : pour elle, presque n'importe quelle page fonctionne, parce qu'elle voit le résultat. La deuxième a le poignet blessé et manie tout au clavier : elle avance avec la touche Tab et active avec Entrée. La troisième est une personne aveugle qui l'écoute avec un lecteur d'écran, un programme qui lit à voix haute ce qu'il y a dans la page et permet de sauter d'un titre à l'autre. La quatrième n'est pas une personne : c'est le moteur de recherche qui va décider de ce que dit ta page dans ses résultats.

Les trois dernières ont quelque chose en commun : **elles ne regardent pas les pixels, elles lisent la structure**. Le clavier a besoin de savoir quelles choses peuvent être activées. Le lecteur d'écran a besoin de savoir ce qu'est un titre, ce qu'est un tableau, ce qu'est un bouton. Le moteur de recherche a besoin de savoir ce qu'est le contenu principal et ce qu'est le pied de page. Et tout cela, c'est le HTML qui le donne, pas la couleur ni la taille de la police.

C'est pourquoi cette leçon s'appelle « Du HTML qui a du sens ». Le HTML n'est pas « le langage qui dessine la page » : c'est le langage qui **dit ce qu'est chaque chose**. La dessiner est le travail du CSS, que tu verras dans la Leçon 3 ; la faire réagir est le travail du JavaScript, à partir de la Leçon 6. Aujourd'hui tu n'écriras pas une seule règle de style, et c'est voulu : la page sera laide, avec l'apparence par défaut du navigateur, et elle sera pourtant utilisable par les quatre personnes. Une page qui n'est utilisable que lorsqu'elle est jolie n'est pas terminée, elle est maquillée.

Ce qui manque aujourd'hui est concret : le `revisor` n'existe pas encore. À la fin de cette leçon tu auras son squelette complet : un titre, un récapitulatif, un champ de recherche, un filtre, un bouton et un tableau de cinq services, le tout écrit à la main avec des données d'exemple. Il ne filtre ni ne cherche encore rien : cela viendra plus tard. Ce qu'il aura, en revanche, dès aujourd'hui, c'est une structure qu'il ne faudra pas refaire ensuite. L'ordre de la leçon est celui-ci : d'abord le document et les éléments qui donnent la structure (la section 2.1), ensuite les données en forme de tableau (2.2) et à la fin les contrôles, qui sont les boutons, les liens et les libellés (2.3). Chaque section se termine par une page que tu peux ouvrir et essayer.

## Les concepts

Commence par enregistrer le travail d'aujourd'hui dans le dossier de ton projet, le même où tu as laissé le premier `index.html` dans la [Leçon 1](01-entorno-ciclo-trabajo.md). Depuis ce dossier, lance le serveur local avec `python3 -m http.server 8000 --bind 127.0.0.1`, comme dans la Leçon 1, et ouvre `http://localhost:8000/` dans le navigateur chaque fois que tu enregistres une modification. Si la page n'a pas changé, recharge avec Ctrl+Maj+R, qui ignore ce que le navigateur avait gardé.

### 2.1 Le document et les éléments porteurs de sens

#### 2.1.1 Ce qu'est un élément

Un document HTML est du texte avec des marques. Chaque marque s'appelle **balise** et vient presque toujours par paire : une d'ouverture, comme `<h1>`, et une de fermeture, comme `</h1>`. Ce qui reste entre les deux est le contenu. La paire complète, avec son contenu, s'appelle **élément**. En écrivant `<h1>Revisor de servicios</h1>` tu as créé un élément qui dit : « ceci est un titre de premier niveau, et son texte est "Revisor de servicios" ».

Certaines balises portent des **attributs**, qui sont des données supplémentaires de la forme `nom="valeur"` à l'intérieur de la balise d'ouverture. Dans `<a href="#services">` l'attribut est `href` et sa valeur est `#services`. Un attribut que tu verras dans presque toutes les pages d'aujourd'hui est **`id`** : il donne à un élément un nom qui ne peut pas être répété dans le document, comme `id="services"`. Un lien dont le `href` commence par `#` mène à la partie de la même page qui a cet `id` : `<a href="#services">` saute à l'élément avec `id="services"`. Plus tard, le CSS et le JavaScript utiliseront ce même nom pour trouver l'élément. Un autre attribut fréquent est **`class`** : il donne lui aussi un nom à l'élément, mais, à la différence de `id`, il peut être répété sur de nombreux éléments, et un même élément peut en porter plusieurs séparés par des espaces (`class="status status-available"`). Il sert à ce que le CSS donne la même apparence à tous ceux qui le portent ; **il ne change pas ce que l'élément signifie**, et c'est pourquoi un `<div class="title">` reste une boîte sans signification, même si son nom dit « titre ». Certains éléments n'ont pas de contenu et ne portent donc pas de balise de fermeture ; on les appelle **éléments vides** : `<meta>`, `<input>` et `<img>` sont ceux que tu verras aujourd'hui.

Quand le navigateur reçoit ton fichier, il ne le « dessine » pas directement. Il le lit de haut en bas et construit avec lui une structure en mémoire en forme d'arbre : le document est la racine, à l'intérieur vont `<head>` et `<body>`, dans `<body>` vont les titres, les paragraphes, le tableau, et ainsi de suite. Cet arbre s'appelle le **DOM** (modèle objet du document) et reviendra dans la Leçon 7, où JavaScript le parcourra et le modifiera. Pour l'instant il suffit que tu saches que ce que le navigateur montre, ce que le clavier parcourt et ce que le lecteur d'écran lit sortent de cet arbre, pas de ton fichier de texte.

Une conséquence inconfortable : **le navigateur pardonne presque tout**. Si tu oublies de fermer un paragraphe ou si tu mets un élément là où il n'a pas sa place, il ne te prévient pas ; il devine ce que tu as voulu dire avec des [règles très précises écrites dans la spécification](https://html.spec.whatwg.org/multipage/parsing.html) et monte l'arbre comme il peut. C'est bon pour celui qui visite une page mal écrite, mais mauvais pour celui qui l'écrit : l'erreur ne se voit pas, elle ne se remarque qu'après, dans un autre navigateur ou chez un autre type d'utilisateur. C'est pourquoi dans cette leçon tu utiliseras un validateur, un programme qui vérifie ton HTML contre les règles du standard et te dit ce que le navigateur a tu.

#### 2.1.2 Le minimum d'un document complet

Voici la plus petite page qui soit complète. Enregistre-la sous le nom `pagina.html` dans ton dossier et ouvre-la :

```html
<!-- fig02_01.html -->
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
    <p>Esta es la página más pequeña que está completa.</p>
  </main>
</body>
</html>
```

```text
Revisor de servicios
Esta es la página más pequeña que está completa.
```

Le bloc du dessous est ce que la page montre au chargement, réduit à son texte. L'important est dans les lignes du dessus qu'on ne voit pas. Chacune existe pour une raison concrète.

**`<!DOCTYPE html>`** va toujours en premier. Elle ressemble à une balise, mais c'est une déclaration : elle dit au navigateur « cette page suit le standard actuel ». Sans elle, les navigateurs entrent dans ce qu'ils appellent le **[mode quirks](https://developer.mozilla.org/fr/docs/Web/HTML/Guides/Quirks_mode_and_standards_mode)** (*quirks mode*, mode de compatibilité) : ils imitent les défauts des navigateurs d'il y a vingt-cinq ans pour que les vieilles pages continuent de s'afficher comme elles s'affichaient, et plusieurs règles de calcul des tailles changent en silence. Celui qui oublie le `DOCTYPE` ne reçoit pas d'erreur : il reçoit une page qui s'affiche légèrement différemment et ne sait pas pourquoi. Écris-la toujours, telle quelle.

**`<html lang="es">`** est la racine du document et déclare la langue. Cela ressemble à un détail de politesse et ce n'en est pas un. Le lecteur d'écran choisit avec lui la voix et la prononciation : sans `lang`, il peut lire ton texte en espagnol avec les règles de l'anglais, et le résultat est incompréhensible. Le navigateur s'en sert pour proposer de traduire la page et pour choisir les guillemets de l'élément `<q>` selon la langue, et le CSS s'en sert pour savoir avec quel dictionnaire couper les mots en fin de ligne quand tu le demandes avec `hyphens: auto` (par défaut il n'en coupe aucun ; je l'ai vérifié dans Chrome 154). C'est, en outre, un critère d'accessibilité avec un nom et un numéro dans les recommandations du W3C ([WCAG 3.1.1, « Langue de la page »](https://www.w3.org/WAI/WCAG22/Understanding/language-of-page.html)). La valeur `es` signifie espagnol ; si un jour tu as besoin de l'espagnol du Mexique en particulier, on écrit `es-MX`.

**`<meta charset="utf-8">`** dit avec quel code de caractères le fichier est enregistré. UTF-8 est celui qui représente sans problème les ñ, les accents et les signes d'ouverture (¿ ¡). Si tu l'omets et que ton éditeur a enregistré en UTF-8, il est possible que tu voies « CatÃ¡logo » au lieu de « Catálogo » : le navigateur a deviné un autre encodage. La [spécification](https://html.spec.whatwg.org/multipage/semantics.html) demande, en outre, que cette ligne apparaisse en entier dans les 1,024 premiers octets du fichier, donc elle va au début du `<head>`, avant le titre.

**`<meta name="viewport" content="width=device-width, initial-scale=1">`** est la ligne qu'on oublie le plus et celle qui fait le plus mal sur un téléphone. Les navigateurs mobiles sont nés dans un monde de pages faites pour le bureau, et pour ne pas les casser ils font semblant, par défaut, que l'écran est beaucoup plus large qu'il ne l'est (de l'ordre de 980 px) puis le réduisent pour que cela tienne. Avec cette ligne, tu leur dis « ne fais pas semblant : utilise la largeur réelle de l'appareil et une échelle de 1 ». Sans elle, la Leçon 5 ne peut pas fonctionner, car aucune conception adaptable ne s'adapte à une largeur sur laquelle le navigateur ment.

**`<title>`** est le titre du document, ce qui n'est pas la même chose que le titre `<h1>`. Il apparaît dans l'onglet, dans l'historique, dans les marque-pages et, surtout, c'est **la première chose qu'un lecteur d'écran annonce à l'ouverture de la page** et ce que presque tous les moteurs de recherche affichent comme titre du résultat. Une autre recommandation d'accessibilité l'exige nommément ([WCAG 2.4.2, « Titre de page »](https://www.w3.org/WAI/WCAG22/Understanding/page-titled.html)). Un titre comme « Documento sin título » ou « index » est une page sans nom. Écris-en un qui dise de quelle page il s'agit.

Observe aussi, dans la page ci-dessus, ce qu'il y a dans `<body>` : un `<main>` qui enveloppe tout. C'est le premier élément porteur de sens que tu connais et la sous-section suivante en traite.

#### 2.1.3 Le sens : la différence entre un `div` et un `main`

Voici l'idée centrale de la leçon, et il convient de la voir par contraste. Les deux pages suivantes disent exactement la même chose et, avec l'apparence par défaut, se ressemblent presque. La première n'utilise que des `<div>` :

```html
<!-- fig02_02.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Revisor de servicios (todo con div)</title>
</head>
<body>
  <div class="top">
    <div class="title">Revisor de servicios</div>
    <div class="links">
      <div><a href="#summary">Resumen</a></div>
      <div><a href="#services">Servicios</a></div>
    </div>
  </div>
  <div class="content">
    <div id="summary">
      <div class="subtitle">Resumen</div>
      <div>4 de 5 servicios disponibles.</div>
    </div>
    <div id="services">
      <div class="subtitle">Servicios</div>
      <div>Catálogo, Pagos, Inventario, Notificaciones y Búsqueda.</div>
    </div>
  </div>
  <div class="bottom">Datos de ejemplo escritos a mano.</div>
</body>
</html>
```

```text
Revisor de servicios
Resumen
Servicios
Resumen
4 de 5 servicios disponibles.
Servicios
Catálogo, Pagos, Inventario, Notificaciones y Búsqueda.
Datos de ejemplo escritos a mano.
```

La seconde utilise les éléments qui disent ce qu'est chaque chose :

```html
<!-- fig02_03.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Revisor de servicios (con significado)</title>
</head>
<body>
  <header>
    <h1>Revisor de servicios</h1>
    <nav>
      <p>Ir a: <a href="#summary">Resumen</a> o <a href="#services">Servicios</a></p>
    </nav>
  </header>
  <main>
    <section id="summary">
      <h2>Resumen</h2>
      <p>4 de 5 servicios disponibles.</p>
    </section>
    <section id="services">
      <h2>Servicios</h2>
      <p>Catálogo, Pagos, Inventario, Notificaciones y Búsqueda.</p>
    </section>
  </main>
  <footer>
    <p>Datos de ejemplo escritos a mano.</p>
  </footer>
</body>
</html>
```

```text
Revisor de servicios
Ir a: Resumen o Servicios
Resumen
4 de 5 servicios disponibles.
Servicios
Catálogo, Pagos, Inventario, Notificaciones y Búsqueda.
Datos de ejemplo escritos a mano.
```

Pour voir la différence, il n'est pas nécessaire de regarder l'écran. Ouvre les outils du navigateur (touche F12, ou clic droit puis « Examiner »), va dans l'onglet des éléments et cherche le volet d'**accessibilité** : Chrome l'affiche à côté des styles, et Firefox l'a comme onglet à part. Là apparaît l'**[arbre d'accessibilité](https://www.w3.org/TR/html-aam-1.0/)**, qui est ce que le navigateur remet aux lecteurs d'écran. Je l'ai mesuré avec Chrome 154 sur les deux pages. De la première, voici les seules choses qu'il reconnaît : deux liens et beaucoup de texte en vrac. De la seconde, ceci :

```text
RootWebArea "Revisor de servicios (con significado)"
  banner
    heading "Revisor de servicios" (nivel 1)
    navigation
      link "Resumen"
      link "Servicios"
  main
    heading "Resumen" (nivel 2)
    heading "Servicios" (nivel 2)
  contentinfo
```

Chaque mot de gauche est un **rôle** : ce qu'est la chose. `<header>` au niveau supérieur du `<body>` devient un `banner`, `<nav>` devient `navigation`, `<main>` devient `main`, `<footer>` devient `contentinfo`. Les lecteurs d'écran permettent de [sauter directement](https://www.w3.org/WAI/tutorials/page-structure/) de l'un à l'autre (« va au contenu principal », « liste les titres »). Dans la première page, celui qui ne voit pas l'écran doit tout écouter dans l'ordre, depuis le début, chaque fois qu'il y entre. Dans la seconde, il saute à `main` et commence à lire.

Cela, c'est le **sens** (les recommandations l'appellent [information et relations](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html)) : la page dit, avec le nom de l'élément, quel rôle joue chaque morceau. Trois précisions évitent les erreurs les plus courantes.

La première : **`<header>` et `<footer>` ne sont `banner` et `contentinfo` que lorsqu'ils concernent la page entière**, c'est-à-dire lorsqu'ils ne sont pas à l'intérieur d'un `<main>`, d'une `<section>`, d'un `<article>`, d'un `<aside>` ou d'un `<nav>`. Peu importe qu'ils soient dans un `<div>` : je l'ai mesuré dans Chrome 154, et un `<header>` dans un `<div>` reste `banner`, alors qu'un `<header>` dans `<main>` cesse de l'être. Dans une `<section>` ou un `<article>`, ils sont l'en-tête ou le pied de cette partie, pas de la page, et le navigateur les traite ainsi. (Un **`<article>`** est un bloc qui a un sens propre, qu'on comprendrait isolé dans une autre page : une nouvelle, un commentaire, la fiche d'un service. Tu l'utiliseras dans le deuxième exercice.) La deuxième : **une `<section>` sans nom n'est pas un point de repère**. Elle regroupe du contenu d'un même thème, et l'habitude est qu'elle commence par un titre, mais elle ne devient une région navigable que si tu lui donnes un nom, et cela exige des attributs d'ARIA que nous ne voyons pas encore. C'est pourquoi elle n'apparaît pas dans l'arbre ci-dessus. Utilise-la pour regrouper, pas pour décorer. La troisième : **une page n'a qu'un seul `<main>`** : c'est le contenu qui change d'une page à l'autre, sans l'en-tête ni le pied qui se répètent.

La seconde page n'est pas plus belle, et elle n'a pas à l'être : l'œil n'a jamais été le problème. Celui qui écoute la première sait qu'il y a deux liens et un tas de texte, et doit deviner le reste. Celui qui écoute la seconde sait où il se trouve à chaque instant.

**[Les titres sont un index.](https://www.w3.org/WAI/tutorials/page-structure/headings/)** Celui qui utilise un lecteur d'écran peut demander la liste des titres de la page et la lire comme on lit la table des matières d'un livre ; il existe aussi des extensions qui l'affichent à n'importe qui. Pour que cet index serve, les niveaux signifient **hiérarchie, pas taille** : `<h1>` est le titre de la page (un seul, l'habitude solide même si le standard en permet davantage), `<h2>` sont ses sections, `<h3>` les parties d'une section. On ne saute pas de niveaux : d'un `<h2>` on descend à un `<h3>`, pas à un `<h4>`, comme un livre ne passe pas du chapitre 1 au paragraphe 1.1.1. Choisir `<h4>` parce que « le h2 est trop gros » est l'erreur la plus courante du débutant, et c'est le CSS de la prochaine leçon qui la corrige, pas le HTML. Le validateur du W3C signale les sauts. Tu le verras dans la section des erreurs.

Pour que l'on voie bien à quoi ressemble l'index du tableau de bord que tu vas construire, voici comment un lecteur d'écran le lirait :

```text
nivel 1: Revisor de servicios
  nivel 2: Resumen
  nivel 2: Servicios
```

Court, et suffisant. Si à l'avenir tu ajoutes le détail d'un service à l'intérieur de « Servicios », cette partie serait un niveau 3, et l'index resterait cohérent.

**Ce qu'ARIA n'est pas.** Tu as probablement déjà vu dans du code des attributs comme `role="button"` ou `aria-label="..."`. C'est **ARIA**, un ensemble d'attributs qui permet d'ajouter du sens à un élément qui n'en a pas. Il existe pour les cas que le HTML ne couvre pas. Sa première règle, dans [le guide que maintient le W3C](https://www.w3.org/TR/using-aria/), dit que **s'il existe un élément HTML avec le sens et le comportement dont tu as besoin, tu l'utilises**. Un `<button>` apporte déjà le rôle de bouton, la possibilité de recevoir le focus, l'activation avec Entrée et avec la barre d'espace. Un `<div role="button">` n'apporte que le rôle : le reste, c'est à toi de l'écrire, et presque personne ne l'écrit en entier. Le [guide des pratiques d'ARIA](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/) le résume en une phrase qu'il convient de retenir : *un rôle est une promesse*. Si tu dis que quelque chose est un bouton, tu t'engages à ce qu'il se comporte comme un bouton. C'est pourquoi, dans ce cours, **dans cette leçon et dans la suivante tu n'écriras pas une seule ligne d'ARIA** : presque tout ce dont le tableau de bord a besoin, le HTML natif le résout, et là où le HTML ne suffit pas, nous te le dirons en temps voulu.

#### 2.1.4 Du texte qui a du sens : listes, données et dates

À l'intérieur des sections, le texte aussi se choisit pour ce qu'il est. Il y a trois façons de regrouper des choses semblables, et chacune signifie quelque chose de différent :

```html
<!-- fig02_04.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Resumen del revisor</title>
</head>
<body>
  <main>
    <h1>Resumen</h1>
    <p>Última revisión:
      <time datetime="2026-10-07T10:30:00-06:00">7 de octubre de 2026, 10:30</time>
    </p>

    <h2>Como lista de datos con nombre</h2>
    <dl>
      <div>
        <dt>Servicios revisados</dt>
        <dd>5</dd>
      </div>
      <div>
        <dt>Disponibles</dt>
        <dd>4 de 5</dd>
      </div>
      <div>
        <dt>Caídos</dt>
        <dd>1</dd>
      </div>
    </dl>

    <h2>Como lista simple</h2>
    <ul>
      <li>Catálogo</li>
      <li>Pagos</li>
      <li>Inventario</li>
    </ul>

    <h2>Como lista con orden</h2>
    <ol>
      <li>Búsqueda: 950 ms</li>
      <li>Pagos: 480 ms</li>
      <li>Notificaciones: 310 ms</li>
    </ol>
  </main>
</body>
</html>
```

```text
Resumen

Última revisión: 7 de octubre de 2026, 10:30

Como lista de datos con nombre
Servicios revisados
5
Disponibles
4 de 5
Caídos
1
Como lista simple
Catálogo
Pagos
Inventario
Como lista con orden
Búsqueda: 950 ms
Pagos: 480 ms
Notificaciones: 310 ms
```

`<ul>` est une **liste non ordonnée** : des éléments qui vont ensemble mais qui pourraient être échangés de place. `<ol>` est une **liste ordonnée** : si tu déplaces un élément, le sens change (ici, du plus lent au plus rapide). `<dl>` est une **[liste de description](https://developer.mozilla.org/fr/docs/Web/HTML/Reference/Elements/dl)** : des paires de nom et de valeur, comme « Disponibles : 4 de 5 ». C'est la forme correcte du récapitulatif du tableau de bord, et presque personne ne l'utilise ; à la place, on voit des `<div>` avec du texte en gras qu'un lecteur d'écran ne sait pas être un nom et sa valeur. Dans le `<dl>`, chaque nom est un `<dt>` et chaque valeur un `<dd>` ; le standard permet de les regrouper avec un `<div>` quand tu veux leur donner une accroche pour le style, comme ici.

Un détail qui semble mineur : l'élément [`<time>`](https://developer.mozilla.org/fr/docs/Web/HTML/Reference/Elements/time). À l'intérieur, il porte le texte que voit la personne (« 7 de octubre de 2026, 10:30 »), mais son attribut `datetime` porte la même date dans le format que comprend une machine : année, mois, jour, heure et décalage par rapport à UTC (`-06:00` est l'heure du centre du Mexique, qui depuis 2022 ne change plus avec l'heure d'été). Le texte peut changer de langue ou de style et la donnée reste intacte. Les moteurs de recherche, les extensions et, plus tard, ton propre JavaScript peuvent la lire sans interpréter « 7 de octubre ».

Et une question que tu te poseras bientôt : pourquoi pas un `<br>` entre les lignes, ou des espaces pour indenter ? Parce que `<br>` signifie « saut de ligne à l'intérieur d'un même paragraphe » (un poème, une adresse postale), pas « un peu plus d'espace ». L'espace est de l'apparence et c'est le travail du CSS. Chaque fois que tu utilises une marque de contenu pour obtenir un effet visuel, tu mens sur ce qu'est quelque chose.

### 2.2 Des données en forme de tableau

#### 2.2.1 Quand un tableau et quand non

Un tableau est l'outil correct quand les données ont **deux dimensions qui se croisent** : des lignes qui sont des choses et des colonnes qui sont des propriétés de ces choses, et chaque cellule dit « cette propriété, de cette chose ». Le tableau de bord est exactement cela : chaque service (ligne) a un état et un temps de réponse (colonnes). Si les données n'ont qu'une seule dimension, c'est une liste. Si ce sont des paires de nom et de valeur, c'est un `<dl>`.

Il y eut une époque, il y a vingt ans, où l'on utilisait des tableaux pour disposer la page en colonnes, parce qu'il n'y avait pas d'autre outil. Aujourd'hui cette habitude est une erreur, pour deux raisons : le lecteur d'écran annonce « tableau de trois colonnes » sur quelque chose qui n'est pas un tableau, et la mise en page se casse sur un téléphone. La règle qui n'a pas d'exception est : **tableau pour des données, jamais pour disposer**. La disposition est le sujet de la Leçon 4.

#### 2.2.2 Les pièces d'un tableau accessible

Regarde le tableau des services du tableau de bord, avec trois de ses cinq services pour ne pas tout répéter :

```html
<!-- fig02_05.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Tabla de servicios</title>
</head>
<body>
  <main>
    <h1>Servicios</h1>
    <table>
      <caption>Estado de los servicios en la última revisión</caption>
      <thead>
        <tr>
          <th scope="col">Servicio</th>
          <th scope="col">Estado</th>
          <th scope="col">Tiempo de respuesta</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">Catálogo</th>
          <td>Disponible</td>
          <td>120 ms</td>
        </tr>
        <tr>
          <th scope="row">Pagos</th>
          <td>Disponible</td>
          <td>480 ms</td>
        </tr>
        <tr>
          <th scope="row">Inventario</th>
          <td>Caído</td>
          <td>sin respuesta</td>
        </tr>
      </tbody>
    </table>
  </main>
</body>
</html>
```

```text
Servicios
Estado de los servicios en la última revisión
Servicio	Estado	Tiempo de respuesta
Catálogo	Disponible	120 ms
Pagos	Disponible	480 ms
Inventario	Caído	sin respuesta
```

[Un tableau se monte avec des pièces imbriquées](https://www.w3.org/WAI/tutorials/tables/), et chacune a son travail :

- **`<table>`** enveloppe tout.
- **`<caption>`** est le titre du tableau. Il va en premier enfant et c'est ce qu'un lecteur d'écran annonce en arrivant (« Estado de los servicios en la última revisión, tableau de 3 colonnes et 3 lignes »). C'est mieux qu'un titre isolé avant le tableau, parce qu'il reste uni à lui.
- **`<thead>` et `<tbody>`** séparent la ligne de titres des lignes de données. Plus tard, le CSS peut styliser l'en-tête sans toucher au corps, et le navigateur peut répéter l'en-tête sur chaque page à l'impression.
- **`<tr>`** est une ligne.
- **`<th>`** est une **cellule d'en-tête** et **`<td>`** une cellule de donnée. C'est la distinction qui compte le plus dans tout le tableau.

Et à l'intérieur de `<th>`, l'attribut `scope` dit sur quoi pointe l'en-tête : `scope="col"` s'il coiffe une colonne, `scope="row"` s'il coiffe une ligne. Dans la première ligne les `<th>` intitulent des colonnes ; dans les autres, le premier `<th>` de chaque ligne est le nom du service et intitule sa ligne.

À quoi bon tout cela ? Parce que celui qui utilise un lecteur d'écran ne voit pas le tableau en entier : il se déplace cellule par cellule avec les flèches, et dans chaque cellule il a besoin de savoir à quoi elle correspond. Avec les `<th>` bien placés, en arrivant à « 120 ms » le lecteur annonce « Catálogo, Tiempo de respuesta, 120 ms ». Sans eux, il n'entend que « 120 ms » et doit se rappeler dans quelle ligne et dans quelle colonne il se trouvait. Si tu mets `<td>` au lieu de `<th>` pour le nom du service, la page s'affiche pareil et l'expérience se casse, et aucun validateur ne te le signale. C'est la raison pour laquelle cette leçon insiste sur le fait que le HTML **se vérifie avec des outils d'accessibilité et avec le clavier**, pas seulement en le regardant.

#### 2.2.3 Une cellule vide ment

Regarde la dernière ligne : le service `Inventario` est en panne et n'a donc pas de temps de réponse. Que mets-tu dans cette cellule ? Il y a trois tentations, et deux sont mauvaises. La laisser vide laisse le lecteur d'écran annoncer « vide », sans dire s'il s'agit d'un oubli ou d'une absence. Mettre `0 ms` est pire : c'est une donnée fausse, car un service qui n'a pas répondu n'a pas répondu en zéro milliseconde, et cela ruinerait ensuite la moyenne. L'honnête est de dire ce qui s'est passé : « sin respuesta » (« sans réponse »). C'est un texte, pas un nombre, et cette décision (le temps de réponse peut **ne pas exister**) revient quand tu calculeras la moyenne dans la Leçon 6.

### 2.3 Contrôles : bouton, lien et libellé

#### 2.3.1 Un lien va quelque part ; un bouton fait quelque chose

Avec la touche Tab, on parcourt les éléments avec lesquels l'utilisateur peut interagir, et la page suivante est une expérience qui vaut la peine d'être faite avec les mains :

```html
<!-- fig02_06.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Cuatro cosas que parecen controles</title>
</head>
<body>
  <main>
    <h1>Cuatro cosas que parecen controles</h1>
    <p><a href="#result">Ir al resultado</a></p>
    <p><button type="button">Revisar ahora</button></p>
    <div>Revisar ahora</div>
    <span>Ir al resultado</span>
    <p id="result">Aquí termina la página.</p>
  </main>
</body>
</html>
```

```text
Cuatro cosas que parecen controles
Ir al resultado
Revisar ahora
Revisar ahora
Ir al resultado
Aquí termina la página.
```

Ouvre-la et appuie sur Tab à plusieurs reprises. J'ai vérifié cette expérience avec Chrome 154 : **la touche ne s'arrête que deux fois**, sur le lien et sur le bouton, puis sort de la page. Le `<div>` avec le texte « Revisar ahora » (« Vérifier maintenant ») et le `<span>` avec « Ir al resultado » (« Aller au résultat ») **ne reçoivent pas le focus**. Pour le clavier, ils n'existent pas. Avec le CSS de la Leçon 3 tu pourrais les faire ressembler à s'y méprendre à un bouton et à un lien, et ils resteraient inatteignables sans souris, et pour le lecteur d'écran ils resteraient du texte.

Regarde ce que tu reçois gratuitement avec chaque vrai élément :

- **`<a href="...">`** est un **lien** : il promet de t'emmener ailleurs (une autre page, ou une autre partie de la même, comme `#result`). Gratuitement il apporte le focus avec Tab, l'activation avec Entrée, le clic droit pour copier l'adresse, le clic avec la molette pour l'ouvrir dans un autre onglet et la possibilité de se souvenir de quels liens tu as visités. Sans `href`, le `<a>` n'est pas un lien : c'est un repère sans destination.
- **`<button>`** est un **bouton** : il promet de faire quelque chose dans cette page. Il apporte le focus, l'activation avec Entrée et avec la barre d'espace, et l'état « désactivé » avec l'attribut `disabled`.

La règle qui résume les deux : **si l'action mène à une autre adresse, c'est un lien ; si elle change quelque chose ici même, c'est un bouton.** « Ir a Servicios » (« Aller à Services ») est un lien. « Revisar ahora » est un bouton. Se tromper produit des bizarreries que tu auras déjà vues : un « bouton » qui est un lien et ne s'active pas avec la barre d'espace, ou un « lien » qui est un bouton et ne peut pas s'ouvrir dans un autre onglet.

Une note sur `type="button"`. Quand un `<button>` est dans un formulaire (tu le verras dans la Leçon 10) et ne déclare pas de type, [le standard](https://html.spec.whatwg.org/multipage/forms.html) lui attribue `submit` : il envoie le formulaire et recharge la page. C'est l'une des surprises les plus fréquentes. Déclarer `type="button"` sur tout bouton qui n'envoie rien te l'épargne. Aujourd'hui le bouton « Revisar ahora » ne fait rien, parce que la page n'a pas encore de JavaScript. Dans la Leçon 8, il redemandera les données du tableau de bord, et pour cela le HTML que tu écris aujourd'hui n'aura besoin que d'un `id` de plus.

#### 2.3.2 Un champ sans libellé est un champ sans nom

Le dernier contrôle d'aujourd'hui est le champ de recherche. La règle est simple et se brise toujours : **chaque champ a besoin d'un libellé visible et associé**. « Associé » veut dire que le navigateur sait que ce texte appartient à ce champ. Il y a deux manières de l'associer et les deux sont dans la page suivante :

```html
<!-- fig02_07.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Etiquetas y grupos</title>
</head>
<body>
  <main>
    <h1>Etiquetas y grupos</h1>

    <p>
      <label for="search">Buscar servicio</label>
      <input type="search" id="search" name="search">
    </p>

    <p>
      <label>
        Nombre del servicio
        <input type="text" name="name">
      </label>
    </p>

    <fieldset>
      <legend>Mostrar</legend>
      <label><input type="radio" name="filter" value="all" checked> Todos</label>
      <label><input type="radio" name="filter" value="available"> Disponibles</label>
      <label><input type="radio" name="filter" value="down"> Caídos</label>
    </fieldset>
  </main>
</body>
</html>
```

```text
Etiquetas y grupos

Buscar servicio 

Nombre del servicio 

Mostrar
 Todos  Disponibles  Caídos
```

La première est l'**[association explicite](https://developer.mozilla.org/fr/docs/Web/HTML/Reference/Elements/label)** : le `<label>` porte `for="search"` et le champ porte `id="search"` ; la valeur de `for` est l'`id` du champ, et cette coïncidence est le lien. La seconde est l'**association implicite** : le champ est à l'intérieur du `<label>` et aucun `id` n'est nécessaire. Les deux fonctionnent ; l'explicite est plus flexible parce que le libellé et le champ peuvent être à des endroits différents du document, et l'implicite est plus courte. Pour vérifier que le lien est réel, clique sur le texte « Buscar servicio » (« Chercher un service ») : le curseur saute dans le champ. Je l'ai vérifié en automatisant ce clic dans Chrome, et le champ reçoit le focus. C'est un gain visible : une cible de clic bien plus grande pour celui qui a la main hésitante, ou qui touche avec le doigt.

Derrière, il se passe quelque chose qu'il convient de nommer. Tout élément interactif a un **[nom accessible](https://developer.mozilla.org/fr/docs/Glossary/Accessible_name)** : le texte avec lequel un lecteur d'écran l'annonce. Le navigateur le calcule avec des règles fixes, et pour un champ, le libellé associé est la source principale. Dans l'arbre d'accessibilité de Chrome, le champ ci-dessus apparaît comme `searchbox "Buscar servicio"` : un rôle et un nom. S'il n'y avait pas de libellé (ni d'autre indice d'où tirer un nom), il apparaîtrait comme `searchbox` tout court : une boîte sans nom. Et un outil d'audit, comme ceux que tu verras plus tard, le signale avec le message *« Form elements must have labels »*.

**Le `placeholder` n'est pas un libellé.** C'est cet indice gris qui apparaît à l'intérieur du champ et disparaît quand on écrit. La tentation de l'utiliser comme libellé est forte parce qu'il économise de la place, mais il échoue par trois côtés : il disparaît justement quand tu as besoin de te rappeler ce que tu devais écrire, sa couleur grise a souvent peu de contraste avec le fond, et ce n'est pas un libellé pour le navigateur : il ne crée aucune association et on ne peut pas cliquer dessus pour arriver au champ. Le navigateur ne le prend comme nom de secours que lorsqu'il n'y a pas de libellé ; je l'ai mesuré dans Chrome 154, et un champ de recherche sans `<label>` et avec `placeholder="Buscar servicio"` est annoncé comme `searchbox "Buscar servicio"`. C'est un rafistolage du navigateur, pas un libellé que la personne puisse voir. Utilise-le, à la rigueur, pour un exemple de format (`ej. catalogo`), jamais comme seul nom.

La troisième pièce est le **groupe**. Trois boutons radio (« Todos », « Disponibles », « Caídos », c'est-à-dire « Tous », « Disponibles », « En panne ») forment une seule question : *que veux-tu afficher ?* Le `<fieldset>` regroupe les contrôles qui vont ensemble et le `<legend>` est le titre du groupe, que le lecteur d'écran annonce avant chaque option. Les boutons radio qui partagent le même `name` se comportent déjà comme un groupe pour le navigateur : un seul peut être coché. Et c'est pourquoi, dans l'expérience de la touche Tab, **le groupe entier compte comme un seul arrêt** ; on y entre avec Tab et on change d'option avec les flèches. Je l'ai mesuré dans le tableau de bord complet : la touche Tab s'arrête cinq fois (deux liens, le champ de recherche, le groupe de boutons radio et le bouton).

Remarque une décision de conception : le filtre est un groupe de boutons radio et non trois boutons. C'est un choix entre des options exclusives, ce qui est exactement ce que signifie un bouton radio. Celui qui lit le code comprend l'intention sans commentaire.

#### 2.3.3 Quand utiliser `div` et `span`

Après tant d'éloges du sens, une précision : `<div>` et `<span>` ne sont pas mauvais. Ce sont les éléments qui **ne signifient rien**, et c'est utile quand tu as besoin de regrouper quelque chose seulement pour lui donner du style ou pour le retrouver ensuite avec JavaScript. `<div>` regroupe en bloc et `<span>` regroupe à l'intérieur d'une ligne. La règle est une règle d'ordre : **cherche d'abord l'élément porteur de sens ; seulement s'il n'existe pas, utilise `div` ou `span`**. Dans la plupart des pages que tu vois, c'est l'inverse qui se produit.

Tu verras un `<span class="status status-available">` dans le tableau des services. Il sert à ceci : l'état « Disponible » n'est rien d'autre que du texte, mais nous avons besoin d'un endroit où le CSS de la prochaine leçon mette un badge de couleur. C'est l'attribut `class` que tu as connu en 2.1.1 : un nom pour que le CSS le cible, qui ne change pas ce que l'élément signifie.

## Exemple résolu : le tableau de bord complet

Tu connais déjà toutes les pièces. Voici la page qui les assemble, le squelette du `revisor`, avec cinq services d'exemple. Enregistre-la sous le nom `index.html` dans ton dossier `revisor`, à la place du `index.html` de la Leçon 1 : à partir d'aujourd'hui, ce fichier est le tableau de bord, et les leçons suivantes vont le faire grandir. Lis-la de haut en bas avec la carte en tête : ce qu'est chaque chose, pourquoi cet élément et pas un autre.

```html
<!-- fig02_08.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Revisor de servicios</title>
  <link rel="icon" href="data:,">
</head>
<body>
  <header>
    <h1>Revisor de servicios</h1>
    <p>Última revisión:
      <time datetime="2026-10-07T10:30:00-06:00">7 de octubre de 2026, 10:30</time>
    </p>
    <nav>
      <p>Ir a: <a href="#summary">Resumen</a> o <a href="#services">Servicios</a></p>
    </nav>
  </header>

  <main>
    <section id="summary">
      <h2>Resumen</h2>
      <dl>
        <div>
          <dt>Servicios revisados</dt>
          <dd>5</dd>
        </div>
        <div>
          <dt>Disponibles</dt>
          <dd>4 de 5</dd>
        </div>
        <div>
          <dt>Caídos</dt>
          <dd>1</dd>
        </div>
        <div>
          <dt>Respuesta promedio</dt>
          <dd>465 ms</dd>
        </div>
      </dl>
    </section>

    <section id="services">
      <h2>Servicios</h2>

      <p>
        <label for="search">Buscar servicio</label>
        <input type="search" id="search" name="search">
      </p>

      <fieldset>
        <legend>Mostrar</legend>
        <label><input type="radio" name="filter" value="all" checked> Todos</label>
        <label><input type="radio" name="filter" value="available"> Disponibles</label>
        <label><input type="radio" name="filter" value="down"> Caídos</label>
      </fieldset>

      <p><button type="button">Revisar ahora</button></p>

      <table>
        <caption>Estado de los servicios en la última revisión</caption>
        <thead>
          <tr>
            <th scope="col">Servicio</th>
            <th scope="col">Estado</th>
            <th scope="col">Tiempo de respuesta</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Catálogo</th>
            <td><span class="status status-available">Disponible</span></td>
            <td>120 ms</td>
          </tr>
          <tr>
            <th scope="row">Pagos</th>
            <td><span class="status status-available">Disponible</span></td>
            <td>480 ms</td>
          </tr>
          <tr>
            <th scope="row">Inventario</th>
            <td><span class="status status-down">Caído</span></td>
            <td>sin respuesta</td>
          </tr>
          <tr>
            <th scope="row">Notificaciones</th>
            <td><span class="status status-available">Disponible</span></td>
            <td>310 ms</td>
          </tr>
          <tr>
            <th scope="row">Búsqueda</th>
            <td><span class="status status-available">Disponible</span></td>
            <td>950 ms</td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>

  <footer>
    <p>Datos de ejemplo escritos a mano.</p>
  </footer>
</body>
</html>
```

```text
Revisor de servicios

Última revisión: 7 de octubre de 2026, 10:30

Ir a: Resumen o Servicios

Resumen
Servicios revisados
5
Disponibles
4 de 5
Caídos
1
Respuesta promedio
465 ms
Servicios

Buscar servicio 

Mostrar
 Todos  Disponibles  Caídos

Revisar ahora

Estado de los servicios en la última revisión
Servicio	Estado	Tiempo de respuesta
Catálogo	Disponible	120 ms
Pagos	Disponible	480 ms
Inventario	Caído	sin respuesta
Notificaciones	Disponible	310 ms
Búsqueda	Disponible	950 ms

Datos de ejemplo escritos a mano.
```

Parcours les décisions, car c'est là que se trouve ce qu'on apprend :

- **L'icône vide** (`<link rel="icon" href="data:,">`) est la ligne de l'Exercice 2 de la Leçon 1 : elle dit au navigateur que la page n'a pas d'icône, pour qu'il ne demande pas `/favicon.ico` et ne salisse pas la console avec un 404. C'est un raccourci, et il a un coût que tu verras dans la Leçon 11, quand le tableau de bord sera publié avec une politique de sécurité et que cette icône sera remplacée par une vraie.
- **L'en-tête de la page** (`<header>`) regroupe le titre, la date de la dernière vérification et la navigation. Comme il dépend directement du `<body>`, c'est le `banner`. Le titre est l'unique `<h1>`.
- **La navigation** (`<nav>`) a deux liens, parce qu'ils mènent à d'autres parties de la page : c'est ce que fait un lien. Ils sont écrits à l'intérieur d'une phrase (« Ir a: … o … », « Aller à : … ou … ») ; les recommandations d'accessibilité demandent que les cibles tactiles aient au moins 24 × 24 pixels ou un espace suffisant autour ([WCAG 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)), et exceptent expressément les liens qui sont à l'intérieur d'une phrase, parce que leur taille est imposée par la ligne de texte. Les écrire dans une phrase ne les rend pas plus grands : cela les sépare par des mots et les laisse dans cette exception, sans une ligne de CSS. Deux liens isolés, l'un à côté de l'autre, n'auraient ni l'une ni l'autre. Dans la Leçon 4 tu verras un vrai menu.
- **Le récapitulatif** est un `<dl>` : des noms et des valeurs. Remarque le calcul, car il sera réutilisé : il y a 5 services, 4 disponibles et 1 en panne ; la réponse moyenne de 465 ms est la moyenne des **quatre qui ont répondu** (120 + 480 + 310 + 950 = 1,860 ; 1,860 / 4 = 465). Le service en panne ne compte pas comme zéro.
- **Les contrôles** sont les trois que tu connais : un champ avec libellé, un groupe de boutons radio avec titre et un bouton de type explicite. Aucun n'est encore dans un formulaire ; le formulaire, avec envoi et validation, est le sujet de la Leçon 10.
- **Le tableau** porte un titre, des en-têtes de colonne et de ligne, et une cellule qui dit la vérité sur le service en panne.
- **Le pied** (`<footer>`) dit d'où viennent les données : d'exemple et écrites à la main.

Fais maintenant ce que ne fait aucun lecteur de ce code : **utilise-la comme l'utiliseraient les trois autres personnes du début**. Appuie sur Tab depuis le début et compte les arrêts : il devrait y en avoir cinq, et le focus devrait aller dans l'ordre de haut en bas. Ouvre le volet d'accessibilité des outils du navigateur et vérifie que tu vois `banner`, `main` et `contentinfo`. Fais passer la page par le validateur officiel, comme l'explique la section suivante. Si les trois épreuves réussissent, ton HTML fait ce qu'il dit.

## L'erreur que tu vas voir

Les erreurs de HTML, le navigateur ne les montre presque jamais. C'est un validateur qui les montre. Celui du W3C s'appelle [*Nu Html Checker*](https://validator.w3.org/nu/) et vit à `https://validator.w3.org/nu/` ; là tu peux téléverser un fichier ou coller le code dans une zone de texte. Nous allons casser la page exprès pour apprendre à lire sa réponse. Celle-ci a six défauts :

```html
<!-- fig02_09.html -->
<html>
<head>
  <title>Revisor roto</title>
</head>
<body>
  <h1>Revisor de servicios</h1>
  <h4>Servicios</h4>
  <input type="search" placeholder="Buscar servicio">
  <a href="#result"><button>Revisar ahora</button></a>
  <img src="logo.png">
  <p id="result">
    <div>4 de 5 disponibles</div>
  </p>
</body>
</html>
```

En la collant dans le validateur, voici ce qu'il répond (copié du résultat réel) :

```text
Error: Start tag seen without seeing a doctype first. Expected “<!DOCTYPE html>”.
From line 1, column 23; to line 2, column 6
Error: The element “button” must not appear as a descendant of the “a” element.
From line 10, column 21; to line 10, column 28
Error: An “img” element must have an “alt” attribute, except under certain conditions. For details, consult guidance on providing text alternatives for images.
From line 11, column 3; to line 11, column 22
Error: No “p” element in scope but a “p” end tag seen.
From line 14, column 3; to line 14, column 6
Warning: Consider adding a “lang” attribute to the “html” start tag to declare the language of this document.
From line 1, column 23; to line 2, column 6
Error: The heading “h4” (with computed level 4) follows the heading “h1” (with computed level 1), skipping 2 heading levels.
From line 8, column 3; to line 8, column 6
There were errors.
```

C'est en anglais, et c'est l'anglais de la documentation que tu liras toute ta carrière, donc cela vaut la peine d'apprendre à le lire. Chaque message donne la ligne et la colonne où cela se produit. Un par un :

1. **Le `DOCTYPE` manque.** Tu sais déjà pourquoi c'est important : sans lui, le navigateur entre en mode quirks. On le corrige en écrivant `<!DOCTYPE html>` en première ligne.
2. **Un `<button>` dans un `<a>`.** C'est une erreur courante et elle a une raison : un élément interactif ne peut pas vivre à l'intérieur d'un autre. Qu'est-ce qui s'active quand on clique, le bouton ou le lien ? Les navigateurs ne se mettent pas d'accord. On en choisit un : si le contrôle mène ailleurs, un lien ; s'il fait quelque chose ici, un bouton.
3. **Une `<img>` sans `alt`.** L'attribut [`alt`](https://www.w3.org/WAI/tutorials/images/decision-tree/) est le texte que lit le lecteur d'écran à la place de l'image. Si l'image apporte de l'information, l'`alt` la décrit ; si c'est seulement de la décoration, on le laisse vide (`alt=""`) pour qu'elle soit ignorée. On ne l'omet jamais. Le tableau de bord n'a pas d'images, et pourtant c'est l'erreur la plus fréquente du web, c'est pourquoi je l'inclus.
4. **Un `</p>` sans son `<p>`.** C'est la conséquence d'une règle du HTML : un `<p>` ne peut contenir que du texte et des éléments de ligne, pas un `<div>`. Le navigateur ferme le paragraphe avant le `<div>` de son propre chef, et la balise de fermeture que tu as écrite reste orpheline. C'est pourquoi le message dit « aucun p n'est ouvert » : c'est le navigateur qui l'a fermé, sans te prévenir.
5. **`lang` manque.** Il apparaît comme avertissement, pas comme erreur, mais tu sais déjà ce que cela coûte.
6. **Le `<h4>` après le `<h1>`.** Le validateur a fait le compte : il a sauté deux niveaux. Tu le corriges avec `<h2>`.

Remarque ce qu'il **n'**a pas dit. Le `<input>` sans libellé, avec seulement un `placeholder`, est passé sans avertissement : le validateur vérifie que la syntaxe est légale, pas que la page est utilisable. Cela, d'autres outils le détectent, ceux d'audit d'accessibilité. Le navigateur en apporte un dans ses outils de développement (dans Chrome il s'appelle Lighthouse), et presque tous s'appuient sur un moteur appelé axe, qui sur cette même page répond, entre autres, avec ces messages réels :

```text
heading-order: Heading levels should only increase by one
html-has-lang: <html> element must have a lang attribute
image-alt: Images must have alternative text
```

Et sur une variante du tableau de bord sans le `<label>`, `label: Form elements must have labels`. **Les deux types d'outils sont complémentaires** : le validateur attrape ce que le standard interdit et l'audit attrape ce qui laisse quelqu'un dans l'impossibilité d'utiliser la page. Il y a un troisième type d'erreur qu'aucun des deux n'attrape : changer un `<th>` en `<td>` ne produit aucun message, même si cela casse l'annonce du tableau. Pour celui-là, il n'y a qu'une chose qui serve : essayer avec le clavier et avec l'arbre d'accessibilité.

## Ce qui se fait de travers

**1. Construire des contrôles avec `div` ou `span`.** Le cas de la page aux quatre éléments : un `<div>` qui dit « Revisar ahora ». *Coût :* personne au clavier ne l'atteint, aucun lecteur d'écran ne l'annonce comme un bouton, et reconstruire à la main le focus, la barre d'espace et l'état désactivé est un travail que le navigateur a déjà fait. Correction : un `<button type="button">`.

**2. Choisir le titre d'après sa taille.** Un `<h4>` parce que le `<h2>` « paraît gros », ou un `<p>` en gras parce que « c'est déjà un titre ». *Coût :* l'index des titres est plein de trous ou vide, et celui qui navigue par titres ne trouve rien. Correction : choisis le niveau d'après la hiérarchie ; la taille est l'affaire du CSS.

**3. Utiliser des tableaux pour disposer la page.** *Coût :* le lecteur d'écran annonce des tableaux là où il n'y a pas de données, la page ne s'adapte pas à un téléphone et le code est difficile à lire. Correction : un tableau seulement pour des données avec des lignes et des colonnes qui se croisent.

**4. Toutes les cellules en `<td>`.** Le cas le plus difficile à voir, car la page s'affiche parfaitement. *Coût :* le lecteur d'écran annonce « 120 ms » sans dire de qui ni de quoi. Correction : `<th scope="col">` dans les titres de colonne et `<th scope="row">` dans le nom de la ligne.

**5. Le `placeholder` comme seul libellé.** *Coût :* l'indice disparaît quand on écrit, il a souvent peu de contraste et le champ dépend d'un nom de secours que la personne cesse de voir dès qu'elle écrit. Correction : un `<label>` visible, associé avec `for` et `id` ou enveloppant le champ.

**6. Un lien qui joue le bouton, ou un bouton qui joue le lien.** Un `<a href="#">` qui déclenche une action, ou un `<button>` qui navigue. *Coût :* le clic à la molette, la barre d'espace, la copie de l'adresse, l'historique se cassent. Correction : « va quelque part » est un lien, « fait quelque chose » est un bouton.

**7. `<br>` et `&nbsp;` pour donner de l'espace.** *Coût :* un lecteur d'écran peut lire « ligne vide » ou des sauts qui ne signifient rien, et l'espace reste attaché au texte. Correction : l'espace est l'affaire du CSS.

**8. Ne pas mettre d'`alt` à une image.** *Coût :* l'image est invisible pour celui qui ne la voit pas. Correction : un `alt` qui dise quelle fonction remplit l'image, ou `alt=""` si c'est de la pure décoration.

## Exercices

### Exercice 1 — Compte les arrêts

Avec le tableau de bord complet ouvert sur ton serveur local, lâche la souris et n'utilise que le clavier. Appuie sur Tab depuis le début et note, dans l'ordre, sur quoi s'arrête le focus à chaque fois. Ensuite remplace `<button type="button">` par `<div>` dans ta copie, recharge et compte de nouveau. Combien d'arrêts as-tu en moins ? Qu'est-ce qui n'est plus possible ?

### Exercice 2 — De `div` au sens

Ce fragment montre une « fiche » de service écrite seulement avec `div` et `span`. Réécris-le avec les éléments qui disent ce qu'est chaque chose, sans changer le texte qui se lit :

```html
<div class="card">
  <div class="card-title">Pagos</div>
  <div class="card-row"><span>Estado</span> <span>Disponible</span></div>
  <div class="card-row"><span>Respuesta</span> <span>480 ms</span></div>
  <div class="card-action" onclick="check()">Revisar este servicio</div>
</div>
```

Un indice : ce sont deux paires de nom et de valeur, une action et un intitulé qui mérite d'être un titre.

### Exercice 3 — Ajoute un service et refais les comptes

Ajoute au tableau de bord un sixième service, `Correo`, disponible et avec 210 ms de réponse. Ensuite mets à jour le récapitulatif à la main : combien de services il y a, combien sont disponibles, combien sont en panne et quelle est la réponse moyenne. Rappelle-toi de quels services la moyenne est calculée.

### Exercice 4 — Casse trois choses et regarde lesquelles se remarquent

Dans une copie du tableau de bord, fais trois changements : retire le `<label>` du champ de recherche, remplace le deuxième `<h2>` par un `<h4>` et remplace le `<th scope="row">Pagos</th>` par `<td>Pagos</td>`. Fais passer la copie par le validateur officiel. Lesquels des trois défauts signale-t-il ? Pour ceux qu'il ne signale pas, comment les découvrirais-tu ?

## Solutions

### Solution 1

Avec le vrai bouton, le focus s'arrête cinq fois, dans cet ordre : le lien « Resumen », le lien « Servicios », le champ de recherche, le groupe de boutons radio (un seul arrêt, et à l'intérieur on change avec les flèches) et le bouton « Revisar ahora ». Ensuite le focus sort de la page vers la barre du navigateur. Avec le `<div>`, il reste **quatre** arrêts, un de moins : le bouton a cessé de recevoir le focus, donc **on ne peut plus l'activer sans souris**. C'est la différence entre un contrôle et quelque chose qui ressemble à un contrôle.

### Solution 2

L'intitulé est un titre (`<h3>`, parce qu'il dépend de la section « Servicios », qui est de niveau 2), les deux paires de nom et de valeur sont une liste de description, et l'action est un bouton. Comme le `onclick` est du JavaScript dans le HTML et que nous ne l'utilisons pas encore, on le retire : qui écoute le clic se verra dans la Leçon 7.

```html
<article>
  <h3>Pagos</h3>
  <dl>
    <div>
      <dt>Estado</dt>
      <dd>Disponible</dd>
    </div>
    <div>
      <dt>Respuesta</dt>
      <dd>480 ms</dd>
    </div>
  </dl>
  <button type="button">Revisar este servicio</button>
</article>
```

On a utilisé `<article>` parce que la fiche est une unité qui a un sens propre, qu'on comprendrait isolée dans une autre page ; un `<div>` serait aussi valide si tu ne veux pas déclarer cette idée. Ce qui n'est pas valide, c'est de laisser le titre comme un `<div>` ou l'action comme un `<div>`.

### Solution 3

Avec le sixième service, le récapitulatif devient : **6** services vérifiés, **5 sur 6** disponibles, **1** en panne. La réponse moyenne se calcule avec les cinq qui ont répondu : 120 + 480 + 310 + 950 + 210 = 2,070, et 2,070 / 5 = **414 ms**. Le service en panne n'entre toujours pas dans la moyenne, parce qu'il n'a pas de temps de réponse. La nouvelle ligne respecte la structure des autres :

```html
<tr>
  <th scope="row">Correo</th>
  <td><span class="status status-available">Disponible</span></td>
  <td>210 ms</td>
</tr>
```

Si tu as calculé 345 ms (2,070 / 6), tu as compté le service en panne comme s'il avait répondu en zéro, ce qui est exactement l'erreur que décrit la section 2.2.3.

### Solution 4

Le validateur n'en signale **qu'un seul** : le `<h4>` après le `<h2>`, avec le message *« The heading “h4” (with computed level 4) follows the heading “h2” (with computed level 2), skipping 1 heading level »* (je l'ai vérifié avec une vraie copie du tableau de bord). Le `<label>` manquant, il ne le signale pas, parce qu'un champ sans libellé est du HTML légal ; tu le découvrirais avec un outil d'audit, qui répond *« Form elements must have labels »*, ou avec l'arbre d'accessibilité, où le champ apparaît sans nom. Le `<td>` à la place du `<th>`, aucun des deux outils ne le signale : on le découvre avec l'arbre d'accessibilité (le nom de la ligne n'est plus associé aux cellules) ou, mieux, en écoutant le tableau avec un lecteur d'écran. Morale : passer le validateur est nécessaire et n'est pas suffisant.

## Comment savoir que j'ai réussi

- [ ] Le tableau de bord s'ouvre sur `http://localhost:8000/` servi avec `python3 -m http.server 8000 --bind 127.0.0.1`, sans erreurs dans l'onglet console des outils du navigateur.
- [ ] La touche Tab s'arrête exactement cinq fois dans la page (deux liens, le champ, le groupe de boutons radio et le bouton), dans l'ordre de haut en bas.
- [ ] Le volet d'accessibilité des outils du navigateur montre `banner`, `navigation`, `main` et `contentinfo`, et les titres sortent dans l'ordre 1, 2, 2.
- [ ] En collant la page dans `https://validator.w3.org/nu/` la réponse est *« Document checking completed. No errors or warnings to show. »*
- [ ] En cliquant sur le texte « Buscar servicio » le curseur saute dans le champ de recherche.
- [ ] Tu peux expliquer avec tes mots pourquoi un `<div>` qui dit « Revisar ahora » n'est pas un bouton, et pourquoi `120 ms` sans son `<th>` est une donnée orpheline.

## Pour aller plus loin

- (en anglais, comme presque toute la documentation officielle) [Standard HTML du WHATWG, « Sections »](https://html.spec.whatwg.org/multipage/sections.html) — la source qui décide ce que signifient `<header>`, `<nav>`, `<main>`, `<section>` et `<footer>`, et quand chacun est un point de repère. Consulté le 7 octobre 2026.
- [MDN, « Structurer le contenu avec HTML »](https://developer.mozilla.org/fr/docs/Learn_web_development/Core/Structuring_content) — le module d'apprentissage de Mozilla qui suit le même ordre que cette leçon, avec des défis pratiques de tableaux et de structure. Consulté le 7 octobre 2026.
- [W3C WAI, tutoriel sur les tableaux](https://www.w3.org/WAI/tutorials/tables/) — comment construire des tableaux qu'un lecteur d'écran peut parcourir, avec des exemples d'en-têtes simples et complexes. Consulté le 7 octobre 2026.
- [W3C WAI, « Notes sur l'utilisation d'ARIA en HTML »](https://www.w3.org/TR/using-aria/) — le guide des règles d'ARIA, en commençant par « s'il existe un élément HTML natif, utilise-le ». Consulté le 7 octobre 2026.
