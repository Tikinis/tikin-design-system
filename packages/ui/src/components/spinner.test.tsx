import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoadingOverlay, Spinner } from "./spinner";

/* Estos tests cubren COMPORTAMIENTO, no apariencia. Las medidas del documento
 * (16/24/40, trazo 2/2.5/3, giro de 0.7s) se verifican contra el navegador, no
 * aqui: jsdom no aplica CSS ni ejecuta animaciones, asi que comprobar clases
 * seria tautologico. */

describe("Spinner", () => {
  it("se anuncia como region viva con un texto por defecto", () => {
    render(<Spinner />);
    const status = screen.getByRole("status");
    // Lo que anuncia una region viva es su CONTENIDO, no su nombre accesible:
    // el rol status no toma el nombre del contenido, asi que el texto tiene que
    // estar dentro del elemento, no en un aria-label.
    expect(status).toHaveTextContent("Cargando");
    expect(status).toHaveAttribute("aria-live", "polite");
  });

  it("acepta un texto propio para la espera concreta", () => {
    render(<Spinner label="Cargando movimientos" />);
    expect(screen.getByRole("status")).toHaveTextContent("Cargando movimientos");
  });

  it("con label={null} sale del arbol de accesibilidad", () => {
    // Caso decorativo: el contexto ya esta anunciado por otro elemento y dos
    // anuncios para una sola espera son ruido.
    const { container } = render(<Spinner label={null} />);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });

  it("no es enfocable: no interrumpe el recorrido del tabulador", async () => {
    render(
      <>
        <button type="button">Antes</button>
        <Spinner />
        <button type="button">Despues</button>
      </>,
    );
    screen.getByRole("button", { name: "Antes" }).focus();
    await userEvent.tab();
    // El foco salta el spinner y va directo al siguiente control.
    expect(screen.getByRole("button", { name: "Despues" })).toHaveFocus();
  });

  it("expone la referencia al elemento del DOM", () => {
    let node: HTMLSpanElement | null = null;
    render(<Spinner ref={(el) => void (node = el)} />);
    expect(node).toBeInstanceOf(HTMLSpanElement);
  });

  it("permite sobreescribir estilos por className", () => {
    render(<Spinner className="size-8" />);
    // tailwind-merge debe descartar el size-6 del tamaño M, no acumularlo.
    const cls = screen.getByRole("status").className;
    expect(cls).toContain("size-8");
    expect(cls).not.toContain("size-6");
  });
});

describe("LoadingOverlay", () => {
  it("con open={false} no renderiza nada", () => {
    const { container } = render(<LoadingOverlay open={false} />);
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("se anuncia una sola vez, aunque contenga un spinner dentro", () => {
    render(<LoadingOverlay label="Cargando tu cuenta" />);
    // El spinner interior va decorativo: si tambien fuera region viva, el
    // lector de pantalla leeria la misma espera dos veces.
    const regions = screen.getAllByRole("status");
    expect(regions).toHaveLength(1);
    expect(regions[0]).toHaveTextContent("Cargando tu cuenta");
    expect(regions[0]).toHaveAttribute("aria-busy", "true");
  });

  it("mantiene el texto en el DOM aunque no se vea", () => {
    render(<LoadingOverlay label="Cargando movimientos" />);
    // Oculto por CSS (sr-only), nunca por display:none ni quitandolo: es el
    // unico texto que tiene el lector de pantalla.
    expect(screen.getByText("Cargando movimientos")).toBeInTheDocument();
  });

  it("no altera el texto visible en JS", () => {
    // El estilo mono en mayusculas del sistema se aplica por CSS. Aqui el label
    // es prosa y debe conservar su capitalizacion tal cual.
    render(<LoadingOverlay showLabel label="Cargando movimientos…" />);
    expect(screen.getByText("Cargando movimientos…")).toBeInTheDocument();
  });

  it("por seccion se queda dentro de su contenedor", () => {
    const { container } = render(
      <div data-testid="seccion">
        <LoadingOverlay scope="container" />
      </div>,
    );
    expect(screen.getByTestId("seccion")).toContainElement(screen.getByRole("status"));
    expect(container).not.toBeEmptyDOMElement();
  });

  it("a pantalla completa se monta en el body, fuera del arbol que lo declara", () => {
    // Un `position: fixed` se ancla al ancestro transformado mas cercano; sin
    // portal, cualquier transform por encima encajaria la pantalla de arranque
    // dentro de una tarjeta.
    const { container } = render(
      <div style={{ transform: "translateZ(0)" }}>
        <LoadingOverlay scope="screen" brand="tikin" />
      </div>,
    );
    const status = screen.getByRole("status");
    expect(status.parentElement).toBe(document.body);
    expect(container).not.toContainElement(status);
    expect(screen.getByText("tikin")).toBeInTheDocument();
  });

  it("limpia el nodo del body al cerrarse y al desmontarse", () => {
    // Una capa a pantalla completa que se quedase colgada del body taparia la
    // aplicacion entera sin nada que la cierre. Es el fallo mas caro posible en
    // este componente, asi que se cubre en las dos salidas: open=false y unmount.
    const { rerender, unmount } = render(<LoadingOverlay scope="screen" />);
    expect(screen.getByRole("status").parentElement).toBe(document.body);

    rerender(<LoadingOverlay scope="screen" open={false} />);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();

    rerender(<LoadingOverlay scope="screen" open />);
    expect(screen.getByRole("status")).toBeInTheDocument();

    unmount();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("permite desactivar el portal explicitamente", () => {
    render(
      <div data-testid="host">
        <LoadingOverlay scope="screen" portal={false} />
      </div>,
    );
    expect(screen.getByTestId("host")).toContainElement(screen.getByRole("status"));
  });

  it("no roba el foco al abrirse", async () => {
    // A diferencia de un modal, no hay nada que decidir: mover el foco aqui
    // dejaria al usuario en un elemento sin acciones.
    const { rerender } = render(
      <>
        <button type="button">Recargar</button>
        <LoadingOverlay open={false} />
      </>,
    );
    const trigger = screen.getByRole("button", { name: "Recargar" });
    trigger.focus();

    rerender(
      <>
        <button type="button">Recargar</button>
        <LoadingOverlay open />
      </>,
    );
    expect(trigger).toHaveFocus();
  });

  it("no atrapa el foco ni se cierra con Escape", async () => {
    // Deliberado: una espera no es descartable por teclado, y encerrar el
    // tabulador en una caja sin salida seria una trampa. Si hace falta
    // semantica modal, se usa Modal.
    render(
      <>
        <button type="button">Antes</button>
        <LoadingOverlay scope="container" />
        <button type="button">Despues</button>
      </>,
    );
    screen.getByRole("button", { name: "Antes" }).focus();

    await userEvent.keyboard("{Escape}");
    expect(screen.getByRole("status")).toBeInTheDocument();

    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Despues" })).toHaveFocus();
  });

  it("permite sobreescribir estilos por className", () => {
    render(<LoadingOverlay scope="container" className="z-0" />);
    const cls = screen.getByRole("status").className;
    expect(cls).toContain("z-0");
    expect(cls).not.toContain("z-10");
  });
});
