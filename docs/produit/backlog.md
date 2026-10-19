# Backlog — Ma liste d'épicerie (préfixe `EPI`)

Statut du backlog : **MVP validé par Math** (EPI-001 à EPI-006, EPI-004b, EPI-015 thème sombre, EPI-016 échec d'enregistrement, EPI-017 liste illisible en Must), avec ses ajustements iPhone (un toucher dans la barre d'ajout ouvre le clavier, règle d'installation dans le README, découpage EPI-004/004b, copie de secours sans récupération dans l'app).
Dernière mise à jour : 2026-10-19 — Jean-Marc (PO) : décisions de Math sur EPI-001 intégrées (cycle de statuts validé, collage multiligne hors MVP, pas de texte de confirmation, tests iPhone par fiche), idée EPI-018, dette EPI-019 (issue de BUG-002).

## Cycle de statuts (validé par Math)
`À faire` → `Prête` → `En développement` → `Livrée, en QA` → `Validée QA` → `Acceptée`

| Statut | Sens | Qui le pose |
|---|---|---|
| À faire | Idée ou story pas encore prête (Definition of Ready non remplie) | Jean-Marc |
| Prête | Definition of Ready remplie ; peut entrer dans un sprint | Jean-Marc |
| En développement | Pierrick travaille dessus | Pierrick / Anis |
| Livrée, en QA | Code livré, tests de Pierrick verts ; Julie teste (ou attend un test impossible à automatiser) | Pierrick / Anis |
| Validée QA | Verdict de Julie : aucun bug bloquant ni majeur ouvert, tests manuels faits | Julie |
| Acceptée | Jean-Marc a vérifié les critères un par un | Jean-Marc |

- Si Julie rend « Refusée QA », la story repasse à `En développement` (corrections et tests de non-régression), puis revient à `Livrée, en QA`.
- Si Jean-Marc refuse, même retour à `En développement`.
- On précise entre parenthèses ce qui est en attente quand c'est utile (ex. « attend les tests iPhone »).
- Les autres stories gardent leur statut actuel : `Prête` y garde son sens (prête à développer, pas encore commencée).
Vision : [vision.md](vision.md). Identifiants stables, jamais réutilisés (import Jira prévu).
Décisions techniques : ADR 0001 à 0007, toutes « Acceptée » ([architecture](../architecture.md)).
UX : [parcours](../ux/parcours.md) · [wireframes](../ux/wireframes.md) · [design system](../ux/design-system.md) · [accessibilité](../ux/accessibilite.md) · [textes](../ux/textes-interface.md).

## Vue d'ensemble (ordre de développement proposé)

| Rang | ID | Titre | Épopée | Priorité | Statut |
|---|---|---|---|---|---|
| 1 | EPI-001 | Ajouter un article à ma liste | Construire ma liste | Must (MVP) | **Livrée, en QA** (attend les tests iPhone) |
| 2 | EPI-002 | Cocher un article mis dans le panier | Faire l'épicerie | Must (MVP) | **Prête** |
| 3 | EPI-003 | Retrouver ma liste à la réouverture | Construire ma liste | Must (MVP) | **Prête** |
| 4 | EPI-016 | Ne jamais perdre un article en silence (échec d'enregistrement) | Construire ma liste | Must (MVP) | **Prête** |
| 5 | EPI-017 | Être prévenu quand ma liste enregistrée est illisible | Construire ma liste | Must (MVP) — validée par Math | **Prête** |
| 6 | EPI-005 | Supprimer un article | Construire ma liste | Must (MVP) | **Prête** |
| 7 | EPI-006 | Retirer d'un coup les articles cochés | Faire l'épicerie | Must (MVP) | **Prête** |
| 8 | EPI-015 | Thème sombre automatique | Construire ma liste | Must (MVP, voulu par Math) | **Prête** |
| 9 | EPI-004 | Utiliser ma liste sans connexion | Faire l'épicerie | Must (MVP) | **Prête** |
| 10 | EPI-004b | Mises à jour sans risque pour ma liste | Faire l'épicerie | Must (MVP) — avant le premier déploiement public | **Prête** |
| 11 | EPI-007 | Indiquer une quantité | Construire ma liste | Should | À faire |
| 12 | EPI-008 | Corriger le nom d'un article | Construire ma liste | Should | À faire |
| 13 | EPI-009 | Être averti d'un article en double | Construire ma liste | Could | À faire |
| 14 | EPI-010 | Réajouter un article déjà acheté | Construire ma liste | Could | À faire |
| 15 | EPI-011 | Regrouper les articles par rayon | Faire l'épicerie | Could | À faire |
| — | EPI-018 | Un article par ligne au collage d'un texte multiligne | Construire ma liste | Could (idée, hors MVP) | À faire |
| — | EPI-019 | Refuser tous les noms d'apparence vide (caractères invisibles) | Construire ma liste | Could (dette, hors MVP) | À faire |
| — | EPI-012 | Partager la liste avec ma famille | Partager | Won't (cette fois) | — |
| — | EPI-013 | Avoir plusieurs listes | Construire ma liste | Won't (cette fois) | — |
| — | EPI-014 | Suivre les prix et un budget | — | Won't (cette fois) | — |

Le détail de la Definition of Ready (et ce qui manque aux stories pas encore prêtes) est en bas de page.

## Décisions de Math intégrées (2026-10-19)
Tutoiement dans l'interface · champ d'ajout en bas · bandeau « Hors ligne. Ta liste fonctionne normalement. » · suppression par bouton poubelle sans confirmation · deux sections « À prendre » / « Dans le panier » · thème sombre automatique dans le MVP · EPI-006 remontée en Must et retrait immédiat sans confirmation · pas de blocage de la frappe à 100 caractères (compteur dès 80, caractères visibles) · ordre d'affichage « coché en tête de Dans le panier / décoché en fin de À prendre » · EPI-016 dans le MVP.
Décisions de la dernière série :
- **« Annuler » pendant 5 secondes partout** (EPI-005 et EPI-006), minuteur en pause au survol et au focus, **un seul message à la fois** : seule la dernière action (suppression OU retrait) est annulable.
- **Échec d'enregistrement pendant un retrait des cochés** : les articles restent affichés comme retirés, avec le bandeau d'erreur (sous le titre) **ET** le message d'annulation (au-dessus de la barre d'ajout), deux emplacements différents.
- ADR 0001 à 0005 acceptés (0006 et 0007 aussi) ; Math a un iPhone : la plateforme cible est **Safari iOS, app installée sur l'écran d'accueil**.

Décisions de Math du 2026-10-19 (série textes d'erreur et liste illisible) :
- **EPI-016 : trois textes d'erreur d'enregistrement**, tels que livrés par Jean-François dans [textes-interface.md](../ux/textes-interface.md) : *stockage plein* (`QuotaExceededError`), *accès refusé* (contrôle écriture-lecture échoué au démarrage) et un *texte de repli* (toute autre erreur d'écriture, cause inconnue). Un texte par cas ; les tests d'EPI-016 couvrent les trois.
- **Bandeau « Hors ligne » caché pendant l'avis « liste illisible »** (EPI-004, EPI-017) : un seul bandeau à la fois, pas d'empilement ; il revient après « Fermer ».
- **`background_color` du manifeste = `#121212`** (EPI-015), une seule valeur.
- **EPI-017 : un enregistrement réussi pendant l'avis ne le retire pas.** L'avis reste affiché jusqu'à « Fermer » dans cette session, puis ne revient plus aux ouvertures suivantes.
- **EPI-017 : plafond de 5 copies de secours.** Si 5 copies existent déjà, l'app n'en crée pas de sixième et le signale par le même bandeau d'erreur d'enregistrement qu'EPI-016.

Décisions de Math du 2026-10-19 (série EPI-001, réponses aux questions de Jean-Marc) :
- **Cycle de statuts validé** : `À faire` → `Prête` → `En développement` → `Livrée, en QA` → `Validée QA` → `Acceptée`.
- **EPI-001 acceptable avec BUG-001 corrigé** : BUG-001 est corrigé et vérifié par Julie (`docs/qa/bugs.md`, « Corrigé, vérifié »). Il ne bloque plus.
- **« Un article par ligne au collage » hors MVP** : EPI-018, Could.
- **Pas de texte visible après un ajout** : la liste qui défile jusqu'au nouvel article et l'annonce par lecteur d'écran suffisent. Aucun critère de texte de confirmation visible (« lait ajouté »).
- **Tests iPhone par fiche à cocher** : Julie écrit la fiche (`docs/qa/epi-001-fiche-iphone.md`), Math la remplit sur son iPhone, Julie interprète les réponses.

## Règles communes à tout le MVP
- **Plateforme** : iPhone de Math, app web installée (ADR 0001). Conditions acceptées par Math (ADR 0003) : app ajoutée à l'écran d'accueil et ouverte depuis son icône ; liste sauvegardée nulle part ailleurs que sur le téléphone.
- **Ordre d'affichage** (décision de Math) :
  - « À prendre » : dans l'ordre d'ajout ; un nouvel article ou un article décoché va **à la fin**.
  - « Dans le panier » : le dernier article coché est **en tête** de la section.
  - L'ordre affiché est conservé tel quel à la réouverture (EPI-003).
- **Trois états d'écran** (exclusifs) : (a) *liste vide* = aucun article du tout (EPI-003, écran 1) ; (b) *tout est pris* = au moins un article et tous cochés (EPI-002, écran 7) ; (c) *liste normale*. Une section vide est masquée ; les compteurs `(N)` n'apparaissent qu'avec leur section.
- **Message d'annulation unique** (EPI-005 et EPI-006) : un seul à la fois, 5 s, au-dessus de la barre d'ajout ; une nouvelle suppression ou un nouveau retrait remplace le message courant, et l'action précédente devient définitive.
- **Accessibilité** : chaque story inclut un scénario « exigences d'accessibilité » qui renvoie à [accessibilite.md](../ux/accessibilite.md) (§A : A1 à A13 valables partout ; §B : critères propres à la story). Julie les teste ; les points les plus mesurables sont recopiés dans les scénarios. Point à surveiller (§C) : le délai de 5 s est un délai imposé ; atténué par la pause au survol/focus ; à revoir si l'utilisateur change.
- **Textes** : exacts dans [textes-interface.md](../ux/textes-interface.md) (tutoiement).
- **Tests sur iPhone** : l'installation, le mode avion, les mises à jour, le clavier et l'éclair blanc se vérifient à la main sur l'iPhone de Math (Julie) ; l'automatisation (WebKit sur ordinateur) ne les couvre pas. Procédure : [architecture.md](../architecture.md), « Plateforme cible ».

---

## Épopée : Construire ma liste
Noter ce qu'il faut acheter, dès qu'on y pense, sans rien perdre.

## EPI-001 — Ajouter un article à ma liste
- Épopée : Construire ma liste
- Priorité : Must (MVP)
- Statut : **Livrée, en QA** (2026-10-19) — attend les tests iPhone. Julie : tout l'automatisable passe (73 tests e2e, 43 unitaires) ; reste à faire à la main sur un vrai iPhone : clavier à un toucher, clavier qui reste ouvert, ajout < 5 s, VoiceOver, zoom. BUG-001 (mineur) corrigé et vérifié par Julie. Les tests iPhone se font avec la fiche `docs/qa/epi-001-fiche-iphone.md` (Math la remplit, Julie interprète). BUG-002 (cosmétique) ne bloque pas : voir EPI-019.
- Décisions de PO du 2026-10-19 :
  - **BUG-001** (espace de largeur nulle acceptée comme nom, mineur) : **ne bloquait pas l'acceptation** à condition d'être corrigé, avec un test de non-régression. Il est corrigé et vérifié (Julie) : plus de réserve. Validé par Math.
  - **BUG-002** (autres caractères invisibles acceptés, cosmétique) : **ne bloque pas EPI-001** ; mis au backlog en dette, EPI-019 (Could).
  - **Collage multiligne** : le comportement actuel (« lait œufs pain » = un seul article, aucune perte) est conforme aux critères d'EPI-001. Un article par ligne est **hors MVP** (validé par Math), idée EPI-018 (Could).
  - **Confirmation d'ajout** : les critères exigent une confirmation **visible par le résultat** (l'article apparaît dans « À prendre », la liste défile jusqu'à lui, le champ est vidé) et **annoncée** par le lecteur d'écran. **Décision de Math : pas de texte de confirmation visible** (« lait ajouté »). Aucun critère à ajouter.
  - **Annonce répétée** : l'annonce VoiceOver peut ne pas se répéter pour deux ajouts identiques consécutifs. Pas de nouveau critère automatisé ; ajouté comme **point de test manuel** pour Julie (scénario ci-dessous). Si le défaut est confirmé sur l'iPhone, Julie ouvre un bug (probablement mineur) et Pierrick corrige.
- Story : En tant que personne qui fait l'épicerie, je veux ajouter un article à ma liste en tapant son nom afin de ne pas l'oublier au magasin.
- Règles :
  - Le nom est un texte libre (ex. « lait 2 L », « pommes Cortland »).
  - Les espaces au début et à la fin sont retirés.
  - Longueur : 1 à 100 caractères **visibles** après retrait des espaces (« œ » et « é » comptent pour 1).
  - **La frappe n'est jamais bloquée** ni tronquée en silence, même au-delà de 100 (décision de Math) : on valide ou on refuse à l'ajout.
  - Un nouvel article s'ajoute **à la fin** de « À prendre ».
  - **Limite de la plateforme** (Charle, `architecture.md`) : sur iPhone, Safari n'ouvre jamais le clavier sans un toucher de l'utilisateur. Le clavier ne peut donc pas être ouvert tout seul à l'ouverture de l'app ; il faut **un seul toucher**, facilité par une barre d'ajout entièrement touchable.
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

  Scénario : champ prêt dès l'ouverture
    Étant donné que l'app est fermée
    Quand je l'ouvre
    Alors la barre d'ajout est en bas de l'écran, visible sans défiler
    Et le champ « Nouvel article » a le focus
    (le clavier peut s'ouvrir tout seul là où la plateforme le permet, p. ex. Android ou clavier physique ; sur iPhone, ce n'est pas exigé)

  Scénario : un seul toucher ouvre le clavier
    Étant donné que l'app vient de s'ouvrir sur iPhone
    Quand je touche n'importe où dans la barre d'ajout, en dehors du bouton « Ajouter » (étiquette, champ ou marge de la barre)
    Alors le clavier s'ouvre et le curseur est dans le champ « Nouvel article »
    Et la zone touchable de la barre fait au moins 48 px de haut et toute la largeur de la colonne
    (vérifié à la main sur l'iPhone, 5 essais : le clavier s'ouvre au premier toucher à chaque fois)

  Scénario : le clavier reste ouvert entre deux ajouts
    Étant donné que le clavier est ouvert
    Quand j'ajoute « sel » puis « poivre » sans toucher autre chose que « Ajouter » ou Entrée
    Alors le clavier reste ouvert entre les deux ajouts et le focus reste dans le champ

  Scénario : un toucher dans la barre ne ferme pas le clavier ouvert
    Étant donné que le clavier est déjà ouvert
    Quand je touche la barre d'ajout en dehors du bouton « Ajouter » (étiquette, champ ou marge)
    Alors le clavier reste ouvert et le focus reste dans le champ

  Scénario : ajout rapide (objectif < 5 s)
    Étant donné que l'app est fermée
    Quand je l'ouvre, touche la barre d'ajout (un toucher), saisis « œufs » et valide
    Alors « œufs » est visible dans la liste en moins de 5 secondes au total (chronomètre, ce toucher et la saisie compris ; 5 essais sur l'iPhone, tous sous 5 s)

  Scénario : nom vide refusé
    Étant donné que le champ est vide ou ne contient que des espaces
    Quand je valide
    Alors aucun article n'est ajouté
    Et le message « Écris le nom d'un article pour l'ajouter. » s'affiche près du champ, avec une icône
    Et le focus reste dans le champ et, si le clavier était ouvert, il reste ouvert
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

  Scénario : deux ajouts identiques de suite (test manuel de Julie sur l'iPhone, VoiceOver)
    Étant donné que VoiceOver est activé
    Quand j'ajoute « lait » puis, juste après, « lait » à nouveau
    Alors la liste contient deux « lait » (doublons permis, voir EPI-009)
    Et « « lait » ajouté à la liste. » est entendu à chaque ajout, ou, si la deuxième annonce est muette, Julie le note dans un bug (mineur)
    (point à vérifier : le lecteur d'écran peut ignorer un message identique au précédent)
  ```
- Dépendances : squelette d'app (ADR 0002 acceptée). Écrans : wireframes « Barre d'ajout entièrement touchable » (zone A = toute la barre, zone B = bouton « Ajouter ») et écrans 3 et 4. Question « clavier ouvert à l'ouverture » : tranchée par Charle (impossible sur iPhone) ; compromis « un toucher dans la barre ouvre le clavier » **validé par Math**.

## EPI-003 — Retrouver ma liste à la réouverture
- Épopée : Construire ma liste
- Priorité : Must (MVP)
- Statut : **Prête**
- Story : En tant que personne qui fait l'épicerie, je veux retrouver ma liste telle que je l'ai laissée afin de pouvoir la remplir au fil de la semaine sans rien perdre.
- Règles :
  - « **Liste vide** » = aucun article du tout. C'est différent de « tout est pris » (EPI-002), où il reste des articles, tous cochés.
  - « Rouvrir » = fermer complètement l'app (la balayer dans le sélecteur d'apps de l'iPhone) puis la relancer depuis son icône ; un simple retour à l'écran d'accueil ne compte pas.
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
    Et le champ d'ajout a le focus
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
- Dépendances : EPI-001. Stockage : ADR 0003 (acceptée). Les données illisibles à l'ouverture sont traitées par EPI-017 : la liste vide affichée dans ce cas est la variante de l'écran 11b, jamais le texte de première ouverture ci-dessus.

## EPI-005 — Supprimer un article
- Épopée : Construire ma liste
- Priorité : Must (MVP)
- Statut : **Prête**
- Story : En tant que personne qui fait l'épicerie, je veux supprimer un article ajouté par erreur afin que ma liste ne contienne que ce que je dois vraiment acheter.
- Règles (décisions de Math) :
  - Un bouton poubelle **visible sur chaque ligne** ; aucune confirmation avant suppression.
  - Un message « Annuler » reste affiché **5 secondes** ; le minuteur est en pause tant que le message est survolé ou a le focus, et reprend ensuite là où il s'était arrêté.
  - **Un seul message à la fois : seule la dernière action est annulable, qu'il s'agisse d'une suppression OU d'un retrait des cochés (EPI-006).** La nouvelle action remplace le message de la précédente, qui devient définitive.
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

  Scénario : suppression et retrait des cochés croisés (seule la dernière action est annulable)
    Étant donné que « Dans le panier » contient « pain » et « lait » et que « À prendre » contient « sel »
    Quand je supprime « sel » puis, 2 secondes plus tard, je retire les articles cochés
    Alors le message n'affiche que « 2 articles retirés » et « Annuler » ne rétablit que « pain » et « lait »
    Et « sel » est définitivement supprimé
    (les quatre séquences croisées sont détaillées dans EPI-006)

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
- Dépendances : EPI-001 ; EPI-003 (persistance) ; EPI-006 (message partagé) ; EPI-016 (échec d'enregistrement). Écran 6.

## EPI-016 — Ne jamais perdre un article en silence (échec d'enregistrement)
- Épopée : Construire ma liste
- Priorité : Must (MVP) — l'objectif « zéro article perdu » n'est pas tenu si un échec d'enregistrement est invisible
- Statut : **Prête** — validée par Math (2026-10-19) ; écran 9 et textes livrés
- Story : En tant que personne qui fait l'épicerie, je veux être prévenu clairement quand ma liste n'a pas pu être enregistrée sur mon téléphone afin de ne pas croire à tort que mes articles sont gardés.
- Règles :
  - Tout changement (ajout, cochage, suppression, retrait, annulation) peut échouer à l'enregistrement (ex. téléphone plein, stockage refusé).
  - Un échec n'est **jamais silencieux**, et l'écran ne dit jamais « enregistré » si ce n'est pas vrai.
  - **« Rien ne disparaît »** veut dire : l'article reste dans la liste affichée ; le champ d'ajout est vidé comme d'habitude (l'article est dans la liste) ; c'est le **bandeau d'erreur qui explique** que ce n'est pas gardé.
  - Le bandeau d'erreur est sous le titre ; le message d'annulation (EPI-005, EPI-006) reste au-dessus de la barre d'ajout : ce sont **deux emplacements différents** qui peuvent coexister. Un message d'annulation ne chasse jamais le bandeau d'erreur.
  - « Réessayer » enregistre **la liste telle qu'elle est affichée à ce moment-là** (pas seulement le dernier changement). Tout enregistrement réussi rattrape tous les changements non enregistrés.
  - **Priorité des bandeaux** (un seul à la fois) : erreur d'enregistrement > confirmation > liste illisible > hors ligne. Règle complète et scénarios : EPI-017 (« Priorité des bandeaux »).
  - Textes : écran 9 des wireframes, [textes-interface.md](../ux/textes-interface.md).
  - **Trois cas d'échec à l'écriture, un texte par cas** (décision de Math ; textes exacts dans [textes-interface.md](../ux/textes-interface.md)) : (1) *stockage plein* = `QuotaExceededError` ; (2) *accès refusé* = détecté par le contrôle écriture-lecture au démarrage ; (3) *cause inconnue* = toute autre erreur d'écriture, texte de repli neutre. Le bandeau, son icône, son bouton « Réessayer » et son comportement sont identiques dans les trois cas ; seul le texte change. Le texte « Libère de l'espace… » n'apparaît que pour le stockage plein.
  - Pannes détectables et méthode de simulation en test : `architecture.md`, « Pannes de stockage » (stockage plein et accès refusé : détectables ; effacement après coup : non détectable). Les données illisibles à l'ouverture relèvent d'EPI-017.
- Critères d'acceptation :
  ```
  Scénario : échec visible, stockage plein
    Étant donné que l'écriture échoue avec une erreur de quota (`QuotaExceededError`, échec simulé)
    Quand j'ajoute « lait »
    Alors un bandeau sous le titre affiche, avec une icône « ! » : « Impossible d'enregistrer ta liste sur ce téléphone : il n'y a plus assez d'espace. Libère de l'espace, puis réessaie. » et un bouton « Réessayer »
    Et le message est annoncé par un lecteur d'écran (role="alert")

  Scénario : échec visible, accès refusé
    Étant donné que le contrôle écriture-lecture fait au démarrage échoue (accès au stockage refusé, échec simulé)
    Alors le même bandeau affiche : « Impossible d'enregistrer ta liste sur ce téléphone : le navigateur refuse de garder des données. Vérifie les réglages de confidentialité du navigateur (et la navigation privée), puis réessaie. »
    Et le texte ne parle pas d'espace libre

  Scénario : échec visible, cause inconnue (texte de repli)
    Étant donné que l'écriture échoue avec une erreur qui n'est ni un quota plein ni un accès refusé (échec simulé)
    Quand j'ajoute « lait »
    Alors le même bandeau affiche : « Impossible d'enregistrer ta liste sur ce téléphone. Vérifie l'espace libre et les réglages de confidentialité du navigateur, puis réessaie. »

  Scénario : rien ne disparaît
    Étant donné le même échec
    Alors « lait » est dans la liste affichée, dans « À prendre »
    Et le champ d'ajout est vidé
    Et les articles déjà présents restent affichés
    Et c'est le bandeau d'erreur qui dit que la liste n'est pas enregistrée

  Scénario : échec pendant un retrait des cochés
    Étant donné que « Dans le panier » contient « pain » et « lait » et que l'enregistrement est impossible
    Quand je retire les articles cochés
    Alors « pain » et « lait » restent affichés comme retirés : la section « Dans le panier » a disparu
    Et le bandeau d'erreur est affiché sous le titre
    Et le message « 2 articles retirés » avec « Annuler » est affiché au-dessus de la barre d'ajout
    Et les deux messages sont visibles en même temps

  Scénario : annuler pendant l'échec
    Étant donné le cas précédent
    Quand j'annule dans les 5 secondes
    Alors « pain » et « lait » reviennent dans « Dans le panier »
    Et le bandeau d'erreur reste affiché tant que l'enregistrement échoue

  Scénario : réessayer avec succès
    Étant donné que le bandeau d'échec est affiché après l'ajout de « lait » puis de « pain », et que le problème est réglé
    Quand je touche « Réessayer »
    Alors le bandeau devient la confirmation « Ta liste est de nouveau enregistrée. » avec une icône coche, visible 5 secondes (± 0,5 s) puis disparaît
    Et « Ta liste est de nouveau enregistrée. » est annoncé (role="status")
    Et le focus passe au champ d'ajout
    Et après fermeture puis réouverture de l'app, « lait », « pain » et tous les autres articles sont présents (la liste affichée a été enregistrée en entier)

  Scénario : réessayer sans succès
    Étant donné que le problème persiste
    Quand je touche « Réessayer »
    Alors le bandeau reste affiché et la ligne « Nouvel essai sans succès. » est visible dans le bandeau
    Et « Nouvel essai sans succès. » est annoncé (role="status")
    Et le focus reste sur « Réessayer »

  Scénario : un enregistrement réussi retire le message sans toucher « Réessayer »
    Étant donné que le bandeau d'échec est affiché et que le problème est réglé
    Quand j'ajoute « sel » (sans toucher « Réessayer ») et que l'enregistrement réussit
    Alors le message d'échec disparaît (remplacé par la confirmation de 5 s)
    Et après fermeture puis réouverture de l'app, « sel » et tous les articles précédents sont présents

  Scénario : message persistant
    Étant donné que le bandeau d'échec est affiché
    Alors il ne disparaît pas tout seul après un délai et n'a pas de bouton de fermeture ; seul un enregistrement réussi le retire

  Scénario : échec dès l'ouverture (stockage refusé)
    Étant donné que le téléphone refuse l'accès au stockage (échec simulé)
    Quand j'ouvre l'app
    Alors le bandeau d'échec est affiché avant que j'aie ajouté quoi que ce soit, avec le texte « accès refusé » (voir « échec visible, accès refusé »)
    Et ce n'est pas l'avis « liste illisible » (EPI-017) : « accès refusé » et « stockage plein » sont des pannes d'enregistrement

  Scénario : les trois textes sont testés
    Alors un test automatisé vérifie, pour chacun des trois cas (quota plein, accès refusé, cause inconnue), que le bandeau affiche exactement son texte et pas celui d'un autre cas
    Et que « Libère de l'espace » n'apparaît que dans le cas du stockage plein

  Scénario : pas de faux message rassurant
    Étant donné que le téléphone est hors ligne ET que l'enregistrement échoue
    Alors le bandeau « Hors ligne. Ta liste fonctionne normalement. » n'est pas affiché
    Et le bandeau d'échec d'enregistrement l'est
    Et les annonces « Hors ligne… » et « De retour en ligne. » sont suspendues pendant l'échec

  Scénario : retour du bandeau « Hors ligne » après l'échec
    Étant donné que le téléphone est toujours hors ligne et que l'enregistrement vient de réussir
    Alors le bandeau « Hors ligne. Ta liste fonctionne normalement. » réapparaît, sans nouvelle annonce

  Scénario : exigences d'accessibilité
    Alors accessibilite.md §A et §B « EPI-016 » sont satisfaites
    Et le bouton « Réessayer » (nom accessible « Réessayer d'enregistrer ma liste ») fait 48 × 48 px minimum, est atteignable au clavier, juste après le titre dans l'ordre de tabulation
    Et le message respecte le contraste de accessibilite.md §A1 dans les deux thèmes, et n'est jamais porté par la couleur seule
  ```
- Dépendances : EPI-001 (et toutes les actions qui modifient la liste). Simulation d'échec : méthode décrite dans `architecture.md`. L'effacement après coup (Safari, suppression de l'app) n'est pas détectable ; la parade est préventive (installation sur l'écran d'accueil, ADR 0003).

## EPI-017 — Être prévenu quand ma liste enregistrée est illisible
- Épopée : Construire ma liste
- Priorité : Must (MVP) — **validée par Math** : sans elle, une liste abîmée s'afficherait comme une liste vide, et le premier article ajouté pourrait la remplacer sans que Math le sache (« zéro article perdu »)
- Statut : **Prête** — écrans 11 et 11b, textes, parcours 5 et critères §B livrés par Jean-François ; règle des copies de secours fixée par l'ADR 0003 (précision du 2026-10-19)
- Story : En tant que personne qui fait l'épicerie, je veux être prévenu clairement quand l'app ne parvient pas à relire ma liste enregistrée, et que rien ne soit effacé en silence, afin de ne pas croire que ma liste est vide et de ne pas perdre définitivement ce qui était enregistré.
- Règles (ADR 0003 et `architecture.md`, côté utilisateur) :
  - « Illisible » = texte qui n'est pas une liste valide (données abîmées) ou format d'une version inconnue de l'app.
  - Dans ce cas, l'app **conserve une copie du texte brut** sous une clé de secours, sans jamais l'effacer, démarre avec une **liste vide** et **signale l'erreur**.
  - L'app n'affiche jamais « Ta liste est vide. » seul dans ce cas : ce serait faire croire à un premier lancement.
  - Dans le MVP, **Math ne peut pas récupérer lui-même la copie depuis l'app** (aucun écran de récupération ; **validé par Math**) : elle reste sur le téléphone, récupérable avec l'Inspecteur web de Safari sur Mac.
  - **Avis** (écran 11, [wireframes](../ux/wireframes.md) ; textes dans [textes-interface.md](../ux/textes-interface.md)) : bandeau sous le titre, `role="alert"`, bouton « Fermer ». Il reste jusqu'à ce que Math touche « Fermer » (aucun délai). **La fermeture ne vaut que pour la session** : tant qu'aucun enregistrement n'a réussi, l'avis revient à l'ouverture suivante. Dès qu'un enregistrement réussit (la liste valide remplace le texte abîmé), il ne revient plus aux ouvertures suivantes ; la copie de secours, elle, reste. Ajouter un article, ou tout autre enregistrement réussi, ne ferme pas l'avis dans la session en cours : il reste jusqu'à « Fermer » (décision de Math).
  - **Liste vide après liste illisible** (écran 11b) : variante « Ta nouvelle liste est vide. / Tu peux y ajouter des articles ci-dessous. » ; jamais le texte de première ouverture (« Ta liste est vide. Écris ton premier article… »), **même après « Fermer »**, tant qu'aucun enregistrement n'a réussi. Première ouverture et liste valide sans article gardent l'écran 1.
  - **Priorité des bandeaux** (un seul à la fois, règle commune à EPI-004, EPI-016 et EPI-017) : erreur d'enregistrement > confirmation d'enregistrement > liste illisible > hors ligne. Un bandeau masqué par un bandeau plus prioritaire revient dès que la place est libre, sans nouvelle annonce. Le bandeau « Hors ligne » est caché pendant que l'avis est affiché (décision de Math).
  - **Copies de secours** (ADR 0003, précision du 2026-10-19) : une copie **par incident**, chacune sous sa propre clé numérotée (`epicerie.liste.illisible.1`, `.2`…), avec le texte brut et la date ; **jamais supprimée ni remplacée** ; **plafond de 5 copies** (au-delà, plus de nouvelle copie, les 5 premières sont gardées ; l'erreur est signalée par le bandeau d'erreur d'enregistrement d'EPI-016, décision de Math) ; **pas de doublon** (texte identique à une copie déjà gardée : aucune nouvelle copie) ; **copie d'abord** : la liste n'est remplacée par une liste vide qu'après confirmation que la copie est écrite ; si la copie échoue, la donnée d'origine reste en place et rien n'est enregistré tant que la situation n'est pas réglée.
  - « Accès refusé » et « stockage plein » ne sont pas des listes illisibles : ce sont des pannes d'enregistrement (EPI-016).
- Critères d'acceptation :
  ```
  Scénario : données abîmées à l'ouverture
    Étant donné que le texte enregistré de ma liste n'est pas lisible (ex. « {pas du json »)
    Quand j'ouvre l'app
    Alors un bandeau sous le titre, avec l'icône « ! », affiche « Ta liste n'a pas pu être relue. » puis « L'app repart d'une liste vide. Rien n'est effacé : une copie de ta liste est gardée sur ce téléphone. » et un bouton « Fermer »
    Et ce message est annoncé une seule fois par un lecteur d'écran (role="alert")
    Et il n'est pas retiré par un délai
    Et le focus reste dans le champ d'ajout

  Scénario : format inconnu
    Étant donné que la liste enregistrée porte une version de format inconnue (ex. {"version":99})
    Quand j'ouvre l'app
    Alors le même message est affiché et la même copie de secours est conservée

  Scénario : rien n'est effacé
    Étant donné une liste illisible au chargement
    Alors le texte d'origine est conservé tel quel, caractère pour caractère, dans la copie `epicerie.liste.illisible.1`, avec la date de l'incident (vérifié par un test automatisé et à la main avec l'Inspecteur web de Safari)

  Scénario : la copie est écrite avant le remplacement de la liste
    Étant donné une liste illisible au chargement
    Alors la copie de secours est écrite et confirmée avant que la liste enregistrée soit remplacée par une liste vide (test automatisé)

  Scénario : copie impossible, donnée d'origine intacte
    Étant donné une liste illisible et un stockage qui refuse d'écrire la copie (échec simulé)
    Quand j'ouvre l'app
    Alors le texte illisible d'origine est toujours en place, inchangé
    Et une erreur est signalée à l'écran
    Et rien n'est enregistré tant que la situation n'est pas réglée
    (texte de l'erreur : bandeau d'échec d'enregistrement d'EPI-016, variante correspondant à la cause de l'échec de la copie ; décision de Math)

  Scénario : ajout pendant l'avis, sans écrasement de la copie
    Étant donné que l'avis « liste illisible » est affiché
    Quand j'ajoute « lait »
    Alors « lait » est ajouté et l'app fonctionne normalement
    Et la copie de secours reste intacte
    Et l'avis reste affiché jusqu'à ce que je touche « Fermer »

  Scénario : fermeture de l'avis pour la session
    Étant donné que l'avis est affiché et que la liste est vide
    Quand je touche « Fermer »
    Alors l'avis disparaît, le focus passe au champ d'ajout (jamais sur le corps de la page)
    Et la liste vide affichée est toujours la variante « Ta nouvelle liste est vide. » (jamais le texte de première ouverture)
    Quand je ferme complètement l'app puis je la rouvre sans avoir rien ajouté
    Alors l'avis revient (la liste abîmée est toujours là)

  Scénario : l'avis ne revient plus après un enregistrement réussi
    Étant donné que l'avis a été affiché et que j'ai ajouté « lait » (enregistrement réussi)
    Alors l'avis est toujours affiché dans cette session, jusqu'à ce que je touche « Fermer »
    Quand je touche « Fermer » puis je ferme complètement l'app et je la rouvre
    Alors l'avis n'est pas affiché, « lait » est présent et la copie de secours existe toujours
    Quand j'ai ajouté « lait » sans toucher « Fermer », puis je ferme complètement l'app et je la rouvre
    Alors l'avis n'est pas non plus affiché (la liste valide a remplacé le texte abîmé)

  Scénario : deuxième incident, première copie conservée
    Étant donné qu'une copie `epicerie.liste.illisible.1` existe déjà
    Quand une autre liste illisible, au texte différent, est détectée à l'ouverture
    Alors une copie `epicerie.liste.illisible.2` est créée avec le nouveau texte
    Et la copie `.1` est inchangée, caractère pour caractère

  Scénario : pas de doublon
    Étant donné qu'une copie existe et que le texte illisible est identique à celui de cette copie (j'ai rouvert l'app sans rien enregistrer)
    Quand j'ouvre l'app
    Alors aucune nouvelle copie n'est créée et l'avis est affiché

  Scénario : plafond de 5 copies
    Étant donné que 5 copies de secours existent
    Quand une sixième liste illisible, au texte différent, est détectée
    Alors aucune copie n'est supprimée ni remplacée et aucune sixième copie n'est créée
    Et le bandeau d'erreur d'enregistrement d'EPI-016 est affiché (décision de Math : même bandeau, avec le texte de repli « cause inconnue », puisque ce n'est ni un stockage plein ni un accès refusé)
    Et l'app ne signale pas ce cas en silence : un test automatisé vérifie l'erreur et l'affichage du bandeau

  Scénario : ce n'est pas une première ouverture
    Étant donné une liste illisible
    Alors la variante « Ta nouvelle liste est vide. Tu peux y ajouter des articles ci-dessous. » est affichée, avec l'avis visible en même temps
    Et le texte « Ta liste est vide. Écris ton premier article ci-dessous… » n'est affiché dans aucun cas lié à cette liste illisible, même après « Fermer »

  Scénario : priorité des bandeaux
    Étant donné que l'avis « liste illisible » est affiché
    Quand un enregistrement échoue
    Alors le bandeau d'erreur d'enregistrement remplace l'avis (un seul bandeau à la fois)
    Quand l'enregistrement réussit à nouveau
    Alors la confirmation « Ta liste est de nouveau enregistrée. » s'affiche 5 secondes
    Et l'avis « liste illisible » revient ensuite sans nouvelle annonce, s'il n'a pas été fermé
    Étant donné que le téléphone est hors ligne et que l'avis est affiché
    Alors le bandeau « Hors ligne » n'est pas affiché ; il apparaît quand je touche « Fermer »

  Scénario : jamais de fausse alerte
    Étant donné une liste valide, y compris une liste valide sans article, ou aucune donnée (première ouverture)
    Quand j'ouvre l'app
    Alors le message « liste illisible » n'est pas affiché
    Et la liste vide est l'écran 1 habituel (« Ta liste est vide. Écris ton premier article… »), pas la variante

  Scénario : exigences d'accessibilité
    Alors accessibilite.md §A et §B « EPI-017 » sont satisfaites
    Et le bouton « Fermer » (nom accessible « Fermer l'avis sur la liste illisible ») est un vrai bouton de 48 px, atteignable au clavier juste après le titre
    Et le contraste est suffisant dans les deux thèmes et l'information n'est pas portée par la couleur seule
    Et la mise en page reste intacte à 320 px et à 200 % de zoom (le bouton passe sous le texte)
    (annonce par VoiceOver : à vérifier à la main par Julie sur l'iPhone, point non vérifié signalé par Jean-François)
  ```
- Dépendances : EPI-003 (chargement), EPI-016 (priorité des bandeaux). Écrans 11 et 11b, parcours 5, textes et §B livrés. Copies de secours : ADR 0003 (précision du 2026-10-19), à tester dans `storage/` : deuxième incident, même texte deux fois, plafond atteint, copie impossible.

## EPI-015 — Thème sombre automatique
- Épopée : Construire ma liste
- Priorité : Must (MVP) — voulu par Math ; dans le MVP même si le bénéfice clé (noter vite, ne rien oublier) existe sans lui
- Statut : **Prête** — valeurs de `theme-color` et `background_color` livrées dans design-system.md, « Couleurs de la plateforme »
- Story : En tant que personne qui consulte sa liste le soir à la maison, je veux que l'app prenne l'apparence sombre quand mon téléphone est en mode sombre afin de ne pas être ébloui et de garder un texte lisible.
- Règles : suit le réglage du téléphone, **sans** commutateur dans l'app (hors périmètre). Couleurs : section « Thème sombre » de [design-system.md](../ux/design-system.md). Confirmé par Charle : le thème repose sur des **variables de couleur CSS**, sans couleur écrite en dur dans les composants, et le fond est défini avant le chargement du contenu. Pierrick utilise ces variables dès la première story (pas de couleurs en dur).
- Critères d'acceptation :
  ```
  Scénario : téléphone en mode sombre
    Étant donné que le réglage d'apparence du téléphone est « sombre »
    Quand j'ouvre l'app
    Alors tous les écrans s'affichent avec les couleurs du thème sombre : liste, liste vide (écran 1), tout est pris, hors ligne, erreurs d'enregistrement et confirmation, message d'annulation, **avis « liste illisible » (écran 11) et variante de liste vide (écran 11b)**

  Scénario : téléphone en mode clair
    Étant donné que le réglage est « clair »
    Alors l'app s'affiche avec le thème clair

  Scénario : changement pendant l'utilisation
    Étant donné que l'app est ouverte en thème clair
    Quand je passe le téléphone en mode sombre
    Alors l'app passe au thème sombre en moins de 1 seconde, sans que je perde ma saisie ni ma liste

  Scénario : pas d'éclair blanc (test manuel de Julie sur l'iPhone)
    Étant donné que le téléphone est en mode sombre et que l'app est complètement fermée
    Quand je l'ouvre depuis son icône
    Alors aucun fond clair n'apparaît pendant le chargement (5 ouvertures à froid)
    (si l'écran de démarrage de l'iPhone montre un éclair blanc, ajouter des images de démarrage claire et sombre : travail en plus à fournir par Jean-François)

  Scénario : barre d'état dans la couleur du thème
    Étant donné l'app ouverte depuis son icône
    Alors la barre d'état prend la couleur du thème courant (clair ou sombre)
    (comportement iOS non vérifié par Jean-François : si ce n'est pas le cas, Charle et Pierrick essaient l'autre valeur du réglage de barre d'état iOS)

  Scénario : valeurs de la plateforme
    Alors la balise theme-color vaut #FFFFFF en thème clair et #121212 en thème sombre, et le manifeste a background_color #121212 (une seule valeur)
    (valeurs et raisons : design-system.md, « Couleurs de la plateforme » ; iOS ignore background_color)

  Scénario : contrastes dans les deux thèmes
    Alors dans chaque thème, le texte a un contraste d'au moins 4,5:1 et les éléments d'interface (bordures, cases, focus) d'au moins 3:1, mesurés avec un outil sur l'app rendue

  Scénario : information non portée par la couleur seule
    Alors dans le thème sombre aussi, un article coché se distingue en niveaux de gris (coche, texte barré, section)
  ```
- Dépendances : écrans EPI-001 à EPI-006, EPI-016 et EPI-017 pour être vérifiée en entier (vérification finale une fois ces écrans développés). Images de démarrage iOS à fournir par Jean-François seulement si Julie constate un éclair blanc.

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
- Dépendances : EPI-001. À confirmer après l'usage du MVP (hypothèse H4 : le nom libre suffit peut-être). Écrans à produire par Jean-François. Changement de format de la liste : migration testée (ADR 0003 et 0007).

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
- Règle : **l'historique ne compte un article retiré (EPI-006) qu'une fois le délai d'annulation de 5 s écoulé**, c'est-à-dire quand le retrait est définitif  ; un retrait annulé n'alimente jamais l'historique.
- Critères d'acceptation : à détailler avant d'entrer dans un sprint (story non prête). Premier scénario déjà fixé :
  ```
  Scénario : l'historique attend la fin du délai d'annulation
    Étant donné que je retire « pain » et « lait » (cochés)
    Quand j'annule dans les 5 secondes
    Alors « pain » et « lait » ne sont pas ajoutés à l'historique
    Quand je retire à nouveau les articles cochés et que je n'annule pas
    Alors « pain » et « lait » entrent dans l'historique après les 5 secondes
  ```
- Dépendances : EPI-006 (les articles retirés alimentent l'historique). Un historique volumineux pourrait demander un nouvel ADR de stockage (ADR 0003).

## EPI-018 — Un article par ligne au collage d'un texte multiligne
- Épopée : Construire ma liste
- Priorité : Could (idée, hors MVP) — issue de l'exploratoire de Julie sur EPI-001
- Statut : À faire (idée, à détailler : story non prête)
- Story : En tant que personne qui reçoit sa liste par message, je veux coller un texte de plusieurs lignes et obtenir un article par ligne afin de ne pas retaper chaque article.
- Raison du hors-MVP : sans elle, on obtient quand même le bénéfice clé (noter vite, ne rien oublier) : on ajoute un article à la fois, et rien n'est perdu (le collage donne un seul article « lait œufs pain »). Hypothèse : le besoin existe peu pour un usage seul ; à revoir après l'usage du MVP.
- Critères d'acceptation : à détailler (ligne vide ignorée, limite de 100 caractères par ligne, nombre d'articles maximum, annonce du nombre d'articles ajoutés).
- Dépendances : EPI-001. Écrans à produire par Jean-François si retenue.

## EPI-019 — Refuser tous les noms d'apparence vide (caractères invisibles)
- Épopée : Construire ma liste
- Priorité : Could (dette, hors MVP) — issue de BUG-002 (cosmétique, `docs/qa/bugs.md`)
- Statut : À faire (dette, à détailler si reprise : story non prête)
- Story : En tant que personne qui fait l'épicerie, je veux qu'un nom qui paraît vide soit refusé, quel que soit le caractère invisible utilisé, afin de ne jamais voir de ligne blanche dans ma liste.
- Raison du hors-MVP : cas très rare (il faut copier-coller un texte « fantôme » ; Math est le seul utilisateur) ; sans elle, le bénéfice clé (noter vite, ne rien oublier) est intact. BUG-001 (le cas le plus courant, l'espace de largeur nulle) est déjà corrigé. Je ne l'ai pas rejeté : la règle « 1 à 100 caractères visibles » d'EPI-001 devrait être vraie pour tout nom qui paraît vide.
- Critères d'acceptation (minimaux) :
  ```
  Scénario : noms d'apparence vide refusés
    Étant donné que le champ ne contient que l'un de ces caractères : U+3164, U+2800, U+115F, U+034F, U+FE0F, U+FFF9
    Quand je valide
    Alors aucun article n'est ajouté et le message « Écris le nom d'un article pour l'ajouter. » s'affiche (comme pour un nom vide)

  Scénario : non-régression
    Alors les noms valides (« lait », « crème sûre », « œufs ») restent acceptés, et un nom qui contient un caractère invisible parmi du texte visible est accepté tel quel
  ```
- Dépendances : EPI-001 (acceptée). Piste de Julie (à instruire par Charle, pas une décision de PO) : refuser un nom dont tous les caractères sont « sans glyphe » plutôt qu'allonger une liste de caractères.

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
- Statut : **Prête**
- Story : En tant que personne qui fait l'épicerie, je veux cocher un article quand je le mets dans mon panier afin de voir d'un coup d'œil ce qu'il me reste à prendre.
- Règles :
  - Deux sections : « À prendre (N) » puis « Dans le panier (N) ». Une section vide est masquée.
  - Cocher = toucher la ligne entière (sauf le bouton Supprimer) ; décocher = même geste.
  - Un article coché quitte « À prendre » et se place **en tête de « Dans le panier »** ; un article décoché va **à la fin de « À prendre »** (décision de Math, voir « Règles communes »).
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
- Dépendances : EPI-001. Écrans 2 et 7.

## EPI-004 — Utiliser ma liste sans connexion
- Épopée : Faire l'épicerie
- Priorité : Must (MVP)
- Statut : **Prête** (les mises à jour sont dans EPI-004b)
- Story : En tant que personne qui fait l'épicerie, je veux consulter et modifier ma liste même sans réseau afin de ne pas être bloqué au fond du magasin.
- Règles :
  - L'app fonctionne **entièrement** sans réseau (rien n'est dégradé) ; aucune erreur ni fenêtre bloquante à cause de l'absence de réseau.
  - **Règle d'installation** (Charle) : le tout premier lancement sans réseau est **impossible** (aucun fichier de l'app n'est encore sur le téléphone ; c'est Safari qui afficherait sa page d'erreur, l'app ne peut rien y faire). La règle : ajouter l'app à l'écran d'accueil depuis Safari (option « Ouvrir en tant qu'app web » laissée activée), puis **l'ouvrir une fois depuis son icône avec du réseau**. Ensuite elle fonctionne en mode avion. Cette règle est documentée dans le README (aide d'installation).
  - Le bandeau « Hors ligne » est une information : sur un Wi-Fi sans Internet, le téléphone peut ne pas se croire hors ligne et ne pas l'afficher ; ce n'est pas un défaut.
- Critères d'acceptation :
  ```
  Scénario : règle d'installation documentée
    Étant donné le README du projet
    Alors il explique : ajouter l'app à l'écran d'accueil depuis Safari, laisser « Ouvrir en tant qu'app web » activée, puis ouvrir l'app une fois depuis son icône avec du réseau
    Et il dit que le tout premier lancement sans réseau est impossible

  Scénario : après installation, ouverture en mode avion
    Étant donné que j'ai ajouté l'app à l'écran d'accueil et que je l'ai ouverte une fois depuis son icône avec du réseau
    Et que le mode avion est activé (Wi-Fi et Bluetooth coupés)
    Quand je ferme complètement l'app puis je l'ouvre depuis son icône (y compris après un redémarrage du téléphone)
    Alors ma liste s'affiche en moins de 2 secondes, sans barre d'adresse Safari
    (test manuel de Julie sur l'iPhone)

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

  Scénario : bandeau « Hors ligne » masqué pendant un échec d'enregistrement
    Étant donné que le téléphone est hors ligne et que l'enregistrement échoue
    Alors le bandeau « Hors ligne » n'est pas affiché (voir EPI-016, qui prime : « Ta liste fonctionne normalement » ne doit jamais s'afficher en même temps que « Impossible d'enregistrer »)

  Scénario : bandeau « Hors ligne » masqué pendant l'avis « liste illisible »
    Étant donné que le téléphone est hors ligne et que l'avis « liste illisible » est affiché
    Alors le bandeau « Hors ligne » n'est pas affiché
    Quand je ferme l'avis avec « Fermer »
    Alors le bandeau « Hors ligne » apparaît
    (priorité complète des bandeaux : EPI-017, « Priorité des bandeaux »)

  Scénario : vérification de mise à jour sans réseau
    Étant donné que le téléphone est hors ligne
    Alors aucune erreur liée à une vérification de mise à jour n'est affichée et l'app fonctionne avec la version déjà présente

  Scénario : exigences d'accessibilité
    Alors accessibilite.md §A et §B « EPI-004 » sont satisfaites
  ```
- Dépendances : EPI-001, EPI-002, EPI-003, EPI-016 (le bandeau ne doit pas mentir), EPI-017 (priorité des bandeaux : « Hors ligne » est le plus bas). ADR 0004 et 0007 (acceptées). Écran 8. Texte du bandeau vrai seulement si les données sont bien enregistrées sur le téléphone (réserve de Jean-François, écran 8) : c'est le rôle d'EPI-016.
- Option non retenue pour le MVP (Could, à proposer à Math plus tard) : afficher une fois « Prête à fonctionner sans réseau ».

## EPI-004b — Mises à jour sans risque pour ma liste
- Épopée : Faire l'épicerie
- Priorité : Must (MVP) — **à faire avant le premier déploiement public** (le réglage est pénible à changer après ; ADR 0007)
- Statut : **Prête** (aucune interface ; aucun écran nécessaire)
- Story : En tant que personne qui fait l'épicerie, je veux que les mises à jour de l'app ne touchent jamais à ma liste ni n'interrompent ce que je fais afin de ne rien perdre et de ne pas être dérangé en plein magasin.
- Règles (ADR 0007) :
  - Une nouvelle version se télécharge seule quand l'app est ouverte avec du réseau, puis **attend**.
  - Elle s'applique à la **prochaine ouverture après une fermeture complète** de l'app (balayée dans le sélecteur d'apps, fermée par iOS ou téléphone redémarré). Un simple retour à l'écran d'accueil ne suffit pas.
  - **Jamais de rechargement en plein usage.** Aucun bouton « Mettre à jour » dans le MVP.
  - Il faut donc deux ouvertures pour voir une nouvelle version : la première la télécharge, la suivante l'utilise.
  - Une version qui change le format de la liste le **migre** (test de migration) ; si elle trouve un format inconnu, elle le conserve sans l'écraser (voir EPI-017).
- Critères d'acceptation :
  ```
  Scénario : mise à jour sans risque pour ma liste
    Étant donné que ma liste contient 5 articles dont 2 cochés
    Quand l'app est mise à jour vers une nouvelle version
    Alors je retrouve mes 5 articles avec leur état et leur ordre

  Scénario : jamais interrompu par une mise à jour
    Étant donné que je suis en train d'utiliser l'app, avec du réseau, et qu'une nouvelle version vient d'être publiée
    Quand je coche des articles et je tape un nom dans le champ d'ajout
    Alors l'écran ne se recharge pas tout seul, la version affichée ne change pas et ma saisie en cours n'est pas perdue

  Scénario : la nouvelle version s'applique à la prochaine ouverture après fermeture complète
    Étant donné qu'une nouvelle version a été publiée et que j'ai ouvert l'app avec du réseau (elle se télécharge)
    Quand je ferme complètement l'app puis la rouvre
    Alors la nouvelle version est utilisée et ma liste est intacte

  Scénario : migration du format de la liste
    Étant donné une liste enregistrée dans l'ancien format
    Quand la nouvelle version, qui change le format, s'ouvre
    Alors tous les articles, leur état et leur ordre sont conservés (test de migration)
  ```
- Dépendances : EPI-004 (hors ligne). Technique : réglage `prompt` de la mise à jour (ADR 0007). Test automatisé lourd (deux versions construites) ; la vérification sur iPhone est manuelle (Julie). Voir aussi EPI-017 pour un format inconnu.

## EPI-006 — Retirer d'un coup les articles cochés
- Épopée : Faire l'épicerie
- Priorité : Must (MVP) — remontée par Math
- Statut : **Prête** — écran 10, parcours 3, textes et critères §B livrés par Jean-François ; comportement validé par Math
- Story : En tant que personne qui revient de l'épicerie, je veux retirer d'un seul geste tous les articles cochés afin de repartir avec une liste propre pour la semaine suivante.
- Règles (décisions de Math, écran 10) :
  - Le bouton n'existe que si « Dans le panier » existe ; il est **en fin de section**, pleine largeur, 48 px de haut, 16 px de vide au-dessus, bouton secondaire (contour).
  - Retrait **immédiat, sans confirmation**, avec un message « Annuler » pendant **5 secondes**, comme EPI-005 (même composant, même place, même pause au survol/focus).
  - **Un seul message à la fois** : seule la dernière action (suppression OU retrait) est annulable ; l'action précédente devient définitive.
  - Le retrait est enregistré tout de suite ; « Annuler » rétablit **tous** les articles retirés, cochés, dans leur ordre d'origine, **en tête de « Dans le panier », devant tout article coché entre-temps**.
  - Le message dit le nombre, jamais les noms.
- Critères d'acceptation :
  ```
  Scénario : le bouton de retrait
    Étant donné que « Dans le panier » contient « pain » et « lait »
    Alors un bouton « Retirer les 2 articles cochés » est affiché en fin de section « Dans le panier », pleine largeur, 48 px de haut, avec 16 px de vide au-dessus
    Et c'est un vrai bouton dont le nom accessible est « Retirer les 2 articles cochés »
    Quand « Dans le panier » ne contient que « pain »
    Alors le bouton s'appelle « Retirer l'article coché »

  Scénario : aucun article coché
    Étant donné qu'aucun article n'est coché
    Alors la section « Dans le panier » et le bouton de retrait n'existent pas

  Scénario : retirer les cochés
    Étant donné que « Dans le panier » contient « pain » et « lait » et que « À prendre » contient « sel »
    Quand je touche « Retirer les 2 articles cochés »
    Alors la liste ne contient plus que « sel » sous « À prendre (1) », sans demande de confirmation
    Et la section « Dans le panier » a disparu
    Et le message « 2 articles retirés » avec le bouton « Annuler » s'affiche au-dessus de la barre d'ajout, sans la masquer
    Et « 2 articles retirés » est lu une seule fois par un lecteur d'écran

  Scénario : un seul article retiré (singulier)
    Étant donné que « Dans le panier » ne contient que « pain »
    Quand je retire les articles cochés
    Alors le message affiche « 1 article retiré »

  Scénario : focus après le retrait
    Étant donné que « À prendre » contient « sel » et « thé »
    Quand je retire les articles cochés
    Alors le focus est sur « thé », le dernier article de « À prendre » (jamais perdu sur la page)
    Étant donné qu'aucun article ne reste après le retrait
    Alors le focus est dans le champ d'ajout

  Scénario : retrait annulé
    Étant donné que je viens de retirer « pain » et « lait » (cochés, dans cet ordre dans « Dans le panier »)
    Quand j'annule dans les 5 secondes
    Alors « pain » puis « lait » réapparaissent dans « Dans le panier », cochés, dans leur ordre d'origine
    Et « À prendre » est inchangé
    Et le focus est sur « pain », le premier article rétabli
    Et « 2 articles remis dans la liste. » est annoncé
    (le nom accessible du bouton d'annulation est « Annuler le retrait de 2 articles »)

  Scénario : retrait annulé après un cochage entre-temps
    Étant donné que je viens de retirer « pain » et « lait » puis que je coche « sel »
    Quand j'annule dans les 5 secondes
    Alors « Dans le panier » affiche « pain », « lait », puis « sel » : les articles rétablis sont en tête, devant « sel » coché entre-temps

  Scénario : le message disparaît après 5 secondes
    Étant donné que je viens de retirer les articles cochés et que je n'ai touché à rien
    Alors le message disparaît après 5 secondes (tolérance ± 0,5 s) et le retrait est définitif

  Scénario : pause du minuteur
    Étant donné que je viens de retirer les articles cochés
    Quand je survole le message ou je lui donne le focus pendant 10 secondes
    Alors le message est toujours affiché
    Quand je m'en éloigne
    Alors il disparaît après le temps restant

  Scénario : séquence 1 — suppression puis retrait
    Étant donné que je supprime « sel » puis, 2 secondes plus tard, je retire les articles cochés
    Alors le message n'affiche que « 2 articles retirés » avec un nouveau délai de 5 secondes
    Et « Annuler » ne rétablit que les articles retirés
    Et « sel » est définitivement supprimé

  Scénario : séquence 2 — retrait puis suppression
    Étant donné que je retire les articles cochés puis, 2 secondes plus tard, je supprime « sel »
    Alors le message n'affiche que « « sel » supprimé » avec un nouveau délai de 5 secondes
    Et « Annuler » ne rétablit que « sel »
    Et le retrait est définitif

  Scénario : séquence 3 — retrait, cochage, nouveau retrait
    Étant donné que je retire les articles cochés, puis je coche « sel », puis je retire à nouveau les articles cochés
    Alors le message n'affiche que « 1 article retiré » avec un nouveau délai de 5 secondes
    Et « Annuler » ne rétablit que « sel »
    Et le premier retrait est définitif

  Scénario : séquence 4 — retrait puis ajout ou cochage, sans nouveau retrait
    Étant donné que je viens de retirer « pain » et « lait »
    Quand j'ajoute « beurre », ou je coche « sel »
    Alors le message reste affiché jusqu'à la fin de son délai
    Et « Annuler » rétablit « pain » et « lait » à leur place, « beurre » restant en fin de « À prendre »

  Scénario : tout retirer
    Étant donné que tous les articles sont cochés
    Quand je retire les articles cochés
    Alors l'état « liste vide » s'affiche (voir EPI-003), pas « Tout est dans ton panier ! »
    Et le message « 2 articles retirés » est visible au-dessus de la barre d'ajout
    Et « 2 articles retirés » puis « Ta liste est vide. » sont annoncés
    Et le focus est dans le champ d'ajout
    Et « Annuler » rétablit les articles et l'état « tout est pris » (EPI-002)

  Scénario : retrait conservé
    Quand je ferme puis rouvre l'app après un retrait
    Alors les articles retirés n'apparaissent pas

  Scénario : fermeture pendant le délai d'annulation
    Étant donné que je viens de retirer les articles cochés (moins de 5 secondes)
    Quand je ferme puis rouvre l'app
    Alors les articles retirés n'apparaissent pas

  Scénario : échec d'enregistrement pendant le retrait
    Alors le comportement est celui d'EPI-016, scénario « échec pendant un retrait des cochés » : bandeau d'erreur en haut ET message d'annulation en bas

  Scénario : exigences d'accessibilité
    Alors accessibilite.md §A et §B « EPI-006 » sont satisfaites
    Et le retrait et l'annulation se font sans glissement ni geste complexe
    Et le message d'annulation est atteignable au clavier et lu par un lecteur d'écran
  ```
- Dépendances : EPI-002, EPI-003 (persistance), EPI-005 (message d'annulation partagé : développer le composant une fois), EPI-016. Écran 10 et parcours 3 livrés.

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

Les ADR 0001 à 0007 sont toutes « Acceptée » (ADR 0003 précisé le 2026-10-19 : copies de secours) : le critère « aucune décision d'architecture ouverte » est **Oui** pour toutes les stories.

| Critère | EPI-001 | EPI-002 | EPI-003 | EPI-016 | EPI-017 | EPI-005 | EPI-006 | EPI-015 | EPI-004 | EPI-004b |
|---|---|---|---|---|---|---|---|---|---|---|
| Format « En tant que… je veux… afin de… » | Oui | Oui | Oui | Oui | Oui | Oui | Oui | Oui | Oui | Oui |
| Critères d'acceptation testables | Oui | Oui | Oui | Oui (trois textes d'erreur intégrés) | Oui | Oui | Oui | Oui | Oui | Oui |
| Parcours et écrans (Jean-François) | Oui (barre d'ajout touchable, écrans 3, 4) | Oui (écrans 2, 7) | Oui (écran 1) | Oui (écran 9, parcours 4) | Oui (écrans 11 et 11b, parcours 5, §B) | Oui (écran 6) | Oui (écran 10, parcours 3) | Oui (design-system.md, §B) | Oui (écran 8) | Sans objet (aucune interface) |
| Aucune décision d'architecture ouverte | Oui (ADR 0002, 0003) | Oui | Oui (ADR 0003) | Oui (`architecture.md`) | Oui (ADR 0003, copies de secours) | Oui | Oui | Oui (variables CSS confirmées) | Oui (ADR 0004, 0007) | Oui (ADR 0007) |
| Assez petite (quelques jours) | Oui | Oui | Oui | Oui (à surveiller : touche toutes les actions) | Oui (à surveiller : chargement + copies + avis ; découper si plus de quelques jours) | Oui | Oui | Oui | Oui (après découpage) | Oui (test lourd à deux versions) |
| Statut | **Livrée, en QA** (était Prête) | **Prête** | **Prête** | **Prête** | **Prête** | **Prête** | **Prête** | **Prête** | **Prête** | **Prête** |

**Points de suivi (ne bloquent pas la DoR)**
- **EPI-016** — textes « stockage plein », « accès refusé » et « repli » livrés et intégrés aux critères (décision de Math du 2026-10-19). Plus de point ouvert.
- **EPI-017** — « copie impossible » et « plafond de 5 copies atteint » s'affichent par le bandeau d'erreur d'enregistrement d'EPI-016 (décision de Math du 2026-10-19). Plus de point ouvert sur l'affichage.
- **EPI-015** — barre d'état iOS non vérifiée (Julie) ; images de démarrage seulement si un éclair blanc est constaté.
