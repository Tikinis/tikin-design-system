# Fuentes de verdad

## `Sistema de Diseño.dc.html` (722 KB)

La documentación viva completa: **45 secciones** con anatomía, estados, valores
literales de token y reglas de uso. Es la autoridad sobre _intención de diseño_.

Procede del handoff de Claude Design (`claude.ai/design`). Para actualizarlo:
exportar el proyecto de nuevo y reemplazar este archivo.

> Distingue explícitamente lo **canónico** ("DEL ARCHIVO", viene de Figma) de lo
> **propuesto** ("EXTENSIÓN construida con los tokens"). Esa distinción se
> conserva en las stories de Storybook — no la pierdas al implementar.

## `figma-export/`

Export automático de Figma. **No es código publicable**: posicionamiento
absoluto y un cuerpo de función por cada combinación de variantes. Sirve como
autoridad sobre _medidas exactas_ cuando el documento no las escribe.

- `fig-tokens.css` — variables de Figma. Es el original del que sale
  `packages/tokens/src/figma.css` (verificado byte a byte).
- `components/*.jsx` — geometría por variante. Ejemplo real: `Toggle.jsx` fija
  L 42×24 con thumb 20, M 34×20 con 16, y S y XS ambos 29×16 con 14 — o sea,
  S y XS son idénticos en Figma.
- `components/icon-*.js` — datos de la iconografía.

`bundle/Components.bundle.js` se excluyó a propósito: 1 MB de código generado
que no aporta nada sobre los `.jsx` individuales.

## Precedencia cuando hay conflicto

1. `Sistema de Diseño.dc.html` — estados, comportamiento, reglas de uso
2. `figma-export/fig-tokens.css` — valores de color y token
3. `figma-export/components/*.jsx` — medidas en píxeles

Si el documento y Figma discrepan en un valor, gana Figma y se anota en el
componente. Si discrepan en _comportamiento_, gana el documento.
