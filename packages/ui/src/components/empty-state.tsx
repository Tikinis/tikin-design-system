import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/* Seccion 32 · Empty states — EXTENSION construida con la paleta y la
 * tipografia del sistema. El propio documento lo etiqueta asi ("Extension con
 * la paleta y la tipografia del sistema") y el export de Figma lo confirma: en
 * docs/figma-export/components/ no hay ningun cuerpo de EmptyState. Detras de
 * estas medidas no hay especificacion aprobada — salen del prototipo del
 * documento, no del archivo.
 *
 * Que resuelve: cuando no hay datos, el vacio EXPLICA por que esta vacio y
 * ofrece la salida. Nunca una pantalla en blanco, nunca un mensaje suelto.
 *
 * MEDIDAS DEL PROTOTIPO (atributos style= del documento, no del texto)
 * -------------------------------------------------------------------
 *   contenedor  borde 1px var(--tk-border) · radio 16 · padding 32 24
 *               columna centrada · text-align center · gap 12
 *   tile        56x56 · radio 16 · icono 28px
 *   titulo      Funnel Display 500 · 17px · var(--tk-ink)
 *   mensaje     Ubuntu Sans 13.5px · line-height 1.5 · var(--tk-600)
 *               max-width 240 (mantiene la medida de lectura corta y centrada)
 *   accion      margin-top 4 · alto 40 · px 18 · radio 12 · mono 13 · +2% track
 *               gap 6 cuando lleva icono
 *
 * TEMA OSCURO
 * -----------
 * Todos los colores salen de la capa semantica --tk-* (surface-2, ink, 600,
 * tint-*, fg-*), que si invierte con el tema. La unica excepcion es el tono
 * `brand`: usa bg-lavender (--colours-lavenderblue-100, rgb(223,225,255)) que
 * es identico en ambos modos por ser acento de marca, y por eso su tinta va en
 * text-on-accent — la tinta estable pensada para rellenos de acento — y no en
 * text-ink, que en oscuro seria casi blanco sobre lavanda clara.
 */

const emptyState = cva(
  [
    "flex flex-col items-center gap-3 rounded-xl px-6 py-8 text-center",
    // El texto de un vacio es prosa: nunca mono, nunca mayusculas.
    "font-sans",
  ],
  {
    variants: {
      /* El borde define la tarjeta; la interfaz es plana y no lleva sombra. */
      bordered: {
        true: "border border-edge",
        false: "",
      },
    },
    defaultVariants: { bordered: true },
  },
);

/* El hue del tile es lo unico que cambia entre tonos. La regla "ICONO NEUTRO"
 * del documento es explicita: el hue SOLO cambia para error (rojo) y exito
 * (verde); el resto se queda en superficie neutra. `brand` es la excepcion que
 * el propio prototipo dibuja para la invitacion a crear el primer bolsillo — es
 * una invitacion, no un estado, y por eso puede permitirse el acento. */
const emptyStateTile = cva(
  "flex size-14 shrink-0 items-center justify-center rounded-xl text-[28px] [&_svg]:size-7",
  {
    variants: {
      tone: {
        neutral: "bg-surface-2 text-ink",
        /* Mismo tile neutro pero icono apagado: lo usa el vacio de busqueda,
           donde el icono es contexto y no protagonista. */
        muted: "bg-surface-2 text-ink-600",
        brand: "bg-lavender text-on-accent",
        success: "bg-tint-success text-fg-success",
        error: "bg-tint-error text-fg-error",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

type EmptyStateVariants = VariantProps<typeof emptyState>;
type TileVariants = VariantProps<typeof emptyStateTile>;

export interface EmptyStateProps
  extends
    Omit<React.ComponentPropsWithoutRef<"div">, "title" | "color">,
    EmptyStateVariants,
    TileVariants {
  /**
   * Icono del tile. Se espera un icono de Phosphor, la libreria oficial del
   * sistema; packages/ui no depende de @phosphor-icons y este encargo no puede
   * añadir dependencias, asi que lo aporta quien consume el componente.
   *
   * Hereda el color del tono via currentColor y se dibuja a 28px.
   * Si no se pasa, el tile no se renderiza.
   */
  icon?: React.ReactNode;
  /**
   * Titulo breve, en Funnel Display 500.
   *
   * Ojo con el nombre: sombrea el atributo HTML `title` (el tooltip nativo), y
   * por eso el tipo lo omite de las props del div. Un tooltip encima de un
   * texto que ya es visible no aporta nada.
   */
  title?: React.ReactNode;
  /**
   * Nivel del encabezado del titulo. Se renderiza como <h1>..<h6> real para que
   * quien navega con lector de pantalla pueda saltar al vacio desde la lista de
   * encabezados; un <div> con pinta de titulo no aparece en esa lista.
   *
   * Por defecto 3: un vacio suele vivir dentro de una seccion que ya tiene su
   * propio h2. Ajustalo al esquema de tu pagina.
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /**
   * Accion unica. Pensada para un `<EmptyStateAction>`, que ya trae las medidas
   * del prototipo; acepta cualquier nodo si hace falta otra cosa.
   *
   * Una sola: si el vacio necesita dos acciones con jerarquia, el problema no
   * es el vacio sino la pantalla.
   */
  action?: React.ReactNode;
  /**
   * Anuncia el vacio a los lectores de pantalla al aparecer (role="status" +
   * aria-live="polite").
   *
   * No esta activo por defecto a proposito: un vacio de primera vez ya forma
   * parte del render inicial y anunciarlo seria ruido. Se activa cuando el
   * vacio SUSTITUYE a un resultado — "Sin resultados" tras buscar, "Sin
   * conexion" tras fallar una carga — porque ahi el cambio ocurre lejos del
   * foco y sin aviso nadie se entera.
   *
   * Con `announce` el contenido se pinta un commit despues que el contenedor,
   * para que la region viva exista vacia antes de recibir texto (ver el cuerpo
   * del componente). No lo actives en contenido que deba salir ya pintado en el
   * HTML del servidor.
   */
  announce?: boolean;
}

/**
 * Empty state del sistema Tikin — EXTENSION (seccion 32).
 *
 * Icono neutro en tile suave, titulo breve, mensaje calido y una sola accion.
 * La primera vez es una invitacion, no un error: el texto dice por que esta
 * vacio y cual es el siguiente paso.
 *
 * El hue del tile solo cambia para error (rojo) y exito (verde). Sin
 * ilustraciones cargadas.
 */
export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  {
    className,
    bordered,
    tone = "neutral",
    icon,
    title,
    headingLevel = 3,
    action,
    announce = false,
    role,
    children,
    ...props
  },
  ref,
) {
  const Heading = `h${headingLevel}` as const;

  // role explicito gana siempre: hay casos raros (un vacio dentro de una region
  // viva que ya existe) donde duplicar el anuncio molesta, y ahi el consumidor
  // se encarga del anuncio por su cuenta.
  const esRegionViva = role === undefined && announce;

  /* Una region viva que se INSERTA ya poblada no se anuncia: NVDA y JAWS solo
   * vigilan las regiones que ya existian en el DOM cuando su contenido cambia.
   * Y ese es justo el caso de `announce` — la lista se desmonta y el vacio
   * entero se monta de golpe —, asi que poner role="status" y quedarse tan
   * anchos no anunciaba nada.
   *
   * Por eso el contenido entra un commit despues: primer commit la region vacia
   * (ya observada), segundo commit el texto, que si cuenta como cambio. Es el
   * mismo truco del Toast de Radix.
   *
   * El precio es un frame con la tarjeta vacia, y solo cuando `announce` esta
   * activo — es decir, cuando el vacio acaba de sustituir a otra cosa y el ojo
   * del usuario ya estaba viendo un cambio. Sin `announce` no hay diferimiento
   * y el render sigue siendo sincrono (importa para SSR). */
  const [regionLista, setRegionLista] = React.useState(false);
  React.useEffect(() => {
    if (esRegionViva) setRegionLista(true);
  }, [esRegionViva]);
  const muestraContenido = !esRegionViva || regionLista;

  return (
    <div
      ref={ref}
      className={cn(emptyState({ bordered, className }))}
      role={role ?? (announce ? "status" : undefined)}
      // Redundante con role="status" sobre el papel, pero hay combinaciones de
      // lector y navegador que solo respetan la region viva si aria-live esta
      // escrito. No cuesta nada y evita que el anuncio se pierda.
      aria-live={esRegionViva ? "polite" : undefined}
      {...props}
    >
      {muestraContenido && (
        <>
          {icon && (
            <div className={cn(emptyStateTile({ tone }))} aria-hidden="true">
              {icon}
            </div>
          )}

          {/* Las tres ranuras se guardan por veracidad, igual que `action`, y no
              por `!== undefined`. Con la comprobacion estricta, el patron
              habitual `title={cond && "..."}` o un `title=""` colaban un <h3>
              vacio — encabezado sin texto, que axe reporta como violacion de
              WCAG 2.4.6 — y un <p> vacio que ademas se comia 12px del gap del
              contenedor. Un titulo o un mensaje que valen 0 no existen en un
              vacio, asi que la veracidad no pierde ningun caso real. */}
          {title && (
            // El h* no arrastra los margenes del navegador porque el reset de
            // Tailwind ya los quita; el ritmo lo pone el gap del contenedor.
            <Heading className="font-display text-[17px] font-medium text-ink">{title}</Heading>
          )}

          {children && (
            // max-w 240 (max-w-60) mantiene la medida de lectura corta: centrado
            // y a ancho completo el mensaje se vuelve ilegible en desktop.
            <p className="max-w-60 text-[13.5px] leading-[1.5] text-ink-600">{children}</p>
          )}

          {/* mt-1 son los 4px extra que el prototipo mete solo delante de la
              accion, ademas del gap de 12. */}
          {action && <div className="mt-1">{action}</div>}
        </>
      )}
    </div>
  );
});

/* -------------------------------------------------------------------------- */

/* ESTADOS DE LA ACCION: default / hover / pressed / disabled, los cuatro que la
 * seccion 05 exige a cualquier boton del sistema. Aunque las medidas obliguen a
 * no reutilizar `Button` (h40/r12/px18/13px frente a los h40/r10/px20/14px del
 * tamaño M), los estados si se copian de el.
 *
 * DISABLED: `Button` compacto usa la pareja aprobada de Figma
 * --button-primary-bg-disable rgb(236,237,238) / --button-primary-text-disable
 * rgb(124,126,127) (~3.5:1). Aqui se escribe con surface-3 / ink-600, que en
 * claro son rgb(238,238,238) y rgb(110,110,110) — la misma pareja a simple
 * vista — pero SI se invierten en oscuro. Los dos tokens --button-*-disable no
 * estan redefinidos en el bloque .dark de figma.css, asi que usarlos literales
 * dejaria una pastilla casi blanca sobre una pagina casi negra.
 * La pareja anterior (bg-edge sobre ink-400) daba ~1.5:1 en claro y ~2.1:1 en
 * oscuro: el label deshabilitado no se leia. */
const emptyStateAction = cva(
  [
    "inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-[18px]",
    "font-mono text-[13px] font-normal tracking-[0.02em] whitespace-nowrap uppercase",
    // select-none igual que Button: al pulsar y arrastrar sobre un boton el
    // navegador selecciona el label, y una seleccion azul sobre MAYUSCULAS mono
    // se lee como un fallo de render.
    "transition-colors duration-140 ease-[ease] select-none",
    "outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-page",
    "disabled:cursor-not-allowed",
    // Los iconos del prototipo van a 15px, mas pequeños que el label.
    "[&_svg]:size-[15px] [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        /* Relleno de tinta: la invitacion (ENVIAR DINERO, CREAR BOLSILLO). */
        primary: [
          "bg-ink text-surface",
          "hover:not-disabled:bg-ink-800",
          // Pressed: la tinta va a su extremo, igual que Button
          // (--button-primary-bg-pressed = grayscale-900 = rgb(11,11,11)).
          // Se escribe con ink-strong y no con el literal de Figma porque
          // ink-strong ES ese valor en claro y se invierte a blanco en oscuro;
          // el literal dejaria un boton negro sobre pagina negra al pulsar.
          "active:not-disabled:bg-ink-strong",
          "disabled:bg-surface-3 disabled:text-ink-600",
        ],
        /* Contorno de tinta: el reintento del error (REINTENTAR). Borde por
           inset shadow y no por border, igual que en Button: asi el alto sigue
           siendo 40 exactos y no 42. */
        secondary: [
          "bg-transparent text-ink shadow-[inset_0_0_0_1px_var(--tk-ink)]",
          "hover:not-disabled:bg-surface-2",
          // Pressed invierte a relleno, como el secondary de Button.
          "active:not-disabled:bg-ink active:not-disabled:text-surface",
          "disabled:text-ink-400 disabled:shadow-[inset_0_0_0_1px_var(--tk-border)]",
        ],
        /* Contorno tenue: la salida secundaria de un vacio que no es error
           (LIMPIAR BUSQUEDA). */
        quiet: [
          "bg-transparent text-ink shadow-[inset_0_0_0_1px_var(--tk-border-2)]",
          "hover:not-disabled:bg-surface-2",
          // Pressed solo profundiza el relleno un escalon: esta accion es la
          // salida discreta y no debe gritar mas que la primaria del vacio.
          "active:not-disabled:bg-surface-3",
          "disabled:text-ink-400 disabled:shadow-[inset_0_0_0_1px_var(--tk-border)]",
        ],
      },
    },
    defaultVariants: { variant: "primary" },
  },
);

export interface EmptyStateActionProps
  extends React.ComponentPropsWithoutRef<"button">, VariantProps<typeof emptyStateAction> {
  /** Icono antes del label, a 15px. */
  startIcon?: React.ReactNode;
}

/**
 * Accion del empty state — EXTENSION, medidas del prototipo de la seccion 32.
 *
 * Alto 40, radio 12, px 18 y mono 13: no coincide con ningun tamaño de
 * `Button` (M es 40/r10/px20/texto 14), asi que se implementa aqui en vez de
 * reutilizarlo. Sin tamaños ni full-width: un vacio lleva una sola accion.
 *
 * El label va en MAYUSCULAS por CSS, nunca con `.toUpperCase()` en JS: eso
 * romperia el texto que anuncia el lector de pantalla y lo que el usuario copia
 * al portapapeles.
 */
export const EmptyStateAction = React.forwardRef<HTMLButtonElement, EmptyStateActionProps>(
  function EmptyStateAction({ className, variant, startIcon, type, children, ...props }, ref) {
    return (
      <button
        ref={ref}
        // Sin type explicito un <button> envia el formulario que lo contenga, y
        // un vacio de "sin resultados" vive justo debajo de un buscador.
        type={type ?? "button"}
        className={cn(emptyStateAction({ variant, className }))}
        {...props}
      >
        {startIcon}
        {children}
      </button>
    );
  },
);
