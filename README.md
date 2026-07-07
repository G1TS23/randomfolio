# Portfolio aléatoire 🎲

[![CI](https://github.com/G1TS23/randomfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/G1TS23/randomfolio/actions/workflows/ci.yml)
[![Version](https://img.shields.io/github/package-json/v/G1TS23/randomfolio?color=BC52EE)](https://github.com/G1TS23/randomfolio)
[![License](https://img.shields.io/github/license/G1TS23/randomfolio?color=BC52EE)](LICENSE)
[![Astro](https://img.shields.io/github/package-json/dependency-version/G1TS23/randomfolio/astro?logo=astro&logoColor=white&label=Astro&color=BC52EE)](https://astro.build)
[![Live](https://img.shields.io/badge/live-olivier.falahi.org-BC52EE?logo=netlify&logoColor=white)](https://olivier.falahi.org)

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

- À la **première arrivée d'une session**, un bouton **🎲 Générer mon univers**
  lance l'animation **avec le son** (un clac mécanique synthétisé en Web Audio —
  le clic débloque l'audio du navigateur). Sans clic, l'animation **se lance
  seule après ~4,5 s** (silencieuse), pour ne pas bloquer les visiteurs passifs
  ni les crawlers.
- Ensuite dans la même session (**rechargement**, **Regénérer**, touche **R**),
  l'animation se relance **directement**, sans bouton. Mémorisé via
  `sessionStorage` : le geste n'est reproposé qu'à une nouvelle session, quand le
  navigateur a de toute façon reverrouillé l'audio.
- Bouton **🔊 / 🔇** dans la barre pour couper le son (préférence mémorisée).
- `prefers-reduced-motion` respecté (pas d'animation ni de son).

## Partage & navigation

- Visite normale → univers **aléatoire** (sans répétition).
- Bouton **🎲 Regénérer** (ou touche `R`) → change d'univers sans recharger.
- Bouton **🔗 Partager** → copie une URL figée sur la variante **et sa couleur**
  courantes, ex. `?u=blueprint&t=44_1.23`.
- Ouvrir un lien `?u=<id>&t=<teinte>` reproduit exactement l'univers et sa teinte.
  (Regénérer/rechargement nettoient `u` et `t` → on repart en aléatoire.)

## Langue (FR / EN)

Un bouton **FR/EN** dans la barre bascule toute la page — contenu **et**
interface, sur les 11 univers, le loader et le REPL du Terminal. Bascule **côté
client** (même URL), préférence mémorisée en `localStorage` ; `<html lang>` est
mis à jour.

- **Contenu** : `src/data/portfolio.json` (FR) + `src/data/portfolio.en.json`
  (EN), même structure.
- **Libellés d'interface** : `src/data/ui.json` (`{ "clé": { "fr", "en" } }`).
- Chaque texte traduisible porte `data-i18n="<clé>"` ; le script du Layout échange
  le texte selon la langue. Le dictionnaire est construit dans `src/lib/i18n.ts`.

Deux garde-fous testés (`tests/i18n.test.ts`) :

- **parité** — chaque libellé UI a `fr`+`en` non vides, et les deux fichiers de
  contenu ont exactement les mêmes chemins (aucune clé manquante) ;
- **synchronisation** — compare le dictionnaire au lock (`tests/i18n.lock.json`)
  et signale toute traduction changée d'un seul côté (FR sans EN, ou l'inverse).

Après avoir mis à jour **FR et EN**, régénère la référence :

```bash
npm run i18n:lock
```

> Bascule client → une seule URL indexée (FR) côté SEO. Quelques listes jointes
> (tags/compétences d'Editorial et Botanical) et la marquee Y2K restent en FR.

## Ajouter un univers

1. Copie un fichier de `src/universes/` comme patron (garde un préfixe de classe
   unique, ex. `.sw-`, pour éviter les collisions de style scopé).
2. Mets la racine à `class="universe" data-universe-id="mon-id"`.
3. Ajoute `{ id: "mon-id", name: "Mon univers" }` dans `src/universes/index.ts`.
4. Importe et rends le composant dans `src/pages/index.astro`.
5. Marque chaque texte traduisible avec `data-i18n="<clé>"` (contenu :
   `tagline`, `about`, `projects.N.…`, `skills.N` ; libellés : ajoute-les dans
   `src/data/ui.json`), puis `npm run i18n:lock`.
6. (Optionnel) règle l'amplitude de teinte dans la map `TINT` de `Layout.astro`
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
npm run i18n:lock     # régénère la référence de traduction (après édition fr+en)
```

Les tests (`tests/`) couvrent la validité de `portfolio.json`, la cohérence du
registre d'univers, les fonctions pures du moteur (`src/lib/` : anti-répétition,
encodage de la teinte, construction du dictionnaire i18n), et la parité +
synchronisation des traductions FR/EN (cf. [Langue](#langue-fr--en)).

Une **CI GitHub Actions** (`.github/workflows/ci.yml`) rejoue Lint · Typecheck ·
Test · Build à chaque push et PR.

## Personnaliser

- **Contenu** : `src/data/portfolio.json` (FR) + `src/data/portfolio.en.json`
  (EN) ; libellés d'interface dans `src/data/ui.json`.
- **Polices** : déclarées une fois dans `Layout.astro` (Google Fonts).
- **URL de prod** : `site` dans `astro.config.mjs` (sert au canonical, à l'OG et
  au sitemap).

## SEO & déploiement

- **Statique** → déployable sur Netlify, Vercel, GitHub Pages… (config Netlify
  dans `netlify.toml`).
- **SEO** : `<title>` / meta / `canonical` fixes (indépendants de l'univers),
  **JSON-LD `schema.org/Person`** comme source canonique, `sitemap.xml`,
  `robots.txt`, et une **image Open Graph** (`public/og.png`).

## Licence

[MIT](LICENSE) © Olivier Falahi
