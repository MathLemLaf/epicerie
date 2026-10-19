import { expect, type Locator, type Page, test } from "@playwright/test";

// EPI-002 — Cocher un article mis dans le panier (docs/produit/backlog.md).
// Un test par scénario automatisable, nommé comme le scénario.
//
// À vérifier à la main sur l'iPhone de Math (Julie) — non simulé ici :
// - toucher du pouce une ligne sur l'écran réel : le cochage se fait au premier toucher,
//   sans toucher la ligne voisine quand les lignes remontent d'un cran (5 essais en série) ;
// - VoiceOver : « pain mis dans le panier » et « Tout est dans ton panier » sont lus, y compris
//   deux cochages de suite ; la case est lue « pain, coché / non coché » ;
// - « distinction sans la couleur » : Réglages > Accessibilité > Affichage > Filtres de couleur
//   > Niveaux de gris : l'article coché se distingue encore (coche, barré, section) ;
// - contrastes (thème clair), zoom 200 %, largeur 320 px, texte système agrandi, rotation ;
// - le déplacement est lisible à l'œil (animation ≤ 200 ms, sans clignotement).
// Ici, on vérifie les états, l'ordre, les annonces, les mesures et les styles calculés.

const MINIMUM_ROW_HEIGHT_PX = 56;
const MINIMUM_CHECK_ZONE_PX = 48;
// WebKit mesure parfois 55,99998 px pour un min-height de 56 px (arrondi de la mise en page).
const SUBPIXEL_TOLERANCE_PX = 0.1;
const MAXIMUM_MOVE_ANIMATION_MS = 200;
const ALL_TAKEN_MESSAGE = "Tout est dans ton panier ! Il ne reste rien à prendre.";

function field(page: Page): Locator {
  return page.getByLabel("Nouvel article");
}

function itemsToBuy(page: Page): Locator {
  return page.getByRole("list", { name: /^À prendre/ }).getByRole("listitem");
}

function itemsInBasket(page: Page): Locator {
  return page.getByRole("list", { name: /^Dans le panier/ }).getByRole("listitem");
}

// Le message « tout est pris » visible (la zone d'annonce, masquée, contient le même texte).
function allTakenMessage(page: Page): Locator {
  return page.getByText(ALL_TAKEN_MESSAGE, { exact: true });
}

function rowOf(page: Page, name: string): Locator {
  return page.getByRole("listitem").filter({ hasText: name });
}

function checkboxOf(page: Page, name: string): Locator {
  return page.getByRole("checkbox", { name });
}

async function touchRow(page: Page, name: string): Promise<void> {
  await rowOf(page, name).locator("label").tap();
}

async function givenItemsToBuy(page: Page, ...names: string[]): Promise<void> {
  for (const name of names) {
    await field(page).fill(name);
    await field(page).press("Enter");
  }
}

async function givenItemsInBasket(page: Page, ...names: string[]): Promise<void> {
  await givenItemsToBuy(page, ...names);
  for (const name of names) {
    await touchRow(page, name);
  }
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("cocher un article", async ({ page }) => {
  await givenItemsToBuy(page, "pain", "lait", "œufs");

  await touchRow(page, "pain");

  await expect(page.getByRole("heading", { name: "À prendre (2)" })).toBeVisible();
  await expect(itemsToBuy(page)).toHaveText(["lait", "œufs"]);
  await expect(page.getByRole("heading", { name: "Dans le panier (1)" })).toBeVisible();
  await expect(itemsInBasket(page)).toHaveText(["pain"]);
  await expect(checkboxOf(page, "pain")).toBeChecked();
  await expect(rowOf(page, "pain").locator(".item-row__name")).toHaveCSS(
    "text-decoration-line",
    "line-through",
  );
  await expect(page.getByRole("status")).toHaveText("« pain » mis dans le panier.");
});

test("emplacement d'un article coché", async ({ page }) => {
  await givenItemsInBasket(page, "beurre");
  await givenItemsToBuy(page, "pain");

  await touchRow(page, "pain");

  await expect(itemsInBasket(page)).toHaveText(["pain", "beurre"]);
});

test("décocher un article", async ({ page }) => {
  await givenItemsToBuy(page, "pain", "lait", "œufs");
  await touchRow(page, "pain");

  await touchRow(page, "pain");

  await expect(itemsToBuy(page)).toHaveText(["lait", "œufs", "pain"]);
  await expect(checkboxOf(page, "pain")).not.toBeChecked();
  await expect(page.getByRole("status")).toHaveText("« pain » remis dans les articles à prendre.");
});

test("cochage par erreur corrigé", async ({ page }) => {
  await givenItemsToBuy(page, "pain", "lait");
  await touchRow(page, "pain");

  await touchRow(page, "pain");

  await expect(itemsToBuy(page)).toHaveText(["lait", "pain"]);
  await expect(page.getByRole("heading", { name: /^Dans le panier/ })).toHaveCount(0);
});

test("tout est pris", async ({ page }) => {
  await givenItemsToBuy(page, "pain", "lait");

  await touchRow(page, "pain");
  await touchRow(page, "lait");

  await expect(page.getByRole("heading", { name: /^À prendre/ })).toHaveCount(0);
  await expect(allTakenMessage(page)).toBeVisible();
  await expect(page.getByRole("status")).toContainText(ALL_TAKEN_MESSAGE);
  await expect(page.getByRole("heading", { name: "Dans le panier (2)" })).toBeVisible();
  await expect(itemsInBasket(page)).toHaveText(["lait", "pain"]);
});

test("tout est pris n'est pas la liste vide", async ({ page }) => {
  await givenItemsInBasket(page, "pain");

  await expect(page.getByText("Ta liste est vide.")).toHaveCount(0);
  await expect(allTakenMessage(page)).toBeVisible();
});

test("sortie de « tout est pris » en ajoutant un article", async ({ page }) => {
  await givenItemsInBasket(page, "pain");

  await givenItemsToBuy(page, "sel");

  await expect(allTakenMessage(page)).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "À prendre (1)" })).toBeVisible();
  await expect(itemsToBuy(page)).toHaveText(["sel"]);
});

test("sortie de « tout est pris » en décochant un article", async ({ page }) => {
  await givenItemsInBasket(page, "pain");

  await touchRow(page, "pain");

  await expect(allTakenMessage(page)).toHaveCount(0);
  await expect(itemsToBuy(page)).toHaveText(["pain"]);
});

test("distinction sans la couleur : case cochée, texte barré et section", async ({ page }) => {
  await givenItemsToBuy(page, "pain", "lait");
  await touchRow(page, "pain");

  await expect(checkboxOf(page, "pain")).toBeChecked();
  await expect(itemsInBasket(page)).toHaveText(["pain"]);
  await expect(rowOf(page, "pain").locator(".item-row__name")).toHaveCSS(
    "text-decoration-line",
    "line-through",
  );
  await expect(rowOf(page, "lait").locator(".item-row__name")).toHaveCSS(
    "text-decoration-line",
    "none",
  );
  const checkMarkContent = await rowOf(page, "pain")
    .locator(".item-row__box")
    .evaluate((box) => getComputedStyle(box, "::after").content);
  expect(checkMarkContent).not.toBe("none");
});

test("cible de cochage : ligne d'au moins 56 px, zone de cochage d'au moins 48 px", async ({
  page,
}) => {
  await givenItemsToBuy(page, "pain");
  await givenItemsInBasket(page, "lait");

  for (const name of ["pain", "lait"]) {
    const label = await rowOf(page, name).locator("label").boundingBox();
    const box = await rowOf(page, name).locator(".item-row__box").boundingBox();
    expect(label?.height).toBeGreaterThanOrEqual(MINIMUM_ROW_HEIGHT_PX - SUBPIXEL_TOLERANCE_PX);
    expect(box?.width).toBeGreaterThanOrEqual(MINIMUM_CHECK_ZONE_PX - SUBPIXEL_TOLERANCE_PX);
    expect(box?.height).toBeGreaterThanOrEqual(MINIMUM_CHECK_ZONE_PX - SUBPIXEL_TOLERANCE_PX);
  }
});

test("toucher le nom, loin de la case, coche aussi : toute la ligne est la cible", async ({
  page,
}) => {
  await givenItemsToBuy(page, "pain");

  const name = await rowOf(page, "pain").locator(".item-row__name").boundingBox();
  if (!name) throw new Error("Nom de l'article introuvable");
  await page.touchscreen.tap(name.x + name.width - 8, name.y + name.height / 2);

  await expect(itemsInBasket(page)).toHaveText(["pain"]);
});

test("exigences d'accessibilité : Espace coche, et le focus suit l'article déplacé", async ({
  page,
}) => {
  await givenItemsToBuy(page, "pain", "lait");
  await checkboxOf(page, "pain").focus();

  await page.keyboard.press("Space");

  await expect(itemsInBasket(page)).toHaveText(["pain"]);
  await expect(checkboxOf(page, "pain")).toBeFocused();

  await page.keyboard.press("Space");

  await expect(itemsToBuy(page)).toHaveText(["lait", "pain"]);
  await expect(checkboxOf(page, "pain")).toBeFocused();
});

test("exigences d'accessibilité : anneau de focus visible sur la ligne au clavier", async ({
  page,
}) => {
  await givenItemsToBuy(page, "pain");
  await page.keyboard.press("Shift");

  await checkboxOf(page, "pain").focus();

  await expect(checkboxOf(page, "pain")).toBeFocused();
  await expect(rowOf(page, "pain")).toHaveCSS("outline-style", "solid");
  await expect(rowOf(page, "pain")).toHaveCSS("outline-width", "2px");
});

test("exigences d'accessibilité : animation de déplacement courte", async ({ page }) => {
  await givenItemsToBuy(page, "pain");

  await touchRow(page, "pain");

  const durationSeconds = await rowOf(page, "pain").evaluate((row) =>
    Number.parseFloat(getComputedStyle(row).animationDuration),
  );
  expect(durationSeconds * 1000).toBeLessThanOrEqual(MAXIMUM_MOVE_ANIMATION_MS);
  expect(durationSeconds).toBeGreaterThan(0);
});

test("exigences d'accessibilité : animation supprimée avec « réduire les animations »", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await givenItemsToBuy(page, "pain");

  await touchRow(page, "pain");

  await expect(rowOf(page, "pain")).toHaveCSS("animation-name", "none");
});
