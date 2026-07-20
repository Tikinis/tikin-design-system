import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/* Seccion 42 · Modales & bottom sheets — MIXTO.
 *
 * Superficies que interrumpen para confirmar o decidir. El MODAL centra una
 * decision de 1-2 opciones; la BOTTOM SHEET sube desde abajo con una lista de
 * acciones o un mini-formulario y respeta el safe-area inferior.
 *
 * QUE ES CANONICO Y QUE NO
 * ------------------------
 * La bajada de la seccion dice "Basado en Dialog details / Dialog master del
 * archivo", pero el export de Figma de esos dos nodos
 * (docs/figma-export/components/DialogDetails.jsx) es la alerta NATIVA de iOS:
 * 270 de ancho, radio 14 solo arriba, SF Pro 17/13, fondo rgba(248,248,248,.92)
 * con blur. Nada de eso es Tikin. El documento re-especifica la superficie
 * entera con los tokens del sistema:
 *
 *     ancho 340 · radio 20 · padding 24 · Funnel Display 19 · Sans 14 · sombra xl
 *
 * Asi que el ORIGEN es del archivo pero la GEOMETRIA no: se implementa lo que
 * dice el documento y se anota aqui para que nadie tome el export de iOS por
 * especificacion. La bottom sheet no existe en el archivo en ninguna forma —
 * es EXTENSION pura construida con los mismos tokens.
 *
 * OJO CON EL BLOQUE "EN VIVO · PRUEBALO"
 * --------------------------------------
 * Esa demo mete el scrim dentro de una caja de 420px con puntos de fondo, y sus
 * botones disparadores son de 40 de alto. Es el marco de la demo, no el
 * componente. Las medidas buenas son las de "ANATOMIA · MODAL": tarjeta 340,
 * CTA de 48 y salida Ghost de 44.
 *
 * SCRIM: POR QUE UN NEGRO LITERAL
 * -------------------------------
 * El scrim es rgba(11,15,16,0.45) fijo, no `bg-ink/45`. Un scrim no es una
 * superficie del tema sino una sombra sobre la pagina: tiene que oscurecer en
 * los dos modos. `--tk-ink` invierte a casi blanco en oscuro, asi que
 * `bg-ink/45` daria un velo BLANCO sobre una pagina negra. Es la misma
 * excepcion que ya se documenta en el scrim de CardMedia.
 *
 * MOTION
 * ------
 * Entrada por @starting-style (`starting:`) + transition: modal scale .94->1 con
 * fade, sheet subiendo desde abajo. La SALIDA es instantanea a proposito: Radix
 * retrasa el desmontaje esperando un `animationend`, no un `transitionend`, y
 * el tema no declara keyframes (packages/tokens es territorio de otro agente).
 * Si algun dia se añaden keyframes al tema, este es el sitio donde cambiarlo.
 */

/* Distancia que hay que arrastrar la sheet hacia abajo para que se cierre.
 * 96 es aproximadamente el alto del grabber + titulo: por debajo de eso el
 * gesto se lee como un tanteo y la hoja vuelve a su sitio. */
const DRAG_DISMISS_PX = 96;

/* Scrim compartido por modal y sheet. `flex` centra la tarjeta del modal; la
 * sheet lo ignora porque se posiciona en absoluto contra el borde inferior. */
const scrim = cva([
  "fixed inset-0 z-50 bg-[rgba(11,15,16,0.45)]",
  "transition-opacity duration-140 ease-out starting:opacity-0",
  "motion-reduce:transition-none",
]);

/* ------------------------------------------------------------------ */
/* MODAL                                                               */
/* ------------------------------------------------------------------ */

/**
 * Raiz del modal. Es `Dialog.Root` de Radix sin capa propia: el foco atrapado,
 * el Escape, el `aria-modal` y el retorno del foco al disparador vienen de ahi
 * y no se reimplementan a mano.
 */
export const Modal = DialogPrimitive.Root;

/**
 * Disparador. Usa `asChild` para envolver tu propio boton y que Radix cablee
 * `aria-haspopup`, `aria-expanded` y el retorno del foco sobre el.
 */
export const ModalTrigger = DialogPrimitive.Trigger;

/**
 * Cierra la superficie. Idiomatico con `asChild`:
 *
 *     <ModalClose asChild><ModalAction variant="ghost">Cancelar</ModalAction></ModalClose>
 */
export const ModalClose = DialogPrimitive.Close;

type PortalContainer = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Portal>["container"];

export interface ModalContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  /** Contenedor del portal. Por defecto `document.body`. */
  container?: PortalContainer;
  /**
   * Clases del scrim. Sirve para acotarlo a una caja concreta
   * (`overlayClassName="absolute"` dentro de un contenedor `relative`), que es
   * lo que hace la demo del documento.
   */
  overlayClassName?: string;
}

/**
 * Tarjeta del modal, con su scrim.
 *
 * Ancho 340 · radio 20 · padding 24 · sombra xl. El contenido va en columna con
 * 8 de separacion: icono opcional, titulo, cuerpo y pie de acciones.
 *
 * Radix avisa por consola si no encuentra una descripcion. Cuando el modal solo
 * lleva titulo, pasale `aria-describedby={undefined}` para silenciarlo sin
 * inventar texto que el lector de pantalla leeria de mas.
 */
export const ModalContent = React.forwardRef<HTMLDivElement, ModalContentProps>(
  function ModalContent({ className, overlayClassName, container, children, ...props }, ref) {
    return (
      <DialogPrimitive.Portal container={container}>
        {/* La tarjeta va DENTRO del overlay para poder centrarla con flex sin
            un wrapper extra. Radix sigue cerrando al pulsar fuera porque lo
            detecta por pointerdown contra el contenido, no contra el overlay. */}
        <DialogPrimitive.Overlay
          className={cn(scrim(), "flex items-center justify-center p-6", overlayClassName)}
        >
          <DialogPrimitive.Content
            ref={ref}
            className={cn(
              "relative flex w-[340px] max-w-full flex-col gap-2",
              // Si el cuerpo se pasa de largo la tarjeta scrollea; nunca se sale
              // de la pantalla. dvh y no vh por la barra del navegador movil.
              "max-h-[calc(100dvh-48px)] overflow-y-auto",
              "rounded-2xl bg-surface p-6 text-ink outline-none",
              "shadow-[0_20px_40px_-12px_rgba(0,0,0,0.4)]",
              // scale .94 -> 1 + fade, del pie de la demo del documento.
              "transition-[opacity,transform] duration-140 ease-out",
              "starting:scale-[0.94] starting:opacity-0",
              "motion-reduce:transition-none",
              className,
            )}
            {...props}
          >
            {children}
          </DialogPrimitive.Content>
        </DialogPrimitive.Overlay>
      </DialogPrimitive.Portal>
    );
  },
);

/* Icono de estado de 44 con su circulo de tinte. Los pares tint- y fg- de
 * feedback son los unicos colores que invierten bien en tema oscuro. */
const modalIcon = cva(
  "mb-1.5 flex size-11 shrink-0 items-center justify-center rounded-pill [&_svg]:size-[22px]",
  {
    variants: {
      tone: {
        neutral: "bg-surface-2 text-ink",
        info: "bg-tint-info text-fg-info",
        success: "bg-tint-success text-fg-success",
        warning: "bg-tint-warning text-fg-warning",
        danger: "bg-tint-error text-fg-error",
      },
    },
    defaultVariants: { tone: "info" },
  },
);

export interface ModalIconProps
  extends React.ComponentPropsWithoutRef<"div">,
    VariantProps<typeof modalIcon> {}

/**
 * Icono de estado, 44 de lado — OPCIONAL. Solo cuando el modal comunica el
 * resultado de algo (envio completado, error) o califica la decision.
 *
 * Es decorativo: el mensaje lo lleva el titulo, asi que va oculto al lector de
 * pantalla para no duplicar la informacion.
 */
export const ModalIcon = React.forwardRef<HTMLDivElement, ModalIconProps>(function ModalIcon(
  { className, tone, ...props },
  ref,
) {
  return <div ref={ref} aria-hidden="true" className={cn(modalIcon({ tone }), className)} {...props} />;
});

export type ModalTitleProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>;

/**
 * Titulo — Funnel Display 19, UNA linea. Es el nombre accesible del dialogo,
 * asi que nunca se omite: si no cabe, se acorta el texto, no se quita.
 */
export const ModalTitle = React.forwardRef<HTMLHeadingElement, ModalTitleProps>(
  function ModalTitle({ className, ...props }, ref) {
    return (
      <DialogPrimitive.Title
        ref={ref}
        className={cn("font-display text-[19px] leading-snug font-semibold text-ink", className)}
        {...props}
      />
    );
  },
);

export type ModalDescriptionProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Description
>;

/** Cuerpo — Sans 14, interlineado 1.55, maximo 2-3 lineas. */
export const ModalDescription = React.forwardRef<HTMLParagraphElement, ModalDescriptionProps>(
  function ModalDescription({ className, ...props }, ref) {
    return (
      <DialogPrimitive.Description
        ref={ref}
        className={cn("text-sm leading-[1.55] text-ink-700", className)}
        {...props}
      />
    );
  },
);

export type ModalFooterProps = React.ComponentPropsWithoutRef<"div">;

/**
 * Pie de acciones: columna, 8 de separacion, 14 de aire sobre el cuerpo.
 *
 * Nunca en fila. Con dos botones en horizontal el destructivo queda del tamaño
 * exacto del seguro y el error de pulsacion sale gratis; apilados, la salida
 * queda siempre debajo de la accion que confirma.
 */
export const ModalFooter = React.forwardRef<HTMLDivElement, ModalFooterProps>(
  function ModalFooter({ className, ...props }, ref) {
    return <div ref={ref} className={cn("mt-3.5 flex flex-col gap-2", className)} {...props} />;
  },
);

const modalAction = cva(
  [
    "inline-flex w-full items-center justify-center gap-2",
    // Label mono, MAYUSCULAS por CSS, +2% de tracking y nunca bold.
    "font-mono font-normal uppercase tracking-[0.02em] whitespace-nowrap",
    "cursor-pointer rounded-lg text-sm transition-colors duration-140 ease-out select-none",
    // El offset del anillo es del color de la tarjeta, no de la pagina: sobre
    // el scrim un halo del color de la pagina se ve como un corte.
    "outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
    "disabled:cursor-not-allowed disabled:bg-surface-3 disabled:text-ink-400",
    "[&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      /* CTA primaria 48 · salida Ghost 44, del bloque de anatomia. */
      variant: {
        primary: "h-control-l",
        ghost: "h-11",
      },
      tone: { default: "", danger: "" },
    },
    compoundVariants: [
      {
        variant: "primary",
        tone: "default",
        class:
          "bg-ink text-surface hover:not-disabled:bg-ink-800 active:not-disabled:bg-ink-strong",
      },
      /* Rojo SOLO en la accion irreversible. --tk-fg-error invierte con el tema
       * (196,0,0 en claro / 255,138,138 en oscuro) y text-surface le acompaña,
       * asi que el contraste se mantiene en ambos modos. El hover y el pressed
       * suben por la escala de marca purered, que NO invierte: son el mismo rojo
       * en los dos temas y por eso solo se usan como estado momentaneo. */
      {
        variant: "primary",
        tone: "danger",
        class:
          "bg-fg-error text-surface hover:not-disabled:bg-red active:not-disabled:bg-[var(--colours-purered-700)]",
      },
      {
        variant: "ghost",
        tone: "default",
        class:
          "bg-transparent text-ink hover:not-disabled:bg-surface-2 active:not-disabled:bg-edge disabled:bg-transparent",
      },
      {
        variant: "ghost",
        tone: "danger",
        class:
          "bg-transparent text-fg-error hover:not-disabled:bg-tint-error active:not-disabled:bg-tint-error disabled:bg-transparent",
      },
    ],
    defaultVariants: { variant: "primary", tone: "default" },
  },
);

export interface ModalActionProps
  extends React.ComponentPropsWithoutRef<"button">,
    VariantProps<typeof modalAction> {}

/**
 * Boton del pie del modal.
 *
 * No reutiliza `Button` porque el sistema no tiene variante destructiva y el
 * documento la exige aqui ("DESTRUCTIVO EN ROJO"), ademas de fijar dos alturas
 * propias de esta superficie (48 la CTA, 44 la salida). Si lo que necesitas es
 * un boton normal dentro del modal, mete un `<Button fullWidth>` en el
 * `ModalFooter`: conviven sin problema.
 *
 * NUNCA dos primarias: una accion confirma y la otra sale en `ghost`.
 */
export const ModalAction = React.forwardRef<HTMLButtonElement, ModalActionProps>(
  function ModalAction({ className, variant, tone, type, ...props }, ref) {
    return (
      <button
        ref={ref}
        // Un <button> sin type dentro de un <form> envia el formulario; el modal
        // que aloja un mini-formulario es un caso real.
        type={type ?? "button"}
        className={cn(modalAction({ variant, tone }), className)}
        {...props}
      />
    );
  },
);

/* ------------------------------------------------------------------ */
/* BOTTOM SHEET                                                        */
/* ------------------------------------------------------------------ */

/** Raiz de la bottom sheet. Misma primitiva que el modal: `Dialog.Root`. */
export const BottomSheet = DialogPrimitive.Root;

/** Disparador de la bottom sheet. */
export const BottomSheetTrigger = DialogPrimitive.Trigger;

/** Cierra la bottom sheet. */
export const BottomSheetClose = DialogPrimitive.Close;

export interface BottomSheetContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  container?: PortalContainer;
  overlayClassName?: string;
  /** Pinta el grabber de 36x4. Ocultarlo tambien desactiva el gesto de arrastre. */
  showHandle?: boolean;
}

/**
 * Hoja anclada al borde inferior.
 *
 * Radio 20 solo arriba, padding 10/16/20 y safe-area sumada al padding
 * inferior: en un movil con gesto de home, sin ese calc la ultima fila de la
 * lista queda debajo de la barra.
 *
 * TRES SALIDAS, como manda el documento: el scrim, Escape (las dos las pone
 * Radix) y el gesto de arrastrar el grabber hacia abajo.
 */
export const BottomSheetContent = React.forwardRef<HTMLDivElement, BottomSheetContentProps>(
  function BottomSheetContent(
    { className, overlayClassName, container, showHandle = true, children, ...props },
    ref,
  ) {
    const [dragging, setDragging] = React.useState(false);
    const [dragY, setDragY] = React.useState(0);
    /* El desplazamiento se guarda tambien en una ref porque el handler de
     * pointerup necesita leer el ultimo valor para decidir si cierra, y hacerlo
     * desde el updater de setState convertiria el cierre en un efecto lateral
     * durante el render. */
    const dragYRef = React.useRef(0);
    const startYRef = React.useRef(0);
    /* Radix no expone su contexto de cierre, asi que el gesto cierra pulsando un
     * Close oculto. `hidden` lo saca del arbol de accesibilidad y del recorrido
     * del tabulador — el FocusScope de Radix descarta los nodos con `hidden` —
     * pero .click() sigue funcionando. */
    const closeRef = React.useRef<HTMLButtonElement>(null);

    const setDrag = React.useCallback((value: number) => {
      dragYRef.current = value;
      setDragY(value);
    }, []);

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
      // Solo boton principal / dedo primario: con el secundario el navegador
      // abre su menu contextual y nunca llega el pointerup.
      if (event.button !== 0) return;
      startYRef.current = event.clientY;
      setDrag(0);
      setDragging(true);
    };

    React.useEffect(() => {
      if (!dragging) return;

      const handleMove = (event: PointerEvent) => {
        // Solo hacia abajo: arrastrar hacia arriba no estira la hoja.
        setDrag(Math.max(0, event.clientY - startYRef.current));
      };
      const handleUp = () => {
        setDragging(false);
        if (dragYRef.current > DRAG_DISMISS_PX) closeRef.current?.click();
        setDrag(0);
      };

      /* Los listeners van en window y no en el grabber porque jsdom (y los
       * navegadores sin setPointerCapture disponible) pierden el puntero en
       * cuanto sale del elemento; asi el gesto se completa aunque el dedo se
       * salga de la hoja. */
      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
      window.addEventListener("pointercancel", handleUp);
      return () => {
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
        window.removeEventListener("pointercancel", handleUp);
      };
    }, [dragging, setDrag]);

    return (
      <DialogPrimitive.Portal container={container}>
        <DialogPrimitive.Overlay className={cn(scrim(), overlayClassName)}>
          <DialogPrimitive.Content
            ref={ref}
            className={cn(
              "absolute inset-x-0 bottom-0 flex max-h-[85dvh] flex-col overflow-y-auto",
              "rounded-t-2xl bg-surface px-4 pt-2.5 text-ink outline-none",
              // Safe-area SUMADA al padding, no sustituyendolo: en un movil sin
              // gesto de home env() vale 0 y quedan los 20 del documento.
              "pb-[calc(20px+env(safe-area-inset-bottom))]",
              // Sube desde abajo. Durante el arrastre la transicion estorbaria:
              // la hoja iria por detras del dedo.
              "transition-transform duration-140 ease-out starting:translate-y-full",
              dragging && "transition-none",
              "motion-reduce:transition-none",
              className,
            )}
            // El transform en linea gana al de la clase mientras se arrastra;
            // en reposo vale undefined y manda la transicion de entrada.
            style={dragY ? { transform: `translateY(${dragY}px)` } : undefined}
            {...props}
          >
            {showHandle ? (
              <div
                onPointerDown={handlePointerDown}
                // Gancho estable para tests y para automatizacion: el grabber es
                // decorativo, asi que no tiene rol ni texto por los que buscarlo.
                data-drag-handle=""
                // touch-none: sin esto el navegador se queda el gesto vertical
                // para hacer scroll y no llega ningun pointermove.
                className="mx-auto mt-1.5 mb-3.5 h-1 w-9 shrink-0 cursor-grab touch-none rounded-pill bg-edge-2 active:cursor-grabbing"
                // Decorativo: la salida accesible de verdad son Escape y el
                // Close del contenido, no este gesto.
                aria-hidden="true"
              />
            ) : null}
            {children}
            <DialogPrimitive.Close ref={closeRef} hidden tabIndex={-1} aria-hidden="true" />
          </DialogPrimitive.Content>
        </DialogPrimitive.Overlay>
      </DialogPrimitive.Portal>
    );
  },
);

export type BottomSheetTitleProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>;

/** Titulo de la hoja — Funnel Display 17. Nombre accesible del dialogo. */
export const BottomSheetTitle = React.forwardRef<HTMLHeadingElement, BottomSheetTitleProps>(
  function BottomSheetTitle({ className, ...props }, ref) {
    return (
      <DialogPrimitive.Title
        ref={ref}
        className={cn("px-1 pb-2 font-display text-[17px] font-semibold text-ink", className)}
        {...props}
      />
    );
  },
);

export type BottomSheetDescriptionProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Description
>;

/** Bajada opcional bajo el titulo de la hoja. */
export const BottomSheetDescription = React.forwardRef<
  HTMLParagraphElement,
  BottomSheetDescriptionProps
>(function BottomSheetDescription({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn("px-1 pb-2 text-[13px] leading-[1.5] text-ink-700", className)}
      {...props}
    />
  );
});

export type BottomSheetListProps = React.ComponentPropsWithoutRef<"div">;

/**
 * Contenedor de las filas de accion.
 *
 * Existe porque la separacion entre filas se dibuja con `not-last:border-b`:
 * sin un padre que agrupe SOLO filas, la ultima no se detectaria y la lista
 * acabaria con una linea suelta antes del safe-area.
 */
export const BottomSheetList = React.forwardRef<HTMLDivElement, BottomSheetListProps>(
  function BottomSheetList({ className, ...props }, ref) {
    return <div ref={ref} className={cn("flex flex-col", className)} {...props} />;
  },
);

/* `title` se redefine como nodo: el atributo HTML del mismo nombre es un string
 * que ademas pinta un tooltip nativo. Se omite para poder aceptar JSX. */
export interface BottomSheetItemProps
  extends Omit<React.ComponentPropsWithoutRef<"button">, "title"> {
  /** Avatar o icono de 38 a la izquierda. El glifo se dibuja a 19px. */
  icon?: React.ReactNode;
  /** Linea principal, Sans 14. */
  title: React.ReactNode;
  /** Linea de apoyo, Sans 12 en ink-600. */
  description?: React.ReactNode;
  /**
   * Adorno del final de fila. Por defecto no hay ninguno: el chevron del
   * documento es un icono de Phosphor que el consumidor pasa aqui, porque la
   * libreria de iconos no es dependencia de @tikin/ui.
   */
  endIcon?: React.ReactNode;
}

/**
 * Fila de accion de la bottom sheet.
 *
 * Es un `<button>` de verdad, no un div con onClick: el rol, el foco y
 * Enter/Espacio los quiere dar el navegador. El texto NO se pone en mayusculas
 * — aqui va contenido real (un alias, un nombre), no un label de sistema.
 */
export const BottomSheetItem = React.forwardRef<HTMLButtonElement, BottomSheetItemProps>(
  function BottomSheetItem(
    { className, icon, title, description, endIcon, type, ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type ?? "button"}
        className={cn(
          "flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-left",
          "transition-colors duration-140 ease-out",
          "hover:not-disabled:bg-surface-2 active:not-disabled:bg-edge",
          "outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
          "disabled:cursor-not-allowed disabled:text-ink-400",
          "not-last:border-b not-last:border-surface-2",
          className,
        )}
        {...props}
      >
        {icon ? (
          <span
            aria-hidden="true"
            className="flex size-[38px] shrink-0 items-center justify-center rounded-pill bg-surface-2 text-ink [&_svg]:size-[19px]"
          >
            {icon}
          </span>
        ) : null}
        <span className="flex min-w-0 flex-col gap-px">
          <span className="truncate text-sm text-ink">{title}</span>
          {description ? (
            <span className="truncate text-xs text-ink-600">{description}</span>
          ) : null}
        </span>
        {endIcon ? (
          <span aria-hidden="true" className="ml-auto shrink-0 text-ink-500 [&_svg]:size-[15px]">
            {endIcon}
          </span>
        ) : null}
      </button>
    );
  },
);
