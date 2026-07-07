// Encodage / décodage de la teinte pour l'URL de partage.
// Format compact : « <hue>_<sat> » (ex. « -24_1.05 »), borné et validé.
export interface Tint {
  hue: number; // rotation de teinte en degrés
  sat: number; // facteur de saturation
}

export function encodeTint(t: Tint | null | undefined): string {
  return t ? `${t.hue}_${t.sat}` : "";
}

export function parseTint(s: string | null | undefined): Tint | null {
  const m = /^(-?\d{1,3})_(\d(?:\.\d{1,2})?)$/.exec(s || "");
  if (!m) return null;
  const hue = Number.parseInt(m[1], 10);
  const sat = Number.parseFloat(m[2]);
  if (hue < -180 || hue > 180 || sat < 0.3 || sat > 2) return null;
  return { hue, sat };
}
