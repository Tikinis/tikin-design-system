import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/* Seccion 45 · List items & filas — EXTENSION construida con los tokens del
 * archivo.
 *
 * Lo dice la propia bajada del documento ("Extension con tokens del archivo") y
 * lo confirma el export de Figma: en docs/figma-export/components/ no hay
 * ningun cuerpo de List, Row ni ListItem. Nada de esta seccion es
 * especificacion aprobada; es una propuesta coherente montada sobre
 * superficies, radios y colores que si son canonicos.
 *
 * Que es: la unidad de las listas de Tikin — movimientos, contactos y ajustes.
 * Leading (avatar o icono) · contenido flexible · trailing (valor o control) ·
 * separador de 1px entre filas, nunca en la ultima.
 *
 * MEDIDAS DEL PROTOTIPO (atributos style= del HTML, no del texto)
 * --------------------------------------------------------------
 *   fila          padding 14/16 · gap 12 · align center · alto 44–68
 *                 en movil el objetivo tactil sube a >= 64
 *   leading       avatar circular 42 (glifo 20) o icono en caja r10 de 38
 *                 (glifo 19). Personas -> circulo; conceptos -> caja.
 *   titulo        14.5px, tinta, trunca con …
 *   metadato      12.5px, gris 600, bajo el titulo, gap 2
 *   monto         mono 14px, +2% de tracking, a la derecha
 *                 entradas var(--tk-fg-success) · salidas var(--tk-ink)
 *   valor+chevron mono 13px gris 600 + caret 15px gris 500
 *   check         circulo 22 · seleccionado bg tinta con glifo 13
 *                 sin seleccionar anillo interior de 1.5px en borde-2
 *   separador     1px var(--tk-surface-2) entre filas
 *   contenedor    borde 1px var(--tk-border) · radio 16 · overflow hidden
 *
 * EL SEPARADOR LO DIBUJA LA LISTA, NO LA FILA
 * -------------------------------------------
 * El documento pide "no en la ultima". Si cada fila pintase su borde inferior
 * habria que anularlo con last:, que falla en cuanto alguien intercala un
 * elemento no-fila (un encabezado de grupo, un separador de fecha). La lista
 * usa `[&>*+*]:border-t`, que por definicion nunca toca al primero ni deja
 * borde suelto al final.
 *
 * TEMA OSCURO
 * -----------
 * Todo sale de la capa semantica --tk-*, que invierte. El texto dice "gris 100"
 * para el separador y el HTML pinta --tk-surface-2: en claro son el mismo
 * valor, y ademas surface-2 si tiene equivalente oscuro. Las unicas piezas con
 * relleno de acento fijo (lavanda, lima, oro) llevan text-on-accent, la tinta
 * estable pensada para rellenos que son claros en ambos modos.
 *
 * SIN DEPENDENCIA DE ICONOS
 * -------------------------
 * El sistema usa Phosphor, pero el paquete no lo trae como dependencia. El
 * chevron y el check van como SVG inline y son sustituibles por prop, para que
 * quien ya tenga Phosphor pase su <CaretRight /> sin pelearse con el tamaño.
 */

/* ------------------------------------------------------------------ */
/* Contenedor                                                          */
/* ------------------------------------------------------------------ */

const list = cva("flex flex-col", {
  variants: {
    variant: {
      /* Tarjeta de lista: borde 1, radio 16 y recorte. */
      bordered: "overflow-hidden rounded-xl border border-edge",
      /* A sangre: listas de pantalla completa en movil, sin caja. */
      plain: "",
    },
    /* El separador va SIEMPRE entre hermanos: nunca sobra al final. */
    separators: {
      true: "[&>*+*]:border-t [&>*+*]:border-surface-2",
      false: "",
    },
  },
  defaultVariants: { variant: "bordered", separators: true },
});

export interface ListProps
  extends React.ComponentPropsWithoutRef<"div">, VariantProps<typeof list> {
  /**
   * Renderiza el hijo en vez de un <div>.
   *
   * Cuando las filas NO son interactivas, lo correcto es pasar un <ul> aqui y
   * un <li> en cada `ListItem`: el lector de pantalla anuncia "lista de N
   * elementos". Con filas interactivas no se hace, porque un <button> no puede
   * ser hijo directo de <ul>.
   */
  asChild?: boolean;
}

/**
 * Contenedor de filas.
 *
 * No aporta semantica de lista por su cuenta: `role="list"` sobre filas que son
 * botones les robaria el rol y las volveria inertes para el lector de pantalla.
 * Si la lista es puramente informativa, componla con `asChild` sobre <ul>/<li>.
 */
export const List = React.forwardRef<HTMLDivElement, ListProps>(function List(
  { className, variant, separators, asChild = false, ...props },
  ref,
) {
  const Comp = asChild ? Slot.Root : "div";
  return <Comp ref={ref} className={cn(list({ variant, separators, className }))} {...props} />;
});

/* ------------------------------------------------------------------ */
/* Fila                                                                */
/* ------------------------------------------------------------------ */

/* Contexto minimo: solo existe para que el check visual no pueda
 * desincronizarse del aria-pressed de la fila. Todo lo demas va por props. */
const ListItemContext = React.createContext<{ selected?: boolean }>({});

const listItem = cva(
  [
    "relative flex w-full items-center gap-3 px-4 py-3.5 text-left",
    // El contenido de una fila es prosa: nunca mono, nunca mayusculas.
    "font-sans transition-colors duration-140 ease-out",
  ],
  {
    variants: {
      /* Alto 44–68 del bloque de anatomia. Es un suelo, no una camisa de
         fuerza: con avatar de 42 + padding 14 la fila crece hasta 70 sola. */
      size: {
        sm: "min-h-11",
        md: "min-h-14",
        // 68 — el unico que cumple el ">= 64 en movil" que pide el documento.
        lg: "min-h-[68px]",
      },

      tone: {
        default: "text-ink",
        // "Cerrar sesion": la fila entera se tiñe, no solo el icono.
        danger: "text-fg-error",
      },

      interactive: {
        true: [
          "cursor-pointer outline-none select-none",
          "hover:bg-surface-2 active:bg-surface-3",
          // ring-inset porque la lista recorta con overflow-hidden: un anillo
          // por fuera quedaria cortado justo en la primera y la ultima fila.
          "focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-inset",
        ],
        false: "",
      },
    },

    compoundVariants: [
      /* En una fila destructiva el feedback tambien va en rojo: el gris de
         surface-2 leeria como "fila normal" justo encima del texto en error. */
      {
        tone: "danger",
        interactive: true,
        class: "hover:bg-tint-error active:bg-tint-error",
      },
    ],

    defaultVariants: { size: "md", tone: "default", interactive: false },
  },
);

type ListItemVariants = VariantProps<typeof listItem>;

export interface ListItemProps
  extends
    Omit<React.ComponentPropsWithoutRef<"div">, "title" | "onClick">,
    Omit<ListItemVariants, "interactive"> {
  /**
   * Hace la fila tocable. Se tipa contra HTMLElement y no contra HTMLDivElement
   * porque el elemento real cambia — div, button o el hijo de `asChild`.
   */
  onClick?: React.MouseEventHandler<HTMLElement>;
  /** Avatar circular (personas) o icono en caja (conceptos). Ver `ListItemIcon`. */
  leading?: React.ReactNode;
  /** Titulo de la fila, 14.5px. Trunca con … si no cabe. */
  title: React.ReactNode;
  /** Metadato secundario bajo el titulo: fecha, $tag, categoria. */
  meta?: React.ReactNode;
  /** Derecha: monto, valor+chevron, toggle o check. */
  trailing?: React.ReactNode;
  /**
   * Fuerza el comportamiento tocable. Por defecto se deduce: hay `onClick` o
   * `asChild` -> la fila es un boton.
   *
   * Ponlo a `false` cuando la fila lleve un control propio (un toggle): dos
   * elementos interactivos anidados dan dos paradas de tabulador para una sola
   * accion y el lector de pantalla lee el boton exterior sobre el interior.
   */
  interactive?: boolean;
  /** Marca la fila como elegida. Emite `aria-pressed` y alimenta a `ListItemCheck`. */
  selected?: boolean;
  /** Inhabilita la fila. En un <button> real; si no, via aria-disabled. */
  disabled?: boolean;
  /**
   * Renderiza el hijo en vez de un <button>, heredando los estilos.
   * El hijo lleva solo el destino — `<a href="...">` — y el contenido de la
   * fila sigue viniendo de `leading` / `title` / `meta` / `trailing`.
   */
  asChild?: boolean;
}

/**
 * Fila de lista del sistema Tikin.
 *
 * Una fila, un tap: toda la fila es el target y lleva a un destino o alterna un
 * control. El chevron indica navegacion; el toggle, accion inmediata.
 *
 * El leading es consistente dentro de una misma lista: personas con avatar
 * circular, conceptos con icono en caja r10. Nunca se mezclan.
 */
export const ListItem = React.forwardRef<HTMLElement, ListItemProps>(function ListItem(
  {
    className,
    size,
    tone,
    leading,
    title,
    meta,
    trailing,
    interactive,
    selected,
    disabled = false,
    asChild = false,
    children,
    onClick,
    ...props
  },
  ref,
) {
  // Si el consumidor no lo dice, lo dice el uso: una fila con onClick es un
  // boton, y una fila con asChild es lo que el consumidor haya traido.
  const isInteractive = interactive ?? (asChild || Boolean(onClick));

  /* El casteo a ElementType es deliberado: el elemento resultante cambia entre
   * div, button y el hijo del consumidor, y TypeScript no puede unificar sus
   * tres tablas de atributos sin volver la prop `props` inservible. */
  const Comp = (asChild ? Slot.Root : isInteractive ? "button" : "div") as React.ElementType;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    // Un div con aria-disabled sigue recibiendo clics: hay que cortarlos aqui.
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClick?.(event);
  };

  // El Provider envuelve a Comp POR FUERA a proposito: Slot solo busca el
  // Slottable entre sus hijos DIRECTOS, asi que un Provider por dentro lo
  // esconderia y asChild dejaria de funcionar.
  const context = React.useMemo(() => ({ selected }), [selected]);

  return (
    <ListItemContext.Provider value={context}>
      <Comp
        ref={ref}
        className={cn(
          listItem({ size, tone, interactive: isInteractive, className }),
          // El gris 400 gana al text-ink/text-fg-error de `tone` porque
          // tailwind-merge se queda con la ultima clase de la misma familia.
          disabled && "cursor-not-allowed text-ink-400",
        )}
        // Sin asChild y siendo interactiva renderizamos un <button>, cuyo type
        // por defecto es "submit": dentro de un form eso enviaria sin querer.
        {...(!asChild && isInteractive ? { type: "button", disabled } : {})}
        // En div y en el hijo del consumidor no existe el atributo disabled.
        aria-disabled={disabled && (asChild || !isInteractive) ? true : undefined}
        // aria-pressed convierte la fila en un interruptor de seleccion. Solo
        // tiene sentido si la fila es el control; en una fila inerte se omite.
        aria-pressed={isInteractive && selected !== undefined ? selected : undefined}
        data-selected={selected ? "" : undefined}
        onClick={handleClick}
        {...props}
      >
        {leading}
        {/* min-w-0: sin el, el hijo flex se niega a encoger por debajo de su
            contenido y `truncate` nunca llega a activarse. */}
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate text-[14.5px] leading-tight">{title}</span>
          {meta !== undefined && meta !== null && (
            <span className="truncate text-[12.5px] leading-tight text-ink-600">{meta}</span>
          )}
        </span>
        {/* Slottable marca cual de los hijos es el elemento del consumidor.
            Sin el, con mas de un hijo Slot lanza "Expected a single React
            element child". */}
        <Slot.Slottable>{children}</Slot.Slottable>
        {trailing !== undefined && trailing !== null && (
          <span className="flex flex-none items-center gap-2">{trailing}</span>
        )}
      </Comp>
    </ListItemContext.Provider>
  );
});

/* ------------------------------------------------------------------ */
/* Leading                                                             */
/* ------------------------------------------------------------------ */

const listItemIcon = cva(
  [
    "flex flex-none items-center justify-center overflow-hidden",
    // Las iniciales van mono y en MAYUSCULAS POR CSS: en JS romperian el texto
    // accesible y lo que se copia al portapapeles.
    "font-mono text-[13px] uppercase",
  ],
  {
    variants: {
      shape: {
        /* Personas: avatar circular de 42, glifo 20. */
        circle: "size-[42px] rounded-pill [&_svg]:size-5",
        /* Conceptos: icono en caja r10 de 38, glifo 19. */
        box: "size-[38px] rounded-md [&_svg]:size-[19px]",
      },
      tone: {
        neutral: "bg-surface-2 text-ink",
        success: "bg-tint-success text-fg-success",
        warning: "bg-tint-warning text-fg-warning",
        error: "bg-tint-error text-fg-error",
        info: "bg-tint-info text-fg-info",
        /* Acentos de marca: el relleno es claro en ambos modos, asi que el
           glifo va en on-accent y no en text-ink, que en oscuro seria casi
           blanco sobre lavanda claro. Los otros dos pasteles del prototipo
           —rgb(255,230,210) y rgb(220,240,225)— no existen como token del
           sistema: quien los quiera los pasa por className. */
        lavender: "bg-lavender text-on-accent",
        lime: "bg-lime text-on-accent",
        gold: "bg-gold text-on-accent",
      },
    },
    defaultVariants: { shape: "circle", tone: "neutral" },
  },
);

export interface ListItemIconProps
  extends React.ComponentPropsWithoutRef<"span">, VariantProps<typeof listItemIcon> {}

/**
 * Leading de la fila: avatar circular (personas) o icono en caja (conceptos).
 *
 * Acepta un glifo — se dimensiona solo — o iniciales como texto.
 */
export const ListItemIcon = React.forwardRef<HTMLSpanElement, ListItemIconProps>(
  function ListItemIcon({ className, shape, tone, ...props }, ref) {
    return <span ref={ref} className={cn(listItemIcon({ shape, tone, className }))} {...props} />;
  },
);

/* ------------------------------------------------------------------ */
/* Trailing                                                            */
/* ------------------------------------------------------------------ */

const listItemAmount = cva(
  // tabular-nums para que las columnas de cifras no bailen entre filas.
  "flex-none font-mono text-sm tracking-[0.02em] tabular-nums",
  {
    variants: {
      /* "Entradas en verde, salidas en tinta". El signo va en el texto: quien
         renderiza la fila ya trae la cifra formateada y con su locale. */
      direction: {
        in: "text-fg-success",
        out: "text-ink",
        neutral: "text-ink",
      },
    },
    defaultVariants: { direction: "neutral" },
  },
);

export interface ListItemAmountProps
  extends React.ComponentPropsWithoutRef<"span">, VariantProps<typeof listItemAmount> {}

/** Monto en mono alineado a la derecha. Entradas en verde, salidas en tinta. */
export const ListItemAmount = React.forwardRef<HTMLSpanElement, ListItemAmountProps>(
  function ListItemAmount({ className, direction, ...props }, ref) {
    return <span ref={ref} className={cn(listItemAmount({ direction, className }))} {...props} />;
  },
);

const CaretRight = (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M6 3.5 10.5 8 6 12.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export interface ListItemValueProps extends React.ComponentPropsWithoutRef<"span"> {
  /**
   * Glifo de navegacion. Por defecto un caret inline, para no obligar al
   * paquete a depender de Phosphor; pasa el tuyo si ya lo tienes cargado.
   */
  chevron?: React.ReactNode;
  /** Oculta el chevron cuando la fila muestra valor pero no navega. */
  showChevron?: boolean;
}

/**
 * Valor a la derecha con chevron de navegacion.
 *
 * El chevron es lo que promete "esta fila lleva a otro sitio": no lo pongas en
 * filas que solo alternan un control.
 */
export const ListItemValue = React.forwardRef<HTMLSpanElement, ListItemValueProps>(
  function ListItemValue({ className, children, chevron, showChevron = true, ...props }, ref) {
    return (
      <span
        ref={ref}
        className={cn(
          "flex flex-none items-center gap-2 font-mono text-[13px] text-ink-600",
          className,
        )}
        {...props}
      >
        {children}
        {showChevron && (
          // aria-hidden: la navegacion ya la anuncia el rol de la fila; un
          // glifo suelto solo añadiria ruido al lector de pantalla.
          <span
            className="flex size-[15px] flex-none items-center justify-center text-ink-500"
            aria-hidden="true"
          >
            {chevron ?? CaretRight}
          </span>
        )}
      </span>
    );
  },
);

const CheckGlyph = (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="m3.5 8.5 3 3 6-7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export interface ListItemCheckProps extends React.ComponentPropsWithoutRef<"span"> {
  /**
   * Estado visual. Si se omite lo toma del `selected` de la fila, para que el
   * check no pueda contradecir al `aria-pressed` que anuncia el lector.
   */
  checked?: boolean;
}

/**
 * Circulo de seleccion de 22 a la derecha de la fila.
 *
 * Es decoracion: el estado accesible lo lleva la fila (`selected`). Por eso va
 * aria-hidden y no es un control con foco propio.
 */
export const ListItemCheck = React.forwardRef<HTMLSpanElement, ListItemCheckProps>(
  function ListItemCheck({ className, checked, ...props }, ref) {
    const context = React.useContext(ListItemContext);
    const isChecked = checked ?? context.selected ?? false;
    return (
      <span
        ref={ref}
        aria-hidden="true"
        data-state={isChecked ? "checked" : "unchecked"}
        className={cn(
          "flex size-[22px] flex-none items-center justify-center rounded-pill transition-colors duration-140 ease-out",
          isChecked
            ? "bg-ink text-surface"
            : // El anillo va por inset shadow y no por border: 1.5px de borde
              // moverian el contenido medio pixel al alternar el estado.
              "shadow-[inset_0_0_0_1.5px_var(--tk-border-2)]",
          className,
        )}
        {...props}
      >
        {isChecked && <span className="size-[13px]">{CheckGlyph}</span>}
      </span>
    );
  },
);
