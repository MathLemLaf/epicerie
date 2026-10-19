# EPI-001 — Plan de test et résultats (Julie, 2026-10-19)

Version testée : working tree non commité de `apps/epicerie` (branche main, après le commit 71aa6d5 de l'équipe).
Outils : Vitest (unitaires, Pierrick), Playwright (acceptation : projets android-chrome = Chromium Pixel 7, iphone-safari = WebKit iPhone 15 sur ordinateur). Voir ADR 0006.

## Commandes et résultats réels
- `npm run check` : typecheck OK, Biome OK (26 fichiers), Vitest 4 fichiers / 43 tests verts.
- `npm run test:e2e` (avant mes ajouts) : 33 verts (17 + 16).
- `npm run test:e2e` (après mes ajouts) : 73 passés, 2 ignorés (QA-13 et QA-14 sous WebKit : Tab ne cible pas les boutons), 0 échec ; QA-06 est marqué « échec attendu » (BUG-001).

## Mutations légères (code de production restauré, vérifié par diff)
| Mutation | Tests unitaires |
|---|---|
| max 100 → 101 | détectée (4 rouges) |
| seuil du compteur 80 → 81 | détectée (1) |
| retrait du `trim` | détectée (7) |
| nouvel article ajouté au début | détectée (4) |
| retrait du défilement vers le nouvel article | détectée (1) |
| mousedown non bloqué (le clavier se fermerait) | détectée (2) |
| retrait de l'annonce | détectée (1) |
| comptage en unités UTF-16 au lieu de graphèmes | détectée (2) |
| retrait du `focusField()` final de `addItem` | **survit** : mutant équivalent, le gestionnaire `click` de la barre refocalise déjà le champ. Redondance sans effet visible ; ne couvre pas un submit sans clic (Entrée dans le champ, où le focus ne bouge de toute façon). |

## Exploratoire (extraits mesurés)
- Contrastes calculés (WCAG) : texte/fond 17,4 ; texte/surface 15,6 ; secondaire/fond 7,0 ; secondaire/surface 6,3 ; blanc/primaire 6,3 ; erreur/surface 5,8 ; bordure champ/fond 4,5 ; bordure champ/surface 4,1 (≥ 3 requis) ; focus/surface 5,7. Tous conformes.
- 320 px : barre 188 px de haut avec l'erreur « trop long » (3 lignes), champ 184 px, bouton 96 px dans l'écran, aucun débordement horizontal ; zone de liste restante 325 px sur 568.
- 195 px (équivalent zoom 200 % de 390 px) : aucun débordement, bouton dans l'écran.
- Texte agrandi à 200 % + erreur (iPhone 15) : barre 351 px sur 659, zone de liste 159 px : utilisable mais serrée.
- Paysage 667 × 375 : barre visible, liste 231 px.
- 40 articles : ordre conservé, dernier article visible au-dessus de la barre, barre collée en bas.
- Injection (`<script>`, `<img onerror>`, `<b>`, `' OR 1=1 --`) : affichés comme texte, aucun dialogue, aucun élément injecté.
- Emoji famille (ZWJ) ×100 acceptés, ×101 refusés avec « tu en as 101 » ; e + accent combinant ×100 acceptés.
- Collage multiligne : le navigateur remplace les retours à la ligne par des espaces (« lait œufs pain » = un seul article). Pas de perte, mais pas non plus de « un article par ligne ».
- Doublons permis (« lait » ×2), conforme à EPI-009 « Could ».
- Double Entrée : un article puis le message de nom vide.
- Police du champ 16 px (pas de zoom automatique d'iOS au focus).
- Ordre de Tab (Chromium) : champ → Ajouter → sortie de page ; focus visible sur le bouton ; Entrée sur « Ajouter » ajoute et le focus revient au champ.
