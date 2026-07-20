import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Snackbar, SnackbarProvider, SnackbarViewport, type SnackbarProps } from "./snackbar";

/* No hay decorador con el provider a nivel de meta: las matrices de
 * especificacion necesitan su propio viewport (estatico, en linea) y Radix se
 * queda con el ultimo viewport montado. Cada story trae el suyo y asi ninguna
 * pisa a la otra. Mismo motivo y misma solucion que en toast.stories.tsx. */

const meta = {
  title: "Componentes/Snackbar",
  component: Snackbar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Seccion 39 · Snackbar & undo — EXTENSION construida con los tokens del archivo.**",
          "",
          "El documento lo etiqueta asi de forma explicita: *«Reutiliza la superficie tinta del toast. Extension construida con los tokens del archivo»*. No existe un componente Snackbar en el archivo de Figma — comprobado contra `docs/figma-export/components/` — de modo que esto es una propuesta coherente con el sistema, **no especificacion aprobada**.",
          "",
          "Confirma una accion **reversible** y ofrece deshacerla antes de que sea definitiva. Como el toast, pero siempre con accion y algo mas de tiempo.",
          "",
          "- **Siempre reversible** — la accion se aplica de una vez; el sistema espera a que el snackbar cierre para confirmarla. Si no se puede deshacer (eliminar la cuenta), la respuesta es un **dialogo**, no un snackbar.",
          "- **5–8 segundos** — dura mas que un toast para dar tiempo a reaccionar. La barra lima es la cuenta regresiva y se pausa al pasar el cursor o al entrar el foco.",
          "- **Uno a la vez** — nunca se apilan. Si llega otro, el anterior se cierra y el nuevo entra: remonta el `<Snackbar>` con `key`.",
          "- **Deshacer claro** — la accion va a la derecha. En movil se ancla sobre la barra inferior respetando el safe-area; en web, abajo a la izquierda.",
          "",
          "Sin accion y sin ventana para revertir, lo que toca es un **Toast**, no un snackbar (copiar un $TikinTAG, por ejemplo).",
          "",
          "La superficie es la del Toast — el documento dice literalmente que la reutiliza — y por tanto **no invierte** con el tema: tinta 900 con texto blanco en claro y en oscuro. DESHACER va en lima, que es lo unico que lo separa del mensaje sobre una superficie monocroma. Ver el comentario de cabecera de `snackbar.tsx`.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    countdown: { control: "inline-radio", options: ["bar", "ring", "none"] },
    loading: { control: "boolean" },
    duration: { control: "number" },
    message: { control: "text" },
    description: { control: "text" },
    actionLabel: { control: "text" },
    closeLabel: { control: "text" },
  },
  args: { message: "Movimiento eliminado", actionLabel: "Deshacer" },
} satisfies Meta<typeof Snackbar>;

export default meta;
type Story = StoryObj<typeof meta>;

/* Disparador de la demo interactiva. El `key` que crece en cada pulsacion es la
 * forma de sostener la regla "uno a la vez": remonta la pieza — el anterior se
 * cierra, el nuevo entra — y de paso reinicia el temporizador, que es justo lo
 * que se espera al reemplazar un aviso por otro. */
function Demo({
  etiqueta = "Eliminar movimiento",
  ...props
}: SnackbarProps & { etiqueta?: string }) {
  const [n, setN] = React.useState(0);
  return (
    <SnackbarProvider>
      <button
        type="button"
        onClick={() => setN((v) => v + 1)}
        className="h-10 cursor-pointer rounded-md px-4 font-mono text-sm tracking-[0.02em] text-ink uppercase shadow-[inset_0_0_0_1px_var(--tk-ink)] hover:bg-surface-2"
      >
        {etiqueta}
      </button>
      {n > 0 && <Snackbar key={n} {...props} />}
      <SnackbarViewport />
    </SnackbarProvider>
  );
}

/** El caso base: mensaje en pasado, DESHACER a la derecha, barra de cuenta. */
export const Deshacer: Story = {
  render: (args) => <Demo {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          "Pulsa el boton varias veces seguidas: el snackbar anterior se cierra y el nuevo entra con el plazo entero. Pasa el cursor por encima y la barra se congela — la pausa la manda el temporizador de Radix, no un `:hover` propio, para que la barra y el cierre real nunca se desincronicen.\n\nEsa sincronia incluye el relevo: si el aviso siguiente aparece con el cursor **todavia sobre el viewport**, nace con la barra ya congelada, porque su temporizador tampoco ha arrancado. Empieza a contar cuando el cursor sale, que es cuando Radix lo pone en marcha.",
      },
    },
  },
};

/** Icono leading a 18px cuando el mensaje se apoya en un simbolo. */
export const ConIcono: Story = {
  name: "Con icono",
  args: {
    message: "Cambios guardados",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="m8.2 12.3 2.6 2.6 5-5.8" />
      </svg>
    ),
  },
  render: (args) => <Demo {...args} etiqueta="Guardar cambios" />,
  parameters: {
    docs: {
      description: {
        story:
          "El icono va dibujado a mano en la story porque `packages/ui` no depende de `@phosphor-icons`. En tu app pasa el glifo real de Phosphor por `icon`; el sistema hereda `currentColor` y lo escala a 18.",
      },
    },
  },
};

/** La cuenta como anillo, para cuando la barra inferior estorba. */
export const AnilloDeCuenta: Story = {
  name: "Anillo de cuenta regresiva",
  args: { message: "Bolsillo archivado", countdown: "ring" },
  render: (args) => <Demo {...args} etiqueta="Archivar bolsillo" />,
  parameters: {
    docs: {
      description: {
        story:
          "Anillo de 18 con trazo 3. La circunferencia se calcula (2·π·9 = 56,55) en vez de escribir el 57 redondeado del prototipo, para que el trazo cierre exacto al agotarse el plazo.",
      },
    },
  },
};

/** Dos lineas: el detalle de lo que se ha deshecho va en la segunda. */
export const DosLineas: Story = {
  name: "Dos líneas",
  args: {
    message: "Transferencia cancelada",
    description: "$ 250.000 a $mariarojas",
  },
  render: (args) => <Demo {...args} etiqueta="Cancelar transferencia" />,
};

/** Procesando: spinner, sin accion y sin cuenta. No se cierra solo. */
export const Procesando: Story = {
  args: { message: "Archivando bolsillo…", loading: true },
  render: (args) => <Demo {...args} etiqueta="Archivar bolsillo" />,
  parameters: {
    docs: {
      description: {
        story:
          "Duracion infinita a proposito: todavia no hay nada que deshacer. Lo cierra quien lanzo el proceso, sustituyendolo por un snackbar con accion o por un toast de error.",
      },
    },
  },
};

/** Dos acciones: la secundaria queda apagada a la izquierda de la principal. */
export const DosAcciones: Story = {
  args: {
    message: "No se pudo enviar",
    closeLabel: "Cerrar",
    actionLabel: "Reintentar",
    countdown: "none",
    duration: 8000,
  },
  render: (args) => <Demo {...args} etiqueta="Fallar envío" />,
  parameters: {
    docs: {
      description: {
        story:
          "CERRAR no ejecuta la accion principal: es un `Toast.Close` de Radix, solo cierra. La cuenta se oculta porque un fallo no debe evaporarse mientras el usuario decide; 8 s es el tope del rango del documento.",
      },
    },
  },
};

/* Las matrices apagan el temporizador y sacan el viewport de `fixed` para que
 * los casos convivan en linea. `className` pasa por cn(), asi que
 * tailwind-merge sustituye `fixed` y el centrado. */
const VIEWPORT_ESTATICO = "static translate-x-0 items-start gap-4 p-0 pb-0 max-w-none";

/* Cada celda trae SU PROPIO provider y su propio viewport. No es adorno: Radix
 * portaliza cada toast al ultimo viewport montado de su provider, asi que con
 * uno solo todas las piezas caen en la misma lista y no hay donde intercalar el
 * rotulo. El documento rotula cada caso de la matriz — sin rotulo, la matriz
 * deja de ser documentacion y pasa a ser un monton de snackbars. */
function Celda({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-meta text-[10px] tracking-[0.1em] text-ink-500 uppercase">
        {rotulo}
      </span>
      <SnackbarProvider>
        <SnackbarViewport className={VIEWPORT_ESTATICO} />
        {children}
      </SnackbarProvider>
    </div>
  );
}

const CHECK = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="m8.2 12.3 2.6 2.6 5-5.8" />
  </svg>
);

/* Los seis casos del bloque "VARIANTES · ANATOMIA", con el mismo rotulo que les
 * pone el documento y en el mismo orden. */
const VARIANTES: { rotulo: string; props: SnackbarProps }[] = [
  {
    rotulo: "Texto + acción",
    props: { message: "Movimiento eliminado", actionLabel: "Deshacer" },
  },
  {
    rotulo: "Icono leading",
    props: {
      message: "Cambios guardados",
      actionLabel: "Deshacer",
      countdown: "none",
      icon: CHECK,
    },
  },
  {
    rotulo: "Anillo cuenta regresiva",
    props: { message: "Bolsillo archivado", actionLabel: "Deshacer", countdown: "ring" },
  },
  {
    rotulo: "Dos líneas",
    props: {
      message: "Transferencia cancelada",
      description: "$ 250.000 a $mariarojas",
      actionLabel: "Deshacer",
      countdown: "none",
    },
  },
  {
    rotulo: "Procesando · sin acción",
    props: { message: "Archivando bolsillo…", loading: true },
  },
  {
    rotulo: "Dos acciones",
    props: {
      message: "No se pudo enviar",
      closeLabel: "Cerrar",
      actionLabel: "Reintentar",
      countdown: "none",
    },
  },
];

/** superficie tinta · r12 · padding 12/16 · gap 12 · sans 14 · sombra alta */
export const MatrizDeVariantes: Story = {
  name: "Matriz de variantes",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-6">
      {VARIANTES.map(({ rotulo, props }) => (
        <Celda key={rotulo} rotulo={rotulo}>
          <Snackbar duration={Infinity} {...props} />
        </Celda>
      ))}
    </div>
  ),
};

/* Los estados del boton se congelan por `className` sobre la pieza, apuntando
 * al <button> con una variante arbitraria. Es la unica via: el hover y el
 * pressed reales no se pueden fotografiar en una matriz estatica, y la accion
 * no expone su propio className a traves de la API de `<Snackbar>`. */
const ESTADOS = [
  { etiqueta: "DEFAULT", clase: "" },
  { etiqueta: "HOVER", clase: "[&_button]:bg-[rgba(255,255,255,0.12)]" },
  { etiqueta: "PRESSED", clase: "[&_button]:bg-[rgba(255,255,255,0.22)]" },
  { etiqueta: "FOCUS", clase: "[&_button]:ring-2 [&_button]:ring-lime/60" },
] as const;

/** Los cuatro estados de DESHACER, congelados. */
export const EstadosDeDeshacer: Story = {
  name: "Deshacer · estados",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-6">
      {ESTADOS.map(({ etiqueta, clase }) => (
        <Celda key={etiqueta} rotulo={etiqueta}>
          <Snackbar
            duration={Infinity}
            countdown="none"
            message="Movimiento eliminado"
            actionLabel="Deshacer"
            className={clase}
          />
        </Celda>
      ))}
    </div>
  ),
};

/** Web abajo a la izquierda; movil centrado sobre la barra inferior. */
export const Posicion: Story = {
  name: "Posición",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap gap-6">
      <div className="relative h-[200px] w-[420px] overflow-hidden rounded-xl border border-edge bg-page">
        <span className="absolute top-3 left-4 font-meta text-[11px] tracking-[0.1em] text-ink-500 uppercase">
          Web · abajo a la izquierda
        </span>
        <SnackbarProvider>
          {/* El viewport se ancla al recuadro, no a la ventana. */}
          <SnackbarViewport placement="bottom-left" className="absolute" />
          <Snackbar duration={Infinity} message="Movimiento eliminado" actionLabel="Deshacer" />
        </SnackbarProvider>
      </div>

      <div className="relative h-[200px] w-[320px] overflow-hidden rounded-xl border border-edge bg-page">
        <span className="absolute top-3 left-4 font-meta text-[11px] tracking-[0.1em] text-ink-500 uppercase">
          Móvil · sobre la barra
        </span>
        <SnackbarProvider>
          {/* Con una barra inferior de 64, el snackbar se apoya justo encima
              sin taparla: nunca debe pisar la accion principal. */}
          <SnackbarViewport placement="bottom-center" className="absolute bottom-16" />
          <Snackbar duration={Infinity} message="Bolsillo archivado" actionLabel="Deshacer" />
        </SnackbarProvider>
        <div className="absolute inset-x-0 bottom-0 flex h-16 items-center justify-around border-t border-edge bg-surface font-meta text-[11px] tracking-[0.1em] text-ink-500 uppercase">
          <span>Inicio</span>
          <span>Enviar</span>
          <span>Perfil</span>
        </div>
      </div>
    </div>
  ),
};

/** Cuando SI y cuando NO. Un snackbar solo si la accion se puede revertir. */
export const CuandoUsarlo: Story = {
  name: "Cuándo usarlo",
  parameters: { controls: { disable: true } },
  render: () => {
    const filas = [
      ["Eliminar un movimiento", "Movimiento eliminado", "DESHACER", false],
      ["Archivar un bolsillo", "Bolsillo archivado", "DESHACER", false],
      ["Marcar notificaciones leídas", "12 notificaciones leídas", "DESHACER", false],
      ["Copiar $TikinTAG", "$valentina copiado", "TOAST · SIN ACCIÓN", false],
      ["Eliminar la cuenta", "Acción irreversible", "DIÁLOGO, NO SNACKBAR", true],
    ] as const;
    return (
      <table className="w-full max-w-[720px] border-collapse text-left">
        <thead>
          <tr className="font-meta text-[10px] tracking-[0.1em] text-ink-500 uppercase">
            <th className="pb-2 font-normal">Acción del usuario</th>
            <th className="pb-2 font-normal">Mensaje</th>
            <th className="pb-2 font-normal">Respuesta</th>
          </tr>
        </thead>
        <tbody>
          {filas.map(([accion, mensaje, respuesta, peligro]) => (
            <tr key={accion} className="border-t border-line">
              <td className="py-3 font-sans text-sm text-ink">{accion}</td>
              <td className="py-3 font-sans text-[13.5px] text-ink-700">{mensaje}</td>
              <td
                className={
                  peligro
                    ? "py-3 font-mono text-xs tracking-[0.02em] text-fg-error"
                    : "py-3 font-mono text-xs tracking-[0.02em] text-ink"
                }
              >
                {respuesta}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
};
