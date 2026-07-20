import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/* Seccion 43 · Teclado numerico & monto — EXTENSION.
 *
 * La bajada de la seccion dice "Basado en el numpad y las pantallas de monto
 * del archivo": basado en, no sacado de. Y el propio documento explica por que
 * no puede ser canonico: "Nunca se usa el teclado del sistema para dinero".
 *
 * El archivo de Figma SI trae un numpad (docs/figma-export/components/
 * KeyboardNumpad.jsx, nodo 2:124), pero es una replica del teclado nativo de
 * iOS: 393x289 sobre fondo rgb(212,214,220), teclas de 117x46 con radio 5,
 * sombra inferior y tipografia SF Pro. Nada de eso aplica aqui — este teclado
 * vive dentro de la pantalla de monto, sobre la superficie de la app, con la
 * tipografia de Tikin. Asi que la geometria sale del prototipo de la seccion
 * 43, no del export. NO es especificacion aprobada.
 *
 * GEOMETRIA (leida de los style= inline del prototipo)
 * ---------------------------------------------------
 *   tecla        52 de alto · radio 12 · sin borde · fondo transparente
 *                DM Mono 500 · 22 · tinta · icono 22 (biometria 24)
 *                hover  --tk-surface-2      pressed  --tk-border
 *   rejilla      3 columnas · hueco 8 · ancho 100% con tope en 300
 *   monto        DM Mono 500 · 40–56 · centrado · tinta (gris si placeholder)
 *   etiqueta     Ubuntu Mono 11 · tracking .1em · --tk-600 · MAYUSCULAS
 *   ayuda        Ubuntu Sans Mono 12 · tracking .02em · gris, rojo si invalido
 *
 * DOS CONFLICTOS ENTRE BLOQUES DEL PROPIO DOCUMENTO
 * -------------------------------------------------
 * 1. Estado pressed. La tira "VARIANTES DE TECLA" solo dibuja dos muestras
 *    (DEFAULT y PRESSED) y pinta la de PRESSED con --tk-surface-2. La demo
 *    "EN VIVO" declara la rampa completa en atributos data-: hover
 *    --tk-surface-2, press --tk-border. Manda la rampa de tres estados: la tira
 *    estatica no puede dibujar hover, asi que colapsa los dos en una muestra.
 *
 * 2. Ancho de tecla. La tira de variantes dibuja cajas de 64 de ancho, pero eso
 *    es el tamaño del especimen aislado. En la rejilla real las teclas son
 *    columnas iguales (100%/3). Se respeta la rejilla; 64 no se codifica.
 *
 * TEMA OSCURO
 * -----------
 * Todo sale de la capa --tk-* (via utilidades semanticas), que si invierte. No
 * se usa ningun token --key-* ni --keyboard-* de Figma porque los del archivo
 * describen el teclado de iOS, con grises fijos que en oscuro darian un bloque
 * gris claro pegado en la parte baja de la pantalla.
 */

/* ------------------------------------------------------------------ *
 * Formato de moneda es-CO: miles con punto, decimales con coma.
 * ------------------------------------------------------------------ */

/** Separador decimal del valor CRUDO. No es el de presentacion por casualidad:
 *  en es-CO coinciden, y guardar el crudo ya en coma evita una conversion. */
const DECIMAL = ",";

function agrupaMiles(digitos: string): string {
  // Inserta un punto cada tres cifras contando desde la derecha.
  return digitos.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function numeroACrudo(n: number, maxDecimals: number): string {
  const partes = Math.abs(n).toFixed(maxDecimals).split(".");
  const entero = partes[0] ?? "0";
  // Se recortan los ceros finales: 1250.50 se escribe "1250,5", igual que lo
  // habria tecleado el usuario. Asi el valor formateado de un chip sugerido y
  // el de la misma cifra tecleada a mano son identicos.
  const limpio = (partes[1] ?? "").replace(/0+$/, "");
  return limpio ? `${entero}${DECIMAL}${limpio}` : entero;
}

/**
 * Formatea un monto para mostrarlo, en convencion es-CO.
 *
 *     formatAmount("1250000")  // "1.250.000"
 *     formatAmount("1250,5")   // "1.250,5"
 *     formatAmount(1250.5)     // "1.250,5"
 *     formatAmount("")         // "0"
 *
 * NO usa Intl.NumberFormat a proposito. Intl normalizaria los estados
 * intermedios de la escritura — "1250," se convertiria en "1.250" y la coma que
 * el usuario acaba de pulsar desapareceria de la pantalla.
 */
export function formatAmount(value: string | number, maxDecimals = 2): string {
  const crudo = typeof value === "number" ? numeroACrudo(value, maxDecimals) : value;
  if (crudo === "") return "0";
  const partes = crudo.split(DECIMAL);
  const entero = partes[0] ?? "";
  const agrupado = agrupaMiles(entero === "" ? "0" : entero);
  return partes.length < 2 ? agrupado : `${agrupado}${DECIMAL}${partes[1] ?? ""}`;
}

/**
 * Convierte a numero un monto, crudo ("1250,5") o ya formateado ("1.250,5").
 * Devuelve 0 si esta vacio o incompleto — util para comparar contra el saldo.
 */
export function parseAmount(value: string): number {
  const normalizado = value.replaceAll(".", "").replace(DECIMAL, ".");
  const n = Number.parseFloat(normalizado);
  return Number.isFinite(n) ? n : 0;
}

/* ------------------------------------------------------------------ *
 * Glifos. packages/ui no depende de @phosphor-icons y este encargo no puede
 * añadir dependencias, asi que se dibujan a mano las dos que pide el prototipo:
 * ph-backspace y ph-fill ph-fingerprint. Heredan currentColor y su tamaño sale
 * de --tk-key-icon, que fija cada variante de tecla.
 * ------------------------------------------------------------------ */

function BorrarGlifo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9.1 4.5h9.4a2.4 2.4 0 0 1 2.4 2.4v10.2a2.4 2.4 0 0 1-2.4 2.4H9.1L2.6 12z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="m11.8 9.4 5 5.2M16.8 9.4l-5 5.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* El prototipo pide ph-fill, pero una huella "solida" en Phosphor sigue siendo
 * un juego de arcos: el relleno solo engorda el trazo. Se dibuja con trazo
 * grueso, que es lo que se ve a 24px. */
function HuellaGlifo() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4.2 10.4a8.6 8.6 0 0 1 15.6 0" />
      <path d="M5.8 17.9c.4-1.3.6-2.6.6-4a5.6 5.6 0 0 1 11.2 0c0 1.4-.1 2.8-.4 4.1" />
      <path d="M7.4 21.3a12 12 0 0 0 1.5-5.3v-2a3.1 3.1 0 0 1 6.2 0c0 2.5-.3 5-.9 7.4" />
      <path d="M11.1 22c.6-2 .9-4 .9-6" />
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 * AmountDisplay
 * ------------------------------------------------------------------ */

const amountValue = cva("font-num leading-none font-medium tabular-nums", {
  variants: {
    /* El documento da un rango, "DM Mono 40–56". s y l son los extremos; m es
       el 44 que dibuja el prototipo y por eso es el valor por defecto. */
    size: {
      s: "text-[40px]",
      m: "text-[44px]",
      l: "text-[56px]",
    },
    tone: {
      placeholder: "text-ink-500",
      value: "text-ink",
      /* fg-error, no `red`: --tk-fg-error si se aclara en el bloque .dark
         (rgb(255,138,138)); --colours-purered-600 es fijo y sobre fondo casi
         negro se hunde. */
      error: "text-fg-error",
    },
  },
  defaultVariants: { size: "m", tone: "value" },
});

type AmountValueVariants = VariantProps<typeof amountValue>;

export interface AmountDisplayProps
  extends
    Omit<React.ComponentPropsWithoutRef<"div">, "children">,
    Pick<AmountValueVariants, "size"> {
  /**
   * Monto en crudo — el mismo formato que emite `Keypad`: solo cifras y como
   * mucho una coma decimal ("1250", "1250,5"). Tambien acepta un numero.
   */
  value?: string | number;
  /** Simbolo delante del numero. Pasa "" para no pintar ninguno. */
  currency?: string;
  /** Rotulo pequeño encima. Se pone en MAYUSCULAS por CSS. */
  label?: React.ReactNode;
  /** Ayuda debajo. Pasa a rojo junto al numero cuando `invalid`. */
  hint?: React.ReactNode;
  /** El monto supera el saldo o el limite. Tiñe de rojo, NO bloquea. */
  invalid?: boolean;
  /** Numero que se pinta en gris mientras no hay nada escrito. */
  placeholder?: string;
  /** Decimales que conserva al formatear un `value` numerico. */
  maxDecimals?: number;
}

/**
 * El monto protagonista de la pantalla de envio.
 *
 * Arranca en gris con el placeholder y pasa a tinta en cuanto hay una cifra. Si
 * el monto supera el saldo, el numero y la ayuda pasan a rojo — pero la
 * escritura nunca se bloquea: quien deja de estar disponible es la CTA, que es
 * responsabilidad de quien monta la pantalla.
 */
export const AmountDisplay = React.forwardRef<HTMLDivElement, AmountDisplayProps>(
  function AmountDisplay(
    {
      className,
      value = "",
      currency = "$",
      label,
      hint,
      invalid = false,
      placeholder = "0",
      size,
      maxDecimals = 2,
      ...props
    },
    ref,
  ) {
    const hintId = React.useId();
    const vacio = value === "" || value === undefined;
    const numero = vacio ? formatAmount(placeholder) : formatAmount(value, maxDecimals);
    const tone = invalid ? "error" : vacio ? "placeholder" : "value";

    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-center gap-1.5 text-center", className)}
        {...props}
      >
        {label !== undefined && (
          <span className="font-meta text-[11px] tracking-[0.1em] text-ink-600 uppercase">
            {label}
          </span>
        )}
        {/* <output> ya trae role="status" y aria-live="polite". Aqui no es
            adorno: sin teclado del sistema no hay eco del dispositivo, asi que
            este anuncio es la unica confirmacion de que la pulsacion entro. */}
        <output
          className={amountValue({ size, tone })}
          aria-describedby={hint !== undefined ? hintId : undefined}
        >
          {currency ? `${currency} ${numero}` : numero}
        </output>
        {hint !== undefined && (
          <span
            id={hintId}
            className={cn(
              "font-mono text-xs tracking-[0.02em]",
              invalid ? "text-fg-error" : "text-ink-500",
            )}
          >
            {hint}
          </span>
        )}
      </div>
    );
  },
);

/* ------------------------------------------------------------------ *
 * Keypad
 * ------------------------------------------------------------------ */

/** Lo que emite una tecla: una cifra, la coma decimal, borrar o biometria. */
export type KeypadKey =
  "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "," | "backspace" | "biometric";

/** Que ocupa la esquina inferior izquierda del numpad. */
export type KeypadAction = "none" | "decimal" | "biometric";

const keypadKey = cva(
  [
    "inline-flex h-[52px] w-full items-center justify-center rounded-lg select-none",
    "border-none bg-transparent text-ink",
    "font-num text-[22px] leading-none font-medium",
    "cursor-pointer transition-colors duration-140 ease-out",
    "outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-page",
    // hover superficie 2 · pressed borde. La tira estatica del documento solo
    // llega a dibujar uno de los dos; ver cabecera.
    "hover:not-disabled:bg-surface-2 active:not-disabled:bg-edge",
    "disabled:cursor-not-allowed disabled:text-ink-500",
    "[&_svg]:size-[var(--tk-key-icon)] [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        numeric: "[--tk-key-icon:22px]",
        decimal: "[--tk-key-icon:22px]",
        backspace: "[--tk-key-icon:22px]",
        // La biometria es la unica que el prototipo dibuja a 24.
        biometric: "[--tk-key-icon:24px]",
      },
    },
    defaultVariants: { variant: "numeric" },
  },
);

export interface KeypadLabels {
  /** Nombre accesible de la tecla de borrar. */
  delete?: string;
  /** Nombre accesible de la coma decimal. */
  decimal?: string;
  /** Nombre accesible de la tecla de biometria. */
  biometric?: string;
}

/* Se tapan tres props del <div>:
 *   onKeyDown   lo ocupa la navegacion por flechas y la escritura fisica.
 *   children    las teclas las pone el componente, no el consumidor.
 *   onKeyPress  el handler del DOM con ese nombre esta obsoleto desde React 17
 *               y aqui el nombre se reutiliza para la tecla PULSADA del numpad,
 *               que es lo que un consumidor espera de "keypress" en un teclado. */
export interface KeypadProps extends Omit<
  React.ComponentPropsWithoutRef<"div">,
  "onKeyDown" | "children" | "onKeyPress"
> {
  /** Monto en crudo, gobernado por el padre. */
  value?: string;
  /** Monto en crudo inicial cuando el componente se gobierna solo. */
  defaultValue?: string;
  /** Solo se llama cuando el valor CAMBIA de verdad, no en cada pulsacion. */
  onValueChange?: (value: string) => void;
  /** Se llama en toda pulsacion, incluidas las que el limite descarta. */
  onKeyPress?: (key: KeypadKey) => void;
  /** Que va en la esquina inferior izquierda. */
  action?: KeypadAction;
  /** Solo con `action="biometric"`. La biometria nunca toca el monto. */
  onBiometric?: () => void;
  /** Cifras enteras como maximo. 7 = $ 9.999.999, el tope del documento. */
  maxIntegerDigits?: number;
  /** Decimales como maximo. Con 0, la coma deja de aceptarse. */
  maxDecimals?: number;
  disabled?: boolean;
  /** Nombre accesible del grupo entero. */
  "aria-label"?: string;
  /** Nombres accesibles de las teclas que no son cifras. */
  labels?: KeypadLabels;
}

const ETIQUETAS: Required<KeypadLabels> = {
  delete: "Borrar",
  decimal: "Coma decimal",
  biometric: "Autenticar con huella",
};

/** Rejilla 4x3. `null` es el hueco que deja `action="none"`. */
function construyeTeclas(action: KeypadAction): (KeypadKey | null)[] {
  const esquina: KeypadKey | null =
    action === "decimal" ? "," : action === "biometric" ? "biometric" : null;
  return [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    esquina,
    "0",
    "backspace",
  ] as (KeypadKey | null)[];
}

/**
 * Aplica una tecla sobre el monto crudo y devuelve el nuevo monto.
 * Devuelve el mismo valor cuando la pulsacion no cabe: los limites descartan la
 * cifra en silencio, nunca truncan lo ya escrito.
 */
function aplicaTecla(
  actual: string,
  key: KeypadKey,
  maxIntegerDigits: number,
  maxDecimals: number,
): string {
  if (key === "biometric") return actual;

  if (key === "backspace") return actual.slice(0, -1);

  const partes = actual.split(DECIMAL);
  const entero = partes[0] ?? "";
  const tieneComa = partes.length > 1;

  if (key === DECIMAL) {
    if (maxDecimals < 1 || tieneComa) return actual;
    // Sin parte entera la coma sola no se lee: se ancla con un cero.
    return actual === "" ? `0${DECIMAL}` : `${actual}${DECIMAL}`;
  }

  if (tieneComa) {
    return (partes[1] ?? "").length >= maxDecimals ? actual : actual + key;
  }
  // Nada de ceros a la izquierda. Se mira el VALOR de la parte entera, no que el
  // monto este vacio: a un "0" solo tambien se llega por otro camino — anclar la
  // coma sobre el vacio da "0," y borrar esa coma deja el cero suelto —, y
  // comprobando unicamente el vacio la siguiente cifra escribiria "05".
  //
  // Ese cero es un ancla de lectura, no una cifra escrita: cuenta como parte
  // entera vacia, asi que la cifra lo sustituye y otro cero no añade nada.
  const base = entero === "0" ? "" : entero;
  if (base === "" && key === "0") return actual;
  return base.length >= maxIntegerDigits ? actual : base + key;
}

/**
 * Teclado numerico propio de Tikin.
 *
 * El dinero nunca se escribe con el teclado del sistema: ese teclado tapa media
 * pantalla, ofrece un autocompletado que no viene a cuento y no garantiza que
 * haya una tecla de coma. Este numpad ocupa un sitio fijo, tiene ⌫ propia y,
 * cuando aplica, coma decimal o biometria en la esquina.
 *
 * ACCESIBILIDAD
 * Doce paradas de tabulacion serian doce, por eso la rejilla usa foco itinerante
 * (roving tabindex): solo una tecla es tabulable y las flechas mueven entre
 * ellas, dando la vuelta por filas y columnas. Ademas, con el foco dentro del
 * grupo el teclado fisico escribe: las cifras suman, Backspace borra y la coma o
 * el punto insertan el decimal. Sin eso, quien navega por teclado tendria que
 * ir tecla a tecla para escribir un monto.
 */
export const Keypad = React.forwardRef<HTMLDivElement, KeypadProps>(function Keypad(
  {
    className,
    value,
    defaultValue = "",
    onValueChange,
    onKeyPress,
    action = "none",
    onBiometric,
    maxIntegerDigits = 7,
    maxDecimals = 2,
    disabled = false,
    labels,
    "aria-label": ariaLabel = "Teclado numérico",
    ...props
  },
  ref,
) {
  const teclas = React.useMemo(() => construyeTeclas(action), [action]);
  // Uno a uno y con ??, no con spread: `{...ETIQUETAS, ...labels}` deja el
  // nombre en undefined si el consumidor pasa `{ delete: undefined }`, y una
  // tecla de icono sin aria-label se queda sin nombre accesible.
  const nombres: Required<KeypadLabels> = {
    delete: labels?.delete ?? ETIQUETAS.delete,
    decimal: labels?.decimal ?? ETIQUETAS.decimal,
    biometric: labels?.biometric ?? ETIQUETAS.biometric,
  };

  const esControlado = value !== undefined;
  const [interno, setInterno] = React.useState(defaultValue);
  const actual = esControlado ? value : interno;

  const referencias = React.useRef<(HTMLButtonElement | null)[]>([]);
  const [indiceActivo, setIndiceActivo] = React.useState(0);
  // Si `action` cambia y el hueco se vacia, el indice guardado apuntaria a una
  // celda inexistente y la rejilla se quedaria sin ninguna tecla tabulable.
  const indiceItinerante = teclas[indiceActivo] ? indiceActivo : teclas.findIndex(Boolean);

  const pulsa = (key: KeypadKey) => {
    if (disabled) return;
    onKeyPress?.(key);
    if (key === "biometric") {
      onBiometric?.();
      return;
    }
    const siguiente = aplicaTecla(actual, key, maxIntegerDigits, maxDecimals);
    if (siguiente === actual) return;
    if (!esControlado) setInterno(siguiente);
    onValueChange?.(siguiente);
  };

  const mueveFoco = (desde: number, dFila: number, dColumna: number) => {
    let fila = Math.floor(desde / 3);
    let columna = desde % 3;
    // Como mucho una vuelta entera: si no hay otra tecla, se queda donde esta.
    for (let i = 0; i < teclas.length; i += 1) {
      fila = (fila + dFila + 4) % 4;
      columna = (columna + dColumna + 3) % 3;
      const indice = fila * 3 + columna;
      if (teclas[indice]) {
        setIndiceActivo(indice);
        referencias.current[indice]?.focus();
        return;
      }
    }
  };

  const alPulsarTeclaFisica = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const desde = indiceItinerante < 0 ? 0 : indiceItinerante;

    switch (event.key) {
      case "ArrowRight":
        mueveFoco(desde, 0, 1);
        break;
      case "ArrowLeft":
        mueveFoco(desde, 0, -1);
        break;
      case "ArrowDown":
        mueveFoco(desde, 1, 0);
        break;
      case "ArrowUp":
        mueveFoco(desde, -1, 0);
        break;
      case "Backspace":
      case "Delete":
        pulsa("backspace");
        break;
      case ",":
      case ".":
        // El punto tambien vale: en un teclado numerico fisico la tecla decimal
        // es un punto, y quien escribe pesos espera que ponga la coma.
        if (action === "decimal") pulsa(",");
        else return;
        break;
      default:
        if (!/^[0-9]$/.test(event.key)) return;
        pulsa(event.key as KeypadKey);
    }
    // Solo se llega aqui si la tecla se consumio: asi Tab, Enter y Espacio
    // siguen haciendo lo suyo sobre el boton enfocado.
    event.preventDefault();
  };

  return (
    <div
      ref={ref}
      role="group"
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      data-disabled={disabled || undefined}
      className={cn("grid w-full max-w-[300px] grid-cols-3 gap-2", className)}
      onKeyDown={alPulsarTeclaFisica}
      {...props}
    >
      {teclas.map((tecla, indice) => {
        if (tecla === null) {
          // Hueco real, no `display:none`: mantiene la columna del 0 centrada.
          return <div key={`hueco-${indice}`} aria-hidden="true" />;
        }

        const variant =
          tecla === "backspace"
            ? "backspace"
            : tecla === "biometric"
              ? "biometric"
              : tecla === ","
                ? "decimal"
                : "numeric";

        // En las cifras el nombre accesible es el propio texto visible; poner un
        // aria-label ahi solo serviria para poder desincronizarlo.
        const nombre =
          tecla === "backspace"
            ? nombres.delete
            : tecla === "biometric"
              ? nombres.biometric
              : tecla === ","
                ? nombres.decimal
                : undefined;

        return (
          <button
            key={tecla}
            ref={(el) => {
              referencias.current[indice] = el;
            }}
            type="button"
            disabled={disabled}
            data-key={tecla}
            aria-label={nombre}
            // Foco itinerante: una sola parada de tabulacion en toda la rejilla.
            tabIndex={indice === indiceItinerante ? 0 : -1}
            onFocus={() => setIndiceActivo(indice)}
            onClick={() => pulsa(tecla)}
            className={keypadKey({ variant })}
          >
            {tecla === "backspace" ? (
              <BorrarGlifo />
            ) : tecla === "biometric" ? (
              <HuellaGlifo />
            ) : (
              tecla
            )}
          </button>
        );
      })}
    </div>
  );
});
