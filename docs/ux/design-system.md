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
- Barre d'ajout : champ 48 px de haut, bouton Ajouter 48 px de haut et 96 px de large minimum.
- Marges latérales : 16 px. Colonne : largeur max 560 px.
- Rayon des coins : 8 px.

## Composants

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
