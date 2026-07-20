import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/* Seccion 13 · Calendario y pickers — MIXTO.
 *
 * Lo que hay en el archivo de Figma (CANONICO) son TRES piezas sueltas, no un
 * calendario montado:
 *
 *   Calendar / Day Button    node 2:156688 · 10 variantes  -> CalendarDay
 *   Calendar / Day Header    node 2:156675                 -> CalendarWeekday
 *   Calendar / Arrow Button  node 2:156649 ·  8 variantes  -> CalendarNavButton
 *
 * La cuadricula del mes, la cabecera con el nombre del mes y toda la navegacion
 * por teclado son EXTENSION: no existe ningun nodo de mes en el archivo, y la
 * seccion 13 del documento se limita a instanciar las tres piezas de arriba.
 * No cites `Calendar` como especificacion aprobada; las tres subpiezas si.
 *
 * GEOMETRIA CANONICA (docs/figma-export/components/Calendar*.jsx, que es
 * autoridad sobre pixeles: el prototipo solo pinta las piezas con x-import)
 *
 *   dia      32x32 (--width-w-8 / --height-h-8) · r8 · texto 14/20 · padding 0
 *            default    texto --base-foreground, sin fondo
 *            hover      fondo --base-accent, texto --base-accent-foreground
 *            selected   fondo --base-primary, texto --base-primary-foreground
 *            focus      halo 0 0 0 3px rgba(163,163,163,.5)
 *            current    fondo --base-accent, texto --base-accent-foreground
 *            outside    opacidad .5, texto --base-muted-foreground
 *            outside+hover     opacidad .5, fondo acento, texto foreground
 *            outside+selected  opacidad .5, fondo acento, texto muted
 *            outside+pressed   opacidad .3
 *            disabled   opacidad .5
 *   header   ancho 32 · alto 21 · texto 12/16 · --base-muted-foreground
 *   flecha   32x32 · r8 · glifo 16
 *
 * CUATRO DESVIACIONES DELIBERADAS, Y POR QUE
 * ------------------------------------------
 * 1. EL FONDO DE LA FLECHA NO USA SUS TOKENS DE FIGMA. El nodo pinta
 *    --custom-background-dark-input-30 en reposo y --custom-accent-dark-input-50
 *    en hover. Esos dos tokens estan pensados solo para oscuro: en claro
 *    resuelven a var(--base-background) = blanco puro, asi que la flecha
 *    desapareceria sobre la tarjeta blanca del calendario. Se sustituyen por
 *    --tk-surface-2 / --tk-surface-3, que si invierten en los dos modos. Es el
 *    mismo criterio que el documento aplica al primary de Button. Si Figma
 *    algun dia da valores claros a esos tokens, este es el sitio donde volver.
 *
 * 2. LA OPACIDAD .5 DEL REPOSO DE LA FLECHA TAMPOCO SE COPIA. En Figma existe
 *    para atenuar un relleno blanco al 4,5% sobre fondo oscuro; aplicada sobre
 *    un --tk-surface-2 real atenuaria tambien el glifo y bajaria su contraste
 *    por debajo del minimo. El peso visual lo lleva ya el propio surface-2.
 *
 * 3. LA FLECHA DISABLED SE DIBUJA. El export mapea "state=disabled" al MISMO
 *    cuerpo que "default" en las dos direcciones — es un hueco del archivo, no
 *    una decision: un tope indistinguible del estado activo no se puede usar.
 *    Se baja el glifo a --tk-400 y se corta el puntero, igual que en Pagination.
 *
 * 4. LOS NUMEROS VAN EN MONO, NO EN GEIST. El export declara Geist, que no es
 *    ninguna de las cinco familias del sistema (seccion 02). La seccion 23 lo
 *    resuelve explicitamente: "Los numeros en Ubuntu Sans Mono" -> font-mono.
 *
 * DIAS DESHABILITADOS: aria-disabled, NUNCA el atributo `disabled`
 * ---------------------------------------------------------------
 * Un dia fuera de rango sigue siendo enfocable. Lo pide el patron de rejilla de
 * la APG: si los huecos se saltan, las flechas del teclado se vuelven
 * impredecibles — pulsar "abajo" salta 7, 14 o 21 dias segun lo que haya
 * apagado — y el usuario pierde el mapa del mes. Ademas un boton `disabled`
 * deja de ser enfocable, asi que el foco se caeria al body a mitad de recorrido.
 * Mismo criterio que `loading` en Button y que los topes de Pagination.
 *
 * COLOR EN TEMA OSCURO
 * --------------------
 * Los tokens --base-* de la seccion (accent, primary, foreground,
 * muted-foreground y sus foregrounds) SI se redefinen en el bloque .dark de
 * figma.css, asi que se usan tal cual. El resto sale de utilidades semanticas.
 * No hay ni un color fijo salvo el halo de foco, que Figma define en gris medio
 * al 50% precisamente para que lea igual sobre claro y sobre oscuro.
 */

/* Geometria de Phosphor — la libreria de iconos oficial del sistema — copiada a
 * mano (viewBox 256, trazo 16 = peso regular) porque el paquete de iconos no es
 * dependencia de packages/ui y este encargo no puede tocar su package.json.
 * Figma dibuja un chevron de Lucide; el caret de Phosphor es el equivalente. */
const CaretLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 256 256" fill="none" aria-hidden="true" {...props}>
    <path
      d="M160 208 80 128l80-80"
      stroke="currentColor"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CaretRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 256 256" fill="none" aria-hidden="true" {...props}>
    <path
      d="m96 48 80 80-80 80"
      stroke="currentColor"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* Halo de foco del archivo: 3px de gris medio al 50%. Es un valor literal a
   proposito — no es un color de marca sino un anillo neutro que Figma elige
   para que contraste tanto sobre la tarjeta clara como sobre la oscura. */
const FOCUS_RING = "outline-none focus-visible:ring-[3px] focus-visible:ring-[rgba(163,163,163,0.5)]";

/* ------------------------------------------------------------------------ */
/* Utilidades de fecha                                                       */
/* ------------------------------------------------------------------------ */

/* Todo se construye con el constructor de tres argumentos, que normaliza solo
   los desbordes (dia 0 = ultimo del mes anterior, dia 32 = del siguiente). Ni
   una suma de milisegundos: sumar 24h cruza mal los cambios de hora y el dia
   saltado o repetido aparece como un hueco en la rejilla. */

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addDays(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

/** Suma meses saturando el dia: 31 de enero + 1 mes = 28/29 de febrero, no el 3 de marzo. */
function addMonths(date: Date, amount: number): Date {
  const target = new Date(date.getFullYear(), date.getMonth() + amount, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(date.getDate(), lastDay));
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

/** Clave estable para React y para localizar el boton al mover el foco. */
function dayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

/** Primer dia de la semana que contiene `date`, segun donde arranque la semana. */
function startOfWeek(date: Date, weekStartsOn: CalendarWeekStart): Date {
  // El +7 antes del modulo evita el resto negativo de JavaScript: con la semana
  // empezando en lunes y `date` en domingo, (0 - 1) % 7 daria -1 y no 6.
  const offset = (date.getDay() - weekStartsOn + 7) % 7;
  return addDays(date, -offset);
}

/** 0 = domingo … 6 = sabado. En castellano la semana empieza en lunes (1). */
export type CalendarWeekStart = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Reparte el mes en SEIS filas de siete dias, rellenando los extremos con dias
 * del mes anterior y del siguiente.
 *
 * Siempre seis, aunque el mes quepa en cinco: si el numero de filas cambiara
 * de un mes a otro, el calendario crecería y encogería al navegar y todo lo
 * que tenga debajo daria un salto.
 *
 * Se exporta a proposito. Es logica pura y sin DOM, asi que quien monte otra
 * rejilla (un rango de dos meses, un mini calendario) reutiliza el mismo
 * reparto sin copiar el componente.
 */
export function getCalendarGrid(month: Date, weekStartsOn: CalendarWeekStart = 1): Date[][] {
  const first = startOfMonth(month);
  const start = startOfWeek(first, weekStartsOn);
  return Array.from({ length: 6 }, (_, week) =>
    Array.from({ length: 7 }, (_, day) => addDays(start, week * 7 + day)),
  );
}

/* ------------------------------------------------------------------------ */
/* Dia — Calendar / Day Button                                               */
/* ------------------------------------------------------------------------ */

const calendarDay = cva(
  [
    "relative flex size-8 items-center justify-center rounded-sm",
    // Las cifras van SIEMPRE mono, como el resto de numeros del sistema.
    "font-mono text-sm leading-5 tabular-nums",
    "cursor-pointer transition-colors duration-140 ease-out select-none",
    FOCUS_RING,
  ],
  {
    variants: {
      /* `current` es HOY. En el archivo se dibuja con relleno de acento, igual
         que el hover — no con borde. Ver discrepancia anotada en las stories. */
      variant: {
        default: "bg-transparent text-[var(--base-foreground)]",
        current: "bg-[var(--base-accent)] text-[var(--base-accent-foreground)]",
        outside: "bg-transparent text-[var(--base-muted-foreground)] opacity-50",
      },
      selected: {
        true: "bg-[var(--base-primary)] text-[var(--base-primary-foreground)]",
        false: "",
      },
      disabled: { true: "cursor-not-allowed opacity-50", false: "" },
    },

    compoundVariants: [
      /* El hover solo existe mientras el dia se puede pulsar: sobre un dia ya
         seleccionado repintaria el acento encima de la tinta y pareceria que
         la seleccion se ha perdido. */
      {
        variant: "default",
        selected: false,
        disabled: false,
        class: "hover:bg-[var(--base-accent)] hover:text-[var(--base-accent-foreground)]",
      },
      {
        variant: "outside",
        selected: false,
        disabled: false,
        class:
          "hover:bg-[var(--base-accent)] hover:text-[var(--base-foreground)] active:opacity-30",
      },
      /* Un dia de otro mes seleccionado NO se pinta en tinta llena: se queda en
         acento atenuado, para que el mes en curso siga siendo el protagonista. */
      { variant: "outside", selected: true, class: "bg-[var(--base-accent)] text-[var(--base-muted-foreground)]" },
    ],

    defaultVariants: { variant: "default", selected: false, disabled: false },
  },
);

export interface CalendarDayProps
  extends Omit<React.ComponentPropsWithoutRef<"button">, "type" | "disabled">,
    Omit<VariantProps<typeof calendarDay>, "selected" | "disabled"> {
  /** Dia elegido. Relleno en tinta (`--base-primary`). */
  selected?: boolean;
  /**
   * Fuera de rango. NO emite el atributo `disabled`: baja a opacidad .5,
   * conserva el foco y corta el clic. Ver cabecera del fichero.
   */
  disabled?: boolean;
}

/**
 * Celda de un dia — CANONICO (Calendar / Day Button, node 2:156688).
 *
 * `Calendar` la usa por dentro; se exporta para quien monte otra rejilla (un
 * rango de dos meses, un mini calendario) sin repetir los tokens.
 */
export const CalendarDay = React.forwardRef<HTMLButtonElement, CalendarDayProps>(
  function CalendarDay({ className, variant, selected = false, disabled = false, onClick, ...props }, ref) {
    return (
      <button
        ref={ref}
        // Sin type explicito un <button> dentro de un <form> lo envia.
        type="button"
        className={cn(calendarDay({ variant, selected, disabled }), className)}
        aria-disabled={disabled || undefined}
        onClick={(event) => {
          // Al no poner el atributo `disabled` (para no perder el foco) hay que
          // cortar el clic a mano.
          if (disabled) {
            event.preventDefault();
            return;
          }
          onClick?.(event);
        }}
        {...props}
      />
    );
  },
);

/* ------------------------------------------------------------------------ */
/* Cabecera de columna — Calendar / Day Header                               */
/* ------------------------------------------------------------------------ */

export interface CalendarWeekdayProps extends React.ComponentPropsWithoutRef<"div"> {
  /**
   * Nombre completo del dia para el lector de pantalla. El texto visible va
   * abreviado a dos letras y "Mi" o "Ju" sueltos no significan nada en voz alta.
   */
  label?: string;
}

/**
 * Cabecera de una columna — CANONICO (Calendar / Day Header, node 2:156675).
 *
 * 32 de ancho y 21 de alto: el ancho cuadra con la celda de dia, la altura no,
 * y es asi en el archivo.
 */
export const CalendarWeekday = React.forwardRef<HTMLDivElement, CalendarWeekdayProps>(
  function CalendarWeekday({ className, label, ...props }, ref) {
    return (
      <div
        ref={ref}
        role="columnheader"
        aria-label={label}
        className={cn(
          "flex h-[21px] w-8 shrink-0 items-center justify-center",
          // Mayusculas iniciales POR CSS. Intl devuelve "lun" en minuscula y
          // pasarlo por JS romperia el texto que copia el usuario.
          "font-mono text-xs leading-4 capitalize text-[var(--base-muted-foreground)] select-none",
          className,
        )}
        {...props}
      />
    );
  },
);

/* ------------------------------------------------------------------------ */
/* Flecha — Calendar / Arrow Button                                          */
/* ------------------------------------------------------------------------ */

export interface CalendarNavButtonProps
  extends Omit<React.ComponentPropsWithoutRef<"button">, "type" | "disabled"> {
  /** Nombres de variante del archivo: `previous` y `next`. */
  direction: "previous" | "next";
  /** Tope alcanzado. aria-disabled, no el atributo: conserva el foco. */
  disabled?: boolean;
}

/**
 * Flecha de mes anterior / siguiente — CANONICO en geometria (Calendar / Arrow
 * Button, node 2:156649), con el color adaptado a los dos temas: ver
 * desviaciones 1 a 3 en la cabecera del fichero.
 */
export const CalendarNavButton = React.forwardRef<HTMLButtonElement, CalendarNavButtonProps>(
  function CalendarNavButton({ className, direction, disabled = false, onClick, ...props }, ref) {
    const Caret = direction === "previous" ? CaretLeftIcon : CaretRightIcon;
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "inline-flex size-8 shrink-0 items-center justify-center rounded-sm",
          "bg-surface-2 text-ink",
          "cursor-pointer transition-colors duration-140 ease-out select-none",
          FOCUS_RING,
          "hover:not-aria-disabled:bg-surface-3",
          "aria-disabled:cursor-not-allowed aria-disabled:text-ink-400",
          className,
        )}
        aria-disabled={disabled || undefined}
        onClick={(event) => {
          if (disabled) {
            event.preventDefault();
            return;
          }
          onClick?.(event);
        }}
        {...props}
      >
        <Caret className="size-4 shrink-0" />
      </button>
    );
  },
);

/* ------------------------------------------------------------------------ */
/* Calendar                                                                  */
/* ------------------------------------------------------------------------ */

export interface CalendarLabels {
  /** Nombre accesible de la flecha izquierda. */
  previousMonth: string;
  /** Nombre accesible de la flecha derecha. */
  nextMonth: string;
}

const DEFAULT_LABELS: CalendarLabels = {
  previousMonth: "Mes anterior",
  nextMonth: "Mes siguiente",
};

export interface CalendarProps
  // `onSelect` y `defaultValue` existen en <div> con otro significado.
  extends Omit<React.ComponentPropsWithoutRef<"div">, "onSelect" | "defaultValue"> {
  /** Mes visible, controlado. Solo cuenta el año y el mes. */
  month?: Date;
  /** Mes visible inicial cuando el componente se gobierna solo. */
  defaultMonth?: Date;
  /** Se llama con el dia 1 del mes destino cada vez que cambia la vista. */
  onMonthChange?: (month: Date) => void;

  /** Dia elegido, controlado. `null` = ninguno. */
  selected?: Date | null;
  /** Dia elegido inicial cuando el componente se gobierna solo. */
  defaultSelected?: Date | null;
  /** Se llama con el dia pulsado. Nunca se dispara sobre un dia deshabilitado. */
  onSelect?: (date: Date) => void;

  /** Que dia se marca como hoy. Se inyecta para congelarlo en tests y stories. */
  today?: Date;
  /** Primer dia seleccionable, inclusive. */
  minDate?: Date;
  /** Ultimo dia seleccionable, inclusive. */
  maxDate?: Date;
  /** Regla extra de bloqueo — festivos, fines de semana, fechas ya ocupadas. */
  isDateDisabled?: (date: Date) => boolean;

  /** Donde empieza la semana. Por defecto lunes, como en castellano. */
  weekStartsOn?: CalendarWeekStart;
  /** Pinta los dias del mes anterior y del siguiente. Por defecto si. */
  showOutsideDays?: boolean;

  /** Locale de los nombres de mes y de dia. */
  locale?: string;
  /** Titulo del mes. Por defecto "Julio 2026". */
  formatMonthCaption?: (month: Date, locale: string) => string;
  /** Texto visible de la cabecera de columna. Por defecto dos letras. */
  formatWeekday?: (date: Date, locale: string) => string;
  /** Nombre accesible de cada dia. Por defecto la fecha larga. */
  formatDay?: (date: Date, locale: string) => string;

  /** Textos accesibles. Se fusiona con los del sistema. */
  labels?: Partial<CalendarLabels>;
}

function defaultMonthCaption(month: Date, locale: string): string {
  /* Un solo formateador con {month:"long", year:"numeric"} devuelve "julio de
     2026" en castellano. El documento escribe "Julio 2026", asi que se componen
     las dos partes por separado y las mayusculas iniciales las pone el CSS. */
  const name = new Intl.DateTimeFormat(locale, { month: "long" }).format(month);
  return `${name} ${month.getFullYear()}`;
}

function defaultWeekday(date: Date, locale: string): string {
  /* Intl no tiene un formato de dos letras: "short" da "lun" (con punto en
     algunos entornos) y "narrow" da "L", que colisiona entre lunes y... nada,
     pero deja martes y miercoles indistinguibles del resto en varios idiomas.
     Se recorta "short" a dos caracteres, que es lo que dibuja el documento. */
  return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(date).replace(/\./g, "").slice(0, 2);
}

function defaultDayLabel(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(date);
}

/**
 * Calendario de un mes del sistema Tikin.
 *
 * Las tres piezas que lo componen — dia, cabecera y flecha — vienen del archivo
 * de Figma; el montaje del mes y la navegacion por teclado son EXTENSION.
 *
 * Sigue el patron de rejilla de la APG: un solo dia es tabulable (roving
 * tabindex) y dentro se anda con las flechas. Flechas = un dia o una semana,
 * Inicio/Fin = extremos de la semana, AvPag/RePag = un mes (con Mayusculas, un
 * año), Enter o Espacio eligen. Cruzar el borde del mes cambia la vista y el
 * foco sigue al dia, para que el recorrido nunca se interrumpa.
 *
 * Funciona controlado (`month` / `selected`) o por su cuenta (`defaultMonth` /
 * `defaultSelected`); las dos formas se pueden mezclar.
 */
export const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(function Calendar(
  {
    className,
    month: monthProp,
    defaultMonth,
    onMonthChange,
    selected: selectedProp,
    defaultSelected,
    onSelect,
    today: todayProp,
    minDate,
    maxDate,
    isDateDisabled,
    weekStartsOn = 1,
    showOutsideDays = true,
    locale = "es-ES",
    formatMonthCaption = defaultMonthCaption,
    formatWeekday = defaultWeekday,
    formatDay = defaultDayLabel,
    labels,
    ...props
  },
  ref,
) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const captionId = React.useId();

  /* `today` se congela una sola vez por montaje. Recalcular new Date() en cada
     render haria que el componente cambiara de aspecto a medianoche a mitad de
     interaccion, y ademas rompe cualquier test o snapshot. */
  const [fallbackToday] = React.useState(() => startOfDay(new Date()));
  const today = todayProp ? startOfDay(todayProp) : fallbackToday;

  /* ---- mes visible: controlado o propio ---- */
  const [monthState, setMonthState] = React.useState(() =>
    startOfMonth(defaultMonth ?? defaultSelected ?? selectedProp ?? today),
  );
  const month = monthProp ? startOfMonth(monthProp) : monthState;
  const monthKey = `${month.getFullYear()}-${month.getMonth()}`;

  const changeMonth = (next: Date) => {
    const first = startOfMonth(next);
    if (!monthProp) setMonthState(first);
    onMonthChange?.(first);
  };

  /* ---- dia elegido: controlado o propio ---- */
  const [selectedState, setSelectedState] = React.useState<Date | null>(defaultSelected ?? null);
  const selected = selectedProp !== undefined ? selectedProp : selectedState;

  /* ---- roving tabindex ---- */
  const preferredFocus = (visible: Date): Date => {
    if (selected && isSameMonth(selected, visible)) return startOfDay(selected);
    if (isSameMonth(today, visible)) return today;
    return startOfMonth(visible);
  };

  const [focusedDate, setFocusedDate] = React.useState(() => preferredFocus(month));

  /* Cuando el mes cambia desde FUERA (prop `month`, o un boton del consumidor)
     el dia enfocado puede quedarse en el mes anterior y ninguna celda seria
     tabulable. Se corrige DURANTE el render, no en un efecto: con useEffect se
     pintaria un fotograma entero con la rejilla sin punto de entrada. */
  const [lastMonthKey, setLastMonthKey] = React.useState(monthKey);
  if (monthKey !== lastMonthKey) {
    setLastMonthKey(monthKey);
    if (!isSameMonth(focusedDate, month)) setFocusedDate(preferredFocus(month));
  }

  /* El foco solo se mueve a mano DESPUES de una pulsacion de teclado. Sin esta
     bandera el calendario robaria el foco al montarse y en cada render. */
  const shouldFocusRef = React.useRef(false);
  const gridRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!shouldFocusRef.current) return;
    shouldFocusRef.current = false;
    gridRef.current
      ?.querySelector<HTMLButtonElement>(`[data-tk-day="${dayKey(focusedDate)}"]`)
      ?.focus();
  });

  const moveFocusTo = (next: Date) => {
    shouldFocusRef.current = true;
    setFocusedDate(next);
    if (!isSameMonth(next, month)) changeMonth(next);
  };

  /* ---- bloqueo ---- */
  const isDisabled = (date: Date): boolean => {
    const day = startOfDay(date);
    if (minDate && day < startOfDay(minDate)) return true;
    if (maxDate && day > startOfDay(maxDate)) return true;
    return isDateDisabled?.(day) ?? false;
  };

  /* Las flechas se apagan cuando el mes de destino cae entero fuera de rango:
     el ultimo dia del mes anterior por debajo del minimo, o el primero del
     siguiente por encima del maximo. */
  const previousDisabled = Boolean(minDate && addDays(startOfMonth(month), -1) < startOfDay(minDate));
  const nextDisabled = Boolean(maxDate && startOfMonth(addMonths(month, 1)) > startOfDay(maxDate));

  const pick = (date: Date) => {
    if (isDisabled(date)) return;
    const day = startOfDay(date);
    if (selectedProp === undefined) setSelectedState(day);
    // Pulsar un dia de otro mes tambien mueve la vista: si no, el dia elegido
    // desapareceria de la rejilla justo al elegirlo.
    if (!isSameMonth(day, month)) changeMonth(day);
    setFocusedDate(day);
    onSelect?.(day);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    let next: Date | null = null;
    switch (event.key) {
      case "ArrowLeft":
        next = addDays(focusedDate, -1);
        break;
      case "ArrowRight":
        next = addDays(focusedDate, 1);
        break;
      case "ArrowUp":
        next = addDays(focusedDate, -7);
        break;
      case "ArrowDown":
        next = addDays(focusedDate, 7);
        break;
      case "Home":
        next = startOfWeek(focusedDate, weekStartsOn);
        break;
      case "End":
        next = addDays(startOfWeek(focusedDate, weekStartsOn), 6);
        break;
      case "PageUp":
        next = addMonths(focusedDate, event.shiftKey ? -12 : -1);
        break;
      case "PageDown":
        next = addMonths(focusedDate, event.shiftKey ? 12 : 1);
        break;
      default:
        return;
    }
    // Sin esto las flechas hacen scroll de la pagina y AvPag salta la vista.
    event.preventDefault();
    moveFocusTo(next);
  };

  const weeks = getCalendarGrid(month, weekStartsOn);
  /* Los nombres de dia salen de siete fechas reales consecutivas a partir del
     arranque de semana, asi que respetan `weekStartsOn` y el locale sin ninguna
     tabla de nombres codificada a mano. */
  const weekStart = startOfWeek(startOfMonth(month), weekStartsOn);
  const weekdays = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));

  return (
    <div ref={ref} className={cn("inline-flex w-fit flex-col gap-4", className)} {...props}>
      <div className="flex items-center justify-between gap-2">
        <CalendarNavButton
          direction="previous"
          disabled={previousDisabled}
          aria-label={text.previousMonth}
          onClick={() => changeMonth(addMonths(month, -1))}
        />
        {/* aria-live: al cambiar de mes con las flechas o con AvPag el lector
            anuncia el mes nuevo, que es la unica pista de que la rejilla se ha
            movido entera. */}
        <div
          id={captionId}
          aria-live="polite"
          className="font-sans text-sm font-medium text-ink capitalize"
        >
          {formatMonthCaption(month, locale)}
        </div>
        <CalendarNavButton
          direction="next"
          disabled={nextDisabled}
          aria-label={text.nextMonth}
          onClick={() => changeMonth(addMonths(month, 1))}
        />
      </div>

      <div
        ref={gridRef}
        role="grid"
        aria-labelledby={captionId}
        className="flex flex-col gap-1"
        onKeyDown={handleKeyDown}
      >
        <div role="row" className="flex gap-1">
          {weekdays.map((date) => (
            <CalendarWeekday
              key={date.getDay()}
              label={new Intl.DateTimeFormat(locale, { weekday: "long" }).format(date)}
            >
              {formatWeekday(date, locale)}
            </CalendarWeekday>
          ))}
        </div>

        {weeks.map((week, index) => (
          // La fila es puramente posicional: siempre son seis y en el mismo
          // orden, asi que el indice es una clave estable.
          <div role="row" key={`${monthKey}-${index}`} className="flex gap-1">
            {week.map((date) => {
              const outside = !isSameMonth(date, month);

              if (outside && !showOutsideDays) {
                // La celda se queda vacia pero SIGUE existiendo: quitarla del
                // DOM descuadraria las columnas del resto de la fila.
                return <div role="gridcell" key={dayKey(date)} className="size-8" />;
              }

              const isSelected = Boolean(selected && isSameDay(date, selected));
              const disabled = isDisabled(date);

              return (
                <div role="gridcell" aria-selected={isSelected} key={dayKey(date)}>
                  <CalendarDay
                    data-tk-day={dayKey(date)}
                    variant={outside ? "outside" : isSameDay(date, today) ? "current" : "default"}
                    selected={isSelected}
                    disabled={disabled}
                    // Roving tabindex: un solo dia entra en el orden de tabulacion.
                    tabIndex={isSameDay(date, focusedDate) ? 0 : -1}
                    aria-current={isSameDay(date, today) ? "date" : undefined}
                    aria-label={formatDay(date, locale)}
                    onClick={() => pick(date)}
                    // Al enfocar con raton o con Tab el punto de entrada se
                    // recoloca. La guarda evita un render de mas cuando el foco
                    // ya venia de moveFocusTo: `date` es siempre un objeto nuevo
                    // y React no puede descartarlo por identidad.
                    onFocus={() => {
                      if (!isSameDay(date, focusedDate)) setFocusedDate(startOfDay(date));
                    }}
                  >
                    {date.getDate()}
                  </CalendarDay>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
});
