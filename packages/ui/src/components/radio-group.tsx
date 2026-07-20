import * as React from "react";
import { RadioGroup as RadixRadioGroup } from "radix-ui";
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
    "cursor-pointer transition-colors duration-140 ease-out",
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

/* El ancho de la opcion lo decide el grupo, no la opcion: en columna la fila
 * entera debe ser clicable de borde a borde, y en fila cada una se ciñe a su
 * contenido. El selector apunta a [role=radio] y no a `> *` porque Radix cuela
 * ademas un <input> espejo como hermano cuando hay un <form> alrededor. */
const radioGroup = cva("flex", {
  variants: {
    orientation: {
      vertical: "flex-col gap-3.5 [&>[role=radio]]:w-full",
      horizontal: "flex-row flex-wrap items-center gap-6",
    },
  },
  defaultVariants: { orientation: "vertical" },
});

/* El grupo comunica el estado de error a sus hijos. Sin esto el consumidor
 * tendria que repetir `invalid` en cada opcion y podria dejarlas desparejadas.
 */
const RadioGroupContext = React.createContext<{ invalid: boolean }>({ invalid: false });

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

  /* `orientation` controla SOLO la disposicion visual y no se reenvia a Radix a
   * proposito. Radix la usa para el roving focus: al fijarla, las flechas del
   * eje contrario dejan de mover el foco. El patron ARIA de radiogroup espera
   * que las cuatro flechas funcionen (Abajo/Derecha avanzan, Arriba/Izquierda
   * retroceden), asi que dejamos a Radix en su modo de dos ejes. */
  const root = (
    <RadixRadioGroup.Root
      ref={ref}
      className={cn(radioGroup({ orientation, className }))}
      aria-labelledby={label ? labelId : undefined}
      {...props}
    >
      <RadioGroupContext.Provider value={{ invalid }}>{children}</RadioGroupContext.Provider>
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
  { className, appearance, invalid, description, children, ...props },
  ref,
) {
  const group = React.useContext(RadioGroupContext);
  const isInvalid = invalid ?? group.invalid;

  const id = React.useId();
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;

  return (
    <RadixRadioGroup.Item
      ref={ref}
      className={cn(radioItem({ appearance, invalid: isInvalid, className }))}
      /* Sin descripcion el nombre accesible sale del contenido del boton y no
       * hace falta tocarlo. Con descripcion hay que separarlos: si no, el lector
       * de pantalla leeria "Envio estandar Llega en minutos 0" como nombre. */
      aria-labelledby={description ? labelId : undefined}
      aria-describedby={description ? descriptionId : undefined}
      aria-invalid={isInvalid || undefined}
      {...props}
    >
      {/* El circulo es decorativo: el estado ya lo lleva aria-checked del role
          radio, y anunciarlo dos veces solo estorba. */}
      <span
        aria-hidden="true"
        className="flex size-[22px] shrink-0 items-center justify-center rounded-pill bg-[var(--tk-radio-bg)] shadow-[inset_0_0_0_var(--tk-radio-ring-w)_var(--tk-radio-ring)] transition-[box-shadow,background-color] duration-140 ease-out"
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
