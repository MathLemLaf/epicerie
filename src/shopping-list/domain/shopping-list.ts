import type { Item, ItemId } from "./item";
import { normalizeItemName } from "./item-name";

export class ItemNotFoundError extends Error {
  constructor(readonly id: ItemId) {
    super(`Aucun article avec l'identifiant « ${id} » dans la liste.`);
  }
}

/**
 * La liste d'épicerie, immuable : chaque action renvoie une nouvelle liste.
 * Les articles sont rangés dans l'ordre d'affichage : « À prendre » puis « Dans le panier ».
 */
export class ShoppingList {
  private constructor(readonly items: readonly Item[]) {}

  static empty(): ShoppingList {
    return new ShoppingList([]);
  }

  static fromItems(items: readonly Item[]): ShoppingList {
    return new ShoppingList([...items]);
  }

  get uncheckedItems(): readonly Item[] {
    return this.items.filter((item) => !item.checked);
  }

  get checkedItems(): readonly Item[] {
    return this.items.filter((item) => item.checked);
  }

  /** « Tout est pris » : au moins un article, et tous cochés (≠ liste vide). */
  get isAllChecked(): boolean {
    return this.items.length > 0 && this.uncheckedItems.length === 0;
  }

  /** @throws ItemNotFoundError si l'identifiant est inconnu. */
  get(id: ItemId): Item {
    const item = this.items.find((candidate) => candidate.id === id);
    if (!item) throw new ItemNotFoundError(id);
    return item;
  }

  /** L'article passe en tête de « Dans le panier ». @throws ItemNotFoundError */
  check(id: ItemId): ShoppingList {
    const item = this.get(id);
    if (item.checked) return this;
    const checkedItem: Item = { ...item, checked: true };
    const remainingUncheckedItems = this.uncheckedItems.filter((candidate) => candidate.id !== id);
    return new ShoppingList([...remainingUncheckedItems, checkedItem, ...this.checkedItems]);
  }

  /** L'article passe à la fin de « À prendre ». @throws ItemNotFoundError */
  uncheck(id: ItemId): ShoppingList {
    const item = this.get(id);
    if (!item.checked) return this;
    const uncheckedItem: Item = { ...item, checked: false };
    return new ShoppingList([
      ...this.uncheckedItems,
      uncheckedItem,
      ...this.checkedItems.filter((checkedItem) => checkedItem.id !== id),
    ]);
  }

  /** @throws EmptyItemNameError | ItemNameTooLongError si le nom est refusé. */
  add(rawName: string, id: ItemId): ShoppingList {
    const newItem: Item = { id, name: normalizeItemName(rawName), checked: false };
    return new ShoppingList([...this.uncheckedItems, newItem, ...this.checkedItems]);
  }
}
