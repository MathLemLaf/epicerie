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
| A7 | Les changements (ajout, cochage, suppression, retrait des cochés, annulation, hors ligne) sont annoncés par une zone `role="status"` ; l'échec d'enregistrement par `role="alert"` | VoiceOver (iOS/macOS) ou TalkBack |
| A8 | Gestion du focus : après suppression → article voisin ou champ ; après annulation → article restauré ; après cochage → le focus suit l'article | Parcours clavier |
| A9 | Zoom 200 % et largeur 320 px : pas de défilement horizontal, rien de coupé, barre d'ajout utilisable | Test manuel |
| A10 | Orientation libre (portrait et paysage) | Rotation |
| A11 | Aucune animation clignotante ; `prefers-reduced-motion` respecté | Réglage système |
| A12 | `lang="fr-CA"`, titre de page « Ma liste d'épicerie » | Inspection |
| A13 | Taille du texte système agrandie (jusqu'à 200 %) : mise en page intacte | Réglage système |

## B. Critères à ajouter par story

**EPI-001 Ajouter**
- Le champ est focalisé à l'ouverture de l'app ; sur Android ou avec un clavier physique le clavier peut s'ouvrir sans autre toucher, **sur iPhone il ne s'ouvre pas tout seul** (limite de la plateforme, décision de Math).
- Sur iPhone, **un seul toucher n'importe où dans la barre d'ajout** (étiquette, champ, marges, espace entre le champ et le bouton), hors bouton « Ajouter », ouvre le clavier avec le curseur dans le champ. La zone touchable de la barre fait **≥ 48 px de haut et toute la largeur de la colonne** (mesure dans l'Inspecteur web ; ≈ 88 px attendus). Le bouton « Ajouter » (96 × 48 px min.) reste une cible distincte, à 8 px au moins du champ.
- Le clavier **reste ouvert** entre deux ajouts (Entrée ou « Ajouter ») ; un toucher dans la barre alors qu'il est ouvert ne le ferme pas. 5 essais à la main sur l'iPhone.
- La barre n'est pas masquée par le clavier ouvert ; à 200 % de zoom et à 320 px, elle reste utilisable (A9).
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
- Quand tout est pris, le message « Tout est dans ton panier ! Il ne reste rien à prendre. » est affiché et annoncé **dans la même annonce que le cochage** (zone d'annonces commune, une seule lecture : « « pain » mis dans le panier. Tout est dans ton panier ! Il ne reste rien à prendre. »). Le message affiché n'est pas lui-même une zone `aria-live`.
- Une annonce identique à la précédente est relue (ex. ajouter deux fois le même article) : la zone est vidée avant d'être réécrite.
- Le focus suit l'article déplacé pour la navigation au clavier ou au lecteur d'écran ; au toucher, la liste ne saute pas (le défilement ne bouge pas à cause du déplacement du focus). Si le clavier virtuel était ouvert, il se ferme au cochage (voulu).
- Les listes gardent leur sémantique de liste dans Safari/VoiceOver malgré `list-style: none` (`role="list"`).

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

**EPI-006 Retirer les articles cochés** (retrait immédiat, « Annuler » 5 s ; remplace le scénario « confirmation »)
- Le bouton n'existe que si « Dans le panier » existe ; il est en fin de section, pleine largeur, 48 px de haut, avec 16 px de vide au-dessus ; vrai `<button>`, nom accessible « Retirer les 4 articles cochés » (singulier : « Retirer l'article coché »).
- Aucune confirmation. Le message « 4 articles retirés » (« 1 article retiré ») avec « Annuler » apparaît au-dessus de la barre d'ajout, sans la masquer, 5 s, minuteur en pause au survol et au focus (même composant que EPI-005).
- Un seul message à la fois : un retrait remplace le message d'une suppression précédente (qui devient définitive), et inversement ; « Annuler » ne rétablit que la dernière action.
- « Annuler » rétablit tous les articles retirés, cochés, dans leur ordre d'origine, en tête de « Dans le panier » ; le focus va au premier article rétabli ; « 4 articles remis dans la liste. » est annoncé.
- Focus après retrait : dernier article de « À prendre » ; sinon champ d'ajout (liste vide). Le focus n'est jamais perdu (pas sur `body`).
- Annonce du retrait : « 4 articles retirés » lue une seule fois ; si la liste devient vide, « Ta liste est vide. » est aussi annoncé.
- Après retrait de tout : l'écran « liste vide » (EPI-003) s'affiche avec le message d'annulation, pas « Tout est dans ton panier ! ».
- Le retrait est enregistré tout de suite (fermer l'app pendant les 5 s : les articles restent retirés).
- Accessible sans glissement ni geste complexe (2.5.7). Nom accessible du bouton d'annulation : « Annuler le retrait de 4 articles ».

**EPI-016 Échec d'enregistrement**
- Le message d'échec est un bandeau sous le titre (pas le message flottant), avec icône « ! » + texte (jamais la couleur seule), `role="alert"`, contraste ≥ 4,5:1 dans les deux thèmes.
- Il est persistant : pas de minuteur, pas de bouton de fermeture ; il ne disparaît que sur enregistrement réussi.
- « Réessayer » : vrai `<button>`, 48 px, atteignable au clavier, ordre de tabulation juste après le titre. Nom accessible « Réessayer d'enregistrer ma liste ».
- Nouvel essai raté : « Nouvel essai sans succès. » est visible et annoncé (`role="status"`), le focus reste sur « Réessayer ».
- Réussite : le bandeau devient la confirmation « Ta liste est de nouveau enregistrée. » visible 5 s et annoncée (`role="status"`) ; le focus passe au champ d'ajout.
- Bandeau « Hors ligne » : jamais affiché en même temps que le bandeau d'erreur ; annonces de réseau suspendues pendant l'erreur.
- Rien ne disparaît : les articles affichés (y compris le dernier ajouté) restent à l'écran.

**EPI-017 Liste illisible**
- L'avis est un bandeau sous le titre (pas le message flottant) : icône « ! » + texte (jamais la couleur seule), contraste ≥ 4,5:1 pour le texte et ≥ 3:1 pour la bordure et l'icône dans les deux thèmes. Texte exact : textes-interface.md.
- `role="alert"`, annoncé **une seule fois** à l'ouverture. Si le bandeau d'erreur d'enregistrement ou la confirmation le masque puis qu'il revient, aucune nouvelle annonce. **[non vérifié sur VoiceOver]** Une alerte déjà présente au premier rendu est parfois ignorée : insérer le bandeau dans le DOM après le chargement initial, et Julie vérifie l'annonce avec VoiceOver.
- Aucune fermeture automatique : l'avis reste jusqu'à l'activation du bouton « Fermer » (WCAG 2.2.1). Le bouton est un vrai `<button>`, 48 px, atteignable au clavier, **juste après le titre** dans l'ordre de tabulation ; nom accessible « Fermer l'avis sur la liste illisible » (contient « Fermer », 2.5.3).
- Le focus **ne bouge pas** à l'apparition (il reste dans le champ d'ajout). Après « Fermer », le focus passe au **champ d'ajout** (jamais sur `body`).
- Ajouter un article ne ferme pas l'avis ; un enregistrement réussi ne le ferme pas non plus, mais il ne revient plus aux ouvertures suivantes.
- Priorité des bandeaux : erreur d'enregistrement > confirmation > liste illisible > hors ligne ; un seul à la fois ; le bandeau « Hors ligne » ne s'affiche pas pendant que l'avis est visible.
- La liste vide qui suit n'est jamais présentée comme une première ouverture : « Ta nouvelle liste est vide. / Tu peux y ajouter des articles ci-dessous. », sans « premier » ; même après « Fermer », tant qu'aucun enregistrement n'a réussi.
- Mise en page intacte à 320 px, zoom 200 % et texte système agrandi : le texte passe à la ligne, le bouton « Fermer » passe sous le texte.
- Aucune fausse alerte : liste valide (même sans article) ou aucune donnée → pas de bandeau et l'écran « liste vide » classique.

**EPI-015 Thème sombre (plateforme)**
- `theme-color` : `#FFFFFF` (clair) et `#121212` (sombre) ; manifeste `background_color` : `#121212`. Valeurs et raisons : design-system.md, « Couleurs de la plateforme ».
- Les nouveaux écrans (avis « liste illisible », variante de liste vide) sont vérifiés dans les deux thèmes.

## C. Points à surveiller (WCAG 2.2.1 « délai ajustable »)
Les 5 s de l'annulation (EPI-005 et EPI-006) sont un délai imposé. Atténuations en place : pause au survol et au focus, annonce par lecteur d'écran, et l'annulation n'est qu'un filet de sécurité (elle n'est pas nécessaire pour accomplir la tâche). Risque restant : une personne qui navigue au clavier ou au lecteur d'écran peut mettre plus de 5 s à atteindre « Annuler » depuis un long parcours de liste. Math est l'unique utilisateur et aucune contrainte n'est connue ; à revoir si ce changeait (ex. délai plus long ou raccourci pour aller au message).

## D. Références
WCAG 2.2 : 1.4.1 (couleur seule), 1.4.3 (contraste), 1.4.10 (reflow), 1.4.11 (contraste non textuel), 2.1.1 (clavier), 2.2.1 (délai ajustable), 2.4.7 (focus visible), 2.5.7 (alternative au glissement), 2.5.8 (taille de cible), 3.3.1 / 3.3.3 (erreurs), 4.1.3 (messages d'état).
