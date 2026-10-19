# Ma liste d'épicerie (nom provisoire)

Liste d'achats pour téléphone, utilisable sans réseau. Application web installable (PWA), sans serveur : la liste reste sur le téléphone.

- Produit : `docs/produit/` · UX : `docs/ux/` · Architecture : `docs/architecture.md` · Décisions : `docs/decisions/`
- État : squelette seulement. ADR 0001 à 0007 acceptées. Cible principale : iPhone (Safari iOS, app installée).

## Installation

Prérequis : Node.js 24 LTS (voir `.nvmrc`).

```sh
npm install
npx playwright install chromium webkit   # une fois, pour les tests de bout en bout
```

## Commandes

| Besoin | Commande |
|---|---|
| Lancer en développement (sans hors ligne) | `npm run dev` |
| Tests unitaires | `npm test` |
| Tests de bout en bout (build + navigateur, dont hors ligne) | `npm run test:e2e` |
| Types + lint + tests unitaires | `npm run check` |
| Formater et corriger le style | `npm run format` |
| Construire la version à publier (`dist/`) | `npm run build` |
| Essayer la version construite (avec hors ligne) | `npm run preview` |

## Installer sur le téléphone

Une fois l'app publiée (ADR 0005), ouvrir son adresse :
- **iPhone** : dans **Safari**, bouton Partager → « Sur l'écran d'accueil ». Toujours ouvrir l'app depuis cette icône : c'est ce qui protège la liste de l'effacement automatique de Safari.
- **Android** : dans Chrome, menu → « Installer l'application ».

Après l'installation, **ouvrir l'app une première fois depuis son icône, avec du réseau** (sur iPhone, l'app installée a son propre stockage, séparé de Safari). Ensuite elle fonctionne en mode avion.

Les nouvelles versions s'appliquent à la prochaine ouverture après une fermeture complète de l'app, jamais en plein usage (ADR 0007).
