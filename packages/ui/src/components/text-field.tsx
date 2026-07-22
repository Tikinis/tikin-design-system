import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/* Seccion 11 · Inputs — MIXTO.
 *
 *   TextField   CANONICO. Existe en el archivo de Figma (nodo 2:5155,
 *               24 variantes: state x feedback x size). Geometria, tokens y
 *               estados salen de ahi.
 *   Textarea    EXTENSION. El propio documento lo dice: "Hereda los tokens del
 *               TextField del archivo (borde 0.5px, foco en tinta); no es un
 *               componente aparte."
 *
 * Tambien son EXTENSION, no especificacion aprobada, las piezas que el
 * documento dibuja en el bloque "Text Input" pero que no estan en el
 * componente de Figma: icono leading, capsulas de prefijo/sufijo, modo
 * numerico y contador de caracteres.
 *
 * LA IDEA CENTRAL: LA ETIQUETA VIVE DENTRO
 * ----------------------------------------
 * No hay label flotante arriba ni helper permanente. La etiqueta ocupa el
 * hueco del placeholder y, al enfocar o al escribir, encoge y sube al borde
 * superior del propio campo. El mensaje aparece debajo SOLO cuando aplica y
 * sustituye al helper, nunca se suma.
 *
 * Se resuelve en CSS puro con `peer` + `:placeholder-shown`, sin estado en
 * React. Por eso el input lleva SIEMPRE un placeholder: sin el,
 * `:placeholder-shown` nunca es cierto y la etiqueta se quedaria arriba con el
 * campo vacio. Cuando el consumidor pasa un placeholder de verdad, la etiqueta
 * flota permanentemente — si no, taparia ese placeholder.
 *
 * TRES DESVIACIONES DELIBERADAS
 * -----------------------------
 * 1. HOVER usa --tk-600 y no --tk-500 como pide el documento. En claro
 *    --tk-500 (166) si oscurece sobre el borde por defecto (217), pero en
 *    oscuro --tk-500 vale 110 — exactamente el mismo valor que
 *    --textfield-stroke-default en .dark. El hover seria invisible. --tk-600
 *    (110 claro / 154 oscuro) da un salto visible en los dos temas.
 *
 * 2. Los ICONOS usan --tk-600 en vez de --textfield-icon-default. Ese token
 *    vale grayscale-light-200 (230) en .dark, casi blanco: pesaria mas que el
 *    propio valor del campo e invertiria la jerarquia.
 *
 * 3. El FOCO no cambia el grosor del borde (Figma pasa de 0.5px a 1px), lo
 *    simula con una sombra interior de 0.5px. Cambiar `border-width` con
 *    box-sizing:border-box encoge el area de contenido en pleno foco y el
 *    texto da un salto de medio pixel al entrar y al salir.
 */

/* Medidas por tamaño. Fuente: docs/figma-export/components/TextField.jsx
 * (nodo 2:5155, cuerpos __body0..__body3), que manda sobre los pixeles del
 * documento: la matriz TAMAÑOS del .dc.html es un dibujo a mano y difiere
 * (dice texto 15 y px 14 en m, px 12 e icono 18 en s).
 *
 *        alto  radio  px   texto  icono
 *   l      56    12   16     16     20
 *   m      48    10   12     16     20
 *   s      40     8    8     14     16
 *   xs     32     6    8     12     16
 *
 * --tf-lbl-top y --tf-pt no vienen de ningun token: son el reparto vertical
 * que hace falta para que etiqueta encogida y valor convivan sin solaparse.
 * Salen del prototipo del documento (56 -> top 9, pt 20/pb 6) escalado. */
const SIZES = {
  l: "h-14 rounded-lg [--tf-px:16px] [--tf-text:16px] [--tf-icon:20px] [--tf-lbl:11px] [--tf-lbl-top:9px] [--tf-pt:14px]",
  m: "h-12 rounded-md [--tf-px:12px] [--tf-text:16px] [--tf-icon:20px] [--tf-lbl:11px] [--tf-lbl-top:7px] [--tf-pt:12px]",
  s: "h-10 rounded-sm [--tf-px:8px] [--tf-text:14px] [--tf-icon:16px] [--tf-lbl:10px] [--tf-lbl-top:6px] [--tf-pt:11px]",
  xs: "h-8 rounded-xs [--tf-px:8px] [--tf-text:12px] [--tf-icon:16px] [--tf-lbl:9px] [--tf-lbl-top:4px] [--tf-pt:9px]",
} as const;

const fieldBox = cva(
  [
    "relative flex w-full items-stretch",
    // 0.5px es literal en Figma y en el documento; no es un redondeo de 1px.
    "border-[0.5px] bg-[var(--textfield-bg-default)]",
    // El documento fija la curva: "transicion · 140ms ease" y el CSS del
    // prototipo usa `border-color .14s ease`. `ease` es cubic-bezier(.25,.1,.25,1),
    // NO `ease-out` (cubic-bezier(0,0,.58,1)): son curvas distintas y hay que
    // clavar la del documento. `motion-reduce` corta la transicion para quien
    // pide menos movimiento (regla dura de accesibilidad).
    "transition-[border-color,background-color,box-shadow] duration-140 ease-[cubic-bezier(0.25,0.1,0.25,1)] motion-reduce:transition-none",
    "[&_svg]:size-[var(--tf-icon)] [&_svg]:shrink-0",
  ],
  {
    variants: {
      size: SIZES,

      feedback: {
        default: "border-[var(--textfield-stroke-default)]",
        /* El exito no tiñe de verde el borde: el verde se reserva al icono y al
           mensaje. Figma usa --textfield-stroke-active-success = gris 500. */
        success: "border-ink-500",
        // purered-600 en los dos temas, mas el fondo teñido al 5%.
        error: "border-red bg-red-tint",
      },

      /* Se separa de `disabled`/`readOnly` porque hover y foco no pueden ir en
         `feedback`: con el campo inerte tendrian que desactivarse, y una clase
         `hover:` siempre gana a una clase base por especificidad de variante. */
      interactive: {
        true: "focus-within:border-ink focus-within:shadow-[inset_0_0_0_0.5px_var(--tk-ink)] hover:border-ink-600",
        false: "",
      },

      disabled: {
        true: "cursor-not-allowed border-[var(--textfield-stroke-disabled)] bg-[var(--textfield-bg-disabled)]",
        false: "",
      },

      /* Solo lectura no es un campo apagado: es texto que se puede seleccionar
         y copiar. El documento le quita el borde y lo posa sobre el fondo de
         pagina para que no invite a escribir.

         Conserva foco visible aunque `interactive` sea false. A diferencia de
         `disabled`, este campo SI entra en el orden de tabulacion (el usuario
         tiene que poder llegar a el para copiarlo) y el <input> lleva
         `outline-none`: sin esto, tabular hasta aqui no dejaria ninguna señal
         de donde esta el foco (WCAG 2.4.7). Va despues de `interactive` para
         que tailwind-merge lo deje ganar, y antes del className del consumidor
         para que siga pudiendo repintarlo. */
      readOnly: {
        true: "border-transparent bg-page focus-within:border-ink focus-within:shadow-[inset_0_0_0_0.5px_var(--tk-ink)]",
        false: "",
      },

      /* Recortar al radio solo hace falta cuando hay capsulas pegadas al borde:
         son lo unico que puede desbordar la esquina. Recortar siempre se comia
         el anillo de foco que el consumidor pone en `endAction`, que es la
         unica pieza interactiva del campo ademas del input. */
      clipped: {
        true: "overflow-hidden",
        false: "",
      },
    },

    compoundVariants: [
      /* En error el foco mantiene el rojo. Si no, al enfocar un campo invalido
         el borde se volveria tinta y el usuario perderia la señal de error
         justo cuando esta corrigiendola. */
      {
        feedback: "error",
        interactive: true,
        class:
          "focus-within:border-red focus-within:shadow-[inset_0_0_0_0.5px_var(--colours-purered-600)] hover:border-red",
      },
    ],

    defaultVariants: {
      size: "l",
      feedback: "default",
      interactive: true,
      disabled: false,
      readOnly: false,
      clipped: false,
    },
  },
);

type FieldBoxVariants = VariantProps<typeof fieldBox>;

/** Capsula gris pegada al borde: `tikin.co/`, `$`, `COP`. */
const adornment =
  "flex shrink-0 items-center bg-surface-2 px-[var(--tf-px)] font-mono text-[length:var(--tf-text)] text-ink-600";

/* La etiqueta encogida. Se escribe literal (dos veces con prefijo `peer-` y una
 * sin el) porque Tailwind escanea el fuente buscando clases completas: si se
 * generasen concatenando strings, no llegarian a compilarse. */
const LABEL_REST =
  "top-1/2 -translate-y-1/2 text-[length:var(--tf-text)] text-[color:var(--textfield-text-label-default)]";
const LABEL_FLOAT =
  "top-[var(--tf-lbl-top)] translate-y-0 text-[length:var(--tf-lbl)] tracking-[0.03em] text-ink-600";
const LABEL_FLOAT_ON_FOCUS =
  "peer-focus:top-[var(--tf-lbl-top)] peer-focus:translate-y-0 peer-focus:text-[length:var(--tf-lbl)] peer-focus:tracking-[0.03em] peer-focus:text-ink-600";
const LABEL_FLOAT_ON_VALUE =
  "peer-[&:not(:placeholder-shown)]:top-[var(--tf-lbl-top)] peer-[&:not(:placeholder-shown)]:translate-y-0 peer-[&:not(:placeholder-shown)]:text-[length:var(--tf-lbl)] peer-[&:not(:placeholder-shown)]:tracking-[0.03em] peer-[&:not(:placeholder-shown)]:text-ink-600";

/* Con icono leading la etiqueta descansa junto al icono (el <label> vive dentro
 * del hueco del input, ya desplazado) pero al flotar tiene que volver al borde
 * de contenido de la caja, ENCIMA del icono. El documento lo pide literal:
 * `.tk-field.tk-lead > input:focus ~ .tk-lbl { left: 16px }`, es decir 46 -> 16.
 * Se consigue tirando de `left` hacia atras el ancho del icono mas el hueco
 * (el `gap-2.5` de la fila = 10px; si cambia ese gap, cambia este calc).
 * Literales por lo mismo que arriba: Tailwind no ve clases concatenadas. */
const LABEL_LEAD_FLOAT = "left-[calc((var(--tf-icon)+10px)*-1)]";
const LABEL_LEAD_ON_FLOAT =
  "peer-focus:left-[calc((var(--tf-icon)+10px)*-1)] peer-[&:not(:placeholder-shown)]:left-[calc((var(--tf-icon)+10px)*-1)]";

const messageTone = {
  default: "text-ink-600",
  success: "text-fg-success",
  error: "text-fg-error",
} as const;

/* aria-describedby es una lista de ids, no de clases: no puede pasar por cn(),
 * porque tailwind-merge intentaria resolver conflictos entre ellos. */
function ids(...parts: Array<string | false | null | undefined>): string | undefined {
  const list = parts.filter(Boolean).join(" ");
  return list === "" ? undefined : list;
}

/** Longitud del valor, funcione el campo controlado o no. */
function useValueLength(value: unknown, defaultValue: unknown): [number, (next: string) => void] {
  const [uncontrolled, setUncontrolled] = React.useState(() => String(defaultValue ?? "").length);
  const isControlled = value !== undefined;
  return [
    isControlled ? String(value ?? "").length : uncontrolled,
    (next) => {
      if (!isControlled) setUncontrolled(next.length);
    },
  ];
}

export interface TextFieldProps
  extends
    Omit<React.ComponentPropsWithoutRef<"input">, "size" | "prefix">,
    Pick<FieldBoxVariants, "size" | "feedback"> {
  /**
   * Etiqueta dentro del campo. Es tambien el nombre accesible, asi que es
   * obligatoria: hace de placeholder y sube al escribir.
   */
  label: string;
  /**
   * Mensaje bajo el campo. SUSTITUYE al helper, no se suma a el — el documento
   * es explicito: no hay helper permanente.
   */
  message?: React.ReactNode;
  /** Icono decorativo a la izquierda. No recibe puntero. */
  startIcon?: React.ReactNode;
  /** Icono decorativo a la derecha: check de validacion, candado. */
  endIcon?: React.ReactNode;
  /**
   * Ranura interactiva a la derecha: el ojo de contraseña, el boton de limpiar.
   *
   * La ranura se alinea al borde de contenido (`--tf-px`), igual que `endIcon`.
   * El documento dibuja el area de toque MAS ANCHA que el icono y sangrada
   * (`.tk-btn` 36x36 a right:8, `.tk-clear` 26x26 a right:12) para que el GLIFO
   * caiga donde caeria un `endIcon`. El componente no puede adivinar el relleno
   * del nodo que le pasen: compensalo con un margen derecho negativo — `-mr-2`
   * en un boton de 36, `-mr-1` en una pastilla de 26.
   */
  endAction?: React.ReactNode;
  /** Capsula pegada al borde izquierdo: `tikin.co/`, `$`. */
  prefix?: React.ReactNode;
  /** Capsula pegada al borde derecho: `COP`. */
  suffix?: React.ReactNode;
  /** Cifras en DM Mono alineadas a la derecha, como pide el bloque de dinero. */
  numeric?: boolean;
  /** Muestra `n / maxLength` bajo el campo. Requiere `maxLength`. */
  counter?: boolean;
  /** Clases del contenedor externo (campo + mensaje + contador). */
  wrapperClassName?: string;
}

/**
 * Campo de texto de una linea del sistema Tikin.
 *
 * `className` estiliza el CONTROL (la caja con borde), que es lo que un
 * consumidor entiende por "el input". Para el bloque entero — caja, mensaje y
 * contador — esta `wrapperClassName`. La ref apunta al `<input>` real.
 */
export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  {
    className,
    wrapperClassName,
    label,
    size,
    feedback = "default",
    message,
    startIcon,
    endIcon,
    endAction,
    prefix,
    suffix,
    numeric = false,
    counter = false,
    id: idProp,
    disabled,
    readOnly,
    placeholder,
    value,
    defaultValue,
    maxLength,
    onChange,
    "aria-describedby": describedBy,
    ...props
  },
  ref,
) {
  const autoId = React.useId();
  const id = idProp ?? autoId;
  const messageId = `${id}-message`;

  const [length, syncLength] = useValueLength(value, defaultValue);

  /* Un placeholder de verdad y la etiqueta dentro compiten por el mismo hueco.
     Si el consumidor pone uno, la etiqueta se queda arriba para dejarlo ver. */
  const hasOwnPlaceholder = Boolean(placeholder && placeholder.trim() !== "");
  const showCounter = counter && typeof maxLength === "number";

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    syncLength(event.target.value);
    onChange?.(event);
  };

  return (
    <div className={cn("flex w-full flex-col gap-2", wrapperClassName)}>
      <div
        className={cn(
          fieldBox({
            size,
            feedback,
            // Ni deshabilitado ni de solo lectura reaccionan al cursor.
            interactive: !disabled && !readOnly,
            disabled: Boolean(disabled),
            readOnly: Boolean(readOnly),
            clipped: prefix != null || suffix != null,
            className,
          }),
        )}
      >
        {prefix != null && (
          <span className={cn(adornment, "border-r-[0.5px] border-edge")}>{prefix}</span>
        )}

        {/* El padding vive aqui y no en la caja para que las capsulas puedan
            pegarse al borde sin margenes negativos. */}
        <div className="relative flex min-w-0 flex-1 items-center gap-2.5 px-[var(--tf-px)]">
          {startIcon != null && (
            <span aria-hidden="true" className="pointer-events-none flex shrink-0 text-ink-600">
              {startIcon}
            </span>
          )}

          <div className="relative h-full min-w-0 flex-1">
            <input
              ref={ref}
              id={id}
              /* Un espacio, no cadena vacia: `:placeholder-shown` solo se activa
                 si el atributo existe y no esta vacio. Es el interruptor CSS que
                 mueve la etiqueta. */
              placeholder={hasOwnPlaceholder ? placeholder : " "}
              disabled={disabled}
              readOnly={readOnly}
              value={value}
              defaultValue={defaultValue}
              maxLength={maxLength}
              onChange={handleChange}
              aria-invalid={feedback === "error" || undefined}
              aria-describedby={ids(message != null && messageId, describedBy)}
              className={cn(
                "peer h-full w-full min-w-0 bg-transparent outline-none",
                "font-sans text-[length:var(--tf-text)] text-ink",
                // Deja sitio arriba a la etiqueta encogida.
                "pt-[var(--tf-pt)]",
                "placeholder:text-[color:var(--textfield-text-label-default)]",
                "disabled:cursor-not-allowed disabled:text-ink-500",
                "read-only:text-ink-700",
                numeric && "text-right font-num tabular-nums",
              )}
              {...props}
            />
            <label
              htmlFor={id}
              className={cn(
                "pointer-events-none absolute left-0 max-w-full truncate font-sans",
                /* El documento anima la etiqueta con EXACTAMENTE cuatro
                   propiedades: `top .14s ease, font-size .14s ease, transform
                   .14s ease, color .14s ease`. Ni `left` (el salto horizontal del
                   modo leading, de 46 a 16) ni `letter-spacing` estan en esa
                   lista, asi que en el original caen de golpe mientras el resto
                   se desliza. Se replica esa lista y esa curva (`ease`, no
                   `ease-out`). motion-reduce lo deja sin transicion. */
                "transition-[top,font-size,transform,color] duration-140 ease-[cubic-bezier(0.25,0.1,0.25,1)] motion-reduce:transition-none",
                hasOwnPlaceholder
                  ? LABEL_FLOAT
                  : [LABEL_REST, LABEL_FLOAT_ON_FOCUS, LABEL_FLOAT_ON_VALUE],
                /* Con placeholder propio la etiqueta nace flotada, asi que el
                   desplazamiento tambien tiene que ser permanente. */
                startIcon != null && (hasOwnPlaceholder ? LABEL_LEAD_FLOAT : LABEL_LEAD_ON_FLOAT),
              )}
            >
              {label}
            </label>
          </div>

          {endIcon != null && (
            <span aria-hidden="true" className="pointer-events-none flex shrink-0 text-ink-600">
              {endIcon}
            </span>
          )}
          {endAction != null && <span className="flex shrink-0 text-ink-600">{endAction}</span>}
        </div>

        {suffix != null && (
          <span className={cn(adornment, "border-l-[0.5px] border-edge")}>{suffix}</span>
        )}
      </div>

      {(message != null || showCounter) && (
        <div className="flex items-start gap-2">
          {message != null && (
            <span
              id={messageId}
              /* Sin aria-live a proposito. El bloque de mensaje se MONTA junto
                 con su texto, y un lector de pantalla solo anuncia regiones
                 vivas que ya estaban en el arbol cuando cambia su contenido:
                 aqui no anunciaria nada y en algunos lectores duplicaria la
                 lectura, porque el texto ya llega por aria-describedby. Para
                 tener region viva de verdad habria que dejar un nodo vacio
                 permanente bajo cada campo, que ademas abriria un hueco del
                 `gap-2` en todos los formularios. */
              className={cn(
                "flex items-center gap-1.5 text-[12.5px] leading-snug",
                "[&_svg]:size-[15px] [&_svg]:shrink-0",
                messageTone[feedback ?? "default"],
              )}
            >
              {message}
            </span>
          )}
          {showCounter && (
            <span className="ml-auto shrink-0 font-mono text-xs text-ink-600 tabular-nums">
              {length} / {maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  );
});

/* ------------------------------------------------------------------------- */

const textareaBox = cva(
  [
    "w-full rounded-lg border-[0.5px] bg-[var(--textfield-bg-default)]",
    "px-3.5 py-3 font-sans text-[15px] leading-[1.5] text-ink",
    // Misma curva que el TextField: el documento pide "140ms ease"
    // (cubic-bezier(.25,.1,.25,1)), no ease-out. motion-reduce la anula.
    "transition-[border-color,background-color,box-shadow] duration-140 ease-[cubic-bezier(0.25,0.1,0.25,1)] outline-none motion-reduce:transition-none",
    "placeholder:text-[color:var(--textfield-text-label-default)]",
    "disabled:cursor-not-allowed disabled:border-[var(--textfield-stroke-disabled)]",
    "disabled:bg-[var(--textfield-bg-disabled)] disabled:text-ink-500",
  ],
  {
    variants: {
      feedback: {
        default:
          "border-[var(--textfield-stroke-default)] hover:not-disabled:border-ink-600 focus:border-ink focus:shadow-[inset_0_0_0_0.5px_var(--tk-ink)]",
        success: "border-ink-500 focus:border-ink",
        error:
          "border-red bg-red-tint focus:border-red focus:shadow-[inset_0_0_0_0.5px_var(--colours-purered-600)]",
      },
      /* Vertical, nunca horizontal: a lo ancho el textarea se saldria de la
         columna del formulario y romperia el layout. */
      resizable: { true: "resize-y", false: "resize-none" },
    },
    defaultVariants: { feedback: "default", resizable: true },
  },
);

export interface TextareaProps
  extends React.ComponentPropsWithoutRef<"textarea">, VariantProps<typeof textareaBox> {
  /**
   * Etiqueta ENCIMA del campo, no dentro. Es la unica diferencia de anatomia
   * con TextField y viene del documento: con varias lineas la etiqueta dentro
   * no tiene donde encogerse sin comerse la primera linea de texto.
   */
  label?: string;
  /** Texto de apoyo bajo la etiqueta. Convive con `message`, a diferencia del TextField. */
  helper?: React.ReactNode;
  /** Mensaje de validacion bajo el campo. */
  message?: React.ReactNode;
  /** Muestra `n / maxLength` bajo el campo. Requiere `maxLength`. */
  counter?: boolean;
  /** Clases del contenedor externo (etiqueta + campo + mensaje). */
  wrapperClassName?: string;
}

/**
 * Entrada de varias lineas.
 *
 * EXTENSION: no es un componente del archivo de Figma. Hereda los tokens del
 * TextField — borde 0.5px, foco en tinta, radio 12 — y solo cambia la
 * anatomia, con la etiqueta arriba.
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    className,
    wrapperClassName,
    label,
    helper,
    message,
    feedback = "default",
    resizable,
    counter = false,
    id: idProp,
    rows = 3,
    value,
    defaultValue,
    maxLength,
    onChange,
    "aria-describedby": describedBy,
    ...props
  },
  ref,
) {
  const autoId = React.useId();
  const id = idProp ?? autoId;
  const helperId = `${id}-helper`;
  const messageId = `${id}-message`;

  const [length, syncLength] = useValueLength(value, defaultValue);
  const showCounter = counter && typeof maxLength === "number";

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    syncLength(event.target.value);
    onChange?.(event);
  };

  return (
    <div className={cn("flex w-full flex-col gap-2", wrapperClassName)}>
      {label != null && (
        <label htmlFor={id} className="font-sans text-sm font-semibold text-ink">
          {label}
        </label>
      )}
      {helper != null && (
        <span id={helperId} className="text-[12.5px] leading-snug text-ink-600">
          {helper}
        </span>
      )}

      <textarea
        ref={ref}
        id={id}
        rows={rows}
        value={value}
        defaultValue={defaultValue}
        maxLength={maxLength}
        onChange={handleChange}
        aria-invalid={feedback === "error" || undefined}
        aria-describedby={ids(
          helper != null && helperId,
          message != null && messageId,
          describedBy,
        )}
        className={cn(textareaBox({ feedback, resizable, className }))}
        {...props}
      />

      {(message != null || showCounter) && (
        <div className="flex items-start gap-2">
          {message != null && (
            <span
              id={messageId}
              /* Sin aria-live, por lo mismo que en TextField. */
              className={cn(
                "flex items-center gap-1.5 text-[12.5px] leading-snug",
                "[&_svg]:size-[15px] [&_svg]:shrink-0",
                messageTone[feedback ?? "default"],
              )}
            >
              {message}
            </span>
          )}
          {showCounter && (
            <span className="ml-auto shrink-0 font-mono text-xs text-ink-600 tabular-nums">
              {length} / {maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  );
});
