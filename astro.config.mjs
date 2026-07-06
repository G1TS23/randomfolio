// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Site 100% statique : les 6 univers sont pré-rendus, le tirage se fait
// côté client (voir src/layouts/Layout.astro). Hébergeable partout.
export default defineConfig({
  // URL de prod : sert au canonical, à l'OG et au sitemap.
  site: "https://randomfolio.netlify.app",
  integrations: [sitemap()],
});
