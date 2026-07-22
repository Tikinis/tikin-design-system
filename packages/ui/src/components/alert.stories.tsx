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
          'El rol ARIA sale del tono: `error` y `warning` usan `role="alert"` (asertivo, interrumpe al lector de pantalla); `info` y `success` usan `role="status"`. Se puede sobreescribir con la prop `role`.',
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
    // Mismo trio y mismos textos que el bloque "EN VIVO · DESCARTABLES" del
    // documento (alertDefs): success, warning y error, cada uno descartable y
    // sin accion.
    const AVISOS = [
      {
        id: "success",
        tone: "success",
        title: "Envío completado",
        body: "$250.000 llegaron a $mariarojas · ref TX-4821.",
      },
      {
        id: "warning",
        tone: "warning",
        title: "Verifica tu identidad",
        body: "Para enviar más de $1.000.000 confirma tu documento.",
      },
      {
        id: "error",
        tone: "error",
        title: "No se pudo completar el envío",
        body: "Saldo insuficiente en tu Cuenta Tikin. Recarga e inténtalo.",
      },
    ] as const;

    const [ocultos, setOcultos] = React.useState<string[]>([]);
    const visibles = AVISOS.filter((a) => !ocultos.includes(a.id));
    const activos = visibles.length;

    // Referencias vivas a cada Alert para poder medir su altura al colapsarlo.
    const nodos = React.useRef(new Map<string, HTMLDivElement>());

    // El Alert NO gestiona su visibilidad: el colapso de salida es cosa de quien
    // lo quita de la lista (aqui). Se calca el del prototipo (dismissAlert):
    // opacity 1->0, height real->0 y marginBottom 0->-12 (se traga el gap de 12)
    // en 0.32s con la curva ease-in cubic-bezier(0.4,0,1,1). Se replica con la
    // Web Animations API midiendo offsetHeight igual que el original, y solo se
    // quita del estado cuando la animacion termina para que no salte.
    const quitar = (id: string) => {
      const el = nodos.current.get(id);
      const sinMovimiento =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!el || sinMovimiento || typeof el.animate !== "function") {
        // Con movimiento reducido (o sin soporte) desaparece sin animar.
        setOcultos((prev) => [...prev, id]);
        return;
      }

      const salida = el.animate(
        [
          { opacity: 1, height: `${el.offsetHeight}px`, marginBottom: "0px" },
          { opacity: 0, height: "0px", marginBottom: "-12px" },
        ],
        { duration: 320, easing: "cubic-bezier(0.4,0,1,1)", fill: "forwards" },
      );
      salida.onfinish = () => setOcultos((prev) => [...prev, id]);
    };

    return (
      <div className="flex w-[560px] max-w-full flex-col gap-3">
        <div className="flex items-center gap-3 border-b border-edge pb-2.5">
          <span className="font-mono text-[13px] tracking-[0.14em] text-ink-600 uppercase">
            En vivo · descartables
          </span>
          {/* Contador como en el prototipo: "N activas" o "Todas descartadas",
              en Ubuntu Mono 11 y tinta 500. */}
          <span className="font-meta text-[11px] text-ink-500">
            {activos === 0 ? "Todas descartadas" : `${activos} activas`}
          </span>
          <button
            type="button"
            onClick={() => setOcultos([])}
            disabled={ocultos.length === 0}
            // Activo en tinta plena (var(--tk-ink)); apagado en tinta 400 con
            // cursor por defecto, como restoreColor/restoreCursor del original.
            // Hover surface-2 y pressed edge (data-hover / data-press).
            className="ml-auto inline-flex h-[30px] cursor-pointer items-center gap-1.5 rounded-sm px-3 font-mono text-xs tracking-[0.02em] text-ink uppercase hover:not-disabled:bg-surface-2 active:not-disabled:bg-edge disabled:cursor-default disabled:text-ink-400"
          >
            <svg
              viewBox="0 0 16 16"
              width="12"
              height="12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {/* Flecha circular antihoraria (ph-arrow-counter-clockwise). */}
              <path d="M3.2 8a4.8 4.8 0 1 0 1.5-3.5" />
              <path d="M2.6 2.7v2.4h2.4" />
            </svg>
            Restaurar
          </button>
        </div>

        {visibles.map((a) => (
          <Alert
            key={a.id}
            ref={(node) => {
              if (node) nodos.current.set(a.id, node);
              else nodos.current.delete(a.id);
            }}
            tone={a.tone}
            title={a.title}
            onDismiss={() => quitar(a.id)}
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
 * La accion casi siempre lleva a otra pantalla. Con `asChild` el `AlertAction`
 * presta sus estilos al `<a>` (o al `Link` del router) en vez de renderizar un
 * `<button>`: se conserva el click derecho, el abrir en pestaña nueva y el
 * lector de pantalla anuncia "enlace" y no "boton".
 *
 * El segundo alert muestra el estado `disabled`, que solo existe en la version
 * `<button>`: se usa mientras la accion esta en curso y no debe repetirse.
 */
export const AccionComoEnlace: Story = {
  name: "Acción como enlace",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[560px] max-w-full flex-col gap-3">
      <Alert
        tone="warning"
        title="Verifica tu identidad"
        action={
          <AlertAction asChild>
            <a href="#verificacion">Verificar</a>
          </AlertAction>
        }
      >
        Para enviar más de $1.000.000 necesitas confirmar tu documento.
      </Alert>
      <Alert
        tone="info"
        title="Estamos revisando tu documento"
        action={<AlertAction disabled>Verificar</AlertAction>}
      >
        Te avisamos en cuanto termine la revisión; no hace falta que hagas nada.
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
