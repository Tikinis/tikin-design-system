import * as React from "react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toast } from "radix-ui";
import {
  Snackbar,
  SnackbarAction,
  SnackbarClose,
  SnackbarProvider,
  SnackbarViewport,
  type SnackbarProps,
} from "./snackbar";

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

/* La cuenta regresiva es decorativa (aria-hidden) y no tiene rol: se localiza
 * por el unico estilo en linea de la pieza, que es justo el que la sincroniza
 * con el temporizador (duracion y play-state). */
const cuenta = () => snack()?.querySelector<HTMLElement>('[style*="animation-duration"]') ?? null;

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

  it("con countdown=ring pinta el anillo y le pasa la circunferencia exacta", () => {
    setup({ countdown: "ring", duration: 5000 });

    // 2·π·9 = 56,548…, no el 57 redondeado del prototipo: si se redondea, el
    // trazo no cierra justo al agotarse el plazo.
    const svg = snack()?.querySelector("svg");
    expect(svg?.style.getPropertyValue("--tk-snack-ring-c")).toBe(String(2 * Math.PI * 9));

    // El arco animado es el unico con la duracion en linea, y va sobre el
    // mismo plazo que el temporizador.
    expect(cuenta()?.tagName.toLowerCase()).toBe("circle");
    expect(cuenta()?.style.animationDuration).toBe("5000ms");
  });

  it("con countdown=ring el icono cede la ranura leading al anillo", () => {
    setup({ countdown: "ring", icon: <svg data-testid="icono-propio" /> });

    // Documentado en el JSDoc de `icon`: solo hay una ranura y la ocupa el
    // anillo. Si algun dia se pintan los dos, este test lo delata.
    expect(screen.queryByTestId("icono-propio")).not.toBeInTheDocument();
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
        <Snackbar
          key="a"
          defaultOpen
          message="Movimiento eliminado"
          onOpenChange={onOpenChange}
          duration={5000}
        />
        <SnackbarViewport />
      </SnackbarProvider>,
    );

    avanzar(4000);
    // Llega otro aviso: el anterior se va y el nuevo entra con el plazo entero.
    rerender(
      <SnackbarProvider>
        <Snackbar
          key="b"
          defaultOpen
          message="Bolsillo archivado"
          onOpenChange={onOpenChange}
          duration={5000}
        />
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

  it("la cuenta se congela mientras el temporizador esta pausado", () => {
    vi.useFakeTimers();
    setup({ duration: 5000 });

    expect(cuenta()?.style.animationPlayState).toBe("running");
    act(() => {
      fireEvent.pointerMove(screen.getByRole("region"));
    });
    expect(cuenta()?.style.animationPlayState).toBe("paused");
  });

  it("un snackbar que nace con el viewport ya pausado no arranca su cuenta", () => {
    vi.useFakeTimers();
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <SnackbarProvider>
        <Snackbar key="a" defaultOpen message="Movimiento eliminado" duration={5000} />
        <SnackbarViewport />
      </SnackbarProvider>,
    );

    // El puntero entra en el viewport: Radix congela el temporizador y lo
    // recuerda en un ref del PROVIDER que sobrevive al cierre de la pieza.
    act(() => {
      fireEvent.pointerMove(screen.getByRole("region"));
    });

    // Llega otro aviso sin que el puntero se haya movido — el caso corriente:
    // se pulsa DESHACER con el cursor encima y el sistema responde con otro.
    rerender(
      <SnackbarProvider>
        <Snackbar
          key="b"
          defaultOpen
          message="Bolsillo archivado"
          onOpenChange={onOpenChange}
          duration={5000}
        />
        <SnackbarViewport />
      </SnackbarProvider>,
    );

    // Radix NO arranca el temporizador del recien llegado, asi que pasado el
    // plazo entero sigue en pantalla...
    avanzar(6000);
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(snack()).toBeInTheDocument();

    // ...y por tanto su cuenta tiene que nacer congelada, no vaciandose sobre
    // un plazo que nadie esta contando.
    expect(cuenta()?.style.animationPlayState).toBe("paused");
  });

  /* Regresion: la cuenta ignoraba la duracion heredada del provider y se
   * quedaba en el defecto de 5 s. Con `<SnackbarProvider duration={8000}>` —
   * 8 s es el tope del rango 5-8 que pide el documento — la barra se vaciaba a
   * los 5 s y el cierre real llegaba a los 8. */
  it("la cuenta sigue la duracion heredada del provider, no el defecto", () => {
    vi.useFakeTimers();
    const onOpenChange = vi.fn();
    render(
      <SnackbarProvider duration={8000}>
        <Snackbar defaultOpen message="Movimiento eliminado" onOpenChange={onOpenChange} />
        <SnackbarViewport />
      </SnackbarProvider>,
    );

    expect(cuenta()?.style.animationDuration).toBe("8000ms");

    // Y el temporizador real coincide: a los 5,2 s sigue en pantalla.
    avanzar(5200);
    expect(onOpenChange).not.toHaveBeenCalled();
    avanzar(3000);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("la duracion propia del snackbar gana a la del provider", () => {
    vi.useFakeTimers();
    const onOpenChange = vi.fn();
    render(
      <SnackbarProvider duration={8000}>
        <Snackbar
          defaultOpen
          duration={3000}
          message="Movimiento eliminado"
          onOpenChange={onOpenChange}
        />
        <SnackbarViewport />
      </SnackbarProvider>,
    );

    expect(cuenta()?.style.animationDuration).toBe("3000ms");
    avanzar(3100);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

describe("Snackbar · viewport", () => {
  /* Toast.Viewport exige el contexto del provider: sin el, Radix revienta. */
  const renderViewport = (props: React.ComponentProps<typeof SnackbarViewport> = {}) =>
    render(
      <SnackbarProvider>
        <SnackbarViewport {...props} />
      </SnackbarProvider>,
    );

  it("bottom-center centra la lista y bottom-left es el defecto", () => {
    const { unmount } = renderViewport();
    expect(screen.getByRole("list").className).toContain("left-0");
    unmount();

    renderViewport({ placement: "bottom-center" });
    expect(screen.getByRole("list").className).toContain("-translate-x-1/2");
  });

  it("el consumidor puede sacar el viewport de fixed por className", () => {
    // Es lo que hacen las matrices de la documentacion: sin esto no se pueden
    // pintar varios casos en linea.
    renderViewport({ className: "static" });
    const cls = screen.getByRole("list").className;
    expect(cls).toContain("static");
    expect(cls).not.toContain("fixed");
  });
});

/* Las piezas sueltas no encajan dentro de `<Snackbar>` — su API no acepta
 * children a proposito — asi que se prueban donde de verdad se usan: dentro de
 * un `Toast.Root` compuesto a mano. */
describe("Snackbar · piezas sueltas", () => {
  function setupPiezas() {
    const onAction = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <SnackbarProvider>
        <Toast.Root defaultOpen duration={Infinity} onOpenChange={onOpenChange}>
          <Toast.Title>Movimiento eliminado</Toast.Title>
          <SnackbarClose className="px-0">Cerrar</SnackbarClose>
          <SnackbarAction altText="Deshacer el borrado del movimiento" onClick={onAction}>
            Deshacer
          </SnackbarAction>
        </Toast.Root>
        <SnackbarViewport />
      </SnackbarProvider>,
    );
    return { onAction, onOpenChange };
  }

  it("SnackbarAction dispara su onClick y cierra la pieza", async () => {
    const { onAction, onOpenChange } = setupPiezas();

    await userEvent.click(screen.getByRole("button", { name: "Deshacer" }));

    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("SnackbarClose cierra sin ejecutar la accion", async () => {
    const { onAction, onOpenChange } = setupPiezas();

    await userEvent.click(screen.getByRole("button", { name: "Cerrar" }));

    expect(onAction).not.toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("las dos piezas dejan sobreescribir estilos por className", () => {
    setupPiezas();
    const cls = screen.getByRole("button", { name: "Cerrar" }).className;
    expect(cls).toContain("px-0");
    // tailwind-merge tiene que descartar el px-2.5 propio, no acumularlo.
    expect(cls).not.toContain("px-2.5");
  });
});
