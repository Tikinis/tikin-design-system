import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Calendar, CalendarDay, CalendarNavButton, CalendarWeekday } from "./calendar";

/* Todas las stories se anclan a julio de 2026 con `today` y `defaultMonth`. Un
 * calendario que arranca en "hoy" cambiaria de captura cada dia y las revisiones
 * visuales dejarian de servir. */
const JULIO_2026 = new Date(2026, 6, 1);
const HOY = new Date(2026, 6, 9);

const meta = {
  title: "Componentes/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Seccion 13 · Calendario y pickers — MIXTO.**",
          "",
          "Del archivo de Figma vienen TRES piezas sueltas, no un calendario montado:",
          "",
          "| Nodo de Figma | Componente |",
          "| --- | --- |",
          "| `Calendar / Day Button` · 2:156688 · 10 variantes | `CalendarDay` |",
          "| `Calendar / Day Header` · 2:156675 | `CalendarWeekday` |",
          "| `Calendar / Arrow Button` · 2:156649 · 8 variantes | `CalendarNavButton` |",
          "",
          "Esas tres son **CANONICAS**. El montaje del mes, la cabecera con el nombre del mes y toda la",
          "navegacion por teclado son **EXTENSION**: no hay ningun nodo de mes en el archivo y la seccion 13",
          "se limita a instanciar las piezas de arriba. No cites `Calendar` como especificacion aprobada.",
          "",
          "**Geometria canonica** — dia 32x32 r8, texto 14/20 · cabecera 32x21, texto 12/16 · flecha 32x32 r8, glifo 16.",
          "",
          "**Teclado** (patron de rejilla de la APG): un solo dia es tabulable y dentro se anda con las flechas.",
          "Flechas = un dia o una semana · Inicio/Fin = extremos de la semana · AvPag/RePag = un mes",
          "(con Mayusculas, un año) · Enter o Espacio eligen. Cruzar el borde del mes cambia la vista y el",
          "foco sigue al dia.",
          "",
          "Los dias bloqueados **no** usan el atributo `disabled`: siguen siendo enfocables, para que las",
          "flechas no avancen a saltos impredecibles sobre los huecos.",
          "",
          "**Foco** — el archivo dibuja un halo fijo de `3px rgba(163,163,163,.5)`. Aqui se usa el anillo del",
          "sistema (`ring-ink` + offset), el mismo de `Button`: el gris literal no invierte con el tema y se",
          "funde con el relleno de un dia seleccionado, justo donde mas falta hace ver el foco.",
          "",
          "El offset del anillo cuadra con el fondo de pagina. Montado sobre otra superficie — una tarjeta, un",
          "popover — declara `--tk-calendar-bg` en el contenedor y los botones lo heredan:",
          '`<Calendar className="[--tk-calendar-bg:var(--tk-surface)]" />`.',
        ].join("\n"),
      },
    },
  },
  argTypes: {
    weekStartsOn: { control: "inline-radio", options: [0, 1] },
    showOutsideDays: { control: "boolean" },
    locale: { control: "text" },
  },
  args: { defaultMonth: JULIO_2026, today: HOY },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Mes en curso, sin nada elegido. El punto de entrada del teclado es hoy. */
export const PorDefecto: Story = { name: "Por defecto" };

/** Un dia elegido: relleno en tinta (`--base-primary`). */
export const ConSeleccion: Story = {
  name: "Con selección",
  args: { defaultSelected: new Date(2026, 6, 20) },
};

/** Fuera del rango util. Los dias bloqueados siguen enfocables — ver cabecera. */
export const ConRango: Story = {
  name: "Con mínimo y máximo",
  args: {
    minDate: new Date(2026, 6, 6),
    maxDate: new Date(2026, 6, 24),
    defaultSelected: new Date(2026, 6, 15),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Las flechas de mes se apagan cuando el mes destino cae entero fuera de rango. Tambien con `aria-disabled`, no con el atributo: al llegar al tope el foco no se cae al body.",
      },
    },
  },
};

/** Regla propia de bloqueo: aqui, fines de semana fuera. */
export const DiasBloqueados: Story = {
  name: "Días bloqueados",
  args: {
    isDateDisabled: (date: Date) => date.getDay() === 0 || date.getDay() === 6,
  },
};

/** Sin relleno de los meses vecinos. Las siete columnas se conservan. */
export const SinDiasVecinos: Story = {
  name: "Sin días vecinos",
  args: { showOutsideDays: false },
};

/** La semana puede arrancar en domingo (`weekStartsOn={0}`) y el locale cambia los nombres. */
export const OtroCalendario: Story = {
  name: "Semana en domingo · en-US",
  args: { weekStartsOn: 0, locale: "en-US" },
};

/** Controlado: mes y seleccion viven fuera del componente. */
export const Controlado: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    function Demo() {
      const [month, setMonth] = React.useState(JULIO_2026);
      const [selected, setSelected] = React.useState<Date | null>(null);
      return (
        <div className="flex flex-col gap-3">
          <Calendar
            today={HOY}
            month={month}
            onMonthChange={setMonth}
            selected={selected}
            onSelect={setSelected}
          />
          <p className="font-mono text-xs text-ink-600">
            {selected ? selected.toLocaleDateString("es-ES", { dateStyle: "long" }) : "sin fecha"}
          </p>
        </div>
      );
    }
    return <Demo />;
  },
};

/* ------------------------------------------------------------------------ */
/* Matrices de especificacion                                                */
/* ------------------------------------------------------------------------ */

const CELL_LABEL = "font-meta text-ink-500 text-[11px] tracking-[0.1em] uppercase";

/**
 * Las 10 combinaciones del nodo `Calendar / Day Button`.
 *
 * A diferencia de otras matrices del sistema, esta NO se congela con
 * `.tk-static`: sus colores salen de los tokens `--base-*` de Figma, que
 * `.tk-static` no cubre. Se ve con el tema activo de Storybook, que es
 * precisamente donde interesa comprobar que invierten bien.
 */
export const MatrizDeDias: Story = {
  name: "Matriz · Day Button",
  parameters: { controls: { disable: true } },
  render: () => {
    const variants = ["default", "current", "outside"] as const;
    const states = ["default", "selected", "disabled"] as const;
    return (
      <table className="border-separate border-spacing-3">
        <thead>
          <tr>
            <th />
            {states.map((state) => (
              <th key={state} className={CELL_LABEL}>
                {state}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {variants.map((variant) => (
            <tr key={variant}>
              <td className={CELL_LABEL}>{variant}</td>
              {states.map((state) => (
                <td key={state}>
                  <CalendarDay
                    variant={variant}
                    selected={state === "selected"}
                    disabled={state === "disabled"}
                  >
                    12
                  </CalendarDay>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
};

/** Cabecera de columna y flechas, como las dibuja la seccion 13. */
export const PiezasSueltas: Story = {
  name: "Piezas sueltas",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <span className={CELL_LABEL}>Day header · 32 × 21</span>
        <div className="flex gap-1">
          {["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"].map((name) => (
            <CalendarWeekday key={name}>{name}</CalendarWeekday>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className={CELL_LABEL}>Arrow button · 32 × 32 · r8</span>
        <div className="flex items-center gap-2">
          <CalendarNavButton direction="previous" aria-label="Mes anterior" />
          <CalendarNavButton direction="next" aria-label="Mes siguiente" />
          <CalendarNavButton direction="next" disabled aria-label="Mes siguiente (tope)" />
        </div>
      </div>
    </div>
  ),
};
