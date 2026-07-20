import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/* Seccion 38 · Banners — EXTENSION construida con la paleta del sistema.
 *
 * El propio documento lo etiqueta asi ("Extension con la paleta del sistema") y
 * el export de Figma lo confirma: en docs/figma-export/components/ no existe
 * ningun cuerpo de Banner. Las medidas de abajo vienen del prototipo del
 * documento, NO son especificacion aprobada del archivo.
 *
 * Banner vs Alert — la pregunta que decide cual usar:
 *   Banner  global y de ancho completo, borde a borde, anclado ARRIBA de la
 *           app. Anuncios, promociones y avisos de sistema. Uno a la vez.
 *   Alert   inline, dentro de una tarjeta o de un formulario. Puede haber
 *           varios y viven junto al contenido al que se refieren.
 *
 * MEDIDAS DEL PROTOTIPO (atributos style= del documento, no del texto)
 * -------------------------------------------------------------------
 *   contenedor  padding 14 18 · gap 12 · ancho completo · sin radio
 *               (los ejemplos de la seccion usan radio 12 porque estan metidos
 *                dentro de una tarjeta de muestra: eso es la prop `rounded`)
 *   icono       18px · color pleno del tono
 *   mensaje     14px
 *   descripcion 12.5px, tinta apagada (doble linea)
 *   accion      mono 12 · +2% track · pill r8 px16 en promo · subrayada en el
 *               resto (px 0, como en el documento)
 *   cerrar      30x30 · r8 · X de 16
 *
 * TONOS
 *   promo     tinta, CTA en pill claro. Nunca texto verde: el verde es del
 *             icono, no del enlace.
 *   info      lavanda   success  verde    system  ambar    critical  rojo
 *   neutral   surface-2. No esta en la lista de cinco tipos, pero el bloque
 *             "OTROS FORMATOS · progreso" del documento dibuja exactamente eso
 *             (fondo surface-2 + spinner), asi que necesita un tono propio.
 *
 * CRITICO NO SE DESCARTA — regla del documento ("Los avisos criticos o
 * bloqueantes no llevan X y permanecen hasta resolverse"). Se aplica en codigo:
 * con tone="critical" la X no se pinta aunque se pase onDismiss. Es una regla
 * de producto, no una sugerencia de estilo, y dejarla al criterio de cada
 * pantalla la rompe el primer dia.
 *
 * TEMA OSCURO
 * -----------
 * --tk-tint-* y --tk-fg-* invierten con el tema, asi que los cinco tonos claros
 * valen en los dos modos sin tocar nada. El promo usa el par bg-ink/text-surface
 * —el mismo que el boton primario— y por tanto tambien invierte: en oscuro pasa
 * a ser una franja clara con texto oscuro.
 *
 * Ese giro obliga a mover el verde del icono: --colours-limegreen-400
 * (rgb 133,255,133) luce sobre la franja de tinta del tema claro, pero en oscuro
 * quedaria verde claro sobre gris claro. En oscuro se sustituye por
 * --tk-tint-success, que ahi vale rgb(20,44,24) — verde oscuro, contraste
 * correcto contra la franja clara. Es el unico token verde del sistema que
 * ofrece esa cara oscura.
 */

/* Vars locales por tono en vez de colores sueltos: la accion (BannerAction) es
 * un componente aparte y los glifos de relleno tienen que recortar su marca
 * interior con el color del FONDO del banner. Ambos leen estas variables del
 * contenedor sin recibir el tono por prop, asi que un icono o una accion del
 * consumidor encajan igual. */

/** Vars compartidas por los cinco tonos de fondo claro (todos menos promo). */
const CLARO = [
  "text-ink",
  "[--tk-banner-muted:var(--tk-600)]",
  "[--tk-banner-ring:var(--tk-ink)]",
  "[--tk-banner-x:var(--tk-600)]",
  "[--tk-banner-x-fg-hover:var(--tk-ink)]",
  "[--tk-banner-x-bg-hover:color-mix(in_oklab,var(--tk-ink)_10%,transparent)]",
  // El bloque en vivo del documento da a la X un par hover/press
  // (0.14 / 0.24 sobre la franja de tinta); aqui se traslada a tinta sobre
  // fondo claro manteniendo la misma proporcion entre los dos estados.
  "[--tk-banner-x-bg-active:color-mix(in_oklab,var(--tk-ink)_18%,transparent)]",
  // Accion subrayada, sin caja: es lo que dibuja el documento en los tonos
  // claros. El hover se resuelve bajando la opacidad porque sin padding no hay
  // superficie que teñir.
  "[--tk-banner-action-bg:transparent]",
  "[--tk-banner-action-bg-hover:transparent]",
  "[--tk-banner-action-bg-active:transparent]",
  "[--tk-banner-action-fg:var(--tk-ink)]",
  "[--tk-banner-action-px:0px]",
  "[--tk-banner-action-line:underline]",
  "[--tk-banner-action-opacity-hover:0.7]",
];

const banner = cva(
  [
    "flex w-full gap-3 px-[18px] py-[14px]",
    // El mensaje de un banner es prosa: nunca mono, nunca mayusculas. La unica
    // pieza mono es la accion.
    "font-sans",
  ],
  {
    variants: {
      tone: {
        promo: [
          "bg-ink text-surface",
          "[--tk-banner-bg:var(--tk-ink)]",
          /* Ver cabecera: en oscuro la franja se aclara y el lima deja de leerse.
           * El valor por tema va por una variable APARTE, igual que hace tabs.tsx
           * con `--tk-tab-soft-active`: si el tono publicase dos veces
           * `--tk-banner-icon` bajo modificadores distintos, tailwind-merge solo
           * descartaria la version sin modificador y en oscuro seguiria mandando
           * la nuestra — el consumidor no podria repintar el icono. Con la
           * indireccion, un `[--tk-banner-icon:...]` del consumidor sustituye a
           * la declaracion base y gana en los dos temas. */
          "[--tk-banner-icon:var(--tk-banner-icon-tema,var(--colours-limegreen-400))]",
          "dark:[--tk-banner-icon-tema:var(--tk-tint-success)]",
          "[--tk-banner-muted:color-mix(in_oklab,var(--tk-surface)_75%,transparent)]",
          "[--tk-banner-ring:var(--tk-surface)]",
          "[--tk-banner-x:color-mix(in_oklab,var(--tk-surface)_70%,transparent)]",
          "[--tk-banner-x-fg-hover:var(--tk-surface)]",
          "[--tk-banner-x-bg-hover:color-mix(in_oklab,var(--tk-surface)_15%,transparent)]",
          // data-press="rgba(255,255,255,0.24)" del bloque en vivo, en semantico:
          // sobre la franja de tinta el blanco del prototipo es --tk-surface.
          "[--tk-banner-x-bg-active:color-mix(in_oklab,var(--tk-surface)_24%,transparent)]",
          // CTA en pill claro. Hover y pressed salen de los data-hover/data-press
          // del bloque en vivo del documento.
          "[--tk-banner-action-bg:var(--tk-surface)]",
          "[--tk-banner-action-bg-hover:var(--tk-border)]",
          "[--tk-banner-action-bg-active:var(--tk-border-2)]",
          "[--tk-banner-action-fg:var(--tk-ink)]",
          "[--tk-banner-action-px:16px]",
          "[--tk-banner-action-line:none]",
          "[--tk-banner-action-opacity-hover:1]",
        ],
        info: [
          ...CLARO,
          "bg-tint-info",
          "[--tk-banner-bg:var(--tk-tint-info)]",
          "[--tk-banner-icon:var(--tk-fg-info)]",
        ],
        success: [
          ...CLARO,
          "bg-tint-success",
          "[--tk-banner-bg:var(--tk-tint-success)]",
          "[--tk-banner-icon:var(--tk-fg-success)]",
        ],
        system: [
          ...CLARO,
          "bg-tint-warning",
          "[--tk-banner-bg:var(--tk-tint-warning)]",
          "[--tk-banner-icon:var(--tk-fg-warning)]",
        ],
        critical: [
          ...CLARO,
          "bg-tint-error",
          "[--tk-banner-bg:var(--tk-tint-error)]",
          "[--tk-banner-icon:var(--tk-fg-error)]",
        ],
        neutral: [
          ...CLARO,
          "bg-surface-2",
          "[--tk-banner-bg:var(--tk-surface-2)]",
          "[--tk-banner-icon:var(--tk-ink)]",
        ],
      },

      /* Por defecto va a hueso, borde a borde bajo la barra de estado. El radio
         12 es para cuando el banner se muestra dentro de un contenedor —que es
         como lo dibuja la propia seccion en sus ejemplos. */
      rounded: { true: "rounded-lg", false: "rounded-none" },

      /* Con dos lineas todo sube arriba, igual que en el bloque "doble linea"
         del documento. */
      align: { center: "items-center", start: "items-start" },
    },

    defaultVariants: { tone: "promo", rounded: false, align: "center" },
  },
);

type BannerVariants = VariantProps<typeof banner>;
type BannerTone = NonNullable<BannerVariants["tone"]>;

/* Iconos dibujados a mano. packages/ui no depende de @phosphor-icons y este
 * encargo no puede añadir dependencias; el prototipo usa ph-fill ph-sparkle,
 * ph-fill ph-info, ph-fill ph-check-circle, ph-fill ph-warning-circle y
 * ph-fill ph-warning, asi que estos son sus equivalentes de relleno.
 *
 * La marca interior se pinta con --tk-banner-bg (el fondo del propio banner) en
 * vez de recortarla con fill-rule: asi el glifo funciona en los dos temas sin
 * saber en cual esta. */
const TRAZO = {
  stroke: "var(--tk-banner-bg)",
  strokeWidth: 1.9,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function GlifoSparkle() {
  return (
    <path
      d="M10 .8c0 5.08 4.12 9.2 9.2 9.2-5.08 0-9.2 4.12-9.2 9.2 0-5.08-4.12-9.2-9.2-9.2 5.08 0 9.2-4.12 9.2-9.2Z"
      fill="currentColor"
    />
  );
}

function GlifoInfo() {
  return (
    <>
      <circle cx="10" cy="10" r="9" fill="currentColor" />
      <circle cx="10" cy="5.9" r="1.15" fill="var(--tk-banner-bg)" />
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

/** Circulo con admiracion: el ph-warning-circle del bloque de doble linea. */
function GlifoSystem() {
  return (
    <>
      <circle cx="10" cy="10" r="9" fill="currentColor" />
      <path d="M10 5.4v5" fill="none" {...TRAZO} />
      <circle cx="10" cy="13.8" r="1.15" fill="var(--tk-banner-bg)" />
    </>
  );
}

/** Triangulo: el aviso bloqueante se distingue del de sistema por la silueta,
 *  no solo por el color. */
function GlifoCritical() {
  return (
    <>
      <path
        d="M8.63 2.6a1.6 1.6 0 0 1 2.74 0l7.2 12.6a1.6 1.6 0 0 1-1.37 2.4H2.8a1.6 1.6 0 0 1-1.37-2.4Z"
        fill="currentColor"
      />
      <path d="M10 7.4v4.3" fill="none" {...TRAZO} />
      <circle cx="10" cy="14.5" r="1.15" fill="var(--tk-banner-bg)" />
    </>
  );
}

const GLIFO: Record<BannerTone, () => React.JSX.Element> = {
  promo: GlifoSparkle,
  info: GlifoInfo,
  success: GlifoSuccess,
  system: GlifoSystem,
  critical: GlifoCritical,
  // El tono neutro sirve al formato "progreso", que ya lleva spinner en vez de
  // icono. Si alguien lo usa sin `loading`, un circulo de informacion es lo
  // menos ruidoso.
  neutral: GlifoInfo,
};

/** X de cerrar. 16px en el prototipo, de trazo (ph ph-x), no de relleno. */
function GlifoCerrar() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
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

export interface BannerProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "color">, Omit<BannerVariants, "align"> {
  /**
   * Segunda linea, mas pequeña y en tinta apagada. Activa el formato de doble
   * linea del documento: todo el contenido se alinea arriba.
   */
  description?: React.ReactNode;
  /**
   * Sustituye el icono del tono. Va envuelto en un hueco que publica el color
   * pleno del tono, asi que un glifo con `fill="currentColor"` sale del color
   * que le toca y puede recortar su marca interior con `var(--tk-banner-bg)`.
   * Se puede repintar poniendole un color propio al nodo.
   */
  icon?: React.ReactNode;
  /** Oculta el icono por completo. */
  hideIcon?: boolean;
  /**
   * Cambia el icono por un spinner y marca el banner como `aria-busy`. Es el
   * formato "progreso" de la seccion, pensado con `tone="neutral"`.
   */
  loading?: boolean;
  /**
   * Unica accion del banner. Pensada para un `<BannerAction>`, que ya lee los
   * colores del tono; acepta cualquier nodo si hace falta otra cosa.
   *
   * Una sola: si un aviso necesita dos acciones, ya no es un banner.
   */
  action?: React.ReactNode;
  /**
   * Pinta la X y avisa al pulsarla. El banner NO se oculta solo: quien lo usa
   * decide si desaparece o si se puede volver a mostrar — el propio documento
   * demuestra el caso con un boton MOSTRAR DE NUEVO.
   *
   * La "salida animada" que menciona el pie del bloque en vivo es por tanto del
   * consumidor, no del componente: animar la salida exige retrasar el
   * desmontaje, y quien monta es quien puede retrasarlo. Si el Banner se
   * quedase montado para animarse, quitaria a la pantalla el control de su
   * propio arbol. La story "En vivo · descartable" enseña el patron.
   *
   * Se ignora con `tone="critical"`: los avisos bloqueantes no se descartan.
   */
  onDismiss?: () => void;
  /** Nombre accesible del boton de cerrar. */
  dismissLabel?: string;
}

/**
 * Banner del sistema Tikin — EXTENSION construida con la paleta del sistema.
 *
 * Franja de ancho completo anclada arriba de la app: anuncios, promociones y
 * avisos de sistema. Solo uno activo a la vez.
 *
 * Una sola accion y la X para descartar. El critico no lleva X: se queda hasta
 * que se resuelve.
 */
export const Banner = React.forwardRef<HTMLDivElement, BannerProps>(function Banner(
  {
    className,
    tone = "promo",
    rounded = false,
    description,
    icon,
    hideIcon = false,
    loading = false,
    action,
    onDismiss,
    dismissLabel = "Descartar",
    role,
    children,
    ...props
  },
  ref,
) {
  const tonoFinal: BannerTone = tone ?? "promo";
  const Glifo = GLIFO[tonoFinal];

  /* Regla "CRITICO SE FIJA" del documento, aplicada en codigo y no solo
   * documentada: un aviso bloqueante que se puede cerrar deja de ser
   * bloqueante. */
  const descartable = onDismiss !== undefined && tonoFinal !== "critical";

  /* Por que el rol depende del tono:
   *
   * role="alert" es una region viva ASERTIVA: interrumpe lo que el lector de
   * pantalla este diciendo. Un banner suele estar ya presente al cargar la
   * pantalla, asi que interrumpir por una promo o por un aviso de mantenimiento
   * es ruido gratuito; role="status" lo anuncia igual pero espera su turno.
   * Solo el critico, que bloquea al usuario, justifica interrumpir.
   *
   * Ojo: aqui `system` NO usa role="alert" aunque en Alert el tono `warning` si
   * lo haga. La diferencia es la ubicacion, no el color: el alert aparece como
   * consecuencia de algo que el usuario acaba de hacer; el banner ya estaba.
   *
   * Se puede sobreescribir con la prop `role`. */
  const rolFinal = role ?? (tonoFinal === "critical" ? "alert" : "status");

  /* Una cadena vacia NO es una segunda linea. Es el caso tipico cuando el texto
   * viene de una API o de un estado sin cargar, y comprobar solo undefined/null
   * pintaba un <span> vacio y ademas descolgaba icono, accion y X hacia arriba
   * con el `items-start` del formato de doble linea. Se comprueban los vacios
   * uno a uno en vez de por veracidad para no perder un `0` legitimo. */
  const tieneDescripcion =
    description !== undefined &&
    description !== null &&
    description !== false &&
    description !== "";

  return (
    <div
      ref={ref}
      role={rolFinal}
      aria-busy={loading || undefined}
      className={cn(
        banner({
          tone: tonoFinal,
          rounded,
          align: tieneDescripcion ? "start" : "center",
          className,
        }),
      )}
      {...props}
    >
      {!hideIcon &&
        (loading ? (
          <span
            // 18px, borde 2 y cabeza en el color del texto: el spinner del
            // bloque "progreso". Usa currentColor para no depender del tono.
            className="size-[18px] shrink-0 animate-spin rounded-full border-2 border-[color-mix(in_oklab,currentColor_25%,transparent)] border-t-current"
            aria-hidden="true"
          />
        ) : icon !== undefined && icon !== null ? (
          /* El icono del consumidor va en un hueco que publica el color pleno
           * del tono. Sin el, `currentColor` dentro del icono seria el color del
           * MENSAJE (surface en promo, ink en los claros) y un glifo que siguiera
           * la documentacion saldria blanco o tinta en vez de lima, lavanda,
           * verde, ambar o rojo. `shrink-0` es el `flex:none` que el prototipo
           * pone en el icono y que la rama por defecto ya llevaba: sin el, un
           * icono ancho se aplasta cuando el mensaje es largo.
           *
           * Sin `aria-hidden` a proposito: el nodo es del consumidor y puede
           * querer nombre propio. El glifo por defecto si es decorativo porque el
           * mensaje ya dice lo mismo. */
          <span className="inline-flex shrink-0 text-[var(--tk-banner-icon)]">{icon}</span>
        ) : (
          <svg
            viewBox="0 0 20 20"
            width="18"
            height="18"
            className="shrink-0 text-[var(--tk-banner-icon)]"
            aria-hidden="true"
          >
            <Glifo />
          </svg>
        ))}

      {/* min-w-0 es obligatorio: sin el, un hijo flex no baja de su ancho de
          contenido y un mensaje largo desbordaria el banner en vez de partirse. */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-sm">{children}</span>
        {tieneDescripcion && (
          <span className="text-[12.5px] leading-[1.5] text-[var(--tk-banner-muted)]">
            {description}
          </span>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}

      {descartable && (
        <button
          type="button"
          onClick={onDismiss}
          // Boton real: alcanzable con Tab y activable con Enter y Espacio sin
          // escribir un solo manejador de teclado. Los bloques "POR TIPO" y
          // "OTROS FORMATOS" del documento dibujan aqui un <i> suelto, que no
          // seria alcanzable por teclado; manda el bloque en vivo, que si usa
          // boton.
          aria-label={dismissLabel}
          className={cn(
            "inline-flex size-[30px] shrink-0 cursor-pointer items-center justify-center rounded-sm",
            "bg-transparent text-[var(--tk-banner-x)] transition-colors duration-140 ease-out",
            "hover:bg-[var(--tk-banner-x-bg-hover)] hover:text-[var(--tk-banner-x-fg-hover)]",
            // El bloque en vivo da a la X los dos estados (data-hover y
            // data-press), igual que a la accion. Sin el pressed, la X se queda
            // muda al pulsarla en pantalla tactil, donde no hay hover.
            "active:bg-[var(--tk-banner-x-bg-active)]",
            // El foco no esta en el prototipo: sin el no hay forma de saber
            // donde esta el teclado. El anillo toma el color del texto del tono
            // porque sobre la franja de tinta un anillo en tinta seria invisible.
            "outline-none focus-visible:ring-2 focus-visible:ring-[var(--tk-banner-ring)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--tk-banner-bg)]",
          )}
        >
          <GlifoCerrar />
        </button>
      )}
    </div>
  );
});

/* -------------------------------------------------------------------------- */

export type BannerActionProps = React.ComponentPropsWithoutRef<"button">;

/**
 * Accion del Banner — EXTENSION, medidas del prototipo de la seccion 38.
 *
 * No tiene variantes a proposito: su aspecto lo decide el tono del banner que la
 * contiene, que publica los colores en variables CSS. En promo es un pill claro
 * sobre la franja de tinta; en los tonos claros, texto subrayado. Nunca texto
 * verde — el verde del sistema es del icono, no del enlace.
 *
 * Alto 28 (h-control-xs), radio 8 y mono 12: no coincide con ningun tamaño de
 * `Button` (S es 32/r8 y XS es 28/r6), asi que se implementa aqui.
 *
 * El label va en MAYUSCULAS por CSS, nunca con `.toUpperCase()` en JS: eso
 * romperia el texto que anuncia el lector de pantalla y lo que el usuario copia
 * al portapapeles.
 */
export const BannerAction = React.forwardRef<HTMLButtonElement, BannerActionProps>(
  function BannerAction({ className, type, children, ...props }, ref) {
    return (
      <button
        ref={ref}
        // Sin type explicito un <button> envia el formulario que lo contenga.
        type={type ?? "button"}
        className={cn(
          "inline-flex h-control-xs cursor-pointer items-center justify-center gap-2 rounded-sm whitespace-nowrap",
          "px-[var(--tk-banner-action-px,0px)]",
          "bg-[var(--tk-banner-action-bg,transparent)] text-[var(--tk-banner-action-fg,var(--tk-ink))]",
          // Subrayado por variable: activo en los tonos claros, apagado en promo,
          // que ya se distingue por el pill.
          "[text-decoration-line:var(--tk-banner-action-line,underline)] underline-offset-[3px]",
          "font-mono text-xs font-normal tracking-[0.02em] uppercase",
          "transition-[color,background-color,opacity] duration-140 ease-out",
          "hover:not-disabled:bg-[var(--tk-banner-action-bg-hover,transparent)]",
          "hover:not-disabled:opacity-[var(--tk-banner-action-opacity-hover,1)]",
          "active:not-disabled:bg-[var(--tk-banner-action-bg-active,transparent)]",
          // Los dos colores del foco llevan fallback: fuera de un Banner nadie
          // publica --tk-banner-*, y sin fallback el offset cae al initial-value
          // de --tw-ring-offset-color, que es #fff — un halo blanco de 2px en
          // tema oscuro. Suelto, la accion se apoya en el fondo de la pagina.
          "outline-none focus-visible:ring-2 focus-visible:ring-[var(--tk-banner-ring,var(--tk-ink))] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--tk-banner-bg,var(--tk-bg))]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);
