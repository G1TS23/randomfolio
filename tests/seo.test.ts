// Le nom de site affiché par Google dépend entièrement du bloc JSON-LD
// `WebSite` : sans `name` ni `url`, Google retombe silencieusement sur le
// domaine brut. Comme pour les favicons, la panne est invisible depuis le
// navigateur — on la verrouille ici.
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const layout = readFileSync(
  fileURLToPath(new URL("../src/layouts/Layout.astro", import.meta.url)),
  "utf8",
);

// Les objets JSON-LD sont construits dans le frontmatter puis sérialisés au
// rendu : on lit donc la source plutôt que le HTML, ce qui évite de dépendre
// d'un build préalable.
const frontmatter = layout.slice(0, layout.indexOf("\n---"));

describe("données structurées", () => {
  it("déclare un bloc WebSite avec un nom et une URL", () => {
    expect(frontmatter).toMatch(/"@type":\s*"WebSite"/);
    expect(frontmatter).toMatch(/const siteName = "[^"]+"/);
    // `url` doit viser la racine du domaine : Google ignore le balisage
    // WebSite posé sur une sous-page.
    expect(frontmatter).toMatch(/const home = new URL\("\/", Astro\.site\)/);
  });

  it("réutilise le même nom pour og:site_name", () => {
    // Signal secondaire selon Google, mais deux valeurs divergentes
    // s'annuleraient plutôt que de se renforcer.
    expect(layout).toMatch(
      /<meta property="og:site_name" content=\{siteName\} \/>/,
    );
  });

  it("garde les deux blocs JSON-LD injectés dans le head", () => {
    const blocks = layout.match(/type="application\/ld\+json"/g) ?? [];
    expect(blocks.length).toBe(2);
    expect(layout).toMatch(/set:html=\{JSON\.stringify\(jsonLd\)\}/);
    expect(layout).toMatch(/set:html=\{JSON\.stringify\(jsonLdSite\)\}/);
  });
});
