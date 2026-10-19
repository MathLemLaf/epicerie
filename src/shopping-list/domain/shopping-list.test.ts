import { describe, expect, it } from "vitest";
import { EmptyItemNameError, ItemNameTooLongError } from "./item-name";
import { ItemNotFoundError, ShoppingList } from "./shopping-list";

describe("ShoppingList.add", () => {
  it("ajout réussi : l'article arrive à la fin de « À prendre », non coché", () => {
    const list = ShoppingList.empty().add("pain", "id-pain");

    const updatedList = list.add("lait", "id-lait");

    expect(updatedList.uncheckedItems).toEqual([
      { id: "id-pain", name: "pain", checked: false },
      { id: "id-lait", name: "lait", checked: false },
    ]);
  });

  it("ajoute à la fin des non cochés, avant les articles cochés", () => {
    const list = ShoppingList.fromItems([
      { id: "id-pain", name: "pain", checked: false },
      { id: "id-beurre", name: "beurre", checked: true },
    ]);

    const updatedList = list.add("lait", "id-lait");

    expect(updatedList.items.map((item) => item.name)).toEqual(["pain", "lait", "beurre"]);
  });

  it("ne modifie pas la liste d'origine", () => {
    const list = ShoppingList.empty();

    list.add("lait", "id-lait");

    expect(list.items).toEqual([]);
  });

  it("espaces retirés", () => {
    const list = ShoppingList.empty().add("   beurre  ", "id-beurre");

    expect(list.items[0]?.name).toBe("beurre");
  });

  it("nom vide refusé", () => {
    expect(() => ShoppingList.empty().add("  ", "id")).toThrow(EmptyItemNameError);
  });

  it("101 caractères ou plus refusés", () => {
    expect(() => ShoppingList.empty().add("a".repeat(101), "id")).toThrow(ItemNameTooLongError);
  });
});

describe("ShoppingList sections", () => {
  it("sépare les articles à prendre de ceux dans le panier", () => {
    const list = ShoppingList.fromItems([
      { id: "1", name: "pain", checked: false },
      { id: "2", name: "beurre", checked: true },
    ]);

    expect(list.uncheckedItems.map((item) => item.name)).toEqual(["pain"]);
    expect(list.checkedItems.map((item) => item.name)).toEqual(["beurre"]);
  });
});

function listOf(...entries: [id: string, checked: boolean][]): ShoppingList {
  return ShoppingList.fromItems(entries.map(([id, checked]) => ({ id, name: id, checked })));
}

function namesOf(items: readonly { name: string }[]): string[] {
  return items.map((item) => item.name);
}

describe("EPI-002 — ShoppingList.check", () => {
  it("cocher un article : il quitte « À prendre » et arrive dans « Dans le panier », coché", () => {
    const list = listOf(["pain", false], ["lait", false], ["œufs", false]);

    const updatedList = list.check("pain");

    expect(namesOf(updatedList.uncheckedItems)).toEqual(["lait", "œufs"]);
    expect(updatedList.checkedItems).toEqual([{ id: "pain", name: "pain", checked: true }]);
  });

  it("emplacement d'un article coché : en tête de « Dans le panier »", () => {
    const list = listOf(["pain", false], ["beurre", true]);

    const updatedList = list.check("pain");

    expect(namesOf(updatedList.checkedItems)).toEqual(["pain", "beurre"]);
  });

  it("garde l'ordre d'affichage : « À prendre » puis « Dans le panier »", () => {
    const list = listOf(["pain", false], ["lait", false], ["beurre", true]);

    const updatedList = list.check("pain");

    expect(namesOf(updatedList.items)).toEqual(["lait", "pain", "beurre"]);
  });

  it("cocher un article déjà coché ne change pas l'ordre", () => {
    const list = listOf(["pain", true], ["beurre", true]);

    const updatedList = list.check("beurre");

    expect(namesOf(updatedList.checkedItems)).toEqual(["pain", "beurre"]);
  });

  it("ne modifie pas la liste d'origine", () => {
    const list = listOf(["pain", false]);

    list.check("pain");

    expect(list.checkedItems).toEqual([]);
  });

  it("refuse un article inconnu", () => {
    expect(() => listOf(["pain", false]).check("absent")).toThrow(ItemNotFoundError);
  });
});

describe("EPI-002 — ShoppingList.uncheck", () => {
  it("décocher un article : il revient à la fin de « À prendre », non coché", () => {
    const list = listOf(["lait", false], ["œufs", false], ["pain", true]);

    const updatedList = list.uncheck("pain");

    expect(namesOf(updatedList.uncheckedItems)).toEqual(["lait", "œufs", "pain"]);
    expect(updatedList.checkedItems).toEqual([]);
    expect(updatedList.uncheckedItems.at(-1)?.checked).toBe(false);
  });

  it("garde les autres articles cochés dans leur ordre", () => {
    const list = listOf(["lait", false], ["pain", true], ["beurre", true], ["sel", true]);

    const updatedList = list.uncheck("beurre");

    expect(namesOf(updatedList.items)).toEqual(["lait", "beurre", "pain", "sel"]);
  });

  it("cochage par erreur corrigé : cocher puis décocher remet l'article en fin de « À prendre »", () => {
    const list = listOf(["pain", false], ["lait", false]);

    const updatedList = list.check("pain").uncheck("pain");

    expect(namesOf(updatedList.uncheckedItems)).toEqual(["lait", "pain"]);
  });

  it("refuse un article inconnu", () => {
    expect(() => listOf(["pain", true]).uncheck("absent")).toThrow(ItemNotFoundError);
  });
});

describe("EPI-002 — états de la liste", () => {
  it("tout est pris : au moins un article et tous cochés", () => {
    expect(listOf(["pain", true], ["lait", true]).isAllChecked).toBe(true);
  });

  it("tout est pris n'est pas la liste vide", () => {
    expect(ShoppingList.empty().isAllChecked).toBe(false);
  });

  it("un article à prendre suffit pour que tout ne soit pas pris", () => {
    expect(listOf(["pain", true], ["lait", false]).isAllChecked).toBe(false);
  });
});
