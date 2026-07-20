import type { Meta, StoryObj } from "@storybook/react-vite";
import { Progress } from "./progress";

const meta: Meta<typeof Progress> = {
  title: "Componentes/Progress",
  component: Progress,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Seccion 18 · Progress & sliders — EXTENSION** (no esta en el archivo de Figma).",
          "",
          "El documento lo declara literalmente como *extension construida con la paleta y los radios del sistema*: no hay ningun nodo de progreso en el archivo, ni tokens `--progress-*`. Todo lo de aqui es propuesta coherente, **no especificacion aprobada**.",
          "",
          "Dos reglas de uso mandan sobre la API:",
          "",
          '- **Tinta vs lima** — el progreso de una tarea va en tinta (`tone="ink"`); el avance hacia una meta de ahorro va en lima (`tone="lime"`). El verde y el check solo al 100%.',
          "- **Determinado primero** — si conoces el porcentaje, muestralo. El indeterminado (`value={null}`, segmento animado) solo cuando no hay forma de estimar.",
          "",
          "Geometria del documento: barra de alto 8 y radio 999; circular de viewBox 96 con radio 38, trazo 12 y extremo redondeado, pintado a 88px.",
          "",
          "No es enfocable ni operable por teclado, y esta bien: es salida, no control. Para elegir un valor va un slider. Necesita **siempre** `aria-label` o `aria-labelledby`.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    tone: { control: "inline-radio", options: ["ink", "lime"] },
    shape: { control: "inline-radio", options: ["linear", "circular"] },
    showCheck: { control: "boolean" },
    showValue: { control: "boolean" },
    diameter: { control: { type: "range", min: 40, max: 160, step: 4 } },
  },
  args: { value: 40, "aria-label": "Progreso de la tarea" },
  decorators: [
    (Story) => (
      <div className="w-[520px] max-w-full">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Progress>;

/** DETERMINADO · 40% · tinta. El caso por defecto: si sabes el numero, dilo. */
export const Determinado: Story = {};

/* La story se llama MetaDeAhorro y no Meta porque `Meta` ya es el tipo que
   importamos de Storybook y las dos declaraciones chocarian. */
/** META · 72% · lima. El lima es para metas de ahorro, no para tareas. */
export const MetaDeAhorro: Story = {
  name: "Meta",
  args: { value: 72, tone: "lime", "aria-label": "Avance hacia tu meta" },
};

/** COMPLETO · 100% + check. La pista pasa a verde tenue y el check aparece. */
export const Completo: Story = {
  args: { value: 100, tone: "lime", showCheck: true, "aria-label": "Meta alcanzada" },
  parameters: {
    docs: {
      description: {
        story:
          "El hueco del check se reserva desde el principio aunque este invisible: si apareciera de golpe, la barra se encogeria 28px justo en el ultimo frame. Compara esta story con **Con check antes del 100%**.",
      },
    },
  },
};

/** El mismo componente al 64%: el check ya ocupa sitio, pero no se ve. */
export const ConCheckAntesDel100: Story = {
  name: "Con check antes del 100%",
  args: { value: 64, tone: "lime", showCheck: true, "aria-label": "Avance hacia tu meta" },
};

/** INDETERMINADO · segmento animado. Ultimo recurso, no el estado por defecto. */
export const Indeterminado: Story = {
  args: { value: null, "aria-label": "Cargando movimientos" },
  parameters: {
    docs: {
      description: {
        story:
          "No expone `aria-valuenow`: decir 0% seria afirmar que no ha avanzado nada, que es distinto de no saber cuanto lleva. Con `prefers-reduced-motion` el segmento deja de recorrer la pista y se queda como barra atenuada.",
      },
    },
  },
};

/** CIRCULAR · 70%. Para tarjetas y widgets compactos. */
export const Circular: Story = {
  args: { shape: "circular", value: 70, "aria-label": "Ahorro del mes" },
};

/** El circular tambien admite lima y tamaño libre. */
export const CircularLima: Story = {
  name: "Circular · lima",
  args: {
    shape: "circular",
    value: 88,
    tone: "lime",
    diameter: 120,
    "aria-label": "Meta de viaje",
  },
};

/** Sin valor conocido, el arco gira; la cifra desaparece porque no hay cifra. */
export const CircularIndeterminado: Story = {
  name: "Circular · indeterminado",
  args: { shape: "circular", value: null, "aria-label": "Calculando" },
};

/**
 * `max` distinto de 100 para contadores discretos. El texto accesible sigue
 * saliendo en porcentaje salvo que lo cambies con `getValueLabel`.
 */
export const EscalaPersonalizada: Story = {
  args: {
    value: 2,
    max: 3,
    getValueLabel: (value: number, max: number) => `paso ${value} de ${max}`,
    "aria-label": "Envio",
  },
};

/** Matriz de especificacion: los cuatro estados de la barra lineal. */
export const MatrizDeEstados: Story = {
  name: "Matriz de estados",
  parameters: { controls: { disable: true } },
  render: () => {
    const filas = [
      { nota: "DETERMINADO · 40% · tinta", props: { value: 40, tone: "ink" } as const },
      { nota: "META · 72% · lima", props: { value: 72, tone: "lime" } as const },
      {
        nota: "COMPLETO · 100% + check",
        props: { value: 100, tone: "lime", showCheck: true } as const,
      },
      { nota: "INDETERMINADO · segmento animado", props: { value: null } as const },
    ];

    return (
      <div className="flex max-w-[520px] flex-col gap-[18px]">
        {filas.map((fila) => (
          <div key={fila.nota} className="flex flex-col gap-1.5">
            <Progress {...fila.props} aria-label={fila.nota} />
            <span className="font-meta text-[10px] tracking-[0.08em] text-ink-500 uppercase">
              {fila.nota}
            </span>
          </div>
        ))}
      </div>
    );
  },
};

/** Uso real: widget de meta de ahorro. El circular vive dentro de una tarjeta. */
export const EnUnaTarjeta: Story = {
  name: "En una tarjeta",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[320px] items-center gap-5 rounded-xl border border-edge bg-surface p-5">
      <Progress
        shape="circular"
        tone="lime"
        value={70}
        diameter={88}
        aria-labelledby="tk-story-meta-titulo"
      />
      <div className="flex flex-col gap-1">
        <span id="tk-story-meta-titulo" className="font-display text-base font-medium text-ink">
          Meta de viaje
        </span>
        <span className="font-num text-[13px] text-ink-600">$ 3.500.000 de $ 5.000.000</span>
      </div>
    </div>
  ),
};
