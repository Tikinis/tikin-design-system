import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "./skeleton";

const meta = {
  title: "Componentes/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Seccion 33 · Skeletons — EXTENSION** construida con los grises del sistema.",
          "",
          "Lo etiqueta asi el propio documento. El archivo de Figma no contiene ningun nodo de skeleton — no aparece en `docs/figma-export/components/` — asi que toda la geometria sale del prototipo del documento. No lo cites como especificacion aprobada.",
          "",
          "Reglas de uso del documento:",
          "",
          "- **Misma forma** — el skeleton calca la maqueta final (mismos tamaños y posiciones) para que el contenido no salte al llegar.",
          "- **Shimmer suave** — barrido de 1.4s entre dos grises contiguos; nunca pulsos bruscos. Solo mientras carga; luego cross-fade al contenido.",
          "- **No abusar** — para esperas cortas basta un spinner; el skeleton es para listas y tarjetas que tardan en llegar.",
          "",
          "Se compone: una pantalla de carga es un arbol de `Skeleton` dentro de la misma maqueta que la pantalla real, no un componente aparte. Por eso las medidas van por prop (`width` / `height`), no por escala: son dato calcado de la maqueta.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    shape: { control: "inline-radio", options: ["line", "circle", "block"] },
    animation: { control: "inline-radio", options: ["shimmer", "pulse", "none"] },
    width: { control: "text" },
    height: { control: "text" },
    label: { control: "text" },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

/* Etiqueta mono de los bloques del documento: 11px, tracking .1em, gris 500. */
const rotulo = "font-meta text-ink-500 text-[11px] tracking-[0.1em] uppercase";

export const Basico: Story = {
  name: "Básico",
  args: { width: "45%" },
  decorators: [
    (Story) => (
      <div className="w-[280px]">
        <Story />
      </div>
    ),
  ],
};

/** Tres formas: linea (r6), circulo (50%) y bloque (r10). */
export const Formas: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[280px] flex-col gap-6">
      <div className="flex flex-col gap-3">
        <span className={rotulo}>line</span>
        <Skeleton width="90%" />
      </div>
      <div className="flex flex-col gap-3">
        <span className={rotulo}>circle</span>
        <Skeleton shape="circle" />
      </div>
      <div className="flex flex-col gap-3">
        <span className={rotulo}>block</span>
        <Skeleton shape="block" />
      </div>
    </div>
  ),
};

/** LINEAS · alto 12, anchos 45 / 90 / 70 % — nunca todas del mismo largo. */
export const Lineas: Story = {
  name: "Líneas",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Los anchos desiguales son lo que hace que se lea como parrafo y no como tabla. El documento usa 45 / 90 / 70 %.",
      },
    },
  },
  render: () => (
    <div className="flex w-[240px] flex-col gap-3">
      <span className={rotulo}>líneas</span>
      <Skeleton height={12} width="45%" />
      <Skeleton height={12} width="90%" />
      <Skeleton height={12} width="70%" />
    </div>
  ),
};

/** LISTA · avatar 40 + dos lineas de 10, gap 12 en fila y 6 en columna. */
export const Lista: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "El `label` va UNA sola vez, en el contenedor del grupo. Repetirlo en cada fila haria que el lector anunciase la misma espera cuatro veces.",
      },
    },
  },
  render: () => (
    <div className="flex w-[240px] flex-col gap-[14px]">
      {/* El rotulo va FUERA de la region viva: dentro, el lector lo leeria
          pegado al anuncio ("lista Cargando contactos"). */}
      <span className={rotulo}>lista</span>
      <div className="flex flex-col gap-[14px]" role="status" aria-label="Cargando contactos">
        {[
          ["60%", "40%"],
          ["70%", "35%"],
        ].map(([a, b]) => (
          <div key={a} className="flex items-center gap-3">
            <Skeleton shape="circle" width={40} />
            <div className="flex flex-1 flex-col gap-[6px]">
              <Skeleton height={10} width={a} />
              <Skeleton height={10} width={b} />
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

/** TARJETA · rotulo 10, cifra 26 y bloque 56 con r10, dentro de r16 y padding 18. */
export const Tarjeta: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[240px] flex-col gap-3">
      <span className={rotulo}>tarjeta</span>
      <div className="flex flex-col gap-3 rounded-xl border border-edge p-[18px]">
        <Skeleton height={10} width="40%" />
        <Skeleton height={26} width="60%" />
        <Skeleton shape="block" />
      </div>
    </div>
  ),
};

/** Los cuatro casos extra del documento: tabla, perfil, grafico y boton. */
export const MasCasos: Story = {
  name: "Más casos",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8">
      <div className="flex flex-col gap-[10px]">
        <span className={rotulo}>tabla</span>
        {/* Aqui SI van todas iguales: una tabla tiene columnas alineadas. */}
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} height={10} />
        ))}
      </div>

      <div className="flex flex-col items-center gap-[10px]">
        <span className={`${rotulo} self-start`}>perfil</span>
        <Skeleton shape="circle" width={64} />
        <Skeleton height={12} width="60%" />
        <Skeleton height={10} width="40%" />
      </div>

      <div className="flex flex-col gap-[10px]">
        <span className={rotulo}>gráfico</span>
        <Skeleton shape="block" height={80} />
        <Skeleton height={10} width="50%" />
      </div>

      <div className="flex flex-col gap-[10px]">
        <span className={rotulo}>botón</span>
        {/* r12 = el radio del boton L, no el r10 del bloque generico. */}
        <Skeleton shape="block" height={44} className="rounded-lg" />
      </div>
    </div>
  ),
};

/* El cross-fade NO vive en el componente: solo el consumidor sabe cuando llegan
   los datos. El patron es este — dos capas superpuestas alternando opacidad, con
   el skeleton fuera del flujo para que la altura la fije el contenido real. */
function CrossFade() {
  const [cargando, setCargando] = React.useState(true);

  return (
    <div className="flex flex-wrap items-start gap-4">
      <button
        type="button"
        onClick={() => setCargando((v) => !v)}
        className="h-10 shrink-0 cursor-pointer rounded-md px-[18px] font-mono text-[13px] tracking-[0.02em] text-ink uppercase shadow-[inset_0_0_0_1px_var(--tk-ink)] hover:bg-surface-2"
      >
        {cargando ? "Cargar" : "Reiniciar"}
      </button>

      <div className="relative w-[280px] rounded-xl border border-edge p-[18px]">
        {/* La capa de skeleton solo es region viva MIENTRAS carga. Dejar el
            role="status" puesto tras el fundido deja una region viva anonima y
            vacia en el DOM para siempre; y ya invisible, debe salir tambien del
            arbol de accesibilidad. */}
        <div
          className="pointer-events-none absolute inset-[18px] flex flex-col gap-[14px] transition-opacity duration-300"
          style={{ opacity: cargando ? 1 : 0 }}
          role={cargando ? "status" : undefined}
          aria-label={cargando ? "Cargando perfil" : undefined}
          aria-hidden={cargando ? undefined : true}
        >
          <div className="flex items-center gap-3">
            <Skeleton shape="circle" width={44} />
            <div className="flex flex-1 flex-col gap-[7px]">
              <Skeleton height={11} width="55%" />
              <Skeleton height={10} width="35%" />
            </div>
          </div>
          <Skeleton height={10} width="40%" />
          <Skeleton height={30} width="70%" />
          <Skeleton shape="block" height={44} className="rounded-lg" />
        </div>

        <div
          className="flex flex-col gap-[14px] transition-opacity duration-300"
          style={{ opacity: cargando ? 0 : 1 }}
          aria-hidden={cargando}
        >
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-full bg-lavender font-mono text-sm text-on-accent">
              MR
            </span>
            <div className="flex flex-1 flex-col gap-[2px]">
              <span className="font-display text-[15px] font-medium text-ink">María Rojas</span>
              <span className="text-xs text-ink-600">$mariarojas</span>
            </div>
          </div>
          <span className="font-meta text-[10px] tracking-[0.1em] text-ink-600 uppercase">
            Saldo disponible
          </span>
          <span className="font-num text-[26px] font-medium text-ink">$ 4.250.000</span>
          <span className="flex h-11 items-center justify-center rounded-lg bg-ink font-mono text-sm tracking-[0.02em] text-surface uppercase">
            Enviar
          </span>
        </div>
      </div>
    </div>
  );
}

/** La forma calca 1:1 la del contenido final; al llegar hace cross-fade. */
export const CrossFadeAlContenido: Story = {
  name: "Cross-fade al contenido",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "El componente no lleva prop `loading`: envolver a los hijos obligaria a montar el arbol real antes de que existan los datos. La transicion la orquesta el consumidor superponiendo las dos capas, como aqui.",
      },
    },
  },
  render: () => <CrossFade />,
};

/** Pantallas completas que calcan vistas reales de Tikin. */
export const PantallasCompletas: Story = {
  name: "Pantallas completas",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
      <div className="flex flex-col gap-[14px] rounded-xl border border-edge p-4">
        <span className={rotulo}>home · saldo</span>
        <div className="flex items-center justify-between">
          <Skeleton height={10} width="40%" />
          <Skeleton shape="circle" width={28} />
        </div>
        <Skeleton height={34} width="70%" />
        <div className="flex gap-[10px]">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} shape="block" height={56} className="flex-1 rounded-lg" />
          ))}
        </div>
        <Skeleton height={10} width="50%" />
        <div className="flex items-center gap-[10px]">
          <Skeleton shape="circle" width={36} />
          <div className="flex flex-1 flex-col gap-[6px]">
            <Skeleton height={9} width="55%" />
            <Skeleton height={9} width="35%" />
          </div>
          <Skeleton height={12} width={48} />
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-edge p-4">
        <span className={rotulo}>movimientos</span>
        {[
          ["60%", "38%"],
          ["50%", "30%"],
          ["70%", "42%"],
          ["45%", "28%"],
        ].map(([a, b]) => (
          <div key={a} className="flex items-center gap-[10px]">
            <Skeleton shape="circle" width={38} />
            <div className="flex flex-1 flex-col gap-[6px]">
              <Skeleton height={10} width={a} />
              <Skeleton height={9} width={b} />
            </div>
            <Skeleton height={12} width={52} />
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-[14px] rounded-xl border border-edge p-4">
        <span className={`${rotulo} self-start`}>detalle de movimiento</span>
        <Skeleton shape="circle" width={56} />
        <Skeleton height={28} width="55%" />
        <Skeleton height={10} width="35%" />
        <div className="h-px w-full bg-surface-2" />
        <div className="flex w-full flex-col gap-[10px]">
          {[
            ["30%", "25%"],
            ["35%", "20%"],
            ["28%", "30%"],
          ].map(([a, b]) => (
            <div key={a} className="flex justify-between">
              <Skeleton height={9} width={a} />
              <Skeleton height={9} width={b} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-edge p-4">
        <span className={rotulo}>bolsillos · grid</span>
        <div className="grid grid-cols-2 gap-[10px]">
          {[
            ["70%", "50%"],
            ["60%", "55%"],
            ["65%", "45%"],
            ["72%", "52%"],
          ].map(([a, b]) => (
            <div key={a} className="flex flex-col gap-2 rounded-lg border border-surface-2 p-3">
              <Skeleton shape="block" width={32} height={32} className="rounded-[9px]" />
              <Skeleton height={9} width={a} />
              <Skeleton height={12} width={b} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-[14px] rounded-xl border border-edge p-4">
        <span className={rotulo}>tarjeta</span>
        <Skeleton shape="block" height={120} className="rounded-[14px]" />
        <div className="flex justify-between">
          <Skeleton height={10} width="40%" />
          <Skeleton height={10} width="20%" />
        </div>
        <Skeleton height={10} width="55%" />
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-edge p-4">
        <span className={rotulo}>chat · burbujas</span>
        {/* Radios asimetricos: la esquina que apunta al emisor se queda en 4. */}
        <div className="flex justify-start">
          <Skeleton height={34} width="60%" className="rounded-[14px_14px_14px_4px]" />
        </div>
        <div className="flex justify-end">
          <Skeleton height={44} width="70%" className="rounded-[14px_14px_4px_14px]" />
        </div>
        <div className="flex justify-start">
          <Skeleton height={28} width="45%" className="rounded-[14px_14px_14px_4px]" />
        </div>
      </div>
    </div>
  ),
};

/** Por defecto decorativo. Con `label` pasa a `role="status"`. */
export const AnuncioAccesible: Story = {
  name: "Anuncio accesible",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: [
          "Sin `label` el bloque lleva `aria-hidden`: un lector no debe describir cajas grises.",
          "",
          "Una espera se anuncia UNA vez. El prop `label` es para cuando un solo bloque ES toda la espera (izquierda). Cuando la espera es un grupo, el anuncio va en el div que lo envuelve y los bloques de dentro se quedan decorativos (derecha): poner el `label` en uno de los tres hermanos convertiria a ese en region viva y dejaria a los otros dos mudos.",
        ].join("\n"),
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-10">
      <div className="flex w-[240px] flex-col gap-3">
        <span className={rotulo}>bloque suelto · label</span>
        {/* Un unico bloque es toda la espera: aqui el label si va en el propio
            Skeleton, que se convierte en la region viva. */}
        <Skeleton label="Cargando saldo" height={34} width="70%" />
      </div>

      <div className="flex w-[240px] flex-col gap-3">
        <span className={rotulo}>grupo · contenedor</span>
        <div className="flex flex-col gap-3" role="status" aria-label="Cargando movimientos">
          {/* Sin label: decorativos. El anuncio ya lo hace el contenedor. */}
          <Skeleton height={10} width="60%" />
          <Skeleton height={10} width="90%" />
          <Skeleton height={10} width="70%" />
        </div>
      </div>
    </div>
  ),
};

/** El pulso NO es el default: el documento pide "nunca pulsos bruscos". */
export const Animaciones: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "`shimmer` es el barrido de 1.4s del documento. `pulse` esta solo para superficies estrechas (menos de ~24px) donde el gradiente no llega a apreciarse, y `none` para capturas y snapshots. Las tres respetan `prefers-reduced-motion`, que las deja quietas.",
      },
    },
  },
  render: () => (
    <div className="flex w-[280px] flex-col gap-6">
      {(["shimmer", "pulse", "none"] as const).map((animation) => (
        <div key={animation} className="flex flex-col gap-2">
          <span className={rotulo}>{animation}</span>
          <Skeleton animation={animation} height={12} width="80%" />
        </div>
      ))}
    </div>
  ),
};

/** Matriz de especificacion. `.tk-static` congela el tema claro. */
export const MatrizDeEspecificacion: Story = {
  name: "Matriz de especificación",
  parameters: { controls: { disable: true } },
  render: () => {
    const filas = [
      { shape: "line", medida: "alto 10 · ancho 100%", radio: "6 · xs" },
      { shape: "circle", medida: "40 × 40", radio: "50%" },
      { shape: "block", medida: "alto 56 · ancho 100%", radio: "10 · md" },
    ] as const;
    const th = "font-meta text-ink-500 text-[11px] tracking-[0.1em] uppercase text-left";
    return (
      <table className="tk-static w-[560px] border-separate border-spacing-4 bg-page p-4">
        <thead>
          <tr>
            {["forma", "por defecto", "radio", "muestra"].map((h) => (
              <th key={h} className={th}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map(({ shape, medida, radio }) => (
            <tr key={shape}>
              <td className={th}>{shape}</td>
              <td className="font-num text-[13px] text-ink-700">{medida}</td>
              <td className="font-num text-[13px] text-ink-700">{radio}</td>
              <td className="w-[200px]">
                <Skeleton shape={shape} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
};
