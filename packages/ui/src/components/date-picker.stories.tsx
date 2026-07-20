import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DatePicker, type DateRange } from "./date-picker";

/* Fecha fija para que las capturas de Storybook no cambien cada dia. Es el mismo
 * "hoy" que marca el prototipo del documento: 9 de julio de 2026. */
const HOY = new Date(2026, 6, 9);

const meta = {
  title: "Componentes/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Seccion 23 · Date picker — MIXTO.**",
          "",
          "El documento separa las dos procedencias en su bloque *DEL ARCHIVO*:",
          "",
          "- **CANONICO** — las celdas de dia (`Calendar/Day Button`, con variantes default · current · outside · selected), la cabecera de dias (`Calendar/Day Header`) y las flechas de mes (`Calendar/Arrow Button`) existen en el archivo de Figma.",
          "- **EXTENSION** — la banda lima entre extremos, el resumen desde → hasta, los chips de preset, la accion full-width de confirmar y el propio disparador del popover **no** estan en Figma. Son propuestas coherentes con los tokens, no especificacion aprobada.",
          "",
          "Cuando usar cada modo: `single` para una fecha concreta (programar un envio); `range` para reportes y extractos.",
          "",
          "En rango, el primer toque fija el inicio y el segundo el fin; si el segundo es anterior al inicio, el inicio se reinicia.",
          "",
          "Hoy se marca con **borde**, la seleccion con **relleno tinta**. Los dias fuera de mes van en gris 400 y los no elegibles pierden el cursor.",
          "",
          "El teclado sigue el patron de rejilla de fechas: flechas (un dia / una semana), Inicio y Fin (extremos de la semana), RePag y AvPag (mes), Intro o Espacio para elegir. Escape y el cierre al pulsar fuera los aporta Radix Popover.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    mode: { control: "inline-radio", options: ["single", "range"] },
    density: { control: "inline-radio", options: ["comodo", "movil"] },
    confirm: { control: "boolean" },
    disabled: { control: "boolean" },
    weekStartsOn: { control: { type: "number", min: 0, max: 6 } },
    locale: { control: "text" },
    value: { control: false },
    defaultValue: { control: false },
    today: { control: false },
    minDate: { control: false },
    maxDate: { control: false },
    presets: { control: false },
  },
  args: { today: HOY, defaultMonth: HOY },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Una fecha. Toca un dia para elegirlo: se pinta en tinta y el panel cierra. */
export const Simple: Story = {
  args: { defaultOpen: true },
};

/** Sin abrir: asi se ve el disparador en un formulario. */
export const Cerrado: Story = {
  args: { defaultValue: new Date(2026, 6, 12) },
  parameters: {
    docs: {
      description: {
        story:
          "El disparador es EXTENSION — el documento no lo especifica. Es un control de 40 con la metrica de la seccion 03, y se sustituye entero pasando un hijo propio.",
      },
    },
  },
};

/** Extremos en tinta, banda lima entre ambos y resumen desde → hasta arriba. */
export const Rango: Story = {
  args: {
    mode: "range",
    defaultOpen: true,
    defaultValue: { from: new Date(2026, 6, 8), to: new Date(2026, 6, 15) },
  },
  parameters: {
    docs: {
      description: {
        story:
          "La banda lima es EXTENSION sobre las celdas del archivo. El texto de los dias interiores va en `on-accent`, la tinta estable sobre rellenos de acento: la lima es identica en claro y en oscuro.",
      },
    },
  },
};

/** Rango a medias: solo hay inicio, el panel espera el fin y no cierra. */
export const RangoAMedias: Story = {
  name: "Rango a medias",
  args: {
    mode: "range",
    defaultOpen: true,
    defaultValue: { from: new Date(2026, 6, 8), to: null },
  },
};

/** Presets como chips, tal y como los pinta el bloque movil del documento. */
export const ConPresets: Story = {
  name: "Con presets",
  args: {
    mode: "range",
    defaultOpen: true,
    presets: [
      { label: "7 días", range: { from: new Date(2026, 6, 3), to: HOY } },
      { label: "14 días", range: { from: new Date(2026, 5, 26), to: HOY } },
      { label: "30 días", range: { from: new Date(2026, 5, 10), to: HOY } },
      { label: "Este mes", range: { from: new Date(2026, 6, 1), to: new Date(2026, 6, 31) } },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Los presets solo existen en modo rango, y el tipo lo impone: en `single` la prop `presets` es `never`.",
      },
    },
  },
};

/** La seleccion queda en borrador hasta pulsar la accion inferior. */
export const ConConfirmacion: Story = {
  name: "Con confirmación",
  args: { defaultOpen: true, confirm: true, defaultValue: new Date(2026, 6, 12) },
  parameters: {
    docs: {
      description: {
        story:
          "Es el modo del bloque movil — `CONFIRMAR · 12 JUN`. La accion queda apagada mientras la seleccion no esta completa; en rango eso significa hasta que hay fin. El borrador solo vive dentro del panel: el disparador muestra siempre el valor confirmado, y cerrar sin aceptar (Escape o clic fuera) lo descarta.",
      },
    },
  },
};

/** Metrica compacta del bloque "MOVIL · EN SHEET": padding 12/16/16, cabecera 26. */
export const DensidadMovil: Story = {
  name: "Densidad móvil",
  args: {
    mode: "range",
    density: "movil",
    defaultOpen: true,
    confirm: true,
    defaultValue: { from: new Date(2026, 6, 8), to: new Date(2026, 6, 15) },
    presets: [
      { label: "7 días", range: { from: new Date(2026, 6, 3), to: HOY } },
      { label: "14 días", range: { from: new Date(2026, 5, 26), to: HOY } },
      { label: "30 días", range: { from: new Date(2026, 5, 10), to: HOY } },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "El bottom sheet que envuelve a este panel en el documento (grabber incluido) es responsabilidad del componente de dialogo, seccion 21. Aqui solo esta la metrica compacta para que encaje dentro.",
      },
    },
  },
};

/** Fuera de limites: gris 400, sin cursor y sin efecto al pulsar. */
export const ConLimites: Story = {
  name: "Con límites",
  args: {
    defaultOpen: true,
    minDate: new Date(2026, 6, 6),
    maxDate: new Date(2026, 6, 24),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Los dias no elegibles usan `aria-disabled` y no el atributo `disabled`: un boton deshabilitado no recibe foco, y eso dejaria la navegacion por flechas atascada en el primer dia fuera de limites.",
      },
    },
  },
};

/** Veto por dia suelto: aqui, fines de semana. */
export const DiasVetados: Story = {
  name: "Días vetados",
  args: {
    defaultOpen: true,
    isDateDisabled: (d: Date) => d.getDay() === 0 || d.getDay() === 6,
  },
};

/** El disparador lo pone el consumidor; el popover se engancha a el. */
export const DisparadorPropio: Story = {
  name: "Disparador propio",
  parameters: { controls: { disable: true } },
  render: (args) => (
    <DatePicker {...args}>
      <button
        type="button"
        className="cursor-pointer rounded-lg border border-dashed border-edge-2 px-4 py-2 font-sans text-sm text-ink"
      >
        Fecha de envío
      </button>
    </DatePicker>
  ),
};

/** Controlado desde fuera: el estado vive en el consumidor. */
export const Controlado: Story = {
  parameters: { controls: { disable: true } },
  /* Sin `{...args}`: al fijar mode="range" aqui, el spread arrastraria tambien
   * la rama `single` de la union de props y TS no puede reconciliar las dos. */
  render: () => {
    const [rango, setRango] = React.useState<DateRange | null>({
      from: new Date(2026, 6, 8),
      to: new Date(2026, 6, 15),
    });
    const dias = rango?.to
      ? Math.round(
          (Date.UTC(rango.to.getFullYear(), rango.to.getMonth(), rango.to.getDate()) -
            Date.UTC(rango.from.getFullYear(), rango.from.getMonth(), rango.from.getDate())) /
            86_400_000,
        ) + 1
      : null;

    return (
      <div className="flex flex-col gap-3">
        <DatePicker
          mode="range"
          today={HOY}
          defaultMonth={HOY}
          value={rango}
          onValueChange={setRango}
        />
        <p className="font-meta text-[11px] text-ink-600">
          {dias ? `${dias} días seleccionados` : "elige el fin del rango"}
        </p>
      </div>
    );
  },
};

/** Matriz de especificacion: los cuatro estados de celda del archivo, mas la banda. */
export const MatrizDeCeldas: Story = {
  name: "Matriz de celdas",
  parameters: { controls: { disable: true } },
  render: () => {
    const filas = [
      {
        estado: "default",
        origen: "archivo",
        nota: "dia del mes visible, texto en tinta",
      },
      {
        estado: "current",
        origen: "archivo",
        nota: "hoy — borde, no relleno (lo fija el documento)",
      },
      { estado: "outside", origen: "archivo", nota: "fuera de mes, gris 400" },
      { estado: "selected", origen: "archivo", nota: "relleno tinta, texto invertido" },
      { estado: "in-range", origen: "extensión", nota: "banda lima entre extremos" },
      { estado: "disabled", origen: "archivo", nota: "gris 400, sin cursor" },
    ];
    return (
      <table className="border-separate border-spacing-x-6 border-spacing-y-2 text-left">
        <thead>
          <tr>
            {["estado", "origen", "regla"].map((th) => (
              <th
                key={th}
                className="font-meta text-[11px] tracking-[0.1em] text-ink-600 uppercase"
              >
                {th}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila) => (
            <tr key={fila.estado}>
              <td className="font-mono text-[13px] text-ink">{fila.estado}</td>
              <td className="font-meta text-[11px] tracking-[0.1em] text-ink-600 uppercase">
                {fila.origen}
              </td>
              <td className="font-sans text-sm text-ink-700">{fila.nota}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
};

/** Metrica del documento, para contrastarla contra el panel renderizado. */
export const Especificacion: Story = {
  name: "Especificación",
  parameters: { controls: { disable: true } },
  render: () => {
    const medidas: [string, string][] = [
      ["panel", "borde 1 · r16 · padding 18 · ancho 340"],
      ["cabecera de mes", "Funnel Display 500 · 16 · tinta"],
      ["flechas", "32×32 · borde 1 · r8 · icono 15"],
      ["cabecera de días", "alto 28 (26 en móvil) · Ubuntu Mono 10 · gris 500"],
      ["celda", "alto 38 · círculo de 34 · r999 · Ubuntu Sans Mono 13"],
      ["resumen de rango", "Ubuntu Sans Mono 12 · +2% tracking · gris 800"],
      ["badges", "bg tinta · texto surface · r8 · padding 5/10 · mono 12"],
      ["chips de preset", "r999 · padding 6/12 · mono 12 · activo en tinta"],
      ["acción inferior", "alto 48 · r12 · bg tinta · mono 14 · +2% tracking"],
    ];
    return (
      <table className="border-separate border-spacing-x-6 border-spacing-y-2 text-left">
        <tbody>
          {medidas.map(([clave, valor]) => (
            <tr key={clave}>
              <td className="font-meta text-[11px] tracking-[0.1em] text-ink-600 uppercase">
                {clave}
              </td>
              <td className="font-mono text-[13px] text-ink">{valor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
};
