import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  List,
  ListItem,
  ListItemAmount,
  ListItemCheck,
  ListItemIcon,
  ListItemValue,
} from "./list-item";

/* Los glifos van inline: el paquete no depende de Phosphor, aunque Phosphor sea
 * la libreria de iconos oficial del sistema. En una app real aqui iria
 * <ArrowDown />, <Bell />, etc. */
const glyph = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d={d}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowDown = glyph("M12 5v14M6 13l6 6 6-6");
const ArrowUp = glyph("M12 19V5M6 11l6-6 6 6");
const Bank = glyph("M3 9.5 12 4l9 5.5M5 10v8m6-8v8m8-8v8M3 20h18");
const Bell = glyph("M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6M10 20a2 2 0 0 0 4 0");
const Globe = glyph(
  "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18",
);
const SignOut = glyph("M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4M10 16l-4-4 4-4M6 12h9");
// Netflix es un concepto, no una persona: en el diseño lleva un icono de TV.
const Television = glyph(
  "M4 8h16a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1ZM9 4l3 4 3-4",
);
// "Ingreso con biometria" muestra una huella en el diseño, no una campana.
const Fingerprint = glyph(
  "M12 11a2 2 0 0 0-2 2v2M9 12a3 3 0 0 1 6 0v3M6.5 12a5.5 5.5 0 0 1 11 0v1",
);
// La fila de ANATOMIA usa un icono de billetera en el diseño.
const Wallet = glyph(
  "M3 8a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v2M3 8v9a2 2 0 0 0 2 2h13a1 1 0 0 0 1-1v-3M21 11v4h-4a2 2 0 0 1 0-4h4",
);

const meta = {
  title: "Componentes/ListItem",
  component: ListItem,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Seccion 45 · List items & filas — EXTENSION** construida con los tokens del archivo.",
          "",
          "El documento lo etiqueta asi en su bajada y el export de Figma lo confirma: no existe ningun cuerpo de `List` ni de `Row` en `docs/figma-export/components/`. Estas medidas son una **propuesta coherente**, no especificacion aprobada.",
          "",
          "La fila es la unidad de las listas de Tikin: movimientos, contactos y ajustes.",
          "",
          "- **Una fila, un tap** — toda la fila es el target y lleva a un destino o alterna un control. El chevron indica navegacion; el toggle, accion inmediata.",
          "- **Leading consistente** — personas con avatar circular (42), conceptos con icono en caja r10 (38). Nunca se mezclan en la misma lista.",
          "- **Cifras a la derecha** — montos en mono; entradas en verde, salidas en tinta. El metadato (fecha, $tag) va bajo el titulo.",
          "",
          'Anatomia: alto 44–68 · padding 14/16 · gap 12 · separador de 1px entre filas, nunca en la ultima. En movil el objetivo tactil sube a `size="lg"` (68).',
        ].join("\n"),
      },
    },
  },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    tone: { control: "inline-radio", options: ["default", "danger"] },
    interactive: { control: "boolean" },
    selected: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: { title: "Titulo de la fila", meta: "Metadato secundario" },
} satisfies Meta<typeof ListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Anatomia: leading 38–42 · titulo 14.5 + metadato 12.5 · trailing mono. */
export const Anatomia: Story = {
  name: "Anatomía",
  render: (args) => (
    <List className="w-[360px]">
      <ListItem
        {...args}
        leading={<ListItemIcon tone="lavender">{Wallet}</ListItemIcon>}
        trailing={<ListItemAmount>$ 120.000</ListItemAmount>}
      />
    </List>
  ),
};

/** Icono direccional · monto mono a la derecha · entradas en verde. */
export const Movimientos: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <List className="w-[360px]">
      <ListItem
        leading={<ListItemIcon tone="success">{ArrowDown}</ListItemIcon>}
        title="María Rojas"
        meta="Hoy · 2:14 PM"
        trailing={<ListItemAmount direction="in">+ $500.000</ListItemAmount>}
        onClick={() => {}}
      />
      <ListItem
        leading={<ListItemIcon>{Television}</ListItemIcon>}
        title="Netflix"
        meta="Ayer · Suscripción"
        trailing={<ListItemAmount direction="out">− $38.900</ListItemAmount>}
        onClick={() => {}}
      />
      <ListItem
        leading={<ListItemIcon tone="success">{Bank}</ListItemIcon>}
        title="Recarga PSE"
        meta="12 jul · Bancolombia"
        trailing={<ListItemAmount direction="in">+ $1.000.000</ListItemAmount>}
        onClick={() => {}}
      />
      <ListItem
        leading={<ListItemIcon>{ArrowUp}</ListItemIcon>}
        title="Carlos Pérez"
        meta="10 jul · Arriendo"
        trailing={<ListItemAmount direction="out">− $850.000</ListItemAmount>}
        onClick={() => {}}
      />
    </List>
  ),
};

/** Avatar de iniciales sobre pastel · check tinta = seleccionado. */
export const ContactosSeleccion: Story = {
  name: "Contactos · selección",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "La fila es el control de seleccion: emite `aria-pressed` y el `ListItemCheck` lee ese estado por contexto, asi que el circulo no puede contradecir a lo que anuncia el lector de pantalla.",
      },
    },
  },
  render: function ContactosSeleccionStory() {
    // Los tres pasteles del diseño: lavanda SI es token del sistema
    // (--colours-lavenderblue-100 === rgb(223,225,255)); el melocoton y el menta
    // NO existen como token, asi que se clavan por className con su rgb literal,
    // que es justo la via que documenta ListItemIcon. Se apoyan en tone="lavender"
    // para heredar text-on-accent (tinta oscura, legible en claro y oscuro, como
    // cualquier acento de marca) sin arrastrar el hover del tono neutro.
    const gente = [
      { id: "mr", nombre: "María Rojas", tag: "$mariarojas", bg: "" },
      { id: "cp", nombre: "Carlos Pérez", tag: "$carlosp", bg: "bg-[rgb(255,230,210)]" },
      { id: "lg", nombre: "Laura Gómez", tag: "$lauragomez", bg: "bg-[rgb(220,240,225)]" },
    ];
    const [elegidos, setElegidos] = React.useState<string[]>(["mr"]);
    return (
      <List className="w-[360px]">
        {gente.map((p) => (
          <ListItem
            key={p.id}
            leading={
              <ListItemIcon tone="lavender" className={p.bg}>
                {p.id}
              </ListItemIcon>
            }
            title={p.nombre}
            meta={p.tag}
            selected={elegidos.includes(p.id)}
            trailing={<ListItemCheck />}
            onClick={() =>
              setElegidos((prev) =>
                prev.includes(p.id) ? prev.filter((x) => x !== p.id) : [...prev, p.id],
              )
            }
          />
        ))}
      </List>
    );
  },
};

/** Icono en caja r10 · control a la derecha: toggle, valor+chevron o accion. */
export const AjustesControles: Story = {
  name: "Ajustes · controles",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Las filas con toggle van `interactive={false}`: el control interno es el unico target, para no dar dos paradas de tabulador a una sola accion.",
      },
    },
  },
  render: function AjustesStory() {
    const [notif, setNotif] = React.useState(true);
    const [bio, setBio] = React.useState(false);
    const Toggle = ({
      on,
      onToggle,
      label,
    }: {
      on: boolean;
      onToggle: () => void;
      label: string;
    }) => (
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={onToggle}
        className={`relative h-[26px] w-11 flex-none rounded-pill transition-colors duration-140 outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-page ${
          on ? "bg-ink" : "bg-edge-2"
        }`}
      >
        <span
          // El knob del toggle del diseño se mueve con muelle (stiffness 680,
          // damping ~20): asentamiento rapido con un pequeño rebase. Se aproxima
          // con un back-out cubic-bezier que sobrepasa y vuelve. Con
          // prefers-reduced-motion salta sin desplazamiento animado.
          className={`absolute top-[3px] size-5 rounded-pill bg-surface transition-[left] duration-[220ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none ${
            on ? "left-[21px]" : "left-[3px]"
          }`}
        />
      </button>
    );
    return (
      <List className="w-[360px]">
        <ListItem
          interactive={false}
          leading={<ListItemIcon shape="box">{Bell}</ListItemIcon>}
          title="Notificaciones"
          trailing={
            <Toggle on={notif} onToggle={() => setNotif((v) => !v)} label="Notificaciones" />
          }
        />
        <ListItem
          interactive={false}
          leading={<ListItemIcon shape="box">{Fingerprint}</ListItemIcon>}
          title="Ingreso con biometría"
          trailing={
            <Toggle on={bio} onToggle={() => setBio((v) => !v)} label="Ingreso con biometría" />
          }
        />
        <ListItem
          leading={<ListItemIcon shape="box">{Globe}</ListItemIcon>}
          title="Idioma"
          trailing={<ListItemValue>Español</ListItemValue>}
          onClick={() => {}}
        />
        <ListItem
          tone="danger"
          leading={
            <ListItemIcon shape="box" tone="error">
              {SignOut}
            </ListItemIcon>
          }
          title="Cerrar sesión"
          onClick={() => {}}
        />
      </List>
    );
  },
};

/** Con asChild la fila entera es el enlace: un solo target, foco del navegador. */
export const ComoEnlace: Story = {
  name: "Como enlace (asChild)",
  parameters: { controls: { disable: true } },
  render: () => (
    <List className="w-[360px]">
      <ListItem
        asChild
        leading={<ListItemIcon tone="success">{ArrowDown}</ListItemIcon>}
        title="María Rojas"
        meta="Hoy · 2:14 PM"
        trailing={<ListItemValue showChevron>Detalle</ListItemValue>}
      >
        <a href="#movimiento-1" />
      </ListItem>
    </List>
  ),
};

/** Deshabilitada: gris 400 y sin reaccion. Nunca opacidad sobre la fila entera. */
export const Deshabilitada: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <List className="w-[360px]">
      <ListItem
        leading={<ListItemIcon shape="box">{Globe}</ListItemIcon>}
        title="Idioma"
        trailing={<ListItemValue>Español</ListItemValue>}
        onClick={() => {}}
      />
      <ListItem
        disabled
        leading={<ListItemIcon shape="box">{Globe}</ListItemIcon>}
        title="Región"
        meta="No disponible en tu país"
        trailing={<ListItemValue>Colombia</ListItemValue>}
        onClick={() => {}}
      />
    </List>
  ),
};

/** Alto 44 / 56 / 68 sin leading. Con avatar o caja el suelo sube: ver abajo. */
export const Tamanos: Story = {
  name: "Tamaños",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: [
          "El `min-height` es un **suelo**, no una altura fija: el tamaño escala tambien el padding vertical, pero un leading de 38 (caja) o 42 (circulo) es mas alto que la caja de texto y empuja la fila por encima de su nominal.",
          "",
          "| size | solo titulo | + caja 38 | + circulo 42 |",
          "| --- | --- | --- | --- |",
          "| `sm` | 44 | 54 | 58 |",
          "| `md` | 56 | 66 | 70 |",
          "| `lg` | 68 | 70 | 74 |",
          "",
          '`md` conserva el padding 14 del prototipo; `lg` sube a 16 para seguir siendo el mas alto tambien con avatar, que es lo que cumple el ">= 64 en movil" del documento.',
        ].join("\n"),
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="font-meta text-[11px] tracking-[0.14em] text-ink-600 uppercase">
          sin leading · 44 / 56 / 68
        </span>
        <List className="w-[360px]">
          {(["sm", "md", "lg"] as const).map((s) => (
            <ListItem
              key={s}
              size={s}
              title={`Tamaño ${s}`}
              trailing={
                <ListItemAmount>{s === "sm" ? "44" : s === "md" ? "56" : "68"}</ListItemAmount>
              }
            />
          ))}
        </List>
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-meta text-[11px] tracking-[0.14em] text-ink-600 uppercase">
          con caja 38 · el leading sube el suelo
        </span>
        <List className="w-[360px]">
          {(["sm", "md", "lg"] as const).map((s) => (
            <ListItem
              key={s}
              size={s}
              leading={<ListItemIcon shape="box">{Bank}</ListItemIcon>}
              title={`Tamaño ${s}`}
              trailing={
                <ListItemAmount>{s === "sm" ? "54" : s === "md" ? "66" : "70"}</ListItemAmount>
              }
            />
          ))}
        </List>
      </div>
    </div>
  ),
};

/** Lista a sangre, sin caja: pantallas completas en movil. */
export const SinCaja: Story = {
  name: "Sin caja (plain)",
  parameters: { controls: { disable: true } },
  render: () => (
    <List variant="plain" className="w-[360px]">
      <ListItem size="lg" title="Perfil" trailing={<ListItemValue />} onClick={() => {}} />
      <ListItem size="lg" title="Seguridad" trailing={<ListItemValue />} onClick={() => {}} />
      <ListItem size="lg" title="Ayuda" trailing={<ListItemValue />} onClick={() => {}} />
    </List>
  ),
};

/** Matriz de especificacion: cada trailing del documento, en las tres piezas. */
export const MatrizDeTrailings: Story = {
  name: "Matriz de trailings",
  parameters: { controls: { disable: true } },
  render: () => {
    const filas = [
      {
        label: "monto entrada",
        trailing: <ListItemAmount direction="in">+ $500.000</ListItemAmount>,
      },
      {
        label: "monto salida",
        trailing: <ListItemAmount direction="out">− $38.900</ListItemAmount>,
      },
      { label: "valor + chevron", trailing: <ListItemValue>Español</ListItemValue> },
      { label: "solo chevron", trailing: <ListItemValue /> },
      { label: "check on", trailing: <ListItemCheck checked /> },
      { label: "check off", trailing: <ListItemCheck checked={false} /> },
    ];
    return (
      <div className="flex w-[420px] flex-col gap-2">
        <span className="font-meta text-[11px] tracking-[0.14em] text-ink-600 uppercase">
          trailing · pieza a la derecha
        </span>
        <List>
          {filas.map((f) => (
            <ListItem
              key={f.label}
              leading={<ListItemIcon shape="box">{Bank}</ListItemIcon>}
              title={f.label}
              trailing={f.trailing}
            />
          ))}
        </List>
      </div>
    );
  },
};

/** Matriz de leading: circulo 42 para personas, caja 38 para conceptos. */
export const MatrizDeLeadings: Story = {
  name: "Matriz de leadings",
  parameters: { controls: { disable: true } },
  render: () => {
    const tones = [
      "neutral",
      "success",
      "warning",
      "error",
      "info",
      "lavender",
      "lime",
      "gold",
    ] as const;
    return (
      <div className="flex flex-col gap-6">
        {(["circle", "box"] as const).map((shape) => (
          <div key={shape} className="flex flex-col gap-3">
            <span className="font-meta text-[11px] tracking-[0.14em] text-ink-600 uppercase">
              {shape === "circle" ? "circle · 42 · personas" : "box · 38 · r10 · conceptos"}
            </span>
            <div className="flex flex-wrap items-center gap-3">
              {tones.map((tone) => (
                <ListItemIcon key={tone} shape={shape} tone={tone} title={tone}>
                  {Bank}
                </ListItemIcon>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  },
};
