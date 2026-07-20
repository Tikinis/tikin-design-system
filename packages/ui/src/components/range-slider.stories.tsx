import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { RangeSlider, type RangeSliderValue } from "./range-slider";

const pesos = (v: number) => `$ ${v.toLocaleString("es-CO")}`;

const meta = {
  title: "Componentes/RangeSlider",
  component: RangeSlider,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Seccion 40 · Range slider — EXTENSION** construida con la paleta del sistema.",
          "",
          "No existe nodo equivalente en el archivo de Figma: la unica fuente de pixeles es el prototipo de la seccion 40. **No es especificacion aprobada.**",
          "",
          "- **Dos manijas** — para elegir un intervalo (monto, fecha). La manija izquierda no cruza la derecha; el relleno lima marca el rango elegido sobre pista gris.",
          "- **Valores visibles** — los dos extremos en DM Mono arriba, los limites del rango en mono gris abajo. Siempre, no solo al arrastrar.",
          "- **Cuando usar** — para filtrar por intervalo. Si es un solo valor, usa el slider simple de la seccion 18 o un input.",
          "",
          "Geometria: pista 6 · r999 · manija 22 con anillo interior de 1.5 en tinta · caja 24 · hueco 14 entre filas.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    tone: { control: "inline-radio", options: ["lime", "ink"] },
    showValues: { control: "boolean" },
    showBounds: { control: "boolean" },
    disabled: { control: "boolean" },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
  },
  args: {
    min: 0,
    max: 1_000_000,
    step: 10_000,
    defaultValue: [300_000, 750_000],
    formatValue: pesos,
    thumbLabels: ["Monto mínimo", "Monto máximo"],
  },
  render: (args) => (
    <div className="w-[440px] max-w-full">
      <RangeSlider {...args} />
    </div>
  ),
} satisfies Meta<typeof RangeSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

/** El caso del documento: rango de monto, relleno lima, 300.000 – 750.000. */
export const RangoDeMonto: Story = {};

/**
 * Relleno en tinta. Extension coherente con la seccion 18, que reserva el lima
 * para el avance hacia una meta. Util cuando el lima ya lo ocupa otro elemento
 * de la misma vista.
 */
export const Tinta: Story = { args: { tone: "ink" } };

/** Pista apagada, relleno gris 500, manija sin anillo de tinta y opacidad .55. */
export const Deshabilitado: Story = { args: { disabled: true } };

/** Sin filas de texto: para barras de filtros densas donde el valor ya se lee en un chip. */
export const SoloControl: Story = {
  args: { showValues: false, showBounds: false },
  parameters: {
    docs: {
      description: {
        story:
          "Ocultar los valores contradice la regla 'valores visibles' del documento. Hazlo solo si el intervalo elegido aparece en otro sitio de la pantalla.",
      },
    },
  },
};

/** `formatValue` sirve para cualquier escala, no solo dinero. */
export const RangoDeFechas: Story = {
  name: "Rango de fechas",
  args: {
    min: 0,
    max: 11,
    step: 1,
    defaultValue: [2, 8],
    formatValue: (v: number) =>
      [
        "ENE",
        "FEB",
        "MAR",
        "ABR",
        "MAY",
        "JUN",
        "JUL",
        "AGO",
        "SEP",
        "OCT",
        "NOV",
        "DIC",
      ][v] ?? "",
    thumbLabels: ["Mes inicial", "Mes final"],
  },
};

/**
 * Controlado desde fuera. `onValueCommit` se dispara al soltar: es el gancho
 * para lanzar la consulta, no `onValueChange`, que se dispara en cada paso.
 */
export const Controlado: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    function Demo() {
      const [rango, setRango] = React.useState<RangeSliderValue>([200_000, 600_000]);
      const [consultado, setConsultado] = React.useState<RangeSliderValue>([
        200_000, 600_000,
      ]);
      return (
        <div className="flex w-[440px] max-w-full flex-col gap-6">
          <RangeSlider
            min={0}
            max={1_000_000}
            step={10_000}
            value={rango}
            onValueChange={setRango}
            onValueCommit={setConsultado}
            formatValue={pesos}
            thumbLabels={["Monto mínimo", "Monto máximo"]}
          />
          <p className="font-meta text-xs text-ink-500">
            última consulta lanzada: {pesos(consultado[0])} – {pesos(consultado[1])}
          </p>
        </div>
      );
    }
    return <Demo />;
  },
};

/**
 * Matriz de especificacion. Congelada en tema claro con `.tk-static`, igual que
 * el documento, para poder comparar contra el prototipo pixel a pixel.
 */
export const MatrizDeEspecificacion: Story = {
  name: "Matriz de especificación",
  parameters: { controls: { disable: true } },
  render: () => {
    const filas = [
      { etiqueta: "LIMA · CANÓNICO", props: { tone: "lime" as const } },
      { etiqueta: "TINTA · EXTENSIÓN", props: { tone: "ink" as const } },
      { etiqueta: "EXTREMOS JUNTOS", props: { defaultValue: [500_000, 500_000] as RangeSliderValue } },
      { etiqueta: "RANGO COMPLETO", props: { defaultValue: [0, 1_000_000] as RangeSliderValue } },
      { etiqueta: "DISABLED · .55", props: { disabled: true } },
    ];
    return (
      <div className="tk-static flex flex-col gap-8 bg-page p-6">
        {filas.map((fila) => (
          <div key={fila.etiqueta} className="flex flex-col gap-3">
            <span className="font-mono text-[11px] tracking-[0.14em] text-ink-500 uppercase">
              {fila.etiqueta}
            </span>
            <div className="w-[440px] max-w-full">
              <RangeSlider
                min={0}
                max={1_000_000}
                step={10_000}
                defaultValue={[300_000, 750_000]}
                formatValue={pesos}
                thumbLabels={["Monto mínimo", "Monto máximo"]}
                {...fila.props}
              />
            </div>
          </div>
        ))}
      </div>
    );
  },
};
