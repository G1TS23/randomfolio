// Registre des univers.
//
// Pour AJOUTER un univers :
//   1. crée src/universes/MonUniverse.astro (copie un existant comme patron)
//   2. ajoute une entrée ci-dessous
//   3. importe et rends-le dans src/pages/index.astro
//
// L'`id` doit être unique, stable et URL-safe : il sert de graine partageable
// (?u=<id>) et de sélecteur CSS. Ne le renomme pas une fois publié.
export interface UniverseMeta {
  id: string;
  name: string;
}

export const UNIVERSES: UniverseMeta[] = [
  { id: 'swiss', name: 'Swiss' },
  { id: 'terminal', name: 'Terminal' },
  { id: 'y2k', name: 'Y2K' },
  { id: 'editorial', name: 'Editorial' },
  { id: 'blueprint', name: 'Blueprint' },
  { id: 'riso', name: 'Riso' },
];

export const UNIVERSE_IDS = UNIVERSES.map((u) => u.id);
