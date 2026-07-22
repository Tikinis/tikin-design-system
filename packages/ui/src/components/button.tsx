import * as React from "react";
import * as Slot from "radix-ui/slot";
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
 * TODOS los valores (alturas, radios, padding, colores por estado) se clavan
 * contra la MATRIZ DE ESTADOS y los bloques TAMAÑOS/ANATOMIA de la seccion 05,
 * que pintan cada estado con los --tk-* semanticos —los que invierten con el
 * tema—. De ahi que los estados usen ink/surface/ink-strong/ink-400.. y no los
 * --button-* crudos de Figma: en LIGHT resuelven al mismo pixel, pero varios
 * --button-* no se redefinen en .dark y dejarian negro-sobre-negro.
 *
 * DESVIACIONES DELIBERADAS DOCUMENTADAS QUE APLICAN AQUI
 * -----------------------------------------------------
 * · #2 (token que no invierte -> --tk-* que si): el relleno del primary
 *   (--tk-ink/--tk-surface), el pressed y el loading (--tk-ink-strong /
 *   --tk-surface) y todos los grises de disabled (--tk-400..600) usan la capa
 *   --tk-* en vez de las primitivas fijas grayscale-light-*, que se quedaban
 *   negras sobre negro en oscuro.
 * · #5 (capa blanca literal): el aro del spinner del prototipo es
 *   rgba(255,255,255,.35), que solo aclara —en oscuro el relleno se vuelve claro
 *   y el aro blanco desaparece—. Se reproduce con color-mix sobre --tk-surface,
 *   que en claro ES ese mismo blanco y en oscuro invierte con el relleno.
 *
 * TAMAÑO S = LABEL 12px. La seccion 05 lo da explicito en DOS sitios (el resumen
 * "label 16 / 14 / 12 / 12" y el bloque TAMAÑOS, que pinta la S a font-size 12).
 * Figma trae 14 en --button-typo-size-s, pero su autoridad sobre pixeles solo
 * vale cuando el doc NO da el numero; aqui lo da, asi que manda el doc: 12.
 */

const button = cva(
  [
    "relative inline-flex items-center justify-center gap-2",
    // El label va SIEMPRE mono, MAYUSCULAS, +2% de tracking y nunca bold.
    "font-mono font-normal tracking-[0.02em] whitespace-nowrap uppercase",
    "cursor-pointer transition-colors duration-140 ease-[ease] select-none",
    "outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-page",
    "disabled:cursor-not-allowed",
    // Los iconos heredan el tamaño que fija cada size.
    "[&_svg]:size-[var(--tk-btn-icon)] [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        /* default bg tinta · hover 800/texto 200 · pressed y loading a ink-strong.
           hover y active llevan not-aria-disabled ademas de not-disabled: en
           loading (aria-disabled) el relleno tiene que quedarse en ink-strong y
           no saltar al 800 del hover con el raton encima del boton recien
           pulsado. */
        primary: [
          "bg-ink text-surface [--tk-btn-spinner:var(--tk-surface)]",
          "hover:not-disabled:not-aria-disabled:bg-ink-800 hover:not-disabled:not-aria-disabled:text-edge",
          "active:not-disabled:not-aria-disabled:bg-ink-strong active:not-disabled:not-aria-disabled:text-surface",
          // loading: mismo relleno oscuro que el pressed (aria-disabled solo se
          // pone en loading). El spinner blanco resalta sobre el.
          "aria-disabled:bg-ink-strong",
        ],
        /* Borde por inset shadow, no por border: asi no descuadra la altura.
           Fondo surface (no transparente): la matriz lo pinta asi y deja el
           hover surface->surface-2 con una base definida. */
        secondary: [
          "bg-surface text-ink shadow-[inset_0_0_0_1px_var(--tk-ink)] [--tk-btn-spinner:var(--tk-surface)]",
          "hover:not-disabled:not-aria-disabled:bg-surface-2",
          // En pressed invierte a tinta plena, sin borde y con texto surface.
          "active:not-disabled:not-aria-disabled:bg-ink-strong active:not-disabled:not-aria-disabled:text-surface active:not-disabled:not-aria-disabled:shadow-none",
          // loading: relleno ink-strong sin borde, identico al primary loading.
          "aria-disabled:bg-ink-strong aria-disabled:shadow-none",
        ],
        /* Ghost y link no cambian el fondo en pressed (transparencia 0). */
        ghost: [
          "bg-transparent text-ink [--tk-btn-spinner:var(--tk-ink)]",
          // hover: bg tk-border (el "gris 200" de la matriz), que invierte.
          "hover:not-disabled:bg-edge",
          "active:not-disabled:bg-transparent",
        ],
        // Link: subrayado a 3px de offset (matriz), texto ink que dimma a 600 en
        // hover. Siempre subrayado, tambien en disabled.
        link: [
          "bg-transparent text-ink underline underline-offset-[3px] [--tk-btn-spinner:var(--tk-ink)]",
          "hover:not-disabled:text-ink-600",
          "active:not-disabled:bg-transparent",
        ],
      },

      /* corner 12/10/8/6 · icono 16/16/12/12 · label 16/14/12/12 · px 24/20/16/12.
         --tk-btn-spin fija el diametro del aro de loading: 16 en L (demo) y 14 en
         M (matriz); en S/XS acompaña al icono a 12. */
      size: {
        l: "h-12 rounded-lg px-6 text-base [--tk-btn-icon:16px] [--tk-btn-spin:16px]",
        m: "h-10 rounded-md px-5 text-sm [--tk-btn-icon:16px] [--tk-btn-spin:14px]",
        s: "h-8 rounded-sm px-4 text-xs [--tk-btn-icon:12px] [--tk-btn-spin:12px]",
        xs: "h-7 rounded-xs px-3 text-xs [--tk-btn-icon:12px] [--tk-btn-spin:12px]",
      },

      family: {
        flow: "",
        /* Altura fija 40 y ancho al contenido, pase lo que pase con `size`. */
        compact: "h-10 rounded-md px-5 text-sm [--tk-btn-icon:16px] [--tk-btn-spin:14px]",
      },

      fullWidth: { true: "w-full", false: "" },
    },

    compoundVariants: [
      /* Disabled de la familia flow: invierte a gris 600 con texto 500, como
         pinta la matriz (bg var(--tk-600) · texto var(--tk-500)). Los --tk-*
         invierten con el tema; nunca opacidad sobre el boton entero. */
      {
        family: "flow",
        variant: "primary",
        class: "disabled:bg-ink-600 disabled:text-ink-500",
      },
      /* Disabled de la familia compacta: fondo claro. El doc lo nombra literal
         ("DISABLED CLARO bg-disabled-2"), y ese token SI invierte
         (light-200 -> dark-800). Su texto companero de Figma cae a dark-550 y
         queda casi invisible, asi que se usa la tinta del sistema (ink-600), que
         tambien invierte y se lee en los dos temas. */
      {
        family: "compact",
        variant: "primary",
        class: "disabled:bg-[var(--button-primary-bg-disabled-2)] disabled:text-ink-600",
      },
      /* Secondary disabled: borde y texto en tk-400 (matriz), que invierte. */
      {
        variant: "secondary",
        class: "disabled:text-ink-400 disabled:shadow-[inset_0_0_0_1px_var(--tk-400)]",
      },
      /* Ghost disabled: texto tk-500 (matriz). */
      {
        variant: "ghost",
        class: "disabled:bg-transparent disabled:text-ink-500",
      },
      /* Link disabled: texto tk-400 (matriz) — y CONSERVA el subrayado, que la
         matriz mantiene en los cuatro estados. */
      {
        variant: "link",
        class: "disabled:bg-transparent disabled:text-ink-400",
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
          {/* Aro con cabeza, como el prototipo: el anillo es la tinta del
              spinner al 35% y la cabeza la tinta plena. El doc lo pinta con
              rgba(255,255,255,.35) fijo, que solo aclara; el color-mix sobre
              --tk-surface da el mismo pixel en claro e invierte en oscuro
              (desviacion 5). Diametro por --tk-btn-spin (16/14/12). */}
          <span
            className={cn(
              "block size-[var(--tk-btn-spin)] shrink-0 rounded-full border-2",
              "border-[color-mix(in_srgb,var(--tk-btn-spinner)_35%,transparent)] border-t-[var(--tk-btn-spinner)]",
              // animate-spin de Tailwind gira a 1s; el documento pide 0.7s lineal.
              // Se reaprovecha su keyframe y solo se cambia la duracion.
              "animate-spin [animation-duration:0.7s]",
              // Un aro congelado se lee como interfaz rota: con prefers-reduced-motion
              // se ralentiza a un tercio en vez de pararse.
              "motion-reduce:[animation-duration:2.1s]",
            )}
          />
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
