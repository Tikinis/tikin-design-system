import * as React from "react";
/* Subrutas en vez de `import { Popover } from "radix-ui"`, por lo mismo que
 * documenta checkbox.tsx: el .d.ts del namespace agrupado que sirve la entrada
 * raiz de radix-ui@1.6.3 lleva JAVASCRIPT dentro, TS se rinde y tipa las partes
 * como `any`. Las subrutas si reexportan los tipos buenos. Mismo runtime. */
import * as PopoverPrimitive from "radix-ui/popover";
import * as CheckboxPrimitive from "radix-ui/checkbox";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/* Seccion 22 · Filter — EXTENSION construida con los tokens del sistema.
 *
 * El propio documento la etiqueta asi ("Extension con tokens del sistema") y no
 * hay ningun componente Filter en docs/figma-export/components/: el archivo de
 * Figma no define este control. No es especificacion aprobada.
 *
 * Alcance: el documento describe un filtro COMPLETO — "boton que abre un
 * popover con opciones marcables, badge con la cuenta activa y acciones Limpiar
 * / Aplicar" — no un pill suelto. Por eso el componente trae las dos mitades:
 *   · sin `options`, es solo el disparador y el consumidor pone su panel;
 *   · con `options`, monta el popover entero con sus reglas de cierre.
 *
 * MEDIDAS DEL CHIP, del bloque "ESTADOS DEL BOTON" del documento:
 *   alto 40 · px 16 · gap 8 · radio 999 · borde 1 · icono 16
 *   label Ubuntu Sans Mono 14 con +2% de tracking
 *   badge: min-width 20 · alto 20 · radio 999 · Ubuntu Mono 11 · px 5
 *
 * MEDIDAS DEL PANEL, del bloque "EN VIVO":
 *   min-width 230 · radio 16 · borde 1 en --tk-border · padding 8 · sombra md
 *   panel a 48 del borde superior del chip = 8 de separacion bajo sus 40
 *   cabecera Ubuntu Mono 10 con +10% de tracking en --tk-500, padding 6/10
 *   fila: alto libre con padding 9/10 · radio 8 · gap 10 · casilla 20 r6
 *   acciones: alto 36 · radio 10 · mono 12 · LIMPIAR con borde, APLICAR en tinta
 *
 * COLOR POR ESTADO (tokens --tk-*, que si invierten en el bloque .dark):
 *   default        bg surface   · borde border-2 · texto ink
 *   hover          bg surface-2 · borde border-2
 *   pressed        bg border          (data-press del prototipo)
 *   open / active  bg surface-2 · borde ink
 *   disabled       bg surface-2 · borde border   · texto 400
 */

/* Por que rounded-(--radius-pill) y no rounded-pill: tailwind-merge no conoce
 * la clave `pill` de nuestro tema, asi que ante `rounded-pill rounded-none`
 * dejaria las dos clases y el override del consumidor quedaria a merced del
 * orden de la hoja. La forma de variable si entra en su grupo `rounded`. */
const filterChip = cva(
  [
    "box-border inline-flex h-10 items-center gap-2 rounded-(--radius-pill) border px-4",
    // El label va SIEMPRE mono, MAYUSCULAS por CSS y +2% de tracking.
    "font-mono text-sm font-normal tracking-[0.02em] whitespace-nowrap uppercase",
    "cursor-pointer transition-colors duration-140 ease-out select-none",
    "outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-page",
    // El icono lo fija el chip, no el consumidor: 16 en las cinco maquetas.
    "[&_svg]:size-4 [&_svg]:shrink-0",
    /* Disabled va en la base y no por variante: aplica igual abierto que
       cerrado. Convive con los `bg-*`/`border-*` de las variantes porque
       tailwind-merge trata cada modificador como grupo aparte, y en cascada la
       pseudoclase :disabled gana por especificidad. */
    "disabled:cursor-not-allowed disabled:border-edge disabled:bg-surface-2 disabled:text-ink-400",
  ],
  {
    variants: {
      /* Un unico eje: el documento pinta "OPEN / ACTIVE" como un solo estado.
         Ojo, "CON CONTEO" NO lo activa — un chip con 2 filtros puestos pero el
         popover cerrado se dibuja como default, solo con el badge. */
      open: {
        false: "border-edge-2 bg-surface text-ink hover:not-disabled:bg-surface-2",
        true: "border-ink bg-surface-2 text-ink hover:not-disabled:bg-edge",
      },
    },
    /* El pressed es comun a los dos estados y va despues del eje para ganarle
       al hover cuando el puntero esta a la vez encima y pulsando. */
    compoundVariants: [{ open: [true, false], class: "active:not-disabled:bg-edge" }],
    defaultVariants: { open: false },
  },
);

type FilterChipVariants = VariantProps<typeof filterChip>;

/* Panel flotante: r16, borde en --tk-border, padding 8, sombra md, filas
   separadas 2. El min-width 230 del documento es suelo, no ancho fijo: el
   contenido puede pedir mas. */
const filterPanel = [
  "z-50 flex min-w-[230px] flex-col gap-0.5 p-2",
  "rounded-xl border border-edge bg-surface shadow-md",
  "outline-none",
];

/* Fila marcable. Radix Checkbox.Root ya es un <button role="checkbox">, asi que
   la fila entera es la casilla: no hay zona muerta entre el cuadrito y su
   texto, y el nombre accesible sale del propio label. */
const filterOption = [
  "flex w-full cursor-pointer items-center gap-2.5 rounded-sm px-2.5 py-[9px] text-left",
  "font-sans text-sm text-ink",
  "transition-colors duration-140 ease-out select-none",
  "outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-inset",
  "hover:not-disabled:bg-surface-2",
  "disabled:cursor-not-allowed disabled:text-ink-400",
];

/* LIMPIAR y APLICAR: mismo alto y radio, distinta jerarquia. Mayusculas por
   CSS, nunca en JS. */
const filterAction = cva(
  [
    "inline-flex h-9 flex-1 items-center justify-center rounded-md",
    "font-mono text-xs tracking-[0.02em] whitespace-nowrap uppercase",
    "cursor-pointer transition-colors duration-140 ease-out select-none",
    "outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
  ],
  {
    variants: {
      tone: {
        secondary: "border border-edge-2 bg-surface text-ink hover:bg-surface-2 active:bg-edge",
        primary: "bg-ink text-surface hover:bg-ink-800 active:bg-ink-strong",
      },
    },
    defaultVariants: { tone: "secondary" },
  },
);

/* Embudo dibujado a mano. packages/ui no depende de @phosphor-icons — la
 * libreria oficial de iconos del sistema — y este encargo no puede añadir
 * dependencias. Hereda currentColor y va oculto al lector de pantalla: el
 * nombre accesible lo pone el label del chip. Se sustituye con la prop `icon`
 * en cuanto Phosphor entre en el paquete. */
function FunnelGlyph() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M2.25 3.25h11.5l-4.5 5.25v4.25l-2.5 1.25V8.5L2.25 3.25Z" />
    </svg>
  );
}

/* Marca de la casilla. Path de `check` (bold) de Phosphor, la libreria oficial
 * del sistema, inline por el mismo motivo que el embudo. */
function CheckGlyph() {
  return (
    <svg
      viewBox="0 0 256 256"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      // 12 sobre una casilla de 20, como el prototipo.
      className="size-3 shrink-0"
    >
      <path d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z" />
    </svg>
  );
}

/** Una opcion marcable del panel. */
export interface FilterOption {
  /** Valor que viaja en `value` / `onValueChange`. Unico dentro del grupo. */
  value: string;
  /** Texto de la fila. Va en caja normal: es contenido, no un rotulo mono. */
  label: React.ReactNode;
  /** Fila apagada. Ni marca ni recibe el puntero. */
  disabled?: boolean;
}

export interface FilterChipProps
  /* `value` y `defaultValue` de <button> son string | number | string[] y aqui
       significan otra cosa — los filtros aplicados — asi que se reescriben. */
  extends
    Omit<React.ComponentPropsWithoutRef<"button">, "color" | "value" | "defaultValue">,
    Omit<FilterChipVariants, "open"> {
  /**
   * Opciones del popover. En cuanto se pasan, el componente monta el panel
   * entero — cabecera, lista marcable y el par LIMPIAR / APLICAR — y gobierna
   * su apertura con Radix Popover.
   *
   * Si se omite, el chip es solo el disparador y el panel lo pone el consumidor.
   */
  options?: FilterOption[];
  /**
   * Rotulo del grupo, arriba del panel. Da nombre accesible al popover.
   * Por defecto, "Estado" — el que dibuja el documento.
   */
  heading?: React.ReactNode;
  /** Filtros aplicados. Controlado; usa `defaultValue` para no controlarlo. */
  value?: string[];
  /** Filtros aplicados de partida. No controlado. */
  defaultValue?: string[];
  /**
   * Avisa de los filtros CONFIRMADOS, en el orden de `options`. Salta al pulsar
   * APLICAR, o en cada marca si `applyOnSelect` esta puesto. Marcar una casilla
   * sin confirmar no dispara nada: es un borrador.
   */
  onValueChange?: (value: string[]) => void;
  /**
   * "En listas cortas, los cambios pueden aplicar al instante y omitir Aplicar".
   * Con esto el boton APLICAR desaparece y cada marca confirma sin cerrar.
   */
  applyOnSelect?: boolean;
  /** Texto del boton que deja el grupo en cero. Sube a mayusculas por CSS. */
  clearLabel?: React.ReactNode;
  /** Texto del boton que confirma y cierra. Sube a mayusculas por CSS. */
  applyLabel?: React.ReactNode;
  /**
   * Popover desplegado. Pinta el estado OPEN / ACTIVE y, cuando se pasa,
   * convierte el chip en un disparador de disclosure: expone `aria-expanded` y
   * `aria-haspopup="dialog"`.
   *
   * Con `options`, ademas gobierna el panel desde fuera.
   *
   * Si se omite y no hay `options`, el chip no anuncia ningun popover — util
   * cuando el filtro se aplica al instante y no hay panel que abrir.
   */
  open?: boolean;
  /** Apertura inicial del panel. No controlada. Solo con `options`. */
  defaultOpen?: boolean;
  /** Avisa de cada apertura y de cada cierre del panel. */
  onOpenChange?: (open: boolean) => void;
  /**
   * Filtros activos. El badge en tinta solo aparece con un numero mayor que
   * cero: sin filtros puestos, no se dibuja (regla "BADGE = ACTIVOS").
   *
   * Con `options` se calcula solo a partir de los filtros aplicados; pasarlo
   * lo sobreescribe.
   */
  count?: number;
  /**
   * Texto que anuncia el lector en lugar de la cifra suelta del badge.
   * Por defecto, "N filtros activos".
   */
  countLabel?: string;
  /**
   * Icono antes del label. Por defecto un embudo. Pasa `null` para quitarlo.
   */
  icon?: React.ReactNode;
  /** Lado del panel respecto al chip. Por defecto abajo. */
  side?: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>["side"];
  /** Alineacion del panel. Por defecto pegado al borde izquierdo del chip. */
  align?: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>["align"];
  /** Separacion chip-panel. El documento dibuja 8. */
  sideOffset?: number;
  /** Contenedor del portal, para tests y para paneles dentro de un modal. */
  container?: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Portal>["container"];
  /**
   * Bloquea el scroll y oculta el resto del arbol al lector. A false porque un
   * filtro no interrumpe la tarea: Radix sigue cerrando con Escape, con click
   * fuera y devolviendo el foco al chip.
   */
  modal?: boolean;
  /** Clases del panel flotante. */
  contentClassName?: string;
}

/**
 * Filtro del sistema Tikin — EXTENSION, no viene del archivo de Figma.
 *
 * Chip que abre un popover con varios criterios marcables a la vez, badge con
 * la cuenta de los que estan puestos y acciones LIMPIAR / APLICAR. Para una
 * sola dimension con pocas opciones no uses esto: usa un segmented control.
 *
 * Reglas de cierre del documento: el panel cierra al APLICAR o al hacer click
 * fuera; LIMPIAR deja el grupo en cero SIN cerrar. Lo que se marca dentro es un
 * borrador — si el panel se cierra sin confirmar, se descarta y el badge no se
 * mueve. Con `applyOnSelect` no hay borrador: cada marca ya es definitiva.
 *
 * El label se escribe en caja normal y se pone en MAYUSCULAS por CSS, nunca con
 * `.toUpperCase()` en JS, para que el texto que anuncia el lector de pantalla y
 * el que se copia al portapapeles conserven su capitalizacion.
 */
export const FilterChip = React.forwardRef<HTMLButtonElement, FilterChipProps>(function FilterChip(
  {
    className,
    contentClassName,
    open,
    defaultOpen,
    onOpenChange,
    options,
    heading = "Estado",
    value,
    defaultValue,
    onValueChange,
    applyOnSelect = false,
    clearLabel = "Limpiar",
    applyLabel = "Aplicar",
    count,
    countLabel,
    icon,
    children = "Filter",
    type,
    disabled,
    side = "bottom",
    align = "start",
    sideOffset = 8,
    container,
    modal = false,
    ...props
  },
  ref,
) {
  const hayPanel = options !== undefined;

  /* --- apertura ---------------------------------------------------------- */
  const [abiertoInterno, setAbiertoInterno] = React.useState(defaultOpen ?? false);
  const aperturaControlada = open !== undefined;
  const abierto = aperturaControlada ? open : abiertoInterno;

  /* --- seleccion aplicada ------------------------------------------------ */
  const [aplicadosInternos, setAplicadosInternos] = React.useState<string[]>(defaultValue ?? []);
  const seleccionControlada = value !== undefined;
  const aplicados = seleccionControlada ? value : aplicadosInternos;

  /* Borrador: lo que hay marcado en el panel mientras no se confirma. */
  const [borrador, setBorrador] = React.useState<string[]>(aplicados);

  /* El borrador se rehace en cada APERTURA, no en el cierre. Es la unica forma
     de que no dependa del orden de los setState: APLICAR confirma y cierra en
     el mismo gesto, asi que resetear al cerrar lo devolveria a los `aplicados`
     viejos de ese render. Un borrador huerfano tras un cierre por Escape o por
     click fuera no se ve — el panel esta cerrado y el badge cuenta `aplicados`,
     no el borrador — y muere en la siguiente apertura.
     El efecto y no el manejador porque `abierto` tambien puede cambiar desde
     fuera, con la prop `open`, sin que Radix avise. */
  const estabaAbierto = React.useRef(abierto);
  React.useEffect(() => {
    if (abierto && !estabaAbierto.current) setBorrador(aplicados);
    estabaAbierto.current = abierto;
  }, [abierto, aplicados]);

  const cambiarApertura = (siguiente: boolean) => {
    if (!aperturaControlada) setAbiertoInterno(siguiente);
    onOpenChange?.(siguiente);
  };

  const cerrar = () => {
    if (!aperturaControlada) setAbiertoInterno(false);
    onOpenChange?.(false);
  };

  /* Sin borrador que confirmar, la marca ya es la seleccion definitiva. */
  const marcados = applyOnSelect ? aplicados : borrador;

  const confirmar = (siguiente: string[]) => {
    if (!seleccionControlada) setAplicadosInternos(siguiente);
    onValueChange?.(siguiente);
  };

  /* El array sale siempre en el orden de `options`, no en el de los clicks: asi
     dos usuarios que marcan lo mismo emiten el mismo valor y el consumidor
     puede compararlo sin ordenar. */
  const alternar = (valorOpcion: string, marcado: boolean) => {
    const activos = new Set(marcados);
    if (marcado) activos.add(valorOpcion);
    else activos.delete(valorOpcion);
    const siguiente = (options ?? []).filter((o) => activos.has(o.value)).map((o) => o.value);

    if (applyOnSelect) confirmar(siguiente);
    else setBorrador(siguiente);
  };

  const limpiar = () => {
    // "Limpiar deja el grupo en cero sin cerrar": no se toca la apertura.
    if (applyOnSelect) confirmar([]);
    else setBorrador([]);
  };

  const aplicar = () => {
    // "Aplicar confirma y cierra".
    confirmar(borrador);
    cerrar();
  };

  const idCabecera = React.useId();

  /* Con panel propio el conteo sale de los filtros aplicados; `count` lo
     sobreescribe para los casos en los que la cuenta la lleva el consumidor. */
  const total = count ?? (hayPanel ? aplicados.length : undefined);
  const hayBadge = typeof total === "number" && total > 0;

  /* Solo es un disclosure si hay panel: el nuestro, o uno que gobierne el
     consumidor con `open`. Anunciar aria-haspopup sin panel que abrir es
     mentirle al lector. Cuando el panel es nuestro, esos atributos los pone
     Radix en el Trigger y no los duplicamos aqui. */
  const ariaPropia = !hayPanel && open !== undefined;

  /* Objeto y no `aria-x={cond ? v : undefined}`: el Slot de Radix da prioridad
     a las props del hijo por CLAVE PRESENTE, asi que un `aria-haspopup:
     undefined` escrito aqui borraria el que pone el Trigger. */
  const ariaDisclosure = ariaPropia
    ? ({ "aria-expanded": open, "aria-haspopup": "dialog" } as const)
    : {};

  const chip = (
    <button
      ref={ref}
      // Sin type explicito un <button> dentro de un <form> lo envia, y este
      // chip vive justo en barras de busqueda y de filtros.
      type={type ?? "button"}
      disabled={disabled}
      {...ariaDisclosure}
      className={cn(filterChip({ open: abierto, className }))}
      {...props}
    >
      {icon === undefined ? <FunnelGlyph /> : icon}
      {children}
      {hayBadge && (
        <>
          {/* La cifra suelta se leeria como "FILTER 2", que no dice nada. Va
              oculta al lector y el sentido lo pone el texto de al lado. */}
          <span
            aria-hidden="true"
            className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-(--radius-pill) bg-ink px-[5px] font-meta text-[11px] text-surface tabular-nums"
          >
            {total}
          </span>
          <span className="sr-only">{countLabel ?? `${total} filtros activos`}</span>
        </>
      )}
    </button>
  );

  if (!hayPanel) return chip;

  return (
    <PopoverPrimitive.Root open={abierto} onOpenChange={cambiarApertura} modal={modal}>
      {/* `disabled` va tambien en el Trigger, no solo en el <button>: Radix
          corta ahi su propio onPointerDown y sin eso el panel llega a abrirse
          en entornos que despachan eventos de puntero sobre controles
          deshabilitados. */}
      <PopoverPrimitive.Trigger asChild disabled={disabled}>
        {chip}
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal container={container}>
        <PopoverPrimitive.Content
          side={side}
          align={align}
          sideOffset={sideOffset}
          // El panel es un dialogo para Radix; la cabecera del grupo le da
          // nombre, asi el lector anuncia "Estado" al entrar.
          aria-labelledby={idCabecera}
          className={cn(filterPanel, contentClassName)}
        >
          <div
            id={idCabecera}
            className="px-2.5 py-1.5 font-meta text-[10px] tracking-[0.1em] text-ink-500 uppercase"
          >
            {heading}
          </div>

          {/* role=group + el mismo rotulo: las casillas se anuncian como un
              conjunto, no como controles sueltos dentro del dialogo. */}
          <div role="group" aria-labelledby={idCabecera} className="flex flex-col gap-0.5">
            {options.map((opcion) => {
              const marcado = marcados.includes(opcion.value);
              return (
                <CheckboxPrimitive.Root
                  key={opcion.value}
                  checked={marcado}
                  disabled={opcion.disabled}
                  onCheckedChange={(estado) => alternar(opcion.value, estado === true)}
                  className={cn(filterOption)}
                >
                  {/* La casilla es decorativa: el estado ya lo lleva el
                      aria-checked de la fila. */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-xs transition-colors duration-140 ease-out",
                      marcado ? "bg-ink text-surface" : "border border-edge-2 bg-surface",
                    )}
                  >
                    {marcado && <CheckGlyph />}
                  </span>
                  <span>{opcion.label}</span>
                </CheckboxPrimitive.Root>
              );
            })}
          </div>

          {/* Divisor de 1px entre la lista y las acciones. */}
          <div aria-hidden="true" className="mx-1.5 my-1.5 h-px bg-surface-2" />

          <div className="flex gap-2 px-1 pt-0.5 pb-1">
            <button
              type="button"
              onClick={limpiar}
              className={cn(filterAction({ tone: "secondary" }))}
            >
              {clearLabel}
            </button>
            {/* "En listas cortas los cambios pueden aplicar al instante y
                omitir Aplicar": entonces el boton sobra. */}
            {!applyOnSelect && (
              <button
                type="button"
                onClick={aplicar}
                className={cn(filterAction({ tone: "primary" }))}
              >
                {applyLabel}
              </button>
            )}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
});
