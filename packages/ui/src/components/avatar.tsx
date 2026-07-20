import * as React from "react";
import * as AvatarPrimitive from "radix-ui/avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/* Seccion 27 · Avatars — EXTENSION.
 *
 * El propio documento lo etiqueta asi: "Extension con la paleta y la mono del
 * sistema". No hay ningun componente Avatar en el archivo de Figma (no aparece
 * en docs/figma-export/components/), por lo que TODA la geometria de aqui sale
 * del prototipo del documento, no de Figma. No es especificacion aprobada.
 *
 * Reglas de uso que manda el documento:
 *   INICIALES  dos letras (nombre + apellido) en Ubuntu Sans Mono sobre un
 *              pastel asignado de forma ESTABLE por el nombre. Sin foto, nunca
 *              se deja vacio.
 *   FOTO       siempre recortada en circulo (cover). Circulo siempre, nunca
 *              cuadrado ni redondeado.
 *   ANILLO     marca "tu" o destacado.  PUNTO VERDE  estado en linea.
 *   GRUPO      hasta 3-4 visibles y un +N; el borde separa los solapados.
 *
 * MEDIDAS DEL PROTOTIPO (atributos style= del HTML de la seccion)
 * --------------------------------------------------------------
 *   caja        XS 24 · S 32 · M 40 · L 48 · XL 64
 *   iniciales    9 / 11 / 13 / 15 / 20   (mono, mayusculas por CSS)
 *   punto        13 sobre 48, con anillo de 2.5 del color del fondo
 *   anillo       0 0 0 2px superficie, 0 0 0 4px tinta
 *   grupo        solapado -12 sobre 40, borde de 2.5 del color del fondo
 *   contador     +N en tinta sobre superficie, Ubuntu Mono 12 sobre 40
 *
 * El prototipo solo acota los tamaños 40 y 48; el resto de la escala se
 * interpola, pero NO toda con la misma proporcion:
 *   - El SOLAPADO si la mantiene: -12 sobre 40 es el 30% del diametro, y toda
 *     la escala se queda dentro de +-2 puntos de ese 30%.
 *   - El PUNTO de estado y el TEXTO del contador se apartan hacia arriba en los
 *     tamaños pequeños. La referencia del prototipo es punto 13 sobre 48 (27%)
 *     y contador 12 sobre 40 (30%); aqui XS da 8 sobre 24 (33%) y 9 sobre 24
 *     (37%). Es deliberado: por debajo de 8px el punto deja de leerse como
 *     punto y la cifra del contador deja de ser legible. En XL pasa lo
 *     contrario (16 sobre 64 = 25%), porque un punto proporcional ahi seria un
 *     boton, no un indicador.
 *
 * DOS DESVIACIONES RESPECTO AL PROTOTIPO
 * --------------------------------------
 * 1. El anillo de "destacado" usa --tk-ink, no --tk-on-accent.
 *    El prototipo lo pinta con var(--tk-on-accent), que es rgb(11,15,16) FIJO
 *    en los dos temas: en oscuro seria un anillo casi negro sobre una pagina
 *    casi negra, es decir invisible. --tk-ink si invierte y es literalmente "la
 *    tinta" de la que habla el texto de la seccion. El relleno pastel si
 *    conserva --tk-on-accent como color de texto, porque ahi es correcto: los
 *    pasteles son claros en ambos temas.
 *
 * 2. El borde que separa los solapados se expone como variable
 *    --tk-avatar-edge, con var(--tk-surface) por defecto.
 *    El documento lo llama "borde blanco", pero un color fijo se rompe en tema
 *    oscuro. --tk-surface invierte y acierta cuando el grupo va sobre una
 *    tarjeta, que es el caso del propio prototipo. Cuando el grupo va sobre el
 *    fondo de pagina, el consumidor pasa
 *    className="[--tk-avatar-edge:var(--tk-bg)]" y el recorte vuelve a cuadrar.
 */

/* Los tres pasteles de marca que usa el grupo del prototipo: lavender 100,
 * limegreen 400 y goldenyellow 300. Son identicos en claro y en oscuro. */
const PASTEL_TONES = ["lavender", "lime", "gold"] as const;
type PastelTone = (typeof PASTEL_TONES)[number];

export type AvatarSize = "xs" | "s" | "m" | "l" | "xl";

const avatarCircle = cva(
  [
    "relative inline-flex shrink-0 items-center justify-center rounded-full align-middle select-none",
    // Las iniciales van SIEMPRE mono y en MAYUSCULAS por CSS. Nunca con
    // .toUpperCase() en JS: eso rompe el texto accesible y lo que se copia al
    // portapapeles.
    "font-mono font-normal uppercase",
    "text-[length:var(--tk-avatar-fs)]",
  ],
  {
    variants: {
      /* caja · texto de iniciales · texto del contador · punto de estado */
      size: {
        xs: "size-6 [--tk-avatar-count:9px] [--tk-avatar-dot:8px] [--tk-avatar-fs:9px]",
        s: "size-8 [--tk-avatar-count:10px] [--tk-avatar-dot:10px] [--tk-avatar-fs:11px]",
        m: "size-10 [--tk-avatar-count:12px] [--tk-avatar-dot:11px] [--tk-avatar-fs:13px]",
        l: "size-12 [--tk-avatar-count:14px] [--tk-avatar-dot:13px] [--tk-avatar-fs:15px]",
        xl: "size-16 [--tk-avatar-count:18px] [--tk-avatar-dot:16px] [--tk-avatar-fs:20px]",
      },

      tone: {
        lavender: "bg-lavender text-on-accent",
        lime: "bg-lime text-on-accent",
        gold: "bg-gold text-on-accent",
        /* Placeholder sin nombre: gris de superficie con el icono en 600. */
        neutral: "bg-surface-2 text-ink-600",
        /* Solo para el contador +N del grupo: invierte a tinta. */
        ink: "bg-ink text-surface",
      },

      /* Dos sombras: primero un hueco del color del fondo, luego la tinta.
         Asi el anillo no toca el borde de la foto. */
      ring: {
        true: "shadow-[0_0_0_2px_var(--tk-avatar-edge,var(--tk-surface)),0_0_0_4px_var(--tk-ink)]",
        false: "",
      },
    },

    defaultVariants: { size: "m", tone: "neutral", ring: false },
  },
);

type AvatarCircleVariants = VariantProps<typeof avatarCircle>;

/* El grupo comunica el tamaño por contexto y no clonando a los hijos: clonar
 * obligaria a que los hijos fuesen literalmente <Avatar>, y romperia en cuanto
 * alguien envuelva uno en un <Tooltip> o en un enlace. */
const AvatarGroupContext = React.createContext<{ size: AvatarSize } | null>(null);

export interface AvatarProps
  extends
    Omit<React.ComponentPropsWithoutRef<"span">, "color">,
    Pick<AvatarCircleVariants, "ring"> {
  /**
   * Nombre completo de la persona o del bolsillo. Hace tres cosas a la vez:
   * genera las iniciales, elige el pastel de forma estable y da el nombre
   * accesible del avatar.
   */
  name?: string;
  /** URL de la foto. Si no carga, cae solo a las iniciales. */
  src?: string;
  /** Texto alternativo de la foto. Por defecto, `name`. */
  alt?: string;
  /** Sustituye las iniciales calculadas. Se sigue poniendo en mayusculas por CSS. */
  initials?: string;
  /** 24 / 32 / 40 / 48 / 64. Dentro de un `AvatarGroup` lo hereda del grupo. */
  size?: AvatarSize;
  /** Pastel del relleno. Por defecto se deriva del nombre de forma estable. */
  tone?: PastelTone | "neutral";
  /** Punto verde de estado en linea, abajo a la derecha. */
  online?: boolean;
  /** Milisegundos antes de mostrar las iniciales, para evitar el parpadeo. */
  delayMs?: number;
}

/**
 * Avatar circular del sistema Tikin.
 *
 * Prioridad del contenido: foto → iniciales → icono de persona. Nunca se queda
 * vacio.
 *
 * NOMBRE ACCESIBLE: el circulo entero es un `role="img"` etiquetado con
 * `alt` o `name`, y la foto interna va con `alt=""`. De este modo el lector de
 * pantalla anuncia lo mismo tanto si la imagen carga como si cae a iniciales,
 * y nunca deletrea "V C". Sin nombre ni alt, el avatar es decorativo y se
 * marca `aria-hidden`: un placeholder gris no aporta nada que anunciar. Eso si,
 * solo cuando el consumidor tampoco lo etiqueta ni le da un rol propio.
 */
export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  {
    className,
    name,
    src,
    alt,
    initials,
    size,
    tone,
    ring,
    online = false,
    delayMs,
    "aria-label": ariaLabel,
    ...props
  },
  ref,
) {
  const group = React.useContext(AvatarGroupContext);
  const resolvedSize = size ?? group?.size ?? "m";

  const label = ariaLabel ?? alt ?? name;
  const text = initials ?? (name ? initialsFromName(name) : "");
  const resolvedTone = tone ?? (name ? toneFromName(name) : "neutral");

  // El consumidor tambien puede etiquetar el avatar por fuera (`aria-labelledby`,
  // que es un mecanismo ARIA tan valido como `aria-label`) o darle un rol propio
  // (`role="button"` con un onClick). En esos casos el elemento SI pertenece al
  // arbol de accesibilidad: emitir aria-hidden lo sacaria de el y dejaria un
  // control con nombre pero mudo para el lector de pantalla (WCAG 4.1.2). Como
  // `{...props}` se aplica despues, aria-hidden no se "arregla" solo: hay que no
  // ponerlo.
  const etiquetadoPorFuera = props["aria-labelledby"] != null || props.role != null;

  const accesibilidad: React.HTMLAttributes<HTMLSpanElement> = label
    ? // role="img" + aria-label deja el interior fuera del arbol accesible, que
      // es justo lo que queremos con las iniciales.
      { role: "img", "aria-label": label }
    : etiquetadoPorFuera
      ? {}
      : { "aria-hidden": true };

  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(avatarCircle({ size: resolvedSize, tone: resolvedTone, ring }), className)}
      {...accesibilidad}
      {...props}
    >
      {/* overflow-hidden va en esta capa y no en la raiz porque el punto de
          estado sobresale del circulo: en la raiz lo recortaria. */}
      <span className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full">
        {src ? (
          // alt="" a proposito: el nombre accesible ya lo pone la raiz. Con alt
          // repetido, el lector anunciaria la persona dos veces.
          <AvatarPrimitive.Image src={src} alt="" className="size-full object-cover" />
        ) : null}
        <AvatarPrimitive.Fallback
          delayMs={delayMs}
          className="flex size-full items-center justify-center"
        >
          {text ? text : <UserGlyph />}
        </AvatarPrimitive.Fallback>
      </span>

      {online ? (
        // El estado lo comunica el nombre accesible de quien lo consuma (una
        // lista de "en linea"); el punto es la señal visual, no el dato.
        //
        // z-10 NO es decorativo. Dentro de un AvatarGroup el punto cae justo en
        // los 12px inferiores-derechos que tapa el avatar siguiente, que se
        // pinta despues por orden de documento: sin el z-index, cualquier avatar
        // "en linea" que no fuese el ultimo del grupo perdia su punto. Ni la
        // raiz del Avatar ni el envoltorio del grupo llevan z-index, asi que
        // ninguno crea contexto de apilado y este z-10 se resuelve contra los
        // hermanos del grupo, que van en `auto`: el punto gana. En un avatar
        // suelto no cambia nada.
        <span
          aria-hidden="true"
          className="absolute right-0 bottom-0 z-10 size-[var(--tk-avatar-dot)] rounded-full bg-fg-success shadow-[0_0_0_2.5px_var(--tk-avatar-edge,var(--tk-surface))]"
        />
      ) : null}
    </AvatarPrimitive.Root>
  );
});

/* Icono `user` de Phosphor (regular, viewBox 256), la libreria oficial del
 * sistema. Va inline porque packages/ui no depende de ningun paquete de
 * iconos y no podemos añadir dependencias. */
const UserGlyph = () => (
  <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" className="size-[50%]">
    <path d="M230.92 212c-15.23-26.33-38.7-45.21-66.09-54.16a72 72 0 1 0-73.66 0c-27.39 8.95-50.86 27.83-66.09 54.16a8 8 0 1 0 13.85 8c18.84-32.56 52.14-52 89.07-52s70.23 19.44 89.07 52a8 8 0 1 0 13.85-8ZM72 96a56 56 0 1 1 56 56 56.06 56.06 0 0 1-56-56Z" />
  </svg>
);

/* -------------------------------------------------------------------------
 * AvatarGroup
 * ---------------------------------------------------------------------- */

const avatarGroup = cva(["flex items-center"], {
  variants: {
    /* Solapado del prototipo: -12 sobre una caja de 40, o sea el 30% del
       diametro. Se mantiene esa proporcion en el resto de la escala. */
    size: {
      xs: "[--tk-avatar-overlap:-7px]",
      s: "[--tk-avatar-overlap:-9px]",
      m: "[--tk-avatar-overlap:-12px]",
      l: "[--tk-avatar-overlap:-14px]",
      xl: "[--tk-avatar-overlap:-19px]",
    },
  },
  defaultVariants: { size: "m" },
});

export interface AvatarGroupProps extends React.ComponentPropsWithoutRef<"div"> {
  /** Tamaño de todos los avatares del grupo. Lo heredan por contexto. */
  size?: AvatarSize;
  /**
   * Cuantos avatares se ven antes del contador. El documento acota el rango en
   * 3-4; por defecto 3, que es el del ejemplo de la seccion.
   */
  max?: number;
  /**
   * Total real de personas cuando los hijos son solo una muestra (por ejemplo,
   * 40 destinatarios de los que solo llegan 3 del servidor). Sin esto, el
   * contador cuenta los hijos que sobran.
   */
  total?: number;
}

/**
 * Pila de avatares solapados con un contador +N que cierra el grupo.
 *
 * Cada avatar va envuelto en un span que le pinta el borde separador, en vez
 * de aplicarselo al propio avatar: asi el grupo no necesita conocer ni tocar a
 * sus hijos, y sigue funcionando si alguien envuelve uno en un tooltip o en un
 * enlace.
 *
 * Los solapados se pintan en orden de documento, de modo que cada uno tapa al
 * anterior. No hace falta z-index, pero si que el envoltorio este posicionado:
 * ver la nota de AvatarStackItem.
 */
export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(function AvatarGroup(
  { className, size = "m", max = 3, total, children, ...props },
  ref,
) {
  const items = React.Children.toArray(children).filter(React.isValidElement);
  const visible = items.slice(0, Math.max(0, max));
  // Con `total` el resto se calcula sobre el universo real, no sobre lo que
  // llego a renderizarse.
  const rest = (total ?? items.length) - visible.length;

  const context = React.useMemo(() => ({ size }), [size]);

  return (
    <div ref={ref} role="group" className={cn(avatarGroup({ size }), className)} {...props}>
      <AvatarGroupContext.Provider value={context}>
        {visible.map((child, index) => (
          <AvatarStackItem key={child.key ?? index}>{child}</AvatarStackItem>
        ))}
        {rest > 0 ? (
          <AvatarStackItem>
            <span
              // role="img" con etiqueta: el "+3" visible no se lee bien en voz
              // alta y el numero suelto no dice de que.
              role="img"
              aria-label={`${rest} más`}
              className={cn(
                avatarCircle({ size, tone: "ink" }),
                // El contador va en Ubuntu Mono (font-meta), no en la mono de
                // las iniciales: es una cifra, no un nombre.
                "font-meta text-[length:var(--tk-avatar-count)]",
              )}
            >
              +{rest}
            </span>
          </AvatarStackItem>
        ) : null}
      </AvatarGroupContext.Provider>
    </div>
  );
});

/**
 * Envoltorio que aporta el solapado y el borde separador.
 *
 * `relative` NO es decorativo: sin el, el borde no se ve. La raiz de cada
 * Avatar es `relative`, o sea que pinta en la capa de los elementos
 * posicionados, y esa capa va por encima de TODO el contenido en linea sin
 * posicionar (CSS 2.1, apendice E: paso 8 sobre paso 7). Con el envoltorio
 * estatico su sombra caia en el paso 7 y el avatar anterior la tapaba entera,
 * dejando los circulos fundidos. Posicionando el envoltorio, borde y avatares
 * comparten capa y decide el orden del documento: cada envoltorio pinta sobre
 * el avatar que le precede, que es justo lo que pide la seccion.
 */
const AvatarStackItem = ({ children }: { children: React.ReactNode }) => (
  <span className="relative ml-[var(--tk-avatar-overlap)] inline-flex rounded-full shadow-[0_0_0_2.5px_var(--tk-avatar-edge,var(--tk-surface))] first:ml-0">
    {children}
  </span>
);

/* -------------------------------------------------------------------------
 * Utilidades puras
 * ---------------------------------------------------------------------- */

/**
 * Iniciales de un nombre: primera letra del nombre y primera del apellido.
 * Con una sola palabra devuelve sus dos primeras letras, porque el documento
 * exige que nunca se quede vacio.
 *
 * NO pone nada en mayusculas: de eso se encarga la clase `uppercase`.
 */
export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0];
  if (!first) return "";
  // Array.from y no slice sobre el string: hay nombres con emoji o con letras
  // fuera del plano basico, y cortar por unidades UTF-16 los parte por la mitad.
  const firstChars = Array.from(first);
  if (parts.length === 1) return firstChars.slice(0, 2).join("");
  const lastChars = Array.from(parts[parts.length - 1] ?? "");
  return `${firstChars[0] ?? ""}${lastChars[0] ?? ""}`;
}

/**
 * Pastel asignado de forma ESTABLE por el nombre: la misma persona sale
 * siempre del mismo color, en cualquier pantalla y entre sesiones. Por eso es
 * un hash del texto y no un contador ni un random.
 */
export function toneFromName(name: string): PastelTone {
  let hash = 0;
  for (const char of name.trim()) {
    hash = (hash * 31 + (char.codePointAt(0) ?? 0)) >>> 0;
  }
  return PASTEL_TONES[hash % PASTEL_TONES.length] ?? "lavender";
}
