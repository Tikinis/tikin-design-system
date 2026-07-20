import { afterEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toast, ToastAction, ToastProvider, ToastViewport } from "./toast";

/* Estos tests cubren COMPORTAMIENTO, no apariencia. Los VALORES visuales
 * (tinta 900, r12, icono 17, sombra alta) se verifican contra el navegador, no
 * aqui: jsdom no aplica CSS, asi que afirmar que una clase esta puesta no
 * demuestra que pinte nada.
 *
 * La excepcion son los dos tests del final, que no miran valores sino
 * contratos: que el className del consumidor gane a la base (tailwind-merge) y
 * que los @keyframes existan de verdad — ahi la clase ES el defecto que se
 * vigila, no una tautologia.
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

/** El <li> del toast. No lleva rol propio, asi que se llega por el mensaje. */
function toastRoot(mensaje: string) {
  return region().getByText(mensaje).parentElement!;
}

/**
 * Arrastra el toast `deltaY` pixeles hacia abajo y suelta.
 *
 * jsdom no implementa la API de captura de puntero y Radix la llama al arrancar
 * el arrastre. Se apuntala en el propio nodo, no en el setup compartido, para
 * no cambiarle el entorno al resto de la suite.
 */
function arrastrar(nodo: HTMLElement, deltaY: number) {
  Object.assign(nodo, {
    setPointerCapture: () => {},
    hasPointerCapture: () => false,
    releasePointerCapture: () => {},
  });
  fireEvent.pointerDown(nodo, { button: 0, clientX: 0, clientY: 0, pointerId: 1 });
  fireEvent.pointerMove(nodo, { clientX: 0, clientY: deltaY, pointerId: 1 });
  fireEvent.pointerUp(nodo, { clientX: 0, clientY: deltaY, pointerId: 1 });
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

  it("cada tono trae su glifo, y el neutro ninguno", () => {
    // Es lo unico que hace la prop `tone`, y hasta ahora no lo miraba nadie.
    const casos: Array<[Parameters<typeof Toast>[0]["tone"], string | null]> = [
      ["neutral", null],
      ["success", "toast-glyph-check"],
      ["error", "toast-glyph-warning"],
      ["loading", "toast-glyph-spinner"],
    ];

    for (const [tone, slot] of casos) {
      const { unmount } = montar(<Toast tone={tone}>Envío completado</Toast>);
      const lista = screen.getByRole("region");

      if (slot === null) {
        // Sin glifo no debe quedar ni el hueco del icono comiendo el gap.
        expect(lista.querySelector("[data-slot='toast-icon']")).toBeNull();
      } else {
        expect(lista.querySelector(`[data-slot='${slot}']`)).not.toBeNull();
      }
      unmount();
    }
  });

  it("el arrastre hacia abajo descarta el toast", () => {
    montar(<Toast>Envío completado</Toast>);
    // El umbral de Radix son 50px; 80 lo cruza de sobra. La direccion es la del
    // provider (abajo), asi que el delta tiene que ser Y positivo.
    arrastrar(toastRoot("Envío completado"), 80);

    expect(region().queryByText("Envío completado")).not.toBeInTheDocument();
  });

  it("un arrastre corto no descarta: el toast vuelve a su sitio", () => {
    montar(<Toast>Envío completado</Toast>);
    // 20px se queda por debajo del umbral de 50: es un roce, no un descarte.
    arrastrar(toastRoot("Envío completado"), 20);

    expect(region().queryByText("Envío completado")).toBeInTheDocument();
  });

  it("el lector de pantalla oye el altText de la accion, no su label", async () => {
    montar(
      <Toast
        action={<ToastAction altText="Deshacer el borrado del movimiento">Deshacer</ToastAction>}
      >
        Movimiento eliminado
      </Toast>,
    );

    const anuncio = screen.getByRole("status");
    // Quien no llega al boton a tiempo necesita la frase completa; "Deshacer",
    // a secas y fuera de pantalla, no dice que se deshace.
    await waitFor(() => expect(anuncio).toHaveTextContent("Deshacer el borrado del movimiento"));
    expect(anuncio).not.toHaveTextContent(/Deshacer$/);
  });

  it("F8 deja un rastro visible al llegar a la lista", () => {
    montar(<Toast>Envío completado</Toast>);
    fireEvent.keyDown(document, { key: "F8", code: "F8" });

    // La <ol> lleva outline-none; sin anillo propio el salto de foco seria
    // invisible y el unico camino de teclado hasta el toast quedaria a ciegas.
    const lista = screen.getByRole("list");
    expect(lista).toHaveFocus();
    expect(lista.className).toContain("focus:ring-2");
  });

  it("permite sobreescribir estilos por className", () => {
    montar(<Toast className="rounded-none">Envío completado</Toast>);
    // tailwind-merge debe descartar el rounded-lg de la base, no acumularlo.
    const cls = region().getByText("Envío completado").parentElement?.className ?? "";
    expect(cls).toContain("rounded-none");
    expect(cls).not.toContain("rounded-lg");
  });

  it("la salida se anima con @keyframes reales, no con una transicion", () => {
    montar(<Toast>Envío completado</Toast>);
    const cls = region().getByText("Envío completado").parentElement?.className ?? "";

    // Presence de Radix desmonta el nodo en el mismo tick si el estilo
    // calculado no declara animationName. Con `transition` la regla de cierre
    // era codigo muerto: nunca llegaba a pintarse. Ergo las dos mitades tienen
    // que existir — la clase que la invoca Y los @keyframes que la definen.
    expect(cls).toContain("data-[state=closed]:animate-[tk-toast-out");
    expect(cls).not.toContain("transition-[opacity,transform]");

    const reglas = Array.from(document.querySelectorAll("style"))
      .map((s) => s.textContent ?? "")
      .join("");
    expect(reglas).toContain("@keyframes tk-toast-out");
    expect(reglas).toContain("@keyframes tk-toast-in");
  });

  it("no repite los @keyframes por cada toast en pantalla", () => {
    render(
      <ToastProvider>
        <Toast>Uno</Toast>
        <Toast>Dos</Toast>
        <Toast>Tres</Toast>
        <ToastViewport />
      </ToastProvider>,
    );

    // React deduplica por `href`: tres toasts, una sola regla en el documento.
    const bloques = Array.from(document.querySelectorAll("style")).filter((s) =>
      (s.textContent ?? "").includes("@keyframes tk-toast-in"),
    );
    expect(bloques).toHaveLength(1);
  });
});
