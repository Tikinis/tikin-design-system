import * as React from "react";
/* Subruta en vez de `import { Checkbox } from "radix-ui"`, y no por gusto:
 * el .d.ts del namespace agrupado que sirve la entrada raiz de radix-ui@1.6.3
 * (dist/checkbox-xTiVQnV-.d.ts) contiene JAVASCRIPT, no declaraciones. Con
 * skipLibCheck TS no protesta, se rinde y tipa `Checkbox.Root` como `any`, asi
 * que CheckboxProps exportaria `onCheckedChange: any` a los consumidores.
 * dist/checkbox.d.ts, que es lo que resuelve esta subruta, si reexporta los
 * tipos buenos de @radix-ui/react-checkbox. Mismo paquete, mismo runtime. */
import * as CheckboxPrimitive from "radix-ui/checkbox";
import * as LabelPrimitive from "radix-ui/label";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/* Seccion 20 · Checkbox & radio — EXTENSION.
 *
 * El propio documento la etiqueta asi: "Extension construida con la paleta y
 * los radios del sistema". No existe componente Checkbox en el archivo de
 * Figma (docs/figma-export/components/ solo trae Toggle y StrokedSelect), asi
 * que NADA de lo que hay aqui es especificacion aprobada: es una propuesta
 * coherente con los tokens. Si algun dia Figma publica el componente, este
 * fichero es el que hay que reconciliar.
 *
 * MEDIDAS, del bloque "CHECKBOX · ESTADOS" (22 · r6) del prototipo:
 *   casilla ......... 22 x 22, radio 6
 *   marca ........... 14px, tinta sobre relleno
 *   borde ........... inset 1.5px (no `border`: asi la casilla no descuadra)
 *   fila ............ label a 12 del borde de la casilla, texto sans 15
 *
 * ESTADOS del prototipo:
 *   unchecked ....... fondo surface  + inset 1.5 tk-400
 *   hover ........... fondo surface  + inset 1.5 tk-ink
 *   checked ......... fondo tinta    + check blanco
 *   indeterminate ... fondo tinta    + minus blanco
 *   disabled ........ fondo surface-2 + inset 1.5 tk-border
 *   error ........... fondo rojo 6%  + inset 1.5 rojo
 *
 * ANIMACION — "click · pop con spring" (lo dice el bloque EN VIVO del doc).
 *   Al alternar, el original NO transiciona el fondo ni el borde: los cambia al
 *   instante y corre un unico "pop" sobre la CASILLA ENTERA con Motion:
 *       _animate(box, { scale: [1, 0.82, 1] }, { type: 'spring', stiffness: 600, damping: 13 })
 *   La marca solo conmuta opacidad (0<->1), sin transicion propia: el
 *   movimiento percibido lo pone el pop de la casilla, no la marca. Aqui se
 *   reproduce igual — fondo/borde instantaneos, pop en la casilla — pero sin la
 *   dependencia Motion: el muelle 600/13 (subamortiguado, zeta ~0.27, por eso
 *   rebota por encima de 1) se aproxima con la Web Animations API y un keyframe
 *   multiparada. Ver POP_KEYFRAMES y popBox mas abajo.
 *
 * DESVIACIONES DELIBERADAS RESPECTO AL PROTOTIPO
 * ----------------------------------------------
 * 1. El prototipo escribe el error como literales rgba(255,46,46,0.06) y
 *    rgb(255,46,46). Aqui van por utilidad: bg-red-tint (purered-transparent,
 *    5%) y --color-red (purered-600, que es exactamente rgb(255,46,46)). El 6%
 *    contra 5% es invisible y el token gana al literal.
 * 2. En error, checked mantiene el relleno tinta — la regla "MARCA EN TINTA"
 *    del documento manda — pero conserva el inset rojo, que se ve por dentro
 *    del relleno. El prototipo solo dibuja el error sin marcar, asi que la
 *    combinacion error+checked no estaba definida.
 * 3. La marca es SVG inline con la geometria de Phosphor (viewBox 256, trazo
 *    24 = peso bold, igual que las clases ph-bold ph-check / ph-minus del
 *    prototipo). Phosphor no es dependencia de @tikin/ui y no puedo añadirla.
 */

const checkboxBox = cva(
  [
    // `peer` es lo que permite que el label reaccione al disabled de la casilla.
    "peer relative flex shrink-0 items-center justify-center",
    // 22 no cae en la escala de 4: literal y comentado, en vez de un size-5.5
    // que nadie sabria leer.
    "size-[22px] rounded-xs",
    // Sin `transition`: el original cambia fondo y borde al instante y deja la
    // animacion en el "pop" de la casilla (ver popBox). Meter un fundido de
    // fondo aqui es justo lo que el prototipo NO hace.
    "cursor-pointer outline-none",
    "focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-page",
    // El relleno de checked es tinta y la marca su inverso: en oscuro se
    // invierten los dos a la vez, asi que el contraste se conserva.
    "text-surface",
    "disabled:cursor-not-allowed",
    /* Disabled gana por especificidad, no por orden de fuente: el par
       `:disabled[data-state=checked]` puntua (0,3,0) contra el (0,2,0) de
       `[data-state=checked]`. Sin esto, cual de los dos fondos gana dependeria
       del orden en que Tailwind emita las variantes.
       El refuerzo tiene que cubrir fondo Y borde, no solo el fondo: la variante
       sin error apaga la sombra al marcar (`data-[state=checked]:shadow-none`)
       y esa regla empata a (0,2,0) con `disabled:shadow-…`, asi que ganaba por
       orden de fuente y dejaba la casilla deshabilitada+marcada como un
       cuadrado surface-2 SIN borde, contra lo que pide CHECKBOX · ESTADOS. */
    "disabled:bg-surface-2 disabled:shadow-[inset_0_0_0_1.5px_var(--tk-border)]",
    "disabled:data-[state=checked]:bg-surface-2 disabled:data-[state=indeterminate]:bg-surface-2",
    "disabled:data-[state=checked]:shadow-[inset_0_0_0_1.5px_var(--tk-border)]",
    "disabled:data-[state=indeterminate]:shadow-[inset_0_0_0_1.5px_var(--tk-border)]",
    // La marca de un checkbox deshabilitado sigue siendo legible: gris, no
    // blanca sobre gris.
    "disabled:text-ink-400",
  ],
  {
    variants: {
      invalid: {
        false: [
          "bg-surface shadow-[inset_0_0_0_1.5px_var(--tk-400)]",
          // El hover solo tiene sentido sin marcar: con relleno tinta, un borde
          // tinta seria invisible.
          "hover:not-disabled:data-[state=unchecked]:shadow-[inset_0_0_0_1.5px_var(--tk-ink)]",
          "data-[state=checked]:bg-ink data-[state=checked]:shadow-none",
          "data-[state=indeterminate]:bg-ink data-[state=indeterminate]:shadow-none",
        ],
        true: [
          "bg-red-tint shadow-[inset_0_0_0_1.5px_var(--color-red)]",
          "data-[state=checked]:bg-ink data-[state=indeterminate]:bg-ink",
        ],
      },
    },
    defaultVariants: { invalid: false },
  },
);

type CheckboxBoxVariants = VariantProps<typeof checkboxBox>;

export interface CheckboxProps
  extends
    Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, "asChild">,
    Omit<CheckboxBoxVariants, "invalid"> {
  /**
   * Texto de la fila. Se conecta por `htmlFor`, asi que clicar el label
   * alterna la casilla. Sin label se renderiza solo la casilla y el consumidor
   * pone la suya.
   */
  label?: React.ReactNode;
  /** Estado de error: borde rojo y `aria-invalid`. */
  invalid?: boolean;
  /** Clases de la fila. `className` va siempre a la casilla, como el ref. */
  rowClassName?: string;
}

/* "Pop con spring" del documento. El original corre scale [1, 0.82, 1] con un
   muelle stiffness 600 / damping 13: baja rapido a 0.82 (aplasta) y vuelve con
   rebote (zeta ~0.27 => sobrepasa 1 antes de asentar). Se reproduce esa curva
   como keyframe multiparada — bajada, sobrepaso, asentamiento — sin depender de
   una libreria de animacion. 440ms es la ventana en la que el muelle 600/13
   deja de ser perceptible. */
const POP_KEYFRAMES: Keyframe[] = [
  { transform: "scale(1)", offset: 0 },
  { transform: "scale(0.82)", offset: 0.26 },
  { transform: "scale(1.05)", offset: 0.52 },
  { transform: "scale(0.985)", offset: 0.78 },
  { transform: "scale(1)", offset: 1 },
];

/** Corre el pop sobre la casilla al alternar, respetando reduced-motion. */
function popBox(node: HTMLElement | null) {
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
  node.animate(POP_KEYFRAMES, { duration: 440, easing: "linear" });
}

/* Geometria de Phosphor: viewBox 256 y trazo 24, que es su peso `bold`. */
const CheckMark = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 256 256"
    fill="none"
    aria-hidden="true"
    className={cn("size-[14px]", className)}
  >
    <path
      d="M216 72 104 184l-56-56"
      stroke="currentColor"
      strokeWidth="24"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MinusMark = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 256 256"
    fill="none"
    aria-hidden="true"
    className={cn("size-[14px]", className)}
  >
    <path
      d="M40 128h176"
      stroke="currentColor"
      strokeWidth="24"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Casilla de seleccion multiple del sistema Tikin.
 *
 * Checkbox = varias a la vez, o un si/no aislado. Para elegir una sola opcion
 * de un grupo va el radio, y nunca un radio suelto.
 *
 * El estado intermedio se pide con `checked="indeterminate"`, tal cual lo
 * expone Radix; sirve para el "seleccionar todo" de una lista parcial.
 */
export const Checkbox = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(function Checkbox(
  { className, rowClassName, label, invalid = false, id, onCheckedChange, ...props },
  ref,
) {
  // El label necesita un id estable para el htmlFor aunque el consumidor no lo
  // pase. useId es estable entre servidor y cliente, Math.random no lo seria.
  const generatedId = React.useId();
  const boxId = id ?? generatedId;

  // Ref propio para poder correr el pop sobre la casilla, fusionado con el que
  // reenvia el consumidor: el suyo se conserva intacto (funcion u objeto).
  const innerRef = React.useRef<HTMLButtonElement>(null);
  const setRefs = React.useCallback(
    (node: HTMLButtonElement | null) => {
      innerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  // El pop se dispara al alternar (click o barra espaciadora, que es cuando
  // Radix emite onCheckedChange), igual que el original lo hace en su onClick.
  // Un deshabilitado no emite el evento, asi que tampoco hace pop. El callback
  // del consumidor se reenvia intacto detras del pop.
  const handleCheckedChange: NonNullable<CheckboxProps["onCheckedChange"]> = (checked) => {
    popBox(innerRef.current);
    onCheckedChange?.(checked);
  };

  const box = (
    <CheckboxPrimitive.Root
      ref={setRefs}
      id={boxId}
      className={cn(
        checkboxBox({ invalid }),
        /* ÁREA TÁCTIL. La fila mide 44 de alto pero la casilla solo 22 y va
           centrada, asi que las dos bandas de 11 por encima y por debajo de
           ella eran espacio muerto: un pulgar que apunta un poco alto no
           acertaba a nada. Este pseudo invisible estira SOLO la zona de clic
           hasta los 44, sin tocar el dibujo de la casilla.
           Va unicamente cuando hay label: sin el, la fila la compone el
           consumidor y una zona que sobresale 11 por arriba y por abajo
           pisaria a sus vecinos (la matriz de estados, sin ir mas lejos). */
        label !== undefined && "before:absolute before:inset-x-0 before:-inset-y-[11px]",
        className,
      )}
      aria-invalid={invalid || undefined}
      onCheckedChange={handleCheckedChange}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        /* forceMount mantiene la marca en el DOM tambien sin marcar. Sin el,
           Radix la desmonta y al desmarcar no habria nada visible que el pop de
           la casilla arrastre; ademas el estado unchecked la necesita presente
           para conmutar su opacidad. */
        forceMount
        className={cn(
          "group pointer-events-none flex items-center justify-center",
          // La marca del original solo conmuta opacidad, al instante y sin
          // transicion: el movimiento lo aporta el pop de la casilla, no la
          // marca. Por eso aqui no hay ni scale ni transition en la marca.
          "data-[state=unchecked]:opacity-0",
        )}
      >
        {/* Que marca se ve lo decide el data-state, no una condicion en JS:
            asi tambien funciona sin controlar (defaultChecked="indeterminate"),
            donde el estado vive dentro de Radix y este componente no lo ve. */}
        <CheckMark className="group-data-[state=indeterminate]:hidden" />
        <MinusMark className="hidden group-data-[state=indeterminate]:block" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );

  if (label === undefined) return box;

  return (
    /* La fila NO es un <label> que envuelva la casilla: Radix renderiza un
       <button>, y un boton dentro de un label reenvia el clic al propio boton
       en unos motores y lo duplica en otros. Con htmlFor el vinculo es
       explicito y funciona igual en todos.

       Sin `gap`: los 12 del documento van como padding del label, para que ese
       hueco tambien sea zona clicable. Con gap seria un hueco muerto. */
    <div className={cn("inline-flex min-h-11 items-center", rowClassName)}>
      {box}
      <LabelPrimitive.Root
        htmlFor={boxId}
        className={cn(
          "flex flex-1 cursor-pointer items-center self-stretch py-2 pl-3",
          "font-sans text-[15px] leading-[1.4] text-ink select-none",
          // El label se apaga con la casilla gracias al `peer` de la casilla.
          "peer-disabled:cursor-not-allowed peer-disabled:text-ink-500",
        )}
      >
        {label}
      </LabelPrimitive.Root>
    </div>
  );
});
