import type { Meta, StoryObj } from "@storybook/react-vite";
import { LoadingOverlay, Spinner } from "./spinner";

const meta = {
  title: "Componentes/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Seccion 41 · Loading states — EXTENSION** construida con la paleta del sistema.",
          "",
          "No lo cites como especificacion aprobada. Figma no tiene componente Spinner ni pantalla de carga; lo unico canonico del tema es el estado Loading del boton, con sus colores (`--button-*-loading`) y un glifo `spinner` de la libreria de iconos — un aspa de radios estatica a 12 (XS y S) o 16 (M y L), sin giro definido.",
          "",
          "Este componente sigue el aro con cabeza de la seccion 41 (0.7s lineal, tamaños 16 / 24 / 40), no el glifo: es la unica de las dos fuentes que especifica la pieza suelta.",
          "",
          "Reglas de uso del documento:",
          "",
          "- **Spinner vs skeleton** — spinner para esperas cortas o sin forma conocida; skeleton para listas y tarjetas que tardan. Nunca los dos juntos.",
          "- **Giro tinta** — aro gris 230 con cabeza en tinta, 0.7s lineal. En superficies oscuras, cabeza blanca (sale sola: `--tk-ink` invierte con el tema).",
          "- **Sin bloquear** — solo la pantalla de arranque cubre todo; el resto carga por secciones para no congelar la interfaz.",
          "",
          "Decisiones conscientes, para que no se descubran por sorpresa:",
          "",
          '- **Los 16 / 24 / 40 son el diametro exterior**, borde incluido (`box-sizing: border-box`). El HTML del prototipo escribe esas cifras en `width`/`height` sin declarar `border-box`, asi que ahi el circulo acaba midiendo 20 / 29 / 46; mandan las etiquetas visibles del documento ("S · 16"), no ese render.',
          "- **`prefers-reduced-motion` ralentiza a 2.1s, no detiene el giro.** Un aro congelado se lee como interfaz rota y deja la espera sin señal alguna. Es movimiento continuo, si — moderado a un tercio de la velocidad y sin parpadeo. Si tu producto exige movimiento cero, tapa el spinner con un texto de espera.",
          "- **`LoadingOverlay` no atrapa el foco ni inertiza el fondo.** Intercepta el raton, pero el tabulador sigue recorriendo lo que hay debajo: marcar el fondo con `inert` mientras dure la carga es responsabilidad de quien monta la capa. Si necesitas semantica modal completa, usa `Modal`.",
          "- **`Button` no reutiliza este `Spinner`.** Pinta su propio aro, hoy a 1s y con la geometria invertida. Son dos piezas distintas; no supongas que coinciden.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    size: { control: "inline-radio", options: ["s", "m", "l"] },
    tone: { control: "inline-radio", options: ["ink", "inverse"] },
    label: { control: "text" },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basico: Story = {
  name: "Básico",
  args: { size: "m" },
};

/** S · 16 (trazo 2) · M · 24 (trazo 2.5) · L · 40 (trazo 3) */
export const Tamanos: Story = {
  name: "Tamaños",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-end gap-8">
      {(["s", "m", "l"] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Spinner size={size} label={null} />
          {/* Mayusculas por CSS, nunca con .toUpperCase(): en JS romperia el
              texto accesible y lo que se copia al portapapeles. */}
          <span className="font-meta text-[10px] text-ink-500 uppercase">
            {size} · {{ s: 16, m: 24, l: 40 }[size]}
          </span>
        </div>
      ))}
    </div>
  ),
};

/** Sobre un relleno de tinta que no sigue al tema: aro al 30%, cabeza plena. */
export const SobreTinta: Story = {
  name: "Sobre tinta (inverse)",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex h-12 w-[180px] items-center justify-center rounded-lg bg-ink-strong">
      <Spinner size="s" tone="inverse" label={null} />
    </div>
  ),
};

/** Spinner S + texto para recargas dentro de una vista. gap 10, mono 13. */
export const Inline: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "El spinner va decorativo (`label={null}`): el texto visible ya dice lo que se esta cargando, y dos anuncios para una sola espera se leen dos veces.",
      },
    },
  },
  render: () => (
    <span className="inline-flex items-center gap-[10px]" role="status" aria-live="polite">
      <Spinner size="s" label={null} />
      <span className="font-mono text-[13px] text-ink-600">Cargando movimientos…</span>
    </span>
  ),
};

/** Carga por secciones: el velo cubre solo el trozo que se recarga. */
export const CapaPorSeccion: Story = {
  name: "Capa por sección",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="relative w-[320px] rounded-xl border border-edge bg-surface p-6">
      <p className="font-sans text-sm text-ink-700">
        Contenido de la seccion que se esta recargando. La capa necesita un ancestro posicionado del
        que colgar.
      </p>
      <LoadingOverlay scope="container" showLabel label="Actualizando…" />
    </div>
  ),
};

/** Pantalla de arranque: wordmark + spinner M, gap 14, fondo de pagina. */
export const PantallaCompleta: Story = {
  name: "Pantalla completa",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Unico caso que cubre todo. Se pinta aqui con `scope="container"` y `portal={false}` para que quepa en el lienzo de la story; en produccion va `scope="screen"`, que se monta en `document.body` para que ningun `transform` de un ancestro lo desancle del viewport.',
      },
    },
  },
  render: () => (
    <div className="relative h-[220px] w-[320px] overflow-hidden rounded-xl border border-edge">
      <LoadingOverlay scope="container" portal={false} brand="tikin" spinnerSize="m" />
    </div>
  ),
};

/** Matriz de especificacion. `.tk-static` congela el tema claro. */
export const MatrizDeEspecificacion: Story = {
  name: "Matriz de especificación",
  parameters: { controls: { disable: true } },
  render: () => {
    const filas = [
      { size: "s", px: 16, trazo: "2" },
      { size: "m", px: 24, trazo: "2.5" },
      { size: "l", px: 40, trazo: "3" },
    ] as const;
    const th = "font-meta text-ink-500 text-[11px] tracking-[0.1em] uppercase text-left";
    return (
      <table className="tk-static border-separate border-spacing-4 bg-page p-4">
        <thead>
          <tr>
            {["tamaño", "px", "trazo", "ink", "inverse"].map((h) => (
              <th key={h} className={th}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map(({ size, px, trazo }) => (
            <tr key={size}>
              <td className={th}>{size}</td>
              <td className="font-num text-[13px] text-ink-700">{px}</td>
              <td className="font-num text-[13px] text-ink-700">{trazo}</td>
              <td>
                <Spinner size={size} label={null} />
              </td>
              <td>
                <span className="flex size-14 items-center justify-center rounded-md bg-ink-strong">
                  <Spinner size={size} tone="inverse" label={null} />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
};
