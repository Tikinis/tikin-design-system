import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./checkbox";

const meta = {
  title: "Componentes/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Seccion 20 · Checkbox & radio — EXTENSION.**",
          "",
          "El documento etiqueta esta seccion como *extension construida con la paleta y los radios del sistema*: no hay componente Checkbox en el archivo de Figma. Lo de aqui es una propuesta coherente con los tokens, **no especificacion aprobada**.",
          "",
          "- **Checkbox vs radio** — checkbox para varias a la vez o un si/no aislado. Radio para una sola de un grupo, y nunca un radio suelto.",
          "- **Marca en tinta** — seleccionado en tinta con la marca en el color de la superficie; sin marcar, borde gris de 1.5px. El lima no se usa aqui.",
          "- **Area tactil** — la casilla mide 22, pero la fila entera (label incluido) es clicable, con alto minimo de 44.",
          "",
          'El estado intermedio se pide con `checked="indeterminate"`, para el *seleccionar todo* de una lista parcial.',
        ].join("\n"),
      },
    },
  },
  argTypes: {
    checked: { control: "inline-radio", options: [false, true, "indeterminate"] },
    invalid: { control: "boolean" },
    disabled: { control: "boolean" },
    label: { control: "text" },
  },
  args: { label: "Recordar este dispositivo" },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Sin marcar: fondo de superficie con borde gris de 1.5px. */
export const SinMarcar: Story = { name: "Sin marcar" };

/** Marcado: relleno tinta y marca invertida. En oscuro se invierten los dos. */
export const Marcado: Story = { args: { defaultChecked: true } };

/** Para el "seleccionar todo" cuando la lista esta a medias. Se anuncia `mixed`. */
export const Indeterminado: Story = {
  args: { checked: "indeterminate", label: "Seleccionar todo" },
};

/** Deshabilitado: fondo surface-2, borde de linea y label apagado. */
export const Deshabilitado: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Checkbox {...args} disabled label="Sin marcar" />
      <Checkbox {...args} disabled defaultChecked label="Marcado" />
    </div>
  ),
};

/* Se llama ConError y no Error para no tapar el `Error` global en este modulo. */
/** Error: borde rojo y `aria-invalid`. El relleno sigue siendo tinta al marcar. */
export const ConError: Story = {
  name: "Error",
  args: { invalid: true, label: "Debes aceptar los términos" },
};

/** Sin `label` se renderiza solo la casilla, para componer la fila a mano. */
export const SoloCasilla: Story = {
  name: "Solo la casilla",
  args: { label: undefined, "aria-label": "Seleccionar fila" },
};

/** La fila entera es clicable: los 12 del hueco son padding del label, no gap. */
export const FilaClicable: Story = {
  name: "Fila clicable",
  parameters: { controls: { disable: true } },
  render: () => {
    function Grupo() {
      const [usos, setUsos] = React.useState<string[]>(["Enviar y recibir"]);
      const alternar = (uso: string) =>
        setUsos((previos) =>
          previos.includes(uso) ? previos.filter((u) => u !== uso) : [...previos, uso],
        );

      return (
        <fieldset className="flex w-[280px] flex-col gap-1 border-0 p-0">
          <legend className="mb-2 font-sans text-sm font-semibold text-ink">
            ¿Para qué usas Tikin?
          </legend>
          {["Enviar y recibir", "Ahorrar en bolsillos", "Dispersar bonos"].map((uso) => (
            <Checkbox
              key={uso}
              label={uso}
              checked={usos.includes(uso)}
              onCheckedChange={() => alternar(uso)}
              rowClassName="flex"
            />
          ))}
        </fieldset>
      );
    }
    return <Grupo />;
  },
};

/** Un padre indeterminado que refleja el estado de sus hijos. */
export const SeleccionarTodo: Story = {
  name: "Seleccionar todo",
  parameters: { controls: { disable: true } },
  render: () => {
    function Lista() {
      const cuentas = ["Cuenta Tikin", "Bolsillo · Arriendo", "Bolsillo · Viaje"];
      const [elegidas, setElegidas] = React.useState<string[]>([cuentas[0]!]);
      const todas = elegidas.length === cuentas.length;
      const algunas = elegidas.length > 0 && !todas;

      return (
        <div className="flex w-[280px] flex-col gap-1">
          <Checkbox
            label="Todas las cuentas"
            checked={algunas ? "indeterminate" : todas}
            onCheckedChange={(valor) => setElegidas(valor === true ? [...cuentas] : [])}
            rowClassName="flex"
          />
          <div className="ml-6 flex flex-col gap-1">
            {cuentas.map((cuenta) => (
              <Checkbox
                key={cuenta}
                label={cuenta}
                checked={elegidas.includes(cuenta)}
                onCheckedChange={(valor) =>
                  setElegidas((previas) =>
                    valor === true ? [...previas, cuenta] : previas.filter((c) => c !== cuenta),
                  )
                }
                rowClassName="flex"
              />
            ))}
          </div>
        </div>
      );
    }
    return <Lista />;
  },
};

/** Matriz del bloque "CHECKBOX · ESTADOS" del documento: 22 · r6. */
export const MatrizDeEstados: Story = {
  name: "Matriz de estados",
  parameters: { controls: { disable: true } },
  render: () => {
    const estados = [
      { nombre: "UNCHECKED", props: {} },
      { nombre: "HOVER", props: {}, nota: "pasa el ratón por encima" },
      { nombre: "CHECKED", props: { checked: true as const } },
      { nombre: "INDETERMINATE", props: { checked: "indeterminate" as const } },
      { nombre: "DISABLED", props: { disabled: true } },
      { nombre: "ERROR", props: { invalid: true } },
    ];

    return (
      <div className="flex flex-wrap gap-x-7 gap-y-6">
        {estados.map(({ nombre, props, nota }) => (
          <div key={nombre} className="flex flex-col items-center gap-2">
            <Checkbox {...props} aria-label={nombre} />
            <span
              className="font-meta text-[10px] tracking-[0.1em] text-ink-500 uppercase"
              title={nota}
            >
              {nombre}
            </span>
          </div>
        ))}
      </div>
    );
  },
};
