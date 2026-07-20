import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  LoadMore,
  LoadMoreSentinel,
  Pagination,
  PaginationArrow,
  PaginationBar,
  PaginationItem,
  PaginationJump,
} from "./pagination";

const meta = {
  title: "Componentes/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Sección 28 · Pagination — EXTENSIÓN** (propuesta construida con los tokens del sistema).",
          "",
          "No hay ningún nodo de paginación en el archivo de Figma: el documento lo etiqueta como extensión y aquí se conserva esa distinción. No lo cites como especificación aprobada.",
          "",
          "- **Móvil** — `LoadMore` o `LoadMoreSentinel`, siempre con contador.",
          "- **Web** — paginación numérica para vistas densas: tablas y extractos.",
          "",
          "**Rango corto**: se muestran la primera, la última, la actual y sus vecinas; el resto colapsa con `…` para que la barra no crezca sin límite. Un hueco que taparía una sola página se pinta como número: `…` ocuparía lo mismo y diría menos.",
          "",
          "**Extremos**: «anterior» se apaga en la página 1 y «siguiente» en la última. Nunca desaparecen, solo bajan a gris 400 — y conservan el foco, porque usan `aria-disabled` en lugar del atributo `disabled`.",
          "",
          "**Contador**: la paginación siempre va acompañada de «Mostrando X de Y» o del rango «X–Y de Z» en mono, para dar contexto del total.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    format: { control: "inline-radio", options: ["numbers", "labels", "compact"] },
    siblingCount: { control: { type: "number", min: 0, max: 3 } },
    page: { control: { type: "number", min: 1 } },
    totalPages: { control: { type: "number", min: 0 } },
    onPageChange: { control: false },
    labels: { control: false },
  },
  args: { page: 3, totalPages: 12 },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Numérica: activa en tinta, flechas con borde, el rango se recalcula al saltar. */
export const Numerica: Story = {
  name: "Numérica",
  render: function Numerica(args) {
    const [page, setPage] = React.useState(args.page);
    // El componente es controlado: el estado vive en quien lo usa.
    React.useEffect(() => setPage(args.page), [args.page]);
    return <Pagination {...args} page={page} onPageChange={setPage} />;
  },
};

/** Con la actual en el centro, el rango colapsa por los dos lados. */
export const RangoColapsado: Story = {
  name: "Rango colapsado",
  args: { page: 24, totalPages: 48 },
  parameters: {
    docs: {
      description: {
        story:
          "Primera, última, la actual y una vecina a cada lado. Sube `siblingCount` para ensanchar la ventana.",
      },
    },
  },
};

/** Prev se apaga en la 1 y next en la última: bajan a gris 400, no desaparecen. */
export const Extremos: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="font-meta text-[11px] tracking-[0.14em] text-ink-500 uppercase">
          Primera página · anterior en tope
        </span>
        <Pagination page={1} totalPages={12} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-meta text-[11px] tracking-[0.14em] text-ink-500 uppercase">
          Última página · siguiente en tope
        </span>
        <Pagination page={12} totalPages={12} />
      </div>
    </div>
  ),
};

/** Cuando solo caben dos controles con texto. El label va mayúsculas por CSS. */
export const PrevNextConLabel: Story = {
  name: "Prev / next con label",
  args: { format: "labels" },
};

/** Cuando el ancho es el que manda: la página y el total en una sola caja. */
export const Compacto: Story = {
  args: { format: "compact" },
};

/** Salto directo para listados largos. Se confirma con Enter o al salir. */
export const SaltarAPagina: Story = {
  name: "Saltar a página",
  parameters: { controls: { disable: true } },
  render: function SaltarAPagina() {
    const [page, setPage] = React.useState(3);
    return (
      <div className="flex flex-col gap-4">
        <PaginationJump page={page} totalPages={12} onPageChange={setPage} />
        <p className="font-meta text-[11px] text-ink-500">
          página {page} · escribe un número y pulsa Enter · fuera de rango se satura
        </p>
      </div>
    );
  },
};

/** Pie de tabla: filas por página, rango visible y flechas. */
export const BarraDeRango: Story = {
  name: "Rango + tamaño de página",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "El selector es un `<select>` nativo: en móvil abre la rueda del sistema y en teclado responde a flechas y escritura por prefijo sin una línea de JavaScript.",
      },
    },
  },
  render: function BarraDeRango() {
    const [page, setPage] = React.useState(3);
    const [pageSize, setPageSize] = React.useState(20);
    return (
      <div className="w-[640px] max-w-full">
        <PaginationBar
          page={page}
          pageSize={pageSize}
          total={128}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            // Cambiar el tamaño puede dejar la pagina actual fuera de rango.
            setPage(1);
          }}
        />
      </div>
    );
  },
};

/** Móvil: botón, contador y barra de avance. El contador nunca falta. */
export const CargarMas: Story = {
  name: "Cargar más (móvil)",
  parameters: { controls: { disable: true } },
  render: function CargarMas() {
    const [loaded, setLoaded] = React.useState(20);
    const [loading, setLoading] = React.useState(false);

    const cargar = () => {
      setLoading(true);
      window.setTimeout(() => {
        setLoaded((current) => Math.min(current + 20, 128));
        setLoading(false);
      }, 900);
    };

    return (
      <div className="w-[360px] max-w-full">
        <LoadMore
          loaded={loaded}
          total={128}
          loading={loading}
          onLoadMore={cargar}
          formatCount={(shown, total) => `Mostrando ${shown} de ${total} movimientos`}
        />
      </div>
    );
  },
};

/** Durante la carga el botón conserva el foco: usa aria-busy, no `disabled`. */
export const CargandoMas: Story = {
  name: "Cargando más",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-[360px] max-w-full">
      <LoadMore
        loaded={40}
        total={128}
        loading
        formatCount={(shown, total) => `Mostrando ${shown} de ${total} movimientos`}
      />
    </div>
  ),
};

/** El sentinel al final de la lista dispara la carga al asomar. Sin botón. */
export const ScrollInfinito: Story = {
  name: "Scroll infinito",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Alternativa móvil a `Cargar más`. Elige uno de los dos, nunca los dos a la vez: dos disparadores para la misma carga acaban pidiendo la página por duplicado.",
      },
    },
  },
  render: function ScrollInfinito() {
    const [items, setItems] = React.useState(6);
    const [loading, setLoading] = React.useState(false);

    const cargar = () => {
      if (loading) return;
      setLoading(true);
      window.setTimeout(() => {
        setItems((current) => current + 4);
        setLoading(false);
      }, 900);
    };

    return (
      <div className="flex h-[320px] w-[360px] max-w-full flex-col gap-2.5 overflow-y-auto">
        {Array.from({ length: items }, (_, index) => (
          <div
            key={index}
            className="flex items-center gap-3 rounded-lg border border-surface-2 px-3.5 py-3"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-lavender font-mono text-xs text-on-accent">
              MR
            </span>
            <div className="flex flex-1 flex-col gap-1">
              <div className="h-[9px] w-3/5 rounded-[5px] bg-surface-2" />
              <div className="h-2 w-2/5 rounded bg-surface-2" />
            </div>
          </div>
        ))}
        <LoadMoreSentinel onReachEnd={cargar} loading={loading} hasMore={items < 40} />
      </div>
    );
  },
};

/** Los cuatro estados de la celda y los dos de la flecha, del documento. */
export const EstadosDeCelda: Story = {
  name: "Estados de celda",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "El hover no se puede forzar en una story estática: se reproduce aplicando por `className` el mismo fondo que pinta la pseudoclase.",
      },
    },
  },
  render: () => {
    const celdas = [
      { titulo: "Default", node: <PaginationItem>3</PaginationItem> },
      { titulo: "Hover", node: <PaginationItem className="bg-surface-2">3</PaginationItem> },
      { titulo: "Activa", node: <PaginationItem active>3</PaginationItem> },
      { titulo: "Disabled", node: <PaginationItem disabled>3</PaginationItem> },
    ];
    const flechas = [
      { titulo: "Flecha", node: <PaginationArrow direction="prev" aria-label="Anterior" /> },
      {
        titulo: "Flecha · tope",
        node: <PaginationArrow direction="prev" disabled aria-label="Anterior" />,
      },
    ];

    return (
      <div className="flex flex-wrap items-stretch gap-6">
        {celdas.map((celda) => (
          <div key={celda.titulo} className="flex flex-col items-center gap-2">
            {celda.node}
            <span className="font-meta text-[11px] tracking-[0.14em] text-ink-500 uppercase">
              {celda.titulo}
            </span>
          </div>
        ))}
        <div className="w-px self-stretch bg-line" />
        {flechas.map((flecha) => (
          <div key={flecha.titulo} className="flex flex-col items-center gap-2">
            {flecha.node}
            <span className="font-meta text-[11px] tracking-[0.14em] text-ink-500 uppercase">
              {flecha.titulo}
            </span>
          </div>
        ))}
      </div>
    );
  },
};

/** Matriz de especificación: los seis formatos que dibuja el documento. */
export const MatrizDeFormatos: Story = {
  name: "Matriz de formatos",
  parameters: { controls: { disable: true } },
  render: () => {
    const filas = [
      { titulo: "Numérica · web", node: <Pagination page={3} totalPages={12} /> },
      {
        titulo: "Numérica · rango colapsado por los dos lados",
        node: <Pagination page={24} totalPages={48} />,
      },
      {
        titulo: "Prev / next con label",
        node: <Pagination page={3} totalPages={12} format="labels" />,
      },
      { titulo: "Compacto", node: <Pagination page={3} totalPages={12} format="compact" /> },
      { titulo: "Saltar a página", node: <PaginationJump page={3} totalPages={12} /> },
      {
        titulo: "Rango + tamaño de página",
        node: (
          <div className="w-[640px] max-w-full">
            <PaginationBar page={3} pageSize={20} total={128} onPageSizeChange={() => {}} />
          </div>
        ),
      },
      {
        titulo: "Cargar más · móvil",
        node: (
          <div className="w-[360px] max-w-full">
            <LoadMore
              loaded={40}
              total={128}
              formatCount={(shown, total) => `Mostrando ${shown} de ${total} movimientos`}
            />
          </div>
        ),
      },
      {
        titulo: "Scroll infinito · sentinel",
        node: (
          <div className="w-[360px] max-w-full">
            <LoadMoreSentinel onReachEnd={() => {}} loading />
          </div>
        ),
      },
    ];

    return (
      <div className="flex flex-col gap-8">
        {filas.map((fila) => (
          <div key={fila.titulo} className="flex flex-col gap-3">
            <div className="font-meta text-[11px] tracking-[0.14em] text-ink-500 uppercase">
              {fila.titulo}
            </div>
            {fila.node}
          </div>
        ))}
      </div>
    );
  },
};
