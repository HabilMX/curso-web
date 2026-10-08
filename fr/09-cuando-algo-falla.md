# Leçon 9 — Quand quelque chose échoue : délais d'attente, états, CORS et plusieurs requêtes

**Durée :** 2 × 45 min

**Ce que tu construis :** le tableau de bord qui dit toujours ce qui se passe : chargement, erreur ou vide, avec un délai d'attente pour ne pas attendre sans fin

**Ce que tu apprends :** délai d'attente avec `AbortSignal.timeout` ; distinguer les défaillances par leur nom ; les trois états : chargement, erreur et vide ; l'erreur CORS ; plusieurs requêtes à la fois avec `Promise.allSettled`

## À la fin, tu seras capable de

- Donner à chaque requête un délai d'attente et distinguer dans le code un délai dépassé d'une défaillance de connexion et d'une réponse qui n'est pas du JSON.
- Traduire chaque défaillance technique en une phrase que la personne qui utilise le tableau de bord peut comprendre.
- Montrer dans le tableau de bord les trois situations qui ne sont pas « tout s'est bien passé » : chargement, erreur et vide, chacune avec son avertissement et sa façon de s'annoncer à un lecteur d'écran.
- Expliquer pourquoi « vide » n'est pas une erreur et pourquoi on ne le conserve pas comme une phase de plus, mais on le déduit.
- Reconnaître dans la console l'erreur CORS, expliquer qui la produit et qui la corrige.
- Demander plusieurs choses à la fois sans qu'une défaillance emporte le résultat des autres, avec `Promise.allSettled`.

## Le pourquoi avant le comment

**Point de départ.** Cette leçon part du tableau de bord tel que l'a laissé la leçon 8. Ton tableau de bord demande déjà ses données à `data/services.json`, et la structure qui reste est la suivante :

- `index.html`, avec le `<tbody>` et les quatre `<dd>` du récapitulatif vides, l'heure dans `#checked-at`, le bouton `#check-now` (« Revisar ahora », Vérifier maintenant), le bouton « Ordenar por tiempo de respuesta » (Trier par temps de réponse) et la région du détail (`#detail`).
- `css/styles.css`, la feuille des leçons 3, 4, 5 et 7.
- `data/services.json`, avec les cinq services.
- `js/load.js`, qui demande les données en deux temps, vérifie `response.ok` et la forme de ce qui est arrivé, et lance une erreur si quelque chose ne colle pas.
- `js/stats.js`, avec `summarize` et les deux calculs de la leçon 6.
- `js/state.js`, avec la liste, l'heure d'arrivée, le tri et la sélection, et `loadSucceeded` pour conserver ce qui est arrivé.
- `js/view.js`, qui dessine l'état et l'heure, toujours avec `textContent`.
- `js/main.js`, qui demande les données au démarrage et avec « Revisar ahora », et laisse dans la console toute défaillance.

Et un nouveau fichier pour aujourd'hui, `data/services-empty.json`, le pendant de la liste pour le cas vide :

```json
[]
```

Une liste sans éléments, qui est du JSON valide : le serveur la livrera avec un 200, et ce sera le tableau de bord qui décidera ce que cela signifie.

**Ce qui manque aujourd'hui au tableau de bord.** Le tableau de bord de la leçon 8 fonctionne quand tout se passe bien, et **détecte** les défaillances, mais ne les raconte pas : il les laisse dans la console, que personne en dehors de qui programme n'ouvre. Un vrai rapport vit dans un monde où il se passe des choses qui n'arrivent jamais à un module local :

1. **Cela prend du temps.** Entre le moment où la page apparaît et celui où les données arrivent, il y a un intervalle, qui peut être de millisecondes ou de secondes. Que voit la personne entre-temps ? Un tableau vide ressemble à un tableau de bord cassé.
2. **Cela échoue.** Le serveur peut être éteint, le fichier peut avoir été déplacé, la connexion peut se couper. Que voit alors la personne ? Aujourd'hui, rien : la page semble figée.
3. **Cela arrive vide.** Le serveur répond bien, mais la liste n'a aucun service. Ce n'est pas une défaillance, mais ce n'est pas non plus un tableau. Que voit la personne ?
4. **Il ne répond pas.** Le serveur reçoit la requête et ne répond jamais. La promesse de `fetch` reste en attente pour toujours, sans être tenue ni rompue, et il n'y a même pas d'erreur à attraper.

Un tableau de bord terminé montre **les trois** premières situations comme des écrans distincts, et convertit la quatrième en erreur avec une limite de temps. C'est le quatrième des cinq critères avec lesquels tu sais que tu as terminé le cours : *il montre les trois états, chargement, erreur et vide*. Cette leçon te le laisse accompli.

**Pourquoi c'est si important.** La plupart des tutoriels enseignent le chemin heureux et s'arrêtent là, parce que c'est ce qui fait bien dans une démonstration. Mais qui utilise un tableau de bord de services l'ouvre précisément quand il soupçonne que quelque chose ne va pas. Si à ce moment la page reste blanche, ou dit « il n'y a pas de services » parce que le réseau a échoué, la personne prend une mauvaise décision : elle attend alors qu'elle devait agir, ou se rassure alors qu'elle devait s'inquiéter. Un tableau de bord qui ment dans ses défaillances est pire que pas de tableau de bord. C'est pourquoi cette leçon est, pour qui utilise le `revisor`, la plus importante du cours.

**Quel chemin suit la leçon.** D'abord le **délai d'attente**, pour qu'une requête n'attende pas indéfiniment, et le module `js/load.js` dans sa version complète, qui distingue chaque défaillance par son nom et la traduit en une phrase. Ensuite **les trois états** à l'écran, qui est la partie que les gens voient et que presque personne n'enseigne. Puis **plusieurs requêtes à la fois**, dont le `revisor` aura besoin quand il vérifiera beaucoup de services. Et à la fin, l'erreur que tôt ou tard rencontre quiconque demande des données à un autre endroit : **CORS**.

**Ce qu'il te faut en marche.** Seulement le serveur local habituel (et, pour la dernière figure, un second serveur que tu démarreras sur place). Les pages de cette leçon se trouvent dans [`programas/09-cuando-algo-falla/`](https://github.com/HabilMX/curso-web/tree/main/programas/09-cuando-algo-falla) du [dépôt du cours](https://github.com/HabilMX/curso-web) ; avec le dépôt téléchargé sur ton ordinateur, démarre le serveur depuis son dossier `programas/` :

```bash
cd programas
python3 -m http.server 8000 --bind 127.0.0.1
```

Ouvre `http://127.0.0.1:8000/09-cuando-algo-falla/panel/`. Comme dans la leçon 8, `fetch` et les modules ne fonctionnent pas avec `file://`. Rien d'autre n'est nécessaire : ni Node ni paquets.

## Les concepts

Ils sont trois. Comme dans les leçons précédentes : avant d'exécuter chaque figure, **écris dans le journal de bord ce que tu crois qu'il va se passer**.

### 9.1 Ne pas attendre pour toujours : le délai d'attente

**Le problème.** Rappelle-toi le tableau de 8.1 : la promesse de `fetch` est tenue quand une réponse arrive et rompue quand il n'y a pas de connexion. Mais il y a une troisième façon pour une requête de mal tourner, et c'est la plus cruelle parce qu'elle ne produit aucune erreur : **il ne se passe rien**. Le serveur ne répond pas, le réseau est suspendu, et la promesse reste en attente, sans être tenue ni rompue. Un tableau de bord sans délai d'attente reste sur « Cargando… » (Chargement…) pour toujours ; la personne ne sait pas s'il faut attendre, recharger ou abandonner. La solution est de décider combien de temps on veut bien attendre et de couper là.

Le mécanisme est un **signal d'annulation**. `fetch` accepte dans ses options un `signal`, et si ce signal est « activé » avant la fin de la requête, `fetch` l'abandonne et sa promesse est rompue. Pour le cas du délai d'attente, il y a une pièce toute prête : `AbortSignal.timeout(milisegundos)` crée un signal qui s'active tout seul quand ce temps s'est écoulé, et l'erreur avec laquelle la promesse est rompue s'appelle `TimeoutError` ([MDN : `AbortSignal.timeout`](https://developer.mozilla.org/fr/docs/Web/API/AbortSignal/timeout_static)). On l'utilise ainsi : `fetch(url, { signal: AbortSignal.timeout(3000) })`. Le second argument de `fetch` est un objet d'options, comme ceux que tu as rencontrés dans la leçon 6 ; `signal` en est l'une des clés.

C'est une fonction relativement récente : elle est disponible dans les principaux navigateurs depuis avril 2024, et MDN l'étiquette « Baseline 2024 ». Elle atteint les trente mois qui séparent « récemment disponible » de « largement disponible » justement à cette période, donc si elle n'apparaît pas dans ton navigateur, mets-le à jour. Avant elle, on l'écrivait à la main avec un `AbortController` et un `setTimeout` ; ce n'est plus nécessaire.

Pour voir l'erreur, il faut un serveur qui tarde vraiment, et celui de `python3 -m http.server` répond en quelques millisecondes. C'est pourquoi cette leçon en apporte un qui lui est propre, `slow-server.py` : il sert le dossier comme celui d'habitude, mais si l'adresse porte `?delay=3000`, il attend ces trois mille millisecondes avant de répondre. Il n'y a rien à installer ; il n'utilise que la bibliothèque qu'apporte Python. Éteins le serveur habituel (Ctrl+C) et, depuis le dossier `programas/`, démarre celui-ci à sa place, sur le même port :

```bash
python3 09-cuando-algo-falla/slow-server.py
```

Il sert les mêmes pages à `http://127.0.0.1:8000/`, donc tout le reste fonctionne pareil. Voici son code ; tu n'as pas à l'écrire, mais il vaut la peine de le lire, parce qu'il est court et que tu connais presque tout ce qu'il fait :

```python
# slow-server.py
# Sirve una carpeta como lo hace `python3 -m http.server`, pero puede tardar a
# propósito: si la dirección lleva ?delay=MILISEGUNDOS, espera ese tiempo antes de
# contestar. Sirve para ver un tiempo límite que de verdad se agota.
#
# Uso:  python3 slow-server.py [carpeta] [puerto]
import sys
import time
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlsplit

# Nadie necesita esperar más de diez segundos para ver el efecto.
MAX_DELAY_MS = 10000


class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        query = parse_qs(urlsplit(self.path).query)
        delay = query.get("delay", ["0"])[0]
        if delay.isdigit():
            time.sleep(min(int(delay), MAX_DELAY_MS) / 1000)
        try:
            super().do_GET()
        except (BrokenPipeError, ConnectionResetError):
            # El navegador se cansó de esperar y cerró la conexión: es justo lo que se quería ver.
            pass


def main():
    folder = sys.argv[1] if len(sys.argv) > 1 else "."
    port = int(sys.argv[2]) if len(sys.argv) > 2 else 8000
    server = ThreadingHTTPServer(
        ("127.0.0.1", port), partial(Handler, directory=folder)
    )
    print(f"Sirviendo {folder} en http://127.0.0.1:{port}, con ?delay  (Ctrl+C para parar)", flush=True)
    server.serve_forever()


main()
```

L'important est dans `do_GET`, la fonction qui traite chaque requête : elle lit le nombre qui vient après `delay=`, s'endort pendant ce temps avec `time.sleep` (qui compte en secondes, c'est pourquoi on divise par mille), puis répond comme le serveur habituel. Les deux autres pièces : `ThreadingHTTPServer` traite chaque requête séparément, pour qu'une requête endormie n'arrête pas les autres ; et le `except` final fait taire l'avertissement que Python donnerait quand le navigateur, fatigué d'attendre, raccroche avant de recevoir la réponse, ce qui est justement ce qu'on veut provoquer. Le reste (`?delay` est ignoré si ce n'est pas un nombre, et on n'attend jamais plus de dix secondes) sert à ce que personne ne l'utilise par erreur pour suspendre ton ordinateur.

La figure 9.1 demande les données avec `?delay=3000` et une limite d'**une seconde**. Le serveur en met trois ; la limite gagne toujours, parce que la différence n'est pas de millisecondes mais de deux secondes entières. En préparant cette leçon, elle a donné `TimeoutError` dans 10 chargements sur 10 dans Chrome 154, toujours à une seconde du début. Et l'épreuve de contrôle, aussi dans 10 sur 10 : servie avec le `python3 -m http.server` habituel, qui ne comprend pas `?delay` et répond aussitôt, la même page dit « alcanzó a responder: el límite no se cumplió » (il a eu le temps de répondre : la limite n'a pas été atteinte). Si tu vois cette phrase, ce n'est pas une erreur de ton code : c'est que tu as démarré le serveur qui ne tarde pas.

```html
<!-- fig09_01.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 9.1 — el tiempo límite</title>
</head>
<body>
  <main>
    <h1>Fig. 9.1 — el tiempo límite</h1>
    <pre id="output">Cargando…</pre>
  </main>

  <script type="module">
    const output = document.querySelector("#output");

    try {
      // Un límite de 1 segundo para una respuesta que slow-server.py demora 3 (?delay=3000).
      // Con el servidor de siempre, ?delay se ignora y la respuesta llega a tiempo.
      await fetch("panel/data/services.json?delay=3000", { signal: AbortSignal.timeout(1000) });
      output.textContent = "alcanzó a responder: el límite no se cumplió";
    } catch (error) {
      output.textContent = `nombre del error: ${error.name}\nmensaje: ${error.message}`;
    }
  </script>
</body>
</html>
```

```text
nombre del error: TimeoutError
mensaje: signal timed out
```

Le message, `signal timed out`, est le texte de Chrome ; Firefox en écrit un autre, mais le **nom** de l'erreur est le même dans tous les navigateurs parce que c'est la spécification qui le fixe. C'est pourquoi le code demande toujours le nom et jamais le message. Le nom de l'erreur est `TimeoutError`. C'est la façon de distinguer dans le code un « n'a pas répondu à temps » d'un « il n'y a pas de connexion » (`TypeError`). Il existe un autre nom proche, `AbortError`, qui apparaît quand quelqu'un annule exprès avec un `AbortController` ; tu ne l'utilises pas aujourd'hui.

Deux précisions techniques qui coûtent cher si tu ne les connais pas. La première : **la limite continue de courir pendant la lecture du corps.** Si le serveur envoie les en-têtes immédiatement mais reste en plan avec le contenu, la promesse de `fetch` est tenue, et c'est `response.json()` qui est rompue avec `TimeoutError` en arrivant à la limite. C'est la précision que la dernière ligne du tableau de 8.1 laissait en suspens : le délai dépassé rompt la promesse de `fetch` seulement s'il survient **avant** l'arrivée des en-têtes ; après, la promesse a déjà été tenue et ne peut pas être « dé-tenue », donc ce qui est rompu, c'est la lecture du corps. Lors d'un essai avec un serveur qui envoyait le début d'un tableau JSON et attendait quatre secondes pour le reste, avec une limite d'une seconde, les en-têtes sont arrivés à 2 ms et la lecture du corps a été rompue avec `TimeoutError` à 1005. C'est pourquoi le code du tableau de bord vérifie `TimeoutError` dans **les deux** temps. La seconde : la seconde de la figure est pour la démonstration. Dans le tableau de bord, la limite est de trois secondes, ce qui est suffisant pour une mauvaise connexion et assez court pour que la personne ne s'impatiente pas.

**Le module qui demande les données, complet.** Dans la leçon 8, `js/load.js` laissait passer les erreurs telles qu'elles venaient : le `TypeError` d'un réseau tombé, le `SyntaxError` d'un JSON cassé. Cela servait à qui programme, qui les lit dans la console, mais pas à qui utilise le tableau de bord, qui a besoin d'une phrase qu'il comprenne. Maintenant le module **traduit** : il attrape chaque défaillance, regarde son nom et lance à sa place une erreur avec un message pour des personnes. Il suit toujours sa règle habituelle : **il ne touche pas au document**. Celui qui décide comment le montrer est la vue.

Avant le code, deux détails d'écriture qui y apparaissent pour la première fois. Le premier : dans `loadServices(url, timeoutMs = 3000)`, le `= 3000` est une **valeur par défaut** du paramètre ; si l'appelant ne passe pas le second argument, `timeoutMs` vaut 3000. Le second : `let response;` et `let data;` déclarent les variables **sans valeur** en dehors de chaque `try`, et à l'intérieur du `try` on leur en assigne une, la même astuce que `main.js` a utilisée dans la leçon 8 avec `services` : une variable déclarée à l'intérieur d'un bloc `{ … }` n'existe que dans ce bloc.

```js
// panel/js/load.js
// Pide la lista de servicios y devuelve un arreglo, o lanza un Error con un mensaje
// que una persona pueda leer. No toca el documento.

export async function loadServices(url, timeoutMs = 3000) {
  // Paso 1: la respuesta. Aquí fallan la red, el tiempo límite y los estados HTTP.
  let response;
  try {
    response = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
  } catch (error) {
    if (error.name === "TimeoutError") {
      throw new Error(`El servidor no respondió en ${timeoutMs} ms.`);
    }
    throw new Error("No se pudo conectar con el servidor.");
  }

  // fetch NO rechaza con un 404 o un 500: hay que mirarlo.
  if (!response.ok) {
    throw new Error(`El servidor respondió con el código ${response.status}.`);
  }

  // Paso 2: el cuerpo. El límite de tiempo sigue corriendo mientras se lee.
  let data;
  try {
    data = await response.json();
  } catch (error) {
    if (error.name === "TimeoutError") {
      throw new Error(`El servidor no terminó de responder en ${timeoutMs} ms.`);
    }
    if (error.name === "SyntaxError") {
      throw new Error("La respuesta no es JSON válido.");
    }
    // Cualquier otra falla al leer el cuerpo: la conexión se cortó a medias o el cuerpo
    // no se pudo decodificar. Desde aquí no se sabe cuál de las dos fue.
    throw new Error("No se pudo leer completa la respuesta del servidor.");
  }

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

- **Pourquoi y a-t-il deux `try` ?** Parce que ce sont deux temps avec deux sortes de défaillance distinctes. Le premier attrape ce qui se produit avant d'avoir une réponse : il n'y a pas de connexion, ou le délai est dépassé. Le second, ce qui se produit à la lecture du corps, et il y a là trois cas qu'il ne faut pas confondre. Selon [MDN sur `Response.json()`](https://developer.mozilla.org/fr/docs/Web/API/Response/json), la lecture peut être rompue avec `SyntaxError` (le texte n'est pas du JSON), avec une erreur d'abandon (ici, le `TimeoutError` de la limite) ou avec `TypeError`. Le `TypeError` ne dit pas une seule chose : il se peut que la connexion se soit coupée à mi-chemin ou que le corps n'ait pas pu être décodé (MDN donne l'exemple d'un en-tête `Content-Encoding` erroné). Depuis le code, on ne distingue pas lequel des deux c'était, donc le message ne dit que ce qui est sûr : « No se pudo leer completa la respuesta del servidor. » (La réponse du serveur n'a pas pu être lue en entier.). C'est pourquoi le second `catch` demande le nom : seul un `SyntaxError` mérite la phrase « no es JSON válido » (n'est pas du JSON valide) ; la dire devant une connexion coupée enverrait la personne chercher dans le fichier une erreur qui n'existe pas.
- **Pourquoi les messages sont-ils les nôtres et non le `error.message` du navigateur ?** Parce que le message du navigateur est écrit pour des programmeurs, en anglais, et change entre Chrome et Firefox (« Failed to fetch », « NetworkError when attempting to fetch resource »). Qui utilise le tableau de bord a besoin d'une phrase qu'il comprenne. Le détail technique, pour qui débogue, est déjà dans la console.
- **Qu'est-ce qui a changé par rapport à la leçon 8 ?** Les deux `try`, le délai d'attente et la traduction des messages. La vérification de `ok`, celle de `Array.isArray` et celle de `isService` sont les mêmes. Rappelle-toi pourquoi existe la dernière : un fichier avec `[null]` est du JSON parfaitement valide et c'est un tableau ; sans `isService`, ce `null` arrivait jusqu'à `summarize`, qui essayait de lire `service.status` de `null`, et le programme s'arrêtait avec un `TypeError` *en dehors* de tout `try` : le tableau de bord restait sans avertissement, sans tableau et sans explication. Avec la vérification, ce cas se termine par l'avertissement rouge « Algún servicio de la lista llegó incompleto o con datos de otro tipo. » (Un service de la liste est arrivé incomplet ou avec des données d'un autre type.), ce qui a été vérifié dans Chrome en préparant la leçon.

### 9.2 Les trois états : chargement, erreur et vide

**Ce qu'est une phase.** Le tableau de bord de la leçon 8 avait un état avec la liste, l'heure, le tri et la sélection. Maintenant il a besoin de savoir autre chose : **à quel moment du chargement il se trouve**. On ajoute un champ, `phase`, avec trois valeurs possibles :

- `"loading"` : on a demandé et il n'y a pas encore de résultat.
- `"error"` : on a demandé et cela a échoué ; dans `errorMessage` reste le texte pour la personne.
- `"ready"` : une liste est arrivée.

Et voici la décision de conception la plus fine de la leçon. Il restait une quatrième situation, **« vide »** : la liste est bien arrivée, mais elle n'a aucun service. Est-ce une quatrième phase ? Non : c'est une **conséquence**. Il n'y a pas à la conserver, elle se *déduit* de ce qui est déjà conservé : `phase === "ready"` et `services.length === 0`. Conserver deux faits qui peuvent se déduire l'un de l'autre est la recette pour qu'un jour ils se contredisent. La fonction `situation` fait la déduction à un seul endroit, renvoie `"empty"` dans ce cas, et tout l'écran l'interroge.

Un rappel d'écriture avant le code : `select` utilise l'**opérateur ternaire**, `condición ? valorSiSí : valorSiNo`, que la leçon 6 a présenté dans « Décider, répéter et signaler une erreur ». C'est un `if` qui *renvoie une valeur* et c'est pourquoi il tient dans une affectation : `state.selected === id ? null : id` vaut `null` si le service était déjà choisi et `id` sinon.

Par rapport à la leçon 8, trois choses changent : `createState` gagne deux champs, `phase` (qui commence à `"loading"`) et `errorMessage` ; `loadSucceeded` fait en plus passer la phase à `"ready"` ; et trois fonctions apparaissent, `startLoading`, `loadFailed` et `situation`. Le reste est inchangé.

```js
// panel/js/state.js
// El estado del panel y las únicas formas de cambiarlo.
// No toca el documento: por eso se puede probar sin pantalla.

export function createState() {
  return {
    phase: "loading",       // "loading" | "error" | "ready"
    services: [],
    errorMessage: null,     // texto para la persona, solo en la fase "error"
    checkedAt: null,        // cuándo llegaron los datos por última vez (un Date), o null
    sortByTime: false,      // false = en el orden original; true = del más rápido al más lento
    selected: null,         // el id del servicio elegido, o null
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

**Deux choses qu'il convient de distinguer.** La première : une erreur et un vide se ressemblent de loin et sont opposés. Une erreur, c'est « je n'ai pas pu savoir » ; un vide, c'est « j'ai vérifié et il n'y a rien ». À la première, on propose de **réessayer**, parce que la prochaine fois cela fonctionnera peut-être. À la seconde, on laisse aussi la possibilité de redemander, parce qu'une liste vide aujourd'hui peut avoir des services dans une minute ; mais sans l'avertissement rouge, parce que ce n'est pas une défaillance. Un tableau de bord qui dit « erreur » quand la liste est vide ment, et un qui dit « il n'y a pas de services » quand le réseau a échoué ment plus gravement, parce que la personne conclut que tout va bien.

La seconde : les transitions sont peu nombreuses et toutes écrites. Le tableau de bord démarre à `"loading"` ; de là il passe à `"ready"` ou à `"error"` ; et il revient à `"loading"` seulement par une action de la personne : « Reintentar » (Réessayer), depuis une erreur ou depuis une liste vide, ou « Revisar ahora », avec les données à l'écran. Il n'y a pas d'autre chemin. En avoir aussi peu rend le code facile à raisonner.

**Dessiner les trois situations, et les annoncer.** La vue savait déjà dessiner le tableau et l'heure. La nouveauté est dans `render`, qui interroge d'abord `situation(state)` et montre tel ou tel écran, et dans une petite fonction qui en sort : `renderSummary`, qui est ce qui dans la leçon 8 vivait à l'intérieur de `render`. Remarque comment `render` est organisée : au début elle décide quels avertissements et quelles zones se voient, puis le récapitulatif, et seulement si la situation est `"ready"` elle continue avec le tableau.

Deux éléments d'écriture qu'il convient de reconnaître avant de le lire. Le premier est une chaîne de ternaires : `a ? x : b ? y : z` se lit « si `a`, `x` ; sinon, si `b`, `y` ; sinon, `z` », et ainsi l'avertissement choisit entre trois textes en une seule expression. Le second est [`Object.hasOwn(objeto, clave)`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn), qui renvoie `true` seulement si l'objet a cette clé **écrite en lui-même**. C'est nécessaire parce que tout objet JavaScript hérite de propriétés que personne n'a écrites, comme `constructor` ou `toString` : `LABELS["toString"]` n'est pas `undefined`, c'est une fonction. Avec `Object.hasOwn(LABELS, status)`, un état qui n'est ni `available` ni `down` est reconnu comme inconnu, même s'il s'appelle `toString`. Et un `for (const cell of [...])` parcourt une liste écrite sur place, comme n'importe quel `for…of` de la leçon 6.

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

// elements = { notice, errorNotice, retry, dataZone, checkedAt,
//              total, available, down, average, body, detail, sortButton }
export function render(state, elements) {
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

  const chosen = selectedService(state);
  elements.detail.textContent = chosen === null ? "Elige un servicio para ver su detalle." : describe(chosen);
}
```

Deux décisions de ce fichier. La première, le récapitulatif : pendant le chargement ou en cas d'échec, ses quatre chiffres restent vides, parce qu'il n'y a rien à compter ; mais dans le cas vide il dit 0, 0 sur 0, 0 et « sin datos » (sans données), parce que zéro service **est** un résultat, et le récapitulatif doit dire la même chose que l'avertissement. La seconde, comme toujours : tout entre avec `textContent`, y compris le message d'erreur, qui est aussi un texte que tu n'as pas écrit à ce moment-là. L'heure, c'est toujours `renderCheckedAt` qui l'écrit, celle de la leçon 8 : si une vérification échoue, l'en-tête conserve l'heure de la dernière qui s'est bien passée, ce qui est exactement ce que la personne a besoin de savoir. Et une troisième, sur « Reintentar » : il s'affiche avec une erreur **et** avec une liste vide. « Revisar ahora » vit dans `#data-zone`, qui dans ces deux cas est masquée ; sans « Reintentar », après un vide il ne resterait aucun bouton pour redemander, et la personne devrait recharger la page. Pour la même raison, à la fin d'un chargement `main.js` rend le focus à « Revisar ahora » seulement si le tableau est resté visible, et à « Reintentar » dans les deux autres cas.

Ce qu'il y a derrière le HTML compte autant que le JavaScript, parce que c'est là que vit l'accessibilité des états. C'est l'`index.html` de la leçon 8 avec un changement : la section des services gagne les avertissements, le bouton « Reintentar » et une zone, `#data-zone`, qui enveloppe tout ce qui n'a de sens qu'avec des données : la barre de contrôles, le tableau et le détail.

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
      </div>
    </section>
  </main>

  <footer>
    <p>Datos de ejemplo del archivo data/services.json.</p>
  </footer>
</body>
</html>
```

- **Deux régions d'avertissement, présentes dès le départ.** `#notice` a `role="status"` et `#error-notice` a `role="alert"`. Ce sont des **régions live** : quand leur texte change, un lecteur d'écran l'annonce. `status` le fait avec courtoisie, en attendant que ce qu'il disait soit terminé ; `alert` interrompt, et se réserve à ce que la personne doit savoir tout de suite. C'est pourquoi « Cargando » (Chargement) et « No hay servicios » (Il n'y a pas de services) vont dans la première et les défaillances dans la seconde. La règle technique est que les régions doivent **exister avant que leur contenu change** ; si on les crée avec le message déjà dedans, beaucoup de lecteurs ne l'annoncent pas.
- **`Cargando servicios…` est déjà dans le HTML.** Avant que le premier octet de JavaScript ne s'exécute, la personne voit que quelque chose se passe. Quand `main.js` démarre, il réécrit le même texte, ce qui ne produit aucun changement visible.
- **`hidden` pour ce qui ne correspond pas.** La zone des données et le bouton « Reintentar » sont masqués avec l'attribut `hidden`, qui les retire de la vue **et** de l'arbre d'accessibilité. Ainsi un lecteur d'écran ne parcourt pas un tableau vide.
- **« Reintentar » est un vrai bouton**, et son écouteur est enregistré une seule fois.

La feuille gagne deux blocs à la fin de `css/styles.css`. Le premier rouvre la couche `reset` pour une seule règle : ce qui porte l'attribut `hidden` ne se voit pas, quoi que dise n'importe quelle autre règle. C'est l'unique `!important` de la feuille, et il va dans la première couche exprès : entre déclarations avec `!important`, l'ordre des couches s'inverse —la même inversion que la leçon 3 a racontée pour les origines—, donc dans la première couche il l'emporte sur toutes. Ce n'est pas un rafistolage pour vaincre une autre règle ; c'est une garantie : ce qui est masqué reste masqué. Le second bloc donne forme aux avertissements, et il a un piège qu'il convient de regarder lentement. Un avertissement vide ne devrait pas dessiner un encadré sans texte, donc il faut l'« éteindre » tant qu'il est vide. La solution évidente, `display: none`, est précisément la mauvaise : un élément avec `display: none` sort aussi de l'arbre d'accessibilité, et alors la région live cesse d'exister pour le lecteur d'écran jusqu'à ce qu'elle reçoive du texte, ce qui est exactement ce que la règle précédente interdit. On l'a mesuré dans Chrome 154 : avec `display: none`, `#notice` et `#error-notice` vides n'apparaissaient pas dans l'arbre d'accessibilité ; avec la règle ci-dessous, qui ne leur retire que la marge, la marge intérieure et la bordure, ils apparaissent comme `status` et `alert` et mesurent 0 px de haut. Ils se voient pareil (rien) et restent surveillés.

```css
@layer reset {
  /* ---- Lección 9 ---- */
  /* Lo que lleva el atributo hidden no se ve, diga lo que diga otra regla. Entre
     declaraciones con !important el orden de las capas se invierte: en la primera
     capa, esta gana a todas. */
  [hidden] {
    display: none !important;
  }
}

@layer components {
  /* ---- Lección 9: los avisos de carga, error y vacío ---- */
  .notice {
    margin: var(--space-3) 0;
    padding: var(--space-2) var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
  }

  /* Un aviso vacío no ocupa lugar, pero NO se oculta con display: none, que lo sacaría
     del árbol de accesibilidad: la región tiene que seguir ahí, vigilada, antes de que
     llegue el primer mensaje. Basta con quitarle el borde, el relleno y el margen. */
  .notice:empty {
    margin: 0;
    padding: 0;
    border: 0;
  }

  .notice-error {
    border-color: var(--color-down-text);
    background: var(--color-down-bg);
    color: var(--color-down-text);
  }
}
```

L'avertissement d'erreur utilise les couleurs du badge « Caído » (En panne), que la leçon 3 a déjà mesurées : 7.08 à 1 de contraste.

Le dernier morceau est `js/main.js`, qui demande les données et conserve le résultat dans l'état. Trois outils y apparaissent pour la première fois, et il convient de savoir ce qu'ils font avant de le lire :

- **`location.search`** est la partie de l'adresse de la page qui va à partir du signe `?` : dans `…/panel/?case=empty`, elle vaut `"?case=empty"`. [`new URLSearchParams(texto)`](https://developer.mozilla.org/fr/docs/Web/API/URLSearchParams) la découpe en paires nom–valeur, et `.get("case")` renvoie la valeur de `case`, ou `null` si l'adresse ne la porte pas.
- **`document.activeElement`** est l'élément qui a le focus en ce moment : le bouton sur lequel tu viens d'appuyer au clavier, le champ où tu écris, ou le `<body>` si aucun ne l'a.
- **`?.`**, le chaînage optionnel de la leçon 6 : `document.activeElement?.dataset?.id` lit l'`id` du bouton qui a le focus s'il y en a un, et donne `undefined` au lieu de s'arrêter avec une erreur si l'une des étapes n'existe pas. (La fonction `update` qui l'utilise est celle de la leçon 7, sans changement.)

Avec cela, le fichier :

```js
// panel/js/main.js
// Junta las piezas: pide los datos, guarda el resultado en el estado y dibuja.
import { loadServices } from "./load.js";
import { createState, startLoading, loadSucceeded, loadFailed, toggleSort, select, situation } from "./state.js";
import { render } from "./view.js";

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

load();
```

Deux choses de ce fichier méritent d'être expliquées. La première est `load()`, qui a changé par rapport à la leçon 8 : elle passe maintenant à `"loading"`, dessine, essaie, et dans l'un ou l'autre dénouement conserve dans l'état et redessine. Il n'y a plus de `console.error` : la défaillance a sa place à l'écran. Le `try`/`catch` reste **seulement autour de la requête**, pas de l'affichage, pour la même raison que dans la leçon 8 : si l'affichage avait une erreur de programmation, nous ne voulons pas qu'elle soit déguisée en « no se pudo conectar » (impossible de se connecter) ; nous voulons la voir dans la console. Et une leçon de la 7 qui revient : le bouton qui a demandé le chargement, « Revisar ahora » ou « Reintentar », reste masqué pendant le chargement, et un élément masqué perd le focus, qui tombe sur le `<body>`. C'est pourquoi `load()` note au début si le focus était sur l'un de ces deux boutons et, à la fin, le rend à celui qui convient : « Reintentar » si cela a de nouveau échoué, « Revisar ahora » si les données sont arrivées. Sans ces lignes, qui utilise le clavier devrait parcourir la page depuis le haut après chaque vérification.

La seconde est la table `CASES`. Pour que tu puisses voir chaque situation sans rien casser, le tableau de bord accepte dans l'adresse `?case=empty`, `?case=error`, `?case=invalid` ou `?case=timeout`. Remarque que le texte de l'adresse **n'est pas utilisé comme adresse de la requête** : il ne fait que choisir une option parmi cinq que nous avons écrites. Si le tableau de bord faisait `fetch(params.get("url"))`, n'importe qui pourrait t'envoyer un lien qui fasse que *ton* tableau de bord demande et dessine ce qu'il veut. `Object.hasOwn` évite que `?case=constructor` trouve une valeur héritée.

**Voir les trois états.** Avec le serveur démarré, ouvre `…/09-cuando-algo-falla/panel/` et parcours ce trajet ; ce sont tes épreuves de la leçon :

| Adresse | Ce que tu dois voir |
|---|---|
| `panel/` | Le tableau, le récapitulatif à 5, 4 sur 5, 1 et 465 ms, et dans l'en-tête la date et l'heure auxquelles les données sont arrivées |
| `panel/?case=empty` | « No hay servicios que revisar. » (Il n'y a pas de services à vérifier.), sans tableau, avec le bouton « Reintentar » pour redemander ; le récapitulatif à zéro |
| `panel/?case=error` | « El servidor respondió con el código 404. » (Le serveur a répondu avec le code 404.), avec le bouton « Reintentar » |
| `panel/?case=invalid` | « La respuesta no es JSON válido. » (La réponse n'est pas du JSON valide.) (il demande `index.html`, qui n'est pas du JSON) |
| `panel/?case=timeout` | avec `slow-server.py` : « Cargando servicios… » pendant trois secondes puis « El servidor no respondió en 3000 ms. » (Le serveur n'a pas répondu en 3000 ms.), avec « Reintentar ». Avec le serveur habituel, le tableau normal : il n'y a personne pour tarder |

Pour l'état **« chargement »**, qui dure des millisecondes sur ta machine, il y a deux façons de le voir. La plus simple est `?case=timeout` avec `slow-server.py` démarré : l'avertissement reste trois secondes avant de passer à l'erreur. L'autre, qui marche avec n'importe quel serveur, ce sont les outils du navigateur : ouvre l'onglet **Réseau**, choisis un profil de vitesse lent (dans Chrome, « 3G » ; dans Firefox, « GPRS » ; les noms des profils changent selon les versions), et recharge ; et avec l'option « Hors connexion », appuie sur « Reintentar » après une erreur et tu verras « No se pudo conectar con el servidor. » (Impossible de se connecter au serveur.). Voir chaque état de tes propres yeux est la partie où l'on apprend le plus ; ne la saute pas.

**L'épreuve qui clôt la section.** Avec `?case=error`, navigue uniquement au clavier jusqu'à « Reintentar », appuie sur Entrée et observe que l'avertissement ne disparaît pas (cela continue d'échouer, parce que le fichier n'existe toujours pas) et que le focus reste sur « Reintentar ». Fais la même chose avec « Revisar ahora » dans le tableau de bord normal : l'heure de l'en-tête change et le focus reste sur le bouton. Et une mesure qu'on ne saute pas : avec la fenêtre à 320 px, dans les cinq cas, `document.documentElement.scrollWidth <= document.documentElement.clientWidth` doit renvoyer `true` ; je l'ai vérifié et il renvoie `true` dans les cinq, grâce à la boîte qui défile de la leçon 5 et à la règle `position: relative` de la leçon 7. Avec un lecteur d'écran activé (sous Linux Mint, Orca s'active en général avec `Super+Alt+S`), l'avertissement rouge doit être annoncé sans que tu déplaces le focus.

### 9.3 Plusieurs requêtes à la fois

**Le problème.** Le vrai `revisor` va vérifier beaucoup de services, et chacun peut répondre, tarder ou échouer de son côté. Quand les requêtes ne dépendent pas l'une de l'autre, on n'attend pas l'une pour lancer la suivante : on les lance toutes et on attend l'ensemble. Les demander l'une après l'autre, avec un `await` dans une boucle, fait que la vérification dure la **somme** de toutes ; les lancer ensemble fait qu'elle dure ce que dure **la plus lente**.

**Les deux façons d'attendre un ensemble.** `Promise.all(lista)` reçoit une liste de promesses et en renvoie une seule, qui est tenue quand toutes sont tenues. Mais **elle est rompue dès qu'une échoue**, et écarte le résultat des autres, ce qui est le contraire de ce que tu veux dans un rapport où un service en panne fait partie du résultat, et non un motif pour jeter les autres. Pour cela existe `Promise.allSettled`, qui attend toutes les promesses et renvoie pour chacune un objet qui dit si elle a été tenue (`status: "fulfilled"`, avec sa `value`) ou rompue (`status: "rejected"`, avec sa `reason`). Elle est « Baseline » depuis juillet 2020 ([MDN : `allSettled`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)).

Avant la figure, un élément d'écriture : `urls.map(request)` applique la fonction `request` à chaque adresse et renvoie un tableau avec ce que renvoie chaque appel. Comme `request` est `async`, chaque appel renvoie une promesse : le résultat est **un tableau de promesses**, toutes déjà en route, ce qui est exactement ce que `allSettled` s'attend à recevoir. Et dans le `map` final, le second paramètre, `i`, est la position de chaque résultat, qui sert à retrouver l'adresse qui lui correspond : `allSettled` renvoie les résultats **dans le même ordre** que celui dans lequel il a reçu les promesses, quelle que soit celle qui a fini en premier. La figure 9.2 demande trois fichiers, dont un inexistant :

```html
<!-- fig09_02.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 9.2 — varias peticiones a la vez con allSettled</title>
</head>
<body>
  <main>
    <h1>Fig. 9.2 — varias peticiones a la vez con allSettled</h1>
    <pre id="output">Cargando…</pre>
  </main>

  <script type="module">
    const output = document.querySelector("#output");

    async function request(url) {
      const response = await fetch(url, { signal: AbortSignal.timeout(3000) });
      if (!response.ok) throw new Error(`código ${response.status}`);
      return await response.json();
    }

    const urls = ["panel/data/services.json", "missing.json", "panel/data/services-empty.json"];
    const results = await Promise.allSettled(urls.map(request));

    output.textContent = results.map((result, i) =>
      result.status === "fulfilled"
        ? `${urls[i]}: bien, ${result.value.length} elementos`
        : `${urls[i]}: falló, ${result.reason.message}`
    ).join("\n");
  </script>
</body>
</html>
```

```text
panel/data/services.json: bien, 5 elementos
missing.json: falló, código 404
panel/data/services-empty.json: bien, 0 elementos
```

Le fichier manquant n'a pas emporté les deux autres : chacun apporte son propre dénouement. Le tableau de bord d'aujourd'hui lit un seul fichier et ne l'utilise pas ; tu la gardes pour quand le `revisor` demandera à chaque service son propre état, et alors chaque ligne du tableau pourra avoir son propre « échec » sans que le reste du tableau de bord s'en aperçoive.

## L'erreur que tu vas voir

**L'erreur CORS.** C'est la première que rencontre quiconque demande des données à un autre endroit. Le tableau de bord demande un fichier à **son propre** serveur, et c'est pourquoi il ne la voit pas ; pour la provoquer, la figure 9.3 demande le même fichier à *un autre* serveur.

```html
<!-- fig09_03.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>Fig. 9.3 — pedir datos a otro origen</title>
</head>
<body>
  <main>
    <h1>Fig. 9.3 — pedir datos a otro origen</h1>
    <pre id="output">Cargando…</pre>
  </main>

  <script type="module">
    const output = document.querySelector("#output");
    output.textContent = `esta página vive en: ${location.origin}\nvoy a pedir a:        http://127.0.0.1:8001`;

    try {
      const response = await fetch("http://127.0.0.1:8001/data/services.json");
      output.textContent += `\nllegó con el código ${response.status}`;
    } catch (error) {
      output.textContent += `\nfetch falló: ${error.name}: ${error.message}`;
    }
  </script>
</body>
</html>
```

Lance un second serveur depuis le dossier du tableau de bord, dans un autre terminal et aussi à l'intérieur du dépôt téléchargé :

```bash
cd programas/09-cuando-algo-falla/panel
python3 -m http.server 8001 --bind 127.0.0.1
```

Avec le premier serveur (celui du port 8000) encore allumé, ouvre `http://127.0.0.1:8000/09-cuando-algo-falla/fig09_03.html`. La page dit :

```text
esta página vive en: http://127.0.0.1:8000
voy a pedir a:        http://127.0.0.1:8001
fetch falló: TypeError: Failed to fetch
```

(« Failed to fetch » est le message de Chrome ; le nom, `TypeError`, est le même dans tous les navigateurs.) Et la console de Chrome affiche, en rouge :

```text
Access to fetch at 'http://127.0.0.1:8001/data/services.json' from origin 'http://127.0.0.1:8000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

(Dans Firefox, la console dit autre chose —elle commence par « Cross-Origin Request Blocked »— et le message de l'erreur est « NetworkError when attempting to fetch resource. », mais l'erreur que reçoit ton code s'appelle toujours `TypeError`, comme le dit la [spécification de Fetch](https://fetch.spec.whatwg.org/#fetch-method) et le tableau de 8.1 : la page afficherait `TypeError: NetworkError when attempting to fetch resource.`. C'est le même problème.)

Pour le comprendre, il faut une définition. L'**origine** d'une page est la combinaison de trois choses : le schéma (`http`), l'hôte (`127.0.0.1`) et le port (`8000`). Deux adresses avec un port différent sont des origines différentes même si c'est la même machine, et c'est ce qui se passe ici. La **politique de même origine** du navigateur dit qu'une page peut lire librement ce qui vient de son origine, et non ce qui vient d'une autre, sauf si cette autre le permet ([MDN : politique de même origine](https://developer.mozilla.org/fr/docs/Web/Security/Defenses/Same-origin_policy)). La façon de le permettre s'appelle **CORS** (*cross-origin resource sharing*, partage de ressources entre origines) : le serveur propriétaire des données ajoute à sa réponse l'en-tête `Access-Control-Allow-Origin`, avec l'origine à laquelle il donne la permission ([MDN : CORS](https://developer.mozilla.org/fr/docs/Web/HTTP/Guides/CORS)).

Trois idées qui corrigent les malentendus les plus courants :

1. **La requête est bien partie.** Si tu ouvres l'onglet Réseau, tu verras la demande et sa réponse (celle-ci, même, avec un 200). Ce que le navigateur **bloque, c'est que ton code lise cette réponse**. CORS ne protège pas le serveur, qui a déjà reçu la requête : il protège qui utilise le navigateur, pour qu'une page étrangère ne lise pas ses affaires sans permission.
2. **Cela se corrige sur le serveur, pas dans ton code.** Il n'y a rien à écrire dans le tableau de bord pour contourner le blocage. Qui contrôle le serveur doit ajouter l'en-tête. Si le serveur n'est pas le tien, on le demande au propriétaire ; ou bien le tableau de bord et les données sont servis depuis la même origine, comme le fait ce cours.
3. **Il y a des « solutions » qui n'en sont pas.** L'extension qui « désactive CORS », le service public qui retransmet les requêtes, ou l'option `mode: "no-cors"` de `fetch` (qui donne une réponse « opaque » que le code ne peut pas lire) font disparaître l'erreur de la console sans rien résoudre : soit elles laissent ton navigateur sans protection, soit elles envoient les données de ceux qui utilisent ton tableau de bord à un tiers. Le `mode: "no-cors"` est la pire, parce qu'il a l'air de fonctionner.

Et une conséquence pour le tableau de bord : si un jour le `revisor` demandait ses données à une autre origine sans permission, la personne verrait « No se pudo conectar con el servidor. », parce que, depuis le code, un blocage par CORS est indiscernable d'un réseau tombé. La phrase est vraie du point de vue de la personne : le tableau de bord n'a pas pu obtenir les données. La cause exacte est dans la console, pour qui débogue.

Ferme le second serveur avec `Ctrl+C` en terminant.

## Ce qui se fait de travers

- **Une requête sans délai d'attente.** Un serveur qui ne répond pas laisse la page sur « Cargando… » sans fin, ce qui est pire qu'une erreur parce que cela ne dit pas quoi faire. `AbortSignal.timeout` coûte une ligne.
- **Demander le message au lieu du nom.** `error.message` change selon les navigateurs et les versions ; `error.name` (`TimeoutError`, `TypeError`, `SyntaxError`) est fixé par la spécification. Le code décide d'après le nom.
- **Un tableau de bord qui ne connaît que le cas heureux.** Si le tableau est la seule chose que le code sait dessiner, une défaillance ressemble à une page blanche. Les trois états ne sont pas un ornement : ils font partie du produit.
- **Traiter le vide comme une erreur, ou l'erreur comme un vide.** On offre des choses différentes à la personne, et les confondre la fait mal décider.
- **Créer la région live avec le message déjà dedans, ou la masquer avec `display: none`.** Dans les deux cas, le lecteur d'écran n'annonce rien. La région existe dès le départ, vide, et seul son texte change.
- **Afficher avec `innerHTML` le message d'erreur ou les données arrivées.** Ce qui vient de l'extérieur est une donnée extérieure, même si cela vient de ton propre serveur, parce que demain ce serveur peut être un autre. Le principe de la leçon 7 reste en vigueur sans changement.
- **Utiliser `await` dans une boucle pour des requêtes indépendantes.** `for (const url of urls) { await fetch(url) }` fait une requête, attend, fait la suivante, attend : cela dure la somme de toutes. On les lance toutes à la fois et on attend l'ensemble avec `Promise.allSettled`.
- **Utiliser l'adresse du navigateur comme adresse de la requête.** Une adresse qui vient de la barre du navigateur est une donnée extérieure. On choisit parmi des options que tu as écrites, comme le fait la table `CASES`.
- **« Corriger » CORS depuis la page.** Ni `mode: "no-cors"` ni une extension ne le résolvent ; c'est le serveur qui donne les données qui le corrige.

## Exercices

### Exercice 1 — Les cinq cas et qui les produit

Ouvre le tableau de bord avec chacun des cinq cas du tableau de 9.2 et avec l'option « Hors connexion » de l'onglet Réseau. Dans ton journal de bord, pour chacun, écris le message qui est apparu et la **ligne de `js/load.js`** qui l'a produit. Puis réponds : lesquels des six cas n'affichent jamais de code d'état dans l'onglet Réseau, et pourquoi ?

### Exercice 2 — Combien de temps a duré la vérification

Fais en sorte que, quand les données arrivent bien, le tableau de bord affiche sous le détail « La revisión tardó 12 ms. » (La vérification a pris 12 ms.), avec les millisecondes écoulées entre la demande des données et leur obtention. `performance.now()` donne le moment actuel en millisecondes, avec des décimales ; la différence entre deux appels est ce qui s'est passé entre eux. Décide où l'on **mesure**, où l'on **conserve** et où l'on **écrit**, et vérifie que si tu cliques sur « Ordenar » le chiffre ne change pas, et que si tu cliques sur « Revisar ahora », il change.

### Exercice 3 — Combien de listes sont arrivées

Copie la figure 9.2 sous le nom `count.html` dans le même dossier et modifie-la pour que, sous les trois lignes, elle en écrive une quatrième avec le résumé : « Llegaron 2 de 3. » (2 sur 3 sont arrivées.). Utilise `filter` sur le résultat de `allSettled`, sans rien redemander. Ensuite, ajoute à la liste d'adresses `"panel/data/otro-que-no-existe.json"` et vérifie que le résumé passe à « Llegaron 2 de 4. » sans que tu changes rien d'autre.

## Solutions

### Solution 1

Les messages et d'où ils sortent, dans `js/load.js` :

| Cas | Message | Ligne qui le produit |
|---|---|---|
| normal | (aucun : le tableau) | `return data;` |
| `?case=empty` | « No hay servicios que revisar. » | ce n'est pas de `js/load.js` : c'est `situation` dans `js/state.js` qui le décide |
| `?case=error` | « El servidor respondió con el código 404. » | le `throw` dans `if (!response.ok)` |
| `?case=invalid` | « La respuesta no es JSON válido. » | le `throw` de la branche `SyntaxError` du second `catch` |
| `?case=timeout` (avec `slow-server.py`) | « El servidor no respondió en 3000 ms. » | le `throw` du premier `catch`, branche `TimeoutError` |
| Hors connexion | « No se pudo conectar con el servidor. » | le `throw` final du premier `catch` |

Affichent un code d'état dans l'onglet Réseau les quatre cas où le serveur a bien répondu : normal (200), vide (200), erreur (404) et invalide (200, type `text/html`). Ceux qui n'en ont **jamais** sont « timeout » (la requête reste en attente trois secondes et est abandonnée sans avoir reçu de réponse) et « Hors connexion » (il n'y avait personne à qui parler). Le tableau de 8.1 marque **trois** situations comme « est rompue » : sans connexion, blocage par CORS et délai dépassé. Ces deux cas en sont deux ; la troisième, CORS, n'apparaît pas dans le tableau de bord parce qu'il demande à sa propre origine, et tu l'as vue à part avec la figure 9.3. Dans les autres cas, la promesse a été tenue et le tableau de bord a dû vérifier `ok` ou le contenu de lui-même.

### Solution 2

Ce sont trois travaux et ils vont dans trois fichiers. **Mesurer** est un effet —consulter l'horloge autour de la requête—, donc cela va dans `js/main.js`, à côté de l'appel à `loadServices`. **Conserver** le chiffre est de l'état : c'est un fait dont le tableau de bord se souvient jusqu'au chargement suivant. Et **l'écrire** relève de l'affichage. Dans `js/state.js`, un champ de plus et un paramètre de plus :

```js
// js/state.js — en createState()
durationMs: null,       // cuánto tardó la última carga que salió bien, o null
// js/state.js — loadSucceeded recibe la cifra y la guarda
export function loadSucceeded(state, services, checkedAt, durationMs) {
  state.phase = "ready";
  state.services = services;
  state.checkedAt = checkedAt;
  state.durationMs = durationMs;
  state.selected = null;
}
```

Dans `js/main.js`, à l'intérieur de `load()`, on mesure avant et après la requête :

```js
  const start = performance.now();
  try {
    const services = await loadServices(current.url, current.timeoutMs);
    loadSucceeded(state, services, new Date(), Math.round(performance.now() - start));
  } catch (error) {
    loadFailed(state, error.message);
  }
```

Dans `index.html`, `<p id="duration"></p>` sous `#detail`, à l'intérieur de `#data-zone` ; dans `js/main.js`, `duration: document.querySelector("#duration"),` dans l'objet `elements` ; et dans `js/view.js`, à la fin de `render` :

```js
  elements.duration.textContent = `La revisión tardó ${state.durationMs} ms.`;
```

« Ordenar » ne change pas le chiffre parce qu'il ne change que `sortByTime` : le chiffre n'est conservé que lorsque des données arrivent. « Revisar ahora » le change bien, parce qu'il repasse par `loadSucceeded`. Si tu l'avais calculé dans `render` avec `performance.now()`, tu aurais mesuré autre chose —le temps écoulé depuis l'ouverture de la page jusqu'à l'affichage— et il changerait à chaque clic.

### Solution 3

Après avoir construit les lignes, on compte les résultats tenus et on ajoute la quatrième :

```js
    const lines = results.map((result, i) =>
      result.status === "fulfilled"
        ? `${urls[i]}: bien, ${result.value.length} elementos`
        : `${urls[i]}: falló, ${result.reason.message}`
    );
    const arrived = results.filter((result) => result.status === "fulfilled").length;
    lines.push(`Llegaron ${arrived} de ${results.length}.`);
    output.textContent = lines.join("\n");
```

`filter` ne garde que les résultats dont le `status` est égal à `"fulfilled"`, et `.length` les compte. Comparé à `results.length`, et non à un 3 écrit à la main, le résumé s'ajuste tout seul quand la liste change : avec la quatrième adresse, Chrome 154 affiche `panel/data/otro-que-no-existe.json: falló, código 404` et `Llegaron 2 de 4.`. C'est la façon de penser du `revisor` : le nombre de services sort des données, jamais du code.

## Comment savoir que j'ai réussi

- [ ] Avec le dossier `programas/` servi par `slow-server.py`, `09-cuando-algo-falla/fig09_01.html` affiche `TimeoutError` ; avec `python3 -m http.server`, la même page dit « alcanzó a responder ».
- [ ] `fig09_02.html` affiche deux listes qui sont arrivées et une qui a échoué avec le code 404.
- [ ] Dans ton tableau de bord, le récapitulatif dit 5, 4 sur 5, 1 et 465 ms et l'en-tête indique la date et l'heure auxquelles les données sont arrivées.
- [ ] Les quatre cas avec `?case=` affichent l'avertissement du tableau de 9.2 (celui de `timeout`, avec `slow-server.py`), et « Reintentar » apparaît dans les trois qui sont des erreurs et dans le vide, jamais à côté du tableau.
- [ ] Après avoir appuyé sur « Revisar ahora » ou « Reintentar » au clavier, le focus reste sur ce bouton.
- [ ] À 320 px de large, il n'y a de débordement horizontal dans aucun des cinq cas.
- [ ] Avec `?case=timeout` et `slow-server.py`, ou avec un profil de vitesse lent dans l'onglet Réseau, on arrive à voir « Cargando servicios… ».
- [ ] Avec « Hors connexion » et « Reintentar », le tableau de bord dit « No se pudo conectar con el servidor. »
- [ ] La console n'affiche que l'erreur réseau des cas que tu as provoqués exprès, et aucune exception de ton code.

**Révision des leçons précédentes** (réponds-y sans regarder, puis vérifie) :

1. Dans la leçon 0 : qu'est-ce qu'une origine, et quelles trois parties d'une adresse la forment ?
2. Dans la leçon 7 : pourquoi faut-il rendre le focus au bouton après avoir redessiné ?
3. Dans la leçon 8 : pourquoi la promesse de `fetch` est-elle tenue avec un 404, et quelle ligne de `js/load.js` le convertit en erreur ?

## Pour aller plus loin

- [MDN — `AbortSignal.timeout()`](https://developer.mozilla.org/fr/docs/Web/API/AbortSignal/timeout_static) — le délai d'attente et le `TimeoutError`, avec son tableau de compatibilité ; consulté le 7 octobre 2026.
- [MDN — Partage de ressources entre origines multiples (CORS)](https://developer.mozilla.org/fr/docs/Web/HTTP/Guides/CORS) — ce qu'est l'origine et pourquoi c'est le serveur qui corrige ; consulté le 7 octobre 2026.
- [MDN — Régions live ARIA](https://developer.mozilla.org/fr/docs/Web/Accessibility/ARIA/Guides/Live_regions) — `status`, `alert` et pourquoi la région doit exister avant que son texte change ; consulté le 7 octobre 2026.
- [MDN — `Promise.allSettled()`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled) — attendre un ensemble de promesses sans qu'une défaillance emporte les autres ; consulté le 7 octobre 2026.
