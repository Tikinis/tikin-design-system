import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/* Seccion 33 · Skeletons — EXTENSION.
 *
 * Lo etiqueta asi el propio documento: "Extension con los grises del sistema".
 * No existe ningun Skeleton en el archivo de Figma (no aparece en
 * docs/figma-export/components/), asi que toda la geometria de aqui sale del
 * prototipo del documento. NO es especificacion aprobada.
 *
 * Reglas de uso que manda la seccion:
 *   MISMA FORMA   el skeleton calca la maqueta final — mismos tamaños y
 *                 posiciones — para que el contenido no salte al llegar.
 *   SHIMMER SUAVE barrido de 1.4s entre dos grises contiguos; nunca pulsos
 *                 bruscos. Solo mientras carga; luego cross-fade al contenido.
 *   NO ABUSAR     para esperas cortas basta un spinner. El skeleton es para
 *                 listas y tarjetas que tardan en llegar.
 *
 * MEDIDAS DEL PROTOTIPO
 * ---------------------
 * La regla global `.tk-sk` del documento (linea 51 de su <style>) es:
 *
 *   background: linear-gradient(90deg, var(--tk-surface-3) 25%,
 *                                      var(--tk-surface-2) 37%,
 *                                      var(--tk-surface-3) 63%);
 *   background-size: 200% 100%;
 *   animation: tkShimmer 1.4s ease-in-out infinite;   // 200% 0 -> -200% 0
 *   border-radius: 6px;
 *
 * Formas que usa el prototipo, y de donde salen los defaults de aqui:
 *   linea    alto 9 · 10 · 11 · 12 · 26 · 28 · 30 · 34, ancho en %, radio 6
 *            -> contando los `.tk-sk` del bloque DEL ARCHIVO: 10 sale 23 veces,
 *               9 sale 16 y 12 solo 13. El default es el alto que mas se repite
 *               tal cual, sin agrupar valores contiguos    =>  h-2.5 (10)
 *   circulo  28 · 32 · 36 · 38 · 40 · 44 · 56 · 64, border-radius 50%
 *            -> el de las filas de lista es 40           =>  size-10
 *   bloque   alto 44 · 56 · 80 · 120, radio 10 · 12 · 14
 *            -> la tarjeta del documento es 56 con r10   =>  h-14 rounded-md
 *
 * DOS DECISIONES QUE ME APARTO DEL TEXTO
 * --------------------------------------
 * 1. El texto de la seccion dice "barrido entre gris 238 y 247", pero el CSS
 *    del propio prototipo interpola --tk-surface-3 (238) y --tk-surface-2, que
 *    en packages/tokens vale rgb(243,243,243), no 247. Gana el CSS: es lo que
 *    se ve en pantalla y ademas 243 es un token del sistema; 247 no existe en
 *    ninguna paleta. La diferencia es de 4 niveles de gris, imperceptible.
 *
 * 2. Los dos grises van por token semantico (--tk-surface-3 / --tk-surface-2),
 *    no por valor literal, porque con los rgb literales del texto tendriamos
 *    dos manchas casi blancas sobre pagina negra en tema oscuro.
 *    El precio de ir por token: en .dark los dos tokens NO se limitan a
 *    oscurecerse, se cruzan. La base (surface-3) pasa de 238 a 58 y la banda
 *    (surface-2) de 243 a 36, asi que en claro la banda es mas clara que la
 *    base — un destello — y en oscuro es mas oscura — una sombra. El delta
 *    tambien salta de 5 niveles de gris a 22, asi que el barrido se nota
 *    bastante mas en oscuro. Se asume: es exactamente lo que hace el CSS del
 *    prototipo con estos mismos tokens, y la alternativa seria fijar rgb a
 *    mano y perder el tema.
 *
 * NOTA SOBRE EL CROSS-FADE
 * ------------------------
 * El documento pide cross-fade del skeleton al contenido. Eso NO vive aqui: es
 * el consumidor quien sabe cuando llegan los datos, y meter un prop `loading`
 * que envuelva a los hijos obligaria a montar el arbol real antes de tiempo.
 * El patron esta en la story "Cross-fade": dos capas superpuestas alternando
 * opacidad. */

/* Los @keyframes no se pueden expresar inline ni como utilidad de Tailwind sin
 * declararlos en el tema, y packages/tokens no se toca en este encargo. React 19
 * hoista a <head> cualquier <style> con `href` + `precedence` y lo deduplica por
 * href, asi que aunque haya cuarenta bloques en pantalla la regla entra una sola
 * vez. Mismo mecanismo que usa progress.tsx. */
const SHIMMER_KEYFRAMES = `
@keyframes tk-skeleton-shimmer {
  from { background-position: 200% 0; }
  to   { background-position: -200% 0; }
}`;

const skeleton = cva(
  [
    "block shrink-0 bg-surface-3",
    /* Es puro relleno: no debe capturar el raton ni permitir seleccionar el
       hueco vacio que ocupa. El foco ya queda fuera por no ser focusable. */
    "pointer-events-none select-none",
  ],
  {
    variants: {
      shape: {
        /* r6 = --radius-xs, el border-radius que fija .tk-sk en el prototipo. */
        line: "h-2.5 w-full rounded-xs",
        circle: "size-10 rounded-full",
        /* r10 = --radius-md, el de la tarjeta y el grafico del documento. */
        block: "h-14 w-full rounded-md",
      },

      animation: {
        /* Barrido de 1.4s. El gradiente ocupa el doble del ancho y se desplaza:
           por eso hace falta background-size, no basta con la animacion. */
        shimmer: [
          "bg-[linear-gradient(90deg,var(--tk-surface-3)_25%,var(--tk-surface-2)_37%,var(--tk-surface-3)_63%)]",
          "bg-size-[200%_100%]",
          "animate-[tk-skeleton-shimmer_1.4s_ease-in-out_infinite]",
          // Sin movimiento queda el gradiente quieto, que sigue leyendose como
          // "hueco". Mejor eso que un fundido a negro.
          "motion-reduce:animate-none",
        ],
        /* El documento pide explicitamente "nunca pulsos bruscos", asi que el
           pulso NO es el default: esta aqui solo para superficies donde el
           gradiente no se aprecia (bloques de menos de ~24px de ancho). */
        pulse: "animate-pulse motion-reduce:animate-none",
        none: "",
      },
    },

    defaultVariants: { shape: "line", animation: "shimmer" },
  },
);

type SkeletonVariants = VariantProps<typeof skeleton>;

export interface SkeletonProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "children">, SkeletonVariants {
  /**
   * Ancho del bloque. Numero = px; cadena = tal cual ("45%", "12ch").
   * El documento expresa casi todos los anchos en porcentaje.
   */
  width?: number | string;
  /**
   * Alto del bloque. En `shape="circle"` basta con dar UNO de los dos ejes en
   * numero: el que falte copia al otro para que no salga un ovalo.
   */
  height?: number | string;
  /**
   * Texto que anuncia la carga a los lectores de pantalla — "Cargando
   * movimientos". Sin el, el bloque es puramente decorativo y queda fuera del
   * arbol de accesibilidad.
   *
   * UNA sola espera se anuncia UNA sola vez. Este prop es para el caso en que
   * un unico Skeleton es toda la espera. Cuando la espera es un grupo — una
   * lista, una tarjeta —, el anuncio va en el div que envuelve al grupo
   * (`role="status"` + `aria-label`) y los Skeleton de dentro se quedan
   * decorativos; ponerlo en uno de los hermanos convierte a ese en region viva
   * y deja a los demas mudos.
   */
  label?: string;
}

/**
 * Bloque de carga del sistema Tikin.
 *
 * Calca la forma del contenido que va a sustituir — mismos tamaños y
 * posiciones — para que nada salte cuando lleguen los datos. Se compone: una
 * pantalla de carga es un arbol de `Skeleton` dentro de la misma maqueta que la
 * pantalla real, no un componente aparte.
 *
 * Por defecto es invisible para los lectores de pantalla (`aria-hidden`): un
 * lector no debe describir cajas grises. Con `label` el bloque pasa a
 * `role="status"` y lleva dentro ese texto en sr-only, que es lo que el lector
 * anuncia. Para grupos, el anuncio va en el div contenedor, no en un hermano.
 */
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { className, shape, animation, width, height, label, style, ...props },
  ref,
) {
  /* Un `label` vacio no es un label: seria un role="status" sin nombre
     accesible, que el lector anuncia como region anonima. */
  const announced = typeof label === "string" && label.trim() !== "";

  /* En circulo un solo eje basta, y da igual cual: el que falte copia al otro.
     Copiar solo en una direccion dejaba `<Skeleton shape="circle" height={64} />`
     con el ancho en el size-10 de la clase — un ovalo, justo lo que esta logica
     existe para evitar.
     Se copia unicamente cuando el eje dado es un numero: un "45%" copiado al
     alto se mediria contra la altura del padre — que casi siempre es auto — y
     daria 0. */
  const esCirculo = shape === "circle";
  const resolvedHeight = height ?? (esCirculo && typeof width === "number" ? width : undefined);
  const resolvedWidth = width ?? (esCirculo && typeof height === "number" ? height : undefined);

  return (
    <div
      ref={ref}
      className={cn(skeleton({ shape, animation }), className)}
      /* Las medidas son DATO, no estilo: vienen de la maqueta que se esta
         calcando, no de una escala. Van inline, y el `style` del consumidor se
         mezcla despues para que pueda pisarlas. */
      style={{ width: resolvedWidth, height: resolvedHeight, ...style }}
      {...(announced
        ? /* role="status" es una region viva educada: el lector la anuncia
             cuando aparece sin interrumpir lo que este leyendo.
             Lo que anuncia una region viva es su CONTENIDO al cambiar, no su
             aria-label; por eso el texto va dentro en sr-only. Y por eso NO se
             pone aria-busy aqui: en la propia live region significa "reten las
             actualizaciones hasta que vuelva a false", y aqui nunca vuelve —
             el skeleton se desmonta — asi que el anuncio no llegaria a salir.
             El aria-busy correcto es el del contenedor que se esta rellenando,
             y ese es del consumidor. */
          {
            role: "status",
            "aria-live": "polite" as const,
            "aria-label": label,
          }
        : { "aria-hidden": true })}
      {...props}
    >
      {/* sr-only: alto 1px y clip, asi que no altera la caja que se esta
          calcando. Sin label no hay nodo: un decorativo no lee nada. */}
      {announced ? <span className="sr-only">{label}</span> : null}
      {animation === "pulse" || animation === "none" ? null : (
        <style href="tk-skeleton-shimmer" precedence="default">
          {SHIMMER_KEYFRAMES}
        </style>
      )}
    </div>
  );
});
