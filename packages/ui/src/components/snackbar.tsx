import * as React from "react";
import { Toast } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/* Seccion 39 · Snackbar & undo — EXTENSION.
 *
 * El propio documento lo etiqueta asi: "Reutiliza la superficie tinta del toast.
 * Extension construida con los tokens del archivo". No hay componente Snackbar
 * en el export de Figma (docs/figma-export/components) — se ha comprobado. Todo
 * lo que sigue es una propuesta coherente con los tokens, NO especificacion
 * aprobada.
 *
 * QUE ES
 * ------
 * Confirma una accion REVERSIBLE y ofrece deshacerla antes de que sea
 * definitiva. Como el toast, pero siempre con accion y algo mas de tiempo
 * (5-8s). Si la accion no se puede deshacer — borrar la cuenta — la respuesta
 * es un dialogo de confirmacion, no un snackbar.
 *
 * COMO SE USA
 * -----------
 *   <SnackbarProvider>
 *     <App />
 *     <Snackbar open={open} onOpenChange={setOpen}
 *               message="Movimiento eliminado"
 *               actionLabel="Deshacer" onAction={restaurar} />
 *     <SnackbarViewport />
 *   </SnackbarProvider>
 *
 * UNO A LA VEZ: el documento prohibe apilarlos. Radix apila por defecto, asi
 * que la regla la impone el consumidor manteniendo un unico estado abierto. No
 * se fuerza aqui porque hacerlo obligaria a montar un store global dentro del
 * paquete de UI.
 *
 * GEOMETRIA (bloque "VARIANTES · ANATOMIA", que es el canonico de la seccion)
 *   superficie  bg tinta fuerte, texto surface, r12, sombra 0 8px 24px -6px
 *   padding     12 arriba/abajo/derecha, 16 a la izquierda · gap 12
 *   mensaje     sans 14 · subtitulo sans 12 en ink-500
 *   separador   1x16
 *   accion      mono 13 MAYUSCULAS +2% tracking, padding 6/10, r8, icono 14
 *   cuenta      barra de 3px lima abajo, o anillo de 18 con trazo 3
 *
 * El bloque "DESHACER · ESTADOS" dibuja la misma pieza con padding 10 y texto
 * 13: es una maqueta de los cuatro estados del boton, no una segunda talla. Se
 * ignoran esas medidas y manda ANATOMIA.
 *
 * POR QUE LA SUPERFICIE NO INVIERTE CON EL TEMA
 * ---------------------------------------------
 * El documento abre la seccion diciendo "Reutiliza la superficie tinta del
 * toast", asi que la superficie es literalmente la de toast.tsx: tinta 900
 * (--colours-grayscale-light-900, rgb(11,11,11)) con texto blanco en LOS DOS
 * temas, y no un par de tokens semanticos que se den la vuelta.
 *
 * El motivo es el mismo que documenta toast.tsx: el prototipo pinta la pieza
 * con --tk-ink-strong / --tk-surface, que invertidos darian un snackbar BLANCO
 * con texto gris, y sin embargo fija a mano el separador, la pista de la cuenta
 * y los acentos con valores que solo se leen sobre negro. Comprobado uno a uno
 * contra fig-tokens.css, esos literales SON tokens del archivo:
 *     rgb(52,52,52)   = --colours-grayscale-dark-550   separador y pistas
 *     rgb(133,255,133)= --colours-limegreen-400        cuenta regresiva
 *     rgb(166,166,166)= --colours-grayscale-light-500  segunda linea, CERRAR
 * O sea, el prototipo se contradice y la lectura coherente es la pieza oscura
 * fija. Se escriben por su nombre de token, no por su valor.
 *
 * La superficie y la tinta viajan en --tk-snack-surface / --tk-snack-ink para
 * que el anillo de foco pueda referirse a ellas sin repetir el valor y para que
 * un consumidor pueda re-teñir la pieza cambiando dos variables.
 *
 * ACCION EN LIMA — DISCREPANCIA RESUELTA
 * --------------------------------------
 * El texto de la seccion dice dos veces que la accion va "en lima" ("acción
 * lima sobre tinta", "la acción va a la derecha en lima"), pero las diez piezas
 * dibujadas del prototipo pintan el label con var(--tk-surface), o sea blanco.
 * Gana el texto: sobre una superficie monocroma el unico elemento pulsable
 * tiene que distinguirse por algo, y en blanco DESHACER se confunde con el
 * mensaje. Con la superficie fija en tinta 900, la lima sobre negro esta muy
 * por encima del minimo de contraste. Es ademas la misma resolucion que tomo
 * toast.tsx para su propia accion, y los dos componentes comparten superficie:
 * divergir aqui haria que DESHACER cambiase de color segun quien lo mostrara.
 */

/* Los @keyframes no se pueden expresar como utilidad de Tailwind sin declararlos
 * en el tema, y packages/tokens es territorio de otro agente. React 19 hoista a
 * <head> cualquier <style> con `href` + `precedence` y lo deduplica por href,
 * asi que la regla se inserta una sola vez aunque haya varios snackbars. */
const SNACKBAR_KEYFRAMES = `
@keyframes tk-snackbar-in {
  from { opacity: 0; transform: translateY(140%) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes tk-snackbar-out {
  from { opacity: 1; transform: translateY(0) scale(1); }
  to   { opacity: 0; transform: translateY(60%) scale(0.97); }
}
@keyframes tk-snackbar-countdown {
  from { transform: scaleX(1); }
  to   { transform: scaleX(0); }
}
@keyframes tk-snackbar-ring {
  from { stroke-dashoffset: 0; }
  to   { stroke-dashoffset: var(--tk-snack-ring-c); }
}`;

/* Anillo de 18px con trazo de 3 sobre un viewBox de 24: r = 9 y la
 * circunferencia sale 56.55. Se calcula en vez de escribir el 57 redondeado del
 * prototipo para que el trazo cierre exacto al terminar la cuenta. */
const RING_RADIUS = 9;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

/** Duracion por defecto. El documento pide 5-8s; 5 es el minimo de ese rango. */
const DEFAULT_DURATION_MS = 5000;

const snackbarRoot = cva([
  "group pointer-events-auto relative isolate w-fit max-w-full overflow-hidden",
  "rounded-lg bg-[var(--tk-snack-surface)] text-[var(--tk-snack-ink)]",
  "[--tk-snack-ink:var(--colours-neutral-white)] [--tk-snack-surface:var(--colours-grayscale-light-900)]",
  // Sombra alta: la pieza flota sobre todo, no es una tarjeta.
  "shadow-[0_8px_24px_-6px_rgba(0,0,0,0.35)]",
  // Radix hace el <li> enfocable para poder alcanzarlo con F8; sin anillo
  // propio, ese salto no se veria en pantalla.
  "outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-page",
  // Entrada spring desde abajo. La salida es mas corta: cerrar no necesita
  // rebote, y Radix espera al animationend para desmontar.
  "data-[state=open]:animate-[tk-snackbar-in_320ms_cubic-bezier(0.16,1,0.3,1)]",
  "data-[state=closed]:animate-[tk-snackbar-out_140ms_ease-in]",
  "motion-reduce:animate-none",
  // Arrastre hacia abajo para descartar (swipeDirection del provider).
  "data-[swipe=move]:translate-y-[var(--radix-toast-swipe-move-y)]",
  "data-[swipe=cancel]:translate-y-0 data-[swipe=cancel]:transition-transform data-[swipe=cancel]:duration-200",
  "data-[swipe=end]:animate-[tk-snackbar-out_140ms_ease-in]",
]);

const snackbarAction = cva(
  [
    "inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-sm px-2.5 py-1.5",
    // Label mono, MAYUSCULAS por CSS, +2% de tracking y nunca bold.
    "font-mono text-[13px] font-normal tracking-[0.02em] whitespace-nowrap uppercase",
    "transition-colors duration-140 ease-out select-none",
    // Hover y pressed con los mismos alfas de blanco del prototipo (.12 y .22).
    // Van sobre blanco literal y no sobre currentColor porque la superficie es
    // fija: currentColor cambiaria el realce segun el tono de la accion.
    "hover:bg-[rgba(255,255,255,0.12)] active:bg-[rgba(255,255,255,0.22)]",
    "outline-none focus-visible:ring-2 focus-visible:ring-lime/60",
    "[&_svg]:size-3.5 [&_svg]:shrink-0",
  ],
  {
    variants: {
      tone: {
        // Lima: sobre la superficie tinta es lo unico que separa la accion del
        // mensaje. Ver la discrepancia resuelta en la cabecera.
        primary: "text-lime",
        // La accion secundaria (CERRAR) queda apagada frente a la principal.
        muted: "text-[var(--colours-grayscale-light-500)]",
      },
    },
    defaultVariants: { tone: "primary" },
  },
);

const snackbarViewport = cva(
  [
    "fixed z-50 m-0 flex list-none flex-col gap-2 p-4 outline-none",
    // El viewport no debe capturar clics en la zona vacia que ocupa.
    "pointer-events-none max-w-[min(100vw,26rem)]",
    // En movil se ancla sobre la barra inferior respetando el safe-area.
    "pb-[calc(1rem+env(safe-area-inset-bottom))]",
  ],
  {
    variants: {
      placement: {
        /** Web: abajo a la izquierda, para no tapar la accion principal. */
        "bottom-left": "bottom-0 left-0 items-start",
        /** Movil: centrado sobre la barra inferior. */
        "bottom-center": "bottom-0 left-1/2 -translate-x-1/2 items-center",
      },
    },
    defaultVariants: { placement: "bottom-left" },
  },
);

/* -------------------------------------------------------------------------
 * Provider
 * ------------------------------------------------------------------------- */

/* POR QUE LOS TIPOS DE RADIX VAN ESCRITOS A MANO
 * ----------------------------------------------
 * radix-ui@1.6.3 publica los .d.ts de sus namespaces con el CUERPO EN
 * JAVASCRIPT en vez de con declaraciones (node_modules/radix-ui/dist/toast-*.d.ts
 * es el _mergeNamespaces tal cual). Resultado: `typeof Toast.Root` es `any`, y
 * derivar de ahi con ComponentPropsWithoutRef no tipa NADA: se colaba un
 * `duration="cinco"` sin que tsc dijera una palabra. Escribir las props aqui es
 * lo unico que da comprobacion real sin añadir @radix-ui/react-toast como
 * dependencia directa. Mismo diagnostico y misma solucion que en toast.tsx. Si
 * radix-ui arregla sus declaraciones, este es el sitio donde volver.
 *
 * La contrapartida: los manejadores de arrastre (onSwipeStart/Move/Cancel/End)
 * no se exponen. El arrastre ya lo pinta el componente con los data-swipe-*, y
 * tiparlos a mano seria copiar el CustomEvent entero de Radix. */
export interface SnackbarProviderProps {
  children?: React.ReactNode;
  /** Palabra que el lector de pantalla antepone a cada aviso. */
  label?: string;
  /** Duracion por defecto de los snackbars que no la declaren. */
  duration?: number;
  /** Direccion del arrastre que descarta. */
  swipeDirection?: "up" | "down" | "left" | "right";
  /** Pixeles de arrastre necesarios para descartar. */
  swipeThreshold?: number;
}

/**
 * Contexto de los snackbars. Va una sola vez, lo mas arriba posible del arbol.
 *
 * Cambia dos defaults de Radix:
 *  - `swipeDirection` a "down", porque la pieza vive anclada abajo y el gesto
 *    natural para descartarla es empujarla fuera de pantalla.
 *  - `label`, que Radix anuncia antes del mensaje, traducido al castellano.
 */
export function SnackbarProvider({
  duration = DEFAULT_DURATION_MS,
  swipeDirection = "down",
  label = "Notificación",
  ...props
}: SnackbarProviderProps) {
  return (
    <Toast.Provider
      duration={duration}
      swipeDirection={swipeDirection}
      label={label}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------
 * Viewport
 * ------------------------------------------------------------------------- */

export interface SnackbarViewportProps
  extends React.ComponentPropsWithoutRef<"ol">,
    VariantProps<typeof snackbarViewport> {
  /** Atajo que lleva el foco a la lista. Por defecto F8, el de Radix. */
  hotkey?: string[];
  /** Etiqueta de la region. `{hotkey}` se sustituye por el atajo. */
  label?: string;
}

/**
 * Zona fija donde aterrizan los snackbars. Una por aplicacion.
 *
 * `bottom-left` es la posicion de web; `bottom-center` la de movil, sobre la
 * barra inferior. Las dos reservan el safe-area inferior.
 *
 * Radix hace este contenedor alcanzable con F8, para que un usuario de teclado
 * pueda saltar al snackbar sin recorrer la pagina; por eso `label` lleva texto.
 */
export const SnackbarViewport = React.forwardRef<HTMLOListElement, SnackbarViewportProps>(
  function SnackbarViewport({ className, placement, label = "Notificaciones ({hotkey})", ...props }, ref) {
    return (
      <Toast.Viewport
        ref={ref}
        label={label}
        className={cn(snackbarViewport({ placement }), className)}
        {...props}
      />
    );
  },
);

/* -------------------------------------------------------------------------
 * Snackbar
 * ------------------------------------------------------------------------- */

export interface SnackbarProps
  extends Omit<React.ComponentPropsWithoutRef<"li">, "title" | "type" | "children"> {
  /** Visibilidad controlada. Sin ella el snackbar nace cerrado. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Milisegundos hasta el auto-descarte. `Infinity` lo deja fijo. */
  duration?: number;
  /** `foreground` interrumpe al lector de pantalla; `background` espera turno. */
  type?: "foreground" | "background";
  /** Fuerza el montaje para animar el cierre con una libreria externa. */
  forceMount?: true;
  /** El temporizador se pausa al entrar el puntero o el foco. */
  onPause?: () => void;
  onResume?: () => void;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  /** Mensaje en pasado y sin puntuacion: "Movimiento eliminado". */
  message: React.ReactNode;
  /** Segunda linea opcional con el detalle: "$ 250.000 a $mariarojas". */
  description?: React.ReactNode;
  /** Icono leading a 18px. Se ignora con `loading`, que ocupa esa ranura. */
  icon?: React.ReactNode;
  /**
   * Label de la accion principal. Se escribe en capitalizacion normal
   * ("Deshacer") y se pone en mayusculas por CSS.
   */
  actionLabel?: string;
  /** Icono de la accion, a 14px. */
  actionIcon?: React.ReactNode;
  /** Se dispara al pulsar la accion. Radix cierra el snackbar despues. */
  onAction?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * Texto que lee el lector de pantalla para describir la accion cuando el
   * snackbar ya no esta en pantalla. Por defecto, el propio `actionLabel`.
   */
  actionAltText?: string;
  /** Accion secundaria apagada, siempre a la izquierda de la principal ("Cerrar"). */
  closeLabel?: string;
  /** Forma de la cuenta regresiva. `none` la oculta sin tocar el temporizador. */
  countdown?: "bar" | "ring" | "none";
  /**
   * Estado "procesando": spinner en la ranura leading, sin accion y sin cuenta.
   * Mientras dura no se cierra solo — lo cierra quien lance el proceso.
   */
  loading?: boolean;
}

/**
 * Snackbar con deshacer.
 *
 * La accion se aplica de una vez y el snackbar da la ventana para revertirla;
 * el sistema espera a que cierre para confirmarla de forma definitiva.
 *
 * La cuenta regresiva se pausa cuando Radix pausa su temporizador (puntero
 * sobre el viewport o foco dentro), no con un `:hover` propio: asi la barra y
 * el cierre real nunca se desincronizan.
 */
export const Snackbar = React.forwardRef<HTMLLIElement, SnackbarProps>(function Snackbar(
  {
    className,
    message,
    description,
    icon,
    actionLabel,
    actionIcon,
    onAction,
    actionAltText,
    closeLabel,
    countdown = "bar",
    loading = false,
    duration,
    onPause,
    onResume,
    ...props
  },
  ref,
) {
  /* Radix avisa por eventos, no por atributo de datos, cuando congela el
   * temporizador. Se refleja en estado para poder parar la animacion de la
   * cuenta en el mismo instante. */
  const [paused, setPaused] = React.useState(false);

  const handlePause = React.useCallback(() => {
    setPaused(true);
    onPause?.();
  }, [onPause]);

  const handleResume = React.useCallback(() => {
    setPaused(false);
    onResume?.();
  }, [onResume]);

  /* Mientras se procesa no hay nada que deshacer ni plazo que contar: quien
   * lanzo el proceso decide cuando cerrarlo. Infinity es el valor con el que
   * Radix desactiva el temporizador. */
  const resolvedDuration = loading ? (duration ?? Infinity) : duration;
  const showAction = Boolean(actionLabel) && !loading;
  const showClose = Boolean(closeLabel) && !loading;
  const shape = loading ? "none" : countdown;

  /* La animacion tiene que durar lo mismo que el temporizador. Radix guarda su
   * duracion por defecto en el provider y no la expone por contexto publico,
   * asi que aqui se asume DEFAULT_DURATION_MS: si cambias la del provider,
   * pasa tambien `duration` al snackbar o la barra ira desacompasada. */
  const countdownMs = resolvedDuration ?? DEFAULT_DURATION_MS;
  const finite = Number.isFinite(countdownMs);

  const countdownStyle: React.CSSProperties = {
    animationDuration: `${countdownMs}ms`,
    animationPlayState: paused ? "paused" : "running",
  };

  return (
    <Toast.Root
      ref={ref}
      duration={resolvedDuration}
      onPause={handlePause}
      onResume={handleResume}
      aria-busy={loading || undefined}
      className={cn(snackbarRoot(), className)}
      {...props}
    >
      <style href="tk-snackbar" precedence="default">
        {SNACKBAR_KEYFRAMES}
      </style>

      <div className="flex items-center gap-3 py-3 pr-3 pl-4">
        {loading ? (
          // Spinner de 16 con borde 2, como el prototipo: aro gris 550 y solo
          // el borde superior en la tinta de la pieza.
          <span
            aria-hidden="true"
            className="size-4 shrink-0 animate-spin rounded-full border-2 border-[var(--colours-grayscale-dark-550)] border-t-[var(--tk-snack-ink)] motion-reduce:animate-none"
          />
        ) : shape === "ring" ? (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-[18px] shrink-0 -rotate-90"
            // La variable se declara en el <svg> y el circulo la hereda: los
            // keyframes necesitan el valor, no lo pueden calcular.
            style={{ "--tk-snack-ring-c": RING_CIRCUMFERENCE } as React.CSSProperties}
          >
            <circle
              cx="12"
              cy="12"
              r={RING_RADIUS}
              fill="none"
              strokeWidth="3"
              className="stroke-[var(--colours-grayscale-dark-550)]"
            />
            <circle
              cx="12"
              cy="12"
              r={RING_RADIUS}
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              className={cn(
                "stroke-lime",
                finite && "animate-[tk-snackbar-ring_linear_forwards] motion-reduce:animate-none",
              )}
              style={finite ? countdownStyle : undefined}
            />
          </svg>
        ) : (
          icon && (
            <span aria-hidden="true" className="shrink-0 [&>svg]:size-[18px]">
              {icon}
            </span>
          )
        )}

        <div className="flex min-w-0 flex-col gap-0.5">
          <Toast.Title className="font-sans text-sm">{message}</Toast.Title>
          {description && (
            // Gris 500 literal, no `text-ink-500`: la utilidad semantica sube a
            // rgb(110) en oscuro y la pieza es negra en los dos temas, asi que
            // el detalle perderia legibilidad justo donde mas cuesta leerlo.
            <Toast.Description className="font-sans text-xs text-[var(--colours-grayscale-light-500)]">
              {description}
            </Toast.Description>
          )}
        </div>

        {/* Separador de 1x16 en gris 550. Decorativo: la accion ya es un boton
            con su propio nombre accesible. */}
        {(showAction || showClose) && (
          <span
            aria-hidden="true"
            className="h-4 w-px shrink-0 bg-[var(--colours-grayscale-dark-550)]"
          />
        )}

        {showClose && (
          <Toast.Close className={snackbarAction({ tone: "muted" })}>{closeLabel}</Toast.Close>
        )}

        {showAction && actionLabel && (
          // `altText` es obligatorio en Radix: es lo que lee un lector de
          // pantalla cuando el snackbar ya se ha ido y la accion sigue siendo
          // alcanzable. Va sin mayusculas forzadas, igual que el label.
          <Toast.Action
            altText={actionAltText ?? actionLabel}
            onClick={onAction}
            className={snackbarAction({ tone: "primary" })}
          >
            {actionIcon}
            {actionLabel}
          </Toast.Action>
        )}
      </div>

      {shape === "bar" && (
        <div aria-hidden="true" className="h-[3px] w-full bg-[var(--colours-grayscale-dark-550)]">
          <div
            className={cn(
              "h-full origin-left bg-lime",
              finite && "animate-[tk-snackbar-countdown_linear_forwards] motion-reduce:animate-none",
            )}
            style={finite ? countdownStyle : undefined}
          />
        </div>
      )}
    </Toast.Root>
  );
});

/* -------------------------------------------------------------------------
 * Piezas sueltas, para componer un snackbar que no encaje en la API de arriba
 * ------------------------------------------------------------------------- */

export interface SnackbarActionProps
  extends React.ComponentPropsWithoutRef<"button">,
    VariantProps<typeof snackbarAction> {
  /**
   * Frase alternativa para quien no puede llegar al boton antes de que el
   * snackbar se vaya: "Deshacer el borrado del movimiento". Radix la exige.
   */
  altText: string;
}

/** Accion de un snackbar compuesto a mano. Cierra el snackbar al pulsarse. */
export const SnackbarAction = React.forwardRef<HTMLButtonElement, SnackbarActionProps>(
  function SnackbarAction({ className, tone, ...props }, ref) {
    return (
      <Toast.Action ref={ref} className={cn(snackbarAction({ tone }), className)} {...props} />
    );
  },
);

export interface SnackbarCloseProps
  extends React.ComponentPropsWithoutRef<"button">,
    VariantProps<typeof snackbarAction> {}

/** Cierre explicito. Sin `altText`, porque cerrar no es una accion recuperable. */
export const SnackbarClose = React.forwardRef<HTMLButtonElement, SnackbarCloseProps>(
  function SnackbarClose({ className, tone = "muted", ...props }, ref) {
    return <Toast.Close ref={ref} className={cn(snackbarAction({ tone }), className)} {...props} />;
  },
);
