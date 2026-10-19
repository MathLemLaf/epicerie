# 0003 — Stockage de la liste sur le téléphone (localStorage)

- Statut : Proposée
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

## Conséquences
- Simple et fiable pour le volume prévu ; aucune bibliothèque ajoutée.
- **Condition à communiquer à Math** : sur iPhone, l'app doit être **ajoutée à l'écran d'accueil** et utilisée de là ; utilisée seulement dans un onglet Safari, la liste pourrait être effacée après 7 jours sans visite.
- La liste n'est **pas sauvegardée ailleurs** que sur le téléphone : un téléphone perdu ou réinitialisé = liste perdue. Acceptable pour une liste d'épicerie ; une exportation pourra être ajoutée au backlog si Math le souhaite.
- Si un jour on a besoin de beaucoup de données (historique EPI-010) ou de synchronisation, on passera à IndexedDB ou à un serveur par un nouvel ADR, en changeant seulement l'implémentation du dépôt.
