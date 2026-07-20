import type { Meta, StoryObj } from "@storybook/react-vite";
import { EmptyState, EmptyStateAction } from "./empty-state";

/* Los iconos del prototipo son de Phosphor (ph-tray, ph-wallet,
 * ph-magnifying-glass, ph-wifi-slash, ph-check-circle, ph-users). packages/ui
 * no depende de @phosphor-icons y este encargo no puede añadir dependencias,
 * asi que las stories dibujan equivalentes de trazo a mano. En producto se pasa
 * el icono de Phosphor por la prop `icon`. */
const trazo = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const IconoBandeja = () => (
  <svg {...trazo}>
    <path d="M3 15h4l1.5 2.5h7L17 15h4" />
    <path d="M3 15 5.5 5h13L21 15v3a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18Z" />
  </svg>
);

const IconoCartera = () => (
  <svg {...trazo}>
    <path d="M3.5 7.5A1.5 1.5 0 0 1 5 6h13.5v3" />
    <path d="M3.5 7.5v9A1.5 1.5 0 0 0 5 18h14a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 19 8H5a1.5 1.5 0 0 1-1.5-.5Z" />
    <circle cx="16.5" cy="13" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);

const IconoLupa = () => (
  <svg {...trazo}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m15.8 15.8 4 4" />
  </svg>
);

const IconoSinWifi = () => (
  <svg {...trazo}>
    <path d="M4 8.5A15 15 0 0 1 10 6" />
    <path d="M7 12.2a10.5 10.5 0 0 1 3.2-1.7" />
    <path d="M9.9 15.8a5.5 5.5 0 0 1 4.8.6" />
    <circle cx="12" cy="19" r="1.1" fill="currentColor" stroke="none" />
    <path d="M4 4 20 20" />
  </svg>
);

const IconoCheck = () => (
  <svg {...trazo}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="m8.2 12.3 2.6 2.6 5-5" />
  </svg>
);

const IconoContactos = () => (
  <svg {...trazo}>
    <circle cx="9.5" cy="9" r="3.2" />
    <path d="M3.8 18.5a6 6 0 0 1 11.4 0" />
    <path d="M16 6.2a3.2 3.2 0 0 1 0 5.6" />
    <path d="M17.6 14.6a6 6 0 0 1 2.6 3.9" />
  </svg>
);

const IconoMas = () => (
  <svg {...trazo}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const IconoReintentar = () => (
  <svg {...trazo}>
    <path d="M20 12a8 8 0 1 1-2.6-5.9" />
    <path d="M20 4.5V9h-4.5" />
  </svg>
);

/* El tipo va anotado y no inferido con `satisfies`: con `decorators` en el meta,
 * TS intenta nombrar un tipo interno de storybook (TS2742) y falla al emitir
 * declaraciones. La anotacion explicita corta esa inferencia. */
const meta: Meta<typeof EmptyState> = {
  title: "Componentes/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Seccion 32 · Empty states — EXTENSION** construida con la paleta y la tipografia del sistema.",
          "",
          "El documento la etiqueta asi de forma explicita y el export de Figma lo confirma: no existe ningun cuerpo de EmptyState en `docs/figma-export/components/`. Las medidas salen del prototipo del documento, **no** del archivo, asi que esto es una propuesta coherente y no especificacion aprobada.",
          "",
          "- **Explica + actua** — cada vacio dice por que esta vacio y ofrece el siguiente paso. La primera vez es una invitacion, no un error.",
          "- **Icono neutro** — un icono Phosphor en tile suave; el hue solo cambia para error (rojo) o exito (verde). Sin ilustraciones cargadas.",
          "- **Tono** — titulo breve en Funnel, mensaje calido en Sans. Una sola accion primaria; si es error, la accion es reintentar.",
          "",
          "El icono lo aporta quien consume el componente: `packages/ui` no depende de `@phosphor-icons`. Estas stories usan glifos de trazo dibujados a mano.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    tone: { control: "inline-radio", options: ["neutral", "muted", "brand", "success", "error"] },
    headingLevel: { control: "inline-radio", options: [1, 2, 3, 4, 5, 6] },
    bordered: { control: "boolean" },
    announce: { control: "boolean" },
  },
  args: {
    title: "Aún no hay movimientos",
    children: "Cuando envíes o recibas dinero, tus movimientos aparecerán aquí.",
    icon: <IconoBandeja />,
    action: <EmptyStateAction>Enviar dinero</EmptyStateAction>,
  },
  decorators: [
    (Story) => (
      <div className="max-w-[340px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Sin datos todavia: tile neutro y accion de invitacion. */
export const SinMovimientos: Story = { name: "Sin movimientos" };

/** Primera vez. El acento lavanda invita en vez de avisar. */
export const PrimerBolsillo: Story = {
  name: "Primer bolsillo",
  args: {
    tone: "brand",
    icon: <IconoCartera />,
    title: "Crea tu primer bolsillo",
    children: "Aparta plata para una meta y mírala crecer con su propio TikinTAG.",
    action: <EmptyStateAction startIcon={<IconoMas />}>Crear bolsillo</EmptyStateAction>,
  },
};

/** El vacio sustituye a un resultado, por eso va con `announce`. */
export const SinResultados: Story = {
  name: "Sin resultados",
  args: {
    tone: "muted",
    icon: <IconoLupa />,
    title: "Sin resultados",
    children: "No encontramos nada para “valen”. Prueba con otro nombre o TikinTAG.",
    action: <EmptyStateAction variant="quiet">Limpiar búsqueda</EmptyStateAction>,
    announce: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          '`announce` lo convierte en region viva (`role="status"`). Se usa cuando el vacio aparece despues de una accion del usuario y el cambio ocurre lejos del foco.',
      },
    },
  },
};

/** Si es error, la accion es reintentar. Unico caso de hue rojo. */
export const SinConexion: Story = {
  name: "Sin conexión",
  args: {
    tone: "error",
    icon: <IconoSinWifi />,
    title: "Sin conexión",
    children: "No pudimos cargar tus datos. Revisa tu internet e inténtalo otra vez.",
    action: (
      <EmptyStateAction variant="secondary" startIcon={<IconoReintentar />}>
        Reintentar
      </EmptyStateAction>
    ),
    announce: true,
  },
};

/** Vacio de exito: no hay siguiente paso, asi que tampoco hay accion. */
export const TodoAlDia: Story = {
  name: "Todo al día",
  args: {
    tone: "success",
    icon: <IconoCheck />,
    title: "Todo al día",
    children: "No tienes notificaciones nuevas. Te avisamos cuando algo pase.",
    action: undefined,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Un vacio sin siguiente paso no lleva boton. Ofrecer una accion que no lleva a ningun sitio es peor que no ofrecer ninguna.",
      },
    },
  },
};

/** Sin borde, para cuando el vacio ya vive dentro de una tarjeta. */
export const SinBorde: Story = {
  name: "Sin borde",
  args: {
    bordered: false,
    icon: <IconoContactos />,
    title: "Aún no tienes contactos",
    children: "Agrega a alguien por su TikinTAG y envía en segundos.",
    action: <EmptyStateAction startIcon={<IconoMas />}>Agregar contacto</EmptyStateAction>,
  },
};

/** Los cinco tonos del tile. El hue solo cambia para error y exito. */
export const Tonos: Story = {
  name: "Tonos",
  parameters: { controls: { disable: true } },
  decorators: [],
  render: () => (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
      <EmptyState tone="neutral" icon={<IconoBandeja />} title="neutral">
        Superficie 2 con icono en tinta. El vacio por defecto.
      </EmptyState>
      <EmptyState tone="muted" icon={<IconoLupa />} title="muted">
        Mismo tile, icono apagado. El icono es contexto, no protagonista.
      </EmptyState>
      <EmptyState tone="brand" icon={<IconoCartera />} title="brand">
        Acento lavanda. Solo para invitaciones de primera vez.
      </EmptyState>
      <EmptyState tone="success" icon={<IconoCheck />} title="success">
        Verde. Nada pendiente, todo resuelto.
      </EmptyState>
      <EmptyState tone="error" icon={<IconoSinWifi />} title="error">
        Rojo. Algo fallo y la accion es reintentar.
      </EmptyState>
    </div>
  ),
};

/** Matriz de especificacion: las tres acciones del prototipo, alto 40 · r12. */
export const AccionesDeEspecificacion: Story = {
  name: "Acciones · especificación",
  parameters: { controls: { disable: true } },
  decorators: [],
  render: () => {
    const variantes = ["primary", "secondary", "quiet"] as const;
    return (
      <table className="border-separate border-spacing-3">
        <thead>
          <tr>
            <th />
            {variantes.map((v) => (
              <th key={v} className="font-meta text-[11px] tracking-[0.1em] text-ink-500 uppercase">
                {v}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(["default", "con icono", "disabled"] as const).map((estado) => (
            <tr key={estado}>
              <td className="font-meta text-[11px] tracking-[0.1em] text-ink-500 uppercase">
                {estado}
              </td>
              {variantes.map((v) => (
                <td key={v}>
                  <EmptyStateAction
                    variant={v}
                    disabled={estado === "disabled"}
                    startIcon={estado === "con icono" ? <IconoMas /> : undefined}
                  >
                    Label
                  </EmptyStateAction>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
};
