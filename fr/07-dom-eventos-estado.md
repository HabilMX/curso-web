# Leçon 7 — Le DOM, les événements et l'état

**Durée :** 2 × 45 min

**Ce que tu construis :** le tableau des services, dessiné à partir des données

**Ce que tu apprends :** dessiner à partir de données plutôt qu'écrire à la main ; écouter des événements ; séparer l'état, l'affichage et les effets ; `textContent` comme habitude, et l'attaque qu'il évite

## À la fin, tu seras capable de

- Expliquer la différence entre le fichier HTML et le DOM, et dire lequel des deux change quand JavaScript écrit dans la page.
- Dessiner un tableau HTML complet à partir d'un tableau d'objets, en créant les éléments un par un et en les accrochant au document.
- Expliquer ce qu'est une attaque XSS avec un exemple que tu provoques toi-même, et pourquoi `textContent` l'évite et `innerHTML` la permet.
- Écouter un événement avec `addEventListener`, lire ce qui est arrivé à l'élément grâce à l'objet de l'événement, et gérer de nombreux boutons avec un seul écouteur (délégation).
- Séparer l'état du tableau de bord (ce dont il se souvient), l'affichage (son apparence) et les effets (ce qu'il écoute), et dire dans quel fichier vit chaque chose.
- Naviguer dans le tableau de bord uniquement au clavier et vérifier que le focus ne se perd pas quand le tableau est redessiné.

## Le pourquoi avant le comment

**Point de départ.** Cette leçon part du tableau de bord tel que l'a laissé la leçon 6, dans ton dossier `revisor` :

- `index.html`, le tableau de bord de la leçon 2 avec les classes que lui ont données les leçons 4 et 5 : l'en-tête, le récapitulatif avec ses quatre chiffres écrits à la main, le champ de recherche, les boutons radio, le bouton « Revisar ahora » (Vérifier maintenant) et le tableau avec ses cinq lignes écrites à la main. Dans le `<head>`, il porte la ligne `<script type="module" src="js/main.js">` que tu as ajoutée dans la leçon 6.
- `css/styles.css`, la feuille des leçons 3, 4 et 5 : couches, variables de couleur, badges d'état et la disposition qui va de 320 à 1440 pixels.
- `js/services.js`, un module qui exporte le tableau `services` avec les cinq services.
- `js/stats.js`, un module qui exporte `countByStatus`, `averageResponseMs` et `summarize`.
- `js/main.js`, qui pour l'instant se contente d'écrire les calculs dans la console du navigateur.

Les deux modules de données et de calculs ne changent pas de toute la leçon : voici leur forme, la même que dans la leçon 6. La seule chose différente est la première ligne, le commentaire qui, dans le dépôt, dit où vit chaque fichier : le tableau de bord de cette leçon se trouve dans [`programas/07-dom-eventos-estado/panel/`](https://github.com/HabilMX/curso-web/tree/main/programas/07-dom-eventos-estado/panel).

```js
// panel/js/services.js
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
// panel/js/stats.js
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

Remarque une décision de la leçon 6 qui se paie aujourd'hui : un service en panne n'a pas de temps de réponse, et c'est pourquoi son `responseMs` vaut `null` au lieu de zéro. Un zéro dirait « a répondu en zéro milliseconde », ce qui est faux et ruine en plus la moyenne. `averageResponseMs` sait déjà laisser de côté ceux qui n'ont pas répondu, et aujourd'hui tu verras que le tableau doit lui aussi décider quoi afficher à leur place.

**Ce qui manque aujourd'hui au tableau de bord.** Tu as les mêmes cinq services à deux endroits : dans `js/services.js`, où JavaScript peut les compter, et dans le HTML, où une personne peut les voir. Rien ne garantit qu'ils coïncident. Si demain Pagos tombe en panne et que tu modifies le tableau `services`, le tableau HTML continuera à dire « Disponible » jusqu'à ce que quelqu'un pense à modifier aussi le HTML. Si tu ajoutes un sixième service, tu dois copier une ligne entière, avec son badge, sans te tromper sur une balise. Et le récapitulatif a le même problème : ses quatre chiffres, tu les as écrits à la main dans la leçon 2, et ceux qu'a calculés la leçon 6 sont enfermés dans la console.

Deux copies de la même information finissent par se contredire. La sortie consiste à avoir **une seule source de vérité**, les données, et à faire de l'écran une conséquence : quand les données changent, on redessine. C'est ce que tu construis aujourd'hui.

**Quel chemin suit la leçon.** Ce sont trois idées, dans cet ordre. D'abord le **DOM**, c'est-à-dire la façon dont JavaScript voit et modifie la page, et avec lui tu dessines le tableau à partir des données ; là apparaît aussi la règle de sécurité la plus rentable de tout le web, qui tient en une ligne et que tu verras se casser de tes propres yeux. Ensuite les **événements**, c'est-à-dire la façon dont la page apprend que quelqu'un a fait quelque chose. Enfin l'**état**, c'est-à-dire ce dont le tableau de bord se souvient, et la séparation qui évite que le code devienne un enchevêtrement dès qu'il y a plus d'un bouton.

Un avertissement pratique avant de commencer : les modules ne se chargent pas quand on ouvre le fichier par un double-clic (`file://`). Depuis la leçon 1, tu travailles avec un serveur local. Les pages de cette leçon se trouvent dans le dossier [`programas/07-dom-eventos-estado/`](https://github.com/HabilMX/curso-web/tree/main/programas/07-dom-eventos-estado) du [dépôt du cours](https://github.com/HabilMX/curso-web) : télécharge-le (ou clone-le avec Git) sur ton ordinateur et démarre le serveur depuis son dossier `programas/` :

```bash
cd programas
python3 -m http.server 8000 --bind 127.0.0.1
```

Et ouvre `http://127.0.0.1:8000/07-dom-eventos-estado/panel/`. Le `--bind 127.0.0.1` fait que seul ton ordinateur peut voir le dossier ; sans lui, le serveur répond à tout le réseau local.

## Les concepts

Ils sont trois, et chacun apporte son exemple minimal et son exemple dans le `revisor`. Un rappel de méthode qui vaut pour toute la leçon : **avant d'exécuter chaque figure, écris dans le journal de bord ce que tu crois qu'il va se passer**. Prédire puis vérifier apprend plus que lire la réponse, parce que, quand tu te trompes, l'erreur reste gravée.

### 7.1 Le DOM : la page comme un arbre que JavaScript peut modifier

**Le fichier n'est pas la page.** Quand le navigateur reçoit un fichier HTML, ce qu'il a entre les mains, c'est du texte. Il le lit du début à la fin et construit avec lui en mémoire une structure d'objets, un **arbre** : `html` contient `head` et `body` ; `body` contient l'en-tête, le tableau, les paragraphes ; le tableau contient son corps, le corps ses lignes, chaque ligne ses cellules. Chaque pièce de cet arbre s'appelle un **nœud**, et l'arbre complet, le **DOM** (de l'anglais *Document Object Model*, le modèle objet du document). La définition officielle se trouve dans la [norme DOM](https://dom.spec.whatwg.org/) ; l'explication de MDN sur [ce qu'est le DOM](https://developer.mozilla.org/fr/docs/Web/API/Document_Object_Model/Introduction) est la lecture recommandée pour qui veut le détail.

Cette distinction compte pour trois raisons que tu vas vérifier avec les outils du navigateur :

1. **Ce que tu vois dans l'Inspecteur, c'est le DOM, pas le fichier.** Ouvre ton `index.html` avec le serveur, appuie sur `F12` et va dans l'onglet de l'Inspecteur. Si dans ton HTML tu as écrit un tableau sans `<tbody>`, l'Inspecteur te le montrera quand même : le navigateur l'a ajouté en construisant l'arbre, parce que la norme l'ordonne. « Code source de la page » montre le fichier ; l'Inspecteur montre l'arbre vivant.
2. **JavaScript modifie l'arbre, pas le fichier.** Si un programme ajoute une ligne, le fichier `index.html` sur ton disque reste identique. Recharge la page et la modification disparaît, parce que le navigateur relit le fichier et reconstruit l'arbre. C'est pourquoi tu ne vas jamais « enregistrer » une modification du DOM : le DOM est reconstruit à chaque fois, et ce qu'on enregistre, ce sont les données et le code qui le dessine.
3. **L'Inspecteur se met à jour tout seul.** Avec le tableau de bord ouvert, quand le code modifie l'arbre, tu verras clignoter le nœud modifié. C'est la meilleure façon d'apprendre : regarde quels nœuds changent et lesquels non.

**Lire et écrire l'arbre.** Le point d'entrée est l'objet `document`, qui représente la page entière. Avec lui, on *cherche* un nœud puis on *lit* ou on *écrit* quelque chose dedans. Pour chercher, `document.querySelector(selector)` reçoit un sélecteur CSS, le même langage que dans la leçon 3 (`#title` est l'élément ayant cet `id`, `.status` ceux de cette classe, `tbody` ceux de cette balise), et renvoie **le premier** nœud qui correspond, ou **`null`** si aucun ne correspond. Son frère `document.querySelectorAll(selector)` renvoie **tous** ceux qui correspondent, dans une liste qu'on parcourt avec `for…of`. Pour écrire du texte dans un nœud, on l'assigne à sa propriété `textContent`.

Avant d'exécuter la figure 7.1, **prédis** : quel nombre le paragraphe va-t-il afficher, et que va dire l'en-tête quand le programme sera terminé ? La figure comporte un tableau de trois lignes écrit à la main :

```html
<!-- fig07_01.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 7.1 — Leer y escribir el documento</title>
</head>
<body>
  <main>
    <h1 id="title">Servicios</h1>
    <table>
      <tbody>
        <tr><td>Catálogo</td><td>Disponible</td></tr>
        <tr><td>Pagos</td><td>Disponible</td></tr>
        <tr><td>Inventario</td><td>Caído</td></tr>
      </tbody>
    </table>
    <p id="count"></p>
  </main>

  <script type="module">
    // Leer: ¿cuántas filas hay en el documento?
    const rows = document.querySelectorAll("tr");

    // Escribir: poner esa cuenta en el párrafo.
    const paragraph = document.querySelector("#count");
    paragraph.textContent = `El documento tiene ${rows.length} filas.`;

    // Escribir otra vez: cambiar el texto del título.
    document.querySelector("#title").textContent = "Servicios (leídos por JavaScript)";
  </script>
</body>
</html>
```

Ce qu'on voit dans la page (le texte qu'affiche Chrome, de haut en bas), qui se trouve dans le dépôt à [`programas/07-dom-eventos-estado/fig07_01.salida.txt`](https://github.com/HabilMX/curso-web/blob/main/programas/07-dom-eventos-estado/fig07_01.salida.txt) :

```text
Servicios (leídos por JavaScript)
Catálogo	Disponible
Pagos	Disponible
Inventario	Caído

El documento tiene 3 filas.
```

Si ta prédiction était « trois lignes », tu as vu juste, et remarque ce que cela démontre : `querySelectorAll("tr")` a compté les lignes du *corps*, et le tableau n'a pas d'en-tête de colonnes. S'il avait eu une ligne d'en-têtes, il y en aurait quatre. C'est le genre de détail qu'on apprend en comptant, pas en lisant.

Deux choses de plus sur cette figure. Le `<script type="module">` est placé *après* le contenu, mais peu importe où tu le mettrais : un module s'exécute toujours quand le document a déjà fini d'être lu, et cela évite l'erreur la plus fréquente du débutant, que tu verras dans la section « L'erreur que tu vas voir ». Et la propriété `textContent` est en **lecture et écriture** : `elemento.textContent` te donne le texte qu'il y a à l'intérieur, `elemento.textContent = "algo"` le remplace, en effaçant d'abord tout ce que contenait l'élément, y compris ses enfants.

**Dessiner à partir d'un tableau.** Pour dessiner une liste, on n'écrit pas le texte de la liste : on **crée des nœuds** et on les **accroche** à l'arbre. Ce sont trois étapes, et ce sont toujours les mêmes trois étapes :

1. `document.createElement("li")` crée un nouvel élément, libre dans la mémoire. On ne le voit pas encore, car il n'appartient pas à l'arbre de la page.
2. On lui donne son contenu : `elemento.textContent = "..."`, ou ses attributs et ses classes.
3. `contenedor.append(elemento)` l'accroche à l'arbre, à la fin des enfants du conteneur. À ce moment, il apparaît à l'écran.

La figure 7.2 est la version minimale de tout l'affichage du tableau de bord : un tableau avec trois des services de la leçon 6 et une boucle qui convertit chacun en élément. **Prédis** ce que dira la ligne d'« Inventario », celui qui n'a pas répondu.

```html
<!-- fig07_02.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 7.2 — Dibujar una lista desde un arreglo</title>
</head>
<body>
  <main>
    <h1>Servicios</h1>
    <ul id="list"></ul>
  </main>

  <script type="module">
    const services = [
      { id: "catalog", name: "Catálogo", status: "available", responseMs: 120 },
      { id: "payments", name: "Pagos", status: "available", responseMs: 480 },
      { id: "inventory", name: "Inventario", status: "down", responseMs: null },
    ];

    const list = document.querySelector("#list");

    for (const service of services) {
      const item = document.createElement("li");                      // 1. crear el nodo
      item.textContent = service.responseMs === null                  // 2. su texto
        ? `${service.name}: sin respuesta`
        : `${service.name}: ${service.responseMs} ms`;
      list.append(item);                                              // 3. colgarlo del árbol
    }
  </script>
</body>
</html>
```

```text
Servicios
Catálogo: 120 ms
Pagos: 480 ms
Inventario: sin respuesta
```

Observe ce qu'il n'y a *pas* dans le HTML : il n'y a aucun `<li>`. La liste est vide dans le fichier et l'Inspecteur la montre pleine. Et observe quelque chose qui change ta façon de penser : si demain le tableau a dix services, ou zéro, le code ne change pas. **L'affichage cesse de dépendre du nombre de données.** C'est l'avantage de dessiner à partir des données. Remarque aussi la ligne d'Inventario : le `null` de la leçon 6 n'apparaît pas comme « null ms », parce que le code décide quel texte correspond à l'absence de donnée. Cette décision appartient à l'affichage, pas aux données.

`append` accepte plusieurs arguments à la fois, et accepte aussi du texte brut, qu'il convertit en nœud de texte. `replaceChildren(...nodos)` est son parent pour *redessiner* : il vide le conteneur et place les nouveaux nœuds en une seule étape. Les trois points sont la décomposition que tu as vue dans la [Leçon 6](06-javascript-datos.md) (section 6.2.6) : ils répartissent les éléments d'un tableau comme s'ils étaient des arguments séparés. Les deux sont « Baseline widely available », c'est-à-dire qu'ils fonctionnent dans tous les navigateurs actuels depuis des années ; MDN documente [`append`](https://developer.mozilla.org/fr/docs/Web/API/Element/append) et [`replaceChildren`](https://developer.mozilla.org/fr/docs/Web/API/Element/replaceChildren) avec leur tableau de compatibilité.

**Une ligne du tableau de bord, décision par décision.** La ligne du tableau est la même idée avec plus de pièces, et chaque pièce a sa raison. Voici la fonction `createRow` de `js/view.js`, avec la petite fonction `label` qu'elle utilise :

```js
// Lista cerrada de estados que el panel conoce. Un valor que no esté aquí no llega a una clase.
const LABELS = { available: "Disponible", down: "Caído" };

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
```

Lis-la lentement, car chaque ligne répond à quelque chose que tu as déjà appris :

- **`th` avec `scope = "row"` pour le nom.** Dans la leçon 2, tu as appris que la première cellule de chaque ligne est l'*en-tête de la ligne* : un lecteur d'écran, en arrivant à « 480 ms », peut dire « Pagos, Tiempo de respuesta, 480 ms ». Si tu dessinais un `td` par paresse, le tableau aurait la même apparence et cesserait d'être compréhensible pour qui ne le voit pas.
- **Le badge utilise une liste fermée.** `LABELS` est un objet avec les deux états que connaît le tableau de bord, `available` et `down`, et le libellé affiché pour chacun. `Object.hasOwn(LABELS, service.status)` demande si l'état est l'un d'eux, et c'est seulement alors qu'on l'utilise comme partie du nom d'une classe : `status status-available` ou `status status-down`, les mêmes classes que la leçon 3 a peintes en vert et en rouge. Une donnée extérieure qui n'est pas dans la liste n'arrive pas dans la classe et s'affiche comme « Desconocido » (Inconnu), avec le badge sans couleur que la leçon 3 avait annoncé pour ce cas. ([`Object.hasOwn`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn) est la façon moderne de demander « cette clé appartient-elle à l'objet ? », et elle vaut mieux que `LABELS[status]` tout court, car un état appelé `"constructor"` trouverait la fonction de ce nom dont tous les objets héritent.)
- **« sin respuesta » pour le `null`.** Afficher « null ms » serait une grossièreté envers qui lit. Le `null` est une décision des données ; le traduire en quelque chose de lisible est le travail de l'affichage, et le texte est le même que celui que disait le tableau écrit à la main depuis la leçon 2.
- **Un vrai bouton par ligne.** Pas une cellule cliquable, pas un `div` : un `<button type="button">`. Un bouton reçoit le focus avec la touche Tab et s'active avec Entrée et avec la barre d'espace **sans que tu écrives une ligne** ; un `div` cliquable ne fait ni l'un ni l'autre, et le corriger à la main demande plus de code pour un moins bon résultat. La première règle d'ARIA le dit ainsi : s'il existe un élément natif ayant le comportement dont tu as besoin, utilise-le (le [guide des pratiques d'écriture WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/) la développe).
- **Le texte masqué « de Pagos ».** Cinq boutons qui disent tous « Ver detalle » (Voir le détail) sont cinq boutons indiscernables pour qui navigue à la voix ou avec un lecteur d'écran, qui peut demander la liste des contrôles de la page. Le `<span class="visually-hidden">` ajoute au nom accessible de chaque bouton celui du service : « Ver detalle de Pagos ». La classe le retire de la vue sans le retirer de l'arbre d'accessibilité, et elle vit dans `css/styles.css`.
- **`dataset.id`.** Les attributs qui commencent par `data-` sont un endroit que la norme réserve à tes propres données. `button.dataset.id = "payments"` écrit `data-id="payments"`. C'est l'`id` que la leçon 6 a séparé du nom : le nom est ce qui s'affiche et peut changer ; l'`id` est ce qui identifie le service. Plus tard, tu le reliras pour savoir *quel* service la personne a voulu voir. Un attribut `data-` stocke sa valeur sous forme de texte et le navigateur ne l'interprète pas, donc y écrire une donnée extérieure n'exécute rien.
- **`classList`, `aria-pressed` et `String`.** `row.classList.add("selected")` ajoute une classe à celles que l'élément a déjà sans effacer les autres (assigner `className`, en revanche, les remplace toutes). `aria-pressed` est un attribut d'accessibilité qui fait du bouton un *bouton à bascule* : un lecteur d'écran annonce s'il est enfoncé ou non, et la feuille de style l'utilise pour le marquer. Les attributs stockent toujours du texte, c'est pourquoi `String(isSelected)` convertit le booléen `true` ou `false` en texte `"true"` ou `"false"` avant de l'écrire.
- **`setAttribute` ne nettoie rien.** Il est sûr *pour ces deux attributs*, `data-id` et `aria-pressed`, parce que le navigateur ne les exécute jamais. Mais `setAttribute` écrit la valeur telle quelle dans l'attribut que tu indiques, et certains attributs sont bel et bien du code : `button.setAttribute("onclick", texto)` convertit ce texte en un programme qui s'exécute au clic, et `href` ou le `src` d'une `<iframe>` acceptent des adresses `javascript:`. MDN le signale dans la section sécurité de [`setAttribute`](https://developer.mozilla.org/fr/docs/Web/API/Element/setAttribute). La règle : une donnée extérieure ne va que dans des attributs qui ne s'exécutent pas, et jamais dans un attribut qui commence par `on`.

**La règle qui tient en une ligne : le texte extérieur entre avec `textContent`.** Jusqu'ici, tu as utilisé `textContent` sans que je te dise pourquoi. Il est temps de voir pourquoi cela compte, et la meilleure façon est de le casser exprès.

Il existe une autre propriété qui semble faire la même chose : `innerHTML`. Elle y ressemble beaucoup. Mais il y a une différence de fond : `textContent` traite ce que tu lui donnes **comme du texte** ; `innerHTML` le traite **comme du code HTML** et l'interprète, exactement comme quand le navigateur lit un fichier. Avec un nom comme « Catálogo », les deux donnent le même résultat. Avec un nom comme `<b>Catálogo</b>`, plus : l'une met des lettres en gras et l'autre affiche les signes `<b>` tels quels.

Cela ne serait pas grave si les données étaient toujours les tiennes. Mais le `revisor` existe pour montrer ce que *rapportent les autres* : le nom d'un service, un message d'erreur, une description. Aujourd'hui, ils sont dans ton fichier `js/services.js` ; dans la leçon 8, ils arriveront par le réseau, et dans la 10, une personne les écrira dans un formulaire. Dès qu'un texte est contrôlé par quelqu'un d'autre que toi, c'est une **donnée extérieure**, et il faut la traiter comme si elle pouvait être hostile.

Voici l'attaque, qui s'appelle **XSS** (*cross-site scripting*, script intersites) : une donnée extérieure qui contient du HTML avec du code actif, et une page qui l'interprète. C'est l'une des failles de sécurité les plus fréquentes du web, et [OWASP](https://top10.owasp.org/2025/A05_2025-Injection/) la classe parmi les injections dans sa liste de 2025. La figure 7.3 est la version **peu sûre** de l'affichage de la liste. **Prédis** avant de l'ouvrir : le troisième nom est `<img src="x" onerror="document.title = '...'">`, c'est-à-dire une image dont l'adresse (`x`) n'existe pas. Que crois-tu qu'on verra dans la liste, et qu'arrivera-t-il au titre de l'onglet ?

```html
<!-- fig07_03.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 7.3 — innerHTML con un dato de fuera (INSEGURO)</title>
</head>
<body>
  <main>
    <h1>Servicios (versión insegura, solo para ver el problema)</h1>
    <ul id="list"></ul>
  </main>

  <script type="module">
    // El tercer nombre lo escribió otra persona, no tú. Es un dato de fuera.
    const services = [
      { name: "Catálogo" },
      { name: "Pagos" },
      { name: `<img src="x" onerror="document.title = 'Se ejecutó código que venía en un dato'">` },
    ];

    const list = document.querySelector("#list");
    for (const service of services) {
      const item = document.createElement("li");
      item.innerHTML = service.name;   // <-- el navegador INTERPRETA el texto como HTML
      list.append(item);
    }
  </script>
</body>
</html>
```

```text
Lista visible:
• Catálogo
• Pagos
• 

Título de la pestaña (lo cambió el dato): Se ejecutó código que venía en un dato
```

La liste n'affiche rien à la troisième ligne, et **l'onglet a changé de titre**. Aucun programme ne disait cela : c'est une donnée qui l'a dit. Le navigateur a créé l'image, a essayé de charger `x`, n'y est pas parvenu, a déclenché l'événement d'erreur de l'image et a exécuté le code qui se trouvait dans l'attribut `onerror`. Aujourd'hui, ce code change un titre, ce qui est inoffensif. Mais c'est **du code quelconque**, avec les mêmes permissions que le tien : il peut lire ce que la page affiche, il peut demander des informations au serveur avec la session de la personne qui regarde, il peut changer ce qui s'affiche pour tromper. Celui qui a écrit la donnée n'a eu besoin ni d'entrer sur le serveur ni de connaître ton code ; il lui a suffi que ta page la dessine avec `innerHTML`.

Une confusion fréquente : « Si `innerHTML` bloque `<script>`, je suis à l'abri ». Il est vrai qu'un `<script>` inséré avec `innerHTML` **ne s'exécute pas**, et c'est pourquoi beaucoup de tutoriels disent que c'est sûr. Mais la figure 7.3 vient de démontrer qu'un `<script>` n'est pas nécessaire : un attribut d'événement sur une image suffit. MDN le signale dans sa page sur [`innerHTML`](https://developer.mozilla.org/fr/docs/Web/API/Element/innerHTML), avec ce même exemple de `onerror`.

La figure 7.4 est identique **à une ligne près** : elle utilise `textContent`.

```html
<!-- fig07_04.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 7.4 — textContent con un dato de fuera</title>
</head>
<body>
  <main>
    <h1>Servicios (versión segura)</h1>
    <ul id="list"></ul>
  </main>

  <script type="module">
    // El tercer nombre lo escribió otra persona, no tú. Es un dato de fuera.
    const services = [
      { name: "Catálogo" },
      { name: "Pagos" },
      { name: `<img src="x" onerror="document.title = 'Se ejecutó código que venía en un dato'">` },
    ];

    const list = document.querySelector("#list");
    for (const service of services) {
      const item = document.createElement("li");
      item.textContent = service.name;  // <-- el navegador lo trata SIEMPRE como texto
      list.append(item);
    }
  </script>
</body>
</html>
```

```text
Lista visible:
• Catálogo
• Pagos
• <img src="x" onerror="document.title = 'Se ejecutó código que venía en un dato'">

Título de la pestaña: Fig. 7.4 — textContent con un dato de fuera
```

La troisième ligne affiche maintenant le texte de l'attaque, complet et visible, et le titre de l'onglet reste celui que tu as écrit. L'image n'a jamais été créée : le navigateur n'a pas lu `<img` comme une balise, parce que `textContent` se moque de ce à quoi le texte ressemble. Dans l'Inspecteur, tu verras que le HTML a écrit `&lt;img…&gt;` : les signes ont été *échappés*, c'est-à-dire remplacés par leur représentation en texte.

Telle est la règle : **tout texte que tu n'as pas écrit toi-même entre dans le document avec `textContent`**. Et avec elle viennent d'autres règles de la même famille, qu'OWASP rassemble dans sa [fiche sur le XSS basé sur le DOM](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html) sous le nom de « destinations dangereuses » (*sinks*), les endroits où une donnée devient du code :

- `innerHTML`, `outerHTML` et `insertAdjacentHTML` : ils interprètent le HTML.
- `document.write` : la même chose, et de façon si maladroite qu'on ne l'enseigne plus.
- `eval(texto)` et `setTimeout("texto", …)` avec une chaîne : ils exécutent du texte comme un programme.
- Les attributs d'événement écrits dans le HTML (`onclick="..."`, `onerror="..."`) : c'est du code sous forme de texte.
- Assigner une donnée au `href` d'un lien (ou au `src` d'une `<iframe>`) sans vérifier d'où elle vient : une adresse qui commence par `javascript:` exécute du code quand on suit le lien ou qu'on charge le cadre. MDN explique que cela se produit aux endroits où l'on *navigue*, pas dans ceux qui ne font que télécharger une ressource, comme le `src` d'une image ([schéma `javascript:`](https://developer.mozilla.org/fr/docs/Web/URI/Reference/Schemes/javascript)). Dans le tableau de bord d'aujourd'hui, il n'y a pas de liens avec des données extérieures, mais dès qu'il y en aura un, l'adresse sera d'abord validée.

Quand `innerHTML` est-il acceptable ? Quand ce que tu lui donnes est un texte fixe que tu as écrit toi-même, sans une seule pièce qui vienne d'une donnée. Malgré tout, l'habitude saine est de ne pas l'avoir : une ligne avec `innerHTML` qui est sûre aujourd'hui devient, trois mois plus tard, une ligne peu sûre quand quelqu'un y colle une variable. Si tu ne l'utilises jamais, cette conversion ne peut pas se produire, et relire le code revient à chercher le mot et à vérifier qu'il n'y est pas. C'est pourquoi l'un des cinq critères avec lesquels tu sais que tu as terminé le cours est : *le texte qui vient de l'extérieur se dessine avec `textContent`, jamais avec `innerHTML`*.

> **Ce qui vient, et qu'on n'utilise pas encore.** Il existe deux mécanismes plus récents pour ce même problème. Le premier, ce sont les *Trusted Types* (types de confiance), qui font que le navigateur refuse d'accepter une chaîne de texte dans une destination dangereuse ; selon [web.dev](https://web.dev/articles/trusted-types), les principaux navigateurs ne le prennent en charge que depuis 2026, et c'est pourquoi il est encore « récent ». Le second est `Element.setHTML()`, avec l'API *Sanitizer*, qui nettoie le HTML avant de l'insérer, et que MDN marque encore comme « non Baseline ». Aucun des deux ne remplace l'habitude d'utiliser `textContent`, et ce cours ne les emploie pas dans le tableau de bord : il n'enseigne que ce qui fonctionne déjà dans tous les navigateurs. Dans la leçon 11, tu verras l'autre filet de sécurité qui, lui, est dans tous : la politique de sécurité du contenu (CSP), qui est une seconde couche et **ne remplace pas** la première.

### 7.2 Les événements : comment la page apprend que quelqu'un a fait quelque chose

**Un événement est un avis.** Quand quelqu'un appuie sur un bouton, bouge la souris, tape une touche ou qu'une image finit de se charger, le navigateur le note comme un **événement** et en avertit celui qui l'a demandé. Celui qui le demande, c'est ton code, et il le fait ainsi :

```js
element.addEventListener("click", handler);
```

Dit en français : « quand un `click` se produit sur cet élément, exécute cette fonction ». La fonction s'appelle un **écouteur** (*listener*) ou gestionnaire. Trois détails sur lesquels presque tous les débutants marchent :

1. **On passe la fonction, on ne l'appelle pas.** `addEventListener("click", onClick)` remet la fonction pour que le navigateur l'exécute quand le clic se produira. Si tu écris `onClick()` avec des parenthèses, tu l'exécutes *tout de suite*, une seule fois, et tu remets au navigateur ce que cet appel a renvoyé (le plus souvent `undefined`). Le clic ne fera rien et il n'y aura aucune erreur.
2. **Le navigateur remet à la fonction un objet avec les détails**, l'objet de l'événement, qui s'appelle par habitude `event`. Ses propriétés les plus utiles : `event.type` (quel type d'événement c'était), `event.target` (l'élément où il *s'est produit*) et `event.currentTarget` (l'élément où l'*écouteur est posé*). La figure 7.5 les utilise, avec [`localName`](https://developer.mozilla.org/fr/docs/Web/API/Element/localName), une propriété que possède tout élément et qui donne le nom de sa balise en minuscules : pour un `<button>`, le texte `"button"`. Elle sert à ce que la page dise *quelle sorte* d'élément a reçu l'événement.
3. **Le bon élément donne le clavier gratuitement.** Un bouton reçoit le clic avec la souris, avec le toucher à l'écran, avec Entrée et avec la barre d'espace ; tout cela arrive comme le même événement `click`. Si tu avais utilisé un `div`, tu aurais dû écrire toi-même la prise en charge du clavier.

**Prédis :** que dira le paragraphe après deux clics sur le bouton ?

```html
<!-- fig07_05.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 7.5 — Escuchar un clic</title>
  <style>
    /* Un blanco cómodo para el dedo o el mouse: WCAG 2.2 pide al menos 24 × 24 px; aquí mide 44. */
    button { min-height: 2.75rem; padding: 0.5rem 0.75rem; }
  </style>
</head>
<body>
  <main>
    <h1>Un botón y un contador</h1>
    <button type="button" id="counter">Contar un clic</button>
    <p id="result" role="status">Todavía no hay clics.</p>
  </main>

  <script type="module">
    const button = document.querySelector("#counter");
    const result = document.querySelector("#result");
    let clicks = 0;

    function onClick(event) {
      clicks += 1;
      result.textContent = `Clics: ${clicks}. Tipo de evento: ${event.type}. Lo recibió: <${event.currentTarget.localName}>.`;
    }

    button.addEventListener("click", onClick);   // pasa la función, NO la llama (sin paréntesis)
  </script>
</body>
</html>
```

```text
Tras dos clics:
Clics: 2. Tipo de evento: click. Lo recibió: <button>.
```

Deux observations qui te serviront dans le tableau de bord. La première : la variable `clicks` vit *en dehors* de la fonction et c'est pourquoi elle survit d'un clic au suivant ; garder « ce qui s'est passé jusqu'ici » en dehors de l'écouteur est le germe de ce qu'en 7.3 on appelle l'état. La seconde : le paragraphe a `role="status"`, ce qui en fait une **région live** : quand son contenu change, un lecteur d'écran l'annonce sans que la personne ait à aller le chercher. C'est la bonne façon d'avertir que « quelque chose a changé » sans déplacer le focus ; la règle d'or des régions live est qu'elles **existent dès le départ, vides ou avec leur texte initial**, et que seul leur contenu change.

**Les événements remontent.** Si tu cliques sur un bouton qui est dans une cellule, qui est dans une ligne, qui est dans le corps du tableau, à qui le clic est-il arrivé ? À tous. Le navigateur remet l'événement d'abord au bouton puis **le fait remonter** dans l'arbre : à la cellule, à la ligne, au corps, au tableau, au `body`, jusqu'à `document`. Cela s'appelle le **bouillonnement** (*bubbling*), et c'est décrit dans la [norme DOM](https://dom.spec.whatwg.org/#dispatching-events) et expliqué pas à pas dans [MDN](https://developer.mozilla.org/fr/docs/Learn_web_development/Core/Scripting/Event_bubbling). Pendant la remontée, `event.target` ne change pas (il reste l'élément le plus interne, celui où l'on a cliqué) et `event.currentTarget` change au fur et à mesure (c'est toujours l'élément dont l'écouteur est en train de s'exécuter).

Le bouillonnement permet une technique que tu vas utiliser dans presque tous les programmes avec des listes : la **délégation d'événements**. Au lieu de poser un écouteur sur chaque bouton, tu en poses **un seul** sur le conteneur, et quand l'événement remonte, tu demandes d'où il venait. Pourquoi est-ce mieux ici ?

- **Le tableau de bord redessine ses lignes** (tu le verras en 7.3). Les anciens boutons sont jetés et de nouveaux boutons sont créés ; un écouteur posé sur un ancien bouton part à la poubelle avec lui. Le conteneur, le `<tbody>`, n'est jamais jeté, et son écouteur reste.
- **Avec 6 lignes ou avec 600, le coût est le même :** un écouteur.
- **Les services qui arriveront plus tard** (dans la leçon 8, le tableau se remplit après une requête réseau) sont couverts sans rien faire.

Il y a un piège, et il s'appelle l'icône dans le bouton. Si le bouton contient un autre élément, comme un `<span>` avec un symbole, le clic peut tomber sur le `span`, et alors `event.target` est le `span`, pas le bouton. Un code naïf qui demanderait `if (event.target === button)` cessera de fonctionner dès que le designer ajoutera une icône. La solution est `event.target.closest("button[data-name]")` : **`closest`** remonte depuis l'élément par ses ancêtres et renvoie le premier qui correspond au sélecteur (en commençant par l'élément lui-même), ou `null` s'il n'y en a aucun ([MDN : `closest`](https://developer.mozilla.org/fr/docs/Web/API/Element/closest)). La figure 7.6 le démontre en cliquant exprès sur l'icône.

```html
<!-- fig07_06.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 7.6 — Un solo oyente para muchos botones</title>
  <style>
    /* Un blanco cómodo para el dedo o el mouse: WCAG 2.2 pide al menos 24 × 24 px; aquí mide 44. */
    button { min-height: 2.75rem; padding: 0.5rem 0.75rem; }
  </style>
</head>
<body>
  <main>
    <h1>Delegación de eventos</h1>
    <ul id="list"></ul>
    <p id="result" role="status">Ningún botón presionado.</p>
  </main>

  <script type="module">
    const names = ["Catálogo", "Pagos", "Inventario"];
    const list = document.querySelector("#list");
    const result = document.querySelector("#result");

    for (const name of names) {
      const item = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.name = name;                     // guarda el nombre en data-name
      const icon = document.createElement("span");    // un elemento DENTRO del botón
      icon.textContent = "▶ ";
      button.append(icon, `Ver ${name}`);
      item.append(button);
      list.append(item);
    }

    // UN solo oyente, en el contenedor. Los clics de todos los botones suben hasta aquí.
    list.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-name]");
      if (button === null) return;                    // el clic no fue en un botón
      result.textContent = `Presionaste: ${button.dataset.name} (target: <${event.target.localName}>)`;
    });
  </script>
</body>
</html>
```

```text
Tras hacer clic sobre el ícono del botón «Ver Pagos»:
Presionaste: Pagos (target: <span>)
```

Regarde la sortie : `target` était le `<span>`, mais `closest` a trouvé le bouton et son `dataset.name` a dit « Pagos ». Et regarde la ligne `if (button === null) return;` : l'écouteur est posé sur toute la liste, donc il reçoit aussi les clics qui tombent dans l'espace entre les boutons, et il faut les ignorer. C'est la première instruction de tout écouteur délégué.

Une limite qu'il est bon de connaître : tous les événements ne remontent pas. `focus` et `blur`, par exemple, ne bouillonnent pas (leurs parents `focusin` et `focusout`, si). Pour les clics et les touches, qui sont ceux que tu utiliseras dans ce cours, la délégation fonctionne sans astuce.

### 7.3 L'état, et la séparation qui évite l'enchevêtrement

**Ce qu'est l'état.** L'**état** d'une application est **ce dont elle se souvient en ce moment**. Dans le tableau de bord, ce sont trois choses : la liste des services, le fait qu'elle soit triée ou non par temps de réponse, et le service sélectionné (ou aucun). Remarque que je n'ai pas dit « ce qu'on voit » : ce qu'on voit est une *conséquence* de l'état. L'idée qui met de l'ordre dans tout le reste est que **l'écran est une fonction de l'état** : on écrit une fonction `render(state)` qui, étant donné l'état, place dans le document ce qui correspond, et chaque fois que quelque chose change, on change l'état et on rappelle `render`.

L'enchevêtrement que cette idée évite ressemble à ceci. Un programmeur débutant résout le « tri » avec un `if (button.textContent === "Ordenar por tiempo")` : il demande *au document* dans quelle situation se trouve le tableau de bord. Cela fonctionne jusqu'à ce que quelqu'un change le texte du bouton, ou le traduise, ou ajoute un autre bouton qui a lui aussi besoin de savoir si c'est trié. Alors la vérité vit à trois endroits (le tableau, le texte du bouton, l'ordre des lignes à l'écran) et il faut les maintenir d'accord à la main. C'est le même problème des deux copies par lequel a commencé la leçon, sauf que cette fois dans le code lui-même. Avec un état explicite, la vérité vit dans **un** objet, et tout le reste se calcule.

**Trois fichiers, trois responsabilités.** Le tableau de bord se découpe ainsi :

| Fichier | Responsabilité | Touche-t-il au document ? |
|---|---|---|
| `js/state.js` | Ce dont se souvient le tableau de bord et les seules façons de le modifier | Non |
| `js/view.js` | Dessine un état dans le document | Oui, seulement pour écrire |
| `js/main.js` | Assemble les pièces : écoute les événements, change l'état, demande de dessiner | Oui, pour écouter |

Les événements, l'affichage et tout ce qui *fait quelque chose au monde* s'appellent des **effets** : on les sépare de l'état parce que ce sont eux qui sont difficiles à tester et à raisonner. L'état, en revanche, ce sont des objets et des fonctions ordinaires, que tu peux vérifier sans ouvrir de page. Voici `js/state.js` en entier :

```js
// panel/js/state.js
// El estado del panel y las únicas formas de cambiarlo.
// No toca el documento: por eso se puede probar sin pantalla.

export function createState(services) {
  return {
    services,           // los datos
    sortByTime: false,  // false = en el orden original; true = del más rápido al más lento
    selected: null,     // el id del servicio elegido, o null
  };
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

Arrête-toi sur `visible`. Elle renvoie **ce qui doit s'afficher** et le calcule à partir de l'état à chaque fois : si `sortByTime` est vrai, elle trie ; sinon, elle renvoie la liste telle qu'elle est arrivée. Deux détails comptent. Le premier est `toSorted`, que tu as rencontré dans la leçon 6 : elle renvoie une **copie** triée et laisse intact le tableau des données. Si tu utilisais `sort`, qui trie le tableau sur lequel on l'appelle, tu perdrais pour toujours l'ordre d'arrivée, et le bouton « Ordenar » n'aurait plus rien à quoi revenir. Le second est `a.responseMs ?? Infinity` : l'opérateur `??` remplace un `null` par la valeur de droite, de sorte qu'un service sans mesure est considéré comme infiniment lent et va à la fin. (`??` ne réagit qu'à `null` et `undefined` ; `||`, en revanche, traiterait un zéro comme une « absence ». Un temps de zéro serait suspect, mais ce n'est pas la même chose que ne pas avoir de mesure.)

**L'avantage de séparer se voit dans un test sans écran.** Comme `js/state.js` ne touche pas au document, on peut le vérifier avec une page presque vide, `state-test.html`, qui importe les données et le module de l'état et vérifie six faits. Chaque vérification tient en une ligne : une description et une condition qui doit être vraie.

```html
<!-- panel/state-test.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Prueba del estado (sin dibujar nada del panel)</title>
</head>
<body>
  <main>
    <h1>Prueba del estado</h1>
    <pre id="output"></pre>
  </main>
  <script type="module">
    import { services } from "./js/services.js";
    import { createState, toggleSort, select, visible } from "./js/state.js";

    const lines = [];
    function check(description, condition) {
      lines.push(`${condition ? "ok    " : "FALLA "} ${description}`);
    }
    const names = (list) => list.map((service) => service.name).join(", ");

    const state = createState(services);
    check("al inicio se ve el orden original", names(visible(state)) === "Catálogo, Pagos, Inventario, Notificaciones, Búsqueda");

    toggleSort(state);
    check("ordenado: del más rápido al más lento", names(visible(state)) === "Catálogo, Notificaciones, Pagos, Búsqueda, Inventario");
    check("ordenado: el que no tiene medida va al final (Inventario)", visible(state).at(-1).name === "Inventario");
    check("ordenar no cambia el arreglo original", names(state.services) === "Catálogo, Pagos, Inventario, Notificaciones, Búsqueda");

    select(state, "payments");
    check("seleccionar guarda el id", state.selected === "payments");
    select(state, "payments");
    check("seleccionar el mismo otra vez lo deselecciona", state.selected === null);

    document.querySelector("#output").textContent = lines.join("\n");
  </script>
</body>
</html>
```

Ouvre-la avec ton serveur à `…/07-dom-eventos-estado/panel/state-test.html` :

```text
Prueba del estado
ok     al inicio se ve el orden original
ok     ordenado: del más rápido al más lento
ok     ordenado: el que no tiene medida va al final (Inventario)
ok     ordenar no cambia el arreglo original
ok     seleccionar guarda el id
ok     seleccionar el mismo otra vez lo deselecciona
```

Si tu modifies `visible` pour qu'elle utilise `sort` au lieu de `toSorted`, la vérification `ordenar no cambia el arreglo original` (trier ne change pas le tableau d'origine) passe à `FALLA` (ÉCHEC). Fais-le, regarde-la en rouge, et annule la modification : ainsi tu sais que le test protège vraiment quelque chose. Remarque pourquoi la deuxième vérification regarde l'ordre complet et pas seulement le premier : Catálogo était déjà le plus rapide et le premier de la liste, donc « le premier est Catálogo » serait vrai même si le tri ne faisait rien. Un test qui ne peut pas échouer ne prouve rien.

**L'affichage.** Avec l'état séparé, `render` devient court et répétitif, ce qui est exactement ce qu'on veut. Voici `js/view.js` en entier ; tu connais déjà `createRow` et `label`, et les nouveautés sont `describe`, qui assemble la phrase du détail (`toLowerCase()` renvoie le texte en minuscules : « Disponible » devient « disponible » au milieu d'une phrase), et la fonction `render` à la fin :

```js
// panel/js/view.js
// Dibuja el estado en el documento. Todo texto de los datos entra con textContent.
import { summarize } from "./stats.js";
import { visible, selectedService } from "./state.js";

// Lista cerrada de estados que el panel conoce. Un valor que no esté aquí no llega a una clase.
const LABELS = { available: "Disponible", down: "Caído" };

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

// elements = { total, available, down, average, body, detail, sortButton }
export function render(state, elements) {
  const { services } = state;
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

Regarde les premières lignes de `render` : le récapitulatif que tu avais écrit à la main dans la leçon 2, c'est désormais `summarize`, la fonction de la leçon 6, qui l'écrit dans les quatre `<dd>` du `<dl>`. Les chiffres sont les mêmes ; la différence est que tu ne les additionnes plus toi-même, et que le jour où un service changera, ils changeront tout seuls.

Observe que `render` reçoit l'état et un objet avec les éléments du document dont elle a besoin (`elements`). Elle ne les cherche pas : on les lui passe. Ainsi `js/view.js` ne dépend pas de la façon dont s'appelle un `id` dans ton HTML, et le même code sert à tester avec de faux éléments.

Observe aussi combien de texte entre dans le document, et par où : le récapitulatif, le nom, l'état, le temps et le détail. **Tous entrent avec `textContent`.** Le `revisor` n'utilise pas `innerHTML` une seule fois. Les nombres et l'état d'un service sont des données extérieures même si aujourd'hui elles vivent dans ton fichier.

**Le coût de tout redessiner.** `replaceChildren` écarte toutes les lignes et en place de nouvelles. C'est simple, c'est assez rapide pour cinq lignes ou pour cinq cents, et cela a un effet que tu dois comprendre parce qu'il touche qui utilise le clavier : **le bouton qui avait le focus disparaît**. Si une personne navigue avec Tab jusqu'à « Ver detalle de Pagos » et appuie sur Entrée, le tableau de bord se redessine, l'ancien bouton est jeté, et le focus tombe sur le `body` : la personne doit reparcourir toute la page depuis le haut pour continuer. C'est un défaut d'accessibilité qu'on ne voit pas à la souris, et c'est pourquoi personne ne le remarque jusqu'à ce que quelqu'un le signale. L'essayer au clavier, comme le demande le critère de clôture du cours, est ce qui le détecte.

La solution est dans `main.js`. Avant de changer l'état, on note l'`id` du service dont le bouton a le focus (`document.activeElement` est l'élément qui a le focus, et son `dataset.id` est le service) ; on change l'état ; on dessine ; et on rend le focus au nouveau bouton qui a le même `data-id`. Pour construire le sélecteur, on utilise `CSS.escape`, qui protège l'`id` des caractères qui ont une signification dans un sélecteur, comme les guillemets ou les crochets : les `id` arrivent avec les données, à partir de la leçon 8 ils arriveront par le réseau, et un `id` comme `pagos"norte` casserait un sélecteur construit à la main ([MDN : `CSS.escape`](https://developer.mozilla.org/en-US/docs/Web/API/CSS/escape_static)). Voici `js/main.js` en entier. Il remplace celui de la leçon 6, qui n'écrivait que dans la console :

```js
// panel/js/main.js
// Junta las piezas: crea el estado, escucha eventos y vuelve a dibujar.
import { services } from "./services.js";
import { createState, toggleSort, select } from "./state.js";
import { render } from "./view.js";

const elements = {
  total: document.querySelector("#summary-total"),
  available: document.querySelector("#summary-available"),
  down: document.querySelector("#summary-down"),
  average: document.querySelector("#summary-average"),
  body: document.querySelector("#services-body"),
  detail: document.querySelector("#detail"),
  sortButton: document.querySelector("#sort"),
};

const state = createState(services);

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

// Delegación: un solo oyente en el <tbody> atiende los botones de todas las filas.
elements.body.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-id]");
  if (button === null) return;
  update(() => select(state, button.dataset.id));
});

render(state, elements);
```

Et le HTML. C'est l'`index.html` que tu avais, avec de petits changements, et aucun ne change ce qu'il signifie : les quatre `<dd>` du récapitulatif perdent leurs chiffres écrits à la main et gagnent un `id` ; le `<tbody>` perd ses cinq lignes et gagne le sien, `services-body` ; le tableau gagne une quatrième colonne, « Acción » (Action), et l'en-tête de celle des temps, la classe `number` ; la barre de contrôles gagne le bouton « Ordenar por tiempo de respuesta » (Trier par temps de réponse), avec son `aria-pressed` ; et sous le tableau apparaît `#detail`, une région live vide. Le champ de recherche et les boutons radio sont toujours là sans rien faire (la leçon 10 les branche), comme « Revisar ahora » (la leçon 8 le branche). Et la « Última revisión » (Dernière vérification) de l'en-tête reste écrite à la main : elle deviendra vraie quand les données arriveront pour de bon, dans la leçon 8.

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
    <p>Última revisión:
      <time datetime="2026-10-07T10:30:00-06:00">7 de octubre de 2026, 10:30</time>
    </p>
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

        <p><button type="button">Revisar ahora</button></p>
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
    <p>Datos de ejemplo escritos a mano.</p>
  </footer>
</body>
</html>
```

Enfin, la feuille. `css/styles.css` est celle de la leçon 5 avec un changement et un nouveau bloc. Le changement : la règle de la leçon 3 qui alignait les temps à droite visait `th:last-child, td:last-child`, la dernière cellule de chaque ligne. Avec la colonne « Acción », la dernière cellule n'est plus celle des temps, donc la règle vise désormais une classe, `.number`, que `createRow` place sur la cellule du temps et le HTML sur son en-tête. Un sélecteur qui dépend de la position casse dès que quelqu'un ajoute une colonne ; un sélecteur nommé, non. Le nouveau bloc va à la fin du fichier et **rouvre** la couche `components` : une couche peut être ouverte autant de fois qu'il le faut, et ce qu'on ajoute s'ajoute à ce qu'elle avait déjà, dans l'ordre.

```css
@layer components {
  /* ---- Lección 7: la tabla que se dibuja desde los datos ---- */
  :root {
    --color-selected: #dbe9f8;
  }

  /* La fila del servicio elegido. */
  tr.selected {
    background: var(--color-selected);
  }

  /* Un botón que está «presionado» (aria-pressed="true") se distingue de los demás. */
  button[aria-pressed="true"] {
    background: var(--color-text);
  }

  /* Fuera de la vista, pero dentro del árbol de accesibilidad: lo lee un lector de pantalla. */
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  /* Un elemento con position: absolute se coloca respecto de su ancestro posicionado más
     cercano. Sin esta regla, el texto oculto de los botones escapa de la caja que se desplaza
     y ensancha la página entera a 320 px. */
  .table-scroll {
    position: relative;
  }
}
```

La nouvelle couleur est déclarée comme variable dans `:root`, comme le demande la leçon 3 : le reste de la feuille n'écrit pas de couleurs isolées. Et la dernière règle a une histoire. En essayant le tableau de bord à 320 pixels sans elle, la page s'est remise à déborder : elle mesurait 498 px de large. La coupable n'était pas le tableau, qui reste dans sa boîte, mais le texte masqué des boutons. Un élément avec `position: absolute` se place par rapport à son ancêtre *positionné* le plus proche, et s'il n'y en a aucun, par rapport à la page entière ; il s'échappait ainsi de la boîte qui défile et étirait le document. Avec `position: relative` sur `.table-scroll`, la boîte devient cet ancêtre, le texte masqué reste à l'intérieur et la mesure revient à 320. C'est le genre de défaut que seul trouve qui mesure à 320 pixels après chaque modification, et pas seulement dans la leçon de la disposition.

**Fais le test complet.** Ouvre le tableau de bord. Le récapitulatif doit dire 5 services vérifiés, 4 sur 5 disponibles, 1 en panne et 465 ms de réponse moyenne : les chiffres que tu avais écrits à la main dans la leçon 2, calculés maintenant par les fonctions de la leçon 6 et écrits par celles de cette leçon. Clique sur « Ordenar por tiempo de respuesta » : « Notificaciones » monte à la deuxième place, derrière « Catálogo », qui était déjà le plus rapide, et « Inventario », qui n'a pas répondu, va en dernier. Maintenant **sans toucher à la souris** : appuie sur Tab jusqu'à arriver à un bouton « Ver detalle », appuie sur Entrée et vérifie que le détail apparaît en dessous et que le focus reste sur ce même bouton. C'est le comportement que cette leçon protège.

**Une dernière vérification de sécurité.** Ajoute à `js/services.js` un service, avec son `id`, dont le `name` soit `<img src="x" onerror="document.title = 'hackeado'">`, recharge et observe que le tableau affiche ce texte, sans plus, et que le titre de l'onglet ne change pas. C'est la différence entre un tableau de bord qui dessine des données et un qui les exécute. Retire la ligne en terminant.

## L'erreur que tu vas voir

L'erreur la plus fréquente de qui débute avec le DOM est d'écrire le programme **avant** que n'existe l'élément qu'il cherche. La figure 7.7 la provoque exprès, avec un `<script>` ordinaire (pas un module) dans le `<head>` :

```html
<!-- fig07_07.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 7.7 — El script corre antes que el documento (ERROR A PROPÓSITO)</title>
  <!-- Un script CLÁSICO en el <head>, sin defer: se ejecuta en cuanto el navegador lo lee. -->
  <script>
    document.querySelector("#message").textContent = "Hola";
  </script>
</head>
<body>
  <main>
    <p id="message">Esperando…</p>
  </main>
</body>
</html>
```

Ouvre-la, ouvre la console avec `F12` et tu verras ceci :

```text
Consola de Chrome:
Uncaught TypeError: Cannot set properties of null (setting 'textContent')

Consola de Firefox:
TypeError: document.querySelector(...) is null

La página se queda con «Esperando…».
```

Le message dit, traduit : « Impossible d'écrire la propriété `textContent` de `null` ». C'est une chaîne de causes :

1. Un `<script>` ordinaire s'exécute **à l'instant où le navigateur le lit**. Comme il est dans le `<head>`, le navigateur n'a pas encore construit le `<body>`.
2. `document.querySelector("#message")` cherche un élément qui n'existe pas encore et renvoie `null`, qui est la réponse « je n'ai rien trouvé ».
3. `null.textContent = "Hola"` est une opération impossible, parce que `null` n'a pas de propriétés. JavaScript s'arrête là.

Il y a trois façons de le corriger, et la meilleure est celle que tu utilises déjà : **`<script type="module">`**, qui est différé tout seul, c'est-à-dire qu'il s'exécute quand le document a déjà été lu ([MDN : l'élément `script`](https://developer.mozilla.org/fr/docs/Web/HTML/Reference/Elements/script)). Les autres consistent à ajouter `defer` à un script ordinaire, ou à placer le script à la fin du `<body>`. Préfère le module : il donne en plus une portée propre à tes variables (elles ne salissent pas l'espace global) et active le mode strict sans que tu le demandes.

Quand le message est le même mais que le script *est* bien dans un module, la cause est autre : un sélecteur mal écrit (`#mesage` au lieu de `#message`) ou une recherche dans la mauvaise page. **Lis le message de droite à gauche** : quel appel a renvoyé `null` ? Mets `console.log(document.querySelector("#message"))` juste avant la ligne qui échoue ; s'il affiche `null`, le problème est le sélecteur ou le moment, pas ce que tu fais ensuite avec.

## Ce qui se fait de travers

- **Écrire une donnée extérieure avec `innerHTML`.** Le coût est l'attaque que tu as vue dans la figure 7.3 : qui contrôle un texte contrôle ta page. On le corrige avec `textContent` et rien d'autre ; échapper à la main les signes `<` et `>` est la recette de toutes les failles qui ont été corrigées une à une pendant vingt ans.
- **Laisser un `onclick="..."` dans le HTML.** C'est du code écrit dans un attribut : il mélange la structure avec le comportement, ne peut viser que des fonctions globales (et les modules n'en ont pas) et, comme tu le verras dans la leçon 11, une politique de sécurité stricte le bloque entièrement. On écrit `addEventListener` dans le JavaScript.
- **Un `div` ou un `span` avec un clic au lieu d'un `button`.** Il a la même apparence et on ne l'atteint pas avec Tab ni ne l'active avec Entrée. Le corriger exige `tabindex`, un `role` et deux gestionnaires de clavier, et le résultat reste moins bon que le bouton natif.
- **Demander au document quel est l'état.** `if (boton.textContent === …)` fait de l'écran la source de la vérité. Les deux copies se contredisent dès que le texte change. La vérité vit dans l'objet d'état.
- **Un nouvel écouteur à chaque affichage, sur un élément qui n'est pas jeté.** Si dans `render` tu écrivais `elements.body.addEventListener(...)`, chaque fois qu'on redessinerait, **un autre** écouteur s'ajouterait au même `<tbody>`, et au deuxième clic le détail serait sélectionné puis désélectionné deux fois. Les écouteurs s'enregistrent **une fois**, dans `main.js`, pas dans l'affichage.
- **Modifier le tableau d'origine en triant.** `services.sort(...)` change le tableau des données, et l'ordre d'origine est perdu. On utilise `toSorted`, qui renvoie une copie.
- **Lire des mesures du document pendant qu'on l'écrit.** Ajouter les lignes une par une n'est pas, en soi, coûteux : le navigateur attend que ton code termine et calcule la position de tout en une seule fois avant de peindre. Ce qui coûte, c'est d'intercaler des lectures de mesures (`offsetHeight`, `getBoundingClientRect()`) entre une écriture et une autre, car chaque lecture l'oblige à recalculer à cet instant ; web.dev appelle cela le [*layout thrashing*](https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing). Dans le tableau de bord, on construit d'abord toutes les lignes et on les remet ensemble avec `replaceChildren(...filas)` pour une autre raison : en une seule étape, on retire les anciennes lignes et on place les nouvelles, sans états intermédiaires à moitié dessinés.
- **Construire un sélecteur à la main avec une donnée.** `querySelector('[data-id="' + id + '"]')` casse avec un guillemet dans l'`id`. `CSS.escape` existe pour cela.
- **Mettre une donnée extérieure comme nom de classe sans la vérifier.** `row.className = service.status` laisse la donnée décider quels styles s'appliquent. On compare à une liste fermée, comme le fait `createRow`.

## Exercices

### Exercice 1 — Casse le tableau de bord exprès

Dans `js/view.js`, modifie la ligne qui écrit le nom du service pour qu'elle utilise `innerHTML` au lieu de `textContent`. Ensuite, ajoute à `js/services.js` un service dont le `name` soit `<img src="x" onerror="document.title = 'hackeado'">`. Avant de recharger, écris dans ton journal de bord ce que tu crois qu'on verra dans la ligne et dans l'onglet. Recharge, compare, puis annule les deux modifications. Réponds : quels autres textes du tableau de bord, en plus du nom, seraient un chemin pour la même attaque s'ils utilisaient `innerHTML` ?

### Exercice 2 — Le plus lent, dans le récapitulatif

Ajoute au récapitulatif une cinquième paire : « Más lento » (Le plus lent), avec le nom et le temps du service disponible qui met le plus de temps à répondre, par exemple « Búsqueda (950 ms) ». Si aucun service n'a répondu, elle doit dire « sin datos » (sans données). Décide, et justifie en une phrase, dans quel fichier va chaque modification : le calcul, l'emplacement dans la page, la façon de le trouver et le texte. Faut-il toucher à `js/state.js` ?

### Exercice 3 — Échap retire la sélection

Fais en sorte que, en appuyant sur la touche Échap, la sélection du service soit retirée, quel que soit l'endroit où se trouve le focus. Indice : l'événement s'appelle `keydown`, `evento.key` dit quelle touche c'était, et on l'écoute sur `document`. Ta modification doit toucher `js/state.js` et `js/main.js`, et **pas** `js/view.js`. Vérifie au clavier que, après Échap, le focus reste sur le bouton où il se trouvait.

## Solutions

### Solution 1

Dans `createRow`, la ligne `nameCell.textContent = service.name;` devient `nameCell.innerHTML = service.name;`. Au rechargement, la ligne du service hostile n'affiche pas le nom (l'image ne se charge pas et ne laisse aucun texte) et le titre de l'onglet devient « hackeado ». Une fois la ligne restaurée, la ligne affiche le texte complet de l'attaque et le titre ne bouge pas.

Réponse à la question : l'**état** (`service.status` passe par la liste fermée, donc ce n'est pas un chemin, mais il le serait si on l'écrivait avec `innerHTML`), le **temps** (`${service.responseMs} ms`), le **récapitulatif** et le **détail** : toute donnée qui vient de l'extérieur et s'écrit avec `innerHTML` est un chemin. Un nombre n'est pas non plus à l'abri dès que la donnée arrive par le réseau : rien ne garantit que `responseMs` soit un nombre et non un texte contenant du HTML. C'est pourquoi la règle ne distingue pas entre « données dangereuses » et « données inoffensives » : **aucune n'entre avec `innerHTML`**.

### Solution 2

Le calcul est une question sur les données et va avec les autres calculs, dans `js/stats.js` ; l'emplacement dans la page est une paire de plus du `<dl>`, dans `index.html` ; trouver cet emplacement est le travail de `js/main.js`, qui est celui qui connaît les `id` ; et écrire le texte relève de l'affichage, donc cela va dans `js/view.js`. `js/state.js` ne change pas, parce que le plus lent se calcule à partir de la liste et n'est pas quelque chose dont le tableau de bord doit se souvenir.

```js
// js/stats.js — al final del archivo
export function slowestService(list) {
  return list
    .filter((service) => service.status === "available")
    .toSorted((a, b) => b.responseMs - a.responseMs)[0] ?? null;
}
```

C'est la même idée que `slowest` de l'Exercice 2 de la leçon 6, mais elle renvoie le service entier et non son nom, parce que le texte a besoin des deux données. Avec une liste sans service disponible, `[0]` donne `undefined` et `?? null` le convertit en `null`, qui est la façon du cours de dire « il n'y a pas de donnée ». Dans `index.html`, une paire de plus à la fin du `<dl>` :

```html
<div>
  <dt>Más lento</dt>
  <dd id="summary-slowest"></dd>
</div>
```

Dans `js/main.js`, `slowest: document.querySelector("#summary-slowest"),` à l'intérieur de l'objet `elements`. Et dans `js/view.js`, on l'importe avec `summarize` et on l'écrit dans `render`, après la moyenne :

```js
import { summarize, slowestService } from "./stats.js";
// …
  const slowest = slowestService(services);
  elements.slowest.textContent = slowest === null ? "sin datos" : `${slowest.name} (${slowest.responseMs} ms)`;
```

Le récapitulatif dit « Más lento: Búsqueda (950 ms) ». Et comme le `<dl>` de la leçon 5 compte lui-même ses colonnes, la cinquième paire se place toute seule, sans toucher au CSS.

### Solution 3

Une nouvelle fonction dans `js/state.js` (la seule façon de changer l'état est une fonction de l'état) :

```js
export function clearSelection(state) {
  state.selected = null;
}
```

Dans `js/main.js`, on ajoute `clearSelection` à l'`import` et, avant la dernière ligne (`render(state, elements);`), l'écouteur :

```js
// Escape quita la selección, esté donde esté el foco.
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") update(() => clearSelection(state));
});
```

On utilise `update` et non `render` tout court pour que le focus revienne au bouton qui l'avait. `js/view.js` ne change pas : il savait déjà dessiner le cas « sans sélection ».

## Comment savoir que j'ai réussi

- [ ] Avec le dossier `programas/` du dépôt servi sur ton ordinateur, en ouvrant `07-dom-eventos-estado/fig07_03.html`, le titre de l'onglet devient « Se ejecutó código que venía en un dato » (Du code venu dans une donnée s'est exécuté). Dans `fig07_04.html`, non.
- [ ] Dans `07-dom-eventos-estado/panel/`, le récapitulatif dit 5, 4 sur 5, 1 et 465 ms, et aucun de ces chiffres n'est écrit dans le HTML.
- [ ] Le `<tbody id="services-body">` de ton `index.html` n'a aucune ligne écrite à la main, et l'Inspecteur en montre cinq.
- [ ] Au clavier seulement : Tab arrive à « Ver detalle de Pagos », Entrée affiche « Pagos: disponible, responde en 480 ms. » et le focus reste sur ce bouton.
- [ ] `state-test.html` affiche six lignes qui commencent par `ok`.
- [ ] À 320 px de large, il n'y a pas de barre de défilement horizontale : dans la console, `document.documentElement.scrollWidth <= document.documentElement.clientWidth` renvoie `true`.
- [ ] La console du navigateur n'affiche aucune erreur dans le tableau de bord.
- [ ] Tu cherches le mot `innerHTML` dans tes fichiers `.js` et il n'apparaît pas.

**Révision des leçons précédentes** (réponds-y sans regarder, puis vérifie) :

1. Dans la leçon 2 : pourquoi un `<button>` vaut-il mieux qu'un `<div>` avec un clic ?
2. Dans les leçons 4 et 5 : que fait `flex-wrap` et quand vaut-il mieux qu'une requête `@media` ?
3. Dans la leçon 6 : pourquoi un service en panne a-t-il `responseMs: null` et non zéro ?

## Pour aller plus loin

- [MDN — Introduction au DOM](https://developer.mozilla.org/fr/docs/Web/API/Document_Object_Model/Introduction) — ce qu'est l'arbre du document et comment on le parcourt ; consulté le 7 octobre 2026.
- [MDN — Bouillonnement des événements](https://developer.mozilla.org/fr/docs/Learn_web_development/Core/Scripting/Event_bubbling) — `target`, `currentTarget` et la délégation expliqués pas à pas ; consulté le 7 octobre 2026.
- [OWASP — Prévention du XSS basé sur le DOM](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html) — les destinations dangereuses et pourquoi `textContent` est la façon sûre ; consulté le 7 octobre 2026.
- [MDN — `Element.innerHTML`](https://developer.mozilla.org/fr/docs/Web/API/Element/innerHTML) — l'avertissement de sécurité avec l'exemple de `onerror` ; consulté le 7 octobre 2026.
