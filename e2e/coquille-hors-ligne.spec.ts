import { expect, test } from "@playwright/test";

// Test du squelette (ADR 0004) : après une première visite en ligne,
// l'app s'ouvre en mode avion. Les scénarios EPI-004 complets viendront avec la story.
test("l'app s'ouvre sans réseau après une première visite @chromium-seulement", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });

  await context.setOffline(true);
  await page.reload();

  await expect(page.getByRole("heading", { name: "Ma liste d'épicerie" })).toBeVisible();
});

test("l'app affiche son titre", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Ma liste d'épicerie");
});
