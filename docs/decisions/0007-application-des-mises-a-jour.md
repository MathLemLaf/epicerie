# 0007 — Mises à jour de l'app : appliquées à la prochaine ouverture, jamais en plein usage

- Statut : Acceptée (2026-10-19) — décision réversible, prise par l'architecte (voir « Classement »)
- Date : 2026-10-19
- Décideur : architecte (Charle)
- Remplace : le point « Mises à jour » de l'ADR 0004 (le reste de 0004 s'applique toujours)
- Dépend de : 0003 (stockage), 0004 (hors ligne)
- Story : EPI-004 (scénarios « mise à jour sans risque », « jamais interrompu », « quand la nouvelle version s'applique »)

## Contexte
L'ADR 0004, validée par Math, prévoit que les mises à jour se téléchargent seules et **s'appliquent au lancement suivant**, et la story EPI-004 exige que **l'écran ne se recharge jamais tout seul** pendant l'usage.
Vérification faite le 2026-10-19 dans la documentation de vite-plugin-pwa (guide « Automatic reload ») : le réglage `registerType: "autoUpdate"` retenu par 0004 fait l'inverse. Dès qu'une nouvelle version est téléchargée, il **recharge l'écran ouvert**, et la documentation avertit qu'une saisie en cours peut être perdue. Elle conseille le mode `prompt` pour les apps qui ont un formulaire, et elle précise que changer de mode après la mise en ligne est pénible : il faut donc régler ce point **avant le premier déploiement**.

Rappel : une mise à jour remplace les **fichiers de l'app**, mais ne touche jamais la **liste**. Celle-ci est dans le localStorage (ADR 0003), un tiroir séparé que le service worker n'ouvre pas.

## Options envisagées
| | A. Attente naturelle (mode `prompt`, sans bouton) | B. `autoUpdate` (réglage actuel) | C. Bouton « Nouvelle version : recharger » |
|---|---|---|---|
| Écran rechargé en plein usage | jamais | **oui** : saisie en cours perdue | jamais, c'est Math qui choisit |
| Quand la nouvelle version s'applique | à la prochaine ouverture **après fermeture complète** de l'app | tout de suite | quand Math touche le bouton |
| Travail en plus | aucun écran ; réglage seulement | aucun | un écran, des textes, des tests (Jean-François, Pierrick, Julie) |
| Conforme à 0004 et à EPI-004 | oui | non | oui, mais ajoute un bouton que 0004 excluait du MVP |
| Inconvénient | sur iPhone, si l'app reste en arrière-plan des jours, la mise à jour attend | — | une décision de plus à prendre pour Math |

## Décision
**Option A.**
- Pierrick règle vite-plugin-pwa en `registerType: "prompt"`, **sans afficher de bouton** : la nouvelle version se télécharge en arrière-plan, puis **attend**.
- Elle s'applique quand **plus aucune fenêtre de l'app n'est ouverte**, donc à l'ouverture suivante. Sur iPhone, l'app est complètement fermée quand Math la balaie vers le haut dans le sélecteur d'apps, quand iOS la ferme de lui-même (fréquent après quelques heures en arrière-plan) ou quand le téléphone redémarre. Un simple retour à l'écran d'accueil ne suffit pas, puisque l'app reste en veille.
- Aucun code de l'app ne force l'activation (`skipWaiting`) ni ne recharge la page.
- Sans réseau, la vérification de mise à jour échoue **en silence** : le navigateur garde la version présente et n'affiche aucune erreur.
- Une nouvelle version qui change le format de la liste doit le **migrer** (numéro `version`, ADR 0003) avec un test de migration. Si elle trouve un format qu'elle ne connaît pas, elle le conserve sans l'écraser.

## Classement
Décision **réversible** : un réglage dans `vite.config.ts` et `src/main.ts`, rien dans le métier ni les données. Elle ne change pas le comportement validé par Math, elle rend le réglage conforme à l'intention de 0004 (« s'applique au lancement suivant », pas de bouton). Elle est donc acceptée directement. Si Math veut un jour un bouton « Mettre à jour » (option C), il faudra une story et un nouvel ADR.

## Conséquences
- Math n'est jamais interrompu par une mise à jour, et sa liste n'est jamais touchée par une mise à jour.
- Une correction publiée met parfois plus de temps à arriver sur l'iPhone, jusqu'à la prochaine fermeture complète. Si c'est urgent, il suffit de fermer l'app depuis le sélecteur d'apps puis de la rouvrir avec du réseau.
- Il faut deux ouvertures pour voir une nouvelle version : la première la télécharge, la suivante (après fermeture) l'utilise.
- Le test automatisé de ce comportement demande deux versions construites de l'app (Chromium). C'est un test plus lourd que les autres, d'où le découpage d'EPI-004 recommandé dans `docs/architecture.md`.
