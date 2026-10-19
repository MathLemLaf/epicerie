// Point d'assemblage de l'app (voir docs/architecture.md) :
// c'est le seul endroit qui relie le domaine, le stockage et l'écran.
import { registerSW } from "virtual:pwa-register";

registerSW({ immediate: true });
