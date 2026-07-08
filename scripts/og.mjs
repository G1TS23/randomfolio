// Régénère public/og.png (image Open Graph, 1200×630) à partir du contenu réel.
// Lance : `npm run og`. Nécessite le navigateur Playwright (déjà en devDep) :
//   npx playwright install chromium
//
// Volontairement générique (ni nombre ni noms d'univers) → pas besoin de la
// régénérer en ajoutant/retirant un univers. Nom et tagline lus dans
// portfolio.json ; à relancer si l'un des deux change.
import { chromium } from "@playwright/test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const portfolio = JSON.parse(
  readFileSync(join(root, "src/data/portfolio.json"), "utf8"),
);

const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
<style>
  * { margin: 0; box-sizing: border-box; }
  body { font-family: "Inter", sans-serif; }
  .card {
    width: 1200px; height: 630px; padding: 72px 80px; overflow: hidden;
    color: #fff; position: relative; display: flex; flex-direction: column;
    justify-content: space-between;
    background:
      radial-gradient(60% 80% at 0% 0%, rgba(35, 213, 200, 0.16), transparent 60%),
      radial-gradient(75% 95% at 100% 100%, rgba(150, 60, 200, 0.22), transparent 55%),
      #0a0b16;
  }
  .dots { position: absolute; inset: 0; pointer-events: none; opacity: 0.5;
    background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1.5px);
    background-size: 14px 14px; }
  .top { display: flex; align-items: center; gap: 16px; position: relative; }
  .dice { font-size: 40px; }
  .kicker { font-size: 26px; letter-spacing: 0.28em; text-transform: uppercase;
    color: #8a8fb0; font-weight: 600; }
  .main { position: relative; }
  .name { font-family: "Space Grotesk", sans-serif; font-weight: 700;
    font-size: 112px; line-height: 1; letter-spacing: -0.03em; }
  .name .dot { color: #e2231a; }
  .tagline { font-size: 40px; color: #c8cce0; margin-top: 28px; max-width: 22ch;
    line-height: 1.15; font-weight: 500; }
  .foot { display: flex; justify-content: space-between; align-items: baseline;
    position: relative; }
  .url { font-size: 30px; font-weight: 600; }
  .meta { font-size: 26px; color: #8a8fb0; }
</style></head>
<body><div class="card">
  <div class="dots"></div>
  <div class="top"><span class="dice">🎲</span><span class="kicker">Portfolio aléatoire</span></div>
  <div class="main">
    <div class="name">${portfolio.name}<span class="dot">.</span></div>
    <div class="tagline">${portfolio.tagline}</div>
  </div>
  <div class="foot">
    <span class="url">olivier.falahi.org</span>
    <span class="meta">réinventé à chaque visite</span>
  </div>
</div></body></html>`;

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
const page = await ctx.newPage();
await page.setContent(html, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: join(root, "public/og.png") });
await browser.close();
console.log("og.png régénéré.");
