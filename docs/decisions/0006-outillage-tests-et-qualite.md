# 0006 — Outillage de tests et de qualité

- Statut : Acceptée (2026-10-19) — décision réversible, prise par l'architecte ; ne s'applique que si l'ADR 0002 est acceptée
- Date : 2026-10-19
- Décideur : architecte (Charle)
- Dépend de : 0002 (stack)

## Contexte
L'équipe travaille en TDD (Pierrick, tests unitaires) et transforme chaque scénario d'acceptation en test automatisé (Julie). Il faut : des tests unitaires rapides pour le domaine, des tests de bout en bout dans un vrai navigateur (dont le hors ligne d'EPI-004), un vérificateur de style et de types.
Ce choix est **réversible** : changer d'outil de test ou de lint ne touche pas le code de l'app.

Versions vérifiées le 2026-10-19 (npm) : Vitest 5.0, Playwright 1.64, Biome 2.5, happy-dom 21.

## Options envisagées
| | Vitest + Playwright + Biome | Jest + Cypress + ESLint/Prettier | Vitest seul |
|---|---|---|---|
| Intégration avec Vite | ★★★ Vitest réutilise la config Vite | ★ configuration TypeScript séparée | ★★★ |
| Tests en vrai navigateur, mobile, hors ligne | ★★★ Playwright : Chromium et WebKit (moteur de Safari), mode avion simulé | ★★ Cypress : pas de WebKit stable | ✗ |
| Nombre d'outils de lint/format | 1 (Biome, l'équivalent de ruff) | 2 + plugins | — |
| Maturité | ★★★ | ★★★ | ★★★ |

## Décision
| Besoin | Outil | Commande |
|---|---|---|
| Tests unitaires et d'intégration (domaine, stockage, écran) | **Vitest**, environnement DOM simulé **happy-dom** | `npm test` |
| Tests de bout en bout (acceptation) | **Playwright**, projets « android-chrome » (Pixel 7) et « iphone-safari » (iPhone 15, WebKit) | `npm run test:e2e` |
| Lint et formatage | **Biome** | `npm run lint`, `npm run format` |
| Types | **TypeScript** (`tsc --noEmit`) | `npm run typecheck` |
| Tout avant un commit | — | `npm run check` |

Conventions :
- Tests unitaires à côté du code : `src/**/<nom>.test.ts`. Tests de bout en bout dans `e2e/`, un fichier par story (`e2e/epi-001-ajouter-article.spec.ts`), un test par scénario, **nommé comme le scénario**.
- Les tests de bout en bout tournent sur la version construite (`npm run build` + `vite preview`, lancé automatiquement par Playwright), seule à avoir le service worker.
- Un test qui ne peut tourner que sur Chromium (mode avion simulé) porte l'étiquette `@chromium-seulement` dans son nom.

## Conséquences
- Une commande par besoin, documentée dans le README.
- Playwright télécharge ses navigateurs une fois (`npx playwright install chromium webkit`, environ 250 Mo).
- WebKit dans Playwright n'est pas Safari sur iPhone : la vérification finale du hors ligne et de l'installation sur iPhone reste manuelle (Julie).
