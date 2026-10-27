/** Délai avant de réécrire une annonce identique : laisse au lecteur d'écran le temps de voir la zone vide. */
const REPEATED_ANNOUNCEMENT_DELAY_MS = 100;

/**
 * Zone d'annonces commune de l'écran (un seul role="status" pour l'ajout et le cochage).
 * Une annonce identique à la précédente serait ignorée par VoiceOver : on vide la zone,
 * puis on réécrit le texte au tour suivant (design-system.md, « Zone d'annonces commune »).
 */
export class Announcer {
  readonly element: HTMLParagraphElement;
  private pendingRewrite: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    this.element = document.createElement("p");
    this.element.className = "visually-hidden";
    this.element.setAttribute("role", "status");
  }

  announce(message: string): void {
    clearTimeout(this.pendingRewrite);
    if (this.element.textContent !== message) {
      this.element.textContent = message;
      return;
    }
    this.element.textContent = "";
    this.pendingRewrite = setTimeout(() => {
      this.element.textContent = message;
    }, REPEATED_ANNOUNCEMENT_DELAY_MS);
  }
}
