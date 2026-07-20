import * as React from "react";
import * as Slot from "radix-ui/slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/* Seccion 10 · Cards — EXTENSION construida con los tokens del archivo.
 *
 * El propio documento lo dice en su bajada: "Contenedores de informacion de la
 * app. Extension construida con los tokens del archivo". No hay componente
 * Card en el export de Figma (docs/figma-export/components/ no trae ninguno),
 * asi que NADA de esta seccion es especificacion aprobada: es una propuesta
 * coherente montada sobre superficies, bordes, radios y sombras que si son
 * canonicos.
 *
 * Contenedor base — radio 20 · padding 24 (movil 20) · borde 1 · shadow xs.
 * Sobre el se especializan tres roles:
 *
 *   feature  presenta una funcion. Superficie gris 100, icono 56 en tile
 *            blanco, titulo Funnel 22, descripcion Sans 15.
 *   media    promocion con imagen a sangre, scrim inferior, eyebrow glass,
 *            accion en la esquina y titulo Funnel blanco.
 *   stat     una metrica: label mono, pildora de delta con tendencia, cifra
 *            DM Mono 38, comparacion y sparkline.
 *
 * OJO CON EL BLOQUE "PRUEBALO · EN VIVO"
 * --------------------------------------
 * Esa demo usa tarjetas de 150px con radio 16 y cifra de 32 para que quepan en
 * la rejilla del documento. Las medidas buenas son las de los bloques
 * "CONTENEDOR BASE · ANATOMIA" y "TRES TIPOS PRINCIPALES": radio 20, padding
 * 24 y cifra 38.
 */

const card = cva(
  [
    // relative: la media card apila imagen y scrim en absoluto sobre el.
    "relative flex flex-col",
    "transition-[box-shadow,transform,background-color,border-color] duration-140 ease-out",
  ],
  {
    variants: {
      /* "Blanco sobre fondo hueso, o gris 100 cuando la tarjeta va sobre
         blanco. Nunca dos blancos seguidos sin borde." */
      surface: {
        // La sombra NUNCA reemplaza al borde: van juntos.
        default: "border border-edge bg-surface text-ink shadow-xs",
        // Gris 100 ya se separa del blanco por si mismo, no lleva borde.
        muted: "bg-surface-2 text-ink",
        // Tinta: la balance card (saldo, resumen). bg-ink + text-surface se
        // invierten los DOS con el tema, asi que el contraste se mantiene en
        // oscuro sin congelar nada. Ese "los dos a la vez" es el requisito:
        // la media card reusa este par pero congelando el tema alrededor,
        // porque su fondo es una foto y una foto no se invierte.
        ink: "bg-ink text-surface",
      },

      /* radio 20 por defecto; 16 en tarjetas densas, 24 en contenedores
         grandes. El 24 no tiene utilidad propia en el tema — la escala se
         corta en --radius-2xl (20) — asi que va por sintaxis arbitraria. */
      radius: {
        sm: "rounded-xl",
        md: "rounded-2xl",
        lg: "rounded-[24px]",
      },

      /* Padding 24, que baja a 20 en movil. Mobile-first: p-5 y a partir de sm
         p-6. */
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-5 sm:p-6",
      },

      /* Tocable: reposo shadow xs -> hover shadow md + lift 2 -> pressed hueso
         sin sombra. El lift se hace con translate, no con margin, para no
         reflowear a los hermanos de la rejilla. */
      interactive: {
        true: [
          "cursor-pointer text-left outline-none",
          "hover:-translate-y-0.5 hover:shadow-md",
          "active:translate-y-0 active:bg-page active:shadow-none",
          "focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-page",
        ],
        false: "",
      },
    },

    compoundVariants: [
      /* El cambio de borde a gris 230-2 que pide el documento vive aqui y no en
         `interactive`: solo la superficie default lleva clase `border`, asi que
         en muted y en ink un `hover:border-edge-2` suelto no pintaba nada — el
         preflight deja border-width:0 y el color no tiene donde caer. Ni el
         documento pide borde en esas dos superficies ni conviene añadirselo
         (creceria la caja 2px). Alli el feedback lo dan sombra, lift y fondo. */
      {
        surface: "default",
        interactive: true,
        class: "hover:border-edge-2 active:border-edge-2",
      },
      /* El pressed generico (hueso) borraria la tarjeta de tinta. Sobre tinta
         el feedback va al reves: sube a ink-strong, que en claro es mas negro
         y en oscuro mas blanco. */
      { surface: "ink", interactive: true, class: "active:bg-ink-strong" },
    ],

    defaultVariants: {
      surface: "default",
      radius: "md",
      padding: "md",
      interactive: false,
    },
  },
);

type CardVariants = VariantProps<typeof card>;

export interface CardProps extends React.ComponentPropsWithoutRef<"div">, CardVariants {
  /**
   * Renderiza el hijo en vez de un <div>, heredando los estilos.
   * Es la forma PREFERIDA de hacer una tarjeta tocable: pasa un <button> o un
   * <a> y el foco, el rol y el teclado vienen del navegador.
   */
  asChild?: boolean;
}

/**
 * Contenedor base del sistema Tikin.
 *
 * Todas las tarjetas parten de aqui: superficie, borde de 1px y radio del
 * sistema. La elevacion es un refuerzo, nunca un sustituto del borde.
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    className,
    surface,
    radius,
    padding,
    interactive,
    asChild = false,
    role,
    tabIndex,
    onKeyDown,
    ...props
  },
  ref,
) {
  const Comp = asChild ? Slot.Root : "div";

  /* Una tarjeta tocable sin semantica es una trampa para teclado y para lector
   * de pantalla. Lo correcto es `asChild` con un <button> o un <a>; cuando el
   * consumidor no lo hace, le damos el minimo imprescindible — rol, foco y
   * teclado — en vez de dejar la tarjeta accesible solo con raton.
   *
   * Son DOS decisiones, no una. Antes iban atadas al mismo booleano y un
   * `role="link"` del consumidor apagaba tambien el foco y el teclado: quedaba
   * un div con cursor-pointer, fuera del orden de tabulacion y sin activacion.
   * Que el consumidor sepa mejor que nosotros COMO se llama su tarjeta no
   * significa que renuncie a poder usarla.
   *
   * Sigue sin pisarse lo que venga a mano: su role manda sobre el fallback, y
   * su tabIndex sobre el 0 (asi puede sacarla del tab con -1 si lleva un
   * roving tabindex). */
  const necesitaTeclado = Boolean(interactive) && !asChild;
  const rolFallback = necesitaTeclado && role === undefined;
  const rolEfectivo = rolFallback ? "button" : role;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (!necesitaTeclado || event.defaultPrevented) return;
    // Si la tecla nace en un hijo interactivo (el boton de accion de la media
    // card, un enlace del cuerpo) es suya, no de la tarjeta.
    if (event.target !== event.currentTarget) return;
    // Enter activa cualquier rol; Espacio solo el de boton. Un role="link" no
    // se activa con Espacio en ningun navegador, y robarselo le quitaria al
    // usuario el scroll de pagina a cambio de nada.
    const activa = event.key === "Enter" || (event.key === " " && rolEfectivo === "button");
    if (!activa) return;
    // Espacio hace scroll de pagina por defecto; Enter en un div no hace nada,
    // pero se corta igual para que ningun ancestro lo interprete dos veces.
    event.preventDefault();
    // .click() en vez de llamar a onClick a mano: asi disparan tambien los
    // listeners nativos que el consumidor haya podido añadir al nodo.
    event.currentTarget.click();
  };

  return (
    <Comp
      ref={ref}
      className={cn(card({ surface, radius, padding, interactive, className }))}
      role={rolEfectivo}
      tabIndex={necesitaTeclado ? (tabIndex ?? 0) : tabIndex}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
});

/* ------------------------------------------------------------------ */
/* Rol FEATURE                                                         */
/* ------------------------------------------------------------------ */

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div";

export interface CardFeatureProps extends Omit<CardProps, "title"> {
  /** Icono del tile de 56. Se dibuja a 28px. */
  icon?: React.ReactNode;
  /** Titulo en Funnel Display 22. */
  title: React.ReactNode;
  /** Descripcion en Sans 15. */
  description?: React.ReactNode;
  /**
   * Etiqueta del titulo. Por defecto h3, pero el nivel correcto depende de
   * donde caiga la tarjeta en la pagina: un esquema de encabezados roto es un
   * fallo de accesibilidad real.
   */
  titleAs?: HeadingTag;
  /** Contenido extra bajo la descripcion (un boton, un enlace). */
  children?: React.ReactNode;
}

/**
 * Tarjeta que presenta una funcion de la app.
 *
 * Superficie gris 100 — va sobre blanco — con el icono arriba y el bloque de
 * texto anclado abajo, para que varias feature cards en una rejilla alineen
 * sus titulos aunque los iconos difieran.
 */
export const CardFeature = React.forwardRef<HTMLDivElement, CardFeatureProps>(function CardFeature(
  { className, icon, title, description, titleAs: Title = "h3", children, ...props },
  ref,
) {
  return (
    <Card ref={ref} surface="muted" className={cn("min-h-[300px]", className)} {...props}>
      {icon ? (
        // Tile blanco de 56 con radio 16 y shadow xs: el icono flota sobre el
        // gris 100 sin necesitar borde.
        <div className="flex size-14 items-center justify-center rounded-xl bg-surface text-ink shadow-xs [&_svg]:size-7">
          {icon}
        </div>
      ) : null}
      {/* Empuja el texto al fondo de la tarjeta. */}
      <div className="flex-1" />
      <div className="flex flex-col gap-2">
        <Title className="font-display text-[22px] leading-tight font-medium text-ink-700">
          {title}
        </Title>
        {description ? <p className="text-[15px] leading-[1.5]">{description}</p> : null}
        {children}
      </div>
    </Card>
  );
});

/* ------------------------------------------------------------------ */
/* Rol MEDIA                                                           */
/* ------------------------------------------------------------------ */

interface CardMediaOwnProps extends Omit<CardProps, "surface" | "padding" | "title"> {
  /** Imagen a sangre. Se estira al contenedor y se recorta con object-cover. */
  image?: React.ReactNode;
  /** Etiqueta corta sobre cristal, arriba a la izquierda. */
  eyebrow?: React.ReactNode;
  /** Titulo en Funnel Display 26. */
  title: React.ReactNode;
  description?: React.ReactNode;
  titleAs?: HeadingTag;
  children?: React.ReactNode;
}

/* La accion y su nombre accesible viajan juntos o no viajan.
 *
 * El icono de la esquina es un <svg> decorativo dentro de un boton circular sin
 * texto: sin `actionLabel` sale un boton anonimo, que para un lector de
 * pantalla es "boton" y nada mas. Cuando era un `actionLabel?: string` con un
 * JSDoc que decia "obligatorio", olvidarlo no costaba ni un aviso. Como union
 * discriminada el compilador lo exige, que es donde se detecta gratis. */
type CardMediaActionProps =
  | {
      /** Icono de la accion circular de la esquina (la ↗ del documento). */
      action: React.ReactNode;
      /** Nombre accesible de esa accion. */
      actionLabel: string;
      onActionClick?: React.MouseEventHandler<HTMLButtonElement>;
    }
  | { action?: never; actionLabel?: never; onActionClick?: never };

export type CardMediaProps = CardMediaOwnProps & CardMediaActionProps;

/**
 * Tarjeta de promocion con imagen a sangre.
 *
 * El color entra por la imagen, nunca por un gradiente decorativo: el unico
 * gradiente permitido aqui es el scrim que garantiza el contraste del texto.
 */
export const CardMedia = React.forwardRef<HTMLDivElement, CardMediaProps>(function CardMedia(
  {
    className,
    image,
    eyebrow,
    title,
    description,
    action,
    actionLabel,
    onActionClick,
    titleAs: Title = "h3",
    children,
    ...props
  },
  ref,
) {
  return (
    <Card
      ref={ref}
      // Tinta de fondo para el hueco mientras la imagen carga, y para que el
      // scrim tenga sobre que caer si no hay imagen.
      surface="ink"
      padding="none"
      /* `tk-static` congela el tema DENTRO de la tarjeta, y es la pieza que
       * sostiene todo lo demas.
       *
       * El fondo de esta tarjeta no es una superficie de la interfaz: es una
       * fotografia, y una fotografia no se invierte cuando la pagina pasa a
       * oscuro. Si la tarjeta reacciona al tema y su contenido no, los dos
       * regimenes se cruzan: `bg-ink` sube a casi blanco en oscuro mientras el
       * texto de encima sigue siendo claro, y el bloque queda ilegible cuando
       * no hay imagen (o mientras carga).
       *
       * Congelando el tema en el contenedor, el par `bg-ink` / `text-surface`
       * significa siempre lo mismo — fondo oscuro, tinta clara — sin escribir
       * un solo color fijo. Es exactamente lo que hace el documento con este
       * bloque, y de paso da a los hijos del consumidor un contexto coherente:
       * dentro de la media card, `surface` es "encima de la foto" e `ink` es
       * "la foto". */
      className={cn(
        "tk-static min-h-[300px] overflow-hidden",
        /* El anillo de foco de `interactive` se dibuja HACIA DENTRO. El de la
           Card normal usa `ring-ink` sobre `ring-offset-page`, que son tokens
           del tema de la pagina; aqui `tk-static` tambien los congela, asi que
           sobre una pagina oscura el anillo salia casi negro (invisible) y el
           hueco hueso hacia de anillo: el indicador quedaba del reves.
           Un anillo inset se apoya en la propia tarjeta, que siempre es
           oscura, asi que no depende del tema de la pagina en absoluto. */
        "focus-visible:ring-surface focus-visible:ring-offset-0 focus-visible:ring-inset",
        className,
      )}
      {...props}
    >
      {image ? (
        <div className="absolute inset-0 [&_img]:size-full [&_img]:object-cover [&>*]:size-full">
          {image}
        </div>
      ) : null}

      {/* Scrim: transparente arriba, 78% de tinta abajo. Va aparte de la
          imagen para que el consumidor pueda pasar un <picture>, un <video> o
          un slot de su CMS sin tener que replicarlo.

          La tinta sale del token y no de un literal: dentro del contexto
          congelado --tk-ink vale siempre rgb(11,15,16), asi que el scrim
          oscurece igual en claro y en oscuro sin quedar desconectado de la
          paleta. Se usa --tk-* y no --color-*: los colores del tema van en un
          `@theme inline`, que no publica variables, solo las inlinea en las
          utilidades. El paso intermedio tambien pasa por color-mix para no
          depender de como interpole el navegador hacia `transparent`. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--tk-ink)_15%,transparent)_0%,color-mix(in_srgb,var(--tk-ink)_0%,transparent)_38%,color-mix(in_srgb,var(--tk-ink)_78%,transparent)_100%)]"
      />

      {/* Todo el color de aqui es semantico y se resuelve contra el tema
          congelado del contenedor: `surface` es la tinta clara que se lee
          sobre la foto. Antes iba en blanco fijo, y ese blanco era justo lo
          que se despegaba del fondo cuando la pagina pasaba a oscuro. */}
      <div className="relative flex flex-1 flex-col p-5 text-surface">
        <div className="flex items-start gap-3">
          {eyebrow ? (
            // Mayusculas por CSS: el texto accesible y el copiado conservan su
            // capitalizacion original.
            <span className="rounded-pill border border-surface/28 bg-surface/16 px-3 py-1.5 font-mono text-[11px] tracking-[0.12em] uppercase backdrop-blur-[6px]">
              {eyebrow}
            </span>
          ) : null}
          {action ? (
            <button
              type="button"
              aria-label={actionLabel}
              onClick={onActionClick}
              /* El anillo de foco necesita DOS tonos. El fondo de esta tarjeta
                 es una fotografia cualquiera: un anillo claro se pierde sobre
                 una foto clara — el caso normal de una promocion — igual que
                 uno oscuro sobre una foto oscura. Con el hueco pintado en
                 tinta congelada, el indicador siempre tiene un borde de
                 contraste contra la imagen, venga como venga. */
              className="ml-auto flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-pill border border-surface/40 transition-colors duration-140 ease-out outline-none hover:bg-surface/15 focus-visible:ring-2 focus-visible:ring-surface focus-visible:ring-offset-2 focus-visible:ring-offset-ink [&_svg]:size-[18px]"
            >
              {action}
            </button>
          ) : null}
        </div>
        <div className="flex-1" />
        <div className="flex flex-col gap-1.5">
          <Title className="font-display text-[26px] leading-[1.05] font-semibold">{title}</Title>
          {description ? (
            <p className="text-sm leading-[1.45] text-surface/88">{description}</p>
          ) : null}
          {children}
        </div>
      </div>
    </Card>
  );
});

/* ------------------------------------------------------------------ */
/* Rol STAT                                                            */
/* ------------------------------------------------------------------ */

/* El texto de la seccion dice "delta lima + tendencia", pero el prototipo usa
 * --tk-tint-success / --tk-fg-success (verde de feedback, no lima de marca).
 * Manda el prototipo: la lima es color de marca para acciones, y una metrica a
 * la baja necesita su equivalente en rojo, que la paleta de marca no ofrece. */
const statDelta = cva(
  "ml-auto inline-flex shrink-0 items-center gap-[3px] rounded-pill px-2.5 py-1 font-mono text-xs tracking-[0.02em] [&_svg]:size-[13px]",
  {
    variants: {
      trend: {
        up: "bg-tint-success text-fg-success",
        down: "bg-tint-error text-fg-error",
        flat: "bg-surface-2 text-ink-600",
      },
    },
    defaultVariants: { trend: "up" },
  },
);

/* La tendencia NO puede viajar solo en el color de la pildora (WCAG 1.4.1).
 * `trendIcon` es opcional, y aunque se pase es decorativo: sin este texto, una
 * caida del 8.1% y una subida del 8.1% se leen exactamente igual en un lector
 * de pantalla, y en escala de grises tampoco se distinguen. Va en sr-only —
 * nunca display:none, que no lo lee nadie — delante de la cifra, que es el
 * orden en que se dice en voz alta: "a la baja 8.1%". */
const trendLabels: Record<NonNullable<CardStatProps["trend"]>, string> = {
  up: "al alza",
  down: "a la baja",
  flat: "sin cambio",
};

export interface CardStatProps extends Omit<CardProps, "surface"> {
  /** Label de seccion, mono y en mayusculas por CSS. */
  label: React.ReactNode;
  /** La cifra. Siempre DM Mono (font-num), 38. */
  value: React.ReactNode;
  /** Contenido de la pildora de delta: "12.4%". */
  delta?: React.ReactNode;
  /** Colorea la pildora. Solo eso: el signo lo escribe el consumidor. */
  trend?: "up" | "down" | "flat";
  /** Icono de tendencia dentro de la pildora, antes del delta. */
  trendIcon?: React.ReactNode;
  /**
   * Texto solo para lector de pantalla que dice la tendencia con palabras.
   * Por defecto "al alza" / "a la baja" / "sin cambio". Pasa cadena vacia si el
   * delta ya lo dice ("+12.4% mas que el mes pasado") para no duplicarlo.
   */
  trendLabel?: string;
  /** Linea de comparacion bajo la cifra. */
  comparison?: React.ReactNode;
  /** Sparkline. Se le reserva una banda de 64px al pie de la tarjeta. */
  chart?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * Tarjeta de una sola metrica con su tendencia.
 *
 * Una cifra por tarjeta. Si hay dos metricas que comparar, son dos tarjetas:
 * la comparacion es la linea de apoyo, no una segunda cifra.
 */
export const CardStat = React.forwardRef<HTMLDivElement, CardStatProps>(function CardStat(
  {
    className,
    label,
    value,
    delta,
    trend = "up",
    trendIcon,
    trendLabel = trendLabels[trend],
    comparison,
    chart,
    children,
    ...props
  },
  ref,
) {
  return (
    /* El min-height 300 del documento vale para los TRES roles, no solo para
       feature y media: sin el, el `flex-1` que ancla el sparkline al fondo no
       tiene sobrante que repartir y la tarjeta se encoge al alto de su
       contenido, que era justo lo que obligaba a parchearlo desde fuera. */
    <Card ref={ref} className={cn("min-h-[300px] gap-4", className)} {...props}>
      <div className="flex items-center gap-2.5">
        <span className="font-mono text-xs tracking-[0.1em] text-ink-600 uppercase">{label}</span>
        {delta ? (
          <span className={statDelta({ trend })}>
            {trendLabel ? <span className="sr-only">{`${trendLabel} `}</span> : null}
            {trendIcon}
            {delta}
          </span>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        {/* Sin color propio: hereda el de la superficie de la tarjeta. */}
        <span className="font-num text-[38px] leading-none font-medium">{value}</span>
        {comparison ? <span className="text-[13px] text-ink-600">{comparison}</span> : null}
      </div>

      {children}

      {chart ? (
        <>
          {/* Empuja el sparkline al fondo para que varias stat cards de una
              misma rejilla lo alineen aunque su comparacion ocupe distinto. */}
          <div className="flex-1" />
          <div className="[&>svg]:block [&>svg]:h-16 [&>svg]:w-full">{chart}</div>
        </>
      ) : null}
    </Card>
  );
});
