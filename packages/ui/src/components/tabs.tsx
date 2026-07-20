import * as React from "react";
import { Tabs as TabsPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/* Seccion 08 · Tabs & controles — MIXTO.
 *
 * Tres pieles sobre la misma primitiva (Radix Tabs), con procedencias
 * distintas que NO se pueden confundir:
 *
 *   segmented   CANONICO · del archivo de Figma. Riel r12 sobre superficie con
 *               borde de 1px, altura 40, padding 4; la activa es un bloque gris
 *               r10. Label mono 14 en MAYUSCULAS, +2% tracking, icono 16 y gap
 *               6. Se usa para filtrar la misma lista, con contador en la
 *               activa.
 *   soft        EXTENSION · no esta en el archivo. Riel r12 sobre surface-2,
 *               activa = tarjeta (superficie elevada r8 con sombra xs). Para
 *               alternar modos dentro de una tarjeta.
 *   underline   EXTENSION · no esta en el archivo. Sin riel: linea de 1px bajo
 *               toda la fila y subrayado de 2px en tinta bajo la activa. Para
 *               navegacion de pagina con 3+ secciones.
 *
 * REGLA DE SELECCION: la activa se marca SIEMPRE en tinta (pildora, tarjeta o
 * subrayado). Nunca en lima ni en ningun otro acento. Inactivas en ink-600,
 * hover a tinta.
 *
 * DESVIACIONES DELIBERADAS RESPECTO AL PROTOTIPO
 * ----------------------------------------------
 * 1. El prototipo cambia el font-weight de la pestaña activa. No lo copiamos:
 *    el peso cambia el ancho del texto, asi que al seleccionar saltaria la
 *    posicion del resto de pestañas. La seleccion ya va marcada por fondo y
 *    tinta, que es lo que manda el bloque "SELECCION EN TINTA".
 * 2. En underline, la inactiva lleva un borde inferior TRANSPARENTE de 2px en
 *    vez de no llevar borde. Con `border:none` la fila se movia 2px cada vez
 *    que cambiaba la seleccion.
 * 3. El bloque "EN VIVO · PRUEBALO" enseña una pildora deslizante sobre riel
 *    r999 con padding 8/16 y mono 13. Es una demo de MOTION, no la geometria
 *    canonica: manda el bloque "SEGMENTED CONTROL · DEL ARCHIVO" (riel r12,
 *    h40, mono 14). Por eso aqui no hay indicador animado.
 */

type TabsVariant = "segmented" | "soft" | "underline";

/* La variante viaja por contexto desde la raiz para que el consumidor no tenga
 * que repetirla en cada trigger — y sobre todo para que no pueda desparejar la
 * piel del riel con la de las pestañas. */
const TabsVariantContext = React.createContext<TabsVariant>("segmented");

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

const tabsTrigger = cva(
  [
    "relative inline-flex items-center justify-center gap-1.5 whitespace-nowrap",
    // Label mono, MAYUSCULAS por CSS, +2% de tracking y nunca bold.
    "font-mono font-normal uppercase tracking-[0.02em]",
    "cursor-pointer transition-colors duration-140 ease-out select-none",
    "outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:text-ink-400",
    // Icono 16 en el segmentado del archivo; se mantiene en las extensiones.
    "[&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        segmented: [
          "rounded-md px-3 py-1.5 text-sm",
          "text-ink-600 hover:not-disabled:text-ink",
          // activa: bloque gris 238 = surface-3, que en oscuro sube a 58.
          "data-[state=active]:bg-surface-3 data-[state=active]:text-ink",
          // El offset del anillo tiene que ser del color del riel, no de la
          // pagina, o se ve un halo claro dentro del segmentado.
          "focus-visible:ring-offset-surface",
        ],
        soft: [
          "rounded-sm px-6 py-[9px] text-[13px]",
          "text-ink-600 hover:not-disabled:text-ink",
          "data-[state=active]:bg-surface data-[state=active]:text-ink data-[state=active]:shadow-xs",
          "focus-visible:ring-offset-surface-2",
        ],
        underline: [
          "-mb-px border-b-2 border-transparent px-0.5 pt-2.5 pb-3 text-[13px]",
          "text-ink-600 hover:not-disabled:text-ink",
          "data-[state=active]:border-ink data-[state=active]:text-ink",
          "focus-visible:ring-offset-page",
        ],
      },
    },
    defaultVariants: { variant: "segmented" },
  },
);

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
        {children}
      </TabsPrimitive.Root>
    </TabsVariantContext.Provider>
  );
});

export interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
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
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
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
        "text-ink-800 text-sm leading-[1.55]",
        "outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-page",
        className,
      )}
      {...props}
    />
  );
});

/* El segmentado del archivo se usa casi siempre para filtrar una lista que ya
 * esta en pantalla, no para intercambiar paneles. En ese caso el `aria-controls`
 * que Radix pone en cada tab apuntaria a un id que no existe, que es peor que no
 * ponerlo. Por eso se resuelve por contexto: si el consumidor declara `controls`
 * apuntamos ahi, y si no, se quita el atributo. */
const SegmentedControlsContext = React.createContext<string | undefined>(undefined);

export interface SegmentedControlProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "defaultValue" | "onChange" | "dir"> {
  /** Valor seleccionado (modo controlado). */
  value?: string;
  /** Valor inicial (modo no controlado). */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  dir?: "ltr" | "rtl";
  /** `manual` exige Enter/Espacio para cambiar de valor; por defecto la flecha ya cambia. */
  activationMode?: "automatic" | "manual";
  /**
   * id del elemento que este control filtra (la lista, la tabla, la tarjeta).
   * Sin el, las pestañas se quedan sin `aria-controls` en vez de apuntar a un
   * panel inexistente.
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
 * `className` y la ref van al riel, que es el elemento visible del control; la
 * raiz de Radix solo envuelve para dar el contexto de seleccion.
 *
 * Si lo que necesitas es intercambiar paneles, usa `<Tabs variant="segmented">`
 * con `TabsContent`: ahi la relacion pestaña ↔ panel la cablea Radix.
 */
export const SegmentedControl = React.forwardRef<HTMLDivElement, SegmentedControlProps>(
  function SegmentedControl(
    {
      className,
      value,
      defaultValue,
      onValueChange,
      dir,
      activationMode,
      controls,
      children,
      ...listProps
    },
    ref,
  ) {
    return (
      <TabsPrimitive.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        dir={dir}
        activationMode={activationMode}
        className="w-fit"
      >
        <SegmentedControlsContext.Provider value={controls}>
          <TabsPrimitive.List
            ref={ref}
            className={cn(tabsList({ variant: "segmented" }), className)}
            {...listProps}
          >
            {children}
          </TabsPrimitive.List>
        </SegmentedControlsContext.Provider>
      </TabsPrimitive.Root>
    );
  },
);

export type SegmentedControlItemProps = Omit<TabsTriggerProps, "variant">;

/** Opcion del control segmentado. Siempre en la piel del archivo. */
export const SegmentedControlItem = React.forwardRef<HTMLButtonElement, SegmentedControlItemProps>(
  function SegmentedControlItem(props, ref) {
    const controls = React.useContext(SegmentedControlsContext);
    return (
      // aria-controls va ANTES del spread para que el consumidor pueda
      // sobreescribirlo. Cuando vale undefined, React no emite el atributo — y
      // eso es justo lo que borra el id inexistente que pone Radix.
      <TabsTrigger ref={ref} variant="segmented" aria-controls={controls} {...props} />
    );
  },
);
