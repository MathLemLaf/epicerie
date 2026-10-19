import { describe, expect, it } from "vitest";
import {
  countVisibleCharacters,
  EmptyItemNameError,
  ITEM_NAME_MAX_LENGTH,
  ItemNameTooLongError,
  isLengthCounterVisible,
  normalizeItemName,
} from "./item-name";

describe("countVisibleCharacters", () => {
  it("compte « œ » pour un seul caractère", () => {
    expect(countVisibleCharacters("œufs")).toBe(4);
  });

  it("compte un « é » décomposé (e + accent combinant) pour un seul caractère", () => {
    const decomposedE = "é";

    expect(countVisibleCharacters(`cr${decomposedE}me`)).toBe(5);
  });

  it("compte un emoji pour un seul caractère", () => {
    expect(countVisibleCharacters("🍎")).toBe(1);
  });
});

describe("normalizeItemName", () => {
  it("espaces retirés", () => {
    expect(normalizeItemName("   beurre  ")).toBe("beurre");
  });

  it("accents conservés", () => {
    expect(normalizeItemName("crème sûre")).toBe("crème sûre");
  });

  it("exactement 100 caractères", () => {
    const hundredCharacters = "œ".repeat(ITEM_NAME_MAX_LENGTH);

    expect(normalizeItemName(hundredCharacters)).toBe(hundredCharacters);
  });

  it("nom vide refusé : champ vide", () => {
    expect(() => normalizeItemName("")).toThrow(EmptyItemNameError);
  });

  it("nom vide refusé : seulement des espaces", () => {
    expect(() => normalizeItemName("   ")).toThrow(EmptyItemNameError);
  });

  it.each([
    ["espace de largeur nulle U+200B", "\u200b"],
    ["U+200C à U+200D", "\u200c\u200d"],
    ["word joiner U+2060", "\u2060"],
    ["BOM U+FEFF", "\ufeff"],
    ["trait d'union conditionnel U+00AD", "\u00ad"],
    ["mélange avec des espaces", " \u200b \ufeff\u2060 "],
  ])("nom vide refusé : seulement des caractères invisibles (%s)", (_label, invisibleName) => {
    expect(() => normalizeItemName(invisibleName)).toThrow(EmptyItemNameError);
  });

  it("caractères invisibles en début et en fin retirés comme des espaces", () => {
    expect(normalizeItemName("\u200b\ufeffbeurre\u200b")).toBe("beurre");
  });

  it("emoji composé avec ZWJ conservé", () => {
    const family = "👨\u200d👩\u200d👧";

    expect(normalizeItemName(family)).toBe(family);
  });

  it("emoji à séquence de tags (drapeau) conservé en entier", () => {
    const flagOfEngland = "🏴\u{e0067}\u{e0062}\u{e0065}\u{e006e}\u{e0067}\u{e007f}";

    expect(normalizeItemName(flagOfEngland)).toBe(flagOfEngland);
  });

  it("accent combinant conservé", () => {
    expect(normalizeItemName("cre\u0301me")).toBe("cre\u0301me");
  });

  it("101 caractères ou plus refusés, avec le nombre de caractères saisis", () => {
    const tooLongName = "a".repeat(112);

    expect(() => normalizeItemName(tooLongName)).toThrow(
      expect.objectContaining({ visibleLength: 112 }),
    );
    expect(() => normalizeItemName(tooLongName)).toThrow(ItemNameTooLongError);
  });

  it("compte la longueur après retrait des espaces", () => {
    const hundredCharactersWithSpaces = `  ${"a".repeat(ITEM_NAME_MAX_LENGTH)}  `;

    expect(normalizeItemName(hundredCharactersWithSpaces)).toHaveLength(ITEM_NAME_MAX_LENGTH);
  });
});

describe("isLengthCounterVisible", () => {
  it("compteur dès 80 caractères : masqué à 79", () => {
    expect(isLengthCounterVisible("a".repeat(79))).toBe(false);
  });

  it("compteur dès 80 caractères : visible à 80", () => {
    expect(isLengthCounterVisible("a".repeat(80))).toBe(true);
  });

  it("ne compte pas les espaces du début et de la fin", () => {
    expect(isLengthCounterVisible(` ${"a".repeat(79)} `)).toBe(false);
  });
});
