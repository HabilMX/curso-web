# Leçon 11 — Le tableau de bord terminé

**Durée :** deux sessions d'environ 90 min. Une répartition qui marche : la première, « Le pourquoi avant le comment », la révision au clavier (11.1), la politique de sécurité du contenu (11.2) et la mesure du poids et des performances (11.3), avec le tableau de bord ouvert et les outils du navigateur à portée de main ; la seconde, publier le site (11.4), les cinq critères un par un sur l'adresse publiée (11.5) et les exercices. Si publier te prend plus de temps que prévu, c'est la session deux qui s'allonge : le compte et les étapes du service que tu choisis ne dépendent pas de toi.

**Ce que tu construis :** le `revisor` publié comme site statique, avec ses en-têtes de sécurité et ses chiffres mesurés

**Ce que tu apprends :** la révision au clavier ; la politique de sécurité du contenu (CSP) comme en-tête du serveur ; poids et performances ; publier un site statique

## À la fin, tu seras capable de

- Parcourir le tableau de bord entier uniquement au clavier, et dire quel critère d'accessibilité enfreint ce qu'on n'atteint pas, ce qu'on ne voit pas ou ce qui n'a pas de sortie.
- Écrire une politique de sécurité du contenu (CSP), expliquer ce que bloque chaque directive et pourquoi sa place est un en-tête du serveur et pas seulement une balise.
- Essayer cette politique sur ton ordinateur avec les mêmes en-têtes qu'enverra le serveur, et lire dans la console les messages de violation.
- Mesurer le poids du tableau de bord et ses métriques (LCP, CLS, INP), et dire laquelle n'apparaît pas dans un test de chargement en laboratoire et pourquoi.
- Réserver la place de ce qui arrive tard et précharger les modules, et vérifier avec des chiffres que cela a aidé.
- Publier le dossier comme site statique et vérifier avec `curl` que les en-têtes sont arrivés.
- Vérifier un par un les cinq critères qui clôturent le cours.

## Le pourquoi avant le comment

Jusqu'ici, ton tableau de bord fonctionne sur ton ordinateur, ouvert par ton serveur, avec ton navigateur et avec des données que tu as écrites. « Ça marche sur ma machine » est une phrase que connaît bien quiconque a publié quelque chose, et c'est la distance entre un exercice et un produit. Cette leçon parcourt cette distance : elle examine le tableau de bord comme l'examinerait une personne qui n'est pas toi, le protège avec une couche de plus, le mesure et le met sur internet.

Le cours, de plus, a promis un critère de sortie. Le [programme](README.md) dit qu'il ne se termine pas quand tu as lu la leçon 11, mais quand ton tableau de bord remplit cinq conditions. Aucun programme ne les vérifie pour toi : tu les vérifies toi-même, avec les outils du navigateur, et cette leçon te dit comment :

| # | Le tableau de bord remplit… | Où cela s'est appris | Où cela se vérifie aujourd'hui |
|---|---|---|---|
| 1 | Il se parcourt entièrement au clavier | 2, 3, 4, 5 et 7 | 11.1 |
| 2 | Il n'y a pas une seule erreur dans la console | 8, 9 et 10 | 11.2 et 11.5 |
| 3 | Il fonctionne à 320 px de large sans débordement horizontal | 5 | 11.1 |
| 4 | Il montre les trois états : chargement, erreur et vide | 9 | 11.5 |
| 5 | Le texte qui vient de l'extérieur se dessine avec `textContent`, jamais avec `innerHTML` | 7 | 11.2 et 11.5 |

La section 11.5 clôt les cinq avec une épreuve pour chacun. Avant cela, trois idées nouvelles : la politique de sécurité du contenu (11.2), mesurer le poids et les performances avant d'essayer de les améliorer (11.3) et publier un site statique (11.4). La 11.1 est une révision au clavier, pas une idée nouvelle.

### L'état du tableau de bord à la fin de la leçon 10

Cette leçon part d'un tableau de bord concret. À la fin de la leçon 10, le `revisor` a tout ce qu'avait la leçon 9 plus ce que les formulaires ont apporté :

- `index.html` avec l'en-tête (la « Última revisión » (Dernière vérification) et la navigation), le récapitulatif, et dans la section des services les avertissements (`#notice`, `#error-notice`), le bouton « Reintentar » (Réessayer) et une zone de données avec le champ de recherche, les boutons radio « Mostrar » (Afficher), « Revisar ahora » (Vérifier maintenant), le bouton de tri, l'avertissement du décompte et le tableau ; et une section pour ajouter un service.
- `css/styles.css` avec les couches et les règles des leçons 3, 4, 5, 7, 9 et 10.
- `js/stats.js`, `js/load.js`, `js/state.js`, `js/filters.js`, `js/form.js`, `js/view.js` et `js/main.js`, avec les données dans `data/services.json` et `data/services-empty.json`.
- Un tableau de bord qui filtre, trie, ajoute des services avec la validation native et des messages qu'un lecteur d'écran peut annoncer, et qui accepte `?case=empty`, `?case=error`, `?case=invalid` et `?case=timeout`.

Ce qu'il **n'a pas encore** : aucun en-tête de sécurité (le serveur Python n'envoie que le minimum), aucune mesure de poids ni de vitesse, une icône qui est un raccourci, et aucune adresse qu'une autre personne puisse ouvrir. Dans cette leçon, le tableau de bord passe dans le dossier `11-el-panel-terminado/revisor/`, qui est la leçon 10 plus de petits changements, tous expliqués plus bas : un fichier d'en-têtes, une icône propre, quelques lignes dans le `<head>` et un dernier bloc de CSS.

Tout dans cette leçon utilise ce que tu as déjà : le serveur habituel depuis le dossier `programas/` du [dépôt du cours](https://github.com/HabilMX/curso-web) pour les figures (celles de cette leçon sont dans [`programas/11-el-panel-terminado/`](https://github.com/HabilMX/curso-web/tree/main/programas/11-el-panel-terminado)), et un serveur Python un peu plus long (un seul, d'environ 55 lignes, que tu vois en entier plus bas) pour essayer les en-têtes. Ni Node ni paquets.

## Les concepts

### 11.1 La révision au clavier

Le critère 1 dit que le tableau de bord se parcourt entièrement au clavier, sans utiliser la souris. Cela se vérifie en le faisant, pas en lisant le code. Il y a quatre questions, et chacune correspond à un critère des règles d'accessibilité (WCAG 2.2) :

1. **Tout est-il atteignable ?** Tout ce qui se fait à la souris doit pouvoir se faire au clavier ([2.1.1, Clavier](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html), niveau A). Les éléments natifs —`<button>`, `<input>`, `<select>`— le respectent déjà. Ce qui se casse, c'est ce que tu as construit à la main : un `<div>` avec un clic.
2. **Voit-on où l'on est ?** L'indicateur de focus doit être visible ([2.4.7, Focus visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html), niveau AA). C'est pourquoi `css/styles.css` a `:focus-visible { outline: 3px solid … }` depuis la leçon 3 et jamais un `outline: none`.
3. **L'ordre a-t-il du sens ?** Le focus doit parcourir les contrôles dans un ordre qui conserve la signification et permette d'agir ([2.4.3, Ordre du focus](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html), niveau A). La règle pratique : l'ordre du HTML est l'ordre du focus, donc il n'est pas nécessaire —et il ne convient presque jamais— d'y toucher avec un `tabindex` positif.
4. **Peut-on en sortir ?** Si le focus entre dans un composant, il doit pouvoir en sortir uniquement au clavier ([2.1.2, Pas de piège au clavier](https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html), niveau A).

Et deux critères de plus de la version 2.2 qui se remplissent sans effort, si on les connaît : le focus ne doit pas être totalement masqué par un contenu que tu as placé ([2.4.11, Focus non masqué (minimum)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html), niveau AA ; un en-tête fixe est le coupable typique, et le tableau de bord n'en a aucun) et les contrôles doivent mesurer au moins 24 × 24 pixels CSS ou avoir de l'espace autour ([2.5.8, Taille de la cible (minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), niveau AA ; les champs et boutons du tableau de bord ont une hauteur minimale de 2.5 rem, ce qui avec la taille de police par défaut fait 40 pixels : mesuré dans Chrome, tous font 40 de haut).

**Prédis :** dans le tableau de bord, combien de fois dois-tu appuyer sur Tab, en partant de la page tout juste chargée, pour arriver au bouton « Agregar servicio » (Ajouter un service) ? Pense à ce qu'il y a avant : les deux liens de navigation, le champ de recherche, le groupe de boutons radio, « Revisar ahora », le bouton de tri, la boîte du tableau, un bouton « Ver detalle » (Voir le détail) pour chaque service, et les trois champs du formulaire.

Colle ce fragment dans la console avec le tableau de bord ouvert (`Ctrl+Maj+K` dans Firefox, `F12` et l'onglet Console dans Chrome). Il liste, dans l'ordre, tout ce que le clavier peut atteindre. La seconde condition du filtre ne laisse qu'un seul bouton radio par groupe, celui qui est coché, parce qu'un groupe de boutons radio est un seul arrêt de Tab (tu l'as vu dans la leçon 2) :

```js
const stops = [...document.querySelectorAll("a[href], button, input, select, textarea, [tabindex]")]
  .filter((e) => !e.disabled && e.tabIndex >= 0 && e.getClientRects().length > 0)
  .filter((e) => e.type !== "radio" || e.checked);
console.log(stops.map((e) =>
  `${e.tagName.toLowerCase()} · ${(e.labels?.[0]?.textContent ?? e.textContent).trim().slice(0, 30)} · tabindex ${e.tabIndex}`
).join("\n"));
```

Dans le tableau de bord de cette leçon, avec les cinq services chargés, il affiche seize lignes :

```text
a · Resumen · tabindex 0
a · Servicios · tabindex 0
input · Buscar servicio · tabindex 0
input · Todos · tabindex 0
button · Revisar ahora · tabindex 0
button · Ordenar por tiempo de respuest · tabindex 0
div · Estado de los servicios en la  · tabindex 0
button · Ver detalle de Catálogo · tabindex 0
button · Ver detalle de Pagos · tabindex 0
button · Ver detalle de Inventario · tabindex 0
button · Ver detalle de Notificaciones · tabindex 0
button · Ver detalle de Búsqueda · tabindex 0
input · Nombre * · tabindex 0
select · Estado * · tabindex 0
input · Tiempo de respuesta (ms) * · tabindex 0
button · Agregar servicio · tabindex 0
```

Ce sont seize arrêts, donc la réponse à la prédiction est seize fois ; je l'ai vérifié en appuyant vraiment sur Tab, et le focus parcourt exactement cette liste et dans cet ordre. Ce qui compte dans la liste n'est pas le nombre mais ce qui **n'**apparaît **pas** : aucun `tabindex` différent de zéro (toutes disent 0), aucun lien sans destination, et un seul `div`, qui est là exprès : c'est la boîte du tableau, que la leçon 5 a rendue focalisable pour que le clavier puisse la faire défiler. Si dans ton tableau de bord une ligne dit `tabindex 3`, ou si une action du tableau de bord n'apparaît pas dans la liste, voilà le défaut.

Le parcours complet, qui prend dix minutes et vaut la peine d'être fait lentement :

- Avec Tab, avance dans toute la page ; avec Maj+Tab, recule. À chaque arrêt, vérifie que tu vois le contour de focus.
- Dans le champ de recherche, écris `pag` : le tableau doit rester avec une ligne sans que tu touches à la souris.
- Dans le sélecteur d'état, change-le avec les flèches.
- Sur un bouton « Ver detalle », appuie sur Entrée ou sur la barre d'espace : le détail apparaît sous le tableau et le focus reste sur le même bouton (la leçon 7 a fait que `update` l'y rende après avoir redessiné).
- Dans le formulaire, avec le focus dans un champ, appuie sur Entrée avec tout vide : le focus saute au premier champ en erreur. Corrige et envoie : le focus revient à « Nombre » (Nom).
- Ouvre `?case=error` et arrive à « Reintentar » uniquement avec Tab. Appuie dessus : le focus reste sur lui (la leçon 9 a fait que `load` l'y rende).

**À 320 pixels.** Le critère 3 demande que le tableau de bord fonctionne à 320 pixels de large sans barre de défilement horizontale. Ce n'est pas un nombre arbitraire : c'est le critère de [redistribution (reflow, 1.4.10)](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html), niveau AA, qui équivaut à un écran de 1280 pixels avec un zoom à 400 % et existe pour qui agrandit le texte. Cela se vérifie en une ligne de la console :

```js
document.documentElement.scrollWidth <= document.documentElement.clientWidth
```

Si elle renvoie `false`, quelque chose déborde. Le tableau de bord arrive à cette leçon en le respectant depuis la leçon 5, qui a mis le tableau dans une boîte qui défile, et la leçon 7 a dû le défendre : le texte masqué des boutons « Ver detalle » s'échappait de cette boîte et étirait la page à 498 px, jusqu'à ce que `position: relative` sur `.table-scroll` le ramène à l'intérieur. C'est la leçon de ce critère : on ne le remplit pas une fois, on le remesure après chaque modification.

**Les outils automatiques.** Avant de tenir la révision pour bonne, lance un auditeur. Dans cette leçon, on a utilisé axe-core 4.14.0, le moteur qui se trouve derrière beaucoup d'extensions d'accessibilité, sur le tableau de bord dans ses cinq situations (normale et les quatre cas de `?case=`) : zéro violation. Lighthouse aussi, que nous détaillons plus bas, a donné 100 en accessibilité. Mais un zéro ne veut pas dire « accessible » : il veut dire « aucun des défauts qu'une machine sait reconnaître ». Une machine peut voir qu'un champ a un libellé ; elle ne peut pas savoir si le message d'erreur se comprend. C'est pourquoi le parcours au clavier et, si tu peux, avec un lecteur d'écran, ne se remplace pas.

### 11.2 La politique de sécurité du contenu, comme en-tête

**Deux couches.** Dans la leçon 7, tu as appris la première défense contre les attaques d'injection de code (XSS) : le texte qui vient de l'extérieur entre dans la page avec `textContent`, qui le traite comme du texte et jamais comme du HTML. C'est la défense qui compte, parce qu'elle empêche le problème de se produire. Une politique de sécurité du contenu —CSP, de l'anglais *Content Security Policy*— est une seconde couche, pour le jour où la première échoue : un programmeur distrait qui écrit `innerHTML` là où il ne devait pas, une bibliothèque tierce avec un défaut. MDN le dit avec les mots exacts dans son [guide de la CSP](https://developer.mozilla.org/fr/docs/Web/HTTP/Guides/CSP) : une CSP ne remplace pas le traitement correct des entrées ; il faut faire les deux, pour avoir une défense en profondeur.

**Ce que c'est.** Une CSP est une liste de règles que **le serveur envoie au navigateur** sur ce que la page peut charger et exécuter. « Les scripts ne peuvent venir que de mon propre site », « les images, pareil », « la page ne peut se connecter à personne d'autre ». Le navigateur les fait respecter : si quelque chose viole une règle, il le bloque et le note dans la console. La politique la plus simple est `default-src 'self'`, qui dit : tout ce que la page charge doit venir de sa propre origine.

**En-tête ou balise.** Une CSP peut arriver de deux façons. Comme **en-tête de la réponse** HTTP —`Content-Security-Policy: …`, la forme recommandée, qui s'envoie avec chaque réponse, pas seulement avec la page— ou comme balise `<meta http-equiv="Content-Security-Policy" content="…">` dans le HTML. La balise existe pour qui ne contrôle pas le serveur, et c'est pourquoi on l'utilise dans les sites statiques les plus simples. Mais ce n'est pas la même chose. MDN avertit que la balise « ne prend pas en charge toutes les fonctions » : elle ne peut pas livrer une politique en mode rapport seul, et la directive `frame-ancestors` (qui empêche d'autres pages de t'insérer dans un cadre) [ne fonctionne pas dans une balise](https://developer.mozilla.org/fr/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors). L'en-tête, en revanche, couvre tout.

C'est pourquoi le programme dit « CSP comme en-tête du serveur ». Mais commençons par la balise, qui peut s'essayer avec un fichier et sans serveur spécial.

**Prédis :** la figure 11.1 a une balise avec la politique `script-src 'self'` et deux scripts : l'un écrit dans le HTML et l'autre dans un fichier du même site. Lequel s'exécute ?

```html
<!-- fig11_01.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="Content-Security-Policy" content="script-src 'self'">
  <title>Una política que bloquea el script en línea</title>
  <link rel="icon" href="data:,">
</head>
<body>
  <main>
    <h1>Una política que bloquea el script en línea</h1>
    <p id="result" role="status">Ningún script se ha ejecutado.</p>
  </main>

  <script>
    document.getElementById("result").textContent = "El script en línea sí se ejecutó.";
  </script>
  <script src="fig11_01/external.js"></script>
</body>
</html>
```

```js
// fig11_01/external.js
document.getElementById("result").textContent = "El script externo sí se ejecutó.";
```

Ouvre-la à `http://127.0.0.1:8000/11-el-panel-terminado/fig11_01.html`, avec le serveur démarré depuis le dossier `programas/` du dépôt. Au chargement, la page affiche :

```text
Una política que bloquea el script en línea
El script externo sí se ejecutó.
```

Seul le script externe s'est exécuté. Celui qui est dans le HTML a été bloqué, et la console dit pourquoi. C'est le message que tu verras le plus souvent dans ta vie avec une CSP, et il convient de le lire en entier :

```text
Executing inline script violates the following Content Security Policy directive 'script-src 'self''. Either the 'unsafe-inline' keyword, a hash ('sha256-bTp6bKDsmuoAZZxMFjB9R21R8gPJ7kRwjoDZhQv8XQo='), or a nonce ('nonce-...') is required to enable inline execution. The action has been blocked.
```

Lis-le par morceaux. « Executing inline script violates … `script-src 'self'` » dit ce qui a été bloqué (un script en ligne) et quelle règle l'a bloqué. « Either the 'unsafe-inline' keyword, a hash, or a nonce is required to enable inline execution » énumère les trois façons de le permettre : ouvrir complètement la règle, ou autoriser *ce* script en particulier avec une empreinte (`hash`) ou un nombre à usage unique (`nonce`). Et « The action has been blocked » confirme qu'il ne s'est pas exécuté. Le `hash` de l'exemple est celui de ce script exact ; dans le tien il sera identique, parce que le script est le même.

Remarque ce que cela signifie pour qui attaque : une telle politique empêche, à elle seule, qu'un fragment injecté —`<script>…</script>`, ou un attribut `onerror="…"`— s'exécute, même s'il est arrivé dans la page. Et remarque ce que cela signifie pour toi : **ton code doit vivre dans des fichiers** et enregistrer ses événements avec `addEventListener`. Le tableau de bord le fait ainsi depuis la leçon 7. C'est pourquoi la politique que nous allons écrire maintenant ne lui casse rien.

**La politique du tableau de bord, directive par directive.** Une directive est une règle pour un type de ressource. Celle du `revisor` est celle-ci :

| Directive | Valeur | Ce qu'elle empêche |
|---|---|---|
| `default-src` | `'none'` | tout chargement qu'une autre directive n'autorise pas explicitement |
| `script-src` | `'self'` | les scripts qui ne sont pas des fichiers du même site : en ligne, d'un autre domaine, `eval()` |
| `style-src` | `'self'` | les feuilles de style d'autres sites et les attributs `style` écrits dans le HTML |
| `img-src` | `'self'` | les images d'autres sites et celles de type `data:` |
| `connect-src` | `'self'` | que `fetch` demande des données à un autre domaine |
| `form-action` | `'none'` | qu'un formulaire envoie ses données quelque part |
| `base-uri` | `'none'` | que quelqu'un change l'adresse de base avec une balise `<base>` |
| `frame-ancestors` | `'none'` | qu'une autre page intègre la tienne dans un cadre (ne fonctionne que comme en-tête) |

`'self'` signifie « la même origine que la page » (schéma, hôte et port, ceux que tu as étudiés dans la leçon 0). Les apostrophes font partie du mot. `default-src` est la valeur de repli : s'il n'y a pas de directive pour un type de ressource, c'est `default-src` qui commande. Commencer par `'none'` oblige à permettre chaque chose exprès, et c'est ce qu'on veut : une liste courte que tu peux lire en entier.

Le tableau de bord n'utilise ni polices d'autres sites, ni images externes, ni un seul script tiers. Sa politique peut être aussi fermée parce que son code, c'est toi qui l'as écrit, dans tes fichiers.

**Le fichier d'en-têtes.** Les services de publication de sites statiques lisent un fichier appelé `_headers` (sans extension) qui se trouve dans le dossier que tu publies. [Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/headers/) et [Netlify](https://docs.netlify.com/manage/routing/headers/) l'acceptent avec la même syntaxe : une ligne avec le chemin auquel il s'applique, et dessous, avec indentation, un en-tête par ligne. Voici ceux du `revisor` :

```text
# revisor/_headers
# Encabezados que el servidor debe enviar con cada respuesta.
# Cloudflare Pages y Netlify leen este archivo con esta misma sintaxis.
/*
  Content-Security-Policy: default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; form-action 'none'; base-uri 'none'; frame-ancestors 'none'
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
```

Outre la CSP, il a deux autres en-têtes bon marché. [`X-Content-Type-Options: nosniff`](https://developer.mozilla.org/fr/docs/Web/HTTP/Reference/Headers/X-Content-Type-Options) dit au navigateur de ne pas deviner le type d'un fichier : si la réponse dit que c'est du texte, c'est du texte, et un script ne s'exécute que si le serveur déclare que c'est du JavaScript. Et [`Referrer-Policy: no-referrer`](https://developer.mozilla.org/fr/docs/Web/HTTP/Reference/Headers/Referrer-Policy) évite que le navigateur dise à d'autres sites de quelle page tu viens ; le tableau de bord ne fait de lien vers personne, donc cela ne coûte rien.

**L'essayer sur ton ordinateur.** Le serveur habituel (`python3 -m http.server`) ne lit pas `_headers`. Pour voir la même chose que verra le serveur où tu publieras, ce programme Python fait la même chose que `http.server` et envoie en plus les en-têtes du fichier. Il sert n'importe quel dossier ; lis-le en entier, car ce sont environ 55 lignes et il n'y a rien de caché :

```python
# headers-server.py
# Sirve una carpeta como lo hace `python3 -m http.server`, pero además envía los
# encabezados que declara el archivo _headers de esa carpeta. Así pruebas en tu
# computadora lo mismo que va a enviar el servidor donde publiques. Y, como el
# slow-server.py de la lección 9, entiende ?delay=MILISEGUNDOS para tardar a propósito.
#
# Uso:  python3 headers-server.py [carpeta] [puerto]
import fnmatch
import sys
import time
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlsplit

# Nadie necesita esperar más de diez segundos para ver el efecto.
MAX_DELAY_MS = 10000


def read_rules(folder):
    """Devuelve una lista de (patrón de ruta, encabezado, valor)."""
    rules = []
    pattern = None
    headers_file = Path(folder) / "_headers"
    if not headers_file.exists():
        return rules
    for line in headers_file.read_text(encoding="utf-8").splitlines():
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        if not line[0].isspace():
            pattern = line.strip()  # una ruta: "/*" o "/index.html"
            continue
        name, _, value = line.strip().partition(":")
        rules.append((pattern, name.strip(), value.strip()))
    return rules


class Handler(SimpleHTTPRequestHandler):
    rules = []

    def do_GET(self):
        # Lo mismo que slow-server.py: ?delay=3000 espera tres segundos antes de contestar.
        query = parse_qs(urlsplit(self.path).query)
        delay = query.get("delay", ["0"])[0]
        if delay.isdigit():
            time.sleep(min(int(delay), MAX_DELAY_MS) / 1000)
        try:
            super().do_GET()
        except (BrokenPipeError, ConnectionResetError):
            # El navegador se cansó de esperar y cerró la conexión.
            pass

    def end_headers(self):
        path = self.path.split("?", 1)[0]
        for pattern, name, value in self.rules:
            if fnmatch.fnmatch(path, pattern):
                self.send_header(name, value)
        super().end_headers()


def main():
    folder = sys.argv[1] if len(sys.argv) > 1 else "."
    port = int(sys.argv[2]) if len(sys.argv) > 2 else 8000
    Handler.rules = read_rules(folder)
    print(f"{len(Handler.rules)} encabezados leídos de {folder}/_headers", flush=True)
    server = ThreadingHTTPServer(
        ("127.0.0.1", port), partial(Handler, directory=folder)
    )
    print(f"Sirviendo {folder} en http://127.0.0.1:{port}  (Ctrl+C para parar)", flush=True)
    server.serve_forever()


main()
```

Depuis le dossier `programas/11-el-panel-terminado/` du dépôt téléchargé :

```bash
python3 headers-server.py revisor 8000
```

Il doit afficher `3 encabezados leídos de revisor/_headers` (3 en-têtes lus dans revisor/_headers) et l'adresse. Ouvre-la et vérifie, dans un autre terminal, que les en-têtes arrivent :

```bash
curl -sI http://127.0.0.1:8000/ | grep -i -E "content-security|nosniff|referrer"
```

Les trois lignes doivent sortir. S'il n'en sort aucune, le serveur n'a pas lu le fichier, et il vaut mieux le savoir maintenant qu'après avoir publié. (Pour arrêter le serveur, `Ctrl+C`.) Le code apporte en outre le `?delay` du `slow-server.py` de la leçon 9 —les mêmes lignes, dans `do_GET`—, pour que `?case=timeout` continue de provoquer un vrai délai dépassé avec ce serveur.

**L'erreur qui apparaît dès que tu la mets.** Avec cette politique active, la console du tableau de bord de la leçon 10 dit quelque chose que tu n'attendais pas :

```text
Loading the image 'data:,' violates the following Content Security Policy directive: "img-src 'self'". The action has been blocked.
```

C'est l'icône. Depuis la leçon 2, le tableau de bord porte `<link rel="icon" href="data:,">`, l'astuce de l'Exercice 2 de la leçon 1 pour que le navigateur ne demande pas `/favicon.ico` et ne remplisse pas la console d'erreurs 404 ; la leçon 2 avait prévenu que cela avait un coût, et le voici. Mais une image `data:` n'est pas du même site, et la politique (`img-src 'self'`) la bloque. Il y a deux sorties : ouvrir la politique avec `data:` dans `img-src`, ou donner au site une icône propre. La seconde est meilleure, parce qu'un site publié doit de toute façon avoir une icône. Le `revisor` apporte un fichier `favicon.svg` de deux lignes (un carré sombre avec un cercle vert) et le `<head>` le relie avec `<link rel="icon" href="favicon.svg" type="image/svg+xml">` :

```html
<!-- revisor/favicon.svg -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#1b1f24"/><circle cx="16" cy="16" r="7" fill="#1a7f37"/></svg>
```

La première ligne est un commentaire, comme dans les pages ; dans un SVG il est permis avant la balise `<svg>`. Les principaux navigateurs actuels acceptent une icône SVG (dans cette leçon, on l'a vérifié dans Chrome et Firefox, pas dans Safari) ; un navigateur qui ne l'accepte pas demandera `/favicon.ico` et verra le 404, ce que dans un tableau de bord interne tu peux accepter.

**Essayer avant d'imposer.** Une nouvelle politique peut casser quelque chose que tu n'as pas vu. La façon de le découvrir sans casser personne est l'en-tête frère `Content-Security-Policy-Report-Only` ([MDN](https://developer.mozilla.org/fr/docs/Web/HTTP/Reference/Headers/Content-Security-Policy-Report-Only)) : la même politique, mais le navigateur ne fait que *noter* les violations et ne bloque rien. Pour l'essayer, change le nom de l'en-tête dans `_headers`, recharge et regarde la console. Dans Chrome 154, avec l'icône `data:,` de la leçon 10 encore en place, la violation apparaît comme un message d'information : « Loading the image 'data:,' violates the following Content Security Policy directive: "img-src 'self'". The policy is report-only, so the violation has been logged but no further action has been taken. » MDN avertit que, pour que les rapports soient *envoyés* quelque part, la politique a besoin de la directive `report-to` et d'un serveur qui les reçoive ; sans eux, tu ne vois que ce qui sort dans ta console. Pour un petit site, voir la console suffit. Quand il n'y a plus de messages, tu reviens au nom `Content-Security-Policy` et la politique est désormais imposée.

**Ce qu'une CSP ne fait pas.** Qu'elle ne te fasse pas croire que le problème est résolu. La figure 11.2 insère, avec `innerHTML`, un nom contenant une attaque (une image cassée avec un attribut `onerror`), sous la même politique :

```html
<!-- fig11_02.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="Content-Security-Policy" content="script-src 'self'">
  <title>La política no arregla el innerHTML</title>
  <link rel="icon" href="data:,">
</head>
<body>
  <main>
    <h1>La política no arregla el innerHTML</h1>
    <p id="result" role="status"></p>
    <div id="zone"></div>
  </main>

  <script src="fig11_02/inject.js"></script>
</body>
</html>
```

```js
// fig11_02/inject.js
// Un nombre que viene de fuera y trae un ataque dentro.
const incoming = '<img src="missing.png" onerror="document.title = \'atacado\'">';

// MAL: innerHTML interpreta el texto como HTML.
document.getElementById("zone").innerHTML = incoming;

const images = document.querySelectorAll("#zone img").length;
document.getElementById("result").textContent =
  `Imágenes inyectadas: ${images}. Título de la página: ${document.title}`;
```

Prédis : l'attribut `onerror` s'exécute-t-il ? L'image reste-t-elle dans la page ?

```text
La política no arregla el innerHTML
Imágenes inyectadas: 1. Título de la página: La política no arregla el innerHTML
```

L'image est restée : le HTML injecté est dans la page, `1`. Mais le titre du document n'a pas changé : l'attribut ne s'est pas exécuté, et la console dit pourquoi (en plus du 404 d'une image qui n'existe pas) :

```text
Executing inline event handler violates the following Content Security Policy directive 'script-src 'self''. Either the 'unsafe-inline' keyword, a hash ('sha256-...'), or a nonce ('nonce-...') is required to enable inline execution. Note that hashes do not apply to event handlers, style attributes and javascript: navigations unless the 'unsafe-hashes' keyword is present. The action has been blocked.
```

C'est la CSP qui fait son travail de seconde couche : elle a contenu les dégâts. Mais les dégâts qui ont bien eu lieu —un HTML étranger dans ta page— sont justement ceux que `textContent` empêche. La CSP ne répare pas un `innerHTML` mal placé ; elle ne fait que réduire ce qu'il peut faire. Et toute attaque n'a pas besoin d'un script : qui injecte un faux formulaire ou un texte trompeur n'a besoin de rien exécuter.

**Ce qui vient.** Il y a deux mécanismes plus récents qui s'attaquent au même problème par un autre côté, et pour l'instant ils ne sont la base de rien de ce que tu écris ici. **Trusted Types** ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API)) fait qu'assigner un texte brut à `innerHTML` lance une erreur, si la politique l'exige avec `require-trusted-types-for 'script'` ; MDN le marque « Baseline 2026, récemment disponible » (depuis février 2026). **`setHTML()` et l'API de nettoyage** ([MDN](https://developer.mozilla.org/fr/docs/Web/API/Element/setHTML)) nettoieraient le HTML avant de l'insérer ; MDN le marque comme à disponibilité limitée, non Baseline. La règle du cours se maintient : on ne les utilise pas en production tant qu'ils ne sont pas Baseline. Pour ton tableau de bord, `textContent` fait déjà le travail.

**La balise, quand il n'y a pas d'autre solution.** Si le site où tu publies ne te laisse pas envoyer d'en-têtes —la documentation de GitHub Pages consultée pour préparer cette leçon ne décrit aucune façon de le faire, et c'est pourquoi il convient de le vérifier avec `curl -I` sur ton site publié—, la balise `<meta>` vaut mieux que rien. L'`index.html` du tableau de bord **ne l'a pas**, parce que sa politique voyage dans `_headers` ; si tu publies là où les en-têtes ne sont pas lus, tu l'ajoutes toi-même. C'est cette ligne, avec les mêmes directives que `_headers` moins `frame-ancestors`, qui dans une balise ne fonctionne pas et que le navigateur ignore avec un avertissement :

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; form-action 'none'; base-uri 'none'">
```

Elle va le plus haut possible dans le `<head>`, juste sous `<meta charset="utf-8">` : la [spécification de la CSP](https://www.w3.org/TR/CSP3/) avertit qu'une politique dans une balise ne s'applique pas à ce qui apparaît avant elle, donc un `<link>` ou un `<script>` écrits plus haut resteraient dehors. On l'a vérifié ainsi, avec le tableau de bord servi par le `python3 -m http.server` habituel (qui n'envoie pas d'en-têtes) depuis un sous-dossier, comme le sert GitHub Pages : le tableau, les quatre cas de `?case=` et la console sans un seul message, sauf le 404 provoqué de `?case=error`. Tu perdras `frame-ancestors` et le mode rapport seul, et tu devras te dire sans détour que ton site a une CSP plus faible que celle d'un serveur qui envoie bel et bien des en-têtes.

### 11.3 Poids et performances : mesurer avant d'optimiser

L'amélioration de performance la plus courante est celle qui n'était pas nécessaire. On voit un chiffre alarmant, on applique une recette d'un article, et personne ne remesure. La discipline de cette section est le contraire : **d'abord on mesure, ensuite on décide, et à la fin on remesure.**

**Le poids.** Ce qu'on mesure d'abord est le plus simple : combien d'octets pèse ce que le navigateur télécharge. Depuis le dossier `revisor/` :

```bash
wc -c index.html favicon.svg css/*.css js/*.js data/services.json
```

Le résultat, arrondi, et ce que pèserait chaque type compressé, calculé avec `gzip -9 -c archivo | wc -c`. Cette seconde colonne est une **estimation**, pas une mesure de ce qui voyage : les services de publication compriment en général les réponses de texte, mais chaque serveur décide s'il comprime et avec quel algorithme (`gzip`, `br`…), et seul l'en-tête `Content-Encoding` de la réponse dit ce qui a vraiment été appliqué ([RFC 9110, §8.4](https://www.rfc-editor.org/rfc/rfc9110.html#section-8.4)). En 11.4, tu le vérifies avec `curl` sur ton site publié :

| Type | Fichiers | Octets | Compressé (approx.) |
|---|---|---|---|
| HTML | `index.html` | 5,374 | 1,742 |
| CSS | `css/styles.css` | 11,192 | 3,722 |
| JavaScript | sept modules | 20,731 | 8,577 |
| Données | `data/services.json` | 439 | 211 |
| Icône | `favicon.svg` | 194 | 180 |
| **Total** | | **37,930** | **environ 14,400** |

Trente-sept mille octets sans compression et environ quatorze mille si le serveur comprime. La feuille de style est la moitié de ce qu'elle paraît : une bonne partie de ses onze mille octets sont les commentaires qui expliquent chaque règle, et compressés ils disparaissent presque. Une seule photographie de téléphone pèse des centaines de fois cela. Il y a trois conclusions. Une : pour ce tableau de bord, **réduire les octets n'est pas le problème**. Il n'est pas nécessaire de minifier ni d'empaqueter, et cela ne vaut pas la peine de compliquer un cours « sans un seul outil de construction » pour économiser trois kilo-octets. Deux : le module le plus lourd est `js/main.js` (7,165 octets), parce que c'est là que vit le formulaire. Trois : si un jour le tableau de bord avait des images, c'est là qu'il y aurait du poids, et alors il faudrait mesurer de nouveau.

**Les trois métriques.** La performance que ressent une personne se résume en trois chiffres, appelés les signaux web essentiels (Core Web Vitals), définis par [web.dev](https://web.dev/articles/vitals). Chacune s'évalue au 75e centile des visites, c'est-à-dire la valeur que 75 % des visites égalent ou améliorent :

| Métrique | Ce qu'elle mesure | Bon |
|---|---|---|
| [LCP](https://web.dev/articles/lcp) (affichage du plus grand contenu) | quand apparaît l'essentiel | 2.5 s ou moins |
| [INP](https://web.dev/articles/inp) (de l'interaction à l'affichage suivant) | combien de temps la page met à répondre à un clic, un toucher ou une touche | 200 ms ou moins |
| [CLS](https://web.dev/articles/cls) (décalage cumulé de la mise en page) | combien la page bouge toute seule, sans que la personne fasse quoi que ce soit | 0.1 ou moins |

Pour l'INP, web.dev considère comme mauvais tout ce qui dépasse 500 ms ; pour le CLS, ce qui dépasse 0.25.

**Laboratoire et terrain.** Un détail qui décide quel outil utiliser et ce qu'il faut en croire. Les métriques « de terrain » se mesurent avec de vraies personnes qui utilisent la page. Celles de « laboratoire » se mesurent sur ton ordinateur, avec un profil simulé. LCP et CLS peuvent se mesurer des deux côtés. **L'INP a besoin que quelqu'un interagisse**, et cela change tout. Un test de chargement en laboratoire —ouvrir la page et mesurer, sans la toucher— ne produit aucun INP, parce que personne n'a cliqué ; Lighthouse dans son mode normal est ainsi, et à la place il indique le *temps total de blocage* (TBT), que web.dev considère comme une approximation raisonnable mais pas un substitut. On *peut* mesurer l'INP en laboratoire si tu interagis toi-même pendant la mesure, mais, comme l'avertit le [guide de l'INP](https://web.dev/articles/inp), le chiffre dépend des interactions que tu as faites ; celui qui compte est celui des vraies personnes, sur le terrain. C'est pourquoi un 100 dans Lighthouse n'est pas une « performance parfaite » : c'est « sans problème dans ce que Lighthouse sait mesurer ». Quand tu auras de vraies visites, ces mesures se trouvent dans l'outil de rapports de ton service de publication ou dans les données publiques de Chrome ; en attendant, ce qui est à ta portée, c'est le laboratoire.

**Mesurer dans la console.** Pour voir le LCP et le CLS de ton tableau de bord sans rien installer, ouvre le tableau de bord, et colle ceci dans la console :

```js
const result = { lcp: null, cls: 0 };
new PerformanceObserver((list) => {
  result.lcp = Math.round(list.getEntries().at(-1).startTime);
}).observe({ type: "largest-contentful-paint", buffered: true });

let burst = 0;  // suma de la ráfaga (ventana de sesión) en curso
let burstStart = 0;
let lastShift = 0;
new PerformanceObserver((list) => {
  for (const shift of list.getEntries()) {
    if (shift.hadRecentInput) continue;
    const sameBurst = burst > 0
      && shift.startTime - lastShift < 1000
      && shift.startTime - burstStart < 5000;
    if (sameBurst) {
      burst += shift.value;
    } else {
      burst = shift.value;
      burstStart = shift.startTime;
    }
    lastShift = shift.startTime;
    result.cls = Math.max(result.cls, burst);
  }
}).observe({ type: "layout-shift", buffered: true });
setTimeout(() => console.log(result), 300);
```

`buffered: true` demande au navigateur les entrées qui ont déjà eu lieu avant que tu colles le code, et `hadRecentInput` écarte les sauts causés par quelque chose que la personne a fait (qui ne comptent pas). Le reste du second observateur suit la [définition en vigueur du CLS](https://web.dev/articles/cls) : les sauts ne s'additionnent pas tous, mais par **rafales** (fenêtres de session). Un saut appartient à la rafale en cours s'il arrive moins d'une seconde après le précédent et que la rafale ne dure pas encore cinq secondes ; sinon, une nouvelle rafale commence. Le CLS est la rafale qui totalise le plus (`Math.max`). Avant 2021, le CLS était la somme de tous les sauts de la vie de la page, et c'est pourquoi tu verras encore des fragments qui font `cls += value` tout simplement : dans une page qui reste ouverte longtemps, cette somme croît sans limite et cesse de pouvoir se comparer aux seuils de 0.1 et 0.25. Dans le tableau de bord, les deux calculs donnent la même chose, parce que tout le chargement produit un seul saut ; le fragment correct est celui qui vaut pour n'importe quelle page. Sur ton ordinateur, sans limiter le réseau, le tableau de bord donne un LCP d'environ 20 à 60 ms et un CLS proche de 0 : si rapide qu'il n'y a rien à améliorer. Mais c'est se tromper soi-même : ton ordinateur et ton réseau local ne sont pas ceux de qui ouvrira le tableau de bord depuis un téléphone.

**Un profil lent.** Dans les outils du navigateur, l'onglet **Réseau** (dans Chrome et dans Firefox) permet de choisir un profil de connexion lente. Pour cette leçon, on a utilisé un profil fixe, pour que les chiffres puissent se répéter : 150 ms de latence par requête et 200 Ko/s de téléchargement, sans cache, avec la fenêtre à 1280 et à 320 pixels de large, trois passages de chacune. **Ce sont des chiffres simulés dans Chrome 154 de façon automatisée** ; les tiens seront différents, et ce qui compte est la différence entre avant et après sur ta machine.

| | Tableau de bord de la leçon 10 | Tableau de bord de cette leçon |
|---|---|---|
| CLS à 1280 px | 0.077 | 0.001 |
| CLS à 320 px | 0.831 | 0.001 |
| LCP | de 420 à 440 ms | de 468 à 484 ms |
| La requête de `data/services.json` commence à | environ 790 ms | environ 550 ms |
| Le tableau apparaît à | environ 950 ms | environ 715 ms |

Deux choses ont beaucoup changé et une n'a pas changé. Le CLS à 1280 px était sous le seuil de 0.1, mais à 320 px il était de 0.831 : plus de trois fois la limite du « mauvais », dans la largeur qui compte le plus. Et le tableau, qui est ce que la personne est venue voir, apparaît environ 230 ms plus tôt. Ce qui n'a pas changé est le LCP, et il convient de comprendre pourquoi : le plus grand élément que peint le navigateur est le titre « Revisor de servicios » (Vérificateur de services), qui est dans le HTML et se peint avant qu'aucune donnée n'arrive ; accélérer les données ne le déplace pas (les variations de quelques dizaines de millisecondes sont dans ce qui change d'un passage à l'autre). Une métrique mesure ce qu'elle mesure : le LCP ne sait pas quand ton tableau est apparu, et c'est pourquoi cette leçon mesure aussi ce moment. Voyons les causes.

**La cascade.** Dans l'onglet Réseau, chaque fichier est une barre, et l'ordre dans lequel les barres commencent raconte l'histoire du chargement. Le navigateur télécharge `index.html`, et c'est seulement alors qu'il découvre `main.js`. Il télécharge `js/main.js`, et c'est seulement alors qu'il découvre qu'il importe `js/load.js`, `js/state.js`, `js/view.js` et `js/form.js`. Il télécharge `js/state.js`, et c'est seulement alors qu'il découvre qu'il importe `js/filters.js` ; il télécharge `js/view.js`, et découvre `js/stats.js`. Et la requête des données ne part pas avant que tout cela soit exécuté. Chaque « c'est seulement alors » est un aller-retour vers le réseau ; avec 150 ms de latence, quatre niveaux totalisent une demi-seconde, et la personne voit « Cargando servicios… » (Chargement des services…) pendant tout ce temps.

La solution est de dire au navigateur, dès le départ, quels modules il va lui falloir, avec `rel="modulepreload"` ([MDN](https://developer.mozilla.org/fr/docs/Web/HTML/Reference/Attributes/rel/modulepreload)) : dans le `<head>`, une ligne par module, pour qu'il les télécharge tous en parallèle dès le premier moment. MDN le situe comme disponible dans tous les navigateurs depuis septembre 2023 et avertit de ne pas précharger *tout*, pour ne pas retirer de bande passante à ce qui est vraiment urgent. Avec six modules de quelques kilo-octets, il n'y a aucun risque.

**Le saut.** Le CLS est sorti d'une mesure avec l'API d'instabilité de mise en page, qui dit en plus *quels éléments* ont bougé. Dans le tableau de bord de la leçon 10, à 320 px, bougeaient le `<main>` et le `<nav>` (de la position verticale 134 à la 160), les lignes du récapitulatif et le pied de page. Trois causes, et les trois sont la même chose : quelque chose qui **arrive tard** et pousse ce qui était déjà là. La première, la « Última revisión » : l'en-tête dit « todavía no » (pas encore), sur une ligne, et quand la date arrive, à 320 px, elle en occupe deux ; tout ce qui est dessous descend de 26 px. La deuxième, les chiffres du récapitulatif : un `<dd>` vide n'a pas de hauteur, et quand il se remplit, sa ligne grandit. La troisième, le pied : pendant le chargement, la page est courte et le pied est à la vue ; quand le tableau apparaît, il le pousse hors de l'écran, et le navigateur compte cela comme un saut.

La solution s'appelle **réserver l'espace** : tu dis à la page combien va occuper ce qui arrivera, avant que cela arrive. C'est un dernier bloc à la fin de `css/styles.css`, et le `<p>` de la « Última revisión » gagne la classe `last-check` pour pouvoir le viser :

```css
@layer components {
  /* ---- Lección 11: reservar el hueco de lo que llega tarde ---- */
  /* Las cifras del resumen se escriben cuando llegan los datos. Un <dd> vacío no tiene
     altura; un espacio que no se ve le da su línea mientras tanto, del mismo alto que la cifra. */
  .summary dd:empty::before {
    content: "\00a0";
  }

  /* En una pantalla angosta, «Última revisión» y la fecha ocupan dos líneas cuando la
     fecha llega; se reservan desde el principio (2 × 1.6rem). */
  @media (width < 30rem) {
    .last-check {
      min-height: 3.2rem;
    }
  }

  /* El pie de página no tiene por qué verse mientras los datos llegan: con el contenido
     principal de al menos el alto de la ventana, la tabla que aparece ya no lo empuja
     dentro de la pantalla. align-content: start impide que la rejilla reparta ese alto
     de sobra entre sus renglones. */
  .layout {
    min-height: 100vh;
    align-content: start;
  }
}
```

Chaque règle a son histoire de mesure. Celle du récapitulatif a d'abord été essayée comme `min-height: 2rem` sur le `<dd>`, ce qui semblait l'évidence, et a empiré les choses dans les lignes compactes de la leçon 5 : un `<dd>` vide n'a pas de ligne de base, et la ligne alignée sur la base (`align-items: baseline`) se plaçait autrement qu'avec le chiffre. Une espace insécable (`\00a0`) générée avec `::before` a bien une ligne de base, et le `<dd>` mesure la même chose vide que plein. Elle n'est générée que tant que le `<dd>` est vide (`:empty`), et une espace ne se lit pas à voix haute. La règle du pied a d'abord été essayée sur `main`, et le saut a empiré : la hauteur en trop se répartissait entre les rangées de la grille et déplaçait les sections ; `align-content: start` laisse tout en haut. C'est la même idée avec laquelle la leçon 10 a réservé la ligne de chaque erreur de formulaire, et l'avertissement de web.dev dans son guide du CLS vaut ici : réserver de l'espace est une estimation. Si le texte s'avère plus long, cela sautera un peu ; s'il est plus court, il restera un vide. La décision est une affaire de conception : un petit vide vaut mieux qu'un saut.

**Ce qui n'a pas été fait, et pourquoi.** On n'a rien minifié : le tableau de bord pèserait environ quatorze kilo-octets sur le réseau avec un serveur qui comprime. On n'a pas utilisé `loading="lazy"` : il n'y a pas d'images ; et quand il y en aura, l'image principale de la page ne doit jamais le porter, parce qu'il retarde le LCP. On n'a utilisé ni `async` ni `defer` dans le `<script>` : les modules (`type="module"`) sont différés tout seuls. Chacune de ces recettes est bonne à sa place, et chacune aurait été du bruit ici. Ne pas optimiser ce qui est déjà bon fait partie de la discipline.

**Le panneau Lighthouse.** Pour clore, l'auditeur. Dans Chrome : outils de développement, onglet **Lighthouse**, « Analyser le chargement de la page ». La [documentation de Chrome](https://developer.chrome.com/docs/lighthouse/overview) liste aujourd'hui cinq groupes de vérifications : performance, accessibilité, bonnes pratiques, SEO et un nouveau, « navigation par agents » (*agentic browsing*), qui mesure à quel point il est facile pour un programme automatisé de comprendre et d'utiliser la page. Ce cinquième groupe est entré dans la configuration habituelle dans la version 13.3.0, de mai 2026 ([notes de version](https://github.com/GoogleChrome/lighthouse/releases/tag/v13.3.0)), et sa propre [page de notation](https://developer.chrome.com/docs/lighthouse/agentic-browsing/scoring) avertit qu'il est **expérimental**, qu'il repose sur des normes encore proposées et qu'il ne donne pas une note de 0 à 100, mais une fraction : combien de ses vérifications applicables tu as réussies. Sur le tableau de bord terminé, Lighthouse 13.5.0 l'affiche comme **2/2** : les deux qui s'appliquent passent (que l'arbre d'accessibilité soit bien formé et le CLS), et les cinq autres sortent comme « non applicable », parce qu'elles vérifient des pièces que le tableau de bord n'a pas (trois sur WebMCP, un fichier `llms.txt` et un `ai-catalog.json`). Malgré tout, ici on n'en tient pas compte : on suit la règle du cours de ne pas s'appuyer sur ce qui n'est pas encore Baseline. Pour cette leçon, on a lancé Lighthouse 13.5.0 depuis sa ligne de commande (tu as le même moteur dans le panneau de Chrome, sans rien installer) sur le tableau de bord servi avec ses en-têtes, et il a donné 100 dans les quatre catégories qui sont bien notées de 0 à 100 —performance, accessibilité, bonnes pratiques et SEO—, avec un LCP simulé de 1.4 s, un CLS de 0.001, un temps total de blocage de 0 ms et 42 KiB au total. Ces 42 KiB ne contredisent pas les quatorze kilo-octets ci-dessus : le serveur Python **ne comprime pas** (avec `curl -sI -H "Accept-Encoding: gzip, br"` aucun `Content-Encoding` n'apparaît), donc Lighthouse a compté les 37.9 Ko sans compression plus les en-têtes de chaque réponse. Mesuré dans Chrome sur le même serveur, le total transféré fait 42,709 octets, 41.7 KiB. Ce que Lighthouse a quand même signalé, même avec 100, c'est « Network dependency tree » : la chaîne de requêtes que tu vois dans la cascade. Un 100 et un avertissement font bon ménage ; l'avertissement est une information, et le 100 n'est pas un but.

### 11.4 Publier un site statique

Un site statique est un dossier de fichiers qu'un serveur livre tels quels, sans rien exécuter de ta part. C'est ce qu'est le `revisor` : du HTML, du CSS, du JavaScript qui s'exécute dans le navigateur, et un JSON. « Publier », c'est copier ce dossier vers un service qui le sert sur internet avec une adresse et, de préférence, avec tes en-têtes. Il n'y a pas d'étape de construction, parce que le tableau de bord n'en a jamais eu besoin.

**Ce qu'on publie.** Le **contenu** de `revisor/` (pas le dossier qui le contient) : `index.html` doit se retrouver à la racine du site. Cela inclut `_headers`. Avant de le mettre en ligne, trois vérifications :

1. **Rien de secret.** Le site sera public ; tout fichier que tu mets en ligne, quiconque connaît l'adresse peut le lire. Dans le tableau de bord, il n'y a pas de clés, et la règle est qu'il n'y en ait jamais.
2. **Les fichiers d'essai.** `data/services-empty.json` et la table `CASES` de `js/main.js` existent pour voir les états du tableau de bord. Ils ne font aucun mal (la table est une liste fermée qui n'utilise jamais le texte de l'adresse comme adresse de la requête, comme on l'a expliqué dans la leçon 9), mais décide si tu veux un tableau de bord publié avec ce mode d'essai ou sans lui.
3. **Les données sont des exemples.** Le `data/services.json` que tu publies est celui que tout le monde verra. Qu'un tableau de bord montre des services qui n'existent pas est légitime pour un exercice ; dis-le sur le site lui-même si tu le partages.

**Où.** Il y a plusieurs options gratuites. Voici celles qu'on a consultées pour la leçon, avec ce que leurs propres pages disent, **par ordre de préférence** : les deux premières envoient tes en-têtes ; GitHub Pages vient en dernier parce qu'il ne le fait pas, et tu vas voir tout de suite ce que tu perds de ce fait.

- **Cloudflare Pages.** Permet de mettre en ligne un dossier en le glissant dans le panneau de contrôle (« Envoi direct » : dans la section Workers et Pages, « Create application », « Get started », « Drag and drop your files » ; il accepte un dossier ou un zip), et laisse le site à `nombre-del-proyecto.pages.dev` ([guide](https://developers.cloudflare.com/pages/get-started/direct-upload/)). Il lit `_headers` ([documentation](https://developers.cloudflare.com/pages/configuration/headers/)) : jusqu'à 100 règles, 2,000 caractères par ligne. La documentation consultée ne dit pas expressément si `_headers` est respecté dans l'envoi direct ; vérifie-le avec `curl`, comme plus bas.
- **Netlify.** « Netlify Drop » ([guide](https://docs.netlify.com/site-deploys/create-deploys/)) permet de glisser un dossier déjà construit et de le publier sans compte et sans Git ; le site anonyme est temporaire, il faut le réclamer dans la première heure. Il lit aussi `_headers` ([documentation](https://docs.netlify.com/manage/routing/headers/)).
- **GitHub Pages, la dernière option.** Il publie à partir d'un dépôt GitHub, et seulement depuis deux endroits d'une branche : sa racine (`/`) ou un dossier appelé `/docs` ([documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)) ; l'autre voie est un flux automatisé de GitHub Actions, que ce cours n'utilise pas. C'est pourquoi le **contenu** de `revisor/` doit se retrouver à la racine du dépôt, pas dans un dossier `revisor/`. Avec l'offre gratuite, le dépôt **doit être public** ([documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)) ; les modifications peuvent mettre jusqu'à dix minutes à se voir ; et ses [limites](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) comprennent un site de 1 Go au maximum, une limite souple de 100 Go de transfert par mois, et l'interdiction de l'utiliser comme hébergement gratuit d'une entreprise. Comme on l'a dit en 11.2, il n'y a pas de façon documentée d'envoyer des en-têtes propres ; de plus, GitHub Pages traite le site avec Jekyll, qui par défaut [ne publie pas les fichiers dont le nom commence par `_`](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll), donc `_headers` n'arrive même pas. Si tu choisis GitHub Pages, la CSP, c'est toi qui la mets : ajoute au `<head>` de `index.html` la balise `<meta>` de 11.2 avant de le mettre en ligne.

**Pourquoi GitHub Pages vient en dernier : une CSP plus faible.** Pense à la différence entre une règle que le serveur annonce **avant** de livrer la page et une note écrite **dans** la page. L'en-tête arrive en premier, et le navigateur l'applique à tout ; la balise `<meta>` ne se lit que lorsque le navigateur lit déjà le HTML. C'est pourquoi la [spécification de la CSP](https://www.w3.org/TR/CSP3/#meta-element) laisse hors de la balise trois directives : `frame-ancestors`, `sandbox` et `report-uri`, ainsi que tout le mode rapport seul. Pour le tableau de bord, la perte qui compte est la première : `frame-ancestors 'none'` est ce qui empêche un autre site de mettre ta page dans un cadre (`<iframe>`) et de la déguiser sous de faux boutons pour que quelqu'un clique sans savoir sur quoi ([MDN](https://developer.mozilla.org/fr/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors) dit expressément que cela ne fonctionne pas dans `<meta>`). Et la CSP n'est pas la seule chose qui voyageait dans `_headers` : `X-Content-Type-Options: nosniff` n'a pas de version en balise, donc il se perd aussi ; `Referrer-Policy` en a une, `<meta name="referrer" content="no-referrer">` ([MDN](https://developer.mozilla.org/fr/docs/Web/HTML/Reference/Elements/meta/name/referrer)), si tu veux la conserver. Pour un exercice avec des données d'exemple, le risque est petit et publier sur GitHub Pages est légitime ; pour un vrai site, choisis un service qui envoie des en-têtes.

Aucune des trois n'a besoin de Node ni de rien installer, et les trois conviennent pour cet exercice ; ce qui n'est pas secondaire, c'est ce qui suit.

**Publier sur GitHub Pages sans utiliser Git dans le terminal.** Dans la leçon 1, tu as enregistré des versions avec Git sur ton ordinateur, mais le cours ne t'a jamais appris à les envoyer vers un service comme GitHub, et pour publier ce n'est pas nécessaire : GitHub permet de mettre des fichiers en ligne depuis le navigateur. Si tu choisis cette option, ce sont cinq étapes, toutes tirées de la documentation de GitHub :

1. **Un compte.** Si tu n'en as pas, crée-en un gratuit sur `github.com`. Ton nom d'utilisateur apparaîtra dans l'adresse du site.
2. **Un dépôt public.** En haut à droite de n'importe quelle page de GitHub, le bouton **+** puis **New repository** ; donne-lui un nom (par exemple `revisor`), choisis la visibilité **Public** et appuie sur **Create repository** ([documentation](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository)).
3. **Les fichiers.** D'abord, ajoute à ton `index.html` la balise `<meta>` de la CSP (11.2). Ensuite, sur la page du dépôt, **Add file** puis **Upload files**, et glisse dans la fenêtre du navigateur **ce qu'il y a dans** ton dossier `revisor/` —`index.html`, `favicon.svg` et les dossiers `css`, `js` et `data`—, pas le dossier `revisor` lui-même : `index.html` doit se retrouver à la racine. Écris un message, comme tu le ferais avec `git commit`, et confirme ([documentation](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository) ; le navigateur admet jusqu'à 100 fichiers à la fois et 25 MiB par fichier, largement assez pour le tableau de bord).
4. **Allumer Pages.** Dans le dépôt, **Settings**, puis **Pages** dans la barre latérale ; dans « Build and deployment », dans **Source**, choisis **Deploy from a branch**, et pour la branche choisis `main` et le dossier `/ (root)` ; enregistre ([documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)).
5. **L'adresse.** Un site d'un dépôt se trouve à `https://<tu-usuario>.github.io/<repositorio>/` ([documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages)), par exemple `https://ana.github.io/revisor/`. Remarque que le tableau de bord vit dans un **sous-dossier** du domaine, `/revisor/`. Cela fonctionne parce que tous les chemins du tableau de bord sont relatifs (`css/styles.css`, `data/services.json`) ; un chemin qui commencerait par `/`, comme `/css/styles.css`, chercherait à la racine du domaine et donnerait un 404.

Si tu sais déjà utiliser `git push`, cela convient aussi, et le résultat est le même ; ce cours ne l'enseigne pas parce que pour publier un dossier tu n'en as pas besoin.

**Vérifier ce qui est publié.** La promesse d'un service n'est pas une preuve. Avec ton adresse déjà publiée (ici `https://tu-sitio.example`), trois vérifications dans un terminal :

```bash
curl -sI https://tu-sitio.example/ | grep -i -E "content-security|nosniff|referrer"
curl -sI -H "Accept-Encoding: gzip, br" https://tu-sitio.example/js/main.js | grep -i content-encoding
curl -s -o /dev/null -w "%{http_code}\n" https://tu-sitio.example/data/services.json
```

La première doit montrer tes trois en-têtes ; s'il n'en sort aucun, le service n'a pas lu `_headers` et ton site n'a pas la CSP, même si le fichier est là. Sur GitHub Pages il n'en sortira aucun, et c'est attendu : là, la vérification est que l'`index.html` publié porte la balise `<meta>` (`curl -s https://tu-sitio.example/ | grep -i content-security`). La deuxième dit si le service comprime les réponses de texte (`gzip` ou `br` doit apparaître). La troisième, `200`. Ensuite, ouvre le site dans le navigateur avec la console ouverte et répète les cinq critères de la section suivante, maintenant sur l'adresse publique. Un chemin qui fonctionnait sur ton ordinateur peut se casser à la publication : c'est là qu'on trouve les chemins absolus écrits par erreur et les noms qui ne diffèrent que par les majuscules. Sous Linux Mint, `Main.js` et `main.js` sont deux fichiers distincts, comme pour le serveur, donc cette erreur, tu l'aurais déjà vue sur ton ordinateur ; mais sous Windows et macOS, dont les disques par défaut ne distinguent pas majuscules et minuscules ([Microsoft](https://learn.microsoft.com/en-us/windows/wsl/case-sensitivity), [Apple](https://support.apple.com/guide/disk-utility/file-system-formats-dsku19ed921c/mac)), un `<script src="js/Main.js">` fonctionne sur l'ordinateur et se casse à la publication. Si quelqu'un d'autre travaille sur le tableau de bord depuis ces systèmes, voilà la cause.

**Et ce qu'on ne publie pas.** Le serveur Python avec lequel tu as travaillé (`python3 -m http.server`, et le `headers-server.py` de cette leçon) est un outil pour développer, pas pour servir le public. Si tu l'allumes sans `--bind 127.0.0.1`, il écoute sur toutes les adresses de ton ordinateur et n'importe qui sur ton réseau peut lire le dossier depuis lequel tu l'as lancé ; la [documentation de Python](https://docs.python.org/3/library/http.server.html) avertit, de plus, que le module n'est pas fait pour la production et qu'il n'implémente que des vérifications de sécurité de base. Le nôtre n'écoute que sur `127.0.0.1`, qui est l'adresse de ta propre machine.

### 11.5 Les cinq critères, un par un

Maintenant, la clôture promise. Pour chaque critère, il y a une épreuve que tu peux répéter et le résultat obtenu en préparant la leçon, avec le tableau de bord servi par `headers-server.py` et la console ouverte, dans Chrome 154. Si ton résultat est différent, le critère n'est pas rempli, et ce n'est pas fini tant qu'il ne l'est pas.

**1. Il se parcourt entièrement au clavier.** *Épreuve :* le parcours de 11.1, avec le fragment des arrêts. *Résultat :* seize arrêts dans un ordre raisonnable, tous avec `tabindex 0`, tous avec un contour de focus visible (`outline` plein de 3 px), et aucun piège : après le dernier bouton, le focus revient au début de la page.

**2. Il n'y a pas une seule erreur dans la console.** *Épreuve :* recharge le tableau de bord avec la console ouverte et parcours toute la leçon 10 (filtrer, trier, ajouter, te tromper). *Résultat :* aucun message, ni erreur ni avertissement, dans le parcours normal et dans `?case=empty`, `?case=invalid` et `?case=timeout`. Une exception que tu dois connaître : `?case=error` demande un fichier qui n'existe pas, et le navigateur note de lui-même « Failed to load resource: … 404 ». C'est la requête que tu as provoquée exprès et non un défaut de ton code ; le critère porte sur le parcours normal. La seule chose qui l'a sali en chemin était l'icône `data:,` à l'activation de la CSP, et elle est déjà corrigée (voir 11.2).

**3. Il fonctionne à 320 px de large.** *Épreuve :* la fenêtre à 320 px (le mode appareil des outils) et la ligne de 11.1. *Résultat :* `scrollWidth` et `clientWidth` valent 320 dans les cinq situations : il n'y a pas de débordement.

**Et si tu passes la feuille par le validateur.** Dans la leçon 3, tu as pris l'habitude de passer ton `styles.css` par le [validateur CSS du W3C](https://jigsaw.w3.org/css-validator/) avant de tenir une feuille pour bonne, et il convient de la maintenir. Avec la feuille terminée, tu vas voir quelque chose qui ne sortait pas dans la leçon 3 : le validateur répond avec **deux erreurs**, « Property “container-type” doesn't exist » et « Unrecognized at-rule “@container” », en plus des deux avertissements habituels sur les variables. C'est ainsi qu'il a répondu quand on lui a envoyé `revisor/css/styles.css` en préparant la leçon. Les deux erreurs viennent de la requête de conteneur que tu as ajoutée dans la leçon 5, et ce ne sont pas des erreurs de ta feuille : les requêtes de conteneur font partie de la spécification [CSS Containment Module Level 3](https://www.w3.org/TR/css-contain-3/) et fonctionnent dans tous les navigateurs, comme tu l'as vu dans la leçon 5, mais le validateur ne les reconnaît pas encore. La règle pratique : lis chaque erreur et décide ; si ce qu'il signale est `container-type` ou `@container`, c'est une limitation du validateur et tu la laisses. Toute autre erreur, en revanche, se corrige, comme dans la leçon 3.

**4. Il montre les trois états.** *Épreuve :* ouvre ces adresses sur le tableau de bord publié ou local.

| Adresse | Ce qu'on doit voir |
|---|---|
| `/` | le tableau, « Mostrando 5 de 5 servicios. » (Affichage de 5 services sur 5.) |
| `/?case=empty` | « No hay servicios que revisar. » (Il n'y a pas de services à vérifier.), sans tableau, avec « Reintentar » et avec le formulaire pour ajouter le premier |
| `/?case=error` | « El servidor respondió con el código 404. » (Le serveur a répondu avec le code 404.), avec « Reintentar » |
| `/?case=timeout` | « Cargando servicios… » pendant trois secondes et ensuite « El servidor no respondió en 3000 ms. » (Le serveur n'a pas répondu en 3000 ms.), avec « Reintentar ». Sur le site publié, il n'y a pas de `?delay`, donc là le tableau se charge normalement |

Et pour l'état « chargement », qui sur ta machine dure des millisecondes, l'onglet Réseau avec un profil lent, ou une requête qui ne répond jamais. *Résultat :* les quatre adresses montrent ce que dit le tableau, et avec une requête de données qui ne répond pas, « Cargando servicios… » apparaît immédiatement et, au bout de trois secondes, l'avertissement dit « El servidor no respondió en 3000 ms. » avec « Reintentar ».

**5. Le texte qui vient de l'extérieur se dessine avec `textContent`, jamais avec `innerHTML`.** *Épreuve :* cherche dans ton code.

```bash
grep -n -E "innerHTML|outerHTML|insertAdjacentHTML|document\.write|eval\(" revisor/js/*.js
```

*Résultat :* aucune ligne. Et l'épreuve fonctionnelle de la leçon 7 vaut toujours : ajoute un service appelé `<img src=x onerror=alert(1)>` ; il apparaît comme du texte dans le tableau, tel quel, et rien d'autre ne se passe. La CSP de 11.2 est le renfort de ceci, pas son substitut.

Cinq épreuves, cinq résultats. Si les cinq sortent comme ci-dessus dans ton tableau de bord, le cours est terminé. Et pour le critère 1, il y a un second avis automatique : axe-core 4.14.0 sur les cinq situations du tableau de bord n'a trouvé aucune faute.

Voici l'`index.html` terminé :

```html
<!-- revisor/index.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Revisor de servicios</title>
  <meta name="description" content="Panel que muestra el estado y el tiempo de respuesta de una lista de servicios.">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="css/styles.css">
  <link rel="modulepreload" href="js/state.js">
  <link rel="modulepreload" href="js/filters.js">
  <link rel="modulepreload" href="js/view.js">
  <link rel="modulepreload" href="js/stats.js">
  <link rel="modulepreload" href="js/load.js">
  <link rel="modulepreload" href="js/form.js">
  <script type="module" src="js/main.js"></script>
</head>
<body>
  <header class="page-header">
    <h1>Revisor de servicios</h1>
    <p class="last-check">Última revisión: <span id="checked-at">todavía no</span></p>
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

Par rapport à la leçon 10 ont changé le `<head>` —la description de la page, l'icône propre et les six lignes de `modulepreload`— et une classe dans l'en-tête, `last-check`, pour réserver son espace. Le reste de l'`index.html`, les sept modules et les données sont identiques à ceux de la leçon 10, sauf la première ligne, qui dans le dépôt dit où vit chaque fichier ; `css/styles.css` est celui de la leçon 10 plus le bloc de 11.3.

## L'erreur que tu vas voir

Celui de la politique qui bloque le script en ligne, que tu as déjà vu dans la figure 11.1. C'est le message le plus caractéristique d'une CSP, et il se lit en trois temps :

```text
Executing inline script violates the following Content Security Policy directive 'script-src 'self''. Either the 'unsafe-inline' keyword, a hash ('sha256-…'), or a nonce ('nonce-…') is required to enable inline execution. The action has been blocked.
```

*Ce que cela signifie :* la page a essayé d'exécuter un script écrit dans le HTML, et la politique (`script-src 'self'`) n'admet que des scripts qui sont des fichiers du même site. *Comment le corriger :* déplace le code dans un fichier `.js` et charge-le avec `<script src="…">` ou, mieux, `<script type="module" src="…">`. Les deux autres sorties que le message nomme —une empreinte ou un nombre à usage unique— existent pour des cas particuliers, et tout ouvrir avec `'unsafe-inline'` défait la protection, donc ce n'est pas une sortie.

Une variante, qui apparaît quand le code en ligne est un attribut (`onclick="…"` ou `onerror="…"`) : le message dit « Executing inline event handler violates… » et ajoute une note : les empreintes ne servent pas avec les gestionnaires d'événements. La bonne sortie est la même, `addEventListener` dans un fichier, et c'est celle qu'utilise le tableau de bord.

Et une autre, avec une cause différente : si une directive absente retombe sur `default-src 'none'`, le message le dit : « Note that 'connect-src' was not explicitly set, so 'default-src' is used as a fallback ». On la provoque dans l'exercice 2.

## Ce qui se fait de travers

- **Copier une CSP trouvée sur internet sans la lire.** *À quoi ça ressemble :* une ligne de deux cents caractères avec une douzaine de domaines que ton site n'utilise jamais. *Coût :* chaque domaine autorisé est un endroit d'où l'on peut charger du code dans ta page. Une politique est une liste de ce dont ton site a besoin, pas de ce qu'a utilisé quelqu'un d'autre.
- **`'unsafe-inline'` pour que « ça n'affiche plus d'erreurs ».** *À quoi ça ressemble :* un `script-src 'self' 'unsafe-inline'`. *Coût :* c'est ouvrir justement ce que la politique ferme. Sans cette protection, l'en-tête n'est plus qu'un ornement.
- **Croire que la CSP règle le XSS.** *À quoi ça ressemble :* « j'ai déjà une CSP, donc je peux utiliser `innerHTML` ». *Coût :* la figure 11.2 le montre : le HTML injecté reste dans la page. `textContent` est la défense ; la CSP, la seconde barrière.
- **Un site publié sans vérifier que les en-têtes sont arrivés.** *À quoi ça ressemble :* le fichier `_headers` est dans le dossier et personne n'a fait `curl -I`. *Coût :* le service peut ne pas le lire (ou ne le lire que dans un autre mode d'envoi) ; tu as une politique qui existe sur ton ordinateur et pas sur internet.
- **Optimiser sans mesurer.** *À quoi ça ressemble :* minifier, empaqueter et différer des choses parce que « il le faut ». *Coût :* une complexité que tu n'as achetée avec aucun chiffre. Mesure d'abord, change une chose, mesure de nouveau.
- **Mesurer seulement sur ton ordinateur.** *À quoi ça ressemble :* « ça se charge en 70 millisecondes ». *Coût :* c'est la mesure de la machine la plus rapide et du réseau le plus court qui existent. Limite le réseau dans les outils et regarde la cascade.
- **`loading="lazy"` sur l'image principale.** *À quoi ça ressemble :* une recette de performance appliquée à toutes les images. *Coût :* selon web.dev, elle dégrade le LCP, parce que l'image la plus importante est demandée tard. Seulement pour celles qui sont hors de l'écran.
- **Servir le public avec `python3 -m http.server`, ou sans `--bind 127.0.0.1`.** *À quoi ça ressemble :* allumer le serveur de développement pour que d'autres voient la page. *Coût :* sans `--bind`, n'importe qui sur ton réseau lit le dossier depuis lequel tu l'as allumé ; et en aucun cas ce n'est un serveur fait pour le public.
- **Mettre en ligne un fichier avec des clés sur un site public.** *À quoi ça ressemble :* un `.env`, une clé dans un `services.json`. *Coût :* le dossier entier est lisible par quiconque a l'adresse ; et un secret publié doit être tenu pour perdu, même si tu l'effaces.

## Exercices

### Exercice 1 — Lire une politique

Sans rien exécuter, dis ce que fait chacune de ces deux politiques avec le tableau de bord, et laquelle des deux lui casse quelque chose : (a) `default-src 'self'` ; (b) `default-src 'self'; script-src 'self' 'unsafe-inline'`. Ensuite, mets la (a) dans le `_headers` du tableau de bord et ouvre-le : quelque chose change-t-il par rapport à la politique du tableau de bord ?

### Exercice 2 — Casser quelque chose exprès

Dans une copie du dossier `revisor/`, retire `connect-src 'self';` du `_headers`, démarre `headers-server.py` sur la copie et ouvre le tableau de bord. Note ce que voit la personne à l'écran et ce que dit la console. Ensuite corrige la politique et vérifie de nouveau.

### Exercice 3 — Mesurer toi-même

Avec le tableau de bord servi depuis ton ordinateur et un profil de réseau lent dans les outils du navigateur, mesure avec le fragment de 11.3 le CLS et le LCP du tableau de bord **sans** les six lignes de `modulepreload` et **avec** elles, trois fois chacun. Écris dans le journal de bord tes six chiffres et une phrase : cela a-t-il aidé ? De combien ? Si cela n'a pas aidé, écris pourquoi tu crois que non.

## Solutions

**Exercice 1.** (a) Elle permet de tout charger, mais seulement depuis le même site, et comme `default-src` est la valeur de repli, elle couvre scripts, styles, images et connexions. Elle ne bloque rien de ce que fait le tableau de bord : tout vient de la même origine. Elle ne diffère que dans ce qu'elle **ne** couvre **pas** : elle n'inclut ni `form-action`, ni `base-uri`, ni `frame-ancestors`, qui ne retombent pas sur `default-src` ; autrement dit, elle est moins stricte que celle du tableau de bord ; avec elle, le tableau de bord s'affiche et fonctionne pareil. (b) Elle part de la même base, mais avec `'unsafe-inline'` dans `script-src` elle permet les scripts écrits dans le HTML. Elle ne casse rien au tableau de bord, et c'est la pire des deux : elle ferme beaucoup moins. La leçon : une politique qui « ne casse rien » n'est pas bonne pour autant ; il faut regarder ce qu'elle laisse ouvert.

**Exercice 2.** Sans `connect-src`, la règle de repli `default-src 'none'` bloque le `fetch`. La personne voit « No se pudo conectar con el servidor. » (Impossible de se connecter au serveur.) avec le bouton « Reintentar » (le tableau de bord traite la défaillance du réseau comme n'importe quelle autre, et c'est une bonne raison pour laquelle `js/load.js` convertit les erreurs en messages). La console dit, dans Chrome 154 : « Connecting to 'http://127.0.0.1:…/data/services.json' violates the following Content Security Policy directive: "default-src 'none'". Note that 'connect-src' was not explicitly set, so 'default-src' is used as a fallback. The action has been blocked. », suivi de « Fetch API cannot load … Refused to connect because it violates the document's Content Security Policy ». On corrige en remettant `connect-src 'self';`. Ce qu'on apprend : le tableau de bord se dégrade avec élégance, mais la cause est dans la console, pas à l'écran.

**Exercice 3.** Les chiffres dépendent de ta machine ; ce qui doit ressortir, c'est la forme : avec `modulepreload`, la requête de `data/services.json` commence plus tôt et le tableau apparaît plus tôt ; le LCP, qui est le titre, ne bouge presque pas. Si tu ne vois pas de différence, ce n'est pas une erreur de l'exercice : avec un réseau local rapide et sans limite, la cascade est si courte qu'elle ne se remarque pas. Limite le réseau et réessaie. Si ton CLS était déjà 0 dans les deux cas, c'est aussi un résultat : le saut que nous avons corrigé apparaît quand le récapitulatif tarde à arriver, donc il peut ne pas se produire avec un réseau rapide.

## Comment savoir que j'ai réussi

- [ ] `curl -sI http://127.0.0.1:8000/ | grep -i content-security`, avec `headers-server.py revisor 8000` démarré, affiche la politique de la section 11.2.
- [ ] La figure 11.1 (`fig11_01.html`) affiche « El script externo sí se ejecutó. » (Le script externe s'est bien exécuté.) et la console apporte le message « Executing inline script violates… ».
- [ ] La figure 11.2 affiche « Imágenes inyectadas: 1. Título de la página: La política no arregla el innerHTML » (Images injectées : 1. Titre de la page : La politique ne répare pas innerHTML) et la console apporte « Executing inline event handler violates… ».
- [ ] Avec le tableau de bord de `revisor/` servi avec ses en-têtes, la console est vide dans le parcours normal.
- [ ] Les **cinq critères** de 11.5 sortent comme décrits, chacun avec son épreuve : seize arrêts au clavier, console vide, 320 = 320, les quatre adresses avec leur avertissement, et zéro correspondance dans le `grep`.
- [ ] Tu as un tableau à toi avec le poids du tableau de bord (`wc -c` et `gzip -9 -c … | wc -c`) et, au moins, le LCP et le CLS mesurés avec le fragment de la console.
- [ ] Le tableau de bord est publié à une adresse qui n'est pas `127.0.0.1`, et `curl -sI` sur cette adresse montre les trois en-têtes (sur GitHub Pages, à la place, l'`index.html` publié porte la balise `<meta>` de la CSP). Si tu n'as pas pu le publier, écris dans le journal de bord ce qui l'en a empêché.

**Révision des leçons précédentes** (réponds-y sans regarder, puis vérifie) :

1. Dans la leçon 1 : pourquoi un module JavaScript ne se charge-t-il pas si tu ouvres le fichier avec `file://`, et qu'as-tu fait pour l'éviter ?
2. Dans la leçon 3 : pourquoi `* { box-sizing: border-box }` fait-il qu'une largeur de 300 px soit de 300 px même avec de la marge intérieure ?
3. Dans la leçon 7 : pourquoi `textContent` n'exécute-t-il pas un `<img onerror=…>` ?
4. Dans la leçon 10 : quelle est la différence entre `:invalid` et `:user-invalid` ?

Si l'une t'a échappé, note-la dans le journal de bord : le cours est terminé, mais cette liste est le début de ce qui suit.

**Et la suite.** Le tableau de bord que tu as construit se refait avec des types et avec React dans le [cours de TypeScript](https://www.habil.mx/fr/cours/typescript/) de cette maison. Compare les deux versions : on apprend plus de la comparaison que de recommencer un autre projet.

## Pour aller plus loin

- [MDN — Content Security Policy (CSP)](https://developer.mozilla.org/fr/docs/Web/HTTP/Guides/CSP) : le guide complet, avec les directives, le mode rapport seul et la politique stricte avec `nonce`.
- [web.dev — Core Web Vitals](https://web.dev/articles/vitals) : les trois métriques, leurs seuils et la différence entre laboratoire et terrain.
- [Documentation de Cloudflare Pages — En-têtes personnalisés](https://developers.cloudflare.com/pages/configuration/headers/) : le fichier `_headers` avec sa syntaxe et ses limites.
- [W3C — Comprendre WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/) : chaque critère d'accessibilité expliqué, avec ses techniques et ses échecs typiques.
