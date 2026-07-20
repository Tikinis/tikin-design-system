import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toast, ToastAction, ToastProvider, ToastViewport, type ToastProps } from "./toast";

/* No hay decorador a nivel de meta con el provider: la matriz de especificacion
 * necesita su propio viewport (estatico, en linea) y Radix se queda con el
 * ultimo viewport que se monta. Cada story trae el suyo y asi ninguna pisa a
 * la otra. */

const meta = {
  title: "Componentes/Toast",
  component: Toast,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Seccion 17 · Toast — EXTENSION construida con los tokens del archivo.**",
          "",
          "El documento lo etiqueta asi de forma explicita: no existe un componente Toast en el archivo de Figma, de modo que esto es una propuesta coherente con el sistema, **no especificacion aprobada**.",
          "",
          "Aviso breve y no bloqueante que confirma algo **ya hecho** y se va solo.",
          "",
          "- **Se va solo** — ~2,5 s, o 5 s si lleva accion. Un solo toast a la vez: el nuevo reemplaza al anterior.",
          "- **Tinta + lima** — fondo tinta 900 y texto blanco en los dos temas; lima para lo positivo y para la accion. El rojo solo tiñe el icono de error, nunca el fondo.",
          "- **Toast o dialogo** — toast para confirmar algo reversible. Si hace falta una decision, o hay riesgo, es un dialogo.",
          "",
          "La superficie es la unica del sistema que **no invierte** con el tema: el separador y los acentos del prototipo solo se leen sobre negro. Ver el comentario de cabecera de `toast.tsx`.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    tone: { control: "inline-radio", options: ["neutral", "success", "error", "loading"] },
    duration: { control: "number" },
  },
  args: { children: "Envío completado", tone: "success" },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

/* Disparador de la demo. El `key` que crece en cada pulsacion es la forma de
 * sostener la regla "un solo toast a la vez, el nuevo reemplaza al anterior":
 * remonta el toast, y de paso reinicia el temporizador — que es justo lo que se
 * espera al reemplazar un aviso por otro. */
function Demo({ etiqueta = "MOSTRAR TOAST", ...props }: ToastProps & { etiqueta?: string }) {
  const [n, setN] = React.useState(0);
  return (
    <ToastProvider>
      <button
        type="button"
        onClick={() => setN((v) => v + 1)}
        className="h-11 cursor-pointer rounded-lg bg-ink px-5 font-mono text-sm tracking-[0.02em] text-surface uppercase"
      >
        {etiqueta}
      </button>
      {n > 0 && <Toast key={n} {...props} />}
      <ToastViewport />
    </ToastProvider>
  );
}

/** Confirma algo sin adjetivos: copiado, guardado, enviado. */
export const Neutro: Story = {
  args: { tone: "neutral", children: "$valentina copiado" },
  render: (args) => <Demo {...args} />,
};

/** Check lima. Es el caso mayoritario. */
export const Exito: Story = {
  name: "Éxito",
  args: { tone: "success", children: "Envío completado" },
  render: (args) => <Demo {...args} />,
};

/* Se llama `Fallo` y no `Error` para no ensombrecer el `Error` global dentro
   del modulo. El nombre que se ve en Storybook lo fija `name`. */
/** El rojo tiñe el icono, nunca el fondo. Con accion para reintentar. */
export const Fallo: Story = {
  name: "Error",
  args: {
    tone: "error",
    children: "No se pudo enviar",
    action: <ToastAction altText="Reintentar el envío">Reintentar</ToastAction>,
  },
  render: (args) => <Demo {...args} etiqueta="Fallar envío" />,
};

/** Con accion la duracion sube a 5 s: hay que leerlo Y decidir. */
export const ConAccion: Story = {
  name: "Con acción",
  args: {
    tone: "neutral",
    children: "Movimiento eliminado",
    action: <ToastAction altText="Deshacer el borrado del movimiento">Deshacer</ToastAction>,
  },
  render: (args) => <Demo {...args} etiqueta="Eliminar movimiento" />,
  parameters: {
    docs: {
      description: {
        story:
          "`altText` no es decorativo: es lo que oye quien no puede llegar al boton antes de que el toast se vaya.",
      },
    },
  },
};

/** No se auto-descarta: todavia no hay nada que confirmar. */
export const Cargando: Story = {
  args: { tone: "loading", children: "Enviando dinero…" },
  render: (args) => <Demo {...args} etiqueta="Enviar dinero" />,
  parameters: {
    docs: {
      description: {
        story:
          "Duracion infinita a proposito. Sustituyelo por un toast de exito o de error cuando termine la operacion — no lo dejes colgado.",
      },
    },
  },
};

/* La matriz apaga el temporizador y saca el viewport de `fixed` para que los
 * cinco casos convivan en linea. `className` pasa por cn(), asi que
 * tailwind-merge sustituye `fixed` y la traslacion del centrado. */
const VIEWPORT_ESTATICO = "static translate-x-0 items-start gap-4 max-w-none";

/** tinta 900 · r12 · padding 12/16 · gap 10 · icono 17 · sombra alta */
export const MatrizDeVariantes: Story = {
  name: "Matriz de variantes",
  parameters: { controls: { disable: true } },
  render: () => (
    <ToastProvider>
      <ToastViewport className={VIEWPORT_ESTATICO} />
      <Toast duration={Infinity} tone="neutral">
        $valentina copiado
      </Toast>
      <Toast duration={Infinity} tone="success">
        Envío completado
      </Toast>
      <Toast
        duration={Infinity}
        tone="error"
        action={<ToastAction altText="Reintentar el envío">Reintentar</ToastAction>}
      >
        No se pudo enviar
      </Toast>
      <Toast
        duration={Infinity}
        tone="neutral"
        action={<ToastAction altText="Deshacer el borrado">Deshacer</ToastAction>}
      >
        Movimiento eliminado
      </Toast>
      <Toast duration={Infinity} tone="loading">
        Enviando dinero…
      </Toast>
    </ToastProvider>
  ),
};

/** Abajo-centro, sobre la barra de navegacion. */
export const Posicion: Story = {
  name: "Posición",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="relative h-[200px] w-full max-w-[420px] overflow-hidden rounded-xl border border-edge bg-page">
      <ToastProvider>
        {/* Con una barra inferior de 64 el documento deja el toast a 80 del
            borde. El viewport se ancla al recuadro, no a la ventana. */}
        <ToastViewport className="absolute bottom-20 z-10" />
        <Toast duration={Infinity} tone="success">
          Envío completado
        </Toast>
      </ToastProvider>
      <div className="absolute inset-x-0 bottom-0 flex h-16 items-center justify-around border-t border-edge bg-surface font-meta text-[11px] tracking-[0.1em] text-ink-500 uppercase">
        <span>Inicio</span>
        <span>Enviar</span>
        <span>Perfil</span>
      </div>
    </div>
  ),
};
