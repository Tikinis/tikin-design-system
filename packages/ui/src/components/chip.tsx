import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/* Seccion 09 · Chips & badges — MIXTO.
 *
 * La seccion mezcla a proposito dos cosas de rango distinto y aqui se conserva
 * la distincion:
 *
 *   Chip variant="feedback"        CANONICO. Es el componente Chip del archivo
 *                                  de Figma (nodo 2:5085, 16 variantes = 4
 *                                  feedbacks x 4 tamaños). Pastel solido, pill,
 *                                  Ubuntu Mono en MAYUSCULAS, sin borde y sin
 *                                  icono. No es interactivo.
 *
 *   Chip variant="action|filter|value"   EXTENSION. El propio documento las
 *                                  etiqueta como "Extension construida con
 *                                  tokens del archivo (pill r999, borde de
 *                                  campo); el unico Chip nativo es el de
 *                                  feedback". Son Ubuntu Sans en caja normal,
 *                                  no mono en mayusculas.
 *
 *   Badge                          EXTENSION. Tint 50 + texto del hue para
 *                                  estados persistentes en listas.
 *
 * TRES DECISIONES QUE SE APARTAN DE ALGUNA DE LAS FUENTES
 * ------------------------------------------------------
 * 1. Altura de Chip size="l" = 28, no 32.
 *    La rejilla del documento rotula la columna "L · 32", pero el export de
 *    Figma (docs/figma-export/components/Chip.jsx, __body12..15) da height 28
 *    en las cuatro variantes L. El export es autoridad sobre pixeles, asi que
 *    manda 28 — que ademas coincide con --height-control-xs del sistema.
 *
 * 2. Los tamaños de texto van literales (12/14/14/16) y NO por
 *    var(--chip-typo-size-*).
 *    Motivo: el bloque .dark de figma.css declara esos cuatro tokens a 0. Usar
 *    la variable daria font-size 0 en tema oscuro, que es el tema obligatorio.
 *    Los valores literales son los del bloque claro, que si es correcto.
 *
 * 3. --chip-bg-* / --chip-text-* SI se usan tal cual, al contrario que en
 *    Button. Aqui no hace falta desviarse: los rellenos son pasteles claros en
 *    ambos modos (lime 400, lavender 100, gold 300, purered 400) y semantic.css
 *    ya corrige --chip-text-* a tinta oscura fija en claro y en oscuro. Un pill
 *    pastel con tinta oscura se lee bien sobre fondo oscuro.
 */

/* Por que rounded-(--radius-pill) y no rounded-pill:
 * tailwind-merge no conoce la clave `pill` de nuestro tema, asi que ante
 * `rounded-pill rounded-none` deja las dos clases y el override del consumidor
 * queda a merced del orden de la hoja de estilos. La forma de variable si entra
 * en su grupo `rounded`, resuelve el conflicto, y sigue apuntando al mismo
 * token --radius-pill (999px). */
const chip = cva(
  [
    "box-border inline-flex items-center justify-center rounded-(--radius-pill) select-none whitespace-nowrap",
  ],
  {
    variants: {
      variant: {
        /* CANONICO. Mono en mayusculas por CSS, +5% de tracking, sin borde. */
        feedback: "font-meta font-normal uppercase leading-none tracking-[0.05em]",
        /* EXTENSION. Alto 40, texto sans 14, borde de campo. */
        action: [
          "h-10 gap-2 px-[18px] font-sans text-sm",
          "border border-edge-2 bg-surface text-ink",
          "cursor-pointer transition-colors duration-140 ease-out",
          "hover:not-disabled:bg-surface-2 active:not-disabled:bg-edge",
          "disabled:cursor-not-allowed disabled:border-edge disabled:bg-surface disabled:text-ink-400",
        ],
        /* EXTENSION. Alto 36. El color lo fija el par selected true/false. */
        filter: [
          "h-9 gap-2 px-4 font-sans text-sm border",
          "cursor-pointer transition-colors duration-140 ease-out",
          "disabled:cursor-not-allowed disabled:border-edge disabled:bg-surface disabled:text-ink-400",
        ],
        /* EXTENSION. Alto 36, sin borde, padding asimetrico: el lado derecho
           deja 8 para que el boton de quitar respire dentro del pill. */
        value: "h-9 gap-2 bg-surface-2 pl-[14px] pr-2 font-sans text-sm text-ink",
      },

      /* Solo pinta en variant="feedback": son los 4 feedbacks del archivo. */
      tone: { info: "", success: "", warning: "", error: "" },

      /* Solo pinta en variant="feedback": las interactivas tienen alto fijo. */
      size: { xs: "", s: "", m: "", l: "" },

      /* Solo pinta en variant="filter". */
      selected: { true: "", false: "" },
    },

    compoundVariants: [
      /* fondo chip-bg-{feedback} + texto chip-text-{feedback} */
      {
        variant: "feedback",
        tone: "info",
        class: "bg-[var(--chip-bg-info)] text-[var(--chip-text-info)]",
      },
      {
        variant: "feedback",
        tone: "success",
        class: "bg-[var(--chip-bg-success)] text-[var(--chip-text-success)]",
      },
      {
        variant: "feedback",
        tone: "warning",
        class: "bg-[var(--chip-bg-warning)] text-[var(--chip-text-warning)]",
      },
      {
        variant: "feedback",
        tone: "error",
        class: "bg-[var(--chip-bg-error)] text-[var(--chip-text-error)]",
      },

      /* alto 20/22/26/28 · px 8/8/12/12 · texto 12/14/14/16 */
      { variant: "feedback", size: "xs", class: "h-5 px-2 text-xs" },
      { variant: "feedback", size: "s", class: "h-[22px] px-2 text-sm" },
      { variant: "feedback", size: "m", class: "h-[26px] px-3 text-sm" },
      { variant: "feedback", size: "l", class: "h-7 px-3 text-base" },

      /* Filtro apagado = campo; encendido = invierte a tinta. */
      {
        variant: "filter",
        selected: false,
        class: "border-edge-2 bg-surface text-ink hover:not-disabled:bg-surface-2",
      },
      {
        variant: "filter",
        selected: true,
        class: "border-ink bg-ink text-surface hover:not-disabled:bg-ink-800",
      },
    ],

    defaultVariants: { variant: "feedback", tone: "info", size: "s", selected: false },
  },
);

type ChipVariants = VariantProps<typeof chip>;

/** Tinta del punto de estado dentro de un chip: el hue de feedback, no el pastel. */
const CHIP_DOT: Record<NonNullable<ChipProps["dot"]>, string> = {
  success: "bg-fg-success",
  warning: "bg-fg-warning",
  error: "bg-fg-error",
  info: "bg-fg-info",
};

/* Icono de cierre dibujado a mano. packages/ui no depende de @phosphor-icons y
 * este encargo no puede añadir dependencias; una X de dos trazos no justifica
 * arrastrar una libreria entera. Hereda currentColor y va oculto al lector: el
 * nombre accesible lo pone el aria-label del boton que lo envuelve. */
function XGlyph() {
  return (
    <svg
      viewBox="0 0 12 12"
      width="11"
      height="11"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M3 3 9 9M9 3 3 9" />
    </svg>
  );
}

export interface ChipProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "color">,
    Omit<ChipVariants, "selected"> {
  /** Estado del filtro. Se expone como `aria-pressed` en `variant="filter"`. */
  selected?: boolean;
  /** Deshabilita las variantes interactivas y el boton de quitar. */
  disabled?: boolean;
  /** Icono antes del label. Ignorado en `variant="feedback"`: el chip del archivo no lleva icono. */
  startIcon?: React.ReactNode;
  /** Punto de estado de 8px antes del label, con el hue del feedback. */
  dot?: "info" | "success" | "warning" | "error";
  /** Contador al final del chip: pill de 20 en tinta solida, cifras tabulares. */
  count?: React.ReactNode;
  /**
   * Convierte el chip en removible y pinta la X.
   *
   * Ojo: un chip removible NUNCA es a su vez un boton, aunque se pida
   * `variant="action"` o `"filter"`. Un <button> dentro de otro <button> es
   * HTML invalido y el navegador rompe el arbol; ademas el usuario de teclado
   * no podria alcanzar la X. Con `onRemove` el contenedor baja a <span> y la
   * unica accion del chip es quitarlo.
   */
  onRemove?: () => void;
  /** Nombre accesible del boton de quitar. */
  removeLabel?: string;
}

/**
 * Chip del sistema Tikin.
 *
 * `variant="feedback"` es el componente del archivo de Figma: pildora pastel de
 * feedback puntual, sin icono ni borde. Las otras tres variantes son la
 * extension interactiva del documento — accion, filtro y valor seleccionado.
 *
 * El label del chip de feedback se pone en mayusculas por CSS, nunca con
 * `.toUpperCase()` en JS: eso romperia el texto que anuncia el lector de
 * pantalla y lo que el usuario copia al portapapeles.
 */
export const Chip = React.forwardRef<HTMLElement, ChipProps>(function Chip(
  {
    className,
    variant = "feedback",
    tone,
    size,
    selected = false,
    disabled = false,
    startIcon,
    dot,
    count,
    onRemove,
    removeLabel = "Quitar",
    children,
    ...props
  },
  ref,
) {
  /* El chip del archivo es solo pintura: ni icono, ni punto, ni contador, ni
     boton de quitar. Se ignoran a proposito en vez de renderizarlos para que
     nadie publique como "del archivo" algo que el archivo no define. */
  const esFeedback = variant === "feedback";
  const removible = !esFeedback && Boolean(onRemove);
  const esBoton = !esFeedback && !removible && (variant === "action" || variant === "filter");

  const clases = cn(
    chip({ variant, tone, size, selected, className }),
    // Solo lo que puede recibir foco pinta anillo de foco.
    esBoton &&
      "outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-page",
  );

  const contenido = (
    <>
      {!esFeedback && dot && (
        // El color ya lo comunica el label; el punto es decoracion.
        <span aria-hidden="true" className={cn("size-2 shrink-0 rounded-full", CHIP_DOT[dot])} />
      )}
      {!esFeedback && startIcon}
      {children}
      {!esFeedback && count !== undefined && count !== null && (
        <span className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-(--radius-pill) bg-ink px-[5px] font-meta text-[11px] tabular-nums text-surface">
          {count}
        </span>
      )}
      {removible && (
        <button
          type="button"
          // Boton propio: alcanzable con Tab, activable con Enter y Espacio sin
          // que tengamos que escribir un solo manejador de teclado.
          onClick={() => onRemove?.()}
          disabled={disabled}
          aria-label={removeLabel}
          className={cn(
            "inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full bg-edge text-ink-700",
            "transition-colors duration-140 ease-out hover:not-disabled:text-ink",
            "outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-1 focus-visible:ring-offset-surface-2",
            "disabled:cursor-not-allowed disabled:text-ink-400",
          )}
        >
          <XGlyph />
        </button>
      )}
    </>
  );

  if (esBoton) {
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        // Sin type explicito un <button> dentro de un <form> envia el
        // formulario: el chip de filtro vive justo en barras de busqueda.
        type="button"
        disabled={disabled}
        // Un filtro es un interruptor, no un enlace: aria-pressed es lo que
        // hace que el lector anuncie "activado"/"desactivado" al pulsarlo.
        aria-pressed={variant === "filter" ? selected : undefined}
        className={clases}
        {...(props as React.ComponentPropsWithoutRef<"button">)}
      >
        {contenido}
      </button>
    );
  }

  return (
    <span ref={ref as React.Ref<HTMLSpanElement>} className={clases} {...props}>
      {contenido}
    </span>
  );
});

/* -------------------------------------------------------------------------- */

const badge = cva(
  [
    "box-border inline-flex items-center rounded-(--radius-pill) select-none whitespace-nowrap",
    // Ubuntu Mono (font-meta), MAYUSCULAS por CSS y +2% de tracking.
    "font-meta font-normal uppercase tracking-[0.02em]",
    // Los numeros del label (V2.1, +3) siempre tabulares.
    "tabular-nums",
  ],
  {
    variants: {
      variant: {
        /* tint 50 de fondo + texto del hue. El color lo pone el par con tone. */
        soft: "",
        /* Ink solido: reservado a NUEVO y contadores. Invierte con el tema. */
        solid: "bg-ink-strong text-page",
        outline: "border border-edge-2 bg-transparent text-ink-600",
        /* Sin pildora: punto de 6 + label. Es una etiqueta de estado en linea. */
        dot: "gap-2 bg-transparent text-ink",
        /* Contador: circulo de 18 con mono 10. Para superponer sobre un icono. */
        count: "justify-center bg-ink-strong text-surface",
      },

      tone: {
        /* Cada tono expone su punto en una variable para que variant="dot" no
           necesite 5 combinaciones compuestas mas. */
        success: "[--tk-badge-dot:var(--colours-limegreen-400)]",
        warning: "[--tk-badge-dot:var(--colours-goldenyellow-300)]",
        error: "[--tk-badge-dot:var(--colours-purered-600)]",
        info: "[--tk-badge-dot:var(--colours-lavenderblue-100)]",
        neutral: "[--tk-badge-dot:var(--tk-400)]",
      },

      /* Alturas 20 / 24 / 28 de la regla "PILL TERMINAL". */
      size: {
        s: "h-5 px-2.5 text-[11px]",
        m: "h-6 px-3.5 text-xs",
        l: "h-7 px-4 text-xs",
      },
    },

    compoundVariants: [
      { variant: "soft", tone: "success", class: "bg-tint-success text-fg-success" },
      { variant: "soft", tone: "warning", class: "bg-tint-warning text-fg-warning" },
      { variant: "soft", tone: "error", class: "bg-tint-error text-fg-error" },
      { variant: "soft", tone: "info", class: "bg-tint-info text-fg-info" },
      { variant: "soft", tone: "neutral", class: "bg-surface-2 text-ink-700" },

      /* Un contador con relleno de acento lleva tinta estable: los acentos son
         claros en los dos temas, asi que text-surface se volveria ilegible. */
      { variant: "count", tone: "success", class: "bg-lime text-on-accent" },
      { variant: "count", tone: "warning", class: "bg-gold text-on-accent" },
      { variant: "count", tone: "error", class: "bg-red text-on-accent" },
      { variant: "count", tone: "info", class: "bg-lavender text-on-accent" },

      /* Estas dos van al final para ganarle al eje `size`, que en CVA se emite
         antes que las combinaciones compuestas. */
      { variant: "dot", class: "h-auto px-0 text-xs" },
      { variant: "count", class: "h-[18px] min-w-[18px] px-1 text-[10px] tracking-normal" },
    ],

    defaultVariants: { variant: "soft", tone: "neutral", size: "m" },
  },
);

type BadgeVariants = VariantProps<typeof badge>;

export interface BadgeProps
  extends Omit<React.ComponentPropsWithoutRef<"span">, "color" | "onClick">,
    BadgeVariants {}

/**
 * Badge del sistema Tikin — EXTENSION construida con los tokens del archivo.
 *
 * Suave (tint 50) para estados persistentes en listas; el pastel solido del
 * `Chip` queda para el feedback puntual; ink solido solo para NUEVO y
 * contadores.
 *
 * El badge nunca anida nada y nunca es clickeable: por eso el tipo omite
 * `onClick`. Si necesita accion es un chip-boton (`<Chip variant="action">`),
 * no un badge. El label va en MAYUSCULAS por CSS, no por JS.
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { className, variant, tone, size, children, ...props },
  ref,
) {
  return (
    <span ref={ref} className={cn(badge({ variant, tone, size, className }))} {...props}>
      {variant === "dot" && (
        <span
          aria-hidden="true"
          className="size-1.5 shrink-0 rounded-full bg-[var(--tk-badge-dot)]"
        />
      )}
      {children}
    </span>
  );
});
