import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, Chip } from "./chip";

/* Seccion 09 · Chips & badges.
 *
 * El title va como "Componentes/<Nombre>". Hay una story por estado relevante
 * para que el addon de a11y audite cada combinacion por separado, y una matriz
 * de especificacion con las 16 variantes del archivo. */

const meta = {
  title: "Componentes/Chip",
  component: Chip,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Seccion 09 · Chips & badges — MIXTO.**",
          "",
          '- `variant="feedback"` es **CANONICO**: es el componente Chip del archivo de Figma (16 variantes = 4 feedbacks x 4 tamaños). Pastel solido, pill, Ubuntu Mono en MAYUSCULAS con +5% de tracking, sin borde y sin icono. No es interactivo.',
          '- `variant="action" | "filter" | "value"` son **EXTENSION**: el propio documento las etiqueta como *"extension construida con tokens del archivo (pill r999, borde de campo); el unico Chip nativo es el de feedback"*. Van en Ubuntu Sans y caja normal, no en mono mayusculas.',
          "",
          "Suave vs solido: el pastel solido del Chip es para **feedback puntual**; para estados persistentes en listas se usa `Badge` (tint 50).",
          "",
          '**Altura de `size="l"`: 28, no 32.** La rejilla del documento rotula "L · 32" pero el export de Figma da 28 en las cuatro variantes L; el export manda en pixeles.',
        ].join("\n"),
      },
    },
  },
  argTypes: {
    variant: { control: "inline-radio", options: ["feedback", "action", "filter", "value"] },
    tone: { control: "inline-radio", options: ["info", "success", "warning", "error"] },
    size: { control: "inline-radio", options: ["xs", "s", "m", "l"] },
    selected: { control: "boolean" },
    disabled: { control: "boolean" },
    dot: { control: "inline-radio", options: [undefined, "info", "success", "warning", "error"] },
  },
  args: { children: "Completado" },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** El chip del archivo: pastel solido, mono en mayusculas, sin icono ni borde. */
export const Feedback: Story = { args: { tone: "success" } };

/** Accion sobre un objeto. Alto 40, borde de campo, texto sans en caja normal. */
export const Accion: Story = {
  name: "Acción",
  args: { variant: "action", children: "Agregar etiqueta", startIcon: <IconoMas /> },
};

/** Filtro apagado / encendido. Expone `aria-pressed`, que es lo que anuncia el lector. */
export const Filtro: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Chip variant="filter">Movimientos</Chip>
      <Chip variant="filter" selected startIcon={<IconoCheck />}>
        Movimientos
      </Chip>
      <Chip variant="filter" dot="success">
        Activo
      </Chip>
      <Chip variant="filter" count={4}>
        Bolsillos
      </Chip>
    </div>
  ),
};

/**
 * Valor seleccionado y removible. El contenedor NO es un boton aunque se pida
 * `variant="action"`: un `<button>` dentro de otro es HTML invalido y dejaria
 * la X fuera del alcance del teclado.
 */
export const ValorRemovible: Story = {
  name: "Valor removible",
  parameters: { controls: { disable: true } },
  render: () => (
    <Chip variant="value" onRemove={() => {}} removeLabel="Quitar bolsillo Arriendo">
      Bolsillo · Arriendo
    </Chip>
  ),
};

/** Estados de la chip de accion: default, hover, pressed y disabled. */
export const EstadosInteractivos: Story = {
  name: "Estados interactivos",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Chip variant="action" startIcon={<IconoMas />}>
        Default
      </Chip>
      <Chip variant="action" className="bg-surface-2" startIcon={<IconoMas />}>
        Hover
      </Chip>
      <Chip variant="action" className="bg-edge" startIcon={<IconoMas />}>
        Pressed
      </Chip>
      <Chip variant="action" disabled startIcon={<IconoMas />}>
        Disabled
      </Chip>
    </div>
  ),
};

/** Matriz de especificacion: las 16 variantes del archivo. Alturas 20/22/26/28. */
export const MatrizDelArchivo: Story = {
  name: "Matriz del archivo (16 variantes)",
  parameters: { controls: { disable: true } },
  render: () => {
    const tonos = ["info", "success", "warning", "error"] as const;
    const tamanos = [
      ["xs", "XS · 20"],
      ["s", "S · 22"],
      ["m", "M · 26"],
      ["l", "L · 28"],
    ] as const;
    const etiqueta: Record<(typeof tonos)[number], string> = {
      info: "INFO",
      success: "COMPLETADO",
      warning: "PENDIENTE",
      error: "RECHAZADO",
    };
    const rotulo = "font-meta text-ink-600 text-[11px] tracking-[0.1em] uppercase";

    return (
      <table className="border-separate border-spacing-3">
        <thead>
          <tr>
            <th />
            {tamanos.map(([valor, titulo]) => (
              <th key={valor} className={rotulo}>
                {titulo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tonos.map((tono) => (
            <tr key={tono}>
              <td className={rotulo}>{tono}</td>
              {tamanos.map(([valor]) => (
                <td key={valor}>
                  <Chip tone={tono} size={valor}>
                    {etiqueta[tono]}
                  </Chip>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
};

/** Badge suave (tint 50), solido, outline, punto y contador. */
export const Badges: Story = {
  name: "Badges (extensión)",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Suave (tint 50) para estados persistentes en listas; ink solido solo para NUEVO y contadores; outline para metadatos. El badge nunca anida nada y nunca es clickeable — por eso su tipo omite `onClick`.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <Badge tone="success">Saldo +12%</Badge>
        <Badge tone="warning">Pendiente</Badge>
        <Badge tone="error">Rechazado</Badge>
        <Badge tone="info">Bolsillo</Badge>
        <Badge>Neutral</Badge>
        <Badge variant="solid">Nuevo</Badge>
        <Badge variant="outline">v2.1</Badge>
      </div>

      <div className="flex flex-wrap items-center gap-7">
        <Badge variant="dot" tone="success">
          Activo
        </Badge>
        <Badge variant="dot" tone="warning">
          Pendiente
        </Badge>
        <Badge variant="dot" tone="error">
          Rechazado
        </Badge>
        <Badge variant="count">3</Badge>
        <Badge variant="count" tone="success">
          +2
        </Badge>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Badge size="s">S · 20</Badge>
        <Badge size="m">M · 24</Badge>
        <Badge size="l">L · 28</Badge>
      </div>
    </div>
  ),
};

/** Fila de movimientos: el badge suave marca el estado, el Chip no aparece aqui. */
export const EnContexto: Story = {
  name: "En contexto",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex max-w-[560px] flex-col gap-3">
      {[
        {
          nombre: "Valentina Castro",
          detalle: "$valentinacastro",
          estado: "Completado",
          tono: "success",
          monto: "+ $500.000",
        },
        {
          nombre: "Dispersión de bonos",
          detalle: "12 destinatarios",
          estado: "Pendiente",
          tono: "warning",
          monto: "– $3.100.300",
        },
      ].map((fila) => (
        <div
          key={fila.nombre}
          className="flex items-center gap-3 rounded-lg border border-edge bg-page px-4 py-3.5"
        >
          <div className="flex flex-1 flex-col gap-0.5">
            <span className="text-sm font-medium text-ink">{fila.nombre}</span>
            <span className="font-mono text-xs text-ink-600">{fila.detalle}</span>
          </div>
          <Badge tone={fila.tono as "success" | "warning"} size="s">
            {fila.estado}
          </Badge>
          <span className="font-mono text-sm font-semibold text-ink">{fila.monto}</span>
        </div>
      ))}
    </div>
  ),
};

/* Iconos locales de demostracion. packages/ui no depende de una libreria de
   iconos, asi que las stories dibujan los suyos en vez de arrastrar una. */
function IconoMas() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6.4" />
      <path d="M8 5.4v5.2M5.4 8h5.2" />
    </svg>
  );
}

function IconoCheck() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m3.2 8.4 3.1 3.1 6.5-6.9" />
    </svg>
  );
}
