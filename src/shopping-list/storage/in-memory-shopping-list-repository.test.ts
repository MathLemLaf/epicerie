import { describe, expect, it } from "vitest";
import { ShoppingList } from "../domain/shopping-list";
import { InMemoryShoppingListRepository } from "./in-memory-shopping-list-repository";

describe("InMemoryShoppingListRepository", () => {
  it("renvoie une liste vide quand rien n'a été enregistré", () => {
    const repository = new InMemoryShoppingListRepository();

    expect(repository.load().items).toEqual([]);
  });

  it("renvoie la dernière liste enregistrée", () => {
    const repository = new InMemoryShoppingListRepository();
    const list = ShoppingList.empty().add("lait", "id-lait");

    repository.save(list);

    expect(repository.load()).toBe(list);
  });
});
