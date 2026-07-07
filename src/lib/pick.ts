// Sélection « anti-répétition » des univers.
//
// Renvoie un univers pas encore vu dans le cycle courant (donc on les parcourt
// tous avant qu'un seul ne revienne), en évitant `avoid` (l'univers actuel) —
// donc jamais deux fois d'affilée, y compris à la bascule de cycle.
//
// Fonction PURE : `seen` (état du cycle) et `last` (dernier affiché) sont
// fournis par l'appelant, qui persiste le `seen` retourné (localStorage).
//
// ⚠️ Le script anti-flash du <head> (Layout.astro, is:inline, non bundlé)
// contient une copie de cet algorithme — garder les deux en phase.
export interface PickResult {
  chosen: string;
  seen: string[];
}

export function pickNext(
  ids: string[],
  seen: readonly string[] | null | undefined,
  last: string | null | undefined,
  avoid: string | null | undefined,
): PickResult {
  let s = Array.isArray(seen) ? seen.filter((id) => ids.includes(id)) : [];
  let pool = ids.filter((id) => !s.includes(id) && id !== avoid);
  if (pool.length === 0) {
    // cycle terminé → on repart, en évitant seulement le dernier affiché
    s = [];
    const skip = avoid ?? last;
    pool = ids.filter((id) => id !== skip);
    if (pool.length === 0) pool = ids.slice();
  }
  const chosen = pool[Math.floor(Math.random() * pool.length)];
  return { chosen, seen: [...s, chosen] };
}
