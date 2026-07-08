import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { UNIVERSE_IDS } from "../src/universes";

// Pour chaque univers : on saute l'écran d'accueil, on attend la révélation
// (loader levé), puis axe ne doit relever aucune violation.
for (const id of UNIVERSE_IDS) {
  test(`accessibilité — ${id}`, async ({ page }) => {
    await page.addInitScript(() => {
      try {
        localStorage.setItem("rf.arrived.session", "1");
      } catch {
        /* stockage indisponible */
      }
    });
    await page.goto(`/?u=${id}`);
    const loader = page.locator(".genloader");
    await loader.waitFor({ state: "visible", timeout: 5_000 }).catch(() => {});
    await loader.waitFor({ state: "hidden", timeout: 15_000 });

    const { violations } = await new AxeBuilder({ page }).analyze();
    expect(violations.map((v) => `${v.id} (${v.nodes.length} nœuds)`)).toEqual(
      [],
    );
  });
}
