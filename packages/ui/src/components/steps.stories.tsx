import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Steps, StepsDots, type StepItem } from "./steps";

const PASOS: StepItem[] = [{ label: "Monto" }, { label: "Destino" }, { label: "Confirmar" }];

const PASOS_CON_DETALLE: StepItem[] = [
  { label: "Monto", description: "$250.000 COP" },
  { label: "Destino", description: "Elige a quién enviar" },
  { label: "Confirmar" },
];

const meta = {
  title: "Componentes/Steps",
  component: Steps,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Sección 34 · Steps — EXTENSIÓN** (propuesta construida con la paleta del sistema).",
          "",
          "No hay ningún stepper en el archivo de Figma: el documento lo etiqueta como extensión y aquí se conserva esa distinción. No lo cites como especificación aprobada.",
          "",
          "- **Hecho** — relleno tinta con check.",
          "- **Actual** — anillo tinta con punto.",
          "- **Pendiente** — borde gris con el número en horizontal, y anillo vacío en vertical, tal como los dibuja el documento: allí el título ya ordena la lista y el número sobra.",
          "- **Error** — anillo rojo con aspa; no se deduce de la posición, se declara con `status`.",
          "",
          "El conector entre dos pasos se pinta en tinta cuando el paso de la izquierda (o de arriba) está hecho.",
          "",
          "Horizontal para 3–4 pasos cortos encima del contenido; vertical cuando cada paso lleva detalle o resumen. Máximo ~5 pasos: por encima de eso, agrupa.",
          "",
          "Por defecto es **salida, no control**: no hay nada enfocable. Solo cuando pasas `onStepSelect` los pasos ya hechos se vuelven `<button>` para poder regresar.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
    currentIndicator: { control: "inline-radio", options: ["dot", "number"] },
    value: { control: { type: "number", min: 0, max: 4 } },
    steps: { control: false },
    onStepSelect: { control: false },
  },
  args: { steps: PASOS, value: 1, "aria-label": "Progreso del envío" },
} satisfies Meta<typeof Steps>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tres pasos cortos encima del contenido. El primero hecho, el segundo en curso. */
export const Horizontal: Story = {};

/** El ejemplo del documento pinta el número dentro del anillo del paso actual. */
export const ActualConNumero: Story = {
  name: "Actual con número",
  args: { currentIndicator: "number" },
  parameters: {
    docs: {
      description: {
        story:
          "El bloque de reglas dice «Actual: anillo tinta con punto», pero el ejemplo horizontal dibuja el número. Gana el punto por defecto y el número queda disponible por prop.",
      },
    },
  },
};

/** Cuando cada paso lleva resumen, el eje se vuelve vertical. */
export const Vertical: Story = {
  args: { steps: PASOS_CON_DETALLE, orientation: "vertical" },
  parameters: {
    docs: {
      description: {
        story:
          "El paso pendiente deja el anillo vacío, sin número: en vertical la etiqueta es un título de 15 que ya ordena la lista. El detalle (`description`) solo se pinta en este eje.",
      },
    },
  },
};

/** El error se declara, no se deduce: el paso sigue siendo el actual. */
export const ConError: Story = {
  name: "Con error",
  args: {
    steps: [{ label: "Monto" }, { label: "Destino", status: "error" }, { label: "Confirmar" }],
    value: 1,
  },
  parameters: {
    docs: {
      description: {
        story:
          'El conector que sale de un paso con error sigue gris: el error no hace avanzar el flujo. `aria-current="step"` se mantiene sobre el paso fallido.',
      },
    },
  },
};

/** Los pasos hechos se vuelven tocables para regresar. */
export const Navegable: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Con `onStepSelect` los pasos hechos se renderizan como `<button>` nativos: el teclado (Tab, Enter, Espacio) funciona sin ningún manejador a mano.",
      },
    },
  },
  render: function Navegable(args) {
    const [value, setValue] = React.useState(2);
    return (
      <div className="flex w-[420px] flex-col gap-6">
        <Steps {...args} value={value} onStepSelect={setValue} />
        <p className="font-meta text-[11px] text-ink-600">
          Paso {value + 1} de {PASOS.length} · pulsa un paso hecho para regresar
        </p>
      </div>
    );
  },
};

/** Progreso compacto para onboarding y carruseles. El actual es una píldora. */
export const Puntos: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-3">
      <StepsDots count={5} value={2} />
      <p className="font-meta text-[11px] text-ink-600">
        progreso compacto para onboarding y carruseles · actual = píldora alargada
      </p>
    </div>
  ),
};

/** Matriz de especificación: los cuatro estados del círculo, en los dos ejes. */
export const MatrizDeEstados: Story = {
  name: "Matriz de estados",
  parameters: { controls: { disable: true } },
  render: () => {
    const filas = [
      {
        titulo: "Horizontal · hecho / actual / pendiente",
        node: <Steps steps={PASOS} value={1} aria-label="Horizontal" className="max-w-[480px]" />,
      },
      {
        titulo: "Horizontal · con error",
        node: (
          <Steps
            steps={[
              { label: "Monto" },
              { label: "Destino", status: "error" },
              { label: "Confirmar" },
            ]}
            value={1}
            aria-label="Con error"
            className="max-w-[480px]"
          />
        ),
      },
      {
        titulo: "Horizontal · completado",
        node: (
          <Steps
            steps={PASOS.map((s) => ({ ...s, status: "done" as const }))}
            value={2}
            aria-label="Completado"
            className="max-w-[480px]"
          />
        ),
      },
      {
        titulo: "Vertical · con detalle",
        node: (
          <Steps
            steps={PASOS_CON_DETALLE}
            value={1}
            orientation="vertical"
            aria-label="Vertical"
            className="max-w-[420px]"
          />
        ),
      },
      {
        titulo: "Puntos · 5 pasos",
        node: <StepsDots count={5} value={2} />,
      },
    ];

    return (
      <div className="flex flex-col gap-8">
        {filas.map((fila) => (
          <div key={fila.titulo} className="flex flex-col gap-3">
            <div className="font-meta text-[11px] tracking-[0.14em] text-ink-600 uppercase">
              {fila.titulo}
            </div>
            {fila.node}
          </div>
        ))}
      </div>
    );
  },
};
