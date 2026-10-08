# Leçon 3 — CSS : cascade, spécificité et boîte

**Durée :** deux sessions d'environ 90 min. Une répartition qui marche : la première, « Le pourquoi avant le comment » et la cascade (3.1), avec ses figures pour prédire quelle règle l'emporte ; la seconde, la boîte (3.2), les variables (3.3), le tableau de bord lisible, « L'erreur que tu vas voir » et les exercices. Chaque session se termine par une page que tu peux ouvrir et mesurer.

**Ce que tu construis :** le tableau de bord `revisor`, désormais lisible : typographie, couleurs, un tableau bien ordonné et les badges d'état

**Ce que tu apprends :** d'où vient chaque style et lequel l'emporte ; le modèle de boîte et `box-sizing` ; variables de couleur et de typographie

**Les pages de cette leçon.** Toutes les figures se trouvent dans [`programas/03-css-cascada-caja/`](https://github.com/HabilMX/curso-web/tree/main/programas/03-css-cascada-caja) du [dépôt du cours](https://github.com/HabilMX/curso-web), chacune avec sa sortie attendue à côté ; la feuille du tableau de bord lisible est dans `fig03_08/styles.css`. Ouvre-les avec ton serveur local, comme dans la Leçon 1.

## À la fin, tu seras capable de

- Relier une feuille de style à une page et écrire des règles avec des sélecteurs d'élément, de classe, d'identifiant et d'état.
- Prédire quelle règle l'emporte quand deux entrent en conflit, en calculant leur spécificité et en appliquant l'ordre de la cascade, sans recourir à `!important`.
- Calculer à la main la largeur réelle d'une boîte avec `content-box` et avec `border-box`, et le vérifier dans les outils du navigateur.
- Déclarer des variables de couleur, d'espace et de typographie, et les utiliser pour qu'un changement de décision se fasse en un seul endroit.
- Vérifier chiffres en main qu'une couleur de texte respecte le contraste minimal et que le focus du clavier se voit.
- Lire les messages du validateur de CSS et reconnaître les deux erreurs qui ne produisent aucun message.

## Le pourquoi avant le comment

À la fin de la Leçon 2, le tableau de bord fonctionnait et ressemblait à une page de 1995 : une police à empattements, un bouton gris du système, un tableau sans lignes où les colonnes se collent les unes aux autres. Ce n'est pas un défaut du HTML ; c'est ce que fait le navigateur quand personne ne lui dit comment dessiner. Tout navigateur apporte sa propre feuille de style, et c'est celle que tu as vue jusqu'ici.

Aujourd'hui nous lui disons comment nous voulons que cela s'affiche. Le tableau de bord doit pouvoir se lire : une police lisible, des tailles qui hiérarchisent, un tableau avec des lignes séparées et des nombres alignés, et un badge de couleur à côté de l'état de chaque service pour qu'on distingue d'un coup d'œil ce qui va bien de ce qui est en panne. C'est le résultat visible.

Ce que tu apprends vraiment aujourd'hui est autre chose, et c'est ce qui sépare celui qui écrit du CSS de celui qui le subit. **Presque tous les problèmes de CSS sont de l'un de deux types : « ma règle ne s'applique pas » et « ma boîte ne mesure pas ce que j'ai écrit ».** Le premier s'appelle la cascade et le second le modèle de boîte. Celui qui ne comprend pas la cascade résout chaque conflit en augmentant la force : plus de sélecteurs, un identifiant, un `!important`, puis un autre `!important` pour vaincre le premier. Celui qui ne comprend pas la boîte finit par retrancher des pixels à l'œil jusqu'à ce que quelque chose tienne. Les deux finissent avec une feuille de style où personne n'ose toucher à rien.

C'est pourquoi la leçon suit cet ordre. D'abord la **cascade** (section 3.1) : comment le navigateur décide, parmi plusieurs règles qui se disputent le même élément, laquelle reste. Ensuite la **boîte** (3.2) : combien mesure vraiment chaque élément. Et à la fin les **variables** (3.3), qui te laissent écrire chaque décision une seule fois : la couleur du texte, l'espacement, la police. Dans chaque section il y a une page que tu peux ouvrir, modifier et casser. Celle de la fin est le tableau de bord complet.

Un critère traverse tout : le CSS de cette leçon **ne cache rien de ce que tu as appris dans la précédente**. Le focus du clavier se voit, l'état ne dépend pas seulement de la couleur, les textes ont un contraste suffisant. On le vérifie avec des chiffres, pas à l'œil.

## Les concepts

### 3.1 D'où vient chaque style et lequel l'emporte

#### 3.1.1 Une règle, de bout en bout

Une feuille de style est une liste de **règles**. Chaque règle a deux moitiés : le **sélecteur**, qui dit à quels éléments elle s'applique, et le **bloc de déclarations** entre accolades, qui dit ce qui change en eux. Chaque déclaration est une paire `propriété: valeur;` et se termine par un point-virgule.

```html
<!-- fig03_01.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Mi primer estilo</title>
  <style>
    h1 {
      color: #0b5cad;
    }
    p {
      max-width: 40rem;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <main>
    <h1>Revisor de servicios</h1>
    <p>Cada regla tiene un selector, que dice a qué elementos se aplica, y declaraciones entre llaves, que dicen qué cambia en ellos.</p>
  </main>
</body>
</html>
```

```text
Revisor de servicios
Cada regla tiene un selector, que dice a qué elementos se aplica, y declaraciones entre llaves, que dicen qué cambia en ellos.
```

Dans cette page, `h1` est un sélecteur qui signifie « tous les titres de premier niveau » ; la déclaration `color: #0b5cad;` change la couleur du texte en un bleu écrit en hexadécimal (deux chiffres pour le rouge, deux pour le vert et deux pour le bleu). La seconde règle limite la largeur des paragraphes à `40rem` (le `rem` est une unité qui vaut la taille de la police de la page, 16 pixels par défaut, donc cela fait 640 pixels ; tu la verras en profondeur en 3.2.3) et espace les lignes avec une hauteur de `1.6` fois la taille de la police. Le texte de sortie s'affiche comme sans styles, et c'est la raison pour laquelle, dans ce cours, en plus du texte, on vérifie les valeurs calculées : la couleur de ce `<h1>`, mesurée dans Chrome 154, est `rgb(11, 92, 173)`, qui est le même bleu dans une autre notation.

Il y a trois façons de relier du CSS à une page, et il vaut mieux connaître les trois pour savoir pourquoi on en préfère une :

1. **Une feuille externe**, avec `<link rel="stylesheet" href="styles.css">` dans `<head>`. C'est celle que tu utiliseras dans le tableau de bord. Le navigateur la garde en mémoire et la réutilise dans toutes les pages du site, et le même fichier peut être ouvert et modifié sans toucher au HTML.
2. **Un bloc `<style>`** dans `<head>`, comme ci-dessus. C'est pratique pour une expérience d'une seule page, et c'est pourquoi les figures de cette leçon l'utiliseront. Dans un vrai site, mieux vaut l'éviter, pour une raison de sécurité que tu verras dans la Leçon 11.
3. **L'attribut `style`** placé sur un élément (`<p style="color: red">`). Il a une force particulière dans la cascade, que tu verras tout de suite, et c'est justement pour cela qu'il ne convient presque jamais : il mélange l'apparence avec le contenu et il est très difficile à vaincre sans astuces.

#### 3.1.2 Les sélecteurs dont tu as besoin aujourd'hui

Un sélecteur est une question que le navigateur pose à chaque élément : « est-ce toi ? ». Voici ceux que tu utiliseras dans le tableau de bord, du plus général au plus précis :

- **De type** (par nom d'élément) : `p`, `table`, `h2`. S'applique à tous ceux de ce type.
- **De classe** : `.status`. Le point indique qu'il cherche les éléments dont l'attribut `class` contient ce nom. Un élément peut avoir plusieurs classes séparées par des espaces (`class="status status-down"`), et une classe peut être sur de nombreux éléments. C'est l'outil principal du CSS, et c'est la raison pour laquelle, dans la Leçon 2, tu as mis `class` aux badges.
- **D'identifiant** : `#summary`. Le signe dièse (`#`) cherche l'unique élément avec cet `id`. Un `id` ne peut pas être répété dans une page.
- **D'attribut** : `input[type="search"]`. Crochets : les éléments qui ont cet attribut avec cette valeur.
- **De pseudo-classe** : `a:hover`, `:focus-visible`, `td:last-child`. Les deux-points signalent un **état** ou une **position** de l'élément : quand la souris est dessus, quand le clavier l'a en focus, quand c'est le dernier enfant de son parent.
- **De descendant** : `dl div` (avec une espace). Les éléments `div` qui sont à l'intérieur d'un `dl`, à n'importe quelle profondeur.
- **Liste** : `th, td` (avec une virgule). C'est une abréviation de deux règles avec les mêmes déclarations.

Un sélecteur se lit de droite à gauche : dans `dl div:last-child`, la cible est un `div` qui est dernier enfant, et il ne compte que s'il est en plus à l'intérieur d'un `dl`. Les sélecteurs peuvent se combiner sans espace : `p.alert` est un `<p>` qui a en plus la classe `alert`.

#### 3.1.3 Quand deux règles entrent en conflit : la cascade

Voici le concept central de la leçon. Il n'y a presque jamais une seule règle sur un élément. Il y a la feuille du navigateur, ta feuille, une autre règle plus bas dans ta feuille, et parfois un attribut `style`. Quand plusieurs règles donnent des valeurs différentes à la même propriété du même élément, le navigateur doit en choisir une. Le mot *cascade* de « feuilles de style en cascade » (CSS, d'après le sigle anglais) est le nom de l'algorithme avec lequel il choisit. Ce n'est ni de la magie ni du hasard : ce sont des étapes, dans un ordre fixe qui est [écrit dans la spécification](https://www.w3.org/TR/css-cascade-5/), et la première qui départage décide.

Voici la liste, résumée et dans l'ordre où elle s'applique. Pour chaque propriété de chaque élément, le navigateur :

1. **Écarte les règles qui ne s'appliquent pas** : celles qui ne sélectionnent pas cet élément ou qui portent une valeur invalide.
2. **Compare l'origine et l'importance.** Il y a trois origines : la feuille du navigateur, celle de l'utilisateur (préférences du lecteur, que presque personne n'utilise) et la tienne, celle de l'auteur. Entre déclarations normales, celle de l'auteur l'emporte. Avec `!important`, l'ordre s'inverse, pour que le lecteur ayant des besoins particuliers puisse vaincre l'auteur.
3. **Compare les styles de l'attribut `style`.** Une déclaration placée dans l'attribut `style` l'emporte sur celles qui viennent des feuilles, quelle que soit leur spécificité.
4. **Compare les couches** (`@layer`), un mécanisme que tu verras en 3.1.5. Entre déclarations normales, celles qui sont dans une couche déclarée plus tard l'emportent sur celles d'une couche antérieure ; et celles qui ne sont dans aucune couche l'emportent sur toutes celles qui en ont une. Avec `!important`, cet ordre s'inverse, comme avec les origines.
5. **Compare la spécificité** du sélecteur, qui est le sujet de la sous-section suivante.
6. **Si tout ce qui précède est à égalité, la dernière l'emporte.** La règle qui apparaît le plus bas dans la feuille.

Deux choses comptent dans cette liste. **Première : l'ordre des règles est le dernier critère, pas le premier.** Beaucoup de gens croient que « la dernière règle l'emporte » et sont déconcertés quand cela n'arrive pas. La dernière ne l'emporte que lorsque les critères précédents étaient à égalité. **Seconde : chaque étape décide entièrement.** Si une étape donne un gagnant, les suivantes ne sont même pas regardées ; une règle avec dix identifiants dans son sélecteur ne peut pas vaincre une déclaration avec `!important`.

#### 3.1.4 Spécificité : compter avec trois chiffres

La spécificité est la cinquième étape, celle qui décide presque toujours. C'est une mesure de **la précision d'un [sélecteur](https://www.w3.org/TR/selectors-4/#specificity)**, et elle se calcule avec trois chiffres qui s'écrivent (A, B, C) :

- **A** compte les identifiants (`#summary`).
- **B** compte les classes, les attributs et les pseudo-classes (`.status`, `[type="search"]`, `:hover`, `:last-child`).
- **C** compte les types d'élément (`p`, `table`) et les pseudo-éléments (`::before`).

Le sélecteur universel `*` n'ajoute rien. Et on compare les chiffres **de gauche à droite, un par un, pas comme un nombre à trois chiffres** : d'abord A ; s'ils sont à égalité, B ; s'ils sont à égalité, C. Un seul identifiant (1,0,0) l'emporte sur n'importe quel nombre de classes, même mille, parce que A se compare en premier. C'est pourquoi le navigateur voit `#summary` comme bien plus fort que `.status`.

Quelques exemples, avec leur compte :

| Sélecteur | Compte (A, B, C) | Pourquoi |
|---|---|---|
| `p` | (0, 0, 1) | un type |
| `.alert` | (0, 1, 0) | une classe |
| `p.alert` | (0, 1, 1) | une classe et un type |
| `a:hover` | (0, 1, 1) | une pseudo-classe et un type |
| `input[type="search"]` | (0, 1, 1) | un attribut et un type |
| `dl div:last-child` | (0, 1, 2) | une pseudo-classe et deux types |
| `#summary dd` | (1, 0, 1) | un identifiant et un type |
| `:where(.card) p` | (0, 0, 1) | `:where()` vaut toujours zéro |

La dernière ligne mérite une explication. `:where()` et `:is()` sont des pseudo-classes qui reçoivent une liste de sélecteurs. La différence entre elles est justement leur spécificité : **[`:where()`](https://developer.mozilla.org/fr/docs/Web/CSS/Reference/Selectors/:where) vaut toujours zéro** et `:is()` prend celle du plus spécifique de ses arguments. Avec `:where()` tu peux écrire un style de base que n'importe qui écrase sans effort. Tu t'en serviras pour cela, plus tard, et tu la vois en usage dans le premier exercice.

Voyons tout ensemble. La page suivante a quatre paragraphes et cinq règles de couleur qui se les disputent :

```html
<!-- fig03_02.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>¿Quién gana?</title>
  <style>
    p { color: dimgray; }
    .alert { color: saddlebrown; }
    p.alert { color: crimson; }
    #three, #four { color: royalblue; }
    p { color: black; }
  </style>
</head>
<body>
  <main>
    <h1>¿Quién gana?</h1>
    <p>Uno: solo el nombre del elemento.</p>
    <p class="alert">Dos: con una clase.</p>
    <p class="alert" id="three">Tres: con clase e identificador.</p>
    <p class="alert" id="four" style="color: darkgreen">Cuatro: con el atributo style.</p>
  </main>
</body>
</html>
```

```text
¿Quién gana?
Uno: solo el nombre del elemento.
Dos: con una clase.
Tres: con clase e identificador.
Cuatro: con el atributo style.
```

Avant de lire la réponse, fais ton propre pari avec les deux listes ci-dessus. J'ai mesuré les couleurs calculées dans Chrome 154 et voici ce qui est sorti :

- **Un** est noir (`rgb(0, 0, 0)`). Seules s'appliquent `p { dimgray }` et `p { black }`. Les deux ont la même spécificité, (0,0,1), donc c'est l'ordre qui décide et la dernière l'emporte : noir. C'est le cas où « la dernière l'emporte » est vrai.
- **Deux** est cramoisi (`rgb(220, 20, 60)`). Trois règles s'appliquent : `p` (0,0,1), `.alert` (0,1,0) et `p.alert` (0,1,1). Celle de plus grande spécificité l'emporte, `p.alert`, **bien qu'elle soit avant `p { black }`**. L'ordre n'est pas regardé, parce que l'étape précédente a déjà départagé.
- **Trois** est bleu roi (`rgb(65, 105, 225)`). Son identifiant donne (1,0,0) et l'emporte sur toutes les règles précédentes.
- **Quatre** est vert foncé (`rgb(0, 100, 0)`). Il a le même identifiant que le trois, mais l'attribut `style` se compare avant la spécificité, et il l'emporte. C'est le cas qu'annonçait la section 3.1.1 : c'est pourquoi un `style` placé dans le HTML est si difficile à vaincre depuis la feuille.

Il y a un compte que tu devrais faire de tête en voyant ce résultat : **l'élément Trois a cinq règles de couleur qui le sélectionnent (les deux de `p`, `.alert`, `p.alert` et celle de l'identifiant), et celle qui a gagné est celle qui ressemble le moins à « la dernière que j'ai écrite ».** Si tu ne comprends pas l'ordre de la liste, le seul outil qui te reste est d'augmenter la force, et la force ne peut augmenter que jusqu'à un certain point.

#### 3.1.5 Couches : la sortie propre

Les couches (`@layer`) existent pour le moment où les critères de spécificité deviennent un obstacle. Une couche est un groupe nommé de règles ; tu déclares l'**ordre des couches** une fois, et entre couches c'est cet ordre qui commande, **sans regarder la spécificité**.

```html
<!-- fig03_03.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Capas</title>
  <style>
    @layer base, components, overrides;

    @layer base {
      a { color: gray; }
    }
    @layer components {
      .link { color: green; }
    }
    @layer overrides {
      a { color: blue; }
    }
    .plain { color: purple; }
  </style>
</head>
<body>
  <main>
    <h1>Capas</h1>
    <p><a href="#uno" class="link">Un enlace con clase, en la capa components</a></p>
    <p><a href="#dos">Un enlace sin clase</a></p>
    <p><a href="#tres" class="plain">Un enlace con una regla sin capa</a></p>
  </main>
</body>
</html>
```

```text
Capas
Un enlace con clase, en la capa components
Un enlace sin clase
Un enlace con una regla sin capa
```

La première ligne du bloc `<style>` déclare l'ordre : `base`, puis `components`, puis `overrides`. La dernière couche l'emporte. Regarde le premier lien : le sélecteur `.link` a une spécificité (0,1,0) et le sélecteur `a` de la couche `overrides` seulement (0,0,1) ; dans une feuille sans couches, `.link` l'emporterait. Ici c'est `a` qui l'emporte, et le lien est bleu (`rgb(0, 0, 255)`), parce que sa couche vient après. Le deuxième lien est aussi bleu. Le troisième est violet : `.plain` n'est dans aucune couche, et les déclarations normales **sans couche l'emportent sur toutes celles qui en ont une**.

C'est ce qui rend les couches utiles. Tu peux ordonner ta feuille dans l'ordre où tu veux que les choses l'emportent (une réinitialisation au début, puis les styles du corps, puis les composants), et la spécificité ne compte qu'à l'intérieur de chaque couche. Personne n'a besoin d'un `!important` pour vaincre une règle qui est dans une couche antérieure. Et la règle sans couche est la porte de secours : si quelqu'un écrit une feuille sans couches, elle l'emporte sur tout. Tout cela vaut pour les déclarations normales ; [la spécification](https://www.w3.org/TR/css-cascade-5/#cascade-layering) inverse l'ordre pour celles qui portent `!important` : parmi elles c'est la **première** couche qui l'emporte, et une déclaration `!important` dans une couche vainc une `!important` sans couche. C'est une raison de plus de ne pas l'utiliser : il brise l'intuition que le dernier commande.

Les couches sont disponibles de façon générale dans les navigateurs depuis mars 2022 ; [le site de référence de Mozilla](https://developer.mozilla.org/fr/docs/Web/CSS/Reference/At-rules/@layer) les marque comme « Widely available » (« largement disponible »). Le tableau de bord d'aujourd'hui les utilise.

#### 3.1.6 L'héritage : ce qui n'a pas besoin de règle

Il manque une pièce, et c'est celle qui explique pourquoi un élément a parfois un style sans qu'aucune règle ne lui parle. Certaines propriétés **[s'héritent](https://developer.mozilla.org/fr/docs/Web/CSS/Guides/Cascade/Inheritance)** : si un élément n'a pas de valeur propre, il prend celle de son parent. La couleur du texte, la police, la taille et la hauteur de ligne s'héritent. D'autres non : la marge, la marge intérieure, la bordure et le fond sont propres à chaque élément, et ne passent pas à leurs enfants (si la bordure s'héritait, chaque paragraphe à l'intérieur d'une carte aurait son propre cadre).

```html
<!-- fig03_04.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Herencia</title>
  <style>
    article {
      color: darkgreen;
      font-style: italic;
      border: 2px solid black;
      padding: 1rem;
    }
  </style>
</head>
<body>
  <main>
    <h1>Herencia</h1>
    <article>
      <p>Este párrafo hereda el color y la cursiva, pero no el borde.</p>
      <p><label>Un campo: <input type="text" value="no hereda la fuente"></label></p>
    </article>
  </main>
</body>
</html>
```

```text
Herencia
Este párrafo hereda el color y la cursiva, pero no el borde.
Un campo:
```

Je l'ai mesuré dans Chrome 154. Le paragraphe a la couleur vert foncé et l'italique de l'`<article>` (il les hérite), et sa bordure est de `0px` : il ne l'a pas héritée. Le libellé, qui est un élément de texte, hérite aussi du vert. Et le champ de texte, non : sa couleur calculée est noire et son italique est `normal`. Un champ de formulaire n'hérite pas de son parent la police ni la couleur parce que la feuille de style du navigateur leur donne des valeurs propres. Sur ma machine, le champ utilisait Arial à 13.33 px tandis que le paragraphe utilisait 16 px ; les valeurs exactes dépendent du système d'exploitation, mais la différence existe partout. C'est la raison pour laquelle le tableau de bord apporte la règle `font: inherit` pour ses champs et ses boutons : sans elle, le champ de recherche semble venir d'une autre page.

Il y a quatre mots qui laissent commander à la main l'héritage : `inherit` (prend la valeur du parent, même si la propriété ne s'hérite normalement pas), `initial` (la valeur initiale de la spécification), `unset` (hérite si la propriété est héritable, et sinon utilise l'initiale) et `revert` (défait les styles de l'auteur et revient à la valeur que mettrait l'origine précédente : la feuille de l'utilisateur si elle existe, et sinon celle du navigateur). Parmi elles, `inherit` est celle que tu utiliseras.

Et un avertissement sur l'ordre dans lequel tout se passe. **L'héritage est ce qu'il y a de plus faible** : une valeur héritée perd contre n'importe quelle règle qui cible l'élément, même faible. C'est pourquoi `* { color: black }`, avec sa spécificité zéro, casse la couleur héritée de tout le document : il « parle » directement à chaque élément.

#### 3.1.7 Le `!important` et comment on en arrive à en avoir besoin

La déclaration [`!important`](https://developer.mozilla.org/fr/docs/Web/CSS/Reference/Values/important) va à la fin d'une valeur (`color: red !important;`) et change son étape dans la cascade : elle passe dans un groupe qui l'emporte sur toutes les déclarations normales, avec n'importe quel sélecteur. C'est un outil de secours avec un cas d'usage légitime, qui est la feuille de style d'un utilisateur qui a besoin de grandes lettres. Pour celui qui écrit une feuille d'auteur, c'est presque toujours le signe d'un conflit non compris.

Le chemin vers la guerre des `!important` est toujours le même. Une règle ne l'emporte pas ; on augmente sa spécificité ; celle d'une autre règle voisine augmente ; quelqu'un ajoute un `!important` ; la règle qui devait le vaincre a besoin d'un autre `!important` ; et à partir de là chaque changement en exige un de plus. La sortie n'est pas d'augmenter la force, mais de la **baisser** : écrire des sélecteurs avec la spécificité la plus basse qui fonctionne et laisser l'ordre, les couches et `:where()` faire le travail. Dans le quatrième exercice tu as une feuille avec ce problème à défaire.

Un outil te rend cela bien plus facile : **l'[inspecteur du navigateur](https://developer.chrome.com/docs/devtools/css)**. Fais un clic droit sur n'importe quel élément et choisis « Examiner ». Dans le volet des styles, tu verras toutes les règles qui s'y appliquent, dans l'ordre où la cascade les évalue, et celles qui ont perdu apparaissent **barrées**. Dans le volet des valeurs calculées (*Computed*), tu verras la valeur finale de chaque propriété et, en la dépliant, quelle règle l'a posée. Quand une règle « n'obéit pas », la réponse est presque toujours là, à deux clics.

### 3.2 Chaque élément est une boîte

#### 3.2.1 Les quatre couches d'une boîte

Pour le CSS, tout élément est une boîte rectangulaire. Cette boîte a quatre zones imbriquées, de l'intérieur vers l'extérieur :

- **Le contenu** : le texte ou les éléments enfants.
- **La marge intérieure** (*padding*) : espace entre le contenu et la bordure. Elle fait partie de la boîte et prend son fond.
- **La bordure** (*border*) : une ligne autour de la marge intérieure.
- **La marge** (*margin*) : espace entre cette bordure et la boîte voisine. Elle est transparente et ne prend pas de fond.

Et il y a une question qui décide si ta page mesure ce que tu as écrit : quand tu écris `width: 300px`, cette largeur est-elle celle du contenu, ou celle de la boîte avec marge intérieure et bordure ? La réponse historique, qui reste celle que le navigateur applique si personne ne lui dit autre chose, est **celle du contenu**. (Il y a des exceptions dans la feuille du navigateur lui-même : je l'ai mesuré dans Chrome 154, et les boutons, les listes déroulantes `<select>`, les champs de recherche et les tableaux apportent déjà `border-box` ; un champ de texte normal ou un `<div>`, non.) Cela s'appelle [`box-sizing: content-box`](https://developer.mozilla.org/fr/docs/Web/CSS/Reference/Properties/box-sizing). Avec elle, la marge intérieure et la bordure s'**ajoutent** à l'extérieur :

```html
<!-- fig03_05.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Cajas</title>
  <style>
    .box {
      width: 300px;
      padding: 20px;
      border: 5px solid black;
      margin: 10px;
      background: #cfe2ff;
    }
    .border-box {
      box-sizing: border-box;
    }
  </style>
</head>
<body>
  <main>
    <h1>Cajas</h1>
    <div class="box">Caja con content-box (lo normal sin reglas)</div>
    <div class="box border-box">Caja con border-box</div>
  </main>
</body>
</html>
```

```text
Cajas
Caja con content-box (lo normal sin reglas)
Caja con border-box
```

Les deux boîtes ont la même règle de largeur, `width: 300px`. Le compte de la première, avec `content-box` : 300 de contenu, plus 20 de marge intérieure de chaque côté (40), plus 5 de bordure de chaque côté (10) : **350 pixels de largeur totale**. Celui de la seconde, avec `box-sizing: border-box`, la largeur de 300 **inclut** déjà la marge intérieure et la bordure, et le contenu garde ce qui reste : 300 − 40 − 10 = **250**. Je l'ai mesuré dans Chrome 154 : la première mesure 350 pixels de large et la seconde 300. La propriété `width` calculée vaut `300px` dans les deux ; ce qui change, c'est ce qu'elle signifie.

Imagine maintenant le problème réel. Tu as une carte dans une colonne de 500 pixels, et tu lui mets `width: 100%` pour qu'elle remplisse la colonne, 16 pixels de marge intérieure pour que le texte respire et une bordure de 2 pixels. Avec `content-box`, la carte mesure 500 de contenu + 32 de marge intérieure + 4 de bordure = 536 pixels : **elle déborde de sa colonne de 36 pixels**, et une barre de défilement horizontale apparaît. Le débutant résout cela par essais et erreurs. Celui qui connaît la boîte le résout avec une ligne.

La ligne est `box-sizing: border-box`, et c'est l'habitude de presque tout le CSS professionnel : avec elle, la largeur que tu écris est la largeur que tu vois, et la marge intérieure et la bordure se retranchent du contenu par l'intérieur. Elle s'écrit une seule fois, pour tous les éléments, et apparaît dans la première couche du tableau de bord :

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

Trois sélecteurs séparés par une virgule : tous les éléments et les deux pseudo-éléments que le CSS peut insérer avant et après le contenu de chacun. On les inclut pour qu'aucune boîte générée n'échappe au critère.

Pour voir la boîte de n'importe quel élément, l'inspecteur a un diagramme : dans Chrome, dans le volet des valeurs calculées ; dans Firefox, dans l'[onglet « Mise en page »](https://firefox-source-docs.mozilla.org/devtools-user/page_inspector/how_to/examine_and_edit_the_box_model/index.html). C'est un rectangle dans un autre avec les quatre épaisseurs annotées. **Quand une boîte ne mesure pas ce que tu attends, ne retranche pas de pixels : ouvre le diagramme et regarde laquelle des quatre zones est en trop.**

#### 3.2.2 Bloc, en ligne et les marges qui fusionnent

Il y a une seconde règle qui explique des cas déconcertants : toutes les boîtes ne se comportent pas pareil. La propriété [`display`](https://developer.mozilla.org/fr/docs/Web/CSS/Reference/Properties/display) décide comment une boîte se place par rapport à ses voisines. Trois valeurs expliquent la plupart des cas d'aujourd'hui :

- **`block`** : la boîte occupe une ligne entière. Elle accepte `width` et `height`, et ses quatre marges. Ainsi sont les paragraphes, les titres, les sections, les tableaux.
- **`inline`** : la boîte coule à l'intérieur d'une ligne de texte, comme un mot. **Elle ignore `width` et `height`** et ses marges verticales. Ainsi sont les `<span>`, les liens et les balises `<strong>`.
- **`inline-block`** : elle coule comme un mot, mais se laisse dimensionner comme un bloc. C'est ce dont a besoin un badge.

```html
<!-- fig03_06.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Display</title>
  <style>
    .sample {
      width: 200px;
      height: 40px;
      background: #cfe2ff;
    }
    .as-block { display: block; }
    .as-inline { display: inline; }
    .as-inline-block { display: inline-block; }
  </style>
</head>
<body>
  <main>
    <h1>Display</h1>
    <span class="sample as-block">block</span>
    <span class="sample as-inline">inline</span>
    <span class="sample as-inline-block">inline-block</span>
  </main>
</body>
</html>
```

```text
Display
block
inline inline-block
```

Les trois `<span>` ont la même règle `width: 200px; height: 40px;`. Je l'ai mesuré : le `block` et l'`inline-block` mesurent 200 × 40. L'`inline` mesure **36 × 18** : sa largeur et sa hauteur viennent du texte « inline », parce qu'une boîte en ligne voit ses dimensions ignorées. Si un jour tu écris un `width` et qu'il « ne fait rien », regarde d'abord le `display` de l'élément. Le `<span class="status">` du tableau de bord a besoin de marge intérieure sur les côtés et de coins arrondis, et c'est pourquoi on déclare `display: inline-block`.

L'autre bizarrerie des boîtes, ce sont les marges. Quand deux blocs sont l'un au-dessus de l'autre et que celui du haut a une marge inférieure et celui du bas une marge supérieure, l'espace entre eux **n'est pas la somme des deux** : les marges **fusionnent** et la plus grande reste.

```html
<!-- fig03_07.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Márgenes</title>
  <style>
    .first  { margin: 0 0 20px; background: #cfe2ff; }
    .second { margin: 30px 0 0;  background: #d1e7dd; }
  </style>
</head>
<body>
  <main>
    <h1>Márgenes</h1>
    <p class="first">Primer párrafo: margen inferior de 20 px.</p>
    <p class="second">Segundo párrafo: margen superior de 30 px.</p>
  </main>
</body>
</html>
```

```text
Márgenes
Primer párrafo: margen inferior de 20 px.
Segundo párrafo: margen superior de 30 px.
```

Si les marges s'additionnaient, il y aurait 50 pixels entre les deux paragraphes. Je l'ai mesuré : il y en a **30**. Cela s'appelle la *[fusion des marges](https://developer.mozilla.org/fr/docs/Web/CSS/Guides/Box_model/Margin_collapsing)* et ne se produit qu'entre marges **verticales** de blocs voisins (et entre un bloc et son premier enfant, quand il n'y a ni marge intérieure ni bordure qui les sépare). La marge intérieure ne fusionne jamais, et les éléments à l'intérieur d'un conteneur flexible ou d'une grille, que tu verras dans la Leçon 4, non plus. Si ton espace vertical ne s'additionne pas, c'est cela. L'habitude qui l'évite est d'écrire les marges dans une seule direction (par exemple, toutes vers le bas) et de laisser la fusion travailler de ton côté.

#### 3.2.3 Unités : pixels, rem et pourcentages

Pour écrire une taille, tu dois choisir une unité, et ce choix a des conséquences d'accessibilité qui ne se voient pas sur l'écran de celui qui programme.

- **`px`** est un pixel CSS. C'est une mesure fixe. Utilise-la pour ce qui ne doit pas grandir avec le texte : une bordure de 1 px, une ombre.
- **[`rem`](https://developer.mozilla.org/fr/docs/Web/CSS/Reference/Values/length)** est la taille de la police de la racine du document. Par défaut les navigateurs la fixent à 16 px, donc `1rem` fait 16 px et `2rem` fait 32. La différence avec `px` est celle qui compte : **le lecteur peut changer sa taille de police préférée dans la configuration du navigateur**, et tout ce qui est écrit en `rem` grandit avec elle, tandis que ce qui est écrit en `px` non. Il lui reste le zoom de la page (Ctrl et +), qui agrandit tout, y compris les `px`, et que les recommandations acceptent comme manière de se conformer ; mais celui qui a déjà fixé sa taille de police préférée pour lire sur tous les sites voit que ta page l'ignore, et doit zoomer sur elle chaque fois. C'est pourquoi le tableau de bord écrit ses tailles de police et presque tous ses espacements en `rem`. C'est le critère que les recommandations d'accessibilité appellent redimensionner le texte ([WCAG 1.4.4](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html)).
- **`%`** est un pourcentage du conteneur : `width: 100%` veut dire « aussi large que mon parent ».
- **`ch`** est la largeur du chiffre zéro dans la police courante. Il sert à limiter la largeur d'un texte : au-delà d'environ 75 caractères par ligne, l'œil se perd en sautant à la suivante.

Encore une ligne sur la hauteur de ligne. On écrit `line-height: 1.6`, **sans unité** : un nombre seul signifie « 1.6 fois la taille de la police de chaque élément », et les enfants l'héritent comme multiplicateur. Avec une unité (`1.6rem`), il s'hérite comme une quantité fixe, et un grand titre aurait ses lignes collées.

### 3.3 Variables : chaque décision, une seule fois

#### 3.3.1 Propriétés personnalisées

Imagine que le bleu du tableau de bord apparaisse dans le titre, dans les liens, dans le bouton, dans le contour du focus. Cela fait quatre endroits. Le jour où quelqu'un dit « plutôt un bleu plus foncé », ou « le client veut du vert », tu dois trouver les quatre et les changer sans en oublier aucun. Le CSS résout cela avec les **[propriétés personnalisées](https://developer.mozilla.org/fr/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties)**, qu'on connaît sous le nom de **variables**.

Une variable est une propriété dont le nom est **inventé par toi** et commence toujours par deux tirets. Elle se déclare dans une règle, et s'utilise avec la fonction `var()` :

```css
:root {
  --color-accent: #0b5cad;
}

a {
  color: var(--color-accent);
}

button {
  background: var(--color-accent);
}
```

`:root` est la pseudo-classe qui sélectionne la racine du document (l'élément `<html>`), et on l'utilise comme lieu canonique des variables globales. Les variables **s'héritent**, comme la couleur : une variable déclarée dans `:root` est disponible dans tout le document, et une variable déclarée dans un élément est disponible en lui et dans ses descendants. C'est ce qu'on utilise pour l'astuce qui fait fonctionner les badges du tableau de bord, que tu verras dans un instant.

Il y a une discipline de nommage qui vaut plus que tout autre conseil : **le nom dit à quoi sert la variable, pas à quoi elle ressemble.** `--color-accent` est un bon nom ; `--blue` est un piège, parce que le jour où l'accent sera vert, la variable `--blue` vaudra vert et personne ne comprendra le code. Pareil avec `--color-down-text` pour le texte de l'état en panne, ou `--space-3` pour un espacement. Une variable est une **décision** avec un nom.

Et trois variables qui méritent une explication à part sont celles du badge. Remarque comment se résout la couleur des deux badges, le vert de « Disponible » et le rouge de « Caído » (« en panne »), avec une seule règle :

```css
.status {
  background: var(--badge-bg);
  color: var(--badge-text);
}

.status-available {
  --badge-bg: var(--color-available-bg);
  --badge-text: var(--color-available-text);
}

.status-down {
  --badge-bg: var(--color-down-bg);
  --badge-text: var(--color-down-text);
}
```

La règle `.status` sait **comment** on dessine un badge, mais pas de quelle couleur ; les deux classes suivantes disent seulement **de quelle couleur**, en changeant deux variables. Grâce à l'héritage des variables, `.status` les voit. Cette façon d'écrire a un avantage que tu remarqueras : ajouter un troisième état à l'avenir, c'est ajouter une classe de trois lignes, sans toucher à la règle du badge. Une note : un badge qui n'a que la classe `status` et aucune des deux autres reste sans couleur de fond, parce que les variables qu'il utilise n'existent pas. C'est le comportement correct et on le verra dans la section des erreurs.

#### 3.3.2 Typographie et espace

Les variables ne sont pas que pour les couleurs. Le tableau de bord déclare son échelle d'espacements (`--space-1` à `--space-5`, d'un quart de `rem` à deux et demi) et sa famille de police :

```css
--font-body: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
```

Une liste de familles se lit de gauche à droite comme « utilise la première qui existe, et sinon la suivante ». [`system-ui`](https://developer.mozilla.org/fr/docs/Web/CSS/Reference/Properties/font-family) demande la police avec laquelle le système d'exploitation dessine ses propres menus, qui est la plus lisible sur chaque plateforme et ne se télécharge de nulle part. Les autres sont les noms de la police système de chaque plateforme, au cas où le navigateur ne comprendrait pas `system-ui`, et la dernière, `sans-serif`, est une famille générique, qui est le filet de sécurité. Il n'est pas nécessaire de télécharger de police pour commencer.

L'**échelle** d'espaces a un but qui n'est pas esthétique. Quand chaque espacement du tableau de bord sort des mêmes cinq mesures, la page a un rythme, et quand quelqu'un veut plus d'air, il change une mesure et tout s'ajuste. Les hauteurs de ligne (`1.6` pour le corps et `1.2` pour les titres, qui sont courts) ferment le système.

Une petite propriété qui fait la différence dans un tableau de nombres : [`font-variant-numeric: tabular-nums`](https://developer.mozilla.org/fr/docs/Web/CSS/Reference/Properties/font-variant-numeric). Avec elle, tous les chiffres occupent la même largeur, donc `120 ms` et `950 ms` s'alignent chiffre par chiffre. C'est ce qui permet de comparer d'un coup d'œil une colonne de temps. Le tableau de bord l'applique à la colonne des temps avec `text-align: right`.

#### 3.3.3 Contraste et focus : ce qui se mesure

Les recommandations d'accessibilité (WCAG 2.2) demandent que le texte normal ait un rapport de contraste d'**au moins 4.5 à 1** contre son fond ([critère 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)), et que les composants de l'interface et l'indicateur de focus atteignent **3 à 1** (1.4.11). Le rapport se calcule avec une formule sur la luminosité des deux couleurs, et tu n'as pas à l'apprendre : le sélecteur de couleur des outils du navigateur le calcule, et il existe des vérificateurs en ligne comme [celui de WebAIM](https://webaim.org/resources/contrastchecker/). Ce dont tu as besoin, c'est de l'habitude de **mesurer avant de choisir**. Voici les chiffres des couleurs du tableau de bord, que j'ai calculés avec la formule du W3C :

| Combinaison | Contraste | Minimum |
|---|---|---|
| Texte principal sur le fond blanc | 16.56 : 1 | 4.5 |
| Texte atténué (`--color-muted`) sur blanc | 6.39 : 1 | 4.5 |
| Texte atténué sur le fond de la page | 6.00 : 1 | 4.5 |
| Liens et bouton sur blanc | 6.67 : 1 | 4.5 |
| Lettres blanches du bouton sur l'accent | 6.67 : 1 | 4.5 |
| Badge « Disponible » | 7.21 : 1 | 4.5 |
| Badge « Caído » | 7.08 : 1 | 4.5 |
| Bordure du champ de recherche sur blanc | 4.55 : 1 | 3 |
| Anneau du focus sur blanc | 6.67 : 1 | 3 |

Un chiffre est une décision qu'on peut réviser. « Ça a l'air bien », non.

Il y a un second critère sur la couleur, et c'est que **la couleur ne peut pas être la seule façon de communiquer quelque chose** ([WCAG 1.4.1, « Utilisation de la couleur »](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)). Le badge rouge de « Caído » se distingue du vert pour celui qui voit les couleurs, mais une personne atteinte de daltonisme rouge-vert peut ne pas distinguer ces deux-là. C'est pourquoi le badge porte en plus du **texte** (« Caído ») : il le dit avec des mots, et la couleur ne fait que renforcer. Cette décision, tu l'as déjà prise dans la Leçon 2 en écrivant « Caído » dans le `<span>`. Le CSS l'améliore sans la changer.

Et le focus. Dans la leçon précédente tu as fait l'essai de la touche Tab ; mais le navigateur te montrait le focus avec son anneau par défaut. Il est courant, dans la feuille d'un débutant, de trouver `outline: none` pour « enlever ce vilain contour ». C'est une erreur qui a un coût : celui qui navigue au clavier ne sait plus où il est. Le critère des recommandations est que le focus soit visible ([WCAG 2.4.7](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html)). L'outil correct est la pseudo-classe **[`:focus-visible`](https://developer.mozilla.org/fr/docs/Web/CSS/Reference/Selectors/:focus-visible)**, qui sélectionne un élément en focus **quand le navigateur estime que le focus doit être montré** : au clavier oui, et en cliquant à la souris sur un bouton, normalement non. Ainsi tu peux donner un contour propre, visible et ferme, sans gêner celui qui utilise la souris. Elle est disponible de façon générale dans les navigateurs depuis mars 2022.

## Exemple résolu : le tableau de bord lisible

Tu as maintenant les trois idées. Voici la feuille du tableau de bord complet ; parcours-la par couches, car c'est ainsi qu'elle est écrite.

```css
/* fig03_08/styles.css */

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

Et la page, qui est celle de la Leçon 2 avec une seule nouvelle ligne dans `<head>` : le lien vers la feuille. Dans le dépôt la feuille vit dans `fig03_08/styles.css` ; dans ton projet, enregistre-la sous `css/styles.css`, dans le dossier `css` que tu as créé dans l'Exercice 1 de la Leçon 1, et écris `href="css/styles.css"`.

```html
<!-- fig03_08.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Revisor de servicios</title>
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="fig03_08/styles.css">
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

Le texte est le même que dans la Leçon 2, et c'est ce qu'il faut : le CSS ne change pas ce que dit la page, seulement la façon dont elle est dessinée. Ouvre la page sur ton serveur local et observe ce qui a changé. Les décisions, une par une :

- **Trois couches dans l'ordre :** `reset` (la boîte et les polices des contrôles), `base` (variables, corps, titres, liens, focus) et `components` (sections, récapitulatif, contrôles, tableau, badges). Comme chaque règle vit dans une couche et qu'entre couches c'est l'ordre qui commande, **il n'y a pas un seul `!important` et aucun des sélecteurs n'a besoin d'être particulièrement spécifique**. Si demain quelqu'un écrit une règle sans couche, celle-là l'emporte sur tout : c'est la porte de secours, et c'est pourquoi on l'écrit avec intention.
- **Toutes les décisions, dans `:root` :** couleurs, espacements, police. Le reste de la feuille ne contient pas une seule couleur écrite en hexadécimal ; tout sort de `var()`. Pour changer le bleu du tableau de bord entier, on change une ligne. C'est l'exercice 3.
- **`margin: 0 auto` avec `max-width: 60rem` :** le contenu a une largeur maximale confortable, et `auto` dans les marges latérales répartit l'espace restant des deux côtés. C'est la façon de centrer un bloc ayant une largeur.
- **`:focus-visible` :** un anneau de 3 pixels dans la couleur d'accent, séparé de 2 pixels de l'élément. Appuie sur Tab : l'anneau apparaît sur le lien, sur le champ, sur le groupe de boutons radio et sur le bouton. Je l'ai vérifié dans Chrome : le bouton en focus au clavier a un contour `solid` de `3px` et de couleur `rgb(11, 92, 173)`.
- **Le tableau :** `border-collapse: collapse` réunit les bordures des cellules en une seule ligne (par défaut chaque cellule dessine les siennes, avec un trou entre elles). Les cellules portent une marge intérieure pour respirer, et les lignes se limitent au bas de chaque rangée.
- **Les nombres :** `th:last-child, td:last-child` sélectionne la dernière cellule de chaque ligne, qui est celle des temps, et l'aligne à droite avec des chiffres tabulaires. Remarque que le `<th>` du nom de ligne n'est pas touché : c'est le premier enfant de sa ligne, pas le dernier.
- **Les badges :** une règle, deux variantes, et le texte est toujours là : la couleur ne fait que renforcer ce que dit le mot.
- **Le bouton :** il mesure au moins `2.5rem` de haut (40 pixels avec la police de 16), au-dessus du minimum de 24 × 24 que demandent les recommandations pour les cibles tactiles ([WCAG 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)). Le champ de recherche mesure aussi 40.

Et un compte honnête avant de conclure. Avec le navigateur à 1000 pixels de large, le tableau de bord est bien. **Si tu le réduis à 320 pixels, qui est la largeur d'un petit téléphone, une barre de défilement horizontale apparaît** : j'ai mesuré que le document fait 414 pixels de large sur une fenêtre de 320. Le tableau avec ses trois colonnes ne tient pas. Ce n'est pas un oubli de cette leçon : c'est le sujet de la suivante. Aujourd'hui le tableau de bord est lisible ; dans les leçons 4 et 5 il se dispose et devient adaptable.

## L'erreur que tu vas voir

Le navigateur n'affiche pas d'erreurs de CSS. Si tu écris mal une propriété ou une valeur, il **ignore simplement la déclaration** et continue. Cela rend les erreurs de CSS silencieuses, et c'est pourquoi on les cherche d'habitude là où elles se manifestent (« pourquoi mon titre n'est-il pas bleu ? ») et non là où elles sont nées. Pour les voir il y a deux instruments : le validateur de CSS du W3C, et l'inspecteur du navigateur, où une déclaration invalide apparaît barrée ou marquée.

Cette page a quatre erreurs de syntaxe et une variable mal écrite :

```html
<!-- fig03_09.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Estilos que no hacen caso</title>
  <style>
    h1 {
      colour: navy;
    }
    p {
      color: #12;
    }
    table {
      width: 100 px;
    }
    .status {
      padding: 0.25rem 0.5rem
      border-radius: 999px;
    }
    .note {
      color: var(--color-textt);
    }
  </style>
</head>
<body>
  <main>
    <h1>Estilos que no hacen caso</h1>
    <p>Ninguna de estas reglas hace lo que el autor quería.</p>
    <p class="note">Este párrafo usa una variable que no existe.</p>
  </main>
</body>
</html>
```

Le [validateur de CSS du W3C](https://jigsaw.w3.org/css-validator/) vit à `https://jigsaw.w3.org/css-validator/` et accepte un fichier, une adresse ou le texte collé. Voici ce qu'il répond sur le bloc de styles ci-dessus (copié du résultat réel) :

```text
Line : 3 h1
       Property “colour” doesn't exist. The closest matching property name is “color” : 
       navy
Line : 6 p
       (Value Error : color (nullcolors.html#propdef-color))
       “#12” is not a valid color 3 or 6 hexadecimals numbers : 
Line : 9 table
       (Value Error : width (nullvisudet.html#propdef-width))
       Too many values or values are not recognized : 
Line : 13 .status
       (Value Error : padding (nullbox.html#propdef-padding))
       Missing a semicolon before the property name “border-radius”
```

Chaque message donne la ligne du fichier et le sélecteur où cela se produit. Un par un :

1. **`colour` n'existe pas.** L'orthographe britannique de « color ». Et le message te dit quelle est la propriété que tu voulais écrire. Le navigateur a ignoré la déclaration et le titre est resté noir ; il n'y a pas eu d'avertissement.
2. **`#12` n'est pas une couleur.** Une couleur hexadécimale a 3 ou 6 chiffres (et 4 ou 8 si elle porte de la transparence). La valeur a été écartée.
3. **`100 px`** a une espace. Pour le CSS ce sont deux valeurs, et la largeur n'en accepte qu'une : on écrit `100px`, collé.
4. **Il manque un point-virgule** à la fin de la déclaration de `padding`. Le navigateur a lu `0.25rem 0.5rem border-radius: 999px` comme une seule valeur invalide, et **a perdu les deux déclarations**. C'est l'erreur la plus courante, et celle qui surprend le plus, parce qu'une ligne mal fermée emporte aussi celle du dessous.

L'erreur de la variable est autre : `var(--color-textt)` a un `t` de trop et la variable n'existe pas. Le validateur **ne la détecte pas** (son avertissement sur le tableau de bord dit que, de par leur nature dynamique, les variables ne sont pas vérifiées statiquement). Le navigateur ne proteste pas non plus : je l'ai mesuré dans Chrome et le paragraphe est resté avec le noir de toujours, celui du texte hérité. Une variable qui n'existe pas rend la déclaration invalide *au moment de calculer la valeur*, et la propriété revient à sa valeur héritée ou initiale, en silence. La façon de la trouver est celle que tu connais déjà : dans l'inspecteur, la déclaration apparaît marquée, et la valeur calculée du paragraphe n'est pas celle que tu attendais. Une autre bonne habitude : une variable peut porter une valeur de repli comme second argument, `var(--color-text, black)`, qui est utilisée quand la variable n'existe pas.

Une dernière vérification sur le tableau de bord de ce chapitre : j'ai fait passer sa feuille par le même validateur et il a répondu « Congratulations! No Error Found », avec seulement deux avertissements qui disent que les variables ne sont pas vérifiées statiquement.

## Ce qui se fait de travers

**1. Résoudre un conflit en augmentant la force.** Plus de sélecteurs, un identifiant, un `!important`. *Coût :* chaque rustine en exige une plus forte, et la feuille finit impossible à changer. Correction : calcule la spécificité des deux règles, baisse celle qui n'a pas besoin d'être forte, et ordonne avec des couches.

**2. Utiliser des identifiants pour donner du style.** `#summary dd { ... }`. *Coût :* un identifiant pèse (1,0,0), qui l'emporte sur mille classes, et la seule façon de le vaincre est un autre identifiant. Correction : le style va avec des classes ou des sélecteurs d'élément ; l'`id` est réservé aux liens internes et aux libellés.

**3. L'attribut `style` dans le HTML.** *Coût :* il l'emporte sur presque tout et mélange apparence et contenu ; pour changer une couleur, tu dois modifier le HTML à cent endroits. Correction : une classe.

**4. `outline: none` sans remplacement.** *Coût :* l'utilisateur au clavier ne sait plus où il est. Correction : `:focus-visible` avec un contour propre.

**5. Tailles de police en `px`.** *Coût :* celui qui agrandit la taille de police depuis la configuration du navigateur ne voit aucun effet, et il ne lui reste qu'à zoomer sur ta page chaque fois. Correction : `rem`.

**6. Communiquer l'état seulement par la couleur.** Un badge qui n'est que rouge ou vert. *Coût :* il est perdu pour celui qui ne distingue pas ces couleurs et pour celui qui utilise un lecteur d'écran. Correction : le mot toujours ; la couleur, en renfort.

**7. Retrancher des pixels à l'œil.** `width: 280px` pour que cela « tienne » avec la marge intérieure. *Coût :* le nombre dépend d'un calcul que personne n'a écrit, et se casse quand on change la marge intérieure. Correction : `box-sizing: border-box` pour tous et la largeur que tu veux vraiment.

**8. Nommer les variables d'après leur couleur.** `--blue`, `--red`. *Coût :* le jour où la décision change, le nom ment. Correction : des noms par fonction, comme `--color-accent`.

**9. Copier des valeurs isolées dans chaque règle.** Le même `#0b5cad` à cinq endroits. *Coût :* le changer, c'est chercher et remplacer, et on en oublie toujours un. Correction : une variable.

## Exercices

### Exercice 1 — Prédis avant d'ouvrir

Étant donné cette page, écris de quelle couleur sera chaque élément de la liste (A, B et C) **avant** de l'ouvrir. Ensuite ouvre-la et compare. Enfin, change **une seule chose** dans une règle pour que B s'affiche en vert et C en cramoisi, sans utiliser `!important` :

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Predice antes de abrir</title>
  <style>
    li { color: black; }
    #list li { color: navy; }
    .done { color: green; }
    li.urgent { color: crimson; }
  </style>
</head>
<body>
  <ul id="list">
    <li>A</li>
    <li class="done">B</li>
    <li class="done urgent">C</li>
  </ul>
</body>
</html>
```

### Exercice 2 — La carte qui déborde

Une carte a `width: 100%`, `padding: 16px` et `border: 2px solid black`, dans une colonne de 500 px de large. Calcule à la main combien mesure la carte avec `content-box` et combien avec `border-box`. Ensuite écris la page, mesure-la avec l'inspecteur et vérifie ton compte.

### Exercice 3 — Changer l'accent en une ligne

Change la couleur d'accent du tableau de bord pour une autre de ton choix en modifiant **une seule ligne** de la feuille. Avant de la choisir, vérifie avec le sélecteur de couleur des outils du navigateur ou avec le vérificateur de WebAIM qu'elle respecte 4.5 : 1 sur blanc. Ensuite réponds : quelles choses du tableau de bord ont changé de couleur avec cette seule ligne ?

### Exercice 4 — Défaire une guerre de `!important`

Cette feuille a un `!important` qui empêche le badge « Caído » de s'afficher en rouge. Répare-la **en le retirant et sans en ajouter un autre**, et sans changer le HTML :

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Guerra de important</title>
  <style>
    .status { color: gray !important; padding: 0 8px; }
    .status-down { color: red; }
  </style>
</head>
<body>
  <p><span class="status status-down">Caído</span></p>
</body>
</html>
```

## Solutions

### Solution 1

Les trois sont **bleus** (`navy`, `rgb(0, 0, 128)`). La règle `#list li` a une spécificité (1,0,1), avec un identifiant, et l'emporte sur toutes les autres : `.done` est (0,1,0) et `li.urgent` est (0,1,1), et aucune n'arrive à avoir un identifiant. C'est le piège d'utiliser des identifiants pour donner du style : une fois qu'il en apparaît un, aucune classe ne peut rivaliser.

Pour que B soit vert et C cramoisi, il faut **baisser** la force de cette règle, pas augmenter celle des autres. `:where()` vaut zéro, donc `:where(#list) li` a une spécificité (0,0,1) :

```css
li { color: black; }
:where(#list) li { color: navy; }
.done { color: green; }
li.urgent { color: crimson; }
```

Avec ce changement, je l'ai mesuré dans Chrome 154 : A est bleu (`rgb(0, 0, 128)`), B vert (`rgb(0, 128, 0)`) et C cramoisi (`rgb(220, 20, 60)`). A reste bleu parce que `:where(#list) li` et `li` sont à égalité à (0,0,1) et que celle qui est plus bas l'emporte.

### Solution 2

Avec `content-box` : 500 de largeur du contenu + 32 de marge intérieure (16 + 16) + 4 de bordure (2 + 2) = **536 pixels**, qui débordent de 36 pixels de la colonne de 500. Avec `border-box` : la largeur de `100%` (500) inclut déjà tout, donc elle mesure **500**. Ma mesure a coïncidé : 536 et 500.

```css
.wrap { width: 500px; }
.card { width: 100%; padding: 16px; border: 2px solid black; }
.card.fixed { box-sizing: border-box; }
```

### Solution 3

Il faut changer la ligne `--color-accent` dans `:root`. Par exemple, `#6f2da8` (un violet) donne 8.03 : 1 sur blanc, ce qui respecte largement. Une couleur comme `#9a4dff` est vive et **ne respecte pas** : 4.30 : 1, en dessous de 4.5. Avec cette unique ligne changent de couleur : les liens, le fond du bouton, le contour du focus et, par ricochet, le texte du bouton, qui est blanc (`--color-surface`) et a aussi besoin d'un contraste suffisant contre le nouvel accent. Voilà l'avantage de nommer la décision et non la couleur : quatre endroits, une ligne. Et la leçon qui l'accompagne : en changeant une variable, il faut vérifier **toutes** les combinaisons où elle intervient, pas seulement celle que tu avais en tête.

### Solution 4

Le `!important` fait que `.status` l'emporte sur tout. En le retirant, les deux règles ont la même spécificité (0,1,0) et c'est l'ordre qui décide : `.status-down` vient après, donc elle l'emporte, et le texte est rouge. Un ajustement qui rend en plus la feuille plus solide est d'utiliser le schéma de variables de la section 3.3.1 :

```css
.status { color: var(--badge-text); padding: 0 8px; }
.status-down { --badge-text: red; }
```

Avec ce schéma il n'y a plus de conflit possible : la règle `.status` ne dit jamais une couleur, elle ne fait que lire une variable. Et celui qui a besoin d'une autre variante ajoute une classe d'une ligne. Avant de l'utiliser, mesure que `red` sur le fond réel respecte le contraste.

## Comment savoir que j'ai réussi

- [ ] Le tableau de bord s'ouvre sur `http://localhost:8000/` avec la feuille appliquée, sans erreurs dans la console des outils du navigateur.
- [ ] Le validateur de CSS (`https://jigsaw.w3.org/css-validator/`) répond « Congratulations! No Error Found » sur ton `styles.css`.
- [ ] En appuyant sur Tab tu vois un anneau bleu de 3 pixels autour du lien, du champ, des boutons radio et du bouton, et chercher `outline: none` dans ta feuille ne donne aucun résultat.
- [ ] Dans l'inspecteur, sur la boîte avec `border-box` de `fig03_05.html`, le diagramme de la boîte montre un contenu de 250 pixels de large (300 moins 40 de marge intérieure et 10 de bordure), et sur l'autre, 300.
- [ ] Tu peux prédire la couleur des quatre paragraphes de `fig03_02.html` avant de l'ouvrir, en disant quelle étape de la cascade départage chacun.
- [ ] Chaque couleur de texte de ta feuille respecte 4.5 : 1 contre son fond, et tu peux dire avec quel outil tu l'as mesuré.
- [ ] Changer la valeur de `--color-accent` change, à la fois, les liens, le bouton et l'anneau du focus.

## Pour aller plus loin

- [MDN, « Handling conflicts » (cascade, spécificité et héritage)](https://developer.mozilla.org/fr/docs/Learn_web_development/Core/Styling_basics/Handling_conflicts) — l'article d'apprentissage de Mozilla sur ce même sujet, avec des défis de pratique. Consulté le 7 octobre 2026.
- [W3C, « CSS Cascading and Inheritance Level 5 »](https://www.w3.org/TR/css-cascade-5/) — la spécification où est écrit l'algorithme de la cascade, avec ses couches et son ordre. En anglais. Consultée le 7 octobre 2026.
- [MDN, « The box model »](https://developer.mozilla.org/fr/docs/Learn_web_development/Core/Styling_basics/Box_model) — la boîte, la marge intérieure, la bordure et la marge avec des diagrammes et `box-sizing`. Consulté le 7 octobre 2026.
- [web.dev, « Learn CSS »](https://web.dev/learn/css) — cours gratuit de Google par thèmes, utile comme référence ordonnée des sélecteurs, de la boîte, de la cascade et de l'héritage. En anglais. Consulté le 7 octobre 2026.
