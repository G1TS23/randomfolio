// Régénère les favicons de public/ à partir de public/favicon.svg (source unique).
// Lance : `npm run favicon`. Nécessite le navigateur Playwright (déjà en devDep) :
//   npx playwright install chromium
//
// Pourquoi des fichiers plutôt qu'un data: URI : Googlebot-Image doit pouvoir
// crawler le fichier pour afficher l'icône dans les résultats de recherche
// (https://developers.google.com/search/docs/appearance/favicon-in-search).
// Un data: URI n'expose aucune URL à crawler → Google affiche un globe générique.
import { chromium } from "@playwright/test";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const svg = readFileSync(join(root, "public/favicon.svg"), "utf8");

// iOS compose l'apple-touch-icon sur un fond opaque et applique son propre
// masque : on lui sert donc une version à bords carrés, sans transparence.
const squared = svg.replace('rx="12"', 'rx="0"');

const page = async (ctx, source, size) => {
  const p = await ctx.newPage();
  await p.setViewportSize({ width: size, height: size });
  await p.setContent(
    `<style>html,body{margin:0;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>${source}`,
    { waitUntil: "load" },
  );
  return p;
};

const browser = await chromium.launch();
const ctx = await browser.newContext({ deviceScaleFactor: 1 });

// PNG carrés déclarés dans le <head> : Google recommande > 48×48.
for (const size of [192, 512]) {
  const p = await page(ctx, svg, size);
  await p.screenshot({
    path: join(root, `public/icon-${size}.png`),
    omitBackground: true,
  });
  await p.close();
}

const apple = await page(ctx, squared, 180);
await apple.screenshot({ path: join(root, "public/apple-touch-icon.png") });
await apple.close();

// favicon.ico multi-tailles : c'est l'URL que navigateurs et crawlers tentent
// d'office, même sans déclaration dans le HTML.
const sizes = [16, 32, 48];
const pngs = [];
for (const size of sizes) {
  const p = await page(ctx, svg, size);
  pngs.push(await p.screenshot({ omitBackground: true }));
  await p.close();
}
await browser.close();

// Format ICO : en-tête ICONDIR (6 o) + une entrée ICONDIRENTRY par taille
// (16 o), puis les images. Le PNG est accepté tel quel comme charge utile.
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // réservé
header.writeUInt16LE(1, 2); // type : 1 = icône
header.writeUInt16LE(sizes.length, 4);

let offset = 6 + 16 * sizes.length;
const entries = sizes.map((size, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(size, 0); // largeur (0 signifierait 256)
  e.writeUInt8(size, 1); // hauteur
  e.writeUInt8(0, 2); // palette : 0 = sans
  e.writeUInt8(0, 3); // réservé
  e.writeUInt16LE(1, 4); // plans
  e.writeUInt16LE(32, 6); // bits par pixel
  e.writeUInt32LE(pngs[i].length, 8);
  e.writeUInt32LE(offset, 12);
  offset += pngs[i].length;
  return e;
});

writeFileSync(
  join(root, "public/favicon.ico"),
  Buffer.concat([header, ...entries, ...pngs]),
);

console.log(
  "favicons régénérées : favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png",
);
