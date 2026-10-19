import { ShoppingList } from "../domain/shopping-list";
import type { ShoppingListRepository } from "../domain/shopping-list-repository";

/**
 * Dépôt sans persistance : la liste est perdue à la fermeture de l'app.
 * Sert aux tests, et à l'app tant que le dépôt localStorage (EPI-003) n'existe pas.
 */
export class InMemoryShoppingListRepository implements ShoppingListRepository {
  private list = ShoppingList.empty();

  load(): ShoppingList {
    return this.list;
  }

  save(list: ShoppingList): void {
    this.list = list;
  }
}
