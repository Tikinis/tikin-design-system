import * as React from "react";
import * as RadixRadioGroup from "radix-ui/radio-group";
import * as TabsPrimitive from "radix-ui/tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/* Seccion 08 · Tabs & controles — MIXTO.
 *
 * Tres pieles para las pestañas con paneles, con procedencias distintas que NO
 * se pueden confundir:
 *
 *   segmented   CANONICO · del archivo de Figma. Riel r12 sobre superficie con
 *               borde de 1px, altura 40, padding 4; la activa es un bloque gris
 *               r10. Label mono 14 en MAYUSCULAS, +2% tracking, icono 16 y gap
 *               6. Se usa para filtrar la misma lista, con contador en la
 *               activa.
 *   soft        EXTENSION · no esta en el archivo. Riel r12 sobre surface-2,
 *               activa = tarjeta (superficie elevada r8 con borde edge de 1px y
 *               sombra xs). Para alternar modos dentro de una tarjeta.
 *   underline   EXTENSION · no esta en el archivo. Sin riel: linea de 1px bajo
 *               toda la fila y subrayado de 2px en tinta bajo la activa. Para
 *               navegacion de pagina con 3+ secciones.
 *
 * REGLA DE SELECCION: la activa se marca SIEMPRE en tinta (pildora, tarjeta o
 * subrayado). Nunca en lima ni en ningun otro acento. Inactivas en ink-600,
 * hover a tinta.
 *
 * DOS PRIMITIVAS, UNA PIEL
 * -----------------------
 * `Tabs` monta Radix Tabs porque hay paneles que intercambiar. `SegmentedControl`
 * NO: el uso del archivo es filtrar una lista que ya esta en pantalla, asi que
 * monta Radix RadioGroup y sus opciones son `role="radio"`, no `role="tab"`.
 * Un `tab` sin `tabpanel` al que apuntar no es conforme con la APG, y disfrazarlo
 * borrando el `aria-controls` que Radix pone solo tapaba el sintoma. Comparten la
 * geometria del archivo (`segmentedSkin`), no la semantica.
 *
 * DESVIACIONES DELIBERADAS RESPECTO AL PROTOTIPO
 * ----------------------------------------------
 * 1. En underline, la inactiva lleva un borde inferior TRANSPARENTE de 2px en
 *    vez de no llevar borde. Con `border:none` la fila se movia 2px cada vez
 *    que cambiaba la seleccion.
 * 2. El bloque "EN VIVO · PRUEBALO" enseña una PILDORA DESLIZANTE (riel r999,
 *    padding 8/16, mono 13) y un toggle con muelle. Es una demo de MOTION con
 *    geometria propia, no la del archivo: manda "SEGMENTED CONTROL · DEL
 *    ARCHIVO" (riel r12, h40, mono 14), asi que NO se monta el indicador
 *    deslizante. El _pop de seleccion, en cambio, SI es del archivo —lo
 *    disparan selectSeg/selectSoft/selectUnder sobre las tres pieles
 *    canonicas— y se reproduce con @keyframes (ver TAB_POP_KEYFRAMES).
 *
 * PESO DE LA ACTIVA: el prototipo sube el label activo del segmentado a 500 y
 * aqui SI se copia (`data-[state=active]:font-medium`). El label es
 * monoespaciado (Ubuntu Sans Mono y todos sus fallbacks), asi que el avance de
 * cada glifo es fijo y el cambio de grosor NO desplaza al resto de pestañas.
 * La activa va ademas en `--tk-ink-strong` (la tinta del archivo, mas
 * contrastada que `--tk-ink` y que invierte a blanco puro en oscuro).
 */

type TabsVariant = "segmented" | "soft" | "underline";

/* La variante viaja por contexto desde la raiz para que el consumidor no tenga
 * que repetirla en cada trigger — y sobre todo para que no pueda desparejar la
 * piel del riel con la de las pestañas. */
const TabsVariantContext = React.createContext<TabsVariant>("segmented");

/* POP DE SELECCION DEL ARCHIVO
 * ---------------------------
 * El prototipo dispara `_pop` al elegir cada pestaña: scale [1, 0.9, 1] (0.94 en
 * underline) con un muelle stiffness 520 / damping 14 (~0.35s). Ese muelle esta
 * subamortiguado (damping ratio ~0.31), asi que hunde y rebota un poco por
 * encima de 1 antes de asentar. CSS no tiene muelles, asi que se aproxima con
 * una parada de hundimiento y un sobreimpulso corto (keyframe multi-parada),
 * como manda la guia de animaciones.
 *
 * Se aplica sobre `data-[state=active|checked]`, asi que tambien corre una vez
 * en el montaje para la pestaña por defecto; es un pop sutil de entrada,
 * coherente con el resto de animaciones de aparicion del documento.
 *
 * React 19 hoista a <head> cualquier <style> con `href` + `precedence` y lo
 * deduplica por href, asi que la regla entra una sola vez aunque haya varios
 * grupos montados. */
const TAB_POP_KEYFRAMES = `
@keyframes tk-tab-pop {
  0%   { transform: scale(1); }
  20%  { transform: scale(0.9); }
  40%  { transform: scale(0.885); }
  62%  { transform: scale(1.035); }
  80%  { transform: scale(0.99); }
  100% { transform: scale(1); }
}
@keyframes tk-tab-pop-sm {
  0%   { transform: scale(1); }
  20%  { transform: scale(0.94); }
  40%  { transform: scale(0.93); }
  62%  { transform: scale(1.02); }
  80%  { transform: scale(0.995); }
  100% { transform: scale(1); }
}`;

const tabsList = cva("flex", {
  variants: {
    variant: {
      /* Riel del archivo: bg 253 sobre borde 225. Se mapea a surface + edge
       * (230) porque son los tokens que SI invierten en tema oscuro; un
       * rgb(253,253,253) literal daria un riel blanco sobre pagina negra.
       * El borde va por inset shadow y no por `border` para que el riel mida
       * exactamente 40 sin depender de box-sizing. */
      segmented:
        "h-control-m w-fit items-stretch rounded-lg bg-surface p-1 shadow-[inset_0_0_0_1px_var(--tk-border)]",
      soft: "w-fit items-stretch gap-0.5 rounded-lg bg-surface-2 p-1",
      /* La linea de 1px recorre toda la fila; la activa la tapa con 2px. */
      underline: "items-stretch gap-7 border-b border-edge",
    },
  },
  defaultVariants: { variant: "segmented" },
});

/* Base comun a las tres pieles Y al control segmentado. Se extrae porque
 * SegmentedControlItem ya no pasa por TabsTrigger: sale de otra primitiva. */
const triggerBase = [
  "relative inline-flex items-center justify-center gap-1.5 whitespace-nowrap",
  // Label mono, MAYUSCULAS por CSS, +2% de tracking y nunca bold.
  "font-mono font-normal tracking-[0.02em] uppercase",
  "cursor-pointer transition-colors duration-140 ease-[ease] select-none",
  "outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2",
  "disabled:cursor-not-allowed disabled:text-ink-400",
  // Icono 16 en el segmentado del archivo; se mantiene en las extensiones.
  "[&_svg]:size-4 [&_svg]:shrink-0",
];

/* Geometria y color del segmentado del archivo SIN el estado seleccionado: cada
 * primitiva de Radix nombra ese estado a su manera (`data-state=active` en Tabs,
 * `data-state=checked` en RadioGroup), y Tailwind necesita la clase literal en
 * el fuente, asi que la linea del estado se escribe en cada sitio. */
const segmentedSkin = [
  "rounded-md px-3 py-1.5 text-sm",
  "text-ink-600 hover:not-disabled:text-ink",
  // El offset del anillo tiene que ser del color del riel, no de la pagina, o
  // se ve un halo claro dentro del segmentado.
  "focus-visible:ring-offset-surface",
];

const tabsTrigger = cva(triggerBase, {
  variants: {
    variant: {
      segmented: [
        ...segmentedSkin,
        // activa: bloque gris 238 = surface-3 (en oscuro sube a 58), texto en
        // --tk-ink-strong y peso 500, tal cual el archivo. El peso no descuadra
        // la fila porque la fuente es monoespaciada (avance de glifo fijo).
        "data-[state=active]:bg-surface-3 data-[state=active]:font-medium data-[state=active]:text-ink-strong",
        // Pop de seleccion del archivo (_pop 0.9, muelle 520/14, ~0.35s).
        "data-[state=active]:animate-[tk-tab-pop_350ms_ease-out]",
        "motion-reduce:data-[state=active]:data-[state=active]:animate-none",
      ],
      soft: [
        "rounded-sm px-6 py-[9px] text-[13px]",
        "text-ink-600 hover:not-disabled:text-ink",
        // Borde 1px del archivo: transparente en la inactiva y edge (--tk-border)
        // en la activa, para que la tarjeta no cambie de tamaño al seleccionar.
        "border border-transparent",
        /* La activa es una tarjeta ELEVADA sobre el riel. En claro eso es
         * surface (255) sobre surface-2 (243), pero la escala se invierte en
         * oscuro: alli surface es 27 y surface-2 es 36, asi que reusar surface
         * dejaria la activa MAS OSCURA que el riel y se leeria como un hueco.
         * En oscuro la elevacion la da surface-3 (58).
         * Va por variable propia y no por un `dark:bg-...` para no partir el
         * override del consumidor: con dos clases de fondo bajo modificadores
         * distintos, tailwind-merge solo descartaria una y en oscuro seguiria
         * mandando la nuestra. Asi un `data-[state=active]:bg-*` del consumidor
         * gana en los dos temas. */
        "[--tk-tab-soft-active:var(--tk-surface)] dark:[--tk-tab-soft-active:var(--tk-surface-3)]",
        "data-[state=active]:border-edge data-[state=active]:bg-[var(--tk-tab-soft-active)] data-[state=active]:text-ink-strong data-[state=active]:shadow-xs",
        "focus-visible:ring-offset-surface-2",
        // Pop de seleccion del archivo (_pop 0.9, muelle 520/14, ~0.35s).
        "data-[state=active]:animate-[tk-tab-pop_350ms_ease-out]",
        "motion-reduce:data-[state=active]:data-[state=active]:animate-none",
      ],
      underline: [
        "-mb-px border-b-2 border-transparent px-0.5 pt-2.5 pb-3 text-[13px]",
        "text-ink-600 hover:not-disabled:text-ink",
        // Subrayado 2px y texto en --tk-ink-strong (la tinta del archivo).
        "data-[state=active]:border-ink-strong data-[state=active]:text-ink-strong",
        "focus-visible:ring-offset-page",
        // Pop de seleccion del archivo (_pop 0.94 → hunde menos, muelle 520/14).
        "data-[state=active]:animate-[tk-tab-pop-sm_350ms_ease-out]",
        "motion-reduce:data-[state=active]:data-[state=active]:animate-none",
      ],
    },
  },
  defaultVariants: { variant: "segmented" },
});

/* Misma piel que la variante `segmented`, pero para la primitiva RadioGroup:
 * alli el estado seleccionado se llama `checked`. */
const segmentedControlItem = [
  ...triggerBase,
  ...segmentedSkin,
  // Misma piel activa que la variante segmentada (fondo 238, texto ink-strong,
  // peso 500), pero el estado se llama `checked` en RadioGroup.
  "data-[state=checked]:bg-surface-3 data-[state=checked]:text-ink-strong data-[state=checked]:font-medium",
  // Mismo pop del archivo (_pop 0.9) al elegir la opcion.
  "data-[state=checked]:animate-[tk-tab-pop_350ms_ease-out]",
  "motion-reduce:data-[state=checked]:data-[state=checked]:animate-none",
];

export interface TabsProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
  /**
   * Piel del control. `segmented` es la del archivo de Figma; `soft` y
   * `underline` son extensiones propuestas.
   */
  variant?: TabsVariant;
}

/**
 * Raiz de un grupo de pestañas con paneles.
 *
 * Solo horizontal: el documento no define pestañas verticales, asi que no se
 * expone `orientation` como novedad — Radix la acepta igualmente si alguien la
 * pasa, pero los estilos estan pensados para una fila.
 *
 * `activationMode="automatic"` (el de Radix) cambia de panel al mover el foco
 * con las flechas. Si cada panel carga datos, pasa `manual` para que la flecha
 * solo mueva el foco y sea Enter/Espacio quien active.
 */
export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { className, variant = "segmented", children, ...props },
  ref,
) {
  return (
    <TabsVariantContext.Provider value={variant}>
      <TabsPrimitive.Root ref={ref} className={cn("flex flex-col", className)} {...props}>
        {/* Los @keyframes del pop; React 19 los hoista a <head> y los deduplica
            por href, asi que no ensucian el DOM del grupo. */}
        <style href="tk-tab-pop" precedence="default">
          {TAB_POP_KEYFRAMES}
        </style>
        {children}
      </TabsPrimitive.Root>
    </TabsVariantContext.Provider>
  );
});

export interface TabsListProps
  extends
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsList> {}

/** Riel que agrupa las pestañas. Toma la variante de la raiz. */
export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(function TabsList(
  { className, variant, ...props },
  ref,
) {
  const inherited = React.useContext(TabsVariantContext);
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(tabsList({ variant: variant ?? inherited }), className)}
      {...props}
    />
  );
});

export interface TabsTriggerProps
  extends
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTrigger> {
  /** Icono antes del label, a 16px. En el segmentado del archivo va con gap 6. */
  startIcon?: React.ReactNode;
}

/**
 * Pestaña.
 *
 * El label va en una sola palabra y en MAYUSCULAS por CSS, nunca con
 * `.toUpperCase()`: asi el nombre accesible y lo que se copia al portapapeles
 * conservan su capitalizacion. El ancho lo da el contenido; las pestañas no se
 * estiran a partes iguales.
 *
 * El contador que pide el documento va dentro del boton y CUENTA para el nombre
 * accesible ("Todos 12"). No lo escondas con `aria-hidden`: el numero es el
 * dato. Si ademas quieres la unidad, ponla en un `aria-label` que contenga el
 * texto visible ("Todos 12 recibos") — un `<span class="sr-only">` aparte no
 * sirve, porque el algoritmo de nombre accesible recorta los espacios de cada
 * nodo y quedaria "12recibos".
 */
export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  function TabsTrigger({ className, variant, startIcon, children, ...props }, ref) {
    const inherited = React.useContext(TabsVariantContext);
    return (
      <TabsPrimitive.Trigger
        ref={ref}
        className={cn(tabsTrigger({ variant: variant ?? inherited }), className)}
        {...props}
      >
        {startIcon}
        {children}
      </TabsPrimitive.Trigger>
    );
  },
);

export type TabsContentProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>;

/**
 * Panel asociado a una pestaña. Radix lo enlaza por id y lo hace enfocable,
 * para que el tabulador entre al contenido justo despues del riel.
 *
 * No lleva padding propio a proposito: el hueco entre riel y panel depende del
 * contenedor (en underline el documento usa 18px, en el segmentado el panel es
 * una tarjeta con su propio padding).
 */
export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(function TabsContent(
  { className, ...props },
  ref,
) {
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        "text-sm leading-[1.55] text-ink-800",
        "outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-page",
        className,
      )}
      {...props}
    />
  );
});

/* CONTROL SEGMENTADO — POR QUE RADIOGROUP Y NO TABS
 * -------------------------------------------------
 * El segmentado del archivo se usa para filtrar una lista que YA esta en
 * pantalla, no para intercambiar paneles. Un `role="tab"` sin `tabpanel` al que
 * apuntar no es conforme con la APG: el lector de pantalla anuncia una pestaña y
 * el usuario busca una region que no existe. Montarlo sobre Radix Tabs y borrar
 * despues el `aria-controls` tapaba el sintoma y ademas dependia del orden en el
 * que Radix hace el spread de props, que es un detalle interno sin contrato.
 *
 * RadioGroup da la semantica correcta (grupo de opciones excluyentes sobre el
 * mismo contenido) y el mismo comportamiento de teclado: una sola parada de
 * tabulador, flechas con vuelta y deshabilitadas saltadas.
 *
 * QUE SE PIERDE: `activationMode="manual"`. En un radiogroup la flecha SIEMPRE
 * selecciona, igual que en los radios nativos. Si necesitas que la flecha solo
 * mueva el foco, lo que quieres son pestañas con paneles: `<Tabs
 * variant="segmented" activationMode="manual">`.
 */

export interface SegmentedControlProps extends Omit<
  React.ComponentPropsWithoutRef<typeof RadixRadioGroup.Root>,
  "asChild" | "orientation"
> {
  /**
   * id de la region que este control filtra (la lista, la tabla, la tarjeta).
   * Es azucar sobre `aria-controls` del grupo: si lo pasas a mano, manda el tuyo.
   */
  controls?: string;
}

/**
 * Control segmentado — CANONICO, del archivo de Figma.
 *
 * Riel de 40 de alto, r12, borde de 1px; la opcion activa es un bloque gris
 * r10. Pensado para filtrar la misma lista ("TODOS · PENDIENTES · PAGADOS"),
 * con el contador dentro de la activa.
 *
 * Es un `radiogroup`, no un `tablist`: sus opciones son `role="radio"`. El riel
 * ES la raiz, asi que `className` y la ref van a un unico elemento y `w-fit` se
 * puede sustituir desde fuera (`<SegmentedControl className="w-full">` ocupa
 * todo el ancho).
 *
 * Si lo que necesitas es intercambiar paneles, usa `<Tabs variant="segmented">`
 * con `TabsContent`: ahi la relacion pestaña ↔ panel la cablea Radix.
 */
export const SegmentedControl = React.forwardRef<HTMLDivElement, SegmentedControlProps>(
  function SegmentedControl({ className, controls, children, ...props }, ref) {
    return (
      <RadixRadioGroup.Root
        ref={ref}
        // aria-controls va ANTES del spread porque es solo el valor por defecto
        // que deriva de `controls`: un aria-controls explicito del consumidor
        // tiene que ganar.
        aria-controls={controls}
        className={cn(tabsList({ variant: "segmented" }), className)}
        {...props}
      >
        {/* Mismo pop que las pestañas; React 19 hoista el <style> a <head>. */}
        <style href="tk-tab-pop" precedence="default">
          {TAB_POP_KEYFRAMES}
        </style>
        {children}
      </RadixRadioGroup.Root>
    );
  },
);

export interface SegmentedControlItemProps extends Omit<
  React.ComponentPropsWithoutRef<typeof RadixRadioGroup.Item>,
  "asChild"
> {
  /** Icono antes del label, a 16px. En el segmentado del archivo va con gap 6. */
  startIcon?: React.ReactNode;
}

/**
 * Opcion del control segmentado. Siempre en la piel del archivo.
 *
 * El contador de la activa va dentro del propio boton y cuenta para el nombre
 * accesible; no lo escondas con `aria-hidden` o el dato desaparece del lector de
 * pantalla. Para darle unidad, `aria-label="Todos 12 recibos"`.
 */
export const SegmentedControlItem = React.forwardRef<HTMLButtonElement, SegmentedControlItemProps>(
  function SegmentedControlItem({ className, startIcon, children, ...props }, ref) {
    return (
      <RadixRadioGroup.Item ref={ref} className={cn(segmentedControlItem, className)} {...props}>
        {startIcon}
        {children}
      </RadixRadioGroup.Item>
    );
  },
);
