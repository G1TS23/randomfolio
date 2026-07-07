# Portfolio aléatoire 🎲

Un portfolio qui se réinvente à chaque visite : le contenu est unique, mais
chaque visiteur tombe sur un **univers de design** complet et cohérent, tiré au
sort — et même sa couleur varie légèrement à chaque passage.

En prod : **[olivier.falahi.org](https://olivier.falahi.org)**

## Les 11 univers

`Swiss` · `Terminal` (interactif, tape `help`) · `Y2K` · `Editorial` ·
`Blueprint` · `Riso` · `Bauhaus` · `Aurora` (glassmorphism) · `Memphis` ·
`Botanical` (herbier) · `Comic`.

Chacun est un design complet et autonome : même contenu, mise en scène
radicalement différente.

## Démarrer

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # site statique dans dist/
```

## Comment ça marche

- **Un seul contenu** → `src/data/portfolio.json`. C'est le seul fichier à
  remplir au quotidien (types dans `src/data/schema.ts`).
- **Un univers = un composant autonome** → `src/universes/*.astro`. Chacun reçoit
  exactement les mêmes données et décide seul de tout son visuel. On ne mélange
  jamais des morceaux entre univers → jamais de rendu incohérent.
- **Le tirage se fait côté client** (`src/layouts/Layout.astro`) : un script dans
  le `<head>` choisit un univers avant le premier rendu (aucun clignotement). Le
  site reste **100 % statique**, hébergeable partout. Sans JS, l'univers par
  défaut du serveur s'affiche.
- **Anti-répétition** : la mémoire du navigateur (`localStorage`) évite de
  retomber sur un univers déjà vu tant qu'on ne les a pas tous parcourus, et
  jamais deux fois d'affilée. Algorithme testé dans `src/lib/pick.ts`.
- **Variation de couleur** : à chaque affichage, une légère rotation de teinte +
  saturation est appliquée à l'univers (masquée par le loader). Même univers,
  accent différent.

## L'écran de chargement

Un panneau à palettes façon aéroport (Solari) qui égrène les lettres jusqu'à
« annoncer » l'univers, puis se lève comme un rideau.

- Un bouton **🎲 Générer mon univers** lance l'animation **avec le son** (un clac
  mécanique synthétisé en Web Audio — le clic débloque l'audio du navigateur).
- Sans clic, l'animation **se lance seule après ~2,2 s** (silencieuse), pour ne
  pas bloquer les visiteurs passifs ni les crawlers.
- Bouton **🔊 / 🔇** dans la barre pour couper le son (préférence mémorisée).
- `prefers-reduced-motion` respecté (pas d'animation ni de son).

## Partage & navigation

- Visite normale → univers **aléatoire** (sans répétition).
- Bouton **🎲 Regénérer** (ou touche `R`) → change d'univers sans recharger.
- Bouton **🔗 Partager** → copie une URL figée sur la variante **et sa couleur**
  courantes, ex. `?u=blueprint&t=44_1.23`.
- Ouvrir un lien `?u=<id>&t=<teinte>` reproduit exactement l'univers et sa teinte.
  (Regénérer/rechargement nettoient `u` et `t` → on repart en aléatoire.)

## Ajouter un univers

1. Copie un fichier de `src/universes/` comme patron (garde un préfixe de classe
   unique, ex. `.sw-`, pour éviter les collisions de style scopé).
2. Mets la racine à `class="universe" data-universe-id="mon-id"`.
3. Ajoute `{ id: "mon-id", name: "Mon univers" }` dans `src/universes/index.ts`.
4. Importe et rends le composant dans `src/pages/index.astro`.
5. (Optionnel) règle l'amplitude de teinte dans la map `TINT` de `Layout.astro`
   (défaut : 40°).

La CSS de révélation et la barre de contrôle se recâblent automatiquement à
partir du registre. Un test vérifie que le registre correspond **exactement** aux
composants présents.

## Qualité

```bash
npm run lint          # eslint
npm run format        # prettier --write   (format:check en lecture seule)
npm run check         # astro check (types)
npm test              # vitest
```

Les tests (`tests/`) couvrent la validité de `portfolio.json`, la cohérence du
registre d'univers, et les fonctions pures du moteur (`src/lib/` : anti-répétition
et encodage de la teinte pour le partage).

Une **CI GitHub Actions** (`.github/workflows/ci.yml`) rejoue Lint · Typecheck ·
Test · Build à chaque push et PR.

## Personnaliser

- **Contenu** : `src/data/portfolio.json`.
- **Polices** : déclarées une fois dans `Layout.astro` (Google Fonts).
- **URL de prod** : `site` dans `astro.config.mjs` (sert au canonical, à l'OG et
  au sitemap).

## SEO & déploiement

- **Statique** → déployable sur Netlify, Vercel, GitHub Pages… (config Netlify
  dans `netlify.toml`).
- **SEO** : `<title>` / meta / `canonical` fixes (indépendants de l'univers),
  **JSON-LD `schema.org/Person`** comme source canonique, `sitemap.xml`,
  `robots.txt`, et une **image Open Graph** (`public/og.png`).
