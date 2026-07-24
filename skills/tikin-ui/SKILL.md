---
name: tikin-ui
description: >-
  Construye cualquier interfaz de Tikin con el design system @tikin/ui. Úsala
  SIEMPRE que la tarea implique frontend/UI para una app de Tikin (Tikin.app,
  admin, landing, platform u otra): crear o modificar pantallas, vistas,
  componentes, formularios, botones, modales, tablas, chips, toasts, etc. Da el
  catálogo de los 37 componentes, cómo instalarlos (npm o registry), el theming
  y las reglas del sistema. Regla dura: nunca inventes un componente que el DS
  ya tiene — revisa el catálogo primero.
---

# Tikin Design System — cómo construir front en Tikin

El sistema de diseño de Tikin vive en **`@tikin/ui`**
(repo `github.com/Tikinis/tikin-design-system`). Son 37 componentes React
(Tailwind 4 + CVA + Radix) construidos desde el diseño oficial. **Todo el
front de Tikin se construye sobre este paquete**, no a mano.

- **Storybook (docs vivas):** https://tikinis.github.io/tikin-design-system/
- **Registry (instalar suelto):** https://tikinis.github.io/tikin-design-system/r/<componente>.json

## Reglas duras

1. **Nunca inventes un componente que ya existe.** Antes de escribir un `<button>`,
   un input, un modal, un chip o cualquier pieza de UI, busca en el **catálogo**
   de abajo. Si existe, úsalo. Solo construye desde cero lo que el DS no cubra —
   y en ese caso, hazlo con los tokens del DS (`var(--tk-*)`, `var(--font-*)`),
   no con colores ni fuentes sueltas.
2. **No re-estilices los componentes del DS** con clases arbitrarias que peleen
   con su diseño. Usa sus props (`variant`, `size`, `tone`, etc.). Para layout
   alrededor, sí puedes usar utilidades/estilos normales.
3. **Iconos: solo Phosphor** (`@phosphor-icons/react`). Los componentes reciben
   iconos como `ReactNode`, no como strings de clase CSS.
4. **Si no conoces una prop exacta**, léela de la fuente: el JSON del registry
   (`.../r/<componente>.json` trae el código fuente completo) o el Storybook.
   No adivines la API.

## Instalar el DS en una app (ruta npm — la normal)

```bash
pnpm add @tikin/ui @phosphor-icons/react
# peers habituales de React ya presentes en la app
```

En el entry de la app, **una sola vez**:

```tsx
import "@tikin/ui/styles.css";   // tokens + estilos compilados; no requiere config de Tailwind
```

Uso:

```tsx
import { Button, TextField } from "@tikin/ui";

<Button>Confirmar</Button>
<TextField label="Correo electrónico" />
```

**Tema oscuro:** añade la clase `dark` a un ancestro (p. ej. `<html>` o el root):
`<div className={dark ? "dark" : ""}>`. Todos los tokens invierten solos.

**Providers de overlay** (montar una vez cerca del root, solo si usas esos
componentes):
- Tooltips → envolver en `<TooltipProvider>`.
- Toasts → `<ToastProvider>` + `<ToastViewport />`.
- Snackbars → `<SnackbarProvider>` + `<SnackbarViewport />`.

> Si `@tikin/ui` aún no está publicado en el registro npm de la empresa, usa la
> ruta de registry (abajo) para copiar el componente al proyecto. Estado de
> publicación: ver `PUBLICAR.md` en el repo del DS.

## Instalar un componente suelto (ruta registry, estilo shadcn)

Copia el fuente del componente al proyecto (útil si no quieres la dependencia
npm o quieres tocar el código):

```bash
npx shadcn@latest add https://tikinis.github.io/tikin-design-system/r/button.json
```

Cada componente arrastra sus dependencias (`cn`, y otros del DS) por el registry.

## Catálogo (37 componentes)

Nombre de registry → símbolos que se importan de `@tikin/ui`. Para instalar
suelto: `.../r/<nombre>.json`.

**Acciones**
- `button` → `Button` · botón; `variant` primary/secondary/ghost/link, `size`, `loading`
- `link` → `Link`, `IconButton` · enlace (siempre subrayado), botón de solo icono
- `menu-button` → `MenuButton`, `SplitButton`, `ButtonGroup` · menú desplegable, split, grupo
- `filter-chip` → `FilterChip` · chip con opciones para filtrar

**Formulario**
- `text-field` → `TextField`, `Textarea` · campo con etiqueta interna, mensaje de error
- `search-input` → `SearchInput` · campo de búsqueda
- `checkbox` → `Checkbox` · casilla
- `radio-group` → `RadioGroup`, `Radio` · grupo de opción única
- `toggle` → `Toggle`, `SwitchField` · switch, y switch con etiqueta/título
- `range-slider` → `RangeSlider` · deslizador de rango
- `otp-input` → `OtpInput` · código OTP
- `pin-input` → `PinInput` · PIN
- `keypad` → `Keypad`, `AmountDisplay` · teclado numérico + display de monto
- `file-upload` → `FileUpload` (+`FileUploadList`, `FileUploadItem`) · subida de archivos
- `date-picker` → `DatePicker` · selector de fecha
- `calendar` → `Calendar` · calendario

**Selección y navegación**
- `tabs` → `Tabs` (+`TabsList`/`TabsTrigger`/`TabsContent`), `SegmentedControl` · pestañas y control segmentado
- `steps` → `Steps`, `StepsDots` · pasos/wizard
- `pagination` → `Pagination` · paginación
- `navigation` → `TabBar`, `TopBar`, `Sidebar` (+ sub-items) · barras de navegación

**Contenido y datos**
- `card` → `Card`, `CardFeature`, `CardMedia`, `CardStat` · tarjeta y sus roles
- `table` → `Table` (+`TableHeader`/`TableBody`/`TableRow`/`TableCell`…) · tabla
- `list-item` → `List`, `ListItem` (+`ListItemIcon`/`ListItemValue`/`ListItemAmount`/`ListItemCheck`) · listas
- `avatar` → `Avatar`, `AvatarGroup` · avatar y grupo (iniciales automáticas)
- `chip` → `Chip`, `Badge` · chip y badge; **`tone="success|warning|error|info"`**
- `accordion` → `Accordion` (+`AccordionItem`/`AccordionTrigger`/`AccordionContent`) · acordeón
- `empty-state` → `EmptyState`, `EmptyStateAction` · estado vacío

**Feedback y overlays**
- `alert` → `Alert`, `AlertAction` · alerta en bloque; `tone`
- `banner` → `Banner`, `BannerAction` · banner
- `toast` → `Toast`, `ToastProvider`, `ToastViewport`, `ToastAction` · toasts (requiere provider)
- `snackbar` → `Snackbar`, `SnackbarProvider`, `SnackbarViewport` · snackbars (requiere provider)
- `notification` → `NotificationItem`, `NotificationAction` · item de notificación
- `modal` → `Modal` (+`ModalTrigger`/`ModalContent`/`ModalTitle`/`ModalFooter`…), `BottomSheet` (+ sub-partes) · modal y hoja inferior
- `tooltip` → `Tooltip`, `TooltipProvider` · tooltip (requiere provider)
- `progress` → `Progress` · barra de progreso
- `skeleton` → `Skeleton` · placeholder de carga
- `spinner` → `Spinner`, `LoadingOverlay` · spinner y overlay de carga

Utilidad: `cn` (merge de clases) también se exporta de `@tikin/ui`.

## Detalles que muerden (no obvios)

- **Chip/Badge:** la prop es **`tone`**, no `feedback`. `<Chip tone="success">`.
- **Mayúsculas** de labels: las hace el CSS (`text-transform`), no `.toUpperCase()`
  en JS. No fuerces mayúsculas a mano.
- **`s` y `xs`** son idénticos en varios componentes (viene así del diseño).
- Los componentes ya traen `forwardRef` y aceptan `className`; puedes componer
  con `asChild` donde el DS lo expone (vía Radix `Slot`).

## Cuándo NO usar esta skill

Backend, lógica de negocio, datos, APIs, o cualquier cosa que no sea UI. Aquí
solo se trata de construir interfaz sobre el design system de Tikin.
