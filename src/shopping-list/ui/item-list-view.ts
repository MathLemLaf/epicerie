import type { Item, ItemId } from "../domain/item";
import type { ShoppingList } from "../domain/shopping-list";
import { texts } from "./texts";

const ITEMS_TO_BUY_HEADING_ID = "section-a-prendre";
const ITEMS_IN_BASKET_HEADING_ID = "section-dans-le-panier";

export type ToggleRequest = (id: ItemId, checked: boolean) => void;

/**
 * Les sections « À prendre » et « Dans le panier », ou le message « tout est pris » :
 * redessinées entièrement à partir de la liste. Une section vide est masquée.
 */
export class ItemListView {
  readonly element: HTMLElement;
  private lastInputWasPointer = false;

  /** `scrollContainer` : la zone qui fait défiler la liste (elle contient `element`). */
  constructor(
    private readonly scrollContainer: HTMLElement,
    private readonly onToggleRequested: ToggleRequest,
  ) {
    this.element = document.createElement("div");
    this.element.addEventListener("pointerdown", () => {
      this.lastInputWasPointer = true;
    });
    this.element.addEventListener("keydown", () => {
      this.lastInputWasPointer = false;
    });
  }

  render(list: ShoppingList): void {
    const parts: HTMLElement[] = [];
    if (list.isAllChecked) parts.push(createAllTakenMessage());
    if (list.uncheckedItems.length > 0) {
      parts.push(
        this.createSection(ITEMS_TO_BUY_HEADING_ID, texts.itemsToBuyHeading, list.uncheckedItems),
      );
    }
    if (list.checkedItems.length > 0) {
      parts.push(
        this.createSection(
          ITEMS_IN_BASKET_HEADING_ID,
          texts.itemsInBasketHeading,
          list.checkedItems,
        ),
      );
    }
    this.element.replaceChildren(...parts);
  }

  scrollToItem(id: ItemId): void {
    this.findRow(id)?.scrollIntoView({ block: "nearest" });
  }

  /**
   * L'article change de section : on le marque pour l'animation et le focus le suit.
   * Au clavier, le navigateur défile jusqu'au focus pour qu'il reste visible (A3, A8).
   * Au toucher ou à la souris, la liste ne bouge pas : sinon elle sauterait jusqu'à l'article
   * déplacé et le prochain article à prendre sortirait de l'écran (BUG-003).
   */
  followMovedItem(id: ItemId): void {
    const row = this.findRow(id);
    row?.classList.add("item-row--just-moved");
    const checkbox = row?.querySelector("input");
    if (!checkbox) return;
    if (this.lastInputWasPointer) {
      this.focusWithoutScrolling(checkbox);
    } else {
      checkbox.focus();
    }
  }

  /**
   * `preventScroll` suffit à Chromium, pas à WebKit, qui défile quand même : on rétablit
   * la position de défilement mémorisée juste après le focus.
   */
  private focusWithoutScrolling(element: HTMLElement): void {
    const scrollPosition = this.scrollContainer.scrollTop;
    element.focus({ preventScroll: true });
    this.scrollContainer.scrollTop = scrollPosition;
  }

  private createSection(
    headingId: string,
    headingText: (count: number) => string,
    items: readonly Item[],
  ): HTMLElement {
    const heading = document.createElement("h2");
    heading.id = headingId;
    heading.textContent = headingText(items.length);

    const itemList = document.createElement("ul");
    itemList.className = "item-list";
    // Safari et VoiceOver retirent le rôle de liste d'un <ul> en list-style: none.
    itemList.setAttribute("role", "list");
    itemList.setAttribute("aria-labelledby", headingId);
    itemList.append(...items.map((item) => this.createRow(item)));

    const section = document.createElement("section");
    section.className = "item-section";
    section.append(heading, itemList);
    return section;
  }

  private createRow(item: Item): HTMLLIElement {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "item-row__checkbox";
    checkbox.checked = item.checked;
    checkbox.addEventListener("change", () => this.onToggleRequested(item.id, checkbox.checked));

    const box = document.createElement("span");
    box.className = "item-row__box";
    box.setAttribute("aria-hidden", "true");

    const name = document.createElement("span");
    name.className = "item-row__name";
    name.textContent = item.name;

    const label = document.createElement("label");
    label.className = "item-row__label";
    label.append(checkbox, box, name);

    const row = document.createElement("li");
    row.className = item.checked ? "item-row item-row--checked" : "item-row";
    row.dataset.itemId = item.id;
    row.append(label);
    return row;
  }

  private findRow(id: ItemId): HTMLLIElement | undefined {
    const rows = this.element.querySelectorAll<HTMLLIElement>("li");
    return [...rows].find((row) => row.dataset.itemId === id);
  }
}

function createAllTakenMessage(): HTMLElement {
  const icon = document.createElement("span");
  icon.className = "all-taken__icon";
  icon.setAttribute("aria-hidden", "true");

  const headline = document.createElement("span");
  headline.className = "all-taken__headline";
  headline.textContent = texts.allTakenHeadline;

  const detail = document.createElement("span");
  detail.className = "all-taken__detail";
  detail.textContent = texts.allTakenDetail;

  const sentences = document.createElement("span");
  sentences.className = "all-taken__text";
  sentences.append(headline, " ", detail);

  const message = document.createElement("p");
  message.className = "all-taken";
  message.append(icon, sentences);
  return message;
}
