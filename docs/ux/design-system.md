# Design system minimal — Ma liste d'épicerie

Statut : **Proposé** — Jean-François, 2026-10-19. Indépendant du framework (choix de Charle) : tout est exprimé en tokens et en comportements. Identité originale : sobre, verte (couleur de l'épicerie et du « fait »), sans logo de marque.

> **Contrastes** : ratios calculés à la main avec la formule WCAG 2.x (luminance relative) puis arrondis. Ils sont à **revérifier avec un outil** (ex. outil de contraste du navigateur) à l'implémentation ; si un écart apparaît, c'est le token qui change, pas la règle (texte ≥ 4,5:1, éléments d'interface ≥ 3:1).

## Couleurs (thème clair, par défaut)

| Token | Valeur | Usage | Contraste |
|---|---|---|---|
| `couleur-fond` | `#FFFFFF` | Fond de page | — |
| `couleur-texte` | `#1A1A1A` | Texte principal | 17,4:1 sur fond |
| `couleur-texte-secondaire` | `#595959` | Compteur, articles cochés, infos | 7,0:1 sur fond |
| `couleur-surface` | `#F2F2F2` | Ligne cochée, bandeau hors ligne | texte principal 15,6:1 ; texte secondaire 6,3:1 |
| `couleur-primaire` | `#1B6E3C` | Bouton Ajouter, case cochée | 6,3:1 sur fond ; texte blanc sur primaire 6,3:1 |
| `couleur-bordure-champ` | `#767676` | Contour du champ, case vide | 4,5:1 sur fond (≥ 3:1 requis) |
| `couleur-erreur` | `#B3261E` | Texte d'erreur, contour de champ en erreur | 6,5:1 sur fond |
| `couleur-focus` | `#0B57D0` | Anneau de focus (2 px, décalage 2 px) | 6,4:1 sur fond |
| `couleur-message-fond` | `#2B2B2B` | Message flottant d'annulation | texte blanc 14,2:1 |
| `couleur-message-action` | `#A8C7FA` | Bouton « Annuler » du message | 8,2:1 sur `couleur-message-fond` |

## Thème sombre (suit `prefers-color-scheme`, utile le soir à la maison)

| Token | Valeur | Contraste |
|---|---|---|
| `couleur-fond` | `#121212` | — |
| `couleur-surface` | `#1E1E1E` | — |
| `couleur-texte` | `#EDEDED` | 16,0:1 |
| `couleur-texte-secondaire` | `#B0B0B0` | 8,6:1 sur fond ; 7,7:1 sur surface |
| `couleur-primaire` | `#6FCF97` (texte du bouton : `#121212`) | 9,8:1 |
| `couleur-bordure-champ` | `#8A8A8A` | 5,4:1 sur fond ; 4,8:1 sur surface |
| `couleur-erreur` | `#F2B8B5` | 11,0:1 |
| `couleur-focus` | `#8AB4F8` | 8,9:1 |
| `couleur-message-fond` / texte / action | `#E6E6E6` / `#121212` / `#0B57D0` | 15,0:1 / 5,1:1 |

Règle : **l'information n'est jamais portée par la couleur seule** (coché = coche + barré + section ; erreur = icône + texte).

## Couleurs de la plateforme (EPI-015)

À mettre dans `index.html` et le manifeste ; mêmes valeurs que les tokens, pour que la barre d'état se fonde avec l'en-tête (qui n'a pas de fond propre : il est sur `couleur-fond`).

| Où | Valeur | Source / raison |
|---|---|---|
| `<meta name="theme-color" media="(prefers-color-scheme: light)">` | `#FFFFFF` | = `couleur-fond` clair |
| `<meta name="theme-color" media="(prefers-color-scheme: dark)">` | `#121212` | = `couleur-fond` sombre |
| Manifeste `background_color` (une seule valeur) | `#121212` | Voir ci-dessous |
| Manifeste `theme_color` (si présent) | `#FFFFFF` | Les balises ci-dessus l'emportent ; valeur claire par défaut |

- **Contrastes** : le texte `#1A1A1A` sur `#FFFFFF` (17,4:1) et `#EDEDED` sur `#121212` (16,0:1) sont déjà vérifiés ci-dessus ; les barres système ne portent que l'heure et les icônes du système, qui choisissent leur propre couleur de contraste.
- **Pourquoi `#121212` pour `background_color`** : une seule valeur doit servir les deux thèmes. Un fond blanc éblouit le soir (c'est le défaut que le thème sombre doit éviter) ; un fond sombre de 1 s en plein jour est seulement inhabituel. Cela ne concerne que l'écran de démarrage Android : **sur l'iPhone, iOS ignore cette valeur**. L'icône de l'app doit avoir son propre fond opaque (vert `couleur-primaire`) pour être lisible sur les deux fonds.
- **Barre d'état iOS** : **[non vérifié]** je ne sais pas si l'app installée prend la couleur de `theme-color` ou le réglage `apple-mobile-web-app-status-bar-style`. Julie vérifie le scénario « barre d'état dans la couleur du thème » ; si c'est faux, la valeur `default` ou `black-translucent` du réglage iOS est à essayer (Charle/Pierrick).
- **Images de démarrage iOS (`apple-touch-startup-image`) : seulement si Julie constate un éclair blanc** (5 ouvertures à froid en mode sombre, app fermée complètement). Pas avant : il en faut une par taille d'écran, par orientation et par thème, c'est lourd à maintenir. Si nécessaire : image unie `#FFFFFF` (clair) et `#121212` (sombre), icône de l'app centrée optionnelle, pas de texte (rien à traduire ni à mettre à jour), une paire par taille d'iPhone pris en charge (liste à établir à ce moment-là), sélectionnées par `media="(prefers-color-scheme: …)"`. Avant d'en arriver là, Charle essaie d'abord les parades du fond dans `<head>` (`architecture.md`, EPI-015).

## Typographie
Polices du système (aucun chargement externe : indispensable hors ligne et pour la rapidité) : `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`. Tailles en `rem` (respect de l'agrandissement du texte par l'utilisateur).

| Rôle | Taille | Graisse | Interligne |
|---|---|---|---|
| Titre principal (h1) | 1,5 rem (24 px) | 700 | 1,3 |
| Titre de section (h2) | 1,125 rem (18 px) | 700 | 1,3 |
| Texte d'article | 1,125 rem (18 px) | 400 | 1,4 |
| Texte courant, champ, bouton | 1 rem (16 px) | 400 / 600 | 1,5 |
| Petit texte (compteur, aide) | 0,875 rem (14 px) | 400 | 1,4 |

Le champ de saisie fait au moins 16 px (sinon certains navigateurs mobiles zooment à la saisie). Les noms longs passent à la ligne ; jamais de troncature dans la liste.

## Espacement et tailles tactiles
- Échelle : 4, 8, 12, 16, 24, 32 px.
- **Cible tactile minimale : 48 × 48 px** (au-dessus du 44 px recommandé et du 24 px de WCAG 2.5.8), **8 px au moins** entre deux cibles.
- Ligne d'article : hauteur minimale 56 px ; toute la ligne (sauf le bouton Supprimer) est cliquable pour cocher.
- Barre d'ajout : champ 48 px de haut, bouton Ajouter 48 px de haut et 96 px de large minimum. **Toute la barre est une cible tactile** (voir le composant « Barre d'ajout »), au moins 48 px de haut et la largeur de la colonne.
- Marges latérales : 16 px. Colonne : largeur max 560 px.
- Rayon des coins : 8 px.

## Composants

### Barre d'ajout (EPI-001)
Bande fixe en bas de la colonne (largeur de la colonne, 560 px max), fond `couleur-surface`, filet de 1 px `couleur-bordure-champ` en haut, marges 16 px sur les côtés, 8 px en haut et en bas, plus la zone de sécurité de l'iPhone en bas (`env(safe-area-inset-bottom)`, qui prolonge le fond mais ne compte pas dans la cible). Contient l'étiquette « Nouvel article », le champ et le bouton « Ajouter ».
- **Cible tactile = toute la bande**, sauf le bouton « Ajouter » : étiquette, champ, marges et espace de 8 px entre le champ et le bouton. Hauteur ≈ 88 px (jamais moins de 48 px), largeur = colonne. Un toucher dans cette zone donne le focus au champ et ouvre le clavier ; le focus est donné **pendant** le geste (obligatoire sur iOS).
- Le clavier ouvert n'est jamais refermé par un toucher dans la bande, ni par « Ajouter » ou Entrée : le focus reste dans le champ entre deux ajouts.
- Contrastes de la bande : texte de l'étiquette `couleur-texte` sur `couleur-surface` 15,6:1 (clair) ; bordure du champ `#767676` sur `#F2F2F2` ≈ 4,1:1 (≥ 3:1) ; sombre : bordure `#8A8A8A` sur `#1E1E1E` 4,8:1.
- États : normal ; focus du champ (anneau 2 px + bordure 2 px) ; erreur (voir « Champ ») ; pas de survol (tactile). Pas d'état désactivé.
- Un seul vrai `<label>` visible relié au champ ; la bande étant cliquable par un gestionnaire de toucher, ce n'est pas elle qui porte la sémantique.

### Bouton principal « Ajouter »
Plein (`couleur-primaire`, texte blanc), 48 px de haut. États : normal ; survol (assombri ~10 %) ; focus (anneau 2 px `couleur-focus` + décalage 2 px) ; actif (assombri ~20 %) ; pas d'état désactivé (un nom vide produit un message, pas un bouton grisé inexplicable).

### Champ « Nouvel article »
Étiquette visible au-dessus (14 px, `couleur-texte`), champ 48 px, bordure 1 px `couleur-bordure-champ`. États : normal ; focus (bordure 2 px + anneau de focus) ; erreur (bordure 2 px `couleur-erreur` + message en dessous avec icône « ! » + `aria-invalid="true"` + `aria-describedby`) ; compteur dès 80 caractères. Attributs : `autocomplete="off"`, `enterkeyhint="done"` ou « ajouter », correction automatique selon le navigateur, pas de `maxlength` bloquant.

### Ligne d'article
Structure : case (48 px) · nom (flexible, 18 px) · bouton Supprimer (48 px). Séparateur 1 px `couleur-surface` entre lignes.
- Non cochée : case vide (contour `couleur-bordure-champ`, 24 px dans une zone de 48 px), texte `couleur-texte`.
- Cochée : case pleine `couleur-primaire` avec coche blanche, texte `couleur-texte-secondaire` **barré**, fond `couleur-surface`.
- Focus : anneau visible autour de la ligne ou de la case. Survol : fond `couleur-surface`.
- Bouton Supprimer : icône poubelle 24 px dans une cible de 48 px, `couleur-texte-secondaire`, nom accessible « Supprimer « pain » ». Pas de glissement latéral.

### Titre de section
h2 avec nombre entre parenthèses. Masquée si la section est vide.

### Message flottant (annulation)
Hors du flux, au-dessus de la barre d'ajout, largeur de la colonne moins 16 px de marge. Texte + bouton « Annuler » (48 px). `role="status"`. Durée : 5 s (voir point à signaler sur la durée), pause au survol et au focus. Un seul à la fois.

Sert aussi au retrait des articles cochés (EPI-006) : « 4 articles retirés » + « Annuler ». Un nouveau message (suppression ou retrait) remplace le courant et relance les 5 s ; l'action précédente devient définitive. Le message ne sert qu'à l'annulation ; l'erreur d'enregistrement a son propre bandeau (ci-dessous).

### Bouton secondaire « Retirer les articles cochés »
Contour 2 px `couleur-bordure-champ` (4,5:1), fond transparent, texte `couleur-texte` 16 px / 600, pleine largeur de colonne, 48 px de haut, 16 px de vide au-dessus. États : normal ; survol (fond `couleur-surface`) ; focus (anneau 2 px `couleur-focus`, décalage 2 px) ; actif (fond `couleur-surface` assombri). Ni plein ni rouge : l'action est réversible. Pas d'état désactivé (le bouton n'existe que s'il y a des articles cochés).

### Bandeau d'état (un seul à la fois, sous le titre)
Priorité : erreur d'enregistrement > confirmation d'enregistrement > liste illisible > hors ligne.
- *Erreur d'enregistrement* : fond `couleur-fond`, bordure 2 px `couleur-erreur`, icône « ! » `couleur-erreur`, texte `couleur-texte` (contraste 17,4:1 / 16,0:1), bouton « Réessayer » (secondaire, 48 px). `role="alert"`. Persistant.
- *Confirmation* : fond `couleur-surface`, icône coche, texte `couleur-texte`. `role="status"`. 5 s.
- *Liste illisible* (EPI-017) : même gabarit que l'erreur d'enregistrement : fond `couleur-fond`, bordure 2 px `couleur-erreur`, icône « ! » `couleur-erreur`, première ligne en gras (« Ta liste n'a pas pu être relue. »), texte `couleur-texte` (17,4:1 clair / 16,0:1 sombre ; bordure 6,5:1 / 11,0:1 sur le fond, ≥ 3:1 requis). Bouton « Fermer » (secondaire, 48 px, sous le texte, aligné à gauche, même contour que « Retirer les articles cochés »). `role="alert"`. Persistant : aucun minuteur ; se ferme seulement par « Fermer » ; non réaffiché dans la session une fois fermé.
- *Liste vide après liste illisible* (état vide, variante) : voir wireframes, écran 11b ; ne reprend jamais le texte de première ouverture.
- *Hors ligne* : voir ci-dessous.

### Message d'erreur de champ
Icône « ! » + texte `couleur-erreur`, sous l'étiquette et au-dessus du champ (visible malgré le clavier ouvert). Relié au champ. Annoncé (`role="alert"` accepté pour ce cas précis).

### Bandeau hors ligne
Fond `couleur-surface`, icône + texte, sous le titre. Neutre, pas rouge (ce n'est pas une panne). `role="status"`.

### État vide / « Tout est pris »
Icône décorative (`aria-hidden`), phrase courte, indication de l'action suivante.

## Mouvement
Aucune animation nécessaire. Si le déplacement d'un article coché est animé, l'animation dure ≤ 200 ms, sans clignotement, et est **supprimée** avec `prefers-reduced-motion: reduce`.

## Besoins pour le choix de la stack (contribution à Charle)
- Éléments HTML natifs pour champ, boutons, cases, listes : pas de composants personnalisés qui perdent la sémantique.
- Zones `aria-live` fiables (annonces d'ajout, cochage, suppression, hors ligne).
- Gestion du focus programmatique (après suppression, annulation, déplacement).
- Thème clair/sombre via variables CSS ; polices système ; aucune ressource externe (hors ligne).
- Prise en compte du clavier virtuel mobile (barre d'ajout visible au-dessus du clavier).
