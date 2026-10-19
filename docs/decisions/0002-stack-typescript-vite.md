# 0002 — Stack : TypeScript et Vite, sans framework d'interface

- Statut : Acceptée (2026-10-19, validée par Math)
- Date : 2026-10-19
- Décideur : Math, sur recommandation de l'architecte (Charle)
- Dépend de : 0001 (PWA)

## Contexte
Une PWA s'écrit en HTML, CSS et JavaScript, les seuls langages qu'un navigateur exécute. Python (ADR d'équipe 0002) ne s'exécute pas dans le navigateur du téléphone ; il n'est donc pas retenu ici.
L'app a **un seul écran** (la liste, son champ d'ajout, un message d'annulation), d'après les wireframes de Jean-François.

Termes :
- **TypeScript** : JavaScript avec des types vérifiés avant l'exécution ; il attrape beaucoup d'erreurs (ex. passer un texte là où on attend un nombre) avant que Math ne les voie.
- **Vite** : l'outil qui sert l'app pendant le développement et produit les fichiers finaux, optimisés, à publier.
- **Framework d'interface** (React, Vue, Svelte…) : bibliothèque qui met à jour l'écran à partir des données. Utile pour des interfaces riches ; pour un seul écran, du TypeScript simple suffit.

Versions vérifiées le 2026-10-19 (npm, nodejs.org) : Node.js 24 (LTS, version de support long), TypeScript 7.0 (stable depuis juillet 2026, même comportement que 6.0), Vite 8.3.

## Options envisagées
| | TypeScript + Vite, sans framework | TypeScript + Vite + React | JavaScript sans outil (fichiers à la main) |
|---|---|---|---|
| Adéquation (1 écran) | ★★★ | ★★ plus que nécessaire | ★★ |
| Simplicité / dépendances | ★★★ aucune bibliothèque livrée au téléphone | ★★ React + ses mises à jour | ★★★ rien à installer |
| Fiabilité (erreurs attrapées tôt) | ★★★ types | ★★★ types | ★ aucune vérification |
| Hors ligne (ADR 0004) | ★★★ plugin Vite dédié | ★★★ | ★ service worker écrit et versionné à la main |
| Maîtrise par l'équipe | ★★★ | ★★★ | ★★ |
| Réversibilité | bonne : ajouter React plus tard ne touche que le dossier `ui/` | bonne | moyenne |

## Décision
- Langage : **TypeScript** (mode strict).
- Outil de build et serveur de développement : **Vite**.
- Interface : **TypeScript et API du navigateur (DOM), sans framework**. Si l'interface grossit au point que la mise à jour de l'écran devient pénible, on ajoutera un framework par un nouvel ADR ; la frontière `ui/` rend ce changement local.
- Environnement : **Node.js 24 LTS** (fichier `.nvmrc`), gestionnaire **npm** (fourni avec Node), dépendances verrouillées dans `package-lock.json` versionné.
- Architecture : Clean Architecture **allégée**, proportionnée à la taille de l'app (voir `docs/architecture.md`) : un domaine pur, des adaptateurs (stockage, écran), un point d'assemblage.

## Conséquences
- Première app de l'équipe en TypeScript : si une deuxième app web suit, il faudra un ADR d'équipe « Outillage standard des projets TypeScript », sur le modèle de l'ADR d'équipe 0002 (Python).
- Le code livré au téléphone est minuscule (quelques kilo-octets) : ouverture rapide, compatible avec l'objectif « ajouter en moins de 5 s ».
- Sans framework, Pierrick doit garder le code d'affichage discipliné (une fonction qui redessine la liste à partir de l'état) ; c'est décrit dans `docs/architecture.md`.
- Node 24 reste supporté jusqu'en avril 2028 ; le passage à une version LTS suivante se fera par un nouvel ADR.
