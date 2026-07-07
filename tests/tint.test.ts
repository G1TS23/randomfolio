import { describe, it, expect } from "vitest";
import { encodeTint, parseTint } from "../src/lib/tint";

describe("encodeTint", () => {
  it("sérialise hue et sat", () => {
    expect(encodeTint({ hue: -24, sat: 1.05 })).toBe("-24_1.05");
    expect(encodeTint({ hue: 44, sat: 1.23 })).toBe("44_1.23");
    expect(encodeTint({ hue: 0, sat: 1 })).toBe("0_1");
  });
  it("renvoie une chaîne vide pour null/undefined", () => {
    expect(encodeTint(null)).toBe("");
    expect(encodeTint(undefined)).toBe("");
  });
});

describe("parseTint", () => {
  it("lit une valeur valide", () => {
    expect(parseTint("-24_1.05")).toEqual({ hue: -24, sat: 1.05 });
    expect(parseTint("44_1.23")).toEqual({ hue: 44, sat: 1.23 });
    expect(parseTint("0_1")).toEqual({ hue: 0, sat: 1 });
  });

  it("fait un aller-retour avec encodeTint", () => {
    for (const t of [
      { hue: -33, sat: 0.9 },
      { hue: 12, sat: 1.5 },
      { hue: 180, sat: 2 },
      { hue: -180, sat: 0.3 },
    ]) {
      expect(parseTint(encodeTint(t))).toEqual(t);
    }
  });

  it("rejette les entrées mal formées", () => {
    for (const bad of [
      "",
      null,
      undefined,
      "abc",
      "44",
      "44_",
      "_1.2",
      "44-1.2",
      "44_1.234", // trop de décimales
      "44 _1.2",
    ]) {
      expect(parseTint(bad)).toBeNull();
    }
  });

  it("rejette les valeurs hors bornes", () => {
    expect(parseTint("200_1")).toBeNull(); // hue > 180
    expect(parseTint("-181_1")).toBeNull(); // hue < -180
    expect(parseTint("10_0.2")).toBeNull(); // sat < 0.3
    expect(parseTint("10_2.5")).toBeNull(); // sat > 2
  });
});
