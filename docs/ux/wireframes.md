# Wireframes — Ma liste d'épicerie (MVP)

Statut : **Proposé** — basse fidélité, mobile d'abord (360 px), contenus réels. Pas de couleurs ici : voir [design-system.md](design-system.md). Textes exacts : [textes-interface.md](textes-interface.md).

Légende : `[ ]` case non cochée · `[x]` case cochée · `(Suppr.)` = bouton icône poubelle (nom accessible « Supprimer lait ») · `[ Ajouter ]` bouton · `~~texte~~` texte barré.

## Structure commune (mobile 360 px)

```
+--------------------------------------+
| Ma liste d'épicerie        (h1)      |  <- en-tête, 56 px
| [Hors ligne ...]  (si hors ligne)    |  <- bandeau d'état, seulement si utile
+--------------------------------------+
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

Hiérarchie : 1) la liste « À prendre » ; 2) le champ d'ajout (action principale, bouton plein) ; 3) « Dans le panier » (visuellement atténué). Ordre de tabulation = ordre de lecture : titre, indication hors ligne, liste (case puis Supprimer pour chaque ligne), message d'annulation, champ, bouton Ajouter.

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
Le focus est déjà dans le champ : la première action est évidente. L'icône est décorative (`aria-hidden`).

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
+--------------------------------------+
| Nouvel article                       |
| [____________________] [ Ajouter ]   |
+--------------------------------------+
```
Un article coché se distingue **sans la couleur** par : (1) la section « Dans le panier », (2) la coche dans la case, (3) le texte barré. Quand on coche « pain », il quitte « À prendre » et rejoint « Dans le panier » (règle d'ordre de EPI-002 ; question ouverte sur l'emplacement exact et sur le saut de la ligne sous le doigt, voir le rapport à Jean-Marc). Le focus clavier suit l'article déplacé et un message `role="status"` annonce « « pain » mis dans le panier ».

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
+--------------------------------------+
| Nouvel article                       |
| [____________________] [ Ajouter ]   |
+--------------------------------------+
```
La section « À prendre » disparaît quand elle est vide ; le message (`role="status"`) la remplace.

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
Choix : l'app fonctionne **entièrement** sans réseau ; on n'affiche donc pas une erreur mais une information rassurante. Le bandeau apparaît quand le réseau tombe et disparaît quand il revient (annonce `role="status"`, pas d'alerte sonore). Recommandation : variante A (ce bandeau). Variante B : ne rien afficher du tout, puisque rien ne change pour Math ; plus épuré, mais Math ne sait pas si ses ajouts sont « bien gardés » et c'est précisément son angoisse au magasin. Je préfère A. **Condition** : le texte n'est vrai que si les données sont bien enregistrées sur le téléphone (voir rapport, point pour Charle).

## Écran 9 — Erreur d'enregistrement (proposé, hors critères actuels)

```
| (!) Impossible d'enregistrer ta liste|
|     sur ce téléphone. Libère de      |
|     l'espace puis réessaie.          |
|     [ Réessayer ]                    |
```
Aucune story ne couvre cet échec de stockage, or « zéro article perdu » est l'objectif du MVP. À trancher par Jean-Marc (voir rapport).

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
