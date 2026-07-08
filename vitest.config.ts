import { defineConfig } from "vitest/config";

// Vitest ne prend que les tests unitaires de tests/ ; les specs Playwright
// (e2e/*.spec.ts) sont gérées par @playwright/test, pas par Vitest.
export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
  },
});
