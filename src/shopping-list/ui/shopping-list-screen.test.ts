import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ShoppingList } from "../domain/shopping-list";
import { InMemoryShoppingListRepository } from "../storage/in-memory-shopping-list-repository";
import { mountShoppingListScreen } from "./shopping-list-screen";

const TOO_LONG_NAME = "a".repeat(112);

let root: HTMLElement;
let repository: InMemoryShoppingListRepository;
let scrolledElements: Element[];

beforeEach(() => {
  root = document.createElement("div");
  document.body.append(root);
  repository = new InMemoryShoppingListRepository();
  scrolledElements = [];
  vi.spyOn(Element.prototype, "scrollIntoView").mockImplementation(function (this: Element) {
    scrolledElements.push(this);
  });
});

afterEach(() => {
  root.remove();
  vi.restoreAllMocks();
});

function mountScreen(): void {
  let nextId = 0;
  mountShoppingListScreen(root, { repository, generateId: () => `id-${++nextId}` });
}

function givenListContains(...names: string[]): void {
  const list = names.reduce(
    (current, name) => current.add(name, `id-${name}`),
    ShoppingList.empty(),
  );
  repository.save(list);
}

function field(): HTMLInputElement {
  const label = [...root.querySelectorAll("label")].find(
    (element) => element.textContent === "Nouvel article",
  );
  const input = label ? root.querySelector(`#${label.htmlFor}`) : null;
  if (!(input instanceof HTMLInputElement)) {
    throw new Error("Champ « Nouvel article » introuvable");
  }
  return input;
}

function addButton(): HTMLButtonElement {
  const button = root.querySelector("button[aria-label='Ajouter à la liste']");
  if (!(button instanceof HTMLButtonElement)) {
    throw new Error("Bouton « Ajouter » introuvable");
  }
  return button;
}

function addBar(): HTMLFormElement {
  const bar = field().closest("form");
  if (!bar) {
    throw new Error("Barre d'ajout introuvable");
  }
  return bar;
}

function type(text: string): void {
  field().value = text;
  field().dispatchEvent(new Event("input", { bubbles: true }));
}

function typeAndTouchAdd(text: string): void {
  type(text);
  addButton().click();
}

function itemsToBuy(): string[] {
  const list = root.querySelector("ul[aria-labelledby='section-a-prendre']");
  return [...(list?.querySelectorAll("li") ?? [])].map((item) => item.textContent ?? "");
}

function fieldErrorText(): string {
  return root.querySelector("[role='alert']")?.textContent?.trim() ?? "";
}

function counter(): HTMLElement {
  const element = root.querySelector<HTMLElement>(".length-counter");
  if (!element) {
    throw new Error("Compteur introuvable");
  }
  return element;
}

function announcement(): string {
  return root.querySelector("[role='status']")?.textContent ?? "";
}

function isDefaultPreventedOnMouseDown(target: Element): boolean {
  const event = new MouseEvent("mousedown", { bubbles: true, cancelable: true });
  target.dispatchEvent(event);
  return event.defaultPrevented;
}

describe("EPI-001 — Ajouter un article à ma liste", () => {
  it("ajout réussi", () => {
    givenListContains("pain");
    mountScreen();

    typeAndTouchAdd("lait");

    expect(itemsToBuy()).toEqual(["pain", "lait"]);
    expect(repository.load().uncheckedItems.at(-1)).toMatchObject({
      name: "lait",
      checked: false,
    });
    expect(field().value).toBe("");
    expect(document.activeElement).toBe(field());
    expect(scrolledElements.at(-1)?.textContent).toBe("lait");
  });

  it("valider au clavier ou au bouton", () => {
    mountScreen();

    type("sel");
    addBar().requestSubmit();
    typeAndTouchAdd("poivre");

    expect(itemsToBuy()).toEqual(["sel", "poivre"]);
  });

  it("champ prêt dès l'ouverture", () => {
    mountScreen();

    expect(document.activeElement).toBe(field());
  });

  it("un seul toucher ouvre le clavier : la barre entière donne le focus au champ", () => {
    mountScreen();
    field().blur();

    addBar().click();

    expect(document.activeElement).toBe(field());
  });

  it("un seul toucher ouvre le clavier : l'étiquette donne le focus au champ", () => {
    mountScreen();
    field().blur();

    root.querySelector("label")?.click();

    expect(document.activeElement).toBe(field());
  });

  it("valider depuis le bouton atteint au clavier ramène le focus dans le champ", () => {
    mountScreen();
    type("lait");
    addButton().focus();

    addButton().click();

    expect(document.activeElement).toBe(field());
  });

  it("le clavier reste ouvert entre deux ajouts", () => {
    mountScreen();

    typeAndTouchAdd("sel");
    const buttonKeepsFieldFocused = isDefaultPreventedOnMouseDown(addButton());
    typeAndTouchAdd("poivre");

    expect(buttonKeepsFieldFocused).toBe(true);
    expect(document.activeElement).toBe(field());
  });

  it("un toucher dans la barre ne ferme pas le clavier ouvert", () => {
    mountScreen();
    const label = root.querySelector("label");
    if (!label) throw new Error("Étiquette introuvable");

    expect(isDefaultPreventedOnMouseDown(addBar())).toBe(true);
    expect(isDefaultPreventedOnMouseDown(label)).toBe(true);
    expect(isDefaultPreventedOnMouseDown(field())).toBe(false);
    expect(document.activeElement).toBe(field());
  });

  it("nom vide refusé", () => {
    mountScreen();

    typeAndTouchAdd("   ");

    expect(itemsToBuy()).toEqual([]);
    expect(fieldErrorText()).toBe("!Écris le nom d'un article pour l'ajouter.");
    expect(root.querySelector("[role='alert'] [aria-hidden='true']")).not.toBeNull();
    expect(field().getAttribute("aria-invalid")).toBe("true");
    expect(document.activeElement).toBe(field());
  });

  it("nom vide refusé : le message disparaît dès que je modifie la saisie", () => {
    mountScreen();
    typeAndTouchAdd("");

    type("l");

    expect(fieldErrorText()).toBe("");
    expect(field().hasAttribute("aria-invalid")).toBe(false);
  });

  it("espaces retirés", () => {
    mountScreen();

    typeAndTouchAdd("   beurre  ");

    expect(itemsToBuy()).toEqual(["beurre"]);
  });

  it("accents conservés", () => {
    mountScreen();

    typeAndTouchAdd("crème sûre");

    expect(itemsToBuy()).toEqual(["crème sûre"]);
  });

  it("exactement 100 caractères", () => {
    mountScreen();
    const hundredCharacters = "œ".repeat(100);

    typeAndTouchAdd(hundredCharacters);

    expect(itemsToBuy()).toEqual([hundredCharacters]);
  });

  it("compteur dès 80 caractères", () => {
    mountScreen();

    type("a".repeat(79));
    const hiddenAt79 = counter().hidden;
    type("a".repeat(80));
    const textAt80 = counter().textContent;
    type("a".repeat(81));

    expect(hiddenAt79).toBe(true);
    expect(textAt80).toBe("80 / 100");
    expect(counter().hidden).toBe(false);
    expect(counter().textContent).toBe("81 / 100");
  });

  it("101 caractères ou plus refusés, sans perte du texte", () => {
    mountScreen();

    typeAndTouchAdd(TOO_LONG_NAME);

    expect(itemsToBuy()).toEqual([]);
    expect(fieldErrorText()).toBe(
      "!Le nom est trop long : 100 caractères au maximum (tu en as 112). Raccourcis-le.",
    );
    expect(counter().textContent).toBe("112 / 100");
    expect(counter().classList).toContain("length-counter--over-limit");
    expect(field().value).toBe(TOO_LONG_NAME);
  });

  it("la frappe n'est jamais bloquée", () => {
    mountScreen();
    const pastedText = "b".repeat(150);

    type(pastedText);

    expect(field().hasAttribute("maxlength")).toBe(false);
    expect(field().value).toHaveLength(150);
  });

  it("correction après refus", () => {
    mountScreen();
    typeAndTouchAdd(TOO_LONG_NAME);

    typeAndTouchAdd(TOO_LONG_NAME.slice(12));

    expect(itemsToBuy()).toEqual([TOO_LONG_NAME.slice(12)]);
    expect(fieldErrorText()).toBe("");
  });

  it("exigences d'accessibilité : l'ajout est annoncé", () => {
    mountScreen();

    typeAndTouchAdd("lait");

    expect(announcement()).toBe("« lait » ajouté à la liste.");
  });

  it("exigences d'accessibilité : le champ est relié à l'erreur et au compteur", () => {
    mountScreen();

    typeAndTouchAdd(TOO_LONG_NAME);

    const describedBy = field().getAttribute("aria-describedby")?.split(" ") ?? [];
    const descriptions = describedBy.map((id) => root.querySelector(`#${id}`)?.textContent ?? "");
    expect(descriptions.join(" ")).toContain("Le nom est trop long");
    expect(descriptions.join(" ")).toContain("112 / 100");
  });

  it("exigences d'accessibilité : la section « À prendre » a un titre avec le nombre d'articles", () => {
    givenListContains("pain", "lait");

    mountScreen();

    expect(root.querySelector("h2#section-a-prendre")?.textContent).toBe("À prendre (2)");
  });

  it("masque la section « À prendre » quand elle est vide", () => {
    mountScreen();

    expect(root.querySelector("h2#section-a-prendre")).toBeNull();
  });
});

function givenListState(...entries: [name: string, checked: boolean][]): void {
  repository.save(
    ShoppingList.fromItems(entries.map(([name, checked]) => ({ id: `id-${name}`, name, checked }))),
  );
}

function itemsInBasket(): string[] {
  const list = root.querySelector("ul[aria-labelledby='section-dans-le-panier']");
  return [...(list?.querySelectorAll("li") ?? [])].map((item) => item.textContent ?? "");
}

function sectionHeadings(): string[] {
  return [...root.querySelectorAll("h2")].map((heading) => heading.textContent ?? "");
}

function checkbox(name: string): HTMLInputElement {
  const input = [...root.querySelectorAll<HTMLInputElement>("input[type='checkbox']")].find(
    (candidate) => candidate.closest("label")?.textContent === name,
  );
  if (!input) {
    throw new Error(`Case de « ${name} » introuvable`);
  }
  return input;
}

function touchRow(name: string): void {
  checkbox(name).click();
}

const ALL_TAKEN_MESSAGE = "Tout est dans ton panier ! Il ne reste rien à prendre.";

function allTakenMessage(): string {
  return root.querySelector(".all-taken")?.textContent?.trim() ?? "";
}

describe("EPI-002 — Cocher un article mis dans le panier", () => {
  it("cocher un article", () => {
    givenListState(["pain", false], ["lait", false], ["œufs", false]);
    mountScreen();

    touchRow("pain");

    expect(sectionHeadings()).toEqual(["À prendre (2)", "Dans le panier (1)"]);
    expect(itemsToBuy()).toEqual(["lait", "œufs"]);
    expect(itemsInBasket()).toEqual(["pain"]);
    expect(checkbox("pain").checked).toBe(true);
    expect(announcement()).toBe("« pain » mis dans le panier.");
    expect(repository.load().checkedItems).toMatchObject([{ name: "pain", checked: true }]);
  });

  it("emplacement d'un article coché", () => {
    givenListState(["pain", false], ["beurre", true]);
    mountScreen();

    touchRow("pain");

    expect(itemsInBasket()).toEqual(["pain", "beurre"]);
  });

  it("décocher un article", () => {
    givenListState(["lait", false], ["œufs", false], ["pain", true]);
    mountScreen();

    touchRow("pain");

    expect(itemsToBuy()).toEqual(["lait", "œufs", "pain"]);
    expect(checkbox("pain").checked).toBe(false);
    expect(announcement()).toBe("« pain » remis dans les articles à prendre.");
    expect(repository.load().uncheckedItems.at(-1)).toMatchObject({ name: "pain", checked: false });
  });

  it("cochage par erreur corrigé", () => {
    givenListState(["pain", false], ["lait", false]);
    mountScreen();
    touchRow("pain");

    touchRow("pain");

    expect(itemsToBuy()).toEqual(["lait", "pain"]);
    expect(root.querySelector("h2#section-dans-le-panier")).toBeNull();
  });

  it("tout est pris", () => {
    givenListState(["pain", false], ["lait", false]);
    mountScreen();

    touchRow("pain");
    touchRow("lait");

    expect(root.querySelector("h2#section-a-prendre")).toBeNull();
    expect(allTakenMessage()).toBe(ALL_TAKEN_MESSAGE);
    expect(announcement()).toContain(ALL_TAKEN_MESSAGE);
    expect(sectionHeadings()).toEqual(["Dans le panier (2)"]);
    expect(itemsInBasket()).toEqual(["lait", "pain"]);
  });

  it("tout est pris n'est pas la liste vide", () => {
    givenListState(["pain", true]);
    mountScreen();

    expect(allTakenMessage()).toBe(ALL_TAKEN_MESSAGE);
    expect(root.textContent).not.toContain("Ta liste est vide.");
  });

  it("une liste sans aucun article n'affiche pas « tout est pris »", () => {
    mountScreen();

    expect(root.querySelector(".all-taken")).toBeNull();
  });

  it("l'ouverture sur « tout est pris » n'annonce rien", () => {
    givenListState(["pain", true]);
    mountScreen();

    expect(announcement()).toBe("");
  });

  it("sortie de « tout est pris » : en ajoutant un article", () => {
    givenListState(["pain", true]);
    mountScreen();

    typeAndTouchAdd("sel");

    expect(root.querySelector(".all-taken")).toBeNull();
    expect(itemsToBuy()).toEqual(["sel"]);
  });

  it("sortie de « tout est pris » : en décochant un article", () => {
    givenListState(["pain", true]);
    mountScreen();

    touchRow("pain");

    expect(root.querySelector(".all-taken")).toBeNull();
    expect(itemsToBuy()).toEqual(["pain"]);
  });

  it("une section vide est masquée", () => {
    givenListState(["pain", false]);
    mountScreen();

    expect(root.querySelector("h2#section-dans-le-panier")).toBeNull();
  });

  it("distinction sans la couleur : case cochée, ligne marquée, section « Dans le panier »", () => {
    givenListState(["pain", true], ["lait", false]);
    mountScreen();

    expect(checkbox("pain").checked).toBe(true);
    expect(checkbox("lait").checked).toBe(false);
    expect(checkbox("pain").closest("li")?.classList).toContain("item-row--checked");
    expect(checkbox("lait").closest("li")?.classList).not.toContain("item-row--checked");
    expect(itemsInBasket()).toEqual(["pain"]);
  });

  it("exigences d'accessibilité : case à cocher native nommée par l'article", () => {
    givenListState(["pain", false]);
    mountScreen();

    expect(checkbox("pain").type).toBe("checkbox");
    expect(checkbox("pain").closest("label")).not.toBeNull();
  });

  it("exigences d'accessibilité : le focus suit l'article coché", () => {
    givenListState(["pain", false], ["lait", false]);
    mountScreen();

    touchRow("pain");

    expect(document.activeElement).toBe(checkbox("pain"));
  });

  it("exigences d'accessibilité : le focus suit l'article décoché", () => {
    givenListState(["pain", true], ["lait", false]);
    mountScreen();

    touchRow("pain");

    expect(document.activeElement).toBe(checkbox("pain"));
  });

  it("déplacement lisible : l'article déplacé porte la marque d'animation, les autres non", () => {
    givenListState(["pain", false], ["lait", false]);
    mountScreen();

    touchRow("pain");

    expect(checkbox("pain").closest("li")?.classList).toContain("item-row--just-moved");
    expect(checkbox("lait").closest("li")?.classList).not.toContain("item-row--just-moved");
  });

  it("l'ajout d'un article ne ramène pas la marque d'animation", () => {
    givenListState(["pain", false]);
    mountScreen();
    touchRow("pain");

    typeAndTouchAdd("sel");

    expect(root.querySelector(".item-row--just-moved")).toBeNull();
  });
});
