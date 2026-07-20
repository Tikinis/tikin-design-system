import type { Meta, StoryObj } from "@storybook/react-vite";
import { NotificationAction, NotificationItem } from "./notification";

/* Seccion 37 · Notifications — EXTENSION.
 *
 * Las filas se pintan sobre `bg-surface` porque el estado NO LEIDA usa el fondo
 * de pagina ("hueso"): sobre el propio fondo de pagina seria invisible. Es
 * exactamente lo que hace el prototipo del documento, que mete la lista en una
 * tarjeta de superficie. */
const meta: Meta<typeof NotificationItem> = {
  title: "Componentes/NotificationItem",
  component: NotificationItem,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-[480px] rounded-xl border border-edge bg-surface p-4">
        {/* role="list" explicito: el preflight de Tailwind pone list-style:none
            en todo <ul> y con eso Safari/VoiceOver deja de anunciar la lista.
            Como este es el ejemplo canonico de uso, tiene que enseñar la forma
            que si conserva el "lista de N elementos". */}
        <ul role="list" className="flex flex-col gap-2">
          <Story />
        </ul>
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: [
          "**Seccion 37 · Notifications — EXTENSION** construida con la paleta del sistema.",
          "",
          "El documento la etiqueta asi de forma explicita y el export de Figma lo confirma: no existe ningun cuerpo de Notification en el archivo. Las medidas salen del prototipo, **no son especificacion aprobada**.",
          "",
          "- **No leida** — fondo hueso, texto en tinta plena y punto a la derecha. Leidas sin fondo y con el texto atenuado.",
          "- **Icono por tipo** — dinero (verde), seguridad (lavanda), novedad (gris), solicitud (lavanda pleno). El fragmento destacado del texto va en `<strong>`.",
          "- **Tocar = ir** — cada notificacion abre su detalle. Deslizar para marcar leida o archivar es un gesto de plataforma y queda fuera del componente.",
          "",
          'Renderiza un `<li>`: debe vivir dentro de un `<ul role="list">` — el `role` explicito es necesario porque el preflight de Tailwind quita el `list-style` y Safari/VoiceOver dejan de anunciar la lista. El area pulsable es un boton o un enlace real que cubre la fila con `::after`, para que las acciones inline no queden anidadas dentro de otro boton.',
        ].join("\n"),
      },
    },
  },
  argTypes: {
    tone: { control: "inline-radio", options: ["money", "security", "news", "request"] },
    unread: { control: "boolean" },
    time: { control: "text" },
    href: { control: false },
    icon: { control: false },
    actions: { control: false },
  },
  args: {
    tone: "money",
    unread: true,
    time: "2:14 PM",
    children: (
      <>
        <strong>Recibiste $500.000</strong> de María Rojas
      </>
    ),
  },
};

export default meta;
type Story = StoryObj<typeof NotificationItem>;

/** Fondo hueso, texto en tinta plena y punto de tinta a la derecha. */
export const NoLeida: Story = { name: "No leída" };

/** Sin fondo y con el texto atenuado. El punto desaparece. */
export const Leida: Story = {
  args: {
    unread: false,
    tone: "news",
    time: "hace 2 días",
    children: "Invita a un amigo y gana $10.000",
  },
};

/** Seguridad: circulo lavanda con escudo. */
export const Seguridad: Story = {
  args: {
    tone: "security",
    time: "iPhone · Bogotá · 9:02 AM",
    children: <strong>Nuevo inicio de sesión</strong>,
  },
};

/** "Tocar = ir": con `href` la fila entera es un enlace real. */
export const ComoEnlace: Story = {
  name: "Como enlace (tocar = ir)",
  args: { href: "#detalle" },
  parameters: {
    docs: {
      description: {
        story:
          "El anillo de foco rodea la fila completa, no solo el texto. La hora y el estado cuelgan del enlace por `aria-describedby`.",
      },
    },
  },
};

/** Solicitud de dinero: dos acciones inline de 32 de alto. */
export const ConAcciones: Story = {
  name: "Con acciones",
  args: {
    tone: "request",
    time: "12:05 PM",
    children: (
      <>
        <strong>Carlos</strong> te pide $80.000
      </>
    ),
    onSelect: () => {},
    actions: (
      <>
        <NotificationAction>Pagar</NotificationAction>
        <NotificationAction variant="secondary">Rechazar</NotificationAction>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Las acciones viven fuera del area pulsable de la fila: anidar botones dentro de otro boton es HTML invalido y el navegador lo reparienta.",
      },
    },
  },
};

/** Los cuatro tonos, en no leida y en leida. */
export const MatrizDeEspecificacion: Story = {
  name: "Matriz de especificación",
  parameters: { controls: { disable: true } },
  render: () => (
    <>
      {(
        [
          ["money", "Dinero · verde", "Recibiste $500.000 de María Rojas", "2:14 PM"],
          ["security", "Seguridad · lavanda", "Nuevo inicio de sesión", "9:02 AM"],
          ["news", "Novedad · gris", "Invita a un amigo y gana $10.000", "hace 2 días"],
          ["request", "Solicitud · lavanda pleno", "Carlos te pide $80.000", "12:05 PM"],
        ] as const
      ).flatMap(([tone, etiqueta, texto, hora]) =>
        [true, false].map((unread) => (
          <NotificationItem
            key={`${tone}-${String(unread)}`}
            tone={tone}
            unread={unread}
            time={hora}
          >
            <span className="font-meta text-[10px] tracking-[0.1em] text-ink-500 uppercase">
              {etiqueta} · {unread ? "no leída" : "leída"}
            </span>
            <br />
            {texto}
          </NotificationItem>
        )),
      )}
    </>
  ),
};

/** Como se agrupa en pantalla: Hoy / Antes, con el titulo en font-meta 10. */
export const AgrupadaPorTiempo: Story = {
  name: "Agrupada por tiempo",
  parameters: { controls: { disable: true } },
  render: () => (
    <>
      {/* El titulo del grupo NO es un aviso mas: va en un <li
          role="presentation"> con un encabezado dentro. Si fuera un <li>
          normal, el lector lo contaria en el total y diria "elemento 1 de 5,
          Hoy" en vez de anunciarlo como cabecera del grupo. */}
      <li role="presentation">
        <h3 className="px-0.5 font-meta text-[10px] tracking-[0.1em] text-ink-500 uppercase">
          Hoy
        </h3>
      </li>
      <NotificationItem tone="money" unread time="2:14 PM" href="#n1">
        <strong>Recibiste $500.000</strong> de María Rojas
      </NotificationItem>
      <NotificationItem tone="security" unread time="iPhone · Bogotá · 9:02 AM" href="#n2">
        <strong>Nuevo inicio de sesión</strong>
      </NotificationItem>

      <li role="presentation">
        <h3 className="px-0.5 pt-2 font-meta text-[10px] tracking-[0.1em] text-ink-500 uppercase">
          Antes
        </h3>
      </li>
      <NotificationItem tone="news" time="hace 2 días" href="#n3">
        Invita a un amigo y gana $10.000
      </NotificationItem>
      <NotificationItem tone="money" time="ayer" href="#n4">
        ¡Cumpliste tu meta “Viaje”! 🎉
      </NotificationItem>
    </>
  ),
};
