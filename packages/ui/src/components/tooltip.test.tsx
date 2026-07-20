import { beforeAll, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tooltip, TooltipProvider } from "./tooltip";

/* Tests de COMPORTAMIENTO. Las medidas del documento (r8, padding 7/11, fade de
 * 140ms, flecha de 8) se verifican contra el navegador: jsdom no aplica CSS,
 * asi que comprobar clases aqui seria tautologico.
 *
 * El retardo va a 0 en casi todos los casos para no depender de temporizadores:
 * lo que se prueba es que abre y cierra con los gestos correctos, no cuando. */

beforeAll(() => {
  // Radix Popper mide disparador y flecha con ResizeObserver, que jsdom no
  // trae. Sin este doble, cualquier render del contenido revienta.
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

describe("Tooltip", () => {
  it("no muestra nada hasta que hay interaccion", () => {
    render(
      <Tooltip label="Mas informacion">
        <button aria-label="Informacion">i</button>
      </Tooltip>,
    );
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("abre al pasar el cursor y cierra al salir", async () => {
    render(
      // disableHoverableContent hace que salir del disparador cierre sin pasar
      // por el area de gracia hacia la burbuja, que depende de geometria real.
      <Tooltip label="Mas informacion" delayDuration={0} disableHoverableContent>
        <button aria-label="Informacion">i</button>
      </Tooltip>,
    );
    const trigger = screen.getByRole("button", { name: "Informacion" });

    await userEvent.hover(trigger);
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Mas informacion");

    await userEvent.unhover(trigger);
    await waitFor(() => expect(screen.queryByRole("tooltip")).not.toBeInTheDocument());
  });

  it("abre con el foco de teclado y cierra al perderlo", async () => {
    // Sin esto el tooltip seria inaccesible para quien navega con el tabulador.
    render(
      <>
        <Tooltip label="Mostrar saldo" delayDuration={0}>
          <button aria-label="Mostrar saldo">o</button>
        </Tooltip>
        <button>Siguiente</button>
      </>,
    );

    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Mostrar saldo" })).toHaveFocus();
    expect(await screen.findByRole("tooltip")).toBeInTheDocument();

    await userEvent.tab();
    await waitFor(() => expect(screen.queryByRole("tooltip")).not.toBeInTheDocument());
  });

  it("cierra con Escape sin mover el foco del disparador", async () => {
    render(
      <Tooltip label="Copiar TikinTAG" delayDuration={0}>
        <button aria-label="Copiar">c</button>
      </Tooltip>,
    );
    const trigger = screen.getByRole("button", { name: "Copiar" });

    trigger.focus();
    expect(await screen.findByRole("tooltip")).toBeInTheDocument();

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("tooltip")).not.toBeInTheDocument());
    // El tooltip es apoyo: cerrarlo no puede sacar al usuario de donde estaba.
    expect(trigger).toHaveFocus();
  });

  it("describe al disparador en vez de nombrarlo", async () => {
    // El nombre accesible lo pone el disparador (aria-label); el tooltip solo
    // aporta la descripcion. Si el tooltip nombrara al boton, un icono sin
    // aria-label se quedaria sin nombre mientras el tooltip esta cerrado.
    render(
      <Tooltip label="Cobrar con QR" delayDuration={0}>
        <button aria-label="Cobrar">q</button>
      </Tooltip>,
    );
    const trigger = screen.getByRole("button", { name: "Cobrar" });

    trigger.focus();
    await screen.findByRole("tooltip");

    expect(trigger).toHaveAccessibleName("Cobrar");
    expect(trigger).toHaveAccessibleDescription("Cobrar con QR");
  });

  it("renderiza titulo y descripcion cuando se declara description", async () => {
    render(
      <Tooltip label="TikinTAG" description="Tu identificador para recibir dinero." defaultOpen>
        <button aria-label="Ayuda">?</button>
      </Tooltip>,
    );
    const tip = await screen.findByRole("tooltip");
    expect(tip).toHaveTextContent("TikinTAG");
    expect(tip).toHaveTextContent("Tu identificador para recibir dinero.");
  });

  it("expone el atajo como tecla, no como texto suelto", async () => {
    render(
      <Tooltip label="Buscar" shortcut="⌘K" defaultOpen>
        <button aria-label="Buscar">b</button>
      </Tooltip>,
    );
    const tip = await screen.findByRole("tooltip");
    // <kbd> importa: el lector de pantalla lo anuncia como tecla.
    expect(tip.querySelector("kbd")).toHaveTextContent("⌘K");
  });

  it("funciona en modo controlado", async () => {
    const onOpenChange = vi.fn();
    render(
      <Tooltip label="Editar" open={false} onOpenChange={onOpenChange} delayDuration={0}>
        <button aria-label="Editar">e</button>
      </Tooltip>,
    );

    await userEvent.hover(screen.getByRole("button", { name: "Editar" }));

    expect(onOpenChange).toHaveBeenCalledWith(true);
    // El padre no movio el valor, asi que la burbuja no aparece.
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("no exige un TooltipProvider por encima pero respeta el que haya", async () => {
    // Un Tooltip suelto monta su propio provider; si Radix no lo encontrara,
    // este render lanzaria.
    const { unmount } = render(
      <Tooltip label="Suelto" defaultOpen>
        <button aria-label="Suelto">s</button>
      </Tooltip>,
    );
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Suelto");
    unmount();

    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip label="Agrupado">
          <button aria-label="Agrupado">a</button>
        </Tooltip>
      </TooltipProvider>,
    );
    // El retardo del provider llega al tooltip sin repetirlo en cada uno.
    await userEvent.hover(screen.getByRole("button", { name: "Agrupado" }));
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Agrupado");
  });

  it("un disparador deshabilitado se queda fuera del alcance del teclado", async () => {
    // Un <button disabled> no recibe foco, asi que quien navega con el
    // tabulador nunca vera el tooltip. Por eso el componente documenta usar
    // aria-disabled y bloquear la accion en el handler cuando hay que explicar
    // POR QUE algo esta deshabilitado.
    render(
      <>
        <Tooltip label="No disponible" delayDuration={0}>
          <button aria-label="Cobrar" disabled>
            q
          </button>
        </Tooltip>
        <button>Siguiente</button>
      </>,
    );

    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Siguiente" })).toHaveFocus();
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("permite sobreescribir estilos por className", async () => {
    render(
      <Tooltip label="Editar" className="rounded-none" defaultOpen>
        <button aria-label="Editar">e</button>
      </Tooltip>,
    );
    const cls = (await screen.findByRole("tooltip")).className;
    // tailwind-merge descarta el rounded-sm de la burbuja en vez de acumularlo.
    expect(cls).toContain("rounded-none");
    expect(cls).not.toContain("rounded-sm");
  });

  it("no pone la etiqueta en mayusculas en JS", async () => {
    // La burbuja va en Ubuntu Sans y en caja normal: aqui no hay uppercase ni
    // por CSS ni por JS, y el texto llega tal cual al portapapeles.
    render(
      <Tooltip label="Siempre $0 en Tikin" defaultOpen>
        <button aria-label="Comision">i</button>
      </Tooltip>,
    );
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Siempre $0 en Tikin");
  });
});
