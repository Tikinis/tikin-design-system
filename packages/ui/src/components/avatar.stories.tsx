import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, AvatarGroup, type AvatarSize } from "./avatar";

const meta = {
  title: "Componentes/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Seccion 27 · Avatars — EXTENSION.**",
          "",
          "El documento lo etiqueta asi de forma explicita: *extension con la paleta y la mono del sistema*.",
          "No existe ningun componente Avatar en el archivo de Figma, asi que **esto no es especificacion aprobada**:",
          "toda la geometria sale del prototipo del documento.",
          "",
          "Representa a una persona o a un bolsillo. Circulo siempre.",
          "",
          "- **Iniciales** — dos letras (nombre + apellido) en Ubuntu Sans Mono sobre un pastel asignado de forma **estable por el nombre**. Sin foto, nunca se deja vacio.",
          "- **Foto** — siempre recortada en circulo (`cover`). Si no carga, cae a las iniciales.",
          "- **Anillo** — marca «tu» o destacado. **Punto verde** — estado en linea.",
          "- **Grupo** — hasta 3-4 visibles y un `+N`; el borde separa los solapados. Util en dispersion de bonos y destinatarios.",
          "",
          "Dos desviaciones respecto al prototipo, ambas por tema oscuro: el anillo usa `--tk-ink`",
          "(el prototipo usa `--tk-on-accent`, fijo en los dos temas y por tanto invisible en oscuro), y el",
          "«borde blanco» de los solapados se expone como `--tk-avatar-edge`, con `--tk-surface` por defecto.",
          'Sobre el fondo de pagina se corrige con `className="[--tk-avatar-edge:var(--tk-bg)]"`.',
        ].join("\n"),
      },
    },
  },
  argTypes: {
    size: { control: "inline-radio", options: ["xs", "s", "m", "l", "xl"] },
    tone: { control: "inline-radio", options: ["lavender", "lime", "gold", "neutral"] },
    ring: { control: "boolean" },
    online: { control: "boolean" },
    name: { control: "text" },
    src: { control: "text" },
  },
  args: { name: "Valentina Cruz", size: "l" },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Dos letras sobre el pastel que le toca al nombre. Es el caso por defecto. */
export const Iniciales: Story = {};

/** Recortada en circulo con `cover`. Si la URL falla, se ven las iniciales. */
export const Foto: Story = {
  args: { src: "https://i.pravatar.cc/128?img=47" },
  parameters: {
    docs: {
      description: {
        story:
          'La foto va con `alt=""`: el nombre accesible lo pone el circulo entero, para que el lector de pantalla anuncie lo mismo cargue o no la imagen.',
      },
    },
  },
};

/** Sin nombre y sin foto: icono de persona sobre gris de superficie. */
export const Placeholder: Story = {
  args: { name: undefined },
  parameters: {
    docs: {
      description: {
        story:
          "Sin nombre no hay nada que anunciar, asi que el avatar se marca `aria-hidden` y queda como decoracion.",
      },
    },
  },
};

/** El punto verde marca estado en linea. */
export const ConEstado: Story = {
  name: "Con estado",
  args: { online: true },
};

/** El anillo de tinta marca «tu» o destacado. */
export const ConAnillo: Story = {
  name: "Con anillo",
  args: { ring: true },
};

/** 24 / 32 / 40 / 48 / 64 · texto 9 / 11 / 13 / 15 / 20. */
export const Tamanos: Story = {
  name: "Tamaños",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-end gap-6">
      {(
        [
          ["xs", "24"],
          ["s", "32"],
          ["m", "40"],
          ["l", "48"],
          ["xl", "64"],
        ] as const
      ).map(([size, px]) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Avatar name="Valentina Cruz" size={size} />
          <span className="font-meta text-[10px] text-ink-500 uppercase">
            {size} · {px}
          </span>
        </div>
      ))}
    </div>
  ),
};

/** Matriz de especificacion: cada variante en cada tamaño. */
export const MatrizDeEspecificacion: Story = {
  name: "Matriz de especificación",
  parameters: { controls: { disable: true } },
  render: () => {
    const sizes: AvatarSize[] = ["xs", "s", "m", "l", "xl"];
    const filas = [
      { label: "iniciales", props: { name: "Marta Ruiz" } },
      { label: "foto", props: { name: "Marta Ruiz", src: "https://i.pravatar.cc/128?img=32" } },
      { label: "placeholder", props: {} },
      { label: "con estado", props: { name: "Carlos Diaz", online: true } },
      { label: "con anillo", props: { name: "Valentina Cruz", ring: true } },
    ] as const;

    return (
      <table className="border-separate border-spacing-4">
        <thead>
          <tr>
            <th />
            {sizes.map((s) => (
              <th key={s} className="font-meta text-[11px] tracking-[0.1em] text-ink-500 uppercase">
                {s}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila) => (
            <tr key={fila.label}>
              <td className="font-meta text-[11px] tracking-[0.1em] text-ink-500 uppercase">
                {fila.label}
              </td>
              {sizes.map((s) => (
                <td key={s} className="align-middle">
                  <Avatar {...fila.props} size={s} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
};

/** Solapado -12 sobre 40, borde de 2.5 y el contador +N en tinta cierra el grupo. */
export const Grupo: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <AvatarGroup max={3} aria-label="Destinatarios del envío">
      <Avatar name="Marta Ruiz" />
      <Avatar name="Carlos Diaz" />
      <Avatar name="Valentina Cruz" />
      <Avatar name="Ana Lopez" />
      <Avatar name="Bruno Gil" />
      <Avatar name="Diego Paz" />
    </AvatarGroup>
  ),
};

/**
 * El punto de estado sobrevive al solapado: se pinta por encima del avatar
 * siguiente, que es justo el que le tapaba la esquina inferior derecha.
 */
export const GrupoConEstado: Story = {
  name: "Grupo con estado en línea",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Combinacion que el prototipo no dibuja pero que aparece en cuanto una lista de destinatarios marca quien esta conectado. El punto del primero y el del segundo tienen que verse enteros, no solo el del ultimo.",
      },
    },
  },
  render: () => (
    <AvatarGroup max={3} total={7} aria-label="Destinatarios conectados">
      <Avatar name="Marta Ruiz" online />
      <Avatar name="Carlos Diaz" online />
      <Avatar name="Valentina Cruz" />
    </AvatarGroup>
  ),
};

/** Con `total` el contador cuenta el universo real, no los hijos renderizados. */
export const GrupoConTotal: Story = {
  name: "Grupo con total del servidor",
  parameters: { controls: { disable: true } },
  render: () => (
    <AvatarGroup max={3} total={40} aria-label="40 destinatarios">
      <Avatar name="Marta Ruiz" src="https://i.pravatar.cc/128?img=12" />
      <Avatar name="Carlos Diaz" />
      <Avatar name="Valentina Cruz" />
    </AvatarGroup>
  ),
};

/** El grupo en los cinco tamaños: el solapado escala con la caja. */
export const GrupoPorTamano: Story = {
  name: "Grupo por tamaño",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-5">
      {(["xs", "s", "m", "l", "xl"] as const).map((size) => (
        <div key={size} className="flex items-center gap-4">
          <span className="w-8 font-meta text-[11px] text-ink-500 uppercase">{size}</span>
          <AvatarGroup size={size} max={3} total={9} aria-label={`Equipo ${size}`}>
            <Avatar name="Marta Ruiz" />
            <Avatar name="Carlos Diaz" />
            <Avatar name="Valentina Cruz" />
          </AvatarGroup>
        </div>
      ))}
    </div>
  ),
};

/**
 * Sobre el fondo de pagina hay que decirle al grupo de que color es el hueco
 * entre solapados, o el recorte se ve como un halo de tarjeta.
 */
export const GrupoSobreFondoDePagina: Story = {
  name: "Grupo sobre fondo de página",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex gap-10 bg-page p-6">
      <AvatarGroup max={3} total={7} aria-label="Sin corregir">
        <Avatar name="Marta Ruiz" />
        <Avatar name="Carlos Diaz" />
        <Avatar name="Valentina Cruz" />
      </AvatarGroup>
      <AvatarGroup
        max={3}
        total={7}
        aria-label="Corregido"
        className="[--tk-avatar-edge:var(--tk-bg)]"
      >
        <Avatar name="Marta Ruiz" />
        <Avatar name="Carlos Diaz" />
        <Avatar name="Valentina Cruz" />
      </AvatarGroup>
    </div>
  ),
};
