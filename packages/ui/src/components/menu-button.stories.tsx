import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ButtonGroup,
  ButtonGroupItem,
  MenuButton,
  MenuItem,
  MenuSeparator,
  SplitButton,
} from "./menu-button";

const meta: Meta<typeof MenuButton> = {
  title: "Componentes/MenuButton",
  component: MenuButton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Seccion 07 · Menu, split & group — EXTENSION.**",
          "",
          'El documento lo marca asi de forma explicita: _"Extension construida con los tokens del archivo"_.',
          "Ninguno de estos tres botones compuestos existe como componente en el archivo de Figma: son una",
          "propuesta coherente montada sobre los tokens `--tk-*` y la escala de radios y alturas de la seccion 03.",
          "**No son especificacion aprobada.**",
          "",
          "Cuando usar cada uno:",
          "",
          "- **MenuButton** — 3 a 6 acciones secundarias colgando de un trigger.",
          "- **SplitButton** — una accion por defecto con variantes de esa misma accion.",
          "- **ButtonGroup** — 2 a 4 opciones exclusivas de vista o filtro. Nunca acciones.",
          "",
          "Anatomia: chevron 10-16 con gap 8. Panel r12, borde 200, sombra md, opciones r8 con hover en superficie 2.",
          "La destructiva va al final, en rojo, tras un divisor.",
          "",
          "Comportamiento: el panel abre abajo-izquierda del trigger con 6 de separacion y cierra al elegir,",
          "al hacer click fuera o con Escape. El chevron gira 180° al abrir.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    size: { control: "inline-radio", options: ["m", "s"] },
    align: { control: "inline-radio", options: ["start", "center", "end"] },
    disabled: { control: "boolean" },
    fullWidth: { control: "boolean" },
    label: { control: "text" },
  },
  args: {
    label: "Acciones",
    children: (
      <>
        <MenuItem>Enviar dinero</MenuItem>
        <MenuItem>Recibir</MenuItem>
        <MenuItem>Escanear QR</MenuItem>
        <MenuSeparator />
        <MenuItem destructive>Cancelar envío</MenuItem>
      </>
    ),
  },
  // El panel flota y necesita sitio por debajo.
  decorators: [
    (Story) => (
      <div className="min-h-[280px] p-2">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MenuButton>;

export const Predeterminado: Story = {};

/** Abierto de salida, para auditar el panel sin interactuar. */
export const Abierto: Story = {
  args: { defaultOpen: true },
  parameters: {
    docs: {
      description: {
        story:
          "Al abrir, el trigger invierte a tinta y el chevron gira 180°. El panel se ancla abajo-izquierda con 6 de separacion.",
      },
    },
  },
};

/** Relleno y borde en 200 con texto en 500. Nunca opacidad sobre el boton. */
export const Deshabilitado: Story = { args: { disabled: true } };

/** El documento solo define M (40). S es una derivacion de la escala de la seccion 03. */
export const Tamanos: Story = {
  name: "Tamaños",
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div className="flex items-center gap-4">
      <MenuButton {...args} size="m" label="M · 40" />
      <MenuButton {...args} size="s" label="S · 32" />
    </div>
  ),
};

/** La destructiva va al final, en rojo, detras de un divisor. */
export const ConAccionDestructiva: Story = {
  name: "Con acción destructiva",
  args: { defaultOpen: true },
  parameters: {
    docs: {
      description: {
        story: [
          "El documento pinta la destructiva con `rgb(255,0,0)` (`--colours-purered-700`), que **no** se redefine",
          "en el bloque `.dark` de Figma. Aqui usamos `--tk-fg-error`, que si invierte y conserva contraste en",
          "los dos temas.",
        ].join(" "),
      },
    },
  },
};

/* ------------------------------------------------------------------------- */

/** Accion por defecto + divisor de 1px (gris 700) + segmento del chevron. */
export const Split: StoryObj = {
  name: "SplitButton",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-start gap-6">
      <SplitButton label="Enviar" onAction={() => {}}>
        <MenuItem>Enviar a bolsillo</MenuItem>
        <MenuItem>Programar envío</MenuItem>
        <MenuItem>Enviar por TikinTag</MenuItem>
      </SplitButton>
      <SplitButton label="Enviar" disabled>
        <MenuItem>Enviar a bolsillo</MenuItem>
      </SplitButton>
    </div>
  ),
};

/** El group siempre tiene exactamente una opcion activa. */
export const Group: StoryObj = {
  name: "ButtonGroup",
  parameters: { controls: { disable: true } },
  render: () => {
    function Demo() {
      const [rango, setRango] = React.useState("dia");
      return (
        <div className="flex flex-col items-start gap-4">
          <ButtonGroup value={rango} onValueChange={setRango} aria-label="Rango temporal">
            <ButtonGroupItem value="dia">Día</ButtonGroupItem>
            <ButtonGroupItem value="semana">Semana</ButtonGroupItem>
            <ButtonGroupItem value="mes">Mes</ButtonGroupItem>
          </ButtonGroup>
          <span className="font-meta text-[11px] tracking-[0.1em] text-ink-500 uppercase">
            valor · {rango}
          </span>
          <ButtonGroup defaultValue="semana" disabled aria-label="Rango deshabilitado">
            <ButtonGroupItem value="dia">Día</ButtonGroupItem>
            <ButtonGroupItem value="semana">Semana</ButtonGroupItem>
            <ButtonGroupItem value="mes">Mes</ButtonGroupItem>
          </ButtonGroup>
        </div>
      );
    }
    return <Demo />;
  },
};

/** Matriz de especificacion del documento: tamaño M · 40. */
export const MatrizDeEstados: StoryObj = {
  name: "Matriz de estados",
  parameters: { controls: { disable: true } },
  decorators: [
    (Story) => (
      // .tk-static congela el tema claro, igual que hace el documento en sus
      // matrices de especificacion.
      <div className="tk-static min-h-[420px] bg-page p-6">
        <Story />
      </div>
    ),
  ],
  render: () => {
    const head = "font-meta text-ink-500 text-left text-[11px] tracking-[0.1em] uppercase";
    const filas = [
      { estado: "default", open: false, disabled: false },
      { estado: "open / activa", open: true, disabled: false },
      { estado: "disabled", open: false, disabled: true },
    ];
    return (
      <table className="border-separate border-spacing-x-6 border-spacing-y-4">
        <thead>
          <tr>
            <th />
            {["menu", "split", "group"].map((c) => (
              <th key={c} className={head}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((f) => (
            <tr key={f.estado}>
              <td className={head}>{f.estado}</td>
              <td>
                <MenuButton
                  label="Acciones"
                  disabled={f.disabled}
                  // El estado "open" se simula SOLO con clases: abrirlo de
                  // verdad desplegaria un panel encima de la matriz, y falsear
                  // data-state/aria-expanded dejaria el arbol de accesibilidad
                  // diciendo que hay un menu desplegado que no existe.
                  // El hover y el pressed del trigger van condicionados a NO
                  // estar abierto, asi que la simulacion tiene que pisarlos
                  // tambien: si no, al pasar el puntero el fondo volveria a
                  // claro con el texto ya en superficie.
                  className={
                    f.open
                      ? [
                          "bg-ink text-surface [&_svg]:rotate-180",
                          "not-data-[state=open]:hover:not-disabled:bg-ink-800",
                          "not-data-[state=open]:active:not-disabled:bg-ink-strong",
                        ].join(" ")
                      : undefined
                  }
                >
                  <MenuItem>Enviar dinero</MenuItem>
                </MenuButton>
              </td>
              <td>
                <SplitButton
                  label="Enviar"
                  disabled={f.disabled}
                  menuClassName={f.open ? "bg-ink-800 [&_svg]:rotate-180" : undefined}
                >
                  <MenuItem>Enviar a bolsillo</MenuItem>
                </SplitButton>
              </td>
              <td>
                <ButtonGroup
                  defaultValue={f.open ? "semana" : "dia"}
                  disabled={f.disabled}
                  aria-label={`Rango ${f.estado}`}
                >
                  <ButtonGroupItem value="dia">Día</ButtonGroupItem>
                  <ButtonGroupItem value="semana">Semana</ButtonGroupItem>
                  <ButtonGroupItem value="mes">Mes</ButtonGroupItem>
                </ButtonGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
};
