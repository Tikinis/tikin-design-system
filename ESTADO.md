# Estado del proyecto

Instantánea del sistema de diseño para quien retome el trabajo. La historia
detallada de cada decisión está en los mensajes de commit; esto es el mapa.

## Qué es

Monorepo del **Tikin Design System**: 37 componentes React (Tailwind 4 + CVA +
Radix), construidos desde el documento de diseño de Claude Design
(`docs/Sistema de Diseño.dc.html`, 45 secciones) y el export de Figma. 1023 tests.
Distribución híbrida: paquete npm **y** registry estilo shadcn desde una sola fuente.

## Dónde vive

| | |
|---|---|
| Repo | github.com/Tikinis/tikin-design-system (público) |
| Storybook + registry | https://tikinis.github.io/tikin-design-system/ |
| npm | **sin publicar** — ver `PUBLICAR.md` |
| Skill de Claude Code | `skills/tikin-ui/SKILL.md` — que la IA use el DS sola (ver `skills/README.md`) |

El Storybook se redespliega solo en cada push a `main` (`.github/workflows/pages.yml`)
y sirve el registry en `/r/*.json`.

> El repo vive en la organización `Tikinis`. La URL personal anterior
> (`nicolasgardila/tikin-design-system`) redirige automáticamente.

## Estructura

```
packages/tokens   @tikin/tokens — CSS puro, 3 capas (ver abajo)
packages/ui       @tikin/ui — un fichero por componente + .test + .stories
apps/storybook    docs vivas; sirve el registry en public/r/
docs/             Sistema de Diseño.dc.html + figma-export/ + ANIMACIONES-ref.txt
scripts/          generación de registry, guardas y utilidades
```

### Las 3 capas de tokens

- `figma.css` — export de Figma. **No editar a mano**; se regenera. Va en su
  propia `@layer tikin-figma` porque sus nombres sin unidad (`--radius-md: 8`)
  chocan con los namespaces de tema de Tailwind 4.
- `semantic.css` — capa `--tk-*` extraída del documento (superficies, tinta, tints).
- `theme.css` — mapeo a utilidades de Tailwind. **Este sí es editable.**

## Comandos

```bash
pnpm storybook        # docs vivas en localhost:6006
pnpm test             # 1023 tests
pnpm typecheck
pnpm tokens           # guarda: detecta un re-export de Figma roto
pnpm audit:visual     # contraste WCAG por story, claro y oscuro
pnpm build            # compila los paquetes
pnpm registry         # regenera los JSON del registry
python3 scripts/seccion.py <id> [--html]   # extrae una sección del doc
```

## Reglas que no son obvias

- **Radix por subruta** (`radix-ui/switch`), nunca el namespace raíz — este
  último se tipa como `any` y desactiva el chequeo de props.
- **Chip:** `<Chip tone="success|warning|error|info">`, no `feedback=`.
- **Mayúsculas por CSS** (`uppercase`), nunca `.toUpperCase()` en JS.
- Todo componente del DOM: `forwardRef` + `className` por `cn()`.

## Las 6 desviaciones deliberadas — NO revertir

El prototipo del diseño hace cosas que solo se sostienen como maqueta de
navegador. Están corregidas a propósito; volver a "100% igual" reintroduce el bug:

1. **Primary / Toast en oscuro** — el diseño deja negro sobre negro (token que no
   invierte). Se usa `--tk-*` que sí invierte.
2. **Bordes** — `0.25px` sub-píxel → `1px` inset (desaparecían en muchas pantallas).
3. **Calendar** — fuente Geist (ajena al sistema) → `font-mono`.
4. **Date picker "rueda iOS"** — era un PNG rasterizado, no se implementa.
5. **Capas blancas literales** `rgba(255,255,255,…)` → `color-mix` sobre token.
6. **`--chip-typo-size`** placeholder `0` en oscuro → valores literales.

## Pendiente

- **Decidir destino de publicación npm** (bloquea el release). `PUBLICAR.md` tiene
  las tres rutas con pasos exactos; `release.yml` está escrito y desactivado
  (`if: false`).
- **~79 nitpicks de fidelidad baja** — en su mayoría contradicciones internas del
  propio documento (da dos valores distintos en sitios distintos), matices de
  motion-reduce que el doc no tiene, y springs aproximados con CSS en vez de una
  librería de animación. No hay "100%" posible cuando el original no es
  consistente consigo mismo.
- **Revisión visual a ojo** — la auditoría automática detecta lo mecánico, no si
  algo es feo. Merece un paseo por el Storybook al lado del diseño original.

## Límite conocido del render del doc

Las matrices "DEL ARCHIVO" del `.dc.html` instancian componentes de un bundle que
solo se pinta dentro del runtime de Claude Design; fuera de él solo renderizan
los demos "EN VIVO". La geometría de esos componentes se clavó contra
`docs/figma-export/*.jsx`, que es su fuente.
