import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  SegmentedControl,
  SegmentedControlItem,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./tabs";

/* Seccion 08 · Tabs & controles.
 * `segmented` es CANONICO (del archivo de Figma); `soft` y `underline` son
 * EXTENSIONES propuestas. La distincion se repite en cada story para que nadie
 * tome una propuesta por especificacion aprobada. */

const meta = {
  title: "Componentes/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Seccion 08 · Tabs & controles — MIXTO.**",
          "",
          "Tres pieles sobre la misma primitiva (Radix Tabs), con procedencias distintas:",
          "",
          "- **segmented** — *CANONICO, del archivo de Figma*. Riel r12 de 40 de alto con borde de 1px y padding 4; la activa es un bloque gris r10. Label mono 14 en MAYUSCULAS, +2% tracking, icono 16 con gap 6. Para **filtrar la misma lista**, con contador en la activa.",
          "- **soft** — *EXTENSION, no esta en el archivo*. Riel r12 sobre `surface-2`, activa = tarjeta r8 con sombra. Para **alternar modos dentro de una tarjeta**.",
          "- **underline** — *EXTENSION, no esta en el archivo*. Sin riel: linea de 1px bajo la fila y subrayado de 2px en tinta bajo la activa. Para **navegacion de pagina con 3+ secciones**.",
          "",
          "**Seleccion en tinta**: la activa se marca con tinta (pildora, tarjeta o subrayado) — nunca con lima ni otro acento. Inactivas en `ink-600`, hover a tinta.",
          "",
          "**Labels**: mono 13 (14 en el segmentado del archivo), MAYUSCULAS por CSS, +2% tracking. Maximo una palabra por pestaña; el ancho lo da el contenido, no se estiran a partes iguales. En el segmentado la activa sube a peso 500 (sin descuadre: la fuente es monoespaciada).",
          "",
          "**Motion**: al seleccionar, la pestaña hace un *pop* del archivo (`_pop`: scale a 0.9, 0.94 en underline; muelle 520/14, ~0.35s), aproximado con `@keyframes` y desactivado bajo `prefers-reduced-motion`.",
          "",
          "**`SegmentedControl` no es un `tablist`**: comparte la piel del segmentado pero se monta sobre Radix RadioGroup, porque filtra una lista que ya esta en pantalla y no tiene paneles que intercambiar. Un `tab` sin `tabpanel` al que apuntar no es conforme con la APG.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    variant: { control: "inline-radio", options: ["segmented", "soft", "underline"] },
    activationMode: { control: "inline-radio", options: ["automatic", "manual"] },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/* Panel de ejemplo, con el estilo de tarjeta que usa el documento. */
function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 max-w-[640px] rounded-xl border border-edge bg-page px-6 py-5">
      {children}
    </div>
  );
}

/* Icono de 16 inline: el paquete no declara dependencia de iconos y estas
 * stories no deben añadir ninguna. */
function IconoRecibo() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.5 2.5h9v11l-2-1-1.5 1-1.5-1-1.5 1-2-1v-11Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M6 6h4M6 8.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/** CANONICO — el patron literal del archivo: riel r12, h40, activa gris r10. */
export const Segmentado: Story = {
  args: { variant: "segmented", defaultValue: "dia" },
  render: (args) => (
    <Tabs {...args}>
      <TabsList aria-label="Periodo">
        <TabsTrigger value="dia">Día</TabsTrigger>
        <TabsTrigger value="semana">Semana</TabsTrigger>
        <TabsTrigger value="mes">Mes</TabsTrigger>
      </TabsList>
      <TabsContent value="dia">
        <Panel>Movimientos de hoy.</Panel>
      </TabsContent>
      <TabsContent value="semana">
        <Panel>Movimientos de los ultimos siete dias.</Panel>
      </TabsContent>
      <TabsContent value="mes">
        <Panel>Movimientos del mes en curso.</Panel>
      </TabsContent>
    </Tabs>
  ),
};

/** EXTENSION — activa = tarjeta. Para alternar modos dentro de una tarjeta. */
export const FondoSuave: Story = {
  name: "Fondo suave (extensión)",
  args: { variant: "soft", defaultValue: "qr" },
  parameters: {
    docs: {
      description: {
        story: "No esta en el archivo de Figma. Propuesta coherente con los tokens del sistema.",
      },
    },
  },
  render: (args) => (
    <Tabs {...args}>
      <TabsList aria-label="Modo de cobro">
        <TabsTrigger value="qr">QR</TabsTrigger>
        <TabsTrigger value="enlace">Enlace</TabsTrigger>
      </TabsList>
      <TabsContent value="qr">
        <Panel>Genera un codigo para cobrar en persona.</Panel>
      </TabsContent>
      <TabsContent value="enlace">
        <Panel>Comparte un enlace de pago por mensaje.</Panel>
      </TabsContent>
    </Tabs>
  ),
};

/** EXTENSION — subrayado de 2px en tinta. Navegacion de pagina con 3+ secciones. */
export const Underline: Story = {
  name: "Underline (extensión)",
  args: { variant: "underline", defaultValue: "resumen" },
  parameters: {
    docs: {
      description: {
        story:
          "No esta en el archivo de Figma. La inactiva lleva un borde transparente de 2px para que la fila no salte al cambiar de seleccion.",
      },
    },
  },
  render: (args) => (
    <Tabs {...args} className="max-w-[640px]">
      <TabsList aria-label="Secciones">
        <TabsTrigger value="resumen">Resumen</TabsTrigger>
        <TabsTrigger value="pagos">Pagos</TabsTrigger>
        <TabsTrigger value="documentos">Documentos</TabsTrigger>
        <TabsTrigger value="ajustes">Ajustes</TabsTrigger>
      </TabsList>
      <TabsContent value="resumen" className="px-0.5 py-[18px]">
        Estado del contrato y proximo vencimiento.
      </TabsContent>
      <TabsContent value="pagos" className="px-0.5 py-[18px]">
        Historial de recibos emitidos y cobrados.
      </TabsContent>
      <TabsContent value="documentos" className="px-0.5 py-[18px]">
        Contrato, anexos y justificantes.
      </TabsContent>
      <TabsContent value="ajustes" className="px-0.5 py-[18px]">
        Preferencias de notificacion y facturacion.
      </TabsContent>
    </Tabs>
  ),
};

/** Con icono de 16 y contador en la activa, tal y como lo describe el documento. */
export const ConIconoYContador: Story = {
  name: "Con icono y contador",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "El contador cuenta para el nombre accesible de la pestaña (`Todos 12 recibos`). Escondido con `aria-hidden` el numero desaparece para el lector de pantalla, que es justo el dato que el documento quiere destacar.",
      },
    },
  },
  render: () => (
    <Tabs defaultValue="todos" variant="segmented">
      <TabsList aria-label="Filtrar recibos">
        {/* El aria-label repite literalmente el texto visible ("Todos 12") y le
            añade la unidad: es lo que exige "label in name" del control por voz. */}
        <TabsTrigger value="todos" startIcon={<IconoRecibo />} aria-label="Todos 12 recibos">
          Todos <span className="font-num">12</span>
        </TabsTrigger>
        <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
        <TabsTrigger value="pagados">Pagados</TabsTrigger>
      </TabsList>
      <TabsContent value="todos">
        <Panel>Doce recibos.</Panel>
      </TabsContent>
      <TabsContent value="pendientes">
        <Panel>Tres recibos pendientes.</Panel>
      </TabsContent>
      <TabsContent value="pagados">
        <Panel>Nueve recibos pagados.</Panel>
      </TabsContent>
    </Tabs>
  ),
};

/** Una opcion sin datos se deshabilita: baja a ink-400 y las flechas la saltan. */
export const Deshabilitada: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Tabs defaultValue="dia" variant="segmented">
      <TabsList aria-label="Periodo">
        <TabsTrigger value="dia">Día</TabsTrigger>
        <TabsTrigger value="semana">Semana</TabsTrigger>
        <TabsTrigger value="mes" disabled>
          Mes
        </TabsTrigger>
      </TabsList>
      <TabsContent value="dia">
        <Panel>Movimientos de hoy.</Panel>
      </TabsContent>
      <TabsContent value="semana">
        <Panel>Movimientos de la semana.</Panel>
      </TabsContent>
      <TabsContent value="mes">
        <Panel>Sin datos.</Panel>
      </TabsContent>
    </Tabs>
  ),
};

/** Si cada panel carga datos, la flecha solo mueve el foco; activa Enter o Espacio. */
export const ActivacionManual: Story = {
  name: "Activación manual",
  parameters: { controls: { disable: true } },
  render: () => (
    <Tabs defaultValue="resumen" variant="underline" activationMode="manual">
      <TabsList aria-label="Secciones">
        <TabsTrigger value="resumen">Resumen</TabsTrigger>
        <TabsTrigger value="pagos">Pagos</TabsTrigger>
        <TabsTrigger value="documentos">Documentos</TabsTrigger>
      </TabsList>
      <TabsContent value="resumen" className="px-0.5 py-[18px]">
        Con <code>activationMode=&quot;manual&quot;</code> las flechas recorren sin cargar nada.
      </TabsContent>
      <TabsContent value="pagos" className="px-0.5 py-[18px]">
        Este panel solo se monta al pulsar Enter.
      </TabsContent>
      <TabsContent value="documentos" className="px-0.5 py-[18px]">
        Y este tambien.
      </TabsContent>
    </Tabs>
  ),
};

/** El segmentado como filtro de una lista que ya esta en pantalla, sin paneles. */
export const ControlSegmentadoSuelto: Story = {
  name: "SegmentedControl (filtro de lista)",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'El uso del archivo: filtrar la misma lista. Como no hay paneles que intercambiar, el control es un `radiogroup` y sus opciones son `radio`, no `tab`: un `tab` sin `tabpanel` al que apuntar no es conforme con la APG. `controls` pone el `aria-controls` del grupo sobre la lista que filtra. El riel es la raiz, asi que `className` y la ref llegan a un unico elemento: `<SegmentedControl className="w-full">` ocupa todo el ancho.',
      },
    },
  },
  render: () => (
    <div className="flex max-w-[520px] flex-col gap-4">
      <SegmentedControl defaultValue="todos" aria-label="Filtrar recibos" controls="lista-recibos">
        <SegmentedControlItem value="todos">Todos</SegmentedControlItem>
        <SegmentedControlItem value="pendientes">Pendientes</SegmentedControlItem>
        <SegmentedControlItem value="pagados">Pagados</SegmentedControlItem>
      </SegmentedControl>
      <ul id="lista-recibos" className="divide-y divide-edge rounded-xl border border-edge">
        {["Marzo", "Abril", "Mayo"].map((mes) => (
          <li key={mes} className="flex items-center justify-between px-4 py-3 text-ink-800">
            <span className="text-sm">Recibo de {mes}</span>
            <span className="font-num text-sm text-ink-600">640,00 €</span>
          </li>
        ))}
      </ul>
    </div>
  ),
};

/** Matriz de especificacion: las tres pieles con su procedencia y sus medidas. */
export const MatrizDeEspecificacion: Story = {
  name: "Matriz de especificación",
  parameters: { controls: { disable: true } },
  render: () => {
    const filas = [
      {
        variant: "segmented",
        origen: "DEL ARCHIVO",
        medidas: "riel h40 r12 · borde 1px · padding 4 · activa r10 · mono 14 · icono 16",
      },
      {
        variant: "soft",
        origen: "EXTENSIÓN",
        medidas: "riel r12 · padding 4 · gap 2 · activa tarjeta r8 + borde + sombra · mono 13",
      },
      {
        variant: "underline",
        origen: "EXTENSIÓN",
        medidas: "línea 1px · gap 28 · padding 10/2/12 · activa subrayado 2px · mono 13",
      },
    ] as const;

    return (
      <div className="flex flex-col gap-10">
        {filas.map((fila) => (
          <div key={fila.variant} className="flex flex-col gap-3">
            <div className="flex items-baseline gap-3 border-b border-edge pb-2">
              <span className="font-mono text-[13px] tracking-[0.14em] text-ink-600 uppercase">
                {fila.variant} · {fila.origen}
              </span>
              <span className="ml-auto font-meta text-xs text-ink-600">{fila.medidas}</span>
            </div>
            {/* Los paneles no son decorativos: Radix emite siempre
                `aria-controls` en cada pestaña, asi que una matriz sin
                `TabsContent` dejaria nueve referencias ARIA apuntando a ids que
                no existen. */}
            <Tabs defaultValue="activa" variant={fila.variant}>
              <TabsList aria-label={fila.variant}>
                <TabsTrigger value="activa">Activa</TabsTrigger>
                <TabsTrigger value="inactiva">Inactiva</TabsTrigger>
                <TabsTrigger value="off" disabled>
                  Off
                </TabsTrigger>
              </TabsList>
              {["activa", "inactiva", "off"].map((estado) => (
                <TabsContent key={estado} value={estado} className="pt-3 text-ink-600">
                  Estado <strong className="font-normal text-ink">{estado}</strong> de la piel{" "}
                  {fila.variant}.
                </TabsContent>
              ))}
            </Tabs>
          </div>
        ))}
      </div>
    );
  },
};
