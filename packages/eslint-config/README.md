# @tikin/eslint-config

Reglas de ESLint que hacen que las **apps web de Tikin** construyan sobre el
design system `@tikin/ui` en vez de a mano. Marca los elementos DOM crudos que
ya tienen componente en el DS:

| Elemento crudo | Usa en su lugar                                                | Severidad     |
| -------------- | -------------------------------------------------------------- | ------------- |
| `<button>`     | `Button`, `IconButton`                                         | error         |
| `<input>`      | `TextField`, `SearchInput`, `Checkbox`, `Radio`, `SwitchField` | error         |
| `<textarea>`   | `Textarea`                                                     | error         |
| `<table>`      | `Table`                                                        | solo `strict` |
| `<dialog>`     | `Modal`, `BottomSheet`                                         | solo `strict` |
| `<progress>`   | `Progress`                                                     | solo `strict` |

Es la contraparte humana de la skill `tikin-ui`: la skill guía a la IA, este
lint atrapa a cualquiera que escriba UI a mano o desde otro editor.

> **Solo apps web (DOM).** No aplica a React Native / Expo (p. ej. Tikin.app):
> ahí no existen `<button>`/`<input>` y `@tikin/ui` no corre.

## Instalar

Requiere ESLint 9+ con flat config (`eslint.config.mjs`), como en admin y landing.

```bash
pnpm add -D @tikin/eslint-config
```

## Uso (Next.js — admin, landing)

```js
// eslint.config.mjs
import { FlatCompat } from "@eslint/eslintrc";
import tikin from "@tikin/eslint-config";

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

export default [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  ...tikin, // ← añade las reglas del DS al final
];
```

Si tu `eslint.config` ya es un array plano, basta con `...tikin` al final.

### Versión estricta

Añade también tabla/diálogo/progress:

```js
import { strict as tikin } from "@tikin/eslint-config";
export default [...tuConfig, ...tikin];
```

## Escape para un caso puntual

Cuando de verdad necesites el elemento nativo (un caso que el DS no cubre):

```tsx
function Foo() {
  return (
    // eslint-disable-next-line no-restricted-syntax
    <button onClick={raroYEspecifico}>…</button>
  );
}
```

Si el elemento va anidado como hijo dentro de más JSX, usa la forma de comentario
JSX: `{/* eslint-disable-next-line no-restricted-syntax */}` en la línea anterior.

## Adopción por fases en un repo con mucho código legado

Las reglas son `error` a propósito (para que tengan dientes en CI). Si al
adoptarlo aparecen cientos de avisos, no bajes la barra: acótala mientras migras.

```js
export default [
  ...tuConfig,
  ...tikin,
  // Excluir temporalmente lo legado mientras se migra pantalla por pantalla.
  { ignores: ["src/legacy/**"] },
];
```

## Qué NO hace (todavía)

- No detecta colores/espaciados hardcodeados fuera de los tokens del DS.
- No detecta `React.createElement("button")` (solo JSX). En estas apps es raro.

Ambos son extensiones posibles si hicieran falta.
