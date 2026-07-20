import * as React from "react";
import { Slider } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/* Seccion 40 · Range slider — EXTENSION.
 *
 * El propio documento lo etiqueta asi: "Extension con la paleta del sistema".
 * No existe nodo equivalente en el archivo de Figma (docs/figma-export/components/
 * no trae ningun Slider ni RangeSlider), asi que la unica fuente de pixeles es
 * el prototipo de la seccion 40. Esto NO es especificacion aprobada.
 *
 * Reglas de uso que manda el documento:
 *   - Dos manijas para elegir un INTERVALO (monto, fecha). Para un solo valor
 *     usa el slider simple de la seccion 18 o un input; no este componente.
 *   - La manija izquierda no cruza la derecha.
 *   - Los valores estan SIEMPRE visibles: los dos extremos elegidos arriba en
 *     DM Mono, los limites del rango abajo en mono gris.
 *
 * GEOMETRIA (leida de los style= inline del prototipo, seccion 40):
 *     caja      24 de alto
 *     pista      6 de alto · r999 · gris (--tk-surface-2)
 *     relleno    6 de alto · r999 · lima rgb(133,255,133) = --colours-limegreen-400
 *     manija    22 x 22 · circulo · fondo superficie
 *               sombra 0 1px 3px rgba(0,0,0,.3) + anillo interior 1.5px tinta
 *     valores   DM Mono 500 · 15 · tinta          (arriba, justificados a los bordes)
 *     limites   Ubuntu Mono · 11 · gris 500       (abajo)
 *     hueco     14 entre las tres filas
 *
 * DISCREPANCIA CON LA SECCION 18 (Progress & sliders)
 * ---------------------------------------------------
 * La seccion 18 describe el slider de un solo valor con manija de 20 que crece a
 * 22 en hover, anillo interior de 1px en --tk-border-2 y relleno en tinta. La
 * seccion 40 fija 22 constante, anillo de 1.5px en tinta y relleno lima. Manda
 * la seccion 40 porque es la que describe ESTE componente. Del bloque de estados
 * de la seccion 18 se conservan dos cosas que la 40 no dibuja porque solo pinta
 * el estado por defecto: el halo de hover/foco y el tratamiento de disabled
 * (opacidad .55, pista en --tk-border, relleno gris 500, manija en superficie 2).
 *
 * La manija NO crece en hover como sugiere la seccion 18: al ser un elemento
 * posicionado por Radix con transform, cambiar su tamaño desplaza su centro
 * respecto al punto del track que representa. El halo comunica lo mismo sin
 * mentir sobre el valor.
 *
 * TEMA OSCURO
 * -----------
 * Todos los colores salen de tokens --tk-* que si invierten. La unica constante
 * es la sombra de caida rgba(0,0,0,.3): una sombra negra es correcta en ambos
 * modos (en oscuro simplemente deja de verse, que es el comportamiento normal de
 * una sombra sobre fondo oscuro). El lima es un acento de marca y es identico en
 * los dos modos por diseño — por eso el borde de la manija va en tinta, que si
 * invierte, y no en un gris fijo.
 */

const rangeSliderRoot = cva([
  // touch-none es obligatorio para que el arrastre no haga scroll en movil.
  "relative flex h-6 w-full touch-none items-center select-none",
  "data-[disabled]:cursor-not-allowed",
]);

const rangeSliderTrack = cva([
  "relative h-1.5 w-full grow rounded-full bg-surface-2",
  // Disabled: la pista baja a --tk-border, un gris mas apagado que surface-2.
  "data-[disabled]:bg-edge",
]);

const rangeSliderRange = cva(
  [
    // Sin overflow-hidden en la pista: el relleno lleva su propio r999 y asi
    // conserva los extremos redondeados aunque no toque ningun borde.
    "absolute h-full rounded-full",
    "data-[disabled]:bg-ink-500",
  ],
  {
    variants: {
      /* lima  CANONICO de la seccion 40: el intervalo elegido de un filtro.
         tinta EXTENSION coherente con la seccion 18, que reserva la tinta para
               el progreso de una tarea y el lima para el avance hacia una meta.
               Util cuando el lima ya lo esta usando otro elemento de la vista. */
      tone: {
        lime: "bg-lime",
        ink: "bg-ink",
      },
    },
    defaultVariants: { tone: "lime" },
  },
);

const rangeSliderThumb = cva([
  "block size-[22px] shrink-0 rounded-full bg-surface",
  "shadow-[0_1px_3px_rgba(0,0,0,0.3),inset_0_0_0_1.5px_var(--tk-ink)]",
  "cursor-grab active:cursor-grabbing",
  /* El halo va como `ring`, que Tailwind compone en la misma propiedad
     box-shadow que la sombra de arriba sin pisarla. Se declara el color con
     anchura 0 y solo se abre en hover y foco, para que la transicion anime. */
  "ring-ink/12 transition-shadow duration-140 ease-out",
  "hover:ring-4 focus-visible:ring-4",
  /* El halo al 12% no llega al contraste 3:1 que WCAG 2.2 pide a un indicador
     de foco, asi que el foco de teclado añade ademas un contorno solido. Va como
     `outline` y no como segundo anillo porque outline no compite con box-shadow
     y sigue el radio del circulo. */
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
  "motion-reduce:transition-none",
  /* Deshabilitado el halo se apaga por COLOR y no por anchura (`ring-0`): el
     ancho del anillo lo fija tambien `hover:ring-4`, y las dos reglas tienen la
     misma especificidad, asi que quien ganara dependeria del orden en que
     Tailwind las emita. Con el color transparente el resultado no depende de
     ese orden. */
  "data-[disabled]:cursor-not-allowed data-[disabled]:bg-surface-2 data-[disabled]:ring-transparent",
  "data-[disabled]:shadow-[inset_0_0_0_1px_var(--tk-border-2)]",
]);

/** Par [minimo, maximo]. Siempre dos manijas: para un solo valor usa un slider simple. */
export type RangeSliderValue = [number, number];

type RangeVariants = VariantProps<typeof rangeSliderRange>;

/* Por que las props de Radix se redeclaran a mano en vez de derivarlas con
 * React.ComponentPropsWithoutRef<typeof Slider.Root>, que es el patron del resto
 * de componentes:
 *
 * el paquete unificado `radix-ui` empaqueta mal el namespace del slider —
 * node_modules/radix-ui/dist/slider-BMtYH5K5.d.ts contiene JAVASCRIPT (la
 * funcion _mergeNamespaces), no declaraciones. TypeScript no saca nada de ahi y
 * `typeof Slider.Root` colapsa a `any`, lo que arrastra a `any` todo el objeto de
 * props y desactiva el chequeo del componente entero.
 *
 * Importar @radix-ui/react-slider directo para robarle los tipos tampoco vale:
 * es una dependencia transitiva y con pnpm no esta en el node_modules de este
 * paquete. Asi que se declaran las props del slider que exponemos, copiadas de la
 * interfaz SliderProps del paquete real. Solo afecta a los TIPOS: en tiempo de
 * ejecucion sigue siendo el Radix de siempre. */
export interface RangeSliderProps
  extends Omit<
      React.ComponentPropsWithoutRef<"span">,
      "defaultValue" | "dir" | "onChange"
    >,
    RangeVariants {
  /** Nombre del campo, para que los dos valores viajen en un `<form>` nativo. */
  name?: string;
  /** Id del formulario al que pertenece, si no lo envuelve. */
  form?: string;
  disabled?: boolean;
  dir?: "ltr" | "rtl";
  min?: number;
  max?: number;
  step?: number;
  /** Pasos que deben quedar como minimo entre las dos manijas. 0 deja que se toquen. */
  minStepsBetweenThumbs?: number;
  /** Invierte el sentido del recorrido. */
  inverted?: boolean;
  /** Valor controlado. */
  value?: RangeSliderValue;
  /** Valor inicial no controlado. Por defecto abre en todo el rango: `[min, max]`. */
  defaultValue?: RangeSliderValue;
  onValueChange?: (value: RangeSliderValue) => void;
  /** Se dispara al soltar la manija. Usalo para lanzar la consulta, no `onValueChange`. */
  onValueCommit?: (value: RangeSliderValue) => void;
  /**
   * Da formato a los cuatro numeros en pantalla y al `aria-valuetext` de cada
   * manija. Sin el, un lector de pantalla lee "750000" en vez de "$ 750.000".
   */
  formatValue?: (value: number) => string;
  /** Fila de los dos extremos elegidos, arriba. */
  showValues?: boolean;
  /** Fila de los limites del rango, abajo. */
  showBounds?: boolean;
  /** Nombre accesible de cada manija. Radix no puede inventarlo. */
  thumbLabels?: [string, string];
  /** Clases de la caja del control. `className` es la del bloque completo. */
  sliderClassName?: string;
  /** Clases del bloque completo (valores + control + limites). */
  className?: string;
}

/**
 * Slider de dos manijas para filtrar por intervalo: rango de monto, rango de
 * fechas. El relleno entre extremos marca lo elegido.
 *
 * Se apoya en Radix Slider y no en dos `<input type="range">` superpuestos: de
 * ahi vienen gratis el `role="slider"` con `aria-valuemin/now/max` en cada
 * manija, las flechas, PageUp/PageDown, Home/End, el soporte de `dir="rtl"` y la
 * garantia de que una manija nunca cruza a la otra.
 *
 * Solo horizontal a proposito: el layout del documento — valores arriba, limites
 * abajo — no tiene lectura vertical, y ofrecer `orientation` daria un componente
 * cuyo unico modo especificado seria uno de los dos.
 *
 * Teclado: flechas y PageUp/PageDown mueven la manija ENFOCADA. Home y End no —
 * mandan la primera manija al minimo y la ultima al maximo se pulsen desde donde
 * se pulsen, porque en un rango "ir al extremo" significa abrir el intervalo. Es
 * el comportamiento de Radix y esta cubierto por un test para que no se lea como
 * un fallo.
 *
 * ```tsx
 * <RangeSlider
 *   min={0}
 *   max={1_000_000}
 *   step={10_000}
 *   defaultValue={[300_000, 750_000]}
 *   formatValue={(v) => `$ ${v.toLocaleString("es-CO")}`}
 *   thumbLabels={["Monto minimo", "Monto maximo"]}
 * />
 * ```
 */
export const RangeSlider = React.forwardRef<HTMLSpanElement, RangeSliderProps>(function RangeSlider(
  {
    className,
    sliderClassName,
    tone,
    min = 0,
    max = 100,
    value,
    defaultValue,
    onValueChange,
    onValueCommit,
    formatValue = (v) => String(v),
    showValues = true,
    showBounds = true,
    thumbLabels = ["Mínimo", "Máximo"],
    disabled,
    ...props
  },
  ref,
) {
  /* El componente pinta los valores, asi que necesita conocerlos incluso cuando
     el consumidor no controla el estado. `value` sigue mandando siempre: el
     estado interno solo entra cuando la prop es undefined. */
  const [uncontrolled, setUncontrolled] = React.useState<RangeSliderValue>(
    () => defaultValue ?? [min, max],
  );
  const current = value ?? uncontrolled;

  // El defaultValue que ve Radix tiene que quedarse quieto: si le pasaramos
  // `current`, cada render le entregaria un array nuevo con el valor ya movido y
  // el componente dejaria de ser reproducible al remontarse.
  const initialValue = React.useRef<RangeSliderValue>(defaultValue ?? [min, max]);

  const handleValueChange = (next: number[]) => {
    const pair: RangeSliderValue = [next[0] as number, next[1] as number];
    if (value === undefined) setUncontrolled(pair);
    onValueChange?.(pair);
  };

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-3.5",
        // La opacidad va al bloque entero y no solo al control: dejar los
        // numeros a plena tinta sobre una pista apagada se lee como un error de
        // render, no como un campo deshabilitado.
        disabled && "opacity-55",
        className,
      )}
    >
      {showValues ? (
        <div className="flex items-baseline justify-between">
          <span className="font-num text-[15px] font-medium text-ink">
            {formatValue(current[0])}
          </span>
          {/* Separador decorativo: el intervalo ya lo comunican los dos
              aria-valuetext de las manijas. */}
          <span aria-hidden="true" className="font-meta text-xs text-ink-600">
            –
          </span>
          <span className="font-num text-[15px] font-medium text-ink">
            {formatValue(current[1])}
          </span>
        </div>
      ) : null}

      <Slider.Root
        ref={ref}
        className={cn(rangeSliderRoot(), sliderClassName)}
        min={min}
        max={max}
        value={value}
        // Radix distingue controlado de no controlado por `value !== undefined`.
        // Pasar los dos a la vez le hace avisar por consola, asi que el
        // defaultValue solo viaja cuando no hay control externo.
        defaultValue={value === undefined ? initialValue.current : undefined}
        onValueChange={handleValueChange}
        onValueCommit={
          onValueCommit
            ? (next: number[]) => onValueCommit([next[0] as number, next[1] as number])
            : undefined
        }
        disabled={disabled}
        {...props}
      >
        <Slider.Track className={rangeSliderTrack()}>
          <Slider.Range className={rangeSliderRange({ tone })} />
        </Slider.Track>
        {current.map((thumbValue, index) => (
          <Slider.Thumb
            key={index}
            className={rangeSliderThumb()}
            aria-label={thumbLabels[index]}
            // Sin esto el lector anuncia "750000"; con esto, "$ 750.000".
            aria-valuetext={formatValue(thumbValue)}
          />
        ))}
      </Slider.Root>

      {showBounds ? (
        <div className="flex justify-between font-meta text-[11px] text-ink-500">
          <span>{formatValue(min)}</span>
          <span>{formatValue(max)}</span>
        </div>
      ) : null}
    </div>
  );
});
