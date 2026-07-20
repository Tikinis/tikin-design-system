import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/* Seccion 06 · Links e icon buttons — MIXTO.
 *
 * Dos familias que comparten la misma tinta pero cumplen roles distintos:
 *
 *   Link        lleva a otro lugar. SIEMPRE subrayado: el color nunca puede ser
 *               la unica señal. Nunca ejecuta acciones destructivas ni de envio.
 *   IconButton  ejecuta una accion con un solo glifo y protege un target de 44.
 *
 * QUE ES CANONICO Y QUE ES EXTENSION
 * ----------------------------------
 * CANONICO (del archivo de Figma):
 *   - Los tokens --link-text-* existen en Figma y SI se redefinen en .dark.
 *   - Los tres tipos de link (inline / accion / externo) y su matriz de estados.
 *   - La escala 44 / 40 / 32 con glifo 20 / 18 / 16 y radio 12 / 10 / 8. El
 *     escalon de 32 con r8 y glifo 16 coincide con CalendarArrowButton, que si
 *     viene del archivo (docs/figma-export/components/CalendarArrowButton.jsx).
 *
 * EXTENSION (propuesta coherente construida con los tokens, NO especificacion
 * aprobada): la matriz de jerarquias del icon button — ghost, bordeado,
 * relleno, redondo y destructivo — con sus cuatro estados. El archivo de Figma
 * no exporta un icon button generico; solo piezas concretas (flechas de
 * calendario, stroked select/down) y el set de glifos.
 *
 * DESVIACIONES DELIBERADAS RESPECTO A LOS TOKENS DE FIGMA
 * -------------------------------------------------------
 * 1. El hover del link usa --tk-700 y no --link-text-hover.
 *    Motivo: en Figma --link-text-hover es identico a --link-text-default
 *    (grayscale-light-900 en claro, light-50 en oscuro), asi que el hover no
 *    daria ninguna respuesta visible. El prototipo del documento baja a
 *    --tk-700 y esa es la escala de estados que se implementa aqui.
 *
 * 2. El pressed y el disabled del destructivo no copian los literales del
 *    prototipo — rgb(255,224,224) y rgb(255,186,186) — porque son rojos claros
 *    fijos que en tema oscuro quedarian como una mancha blanca sobre negro. Se
 *    derivan de --tk-fg-error y --tk-tint-error con color-mix, que si invierten.
 */

/* ------------------------------------------------------------------ *
 * Link
 * ------------------------------------------------------------------ */

const link = cva(
  [
    // El foco se dibuja con un radio propio: el link no tiene caja visible.
    "rounded-xs outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-page",
    "transition-colors duration-140 ease-out",
  ],
  {
    variants: {
      variant: {
        /* Dentro de un parrafo. Hereda tamaño y familia del cuerpo (Ubuntu
           Sans 500) para no romper la linea base del texto que lo rodea. */
        inline: "inline font-sans font-medium",
        /* Fuera de un parrafo: mono, MAYUSCULAS por CSS, +2% de tracking. */
        action: "inline font-mono font-normal uppercase tracking-[0.02em] text-sm",
        /* Igual que accion pero con flecha. Va en inline-flex para alinear la
           flecha con la linea base del label sin trucos de vertical-align. */
        external:
          "inline-flex items-center gap-1.5 font-mono font-normal uppercase tracking-[0.02em] text-sm",
      },

      disabled: {
        /* Baja a neutral-500 y pierde el pointer, nunca el subrayado. */
        true: "text-ink-500 cursor-default",
        false: [
          "text-ink cursor-pointer",
          "hover:text-ink-700",
          // Pressed sube a tinta fuerte; el grosor del subrayado lo pone el
          // label con group-active (ver `linkLabel`).
          "active:text-ink-strong",
        ],
      },
    },

    defaultVariants: { variant: "inline", disabled: false },
  },
);

/* El subrayado vive en el label, no en la raiz. Si estuviese en la raiz, la
   flecha del tipo externo quedaria subrayada tambien: text-decoration se
   propaga a los descendientes en flujo y un hijo no puede cancelarla. */
const linkLabel = cva("underline group-active:decoration-2", {
  variants: {
    variant: {
      inline: "underline-offset-2",
      action: "underline-offset-[3px]",
      external: "underline-offset-[3px]",
    },
  },
  defaultVariants: { variant: "inline" },
});

/**
 * Flecha del link externo. Es el glifo `arrow-up-right` de Phosphor —la
 * libreria oficial del sistema— inlineado porque este paquete no depende de
 * phosphor-react. Se sustituye con la prop `icon` si el consumidor ya la tiene.
 */
function ArrowUpRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth={16}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <line x1="64" y1="192" x2="192" y2="64" />
      <polyline points="88 64 192 64 192 168" />
    </svg>
  );
}

type LinkVariants = VariantProps<typeof link>;

export interface LinkProps
  extends Omit<React.ComponentPropsWithoutRef<"a">, "type">,
    Omit<LinkVariants, "disabled"> {
  /**
   * Deshabilita la navegacion. Como `<a>` no admite el atributo `disabled`, se
   * retira el href: eso lo saca del orden de tabulacion igual que haria un
   * control nativo deshabilitado, y ademas el navegador deja de navegar.
   */
  disabled?: boolean;
  /** Sustituye la flecha del tipo `external`. */
  icon?: React.ReactNode;
  /**
   * Renderiza el hijo en vez de un `<a>`, heredando los estilos. Para envolver
   * el Link de tu router sin perder ni la semantica ni el subrayado del label.
   */
  asChild?: boolean;
}

/**
 * Enlace del sistema Tikin.
 *
 * Navega, nunca ejecuta. Si la accion envia, borra o confirma algo, no es un
 * link: es un boton.
 *
 * El label del tipo `action` se pone en mayusculas por CSS y no en JS, para que
 * el texto accesible y lo que se copia al portapapeles conserven su
 * capitalizacion original.
 */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  {
    className,
    variant = "inline",
    disabled = false,
    icon,
    asChild = false,
    href,
    target,
    rel,
    onClick,
    children,
    ...props
  },
  ref,
) {
  const Comp = asChild ? Slot.Root : "a";

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClick?.(event);
  };

  const opensNewTab = target === "_blank";
  // Una pestaña nueva sin noopener deja a la pagina destino manipular
  // window.opener. Se añade siempre, sin pisar el rel que ya venga ni repetir
  // los tokens que el consumidor ya haya escrito.
  const safeRel = opensNewTab
    ? [...new Set([...(rel ?? "").split(/\s+/).filter(Boolean), "noopener", "noreferrer"])].join(" ")
    : rel;

  return (
    <Comp
      ref={ref}
      // `group` habilita el group-active del subrayado de 2px en pressed.
      className={cn("group", link({ variant, disabled, className }))}
      // Sin href el elemento deja de ser un link para el arbol de
      // accesibilidad y sale del orden de tabulacion. Es lo mas parecido a un
      // control deshabilitado nativo: aria-disabled sobre un <a> con href sigue
      // siendo activable con el teclado en la mayoria de navegadores.
      // Con asChild el href lo pone el consumidor y Slot le da prioridad, asi
      // que ahi el bloqueo se queda en aria-disabled + preventDefault.
      {...(disabled ? { "aria-disabled": true } : { href })}
      target={target}
      rel={safeRel}
      onClick={handleClick}
      {...props}
    >
      {/* La API de render-prop de Slottable envuelve el CONTENIDO del elemento
          del consumidor, no lo sustituye. Es la unica forma de que el subrayado
          caiga sobre el label —y no sobre la flecha— tambien con asChild. */}
      <Slot.Slottable child={children}>
        {/* El tipo de `label` se anota a mano: SlottableProps es una union y TS
            no puede inferir el parametro de la render-prop desde ahi. */}
        {(label: React.ReactNode) => <span className={linkLabel({ variant })}>{label}</span>}
      </Slot.Slottable>
      {variant === "external" && (icon ?? <ArrowUpRight className="size-3.5 shrink-0" />)}
      {/* El icono es decorativo; el aviso de pestaña nueva tiene que llegar al
          lector de pantalla como texto. */}
      {opensNewTab && <span className="sr-only"> (abre en una pestaña nueva)</span>}
    </Comp>
  );
});

/* ------------------------------------------------------------------ *
 * IconButton
 * ------------------------------------------------------------------ */

const iconButton = cva(
  [
    "relative inline-flex items-center justify-center shrink-0",
    "cursor-pointer transition-colors duration-140 ease-out select-none",
    "outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-page",
    "disabled:cursor-not-allowed",
    // El glifo manda su tamaño por variable. Se fija por partida doble para
    // cubrir los dos formatos del sistema: SVG (Phosphor React) e icono de
    // fuente, que se escala con font-size.
    "[&_svg]:shrink-0 [&_svg]:size-[var(--tk-ib-glyph)] text-[length:var(--tk-ib-glyph)]",
  ],
  {
    variants: {
      variant: {
        /* Por defecto en app bars y toolbars: sin caja hasta que se toca. */
        ghost: [
          "bg-transparent text-ink",
          "hover:not-disabled:bg-surface-2 active:not-disabled:bg-edge",
          "disabled:text-ink-400",
        ],
        /* Borde por inset shadow, no por border: asi el 1px no come del
           tamaño de la caja y 44 sigue siendo 44. */
        outline: [
          "bg-transparent text-ink shadow-[inset_0_0_0_1px_var(--tk-ink)]",
          "hover:not-disabled:bg-surface-2 active:not-disabled:bg-edge",
          "disabled:text-ink-400 disabled:shadow-[inset_0_0_0_1px_var(--tk-400)]",
        ],
        /* Una sola accion primaria por barra. */
        solid: [
          "bg-ink text-surface",
          "hover:not-disabled:bg-ink-800 active:not-disabled:bg-ink-strong",
          "disabled:bg-edge disabled:text-ink-500",
        ],
        /* Eliminar. El tinte se deriva de los semanticos de error para que
           invierta en tema oscuro. */
        destructive: [
          "bg-transparent text-fg-error",
          "hover:not-disabled:bg-tint-error",
          "active:not-disabled:bg-[color-mix(in_srgb,var(--tk-fg-error)_12%,var(--tk-tint-error))]",
          "disabled:text-[color-mix(in_srgb,var(--tk-fg-error)_45%,transparent)]",
        ],
      },

      /* 44 · glifo 20 · r12 | 40 · glifo 18 · r10 | 32 · glifo 16 · r8 */
      size: {
        l: "size-11 rounded-lg [--tk-ib-glyph:20px] [--tk-ib-badge:8px]",
        m: "size-10 rounded-md [--tk-ib-glyph:18px] [--tk-ib-badge:8px]",
        s: "size-8 rounded-sm [--tk-ib-glyph:16px] [--tk-ib-badge:6px]",
      },

      shape: {
        square: "",
        round: "rounded-pill",
      },

      /* El glifo mide 16-20 pero el area tactil minima es 44. Se amplia con un
         pseudoelemento en vez de con padding para no mover la caja visible. */
      hitArea: {
        true: "after:absolute after:top-1/2 after:left-1/2 after:size-11 after:-translate-x-1/2 after:-translate-y-1/2 after:content-['']",
        false: "",
      },
    },

    compoundVariants: [
      // A 44 el propio boton ya es el target: el pseudoelemento sobraria y solo
      // serviria para pisar al vecino, que va a gap 4-8.
      { size: "l", hitArea: true, class: "after:hidden" },
    ],

    defaultVariants: { variant: "ghost", size: "l", shape: "square", hitArea: true },
  },
);

type IconButtonVariants = VariantProps<typeof iconButton>;

export interface IconButtonProps
  extends Omit<React.ComponentPropsWithoutRef<"button">, "color">,
    IconButtonVariants {
  /**
   * Verbo de la accion: "Escanear QR", "Filtrar". Obligatorio — un boton de
   * solo glifo sin nombre accesible no existe para un lector de pantalla.
   * NO se pasa a mayusculas: eso es convencion del label visible, y un lector
   * de pantalla deletrearia las siglas.
   */
  label: string;
  /** Punto de 6px. Marca estado activo, por ejemplo un filtro aplicado. */
  badge?: boolean;
  /** Renderiza el hijo en vez de un `<button>`, heredando los estilos. */
  asChild?: boolean;
}

/**
 * Boton de un solo glifo.
 *
 * Si la accion necesita un verbo visible no es un icon button, es un boton con
 * label. El glifo sale siempre de la libreria del sistema (Phosphor); no se
 * dibujan flechas propias.
 */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  {
    className,
    variant,
    size,
    shape,
    hitArea,
    label,
    badge = false,
    asChild = false,
    type,
    title,
    children,
    ...props
  },
  ref,
) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      ref={ref}
      className={cn(iconButton({ variant, size, shape, hitArea, className }))}
      // El nombre accesible siempre lo pone aria-label; el title solo añade el
      // tooltip del raton, que es lo unico que le queda a un usuario que no
      // reconoce el glifo.
      aria-label={label}
      title={title ?? label}
      // Un <button> sin type dentro de un form envia el formulario. Con asChild
      // no se pone: el hijo puede ser un <a>, donde type no significa lo mismo.
      {...(asChild ? {} : { type: type ?? "button" })}
      {...props}
    >
      {badge && (
        <span
          // Decorativo: el estado que representa se comunica en el label o con
          // aria-pressed, no con un punto de color.
          aria-hidden="true"
          className="absolute size-1.5 rounded-full bg-red"
          style={{ top: "var(--tk-ib-badge)", right: "var(--tk-ib-badge)" }}
        />
      )}
      {/* Slottable marca cual de los hijos es el elemento del consumidor.
          Sin esto, con mas de un hijo Slot lanza "Expected a single React
          element child". */}
      <Slot.Slottable>{children}</Slot.Slottable>
    </Comp>
  );
});
