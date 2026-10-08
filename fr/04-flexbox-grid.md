# Leçon 4 — Disposer avec Flexbox et Grid

**Durée :** deux sessions d'environ 90 min. Une répartition qui marche : la première, « Le pourquoi avant le comment » et Flexbox (4.1), avec la barre de contrôles ; la seconde, Grid (4.2), le tableau de bord disposé, l'intégrer à ton `revisor` (4.2.5) et les exercices. Chaque session se termine par une page que tu peux ouvrir et mesurer.

**Ce que tu construis :** le tableau de bord disposé sur un écran large

**Ce que tu apprends :** une dimension avec Flexbox et deux avec Grid ; les deux axes, `gap`, `flex` et `flex-wrap` ; des colonnes avec `fr` et `repeat()` ; mesurer avec les outils du navigateur au lieu de juger à l'œil

**D'où tu viens.** Tu arrives avec le tableau de bord de la [Leçon 2](02-html-con-significado.md), écrit à la main avec du HTML qui dit ce qu'est chaque chose, et la feuille de style de la [Leçon 3](03-css-cascada-caja.md), avec ses variables de couleur, sa boîte prévisible et ses badges d'état. Cette feuille **ne dispose encore rien** : chaque élément va sous le précédent, ce que fait le navigateur quand personne ne lui demande autre chose. Si pour une raison quelconque ta copie ne coïncide pas avec celle de ces leçons, peu importe : la page `fig04_01.html` et sa feuille `fig04_01/styles.css` sont exactement ce point de départ, et tu l'as en entier plus bas. Toutes les pages de cette leçon se trouvent dans [`programas/04-flexbox-grid/`](https://github.com/HabilMX/curso-web/tree/main/programas/04-flexbox-grid) du [dépôt du cours](https://github.com/HabilMX/curso-web). Remarque un détail avant de les ouvrir : toutes sauf le tableau de bord disposé chargent la feuille de départ avec `<link rel="stylesheet" href="fig04_01/styles.css">`, un chemin *relatif* que le navigateur cherche dans le dossier `fig04_01` à côté de la page. C'est pourquoi elles fonctionnent si tu télécharges (ou clones avec Git) le dépôt complet et que tu allumes le serveur depuis son dossier `programas/`, ou si tu copies chaque page **avec** le dossier `fig04_01`. Si tu ne copies que le `.html`, la page s'affichera sans styles : le navigateur a demandé `fig04_01/styles.css`, le serveur a répondu `404` et l'onglet Réseau des outils te le montre en rouge. La `fig04_06.html`, le tableau de bord disposé par lequel la leçon se termine, utilise de la même façon sa propre feuille, `fig04_06/styles.css`. Pour cette leçon tu travailles avec deux fichiers de ton dossier `revisor`, `index.html` et `css/styles.css`, et, pour les expériences isolées, avec des pages d'essai à côté. Depuis le dossier du projet, le serveur local reste `python3 -m http.server 8000 --bind 127.0.0.1`.

**Ce que cette leçon ne fait pas.** Elle ne résout pas encore le téléphone : que la page serve à 320 pixels de large est le sujet complet de la [Leçon 5](05-pagina-adaptable.md), qui part justement d'où celle-ci s'arrête. Elle ne touche pas non plus au JavaScript. Les chiffres du récapitulatif restent écrits à la main ; un programme les comptera dans la Leçon 6 et la Leçon 7 les dessinera dans le tableau. Aujourd'hui seul change *où* va chaque chose et *combien* elle mesure, pas *ce qu'*elle dit.

## À la fin, tu seras capable de

- Expliquer ce que sont un conteneur flex, ses éléments et ses deux axes, et prédire ce que font `justify-content` et `align-items` avant de recharger.
- Écrire une barre de contrôles avec `display: flex`, `flex-wrap`, `gap`, `align-items` et `flex`, et dire qui garde l'espace qui reste.
- Lire la propriété `flex` comme base, croissance et rétrécissement, et reconnaître quand un élément refuse de rétrécir et comment on le lui permet.
- Choisir Flexbox quand la répartition se fait en une seule dimension et Grid quand elle se fait en deux, et justifier ce choix avec le tableau de bord sous les yeux.
- Déclarer une grille avec `grid-template-columns`, l'unité `fr` et `repeat()`, et expliquer d'où viennent les lignes que tu n'as pas déclarées.
- Mesurer avec les outils du navigateur où commence et où finit chaque boîte, au lieu de juger à l'œil.
- Garder l'ordre du HTML comme ordre de lecture, sans réorganiser avec `order` ce que le clavier parcourt.

## Le pourquoi avant le comment

Ouvre `fig04_01.html` sur ton serveur local, avec la fenêtre du navigateur bien large, comme celle d'un ordinateur de bureau. Ce que tu vois est le tableau de bord tel que l'a laissé la Leçon 3 : lisible, avec ses couleurs et ses badges, mais **disposé comme une liste de courses**. Le titre, la date et les liens de navigation vont l'un sous l'autre, alors qu'il y a de la place de reste pour les mettre sur une seule ligne. Les quatre chiffres du récapitulatif sont quatre lignes, l'une sous l'autre, chacune sur toute la largeur. Le champ de recherche, les filtres et le bouton sont aussi empilés. Et le tableau se retrouve tout en bas, après tout le reste.

Mesure-le au lieu de le supposer. Je l'ai mesuré avec Chrome 154, de façon automatisée et sans fenêtre, avec la fenêtre à 1440 pixels : le contenu est une colonne de 60 rem (960 px) centrée, et à l'intérieur **chaque boîte occupe toute la largeur dont elle dispose** : le titre, la date et la navigation mesurent 928 px chacun, et dans les sections, avec leur marge intérieure, le chiffre « Caídos » (« En panne ») mesure 878 px, comme le tableau et comme le paragraphe où vit le bouton « Revisar ahora » (« Vérifier maintenant »). Le bouton non : il mesure environ 135 px, parce qu'un bouton est un élément en ligne et n'occupe que ce dont son texte a besoin ; ce qui s'étire, c'est le paragraphe qui le contient. Rien ne déborde et rien n'est mal écrit, mais l'espace est gaspillé : pour arriver au tableau, qui est ce que vient voir celui qui ouvre le tableau de bord, il faut passer par trois lignes d'en-tête, quatre chiffres et trois contrôles, chacun sur sa propre ligne. Les quatre chiffres tiendraient largement sur une seule rangée, et les trois contrôles aussi.

La cause est unique. **Jusqu'ici, le tableau de bord ne décide pas comment disposer ce qu'il porte.** Un bloc va sous un autre parce que c'est ce que fait le flux normal de la page, et chaque boîte mesure toute la largeur parce que personne ne lui a dit autre chose. Cette leçon lui apprend à décider avec les deux outils que CSS a pour cela : **Flexbox**, pour répartir des choses le long d'une ligne, et **Grid**, pour les disposer en lignes et en colonnes à la fois.

Un avertissement honnête dès le début, pour que cela ne te prenne pas par surprise : à la fin de cette leçon, le tableau de bord s'affichera bien sur un écran large, et pas **encore** sur un téléphone. Si tu réduis la fenêtre à 320 pixels, la page déborde toujours. Ce n'est pas un oubli : c'est un problème différent, avec ses propres outils, et il occupe toute la leçon suivante. Ici tu apprends à disposer ; dans la Leçon 5, à faire en sorte que la disposition serve à n'importe quelle largeur.

### Comment tu vas vérifier

Une disposition se juge mal à l'œil : deux boîtes qui « semblent » de même largeur diffèrent de vingt pixels, et un espace qui « semble » régulier ne l'est pas. C'est pourquoi dans cette leçon tu vas mesurer, et l'outil, tu l'as déjà : les outils du navigateur que tu as connus dans la Leçon 1.

Ouvre-les avec `F12` et entre dans l'onglet des éléments (dans Chrome et Edge il s'appelle « Éléments » ; dans Firefox, « Inspecteur »). Passe le curseur sur n'importe quelle balise de l'arbre du document : le navigateur grise cette boîte dans la page et montre une petite étiquette avec son nom et ses dimensions, par exemple, dans `fig04_01.html` à 1440 px, `dl 878 × 297.38` pour la liste du récapitulatif. Le premier nombre est la largeur et le second la hauteur, en pixels CSS. Si tu cliques sur la balise, le volet de droite te montre dans la section « Calculé » sa boîte complète : contenu, marge intérieure, bordure et marge. Et quand un élément est un conteneur flex ou grid, l'arbre lui met à côté un petit badge qui dit `flex` ou `grid` ; en cliquant dessus, le navigateur dessine sur la page les lignes de la grille ou le contour de chaque élément flex. Ce badge est la façon la plus rapide de savoir si une propriété de disposition agit ou non.

Pour savoir où **commence** et où **finit** une boîte, ce que tu utiliseras pour vérifier la plupart des résultats de cette leçon, le mode adaptatif est utile (l'icône de téléphone et de tablette dans Chrome et Edge ; `Ctrl`+`Maj`+`M` dans Firefox) : tu y écris la largeur exacte de la fenêtre, et la règle du haut te donne les positions. Quand dans cette leçon tu liras « le titre va de 256 à 553 px », cela signifie que son bord gauche est à 256 pixels du bord gauche de la fenêtre et son bord droit à 553 : la même chose que tu verrais en passant le curseur dessus avec la fenêtre à cette largeur.

## Les concepts

Deux idées, dans cet ordre : **Flexbox**, qui dispose des choses sur une ligne, et **Grid**, qui les dispose en lignes et en colonnes à la fois. Chacune s'explique d'abord avec un exemple minimal, dans une page d'essai que tu peux ouvrir et mesurer, puis s'applique au tableau de bord.

### 4.1 Flexbox : disposer en une dimension

#### 4.1.1 Conteneur, éléments et les deux axes

Par défaut, les enfants d'un élément se disposent selon le **flux normal** : les éléments de bloc (`<p>`, `<div>`, `<section>`) vont l'un sous l'autre et occupent toute la largeur disponible, et ceux de ligne (`<span>`, `<a>`, `<label>`) coulent comme les mots d'une ligne. Le flux normal est la raison pour laquelle le tableau de bord de la leçon précédente est une longue colonne.

[**Flexbox** est un mode de disposition alternatif](https://www.w3.org/TR/css-flexbox-1/) qui s'active avec une seule déclaration sur le *parent* :

```css
.container {
  display: flex;
}
```

Avec elle, le parent devient un **conteneur flex** et ses enfants directs deviennent des **éléments flex**. Seulement les enfants directs : les petits-enfants ne s'en aperçoivent pas. La première chose qu'on remarque est que les enfants, qui allaient avant l'un sous l'autre, vont maintenant l'un à côté de l'autre, sur une rangée. Mais l'important n'est pas la rangée : c'est que le conteneur **répartit maintenant l'espace** entre ses enfants, et que c'est toi qui lui dis comment.

Flexbox travaille avec deux axes, et presque toutes les erreurs de débutant viennent de leur confusion. L'**axe principal** est la direction dans laquelle les éléments se disposent ; l'**axe transversal** est la perpendiculaire. Avec la valeur par défaut, `flex-direction: row`, l'axe principal est horizontal (de gauche à droite en français) et le transversal est vertical. Si tu écris `flex-direction: column`, ils s'échangent : le principal devient vertical. Deux propriétés s'appuient sur cette distinction, et c'est pourquoi cela vaut la peine de l'apprendre avant les noms :

- `justify-content` répartit les éléments **le long de l'axe principal**.
- `align-items` les aligne **sur la largeur de l'axe transversal**.

Ouvre `fig04_02.html` pour le voir. C'est une page d'essai avec deux boîtes à lignes pointillées, chacune avec trois éléments bleus de hauteurs différentes :

```html
<!-- fig04_02.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Los dos ejes de Flexbox</title>
  <link rel="stylesheet" href="fig04_01/styles.css">
  <style>
    .box {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      gap: 0.5rem;
      height: 9rem;
      padding: 0.5rem;
      background: var(--color-surface);
      border: 2px dashed var(--color-border);
    }

    .box > div {
      padding: 0.5rem 1rem;
      color: #ffffff;
      background: var(--color-accent);
      border-radius: var(--radius);
    }

    .box > div:nth-child(2) { height: 5rem; }
    .box > div:nth-child(3) { height: 2.5rem; }

    .box-column {
      flex-direction: column;
      align-items: flex-start;
      height: 14rem;
    }
  </style>
</head>
<body>
  <main>
    <h1>Los dos ejes</h1>

    <h2>flex-direction: row (el eje principal es horizontal)</h2>
    <div class="box">
      <div>Uno</div>
      <div>Dos</div>
      <div>Tres</div>
    </div>

    <h2>flex-direction: column (el eje principal es vertical)</h2>
    <div class="box box-column">
      <div>Uno</div>
      <div>Dos</div>
      <div>Tres</div>
    </div>
  </main>
</body>
</html>
```

Dans la première boîte (`row`), `justify-content: space-between` colle « Uno » (« Un ») au bord gauche, « Tres » (« Trois ») au bord droit et laisse « Dos » (« Deux ») au milieu, avec l'espace restant réparti dans les creux. `align-items: center` centre les trois verticalement, c'est pourquoi, bien qu'ils aient des hauteurs différentes, tous partagent la même ligne centrale. Dans la seconde boîte, seule la direction change : l'axe principal est maintenant vertical, de sorte que `justify-content: space-between` répartit vers le bas (« Uno » en haut, « Tres » en bas) et `align-items: flex-start` colle tout au bord gauche, qui est maintenant le bord de l'axe transversal. **Les propriétés n'ont pas changé de signification : elles ont changé de direction.** C'est cela que signifie « les axes ».

Les valeurs que tu utiliseras le plus sont peu nombreuses :

| Propriété | Valeur | Ce qu'elle fait |
|---|---|---|
| `justify-content` | `flex-start` (par défaut) | Colle les éléments au début de l'axe principal |
| `justify-content` | `center` | Les rassemble au centre |
| `justify-content` | `space-between` | Le premier au début, le dernier à la fin, le reste réparti entre eux |
| `justify-content` | `flex-end` | Les colle à la fin |
| `align-items` | `stretch` (par défaut) | Chaque élément s'étire jusqu'à remplir l'axe transversal |
| `align-items` | `flex-start` / `center` / `flex-end` | Aligne au début, au centre ou à la fin de l'axe transversal |
| `align-items` | `baseline` | Aligne sur la ligne de base du texte, utile quand les tailles de police diffèrent |

Un détail utile : la valeur par défaut de `align-items` est `stretch`, et c'est pourquoi, dès que tu actives `display: flex`, les éléments d'une rangée **qui n'ont pas de hauteur propre** s'étirent jusqu'à la hauteur de la rangée et deviennent tous de même hauteur. C'est un effet secondaire qui surprend la première fois. La condition compte : [`stretch` n'étire que ce dont la hauteur est en `auto`](https://developer.mozilla.org/fr/docs/Web/CSS/Reference/Properties/align-items#stretch) ; un élément avec un `height` écrit conserve la sienne et reste collé au début de l'axe transversal. Je l'ai mesuré en retirant à la première boîte de `fig04_02.html` le `align-items: center`, pour que reste le `stretch` par défaut : la boîte mesure 144 px à l'extérieur et il lui en reste 124 à l'intérieur, une fois déduites sa marge intérieure et sa bordure. « Uno », qui n'a pas de hauteur propre, s'est étiré à ces 124 px ; « Dos » et « Tres », qui l'ont écrite (`5rem` et `2.5rem`), sont restés à 80 et 40 px, collés en haut.

#### 4.1.2 L'espace entre les éléments : `gap`

Entre les éléments flex il faut laisser de l'air. L'ancienne habitude était de mettre un `margin` à chaque enfant, et elle butait sur deux problèmes : le dernier élément se retrouve avec une marge en trop, et quand les éléments passent à la ligne il faut deviner quelles marges sont en trop. [La propriété `gap`, qui s'écrit dans le conteneur](https://www.w3.org/TR/css-align-3/), résout les deux choses : elle met l'espace seulement *entre* les éléments, jamais sur les bords, et pareil à l'horizontale et à la verticale. Tu peux donner une valeur (`gap: 1rem`) ou deux (`gap: 0.5rem 1rem` : d'abord l'espace entre lignes, puis l'espace entre colonnes).

`gap` fonctionne dans Flexbox et dans Grid, et c'est aujourd'hui l'une des choses que tu peux utiliser sans crainte, bien qu'elle soit arrivée dans les deux à des dates différentes, et il convient de le savoir parce que tu verras du vieux code avec des marges à sa place. Dans Grid, [MDN le marque comme disponible dans tous les navigateurs depuis octobre 2017](https://developer.mozilla.org/fr/docs/Web/CSS/Reference/Properties/gap). Dans Flexbox il a mis plus longtemps : [le dernier navigateur à l'accepter a été Safari 14.1, en avril 2021](https://web-platform-dx.github.io/web-features-explorer/features/flexbox-gap/), et la plateforme le considère comme de disponibilité générale (*widely available*, ce qui veut dire « disponible partout depuis au moins 30 mois ») depuis octobre 2023. La règle que tu suivras dans ce cours est simple : **la séparation entre frères, c'est le parent qui la met avec `gap` ; les marges sont réservées pour séparer un bloc de celui qui n'est pas son frère.**

#### 4.1.3 Combien mesure chaque élément : `flex`

Jusqu'ici nous avons réparti l'espace *restant*. Il reste à dire ce qui se passe quand les éléments ne tiennent pas, ou quand il en reste et que l'un doit en profiter. Trois nombres contrôlent cela, et ils s'écrivent ensemble dans la propriété `flex` :

```css
flex: <flex-grow> <flex-shrink> <flex-basis>;
```

- La **base** (`flex-basis`) est la taille de départ de l'élément sur l'axe principal. Avec `auto`, c'est celle qu'il aurait par sa propriété de taille sur cet axe —`width` dans une rangée, `height` dans une colonne ([c'est ainsi que la définit la spécification](https://www.w3.org/TR/css-flexbox-1/#flex-basis-property))— ou, s'il n'en a pas, par son contenu.
- **Croître** (`flex-grow`) dit quelle part de l'espace restant reçoit l'élément. Avec `0`, il ne reçoit rien. Avec `1`, tous les éléments qui valent `1` se partagent le reste en parts égales ; un avec `2` reçoit le double d'un avec `1`.
- **Rétrécir** (`flex-shrink`) dit combien l'élément cède quand l'espace manque. Avec `0`, il ne cède jamais ; avec `1`, il cède en proportion.

Les valeurs initiales sont `0 1 auto` : il ne croît pas, il rétrécit, il mesure ce que mesure son contenu. C'est pourquoi, sans que tu le demandes, un conteneur flex rempli d'éléments se serre avant de déborder. Il y a des raccourcis qu'il convient de reconnaître : `flex: 1` signifie `1 1 0` (« occupe tout ce qui reste, à partir de zéro »), `flex: auto` est `1 1 auto`, et `flex: none` est `0 0 auto` (« taille fixe »).

Il y a un piège qui coûte un après-midi la première fois. Un élément flex **ne rétrécit pas en dessous de la taille minimale de son contenu** : un mot long sans espaces, une image, un champ de texte avec une largeur fixe. [MDN le décrit ainsi](https://developer.mozilla.org/fr/docs/Web/CSS/Guides/Flexible_box_layout/Basic_concepts) : un élément peut rétrécir jusqu'à sa taille `min-content` et pas plus. Quand cela arrive, l'élément reste large et le conteneur déborde. La solution a deux parties : dire à l'élément qu'il peut rétrécir davantage, avec `min-width: 0` (dans une rangée ; dans une colonne, où l'axe principal est vertical, la propriété équivalente est `min-height: 0`), et donner à son contenu une façon de tenir dans moins d'espace (le couper avec des points de suspension ou le laisser passer à la ligne). Avec la première partie seule, l'élément rétrécit mais le texte en sort.

Regarde-le dans `fig04_03.html`. Ce sont deux lignes identiques, chacune avec le nom d'un service, son adresse (une longue URL, qui n'a pas d'espaces où se couper) et le badge d'état. L'adresse porte trois déclarations qui demandent « si tu ne tiens pas, coupe-toi avec des points de suspension » : `overflow: hidden`, `white-space: nowrap` et `text-overflow: ellipsis`. La seule différence entre les deux lignes est la classe `can-shrink`, qui ajoute `min-width: 0` à la boîte du nom :

```html
<!-- fig04_03.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>El mínimo de un elemento flex</title>
  <link rel="stylesheet" href="fig04_01/styles.css">
  <style>
    .service {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.5rem;
      border: 2px dashed var(--color-border);
    }

    .service-name {
      flex: 1 1 auto;
    }

    .service-name h2,
    .service-name p {
      margin: 0;
    }

    .address {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: var(--color-muted);
    }

    .can-shrink {
      min-width: 0;
    }
  </style>
</head>
<body>
  <main>
    <h1>El mínimo de un elemento flex</h1>

    <div class="service" id="one">
      <div class="service-name">
        <h2>Inventario</h2>
        <p class="address">https://inventario.example.com/salud/v2/estado-completo</p>
      </div>
      <span class="status status-down">Caído</span>
    </div>

    <div class="service" id="two">
      <div class="service-name can-shrink">
        <h2>Inventario</h2>
        <p class="address">https://inventario.example.com/salud/v2/estado-completo</p>
      </div>
      <span class="status status-down">Caído</span>
    </div>
  </main>
</body>
</html>
```

Je l'ai mesuré à 320 px, la largeur d'un petit téléphone. Dans la première ligne, la boîte du nom refuse de mesurer moins que l'URL complète (417 px), pousse le badge hors de l'écran et la page mesure **514 px** : elle déborde, bien que l'adresse « sache » se couper. Le motif est celui d'en haut : le minimum automatique d'un élément flex est la largeur de son contenu, et l'URL entière est ce contenu. Dans la seconde ligne, avec `min-width: 0`, la boîte du nom descend à 197 px, l'URL est coupée avec « … » et le badge reste dedans, à 26 px du bord droit de la fenêtre. À 768 px ou plus les deux lignes sont identiques, parce que là l'URL tient en entier : le piège n'apparaît que lorsque l'espace manque, et c'est pourquoi il passe inaperçu sur l'écran de celui qui programme.

Dans le tableau de bord de cette leçon il n'est pas nécessaire : aucun élément flex du tableau de bord n'a un contenu qui refuse de rétrécir. Mais l'idée revient dans la Leçon 5 sous un autre nom : une colonne `1fr` de Grid a le même minimum automatique, et la solution, `minmax(0, 1fr)`, est la même idée d'écrire le minimum zéro exprès.

#### 4.1.4 `flex-wrap` : passer à la ligne au lieu de se serrer

Par défaut, un conteneur flex a `flex-wrap: nowrap` : tous les éléments vont sur **une seule ligne**, et s'ils ne tiennent pas, ils rétrécissent (et s'ils ne peuvent plus rétrécir, ils débordent). Avec `flex-wrap: wrap`, les éléments qui ne tiennent pas **passent à la ligne suivante**. MDN le dit avec une phrase utile : quand il y a plusieurs lignes, chacune se comporte comme un conteneur flex à part. Cela signifie que `justify-content` et `flex-grow` agissent à l'intérieur de chaque ligne, pas sur l'ensemble.

La décision de qui tient sur quelle ligne se prend avec la *base* de chaque élément, avant de croître ou de rétrécir, mais ajustée par ses limites : si la base est inférieure à son `min-width` (ou supérieure à son `max-width`), c'est la limite qui compte, et ses marges comptent aussi. [La spécification](https://www.w3.org/TR/css-flexbox-1/#algo-line-break) l'appelle *taille principale hypothétique*. Je l'ai mesuré dans Chrome 154 : deux éléments avec une base de 200 px tiennent ensemble dans une rangée de 500 px ; si tu mets au second `min-width: 320px`, il passe à la ligne suivante, bien que sa base n'ait pas changé. Voici l'astuce qui soutient presque tout ce qui est « adaptable » sans écrire une seule requête média, et que la Leçon 5 va exploiter à fond : **si tu donnes à un élément une base raisonnable et que tu lui permets de croître, le navigateur se charge de le disposer**. Une base de `14rem` dit « je préfère mesurer environ 224 px ; mets-moi sur une ligne avec celui qui tient à côté de moi ; s'il reste de l'espace, répartis-le ». Sur un écran large, plusieurs tiennent sur la ligne ; sur un écran étroit, chacun passe à la ligne et occupe sa ligne entière. Personne n'a écrit « à 600 px, fais telle chose » : c'est le contenu qui décide.

#### 4.1.5 Exemple résolu : la barre de contrôles

La section « Servicios » du tableau de bord a aujourd'hui trois contrôles l'un sous l'autre : le champ de recherche avec son libellé, le groupe de filtres (les trois boutons radio) et le bouton « Revisar ahora ». Sur un écran large, le naturel est une seule rangée ; sur un téléphone, trois lignes. C'est le cas parfait pour Flexbox, parce que ce sont des frères qui se répartissent *une* ligne.

D'abord il faut préparer le HTML. Tu as déjà les trois contrôles ; il faut les envelopper dans un conteneur avec un nom pour pouvoir le cibler depuis le CSS. Et le champ avec son libellé se regroupe pour qu'ils voyagent ensemble. C'est le seul changement de HTML de cette étape :

```html
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
```

Observe ce qui n'a *pas* été touché : les éléments sont toujours ceux de la Leçon 2, avec leurs libellés associés. La seule chose nouvelle est un `div` conteneur et une classe. Le sens n'a pas changé ; on a seulement ajouté un endroit à cibler. Voici maintenant le CSS :

```html
<!-- fig04_04.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Barra de controles con Flexbox</title>
  <link rel="stylesheet" href="fig04_01/styles.css">
  <style>
    .controls {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      gap: 1rem;
    }

    .controls p,
    .controls fieldset {
      margin: 0;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      flex: 1 1 14rem;
    }

    .field input {
      width: 100%;
    }
  </style>
</head>
<body>
  <main>
    <h1>Barra de controles</h1>
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
  </main>
</body>
</html>
```

Ligne par ligne :

- `.controls { display: flex; flex-wrap: wrap; ... }` active Flexbox et permet de passer à la ligne. Les trois enfants directs (le champ, le groupe et le bouton) sont maintenant des éléments flex.
- `align-items: flex-end` les aligne par leur bord inférieur. Ainsi le champ, le groupe de filtres et le bouton partagent la même base, bien que leurs hauteurs soient différentes, et se voient comme une seule barre. Avec la valeur par défaut, `stretch`, le bouton s'étirerait jusqu'à la hauteur du groupe.
- `gap: 1rem` met l'espace entre eux, sans marges isolées.
- `.controls p, .controls fieldset { margin: 0 }` retire les marges qu'ils portaient par défaut ; maintenant c'est le parent qui met l'espace.
- Dans `.field`, qui est à son tour un conteneur flex, `flex-direction: column` empile le libellé sur le champ, et `flex: 1 1 14rem` dit au champ : « mesure 14rem de base, tu peux croître, tu peux rétrécir ». C'est le seul des trois qui croît, et c'est pourquoi il absorbe l'espace restant de la rangée.
- `.field input { width: 100% }` fait que le champ remplit son conteneur. Sans cette ligne, le paragraphe `.field` croîtrait, mais le champ resterait avec la largeur que le navigateur donne par défaut à un champ de texte, et l'espace gagné resterait vide à sa droite.

J'ai chargé cette page à cinq largeurs (320, 375, 768, 1024 et 1440 px) et dans les cinq la largeur de la page est égale à celle de la fenêtre : la barre ne déborde dans aucune. À 320 et à 375 px les contrôles forment trois lignes ; à partir de 768 px, une seule rangée, avec le champ occupant tout ce qui reste. À 1440 px je l'ai mesuré pièce par pièce : le champ va de 256 à 672.5 px (416.5 de large, bien plus que sa base de 224), le groupe de boutons radio de 688.5 à 1033 et le bouton de 1049 à 1184, collé au bord droit du contenu. Entre pièce et pièce, les 16 px du `gap`.


Il y a une propriété de Flexbox dont tu dois connaître l'existence, justement pour ne pas l'utiliser à la légère : `order`. Elle permet de changer l'ordre *visuel* des éléments sans déplacer le HTML. Le problème est que le clavier et le lecteur d'écran suivent l'ordre du **code**, pas celui de l'écran : celui qui navigue avec Tab sauterait d'un côté à l'autre de la barre sans comprendre pourquoi. Cela enfreint le [critère 1.3.2 (« Séquence significative »)](https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html) et [le 2.4.3 (« Ordre de focus »)](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html) des recommandations. Règle du cours : **l'ordre du HTML est l'ordre de lecture ; si une boîte doit aller en premier, on l'écrit en premier.**

### 4.2 Grid : disposer en deux dimensions

#### 4.2.1 Flexbox ou Grid : la question qui tranche

Flexbox dispose sur **une ligne** (avec des lignes qui passent à la suivante si tu le permets). [Grid dispose en **lignes et en colonnes à la fois**](https://www.w3.org/TR/css-grid-2/) : il définit une grille et place chaque élément dans une cellule. Ils se ressemblent en ce que tous deux commencent par une déclaration `display` dans le parent et que tous deux acceptent `gap`. Ils diffèrent par qui commande.

Dans Flexbox **c'est le contenu qui commande** : les éléments sont ceux qui demandent de l'espace et le conteneur le répartit. C'est pourquoi il est parfait pour une barre de contrôles, un en-tête avec titre et date, une rangée de boutons : des groupes de choses dont la taille dépend de ce qu'elles disent. Dans Grid **c'est la grille qui commande** : les colonnes existent d'abord, et les éléments s'y disposent, de sorte qu'ils sont alignés autant à l'horizontale qu'à la verticale. C'est pourquoi il est parfait pour des cartes de récapitulatif, un tableau de chiffres ou le squelette de la page.

Une question pratique pour décider : *est-ce que je veux que les choses de la deuxième ligne soient alignées avec celles de la première ?* Si oui, c'est Grid. Si chaque ligne se dispose pour son compte, c'est Flexbox. Et ils ne s'excluent pas : dans le tableau de bord tu vas utiliser les deux, l'un dans l'autre.

#### 4.2.2 Colonnes, `fr` et `repeat()`

Pour activer Grid on écrit `display: grid` dans le parent, et on lui dit combien de colonnes il a avec `grid-template-columns` :

```css
.summary {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.75rem;
}
```

La nouvelle unité est `fr`, pour *fraction* : « une part de l'espace disponible ». Trois colonnes de `1fr` répartissent la largeur en trois parts égales ; `1fr 2fr` donnerait à la seconde le double de la première ; `200px 1fr` fixe la première colonne et laisse tout le reste à la seconde. Répéter trois fois la même chose fatigue, et c'est pourquoi `repeat()` existe : `repeat(3, 1fr)` est la même chose que `1fr 1fr 1fr`.

Il n'est pas nécessaire de lui dire combien il y a de lignes. S'il y a six éléments et trois colonnes, le navigateur crée tout seul deux lignes. [MDN les appelle la **grille implicite**](https://developer.mozilla.org/fr/docs/Web/CSS/Guides/Grid_layout/Basic_concepts) : celle qui s'étend quand il y a du contenu en dehors de ce que tu as déclaré (la déclarée est l'*explicite*). Sa hauteur se contrôle avec `grid-auto-rows` ; par défaut, chaque ligne mesure ce que son contenu demande.

Une façon de te convaincre que tu as compris la grille implicite : avec quatre éléments et `repeat(2, 1fr)`, combien de lignes y a-t-il ? Deux, de deux éléments chacune, et personne ne les a déclarées. L'Exercice 2 te demande de le vérifier avec les chiffres du récapitulatif.

#### 4.2.3 Exemple résolu : le récapitulatif en quatre colonnes

Le récapitulatif du tableau de bord est le cas d'école pour Grid : quatre chiffres qu'il convient de voir ensemble, chacun avec son nom en haut et sa valeur en bas, et alignés entre eux. Avant le CSS, le HTML. Le récapitulatif de la Leçon 2 est une liste de description (`<dl>`) avec quatre groupes de terme et de valeur, et il n'y a rien à changer à son sens. On lui ajoute seulement une classe pour le cibler :

```html
<dl class="summary">
```

Il n'est pas non plus nécessaire de toucher aux quatre boîtes (`div`) qui enveloppaient déjà chaque paire de terme et de valeur : chacune devient un élément de la grille. C'est ce qui se passe quand le HTML avait déjà la bonne structure : Grid ne fait que lire ce qui était déjà écrit. La page d'essai `fig04_05.html` déclare quatre colonnes égales :

```html
<!-- fig04_05.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Resumen en cuatro columnas fijas</title>
  <link rel="stylesheet" href="fig04_01/styles.css">
  <style>
    .summary {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
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

Ligne par ligne : `display: grid` fait de la liste un conteneur grid et de ses quatre `div` des éléments de la grille ; `grid-template-columns: repeat(4, 1fr)` demande quatre colonnes qui se partagent la largeur en parts égales ; `gap: 0 1rem` ne laisse pas d'espace entre lignes (il n'y en a qu'une) et laisse 16 px entre colonnes ; et `margin: 0` retire la marge que la liste de description porte par défaut, pour que ce soit celui qui la contient qui mette l'espace. Je l'ai mesuré à 1440 et à 1024 px : les quatre chiffres se retrouvent sur une seule rangée, chaque colonne de **220 px** exactement, avec 16 px entre l'une et l'autre. Les comptes tombent juste : le conteneur mesure 928 px, les trois creux totalisent 48, et les 880 restants divisés par quatre donnent 220.

Une question raisonnable avant de continuer : *changer le `display` d'un élément qui a un sens propre lui retire-t-il son sens ?* Je l'ai vérifié dans Chrome 154 avec l'arbre d'accessibilité : la liste de description avec `display: grid` conserve ses termes et ses définitions, et même un tableau avec `display: grid` conserve son rôle de tableau. Dans d'autres navigateurs et avec d'autres lecteurs d'écran il n'y a pas de garantie : [Adrian Roselli, qui mesure cela depuis des années](https://adrianroselli.com/2020/11/under-engineered-responsive-tables.html), avertit que changer le `display` d'un tableau peut lui retirer la navigation par cellules pour celui qui utilise un lecteur. Comme il n'est pas nécessaire de courir le risque, la règle du cours est : **on ne change pas le `display` d'un tableau ; on change celui de son enveloppe**. La Leçon 5 le met en pratique.

Et maintenant la partie honnête de l'exemple. Réduis la fenêtre à 320 px et mesure de nouveau : les quatre chiffres se serrent, chacun se coupe en plusieurs lignes, et pourtant la page **mesure 344 px de large**, plus que la fenêtre. Quatre colonnes fixes sont une bonne décision quand il y a de la place et une mauvaise quand il n'y en a pas, et `1fr` a un minimum caché qui ne laisse pas la colonne rétrécir au-delà de son mot le plus long. Pourquoi cela arrive, et la ligne de CSS qui fait que la grille **compte toute seule** combien de colonnes tiennent, sont le premier concept de la Leçon 5. Pour l'instant, garde la question à laquelle tu sauras répondre en la terminant : *combien de colonnes tiennent à 320 px, et qui devrait le décider ?*

#### 4.2.4 Le tableau de bord disposé

Avec ce qui précède, tu as toutes les pièces pour disposer le tableau de bord complet sur un écran large. Le tableau de bord de la leçon est `fig04_06.html`. Les changements par rapport à la Leçon 2 sont peu nombreux, et aucun ne change ce que dit le HTML : la classe `page-header` dans l'en-tête, la classe `summary` dans la liste de description, et le `div.controls` avec son `p.field` autour des trois contrôles, comme en 4.1.5. Le tableau reste exactement le même.

```html
<!-- fig04_06.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Revisor de servicios</title>
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="fig04_06/styles.css">
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

Un avertissement avant de regarder la feuille : l'en-tête en rangée (`.page-header`) est l'étape 1 de l'Exercice 1. Si tu veux le résoudre par toi-même, fais-le avant de lire le CSS. La feuille est celle de la Leçon 3 **sans toucher une seule de ses règles**, avec un nouveau bloc à la fin de la couche `components` ; les commentaires indiquent où il commence :

```css
/* fig04_06/styles.css */
/* La hoja del panel al terminar la Lección 4: la de la Lección 3, sin tocar una
   sola de sus reglas, más un bloque al final con Flexbox y Grid. */

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

Le nouveau bloc a trois parties, et tu connais déjà chacune. L'en-tête (`.page-header`) est un conteneur flex qui répartit ses trois enfants avec `space-between`, les aligne sur la ligne de base du texte et leur permet de passer à la ligne ; son paragraphe perd la marge pour que la date ne soit pas plus basse que le titre. La barre de contrôles (`.controls`, `.field`) est celle de 4.1.5, avec les nombres remplacés par les variables d'espace de la Leçon 3 (`var(--space-3)` est le même `1rem`). Et le récapitulatif (`.summary`) est la grille de quatre colonnes de 4.2.3. Ce qui n'a *pas* changé compte autant que ce qui a changé : les couches, les variables, le focus et les badges sont ceux de la Leçon 3. La disposition s'ajoute à ce qui existait ; elle ne le réécrit pas.

Mesure-le. À 1440 px, avec l'outil d'inspection, le titre de l'en-tête va de 256 à 553 px, la date de 617 à 938 et la navigation de 1002 à 1184, collée au bord droit du contenu : une seule rangée. Les quatre chiffres du récapitulatif se retrouvent sur une rangée de quatre colonnes de 207.5 px (elles mesurent moins que les 220 de la page d'essai parce qu'elles vivent maintenant dans une section, avec sa marge intérieure et sa bordure). Et la barre de contrôles est une seule rangée, avec le champ de 281 à 647.5 px, les boutons radio de 663.5 à 1008 et le bouton de 1024 à 1159. Ce qui dans la page de départ faisait dix lignes empilées est maintenant trois bandes : l'en-tête, le récapitulatif et la barre, avec le tableau juste en dessous. Le tableau, qui est ce qu'on vient voir, monte de plus de 400 pixels : dans `fig04_01.html` il commençait à 859 px du haut de la page, et dans `fig04_06.html` il commence à 419.

À 768 px tout continue de ne pas déborder, et l'en-tête et la barre se répartissent déjà sur plus d'une ligne tout seuls, grâce à `flex-wrap`. À 375 et 320 px, en revanche, la page mesure **414 px** : le tableau est toujours plus large que la fenêtre, comme depuis la Leçon 3, et il est maintenant accompagné du récapitulatif, dont les quatre colonnes fixes arrivent jusqu'à 369 px. C'est le point exact où commence la Leçon 5.

#### 4.2.5 Intègre-le à ton `revisor`

Jusqu'ici tu as travaillé avec les pages du dépôt. Il manque l'étape qui transforme ce que tu as appris en ton projet : que **ton** `revisor` devienne identique à `fig04_06.html`, mesuré et enregistré dans Git. Il y a quatre étapes, et aucune ne demande d'écrire quoi que ce soit de nouveau.

**1. La feuille.** Ouvre ton `~/revisor/css/styles.css` et colle à la fin de la couche `components`, juste avant la dernière accolade fermante `}`, le bloc qui commence par le commentaire `/* ---- Lección 4: Flexbox y Grid ---- */` (tu l'as en entier plus haut, ou dans `fig04_06/styles.css` du dépôt). N'efface rien de ce qu'il y avait : le bloc ne fait qu'ajouter. Si tu préfères, tu peux remplacer la feuille entière par `fig04_06/styles.css`, qui est celle de la Leçon 3 avec ce bloc ; mais si dans la Leçon 3 tu as fait des changements à toi dans ta feuille (une autre couleur, une autre taille), la remplacer les effacerait, et dans ce cas il vaut mieux coller seulement le bloc.

**2. La page.** Dans ton `~/revisor/index.html`, fais les trois changements du HTML :

- `<header>` devient `<header class="page-header">`.
- `<dl>` devient `<dl class="summary">`.
- Le champ de recherche, le `<fieldset>` et le paragraphe du bouton se retrouvent à l'intérieur d'un `<div class="controls">`, et le paragraphe du champ porte `class="field"`, comme en 4.1.5. Fais attention à l'endroit où tu fermes le `div` : après le paragraphe du bouton et avant le tableau.

Tu peux aussi copier `fig04_06.html` en entier sur ton `index.html`, avec une précaution : dans le dépôt, son `<link>` pointe vers `fig04_06/styles.css` ; dans ton projet il doit dire `href="css/styles.css"`, comme depuis la Leçon 3. Si tu ne le changes pas, la page s'affichera sans styles.

**3. Mesure.** Depuis le dossier du projet, allume le serveur :

```bash
$ cd ~/revisor
$ python3 -m http.server 8000 --bind 127.0.0.1
```

Ouvre `http://127.0.0.1:8000/`, active le mode adaptatif avec la fenêtre à 1440 px et compare ton tableau de bord avec `fig04_06.html` à la même largeur : l'en-tête sur une rangée, les quatre chiffres sur une rangée et la barre de contrôles sur une rangée. Passe le curseur sur `.summary` dans l'onglet des éléments : il doit avoir le badge `grid`, et `.controls` et `.page-header` le badge `flex`. Si l'un d'eux ne l'a pas, c'est une classe qui n'a pas été écrite ou un `div` qui a été fermé ailleurs. Ne t'inquiète pas si à 320 px ton tableau de bord déborde encore : celui de la leçon aussi, et pour la même raison.

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
$ git commit -m "Acomoda el panel con Flexbox y Grid"
$ git status
En la rama main
nada para hacer commit, el árbol de trabajo está limpio
```

Le `git commit` imprime une ligne avec le code du commit et le nombre de lignes qui ont changé ; les nombres dépendent de tes fichiers. Avec cela, ton `revisor` est prêt pour la Leçon 5, qui part exactement d'ici.

La feuille de départ, `fig04_01/styles.css`, est celle de la Leçon 3 telle quelle ; tu l'as en entier ci-dessous, au cas où tu voudrais comparer ou n'aurais pas celle de la leçon précédente :

```css
/* fig04_01/styles.css */
/* La hoja del panel tal como la deja la Lección 3, sin un solo cambio: todavía
   no acomoda nada, y cada cosa va debajo de la anterior. */

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
}
```

et la page de départ, `fig04_01.html`, est le tableau de bord de la Leçon 2 avec un `<link>` vers cette feuille :

```html
<!-- fig04_01.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Revisor de servicios</title>
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="fig04_01/styles.css">
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

## L'erreur que tu vas voir

Les erreurs de disposition ne sont presque jamais des messages : c'est une page qui s'affiche « mal » sans dire pourquoi. Les deux que tu rencontreras le plus avec Flexbox s'apprennent mieux en les provoquant exprès. Le premier ne laisse aucune trace dans la console, seulement un indice discret dans les outils du navigateur ; le second se voit dès que la fenêtre se rétrécit.

**Une erreur de disposition qui ne prévient pas : la propriété qui ne fait rien.** Ouvre `fig04_07.html`. C'est une barre de trois boutons avec `justify-content: space-between`, et les boutons restent collés à gauche, l'un après l'autre, sans se répartir :

```html
<!-- fig04_07.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Una propiedad de Flexbox sin contenedor</title>
  <link rel="stylesheet" href="fig04_01/styles.css">
  <style>
    .controls {
      justify-content: space-between;
      gap: 0.75rem;
    }
  </style>
</head>
<body>
  <main>
    <h1>Los botones no se reparten</h1>
    <div class="controls">
      <button type="button">Todos</button>
      <button type="button">Disponibles</button>
      <button type="button">Caídos</button>
    </div>
  </main>
</body>
</html>
```

Il n'y a rien dans la console. Le navigateur ne considère pas cela comme une erreur : il ignore simplement la propriété, parce que `justify-content` n'a pas d'effet dans un bloc normal ([elle n'agit que dans les conteneurs flex, grid ou à plusieurs colonnes](https://developer.mozilla.org/fr/docs/Web/CSS/Reference/Properties/justify-content)), et `.controls` est un bloc normal (il manque `display: flex`). Ce qu'il y a bien, c'est un indice dans les outils du navigateur : ouvre l'onglet des éléments, sélectionne `.controls` et regarde son volet de styles ; la déclaration `justify-content: space-between` apparaît atténuée, avec une icône d'avertissement à côté qui, en passant le curseur, explique que la propriété n'a pas d'effet parce que l'élément n'est ni un conteneur flex ni un conteneur grid. (Le texte exact change selon le navigateur et sa langue ; l'icône et la déclaration atténuée sont le signal.) La correction tient en une ligne : `display: flex`. **Quand une propriété de disposition « ne fait rien », la première chose qu'on vérifie est si son parent est un conteneur.**

**L'élément qui ne rétrécit pas.** Le second cas est celui de 4.1.3, et il vaut la peine de le reconnaître de loin parce qu'il se déguise : tu ouvres `fig04_03.html` à 320 px et une barre de défilement horizontale apparaît, bien que le texte long ait tout ce qu'il faut pour se couper avec des points de suspension. Le signal est que l'élément qui dépasse du bord est le **conteneur** du texte, pas le texte : en passant le curseur dans l'onglet des éléments, la boîte `.service-name` de la première ligne mesure 417 px dans une fenêtre de 320. Un élément flex ne rétrécit pas en dessous de son contenu minimal, et une URL sans espaces est un contenu minimal énorme. La correction, ce sont les deux parties que tu connais déjà : `min-width: 0` sur l'élément flex, et une façon de tenir pour son contenu. Si tu ne mets que la seconde, le texte « sait » se couper, mais sa boîte ne le lui demande jamais.

## Ce qui se fait de travers

**Séparer les frères avec des marges sur chaque enfant.** `margin-right: 1rem` sur chaque bouton d'une barre. Le dernier garde une marge en trop, et quand la barre passe à la ligne les marges ne coïncident plus avec les creux. Coût : des ajustements avec `:last-child` et des nombres magiques que personne ne comprend un mois plus tard. Correction : l'espace entre frères, c'est le parent qui le met avec `gap`.

**Mettre la propriété de disposition sur l'enfant et non sur le parent.** `justify-content` ou `grid-template-columns` sur chaque carte, au lieu du conteneur qui les répartit. Elles ne font rien, et il n'y a pas d'erreur pour le dire : c'est le cas de `fig04_07.html` sous un autre déguisement. Avant d'écrire une propriété de disposition, demande-toi qui répartit ; c'est là qu'elle va.

**Utiliser `order` pour réorganiser ce qui se lit.** Réordonner avec le CSS quelque chose que le clavier parcourt dans un autre ordre. Coût : Tab saute d'un côté à l'autre et un lecteur d'écran lit dans un ordre qui ne coïncide pas avec ce qu'on voit. Cela se corrige en écrivant le HTML dans l'ordre dans lequel il doit se lire.

**Des largeurs fixes en pixels pour tout.** `width: 640px` dans une colonne, `input { width: 20rem }` dans un champ. Elles semblent bonnes sur l'écran de celui qui les écrit et gênent sur n'importe quel autre. Le tableau de bord s'en est sauvé parce que la feuille de la Leçon 3 n'a donné à rien une largeur fixe, et la barre de contrôles de cette leçon non plus : elle a donné au champ une **base** (`14rem`) qui peut croître et rétrécir, ce qui n'est pas la même chose qu'une largeur. L'alternative à un nombre écrit : `width: 100%`, `max-width`, ou laisser la largeur à `flex` et à `grid`.

## Exercices

### Exercice 1 — L'en-tête sur une rangée

Le `<header>` du tableau de bord a trois enfants : le titre `<h1>`, le paragraphe « Última revisión » (« Dernière vérification ») et le `<nav>` avec les deux liens. Dans `fig04_01.html` ils vont l'un sous l'autre. Utilise Flexbox, sans toucher au HTML, en deux étapes :

1. Fais-en une rangée, avec le titre collé à gauche, le `<nav>` collé au bord droit et la date répartie entre les deux, de façon que sur un téléphone étroit ils passent à la ligne au lieu de se serrer.
2. Maintenant change d'avis : le titre à gauche et **les deux autres ensemble** au bord droit, l'un à côté de l'autre.

Mesure les deux étapes à 1440 et à 320 px avec les outils, en regardant où commence et où finit chaque enfant, et vérifie qu'à 320 px l'en-tête ne sort pas de la fenêtre.

### Exercice 2 — Deux colonnes, deux lignes

Copie `fig04_05.html` et remplace `repeat(4, 1fr)` par `repeat(2, 1fr)`. Avant de recharger, **prédis** : combien de lignes y aura-t-il, qui les a déclarées et combien mesurera chaque carte à 1440 px ? Ensuite mesure à 1440, 768 et 320 px. La page déborde-t-elle à 320 px comme débordait celle à quatre colonnes ? Explique pourquoi oui ou pourquoi non.

### Exercice 3 — Qui garde ce qui reste

Dans `fig04_04.html`, à 1440 px, le champ de recherche mesure bien plus que sa base de 14 rem. Remplace son `flex: 1 1 14rem` par `flex: 0 1 14rem` (seulement le premier nombre). Prédis ce qui arrive au champ, au bouton et à l'espace qui reste ; ensuite mesure la largeur du champ et la position du bouton, et explique la différence avec ce que dit chacun des trois nombres de `flex`.

## Solutions

### Solution 1

**Étape 1.** L'en-tête a besoin de trois choses : qu'il soit un conteneur flex, qu'il passe à la ligne et que les enfants se répartissent. Avec `justify-content: space-between` le premier enfant reste à gauche, le dernier à droite et celui du milieu, entre les deux. C'est la même chose que fait la règle `.page-header` de la feuille du tableau de bord, qui à la place du nom de l'élément utilise une classe et à la place des nombres, les variables d'espace :

```css
header {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.25rem 1rem;
}
```

Avec `flex-wrap: wrap`, quand les trois ne tiennent pas sur une ligne, le dernier passe tout seul, sans requête média. Les deux valeurs de `gap` séparent les lignes (0.25 rem) moins que les colonnes (1 rem). L'alignement `baseline` met le titre et les petits textes sur la même ligne de texte, ce qui est plus joli que d'aligner par le bord inférieur des boîtes. Je l'ai mesuré dans `fig04_06.html` : à 1440 px le titre va de 256 à 553 px, la date de 617 à 938 et le `<nav>` de 1002 à 1184, collé au bord droit du contenu ; à 320 px les trois passent à la ligne, un par ligne, et l'en-tête mesure juste les 320 px de la fenêtre.

**Étape 2.** `space-between` ne sert pas à rassembler les deux de droite : il répartit le reste dans *tous* les creux, et c'est pourquoi la date reste au milieu. Ce qu'il faut, c'est que le reste aille dans un seul creux, celui qui est après le titre. C'est ce que fait une **marge automatique** : dans un conteneur flex, [une marge `auto` garde tout l'espace restant](https://developer.mozilla.org/fr/docs/Web/CSS/Guides/Flexible_box_layout/Aligning_items) de son côté, et pousse ceux qui viennent après jusqu'à la fin. On change deux lignes :

```css
header {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: flex-start;
  gap: 0.25rem 1rem;
}

header h1 {
  margin-right: auto;
}
```

`justify-content` revient à sa valeur de départ, qui ne répartit rien, et le `margin-right: auto` du titre absorbe tout l'espace libre de la ligne. Mesuré pareil, à 1440 px : le titre va toujours de 256 à 553, la date va maintenant de 665 à 986 et le `<nav>` de 1002 à 1184 ; entre les deux il reste juste les 16 px du `gap`. À 320 px le résultat est le même qu'à l'étape 1 (un par ligne). L'autre issue, regrouper la date et le `<nav>` dans un `div` à eux, fonctionne aussi, mais elle change le HTML pour résoudre quelque chose qui n'est que de la disposition.

Le tableau de bord de la leçon garde l'étape 1 : la date au milieu sépare visuellement le titre de la navigation. Les deux sont correctes ; ce qui compte, c'est de savoir laquelle tu as demandée et avec quel outil on obtient chacune.

### Solution 2

Il y a **deux lignes** de deux cartes chacune, et personne ne les a déclarées : `grid-template-columns` ne parle que de colonnes, et quand les quatre éléments ne tiennent pas dans les deux colonnes déclarées, le navigateur crée la seconde ligne de son propre chef. C'est la grille implicite de 4.2.2. Je l'ai mesuré : à 1440 px chaque carte mesure **456 px** (928 moins un creux de 16, entre deux) ; à 768 px, 360 ; et à 320 px, 136, sans déborder : la page mesure 320.

Pourquoi celle-ci ne déborde-t-elle pas et celle à quatre colonnes si ? Parce que le minimum caché de `1fr` est toujours là, mais maintenant il n'a plus qu'à faire tenir la moitié des mots longs sur chaque ligne : deux colonnes avec leur plancher, plus un creux, tiennent dans les 288 px que laisse la page. Remarque ce que cela enseigne : le nombre de colonnes qui convient **dépend de la largeur**, et l'écrire à la main oblige à en choisir un seul pour toutes les largeurs. Que la grille le compte toute seule est justement ce que tu apprendras dans la Leçon 5.

### Solution 3

Avec `flex: 0 1 14rem` le champ **cesse de croître** : il mesure sa base, 224 px, au lieu des 416.5 qu'il mesurait. Le groupe de boutons radio et le bouton ne changent pas de taille (aucun ne croissait), donc ils se décalent vers la gauche : le bouton, qui finissait à 1184 px, collé au bord droit du contenu, finit maintenant à 991.5. Les 192.5 px qui restent demeurent vides à la fin de la ligne.

Les trois nombres l'expliquent. Le premier, *croître*, dit quelle part du reste reçoit l'élément ; avec `1`, le champ était le seul à demander du reste et il prenait tout, et avec `0` personne n'en demande et il reste là où il tombe (à la fin, parce que `justify-content` vaut `flex-start`). Le second, *rétrécir*, reste à `1` : si la barre se rétrécit, le champ cède encore. Le troisième, la *base*, n'a pas changé : 14 rem. C'est pourquoi dans la barre du tableau de bord le champ porte `1` au début : c'est la pièce qu'il convient de laisser profiter de l'espace, parce qu'un champ de recherche plus large laisse voir plus de ce qu'on écrit.

## Comment savoir que j'ai réussi

- [ ] Tu peux dire, avant de recharger, ce que font `justify-content: space-between` et `align-items: center` sur une rangée, et ce qui change avec `flex-direction: column` ; `fig04_02.html` te donne raison.
- [ ] `fig04_04.html` à 1440 px est une seule rangée avec le champ occupant ce qui reste, et à 320 px ce sont trois lignes, sans déborder.
- [ ] Tu peux expliquer pourquoi la première ligne de `fig04_03.html` déborde à 320 px et la seconde non.
- [ ] Dans `fig04_06.html` à 1440 px l'en-tête, le récapitulatif et la barre sont trois bandes d'une rangée chacune, et l'outil d'inspection montre le badge `grid` sur `.summary` et `flex` sur `.page-header` et `.controls`.
- [ ] Avec Tab, le focus passe dans le même ordre que dans la Leçon 3 : lien « Resumen », lien « Servicios », champ de recherche, groupe de boutons radio et bouton « Revisar ahora ». La disposition n'a pas changé l'ordre de lecture.
- [ ] Tu peux dire avec une question quand utiliser Flexbox et quand Grid, et donner un exemple du tableau de bord pour chacun.
- [ ] Ton `~/revisor` (servi depuis son dossier sur `http://127.0.0.1:8000/`) s'affiche comme `fig04_06.html` à 1440 px, et `git log --oneline` montre le commit avec la disposition.

## Résumé

Pour fixer ce que tu viens de voir, réponds sans regarder la leçon :

1. Quel axe contrôle `justify-content` et lequel `align-items` ? Qu'est-ce qui change quand tu mets `flex-direction: column` ?
2. Pourquoi `gap` est-il meilleur qu'une marge sur chaque enfant ?
3. Que signifie `flex: 1 1 14rem` dans un élément, dit avec tes mots ?
4. Pourquoi un élément flex avec une longue URL à l'intérieur peut-il faire déborder la page, et quelles deux choses le règlent ?
5. Quelle est la question qui tranche entre Flexbox et Grid ?
6. Avec six éléments et `repeat(3, 1fr)`, combien y a-t-il de lignes et qui les a déclarées ?
7. Pourquoi ne réorganise-t-on pas avec `order` ce que le clavier parcourt ?

Si une réponse t'accroche, retourne à la sous-section correspondante : c'est le signe qu'une pièce est restée lâche à cet endroit, pas que tu n'es pas fait pour cela.

## Pour aller plus loin

- [MDN, « Concepts de base de Flexbox »](https://developer.mozilla.org/fr/docs/Web/CSS/Guides/Flexible_box_layout/Basic_concepts) — l'explication des axes, de `flex-wrap` et des trois valeurs de `flex`, sur laquelle s'appuie cette leçon. Consulté le 7 octobre 2026.
- [MDN, « Concepts de base de Grid »](https://developer.mozilla.org/fr/docs/Web/CSS/Guides/Grid_layout/Basic_concepts) — grille explicite et implicite, `fr`, `repeat()` et `minmax()`. Consulté le 7 octobre 2026.
- [MDN, « Aligner des éléments dans un conteneur flex »](https://developer.mozilla.org/fr/docs/Web/CSS/Guides/Flexible_box_layout/Aligning_items) — `justify-content`, `align-items` et les marges automatiques de l'Exercice 1, avec des dessins de chaque valeur. Consulté le 7 octobre 2026.
