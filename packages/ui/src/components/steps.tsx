import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../lib/cn";

/* Seccion 34 · Steps — EXTENSION.
 *
 * El documento lo dice literalmente en su entradilla: "Extension con la paleta
 * del sistema". No hay ningun nodo de stepper en el archivo de Figma
 * (docs/figma-export/components/ no exporta nada parecido y fig-tokens.css no
 * declara ningun token --step-*). Todo lo de aqui es propuesta coherente con
 * los tokens, NO especificacion aprobada: no lo cites como canonico.
 *
 * GEOMETRIA (fuente: el HTML del prototipo, que aplica los estilos inline)
 *
 *   circulo      30x30 · redondo · glifo mono 13
 *   hecho        relleno --tk-ink · check 15 en --tk-surface
 *   actual       fondo --tk-surface · anillo inset 2px --tk-ink · punto 9
 *   pendiente    fondo --tk-surface · anillo inset 1.5px --tk-border-2 · num 13 en --tk-500
 *   error        fondo rgba(255,46,46,.06) · anillo inset 2px rgb(255,46,46) · x 14
 *   label        mono 11 · tinta si hecho/actual, --tk-500 si pendiente
 *   conector     2px · --tk-ink si el paso ANTERIOR esta hecho, si no --tk-border
 *   horizontal   columna de 100 por paso · conector flex:1 con margin-top 14
 *   vertical     gap 14 entre riel y contenido · conector min-height 28 ·
 *                titulo display 500 15 · detalle 13 en --tk-600 · pb 20
 *   puntos       8x8 · gap 8 · el actual es una pildora 24x8 r999
 *
 * CUATRO DISCREPANCIAS DEL PROPIO DOCUMENTO Y COMO SE RESUELVEN
 * ------------------------------------------------------------
 * 1. GLIFO DEL PASO ACTUAL. El bloque de reglas dice "Actual: anillo tinta con
 *    punto", y asi lo pintan la demo en vivo y el ejemplo vertical. Pero el
 *    ejemplo HORIZONTAL dibuja el numero "2" dentro del anillo. Gana el punto
 *    (regla escrita + dos de los tres ejemplos) y el numero queda disponible
 *    por prop `currentIndicator="number"` para reproducir ese ejemplo tal cual.
 *
 * 2. CONECTOR. La regla dice "El conector previo se pinta tinta cuando el paso
 *    esta hecho", pero en el ejemplo horizontal el paso 2 es el ACTUAL (no
 *    hecho) y su conector previo ya va en tinta. Manda lo dibujado: el conector
 *    entre i e i+1 se llena cuando el paso i esta hecho.
 *
 * 3. LA DEMO "EN VIVO" usa columnas de 96 y el ejemplo estatico de 100. Manda
 *    el estatico (100), que es el que se repite en los bloques HORIZONTAL y CON
 *    ERROR. El circulo mide 30 en todos los bloques, asi que ahi no hay
 *    conflicto.
 *
 * 4. GLIFO DEL PASO PENDIENTE. Los bloques HORIZONTAL y CON ERROR pintan el
 *    numero dentro del anillo gris; el bloque VERTICAL deja ese mismo anillo
 *    vacio (`<div ...></div>`, sin ningun hijo). No es descuido: en vertical la
 *    etiqueta ya es un titulo display de 15 que ordena la lista por si solo, asi
 *    que el numero solo añadiria ruido, mientras que en horizontal la etiqueta
 *    es mono 11 y el numero es lo que da la posicion de un vistazo. Se respeta
 *    cada eje tal como lo dibuja el archivo. No cambia nada accesible: el
 *    circulo va aria-hidden y la posicion la da el <ol>.
 *
 * COLOR EN TEMA OSCURO
 * --------------------
 * Todo sale de utilidades semanticas (ink, surface, edge-2, ink-500, ink-600,
 * fg-error) que ya invierten con .dark. Las dos excepciones son deliberadas:
 * el anillo y el fondo del estado error usan las primitivas de marca
 * --colours-purered-600 / --colours-purered-transparent, identicas en ambos
 * modos igual que en text-field, porque son acento y no superficie. El texto
 * del error si va en fg-error, que si invierte.
 */

/* Geometria de Phosphor — la libreria de iconos oficial del sistema — copiada a
 * mano (viewBox 256, trazo 16 = peso regular, 24 = bold) porque el paquete de
 * iconos no es dependencia de packages/ui y no toco su package.json. */
const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 256 256" fill="none" aria-hidden="true" {...props}>
    <path
      d="M216 72 104 184l-56-56"
      stroke="currentColor"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 256 256" fill="none" aria-hidden="true" {...props}>
    <path
      d="M200 56 56 200M200 200 56 56"
      stroke="currentColor"
      strokeWidth="24"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export type StepStatus = "done" | "current" | "pending" | "error";

const stepCircle = cva(
  [
    "flex size-[30px] shrink-0 items-center justify-center rounded-full",
    // El glifo numerico va mono 13, como el resto de cifras del sistema.
    "font-mono text-[13px] leading-none",
    "transition-[background-color,box-shadow,color] duration-300 ease-out motion-reduce:transition-none",
  ],
  {
    variants: {
      status: {
        done: "bg-ink text-surface",
        /* El anillo va por inset shadow y no por `border`: con border el
           circulo mediria 30 + 2*grosor y los pasos bailarian de tamaño al
           cambiar de estado. */
        current: "bg-surface text-ink shadow-[inset_0_0_0_2px_var(--tk-ink)]",
        pending: "bg-surface text-ink-500 shadow-[inset_0_0_0_1.5px_var(--tk-border-2)]",
        error: "bg-red-tint text-fg-error shadow-[inset_0_0_0_2px_var(--colours-purered-600)]",
      },
    },
    defaultVariants: { status: "pending" },
  },
);

const stepLabel = cva("font-mono text-[11px] leading-tight", {
  variants: {
    status: {
      done: "text-ink",
      current: "text-ink",
      pending: "text-ink-500",
      error: "text-fg-error",
    },
  },
  defaultVariants: { status: "pending" },
});

/* El titulo del modo vertical es display 500/15, no mono: ahi el paso lleva
   detalle y compite con el texto de la pagina, no con una etiqueta. */
const stepTitle = cva("font-display text-[15px] font-medium", {
  variants: {
    status: {
      done: "text-ink",
      current: "text-ink",
      pending: "text-ink-500",
      error: "text-fg-error",
    },
  },
  defaultVariants: { status: "pending" },
});

const stepConnector = cva("transition-colors duration-300 ease-out motion-reduce:transition-none", {
  variants: {
    orientation: {
      // margin-top 14 + medio grosor = 15 = centro exacto del circulo de 30.
      horizontal: "mt-[14px] h-0.5 flex-1",
      vertical: "min-h-[28px] w-0.5 flex-1",
    },
    /* El color va ENTERO en la variante, nunca `bg-edge` en la base y `bg-ink`
       aqui: cva concatena, no fusiona, asi que las dos clases saldrian juntas en
       el mismo atributo y quien ganara dependeria del orden en que Tailwind las
       emita en la hoja. Hoy `.bg-edge` cae antes que `.bg-ink` por puro
       alfabeto; renombrar el token a `bg-line` o `bg-rail` apagaria el conector
       sin ningun error visible. */
    filled: { true: "bg-ink", false: "bg-edge" },
  },
  defaultVariants: { orientation: "horizontal", filled: false },
});

export interface StepItem {
  /** Etiqueta corta del paso. Se escribe en capitalizacion normal, no en mayusculas. */
  label: React.ReactNode;
  /**
   * Resumen o ayuda bajo la etiqueta. Solo se pinta en `orientation="vertical"`,
   * que es el modo pensado para pasos con detalle.
   */
  description?: React.ReactNode;
  /**
   * Fuerza el estado en vez de derivarlo de `value`. Es la unica forma de
   * marcar un paso en `error`, porque el error no se deduce de la posicion.
   */
  status?: StepStatus;
  /** Impide volver a este paso aunque este hecho y haya `onStepSelect`. */
  disabled?: boolean;
}

export interface StepsProps extends Omit<React.ComponentPropsWithoutRef<"ol">, "onSelect"> {
  /** Los pasos, en orden. Maximo ~5: por encima de eso, agrupa. */
  steps: StepItem[];
  /**
   * Indice del paso actual (base 0). Los anteriores quedan `done` y los
   * posteriores `pending`, salvo que el paso declare su propio `status`.
   */
  value?: number;
  /** Horizontal para 3-4 pasos cortos; vertical cuando cada paso lleva detalle. */
  orientation?: "horizontal" | "vertical";
  /** Glifo del paso actual. Ver discrepancia 1 de la cabecera. */
  currentIndicator?: "dot" | "number";
  /**
   * Hace tocables los pasos ya hechos para poder regresar. Sin esta prop el
   * indicador es solo salida y no renderiza ningun boton.
   */
  onStepSelect?: (index: number) => void;
  /**
   * Texto que lee el lector de pantalla para cada estado. Se pinta oculto
   * porque el estado se comunica solo por color y forma, y eso no llega.
   */
  statusLabels?: Record<StepStatus, string>;
}

/* Satura un indice al rango [0, length-1].
 *
 * NaN se filtra a mano y no por descuido: `Math.trunc(NaN)` sigue siendo NaN y
 * TODA comparacion con NaN es falsa, asi que un `value={NaN}` (el resultado
 * tipico de `Number(input.value)` o de una division sin datos) atravesaba el
 * clamp intacto, ningun paso casaba con el indice actual y la lista se quedaba
 * entera en "pendiente" y sin aria-current. Un fallo mudo justo en lo unico que
 * el componente comunica. Infinito no necesita caso propio: satura solo. */
function clampIndex(value: number, length: number): number {
  if (length <= 0 || Number.isNaN(value)) return 0;
  return Math.min(Math.max(Math.trunc(value), 0), length - 1);
}

const DEFAULT_STATUS_LABELS: Record<StepStatus, string> = {
  done: "Completado",
  current: "Paso actual",
  pending: "Pendiente",
  error: "Con error",
};

/**
 * Indicador de progreso por pasos del sistema Tikin.
 *
 * Es una lista ordenada de verdad (`<ol>` / `<li>`): el numero de paso y el
 * total salen de la semantica del propio elemento, no de texto inventado — con
 * `role="list"` explicito, porque el reset de Tailwind quita la viñeta y WebKit
 * se lleva la semantica con ella. El paso en curso lleva `aria-current="step"`.
 *
 * NO es enfocable por defecto: es salida, no control. Solo cuando el consumidor
 * pasa `onStepSelect` los pasos ya hechos se convierten en botones — y entonces
 * el teclado funciona solo, porque son `<button>` nativos.
 *
 * Necesita nombre accesible: pasa `aria-label` (por ejemplo "Progreso del
 * envio") o `aria-labelledby` apuntando al titulo de la seccion.
 */
export const Steps = React.forwardRef<HTMLOListElement, StepsProps>(function Steps(
  {
    className,
    steps,
    value = 0,
    orientation = "horizontal",
    currentIndicator = "dot",
    onStepSelect,
    statusLabels,
    ...props
  },
  ref,
) {
  const labels = statusLabels ?? DEFAULT_STATUS_LABELS;

  /* Un value fuera de rango dejaria la lista sin ningun paso actual (o con el
     ultimo conector a medias). Se satura aqui una vez y todo lo de abajo
     trabaja con un indice valido. */
  const current = clampIndex(value, steps.length);

  const resolved = steps.map<StepStatus>(
    (step, index) =>
      step.status ?? (index < current ? "done" : index === current ? "current" : "pending"),
  );

  const isVertical = orientation === "vertical";

  return (
    <ol
      ref={ref}
      /* role="list" redundante A PROPOSITO. El preflight de Tailwind pinta
         `ol, ul, menu { list-style: none }`, y WebKit retira la semantica de
         lista de toda lista sin viñeta: VoiceOver dejaria de anunciar "lista,
         N elementos" y con ello el numero de paso y el total, que es lo unico
         que este componente comunica. Va antes del spread para que el
         consumidor pueda sustituirlo si envuelve la lista en otro patron. */
      role="list"
      className={cn(isVertical ? "flex flex-col" : "flex w-full items-start", className)}
      {...props}
    >
      {steps.map((step, index) => {
        const status = resolved[index]!;
        const isLast = index === steps.length - 1;
        // El conector que precede a este paso se llena cuando el ANTERIOR esta
        // hecho. Ver discrepancia 2 de la cabecera.
        const previousDone = index > 0 && resolved[index - 1] === "done";
        const tappable = Boolean(onStepSelect) && status === "done" && !step.disabled;

        /* Glifo del circulo. El pendiente se queda VACIO en vertical y lleva
           numero en horizontal, que es como los dibuja el archivo: ver
           discrepancia 4 de la cabecera. */
        const glyph =
          status === "done" ? (
            <CheckIcon className="size-[15px]" />
          ) : status === "error" ? (
            <XIcon className="size-[14px]" />
          ) : status === "current" ? (
            currentIndicator === "dot" ? (
              <span className="size-[9px] rounded-full bg-ink" />
            ) : (
              index + 1
            )
          ) : isVertical ? null : (
            index + 1
          );

        /* El circulo queda oculto al lector de pantalla entero: su numero
           repite la posicion que ya da el <ol>, y el check y la x son
           decorativos. El estado se anuncia por el texto sr-only. */
        const circle = (
          <span className={stepCircle({ status })} aria-hidden="true">
            {glyph}
          </span>
        );

        const srStatus = <span className="sr-only">{labels[status]}</span>;

        /* aria-current sale de `value`, NUNCA del status resuelto. Un paso
           marcado `error` sigue siendo donde esta el usuario, y si lo dedujeramos
           del status la lista se quedaria sin ningun paso actual justo cuando
           mas falta hace saber donde estas. */
        const ariaCurrent = index === current ? ("step" as const) : undefined;

        if (isVertical) {
          const content = (
            <>
              <span className={cn(stepTitle({ status }), "block")}>{step.label}</span>
              {step.description != null && (
                <span className="block text-[13px] text-ink-600">{step.description}</span>
              )}
              {srStatus}
            </>
          );

          return (
            <li key={index} className="flex gap-[14px]" aria-current={ariaCurrent}>
              <div className="flex flex-col items-center">
                {circle}
                {/* El conector cuelga del paso y se llena cuando ESTE esta
                    hecho, que es la misma regla vista desde el otro lado. */}
                {!isLast && (
                  <span
                    /* Sin rol ni texto: es una linea decorativa. El data-slot
                       es el unico asidero estable para verificar el llenado. */
                    data-slot="step-connector"
                    className={stepConnector({
                      orientation: "vertical",
                      filled: status === "done",
                    })}
                  />
                )}
              </div>
              {tappable ? (
                <button
                  type="button"
                  onClick={() => onStepSelect?.(index)}
                  className={cn(
                    "cursor-pointer rounded-sm text-left outline-none",
                    "focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-page",
                    !isLast && "pb-5",
                  )}
                >
                  {content}
                </button>
              ) : (
                <div className={cn(!isLast && "pb-5")}>{content}</div>
              )}
            </li>
          );
        }

        const column = (
          <>
            {circle}
            <span className={cn(stepLabel({ status }), "text-center")}>{step.label}</span>
            {srStatus}
          </>
        );

        return (
          <li
            key={index}
            /* El primer paso no crece porque no lleva conector delante; el
               resto crece por igual, y asi todos los conectores miden lo
               mismo pase lo que pase con el ancho del contenedor. */
            className={cn("flex items-start", index === 0 ? "flex-none" : "flex-1")}
            aria-current={ariaCurrent}
          >
            {index > 0 && (
              <span
                data-slot="step-connector"
                className={stepConnector({ orientation: "horizontal", filled: previousDone })}
              />
            )}
            {tappable ? (
              <button
                type="button"
                onClick={() => onStepSelect?.(index)}
                className={cn(
                  "flex w-[100px] shrink-0 cursor-pointer flex-col items-center gap-2 rounded-sm outline-none",
                  "focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-page",
                )}
              >
                {column}
              </button>
            ) : (
              <div className="flex w-[100px] shrink-0 flex-col items-center gap-2">{column}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
});

export interface StepsDotsProps extends React.ComponentPropsWithoutRef<"div"> {
  /** Cuantos pasos hay. */
  count: number;
  /** Indice del paso actual (base 0). */
  value?: number;
  /**
   * Texto accesible. Recibe el paso y el total ya saturados, porque los puntos
   * no dicen nada por si solos a un lector de pantalla.
   */
  formatLabel?: (current: number, total: number) => string;
}

/**
 * Progreso compacto para onboarding y carruseles: puntos de 8, y el actual es
 * una pildora alargada de 24.
 *
 * No sustituye a `Steps` cuando los pasos tienen nombre — aqui no cabe ninguna
 * etiqueta, asi que el usuario solo sabe cuantos quedan, no que son.
 */
export const StepsDots = React.forwardRef<HTMLDivElement, StepsDotsProps>(function StepsDots(
  { className, count, value = 0, formatLabel, ...props },
  ref,
) {
  // Mismo filtro de NaN que en Steps: `count={NaN}` dejaba "Paso NaN de NaN".
  const total = Number.isNaN(count) ? 0 : Math.max(Math.trunc(count), 0);
  const current = clampIndex(value, total);
  const label = (formatLabel ?? ((c: number, t: number) => `Paso ${c} de ${t}`))(
    total === 0 ? 0 : current + 1,
    total,
  );

  return (
    <div
      ref={ref}
      /* `group` NO calcula su nombre a partir del contenido, asi que el texto
         sr-only de dentro solo se leia al recorrer la fila: al entrar en el
         grupo el lector anunciaba "grupo" a secas. El nombre va aqui. `role` y
         `aria-label` van ANTES del spread para que el consumidor pueda cambiar
         ambos si envuelve los puntos en otro patron. */
      role="group"
      aria-label={label}
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {/* El texto se mantiene ademas del nombre del grupo porque un contenedor
          cuyo contenido es todo aria-hidden se lo saltan varios lectores en modo
          exploracion, y entonces el nombre no llega a leerse nunca. */}
      <span className="sr-only">{label}</span>
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          aria-hidden="true"
          className={cn(
            "h-2 rounded-full transition-[width,background-color] duration-300 ease-out motion-reduce:transition-none",
            index === current ? "w-6 bg-ink" : index < current ? "w-2 bg-ink" : "w-2 bg-edge-2",
          )}
        />
      ))}
    </div>
  );
});
