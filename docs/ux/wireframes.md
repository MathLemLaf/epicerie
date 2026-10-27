# Wireframes — Ma liste d'épicerie (MVP)

Statut : **Proposé** — basse fidélité, mobile d'abord (360 px), contenus réels. Pas de couleurs ici : voir [design-system.md](design-system.md). Textes exacts : [textes-interface.md](textes-interface.md).

Légende : `[ ]` case non cochée · `[x]` case cochée · `(Suppr.)` = bouton icône poubelle (nom accessible « Supprimer lait ») · `[ Ajouter ]` bouton · `~~texte~~` texte barré.

## Structure commune (mobile 360 px)

```
+--------------------------------------+
| Ma liste d'épicerie        (h1)      |  <- en-tête, 56 px
| [Bandeau d'état]  (si utile)         |  <- UN SEUL à la fois : erreur d'enregistrement
+--------------------------------------+     (écran 9) > confirmation > liste illisible
                                               (écran 11) > hors ligne (écran 8)
|                                      |
|  À prendre (3)             (h2)      |
|  [ ] pain                    (Suppr.)|  <- zone défilante
|  [ ] lait 2 L                (Suppr.)|     (liste <ul>)
|  [ ] œufs                    (Suppr.)|
|                                      |
|  Dans le panier (1)        (h2)      |
|  [x] ~~beurre~~              (Suppr.)|
|                                      |
+--------------------------------------+
|  [Message d'annulation, si suppr.]   |  <- zone de messages, au-dessus de la barre
+--------------------------------------+
| Nouvel article                       |  <- barre d'ajout FIXE en bas
| [____________________] [ Ajouter ]   |     (zone du pouce)
+--------------------------------------+
```

Hiérarchie : 1) la liste « À prendre » ; 2) le champ d'ajout (action principale, bouton plein) ; 3) « Dans le panier » (visuellement atténué). Ordre de tabulation = ordre de lecture : titre, bandeau d'état (avec son bouton s'il en a un : « Réessayer » ou « Fermer »), liste (case puis Supprimer pour chaque ligne), message d'annulation, champ, bouton Ajouter.

## Barre d'ajout entièrement touchable — EPI-001

Situation : Math est en cuisine, une main mouillée. Sur iPhone, Safari **ne peut pas** ouvrir le clavier tout seul (décision validée par Math) : il faut un toucher. Ce toucher doit donc rater le moins possible (loi de Fitts) : **toute la barre est la cible**, pas seulement le champ.

```
+--------------------------------------+ <- filet 1 px en haut de la barre
|  8 px                                |
|  Nouvel article                      | \
|  4 px                                |  |  ZONE A (toucher = focus dans le champ
|  [Ex. : lait 2 L ______] [ Ajouter ] |  |  et clavier ouvert) : toute la barre,
|        champ 48 px     8   96 x 48   |  |  pleine largeur de la colonne, sauf B.
|  8 px + zone de sécurité de l'iPhone | /   Hauteur ~ 88 px, jamais moins de 48.
+--------------------------------------+
                              B = bouton « Ajouter » : ajoute l'article.
```

- **Zone A** = étiquette, champ, marges et espace de 8 px entre le champ et le bouton. Elle fait la **largeur de la colonne** (360 px sur téléphone, 560 px max au-delà) et **≥ 48 px de haut** (≈ 88 px réels). Elle est visuellement une seule bande : fond `couleur-surface` et filet en haut, pour qu'elle se lise comme « ici, j'écris ». La zone de sécurité du bas de l'iPhone (barre d'accueil) prolonge le fond mais ne compte pas dans les 48 px.
- **Zone B** (« Ajouter », 96 × 48 px min.) reste un bouton distinct : toucher B ajoute, il n'ouvre pas le clavier à lui seul.
- **À l'ouverture** : le champ a le focus (anneau visible) mais le clavier est fermé sur iPhone. **Un toucher** n'importe où dans A ouvre le clavier, curseur dans le champ.
- **Entre deux ajouts** : le clavier **reste ouvert**. Après « Ajouter » (ou Entrée) l'article est ajouté, le champ vidé et le focus **reste** dans le champ. Un toucher dans A quand le clavier est déjà ouvert ne le ferme pas. Toucher « Ajouter » avec un champ vide affiche le message d'erreur (écran 4) et laisse le clavier ouvert.
- Principe : prévention de l'erreur et loi de Fitts. Objectif de Math : ouvrir, un toucher, écrire, valider, en moins de 5 s.
- Contrainte technique (pour Pierrick, voir les points de la livraison) : sur iOS, le focus doit être donné **pendant** le geste de l'utilisateur ; voir « Pour l'équipe » du rapport. **[non vérifié sur iPhone réel : Julie, 5 essais]**.

## Écran 1 — Liste vide (première ouverture, ou tout supprimé) — EPI-003

```
+--------------------------------------+
| Ma liste d'épicerie                  |
+--------------------------------------+
|                                      |
|                                      |
|         (icône panier, décorative)   |
|                                      |
|      Ta liste est vide.              |
|      Écris ton premier article       |
|      ci-dessous, par exemple         |
|      « lait » ou « pain ».           |
|                                      |
|                                      |
+--------------------------------------+
| Nouvel article                       |
| [Ex. : lait 2 L ______] [ Ajouter ]  |  <- focus automatique ici
+--------------------------------------+
```
Le focus est déjà dans le champ : la première action est évidente. L'icône est décorative (`aria-hidden`). Sur iPhone le clavier est fermé : un toucher sur la barre (voir « Barre d'ajout entièrement touchable ») l'ouvre. Ce texte « première ouverture » n'est **jamais** utilisé après une liste illisible : voir l'écran 11b.

## Écran 2 — Liste avec articles cochés et non cochés — EPI-002

```
+--------------------------------------+
| Ma liste d'épicerie                  |
+--------------------------------------+
| À prendre (3)                        |
| +----------------------------------+ |
| | [ ] pain                 (Suppr.)| |  <- ligne min. 56 px
| +----------------------------------+ |     toucher la ligne = cocher
| | [ ] lait 2 L             (Suppr.)| |
| +----------------------------------+ |
| | [ ] œufs                 (Suppr.)| |
| +----------------------------------+ |
|                                      |
| Dans le panier (2)                   |
| +----------------------------------+ |
| | [x] ~~beurre~~           (Suppr.)| |  <- texte barré, atténué, case pleine
| +----------------------------------+ |
| | [x] ~~pommes Cortland~~  (Suppr.)| |
| +----------------------------------+ |
| [ Retirer les 2 articles cochés ]    |  <- EPI-006, fin de section (écran 10)
+--------------------------------------+
| Nouvel article                       |
| [____________________] [ Ajouter ]   |
+--------------------------------------+
```
Un article coché se distingue **sans la couleur** par : (1) la section « Dans le panier », (2) la coche dans la case, (3) le texte barré. Règle d'ordre **validée par Math** : quand on coche « pain », il quitte « À prendre » et se place **en tête** de « Dans le panier » ; décoché, il retourne **à la fin** de « À prendre ». Le focus clavier suit l'article déplacé et un message `role="status"` annonce « « pain » mis dans le panier ».

## Écran 3 — Ajout (clavier du téléphone ouvert)

```
+--------------------------------------+
| Ma liste d'épicerie                  |
| À prendre (3)                        |
| [ ] pain                    (Suppr.) |  <- la liste reste visible et défile
| [ ] lait 2 L                (Suppr.) |
+--------------------------------------+
| Nouvel article                       |
| [crème sû|__________] [ Ajouter ]    |  <- curseur, bouton « Entrée » = Ajouter
+--------------------------------------+
|  clavier du téléphone                |
+--------------------------------------+
```
Le clavier est ouvert parce que Math a touché la barre (un toucher, n'importe où hors « Ajouter ») et il **reste ouvert** pendant toute la série d'ajouts.

Après « Ajouter » : l'article apparaît en bas de « À prendre » (défilement automatique pour le montrer), le champ est vidé, le focus **reste** dans le champ, et un message discret annonce « « crème sûre » ajouté à la liste. » (zone `role="status"`, lu par les lecteurs d'écran ; texte visible bref sous la barre ou dans la zone de messages).

## Écran 4 — Erreur : nom vide

```
+--------------------------------------+
| ...liste...                          |
+--------------------------------------+
| Nouvel article                       |
| (!) Écris le nom d'un article pour   |  <- texte + icône, rouge foncé
|     l'ajouter.                       |
| [____________________] [ Ajouter ]   |  <- bordure rouge 2 px + focus dans le champ
+--------------------------------------+
```
Le champ reste en place ; aucun article n'est ajouté ; le message disparaît dès que Math tape. Le champ a `aria-invalid` et pointe vers le message (`aria-describedby`).

## Écran 5 — Erreur : nom trop long

```
+--------------------------------------+
| Nouvel article                       |
| (!) Le nom est trop long : 100       |
|     caractères au maximum (tu en as  |
|     112). Raccourcis-le.             |
| [lait biologique de la ferme...    ] |
|                          112 / 100   |  <- compteur rouge
|                      [ Ajouter ]     |
+--------------------------------------+
```
Avant l'erreur : le compteur « 85 / 100 » apparaît dès 80 caractères (prévention). **Le champ ne doit pas bloquer la frappe à 100** (sinon le scénario « 101 caractères » de EPI-001 devient impossible à atteindre et un collage serait tronqué en silence). Texte conservé, rien n'est coupé.

## Écran 6 — Suppression avec annulation (5 s) — EPI-005

```
+--------------------------------------+
| À prendre (2)                        |
| [ ] pain                    (Suppr.) |
| [ ] œufs                    (Suppr.) |  <- « lait » a disparu
|                                      |
+--------------------------------------+
| +----------------------------------+ |
| | « lait 2 L » supprimé  [Annuler] | |  <- message flottant, 5 s
| +----------------------------------+ |     bouton Annuler 48 px
| Nouvel article                       |
| [____________________] [ Ajouter ]   |
+--------------------------------------+
```
- Pas de confirmation préalable : la suppression est immédiate, l'annulation compense.
- Le message se place **au-dessus** de la barre d'ajout, sans la couvrir.
- Après « Annuler » : « lait 2 L » revient à sa place avec son état, le focus va sur lui, message : « « lait 2 L » remis dans la liste. »
- Le minuteur se met en pause tant que le message a le focus ou est survolé.
- Après suppression, le focus passe à la case de l'article suivant (ou précédent, ou au champ d'ajout si la liste est vide).

## Écran 7 — Tout est dans le panier — EPI-002

```
+--------------------------------------+
| Ma liste d'épicerie                  |
+--------------------------------------+
|  (icône coche, décorative)           |
|  Tout est dans ton panier !          |
|  Il ne reste rien à prendre.         |
|                                      |
| Dans le panier (4)                   |
| [x] ~~pain~~                (Suppr.) |
| [x] ~~lait 2 L~~            (Suppr.) |
| [x] ~~œufs~~                (Suppr.) |
| [x] ~~beurre~~              (Suppr.) |
| [ Retirer les 4 articles cochés ]    |
+--------------------------------------+
| Nouvel article                       |
| [____________________] [ Ajouter ]   |
+--------------------------------------+
```
La section « À prendre » disparaît quand elle est vide ; le message la remplace. Décision du 2026-10-19 (validée par Math) : le message est **statique** (pas de `role="status"` propre) ; l'annonce passe par la zone d'annonces commune, en une phrase : « « beurre » mis dans le panier. Tout est dans ton panier ! Il ne reste rien à prendre. ». Typographie : « Tout est dans ton panier ! » en gras, « Il ne reste rien à prendre. » en texte normal (voir design-system.md). Le bouton de retrait (EPI-006) est le prolongement naturel de cet écran : tout est pris, on repart à zéro.

## Écran 8 — Hors ligne — EPI-004

```
+--------------------------------------+
| Ma liste d'épicerie                  |
| +----------------------------------+ |
| | (icône) Hors ligne. Ta liste     | |  <- bandeau neutre, non alarmant,
| | fonctionne normalement.          | |     affiché seulement sans réseau
| +----------------------------------+ |
| À prendre (3)                        |
| ...                                  |
```
**Priorité d'affichage** : ce bandeau cède la place au bandeau d'erreur d'enregistrement (écran 9) tant que l'erreur dure, car « Ta liste fonctionne normalement » serait alors faux. Il cède aussi la place à l'avis « liste illisible » (écran 11) tant que Math ne l'a pas fermé : c'est la priorité la plus basse, et il revient, sans nouvelle annonce, dès que la place est libre.

Choix : l'app fonctionne **entièrement** sans réseau ; on n'affiche donc pas une erreur mais une information rassurante. Le bandeau apparaît quand le réseau tombe et disparaît quand il revient (annonce `role="status"`, pas d'alerte sonore). Recommandation : variante A (ce bandeau). Variante B : ne rien afficher du tout, puisque rien ne change pour Math ; plus épuré, mais Math ne sait pas si ses ajouts sont « bien gardés » et c'est précisément son angoisse au magasin. Je préfère A. **Condition** : le texte n'est vrai que si les données sont bien enregistrées sur le téléphone (voir rapport, point pour Charle).

## Écran 9 — Erreur d'enregistrement — EPI-016 (dans le MVP, décision de Math)

États de l'écran, de haut en bas : échec, nouvel essai raté, réussite.

```
(a) Échec (persistant)                     (b) Nouvel essai raté
+--------------------------------------+   +--------------------------------------+
| Ma liste d'épicerie                  |   | Ma liste d'épicerie                  |
| +----------------------------------+ |   | +----------------------------------+ |
| | (!) Impossible d'enregistrer ta  | |   | | (!) Impossible d'enregistrer ta  | |
| |     liste sur ce téléphone :     | |   | |     liste sur ce téléphone :     | |
| |     <cause + consigne, voir      | |   | |     <cause + consigne, voir      | |
| |     variantes ci-dessous>        | |   | |     variantes ci-dessous>        | |
| |     [ Réessayer ]                | |   | |     Nouvel essai sans succès.    | |
| +----------------------------------+ |   | |     [ Réessayer ]                | |
| À prendre (3)                        |   | +----------------------------------+ |
| [ ] pain ... lait ... (lait reste)   |   +--------------------------------------+

(c) Réussite (5 s, puis le bandeau disparaît ou redevient « Hors ligne » si c'est le cas)
| +----------------------------------+ |
| | (coche) Ta liste est de nouveau  | |
| |         enregistrée.             | |
| +----------------------------------+ |
```
**Deux causes, deux phrases** (même structure : « Impossible d'enregistrer ta liste sur ce téléphone : » + cause + consigne). Textes exacts dans textes-interface.md.
- *Stockage plein* (`QuotaExceededError`) : « …il n'y a plus assez d'espace. Libère de l'espace, puis réessaie. » Math peut agir sur le téléphone.
- *Accès refusé* (contrôle écriture-lecture au démarrage) : « …le navigateur refuse de garder des données. Vérifie les réglages de confidentialité du navigateur (et la navigation privée), puis réessaie. » Aucune mention d'espace.
- *Cause inconnue* (repli) : phrase neutre qui cite les deux pistes.
Ce qui change pour Math : seulement la cause et la consigne. Bandeau, bouton « Réessayer », persistance, annonces et nouvel essai raté sont identiques. « Réessayer » reste offert dans les deux cas (après un changement de réglage, il peut réussir) ; aucune promesse que la liste affichée sera retrouvée.

**Emplacement** : dans le **bandeau d'état sous le titre**, pas dans le message flottant du bas. Raison : le message flottant disparaît au bout de 5 s et n'existe qu'une fois à la fois ; l'erreur, elle, doit rester tant qu'elle dure et ne doit jamais être chassée par un message d'annulation. Les deux peuvent donc coexister (bandeau en haut, message d'annulation en bas) sans se concurrencer.

**Le bandeau d'erreur REMPLACE le bandeau « Hors ligne »** (décision UX, voir le rapport) : un seul bandeau à la fois, priorité à l'erreur. Pas de message contradictoire (« fonctionne normalement » vs « impossible d'enregistrer »). Le bandeau « Hors ligne » revient, sans nouvelle annonce, quand l'erreur disparaît et que le téléphone est encore sans réseau.

Comportement :
- **Rien ne disparaît** : l'article ajouté, coché ou retiré reste dans l'état affiché ; la liste affichée est la vérité de travail jusqu'à ce qu'elle soit enregistrée. Le champ d'ajout se vide comme d'habitude puisque l'article est dans la liste (le bandeau dit que ce n'est pas gardé).
- **Persistant** : aucun minuteur, aucune fermeture manuelle. Seul un enregistrement réussi le retire.
- **Réessayer** enregistre la liste **telle qu'elle est affichée à ce moment-là** (pas seulement le dernier changement). Réussite : le bandeau passe en confirmation (c) 5 s ; le focus revient au champ d'ajout (le bouton vient de disparaître). Échec : la ligne « Nouvel essai sans succès. » est affichée et annoncée (sinon l'appui sur le bouton ne produirait aucun retour) ; le focus reste sur « Réessayer ».
- Annonces : l'échec est annoncé par `role="alert"` (assertif : c'est la seule situation où on interrompt l'utilisateur) ; la réussite et le nouvel essai raté par `role="status"` (poli).
- Pendant l'échec, les annonces de changement de réseau (« Hors ligne… », « De retour en ligne. ») sont suspendues.

## Écran 10 — Retirer d'un coup les articles cochés (retrait immédiat + « Annuler » 5 s) — EPI-006

Situation : Math rentre de l'épicerie, tout est coché (ou presque). Il veut repartir avec une liste propre.

```
(a) Avant                                  (b) Juste après (il reste « sel »)
+--------------------------------------+   +--------------------------------------+
| Ma liste d'épicerie                  |   | Ma liste d'épicerie                  |
+--------------------------------------+   +--------------------------------------+
| À prendre (1)                        |   | À prendre (1)                        |
| [ ] sel                     (Suppr.) |   | [ ] sel     <- focus ici  (Suppr.)   |
|                                      |   |                                      |
| Dans le panier (2)                   |   |   (la section « Dans le panier »     |
| [x] ~~pain~~                (Suppr.) |   |    a disparu)                        |
| [x] ~~lait 2 L~~            (Suppr.) |   +--------------------------------------+
| 16 px                                |   | +----------------------------------+ |
| [ Retirer les 2 articles cochés ]    |   | | 2 articles retirés     [Annuler] | |
+--------------------------------------+   | +----------------------------------+ |
| Nouvel article                       |   | Nouvel article                       |
| [____________________] [ Ajouter ]   |   | [____________________] [ Ajouter ]   |
+--------------------------------------+   +--------------------------------------+

(c) Tout retiré = liste vide (écran 1) avec le message d'annulation
+--------------------------------------+
| Ma liste d'épicerie                  |
|        (icône panier, décorative)    |
|      Ta liste est vide.              |
|      Écris ton premier article       |
|      ci-dessous, par exemple         |
|      « lait » ou « pain ».           |
| +----------------------------------+ |
| | 2 articles retirés     [Annuler] | |
| +----------------------------------+ |
| Nouvel article                       |
| [Ex. : lait 2 L ______] [ Ajouter ]  |  <- focus ici
+--------------------------------------+
```

### Emplacement du bouton
**À la fin de la section « Dans le panier »**, sous la dernière ligne, pleine largeur de colonne, 48 px de haut, **16 px de vide** au-dessus. Style : bouton secondaire (contour, pas plein, pas rouge). Raisons :
- *Proximité* : le bouton agit sur la section ; il est dans la section, après la liste qu'il vide, et le nombre qu'il porte (« 2 articles ») se lit juste après les lignes concernées.
- *Prévenir l'erreur* : pas dans l'en-tête de section. Quand on coche des articles en série, les lignes remontent d'un cran sous le doigt (règle EPI-002) ; un bouton collé au titre de section risquerait de recevoir un toucher destiné à une ligne. En bas de section, il est loin de la zone où l'on coche.
- *Hiérarchie* : une seule action principale (Ajouter, plein, en bas). Le retrait est secondaire : contour seulement.
- *Variante B (non retenue)* : bouton texte à droite du titre « Dans le panier (2) ». Plus visible sur une longue liste, mais risque de toucher accidentel et il se replie sous le titre à 200 % de zoom.
- La section « Dans le panier » est masquée quand elle est vide : le bouton **n'existe donc pas** quand rien n'est coché (critère « aucun article coché » respecté sans cas particulier).

### Libellé et message
- Bouton : « Retirer les 2 articles cochés » ; au singulier « Retirer l'article coché ». Le nombre est dans le libellé (prévention : on sait ce qui part avant de toucher, ce qui remplace la confirmation).
- Message : « 2 articles retirés » / « 1 article retiré » (le nombre, jamais les noms : une liste de 15 noms serait illisible), bouton « Annuler ». Même composant que le message de EPI-005 : même place (au-dessus de la barre d'ajout, sans la masquer), 5 s, pause au survol et au focus, 48 px.

### Annulation
« Annuler » rétablit **tous** les articles retirés, cochés, dans leur ordre d'origine, en tête de « Dans le panier » (devant les articles éventuellement cochés entre-temps). La section réapparaît, le focus va au **premier** article rétabli, et on annonce « 2 articles remis dans la liste. ».

### Un seul message à la fois (EPI-005 + EPI-006)
Le message flottant est un emplacement unique. Toute nouvelle suppression ou tout nouveau retrait **remplace** le message courant et **relance** les 5 s. L'action précédente devient alors définitive (plus annulable). Quatre cas :

| Séquence (en moins de 5 s) | Résultat |
|---|---|
| Suppression de « lait », puis retrait des cochés | Message « 2 articles retirés » ; « lait » est définitivement supprimé, « Annuler » ne rétablit que les 2 retirés |
| Retrait des cochés, puis suppression de « sel » | Message « « sel » supprimé » ; le retrait est définitif, « Annuler » ne rétablit que « sel » |
| Retrait, puis cochage d'un article, puis nouveau retrait | Message « 1 article retiré » ; le premier retrait est définitif |
| Retrait, puis ajout ou cochage (sans nouveau retrait) | Le message reste jusqu'à la fin de son délai ; « Annuler » rétablit les articles retirés |

Le minuteur est partagé par le message : une pause (survol/focus) bloque la disparition, mais n'empêche pas un autre message de le remplacer.

### Focus
Le bouton de retrait disparaît avec sa section : le focus ne doit pas se perdre. Même règle que EPI-005 (voisin, sinon champ) : le focus va au **dernier article de « À prendre »** (celui qui précède la section retirée), sinon au **champ d'ajout** quand la liste est vide (écran c). Après « Annuler », le focus va au premier article rétabli.

### Annonces (zones `aria-live` polies)
- Retrait : « 2 articles retirés » (dans le message flottant, `role="status"`).
- Retrait qui vide la liste : « 2 articles retirés. » puis, dans la zone d'annonces, « Ta liste est vide. ».
- Annulation : « 2 articles remis dans la liste. ».
- Le message flottant porte l'annonce du retrait ; la zone d'annonces séparée ne répète pas le même texte (pas de double lecture).

### État après « tout retiré »
C'est la **liste vide** de EPI-003 (écran 1), pas « Tout est dans ton panier » : plus aucun article. Le message d'annulation est visible au-dessus de la barre d'ajout. Après 5 s, il disparaît et il ne reste que l'écran 1.

## Écran 11 — Liste enregistrée illisible — EPI-017 (dans le MVP, décision de Math)

Situation : Math ouvre l'app et sa liste est abîmée (texte illisible ou format inconnu). L'app repart d'une liste vide. Le pire serait que Math croie avoir une liste vide « normale », ajoute trois articles et ne sache jamais que l'ancienne liste existait. Il faut lui dire quoi, sans l'affoler : rien n'est effacé.

```
(a) Ouverture, liste illisible, rien d'ajouté      (b) Après « Fermer » (liste encore vide)
+--------------------------------------+          +--------------------------------------+
| Ma liste d'épicerie                  |          | Ma liste d'épicerie                  |
| +----------------------------------+ |          +--------------------------------------+
| | (!) Ta liste n'a pas pu être     | |          |                                      |
| |     relue.                       | |          |      (icône panier, décorative)      |
| |     L'app repart d'une liste     | |          |    Ta nouvelle liste est vide.       |
| |     vide. Rien n'est effacé :    | |          |    Tu peux y ajouter des articles    |
| |     une copie de ta liste est    | |          |    ci-dessous.                       |
| |     gardée sur ce téléphone.     | |          |                                      |
| |     [ Fermer ]                   | |          +--------------------------------------+
| +----------------------------------+ |          | Nouvel article                       |
|                                      |          | [Ex. : lait 2 L ______] [ Ajouter ]  |
|      (icône panier, décorative)      |          +--------------------------------------+
|    Ta nouvelle liste est vide.       |
|    Tu peux y ajouter des articles    |
|    ci-dessous.                       |
+--------------------------------------+
| Nouvel article                       |
| [Ex. : lait 2 L ______] [ Ajouter ]  |  <- focus ici (clavier fermé sur iPhone)
+--------------------------------------+
```

**Emplacement** : dans le **bandeau d'état sous le titre**, au même endroit que l'erreur d'enregistrement (écran 9) et pour la même raison : il doit rester tant que Math ne l'a pas lu, donc pas dans le message flottant de 5 s en bas. Même gabarit que le bandeau d'erreur (bordure 2 px `couleur-erreur`, icône « ! », texte `couleur-texte`) : même famille visuelle (cohérence), car c'est aussi un « quelque chose ne va pas ».

**Priorité des bandeaux** (un seul à la fois, inchangé) : erreur d'enregistrement > confirmation d'enregistrement > **liste illisible** > hors ligne.
- Erreur d'enregistrement d'abord : c'est l'état courant, et il demande une action (Réessayer). L'avis « illisible » est masqué le temps qu'elle dure, puis il revient.
- Confirmation avant « illisible » : après « Réessayer », Math doit voir que ça a marché ; le retour de l'avis 5 s plus tard se fait **sans nouvelle annonce**.
- « Illisible » avant « Hors ligne » : « Ta liste fonctionne normalement » serait alors trompeur. En contrepartie, tant que Math n'a pas fermé l'avis, le bandeau « Hors ligne » n'est pas visible ; il le redevient dès la fermeture.
- Variante B (non retenue) : empiler les deux bandeaux. Plus complet, mais à 200 % de zoom ou avec le clavier ouvert, deux bandeaux mangent la moitié de l'écran de 640 px de haut.

**Fermeture** : l'avis **reste jusqu'à ce que Math le ferme** (l'hypothèse de Jean-Marc est retenue). Raisons : l'information est importante et non répétée ; un délai ferait disparaître une alerte sur l'état de ses données pendant qu'il ne regarde pas l'écran (WCAG 2.2.1) ; et fermer est un geste volontaire, une preuve qu'il a lu. Contrairement à l'erreur d'enregistrement, ce n'est pas un état qui se « répare » : il y a donc un bouton **Fermer** (vrai `<button>`, 48 px, secondaire).
- La fermeture ne dure que pour la session : si Math ferme l'avis puis ferme l'app **sans rien ajouter**, la liste abîmée est toujours là à la prochaine ouverture et l'avis revient. Il disparaît pour de bon quand un enregistrement réussit (la liste valide remplace le texte abîmé ; la copie de secours, elle, reste).
- Ajouter un article **ne ferme pas** l'avis : Math peut continuer à noter ses articles, l'avis reste visible au-dessus.

**Annonce** : `role="alert"` à l'apparition (assertif : ses données ne sont pas celles qu'il croit). Une seule fois ; le retour de l'avis après un bandeau de priorité supérieure est silencieux. Le focus **ne bouge pas** : il reste dans le champ d'ajout (l'action principale, et ne pas voler le focus). Dans l'ordre de tabulation, « Fermer » vient juste après le titre. Après « Fermer », le focus passe au **champ d'ajout** (le bouton vient de disparaître ; jamais sur `body`).

### Écran 11b — La liste vide affichée après une liste illisible

La liste vide **n'est jamais présentée comme une première ouverture** (« Ta liste est vide. Écris ton premier article… » dit « tout est normal, c'est ton premier lancement » : faux et dangereux ici). Dans ce cas, l'écran 1 est remplacé par une variante :
- Titre : « Ta nouvelle liste est vide. » ; aide : « Tu peux y ajouter des articles ci-dessous. » (pas de « premier »).
- Cette variante reste affichée **même après « Fermer »**, tant qu'aucun enregistrement n'a réussi (voir ci-dessus). Après un ajout, l'écran 1 n'apparaît plus de toute façon.
- Elle n'apparaît **jamais** dans les autres cas : première ouverture et liste valide sans article gardent l'écran 1 inchangé, sans avis (« jamais de fausse alerte »).
- Cas particulier : l'avis « illisible » n'est pas utilisé pour « accès refusé » ou « stockage plein » : ce sont des pannes d'enregistrement, traitées par l'écran 9.

## Écrans plus larges (tablette, bureau)

```
+--------------------------------------------------+
|        +--------------------------------+        |
|        | Ma liste d'épicerie            |        |
|        | À prendre (3) ...              |        |
|        | ...                            |        |
|        | [ Nouvel article ... ][Ajouter]|        |
|        +--------------------------------+        |
+--------------------------------------------------+
```
Même mise en page : une colonne centrée de **560 px maximum**, barre d'ajout collée au bas de la colonne. Pas de panneau latéral (rien d'autre à montrer). À 200 % de zoom ou 320 px de large : la colonne occupe toute la largeur, aucun défilement horizontal ; les noms longs passent à la ligne (pas de coupure en « … » qui cacherait l'information).
