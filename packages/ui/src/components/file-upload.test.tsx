import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  FileTypeIcon,
  FileUpload,
  FileUploadItem,
  FileUploadList,
  FileUploadThumbnail,
  fileKindFromName,
} from "./file-upload";

/* Estos tests cubren COMPORTAMIENTO, no apariencia. Los valores visuales
 * (dropzone r16, borde 1.5 discontinuo, barra de 5) se verifican contra el
 * navegador, no aqui: jsdom no aplica CSS, asi que comprobar clases seria
 * tautologico. */

const pdf = (name = "extracto.pdf", size = 4) =>
  new File(["x".repeat(size)], name, { type: "application/pdf" });

/** El `<input type="file">` esta fuera del arbol de accesibilidad a proposito. */
const fileInput = (container: HTMLElement) =>
  container.querySelector<HTMLInputElement>('input[type="file"]')!;

/** jsdom no construye un DataTransfer real; con esto basta para `drop`. */
const dataTransfer = (files: File[]) => ({ files, types: ["Files"], dropEffect: "" });

describe("FileUpload", () => {
  it("abre el selector nativo al pulsar la zona", async () => {
    const { container } = render(<FileUpload />);
    const input = fileInput(container);
    const open = vi.spyOn(input, "click").mockImplementation(() => {});

    await userEvent.click(screen.getByRole("button"));
    expect(open).toHaveBeenCalledTimes(1);
  });

  it("se activa con teclado, sin manejadores de tecla propios", async () => {
    // Es la razon de que la zona sea un <button> de verdad y no un div con role.
    const { container } = render(<FileUpload />);
    const open = vi.spyOn(fileInput(container), "click").mockImplementation(() => {});

    await userEvent.tab();
    expect(screen.getByRole("button")).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    expect(open).toHaveBeenCalledTimes(2);
  });

  it("el input oculto no crea una segunda parada de tabulador", async () => {
    const { container } = render(<FileUpload />);
    const input = fileInput(container);

    expect(input).toHaveAttribute("tabindex", "-1");
    expect(input).toHaveAttribute("aria-hidden", "true");

    await userEvent.tab();
    expect(screen.getByRole("button")).toHaveFocus();
    await userEvent.tab();
    expect(input).not.toHaveFocus();
  });

  it("entrega los archivos seleccionados", async () => {
    const onFilesAccepted = vi.fn();
    const { container } = render(<FileUpload onFilesAccepted={onFilesAccepted} />);

    const file = pdf();
    await userEvent.upload(fileInput(container), file);

    expect(onFilesAccepted).toHaveBeenCalledTimes(1);
    expect(onFilesAccepted.mock.calls[0]![0]).toEqual([file]);
  });

  it("vacia el input tras seleccionar, para poder repetir el mismo archivo", async () => {
    // Sin esto, elegir dos veces seguidas el mismo archivo no emite `change` la
    // segunda vez y el usuario cree que la app se ha colgado.
    const { container } = render(<FileUpload />);
    const input = fileInput(container);

    await userEvent.upload(input, pdf());
    expect(input.value).toBe("");
  });

  it("descarta por peso y explica el motivo", async () => {
    const onFilesAccepted = vi.fn();
    const onFilesRejected = vi.fn();
    const { container } = render(
      <FileUpload
        maxSize={10}
        onFilesAccepted={onFilesAccepted}
        onFilesRejected={onFilesRejected}
      />,
    );

    const pesado = pdf("foto.pdf", 40);
    await userEvent.upload(fileInput(container), pesado);

    expect(onFilesAccepted).not.toHaveBeenCalled();
    expect(onFilesRejected).toHaveBeenCalledWith([{ file: pesado, reason: "size" }]);
  });

  it("descarta por formato y explica el motivo", () => {
    const onFilesRejected = vi.fn();
    // Va por drop y no por `upload`: userEvent respeta el atributo accept del
    // input y no llegaria a emitir change, asi que no probaria nuestra puerta.
    render(<FileUpload accept=".pdf,image/*" onFilesRejected={onFilesRejected} />);

    const zip = new File(["x"], "archivo.zip", { type: "application/zip" });
    fireEvent.drop(screen.getByRole("button"), { dataTransfer: dataTransfer([zip]) });

    expect(onFilesRejected).toHaveBeenCalledWith([{ file: zip, reason: "type" }]);
  });

  it("acepta comodines de mime y extensiones sueltas", () => {
    const onFilesAccepted = vi.fn();
    render(<FileUpload multiple accept=".pdf,image/*" onFilesAccepted={onFilesAccepted} />);

    const png = new File(["x"], "foto.png", { type: "image/png" });
    const doc = pdf("carta.pdf");
    fireEvent.drop(screen.getByRole("button"), { dataTransfer: dataTransfer([png, doc]) });

    expect(onFilesAccepted).toHaveBeenCalledWith([png, doc]);
  });

  it("sin multiple se queda solo con el primero aunque suelten varios", () => {
    const onFilesAccepted = vi.fn();
    render(<FileUpload onFilesAccepted={onFilesAccepted} />);

    const uno = pdf("uno.pdf");
    const dos = pdf("dos.pdf");
    fireEvent.drop(screen.getByRole("button"), { dataTransfer: dataTransfer([uno, dos]) });

    expect(onFilesAccepted).toHaveBeenCalledWith([uno]);
  });

  it("marca el arrastre encima y lo desmarca al salir", () => {
    render(<FileUpload />);
    const zone = screen.getByRole("button");

    fireEvent.dragEnter(zone, { dataTransfer: dataTransfer([]) });
    expect(zone).toHaveAttribute("data-dragging", "true");

    fireEvent.dragLeave(zone);
    expect(zone).not.toHaveAttribute("data-dragging");
  });

  it("no parpadea cuando el arrastre pasa por encima de un hijo", () => {
    // dragenter/dragleave burbujean desde los hijos: se cuenta la profundidad.
    render(<FileUpload hint="PDF, JPG o PNG" />);
    const zone = screen.getByRole("button");

    fireEvent.dragEnter(zone, { dataTransfer: dataTransfer([]) });
    fireEvent.dragEnter(screen.getByText("PDF, JPG o PNG"), { dataTransfer: dataTransfer([]) });
    fireEvent.dragLeave(screen.getByText("PDF, JPG o PNG"));

    expect(zone).toHaveAttribute("data-dragging", "true");
  });

  it("deshabilitado no abre el selector ni acepta lo que se suelte", async () => {
    const onFilesAccepted = vi.fn();
    const { container } = render(<FileUpload disabled onFilesAccepted={onFilesAccepted} />);
    const input = fileInput(container);
    const open = vi.spyOn(input, "click").mockImplementation(() => {});

    await userEvent.click(screen.getByRole("button"));
    expect(open).not.toHaveBeenCalled();
    expect(input).toBeDisabled();

    fireEvent.drop(screen.getByRole("button"), { dataTransfer: dataTransfer([pdf()]) });
    expect(onFilesAccepted).not.toHaveBeenCalled();
  });

  it("no envia el formulario que lo contiene", async () => {
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    const { container } = render(
      <form onSubmit={onSubmit}>
        <FileUpload />
      </form>,
    );
    vi.spyOn(fileInput(container), "click").mockImplementation(() => {});

    await userEvent.click(screen.getByRole("button"));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("la variante inline es el mismo control con otra piel", async () => {
    const { container } = render(<FileUpload variant="inline" placeholder="Adjunta un soporte" />);
    const open = vi.spyOn(fileInput(container), "click").mockImplementation(() => {});

    // Una sola parada de tabulador: la pildora EXAMINAR no es un boton aparte.
    expect(screen.getAllByRole("button")).toHaveLength(1);
    await userEvent.click(screen.getByRole("button"));
    expect(open).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Adjunta un soporte")).toBeInTheDocument();
  });

  it("compone los manejadores de arrastre del consumidor sin perder los propios", () => {
    // El consumidor puede querer telemetria o un overlay propio durante el
    // arrastre. Sus manejadores deben sumarse a los internos, nunca
    // sustituirlos: si lo hicieran, la zona dejaria de aceptar archivos.
    const onDragEnter = vi.fn();
    const onDragOver = vi.fn();
    const onDragLeave = vi.fn();
    const onDrop = vi.fn();
    const onFilesAccepted = vi.fn();

    render(
      <FileUpload
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onFilesAccepted={onFilesAccepted}
      />,
    );
    const zone = screen.getByRole("button");

    fireEvent.dragEnter(zone, { dataTransfer: dataTransfer([]) });
    expect(onDragEnter).toHaveBeenCalledTimes(1);
    expect(zone).toHaveAttribute("data-dragging", "true");

    // fireEvent devuelve false cuando se llamo a preventDefault. Sin el en
    // dragover el navegador NUNCA dispara drop.
    expect(fireEvent.dragOver(zone, { dataTransfer: dataTransfer([]) })).toBe(false);
    expect(onDragOver).toHaveBeenCalledTimes(1);

    const file = pdf();
    fireEvent.drop(zone, { dataTransfer: dataTransfer([file]) });
    expect(onDrop).toHaveBeenCalledTimes(1);
    expect(onFilesAccepted).toHaveBeenCalledWith([file]);
    expect(zone).not.toHaveAttribute("data-dragging");

    fireEvent.dragEnter(zone, { dataTransfer: dataTransfer([]) });
    fireEvent.dragLeave(zone);
    expect(onDragLeave).toHaveBeenCalledTimes(1);
    expect(zone).not.toHaveAttribute("data-dragging");
  });

  it("permite sobreescribir estilos por className", () => {
    render(<FileUpload className="rounded-none" />);
    const cls = screen.getByRole("button").className;
    expect(cls).toContain("rounded-none");
    expect(cls).not.toContain("rounded-xl");
  });

  it("el ref reenviado apunta al boton, y pulsarlo abre el selector", () => {
    // Es la unica via programatica que necesita el consumidor: no se expone el
    // input, que ademas se vacia solo.
    const ref = { current: null } as React.RefObject<HTMLButtonElement | null>;
    const { container } = render(<FileUpload ref={ref} />);
    const open = vi.spyOn(fileInput(container), "click").mockImplementation(() => {});

    expect(ref.current).toBe(screen.getByRole("button"));
    ref.current?.click();
    expect(open).toHaveBeenCalledTimes(1);
  });
});

describe("FileUploadItem", () => {
  const row = (ui: React.ReactElement) => render(<FileUploadList>{ui}</FileUploadList>);

  it("la lista conserva su semantica aunque Tailwind le quite las viñetas", () => {
    row(<FileUploadItem name="extracto.pdf" />);
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });

  it("solo dibuja barra de progreso mientras sube o esta en pausa", () => {
    const { rerender } = row(<FileUploadItem name="cedula.pdf" status="uploading" value={62} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "62");

    rerender(
      <FileUploadList>
        <FileUploadItem name="cedula.pdf" status="done" value={100} />
      </FileUploadList>,
    );
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("acota el porcentaje fuera de rango en vez de desbordar la barra", () => {
    row(<FileUploadItem name="cedula.pdf" status="uploading" value={480} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  });

  it("usa el porcentaje como meta por defecto, y respeta la meta explicita", () => {
    const { rerender } = row(<FileUploadItem name="cedula.pdf" status="uploading" value={62} />);
    expect(screen.getByText("62%")).toBeInTheDocument();

    rerender(
      <FileUploadList>
        <FileUploadItem name="carta.docx" status="paused" value={40} meta="pausado · 40%" />
      </FileUploadList>,
    );
    expect(screen.getByText("pausado · 40%")).toBeInTheDocument();
  });

  it("el aspa de quitar dice de que archivo es", async () => {
    const onRemove = vi.fn();
    row(<FileUploadItem name="cedula.pdf" status="uploading" value={62} onRemove={onRemove} />);

    await userEvent.click(screen.getByRole("button", { name: "Quitar cedula.pdf" }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("reintentar solo aparece en error y es alcanzable por teclado", async () => {
    const onRetry = vi.fn();
    const { rerender } = row(
      <FileUploadItem name="foto.png" status="uploading" value={20} onRetry={onRetry} />,
    );
    expect(screen.queryByRole("button", { name: /reintentar/i })).not.toBeInTheDocument();

    rerender(
      <FileUploadList>
        <FileUploadItem name="foto.png" status="error" meta="supera 10 MB" onRetry={onRetry} />
      </FileUploadList>,
    );

    await userEvent.tab();
    expect(screen.getByRole("button", { name: /reintentar/i })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("no pone el rotulo de reintento en mayusculas en JS, solo por CSS", () => {
    // Importa para el lector de pantalla y para lo que se copia al portapapeles.
    row(<FileUploadItem name="foto.png" status="error" onRetry={() => {}} />);
    expect(screen.getByRole("button", { name: "Reintentar" })).toHaveTextContent("Reintentar");
  });

  it("reanudar solo aparece en pausa", async () => {
    const onResume = vi.fn();
    row(<FileUploadItem name="carta.docx" status="paused" value={40} onResume={onResume} />);

    await userEvent.click(screen.getByRole("button", { name: "Reanudar carta.docx" }));
    expect(onResume).toHaveBeenCalledTimes(1);
  });

  it("no inventa acciones que el consumidor no ha pasado", () => {
    row(<FileUploadItem name="soporte-pago.pdf" status="done" meta="240 KB · listo" />);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("publica el estado en data-status para poder engancharse a el", () => {
    row(<FileUploadItem name="archivo.zip" status="error" meta="formato no permitido" />);
    expect(screen.getByRole("listitem")).toHaveAttribute("data-status", "error");
  });
});

describe("FileUploadThumbnail", () => {
  it("el tile de agregar es un boton de verdad y responde a teclado", async () => {
    const onAdd = vi.fn();
    render(<FileUploadThumbnail state="add" onAdd={onAdd} />);

    const tile = screen.getByRole("button", { name: "Agregar imagen" });
    await userEvent.tab();
    expect(tile).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it("la miniatura lista se puede quitar", async () => {
    const onRemove = vi.fn();
    render(
      <FileUploadThumbnail
        src="/comprobante.png"
        alt="Comprobante de nomina"
        onRemove={onRemove}
      />,
    );

    expect(screen.getByRole("img", { name: "Comprobante de nomina" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Quitar imagen" }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("mientras sube no ofrece quitar ni pinta imagen", () => {
    render(<FileUploadThumbnail state="uploading" src="/comprobante.png" onRemove={() => {}} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});

describe("fileKindFromName", () => {
  it("agrupa las extensiones en los siete formatos del documento", () => {
    expect(fileKindFromName("extracto.pdf")).toBe("pdf");
    expect(fileKindFromName("FOTO.JPEG")).toBe("jpg");
    expect(fileKindFromName("carta.docx")).toBe("doc");
    expect(fileKindFromName("libro.xlsx")).toBe("xls");
    expect(fileKindFromName("datos.csv")).toBe("csv");
    expect(fileKindFromName("archivo.zip")).toBe("other");
    // Sin extension no hay formato que deducir.
    expect(fileKindFromName("informe")).toBe("other");
  });
});

describe("FileTypeIcon", () => {
  it("es decorativo: no aporta nombre accesible", () => {
    const { container } = render(<FileTypeIcon name="extracto.pdf" />);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("rotula el formato dentro del glifo, salvo en OTRO", () => {
    const { container, rerender } = render(<FileTypeIcon name="extracto.pdf" />);
    expect(container.querySelector("text")).toHaveTextContent("PDF");

    rerender(<FileTypeIcon name="archivo.zip" />);
    expect(container.querySelector("text")).toBeNull();
  });
});

describe("FileUpload · props del consumidor sobre los internos", () => {
  // `{...props}` va delante de los atributos explicitos del <button> para que
  // los manejadores de arrastre internos no se puedan anular por descuido. El
  // precio es que TODO lo que se fije despues pisa al consumidor, asi que lo
  // que si debe poder sobreescribirse se desestructura a proposito. Estos dos
  // tests vigilan justo eso.

  it("respeta el data-dragging del consumidor cuando no hay arrastre real", () => {
    render(<FileUpload data-dragging="true" />);
    expect(screen.getByRole("button")).toHaveAttribute("data-dragging", "true");
  });

  it("permite cambiar el type del boton", () => {
    render(<FileUpload type="submit" />);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("sigue componiendo los manejadores de arrastre, no sustituyendolos", () => {
    const onDrop = vi.fn();
    const onFilesAccepted = vi.fn();
    render(<FileUpload onDrop={onDrop} onFilesAccepted={onFilesAccepted} />);

    const zona = screen.getByRole("button");
    fireEvent.drop(zona, {
      dataTransfer: { files: [new File(["x"], "a.pdf", { type: "application/pdf" })] },
    });

    // El del consumidor se invoca Y el motor interno sigue funcionando.
    expect(onDrop).toHaveBeenCalledTimes(1);
    expect(onFilesAccepted).toHaveBeenCalledTimes(1);
  });
});
