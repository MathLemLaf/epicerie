import {
  type InvalidItemNameError,
  ITEM_NAME_MAX_LENGTH,
  ItemNameTooLongError,
  isLengthCounterVisible,
  visibleLengthOfItemName,
} from "../domain/item-name";
import { texts } from "./texts";

const FIELD_ID = "nouvel-article";
const ERROR_ID = "nouvel-article-erreur";
const COUNTER_ID = "nouvel-article-compteur";

/**
 * Barre d'ajout fixée en bas de l'écran. Toute la barre est une cible tactile
 * qui donne le focus au champ (docs/ux/wireframes.md, « Barre d'ajout entièrement touchable »).
 *
 * iOS n'ouvre le clavier que si focus() est appelé pendant le geste de l'utilisateur :
 * tous les appels à focusField() se font de façon synchrone dans les gestionnaires d'événements.
 */
export class AddItemBar {
  readonly element: HTMLFormElement;
  private readonly field: HTMLInputElement;
  private readonly error: HTMLParagraphElement;
  private readonly counter: HTMLParagraphElement;

  constructor(onAddRequested: (rawName: string) => void) {
    this.field = createField();
    this.error = createError();
    this.counter = createCounter();
    this.element = createForm(this.field, this.error, this.counter);

    this.element.addEventListener("submit", (event) => {
      event.preventDefault();
      onAddRequested(this.field.value);
    });
    this.element.addEventListener("mousedown", (event) => this.keepFieldFocused(event));
    this.element.addEventListener("click", () => this.focusField());
    this.field.addEventListener("input", () => this.onFieldChanged());
  }

  focusField(): void {
    this.field.focus();
  }

  clearField(): void {
    this.field.value = "";
    this.onFieldChanged();
  }

  showNameError(error: InvalidItemNameError): void {
    this.error.replaceChildren(createErrorIcon(), errorMessage(error));
    this.field.setAttribute("aria-invalid", "true");
    this.updateFieldDescription();
  }

  // Empêche la perte de focus (et la fermeture du clavier) quand on touche la barre
  // ou le bouton « Ajouter » ; le champ lui-même garde son comportement natif (curseur).
  private keepFieldFocused(event: MouseEvent): void {
    if (event.target !== this.field) {
      event.preventDefault();
    }
  }

  private onFieldChanged(): void {
    this.hideError();
    this.updateCounter();
    this.updateFieldDescription();
  }

  private hideError(): void {
    this.error.replaceChildren();
    this.field.removeAttribute("aria-invalid");
  }

  private updateCounter(): void {
    const visibleLength = visibleLengthOfItemName(this.field.value);
    this.counter.hidden = !isLengthCounterVisible(this.field.value);
    this.counter.textContent = texts.lengthCounter(visibleLength);
    this.counter.classList.toggle(
      "length-counter--over-limit",
      visibleLength > ITEM_NAME_MAX_LENGTH,
    );
  }

  private updateFieldDescription(): void {
    const descriptionIds = [];
    if (this.error.hasChildNodes()) descriptionIds.push(ERROR_ID);
    if (!this.counter.hidden) descriptionIds.push(COUNTER_ID);

    if (descriptionIds.length === 0) {
      this.field.removeAttribute("aria-describedby");
    } else {
      this.field.setAttribute("aria-describedby", descriptionIds.join(" "));
    }
  }
}

function errorMessage(error: InvalidItemNameError): string {
  if (error instanceof ItemNameTooLongError) {
    return texts.tooLongNameError(error.visibleLength);
  }
  return texts.emptyNameError;
}

function createForm(
  field: HTMLInputElement,
  error: HTMLParagraphElement,
  counter: HTMLParagraphElement,
): HTMLFormElement {
  const label = document.createElement("label");
  label.className = "add-item-bar__label";
  label.htmlFor = FIELD_ID;
  label.textContent = texts.newItemLabel;

  const button = document.createElement("button");
  button.type = "submit";
  button.className = "add-item-bar__button";
  button.textContent = texts.addButton;
  button.setAttribute("aria-label", texts.addButtonAccessibleName);

  const row = document.createElement("div");
  row.className = "add-item-bar__row";
  row.append(field, button);

  const form = document.createElement("form");
  form.className = "add-item-bar";
  form.noValidate = true;
  form.append(label, error, row, counter);
  return form;
}

function createField(): HTMLInputElement {
  const field = document.createElement("input");
  field.id = FIELD_ID;
  field.type = "text";
  field.className = "add-item-bar__field";
  field.placeholder = texts.newItemPlaceholder;
  field.autocomplete = "off";
  field.enterKeyHint = "done";
  return field;
}

function createError(): HTMLParagraphElement {
  const error = document.createElement("p");
  error.id = ERROR_ID;
  error.className = "field-error";
  error.setAttribute("role", "alert");
  return error;
}

function createErrorIcon(): HTMLSpanElement {
  const icon = document.createElement("span");
  icon.className = "field-error__icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = "!";
  return icon;
}

function createCounter(): HTMLParagraphElement {
  const counter = document.createElement("p");
  counter.id = COUNTER_ID;
  counter.className = "length-counter";
  counter.hidden = true;
  return counter;
}
