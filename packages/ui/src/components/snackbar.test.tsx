import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Snackbar, SnackbarProvider, SnackbarViewport, type SnackbarProps } from "./snackbar";

/* Tests de COMPORTAMIENTO, no de apariencia. Las medidas (r12, padding 12/16,
 * barra de 3px, mono 13) se verifican contra el navegador: jsdom no aplica CSS,
 * asi que comprobar clases seria tautologico.
 *
 * Lo que si se cubre aqui es lo que puede romperse de verdad: el temporizador,
 * la pausa, el teclado y la relacion accion ↔ cierre.
 *
 * El fichero esta partido en dos bloques a proposito. userEvent y los timers
 * falsos de vitest no se llevan bien (userEvent espera con promesas que el reloj
 * falso nunca resuelve), asi que las interacciones van con reloj real y el
 * temporizador con reloj falso y fireEvent. */

beforeAll(() => {
  /* Radix implementa el gesto de descarte con Pointer Capture, que jsdom no
   * trae. Sin estos tres stubs, cualquier clic sobre la pieza revienta con
   * "hasPointerCapture is not a function". No va en el setup compartido porque
   * es una carencia de esta suite, no del entorno entero. */
  Element.prototype.hasPointerCapture ??= () => false;
  Element.prototype.setPointerCapture ??= () => {};
  Element.prototype.releasePointerCapture ??= () => {};
});

function setup(props: Partial<SnackbarProps> = {}) {
  const onOpenChange = vi.fn();
  const utils = render(
    <SnackbarProvider>
      <Snackbar defaultOpen message="Movimiento eliminado" onOpenChange={onOpenChange} {...props} />
      <SnackbarViewport />
    </SnackbarProvider>,
  );
  return { ...utils, onOpenChange };
}

/** La pieza es el <li> del viewport: Radix no le pone un rol propio. */
const snack = () => screen.queryByRole("listitem");

describe("Snackbar", () => {
  it("muestra el mensaje y la accion", () => {
    setup({ actionLabel: "Deshacer" });

    expect(snack()).toHaveTextContent("Movimiento eliminado");
    expect(screen.getByRole("button", { name: "Deshacer" })).toBeInTheDocument();
  });

  it("no pone el label de la accion en mayusculas en JS, solo por CSS", () => {
    setup({ actionLabel: "Deshacer" });
    // Importa para el nombre accesible y para lo que se copia al portapapeles.
    expect(screen.queryByRole("button", { name: "DESHACER" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Deshacer" })).toBeInTheDocument();
  });

  it("al pulsar deshacer dispara onAction y cierra", async () => {
    const onAction = vi.fn();
    const { onOpenChange } = setup({ actionLabel: "Deshacer", onAction });

    await userEvent.click(screen.getByRole("button", { name: "Deshacer" }));

    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(snack()).not.toBeInTheDocument();
  });

  it("la accion es alcanzable con teclado y se activa con Enter", async () => {
    const onAction = vi.fn();
    setup({ actionLabel: "Deshacer", onAction });

    // La pieza entera es enfocable (Radix le pone tabIndex) y desde ella se
    // llega a la accion sin tocar el raton.
    await userEvent.tab();
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Deshacer" })).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("Escape cierra el snackbar cuando el foco esta dentro", async () => {
    const { onOpenChange } = setup({ actionLabel: "Deshacer" });

    act(() => screen.getByRole("button", { name: "Deshacer" }).focus());
    await userEvent.keyboard("{Escape}");

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(snack()).not.toBeInTheDocument();
  });

  it("con dos acciones, cerrar no ejecuta la principal", async () => {
    const onAction = vi.fn();
    const { onOpenChange } = setup({
      message: "No se pudo enviar",
      closeLabel: "Cerrar",
      actionLabel: "Reintentar",
      onAction,
    });

    await userEvent.click(screen.getByRole("button", { name: "Cerrar" }));

    expect(onAction).not.toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("en loading no ofrece accion y se marca como ocupado", () => {
    setup({ loading: true, message: "Archivando bolsillo…", actionLabel: "Deshacer" });

    // La accion desaparece a proposito: aun no hay nada que deshacer.
    expect(screen.queryByRole("button", { name: "Deshacer" })).not.toBeInTheDocument();
    expect(snack()).toHaveAttribute("aria-busy", "true");
  });

  it("incluye el detalle de la segunda linea en el contenido de la pieza", () => {
    setup({ message: "Transferencia cancelada", description: "$ 250.000 a $mariarojas" });
    expect(snack()).toHaveTextContent("$ 250.000 a $mariarojas");
  });

  it("permite sobreescribir estilos por className", () => {
    setup({ className: "rounded-none" });
    // tailwind-merge debe descartar el rounded-lg de la pieza, no acumularlo.
    const cls = snack()?.className ?? "";
    expect(cls).toContain("rounded-none");
    expect(cls).not.toContain("rounded-lg");
  });

  it("es alcanzable con el atajo F8 sin recorrer la pagina", () => {
    setup({ actionLabel: "Deshacer" });

    // Radix registra F8 en document para saltar al viewport: es la unica via
    // razonable de llegar a un aviso efimero desde el otro extremo del DOM. Se
    // dispara con fireEvent y no con userEvent porque el mapa de teclas de
    // user-event no incluye las teclas de funcion y emitiria code "Unknown",
    // que es justo lo que Radix compara.
    fireEvent.keyDown(document, { key: "F8", code: "F8" });

    // El foco va a la <ol>, no a la region que la envuelve.
    expect(screen.getByRole("list")).toHaveFocus();
  });

  it("en modo controlado no aparece mientras open sea false", () => {
    render(
      <SnackbarProvider>
        <Snackbar open={false} message="Movimiento eliminado" />
        <SnackbarViewport />
      </SnackbarProvider>,
    );
    expect(snack()).not.toBeInTheDocument();
  });
});

describe("Snackbar · temporizador", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  /* Radix cierra desde un setTimeout. Con reloj falso hay que empujarlo dentro
   * de act() o React no procesa el cambio de estado antes del assert. */
  function avanzar(ms: number) {
    act(() => {
      vi.advanceTimersByTime(ms);
    });
  }

  it("se cierra solo al agotarse la duracion", () => {
    vi.useFakeTimers();
    const { onOpenChange } = setup({ duration: 5000 });

    avanzar(4900);
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(snack()).toBeInTheDocument();

    avanzar(200);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(snack()).not.toBeInTheDocument();
  });

  it("respeta la duracion aunque la cuenta regresiva este oculta", () => {
    vi.useFakeTimers();
    const { onOpenChange } = setup({ countdown: "none", duration: 3000 });

    avanzar(3100);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("en loading no se cierra solo: lo cierra quien lanzo el proceso", () => {
    vi.useFakeTimers();
    const { onOpenChange } = setup({ loading: true, message: "Archivando bolsillo…" });

    avanzar(60_000);
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(snack()).toBeInTheDocument();
  });

  it("remontar por key reinicia el plazo: es como se cumple 'uno a la vez'", () => {
    vi.useFakeTimers();
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <SnackbarProvider>
        <Snackbar key="a" defaultOpen message="Movimiento eliminado" onOpenChange={onOpenChange} duration={5000} />
        <SnackbarViewport />
      </SnackbarProvider>,
    );

    avanzar(4000);
    // Llega otro aviso: el anterior se va y el nuevo entra con el plazo entero.
    rerender(
      <SnackbarProvider>
        <Snackbar key="b" defaultOpen message="Bolsillo archivado" onOpenChange={onOpenChange} duration={5000} />
        <SnackbarViewport />
      </SnackbarProvider>,
    );
    expect(snack()).toHaveTextContent("Bolsillo archivado");

    // Si el temporizador no se hubiera reiniciado, a los 1100ms ya habria cerrado.
    avanzar(1100);
    expect(snack()).toBeInTheDocument();
    avanzar(4000);
    expect(snack()).not.toBeInTheDocument();
  });

  it("pausa con el puntero encima y reanuda con el resto del plazo al salir", () => {
    vi.useFakeTimers();
    const onPause = vi.fn();
    const onResume = vi.fn();
    const { onOpenChange } = setup({ duration: 5000, onPause, onResume });

    // Radix escucha pointermove/pointerleave en el envoltorio del viewport.
    const zona = screen.getByRole("region");

    avanzar(3000);
    act(() => {
      fireEvent.pointerMove(zona);
    });
    expect(onPause).toHaveBeenCalled();

    // Con el temporizador congelado no se cierra por mucho que pase el tiempo.
    avanzar(10_000);
    expect(onOpenChange).not.toHaveBeenCalled();

    act(() => {
      fireEvent.pointerLeave(zona);
    });
    expect(onResume).toHaveBeenCalled();

    // Al reanudar solo queda el resto del plazo, no los 5s enteros.
    avanzar(1900);
    expect(onOpenChange).not.toHaveBeenCalled();
    avanzar(200);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
