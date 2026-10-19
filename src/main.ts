// Point d'assemblage de l'app (voir docs/architecture.md) :
// c'est le seul endroit qui relie le domaine, le stockage et l'écran.
import { registerSW } from "virtual:pwa-register";
import { InMemoryShoppingListRepository } from "./shopping-list/storage/in-memory-shopping-list-repository";
import { mountShoppingListScreen } from "./shopping-list/ui/shopping-list-screen";

const APP_ROOT_ID = "app";

function findAppRoot(): HTMLElement {
  const root = document.getElementById(APP_ROOT_ID);
  if (!root) {
    throw new Error(`Élément #${APP_ROOT_ID} introuvable dans index.html`);
  }
  return root;
}

// Dépôt en mémoire en attendant le dépôt localStorage d'EPI-003 : la liste est perdue à la fermeture.
mountShoppingListScreen(findAppRoot(), {
  repository: new InMemoryShoppingListRepository(),
  generateId: () => crypto.randomUUID(),
});

registerSW({ immediate: true });
