import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SwitchField, Toggle } from "./toggle";

const meta = {
  title: "Componentes/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Seccion 16 · Toggle — CANONICO** (nodo `2:13` del archivo de Figma, 16 variantes).",
          "",
          "Interruptor de encendido/apagado que **aplica el cambio al instante**: no lleva boton de confirmar. Si la accion es riesgosa o lenta, no uses un toggle — usa un switch con confirmacion o un boton.",
          "",
          "**ON = TINTA.** Encendido en tinta 900 con knob blanco; apagado con borde gris 300. El lima no se usa aqui: el toggle es neutro, no una accion de marca.",
          "",
          "**Geometria del archivo** (track x alto · thumb · recorrido):",
          "",
          "| size | track | thumb | recorrido |",
          "| --- | --- | --- | --- |",
          "| L | 42 × 24 | 20 | 18 |",
          "| M | 34 × 20 | 16 | 14 |",
          "| S | 29 × 16 | 14 | 13 |",
          "",
          "Los `hint-size` del documento (56×32 / 48×28 / 40×24) y la demo *EN VIVO* (52×32) son cajas del prototipo, no medidas del componente. Manda el export de Figma.",
          "",
          "Figma define un cuarto tamaño `xs` con cuerpo identico a `s`, asi que aqui se colapsan en uno.",
          "",
          "El componente necesita SIEMPRE un nombre accesible: `aria-label` si va suelto, o usa `SwitchField`, que lo cablea por ti.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    size: { control: "inline-radio", options: ["l", "m", "s"] },
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: { "aria-label": "Notificaciones push" },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Estado no controlado. Un click guarda al momento. */
export const Apagado: Story = {};

export const Encendido: Story = { args: { defaultChecked: true } };

/** Ni raton ni teclado. El track baja a gris y el thumb pierde contraste. */
export const Deshabilitado: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Toggle {...args} disabled aria-label="Apagado deshabilitado" />
      <Toggle {...args} disabled defaultChecked aria-label="Encendido deshabilitado" />
    </div>
  ),
};

/** L 42×24 · M 34×20 · S 29×16. Del export de Figma, no de los hint-size. */
export const Tamanos: Story = {
  name: "Tamaños",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-6">
      {(["l", "m", "s"] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Toggle size={size} defaultChecked aria-label={`Tamaño ${size}`} />
          <span className="font-meta text-ink-500 text-[11px] tracking-[0.1em] uppercase">
            {size}
          </span>
        </div>
      ))}
    </div>
  ),
};

/**
 * Matriz de especificacion: 3 tamaños × on / off / disabled.
 *
 * A diferencia de otras matrices del sistema, esta NO se congela con
 * `.tk-static`: esa clase solo redefine la capa `--tk-*`, y el toggle se pinta
 * con los tokens `--toggle-*`. Congelar el entorno y no el componente daria una
 * muestra a medias, asi que la matriz sigue el tema activo.
 */
export const MatrizDeEspecificacion: Story = {
  name: "Matriz de especificación",
  parameters: { controls: { disable: true } },
  render: () => {
    const sizes = ["l", "m", "s"] as const;
    const head = "font-meta text-ink-500 text-[11px] tracking-[0.1em] uppercase";
    return (
      <table className="border-separate border-spacing-4">
        <thead>
          <tr>
            <th />
            {sizes.map((size) => (
              <th key={size} className={head}>
                {size}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(["on", "off", "disabled"] as const).map((state) => (
            <tr key={state}>
              <td className={head}>{state}</td>
              {sizes.map((size) => (
                <td key={size}>
                  <Toggle
                    size={size}
                    checked={state !== "off"}
                    disabled={state === "disabled"}
                    aria-label={`${state} ${size}`}
                    // Matriz estatica: no debe reaccionar al click.
                    onCheckedChange={() => {}}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
};

/** Con `name`, el valor viaja en un `<form>` nativo a traves del input espejo. */
export const EnFormulario: Story = {
  name: "En formulario",
  parameters: { controls: { disable: true } },
  render: () => {
    const [enviado, setEnviado] = React.useState<string | null>(null);
    return (
      <form
        className="flex w-[320px] flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          setEnviado(String(data.get("push") ?? "(sin enviar)"));
        }}
      >
        <SwitchField name="push" title="Notificaciones push" defaultChecked />
        <button
          type="submit"
          className="h-control-s rounded-sm bg-ink px-4 font-mono text-sm text-surface uppercase"
        >
          Guardar
        </button>
        {enviado ? (
          <span className="font-meta text-ink-600 text-xs">push = {enviado}</span>
        ) : null}
      </form>
    );
  },
};

/* ------------------------------------------------------------------------- */

/**
 * **SwitchField — EXTENSION.**
 *
 * La estructura viene del archivo (nodo `2:62618` "Switch"): titulo y
 * descripcion a la izquierda, control a la derecha, alineados al centro
 * vertical de la fila. La piel NO: ese nodo pinta el track en
 * `--primary-blue-600` sobre tipografia Inter, con su propia escala
 * (36×20 / 40×22 / 44×24). Es una libreria ajena importada al archivo y su azul
 * contradice la regla "ON = TINTA" de esta misma seccion, asi que se descarta y
 * se reusa el Toggle canonico. **No es especificacion aprobada.**
 */
export const FilaDeAjuste: Story = {
  name: "SwitchField · fila de ajuste",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[360px] flex-col gap-3 rounded-xl border border-edge bg-surface p-4">
      <SwitchField
        title="Notificaciones push"
        description="Avisos de movimientos y envios"
        defaultChecked
      />
      <SwitchField
        title="Resumen semanal"
        description="Cada lunes por la mañana"
      />
      <SwitchField title="Modo silencio" />
    </div>
  ),
};

/** El titulo y la descripcion escalan con el tamaño del control. */
export const FilaDeAjusteTamanos: Story = {
  name: "SwitchField · tamaños",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[360px] flex-col gap-6">
      {(["l", "m", "s"] as const).map((size) => (
        <SwitchField
          key={size}
          size={size}
          title={`Notificaciones push · tamaño ${size}`}
          description="Avisos de movimientos y envios"
          defaultChecked
        />
      ))}
    </div>
  ),
};

/** Una fila deshabilitada mantiene el texto legible; solo el control se apaga. */
export const FilaDeAjusteDeshabilitada: Story = {
  name: "SwitchField · deshabilitado",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[360px] flex-col gap-3">
      <SwitchField
        title="Notificaciones push"
        description="Requiere permiso del sistema"
        disabled
      />
      <SwitchField title="Resumen semanal" description="Solo en cuentas pro" disabled defaultChecked />
    </div>
  ),
};
