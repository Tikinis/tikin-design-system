import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetItem,
  BottomSheetList,
  BottomSheetTitle,
  BottomSheetTrigger,
  Modal,
  ModalAction,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalTitle,
  ModalTrigger,
} from "./modal";

/* Tests de COMPORTAMIENTO, no de apariencia. Las medidas (340 de ancho, r20,
 * padding 24, scrim al 45%) se verifican contra el navegador: jsdom no aplica
 * CSS, asi que comprobar clases seria tautologico.
 *
 * Lo que si es responsabilidad de este fichero: que el dialogo tenga nombre
 * accesible, que SIEMPRE haya una salida (scrim, Escape, gesto) y que el foco
 * entre y vuelva donde debe. */

/** El scrim es decorativo (no tiene rol ni texto): se busca por su data-slot. */
function scrim(): HTMLElement {
  const el = document.querySelector<HTMLElement>("[data-slot='modal-scrim']");
  if (!el) throw new Error("La superficie no ha pintado el scrim");
  return el;
}

function ModalDemo(props: { onConfirm?: () => void } = {}) {
  return (
    <Modal>
      <ModalTrigger asChild>
        <button type="button">Abrir modal</button>
      </ModalTrigger>
      <ModalContent>
        <ModalTitle>Eliminar bolsillo</ModalTitle>
        <ModalDescription>Se perdera el historial. No se puede deshacer.</ModalDescription>
        <ModalFooter>
          <ModalAction tone="danger" onClick={props.onConfirm}>
            Eliminar
          </ModalAction>
          <ModalClose asChild>
            <ModalAction variant="ghost">Cancelar</ModalAction>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

describe("Modal", () => {
  it("el disparador abre el dialogo y su nombre accesible sale del titulo", async () => {
    render(<ModalDemo />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Abrir modal" }));

    // El nombre lo cablea Radix por aria-labelledby contra ModalTitle. Sin
    // titulo el dialogo seria anonimo para un lector de pantalla.
    expect(screen.getByRole("dialog", { name: "Eliminar bolsillo" })).toBeInTheDocument();
  });

  it("Escape cierra — el usuario nunca queda atrapado", async () => {
    render(<ModalDemo />);
    await userEvent.click(screen.getByRole("button", { name: "Abrir modal" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("pulsar el scrim cierra", async () => {
    render(<ModalDemo />);
    await userEvent.click(screen.getByRole("button", { name: "Abrir modal" }));

    await userEvent.click(scrim());

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("con modal={false} sigue habiendo tarjeta, aunque sin scrim", () => {
    render(
      <Modal open modal={false}>
        <ModalContent aria-describedby={undefined}>
          <ModalTitle>Actualiza la app</ModalTitle>
        </ModalContent>
      </Modal>,
    );

    // Radix devuelve null en Dialog.Overlay cuando modal={false} — sin scrim,
    // porque la pagina de detras sigue siendo usable. Lo que NO puede pasar es
    // que se lleve por delante el contenido.
    expect(screen.getByRole("dialog", { name: "Actualiza la app" })).toBeInTheDocument();
    expect(document.querySelector("[data-slot='modal-scrim']")).toBeNull();
  });

  it("el foco entra al dialogo al abrir y vuelve al disparador al cerrar", async () => {
    render(<ModalDemo />);
    const trigger = screen.getByRole("button", { name: "Abrir modal" });
    await userEvent.click(trigger);

    const dialog = await screen.findByRole("dialog");
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));

    await userEvent.keyboard("{Escape}");
    // "el foco entra al primer control y vuelve al disparador al cerrar".
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("ModalClose con asChild cierra sin robarle el onClick al hijo", async () => {
    const onClick = vi.fn();
    render(
      <Modal defaultOpen>
        <ModalContent aria-describedby={undefined}>
          <ModalTitle>Confirmar envio</ModalTitle>
          <ModalFooter>
            <ModalClose asChild>
              <ModalAction variant="ghost" onClick={onClick}>
                Cancelar
              </ModalAction>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("la accion primaria no cierra sola: la decide el consumidor", async () => {
    const onConfirm = vi.fn();
    render(<ModalDemo onConfirm={onConfirm} />);
    await userEvent.click(screen.getByRole("button", { name: "Abrir modal" }));
    await userEvent.click(screen.getByRole("button", { name: "Eliminar" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    // Una accion destructiva suele necesitar esperar a la red antes de cerrar.
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("ModalAction es type=button: no envia el formulario que lo contiene", async () => {
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <Modal defaultOpen>
        <ModalContent aria-describedby={undefined}>
          <ModalTitle>Editar alias</ModalTitle>
          <form onSubmit={onSubmit}>
            <ModalFooter>
              <ModalAction>Guardar</ModalAction>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Guardar" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("no pone el label en mayusculas en JS, solo por CSS", async () => {
    render(<ModalDemo />);
    await userEvent.click(screen.getByRole("button", { name: "Abrir modal" }));
    // Importa para el texto accesible y para lo que se copia al portapapeles.
    expect(screen.getByRole("button", { name: "Eliminar" })).toHaveTextContent("Eliminar");
  });

  it("permite sobreescribir estilos por className", async () => {
    render(
      <Modal defaultOpen>
        <ModalContent className="rounded-none" aria-describedby={undefined}>
          <ModalTitle>Actualiza la app</ModalTitle>
        </ModalContent>
      </Modal>,
    );
    // tailwind-merge debe descartar el rounded-2xl de la tarjeta, no acumularlo.
    const cls = screen.getByRole("dialog").className;
    expect(cls).toContain("rounded-none");
    expect(cls).not.toContain("rounded-2xl");
  });

  it("funciona en modo controlado", async () => {
    const onOpenChange = vi.fn();
    render(
      <Modal open onOpenChange={onOpenChange}>
        <ModalContent aria-describedby={undefined}>
          <ModalTitle>Confirmar envio</ModalTitle>
        </ModalContent>
      </Modal>,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await userEvent.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
    // Controlado: sigue abierto hasta que el consumidor cambie `open`.
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});

function SheetDemo(props: { onSelect?: () => void } = {}) {
  return (
    <BottomSheet>
      <BottomSheetTrigger asChild>
        <button type="button">Abrir hoja</button>
      </BottomSheetTrigger>
      <BottomSheetContent aria-describedby={undefined}>
        <BottomSheetTitle>Enviar dinero a</BottomSheetTitle>
        <BottomSheetList>
          <BottomSheetItem title="$mariarojas" description="Maria Rojas" onClick={props.onSelect} />
          <BottomSheetItem title="Escanear QR" description="Paga a un negocio" />
          <BottomSheetItem title="Cuenta bancaria" description="PSE o transferencia" disabled />
        </BottomSheetList>
        <BottomSheetClose asChild>
          <button type="button">Cerrar</button>
        </BottomSheetClose>
      </BottomSheetContent>
    </BottomSheet>
  );
}

/** El grabber es decorativo (aria-hidden), asi que se busca por su data-attr. */
function grabber(): HTMLElement {
  const el = document.querySelector<HTMLElement>("[data-drag-handle]");
  if (!el) throw new Error("La hoja no ha pintado el grabber");
  return el;
}

/** Simula un arrastre vertical sobre el grabber de la hoja. */
function dragHandle(handle: Element, distance: number) {
  fireEvent.pointerDown(handle, { button: 0, clientY: 0 });
  fireEvent.pointerMove(window, { clientY: distance });
  fireEvent.pointerUp(window, { clientY: distance });
}

describe("BottomSheet", () => {
  it("abre desde el disparador y toma su nombre accesible del titulo", async () => {
    render(<SheetDemo />);
    await userEvent.click(screen.getByRole("button", { name: "Abrir hoja" }));
    expect(screen.getByRole("dialog", { name: "Enviar dinero a" })).toBeInTheDocument();
  });

  it("Escape cierra", async () => {
    render(<SheetDemo />);
    await userEvent.click(screen.getByRole("button", { name: "Abrir hoja" }));
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("arrastrar el grabber mas alla del umbral cierra la hoja", async () => {
    render(<SheetDemo />);
    await userEvent.click(screen.getByRole("button", { name: "Abrir hoja" }));

    dragHandle(grabber(), 160);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("un arrastre corto NO cierra: la hoja vuelve a su sitio", async () => {
    render(<SheetDemo />);
    await userEvent.click(screen.getByRole("button", { name: "Abrir hoja" }));

    dragHandle(grabber(), 20);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    // Y el desplazamiento se limpia: sin esto la hoja se quedaria 20px baja.
    expect(dialog.style.transform).toBe("");
  });

  it("arrastrar hacia arriba no mueve la hoja ni la cierra", async () => {
    render(<SheetDemo />);
    await userEvent.click(screen.getByRole("button", { name: "Abrir hoja" }));

    dragHandle(grabber(), -200);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog.style.transform).toBe("");
  });

  it("las filas son botones reales: responden a Enter y respetan disabled", async () => {
    const onSelect = vi.fn();
    render(<SheetDemo onSelect={onSelect} />);
    await userEvent.click(screen.getByRole("button", { name: "Abrir hoja" }));

    const fila = screen.getByRole("button", { name: /mariarojas/ });
    fila.focus();
    await userEvent.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledTimes(1);

    expect(screen.getByRole("button", { name: /Cuenta bancaria/ })).toBeDisabled();
  });

  it("con modal={false} sigue habiendo hoja, aunque sin scrim", () => {
    render(
      <BottomSheet open modal={false}>
        <BottomSheetContent aria-describedby={undefined}>
          <BottomSheetTitle>Enviar dinero a</BottomSheetTitle>
        </BottomSheetContent>
      </BottomSheet>,
    );

    expect(screen.getByRole("dialog", { name: "Enviar dinero a" })).toBeInTheDocument();
    expect(document.querySelector("[data-slot='modal-scrim']")).toBeNull();
  });

  it("el Close oculto del gesto no aparece en el arbol accesible", async () => {
    render(<SheetDemo />);
    await userEvent.click(screen.getByRole("button", { name: "Abrir hoja" }));

    // Solo debe haber una salida visible declarada por el consumidor. Si el
    // Close interno se colara, habria dos botones "cerrar" para el lector.
    const dialog = screen.getByRole("dialog");
    const ocultos = dialog.querySelectorAll("[hidden]");
    expect(ocultos.length).toBe(1);
    expect(ocultos[0]).toHaveAttribute("aria-hidden", "true");
  });
});
