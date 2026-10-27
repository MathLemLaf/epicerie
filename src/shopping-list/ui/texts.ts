import { ITEM_NAME_MAX_LENGTH } from "../domain/item-name";

// Textes exacts : docs/ux/textes-interface.md (guillemets français avec espaces insécables).
const NO_BREAK_SPACE = " ";

function quoted(text: string): string {
  return `«${NO_BREAK_SPACE}${text}${NO_BREAK_SPACE}»`;
}

const ALL_TAKEN_HEADLINE = "Tout est dans ton panier !";
const ALL_TAKEN_DETAIL = "Il ne reste rien à prendre.";

export const texts = {
  appTitle: "Ma liste d'épicerie",
  itemsToBuyHeading: (count: number) => `À prendre (${count})`,
  itemsInBasketHeading: (count: number) => `Dans le panier (${count})`,
  allTakenHeadline: ALL_TAKEN_HEADLINE,
  allTakenDetail: ALL_TAKEN_DETAIL,
  allTaken: `${ALL_TAKEN_HEADLINE} ${ALL_TAKEN_DETAIL}`,
  itemMovedToBasket: (name: string) => `${quoted(name)} mis dans le panier.`,
  itemPutBack: (name: string) => `${quoted(name)} remis dans les articles à prendre.`,
  newItemLabel: "Nouvel article",
  newItemPlaceholder: "Ex. : lait 2 L",
  addButton: "Ajouter",
  addButtonAccessibleName: "Ajouter à la liste",
  itemAdded: (name: string) => `${quoted(name)} ajouté à la liste.`,
  emptyNameError: "Écris le nom d'un article pour l'ajouter.",
  tooLongNameError: (visibleLength: number) =>
    `Le nom est trop long : ${ITEM_NAME_MAX_LENGTH} caractères au maximum (tu en as ${visibleLength}). Raccourcis-le.`,
  lengthCounter: (visibleLength: number) => `${visibleLength} / ${ITEM_NAME_MAX_LENGTH}`,
};
