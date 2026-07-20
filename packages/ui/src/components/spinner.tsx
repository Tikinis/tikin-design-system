import * as React from "react";
import { createPortal } from "react-dom";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/* Seccion 41 · Loading states — EXTENSION.
 *
 * La bajada de la seccion lo dice literal: "Extension con la paleta del
 * sistema". Todo lo de este fichero es propuesta coherente con los tokens, no
 * especificacion aprobada. No lo cites como canonico.
 *
 * LO QUE SI HAY EN FIGMA, Y POR QUE NO SE USA AQUI
 * -----------------------------------------------
 * El archivo de Figma no tiene componente Spinner ni pantalla de carga, pero SI
 * tiene un glifo llamado "spinner" en el set de iconos
 * (docs/figma-export/components/Value.jsx, "value=spinner"): un aspa de radios
 * al estilo Phosphor, caja 16 con trazo de 13, que aparece unicamente dentro
 * del estado Loading del boton — a 12 (escalado 0.75) en XS y S, a 16 en M y L,
 * teñido con --button-primary-icon-loading. Es un ICONO estatico: Figma no
 * define su giro ni lo ofrece como pieza suelta.
 *
 * La seccion 41 dibuja otra cosa: un ARO con cabeza, hecho con border, a 0.7s
 * lineal, en tres tamaños que no existen en Figma (40 no aparece por ningun
 * lado). Manda la seccion 41, porque es la unica de las dos fuentes que
 * especifica el componente suelto que se pide aqui. Quien quiera el glifo de
 * Figma lo tiene en la libreria de iconos; no se replica en este fichero para
 * no tener dos spinners distintos en la misma pantalla.
 *
 * DIVERGENCIA CONOCIDA CON EL SPINNER INTERNO DE BUTTON
 * ----------------------------------------------------
 * button.tsx no reutiliza este componente: pinta su propio aro
 * (`size-4 animate-spin rounded-full border-2 ... border-t-transparent`). Son
 * dos piezas distintas y hoy NO coinciden — Button gira a 1s (la duracion por
 * defecto de animate-spin, no los 0.7s del documento) y tiene la geometria
 * invertida, aro solido con cabeza transparente, mientras que el documento y
 * `tone="inverse"` piden aro al 30% con cabeza plena. El documento pinta ademas
 * el spinner del boton a 18, tamaño que este componente no ofrece. Unificar los
 * dos es trabajo de button.tsx, no de aqui; queda escrito para que nadie
 * suponga que ya estan alineados.
 *
 * GEOMETRIA — mandan las etiquetas del documento, no el render del prototipo
 * -------------------------------------------------------------------------
 *
 *   S   16 · trazo 2      M   24 · trazo 2.5      L   40 · trazo 3
 *   aro --tk-border ("gris 230") · cabeza --tk-ink · 0.7s lineal infinita
 *   inline    spinner S + texto mono 13 en --tk-600, gap 10
 *   completa  wordmark Funnel Display 600/22 + spinner M, gap 14, fondo --tk-bg
 *
 * Esos numeros son el diametro EXTERIOR del aro, o sea caja con borde incluido:
 * size-4 fija 16 de caja y el border-2 se come 2 por lado, asi que quedan 16
 * exteriores con 12 de hueco interno. El HTML del prototipo escribe
 * los mismos 16/24/40 en `width`/`height` inline, pero ese documento no declara
 * `box-sizing: border-box` global (su unica aparicion esta en `.tk-field > input`),
 * asi que ahi el borde suma por fuera y el circulo acaba midiendo 20/29/46. Eso
 * es un descuido del prototipo, no una intencion: las etiquetas visibles dicen
 * "S · 16" y son la unica cifra que el documento afirma. Se implementa en
 * border-box —lo que hereda del preflight de Tailwind— y por tanto el render es
 * un 25% menor que el del prototipo en S. Si alguna vez se decide lo contrario,
 * el cambio es `size-5 border-2` / `size-[29px]` / `size-[46px]`, no tocar aqui
 * a medias.
 *
 * TRES REGLAS DE USO QUE MANDAN SOBRE LA API
 * ------------------------------------------
 * 1. SPINNER VS SKELETON. Spinner para esperas cortas o sin forma conocida;
 *    skeleton para listas y tarjetas que tardan. Nunca los dos juntos.
 * 2. SIN BLOQUEAR. Solo la pantalla de arranque cubre todo. De ahi que
 *    `scope="container"` sea el caso normal de LoadingOverlay y `"screen"` la
 *    excepcion, y que este componente NO atrape el foco (ver abajo).
 * 3. CABEZA BLANCA SOBRE OSCURO. El documento lo pide para superficies
 *    oscuras. Con `tone="ink"` sale gratis: --tk-ink ya invierte con el tema.
 *    `tone="inverse"` es para lo contrario — un spinner sobre un relleno de
 *    tinta que NO sigue al tema, como el del boton primario.
 *
 * POR QUE EL ARO INVERSO NO ES rgba(255,255,255,.3) LITERAL
 * --------------------------------------------------------
 * El prototipo pinta el spinner del boton con aro blanco al 30%. Ese blanco
 * solo funciona en tema claro: en oscuro el boton primario se vuelve claro y un
 * aro blanco al 30% sobre blanco desaparece. Se usa color-mix sobre
 * --tk-surface, que en claro ES blanco puro — o sea, mismo pixel que el
 * documento — y en oscuro invierte junto con el relleno.
 */

const spinner = cva(
  [
    "inline-block shrink-0 rounded-full",
    /* animate-spin de Tailwind gira a 1s; el documento pide 0.7s lineal. Se
       reaprovecha su keyframe y solo se cambia la duracion. */
    "animate-spin [animation-duration:0.7s]",
    /* Un spinner congelado se lee como interfaz rota, no como respeto por las
       preferencias. Con prefers-reduced-motion se ralentiza a un tercio en vez
       de pararse: sigue comunicando espera sin el parpadeo del giro rapido. */
    "motion-reduce:[animation-duration:2.1s]",
  ],
  {
    variants: {
      /* 16/24/40 con trazo 2/2.5/3, del bloque "SPINNER · TAMAÑOS". */
      size: {
        s: "size-4 border-2",
        m: "size-6 border-[2.5px]",
        l: "size-10 border-[3px]",
      },

      tone: {
        /* Aro gris 230, cabeza en tinta. Ambos tokens invierten con .dark, asi
           que sobre superficies oscuras la cabeza ya sale blanca sola. */
        ink: "border-edge border-t-ink",
        /* Sobre un relleno de tinta (boton primario, toast oscuro): el aro es
           la propia superficie al 30% y la cabeza la superficie plena. */
        inverse: [
          "border-[color-mix(in_srgb,var(--tk-surface)_30%,transparent)]",
          "border-t-[var(--tk-surface)]",
        ],
      },
    },
    defaultVariants: { size: "m", tone: "ink" },
  },
);

type SpinnerVariants = VariantProps<typeof spinner>;

export interface SpinnerProps
  extends Omit<React.ComponentPropsWithoutRef<"span">, "children">, SpinnerVariants {
  /**
   * Texto que anuncia el lector de pantalla. Va oculto visualmente.
   *
   * Pasa `null` cuando el spinner es decorativo porque el contexto ya esta
   * anunciado — dentro de un LoadingOverlay, o junto a un texto "Cargando
   * movimientos…" visible. Dos anuncios para una sola espera son ruido.
   */
  label?: string | null;
}

/**
 * Spinner del sistema Tikin.
 *
 * Aro gris con la cabeza en tinta girando a 0.7s lineal. Para esperas cortas o
 * sin forma conocida; si la espera tiene forma (lista, tarjeta) va un skeleton,
 * y nunca los dos a la vez.
 *
 * Es un `<span>` inline: se puede meter dentro de un parrafo o al lado de un
 * texto sin romper la linea base.
 */
export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { className, size, tone, label = "Cargando", ...props },
  ref,
) {
  const decorative = label === null;

  return (
    <span
      ref={ref}
      className={cn(spinner({ size, tone }), className)}
      /* role="status" ya implica aria-live="polite", pero se declara explicito
         porque varios lectores de pantalla antiguos no derivan el live region
         del rol. Cuando es decorativo se sale del arbol entero: un aro sin
         texto anunciado como "status" vacio solo confunde. */
      role={decorative ? undefined : "status"}
      aria-live={decorative ? undefined : "polite"}
      aria-hidden={decorative || undefined}
      {...props}
    >
      {/* El texto va DENTRO del aro y no en un wrapper: sr-only es position
          absolute, asi que no altera la caja de 16/24/40 ni el borde. */}
      {!decorative && <span className="sr-only">{label}</span>}
    </span>
  );
});

/* ---------------------------------------------------------------------------
 * LoadingOverlay
 * ------------------------------------------------------------------------- */

const overlay = cva(
  // gap 14 es uno de los tres pasos propios de Tikin (6/10/14) y es el que usa
  // el bloque "PANTALLA COMPLETA" del prototipo entre wordmark y spinner.
  ["flex flex-col items-center justify-center gap-[14px]"],
  {
    variants: {
      scope: {
        /* Pantalla de arranque: opaca y por encima de todo. Comparte el z-50
           del scrim de Modal a proposito — si coinciden, el ultimo montado
           manda, y el arranque siempre se monta antes. */
        screen: "fixed inset-0 z-50 bg-page",
        /* Carga por secciones: velo translucido sobre el trozo que se recarga.
           Necesita un ancestro posicionado (`relative`) del que colgar.
           El velo va en --tk-surface y no en --tk-bg porque lo que se recarga
           suele ser una tarjeta blanca: con el crema de la pagina al 80% la
           tarjeta se TIÑE en vez de atenuarse. Si la seccion vive directamente
           sobre el fondo de pagina, el consumidor pasa `className="bg-page/80"`
           y twMerge lo sustituye. */
        container: "absolute inset-0 z-10 bg-surface/80",
      },
    },
    defaultVariants: { scope: "container" },
  },
);

type OverlayVariants = VariantProps<typeof overlay>;

export interface LoadingOverlayProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "children">, OverlayVariants {
  /** Si es `false` no renderiza nada. Por defecto `true`. */
  open?: boolean;
  /** Texto anunciado. Visible solo si `showLabel`; si no, queda oculto. */
  label?: string;
  /** Muestra el texto bajo el spinner, en mono 13 sobre ink-600. */
  showLabel?: boolean;
  /** Wordmark de la pantalla de arranque. Solo tiene sentido en `scope="screen"`. */
  brand?: React.ReactNode;
  /** Por defecto M (24) a pantalla completa y S (16) por seccion. */
  spinnerSize?: SpinnerProps["size"];
  /**
   * Monta en `document.body`. Por defecto en `scope="screen"` y siempre que se
   * pase un `container`, porque pedir destino sin portal no haria nada.
   *
   * Un `position: fixed` se ancla al ancestro transformado mas cercano, no al
   * viewport. Cualquier `transform`, `filter` o `will-change` por encima
   * dejaria la pantalla de arranque encajada dentro de una tarjeta.
   */
  portal?: boolean;
  /**
   * Destino del portal. Por defecto `document.body`.
   *
   * Misma prop que `Modal` y `Tooltip`, por la misma razon: hay hosts (shadow
   * DOM, un iframe, el contenedor de una prueba visual) donde `document.body`
   * no es el sitio, y sin escape el componente queda inservible ahi.
   */
  container?: Element | DocumentFragment | null;
}

/**
 * Capa de espera sobre una seccion o sobre la pantalla entera.
 *
 * Regla del documento: solo la pantalla de arranque cubre todo; el resto carga
 * por secciones para no congelar la interfaz. Por eso `scope="container"` es el
 * valor por defecto.
 *
 * NO ATRAPA EL FOCO, a diferencia de un modal, y es deliberado: no hay nada que
 * decidir ni forma de cancelar, asi que secuestrar el tabulador solo dejaria al
 * usuario encerrado en una caja sin salida. Si necesitas semantica modal —
 * escape, foco atrapado, contenido de fondo inerte — usa `Modal`.
 *
 * CONTENCION DEL FONDO: ES DEL CONSUMIDOR, Y NO ES OPCIONAL EN `scope="screen"`
 * ---------------------------------------------------------------------------
 * La capa intercepta el raton (es un elemento opaco por encima), pero el
 * tabulador no lo sabe: sin hacer nada mas, un usuario de teclado sigue
 * recorriendo controles que no puede ver y sin foco visible — WCAG 2.4.3 y
 * 2.4.7. Esto NO se arregla desde aqui: la capa no es duenna del contenido que
 * tapa, y ponerse a inertizar el `body` a espaldas del consumidor es
 * exactamente el tipo de efecto global que luego nadie puede deshacer. Lo
 * correcto para una capa no descartable es marcar el fondo como inerte, y le
 * toca a quien la monta:
 *
 *   <div inert={cargando ? "" : undefined}>{contenido}</div>
 *   <LoadingOverlay open={cargando} scope="screen" />
 *
 * `inert` quita del recorrido del tabulador Y del arbol de accesibilidad todo el
 * subarbol, que es justo lo que se quiere aqui. Por el mismo motivo tampoco se
 * bloquea el scroll del `body` en `scope="screen"` (Modal si lo hace, pero via
 * Radix Dialog, que es quien tiene la semantica modal): si lo necesitas,
 * bloquealo tu junto con el `inert`.
 */
export const LoadingOverlay = React.forwardRef<HTMLDivElement, LoadingOverlayProps>(
  function LoadingOverlay(
    {
      className,
      open = true,
      scope = "container",
      label = "Cargando",
      showLabel = false,
      brand,
      spinnerSize,
      portal,
      container,
      ...props
    },
    ref,
  ) {
    if (!open) return null;

    /* Resolver el portal en un efecto costaba un fotograma en blanco: en el
       primer render cliente el destino aun era null y no se pintaba nada. Para
       una pantalla de arranque ese fotograma es precisamente el que enseña la
       aplicacion sin tapar, o sea lo unico que este componente existe para
       evitar. Se resuelve durante el render, que es seguro en las dos puntas:
       en servidor `document` no existe, asi que devuelve null y no se emite
       portal (createPortal no funciona en SSR); en cliente el portal no aporta
       nodos en la posicion del padre, asi que la hidratacion no ve diferencia
       con el HTML del servidor. */
    const usePortal = portal ?? (container != null || scope === "screen");
    const portalTarget = container ?? (typeof document === "undefined" ? null : document.body);

    const node = (
      <div
        ref={ref}
        className={cn(overlay({ scope }), className)}
        /* aria-busy en la propia capa: el lector anuncia el texto al montarse y
           las herramientas de test pueden esperar a que desaparezca. */
        role="status"
        aria-live="polite"
        aria-busy="true"
        {...props}
      >
        {brand && (
          /* aria-hidden: el wordmark es decoracion de marca dentro de una
             region viva. Sin esto el lector de pantalla anuncia "tikin
             Cargando", que mezcla el nombre del producto con el estado. */
          <span
            aria-hidden="true"
            className="font-display text-[22px] leading-none font-semibold tracking-[-0.01em] text-ink"
          >
            {brand}
          </span>
        )}
        {/* El spinner va decorativo: el texto de abajo ya es el anuncio, y dos
            live regions anidadas para una sola espera se leen dos veces. */}
        <Spinner size={spinnerSize ?? (scope === "screen" ? "m" : "s")} label={null} />
        <span className={showLabel ? "font-mono text-[13px] text-ink-600" : "sr-only"}>
          {label}
        </span>
      </div>
    );

    if (!usePortal) return node;
    return portalTarget ? createPortal(node, portalTarget) : null;
  },
);
