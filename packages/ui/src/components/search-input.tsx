import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/* Seccion 24 · Search — EXTENSION.
 *
 * La bajada de la seccion lo dice literal: "Extension construida con los tokens
 * del archivo". No hay ningun nodo de buscador en Figma —
 * docs/figma-export/components/ no exporta nada parecido y fig-tokens.css no
 * declara ninguna variable --search-*. Asi que todo lo de este fichero es
 * propuesta coherente con los tokens, no especificacion aprobada. No lo cites
 * como canonico.
 *
 * GEOMETRIA (fuente: bloque "ESTADOS" del prototipo, que aplica los estilos
 * inline). Se ignora a proposito el bloque "EN VIVO · FILTRA AL ESCRIBIR": esa
 * demo pinta el borde siempre en --tk-ink porque esta permanentemente enfocada,
 * y ahi el borde en tinta es el estado FOCUS, no el estado por defecto.
 *
 *   alto 52 · radio 12 · borde 0.5px · texto Sans 16
 *   lupa 20 a la izquierda 16  ->  el texto arranca en 46 (16 + 20 + gap 10)
 *   limpiar: circulo 26, fondo --tk-border, X de 14, a 12 del borde derecho
 *   cargar:  aro 18 de trazo 2, --tk-border con la cabeza en --tk-ink, 0.7s
 *
 *   default  borde --tk-border-2 · lupa --tk-600
 *   focus    borde --tk-ink      · lupa --tk-ink
 *
 * POR QUE 52 Y NO 48 (h-control-l)
 * --------------------------------
 * El buscador se sale a proposito de la escala de alturas de control 48/40/32
 * de la seccion 03. El prototipo lo dibuja a 52 en los cuatro estados, y con un
 * icono de 20 y texto de 16 dentro, 48 deja solo 14 de aire arriba y abajo. Se
 * respeta el valor del documento.
 *
 * POR QUE NO USA NINGUN TOKEN --textfield-*
 * -----------------------------------------
 * Aunque este componente sea primo del TextField, el prototipo lo pinta con la
 * capa semantica directa (--tk-surface, --tk-border-2, --tk-ink) y no con los
 * tokens del campo de Figma. Se mantiene asi por dos razones: es lo que dice el
 * documento, y ademas deja el componente entero dentro de la capa --tk-*, que
 * es la unica que congela `.tk-static` en las matrices de especificacion. Un
 * componente mitad --tk-* mitad --textfield-* daria muestras a medias.
 */

const searchBox = cva(
  [
    // `group` para que la lupa pueda teñirse en tinta cuando el campo tiene el
    // foco: el input real es un hermano, no un ancestro del icono.
    "group relative flex w-full items-center gap-2.5 px-4",
    "h-[52px] rounded-lg border-[0.5px] bg-surface",
    "transition-[border-color,background-color,box-shadow] duration-140 ease-out",
  ],
  {
    variants: {
      disabled: {
        /* El documento no dibuja un buscador deshabilitado. Se deriva del resto
           del sistema: superficie apagada, borde suave y sin reaccion al
           cursor. Es la parte mas "extension" de este componente. */
        true: "cursor-not-allowed border-edge bg-surface-2",
        false: [
          "border-edge-2 hover:border-ink-600",
          /* El foco no engorda el borde (0.5 -> 1) como haria un `border-2`:
             con box-sizing:border-box eso encoge el area de contenido y el
             texto pega un salto de medio pixel al entrar y al salir del campo.
             Se simula con una sombra interior de 0.5px, igual que el
             TextField. */
          "focus-within:border-ink focus-within:shadow-[inset_0_0_0_0.5px_var(--tk-ink)]",
        ],
      },
    },
    defaultVariants: { disabled: false },
  },
);

type SearchBoxVariants = VariantProps<typeof searchBox>;

/* Iconos dibujados a mano. packages/ui no depende de @phosphor-icons y este
 * encargo no puede añadir dependencias; el prototipo usa ph-magnifying-glass y
 * ph-x. Heredan currentColor y van ocultos al lector: el nombre accesible lo
 * ponen la etiqueta del campo y el aria-label del boton. */
function LupaGlifo() {
  return (
    <svg
      viewBox="0 0 20 20"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="8.75" cy="8.75" r="5.75" />
      <path d="m13.1 13.1 3.9 3.9" />
    </svg>
  );
}

function EquisGlifo() {
  return (
    <svg
      viewBox="0 0 14 14"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M3.5 3.5 10.5 10.5M10.5 3.5 3.5 10.5" />
    </svg>
  );
}

/* Aro de 18 con trazo 2 girando a 0.7s, la receta del bloque LOADING. No
 * reutiliza <Spinner> porque su escala es 16/24/40 y aqui el hueco de la lupa
 * mide 20: un aro de 16 bailaria dentro y uno de 24 desplazaria el texto. */
function AroDeCarga() {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "size-[18px] rounded-full border-2 border-edge border-t-ink",
        // animate-spin de Tailwind gira a 1s; el documento pide 0.7s lineal.
        "animate-spin [animation-duration:0.7s]",
        // Un aro congelado se lee como interfaz rota, no como respeto por las
        // preferencias: se ralentiza en vez de pararse.
        "motion-reduce:[animation-duration:2.1s]",
      )}
    />
  );
}

/**
 * Escribe en el input como lo haria el usuario, para que React dispare su
 * `onChange` de verdad.
 *
 * Asignar `input.value = ""` a secas no sirve: React parchea el setter de la
 * propiedad para llevar su propia contabilidad, asi que el valor cambiaria en
 * el DOM pero ningun handler se enteraria y un formulario controlado volveria a
 * pintar el texto viejo. Se llama al setter nativo original y se lanza un
 * evento `input` que burbujea, que es exactamente lo que React escucha.
 */
function setNativeValue(input: HTMLInputElement, next: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
  setter?.call(input, next);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

export interface SearchInputProps
  extends
    Omit<React.ComponentPropsWithoutRef<"input">, "type" | "size" | "children">,
    Omit<SearchBoxVariants, "disabled"> {
  /**
   * Nombre accesible del campo. Va oculto visualmente: el prototipo no dibuja
   * etiqueta, solo el placeholder — y un placeholder NO es un nombre accesible,
   * porque desaparece en cuanto se escribe.
   */
  label?: string;
  /** Muestra la etiqueta encima del campo en vez de ocultarla. */
  showLabel?: boolean;
  /**
   * Se llama con el texto ya actualizado en cada cambio, incluido el que
   * provoca el boton de limpiar. Es el atajo para filtrar en vivo sin tener que
   * leer `event.target.value`.
   */
  onValueChange?: (value: string) => void;
  /** Sustituye la lupa por un aro girando. El campo sigue siendo editable. */
  loading?: boolean;
  /** Texto que anuncia el lector de pantalla mientras `loading`. */
  loadingLabel?: string;
  /**
   * Pinta la X de limpiar cuando hay texto y deja que Escape vacie el campo.
   * Por defecto `true`. Un campo `disabled` o `readOnly` nunca ofrece limpiar,
   * pase lo que pase aqui.
   */
  clearable?: boolean;
  /** Se llama despues de vaciar el campo, ya sea por la X o por Escape. */
  onClear?: () => void;
  /** Nombre accesible del boton de limpiar. */
  clearLabel?: string;
  /** Sustituye la lupa. Pensado para pasar el glifo de Phosphor del producto. */
  icon?: React.ReactNode;
  /** Clases del contenedor externo (etiqueta + campo). */
  wrapperClassName?: string;
}

/**
 * Campo de busqueda del sistema Tikin.
 *
 * Filtra en vivo: no hay boton de buscar. La lupa esta siempre a la izquierda y
 * la X de limpiar aparece solo cuando hay texto; durante la carga la lupa se
 * reemplaza por un aro girando.
 *
 * Funciona controlado (`value` + `onValueChange`) y sin controlar
 * (`defaultValue`). La ref apunta al `<input>` real; `className` estiliza la
 * caja del campo, que es lo que un consumidor entiende por "el buscador".
 *
 * NO renderiza la lista de resultados. El desplegable de recientes, resultados
 * y "sin resultados" que dibuja el documento se compone fuera, porque su
 * contenido y su navegacion dependen del dominio de cada pantalla. Con ello, la
 * semantica de combobox (`role`, `aria-expanded`, `aria-controls`,
 * `aria-activedescendant`) tambien le toca al consumidor: la story "En vivo"
 * documenta el cableado completo.
 *
 * ESCAPE: con texto vacia el campo y se queda el evento — ni siquiera un Modal
 * o un Popover de Radix por encima se cierra. Con el campo ya vacio, el evento
 * sube y cierra lo que lo envuelva. Dos pulsaciones, dos efectos.
 */
export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(
    {
      className,
      wrapperClassName,
      label = "Buscar",
      showLabel = false,
      placeholder = "Buscar",
      loading = false,
      loadingLabel = "Buscando",
      clearable = true,
      clearLabel = "Limpiar",
      icon,
      onValueChange,
      onClear,
      onChange,
      onKeyDown,
      id: idProp,
      value,
      defaultValue,
      disabled,
      readOnly,
      ...props
    },
    ref,
  ) {
    const autoId = React.useId();
    const id = idProp ?? autoId;

    /* La ref es doble: el consumidor recibe el <input>, pero el componente
       tambien necesita alcanzarlo para devolverle el foco y para escribir en el
       al limpiar. */
    const innerRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => innerRef.current as HTMLInputElement, []);

    /* Hace falta saber si hay texto para decidir si se pinta la X, y eso no se
       puede leer del DOM durante el render. Se guarda una copia solo cuando el
       campo NO esta controlado; si lo esta, manda la prop. */
    const isControlled = value !== undefined;
    const [innerValue, setInnerValue] = React.useState(() => String(defaultValue ?? ""));
    const currentValue = isControlled ? String(value ?? "") : innerValue;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInnerValue(event.target.value);
      onChange?.(event);
      onValueChange?.(event.target.value);
    };

    const clear = () => {
      const input = innerRef.current;
      if (!input) return;
      // Pasa por el setter nativo: asi el vaciado viaja por el mismo camino que
      // una pulsacion de tecla y `onChange` se entera igual.
      setNativeValue(input, "");
      /* El foco vuelve al campo a proposito. La X desaparece en cuanto se
         vacia, y si el foco se quedara en ella el usuario de teclado acabaria
         con el foco en el <body>, perdido al principio del documento. */
      input.focus();
      onClear?.();
    };

    /* Escape limpia, pero SOLO si queda algo que limpiar. Con el campo vacio el
       evento sigue subiendo para que el modal, el popover o el panel de
       resultados que lo envuelva pueda cerrarse — que es lo que el usuario
       espera al pulsar Escape dos veces.
       readOnly cuenta como "nada que limpiar": el setter nativo que usa `clear`
       NO respeta readOnly, asi que sin esta guarda un campo de solo lectura se
       vaciaria igual. */
    const puedeLimpiar = clearable && !disabled && !readOnly && currentValue !== "";

    /* El listener nativo de mas abajo se registra UNA sola vez y no puede
       recapturar closures, asi que lee la decision por ref. Se refresca en cada
       render (efecto sin dependencias) en vez de mutarla durante el render. */
    const limpiarPorEscapeRef = React.useRef<() => boolean>(() => false);
    React.useEffect(() => {
      limpiarPorEscapeRef.current = () => {
        if (!puedeLimpiar) return false;
        clear();
        return true;
      };
    });

    /* Marca el evento NATIVO que ya se ha atendido en captura, para que el
       handler sintetico no vuelva a limpiar ni se coma un Escape ajeno. */
    const escapeAtendidoRef = React.useRef<KeyboardEvent | null>(null);

    /* POR QUE UN LISTENER NATIVO EN CAPTURA Y NO SOLO `onKeyDown`
       -----------------------------------------------------------
       La composicion principal de este campo es dentro de un Modal o un
       Popover, y ambos se apoyan en el DismissableLayer de Radix, que escucha
       Escape sobre `document` en FASE DE CAPTURA. Ese handler corre ANTES de
       que el evento llegue siquiera al <input>, asi que un `stopPropagation`
       sobre el evento sintetico de React llega tarde: el usuario pulsaria
       Escape una vez y veria vaciarse el campo Y cerrarse el modal a la vez.
       Lo que Radix si respeta es `defaultPrevented` (solo cierra si nadie lo ha
       marcado), de modo que la unica via que funciona es hacer preventDefault
       antes que el, y para eso hay que estar tambien en captura sobre el
       document. Entre listeners del mismo nodo y la misma fase manda el orden
       de registro, y este efecto es de un descendiente: React vacia los efectos
       de los hijos antes que los del ancestro que monta la capa. */
    React.useEffect(() => {
      const input = innerRef.current;
      if (!input) return;
      const doc = input.ownerDocument;

      const enCaptura = (event: KeyboardEvent) => {
        if (event.key !== "Escape") return;
        if (event.target !== innerRef.current) return;
        escapeAtendidoRef.current = null;
        if (!limpiarPorEscapeRef.current()) return;
        /* Doble efecto buscado: frena el cierre de Radix y anula de paso el
           vaciado nativo que algunos navegadores hacen en input[type=search],
           para que el unico camino sea `clear` — que ademas avisa a `onClear`. */
        event.preventDefault();
        escapeAtendidoRef.current = event;
      };

      doc.addEventListener("keydown", enCaptura, { capture: true });
      return () => doc.removeEventListener("keydown", enCaptura, { capture: true });
    }, []);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      /* Si el listener en captura ya limpio, aqui solo se corta la propagacion
         sintetica: un ancestro de React no debe reaccionar a un Escape que este
         campo ya ha consumido. El `onKeyDown` del consumidor se sigue llamando
         siempre — es suyo, no de un ancestro. */
      if (escapeAtendidoRef.current === event.nativeEvent) {
        escapeAtendidoRef.current = null;
        event.stopPropagation();
      }
      onKeyDown?.(event);
    };

    const showClear = puedeLimpiar;

    return (
      <div className={cn("flex w-full flex-col gap-2", wrapperClassName)}>
        <label
          htmlFor={id}
          className={cn(showLabel ? "font-sans text-sm font-semibold text-ink" : "sr-only")}
        >
          {label}
        </label>

        <div className={cn(searchBox({ disabled: Boolean(disabled) }), className)}>
          {/* Hueco fijo de 20: la lupa y el aro de 18 se turnan sin mover el
              texto ni un pixel. */}
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none flex size-5 shrink-0 items-center justify-center",
              "text-ink-600 transition-colors duration-140 ease-out",
              // En foco la lupa sube a tinta, como el borde.
              !disabled && "group-focus-within:text-ink",
              disabled && "text-ink-500",
            )}
          >
            {loading ? <AroDeCarga /> : (icon ?? <LupaGlifo />)}
          </span>

          <input
            ref={innerRef}
            id={id}
            /* type="search" y no "text": da semantica al campo, activa la
               busqueda por voz en moviles y hace que el teclado virtual muestre
               la tecla "buscar". Sus adornos nativos se ocultan mas abajo
               porque duplicarian nuestra X. */
            type="search"
            placeholder={placeholder}
            value={value}
            defaultValue={defaultValue}
            disabled={disabled}
            readOnly={readOnly}
            aria-busy={loading || undefined}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className={cn(
              "h-full min-w-0 flex-1 bg-transparent outline-none",
              "font-sans text-base text-ink placeholder:text-ink-500",
              /* El bloque ESTADOS pinta el DEFAULT en --tk-500 pero el LOADING
                 en --tk-600: mientras se busca, el texto de espera pesa un poco
                 mas que un placeholder en reposo. La diferencia es deliberada
                 en el archivo, asi que se replica. */
              loading && "placeholder:text-ink-600",
              "disabled:cursor-not-allowed disabled:text-ink-500",
              // WebKit pinta su propia cruz de borrado dentro de los
              // input[type=search]. Tendriamos dos X, una encima de otra.
              "[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden",
              "[&::-webkit-search-cancel-button]:appearance-none",
            )}
            {...props}
          />

          {showClear && (
            <button
              type="button"
              onClick={clear}
              aria-label={clearLabel}
              /* Margen negativo de 4 para que el circulo quede a 12 del borde,
                 como el prototipo, sin bajar el padding de la caja a 12 y
                 arrastrar con el a la lupa y al texto. */
              className={cn(
                "-mr-1 flex size-[26px] shrink-0 cursor-pointer items-center justify-center",
                "rounded-pill bg-edge text-ink-700",
                "transition-colors duration-140 ease-out hover:bg-edge-2 hover:text-ink",
                "outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
              )}
            >
              <EquisGlifo />
            </button>
          )}
        </div>

        {/* La region viva se monta siempre y solo cambia de contenido. Montarla
            ya con texto dentro no se anuncia en varios lectores de pantalla:
            solo reaccionan a los cambios que ocurren cuando la region ya
            existia. */}
        <span role="status" aria-live="polite" className="sr-only">
          {loading ? loadingLabel : ""}
        </span>
      </div>
    );
  },
);
