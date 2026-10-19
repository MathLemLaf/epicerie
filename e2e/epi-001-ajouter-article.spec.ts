import { expect, type Locator, type Page, test } from "@playwright/test";

// EPI-001 — Ajouter un article à ma liste (docs/produit/backlog.md).
// Un test par scénario automatisable, nommé comme le scénario.
//
// À vérifier à la main sur l'iPhone de Math (Julie) — WebKit sur ordinateur n'a pas de clavier virtuel :
// - « un seul toucher ouvre le clavier » : le clavier s'ouvre au premier toucher (5 essais) ;
//   ici, on vérifie seulement que le toucher donne le focus au champ et la taille de la zone.
// - « le clavier reste ouvert entre deux ajouts » et « un toucher dans la barre ne ferme pas
//   le clavier ouvert » : ici, on vérifie seulement que le focus reste dans le champ.
// - « ajout rapide (objectif < 5 s) » : chronomètre, 5 essais, app installée.
// - « exigences d'accessibilité » : contrastes, VoiceOver, zoom 200 %, 320 px, texte agrandi,
//   barre non masquée par le clavier.

const MINIMUM_TOUCH_TARGET_PX = 48;
const ADD_BUTTON_MIN_WIDTH_PX = 96;
const COLUMN_MAX_WIDTH_PX = 560;
const ERROR_COLOR = "rgb(179, 38, 30)";
const TOO_LONG_NAME = "a".repeat(112);

function field(page: Page): Locator {
  return page.getByLabel("Nouvel article");
}

function addButton(page: Page): Locator {
  return page.getByRole("button", { name: "Ajouter à la liste" });
}

function addBar(page: Page): Locator {
  return page.locator("form.add-item-bar");
}

function itemsToBuy(page: Page): Locator {
  return page.getByRole("list", { name: /^À prendre/ }).getByRole("listitem");
}

function fieldError(page: Page): Locator {
  return page.getByRole("alert");
}

function counter(page: Page): Locator {
  return page.locator(".length-counter");
}

async function addItem(page: Page, name: string): Promise<void> {
  await field(page).fill(name);
  await field(page).press("Enter");
}

async function blurField(page: Page): Promise<void> {
  await field(page).evaluate((element) => (element as HTMLInputElement).blur());
}

// Sur iPhone, une perte de focus, même brève, ferme le clavier : on compte les « blur » du champ.
async function countFieldBlurs(page: Page): Promise<void> {
  await field(page).evaluate((element) => {
    element.dataset.blurCount = "0";
    element.addEventListener("blur", () => {
      element.dataset.blurCount = String(Number(element.dataset.blurCount) + 1);
    });
  });
}

async function expectFieldNeverBlurred(page: Page): Promise<void> {
  await expect(field(page)).toHaveAttribute("data-blur-count", "0");
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("ajout réussi", async ({ page }) => {
  const itemsBeforePain = Array.from({ length: 20 }, (_, index) => `article ${index + 1}`);
  for (const name of [...itemsBeforePain, "pain"]) {
    await addItem(page, name);
  }

  await field(page).fill("lait");
  await addButton(page).tap();

  await expect(itemsToBuy(page).nth(-2)).toHaveText("pain");
  await expect(itemsToBuy(page).last()).toHaveText("lait");
  await expect(field(page)).toHaveValue("");
  await expect(field(page)).toBeFocused();
  await expect(itemsToBuy(page).last()).toBeInViewport();
});

test("valider au clavier ou au bouton", async ({ page }) => {
  await field(page).fill("sel");
  await field(page).press("Enter");
  await expect(itemsToBuy(page)).toHaveText(["sel"]);

  await field(page).fill("poivre");
  await addButton(page).tap();
  await expect(itemsToBuy(page)).toHaveText(["sel", "poivre"]);
});

test("champ prêt dès l'ouverture", async ({ page }) => {
  const viewportHeight = page.viewportSize()?.height ?? 0;

  const bar = await addBar(page).boundingBox();

  await expect(addBar(page)).toBeInViewport({ ratio: 1 });
  expect(Math.round((bar?.y ?? 0) + (bar?.height ?? 0))).toBe(viewportHeight);
  await expect(field(page)).toBeFocused();
});

test("un seul toucher ouvre le clavier", async ({ page }) => {
  const bar = await addBar(page).boundingBox();
  const viewportWidth = page.viewportSize()?.width ?? 0;
  expect(bar?.height).toBeGreaterThanOrEqual(MINIMUM_TOUCH_TARGET_PX);
  expect(bar?.width).toBe(Math.min(viewportWidth, COLUMN_MAX_WIDTH_PX));

  const touchPoints = {
    étiquette: () => page.getByText("Nouvel article", { exact: true }).tap(),
    champ: () => field(page).tap(),
    "marge de la barre": () => addBar(page).tap({ position: { x: 4, y: 4 } }),
    "espace entre le champ et le bouton": async () => {
      const button = await addButton(page).boundingBox();
      await page.touchscreen.tap((button?.x ?? 0) - 4, (button?.y ?? 0) + 24);
    },
  };
  for (const [where, touch] of Object.entries(touchPoints)) {
    await blurField(page);

    await touch();

    await expect(field(page), `toucher : ${where}`).toBeFocused();
  }
});

test("le clavier reste ouvert entre deux ajouts", async ({ page }) => {
  await field(page).tap();
  await countFieldBlurs(page);

  await field(page).fill("sel");
  await addButton(page).tap();
  await field(page).fill("poivre");
  await field(page).press("Enter");

  await expect(itemsToBuy(page)).toHaveText(["sel", "poivre"]);
  await expect(field(page)).toBeFocused();
  await expectFieldNeverBlurred(page);
});

test("un toucher dans la barre ne ferme pas le clavier ouvert", async ({ page }) => {
  await field(page).tap();
  await countFieldBlurs(page);

  await page.getByText("Nouvel article", { exact: true }).tap();
  await addBar(page).tap({ position: { x: 4, y: 4 } });
  await field(page).tap();

  await expect(field(page)).toBeFocused();
  await expectFieldNeverBlurred(page);
});

test("nom vide refusé", async ({ page }) => {
  await field(page).fill("   ");

  await addButton(page).tap();

  await expect(itemsToBuy(page)).toHaveCount(0);
  await expect(fieldError(page)).toHaveText("!Écris le nom d'un article pour l'ajouter.");
  await expect(fieldError(page).locator(".field-error__icon")).toBeVisible();
  await expect(field(page)).toHaveAttribute("aria-invalid", "true");
  await expect(field(page)).toBeFocused();

  await field(page).press("l");
  await expect(fieldError(page)).toBeEmpty();
});

test("espaces retirés", async ({ page }) => {
  await addItem(page, "   beurre  ");

  await expect(itemsToBuy(page)).toHaveCount(1);
  expect(await itemsToBuy(page).first().textContent()).toBe("beurre");
});

test("accents conservés", async ({ page }) => {
  await addItem(page, "crème sûre");

  expect(await itemsToBuy(page).first().textContent()).toBe("crème sûre");
});

test("exactement 100 caractères", async ({ page }) => {
  const hundredCharacters = `${"œ".repeat(50)}${"é".repeat(50)}`;

  await addItem(page, hundredCharacters);

  expect(await itemsToBuy(page).first().textContent()).toBe(hundredCharacters);
});

test("compteur dès 80 caractères", async ({ page }) => {
  await field(page).fill("a".repeat(79));
  await expect(counter(page)).toBeHidden();

  await field(page).press("a");
  await expect(counter(page)).toHaveText("80 / 100");

  await field(page).press("a");
  await expect(counter(page)).toHaveText("81 / 100");
});

test("101 caractères ou plus refusés, sans perte du texte", async ({ page }) => {
  await field(page).fill(TOO_LONG_NAME);

  await addButton(page).tap();

  await expect(itemsToBuy(page)).toHaveCount(0);
  await expect(fieldError(page)).toHaveText(
    "!Le nom est trop long : 100 caractères au maximum (tu en as 112). Raccourcis-le.",
  );
  await expect(counter(page)).toHaveText("112 / 100");
  await expect(counter(page)).toHaveCSS("color", ERROR_COLOR);
  await expect(field(page)).toHaveValue(TOO_LONG_NAME);
});

test("la frappe n'est jamais bloquée", async ({ page }) => {
  const pastedText = "b".repeat(150);
  await field(page).focus();

  await page.keyboard.insertText(pastedText);

  await expect(field(page)).toHaveValue(pastedText);
});

test("correction après refus", async ({ page }) => {
  await addItem(page, TOO_LONG_NAME);
  await expect(fieldError(page)).not.toBeEmpty();

  for (let deleted = 0; deleted < 12; deleted++) {
    await field(page).press("Backspace");
  }
  await field(page).press("Enter");

  await expect(itemsToBuy(page)).toHaveText(["a".repeat(100)]);
  await expect(fieldError(page)).toBeEmpty();
});

test("exigences d'accessibilité", async ({ page }) => {
  await expect(page.locator("html")).toHaveAttribute("lang", "fr-CA");
  await expect(page).toHaveTitle("Ma liste d'épicerie");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Ma liste d'épicerie");
  for (const target of [field(page), addButton(page)]) {
    const box = await target.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(MINIMUM_TOUCH_TARGET_PX);
  }
  const button = await addButton(page).boundingBox();
  expect(button?.width).toBeGreaterThanOrEqual(ADD_BUTTON_MIN_WIDTH_PX);

  await addItem(page, "lait");

  await expect(page.getByRole("status")).toHaveText("« lait » ajouté à la liste.");
});
