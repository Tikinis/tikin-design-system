import * as React from "react";
import * as RadixRadioGroup from "radix-ui/radio-group";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/* Seccion 21 · Radio button — EXTENSION construida con los tokens del archivo.
 *
 * El documento lo dice explicitamente: "Extension construida con los tokens del
 * archivo". No existe componente Radio en el export de Figma
 * (docs/figma-export/components/ solo trae Toggle y LiquidToggle), asi que las
 * medidas de aqui salen del prototipo del documento y los colores de los tokens
 * --tk-* y de las primitivas --colours-*. Nadie debe leer esto como
 * especificacion aprobada de Figma.
 *
 * MEDIDAS DEL PROTOTIPO (atributos style= del HTML, no del texto)
 *   circulo      22x22, radio 50%
 *   punto        10x10, relleno --tk-ink
 *   fila         gap 12, padding vertical 4, label 15px
 *   grupo        gap 14 entre opciones, titulo Ubuntu Sans 600 14px
 *   tarjeta      padding 16, radio 16, borde 1.5px, gap interno 2
 *
 * ESTADOS DEL ANILLO (box-shadow inset, no border: un border cambiaria la caja
 * de 22px y descuadraria la fila al pasar de 1.5px a 2px)
 *   off        inset 1.5px --tk-400
 *   on         inset 2px   --tk-ink        + punto
 *   hover      inset 1.5px --tk-ink
 *   disabled   inset 1.5px --tk-border     + fondo --tk-surface-2
 *   error      inset 1.5px rojo            + fondo rojo transparente
 *
 * ANIMACION — "pop con spring" (igual que el checkbox de la seccion 20).
 *   Al seleccionar, el original NO transiciona el anillo ni el fondo: los cambia
 *   al instante y corre un unico "pop" sobre el CIRCULO con Motion:
 *       _pop(ring, 0.75)  ->  scale [1, 0.75, 1], spring stiffness 520, damping 14
 *   El punto solo conmuta (Indicator monta/desmonta), sin transicion propia: el
 *   movimiento percibido lo pone el pop del circulo, no el punto. Aqui se
 *   reproduce igual —anillo/fondo instantaneos, pop en el circulo— pero sin la
 *   dependencia Motion: el muelle 520/14 (subamortiguado, zeta ~0.31, por eso
 *   rebota por encima de 1) se aproxima con la Web Animations API y un keyframe
 *   multiparada. Ver POP_KEYFRAMES y popRing mas abajo. Por eso NINGUN elemento
 *   del control lleva `transition`: meter un fundido es justo lo que el
 *   prototipo NO hace.
 *
 * DOS DIVERGENCIAS ANOTADAS A PROPOSITO
 * 1. El fondo de error usa --colours-purered-transparent (alpha 0.05) donde el
 *    prototipo escribe el literal rgba(255,46,46,0.06). Se prefiere el token
 *    para que el dia que se retoque el alpha cambie en todo el sistema a la vez;
 *    la diferencia de 0.01 de alpha es imperceptible.
 * 2. El anillo OFF hereda --tk-400 del prototipo y ese par no llega al 3:1 que
 *    pide WCAG 1.4.11 para indicadores no textuales: ~1.8:1 en claro
 *    (191,191,191 sobre --tk-bg) y ~1.9:1 en oscuro (92,92,92 sobre --tk-bg).
 *    Se respeta el prototipo porque es una decision de diseño, no un error de
 *    transcripcion, pero queda escrito: subirlo exige tocar el token, no este
 *    fichero, para no descuadrar el resto de controles que usan el mismo gris.
 *
 * POR QUE LA FILA ENTERA ES EL <button>
 * El documento pide que "cada fila entera es clicable". La alternativa clasica
 * —un <label htmlFor> apuntando al control— depende de que el navegador reenvie
 * la activacion del label a un <button>, cosa que ni todos los agentes ni jsdom
 * hacen igual. Renderizando el propio RadioGroup.Item como la fila completa, el
 * area clicable, el area de foco y el control son literalmente el mismo
 * elemento, y la navegacion por flechas de Radix sigue funcionando sin ayuda.
 */

/* El anillo y el punto se pintan desde variables que fija la fila, igual que
 * --tk-btn-spinner en el boton. Asi toda la logica de estados vive en un unico
 * elemento (donde `disabled:`, `hover:` y `data-[state]` compiten con
 * especificidades conocidas) en vez de repartirse en variantes `group-*` sobre
 * el hijo, donde el orden de las reglas decidiria el resultado. */
const radioItem = cva(
  [
    "group/tk-radio relative flex items-center text-left",
    "font-sans text-ink",
    /* Sin `transition`: el original cambia anillo, fondo y borde al instante y
       deja el movimiento en el pop del circulo (ver popRing). Un fundido de
       color aqui es justo lo que el prototipo NO hace. */
    "cursor-pointer",
    "outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-page",
    "disabled:cursor-not-allowed disabled:text-ink-500",
    // Valores por defecto = estado OFF.
    "[--tk-radio-ring-w:1.5px] [--tk-radio-ring:var(--tk-400)]",
    "[--tk-radio-bg:transparent] [--tk-radio-dot:var(--tk-ink)]",
    /* Disabled se escribe con `disabled:` a secas y TODO lo demas va prefijado
       con `not-disabled:`. De ese modo los conjuntos son disjuntos y ninguna
       regla depende del orden en que Tailwind las emita. */
    "disabled:[--tk-radio-bg:var(--tk-surface-2)] disabled:[--tk-radio-ring:var(--tk-border)]",
    "disabled:[--tk-radio-dot:var(--tk-500)]",
  ],
  {
    variants: {
      appearance: {
        /** Fila simple: circulo + label. */
        row: "gap-3 py-1",
        /** Tarjeta: la opcion necesita descripcion, borde tinta al seleccionar. */
        card: "gap-3 rounded-xl border-[1.5px] border-edge bg-surface p-4",
      },

      /* Error no se apila sobre el estado normal: cambia el juego entero de
         reglas de anillo. Asi un radio marcado Y en error sigue rojo, en vez de
         que gane la regla de "marcado" por especificidad. */
      invalid: {
        false: [
          "not-disabled:data-[state=checked]:[--tk-radio-ring:var(--tk-ink)]",
          "not-disabled:data-[state=checked]:[--tk-radio-ring-w:2px]",
          "not-disabled:data-[state=unchecked]:hover:[--tk-radio-ring:var(--tk-ink)]",
        ],
        true: [
          /* --colours-purered-600 es rgb(255,46,46), el literal que usa el
             prototipo. Es un acento de marca: identico en claro y en oscuro a
             proposito, asi que no hay que buscarle equivalente --tk-*. */
          "not-disabled:[--tk-radio-ring:var(--colours-purered-600)]",
          "not-disabled:[--tk-radio-bg:var(--colours-purered-transparent)]",
          "not-disabled:[--tk-radio-dot:var(--colours-purered-600)]",
          "not-disabled:data-[state=checked]:[--tk-radio-ring-w:2px]",
        ],
      },
    },

    compoundVariants: [
      /* Tarjeta seleccionada: borde tinta y fondo de pagina, para que se
         despegue de las no seleccionadas, que van sobre --tk-surface. */
      {
        appearance: "card",
        invalid: false,
        class:
          "not-disabled:data-[state=checked]:border-ink not-disabled:data-[state=checked]:bg-page",
      },
      /* Va despues de `border-edge` en la cadena, asi que tailwind-merge se
         queda con este. */
      { appearance: "card", invalid: true, class: "border-red" },
      { appearance: "card", class: "disabled:bg-surface-2" },
    ],

    defaultVariants: { appearance: "row", invalid: false },
  },
);

/* `orientation` es una extension nuestra: el prototipo solo dibuja el grupo en
 * columna. De ahi que solo `vertical` tenga medida del archivo (gap 14 = 3.5).
 * El 24 de horizontal no sale del prototipo, es la parada de la escala que deja
 * respirar dos opciones cortas en la misma linea; queda anotado para que nadie
 * lo lea como una cota del documento. */
const radioGroup = cva("flex", {
  variants: {
    orientation: {
      vertical: "flex-col gap-3.5",
      horizontal: "flex-row flex-wrap items-center gap-6",
    },
  },
  defaultVariants: { orientation: "vertical" },
});

/* "Pop con spring" del prototipo. El original corre scale [1, 0.75, 1] con un
   muelle stiffness 520 / damping 14: baja rapido a 0.75 (aplasta) y vuelve con
   rebote (zeta ~0.31 => sobrepasa 1 antes de asentar). Se reproduce esa curva
   como keyframe multiparada —bajada, sobrepaso, asentamiento— sin depender de
   una libreria de animacion. Es mas hondo que el pop del checkbox (0.75 vs 0.82)
   porque el prototipo asi lo pide. ~470ms es la ventana en la que el muelle
   520/14 deja de ser perceptible (algo mas lento que el 600/13 del checkbox). */
const POP_KEYFRAMES: Keyframe[] = [
  { transform: "scale(1)", offset: 0 },
  { transform: "scale(0.75)", offset: 0.26 },
  { transform: "scale(1.06)", offset: 0.52 },
  { transform: "scale(0.985)", offset: 0.78 },
  { transform: "scale(1)", offset: 1 },
];

/** Corre el pop sobre el circulo al seleccionar, respetando reduced-motion. */
function popRing(node: HTMLElement | null) {
  // Sin nodo (SSR / primer render) o sin WAAPI (jsdom en los tests) no hay pop.
  if (!node || typeof node.animate !== "function") return;
  // prefers-reduced-motion vive en JS aqui, no en CSS: se comprueba a mano y se
  // omite el pop entero cuando el usuario pide menos movimiento. Doble `?.`
  // porque en algunos entornos matchMedia no existe.
  const media =
    typeof window !== "undefined"
      ? window.matchMedia?.("(prefers-reduced-motion: reduce)")
      : undefined;
  if (media?.matches) return;
  node.animate(POP_KEYFRAMES, { duration: 470, easing: "linear" });
}

/* El grupo comunica a sus hijos el estado de error y la disposicion. `invalid`
 * por contexto evita que el consumidor tenga que repetirlo opcion por opcion y
 * pueda dejarlas desparejadas.
 *
 * `orientation` viaja por contexto —y no como un selector de hijo directo del
 * tipo [&>[role=radio]]:w-full— porque la regla "cada fila entera es clicable"
 * no puede depender de la forma del arbol: en cuanto el consumidor envuelve una
 * opcion (una fila con un badge al lado, un Fragment dentro de un div, un
 * separador) el selector deja de casar y la fila se ciñe a su texto sin ningun
 * aviso. Aplicado desde la propia opcion, el ancho sobrevive a cualquier
 * anidamiento y ademas queda por delante de `className`, asi que el consumidor
 * que quiera ceñir una fila concreta puede seguir haciendolo con `w-auto`. */
const RadioGroupContext = React.createContext<{
  invalid: boolean;
  orientation: "vertical" | "horizontal";
}>({ invalid: false, orientation: "vertical" });

export interface RadioGroupProps
  extends
    Omit<React.ComponentPropsWithoutRef<typeof RadixRadioGroup.Root>, "orientation">,
    VariantProps<typeof radioGroup> {
  /** Titulo del grupo. Se enlaza por aria-labelledby, no por un <legend> suelto. */
  label?: React.ReactNode;
  /** Marca en rojo todas las opciones del grupo. Cada Radio puede sobreescribirlo. */
  invalid?: boolean;
}

/**
 * Grupo de seleccion unica.
 *
 * Reglas de uso del documento:
 *
 * - **Una siempre.** El grupo arranca con una opcion por defecto; no existe el
 *   estado "ninguna". Para un si/no aislado usa checkbox o toggle.
 * - **2 a 5 opciones.** Por encima de ~5 la lista pasa a un Select.
 * - **En tarjeta** cuando cada opcion necesita descripcion.
 */
export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  { className, orientation, label, invalid = false, children, ...props },
  ref,
) {
  const labelId = React.useId();
  const layout = orientation ?? "vertical";
  const context = React.useMemo(() => ({ invalid, orientation: layout }), [invalid, layout]);

  /* `orientation` controla SOLO la disposicion visual y no se reenvia a Radix a
   * proposito. Radix la usa para el roving focus: al fijarla, las flechas del
   * eje contrario dejan de mover el foco. El patron ARIA de radiogroup espera
   * que las cuatro flechas funcionen (Abajo/Derecha avanzan, Arriba/Izquierda
   * retroceden), asi que dejamos a Radix en su modo de dos ejes.
   *
   * El precio de no reenviarla es que Radix emite aria-orientation={undefined},
   * y el valor implicito de role=radiogroup es "vertical": un grupo dispuesto en
   * horizontal se anunciaria al reves de como se ve. Lo declaramos aqui a mano.
   * Solo en horizontal: en vertical el implicito ya es el correcto y escribirlo
   * seria ruido.
   *
   * aria-invalid tambien va en el grupo, no solo en cada opcion. Quien llega al
   * grupo tabulando aterriza en el <div role=radiogroup>; sin esto no percibiria
   * el error hasta enfocar una opcion. radiogroup soporta aria-invalid por
   * especificacion, asi que es su sitio natural.
   *
   * Ambos van ANTES del spread para que el consumidor pueda sobreescribirlos. */
  const root = (
    <RadixRadioGroup.Root
      ref={ref}
      className={cn(radioGroup({ orientation, className }))}
      aria-labelledby={label ? labelId : undefined}
      aria-orientation={layout === "horizontal" ? "horizontal" : undefined}
      aria-invalid={invalid || undefined}
      {...props}
    >
      <RadioGroupContext.Provider value={context}>{children}</RadioGroupContext.Provider>
    </RadixRadioGroup.Root>
  );

  if (!label) return root;

  return (
    <div className="flex flex-col gap-3.5">
      <span id={labelId} className="font-sans text-sm font-semibold text-ink">
        {label}
      </span>
      {root}
    </div>
  );
});

export interface RadioProps
  extends
    Omit<React.ComponentPropsWithoutRef<typeof RadixRadioGroup.Item>, "children">,
    VariantProps<typeof radioItem> {
  /** Valor que toma el grupo al seleccionar esta opcion. */
  value: string;
  /** Etiqueta visible. Es tambien el nombre accesible del control. */
  children?: React.ReactNode;
  /** Texto secundario. Se anuncia como descripcion, no como parte del nombre. */
  description?: React.ReactNode;
  /** Fuerza el estado de error de esta opcion, por encima del grupo. */
  invalid?: boolean;
}

/**
 * Una opcion del grupo. La fila entera es el control: clicable, enfocable y
 * navegable con flechas.
 *
 * El label NO se pone en mayusculas: en este componente es texto de contenido
 * (el nombre de una cuenta, un metodo de envio), no una etiqueta de sistema.
 */
export const Radio = React.forwardRef<HTMLButtonElement, RadioProps>(function Radio(
  { className, appearance, invalid, description, children, onClick, ...props },
  ref,
) {
  const group = React.useContext(RadioGroupContext);
  const isInvalid = invalid ?? group.invalid;

  const id = React.useId();
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;

  /* Ref propio al CIRCULO (no al control) para correr el pop justo sobre el, tal
   * cual el prototipo: pickRadio anima `e.currentTarget.querySelector('span')`,
   * que es el circulo, no la fila entera. Es independiente del `ref` que se
   * reenvia al consumidor, asi que no hay que fusionarlos. */
  const circleRef = React.useRef<HTMLSpanElement>(null);

  /* El pop se dispara al clicar (raton o barra espaciadora, que en un <button>
   * enfocado tambien emite click), igual que el original lo hace en su onClick.
   * Se corre incluso al reclicar la opcion ya marcada, como el prototipo. El
   * onClick del consumidor se reenvia intacto detras del pop; como se
   * desestructura de props, el spread no lo pisa. */
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    popRing(circleRef.current);
    onClick?.(event);
  };

  return (
    <RadixRadioGroup.Item
      ref={ref}
      className={cn(
        radioItem({ appearance, invalid: isInvalid }),
        /* En columna la fila ocupa todo el ancho para que sea clicable de borde
         * a borde; en fila cada opcion se ciñe a su contenido. `className` va
         * detras, asi que sigue mandando el consumidor. */
        group.orientation === "vertical" && "w-full",
        className,
      )}
      /* Sin descripcion el nombre accesible sale del contenido del boton y no
       * hace falta tocarlo. Con descripcion hay que separarlos: si no, el lector
       * de pantalla leeria "Envio estandar Llega en minutos 0" como nombre. */
      aria-labelledby={description ? labelId : undefined}
      aria-describedby={description ? descriptionId : undefined}
      aria-invalid={isInvalid || undefined}
      {...props}
      onClick={handleClick}
    >
      {/* El circulo es decorativo: el estado ya lo lleva aria-checked del role
          radio, y anunciarlo dos veces solo estorba. */}
      <span
        ref={circleRef}
        aria-hidden="true"
        className="flex size-[22px] shrink-0 items-center justify-center rounded-pill bg-[var(--tk-radio-bg)] shadow-[inset_0_0_0_var(--tk-radio-ring-w)_var(--tk-radio-ring)]"
      >
        {/* Indicator solo se monta cuando la opcion esta marcada. */}
        <RadixRadioGroup.Indicator className="size-2.5 rounded-pill bg-[var(--tk-radio-dot)]" />
      </span>

      <span className="flex min-w-0 flex-col gap-0.5">
        <span
          id={labelId}
          className={cn(
            "text-[15px]",
            // En tarjeta el titulo sube a display 500, como en el prototipo.
            appearance === "card" && "font-display font-medium",
          )}
        >
          {children}
        </span>
        {description ? (
          <span
            id={descriptionId}
            className="text-[12.5px] text-ink-600 group-disabled/tk-radio:text-ink-500"
          >
            {description}
          </span>
        ) : null}
      </span>
    </RadixRadioGroup.Item>
  );
});
