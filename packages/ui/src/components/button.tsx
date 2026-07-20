import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/* Seccion 05 · Botones — CANONICO (del archivo de Figma).
 *
 * Dos familias con roles distintos, que nunca se mezclan en la misma vista:
 *
 *   flow     app movil. L a XS, full-width, ancladas abajo. Cierran un paso
 *            de un flujo: continuar, confirmar, enviar.
 *   compact  web/desktop. Altura fija 40, ancho al contenido, nunca
 *            full-width. Barras de acciones, tablas y headers.
 *
 * DOS DESVIACIONES DELIBERADAS RESPECTO A LOS TOKENS --button-* DE FIGMA
 * ---------------------------------------------------------------------
 * 1. Fondo y texto del primary usan --tk-ink / --tk-surface en vez de
 *    --button-primary-bg-default / --button-primary-text-default.
 *
 *    Motivo: esos dos tokens NO se redefinen en el bloque .dark de Figma. Se
 *    quedan en rgb(11,15,16) sobre blanco, asi que en tema oscuro darian un
 *    boton casi negro sobre una pagina casi negra. El prototipo del propio
 *    documento ya usa --tk-ink/--tk-surface por esta razon. Si algun dia Figma
 *    completa el modo oscuro de esos tokens, este es el sitio donde volver.
 *
 * 2. El tamaño S usa texto de 14px. Las tres fuentes discrepan:
 *       Figma  --button-typo-size-s ... 14
 *       Sec.03 "LABEL S · 32 · r8 · px 16 · texto 14"
 *       Sec.05 "label 16 / 14 / 12 / 12"  -> 12
 *    Gana 14 (Figma manda en valores, y ademas seccion 03 coincide).
 */

const button = cva(
  [
    "relative inline-flex items-center justify-center gap-2",
    // El label va SIEMPRE mono, MAYUSCULAS, +2% de tracking y nunca bold.
    "font-mono font-normal tracking-[0.02em] whitespace-nowrap uppercase",
    "cursor-pointer transition-colors duration-140 ease-out select-none",
    "outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-page",
    "disabled:cursor-not-allowed",
    // Los iconos heredan el tamaño que fija cada size.
    "[&_svg]:size-[var(--tk-btn-icon)] [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        /* default bg tinta · hover 800 · pressed 900 · disabled segun familia */
        primary: [
          "bg-ink text-surface [--tk-btn-spinner:var(--tk-surface)]",
          "hover:not-disabled:bg-ink-800 hover:not-disabled:text-surface-2",
          "active:not-disabled:bg-[var(--colours-grayscale-light-900)] active:not-disabled:text-white",
        ],
        /* Borde por inset shadow, no por border: asi no descuadra la altura. */
        secondary: [
          "bg-transparent text-ink shadow-[inset_0_0_0_1px_var(--tk-ink)] [--tk-btn-spinner:var(--tk-ink)]",
          "hover:not-disabled:bg-surface-2",
          // En pressed y loading invierte a tinta.
          "active:not-disabled:bg-[var(--colours-grayscale-light-900)] active:not-disabled:text-white",
        ],
        /* Ghost y link no cambian el fondo en pressed (transparencia 0). */
        ghost: [
          "bg-transparent text-ink [--tk-btn-spinner:var(--tk-ink)]",
          "hover:not-disabled:bg-[var(--button-ghost-bg-hover)]",
          "active:not-disabled:bg-transparent",
        ],
        link: [
          "bg-transparent text-[var(--link-text-default)] underline underline-offset-4 [--tk-btn-spinner:var(--link-text-default)]",
          "hover:not-disabled:bg-transparent hover:not-disabled:text-[var(--link-text-hover)]",
          "active:not-disabled:bg-transparent",
        ],
      },

      /* corner 12/10/8/6 · icono 16/16/12/12 · label 16/14/14/12 · px 24/20/16/12 */
      size: {
        l: "h-12 rounded-lg px-6 text-base [--tk-btn-icon:16px]",
        m: "h-10 rounded-md px-5 text-sm [--tk-btn-icon:16px]",
        s: "h-8 rounded-sm px-4 text-sm [--tk-btn-icon:12px]",
        xs: "h-7 rounded-xs px-3 text-xs [--tk-btn-icon:12px]",
      },

      family: {
        flow: "",
        /* Altura fija 40 y ancho al contenido, pase lo que pase con `size`. */
        compact: "h-10 rounded-md px-5 text-sm [--tk-btn-icon:16px]",
      },

      fullWidth: { true: "w-full", false: "" },
    },

    compoundVariants: [
      /* Disabled de la familia flow: invierte a gris 600 con texto 500.
         Nunca opacidad sobre el boton entero. */
      {
        family: "flow",
        variant: "primary",
        class:
          "disabled:bg-[var(--colours-grayscale-light-600)] disabled:text-[var(--colours-grayscale-light-500)] disabled:shadow-none",
      },
      /* Disabled de la familia compacta: fondo claro, valores literales de
         --button-primary-bg-disable / --button-primary-text-disable. */
      {
        family: "compact",
        variant: "primary",
        class:
          "disabled:bg-[var(--button-primary-bg-disable)] disabled:text-[var(--button-primary-text-disable)] disabled:shadow-none",
      },
      {
        variant: "secondary",
        class:
          "disabled:text-[var(--button-secondary-text-disabled)] disabled:shadow-[inset_0_0_0_1px_var(--button-secondary-stroke-disabled)]",
      },
      {
        variant: "ghost",
        class: "disabled:bg-transparent disabled:text-[var(--button-ghost-text-disabled)]",
      },
      {
        variant: "link",
        class:
          "disabled:bg-transparent disabled:text-[var(--link-text-disabled)] disabled:no-underline",
      },
      /* La familia compacta nunca es full-width. */
      { family: "compact", fullWidth: true, class: "w-auto" },
    ],

    defaultVariants: { variant: "primary", size: "l", family: "flow", fullWidth: false },
  },
);

type ButtonVariants = VariantProps<typeof button>;

export interface ButtonProps
  extends
    Omit<React.ComponentPropsWithoutRef<"button">, "color">,
    Omit<ButtonVariants, "fullWidth"> {
  /** Ocupa todo el ancho. Ignorado en `family="compact"`, que nunca es full-width. */
  fullWidth?: boolean;
  /**
   * Sustituye el label por un spinner sin que el ancho salte.
   * El boton queda deshabilitado mientras dura.
   */
  loading?: boolean;
  /** Icono antes del label. 16px en L y M, 12px en S y XS. */
  startIcon?: React.ReactNode;
  /** Icono despues del label. */
  endIcon?: React.ReactNode;
  /**
   * Renderiza el hijo en vez de un <button>, heredando los estilos.
   * Util para envolver un <Link> de tu router sin perder semantica.
   */
  asChild?: boolean;
}

/**
 * Boton del sistema Tikin.
 *
 * Una primaria por pantalla. Si dos acciones conviven lado a lado, la segunda
 * baja a `secondary`; la salida va en `ghost` debajo.
 *
 * El label se escribe en verbo directo y sin puntuacion — CONFIRMAR, ENVIAR —
 * y se pone en mayusculas por CSS, no en JS, para que el texto accesible y el
 * copiado al portapapeles conserven su capitalizacion original.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant,
    size,
    family,
    fullWidth,
    loading = false,
    startIcon,
    endIcon,
    asChild = false,
    disabled,
    children,
    type,
    onClick,
    ...props
  },
  ref,
) {
  const Comp = asChild ? Slot.Root : "button";

  /* `loading` NO usa el atributo disabled, a proposito. Dos razones:
   *
   * a11y — un boton deshabilitado deja de ser enfocable, asi que el foco del
   * usuario se pierde justo en mitad de la accion que acaba de lanzar. Con
   * aria-disabled + aria-busy el boton conserva el foco y el lector de
   * pantalla anuncia el cambio de estado.
   *
   * Estilos — las variantes `disabled:` llevan la pseudoclase :disabled, que
   * gana en especificidad a `text-transparent`. Con el atributo puesto, el
   * label reaparecia en gris por debajo del spinner en vez de desaparecer.
   * Medido en navegador: color rgb(166,166,166) en lugar de transparente. */
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (loading) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClick?.(event);
  };

  return (
    <Comp
      ref={ref}
      className={cn(
        button({ variant, size, family, fullWidth, className }),
        // El spinner SUSTITUYE al label, no lo acompaña, y el ancho no salta.
        // Se logra dejando el contenido en su sitio y volviendolo invisible por
        // color, en vez de envolverlo en un wrapper: un wrapper romperia
        // asChild, porque Slot fusionaria sus props sobre el wrapper en vez de
        // sobre el elemento que pasa el consumidor.
        loading && "cursor-wait text-transparent [&_svg]:invisible",
      )}
      // Sin asChild renderizamos un <button>, cuyo type por defecto en HTML es
      // "submit" — dentro de un form eso envia sin querer. Con asChild no lo
      // ponemos: el hijo puede ser un <a>, donde `type` no significa lo mismo.
      {...(asChild ? {} : { type: type ?? "button", disabled })}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      onClick={handleClick}
      {...props}
    >
      {loading && (
        // El color no puede salir de currentColor: el propio boton lo ha puesto
        // transparente para ocultar el label. Cada variante expone su tinta en
        // --tk-btn-spinner.
        <span
          className="absolute inset-0 flex items-center justify-center"
          // El estado ya lo comunica aria-busy en el boton.
          aria-hidden="true"
        >
          <span className="size-4 animate-spin rounded-full border-2 border-[var(--tk-btn-spinner)] border-t-transparent" />
        </span>
      )}
      {startIcon}
      {/* Slottable le dice a Slot cual de los hijos es el elemento del
          consumidor. Sin esto, con mas de un hijo Slot lanza
          "Expected a single React element child". */}
      <Slot.Slottable>{children}</Slot.Slottable>
      {endIcon}
    </Comp>
  );
});
