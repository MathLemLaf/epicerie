# Backlog — Ma liste d'épicerie (préfixe `EPI`)

Statut du backlog : **MVP validé par Math** (EPI-001 à EPI-006 + thème sombre). Les stories EPI-016 (échec d'enregistrement) et les choix marqués « hypothèse » attendent son accord : voir « À valider par Math » dans le rapport du 2026-10-19.
Dernière mise à jour : 2026-10-19 — Jean-Marc (PO).
Vision : [vision.md](vision.md). Identifiants stables, jamais réutilisés (import Jira prévu).
UX : [parcours](../ux/parcours.md) · [wireframes](../ux/wireframes.md) · [design system](../ux/design-system.md) · [accessibilité](../ux/accessibilite.md) · [textes](../ux/textes-interface.md).

## Vue d'ensemble (ordre de priorité)

| Rang | ID | Titre | Épopée | Priorité | Statut |
|---|---|---|---|---|---|
| 1 | EPI-001 | Ajouter un article à ma liste | Construire ma liste | Must (MVP) | À faire |
| 2 | EPI-002 | Cocher un article mis dans le panier | Faire l'épicerie | Must (MVP) | À faire |
| 3 | EPI-003 | Retrouver ma liste à la réouverture | Construire ma liste | Must (MVP) | À faire |
| 4 | EPI-004 | Utiliser ma liste sans connexion | Faire l'épicerie | Must (MVP) | À faire |
| 5 | EPI-005 | Supprimer un article | Construire ma liste | Must (MVP) | À faire |
| 6 | EPI-016 | Ne jamais perdre un article en silence (échec d'enregistrement) | Construire ma liste | Must (MVP) | À faire |
| 7 | EPI-006 | Retirer d'un coup les articles cochés | Faire l'épicerie | Must (MVP) | À faire |
| 8 | EPI-015 | Thème sombre automatique | Construire ma liste | Must (MVP, voulu par Math) | À faire |
| 9 | EPI-007 | Indiquer une quantité | Construire ma liste | Should | À faire |
| 10 | EPI-008 | Corriger le nom d'un article | Construire ma liste | Should | À faire |
| 11 | EPI-009 | Être averti d'un article en double | Construire ma liste | Could | À faire |
| 12 | EPI-010 | Réajouter un article déjà acheté | Construire ma liste | Could | À faire |
| 13 | EPI-011 | Regrouper les articles par rayon | Faire l'épicerie | Could | À faire |
| — | EPI-012 | Partager la liste avec ma famille | Partager | Won't (cette fois) | — |
| — | EPI-013 | Avoir plusieurs listes | Construire ma liste | Won't (cette fois) | — |
| — | EPI-014 | Suivre les prix et un budget | — | Won't (cette fois) | — |

Aucune story n'est encore « Prête » : voir la section **Definition of Ready** en bas.

## Décisions de Math intégrées (2026-10-19)
Tutoiement dans l'interface · champ d'ajout en bas, clavier ouvert à l'ouverture · bandeau « Hors ligne. Ta liste fonctionne normalement. » · suppression par bouton poubelle sans confirmation, « Annuler » 5 s (pause au survol/focus) · deux sections « À prendre » / « Dans le panier » · thème sombre automatique dans le MVP · EPI-006 remontée en Must · pas de blocage de la frappe à 100 caractères (compteur dès 80, caractères visibles) · un seul message d'annulation à la fois.

## Règles communes à tout le MVP
- **Ordre d'affichage** (hypothèse H-A, à valider par Math) :
  - « À prendre » : dans l'ordre d'ajout ; un nouvel article ou un article décoché va **à la fin**.
  - « Dans le panier » : le dernier article coché est **en tête** de la section (il atterrit juste sous « À prendre », près du doigt ; l'article qu'on vient de cocher par erreur se retrouve tout de suite).
  - L'ordre affiché est conservé tel quel à la réouverture (EPI-003).
- **Trois états d'écran** (exclusifs) : (a) *liste vide* = aucun article du tout (EPI-003, écran 1) ; (b) *tout est pris* = au moins un article et tous cochés (EPI-002, écran 7) ; (c) *liste normale*. Une section vide est masquée ; les compteurs `(N)` n'apparaissent qu'avec leur section.
- **Accessibilité** : chaque story ci-dessous inclut un scénario « exigences d'accessibilité » qui renvoie à [accessibilite.md](../ux/accessibilite.md) (§A : exigences A1 à A13 valables partout ; §B : critères propres à la story). Julie les teste ; seuls les points les plus mesurables sont recopiés ici.
- **Textes** : exacts dans [textes-interface.md](../ux/textes-interface.md) (tutoiement).

---

## Épopée : Construire ma liste
Noter ce qu'il faut acheter, dès qu'on y pense, sans rien perdre.

## EPI-001 — Ajouter un article à ma liste
- Épopée : Construire ma liste
- Priorité : Must (MVP)
- Statut : À faire (voir Definition of Ready)
- Story : En tant que personne qui fait l'épicerie, je veux ajouter un article à ma liste en tapant son nom afin de ne pas l'oublier au magasin.
- Règles :
  - Le nom est un texte libre (ex. « lait 2 L », « pommes Cortland »).
  - Les espaces au début et à la fin sont retirés.
  - Longueur : 1 à 100 caractères **visibles** après retrait des espaces (« œ » et « é » comptent pour 1).
  - **La frappe n'est jamais bloquée** ni tronquée en silence, même au-delà de 100 (décision de Math) : on valide ou on refuse à l'ajout.
  - Un nouvel article s'ajoute **à la fin** de « À prendre ».
- Critères d'acceptation :
  ```
  Scénario : ajout réussi
    Étant donné que ma liste contient « pain »
    Quand je saisis « lait » et je valide
    Alors « lait » apparaît dans « À prendre », après « pain », comme non coché
    Et le champ de saisie est vidé et garde le focus, prêt pour un autre article
    Et la liste défile jusqu'au nouvel article

  Scénario : valider au clavier ou au bouton
    Quand je saisis « sel » puis j'appuie sur Entrée
    Alors « sel » est ajouté
    Quand je saisis « poivre » puis je touche « Ajouter »
    Alors « poivre » est ajouté

  Scénario : prêt à écrire dès l'ouverture
    Étant donné que l'app est fermée
    Quand je l'ouvre
    Alors le curseur est dans le champ « Nouvel article », placé en bas de l'écran
    Et le clavier du téléphone est ouvert sans autre toucher (faisabilité selon la plateforme : voir Dépendances)

  Scénario : ajout rapide
    Étant donné que l'app est fermée
    Quand je l'ouvre, saisis « œufs » et valide
    Alors « œufs » est visible dans la liste en moins de 5 secondes au total (mesuré au chronomètre, saisie comprise)

  Scénario : nom vide refusé
    Étant donné que le champ est vide ou ne contient que des espaces
    Quand je valide
    Alors aucun article n'est ajouté
    Et le message « Écris le nom d'un article pour l'ajouter. » s'affiche près du champ, avec une icône
    Et le focus reste dans le champ
    Et le message disparaît dès que je modifie la saisie

  Scénario : espaces retirés
    Quand je saisis «   beurre  » et je valide
    Alors l'article affiché est « beurre »

  Scénario : accents conservés
    Quand je saisis « crème sûre » et je valide
    Alors l'article affiché est exactement « crème sûre »

  Scénario : exactement 100 caractères
    Quand je saisis un nom de 100 caractères visibles et je valide
    Alors l'article est ajouté en entier

  Scénario : compteur dès 80 caractères
    Quand je tape 79 caractères
    Alors aucun compteur n'est affiché
    Quand je tape le 80e
    Alors le compteur « 80 / 100 » apparaît et suit ma frappe

  Scénario : 101 caractères ou plus refusés, sans perte du texte
    Quand je tape ou colle un nom de 112 caractères visibles et je valide
    Alors l'article n'est pas ajouté
    Et le message « Le nom est trop long : 100 caractères au maximum (tu en as 112). Raccourcis-le. » s'affiche
    Et le compteur « 112 / 100 » est affiché en rouge
    Et mon texte est conservé en entier dans le champ

  Scénario : la frappe n'est jamais bloquée
    Quand je colle un texte de 150 caractères dans le champ
    Alors les 150 caractères sont présents dans le champ (rien n'est coupé)

  Scénario : correction après refus
    Étant donné qu'un nom de 112 caractères a été refusé
    Quand je supprime 12 caractères et je valide
    Alors l'article est ajouté et le message d'erreur a disparu

  Scénario : exigences d'accessibilité
    Alors les exigences de accessibilite.md §A (A1 à A13) et §B « EPI-001 » sont satisfaites
    Et la cible « Ajouter » et le champ font au moins 48 px de haut
    Et l'ajout est annoncé : « « lait » ajouté à la liste. »
  ```
- Dépendances : squelette d'app et ADR de Charle. **Décision d'architecture requise (Charle)** : stack, et confirmer si « clavier ouvert à l'ouverture » (décidé par Math) est réalisable sur la plateforme choisie (certains navigateurs mobiles refusent d'ouvrir le clavier sans geste) ; sinon, retour à Math avec une alternative.

## EPI-003 — Retrouver ma liste à la réouverture
- Épopée : Construire ma liste
- Priorité : Must (MVP)
- Statut : À faire (voir Definition of Ready)
- Story : En tant que personne qui fait l'épicerie, je veux retrouver ma liste telle que je l'ai laissée afin de pouvoir la remplir au fil de la semaine sans rien perdre.
- Règles :
  - « **Liste vide** » = aucun article du tout. C'est différent de « tout est pris » (EPI-002), où il reste des articles, tous cochés.
- Critères d'acceptation :
  ```
  Scénario : liste conservée après fermeture
    Étant donné que « À prendre » contient « pain » et « Dans le panier » contient « lait »
    Quand je ferme complètement l'app puis la rouvre
    Alors je retrouve « pain » dans « À prendre » et « lait » dans « Dans le panier », dans le même ordre

  Scénario : liste conservée après redémarrage du téléphone
    Étant donné que ma liste contient 3 articles
    Quand je redémarre le téléphone puis rouvre l'app
    Alors les 3 articles sont présents avec leur état et leur ordre

  Scénario : première ouverture (liste vide)
    Étant donné que je n'ai jamais utilisé l'app
    Quand je l'ouvre
    Alors je vois « Ta liste est vide. Écris ton premier article ci-dessous, par exemple « lait » ou « pain ». »
    Et le curseur est dans le champ d'ajout
    Et je ne vois ni section « À prendre », ni section « Dans le panier », ni le message « Tout est dans ton panier ! »

  Scénario : liste redevenue vide
    Étant donné que ma liste ne contient qu'« œufs »
    Quand je supprime « œufs »
    Alors l'état « liste vide » s'affiche (même message que la première ouverture)

  Scénario : sortie de l'état vide
    Étant donné une liste vide
    Quand j'ajoute « lait »
    Alors le message « liste vide » disparaît et « lait » apparaît sous « À prendre (1) »

  Scénario : exigences d'accessibilité
    Alors accessibilite.md §A et §B « EPI-003 » sont satisfaites (message d'état vide lu, focus dans le champ)
  ```
- Dépendances : EPI-001. **Décision d'architecture requise (Charle)** : où et comment la liste est conservée.

## EPI-005 — Supprimer un article
- Épopée : Construire ma liste
- Priorité : Must (MVP)
- Statut : À faire (voir Definition of Ready)
- Story : En tant que personne qui fait l'épicerie, je veux supprimer un article ajouté par erreur afin que ma liste ne contienne que ce que je dois vraiment acheter.
- Règles (décisions de Math) :
  - Un bouton poubelle **visible sur chaque ligne** ; aucune confirmation avant suppression.
  - Un message « Annuler » reste affiché **5 secondes** ; le minuteur est en pause tant que le message est survolé ou a le focus, et reprend ensuite là où il s'était arrêté (hypothèse).
  - **Un seul message à la fois : seule la dernière suppression est annulable.**
  - La suppression est enregistrée tout de suite ; « Annuler » rétablit l'article.
- Critères d'acceptation :
  ```
  Scénario : suppression d'un article
    Étant donné que ma liste contient « pain », « lait », « œufs » dans « À prendre »
    Quand je touche la poubelle de la ligne « lait »
    Alors la liste contient « pain », « œufs », dans cet ordre, sans demande de confirmation
    Et le message « « lait » supprimé » avec le bouton « Annuler » s'affiche au-dessus de la barre d'ajout, sans la masquer

  Scénario : suppression annulée
    Étant donné que je viens de supprimer « lait »
    Quand j'annule dans les 5 secondes
    Alors « lait » réapparaît à sa place d'origine, dans sa section, avec son état (coché ou non)
    Et le focus est sur « lait »
    Et « « lait » remis dans la liste. » est annoncé

  Scénario : suppression d'un article coché annulée
    Étant donné que « beurre » est dans « Dans le panier »
    Quand je le supprime puis j'annule
    Alors « beurre » revient dans « Dans le panier », coché, à sa place

  Scénario : le message disparaît après 5 secondes
    Étant donné que je viens de supprimer « lait » et que je n'ai touché à rien
    Alors le message disparaît après 5 secondes (tolérance ± 0,5 s) et la suppression est définitive

  Scénario : pause du minuteur
    Étant donné que je viens de supprimer « lait »
    Quand je survole le message ou je lui donne le focus pendant 10 secondes
    Alors le message est toujours affiché
    Quand je m'en éloigne
    Alors il disparaît après le temps restant

  Scénario : suppressions rapprochées
    Étant donné que je supprime « lait » puis, 2 secondes plus tard, « pain »
    Alors le message n'affiche que « « pain » supprimé » avec un nouveau délai de 5 secondes
    Et « Annuler » ne rétablit que « pain »
    Et « lait » n'est plus annulable (suppression définitive)

  Scénario : ajout pendant le message
    Étant donné que je viens de supprimer « lait »
    Quand j'ajoute « sel »
    Alors le message d'annulation reste affiché jusqu'à la fin de son délai
    Et « Annuler » rétablit « lait » à sa place d'origine, « sel » restant en fin de liste

  Scénario : suppression conservée
    Étant donné que j'ai supprimé « lait » sans annuler
    Quand je ferme puis rouvre l'app
    Alors « lait » n'apparaît pas

  Scénario : fermeture pendant le délai d'annulation
    Étant donné que je viens de supprimer « lait » (moins de 5 secondes)
    Quand je ferme puis rouvre l'app
    Alors « lait » n'apparaît pas

  Scénario : nom long dans le message
    Étant donné un article de 80 caractères
    Quand je le supprime
    Alors le message affiche ses 30 premiers caractères suivis de « … » (la liste, elle, ne tronque jamais)

  Scénario : focus après suppression
    Quand je supprime un article au clavier
    Alors le focus passe à l'article suivant, sinon au précédent, sinon au champ d'ajout

  Scénario : exigences d'accessibilité
    Alors accessibilite.md §A et §B « EPI-005 » sont satisfaites
    Et le bouton « Supprimer » de chaque ligne mesure 48 × 48 px et s'appelle « Supprimer « lait » »
    Et le message d'annulation est atteignable au clavier et lu par un lecteur d'écran
  ```
- Dépendances : EPI-001 ; EPI-003 (scénarios de persistance). **Décision d'architecture requise (Charle)** : stack.

## EPI-016 — Ne jamais perdre un article en silence (échec d'enregistrement)
- Épopée : Construire ma liste
- Priorité : Must (MVP) — l'objectif « zéro article perdu » n'est pas tenu si un échec d'enregistrement est invisible
- Statut : À faire (voir Definition of Ready) — **nouvelle story, proposée par Jean-Marc, à valider par Math**
- Story : En tant que personne qui fait l'épicerie, je veux être prévenu clairement quand ma liste n'a pas pu être enregistrée sur mon téléphone afin de ne pas croire à tort que mes articles sont gardés.
- Règles :
  - Tout changement (ajout, cochage, suppression, retrait, annulation) peut échouer à l'enregistrement (ex. téléphone plein).
  - Un échec n'est **jamais silencieux**, et l'écran ne dit jamais « enregistré » si ce n'est pas vrai.
  - Textes : écran 9 des wireframes, [textes-interface.md](../ux/textes-interface.md).
- Critères d'acceptation :
  ```
  Scénario : échec visible
    Étant donné que l'enregistrement sur le téléphone est impossible (échec simulé)
    Quand j'ajoute « lait »
    Alors le message « Impossible d'enregistrer ta liste sur ce téléphone. Libère de l'espace puis réessaie. » s'affiche avec une icône et un bouton « Réessayer »
    Et le message est annoncé par un lecteur d'écran

  Scénario : rien ne disparaît de l'écran
    Étant donné le même échec
    Alors « lait » reste visible dans la liste, et le texte que j'avais saisi n'est pas effacé sans explication
    Et les articles déjà présents restent affichés

  Scénario : réessayer avec succès
    Étant donné que le message d'échec est affiché et que le problème est réglé
    Quand je touche « Réessayer »
    Alors le message disparaît et « Ta liste est de nouveau enregistrée. » est annoncé (texte à confirmer avec Jean-François)
    Et après fermeture puis réouverture de l'app, « lait » et tous les autres articles sont présents

  Scénario : réessayer sans succès
    Étant donné que le problème persiste
    Quand je touche « Réessayer »
    Alors le message reste affiché (il n'est jamais retiré tant que l'enregistrement échoue)

  Scénario : message persistant
    Étant donné que le message d'échec est affiché
    Alors il ne disparaît pas tout seul après un délai

  Scénario : pas de faux message rassurant
    Étant donné que le téléphone est hors ligne ET que l'enregistrement échoue
    Alors le bandeau « Hors ligne. Ta liste fonctionne normalement. » n'est pas affiché
    Et le message d'échec d'enregistrement l'est

  Scénario : exigences d'accessibilité
    Alors le bouton « Réessayer » fait 48 × 48 px minimum, est atteignable au clavier, et le message respecte le contraste de accessibilite.md §A1 dans les deux thèmes
  ```
- Dépendances : EPI-001 (et toutes les actions qui modifient la liste). **Ce qui dépend de l'ADR de Charle** : quelles pannes de stockage sont détectables, comment les simuler dans les tests (« échec simulé »), et si la liste peut être sauvée autrement. Si certains échecs ne sont pas détectables, Charle le dit et on ajuste les critères (retour à Math).
- Note : écran 9 de Jean-François = proposition, non validée explicitement par Math à ce jour.

## EPI-015 — Thème sombre automatique
- Épopée : Construire ma liste
- Priorité : Must (MVP) — voulu par Math ; dans le MVP même si le bénéfice clé (noter vite, ne rien oublier) existe sans lui
- Statut : À faire (voir Definition of Ready)
- Story : En tant que personne qui consulte sa liste le soir à la maison, je veux que l'app prenne l'apparence sombre quand mon téléphone est en mode sombre afin de ne pas être ébloui et de garder un texte lisible.
- Règles : suit le réglage du téléphone, **sans** commutateur dans l'app (hors périmètre). Couleurs : section « Thème sombre » de [design-system.md](../ux/design-system.md).
- Critères d'acceptation :
  ```
  Scénario : téléphone en mode sombre
    Étant donné que le réglage d'apparence du téléphone est « sombre »
    Quand j'ouvre l'app
    Alors tous les écrans (liste, liste vide, tout est pris, hors ligne, erreurs, message d'annulation) s'affichent avec les couleurs du thème sombre

  Scénario : téléphone en mode clair
    Étant donné que le réglage est « clair »
    Alors l'app s'affiche avec le thème clair

  Scénario : changement pendant l'utilisation
    Étant donné que l'app est ouverte en thème clair
    Quand je passe le téléphone en mode sombre
    Alors l'app passe au thème sombre en moins de 1 seconde, sans que je perde ma saisie ni ma liste

  Scénario : pas d'éclair blanc
    Étant donné que le téléphone est en mode sombre
    Quand j'ouvre l'app
    Alors aucun fond clair n'apparaît pendant le chargement (vérifié en observant l'ouverture, 5 essais)

  Scénario : contrastes dans les deux thèmes
    Alors dans chaque thème, le texte a un contraste d'au moins 4,5:1 et les éléments d'interface (bordures, cases, focus) d'au moins 3:1, mesurés avec un outil sur l'app rendue

  Scénario : information non portée par la couleur seule
    Alors dans le thème sombre aussi, un article coché se distingue en niveaux de gris (coche, texte barré, section)
  ```
- Dépendances : écrans EPI-001 à EPI-005 pour être vérifiée en entier ; peut se développer tôt si Charle valide que le thème repose sur des variables de couleur (point d'attention pour Charle).

## EPI-007 — Indiquer une quantité
- Épopée : Construire ma liste
- Priorité : Should
- Statut : À faire
- Story : En tant que personne qui fait l'épicerie, je veux indiquer combien j'en veux afin de ne pas acheter trop ou pas assez.
- Critères d'acceptation :
  ```
  Scénario : quantité saisie
    Quand j'ajoute « yogourt » avec la quantité 4
    Alors la liste affiche « yogourt » et la quantité 4

  Scénario : quantité absente
    Quand j'ajoute « pain » sans quantité
    Alors la liste affiche « pain » sans quantité

  Scénario : quantité invalide
    Quand je saisis une quantité de 0, négative ou non numérique
    Alors l'article n'est pas ajouté et un message indique qu'il faut un nombre entier de 1 à 99
  ```
- Dépendances : EPI-001. À confirmer après l'usage du MVP (hypothèse H4 : le nom libre suffit peut-être). Écrans à produire par Jean-François.

## EPI-008 — Corriger le nom d'un article
- Épopée : Construire ma liste
- Priorité : Should
- Statut : À faire
- Story : En tant que personne qui fait l'épicerie, je veux corriger le nom d'un article afin de réparer une faute de frappe sans le supprimer et le recréer.
- Critères d'acceptation :
  ```
  Scénario : correction réussie
    Étant donné que ma liste contient « lati »
    Quand je modifie son nom en « lait » et je valide
    Alors l'article affiche « lait », à la même place et avec le même état

  Scénario : correction invalide
    Quand je remplace le nom par un texte vide ou de plus de 100 caractères visibles
    Alors le nom d'origine est conservé et un message explique pourquoi
  ```
- Dépendances : EPI-001. Écrans à produire par Jean-François.

## EPI-009 — Être averti d'un article en double
- Épopée : Construire ma liste
- Priorité : Could
- Statut : À faire
- Story : En tant que personne qui fait l'épicerie, je veux être averti quand j'ajoute un article déjà présent afin de ne pas l'acheter deux fois.
- Critères d'acceptation :
  ```
  Scénario : doublon non coché
    Étant donné que ma liste contient « Lait » non coché
    Quand j'ajoute « lait »
    Alors l'article n'est pas ajouté une deuxième fois
    Et un message indique que « Lait » est déjà dans la liste

  Scénario : doublon déjà coché
    Étant donné que ma liste contient « lait » coché
    Quand j'ajoute « lait »
    Alors « lait » redevient non coché (en fin de « À prendre »), sans créer de doublon
  ```
- Dépendances : EPI-001, EPI-002. Comparaison sans tenir compte des majuscules ni des espaces ; accents à préciser.

## EPI-010 — Réajouter un article déjà acheté
- Épopée : Construire ma liste
- Priorité : Could
- Statut : À faire
- Story : En tant que personne qui achète souvent les mêmes produits, je veux retrouver les articles achetés les semaines précédentes afin de les remettre dans ma liste sans les retaper.
- Critères d'acceptation : à détailler avant d'entrer dans un sprint (story non prête).
- Dépendances : EPI-006 (les articles retirés alimentent l'historique).

## EPI-013 — Avoir plusieurs listes
- Épopée : Construire ma liste
- Priorité : Won't (cette fois)
- Raison : une seule liste suffit pour prouver la valeur (hypothèse H3).

---

## Épopée : Faire l'épicerie
Au magasin, voir d'un coup d'œil ce qui reste à prendre.

## EPI-002 — Cocher un article mis dans le panier
- Épopée : Faire l'épicerie
- Priorité : Must (MVP)
- Statut : À faire (voir Definition of Ready)
- Story : En tant que personne qui fait l'épicerie, je veux cocher un article quand je le mets dans mon panier afin de voir d'un coup d'œil ce qu'il me reste à prendre.
- Règles :
  - Deux sections : « À prendre (N) » puis « Dans le panier (N) ». Une section vide est masquée.
  - Cocher = toucher la ligne entière (sauf le bouton Supprimer) ; décocher = même geste.
  - Un article coché quitte « À prendre » et se place **en tête de « Dans le panier »** ; un article décoché va **à la fin de « À prendre »** (hypothèse H-A, voir « Règles communes »).
  - Coché se distingue sans la couleur : case pleine avec coche + texte barré + section.
  - L'article qui change de section « saute » : le focus le suit et le changement est annoncé. Les lignes qui suivent remontent d'un cran (comportement accepté : cocher plusieurs articles de suite est le geste courant).
- Critères d'acceptation :
  ```
  Scénario : cocher un article
    Étant donné que « À prendre » contient « pain », « lait », « œufs »
    Quand je touche la ligne « pain »
    Alors « À prendre (2) » contient « lait », « œufs »
    Et « Dans le panier (1) » contient « pain », coché et barré
    Et « « pain » mis dans le panier. » est annoncé

  Scénario : emplacement d'un article coché
    Étant donné que « Dans le panier » contient « beurre » et que « À prendre » contient « pain »
    Quand je coche « pain »
    Alors « Dans le panier » affiche « pain » puis « beurre »

  Scénario : décocher un article
    Étant donné que « pain » est dans « Dans le panier » et que « À prendre » contient « lait », « œufs »
    Quand je touche la ligne « pain »
    Alors « À prendre » affiche « lait », « œufs », « pain » (pain en dernier), non coché
    Et « « pain » remis dans les articles à prendre. » est annoncé

  Scénario : cochage par erreur corrigé
    Étant donné que j'ai coché « pain » par erreur
    Quand je touche à nouveau « pain » dans « Dans le panier »
    Alors « pain » revient en fin de « À prendre »

  Scénario : tout est pris
    Étant donné que ma liste contient « pain » et « lait »
    Quand je les coche tous les deux
    Alors la section « À prendre » disparaît
    Et « Tout est dans ton panier ! Il ne reste rien à prendre. » s'affiche et est annoncé
    Et « Dans le panier (2) » liste les deux articles

  Scénario : tout est pris n'est pas la liste vide
    Étant donné que tous les articles sont cochés
    Alors le message « Ta liste est vide. » n'est pas affiché

  Scénario : sortie de « tout est pris »
    Étant donné que tous les articles sont cochés
    Quand j'ajoute « sel », ou je décoche « pain »
    Alors le message « Tout est dans ton panier ! » disparaît et la section « À prendre » réapparaît

  Scénario : distinction sans la couleur
    Étant donné qu'un article est coché et un autre non
    Quand j'affiche la liste en niveaux de gris
    Alors je distingue encore l'article coché de l'autre (coche, barré, section)

  Scénario : cible de cochage
    Alors la ligne mesure au moins 56 px de haut et la zone de cochage au moins 48 px

  Scénario : exigences d'accessibilité
    Alors accessibilite.md §A et §B « EPI-002 » sont satisfaites (clavier : Espace coche ; focus suit l'article déplacé ; animation éventuelle ≤ 200 ms et supprimée avec « réduire les animations »)
  ```
- Dépendances : EPI-001. **Décision d'architecture requise (Charle)** : stack.

## EPI-004 — Utiliser ma liste sans connexion
- Épopée : Faire l'épicerie
- Priorité : Must (MVP)
- Statut : À faire (voir Definition of Ready)
- Story : En tant que personne qui fait l'épicerie, je veux consulter et modifier ma liste même sans réseau afin de ne pas être bloqué au fond du magasin.
- Règles : l'app fonctionne **entièrement** sans réseau (rien n'est dégradé) ; aucune erreur ni fenêtre bloquante à cause de l'absence de réseau.
- Critères d'acceptation — **comportement utilisateur (indépendants de l'ADR)** :
  ```
  Scénario : consulter hors ligne
    Étant donné que ma liste contient 3 articles
    Et que le téléphone est en mode avion
    Quand j'ouvre l'app
    Alors je vois mes 3 articles en moins de 2 secondes

  Scénario : tout faire hors ligne
    Étant donné que le téléphone est en mode avion
    Quand je coche « pain », j'ajoute « sel » et je supprime « œufs »
    Alors les changements sont visibles immédiatement
    Et ils sont toujours là après fermeture et réouverture de l'app, toujours en mode avion

  Scénario : bandeau hors ligne
    Étant donné que l'app est ouverte avec du réseau
    Quand le réseau tombe
    Alors le bandeau neutre « Hors ligne. Ta liste fonctionne normalement. » apparaît sous le titre et est annoncé une seule fois
    Et aucune erreur ni fenêtre bloquante n'est affichée

  Scénario : retour du réseau
    Étant donné le bandeau hors ligne affiché
    Quand le réseau revient
    Alors le bandeau disparaît et « De retour en ligne. » est annoncé

  Scénario : ouverture sans réseau après un usage normal
    Étant donné que j'ai déjà ouvert l'app au moins une fois avec du réseau
    Quand, plus tard (y compris après un redémarrage du téléphone), j'ouvre l'app sans aucun réseau
    Alors ma liste s'affiche comme d'habitude

  Scénario : mise à jour sans risque pour ma liste
    Étant donné que ma liste contient 5 articles dont 2 cochés
    Quand l'app est mise à jour vers une nouvelle version
    Alors je retrouve mes 5 articles avec leur état et leur ordre

  Scénario : jamais interrompu par une mise à jour
    Étant donné que je suis en train de cocher des articles
    Quand une nouvelle version est disponible
    Alors l'écran ne se recharge pas tout seul et ma saisie en cours n'est pas perdue

  Scénario : mise à jour sans réseau
    Étant donné que le téléphone est hors ligne
    Alors aucune erreur liée à une vérification de mise à jour n'est affichée et l'app fonctionne avec la version déjà présente

  Scénario : exigences d'accessibilité
    Alors accessibilite.md §A et §B « EPI-004 » sont satisfaites
  ```
- Critères d'acceptation — **qui DÉPENDENT de l'ADR de Charle (à figer quand l'ADR est « Acceptée »)** :
  ```
  Scénario : tout premier lancement sans réseau   [DÉPEND ADR]
    Étant donné que je n'ai jamais ouvert l'app sur ce téléphone
    Et que le téléphone n'a aucun réseau
    Quand j'essaie d'ouvrir l'app
    Alors (selon la plateforme choisie) :
      - soit l'app s'ouvre avec une liste vide et fonctionne normalement ;
      - soit un message en français clair explique qu'une première ouverture avec réseau est nécessaire (jamais une page d'erreur du navigateur ni un écran blanc)
    La variante retenue est à écrire ici par Jean-Marc après l'ADR ; texte du message à fournir par Jean-François si c'est la 2e.

  Scénario : quand la nouvelle version s'applique   [DÉPEND ADR]
    Étant donné qu'une nouvelle version a été téléchargée
    Alors elle s'applique à une date précise à définir (ex. à la prochaine ouverture complète de l'app) et jamais en plein usage
    La règle exacte et son test sont à écrire après l'ADR.
  ```
- Dépendances : EPI-001, EPI-002, EPI-003, EPI-016 (le bandeau ne doit pas mentir). **Décision d'architecture requise (Charle)** : fonctionnement hors ligne, premier chargement, mises à jour. Le texte du bandeau n'est vrai que si les données sont enregistrées sur le téléphone (réserve de Jean-François, écran 8).
- Taille : peut devenir trop grosse ; si Charle juge le hors ligne + mises à jour long, je la découpe en « EPI-004a Utiliser sans réseau » et « EPI-004b Mises à jour sans risque » (nouveaux identifiants, EPI-004 conservé pour la première).

## EPI-006 — Retirer d'un coup les articles cochés
- Épopée : Faire l'épicerie
- Priorité : Must (MVP) — remontée par Math
- Statut : À faire (voir Definition of Ready) — **aucun écran livré**
- Story : En tant que personne qui revient de l'épicerie, je veux retirer d'un seul geste tous les articles cochés afin de repartir avec une liste propre pour la semaine suivante.
- Règles :
  - L'action est proposée dans la section « Dans le panier » (emplacement à fixer par Jean-François).
  - **Choix de protection à trancher par Jean-François** : confirmation avant retrait (comme écrit ci-dessous) ou annulation de 5 s, cohérente avec EPI-005. Les critères ci-dessous s'appliquent à la variante « confirmation » ; ils seront adaptés si l'annulation est retenue (dans ce cas, l'annulation rétablit tous les articles retirés, en un seul message, et remplace le message de la suppression précédente).
- Critères d'acceptation :
  ```
  Scénario : retirer les cochés
    Étant donné que « Dans le panier » contient « pain » et « lait » et que « À prendre » contient « sel »
    Quand je choisis de retirer les articles cochés et je confirme
    Alors la liste ne contient plus que « sel » sous « À prendre (1) »
    Et la section « Dans le panier » a disparu

  Scénario : annuler la confirmation
    Étant donné la même liste
    Quand je choisis de retirer les articles cochés puis j'annule
    Alors la liste est inchangée

  Scénario : confirmation claire
    Quand je choisis de retirer les articles cochés
    Alors la confirmation indique le nombre d'articles concernés (ex. « Retirer 2 articles ? »)

  Scénario : aucun article coché
    Étant donné qu'aucun article n'est coché
    Alors l'action de retrait n'est pas proposée

  Scénario : tout retirer
    Étant donné que tous les articles sont cochés
    Quand je retire les articles cochés
    Alors l'état « liste vide » s'affiche (voir EPI-003)

  Scénario : retrait conservé
    Quand je ferme puis rouvre l'app après un retrait
    Alors les articles retirés n'apparaissent pas

  Scénario : exigences d'accessibilité
    Alors accessibilite.md §A (clavier, cibles de 48 px, annonce du résultat par zone d'état, focus géré après retrait) est satisfaite ; critères §B propres à EPI-006 à demander à Jean-François
  ```
- Dépendances : EPI-002, EPI-003 (persistance), EPI-016. Jean-François : parcours, écran, texte, accessibilité. **Décision d'architecture requise (Charle)** : stack.

## EPI-011 — Regrouper les articles par rayon
- Épopée : Faire l'épicerie
- Priorité : Could
- Statut : À faire
- Story : En tant que personne qui fait l'épicerie, je veux voir mes articles regroupés par rayon (fruits et légumes, produits laitiers…) afin de faire le tour du magasin sans revenir sur mes pas.
- Critères d'acceptation : à détailler avant d'entrer dans un sprint (story non prête ; liste des rayons à définir avec Math et Jean-François).
- Dépendances : EPI-001.

## EPI-014 — Suivre les prix et un budget
- Priorité : Won't (cette fois)
- Raison : ne sert pas le bénéfice clé « ne rien oublier ».

---

## Épopée : Partager

## EPI-012 — Partager la liste avec ma famille
- Épopée : Partager
- Priorité : Won't (cette fois) — **à reclasser si Math répond qu'il fait l'épicerie à plusieurs**
- Story : En tant que membre d'une famille, je veux que tout le monde ajoute à la même liste afin que la personne qui va au magasin ait tout.
- Raison : demande comptes, synchronisation et serveur ; beaucoup plus d'effort et de risque. On prouve d'abord la valeur pour une personne.

---

## Definition of Ready — état des stories du MVP (2026-10-19)

Aucun ADR n'existe encore dans `apps/epicerie/docs/decisions/` (Charle y travaille) : le critère « aucune décision d'architecture ouverte » est donc **Non** pour toutes les stories.

| Critère | EPI-001 | EPI-002 | EPI-003 | EPI-004 | EPI-005 | EPI-016 | EPI-006 | EPI-015 |
|---|---|---|---|---|---|---|---|---|
| Format « En tant que… je veux… afin de… » | Oui | Oui | Oui | Oui | Oui | Oui | Oui | Oui |
| Critères d'acceptation testables | Oui | Oui | Oui | Partiel : 2 scénarios marqués [DÉPEND ADR] | Oui | Oui (échec « simulé » : méthode selon ADR) | Oui sous réserve du choix confirmation/annulation | Oui |
| Parcours et écrans (Jean-François) | Oui (écrans 1, 3, 4, 5) | Oui (écrans 2, 7) | Oui (écran 1) | Oui (écran 8) ; texte du cas « 1er lancement sans réseau » à produire si besoin | Oui (écran 6) | Oui (écran 9, à valider par Math) | **Non** (aucun écran) | Oui (tokens du thème sombre) ; écrans en thème sombre non maquettés mais couverts par le design system |
| Aucune décision d'architecture ouverte (Charle) | **Non** | **Non** | **Non** (stockage) | **Non** (hors ligne, 1er chargement, mises à jour) | **Non** | **Non** (détection d'échec) | **Non** | **Non** (variables de couleur ; à confirmer) |
| Assez petite (quelques jours) | Oui | Oui | Oui | À surveiller (découpage prévu si besoin) | Oui | Oui | Oui | Oui |
| Statut | **À faire** | **À faire** | **À faire** | **À faire** | **À faire** | **À faire** | **À faire** | **À faire** |

**Ce qui manque pour passer à « Prête »**
- EPI-001, 002, 003, 005, 015 : ADR de Charle au statut « Acceptée » (stack ; stockage pour 003 et la persistance de 005). Rien d'autre côté produit.
- EPI-001 : en plus, Charle confirme que « clavier ouvert à l'ouverture » est faisable.
- EPI-004 : ADR sur le hors ligne, le premier chargement et les mises à jour ; ensuite j'écris les deux scénarios [DÉPEND ADR].
- EPI-016 : ADR (détection et simulation des échecs) ; accord de Math sur la story et l'écran 9.
- EPI-006 : écran et parcours de Jean-François (+ choix confirmation / annulation), puis ADR de stack.
- EPI-015 : confirmation de Charle que le thème repose sur des variables de couleur.
- Hypothèse H-A (ordre « coché en tête de Dans le panier ») : accord de Math avant de figer EPI-002 (le changement serait mineur si refusé).
