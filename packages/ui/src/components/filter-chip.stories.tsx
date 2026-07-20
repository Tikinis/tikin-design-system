import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FilterChip } from "./filter-chip";

const meta = {
  title: "Componentes/FilterChip",
  component: FilterChip,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Seccion 22 · Filter — EXTENSION** construida con los tokens del sistema.",
          "",
          "No viene del archivo de Figma: no hay ningun componente Filter en el export.",
          "El propio documento la etiqueta como extension, asi que no es especificacion aprobada.",
          "",
          "Pasa `options` y el componente monta el filtro entero: el pill disparador y el popover",
          "con su cabecera, la lista marcable y el par LIMPIAR / APLICAR.",
          "Sin `options` es solo el disparador y el panel lo pone el consumidor.",
          "",
          "- **Badge = activos.** El pill en tinta dice cuantos filtros hay puestos; sin filtros, no aparece. Con `options` la cuenta sale sola de los filtros aplicados.",
          "- **Limpiar / Aplicar.** Limpiar deja el grupo en cero sin cerrar; Aplicar confirma y cierra. Lo marcado es un borrador: si el panel se cierra con Escape o con un click fuera, se descarta y el badge no se mueve.",
          "- **Listas cortas.** Con `applyOnSelect` cada marca aplica al instante y el boton APLICAR desaparece.",
          "- **Filter vs tabs.** Filter combina varios criterios a la vez; para una sola dimension con pocas opciones, usa un segmented control.",
          "",
          "Medidas del bloque ESTADOS DEL BOTON: alto 40 · px 16 · gap 8 · radio 999 · icono 16 · label mono 14 con +2% de tracking.",
          "Medidas del panel del bloque EN VIVO: min-width 230 · radio 16 · padding 8 · filas r8 con casilla 20 · acciones de 36 con radio 10.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    open: { control: "boolean" },
    count: { control: { type: "number", min: 0, max: 99 } },
    disabled: { control: "boolean" },
    countLabel: { control: "text" },
    applyOnSelect: { control: "boolean" },
    heading: { control: "text" },
    icon: { control: false },
    options: { control: false },
  },
  args: { children: "Filter" },
} satisfies Meta<typeof FilterChip>;

export default meta;
type Story = StoryObj<typeof meta>;

/* Las mismas cuatro opciones que dibuja el bloque EN VIVO del documento. */
const ESTADOS = [
  { value: "pagado", label: "Pagado" },
  { value: "pendiente", label: "Pendiente" },
  { value: "vencido", label: "Vencido" },
  { value: "anulado", label: "Anulado", disabled: true },
];

export const Default: Story = {};

/** El filtro completo: chip, panel marcable y el par LIMPIAR / APLICAR. */
export const ConPanel: Story = {
  name: "Con panel (completo)",
  args: { options: ESTADOS, heading: "Estado", defaultValue: ["pendiente"] },
  parameters: {
    docs: {
      description: {
        story: [
          "Con `options` el componente monta el popover entero.",
          "Marcar no aplica nada: hasta pulsar APLICAR es un borrador, asi que el badge no se mueve",
          "y un cierre por Escape o por click fuera lo descarta.",
          "LIMPIAR deja el grupo en cero **sin cerrar**.",
        ].join(" "),
      },
    },
  },
};

/** Listas cortas: cada marca aplica al instante y APLICAR no se dibuja. */
export const AplicaAlInstante: Story = {
  name: "Aplica al instante",
  args: { options: ESTADOS, applyOnSelect: true },
  parameters: {
    docs: {
      description: {
        story:
          "Regla del documento: en listas cortas los cambios pueden aplicar al instante y omitir Aplicar. El badge se entera en cuanto se marca y el panel sigue abierto.",
      },
    },
  },
};

/** La seleccion gobernada desde fuera, con el valor aplicado a la vista. */
export const PanelControlado: Story = {
  name: "Panel controlado",
  parameters: { controls: { disable: true } },
  render: () => {
    const [aplicados, setAplicados] = React.useState<string[]>([]);
    return (
      <div className="flex items-center gap-4">
        <FilterChip options={ESTADOS} value={aplicados} onValueChange={setAplicados}>
          Filter
        </FilterChip>
        <span className="font-meta text-[11px] tracking-[0.1em] text-ink-500 uppercase">
          {aplicados.length ? aplicados.join(" · ") : "sin filtros"}
        </span>
      </div>
    );
  },
};

/** Con el popover desplegado: fondo surface-2 y borde de tinta. */
export const Abierto: Story = {
  name: "Abierto (open / active)",
  args: { open: true },
  parameters: {
    docs: {
      description: {
        story:
          'Al pasar `open` el chip pasa a ser un disparador de disclosure: expone `aria-expanded` y `aria-haspopup="dialog"`.',
      },
    },
  },
};

/** El badge en tinta cuenta los filtros puestos. Con cero, no se dibuja. */
export const ConConteo: Story = {
  name: "Con conteo",
  args: { count: 2 },
  parameters: {
    docs: {
      description: {
        story:
          'La cifra va oculta al lector de pantalla y el sentido lo pone un texto paralelo — "2 filtros activos" — porque "FILTER 2" no dice nada. Se sustituye con `countLabel`.',
      },
    },
  },
};

/** Un chip con filtros puestos pero cerrado se dibuja como default, solo con el badge. */
export const ConteoConPopoverCerrado: Story = {
  name: "Conteo con popover cerrado",
  args: { count: 3, open: false },
  parameters: { controls: { disable: true } },
};

/** Fondo surface-2, borde apagado y texto 400. Nunca opacidad sobre el chip entero. */
export const Deshabilitado: Story = { args: { disabled: true } };

/** Sin icono, o con el tuyo. Por defecto es un embudo dibujado a mano. */
export const SinIcono: Story = {
  name: "Sin icono",
  args: { icon: null },
  parameters: {
    docs: {
      description: {
        story:
          "El paquete no depende todavia de Phosphor — la libreria oficial de iconos del sistema — asi que el embudo va dibujado a mano. Pasa `icon` para sustituirlo.",
      },
    },
  },
};

/** El chip gobernado desde fuera: abrir, cerrar y contar. */
export const Interactivo: Story = {
  name: "Interactivo",
  parameters: { controls: { disable: true } },
  render: () => {
    const [abierto, setAbierto] = React.useState(false);
    const [activos, setActivos] = React.useState(2);
    return (
      <div className="flex items-center gap-4">
        <FilterChip open={abierto} count={activos} onClick={() => setAbierto((v) => !v)}>
          Filter
        </FilterChip>
        <button
          type="button"
          className="font-meta text-[11px] tracking-[0.1em] text-ink-500 uppercase underline"
          onClick={() => setActivos((n) => (n + 1) % 4)}
        >
          Cambiar conteo
        </button>
      </div>
    );
  },
};

/** Los cinco estados del bloque "ESTADOS DEL BOTON" del documento. */
export const MatrizDeEstados: Story = {
  name: "Matriz de estados",
  parameters: { controls: { disable: true } },
  render: () => {
    const estados = [
      { label: "default", node: <FilterChip>Filter</FilterChip> },
      // Hover y pressed no se pueden congelar sin CSS extra: se anotan aqui y
      // se comprueban con el puntero sobre el chip de arriba.
      {
        label: "hover · bg surface-2",
        node: <FilterChip className="bg-surface-2">Filter</FilterChip>,
      },
      { label: "open / active", node: <FilterChip open>Filter</FilterChip> },
      { label: "con conteo", node: <FilterChip count={2}>Filter</FilterChip> },
      { label: "disabled", node: <FilterChip disabled>Filter</FilterChip> },
    ];
    return (
      <div className="flex flex-wrap gap-x-5 gap-y-6">
        {estados.map((e) => (
          <div key={e.label} className="flex flex-col items-center gap-2">
            {e.node}
            <span className="font-meta text-[10px] text-ink-500 uppercase">{e.label}</span>
          </div>
        ))}
      </div>
    );
  },
};
