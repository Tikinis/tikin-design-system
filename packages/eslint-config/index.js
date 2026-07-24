/**
 * @tikin/eslint-config
 *
 * Reglas de ESLint que refuerzan el uso del design system `@tikin/ui` en las
 * apps web de Tikin. Marca los elementos DOM crudos que ya tienen un componente
 * equivalente en el DS, para que las personas (no solo la IA) construyan sobre
 * el sistema en vez de a mano.
 *
 * Config plana de ESLint 9+. Se compone en el `eslint.config` del consumidor:
 *
 *   import tikin from "@tikin/eslint-config";
 *   export default [ ...tuConfigActual, ...tikin ];
 *
 * `strict` añade además tabla/diálogo/progress. Escape para un caso puntual:
 * `// eslint-disable-next-line no-restricted-syntax` sobre esa línea.
 *
 * Nota: es para apps WEB (DOM). No aplica a React Native / Expo, donde no
 * existen `<button>` ni `<input>` y `@tikin/ui` no corre.
 */

const ESCAPE =
  "Si de verdad necesitas el elemento nativo, desactívalo solo en esa línea con `// eslint-disable-next-line no-restricted-syntax`.";

/** Construye entradas de no-restricted-syntax a partir de un mapa elemento→alternativa. */
function selectors(elements) {
  return elements.map(({ el, use }) => ({
    selector: `JSXOpeningElement[name.name="${el}"]`,
    message: `No uses <${el}> directamente en una app de Tikin. Usa ${use}. ${ESCAPE}`,
  }));
}

// Elementos interactivos con equivalente claro en el DS. Son los ofensores
// frecuentes de "UI ad-hoc"; van como error.
const INTERACTIVE = [
  { el: "button", use: "Button o IconButton de @tikin/ui" },
  {
    el: "input",
    use: "TextField o SearchInput (texto), Checkbox, Radio o SwitchField de @tikin/ui según el caso",
  },
  { el: "textarea", use: "Textarea de @tikin/ui" },
];

// Elementos estructurales que también tienen equivalente, pero cuya adopción
// suele hacerse por fases. Solo se activan en `strict`.
const STRUCTURAL = [
  { el: "table", use: "Table de @tikin/ui" },
  { el: "dialog", use: "Modal o BottomSheet de @tikin/ui" },
  { el: "progress", use: "Progress de @tikin/ui" },
];

const FILES = ["**/*.{jsx,tsx}"];

/** Config por defecto: marca <button>, <input> y <textarea> como error. */
export const recommended = [
  {
    name: "tikin/ui-elements",
    files: FILES,
    rules: {
      "no-restricted-syntax": ["error", ...selectors(INTERACTIVE)],
    },
  },
];

/** Config estricta: interactivos + estructurales (table, dialog, progress). */
export const strict = [
  {
    name: "tikin/ui-elements-strict",
    files: FILES,
    rules: {
      "no-restricted-syntax": ["error", ...selectors([...INTERACTIVE, ...STRUCTURAL])],
    },
  },
];

export default recommended;
