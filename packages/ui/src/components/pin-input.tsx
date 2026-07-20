import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../lib/cn";

/* Seccion 44 · PIN — MIXTO.
 *
 * El documento se declara a si mismo "basado en Definir PIN del archivo", pero
 * no hay ningun componente PIN en docs/figma-export/components (un grep por
 * "pin" sobre el export no devuelve nada). Asi que:
 *
 *   ESTADOS DEL PUNTO   CANONICO. Es el unico bloque de especificacion de la
 *                       seccion — vacio / lleno / error / correcto — y de ahi
 *                       salen las medidas del punto: 16x16, circulo, separacion
 *                       12, vacio = aro inset de 1.5 en --tk-border-2, lleno =
 *                       tinta, error = purered-600, correcto = --tk-fg-success.
 *
 *   TECLADO + BIOMETRIA EXTENSION. Solo existen dentro del bloque "EN VIVO ·
 *                       PRUEBALO", que es demo interactiva y no especificacion.
 *                       Se conservan sus valores porque no hay otra fuente
 *                       (tecla 52 de alto, r12, DM Mono 22/500, rejilla de 3
 *                       columnas con separacion 8 y ancho maximo 300; atajo
 *                       biometrico de 40 de alto, r10, mono 13), pero conviene
 *                       leerlos como propuesta: las demos en vivo de este
 *                       documento suelen venir ampliadas respecto al canon.
 *                       La separacion de los puntos SI se toma del bloque
 *                       canonico (12), no de la demo (16).
 *
 * TRES REGLAS DE USO QUE MANDAN SOBRE LA APARIENCIA
 * -------------------------------------------------
 * 1. Nunca se muestran las cifras. De ahi que el campo real sea un
 *    <input type="password">: el enmascarado no es un efecto visual que se
 *    pueda perder, es semantica que el lector de pantalla tambien respeta.
 * 2. Al llenar el ultimo punto se valida solo, sin boton — eso es `onComplete`.
 * 3. Clave incorrecta: los puntos pasan a rojo, la fila hace shake y se limpia
 *    sola para reintentar. La limpieza la hace el componente (`clearOnError`),
 *    no el consumidor, porque el consumidor solo sabe que fallo: no sabe cuando
 *    ha terminado la animacion.
 *
 * COLOR DEL ERROR: el punto va en `bg-red` (--colours-purered-600, el
 * rgb(255,46,46) literal del prototipo), que es un acento de marca identico en
 * ambos temas y sobre fondo casi negro sigue contrastando. El TEXTO del mensaje
 * en cambio va en `text-fg-error`, que si invierte a rojo claro en oscuro: un
 * purered-600 en texto pequeño sobre negro queda por debajo del contraste
 * exigible.
 */

/** Longitud del bloque canonico: 4 puntos. */
const LONGITUD_POR_DEFECTO = 4;

/** El shake dura 420ms; se limpia justo despues, con un respiro de 100. */
const RETARDO_LIMPIEZA_ERROR = 520;

/* Los @keyframes no se pueden expresar como utilidad de Tailwind sin declararlos
 * en el tema, y packages/tokens es territorio de otro agente. React 19 hoista a
 * <head> cualquier <style> con `href` + `precedence` y lo deduplica por href,
 * asi que la regla entra una sola vez aunque haya varios PIN montados. */
const SHAKE_KEYFRAMES = `
@keyframes tk-pin-shake {
  0%, 100% { transform: translateX(0); }
  15%      { transform: translateX(-6px); }
  30%      { transform: translateX(6px); }
  45%      { transform: translateX(-4px); }
  60%      { transform: translateX(4px); }
  80%      { transform: translateX(-2px); }
}`;

const pinFila = cva(
  [
    // Separacion 12 del bloque canonico. El padding y el radio existen solo
    // para que el anillo de foco no corte los puntos.
    "flex items-center gap-3 rounded-full p-1",
    /* El campo real es invisible (ver mas abajo), asi que el foco tiene que
       verse aqui. `peer` va en el input, que es hermano ANTERIOR: peer-* solo
       alcanza hacia delante en el DOM. */
    "peer-focus-visible:ring-2 peer-focus-visible:ring-ink peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-page",
  ],
  {
    variants: {
      feedback: {
        default: "",
        success: "",
        // El remontado por `key` es lo que relanza la animacion en dos fallos
        // seguidos; sin el, el segundo error no se moveria.
        error: "animate-[tk-pin-shake_420ms_ease-in-out] motion-reduce:animate-none",
      },
    },
    defaultVariants: { feedback: "default" },
  },
);

const pinPunto = cva(
  [
    "size-4 shrink-0 rounded-full",
    "transition-[background-color,box-shadow] duration-150 ease-out",
  ],
  {
    variants: {
      estado: {
        // 1.5px es sub-pixel en pantallas @1x, pero es la medida del documento
        // y como sombra inset (no como border) no altera el tamaño del punto.
        vacio: "bg-transparent shadow-[inset_0_0_0_1.5px_var(--tk-border-2)]",
        lleno: "bg-ink",
        error: "bg-red",
        exito: "bg-fg-success",
      },
    },
    defaultVariants: { estado: "vacio" },
  },
);

const pinTecla = cva([
  "flex h-[52px] items-center justify-center rounded-lg",
  // Las cifras van en DM Mono: es la familia de numeros del sistema y ademas
  // asegura que todas las teclas ocupen lo mismo.
  "font-num text-[22px] font-medium text-ink",
  "cursor-pointer transition-colors duration-140 ease-out select-none",
  "hover:not-disabled:bg-surface-2 active:not-disabled:bg-edge",
  "outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-page",
  "disabled:cursor-not-allowed disabled:text-ink-500",
]);

const pinBiometria = cva([
  "inline-flex h-control-m items-center gap-2 rounded-md px-4",
  // Label mono, MAYUSCULAS por CSS, +2% de tracking y nunca bold.
  "font-mono text-[13px] font-normal tracking-[0.02em] whitespace-nowrap text-ink uppercase",
  "cursor-pointer transition-colors duration-140 ease-out select-none",
  "hover:not-disabled:bg-surface-2 active:not-disabled:bg-edge",
  "outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-page",
  "disabled:cursor-not-allowed disabled:text-ink-500",
]);

/** Tono del mensaje bajo los puntos. Ver la nota de color de la cabecera. */
const tonoMensaje = {
  default: "text-ink-500",
  error: "text-fg-error",
  success: "text-fg-success",
} as const;

/* Iconos dibujados a mano. packages/ui no depende de @phosphor-icons y este
 * encargo no puede añadir dependencias; el prototipo usa ph-backspace y
 * ph-fill ph-fingerprint. Heredan currentColor y van ocultos al lector: el
 * nombre accesible lo pone el aria-label de cada boton. */
function BorrarGlifo() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9L3 12z" />
      <path d="m17 9-6 6M11 9l6 6" />
    </svg>
  );
}

function HuellaGlifo() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4.6 9.2a8.6 8.6 0 0 1 14.8 0" />
      <path d="M7.5 12.4a4.5 4.5 0 0 1 9 0v2.2" />
      <path d="M12 12.4v3.4a6 6 0 0 1-1 3.4" />
      <path d="M16.2 17.3a9 9 0 0 1-.8 2.8" />
      <path d="M6 16.2a8 8 0 0 0 .8-3.8c0-.9.2-1.7.5-2.5" />
    </svg>
  );
}

function AvisoGlifo() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6.25" />
      <path d="M8 4.9v3.6M8 11.1h.01" />
    </svg>
  );
}

function CorrectoGlifo() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6.25" />
      <path d="m5.3 8.2 1.9 1.9 3.5-3.9" />
    </svg>
  );
}

/** Un PIN solo admite cifras: se filtra en la entrada, no en la validacion. */
function soloDigitos(texto: string): string {
  return texto.replace(/\D/g, "");
}

const TECLAS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;

export type PinFeedback = "default" | "error" | "success";

export interface PinInputProps extends Omit<React.ComponentPropsWithoutRef<"div">, "onChange"> {
  /** Numero de puntos. El bloque canonico define 4. */
  length?: number;
  /** Valor controlado. Solo cifras; se recorta a `length`. */
  value?: string;
  /** Valor inicial cuando el componente se usa sin controlar. */
  defaultValue?: string;
  /** Se dispara en cada cambio, incluida la limpieza automatica tras el error. */
  onChange?: (value: string) => void;
  /**
   * Se dispara al llenar el ultimo punto. Es la validacion: la clave se
   * comprueba sola, sin boton de confirmar.
   */
  onComplete?: (value: string) => void;
  /**
   * Estado tras validar. `error` tiñe de rojo, agita la fila y limpia.
   *
   * El shake y la limpieza responden a la TRANSICION a `error`, no a cada
   * intento. Devuélvelo a `default` al empezar uno nuevo si quieres que se
   * repitan; es además lo correcto, porque mientras diga `error` el componente
   * entiende que lo que hay en pantalla ya fue rechazado.
   *
   * No se cuentan los intentos a propósito: el contador subiría al llenar el
   * último punto, no al conocer el resultado, y con validación asíncrona eso
   * borraría un PIN correcto antes de validarlo.
   *
   * Mientras vale `error`, teclear con la clave llena empieza un intento nuevo
   * en vez de ignorarse, para que el campo no quede sin salida.
   */
  feedback?: PinFeedback;
  /** Titulo sobre los puntos. Etiqueta al campo real. */
  label?: React.ReactNode;
  /** Mensaje bajo los puntos. El hueco se reserva siempre para que no salte. */
  hint?: React.ReactNode;
  /** Teclado propio bajo los puntos. Actívalo en movil. */
  keypad?: boolean;
  /** Si se pasa, aparece el atajo biometrico bajo el teclado. */
  onBiometric?: () => void;
  /** Texto del atajo biometrico. Se pone en mayusculas por CSS. */
  biometricLabel?: React.ReactNode;
  /** Limpia sola la clave tras un `feedback="error"`. */
  clearOnError?: boolean;
  /** Milisegundos entre el error y la limpieza. Cubre el shake de 420ms. */
  errorClearDelay?: number;
  disabled?: boolean;
  /** Nombre del campo real, por si el PIN viaja dentro de un formulario. */
  name?: string;
  autoFocus?: boolean;
  /** Nombre accesible cuando no hay `label` visible. */
  "aria-label"?: string;
}

/**
 * Clave de N digitos para entrar y confirmar.
 *
 * Cada digito llena un punto en tinta; las cifras no se muestran nunca. Al
 * completar el ultimo punto se valida solo — `onComplete` — sin boton.
 *
 * Bajo los puntos hay un campo real invisible pero enfocable. No es un adorno:
 * es lo que hace que funcionen el teclado fisico, el pegado, el autorrelleno
 * del codigo y el lector de pantalla. Con `keypad` activo lleva
 * `inputMode="none"` para que el teclado del sistema no tape al teclado propio,
 * sin renunciar a nada de lo anterior.
 */
export const PinInput = React.forwardRef<HTMLDivElement, PinInputProps>(function PinInput(
  {
    className,
    length = LONGITUD_POR_DEFECTO,
    value,
    defaultValue,
    onChange,
    onComplete,
    feedback = "default",
    label,
    hint,
    keypad = true,
    onBiometric,
    biometricLabel = "Usar biometría",
    clearOnError = true,
    errorClearDelay = RETARDO_LIMPIEZA_ERROR,
    disabled = false,
    name,
    autoFocus,
    onKeyDown,
    "aria-label": ariaLabel,
    ...props
  },
  ref,
) {
  const idBase = React.useId();
  const idCampo = `${idBase}-campo`;
  const idEtiqueta = `${idBase}-etiqueta`;
  const idMensaje = `${idBase}-mensaje`;

  const campoRef = React.useRef<HTMLInputElement>(null);
  const [valorInterno, setValorInterno] = React.useState(() => soloDigitos(defaultValue ?? ""));

  const esControlado = value !== undefined;
  const pin = soloDigitos(esControlado ? value : valorInterno).slice(0, length);

  /* El callback del consumidor se lee por ref en el temporizador de limpieza:
   * si dependiera de `onChange` directamente, cada render con una funcion
   * inline nueva reiniciaria la cuenta y el PIN no se limpiaria jamas. */
  const onChangeRef = React.useRef(onChange);
  React.useEffect(() => {
    onChangeRef.current = onChange;
  });

  /* No hay contador de intentos, y es deliberado. Tenerlo parece la forma
   * natural de detectar "otro fallo" cuando el consumidor deja `feedback` fijo
   * en "error", pero el contador sube al LLENAR el ultimo punto, no al conocer
   * el resultado. Con validacion asincrona eso invierte el fallo: si el primer
   * intento fue mal y el consumidor no devuelve `feedback` a "default", un
   * segundo intento CORRECTO se agita y se borra a los pocos milisegundos de
   * teclearlo, antes de que la validacion conteste. Castigar un PIN correcto es
   * peor que no repetir una animacion.
   *
   * Asi que la reaccion cuelga solo de la TRANSICION a "error". El precio es
   * que dos fallos identicos seguidos con feedback pegajoso no vuelven a
   * agitar; lo que si se arregla es la consecuencia grave de aquello — que el
   * campo se quedaba lleno y sin salida — permitiendo teclear encima. Ver
   * `escribirDigito`. */

  const aplicarValor = (siguiente: string) => {
    const limpio = soloDigitos(siguiente).slice(0, length);
    if (limpio === pin) return;
    if (!esControlado) setValorInterno(limpio);
    onChange?.(limpio);
    // La validacion se dispara sola al llenar el ultimo punto.
    if (limpio.length === length) {
      onComplete?.(limpio);
    }
  };

  /* Con el PIN lleno se ignoran las cifras de mas: teclear una quinta por
   * descuido no debe borrar lo escrito. La excepcion es el estado de error, que
   * es justo cuando el usuario quiere volver a intentarlo: ahi la siguiente
   * cifra empieza un intento nuevo. Sin esta salida, un consumidor que deje
   * `feedback="error"` fijo y desactive `clearOnError` deja el campo lleno,
   * incorrecto y solo recuperable a base de borrar digito a digito. */
  const reintentando = feedback === "error";

  const limpiar = React.useCallback(() => {
    if (!esControlado) setValorInterno("");
    onChangeRef.current?.("");
  }, [esControlado]);

  /* `secuenciaError` sirve de key de la fila. Remontarla es la unica forma
   * fiable de relanzar una animacion CSS cuando el estado no cambia: dos claves
   * incorrectas seguidas dejan `feedback="error"` fijo y sin esto la segunda no
   * se moveria. Son cuatro <span>, el remontado no cuesta nada. */
  const [secuenciaError, setSecuenciaError] = React.useState(0);

  /* Ajuste durante el render en vez de dentro de un efecto. Es el patron que
   * documenta React para "reaccionar al cambio de una prop": React descarta el
   * render en curso y vuelve a empezar con el estado nuevo, sin pintar el
   * intermedio ni encadenar un commit extra. Dentro de un efecto habria un
   * fotograma con la fila vieja antes de remontarla. */
  const [feedbackPrevio, setFeedbackPrevio] = React.useState(feedback);
  if (feedbackPrevio !== feedback) {
    setFeedbackPrevio(feedback);
    if (feedback === "error") setSecuenciaError((n) => n + 1);
  }

  // La limpieza diferida si es un efecto de verdad: programa un temporizador,
  // que es un sistema externo, y hay que cancelarlo al desmontar.
  React.useEffect(() => {
    if (feedback !== "error" || !clearOnError) return;
    const t = window.setTimeout(limpiar, errorClearDelay);
    return () => window.clearTimeout(t);
  }, [feedback, clearOnError, errorClearDelay, limpiar]);

  const escribirDigito = (digito: string) => {
    if (disabled) return;
    if (pin.length >= length && !reintentando) return;
    aplicarValor(reintentando && pin.length >= length ? digito : pin + digito);
    // Devolver el foco al campo mantiene vivo el teclado fisico despues de
    // haber usado el teclado en pantalla.
    campoRef.current?.focus();
  };

  const borrarDigito = () => {
    if (disabled) return;
    aplicarValor(pin.slice(0, -1));
    campoRef.current?.focus();
  };

  /* Las teclas en pantalla son botones de verdad, asi que entran en el orden de
   * tabulacion. Con el foco en una de ellas, teclear una cifra en el teclado
   * fisico no llegaria al campo: este handler lo reencamina. */
  const alPulsarTeclaEnRaiz = (evento: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(evento);
    if (disabled || evento.defaultPrevented) return;
    if (evento.target === campoRef.current) return;
    if (evento.metaKey || evento.ctrlKey || evento.altKey) return;

    if (/^\d$/.test(evento.key)) {
      evento.preventDefault();
      escribirDigito(evento.key);
    } else if (evento.key === "Backspace") {
      evento.preventDefault();
      borrarDigito();
    }
  };

  const estadoDelPunto = (indice: number) => {
    if (feedback === "error") return "error" as const;
    if (feedback === "success") return "exito" as const;
    return indice < pin.length ? ("lleno" as const) : ("vacio" as const);
  };

  return (
    <div
      ref={ref}
      className={cn("flex flex-col items-center gap-[22px]", className)}
      data-feedback={feedback}
      onKeyDown={alPulsarTeclaEnRaiz}
      {...props}
    >
      <style href="tk-pin-shake" precedence="default">
        {SHAKE_KEYFRAMES}
      </style>

      {label !== undefined && (
        <label
          id={idEtiqueta}
          htmlFor={idCampo}
          className="font-display text-[17px] font-medium text-ink"
        >
          {label}
        </label>
      )}

      <div className="relative inline-flex">
        {/* El campo va ANTES que la fila y con `peer`: peer-* solo alcanza a los
            hermanos posteriores. Se estira sobre los puntos para que pulsarlos
            enfoque, y desaparece por opacidad — no por `hidden` ni por
            `sr-only`, que romperian el teclado del movil y el autorrelleno. */}
        <input
          ref={campoRef}
          id={idCampo}
          name={name}
          // El enmascarado es semantica, no pintura: asi tampoco lo dicta el
          // lector de pantalla ni lo guarda el navegador como texto.
          type="password"
          // Con teclado propio, `none` evita que el del sistema lo tape sin
          // dejar el campo de solo lectura: pegar y autorrellenar siguen vivos.
          inputMode={keypad ? "none" : "numeric"}
          autoComplete="one-time-code"
          autoFocus={autoFocus}
          disabled={disabled}
          /* `maxLength` solo mientras NO se esta reintentando. Con el limite
             puesto el navegador se come la pulsacion cuando el campo esta
             lleno y `onChange` ni se dispara, asi que no habria forma de
             detectar que el usuario quiere empezar de nuevo. */
          maxLength={reintentando ? undefined : length}
          value={pin}
          onChange={(evento) => {
            const crudo = soloDigitos(evento.target.value);
            // Lleno, en error y llegan cifras nuevas: es un intento nuevo, no un
            // desbordamiento que haya que ignorar.
            const empiezaDeNuevo = reintentando && pin.length >= length && crudo.length > length;
            aplicarValor(empiezaDeNuevo ? crudo.slice(length) : crudo);
          }}
          aria-label={label === undefined ? (ariaLabel ?? "Clave de acceso") : undefined}
          aria-labelledby={label !== undefined ? idEtiqueta : undefined}
          aria-describedby={idMensaje}
          aria-invalid={feedback === "error" || undefined}
          className="peer absolute inset-0 z-10 w-full cursor-default rounded-full opacity-0 outline-none disabled:cursor-not-allowed"
        />
        <div key={secuenciaError} className={pinFila({ feedback })} aria-hidden="true">
          {Array.from({ length }, (_, indice) => (
            <span
              key={indice}
              data-slot="pin-dot"
              data-estado={estadoDelPunto(indice)}
              className={pinPunto({ estado: estadoDelPunto(indice) })}
            />
          ))}
        </div>
      </div>

      {/* El hueco se reserva siempre (min-h 18) para que aparecer o quitar el
          mensaje no desplace el teclado bajo el dedo del usuario. */}
      <span
        id={idMensaje}
        role="status"
        aria-live="polite"
        className={cn(
          "inline-flex min-h-[18px] items-center gap-1.5 text-center text-[12.5px]",
          tonoMensaje[feedback],
        )}
      >
        {hint != null && hint !== "" && feedback === "error" && <AvisoGlifo />}
        {hint != null && hint !== "" && feedback === "success" && <CorrectoGlifo />}
        {hint}
      </span>

      {keypad && (
        <div className="grid w-full max-w-[300px] grid-cols-3 gap-2">
          {TECLAS.map((tecla) => (
            <button
              key={tecla}
              type="button"
              disabled={disabled}
              className={pinTecla()}
              // Sin esto el navegador saca el foco del campo al pulsar, y el
              // anillo de foco de los puntos parpadearia en cada cifra.
              onMouseDown={(evento) => evento.preventDefault()}
              onClick={() => escribirDigito(tecla)}
            >
              {tecla}
            </button>
          ))}
          {/* Hueco de la esquina inferior izquierda: el 0 va centrado. */}
          <div />
          <button
            type="button"
            disabled={disabled}
            className={pinTecla()}
            onMouseDown={(evento) => evento.preventDefault()}
            onClick={() => escribirDigito("0")}
          >
            0
          </button>
          <button
            type="button"
            disabled={disabled}
            aria-label="Borrar"
            className={pinTecla()}
            onMouseDown={(evento) => evento.preventDefault()}
            onClick={borrarDigito}
          >
            <BorrarGlifo />
          </button>
        </div>
      )}

      {onBiometric && (
        <button
          type="button"
          disabled={disabled}
          className={pinBiometria()}
          onMouseDown={(evento) => evento.preventDefault()}
          onClick={onBiometric}
        >
          <HuellaGlifo />
          {biometricLabel}
        </button>
      )}
    </div>
  );
});
