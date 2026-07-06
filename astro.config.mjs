// @ts-check
import { defineConfig } from 'astro/config';

// Site 100% statique : les 3 univers sont pré-rendus, le tirage se fait
// côté client (voir src/layouts/Layout.astro). Hébergeable partout.
export default defineConfig({
  // Renseigne ton URL de prod ici pour le partage / sitemap :
  // site: 'https://ton-domaine.com',
});
