import { describe, it, expect } from "vitest";
import { pickNext } from "../src/lib/pick";

const IDS = ["a", "b", "c", "d", "e"];

describe("pickNext", () => {
  it("choisit un id valide et fait grandir le cycle", () => {
    const r = pickNext(IDS, [], null, null);
    expect(IDS).toContain(r.chosen);
    expect(r.seen).toEqual([r.chosen]);
  });

  it("évite `avoid`", () => {
    for (let i = 0; i < 200; i++) {
      expect(pickNext(IDS, [], null, "c").chosen).not.toBe("c");
    }
  });

  it("parcourt tous les univers avant qu'un ne revienne, jamais deux d'affilée", () => {
    for (let trial = 0; trial < 40; trial++) {
      let seen: string[] = [];
      let last: string | null = null;
      const seq: string[] = [];
      for (let i = 0; i < 15; i++) {
        const r = pickNext(IDS, seen, last, last);
        seq.push(r.chosen);
        seen = r.seen;
        last = r.chosen;
      }
      // jamais deux fois de suite
      for (let i = 1; i < seq.length; i++) {
        expect(seq[i]).not.toBe(seq[i - 1]);
      }
      // chaque cycle de 5 est une permutation complète des univers
      for (let c = 0; c < 3; c++) {
        const chunk = seq.slice(c * IDS.length, (c + 1) * IDS.length);
        expect(new Set(chunk).size).toBe(IDS.length);
        expect([...chunk].sort()).toEqual([...IDS].sort());
      }
    }
  });

  it("réinitialise le cycle quand tout a été vu (et évite le dernier)", () => {
    const ids = ["a", "b", "c"];
    const r1 = pickNext(ids, [], null, null);
    const r2 = pickNext(ids, r1.seen, r1.chosen, r1.chosen);
    const r3 = pickNext(ids, r2.seen, r2.chosen, r2.chosen);
    expect(r3.seen.length).toBe(3);
    const r4 = pickNext(ids, r3.seen, r3.chosen, r3.chosen);
    expect(r4.seen.length).toBe(1); // nouveau cycle
    expect(r4.chosen).not.toBe(r3.chosen); // pas de répétition à la bascule
  });

  it("ignore les ids inconnus présents dans `seen`", () => {
    const ids = ["a", "b", "c"];
    // seen contient x,y (inconnus) + a → seen effectif = [a], pool = [b,c]
    for (let i = 0; i < 50; i++) {
      const r = pickNext(ids, ["x", "y", "a"], null, null);
      expect(["b", "c"]).toContain(r.chosen);
    }
  });

  it("gère un seul univers sans planter", () => {
    expect(pickNext(["a"], [], null, null).chosen).toBe("a");
    expect(pickNext(["a"], [], null, "a").chosen).toBe("a");
  });

  it("traite `seen` absent (null) comme un cycle vierge", () => {
    const r = pickNext(IDS, null, null, null);
    expect(IDS).toContain(r.chosen);
    expect(r.seen).toEqual([r.chosen]);
  });

  it("à la bascule sans `avoid`, évite quand même le dernier affiché", () => {
    const ids = ["a", "b"];
    // tout est vu → cycle réinitialisé ; avoid=null donc on retombe sur `last`
    for (let i = 0; i < 50; i++) {
      expect(pickNext(ids, ["a", "b"], "b", null).chosen).toBe("a");
    }
  });
});
