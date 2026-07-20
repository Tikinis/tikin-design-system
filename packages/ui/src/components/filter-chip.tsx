import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/* Seccion 22 · Filter — EXTENSION construida con los tokens del sistema.
 *
 * El propio documento la etiqueta asi ("Extension con tokens del sistema") y no
 * hay ningun componente Filter en docs/figma-export/components/: el archivo de
 * Figma no define este control. No es especificacion aprobada.
 *
 * Alcance: FilterChip es SOLO el disparador — el pill que abre el popover de
 * opciones. El panel (cabecera ESTADO, la lista marcable y el par
 * LIMPIAR / APLICAR) no se construye aqui; el chip se limita a comunicar su
 * estado abierto y cuantos filtros hay puestos.
 *
 * MEDIDAS, del bloque "ESTADOS DEL BOTON" del documento (no de la demo EN VIVO,
 * que ahi coincide pero es una demo interactiva):
 *   alto 40 · px 16 · gap 8 · radio 999 · borde 1 · icono 16
 *   label Ubuntu Sans Mono 14 con +2% de tracking
 *   badge: min-width 20 · alto 20 · radio 999 · Ubuntu Mono 11 · px 5
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

export interface FilterChipProps
  extends
    Omit<React.ComponentPropsWithoutRef<"button">, "color">,
    Omit<FilterChipVariants, "open"> {
  /**
   * Popover desplegado. Pinta el estado OPEN / ACTIVE y, cuando se pasa,
   * convierte el chip en un disparador de disclosure: expone `aria-expanded` y
   * `aria-haspopup="dialog"`.
   *
   * Si se omite, el chip no anuncia ningun popover — util cuando el filtro se
   * aplica al instante y no hay panel que abrir.
   */
  open?: boolean;
  /**
   * Filtros activos. El badge en tinta solo aparece con un numero mayor que
   * cero: sin filtros puestos, no se dibuja (regla "BADGE = ACTIVOS").
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
}

/**
 * Chip de filtro del sistema Tikin — EXTENSION, no viene del archivo de Figma.
 *
 * Abre un popover con varios criterios marcables a la vez. Para una sola
 * dimension con pocas opciones no uses esto: usa un segmented control.
 *
 * El label se escribe en caja normal y se pone en MAYUSCULAS por CSS, nunca con
 * `.toUpperCase()` en JS, para que el texto que anuncia el lector de pantalla y
 * el que se copia al portapapeles conserven su capitalizacion.
 */
export const FilterChip = React.forwardRef<HTMLButtonElement, FilterChipProps>(function FilterChip(
  { className, open, count, countLabel, icon, children = "Filter", type, disabled, ...props },
  ref,
) {
  /* Solo es un disclosure si el consumidor gobierna el popover. Anunciar
     aria-haspopup sin que haya panel que abrir es mentirle al lector. */
  const esDisclosure = open !== undefined;
  const hayBadge = typeof count === "number" && count > 0;

  return (
    <button
      ref={ref}
      // Sin type explicito un <button> dentro de un <form> lo envia, y este
      // chip vive justo en barras de busqueda y de filtros.
      type={type ?? "button"}
      disabled={disabled}
      aria-expanded={esDisclosure ? open : undefined}
      aria-haspopup={esDisclosure ? "dialog" : undefined}
      className={cn(filterChip({ open: open ?? false, className }))}
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
            {count}
          </span>
          <span className="sr-only">{countLabel ?? `${count} filtros activos`}</span>
        </>
      )}
    </button>
  );
});
