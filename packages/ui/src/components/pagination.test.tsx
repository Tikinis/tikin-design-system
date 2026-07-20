import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  getPaginationRange,
  LoadMore,
  LoadMoreSentinel,
  Pagination,
  PaginationBar,
  PaginationJump,
} from "./pagination";

/* Estos tests cubren COMPORTAMIENTO, no apariencia. La geometria (celda 36,
 * r10, flecha con borde, barra h4) se verifica contra el navegador, no aqui:
 * jsdom no aplica CSS, asi que comprobar clases seria tautologico. */

describe("getPaginationRange", () => {
  it("no colapsa nada mientras quepan todas las paginas", () => {
    // Con 7 o menos (1 + 1 + actual + 2 vecinas + 2 huecos) sustituir un numero
    // por "…" no ahorraria ni una celda.
    expect(getPaginationRange(1, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("colapsa solo por la derecha cuando la actual esta al principio", () => {
    expect(getPaginationRange(2, 12)).toEqual([1, 2, 3, 4, 5, "ellipsis", 12]);
  });

  it("colapsa solo por la izquierda cuando la actual esta al final", () => {
    expect(getPaginationRange(11, 12)).toEqual([1, "ellipsis", 8, 9, 10, 11, 12]);
  });

  it("colapsa por los dos lados en el centro, mostrando primera, ultima y vecinas", () => {
    expect(getPaginationRange(6, 12)).toEqual([1, "ellipsis", 5, 6, 7, "ellipsis", 12]);
  });

  it("nunca pone puntos suspensivos para saltarse una sola pagina", () => {
    // El hueco ocuparia lo mismo que el numero que oculta: perdida neta.
    const range = getPaginationRange(4, 12);
    expect(range).toEqual([1, 2, 3, 4, 5, "ellipsis", 12]);
  });

  it("satura la pagina fuera de rango y admite lista vacia", () => {
    expect(getPaginationRange(99, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getPaginationRange(-3, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getPaginationRange(1, 0)).toEqual([]);
  });

  it("respeta siblingCount", () => {
    expect(getPaginationRange(10, 20, 2)).toEqual([1, "ellipsis", 8, 9, 10, 11, 12, "ellipsis", 20]);
  });
});

describe("Pagination", () => {
  it("es un nav con nombre y una celda por pagina visible", () => {
    render(<Pagination page={1} totalPages={5} />);
    const nav = screen.getByRole("navigation", { name: "Paginación" });
    // 5 paginas + prev + next.
    expect(within(nav).getAllByRole("button")).toHaveLength(7);
  });

  it("marca la pagina en curso con aria-current y la anuncia en texto", () => {
    render(<Pagination page={3} totalPages={12} />);
    expect(screen.getByRole("button", { name: "Página 3" })).toHaveAttribute("aria-current", "page");
    // El color no llega al lector de pantalla: hace falta decirlo con palabras.
    expect(screen.getByRole("navigation")).toHaveTextContent("Página 3 de 12");
  });

  it("notifica la pagina destino al pulsar un numero o una flecha", async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={3} totalPages={12} onPageChange={onPageChange} />);

    await userEvent.click(screen.getByRole("button", { name: "Página 4" }));
    expect(onPageChange).toHaveBeenCalledWith(4);

    await userEvent.click(screen.getByRole("button", { name: "Página siguiente" }));
    expect(onPageChange).toHaveBeenCalledWith(4);

    await userEvent.click(screen.getByRole("button", { name: "Página anterior" }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("no notifica al pulsar la pagina en la que ya estas", async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={3} totalPages={12} onPageChange={onPageChange} />);
    // Si notificase, el consumidor recargaria la tabla sin motivo.
    await userEvent.click(screen.getByRole("button", { name: "Página 3" }));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("en los extremos las flechas siguen ahi, enfocables y sin efecto", async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={1} totalPages={12} onPageChange={onPageChange} />);
    const prev = screen.getByRole("button", { name: "Página anterior" });

    expect(prev).toHaveAttribute("aria-disabled", "true");
    await userEvent.click(prev);
    expect(onPageChange).not.toHaveBeenCalled();

    /* Deliberadamente NO usa el atributo disabled: al llegar al tope pulsando,
       el foco se caeria al body justo en el ultimo clic. */
    expect(prev).not.toBeDisabled();
    prev.focus();
    expect(prev).toHaveFocus();
  });

  it("la flecha siguiente se apaga en la ultima pagina", async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={12} totalPages={12} onPageChange={onPageChange} />);
    const next = screen.getByRole("button", { name: "Página siguiente" });
    expect(next).toHaveAttribute("aria-disabled", "true");
    await userEvent.click(next);
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("se opera con teclado sin manejadores a mano", async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={2} totalPages={5} onPageChange={onPageChange} />);

    // Son <button> nativos dentro de un <nav>: Tab los recorre en orden visual
    // y Enter o Espacio activan.
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Página anterior" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(onPageChange).toHaveBeenCalledWith(1);

    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Página 1" })).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Página 2" })).toHaveFocus();
    await userEvent.keyboard(" ");
    // Es la pagina actual: espacio no dispara ningun cambio.
    expect(onPageChange).toHaveBeenCalledTimes(1);
  });

  it("satura una pagina fuera de rango en vez de quedarse sin celda activa", () => {
    const { rerender } = render(<Pagination page={99} totalPages={5} />);
    expect(screen.getByRole("button", { name: "Página 5" })).toHaveAttribute("aria-current", "page");

    rerender(<Pagination page={-2} totalPages={5} />);
    expect(screen.getByRole("button", { name: "Página 1" })).toHaveAttribute("aria-current", "page");
  });

  it("dentro de un formulario ninguna celda lo envia", async () => {
    // Un <button> sin type dentro de un <form> envia. Es el fallo clasico.
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Pagination page={1} totalPages={5} />
      </form>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Página 2" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("el formato labels solo pinta dos botones, con su texto sin tocar", async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={2} totalPages={5} format="labels" onPageChange={onPageChange} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
    // Las mayusculas las pone el CSS, no JS: el texto accesible y el copiado al
    // portapapeles conservan su capitalizacion.
    expect(buttons[0]).toHaveTextContent("Anterior");
    expect(buttons[1]).toHaveTextContent("Siguiente");

    await userEvent.click(buttons[1]!);
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("el formato compacto dice la pagina y el total en texto visible", async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={3} totalPages={12} format="compact" onPageChange={onPageChange} />);

    expect(screen.getByText("Página 3 de 12")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Página 4" })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Página siguiente" }));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it("acepta textos propios sin perder el resto", () => {
    render(<Pagination page={1} totalPages={3} labels={{ next: "Next page" }} />);
    expect(screen.getByRole("button", { name: "Next page" })).toBeInTheDocument();
    // Los que no se sobreescriben siguen siendo los del sistema.
    expect(screen.getByRole("button", { name: "Página anterior" })).toBeInTheDocument();
  });

  it("un aria-label propio gana sobre el del sistema", () => {
    render(<Pagination page={1} totalPages={3} aria-label="Movimientos" />);
    expect(screen.getByRole("navigation", { name: "Movimientos" })).toBeInTheDocument();
  });

  it("permite sobreescribir estilos por className", () => {
    render(<Pagination page={1} totalPages={3} className="inline-flex" />);
    // tailwind-merge debe descartar el flex del layout numerico.
    const cls = screen.getByRole("navigation").className;
    expect(cls).toContain("inline-flex");
    expect(cls).not.toMatch(/(^|\s)flex(\s|$)/);
  });

  it("acepta cero paginas sin romperse", () => {
    render(<Pagination page={1} totalPages={0} />);
    // Solo quedan las dos flechas, ambas en tope.
    expect(screen.getAllByRole("button")).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Página siguiente" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });
});

describe("PaginationJump", () => {
  it("confirma con Enter, no en cada pulsacion", async () => {
    const onPageChange = vi.fn();
    render(<PaginationJump page={3} totalPages={12} onPageChange={onPageChange} />);
    const input = screen.getByRole("textbox", { name: "Ir a la página" });

    await userEvent.clear(input);
    await userEvent.type(input, "10");
    // Escribir "10" pasa por "1": notificar ahi recargaria la pagina equivocada.
    expect(onPageChange).not.toHaveBeenCalled();

    await userEvent.keyboard("{Enter}");
    expect(onPageChange).toHaveBeenCalledWith(10);
  });

  it("confirma tambien al salir del campo", async () => {
    const onPageChange = vi.fn();
    render(<PaginationJump page={3} totalPages={12} onPageChange={onPageChange} />);
    const input = screen.getByRole("textbox", { name: "Ir a la página" });

    await userEvent.clear(input);
    await userEvent.type(input, "7");
    await userEvent.tab();
    expect(onPageChange).toHaveBeenCalledWith(7);
  });

  it("satura al rango valido en vez de pedir una pagina inexistente", async () => {
    const onPageChange = vi.fn();
    render(<PaginationJump page={3} totalPages={12} onPageChange={onPageChange} />);
    const input = screen.getByRole("textbox", { name: "Ir a la página" });

    await userEvent.clear(input);
    await userEvent.type(input, "99{Enter}");
    expect(onPageChange).toHaveBeenCalledWith(12);
    expect(input).toHaveValue("12");
  });

  it("con texto invalido vuelve a la ultima pagina valida y no notifica", async () => {
    const onPageChange = vi.fn();
    render(<PaginationJump page={3} totalPages={12} onPageChange={onPageChange} />);
    const input = screen.getByRole("textbox", { name: "Ir a la página" });

    await userEvent.clear(input);
    await userEvent.type(input, "abc{Enter}");
    expect(onPageChange).not.toHaveBeenCalled();
    expect(input).toHaveValue("3");
  });

  it("se sincroniza cuando la pagina cambia desde fuera", () => {
    const { rerender } = render(<PaginationJump page={3} totalPages={12} />);
    rerender(<PaginationJump page={8} totalPages={12} />);
    // Sin sincronizar, el campo seguiria diciendo 3 tras pulsar las flechas.
    expect(screen.getByRole("textbox", { name: "Ir a la página" })).toHaveValue("8");
  });

  it("dentro de un formulario, Enter no lo envia", async () => {
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <PaginationJump page={3} totalPages={12} />
      </form>,
    );
    await userEvent.type(screen.getByRole("textbox", { name: "Ir a la página" }), "{Enter}");
    expect(onSubmit).not.toHaveBeenCalled();
  });
});

describe("PaginationBar", () => {
  it("calcula el rango visible a partir de pagina y tamaño", () => {
    render(<PaginationBar page={3} pageSize={20} total={128} />);
    expect(screen.getByRole("status")).toHaveTextContent("41–60 de 128");
  });

  it("recorta el rango en la ultima pagina incompleta", () => {
    render(<PaginationBar page={7} pageSize={20} total={128} />);
    expect(screen.getByRole("status")).toHaveTextContent("121–128 de 128");
  });

  it("con la tabla vacia no inventa un rango", () => {
    render(<PaginationBar page={1} pageSize={20} total={0} />);
    expect(screen.getByRole("status")).toHaveTextContent("0–0 de 0");
  });

  it("sin onPageSizeChange no pinta el selector", () => {
    render(<PaginationBar page={1} pageSize={20} total={128} />);
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });

  it("el selector tiene nombre accesible y notifica un numero, no un texto", async () => {
    const onPageSizeChange = vi.fn();
    render(
      <PaginationBar page={1} pageSize={20} total={128} onPageSizeChange={onPageSizeChange} />,
    );
    const select = screen.getByRole("combobox", { name: "Filas por página" });
    await userEvent.selectOptions(select, "50");
    expect(onPageSizeChange).toHaveBeenCalledWith(50);
  });

  it("las flechas se apagan en los extremos calculados del total", async () => {
    const onPageChange = vi.fn();
    render(<PaginationBar page={7} pageSize={20} total={128} onPageChange={onPageChange} />);
    // 128 / 20 = 7 paginas: la septima es la ultima.
    const next = screen.getByRole("button", { name: "Página siguiente" });
    expect(next).toHaveAttribute("aria-disabled", "true");
    await userEvent.click(next);
    expect(onPageChange).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole("button", { name: "Página anterior" }));
    expect(onPageChange).toHaveBeenCalledWith(6);
  });
});

describe("LoadMore", () => {
  it("acompaña siempre el boton con el contador", () => {
    render(<LoadMore loaded={40} total={128} />);
    // Un boton solo no dice si quedan dos pulsaciones o cuarenta.
    expect(screen.getByRole("status")).toHaveTextContent("Mostrando 40 de 128");
  });

  it("pide mas al pulsar", async () => {
    const onLoadMore = vi.fn();
    render(<LoadMore loaded={40} total={128} onLoadMore={onLoadMore} />);
    await userEvent.click(screen.getByRole("button"));
    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it("en carga no vuelve a pedir pero SIGUE siendo enfocable", async () => {
    const onLoadMore = vi.fn();
    render(<LoadMore loaded={40} total={128} loading onLoadMore={onLoadMore} />);
    const btn = screen.getByRole("button");

    expect(btn).toHaveAttribute("aria-busy", "true");
    await userEvent.click(btn);
    expect(onLoadMore).not.toHaveBeenCalled();

    // Sin atributo disabled: el foco no se pierde en mitad de la accion.
    expect(btn).not.toBeDisabled();
    btn.focus();
    expect(btn).toHaveFocus();
  });

  it("cuando no queda nada retira el boton y deja el contador", () => {
    render(<LoadMore loaded={128} total={128} />);
    // Dejarlo puesto sin efecto seria una promesa falsa.
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Mostrando 128 de 128");
  });

  it("satura un contador incoherente en vez de anunciar mas de lo que hay", () => {
    render(<LoadMore loaded={500} total={128} />);
    expect(screen.getByRole("status")).toHaveTextContent("Mostrando 128 de 128");
  });

  it("acepta un formato de contador propio", () => {
    render(
      <LoadMore loaded={40} total={128} formatCount={(l, t) => `${l}/${t} movimientos`} />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("40/128 movimientos");
  });

  it("dentro de un formulario no lo envia", async () => {
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <LoadMore loaded={40} total={128} />
      </form>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onSubmit).not.toHaveBeenCalled();
  });
});

/* jsdom no trae IntersectionObserver. Se sustituye por un doble que guarda las
 * instancias para poder simular la entrada en pantalla a mano. */
class FakeIntersectionObserver implements IntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];
  readonly root = null;
  readonly rootMargin: string;
  readonly thresholds: readonly number[] = [];
  observed: Element[] = [];
  disconnected = false;

  constructor(
    private callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit,
  ) {
    this.rootMargin = String(options?.rootMargin ?? "");
    FakeIntersectionObserver.instances.push(this);
  }

  observe(target: Element) {
    this.observed.push(target);
  }
  unobserve() {}
  disconnect() {
    this.disconnected = true;
  }
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  /** Simula que el sentinel asoma por el borde inferior. */
  trigger(isIntersecting = true) {
    this.callback(
      this.observed.map((target) => ({ isIntersecting, target }) as IntersectionObserverEntry),
      this,
    );
  }
}

describe("LoadMoreSentinel", () => {
  beforeEach(() => {
    FakeIntersectionObserver.instances = [];
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const last = () => FakeIntersectionObserver.instances.at(-1)!;

  it("dispara la carga cuando el sentinel entra en pantalla", () => {
    const onReachEnd = vi.fn();
    render(<LoadMoreSentinel onReachEnd={onReachEnd} />);

    last().trigger();
    expect(onReachEnd).toHaveBeenCalledTimes(1);
  });

  it("no dispara nada si el sentinel sale sin llegar a entrar", () => {
    const onReachEnd = vi.fn();
    render(<LoadMoreSentinel onReachEnd={onReachEnd} />);

    last().trigger(false);
    expect(onReachEnd).not.toHaveBeenCalled();
  });

  it("no observa mientras ya se esta cargando", () => {
    const onReachEnd = vi.fn();
    render(<LoadMoreSentinel onReachEnd={onReachEnd} loading />);
    // Sin este corte, cada scroll durante la carga pediria la misma pagina otra vez.
    expect(FakeIntersectionObserver.instances).toHaveLength(0);
  });

  it("no observa cuando ya no queda nada por traer", () => {
    render(<LoadMoreSentinel onReachEnd={vi.fn()} hasMore={false} />);
    expect(FakeIntersectionObserver.instances).toHaveLength(0);
  });

  it("anuncia la carga en una region viva", () => {
    render(<LoadMoreSentinel onReachEnd={vi.fn()} loading />);
    expect(screen.getByRole("status")).toHaveTextContent("Cargando más…");
  });

  it("usa el callback mas reciente sin reconectar el observador", () => {
    const primero = vi.fn();
    const segundo = vi.fn();
    const { rerender } = render(<LoadMoreSentinel onReachEnd={primero} />);
    const observer = last();

    rerender(<LoadMoreSentinel onReachEnd={segundo} />);
    // Reconectarlo perderia la interseccion en curso y la carga no llegaria.
    expect(FakeIntersectionObserver.instances).toHaveLength(1);
    expect(observer.disconnected).toBe(false);

    observer.trigger();
    expect(primero).not.toHaveBeenCalled();
    expect(segundo).toHaveBeenCalledTimes(1);
  });

  it("deja de observar al desmontarse", () => {
    const { unmount } = render(<LoadMoreSentinel onReachEnd={vi.fn()} />);
    const observer = last();
    unmount();
    expect(observer.disconnected).toBe(true);
  });

  it("sin IntersectionObserver se queda inerte en vez de romper", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    expect(() => render(<LoadMoreSentinel onReachEnd={vi.fn()} />)).not.toThrow();
  });
});
