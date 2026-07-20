import * as React from "react";
import { Popover as PopoverPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/* Seccion 23 · Date picker — MIXTO.
 *
 * Es mixto a proposito, y el documento lo dice en su bloque "DEL ARCHIVO":
 *
 *   CANONICO   las celdas de dia, la cabecera de dias y las flechas de mes
 *              existen en el archivo (Calendar/Day Button con variantes
 *              default · current · outside · selected, Calendar/Day Header y
 *              Calendar/Arrow Button).
 *   EXTENSION  la banda lima que une los extremos de un rango, el resumen
 *              desde -> hasta, los chips de preset, la accion full-width de
 *              confirmar y el propio disparador del popover. Nada de eso esta
 *              en Figma: son propuestas coherentes con los tokens.
 *
 * MEDIDAS, del HTML del prototipo (los estilos van inline ahi):
 *   panel            borde 1 · r16 · padding 18 · ancho 340
 *   cabecera de mes  Funnel Display 500 · 16 · tinta
 *   flechas          32x32 · borde 1 · r8 · icono 15
 *   cabecera de dias alto 28 (26 en movil) · Ubuntu Mono 10 · gris 500
 *   celda            alto 38 · circulo de 34 · r999 · Ubuntu Sans Mono 13
 *   resumen de rango Ubuntu Sans Mono 12 · +2% tracking · gris 800
 *   badges del rango bg tinta · texto surface · r8 · padding 5/10 · mono 12
 *   chips de preset  r999 · padding 6/12 · mono 12 · activo en tinta
 *   accion inferior  alto 48 · r12 · bg tinta · mono 14 · +2% tracking
 *   variante movil   padding 12/16/16 · cabecera de dias 26
 *
 * DOS DESVIACIONES DELIBERADAS RESPECTO AL EXPORT DE FIGMA
 * -------------------------------------------------------
 * 1. La celda es un circulo de 34 y no un cuadrado de 32 con r8.
 *    docs/figma-export/components/CalendarDayButton.jsx da 32x32 (--width-w-8),
 *    radio 8, tipografia Geist 14 y colores --base-primary / --base-accent.
 *    Ese componente es un calendario generico importado: ni una sola de sus
 *    variables pertenece a la escala de Tikin, asi que sus pixeles describen
 *    otro sistema. El documento lo re-estiliza explicitamente — "celda 34 r999"
 *    y "Los numeros en Ubuntu Sans Mono" — y es esa version la que manda aqui.
 *
 * 2. Hoy se marca con BORDE, no con relleno.
 *    En Figma la variante `current` pinta --base-accent de fondo. El documento
 *    dice "hoy se marca con borde, seleccionado con relleno tinta": con los dos
 *    en relleno no se distinguiria hoy de la seleccion. Gana el documento.
 *    El borde va como inset shadow, no como `border`, para que la celda no
 *    cambie de tamaño al ser hoy.
 *
 * FUERA DE ALCANCE
 * ----------------
 * El bloque "MOVIL · EN SHEET" dibuja este mismo calendario dentro de un bottom
 * sheet con grabber. El sheet es responsabilidad del componente de dialogo
 * (seccion 21), no de este: aqui solo se expone `density="movil"`, que aplica
 * la metrica compacta del bloque para que el panel encaje dentro de el.
 */

/* ------------------------------------------------------------------ */
/* Utilidades de fecha                                                 */
/* ------------------------------------------------------------------ */

/* Sin dependencia de librerias de fechas: packages/ui solo puede usar lo que ya
 * esta instalado, y toda la aritmetica que necesita un calendario de un mes
 * cabe en estas ocho funciones. Todas trabajan en hora local y a media noche,
 * porque el usuario elige dias, no instantes. */

function inicioDeDia(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function inicioDeMes(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function sumarDias(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

/* Sumar meses recorta al ultimo dia del mes destino. Sin el recorte, el 31 de
 * enero + 1 mes daria 3 de marzo, que es el desbordamiento nativo de Date y
 * hace que RePag/AvPag se salte febrero. */
function sumarMeses(d: Date, n: number): Date {
  const destino = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const ultimo = new Date(destino.getFullYear(), destino.getMonth() + 1, 0).getDate();
  destino.setDate(Math.min(d.getDate(), ultimo));
  return destino;
}

/** Negativo si a es anterior, 0 si es el mismo dia, positivo si es posterior. */
function comparar(a: Date, b: Date): number {
  return inicioDeDia(a).getTime() - inicioDeDia(b).getTime();
}

function mismoDia(a: Date | null | undefined, b: Date | null | undefined): boolean {
  return Boolean(a && b && comparar(a, b) === 0);
}

function mismoMes(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

/* Dias entre dos fechas, ambos extremos incluidos. Se calcula en UTC a
 * proposito: con horas locales, un cambio de horario de verano dentro del rango
 * mete una diferencia de 23 o 25 horas y la division daria un dia de menos. */
function diasEntre(a: Date, b: Date): number {
  const ua = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const ub = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((ub - ua) / 86_400_000) + 1;
}

/** Clave estable de un dia. Sirve de identificador en el DOM y en dependencias. */
function clave(d: Date): string {
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
}

/* Semanas completas que cubren el mes, incluidos los dias de relleno del mes
 * anterior y del siguiente. Se generan las semanas naturales (5 o 6 filas), no
 * siempre 6: es lo que hace el prototipo y evita una fila entera de dias que no
 * pertenecen al mes. */
function construirSemanas(mes: Date, primerDiaSemana: number): Date[][] {
  const primero = inicioDeMes(mes);
  const ultimo = new Date(mes.getFullYear(), mes.getMonth() + 1, 0);
  const cabeza = (primero.getDay() - primerDiaSemana + 7) % 7;
  const cola = (primerDiaSemana + 6 - ultimo.getDay() + 7) % 7;

  const semanas: Date[][] = [];
  let cursor = sumarDias(primero, -cabeza);
  const fin = sumarDias(ultimo, cola);

  while (comparar(cursor, fin) <= 0) {
    const semana: Date[] = [];
    for (let i = 0; i < 7; i += 1) {
      semana.push(cursor);
      cursor = sumarDias(cursor, 1);
    }
    semanas.push(semana);
  }
  return semanas;
}

/* ------------------------------------------------------------------ */
/* Tipos publicos                                                      */
/* ------------------------------------------------------------------ */

/** Rango de fechas. `to` es null mientras el usuario no ha elegido el fin. */
export interface DateRange {
  from: Date;
  to: Date | null;
}

/** Atajo de rango — "7 DIAS", "ESTE MES" — que se pinta como chip sobre el mes. */
export interface DatePickerPreset {
  /** Texto del chip. Se pone en mayusculas por CSS, escribelo en caja normal. */
  label: string;
  range: DateRange;
}

type Seleccion = Date | DateRange | null;

/* ------------------------------------------------------------------ */
/* Estilos                                                             */
/* ------------------------------------------------------------------ */

const panel = cva(
  [
    "z-50 box-border w-[340px] max-w-[calc(100vw-2rem)] rounded-xl border border-edge bg-surface text-ink shadow-md",
    /* Mismo fade corto que usan modal y tooltip: entrada por @starting-style,
     * sin salida, porque Radix desmonta el contenido al cerrar. */
    "opacity-100 transition-opacity duration-140 ease-out starting:opacity-0",
    "motion-reduce:transition-none",
    "outline-none",
  ],
  {
    variants: {
      /* La unica diferencia real entre el panel de escritorio y el que va
       * dentro del bottom sheet es la densidad: padding y alto de la fila de
       * cabecera. El resto de la metrica es identica en el prototipo. */
      density: {
        comodo: "p-[18px] [--tk-dp-head:28px]",
        movil: "px-4 pt-3 pb-4 [--tk-dp-head:26px]",
      },
    },
    defaultVariants: { density: "comodo" },
  },
);

/* Banda lima del rango. Va en el <td> y no en un div interior porque tiene que
 * llegar de borde a borde de la celda: si se pintara dentro, entre columna y
 * columna quedaria una costura blanca. Solo se redondea por el lado exterior en
 * los extremos.
 *
 * Ojo: aqui NO puede haber `flex`. Un <td> con display:flex deja de ser una
 * celda de tabla, el navegador envuelve los siete dias de la fila en UNA sola
 * celda anonima y la rejilla de 7 columnas se derrumba. El centrado va en el
 * div interior. jsdom no aplica CSS, asi que este fallo no se ve en los tests. */
const celdaDia = cva("h-[38px] p-0 align-middle", {
  variants: {
    band: {
      none: "",
      start: "rounded-l-(--radius-pill) bg-lime",
      middle: "bg-lime",
      end: "rounded-r-(--radius-pill) bg-lime",
    },
  },
  defaultVariants: { band: "none" },
});

/* Circulo de 34 con el numero. Reproduce los dos ejes del componente de Figma
 * (Variant = default | current | outside, State = default | selected), mas el
 * estado in-range que aporta la extension.
 *
 * El hover se escribe con `[&:not([aria-disabled=true])]` en vez de con
 * `hover:not-disabled:` porque los dias fuera de rango NO llevan el atributo
 * disabled — ver el comentario de `DiaBoton` sobre por que siguen siendo
 * enfocables. */
const diaBoton = cva(
  [
    "relative flex size-[34px] items-center justify-center rounded-(--radius-pill)",
    "font-mono text-[13px] leading-none tabular-nums",
    "cursor-pointer transition-colors duration-140 ease-out select-none",
    "outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
    // "deshabilitados sin pointer": gris 400, sin relleno y sin marca de hoy.
    "aria-disabled:cursor-not-allowed aria-disabled:bg-transparent aria-disabled:text-ink-400 aria-disabled:shadow-none",
  ],
  {
    variants: {
      variant: {
        default: "text-ink",
        // Hoy: borde por inset shadow para no alterar el tamaño de la celda.
        current: "text-ink shadow-[inset_0_0_0_1px_var(--tk-ink)]",
        outside: "text-ink-400",
      },
      state: {
        default: "[&:not([aria-disabled=true])]:hover:bg-surface-2",
        selected: "bg-ink text-surface [&:not([aria-disabled=true])]:hover:bg-ink-800",
        /* Dia interior de la banda. El texto va en on-accent, la tinta estable
         * sobre rellenos de acento: la lima es identica en claro y en oscuro,
         * asi que un texto en `ink` desapareceria en tema oscuro. */
        "in-range": "text-on-accent [&:not([aria-disabled=true])]:hover:bg-lime",
      },
    },
    compoundVariants: [
      // El relleno tinta ya identifica la seleccion; el borde de hoy sobra.
      { variant: "current", state: "selected", class: "shadow-none" },
      // Un extremo del rango fuera del mes visible sigue siendo un extremo.
      { variant: "outside", state: "selected", class: "text-surface" },
      { variant: "outside", state: "in-range", class: "text-on-accent opacity-60" },
    ],
    defaultVariants: { variant: "default", state: "default" },
  },
);

const flechaMes =
  "inline-flex size-8 items-center justify-center rounded-sm border border-edge text-ink cursor-pointer transition-colors duration-140 ease-out outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-surface hover:not-disabled:bg-surface-2 disabled:cursor-not-allowed disabled:text-ink-400";

const chipPreset =
  "box-border inline-flex shrink-0 cursor-pointer items-center rounded-(--radius-pill) px-3 py-1.5 font-mono text-xs tracking-[0.02em] uppercase transition-colors duration-140 ease-out outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-surface";

const disparador = cva([
  "box-border inline-flex h-control-m items-center gap-2 rounded-md border border-edge-2 bg-surface px-4",
  "font-mono text-sm font-normal tracking-[0.02em] whitespace-nowrap text-ink uppercase",
  "cursor-pointer transition-colors duration-140 ease-out select-none",
  "outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-page",
  "hover:not-disabled:bg-surface-2",
  "data-[state=open]:border-ink data-[state=open]:bg-surface-2",
  "disabled:cursor-not-allowed disabled:border-edge disabled:bg-surface-2 disabled:text-ink-400",
  "[&_svg]:size-4 [&_svg]:shrink-0",
]);

/* ------------------------------------------------------------------ */
/* Glifos                                                              */
/* ------------------------------------------------------------------ */

/* Dibujados a mano por la misma razon que en FilterChip: packages/ui no depende
 * de @phosphor-icons — la libreria oficial de iconos del sistema — y este
 * encargo no puede añadir dependencias. Heredan currentColor y van ocultos al
 * lector: el nombre accesible lo pone el boton que los contiene. */

function GlifoCaret({ direccion }: { direccion: "izquierda" | "derecha" }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={direccion === "izquierda" ? "M10 3.5 5.5 8l4.5 4.5" : "M6 3.5 10.5 8 6 12.5"} />
    </svg>
  );
}

function GlifoCalendario() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2.25" y="3.25" width="11.5" height="10.5" rx="2" />
      <path d="M2.25 6.5h11.5M5.5 1.75v3M10.5 1.75v3" />
    </svg>
  );
}

function GlifoFlechaRango() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.5 8h11M9.5 4 13.5 8l-4 4" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Logica de seleccion                                                 */
/* ------------------------------------------------------------------ */

/* Regla del documento, literal: "primer tap = inicio, segundo = fin; si el fin
 * es anterior, se reinicia el inicio". Un rango ya completo tambien reinicia:
 * si no, el tercer toque no tendria efecto posible. */
function siguienteRango(actual: DateRange | null, dia: Date): DateRange {
  if (!actual || actual.to) return { from: dia, to: null };
  if (comparar(dia, actual.from) < 0) return { from: dia, to: null };
  return { from: actual.from, to: dia };
}

/** Serializa una seleccion para poder compararla sin depender de identidades. */
function claveSeleccion(sel: Seleccion): string {
  if (!sel) return "";
  if (sel instanceof Date) return clave(sel);
  return `${clave(sel.from)}~${sel.to ? clave(sel.to) : ""}`;
}

/** Dia sobre el que se abre el calendario: el elegido, o el inicio del rango. */
function anclaDe(sel: Seleccion): Date | null {
  if (!sel) return null;
  return sel instanceof Date ? sel : sel.from;
}

type Banda = NonNullable<VariantProps<typeof celdaDia>["band"]>;

function bandaDe(dia: Date, rango: DateRange | null): Banda {
  if (!rango?.to) return "none";
  // Rango de un solo dia: solo el circulo en tinta, sin banda que dibujar.
  if (mismoDia(rango.from, rango.to)) return "none";
  if (comparar(dia, rango.from) < 0 || comparar(dia, rango.to) > 0) return "none";
  if (mismoDia(dia, rango.from)) return "start";
  if (mismoDia(dia, rango.to)) return "end";
  return "middle";
}

/* ------------------------------------------------------------------ */
/* Props                                                               */
/* ------------------------------------------------------------------ */

type PropsBoton = Omit<
  React.ComponentPropsWithoutRef<"button">,
  "value" | "defaultValue" | "onChange" | "children" | "color"
>;

interface DatePickerBaseProps extends PropsBoton {
  /**
   * Disparador propio. Debe ser UN elemento capaz de recibir foco; se le
   * inyectan `aria-expanded` y `aria-haspopup`. Sin el se dibuja el disparador
   * por defecto — que es EXTENSION: el documento no lo especifica.
   */
  children?: React.ReactNode;
  /** Clases del panel. `className` va al disparador, que es lo que ocupa sitio en el layout. */
  contentClassName?: string;
  /** Texto del disparador cuando no hay nada elegido. */
  placeholder?: string;
  /** Metrica del panel. `movil` es la del bloque "MOVIL · EN SHEET". */
  density?: NonNullable<VariantProps<typeof panel>["density"]>;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Locale de los nombres de mes y dia. Por defecto `es-ES`. */
  locale?: string;
  /** 0 domingo … 6 sabado. Por defecto 1, lunes. */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Dia marcado como hoy. Inyectable para tests y para relojes de servidor. */
  today?: Date;
  /** Mes que se abre cuando no hay seleccion. */
  defaultMonth?: Date;
  /** Primer dia elegible, incluido. */
  minDate?: Date;
  /** Ultimo dia elegible, incluido. */
  maxDate?: Date;
  /** Veto adicional por dia — festivos, fines de semana, huecos de agenda. */
  isDateDisabled?: (date: Date) => boolean;
  /**
   * La seleccion queda en borrador hasta que el usuario pulsa la accion
   * inferior. Es el modo del bloque movil ("CONFIRMAR · 12 JUN").
   */
  confirm?: boolean;
  /** Texto de esa accion. En caja normal: se pone en mayusculas por CSS. */
  confirmLabel?: React.ReactNode;
  /** Nombre accesible del panel. */
  contentLabel?: string;
  /**
   * Atrapa el foco dentro del panel y bloquea el resto de la pagina.
   * Apagado por defecto: un date picker de formulario debe dejar tabular hacia
   * el campo siguiente. Enciendelo cuando el panel viva dentro de un sheet, que
   * es como lo presenta el bloque movil del documento.
   */
  modal?: boolean;
  /** Contenedor del portal. Por defecto `document.body`. */
  container?: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Portal>["container"];
  side?: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>["side"];
  align?: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>["align"];
  sideOffset?: number;
  collisionPadding?: number;
}

export type DatePickerProps =
  | (DatePickerBaseProps & {
      mode?: "single";
      value?: Date | null;
      defaultValue?: Date | null;
      onValueChange?: (value: Date | null) => void;
      /* Los presets son atajos de RANGO. Prohibirlos en modo simple por tipo
       * evita el bug silencioso de pasarlos y no ver ningun chip. */
      presets?: never;
    })
  | (DatePickerBaseProps & {
      mode: "range";
      value?: DateRange | null;
      defaultValue?: DateRange | null;
      onValueChange?: (value: DateRange | null) => void;
      presets?: DatePickerPreset[];
    });

/* ------------------------------------------------------------------ */
/* Componente                                                          */
/* ------------------------------------------------------------------ */

/**
 * Date picker del sistema Tikin — MIXTO: celdas, cabecera y flechas vienen del
 * archivo de Figma; la banda de rango, los presets y el disparador son
 * extension construida con los tokens.
 *
 * Cuando usar cada modo, del documento: `single` para una fecha concreta
 * (programar un envio); `range` para reportes y extractos.
 *
 * El teclado sigue el patron de rejilla de fechas: flechas para moverse un dia
 * o una semana, Inicio/Fin para los extremos de la semana, RePag/AvPag para
 * cambiar de mes y Intro o Espacio para elegir. Cruzar el borde del mes con las
 * flechas cambia el mes visible sin perder el foco. Escape y el cierre al pulsar
 * fuera los aporta Radix Popover.
 *
 * `ref` y `className` van al DISPARADOR, que es el elemento que vive en el
 * layout del consumidor; el panel se estiliza con `contentClassName`.
 */
export const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  function DatePicker(props, ref) {
    const {
      mode = "single",
      className,
      contentClassName,
      children,
      placeholder,
      density,
      open,
      defaultOpen,
      onOpenChange,
      locale = "es-ES",
      weekStartsOn = 1,
      today,
      defaultMonth,
      minDate,
      maxDate,
      isDateDisabled,
      confirm = false,
      confirmLabel,
      contentLabel,
      modal = false,
      container,
      side = "bottom",
      align = "start",
      sideOffset = 8,
      collisionPadding = 16,
      presets,
      value,
      defaultValue,
      // Se extrae solo para que no acabe en `restoDisparador` y de ahi en el
      // DOM; se llama desde `emitir`, que lo lee de `props` con el tipo ancho.
      onValueChange: _onValueChange,
      disabled,
      type,
      ...restoDisparador
    } = props;

    const esRango = mode === "range";
    const idTitulo = React.useId();

    /* El tipo de `onValueChange` es la union de dos firmas incompatibles: TS
     * intersecta sus parametros y da `never`, asi que no hay forma de llamarlo
     * sin ensanchar. El modo ya garantiza que solo emitimos la forma correcta. */
    const emitir = (siguiente: Seleccion) => {
      (props.onValueChange as ((v: Seleccion) => void) | undefined)?.(siguiente);
    };

    const hoy = inicioDeDia(today ?? new Date());

    /* Apertura, controlada o no. */
    const [abiertoInterno, setAbiertoInterno] = React.useState(defaultOpen ?? false);
    const abierto = open ?? abiertoInterno;
    const cambiarApertura = (siguiente: boolean) => {
      if (open === undefined) setAbiertoInterno(siguiente);
      onOpenChange?.(siguiente);
    };

    /* Valor, controlado o no. */
    const controlado = value !== undefined;
    const [interno, setInterno] = React.useState<Seleccion>(() => defaultValue ?? null);
    const valorExterno: Seleccion = controlado ? (value ?? null) : interno;

    /* `borrador` es SIEMPRE lo que se pinta. Con confirm=false va en sincronia
     * con el valor; con confirm=true diverge hasta que el usuario aplica. */
    const [borrador, setBorrador] = React.useState<Seleccion>(valorExterno);
    /* Ajuste durante el render, no en un efecto. Es el patron que documenta
     * React para reaccionar al cambio de una prop: descarta el render en curso
     * y reempieza con el estado nuevo, sin pintar el intermedio ni encadenar un
     * commit extra.
     *
     * Se compara por CLAVE y no por identidad porque un consumidor controlado
     * puede escribir `value={new Date(...)}` en linea y entregar una referencia
     * distinta en cada render: con la identidad esto no pararia nunca. */
    const claveExterna = claveSeleccion(valorExterno);
    const [clavePrevia, setClavePrevia] = React.useState(claveExterna);
    if (clavePrevia !== claveExterna) {
      setClavePrevia(claveExterna);
      setBorrador(valorExterno);
    }

    const rango = esRango ? (borrador as DateRange | null) : null;
    const fecha = esRango ? null : (borrador as Date | null);

    const [mesVisible, setMesVisible] = React.useState<Date>(() =>
      inicioDeMes(anclaDe(valorExterno) ?? defaultMonth ?? hoy),
    );
    const [diaFoco, setDiaFoco] = React.useState<Date>(
      () => anclaDe(valorExterno) ?? defaultMonth ?? hoy,
    );

    /* Cada apertura y cada cierre parten del valor confirmado. El borrador de
     * confirm=true solo vive mientras el panel esta abierto: si sobreviviera al
     * cierre, cerrar con Escape — que no emite nada — dejaria el componente
     * pintando una fecha que el consumidor nunca acepto, y la apertura
     * siguiente arrancaria sobre ese descarte. Con confirm=false el borrador ya
     * va en sincronia con el valor, asi que aqui es un no-op.
     *
     * Al abrir, ademas, el calendario vuelve al mes de la seleccion. Sin esto,
     * quien dejo el panel navegando por 2029 se lo encuentra ahi la vez
     * siguiente. */
    const [abiertoPrevio, setAbiertoPrevio] = React.useState(abierto);
    if (abiertoPrevio !== abierto) {
      setAbiertoPrevio(abierto);
      setBorrador(valorExterno);
      if (abierto) {
        const ancla = anclaDe(valorExterno) ?? defaultMonth ?? hoy;
        setMesVisible(inicioDeMes(ancla));
        setDiaFoco(ancla);
      }
    }

    const rejillaRef = React.useRef<HTMLTableElement>(null);
    const pendienteDeFoco = React.useRef(false);

    /* El foco se mueve DESPUES del render porque la tecla puede haber cambiado
     * el mes: el boton destino todavia no existia cuando se pulso. Sin array de
     * dependencias y con guarda por ref para no robar el foco en cada render. */
    React.useEffect(() => {
      if (!pendienteDeFoco.current) return;
      pendienteDeFoco.current = false;
      rejillaRef.current
        ?.querySelector<HTMLButtonElement>(`[data-tk-dia="${clave(diaFoco)}"]`)
        ?.focus();
    });

    const formatos = React.useMemo(
      () => ({
        mes: new Intl.DateTimeFormat(locale, { month: "long" }),
        corto: new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" }),
        cortoConAno: new Intl.DateTimeFormat(locale, {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        completo: new Intl.DateTimeFormat(locale, {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        diaCorto: new Intl.DateTimeFormat(locale, { weekday: "narrow" }),
        diaLargo: new Intl.DateTimeFormat(locale, { weekday: "long" }),
      }),
      [locale],
    );

    /* El año se omite cuando coincide con el actual: "8 jul" es lo que muestra
     * el prototipo, y arrastrar el año en cada badge lo llenaria de ruido. */
    const corto = (d: Date) =>
      d.getFullYear() === hoy.getFullYear()
        ? formatos.corto.format(d)
        : formatos.cortoConAno.format(d);

    const estaDeshabilitado = (d: Date): boolean => {
      if (minDate && comparar(d, minDate) < 0) return true;
      if (maxDate && comparar(d, maxDate) > 0) return true;
      return Boolean(isDateDisabled?.(d));
    };

    const semanas = React.useMemo(
      () => construirSemanas(mesVisible, weekStartsOn),
      [mesVisible, weekStartsOn],
    );

    /* Cabeceras de dia. La semana de referencia arranca en un domingo conocido
     * (7 de enero de 2024) y se desplaza por `weekStartsOn`. */
    const cabeceras = React.useMemo(() => {
      const domingo = new Date(2024, 0, 7);
      return Array.from({ length: 7 }, (_, i) => {
        const d = sumarDias(domingo, weekStartsOn + i);
        return { corto: formatos.diaCorto.format(d), largo: formatos.diaLargo.format(d) };
      });
    }, [formatos, weekStartsOn]);

    const aplicar = (siguiente: Seleccion, cerrar: boolean) => {
      if (!controlado) setInterno(siguiente);
      emitir(siguiente);
      if (cerrar) cambiarApertura(false);
    };

    /* Solo con confirm=true se toca el borrador a mano. Sin confirm, la
     * seleccion pasa por `aplicar` y vuelve por el efecto de sincronizacion:
     * asi un consumidor controlado que decida ignorar el cambio se sale con la
     * suya, en vez de ver el panel pintar una fecha que su estado no tiene. */
    const registrar = (siguiente: Seleccion, cerrar: boolean) => {
      if (confirm) {
        setBorrador(siguiente);
        return;
      }
      aplicar(siguiente, cerrar);
    };

    const seleccionar = (dia: Date) => {
      if (estaDeshabilitado(dia)) return;
      setDiaFoco(dia);
      if (!mismoMes(dia, mesVisible)) setMesVisible(inicioDeMes(dia));

      if (esRango) {
        const siguiente = siguienteRango(rango, dia);
        // El rango incompleto tambien se emite: el consumidor pinta el progreso,
        // pero el panel no se cierra hasta que hay fin.
        registrar(siguiente, Boolean(siguiente.to));
        return;
      }
      registrar(dia, true);
    };

    const aplicarPreset = (preset: DatePickerPreset) => {
      setMesVisible(inicioDeMes(preset.range.from));
      setDiaFoco(preset.range.from);
      registrar(preset.range, true);
    };

    const irAlMes = (delta: number) => {
      const destino = sumarMeses(mesVisible, delta);
      setMesVisible(inicioDeMes(destino));
      // El dia con tabindex 0 debe seguir dentro de la rejilla visible.
      setDiaFoco((previo) => sumarMeses(previo, delta));
    };

    const moverFoco = (siguiente: Date) => {
      setDiaFoco(siguiente);
      if (!mismoMes(siguiente, mesVisible)) setMesVisible(inicioDeMes(siguiente));
      pendienteDeFoco.current = true;
    };

    const alPulsarTecla = (evento: React.KeyboardEvent<HTMLTableElement>) => {
      const teclas: Record<string, () => Date> = {
        ArrowLeft: () => sumarDias(diaFoco, -1),
        ArrowRight: () => sumarDias(diaFoco, 1),
        ArrowUp: () => sumarDias(diaFoco, -7),
        ArrowDown: () => sumarDias(diaFoco, 7),
        Home: () => sumarDias(diaFoco, -((diaFoco.getDay() - weekStartsOn + 7) % 7)),
        End: () => sumarDias(diaFoco, 6 - ((diaFoco.getDay() - weekStartsOn + 7) % 7)),
        PageUp: () => sumarMeses(diaFoco, -1),
        PageDown: () => sumarMeses(diaFoco, 1),
      };
      const calcular = teclas[evento.key];
      if (!calcular) return;
      // El navegador desplazaria la pagina con las flechas y RePag/AvPag.
      evento.preventDefault();
      moverFoco(calcular());
    };

    /* Un mes entero fuera de limites no se puede visitar: la flecha se apaga en
     * vez de dejar al usuario en un mes sin ningun dia elegible. */
    const finMesPrevio = new Date(mesVisible.getFullYear(), mesVisible.getMonth(), 0);
    const inicioMesSiguiente = new Date(mesVisible.getFullYear(), mesVisible.getMonth() + 1, 1);
    const previoApagado = Boolean(minDate && comparar(finMesPrevio, minDate) < 0);
    const siguienteApagado = Boolean(maxDate && comparar(inicioMesSiguiente, maxDate) > 0);

    const seleccionCompleta = esRango ? Boolean(rango?.from && rango?.to) : Boolean(fecha);

    /* El disparador lee el VALOR, nunca el borrador. Es la unica parte del
     * componente que sigue visible con el panel cerrado y la que resume el
     * estado para el resto de la pagina: con confirm=true el borrador todavia
     * no esta aceptado, y anticiparlo ahi haria que un descarte por Escape
     * dejase el disparador mintiendo. Dentro del panel si manda el borrador,
     * que es lo que el usuario esta manipulando. */
    const etiquetaDisparador = (() => {
      const rangoValor = esRango ? (valorExterno as DateRange | null) : null;
      const fechaValor = esRango ? null : (valorExterno as Date | null);
      if (esRango && rangoValor?.from) {
        return rangoValor.to
          ? `${corto(rangoValor.from)} → ${corto(rangoValor.to)}`
          : corto(rangoValor.from);
      }
      if (!esRango && fechaValor) return corto(fechaValor);
      return placeholder ?? (esRango ? "Elegir rango" : "Elegir fecha");
    })();

    const etiquetaConfirmar = (() => {
      if (confirmLabel !== undefined) return confirmLabel;
      if (esRango) return "Aplicar rango";
      return fecha ? `Confirmar · ${corto(fecha)}` : "Confirmar";
    })();

    return (
      <PopoverPrimitive.Root open={abierto} onOpenChange={cambiarApertura} modal={modal}>
        <PopoverPrimitive.Trigger asChild ref={ref}>
          {children ?? (
            <button
              // Sin type explicito un <button> dentro de un <form> lo envia, y
              // este control vive justo dentro de formularios.
              type={type ?? "button"}
              disabled={disabled}
              className={cn(disparador({ className }))}
              {...restoDisparador}
            >
              <GlifoCalendario />
              {etiquetaDisparador}
            </button>
          )}
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal container={container}>
          <PopoverPrimitive.Content
            side={side}
            align={align}
            sideOffset={sideOffset}
            collisionPadding={collisionPadding}
            aria-label={contentLabel ?? (esRango ? "Elegir rango de fechas" : "Elegir fecha")}
            /* Radix enfocaria el primer elemento enfocable, que es la flecha de
             * mes anterior. El foco tiene que caer en la rejilla, sobre el dia
             * elegido o sobre hoy, o navegar con el teclado obliga a tabular
             * primero por toda la cabecera. */
            onOpenAutoFocus={(evento: Event) => {
              evento.preventDefault();
              rejillaRef.current
                ?.querySelector<HTMLButtonElement>(`[data-tk-dia="${clave(diaFoco)}"]`)
                ?.focus();
            }}
            className={cn(panel({ density }), contentClassName)}
          >
            {esRango && presets && presets.length > 0 && (
              <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                {presets.map((preset) => {
                  const activo = claveSeleccion(preset.range) === claveSeleccion(rango);
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      aria-pressed={activo}
                      onClick={() => aplicarPreset(preset)}
                      className={cn(
                        chipPreset,
                        activo
                          ? "bg-ink text-surface"
                          : "border border-edge-2 text-ink hover:bg-surface-2",
                      )}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            )}

            {esRango && rango?.from && (
              <div className="mb-2.5 flex flex-wrap items-center gap-2">
                <span className="rounded-sm bg-ink px-2.5 py-[5px] font-mono text-xs tracking-[0.02em] text-surface uppercase">
                  {corto(rango.from)}
                </span>
                <span className="text-ink-600">
                  <GlifoFlechaRango />
                </span>
                {rango.to ? (
                  <span className="rounded-sm bg-ink px-2.5 py-[5px] font-mono text-xs tracking-[0.02em] text-surface uppercase">
                    {corto(rango.to)}
                  </span>
                ) : (
                  <span className="font-meta text-[11px] text-ink-500">Elige el fin</span>
                )}
                {rango.to && (
                  <span className="ml-auto font-meta text-[11px] text-ink-600 tabular-nums">
                    {diasEntre(rango.from, rango.to)}{" "}
                    {diasEntre(rango.from, rango.to) === 1 ? "día" : "días"}
                  </span>
                )}
              </div>
            )}

            <div className="mb-3 flex items-center">
              {/* aria-live: al cambiar de mes con las flechas del teclado el
                  foco no se mueve de sitio, asi que sin esto el lector no
                  anunciaria que el calendario ya es otro mes. */}
              <span
                id={idTitulo}
                aria-live="polite"
                className="font-display text-base font-medium text-ink capitalize"
              >
                {`${formatos.mes.format(mesVisible)} ${mesVisible.getFullYear()}`}
              </span>
              <div className="ml-auto flex gap-1.5">
                <button
                  type="button"
                  className={flechaMes}
                  aria-label="Mes anterior"
                  disabled={previoApagado}
                  onClick={() => irAlMes(-1)}
                >
                  <GlifoCaret direccion="izquierda" />
                </button>
                <button
                  type="button"
                  className={flechaMes}
                  aria-label="Mes siguiente"
                  disabled={siguienteApagado}
                  onClick={() => irAlMes(1)}
                >
                  <GlifoCaret direccion="derecha" />
                </button>
              </div>
            </div>

            <table
              ref={rejillaRef}
              role="grid"
              aria-labelledby={idTitulo}
              onKeyDown={alPulsarTecla}
              className="w-full table-fixed border-collapse"
            >
              <thead>
                <tr>
                  {cabeceras.map((cabecera) => (
                    <th
                      key={cabecera.largo}
                      scope="col"
                      className="h-[var(--tk-dp-head)] font-meta text-[10px] font-normal text-ink-500 uppercase"
                    >
                      {/* La inicial suelta ("L") no dice nada leida en voz alta;
                          el nombre completo viaja aparte para el lector. */}
                      <span aria-hidden="true">{cabecera.corto}</span>
                      <span className="sr-only">{cabecera.largo}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {semanas.map((semana) => (
                  <tr key={clave(semana[0]!)}>
                    {semana.map((dia) => {
                      const fuera = !mismoMes(dia, mesVisible);
                      const apagado = estaDeshabilitado(dia);
                      const banda = bandaDe(dia, rango);
                      const elegido = esRango
                        ? mismoDia(dia, rango?.from) || mismoDia(dia, rango?.to)
                        : mismoDia(dia, fecha);

                      return (
                        <td
                          key={clave(dia)}
                          role="gridcell"
                          aria-selected={elegido}
                          className={celdaDia({ band: banda })}
                        >
                          <div className="flex h-[38px] items-center justify-center">
                            <button
                              type="button"
                              data-tk-dia={clave(dia)}
                              /* Roving tabindex: un solo dia entra en el orden de
                                 tabulacion y las flechas mueven el foco dentro. */
                              tabIndex={mismoDia(dia, diaFoco) ? 0 : -1}
                              aria-label={formatos.completo.format(dia)}
                              aria-current={mismoDia(dia, hoy) ? "date" : undefined}
                              /* aria-disabled y no el atributo `disabled`, por la
                                 misma razon que en Button: un boton deshabilitado
                                 no recibe foco, y aqui eso dejaria la navegacion
                                 por flechas atascada al llegar al primer dia
                                 fuera de limites. */
                              aria-disabled={apagado || undefined}
                              onClick={() => seleccionar(dia)}
                              className={diaBoton({
                                variant: fuera
                                  ? "outside"
                                  : mismoDia(dia, hoy)
                                    ? "current"
                                    : "default",
                                state: elegido
                                  ? "selected"
                                  : banda === "middle"
                                    ? "in-range"
                                    : "default",
                              })}
                            >
                              {dia.getDate()}
                            </button>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>

            {confirm && (
              <button
                type="button"
                disabled={!seleccionCompleta}
                onClick={() => aplicar(borrador, true)}
                className="mt-3 flex h-control-l w-full cursor-pointer items-center justify-center rounded-lg bg-ink font-mono text-sm tracking-[0.02em] text-surface uppercase transition-colors duration-140 ease-out outline-none hover:not-disabled:bg-ink-800 focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-ink-400"
              >
                {etiquetaConfirmar}
              </button>
            )}
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    );
  },
);
