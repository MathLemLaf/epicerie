import { defineConfig, devices } from "@playwright/test";

const PREVIEW_URL = "http://localhost:4173";

// Les tests de bout en bout tournent sur la version construite (npm run build),
// la seule où le service worker hors ligne est actif.
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL: PREVIEW_URL,
    locale: "fr-CA",
    trace: "on-first-retry",
  },
  projects: [
    // Le hors ligne (service worker + mode avion simulé) n'est automatisable
    // de façon fiable que sur Chromium : ce projet porte les tests EPI-004.
    { name: "android-chrome", use: { ...devices["Pixel 7"] } },
    // Moteur de Safari, pour l'affichage et les parcours sur iPhone.
    { name: "iphone-safari", use: { ...devices["iPhone 15"] }, grepInvert: /@chromium-seulement/ },
  ],
  webServer: {
    command: "npm run build && npm run preview -- --port 4173 --strictPort",
    url: PREVIEW_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
