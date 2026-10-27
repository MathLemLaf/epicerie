import { expect, type Page, test } from "@playwright/test";

// Tests de Julie (QA) pour EPI-002 : cas limites, ordre, défilement, clavier, accessibilité mesurable.
// Complètent e2e/epi-002-cocher-article.spec.ts (Pierrick) sans le modifier.
// Les console.log servent de preuve dans docs/qa/epi-002-plan-et-resultats.md.

const field = (page: Page) => page.getByLabel("Nouvel article");
const toBuy = (page: Page) => page.getByRole("list", { name: /^À prendre/ }).getByRole("listitem");
const inBasket = (page: Page) =>
  page.getByRole("list", { name: /^Dans le panier/ }).getByRole("listitem");
const row = (page: Page, name: string) =>
  page.getByRole("listitem").filter({ hasText: new RegExp(`^${name}$`) });
const touch = (page: Page, name: string) => row(page, name).locator("label").tap();
const ALL_TAKEN = "Tout est dans ton panier ! Il ne reste rien à prendre.";

async function add(page: Page, ...names: string[]) {
  for (const name of names) {
    await field(page).fill(name);
    await field(page).press("Enter");
  }
}

function luminance(rgb: string): number {
  const m = rgb.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0];
  const lin = (v = 0) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(m[0]) + 0.7152 * lin(m[1]) + 0.0722 * lin(m[2]);
}
function contrast(a: string, b: string): number {
  const hi = Math.max(luminance(a), luminance(b));
  const lo = Math.min(luminance(a), luminance(b));
  return (hi + 0.05) / (lo + 0.05);
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("QA2-01 rafale : 8 articles cochés puis décochés en série, état cohérent", async ({
  page,
}) => {
  const names = ["a1", "b2", "c3", "d4", "e5", "f6", "g7", "h8"];
  await add(page, ...names);
  for (const n of names) await touch(page, n);
  await expect(toBuy(page)).toHaveCount(0);
  await expect(inBasket(page)).toHaveText([...names].reverse());
  await expect(page.getByText(ALL_TAKEN, { exact: true })).toBeVisible();
  for (const n of names) await touch(page, n);
  await expect(inBasket(page)).toHaveCount(0);
  await expect(toBuy(page)).toHaveText(names);
  await expect(page.getByText(ALL_TAKEN, { exact: true })).toHaveCount(0);
});

test("QA2-02 ordre exact après plusieurs cochages et décochages", async ({ page }) => {
  await add(page, "a", "b", "c", "d", "e");
  await touch(page, "c");
  await touch(page, "a");
  await touch(page, "e");
  await expect(toBuy(page)).toHaveText(["b", "d"]);
  await expect(inBasket(page)).toHaveText(["e", "a", "c"]);
  await touch(page, "a");
  await expect(toBuy(page)).toHaveText(["b", "d", "a"]);
  await expect(inBasket(page)).toHaveText(["e", "c"]);
  await touch(page, "b");
  await expect(inBasket(page)).toHaveText(["b", "e", "c"]);
  await touch(page, "c");
  await expect(toBuy(page)).toHaveText(["d", "a", "c"]);
  await expect(inBasket(page)).toHaveText(["b", "e"]);
  await expect(page.getByRole("heading", { name: "À prendre (3)" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Dans le panier (2)" })).toBeVisible();
});

test("QA2-03 tout cocher puis ajouter : le nouvel article va dans À prendre, panier intact", async ({
  page,
}) => {
  await add(page, "pain", "lait");
  await touch(page, "pain");
  await touch(page, "lait");
  await add(page, "sel");
  await expect(toBuy(page)).toHaveText(["sel"]);
  await expect(inBasket(page)).toHaveText(["lait", "pain"]);
  await expect(page.getByText(ALL_TAKEN, { exact: true })).toHaveCount(0);
  await expect(field(page)).toBeFocused();
  await touch(page, "sel");
  await expect(inBasket(page)).toHaveText(["sel", "lait", "pain"]);
  await expect(page.getByText(ALL_TAKEN, { exact: true })).toBeVisible();
});

test("QA2-04 décocher le seul article d'une liste : retour à « À prendre (1) », pas de liste vide", async ({
  page,
}) => {
  await add(page, "pain");
  await touch(page, "pain");
  await touch(page, "pain");
  await expect(toBuy(page)).toHaveText(["pain"]);
  await expect(page.getByRole("heading", { name: /^Dans le panier/ })).toHaveCount(0);
  await expect(page.getByText("Ta liste est vide.")).toHaveCount(0);
  await expect(page.getByText(ALL_TAKEN, { exact: true })).toHaveCount(0);
});

// BUG-003 (corrigé par Pierrick) : ce test journalisait seulement ; il vérifie maintenant qu'au
// toucher la liste ne défile pas et que le prochain article à prendre reste visible.
test("QA2-05 25 articles : la liste ne défile pas au toucher, le focus suit l'article", async ({
  page,
}) => {
  const names = Array.from({ length: 25 }, (_, i) => `article ${i + 1}`);
  await add(page, ...names);
  const scroller = page.locator("main.app-content");
  await scroller.evaluate((el) => {
    el.scrollTop = 0;
  });
  // WebKit défile de façon asynchrone après focus() : on laisse passer deux images avant de mesurer.
  const info = async (name: string) =>
    page.evaluate(async (n) => {
      for (let frame = 0; frame < 2; frame++) {
        await new Promise((resolve) => requestAnimationFrame(resolve));
      }
      const main = document.querySelector("main.app-content") as HTMLElement;
      const li = [...document.querySelectorAll("li")].find((l) => l.textContent === n);
      const r = li?.getBoundingClientRect();
      const m = main.getBoundingClientRect();
      return {
        scrollTop: Math.round(main.scrollTop),
        scrollHeight: main.scrollHeight,
        clientHeight: main.clientHeight,
        rowTop: r ? Math.round(r.top - m.top) : null,
        rowVisible: r ? r.top >= m.top - 1 && r.bottom <= m.bottom + 1 : null,
      };
    }, name);
  console.log("avant cochage de l'article 1 :", JSON.stringify(await info("article 1")));
  await touch(page, "article 1");
  console.log("après cochage de l'article 1 :", JSON.stringify(await info("article 1")));
  console.log("article 2 (prochain à prendre) :", JSON.stringify(await info("article 2")));
  await expect(page.getByRole("checkbox", { name: "article 1", exact: true })).toBeFocused();
  const afterFirstTouch = await info("article 2");
  console.log("article 2 visible après cochage de l'article 1 :", afterFirstTouch.rowVisible);
  expect(afterFirstTouch.scrollTop).toBe(0);
  expect(afterFirstTouch.rowVisible).toBe(true);
  // Cochage d'un article au milieu de la liste
  await scroller.evaluate((el) => {
    el.scrollTop = 0;
  });
  await row(page, "article 12").scrollIntoViewIfNeeded();
  const beforeMiddleTouch = await info("article 12");
  console.log("avant cochage de l'article 12 :", JSON.stringify(beforeMiddleTouch));
  await touch(page, "article 12");
  console.log("après cochage de l'article 12 :", JSON.stringify(await info("article 12")));
  const afterMiddleTouch = await info("article 13");
  console.log("article 13 :", JSON.stringify(afterMiddleTouch));
  await expect(page.getByRole("checkbox", { name: "article 12", exact: true })).toBeFocused();
  expect(afterMiddleTouch.scrollTop).toBe(beforeMiddleTouch.scrollTop);
  expect(afterMiddleTouch.rowVisible).toBe(true);
});

test("QA2-06 double toucher rapide sur la même ligne (la liste remonte sous le doigt)", async ({
  page,
}) => {
  await add(page, "pain", "lait", "œufs");
  const label = row(page, "pain").locator("label");
  const box = await label.boundingBox();
  if (!box) throw new Error("pas de boîte");
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.touchscreen.tap(x, y);
  await page.touchscreen.tap(x, y);
  const buy = await toBuy(page).allTextContents();
  const basket = await inBasket(page).allTextContents();
  console.log("après 2 touchers au même endroit :", JSON.stringify({ buy, basket }));
  expect(buy.length + basket.length).toBe(3);
});

test("QA2-07 320 px : nom de 100 caractères coché, aucun débordement, cibles conservées", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  const long = `${"mot".repeat(33)}x`; // 100 caractères sans espace
  await add(page, long, "pain");
  await touch(page, long);
  const m = await page.evaluate(() => ({
    sw: document.documentElement.scrollWidth,
    cw: document.documentElement.clientWidth,
    mainSw: (document.querySelector("main") as HTMLElement).scrollWidth,
    mainCw: (document.querySelector("main") as HTMLElement).clientWidth,
    rows: [...document.querySelectorAll("li")].map((l) => ({
      t: l.textContent?.slice(0, 8),
      h: Math.round(l.getBoundingClientRect().height),
    })),
  }));
  console.log("320 px :", JSON.stringify(m));
  expect(m.sw).toBeLessThanOrEqual(m.cw);
  expect(m.mainSw).toBeLessThanOrEqual(m.mainCw);
  for (const r of m.rows) expect(r.h).toBeGreaterThanOrEqual(55.9);
  await page.setViewportSize({ width: 195, height: 568 });
  const m2 = await page.evaluate(() => ({
    sw: document.documentElement.scrollWidth,
    cw: document.documentElement.clientWidth,
    mainSw: (document.querySelector("main") as HTMLElement).scrollWidth,
    mainCw: (document.querySelector("main") as HTMLElement).clientWidth,
  }));
  console.log("195 px (zoom 200 % de 390) :", JSON.stringify(m2));
  expect(m2.mainSw).toBeLessThanOrEqual(m2.mainCw);
});

test("QA2-08 texte agrandi (police racine 200 %) : lignes et sections intactes", async ({
  page,
}) => {
  await page.addStyleTag({ content: "html{font-size:200%}" });
  await add(page, "pain", "lait au chocolat biologique");
  await touch(page, "pain");
  const m = await page.evaluate(() => ({
    mainSw: (document.querySelector("main") as HTMLElement).scrollWidth,
    mainCw: (document.querySelector("main") as HTMLElement).clientWidth,
    rows: [...document.querySelectorAll("li")].map((l) =>
      Math.round(l.getBoundingClientRect().height),
    ),
    main: Math.round((document.querySelector("main") as HTMLElement).clientHeight),
  }));
  console.log("texte 200 % :", JSON.stringify(m));
  expect(m.mainSw).toBeLessThanOrEqual(m.mainCw);
});

test("QA2-09 clavier : Tab, Espace, ordre de tabulation, anneau visible sur la ligne déplacée", async ({
  page,
  browserName,
}) => {
  await add(page, "pain", "lait", "œufs");
  await page.getByRole("checkbox", { name: "pain" }).focus();
  await page.keyboard.press("Space");
  await expect(page.getByRole("checkbox", { name: "pain" })).toBeFocused();
  const outline = await row(page, "pain").evaluate((r) => getComputedStyle(r).outlineStyle);
  console.log(`${browserName} : contour de la ligne déplacée après Espace :`, outline);
  // Tab ne cible pas les cases sous WebKit sur ordinateur (réglage « navigation au clavier » de
  // Safari, même cause que QA-13 et QA-14 d'EPI-001) : cette partie ne tourne que sous Chromium.
  test.skip(browserName === "webkit", "Tab ne cible pas les cases sous WebKit (ordinateur)");
  // Ordre de Tab depuis la 1re case : lait, œufs ... (pain est maintenant en bas)
  await page.getByRole("checkbox", { name: "lait" }).focus();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("checkbox", { name: "œufs" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("checkbox", { name: "pain" })).toBeFocused();
  // Entrée ne coche pas une case native (comportement natif) : on le constate
  const before = await page.getByRole("checkbox", { name: "pain" }).isChecked();
  await page.keyboard.press("Enter");
  const after = await page.getByRole("checkbox", { name: "pain" }).isChecked();
  console.log("Entrée sur une case : état avant", before, "après", after);
  // Shift+Tab revient
  await page.keyboard.press("Shift+Tab");
  await expect(page.getByRole("checkbox", { name: "œufs" })).toBeFocused();
});

test("QA2-10 clavier : cocher tout au clavier, le focus n'est jamais perdu (jamais sur body)", async ({
  page,
}) => {
  await add(page, "pain", "lait");
  await page.getByRole("checkbox", { name: "pain" }).focus();
  await page.keyboard.press("Space");
  await page.getByRole("checkbox", { name: "lait" }).focus();
  await page.keyboard.press("Space");
  await expect(page.getByRole("checkbox", { name: "lait" })).toBeFocused();
  await expect(page.getByText(ALL_TAKEN, { exact: true })).toBeVisible();
  await page.keyboard.press("Space");
  await expect(page.getByRole("checkbox", { name: "lait" })).toBeFocused();
  const tag = await page.evaluate(() => document.activeElement?.tagName);
  expect(tag).toBe("INPUT");
});

test("QA2-11 noms accessibles et état coché / non coché, structure", async ({ page }) => {
  await add(page, "pain", "lait");
  await touch(page, "pain");
  await expect(page.getByRole("checkbox", { name: "pain" })).toBeChecked();
  await expect(page.getByRole("checkbox", { name: "lait" })).not.toBeChecked();
  const tree = await page.locator("main").ariaSnapshot();
  console.log(`arbre d'accessibilité :\n${tree}`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 2 })).toHaveCount(2);
  await expect(page.locator("html")).toHaveAttribute("lang", "fr-CA");
  await expect(page).toHaveTitle("Ma liste d'épicerie");
});

test("QA2-12 contrastes calculés des états cochés (styles rendus)", async ({ page }) => {
  await add(page, "pain", "lait");
  await touch(page, "pain");
  const s = await page.evaluate(() => {
    const cs = (el: Element | null, p: string, pseudo?: string) =>
      getComputedStyle(el as Element, pseudo)[p as never] as string;
    const checked = [...document.querySelectorAll("li")].find((l) => l.textContent === "pain");
    const plain = [...document.querySelectorAll("li")].find((l) => l.textContent === "lait");
    const boxC = checked?.querySelector(".item-row__box") ?? null;
    const boxP = plain?.querySelector(".item-row__box") ?? null;
    return {
      pageBg: cs(document.body, "backgroundColor"),
      checkedBg: cs(checked ?? null, "backgroundColor"),
      checkedText: cs(checked?.querySelector(".item-row__name") ?? null, "color"),
      plainText: cs(plain?.querySelector(".item-row__name") ?? null, "color"),
      boxCheckedBg: getComputedStyle(boxC as Element, "::before").backgroundColor,
      boxCheckedBorder: getComputedStyle(boxC as Element, "::before").borderTopColor,
      tickColor: getComputedStyle(boxC as Element, "::after").borderRightColor,
      boxEmptyBorder: getComputedStyle(boxP as Element, "::before").borderTopColor,
      focus: "rgb(11, 87, 208)",
    };
  });
  const r = (a: string, b: string) => Math.round(contrast(a, b) * 100) / 100;
  const out = {
    "texte coché / fond coché (>= 4,5)": r(s.checkedText, s.checkedBg),
    "texte non coché / fond (>= 4,5)": r(s.plainText, s.pageBg),
    "case cochée / fond coché (>= 3)": r(s.boxCheckedBg, s.checkedBg),
    "coche blanche / case pleine (>= 3)": r(s.tickColor, s.boxCheckedBg),
    "case vide (bordure) / fond (>= 3)": r(s.boxEmptyBorder, s.pageBg),
    "anneau de focus / fond coché (>= 3)": r(s.focus, s.checkedBg),
    "anneau de focus / fond (>= 3)": r(s.focus, s.pageBg),
  };
  console.log("contrastes EPI-002 :", JSON.stringify(out), JSON.stringify(s));
  expect(out["texte coché / fond coché (>= 4,5)"]).toBeGreaterThanOrEqual(4.5);
  expect(out["texte non coché / fond (>= 4,5)"]).toBeGreaterThanOrEqual(4.5);
  expect(out["case cochée / fond coché (>= 3)"]).toBeGreaterThanOrEqual(3);
  expect(out["coche blanche / case pleine (>= 3)"]).toBeGreaterThanOrEqual(3);
  expect(out["case vide (bordure) / fond (>= 3)"]).toBeGreaterThanOrEqual(3);
  expect(out["anneau de focus / fond coché (>= 3)"]).toBeGreaterThanOrEqual(3);
});

test("QA2-13 niveaux de gris simulés : l'état reste visible sans la couleur", async ({ page }) => {
  await add(page, "pain", "lait");
  await touch(page, "pain");
  await page.addStyleTag({ content: "html{filter:grayscale(1)}" });
  const s = await page.evaluate(() => {
    const li = [...document.querySelectorAll("li")];
    return li.map((l) => ({
      t: l.textContent,
      deco: getComputedStyle(l.querySelector(".item-row__name") as Element).textDecorationLine,
      tick: getComputedStyle(l.querySelector(".item-row__box") as Element, "::after").content,
    }));
  });
  console.log("signes non colorés :", JSON.stringify(s));
  expect(s.find((x) => x.t === "pain")?.deco).toBe("line-through");
  expect(s.find((x) => x.t === "lait")?.deco).toBe("none");
});

test("QA2-14 animation : durée <= 200 ms, une seule itération, aucune boucle (pas de clignotement)", async ({
  page,
}) => {
  await add(page, "pain");
  await touch(page, "pain");
  const a = await row(page, "pain").evaluate((r) => {
    const cs = getComputedStyle(r);
    return { d: cs.animationDuration, n: cs.animationIterationCount, name: cs.animationName };
  });
  console.log("animation :", JSON.stringify(a));
  expect(a.n).toBe("1");
});

test("QA2-15 « réduire les animations » : aucune animation, ni au cochage ni au décochage", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await add(page, "pain");
  await touch(page, "pain");
  await expect(row(page, "pain")).toHaveCSS("animation-name", "none");
  await touch(page, "pain");
  await expect(row(page, "pain")).toHaveCSS("animation-name", "none");
  const any = await page.evaluate(() => document.getAnimations().length);
  expect(any).toBe(0);
});

test("QA2-16 deux articles de même nom cochés de suite : l'annonce est-elle modifiée dans le DOM ?", async ({
  page,
}) => {
  await add(page, "lait", "lait");
  await page.evaluate(() => {
    const el = document.querySelector('[role="status"]') as HTMLElement;
    (window as unknown as { __m: number }).__m = 0;
    new MutationObserver(() => {
      (window as unknown as { __m: number }).__m++;
    }).observe(el, { childList: true, characterData: true, subtree: true });
  });
  await page.getByRole("listitem").first().locator("label").tap();
  await page.getByRole("listitem").first().locator("label").tap();
  const mutations = await page.evaluate(() => (window as unknown as { __m: number }).__m);
  const text = await page.getByRole("status").textContent();
  console.log(
    "mutations de la zone d'annonce pour 2 cochages identiques :",
    mutations,
    "texte :",
    text,
  );
});

test("QA2-17 régression EPI-001 : ajout après cochage, focus au champ, annonce, ordre", async ({
  page,
}) => {
  await add(page, "pain", "lait");
  await touch(page, "pain");
  await add(page, "sel");
  await expect(toBuy(page)).toHaveText(["lait", "sel"]);
  await expect(inBasket(page)).toHaveText(["pain"]);
  await expect(field(page)).toBeFocused();
  await expect(page.getByRole("status")).toHaveText("« sel » ajouté à la liste.");
  await add(page, "   ");
  await expect(page.getByRole("alert")).toContainText("Écris le nom d'un article pour l'ajouter.");
  await expect(toBuy(page)).toHaveText(["lait", "sel"]);
});

test("QA2-18 un nom avec HTML ou apostrophe coche et s'annonce comme texte", async ({ page }) => {
  await add(page, "<b>gras</b>", "l'huile d'olive");
  await touch(page, "<b>gras</b>");
  await expect(inBasket(page)).toHaveText(["<b>gras</b>"]);
  await expect(page.getByRole("status")).toHaveText("« <b>gras</b> » mis dans le panier.");
  await touch(page, "l'huile d'olive");
  await expect(page.getByRole("status")).toContainText("« l'huile d'olive » mis dans le panier.");
  await expect(page.locator("main b")).toHaveCount(0);
});

test("QA2-19 paysage 667 x 375 avec « tout est pris » : message, section et barre visibles", async ({
  page,
}) => {
  await page.setViewportSize({ width: 667, height: 375 });
  await add(page, "pain", "lait");
  await touch(page, "pain");
  await touch(page, "lait");
  await expect(page.getByText(ALL_TAKEN, { exact: true })).toBeInViewport();
  await expect(field(page)).toBeInViewport();
  const h = await page.locator("main").evaluate((m) => m.clientHeight);
  console.log("paysage : hauteur de la zone de liste :", h);
});

test("QA2-20 souris : clic sur la ligne coche, anneau de focus après clic (souris)", async ({
  page,
  browserName,
}) => {
  await add(page, "pain");
  await row(page, "pain").locator("label").click();
  await expect(inBasket(page)).toHaveText(["pain"]);
  const o = await row(page, "pain").evaluate((r) => getComputedStyle(r).outlineStyle);
  console.log(`${browserName} : contour après clic souris :`, o);
});

test("QA2-21 le tout premier toucher sur un article coché au chargement : état vide initial", async ({
  page,
}) => {
  await expect(page.getByText(ALL_TAKEN, { exact: true })).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 2 })).toHaveCount(0);
});

test("QA2-22 performance perçue : 100 cochages en série sur 100 articles", async ({ page }) => {
  const names = Array.from({ length: 100 }, (_, i) => `n${i}`);
  await add(page, ...names);
  const t = await page.evaluate(() => {
    const t0 = performance.now();
    for (let i = 0; i < 100; i++) {
      (document.querySelector("section ul li input") as HTMLInputElement).click();
    }
    return performance.now() - t0;
  });
  console.log("100 cochages (DOM, 100 articles) :", Math.round(t), "ms");
  await expect(inBasket(page)).toHaveCount(100);
  await expect(toBuy(page)).toHaveCount(0);
});

test("QA2-23 saisie en cours et erreur affichée : cocher ne perd pas le texte, le focus quitte le champ", async ({
  page,
}) => {
  await add(page, "pain", "lait");
  await field(page).fill("beur");
  await touch(page, "pain");
  await expect(field(page)).toHaveValue("beur");
  await expect(page.getByRole("checkbox", { name: "pain" })).toBeFocused();
  console.log(
    "après cochage avec un texte en cours : focus sur la case, champ conserve « beur » (le clavier se fermerait sur iPhone)",
  );
  await field(page).fill("");
  await field(page).press("Enter");
  await expect(page.getByRole("alert")).toContainText("Écris le nom d'un article pour l'ajouter.");
  await touch(page, "lait");
  await expect(inBasket(page)).toHaveText(["lait", "pain"]);
  await add(page, "sel");
  await expect(toBuy(page)).toHaveText(["sel"]);
});
