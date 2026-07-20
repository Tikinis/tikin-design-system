import { afterEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toast, ToastAction, ToastProvider, ToastViewport } from "./toast";

/* Estos tests cubren COMPORTAMIENTO, no apariencia. Los valores visuales
 * (tinta 900, r12, icono 17, sombra alta) se verifican contra el navegador, no
 * aqui: jsdom no aplica CSS, asi que comprobar clases seria tautologico.
 *
 * DOS DETALLES DE RADIX QUE CONDICIONAN COMO SE CONSULTA EL DOM
 * ------------------------------------------------------------
 * 1. Radix duplica el texto del toast durante el primer segundo: renderiza un
 *    nodo aparte, visualmente oculto y con role="status", para que el lector de
 *    pantalla lo anuncie. Por eso las consultas se hacen SIEMPRE dentro de la
 *    region del viewport, o `getByText` encontraria dos coincidencias.
 * 2. El <li> del toast no lleva role propio, asi que no se busca por rol.
 */

function montar(ui: React.ReactNode) {
  return render(
    <ToastProvider>
      {ui}
      <ToastViewport />
    </ToastProvider>,
  );
}

/** Region que envuelve al viewport: todo lo visible del toast vive dentro. */
function region() {
  return within(screen.getByRole("region"));
}

afterEach(() => {
  vi.useRealTimers();
});

describe("Toast", () => {
  it("muestra el mensaje dentro del viewport", () => {
    montar(<Toast>Envío completado</Toast>);
    expect(region().getByText("Envío completado")).toBeInTheDocument();
  });

  it("se anuncia al lector de pantalla en un nodo aparte", async () => {
    montar(<Toast tone="error">No se pudo enviar</Toast>);
    // El anuncio vive fuera de la region, portalado al body.
    const anuncio = screen.getByRole("status");
    // Un error interrumpe; una confirmacion normal espera turno.
    expect(anuncio).toHaveAttribute("aria-live", "assertive");
    // Radix rellena el nodo un frame despues, para que el lector lo trate como
    // contenido nuevo y no como parte del render inicial.
    await waitFor(() => expect(anuncio).toHaveTextContent("No se pudo enviar"));
  });

  it("un toast neutro no interrumpe al lector de pantalla", () => {
    montar(<Toast>$valentina copiado</Toast>);
    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
  });

  it("se auto-descarta a los 2,5 s", async () => {
    vi.useFakeTimers();
    montar(<Toast>Envío completado</Toast>);

    await act(async () => {
      vi.advanceTimersByTime(2400);
    });
    expect(region().queryByText("Envío completado")).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(200);
    });
    expect(region().queryByText("Envío completado")).not.toBeInTheDocument();
  });

  it("con accion aguanta mas: 5 s en vez de 2,5", async () => {
    vi.useFakeTimers();
    montar(
      <Toast action={<ToastAction altText="Deshacer el borrado">Deshacer</ToastAction>}>
        Movimiento eliminado
      </Toast>,
    );

    // A los 3 s un toast sin accion ya se habria ido.
    await act(async () => {
      vi.advanceTimersByTime(3000);
    });
    expect(region().queryByText("Movimiento eliminado")).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(2100);
    });
    expect(region().queryByText("Movimiento eliminado")).not.toBeInTheDocument();
  });

  it("el tono loading no se auto-descarta nunca", async () => {
    vi.useFakeTimers();
    montar(<Toast tone="loading">Enviando dinero…</Toast>);

    await act(async () => {
      vi.advanceTimersByTime(60_000);
    });
    // Todavia no ha pasado nada que confirmar: lo sustituye el consumidor.
    expect(region().queryByText("Enviando dinero…")).toBeInTheDocument();
  });

  it("una duracion explicita gana sobre la del tono", async () => {
    vi.useFakeTimers();
    montar(
      <Toast tone="success" duration={1000}>
        Envío completado
      </Toast>,
    );

    await act(async () => {
      vi.advanceTimersByTime(1100);
    });
    expect(region().queryByText("Envío completado")).not.toBeInTheDocument();
  });

  it("la accion se pulsa con el teclado y cierra el toast", async () => {
    const user = userEvent.setup();
    const onUndo = vi.fn();
    montar(
      <Toast
        action={
          <ToastAction altText="Deshacer el borrado" onClick={onUndo}>
            Deshacer
          </ToastAction>
        }
      >
        Movimiento eliminado
      </Toast>,
    );

    const accion = region().getByRole("button", { name: "Deshacer" });
    accion.focus();
    expect(accion).toHaveFocus();

    // Es un <button> de verdad, asi que Enter lo activa sin manejadores propios.
    await user.keyboard("{Enter}");
    expect(onUndo).toHaveBeenCalledTimes(1);
    expect(region().queryByText("Movimiento eliminado")).not.toBeInTheDocument();
  });

  it("no pone el label de la accion en mayusculas en JS, solo por CSS", () => {
    montar(
      <Toast action={<ToastAction altText="Reintentar el envío">Reintentar</ToastAction>}>
        No se pudo enviar
      </Toast>,
    );
    // Importa para el nombre accesible y para lo que se copia al portapapeles.
    expect(region().getByRole("button", { name: "Reintentar" })).toBeInTheDocument();
  });

  it("Escape cierra el toast", async () => {
    const user = userEvent.setup();
    montar(<Toast>Envío completado</Toast>);

    await user.keyboard("{Escape}");
    expect(region().queryByText("Envío completado")).not.toBeInTheDocument();
  });

  it("F8 lleva el foco a la lista de toasts desde cualquier sitio", () => {
    montar(<Toast>Envío completado</Toast>);

    // El toast no roba el foco al aparecer — nunca bloquea — asi que la unica
    // forma de alcanzarlo con teclado es el atajo que cablea Radix.
    // Va con fireEvent y no con userEvent porque el mapa de teclas por defecto
    // de userEvent no trae las teclas de funcion, y Radix mira event.code.
    fireEvent.keyDown(document, { key: "F8", code: "F8" });
    expect(screen.getByRole("list")).toHaveFocus();
  });

  it("mantener el foco dentro pausa el temporizador", async () => {
    vi.useFakeTimers();
    montar(
      <Toast action={<ToastAction altText="Deshacer el borrado">Deshacer</ToastAction>}>
        Movimiento eliminado
      </Toast>,
    );

    act(() => {
      region().getByRole("button", { name: "Deshacer" }).focus();
    });
    await act(async () => {
      vi.advanceTimersByTime(20_000);
    });

    // Con el foco dentro no puede desaparecer bajo los dedos del usuario.
    expect(region().queryByText("Movimiento eliminado")).toBeInTheDocument();
  });

  it("en modo controlado respeta open y avisa al cerrarse solo", async () => {
    vi.useFakeTimers();
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <ToastProvider>
        <Toast open={false} onOpenChange={onOpenChange}>
          Envío completado
        </Toast>
        <ToastViewport />
      </ToastProvider>,
    );
    expect(region().queryByText("Envío completado")).not.toBeInTheDocument();

    rerender(
      <ToastProvider>
        <Toast open onOpenChange={onOpenChange}>
          Envío completado
        </Toast>
        <ToastViewport />
      </ToastProvider>,
    );
    expect(region().queryByText("Envío completado")).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(2600);
    });
    // El estado lo manda el consumidor: Radix solo pide el cierre.
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("acepta un icono propio y permite quitarlo con icon={null}", () => {
    const { rerender } = montar(
      <Toast tone="success" icon={<svg data-testid="icono-propio" />}>
        Envío completado
      </Toast>,
    );
    expect(screen.getByTestId("icono-propio")).toBeInTheDocument();

    rerender(
      <ToastProvider>
        <Toast tone="success" icon={null}>
          Envío completado
        </Toast>
        <ToastViewport />
      </ToastProvider>,
    );
    expect(screen.queryByTestId("icono-propio")).not.toBeInTheDocument();
    expect(region().getByText("Envío completado")).toBeInTheDocument();
  });

  it("permite sobreescribir estilos por className", () => {
    montar(<Toast className="rounded-none">Envío completado</Toast>);
    // tailwind-merge debe descartar el rounded-lg de la base, no acumularlo.
    const cls = region().getByText("Envío completado").parentElement?.className ?? "";
    expect(cls).toContain("rounded-none");
    expect(cls).not.toContain("rounded-lg");
  });
});
