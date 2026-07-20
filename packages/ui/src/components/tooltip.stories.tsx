import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tooltip, TooltipProvider } from "./tooltip";

/* Seccion 19 · Tooltips — EXTENSION, no canonico. Ver la nota de cabecera del
 * componente: el documento lo declara "construida con los tokens del archivo" y
 * no hay Tooltip en el export de Figma. */

const meta = {
  title: "Componentes/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Seccion 19 · Tooltips — EXTENSION** construida con los tokens del archivo.",
          "",
          "No viene del archivo de Figma: es una propuesta coherente con el sistema, no especificacion aprobada.",
          "",
          "- **Solo apoyo** — aclara, nunca contiene informacion esencial ni acciones. En movil (sin hover) esa informacion va inline o en un sheet.",
          "- **Breve** — una linea idealmente; dos como maximo con titulo + descripcion. Sin punto final en etiquetas de una frase.",
          "- **Flecha al origen** — la flecha apunta al elemento, con un fade de ~140ms. Sin retardo largo ni rebote.",
          "",
          "El tooltip **describe** al disparador (`aria-describedby`), no lo nombra: un disparador solo-icono necesita ademas su propio `aria-label`.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    side: { control: "inline-radio", options: ["top", "right", "bottom", "left"] },
    align: { control: "inline-radio", options: ["start", "center", "end"] },
    sideOffset: { control: { type: "number" } },
    arrow: { control: "boolean" },
    delayDuration: { control: { type: "number" } },
    label: { control: "text" },
    description: { control: "text" },
    shortcut: { control: "text" },
  },
  args: {
    label: "Mas informacion",
    children: <IconTrigger label="Informacion" glyph="info" />,
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

/* Disparador de ejemplo: caja de 44 con borde de 1px y r12, como en el
 * prototipo. Vive aqui y no en el componente porque el disparador siempre lo
 * aporta el consumidor. El aria-label es obligatorio en un boton solo-icono:
 * el tooltip lo describe, no lo nombra. */
function IconTrigger({ label, glyph }: { label: string; glyph: keyof typeof glyphs }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex size-11 cursor-pointer items-center justify-center rounded-lg border border-edge-2 text-ink transition-colors duration-140 outline-none hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-page"
    >
      {glyphs[glyph]}
    </button>
  );
}

/* Glifos minimos en SVG. En producto van los de Phosphor, la libreria oficial
 * del sistema; aqui se dibujan a mano para no atar las stories a un paquete
 * que el componente no necesita. */
const glyphs = {
  info: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-5">
      <circle cx="10" cy="10" r="7.5" />
      <path d="M10 9v4.5M10 6.4v.1" strokeLinecap="round" />
    </svg>
  ),
  copy: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-5">
      <rect x="7" y="7" width="8.5" height="8.5" rx="2" />
      <path d="M12.5 7V6a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h1" />
    </svg>
  ),
  eye: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-5">
      <path d="M2 10s3-5 8-5 8 5 8 5-3 5-8 5-8-5-8-5Z" />
      <circle cx="10" cy="10" r="2.2" />
    </svg>
  ),
  qr: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-5">
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="11" y="3" width="6" height="6" rx="1" />
      <rect x="3" y="11" width="6" height="6" rx="1" />
      <path d="M11 11h2.5M17 11v2.5M11 15.5h2M15 17h2" strokeLinecap="round" />
    </svg>
  ),
} as const;

/** Etiqueta simple: una linea, sin punto final. */
export const LabelSimple: Story = {};

/** Titulo + descripcion. Es el maximo que admite un tooltip: dos lineas. */
export const TituloYDescripcion: Story = {
  name: "Título + descripción",
  args: {
    label: "TikinTAG",
    description: "Tu identificador para recibir dinero.",
  },
};

/** El atajo va en un chip a la derecha, en Ubuntu Mono 11. */
export const ConShortcut: Story = {
  name: "Con shortcut",
  args: { label: "Buscar", shortcut: "⌘K" },
};

/** Sin flecha: para tooltips anclados a texto, donde la punta ensucia la linea. */
export const SinFlecha: Story = {
  name: "Sin flecha",
  args: { arrow: false },
};

/**
 * Los cuatro lados. Radix voltea automaticamente el que no cabe en pantalla, y
 * la flecha se recoloca con el.
 */
export const Posiciones: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    // Un solo provider para que moverse entre iconos vecinos sea inmediato
    // despues del primero.
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-14 p-16">
        <Tooltip label="Más información" side="top">
          <IconTrigger label="Información" glyph="info" />
        </Tooltip>
        <Tooltip label="Copiar TikinTAG" side="bottom">
          <IconTrigger label="Copiar TikinTAG" glyph="copy" />
        </Tooltip>
        <Tooltip label="Mostrar saldo" side="left">
          <IconTrigger label="Mostrar saldo" glyph="eye" />
        </Tooltip>
        <Tooltip label="Cobrar con QR" side="right">
          <IconTrigger label="Cobrar con QR" glyph="qr" />
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
};

/** El caso "EN TEXTO" del documento: la ⓘ dentro de una linea de texto. */
export const EnTexto: Story = {
  name: "En texto",
  parameters: { controls: { disable: true } },
  render: () => (
    <p className="flex items-center gap-1.5 text-sm text-ink">
      Comisión
      <Tooltip label="Siempre $0 en Tikin" sideOffset={10}>
        <button
          type="button"
          aria-label="Qué comisión se aplica"
          className="inline-flex cursor-pointer rounded-full text-ink-600 outline-none hover:text-ink focus-visible:ring-2 focus-visible:ring-ink"
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="size-4"
          >
            <circle cx="10" cy="10" r="7.5" />
            <path d="M10 9v4.5M10 6.4v.1" strokeLinecap="round" />
          </svg>
        </button>
      </Tooltip>
    </p>
  ),
};

/**
 * Matriz de especificacion. Las burbujas van abiertas con `open` para poder
 * compararlas de un vistazo; en uso real se abren por hover o por foco.
 */
export const MatrizDeEspecificacion: Story = {
  name: "Matriz de especificación",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap gap-24 p-20 pt-24">
      {(
        [
          { key: "simple", caption: "LABEL SIMPLE", props: { label: "Editar" } },
          {
            key: "rich",
            caption: "TÍTULO + DESC",
            props: {
              label: "TikinTAG",
              description: "Tu identificador para recibir dinero.",
            },
          },
          {
            key: "shortcut",
            caption: "CON SHORTCUT",
            props: { label: "Buscar", shortcut: "⌘K" },
          },
          { key: "sin-flecha", caption: "SIN FLECHA", props: { label: "Editar", arrow: false } },
        ] as const
      ).map(({ key, caption, props }) => (
        <div key={key} className="flex flex-col items-center gap-2">
          <Tooltip {...props} open>
            <IconTrigger label={caption} glyph="info" />
          </Tooltip>
          <span className="font-meta text-[10px] tracking-[0.1em] text-ink-500 uppercase">
            {caption}
          </span>
        </div>
      ))}
    </div>
  ),
};
