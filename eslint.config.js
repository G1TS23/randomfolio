// @ts-check
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default [
  { ignores: ["dist/", ".astro/", "node_modules/"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  // les catch vides sont volontaires (ex. localStorage indisponible)
  { rules: { "no-empty": ["error", { allowEmptyCatch: true }] } },
  {
    // Scripts client des .astro : globals navigateur + variables injectées par define:vars
    files: ["**/*.astro"],
    languageOptions: { globals: { ...globals.browser } },
    rules: { "no-undef": "off" },
  },
  {
    // Scripts d'outillage exécutés en Node
    files: ["scripts/**/*.mjs"],
    languageOptions: { globals: { ...globals.node } },
  },
  // désactive les règles de style en conflit avec Prettier — doit rester en dernier
  prettier,
];
