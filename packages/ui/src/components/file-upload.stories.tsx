import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  FileTypeIcon,
  FileUpload,
  FileUploadItem,
  FileUploadList,
  FileUploadThumbnail,
  type FileKind,
  type FileUploadStatus,
} from "./file-upload";

const meta: Meta<typeof FileUpload> = {
  title: "Componentes/FileUpload",
  component: FileUpload,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Seccion 31 · File upload — EXTENSION.**",
          "",
          'El documento lo dice en la entradilla: "Extension con la paleta y los radios del sistema".',
          "No hay ningun nodo de subida en el archivo de Figma ni tokens `--upload-*`, asi que **nada",
          "de esto es especificacion aprobada**: es propuesta coherente con los tokens del sistema.",
          "",
          "Cuatro reglas de uso que manda el documento:",
          "",
          "- **Formato y peso** — di siempre los tipos admitidos y el limite ANTES de subir.",
          "- **Progreso** — barra en tinta con porcentaje mientras sube; al terminar, check verde.",
          "- **Drag & drop** — el borde punteado se resalta al arrastrar encima; en movil, tocar abre",
          "  la galeria o los archivos del sistema.",
          "- **Quitar siempre** — cada archivo tiene una X para quitarlo antes de enviar.",
          "",
          "El error explica QUE paso (peso, formato) y ofrece reintentar, no solo “fallo”.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    variant: { control: "inline-radio", options: ["dropzone", "inline"] },
    multiple: { control: "boolean" },
    disabled: { control: "boolean" },
    accept: { control: "text" },
    maxSize: { control: "number" },
  },
  args: {
    accept: ".pdf,.jpg,.png",
    maxSize: 10 * 1024 * 1024,
    hint: "PDF, JPG o PNG · hasta 10 MB",
  },
  decorators: [
    (Story) => (
      <div className="w-[460px] max-w-full">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FileUpload>;

/** Zona de arrastre. Titulo, pista de formatos y limite, siempre visibles. */
export const Dropzone: Story = {};

/** Arrastrando encima: borde en tinta y fondo elevado. */
export const Arrastrando: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "El resalte va por `data-dragging`, no por `:hover`: durante un arrastre el navegador no emite hover sobre el destino. Aqui se fuerza el atributo para poder verlo estatico.",
      },
    },
  },
  render: (args) => <FileUpload {...args} data-dragging="true" />,
};

/** Un campo mas dentro de un formulario: 48 de alto, con la pildora EXAMINAR. */
export const Inline: Story = {
  args: { variant: "inline", placeholder: "Adjunta un soporte…", action: "Examinar" },
};

export const Deshabilitado: Story = { args: { disabled: true } };

/* -------------------------------------------------------------------------
 * Filas de archivo
 * ----------------------------------------------------------------------- */

/** Los seis estados que dibuja el documento, en el mismo orden. */
export const EstadosDeArchivo: Story = {
  name: "Estados de archivo",
  parameters: { controls: { disable: true } },
  render: () => (
    <FileUploadList>
      <FileUploadItem name="extracto.pdf" status="queued" meta="en cola" />
      <FileUploadItem name="cedula.pdf" status="uploading" value={62} onRemove={() => {}} />
      <FileUploadItem
        name="carta.docx"
        status="paused"
        value={40}
        meta="pausado · 40%"
        onResume={() => {}}
      />
      <FileUploadItem name="soporte-pago.pdf" status="done" meta="240 KB · listo" />
      <FileUploadItem name="foto.png" status="error" meta="supera 10 MB" onRetry={() => {}} />
      <FileUploadItem
        name="archivo.zip"
        status="error"
        meta="formato no permitido"
        onRemove={() => {}}
      />
    </FileUploadList>
  ),
};

/** El nombre largo se recorta; la meta y las acciones nunca se comprimen. */
export const NombreLargo: Story = {
  name: "Nombre largo",
  parameters: { controls: { disable: true } },
  render: () => (
    <FileUploadList>
      <FileUploadItem
        name="soporte-de-pago-nomina-diciembre-2025-firmado-digitalmente.pdf"
        status="uploading"
        value={35}
        onRemove={() => {}}
      />
    </FileUploadList>
  ),
};

/* -------------------------------------------------------------------------
 * Miniaturas y tipos
 * ----------------------------------------------------------------------- */

/** Galeria de comprobantes: el spinner es una subiendo, el + agrega. */
export const Miniaturas: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap gap-3">
      <FileUploadThumbnail
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 88 88'%3E%3Crect width='88' height='88' fill='%23c9d6a3'/%3E%3C/svg%3E"
        alt="Comprobante de nomina de diciembre"
        onRemove={() => {}}
      />
      <FileUploadThumbnail state="uploading" />
      <FileUploadThumbnail state="add" onAdd={() => {}} />
    </div>
  ),
};

/** Un glifo por formato. Solo PDF y XLS se salen de la tinta. */
export const TiposDeArchivo: Story = {
  name: "Tipos de archivo",
  parameters: { controls: { disable: true } },
  render: () => {
    const kinds: FileKind[] = ["pdf", "jpg", "png", "doc", "xls", "csv", "other"];
    return (
      <div className="flex flex-wrap gap-5">
        {kinds.map((kind) => (
          <div key={kind} className="flex flex-col items-center gap-2">
            <div className="flex size-11 items-center justify-center rounded-md bg-surface-2">
              <FileTypeIcon kind={kind} className="size-[22px]" />
            </div>
            <span className="font-meta text-[11px] text-ink-500 uppercase">{kind}</span>
          </div>
        ))}
      </div>
    );
  },
};

/* -------------------------------------------------------------------------
 * Matriz y flujo completo
 * ----------------------------------------------------------------------- */

/** Matriz de especificacion: estado x acciones disponibles. */
export const MatrizDeEstados: Story = {
  name: "Matriz de estados",
  parameters: { controls: { disable: true } },
  render: () => {
    const filas: { status: FileUploadStatus; name: string; meta: string; value?: number }[] = [
      { status: "queued", name: "extracto.pdf", meta: "en cola" },
      { status: "uploading", name: "cedula.pdf", meta: "62%", value: 62 },
      { status: "paused", name: "carta.docx", meta: "pausado · 40%", value: 40 },
      { status: "done", name: "soporte-pago.pdf", meta: "240 KB · listo" },
      { status: "error", name: "foto.png", meta: "supera 10 MB" },
    ];

    return (
      <table className="border-separate border-spacing-y-2.5">
        <thead>
          <tr>
            {["estado", "sin acciones", "con quitar"].map((h) => (
              <th
                key={h}
                className="pr-4 text-left font-meta text-[11px] tracking-[0.1em] text-ink-500 uppercase"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila) => (
            <tr key={fila.status}>
              <td className="pr-4 align-middle font-meta text-[11px] tracking-[0.1em] text-ink-500 uppercase">
                {fila.status}
              </td>
              <td className="w-[320px] pr-4">
                <FileUploadList>
                  <FileUploadItem {...fila} />
                </FileUploadList>
              </td>
              <td className="w-[320px]">
                <FileUploadList>
                  <FileUploadItem
                    {...fila}
                    onRemove={() => {}}
                    onRetry={() => {}}
                    onResume={() => {}}
                  />
                </FileUploadList>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
};

/** Flujo real: seleccionar, ver progreso, quitar. El rechazo explica el motivo. */
export const FlujoCompleto: Story = {
  name: "Flujo completo",
  parameters: { controls: { disable: true } },
  render: function FlujoCompletoStory() {
    type Fila = {
      id: number;
      name: string;
      status: FileUploadStatus;
      value: number;
      meta?: string;
    };
    const [filas, setFilas] = React.useState<Fila[]>([]);
    const siguienteId = React.useRef(0);

    /* Simula la subida. En una app real esto es el progreso del XHR o del
       fetch con stream; aqui solo demuestra que la fila es un espejo del
       estado que le pasa el consumidor. */
    React.useEffect(() => {
      const t = setInterval(() => {
        setFilas((prev) =>
          prev.map((f) => {
            if (f.status !== "uploading") return f;
            const value = Math.min(100, f.value + 9);
            return value >= 100
              ? { ...f, value, status: "done", meta: "listo" }
              : { ...f, value, meta: undefined };
          }),
        );
      }, 320);
      return () => clearInterval(t);
    }, []);

    return (
      <div className="flex flex-col gap-3">
        <FileUpload
          multiple
          accept=".pdf,.jpg,.png"
          maxSize={10 * 1024 * 1024}
          hint="PDF, JPG o PNG · hasta 10 MB"
          onFilesAccepted={(files) =>
            setFilas((prev) => [
              ...prev,
              ...files.map((file) => ({
                id: siguienteId.current++,
                name: file.name,
                status: "uploading" as FileUploadStatus,
                value: 0,
              })),
            ])
          }
          onFilesRejected={(rejections) =>
            setFilas((prev) => [
              ...prev,
              ...rejections.map(({ file, reason }) => ({
                id: siguienteId.current++,
                name: file.name,
                status: "error" as FileUploadStatus,
                value: 0,
                meta: reason === "size" ? "supera 10 MB" : "formato no permitido",
              })),
            ])
          }
        />

        {filas.length > 0 && (
          <FileUploadList>
            {filas.map((fila) => (
              <FileUploadItem
                key={fila.id}
                name={fila.name}
                status={fila.status}
                value={fila.value}
                meta={fila.meta}
                onRemove={() => setFilas((prev) => prev.filter((f) => f.id !== fila.id))}
              />
            ))}
          </FileUploadList>
        )}
      </div>
    );
  },
};
