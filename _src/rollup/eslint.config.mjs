import js from "@eslint/js";
import globals from "globals";
import { defineConfig, globalIgnores } from "eslint/config";
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: {
        js,
        '@stylistic': stylistic
    },
    extends: ["js/recommended"],
    languageOptions: {
      globals: {
        ...globals.browser,
        PetiteVue: 'readonly'
      }
    },
    linterOptions: {
      noInlineConfig: false,
      reportUnusedDisableDirectives: "error"
    },
    rules: {
      // https://eslint.org/docs/latest/rules/
      "no-unused-expressions": "error",
      // https://eslint.style/rules
      '@stylistic/no-tabs': ['error'],
      '@stylistic/no-trailing-spaces': ['error'],
      // '@stylistic/quotes': ['warn', 'single'],
      '@stylistic/wrap-iife': ['warn', 'outside'],
      // '@stylistic/spaced-comment': ['warn', 'always'],
      // '@stylistic/no-extra-semi': ['error'],
    }
  },
  globalIgnores([
    "output.min.js"
  ])
]);
