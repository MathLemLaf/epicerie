import type { ShoppingList } from "./shopping-list";

/**
 * Frontière de stockage de la liste (voir docs/architecture.md, « Frontières »).
 * Les erreurs explicites (stockage plein, données illisibles) arrivent avec EPI-016 et EPI-017.
 */
export interface ShoppingListRepository {
  load(): ShoppingList;
  save(list: ShoppingList): void;
}
