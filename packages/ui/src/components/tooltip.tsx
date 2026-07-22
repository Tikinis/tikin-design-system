import * as React from "react";
import * as TooltipPrimitive from "radix-ui/tooltip";
import { cva } from "class-variance-authority";
import { cn } from "../lib/cn";

/* Seccion 19 · Tooltips — EXTENSION construida con los tokens del archivo.
 *
 * El propio documento lo declara: "Extension construida con los tokens del
 * archivo". No hay componente Tooltip en el export de Figma
 * (docs/figma-export/components/ no tiene ninguno), asi que aqui NO hay
 * especificacion aprobada: hay una propuesta coherente con el sistema. Quien lo
 * consuma debe saberlo antes de tomarlo por canonico.
 *
 * Reglas de uso que vienen del documento y que el componente no puede imponer:
 *
 *   SOLO APOYO   aclara, nunca contiene informacion esencial ni acciones. En
 *                movil (sin hover) esa informacion va inline o en un sheet.
 *   BREVE        una linea idealmente; dos como maximo con titulo + descripcion.
 *                Sin punto final en etiquetas de una frase.
 *   FLECHA       apunta siempre al origen, con un fade corto y sin rebote.
 *
 * MEDIDAS, del HTML del prototipo (los estilos van inline ahi):
 *   burbuja simple   padding 7/11 · r8 · Ubuntu Sans 13 · nowrap
 *   titulo + desc    padding 9/12 · r8 · gap 3 · titulo 600/12.5 · desc 11.5/1.4
 *   shortcut         chip r4 · padding 2/6 · Ubuntu Mono 11
 *   separacion       12px del disparador (10 en el ejemplo inline)
 *   flecha           cuadrado de 8 girado 45 grados
 *   entrada          fade de ~140ms
 *
 * TEMA OSCURO
 * -----------
 * La burbuja es --tk-ink-strong sobre texto --tk-surface. Los dos tokens SI se
 * invierten en el bloque .dark (11,11,11 -> 255,255,255 y 255,255,255 ->
 * 27,27,27), asi que la burbuja sigue siendo el contrario de la pagina en
 * ambos temas, que es justo la intencion del documento.
 *
 * El chip del shortcut es la unica excepcion: el prototipo lo fija en
 * rgb(35,35,35), un literal que no invierte y que en tema oscuro daria un chip
 * casi negro sobre una burbuja blanca. Se sustituye por `bg-surface/10`, que
 * compuesto sobre la burbuja da exactamente el mismo color en tema claro
 * (11 + 0.1 * (255 - 11) = 35) y su equivalente invertido en oscuro.
 */

const tooltipContent = cva(
  [
    "z-50 rounded-sm bg-ink-strong font-sans text-surface select-none",
    /* Interlineado explicito. El archivo no declara line-height para la burbuja,
     * asi que esta hereda `normal` (~1.15 en Ubuntu Sans) y la burbuja simple
     * mide 13 * 1.15 + 7 + 7 = ~29px, la unica medida vertical que el documento
     * fija de forma exacta. Sin esta linea heredaria el 1.5 del preflight de
     * Tailwind y creceria ~4px. La descripcion del layout rich lo sobreescribe
     * con su propio 1.4, que ese si viene del archivo.
     *
     * Va PEGADO al tamaño con la sintaxis `text-13px/normal` y no como un
     * `leading-[normal]` suelto en la base. tailwind-merge considera que
     * `text-*` y `leading-*` compiten por lo mismo — `text-sm/6` fija los dos —
     * asi que un leading declarado antes desaparecia al llegar la variante con
     * su tamaño, y la burbuja heredaba el 1.5 del preflight. Medido: cn() sobre
     * la cadena real devolvia la clase de leading ya borrada. */
    /* El fade de ~140ms del documento sin plugin de animaciones: la entrada se
     * consigue con @starting-style (variante `starting:` de Tailwind 4). No hay
     * fade de salida a proposito — Radix desmonta el contenido al cerrar y
     * retenerlo montado solo para animarlo dejaria un nodo con role="tooltip"
     * en el arbol de accesibilidad mas tiempo del debido.
     *
     * La curva es CSS `ease` (cubic-bezier(.25,.1,.25,1)), calcada del original:
     * `.tk-tip-bub { transition: opacity .14s ease }`. Se escribe con el
     * cubic-bezier explicito porque Tailwind no trae utilidad para el keyword
     * `ease`, y su `ease-out` es OTRA curva (arranque mas plano) que dejaba el
     * fade sintiendose distinto al del archivo.
     *
     * Matiz conocido: mientras mide la posicion, Radix aparca la burbuja fuera
     * de pantalla y anula ahi las `animation`, no las `transition`, asi que el
     * primer frame del fade puede consumirse aun sin verse. Se acepta a
     * sabiendas: pasar a @keyframes para entrar en esa guarda haria que
     * Presence esperase al `animationend`, y un cierre inmediato despues de
     * abrir dejaria la burbuja colgada los 140ms enteros. */
    "opacity-100 transition-opacity duration-140 ease-[cubic-bezier(0.25,0.1,0.25,1)] starting:opacity-0",
    "motion-reduce:transition-none",
  ],
  {
    variants: {
      layout: {
        /* Una sola linea. `nowrap` es del documento: la etiqueta es breve por
         * definicion, y partirla en dos lineas rompe la silueta de la burbuja. */
        simple:
          "inline-flex items-center px-[11px] py-[7px] text-[13px]/[normal] whitespace-nowrap",
        /* Titulo + descripcion. El ancho maximo de 200 es lo que fuerza el
         * limite de "dos lineas como maximo". */
        rich: "flex max-w-[200px] flex-col gap-[3px] px-3 py-[9px] text-[13px]/[normal]",
      },
      /* Con chip de atajo el padding derecho baja de 11 a 8: el chip ya trae su
       * propio aire y con 11 la burbuja quedaba descentrada. */
      withShortcut: { true: "pr-2", false: "" },
    },
    defaultVariants: { layout: "simple", withShortcut: false },
  },
);

type ContentProps = React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>;

/* Marca de que ya hay un TooltipProvider por encima.
 *
 * Radix exige un Provider como ancestro y lanza si no lo encuentra, pero su
 * contexto no es accesible desde fuera. Con esta marca, un Tooltip suelto puede
 * montar su propio Provider y seguir funcionando, y a la vez respeta el del
 * consumidor cuando existe. Importa porque el Provider es quien guarda el
 * `skipDelayDuration`: envolver cada tooltip en uno propio haria que dos iconos
 * contiguos volvieran a esperar el retardo completo al pasar de uno a otro. */
const TooltipProviderContext = React.createContext(false);

/* El documento pide "sin retardo largo". Los 700ms de Radix lo son: a esa
 * velocidad el usuario ya ha movido el cursor. 200 es perceptible como
 * intencion sin castigar el barrido del raton. */
const DEFAULT_DELAY = 200;

export interface TooltipProviderProps {
  children: React.ReactNode;
  /** Espera desde que el cursor entra hasta que abre. Por defecto 200ms. */
  delayDuration?: number;
  /** Margen para saltar de un disparador a otro sin volver a esperar. */
  skipDelayDuration?: number;
  /** Si es `true`, el tooltip se cierra al salir del disparador aunque el cursor entre en la burbuja. */
  disableHoverableContent?: boolean;
}

/**
 * Agrupa los tooltips de una zona para compartir retardo.
 *
 * Opcional: un `<Tooltip>` suelto monta el suyo. Ponlo en la raiz de la app si
 * quieres un retardo unico y que moverse entre iconos vecinos sea inmediato.
 */
export function TooltipProvider({
  children,
  delayDuration = DEFAULT_DELAY,
  skipDelayDuration,
  disableHoverableContent,
}: TooltipProviderProps) {
  return (
    <TooltipProviderContext.Provider value={true}>
      <TooltipPrimitive.Provider
        delayDuration={delayDuration}
        skipDelayDuration={skipDelayDuration}
        disableHoverableContent={disableHoverableContent}
      >
        {children}
      </TooltipPrimitive.Provider>
    </TooltipProviderContext.Provider>
  );
}

export interface TooltipProps extends Omit<ContentProps, "children" | "asChild" | "content"> {
  /**
   * El disparador. Debe ser UN elemento capaz de recibir foco — un boton, un
   * enlace — porque el tooltip tambien se abre con el teclado.
   *
   * Con `triggerAsChild` (el valor por defecto) el hijo se fusiona con el
   * disparador via Slot, que exige exactamente un elemento: un texto suelto
   * revienta el render con "Primitive.button failed to slot onto its children".
   *
   * El tipo NO puede impedirlo, y conviene saber por que antes de intentarlo:
   * `radix-ui@1.6.3` publica declaraciones rotas —.d.mts con codigo de runtime
   * dentro— asi que `typeof TooltipPrimitive.Content` es `any` y `ContentProps`
   * acaba siendo `Omit<any, "ref">`, un tipo con firma de indice. Cualquier
   * `children` que se declare aqui se intersecta con ese `any` y vuelve a ser
   * `any`: estrecharlo a `React.ReactElement`, o partir el tipo en una union
   * segun `triggerAsChild`, compila igual de permisivo y solo aparenta
   * seguridad. Se arregla en la dependencia, no aqui.
   */
  children: React.ReactNode;
  /** Texto de la burbuja. Una frase breve, sin punto final. */
  label: React.ReactNode;
  /** Segunda linea. Al declararla, `label` pasa a ser el titulo de la burbuja. */
  description?: React.ReactNode;
  /** Atajo de teclado, en un chip a la derecha del label: `⌘K`. */
  shortcut?: React.ReactNode;
  /** Flecha de 8 apuntando al disparador. Activa por defecto. */
  arrow?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Retardo de apertura por hover. Sobreescribe el del provider. */
  delayDuration?: number;
  /** Cierra al salir del disparador sin dejar entrar el cursor en la burbuja. */
  disableHoverableContent?: boolean;
  /**
   * Renderiza el hijo como disparador en vez de envolverlo en un `<button>`.
   * Activo por defecto: es lo que evita anidar un boton dentro de otro. Con
   * `false` el disparador lo monta Radix y ahi si vale cualquier nodo.
   */
  triggerAsChild?: boolean;
  /** Contenedor del portal. Por defecto `document.body`. */
  container?: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Portal>["container"];
}

/**
 * Tooltip del sistema Tikin.
 *
 * Etiqueta breve que aparece al pasar el cursor por un elemento sin texto,
 * normalmente un icono. Superficie tinta, texto invertido y flecha al origen.
 *
 * Es SOLO APOYO: si el usuario necesita esa informacion para completar la
 * tarea, no va aqui. En movil no hay hover, asi que un tooltip es informacion
 * que simplemente no existe — ponla inline o en un sheet.
 *
 * El tooltip describe el disparador, no lo nombra: Radix lo enlaza con
 * `aria-describedby`. Un disparador solo-icono necesita ademas su propio
 * `aria-label`, o el lector de pantalla anunciara un boton sin nombre.
 *
 * Un disparador `disabled` no recibe foco y el navegador no dispara eventos de
 * raton sobre el, asi que el tooltip no abriria nunca. Si necesitas explicar
 * por que algo esta deshabilitado, usa `aria-disabled` en vez del atributo y
 * bloquea la accion en el handler.
 *
 * La `ref` y `className` van a la burbuja, que es el elemento que este
 * componente dibuja; el disparador lo aporta el consumidor.
 */
export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(
  {
    className,
    children,
    label,
    description,
    shortcut,
    arrow = true,
    open,
    defaultOpen,
    onOpenChange,
    delayDuration,
    disableHoverableContent,
    triggerAsChild = true,
    container,
    side = "top",
    /* El documento separa la burbuja 12px del disparador. La flecha de Radix se
     * dibuja FUERA de la burbuja, asi que se come 5 de esos 12 y la punta queda
     * a 7 del disparador — el mismo hueco optico que en el prototipo, donde el
     * cuadrado girado sobresale unos 5.6. */
    sideOffset = 12,
    align = "center",
    collisionPadding = 8,
    ...contentProps
  },
  ref,
) {
  const layout = description ? "rich" : "simple";

  const chip = shortcut ? (
    // <kbd> y no <span>: es literalmente una tecla, y el lector de pantalla lo
    // anuncia como tal.
    <kbd className="inline-flex items-center gap-0.5 rounded-[4px] bg-surface/10 px-1.5 py-0.5 font-meta text-[11px] text-ink-400">
      {shortcut}
    </kbd>
  ) : null;

  const root = (
    <TooltipPrimitive.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      delayDuration={delayDuration}
      disableHoverableContent={disableHoverableContent}
    >
      <TooltipPrimitive.Trigger asChild={triggerAsChild}>{children}</TooltipPrimitive.Trigger>
      {/* Portal para que la burbuja no la recorte un ancestro con overflow
          hidden — el caso tipico es una fila de tabla o una tarjeta. */}
      <TooltipPrimitive.Portal container={container}>
        <TooltipPrimitive.Content
          ref={ref}
          side={side}
          sideOffset={sideOffset}
          align={align}
          collisionPadding={collisionPadding}
          className={cn(
            tooltipContent({ layout, withShortcut: layout === "simple" && Boolean(shortcut) }),
            className,
          )}
          {...contentProps}
        >
          {description ? (
            <>
              <span className="flex items-center gap-2.5 text-[12.5px] font-semibold">
                {label}
                {chip}
              </span>
              {/* ink-500 sobre la burbuja: gris medio en ambos temas, porque el
                  token invierte junto con el fondo. */}
              <span className="text-[11.5px] leading-[1.4] text-ink-500">{description}</span>
            </>
          ) : (
            <>
              {label}
              {/* El gap va aqui y no en el contenedor para que sin chip la
                  burbuja no reserve un hueco fantasma. */}
              {chip ? <span className="ml-2.5 inline-flex">{chip}</span> : null}
            </>
          )}
          {arrow && (
            /* Flecha SVG de Radix en vez del cuadrado girado del prototipo: el
             * cuadrado hay que reposicionarlo a mano en cada lado y se queda
             * pegado en el sitio equivocado cuando Radix voltea la burbuja por
             * colision con el borde de la ventana. Un cuadrado de 8 girado 45
             * grados deja un triangulo visible de 11.3 x 5.7, que es la medida
             * que se le pasa aqui. */
            <TooltipPrimitive.Arrow width={11} height={5} className="fill-ink-strong" />
          )}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );

  return <TooltipRootProvider delayDuration={delayDuration}>{root}</TooltipRootProvider>;
});

/** Monta un Provider solo si no hay ninguno por encima. */
function TooltipRootProvider({
  children,
  delayDuration,
}: {
  children: React.ReactNode;
  delayDuration?: number;
}) {
  const hasProvider = React.useContext(TooltipProviderContext);
  if (hasProvider) return <>{children}</>;
  return (
    <TooltipProvider delayDuration={delayDuration ?? DEFAULT_DELAY}>{children}</TooltipProvider>
  );
}
