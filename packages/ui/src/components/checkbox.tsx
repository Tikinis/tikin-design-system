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
    "cursor-pointer transition-[background-color,box-shadow] duration-140 ease-out outline-none",
    "focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-page",
    // El relleno de checked es tinta y la marca su inverso: en oscuro se
    // invierten los dos a la vez, asi que el contraste se conserva.
    "text-surface",
    "disabled:cursor-not-allowed",
    /* Disabled gana por especificidad, no por orden de fuente: el par
       `:disabled[data-state=checked]` puntua (0,3,0) contra el (0,2,0) de
       `[data-state=checked]`. Sin esto, cual de los dos fondos gana dependeria
       del orden en que Tailwind emita las variantes. */
    "disabled:bg-surface-2 disabled:shadow-[inset_0_0_0_1.5px_var(--tk-border)]",
    "disabled:data-[state=checked]:bg-surface-2 disabled:data-[state=indeterminate]:bg-surface-2",
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
>(function Checkbox({ className, rowClassName, label, invalid = false, id, ...props }, ref) {
  // El label necesita un id estable para el htmlFor aunque el consumidor no lo
  // pase. useId es estable entre servidor y cliente, Math.random no lo seria.
  const generatedId = React.useId();
  const boxId = id ?? generatedId;

  const box = (
    <CheckboxPrimitive.Root
      ref={ref}
      id={boxId}
      className={cn(checkboxBox({ invalid }), className)}
      aria-invalid={invalid || undefined}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        /* forceMount mantiene la marca en el DOM tambien sin marcar. Sin el,
           Radix la desmonta y no hay nada que animar al desmarcar: el "pop con
           spring" del documento solo se veria en una direccion. */
        forceMount
        className={cn(
          "group pointer-events-none flex items-center justify-center",
          "transition-[transform,opacity] duration-150 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          "data-[state=unchecked]:scale-50 data-[state=unchecked]:opacity-0",
          "motion-reduce:transition-none",
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
