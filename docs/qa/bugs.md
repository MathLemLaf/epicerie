# Bugs ouverts (en attendant Jira)

## BUG-001 — Un nom fait uniquement de caractères invisibles (ex. U+200B) est accepté
- Gravité : Mineure
- Story : EPI-001 (règle « 1 à 100 caractères visibles après retrait des espaces » ; scénario « nom vide refusé »)
- Environnement : working tree non commité du 2026-10-19 ; Chromium (Pixel 7) et WebKit (iPhone 15) simulés
- Étapes : 1. Ouvrir l'app. 2. Saisir (ou coller) uniquement une espace de largeur nulle U+200B (peut venir d'un copier-coller depuis une page web ou une app de notes). 3. Valider.
- Obtenu : un article est ajouté, avec une ligne qui paraît vide (« À prendre (1) »), et le message « ajouté » est annoncé avec un nom vide. `String.trim()` ne retire pas U+200B, et un graphème invisible compte pour 1.
- Attendu : refus comme un nom vide (« Écris le nom d'un article pour l'ajouter. »).
- Preuve : `e2e/epi-001-qa-exploratoire.spec.ts` › « QA-06 … » (était marqué `test.fail`).
- Piste : dans `normalizeItemName`, refuser un nom sans aucun caractère visible (ex. retirer aussi `\p{Cf}` / `\p{Z}` avant de tester le vide) + test unitaire dans `item-name.test.ts`.
- Statut : **Corrigé, vérifié** (2026-10-19, Julie). Correction : `trimInvisibles` dans `item-name.ts` (11 tests unitaires de non-régression + QA-06 sans `test.fail`, vert sur les 2 projets). Revérifié : U+200B, U+FEFF, U+2060, U+200D, U+00AD seuls ou mélangés à des espaces/NBSP/tabulation → refusés ; invisibles aux bords de « lait » retirés ; invisible au milieu conservé (voulu, protège les emojis composés) ; famille ZWJ, drapeau 🇫🇷, drapeau d'Écosse (caractères de tag) et « e + accent combinant » intacts, avec invisibles en bord ; 100 caractères + invisibles en bord → acceptés, 101 → refusés (« tu en as 101 »), 100 emojis famille acceptés, 101 drapeaux refusés.

## BUG-002 — D'autres caractères invisibles (Hangul filler, braille blanc…) passent encore comme nom
- Gravité : Cosmétique
- Story : EPI-001 (suite de BUG-001)
- Environnement : working tree non commité du 2026-10-19 ; test direct de `normalizeItemName`
- Étapes : 1. Saisir ou coller uniquement U+3164 (Hangul filler), U+2800 (braille blanc), U+115F, U+034F (CGJ), U+FE0F ou U+FFF9. 2. Valider.
- Obtenu : un article au nom d'apparence vide est ajouté (aucun refus).
- Attendu : refus « nom vide » comme pour U+200B (règle « 1 à 100 caractères visibles »).
- Preuve : sortie de `normalizeItemName` pour chacun : ACCEPTÉ (les 6). Non vérifié à l'écran d'un iPhone.
- Piste : liste de caractères de plus en plus longue = impasse ; refuser un nom où chaque graphème est « sans glyphe » (ex. `\p{Default_Ignorable_Code_Point}` + U+3164/U+2800) si Jean-Marc juge que ça vaut l'effort. Cas très rare (copier-coller de texte « fantôme »).
- Statut : Ouvert (Jean-Marc décide : au backlog, sans bloquer EPI-001)

## BUG-003 — Après chaque cochage, la liste défile vers le bas (jusqu'à l'article déplacé) et le prochain article à prendre sort de l'écran
- Gravité : Majeure (provisoire : mesurée sur WebKit et Chromium simulés ; à confirmer sur l'iPhone, fiche `epi-002-fiche-iphone.md` §3). Requalifiée en Mineure si Jean-François et Jean-Marc jugent ce défilement acceptable.
- Story : EPI-002 (but de la story : « voir d'un coup d'œil ce qu'il me reste à prendre » ; règle « cocher plusieurs articles de suite est le geste courant »)
- Environnement : commit fc80892 (code d'EPI-002 : ec9aeb9) ; WebKit iPhone 15 simulé (zone de liste 515 px) et Chromium Pixel 7 simulé (695 px) ; dépôt en mémoire
- Étapes : 1. Ajouter 25 articles (« article 1 » … « article 25 »). 2. Remonter tout en haut de la liste. 3. Toucher la ligne « article 1 ».
- Obtenu : la zone de liste défile jusqu'en bas : `scrollTop` 0 → 1021 px (WebKit) / 0 → 841 px (Chromium), soit le maximum. « article 1 » est visible en bas de l'écran, dans « Dans le panier », mais « article 2 » (le prochain à prendre) est 974 px (WebKit) / 794 px (Chromium) au-dessus de l'écran : il faut remonter avant chaque cochage. Cochage d'un article du milieu (« article 12 ») : même saut (scrollTop → 1021). Mesures selon la taille de la liste (WebKit, cochage de la 1re ligne) : 8 articles → 27 px ; 12 → 280 px ; 15 → 451 px ; 25 → 1021 px.
- Attendu : on ne perd pas sa place dans la liste en cochant plusieurs articles de suite. Les critères ne demandent que « le focus suit l'article déplacé » (accessibilite.md A8) ; le défilement est un effet de bord non voulu par les critères (non vérifié : à arbitrer par Jean-François / Jean-Marc s'il est voulu).
- Cause (vérifiée) : l'appel `focus()` sur la case de l'article déplacé (`followMovedItem`, `src/shopping-list/ui/item-list-view.ts`). Sans cet appel (focus neutralisé dans la page), `scrollTop` reste à 0 dans les deux moteurs. Piste : `focus({ preventScroll: true })` supprime le saut sous Chromium (vérifié) mais **pas** sous WebKit simulé (vérifié : toujours 1021 px) ; une autre approche est à essayer, par exemple mémoriser `scrollTop` avant `render()` et le rétablir après `focus()` pour les gestes tactiles, en gardant le défilement vers le focus au clavier (A3/A8 : le focus doit rester visible). Un test de non-régression est requis (position de défilement conservée après un cochage au toucher, 25 articles).
- Preuve : `e2e/epi-002-qa-exploratoire.spec.ts` › « QA2-05 25 articles : défilement après cochage » (journal des mesures ; ce test ne fait pas échouer la suite, il documente — à transformer en assertion à la correction : `scrollTop` inchangé, « article 2 » visible).
- Statut : Ouvert

## BUG-004 — Aucun séparateur visible entre deux lignes cochées : elles forment un seul bloc gris
- Gravité : Cosmétique
- Story : EPI-002 (design-system.md « Séparateur 1 px `couleur-surface` entre lignes »)
- Environnement : commit fc80892 ; WebKit iPhone 15 simulé, capture à 2×
- Étapes : 1. Ajouter 3 articles. 2. Les cocher tous. 3. Regarder « Dans le panier (3) ».
- Obtenu : le séparateur de 1 px est de la même couleur que le fond d'une ligne cochée (`#F2F2F2`) : il est invisible, les lignes cochées ressemblent à un seul bloc. Les lignes non cochées gardent un filet visible (sur fond blanc).
- Attendu : on distingue chaque ligne cochée de sa voisine (cible de toucher, comptage d'un coup d'œil). Le design-system prescrit exactement ce séparateur : écart de conception, pas de code.
- Preuve : capture `s1-normale.png` (scratchpad de la session) ; styles : `.item-list li { border-bottom: 1px solid var(--couleur-surface) }` et `.item-row--checked { background-color: var(--couleur-surface) }`.
- Piste : question pour Jean-François (séparateur plus foncé sur fond coché, ou petit écart blanc entre lignes cochées). Ne bloque pas EPI-002 ; Jean-Marc décide.
- Statut : Ouvert (décision Jean-François / Jean-Marc)
