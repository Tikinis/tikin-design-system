import * as React from "react";
import { DropdownMenu, ToggleGroup } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/* Seccion 07 · Menu, split & group — EXTENSION.
 *
 * El documento lo dice literalmente: "Extension construida con los tokens del
 * archivo". Ninguno de estos tres botones compuestos existe como componente en
 * el archivo de Figma; son una propuesta coherente montada sobre los tokens
 * --tk-* y la escala de radios/alturas de la seccion 03. No los trates como
 * especificacion aprobada.
 *
 * Cuando usar cada uno (del documento):
 *   MenuButton  3-6 acciones secundarias colgando de un trigger.
 *   SplitButton una accion por defecto + variantes de esa MISMA accion.
 *   ButtonGroup 2-4 opciones exclusivas de vista o filtro. Nunca acciones.
 *
 * DE DONDE SALEN LAS MEDIDAS
 * --------------------------
 * El bloque "EN VIVO" y la "MATRIZ DE ESTADOS" del documento no coinciden: el
 * vivo monta el trigger a 40 de alto y la matriz lo dibuja a 38 (y el group a
 * 36 + borde). Manda el vivo, porque la propia matriz se titula "tamaño M · 40"
 * y 40 es la altura de control M de la seccion 03 (--height-control-m). Los 38
 * de la matriz son densidad de maqueta, no especificacion.
 *
 * El documento solo define el tamaño M. `size="s"` es una derivacion nuestra
 * bajando un peldaño la escala de la seccion 03 (32 / r8 / texto 12).
 *
 * DESVIACION DELIBERADA: EL ROJO DE LA ACCION DESTRUCTIVA
 * ------------------------------------------------------
 * El documento pinta la opcion destructiva con rgb(255,0,0), que es
 * --colours-purered-700 y NO se redefine en el bloque .dark de Figma: ese rojo
 * puro sobre superficie oscura vibra y baja el contraste. El propio Figma ya
 * degrada purered-700 a purered-600 en sus tokens de textfield para modo
 * oscuro. Usamos --tk-fg-error (rgb(196,0,0) claro / rgb(255,138,138) oscuro),
 * que si invierte y mantiene contraste en los dos temas.
 */

/* Chevron. Es el path de caret-down de Phosphor (regular, viewBox 256), que es
 * la libreria de iconos oficial del sistema. Va inline y no importado de
 * @phosphor-icons/react a proposito: el paquete no es dependencia de @tikin/ui
 * y el chevron forma parte de la anatomia del componente, no del contenido que
 * pasa el consumidor. El tamaño lo fija cada variante en --tk-chev. */
function Chevron({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 256 256"
      fill="currentColor"
      // Decorativo: el estado abierto/cerrado ya lo dice aria-expanded en el
      // trigger, y el nombre accesible sale del label.
      aria-hidden="true"
      focusable="false"
      className={cn(
        "size-[var(--tk-chev)] shrink-0 transition-transform duration-150 ease-out",
        // El trigger lleva la clase `group`; al abrirse Radix le pone
        // data-state=open y el chevron gira 180 grados.
        "group-data-[state=open]:rotate-180",
        className,
      )}
    >
      <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
    </svg>
  );
}

/* ------------------------------------------------------------------------- */
/* Panel compartido por MenuButton y SplitButton                              */
/* ------------------------------------------------------------------------- */

/* Panel: r12, borde 200, sombra md, padding 6, opciones separadas 2.
   min-width 220 — el documento dibuja 230 en el split, pero solo para que
   quepa "ENVIAR POR TIKINTAG"; el ancho real lo da el contenido. */
const menuContent = [
  "z-50 flex min-w-[220px] flex-col gap-0.5 p-1.5",
  "rounded-lg border border-edge bg-surface shadow-md",
  "outline-none",
];

/* Opciones: r8, padding 10/12, mono 13, hover bg superficie 2.
   Radix marca con data-highlighted tanto el hover de puntero como el foco de
   teclado, asi que un unico estilo cubre los dos. */
const menuItem = cva(
  [
    "flex cursor-pointer items-center gap-2 rounded-sm px-3 py-2.5",
    "font-mono text-[13px] tracking-[0.02em] whitespace-nowrap uppercase",
    "transition-colors duration-140 ease-out outline-none select-none",
    "data-[disabled]:pointer-events-none data-[disabled]:text-ink-500",
    "[&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      destructive: {
        false: "text-ink data-[highlighted]:bg-surface-2",
        // La destructiva va al final del panel y detras de un divisor.
        true: "text-fg-error data-[highlighted]:bg-tint-error",
      },
    },
    defaultVariants: { destructive: false },
  },
);

export interface MenuItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenu.Item>, VariantProps<typeof menuItem> {}

/**
 * Opcion dentro del panel de `MenuButton` o `SplitButton`.
 *
 * El texto se escribe con su capitalizacion normal y sube a mayusculas por CSS:
 * asi el lector de pantalla y el portapapeles conservan el original.
 */
export const MenuItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenu.Item>,
  MenuItemProps
>(function MenuItem({ className, destructive, ...props }, ref) {
  return (
    <DropdownMenu.Item ref={ref} className={cn(menuItem({ destructive, className }))} {...props} />
  );
});

export type MenuSeparatorProps = React.ComponentPropsWithoutRef<typeof DropdownMenu.Separator>;

/** Divisor de 1px. Separa el bloque destructivo del resto de acciones. */
export const MenuSeparator = React.forwardRef<
  React.ComponentRef<typeof DropdownMenu.Separator>,
  MenuSeparatorProps
>(function MenuSeparator({ className, ...props }, ref) {
  return (
    <DropdownMenu.Separator
      ref={ref}
      className={cn("mx-2 my-1 h-px bg-surface-2", className)}
      {...props}
    />
  );
});

/** Props de posicionamiento y apertura comunes a MenuButton y SplitButton. */
interface MenuBehaviourProps {
  /** Abierto controlado. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Alineacion del panel respecto al trigger. Por defecto abajo-izquierda. */
  align?: "start" | "center" | "end";
  /** Separacion trigger-panel. El documento pide 6. */
  sideOffset?: number;
  /**
   * Bloquea el scroll y oculta el resto del arbol para lectores de pantalla.
   * Va a false porque un menu de acciones no es un dialogo: Radix sigue
   * cerrando con Escape, con click fuera y devolviendo el foco al trigger.
   */
  modal?: boolean;
  /** Clases del panel flotante. */
  contentClassName?: string;
}

/* ------------------------------------------------------------------------- */
/* MenuButton                                                                 */
/* ------------------------------------------------------------------------- */

/* Trigger: secondary (borde tinta sobre superficie) + chevron.
   Al abrir invierte a tinta, que es como el documento pinta el estado "open".
   El borde va con `border`, no con inset shadow: la caja es border-box y la
   altura no se descuadra. */
const menuTrigger = cva(
  [
    "group relative inline-flex items-center justify-center",
    "border bg-surface text-ink",
    "font-mono font-normal tracking-[0.02em] whitespace-nowrap uppercase",
    "cursor-pointer transition-colors duration-140 ease-out select-none",
    "outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-page",
    "border-ink",
    /* El hover y el pressed claros van condicionados a que el panel este
       cerrado. Sin ese guardia le ganan por especificidad al estado abierto
       —clase + dos modificadores (0,3,0) contra clase + uno (0,2,0)— y
       devuelven el fondo a superficie mientras el texto sigue en `text-surface`,
       que nadie revierte: texto casi blanco sobre fondo casi blanco. El fondo y
       el color de texto del estado invertido tienen que moverse juntos. */
    "not-data-[state=open]:hover:not-disabled:bg-surface-2",
    "not-data-[state=open]:active:not-disabled:bg-edge",
    /* Abierto = tinta invertida. El feedback de puntero se queda dentro de esa
       misma piel oscura, como el segmento del split que el documento pinta en
       800 al pasar por encima. */
    "data-[state=open]:bg-ink data-[state=open]:text-surface",
    "data-[state=open]:hover:not-disabled:bg-ink-800",
    "data-[state=open]:active:not-disabled:bg-ink-strong",
    // Deshabilitado: relleno y borde en 200, texto en 500. Nunca opacidad.
    "disabled:cursor-not-allowed disabled:border-edge disabled:bg-edge disabled:text-ink-500",
  ],
  {
    variants: {
      size: {
        m: "h-10 gap-2 rounded-md px-4 text-sm [--tk-chev:12px]",
        s: "h-8 gap-1.5 rounded-sm px-3 text-xs [--tk-chev:10px]",
      },
      fullWidth: { true: "w-full justify-between", false: "" },
    },
    defaultVariants: { size: "m", fullWidth: false },
  },
);

type MenuTriggerVariants = VariantProps<typeof menuTrigger>;

export interface MenuButtonProps
  extends
    Omit<React.ComponentPropsWithoutRef<"button">, "children" | "onSelect">,
    MenuTriggerVariants,
    MenuBehaviourProps {
  /** Texto del trigger. Sube a mayusculas por CSS, no en JS. */
  label: React.ReactNode;
  /** Las opciones: `MenuItem` y `MenuSeparator`. */
  children: React.ReactNode;
}

/**
 * Boton que despliega un panel de 3-6 acciones secundarias.
 *
 * El panel abre abajo-izquierda con 6 de separacion y cierra al elegir, al
 * hacer click fuera o con Escape; el chevron gira 180 grados mientras esta
 * abierto. Todo ese comportamiento — foco, roles ARIA, navegacion con flechas,
 * typeahead — lo pone Radix DropdownMenu, no lo reimplementamos.
 */
export const MenuButton = React.forwardRef<HTMLButtonElement, MenuButtonProps>(function MenuButton(
  {
    className,
    contentClassName,
    size,
    fullWidth,
    label,
    children,
    open,
    defaultOpen,
    onOpenChange,
    align = "start",
    sideOffset = 6,
    modal = false,
    type,
    disabled,
    ...props
  },
  ref,
) {
  return (
    <DropdownMenu.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      modal={modal}
    >
      {/* `disabled` va tambien en el Trigger, no solo en el <button>: Radix
            corta ahi su propio onPointerDown. Poniendolo unicamente en el
            elemento, el menu llegaba a abrirse en entornos que si despachan
            eventos de puntero sobre controles deshabilitados. */}
      <DropdownMenu.Trigger asChild disabled={disabled}>
        <button
          ref={ref}
          // Dentro de un <form> un <button> sin type envia el formulario.
          type={type ?? "button"}
          disabled={disabled}
          className={cn(menuTrigger({ size, fullWidth, className }))}
          {...props}
        >
          {label}
          <Chevron />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align={align}
          sideOffset={sideOffset}
          className={cn(menuContent, contentClassName)}
        >
          {children}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
});

/* ------------------------------------------------------------------------- */
/* SplitButton                                                                */
/* ------------------------------------------------------------------------- */

/* Los dos segmentos comparten piel primaria (tinta / superficie) y solo se
   diferencian en radios y padding. El hover afecta unicamente al segmento
   sobre el que esta el puntero: por eso son dos botones y no uno partido. */
const splitSegment = cva(
  [
    "group relative inline-flex items-center justify-center",
    "bg-ink text-surface",
    "font-mono font-normal tracking-[0.02em] whitespace-nowrap uppercase",
    "cursor-pointer transition-colors duration-140 ease-out select-none",
    "outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-page",
    "hover:not-disabled:bg-ink-800 active:not-disabled:bg-ink-strong",
    "disabled:cursor-not-allowed disabled:bg-edge disabled:text-ink-500",
  ],
  {
    variants: {
      segment: {
        /* Accion por defecto: esquinas vivas por la derecha, donde encaja el
           divisor. */
        action: "rounded-l-md px-[18px]",
        /* Segmento del chevron: solo icono, se abre con el mismo tono de hover
           mientras el panel esta desplegado. */
        menu: "rounded-r-md px-3 data-[state=open]:bg-ink-800",
      },
      size: {
        m: "h-10 text-sm [--tk-chev:12px]",
        s: "h-8 text-xs [--tk-chev:10px]",
      },
    },
    compoundVariants: [
      { segment: "action", size: "s", class: "rounded-l-sm px-3.5" },
      { segment: "menu", size: "s", class: "rounded-r-sm px-2.5" },
    ],
    defaultVariants: { segment: "action", size: "m" },
  },
);

export interface SplitButtonProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "children" | "onSelect">, MenuBehaviourProps {
  /** Texto de la accion por defecto. Sube a mayusculas por CSS. */
  label: React.ReactNode;
  /** Variantes de la MISMA accion: `MenuItem` y `MenuSeparator`. */
  children: React.ReactNode;
  /** Se dispara al pulsar el segmento de la accion por defecto. */
  onAction?: React.MouseEventHandler<HTMLButtonElement>;
  size?: "m" | "s";
  /** Deshabilita los dos segmentos y el divisor. */
  disabled?: boolean;
  /**
   * Nombre accesible del segmento del chevron, que no tiene texto visible.
   * Personalizalo cuando el menu no sean variantes de `label`.
   */
  menuLabel?: string;
  /** Clases del boton de la accion por defecto. */
  actionClassName?: string;
  /** Clases del segmento del chevron. */
  menuClassName?: string;
}

/**
 * Accion por defecto mas un desplegable con variantes de esa misma accion.
 *
 * ENVIAR / ENVIAR A BOLSILLO / PROGRAMAR ENVIO. Si las opciones no son la misma
 * accion en otra forma, lo que quieres es un `MenuButton`.
 *
 * La `ref` va al contenedor, no a un segmento: el componente renderiza dos
 * botones y ninguno de los dos es "el" elemento del componente.
 */
export const SplitButton = React.forwardRef<HTMLDivElement, SplitButtonProps>(function SplitButton(
  {
    className,
    actionClassName,
    menuClassName,
    contentClassName,
    label,
    children,
    onAction,
    size = "m",
    disabled,
    menuLabel = "Más opciones",
    open,
    defaultOpen,
    onOpenChange,
    align = "start",
    sideOffset = 6,
    modal = false,
    ...props
  },
  ref,
) {
  return (
    <div ref={ref} className={cn("inline-flex w-fit items-stretch", className)} {...props}>
      <button
        type="button"
        disabled={disabled}
        onClick={onAction}
        className={cn(splitSegment({ segment: "action", size, className: actionClassName }))}
      >
        {label}
      </button>
      {/* Divisor de 1px sobre el relleno de tinta. Es decorativo, asi que no
            entra en el arbol de accesibilidad ni recibe eventos. */}
      <span
        aria-hidden="true"
        className={cn("w-px shrink-0 self-stretch", disabled ? "bg-edge-2" : "bg-ink-700")}
      />
      <DropdownMenu.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        modal={modal}
      >
        {/* Ver la nota de MenuButton: Radix necesita saber que esta
              deshabilitado para no abrir en su propio onPointerDown. */}
        <DropdownMenu.Trigger asChild disabled={disabled}>
          <button
            type="button"
            disabled={disabled}
            aria-label={menuLabel}
            className={cn(splitSegment({ segment: "menu", size, className: menuClassName }))}
          >
            <Chevron />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align={align}
            sideOffset={sideOffset}
            className={cn(menuContent, contentClassName)}
          >
            {children}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
});

/* ------------------------------------------------------------------------- */
/* ButtonGroup                                                                */
/* ------------------------------------------------------------------------- */

/* El tamaño baja por contexto y no por prop en cada item: el consumidor lo
   declara una vez en el grupo y los segmentos no pueden desalinearse. */
const ButtonGroupSizeContext = React.createContext<"m" | "s">("m");

/* El borde exterior lo lleva el contenedor y los segmentos se estiran dentro:
   con box-border, 40 de alto menos 1+1 de borde deja los 38 de segmento que
   dibuja el documento. */
const buttonGroupRoot = cva(["inline-flex w-fit items-stretch overflow-hidden border"], {
  variants: {
    size: { m: "h-10 rounded-md", s: "h-8 rounded-sm" },
    disabled: { true: "border-edge-2", false: "border-ink" },
  },
  defaultVariants: { size: "m", disabled: false },
});

const buttonGroupItem = cva(
  [
    "inline-flex h-full items-center justify-center",
    "font-mono font-normal tracking-[0.02em] whitespace-nowrap uppercase",
    "cursor-pointer transition-colors duration-140 ease-out select-none",
    // El anillo va por dentro: el contenedor recorta con overflow-hidden y un
    // anillo exterior quedaria cortado justo en los segmentos de los extremos.
    "outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-inset",
    "bg-transparent text-ink",
    /* Mismo guardia que en el trigger: el hover y el pressed claros solo valen
       en el segmento inactivo. Sin `not-data-[state=on]` ganarian por
       especificidad al estado activo y dejarian el label en `text-surface`
       sobre un fondo claro. */
    "not-data-[state=on]:hover:not-disabled:bg-surface-2",
    "not-data-[state=on]:active:not-disabled:bg-edge",
    // Activa = tinta invertida. El anillo pasa a superficie para verse encima.
    "data-[state=on]:bg-ink data-[state=on]:text-surface data-[state=on]:focus-visible:ring-surface",
    // El puntero sobre la activa oscurece sin salirse de la piel invertida.
    "data-[state=on]:hover:not-disabled:bg-ink-800",
    "data-[state=on]:active:not-disabled:bg-ink-strong",
    // Divisor entre segmentos, no en el primero.
    "border-l border-edge-2 first:border-l-0",
    "disabled:cursor-not-allowed disabled:text-ink-500",
    "disabled:data-[state=on]:bg-edge disabled:data-[state=on]:text-ink-500",
  ],
  {
    variants: {
      size: { m: "px-[18px] text-[13px]", s: "px-3.5 text-xs" },
    },
    defaultVariants: { size: "m" },
  },
);

export interface ButtonGroupProps extends Omit<
  React.ComponentPropsWithoutRef<typeof ToggleGroup.Root>,
  "type" | "value" | "defaultValue" | "onValueChange"
> {
  /** Valor activo. Controlado. */
  value?: string;
  /** Valor activo inicial. No controlado. */
  defaultValue?: string;
  /** Recibe siempre un valor: el grupo nunca se queda sin opcion activa. */
  onValueChange?: (value: string) => void;
  size?: "m" | "s";
}

/**
 * Segmentado de 2-4 opciones exclusivas de vista o filtro — DIA / SEMANA / MES.
 * Nunca acciones: para eso estan `MenuButton` y `SplitButton`.
 *
 * Siempre hay exactamente una activa. Por eso el estado se controla aqui dentro
 * aunque el consumidor lo use sin `value`: Radix ToggleGroup en modo `single`
 * permite desmarcar la activa (emite ""), y su estado interno cambiaria aunque
 * ignorasemos el evento. Interceptando el "" el grupo no puede quedarse vacio.
 */
export const ButtonGroup = React.forwardRef<
  React.ComponentRef<typeof ToggleGroup.Root>,
  ButtonGroupProps
>(function ButtonGroup(
  { className, size = "m", value, defaultValue, onValueChange, disabled, children, ...props },
  ref,
) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue ?? "");
  const isControlled = value !== undefined;
  const current = isControlled ? value : uncontrolled;

  const handleValueChange = (next: string) => {
    // Radix manda "" al pulsar la opcion ya activa. Ese es el caso que rompe la
    // regla "una activa siempre", asi que lo descartamos sin avisar al padre.
    if (!next) return;
    if (!isControlled) setUncontrolled(next);
    onValueChange?.(next);
  };

  return (
    <ButtonGroupSizeContext.Provider value={size}>
      <ToggleGroup.Root
        ref={ref}
        type="single"
        value={current}
        onValueChange={handleValueChange}
        disabled={disabled}
        // rovingFocus + loop: el grupo entero es una sola parada de tabulador y
        // las flechas mueven entre segmentos, como un radiogroup nativo.
        rovingFocus
        loop
        className={cn(buttonGroupRoot({ size, disabled: Boolean(disabled), className }))}
        {...props}
      >
        {children}
      </ToggleGroup.Root>
    </ButtonGroupSizeContext.Provider>
  );
});

export type ButtonGroupItemProps = React.ComponentPropsWithoutRef<typeof ToggleGroup.Item>;

/** Segmento del `ButtonGroup`. Hereda el tamaño del grupo. */
export const ButtonGroupItem = React.forwardRef<
  React.ComponentRef<typeof ToggleGroup.Item>,
  ButtonGroupItemProps
>(function ButtonGroupItem({ className, ...props }, ref) {
  const size = React.useContext(ButtonGroupSizeContext);
  return (
    <ToggleGroup.Item ref={ref} className={cn(buttonGroupItem({ size, className }))} {...props} />
  );
});
