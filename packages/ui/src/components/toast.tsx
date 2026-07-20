import * as React from "react";
import { Toast as ToastPrimitive } from "radix-ui";
import { cva } from "class-variance-authority";
import { cn } from "../lib/cn";

/* Seccion 17 · Toast — EXTENSION construida con los tokens del archivo.
 *
 * El propio documento lo etiqueta asi: "Extension construida con los tokens del
 * archivo". No hay componente Toast en el archivo de Figma (comprobado: no
 * existe nada parecido en docs/figma-export/components/), por lo que NADA de
 * este fichero debe citarse como especificacion aprobada.
 *
 * Aviso breve y no bloqueante que confirma algo YA HECHO y se va solo. Si hace
 * falta una decision, o hay riesgo, es un dialogo — no un toast.
 *
 * Geometria del bloque "VARIANTES · tinta 900 · r12 · sombra alta":
 *   superficie tinta 900 · r12 · padding 12/16 · gap 10 · Ubuntu Sans 14
 *   icono 17 (lima en exito, rojo suave en error) · separador 1x16 gris 550
 *   sombra 0 8px 24px -6px rgba(0,0,0,.35)
 *
 * POR QUE LA SUPERFICIE NO INVIERTE CON EL TEMA
 * ---------------------------------------------
 * Es la unica excepcion consciente a la regla "usa siempre tokens que
 * inviertan". El prototipo pinta el toast con --tk-ink-strong sobre
 * --tk-surface, que en oscuro darian un toast BLANCO con texto gris; y sin
 * embargo fija a mano el separador (rgb(52,52,52)) y los acentos (lima
 * rgb(133,255,133), rojo rgb(255,138,138)), que solo se leen sobre negro. El
 * toast real de la pagina lo confirma: usa var(--tk-on-accent), un token que
 * NO se redefine en .dark. O sea, el prototipo se contradice y la unica lectura
 * coherente es la del bloque "TINTA + LIMA": fondo tinta 900, texto blanco,
 * en los dos temas. Por eso aqui el fondo es --colours-grayscale-light-900
 * (= rgb(11,11,11), literalmente "tinta 900") y no un token semantico.
 * Precedente en el sistema: los rellenos pastel del Chip tampoco invierten.
 *
 * La superficie y la tinta viajan en --tk-toast-surface / --tk-toast-ink para
 * que el anillo de foco de la accion y el spinner puedan referirse a ellas sin
 * repetir el valor, y para que un consumidor pueda re-teñir el toast entero
 * cambiando dos variables en vez de pelearse con la especificidad.
 */

type ToastTone = "neutral" | "success" | "error" | "loading";

const toast = cva(
  [
    // La lista de toasts no captura clicks (ver ToastViewport); cada toast si.
    "pointer-events-auto relative inline-flex w-fit max-w-full items-center gap-2.5",
    "rounded-lg px-4 py-3 font-sans text-sm leading-[1.35]",
    "bg-[var(--tk-toast-surface)] text-[var(--tk-toast-ink)]",
    "[--tk-toast-ink:var(--colours-neutral-white)] [--tk-toast-surface:var(--colours-grayscale-light-900)]",
    // Sombra alta: el toast flota sobre todo, no es una tarjeta.
    "shadow-[0_8px_24px_-6px_rgba(0,0,0,0.35)]",
    // Radix hace el <li> enfocable (tabIndex 0) para poder alcanzarlo con F8.
    "outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-page",
    // Entrada y salida por transicion, no por @keyframes: sin keyframes propias
    // la salida se veria como un corte seco. Presence de Radix desmonta el nodo
    // en cuanto no hay animacion CSS corriendo, asi que la transicion de cierre
    // es cosmetica y nunca retiene el nodo en el DOM.
    "transition-[opacity,transform] duration-200 ease-out",
    "data-[state=closed]:translate-y-2 data-[state=closed]:opacity-0",
    // Arrastre hacia abajo para descartar: el toast va anclado abajo, asi que
    // la direccion natural es la del ToastProvider (swipeDirection="down").
    "data-[swipe=move]:translate-y-[var(--radix-toast-swipe-move-y)] data-[swipe=move]:transition-none",
    "data-[swipe=cancel]:translate-y-0",
    "data-[swipe=end]:translate-y-[var(--radix-toast-swipe-end-y)] data-[swipe=end]:opacity-0",
  ],
  {
    variants: {
      /* El tono solo cambia el icono. El rojo tiñe el icono de error, NUNCA el
         fondo — el fondo es siempre tinta 900. */
      tone: {
        neutral: "[--tk-toast-icon:var(--tk-toast-ink)]",
        success: "[--tk-toast-icon:var(--colours-limegreen-400)]",
        error: "[--tk-toast-icon:var(--colours-purered-400)]",
        loading: "[--tk-toast-icon:var(--tk-toast-ink)]",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

/* Los glifos van dibujados a mano, igual que la X del Chip: packages/ui no
 * depende de @phosphor-icons y este encargo no puede añadir dependencias. El
 * prototipo usa ph-fill ph-check-circle y ph-fill ph-warning-circle a 17px;
 * estos son su equivalente de trazo. Heredan currentColor y van ocultos al
 * lector: el mensaje del toast ya dice lo que ha pasado. Si tu app si tiene
 * Phosphor instalado, pasa el icono real por la prop `icon`. */
function CheckCircleGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8.2 12.3 2.6 2.6 5-5.8" />
    </svg>
  );
}

function WarningCircleGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.4v5.2" />
      <path d="M12 16.4h.01" />
    </svg>
  );
}

/* Spinner de 15 con borde de 2, igual que el del prototipo. El blanco al 30%
 * va literal y no por token: solo tiene sentido sobre la superficie fija tinta
 * 900, que es la unica que este componente pinta. */
function SpinnerGlyph() {
  return (
    <span
      aria-hidden="true"
      className="size-[15px] animate-spin rounded-full border-2 border-[rgba(255,255,255,0.3)] border-t-[var(--tk-toast-ink)]"
    />
  );
}

const GLIFO: Record<ToastTone, React.ReactNode> = {
  neutral: null,
  success: <CheckCircleGlyph />,
  error: <WarningCircleGlyph />,
  loading: <SpinnerGlyph />,
};

/* Duracion por tono y por presencia de accion. El documento dice
 * "auto-descarta a los ~2.5 s (mas si tiene accion)". Un toast con accion
 * necesita tiempo para leerlo Y para decidir, asi que sube a 5 s. */
const DURACION_BASE = 2500;
const DURACION_CON_ACCION = 5000;

/* POR QUE LOS TIPOS VAN ESCRITOS A MANO Y NO CON ComponentPropsWithoutRef
 * ----------------------------------------------------------------------
 * radix-ui@1.6.3 publica los .d.ts de sus namespaces con el CUERPO EN
 * JAVASCRIPT en vez de con declaraciones (mira
 * node_modules/radix-ui/dist/toast-*.d.ts: es el _mergeNamespaces tal cual).
 * Resultado: `typeof ToastPrimitive.Root` es `any`, y derivar de ahi no tipa
 * nada — peor aun, dentro de un forwardRef contagia el `any` a todas las props
 * desestructuradas y se pierde hasta la comprobacion de `tone`. Escribirlos
 * aqui es lo unico que da tipos de verdad sin añadir @radix-ui/react-toast como
 * dependencia directa. Si radix-ui arregla sus declaraciones, este es el sitio
 * donde volver.
 *
 * La contrapartida: los manejadores de arrastre (onSwipeStart/Move/Cancel/End)
 * no se exponen. El arrastre ya lo pinta el componente con los data-swipe-*, y
 * tiparlos a mano seria copiar el CustomEvent entero de Radix. */
export interface ToastProps extends Omit<
  React.ComponentPropsWithoutRef<"li">,
  "title" | "type" | "children"
> {
  /** Mensaje del toast. Una linea, en verbo hecho: "Envío completado". */
  children?: React.ReactNode;
  /** Visibilidad controlada. Sin ella el toast nace abierto. */
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
  /**
   * Tono del aviso. Solo cambia el icono: el fondo es siempre tinta 900.
   */
  tone?: ToastTone;
  /**
   * Icono antes del mensaje, a 17px. Por defecto lo pone el tono
   * (`success` check lima, `error` circulo rojo, `loading` spinner).
   * Pasa `null` para quitarlo.
   */
  icon?: React.ReactNode;
  /**
   * Accion opcional al final, separada por una linea de 1px. Espera un
   * `<ToastAction>`; su presencia alarga la duracion a 5 s.
   */
  action?: React.ReactNode;
}

/**
 * Toast del sistema Tikin — EXTENSION, no viene del archivo de Figma.
 *
 * Confirma algo ya hecho y desaparece solo: ~2,5 s, o 5 s si lleva accion. El
 * tono `loading` no se auto-descarta (duracion infinita) porque no confirma
 * nada todavia; sustituyelo por uno de exito o de error cuando termine la
 * operacion.
 *
 * REGLA DE UN SOLO TOAST: nunca hay dos a la vez, el nuevo reemplaza al
 * anterior. Radix apila todo lo que le pongas dentro del viewport, asi que esa
 * regla la sostiene el consumidor: manten un unico `<Toast>` en el arbol y
 * remontalo con `key` en cada aviso (asi ademas se reinicia el temporizador,
 * que es justo lo que se espera al reemplazar un toast por otro).
 *
 * El toast NUNCA bloquea: no atrapa el foco ni tapa la interaccion. Radix lo
 * anuncia por un nodo aparte con `role="status"`, y el `<li>` visible se
 * alcanza con F8 desde cualquier sitio.
 */
export const Toast = React.forwardRef<HTMLLIElement, ToastProps>(function Toast(
  { className, tone = "neutral", icon, action, duration, type, children, ...props },
  ref,
) {
  const glifo = icon === undefined ? GLIFO[tone] : icon;

  return (
    <ToastPrimitive.Root
      ref={ref}
      className={cn(toast({ tone, className }))}
      duration={
        duration ??
        (tone === "loading"
          ? // Radix trata Infinity como "sin temporizador"; un 0 caeria en la
            // duracion del Provider por su comprobacion `duration || context.duration`.
            Infinity
          : action
            ? DURACION_CON_ACCION
            : DURACION_BASE)
      }
      /* `foreground` interrumpe al lector de pantalla; `background` espera su
         turno. Interrumpir se reserva a lo que el usuario tiene que atender —
         un error o algo que puede deshacer. Confirmar un copiado no lo es. */
      type={type ?? (tone === "error" || action ? "foreground" : "background")}
      {...props}
    >
      {glifo != null && (
        <span
          aria-hidden="true"
          className="inline-flex shrink-0 items-center justify-center text-[var(--tk-toast-icon)] [&_svg]:size-[17px] [&_svg]:shrink-0"
        >
          {glifo}
        </span>
      )}
      {/* El mensaje entero es el Title de Radix: es lo que se anuncia. Sin
          Title ni Description, Radix no tendria nada que leer en voz alta. */}
      <ToastPrimitive.Title className="min-w-0">{children}</ToastPrimitive.Title>
      {action != null && (
        <>
          {/* Separador de 1x16 en gris 550. Decorativo: la accion ya es un
              boton con su propio nombre accesible. */}
          <span
            aria-hidden="true"
            className="h-4 w-px shrink-0 bg-[var(--colours-grayscale-dark-550)]"
          />
          {action}
        </>
      )}
    </ToastPrimitive.Root>
  );
});

export interface ToastProviderProps {
  children?: React.ReactNode;
  /** Palabra que el lector de pantalla antepone a cada aviso. */
  label?: string;
  /** Duracion por defecto de los toasts que no la declaren. */
  duration?: number;
  /** Direccion del arrastre que descarta. */
  swipeDirection?: "up" | "down" | "left" | "right";
  /** Pixeles de arrastre necesarios para descartar. */
  swipeThreshold?: number;
}

/**
 * Contexto de los toasts. Va una sola vez, lo mas arriba posible de la app.
 *
 * Cambia tres valores por defecto de Radix: duracion 2,5 s (la del documento,
 * no los 5 s de Radix), arrastre hacia abajo — el toast esta anclado abajo, asi
 * que hacia arriba lucharia contra su propia posicion — y etiqueta en
 * castellano, que es la que oye el usuario de lector de pantalla.
 */
export function ToastProvider({
  duration = DURACION_BASE,
  swipeDirection = "down",
  label = "Notificación",
  ...props
}: ToastProviderProps) {
  return (
    <ToastPrimitive.Provider
      duration={duration}
      swipeDirection={swipeDirection}
      label={label}
      {...props}
    />
  );
}

export interface ToastViewportProps extends React.ComponentPropsWithoutRef<"ol"> {
  /** Atajo que lleva el foco a la lista. Por defecto F8, el de Radix. */
  hotkey?: string[];
  /** Etiqueta de la region. `{hotkey}` se sustituye por el atajo. */
  label?: string;
}

/**
 * Sitio donde aparecen los toasts: abajo y centrado.
 *
 * A 28px del borde inferior, que es lo que usa el toast real del documento. El
 * bloque POSICION lo enseña "sobre la barra": si tu pantalla tiene barra de
 * navegacion inferior, subelo por `className` (con una barra de 64 el
 * documento lo deja a 80).
 *
 * La lista no captura clicks — solo los toasts que hay dentro — para no dejar
 * una banda muerta cruzando la parte baja de la pantalla.
 */
export const ToastViewport = React.forwardRef<HTMLOListElement, ToastViewportProps>(
  function ToastViewport({ className, label = "Notificaciones ({hotkey})", ...props }, ref) {
    return (
      <ToastPrimitive.Viewport
        ref={ref}
        label={label}
        className={cn(
          "pointer-events-none fixed left-1/2 z-50 m-0 flex -translate-x-1/2 list-none flex-col items-center gap-2 p-0",
          // La safe-area evita que en un movil con gesto inferior el toast
          // quede pisado por la barra del sistema.
          "bottom-[calc(28px+env(safe-area-inset-bottom,0px))] max-w-[calc(100vw-32px)]",
          "outline-none",
          className,
        )}
        {...props}
      />
    );
  },
);

export interface ToastActionProps extends React.ComponentPropsWithoutRef<"button"> {
  /**
   * Frase alternativa para quien no puede llegar al boton antes de que el toast
   * se vaya: "Deshacer el borrado del movimiento". Radix la exige.
   */
  altText: string;
}

/**
 * Accion del toast — DESHACER, REINTENTAR. Al pulsarla el toast se cierra.
 *
 * `altText` es obligatorio en Radix y no es decorativo: es la frase que oye
 * quien no puede llegar al boton a tiempo antes de que el toast se vaya
 * ("Deshacer el borrado del movimiento").
 *
 * El label se pone en MAYUSCULAS por CSS, nunca con `.toUpperCase()`: eso
 * romperia el nombre accesible y lo que se copia al portapapeles.
 */
export const ToastAction = React.forwardRef<HTMLButtonElement, ToastActionProps>(
  function ToastAction({ className, ...props }, ref) {
    return (
      <ToastPrimitive.Action
        ref={ref}
        className={cn(
          "inline-flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap",
          "font-mono text-sm font-normal tracking-[0.02em] uppercase",
          /* Lima, no blanco. El prototipo pinta la accion en blanco, pero el
             bloque "TINTA + LIMA" dice literalmente "acento lima para lo
             positivo y la accion", y en blanco la accion se confunde con el
             mensaje: sobre una superficie monocroma el unico elemento pulsable
             tiene que distinguirse por color. */
          "text-lime transition-opacity duration-140 ease-out hover:opacity-80",
          "outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--tk-toast-surface)]",
          "[&_svg]:size-[14px] [&_svg]:shrink-0",
          className,
        )}
        {...props}
      />
    );
  },
);
