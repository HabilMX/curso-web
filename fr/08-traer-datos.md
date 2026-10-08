# Leçon 8 — Récupérer des données : promesses, fetch et async/await

**Durée :** 2 × 45 min

**Ce que tu construis :** le tableau de bord qui demande ses données à un fichier JSON du serveur, au lieu de les porter écrites dans le code

**Ce que tu apprends :** ce qu'est une promesse ; `fetch` en deux temps ; `response.ok` ; `async`/`await` ; un `try`/`catch` autour de la requête

## À la fin, tu seras capable de

- Expliquer ce qu'est une promesse, dans quels trois états elle peut se trouver et pourquoi les opérations lentes en renvoient une au lieu de leur résultat.
- Expliquer pourquoi `fetch` a besoin de deux temps (la réponse et son corps) et les écrire d'abord avec `.then` puis avec `async`/`await`.
- Dire quels cas font que la promesse de `fetch` est rompue et lesquels non, et vérifier `response.ok` pour ne pas tenir pour bonne une réponse d'erreur.
- Modifier le tableau de bord pour qu'il demande ses données à `data/services.json` sans toucher aux calculs, au tri ni à l'affichage.
- Reconnaître le message « Unexpected token '<' » et savoir où en chercher la cause.

## Le pourquoi avant le comment

**Point de départ.** Cette leçon part du tableau de bord tel que l'a laissé la leçon 7. Ton tableau de bord dessine le tableau et le récapitulatif à partir des données, et la structure qui reste est la suivante :

- `index.html`, avec le `<tbody>` et les quatre `<dd>` du récapitulatif vides, le bouton « Ordenar por tiempo de respuesta » (Trier par temps de réponse) et la région du détail (`#detail`).
- `css/styles.css`, la feuille des leçons 3, 4, 5 et 7.
- `js/services.js`, qui exporte le tableau `services` et que `main.js` importe **au démarrage**.
- `js/stats.js`, avec `summarize` et les deux calculs de la leçon 6.
- `js/state.js`, avec l'état du tableau de bord (liste, tri, sélection) et les fonctions qui le modifient.
- `js/view.js`, qui dessine l'état dans le document, toujours avec `textContent`.
- `js/main.js`, qui écoute les événements, change l'état et redessine.

Aujourd'hui, on ne change qu'une seule chose de fond : `js/services.js` disparaît, et les services vivent désormais dans `data/services.json`, dans le dossier `data` que tu as créé dans l'Exercice 1 de la leçon 1, un fichier que le tableau de bord **demande** au serveur. Le reste du tableau de bord (les calculs, le tri, la sélection, l'affichage sûr) reste comme il était. Que cela soit possible prouve que la séparation de la leçon 7 en valait la peine. Et deux choses que la leçon 2 avait laissées écrites sans fonctionner se réalisent aujourd'hui : le bouton « Revisar ahora » (Vérifier maintenant), qui redemande les données, et la « Última revisión » (Dernière vérification) de l'en-tête, qui cesse d'être une heure inventée et dit quand les données sont vraiment arrivées.

Voici le fichier : les mêmes cinq services de la leçon 6, écrits en JSON. Les clés sont entre guillemets doubles et le service en panne porte `null`, les règles que la leçon 6 décrivait en 6.2.2 :

```json
[
  { "id": "catalog", "name": "Catálogo", "status": "available", "responseMs": 120 },
  { "id": "payments", "name": "Pagos", "status": "available", "responseMs": 480 },
  { "id": "inventory", "name": "Inventario", "status": "down", "responseMs": null },
  { "id": "notifications", "name": "Notificaciones", "status": "available", "responseMs": 310 },
  { "id": "search", "name": "Búsqueda", "status": "available", "responseMs": 950 }
]
```

**Pourquoi le module ne suffit pas.** Tant que les données étaient dans un module, le tableau de bord démarrait avec elles en main : le navigateur ne pouvait pas dessiner le tableau sans les avoir lues, parce qu'elles venaient dans le même paquet que le code. Un vrai rapport ne fonctionne pas ainsi. Les données sont produites par un autre programme, à un autre moment, et changent sans que personne touche au code du tableau de bord : un service qui tombe en panne à trois heures du matin ne peut pas attendre que quelqu'un modifie `services.js` et republie. C'est pourquoi les données vivent ailleurs, et pour les obtenir il faut faire une requête HTTP, celle que tu as étudiée dans la leçon 0 : on l'envoie, on attend, on reçoit. Séparer le code des données, c'est aussi ce qui permet au même tableau de bord de servir pour n'importe quelle liste de services : le jour où quelqu'un voudra vérifier les siens, il change le fichier, pas le programme.

Une requête, à la différence d'un module, **prend du temps**. Et cela oblige à penser autrement, parce que le programme ne peut pas rester figé à attendre la réponse : la page doit continuer à répondre aux clics et au clavier pendant ce temps. Cette leçon porte sur cette attente : comment écrire un programme qui demande quelque chose, poursuit sa vie et reprend le travail quand la réponse arrive. La pièce qui le rend possible s'appelle une **promesse**, et c'est l'idée la plus importante de la leçon.

Demander quelque chose par le réseau peut aussi **mal tourner** de plusieurs façons : le fichier n'existe pas, le serveur ne répond pas, la réponse n'est pas ce que tu attendais. Aujourd'hui, tu vas apprendre à **détecter** chaque défaillance dans le code, ce qui est la première étape et celle qu'on oublie le plus. Les montrer à l'écran de façon qu'une personne comprenne ce qui s'est passé, mettre une limite à l'attente et demander des données à un autre serveur, c'est le sujet de la leçon 9, qui part du tableau de bord que tu termines aujourd'hui. La séparer en deux leçons a une raison : il faut d'abord bien comprendre le chemin qui se passe bien, car chaque défaillance est un écart par rapport à ce chemin.

**Quel chemin suit la leçon.** D'abord la **promesse** et les deux phases de `fetch`, avec `.then`, qui est la façon dont le web s'est écrit pendant des années et dont tu rencontreras beaucoup de code. Ensuite `async` et `await`, qui disent la même chose sous forme de texte continu, avec le `try`/`catch` que tu connais déjà. Enfin, le tableau de bord : un nouveau module qui demande les données et trois fichiers qui changent un peu pour les recevoir.

**Ce qu'il te faut en marche.** Seulement le serveur local habituel. Les pages de cette leçon se trouvent dans [`programas/08-traer-datos/`](https://github.com/HabilMX/curso-web/tree/main/programas/08-traer-datos) du [dépôt du cours](https://github.com/HabilMX/curso-web) ; avec le dépôt téléchargé sur ton ordinateur, démarre le serveur depuis son dossier `programas/` :

```bash
cd programas
python3 -m http.server 8000 --bind 127.0.0.1
```

Ouvre `http://127.0.0.1:8000/08-traer-datos/panel/`. Garde à l'esprit l'avertissement de la leçon 1 : `fetch` et les modules ne fonctionnent pas avec `file://`, parce qu'un fichier ouvert ainsi n'a pas d'origine qui puisse en lire d'autres. La [norme URL](https://url.spec.whatwg.org/#concept-url-origin) laisse chaque navigateur décider de l'origine d'un fichier local et recommande, dans le doute, une origine opaque ; Chrome 154 fait ainsi (dans la console d'une page ouverte par un double-clic, `self.origin` répond `"null"`), et c'est pourquoi il bloque ces lectures. Rien d'autre n'est nécessaire : ni Node ni paquets.

## Les concepts

Ils sont trois. Comme dans la leçon 7 : avant d'exécuter chaque figure, **écris dans le journal de bord ce que tu crois qu'il va se passer**.

### 8.1 La promesse et `fetch` en deux temps

**Une promesse est un résultat qui n'est pas encore arrivé.** Quand tu demandes quelque chose par le réseau, JavaScript ne reste pas à attendre les bras croisés : la page doit continuer à répondre aux clics, à la molette de la souris, au clavier. C'est pourquoi les opérations lentes ne renvoient pas leur résultat, mais un objet qui le représente : une **promesse** (*Promise*). Une promesse se trouve dans l'un de trois états : **en attente** (il n'y a pas encore de résultat), **tenue** (un résultat est arrivé) ou **rompue** (quelque chose a échoué). Une fois tenue ou rompue, elle ne change plus. La définition formelle se trouve dans la [spécification ECMAScript](https://tc39.es/ecma262/#sec-promise-objects) ; l'explication de MDN sur [la façon d'utiliser les promesses](https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Using_promises) est la lecture la plus claire.

Une comparaison aide. Quand tu commandes à manger à un guichet et qu'on te donne un ticket avec un numéro, le ticket n'est pas le repas : c'est la promesse que le repas arrivera. Pendant que tu attends, tu peux t'asseoir, bavarder ou regarder ton téléphone ; tu ne restes pas immobile devant le guichet. Quand on appelle ton numéro, le ticket est « tenu » et tu récupères le repas ; si le plat est épuisé, le ticket est « rompu » et on te donne une explication. Et un ticket déjà encaissé ne s'encaisse pas deux fois. Une promesse JavaScript est ce ticket.

Avec une promesse, on fait la même chose qu'avec un événement : on lui dit quoi faire quand cela se produira. La méthode `.then(fonction)` enregistre « quand tu seras tenue, exécute ceci avec ton résultat » et la méthode `.catch(fonction)` enregistre « si tu es rompue, exécute ceci avec le motif ». Chaque `.then` renvoie à son tour une autre promesse, et c'est pourquoi on peut les enchaîner. Il y en a une troisième, `.finally(fonction)`, qui s'exécute dans les deux cas, que la promesse soit tenue ou rompue ; elle sert à ce qu'il faut faire quoi qu'il arrive, comme écrire le résultat dans la page.

**`fetch` a besoin de deux temps.** La fonction `fetch(adresse)` demande une ressource par HTTP et renvoie une promesse de **réponse** (`Response`). Mais cette promesse est tenue dès que les **en-têtes** de la réponse arrivent, pas quand tout le contenu est arrivé. C'est la même chose que tu vois dans l'onglet Réseau des outils du navigateur : d'abord arrivent la ligne d'état (`200 OK`) et les en-têtes, puis, peu à peu, le corps. C'est pourquoi il y a un second temps : `respuesta.json()` lit le corps, l'interprète comme du JSON, et renvoie **une autre promesse** qui est tenue avec l'objet obtenu. C'est documenté dans [MDN : utiliser `fetch`](https://developer.mozilla.org/fr/docs/Web/API/Fetch_API/Using_Fetch).

Pourquoi le séparer ainsi et ne pas tout livrer d'un coup ? Parce qu'avec les en-têtes on peut déjà prendre des décisions avant de dépenser du temps sur le corps : si le code dit que le fichier n'existe pas, cela ne sert à rien de lire et d'analyser une page d'erreur comme si c'étaient des données. Et parce que le corps peut être énorme : une vidéo ou un fichier de plusieurs mégaoctets arrive par morceaux, et le programme peut décider comment le lire. Pour le tableau de bord, le corps est petit, mais la règle est la même.

**Prédis :** la figure 8.1 demande `panel/data/services.json` en deux temps et écrit trois informations de la réponse avant de lire le corps. Que crois-tu que diront `ok` et le type de contenu ?

```html
<!-- fig08_01.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 8.1 — fetch en dos pasos</title>
</head>
<body>
  <main>
    <h1>Fig. 8.1 — fetch en dos pasos</h1>
    <pre id="output">Cargando…</pre>
  </main>

  <script type="module">
    const output = document.querySelector("#output");
    const lines = [];

    fetch("panel/data/services.json")                   // paso 1: llega la respuesta
      .then((response) => {
        lines.push(`estado HTTP: ${response.status}`);
        lines.push(`ok: ${response.ok}`);
        lines.push(`tipo de contenido: ${response.headers.get("content-type")}`);
        return response.json();                         // paso 2: se lee el cuerpo (otra promesa)
      })
      .then((services) => {
        lines.push(`servicios recibidos: ${services.length}`);
        lines.push(`el primero: ${services[0].name}`);
        output.textContent = lines.join("\n");
      });
  </script>
</body>
</html>
```

```text
estado HTTP: 200
ok: true
tipo de contenido: application/json
servicios recibidos: 5
el primero: Catálogo
```

Arrête-toi sur chaque pièce, car tu auras besoin de toutes :

- **`response.status`** est le code HTTP de la leçon 0 : 200 veut dire « le voici », 404 « cela n'existe pas », 500 « le serveur s'est cassé ».
- **`response.ok`** est une commodité : il vaut `true` quand le code est entre 200 et 299. Tu vas l'utiliser tout le temps, pour la raison qui suit.
- **`response.headers.get("content-type")`** dit quel type de contenu le serveur a déclaré. Ici `application/json` : le serveur local le déduit de l'extension `.json`.
- Le **premier `.then`** se termine par `return response.json()`. Ce `return` est ce qui enchaîne les deux temps : le second `.then` reçoit déjà le tableau de services, pas la promesse.

**Un 404 n'est pas une défaillance pour `fetch`.** C'est le point de la leçon qui a le plus de conséquences, et presque personne ne s'y attend. Pense à la façon dont la promesse devrait se comporter si tu demandes un fichier qui n'existe pas. Beaucoup de gens supposent qu'elle est rompue, parce que « quelque chose s'est mal passé ». **Prédis** ce que fait la figure 8.2, qui demande `missing.json`, un fichier qui n'existe pas : le `.then` s'exécute-t-il ou le `.catch` ?

```html
<!-- fig08_02.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 8.2 — un 404 no rechaza la promesa</title>
</head>
<body>
  <main>
    <h1>Fig. 8.2 — un 404 no rechaza la promesa</h1>
    <pre id="output">Cargando…</pre>
  </main>

  <script type="module">
    const output = document.querySelector("#output");
    const lines = [];

    fetch("missing.json")
      .then((response) => {
        lines.push("la promesa SE CUMPLIÓ (no se rechazó)");
        lines.push(`estado HTTP: ${response.status}`);
        lines.push(`ok: ${response.ok}`);
      })
      .catch((error) => {
        lines.push(`la promesa se rechazó: ${error.message}`);   // esto NO se ejecuta con un 404
      })
      .finally(() => {
        output.textContent = lines.join("\n");
      });
  </script>
</body>
</html>
```

```text
la promesa SE CUMPLIÓ (no se rechazó)
estado HTTP: 404
ok: false
```

La promesse **a été tenue**. Du point de vue de `fetch`, le serveur a répondu (il a dit « je n'ai pas trouvé cela ») et la communication s'est bien passée ; `ok` est `false` et le `status` est 404, mais le `.catch` ne s'est pas exécuté. Si ton code fait `fetch(url).then(r => r.json())` sans regarder `ok`, un 404 ou un 500 est traité comme de bonnes données. Alors cela échoue plus loin, loin de la cause, avec un message déroutant (tu le verras dans « L'erreur que tu vas voir »). La règle est : **la promesse est rompue quand il n'y a pas de réponse que la page puisse utiliser —aucune n'est arrivée, ou une est arrivée mais le navigateur ne la laisse pas lire, comme avec CORS— ; toute réponse lisible, même une erreur, la tient**.

La liste complète, pour que tu ne l'oublies pas. Les deux dernières lignes, tu les provoqueras dans la leçon 9 ; elles sont ici parce que le tableau n'est utile que complet :

| Situation | La promesse de `fetch` | Comment tu la détectes |
|---|---|---|
| Une réponse 200 à 299 arrive | est tenue | `response.ok === true` |
| Une réponse 404, 500 ou un autre code d'erreur arrive | **est tenue** | `response.ok === false` |
| Il n'y a pas de connexion, le serveur n'existe pas ou est éteint | est rompue avec `TypeError` | `catch` |
| Le navigateur bloque la lecture à cause de CORS | est rompue avec `TypeError` | `catch` |
| Le délai d'attente est dépassé **avant** l'arrivée des en-têtes | est rompue avec `TimeoutError` | `catch` et `error.name` |

Observe que deux lignes du tableau produisent le même `TypeError`. Ce n'est pas un oubli : depuis le code de la page, on **ne peut pas distinguer** une absence de connexion d'un blocage par CORS, en partie exprès : ainsi une page étrangère n'obtient pas d'information sur le réseau de la personne qui la visite. L'explication de ce qui s'est passé se trouve dans la console, et tu la liras dans la leçon 9.

### 8.2 `async`, `await` et le `try` autour de la requête

**Le même programme, écrit en ligne droite.** Enchaîner des `.then` fonctionne, mais un programme avec trois ou quatre étapes et une gestion des erreurs devient un escalier de fonctions dans des fonctions. En 2017, JavaScript a ajouté une syntaxe pour écrire la même chose comme si le code attendait pour de vrai : `async` et `await`. Ce n'est rien d'autre : **c'est la même promesse sous une autre forme**. Elle s'applique ainsi :

- Une fonction marquée **`async`** renvoie toujours une promesse. Ce que la fonction `return`e est la valeur avec laquelle cette promesse est tenue, et si la fonction lance une erreur, la promesse est rompue.
- À l'intérieur, **`await promesse`** met en pause *cette fonction* (pas la page) jusqu'à ce que la promesse soit tenue, et livre son résultat. Si la promesse est rompue, `await` lance l'erreur comme une exception, qu'on attrape avec le `try`/`catch` habituel.
- En dehors d'une fonction `async`, `await` ne peut s'utiliser qu'au niveau supérieur d'un **module**, ce qui est le cas des `<script type="module">` des figures de cette leçon. (C'est un autre avantage des modules.) C'est documenté dans [MDN : `async function`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/async_function) et [`await`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/await).

Reviens au ticket du guichet : `await`, c'est dire « j'attends ici jusqu'à ce qu'on appelle mon numéro ». La différence avec la vie réelle est que celui qui attend, c'est **seulement cette fonction** ; le reste de la page continue de travailler. C'est pourquoi `await` ne fige rien : le navigateur met de côté la fonction en pause, s'occupe du reste et la reprend exactement à cette ligne quand la promesse est tenue.

Dans la figure suivante réapparaissent trois pièces que la leçon 6 a présentées dans « Décider, répéter et signaler une erreur » : `if (condición) { … }`, qui exécute un bloc seulement quand la condition est vraie ; `throw new Error("texto")`, qui crée un objet d'erreur avec ce message (`new` est ce qui fabrique un nouvel objet à partir d'un moule, ici `Error`) et le **lance**, c'est-à-dire interrompt la fonction à cette ligne ; et `try { … } catch (error) { … }`, qui essaie le premier bloc et, si quelque chose est lancé à l'intérieur, saute au second avec l'erreur en main. Si l'une des trois ne te dit rien, reviens à cette section avant de continuer : ici, on les utilise tout le temps.

La figure 8.3 est le même `fetch` que celui de la 8.1, maintenant en ligne droite, avec la vérification de `ok` qui manquait, et essayée contre le bon fichier et contre celui qui n'existe pas. **Prédis** ce qu'elle dira pour chacun :

```html
<!-- fig08_03.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 8.3 — async y await, con la revisión de ok</title>
</head>
<body>
  <main>
    <h1>Fig. 8.3 — async y await, con la revisión de ok</h1>
    <pre id="output">Cargando…</pre>
  </main>

  <script type="module">
    const output = document.querySelector("#output");

    async function requestServices(url) {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`El servidor respondió con el código ${response.status}.`);
      }
      return await response.json();
    }

    async function tryUrl(url) {
      try {
        const services = await requestServices(url);
        return `${url}: llegaron ${services.length} servicios`;
      } catch (error) {
        return `${url}: falló — ${error.message}`;
      }
    }

    const results = [await tryUrl("panel/data/services.json"), await tryUrl("missing.json")];
    output.textContent = results.join("\n");
  </script>
</body>
</html>
```

```text
panel/data/services.json: llegaron 5 servicios
missing.json: falló — El servidor respondió con el código 404.
```

Compare avec la figure 8.1 et remarque trois changements : les fonctions imbriquées ont disparu ; l'étape 1 et l'étape 2 se voient comme deux lignes avec `await` ; et `if (!response.ok) throw new Error(...)` est apparu, qui convertit une réponse d'erreur en une vraie erreur, et ainsi le `catch` de l'appelant la traite comme n'importe quelle autre défaillance. **Ce `if` est la ligne la plus importante de la leçon.** Si tu n'en retiens qu'une, que ce soit celle-ci.

Lis aussi comment le travail est réparti entre les deux fonctions. `requestServices` ne décide pas quoi faire d'une défaillance : elle ne fait que la **signaler**, en lançant une erreur avec un message clair. `tryUrl` est celle qui décide : elle attrape l'erreur et la convertit en une ligne de texte. C'est la même division que tu utiliseras dans le tableau de bord : le module qui demande les données signale ; celui qui l'appelle décide quoi faire.

Et une précaution qui, elle, produit de vraies erreurs : oublier le `await`. `const services = requestServices(url)` sans `await` ne donne pas les services, mais la *promesse* des services ; si tu l'affiches tu verras `Promise { <pending> }` et si tu l'utilises comme un tableau, rien ne fonctionne. Il n'y a pas d'erreur quand on l'oublie, seulement un résultat absurde.

**Dans quel ordre les choses se passent.** Une fonction `async` ne se met pas en pause quand on l'appelle : elle s'exécute normalement, ligne par ligne, **jusqu'au premier `await`**. Là, elle se met de côté, et celui qui l'a appelée poursuit avec sa ligne suivante. Quand la promesse est tenue, la fonction continue à partir de ce `await`. Cela explique quelque chose qui déroute beaucoup au début : le code écrit *après* l'appel à une fonction `async` peut s'exécuter *avant* le code écrit *à l'intérieur* de celle-ci, après son `await`. L'Exercice 3 te demande de prédire cet ordre ; fais-le calmement, car le comprendre t'épargnera des heures de débogage.

### 8.3 Le tableau de bord demande ses données

Avec ce qui précède, tu peux déjà modifier le tableau de bord. Ce sont cinq fichiers, et il vaut la peine de voir d'abord le plan complet, avant le code :

| Fichier | Ce qui change | Pourquoi |
|---|---|---|
| `js/services.js` | disparaît | les données vivent désormais dans `data/services.json` |
| `js/load.js` | est nouveau | demande les données et renvoie un tableau, ou lance une erreur |
| `js/state.js` | l'état démarre sans services et se souvient de quand ils sont arrivés | à l'ouverture de la page, il n'y a pas encore de données |
| `js/view.js` | écrit l'heure de la « Última revisión » | l'heure cesse d'être écrite à la main |
| `index.html` | deux `id` nouveaux | pour que le code trouve l'heure et le bouton « Revisar ahora » |
| `js/main.js` | demande les données au démarrage et avec « Revisar ahora » | c'est lui qui assemble les pièces |

`js/stats.js` et `css/styles.css` ne changent pas. Que le plus gros changement du tableau de bord jusqu'ici laisse intacts les calculs et l'apparence est la récompense d'avoir séparé les responsabilités dans la leçon 7.

**Étape 1 : le module qui demande les données.** Le nouveau module, `js/load.js`, s'écrit avec une règle : **il ne touche pas au document**. Il demande les données et renvoie un tableau, ou lance une erreur avec un message. Il ne sait pas s'il y a un tableau HTML, un avertissement ou une personne qui regarde ; celui qui décide comment le montrer est un autre fichier. C'est la même répartition que dans la figure 8.3 : `requestServices` signalait et `tryUrl` décidait.

Avant le code, un nouvel outil et deux connus. À la fin, il y a une petite fonction, `isService`, qui utilise deux outils de la leçon 6 —`typeof`, qui dit de quel type est une valeur, et `every`, qui demande si **tous** les éléments d'un tableau satisfont une condition— et un nouveau, `Number.isFinite(valor)`, qui n'est vrai que pour un vrai nombre (pas pour le texte `"120"`, ni pour `NaN`, ni pour `Infinity`).

```js
// panel/js/load.js
// Pide la lista de servicios y devuelve un arreglo, o lanza un Error.
// No toca el documento.

export async function loadServices(url) {
  // Paso 1: la respuesta.
  const response = await fetch(url);

  // fetch NO rechaza con un 404 o un 500: hay que mirarlo.
  if (!response.ok) {
    throw new Error(`El servidor respondió con el código ${response.status}.`);
  }

  // Paso 2: el cuerpo, leído como JSON.
  const data = await response.json();

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

Lis le code avec ces questions :

- **Où sont les deux temps ?** Dans les deux lignes avec `await` : `await fetch(url)` apporte la réponse et `await response.json()` lit son corps. Entre les deux se trouve la vérification de `ok`, au seul endroit où elle a du sens : avec la réponse en main et avant de dépenser du temps sur le corps.
- **Pourquoi n'y a-t-il aucun `try` ici ?** Parce que ce module ne décide rien au sujet des défaillances : si `fetch` est rompu ou si `json()` ne peut pas lire le corps, l'erreur poursuit son chemin vers celui qui a appelé `loadServices`, qui est celui qui sait quoi faire. Un `try` qui attrape une erreur seulement pour la relancer à l'identique n'apporte rien. Dans la leçon 9, ce fichier aura bien un `try`, parce que là chaque défaillance sera **traduite** en une phrase différente.
- **Que font `Array.isArray` et `isService` ?** Ils vérifient la forme d'une donnée extérieure avant de la laisser passer. `Array.isArray` regarde que ce qui est arrivé est une liste ; `data.every(isService)` regarde que **chaque** élément est un objet avec `id`, `name` et `status` de type texte, et `responseMs` nombre ou `null`. La seconde vérification n'est pas un ornement. Un fichier avec `[null]` est du JSON parfaitement valide et c'est un tableau ; sans elle, ce `null` arriverait jusqu'à `summarize`, qui essaierait de lire `service.status` de `null`, et le programme s'arrêterait avec un `TypeError` loin de la cause. De même avec un `"responseMs": "120"` écrit entre guillemets : la moyenne additionnerait des textes. Une validation plus complète —valeurs permises, plages, clés en trop, messages qui disent *quel* élément a échoué— est le sujet de la leçon 6 du [cours de TypeScript](https://www.habil.mx/fr/cours/typescript/). Et l'autre défense reste en place : le tableau de bord dessine tout avec `textContent` et le badge utilise une liste fermée, donc un texte bizarre a l'air bizarre, mais n'exécute rien.

**Étape 2 : l'état démarre vide.** Dans la leçon 7, `createState(services)` recevait les services, parce qu'au démarrage ils étaient déjà là. Maintenant non : à l'ouverture de la page, il n'y en a aucun, il faut les demander. Donc `createState()` ne reçoit plus rien et commence avec une liste vide, et une fonction apparaît, `loadSucceeded`, qui conserve ce qui est arrivé. Elle conserve aussi un nouveau champ, `checkedAt` : le **moment** où les données sont arrivées, ce que l'en-tête va afficher. Ce moment est passé par celui qui charge, comme un objet `Date` (`new Date()` en fabrique un avec la date et l'heure actuelles). Et elle désélectionne le service choisi, parce qu'après une nouvelle vérification la liste peut être différente et celui qui était choisi pourrait ne plus exister.

```js
// panel/js/state.js
// El estado del panel y las únicas formas de cambiarlo.
// No toca el documento: por eso se puede probar sin pantalla.

export function createState() {
  return {
    services: [],           // vacío al arrancar: los datos hay que pedirlos
    checkedAt: null,        // cuándo llegaron los datos por última vez (un Date), o null
    sortByTime: false,      // false = en el orden original; true = del más rápido al más lento
    selected: null,         // el id del servicio elegido, o null
  };
}

export function loadSucceeded(state, services, checkedAt) {
  state.services = services;
  state.checkedAt = checkedAt;
  state.selected = null;
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

Le reste du fichier est celui de la leçon 7 sans changement : trier, choisir et calculer ce qui est visible ne dépendent pas de l'endroit d'où les données sont venues.

**Étape 3 : la vue écrit l'heure.** La vue gagne une fonction, `renderCheckedAt`, qui crée un élément `<time>`, comme celui que tu avais écrit à la main dans la leçon 2, avec la donnée pour les machines dans `dateTime` (`toISOString()` la donne dans le format que demande la norme) et le texte pour les personnes produit par [`Intl.DateTimeFormat`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat), qui en `es-MX` écrit quelque chose comme « 7 de octubre de 2026 a las 12:03 p.m. ». C'est le même type de formateur que celui que la leçon 6 a utilisé pour les nombres, maintenant pour les dates. Si rien n'est encore arrivé, `checkedAt` vaut `null` et la fonction ne fait rien : l'en-tête reste avec « todavía no » (pas encore), parce qu'une heure inventée, dans un tableau de bord qui vérifie pour de bon, serait un mensonge. Le reste de `render` est celui de la leçon 7, avec une ligne de plus au début.

```js
// panel/js/view.js
// Dibuja el estado en el documento, con la hora en que llegaron los datos.
// Todo texto de los datos entra con textContent.
import { summarize } from "./stats.js";
import { visible, selectedService } from "./state.js";

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

// elements = { checkedAt, total, available, down, average, body, detail, sortButton }
export function render(state, elements) {
  const { services } = state;
  renderCheckedAt(state.checkedAt, elements.checkedAt);

  const summary = summarize(services);
  elements.total.textContent = String(services.length);
  elements.available.textContent = `${summary.available} de ${services.length}`;
  elements.down.textContent = String(summary.down);
  elements.average.textContent = summary.averageMs === null ? "sin datos" : `${summary.averageMs} ms`;

  elements.sortButton.setAttribute("aria-pressed", String(state.sortByTime));

  const rows = visible(state).map((service) => createRow(service, service.id === state.selected));
  elements.body.replaceChildren(...rows);

  const chosen = selectedService(state);
  elements.detail.textContent = chosen === null ? "Elige un servicio para ver su detalle." : describe(chosen);
}
```

**Étape 4 : le HTML gagne deux noms.** C'est l'`index.html` de la leçon 7 avec deux changements : l'en-tête abandonne l'heure écrite à la main et porte à sa place `<span id="checked-at">todavía no</span>`, et « Revisar ahora » gagne l'`id` qu'annonçait la leçon 2, `check-now`. Sans ces `id`, le code n'aurait aucun moyen de trouver ces deux éléments.

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
    </section>
  </main>

  <footer>
    <p>Datos de ejemplo del archivo data/services.json.</p>
  </footer>
</body>
</html>
```

**Étape 5 : `main.js` demande les données.** Il n'importe plus `services.js` : il importe `loadServices` et appelle une nouvelle fonction, `load`, au démarrage et chaque fois que quelqu'un appuie sur « Revisar ahora ». Avant de la lire, un détail d'écriture qui apparaît pour la première fois : `let services;` déclare la variable **sans valeur**, en dehors du `try`, et à l'intérieur du `try` on lui en assigne une. C'est nécessaire parce qu'une variable déclarée à l'intérieur d'un bloc `{ … }` n'existe que dans ce bloc, et `services` est nécessaire ensuite, en dehors de lui.

```js
// panel/js/main.js
// Junta las piezas: pide los datos, guarda el resultado en el estado y dibuja.
import { loadServices } from "./load.js";
import { createState, loadSucceeded, toggleSort, select } from "./state.js";
import { render } from "./view.js";

const elements = {
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
  let services;
  try {
    services = await loadServices("data/services.json");
  } catch (error) {
    // Por ahora la falla solo queda en la consola. La lección 9 la lleva a la pantalla.
    console.error(`No se pudieron cargar los servicios: ${error.message}`);
    return;
  }
  loadSucceeded(state, services, new Date());
  render(state, elements);
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

// Delegación: un solo oyente en el <tbody> atiende los botones de todas las filas.
elements.body.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-id]");
  if (button === null) return;
  update(() => select(state, button.dataset.id));
});

load();
```

La fonction `load` a trois parties, et l'ordre compte :

1. Elle **essaie** de demander les données, dans un `try`.
2. Si cela échoue, elle **avertit** dans la console avec `console.error` et se termine par `return`. Le tableau reste comme il était.
3. Si tout s'est bien passé, elle **conserve** dans l'état et **dessine**.

Remarque que le `try` enveloppe **seulement la requête**, pas l'affichage. Si l'affichage avait une erreur de programmation, nous ne voulons pas que le `catch` l'attrape et la déguise en « les services n'ont pas pu être chargés » : nous voulons la voir dans la console telle quelle, avec son fichier et sa ligne. Un `try` aussi grand que la fonction entière cache des erreurs qui n'ont rien à voir avec le réseau.

Et sois honnête sur ce que ce tableau de bord ne fait pas encore : si la requête échoue, la personne ne voit rien. Le tableau reste vide, le récapitulatif aussi, et le seul indice se trouve dans la console, que personne en dehors de qui programme n'ouvre. Pendant le chargement, aucun avertissement ne s'affiche non plus. C'est un tableau de bord qui fonctionne sur le chemin heureux et qui **détecte** les défaillances, mais qui ne les **raconte** pas encore. Bien les raconter —chargement, erreur et vide, chacun avec son avertissement et annoncé à un lecteur d'écran— est le travail de la leçon 9, et cette séparation te permet de voir clairement ce qu'apporte chaque partie.

**Comment tu le vérifies.** Avec le serveur démarré, ouvre `http://127.0.0.1:8000/08-traer-datos/panel/`. Le récapitulatif doit dire 5, 4 sur 5, 1 et 465 ms, comme dans la leçon 7, et l'en-tête, la date et l'heure de ce moment. Appuie sur « Ordenar por tiempo de respuesta » et choisis un service : tout fonctionne comme avant, parce que ces parties n'ont pas changé. Appuie sur « Revisar ahora » au clavier : l'heure de l'en-tête est réécrite et le focus reste sur le bouton, parce que le bouton ne disparaît jamais. C'est ainsi que cela a été vérifié dans Chrome 154, aussi avec la fenêtre à 320 px, où la page ne déborde pas.

Maintenant, provoque une défaillance, pour voir ce que le tableau de bord en fait. Dans `js/main.js`, remplace temporairement `"data/services.json"` par `"data/missing.json"` et recharge. Le tableau et le récapitulatif restent vides, l'en-tête continue de dire « todavía no », et la console de Chrome affiche deux lignes rouges : celle du navigateur, `Failed to load resource: the server responded with a status of 404 (File not found)`, et la tienne, `No se pudieron cargar los servicios: El servidor respondió con el código 404.` (Les services n'ont pas pu être chargés : le serveur a répondu avec le code 404.). La première est écrite par le navigateur de lui-même devant toute réponse d'erreur ; la seconde est celle qu'a écrite ton `catch`. Annule la modification en terminant.

## L'erreur que tu vas voir

**`Unexpected token '<'`.** C'est la conséquence d'avoir oublié `ok` ou d'avoir visé une mauvaise adresse qui, de plus, ne répond pas par une erreur mais par une page. La figure 8.4 demande une page HTML et la lit comme si c'était du JSON :

```html
<!-- fig08_04.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 8.4 — leer como JSON algo que no lo es</title>
</head>
<body>
  <main>
    <h1>Fig. 8.4 — leer como JSON algo que no lo es</h1>
    <pre id="output">Cargando…</pre>
  </main>

  <script type="module">
    const output = document.querySelector("#output");

    const response = await fetch("fig08_01.html");   // existe, responde 200... pero es una página
    output.textContent = `código: ${response.status}, ok: ${response.ok}\ntipo: ${response.headers.get("content-type")}`;
    try {
      await response.json();
    } catch (error) {
      output.textContent += `\n${error.name}: ${error.message}`;
    }
  </script>
</body>
</html>
```

```text
código: 200, ok: true
tipo: text/html
SyntaxError: Unexpected token '<', "<!-- fig08"... is not valid JSON
```

(La troisième ligne est le message de Chrome ; Firefox dit quelque chose comme « JSON.parse: unexpected character at line 1 column 1 », mais le nom, `SyntaxError`, est le même.) Lis-le calmement : le serveur a répondu **200**, `ok` est `true`, et il n'y a eu aucun problème de connexion. La défaillance est dans le contenu : le type déclaré est `text/html`, et `.json()` est tombé, au premier caractère, sur le `<` par lequel commence la page (ici, celui du commentaire `<!-- fig08_01.html -->` ; dans une autre page, ce serait celui de `<!DOCTYPE html>`), qui ne peut pas apparaître en JSON. Entre guillemets, Chrome te montre les premiers caractères de ce qui est arrivé, et c'est le meilleur indice : s'ils commencent par `<`, c'est une page qui t'est arrivée.

« Unexpected token '<' » est presque toujours la signature de « il m'est arrivé une page HTML là où j'attendais du JSON » : une adresse mal écrite, une page d'erreur du serveur, ou une redirection vers l'écran de connexion. Vérifie dans l'onglet Réseau ce qui est vraiment arrivé : le code, le type de contenu et, dans la vue de la réponse, le texte. Si tu fais l'essai dans le tableau de bord, en remplaçant dans `main.js` l'adresse par `"index.html"`, la console dit `No se pudieron cargar los servicios: Unexpected token '<', "<!-- panel"... is not valid JSON` : la même erreur, maintenant attrapée par ton `catch`. C'est un message pour qui programme, pas pour qui utilise le tableau de bord ; dans la leçon 9, tu le traduiras en une phrase que n'importe qui comprend.

## Ce qui se fait de travers

- **Ne pas vérifier `response.ok`.** C'est l'erreur de la figure 8.2. Un 404 ou un 500 entre dans le programme comme si c'étaient des données, et la vraie défaillance apparaît loin de la cause. La correction est la ligne `if (!response.ok) throw …`, toujours.
- **Laisser le `catch` vide.** `catch {}` fait disparaître n'importe quelle défaillance sans laisser de trace : le tableau de bord n'affiche simplement rien et personne ne sait pourquoi. Tout `catch` doit faire quelque chose de visible : avertir la personne, ou laisser le détail dans la console.
- **Tout envelopper dans un seul `try`.** Si le `try` couvre la requête *et* l'affichage, une erreur de programmation dans l'affichage se présente comme une défaillance du réseau. Le `try` va autour de ce qui peut échouer pour des causes extérieures, et rien d'autre.
- **Oublier le `await`.** La valeur que tu obtiens est une promesse, pas le résultat. Si quelque chose affiche `[object Promise]` à l'écran, c'est cela.
- **Mélanger la requête avec l'affichage.** Une fonction qui fait `fetch` et construit en même temps des lignes ne peut ni se tester ni se réutiliser. `js/load.js` demande, `js/state.js` se souvient, `js/view.js` dessine.
- **Afficher avec `innerHTML` les données arrivées.** Ce qui vient de l'extérieur est une donnée extérieure, même si cela vient de ton propre serveur, parce que demain ce serveur peut être un autre. Le principe de la leçon 7 reste en vigueur sans changement.
- **Ouvrir le tableau de bord avec `file://`.** `fetch` ne peut pas lire de fichiers locaux depuis une page ouverte par un double-clic. Si la console parle de CORS et que l'adresse commence par `file://`, la cause est celle-là : sers le dossier avec `python3 -m http.server`.

## Exercices

### Exercice 1 — La figure 8.2, avec `await`

Réécris la figure 8.2 avec `await` et `try`/`catch` au lieu de `.then`, `.catch` et `.finally`. La page doit afficher exactement les mêmes trois lignes que l'originale. Avant de l'écrire, décide quelle partie du code d'origine devient le `try`, laquelle le `catch` et ce qu'il advient du `.finally`.

### Exercice 2 — Un message par type de problème

Aujourd'hui, n'importe quel code d'erreur produit « El servidor respondió con el código N. » (Le serveur a répondu avec le code N.) Modifie-le pour qu'un 404 dise « No se encontró la lista de servicios. » (La liste des services est introuvable.) et qu'un code de 500 et plus dise « El servidor tuvo un problema (código N). Intenta de nuevo en un momento. » (Le serveur a eu un problème (code N). Réessaie dans un instant.) Les autres codes conservent le message actuel. Décide dans quel fichier va la modification et pourquoi elle ne touche ni `js/view.js` ni `js/state.js`.

### Exercice 3 — Dans quel ordre ?

Avant de l'exécuter, écris dans ton journal de bord dans quel ordre apparaîtront les cinq lignes qu'écrit ce programme. Ensuite, enregistre-le sous le nom `order.html` dans le dossier `08-traer-datos/` de ta copie de `programas/`, ouvre-le avec le serveur démarré et compare.

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <link rel="icon" href="data:,">
  <title>¿En qué orden?</title>
</head>
<body>
  <pre id="output"></pre>
  <script type="module">
    const lines = [];

    async function countServices() {
      lines.push("1: dentro de la función, antes del await");
      const response = await fetch("panel/data/services.json");
      const services = await response.json();
      lines.push("2: dentro de la función, después del await");
      return services.length;
    }

    lines.push("A: antes de llamar");
    const pending = countServices();
    lines.push("B: después de llamar, sin await");
    const count = await pending;
    lines.push(`C: llegaron ${count}`);

    document.querySelector("#output").textContent = lines.join("\n");
  </script>
</body>
</html>
```

## Solutions

### Solution 1

Le `.then` devient le corps du `try`, le `.catch` devient le `catch`, et le `.finally` devient la ligne qui suit le `try`/`catch`, qui s'exécute dans les deux cas parce qu'aucun des deux blocs ne termine la fonction :

```html
  <script type="module">
    const output = document.querySelector("#output");
    const lines = [];

    try {
      const response = await fetch("missing.json");
      lines.push("la promesa SE CUMPLIÓ (no se rechazó)");
      lines.push(`estado HTTP: ${response.status}`);
      lines.push(`ok: ${response.ok}`);
    } catch (error) {
      lines.push(`la promesa se rechazó: ${error.message}`);   // esto NO se ejecuta con un 404
    }
    output.textContent = lines.join("\n");
  </script>
```

Avec le reste de la page identique à la figure 8.2, Chrome affiche les mêmes trois lignes : `la promesa SE CUMPLIÓ (no se rechazó)`, `estado HTTP: 404` et `ok: false`. Le `await` ne change pas la règle : un 404 tient la promesse, et c'est pourquoi le `catch` ne s'exécute pas même si « quelque chose s'est mal passé ».

### Solution 2

Cela va dans `js/load.js`, parce que c'est là qu'on traduit un résultat technique en une phrase ; `js/view.js` ne fait que dessiner ce qu'il reçoit et `js/state.js` ne fait que le conserver. On change le `throw` du `if (!response.ok)` et on ajoute une fonction à la fin du fichier :

```js
  if (!response.ok) {
    throw new Error(statusMessage(response.status));
  }
```

```js
// Un mensaje distinto según de quién es el problema.
function statusMessage(code) {
  if (code === 404) return "No se encontró la lista de servicios.";
  if (code >= 500) return `El servidor tuvo un problema (código ${code}). Intenta de nuevo en un momento.`;
  return `El servidor respondió con el código ${code}.`;
}
```

Pour le vérifier, remplace temporairement dans `js/main.js` l'adresse par `"data/missing.json"` : la console dit maintenant `No se pudieron cargar los servicios: No se encontró la lista de servicios.`. Le serveur statique du cours ne peut pas produire de 500, donc cette branche se vérifie avec une astuce : remplace temporairement `code === 404` par `code === 999` et `code >= 500` par `code >= 400`, recharge et « El servidor tuvo un problema (código 404)… » doit apparaître. Annule les deux modifications en terminant. Pour l'instant, le message ne se lit que dans la console ; dans la leçon 9, il apparaîtra à l'écran sans que tu aies à toucher à ce fichier.

### Solution 3

L'ordre est A, 1, B, 2, C :

```text
A: antes de llamar
1: dentro de la función, antes del await
B: después de llamar, sin await
2: dentro de la función, después del await
C: llegaron 5
```

« A » vient en premier parce que c'est la première ligne qui s'exécute. En appelant `countServices`, la fonction **commence à s'exécuter immédiatement** et écrit « 1 » ; en arrivant au premier `await`, elle se met de côté et rend à celui qui l'a appelée une promesse en attente. C'est pourquoi « B » sort avant « 2 » : le programme principal a poursuivi avec sa ligne suivante pendant que la requête voyageait. Quand le programme principal arrive à `await pending`, il se met de côté lui aussi ; la requête se termine, la fonction continue et écrit « 2 », sa promesse est tenue avec 5, et le programme principal reprend et écrit « C ». C'est ce que montre Chrome 154. Si tu as prédit A, B, 1, 2, C, tu pensais que la fonction ne commence pas tant que personne ne l'attend ; si tu as prédit A, 1, 2, B, C, tu pensais que `await` fige tout le programme. Les deux erreurs sont courantes, et c'est pourquoi cela vaut la peine de le voir une fois.

## Comment savoir que j'ai réussi

- [ ] Avec le dossier `programas/` du dépôt servi sur ton ordinateur, `08-traer-datos/fig08_01.html` affiche `ok: true` et `servicios recibidos: 5` ; `fig08_02.html` affiche `ok: false` et `estado HTTP: 404` sans que le `.catch` s'exécute.
- [ ] `fig08_03.html` affiche une ligne qui est arrivée correctement et une qui a échoué avec le code 404.
- [ ] Dans ton tableau de bord, le récapitulatif dit 5, 4 sur 5, 1 et 465 ms, l'en-tête indique la date et l'heure auxquelles les données sont arrivées, et `js/services.js` n'existe plus.
- [ ] En appuyant sur « Revisar ahora », l'heure de l'en-tête est réécrite et le focus reste sur le bouton.
- [ ] Avec l'adresse remplacée par `data/missing.json`, la console affiche ton message avec le code 404, et rien d'autre ne casse.
- [ ] Trier et choisir un service fonctionnent comme dans la leçon 7.
- [ ] Tu cherches `innerHTML` dans tes fichiers `.js` et il n'apparaît pas.

**Révision des leçons précédentes** (réponds-y sans regarder, puis vérifie) :

1. Dans la leçon 0 : quelles deux choses voyagent dans une réponse HTTP avant le contenu, et laquelle est le code 404 ?
2. Dans la leçon 6 : que renvoie `averageResponseMs` quand aucun service n'a de mesure, et pourquoi `null` et non zéro ?
3. Dans la leçon 7 : pourquoi `js/view.js` utilise-t-il `textContent` et non `innerHTML` même si les données viennent de ton propre serveur ?

## Pour aller plus loin

- [MDN — Utiliser l'API Fetch](https://developer.mozilla.org/fr/docs/Web/API/Fetch_API/Using_Fetch) — la référence de `fetch` : `ok`, le corps, les en-têtes et les types d'erreur ; consulté le 7 octobre 2026.
- [MDN — Comment utiliser les promesses](https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Using_promises) — `.then`, `.catch` et l'enchaînement, pas à pas ; consulté le 7 octobre 2026.
- [MDN — `async function`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/async_function) — ce que renvoie une fonction `async` et comment `await` se comporte à l'intérieur ; consulté le 7 octobre 2026.
