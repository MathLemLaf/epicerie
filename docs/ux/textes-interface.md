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
| Erreur d'enregistrement (EPI-016), **variante 1 : stockage plein** (`QuotaExceededError`) | Impossible d'enregistrer ta liste sur ce téléphone : il n'y a plus assez d'espace. Libère de l'espace, puis réessaie. | Bandeau sous le titre, persistant, `role="alert"`, icône « ! » ; remplace « Hors ligne ». Math peut agir tout de suite (photos, apps) |
| Erreur d'enregistrement (EPI-016), **variante 2 : accès refusé** (écriture-lecture de contrôle échouée au démarrage) | Impossible d'enregistrer ta liste sur ce téléphone : le navigateur refuse de garder des données. Vérifie les réglages de confidentialité du navigateur (et la navigation privée), puis réessaie. | Même bandeau. Ne parle jamais d'espace : libérer de l'espace n'y changerait rien. Aucun nom de réglage précis (non vérifié et variable selon la version d'iOS) |
| Erreur d'enregistrement (EPI-016), **variante de repli : cause inconnue** | Impossible d'enregistrer ta liste sur ce téléphone. Vérifie l'espace libre et les réglages de confidentialité du navigateur, puis réessaie. | Pour toute autre erreur d'écriture que les deux ci-dessus. Neutre : convient aux deux pannes, moins précis |
| Bouton de nouvel essai | Réessayer | Nom accessible : « Réessayer d'enregistrer ma liste » |
| Nouvel essai raté (visible et annoncé) | Nouvel essai sans succès. | Ligne ajoutée dans le bandeau ; `role="status"` |
| Enregistrement rétabli (visible 5 s et annoncé) | Ta liste est de nouveau enregistrée. | Validé par Jean-François : « de nouveau » rappelle qu'il y a eu un problème, sans dramatiser ; même verbe « enregistrer » que l'erreur ; `role="status"`, icône coche |
| Bouton de retrait des cochés (EPI-006) | Retirer les 4 articles cochés | Singulier : « Retirer l'article coché ». Le nombre est le même que dans le titre de section |
| Message de retrait | 4 articles retirés | Singulier : « 1 article retiré ». Pas de noms d'articles. Bouton : Annuler |
| Nom accessible de l'annulation du retrait | Annuler le retrait de 4 articles | Singulier : « Annuler le retrait de 1 article » |
| Retrait annulé (annoncé) | 4 articles remis dans la liste. | Singulier : « 1 article remis dans la liste. » |
| Retrait qui vide la liste (annoncé en plus) | Ta liste est vide. | Après « 4 articles retirés » |
| Liste illisible (EPI-017), première ligne (gras) | Ta liste n'a pas pu être relue. | Bandeau sous le titre, `role="alert"`, icône « ! » |
| Liste illisible, suite | L'app repart d'une liste vide. Rien n'est effacé : une copie de ta liste est gardée sur ce téléphone. | Même bandeau. Dit ce qui s'est passé, rassure, sans jargon ni promesse de récupération dans l'app |
| Bouton de fermeture de l'avis | Fermer | Nom accessible : « Fermer l'avis sur la liste illisible » (contient le libellé visible, WCAG 2.5.3) |
| Liste vide après liste illisible, titre | Ta nouvelle liste est vide. | Remplace « Ta liste est vide. » dans ce seul cas |
| Liste vide après liste illisible, aide | Tu peux y ajouter des articles ci-dessous. | Jamais « premier article » ici |
| Langue du document | `lang="fr-CA"` | |

## Règles de rédaction
- Pas de « Oops », pas de « Désolé » inutile, pas de point d'exclamation sauf pour la réussite finale (« Tout est dans ton panier ! »).
- Vocabulaire : « supprimer » pour un article qu'on enlève un par un (EPI-005), « retirer » pour le grand ménage des articles cochés (EPI-006) ; « retirer » dit « c'est fini, on repart à zéro », pas « c'était une erreur ».
- Pas de jargon : pas « erreur de validation », pas « stockage local ».
- Les noms d'articles saisis par Math sont affichés tels quels (accents, majuscules, œ conservés), jamais corrigés ni mis en majuscule.
