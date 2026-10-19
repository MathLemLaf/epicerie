# Exigences d'accessibilité et critères UX à intégrer aux stories

Statut : **Proposé** — à intégrer par Jean-Marc aux critères d'acceptation ; Julie les reprend dans ses tests. Cible : **WCAG 2.2 niveau AA**.

## A. Exigences transversales (toutes les stories, checklist de test pour Julie)

| # | Exigence | Comment tester |
|---|---|---|
| A1 | Texte ≥ 4,5:1 ; éléments d'interface (bordures, case, focus) ≥ 3:1, thèmes clair et sombre | Outil de contraste sur les tokens et sur l'app rendue |
| A2 | Tout se fait au clavier : ajouter (Entrée), cocher (Espace), supprimer, annuler ; ordre de tabulation logique ; aucun piège | Parcours complet sans souris |
| A3 | Focus toujours visible (anneau ≥ 2 px, contraste ≥ 3:1) | Tabulation sur chaque contrôle |
| A4 | Cibles tactiles ≥ 48 × 48 px, 8 px d'écart | Mesure dans les outils du navigateur |
| A5 | Champ avec étiquette visible ; erreur décrite en texte, reliée au champ | Inspection + lecteur d'écran |
| A6 | Structure : un seul h1, h2 pour les sections, liste `ul/li`, vrais boutons, case à cocher native | Inspection du DOM |
| A7 | Les changements (ajout, cochage, suppression, annulation, hors ligne) sont annoncés par une zone `role="status"` | VoiceOver (iOS/macOS) ou TalkBack |
| A8 | Gestion du focus : après suppression → article voisin ou champ ; après annulation → article restauré ; après cochage → le focus suit l'article | Parcours clavier |
| A9 | Zoom 200 % et largeur 320 px : pas de défilement horizontal, rien de coupé, barre d'ajout utilisable | Test manuel |
| A10 | Orientation libre (portrait et paysage) | Rotation |
| A11 | Aucune animation clignotante ; `prefers-reduced-motion` respecté | Réglage système |
| A12 | `lang="fr-CA"`, titre de page « Ma liste d'épicerie » | Inspection |
| A13 | Taille du texte système agrandie (jusqu'à 200 %) : mise en page intacte | Réglage système |

## B. Critères à ajouter par story

**EPI-001 Ajouter**
- Le champ est focalisé à l'ouverture de l'app (le clavier du téléphone peut s'ouvrir sans autre toucher).
- Valider = touche Entrée du clavier **ou** bouton « Ajouter ».
- Après un ajout réussi, le focus reste dans le champ et la liste défile jusqu'au nouvel article.
- Nom vide : message « Écris le nom d'un article pour l'ajouter. » près du champ, avec icône ; le champ est `aria-invalid` ; le focus reste dans le champ.
- Trop long : message « Le nom est trop long : 100 caractères au maximum (tu en as N). Raccourcis-le. » ; le texte saisi est conservé ; la frappe n'est jamais bloquée ni tronquée silencieusement.
- Un compteur « N / 100 » apparaît dès 80 caractères.
- La longueur se compte en caractères visibles (« œ » et « é » comptent pour 1), après retrait des espaces.
- Le message d'erreur disparaît dès que la saisie change.

**EPI-002 Cocher**
- Toute la ligne (sauf Supprimer) est une cible de cochage d'au moins 48 px de haut.
- Coché = case pleine avec coche **et** texte barré **et** regroupé sous « Dans le panier » ; vérifié en niveaux de gris.
- Chaque cochage / décochage est annoncé (« « pain » mis dans le panier. »).
- Quand tout est pris, le message « Tout est dans ton panier ! » est affiché et annoncé.

**EPI-003 Conservation**
- Liste vide : message « Ta liste est vide. Écris ton premier article ci-dessous… » et focus dans le champ.

**EPI-004 Hors ligne**
- Sans réseau, un bandeau neutre « Hors ligne. Ta liste fonctionne normalement. » est visible, annoncé une seule fois ; il disparaît au retour du réseau.
- Aucune erreur ni fenêtre bloquante n'apparaît à cause de l'absence de réseau.

**EPI-005 Supprimer**
- Chaque ligne a un bouton « Supprimer » visible (pas seulement un geste de glissement), de 48 px, au nom accessible « Supprimer « lait » ».
- Aucune confirmation avant suppression ; un message « « lait » supprimé » avec bouton « Annuler » apparaît 5 s au-dessus de la barre d'ajout, sans la masquer.
- Le message est atteignable au clavier et lu par les lecteurs d'écran ; le minuteur est en pause tant que le message est survolé ou a le focus.
- L'annulation remet l'article à sa place avec son état et son focus.

## C. Références
WCAG 2.2 : 1.4.1 (couleur seule), 1.4.3 (contraste), 1.4.10 (reflow), 1.4.11 (contraste non textuel), 2.1.1 (clavier), 2.2.1 (délai ajustable), 2.4.7 (focus visible), 2.5.7 (alternative au glissement), 2.5.8 (taille de cible), 3.3.1 / 3.3.3 (erreurs), 4.1.3 (messages d'état).
