# Leçon 0 — Comment fonctionne le web

**Durée :** deux sessions d'environ 90 min. Une répartition qui marche : la première, « Le pourquoi avant le comment », l'adresse (0.1) et la conversation (0.2), avec le terminal ouvert pour rejouer chaque `curl` et chaque `dig` ; la seconde, qui fait quoi (0.3) avec l'onglet Réseau, « L'erreur que tu vas voir » et les exercices. C'est une leçon à lire et à observer, mais on la lit avec le terminal et le navigateur à côté, pas d'une traite.

**Ce que tu construis :** rien encore ; cette leçon est faite pour lire et observer. Tu construis la carte mentale qui va porter les onze autres.

**Ce que tu apprends :** URL, DNS, HTTP, requête et réponse ; ce que fait le navigateur et ce que fait le serveur ; l'onglet Réseau des outils de développement du navigateur.

**Les pages de cette leçon.** La seule page d'exemple, `fig00_01.html`, se trouve dans [`programas/00-como-funciona-la-web/`](https://github.com/HabilMX/curso-web/tree/main/programas/00-como-funciona-la-web) du [dépôt du cours](https://github.com/HabilMX/curso-web). Tu n'as pas besoin de l'ouvrir aujourd'hui : il suffit de la lire ici, et dans la Leçon 1 tu apprendras à la servir depuis ton ordinateur.

## À la fin, tu seras capable de

- Décomposer une URL en schéma, hôte, port, chemin, paramètres et fragment, et dire laquelle de ces parties décide à quelle machine on s'adresse et laquelle décide ce qu'on lui demande.
- Expliquer ce que fait le DNS, et distinguer son travail de celui de HTTP.
- Lire une requête et une réponse HTTP —ligne initiale, en-têtes, corps— et dire ce que signifie le code d'état de la réponse.
- Expliquer pourquoi une seule page représente de nombreuses requêtes, et ce que décide le navigateur et ce que décide le serveur pour chacune.
- Dire quelle partie de ton code s'exécute sur la machine de la personne qui visite la page, et quelle conséquence cela a pour la sécurité.
- Ouvrir l'onglet Réseau des outils de développement du navigateur, trouver la requête principale d'une page et lire son état, son type, sa taille et son temps.
- Face à une panne, dire dans laquelle de trois couches elle s'est produite —le nom, la connexion ou la réponse— avant de rien changer.

## Le pourquoi avant le comment

Imagine la personne qui exploite les services d'une entreprise. Il est sept heures du matin, elle ouvre le tableau de bord du `revisor` —le projet que tu vas construire tout au long du cours— et voit une ligne qui dit « chargement… » et qui ne change pas. Que s'est-il passé ? Peut-être que sa [connexion](https://developer.mozilla.org/fr/docs/Glossary/TCP) à internet est tombée. Peut-être que le nom du serveur ne pointe plus nulle part. Peut-être que le serveur est allumé mais que ce fichier n'existe plus. Peut-être qu'il existe, mais que le serveur met une demi-minute à le livrer. Ou peut-être que tout est bien arrivé et que ton propre code ne sait pas l'afficher. Cinq causes, un seul symptôme, et la personne qui regarde l'écran ne peut pas distinguer l'une de l'autre. Toi, tu vas pouvoir, mais seulement si tu sais ce qui se passe entre le moment où quelqu'un écrit une adresse et le moment où il voit la page.

C'est le travail de cette leçon. Elle n'écrit pas une seule ligne du tableau de bord, et pourtant c'est celle qui t'épargnera le plus d'erreurs. La plupart de ce qui déroute le plus un débutant —un `404`, un [message](https://developer.mozilla.org/fr/docs/Web/HTTP/Guides/Messages) qui parle de « [CORS](https://developer.mozilla.org/fr/docs/Web/HTTP/Guides/CORS) », une page qui s'affiche sans styles, un module qui ne se charge pas, une donnée qui arrive vide— ne sont pas des défauts du langage : ce sont des malentendus sur cette conversation. Celui qui n'a pas la carte se met à changer du code au hasard ; celui qui l'a demande d'abord « à laquelle des étapes est-ce que ça s'est cassé ? » et, presque toujours, la réponse est sous les yeux en moins d'une minute.

La carte tient en une phrase : **le [navigateur](https://developer.mozilla.org/fr/docs/Web/Performance/Guides/How_browsers_work) demande, le serveur répond, et tout le reste est le détail de la façon dont on se dit les choses.** C'est l'idée même avec laquelle est né le web : la [proposition que Tim Berners-Lee a écrite en 1989](https://www.w3.org/History/1989/proposal.html) décrivait des documents liés qu'un programme demande à un autre, et le [premier site web](https://info.cern.ch/hypertext/WWW/TheProject.html), que le CERN conserve, peut encore être ouvert et lu. Cette leçon développe ce détail en trois pièces, et chacune apporte son exemple réel, mesuré le 7 octobre 2026 contre une page publique qui existe justement pour cela. D'abord, l'adresse : ce qu'est une [URL](https://developer.mozilla.org/fr/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_URL) et comment un nom comme `example.com` devient une machine concrète. Ensuite, la conversation : ce que se disent exactement le [navigateur](https://web.dev/articles/howbrowserswork) et le serveur, mot pour mot. Enfin, le partage des tâches : ce que fait chacun, où vit ton code et comment on observe tout cela avec l'[onglet Réseau](https://firefox-source-docs.mozilla.org/devtools-user/network_monitor/index.html) du navigateur.

Tu n'as rien à installer pour la suivre, sauf pour les exercices, qui utilisent le navigateur et le [terminal](https://missing.csail.mit.edu/). Comme la leçon te montre des commandes de terminal dès la première section, voici le minimum pour les lire ; la [Leçon 1](01-entorno-ciclo-trabajo.md) le développe tranquillement :

- **Le terminal** est une fenêtre où, au lieu de cliquer, tu écris des commandes. Sous Linux Mint, il s'ouvre avec `Ctrl`+`Alt`+`T`.
- **Le signe `$` ne se tape pas.** Dans les blocs du cours, une ligne qui commence par `$ ` est une commande que tu tapes *sans* ce signe, et que tu termines en appuyant sur `Entrée`. Les lignes qui suivent, sans `$`, sont ce que le terminal répond : on ne les tape pas, on les lit.
- **Une commande est un programme suivi d'options.** Dans `curl -I https://example.com`, `curl` est le programme (un programme qui télécharge des adresses web), `-I` est une option (« montre-moi seulement les en-têtes ») et l'URL est ce que tu lui demandes.
- **La barre verticale `|` relie deux commandes** : ce qu'imprime la première entre dans la seconde au lieu de sortir à l'écran. Tu verras `| head -3`, qui ne laisse passer que les trois premières lignes. Sur un clavier français, la `|` s'obtient avec `AltGr`+`6`.
- **`/dev/null` est un fichier spécial de Linux qui jette tout ce qu'il reçoit.** Quand tu verras `curl … -o /dev/null`, l'option `-o` (« enregistre le contenu dans… ») envoie la page vers cette poubelle, et à l'écran il ne reste que les messages de la conversation, qui est ce que nous voulons observer.

Si une commande te répond `command not found`, ce programme n'est pas installé : la Leçon 1 explique comment l'installer avec `sudo apt install` et pourquoi on écrit `sudo` devant. Et si tu ne peux pas utiliser de terminal maintenant, ne t'arrête pas : lis les sorties qui sont montrées, qui sont réelles, et fais les exercices de terminal quand tu auras terminé la Leçon 1.

Un dernier avertissement de méthode. Dans cette leçon, tu vas voir beaucoup de texte brut : des lignes que le navigateur et le serveur s'échangent, telles quelles. Ce n'est pas à mémoriser. C'est pour que tu perdes la peur que le web soit une boîte noire : il ne l'est pas, c'est une conversation en texte qui peut se lire, et une fois que tu l'as lue une fois, tu n'oublies plus qu'elle le peut.

## Les concepts

Il y en a trois, et ils s'appuient l'un sur l'autre. Lis-les dans l'ordre.

### 0.1 L'adresse : URL et DNS

#### Une URL est une adresse avec des parties

Quand tu écris quelque chose dans la barre du navigateur, ou que tu cliques sur un lien, ce que tu utilises est une **URL** (en anglais *Uniform Resource Locator*, localisateur uniforme de ressource). Elle ressemble à une adresse postale : ce n'est pas un nom quelconque, elle a des parties, chaque partie répond à une question différente, et l'ordre compte. Prenons une URL inventée mais complète, du genre que pourrait utiliser le `revisor` :

```text
https://example.com:8443/data/services.json?status=down&sort=name#row-3
```

Lis-la de gauche à droite et donne un nom à chaque morceau :

| Partie | Dans l'exemple | Ce qu'elle répond |
|---|---|---|
| **Schéma** | `https` | Dans quelle langue parle-t-on ? (le protocole : HTTP, chiffré avec [TLS](https://www.rfc-editor.org/rfc/rfc8446)) |
| **Hôte** (host) | `example.com` | À quelle machine est-ce que je m'adresse ? |
| **Port** | `8443` | À laquelle des portes de cette machine est-ce que je frappe ? |
| **Chemin** | `/data/services.json` | Quelle ressource est-ce que je demande ? |
| **Paramètres** | `?status=down&sort=name` | Avec quelles conditions, ou avec quelles données en plus ? |
| **Fragment** | `#row-3` | À quelle partie du document déjà reçu le navigateur m'amène-t-il ? |

Ces parties sont définies dans le standard des URL (le *[URL Standard](https://url.spec.whatwg.org/)* du WHATWG, l'organisation qui maintient le [HTML](https://html.spec.whatwg.org/multipage/) et presque tout l'environnement du navigateur) et, plus ancien et plus court, dans la [RFC 3986](https://www.rfc-editor.org/rfc/rfc3986) de l'IETF. Si un jour tu as besoin de savoir quelque chose d'exact à leur sujet —par exemple, quels caractères un chemin peut contenir— la réponse est là ; tu n'as pas à les mémoriser.

Il y a quatre détails qu'il vaut mieux fixer dès maintenant, parce que chacun t'évitera un faux pas :

**Le port ne s'écrit presque jamais.** Une machine peut écouter sur des milliers de « portes » numérotées à la fois ; chaque service répond sur l'une d'elles. Par convention, le web non chiffré utilise la 80 et le [web chiffré](https://developer.mozilla.org/fr/docs/Web/Security/Defenses/Secure_Contexts) utilise la 443, et le navigateur les suppose quand tu n'écris rien. C'est pourquoi `https://example.com` et `https://example.com:443` sont la même chose. Quand, dans la Leçon 1, tu lanceras un serveur sur ton ordinateur, il utilisera une autre porte —la 8000— et là, tu devras bien l'écrire : `http://localhost:8000`.

**Le fragment ne voyage pas.** Tout ce qui est à gauche du `#` est envoyé au serveur ; le fragment, non. Il reste dans le navigateur, qui s'en sert pour te faire défiler jusqu'à la partie de la page qui porte cet identifiant. C'est l'une des confusions les plus courantes chez le débutant : « j'ai envoyé `#row-3` au serveur et il ne l'a pas reçu ». C'est normal qu'il ne l'ait pas reçu, et tu le vérifieras de tes propres yeux dans l'[onglet Réseau](https://developer.chrome.com/docs/devtools/network).

**Le chemin n'est pas un dossier.** `/data/services.json` *ressemble* à un chemin de dossiers et, sur un serveur de fichiers simple comme celui que tu vas utiliser, il coïncide effectivement avec un. Mais c'est une décision du serveur, pas une loi : il existe des serveurs où `/users/42` ne correspond à aucun fichier et où la réponse est calculée à la volée. Pour le navigateur, le chemin n'est qu'un texte qu'il remet au serveur pour que celui-ci décide quoi répondre. Et une convention utile : quand le chemin se termine par `/`, la plupart des serveurs de fichiers livrent le `index.html` de ce dossier. C'est pourquoi l'adresse d'une page d'accueil peut être simplement `https://example.com/`.

**Majuscules et minuscules n'ont pas la même valeur partout.** L'hôte ne fait pas la différence : `Example.COM` et `example.com` sont identiques. Le chemin, en revanche, la fait en général. Ce qui fonctionne sur ton ordinateur sous Windows ou macOS avec `Logo.PNG`, sur un serveur Linux —qui est presque toujours l'endroit où vit un site— peut donner « introuvable » si le fichier s'appelle `logo.png`. La règle du cours naît d'ici : **noms de fichiers en minuscules, sans espaces et sans accents.**

À propos d'espaces et d'accents : une URL ne peut contenir qu'un ensemble réduit de caractères. Les autres s'écrivent avec l'**[encodage en pourcentage](https://developer.mozilla.org/fr/docs/Glossary/Percent-encoding)** : le caractère est converti en ses octets (en [UTF-8](https://www.rfc-editor.org/rfc/rfc3629)) et chaque octet s'écrit `%` suivi de deux chiffres hexadécimaux. Une espace est `%20` ; le `ñ` fait deux octets, `%C3%B1`. Ainsi, un fichier appelé `mi página.html` serait demandé comme `mi%20p%C3%A1gina.html`. Le navigateur le fait pour toi, mais le jour où tu verras cette « soupe de pourcentages » dans une barre d'adresse ou dans un journal du serveur, tu sauras de quoi il s'agit, et tu sauras pourquoi il vaut mieux ne mettre ni espaces ni accents dans tes fichiers.

#### URL absolues et relatives

Jusqu'ici nous avons vu une URL entière. Mais dans une page, tu n'écris presque jamais l'adresse complète de chaque fichier. Tu écris quelque chose comme `css/estilo.css`, et le navigateur la complète en prenant pour base l'adresse de la page où il se trouve. C'est une **URL relative**, et tu l'utiliseras dans toutes les leçons qui suivent, donc cela vaut la peine de voir comment elle se résout. Suppose que la page actuelle soit `http://localhost:8000/panel/index.html` :

| Ce que tu écris | Comment ça se lit | Résultat |
|---|---|---|
| `estilo.css` | même dossier que la page | `http://localhost:8000/panel/estilo.css` |
| `css/estilo.css` | un sous-dossier du dossier actuel | `http://localhost:8000/panel/css/estilo.css` |
| `../estilo.css` | remonter d'un dossier | `http://localhost:8000/estilo.css` |
| `/estilo.css` | depuis la racine du site, peu importe où tu es | `http://localhost:8000/estilo.css` |

La différence entre `css/estilo.css` (sans barre oblique initiale) et `/css/estilo.css` (avec barre oblique initiale) est la cause de bien des « chez moi ça s'affiche ». La première dépend de l'endroit où se trouve la page ; la seconde, non. Dans ce cours nous allons préférer les relatives sans barre oblique initiale pour les fichiers du projet, parce que de cette façon le projet peut changer de dossier sans se casser.

#### Le DNS : l'annuaire qui convertit les noms en adresses

Tu sais déjà lire une URL. Il reste à [résoudre](https://www.rfc-editor.org/rfc/rfc9499) un problème que tu n'avais peut-être pas remarqué : les ordinateurs ne se trouvent pas par leur nom. Ils se trouvent par leur **[adresse IP](https://developer.mozilla.org/fr/docs/Glossary/IP_Address)**, qui est un nombre. Une adresse IPv4 est composée de quatre nombres entre 0 et 255 séparés par des points (`104.20.23.154`) ; une IPv6 est plus longue et s'écrit en hexadécimal, et elle existe parce que les adresses IPv4 se sont épuisées. Un humain retient `example.com` ; le réseau a besoin du nombre. Entre les deux se trouve le **[DNS](https://www.rfc-editor.org/rfc/rfc1034)** (*Domain Name System*, système de [noms de domaine](https://www.rfc-editor.org/rfc/rfc1035)), qui est, en simplifiant beaucoup, un annuaire téléphonique distribué : tu lui donnes un nom et il te rend une ou plusieurs adresses.

« Distribué » est le mot important. Il n'existe pas d'annuaire central unique que quelqu'un devrait maintenir : ce serait un goulot d'étranglement et un point de défaillance unique. Le [DNS](https://developer.mozilla.org/fr/docs/Glossary/DNS) est une hiérarchie. Le nom `example.com` se lit de droite à gauche : le point final (qu'on omet presque toujours) est la **racine** ; `com` est le domaine de premier niveau ; `example` est un domaine à l'intérieur de `com`. Chaque niveau est administré par quelqu'un de différent, et chaque administrateur sait seulement à qui demander pour le niveau du dessous. Voici comment fonctionne la requête complète, qui en pratique est faite pour toi :

1. Ton ordinateur interroge son **résolveur** : un serveur DNS que ton réseau lui a attribué (celui de ton fournisseur, celui de ton entreprise) ou que tu as choisi. Si le résolveur a déjà la réponse en mémoire, il répond immédiatement et c'est terminé.
2. Sinon, le résolveur interroge un **serveur racine**. La racine ne sait pas où se trouve `example.com`, mais elle sait qui administre `com`, et lui dit à qui demander.
3. Le résolveur interroge les serveurs de `com`. Eux non plus ne connaissent pas l'adresse finale, mais ils savent qui administre `example.com`, et le disent.
4. Le résolveur interroge les **serveurs faisant autorité** de `example.com` : ceux qui détiennent vraiment la réponse. Ceux-ci répondent avec les adresses.
5. Le résolveur les remet à ton ordinateur et les garde un moment au cas où quelqu'un les lui redemanderait.

Cela peut se voir. Avec l'outil `dig` (sous Mint, il s'installe avec `sudo apt install bind9-dnsutils`) tu demandes les enregistrements de type `A`, qui sont ceux qui associent un nom à une adresse IPv4. Voici la sortie réelle que j'ai obtenue le 7 octobre 2026 :

```bash
$ dig example.com +noall +answer
example.com.		240	IN	A	172.66.147.243
example.com.		240	IN	A	104.20.23.154
```

Chaque ligne dit : le nom, le **TTL** (*time to live*, durée de vie) en secondes, la classe (`IN`, d'internet), le type d'enregistrement (`A`) et l'adresse. Deux observations. Première : il y a deux adresses pour un seul nom ; c'est normal, les grands services répartissent la charge entre plusieurs machines. Seconde : le TTL de 240 signifie « tu peux garder cette réponse quatre minutes avant de redemander ». Cette mémoire est ce qui rend le DNS rapide, et c'est aussi la raison pour laquelle un changement d'adresse ne se voit pas dans le monde entier en même temps : certains résolveurs ont encore l'ancienne réponse en mémoire. Quand, dans la Leçon 11, tu publieras ton site, tu te souviendras de ce paragraphe.

Si tu demandes les serveurs de la zone `com`, la réponse montre la hiérarchie en action :

```bash
$ dig +short NS com | head -3
g.gtld-servers.net.
f.gtld-servers.net.
m.gtld-servers.net.
```

(Ce sont treize noms, de `a.gtld-servers.net` à `m.gtld-servers.net` ; en pratique chacun est en réalité une flotte de machines réparties dans le monde.) Ton ordinateur n'a jamais besoin de savoir cela ; le résolveur, si.

Deux précisions pour éviter de te tromper plus tard. **Le DNS n'est pas le web :** le courrier électronique l'utilise aussi, et presque tout ce qu'utilise internet. Il ne fait qu'une chose —du nom vers l'adresse— et ne sait rien des pages. Et **`localhost` est un nom spécial** : il est [réservé](https://www.iana.org/domains/reserved) pour signifier « cet ordinateur-ci » et il se résout sans en sortir, vers les adresses de *boucle locale* (*loopback*) : `127.0.0.1` en IPv4 et `::1` en IPv6. Le standard qui le réserve est la [RFC 6761](https://www.rfc-editor.org/rfc/rfc6761). Le fait qu'il y en ait deux compte dans un détail de la Leçon 1 : si un programme n'écoute que sur l'une d'elles, le navigateur qui n'obtient pas de réponse sur l'autre essaie aussi la première. Quand ton navigateur ouvrira `http://localhost:8000`, il n'y aura pas de voyage à travers internet : il parlera à un programme qui s'exécute sur ta propre machine.

Une simple note de confidentialité. Par tradition, les requêtes DNS voyagent sans chiffrement, de sorte que celui qui est sur le chemin peut apprendre quels noms tu consultes. Il existe une variante chiffrée, DNS sur HTTPS ([RFC 8484](https://www.rfc-editor.org/rfc/rfc8484)), que certains navigateurs activent. Elle ne change rien à ce que tu apprends ici ; il est seulement utile que tu saches que la confidentialité du nom et la confidentialité de la page sont deux choses différentes.

### 0.2 La conversation : HTTP

#### Du nom à la connexion

Avec l'adresse IP en main, le navigateur ouvre une **connexion** avec cette machine, sur la porte indiquée. Il le fait avec [TCP](https://www.rfc-editor.org/rfc/rfc9293), un protocole dont le travail est que deux ordinateurs se mettent d'accord pour parler et garantissent que ce que l'un envoie arrive complet et dans l'ordre. Il commence par un bref échange de trois messages (la « poignée de main en trois temps ») et à partir de là un canal est ouvert.

Si le schéma est `https`, avant de dire quoi que ce soit d'intéressant, on fait une seconde poignée de main, cette fois pour chiffrer le canal : le navigateur et le serveur négocient une clé secrète et le serveur présente son **certificat TLS** : un document numérique, signé par une autorité en laquelle ton navigateur a confiance, qui prouve qu'il est bien le propriétaire du nom qu'il prétend porter. C'est la partie « S » de HTTPS (sécurisé), et elle est assurée par un protocole appelé [TLS](https://developer.mozilla.org/en-US/docs/Web/Security/Transport_Layer_Security). Tu peux la voir dans la sortie de `curl -v`, un outil qui télécharge une URL et raconte ce qu'il fait :

```bash
$ curl -v https://example.com -o /dev/null
* Host example.com:443 was resolved.
* IPv4: 104.20.23.154, 172.66.147.243
*   Trying 104.20.23.154:443...
* Connected to example.com (104.20.23.154) port 443
* SSL connection using TLSv1.3 / AEAD-CHACHA20-POLY1305-SHA256
* Server certificate:
*  subject: CN=example.com
*  SSL certificate verify ok.
```

Chaque ligne raconte une étape que tu viens d'apprendre : le nom a été résolu (DNS), la première adresse a été essayée (connexion), TLS 1.3 a été négocié (chiffrement) et le certificat du serveur a été vérifié (`verify ok`). (J'ai raccourci la sortie pour qu'elle tienne ; la sortie complète comporte aussi les lignes de la poignée de main et de la requête. Je l'ai mesurée avec `curl` 8.7.1 sous macOS ; le `curl` de Linux Mint 22, le 8.5.0, utilise une autre bibliothèque de chiffrement, donc certaines lignes —surtout celle qui nomme l'algorithme après `TLSv1.3`— sont rédigées autrement. Les étapes sont les mêmes.) Tout cela s'est passé *avant* que la page soit demandée.

Il convient de fixer ce que te donne et ce que ne te donne pas le cadenas de HTTPS. **Il te donne** trois choses : la confidentialité (celui qui est sur le chemin ne peut pas lire ce que tu demandes ni ce que tu reçois), l'intégrité (personne ne peut le modifier sans que cela se voie) et l'authenticité (tu parles avec le titulaire du nom qui a été vérifié). **Il ne te donne** aucune garantie sur les intentions de ce titulaire : une page d'hameçonnage peut avoir un cadenas parfaitement valide. Et il ne cache pas non plus *avec qui* tu parles : celui qui est sur le chemin peut savoir que tu t'es connecté à `example.com`, même s'il ne sait pas quelle page tu as demandée ni ce que tu as reçu.

#### La requête et la réponse

Une fois le canal ouvert, HTTP commence (*HyperText Transfer Protocol*, protocole de transfert hypertexte), qui est un schéma de question et réponse : **le client envoie une requête, le serveur renvoie une réponse, et l'échange s'arrête là.** Le serveur ne commence jamais une conversation de lui-même ; il ne fait que répondre. Cette asymétrie est la colonne vertébrale du web.

Ce qui est étonnant, c'est sa simplicité. Dans sa version 1.1, la requête est du texte que tu peux lire. Voici celle que [`curl`](https://curl.se/docs/manpage.html) a envoyée à `example.com`, en forçant cette version avec `--http1.1` pour pouvoir la voir en clair :

```http
GET / HTTP/1.1
Host: example.com
User-Agent: curl/8.7.1
Accept: */*

```

Et voici la réponse, également mesurée le 7 octobre 2026 (la partie des [en-têtes](https://developer.mozilla.org/fr/docs/Web/HTTP/Reference/Headers) ; le corps, nous le voyons tout de suite) :

```http
HTTP/1.1 200 OK
Date: Wed, 07 Oct 2026 16:53:12 GMT
Content-Type: text/html; charset=utf-8
Transfer-Encoding: chunked
Connection: keep-alive
Server: cloudflare
last-modified: Fri, 02 Oct 2026 16:11:02 GMT
allow: GET, HEAD
Accept-Ranges: bytes
Age: 2482
cf-cache-status: HIT
CF-RAY: a46e6bb0cd40cb67-DFW
alt-svc: h3=":443"; ma=86400

```

Les deux messages ont la même forme en trois parties, qui est la forme de tout message en HTTP/1.1 (les versions plus récentes, que tu verras bientôt, portent les mêmes parties emballées autrement) :

1. **La ligne initiale.** Dans la requête, elle s'appelle *ligne de requête* et comporte trois mots : la **méthode** ([`GET`](https://developer.mozilla.org/fr/docs/Web/HTTP/Reference/Methods), « donne-moi »), la **cible** (`/`, le chemin que tu as vu dans l'URL) et la **version** du protocole. Dans la réponse, elle s'appelle *ligne d'état* et comporte la version, le **[code d'état](https://developer.mozilla.org/fr/docs/Web/HTTP/Reference/Status)** (`200`) et une courte phrase (`OK`) qui n'est là que pour qu'un humain la lise.
2. **Les en-têtes.** Des lignes de la forme `Nom: valeur`, une par ligne. Ce sont des métadonnées : de l'information *sur* la requête ou la réponse, pas le contenu lui-même.
3. **Une ligne vide** et, ensuite, **le corps** : le contenu (dans une requête `GET` il n'y en a presque jamais ; dans la réponse, ici, c'est le HTML de la page).

Cette ligne vide est celle qui sépare les en-têtes du corps. Un détail technique qui explique pourquoi la requête ci-dessus se termine par une ligne vide.

Voyons maintenant les en-têtes qui sont apparus, pour qu'ils ne soient pas un texte opaque. Pour la requête : [`Host`](https://developer.mozilla.org/fr/docs/Web/HTTP/Reference/Headers/Host) dit à quel nom la requête s'adresse. Cela semble redondant —nous nous sommes déjà connectés à l'adresse— mais une seule machine peut servir des centaines de sites, et c'est `Host` qui lui dit lequel tu veux. `User-Agent` se présente (ici, [`curl`](https://curl.se/docs/tutorial.html), avec la version de la machine où j'ai mesuré ; le tien dira la sienne ; ton navigateur met une longue chaîne avec son nom et sa version). `Accept` dit quels types de contenu sont acceptés (`*/*` : n'importe lesquels). Pour la réponse : `Date` est l'heure du serveur. [`Content-Type`](https://developer.mozilla.org/fr/docs/Web/HTTP/Reference/Headers/Content-Type) est **le plus important pour toi**, et nous y reviendrons plus bas. `Server` identifie le programme qui a répondu. `last-modified` indique quand la ressource a changé pour la dernière fois. `allow` liste les [méthodes](https://www.iana.org/assignments/http-methods/http-methods.xhtml) que cette ressource accepte. `Age` dit depuis combien de secondes cette copie est conservée dans un [cache](https://www.rfc-editor.org/rfc/rfc9111) intermédiaire, et `alt-svc` signale que le même serveur parle aussi HTTP/3. Le reste (`Transfer-Encoding`, `Connection`, `Accept-Ranges`) concerne des détails de la façon dont on transmet, et tu n'en as pas encore besoin. Tu verras aussi des en-têtes avec des préfixes de fournisseur, comme `cf-cache-status` : ce sont des extras qu'ajoute l'infrastructure de celui qui sert la page, pas une partie du protocole.

Et le corps de cette réponse est, tout simplement, un fichier HTML :

```html
<!-- fig00_01.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Página de ejemplo</title>
</head>
<body>
  <main>
    <h1>Página de ejemplo</h1>
    <p>Este texto viaja del servidor al navegador dentro de una respuesta HTTP.</p>
  </main>
</body>
</html>
```

```text
Página de ejemplo
Este texto viaja del servidor al navegador dentro de una respuesta HTTP.
```

(Le second bloc est ce que tu verrais à l'écran en chargeant la page ; la signification de chaque balise, nous la voyons dans la Leçon 2. Pour l'instant il suffit de voir que ce n'est que du texte.) Si un serveur servait ce fichier, la réponse complète serait celle-ci, avec les sauts de ligne que marque le protocole :

```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Length: 290

<!-- fig00_01.html -->
<!DOCTYPE html>
...
```

`Content-Length` dit combien d'octets mesure le corps, pour que le navigateur sache quand il a fini ; 290 est la taille de ce fichier. Ce n'est pas une réponse que nous avons capturée sur un vrai serveur —c'est celle qu'en produirait un—, et dans la Leçon 1 tu en verras une authentique, de ton propre serveur.

Une précision qui t'évitera une confusion. Si tu retires à `curl` l'option `--http1.1` et que tu ne demandes que les en-têtes (`-I`), la réponse commence autrement. Voici ce que cela a donné le 7 octobre 2026 (raccourci aux premières lignes) :

```bash
$ curl -I https://example.com
HTTP/2 200
date: Wed, 07 Oct 2026 20:42:08 GMT
content-type: text/html; charset=utf-8
server: cloudflare
```

Par défaut, `curl` et le serveur se sont accordés sur `HTTP/2 200`, et non sur `HTTP/1.1 200 OK`, et les noms des en-têtes arrivent en minuscules. HTTP a des [versions](https://developer.mozilla.org/fr/docs/Web/HTTP/Guides/Evolution_of_HTTP). La 1.1 ([RFC 9112](https://www.rfc-editor.org/rfc/rfc9112)) est celle en texte que tu viens de lire. La 2 ([RFC 9113](https://www.rfc-editor.org/rfc/rfc9113)) et la 3 ([RFC 9114](https://www.rfc-editor.org/rfc/rfc9114), sur un transport différent appelé QUIC, [RFC 9000](https://www.rfc-editor.org/rfc/rfc9000)) envoient la même chose en format binaire —et avec les en-têtes compressés—, plus efficace et qu'on ne peut plus lire à l'œil nu. **Ce qui change, c'est l'emballage ; la signification —méthodes, [codes d'état](https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml), en-têtes— est la même dans les trois** et est définie une seule fois, dans la RFC 9110. C'est pourquoi apprendre la forme en texte n'est pas un exercice de nostalgie : c'est apprendre la langue, avec l'avantage qu'on peut la lire. Tu verras que le serveur de ton ordinateur répond en `HTTP/1.0` ([RFC 1945](https://www.rfc-editor.org/rfc/rfc1945)), une version encore plus ancienne : elle suffit pour un serveur d'entraînement et, là encore, la signification ne change pas.

#### Les méthodes : ce qu'on demande au serveur

La méthode est le verbe de la requête. Celles qui comptent dans ce cours sont peu nombreuses :

| Méthode | À quoi elle sert | Change-t-elle quelque chose sur le serveur ? |
|---|---|---|
| `GET` | demander une ressource | non |
| `POST` | envoyer des données pour que le serveur les traite (créer quelque chose, par exemple) | normalement oui |
| `PUT` | remplacer une ressource par celle que tu envoies | oui |
| `DELETE` | supprimer une ressource | oui |
| `HEAD` | comme `GET`, mais sans le corps : seulement les en-têtes | non |

La RFC 9110 leur donne deux propriétés aux noms précis. Une méthode est **sûre** quand elle ne prétend rien changer sur le serveur : `GET` et `HEAD` le sont, et c'est pourquoi le navigateur peut les répéter, les précharger ou les mettre en cache sans crainte. Une méthode est **[idempotente](https://developer.mozilla.org/fr/docs/Glossary/Idempotent)** quand la répéter donne le même résultat que de la faire une seule fois : `PUT` et `DELETE` le sont (supprimer deux fois la même chose laisse le même monde que de la supprimer une fois), `POST` non (envoyer deux fois une commande peut créer deux commandes). Cette différence explique pourquoi, si tu recharges une page issue d'un `POST`, le navigateur t'avertit avant de renvoyer. Pour l'instant, tout ce dont tu as besoin est : **charger une page est un `GET`**, et la Leçon 10 utilisera `GET` et `POST` depuis les formulaires.

#### Les codes d'état : à qui est le problème

Les codes d'état sont des nombres à trois chiffres, et le premier dit déjà presque tout : la famille.

| Famille | Signifie | Ceux que tu vas voir |
|---|---|---|
| **1xx** | informatif, la conversation continue | presque jamais |
| **2xx** | succès | `200 OK`, `201 Created`, `204 No Content` |
| **3xx** | [redirection](https://developer.mozilla.org/fr/docs/Web/HTTP/Guides/Redirections) : ce que tu cherches est ailleurs | `301` et `302` (une autre adresse), `304 Not Modified` (utilise ta copie) |
| **4xx** | erreur **du client** : la requête n'est pas valide ou ne peut pas être traitée | `400`, `401`, `403`, `404 Not Found`, `429 Too Many Requests` |
| **5xx** | erreur **du serveur** : la requête était valide mais le traitement a échoué | `500`, `502 Bad Gateway`, `503 Service Unavailable`, `504 Gateway Timeout` |

La distinction 4xx / 5xx est de l'or pour déboguer parce qu'elle indique par où commencer à chercher : un `404` dit « je n'ai pas trouvé ce que tu as demandé » (ou, parfois, « je ne vais pas te dire si ça existe ») ; un `500` dit « je suis tombé sur un problème inattendu de mon côté en traitant ta requête ». Ce n'est pas toujours aussi net —un serveur mal programmé peut répondre `500` à une requête qui, elle, était mauvaise—, mais comme première piste, cela ne fait presque jamais défaut. Quand le tableau de bord `revisor` mettra une ligne en rouge parce qu'un service a répondu `503`, il traduira exactement ce vocabulaire, et sa colonne d'état naît d'ici. La liste officielle complète vit dans un registre de l'IANA, qui est l'autorité qui attribue ces numéros.

Deux avertissements qui se paient cher plus tard. **Un `404` est une réponse correcte et complète.** Le serveur a répondu, avec un corps (normalement une page qui dit « introuvable ») et tout ; la réponse est simplement « je n'ai pas cela ». Du point de vue du navigateur, la conversation s'est bien passée. Cela comptera dans la Leçon 8, parce que la fonction [`fetch`](https://fetch.spec.whatwg.org/) de JavaScript traite un `404` comme une conversation qui s'est *bien passée* et non comme une erreur : c'est à toi de regarder l'état. Second avertissement : **la famille 2xx dit que le serveur a traité la requête, pas que le résultat est celui que tu attendais.** Un `200` avec un corps qui dit « erreur » (cela existe, et c'est une mauvaise pratique) reste un `200`.

#### Content-Type : comment le navigateur décide quoi faire de ce qu'il reçoit

Reviens à l'en-tête `Content-Type: text/html; charset=utf-8`. Il dit deux choses : le type du contenu (`text/html`, un **type [MIME](https://www.iana.org/assignments/media-types/media-types.xhtml)**, formé d'un type et d'un sous-type) et l'encodage des caractères (`utf-8`, qui est celui qui permet d'écrire « ñ » et « á »). **Le navigateur décide ce qu'il fait d'un fichier, avant tout, d'après cet en-tête, et non d'après l'extension du nom.** Si le serveur dit `text/html`, il l'interprète comme une page ; s'il dit `text/plain`, il l'affiche comme du texte sans l'interpréter, même si le fichier s'appelle `index.html` ; s'il dit `text/css`, il le traite comme des styles ; s'il dit `text/javascript`, comme un programme ; s'il dit `application/json`, comme des données. Il y a une nuance : quand l'en-tête manque ou est douteux, le navigateur « renifle » parfois les premiers octets pour deviner le type (le [standard qui le régit](https://mimesniff.spec.whatwg.org/) l'appelle *MIME sniffing*). Pour ce qui t'importe le plus dans le cours, il ne devine pas : un module JavaScript ou une feuille de style avec le mauvais type ne sont tout simplement pas utilisés.

Les types que tu vas voir dans ce cours sont peu nombreux et il vaut mieux les reconnaître :

| Type [MIME](https://developer.mozilla.org/fr/docs/Web/HTTP/Guides/MIME_types) | Ce que c'est | Leçon |
|---|---|---|
| `text/html` | un document HTML | 2 |
| `text/css` | une feuille de style | 3 |
| `text/javascript` | un programme (la [RFC 9239](https://www.rfc-editor.org/rfc/rfc9239) a fixé ce nom comme le nom officiel) | 6 |
| `application/json` | des données en JSON | 8 |
| `image/png`, `image/svg+xml` | des images | 11 |

Tu verras que cet en-tête est le protagoniste de l'une des pannes les plus déconcertantes de la Leçon 1 : quand le serveur répond « introuvable » avec une page HTML au lieu du module JavaScript que tu attendais, le navigateur se plaint d'avoir reçu le mauvais type. Tu sauras déjà pourquoi.

#### La mémoire du web : sans état, avec cache

HTTP n'a pas de mémoire. Chaque requête est indépendante : le serveur ne sait pas, par lui-même, que tu es la même personne qui, il y a deux secondes, a demandé autre chose. On dit que c'est un protocole **sans état**. Quand un site a besoin de se souvenir de toi (que tu t'es déjà connecté, par exemple), il le fait avec une astuce posée par-dessus HTTP : il te remet un petit élément d'information appelé *[cookie](https://www.rfc-editor.org/rfc/rfc6265)* (au moyen de l'en-tête `Set-Cookie`, que [MDN explique avec des exemples](https://developer.mozilla.org/fr/docs/Web/HTTP/Guides/Cookies)) et ton navigateur le renvoie dans les requêtes suivantes vers ce site, tant qu'il reste valide (le cookie lui-même porte des règles qui limitent le domaine et les chemins auxquels il s'applique). Notre `revisor` n'en a pas besoin ; nous le mentionnons pour que tu saches qu'il existe et que la « mémoire » n'est pas dans le protocole mais posée par-dessus.

Ce qui va, en revanche, affecter ton quotidien, c'est le **[cache](https://developer.mozilla.org/fr/docs/Web/HTTP/Guides/Caching)**. Pour ne pas télécharger mille fois la même chose, le navigateur conserve des copies des réponses et, selon les en-têtes, décide s'il peut les réutiliser sans demander ou s'il doit demander « est-ce que ça a changé depuis la dernière fois ? ». Si la copie est encore valide, le navigateur l'utilise sans rien demander. Si elle a expiré, il demande, et si le fichier n'a pas changé, le serveur répond `304 Not Modified` sans corps et le navigateur réutilise la sienne ([RFC 9111](https://www.rfc-editor.org/rfc/rfc9111#section-4.3)). C'est une excellente idée pour le visiteur et un piège pour celui qui programme : tu modifies un fichier, tu recharges, et tu vois la version d'il y a dix minutes. L'onglet Réseau a une case pour le désactiver pendant que tu travailles, et tu en auras besoin dès la Leçon 1.

### 0.3 Qui fait quoi : le navigateur, le serveur et ton code

#### Le serveur : un programme qui écoute

Un **serveur** n'est pas une machine spéciale à l'allure différente : c'est un programme qui écoute sur une porte, en attendant des requêtes, et qui sait y répondre. Un serveur web peut faire deux sortes de choses. Dans le cas simple, **il lit un fichier sur le disque et l'envoie tel quel** : tu demandes `/data/services.json` et il t'envoie le fichier qui se trouve à ce chemin. On appelle cela servir du contenu **statique**, et c'est ce que fera le serveur d'entraînement de ton ordinateur, et aussi le site que tu publieras dans la Leçon 11. Dans le cas complexe, **il exécute un programme pour chaque requête** —il interroge une base de données, calcule, assemble la réponse— et le contenu est alors **dynamique**. Ce cours n'a besoin que du premier : le tableau de bord lit un fichier JSON du projet lui-même, donc il n'y a rien à programmer côté serveur.

Retiens ceci : le serveur *ne sait rien de ton écran*. Il ne sait pas quelle est sa largeur, s'il y a un lecteur d'écran, si ton code a échoué. Il ne fait que répondre à des requêtes. Et, dans le cas statique, il n'exécute pas non plus ton JavaScript : il le livre.

#### Le navigateur : il fait bien plus qu'afficher

Le navigateur est le **client**, et son nom technique, *agent utilisateur*, décrit bien son rôle : il agit au nom de la personne. Son travail, depuis que tu écris l'URL jusqu'à ce que tu voies quelque chose, est cette chaîne (la documentation de MDN et l'article classique de web.dev sur le fonctionnement des navigateurs la décrivent en détail) :

1. **Il résout le nom et ouvre la connexion** (ce que nous avons vu en 0.1 et 0.2).
2. **Il demande le document principal** avec un `GET`. Il reçoit le HTML.
3. **Il le lit et construit le [DOM](https://dom.spec.whatwg.org/)**, le *Document Object Model* : une représentation en arbre de la page, avec un nœud pour chaque balise. C'est l'arbre sur lequel travaillera ton JavaScript (Leçon 7).
4. **Il découvre de quoi il a besoin d'autre.** Pendant qu'il lit le HTML, il rencontre des références à d'autres fichiers : une feuille de style avec `<link>`, un programme avec `<script>`, une image avec `<img>`. **Chacune est une autre requête**, avec son propre chemin et son propre `GET`, que le navigateur lance souvent en parallèle.
5. **Il applique les styles** et calcule la géométrie : la taille de chaque chose et sa place.
6. **Il exécute le JavaScript**, qui peut modifier l'arbre et faire encore plus de requêtes (quand, dans la Leçon 8, tu utiliseras `fetch`, ce sera exactement cela).
7. **Il peint** le résultat à l'écran.

Dessinée comme une ligne du temps pour la page minimale ci-dessus, plus une feuille de style et un programme, cela donne ceci :

```text
tiempo →
navegador:  GET /index.html ─────────┐
servidor:                            └─ 200, HTML ──┐
navegador:                                          ├─ GET /css/main.css ─┐
                                                    ├─ GET /js/main.js  ──┤
servidor:                                           │                     └─ 200, 200
navegador:                                                                  construye, aplica, ejecuta y pinta
```

La conséquence pratique est fondamentale : **une page n'est pas un téléchargement, ce sont plusieurs**, et chacun peut réussir ou échouer séparément. Une page qui « s'affiche sans styles » n'est pas un mystère de CSS ; c'est, presque toujours, que la requête de la feuille de style a renvoyé un `404`, parce que le chemin est mal écrit. Et tu vas le voir de tes yeux dans un instant.

#### Les trois langages, et à qui appartient chacun

On comprend maintenant pourquoi le web se construit avec trois langages et non avec un seul. Le **HTML** décrit le contenu et sa signification : ceci est un titre, ceci est un tableau, ceci est un bouton. Le **CSS** décrit la présentation : couleurs, tailles, comment les choses se disposent. Le **JavaScript** décrit le comportement : ce qui se passe quand quelqu'un clique, comment les données sont demandées et affichées. Le plus souvent, chacun voyage comme un fichier distinct, avec son propre type MIME, et le navigateur les assemble (on peut aussi écrire du CSS et du JavaScript à l'intérieur du HTML lui-même, avec les balises `<style>` et `<script>`, et ils voyagent alors à l'intérieur de celui-ci). L'ordre dans lequel tu vas les apprendre —HTML, CSS, JavaScript— est aussi l'ordre de dépendance : une page doit avoir du sens avec le seul HTML, s'améliorer avec le CSS et devenir interactive avec le JavaScript. C'est l'idée de l'*amélioration progressive*, que le livre *Resilient Web Design*, de Jeremy Keith, développe plus posément et qui vaut la peine comme lecture complémentaire.

#### Ce qui arrive au navigateur appartient à celui qui le reçoit

Voici une idée que ce cours va répéter avec insistance, alors mieux vaut la comprendre à son [origine](https://www.rfc-editor.org/rfc/rfc6454). Le HTML, le CSS et le JavaScript voyagent jusqu'à la machine de la personne qui visite la page, et c'est là qu'ils s'exécutent. **Tout ce que tu remets au navigateur est lisible et modifiable par celui qui le reçoit.** N'importe qui peut ouvrir « Code source de la page », lire ton JavaScript, changer des valeurs depuis les outils du navigateur, ou même ne pas utiliser le navigateur du tout et envoyer à la main la requête qu'il veut. Il en découle deux règles qui deviendront des habitudes tout au long du cours :

- **Rien de ce qui doit rester secret ne peut vivre dans le code que tu envoies au navigateur.** Un mot de passe, une clé de service, une donnée privée : si c'est là, c'est déjà publié.
- **Rien de ce qui revient du navigateur, ou vient de l'extérieur, n'est digne de confiance.** Une validation faite dans le navigateur améliore l'expérience, mais ne protège rien : qui veut la contourner la contourne. Et un texte qui vient de l'extérieur, comme le nom d'un service, doit toujours être traité comme du texte et jamais comme du code. Dans la Leçon 7 tu verras ce qui se passe sinon (cela s'appelle XSS) et pourquoi la propriété `textContent` est la défense.

La sécurité du web n'est pas un sujet qu'on ajoute à la fin : elle vient de ce partage des rôles. Qui sait où s'exécute son code sait aussi ce qu'il peut garantir.

#### L'origine : qui peut lire quoi chez qui

Il existe une règle que le navigateur applique pour ta sécurité et qui plus d'une fois te paraîtra une gêne : la **politique de [même origine](https://developer.mozilla.org/fr/docs/Web/Security/Defenses/Same-origin_policy)**. Une **[origine](https://developer.mozilla.org/fr/docs/Glossary/Origin)** est la combinaison d'un schéma, d'un hôte et d'un port. Une page ne peut lire librement que les réponses de la même origine qu'elle ; lire celles d'une autre origine exige une permission explicite de l'autre serveur (cette permission s'appelle CORS et nous l'étudions dans la Leçon 9). Compare :

| Adresse | Même origine que `https://example.com/` ? | Pourquoi |
|---|---|---|
| `https://example.com/otra/ruta` | oui | schéma, hôte et port coïncident ; le chemin ne compte pas |
| `http://example.com/` | non | le schéma change |
| `https://www.example.com/` | non | l'hôte change |
| `https://example.com:8443/` | non | le port change |

Il y a un cas particulier qui va te mordre dans la Leçon 1 : une page ouverte directement depuis un fichier (`file:///home/ana/revisor/index.html`) n'a pas d'origine utilisable ; les navigateurs lui en attribuent une « opaque » et lui interdisent donc des choses qu'ils permettent à une page servie par HTTP. La solution est celle que tu devines déjà : servir ton projet avec un serveur local, même minimal.

#### L'onglet Réseau : voir la conversation

Tout ce qui précède peut se voir, pas seulement se croire. Les **outils de développement du navigateur** (en anglais *DevTools*) s'ouvrent avec la touche `F12`, ou avec `Ctrl`+`Maj`+`I`, et comportent plusieurs onglets. Celui qui nous intéresse aujourd'hui est **Réseau** (*Network*), qui enregistre chaque requête que fait la page. Dans Firefox, le navigateur livré avec Linux Mint, il s'ouvre aussi avec `Ctrl`+`Maj`+`E` ; dans les navigateurs basés sur Chromium, il porte le même nom et se trouve dans le même menu.

Trois règles d'usage, qui épargnent les premiers faux pas :

1. **Ouvre-le avant de charger la page.** L'onglet enregistre tant qu'il est ouvert ; ce qui s'est passé avant n'apparaît pas. Ouvre les outils, va dans l'onglet Réseau, et *ensuite* recharge avec `F5`.
2. **Regarde les colonnes.** Chaque requête est une ligne. Celles qui comptent : **État** (le code : `200`, `404`…), **Méthode** (`GET`), **Domaine** et **Fichier** (à qui et quoi on a demandé), **Type** (le type MIME, le `Content-Type` que nous avons vu), **Transféré** et **Taille** (combien d'octets ont voyagé et combien il pèse une fois décompressé) et **Temps** (combien de temps cela a pris).
3. **Clique sur une ligne.** Un volet s'ouvre avec les **en-têtes** de la requête et de la réponse, tels que nous les avons vus écrits plus haut, en plus du corps et du détail des temps.

Avec cela en main, la page d'exemple `https://example.com` est un bon premier laboratoire : elle est minuscule et son contenu est pensé pour être inoffensif. Quand je l'ai écrit, le 7 octobre 2026, cette page demandait deux choses : le document HTML et un petit programme (`/s.js`) qu'elle lie elle-même ; si aujourd'hui tu vois autre chose, la tâche est la même. Sur la ligne du document, tu verras `GET`, le domaine, `200`, le type `html`, et, dans le volet des en-têtes, les mêmes lignes que celles que `curl` a montrées.

Et ici, on referme le fil avec le projet. La colonne **Temps** est l'idée que le `revisor` va montrer pour chaque service : combien de temps s'est écoulé entre le départ de la requête et l'arrivée de la réponse. Et la colonne **État** est celle qui décidera si une ligne du tableau de bord dit « en marche » ou « en panne ». Le `revisor` est, en petit, cet onglet Réseau devenu produit : une liste de requêtes vers des services, chacune avec son état et son temps de réponse. C'est pourquoi nous commençons ici.

## L'erreur que tu vas voir

Cette leçon s'apprend en cassant des choses exprès, parce que les pannes du web ont trois formes claires et que les reconnaître est la compétence centrale. Provoque-les toi-même ; aucune n'est risquée.

**Première forme : le nom ne se résout pas (panne du DNS).** Demande une adresse qui n'existe pas. Le domaine `.invalid` est réservé justement pour cela ([RFC 2606](https://www.rfc-editor.org/rfc/rfc2606)) : il n'existera jamais.

```bash
$ curl -sS https://nombre-que-no-existe.invalid
curl: (6) Could not resolve host: nombre-que-no-existe.invalid
```

Le navigateur affiche quelque chose d'équivalent : « Impossible de trouver le serveur » ou « Hmm. We're having trouble finding that site ». Le nombre entre parenthèses est le code de sortie de `curl` (le 6 signifie « le nom n'a pas pu être résolu »). **Ce que cela signifie :** la panne s'est produite *avant* de se connecter à qui que ce soit, dans la requête DNS. Le nom est mal écrit, ou n'existe pas, ou ton résolveur ne répond pas. **Comment on y remédie :** vérifie l'orthographe du nom, et si le nom est correct, vérifie ta connexion à internet.

**Deuxième forme : personne ne répond sur cette porte (panne de la connexion).** Demande quelque chose à ton propre ordinateur là où il n'y a aucun serveur.

```bash
$ curl -sS http://localhost:8000
curl: (7) Failed to connect to localhost port 8000 after 0 ms: Couldn't connect to server
```

Le navigateur dit « Connexion impossible » ou `ERR_CONNECTION_REFUSED`. **Ce que cela signifie :** le nom a été résolu et la machine existe, mais aucun programme n'écoute sur cette porte. **Comment on y remédie :** le serveur est éteint, ou il écoute sur une autre porte ; démarre-le, ou corrige le numéro. Remarque la différence avec le cas précédent : ici, il y avait bien une adresse à atteindre.

**Troisième forme : il y a eu une réponse, et c'est une mauvaise nouvelle (panne de HTTP).** Demande une ressource qui n'existe pas sur un serveur qui, lui, existe.

```bash
$ curl -sI https://example.com/nada.html | head -1
HTTP/2 404 
```

**Ce que cela signifie :** tout le chemin a fonctionné —nom, connexion, chiffrement, requête—, le serveur a compris et a répondu qu'il n'a pas cette ressource. **Comment on y remédie :** le chemin est mal écrit, ou le fichier n'est pas là où tu le dis. Dans le navigateur, ouvre `https://example.com/nada.html` et regarde l'onglet Réseau : tu verras une ligne avec l'état `404` et, malgré cela, une page affichée à l'écran. C'est la preuve de ce que nous avons dit plus haut : un `404` est une réponse.

Avec ces trois formes tu peux ranger n'importe quel symptôme dans une carte en trois couches, qui est l'outil de débogage le plus utile de cette leçon :

| Jusqu'où est allée la conversation ? | Couche | Symptôme typique | Quoi vérifier |
|---|---|---|---|
| Le nom ne s'est pas résolu | **Nom** (DNS) | `Could not resolve host`, « serveur introuvable » | orthographe, connexion, résolveur |
| Il s'est résolu, mais personne ne répond sur la porte | **Connexion** (TCP/TLS) | `Failed to connect`, `ERR_CONNECTION_REFUSED`, certificat TLS invalide ou expiré | que le serveur soit allumé, la porte, la validité du certificat TLS |
| Il y a eu une réponse avec un code 4xx ou 5xx | **Réponse** (HTTP) | `404`, `500`, `503` | chemin, permissions, état du serveur |

Avant de changer une ligne de code, demande-toi dans quelle ligne tu es.

## Ce qui se fait de travers

**Dire « le serveur est en panne » face à n'importe quel échec.** Un `404`, un délai dépassé, un certificat TLS expiré et un nom mal écrit sont quatre problèmes différents avec quatre remèdes différents. Coût : des heures à chercher au mauvais endroit. Correction : regarde d'abord le code d'état et la couche (le tableau ci-dessus).

**Écrire les fichiers avec des majuscules, des espaces ou des accents.** `Logo Principal.PNG` fonctionne sur ton ordinateur et se casse sur le serveur Linux où tu publieras. Coût : un `404` qui n'apparaît qu'à la publication, le pire moment. Correction : minuscules, tirets au lieu d'espaces, sans accents : `logo-principal.png`.

**Se fier au cadenas comme à un sceau de qualité.** HTTPS dit que le canal est privé et que le nom est authentique, pas que le site est honnête ni qu'il est exempt d'erreurs. Coût : croire en un site à cause d'un signal qui ne promettait pas cela. Correction : HTTPS est nécessaire, jamais suffisant.

**Cacher quelque chose dans le code du navigateur.** Une clé « obscurcie » dans du JavaScript reste sur la machine de quiconque ouvre la page. Coût : une fuite qu'on ne peut pas retirer. Correction : ce qui est secret vit sur un serveur, jamais dans ce qui est envoyé au navigateur.

**Déboguer en rechargeant.** Recharger dix fois « pour voir si cette fois ça marche » sans ouvrir l'onglet Réseau, c'est deviner. Coût : du temps, et la tentation de changer du code qui n'était pas mauvais. Correction : ouvre l'onglet Réseau, recharge, et lis quelle requête a échoué et avec quel état.

**Ne pas savoir quelle version du fichier tu regardes.** Le cache livre l'ancienne copie pendant que tu modifies la nouvelle. Coût : déboguer un problème que tu as déjà corrigé. Correction : pendant le développement, avec les outils ouverts, coche « Désactiver le cache » dans l'onglet Réseau.

## Exercices

Les deux premiers utilisent un crayon et le terminal ; le troisième, le navigateur ; le quatrième rassemble tout.

### Exercice 1 — Découpe l'URL

Écris sur une feuille les parties de ces trois URL (schéma, hôte, port —même s'il n'est pas écrit—, chemin, paramètres, fragment) et réponds : lesquelles deux partagent la même origine ?

1. `https://example.com/data/services.json?status=down#row-3`
2. `http://localhost:8000/index.html`
3. `https://example.com:443/css/main.css`

### Exercice 2 — Lis une conversation avec `curl`

Avec `curl` installé (sinon, `sudo apt install curl`), exécute `curl -I https://example.com` et `curl -v https://example.com -o /dev/null`. Réponds par écrit : (a) quelle version de HTTP et quel code d'état ont été renvoyés ? (b) quel est le `Content-Type` ? (c) quelle version de TLS a été négociée ? (d) combien d'adresses IP le nom a-t-il résolues ?

### Exercice 3 — Compte les requêtes d'une page

Ouvre Firefox, ouvre les outils (`F12`), va dans l'onglet **Réseau** et *ensuite* écris `https://example.com`. (a) Combien de lignes apparaissent ? (b) Pour la première : méthode, état, type, taille. (c) Coche « Désactiver le cache », recharge avec `F5` et compare la colonne Transféré avec le chargement précédent. (d) Visite maintenant `https://example.com/nada.html` : quel état a la ligne, et pourquoi voit-on une page malgré cela ?

### Exercice 4 — Classe les symptômes

Pour chaque symptôme, dis dans quelle couche il s'est produit (nom, connexion ou réponse) et ce que tu vérifierais en premier : (a) `curl: (7) Failed to connect to localhost port 8000` ; (b) la page apparaît, mais sans aucun style, et dans l'onglet Réseau la feuille de style a l'état `404` ; (c) `curl: (6) Could not resolve host` ; (d) le navigateur affiche une page « 502 Bad Gateway » ; (e) tu ouvres le tableau de bord depuis un fichier et un module JavaScript ne se charge pas (indice : pense à l'origine).

## Solutions

### Exercice 1 — Découpe l'URL

1. Schéma `https` ; hôte `example.com` ; port 443 (celui que le navigateur suppose pour `https`) ; chemin `/data/services.json` ; paramètres `?status=down` ; fragment `#row-3`.
2. Schéma `http` ; hôte `localhost` ; port `8000` ; chemin `/index.html` ; sans paramètres ni fragment.
3. Schéma `https` ; hôte `example.com` ; port `443` (écrit, bien que ce soit celui qui était déjà supposé) ; chemin `/css/main.css` ; sans paramètres ni fragment.

La 1 et la 3 partagent la même origine : même schéma (`https`), même hôte (`example.com`) et même port (443 dans les deux, écrit ou non). Le fait qu'elles aient des chemins différents ne compte pas. La 2 change de schéma, d'hôte et de port.

### Exercice 2 — Lis une conversation avec `curl`

Les valeurs de cet exemple sont celles que j'ai obtenues le 7 octobre 2026 ; les tiennes peuvent différer sur ce qui est variable (dates, adresses), pas sur la forme.

(a) `HTTP/2 200` : version 2 du protocole, code `200` (succès). (b) `text/html; charset=utf-8`. (c) `TLSv1.3`, sur la ligne `SSL connection using TLSv1.3 …`. (d) Deux : `104.20.23.154` et `172.66.147.243` (ligne `IPv4:` de la sortie). Si dans ta sortie le protocole est `HTTP/1.1`, ton `curl` a négocié la version précédente et c'est tout aussi correct : la signification ne change pas.

### Exercice 3 — Compte les requêtes d'une page

(a) Deux au moment où j'écris ceci (le document et le programme `/s.js`) ; si aujourd'hui il y a un autre nombre, note celui que tu vois. (b) `GET`, `200`, type `html`, une taille de quelques centaines d'octets. (c) Avec le cache désactivé, la colonne Transféré montre la taille réellement téléchargée à chaque rechargement ; avec le cache activé, il peut apparaître « en cache » ou une valeur plus petite ou nulle, parce que le navigateur a réutilisé sa copie. (d) État `404` : le serveur a répondu qu'il n'a pas cette ressource, mais sa réponse comprend une page qui dit précisément cela, et le navigateur l'affiche. La conversation s'est bien passée ; la ressource n'existe pas.

### Exercice 4 — Classe les symptômes

(a) **Connexion.** Le nom a été résolu et la machine existe, mais personne n'écoute sur la porte 8000 : vérifie que le serveur est allumé et que c'est bien cette porte. (b) **Réponse**, dans une requête secondaire : le document principal s'est bien passé et la feuille de style a renvoyé `404` ; vérifie le chemin du `<link>` et les majuscules du nom du fichier. (c) **Nom.** Il n'y a même pas eu de connexion : vérifie l'orthographe de l'hôte et ta connexion. (d) **Réponse** : un code 5xx. C'est un serveur intermédiaire (une *passerelle* ou *proxy*) qui a répondu, qui a transmis ta requête au vrai serveur et en a reçu une réponse invalide ([RFC 9110 §15.6.3](https://www.rfc-editor.org/rfc/rfc9110#section-15.6.3)). Si le vrai serveur n'avait simplement pas répondu à temps, le code serait un autre : `504 Gateway Timeout`. Ce n'est pas quelque chose que tu répares dans ta page : on le signale à qui administre le service. (e) **Origine :** le navigateur ne laisse pas une page en `file://` charger des modules parce que son origine est opaque ; la solution, que tu verras dans la Leçon 1, est de servir le dossier par HTTP.

## Comment savoir que j'ai réussi

Cette leçon est une leçon de compréhension, et cela aussi peut se mesurer. Tu es prêt pour la suivante quand :

- `curl -I https://example.com` t'imprime sur la première ligne un `HTTP/2 200` (ou `HTTP/1.1 200 OK`) et que tu sais expliquer chaque mot de cette ligne.
- Tu peux prendre une URL quelconque et indiquer son schéma, son hôte, son port, son chemin, ses paramètres et son fragment sans aide, et tu sais lequel d'entre eux ne voyage pas jusqu'au serveur.
- Tu as ouvert l'onglet Réseau **avant** de charger une page, trouvé la requête principale et lu son état, son type et son temps.
- Face aux trois erreurs de la section « L'erreur que tu vas voir », tu dis la bonne couche sans consulter le tableau.
- Tu peux expliquer avec tes mots, en deux phrases, pourquoi « charger une page » représente plusieurs requêtes et pourquoi ce que tu remets au navigateur ne peut pas être secret.

Si l'une des cinq ne te vient pas, retourne à la sous-section correspondante ; ce sont les bases des onze leçons qui suivent. Et note dans le [journal de bord](https://github.com/HabilMX/curso-web/blob/main/fr/bitacora.md) ce qui t'a coûté : c'est la partie du cours que toi seul lis.

## Pour aller plus loin

- [Comment fonctionne le web, de MDN](https://developer.mozilla.org/fr/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works) — la même histoire racontée par ceux qui maintiennent la documentation de la plateforme, avec plus d'images.
- [Aperçu de HTTP, de MDN](https://developer.mozilla.org/fr/docs/Web/HTTP/Guides/Overview) — l'étape suivante si tu veux voir HTTP plus en profondeur, y compris les en-têtes que nous ne faisons ici que nommer.
- [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110) — la définition officielle des méthodes, des codes et des en-têtes ; c'est une référence, on la consulte, on ne la lit pas d'une traite.
- [Resilient Web Design, de Jeremy Keith](https://resilientwebdesign.com/) — l'histoire et la philosophie du web, et l'origine de l'idée de construire par couches.
