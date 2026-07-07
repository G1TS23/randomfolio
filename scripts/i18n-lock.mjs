// Régénère tests/i18n.lock.json = instantané {clé: {fr, en}} du dictionnaire i18n.
//
// Le lock sert de référence : le test tests/i18n.test.ts compare le dictionnaire
// courant au lock pour repérer une traduction modifiée d'un seul côté (FR sans
// EN, ou l'inverse). Après avoir mis à jour FR **et** EN, lance `npm run i18n:lock`.
//
// La logique ci-dessous est une copie JS de src/lib/i18n.ts (le script tourne en
// node pur, sans TS) — garder les deux en phase.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => JSON.parse(readFileSync(join(root, p), "utf8"));

function flattenStrings(value, prefix = "", out = {}) {
  if (typeof value === "string") {
    out[prefix] = value;
  } else if (Array.isArray(value)) {
    value.forEach((v, i) =>
      flattenStrings(v, prefix ? `${prefix}.${i}` : String(i), out),
    );
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      flattenStrings(v, prefix ? `${prefix}.${k}` : k, out);
    }
  }
  return out;
}

function buildI18nDict(frContent, enContent, ui) {
  const frFlat = flattenStrings(frContent);
  const enFlat = flattenStrings(enContent);
  const dict = {};
  for (const [key, fr] of Object.entries(frFlat)) {
    const en = enFlat[key];
    if (en != null && en !== fr) dict[key] = { fr, en };
  }
  return { ...dict, ...ui };
}

const dict = buildI18nDict(
  read("src/data/portfolio.json"),
  read("src/data/portfolio.en.json"),
  read("src/data/ui.json"),
);
// tri des clés → diff git stable
const sorted = {};
for (const key of Object.keys(dict).sort()) sorted[key] = dict[key];
writeFileSync(
  join(root, "tests/i18n.lock.json"),
  JSON.stringify(sorted, null, 2) + "\n",
);
console.log(`i18n.lock.json écrit : ${Object.keys(sorted).length} clés.`);
