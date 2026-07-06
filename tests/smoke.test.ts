import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

import portfolio from "../src/data/portfolio.json";
import { UNIVERSES, UNIVERSE_IDS } from "../src/universes/index";

describe("portfolio.json", () => {
  it("expose les champs requis", () => {
    for (const field of [
      "name",
      "role",
      "tagline",
      "email",
      "about",
    ] as const) {
      expect(typeof portfolio[field], field).toBe("string");
      expect(portfolio[field].length, field).toBeGreaterThan(0);
    }
    expect(portfolio.email).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
  });

  it("a au moins un projet, chacun bien formé", () => {
    expect(portfolio.projects.length).toBeGreaterThan(0);
    for (const p of portfolio.projects) {
      expect(p.title?.length, "title").toBeGreaterThan(0);
      expect(p.description?.length, "description").toBeGreaterThan(0);
      expect(
        Array.isArray(p.tags) && p.tags.length,
        `tags de ${p.title}`,
      ).toBeTruthy();
      expect(typeof p.url, `url de ${p.title}`).toBe("string");
    }
  });

  it("a des réseaux avec des URL absolues", () => {
    expect(portfolio.socials.length).toBeGreaterThan(0);
    for (const s of portfolio.socials) {
      expect(s.label?.length, "label").toBeGreaterThan(0);
      expect(s.url, `url de ${s.label}`).toMatch(/^https?:\/\//);
    }
  });

  it("a au moins une compétence", () => {
    expect(portfolio.skills.length).toBeGreaterThan(0);
  });
});

describe("registre des univers", () => {
  it("a des identifiants uniques, url-safe et nommés", () => {
    expect(UNIVERSES.length).toBeGreaterThan(0);
    expect(new Set(UNIVERSE_IDS).size).toBe(UNIVERSE_IDS.length);
    for (const u of UNIVERSES) {
      expect(u.id).toMatch(/^[a-z0-9-]+$/);
      expect(u.name.length, `nom de ${u.id}`).toBeGreaterThan(0);
    }
  });

  it("correspond exactement aux composants d'univers présents", () => {
    const dir = fileURLToPath(new URL("../src/universes/", import.meta.url));
    const rendered = new Set<string>();
    for (const file of readdirSync(dir)) {
      if (!file.endsWith(".astro")) continue;
      const src = readFileSync(
        new URL(file, new URL("../src/universes/", import.meta.url)),
        "utf8",
      );
      const match = src.match(/data-universe-id="([a-z0-9-]+)"/);
      if (match) rendered.add(match[1]);
    }
    // Tout univers du registre a un composant, et inversement — pas d'orphelin.
    expect([...rendered].sort()).toEqual([...UNIVERSE_IDS].sort());
  });
});
