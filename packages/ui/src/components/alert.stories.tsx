import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert, AlertAction } from "./alert";

const meta = {
  title: "Componentes/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Seccion 25 · Alerts — EXTENSION** construida con la paleta de feedback del sistema.",
          "",
          "El documento la etiqueta explicitamente como extension y el export de Figma lo confirma: no existe ningun cuerpo de Alert en `docs/figma-export/components/`. Estas medidas vienen del prototipo del documento, **no son especificacion aprobada del archivo**.",
          "",
          "- **Alert vs toast** — el alert vive en la pagina y se queda hasta resolverse; el toast confirma algo hecho y desaparece. El alert puede llevar accion.",
          "- **Tint suave** — fondo en el tint del hue, icono en el color pleno, texto en tinta. Sin barra de acento lateral ni fondos saturados.",
          "- **Titulo + mensaje** — titulo en Funnel Display 500, cuerpo en Ubuntu Sans. Accion opcional a la derecha; la X de cerrar solo si el alert es descartable.",
          "",
          "El rol ARIA sale del tono: `error` y `warning` usan `role=\"alert\"` (asertivo, interrumpe al lector de pantalla); `info` y `success` usan `role=\"status\"`. Se puede sobreescribir con la prop `role`.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    tone: { control: "inline-radio", options: ["info", "success", "warning", "error"] },
    title: { control: "text" },
    hideIcon: { control: "boolean" },
    dismissLabel: { control: "text" },
    icon: { control: false },
    action: { control: false },
    onDismiss: { control: false },
  },
  args: {
    title: "Verificación en proceso",
    children: "Tu cuenta estará lista en pocos minutos; te avisamos cuando puedas enviar.",
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Contexto: algo esta pasando y el usuario no tiene que hacer nada todavia. */
export const Info: Story = { args: { tone: "info" } };

/** Acuse de recibo persistente. Si no hace falta que se quede, es un toast. */
export const Success: Story = {
  args: {
    tone: "success",
    title: "Envío completado",
    children: "$250.000 llegaron a $mariarojas · ref TX-4821.",
  },
};

/** Hay algo pendiente que el usuario puede resolver: lleva accion. */
export const Warning: Story = {
  args: {
    tone: "warning",
    title: "Verifica tu identidad",
    children: "Para enviar más de $1.000.000 necesitas confirmar tu documento.",
    action: <AlertAction>Verificar</AlertAction>,
  },
};

/** Algo ha fallado. Usa `role="alert"`: interrumpe al lector de pantalla. */
export const Error: Story = {
  args: {
    tone: "error",
    title: "No se pudo completar el envío",
    children: "Saldo insuficiente en tu Cuenta Tikin. Recarga e inténtalo de nuevo.",
  },
};

/** Sin titulo: solo cuerpo. Para avisos de una linea. */
export const SoloMensaje: Story = {
  name: "Solo mensaje",
  args: { title: undefined, children: "Estamos revisando tu documento." },
};

/** La accion va centrada respecto al bloque de texto; la X, arriba. */
export const ConAccionYCierre: Story = {
  name: "Con acción y cierre",
  args: {
    tone: "warning",
    title: "Verifica tu identidad",
    children: "Para enviar más de $1.000.000 necesitas confirmar tu documento.",
    action: <AlertAction>Verificar</AlertAction>,
    onDismiss: () => {},
  },
};

/**
 * El Alert no gestiona su propia visibilidad: `onDismiss` solo avisa. Quien lo
 * usa decide si desaparece, si se puede restaurar o si vuelve al recargar.
 */
export const Descartables: Story = {
  parameters: { controls: { disable: true } },
  render: function Descartables() {
    const AVISOS = [
      {
        id: "info",
        tone: "info",
        title: "Verificación en proceso",
        body: "Tu cuenta estará lista en pocos minutos; te avisamos cuando puedas enviar.",
      },
      {
        id: "success",
        tone: "success",
        title: "Envío completado",
        body: "$250.000 llegaron a $mariarojas · ref TX-4821.",
      },
      {
        id: "error",
        tone: "error",
        title: "No se pudo completar el envío",
        body: "Saldo insuficiente en tu Cuenta Tikin. Recarga e inténtalo de nuevo.",
      },
    ] as const;

    const [ocultos, setOcultos] = React.useState<string[]>([]);
    const visibles = AVISOS.filter((a) => !ocultos.includes(a.id));

    return (
      <div className="flex w-[560px] max-w-full flex-col gap-3">
        <div className="flex items-center gap-3 border-b border-edge pb-2.5">
          <span className="font-mono text-[13px] tracking-[0.14em] text-ink-600 uppercase">
            En vivo · descartables
          </span>
          <span className="font-meta text-[11px] text-ink-500 tabular-nums">
            {visibles.length}/{AVISOS.length}
          </span>
          <button
            type="button"
            onClick={() => setOcultos([])}
            disabled={ocultos.length === 0}
            className="ml-auto h-[30px] cursor-pointer rounded-sm px-3 font-mono text-xs tracking-[0.02em] text-ink-700 uppercase hover:not-disabled:bg-surface-2 disabled:cursor-not-allowed disabled:text-ink-400"
          >
            Restaurar
          </button>
        </div>

        {visibles.map((a) => (
          <Alert
            key={a.id}
            tone={a.tone}
            title={a.title}
            onDismiss={() => setOcultos((prev) => [...prev, a.id])}
          >
            {a.body}
          </Alert>
        ))}
      </div>
    );
  },
};

/** Matriz de especificacion: los cuatro tonos de la paleta de feedback. */
export const MatrizDeTonos: Story = {
  name: "Matriz de tonos",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[560px] max-w-full flex-col gap-3">
      <Alert tone="info" title="Verificación en proceso">
        Tu cuenta estará lista en pocos minutos; te avisamos cuando puedas enviar.
      </Alert>
      <Alert tone="success" title="Envío completado">
        $250.000 llegaron a $mariarojas · ref TX-4821.
      </Alert>
      <Alert
        tone="warning"
        title="Verifica tu identidad"
        action={<AlertAction>Verificar</AlertAction>}
      >
        Para enviar más de $1.000.000 necesitas confirmar tu documento.
      </Alert>
      <Alert tone="error" title="No se pudo completar el envío" onDismiss={() => {}}>
        Saldo insuficiente en tu Cuenta Tikin. Recarga e inténtalo de nuevo.
      </Alert>
    </div>
  ),
};

/**
 * El cuerpo largo se parte dentro del alert en vez de desbordarlo: la columna
 * de texto lleva `min-w-0`, que es lo que permite a un hijo flex encogerse por
 * debajo de su ancho de contenido.
 */
export const TextoLargo: Story = {
  name: "Texto largo",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-[420px] max-w-full">
      <Alert
        tone="warning"
        title="Verifica tu identidad antes de seguir enviando dinero"
        action={<AlertAction>Verificar</AlertAction>}
        onDismiss={() => {}}
      >
        Para enviar más de $1.000.000 al mes necesitas confirmar tu documento de identidad y una
        selfie. El proceso tarda menos de dos minutos y solo hay que hacerlo una vez.
      </Alert>
    </div>
  ),
};
