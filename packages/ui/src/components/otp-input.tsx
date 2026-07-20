import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/* Seccion 36 · OTP — EXTENSION.
 *
 * El propio documento lo etiqueta: "Extension con la paleta del sistema". No
 * existe en el archivo de Figma (docs/figma-export/components no tiene ningun
 * cuerpo OTP/PIN/passcode), asi que la geometria sale del prototipo del
 * documento y los colores de los tokens ya aprobados del TextField. Es una
 * propuesta coherente, NO especificacion aprobada.
 *
 * MEDIDAS DEL PROTOTIPO (atributos style= del bloque, no de la demo en vivo)
 * -------------------------------------------------------------------------
 *   casilla        48 x 56, radio 12, gap 10
 *   cifra          DM Mono 500, 22px, --tk-ink
 *   reposo         borde 0.5px --tk-border-2
 *   activa         borde 1.5px --tk-ink + caret 2 x 24 parpadeando
 *   error          borde 1px rgb(255,46,46) sobre rgba(255,46,46,.04)
 *   valido         borde 1px --tk-fg-success sobre --tk-tint-success
 *   deshabilitado  borde 0.5px --tk-border sobre --tk-surface-2
 *
 * UN SOLO INPUT, NO SEIS
 * ----------------------
 * Las casillas son <div> decorativos; debajo hay UN input transparente que
 * cubre toda la fila. Es lo que hace el prototipo y hay tres razones de peso:
 *
 *   Autocompletado del SMS — el documento lo pide explicitamente. iOS rellena
 *   `autocomplete="one-time-code"` en un unico campo; con seis campos solo cae
 *   el primer digito. La WebOTP API de Chrome tiene el mismo requisito.
 *
 *   Pegar — con un solo input, pegar "314279" es un change normal que el
 *   sanitizador reparte solo. Con seis inputs hay que interceptar onPaste en
 *   cada uno y redistribuir a mano.
 *
 *   Lector de pantalla — un unico textbox con el codigo entero se anuncia como
 *   un valor. Seis campos obligan a seis etiquetas del tipo "digito 3 de 6" y
 *   el usuario oye la ristra completa cada vez que corrige.
 *
 * El precio es que el caret nativo no se ve (el input va a opacidad 0), asi que
 * lo dibujamos nosotros en la casilla activa. */

/* Los @keyframes no se pueden expresar como utilidad de Tailwind sin declararlos
 * en el tema, y packages/tokens es territorio de otro agente. React 19 hoista a
 * <head> cualquier <style> con `href` + `precedence` y lo deduplica por href.
 * Mismo mecanismo que usan skeleton.tsx y progress.tsx.
 *
 * step-end y no un fundido: un caret de texto parpadea duro, no respira. */
const CARET_KEYFRAMES = `
@keyframes tk-otp-caret {
  0%, 50%   { opacity: 1; }
  50.01%, 100% { opacity: 0; }
}`;

const otpCell = cva(
  [
    /* 48 x 56 y radio 12, literales del prototipo. No hay escala de tamaños:
       el documento solo define esta geometria. */
    "relative flex h-14 w-12 shrink-0 items-center justify-center rounded-lg",
    /* 0.5px es literal, igual que en el TextField; no es un redondeo de 1px.
       El FONDO es una desviacion deliberada del prototipo: sus casillas en
       reposo solo declaran borde y radio, asi que heredarian --tk-surface. Se
       usa el mismo token que el TextField porque este OTP se declara construido
       con sus colores, y un campo del sistema se distingue de la tarjeta que lo
       contiene. Cambiarlo desalinearia OTP y TextField puestos uno al lado del
       otro, que es el caso real de una pantalla de verificacion. */
    "border-[0.5px] bg-[var(--textfield-bg-default)]",
    // DM Mono 500 a 22px. tabular-nums para que el 1 ocupe lo mismo que el 8.
    "font-num text-[22px] leading-none font-medium text-ink tabular-nums",
    "transition-[border-color,background-color,box-shadow] duration-140 ease-out",
    "select-none",
  ],
  {
    variants: {
      feedback: {
        default: "border-edge-2",
        /* purered-600 es exactamente el rgb(255,46,46) del prototipo, y
           purered-transparent su 5% (el prototipo pinta 4%: la diferencia es
           imperceptible y preferimos el token).

           El grosor sube de 0.5 a 1px porque el prototipo lo pide asi en los
           dos casos (`border:1px solid rgb(255,46,46)` y
           `border:1px solid var(--tk-fg-success)`). Aqui SI se puede tocar
           border-width, al reves que en el foco: feedback no es un estado
           transitorio, no va y viene mientras se escribe, asi que el medio
           pixel que se come del area de contenido no produce ningun salto
           visible de la cifra. */
        error: "border-[1px] border-red bg-red-tint",
        success: "border-[1px] border-fg-success bg-tint-success",
      },

      /* La casilla activa NO engorda el borde de 0.5 a 1.5px como el prototipo:
         lo simula con una sombra interior. Con box-sizing:border-box cambiar
         border-width encoge el area de contenido y la cifra da un salto de un
         pixel al entrar y al salir el foco. Mismo criterio que text-field.tsx. */
      active: { true: "", false: "" },

      /* Va despues de `feedback` a proposito: CVA concatena en orden de
         declaracion y tailwind-merge se queda con la ultima, asi que el gris
         apagado gana al rojo o al verde. Un campo inerte no da feedback.
         OJO: ese "gana" solo es cierto si la salida de cva pasa por cn(); ver
         la nota del punto de uso mas abajo. */
      disabled: {
        /* border-[0.5px] explicito, no heredado de la base: si `feedback` es
           error o exito ya subio el grosor a 1px, y tailwind-merge se queda con
           la ultima de cada grupo. Sin repetirlo aqui, una casilla inerte con
           feedback saldria a 1px cuando el prototipo la dibuja a 0.5px. */
        true: "cursor-not-allowed border-[0.5px] border-edge bg-surface-2 text-ink-500",
        false: "",
      },
    },

    compoundVariants: [
      {
        active: true,
        disabled: false,
        feedback: "default",
        class: "border-ink shadow-[inset_0_0_0_1px_var(--tk-ink)]",
      },
      /* En error y en exito el foco NO vuelve a tinta: el usuario perderia la
         señal justo cuando esta corrigiendo. Solo engorda el mismo color. */
      {
        active: true,
        disabled: false,
        feedback: "error",
        class: "shadow-[inset_0_0_0_1px_var(--colours-purered-600)]",
      },
      {
        active: true,
        disabled: false,
        feedback: "success",
        class: "shadow-[inset_0_0_0_1px_var(--tk-fg-success)]",
      },
    ],

    defaultVariants: { feedback: "default", active: false, disabled: false },
  },
);

type OtpCellVariants = VariantProps<typeof otpCell>;

const messageTone = {
  default: "text-ink-600",
  success: "text-fg-success",
  error: "text-fg-error",
} as const;

/** Solo cifras. El documento habla de "6 digitos" y de teclado numerico. */
function onlyDigits(raw: string): string {
  return raw.replace(/\D/g, "");
}

/* aria-describedby es una lista de ids, no de clases: no puede pasar por cn(),
 * porque tailwind-merge intentaria resolver conflictos entre ellos. */
function ids(...parts: Array<string | false | null | undefined>): string | undefined {
  const list = parts.filter(Boolean).join(" ");
  return list === "" ? undefined : list;
}

export interface OtpInputProps
  extends
    Omit<
      React.ComponentPropsWithoutRef<"input">,
      "value" | "defaultValue" | "type" | "maxLength" | "children" | "size"
    >,
    Pick<OtpCellVariants, "feedback"> {
  /** Numero de casillas. El documento dibuja 6 (por defecto) y 4. */
  length?: number;
  /** Codigo actual. Presente = componente controlado. */
  value?: string;
  /** Codigo inicial cuando el componente es no controlado. */
  defaultValue?: string;
  /** Recibe el codigo ya saneado: solo cifras y recortado a `length`. */
  onValueChange?: (value: string) => void;
  /** Se dispara al llegar a `length` cifras. El sitio donde lanzar la verificacion. */
  onComplete?: (value: string) => void;
  /**
   * Nombre accesible del campo. Es UN solo textbox con el codigo entero, no
   * seis: el lector anuncia el valor completo.
   */
  label?: string;
  /** Mensaje bajo las casillas. Toma el color de `feedback`. */
  message?: React.ReactNode;
  /** Clases del bloque externo (casillas + mensaje). */
  wrapperClassName?: string;
}

/**
 * Codigo de un solo uso del sistema Tikin.
 *
 * EXTENSION construida con los tokens, no componente del archivo de Figma.
 *
 * Comportamiento del documento: cada cifra salta a la siguiente casilla y
 * borrar retrocede; pegar el codigo completo lo reparte; la casilla activa
 * lleva borde tinta y caret; al fallar se marcan las seis en rojo con mensaje.
 *
 * `className` estiliza el CONTROL (la fila de casillas), que es lo que un
 * consumidor entiende por "el campo". Para el bloque entero — casillas y
 * mensaje — esta `wrapperClassName`. La ref apunta al `<input>` real.
 */
export const OtpInput = React.forwardRef<HTMLInputElement, OtpInputProps>(function OtpInput(
  {
    className,
    wrapperClassName,
    length = 6,
    value,
    defaultValue,
    onValueChange,
    onComplete,
    onChange,
    onFocus,
    onBlur,
    onSelect,
    feedback = "default",
    label = "Código de verificación",
    message,
    disabled = false,
    readOnly,
    id: idProp,
    "aria-describedby": describedBy,
    ...props
  },
  ref,
) {
  const autoId = React.useId();
  const id = idProp ?? autoId;
  const messageId = `${id}-message`;

  const [uncontrolled, setUncontrolled] = React.useState(() =>
    onlyDigits(defaultValue ?? "").slice(0, length),
  );
  const isControlled = value !== undefined;
  const code = (isControlled ? onlyDigits(value ?? "") : uncontrolled).slice(0, length);

  const [focused, setFocused] = React.useState(false);

  /* La ref es del consumidor Y nuestra: la necesitamos para clavar el caret al
     final. useImperativeHandle es innecesario aqui porque exponemos el mismo
     nodo, basta con reenviarlo. */
  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement, []);

  /* Casilla activa = la primera vacia. Cuando el codigo esta completo se queda
     en la ultima, para que el foco siga teniendo un sitio visible. */
  const activeIndex = Math.min(code.length, length - 1);

  /* readOnly NO se pliega con disabled, aunque los dos rechacen escritura. Un
     campo de solo lectura SI es enfocable y SI entra en el orden de tabulacion.
     Si compartiera el gris apagado del deshabilitado y ademas se quedara sin
     casilla activa, al tabular hasta el no se dibujaria nada: el caret nativo
     va a opacidad 0 y no hay ningun otro indicador de foco en el componente. El
     usuario de teclado perderia la posicion — WCAG 2.4.7 Focus Visible.
     Solo `disabled` apaga la casilla y el cursor; readOnly se pinta en reposo,
     que es lo que la historia SoloLectura promete: enseñar el codigo. */
  const readOnlyField = readOnly === true;
  const showActive = focused && !disabled;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = onlyDigits(event.target.value).slice(0, length);

    /* Se reescribe el valor del evento ANTES de propagarlo para que quien lea
       event.target.value — react-hook-form, Formik, un onChange a pelo — vea el
       codigo saneado y no lo que el usuario tecleo. Ademas devuelve el DOM a su
       sitio cuando se rechaza una letra: sin esto React no vuelve a pintar,
       porque el value que le pasamos no ha cambiado. */
    event.target.value = next;

    if (!isControlled) setUncontrolled(next);
    onValueChange?.(next);
    onChange?.(event);

    // Solo al cruzar el umbral, no en cada tecla con el codigo ya completo.
    if (next.length === length && next !== code) onComplete?.(next);
  };

  /* El caret nativo es invisible, asi que dibujar uno en la casilla 4 mientras
     el navegador escribe en la 2 seria mentir. Clavamos la seleccion al final
     para que escribir siempre añada y borrar siempre quite por la derecha.
     Se respeta la seleccion completa (Cmd+A) porque es intencion explicita del
     usuario: teclear encima reemplaza el codigo entero. */
  const pinCaretToEnd = React.useCallback(() => {
    const input = inputRef.current;
    if (input == null) return;
    const end = input.value.length;
    const selectedAll = input.selectionStart === 0 && input.selectionEnd === end && end > 0;
    if (selectedAll) return;
    if (input.selectionStart !== end || input.selectionEnd !== end) {
      input.setSelectionRange(end, end);
    }
  }, []);

  return (
    /* Sin `gap` aqui a proposito: la separacion del mensaje va como `mt-2` del
       propio mensaje. El nodo del mensaje esta SIEMPRE montado (ver abajo) y un
       gap se lo cobraria tambien cuando esta vacio, metiendo 8px muertos a todo
       consumidor que no pase `message`. Con margen propio, vacio no ocupa. */
    <div className={cn("flex w-fit flex-col", wrapperClassName)}>
      <div
        className={cn(
          "relative w-fit",
          // En solo lectura el cursor sigue siendo de texto: se puede
          // seleccionar y copiar el codigo, solo no reescribirlo.
          disabled ? "cursor-not-allowed" : "cursor-text",
          className,
        )}
      >
        {/* Cubre toda la fila: pulsar en cualquier casilla enfoca el campo sin
            necesidad de un onClick que reenvie el foco a mano. Va absoluto, asi
            que pinta por encima de las casillas aunque este antes en el DOM. */}
        <input
          ref={inputRef}
          id={id}
          value={code}
          disabled={disabled}
          readOnly={readOnly}
          /* Sin maxLength a proposito, aunque parezca lo natural. maxLength
             cuenta CARACTERES CRUDOS: al pegar "314 279" el navegador recorta a
             seis ("314 27") antes de que nuestro sanitizador vea nada, y se
             pierde la ultima cifra. El limite lo impone el slice de
             handleChange, que cuenta cifras. */
          onChange={handleChange}
          onFocus={(event) => {
            setFocused(true);
            pinCaretToEnd();
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          onSelect={(event) => {
            pinCaretToEnd();
            onSelect?.(event);
          }}
          // Teclado numerico en movil y autocompletado del SMS: los dos los
          // pide el documento y los dos dependen de estos atributos.
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]*"
          spellCheck={false}
          autoCorrect="off"
          aria-label={label}
          aria-invalid={feedback === "error" || undefined}
          aria-describedby={ids(message != null && messageId, describedBy)}
          className={cn(
            "absolute inset-0 h-full w-full opacity-0",
            "border-none bg-transparent outline-none",
            disabled ? "cursor-not-allowed" : "cursor-text",
          )}
          {...props}
        />

        {/* Las casillas duplican lo que ya anuncia el input: para un lector de
            pantalla son ruido. */}
        <div aria-hidden="true" className="flex flex-wrap gap-2.5">
          {Array.from({ length }, (_, index) => {
            const digit = code[index];
            const isActive = showActive && index === activeIndex;
            /* Con el codigo completo la ultima casilla sigue activa pero ya no
               lleva caret: se solaparia con la cifra. En solo lectura tampoco
               hay caret — el borde tinta ya marca el foco, y un caret
               parpadeando invitaria a teclear en un campo que no admite. */
            const showCaret = isActive && digit === undefined && !readOnlyField;

            return (
              <div
                key={index}
                data-slot="otp-cell"
                data-index={index}
                data-filled={digit !== undefined || undefined}
                data-active={isActive || undefined}
                /* cva SOLO concatena: no resuelve conflictos. Sin cn() la
                   casilla salia con `bg-[var(--textfield-bg-default)]` Y
                   `bg-red-tint`, o con `border-red` Y `border-edge`, y cual
                   ganaba lo decidia el orden de la hoja de estilos generada,
                   no el orden de las variantes. tailwind-merge es quien hace
                   valer la ultima. */
                className={cn(otpCell({ feedback, active: isActive, disabled }))}
              >
                {showCaret ? (
                  <span
                    className={cn(
                      "h-6 w-[2px] bg-ink",
                      "animate-[tk-otp-caret_1s_step-end_infinite] motion-reduce:animate-none",
                    )}
                  />
                ) : (
                  digit
                )}
              </div>
            );
          })}
        </div>

        {showActive && (
          <style href="tk-otp-caret" precedence="default">
            {CARET_KEYFRAMES}
          </style>
        )}
      </div>

      {/* La region live se monta SIEMPRE, tambien vacia. Un aria-live que
          aparece en el DOM en el mismo commit que su texto no lo anuncia en la
          mayoria de lectores: la region tiene que estar registrada de antes
          para que el cambio se detecte. Es justo el caso real — `message` es
          undefined hasta que la verificacion falla, y "Codigo incorrecto. Te
          quedan N intentos." es exactamente lo que hay que anunciar.
          Vacio no ocupa: sin contenido no hay caja de texto y el mt-2 solo se
          aplica cuando hay mensaje. */}
      <span
        id={messageId}
        /* Polite y no assertive: el error llega como respuesta del servidor y
           no debe cortar lo que el lector este leyendo. */
        aria-live="polite"
        className={cn(
          "flex items-center gap-1.5 text-[12.5px] leading-snug",
          "[&_svg]:size-[15px] [&_svg]:shrink-0",
          message != null && "mt-2",
          messageTone[feedback ?? "default"],
        )}
      >
        {message}
      </span>
    </div>
  );
});
