import * as React from "react";
import * as Slot from "radix-ui/slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/* Seccion 26 · Navigation — EXTENSION.
 *
 * La entradilla del documento lo dice con todas las letras: "Extension
 * construida con los tokens del archivo". Ni TopBar, ni TabBar, ni Sidebar
 * existen como componente en el archivo de Figma. Todo lo de aqui es propuesta
 * coherente con los tokens --tk-*, NO especificacion aprobada: no lo cites como
 * canonico.
 *
 * QUE CUBRE CADA COMPONENTE (los cuatro bloques del documento)
 *
 *   TabBar    barra inferior de la app movil. 4 destinos como maximo mas la
 *             accion central de envio, elevada y en tinta.
 *   TopBar    app bar superior, con tres formas:
 *               flow  back + titulo + accion, dentro de un flujo
 *               home  saludo + campana + titulo grande, en pantallas raiz
 *               web   logo + links + buscar/campana/avatar, en escritorio
 *   Sidebar   rail de 220 del dashboard de dispersion, con contador y usuario
 *             abajo.
 *   Breadcrumbs
 *             ruta del dashboard web, que el pie del bloque WEB · SIDEBAR pide
 *             con todas las letras ("breadcrumbs con caret, actual en tinta") y
 *             el prototipo dibuja en el panel de la derecha.
 *
 * GEOMETRIA (fuente: el HTML del prototipo, que aplica los estilos inline)
 *
 *   TabBar        padding 10 / 8 / 14 · items de 64 de ancho, gap 4, pt 6
 *                 icono 24 · label Ubuntu Mono 9 con tracking .04em
 *                 activo tinta · inactivo gris 500
 *                 accion central 52 redonda, tinta, a -14 del borde superior
 *   TopBar flow   padding 12/14 · gap 12 · back y accion de 40 r10, icono 20
 *                 titulo Funnel 500 16
 *   TopBar home   padding 12/14/16 · saludo mono 12 en gris 600 · campana 40
 *                 con punto rojo de 7 · titulo Funnel 600 26
 *   TopBar web    padding 12/20 · gap 28 · logo Funnel 600 20 tracking -.01em
 *                 links Ubuntu Sans 14, activo con subrayado de 2 en tinta
 *                 bloque derecho gap 14 · avatar 32
 *   Sidebar       rail 220 · padding 20/12 · gap 4 · marca Funnel 600 18
 *                 item r10, padding 9/10, icono 17, texto 13.5
 *                 activo = tinta invertida · hover superficie 2
 *                 contador lima r999, 18 de alto, mono 10
 *                 usuario abajo: tarjeta r10 con borde, avatar 28
 *   Breadcrumbs   gap 6 · texto 12.5 · caret 11 en gris 400
 *                 tramos en gris 600 · actual en tinta
 *
 * DECISIONES QUE SE APARTAN DEL PROTOTIPO, Y POR QUE
 * -------------------------------------------------
 * 1. NI BORDE NI RADIO EN EL CONTENEDOR, PERO SI HAIRLINE EN LA TAB BAR. El
 *    prototipo envuelve cada bloque en `border:1px solid var(--tk-border);
 *    border-radius:16px`, y a la tab bar le añade ademas --shadow-xs. Ese marco
 *    es el chasis de la demo — el mismo que usa para simular la ventana del
 *    dashboard alrededor del sidebar —, no anatomia del componente: una app bar
 *    real va pegada al borde de la pantalla.
 *    La sombra tampoco se copia tal cual, porque --shadow-xs proyecta hacia
 *    ABAJO y una barra anclada al fondo de la pantalla la manda fuera de vista.
 *    Lo que si es anatomia es la SEPARACION que esa sombra consigue: el
 *    contenido scrollea por debajo de la tab bar y bg-surface sobre bg-page
 *    coincide en algunos temas, asi que sin limite la barra se funde con la
 *    pantalla. Por eso la TabBar lleva `border-t border-edge`, y solo eso.
 *    La TopBar no lo lleva: no siempre va fijada, y quien la fije pide
 *    "border-b border-edge" por className, que para eso pasa todo por cn(). Por
 *    la misma via se quita el de la tab bar ("border-t-0").
 *
 * 2. EL TITULO DEL FLUJO NO VA CENTRADO. El panel de reglas dice "back +
 *    titulo centrado + accion", pero el prototipo lo dibuja pegado al back, con
 *    la accion empujada por margin-left:auto. Manda lo dibujado: es la unica de
 *    las dos fuentes con medidas, y un titulo centrado de verdad obliga a
 *    posicionamiento absoluto que se rompe en cuanto el texto es largo.
 *
 * 3. LOS ICONOS DE LA WEB VAN EN CAJA DE 32. El prototipo pinta los iconos de
 *    buscar y campana sueltos a 20px. Una diana de 20x20 se queda muy por
 *    debajo del minimo recomendado, asi que `TopBarAction size="s"` los mete en
 *    una caja de 32 — la misma altura que el avatar que tienen al lado, con lo
 *    que la barra conserva sus ~56 de alto.
 *
 * 4. LA ACCION CENTRAL VA EN MITAD DEL DOM. Esta posicionada en absoluto, asi
 *    que su sitio en el arbol es libre; la partimos entre las dos mitades de
 *    los destinos para que el orden de tabulacion y el de lectura coincidan con
 *    el orden visual.
 *
 * 5. `disabled` CON `asChild` NO VIAJA COMO ATRIBUTO. En el <a> que trae el
 *    consumidor `disabled` no existe: no bloquea el click, no bloquea el
 *    teclado y las variantes :disabled de la cva nunca casan, asi que la
 *    pestaña "inhabilitada" seguia navegando y pintada como activa. Con asChild
 *    se traduce a aria-disabled — que el lector si anuncia y sobre el que si
 *    hay variante de Tailwind — mas data-disabled y un corte del onClick a
 *    mano. El atributo nativo se sigue poniendo cuando el elemento es nuestro
 *    <button>; si el hijo del consumidor es un <button> de verdad y quiere el
 *    atributo, se lo pone en su propio elemento: Slot deja ganar las props del
 *    hijo.
 *
 * COLOR EN TEMA OSCURO
 * --------------------
 * Todo sale de utilidades semanticas (ink, surface, surface-2, page, edge,
 * ink-500/600/700, on-accent) que ya invierten con .dark. Tres excepciones
 * deliberadas, las tres de marca y por tanto identicas en ambos modos:
 *   - el contador del sidebar usa `bg-lime` (--colours-limegreen-400)
 *   - los avatares usan `bg-lavender` (--colours-lavenderblue-100)
 *   - el punto de aviso usa `bg-red` (--colours-purered-600)
 * Los tres llevan texto en `on-accent`, que es la tinta estable sobre acento.
 * La sombra de la accion central si es literal: una sombra proyectada es
 * oscura en los dos temas y no existe token para ella.
 */

/* El paquete no lleva @types/node y su tsconfig no se toca en este encargo, asi
 * que `process` se declara aqui como opcional. Se escribe con la forma literal
 * `process.env.NODE_ENV` a proposito: es la que los empaquetadores sustituyen
 * por una constante, de modo que el aviso de la TabBar desaparece del bundle de
 * produccion en vez de viajar como codigo muerto. */
declare const process: { env?: { NODE_ENV?: string } } | undefined;

/* Geometria de Phosphor — la libreria de iconos oficial del sistema — copiada a
 * mano (viewBox 256, peso regular) porque @phosphor-icons/react no es
 * dependencia de packages/ui y no toco su package.json. Solo la flecha de
 * volver y el caret de la ruta, que son anatomia del componente y no contenido
 * del consumidor: los iconos de los destinos si los pasa quien usa la barra. */
function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" focusable="false" {...props}>
      <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" />
    </svg>
  );
}

function CaretRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" focusable="false" {...props}>
      <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
    </svg>
  );
}

/* Punto de aviso. Decorativo a proposito: "hay algo sin leer" tiene que estar
   en el nombre accesible del boton que lo lleva, no colgando de un span suelto
   que el lector de pantalla anunciaria fuera de contexto. */
function AlertDot({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn("absolute size-[7px] rounded-full bg-red", className)} />
  );
}

/* Anillo de foco compartido. El offset cambia segun el fondo del contenedor:
   la app bar y la tab bar van sobre superficie, el sidebar sobre la pagina. */
const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2";

/* ------------------------------------------------------------------------- */
/* TopBar                                                                     */
/* ------------------------------------------------------------------------- */

const topBar = cva("flex w-full bg-surface", {
  variants: {
    variant: {
      /* padding 12/14 · gap 12 */
      flow: "items-center gap-3 px-3.5 py-3",
      /* padding 12/14/16, en columna: saludo arriba, titulo grande debajo */
      home: "flex-col px-3.5 pt-3 pb-4",
      /* padding 12/20 · gap 28 entre logo y links */
      web: "items-center gap-7 px-5 py-3",
    },
  },
  defaultVariants: { variant: "flow" },
});

type TopBarVariants = VariantProps<typeof topBar>;

export interface TopBarProps
  extends Omit<React.ComponentPropsWithoutRef<"header">, "title">, TopBarVariants {
  /**
   * Titulo de la pantalla. Se renderiza como `<h1>`: en una app la barra
   * superior ES el encabezado de la vista, y dejarlo en un span deja la
   * pantalla sin estructura para el lector.
   */
  title?: React.ReactNode;
  /** Solo en `home`. Saludo en mono sobre el titulo grande. */
  greeting?: React.ReactNode;
  /** Solo en `web`. Marca a la izquierda de los links. */
  logo?: React.ReactNode;
  /** Solo en `flow`. Si no se pasa, la barra no dibuja boton de volver. */
  onBack?: React.MouseEventHandler<HTMLButtonElement>;
  /** Nombre accesible del boton de volver: no tiene texto visible. */
  backLabel?: string;
  /** Sustituye la flecha por defecto. */
  backIcon?: React.ReactNode;
  /** Bloque derecho: `TopBarAction`, avatares, lo que sea. */
  actions?: React.ReactNode;
  /** Solo en `web`. Los `TopBarLink` del menu. */
  children?: React.ReactNode;
  /**
   * Nombre accesible del `<nav>` de links en `web`.
   *
   * Los tres landmarks de la seccion traen nombres distintos de fabrica
   * ("Navegación principal" aqui, "Navegación inferior" en `TabBar`,
   * "Navegación lateral" en `Sidebar`) porque un layout responsive los tiene a
   * la vez en el DOM aunque el CSS solo enseñe uno, y dos regiones con el mismo
   * nombre son indistinguibles en la lista de landmarks del lector.
   */
  navLabel?: string;
}

/**
 * App bar superior.
 *
 * - `flow` — dentro de un flujo: volver, titulo y una accion de apoyo. La barra
 *   inferior se oculta en estos pasos y aqui solo queda el back.
 * - `home` — pantallas raiz: saludo, campana y titulo grande en Funnel.
 * - `web` — escritorio: logo, links con subrayado en el activo y bloque de
 *   buscar / campana / avatar a la derecha.
 *
 * No lleva borde ni radio: el marco que se ve en el documento es el chasis de
 * la demo. Pide el separador por className si tu layout lo necesita.
 */
export const TopBar = React.forwardRef<HTMLElement, TopBarProps>(function TopBar(
  {
    className,
    variant = "flow",
    title,
    greeting,
    logo,
    onBack,
    backLabel = "Volver",
    backIcon,
    actions,
    children,
    navLabel = "Navegación principal",
    ...props
  },
  ref,
) {
  const actionsBlock = actions ? (
    <div className={cn("ml-auto flex items-center", variant === "web" ? "gap-3.5" : "gap-1")}>
      {actions}
    </div>
  ) : null;

  return (
    <header ref={ref} className={cn(topBar({ variant, className }))} {...props}>
      {variant === "flow" && (
        <>
          {onBack && (
            <TopBarAction label={backLabel} onClick={onBack}>
              {backIcon ?? <ArrowLeftIcon />}
            </TopBarAction>
          )}
          {title != null && (
            <h1 className="truncate font-display text-base font-medium text-ink">{title}</h1>
          )}
          {actionsBlock}
        </>
      )}

      {variant === "home" && (
        <>
          {/* El saludo y la campana comparten fila; el titulo grande va debajo,
              a 8 de separacion. */}
          <div className="mb-2 flex min-h-10 items-center gap-3">
            {greeting != null && (
              <span className="font-mono text-xs tracking-[0.02em] text-ink-600">{greeting}</span>
            )}
            {actionsBlock}
          </div>
          {title != null && (
            <h1 className="font-display text-[26px] font-semibold text-ink">{title}</h1>
          )}
        </>
      )}

      {variant === "web" && (
        <>
          {logo != null && (
            <span className="font-display text-xl font-semibold tracking-[-0.01em] text-ink">
              {logo}
            </span>
          )}
          {children && (
            <nav aria-label={navLabel} className="flex items-center gap-6">
              {children}
            </nav>
          )}
          {actionsBlock}
        </>
      )}
    </header>
  );
});

/* Caja de icono de la app bar. 40/r10 en movil, 32/r8 en la barra web para
   igualar la altura del avatar que lleva al lado. */
const topBarAction = cva(
  [
    "relative inline-flex shrink-0 cursor-pointer items-center justify-center",
    "text-ink transition-colors duration-140 ease-out",
    "hover:not-disabled:bg-surface-2",
    "disabled:cursor-not-allowed disabled:text-ink-500",
    focusRing,
    "focus-visible:ring-offset-surface",
    "[&_svg]:size-5 [&_svg]:shrink-0",
  ],
  {
    variants: {
      size: {
        m: "size-10 rounded-md",
        s: "size-8 rounded-sm",
      },
    },
    defaultVariants: { size: "m" },
  },
);

export interface TopBarActionProps
  extends React.ComponentPropsWithoutRef<"button">, VariantProps<typeof topBarAction> {
  /**
   * Nombre accesible. Obligatorio: el boton solo tiene icono.
   * Si llevas `dot`, dilo aqui — "Notificaciones, 3 sin leer" —, porque el
   * punto es decorativo y el lector de pantalla no lo va a anunciar.
   */
  label: string;
  /** Punto rojo de aviso en la esquina superior derecha. */
  dot?: boolean;
}

/** Boton de solo icono de la app bar. Volver, ayuda, buscar, campana. */
export const TopBarAction = React.forwardRef<HTMLButtonElement, TopBarActionProps>(
  function TopBarAction(
    { className, size = "m", label, dot = false, type, children, ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        // Dentro de un <form> un <button> sin type envia el formulario.
        type={type ?? "button"}
        aria-label={label}
        className={cn(topBarAction({ size, className }))}
        {...props}
      >
        {children}
        {dot && <AlertDot className={size === "s" ? "top-1 right-1" : "top-2 right-2"} />}
      </button>
    );
  },
);

/* Link del menu web. El subrayado del activo son 2px de tinta a 4 del texto;
   el inactivo lleva el mismo borde en transparente para que al activarse no
   salte la linea base. */
const topBarLink = cva(
  [
    "cursor-pointer border-b-2 pb-1 font-sans text-sm no-underline",
    "transition-colors duration-140 ease-out",
    focusRing,
    "focus-visible:ring-offset-surface",
  ],
  {
    variants: {
      active: {
        true: "border-ink text-ink",
        false: "border-transparent text-ink-600 hover:text-ink",
      },
    },
    defaultVariants: { active: false },
  },
);

export interface TopBarLinkProps extends React.ComponentPropsWithoutRef<"a"> {
  /** Texto del link. */
  label: React.ReactNode;
  /** Destino actual. Marca `aria-current="page"` ademas del subrayado. */
  active?: boolean;
  /**
   * Renderiza el hijo en vez de un `<a>`, heredando los estilos. Para envolver
   * el `Link` de tu router sin perder la semantica de enlace.
   */
  asChild?: boolean;
}

/** Destino del menu de la barra web. */
export const TopBarLink = React.forwardRef<HTMLAnchorElement, TopBarLinkProps>(function TopBarLink(
  { className, label, active = false, asChild = false, children, ...props },
  ref,
) {
  const Comp = asChild ? Slot.Root : "a";
  return (
    <Comp
      ref={ref}
      // El estado activo se comunica por ARIA, no solo por color: el
      // subrayado no existe para quien navega con lector de pantalla.
      aria-current={active ? "page" : undefined}
      className={cn(topBarLink({ active, className }))}
      {...props}
    >
      {/* Slottable marca cual de los hijos es el elemento del consumidor.
            Sin asChild `children` va vacio y solo se pinta el label. */}
      <Slot.Slottable>{children}</Slot.Slottable>
      {label}
    </Comp>
  );
});

/* ------------------------------------------------------------------------- */
/* TabBar                                                                     */
/* ------------------------------------------------------------------------- */

export interface TabBarProps extends React.ComponentPropsWithoutRef<"nav"> {
  /** Los destinos: `TabBarItem`. Cuatro como maximo. */
  children?: React.ReactNode;
  /** La accion central de envio: `TabBarAction`. */
  action?: React.ReactNode;
  /**
   * Nombre accesible del landmark de navegacion. Por defecto se nombra por su
   * posicion, no "principal": en un layout responsive la barra web y esta
   * conviven en el DOM y dos landmarks homonimos no se distinguen en el lector.
   */
  label?: string;
}

/**
 * Barra inferior de pestañas de la app movil.
 *
 * Cuatro destinos como maximo mas la accion central de envio. Acompaña a las
 * pantallas raiz; en los flujos modales se oculta y arriba solo queda el back.
 *
 * El destino activo lo decide quien consume (normalmente el router), pasando
 * `active` al item: la barra no guarda estado propio, asi no puede desfasarse
 * respecto a la URL.
 *
 * La accion central sobresale 14px por encima del borde superior. El contenedor
 * que la envuelva no puede recortar (`overflow: hidden`) o se corta el circulo.
 */
export const TabBar = React.forwardRef<HTMLElement, TabBarProps>(function TabBar(
  { className, children, action, label = "Navegación inferior", ...props },
  ref,
) {
  /* Los destinos se parten en dos mitades y la accion va entre ellas. Esta
     posicionada en absoluto, asi que no altera el reparto: dos grupos de
     flex-1 con justify-around dejan los items en los mismos octavos que un
     unico justify-around sobre los cuatro, y de paso el hueco central libre. */
  const items = React.Children.toArray(children);
  const half = Math.ceil(items.length / 2);

  /* Ese reparto en mitades SOLO cuadra con un numero par: con 3 o 5 destinos el
     grupo izquierdo se queda el item de mas mientras la accion sigue clavada en
     left-1/2, asi que el hueco central deja de estar centrado respecto a los
     items. La seccion fija el tope en "Maximo 4 pestañas", pero ni el tipo ni el
     runtime pueden imponerlo sin quitarle al consumidor el poder de construir
     los destinos con un .map(), asi que el aviso va en desarrollo. */
  const repartoTorcido = action != null && items.length % 2 !== 0;
  const demasiadosDestinos = items.length > 4;
  React.useEffect(() => {
    if (!repartoTorcido && !demasiadosDestinos) return;
    if (typeof process !== "undefined" && process?.env?.NODE_ENV === "production") return;
    if (demasiadosDestinos) {
      console.warn("[Tikin/TabBar] La seccion fija el maximo en 4 destinos mas la accion central.");
    }
    if (repartoTorcido) {
      console.warn(
        "[Tikin/TabBar] Con `action` los destinos se reparten en dos mitades: con un numero impar el hueco central queda descentrado.",
      );
    }
  }, [repartoTorcido, demasiadosDestinos]);

  return (
    <nav
      ref={ref}
      aria-label={label}
      className={cn(
        // El hairline superior sustituye a la sombra del prototipo, que
        // proyecta hacia abajo y no se ve bajo una barra anclada al fondo.
        // Ver decision 1: se quita con "border-t-0" si el layout no lo quiere.
        "relative flex w-full items-end border-t border-edge bg-surface px-2 pt-2.5",
        // 14 de padding inferior mas la zona segura del iPhone, que en
        // escritorio vale 0 y no cambia nada.
        "pb-[calc(14px+env(safe-area-inset-bottom))]",
        className,
      )}
      {...props}
    >
      {action == null ? (
        /* Sin accion no hay hueco central que reservar, y partir en mitades
           solo introduciria el desajuste de los numeros impares: un unico
           justify-around reparte bien cualquier cantidad de destinos. */
        <div className="flex flex-1 justify-around">{items}</div>
      ) : (
        <>
          <div className="flex flex-1 justify-around">{items.slice(0, half)}</div>
          {action}
          <div className="flex flex-1 justify-around">{items.slice(half)}</div>
        </>
      )}
    </nav>
  );
});

const tabBarItem = cva(
  [
    "flex w-16 cursor-pointer flex-col items-center gap-1 pt-1.5",
    "bg-transparent transition-colors duration-140 ease-out select-none",
    /* El estado inhabilitado se pinta por aria-disabled y no por :disabled
       porque con asChild el elemento es un <a>, que nunca casa con :disabled.
       Ver decision 5. El componente emite aria-disabled en los dos casos. */
    "aria-disabled:cursor-not-allowed aria-disabled:text-ink-400",
    focusRing,
    "rounded-sm focus-visible:ring-offset-surface",
    "[&_svg]:size-6 [&_svg]:shrink-0",
  ],
  {
    variants: {
      active: {
        /* Activo en tinta con el icono relleno; el resto en gris 500. */
        true: "text-ink",
        false: "text-ink-500 hover:not-aria-disabled:text-ink-700",
      },
    },
    defaultVariants: { active: false },
  },
);

export interface TabBarItemProps extends React.ComponentPropsWithoutRef<"button"> {
  /** Icono del destino. En Phosphor, el peso regular. */
  icon: React.ReactNode;
  /** Icono del destino activo. En Phosphor, `weight="fill"`. Cae en `icon`. */
  activeIcon?: React.ReactNode;
  /** Texto bajo el icono. Va en mono a 9px, con su capitalizacion normal. */
  label: React.ReactNode;
  /** Destino actual. Marca `aria-current="page"` ademas del relleno. */
  active?: boolean;
  /**
   * Renderiza el hijo en vez de un `<button>`. Para el `Link` de tu router.
   *
   * Con `asChild`, `disabled` NO se pasa como atributo — en un `<a>` no existe
   * y no bloquea nada —: se traduce a `aria-disabled` y el click se corta a
   * mano. Si tu hijo es un `<button>` de verdad y quieres el atributo nativo,
   * ponselo tu en el elemento.
   */
  asChild?: boolean;
}

/** Destino de la barra inferior. */
export const TabBarItem = React.forwardRef<HTMLButtonElement, TabBarItemProps>(function TabBarItem(
  {
    className,
    icon,
    activeIcon,
    label,
    active = false,
    asChild = false,
    type,
    disabled = false,
    onClick,
    children,
    ...props
  },
  ref,
) {
  const Comp = asChild ? Slot.Root : "button";

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // El hijo del consumidor solo lleva aria-disabled, que no impide nada por
    // si mismo: sin este corte un <a href> inhabilitado seguiria navegando.
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClick?.(event);
  };

  return (
    <Comp
      ref={ref}
      // Sin asChild renderizamos un <button>, cuyo type por defecto en HTML es
      // "submit". Con asChild no lo ponemos: el hijo puede ser un <a>.
      {...(asChild ? {} : { type: type ?? "button", disabled })}
      aria-current={active ? "page" : undefined}
      // Se emite tambien sobre el <button> nativo: es redundante pero permite
      // que el estilo dependa de una sola variante en los dos caminos.
      aria-disabled={disabled || undefined}
      // Gancho para que el consumidor atenue lo que el sistema no conoce.
      data-disabled={disabled ? "" : undefined}
      onClick={handleClick}
      className={cn(tabBarItem({ active, className }))}
      {...props}
    >
      {active ? (activeIcon ?? icon) : icon}
      <Slot.Slottable>{children}</Slot.Slottable>
      {/* Ubuntu Mono 9 con tracking .04em. Sin uppercase: el documento lo
            dibuja con la capitalizacion normal del destino. */}
      <span className="font-meta text-[9px] leading-none tracking-[0.04em]">{label}</span>
    </Comp>
  );
});

export interface TabBarActionProps extends React.ComponentPropsWithoutRef<"button"> {
  /** Nombre accesible. Obligatorio: el boton solo tiene icono. */
  label: string;
}

/**
 * Accion central de envio. Circulo de 52 en tinta, elevado 14 sobre la barra.
 *
 * Es una accion, no un destino: por eso no acepta `active` ni `aria-current`.
 */
export const TabBarAction = React.forwardRef<HTMLButtonElement, TabBarActionProps>(
  function TabBarAction({ className, label, type, children, ...props }, ref) {
    return (
      <button
        ref={ref}
        type={type ?? "button"}
        aria-label={label}
        className={cn(
          "absolute -top-3.5 left-1/2 flex size-13 -translate-x-1/2 cursor-pointer",
          "items-center justify-center rounded-full bg-ink text-surface",
          "transition-colors duration-140 ease-out",
          "hover:not-disabled:bg-ink-800",
          "disabled:cursor-not-allowed disabled:bg-edge disabled:text-ink-500",
          // Sombra proyectada literal: es oscura en los dos temas y no hay
          // token para ella. --shadow-md queda demasiado corta para 52px que
          // flotan por encima del borde de la barra.
          "shadow-[0_6px_16px_-4px_rgba(11,15,16,0.4)]",
          focusRing,
          "focus-visible:ring-offset-surface",
          "[&_svg]:size-6 [&_svg]:shrink-0",
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

/* ------------------------------------------------------------------------- */
/* Sidebar                                                                    */
/* ------------------------------------------------------------------------- */

export interface SidebarProps extends React.ComponentPropsWithoutRef<"nav"> {
  /** Marca arriba del rail. */
  brand?: React.ReactNode;
  /** Los destinos: `SidebarItem`, y abajo un `SidebarFooter`. */
  children?: React.ReactNode;
  /** Nombre accesible del landmark de navegacion. */
  label?: string;
}

/**
 * Rail lateral de 220 del dashboard de dispersion.
 *
 * Destinos arriba, ayuda y ficha de usuario abajo — el `SidebarFooter` se pega
 * al fondo con `margin-top:auto`, asi que el rail necesita altura: dale
 * `h-screen` o metelo en un contenedor estirado.
 */
export const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  { className, brand, children, label = "Navegación lateral", ...props },
  ref,
) {
  return (
    <nav
      ref={ref}
      aria-label={label}
      className={cn(
        // Fondo de pagina, no de superficie: el rail se hunde y el contenido
        // de la derecha es el que flota. Es como lo pinta el documento.
        "flex w-[220px] flex-none flex-col gap-1 border-r border-edge bg-page px-3 py-5",
        className,
      )}
      {...props}
    >
      {brand != null && (
        <span className="px-2.5 pb-3.5 font-display text-lg font-semibold tracking-[-0.01em] text-ink">
          {brand}
        </span>
      )}
      {children}
    </nav>
  );
});

const sidebarItem = cva(
  [
    "flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-[9px]",
    "text-left text-[13.5px] no-underline transition-colors duration-140 ease-out",
    /* Por aria-disabled y no por :disabled: con asChild el elemento es un <a>,
       que nunca casa con :disabled. Ver decision 5. */
    "aria-disabled:cursor-not-allowed aria-disabled:text-ink-400",
    focusRing,
    "focus-visible:ring-offset-page",
    "[&_svg]:size-[17px] [&_svg]:shrink-0",
  ],
  {
    variants: {
      active: {
        /* Activo = tinta invertida en r10. */
        true: "bg-ink text-surface",
        false: "bg-transparent text-ink-700 hover:not-aria-disabled:bg-surface-2",
      },
    },
    defaultVariants: { active: false },
  },
);

export interface SidebarItemProps extends React.ComponentPropsWithoutRef<"button"> {
  /** Icono del destino. En Phosphor, `weight="fill"` cuando esta activo. */
  icon?: React.ReactNode;
  /** Texto del destino. */
  label: React.ReactNode;
  /** Contador a la derecha. Pildora lima. */
  badge?: React.ReactNode;
  /** Destino actual. Marca `aria-current="page"` ademas del relleno. */
  active?: boolean;
  /**
   * Renderiza el hijo en vez de un `<button>`. Para el `Link` de tu router.
   *
   * Con `asChild`, `disabled` NO se pasa como atributo — en un `<a>` no existe
   * y no bloquea nada —: se traduce a `aria-disabled` y el click se corta a
   * mano. Si tu hijo es un `<button>` de verdad y quieres el atributo nativo,
   * ponselo tu en el elemento.
   */
  asChild?: boolean;
}

/** Destino del rail lateral. */
export const SidebarItem = React.forwardRef<HTMLButtonElement, SidebarItemProps>(
  function SidebarItem(
    {
      className,
      icon,
      label,
      badge,
      active = false,
      asChild = false,
      type,
      disabled = false,
      onClick,
      children,
      ...props
    },
    ref,
  ) {
    const Comp = asChild ? Slot.Root : "button";

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      // aria-disabled no bloquea nada por si mismo; sin este corte el <a> del
      // consumidor seguiria navegando aunque el destino este inhabilitado.
      if (disabled) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      onClick?.(event);
    };

    return (
      <Comp
        ref={ref}
        {...(asChild ? {} : { type: type ?? "button", disabled })}
        aria-current={active ? "page" : undefined}
        // Redundante sobre el <button> nativo a proposito: deja el estilo del
        // estado en una sola variante para los dos caminos.
        aria-disabled={disabled || undefined}
        data-disabled={disabled ? "" : undefined}
        onClick={handleClick}
        className={cn(sidebarItem({ active, className }))}
        {...props}
      >
        {icon}
        <Slot.Slottable>{children}</Slot.Slottable>
        <span className="truncate">{label}</span>
        {badge != null && (
          <>
            {/* Espacio literal: el nombre accesible del boton concatena el texto
                de sus hijos sin separador, y sin esto el lector anunciaria
                "Bonos3". Un nodo de texto en blanco dentro de un flex no pinta
                nada, asi que no descuadra el rail. */}{" "}
            {/* Lima con tinta on-accent: identico en claro y en oscuro, porque
                es color de marca y no superficie. */}
            <span className="ml-auto flex h-[18px] min-w-[18px] items-center justify-center rounded-pill bg-lime px-[5px] font-meta text-[10px] leading-none text-on-accent">
              {badge}
            </span>
          </>
        )}
      </Comp>
    );
  },
);

export type SidebarFooterProps = React.ComponentPropsWithoutRef<"div">;

/** Bloque inferior del rail. Se pega al fondo con `margin-top:auto`. */
export const SidebarFooter = React.forwardRef<HTMLDivElement, SidebarFooterProps>(
  function SidebarFooter({ className, ...props }, ref) {
    return <div ref={ref} className={cn("mt-auto flex flex-col gap-1", className)} {...props} />;
  },
);

export interface SidebarUserProps extends React.ComponentPropsWithoutRef<"div"> {
  /** Iniciales del avatar. Dos letras. */
  initials: React.ReactNode;
  /** Nombre mostrado. */
  name: React.ReactNode;
  /** Tikintag, en mono. */
  handle?: React.ReactNode;
}

/**
 * Ficha de usuario del pie del rail.
 *
 * Es presentacional: si tiene que abrir un menu, envuelvela tu — asi el
 * disparador queda donde vive el menu y no hay dos fuentes de comportamiento.
 */
export const SidebarUser = React.forwardRef<HTMLDivElement, SidebarUserProps>(function SidebarUser(
  { className, initials, name, handle, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-2.5 rounded-md border border-edge bg-surface p-2.5",
        className,
      )}
      {...props}
    >
      <span
        // Decorativo: las iniciales duplican el nombre que va justo al lado.
        aria-hidden="true"
        className="flex size-7 shrink-0 items-center justify-center rounded-full bg-lavender font-mono text-[10px] text-on-accent"
      >
        {initials}
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-[12.5px] text-ink">{name}</span>
        {handle != null && (
          <span className="truncate font-mono text-[10px] text-ink-600">{handle}</span>
        )}
      </span>
    </div>
  );
});

/* ------------------------------------------------------------------------- */
/* Breadcrumbs                                                                */
/* ------------------------------------------------------------------------- */

const breadcrumbItem = cva(
  [
    "truncate no-underline transition-colors duration-140 ease-out",
    focusRing,
    "rounded-sm focus-visible:ring-offset-surface",
  ],
  {
    variants: {
      current: {
        /* El tramo actual, en tinta. */
        true: "text-ink",
        false: "cursor-pointer text-ink-600 hover:text-ink",
      },
    },
    defaultVariants: { current: false },
  },
);

export interface BreadcrumbItemProps extends React.ComponentPropsWithoutRef<"a"> {
  /** Texto del tramo. */
  label: React.ReactNode;
  /** Pagina en la que estas. Es el ultimo tramo y no se pinta como enlace. */
  current?: boolean;
  /**
   * Renderiza el hijo en vez de un `<a>`. Para el `Link` de tu router.
   *
   * Gana sobre `current`: si lo pides, el tramo actual tambien sale como tu
   * elemento — con `aria-current="page"` puesto — en vez de como `<span>`.
   */
  asChild?: boolean;
}

/**
 * Tramo de la ruta.
 *
 * El actual se renderiza como `<span>`, no como enlace: un enlace a la pagina
 * en la que ya estas es una parada de tabulador que no lleva a ningun sitio.
 * `aria-current="page"` es lo que lo identifica para el lector.
 */
export const BreadcrumbItem = React.forwardRef<HTMLAnchorElement, BreadcrumbItemProps>(
  function BreadcrumbItem(
    { className, label, current = false, asChild = false, children, ...props },
    ref,
  ) {
    /* Casteo a ElementType: el elemento resultante alterna entre a, span y el
       hijo del consumidor, y TypeScript no unifica sus tablas de atributos. */
    const Comp = (asChild ? Slot.Root : current ? "span" : "a") as React.ElementType;
    return (
      <Comp
        ref={ref}
        aria-current={current ? "page" : undefined}
        className={cn(breadcrumbItem({ current, className }))}
        {...props}
      >
        {/* Slottable marca cual de los hijos es el elemento del consumidor.
            Sin asChild `children` va vacio y solo se pinta el label. */}
        <Slot.Slottable>{children}</Slot.Slottable>
        {label}
      </Comp>
    );
  },
);

export interface BreadcrumbsProps extends React.ComponentPropsWithoutRef<"nav"> {
  /** Los tramos: `BreadcrumbItem`. El ultimo lleva `current`. */
  children?: React.ReactNode;
  /**
   * Nombre accesible del landmark. Distinto del de las otras barras a
   * proposito: la ruta convive con el rail y con la barra web en la misma
   * pantalla del dashboard.
   */
  label?: string;
  /** Sustituye el caret por defecto entre tramos. */
  separator?: React.ReactNode;
}

/**
 * Ruta del dashboard web: "Inicio › Bolsillos › Arriendo".
 *
 * Lo pide el pie del bloque WEB · SIDEBAR ("breadcrumbs con caret, actual en
 * tinta") y el prototipo lo dibuja en el panel de la derecha, sobre el titulo
 * de la vista.
 *
 * Va en `<nav>` con `<ol>` porque el orden ES la informacion: es la jerarquia
 * de la ruta, y el lector anuncia cuantos tramos hay y en cual estas.
 */
export const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsProps>(function Breadcrumbs(
  { className, children, label = "Ruta", separator, ...props },
  ref,
) {
  const items = React.Children.toArray(children);

  return (
    <nav ref={ref} aria-label={label} className={cn("flex", className)} {...props}>
      {/* gap 6 y texto 12.5, como el prototipo. flex-wrap porque una ruta
          profunda en una ventana estrecha no puede desbordar el panel. */}
      <ol className="flex flex-wrap items-center gap-1.5 text-[12.5px]">
        {items.map((item, indice) => (
          <li
            key={React.isValidElement(item) && item.key != null ? item.key : indice}
            className="flex items-center gap-1.5"
          >
            {item}
            {/* El separador lo pinta la lista, no el tramo: asi nunca sobra uno
                al final y el consumidor no lo repite a mano. aria-hidden porque
                el lector ya separa los <li> por su cuenta, y un caret leido
                entre tramos solo añade ruido. */}
            {indice < items.length - 1 && (
              <span aria-hidden="true" className="flex text-ink-400 [&_svg]:size-[11px]">
                {separator ?? <CaretRightIcon />}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
});
