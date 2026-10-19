# 0003 — Stockage de la liste sur le téléphone (localStorage)

- Statut : Acceptée (2026-10-19, validée par Math)
- Date : 2026-10-19
- Décideur : Math, sur recommandation de l'architecte (Charle)
- Dépend de : 0001 (PWA), 0002 (stack)
- Stories : EPI-003 (retrouver sa liste), EPI-004 (hors ligne), EPI-005 (suppression conservée)

## Contexte
Objectif du MVP : **zéro article perdu**, après fermeture de l'app ou redémarrage du téléphone. Pas de serveur ni de synchronisation (validé par Math) : la liste vit donc **uniquement sur le téléphone**, dans le stockage que le navigateur réserve à l'app.
Taille des données : une liste de quelques dizaines d'articles, soit quelques kilo-octets.
Jean-François demande que l'app sache **quand un enregistrement échoue** (téléphone plein), pour ne jamais afficher « Ta liste fonctionne normalement » à tort.

Le navigateur offre deux stockages :
- **localStorage** : un petit carnet clé → texte (environ 5 Mo). On y écrit la liste entière, et l'écriture est **terminée dès que l'instruction s'exécute** (synchrone).
- **IndexedDB** : une vraie base de données dans le navigateur, pour de gros volumes ; plus complexe, et les écritures se terminent « plus tard » (asynchrones).

Fait vérifié (WebKit, page « Tracking Prevention », 2026-10-19) : Safari efface les données d'un site après **7 jours sans visite**, que ce soit localStorage ou IndexedDB, **sauf pour les apps ajoutées à l'écran d'accueil**, qui sont exemptées.

## Options envisagées
| | localStorage | IndexedDB | Fichier ou serveur distant |
|---|---|---|---|
| Adéquation (quelques Ko, une liste) | ★★★ | ★★ surdimensionné | ✗ exclu : pas de serveur, hors ligne obligatoire |
| Simplicité | ★★★ deux fonctions (lire, écrire) | ★ API complexe ou bibliothèque en plus | — |
| Écriture fiable à la fermeture | ★★★ terminée immédiatement | ★★ une fermeture brutale peut couper une écriture en cours | — |
| Échec d'écriture détectable | oui (erreur immédiate si plein) | oui (erreur différée) | — |
| Protection contre l'effacement Safari | identique : exemptée si l'app est sur l'écran d'accueil | identique | — |
| Réversibilité | bonne, derrière une interface | bonne | — |

## Décision
- La liste est enregistrée dans **localStorage**, sous **une seule clé** (`epicerie.liste`), au format JSON avec un **numéro de version du format** (ex. `{ "version": 1, "articles": [...] }`), pour pouvoir faire évoluer le format plus tard (quantité EPI-007) sans perdre les listes existantes.
- **Toute modification** (ajout, cochage, suppression, annulation) enregistre immédiatement la liste complète.
- Le domaine ne connaît pas localStorage : il dépend d'une interface `ShoppingListRepository` (charger, enregistrer), implémentée dans `src/shopping-list/storage/`. Les tests du domaine utilisent une version en mémoire.
- Un échec d'enregistrement (stockage plein ou indisponible) est remonté comme une erreur explicite du dépôt, que l'écran peut afficher (écran 9 des wireframes, à trancher par Jean-Marc).
- Une donnée illisible au chargement (JSON corrompu, version inconnue) ne doit **jamais** être écrasée silencieusement : elle est conservée telle quelle et l'erreur est signalée.
- Au démarrage, l'app demande au navigateur un stockage **persistant** (`navigator.storage.persist()`), une protection supplémentaire, sans garantie sur tous les navigateurs.

## Conditions acceptées par Math (2026-10-19)
Math utilise un **iPhone** et a accepté explicitement les deux conditions ci-dessous :
1. l'app est **ajoutée à l'écran d'accueil** et **ouverte depuis son icône** (pas depuis un onglet Safari) ;
2. la liste n'est **sauvegardée nulle part ailleurs** que sur le téléphone.

Pannes de stockage détectables et façon de les simuler en test (EPI-016) : voir `docs/architecture.md`, section « Pannes de stockage ».

## Précision du 2026-10-19 : copies de secours des listes illisibles (EPI-017)
Précision de détail, sans changer la décision ci-dessus. Math a validé que la copie reste **sur le téléphone**, sans récupération depuis l'app : elle sert seulement à ne rien détruire, pour qu'une réparation à la main reste possible.
- **Une copie par incident, jamais écrasée.** Chaque copie porte sa propre clé numérotée : `epicerie.liste.illisible.1`, puis `.2`, etc. (au lieu d'une clé unique). Chaque copie contient le texte brut tel quel, plus la date de l'incident. L'app ne **supprime et ne remplace jamais** une copie.
- **Plafond de 5 copies.** Une liste fait quelques Ko : 5 copies restent très en dessous du quota. Au-delà, l'app ne crée plus de copie (les 5 premières, les plus proches de la cause, sont gardées) et signale le cas par une erreur distincte. Cas jugé très improbable ; à reprendre si Math le rencontre.
- **Pas de doublon.** Si le texte illisible est identique à une copie déjà gardée (par exemple Math rouvre l'app sans rien avoir enregistré entre-temps), aucune nouvelle copie n'est créée.
- **Copie d'abord, remplacement ensuite.** L'app ne remplace la clé `epicerie.liste` (par une liste vide) qu'**après** avoir confirmé que la copie est bien écrite. Si la copie échoue (stockage plein), la donnée d'origine reste en place, l'erreur est signalée, et l'app n'enregistre rien tant que la situation n'est pas réglée.
- Le message affiché à Math pour ce cas reste à décider par Jean-Marc et Jean-François. Cette règle est classée **réversible** (détail interne du dépôt `storage/`).
- Tests attendus : deuxième incident avec un texte différent (les deux copies existent), même texte deux fois (une seule copie), plafond atteint (aucune copie supprimée), copie impossible (donnée d'origine intacte).

## Conséquences
- Simple et fiable pour le volume prévu ; aucune bibliothèque ajoutée.
- **Condition à communiquer à Math** : sur iPhone, l'app doit être **ajoutée à l'écran d'accueil** et utilisée de là ; utilisée seulement dans un onglet Safari, la liste pourrait être effacée après 7 jours sans visite.
- La liste n'est **pas sauvegardée ailleurs** que sur le téléphone : un téléphone perdu ou réinitialisé = liste perdue. Acceptable pour une liste d'épicerie ; une exportation pourra être ajoutée au backlog si Math le souhaite.
- Si un jour on a besoin de beaucoup de données (historique EPI-010) ou de synchronisation, on passera à IndexedDB ou à un serveur par un nouvel ADR, en changeant seulement l'implémentation du dépôt.
