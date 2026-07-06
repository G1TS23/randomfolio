# Portfolio aléatoire 🎲

Un portfolio qui se réinvente à chaque visite : le contenu est unique, mais
chaque visiteur tombe sur un **univers de design** complet et cohérent, tiré au
sort. Trois univers pour démarrer : **Swiss**, **Terminal**, **Y2K**.

## Démarrer

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # génère un site statique dans dist/
```

## Comment ça marche

- **Un seul contenu** → `src/data/portfolio.json`. Remplis-le, c'est tout ce que
  tu as à toucher au quotidien.
- **Un univers = un design complet et autonome** → `src/universes/*.astro`.
  Chacun reçoit exactement les mêmes données et décide seul de tout son visuel.
  On ne mélange jamais des morceaux entre univers → jamais de rendu incohérent.
- **Le tirage se fait côté client**, dans `src/layouts/Layout.astro` : un petit
  script dans le `<head>` choisit un univers avant le premier rendu (aucun
  clignotement). Le site reste donc **100 % statique** et hébergeable partout
  (Netlify, Vercel, GitHub Pages…). Sans JS, l'univers par défaut s'affiche.

## Partage & seed

Chaque univers a un identifiant stable qui sert de graine partageable :

- Visite normale → univers **aléatoire**.
- `?u=swiss` (ou `terminal`, `y2k`) → force un univers précis.
- Bouton **🔗 Partager** → copie l'URL figée sur la variante courante.
- Bouton **🎲 Regénérer** (ou la touche `R`) → change d'univers sans recharger.

## Ajouter un univers

1. Copie un fichier de `src/universes/` comme patron (garde le préfixe de classe
   unique, ex. `.sw-`, pour éviter les collisions de style).
2. Mets la racine à `class="universe" data-universe-id="mon-id"`.
3. Ajoute `{ id: 'mon-id', name: 'Mon univers' }` dans `src/universes/index.ts`.
4. Importe et rends le composant dans `src/pages/index.astro`.

La CSS de révélation et la barre de contrôle se mettent à jour automatiquement à
partir du registre — rien d'autre à câbler.

## Personnaliser

- **Contenu** : `src/data/portfolio.json` (types dans `src/data/schema.ts`).
- **Polices** : déclarées une fois dans `Layout.astro` (Google Fonts).
- **URL de prod** : décommente `site:` dans `astro.config.mjs` pour l'OG/sitemap.
