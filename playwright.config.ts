import { defineConfig } from "@playwright/test";

// Audit d'accessibilité (axe-core) des 11 univers sur un build de production.
// Lancé en CI par le job « a11y » ; en local : `npm run test:a11y`.
export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  fullyParallel: true,
  reporter: "list",
  // build + preview automatiques ; réutilise un serveur déjà lancé en local
  webServer: {
    command: "npm run build && npm run preview -- --port 4331",
    url: "http://localhost:4331",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  use: { baseURL: "http://localhost:4331", browserName: "chromium" },
});
