import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  type TableSortDirection,
} from "./table";

const meta = {
  title: "Componentes/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Seccion 29 · Tables — EXTENSION** construida con la tipografia y la paleta del sistema.",
          "",
          "No hay componente Table en el archivo de Figma: esto es una propuesta coherente, **no especificacion aprobada**.",
          "",
          "Tres reglas mandan:",
          "",
          "- **Sin zebra** — filas separadas por una linea de 1px gris 240 y hover en hueso. El encabezado va sobre hueso, mono en MAYUSCULAS.",
          '- **Cifras a la derecha** — montos en DM Mono (`font="num"`) alineados a la derecha; entradas en verde, salidas en tinta. Fecha y estado en mono.',
          "- **Orden y movil** — columnas ordenables con la flecha ↕. En movil la tabla **no se encoje**: se cambia por tarjetas-fila (ver Cards · list row).",
          "",
          "Se renderiza una `<table>` de verdad, no la rejilla de `<div>` del prototipo: sin `thead`/`th[scope]` el lector de pantalla deja de anunciar la columna y no hay donde colgar `aria-sort`.",
          "",
          "Tres densidades, una por juego de medidas del archivo: `default` (dispersion, filas 14/16), `medium` (bloques con seleccion y con total, filas 12/14) y `compact` (filas 8/14).",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    density: { control: "inline-radio", options: ["default", "medium", "compact"] },
    frame: { control: "boolean" },
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

/* Datos de ejemplo, los mismos del documento. */
const dispersion = [
  {
    iniciales: "MR",
    nombre: "María Rojas",
    fecha: "14 JUL",
    estado: "COMPLETADO",
    monto: "+ $500.000",
    entrada: true,
  },
  {
    iniciales: "CD",
    nombre: "Carlos Díaz",
    fecha: "13 JUL",
    estado: "PENDIENTE",
    monto: "– $120.000",
    entrada: false,
  },
  {
    iniciales: "VC",
    nombre: "Valentina Castro",
    fecha: "12 JUL",
    estado: "RECHAZADO",
    monto: "– $80.000",
    entrada: false,
  },
];

/* Avatar de iniciales sobre acento de marca. Los tres acentos (lavender, gold,
 * lime) no invierten con el tema, por eso el texto va en `on-accent`: tinta
 * estable que se lee en ambos modos. */
const avatarTint = ["bg-lavender", "bg-gold", "bg-lime"];

function Avatar({ iniciales, index }: { iniciales: string; index: number }) {
  return (
    <span
      aria-hidden="true"
      className={`flex size-[30px] shrink-0 items-center justify-center rounded-pill font-mono text-[11px] text-on-accent ${avatarTint[index % avatarTint.length]}`}
    >
      {iniciales}
    </span>
  );
}

/* Pildora de estado. En produccion esto es el componente Chip
 * (`variant="feedback"`, `size="xs"`); aqui va en local para que la story de
 * Table no dependa de la API de otro componente mientras se estabiliza. */
const estadoTint: Record<string, string> = {
  COMPLETADO: "bg-tint-success text-fg-success",
  PENDIENTE: "bg-tint-warning text-fg-warning",
  RECHAZADO: "bg-tint-error text-fg-error",
};

function Estado({ children }: { children: string }) {
  return (
    <span
      className={`inline-flex h-5 items-center rounded-pill px-2 font-meta text-[10px] tracking-[0.05em] uppercase ${estadoTint[children]}`}
    >
      {children}
    </span>
  );
}

/** Tabla de dispersion del documento: contacto, fecha, estado y monto. */
export const Dispersion: Story = {
  args: { density: "default", frame: true },
  render: (args) => (
    <div className="w-[720px] max-w-full">
      <Table {...args}>
        <TableCaption visuallyHidden>Dispersión de julio</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Contacto</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead align="right">Monto</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dispersion.map((fila, i) => (
            <TableRow key={fila.nombre}>
              <TableCell>
                <span className="flex items-center gap-2.5">
                  <Avatar iniciales={fila.iniciales} index={i} />
                  {fila.nombre}
                </span>
              </TableCell>
              <TableCell font="mono">{fila.fecha}</TableCell>
              <TableCell>
                <Estado>{fila.estado}</Estado>
              </TableCell>
              <TableCell font="num" tone={fila.entrada ? "success" : "default"}>
                {fila.monto}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
};

/** Bloque "COMPACTA · DENSA": padding 8/14, texto 13 y mono 12. */
export const Compacta: Story = {
  name: "Compacta · densa",
  args: { density: "compact" },
  render: (args) => (
    <div className="w-[520px] max-w-full">
      <Table {...args}>
        <TableCaption visuallyHidden>Movimientos</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50%]">Concepto</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead align="right">Monto</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Recarga celular</TableCell>
            <TableCell font="mono">14 JUL</TableCell>
            <TableCell font="num">– $20.000</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Pago PSE</TableCell>
            <TableCell font="mono">13 JUL</TableCell>
            <TableCell font="num">– $95.000</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Aporte bolsillo</TableCell>
            <TableCell font="mono">12 JUL</TableCell>
            <TableCell font="num" tone="success">
              + $200.000
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
};

/* El estado vive en un componente con nombre propio, no dentro de `render`:
 * un hook en una funcion en minusculas rompe las reglas de hooks de React. */
function OrdenableDemo() {
  const [dir, setDir] = React.useState<TableSortDirection | undefined>("desc");
  const filas = [...dispersion].sort((a, b) =>
    dir === undefined
      ? 0
      : dir === "asc"
        ? a.fecha.localeCompare(b.fecha)
        : b.fecha.localeCompare(a.fecha),
  );

  return (
    <div className="w-[560px] max-w-full">
      <Table>
        <TableCaption visuallyHidden>Dispersión ordenable por fecha</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[55%]">Contacto</TableHead>
            <TableHead
              sortable
              sortDirection={dir}
              onSort={() => setDir((d) => (d === "asc" ? "desc" : "asc"))}
            >
              Fecha
            </TableHead>
            <TableHead align="right">Monto</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filas.map((fila) => (
            <TableRow key={fila.nombre}>
              <TableCell>{fila.nombre}</TableCell>
              <TableCell font="mono">{fila.fecha}</TableCell>
              <TableCell font="num" tone={fila.entrada ? "success" : "default"}>
                {fila.monto}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

/** Columnas ordenables: la flecha ↕ pasa a ↑ o ↓ y el `th` publica `aria-sort`. */
export const Ordenable: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "El componente no ordena: avisa por `onSort` y refleja `sortDirection`. El rotulo es un `<button>` real, asi que Tab, Enter y Espacio funcionan sin codigo extra.",
      },
    },
  },
  render: () => <OrdenableDemo />,
};

function SeleccionDemo() {
  const filas = [
    { nombre: "María Rojas", monto: "$120.000" },
    { nombre: "Carlos Díaz", monto: "$90.000" },
  ];
  const [marcadas, setMarcadas] = React.useState<string[]>(["María Rojas"]);
  const todas = marcadas.length === filas.length;

  return (
    <div className="w-[560px] max-w-full">
      {/* density="medium" es el juego de medidas de este bloque en el archivo:
          cabecera 10/14 con texto de 9px y filas de 12/14. */}
      <Table density="medium">
        <TableCaption visuallyHidden>Destinatarios del envío</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-6">
              <input
                type="checkbox"
                className="size-[18px] align-middle accent-[var(--tk-ink)]"
                aria-label="Seleccionar todo"
                checked={todas}
                // El indeterminate solo existe como propiedad del DOM.
                ref={(el) => {
                  if (el) el.indeterminate = marcadas.length > 0 && !todas;
                }}
                onChange={() => setMarcadas(todas ? [] : filas.map((f) => f.nombre))}
              />
            </TableHead>
            <TableHead>Destinatario</TableHead>
            <TableHead align="right">Monto</TableHead>
            <TableHead className="w-10">
              <span className="sr-only">Acciones</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filas.map((fila) => {
            const marcada = marcadas.includes(fila.nombre);
            return (
              <TableRow key={fila.nombre} selected={marcada}>
                <TableCell>
                  <input
                    type="checkbox"
                    className="size-[18px] align-middle accent-[var(--tk-ink)]"
                    aria-label={`Seleccionar ${fila.nombre}`}
                    checked={marcada}
                    onChange={() =>
                      setMarcadas((prev) =>
                        marcada ? prev.filter((n) => n !== fila.nombre) : [...prev, fila.nombre],
                      )
                    }
                  />
                </TableCell>
                {/* El nombre es la cabecera de SU fila: un <th scope="row">
                    hace que el lector diga "María Rojas, MONTO, 120.000" en vez
                    de leer cifras sueltas. Fuera del thead se pinta como celda,
                    no como rotulo de columna. */}
                <TableHead>{fila.nombre}</TableHead>
                <TableCell font="num">{fila.monto}</TableCell>
                <TableCell align="right">
                  <button
                    type="button"
                    aria-label={`Acciones de ${fila.nombre}`}
                    className="cursor-pointer rounded-xs px-1 text-lg leading-none text-ink-600 outline-none hover:text-ink focus-visible:ring-2 focus-visible:ring-ink"
                  >
                    ···
                  </button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

/** Bloque "CON SELECCION & ACCIONES": casilla a la izquierda, acciones a la derecha. */
export const ConSeleccion: Story = {
  name: "Con selección y acciones",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "La casilla es un `<input>` nativo a proposito: en produccion va el componente Checkbox del sistema, pero esta story no debe depender de la API de otro componente. `selected` en la fila pinta el fondo y publica `aria-selected`.",
      },
    },
  },
  render: () => <SeleccionDemo />,
};

/** Bloque "CON TOTAL": el resumen va en `tfoot`, con linea de 2px en tinta. */
export const ConTotal: Story = {
  name: "Con total",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-[480px] max-w-full">
      {/* Filas de 12 en vertical, como el bloque del archivo; el pie no se
          comprime con la densidad y mantiene su 14/16 y su DM Mono 16. */}
      <Table density="medium">
        <TableCaption visuallyHidden>Resumen del envío</TableCaption>
        <TableBody>
          <TableRow hover={false}>
            <TableCell>Envíos</TableCell>
            <TableCell font="num">$1.240.000</TableCell>
          </TableRow>
          <TableRow hover={false}>
            <TableCell>Comisiones</TableCell>
            <TableCell font="num" tone="success">
              $0
            </TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell font="num">$1.240.000</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  ),
};

/** Sin marco: para tablas que ya viven dentro de una Card con su propio borde. */
export const SinMarco: Story = {
  name: "Sin marco",
  args: { frame: false },
  render: (args) => (
    <div className="w-[480px] max-w-full rounded-2xl border border-edge bg-surface p-6">
      <Table {...args}>
        <TableCaption>Extracto</TableCaption>
        <TableBody>
          <TableRow>
            <TableCell>Recarga celular</TableCell>
            <TableCell font="num">– $20.000</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Pago PSE</TableCell>
            <TableCell font="num">– $95.000</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
};

/**
 * Rotulo de bloque como lo pinta el archivo: fuera del marco, en Ubuntu Sans
 * Mono con linea inferior, y el `caption` oculto para que la tabla conserve su
 * nombre accesible.
 */
export const RotuloDeBloque: Story = {
  name: "Rótulo de bloque",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Un `TableCaption` visible cae DENTRO del marco: el `<caption>` es parte de la `<table>` y el borde lo dibuja el contenedor. Cuando el rotulo tiene que ir fuera —como en el archivo— se escribe como elemento propio encima de la tabla y el caption se deja en `visuallyHidden`.",
      },
    },
  },
  render: () => (
    <div className="flex w-[520px] max-w-full flex-col gap-3.5">
      <div className="border-b border-edge pb-2.5 font-mono text-[13px] tracking-[0.14em] text-ink-600 uppercase">
        Compacta · densa
      </div>
      <Table density="compact">
        <TableCaption visuallyHidden>Movimientos</TableCaption>
        <TableBody>
          <TableRow hover={false}>
            <TableCell>Recarga celular</TableCell>
            <TableCell font="num">– $20.000</TableCell>
          </TableRow>
          <TableRow hover={false}>
            <TableCell>Pago PSE</TableCell>
            <TableCell font="num">– $95.000</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
};

/** Matriz de especificacion: familias tipograficas, tonos y densidades. */
export const MatrizDeEspecificacion: Story = {
  name: "Matriz de especificación",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[720px] max-w-full flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h3 className="font-meta text-[11px] tracking-[0.14em] text-ink-600 uppercase">
          Familias y tonos · densidad default
        </h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>font=&quot;sans&quot; · 14</TableHead>
              <TableHead>font=&quot;mono&quot; · 13</TableHead>
              <TableHead align="right">font=&quot;num&quot; · 14</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>tone default</TableCell>
              <TableCell font="mono">14 JUL</TableCell>
              <TableCell font="num">– $120.000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell tone="muted">tone muted</TableCell>
              <TableCell font="mono">13 JUL</TableCell>
              <TableCell font="num" tone="success">
                + $500.000
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell tone="error">tone error</TableCell>
              <TableCell font="mono">12 JUL</TableCell>
              <TableCell font="num" tone="error">
                – $80.000
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="font-meta text-[11px] tracking-[0.14em] text-ink-600 uppercase">
          Densidad medium · header 10/14 · fila 12/14
        </h3>
        <Table density="medium">
          <TableHeader>
            <TableRow>
              <TableHead>font=&quot;sans&quot; · 14</TableHead>
              <TableHead>font=&quot;mono&quot; · 13</TableHead>
              <TableHead align="right">font=&quot;num&quot; · 13</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              {/* th del cuerpo: cabecera de fila con tipografia de celda. */}
              <TableHead>María Rojas</TableHead>
              <TableCell font="mono">14 JUL</TableCell>
              <TableCell font="num">$120.000</TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Carlos Díaz</TableHead>
              <TableCell font="mono">13 JUL</TableCell>
              <TableCell font="num">$90.000</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="font-meta text-[11px] tracking-[0.14em] text-ink-600 uppercase">
          Densidad compact · header 8/14 · texto 13
        </h3>
        <Table density="compact">
          <TableHeader>
            <TableRow>
              <TableHead>font=&quot;sans&quot; · 13</TableHead>
              <TableHead>font=&quot;mono&quot; · 12</TableHead>
              <TableHead align="right">font=&quot;num&quot; · 13</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Recarga celular</TableCell>
              <TableCell font="mono">14 JUL</TableCell>
              <TableCell font="num">– $20.000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Aporte bolsillo</TableCell>
              <TableCell font="mono">12 JUL</TableCell>
              <TableCell font="num" tone="success">
                + $200.000
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="font-meta text-[11px] tracking-[0.14em] text-ink-600 uppercase">
          Estados de columna ordenable
        </h3>
        {/* Estas tres columnas van sin `onSort` a proposito: muestran el glifo y
            el aria-sort de cada estado sin colar en el recorrido de teclado tres
            botones que no notificarian a nadie. La columna interactiva de verdad
            es la de la story "Ordenable". */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead sortable>sin orden ↕</TableHead>
              <TableHead sortable sortDirection="asc">
                ascendente
              </TableHead>
              <TableHead sortable sortDirection="desc">
                descendente
              </TableHead>
              <TableHead>no ordenable</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell font="mono">aria-sort=none</TableCell>
              <TableCell font="mono">ascending</TableCell>
              <TableCell font="mono">descending</TableCell>
              <TableCell font="mono">—</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>
    </div>
  ),
};
