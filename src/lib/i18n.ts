// Construction du dictionnaire i18n {clé: {fr, en}} pour la bascule de langue.
//
// Le contenu (portfolio.json = FR, portfolio.en.json = EN) est aplati
// récursivement : on ne garde que les chaînes qui DIFFÈRENT entre les deux (le
// reste — nom, e-mail, URLs — n'a pas besoin de traduction). On y ajoute les
// libellés d'interface (ui.json). Le Layout injecte ce dictionnaire côté client ;
// chaque texte traduisible porte data-i18n="<clé>".
//
// Ce module est aussi utilisé par les tests (parité + synchronisation fr/en) et
// par le générateur de lock (scripts/i18n-lock.mjs, qui en est une copie JS).

export interface Pair {
  fr: string;
  en: string;
}
export type Dict = Record<string, Pair>;
type Flat = Record<string, string>;

/** Aplatit un objet en { "chemin.pointé": valeur } pour chaque feuille chaîne. */
export function flattenStrings(
  value: unknown,
  prefix = "",
  out: Flat = {},
): Flat {
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

/** Contenu traduit (chaînes qui diffèrent) + libellés d'interface. */
export function buildI18nDict(
  frContent: unknown,
  enContent: unknown,
  ui: Dict,
): Dict {
  const frFlat = flattenStrings(frContent);
  const enFlat = flattenStrings(enContent);
  const dict: Dict = {};
  for (const [key, fr] of Object.entries(frFlat)) {
    const en = enFlat[key];
    if (en != null && en !== fr) dict[key] = { fr, en };
  }
  return { ...dict, ...ui };
}
