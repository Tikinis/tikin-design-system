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
    // por CSS ni por JS, asi que el texto del DOM es el que escribio quien lo
    // consume. Importa porque un .toUpperCase() en JS si cambiaria lo que lee
    // un lector de pantalla, no solo lo que se ve.
    render(
      <Tooltip label="Siempre $0 en Tikin" defaultOpen>
        <button aria-label="Comision">i</button>
      </Tooltip>,
    );
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Siempre $0 en Tikin");
  });

  it("dibuja la flecha por defecto y la quita con arrow={false}", async () => {
    // "FLECHA AL ORIGEN" es uno de los tres principios del documento, y es la
    // unica pieza visual con interruptor. Sin este test, borrar el
    // <TooltipPrimitive.Arrow> no rompe nada.
    const { unmount } = render(
      <Tooltip label="Con flecha" defaultOpen>
        <button aria-label="Con flecha">a</button>
      </Tooltip>,
    );
    expect((await screen.findByRole("tooltip")).querySelector("svg")).not.toBeNull();
    unmount();

    render(
      <Tooltip label="Sin flecha" arrow={false} defaultOpen>
        <button aria-label="Sin flecha">b</button>
      </Tooltip>,
    );
    expect((await screen.findByRole("tooltip")).querySelector("svg")).toBeNull();
  });

  it("pasa side y align a Radix en vez de quedarselos", async () => {
    // El componente fija sus propios defaults (top / center / 12px) sobre los
    // de Radix; el riesgo es que al hacerlo dejen de propagarse los del
    // consumidor. data-side y data-align son la unica huella observable.
    render(
      <Tooltip label="A la derecha" side="right" align="start" defaultOpen>
        <button aria-label="A la derecha">r</button>
      </Tooltip>,
    );
    const tip = await screen.findByRole("tooltip");
    expect(tip).toHaveAttribute("data-side", "right");
    expect(tip).toHaveAttribute("data-align", "start");
  });

  it("por defecto sale arriba y centrado, como pide el documento", async () => {
    render(
      <Tooltip label="Arriba" defaultOpen>
        <button aria-label="Arriba">t</button>
      </Tooltip>,
    );
    const tip = await screen.findByRole("tooltip");
    expect(tip).toHaveAttribute("data-side", "top");
    expect(tip).toHaveAttribute("data-align", "center");
  });

  /* Este caso NO lo puede coger el compilador: las declaraciones de
     radix-ui@1.6.3 resuelven a `any`, asi que `children` es `any` por mucho que
     el componente lo declare mas estrecho (ver la nota en TooltipProps). El
     test deja constancia de lo unico que si es observable: con el disparador
     por defecto, un hijo que no sea un elemento revienta el render entero en
     vez de degradar en silencio. */
  it("un disparador que no es un unico elemento revienta el render", () => {
    // React ademas escupe el error por consola; aqui solo interesa el throw.
    const quieto = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Tooltip label="Buscar">texto plano</Tooltip>)).toThrow();
    quieto.mockRestore();
  });

  it("con triggerAsChild={false} envuelve el contenido en su propio boton", async () => {
    // La otra cara del test anterior: estrechar el tipo no puede quitarle al
    // consumidor el caso en el que un nodo cualquiera si es valido.
    render(
      <Tooltip label="Ayuda" triggerAsChild={false} defaultOpen>
        Pulsa aqui
      </Tooltip>,
    );
    expect(screen.getByRole("button", { name: "Pulsa aqui" })).toBeInTheDocument();
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Ayuda");
  });
});

describe("Tooltip · interlineado", () => {
  /* La altura de 29px de la burbuja simple (13 * ~1.15 + 7 + 7) depende de que
     el interlineado llegue vivo hasta el elemento. Declarado suelto en la base
     no llegaba: tailwind-merge considera que text-* y leading-* compiten por lo
     mismo, asi que el tamaño de la variante borraba el leading anterior y la
     burbuja heredaba el 1.5 del preflight. */

  it("el interlineado viaja pegado al tamaño y sobrevive al merge", async () => {
    render(
      <Tooltip label="Copiar" delayDuration={0} disableHoverableContent>
        <button type="button" aria-label="Accion">
          A
        </button>
      </Tooltip>,
    );
    await userEvent.hover(screen.getByRole("button", { name: "Accion" }));
    const burbuja = await screen.findByRole("tooltip");
    expect(burbuja.className).toContain("text-[13px]/[normal]");
    // Un leading suelto volveria a ser borrado por el tamaño de la variante.
    expect(burbuja.className).not.toMatch(/(?:^|\s)leading-\[normal\]/);
  });
});
