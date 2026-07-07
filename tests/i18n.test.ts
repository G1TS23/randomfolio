import { describe, it, expect } from "vitest";
import fr from "../src/data/portfolio.json";
import en from "../src/data/portfolio.en.json";
import uiRaw from "../src/data/ui.json";
import lockRaw from "./i18n.lock.json";
import { flattenStrings, buildI18nDict, type Dict } from "../src/lib/i18n";

const ui = uiRaw as Dict;
const lock = lockRaw as Dict;

describe("i18n — parité des clés (aucune manquante)", () => {
  it("chaque libellé UI a fr et en, non vides", () => {
    for (const [key, val] of Object.entries(ui)) {
      expect(typeof val.fr, `${key}.fr`).toBe("string");
      expect(typeof val.en, `${key}.en`).toBe("string");
      expect(val.fr.trim().length, `${key}.fr est vide`).toBeGreaterThan(0);
      expect(val.en.trim().length, `${key}.en est vide`).toBeGreaterThan(0);
    }
  });

  it("portfolio.json et portfolio.en.json ont exactement les mêmes chemins", () => {
    const frKeys = Object.keys(flattenStrings(fr));
    const enKeys = Object.keys(flattenStrings(en));
    const missingInEn = frKeys.filter((k) => !enKeys.includes(k));
    const missingInFr = enKeys.filter((k) => !frKeys.includes(k));
    expect(missingInEn, "chemins absents de portfolio.en.json").toEqual([]);
    expect(missingInFr, "chemins absents de portfolio.json").toEqual([]);
  });
});

describe("i18n — synchronisation fr/en (lock)", () => {
  // Le lock (tests/i18n.lock.json) est l'instantané de référence. Toute
  // traduction modifiée d'un seul côté (FR sans EN, ou l'inverse) est signalée.
  // Après avoir mis à jour FR ET EN, régénérer : `npm run i18n:lock`.
  it("aucune traduction changée d'un seul côté, et lock à jour", () => {
    const dict = buildI18nDict(fr, en, ui);
    const problems: string[] = [];

    for (const key of Object.keys(dict)) {
      const cur = dict[key];
      const old = lock[key];
      if (!cur) continue;
      if (!old) {
        problems.push(`+ nouvelle clé « ${key} » (absente du lock)`);
        continue;
      }
      const frChanged = cur.fr !== old.fr;
      const enChanged = cur.en !== old.en;
      if (frChanged && !enChanged) {
        problems.push(
          `⚠ « ${key} » : FR modifié mais EN inchangé → traduis aussi l'EN`,
        );
      } else if (enChanged && !frChanged) {
        problems.push(
          `⚠ « ${key} » : EN modifié mais FR inchangé → mets à jour le FR`,
        );
      } else if (frChanged && enChanged) {
        problems.push(`~ « ${key} » : FR et EN modifiés`);
      }
    }
    for (const key of Object.keys(lock)) {
      if (!(key in dict)) problems.push(`- clé « ${key} » retirée`);
    }

    const hint = problems.length
      ? `\n${problems.join("\n")}\n\n→ Revois FR ET EN, puis régénère le lock : npm run i18n:lock\n`
      : "";
    expect(problems, hint).toEqual([]);
  });
});
