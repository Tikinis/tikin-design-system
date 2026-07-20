import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/* Seccion 37 · Notifications — EXTENSION construida con la paleta del sistema.
 *
 * El propio documento lo etiqueta asi ("Extension con la paleta del sistema") y
 * el export de Figma lo confirma: en docs/figma-export/components/ no existe
 * ningun cuerpo de Notification. Detras de estas medidas NO hay especificacion
 * aprobada — salen del prototipo del documento, no del archivo.
 *
 * Que es: una fila del centro de notificaciones. Movimientos, seguridad y
 * novedades, agrupadas por tiempo (Hoy / Antes). El agrupador y el titulo del
 * grupo los pone la pantalla; este componente es SOLO la fila.
 *
 * MEDIDAS DEL PROTOTIPO (atributos style= del documento, no del texto)
 * -------------------------------------------------------------------
 *   fila        padding 12 14 · radio 12 · gap 12 · align flex-start
 *               no leida  fondo var(--tk-bg)   ("hueso")
 *               leida     sin fondo
 *               transicion de fondo .3s
 *   icono       circulo 40x40 · glifo 20px · color segun tipo
 *   texto       Ubuntu Sans 14px · no leida var(--tk-ink) / leida var(--tk-700)
 *               el fragmento destacado (el monto, el nombre) va en <strong> 600
 *   hora        Ubuntu Sans Mono 11px · no leida var(--tk-600) / leida var(--tk-500)
 *   punto       8x8 circulo var(--tk-ink) · margin-top 6 · solo si no leida
 *   acciones    alto 32 · px 14 · radio 8 · mono 12 · +2% track · gap 8
 *
 * DISCREPANCIA TEXTO vs HTML EN EL COLOR DE "SEGURIDAD"
 * ----------------------------------------------------
 * La regla escrita dice "seguridad (lavanda)" y el HTML pinta el circulo con
 * --tk-tint-info / --tk-fg-info. No hay conflicto real: --tk-tint-info es
 * rgb(238,239,255), o sea lavanda. Se sigue el HTML, que es la fuente de
 * valores, y ademas invierte en tema oscuro. El lavanda pleno del sistema
 * (--colours-lavenderblue-100, rgb(223,225,255)) el prototipo lo reserva para
 * la solicitud de dinero: por eso es el tono `request` y no el de seguridad.
 *
 * TEMA OSCURO
 * -----------
 * Todos los colores salen de la capa semantica --tk-*, que si invierte. La
 * unica excepcion es el tono `request`: bg-lavender es un acento de marca
 * identico en ambos modos (siempre claro), y por eso su glifo usa text-on-accent
 * — tinta estable pensada justo para rellenos de acento — en vez de text-ink,
 * que en oscuro seria casi blanco sobre lavanda claro.
 *
 * GESTOS
 * ------
 * "Deslizar para marcar leida o archivar" es un gesto de plataforma y se queda
 * fuera del componente: depende del contenedor con scroll y de la libreria de
 * gestos de cada app. Lo que si garantiza el componente es que exista SIEMPRE
 * un equivalente accesible por teclado (la fila es un boton o un enlace real).
 */

const notification = cva(
  [
    "relative flex items-start gap-3 rounded-lg px-[14px] py-3",
    // Texto de notificacion es prosa: nunca mono, nunca mayusculas.
    "font-sans transition-colors duration-300 ease-out",
  ],
  {
    variants: {
      /* El estado publica sus dos tintas en variables locales en vez de
       * pintarlas en cada span. Asi el consumidor puede meter su propio markup
       * dentro del texto y hereda el color correcto sin conocer el estado. */
      unread: {
        true: "bg-page [--tk-notif-meta:var(--tk-600)] [--tk-notif-text:var(--tk-ink)]",
        false: "bg-transparent [--tk-notif-meta:var(--tk-500)] [--tk-notif-text:var(--tk-700)]",
      },
      /* El prototipo pone cursor:pointer pero no dibuja hover. Sin una señal de
       * que la fila responde, en desktop no se distingue de un bloque de texto:
       * se añade el hover mas suave del sistema. */
      interactive: { true: "cursor-pointer hover:bg-surface-2", false: "" },
    },
    defaultVariants: { unread: false, interactive: false },
  },
);

const notificationIcon = cva("flex size-10 flex-none items-center justify-center rounded-pill", {
  variants: {
    /* Dinero verde · seguridad lavanda · novedad gris · solicitud lavanda
     * pleno. Los nombres van en ingles como el resto de variantes del
     * sistema (tone: info/success/...), no en el castellano del documento. */
    tone: {
      money: "bg-tint-success text-fg-success",
      security: "bg-tint-info text-fg-info",
      news: "bg-surface-2 text-ink-600",
      request: "bg-lavender text-on-accent",
    },
  },
  defaultVariants: { tone: "news" },
});

export type NotificationTone = NonNullable<VariantProps<typeof notificationIcon>["tone"]>;

/* Glifos dibujados a mano. packages/ui no depende de @phosphor-icons y este
 * encargo no puede añadir dependencias; el prototipo usa ph-arrow-down,
 * ph-shield-check, ph-gift y ph-hand-coins, asi que estos son sus equivalentes
 * de trazo. `request` es el que mas se aparta: una pila de monedas en vez de la
 * mano con monedas, porque la mano a 20px se convierte en una mancha. */
const TRAZO = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function GlifoMoney() {
  return <path d="M10 4.2v11.2m-4.6-4.6L10 15.4l4.6-4.6" {...TRAZO} />;
}

function GlifoSecurity() {
  return (
    <>
      <path d="M10 2.6 4.2 4.9v4.4c0 3.6 2.4 6.1 5.8 7.9 3.4-1.8 5.8-4.3 5.8-7.9V4.9Z" {...TRAZO} />
      <path d="m7.5 9.7 1.9 1.9 3.4-3.6" {...TRAZO} />
    </>
  );
}

function GlifoNews() {
  return (
    <>
      <path d="M4 8.6h12v7.2a1.2 1.2 0 0 1-1.2 1.2H5.2A1.2 1.2 0 0 1 4 15.8Z" {...TRAZO} />
      <path d="M3 6.2h14v2.4H3Z" {...TRAZO} />
      <path d="M10 6.2v10.8" {...TRAZO} />
      <path
        d="M10 6.2S8.9 3 7.2 3a1.6 1.6 0 0 0 0 3.2Zm0 0S11.1 3 12.8 3a1.6 1.6 0 0 1 0 3.2Z"
        {...TRAZO}
      />
    </>
  );
}

function GlifoRequest() {
  return (
    <>
      <ellipse cx="10" cy="6" rx="5.4" ry="2.4" {...TRAZO} />
      <path d="M4.6 6v3.4c0 1.33 2.42 2.4 5.4 2.4s5.4-1.07 5.4-2.4V6" {...TRAZO} />
      <path d="M4.6 9.4v3.4c0 1.33 2.42 2.4 5.4 2.4s5.4-1.07 5.4-2.4V9.4" {...TRAZO} />
    </>
  );
}

const GLIFO: Record<NotificationTone, () => React.JSX.Element> = {
  money: GlifoMoney,
  security: GlifoSecurity,
  news: GlifoNews,
  request: GlifoRequest,
};

export interface NotificationItemProps
  // onSelect se omite a proposito: en React es el evento de seleccion de texto
  // del DOM, y aqui significa "abrir la notificacion".
  extends Omit<React.ComponentPropsWithoutRef<"li">, "onSelect" | "title"> {
  /** Tipo de aviso. Decide el color del circulo y el glifo por defecto. */
  tone?: NotificationTone;
  /** Sustituye el glifo del tono. Hereda su color por currentColor. */
  icon?: React.ReactNode;
  /** Marca de tiempo: "2:14 PM", "hace 2 dias". Va en mono 11. */
  time?: React.ReactNode;
  /**
   * Sin leer: fondo hueso, texto en tinta plena y punto a la derecha.
   * El punto es decorativo, asi que el estado se anuncia ademas con texto.
   */
  unread?: boolean;
  /** Texto que anuncia el lector de pantalla cuando `unread`. */
  unreadLabel?: string;
  /**
   * Fila de acciones bajo el texto — pensada para `<NotificationAction>`.
   * Vive fuera del area pulsable de la fila para no anidar botones.
   */
  actions?: React.ReactNode;
  /** "Tocar = ir": destino del detalle. Convierte la fila en un enlace real. */
  href?: string;
  /** Alternativa a `href` cuando la navegacion la resuelve el router en JS. */
  onSelect?: () => void;
}

/**
 * Fila del centro de notificaciones — EXTENSION construida con la paleta.
 *
 * Renderiza un `<li>`: debe vivir dentro de un `<ul>` (o algo con role="list")
 * para que el lector de pantalla anuncie cuantos avisos hay.
 *
 * El area pulsable NO es el `<li>` entero con un onClick encima, sino un boton
 * (o enlace) real que cubre la fila con `::after`. Dos motivos:
 *
 *   1. Un div con onClick no es alcanzable con Tab ni responde a Enter/Espacio.
 *      Envolver todo en un <button> tampoco vale: la fila de "Carlos te pide"
 *      lleva sus propios botones dentro, y anidar botones es HTML invalido.
 *   2. Con este patron la fila entera sigue siendo clicable con el raton y las
 *      acciones quedan por encima del overlay (van en `relative`).
 *
 * La hora y el estado de no leida cuelgan del elemento pulsable por
 * aria-describedby: sin eso, quien navega saltando de boton en boton oiria solo
 * el texto, sin saber ni cuando paso ni si ya lo habia leido.
 */
export const NotificationItem = React.forwardRef<HTMLLIElement, NotificationItemProps>(
  function NotificationItem(
    {
      className,
      tone = "news",
      icon,
      time,
      unread = false,
      unreadLabel = "Sin leer",
      actions,
      href,
      onSelect,
      children,
      ...props
    },
    ref,
  ) {
    const Glifo = GLIFO[tone];
    const interactive = Boolean(href) || Boolean(onSelect);

    const id = React.useId();
    const timeId = `${id}-time`;
    const stateId = `${id}-state`;
    const describedBy =
      [time != null && time !== false ? timeId : null, unread ? stateId : null]
        .filter(Boolean)
        .join(" ") || undefined;

    const claseTexto = "text-sm text-[var(--tk-notif-text)] [&_strong]:font-semibold";

    /* El overlay se dibuja con ::after sobre el <li> (el ancestro posicionado),
     * no con un elemento aparte, para que el nombre accesible del boton siga
     * siendo exactamente el texto de la notificacion.
     *
     * El anillo de foco va tambien en el ::after, con offset negativo: si fuera
     * en el propio boton solo rodearia el texto, y el usuario de teclado no
     * sabria que lo enfocado es la fila entera. */
    const claseEnlace = cn(
      claseTexto,
      "text-left outline-none after:absolute after:inset-0 after:rounded-lg",
      "focus-visible:after:outline-2 focus-visible:after:outline-offset-[-2px] focus-visible:after:outline-ink",
    );

    return (
      <li className={cn(notification({ unread, interactive, className }))} ref={ref} {...props}>
        <span className={notificationIcon({ tone })} aria-hidden="true">
          {icon ?? (
            <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
              <Glifo />
            </svg>
          )}
        </span>

        {/* min-w-0 es obligatorio: sin el, un hijo flex no baja de su ancho de
            contenido y un texto largo desbordaria la fila en vez de partirse. */}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex min-w-0 flex-col gap-0.5">
            {href ? (
              <a
                href={href}
                className={claseEnlace}
                aria-describedby={describedBy}
                onClick={onSelect}
              >
                {children}
              </a>
            ) : onSelect ? (
              <button
                // Sin type explicito un <button> envia el formulario que lo
                // contenga; un centro de notificaciones puede vivir dentro de uno.
                type="button"
                className={claseEnlace}
                aria-describedby={describedBy}
                onClick={onSelect}
              >
                {children}
              </button>
            ) : (
              <span className={claseTexto}>{children}</span>
            )}

            {time != null && time !== false && (
              <span id={timeId} className="font-mono text-[11px] text-[var(--tk-notif-meta)]">
                {time}
              </span>
            )}
          </div>

          {/* relative para quedar por encima del overlay ::after de la fila:
              si no, el clic en PAGAR lo interceptaria el enlace de la fila. */}
          {actions && <div className="relative flex flex-wrap gap-2">{actions}</div>}
        </div>

        {unread && (
          <>
            <span className="mt-1.5 size-2 flex-none rounded-pill bg-ink" aria-hidden="true" />
            {/* El punto es color puro: sin este texto, quien no lo ve no tiene
                forma de saber que la notificacion sigue sin leer. */}
            <span id={stateId} className="sr-only">
              {unreadLabel}
            </span>
          </>
        )}
      </li>
    );
  },
);

/* -------------------------------------------------------------------------- */

const notificationAction = cva(
  [
    "inline-flex h-8 cursor-pointer items-center justify-center rounded-sm px-[14px]",
    // El label va SIEMPRE mono, MAYUSCULAS y +2% de tracking, como el boton.
    "font-mono text-xs font-normal tracking-[0.02em] whitespace-nowrap uppercase",
    "transition-colors duration-140 ease-out",
    // outline en vez de ring con offset de color: el fondo de la fila cambia
    // con el estado (hueso o transparente) y un ring-offset fijo se veria mal
    // en uno de los dos.
    "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
    "disabled:cursor-not-allowed",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-ink text-surface hover:not-disabled:bg-ink-800 disabled:bg-edge disabled:text-ink-400",
        secondary:
          "border border-edge-2 bg-transparent text-ink hover:not-disabled:bg-surface-2 disabled:border-edge disabled:text-ink-400",
      },
    },
    defaultVariants: { variant: "primary" },
  },
);

export interface NotificationActionProps
  extends React.ComponentPropsWithoutRef<"button">, VariantProps<typeof notificationAction> {}

/**
 * Accion inline de una notificacion — EXTENSION, medidas del prototipo.
 *
 * Alto 32, radio 8, px 14 y mono 12. No coincide con ningun tamaño de `Button`
 * (S es 32/r8 pero con px 16 y texto 14), asi que se implementa aqui en vez de
 * reutilizarlo. Dos acciones como maximo: si hacen falta mas, eso ya no cabe en
 * una fila de notificacion y es una pantalla de detalle.
 *
 * El label va en MAYUSCULAS por CSS, nunca con `.toUpperCase()` en JS: eso
 * romperia el texto que anuncia el lector de pantalla y lo que el usuario copia
 * al portapapeles.
 */
export const NotificationAction = React.forwardRef<HTMLButtonElement, NotificationActionProps>(
  function NotificationAction({ className, variant, type, children, ...props }, ref) {
    return (
      <button
        ref={ref}
        type={type ?? "button"}
        className={cn(notificationAction({ variant, className }))}
        {...props}
      >
        {children}
      </button>
    );
  },
);
