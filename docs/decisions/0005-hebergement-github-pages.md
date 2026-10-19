# 0005 — Hébergement : GitHub Pages, déployé par GitHub Actions

- Statut : Proposée
- Date : 2026-10-19
- Décideur : Math, sur recommandation de l'architecte (Charle)
- Dépend de : 0001 (PWA), 0004 (hors ligne)

## Contexte
Pour installer la PWA, le téléphone doit pouvoir la charger **une fois** depuis une adresse web en **HTTPS**. Ensuite elle fonctionne sans réseau. L'app est un ensemble de fichiers statiques (aucun serveur applicatif, aucune base de données distante) : un hébergement de **site statique** suffit.
Math a déjà un compte GitHub, et le dépôt d'équipe y est hébergé.

Faits vérifiés le 2026-10-19 : GitHub Pages est gratuit pour un **dépôt public** ; pour un dépôt privé, il faut un forfait payant (GitHub Pro ou plus). Cloudflare propose aussi l'hébergement statique gratuit, y compris depuis un dépôt privé, mais demande un compte de plus.

**Ce qui serait public** avec GitHub Pages gratuit : le **code** de l'app et ses documents (vision, backlog, ADR). **La liste d'épicerie de Math, elle, n'est jamais en ligne** : elle reste sur le téléphone (ADR 0003). L'adresse du site serait du type `https://<compte>.github.io/epicerie/`.

## Options envisagées
| | GitHub Pages (dépôt public) | Cloudflare (dépôt privé) | GitHub Pages (dépôt privé, GitHub Pro) |
|---|---|---|---|
| Coût | 0 $ | 0 $ | abonnement GitHub Pro (quelques dollars par mois, tarif non vérifié) |
| Simplicité | ★★★ même plateforme que le code | ★★ un compte et un outil de plus | ★★★ |
| Code visible par tous | oui | non | non |
| HTTPS | inclus | inclus | inclus |
| Réversibilité | excellente : ce sont des fichiers statiques, déplaçables n'importe où | excellente | excellente |

## Décision
- Le dépôt `apps/epicerie` est publié sur GitHub comme **dépôt public**, et le site est déployé sur **GitHub Pages** par un workflow **GitHub Actions** à chaque mise à jour de la branche `main` (build, puis publication du dossier `dist/`).
- Si Math préfère garder le code privé : **Cloudflare** (gratuit) est l'option de repli, sans autre changement dans l'app.

## Conséquences
- Coût nul, HTTPS automatique, mises à jour publiées sans geste manuel.
- Le code et la documentation produit sont lisibles par tous ; aucun secret ni donnée personnelle ne doit jamais y figurer (règle déjà en vigueur).
- L'app étant servie dans un sous-dossier (`/epicerie/`), la configuration Vite devra déclarer ce chemin (`base`) au moment de la mise en place du déploiement.
- Rien n'est publié tant que Math n'a pas donné son accord pour créer le dépôt distant et pousser (règle d'équipe).
