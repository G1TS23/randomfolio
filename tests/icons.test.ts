// Une favicon cassée est silencieuse : le navigateur retombe sur une icône
// par défaut sans rien signaler, et Google affiche un globe générique pendant
// des semaines avant qu'on le remarque. Ces tests verrouillent les deux pièges
// déjà rencontrés — un data: URI (non crawlable par Googlebot-Image) et un
// href pointant vers un fichier absent de public/.
import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const layout = readFileSync(
  fileURLToPath(new URL("../src/layouts/Layout.astro", import.meta.url)),
  "utf8",
);
const publicDir = fileURLToPath(new URL("../public/", import.meta.url));

// rel="icon", "shortcut icon", "apple-touch-icon"… : les valeurs que Google
// prend en compte (developers.google.com/search/docs/appearance/favicon-in-search).
const icons = [
  ...layout.matchAll(/<link\s+rel="([^"]*icon[^"]*)"\s+href="([^"]+)"/g),
].map(([, rel, href]) => ({ rel, href }));

describe("favicons", () => {
  it("déclare au moins une icône", () => {
    expect(icons.length).toBeGreaterThan(0);
  });

  it("n'utilise pas de data: URI", () => {
    // Googlebot-Image doit pouvoir crawler un *fichier* : un data: URI n'expose
    // aucune URL, et Google se rabat sur une icône générique.
    for (const { rel, href } of icons) {
      expect(href.startsWith("data:"), `${rel} → ${href}`).toBe(false);
    }
  });

  it("pointe vers des fichiers présents dans public/", () => {
    for (const { rel, href } of icons) {
      expect(href.startsWith("/"), `${rel} → ${href}`).toBe(true);
      expect(existsSync(publicDir + href.slice(1)), `${rel} → ${href}`).toBe(
        true,
      );
    }
  });

  it("a un favicon.svg carré", () => {
    // Google exige un ratio 1:1 ; c'est aussi la source de `npm run favicon`,
    // donc un viewBox non carré déformerait tous les PNG générés.
    const svg = readFileSync(publicDir + "favicon.svg", "utf8");
    const viewBox = svg.match(/viewBox="0 0 (\d+) (\d+)"/);
    expect(viewBox, "viewBox absent ou non normalisé").not.toBeNull();
    expect(viewBox![1]).toBe(viewBox![2]);
  });
});
