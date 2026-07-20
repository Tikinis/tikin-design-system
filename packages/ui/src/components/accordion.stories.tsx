import type { Meta, StoryObj } from "@storybook/react-vite";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";

/* Seccion 35 · Accordion — EXTENSION construida con los tokens del archivo.
 * El documento marca esta seccion como propuesta, no como especificacion
 * aprobada, y esa distincion se conserva en la descripcion de cada story. */

const meta = {
  title: "Componentes/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Seccion 35 · Accordion — EXTENSION** (construida con los tokens del archivo).",
          "",
          "No existe un componente Accordion en el archivo de Figma. Esto es una propuesta coherente montada sobre los tokens `--tk-*` y la escala de radios de la seccion 03: **no es especificacion aprobada**.",
          "",
          "Reglas del documento:",
          "",
          "- **Chevron gira** — el caret rota 180° al abrir, en 150ms. Toda la fila es el disparador, no solo el icono.",
          "- **Una o varias** — en FAQ, una abierta a la vez (`type=\"single\"` + `collapsible`). En ajustes, varias a la vez (`type=\"multiple\"`).",
          "- **Titulo claro** — la pregunta en Funnel 500; la respuesta en Sans. No escondas informacion critica dentro del acordeon.",
          "",
          "Medidas del prototipo: fila r12 con borde de 1px, separadas 10 · trigger padding 16, gap 12 · pregunta 15 · respuesta 14/1.55.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    variant: { control: "inline-radio", options: ["boxed", "flush"] },
    type: { control: "inline-radio", options: ["single", "multiple"] },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const preguntas = [
  {
    id: "tiempo",
    q: "¿Cuánto tarda una transferencia?",
    a: "Entre 1 y 2 días hábiles. Si la envías antes de las 14:00 de un día laborable, sale el mismo día.",
  },
  {
    id: "cancelar",
    q: "¿Puedo cancelar un envío?",
    a: "Solo mientras siga en estado pendiente. Una vez confirmado por el banco receptor, hay que pedir una devolución.",
  },
  {
    id: "comisiones",
    q: "¿Hay comisiones?",
    a: "Ninguna en los primeros cinco envíos de cada mes. A partir del sexto se aplica la tarifa de tu plan.",
  },
];

/** FAQ: una abierta a la vez, y se puede cerrar volviendo a pulsarla. */
export const Faq: Story = {
  args: { type: "single", collapsible: true },
  parameters: {
    docs: {
      description: {
        story:
          "`type=\"single\"` cierra las demás al abrir una. `collapsible` permite dejarlas todas cerradas.",
      },
    },
  },
  render: (args) => (
    <div className="w-[560px] max-w-full">
      <Accordion {...args}>
        {preguntas.map((p) => (
          <AccordionItem key={p.id} value={p.id}>
            <AccordionTrigger>{p.q}</AccordionTrigger>
            <AccordionContent>{p.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  ),
};

/** Ajustes: varias filas abiertas a la vez. */
export const VariasAbiertas: Story = {
  name: "Varias abiertas",
  args: { type: "multiple", defaultValue: ["tiempo", "comisiones"] },
  parameters: {
    docs: {
      description: {
        story: "`type=\"multiple\"` — el caso de una pantalla de ajustes, donde cada bloque es independiente.",
      },
    },
  },
  render: (args) => (
    <div className="w-[560px] max-w-full">
      <Accordion {...args}>
        {preguntas.map((p) => (
          <AccordionItem key={p.id} value={p.id}>
            <AccordionTrigger>{p.q}</AccordionTrigger>
            <AccordionContent>{p.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  ),
};

/** Lista continua sin caja, separada por lineas de 1px. */
export const Flush: Story = {
  args: { type: "multiple", variant: "flush", defaultValue: ["tiempo"] },
  parameters: {
    docs: {
      description: {
        story:
          "Extension de la extension: para acordeones que viven dentro de una tarjeta que ya aporta su propio borde r12, de modo que no se dupliquen cajas.",
      },
    },
  },
  render: (args) => (
    <div className="w-[560px] max-w-full rounded-xl border border-edge bg-surface p-4">
      <Accordion {...args}>
        {preguntas.map((p) => (
          <AccordionItem key={p.id} value={p.id}>
            <AccordionTrigger>{p.q}</AccordionTrigger>
            <AccordionContent>{p.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  ),
};

/** Una fila bloqueada sale de la navegacion por flechas ademas de no abrirse. */
export const FilaDeshabilitada: Story = {
  name: "Fila deshabilitada",
  args: { type: "single", collapsible: true },
  render: (args) => (
    <div className="w-[560px] max-w-full">
      <Accordion {...args}>
        <AccordionItem value="tiempo">
          <AccordionTrigger>¿Cuánto tarda una transferencia?</AccordionTrigger>
          <AccordionContent>{preguntas[0]!.a}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="limites" disabled>
          <AccordionTrigger>Límites de tu plan (no disponible)</AccordionTrigger>
          <AccordionContent>Contenido bloqueado.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="comisiones">
          <AccordionTrigger>¿Hay comisiones?</AccordionTrigger>
          <AccordionContent>{preguntas[2]!.a}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

/** Los dos estados de una fila, lado a lado, en las dos pieles. */
export const MatrizDeEspecificacion: Story = {
  name: "Matriz de especificación",
  args: { type: "single" },
  parameters: { controls: { disable: true } },
  render: () => {
    const variantes = ["boxed", "flush"] as const;
    const estados = [
      { label: "cerrado", value: undefined },
      { label: "abierto", value: "x" },
      { label: "disabled", value: undefined, disabled: true },
    ];

    return (
      <div className="flex flex-col gap-8">
        {variantes.map((variant) => (
          <div key={variant} className="flex flex-col gap-3">
            <div className="font-meta text-ink-500 text-[11px] tracking-[0.1em] uppercase">
              {variant}
            </div>
            <div className="grid grid-cols-3 gap-6">
              {estados.map((estado) => (
                <div key={estado.label} className="flex flex-col gap-2">
                  <div className="font-meta text-ink-500 text-[11px] tracking-[0.1em] uppercase">
                    {estado.label}
                  </div>
                  <Accordion
                    type="single"
                    collapsible
                    variant={variant}
                    defaultValue={estado.value}
                  >
                    <AccordionItem value="x" disabled={estado.disabled}>
                      <AccordionTrigger>¿Hay comisiones?</AccordionTrigger>
                      <AccordionContent>
                        Ninguna en los primeros cinco envíos del mes.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  },
};

/** El nivel del encabezado se ajusta al de la pagina, no al reves. */
export const NivelDeEncabezado: Story = {
  name: "Nivel de encabezado",
  args: { type: "single", collapsible: true },
  parameters: {
    docs: {
      description: {
        story:
          "Cada disparador va dentro de un encabezado real para que el lector de pantalla pueda saltar de pregunta en pregunta. Bajo un `<h3>` de sección, pasa `headingLevel={4}`.",
      },
    },
  },
  render: (args) => (
    <div className="flex w-[560px] max-w-full flex-col gap-3">
      <h3 className="font-display text-ink text-lg font-semibold">Envíos</h3>
      <Accordion {...args}>
        {preguntas.map((p) => (
          <AccordionItem key={p.id} value={p.id}>
            <AccordionTrigger headingLevel={4}>{p.q}</AccordionTrigger>
            <AccordionContent>{p.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  ),
};
