# Cours de Fondamentaux du web — de zéro à un tableau de bord que tout le monde peut utiliser

**Par Dorian Chávez, fondateur de Hábil et architecte d'intégration.**

**Pour qui :** pour celui qui n'a jamais écrit une page, et pour celui qui copie des fragments qui fonctionnent sans savoir pourquoi. On ne suppose aucune expérience préalable d'un langage : chaque concept est expliqué au moment où il apparaît, et on explique pourquoi il existe, pas seulement comment l'écrire.

**Ce que tu sauras à la fin :** construire une page complète, comprendre ce que tu as écrit et pouvoir l'expliquer à quelqu'un d'autre. Et garder le jugement qu'il faut pour lire par toi-même la documentation de la plateforme.

**La suite :** ce cours est la marche qui précède le [cours de TypeScript](https://www.habil.mx/fr/cours/typescript/) de la maison, qui refait ce même tableau de bord avec des types et avec React.

**Ce dont tu as besoin avant de commencer :** un ordinateur sous Linux Mint et savoir ouvrir un terminal. La [Leçon 1](01-entorno-ciclo-trabajo.md) installe tout depuis zéro.

## Le projet que tu vas construire

Le **`revisor`** : un tableau de bord qui affiche l'état d'une liste de services — nom, état et temps de réponse — avec son récapitulatif, ses filtres et son formulaire. En HTML, CSS et JavaScript purs, **sans une seule bibliothèque**, en lisant ses données dans un fichier JSON du projet lui-même.

Il démarre à la leçon 2 et grandit à chaque leçon. C'est le même problème que dans les cours de Go, de Rust et de TypeScript de la maison : quand tu passeras à TypeScript, tu referas ce tableau de bord, et comparer les deux versions apprend plus que de commencer un autre projet.

## Les douze leçons

| Leçon | | Ce que tu construis | Ce que tu apprends |
|---|---|---|---|
| 0 | [Comment fonctionne le web](00-como-funciona-la-web.md) | rien encore (lecture) | URL, DNS, HTTP, requête et réponse ; ce que fait le navigateur et ce que fait le serveur ; l'onglet Réseau |
| 1 | [Ton poste et le cycle de travail](01-entorno-ciclo-trabajo.md) | l'environnement et le premier `index.html` | éditeur, terminal et dossiers ; serveur local dès le premier jour ; les outils du navigateur ; un premier enregistrement dans Git |
| 2 | [Du HTML qui a du sens](02-html-con-significado.md) | le squelette du tableau de bord | choisir l'élément pour ce qu'il signifie ; titres, tableaux, boutons et libellés ; le tableau de bord écrit à la main |
| 3 | [CSS : cascade, spécificité et boîte](03-css-cascada-caja.md) | le tableau de bord lisible | d'où vient chaque style et lequel l'emporte ; le modèle de boîte et `box-sizing` ; variables de couleur et de typographie |
| 4 | [Disposer avec Flexbox et Grid](04-flexbox-grid.md) | le tableau de bord disposé sur un écran large | une dimension avec Flexbox et deux avec Grid ; les deux axes, `gap`, `flex` et `flex-wrap` ; des colonnes avec `fr` et `repeat()` |
| 5 | [Une page qui fonctionne sur n'importe quel écran](05-pagina-adaptable.md) | le tableau de bord qui fonctionne sur un téléphone | la balise `viewport` ; `minmax()` et `auto-fit` avant `@media` ; le tableau qui défile dans sa boîte ; `@container` ; de 320 à 1440 px |
| 6 | [JavaScript et le modèle de données](06-javascript-datos.md) | les données du tableau de bord et ses calculs | valeurs, objets, tableaux et fonctions ; décider, répéter et signaler une erreur ; modules ; combien de services sont en marche et la moyenne des temps de réponse |
| 7 | [Le DOM, les événements et l'état](07-dom-eventos-estado.md) | le tableau qui se dessine à partir des données | dessiner à partir de données ; écouter des événements ; séparer l'état et l'affichage ; `textContent` comme habitude, et la faille XSS qu'il évite |
| 8 | [Récupérer des données : promesses, fetch et async/await](08-traer-datos.md) | le tableau de bord qui demande ses données à un fichier JSON | ce qu'est une promesse ; `fetch` en deux temps ; `response.ok` ; `async`/`await` |
| 9 | [Quand quelque chose échoue : délais d'attente, états, CORS et plusieurs requêtes](09-cuando-algo-falla.md) | le tableau de bord qui dit toujours ce qui se passe | délai d'attente ; les trois états : chargement, erreur et vide ; l'erreur CORS ; plusieurs requêtes avec `Promise.allSettled` |
| 10 | [Formulaires et validation](10-formularios-validacion.md) | ajouter et filtrer des services | la validation que le navigateur apporte déjà ; `:user-invalid` ; dire l'erreur pour qu'un lecteur d'écran l'annonce |
| 11 | [Le tableau de bord terminé](11-el-panel-terminado.md) | le `revisor` publié | révision au clavier ; la CSP comme en-tête du serveur ; poids et performance ; publier un site statique |

À la fin de chaque leçon, il y a des exercices avec leurs solutions. Et le [journal de bord](https://github.com/HabilMX/curso-web/blob/main/fr/bitacora.md) est à toi : note-y ce qui t'a coûté.

## Deux critères qui traversent tout le cours

**L'accessibilité et la sécurité ne sont pas des leçons, ce sont des habitudes.** Il n'y a pas de module final sur l'accessibilité : il y a du HTML natif dans la 2, le clavier dans la 3, la 4 et la 5, `textContent` dans la 7, la validation native dans la 10 et la révision dans la 11. Un sujet laissé pour la fin est un sujet qu'on n'apprend pas.

**On n'enseigne que ce qui fonctionne déjà dans tous les navigateurs.** Ce qui n'est pas encore le cas apparaît dans un encadré « ce qui arrive », avec la consigne de ne pas l'utiliser en production. Un cours qui enseigne ce qui vient de sortir vieillit en six mois.

## Comment savoir que tu as terminé

Le cours ne s'achève pas quand tu as lu la leçon 11, mais quand ton tableau de bord remplit ces cinq conditions. Aucun programme ne les vérifie pour toi : tu les vérifies toi-même, avec les outils du navigateur, et la section « Comment savoir que j'ai réussi » de chaque leçon t'explique comment :

1. **On le parcourt entièrement au clavier**, sans utiliser la souris.
2. **Il n'y a pas une seule erreur dans la console** du navigateur.
3. **Il fonctionne à 320 px de largeur** sans débordement horizontal.
4. **Il montre les trois états** : chargement, erreur et vide. Pas seulement le cas où tout se passe bien.
5. **Le texte qui vient de l'extérieur est dessiné avec `textContent`**, jamais avec `innerHTML`.
