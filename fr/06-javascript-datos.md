# Leçon 6 — JavaScript et le modèle de données

**Durée :** 90 min (ou 2 × 45)

**Ce que tu construis :** les données du tableau de bord et ses calculs

**Ce que tu apprends :** valeurs, objets, tableaux et fonctions ; décisions, boucles et erreurs ; modules ; le tableau des services, combien sont en marche et le temps de réponse moyen

**D'où tu viens.** Tu arrives avec le tableau de bord de la [Leçon 5](05-pagina-adaptable.md) : le HTML porteur de sens de la [Leçon 2](02-html-con-significado.md), la feuille de style de la Leçon 3 et la disposition des leçons 4 et 5, qui s'adapte de 320 à 1440 px. C'est un tableau de bord qui a bonne allure, mais **tout ce qu'il dit est écrit à la main** : « 5 servicios revisados » (5 services vérifiés), « 4 de 5 disponibles » (4 sur 5 disponibles), « 1 caído » (1 en panne), « 465 ms » de réponse moyenne. Ces quatre chiffres, tu les as additionnés toi-même avec une calculatrice dans la Leçon 2, et si un service change aujourd'hui, il faut tout recalculer. C'est cela que cette leçon retire du chemin. Tu travailles dans ton dossier `revisor`, dans le sous-dossier `js/` que tu as créé dans la [Leçon 1](01-entorno-ciclo-trabajo.md), et tu continues à tout servir avec `python3 -m http.server 8000 --bind 127.0.0.1` : aucune étape de cette leçon ne demande d'installer quoi que ce soit de plus.

**Ce que cette leçon ne fait pas.** Elle ne touche pas à la page. Les résultats des programmes d'aujourd'hui apparaissent dans la **console** des outils du navigateur, pas dans le tableau de bord. La façon de les dessiner dans le tableau est le sujet de la [Leçon 7](07-dom-eventos-estado.md), et celle d'où viennent les données quand elles ne sont pas écrites dans le programme lui-même, le sujet de la [Leçon 8](08-traer-datos.md). Aujourd'hui, on résout d'abord le problème de fond : **comment représenter un service, comment garder une liste de services et comment calculer les chiffres à partir de cette liste**.

## À la fin, tu seras capable de

- Stocker une valeur avec `const` ou `let`, dire de quel type elle est avec `typeof` et expliquer pourquoi `120 === "120"` donne `false`.
- Représenter un service comme un objet avec des propriétés et la liste des services comme un tableau d'objets, et lire ou modifier n'importe laquelle de leurs données.
- Parcourir un tableau avec `filter`, `map`, `find`, `some`, `every` et `reduce`, ou pas à pas avec `for…of` ; décider avec `if`, `else` et l'opérateur ternaire ; signaler une erreur avec `throw` et l'attraper avec `try…catch`, et lire `new` et les trois points `...` quand ils apparaissent.
- Écrire les deux calculs du tableau de bord —combien de services sont disponibles et le temps de réponse moyen— sous forme de fonctions qui reçoivent la liste et renvoient un nombre.
- Expliquer pourquoi une moyenne calculée sans précaution donne 372 ms là où la bonne réponse est 465, et la corriger.
- Découper le programme en modules (`export` et `import`), le charger avec `<script type="module">` et expliquer pourquoi ce module ne s'ouvre pas par un double-clic.
- Lire les cinq messages d'erreur les plus fréquents de cette étape et dire ce qui les a causés.

## Le pourquoi avant le comment

Regarde le récapitulatif du tableau de bord tel qu'il est resté dans la Leçon 2. Il dit qu'il y a 5 services, que 4 sont disponibles, que 1 est en panne et que la réponse moyenne est de 465 ms. Chacun de ces chiffres a été obtenu en regardant le tableau et en faisant un calcul. Imagine maintenant que l'équipe d'astreinte du service de courrier demande qu'on l'ajoute au tableau de bord : il faut écrire une nouvelle ligne dans le tableau et, **séparément**, changer le 5 en 6, le « 4 de 5 » en « 5 de 6 » et recalculer la moyenne. Si tu en oublies un seul des quatre, le tableau de bord se contredit lui-même : le tableau compte six lignes et le récapitulatif en annonce cinq. Dans l'Exercice 3 de la Leçon 2, tu l'as fait à la main et tu as vu combien il est difficile de ne pas se tromper.

Le problème, c'est que **la même donnée est écrite à deux endroits**, et deux copies d'une donnée finissent toujours par diverger. La solution consiste à l'écrire une seule fois, à un endroit qu'un programme peut lire, et à obtenir de là tout le reste —les lignes du tableau, le 5, le « 4 de 5 », les 465 ms. Telle est l'idée de cette leçon, et de la suivante : **les données sont à part, et ce qu'on voit se calcule à partir d'elles**.

Pour cela, il faut un langage de programmation, et celui du web est **JavaScript**. C'est le langage de programmation que tous les navigateurs exécutent d'eux-mêmes, sans rien installer : HTML dit ce qu'est chaque chose, CSS dit comment elle se présente et JavaScript dit ce qu'elle fait. Il ne faut pas le confondre avec Java, qui est un autre langage sans rapport (la ressemblance des noms est historique et trompeuse). [Sa spécification s'appelle **ECMAScript**](https://tc39.es/ecma262/) et Ecma International la publie chaque année ; [l'édition en vigueur en octobre 2026 est la 17e, de juin de cette année](https://ecma-international.org/publications-and-standards/standards/ecma-262/). Pour ce que tu fais aujourd'hui, tu n'as pas besoin de savoir ce qu'apporte chaque édition, mais il est bon de savoir qu'il existe une norme avec un propriétaire et une version, comme pour HTML et CSS : ce que tu apprends fonctionne de la même façon dans tous les navigateurs.

### Comment un programme s'exécute dans le navigateur

Un programme est une liste d'instructions qui s'exécutent **l'une après l'autre, de haut en bas**. Le navigateur embarque un moteur qui les lit et les exécute. Il y a deux façons de voir ce qu'il fait. La première est la **console** des [outils de développement du navigateur](https://developer.chrome.com/docs/devtools/console) : ouvre-les avec `F12` et va dans l'onglet « Console ». Tout ce que le programme envoie à l'affichage avec `console.log(...)` y apparaît, ainsi que les erreurs. La seconde est la page elle-même, qui, à partir de la Leçon 7, sera dessinée avec les données.

Aujourd'hui, tu ne travailles qu'avec la console. Chaque programme de cette leçon est une page dont l'unique mission est d'exécuter un programme et de laisser son résultat à la vue. Chacune contient un texte qui dit « Abre la consola de las herramientas del navegador (F12) para ver el resultado » (Ouvre la console des outils du navigateur (F12) pour voir le résultat), et c'est la seule partie visible. Elles se trouvent dans [`programas/06-javascript-datos/`](https://github.com/HabilMX/curso-web/tree/main/programas/06-javascript-datos), dans le dépôt du cours. Pour les exécuter, télécharge-le et, depuis ce dossier, [lance le serveur local et ouvre la page](https://docs.python.org/3/library/http.server.html) :

```bash
$ python3 -m http.server 8000 --bind 127.0.0.1
Serving HTTP on 127.0.0.1 port 8000 (http://127.0.0.1:8000/) ...
```

(Ce qui compte, c'est qu'il reste en attente : le terminal ne te rend pas la main. Pour l'arrêter, `Ctrl`+`C`.) Chaque fois que tu modifies un fichier, recharge la page avec `Ctrl`+`Maj`+`R`.

### Un programme qui se voit de l'extérieur : ce que tu écrivais à la main, calculé

Avant d'entrer dans la syntaxe, l'objectif concret. À la fin de la leçon, tu auras trois petits fichiers dans ton dossier `js/` : un avec les données, un autre avec les deux calculs et un dernier qui les utilise. Et en ouvrant le tableau de bord, tu verras, dans la console, ces quatre lignes :

```text
Disponibles: 4
Caídos: 1
Respuesta promedio: 465 ms
{"available":4,"down":1,"averageMs":465}
```

Les mêmes chiffres que tu avais écrits à la main dans la Leçon 2, mais cette fois produits par un programme à partir des données. Si tu ajoutes un service et que tu recharges, ils changent tout seuls. Avec cette destination en tête, le chemin comporte trois tronçons, un par concept : d'abord les valeurs les plus simples, puis les objets et les tableaux qui servent à représenter les données —et, avec eux, comment un programme décide, répète et signale une erreur—, et enfin comment répartir le programme en fichiers.

## Les concepts

### 6.1 Valeurs et variables

#### 6.1.1 Les valeurs du tableau de bord

Les données d'un service sont de quelques sortes seulement. Un nom (« Catálogo ») est un **texte**, qui en programmation s'appelle une **chaîne** (*string*) et s'écrit entre guillemets. Un temps de réponse (120) est un **nombre**. Qu'un service soit en marche ou en panne est une question à réponse oui ou non, et sa valeur s'appelle un **booléen** : `true` ou `false`. Et il y a deux valeurs qui signifient « rien » et qui, au début, se confondent : `null` et `undefined`. C'est pourquoi il convient de voir les six ensemble. Selon le [guide de MDN sur la grammaire et les types](https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Grammar_and_types), JavaScript a huit types de valeurs : sept primitifs (booléen, `null`, `undefined`, nombre, `BigInt`, chaîne et symbole) et un composé, l'objet. Dans ce cours, tu utiliseras des chaînes, des nombres, des booléens, `null` et `undefined`, et des objets ; `BigInt` et les symboles n'apparaissent pas.

Ouvre `fig06_01.html` et sa console :

```html
<!-- fig06_01.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Valores y variables</title>
</head>
<body>
  <main>
    <h1>Valores y variables</h1>
    <p>Abre la consola de las herramientas del navegador (F12) para ver el resultado.</p>
  </main>
  <script type="module">
    const name = "Catálogo";
    let responseMs = 120;
    const isUp = true;

    console.log(typeof name, typeof responseMs, typeof isUp);

    responseMs = responseMs + 30;
    console.log(`${name} respondió en ${responseMs} ms`);

    const noAnswer = null;
    let notYet;
    console.log(typeof noAnswer, typeof notYet);

    console.log(120 === "120", 120 == "120");
    console.log(0.1 + 0.2, 0.1 + 0.2 === 0.3);
    console.log(Number("abc"), Number.isNaN(Number("abc")));
  </script>
</body>
</html>
```

La console affiche :

```text
string number boolean
Catálogo respondió en 150 ms
object undefined
false true
0.30000000000000004 false
NaN true
```

Ligne par ligne :

- `const name = "Catálogo";` **déclare une variable** : un nom qui garde une valeur. Ensuite, on peut utiliser `name` partout où l'on a besoin du texte. `typeof` demande de quel type est une valeur, et renvoie `"string"`, `"number"` ou `"boolean"` ; selon l'[opérateur `typeof`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/typeof), c'est le nom du type.
- `let responseMs = 120;` déclare aussi une variable, mais avec `let`, parce que sa valeur va changer : `responseMs = responseMs + 30;` stocke une nouvelle valeur (150). Le modèle avec accents graves, `` `${name} respondió en ${responseMs} ms` ``, s'appelle un [littéral de gabarit](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Template_literals) : ce qui se trouve entre `${` et `}` est calculé puis inséré dans le texte.
- `typeof noAnswer` donne `"object"` pour `null`. C'est une bizarrerie des origines du langage, [une erreur qui n'a jamais été corrigée pour ne pas casser les anciens programmes](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/typeof). Cela ne veut pas dire que `null` soit un objet. Si tu as besoin de savoir si une valeur est `null`, compare-la directement : `valor === null`.
- `120 === "120"` donne `false` et `120 == "120"` donne `true`. Voici une règle qui t'épargne un après-midi perdu : **compare toujours avec trois signes, `===`**. Le triple égal compare la valeur *et* son type ; le double égal tente de convertir l'une des deux avant de comparer, et ces conversions obéissent à des règles peu intuitives (l'[article de MDN sur l'égalité](https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness) les énumère). Il n'y a pas un seul cas du `revisor` où `==` aide, et il y en a beaucoup où il gêne.
- `0.1 + 0.2` donne `0.30000000000000004`. Ce n'est pas un défaut de JavaScript mais de la façon dont on stocke les nombres à virgule dans n'importe quel langage qui suit la norme IEEE 754 : tous les nombres de JavaScript sont des flottants de 64 bits, selon la [documentation de `Number`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Number), avec environ 15 à 17 chiffres significatifs. Certaines décimales simples ne tiennent pas exactement en binaire et sont approchées. Conséquence pratique : **ne compare pas avec `===` le résultat d'un calcul à décimales en attendant une valeur exacte** ; on compare avec une tolérance (que la différence soit inférieure à, par exemple, `0.000001`) ou l'on travaille avec des entiers et, pour l'argent, en centimes. Comparer avec `===` est correct quand le nombre ne provient pas d'un calcul, comme un `120` écrit tel quel : le problème n'est pas le `===`, c'est l'arrondi du calcul. Les temps de réponse du tableau de bord sont des millisecondes entières, donc tu ne tomberas pas là-dessus aujourd'hui ; mais il est bon de l'avoir vu une fois.
- `Number("abc")` donne [`NaN`, qui signifie « n'est pas un nombre »](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/NaN) (*not a number*) et c'est, curieusement, une valeur de type nombre. Comme `NaN === NaN` donne `false`, pour savoir si une valeur est `NaN`, la comparer ne sert à rien ; la façon la plus claire est `Number.isNaN(valor)`. Il en existe d'autres, comme `valor !== valor` (`NaN` est la seule valeur différente d'elle-même), mais celle-ci se lit comme une astuce, et dans ce cours on utilise `Number.isNaN`. Elle réapparaîtra plus bas, comme symptôme d'un calcul mal fait.

#### 6.1.2 `const`, `let` et pourquoi plus `var`

Tu as déjà utilisé deux façons de déclarer. La troisième, `var`, est celle qu'apportent les vieux tutoriels, et dans ce cours on ne l'utilise pas. [Le tableau de MDN le résume](https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Grammar_and_types) : `var` vit dans toute la fonction où il est déclaré (et, s'il est déclaré hors de toute fonction, dans tout le module ou tout le script, selon [MDN](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/var)), il est « hissé » (on lui donne une existence, avec la valeur `undefined`, dès le début de cette portée même si tu le déclares plus bas) et il permet de redéclarer le même nom sans protester, alors que `let` et `const` ne vivent qu'à l'intérieur de la paire d'accolades où ils sont déclarés et n'existent pas avant leur déclaration. Une erreur que `var` cache, `let` et `const` la crient, et c'est ce qu'on veut.

La règle du cours est : **utilise `const` par défaut ; utilise `let` seulement quand tu vas vraiment réaffecter**. Cela n'a rien à voir avec la vitesse mais avec la lecture : si tu vois `const total = ...`, tu sais que `total` ne changera nulle part plus bas ; si tu vois `let total`, tu sais qu'il faut chercher où il change.

Il y a une nuance qui surprend. `const` empêche de *réaffecter* le nom, mais n'empêche pas de *modifier le contenu* de la valeur si cette valeur est un objet ou un tableau. Tu le verras dans la partie suivante.

### 6.2 Objets, tableaux et fonctions : le modèle de données

Voici le cœur de la leçon. Les valeurs isolées ne suffisent pas : un service n'est ni un nombre ni un texte, c'est *un ensemble de données qui vont ensemble* (un nom, un état, un temps), et le tableau de bord n'a pas un service, il a une *liste* de services. Il faut deux façons de regrouper : l'objet, qui réunit des données de nature différente sous des noms, et le tableau, qui réunit beaucoup de choses dans un ordre. JavaScript permet de mélanger dans un même tableau des valeurs de n'importe quel type (textes, nombres, objets, d'autres tableaux) ; dans le tableau de bord, par habitude et pour que ce soit facile à lire, chaque tableau ne garde que des choses d'une seule sorte : uniquement des services.

#### 6.2.1 L'objet : un service

Un **objet** est une collection de paires **nom : valeur**, écrite entre accolades. Les noms s'appellent des **propriétés**. Voici comment on représente un service du tableau de bord :

```js
const service = {
  id: "catalog",
  name: "Catálogo",
  status: "available",
  responseMs: 120,
  url: "https://catalogo.example/salud",
};
```

Quatre décisions de conception qui valent plus que la syntaxe :

- Les noms des propriétés sont **en anglais** (`name`, `status`, `responseMs`) et les valeurs qui s'affichent pour le lecteur, en espagnol. C'est une convention du cours : ce qui est du code (noms de fichier, de propriété, de fonction) reste identique dans toutes les éditions et coïncide avec la documentation technique, qui est en anglais ; ce que lit la personne se traduit.
- `status` est un texte avec **deux valeurs possibles**, `"available"` et `"down"`. Ce n'est pas un booléen `isUp`, et c'est voulu : un texte admet plus de valeurs qu'un oui/non sans changer la forme de la donnée, et demain il pourra y avoir un troisième état, comme « lent ».
- `responseMs` porte **l'unité dans son nom**. Un nombre seul (« 120 ») ne dit pas s'il s'agit de secondes ou de millisecondes ; `responseMs`, si. C'est une habitude qui évite des erreurs : l'unité est dans le nom, pas dans la mémoire de celui qui lit.
- `id` est distinct de `name` : le nom est ce qui s'affiche et peut changer (« Catálogo » devient « Catálogo de productos ») ; l'`id` est ce qui identifie le service et ne change pas.

On lit une propriété avec un point (`service.name`) ou avec des crochets et des guillemets (`service["status"]`). Les crochets servent quand le nom de la propriété est dans une variable. [On modifie une propriété comme une variable](https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Working_with_objects) : `service.responseMs = 135;`. Et voici ce que je disais plus haut : `service` a été déclaré avec `const`, et pourtant on peut modifier `service.responseMs`. `const` protège le fait que le nom `service` continue de pointer vers le même objet ; il ne fige pas le contenu de l'objet.

Si tu demandes une propriété qui n'existe pas, il n'y a pas d'erreur : on obtient `undefined`. Et si tu demandes une propriété *de* quelque chose qui est `undefined` ou `null`, là il y a une erreur, et c'est la plus fréquente de toutes (tu la verras dans « L'erreur que tu vas voir »). Pour ces situations, il existe deux opérateurs. Le **chaînage optionnel** `?.` dit « si ce qui est à gauche est `null` ou `undefined`, ne va pas plus loin et renvoie `undefined` » ; selon [MDN](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/Optional_chaining), il est disponible dans tous les navigateurs depuis juillet 2020. [L'**opérateur de coalescence des nuls**](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing) `??` dit « si ce qui est à gauche est `null` ou `undefined`, utilise cette autre valeur » ; il est disponible dans tous les navigateurs depuis 2020 (l'[explorateur de fonctionnalités de la plateforme](https://web-platform-dx.github.io/web-features-explorer/features/nullish-coalescing/) le déclare « largement disponible » depuis mars 2023, l'étiquette qu'on attribue 30 mois après que le dernier navigateur l'a). Ensemble, cela se lit ainsi : `service.owner?.team ?? "sin responsable"`.

Ouvre `fig06_02.html` et tu verras tout cela réuni :

```html
<!-- fig06_02.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Un servicio como objeto</title>
</head>
<body>
  <main>
    <h1>Un servicio como objeto</h1>
    <p>Abre la consola de las herramientas del navegador (F12) para ver el resultado.</p>
  </main>
  <script type="module">
    const service = {
      id: "catalog",
      name: "Catálogo",
      status: "available",
      responseMs: 120,
      url: "https://catalogo.example/salud",
    };

    console.log(service.name);
    console.log(service["status"]);

    service.responseMs = 135;
    console.log(service.responseMs);

    console.log(service.owner);
    console.log(service.owner?.team);
    console.log(service.owner?.team ?? "sin responsable");

    const { name, responseMs } = service;
    console.log(name, responseMs);

    const copy = { ...service, status: "down", responseMs: null };
    console.log(service.status, copy.status);

    const text = JSON.stringify(service);
    console.log(text);
    console.log(JSON.parse(text).name);
  </script>
</body>
</html>
```

La console affiche :

```text
Catálogo
available
135
undefined
undefined
sin responsable
Catálogo 135
available down
{"id":"catalog","name":"Catálogo","status":"available","responseMs":135,"url":"https://catalogo.example/salud"}
Catálogo
```

Trois autres choses apparaissent dans cette page. L'**affectation par décomposition**, `const { name, responseMs } = service;`, extrait d'un objet plusieurs propriétés à la fois dans des variables du même nom ([MDN](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)). La **décomposition** (*spread*), `{ ...service, status: "down" }`, copie les propriétés d'un objet dans un nouveau et permet d'en changer quelques-unes, et c'est une copie superficielle : elle copie un niveau, pas les objets que pourraient contenir les objets ([MDN](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/Spread_syntax)). Après `copy`, `service.status` reste `"available"` : l'original n'a pas été modifié. Et **JSON**.

#### 6.2.2 JSON : l'objet devenu texte

`JSON.stringify(service)` convertit l'objet en texte, et `JSON.parse(texto)` fait le chemin inverse. Ce texte est du JSON (*JavaScript Object Notation*) : un format pour écrire des données que **n'importe quel langage peut lire**, pas seulement JavaScript. C'est le format dans lequel le tableau de bord recevra ses données dans la Leçon 8, et la norme qui le définit est courte, la [ECMA-404](https://ecma-international.org/publications-and-standards/standards/ecma-404/) (la [RFC 8259](https://www.rfc-editor.org/rfc/rfc8259) de l'IETF en est l'équivalent pour internet).

Il ressemble à un objet JavaScript, mais il est plus strict, et les différences sont celles qui produisent les erreurs de débutant, selon le [tableau de MDN](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/JSON) : les noms des propriétés vont **toujours** entre guillemets doubles, les chaînes aussi vont entre guillemets doubles (jamais simples), **les commentaires ne sont pas admis**, **la virgule finale n'est pas admise** après le dernier élément, et `undefined` n'existe pas. Un fichier JSON avec une virgule en trop ne se lit pas, et le message d'erreur que donne `JSON.parse` varie selon le navigateur. Aujourd'hui, on ne travaille pas avec des fichiers JSON ; il suffit que, quand ils apparaîtront, tu reconnaisses que c'est une autre façon d'écrire ce que tu sais déjà écrire en JavaScript.

#### 6.2.3 Le tableau : la liste des services

Un **tableau** (*array*) est une liste ordonnée de valeurs entre crochets. Les éléments sont numérotés à partir de **zéro** : le premier est `services[0]`, le deuxième `services[1]`, et leur nombre se trouve dans `services.length`. Cette numérotation à partir de zéro est la cause de l'erreur la plus courante avec les tableaux : un tableau de cinq éléments a des positions de 0 à 4, et demander la 5 donne `undefined`. Pour demander le dernier élément sans compter, il existe `.at(-1)` : les nombres négatifs comptent depuis la fin, et [`at()`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/at) est disponible dans tous les navigateurs depuis mars 2022.

La liste des services du tableau de bord est un tableau d'objets, un par ligne du tableau HTML :

```js
const services = [
  { id: "catalog", name: "Catálogo", status: "available", responseMs: 120 },
  { id: "payments", name: "Pagos", status: "available", responseMs: 480 },
  { id: "inventory", name: "Inventario", status: "down", responseMs: null },
  { id: "notifications", name: "Notificaciones", status: "available", responseMs: 310 },
  { id: "search", name: "Búsqueda", status: "available", responseMs: 950 },
];
```

Remarque le service en panne : son `responseMs` est **`null`**, ni `0` ni un texte comme `"sin respuesta"`. C'est la décision de modèle la plus importante de la leçon. Un service en panne **n'a pas répondu**, et « n'a pas répondu » n'est pas la même chose que « a répondu en zéro milliseconde » : utiliser `0` ferait que la moyenne le récompenserait d'être en panne. `null` dit avec précision « ici, il n'y a pas de donnée ». Le texte « sin respuesta » (sans réponse) que tu vois dans le tableau relève de la présentation ; la donnée garde un `null`.

Maintenant, ce que l'on fait avec un tableau est presque toujours la même chose : **poser des questions à tous ses éléments à la fois**. Pour cela, il y a des méthodes, et chacune reçoit une fonction qui dit quoi faire avec chaque élément. Avant de les voir, cette fonction.

#### 6.2.4 Fonctions : des instructions nommées

Une **fonction** est un morceau de programme nommé qui reçoit des données en entrée (des **paramètres**), fait quelque chose et renvoie un résultat avec `return`. On la déclare ainsi :

```js
function countByStatus(list, status) {
  return list.filter((service) => service.status === status).length;
}
```

`countByStatus` reçoit une liste et un état, et renvoie combien de services de la liste ont cet état. On l'utilise en écrivant son nom avec les données entre parenthèses : `countByStatus(services, "available")` renvoie `4`. Deux propriétés font une bonne fonction, et elles s'appliquent à toutes celles du tableau de bord. La première : qu'elle soit **pure**, c'est-à-dire qu'elle ne dépende de rien d'extérieur et ne modifie rien d'extérieur : tout ce qu'elle utilise entre par ses paramètres, et tout ce qu'elle produit sort par son `return`. Si tu l'appelles deux fois avec les mêmes données, elle donne la même chose les deux fois. La seconde : qu'elle ait **un seul travail** et que son nom le dise : `countByStatus` compte ; `averageResponseMs` fait la moyenne. Une telle fonction peut se tester seule et se réutiliser ; la Leçon 7 les appellera depuis plusieurs endroits.

À l'intérieur de `countByStatus` apparaît une **fonction fléchée** : `(service) => service.status === status`. C'est une fonction sans nom, écrite en abrégé : à gauche de la flèche, les paramètres ; à droite, ce qu'elle renvoie ([MDN](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Functions/Arrow_functions)). Elle équivaut à `function (service) { return service.status === status; }`. On l'emploie surtout pour la passer aux méthodes des tableaux, ce qui vient ensuite.

#### 6.2.5 Les méthodes de tableau

Ouvre `fig06_03.html` :

```html
<!-- fig06_03.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Una lista de servicios</title>
</head>
<body>
  <main>
    <h1>Una lista de servicios</h1>
    <p>Abre la consola de las herramientas del navegador (F12) para ver el resultado.</p>
  </main>
  <script type="module">
    const services = [
      { id: "catalog", name: "Catálogo", status: "available", responseMs: 120 },
      { id: "payments", name: "Pagos", status: "available", responseMs: 480 },
      { id: "inventory", name: "Inventario", status: "down", responseMs: null },
      { id: "notifications", name: "Notificaciones", status: "available", responseMs: 310 },
      { id: "search", name: "Búsqueda", status: "available", responseMs: 950 },
    ];

    console.log(services.length, services[0].name, services.at(-1).name);

    const available = services.filter((service) => service.status === "available");
    console.log(available.length);

    const names = services.map((service) => service.name);
    console.log(names.join(", "));

    const payments = services.find((service) => service.id === "payments");
    console.log(payments.responseMs);

    console.log(services.some((service) => service.status === "down"));
    console.log(services.every((service) => service.status === "down"));

    const slowestFirst = available.toSorted((a, b) => b.responseMs - a.responseMs);
    console.log(slowestFirst.map((service) => service.name).join(" > "));
    console.log(available[0].name);
  </script>
</body>
</html>
```

La console affiche :

```text
5 Catálogo Búsqueda
4
Catálogo, Pagos, Inventario, Notificaciones, Búsqueda
480
true
false
Búsqueda > Pagos > Notificaciones > Catálogo
Catálogo
```

Chaque méthode reçoit une fonction fléchée et l'appelle avec les éléments, dans l'ordre. `filter` et `map` l'appellent avec **tous**. `find`, `some` et `every`, en revanche, s'arrêtent dès qu'elles peuvent donner la réponse ([MDN le décrit](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array#iterative_methods)) : `find` et `some` au premier élément qui satisfait la condition, `every` au premier qui ne la satisfait pas. Avec la liste du tableau de bord, `some` examine Catálogo, Pagos et Inventario, trouve le service en panne et ne regarde plus Notificaciones ni Búsqueda ; `every` s'arrête à Catálogo, qui n'est pas en panne. Je l'ai mesuré en comptant les appels : 3 et 1.

- [`filter`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) renvoie un **nouveau tableau** avec seulement les éléments pour lesquels la fonction renvoie `true`. C'est la « requête » du tableau de bord : les services disponibles sont `services.filter((service) => service.status === "available")`, et ils sont 4.
- [`map`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/map) renvoie un nouveau tableau de la même taille, où chaque élément est ce que la fonction a renvoyé pour l'original. Ici, elle extrait les noms ; dans la Leçon 7, elle extraira les lignes du tableau HTML.
- [`find`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/find) renvoie **le premier** élément qui satisfait la condition, ou `undefined` si aucun ne la satisfait. Ici, elle cherche le service dont l'`id` vaut `"payments"` et retient son `responseMs` (480).
- [`some`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/some) demande « **l'un** d'eux satisfait-il la condition ? » et [`every`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/every) demande « **tous** la satisfont-ils ? ». Les deux renvoient `true` ou `false`. Y a-t-il un service en panne ? Oui (`some` donne `true`). Sont-ils tous en panne ? Non (`every` donne `false`).
- [`toSorted`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted) trie **sans toucher à l'original** et renvoie une copie triée. Selon MDN, elle est disponible dans tous les navigateurs depuis juillet 2023, et l'[explorateur de fonctionnalités](https://web-platform-dx.github.io/web-features-explorer/features/array-by-copy/) la déclare « largement disponible » depuis le 4 janvier 2026. La dernière ligne le démontre : après avoir trié `available` du plus grand au plus petit, `available[0].name` reste « Catálogo » ; l'original n'a pas changé.

La fonction de tri demande une explication, parce que c'est celle qui fait le plus trébucher. `toSorted` et sa grande sœur `sort` reçoivent une **fonction de comparaison** avec deux éléments, `a` et `b`, qui renvoie un nombre : négatif si `a` passe avant, positif s'il passe après, zéro s'ils sont à égalité. `b.responseMs - a.responseMs` renvoie un positif quand `b` est plus grand, donc `a` passe après : ordre décroissant. Et le piège : si tu ne passes pas de fonction de comparaison, `sort` convertit tout en texte et trie comme du texte, de sorte que `[10, 9, 1].sort()` donne `[1, 10, 9]` (je l'ai mesuré) et non `[1, 9, 10]`, parce que « 10 » passe avant « 9 » dans l'ordre alphabétique. De plus, [`sort`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) **modifie le tableau d'origine** ; c'est pourquoi la règle du cours est d'utiliser `toSorted`, qui ne le modifie jamais.

#### 6.2.6 Décider, répéter et signaler une erreur

Jusqu'ici, chaque programme s'exécutait de haut en bas sans rien sauter : toutes les lignes, une fois chacune. Les calculs du tableau de bord ont besoin de trois choses de plus. **Décider** : « si le service n'a pas répondu, ne l'additionne pas ». **Répéter** : « fais ceci avec chaque service de la liste ». Et **signaler une erreur** : « cette donnée n'a pas de sens ; arrête-toi et dis-le ». En outre, il y a deux éléments de syntaxe que tu vas voir à partir d'ici : le mot `new` et les trois points `...`. D'abord l'idée de chacun, puis le code, et à la fin deux pages qui les exécutent tous.

**Décider avec `if` et `else`.** Une [instruction `if`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/if...else) reçoit une **condition** entre parenthèses : presque toujours, une expression qui donne `true` ou `false`, comme `service.status === "available"`. À proprement parler, `if` accepte n'importe quelle valeur et la convertit : `false`, `0`, `""` (le texte vide), `null`, `undefined` et `NaN` comptent comme faux (on les appelle des valeurs [*falsy*](https://developer.mozilla.org/fr/docs/Glossary/Falsy) ; la liste complète comporte encore quelques curiosités), et tout le reste compte comme vrai (*truthy*). C'est pourquoi `if ("sí")` entre dans le bloc et `if (0)` n'y entre pas. Dans ce cours, on écrit des conditions qui donnent déjà `true` ou `false`, pour qu'elles se lisent sans avoir à penser aux conversions. Si la condition est vraie, on exécute le bloc d'accolades qui suit ; si elle est fausse, on le saute. Avec `else`, on écrit l'autre chemin : ce que l'on fait quand la condition était fausse. Et quand il y a plus de deux chemins, on les enchaîne avec `else if` : le programme examine les conditions dans l'ordre et prend **le premier** chemin dont la condition est remplie ; les autres ne sont plus examinés. Dans la vie quotidienne, tu le fais sans y penser : « s'il pleut, je prends un parapluie ; sinon, s'il fait soleil, je prends une casquette ; sinon, je ne prends rien ». Un détail de forme : quand le bloc n'a qu'une seule instruction, on peut omettre les accolades et tout écrire sur une ligne (`if (button === null) return;`). Dans ce cours, on ne les omet que dans ces lignes courtes.

**Inverser une condition avec `!`.** L'[opérateur `!`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/Logical_NOT) se lit « non » : `!true` vaut `false` et `!false` vaut `true`. Il sert à écrire la condition à l'envers sans la changer : `if (!allUp)` se lit « si tous ne sont pas en marche ».

**Décider d'une valeur avec l'opérateur ternaire.** Souvent, la décision n'est pas « que fais-je » mais « quelle valeur j'utilise ». Pour cela, il y a l'[opérateur conditionnel](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/Conditional_operator), qu'on appelle **ternaire** parce qu'il a trois parties : `condición ? valorSiSí : valorSiNo`. L'expression entière *vaut* l'une des deux, de sorte qu'on peut la stocker dans une variable ou l'insérer dans un littéral de gabarit. `` responseMs === null ? "sin respuesta" : `${responseMs} ms` `` dit : « s'il n'y a pas de donnée, le texte est "sin respuesta" ; s'il y en a une, c'est le nombre avec son unité ». Utilise-le quand chaque chemin est une valeur courte ; si chaque chemin comporte plusieurs instructions, un `if` se lit mieux.

**Répéter avec `for…of`.** Les méthodes de la section précédente (`filter`, `map`…) parcourent un tableau de l'intérieur. Parfois il vaut mieux le parcourir toi-même, pas à pas, et pour cela il y a la boucle [`for…of`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/for...of) : `for (const service of services) { … }` exécute le bloc **une fois pour chaque élément**, dans l'ordre, et à chaque tour `service` est l'élément de ce tour. On la déclare avec `const` parce que, dans un tour, elle ne change pas ; au tour suivant, c'est une autre variable avec l'élément suivant. À l'intérieur de la boucle, l'instruction [`continue`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/continue) dit « ce tour s'arrête ici ; passe à l'élément suivant ». Et un opérateur abrégé apparaît : `total += service.responseMs` revient à `total = total + service.responseMs` (c'est pourquoi `total` est déclaré avec `let` : il change à chaque tour).

Ouvre `fig06_04.html`, et avant de regarder la console, **prédis** quelle ligne la boucle affiche pour Inventario et quel est le total final :

```html
<!-- fig06_04.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Decidir y repetir</title>
</head>
<body>
  <main>
    <h1>Decidir y repetir</h1>
    <p>Abre la consola de las herramientas del navegador (F12) para ver el resultado.</p>
  </main>
  <script type="module">
    const services = [
      { id: "catalog", name: "Catálogo", status: "available", responseMs: 120 },
      { id: "payments", name: "Pagos", status: "available", responseMs: 480 },
      { id: "inventory", name: "Inventario", status: "down", responseMs: null },
      { id: "notifications", name: "Notificaciones", status: "available", responseMs: 310 },
      { id: "search", name: "Búsqueda", status: "available", responseMs: 950 },
    ];

    // if / else: una decisión con dos caminos.
    const first = services[0];
    if (first.status === "available") {
      console.log(`${first.name} está disponible.`);
    } else {
      console.log(`${first.name} está caído.`);
    }

    // else if: más de dos caminos; se toma el primero cuya condición se cumpla.
    const payments = services[1];
    if (payments.responseMs === null) {
      console.log(`${payments.name} no respondió.`);
    } else if (payments.responseMs > 500) {
      console.log(`${payments.name} respondió lento.`);
    } else {
      console.log(`${payments.name} respondió a tiempo.`);
    }

    // ! invierte un booleano.
    const allUp = services.every((service) => service.status === "available");
    console.log(allUp, !allUp);

    // El operador ternario: una decisión que produce un valor.
    const inventory = services[2];
    const time = inventory.responseMs === null ? "sin respuesta" : `${inventory.responseMs} ms`;
    console.log(`${inventory.name}: ${time}`);

    // for...of: las mismas instrucciones para cada elemento, uno tras otro.
    let total = 0;
    for (const service of services) {
      if (service.responseMs === null) {
        console.log(`${service.name}: sin respuesta, no se suma`);
        continue;
      }
      total += service.responseMs;
      console.log(`${service.name}: ${service.responseMs} ms, van ${total}`);
    }
    console.log(`Total: ${total} ms`);
  </script>
</body>
</html>
```

La console affiche :

```text
Catálogo está disponible.
Pagos respondió a tiempo.
false true
Inventario: sin respuesta
Catálogo: 120 ms, van 120
Pagos: 480 ms, van 600
Inventario: sin respuesta, no se suma
Notificaciones: 310 ms, van 910
Búsqueda: 950 ms, van 1860
Total: 1860 ms
```

Suis la boucle tour par tour, comme si tu étais le moteur : `total` commence à 0 ; au tour de Catálogo il passe à 120, à celui de Pagos à 600 ; à celui d'Inventario, la condition `service.responseMs === null` est vraie, l'avertissement s'affiche et `continue` saute le reste de ce tour, donc `total` reste à 600 ; puis 910 et 1,860. Pagos a pris le dernier chemin de son `if…else if…else` parce que 480 n'est pas `null` et n'est pas supérieur à 500. Et `allUp` vaut `false` parce qu'Inventario est en panne, de sorte que `!allUp` vaut `true`. Remarque que la boucle fait à la main la même chose que fera `reduce` dans la section suivante, et avec le même soin : celui qui n'a pas répondu ne s'additionne pas.

**Signaler une erreur avec `throw`, et l'attraper avec `try…catch`.** Il y a des situations où une fonction ne peut pas faire son travail : il lui est arrivé un temps de réponse qui n'est pas un nombre, ou un fichier qui n'existe pas. Renvoyer une valeur quelconque cacherait le problème. La bonne façon est de **lancer** une erreur avec l'instruction [`throw`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/throw) : `throw new Error("mensaje")`. À cet instant, la fonction s'arrête et l'erreur « remonte » vers celui qui l'a appelée, et vers celui qui a appelé celui-là, et ainsi de suite jusqu'à ce que quelqu'un l'attrape. Si personne ne l'attrape, le programme s'arrête et la console l'affiche en rouge : c'est ainsi que se présentent les erreurs de la section « L'erreur que tu vas voir ».

L'attraper, c'est dire à l'avance « essaie ceci, et si ça échoue, fais cela à la place ». C'est [`try…catch`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/try...catch) : dans `try { … }` va ce qui peut échouer ; si une instruction lance une erreur, celles qui suivent dans le `try` **ne s'exécutent plus** et le programme saute au bloc `catch (error) { … }`, où `error` est ce qui a été lancé. Après le `catch`, le programme continue normalement. Une erreur JavaScript est un objet avec deux propriétés que tu liras beaucoup : `error.name`, le type d'erreur (`Error`, `TypeError`…), et `error.message`, le texte qui l'explique.

**Créer un objet avec `new`.** Dans le `throw`, le mot `new` est apparu. Certains objets ne s'écrivent pas avec des accolades mais se **fabriquent** avec un *constructeur*, une fonction spéciale qui assemble un objet d'un certain type et le laisse prêt à l'emploi. L'[opérateur `new`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/new) est la façon de le demander : `new Error("Sin conexión")` fabrique un objet d'erreur avec ce message, et `new Intl.NumberFormat("es-MX")` fabrique un formateur de nombres pour l'espagnol du Mexique, que tu verras dans la section suivante. Par convention, les noms des constructeurs commencent par une majuscule (`Error`, `Intl.NumberFormat`, et plus tard `AbortController` ou `FormData`). Dans ce cours, tu n'écriras pas de constructeurs à toi ; tu n'utiliseras que ceux qu'apporte le navigateur.

**Les trois points : la décomposition.** Tu l'as déjà vue en 6.2.1 avec des objets : `{ ...service, status: "down" }` copie les propriétés de `service` dans un nouvel objet et permet d'en changer quelques-unes. La [syntaxe de décomposition](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/Spread_syntax) (*spread*) fait la même chose à deux autres endroits. **Dans un tableau**, `[...times, 210]` crée un nouveau tableau avec les éléments de `times` et un de plus à la fin ; `times` ne change pas. **Dans un appel de fonction**, `Math.max(...times)` « étale » les éléments du tableau comme si tu les avais écrits un par un, séparés par des virgules : `Math.max(120, 480, 310, 950)`. C'est utile avec les fonctions qui reçoivent un nombre quelconque d'arguments, comme `Math.max` ou, dans la Leçon 7, `replaceChildren`.

Ouvre `fig06_05.html`. **Prédis** d'abord : « Esta línea no se ejecuta. » s'affiche-t-elle ? Quelle taille a `times` après la création de `withMail` ?

```html
<!-- fig06_05.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Avisar de un error, new y propagación</title>
</head>
<body>
  <main>
    <h1>Avisar de un error, new y propagación</h1>
    <p>Abre la consola de las herramientas del navegador (F12) para ver el resultado.</p>
  </main>
  <script type="module">
    // throw: avisar de que algo no tiene sentido y detener lo que se estaba haciendo.
    function checkResponseMs(value) {
      if (typeof value !== "number") {
        throw new Error(`Se esperaba un número y llegó: ${value}`);
      }
      return value;
    }

    // try / catch: intentar algo y, si falla, seguir por otro camino.
    try {
      console.log(checkResponseMs(120));
      console.log(checkResponseMs("rápido"));
      console.log("Esta línea no se ejecuta.");
    } catch (error) {
      console.log(`Se atrapó un ${error.name}: ${error.message}`);
    }
    console.log("El programa sigue.");

    // new: crear un objeto nuevo a partir de un constructor.
    const failure = new Error("Sin conexión");
    console.log(failure.message);
    const format = new Intl.NumberFormat("es-MX");
    console.log(format.format(1860));

    // ...: la propagación, en una llamada, en un arreglo y en un objeto.
    const times = [120, 480, 310, 950];
    console.log(Math.max(...times));
    const withMail = [...times, 210];
    console.log(withMail.length, times.length);
    const mail = { id: "mail", name: "Correo", status: "available", responseMs: 210 };
    const mailDown = { ...mail, status: "down", responseMs: null };
    console.log(mail.status, mailDown.status, mailDown.name);
  </script>
</body>
</html>
```

La console affiche :

```text
120
Se atrapó un Error: Se esperaba un número y llegó: rápido
El programa sigue.
Sin conexión
1,860
950
5 4
available down Correo
```

Le premier appel à `checkResponseMs` reçoit un nombre et le renvoie : 120 s'affiche. Le second reçoit le texte `"rápido"` ; `typeof` dit `"string"`, la condition du `if` est remplie et l'erreur est lancée. La ligne suivante du `try` ne s'exécute jamais, le `catch` reçoit l'erreur et affiche son nom et son message, et le programme continue. Ensuite, `new` fabrique une erreur qui n'est pas lancée (une erreur est un objet comme un autre : la lancer est une décision à part) et un formateur qui écrit 1,860 avec la virgule des milliers en usage au Mexique. Enfin, la décomposition : `Math.max(...times)` donne 950 ; `withMail` a 5 éléments et `times` en garde 4 ; et `mailDown` est une copie de `mail` avec deux propriétés modifiées et le nom intact, alors que `mail` reste disponible.

Avec cela, tu as toutes les pièces des calculs du tableau de bord. Si tu veux voir les mêmes idées avec d'autres exemples, le guide de MDN consacre un chapitre au [contrôle de flux et à la gestion des erreurs](https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Control_flow_and_error_handling) et un autre aux [boucles](https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Loops_and_iteration).

#### 6.2.7 Les calculs du tableau de bord

Avec tout ce qui précède, on écrit les calculs. Le premier, tu l'as déjà : `countByStatus`. Le second, la moyenne, est celui qui enseigne le plus. Dans `fig06_06.html` :

```html
<!-- fig06_06.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Cuentas con funciones</title>
</head>
<body>
  <main>
    <h1>Cuentas con funciones</h1>
    <p>Abre la consola de las herramientas del navegador (F12) para ver el resultado.</p>
  </main>
  <script type="module">
    const services = [
      { id: "catalog", name: "Catálogo", status: "available", responseMs: 120 },
      { id: "payments", name: "Pagos", status: "available", responseMs: 480 },
      { id: "inventory", name: "Inventario", status: "down", responseMs: null },
      { id: "notifications", name: "Notificaciones", status: "available", responseMs: 310 },
      { id: "search", name: "Búsqueda", status: "available", responseMs: 950 },
    ];

    function countByStatus(list, status) {
      return list.filter((service) => service.status === status).length;
    }

    function averageResponseMs(list) {
      const answered = list.filter((service) => Number.isFinite(service.responseMs));
      if (answered.length === 0) {
        return null;
      }
      const total = answered.reduce((sum, service) => sum + service.responseMs, 0);
      return total / answered.length;
    }

    console.log(countByStatus(services, "available"));
    console.log(countByStatus(services, "down"));
    console.log(averageResponseMs(services));
    console.log(averageResponseMs([]));

    const withoutSearch = services.filter((service) => service.id !== "search");
    const average = averageResponseMs(withoutSearch);
    console.log(average);
    console.log(Math.round(average));
    console.log(average.toFixed(1), typeof average.toFixed(1));
    console.log(new Intl.NumberFormat("es-MX", { maximumFractionDigits: 1 }).format(average));
  </script>
</body>
</html>
```

La console affiche :

```text
4
1
465
null
303.3333333333333
303
303.3 string
303.3
```

`averageResponseMs` fait trois choses, et chacune est une décision :

1. **Elle ne garde que les services qui ont un temps mesuré** (`filter`). Le test est [`Number.isFinite(service.responseMs)`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite), qui ne répond `true` que lorsque la valeur est vraiment un nombre : ni `null`, ni un texte comme `"120"`, ni `NaN`. Un service en panne apporte `null` et reste dehors. Remarque que la question est « ai-je un nombre à moyenner ? » et non « dans quel état est-il ? » : si demain apparaissait un nouvel état, disons « lent », avec son temps mesuré, il entrerait dans la moyenne sans qu'on change la fonction.
2. **S'il n'en reste aucun, elle renvoie `null`** et non un nombre. Faire la moyenne de rien, ce n'est pas zéro : c'est ne pas avoir de donnée, et là encore `null` le dit avec précision. Sans cette garde, diviser par zéro donnerait `NaN`.
3. **Elle additionne avec `reduce` et divise par le nombre d'éléments.**

[`reduce`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) est la méthode la plus difficile à lire et celle qu'il vaut le plus la peine de comprendre. Elle parcourt le tableau avec un **accumulateur** : une variable qui garde le résultat à ce stade. Elle reçoit deux choses : une fonction à deux paramètres (l'accumulateur et l'élément courant) qui renvoie la nouvelle valeur de l'accumulateur, et la **valeur initiale** de l'accumulateur. Dans `answered.reduce((sum, service) => sum + service.responseMs, 0)`, l'accumulateur `sum` commence à `0`, et pour chaque service on lui ajoute son `responseMs` : 0 + 120 = 120, 120 + 480 = 600, 600 + 310 = 910, 910 + 950 = 1,860. Le résultat, 1,860, est divisé par 4 et donne 465, le chiffre que tu avais écrit à la main dans la Leçon 2.

Les dernières lignes de la page montrent comment on présente un nombre à décimales. Avec `withoutSearch` (les services sans celui de recherche), la moyenne est 303.3333333333333 ; ce nombre, tel quel, on ne le montre à personne. Il y a trois façons de l'arrondir et chacune renvoie quelque chose de différent : [`Math.round`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Math/round) renvoie un **nombre** entier (303) ; [`toFixed(1)`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed) renvoie un **texte** avec une décimale (« 303.3 », et la console le confirme avec `typeof`, qui dit `string`), de sorte qu'on ne peut pas continuer à additionner avec lui sans le convertir ; et [`Intl.NumberFormat`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat), qui formate selon la langue et le pays, disponible dans tous les navigateurs depuis 2017. Avec `"es-MX"`, il utilise le point décimal en usage au Mexique. La règle : **on calcule avec les nombres complets et on n'arrondit qu'à la fin, pour l'afficher**.

#### 6.2.8 La moyenne qui tourne mal

Il existe une façon d'écrire la moyenne qui paraît correcte et donne un chiffre différent, sans aucune erreur dans la console. Elle se trouve dans `fig06_07.html` :

```html
<!-- fig06_07.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>El promedio que sale mal</title>
</head>
<body>
  <main>
    <h1>El promedio que sale mal</h1>
    <p>Abre la consola de las herramientas del navegador (F12) para ver el resultado.</p>
  </main>
  <script type="module">
    const services = [
      { id: "catalog", name: "Catálogo", status: "available", responseMs: 120 },
      { id: "payments", name: "Pagos", status: "available", responseMs: 480 },
      { id: "inventory", name: "Inventario", status: "down", responseMs: null },
      { id: "notifications", name: "Notificaciones", status: "available", responseMs: 310 },
      { id: "search", name: "Búsqueda", status: "available", responseMs: 950 },
    ];

    const total = services.reduce((sum, service) => sum + service.responseMs, 0);
    console.log(total, total / services.length);

    console.log(null + 1, undefined + 1, "5" + 1, "5" - 1);

    const first = [].reduce((sum, service) => sum + service.responseMs, 0);
    console.log(first);

    try {
      [].reduce((sum, service) => sum + service.responseMs);
    } catch (error) {
      console.log(error.name + ": " + error.message);
    }
  </script>
</body>
</html>
```

La console affiche :

```text
1860 372
1 NaN 51 4
0
TypeError: Reduce of empty array with no initial value
```

La première ligne additionne les temps de **tous** les services, y compris celui qui est en panne, et divise par **cinq**. Elle donne 372 au lieu de 465. Pourquoi n'a-t-elle pas échoué en additionnant un `null` ? Parce que JavaScript, quand il rencontre `120 + null`, **convertit le `null` en zéro** sans prévenir. L'addition donne toujours 1,860 (le service en panne a apporté zéro), mais la division se fait par 5 et non par 4. Le résultat est un nombre vraisemblable, 372, qui ressemble à un temps de réponse et que personne ne soupçonne, et le tableau de bord afficherait le mauvais chiffre en toute assurance. **Voilà l'erreur silencieuse typique des données : il n'y a pas de message, il y a un nombre qui n'est pas le bon.** La deuxième ligne montre la famille de conversions d'où cela vient : `null + 1` vaut `1`, `undefined + 1` vaut `NaN`, `"5" + 1` vaut `"51"` (le `+` avec un texte concatène) et `"5" - 1` vaut `4` (le `-`, lui, convertit). On peut apprendre chaque règle, mais il est moins coûteux de suivre celle-ci : **avant de calculer, vérifie que la donnée existe**, ce que fait `filter` dans la fonction ci-dessus.

Les deux dernières lignes montrent une limite de `reduce`. Avec un tableau vide et une valeur initiale (`0`), il renvoie la valeur initiale. Sans valeur initiale, il tente d'utiliser le premier élément comme accumulateur, il n'y a pas de premier élément et il lance un `TypeError` (le `try…catch` de 6.2.6 l'attrape), dont j'ai copié le texte depuis la console de Chrome : « Reduce of empty array with no initial value ». Un autre navigateur peut le formuler autrement. La règle : **`reduce` prend toujours une valeur initiale**.

### 6.3 Modules : répartir le programme en fichiers

#### 6.3.1 Pourquoi découper

Jusqu'à présent, tout le programme vivait dans une page. Cela suffit pour une expérience et devient ingérable dès que le tableau de bord a des données, des calculs et (à partir de la Leçon 7) du dessin. Il existe une façon simple de mettre de l'ordre dans ce que tu écris : **chaque fichier fait une chose**. Un fichier garde les données, un autre les calculs, un autre relie le tout. Qui ouvre le projet sait où chercher, et le fichier des calculs peut être réutilisé avec d'autres données.

Pour qu'un fichier puisse utiliser ce qui est dans un autre, il faut un mécanisme, et ce mécanisme est le **module**. Un fichier JavaScript est un module quand il est chargé comme tel ; ce qu'il déclare à l'intérieur est **privé** sauf si tu le marques avec `export`, et un autre fichier le récupère avec `import`. Les trois fichiers du tableau de bord sont :

```js
// fig06_08/services.js
// Los datos del panel. Cada servicio es un objeto; la lista es un arreglo.
// responseMs vale null cuando el servicio no respondió.
export const services = [
  { id: "catalog", name: "Catálogo", status: "available", responseMs: 120 },
  { id: "payments", name: "Pagos", status: "available", responseMs: 480 },
  { id: "inventory", name: "Inventario", status: "down", responseMs: null },
  { id: "notifications", name: "Notificaciones", status: "available", responseMs: 310 },
  { id: "search", name: "Búsqueda", status: "available", responseMs: 950 },
];
```

```js
// fig06_08/stats.js
// Las cuentas del panel. Son funciones puras: reciben la lista, devuelven un
// valor y no tocan nada de afuera.

export function countByStatus(list, status) {
  return list.filter((service) => service.status === status).length;
}

export function averageResponseMs(list) {
  const answered = list.filter((service) => Number.isFinite(service.responseMs));
  if (answered.length === 0) {
    return null;
  }
  const total = answered.reduce((sum, service) => sum + service.responseMs, 0);
  return total / answered.length;
}

export function summarize(list) {
  const average = averageResponseMs(list);
  return {
    available: countByStatus(list, "available"),
    down: countByStatus(list, "down"),
    averageMs: average === null ? null : Math.round(average),
  };
}
```

```js
// fig06_08/main.js
import { services } from "./services.js";
import { summarize } from "./stats.js";

const summary = summarize(services);

console.log(`Disponibles: ${summary.available}`);
console.log(`Caídos: ${summary.down}`);
console.log(
  summary.averageMs === null
    ? "Respuesta promedio: sin datos"
    : `Respuesta promedio: ${summary.averageMs} ms`,
);
console.log(JSON.stringify(summary));
```

`services.js` exporte le tableau `services`. `stats.js` exporte trois fonctions : les deux calculs et une troisième, `summarize`, qui les réunit dans un objet avec les trois chiffres du récapitulatif. `main.js` importe ce dont il a besoin dans chacun, calcule, et envoie le résultat à la console. Selon la [documentation de MDN sur les modules](https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Modules), une déclaration `import { services } from "./services.js";` récupère par son nom ce que l'autre fichier a exporté avec [`export`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/export) (les noms entre accolades doivent coïncider exactement), et le chemin commence par `./` pour dire « dans le même dossier que ce fichier ».

Voilà la forme qu'auront les données du tableau de bord dans les leçons suivantes. Remarque `summarize` : elle renvoie un **objet** avec `available`, `down` et `averageMs`. C'est exactement le récapitulatif de la Leçon 2, et dans la Leçon 7 il sera dessiné à l'écran.

#### 6.3.2 Comment un module se charge

La page qui l'exécute est `fig06_08.html` :

```html
<!-- fig06_08.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Los datos del panel y sus cuentas</title>
  <script type="module" src="fig06_08/main.js"></script>
</head>
<body>
  <main>
    <h1>Los datos del panel y sus cuentas</h1>
    <p>Abre la consola de las herramientas del navegador (F12) para ver el resultado.</p>
  </main>
</body>
</html>
```

Tout tient en une ligne : `<script type="module" src="fig06_08/main.js"></script>`. L'attribut `type="module"` dit au navigateur que ce fichier est un module et non un script classique, selon la [norme HTML](https://html.spec.whatwg.org/multipage/scripting.html) et la [référence de l'élément `script`](https://developer.mozilla.org/fr/docs/Web/HTML/Reference/Elements/script). Trois conséquences, que MDN énumère et qui valent la peine d'être apprises d'un coup :

- **Il est différé tout seul.** Un module s'exécute *après* que le navigateur a lu tout le HTML. Pas besoin de `defer` ni de le mettre à la fin du `<body>` : on peut le charger depuis le `<head>`.
- **Il utilise le mode strict.** Un module fonctionne toujours en [mode strict](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Strict_mode), qui transforme en erreurs quelques choses que le langage tolérait auparavant en silence (par exemple, affecter une valeur à une variable que tu n'as jamais déclarée : sans mode strict, cette faute de frappe crée en silence une variable globale ; en mode strict, c'est une `ReferenceError`).
- **Il a sa propre portée.** Ce que déclare un module n'est pas visible de l'extérieur, pas même depuis la console : si `main.js` contient une variable `summary`, écrire `summary` dans la console ne la trouve pas. C'est un avantage : deux fichiers peuvent utiliser le même nom sans se marcher dessus. Et un inconvénient pour qui débogue : pour inspecter quelque chose, on l'affiche avec `console.log`.

Quand on ouvre `fig06_08.html` dans le navigateur, la console affiche :

```text
Disponibles: 4
Caídos: 1
Respuesta promedio: 465 ms
{"available":4,"down":1,"averageMs":465}
```

Les mêmes quatre chiffres que tu avais écrits à la main, maintenant calculés. Et voici maintenant l'étape qui clôt la leçon dans le projet : dans le dossier `revisor`, mets les trois fichiers dans `js/` (`js/services.js`, `js/stats.js`, `js/main.js` ; le chemin des `import` ne change pas parce qu'ils restent dans le même dossier) et ajoute dans le `<head>` de ton `index.html` :

```html
<script type="module" src="js/main.js"></script>
```

Recharge `index.html` : la page a exactement la même apparence, mais dans la console apparaissent les quatre lignes ci-dessus. Compare chacune avec ce que dit le récapitulatif du tableau de bord : 4 disponibles, 1 en panne, 465 ms. Si elles coïncident, le modèle de données reproduit ce que tu avais calculé à la main. Si tu ajoutes un service au tableau et que tu recharges, les chiffres de la console changent, et le récapitulatif écrit dans le HTML non : ce sera le travail de la Leçon 7.

#### 6.3.3 Pourquoi cela ne s'ouvre pas par un double-clic

Si tu ouvres `fig06_08.html` par un double-clic dans le gestionnaire de fichiers, l'adresse commence par `file:///` et la console affiche une erreur rouge. Je l'ai copiée depuis Chrome 154 (un autre navigateur la formule autrement) :

```text
Access to script at 'file:///.../programas/06-javascript-datos/fig06_08/main.js' from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: chrome, chrome-experimental-site-token-provider, chrome-extension, chrome-untrusted, data, http, https, isolated-app.
```

C'est ce qu'avait annoncé la Leçon 1. Les modules sont demandés par le même mécanisme que celui par lequel le navigateur demande des choses à d'autres sites, et ce mécanisme exige un protocole réseau (`http` ou `https`), pas une lecture de disque. Avec `file://`, l'origine de la page est `null` et la requête est bloquée. La solution n'est pas de toucher au navigateur : c'est d'ouvrir la page depuis le serveur local (`python3 -m http.server 8000 --bind 127.0.0.1`, puis `http://localhost:8000/`). C'est la raison pour laquelle le cours installe le serveur dès la première leçon.

## L'erreur que tu vas voir

Cette étape comporte cinq messages que tu vas lire très souvent. On les apprend mieux en les provoquant exprès. Les cinq sont copiés de la console de Chrome 154 avec les pages de [`programas/06-javascript-datos/`](https://github.com/HabilMX/curso-web/tree/main/programas/06-javascript-datos) ; le navigateur que tu utilises peut les formuler autrement, mais ils disent la même chose.

### `Cannot read properties of undefined (reading 'name')`

L'erreur la plus fréquente de JavaScript. Ouvre `fig06_09.html` :

```html
<!-- fig06_09.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Leer algo que no existe</title>
</head>
<body>
  <main>
    <h1>Leer algo que no existe</h1>
    <p>Abre la consola de las herramientas del navegador (F12) para ver el resultado.</p>
  </main>
  <script type="module">
    const services = [
      { id: "catalog", name: "Catálogo", status: "available", responseMs: 120 },
      { id: "payments", name: "Pagos", status: "available", responseMs: 480 },
      { id: "inventory", name: "Inventario", status: "down", responseMs: null },
      { id: "notifications", name: "Notificaciones", status: "available", responseMs: 310 },
      { id: "search", name: "Búsqueda", status: "available", responseMs: 950 },
    ];

    const sixth = services[5];
    console.log(sixth.name);
  </script>
</body>
</html>
```

La console affiche, en rouge :

```text
Cannot read properties of undefined (reading 'name')
```

Lis-le de droite à gauche : le programme a voulu lire la propriété `name` de quelque chose qui est `undefined`. De quoi ? De `services[5]`. Le tableau a cinq éléments, avec des positions de 0 à 4, et demander la 5 donne `undefined` ; et demander une propriété à `undefined` est une erreur ([MDN l'explique plus en détail](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Errors/Cant_access_property)). À droite du message, la console indique le fichier et la ligne où cela s'est produit ; en cliquant dessus, les outils ouvrent cette ligne. Il y a deux solutions : vérifier que tu ne dépasses pas la fin (`services.length`, `.at(-1)`), ou, si l'élément peut ne pas exister, utiliser `?.` : `services[5]?.name` donne `undefined` sans erreur.

### `Assignment to constant variable.`

Dans `fig06_10.html`, `const total = 0; total = total + 120;` :

```html
<!-- fig06_10.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Reasignar una constante</title>
</head>
<body>
  <main>
    <h1>Reasignar una constante</h1>
    <p>Abre la consola de las herramientas del navegador (F12) para ver el resultado.</p>
  </main>
  <script type="module">
    const total = 0;
    total = total + 120;
    console.log(total);
  </script>
</body>
</html>
```

Le message est littéralement celui-ci, et il dit ce que tu as fait : tu as tenté de réaffecter une `const` ([MDN](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Errors/Invalid_const_assignment)). Si la valeur doit changer, la variable devait être `let`.

### `Cannot use import statement outside a module`

Dans `fig06_11.html`, le même `main.js`, mais avec `<script src="...">` sans `type="module"` :

```html
<!-- fig06_11.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Un import sin type="module"</title>
  <script src="fig06_08/main.js"></script>
</head>
<body>
  <main>
    <h1>Un import sin type="module"</h1>
  </main>
</body>
</html>
```

La console affiche :

```text
Cannot use import statement outside a module
```

Un `import` ne se comprend qu'à l'intérieur d'un module ; un script classique ne sait pas ce que c'est. On le corrige en ajoutant `type="module"` au `<script>`.

### `The requested module './fig06_08/services.js' does not provide an export named 'servicios'`

Dans `fig06_12.html`, un module demande un nom que l'autre fichier n'exporte pas :

```html
<!-- fig06_12.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Importar lo que no se exportó</title>
  <script type="module">
    import { servicios } from "./fig06_08/services.js";

    console.log(servicios.length);
  </script>
</head>
<body>
  <main>
    <h1>Importar lo que no se exportó</h1>
  </main>
</body>
</html>
```

La console affiche :

```text
The requested module './fig06_08/services.js' does not provide an export named 'servicios'
```

Il dit clairement quel fichier et quel nom. Le fichier exporte `services` (en anglais) et ici on a demandé `servicios` : un nom mal écrit, et les noms doivent coïncider caractère par caractère. On corrige en écrivant le nom tel qu'il est dans l'`export`.

### `Access to script ... has been blocked by CORS policy`

C'est celui de la section 6.3.3, celui qui apparaît quand tu ouvres par un double-clic au lieu d'utiliser le serveur.

## Ce qui se fait de travers

**Écrire `var`.** Tu as déjà vu pourquoi : il vit dans toute la fonction, il est hissé et il permet de redéclarer, de sorte qu'il cache des erreurs que `let` et `const` montrent. Coût : un nom qui change de valeur depuis un recoin du programme où tu ne l'attendais pas.

**Comparer avec `==`.** `120 == "120"` donne `true` ; dans un tableau de bord qui reçoit des données de l'extérieur, un temps qui arrive sous forme de texte passerait les comparaisons numériques. Avec `===`, la divergence saute aux yeux.

**Stocker un nombre sous forme de texte.** `responseMs: "120"` paraît identique et ne l'est plus : `"120" + 1` donne `"1201"`. Les données qui sont des quantités se stockent comme des nombres, sans guillemets, et l'unité va dans le nom.

**Représenter « n'a pas répondu » par `0`, par `""` ou par `"sin respuesta"`.** Avec `0`, la moyenne récompense le service en panne ; avec un texte, l'addition devient une concaténation ou un `NaN`. Une donnée manquante se stocke comme `null`, et ce sont les fonctions qui décident quoi en faire.

**Faire la moyenne sans filtrer.** C'est le 372 au lieu du 465 de 6.2.8 : un nombre crédible, sans erreur, et faux. Avant de faire la moyenne, il faut ne garder que ce qui a une donnée.

**Utiliser `sort()` là où l'on voulait une copie.** `sort` modifie le tableau d'origine, et celui qui l'utilisait plus haut le voit réordonné sans savoir pourquoi. Avec `toSorted`, cela n'arrive pas. Et sans fonction de comparaison, il trie comme du texte : `[10, 9, 1]` donne `[1, 10, 9]`.

**Continuer à calculer avec un nombre déjà arrondi en texte.** `toFixed` renvoie un texte. Si tu l'additionnes, tu concatènes. On arrondit à la fin, seulement pour afficher.

**Un `reduce` sans valeur initiale.** Il fonctionne jusqu'au jour où le tableau arrive vide, et alors il lance un `TypeError` au pire moment.

**Les mêmes données écrites à deux endroits.** C'est le problème par lequel commence la leçon : le tableau dit six lignes et le récapitulatif en dit cinq. Les données vivent à un seul endroit ; le reste se calcule.

## Exercices

### Exercice 1 — Ajoute un service et regarde les chiffres changer

Dans ta copie de `services.js`, ajoute un sixième service : `Correo`, `id` `"mail"`, disponible, avec 210 ms. Sans toucher à `stats.js` ni à `main.js`, recharge la page et note les trois chiffres. Avant de recharger, prédis les nombres : combien de services disponibles y aura-t-il et quelle sera la moyenne. La prédiction coïncide-t-elle avec ce qui s'affiche ?

### Exercice 2 — Les plus lents

Écris dans `stats.js` une fonction `slowest(list, n)` qui renvoie les **noms** des `n` services disponibles ayant le plus grand temps de réponse, du plus lent au plus rapide. Elle ne doit pas modifier la liste qu'elle reçoit. Essaie-la avec `n = 2`, avec un `n` supérieur au nombre de services disponibles, et avec une liste vide. Indice : enchaîne `filter`, `toSorted`, `slice` et `map`. Des quatre, [`slice`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) est la seule que tu n'as pas vue : `lista.slice(inicio, fin)` renvoie un **nouveau** tableau avec les éléments depuis la position `inicio` jusqu'à celle qui précède `fin`, sans toucher à l'original. `[10, 20, 30].slice(0, 2)` donne `[10, 20]` : les deux premiers.

### Exercice 3 — Compter tous les états d'un coup

`countByStatus` parcourt la liste une fois pour chaque état que tu demandes. Écris `countsByStatus(list)` qui la parcourt **une seule fois** avec `reduce` et renvoie un objet avec une propriété pour chaque état qui apparaît, par exemple `{ available: 4, down: 1 }`. Elle doit renvoyer un objet sans propriétés pour une liste vide. Indice : l'accumulateur est un objet, et `counts[service.status] ?? 0` te donne le compte actuel ou zéro si l'état n'avait pas encore été vu. Et une question pour après l'avoir résolu : que se passe-t-il si un service arrive avec l'état `"toString"` ?

### Exercice 4 — Provoque quatre erreurs et lis-les

Dans une copie du projet, provoque une à une ces quatre erreurs et note le message exact qu'affiche ton navigateur : (a) demander un service qui n'existe pas et lire son `name` ; (b) importer un nom mal écrit ; (c) réaffecter une `const` ; (d) retirer `type="module"` du `<script>`. Pour chacune, écris en une phrase ce que signifie le message et quelle est la correction.

## Solutions

### Solution 1

Avec six services (cinq disponibles, un en panne), la prédiction est : Disponibles 5, Caídos 1, et la moyenne des cinq qui ont répondu est (120 + 480 + 310 + 950 + 210) / 5 = 2,070 / 5 = 414. Je l'ai vérifié en exécutant le programme : il donne 414. Le service en panne ne compte toujours pas pour la moyenne. Ce qui compte dans l'exercice, c'est ce que tu n'as **pas** eu à toucher : ni les calculs ni le programme principal. Tu as changé les données, qui vivent à un seul endroit, et tout le reste a été recalculé. Voilà le gain de la séparation entre données et calculs.

### Solution 2

On filtre les services disponibles (ceux en panne n'ont pas de temps), on trie une copie du plus grand au plus petit, on prend les `n` premiers et on en extrait le nom :

```js
export function slowest(list, n) {
  return list
    .filter((service) => service.status === "available")
    .toSorted((a, b) => b.responseMs - a.responseMs)
    .slice(0, n)
    .map((service) => service.name);
}
```

Avec les cinq services d'origine, `slowest(services, 2)` renvoie `["Búsqueda", "Pagos"]` (950 et 480). Avec `n` égal à 10, elle renvoie les quatre disponibles, `["Búsqueda", "Pagos", "Notificaciones", "Catálogo"]` : `slice(0, n)` n'échoue pas si `n` est plus grand que la longueur, il renvoie simplement tout. Avec une liste vide, elle renvoie `[]`. La liste d'origine ne change pas, parce que `filter` et `toSorted` renvoient des copies. Si tu avais utilisé `sort` sur `list`, tu aurais réordonné les données du tableau de bord sans que personne s'en aperçoive.

### Solution 3

```js
export function countsByStatus(list) {
  return list.reduce((counts, service) => {
    counts[service.status] = (counts[service.status] ?? 0) + 1;
    return counts;
  }, Object.create(null));
}
```

Pour les cinq services, elle renvoie `{ available: 4, down: 1 }`, et pour `[]` elle renvoie un objet sans propriétés (la valeur initiale, puisqu'il n'y a pas d'éléments). L'accumulateur est l'objet qu'on passe comme second argument de `reduce`.

**Pourquoi `Object.create(null)` et pas `{}`.** C'est la réponse à la question de l'énoncé. Un objet écrit `{}` n'est pas tout à fait vide : il [hérite](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object) de JavaScript une poignée de propriétés que tu ne vois pas, comme `toString`. Si un service arrive avec l'état `"toString"`, `counts["toString"] ?? 0` ne donne pas `0` mais cette fonction héritée, et le compte sort sous forme de texte parasite : `'function toString() { [native code] }1'`. Avec l'état `"__proto__"`, c'est pire : l'affectation ne crée aucune propriété. Je l'ai mesuré avec les deux versions. [`Object.create(null)`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/create) fabrique un objet **sans rien d'hérité**, un dictionnaire propre où il n'y a que ce que tu y stockes, et avec lui `"toString"` et `"__proto__"` comptent 1 comme n'importe quel autre état. Aujourd'hui, les états, c'est toi qui les écris, mais à partir de la Leçon 8 ils viendront de l'extérieur, et une donnée extérieure peut contenir n'importe quel texte. Pour chaque service, `counts[service.status] ?? 0` est le compte qu'il y avait déjà de cet état, ou zéro si c'est la première fois qu'il apparaît ; on lui ajoute un et on le stocke. C'est une variante où l'accumulateur **est** modifié, ce qui est normal dans `reduce` : ce qui n'est jamais modifié, c'est la liste d'entrée. Si, à l'avenir, il y a un troisième état, `countsByStatus` le compte sans changer une seule ligne.

### Solution 4

(a) `Cannot read properties of undefined (reading 'name')`. On a demandé une position qui n'existe pas et on a demandé une propriété à l'`undefined` obtenu. Correction : vérifier la limite du tableau, ou `services[n]?.name`.

(b) `The requested module './services.js' does not provide an export named 'servicios'` (le chemin change selon le fichier). Le nom de l'`import` ne coïncide pas avec celui de l'`export`. Correction : l'écrire à l'identique, caractère par caractère.

(c) `Assignment to constant variable.` On a réaffecté une `const`. Correction : si elle doit changer, la déclarer avec `let` ; sinon, ne pas la réaffecter.

(d) `Cannot use import statement outside a module`. Le `<script>` ne déclare pas `type="module"`. Correction : l'ajouter.

## Comment savoir que j'ai réussi

- [ ] En ouvrant `fig06_08.html` depuis `http://localhost:8000/`, la console affiche exactement quatre lignes : `Disponibles: 4`, `Caídos: 1`, `Respuesta promedio: 465 ms` et `{"available":4,"down":1,"averageMs":465}`, et aucune erreur en rouge.
- [ ] Ton `index.html` charge `js/main.js` avec `<script type="module">`, il a la même apparence qu'avant, et la console affiche les mêmes quatre lignes, qui coïncident avec les chiffres écrits dans le récapitulatif.
- [ ] En ouvrant `fig06_08.html` par un double-clic (`file://`), l'erreur CORS apparaît et tu sais expliquer pourquoi.
- [ ] `fig06_07.html` affiche `1860 372` et tu peux expliquer pourquoi 372 est faux et 465 est juste.
- [ ] Si tu ajoutes le service de courrier avec 210 ms, la console affiche 5 disponibles, 1 en panne et 414 ms sans que tu touches à `stats.js`.
- [ ] Tu peux écrire de mémoire une fonction qui reçoit la liste des services et renvoie combien sont dans un état donné, en utilisant `filter` et `length`.
- [ ] Tu peux expliquer avec tes mots la différence entre `const` et `let`, entre `===` et `==`, entre `sort` et `toSorted`, et pourquoi un service en panne a `responseMs: null` et non `0`.

## Résumé

Réponds sans regarder la leçon :

1. Quel type de valeur donne `typeof` pour `120`, pour `"120"` et pour `true` ? Et pourquoi `120 === "120"` donne-t-il `false` ?
2. Quelle différence y a-t-il entre `const` et `let`, et lequel utilises-tu par défaut ?
3. Comment représente-t-on un service, et comment la liste des services ? Pourquoi le service en panne porte-t-il `null` et non `0` ?
4. Que renvoie `filter`, que renvoie `find`, que renvoie `some` ? Lequel modifie le tableau d'origine, `sort` ou `toSorted` ?
5. Quelles deux choses doit faire une fonction de moyenne avant de diviser ?
6. Dans un `try…catch`, que deviennent les lignes du `try` qui suivent celle qui a lancé une erreur ? Et quand un ternaire convient-il mieux qu'un `if` ?
7. Quel chiffre obtient-on en faisant la moyenne des cinq services du tableau de bord sans filtrer celui qui est en panne, et pourquoi n'est-il pas le bon ?
8. Que fait `type="module"` dans un `<script>` et pourquoi un module ne se charge-t-il pas avec `file://` ?

## Pour aller plus loin

- [MDN, « Guide JavaScript »](https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide) — le guide officiel de Mozilla, de la grammaire et des types jusqu'aux modules, dans le même ordre que cette leçon. Consulté le 7 octobre 2026.
- [MDN, « Modules JavaScript »](https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Modules) — `import`, `export`, la portée d'un module et l'erreur de `file://`. Consulté le 7 octobre 2026.
- [MDN, « Collections indexées »](https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Indexed_collections) — les tableaux et leurs méthodes avec davantage d'exemples. Consulté le 7 octobre 2026.
- [Spécification du langage ECMAScript](https://tc39.es/ecma262/) — la source ultime de ce que signifie chaque opérateur ; ce n'est pas un texte pour apprendre, mais pour consulter quand un doute ne se résout pas ailleurs. Consulté le 7 octobre 2026.
