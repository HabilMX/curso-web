# Leçon 10 — Formulaires et validation

**Durée :** deux sessions d'environ 90 min. Une répartition qui marche : la première, « Le pourquoi avant le comment » et de 10.1 à 10.4 (ce que le navigateur valide déjà, `validity` et `setCustomValidity`, `:user-invalid`, et l'erreur écrite là où elle se lit), avec ses figures ouvertes dans le navigateur ; la seconde, 10.5 en entier, qui monte le tableau de bord en sept étapes dont chacune est vérifiée avant la suivante, puis « L'erreur que tu vas voir » et les exercices. Chaque session se termine par quelque chose que tu peux ouvrir et essayer.

**Ce que tu construis :** le formulaire pour ajouter des services au `revisor` et les filtres pour chercher parmi eux

**Ce que tu apprends :** la validation que le navigateur apporte déjà, `:user-invalid`, et comment formuler une erreur pour qu'un lecteur d'écran l'annonce

## À la fin, tu seras capable de

- Choisir le `type` d'un champ et les attributs (`required`, `minlength`, `pattern`, `min`, `max`, `step`) qui font que le navigateur valide sans une ligne de JavaScript.
- Lire quelle règle un champ enfreint avec `validity`, et écrire une règle à toi avec `setCustomValidity` sans laisser le champ invalide pour toujours.
- Expliquer la différence entre `:invalid` et `:user-invalid`, et pourquoi un formulaire ne doit pas s'ouvrir en rouge.
- Montrer une erreur sous forme de texte dans la page, associée à son champ avec `aria-describedby` et `aria-invalid`, de façon qu'un lecteur d'écran l'annonce.
- Écrire un filtre comme fonction pure et le brancher sur un champ de recherche et sur un sélecteur.
- Dire, avec un exemple, pourquoi valider dans le navigateur n'est pas de la sécurité.

## Le pourquoi avant le comment

Jusqu'à la leçon précédente, le `revisor` ne fait que regarder : il apporte un fichier de services, le dessine et calcule combien sont disponibles et combien de temps ils mettent en moyenne. Regarder est la moitié du travail de qui exploite un ensemble de services. L'autre moitié est d'agir : enregistrer un service qui vient de naître, et retrouver vite celui qui pose problème quand la liste ne tient plus sur un écran.

Les deux choses sont des formulaires. Un formulaire est l'endroit de la page où une personne remet des données au programme, et cela le rend différent de tout ce que tu as fait jusqu'ici. Les services du fichier JSON, c'est toi qui les as écrits, ou un programme que tu connais. Ce que quelqu'un tape dans un champ de texte a été écrit par une personne pressée, avec le téléphone dans une main, qui peut laisser le champ vide, mettre un nom qui existe déjà, écrire « mil » là où l'on attendait un nombre, ou coller un texte de deux cents caractères. Dans la leçon 7, tu as appris que les données extérieures ne sont pas dignes de confiance quand on les dessine (`textContent`, jamais `innerHTML`). Dans la leçon 8, tu as appris à regarder `response.ok` avant de tenir une réponse pour bonne, et dans la 9, qu'une requête peut échouer de plusieurs façons et que chaque défaillance se traduit en une phrase que la personne comprend. Cette leçon ajoute la troisième porte d'entrée : ce qu'écrit la personne.

Il y a une bonne nouvelle, et c'est la raison pour laquelle cette leçon est courte en JavaScript : **le navigateur sait déjà valider les formulaires**. Il le sait depuis des années. Avec quelques attributs HTML —que tu connais déjà de la leçon 2, parce qu'ils font partie de la sémantique des champs— le navigateur empêche d'envoyer un formulaire incomplet, signale ce qui manque et déplace le focus vers le champ fautif. La mauvaise nouvelle est celle qui occupe la seconde moitié de la leçon : ce que le navigateur montre de lui-même est une bulle qui disparaît en quelques secondes, qu'on ne peut pas styliser, qui est dans la langue du navigateur et n'arrive pas toujours à qui utilise un lecteur d'écran. Un tableau de bord que n'importe qui peut utiliser a besoin que l'erreur reste écrite dans la page, près du champ, là où on peut la relire.

C'est pourquoi l'ordre de la leçon est celui qu'il convient de toujours suivre : d'abord ce que le navigateur fait gratuitement, ensuite le bon moment pour montrer l'erreur, et à la fin le texte de l'erreur. Si tu commences par écrire du JavaScript, tu finis par réécrire, en moins bien, ce qui existait déjà.

### L'état du tableau de bord à la fin de la leçon 9

Cette leçon part d'un tableau de bord concret, et il vaut mieux le dire en toutes lettres que te laisser le supposer. À la fin de la leçon 9, le `revisor` a ces pièces :

| Pièce | Ce qu'elle fait | De quelle leçon elle vient |
|---|---|---|
| `index.html` | le squelette : en-tête avec la « Última revisión » (Dernière vérification), le récapitulatif, et dans la section des services les zones d'avertissement (`#notice` et `#error-notice`, présentes dès le départ), le bouton « Reintentar » (Réessayer) et une zone de données avec la barre de contrôles —le champ de recherche et les boutons radio « Mostrar » (Afficher), encore sans effet, « Revisar ahora » (Vérifier maintenant) et « Ordenar » (Trier)—, le tableau avec son `caption` et le détail | 2, 4, 5, 7, 8 et 9 |
| `css/styles.css` | couches, variables de couleur, badges d'état (`status-available`, `status-down`), la disposition, le tableau, le focus visible, la classe `.visually-hidden` et les avertissements | 3, 4, 5, 7 et 9 |
| `js/stats.js` | `countByStatus`, `averageResponseMs` et `summarize`, des fonctions pures sur le tableau de services | 6 |
| `js/load.js` | `loadServices(url, timeoutMs)` : `fetch` avec délai d'attente, vérifie `response.ok`, et lance une `Error` avec un message qu'une personne peut lire | 8 et 9 |
| `js/state.js` | l'état (`phase`, `services`, `errorMessage`, `checkedAt`, `sortByTime`, `selected`) et les seules fonctions qui le modifient | 7, 8 et 9 |
| `js/view.js` | `render(state, elements)` : dessine les trois situations (chargement, erreur, vide), le récapitulatif, l'heure et le tableau, toujours avec `textContent` | 7, 8 et 9 |
| `js/main.js` | assemble les pièces : charge, écoute les événements, change l'état et redessine ; accepte `?case=empty`, `?case=error`, `?case=invalid` et `?case=timeout` pour voir chaque situation | 8 et 9 |
| `data/services.json` et `data/services-empty.json` | les cinq services d'exemple avec les clés `id`, `name`, `status` (`available` ou `down`) et `responseMs` ; et une liste vide | 6 et 8 |

Avec ce tableau de bord ouvert sur `http://127.0.0.1:8000/09-cuando-algo-falla/panel/` (le serveur se démarre depuis le dossier `programas/` du [dépôt du cours](https://github.com/HabilMX/curso-web), téléchargé sur ton ordinateur, comme dans la leçon 9 ; pour que `?case=timeout` dépasse vraiment le délai, démarre-le avec `python3 09-cuando-algo-falla/slow-server.py`, comme là-bas), le récapitulatif dit 5, 4 sur 5, 1 et 465 ms, et le tableau a cinq lignes, chacune avec son bouton « Ver detalle » (Voir le détail).

Ce que le tableau de bord **n'a pas encore** : aucun moyen d'ajouter un service, et un champ de recherche et un groupe de boutons radio qui sont dans la page depuis la leçon 2 sans rien faire. La leçon 2 l'avait annoncé : « Todavía no filtra ni busca nada: eso llega más adelante » (Il ne filtre ni ne cherche encore rien : cela viendra plus tard). Aujourd'hui cela arrive : tu construis le formulaire pour ajouter, et tu fais en sorte que le champ de recherche et les boutons radio filtrent. Dans cette leçon, les fichiers sont dans `10-formularios-validacion/panel/`, qui est le tableau de bord de la leçon 9 plus le nouveau.

## Les concepts

Il y a trois idées nouvelles dans cette leçon, et elles s'appuient l'une sur l'autre : la validation qu'apporte le navigateur (10.1 et 10.2), le moment où il convient de montrer l'erreur (10.3) et l'erreur écrite là où elle se lit (10.4). La section 10.5 réunit les trois dans le tableau de bord.

Avant de commencer, une consigne d'habitude pour toutes les leçons à partir de celle-ci : **prédis avant d'exécuter**. Chaque fois que tu vois un programme, avant de l'ouvrir, écris dans ton journal de bord ce que tu crois qu'il va se passer. Avoir juste fait plaisir, mais se tromper apprend davantage : l'écart entre ce que tu as prédit et ce qui s'est produit est exactement ce qu'il te reste à comprendre.

### 10.1 Le navigateur sait déjà valider

Commençons par du concret. La page ci-dessous est un formulaire pour demander un avertissement quand un service tombe : un courriel, le nom du service et combien de temps il doit mettre pour que cela compte comme un problème. Lis-la et prédis : que se passe-t-il si tu appuies sur « Pedir aviso » (Demander un avertissement) avec tout vide ? Et si tu écris `dorian@` dans le courriel ?

Le programme de la fin est court et ne fait qu'une chose : quand le formulaire est envoyé, il écrit ce qui a été saisi. Il utilise une nouvelle pièce, `new FormData(form)`. Rappelle-toi, de « Décider, répéter et signaler une erreur », dans la leçon 6, que `new` fabrique un nouvel objet à partir d'un moule ; ce moule, [`FormData`](https://developer.mozilla.org/fr/docs/Web/API/FormData), lit tous les champs du formulaire par leur attribut `name`, et `data.get("email")` renvoie ce qui a été écrit dans le champ qui s'appelle `email`. Tu le reverras, plus en détail, dans le tableau de bord.

```html
<!-- fig10_01.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Avisarme cuando caiga un servicio</title>
  <link rel="icon" href="data:,">
</head>
<body>
  <main>
    <h1>Avisarme cuando caiga un servicio</h1>
    <p>Los campos marcados con * son obligatorios.</p>

    <form id="alert-form">
      <p>
        <label for="email">Correo *</label><br>
        <input id="email" name="email" type="email" required autocomplete="email">
      </p>
      <p>
        <label for="service">Servicio *</label><br>
        <input id="service" name="service" type="text" required minlength="2">
      </p>
      <p>
        <label for="threshold">Avisar si responde en más de (ms)</label><br>
        <input id="threshold" name="threshold" type="number" min="100" max="60000" step="100" value="1000">
      </p>
      <button type="submit">Pedir aviso</button>
    </form>

    <p id="result" role="status"></p>
  </main>

  <script type="module">
    const form = document.getElementById("alert-form");
    const result = document.getElementById("result");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      result.textContent =
        `Aviso pedido: ${data.get("email")} recibirá un correo si ` +
        `${data.get("service")} tarda más de ${data.get("threshold")} ms.`;
    });
  </script>
</body>
</html>
```

Ouvre-la avec le serveur local que tu connais déjà (démarré depuis le dossier `programas/` du dépôt ; cette page est dans [`programas/10-formularios-validacion/`](https://github.com/HabilMX/curso-web/tree/main/programas/10-formularios-validacion), à `http://127.0.0.1:8000/10-formularios-validacion/fig10_01.html`) et appuie sur le bouton sans rien écrire. Sans une seule ligne de JavaScript qui valide, le navigateur **n'envoie pas** le formulaire, déplace le focus vers le courriel et affiche une bulle qui dit qu'il faut remplir le champ. Écris `dorian@` et appuie de nouveau : le navigateur dit que l'adresse est incomplète, et il le dit avec une phrase précise (Chrome en espagnol : « Ingresa texto después del signo "@"… » ; un autre navigateur emploie d'autres mots). Avec `ana@ejemplo.mx` et un nom de service, le formulaire est bien envoyé et le petit programme du dessous écrit le résultat.

La page, au chargement, n'affiche que ceci :

```text
Avisarme cuando caiga un servicio
Los campos marcados con * son obligatorios.
Correo *
Servicio *
Avisar si responde en más de (ms)
Pedir aviso
```

Tout cela vient de quatre attributs. Voyons-les un par un, car ils sont la boîte à outils de la validation et il vaut la peine de savoir ce que promet chacun.

**`required`** dit que le champ ne peut pas être vide. C'est le plus utilisé et le plus simple : dans un champ de texte, il signifie « au moins un caractère », dans une case à cocher « cochée », et dans un `<select>` « une option est choisie, et ce n'est pas celle d'invitation ». Ce dernier cas a une règle précise qui surprend : si la **première** option a `value=""` (comme « Elige un estado » (Choisis un état) dans le formulaire du tableau de bord), la [spécification HTML](https://html.spec.whatwg.org/multipage/form-elements.html#placeholder-label-option) l'appelle *option d'invitation* et, si c'est celle qui est choisie, le champ compte comme vide. Remarque que la règle porte sur la première option, pas sur n'importe quelle valeur vide : en préparant cette leçon, on a vérifié dans Chrome qu'une seconde option avec `value=""` laisse le `<select required>` valide. C'est la façon standard de mettre une option d'invitation sans que quelqu'un puisse l'envoyer par accident, et c'est pourquoi elle va toujours en premier.

**`type`** ne change pas seulement le clavier qui apparaît sur le téléphone : il valide aussi. Un `type="email"` rejette ce qui ne ressemble pas à une adresse, un `type="url"` ce qui ne ressemble pas à une URL et un `type="number"` ce qui n'est pas un nombre. Un avertissement honnête sur `email` : le navigateur accepte `a@b` parce que, selon la spécification, une adresse sans point dans le domaine est valide (il en existe dans les réseaux internes). Ce qu'il valide, c'est la *forme*, pas l'existence du courriel. Pour savoir s'il existe, il n'y a qu'une seule épreuve : envoyer un message et attendre que quelqu'un l'ouvre.

**`minlength` et `maxlength`** limitent la longueur. `maxlength` empêche d'écrire au-delà de la limite, en silence, et c'est pourquoi il a mauvaise réputation : la personne tape et il ne se passe rien, sans explication. Utilise-le quand la limite est réelle (un champ de la base de données de cette taille) et indique combien il en reste. `minlength`, en revanche, ne se vérifie que quand la personne *modifie* le champ. Si le HTML apporte une valeur initiale qui enfreint déjà `minlength`, le navigateur ne la marque pas ; en préparant cette leçon, on l'a vérifié avec `value="ab"` et `minlength="5"` : le drapeau `tooShort` reste éteint tant que quelqu'un n'a pas tapé.

**Une parenthèse nécessaire : les expressions régulières.** L'attribut suivant, `pattern`, reçoit une *expression régulière*, et plus loin le tableau de bord en utilisera une autre en JavaScript. Une **expression régulière** est un motif écrit dans un mini-langage qui décrit une famille de textes : au lieu de dire « le texte est `Pagos` », elle dit « le texte commence par une lettre puis contient n'importe quoi ». La plupart des caractères valent pour eux-mêmes (`a` est la lettre `a`), et quelques-uns ont une signification spéciale. Ceux que tu vas voir dans cette leçon sont ceux-ci :

| Pièce | Signifie |
|---|---|
| `.` | un caractère quelconque |
| `\S` | un caractère qui n'est **pas** une espace (le `S` majuscule nie `\s`, « une espace ») |
| `\w` | une lettre sans accent, un chiffre ou un tiret bas |
| `*` | ce qui précède, zéro fois ou plus |
| `+` | ce qui précède, une fois ou plus |
| `?` | ce qui précède est facultatif : zéro ou une fois |
| `( … )` | regroupe plusieurs pièces pour que `*`, `+` ou `?` s'appliquent au groupe entier |
| `[ … ]` | un caractère quelconque parmi ceux qui sont entre crochets |
| `^` et `$` | le début et la fin du texte |

Un exemple résolu, celui du formulaire du tableau de bord : `\S(.*\S)?`. Il se lit de gauche à droite : un caractère qui n'est pas une espace ; puis, facultativement, un groupe formé de « n'importe quoi » et d'un autre caractère qui n'est pas une espace. En mots : il commence et finit par quelque chose qui n'est pas une espace, et au milieu il peut y avoir ce qu'on veut, espaces comprises. Vérifie-le avec des cas : `Pagos` convient ; `A` convient (le groupe facultatif n'apparaît pas) ; `Mis pagos` convient (l'espace est au milieu) ; ` Pagos` et `Pagos ` ne conviennent pas, ni le texte vide. Ces six cas ont été vérifiés dans le moteur JavaScript tel que le navigateur le compile. En JavaScript, une expression régulière s'écrit entre barres obliques, `/…/`, et après la dernière barre viennent ses **drapeaux**, des lettres qui changent la façon de l'appliquer : `g` (toutes les correspondances, pas seulement la première) et `u` ou `v` (bien comprendre les caractères Unicode, comme les lettres accentuées). Le guide des [expressions régulières de MDN](https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Regular_expressions) en donne la liste complète ; pour cette leçon, le tableau suffit.

**`pattern`** reçoit une expression régulière que la valeur entière doit satisfaire (l'expression est ancrée : c'est comme si elle portait `^` au début et `$` à la fin). Dans le formulaire du tableau de bord, `pattern="\S(.*\S)?"` dit « commence et finit par quelque chose qui n'est pas une espace ». Deux pièges : le premier est que les navigateurs actuels compilent le motif dans un mode strict (le drapeau `v`), dans lequel un tiret isolé à l'intérieur d'un ensemble, comme dans `[\w-]+`, est une erreur de syntaxe. Le motif invalide ne prévient pas bruyamment : le navigateur l'ignore et le champ reste sans règle, avec un message seulement dans la console. Le second piège est son jumeau : un motif trop ingénieux rejette des données réelles, comme un nom de famille avec apostrophe ou un nom accentué. Un motif n'est pas un acte de foi, c'est une règle que quelqu'un doit maintenir.

**`min`, `max` et `step`** servent pour les champs numériques (et de date). `min="0" max="60000"` fixe la plage. `step` fixe la grille des valeurs valides, et il y a ici un détail qui pèse : la grille se compte à partir de `min`. Avec `min="0" step="100"`, 0, 100, 200… sont valides, de sorte que 1050 est invalide même s'il est dans la plage.

Un commentaire sur `type="number"`, parce que la décision n'est pas évidente. Le champ numérique valide tout seul, rejette ce qui n'est pas un nombre et offre des flèches pour monter et descendre. « Nombre », attention, ne veut pas dire « seulement des chiffres » : il accepte aussi un signe, des décimales (si `step` le permet) et même la notation scientifique ; en préparant cette leçon, on a vérifié dans Chrome 154 que `1e2` est une valeur valide et vaut 100. De plus, ces flèches s'activent sans le vouloir avec la molette de la souris, et qui utilise un lecteur d'écran ne trouve pas une zone de texte, mais un « bouton de nombre » qui monte et descend : son rôle implicite est `spinbutton`, selon [MDN](https://developer.mozilla.org/fr/docs/Web/HTML/Reference/Elements/input/number). Le système de design du gouvernement britannique, qui a étudié la question avec de vrais utilisateurs, recommande `type="text"` avec `inputmode="numeric"` pour les nombres qui ne s'incrémentent pas (le [GOV.UK Design System](https://design-system.service.gov.uk/components/text-input/) l'argumente avec sa recherche), et la [documentation de MDN sur `type="number"`](https://developer.mozilla.org/fr/docs/Web/HTML/Reference/Elements/input/number) fait la même réserve pour les codes postaux ou les cartes. Le temps de réponse du `revisor` est bien une quantité avec une plage (« combien de millisecondes »), donc nous utilisons `type="number"` avec `min` et `max` ; si ton champ était un numéro de dossier, tu utiliserais du texte avec `inputmode`.

Et un attribut de plus, qui ne valide pas mais appartient à ce sujet : **`autocomplete`**. Il dit au navigateur (et à qui te lit avec une technologie d'assistance) quelle sorte de donnée demande le champ. `autocomplete="email"` fait que le navigateur propose le courriel enregistré, et le critère [1.3.5 des règles d'accessibilité (WCAG 2.2)](https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html) demande que les champs qui recueillent des données personnelles déclarent leur finalité d'une façon qu'une machine comprenne. Les champs du `revisor` (nom d'un service, état, millisecondes) ne sont pas des données personnelles, donc il n'y correspond aucune valeur de la liste ; c'est pourquoi le formulaire du tableau de bord porte `autocomplete="off"` : nous ne voulons pas que le navigateur suggère des noms de services que quelqu'un a écrits ailleurs. La liste des valeurs permises est dans la [documentation de MDN sur `autocomplete`](https://developer.mozilla.org/fr/docs/Web/HTML/Reference/Attributes/autocomplete).

### Deux choses que la validation du navigateur n'est pas

**Ce n'est pas de la sécurité.** C'est du confort. MDN le dit sans détour dans son [guide de validation des formulaires](https://developer.mozilla.org/fr/docs/Learn_web_development/Extensions/Forms/Form_validation) : la validation côté client ne doit pas être considérée comme une mesure de sécurité exhaustive, parce qu'elle est très facile à contourner. Qui veut envoyer une valeur invalide n'utilise pas ton formulaire : il ouvre les outils du navigateur, retire l'attribut `required` d'un clic, ou n'utilise même pas de navigateur et envoie la requête avec un outil en ligne de commande. La validation du client existe pour que la personne honnête se trompe moins. La validation qui protège est celle que le serveur répète, et tu devras l'écrire là-bas quand ton tableau de bord en aura un (dans le [cours de TypeScript](https://www.habil.mx/fr/cours/typescript/) de cette maison, le tableau de bord reçoit un serveur, et c'est alors le moment).

Dans ce cours, le tableau de bord n'a pas de serveur : ce que tu ajoutes vit dans la mémoire de la page et disparaît au rechargement. C'est une limitation qu'on dit en face, pas un oubli ; ce qui s'applique bel et bien, c'est l'habitude : **chaque donnée qui entre se valide à la frontière par où elle entre**.

**Ce n'est pas le seul mécanisme.** `novalidate` sur le `<form>` éteint la validation automatique à l'envoi, et `formnovalidate` sur un bouton l'éteint pour ce bouton (utile dans un « Enregistrer le brouillon »). L'éteindre ne désactive pas l'API de validation que nous allons voir : le formulaire peut toujours demander à chaque champ s'il est valide. Dans le tableau de bord, nous n'utiliserons pas `novalidate` : nous voulons que le navigateur continue de bloquer l'envoi, et nous changerons seulement *la façon dont* le message s'affiche.

Un dernier détail de l'envoi : un champ avec `disabled` reste en dehors de tout. Il n'est pas validé, ne compte pas pour `checkValidity()` et n'est pas envoyé avec le formulaire. En préparant cette leçon, on l'a vérifié avec un champ `required` et `disabled` vide : `willValidate` est faux, `validity.valid` est vrai et le champ n'apparaît pas dans `FormData`. Le tableau de bord en profite : si le service est en panne, cela n'a pas de sens de demander son temps de réponse, donc ce champ se désactive et cesse d'être obligatoire de lui-même.

### 10.2 Lire l'état d'un champ : `validity` et `setCustomValidity`

La validation native a deux moitiés. Les attributs la *déclarent* ; l'**API de validation des contraintes** (Constraint Validation API, décrite dans [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Constraint_validation) et dans la [spécification HTML](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#constraints)) te laisse *interroger* et *ajouter des règles* depuis JavaScript.

Chaque champ a une propriété `validity` ([`ValidityState`](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState)) : un objet avec un drapeau pour chaque règle qui peut être enfreinte. Ceux que tu utiliseras :

| Drapeau | S'allume quand |
|---|---|
| `valueMissing` | le champ est `required` et vide |
| `typeMismatch` | la valeur n'a pas la forme du `type` (courriel, URL) |
| `patternMismatch` | la valeur ne satisfait pas le `pattern` |
| `tooShort` | la personne a écrit moins que `minlength` |
| `rangeUnderflow` / `rangeOverflow` | le nombre est en dessous de `min` ou au-dessus de `max` |
| `stepMismatch` | le nombre ne tombe pas dans la grille de `step` |
| `badInput` | la personne a écrit quelque chose que le champ ne peut pas convertir (dans un `type="number"`, un `-` isolé) |
| `customError` | ton code a appelé `setCustomValidity` avec un message |
| `valid` | aucun des précédents |

La page qui suit parcourt ces drapeaux avec une forme de boucle que tu n'as pas encore utilisée : **`for…in`**. Tu connais déjà `for…of` de la leçon 6, dans « Décider, répéter et signaler une erreur » : il parcourt les **valeurs** d'une liste. `for (const flag in objeto)` parcourt autre chose : les **noms des propriétés** d'un objet, un par tour, sous forme de texte. Avec `{ valueMissing: true, tooShort: false }`, `flag` vaudrait `"valueMissing"` au premier tour et `"tooShort"` au second. Pour lire la valeur d'une propriété dont le nom est stocké dans une variable, on utilise des crochets : `control.validity[flag]` est `control.validity.valueMissing` quand `flag` vaut `"valueMissing"`. Un détail technique qui joue ici en ta faveur : `for…in` visite aussi les propriétés que l'objet hérite de son moule, et les drapeaux de `validity` vivent justement là, dans le moule `ValidityState` ; c'est pourquoi la boucle les trouve tous ([MDN : `for…in`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/for...in)). Dans un objet écrit par toi, où les propriétés héritées n'intéressent pas, on le parcourt avec `Object.keys` ou on le filtre avec `Object.hasOwn`, comme dans la leçon 9.

Avant de lire la page qui suit, prédis : si tu écris `-5` dans un champ numérique avec `min="0"` et `step="100"`, quels drapeaux s'allument ? (Une seule réponse est probable ; deux est la bonne.)

```html
<!-- fig10_02.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Las banderas de validity</title>
  <link rel="icon" href="data:,">
  <style>
    input { font: inherit; padding: 0.5rem; }
    pre { background: #f4f6f8; padding: 0.75rem; }
  </style>
</head>
<body>
  <main>
    <h1>Las banderas de validity</h1>

    <p>
      <label for="time">Tiempo de respuesta (ms)</label><br>
      <input id="time" type="number" required min="0" max="60000" step="100">
    </p>
    <p>
      <label for="name">Nombre (no puede ser «admin»)</label><br>
      <input id="name" type="text" required minlength="3">
    </p>

    <h2>Banderas activas</h2>
    <pre id="report" role="status"></pre>
  </main>

  <script type="module">
    const time = document.getElementById("time");
    const name = document.getElementById("name");
    const report = document.getElementById("report");

    function activeFlags(control) {
      const flags = [];
      for (const flag in control.validity) {
        if (control.validity[flag] === true && flag !== "valid") {
          flags.push(flag);
        }
      }
      return flags.length === 0 ? "ninguna (valid: true)" : flags.join(", ");
    }

    function validateName() {
      // Sin la rama que limpia, el campo se quedaría inválido para siempre.
      name.setCustomValidity(
        name.value.toLowerCase() === "admin" ? "Ese nombre está reservado." : "",
      );
    }

    function show() {
      report.textContent =
        `tiempo -> ${activeFlags(time)}\n` + `nombre -> ${activeFlags(name)}`;
    }

    for (const control of [time, name]) {
      control.addEventListener("input", () => {
        validateName();
        show();
      });
    }
    show();
  </script>
</body>
</html>
```

La page parcourt les propriétés de `validity` et liste celles qui valent `true`. À l'ouverture, les deux champs vides enfreignent leur `required` :

```text
Las banderas de validity
Tiempo de respuesta (ms)
Nombre (no puede ser «admin»)
Banderas activas
tiempo -> valueMissing
nombre -> valueMissing
```

Écris `-5` dans le temps et tu verras `rangeUnderflow, stepMismatch` : il est en dessous de `min` et en plus il tombe hors de la grille de 100 en 100 comptée depuis 0. C'est pourquoi j'ai dit qu'une seule réponse est probable et que deux est la bonne : **plusieurs drapeaux peuvent être allumés en même temps**, et c'est pourquoi un programme qui affiche des messages doit décider lequel passe en premier. Avec `1050`, seul `stepMismatch` monte ; avec `70000`, `rangeOverflow`. Dans le nom, écrire `ad` allume `tooShort`, et écrire `admin` éteint ce drapeau et allume `customError`.

Cette dernière est la règle à nous. `setCustomValidity("texto")` dit au champ « considère-toi invalide, et voici le motif » ; le navigateur l'utilise aussi comme texte de sa bulle. Elle comporte un piège qui cause une erreur classique : **un message non vide laisse le champ invalide pour toujours**. Le navigateur ne sait pas quand ta règle est enfin satisfaite ; c'est à toi d'appeler `setCustomValidity("")` dès que la valeur est correcte. Dans la page, la fonction `validateName` le fait avec une seule expression (un ternaire) : si le nom est `admin`, elle pose le message, sinon elle pose la chaîne vide. Retirer cette seconde branche est l'erreur la plus facile à commettre et la plus difficile à comprendre de l'extérieur, parce que le champ « a l'air bien » et que le formulaire ne s'envoie pas.

Une information utile avant de continuer : deux méthodes permettent d'interroger tout le formulaire. `checkValidity()` renvoie `true` ou `false` et déclenche l'événement `invalid` sur chaque champ invalide, sans rien afficher. `reportValidity()` fait la même chose et affiche en plus la bulle du navigateur. Quand tu envoies un formulaire avec le bouton, le navigateur appelle la seconde à ta place.

### 10.3 `:user-invalid` : montrer l'erreur quand c'est le moment

Il y a une question de conception qui semble une affaire de goût et qui est une affaire de respect : quand peint-on un champ en rouge ? La réponse naïve est « quand il est invalide ». Le problème est qu'un champ `required` tout juste chargé est invalide dès le premier instant : il est vide. Si tu peins en rouge tout ce qui est invalide, la personne ouvre le formulaire et trouve un tableau d'erreurs avant d'avoir rien fait. C'est comme si un caissier te grondait de ne pas être encore arrivé avec l'argent.

La pseudo-classe `:invalid` fait justement cela : elle correspond à tout champ qui enfreint une règle, dès le chargement de la page. Son héritière `:user-invalid` ([MDN](https://developer.mozilla.org/fr/docs/Web/CSS/:user-invalid), disponible dans tous les navigateurs depuis novembre 2023) ne correspond que lorsque la personne est déjà intervenue : quand elle a modifié le champ et en est sortie, ou quand elle a essayé d'envoyer le formulaire. C'est la règle qui décrit déjà ce que tu voulais depuis le début.

La page qui suit utilise trois petites pièces pour montrer ce que le navigateur sait. `elemento.matches(":user-invalid")` demande si l'élément satisfait ce sélecteur CSS en ce moment, et renvoie `true` ou `false`. `setTimeout(show)`, sans délai, demande « exécute `show` dès que ce qui est en cours est terminé », pour lire l'état *après* que le navigateur l'a mis à jour. Et le `true` à la fin de `addEventListener` écoute dans la phase de capture ; la raison est expliquée en 10.4, avec l'événement `invalid`.

Prédis avant d'ouvrir la page : il y a deux champs obligatoires et vides, l'un stylisé avec `:invalid` et l'autre avec `:user-invalid`. Lequel est rouge au chargement ?

```html
<!-- fig10_03.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>:invalid contra :user-invalid</title>
  <link rel="icon" href="data:,">
  <style>
    input { font: inherit; padding: 0.5rem; border: 3px solid #8a949e; }
    #old-field:invalid { border-color: #b3261e; }
    #new-field:user-invalid { border-color: #b3261e; }
    pre { background: #f4f6f8; padding: 0.75rem; overflow-wrap: anywhere; white-space: pre-wrap; }
  </style>
</head>
<body>
  <main>
    <h1>:invalid contra :user-invalid</h1>

    <form id="form">
      <p>
        <label for="old-field">Con :invalid (rojo desde que abres la página)</label><br>
        <input id="old-field" required>
      </p>
      <p>
        <label for="new-field">Con :user-invalid (rojo cuando la persona ya intervino)</label><br>
        <input id="new-field" required>
      </p>
      <button type="submit">Enviar</button>
    </form>

    <h2>Lo que el navegador sabe</h2>
    <pre id="report" role="status"></pre>
  </main>

  <script type="module">
    const form = document.getElementById("form");
    const newField = document.getElementById("new-field");
    const report = document.getElementById("report");

    function show() {
      report.textContent =
        `valueMissing: ${newField.validity.valueMissing}\n` +
        `:invalid: ${newField.matches(":invalid")}\n` +
        `:user-invalid: ${newField.matches(":user-invalid")}`;
    }

    form.addEventListener("submit", (event) => event.preventDefault());
    for (const type of ["input", "focusout", "invalid"]) {
      form.addEventListener(type, () => setTimeout(show), true);
    }
    show();
  </script>
</body>
</html>
```

Au chargement, le rapport du dessous dit ce que le navigateur sait du second champ :

```text
:invalid contra :user-invalid
Con :invalid (rojo desde que abres la página)
Con :user-invalid (rojo cuando la persona ya intervino)
Enviar
Lo que el navegador sabe
valueMissing: true
:invalid: true
:user-invalid: false
```

Le premier champ est déjà rouge et le second non, bien que tous deux soient aussi vides l'un que l'autre. La dernière ligne le rend visible : `:invalid` est vrai et `:user-invalid` est faux. Maintenant fais ceci, dans cet ordre :

1. Clique dans le second champ, écris une lettre, efface-la et appuie sur Tab. Le rapport change : `:user-invalid` passe à vrai et le champ devient rouge.
2. Recharge et appuie sur « Enviar » (Envoyer) sans rien toucher : les deux sont rouges et le rapport marque aussi `:user-invalid` comme vrai.

Voici une différence entre navigateurs qui mérite d'être dite parce qu'elle peut te troubler en comparant. Si tu cliques dans un champ vide et que tu en sors **sans rien écrire**, Chrome 154 laisse `:user-invalid` à faux, mais Firefox 155 le met à vrai. Les deux choses ont été vérifiées en préparant cette leçon ; dans Safari, on n'a pas essayé. La spécification laisse de la marge sur ce qui compte comme « être intervenu », et la conséquence pratique est une règle de conception : **ne dépends pas de `:user-invalid` pour les champs que la personne a sautés**. Pour ceux-là, le moment sûr est l'envoi, qui dans tous les navigateurs marque tout.

Le style du tableau de bord utilise les deux choses à la fois, et c'est ce que tu verras dans `css/styles.css` : `.field :user-invalid, .field [aria-invalid="true"] { … }`. La première partie peint ce que le navigateur décide de marquer ; la seconde ce que notre code marque. Ce n'est pas de la redondance, c'est de la couverture : par l'un ou l'autre chemin, le champ s'affiche en erreur.

Et un rappel d'accessibilité qui va avec la couleur : **le rouge n'est pas un message**. Un champ avec une bordure rouge et rien d'autre est invisible pour qui ne distingue pas le rouge et muet pour qui utilise un lecteur d'écran. La couleur accompagne ; le texte informe. C'est ce qui suit.

### 10.4 L'erreur écrite là où elle se lit

La bulle du navigateur remplit une fonction, mais elle a quatre limites qui comptent. Elle disparaît en quelques secondes, de sorte que qui a besoin de plus de temps pour lire ne l'a plus. On ne peut pas la styliser. Elle sort dans la langue du navigateur et avec les mots du fabricant (en préparant cette leçon, Chrome en espagnol a dit « Ingresa texto después del signo "@". La dirección "dorian@" está incompleta. » ; dans un autre navigateur ou une autre langue, ce serait une autre phrase). Et avec un lecteur d'écran, son annonce dépend de chaque combinaison de navigateur et de lecteur. Les règles d'accessibilité le signalent dans le document qui explique le critère [3.3.1, Identification des erreurs](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html) (niveau A) : l'erreur doit être identifiée et décrite **en texte**, et ce document lui-même recommande de ne pas dépendre uniquement de la validation native à cause de ses limites avec l'agrandissement d'écran, la permanence du message et les erreurs multiples.

La solution tient en quatre pièces, et tu les verras ensemble dans une page minimale avant de les utiliser dans le tableau de bord.

**Première pièce : le message est un paragraphe de la page**, qui existe dès le départ (vide) et se remplit quand il y a une erreur. Il vit à côté du champ et s'écrit avec `textContent`.

**Deuxième pièce : le champ pointe vers son message avec `aria-describedby`.** Cet attribut ([MDN](https://developer.mozilla.org/fr/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-describedby)) dit à la technologie d'assistance : « le texte de cet élément décrit ce champ ». Le libellé (`<label>`) donne le *nom* du champ et se lit en premier ; la description se lit ensuite. Quand le focus tombe sur le champ, le lecteur dit quelque chose comme « Correo, zone de modification, Escribe tu correo » (Courriel, …, Écris ton courriel). Il accepte plusieurs identifiants séparés par une espace : dans le tableau de bord, chaque champ pointe vers son aide (« Al menos 2 caracteres », Au moins 2 caractères) et vers son erreur. On l'a vérifié dans l'arbre d'accessibilité de Chrome : la description du champ du nom est sortie comme « Al menos 2 caracteres. No puede repetirse. Escribe el nombre del servicio. ».

**Troisième pièce : `aria-invalid="true"` marque le champ comme invalide** ([MDN](https://developer.mozilla.org/fr/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-invalid)). Ainsi le lecteur peut dire « non valide » à l'arrivée. MDN précise quand le poser : *après* avoir essayé d'envoyer ou de valider, jamais dès que la page charge sur un champ vide, parce que ce serait le même tableau rouge qu'avant, mais parlé.

**Quatrième pièce : le focus est amené au premier champ en erreur.** C'est ce que le navigateur faisait avec sa bulle, et en l'éteignant il faut le faire à la main. Qui navigue au clavier tombe exactement là où il doit corriger, et qui utilise un lecteur d'écran entend aussitôt le nom, l'erreur et l'état. C'est aussi la plus grande aide pour le critère de tout pouvoir faire au clavier ([2.1.1](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html), niveau A).

Comment éteint-on la bulle sans éteindre la validation ? Avec l'événement **`invalid`**. Chaque fois que le navigateur vérifie un champ et le trouve invalide, il déclenche `invalid` sur lui ([MDN](https://developer.mozilla.org/fr/docs/Web/API/HTMLInputElement/invalid_event)), et si ton code appelle `preventDefault()`, le navigateur n'affiche pas sa bulle. Deux précautions : l'événement **ne remonte pas dans l'arbre** (il ne bouillonne pas), donc un écouteur posé sur le `<form>` ne le reçoit que si tu l'enregistres dans la phase de capture (le troisième argument `true`) ; on l'a vérifié avec un écouteur ordinaire sur le formulaire et il n'a rien reçu. Et comme tu as annulé l'événement, le navigateur ne déplace pas non plus le focus : c'est toi qui le fais.

Prédis ce que fera cette page avec le champ vide et avec `dorian` (sans arobase) :

```html
<!-- fig10_04.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Un campo, un error que se lee</title>
  <link rel="icon" href="data:,">
  <style>
    input { font: inherit; padding: 0.5rem; border: 2px solid #8a949e; }
    [aria-invalid="true"] { border-color: #b3261e; }
    .error { color: #b3261e; font-weight: 600; min-height: 1.5rem; margin: 0.25rem 0; }
  </style>
</head>
<body>
  <main>
    <h1>Un campo, un error que se lee</h1>

    <form id="form">
      <p>
        <label for="email">Correo *</label><br>
        <input id="email" name="email" type="email" required autocomplete="email"
               aria-describedby="email-error">
      </p>
      <p id="email-error" class="error"></p>
      <button type="submit">Pedir aviso</button>
    </form>
    <p id="result" role="status"></p>
  </main>

  <script type="module">
    const form = document.getElementById("form");
    const email = document.getElementById("email");
    const error = document.getElementById("email-error");
    const result = document.getElementById("result");

    function message() {
      if (email.validity.valueMissing) return "Escribe tu correo.";
      if (email.validity.typeMismatch) return "Falta algo: un correo se ve así, nombre@dominio.mx.";
      return "";
    }

    email.addEventListener("invalid", (event) => {
      event.preventDefault();
      error.textContent = message();
      email.setAttribute("aria-invalid", "true");
      email.focus();
    });

    email.addEventListener("input", () => {
      if (!email.hasAttribute("aria-invalid")) {
        return;
      }
      error.textContent = message();
      if (email.validity.valid) {
        email.removeAttribute("aria-invalid");
      }
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      result.textContent = `Aviso pedido para ${email.value}.`;
    });
  </script>
</body>
</html>
```

Au chargement, elle n'affiche que le formulaire :

```text
Un campo, un error que se lee
Correo *
Pedir aviso
```

Appuie sur le bouton avec le champ vide : « Escribe tu correo. » (Écris ton courriel.) apparaît, le champ devient rouge et le focus tombe dessus. Écris `dorian` et, pendant que tu tapes, le message se met à jour en « Falta algo: un correo se ve así, nombre@dominio.mx. » (Il manque quelque chose : un courriel ressemble à ceci, nombre@dominio.mx.) ; quand la valeur devient valide, le message et la marque disparaissent. Observe trois décisions du code. Le message dépend du drapeau (`valueMissing` ou `typeMismatch`), pas du texte du navigateur, et c'est pourquoi il est dans ta langue et avec ta voix. La mise à jour pendant la saisie n'a lieu que si le champ était déjà marqué, pour ne pas gronder qui n'a pas encore fini. Et le message dit **quoi faire**, pas seulement ce qui ne va pas : [3.3.3, Suggestion après erreur](https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html), quand la suggestion est connue.

### Les avertissements d'état : `role="status"` et `role="alert"`

Il manque une pièce : les messages qui n'appartiennent pas à un champ. « Servicio agregado » (Service ajouté), « hay 3 campos con error » (il y a 3 champs en erreur), « mostrando 2 de 5 servicios » (affichage de 2 services sur 5). Qui voit l'écran les voit ; qui utilise un lecteur d'écran a besoin qu'ils soient annoncés **sans déplacer le focus**. C'est ce que demande le critère [4.1.3, Messages d'état](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) (niveau AA). Il se résout avec une *région live* : un élément dont le contenu, quand il change, est lu par le lecteur sans que personne le visite.

Il y en a deux, et la différence est l'urgence. Avec **`role="status"`** ([MDN](https://developer.mozilla.org/fr/docs/Web/Accessibility/ARIA/Reference/Roles/status_role)), l'avertissement est courtois : le lecteur attend d'avoir fini de lire ce qu'il lisait. Avec **`role="alert"`** ([MDN](https://developer.mozilla.org/fr/docs/Web/Accessibility/ARIA/Reference/Roles/alert_role)), il interrompt. MDN demande d'employer le second avec précaution, parce qu'interrompre est un désagrément réservé à ce qui ne peut pas attendre (une défaillance de connexion, pas « 5 résultats »). Dans le tableau de bord, `#notice` (chargement ou vide), `#count` et `#form-result` sont `status`, et `#error-notice` (le service n'a pas pu se charger) est `alert`.

Et la règle la plus souvent enfreinte, que MDN place en premier : **le conteneur doit exister dans la page avant que son contenu change**. Si tu crées le paragraphe avec son texte en même temps, beaucoup de lecteurs ne l'annoncent pas, parce que ce qu'ils observent est un *changement* à l'intérieur d'une région déjà connue. C'est pourquoi les trois éléments sont dans le HTML, vides, dès le départ, et pourquoi la feuille de style ne les éteint jamais avec `display: none` tant qu'ils sont vides : cela les retirerait de l'arbre d'accessibilité, comme on l'a mesuré dans la leçon 9.

Une limite qu'on dit en face : ce qu'on a pu vérifier en préparant cette leçon, c'est l'état que le navigateur livre à la technologie d'assistance (l'arbre d'accessibilité avec les descriptions et l'état `invalid`, et le fait que les régions live changent de texte au bon moment). Ce qu'on n'a pas fait, c'est entendre la sortie d'un vrai lecteur d'écran. Quand tu auras terminé la leçon, fais cet essai toi-même avec le lecteur que fournit ton système ; c'est le seul qui compte.

### 10.5 Dans le tableau de bord : ajouter et filtrer

Maintenant, tout ensemble. Le tableau de bord gagne deux choses : que le champ de recherche et les boutons radio de la leçon 2 filtrent le tableau, et le formulaire pour ajouter un service. Commençons par les décisions, avant le code.

**Les contrôles étaient déjà là.** Le champ « Buscar servicio » (Chercher un service) et le groupe « Mostrar », avec ses boutons radio Todos, Disponibles et Caídos (Tous, Disponibles et En panne), sont dans la page depuis la leçon 2, avec leurs libellés et leur `<fieldset>`. Il n'y a pas besoin d'inventer un champ de recherche : il suffit de l'écouter. C'est le gain d'avoir écrit le HTML pour ce qu'il signifie dès le départ.

**Le filtre est une fonction pure.** `filterServices(services, filter)` reçoit le tableau et les conditions, et renvoie le tableau filtré, sans toucher à la page. C'est le même style que `js/stats.js`, et c'est pourquoi on peut le tester sans écran, comme tu l'as fait avec l'état dans la leçon 7. Il normalise le texte avant de comparer (retire accents et majuscules) pour que `catalo` trouve `Catálogo` : `normalize("NFD")` ([MDN](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)) sépare chaque lettre de son accent, et une expression régulière efface les marques.

**L'état gagne un champ.** `state.filter` garde le texte et l'état choisi ; `visible(state)` filtre d'abord et trie ensuite. On ne filtre pas en touchant des lignes du DOM : on filtre en *redessinant à partir des données*, comme tu l'as appris dans la leçon 7.

**Le décompte est annoncé avec retard.** Le tableau se met à jour à chaque touche, mais l'avertissement « Mostrando 3 de 5 servicios. » attend 400 ms après la dernière touche. Sans cette attente, un lecteur d'écran annoncerait « Mostrando 4… Mostrando 3… Mostrando 1… » lettre par lettre, et ce qui devait aider gêne. C'est un `setTimeout` ([MDN](https://developer.mozilla.org/fr/docs/Web/API/Window/setTimeout)) qui est annulé et réarmé à chaque touche.

**Le formulaire profite de ce qui existe.** Les attributs font la validation ; le programme ne change que l'endroit où le message s'affiche. Le nom doit être unique : c'est une règle que le navigateur ne connaît pas, donc elle passe par `setCustomValidity` et son nettoyage. Le temps de réponse est désactivé si le service est en panne. Chaque champ réserve toujours la ligne de son message (`min-height`), pour que la page ne saute pas quand quelqu'un se trompe ; dans la leçon 11, tu verras que ces sauts se mesurent.

**Le formulaire sert aussi avec la liste vide.** Avec `?case=empty`, le tableau de bord dit « No hay servicios que revisar. » (Il n'y a pas de services à vérifier.) et il n'y a pas de tableau. Là, le formulaire reste visible : c'est la façon d'enregistrer le premier. Et il y a aussi « Reintentar », que la leçon 9 affiche avec la liste vide parce que « Revisar ahora » vit dans la zone de données, masquée dans ce cas. C'est pourquoi la zone du formulaire dépend de la phase (`"ready"`) et non de l'existence de lignes.

**Après l'ajout, on avertit et on revient au premier champ.** Le message dit combien de services il y a maintenant et, si le filtre actuel masque le nouveau, il le dit aussi : sans cela, qui filtre par « Caídos » et en ajoute un disponible verrait que « rien ne s'est passé ».

Les nouveaux fichiers sont `js/filters.js` et `js/form.js` (celui-ci traduit les drapeaux de `validity` en phrases et lit le formulaire). Changent `js/state.js`, `js/view.js`, `js/main.js`, `index.html` et `css/styles.css`. Restent comme les a laissés la leçon 9 : `js/load.js`, `js/stats.js`, `data/services.json` et `data/services-empty.json`.

Tu vas le construire en **sept étapes**, des pièces pures à celles qui touchent la page. Chaque étape a la même forme : d'abord **ce que fait le fichier et pourquoi**, ensuite **son code**, et à la fin **comment tu vérifies** que c'est bien avant de passer à la suivante. L'ordre n'est pas capricieux : jusqu'à l'étape 6, le tableau de bord continue de fonctionner exactement comme dans la leçon 9, parce que chaque nouvelle pièce s'ajoute sans que personne l'utilise encore, et ainsi toute erreur qui apparaît vient de la dernière étape que tu as franchie. Seule l'étape 7 branche tout. Les vérifications avec la console utilisent `await import("./js/archivo.js")`, qui charge un module depuis la console des outils du navigateur avec le tableau de bord ouvert et te laisse appeler ses fonctions à la main.

#### Étape 1 — `js/filters.js` : quels services passent le filtre

**Ce que ça fait et pourquoi.** Il décide quels services satisfont le texte cherché et l'état choisi. C'est le fichier le plus court de la leçon et celui qu'il convient le plus de comprendre, parce qu'il ne sait rien de la page : il reçoit un tableau et en renvoie un autre. Il a deux fonctions. `normalize(text)` met un texte prêt à être comparé : `normalize("NFD")` sépare chaque lettre de son accent (le « á » devient « a » plus une marque d'accent), puis `.replace(/\p{Diacritic}/gu, "")` efface les marques. Ce `/\p{Diacritic}/gu` est une expression régulière comme celles de la parenthèse de 10.1 : `\p{Diacritic}` signifie « n'importe quel caractère qu'Unicode classe comme marque diacritique », c'est-à-dire les accents et le tréma ; le drapeau `g` fait que toutes sont effacées et pas seulement la première, et le `u` est celui qui permet d'écrire `\p{…}`. Ensuite, `toLowerCase()` met tout en minuscules et `trim()` retire les espaces des extrémités. La seconde fonction, `filterServices`, utilise le `filter` de la leçon 6 avec une condition double : le nom normalisé **inclut** (`includes`) le texte cherché, et l'état est celui choisi ou bien « Todos » a été choisi.

```js
// panel/js/filters.js
// Decide qué servicios pasan el filtro. Son funciones puras: no tocan el documento.

// Quita acentos y mayúsculas para que "catalo" encuentre "Catálogo".
export function normalize(text) {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

// filter = { text: "", status: "all" | "available" | "down" }
export function filterServices(services, filter) {
  const wanted = normalize(filter.text);
  return services.filter((service) => {
    const nameMatches = normalize(service.name).includes(wanted);
    const statusMatches = filter.status === "all" || service.status === filter.status;
    return nameMatches && statusMatches;
  });
}
```

**Comment tu vérifies.** Avec le tableau de bord ouvert (il a encore la même apparence que dans la leçon 9), écris dans la console `const f = await import("./js/filters.js")` puis `f.normalize("  CATÁLOGO ")`. Il doit répondre `"catalogo"` : sans accent, sans majuscules et sans espaces. C'est ainsi qu'on l'a vérifié dans Chrome 154.

#### Étape 2 — `js/state.js` : l'état apprend à filtrer

**Ce que ça fait et pourquoi.** C'est l'état de la leçon 9 avec un champ de plus et trois nouvelles fonctions. Le nouveau est `filter`, `changeFilter`, `nameExists`, `addService` et le fait que `visible` filtre avant de trier. Trois outils JavaScript apparaissent ici pour la première fois. [`Object.assign(destino, cambios)`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) copie dans `destino` chaque propriété de `cambios` et laisse intactes les autres : si `state.filter` est `{ text: "cat", status: "all" }` et qu'arrive `{ status: "down" }`, le résultat est `{ text: "cat", status: "down" }`. C'est pourquoi `changeFilter` peut ne recevoir que ce qui a changé, que cela vienne du champ de recherche ou des boutons radio. `some`, de la leçon 6, répond si **au moins un** service satisfait la condition, ce qui est justement la question « ce nom existe-t-il déjà ? ». Et `push` ajoute un élément à la fin d'un tableau ; ici, on modifie bien le tableau, parce qu'ajouter un service, c'est précisément modifier la liste.

```js
// panel/js/state.js
// El estado del panel y las únicas formas de cambiarlo.
// No toca el documento: por eso se puede probar sin pantalla.
import { filterServices, normalize } from "./filters.js";

export function createState() {
  return {
    phase: "loading",       // "loading" | "error" | "ready"
    services: [],
    errorMessage: null,     // texto para la persona, solo en la fase "error"
    checkedAt: null,        // cuándo llegaron los datos por última vez (un Date), o null
    sortByTime: false,      // false = en el orden original; true = del más rápido al más lento
    selected: null,         // el id del servicio elegido, o null
    filter: { text: "", status: "all" },
  };
}

export function startLoading(state) {
  state.phase = "loading";
  state.errorMessage = null;
}

export function loadSucceeded(state, services, checkedAt) {
  state.phase = "ready";
  state.services = services;
  state.checkedAt = checkedAt;
  state.selected = null;
}

export function loadFailed(state, message) {
  state.phase = "error";
  state.errorMessage = message;
}

// Lo que la pantalla debe mostrar: "empty" no es una fase que se guarde, se DEDUCE.
// Una lista vacía que llegó bien es un resultado válido, no un error.
export function situation(state) {
  if (state.phase === "ready" && state.services.length === 0) return "empty";
  return state.phase;
}

export function toggleSort(state) {
  state.sortByTime = !state.sortByTime;
}

// Elegir el que ya estaba elegido lo deselecciona.
export function select(state, id) {
  state.selected = state.selected === id ? null : id;
}

// changes = { text } o { status }: solo se pisa lo que llega.
export function changeFilter(state, changes) {
  Object.assign(state.filter, changes);
}

export function nameExists(state, name) {
  const wanted = normalize(name);
  return state.services.some((service) => normalize(service.name) === wanted);
}

export function addService(state, service) {
  state.services.push(service);
}

// Lo que se debe mostrar, calculado a partir del estado cada vez: primero se filtra,
// luego se ordena. filter y toSorted devuelven copias: el arreglo de los datos no se toca.
export function visible(state) {
  const filtered = filterServices(state.services, state.filter);
  if (!state.sortByTime) {
    return filtered;
  }
  // Los que no tienen medida (null) van al final.
  return filtered.toSorted((a, b) => (a.responseMs ?? Infinity) - (b.responseMs ?? Infinity));
}

export function selectedService(state) {
  return state.services.find((service) => service.id === state.selected) ?? null;
}
```

**Comment tu vérifies.** Recharge le tableau de bord : il doit avoir **la même apparence que dans la leçon 9**, avec cinq lignes et le récapitulatif à 5, 4 sur 5, 1 et 465 ms. Il semble que rien ne se soit passé, et c'est ce qu'on cherche : le filtre démarre sur « Todos » et avec le texte vide, donc il laisse passer tout le monde, et personne ne le change encore. Si tu vois quelque chose de différent, l'erreur est dans ce fichier. La vérification de fond est l'étape 3.

#### Étape 3 — L'essai sans écran

**Ce que ça fait et pourquoi.** Avant de toucher à la page, un essai qui n'a pas besoin d'écran, comme celui de la leçon 7. Prédis combien de lignes diront `ok` :

```html
<!-- panel/filters-test.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Prueba de los filtros (sin dibujar nada del panel)</title>
</head>
<body>
  <h1>Prueba de los filtros</h1>
  <pre id="output"></pre>
  <script type="module">
    import { normalize, filterServices } from "./js/filters.js";
    import { createState, loadSucceeded, changeFilter, nameExists, addService, toggleSort, visible } from "./js/state.js";

    const services = [
      { id: "catalog", name: "Catálogo", status: "available", responseMs: 120 },
      { id: "payments", name: "Pagos", status: "available", responseMs: 480 },
      { id: "inventory", name: "Inventario", status: "down", responseMs: null },
      { id: "notifications", name: "Notificaciones", status: "available", responseMs: 310 },
      { id: "search", name: "Búsqueda", status: "available", responseMs: 950 },
    ];

    const lines = [];
    function check(description, condition) {
      lines.push(`${condition ? "ok    " : "FALLA "} ${description}`);
    }
    const names = (list) => list.map((service) => service.name).join(", ");
    const all = (text) => ({ text, status: "all" });

    check("normalize quita acentos y mayúsculas", normalize("  CATÁLOGO ") === "catalogo");
    check("sin filtro pasan todos", filterServices(services, all("")).length === 5);
    check("«catalo» encuentra Catálogo", names(filterServices(services, all("catalo"))) === "Catálogo");
    check("«BUSQUEDA» encuentra Búsqueda: ni la «ú» ni las mayúsculas importan", names(filterServices(services, all("BUSQUEDA"))) === "Búsqueda");
    check("el estado «down» deja solo Inventario", names(filterServices(services, { text: "", status: "down" })) === "Inventario");
    check("texto y estado se combinan: «o» y «available» deja tres", names(filterServices(services, { text: "o", status: "available" })) === "Catálogo, Pagos, Notificaciones");
    check("filtrar no cambia el arreglo original", services.length === 5);

    const state = createState();
    loadSucceeded(state, services, new Date());
    check("nameExists ignora mayúsculas y acentos", nameExists(state, "catalogo") === true);
    check("nameExists dice que no a un nombre nuevo", nameExists(state, "Facturas") === false);

    changeFilter(state, { status: "down" });
    addService(state, { id: "billing", name: "Facturas", status: "available", responseMs: 230 });
    check("un servicio nuevo que no cumple el filtro se agrega pero no se ve", state.services.length === 6 && names(visible(state)) === "Inventario");

    changeFilter(state, { text: "o", status: "all" });
    toggleSort(state);
    check("el orden se aplica después del filtro: con «o», del más rápido al más lento", names(visible(state)) === "Catálogo, Notificaciones, Pagos, Inventario");

    document.querySelector("#output").textContent = lines.join("\n");
  </script>
</body>
</html>
```

Ouvre-la à `…/10-formularios-validacion/panel/filters-test.html` et compare avec ce que tu as prédit :

```text
Prueba de los filtros
ok     normalize quita acentos y mayúsculas
ok     sin filtro pasan todos
ok     «catalo» encuentra Catálogo
ok     «BUSQUEDA» encuentra Búsqueda: ni la «ú» ni las mayúsculas importan
ok     el estado «down» deja solo Inventario
ok     texto y estado se combinan: «o» y «available» deja tres
ok     filtrar no cambia el arreglo original
ok     nameExists ignora mayúsculas y acentos
ok     nameExists dice que no a un nombre nuevo
ok     un servicio nuevo que no cumple el filtro se agrega pero no se ve
ok     el orden se aplica después del filtro: con «o», del más rápido al más lento
```

Remarque la vérification de la combinaison : avec « o » seuls quatre passeraient (Inventario aussi) et avec « available » seul, quatre autres (Búsqueda aussi) ; les trois qui sortent prouvent que les deux conditions s'appliquent à la fois. Un test dont le résultat serait le même avec une seule condition ne prouverait pas la combinaison.

#### Étape 4 — `index.html` : les contrôles qui manquaient

**Ce que ça fait et pourquoi.** Par rapport à la leçon 9, peu de choses changent : le `<fieldset>` des boutons radio gagne un `id` pour l'écouter ; apparaissent l'avertissement du décompte, `#count`, et un `id` sur la boîte du tableau, `#table-zone`, pour la masquer quand aucun service ne passe le filtre ; la section des services gagne la classe `layout-tall`, qui s'explique avec les styles ; et à la fin de `<main>` arrive la nouvelle section, « Agregar un servicio » (Ajouter un service). Remarque la relation de chaque champ avec son aide et son erreur par `aria-describedby`, les éléments avec `role="status"` (qui existent vides dès le départ), et le fait que la zone du formulaire démarre masquée :

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

**Comment tu vérifies.** Recharge : le tableau de bord continue d'afficher la même chose, et le nouveau formulaire **n'apparaît pas**. C'est correct : la section démarre avec `hidden`, et la vue de la leçon 9 ne sait pas qu'elle existe, donc personne ne l'affiche. Dans la console, `document.querySelector("#add-zone").hidden` doit renvoyer `true`.

#### Étape 5 — `css/styles.css` : le formulaire et sa disposition

**Ce que ça fait et pourquoi.** Un bloc de plus à la fin de `css/styles.css`, qui rouvre une fois de plus la couche `components`. Trois choses méritent d'être regardées. La première est la règle de `.layout-tall` : sur un écran large, la grille à deux colonnes de la leçon 5 placerait la nouvelle section sur la ligne suivante, sous le tableau, avec un énorme vide à côté ; si la section des services occupe deux lignes (`grid-row: span 2`), le formulaire monte dans la colonne de gauche, juste sous le récapitulatif. La deuxième est le sélecteur d'erreur, `.field :user-invalid, .field [aria-invalid="true"]` : il porte `.field` devant parce que, sans lui, il pèserait moins que `.field input`, la règle qui donne la bordure à tous les champs, et perdrait. C'est la spécificité de la leçon 3 qui fait son travail, et la solution est d'écrire le sélecteur qui convient, pas un `!important`. La troisième est la ligne réservée à l'erreur. Et une chose qui n'y est pas : aucune règle pour que le tableau tienne à 320 px. Ce n'est pas nécessaire, parce que le tableau défile dans sa boîte depuis la leçon 5 ; la mesure à 320 px donne 320 dans les sept étapes du parcours par lequel se clôt l'étape 7.

```css
@layer components {
  /* ---- Lección 10: el formulario para agregar un servicio ---- */
  /* En una pantalla ancha, la sección de servicios ocupa los dos renglones de la derecha
     y el formulario sube a la columna izquierda, justo debajo del resumen. */
  @media (width >= 64em) {
    .layout-tall {
      grid-row: span 2;
    }
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(14rem, 100%), 1fr));
    gap: var(--space-3);
    align-items: start;
  }

  /* El botón y el aviso del formulario van en su propio renglón. */
  .form-grid > button,
  .form-grid > .notice {
    grid-column: 1 / -1;
    justify-self: start;
  }

  select {
    font: inherit;
  }

  /* Los campos del formulario se ven como el de búsqueda de la Lección 3. */
  .field input,
  .field select {
    min-height: 2.5rem;
    padding: var(--space-1) var(--space-2);
    border: 1px solid var(--color-control);
    border-radius: var(--radius);
    background: var(--color-surface);
    color: inherit;
  }

  .field input:disabled {
    background: var(--color-page);
  }

  .hint {
    margin: 0;
    color: var(--color-muted);
    font-size: 0.875rem;
  }

  /* Cada campo reserva siempre la línea de su error: si el mensaje apareciera empujando
     todo lo de abajo, la página daría un salto cada vez que alguien se equivoca
     (y los saltos se miden: Lección 11). */
  .field-error {
    min-height: 1.5rem;
    margin: 0;
    color: var(--color-down-text);
    font-weight: 600;
  }

  /* El error se ve cuando el navegador sabe que la persona intervino (:user-invalid)
     o cuando nuestro código lo marcó (aria-invalid). Con .field delante, el selector
     pesa más que «.field input» y gana sin !important. */
  .field :user-invalid,
  .field [aria-invalid="true"] {
    border-color: var(--color-down-text);
    background: var(--color-down-bg);
  }
}
```

**Comment tu vérifies.** Avec la fenêtre à plus de 1024 px de large (64em), écris dans la console `getComputedStyle(document.querySelector("#services")).gridRowStart`. Il doit répondre `"span 2"` ; dans une fenêtre plus étroite, `"auto"`, parce que la règle vit à l'intérieur du `@media`.

#### Étape 6 — `js/form.js` : des drapeaux aux phrases

**Ce que ça fait et pourquoi.** Il traduit les drapeaux de `validity` en phrases. Chaque champ a sa table de messages. La recherche parcourt les drapeaux dans l'ordre où ils sont écrits (c'est pourquoi, avec `-5`, on obtient « No puede ser negativo. » (Ne peut pas être négatif.) et non le message de la grille), et s'il n'y a pas de phrase propre elle utilise le texte du navigateur en dernier recours. `readService` assemble le service depuis le formulaire avec les mêmes clés que `data/services.json`, et lui donne un nouvel `id` avec [`crypto.randomUUID()`](https://developer.mozilla.org/fr/docs/Web/API/Crypto/randomUUID), qui génère un identifiant qui ne se répète pas : l'`id` de la leçon 6 est ce qui identifie un service, et un service qui naît dans le formulaire a lui aussi besoin du sien. (Cette fonction n'existe que dans les pages sécurisées : servies par `https`, ou depuis ta propre machine, comme `127.0.0.1`.) Deux éléments d'écriture que tu connais déjà : la boucle `for (const flag in forControl)` parcourt les noms des propriétés de la table de messages, comme le `for…in` de la figure 10.2, et `MESSAGES[control.id] ?? {}` utilise la coalescence des nuls de la leçon 6 pour qu'un champ sans table propre reçoive un objet vide au lieu de `undefined`.

```js
// panel/js/form.js
// Traduce lo que el navegador sabe de un campo a una frase para la persona, y lee el
// formulario. No dibuja nada: recibe un control y devuelve texto.

// Para cada campo, qué decir según la regla que incumple (las banderas de `validity`).
const MESSAGES = {
  "new-name": {
    valueMissing: "Escribe el nombre del servicio.",
    tooShort: "Usa al menos 2 caracteres.",
    patternMismatch: "Sin espacios al inicio ni al final.",
  },
  "new-status": {
    valueMissing: "Elige el estado del servicio.",
  },
  "new-response-ms": {
    valueMissing: "Escribe el tiempo en milisegundos.",
    badInput: "Escribe un número, como 250.",
    rangeUnderflow: "No puede ser negativo.",
    rangeOverflow: "El máximo es 60 000 ms.",
    stepMismatch: "Escribe un número entero.",
  },
};

// Devuelve el texto del error de un control, o "" si el control es válido.
// El orden de las banderas en MESSAGES es el orden de prioridad: varias pueden
// estar encendidas a la vez y se dice una sola, la primera.
export function errorMessage(control) {
  if (!control.willValidate || control.validity.valid) {
    return "";
  }
  if (control.validity.customError) {
    return control.validationMessage; // el texto que puso setCustomValidity
  }
  const forControl = MESSAGES[control.id] ?? {};
  for (const flag in forControl) {
    if (control.validity[flag]) {
      return forControl[flag];
    }
  }
  return control.validationMessage; // último recurso: el texto del navegador
}

// Lee un formulario ya validado y arma el servicio con las mismas claves que data/services.json.
// Un campo desactivado no viaja en FormData: un servicio caído queda con responseMs en null.
export function readService(form) {
  const data = new FormData(form);
  const time = data.get("responseMs");
  return {
    id: crypto.randomUUID(), // un identificador nuevo, que no choca con ninguno
    name: data.get("name").trim(),
    status: data.get("status"),
    responseMs: time === null ? null : Number(time),
  };
}
```

**Comment tu vérifies.** Maintenant que le HTML de l'étape 4 a les champs, écris dans la console `const form = await import("./js/form.js")` puis `form.errorMessage(document.querySelector("#new-name"))`. Il doit répondre `"Escribe el nombre del servicio."` (Écris le nom du service.) : le champ est vide, il est `required`, et la fonction a traduit le drapeau `valueMissing` en la phrase de sa table. Que la section soit masquée ne change rien, parce que `hidden` ne retire pas un champ de la validation ; `disabled`, si.

#### Étape 7 — `js/view.js` et `js/main.js`, ensemble

**Ce que ça fait et pourquoi.** C'est l'étape qui branche tout, et c'est pourquoi ce sont deux fichiers qui vont ensemble. Dans la vue, `renderCount` est nouvelle et s'exporte à part pour que `main.js` puisse la retarder ; `render` décide aussi quand la zone du formulaire se voit et quand le tableau se voit (sans lignes, il est masqué).

Et `js/main.js` grossit de deux blocs à la fin, les filtres et le formulaire. Avant de le lire, voici les décisions que tu y trouveras, chacune avec sa raison :

- L'écouteur des boutons radio est sur le `<fieldset>` et non sur chaque bouton : l'événement `change` remonte dans l'arbre, comme le `click` de la leçon 7, donc un seul sert les trois.
- Dans l'écouteur de `invalid`, la condition `event.target === form.querySelector(":invalid")` n'est vraie que pour le premier champ invalide dans l'ordre du document. C'est pourquoi le focus et l'avertissement général ont lieu une fois, même si le navigateur déclenche l'événement trois fois.
- Dans l'écouteur de `input`, la première ligne vide l'avertissement du formulaire : si une personne corrige et continue d'écrire, « No se agregó: hay 3 campos con error » (Non ajouté : il y a 3 champs en erreur) n'est plus vrai et ne doit pas rester.
- Dans l'écouteur de `focusout`, la condition regarde `:user-invalid` ou la marque propre. C'est le moment de montrer l'erreur d'un champ que la personne modifie et abandonne. Il utilise `focusout` et non `blur` parce que `focusout` remonte bien dans l'arbre ([MDN](https://developer.mozilla.org/fr/docs/Web/API/Element/focusout_event)), et un seul écouteur sur le formulaire sert les trois champs.
- Dans celui de `submit`, `FormData` ([MDN](https://developer.mozilla.org/fr/docs/Web/API/FormData)) lit le formulaire par l'attribut `name` de chaque champ, et les champs désactivés n'y entrent pas. C'est pourquoi un service en panne n'apporte pas de `responseMs` et `readService` conserve `null`, ce que comprennent déjà `js/stats.js` et le tableau.

Un avertissement sur l'ordre : **ne recharge pas entre les deux fichiers**. La nouvelle vue attend des éléments (`addZone`, `tableZone`, `count`) que seul le nouveau `main.js` lui remet. Si tu enregistres `view.js`, recharges et as encore le `main.js` de la leçon 9, le tableau reste vide et la console de Chrome dit `Cannot set properties of undefined (setting 'hidden')` : la vue a essayé de masquer une zone que personne ne lui a passée. C'est ainsi qu'on l'a vérifié en préparant la leçon ; si cela t'arrive, ce n'est pas une erreur de ta vue : c'est le fichier suivant qui manque.

D'abord la vue :

```js
// panel/js/view.js
// Dibuja el estado en el documento, con sus tres situaciones: cargando, error y vacío.
// Todo texto de los datos entra con textContent.
import { summarize } from "./stats.js";
import { situation, visible, selectedService } from "./state.js";

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

function renderSummary(services, elements) {
  const summary = summarize(services);
  elements.total.textContent = String(services.length);
  elements.available.textContent = `${summary.available} de ${services.length}`;
  elements.down.textContent = String(summary.down);
  elements.average.textContent = summary.averageMs === null ? "sin datos" : `${summary.averageMs} ms`;
}

// El aviso de cuántos servicios se ven. Vive aparte porque a veces se anuncia con retraso (ver main.js).
export function renderCount(state, elements) {
  const total = state.services.length;
  const shown = visible(state).length;
  elements.count.textContent = shown === 0
    ? "Ningún servicio coincide con el filtro."
    : `Mostrando ${shown} de ${total} ${total === 1 ? "servicio" : "servicios"}.`;
}

// elements = { notice, errorNotice, retry, dataZone, addZone, tableZone, count, checkedAt,
//              total, available, down, average, body, detail, sortButton }
// options.count = false deja el aviso del conteo como estaba (main.js lo actualiza después).
export function render(state, elements, options = {}) {
  const current = situation(state);

  // Un solo lugar decide qué se ve. Los textos de aviso son nuestros, no vienen de fuera.
  elements.notice.textContent =
    current === "loading" ? "Cargando servicios…" :
    current === "empty" ? "No hay servicios que revisar." : "";
  elements.errorNotice.textContent = current === "error" ? state.errorMessage : "";
  // Tras un error o una lista vacía hay que poder pedir otra vez, y «Revisar ahora» vive
  // en la zona de datos, que en esos dos casos está oculta: por eso se muestra «Reintentar».
  elements.retry.hidden = current !== "error" && current !== "empty";
  elements.dataZone.hidden = current !== "ready";
  // El formulario también sirve cuando la lista llegó vacía: ahí se da de alta el primero.
  elements.addZone.hidden = state.phase !== "ready";
  renderCheckedAt(state.checkedAt, elements.checkedAt);

  // Cargando o con error no hay cifras que mostrar; vacío sí: cero servicios es un resultado.
  if (current === "loading" || current === "error") {
    for (const cell of [elements.total, elements.available, elements.down, elements.average]) {
      cell.textContent = "";
    }
  } else {
    renderSummary(state.services, elements);
  }

  if (current !== "ready") {
    elements.body.replaceChildren();
    elements.detail.textContent = "";
    return;
  }

  elements.sortButton.setAttribute("aria-pressed", String(state.sortByTime));

  const rows = visible(state).map((service) => createRow(service, service.id === state.selected));
  elements.body.replaceChildren(...rows);
  elements.tableZone.hidden = rows.length === 0;
  if (options.count !== false) {
    renderCount(state, elements);
  }

  const chosen = selectedService(state);
  elements.detail.textContent = chosen === null ? "Elige un servicio para ver su detalle." : describe(chosen);
}
```

Ensuite la logique. Lis `js/main.js` de haut en bas : d'abord ce que tu avais déjà (chargement, tri, sélection) puis les filtres et le formulaire, avec un commentaire qui explique le pourquoi de chaque bloc :

```js
// panel/js/main.js
// Junta las piezas: pide los datos, guarda el resultado en el estado y dibuja.
import { loadServices } from "./load.js";
import {
  createState, startLoading, loadSucceeded, loadFailed, toggleSort, select,
  changeFilter, nameExists, addService, visible, situation,
} from "./state.js";
import { render, renderCount } from "./view.js";
import { errorMessage, readService } from "./form.js";

// Casos de prueba para ver cada situación sin romper nada: index.html?case=empty
// Es una lista cerrada: el texto de la dirección elige UNA de estas opciones, nunca se usa como dirección.
const CASES = {
  normal: { url: "data/services.json", timeoutMs: 3000 },
  empty: { url: "data/services-empty.json", timeoutMs: 3000 },
  error: { url: "data/missing.json", timeoutMs: 3000 },
  invalid: { url: "index.html", timeoutMs: 3000 },
  // ?delay=5000 solo lo entiende slow-server.py, que tarda 5 s en contestar; el límite son 3 s.
  timeout: { url: "data/services.json?delay=5000", timeoutMs: 3000 },
};
const requested = new URLSearchParams(location.search).get("case");
const current = Object.hasOwn(CASES, requested) ? CASES[requested] : CASES.normal;

const elements = {
  notice: document.querySelector("#notice"),
  errorNotice: document.querySelector("#error-notice"),
  retry: document.querySelector("#retry"),
  dataZone: document.querySelector("#data-zone"),
  addZone: document.querySelector("#add-zone"),
  tableZone: document.querySelector("#table-zone"),
  count: document.querySelector("#count"),
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
  // El botón que pidió la carga se oculta mientras carga, y con él se va el foco:
  // se anota para devolverlo al terminar.
  const fromButton = document.activeElement === elements.checkNow || document.activeElement === elements.retry;
  startLoading(state);
  render(state, elements);
  try {
    loadSucceeded(state, await loadServices(current.url, current.timeoutMs), new Date());
  } catch (error) {
    loadFailed(state, error.message);
  }
  render(state, elements);
  if (fromButton) {
    (situation(state) === "ready" ? elements.checkNow : elements.retry).focus();
  }
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
elements.retry.addEventListener("click", load);

// Delegación: un solo oyente en el <tbody> atiende los botones de todas las filas.
elements.body.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-id]");
  if (button === null) return;
  update(() => select(state, button.dataset.id));
});

// ---- filtros ----
// La tabla se redibuja con cada tecla, pero el aviso del conteo espera a que la persona deje de
// escribir: un lector de pantalla no debe leer "Mostrando 4", "Mostrando 3", "Mostrando 1" letra por letra.
let timer;
function announceCountLater() {
  clearTimeout(timer);
  timer = setTimeout(() => renderCount(state, elements), 400);
}

document.querySelector("#search").addEventListener("input", (event) => {
  changeFilter(state, { text: event.target.value });
  render(state, elements, { count: false });
  announceCountLater();
});

// Un solo oyente para los tres radios: el evento change sube hasta el <fieldset>.
document.querySelector("#status-filter").addEventListener("change", (event) => {
  changeFilter(state, { status: event.target.value });
  render(state, elements);
});

// ---- formulario: agregar un servicio ----
const form = document.querySelector("#add-form");
const nameField = document.querySelector("#new-name");
const statusField = document.querySelector("#new-status");
const timeField = document.querySelector("#new-response-ms");
const formResult = document.querySelector("#form-result");

// Escribe (o borra) el texto del error de un campo y marca el campo para los lectores de pantalla.
function paint(control) {
  const text = errorMessage(control);
  document.querySelector(`#${control.id}-error`).textContent = text;
  if (text === "") {
    control.removeAttribute("aria-invalid");
  } else {
    control.setAttribute("aria-invalid", "true");
  }
}

// Un servicio caído no tiene tiempo de respuesta: se desactiva el campo (y deja de validarse).
function syncTime() {
  const down = statusField.value === "down";
  timeField.disabled = down;
  if (down) {
    timeField.value = "";
    paint(timeField);
  }
}

// La regla que el navegador no conoce: el nombre no puede repetirse. SIEMPRE con su rama que limpia.
function validateUniqueName() {
  nameField.setCustomValidity(
    nameExists(state, nameField.value) ? "Ya existe un servicio con ese nombre." : "",
  );
}

// El navegador dispara "invalid" en cada campo inválido cuando se intenta enviar. Cancelarlo apaga su
// burbuja; en su lugar escribimos el mensaje en la página, donde se queda y un lector de pantalla lo lee.
// "invalid" no sube por el árbol: por eso se escucha en la fase de captura (el tercer argumento).
form.addEventListener("invalid", (event) => {
  event.preventDefault();
  paint(event.target);
  if (event.target === form.querySelector(":invalid")) {
    const howMany = form.querySelectorAll(":invalid").length;
    formResult.textContent = howMany === 1
      ? "No se agregó: hay 1 campo con error."
      : `No se agregó: hay ${howMany} campos con error.`;
    event.target.focus();
  }
}, true);

form.addEventListener("input", (event) => {
  const control = event.target;
  formResult.textContent = "";
  if (control === nameField) validateUniqueName();
  if (control === statusField) syncTime();
  if (control.getAttribute("aria-invalid") === "true") paint(control);
});

form.addEventListener("focusout", (event) => {
  const control = event.target;
  if (control.matches(":user-invalid") || control.hasAttribute("aria-invalid")) paint(control);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const service = readService(form);
  addService(state, service);
  form.reset();
  syncTime();
  render(state, elements);
  const hidden = visible(state).includes(service) ? "" : " El filtro actual lo oculta.";
  formResult.textContent =
    `Servicio «${service.name}» agregado. Ahora hay ${state.services.length}.${hidden}`;
  nameField.focus();
});

load();
```

**Comment tu vérifies.** Essaie maintenant le tableau de bord, avec le serveur démarré depuis le dossier `programas/` du dépôt, à `http://127.0.0.1:8000/10-formularios-validacion/panel/`. Ces étapes ont été vérifiées dans Chrome 154 avec la fenêtre à 320 px de large :

1. Écris `catalo` dans « Buscar servicio » : il reste une ligne et, une demi-seconde plus tard, l'avertissement dit « Mostrando 1 de 5 servicios. » (Affichage de 1 service sur 5.).
2. Coche « Caídos » dans le groupe « Mostrar » sans effacer le texte : aucune ligne ne correspond, le tableau se masque et l'avertissement dit « Ningún servicio coincide con el filtro. » (Aucun service ne correspond au filtre.). Efface le texte et il ne reste que `Inventario`.
3. Coche de nouveau « Todos » et appuie sur « Agregar servicio » avec tout vide : le focus tombe sur « Nombre », trois messages rouges apparaissent et l'avertissement dit « No se agregó: hay 3 campos con error. ».
4. Écris `catalogo`, choisis « Disponible » et écris `100` : en appuyant sur « Agregar servicio », le nom dit « Ya existe un servicio con ese nombre. » (Un service portant ce nom existe déjà.) (ni les majuscules ni l'accent n'importent).
5. Change le nom en `facturas` et le temps en `-5` : le message dit « No puede ser negativo. ». Corrige-le en `230` : le message disparaît à la frappe et, à l'envoi, l'avertissement dit « Servicio «facturas» agregado. Ahora hay 6. » (Service « facturas » ajouté. Il y en a maintenant 6.). Le récapitulatif passe à 6 services vérifiés, 5 sur 6 disponibles, 1 en panne et 418 ms de réponse moyenne.
6. Choisis « Caído » comme état : le champ du temps se désactive et se vide. Écris un nouveau nom et envoie : le service est ajouté sans temps, et dans le tableau apparaît « sin respuesta ».
7. Ouvre `?case=empty` : apparaissent « No hay servicios que revisar. », « Reintentar » et le formulaire. Ajoute un service : le tableau apparaît avec une ligne et « Reintentar » se masque, parce que « Revisar ahora » est de nouveau visible.

La console, pendant tout le parcours, reste vide.
## L'erreur que tu vas voir

Le message vient de la console et apparaît quand tu envoies un formulaire où il y a un champ obligatoire que la personne ne peut pas voir. La page le provoque exprès : le second champ est `required` mais masqué avec `display: none`.

```html
<!-- fig10_05.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Un campo obligatorio que no se puede ver</title>
  <link rel="icon" href="data:,">
</head>
<body>
  <main>
    <h1>Un campo obligatorio que no se puede ver</h1>

    <form id="form">
      <p>
        <label for="email">Correo *</label>
        <input id="email" name="email" type="email" required>
      </p>
      <p>
        <label for="note">Nota *</label>
        <input id="note" name="note" type="text" required style="display: none">
      </p>
      <button type="submit">Enviar</button>
    </form>
  </main>
</body>
</html>
```

Ouvre-la, écris un courriel valide et appuie sur « Enviar ». Rien de visible ne se passe : le formulaire n'est pas envoyé et il n'y a pas de bulle. Dans la console apparaît :

```text
An invalid form control with name='note' is not focusable.
```

Le navigateur a essayé de faire comme d'habitude : trouver le premier champ invalide et y envoyer le focus pour afficher le message. Mais un champ masqué ne peut pas recevoir le focus, donc il n'y a nulle part où l'afficher, et l'envoi reste bloqué sans que la personne sache pourquoi. Le texte du message est celui du navigateur (Chrome 154 ; dans un autre navigateur la phrase change) et dans sa forme `name='note'` il porte l'attribut `name` du champ coupable, ce qui te dit lequel chercher.

Il y a trois corrections, par ordre de préférence. Si le champ n'est pas nécessaire, retire le `required` tant qu'il est masqué. S'il doit exister mais ne pas se voir, désactive-le avec `disabled` (il sort de la validation, comme tu l'as vu avec le temps du tableau de bord). Et s'il doit se voir dès qu'il s'active, montre-le avant d'essayer d'envoyer. Ce qui ne corrige rien, c'est de faire taire le message : c'est le symptôme que quelqu'un a laissé un piège dans le formulaire.

## Ce qui se fait de travers

**Traiter la validation du client comme une protection.** *À quoi ça ressemble :* « le formulaire valide déjà le courriel, donc c'est bon ». *Coût :* n'importe qui la contourne en deux clics dans les outils du navigateur ou en envoyant la requête sans navigateur. Si ton tableau de bord a un serveur, la règle s'y répète ; s'il n'en a pas, la donnée ne doit pas être dangereuse par elle-même, et c'est pourquoi le tableau de bord la dessine avec `textContent`.

**Peindre `:invalid` dès le départ.** *À quoi ça ressemble :* le formulaire s'ouvre en rouge. *Coût :* qui arrive se sent grondé avant de commencer, et qui utilise un lecteur d'écran entend une liste d'erreurs dans des champs qu'il n'a même pas vus. Utilise `:user-invalid` ou la marque propre après la première tentative.

**Mettre un message dans `setCustomValidity` et ne pas le nettoyer.** *À quoi ça ressemble :* un champ qui « a l'air bien » et ne laisse pas envoyer. *Coût :* c'est l'erreur la plus difficile à déboguer de la leçon, parce qu'il n'y a aucun message d'erreur du programme. Chaque branche qui pose un message a besoin de sa branche qui le retire ; le tableau de bord le fait en une ligne avec une conditionnelle.

**Un `pattern` à la syntaxe invalide.** *À quoi ça ressemble :* `pattern="[\w-]+"` et la règle ne s'applique jamais. *Coût :* la console de Chrome dit « Pattern attribute value [\w-]+ is not a valid regular expression », mais le formulaire n'affiche rien, de sorte que la règle disparaît en silence. Échappe le tiret (`[\w\-]+`) et, surtout, essaie avec une valeur qui devrait échouer.

**L'erreur seulement en couleur, seulement dans la bulle ou seulement dans le `placeholder`.** *À quoi ça ressemble :* un champ avec une bordure rouge et rien d'autre, ou un indice à l'intérieur du champ en gris clair qui disparaît à la frappe. *Coût :* on perd qui ne distingue pas les couleurs, qui utilise un lecteur d'écran et qui a besoin de relire. Le libellé est un libellé (`<label>`), l'erreur est du texte, et tous deux vivent en dehors du champ.

**Un `type="number"` pour ce qui n'est pas une quantité.** *À quoi ça ressemble :* un champ de numéro de dossier, de téléphone ou de code postal avec des flèches pour monter et descendre. *Coût :* on change la valeur avec la molette de la souris sans le vouloir, on perd les zéros à gauche, et le lecteur d'écran annonce un bouton pour monter et descendre (`spinbutton`) là où il n'y a aucune quantité à monter ni à descendre. Pour ces données, du texte avec `inputmode="numeric"`.

**Annoncer chaque touche.** *À quoi ça ressemble :* l'avertissement du filtre change à chaque lettre. *Coût :* le lecteur d'écran devient une mitraillette et qui l'utilise se perd. Attends que la personne ait fini d'écrire, comme le fait le tableau de bord avec ses 400 ms.

**Désactiver le bouton d'envoi tant que tout n'est pas valide.** *À quoi ça ressemble :* un bouton gris sans explication. *Coût :* qui ne voit pas le bouton désactivé ne sait pas pourquoi il n'avance pas, et aucun message ne l'explique. Laisse le bouton actif et explique ce qui manque au moment de la tentative.

## Exercices

### Exercice 1 — Prédire les drapeaux

Sans rien ouvrir, écris quels drapeaux de `validity` s'allument dans chaque cas, et vérifie ensuite avec `fig10_02.html` : (a) champ vide avec `required` ; (b) `250` dans un champ avec `min="0" max="60000" step="100"` ; (c) `-100` dans ce même champ ; (d) `60050` dans ce même champ.

### Exercice 2 — Une règle à toi dans le tableau de bord

Ajoute au formulaire du tableau de bord une seconde règle pour le nom : il ne peut être ni `admin` ni `test` (quelles que soient les majuscules). Elle doit utiliser `setCustomValidity`, nettoyer le message quand le nom est correct et afficher un texte propre qui dise quoi faire, pas seulement ce qui ne va pas. Vérifie que le champ redevient valide quand tu le corriges.

### Exercice 3 — Effacer les filtres

Ajoute un bouton « Limpiar filtros » (Effacer les filtres) à la barre de contrôles. En appuyant dessus, il doit : vider le texte, recocher « Todos », redessiner le tableau et rendre le focus au champ de recherche. Réfléchis à ce qui se passe avec la région `role="status"` si le texte du décompte ne change pas.

## Solutions

**Exercice 1.** (a) `valueMissing`. (b) `stepMismatch` : 250 est dans la plage mais n'est pas un multiple de 100 en comptant depuis 0. (c) `rangeUnderflow` ; de plus, `-100` est bien un multiple de 100, donc `stepMismatch` **ne** s'allume **pas**. (d) `rangeOverflow` et `stepMismatch`, parce que 60050 tombe aussi hors de la grille. Si tu t'es trompé en (c), la leçon est que `step` et `min` ne sont pas indépendants : la grille se mesure depuis `min`, et une valeur peut être hors plage sans être hors grille.

**Exercice 2.** Modifie `validateUniqueName` dans `js/main.js` pour qu'elle décide entre trois cas et nettoie dans le dernier :

```js
const RESERVED = ["admin", "test"];

function validateUniqueName() {
  const value = nameField.value.trim().toLowerCase();
  if (RESERVED.includes(value)) {
    nameField.setCustomValidity(`«${value}» está reservado. Elige un nombre que describa el servicio.`);
  } else if (nameExists(state, nameField.value)) {
    nameField.setCustomValidity("Ya existe un servicio con ese nombre.");
  } else {
    nameField.setCustomValidity("");
  }
}
```

La branche finale est celle qui évite que le champ reste invalide pour toujours. Comme `errorMessage` lit déjà `validationMessage` quand il y a `customError`, il n'y a rien d'autre à toucher. Vérifie le cas où tu écris `admin`, envoies (le message apparaît) puis corriges en `admin2` : le message disparaît à la frappe.

**Exercice 3.** Dans `index.html`, à l'intérieur de la barre de contrôles, à côté de « Revisar ahora », un `<p><button type="button" id="clear-filters">Limpiar filtros</button></p>`. Dans `js/main.js` :

```js
document.querySelector("#clear-filters").addEventListener("click", () => {
  changeFilter(state, { text: "", status: "all" });
  document.querySelector("#search").value = "";
  document.querySelector('input[name="filter"][value="all"]').checked = true;
  render(state, elements);
  document.querySelector("#search").focus();
});
```

Le décompte se redessine tout seul, parce que `render()` appelle `renderCount()`. Mais il y a un piège : si le texte de l'avertissement était déjà « Mostrando 5 de 5 servicios. », le contenu ne change pas et les lecteurs d'écran ne le répètent généralement pas. C'est un bon cas où *ne pas annoncer* est correct : il n'y a rien de nouveau à dire (une région live annonce des changements, pas des répétitions). Si tu voulais annoncer l'action elle-même, écris « Filtros limpiados. » (Filtres effacés.) dans l'avertissement du formulaire ou dans une région propre.

## Comment savoir que j'ai réussi

Les vérifications sont mesurables. Démarre le serveur depuis le dossier `programas/` du dépôt téléchargé et ouvre le tableau de bord :

```bash
cd programas
python3 -m http.server 8000 --bind 127.0.0.1
```

Ouvre `http://127.0.0.1:8000/10-formularios-validacion/panel/`.

- [ ] **Clavier :** avec seulement Tab, Maj+Tab, Entrée et les flèches, tu arrives à la recherche, aux boutons radio, à « Revisar ahora », au bouton de tri, aux boutons « Ver detalle », aux trois champs et au bouton d'ajout ; le contour de focus se voit sur chacun ; et tu ajoutes un service sans toucher à la souris.
- [ ] **Console :** dans l'onglet Console, il n'y a aucune erreur ni aucun avertissement après avoir rechargé et parcouru les sept étapes du parcours par lequel se clôt la section 10.5.
- [ ] **320 px :** dans le mode appareil des outils, à 320 px de large, il n'apparaît pas de barre de défilement horizontale. Dans la console, `document.documentElement.scrollWidth <= document.documentElement.clientWidth` renvoie `true`.
- [ ] **Les erreurs se lisent :** avec le formulaire vide, après avoir appuyé sur « Agregar servicio », `document.querySelector("#new-name").getAttribute("aria-invalid")` renvoie `"true"` et `document.querySelector("#new-name-error").textContent` renvoie une phrase.
- [ ] **Le filtre :** avec le texte `catalo`, `document.querySelectorAll("#services-body tr").length` renvoie `1`.
- [ ] **Le champ désactivé reste dehors :** avec « Caído » choisi, `document.querySelector("#new-response-ms").disabled` renvoie `true`.
- [ ] **Sans écran :** `filters-test.html` affiche onze lignes et toutes commencent par `ok`.
- [ ] **Lecteur d'écran :** active celui que fournit ton système (sous Linux Mint, Orca) et répète l'étape 3 de la section 10.5. Il doit dire le nom du champ, sa description et qu'il n'est pas valide.
- [ ] **Les figures :** `fig10_05.html` laisse dans la console le message « An invalid form control… is not focusable », et les autres ne laissent aucune erreur.

Et pour conclure, **trois questions de leçons précédentes** ; réponds-y sans regarder puis vérifie :

1. Dans la leçon 2 : quel élément HTML donne son nom à un champ, et pourquoi un `placeholder` ne le remplace-t-il pas ?
2. Dans la leçon 7 : pourquoi `js/view.js` utilise-t-il `textContent` et non `innerHTML` même si les données viennent de ton propre serveur ?
3. Dans la leçon 8 : que renvoie `fetch` devant un 404, et que faut-il vérifier pour ne pas le traiter comme des données ?

Note dans le journal de bord ce à quoi tu n'as pas pu répondre. Cette liste est ta révision de demain.

## Pour aller plus loin

- [Validation des formulaires côté client, dans MDN](https://developer.mozilla.org/fr/docs/Learn_web_development/Extensions/Forms/Form_validation) : le guide complet, avec l'API de validation et les exemples de messages personnalisés.
- [3.3.1 Identification des erreurs, dans les règles WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html) : ce qu'exige le critère et quelles techniques le satisfont.
- [`:user-invalid`, dans MDN](https://developer.mozilla.org/fr/docs/Web/CSS/:user-invalid) : quand il correspond et quand non.
- [Champs de texte, dans le système de design du gouvernement britannique](https://design-system.service.gov.uk/components/text-input/) : le guide le plus soigné sur `type="number"`, `inputmode`, `autocomplete` et `maxlength`.
