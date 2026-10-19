import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vitest/config";

// Voir docs/decisions/0004-fonctionnement-hors-ligne.md :
// le service worker met en cache toute l'app au premier chargement,
// puis l'app s'ouvre sans réseau.
// Voir docs/decisions/0007-application-des-mises-a-jour.md : mode "prompt" sans bouton,
// la nouvelle version attend la fermeture complète de l'app, l'écran n'est jamais rechargé.
export default defineConfig({
  plugins: [
    VitePWA({
      registerType: "prompt",
      includeAssets: ["icon.svg"],
      manifest: {
        name: "Ma liste d'épicerie",
        short_name: "Épicerie",
        description: "Ma liste d'épicerie, même sans réseau.",
        lang: "fr-CA",
        start_url: ".",
        scope: ".",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        // Icône provisoire : les PNG 192 et 512 px (et l'icône iPhone)
        // viendront avec l'identité visuelle de Jean-François.
        icons: [{ src: "icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
      },
      workbox: {
        globPatterns: ["**/*.{html,js,css,svg,png,ico,webmanifest}"],
      },
    }),
  ],
  test: {
    include: ["src/**/*.test.ts"],
    environment: "happy-dom",
    // Squelette : aucun test unitaire tant que la première story n'est pas commencée.
    passWithNoTests: true,
  },
});
