# Vision produit — Ma liste d'épicerie (préfixe `EPI`)

Statut : **MVP validé par Math** (EPI-001 à EPI-006 + thème sombre, 2026-10-19). Les hypothèses restent à vérifier à l'usage.
Dernière mise à jour : 2026-10-19 — Jean-Marc (PO).

## Ce que Math a dit
« Une petite application pour gérer ma liste d'épicerie », sur téléphone, **utilisable hors ligne** (obligatoire), pour lui seul.
Décisions validées : tutoiement dans l'interface ; champ d'ajout en bas (clavier ouvert à l'ouverture : impossible sur iPhone, remplacé par « un seul toucher » — **compromis proposé, à valider**, voir EPI-001) ; bandeau « Hors ligne. Ta liste fonctionne normalement. » ; suppression et retrait sans confirmation avec « Annuler » pendant 5 s partout (un seul message à la fois, seule la dernière action est annulable) ; plateforme : iPhone, app installée sur l'écran d'accueil ; deux sections « À prendre » et « Dans le panier » ; article coché en tête de « Dans le panier », article décoché à la fin de « À prendre » ; thème sombre automatique ; retrait d'un coup des articles cochés dans le MVP, immédiat, sans confirmation, avec « Annuler » pendant 5 s comme la suppression ; être prévenu si la liste ne peut pas être enregistrée (EPI-016) ; pas de blocage de la frappe à 100 caractères.
Ce qui n'est pas dans cette liste est une **proposition** ou une **hypothèse**.

## Énoncé de vision
**Pour** Math, qui fait l'épicerie chaque semaine,
**qui** oublie des articles ou perd sa liste (papier égaré, notes éparpillées dans le téléphone),
**le produit** « Ma liste d'épicerie »
**est** une liste d'achats simple sur téléphone
**qui** permet de noter un article en quelques secondes dès qu'on y pense, puis de cocher ce qu'on met dans le panier au magasin.
**Contrairement à** une note papier ou une app de notes générique,
**notre produit** garde la liste toujours sur soi, sépare clairement « à prendre » et « dans le panier », et fonctionne même sans réseau au fond du magasin.

## Utilisateur cible (MVP)
- **Une seule personne : Math.**
- Usage principal **sur téléphone, d'une main**, à deux moments :
  1. **À la maison** : « tiens, il n'y a plus de lait » → on ajoute l'article tout de suite.
  2. **Au magasin** : on parcourt la liste, on coche au fur et à mesure, souvent sans réseau.
  3. **Au retour** : on retire d'un coup ce qui a été acheté pour repartir avec une liste propre.

## Objectif mesurable du MVP
- **Ajouter un article en moins de 5 secondes**, de l'ouverture de l'app à l'article visible dans la liste.
- **Zéro article perdu** : la liste est intacte après fermeture de l'app ou redémarrage du téléphone, et si l'enregistrement échoue, Math en est prévenu au lieu de croire que tout est gardé.
- **Liste visible en moins de 2 secondes, même sans réseau.**
- **Indicateur de succès** *(à observer par Math pendant 3 semaines d'usage réel)* : Math utilise l'app pour **au moins 3 épiceries sur 3 semaines** et revient du magasin sans avoir oublié un article noté.

## Périmètre du MVP (validé)
Le bénéfice clé est « noter vite, ne rien oublier au magasin ».
- Ajouter un article (nom en texte libre, 1 à 100 caractères) — `EPI-001`
- Cocher / décocher un article acheté — `EPI-002`
- Retrouver sa liste à la réouverture de l'app — `EPI-003`
- Consulter et modifier sa liste sans connexion internet — `EPI-004` ; mises à jour sans risque pour la liste — `EPI-004b` *(découpage d'EPI-004)*
- Supprimer un article, avec annulation de 5 s — `EPI-005`
- Retirer d'un coup les articles cochés, avec « Annuler » pendant 5 s — `EPI-006` *(remontée par Math)*
- Thème sombre automatique selon le téléphone — `EPI-015` *(voulu par Math ; il ne sert pas directement le bénéfice clé, mais il est dans le MVP à sa demande)*
- Être prévenu si la liste ne peut pas être enregistrée — `EPI-016` *(proposé par Jean-Marc pour tenir « zéro article perdu » ; validé par Math le 2026-10-19)*
- Être prévenu si la liste enregistrée est illisible à l'ouverture — `EPI-017` *(proposé par Jean-Marc, **à valider par Math**)*

## Hors périmètre pour l'instant
- **Partage et synchronisation** entre plusieurs personnes ou appareils. *(Won't — à revoir si Math fait l'épicerie à plusieurs)*
- Plusieurs listes (par magasin, par semaine).
- Prix, budget, rabais, circulaires.
- Recettes qui génèrent une liste.
- Comptes utilisateurs, connexion, mot de passe.
- Interrupteur manuel clair/sombre dans l'app (le thème suit le téléphone).
- Quantité, correction du nom, avertissement de doublon, historique, classement par rayon : après le MVP (Should / Could).

## Hypothèses à vérifier
| # | Hypothèse | Comment la vérifier |
|---|---|---|
| H1 | Un seul utilisateur (Math), pas de partage avec la famille. | Question à Math si le besoin change. |
| H2 | Usage surtout sur téléphone, au magasin. | Usage réel. |
| H3 | Une seule liste suffit. | Usage réel du MVP pendant 3 semaines. |
| H4 | Le nom de l'article suffit ; la quantité peut s'écrire dans le nom (« lait 2 L x2 »). | Math se plaint-il de l'absence d'un champ quantité ? |
| H5 | Le réseau est parfois absent au magasin, donc l'app doit fonctionner hors ligne. | Observation au magasin habituel (Math a déjà fait du hors ligne une obligation). |
| H6 | Interface en français québécois (« épicerie », « article »), tutoiement. | Tutoiement confirmé par Math ; le reste du vocabulaire reste une hypothèse. |
| H-A | Un article coché va en **tête** de « Dans le panier » ; un article décoché retourne à la **fin** de « À prendre ». | **Validée par Math (2026-10-19)** ; à réévaluer à l'usage si ça gêne. |
