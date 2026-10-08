# Leçon 5 — Une page qui fonctionne sur n'importe quel écran

**Durée :** deux sessions d'environ 90 min. Une répartition qui marche : la première, « Le pourquoi avant le comment » (le 320, la balise `viewport` et comment mesurer) et les colonnes qui se comptent toutes seules (5.1) ; la seconde, le tableau qui défile, `@media`, `@container`, le tableau de bord terminé, l'intégrer à ton `revisor` (5.2.7) et les exercices. Chaque session se termine par une page que tu peux ouvrir et mesurer.

**Ce que tu construis :** le tableau de bord qui fonctionne sur un téléphone

**Ce que tu apprends :** ce que fait la balise `viewport` ; l'adaptatif avec `minmax()` et `auto-fit` avant `@media` ; le tableau qui défile dans sa boîte ; `@media` pour la page et `@container` pour la boîte ; de 320 à 1440 px sans débordement

**D'où tu viens.** Tu arrives avec le tableau de bord de la [Leçon 4](04-flexbox-grid.md), disposé avec Flexbox et Grid : l'en-tête sur une rangée, les quatre chiffres du récapitulatif sur quatre colonnes et la barre de contrôles sur une ligne. Sur un écran large, il est bien ; sur un téléphone, pas encore. Toutes les pages de cette leçon se trouvent dans [`programas/05-pagina-adaptable/`](https://github.com/HabilMX/curso-web/tree/main/programas/05-pagina-adaptable) du [dépôt du cours](https://github.com/HabilMX/curso-web), et le point de départ est `fig05_01.html`, qui est le tableau de bord avec lequel s'est terminée la Leçon 4, tel quel. Sa feuille, `fig05_01/styles.css`, est une **copie** de `fig04_06/styles.css`, la feuille de la leçon précédente : elle est répétée exprès, pour que ce dossier fonctionne seul, sans dépendre du dossier d'une autre leçon. Les pages d'essai de cette leçon la chargent avec `<link rel="stylesheet" href="fig05_01/styles.css">`, un chemin *relatif* que le navigateur cherche dans le dossier `fig05_01` à côté de la page ; si tu ne copies qu'un `.html`, sans ce dossier, la page s'affichera sans styles et l'onglet Réseau te montrera le `404` de la feuille. Le tableau de bord terminé, `fig05_06.html`, utilise sa propre feuille, `fig05_06/styles.css`. Si ton `revisor` n'est pas resté identique à la fin de la Leçon 4, peu importe : tu as `fig05_01.html` et sa feuille en entier à la fin de 5.2.6. Tu travailles de nouveau avec `index.html` et `css/styles.css` de ton dossier `revisor`, et le serveur local reste `python3 -m http.server 8000 --bind 127.0.0.1`.

**Ce que cette leçon ne fait pas.** Elle ne touche pas au JavaScript, sauf une ligne que tu vas coller dans la console pour mesurer. Les chiffres du récapitulatif restent écrits à la main ; un programme les comptera dans la Leçon 6 et la Leçon 7 les dessinera dans le tableau. Aujourd'hui, comme dans la leçon précédente, seul change *où* va chaque chose et *combien* elle mesure.

## À la fin, tu seras capable de

- Expliquer ce que dit à un téléphone la balise `viewport` et ce qui se passe sans elle : la page est dessinée dans une fenêtre virtuelle plus large que l'écran (980 px dans Chrome) puis réduite.
- Vérifier par une mesure, pas à l'œil, qu'une page ne déborde pas entre 320 et 1440 px, et trouver le coupable quand elle déborde.
- Déclarer des colonnes qui se comptent toutes seules avec `repeat(auto-fit, minmax(min(100%, 11rem), 1fr))` et expliquer ce que fait chaque pièce de cette ligne.
- Expliquer pourquoi `1fr` ne suffit pas dans une colonne qui contiendra quelque chose de large, et écrire `minmax(0, 1fr)` à sa place.
- Laisser un tableau large défiler dans sa propre boîte sans perdre sa sémantique et sans laisser de côté celui qui utilise le clavier.
- Décider quand une requête média (`@media`) est nécessaire, quand une requête de conteneur (`@container`) l'est, et quand aucune ne l'est.
- Intégrer le tableau de bord adaptable à ton `revisor`, le mesurer à cinq largeurs et l'enregistrer dans Git.

## Le pourquoi avant le comment

Il est deux heures du matin et le téléphone de la personne d'astreinte sonne. Elle ouvre le tableau de bord pour voir quel service est tombé. Elle n'a pas d'ordinateur sous la main : elle a un écran de poche et un pouce. Ce qu'elle a besoin de savoir tient en une phrase (« Inventario ne répond pas »), mais la page, telle que l'a laissée la leçon précédente, la fait travailler plus que nécessaire.

Mesure-le au lieu de le supposer. Ouvre `fig05_01.html` sur ton serveur local, ouvre les outils du navigateur avec `F12` et active le mode d'écran adaptatif (dans Chrome et Edge, c'est l'icône de téléphone et de tablette ; dans Firefox, c'est `Ctrl`+`Maj`+`M`). Mets la largeur à 320 pixels. Tu verras une barre de défilement horizontale : la page est plus large que l'écran, et celui qui l'utilise doit faire glisser de côté pour voir un tableau de trois colonnes. Je l'ai mesuré avec Chrome 154, de façon automatisée et sans fenêtre, et voici ce que cela a donné : à 320 px la page mesure **414 px de large**, le même chiffre qui a clos la Leçon 3 et la Leçon 4 ; à 375 px elle mesure aussi 414 ; à 768 px, 1024 px et 1440 px elle mesure juste ce que mesure la fenêtre, sans rien de trop. Deux éléments dépassent du bord. Le premier est le tableau, qui avec ses trois colonnes et la marge intérieure de chaque cellule arrive jusqu'à 414 px. Le second est nouveau, et c'est la leçon précédente qui l'a apporté : le récapitulatif, dont les quatre colonnes fixes ne tiennent pas sur un téléphone et arrivent jusqu'à 369 px. Le reste —l'en-tête, le champ de recherche, les boutons radio, le bouton— tient déjà, parce qu'ils passent à la ligne avec `flex-wrap` et qu'aucune feuille ne leur a mis de largeur fixe. C'est une qualité qu'il convient de ne pas perdre.

Et à l'extrême opposé reste une dette mineure : sur un écran de 1440 px, le contenu est toujours une colonne de 60 rem (960 px) au centre, avec deux bandes vides sur les côtés, et le tableau se retrouve sous le récapitulatif, alors que les deux tiendraient côte à côte.

Les deux choses ont la même cause. **Le tableau de bord se dispose, mais ne s'adapte pas.** Les quatre colonnes du récapitulatif sont quatre à n'importe quelle largeur, parce qu'elles ont été écrites ainsi ; le tableau mesure ce que mesure son contenu, parce que personne ne lui a dit autre chose ; et la page est une seule colonne même s'il reste de la place. Cette leçon est celle qui lui apprend à décider selon l'espace dont il dispose.

### Ce que signifie « 320 pixels » et pourquoi c'est le nombre

Un **pixel CSS** n'est pas un point physique de l'écran. C'est une unité que le navigateur maintient constante exprès, pour qu'une boîte de 100 px de large s'affiche à peu près à la même taille sur un écran de haute densité que sur un écran ordinaire. Un téléphone avec un écran de 1,080 points physiques de large se déclare en général lui-même comme une fenêtre d'environ 360 à 430 pixels CSS (le chiffre exact varie selon le modèle) ; chaque pixel CSS est peint avec plusieurs points physiques. Quand une feuille de style dit `width: 320px`, elle parle dans cette unité.

Le 320 vient d'une règle publique : [le critère de succès 1.4.10 (« Redistribution du contenu », *Reflow*)](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) des Règles pour l'accessibilité des contenus Web 2.2, qui demande que le contenu puisse se présenter « sans perte d'information ni de fonctionnalité, et sans nécessité de défiler dans deux dimensions » dans une fenêtre équivalente à 320 pixels CSS de large. La raison est l'agrandissement : cette largeur équivaut à ouvrir la page sur un écran de 1,280 px et à zoomer à 400 %. [Une personne malvoyante qui agrandit le texte](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html) jusqu'à ce qu'il se lise confortablement transforme, sans le savoir, son moniteur en un écran de 320 px. Si la page déborde là, cette personne doit faire glisser la page d'un côté à l'autre pour lire chaque ligne. Le 320 n'est pas une manie de vieux téléphones : c'est le plancher de tous.

La même norme apporte une exception qu'il convient de connaître dès maintenant, parce que tu l'utiliseras avec discernement : les parties du contenu qui **exigent une mise en page en deux dimensions pour leur usage ou leur signification** —cartes, vidéo, et aussi tableaux de données— peuvent défiler. Mais l'exception ne couvre que cette partie : le titre du tableau et ce qui l'entoure doivent bien se réorganiser. Plus bas, dans le concept 5.2, le tableau des services défilera *dans sa boîte* et tout le reste se disposera tout seul.


### La balise que tu as déjà écrite sans savoir ce qu'elle faisait

Dans la Leçon 2 tu as mis dans le `<head>` la ligne `<meta name="viewport" content="width=device-width, initial-scale=1">` parce que « c'est comme ça qu'on fait ». Maintenant on comprend. Les téléphones des premières années du web mobile ont rencontré des pages faites pour des ordinateurs de bureau et, pour ne pas les montrer cassées, ils ont inventé une astuce : **ils dessinent la page dans une fenêtre virtuelle plus large que l'écran —typiquement de 980 pixels— puis réduisent le résultat** pour qu'il tienne. Ce comportement reste celui par défaut pour une page qui ne déclare rien. [MDN le documente](https://developer.mozilla.org/fr/docs/Web/HTML/Reference/Elements/meta/name/viewport) et prend 980 px comme exemple, mais aucune norme ne fixe ce chiffre : chaque navigateur choisit le sien. Chrome utilise 980, comme tu vas le mesurer tout de suite ; un autre navigateur ou un autre téléphone peut te donner un nombre différent, et ce qui ne change pas, c'est l'effet : une fenêtre plus large que l'écran, et tout minuscule.

La balise `viewport` demande au navigateur d'utiliser la largeur réelle de l'appareil. La preuve est dans `fig05_02.html`, une page qui exprès ne la porte pas. Je l'ai mesurée avec Chrome 154 dans un téléphone émulé de 390 px de large : sans la balise, `window.innerWidth` vaut **980** ; avec elle (comme dans `fig05_03.html`, que tu verras en 5.1.2) il vaut **390**. Tout ce que tu apprendras dans cette leçon en dépend : une règle comme « à partir de 64 em de large » ne veut rien dire si le navigateur croit que la fenêtre mesure 980 px alors qu'elle en mesure 390.


Voici la page de l'essai, complète :

```html
<!-- fig05_02.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Página sin la etiqueta de ventana</title>
  <link rel="stylesheet" href="fig05_01/styles.css">
</head>
<body>
  <h1>Revisor de servicios</h1>
  <p>Esta página se ve bien en una computadora y diminuta en un teléfono.</p>
</body>
</html>
```

Un avertissement que MDN répète et que la norme d'accessibilité appuie : **ne retire pas au lecteur la possibilité de zoomer sur la page**. Il y a des tutoriels qui ajoutent `user-scalable=no` ou `maximum-scale=1` pour éviter que le téléphone zoome en touchant un champ. Celui qui est malvoyant utilise ce zoom pour lire. Cette ligne reste seule, telle qu'elle est.

### Comment tu vas vérifier

Il y a deux façons de vérifier qu'une page ne déborde pas, et tu vas utiliser les deux pendant toute la leçon.

La première est de regarder : le mode adaptatif des outils du navigateur, avec une largeur de 320 px. Si une barre de défilement horizontale apparaît dans la page (pas dans une boîte concrète), elle déborde.

La seconde est de mesurer, car l'œil se trompe de quelques pixels. Ouvre l'onglet console des outils, colle cette ligne et appuie sur `Entrée` :

```js
document.documentElement.scrollWidth > document.documentElement.clientWidth
```

C'est du JavaScript, que tu n'as pas encore étudié : tu le comprendras en entier dans la Leçon 6, et pour l'instant il suffit de savoir ce qu'il demande. `clientWidth` est la largeur visible de la page et `scrollWidth` est la largeur que son contenu occupe réellement. Si la seconde dépasse la première, le contenu est plus large que la fenêtre et `true` est renvoyé. **Si elle renvoie `false`, il n'y a pas de débordement.** Dans `fig05_01.html` avec la fenêtre à 320 px, cette ligne renvoie `true` ; à la fin de la leçon, avec ton tableau de bord terminé, elle renverra `false` à toutes les largeurs.

## Les concepts

Deux idées, dans cet ordre : les **colonnes qui se comptent toutes seules**, qui résolvent le récapitulatif sans écrire un seul nombre de largeur de fenêtre ; et **l'adaptatif**, qui n'est pas un outil de plus mais une façon d'utiliser Flexbox et Grid pour que la page se dispose toute seule, avec les requêtes média et de conteneur seulement pour ce qui en a vraiment besoin. Chacune s'explique d'abord avec un exemple minimal, puis avec le tableau de bord.

### 5.1 Des colonnes qui se comptent toutes seules

#### 5.1.1 Le piège de `1fr` : le minimum caché

`repeat(4, 1fr)` a un problème qui se voit dès que l'écran se rétrécit : ce sont toujours quatre colonnes, quelles que soient les largeurs. Tu l'as vu à la fin de la section 4.2.3 de la Leçon 4, avec la page [`fig04_05.html`](https://github.com/HabilMX/curso-web/blob/main/programas/04-flexbox-grid/fig04_05.html) de la leçon précédente, qui déclare les quatre chiffres du récapitulatif en quatre colonnes fixes : à 1024 px et à 1440 px c'est bien, mais à 320 px les quatre chiffres se serrent et la page **mesure 344 px de large** (à 375 px elles tiennent déjà, tout juste).

Il y a une raison subtile, qui vaut la peine d'être comprise parce que c'est le piège le plus courant de Grid : **`1fr` n'est pas « une fraction » tout court. C'est `minmax(auto, 1fr)`**. Le minimum de la colonne est `auto`, ce qui signifie « ce que mesure le contenu le plus étroit possible », et une colonne ne rétrécit pas en dessous. Ici, le mot le plus long de chaque chiffre fixe un plancher pour sa colonne. Je l'ai mesuré : les quatre planchers totalisent 280 px, et les trois creux de 16 px, 48 de plus ; cela fait 328 px, plus que les 288 que laisse la page à 320 px après sa marge intérieure, donc la grille déborde au lieu de rétrécir.

La conséquence pratique est importante : **écrire plus de colonnes qu'il n'en tient ne les fait pas rétrécir ; ça les fait déborder**. Et en écrire moins (l'Exercice 2 de la Leçon 4 a essayé avec deux) gaspille de l'espace sur un écran large. Aucun nombre fixe de colonnes ne convient à toutes les largeurs. Ce qu'il faut, c'est dire au navigateur *combien mesure au minimum une colonne* et le laisser compter combien tiennent.

#### 5.1.2 `minmax()`, `auto-fit` et `min()`

[`minmax(minimum, maximum)` est la fonction](https://developer.mozilla.org/fr/docs/Web/CSS/Reference/Values/minmax) qui te permet de fixer toi-même le plancher et le plafond d'une colonne. `minmax(11rem, 1fr)` dit : « cette colonne mesure au moins 11rem (176 px) et, s'il y a de la place, elle croît en la partageant avec les autres ». Avec ce plancher connu, le navigateur sait déjà combien de colonnes tiennent dans une largeur donnée. Et voici la pièce qui réunit tout :

```css
grid-template-columns: repeat(auto-fit, minmax(min(100%, 11rem), 1fr));
```

Elle se lit de l'intérieur vers l'extérieur :

1. `minmax(11rem, 1fr)` : chaque colonne mesure de 176 px vers le haut.
2. `repeat(auto-fit, ...)` : **répète la colonne autant de fois qu'il en tient**. On ne lui dit pas combien ; le navigateur compte.
3. `min(100%, 11rem)` : le plancher est le plus petit entre 11rem et 100 % du conteneur. Sans cette pièce, dans un conteneur plus étroit que 176 px (une barre latérale étroite, un téléphone de 150 px de largeur utile) la colonne ne tiendrait pas et déborderait ; avec elle, le plancher ne dépasse jamais la largeur disponible. [`min()` est une fonction de CSS](https://www.w3.org/TR/css-values-4/) qui renvoie le plus petit de ses arguments, et [MDN la marque comme disponible dans tous les navigateurs depuis juillet 2020](https://developer.mozilla.org/fr/docs/Web/CSS/Reference/Values/min) ; [la plateforme la considère de disponibilité générale depuis janvier 2023](https://web-platform-dx.github.io/web-features-explorer/features/min-max-clamp/), soit les 30 mois de rigueur après.

Il y a deux mots qui se ressemblent et ne font pas la même chose : `auto-fill` et `auto-fit`. Les deux comptent combien de colonnes tiennent. La différence apparaît quand il y a moins d'éléments que de colonnes possibles : `auto-fill` conserve les colonnes vides (l'espace reste réservé, même s'il n'y a rien là) et `auto-fit` les réduit à zéro, de sorte que les éléments qui existent s'étirent et occupent toute la ligne. Je l'ai mesuré en ne laissant que deux chiffres dans la page `fig05_03.html` ci-dessous, avec la fenêtre à 1440 px (la feuille de la Leçon 3 limite le contenu à 60 rem, donc le conteneur mesure 928 px) : avec `auto-fill`, quatre colonnes de 220 px tiennent et les deux cartes restent dans les deux premières, avec une demi-rangée vide ; avec `auto-fit` les deux mesurent 456 px et remplissent la rangée. Pour le récapitulatif du tableau de bord, `auto-fit` : nous voulons que les chiffres qui existent occupent toute la ligne, pas qu'ils laissent un trou.

La page avec la solution est `fig05_03.html`. Elle est identique à `fig04_05.html` sauf pour cette ligne (et pour le chemin de sa feuille, qui est la copie de ce dossier) :

```html
<!-- fig05_03.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Resumen que cuenta sus columnas</title>
  <link rel="stylesheet" href="fig05_01/styles.css">
  <style>
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 11rem), 1fr));
      gap: 0 1rem;
      margin: 0;
    }
  </style>
</head>
<body>
  <main>
    <h1>Resumen</h1>
    <dl class="summary">
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
  </main>
</body>
</html>
```

J'ai mesuré cinq largeurs : 320, 375, 768, 1024 et 1440 px. Dans toutes, la largeur de la page est égale à celle de la fenêtre ; elle ne déborde pas. À 320 px les quatre chiffres forment une colonne, chacune de 288 px ; à 1024 et 1440 elles occupent une seule rangée, de quatre colonnes de 220 px. Personne n'a écrit « à telle largeur, une colonne » : le navigateur a fait le compte avec le plancher de 11 rem.

#### 5.1.3 L'autre piège de `1fr` : une grille qui gonfle

Il y a une variante du même piège qui te mordra quand tu utiliseras Grid pour le squelette de toute la page, et c'est pourquoi tu en fais une habitude dès aujourd'hui. Pense à une page avec une seule colonne : `display: grid` tout simple, ou avec `grid-template-columns: 1fr`. Si un enfant a un contenu large (un tableau, par exemple), la colonne gonfle jusqu'à l'accueillir, parce que son minimum `auto` est la largeur du contenu le plus étroit possible. Le résultat : le tableau ne défile pas dans sa boîte, mais **entraîne toute la page**.

Je l'ai mesuré dans le tableau de bord final, en changeant seulement `minmax(0, 1fr)` en `1fr` dans la grille de la page : à 320 px, la page redéborde, et elle mesure maintenant 439 px, bien que le tableau soit dans sa boîte avec `overflow-x: auto`. Avec `minmax(0, 1fr)` elle vaut 320. La solution, toujours, est d'écrire le minimum zéro exprès : `minmax(0, 1fr)` dit « cette colonne peut rétrécir jusqu'à rien s'il le faut ; ne la gonfle pas à cause du contenu ». **Quand une grille va contenir quelque chose de potentiellement large, la colonne s'écrit `minmax(0, 1fr)`, pas `1fr`.**

#### 5.1.4 Exemple résolu : le récapitulatif du tableau de bord

Dans le tableau de bord, le récapitulatif a déjà sa classe depuis la Leçon 4 (`<dl class="summary">`), et le HTML ne se touche pas. La seule chose qui change est une ligne de la règle `.summary` de la feuille : `repeat(4, 1fr)` devient la ligne des colonnes qui se comptent toutes seules.

```css
.summary {
  container-type: inline-size;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 11rem), 1fr));
  gap: 0 var(--space-3);
  margin: 0;
}
```

La première déclaration, `container-type: inline-size`, tu ne la connais pas encore : elle prépare le récapitulatif pour une requête de conteneur et s'explique en 5.2.4. Les trois autres sont celles de toujours. Avec ce changement, le second coupable du débordement disparaît : le récapitulatif mesure ce que sa section lui permet à n'importe quelle largeur, et sur un téléphone les chiffres se disposent l'un sous l'autre. Reste le premier, le tableau, qui a besoin d'un autre outil.

### 5.2 Adaptatif : que le contenu décide

#### 5.2.1 D'abord la fluidité, ensuite la requête

Ce que tu as fait jusqu'ici est déjà « adaptatif », bien que tu n'aies pas écrit une seule requête média. La barre de contrôles de la Leçon 4 passe à la ligne toute seule quand elle ne tient pas ; le récapitulatif compte seul ses colonnes. La technique s'appelle la **conception intrinsèque** : au lieu de dire « à telle largeur, fais telle chose », on donne au navigateur un plancher, un plafond et une préférence (`flex: 1 1 14rem`, `minmax(11rem, 1fr)`) et il décide avec la largeur qu'il a. Elle a un avantage qu'on n'apprécie qu'en comparant : **elle fonctionne avec des largeurs que personne n'avait prévues**. Une tablette à la verticale, une fenêtre à mi-taille, un téléphone pliable, un écran avec la police agrandie : aucun n'était dans ta liste d'« appareils », et tous se disposent pareil.


L'ordre des outils, de celui qui écrit le moins à celui qui écrit le plus, est :

1. **Flux normal.** Si le contenu tient dans une colonne, laisse-le dans une colonne.
2. **Flexbox avec `flex-wrap` et des bases raisonnables.** Pour des groupes de choses qui se répartissent une ligne.
3. **Grid avec `repeat(auto-fit, minmax(...))`.** Pour des cartes et des tableaux de bord.
4. **Requête média ou de conteneur.** Seulement quand c'est l'*organisation* de la page qui change et qu'il n'y a pas moyen de le demander avec les outils précédents.

#### 5.2.2 Le tableau : défiler dans sa boîte

Reste l'autre débordement, celui du tableau. Un tableau de données ne peut pas se « couper » sans détruire ce qu'il signifie : si tu transformais chaque ligne en carte, tu perdrais la comparaison des colonnes, qui est justement ce à quoi sert un tableau. C'est le cas que la norme de redistribution excepte : un tableau peut exiger deux dimensions. La solution est de **laisser le tableau garder sa largeur et sa boîte défiler** :

```html
<!-- fig05_04.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Tabla que se desplaza sola</title>
  <link rel="stylesheet" href="fig05_01/styles.css">
  <style>
    .table-scroll {
      overflow-x: auto;
    }
  </style>
</head>
<body>
  <main>
    <h1>Servicios</h1>
    <div class="table-scroll" role="region" aria-labelledby="table-caption" tabindex="0">
      <table>
        <caption id="table-caption">Estado de los servicios en la última revisión</caption>
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
    </div>
  </main>
</body>
</html>
```

Le nouvel élément est un `div` avec `overflow-x: auto`, qui dit : « si le contenu est plus large que moi, montre une barre de défilement horizontale *à l'intérieur de moi*, pas dans la page ». Avec cela, la page entière mesure 320 px (la largeur de la fenêtre) et seul le tableau glisse. J'ai mesuré cette page aux cinq largeurs et le débordement de la page est nul dans toutes.

Les trois attributs du `div` méritent une explication, car ils sont une exception délibérée à la règle de « ne mets pas d'attributs d'accessibilité qui ne sont pas nécessaires » :

- `tabindex="0"` fait que la boîte reçoit le focus avec la touche Tab. Sans lui, quelqu'un qui n'utilise que le clavier ne peut pas faire défiler le tableau : les flèches ne font défiler qu'une région qui a le focus. C'est ce qu'exige [le critère 2.1.1 (« Clavier »)](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html). [Chrome, depuis sa version 132](https://developer.chrome.com/blog/keyboard-focusable-scrollers), rend de lui-même focalisable un conteneur qui défile et qui n'a pas d'enfants focalisables, mais d'autres navigateurs ne le garantissent pas, donc on l'écrit à la main.
- `role="region"` et `aria-labelledby="table-caption"` lui donnent un nom —celui de la légende du tableau— pour qu'un lecteur d'écran dise « Estado de los servicios en la última revisión, région » en arrivant, au lieu d'un « groupe » muet. C'est la recette que publie Adrian Roselli, et une mise à jour de 2026 de sa part précise que le rôle peut être facultatif pour respecter la norme ; le nom aide quand même.

J'ai vérifié au clavier le tableau de bord final : avec Tab, le focus passe par le lien « Resumen », le lien « Servicios », le champ de recherche, le groupe de boutons radio (un seul arrêt, parce que les boutons radio d'un groupe comptent pour un), le bouton « Revisar ahora » et, enfin, la boîte du tableau, identifiée comme `region`. Avec le focus dans la boîte, les flèches gauche et droite font défiler le tableau. Et le contour de focus que la Leçon 3 a défini avec `:focus-visible` se voit autour de la boîte, de sorte que celui qui navigue au clavier sait où il est.

#### 5.2.3 Quand `@media` est nécessaire

Il y a encore un changement que ni Flexbox ni Grid ne demandent à eux seuls : sur un écran de 1440 px le récapitulatif et le tableau tiennent côte à côte, et sur un de 375 px non. Ce n'est pas décider combien de colonnes tiennent sur une ligne : c'est décider **comment s'organise la page entière**. Pour cela existent les **requêtes média** (`@media`) : [des règles qui ne s'appliquent que si la fenêtre remplit une condition](https://developer.mozilla.org/fr/docs/Web/CSS/Guides/Media_queries/Using).

[La syntaxe moderne utilise des comparaisons](https://www.w3.org/TR/mediaqueries-4/), comme en mathématiques :

```css
@media (width >= 64em) {
  .layout {
    grid-template-columns: 20rem minmax(0, 1fr);
  }
}
```

Elle dit : « quand la largeur de la fenêtre est de 64 em ou plus, la grille de la page a une colonne de 20 rem et une autre qui prend le reste ». La forme `(width >= 64em)` s'appelle **syntaxe d'intervalle** : les navigateurs la comprennent depuis 2022 et 2023 [(Chrome et Edge 104, Firefox 102, Safari 16.4) et la plateforme la considère de disponibilité générale depuis septembre 2025](https://web-platform-dx.github.io/web-features-explorer/features/media-query-range-syntax/). Avant, on écrivait `(min-width: 64em)`, qui signifie exactement la même chose ; tu la verras dans tout code antérieur.

Deux décisions de la règle méritent d'être expliquées :

**L'unité est `em`, pas `px`.** Le point de rupture se mesure en `em` (un `em` est la taille de police du navigateur, 16 px par défaut). Ainsi, si quelqu'un agrandit la taille de police de base du navigateur, le point de rupture se déplace avec elle : 64 em équivalent à 1,024 px seulement si le lecteur n'a pas touché à sa configuration ; s'il l'a laissée à 150 %, ils équivalent à 1,536 px, et la page change d'organisation au bon moment pour *cette* police. [MDN le recommande](https://developer.mozilla.org/fr/docs/Learn_web_development/Core/CSS_layout/Responsive_Design) : les points de rupture en unités relatives vieillissent mieux.

**On écrit d'abord ce qui concerne le téléphone.** La règle de base (sans `@media`) est celle de la largeur étroite : une colonne. Ce qui concerne la grande largeur s'*ajoute* dans la requête. Cela s'appelle **mobile first** et la raison est pratique : ce qui est le plus simple va en premier et c'est ce que reçoivent, sans surcharge, les appareils avec le moins de ressources ; ce qui est complexe s'ajoute seulement là où il y a de la place pour cela. L'ordre contraire (écrire d'abord ce qui concerne le bureau puis le défaire avec `max-width`) oblige à annuler des règles, et chaque annulation est un endroit où se tromper.

Et un avertissement qui fait contrepoids : **un point de rupture ne se choisit pas d'après un appareil, mais d'après le contenu**. La bonne question n'est pas « quelle largeur a un iPhone ? », mais « à partir de quelle largeur ce qu'il y a cesse-t-il de bien s'afficher ? ». Fais glisser le bord de la fenêtre jusqu'à ce que quelque chose se casse ou paraisse gaspillé ; c'est là que va le point de rupture. La liste des modèles de téléphone change chaque année ; le contenu, non.

#### 5.2.4 La boîte décide, pas la fenêtre : `@container`

Il y a un cas que `@media` ne résout pas bien. Regarde `fig05_05.html`. Dans une fenêtre large, la colonne du récapitulatif mesure 20 rem (320 px) ; dans une fenêtre de téléphone de 375 px, le récapitulatif occupe toute la largeur : 343 px. Ce sont deux situations avec à peu près la même largeur de récapitulatif et des largeurs de fenêtre de 1440 et 375. Une requête média (qui ne voit que la fenêtre) devrait deviner combien d'espace a le récapitulatif dans chaque cas. Ce qui compte vraiment, c'est **la largeur de la boîte où il se trouve**, pas celle de la fenêtre.


Pour cela existent les **requêtes de conteneur**. On déclare une boîte comme conteneur interrogeable, puis on interroge sa largeur :

```html
<!-- fig05_05.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Dos preguntas distintas: la ventana y la caja</title>
  <link rel="stylesheet" href="fig05_01/styles.css">
  <style>
    .layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 1.5rem;
      align-items: start;
    }

    /* La separación la pone el gap de la rejilla, no el margen de la Lección 3. */
    .layout section {
      margin-bottom: 0;
    }

    /* La ventana decide cómo se reparten las dos piezas de la página. */
    @media (width >= 64em) {
      .layout {
        grid-template-columns: 20rem minmax(0, 1fr);
      }
    }

    /* La caja decide cómo se acomoda lo que lleva dentro. */
    .summary {
      container-type: inline-size;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 11rem), 1fr));
      gap: 0 1rem;
      margin: 0;
    }

    @container (width < 24rem) {
      .summary div {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 1rem;
      }

      .summary dd {
        white-space: nowrap;
      }
    }
  </style>
</head>
<body>
  <h1>La página en dos piezas</h1>
  <main class="layout">
    <section id="summary">
      <h2>Resumen</h2>
      <dl class="summary">
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
      <p>Aquí va la tabla.</p>
    </section>
  </main>
</body>
</html>
```

Quatre pièces :

- [`container-type: inline-size` déclare](https://www.w3.org/TR/css-contain-3/) `.summary` comme conteneur interrogeable par sa largeur.
- `@container (width < 24rem)` applique les règles de l'intérieur seulement si **ce conteneur** mesure moins de 24 rem (384 px). La condition a la même syntaxe d'intervalle que `@media`.
- Dans la requête, les quatre boîtes du récapitulatif deviennent des lignes compactes (`display: flex`, avec le terme à gauche et la valeur à droite). C'est ce que tu vois dans la barre latérale et sur le téléphone : une ligne par chiffre, au lieu d'un carré haut.
- `white-space: nowrap` est une sécurité : il empêche que « 465 ms » se coupe en deux lignes si la ligne compacte se rétrécit encore. Avec la police de la feuille de la Leçon 3 il n'a pas eu besoin d'agir (je l'ai mesuré : le chiffre occupe une seule ligne de 32 px avec la règle et sans elle, dans la barre latérale et sur un téléphone de 375 px), mais il coûte une ligne et protège le jour où quelqu'un agrandit la police ou où le chiffre est plus long.

Deux restrictions qu'il vaut mieux apprendre une fois pour toutes. Première : **une requête de conteneur ne peut modifier que les descendants du conteneur, pas le conteneur lui-même.** C'est pourquoi les règles ciblent `.summary div` et non `.summary`. Seconde : `container-type: inline-size` signifie que la largeur du conteneur ne dépend plus de son contenu (c'est le parent qui la lui donne), et c'est pourquoi on le déclare sur une boîte dont la largeur vient de l'extérieur, comme une grille ou une colonne.

[Les requêtes de conteneur fonctionnent dans les trois moteurs principaux](https://developer.mozilla.org/fr/docs/Web/CSS/Guides/Containment/Container_queries) depuis février 2023 (Chrome et Edge 105, Safari 16, Firefox 110) et la plateforme les considère de disponibilité générale depuis [le 14 août 2025](https://web-platform-dx.github.io/web-features-explorer/features/container-queries/). Quand un composant va vivre dans des endroits de largeurs différentes —une barre latérale, une colonne principale, une fenêtre contextuelle—, c'est l'outil correct.

Un avis pour l'habitude de valider que tu as apprise dans la Leçon 3. Si tu fais passer cette feuille par [le validateur de CSS du W3C](https://jigsaw.w3.org/css-validator/), il ne répond plus « Congratulations! No Error Found » : je l'ai vérifié en lui envoyant `fig05_06/styles.css` et il a répondu avec deux erreurs, « La propriété “container-type” n'existe pas » et « la règle-at “@container” n'est pas implémentée ». Ce ne sont pas des erreurs de ta feuille, mais une limitation du validateur, qui ne connaît pas encore les requêtes de conteneur bien que les navigateurs les utilisent depuis 2023. Quand tu valideras, vérifie que les seules erreurs sont ces deux-là ; toute autre est bien de toi.

#### 5.2.5 Taille des cibles

Encore une chose, qui se remarque surtout sur un écran tactile, où le pouce est moins précis que le curseur, mais qui vaut pour n'importe quel pointeur : la souris, un stylet ou le doigt. [Le critère 2.5.8 de la norme (« Taille de la cible, minimum »)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) demande que les cibles qui s'activent avec un pointeur mesurent au moins **24 par 24 pixels CSS**, avec des exceptions (s'il y a assez d'espace autour, si la cible est à l'intérieur d'une phrase, si la taille est fixée par le navigateur). Ceux qui en ont le plus besoin sont les personnes qui ont un tremblement des mains ou peu de précision de mouvement, quel que soit l'appareil qu'elles utilisent. Dans le tableau de bord, les boutons et le champ de recherche portent `min-height: 2.5rem` (40 px) depuis la Leçon 3 : plus d'une fois et demie le minimum, parce que 24 px est un plancher, pas la mesure qu'un pouce atteint confortablement.

#### 5.2.6 Le tableau de bord terminé de la leçon

Avec tout ce qui précède, le tableau de bord complet de la leçon est `fig05_06.html`. Les changements de HTML par rapport au tableau de bord de la Leçon 4 sont trois, et aucun ne change ce que dit le HTML : la classe `layout` dans `<main>`, le `div.table-scroll` avec son tableau dedans, et l'`id="table-caption"` dans la légende du tableau, vers laquelle pointe l'`aria-labelledby` de l'enveloppe.

```html
<!-- fig05_06.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Revisor de servicios</title>
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="fig05_06/styles.css">
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
      </div>

      <div class="table-scroll" role="region" aria-labelledby="table-caption" tabindex="0">
        <table>
          <caption id="table-caption">Estado de los servicios en la última revisión</caption>
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
      </div>
    </section>
  </main>

  <footer>
    <p>Datos de ejemplo escritos a mano.</p>
  </footer>
</body>
</html>
```

Et voici la feuille de style complète, qui est celle de la Leçon 4 avec la disposition adaptable ajoutée (les commentaires indiquent de quelle leçon vient chaque partie) :

```css
/* fig05_06/styles.css */
/* La hoja del panel al terminar la Lección 5: la de la Lección 3, con sus mismas
   capas y variables, más el acomodo de la Lección 4 (Flexbox y Grid) y el de la
   Lección 5 (cualquier pantalla). Cada cambio lleva un comentario con su lección. */

/* El orden de las capas se declara una sola vez, arriba. La última gana. */
@layer reset, base, components;

@layer reset {
  /* La caja: el ancho que escribes es el ancho que se ve. */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  /* El navegador no hace que los campos hereden la letra del texto. */
  input,
  button {
    font: inherit;
  }
}

@layer base {
  /* Las decisiones del panel viven aquí, con nombres que dicen para qué sirven. */
  :root {
    --color-text: #1b1f24;
    --color-muted: #57606a;
    --color-page: #f6f8fa;
    --color-surface: #ffffff;
    --color-border: #d0d7de;
    --color-control: #6e7781;
    --color-accent: #0b5cad;

    --color-available-text: #0f5132;
    --color-available-bg: #d1e7dd;
    --color-down-text: #842029;
    --color-down-bg: #f8d7da;

    --space-1: 0.25rem;
    --space-2: 0.5rem;
    --space-3: 1rem;
    --space-4: 1.5rem;
    --space-5: 2.5rem;

    --font-body: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    --line-height: 1.6;
    --radius: 0.375rem;
  }

  body {
    margin: 0;
    background: var(--color-page);
    color: var(--color-text);
    font-family: var(--font-body);
    line-height: var(--line-height);
  }

  /* Un ancho cómodo para leer, centrado: auto reparte el espacio sobrante.
     Lección 5: de 60 a 80 rem, porque en una pantalla ancha ahora caben dos columnas. */
  header,
  main,
  footer {
    max-width: 80rem;
    margin: 0 auto;
    padding: var(--space-3);
  }

  h1 {
    margin: 0 0 var(--space-2);
    font-size: 2rem;
    line-height: 1.2;
  }

  h2 {
    margin: 0 0 var(--space-3);
    font-size: 1.375rem;
    line-height: 1.3;
  }

  a {
    color: var(--color-accent);
  }

  /* Que el foco del teclado se vea siempre: nunca outline: none sin reemplazo. */
  :focus-visible {
    outline: 3px solid var(--color-accent);
    outline-offset: 2px;
  }

  footer {
    color: var(--color-muted);
  }
}

@layer components {
  /* Cada sección es una hoja blanca sobre el fondo de la página.
     Lección 5: sin margen inferior; la separación la pone el gap de .layout. */
  section {
    padding: var(--space-3) var(--space-4);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
  }

  /* El resumen: cada par nombre-valor en su renglón. */
  dl div {
    padding: var(--space-2) 0;
    border-bottom: 1px solid var(--color-border);
  }

  dl div:last-child {
    border-bottom: 0;
  }

  dt {
    color: var(--color-muted);
  }

  dd {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }

  /* Los controles. */
  label {
    margin-right: var(--space-3);
  }

  input[type="search"] {
    min-height: 2.5rem;
    padding: var(--space-1) var(--space-2);
    border: 1px solid var(--color-control);
    border-radius: var(--radius);
  }

  fieldset {
    margin: var(--space-3) 0;
    padding: var(--space-2) var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
  }

  button {
    min-height: 2.5rem;
    padding: var(--space-1) var(--space-3);
    border: 0;
    border-radius: var(--radius);
    background: var(--color-accent);
    color: var(--color-surface);
    font-weight: 600;
    cursor: pointer;
  }

  button:hover {
    background: var(--color-text);
  }

  /* La tabla. */
  table {
    width: 100%;
    margin-top: var(--space-3);
    border-collapse: collapse;
  }

  caption {
    padding-bottom: var(--space-2);
    color: var(--color-muted);
    text-align: left;
  }

  th,
  td {
    padding: var(--space-2) var(--space-3);
    border-bottom: 1px solid var(--color-border);
    text-align: left;
  }

  /* Los números a la derecha y con cifras del mismo ancho para que alineen. */
  th:last-child,
  td:last-child {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }

  /* La insignia de estado: una sola regla, y las variantes solo cambian variables. */
  .status {
    display: inline-block;
    padding: 0 var(--space-2);
    border-radius: 999px;
    background: var(--badge-bg);
    color: var(--badge-text);
    font-size: 0.875rem;
    font-weight: 600;
  }

  .status-available {
    --badge-bg: var(--color-available-bg);
    --badge-text: var(--color-available-text);
  }

  .status-down {
    --badge-bg: var(--color-down-bg);
    --badge-text: var(--color-down-text);
  }

  /* ---- Lecciones 4 y 5: el acomodo ---- */

  /* Lección 5. Las dos piezas de la página: la ventana decide si van una sobre otra
     o lado a lado. minmax(0, 1fr) y no 1fr: la columna no se infla con la tabla. */
  .layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--space-4);
    align-items: start;
  }

  @media (width >= 64em) {
    .layout {
      grid-template-columns: 20rem minmax(0, 1fr);
    }
  }

  /* Grid, dos dimensiones (Lección 4); las columnas se cuentan solas (Lección 5). */
  .summary {
    container-type: inline-size;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 11rem), 1fr));
    gap: 0 var(--space-3);
    margin: 0;
  }

  /* Lección 5. La caja, no la ventana, decide si cada cifra va en una fila compacta. */
  @container (width < 24rem) {
    .summary div {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: var(--space-3);
    }

    .summary dd {
      white-space: nowrap;
    }
  }

  /* Lección 4. Flexbox, una dimensión: el encabezado y la barra de controles
     se parten en renglones cuando no caben. */
  .page-header {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--space-1) var(--space-3);
  }

  .page-header p {
    margin: 0;
  }

  .controls {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: var(--space-3);
  }

  .controls p,
  .controls fieldset {
    margin: 0;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    flex: 1 1 14rem;
  }

  .field input {
    width: 100%;
  }

  /* Lección 5. La tabla conserva su semántica: lo que se desplaza es su envoltorio. */
  .table-scroll {
    overflow-x: auto;
  }
}
```

Par rapport à la feuille de la Leçon 4 il y a deux ajustements, un changement et trois règles nouvelles, et rien d'autre. Les ajustements : la largeur maximale de `header`, `main` et `footer` passe de 60 à 80 rem, pour que sur un écran large les deux colonnes ne se serrent pas ; et les sections perdent leur `margin-bottom`, parce que dans la grille la séparation est mise par le `gap` de `.layout`, ce qui est la règle de la Leçon 4 (4.1.2) : la séparation entre frères, c'est le parent qui la met. Le changement : la règle `.summary` abandonne `repeat(4, 1fr)` pour les colonnes qui se comptent toutes seules et ajoute `container-type`, comme en 5.1.4. Les règles nouvelles vont dans le bloc de la disposition, qui rassemble maintenant ce qui vient des deux leçons : `.layout` avec `minmax(0, 1fr)` et, à partir de 64 em, deux colonnes ; la requête de conteneur du récapitulatif ; et le `.table-scroll`. L'en-tête, la barre de contrôles, les couches, les variables, le focus et les badges restent comme ils étaient : l'adaptatif s'ajoute à ce qui existait, il ne le réécrit pas. (L'ordre des règles dans le bloc a changé par rapport à la Leçon 4 : d'abord la page, ensuite le récapitulatif, ensuite les contrôles. C'est l'ordre dans lequel les lit celui qui ouvre le fichier de haut en bas, et il ne modifie pas le résultat, car aucune de ces règles ne rivalise avec une autre pour la même propriété.)

Le point de départ de cette leçon, `fig05_01.html`, est le tableau de bord de la Leçon 4 avec son `<link>` pointant vers la copie de la feuille qui vit dans ce dossier ; tu l'as en entier ci-dessous, au cas où tu voudrais comparer ou n'aurais pas celui de la leçon précédente :

```html
<!-- fig05_01.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Revisor de servicios</title>
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="fig05_01/styles.css">
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

  <main>
    <section id="summary">
      <h2>Resumen</h2>
      <dl class="summary">
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
      </div>

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

et sa feuille, `fig05_01/styles.css`, est `fig04_06/styles.css` sans un seul changement, sauf les commentaires du haut :

```css
/* fig05_01/styles.css */
/* La hoja del panel tal como la deja la Lección 4 (es fig04_06/styles.css, copiada
   aquí para que esta carpeta funcione sola): la de la Lección 3 más Flexbox y Grid.
   Todavía no se adapta a una pantalla angosta. */

/* El orden de las capas se declara una sola vez, arriba. La última gana. */
@layer reset, base, components;

@layer reset {
  /* La caja: el ancho que escribes es el ancho que se ve. */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  /* El navegador no hace que los campos hereden la letra del texto. */
  input,
  button {
    font: inherit;
  }
}

@layer base {
  /* Las decisiones del panel viven aquí, con nombres que dicen para qué sirven. */
  :root {
    --color-text: #1b1f24;
    --color-muted: #57606a;
    --color-page: #f6f8fa;
    --color-surface: #ffffff;
    --color-border: #d0d7de;
    --color-control: #6e7781;
    --color-accent: #0b5cad;

    --color-available-text: #0f5132;
    --color-available-bg: #d1e7dd;
    --color-down-text: #842029;
    --color-down-bg: #f8d7da;

    --space-1: 0.25rem;
    --space-2: 0.5rem;
    --space-3: 1rem;
    --space-4: 1.5rem;
    --space-5: 2.5rem;

    --font-body: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    --line-height: 1.6;
    --radius: 0.375rem;
  }

  body {
    margin: 0;
    background: var(--color-page);
    color: var(--color-text);
    font-family: var(--font-body);
    line-height: var(--line-height);
  }

  /* Un ancho cómodo para leer, centrado: auto reparte el espacio sobrante. */
  header,
  main,
  footer {
    max-width: 60rem;
    margin: 0 auto;
    padding: var(--space-3);
  }

  h1 {
    margin: 0 0 var(--space-2);
    font-size: 2rem;
    line-height: 1.2;
  }

  h2 {
    margin: 0 0 var(--space-3);
    font-size: 1.375rem;
    line-height: 1.3;
  }

  a {
    color: var(--color-accent);
  }

  /* Que el foco del teclado se vea siempre: nunca outline: none sin reemplazo. */
  :focus-visible {
    outline: 3px solid var(--color-accent);
    outline-offset: 2px;
  }

  footer {
    color: var(--color-muted);
  }
}

@layer components {
  /* Cada sección es una hoja blanca sobre el fondo de la página. */
  section {
    margin-bottom: var(--space-4);
    padding: var(--space-3) var(--space-4);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
  }

  /* El resumen: cada par nombre-valor en su renglón. */
  dl div {
    padding: var(--space-2) 0;
    border-bottom: 1px solid var(--color-border);
  }

  dl div:last-child {
    border-bottom: 0;
  }

  dt {
    color: var(--color-muted);
  }

  dd {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }

  /* Los controles. */
  label {
    margin-right: var(--space-3);
  }

  input[type="search"] {
    min-height: 2.5rem;
    padding: var(--space-1) var(--space-2);
    border: 1px solid var(--color-control);
    border-radius: var(--radius);
  }

  fieldset {
    margin: var(--space-3) 0;
    padding: var(--space-2) var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
  }

  button {
    min-height: 2.5rem;
    padding: var(--space-1) var(--space-3);
    border: 0;
    border-radius: var(--radius);
    background: var(--color-accent);
    color: var(--color-surface);
    font-weight: 600;
    cursor: pointer;
  }

  button:hover {
    background: var(--color-text);
  }

  /* La tabla. */
  table {
    width: 100%;
    margin-top: var(--space-3);
    border-collapse: collapse;
  }

  caption {
    padding-bottom: var(--space-2);
    color: var(--color-muted);
    text-align: left;
  }

  th,
  td {
    padding: var(--space-2) var(--space-3);
    border-bottom: 1px solid var(--color-border);
    text-align: left;
  }

  /* Los números a la derecha y con cifras del mismo ancho para que alineen. */
  th:last-child,
  td:last-child {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }

  /* La insignia de estado: una sola regla, y las variantes solo cambian variables. */
  .status {
    display: inline-block;
    padding: 0 var(--space-2);
    border-radius: 999px;
    background: var(--badge-bg);
    color: var(--badge-text);
    font-size: 0.875rem;
    font-weight: 600;
  }

  .status-available {
    --badge-bg: var(--color-available-bg);
    --badge-text: var(--color-available-text);
  }

  .status-down {
    --badge-bg: var(--color-down-bg);
    --badge-text: var(--color-down-text);
  }

  /* ---- Lección 4: Flexbox y Grid ---- */

  /* Flexbox, una dimensión: el encabezado se reparte en una fila y baja
     de renglón cuando no cabe. */
  .page-header {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--space-1) var(--space-3);
  }

  .page-header p {
    margin: 0;
  }

  /* La barra de controles: tres hermanos en una línea; solo el campo crece. */
  .controls {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: var(--space-3);
  }

  .controls p,
  .controls fieldset {
    margin: 0;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    flex: 1 1 14rem;
  }

  .field input {
    width: 100%;
  }

  /* Grid, dos dimensiones: las cuatro cifras del resumen en cuatro columnas
     iguales. En un teléfono no caben; la Lección 5 lo resuelve. */
  .summary {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0 var(--space-3);
    margin: 0;
  }
}
```

Mesure le tableau de bord terminé comme tu as mesuré l'initial. J'ai mesuré `fig05_06.html` à 320, 375, 768, 1024 et 1440 px : la largeur de la page est égale à celle de la fenêtre dans les cinq, et la comparaison de la console renvoie `false`. À 1440 px le récapitulatif se retrouve dans une colonne de 20 rem à gauche et le tableau à droite, avec la barre de contrôles au-dessus du tableau sur une seule rangée ; à 320 px, tout dans une colonne, avec le tableau qui défile dans sa boîte. La largeur **du téléphone**, qui était le problème qui a ouvert la leçon, n'en est plus un.

#### 5.2.7 Intègre-le à ton `revisor`

Jusqu'ici tu as travaillé avec les pages du dépôt. Il manque l'étape qui transforme ce que tu as appris en ton projet : que **ton** `revisor` devienne identique à `fig05_06.html`, mesuré et enregistré dans Git. Il y a quatre étapes, et aucune ne demande d'écrire quoi que ce soit de nouveau.

**1. La feuille.** Ouvre `fig05_06/styles.css` (dans le dépôt, ou copie-la depuis le bloc complet ci-dessus) et colle son contenu dans ton `~/revisor/css/styles.css`, à la place de ce qu'il y avait. Tu peux la remplacer entière parce que c'est la feuille de la Leçon 4 avec les ajustements et les règles que tu viens de lire : rien ne se perd. Si dans les leçons précédentes tu as fait des changements à toi dans ta feuille (une autre couleur, une autre taille), alors ne la remplace pas : fais à la main les deux ajustements (la largeur maximale de `header`, `main` et `footer` passe à `80rem` ; `section` perd son `margin-bottom`), remplace la règle `.summary` par celle de 5.1.4, et ajoute au bloc de la Leçon 4 la règle `.layout` avec son `@media`, le `@container` du récapitulatif et le `.table-scroll`.

**2. La page.** Dans ton `~/revisor/index.html`, fais les changements du HTML, qui sont ceux de la liste de 5.2.6 :

- `<main>` devient `<main class="layout">`.
- Le tableau se retrouve dans `<div class="table-scroll" role="region" aria-labelledby="table-caption" tabindex="0">`, comme en 5.2.2.
- Celui qu'on oublie : le `<caption>` porte `id="table-caption"`. Sans cet `id`, l'`aria-labelledby` de l'enveloppe ne pointe vers rien et la région reste sans nom.

Tu peux aussi copier `fig05_06.html` en entier sur ton `index.html`, avec une précaution : dans le dépôt, son `<link>` pointe vers `fig05_06/styles.css` ; dans ton projet il doit dire `href="css/styles.css"`, comme depuis la Leçon 3. Si tu ne le changes pas, la page s'affichera sans styles.

**3. Mesure.** Depuis le dossier du projet, allume le serveur :

```bash
$ cd ~/revisor
$ python3 -m http.server 8000 --bind 127.0.0.1
```

Ouvre `http://127.0.0.1:8000/`, active le mode adaptatif et répète la mesure de la leçon : la ligne de la console doit renvoyer `false` à 320, 375, 768, 1024 et 1440 px, et la page doit s'afficher comme `fig05_06.html` aux mêmes largeurs. Je l'ai fait avec un dossier `revisor` monté ainsi : à 320 px la page mesure 320 et la boîte du tableau 238 px, avec le tableau qui défile dedans ; à 1440 px, les deux colonnes. Si quelque chose ne coïncide pas, compare ton fichier avec celui du dépôt : c'est presque toujours une classe qui n'a pas été écrite ou un `div` qui a été fermé ailleurs.

**4. Enregistre-le dans Git.** Arrête le serveur avec `Ctrl`+`C` (ou ouvre un autre terminal) et demande à Git ce qui a changé, comme dans la Leçon 1 :

```bash
$ git status
En la rama main
Cambios no rastreados para el commit:
  (usa "git add <archivo>..." para actualizar lo que será confirmado)
  (usa "git restore <archivo>..." para descartar los cambios en el directorio de trabajo)
	modificados:     css/styles.css
	modificados:     index.html

sin cambios agregados al commit (usa "git add" y/o "git commit -a")
```

Ce sont justement les deux fichiers que tu as touchés. (S'il en apparaît un autre, c'est un changement à toi, antérieur, que tu n'as pas enregistré : examine-le avec `git diff` avant de décider s'il va dans ce commit.) Vérifie avec `git diff` que les changements sont ceux que tu voulais, et enregistre-les :

```bash
$ git add index.html css/styles.css
$ git commit -m "Adapta el panel a cualquier ancho de pantalla"
$ git status
En la rama main
nada para hacer commit, el árbol de trabajo está limpio
```

Le `git commit` imprime une ligne avec le code du commit et le nombre de lignes qui ont changé ; les nombres dépendent de tes fichiers. Avec cela, ton `revisor` est prêt pour la Leçon 6, qui part exactement d'ici.

## L'erreur que tu vas voir

Les erreurs de disposition ne sont presque jamais des messages : c'est une page qui s'affiche « mal » sans dire pourquoi. Dans cette leçon il y en a deux, et les deux se mesurent. Le premier, tu viens de le voir dans la balise `viewport` : sans elle, la page ne déborde pas, mais tout paraît minuscule, et le seul indice est le nombre de `window.innerWidth`. Le second est celui qui a ouvert la leçon.

**La page plus large que la fenêtre.** Ouvre `fig05_01.html` à 320 px. Le signal est la barre de défilement horizontale, ou la console :

```js
document.documentElement.scrollWidth > document.documentElement.clientWidth
```

qui répond `true`. Pour trouver *qui* dépasse, dans les outils passe le curseur sur les éléments du volet des éléments : le navigateur grise la zone de chacun, et celui qui sort du bord droit de la fenêtre est le coupable. Dans `fig05_01.html` ils sont deux : le tableau, qui arrive à 414 px, et le récapitulatif, qui arrive à 369. Les deux solutions, tu les as déjà : l'enveloppe avec `overflow-x: auto` pour le tableau, et les colonnes qui se comptent toutes seules pour le récapitulatif. Un conseil pour quand il y a plusieurs coupables : corrige-en un, mesure de nouveau et cherche le suivant. La page mesure ce que mesure le **plus** large, donc tant qu'il en reste un, la mesure continue de donner `true` même si tu as corrigé l'autre, et il est facile de croire que la correction n'a pas marché.

**Et une variante qui déroute :** le tableau est déjà dans sa boîte avec `overflow-x: auto`, et pourtant la page reste plus large que la fenêtre. C'est la grille gonflée de la sous-section 5.1.3 : la colonne de la page est déclarée comme `1fr` et se dilate de la largeur du tableau. On la corrige avec `minmax(0, 1fr)`. Si tu tombes là-dessus dans un autre projet, tu sais où regarder : pas dans le tableau, mais dans la colonne qui le contient.

## Ce qui se fait de travers

**Une requête média par appareil.** `@media (width: 390px) { ... }` « pour l'iPhone ». Elle couvre une seule largeur, d'un seul modèle, d'une seule année. Un téléphone pliable, une fenêtre à mi-taille ou un écran avec la police agrandie tombent entre ces points, et là la page n'est pas pensée. Coût : une liste d'appareils qui s'allonge chaque année et n'est jamais à jour.

**Cacher le débordement au lieu de le corriger.** `body { overflow-x: hidden }` fait disparaître la barre de défilement et laisse le contenu coupé : ce qui est au-delà du bord ne peut plus être vu ni atteint. C'est pire que le défaut, parce que cela *semble* corrigé. Le critère 1.4.10 demande qu'on ne perde pas d'information à l'agrandissement ; couper la page, c'est en perdre.

**Transformer le tableau en autre chose pour qu'il « tienne ».** Changer le `display` de `table`, `tr` et `td` en `block` ou `grid`, ou refaire le tableau avec des `div`. Cela peut lui retirer le rôle de tableau et la navigation par cellules pour celui qui utilise un lecteur d'écran. Dans Chrome 154 le tableau avec `display: grid` a conservé son rôle, mais la règle du cours ne dépend pas de ce que la même chose arrive dans chaque navigateur et lecteur : on laisse le tableau comme tableau et on l'enveloppe.

**Retirer le zoom « pour que ça ne bouge pas ».** `user-scalable=no` ou `maximum-scale=1` dans la balise `viewport`. Cela empêche de zoomer sur la page, ce que celui qui est malvoyant utilise pour la lire.

**Donner à un conteneur de largeur incertaine une colonne `1fr`.** C'est la grille gonflée de 5.1.3 : elle passe inaperçue tant que le contenu est court et explose le jour où arrive un tableau large, un identifiant long ou une URL sans espaces. Elle coûte un après-midi, parce que le coupable semble être le contenu et que c'est la colonne.

## Exercices

### Exercice 1 — Moins de chiffres, mêmes colonnes

Copie `fig05_03.html` et ne laisse dans le récapitulatif que trois chiffres : retire « Respuesta promedio » (« Réponse moyenne »). Sans toucher au CSS, mesure la largeur de chaque carte à 768, 1024 et 1440 px (les outils du navigateur te donnent la largeur de chaque élément quand tu le sélectionnes). Ensuite remplace `auto-fit` par `auto-fill`, mesure de nouveau à ces trois largeurs et explique dans lesquelles il y a eu une différence et pourquoi (utilise ce que tu as vu avec deux cartes en 5.1.2).

### Exercice 2 — Casse exprès la grille de la page

Dans une copie de `fig05_06.html`, remplace `minmax(0, 1fr)` par `1fr` dans la règle de `.layout`. Mesure la largeur de la page à 320 px avec la ligne de la console. Combien cela donne-t-il ? Ensuite cherche avec les outils du navigateur quel élément fait croître la grille et explique pourquoi, si le tableau était déjà dans sa boîte avec `overflow-x: auto`, la page déborde quand même.

### Exercice 3 — Un point de rupture que le contenu décide

Dans `fig05_06.html`, la barre de contrôles passe de trois lignes (à 320 px) à deux puis à une quand on élargit la fenêtre. Sans regarder un seul modèle de téléphone, trouve avec le mode adaptatif la largeur de fenêtre à laquelle elle passe de deux lignes à une, et note-la. Ensuite continue d'élargir : à partir de 1024 px, et jusqu'à un peu plus de 1160, la barre occupe de nouveau deux lignes. Explique les deux constats avec la somme de ce que mesure chaque pièce.

## Solutions

### Solution 1

Je l'ai mesuré avec trois cartes de plancher de 11 rem. Avec `auto-fit` : à 768 px, trois colonnes de 235 px ; à 1024 et à 1440 px, trois colonnes de 299 px. Les deux dernières mesures sont identiques parce que la feuille limite le contenu à 60 rem depuis la Leçon 3 : à partir de 960 px de fenêtre, le conteneur ne croît plus et mesure 928 px. Avec `auto-fill` le résultat est identique à 768, et différent à 1024 et à 1440 : là, quatre colonnes de 220 px tiennent, les trois cartes occupent les trois premières et il reste une colonne vide à droite.

La différence n'apparaît que lorsqu'il y a **moins de cartes que de colonnes possibles**, et cela arrive à 1024 et à 1440 px. À 768 px trois colonnes tiennent juste pour trois cartes et il n'en reste aucune. `auto-fit` réduit les colonnes sans contenu et laisse celles qui en ont s'étirer ; `auto-fill` les conserve, même vides.

### Solution 2

Avec `1fr` dans la grille de la page, la mesure donne **439** à 320 px (la comparaison renvoie `true`) : c'est ce que mesure le tableau, plus la marge intérieure de sa section et celle de la page. L'élément qui élargit tout est la colonne de la grille, et la section qui la contient. Le tableau est bien dans sa boîte, avec `overflow-x: auto`, mais la boîte ne peut pas être plus étroite que sa colonne, et la colonne `1fr` a un minimum de `auto`, qui est la largeur minimale du contenu, tableau compris. Alors la colonne gonfle, la boîte gonfle avec elle, et la boîte n'a plus rien à faire défiler : maintenant tout tient dans une boîte large, qui à son tour déborde la page. Avec `minmax(0, 1fr)` le minimum est zéro, la colonne mesure ce que la fenêtre permet et le tableau, qui reste large, défile dans une boîte de 238 px.

### Solution 3

La barre tient sur une ligne quand sa boîte mesure au moins la somme de ses trois pièces plus les deux espaces entre elles. Je l'ai mesuré dans `fig05_06.html` : le champ a une base de `14rem` (224 px), le groupe de boutons radio mesure 345 px (chaque libellé porte la marge droite de 1 rem que lui a donnée la Leçon 3), le bouton 135 px, et le `gap` met 16 px deux fois. La somme est 224 + 345 + 135 + 32 = **736 px**. Dans cette zone du tableau de bord la page est une seule colonne, et la boîte des contrôles mesure la largeur de la fenêtre moins 82 px : 32 de marge intérieure de `main`, 48 de marge intérieure de la section et 2 de sa bordure. Donc la barre passe à une ligne avec une fenêtre de **818 px**, ce qui a été justement la première largeur qui a donné une seule rangée en mesurant pixel par pixel.

Le second constat est celui qui enseigne le plus : à 1024 px la page passe à deux colonnes (`@media (width >= 64em)`), et la boîte des contrôles tombe à 598 px, ce qui est moins que 736 : la barre se coupe de nouveau en deux lignes. Ce n'est qu'à partir de 1162 px que la boîte retrouve 736 px et tient de nouveau sur une seule. **La largeur qui importe à la barre n'est pas celle de la fenêtre, mais celle de sa boîte**, et la largeur de sa boîte ne croît pas de façon régulière avec celle de la fenêtre, parce qu'entre les deux la page a changé d'organisation. C'est pourquoi `flex-wrap` résout cela sans aucun nombre écrit : la barre passe à la ligne quand sa boîte est étroite, que ce soit à cause de la fenêtre ou d'une colonne latérale. Si tu avais écrit une requête média avec « 818 px », elle aurait eu raison à 820 et tort à 1024.

## Comment savoir que j'ai réussi

- [ ] `fig05_01.html` à 320 px renvoie `true` avec la ligne de la console (la largeur de la page est de 414 px), et `fig05_06.html` renvoie `false` à 320, 375, 768, 1024 et 1440 px.
- [ ] `fig05_02.html` dans un téléphone émulé de 390 px montre `window.innerWidth` de 980 ; `fig05_03.html` dans le même téléphone montre 390.
- [ ] Dans `fig05_06.html` à 1440 px le récapitulatif est à gauche dans une colonne et le tableau à droite ; à 320 px tout va dans une seule colonne, et seul le tableau défile sur les côtés, dans sa boîte.
- [ ] Avec Tab, le focus passe dans cet ordre : lien « Resumen », lien « Servicios », champ de recherche, groupe de boutons radio, bouton « Revisar ahora » et la boîte du tableau (annoncée comme région). Avec le focus dans la boîte, les flèches font défiler le tableau.
- [ ] Les boutons et le champ de recherche mesurent au moins 40 px de haut (`min-height: 2.5rem`, depuis la Leçon 3), et l'outil d'inspection du navigateur le confirme.
- [ ] Tu peux expliquer avec tes mots ce que fait chaque pièce de `repeat(auto-fit, minmax(min(100%, 11rem), 1fr))`, pourquoi `1fr` en soi ne suffit pas dans une colonne qui contiendra quelque chose de large, et quelle différence il y a entre une requête média et une requête de conteneur, avec un exemple du tableau de bord pour chacune.
- [ ] Ton `~/revisor` (servi depuis son dossier sur `http://127.0.0.1:8000/`) s'affiche comme `fig05_06.html`, renvoie `false` aux cinq largeurs, et `git log --oneline` montre le commit avec le tableau de bord adaptable.

## Résumé

Pour fixer ce que tu viens de voir, réponds sans regarder la leçon :

1. Que fait le navigateur d'un téléphone avec une page qui ne porte pas la balise `viewport`, et quel chiffre avons-nous mesuré ?
2. D'où vient le 320 et qui protège-t-il, en plus de celui qui utilise un téléphone ?
3. Pourquoi `repeat(4, 1fr)` déborde-t-il à 320 px, si `1fr` est « une fraction de l'espace » ?
4. En quoi `auto-fill` et `auto-fit` diffèrent-ils, et lequel as-tu utilisé pour le récapitulatif ?
5. Pourquoi un tableau large s'enveloppe-t-il et ne se refait-il pas avec un autre `display` ? Quels trois attributs porte son enveloppe et à quoi sert chacun ?
6. Pourquoi le point de rupture s'écrit-il en `em` et se choisit-il en regardant le contenu, pas un modèle de téléphone ?
7. Pourquoi `@container` ne peut-il pas modifier le conteneur lui-même ?

Si une réponse t'accroche, retourne à la sous-section correspondante : c'est le signe qu'une pièce est restée lâche à cet endroit, pas que tu n'es pas fait pour cela.

## Pour aller plus loin

- [MDN, « Conception web adaptative »](https://developer.mozilla.org/fr/docs/Learn_web_development/Core/CSS_layout/Responsive_Design) — le module d'apprentissage de Mozilla sur `viewport`, mobile first et les points de rupture. Consulté le 7 octobre 2026.
- [W3C, « Comprendre le critère 1.4.10 : Redistribution du contenu »](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) — d'où vient le 320 et quelle partie du contenu peut défiler. Consulté le 7 octobre 2026.
- [MDN, « Requêtes de conteneur »](https://developer.mozilla.org/fr/docs/Web/CSS/Guides/Containment/Container_queries) — comment on déclare un conteneur interrogeable, la syntaxe de `@container` et pourquoi une requête ne peut pas modifier son propre conteneur. Consulté le 7 octobre 2026.
