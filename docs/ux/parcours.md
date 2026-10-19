# Parcours — Ma liste d'épicerie (MVP)

Statut : **Proposé** — Jean-François (UX), 2026-10-19. Périmètre : EPI-001 à EPI-006 et EPI-016 (validé par Math). Mise à jour 2026-10-19 : parcours 3 (EPI-006) et 4 (EPI-016) ajoutés.

## Utilisateur et contexte

**Proto-persona : Math** *(hypothèse : jamais observé en situation réelle ; à confirmer après 3 semaines d'usage)*
- Seul utilisateur, francophone québécois, tutoiement dans l'interface.
- Appareil : téléphone, écran d'environ 360 px de large, **une main**, le pouce fait tout le travail.
- Deux situations :
  1. **À la maison** : en pleine action (cuisine, mains parfois mouillées), il pense « plus de lait » et veut noter ça en moins de 5 secondes, puis retourner à ce qu'il faisait.
  2. **Au magasin** : debout, une main sur le panier, éclairage fort, réseau souvent absent. Il veut voir d'un coup d'œil « ce qu'il me reste à prendre ».
- Frustrations : papier égaré, notes éparpillées, article oublié, application lente à ouvrir.

Principes qui en découlent :
- **Le champ d'ajout est déjà actif à l'ouverture** et placé **en bas** (zone du pouce).
- **Une seule action principale par écran** : ajouter. Cocher est l'action répétée, donc la plus grande cible.
- **Rien n'est jamais bloquant** : pas de confirmation avant suppression, mais une annulation possible (contrôle et liberté).

## Parcours 1 — Noter un article à la maison (EPI-001, EPI-003)

```mermaid
flowchart LR
  A[Math pense: plus de lait] --> B[Ouvre l'app]
  B --> C[Liste affichée, champ d'ajout prêt à écrire]
  C --> D[Écrit: lait]
  D --> E[Touche Ajouter ou Entrée]
  E --> F{Nom valide ?}
  F -- oui --> G[Lait apparait en bas de À prendre, champ vidé, focus conservé]
  G --> H{Autre article ?}
  H -- oui --> D
  H -- non --> I[Ferme l'app: la liste est conservée]
  F -- nom vide --> J[Message près du champ: Écris le nom d'un article] --> D
  F -- plus de 100 caractères --> K[Message près du champ: trop long, compteur] --> D
```

Sur iPhone, l'étape « champ prêt » comporte **un toucher** (le clavier ne peut pas s'ouvrir seul) :

```mermaid
flowchart LR
  A[Ouvre l'app] --> B[Champ actif, clavier fermé]
  B --> C[1 toucher n'importe où dans la barre d'ajout]
  C --> D[Clavier ouvert, curseur dans le champ]
  D --> E[Écrit et valide] --> F[Clavier reste ouvert, champ vidé] --> G{Autre article ?}
  G -- oui --> E
```

Raison de chaque étape :
- *Champ prêt à l'ouverture* : l'objectif « moins de 5 s » ne laisse pas de place à un bouton « + » qui ouvre un autre écran. Sur iPhone, un seul toucher dans une barre entièrement touchable (≥ 48 px, pleine largeur) remplace l'ouverture automatique du clavier, impossible sur cette plateforme.
- *Focus conservé après l'ajout* : on note souvent plusieurs articles d'affilée (clavier reste ouvert).
- *Erreur près du champ* : l'utilisateur corrige sans chercher ; le texte saisi n'est jamais effacé.

## Parcours 2 — Faire l'épicerie au magasin (EPI-002, EPI-004, EPI-005)

```mermaid
flowchart LR
  A[Arrive au magasin, sans réseau] --> B[Ouvre l'app]
  B --> C[Voit sa liste en moins de 2 s, indication Hors ligne discrète]
  C --> D[Met un article dans le panier]
  D --> E[Touche l'article pour le cocher]
  E --> F[L'article passe sous Dans le panier, barré et coché]
  F --> G{Reste-t-il des articles à prendre ?}
  G -- oui --> D
  G -- non --> H[Message: Tout est dans ton panier]
  C --> I[Article ajouté par erreur ou plus nécessaire]
  I --> J[Touche l'icône Supprimer de la ligne]
  J --> K[Article disparait, message Annuler pendant 5 s]
  K -- Annuler --> L[Article revient à sa place avec son état]
  K -- rien --> M[Suppression définitive]
  E -- erreur de doigt --> N[Touche à nouveau pour décocher]
```

Raison de chaque étape :
- *Aucun écran de chargement ni de connexion* : tout est local, la liste s'affiche d'abord.
- *Indication hors ligne discrète* : informative et rassurante, pas une alerte (rien ne cesse de fonctionner).
- *Cocher = toucher la ligne entière* (grande cible, loi de Fitts) ; décocher est le même geste (cohérence, réversibilité).
- *Supprimer = bouton visible sur chaque ligne*, pas de glissement : un glissement n'est pas découvrable, pas faisable au clavier ni avec un lecteur d'écran (WCAG 2.5.7).
- *Pas de confirmation avant suppression* mais annulation : plus rapide qu'un « Es-tu sûr ? » qu'on valide par réflexe (prévenir/corriger les erreurs).

## Parcours 3 — Repartir à zéro après l'épicerie (EPI-006)

```mermaid
flowchart LR
  A[Rentre à la maison, panier rangé] --> B[Voit Dans le panier avec ses articles cochés]
  B --> C[Touche Retirer les N articles cochés]
  C --> D[Articles retirés tout de suite, section masquée]
  D --> E[Message: N articles retirés + Annuler, 5 s, au-dessus de la barre d'ajout]
  E -- rien --> F{Reste-t-il des articles à prendre ?}
  F -- oui --> G[Liste normale, focus sur le dernier article à prendre]
  F -- non --> H[Liste vide, focus dans le champ d'ajout]
  E -- Annuler --> I[Les N articles reviennent cochés en tête de Dans le panier, focus sur le premier]
  E -- autre suppression ou retrait --> J[Le message est remplacé: le retrait précédent est définitif]
```

Raison de chaque étape :
- *Bouton en fin de section, avec le nombre dans le libellé* : on sait ce qui part avant de toucher ; pas de confirmation parce que l'annulation de 5 s la remplace (décision de Math, même mécanique que EPI-005 : cohérence).
- *Retrait immédiat* : une confirmation qu'on valide par réflexe protège moins qu'une annulation, et ralentit le geste de fin d'épicerie.
- *Un seul message à la fois* : l'écran reste lisible ; en échange, une nouvelle suppression ou un nouveau retrait rend le précédent définitif (règle décidée par Math, communiquée dans le message lui-même par son remplacement).
- *Après « tout retiré »* : liste vide (écran 1), prête pour la semaine suivante.

## Parcours 4 — Quand l'enregistrement échoue (EPI-016)

```mermaid
flowchart LR
  A[Math modifie sa liste: ajout, cochage, suppression, retrait] --> B{Enregistrement réussi ?}
  B -- oui --> C[Rien de plus à montrer]
  B -- non --> D[Le changement reste affiché, bandeau d'erreur sous le titre, annoncé]
  D --> E[Math touche Réessayer]
  E --> F{Enregistrement réussi ?}
  F -- oui --> G[Confirmation 5 s: Ta liste est de nouveau enregistrée.]
  F -- non --> H[Le bandeau reste, Nouvel essai sans succès. est annoncé] --> E
  D -.-> I[Hors ligne en même temps ? Le bandeau d'erreur remplace Hors ligne]
```

Raison de chaque étape :
- *Le changement reste affiché* : rien ne disparaît, Math peut recopier ou réessayer plutôt que de tout retaper.
- *Bandeau sous le titre, persistant* : visible dès qu'il regarde l'écran, jamais chassé par un message temporaire.
- *Erreur prioritaire sur « Hors ligne »* : « Ta liste fonctionne normalement » ne doit jamais s'afficher en même temps que « Impossible d'enregistrer » (heuristique 1 : état du système fidèle).

## Parcours 5 — Quand la liste enregistrée est illisible (EPI-017)

```mermaid
flowchart TD
  A[Math ouvre l'app] --> B{Liste enregistrée lisible ?}
  B -- oui, avec ou sans article --> C[Écran normal, aucun avis]
  B -- aucune donnée: première ouverture --> D[Écran 1: Ta liste est vide. Écris ton premier article...]
  B -- non: abîmée ou format inconnu --> E[Copie du texte d'origine conservée, liste vide affichée]
  E --> F[Avis sous le titre, annoncé: Ta liste n'a pas pu être relue...]
  F --> G[Liste vide variante: Ta nouvelle liste est vide]
  G --> H{Math}
  H -- ajoute des articles --> I[L'app fonctionne normalement, avis toujours là, copie intacte]
  H -- touche Fermer --> J[Avis fermé, focus dans le champ d'ajout]
  J --> K{Rien ajouté et app fermée ?}
  K -- oui --> L[Prochaine ouverture: l'avis revient]
  K -- non: un enregistrement a réussi --> M[Plus d'avis aux ouvertures suivantes]
  F -.-> N[Échec d'enregistrement en même temps: l'erreur passe devant, l'avis revient après]
```

Raison de chaque étape :
- *Un avis, pas une liste vide muette* : sans lui, Math croirait à un premier lancement, ajouterait des articles et ignorerait que son ancienne liste existe (heuristique 1, état du système ; « zéro article perdu »).
- *« Rien n'est effacé »* : la première question de Math est « ai-je tout perdu ? » ; la réponse vient avant toute explication.
- *Pas de bouton de récupération* : décision de Math, la copie reste sur le téléphone. Le texte ne promet donc que ce qui est vrai : « une copie est gardée ».
- *Reste jusqu'à « Fermer »* : l'information ne se répète pas et un délai la ferait manquer ; la fermeture est volontaire (contrôle et liberté) et ne dure que la session, car le problème, lui, tant que rien n'est enregistré, existe toujours.
- *« Ta nouvelle liste est vide »* : la liste vide n'est jamais présentée comme une première ouverture.
