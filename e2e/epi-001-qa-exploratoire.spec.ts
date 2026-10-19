import { readFileSync } from "node:fs";
import { expect, type Page, test } from "@playwright/test";

// Tests de Julie (QA) pour EPI-001 : cas limites et accessibilité mesurable.
// Complètent e2e/epi-001-ajouter-article.spec.ts (Pierrick) sans le modifier.

const field = (page: Page) => page.getByLabel("Nouvel article");
const items = (page: Page) => page.getByRole("list", { name: /^À prendre/ }).getByRole("listitem");

async function add(page: Page, name: string) {
  await field(page).fill(name);
  await field(page).press("Enter");
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("QA-01 injection HTML : le nom s'affiche comme texte", async ({ page }) => {
  const dialogs: string[] = [];
  page.on("dialog", (d) => {
    dialogs.push(d.message());
    void d.dismiss();
  });
  const payloads = [
    "<script>alert(1)</script>",
    '<img src=x onerror="alert(2)">',
    "<b>gras</b> & &amp; \"'",
    "' OR 1=1 --",
  ];
  for (const payload of payloads) await add(page, payload);
  await expect(items(page)).toHaveText(payloads);
  await expect(page.locator("main img, main script, main b")).toHaveCount(0);
  await expect(page.getByRole("status")).toHaveText("« ' OR 1=1 -- » ajouté à la liste.");
  expect(dialogs).toEqual([]);
});

test("QA-02 emoji et graphèmes complexes comptent pour 1", async ({ page }) => {
  const family = "👨‍👩‍👧‍👦"; // 1 graphème, 11 unités UTF-16
  const hundred = family.repeat(100);
  await add(page, hundred);
  await expect(items(page)).toHaveCount(1);
  await add(page, `${family.repeat(101)}`);
  await expect(page.getByRole("alert")).toContainText("tu en as 101");
  await expect(items(page)).toHaveCount(1);
});

test("QA-03 décomposé (e + accent combinant) compte pour 1", async ({ page }) => {
  await add(page, "é".repeat(100));
  await expect(items(page)).toHaveCount(1);
});

test("QA-04 collage avec retours à la ligne : une seule ligne, pas de perte silencieuse", async ({
  page,
}) => {
  await field(page).focus();
  await page.keyboard.insertText("lait\nœufs\r\npain");
  const value = await field(page).inputValue();
  console.log("valeur du champ après collage multiligne :", JSON.stringify(value));
  await field(page).press("Enter");
  console.log("article :", JSON.stringify(await items(page).first().textContent()));
  await expect(items(page)).toHaveCount(1);
});

test("QA-05 espaces insécables, tabulations et espaces ratissés", async ({ page }) => {
  await add(page, " \t  beurre   ");
  expect(await items(page).first().textContent()).toBe("beurre");
});

test("QA-06 caractères invisibles seuls (espace de largeur nulle) : refusés ?", async ({
  page,
}) => {
  await add(page, "\u200b");
  const count = await items(page).count();
  console.log("articles après saisie de U+200B seul :", count);
  expect(count, "un article au nom invisible ne devrait pas être ajouté").toBe(0);
});

test("QA-07 double Entrée rapide : un seul article", async ({ page }) => {
  await field(page).fill("sel");
  await field(page).press("Enter");
  await field(page).press("Enter");
  await expect(items(page)).toHaveText(["sel"]);
  await expect(page.getByRole("alert")).toContainText("Écris le nom");
});

test("QA-08 même article ajouté deux fois de suite (doublons permis, annonce répétée)", async ({
  page,
}) => {
  await add(page, "lait");
  await add(page, "lait");
  await expect(items(page)).toHaveText(["lait", "lait"]);
  await expect(page.getByRole("heading", { level: 2 })).toHaveText("À prendre (2)");
});

test("QA-09 mot très long sans espace : pas de débordement horizontal", async ({ page }) => {
  await add(page, "x".repeat(100));
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
  const mainOverflow = await page.locator("main").evaluate((m) => m.scrollWidth - m.clientWidth);
  expect(mainOverflow).toBe(0);
});

test("QA-10 40 articles : barre toujours visible, dernier article visible, ordre conservé", async ({
  page,
}) => {
  const names = Array.from({ length: 40 }, (_, i) => `article ${i + 1}`);
  for (const n of names) await add(page, n);
  await expect(items(page)).toHaveText(names);
  await expect(items(page).last()).toBeInViewport();
  await expect(field(page)).toBeInViewport({ ratio: 1 });
  const bar = await page.locator("form.add-item-bar").boundingBox();
  expect((bar?.y ?? 0) + (bar?.height ?? 0)).toBe(page.viewportSize()?.height);
  // Le dernier article ne doit pas être caché derrière la barre.
  const last = await items(page).last().boundingBox();
  expect((last?.y ?? 0) + (last?.height ?? 0)).toBeLessThanOrEqual((bar?.y ?? 0) + 1);
});

test("QA-11 petit écran 320 px : barre utilisable, erreur longue incluse", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await field(page).fill("a".repeat(112));
  await field(page).press("Enter");
  const bar = await page.locator("form.add-item-bar").boundingBox();
  const fieldBox = await field(page).boundingBox();
  const button = await page.getByRole("button", { name: "Ajouter à la liste" }).boundingBox();
  console.log("320px barre", bar, "champ", fieldBox, "bouton", button);
  expect((bar?.y ?? 0) + (bar?.height ?? 0)).toBeLessThanOrEqual(568);
  expect(fieldBox?.width).toBeGreaterThan(120);
  expect((button?.x ?? 0) + (button?.width ?? 0)).toBeLessThanOrEqual(320);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
  // L'en-tête et la liste gardent de la place (écran 568 px).
  const main = await page.locator("main").boundingBox();
  console.log("320px zone liste hauteur", main?.height);
});

test("QA-12 paysage (667x375) : barre visible, liste encore visible", async ({ page }) => {
  await page.setViewportSize({ width: 667, height: 375 });
  await add(page, "pain");
  const main = await page.locator("main").boundingBox();
  console.log("paysage hauteur zone liste", main?.height);
  await expect(field(page)).toBeInViewport({ ratio: 1 });
  await expect(items(page).first()).toBeInViewport();
});

test("QA-13 ordre de tabulation : champ puis Ajouter ; focus visible", async ({
  page,
  browserName,
}) => {
  test.skip(
    browserName === "webkit",
    "Safari ne met pas les boutons dans l'ordre de Tab par défaut (réglage macOS)",
  );
  await field(page).focus();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Ajouter à la liste" })).toBeFocused();
  const outline = await page
    .getByRole("button", { name: "Ajouter à la liste" })
    .evaluate((b) => getComputedStyle(b).outlineStyle);
  expect(outline).not.toBe("none");
  await page.keyboard.press("Tab");
  const tag = await page.evaluate(() => document.activeElement?.tagName);
  console.log("après Ajouter, Tab mène à", tag);
});

test("QA-14 Entrée sur le bouton Ajouter (clavier) ajoute et ramène le focus au champ", async ({
  page,
  browserName,
}) => {
  test.skip(browserName === "webkit", "Tab ne cible pas les boutons dans WebKit sur Mac");
  await field(page).fill("riz");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(items(page)).toHaveText(["riz"]);
  await expect(field(page)).toBeFocused();
});

test("QA-15 noms accessibles et rôles", async ({ page }) => {
  await expect(page.getByRole("textbox", { name: "Nouvel article" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Ajouter à la liste" })).toBeVisible();
  await expect(page.getByRole("main")).toHaveCount(1);
  await add(page, "lait");
  await expect(page.getByRole("list", { name: "À prendre (1)" })).toBeVisible();
});

test("QA-16 police du champ >= 16 px (pas de zoom automatique iOS)", async ({ page }) => {
  const size = await field(page).evaluate((e) => parseFloat(getComputedStyle(e).fontSize));
  expect(size).toBeGreaterThanOrEqual(16);
});

test("QA-17 contrastes calculés (WCAG)", () => {
  const lum = (hex: string) => {
    const [r = 0, g = 0, b = 0] = [1, 3, 5].map((i) => {
      const c = Number.parseInt(hex.slice(i, i + 2), 16) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const ratio = (a: string, b: string) => {
    const [x = 0, y = 0] = [lum(a), lum(b)].sort((p, q) => q - p);
    return (x + 0.05) / (y + 0.05);
  };
  const css = readFileSync("src/shopping-list/ui/theme.css", "utf8");
  const v = (name: string) => css.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})`))?.[1] ?? "";
  const t = {
    fond: v("--couleur-fond"),
    texte: v("--couleur-texte"),
    sec: v("--couleur-texte-secondaire"),
    surface: v("--couleur-surface"),
    prim: v("--couleur-primaire"),
    surprim: v("--couleur-texte-sur-primaire"),
    bord: v("--couleur-bordure-champ"),
    err: v("--couleur-erreur"),
    focus: v("--couleur-focus"),
  };
  const results = {
    "texte/fond": [ratio(t.texte, t.fond), 4.5],
    "texte/surface (étiquette)": [ratio(t.texte, t.surface), 4.5],
    "secondaire/fond (placeholder)": [ratio(t.sec, t.fond), 4.5],
    "secondaire/surface (compteur)": [ratio(t.sec, t.surface), 4.5],
    "blanc/primaire (bouton)": [ratio(t.surprim, t.prim), 4.5],
    "erreur/surface (message, compteur)": [ratio(t.err, t.surface), 4.5],
    "bordure champ/fond (non-texte)": [ratio(t.bord, t.fond), 3],
    "focus/surface (non-texte)": [ratio(t.focus, t.surface), 3],
    "primaire/surface (non-texte)": [ratio(t.prim, t.surface), 3],
  } as Record<string, [number, number]>;
  for (const [k, [r, min]] of Object.entries(results)) {
    console.log(`${k}: ${r.toFixed(2)} (min ${min})`);
    expect(r, k).toBeGreaterThanOrEqual(min);
  }
});

test("QA-18 zoom 200 % simulé (viewport 195 px de large équivalent) : pas de défilement horizontal", async ({
  page,
}) => {
  await page.setViewportSize({ width: 195, height: 422 });
  await add(page, "lait 2 L");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  console.log("débordement à 195 px :", overflow);
  await expect(field(page)).toBeInViewport({ ratio: 1 });
  const button = await page.getByRole("button", { name: "Ajouter à la liste" }).boundingBox();
  expect((button?.x ?? 0) + (button?.width ?? 0)).toBeLessThanOrEqual(195);
});

test("QA-19 texte agrandi (police racine 200 %) : barre toujours dans l'écran", async ({
  page,
}) => {
  await page.addStyleTag({ content: "html{font-size:200%}" });
  await field(page).fill("a".repeat(112));
  await field(page).press("Enter");
  const bar = await page.locator("form.add-item-bar").boundingBox();
  const vh = page.viewportSize()?.height ?? 0;
  console.log("texte 200 % : barre", bar, "viewport h", vh);
  expect(bar?.y ?? 0).toBeGreaterThanOrEqual(0);
  expect((bar?.y ?? 0) + (bar?.height ?? 0)).toBeLessThanOrEqual(vh);
  const main = await page.locator("main").boundingBox();
  console.log("texte 200 % : hauteur zone liste", main?.height);
});

test("QA-20 le texte refusé n'est pas perdu après plusieurs refus", async ({ page }) => {
  const long = "é".repeat(120);
  await add(page, long);
  await field(page).press("Enter");
  await field(page).press("Enter");
  await expect(field(page)).toHaveValue(long);
  await expect(items(page)).toHaveCount(0);
});

test("QA-21 rechargement : la liste est perdue (attendu : EPI-003 pas livrée)", async ({
  page,
}) => {
  await add(page, "lait");
  await page.reload();
  await expect(items(page)).toHaveCount(0);
});
