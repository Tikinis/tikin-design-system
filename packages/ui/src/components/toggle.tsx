import * as React from "react";
import { Switch } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/* Seccion 16 · Toggle — MIXTO.
 *
 *   Toggle       CANONICO. Nodo 2:13 del archivo de Figma, 16 variantes
 *                (state x size x active).
 *   SwitchField  ESTRUCTURA CANONICA (nodo 2:62618 "Switch", 18 variantes) con
 *                PIEL DE EXTENSION. Ver la nota al pie de este comentario.
 *
 * Regla de uso que manda sobre todo lo demas: el toggle APLICA AL INSTANTE. No
 * lleva boton de confirmar. Si la accion es riesgosa o lenta, no uses un toggle
 * — usa un switch con confirmacion o un boton.
 *
 * GEOMETRIA (fuente: docs/figma-export/components/Toggle.jsx, autoridad sobre
 * pixeles). Track, thumb, inset y recorrido resultante:
 *
 *     L   42 x 24   thumb 20   inset 2   recorrido 18
 *     M   34 x 20   thumb 16   inset 2   recorrido 14
 *     S   29 x 16   thumb 14   inset 1   recorrido 13
 *
 * TRES DESVIACIONES RESPECTO A LAS FUENTES
 * ----------------------------------------
 * 1. Tamaños. El bloque "TOGGLE · DEL ARCHIVO" del documento anota
 *    56x32 / 48x28 / 40x24 en los `hint-size` de sus placeholders. Esos
 *    hint-size son la caja que el prototipo RESERVA para el componente, no la
 *    medida del componente: el propio HTML no los usa como estilo. Manda el
 *    export de Figma. (La demo "EN VIVO" usa ademas 52x32, todavia mas grande;
 *    es una ampliacion didactica y no es especificacion.)
 *
 * 2. Figma define cuatro tamaños — l, m, s, xs — pero s y xs comparten cuerpo:
 *    los dos son 29x16 con thumb 14. Como el documento habla de "3 tamaños",
 *    exponemos l/m/s y colapsamos xs en s. No se pierde ningun pixel.
 *
 * 3. El borde del track. Figma lo pinta con dos sombras de 0.25px (una inset y
 *    otra fuera), que suman una linea de media unidad. Un hairline sub-pixel se
 *    renderiza distinto en cada navegador y a menudo desaparece, asi que aqui va
 *    como un inset limpio de 1px. Se conservan los tokens de color exactos.
 *
 * COLOR: los tokens --toggle-* SI se redefinen en el bloque .dark de Figma
 * (packages/tokens/src/figma.css:394-402), asi que se usan tal cual y el tema
 * oscuro sale solo. Cuidado con leerlos en claro y asumir: en claro el track
 * apagado es BLANCO con borde gris 300 y el thumb es tinta 900; el documento lo
 * resume como "apagado en gris 300" refiriendose al borde. Encendido = tinta
 * 900 con thumb blanco. El lima nunca aparece aqui: el toggle es neutro, no una
 * accion de marca.
 *
 * NOTA SOBRE SwitchField: el nodo Switch de Figma pinta el track en
 * --primary-blue-600 sobre tipografia Inter, con su propia escala
 * (36x20 / 40x22 / 44x24). Es una libreria ajena importada al archivo, y su azul
 * contradice de frente la regla "ON = TINTA" de esta misma seccion. Se conserva
 * su ESTRUCTURA (titulo + descripcion a la izquierda, control a la derecha,
 * centrado vertical) y se descarta su piel, reusando el Toggle canonico. Por eso
 * SwitchField se declara extension y no especificacion aprobada.
 */

const toggleTrack = cva(
  [
    /* `rounded-full` y no `rounded-pill`: tailwind-merge no reconoce `pill`
       como valor del grupo de radios (no esta en su escala), asi que un
       consumidor que pasara className="rounded-none" acabaria con las dos
       clases y ganaria la que el CSS pusiera despues. Con la altura del track
       (16-24px) ambos radios se ven identicos. */
    "relative inline-flex shrink-0 items-center rounded-full",
    "cursor-pointer transition-colors duration-140 ease-out",
    "outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-page",
    // Apagado: track blanco en claro / tinta en oscuro, con borde. Ver nota 3
    // sobre por que el borde va como sombra inset de 1px y no como `border`:
    // un border real comeria 2px de la altura y descuadraria el thumb.
    "bg-[var(--toggle-track-bg-off)] shadow-[inset_0_0_0_1px_var(--toggle-track-stroke-off)]",
    "data-[state=checked]:bg-[var(--toggle-track-bg-on)] data-[state=checked]:shadow-[inset_0_0_0_1px_var(--toggle-track-stroke-on)]",
    "data-[disabled]:cursor-not-allowed data-[disabled]:bg-[var(--toggle-track-bg-disabled)] data-[disabled]:shadow-[inset_0_0_0_1px_var(--toggle-track-stroke-disabled)]",
    /* El tamaño S mide 16px de alto: por debajo del minimo de area tactil. El
     * pseudo-elemento agranda la zona pulsable sin tocar el layout ni la caja
     * visible. El margen horizontal se queda en 4px para no invadir el texto de
     * la fila en SwitchField, donde el hueco es de 12px. */
    "after:absolute after:-inset-x-1 after:-inset-y-2 after:content-['']",
  ],
  {
    variants: {
      /* --tk-toggle-travel = ancho - thumb - 2*inset. Lo declara el track y lo
         hereda el thumb, que es quien se traslada. */
      size: {
        l: "h-6 w-[42px] p-0.5 [--tk-toggle-travel:18px]",
        m: "h-5 w-[34px] p-0.5 [--tk-toggle-travel:14px]",
        s: "h-4 w-[29px] p-px [--tk-toggle-travel:13px]",
      },
    },
    defaultVariants: { size: "l" },
  },
);

const toggleThumb = cva(
  [
    "pointer-events-none block rounded-full",
    "bg-[var(--toggle-thumb-bg-off)]",
    "data-[state=checked]:bg-[var(--toggle-thumb-bg-on)]",
    "data-[disabled]:bg-[var(--toggle-thumb-bg-disabled)]",
    /* El documento pide un muelle (stiffness 680). CSS no tiene springs, asi
     * que se aproxima con una curva de rebote corto. El sobreimpulso maximo de
     * esta curva ronda el 10% del recorrido — 1.8px en L — y el thumb tiene 2px
     * de inset a cada lado, asi que nunca se sale del track. */
    "transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
    "motion-reduce:transition-none",
    "data-[state=checked]:translate-x-[var(--tk-toggle-travel)]",
  ],
  {
    variants: {
      size: { l: "size-5", m: "size-4", s: "size-3.5" },
    },
    defaultVariants: { size: "l" },
  },
);

type ToggleVariants = VariantProps<typeof toggleTrack>;

export interface ToggleProps
  extends React.ComponentPropsWithoutRef<typeof Switch.Root>,
    ToggleVariants {
  /** Clases para el thumb. El track se estiliza con `className`. */
  thumbClassName?: string;
}

/**
 * Interruptor de encendido/apagado. Guarda al momento, sin boton de confirmar.
 *
 * Se apoya en Radix Switch, no en un `<input type="checkbox">` disfrazado: asi
 * llega gratis el rol `switch`, `aria-checked`, la activacion con Espacio y con
 * Enter, y el input espejo que hace que el valor viaje en un `<form>` nativo
 * cuando se le pasa `name`.
 *
 * Necesita SIEMPRE un nombre accesible: `aria-label` si va suelto, o
 * `aria-labelledby` apuntando al texto de la fila. `SwitchField` ya lo cablea.
 */
export const Toggle = React.forwardRef<
  React.ComponentRef<typeof Switch.Root>,
  ToggleProps
>(function Toggle({ className, thumbClassName, size, ...props }, ref) {
  return (
    <Switch.Root ref={ref} className={cn(toggleTrack({ size, className }))} {...props}>
      <Switch.Thumb className={cn(toggleThumb({ size }), thumbClassName)} />
    </Switch.Root>
  );
});

/* ------------------------------------------------------------------------- */

const switchFieldTitle = cva("font-display font-medium text-ink", {
  variants: {
    size: { l: "text-base", m: "text-[15px]", s: "text-sm" },
  },
  defaultVariants: { size: "l" },
});

const switchFieldDescription = cva("text-ink-600", {
  variants: {
    size: { l: "text-[13px]", m: "text-[12.5px]", s: "text-xs" },
  },
  defaultVariants: { size: "l" },
});

export interface SwitchFieldProps extends ToggleProps {
  /** Texto principal de la fila. Es el nombre accesible del interruptor. */
  title: React.ReactNode;
  /** Segunda linea, opcional. Se enlaza con aria-describedby. */
  description?: React.ReactNode;
  /** Clases del contenedor de la fila. `className` sigue siendo el del track. */
  rowClassName?: string;
}

/**
 * Fila de ajuste: titulo (y descripcion opcional) a la izquierda, interruptor a
 * la derecha, alineados al centro vertical.
 *
 * El ref apunta al interruptor, no al contenedor: es el unico elemento que un
 * consumidor va a querer enfocar o medir.
 *
 * El texto NO envuelve al control en un `<label>` — `<label>` solo asocia con
 * controles de formulario nativos, y Radix Switch renderiza un `<button>`. El
 * enlace se hace con aria-labelledby / aria-describedby, que si funciona con
 * role="switch" en todos los lectores de pantalla.
 */
export const SwitchField = React.forwardRef<
  React.ComponentRef<typeof Switch.Root>,
  SwitchFieldProps
>(function SwitchField(
  { title, description, size, rowClassName, className, id, ...props },
  ref,
) {
  const generatedId = React.useId();
  const baseId = id ?? generatedId;
  const titleId = `${baseId}-title`;
  const descriptionId = `${baseId}-description`;

  return (
    <div className={cn("flex w-full items-center gap-3", rowClassName)}>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span id={titleId} className={switchFieldTitle({ size })}>
          {title}
        </span>
        {description ? (
          <span id={descriptionId} className={switchFieldDescription({ size })}>
            {description}
          </span>
        ) : null}
      </div>
      <Toggle
        ref={ref}
        id={baseId}
        size={size}
        className={className}
        aria-labelledby={titleId}
        // Sin descripcion no se emite el atributo: apuntar a un id inexistente
        // hace que algunos lectores anuncien la fila sin descripcion alguna.
        aria-describedby={description ? descriptionId : undefined}
        {...props}
      />
    </div>
  );
});
