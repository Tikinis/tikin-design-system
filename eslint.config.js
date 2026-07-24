import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/storybook-static/**",
      "apps/storybook/public/r/**",
      // Material de referencia, no codigo del proyecto: el export automatico de
      // Figma y los JSON generados del registry.
      "docs/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // Scripts de build y config: corren en Node, no en el navegador.
  {
    files: [
      "scripts/**/*.{mjs,js}",
      "*.config.{js,ts}",
      "**/vite.config.ts",
      "**/vitest.config.ts",
      // El paquete @tikin/eslint-config y su test corren en Node.
      "packages/eslint-config/**/*.js",
    ],
    languageOptions: {
      // Node y navegador a la vez: auditar-stories.mjs corre en Node, pero la
      // funcion que recolecta datos se serializa y se ejecuta DENTRO de la
      // pagina, donde document y getComputedStyle si existen.
      globals: { ...globals.node, ...globals.browser },
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      globals: { ...globals.browser },
    },
    plugins: { "react-hooks": reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  // Las stories declaran componentes de ejemplo dentro de `render:`. ESLint no
  // los distingue de una funcion cualquiera, pero es el patron que documenta
  // Storybook y ahi los hooks son legitimos. Va al final para ganar al bloque
  // general de arriba: en flat config manda la ultima coincidencia.
  {
    files: ["**/*.stories.tsx"],
    rules: { "react-hooks/rules-of-hooks": "off" },
  },
);
