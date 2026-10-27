import "./theme.css";
import "./shopping-list-screen.css";
import type { ItemId } from "../domain/item";
import { InvalidItemNameError, normalizeItemName } from "../domain/item-name";
import type { ShoppingListRepository } from "../domain/shopping-list-repository";
import { AddItemBar } from "./add-item-bar";
import { Announcer } from "./announcer";
import { ItemListView } from "./item-list-view";
import { texts } from "./texts";

export interface ShoppingListScreenDependencies {
  repository: ShoppingListRepository;
  generateId: () => ItemId;
}

/** Monte l'écran unique de l'app dans `root` et donne le focus au champ d'ajout. */
export function mountShoppingListScreen(
  root: HTMLElement,
  { repository, generateId }: ShoppingListScreenDependencies,
): void {
  let list = repository.load();
  const content = createContent();
  const listView = new ItemListView(content, toggleItem);
  content.append(listView.element);
  const announcer = new Announcer();
  const addItemBar = new AddItemBar(addItem);

  root.classList.add("shopping-list-screen");
  root.replaceChildren(createHeader(), content, announcer.element, addItemBar.element);
  listView.render(list);
  addItemBar.focusField();

  function addItem(rawName: string): void {
    try {
      addValidItem(rawName);
    } catch (error) {
      if (!(error instanceof InvalidItemNameError)) throw error;
      addItemBar.showNameError(error);
    }
    addItemBar.focusField();
  }

  function addValidItem(rawName: string): void {
    const name = normalizeItemName(rawName);
    const id = generateId();
    list = list.add(name, id);
    repository.save(list);
    listView.render(list);
    listView.scrollToItem(id);
    addItemBar.clearField();
    announcer.announce(texts.itemAdded(name));
  }

  function toggleItem(id: ItemId, checked: boolean): void {
    list = checked ? list.check(id) : list.uncheck(id);
    repository.save(list);
    listView.render(list);
    listView.followMovedItem(id);
    announcer.announce(toggleAnnouncement(list.get(id).name, checked, list.isAllChecked));
  }
}

function toggleAnnouncement(name: string, checked: boolean, isAllChecked: boolean): string {
  if (!checked) return texts.itemPutBack(name);
  const moved = texts.itemMovedToBasket(name);
  return isAllChecked ? `${moved} ${texts.allTaken}` : moved;
}

function createHeader(): HTMLElement {
  const title = document.createElement("h1");
  title.textContent = texts.appTitle;

  const header = document.createElement("header");
  header.className = "app-header";
  header.append(title);
  return header;
}

function createContent(): HTMLElement {
  const content = document.createElement("main");
  content.className = "app-content";
  return content;
}
