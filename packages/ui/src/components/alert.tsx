import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/* Seccion 25 · Alerts — EXTENSION construida con la paleta de feedback del
 * sistema. El propio documento lo etiqueta asi ("Extension con la paleta de
 * feedback del sistema") y el export de Figma lo confirma: en
 * docs/figma-export/components/ no existe ningun cuerpo de Alert. No hay, por
 * tanto, especificacion aprobada detras de estas medidas — vienen del
 * prototipo del documento, no del archivo.
 *
 * Que es y que no es:
 *   Alert  aviso inline y PERSISTENTE dentro del contenido. Vive en la pagina
 *          y se queda hasta que se resuelve. Puede llevar accion.
 *   Toast  confirma algo ya hecho y se va solo. No es este componente.
 *
 * MEDIDAS DEL PROTOTIPO (atributos style= del documento, no del texto)
 * -------------------------------------------------------------------
 *   contenedor  padding 14 16 · radio 12 · gap 12 · align flex-start
 *               fondo var(--tk-tint-{tono}) · overflow hidden
 *   icono       20px · color var(--tk-fg-{tono}) · margin-top 1
 *   titulo      Funnel Display 500 · 14.5px · var(--tk-ink)
 *   cuerpo      Ubuntu Sans 13.5px · line-height 1.5 · var(--tk-800)
 *   accion      alto 36 · px 16 · radio 10 · ink/surface · mono 12 · +2% track
 *   cerrar      24x24 · radio 6 · transparente · var(--tk-600)
 *
 * SIN BARRA DE ACENTO LATERAL Y SIN FONDO SATURADO, a proposito: la regla
 * "TINT SUAVE" del documento lo dice explicitamente. El color pleno del hue
 * solo aparece en el icono.
 *
 * TEMA OSCURO
 * -----------
 * --tk-tint-* y --tk-fg-* son la capa semantica del sistema y si invierten con
 * el tema, asi que las utilidades bg-tint-* / text-fg-* valen en los dos modos
 * sin excepciones. No hay aqui ningun token --alert-* de Figma del que
 * desviarse porque el archivo no define el componente.
 */

/* Cada tono publica su par de colores en dos variables locales en vez de
 * pintarlos directamente. Motivo: los glifos son de relleno solido y necesitan
 * recortar la marca interior con el color del FONDO del alert. Sin la variable,
 * el icono tendria que recibir el tono por prop y un icono personalizado del
 * consumidor no podria hacer ese recorte. */
const alert = cva(
  [
    "flex items-start gap-3 overflow-hidden rounded-lg px-4 py-[14px]",
    // El texto de un alert es prosa: nunca mono, nunca mayusculas.
    "font-sans",
  ],
  {
    variants: {
      tone: {
        info: "bg-tint-info [--tk-alert-bg:var(--tk-tint-info)] [--tk-alert-fg:var(--tk-fg-info)]",
        success:
          "bg-tint-success [--tk-alert-bg:var(--tk-tint-success)] [--tk-alert-fg:var(--tk-fg-success)]",
        warning:
          "bg-tint-warning [--tk-alert-bg:var(--tk-tint-warning)] [--tk-alert-fg:var(--tk-fg-warning)]",
        error:
          "bg-tint-error [--tk-alert-bg:var(--tk-tint-error)] [--tk-alert-fg:var(--tk-fg-error)]",
      },
    },
    defaultVariants: { tone: "info" },
  },
);

type AlertVariants = VariantProps<typeof alert>;
type AlertTone = NonNullable<AlertVariants["tone"]>;

/* Iconos dibujados a mano. packages/ui no depende de @phosphor-icons y este
 * encargo no puede añadir dependencias; el prototipo usa ph-fill ph-info,
 * ph-fill ph-check-circle, ph-fill ph-warning y ph-fill ph-x-circle, asi que
 * estos son sus equivalentes de relleno.
 *
 * La marca interior se pinta con --tk-alert-bg (el tint del propio alert) en
 * lugar de recortarla con fill-rule: asi el glifo funciona en los dos temas sin
 * saber en cual esta, y basta con que el contenedor declare la variable. */
const TRAZO = {
  stroke: "var(--tk-alert-bg)",
  strokeWidth: 1.9,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function GlifoInfo() {
  return (
    <>
      <circle cx="10" cy="10" r="9" fill="currentColor" />
      <circle cx="10" cy="5.9" r="1.15" fill="var(--tk-alert-bg)" />
      <path d="M10 9.1v5.2" fill="none" {...TRAZO} />
    </>
  );
}

function GlifoSuccess() {
  return (
    <>
      <circle cx="10" cy="10" r="9" fill="currentColor" />
      <path d="m5.9 10.2 2.7 2.7 5.5-5.5" fill="none" {...TRAZO} />
    </>
  );
}

function GlifoWarning() {
  return (
    <>
      <path
        d="M8.63 2.6a1.6 1.6 0 0 1 2.74 0l7.2 12.6a1.6 1.6 0 0 1-1.37 2.4H2.8a1.6 1.6 0 0 1-1.37-2.4Z"
        fill="currentColor"
      />
      <path d="M10 7.4v4.3" fill="none" {...TRAZO} />
      <circle cx="10" cy="14.5" r="1.15" fill="var(--tk-alert-bg)" />
    </>
  );
}

function GlifoError() {
  return (
    <>
      <circle cx="10" cy="10" r="9" fill="currentColor" />
      <path d="m7.2 7.2 5.6 5.6M12.8 7.2l-5.6 5.6" fill="none" {...TRAZO} />
    </>
  );
}

const GLIFO: Record<AlertTone, () => React.JSX.Element> = {
  info: GlifoInfo,
  success: GlifoSuccess,
  warning: GlifoWarning,
  error: GlifoError,
};

/** X de cerrar. 15px en el prototipo, de trazo (ph ph-x), no de relleno. */
function GlifoCerrar() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      // El nombre accesible lo pone el aria-label del boton que lo envuelve.
      aria-hidden="true"
    >
      <path d="M4 4 12 12M12 4 4 12" />
    </svg>
  );
}

export interface AlertProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "title" | "color">, AlertVariants {
  /**
   * Titulo del aviso, en Funnel Display 500.
   *
   * Ojo con el nombre: sombrea el atributo HTML `title` (el tooltip nativo), y
   * por eso el tipo lo omite de las props del div. Un tooltip sobre un aviso
   * persistente no aporta nada y confundiria las dos cosas.
   */
  title?: React.ReactNode;
  /**
   * Sustituye el icono de tono por otro. Hereda el color pleno del hue via
   * currentColor y puede recortar su marca interior con `var(--tk-alert-bg)`.
   */
  icon?: React.ReactNode;
  /** Oculta el icono por completo. */
  hideIcon?: boolean;
  /**
   * Accion opcional a la derecha. Pensada para un `<AlertAction>`, que ya trae
   * las medidas del documento; acepta cualquier nodo si hace falta otra cosa.
   */
  action?: React.ReactNode;
  /**
   * Hace el alert descartable y pinta la X. El componente NO se oculta solo:
   * quien lo usa decide si desaparece o si se puede restaurar — el propio
   * documento demuestra el caso con un boton RESTAURAR.
   */
  onDismiss?: () => void;
  /** Nombre accesible del boton de cerrar. */
  dismissLabel?: string;
}

/**
 * Alert del sistema Tikin — EXTENSION construida con la paleta de feedback.
 *
 * Aviso inline que vive en la pagina hasta que se resuelve. A diferencia del
 * toast no se va solo y puede llevar accion.
 *
 * Fondo en el tint del hue, icono en el color pleno y texto en tinta. Sin barra
 * de acento lateral ni fondos saturados.
 */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  {
    className,
    tone = "info",
    title,
    icon,
    hideIcon = false,
    action,
    onDismiss,
    dismissLabel = "Descartar",
    role,
    children,
    ...props
  },
  ref,
) {
  const Glifo = GLIFO[tone ?? "info"];

  /* Por que el rol depende del tono:
   *
   * role="alert" es una region viva ASERTIVA — interrumpe lo que el lector de
   * pantalla este diciendo. Eso esta justificado cuando algo ha fallado o hay
   * que actuar (error, warning), y es ruido gratuito para un acuse de recibo
   * (success) o un dato de contexto (info), donde role="status" anuncia igual
   * pero espera su turno.
   *
   * Se puede sobreescribir con la prop `role` para los casos raros: un alert de
   * error que ya estaba en la pagina antes de que el usuario llegara no deberia
   * interrumpir nada. */
  const rolFinal = role ?? (tone === "error" || tone === "warning" ? "alert" : "status");

  return (
    <div ref={ref} role={rolFinal} className={cn(alert({ tone, className }))} {...props}>
      {!hideIcon &&
        (icon ?? (
          <svg
            viewBox="0 0 20 20"
            width="20"
            height="20"
            // margin-top 1: alinea la optica del glifo con la primera linea del
            // titulo, que es 14.5px y no llena los 20 del icono.
            className="mt-px shrink-0 text-[var(--tk-alert-fg)]"
            aria-hidden="true"
          >
            <Glifo />
          </svg>
        ))}

      {/* min-w-0 es obligatorio: sin el, un hijo flex no baja de su ancho de
          contenido y un cuerpo largo desbordaria el alert en vez de partirse. */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        {title !== undefined && title !== null && (
          <span className="font-display text-[14.5px] font-medium text-ink">{title}</span>
        )}
        {children !== undefined && children !== null && (
          <span className="text-[13.5px] leading-[1.5] text-ink-800">{children}</span>
        )}
      </div>

      {/* Centrada respecto al bloque de texto, no arriba: es la unica pieza del
          alert que el documento alinea con align-self:center. */}
      {action && <div className="shrink-0 self-center">{action}</div>}

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          // Boton real: alcanzable con Tab y activable con Enter y Espacio sin
          // escribir un solo manejador de teclado. El bloque "TIPOS ·
          // REFERENCIA" del documento dibuja aqui un <i> suelto, que no seria
          // alcanzable por teclado; manda el bloque en vivo, que si usa boton.
          aria-label={dismissLabel}
          className={cn(
            "mt-px inline-flex size-6 shrink-0 cursor-pointer items-center justify-center self-start rounded-xs",
            "bg-transparent text-ink-600 transition-colors duration-140 ease-out",
            // Hover y foco no estan en el prototipo: sin ellos el boton no da
            // ninguna señal de que es pulsable ni de donde esta el foco.
            "hover:text-ink",
            "outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--tk-alert-bg)]",
          )}
        >
          <GlifoCerrar />
        </button>
      )}
    </div>
  );
});

/* -------------------------------------------------------------------------- */

export type AlertActionProps = React.ComponentPropsWithoutRef<"button">;

/**
 * Boton de accion del Alert — EXTENSION, medidas del prototipo de la seccion 25.
 *
 * Alto 36, radio 10 y mono 12: no coincide con ningun tamaño de `Button` (S es
 * 32/r8 y M es 40/r10), asi que se implementa aqui en vez de reutilizarlo. Es
 * deliberadamente pequeño y sin variantes: si un aviso necesita dos acciones o
 * una jerarquia, ya no es un alert.
 *
 * El label va en MAYUSCULAS por CSS, nunca con `.toUpperCase()` en JS: eso
 * romperia el texto que anuncia el lector de pantalla y lo que el usuario copia
 * al portapapeles.
 */
export const AlertAction = React.forwardRef<HTMLButtonElement, AlertActionProps>(
  function AlertAction({ className, type, children, ...props }, ref) {
    return (
      <button
        ref={ref}
        // Sin type explicito un <button> envia el formulario que lo contenga, y
        // un alert de validacion vive justo dentro de formularios.
        type={type ?? "button"}
        className={cn(
          "inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md px-4",
          "bg-ink whitespace-nowrap text-surface",
          "font-mono text-xs font-normal tracking-[0.02em] uppercase",
          "transition-colors duration-140 ease-out hover:not-disabled:bg-ink-800",
          "outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--tk-alert-bg)]",
          "disabled:cursor-not-allowed disabled:bg-edge disabled:text-ink-400",
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);
