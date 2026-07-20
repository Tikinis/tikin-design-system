import * as React from "react";
import { Progress as ProgressPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/* Seccion 18 · Progress & sliders — EXTENSION.
 *
 * El propio documento lo dice con todas las letras: "Extension construida con
 * la paleta y los radios del sistema". No hay ningun nodo de progreso en el
 * archivo de Figma (docs/figma-export/components/ no exporta nada parecido, y
 * fig-tokens.css no declara ningun token --progress-*). Asi que TODO lo que hay
 * aqui es propuesta coherente con los tokens, no especificacion aprobada. No lo
 * cites como canonico.
 *
 * GEOMETRIA (fuente: el HTML del prototipo, que aplica los estilos inline)
 *
 *   lineal     alto 8 · radio 999 · pista --tk-surface-2 · relleno tinta o lima
 *   completo   pista --tk-tint-success · relleno lima · check 18 en fg-success
 *   indet.     segmento del 35% · translateX(-100% -> 380%) · 1.3s ease-in-out
 *   circular   viewBox 96 · r 38 · trazo 12 · extremo redondeado · cifra 18 en
 *              DM Mono 500 · se pinta a 88px de lado
 *
 * DOS REGLAS DE USO QUE MANDAN SOBRE LA API
 * -----------------------------------------
 * 1. TINTA VS LIMA. El progreso de una tarea va en tinta; el avance hacia una
 *    meta de ahorro va en lima. De ahi que `tone` sea semantico y no decorativo.
 * 2. DETERMINADO PRIMERO. Si conoces el porcentaje, muestralo. El indeterminado
 *    (`value={null}`) solo cuando no hay forma de estimar.
 *
 * TRES DECISIONES QUE ME APARTO / INTERPRETO DEL DOCUMENTO
 * -------------------------------------------------------
 * a. La piel "completo" (pista verde + relleno lima) se aplica a AMBOS tonos al
 *    llegar al 100%, no solo a lima. El documento pinta COMPLETO como una fila
 *    mas de la lista de estados de la barra lineal, y su regla es "verde/check
 *    solo al 100%" — o sea, el verde pertenece al estado, no al tono.
 * b. El check va dibujado a mano con la geometria de Phosphor (viewBox 256,
 *    trazo 16 = peso regular) en vez de <i class="ph-fill ph-check-circle">:
 *    el paquete de iconos no es dependencia de packages/ui y no toco su
 *    package.json. El hueco del icono se reserva SIEMPRE que `showCheck` este
 *    activo, aunque este invisible, o la barra pegaria un salto de 28px justo
 *    al completarse.
 * c. El slider y el indicador por pasos de esta misma seccion NO estan aqui:
 *    son controles distintos (uno es interactivo, el otro es un stepper) y no
 *    entran en este encargo.
 *
 * COLOR EN TEMA OSCURO: todo sale de utilidades semanticas (surface-2, ink,
 * tint-success, fg-success) que ya invierten con .dark. La unica excepcion
 * deliberada es `lime`, que es un acento de marca identico en ambos modos —
 * por eso el documento lo toma directo de la primitiva de Figma.
 */

/* ---------------------------------------------------------------------------
 * Geometria del circular. Se declara en unidades de viewBox: el SVG escala
 * entero con `diameter`, asi que el trazo y la cifra guardan su proporcion.
 * ------------------------------------------------------------------------- */
const VIEWBOX = 96;
const RADIUS = 38;
const STROKE = 12;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ~238.76

/* Los @keyframes no se pueden expresar inline ni como utilidad de Tailwind sin
 * declararlos en el tema, y packages/tokens no se toca en este encargo. React 19
 * hoista a <head> cualquier <style> con `href` + `precedence` y lo deduplica por
 * href, asi que aunque haya diez barras indeterminadas en pantalla la regla se
 * inserta una sola vez. */
const INDETERMINATE_KEYFRAMES = `
@keyframes tk-progress-indeterminate {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(380%); }
}`;

const progressTrack = cva("relative", {
  variants: {
    /* El tono lo declara la pista y lo consume el relleno via --tk-progress-fill:
       asi el circular y el lineal comparten una sola tabla de color. */
    tone: {
      ink: "[--tk-progress-fill:var(--tk-ink)]",
      lime: "[--tk-progress-fill:var(--colours-limegreen-400)]",
    },
    shape: {
      // Al 100% la pista pasa a verde tenue. Ver decision (a) de la cabecera.
      linear: "h-2 w-full overflow-hidden rounded-full bg-surface-2 data-[state=complete]:bg-tint-success",
      // En circular la pista la pinta el SVG; el Root solo es la caja.
      circular: "inline-flex shrink-0 items-center justify-center",
    },
  },
  defaultVariants: { tone: "ink", shape: "linear" },
});

const progressIndicator = cva(
  [
    "h-full rounded-full bg-[var(--tk-progress-fill)]",
    "data-[state=complete]:bg-lime",
  ],
  {
    variants: {
      indeterminate: {
        // El segmento mide el 35% y recorre de -100% a 380%: entra por la
        // izquierda y sale del todo por la derecha antes de reaparecer.
        true: "absolute inset-y-0 left-0 w-[35%] animate-[tk-progress-indeterminate_1.3s_ease-in-out_infinite] motion-reduce:animate-none motion-reduce:w-full motion-reduce:opacity-60",
        // La anchura va por style inline (es un dato, no un estilo), y se anima
        // para que un cambio de valor no salte.
        false: "transition-[width] duration-300 ease-out motion-reduce:transition-none",
      },
    },
    defaultVariants: { indeterminate: false },
  },
);

const progressArc = cva(
  "fill-none stroke-[var(--tk-progress-fill)] data-[state=complete]:stroke-lime",
  {
    variants: {
      indeterminate: {
        true: "animate-spin motion-reduce:animate-none",
        false: "transition-[stroke-dasharray] duration-300 ease-out motion-reduce:transition-none",
      },
    },
    defaultVariants: { indeterminate: false },
  },
);

type ProgressVariants = VariantProps<typeof progressTrack>;

export interface ProgressProps
  extends Omit<React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>, "asChild">,
    Omit<ProgressVariants, "shape"> {
  /**
   * Porcentaje recorrido, entre 0 y `max`. `null` (o sin pasar) = indeterminado:
   * usalo solo cuando de verdad no hay forma de estimar el avance.
   */
  value?: number | null;
  /** Tope de la escala. Por defecto 100, asi que `value` ya es el porcentaje. */
  max?: number;
  /** `linear` para listas y formularios; `circular` para tarjetas y widgets. */
  shape?: "linear" | "circular";
  /**
   * Reserva un check a la derecha de la barra que solo se pinta al 100%.
   * Solo en `shape="linear"`.
   */
  showCheck?: boolean;
  /** Lado del circular en px. 88 en el documento. */
  diameter?: number;
  /** Pinta la cifra en el centro del circular. Solo si el valor se conoce. */
  showValue?: boolean;
  /** Clases del relleno (barra o arco). `className` va siempre a la pista. */
  indicatorClassName?: string;
  /** Clases de la fila que envuelve barra + check. Solo con `showCheck`. */
  rowClassName?: string;
}

/* Geometria de Phosphor (check-circle, peso regular): viewBox 256, trazo 16. */
const CheckCircle = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 256 256"
    fill="none"
    aria-hidden="true"
    className={cn("size-[18px]", className)}
    {...props}
  >
    <circle cx="128" cy="128" r="96" stroke="currentColor" strokeWidth="16" />
    <path
      d="M88 136l32 32 64-64"
      stroke="currentColor"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Indicador de progreso del sistema Tikin.
 *
 * Se apoya en Radix Progress y no en un `<div>` con `role="progressbar"` a
 * mano: de ahi salen `aria-valuenow` / `aria-valuemin` / `aria-valuemax`, el
 * `aria-valuetext` legible ("40%"), y el `data-state` (loading / complete /
 * indeterminate) del que cuelgan aqui todos los estilos de estado.
 *
 * NO es enfocable ni operable por teclado, y esta bien que asi sea: es salida,
 * no control. Si el usuario debe elegir un valor, eso es un slider.
 *
 * Necesita SIEMPRE nombre accesible — `aria-label="Progreso del envio"` o
 * `aria-labelledby` apuntando al titulo — porque un progressbar sin nombre se
 * anuncia solo como un porcentaje suelto.
 */
export const Progress = React.forwardRef<
  React.ComponentRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(function Progress(
  {
    className,
    indicatorClassName,
    rowClassName,
    tone,
    value = null,
    max = 100,
    shape = "linear",
    showCheck = false,
    diameter = 88,
    showValue = true,
    ...props
  },
  ref,
) {
  /* Radix escribe un console.error si el valor cae fuera de rango o si max no
   * es un numero positivo, y ademas dividir por un max invalido daria NaN en la
   * anchura. Se sanea aqui una sola vez y todo lo de abajo trabaja con datos ya
   * validos. */
  const safeMax = Number.isFinite(max) && max > 0 ? max : 100;
  const clamped =
    value == null || !Number.isFinite(value) ? null : Math.min(Math.max(value, 0), safeMax);
  const isIndeterminate = clamped == null;
  const percent = clamped == null ? 0 : (clamped / safeMax) * 100;
  const isComplete = clamped != null && clamped >= safeMax;

  const root = (
    <ProgressPrimitive.Root
      ref={ref}
      value={clamped}
      max={safeMax}
      className={cn(
        progressTrack({ tone, shape }),
        // Con check la barra vive dentro de una fila y debe poder encogerse.
        showCheck && shape === "linear" && "min-w-0 flex-1",
        className,
      )}
      {...props}
    >
      {isIndeterminate && shape === "linear" && (
        <style href="tk-progress-indeterminate" precedence="default">
          {INDETERMINATE_KEYFRAMES}
        </style>
      )}

      {shape === "circular" ? (
        <svg
          viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
          width={diameter}
          height={diameter}
          aria-hidden="true"
          className="text-ink"
        >
          <circle
            cx={VIEWBOX / 2}
            cy={VIEWBOX / 2}
            r={RADIUS}
            className="fill-none stroke-surface-2"
            strokeWidth={STROKE}
          />
          {/* asChild para que el <circle> reciba el data-state de Radix y las
              variantes data-[state=complete]: funcionen igual que en lineal. */}
          <ProgressPrimitive.Indicator asChild>
            <circle
              cx={VIEWBOX / 2}
              cy={VIEWBOX / 2}
              r={RADIUS}
              className={cn(progressArc({ indeterminate: isIndeterminate }), indicatorClassName)}
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={
                isIndeterminate
                  ? `${CIRCUMFERENCE * 0.3} ${CIRCUMFERENCE}`
                  : `${(percent / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`
              }
              /* El arco arranca arriba, no a las 3 en punto. Y el giro del
                 indeterminado necesita origen explicito: en SVG el centro de la
                 caja del <circle> no es el centro del viewBox. */
              style={{
                transform: isIndeterminate ? undefined : `rotate(-90deg)`,
                transformOrigin: `${VIEWBOX / 2}px ${VIEWBOX / 2}px`,
              }}
            />
          </ProgressPrimitive.Indicator>
          {showValue && !isIndeterminate && (
            <text
              x={VIEWBOX / 2}
              y={VIEWBOX / 2 + 5}
              textAnchor="middle"
              className="fill-current font-num text-[18px] font-medium"
            >
              {`${Math.round(percent)}%`}
            </text>
          )}
        </svg>
      ) : (
        <ProgressPrimitive.Indicator
          className={cn(
            progressIndicator({ indeterminate: isIndeterminate }),
            indicatorClassName,
          )}
          style={isIndeterminate ? undefined : { width: `${percent}%` }}
        />
      )}
    </ProgressPrimitive.Root>
  );

  if (shape !== "linear" || !showCheck) return root;

  return (
    <div className={cn("flex w-full items-center gap-2.5", rowClassName)}>
      {root}
      {/* El icono se reserva siempre y solo se hace visible al 100%: si
          apareciera de la nada, la barra se encogeria 28px en el ultimo frame.
          `invisible` mantiene la caja; `hidden` la quitaria. */}
      <CheckCircle
        data-tk-progress-check=""
        data-state={isComplete ? "complete" : "loading"}
        className={cn("shrink-0 text-fg-success", !isComplete && "invisible")}
      />
    </div>
  );
});
