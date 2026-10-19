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
