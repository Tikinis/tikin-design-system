import * as React from "react";
import * as AccordionPrimitive from "radix-ui/accordion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/* Seccion 35 · Accordion — EXTENSION.
 *
 * El documento lo dice literalmente: "Extension construida con los tokens del
 * archivo". No existe ningun componente Accordion en el archivo de Figma; esto
 * es una propuesta coherente montada sobre los tokens --tk-* y la escala de
 * radios de la seccion 03. No lo trates como especificacion aprobada.
 *
 * Reglas de uso, del propio documento:
 *
 *   CHEVRON GIRA   El caret rota 180 grados al abrir, en 150ms. Toda la fila es
 *                  el disparador, no solo el icono.
 *   UNA O VARIAS   En FAQ, una abierta a la vez (las otras cierran) —
 *                  `type="single"`. En ajustes, varias a la vez —
 *                  `type="multiple"`.
 *   TITULO CLARO   La pregunta en Funnel 500 (font-display, font-medium); la
 *                  respuesta en Sans. No escondas informacion critica dentro
 *                  del acordeon.
 *
 * MEDIDAS, del HTML del prototipo (estilos inline)
 * ------------------------------------------------
 *   lista      flex columna, gap 10
 *   fila       borde 1px --tk-border, r12, overflow hidden
 *   trigger    padding 16, gap 12, hover fondo --tk-bg
 *   pregunta   Funnel Display 500, 15px, color --tk-ink
 *   caret      16px, color --tk-600, rotate 180 al abrir, transicion .15s
 *   respuesta  padding 0 16 16, 14px, line-height 1.55, color --tk-700
 *
 * DOS DECISIONES QUE SE APARTAN DEL PROTOTIPO
 * -------------------------------------------
 * 1. Sin animacion de altura al abrir. El prototipo tampoco la tiene (monta y
 *    desmonta el bloque de golpe) y animar la altura con Radix exige declarar
 *    keyframes sobre --radix-accordion-content-height en el tema compartido,
 *    que este componente no puede tocar. Lo unico que se anima es el caret,
 *    que es lo que el documento especifica.
 * 2. El anillo de foco va por dentro (`ring-inset`) y no con `ring-offset`.
 *    En `boxed` la fila lleva `overflow-hidden` para que el fondo del hover
 *    respete los r12, y un anillo con offset quedaria recortado justo por ese
 *    clip. Es el mismo idioma que ya usan list-item y menu-button para filas
 *    recortadas. En `flush` no hay clip, pero se conserva el mismo anillo para
 *    que el foco no cambie de forma al cambiar de piel.
 */

type AccordionVariant = "boxed" | "flush";

/* La variante viaja por contexto desde la raiz para que el consumidor no tenga
 * que repetirla en cada fila — y sobre todo para que no pueda desparejar la
 * piel de la fila con la del contenido. Mismo patron que Tabs. */
const AccordionVariantContext = React.createContext<AccordionVariant>("boxed");

const accordionRoot = cva("flex flex-col", {
  variants: {
    variant: {
      /* Cajas separadas 10 — el hueco del prototipo. */
      boxed: "gap-2.5",
      /* Lista continua: la separacion la da la linea de cada fila. */
      flush: "gap-0",
    },
  },
  defaultVariants: { variant: "boxed" },
});

const accordionItem = cva("", {
  variants: {
    variant: {
      /* `edge` es --tk-border, que SI invierte en tema oscuro. */
      boxed: "overflow-hidden rounded-lg border border-edge",
      /* La ultima fila no lleva linea: si no, dobla con el borde del contenedor. */
      flush: "border-b border-edge last:border-b-0",
    },
  },
  defaultVariants: { variant: "boxed" },
});

const accordionTrigger = cva(
  [
    // `group` es lo que permite al caret leer el data-state del trigger.
    "group flex w-full items-center gap-3 text-left",
    // La pregunta hereda la tinta del trigger para que el estado disabled la
    // apague de una sola vez, sin repetir color en el <span>.
    "text-ink",
    "cursor-pointer transition-colors duration-140 ease-out select-none",
    // Anillo por dentro: el idioma del sistema para filas que viven dentro de
    // un contenedor que recorta (list-item.tsx, menu-button.tsx).
    "outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-inset",
    "disabled:cursor-not-allowed disabled:text-ink-400",
  ],
  {
    variants: {
      variant: {
        /* `rounded-t-lg` no pinta nada por si mismo — el fondo ya lo recorta el
           `overflow-hidden` de la fila — pero hace que el anillo de foco siga la
           curva r12 arriba en vez de quedar con las esquinas mordidas. */
        boxed: "rounded-t-lg p-4 hover:not-disabled:bg-page",
        /* En flush no hay caja que recorte el hover, asi que la fila se separa
           12 de los lados para que el resalte no quede pegado al texto. */
        flush: "px-3 py-4 hover:not-disabled:bg-page",
      },
    },
    defaultVariants: { variant: "boxed" },
  },
);

const accordionContent = cva(
  [
    // La respuesta va en Sans (la familia por defecto), 14/1.55 y en ink-700:
    // un peldaño por debajo de la pregunta para que la jerarquia se lea sola.
    /* Sin estilos de foco: Radix no hace focusable el contenido y este
       componente tampoco le pone tabIndex, asi que un `focus-visible:` aqui
       nunca se dispararia. Lo que si importa es NO poner `outline-none`: el
       consumidor que le pase `tabIndex={-1}` para mover el foco al abrir se
       quedaria sin ningun indicador. Que herede el nativo. */
    "text-sm leading-[1.55] text-ink-700",
  ],
  {
    variants: {
      /* Sin padding superior: el aire ya lo pone el padding inferior del
         trigger, y duplicarlo separaria demasiado pregunta y respuesta. */
      variant: {
        boxed: "px-4 pb-4",
        flush: "px-3 pb-4",
      },
    },
    defaultVariants: { variant: "boxed" },
  },
);

/* Caret. Es el path de caret-down de Phosphor (regular, viewBox 256), que es la
 * libreria de iconos oficial del sistema. Va inline y no importado de
 * @phosphor-icons/react a proposito: el paquete no es dependencia de @tikin/ui
 * y el caret forma parte de la anatomia del componente, no del contenido que
 * pasa el consumidor. */
function Caret({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 256 256"
      fill="currentColor"
      // Decorativo: el estado abierto/cerrado ya lo dice aria-expanded en el
      // trigger, y el nombre accesible sale de la pregunta.
      aria-hidden="true"
      focusable="false"
      className={cn(
        "size-4 shrink-0 text-ink-600 transition-transform duration-150 ease-out",
        // Es el unico movimiento del componente, asi que es el unico que hay
        // que poder apagar con prefers-reduced-motion: el caret sigue girando,
        // pero salta al estado final en vez de recorrerlo.
        "motion-reduce:transition-none",
        "group-disabled:text-ink-400",
        // El trigger lleva la clase `group`; Radix le pone data-state=open al
        // abrir y el caret gira 180 grados.
        "group-data-[state=open]:rotate-180",
        className,
      )}
    >
      <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
    </svg>
  );
}

/* Radix tipa la raiz como una union discriminada por `type` (single | multiple),
 * y cada rama trae su propia forma de `value` / `onValueChange`. Se conserva tal
 * cual para que TypeScript siga impidiendo, por ejemplo, pasar un array a
 * `defaultValue` con type="single". */
type AccordionRootProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>;

export type AccordionProps = AccordionRootProps & {
  /**
   * Piel de la lista.
   *
   * - `boxed` — cada fila es una caja r12 con borde, separadas 10. Es la del
   *   prototipo del documento.
   * - `flush` — lista continua separada por lineas de 1px, sin caja. Para
   *   pantallas de ajustes dentro de una tarjeta que ya tiene su propio borde.
   */
  variant?: AccordionVariant;
};

/**
 * Raiz del acordeon — EXTENSION (seccion 35).
 *
 * Elige el modo con `type`, tal y como manda el bloque "UNA O VARIAS":
 *
 *     <Accordion type="single" collapsible>   FAQ: una abierta a la vez
 *     <Accordion type="multiple">             ajustes: varias a la vez
 *
 * `collapsible` es lo que permite cerrar la fila abierta volviendo a pulsarla.
 * Sin el, en `single` siempre queda una abierta — util para un asistente por
 * pasos, incomodo para un FAQ.
 *
 * No escondas aqui informacion critica: lo que el usuario necesita para decidir
 * va visible, no detras de un click.
 */
export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  function Accordion(props, ref) {
    // Se destructura tras el cast porque el rest de una union discriminada pierde
    // la relacion entre `type` y `value`; el cast de vuelta la restituye al
    // reenviar las props a Radix, que es quien las valida de verdad.
    const {
      className,
      variant = "boxed",
      ...rest
    } = props as AccordionRootProps & {
      variant?: AccordionVariant;
    };

    return (
      <AccordionVariantContext.Provider value={variant}>
        <AccordionPrimitive.Root
          ref={ref}
          className={cn(accordionRoot({ variant }), className)}
          {...(rest as AccordionRootProps)}
        />
      </AccordionVariantContext.Provider>
    );
  },
);

export interface AccordionItemProps
  extends
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>,
    VariantProps<typeof accordionItem> {}

/**
 * Fila del acordeon. `value` la identifica y `disabled` la bloquea: Radix la
 * saca de la navegacion por flechas ademas de impedir que se abra.
 */
export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  function AccordionItem({ className, variant, ...props }, ref) {
    const inherited = React.useContext(AccordionVariantContext);
    return (
      <AccordionPrimitive.Item
        ref={ref}
        className={cn(accordionItem({ variant: variant ?? inherited }), className)}
        {...props}
      />
    );
  },
);

export interface AccordionTriggerProps
  extends
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>,
    VariantProps<typeof accordionTrigger> {
  /**
   * Nivel del encabezado que envuelve al disparador. Por defecto 3, el de
   * Radix. Ajustalo al nivel que le toque en la pagina: un acordeon bajo un
   * `<h2>` deberia usar 3, pero bajo un `<h3>` toca 4.
   */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /**
   * Icono antes de la pregunta. Util en listas de ajustes.
   *
   * Se renderiza tal cual, sin envoltorio: el tamaño lo fijas tu en el propio
   * icono (`size-4` para los 16px de la escala del sistema, que es lo que pide
   * la fila). Mismo trato que `startIcon` en Chip.
   */
  startIcon?: React.ReactNode;
}

/**
 * Disparador de la fila. Toda la fila es el disparador, no solo el caret.
 *
 * Va envuelto siempre en un encabezado real, porque un lector de pantalla
 * navega los acordeones por la lista de encabezados. Envolverlo aqui y no
 * dejarlo en manos del consumidor evita el fallo tipico de tener el boton
 * suelto y perder esa navegacion.
 */
export const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  function AccordionTrigger(
    { className, variant, headingLevel = 3, startIcon, children, ...props },
    ref,
  ) {
    const inherited = React.useContext(AccordionVariantContext);
    const Heading = `h${headingLevel}` as "h2" | "h3" | "h4" | "h5" | "h6";

    return (
      // asChild deja que el nivel del encabezado lo decida el consumidor: el
      // Header de Radix es un <h3> fijo.
      <AccordionPrimitive.Header asChild>
        <Heading className="flex">
          <AccordionPrimitive.Trigger
            ref={ref}
            className={cn(accordionTrigger({ variant: variant ?? inherited }), className)}
            {...props}
          >
            {startIcon}
            {/* La pregunta en Funnel Display 500 a 15px. Ocupa el hueco libre
                para que el caret quede siempre pegado a la derecha. */}
            <span className="flex-1 font-display text-[15px] font-medium">{children}</span>
            <Caret />
          </AccordionPrimitive.Trigger>
        </Heading>
      </AccordionPrimitive.Header>
    );
  },
);

export interface AccordionContentProps
  extends
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>,
    VariantProps<typeof accordionContent> {}

/**
 * Respuesta de la fila. Radix la enlaza con el disparador por id y le pone
 * `role="region"`, asi que el lector de pantalla puede saltar directo a ella.
 *
 * Solo esta en el DOM cuando la fila esta abierta. Si necesitas que el
 * navegador encuentre el texto con Ctrl+F aunque este cerrada, pasa
 * `forceMount` y controla la visibilidad tu.
 */
export const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  function AccordionContent({ className, variant, ...props }, ref) {
    const inherited = React.useContext(AccordionVariantContext);
    return (
      <AccordionPrimitive.Content
        ref={ref}
        className={cn(accordionContent({ variant: variant ?? inherited }), className)}
        {...props}
      />
    );
  },
);
