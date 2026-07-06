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
  {
    // Scripts client des .astro : globals navigateur + variables injectées par define:vars
    files: ["**/*.astro"],
    languageOptions: { globals: { ...globals.browser } },
    rules: { "no-undef": "off" },
  },
  // désactive les règles de style en conflit avec Prettier — doit rester en dernier
  prettier,
];
