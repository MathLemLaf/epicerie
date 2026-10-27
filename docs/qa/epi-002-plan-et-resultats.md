# EPI-002 — Plan de test et résultats (Julie, 2026-10-19)

Version testée : commit `fc80892` (code d'EPI-002 : `ec9aeb9`, tests e2e : `eb1b6e6`), branche main, dossier de travail propre côté `src/` pendant les tests.
Outils : Vitest (unitaires, Pierrick), Playwright (acceptation : projets `android-chrome` = Chromium Pixel 7, `iphone-safari` = WebKit iPhone 15 sur ordinateur). ADR 0006. Mes tests : `e2e/epi-002-qa-exploratoire.spec.ts` (23 cas × 2 projets).
Limite : WebKit sur ordinateur n'est pas Safari sur iPhone. Le toucher réel, le clavier iOS, VoiceOver, les niveaux de gris du système et le survol collant ne sont pas vérifiables ici : voir `epi-002-fiche-iphone.md`.

## Commandes et résultats réels
- `npm run check` : typecheck OK, Biome OK, Vitest 4 fichiers / **83 tests verts** (confirme le rapport de Pierrick).
- `npm run test:e2e` (suite de Pierrick, avant mes ajouts) : **103 passés, 2 ignorés** (confirme Pierrick ; les 2 ignorés sont QA-13 et QA-14 d'EPI-001, Tab sous WebKit ordinateur).
- `npm run test:e2e` (après mes ajouts) : **148 passés, 3 ignorés, 0 échec** (3e ignoré : QA2-09, partie Tab, WebKit ordinateur, même cause).
- Mutations légères et mesures : code de production restauré après chaque essai ; `git diff -- src` vide (vérifié).
- Application publiée (`https://mathlemlaf.github.io/epicerie/`) : voir plus bas.

## Fidélité des tests de Pierrick aux scénarios Gherkin
| Scénario d'EPI-002 | Test de Pierrick (e2e, et unitaire) | Verdict | Remarque |
|---|---|---|---|
| Cocher un article | « cocher un article » | ✅ | Vérifie les deux sections, l'ordre, le barré, la case cochée et le texte exact de l'annonce. |
| Emplacement d'un article coché | « emplacement d'un article coché » | ✅ | « pain » puis « beurre ». Étendu par mon QA2-02 (ordre sur 5 articles). |
| Décocher un article | « décocher un article » | ✅ | Fin de « À prendre », texte exact de l'annonce. |
| Cochage par erreur corrigé | « cochage par erreur corrigé » | ✅ | Retour en fin de « À prendre », section « Dans le panier » disparue. |
| Tout est pris | « tout est pris » | ✅ | Section masquée, message visible, annonce (zone commune, texte combiné), « Dans le panier (2) » dans l'ordre (lait, pain). |
| Tout est pris n'est pas la liste vide | « tout est pris n'est pas la liste vide » | ⚠️ | Le test est **vide de pouvoir** : le texte « Ta liste est vide. » n'existe pas encore (EPI-003), il ne peut pas échouer aujourd'hui. Ce qui protège vraiment le critère : les tests unitaires « liste sans aucun article n'affiche pas tout est pris » et la mutation M3 (détectée). À réexaminer à la livraison d'EPI-003. |
| Sortie de « tout est pris » | 2 tests (ajout, décochage) | ✅ | Les deux sorties du scénario sont couvertes. |
| Distinction sans la couleur | « distinction sans la couleur… » | ⚠️ | Le scénario dit « niveaux de gris ». Le test vérifie les trois signes (case cochée, barré, section) dans le DOM et les styles, pas un rendu gris. Proxy acceptable ; mon QA2-13 applique un filtre gris et relit les signes ; le vrai réglage iPhone est dans la fiche (§5). |
| Cible de cochage | « cible de cochage… » | ✅ | Ligne ≥ 56 px, zone ≥ 48 × 48. Tolérance de 0,1 px : justifiée (WebKit mesure 55,99998 px pour `min-height: 56px`, reproduit) et sans conséquence réelle (un mutant à 55,9 px passerait, sans intérêt). Mutations C1 et C7 détectées. |
| Exigences d'accessibilité | 4 tests (Espace + focus suit ; anneau ; animation ≤ 200 ms ; réduire les animations) | ✅ | A8, A3 (partiel), A11. Trous comblés par moi : contrastes (QA2-12), ordre de Tab (QA2-09), noms accessibles (QA2-11). |
| Autre : toucher le nom coche aussi | « toucher le nom, loin de la case… » | ✅ | « Toute la ligne est la cible » (règle). |

## Mutations légères (le code de production est toujours restauré)
Unitaires (Vitest, 83 tests) :
| Mutation | Résultat |
|---|---|
| M1 coché placé en fin de « Dans le panier » | détectée (4 rouges) |
| M2 décoché placé en tête de « À prendre » | détectée (5) |
| M3 « tout est pris » aussi pour une liste vide | détectée (2) |
| M4 pas de focus après déplacement | détectée (2) |
| M5 annonce « tout est pris » retirée | détectée (1) |
| M6 textes de cochage et décochage inversés | détectée (3) |
| M7 section « Dans le panier » jamais masquée | détectée (2) |
| M8 message « tout est pris » dès qu'il y a un coché | détectée (1) |
| M9 la case ne reflète pas l'état | détectée (5) |
| M10 `check` et `uncheck` échangés | détectée (6) |
| M11 nouvel article ajouté après le panier | détectée (1) |
| M12 compteur de section décalé | détectée (2) |
| M13 classe « ligne cochée » retirée | détectée (1) |
| M14 zone d'annonce sans `role="status"` | détectée (4) |
| M15 case non native (`type="text"`) | détectée (12) |
| M16 sauvegarde non appelée au cochage | détectée (2) |

CSS (e2e iPhone, suites de Pierrick + la mienne) :
| Mutation | Résultat |
|---|---|
| C1 hauteur de ligne 56 → 40 px | détectée (cible de cochage ; QA2-07) |
| C2 texte barré retiré | détectée (3 tests) |
| C3 « réduire les animations » ignoré | détectée (2) |
| C4 animation 150 → 400 ms | détectée (1) |
| C5 anneau de focus de la ligne retiré | détectée (1) |
| C6 coche blanche retirée | détectée (1) |
| C7 zone de cochage 48 → 30 px | détectée (1) |

Aucune mutation ne survit. Une expérience de diagnostic (pas une mutation à détecter) a servi à BUG-003 : `focus()` neutralisé → plus de défilement ; `preventScroll` → plus de saut sous Chromium, saut maintenu sous WebKit simulé.

## Exploratoire (ce qui a été exploré, même sans bug)
| Mission / cas | Résultat | Preuve |
|---|---|---|
| Rafale : 8 articles cochés puis décochés en série (QA2-01) | ✅ | État cohérent ; « tout est pris » apparaît et disparaît ; l'ordre après décochage en série = ordre de décochage. |
| Ordre exact après plusieurs cochages (QA2-02) | ✅ | a b c d e ; cocher c, a, e → panier [e, a, c], à prendre [b, d] ; décocher a → [b, d, a] ; cocher b → panier [b, e, c] ; décocher c → [d, a, c] ; compteurs justes. |
| Tout cocher puis ajouter (QA2-03) | ✅ | « sel » va dans « À prendre » ; panier intact ; focus au champ ; « sel » coché passe en tête du panier. |
| Décocher le seul article (QA2-04) | ✅ | « À prendre (1) », pas de « Dans le panier », ni « Ta liste est vide. », ni « tout est pris ». |
| 25 articles : défilement (QA2-05) | ❌ BUG-003 | scrollTop 0 → 1021 (WebKit) / 841 (Chromium) ; prochain article hors écran. |
| Double toucher au même endroit (QA2-06) | ⚠️ comportement accepté | Les deux touchers tombent sur deux lignes (pain, puis « lait » qui a remonté sous le doigt) : résultat panier [lait, pain]. Prévu par la règle « les lignes qui suivent remontent d'un cran ». À vivre sur l'iPhone (fiche §2). |
| 320 px et 195 px avec un nom de 100 caractères sans espace, coché (QA2-07) | ✅ | Aucun défilement horizontal ; lignes ≥ 57 px (143 px pour le long nom, passage à la ligne). |
| Texte agrandi 200 % (QA2-08) | ✅ | Pas de débordement ; lignes 118 px (nom sur 2 lignes) et 67 px ; zone de liste 400 px (WebKit) / 580 px (Chromium). |
| Clavier : Espace coche, Entrée ne coche pas (comportement natif), Tab et Maj+Tab dans l'ordre visuel, anneau visible sur la ligne déplacée (QA2-09, Chromium ; anneau aussi WebKit) | ✅ | Contour `solid` après Espace ; après un clic de souris : aucun anneau (voulu). Tab non vérifiable sous WebKit ordinateur. |
| Tout cocher et décocher au clavier, focus jamais sur `body` (QA2-10) | ✅ | `activeElement` = la case. |
| Noms accessibles, structure (QA2-11) | ✅ | Arbre : `checkbox "pain" [checked]` / `checkbox "lait"` ; 1 h1, 2 h2, listes nommées « À prendre (N) » / « Dans le panier (N) » ; `lang="fr-CA"` ; titre « Ma liste d'épicerie ». Lu par VoiceOver : à vérifier sur iPhone. |
| Contrastes calculés (QA2-12), thème clair | ✅ | texte coché `#595959` sur `#F2F2F2` **6,26** ; texte non coché 17,4 ; case cochée sur fond coché **5,61** (≥ 3) ; coche blanche sur case pleine **6,28** ; bordure de case vide sur blanc **4,54** ; anneau de focus sur fond coché **5,70**, sur blanc 6,39. Valeurs du design-system confirmées. Thème sombre : pas encore livré (EPI-015). |
| Niveaux de gris simulés (QA2-13) | ✅ (simulé) | « pain » : barré ; « lait » : non barré ; coche présente. Capture grise relue : case cochée, barré et section se distinguent. |
| Animation (QA2-14) | ✅ | 0,15 s, 1 itération, pas de boucle. |
| « Réduire les animations » (QA2-15) | ✅ | `animation-name: none` au cochage et au décochage ; `document.getAnimations()` vide. |
| Deux articles de même nom cochés de suite (QA2-16) | ⚠️ à vérifier sur iPhone | Le texte de l'annonce est identique, le texte est réassigné (2 mutations DOM) : peut ne pas être relu par VoiceOver (même point qu'EPI-001, fiche §3). |
| Régression EPI-001 (QA2-17) | ✅ | Ajout après cochage : « sel » en fin de « À prendre », focus au champ, annonce « « sel » ajouté à la liste. », refus d'un nom vide intact. |
| Noms avec HTML et apostrophes (QA2-18) | ✅ | `<b>gras</b>` affiché comme texte, annonce correcte, aucun élément injecté. |
| Paysage 667 × 375, « tout est pris » (QA2-19) | ✅ | Message, section et barre d'ajout visibles ; zone de liste 231 px. |
| Clic souris : aucun anneau de focus parasite (QA2-20) | ✅ | contour `none` après clic, `solid` après Espace. |
| Démarrage : aucune section ni message (QA2-21) | ✅ | |
| Performance : 100 cochages sur 100 articles (QA2-22) | ✅ | 57 ms (WebKit) / 595 ms (Chromium, en une seule rafale synchrone) ; la liste est redessinée entièrement à chaque cochage : aucun souci à cette échelle. |
| Texte en cours de saisie et erreur affichée, puis cochage (QA2-23) | ✅ avec réserve | Le texte du champ est conservé ; le focus passe à la case (le clavier se fermera sur iPhone : à confirmer, fiche §4). |

## Application publiée
- `curl -sI https://mathlemlaf.github.io/epicerie/` → 200 ; `manifest.webmanifest` 200 ; `sw.js` 200.
- Les fichiers publiés (`assets/index-C2Gm0wa7.js` et `assets/index-D2OeTX36.css`) sont **identiques octet pour octet** (SHA-1 égaux) à ceux d'une construction locale du commit `fc80892` avec `--base=/epicerie/`. La page publiée contient bien le CSS d'EPI-002 (`item-row--checked`).
- Chargement et parcours (ajouter 3 articles, cocher « pain ») sous WebKit (iPhone 15) et Chromium (Pixel 7) simulés sur l'URL publiée : titre et `lang` justes, annonce « « pain » mis dans le panier. », « À prendre » = [lait, œufs], « Dans le panier » = [pain], service worker enregistré (scope `/epicerie/`), **aucune erreur ni avertissement en console, aucune requête en échec ni HTTP ≥ 400**.

## Points signalés par Pierrick
| Point | Mon constat |
|---|---|
| « tout est pris » sans `role="status"` propre | Conforme à la décision de Math : le texte est annoncé par la zone commune (« « pain » mis dans le panier. Tout est dans ton panier ! Il ne reste rien à prendre. »). Vérifié (test e2e, M5). VoiceOver à vérifier (fiche §3). |
| Séparateur invisible entre lignes cochées | Confirmé : **BUG-004** (cosmétique, question pour Jean-François). |
| Cocher ferme le clavier (le focus suit l'article) | Confirmé côté code (QA2-23 : focus sur la case). Effet réel sur iPhone à vérifier (fiche §4). Conséquence : pour ajouter l'article suivant, un toucher dans la barre rouvre le clavier. À décider par Jean-François / Jean-Marc si c'est acceptable. |
| Tolérance 0,1 px | Reproduite (WebKit 55,99998 px), justifiée, sans risque. |

## Accessibilité (checklist A et B « EPI-002 »)
A1 contrastes ✅ (thème clair) ; A2 clavier ✅ (Espace ; Entrée ne coche pas) ; A3 focus visible ✅ au clavier (anneau 2 px, 5,7:1) ; A4 cibles ✅ (ligne 57 px, zone 48 × 48 ; la ligne entière est cible) ; A6 structure ✅ ; A7 annonces ✅ côté DOM, VoiceOver à tester ; A8 focus qui suit l'article ✅ (mais voir BUG-003 pour le défilement) ; A9 320 px et zoom simulé 195 px ✅ ; A10 paysage ✅ (simulé) ; A11 animation ≤ 200 ms, sans boucle, supprimée avec « réduire les animations » ✅ ; A12 ✅ ; A13 texte 200 % ✅ (simulé par la taille de police racine, pas le réglage iOS). B EPI-002 : toute la ligne cible ✅, coché = case pleine + coche + barré + section ✅, annonces ✅, « tout est pris » affiché et annoncé ✅.

## Bugs
- **BUG-003 — Majeure (provisoire)** : après chaque cochage, la liste défile en bas et le prochain article sort de l'écran (listes d'au moins une dizaine d'articles). À corriger par Pierrick avec test de non-régression, ou à requalifier si Jean-François / Jean-Marc jugent ce défilement acceptable.
- **BUG-004 — Cosmétique** : pas de séparateur visible entre lignes cochées (écart de design-system).
Détails dans `docs/qa/bugs.md`.

## Tests manuels restants (iPhone de Math)
`docs/qa/epi-002-fiche-iphone.md` : cochage au pouce en série (5 fois), défilement avec une longue liste (confirme ou infirme BUG-003), clavier ouvert puis fermé par un cochage, VoiceOver (annonces, deux cochages de suite, « tout est pris »), niveaux de gris, texte agrandi et zoom, rotation, survol collant des lignes.
Non vérifiable ici : thème sombre (EPI-015), reprise de la liste à la réouverture (EPI-003), suppression (EPI-005).

## Verdict
**Refusée QA pour l'instant** : tous les scénarios d'acceptation et les exigences mesurables passent (aucune mutation ne survit, l'application publiée correspond au commit), mais BUG-003 (majeur) rend la série de cochages pénible dès une longue liste. Si le défilement est jugé acceptable (BUG-003 requalifié en mineur), le verdict devient « en attente des tests iPhone ».
