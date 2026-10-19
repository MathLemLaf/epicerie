export const ITEM_NAME_MAX_LENGTH = 100;
export const LENGTH_COUNTER_THRESHOLD = 80;

// Découpage en graphèmes : « œ », « é » (même décomposé en e + accent) ou un emoji
// comptent chacun pour un caractère visible, comme le perçoit la personne qui tape.
const graphemeSegmenter = new Intl.Segmenter("fr-CA", { granularity: "grapheme" });

// Espaces et caractères de format invisibles (U+200B à U+200F, U+202A à U+202E, U+2060 à
// U+2064, U+FEFF, U+00AD, U+180E) : fréquents en copier-coller web, ils ne sont pas retirés
// par `trim()`. On ne les retire qu'aux extrémités, comme une espace : au milieu d'un nom,
// le ZWJ d'un emoji composé doit rester. Les caractères de tag (U+E0020 à U+E007F), qui
// terminent un drapeau comme 🏴󠁧󠁢󠁥󠁮󠁧󠁿, ne sont volontairement pas dans la liste.
const INVISIBLE_OR_SPACE =
  "\\p{White_Space}\\u00AD\\u180E\\u200B-\\u200F\\u202A-\\u202E\\u2060-\\u2064\\uFEFF";
const EDGE_INVISIBLES = new RegExp(`^[${INVISIBLE_OR_SPACE}]+|[${INVISIBLE_OR_SPACE}]+$`, "gu");

function trimInvisibles(text: string): string {
  return text.replace(EDGE_INVISIBLES, "");
}

/** Nom d'article refusé par les règles d'EPI-001. */
export abstract class InvalidItemNameError extends Error {}

export class EmptyItemNameError extends InvalidItemNameError {
  constructor() {
    super("Le nom de l'article est vide.");
    this.name = "EmptyItemNameError";
  }
}

export class ItemNameTooLongError extends InvalidItemNameError {
  readonly visibleLength: number;

  constructor(visibleLength: number) {
    super(
      `Le nom de l'article a ${visibleLength} caractères visibles (maximum ${ITEM_NAME_MAX_LENGTH}).`,
    );
    this.name = "ItemNameTooLongError";
    this.visibleLength = visibleLength;
  }
}

export function countVisibleCharacters(text: string): number {
  let count = 0;
  for (const _grapheme of graphemeSegmenter.segment(text)) {
    count++;
  }
  return count;
}

export function visibleLengthOfItemName(rawName: string): number {
  return countVisibleCharacters(trimInvisibles(rawName));
}

export function isLengthCounterVisible(rawName: string): boolean {
  return visibleLengthOfItemName(rawName) >= LENGTH_COUNTER_THRESHOLD;
}

export function normalizeItemName(rawName: string): string {
  const name = trimInvisibles(rawName);
  const visibleLength = countVisibleCharacters(name);
  if (visibleLength === 0) {
    throw new EmptyItemNameError();
  }
  if (visibleLength > ITEM_NAME_MAX_LENGTH) {
    throw new ItemNameTooLongError(visibleLength);
  }
  return name;
}
