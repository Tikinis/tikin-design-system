import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Radio, RadioGroup } from "./radio-group";

const meta = {
  title: "Componentes/RadioGroup",
  component: RadioGroup,
  subcomponents: { Radio },
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Seccion 21 · Radio button — EXTENSION** construida con los tokens del archivo.",
          "",
          "El documento lo marca como propuesta, no como especificacion aprobada: no hay componente Radio en el archivo de Figma. Las medidas salen del prototipo (circulo 22, punto 10, fila gap 12) y los colores de los tokens `--tk-*` y de las primitivas `--colours-*`.",
          "",
          "Seleccion unica dentro de un grupo. Reglas de uso:",
          "",
          "- **Una siempre.** El grupo arranca con una opcion por defecto; no existe el estado *ninguna*. Para un si/no aislado usa checkbox o toggle.",
          "- **2 a 5 opciones.** Por encima de ~5 la lista pasa a un `Select`. Cada fila entera es clicable.",
          "- **En tarjeta** cuando cada opcion necesita descripcion: borde tinta al seleccionar.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    orientation: { control: "inline-radio", options: ["vertical", "horizontal"] },
    invalid: { control: "boolean" },
    disabled: { control: "boolean" },
    label: { control: "text" },
  },
  args: { label: "Cuenta destino", defaultValue: "ahorro" },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="ahorro">Cuenta de ahorro</Radio>
      <Radio value="corriente">Cuenta corriente</Radio>
      <Radio value="nomina">Cuenta nómina</Radio>
    </RadioGroup>
  ),
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tres opciones, la primera marcada de salida: no existe el estado "ninguna". */
export const Grupo: Story = {};

/** El titulo va enlazado por `aria-labelledby`, no como texto suelto encima. */
export const SinTitulo: Story = {
  name: "Sin título",
  args: { label: undefined },
};

/** Para 2 o 3 opciones cortas. Las cuatro flechas siguen navegando. */
export const Horizontal: Story = {
  args: { orientation: "horizontal", label: "Plazo" },
  render: (args) => (
    <RadioGroup {...args} defaultValue="30">
      <Radio value="30">30 días</Radio>
      <Radio value="60">60 días</Radio>
      <Radio value="90">90 días</Radio>
    </RadioGroup>
  ),
};

/** Anillo rojo y fondo rojo transparente en todo el grupo. */
export const EnError: Story = {
  // No se llama `Error` a secas para no tapar el global del mismo nombre.
  name: "Error",
  args: { invalid: true },
};

/** Aro 1.5px sobre el borde y relleno `surface-2`. Nunca opacidad sobre la fila. */
export const Deshabilitado: Story = {
  args: { disabled: true },
};

/** Solo una opcion fuera de juego: las demas siguen navegables y se salta al tabular. */
export const OpcionDeshabilitada: Story = {
  name: "Opción deshabilitada",
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="ahorro">Cuenta de ahorro</Radio>
      <Radio value="corriente" disabled>
        Cuenta corriente (bloqueada)
      </Radio>
      <Radio value="nomina">Cuenta nómina</Radio>
    </RadioGroup>
  ),
};

/** Cuando cada opcion necesita contexto. Borde tinta y fondo de pagina al seleccionar. */
export const EnTarjeta: Story = {
  name: "En tarjeta",
  args: { label: "Método de envío", defaultValue: "estandar" },
  parameters: {
    docs: {
      description: {
        story:
          "La descripcion se anuncia como `aria-describedby`, no como parte del nombre accesible: el lector de pantalla dice *Envío estándar, radio button, marcado* y despues la descripcion.",
      },
    },
  },
  render: (args) => (
    <RadioGroup {...args} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Radio value="estandar" appearance="card" description="Llega en minutos · $0">
        Envío estándar
      </Radio>
      <Radio value="programado" appearance="card" description="Eliges día y hora">
        Programado
      </Radio>
    </RadioGroup>
  ),
};

/** Estado real del componente: pruebalo con raton y con flechas. */
export const Controlado: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    function Demo() {
      const [value, setValue] = React.useState("ahorro");
      return (
        <div className="flex flex-col gap-4">
          <RadioGroup label="Cuenta destino" value={value} onValueChange={setValue}>
            <Radio value="ahorro">Cuenta de ahorro</Radio>
            <Radio value="corriente">Cuenta corriente</Radio>
            <Radio value="nomina">Cuenta nómina</Radio>
          </RadioGroup>
          <span className="font-meta text-[11px] tracking-[0.1em] text-ink-600 uppercase">
            value: {value}
          </span>
        </div>
      );
    }
    return <Demo />;
  },
};

/* La matriz congela el tema claro con .tk-static, igual que el documento en sus
   bloques de especificacion: las muestras deben verse iguales en cualquier
   contexto. HOVER no se puede congelar sin CSS a medida, asi que la fila lleva
   la instruccion en vez de una muestra falsa. */

/** Anillo por estado: off 1.5 tk-400 · on 2 tinta · hover 1.5 tinta · disabled 1.5 borde · error 1.5 rojo. */
export const MatrizDeEstados: Story = {
  name: "Matriz de estados",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="tk-static flex flex-wrap gap-8 bg-surface p-6">
      {(
        [
          ["OFF", { value: "x" }, "otra"],
          ["ON", { value: "x" }, "x"],
          ["DISABLED", { value: "x", disabled: true }, "otra"],
          ["ON · DISABLED", { value: "x", disabled: true }, "x"],
          ["ERROR", { value: "x", invalid: true }, "otra"],
          ["ERROR · ON", { value: "x", invalid: true }, "x"],
        ] as const
      ).map(([nombre, props, seleccion]) => (
        <div key={nombre} className="flex flex-col items-start gap-2">
          <RadioGroup value={seleccion}>
            <Radio {...props}>Opción</Radio>
          </RadioGroup>
          <span className="font-meta text-[10px] tracking-[0.1em] text-ink-600 uppercase">
            {nombre}
          </span>
        </div>
      ))}
      <div className="flex flex-col items-start gap-2">
        <RadioGroup value="otra">
          <Radio value="x">Pásame el ratón</Radio>
        </RadioGroup>
        <span className="font-meta text-[10px] tracking-[0.1em] text-ink-600 uppercase">hover</span>
      </div>
    </div>
  ),
};
