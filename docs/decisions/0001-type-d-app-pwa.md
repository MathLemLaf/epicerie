# 0001 — Type d'app : application web installable (PWA)

- Statut : Acceptée (2026-10-19, validée par Math)
- Date : 2026-10-19
- Décideur : Math, sur recommandation de l'architecte (Charle)

## Contexte
Math a validé : une seule personne l'utilise (lui), pas de partage ni de synchronisation, surtout sur téléphone, et **le fonctionnement hors ligne est obligatoire** (fond du magasin sans réseau). Le MVP couvre EPI-001 à EPI-005 : ajouter, cocher, retrouver sa liste à la réouverture, utiliser hors ligne, supprimer avec annulation.
Il faut choisir la forme de l'app sur le téléphone. Le modèle de téléphone (iPhone ou Android) n'est pas encore connu ; hypothèse par défaut : iPhone.

**Précision à l'acceptation (2026-10-19)** : Math a un **iPhone**. La plateforme cible principale est donc **Safari sur iOS, avec l'app installée sur l'écran d'accueil**. Android reste compatible (même code) mais secondaire. Particularités iOS : voir `docs/architecture.md`, section « Plateforme cible ».

Une **PWA** (« Progressive Web App ») est un site web qu'on peut **ajouter à l'écran d'accueil** : il s'ouvre alors en plein écran avec sa propre icône, comme une vraie app, et peut fonctionner sans réseau. Il n'y a ni App Store ni Play Store à traverser.

## Options envisagées
| | PWA (site installable) | App native (Swift pour iPhone ou Kotlin pour Android) | App multiplateforme (React Native / Flutter) |
|---|---|---|---|
| Adéquation (solo, hors ligne, 1 écran) | ★★★ couvre tout le MVP | ★★★ | ★★★ |
| Simplicité | ★★★ un site statique | ★ outils Apple/Google, signature, comptes développeur | ★ chaîne de build mobile complète |
| Installation sur le téléphone | « Ajouter à l'écran d'accueil » dans le navigateur | App Store / TestFlight (Apple : 99 $ US par an) ou installation manuelle | idem native |
| iPhone **et** Android | oui, même code | un seul des deux | oui |
| Mises à jour | automatiques au prochain lancement en ligne | publication sur le store | publication sur le store |
| Maîtrise par l'équipe | très élevée (HTML, CSS, TypeScript) | moyenne | moyenne |
| Coût | 0 $ | jusqu'à 99 $ US par an + temps | idem native |
| Réversibilité | bonne : le cœur métier en TypeScript se réutilise dans React Native ou Capacitor | faible | moyenne |

## Décision
L'app est une **PWA** : un site statique (fichiers HTML, CSS, JavaScript, sans serveur applicatif), installable sur l'écran d'accueil du téléphone et utilisable sans réseau.

## Conséquences
- Aucun serveur, aucun compte, aucune donnée hors du téléphone : rien à sécuriser côté serveur.
- **Sur iPhone, l'installation passe par Safari** (bouton Partager → « Sur l'écran d'accueil »). C'est aussi la condition pour que la liste soit protégée de l'effacement automatique de Safari (voir ADR 0003). Ce geste est fait une seule fois.
- Pas de notifications, d'accès aux contacts, etc. : aucun n'est prévu au backlog.
- Si un jour l'app doit aller sur un store, on pourra l'emballer (Capacitor) ou réécrire l'écran en natif en gardant le cœur métier.
