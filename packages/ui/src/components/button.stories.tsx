import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";

/* PLANTILLA DE REFERENCIA para el resto de componentes.
 *
 * Convenciones que sigue toda story del sistema:
 *
 *  1. El `title` va como "Componentes/<Nombre>".
 *  2. La descripcion de `parameters.docs` cita la seccion del documento y dice
 *     si el componente es CANONICO (viene del archivo de Figma) o EXTENSION
 *     (propuesto, construido con los tokens). El documento hace esa distincion
 *     a proposito y perderla haria que alguien tomase una propuesta por
 *     especificacion aprobada.
 *  3. Hay una story por estado relevante, no una sola con todos los controles:
 *     asi el addon de a11y audita cada combinacion por separado.
 *  4. Las matrices de especificacion usan `.tk-static` para congelar el tema
 *     claro, igual que hace el documento.
 */

const meta = {
  title: "Componentes/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Seccion 05 · Botones — CANONICO** (del archivo de Figma).",
          "",
          "Dos familias que nunca se mezclan en la misma vista:",
          "",
          "- **flow** — app movil. L a XS, full-width, ancladas abajo con margen 20 y safe-area. Cierran un paso de un flujo.",
          "- **compact** — web/desktop. Altura fija 40, ancho al contenido, nunca full-width. Barras de acciones, tablas y headers.",
          "",
          "Una primaria por pantalla. Si dos acciones conviven lado a lado, la segunda baja a `secondary`; la salida va en `ghost` debajo.",
          "",
          "El label va en verbo directo, sin puntuacion: CONFIRMAR, ENVIAR, ACTIVAR.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    variant: { control: "inline-radio", options: ["primary", "secondary", "ghost", "link"] },
    size: { control: "inline-radio", options: ["l", "m", "s", "xs"] },
    family: { control: "inline-radio", options: ["flow", "compact"] },
    loading: { control: "boolean" },
    fullWidth: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: { children: "Confirmar" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = { args: { variant: "secondary" } };
export const Ghost: Story = { args: { variant: "ghost" } };
export const Link: Story = { args: { variant: "link" } };

/** El spinner sustituye al label — no lo acompaña — y el ancho no salta. */
export const Loading: Story = {
  args: { loading: true },
  parameters: {
    docs: {
      description: {
        story:
          "Usa `aria-disabled` en vez del atributo `disabled`, para que el boton no pierda el foco justo despues de que el usuario lo pulse.",
      },
    },
  },
};

/** Flow invierte a gris 600; compacta usa fondo claro. Nunca opacidad. */
export const Deshabilitado: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Button {...args} disabled family="flow">
        Flow
      </Button>
      <Button {...args} disabled family="compact">
        Compacta
      </Button>
    </div>
  ),
};

/** corner 12/10/8/6 · icono 16/16/12/12 · label 16/14/12/12 · px 24/20/16/12 */
export const Tamanos: Story = {
  name: "Tamaños",
  render: (args) => (
    <div className="flex items-center gap-4">
      <Button {...args} size="l">
        L · 48
      </Button>
      <Button {...args} size="m">
        M · 40
      </Button>
      <Button {...args} size="s">
        S · 32
      </Button>
      <Button {...args} size="xs">
        XS · 28
      </Button>
    </div>
  ),
};

/** Matriz de estados del documento: tamaño M, 40, r10. */
export const MatrizDeEstados: Story = {
  name: "Matriz de estados",
  parameters: { controls: { disable: true } },
  render: () => {
    const variants = ["primary", "secondary", "ghost", "link"] as const;
    return (
      <table className="border-separate border-spacing-3">
        <thead>
          <tr>
            <th />
            {variants.map((v) => (
              <th key={v} className="font-meta text-[11px] tracking-[0.1em] text-ink-600 uppercase">
                {v}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(["default", "loading", "disabled"] as const).map((state) => (
            <tr key={state}>
              <td className="font-meta text-[11px] tracking-[0.1em] text-ink-600 uppercase">
                {state}
              </td>
              {variants.map((v) => (
                <td key={v}>
                  <Button
                    variant={v}
                    size="m"
                    loading={state === "loading"}
                    disabled={state === "disabled"}
                  >
                    Label
                  </Button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
};

/** Jerarquia: primary manda, la salida va Ghost debajo, apiladas en columna. */
export const JerarquiaEnPantalla: Story = {
  name: "Jerarquía en pantalla",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[320px] flex-col gap-2">
      <Button fullWidth>Confirmar envío</Button>
      <Button variant="ghost" fullWidth>
        Cancelar
      </Button>
    </div>
  ),
};

/** Con asChild el estilo se aplica al elemento del consumidor. */
export const ComoEnlace: Story = {
  name: "Como enlace (asChild)",
  parameters: { controls: { disable: true } },
  render: () => (
    <Button asChild>
      <a href="#pagar">Pagar</a>
    </Button>
  ),
};
