# Textes d'interface — Ma liste d'épicerie (MVP)

Statut : **Proposé**. Français québécois, **tutoiement** partout (décidé une fois pour tout le produit ; Math est l'unique utilisateur). Vocabulaire : « épicerie », « article », « panier », « liste ». Boutons = verbes d'action. Erreurs = ce qui s'est passé + comment corriger, sans culpabiliser. Les guillemets sont des guillemets français « … » avec espaces insécables.

| Où | Texte | Remarque |
|---|---|---|
| Titre de l'app / h1 / titre de page | Ma liste d'épicerie | |
| Section non cochés (h2) | À prendre (3) | Le nombre est entre parenthèses |
| Section cochés (h2) | Dans le panier (2) | |
| Étiquette du champ | Nouvel article | Visible en permanence (pas seulement un placeholder) |
| Placeholder du champ | Ex. : lait 2 L | Exemple seulement ; ne remplace pas l'étiquette |
| Bouton d'ajout | Ajouter | Nom accessible : « Ajouter à la liste » |
| Nom accessible de la case | « pain », état coché / non coché | La case est étiquetée par le nom de l'article |
| Bouton de suppression (icône) | nom accessible : Supprimer « pain » | Icône poubelle ; infobulle identique |
| État vide, titre | Ta liste est vide. | |
| État vide, aide | Écris ton premier article ci-dessous, par exemple « lait » ou « pain ». | |
| Tout est pris | Tout est dans ton panier ! Il ne reste rien à prendre. | |
| Confirmation d'ajout (annoncée) | « lait » ajouté à la liste. | Zone `role="status"` |
| Confirmation de cochage (annoncée) | « pain » mis dans le panier. | |
| Confirmation de décochage (annoncée) | « pain » remis dans les articles à prendre. | |
| Message de suppression | « lait 2 L » supprimé | Si le nom est long : tronqué à 30 caractères + « … » dans le message seulement |
| Bouton d'annulation | Annuler | Nom accessible : Annuler la suppression de « lait 2 L » |
| Suppression annulée (annoncée) | « lait 2 L » remis dans la liste. | |
| Erreur : nom vide | Écris le nom d'un article pour l'ajouter. | |
| Erreur : trop long | Le nom est trop long : 100 caractères au maximum (tu en as 112). Raccourcis-le. | Le nombre réel est inséré |
| Compteur de caractères | 85 / 100 | Affiché dès 80 caractères |
| Bandeau hors ligne | Hors ligne. Ta liste fonctionne normalement. | Voir réserve sur l'énoncé dans wireframes.md, écran 8 |
| Retour en ligne (annoncé) | De retour en ligne. | Annonce seulement, bandeau retiré |
| Erreur d'enregistrement *(proposé)* | Impossible d'enregistrer ta liste sur ce téléphone. Libère de l'espace puis réessaie. | Bouton : Réessayer |
| Langue du document | `lang="fr-CA"` | |

## Règles de rédaction
- Pas de « Oops », pas de « Désolé » inutile, pas de point d'exclamation sauf pour la réussite finale (« Tout est dans ton panier ! »).
- Pas de jargon : pas « erreur de validation », pas « stockage local ».
- Les noms d'articles saisis par Math sont affichés tels quels (accents, majuscules, œ conservés), jamais corrigés ni mis en majuscule.
