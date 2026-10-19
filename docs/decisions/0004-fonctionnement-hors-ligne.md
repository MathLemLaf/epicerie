# 0004 — Fonctionnement hors ligne : service worker généré par vite-plugin-pwa

- Statut : Proposée
- Date : 2026-10-19
- Décideur : Math, sur recommandation de l'architecte (Charle)
- Dépend de : 0001 (PWA), 0002 (stack), 0003 (stockage)
- Story : EPI-004 (consulter et cocher sans réseau, ouverture en moins de 2 s)

## Contexte
Hors ligne, deux choses doivent être disponibles sur le téléphone :
1. **les données** (la liste) : réglé par l'ADR 0003, elles ne quittent jamais le téléphone ;
2. **l'app elle-même** (ses fichiers HTML, CSS, JavaScript, icône) : sans précaution, le navigateur les redemande au serveur à chaque ouverture et affiche une erreur en mode avion.

Un **service worker** est un petit programme que le navigateur installe à côté de l'app : il garde une copie de tous ses fichiers et les sert directement, avec ou sans réseau. C'est le mécanisme standard des PWA.

Versions vérifiées le 2026-10-19 (npm) : vite-plugin-pwa 2.0.0 (publié le 2026-10-03, compatible Vite 8), qui s'appuie sur Workbox 7.4 (bibliothèque de Google pour les service workers).

## Options envisagées
| | vite-plugin-pwa (service worker généré) | Service worker écrit à la main | Pas de service worker |
|---|---|---|---|
| Adéquation (hors ligne obligatoire) | ★★★ | ★★★ | ✗ l'app ne s'ouvre pas en mode avion |
| Simplicité | ★★★ quelques lignes de configuration | ★ liste des fichiers et numéro de version du cache à tenir à jour à la main | — |
| Risque d'erreur | faible : la liste des fichiers est calculée à chaque build | élevé : un oubli = ancienne version bloquée ou fichier manquant hors ligne | — |
| Maturité | élevée (Workbox, très répandu) | — | — |
| Réversibilité | bonne : configuration dans `vite.config.ts` seulement | — | — |

## Décision
- **vite-plugin-pwa** génère, à chaque build, le service worker et le manifeste d'installation (nom, icône, couleurs).
- Stratégie : **tous les fichiers de l'app sont mis en cache à la première visite** (« precache »). Ensuite l'app s'ouvre depuis le téléphone, avec ou sans réseau.
- Mises à jour : **automatiques** (`registerType: "autoUpdate"`) : quand Math ouvre l'app avec du réseau, la nouvelle version est téléchargée et s'applique au lancement suivant. Pas de bouton « Mettre à jour » à gérer pour le MVP.
- L'app ne fait **aucun appel réseau** pour fonctionner. Le bandeau « Hors ligne » des wireframes n'est qu'une information (événements `online` / `offline` du navigateur).

## Conséquences
- En mode avion, l'app s'ouvre et fonctionne entièrement, à condition d'avoir été ouverte **une fois avec du réseau** après chaque installation.
- Le service worker n'est actif que dans la **version construite** (`npm run build`, puis `npm run preview` ou en ligne), pas avec `npm run dev`. Les tests hors ligne tournent donc sur la version construite.
- Test automatisé : `e2e/coquille-hors-ligne.spec.ts` vérifie qu'après une première visite l'app s'ouvre en mode avion simulé (Chromium). Contre-épreuve faite le 2026-10-19 : le test échoue si le service worker est bloqué.
- Limite connue : la simulation de mode avion fiable n'existe que sur Chromium (Android). Sur iPhone, Julie vérifie EPI-004 **à la main** sur un vrai téléphone en mode avion.
- Le site doit être servi en **HTTPS** (obligatoire pour un service worker) : couvert par l'hébergement (ADR 0005).
