# Tikin Design System

Librería de componentes React del sistema de diseño de Tikin: **37 componentes**
en TypeScript, con tema claro/oscuro, accesibilidad sobre Radix y los valores
literales del archivo de Figma.

La documentación viva es el Storybook. Ahí está cada componente con sus
variantes, sus estados y su matriz de especificación:

**→ https://nicolasgardila.github.io/tikin-design-system/**

Se redespliega solo en cada push a `main` (workflow `pages.yml`).

---

## Instalar

Hay dos formas. Elige según lo que necesites; **no son excluyentes**.

### 1. Como paquete — la opción normal

```bash
npm install @tikin/ui
```

```tsx
import { Button, TextField, Chip } from "@tikin/ui";
import "@tikin/ui/styles.css";

export function Pagar() {
  return (
    <>
      <TextField label="Monto" />
      <Button fullWidth>Confirmar</Button>
    </>
  );
}
```

Eso es todo. **No necesitas Tailwind**: `styles.css` viene compilado. Una
versión, una actualización, y todos los productos van sincronizados.

### 2. Copiando el código — cuando necesitas modificarlo

Igual que shadcn/ui: el componente se copia a tu repositorio y pasa a ser tuyo.

```bash
npx shadcn@latest add https://nicolasgardila.github.io/tikin-design-system/r/button.json
```

Esta vía **sí requiere Tailwind 4** en tu proyecto, más los tokens:

```bash
npm install @tikin/tokens
```

```css
/* tu css principal */
@import "@tikin/tokens";
```

Úsala solo cuando un componente necesite divergir de verdad. Lo que copias deja
de recibir correcciones.

---

## Tema claro y oscuro

El tema se activa con la clase `.dark` en cualquier ancestro:

```tsx
<div className="dark">
  <Button>Se adapta solo</Button>
</div>
```

Funciona anidado: puedes tener una sección oscura dentro de una página clara.
Todos los componentes leen tokens, ninguno lleva colores fijos.

## Tipografías

El sistema usa cinco familias con roles distintos. Van auto-hospedadas, sin
pedirle nada al CDN de Google:

```tsx
import "@tikin/tokens/fonts.css";
```

| Familia          | Rol                        |
| ---------------- | -------------------------- |
| Funnel Display   | Titulares                  |
| Ubuntu Sans      | Voz de lectura             |
| Ubuntu Sans Mono | Cifras, botones, etiquetas |
| DM Mono          | Montos héroe               |
| Ubuntu Mono      | Metadatos y chips          |

Si tu app ya las carga, no importes `fonts.css`.

## Iconos

Los componentes aceptan cualquier `ReactNode` como icono. El sistema usa
[Phosphor](https://phosphoricons.com):

```bash
npm install @phosphor-icons/react
```

```tsx
import { PaperPlaneTilt } from "@phosphor-icons/react";

<Button startIcon={<PaperPlaneTilt />}>Enviar</Button>;
```

---

## Desarrollo

```bash
pnpm install
pnpm storybook      # documentación viva en localhost:6006
pnpm test           # 700+ tests
pnpm typecheck
pnpm build          # compila los paquetes
pnpm registry       # regenera los JSON del registry
```

### Estructura

```
packages/tokens/    @tikin/tokens — tokens de Figma + capa semántica + tema Tailwind
packages/ui/        @tikin/ui — los componentes
apps/storybook/     documentación viva; también sirve el registry en /r/
docs/               fuentes de verdad (documento de diseño y export de Figma)
scripts/            generación del registry y prueba de instalación
```

### De dónde salen los valores

Tres fuentes, con esta precedencia cuando se contradicen:

1. **`docs/Sistema de Diseño.dc.html`** — 45 secciones con anatomía, estados y
   reglas de uso. Manda en **comportamiento**.
2. **`docs/figma-export/fig-tokens.css`** — variables de Figma. Manda en
   **valores** de color y token.
3. **`docs/figma-export/components/*.jsx`** — export automático. Manda en
   **medidas** en píxeles.

Para leer una sección concreta sin cargar los 720 KB del documento:

```bash
python3 scripts/seccion.py toggle          # reglas de uso
python3 scripts/seccion.py toggle --html   # medidas exactas
```

### Canónico vs extensión

Cada componente declara en su cabecera si es **CANÓNICO** (viene del archivo de
Figma), **EXTENSIÓN** (propuesta construida con los tokens) o **MIXTO**. La
distinción es del propio documento y se conserva a propósito: una extensión es
una propuesta coherente, no especificación aprobada.

### Añadir un componente

1. `python3 scripts/seccion.py <seccion>` para leer la especificación.
2. Copiar el patrón de `packages/ui/src/components/button.tsx` — es la
   referencia canónica del repositorio.
3. Escribir `.test.tsx` (comportamiento, no apariencia: jsdom no aplica CSS) y
   `.stories.tsx` (una story por estado).
4. `pnpm typecheck && pnpm test`.
5. `pnpm changeset` para describir el cambio de versión.

---

## Pendiente de decidir

- **Dónde se publica.** El monorepo está listo para publicar (build, `exports`,
  versionado con changesets), pero falta elegir destino: npm privado, GitHub
  Packages o solo registry. Las URLs de este README asumen
  `https://nicolasgardila.github.io/tikin-design-system`; cámbialas con `TIKIN_REGISTRY_URL` al generar
  el registry.

## Problemas conocidos en el origen

Dos cosas que conviene arreglar en Figma, porque vuelven en cada re-export:

- Los tokens `--chip-typo-*` del modo oscuro traen placeholders
  (`"String value"`, tamaños a `0`). Se corrigen en `semantic.css`.
- `--radius-md`, `--radius-none`, `--font-weight-normal` y `--spacing-*` chocan
  con los namespaces de tema de Tailwind 4 y encima van sin unidad. Se
  neutraliza importando Figma en su propia capa CSS; ver `theme.css`.
