import * as React from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as PopoverPrimitive from "radix-ui/popover";
import { FilterChip, type FilterOption } from "./filter-chip";

beforeAll(() => {
  // Radix Popper mide disparador y panel con ResizeObserver, que jsdom no trae.
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

const OPCIONES: FilterOption[] = [
  { value: "activo", label: "Activo" },
  { value: "pendiente", label: "Pendiente" },
  { value: "archivado", label: "Archivado" },
];

/* Estos tests cubren COMPORTAMIENTO, no apariencia. Los valores visuales
 * (40px, r999, borde de tinta al abrir) se verifican contra el navegador, no
 * aqui: jsdom no aplica CSS, asi que comprobar clases seria tautologico. */

describe("FilterChip", () => {
  it("por defecto es type=button, no submit", async () => {
    // El chip vive en barras de filtros, que casi siempre son un <form>.
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <FilterChip>Filter</FilterChip>
      </form>,
    );
    await userEvent.click(screen.getByRole("button", { name: /filter/i }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("se activa con Enter y con Espacio desde el teclado", async () => {
    const onClick = vi.fn();
    render(<FilterChip onClick={onClick}>Filter</FilterChip>);

    await userEvent.tab();
    expect(screen.getByRole("button")).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    // Es un <button> nativo justamente para no escribir manejadores de teclado.
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("anuncia el popover con aria-expanded y aria-haspopup cuando se gobierna open", () => {
    const { rerender } = render(<FilterChip open={false}>Filter</FilterChip>);
    const chip = screen.getByRole("button");
    expect(chip).toHaveAttribute("aria-expanded", "false");
    expect(chip).toHaveAttribute("aria-haspopup", "dialog");

    rerender(<FilterChip open>Filter</FilterChip>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
  });

  it("sin la prop open no finge que haya un popover", () => {
    // Filtros que aplican al instante: no hay panel, asi que anunciar
    // aria-haspopup seria mentirle al lector de pantalla.
    render(<FilterChip>Filter</FilterChip>);
    const chip = screen.getByRole("button");
    expect(chip).not.toHaveAttribute("aria-expanded");
    expect(chip).not.toHaveAttribute("aria-haspopup");
  });

  it("no dibuja el badge sin filtros activos", () => {
    const { rerender } = render(<FilterChip>Filter</FilterChip>);
    expect(screen.getByRole("button")).toHaveTextContent(/^Filter$/);

    // count=0 tampoco: "sin filtros, no aparece".
    rerender(<FilterChip count={0}>Filter</FilterChip>);
    expect(screen.getByRole("button")).toHaveTextContent(/^Filter$/);
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("dibuja el badge con un conteo mayor que cero y lo explica al lector", () => {
    render(<FilterChip count={2}>Filter</FilterChip>);
    // La cifra suelta se leeria "FILTER 2"; el sentido lo pone el texto oculto.
    expect(screen.getByText("2")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("button", { name: /2 filtros activos/i })).toBeInTheDocument();
  });

  it("permite sustituir el texto accesible del conteo", () => {
    render(
      <FilterChip count={3} countLabel="3 criterios aplicados">
        Filter
      </FilterChip>,
    );
    expect(screen.getByRole("button", { name: /3 criterios aplicados/i })).toBeInTheDocument();
  });

  it("no pone el label en mayusculas en JS, solo por CSS", () => {
    /* Lo que se comprueba es el DOM: el texto llega tal cual se escribio, que es
       lo que se copia al portapapeles y lo que lee quien inspeccione el nodo.
       NO es una garantia de accesibilidad — Chromium y WebKit meten el
       `text-transform` en el nombre accesible — sino de que la caja vive en la
       hoja de estilos y no en el JS. */
    render(<FilterChip>Filtrar por estado</FilterChip>);
    expect(screen.getByRole("button")).toHaveTextContent("Filtrar por estado");
  });

  it("respeta un type explicito en vez de forzar button", async () => {
    // El `type ?? "button"` es un valor por defecto, no un candado: si el
    // consumidor pide submit, el chip envia.
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <FilterChip type="submit">Filter</FilterChip>
      </form>,
    );
    await userEvent.click(screen.getByRole("button", { name: /filter/i }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("deshabilitado no dispara onClick ni es alcanzable con Tab", async () => {
    const onClick = vi.fn();
    render(
      <FilterChip disabled onClick={onClick}>
        Filter
      </FilterChip>,
    );
    const chip = screen.getByRole("button");

    await userEvent.click(chip);
    expect(onClick).not.toHaveBeenCalled();

    await userEvent.tab();
    expect(chip).not.toHaveFocus();
  });

  it("pinta un embudo por defecto y deja quitarlo o sustituirlo", () => {
    const { container, rerender } = render(<FilterChip>Filter</FilterChip>);
    expect(container.querySelector("svg")).toBeInTheDocument();

    rerender(<FilterChip icon={null}>Filter</FilterChip>);
    expect(container.querySelector("svg")).not.toBeInTheDocument();

    rerender(<FilterChip icon={<span data-testid="propio" />}>Filter</FilterChip>);
    expect(screen.getByTestId("propio")).toBeInTheDocument();
  });

  it("permite sobreescribir estilos por className", () => {
    render(<FilterChip className="rounded-none">Filter</FilterChip>);
    // tailwind-merge debe descartar el radio de la base, no acumularlo.
    const cls = screen.getByRole("button").className;
    expect(cls).toContain("rounded-none");
    expect(cls).not.toContain("radius-pill");
  });

  it("reenvia la ref al boton", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<FilterChip ref={ref}>Filter</FilterChip>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});

/* Sin `options` el chip es solo el disparador y el panel lo pone el consumidor.
 * El modo recomendado es componerlo con Popover.Trigger asChild: entonces la
 * relacion disparador-panel — aria-controls incluido — la cablea Radix. Esto
 * exige forwardRef y que los aria propios vayan ANTES del spread de props, asi
 * que el test protege las dos cosas. */
describe("FilterChip · disparador de un panel ajeno", () => {
  it("compone con Popover.Trigger asChild y deja que Radix cablee la relacion", async () => {
    render(
      <PopoverPrimitive.Root>
        <PopoverPrimitive.Trigger asChild>
          <FilterChip>Filter</FilterChip>
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content>Panel del consumidor</PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>,
    );

    const chip = screen.getByRole("button", { name: /filter/i });
    expect(chip).toHaveAttribute("aria-haspopup", "dialog");
    expect(chip).toHaveAttribute("aria-expanded", "false");
    // data-state, para que el consumidor pueda estilar en sincronia.
    expect(chip).toHaveAttribute("data-state", "closed");

    await userEvent.click(chip);
    const panel = await screen.findByRole("dialog");
    expect(panel).toHaveTextContent("Panel del consumidor");
    expect(chip).toHaveAttribute("aria-expanded", "true");
    /* La relacion disparador-panel, que es lo que el chip solo no puede cablear:
       Radix la publica mientras el panel esta montado. */
    expect(chip.getAttribute("aria-controls")).toBe(panel.id);
    expect(chip).toHaveAttribute("data-state", "open");
  });

  it("los aria que pone el consumidor ganan a los del chip", async () => {
    // Panel propio del consumidor, sin Radix: el chip no puede conocer su id,
    // asi que aria-controls tiene que poder entrar por props.
    render(
      <FilterChip open aria-controls="mi-panel" aria-haspopup="listbox">
        Filter
      </FilterChip>,
    );
    const chip = screen.getByRole("button");
    expect(chip).toHaveAttribute("aria-controls", "mi-panel");
    expect(chip).toHaveAttribute("aria-haspopup", "listbox");
    expect(chip).toHaveAttribute("aria-expanded", "true");
  });
});

/* El documento no describe un pill suelto: describe un filtro entero — "boton
 * que abre un popover con opciones marcables, badge con la cuenta activa y
 * acciones Limpiar / Aplicar". Estos tests cubren esa mitad. */
describe("FilterChip · panel de opciones", () => {
  async function abrir() {
    await userEvent.click(screen.getByRole("button", { name: /filter/i }));
    return screen.findByRole("dialog");
  }

  it("abre un popover con la cabecera y las opciones marcables", async () => {
    render(
      <FilterChip options={OPCIONES} heading="Estado">
        Filter
      </FilterChip>,
    );
    // Antes de abrir no hay panel montado.
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    const panel = await abrir();
    expect(panel).toHaveAccessibleName(/estado/i);
    const casillas = within(panel).getAllByRole("checkbox");
    expect(casillas).toHaveLength(3);
    expect(casillas[0]).toHaveAccessibleName("Activo");
    expect(casillas.every((c) => c.getAttribute("aria-checked") === "false")).toBe(true);
  });

  it("Aplicar confirma la seleccion, cierra el panel y actualiza el badge", async () => {
    const onValueChange = vi.fn();
    render(
      <FilterChip options={OPCIONES} onValueChange={onValueChange}>
        Filter
      </FilterChip>,
    );
    const panel = await abrir();

    await userEvent.click(within(panel).getByRole("checkbox", { name: "Activo" }));
    await userEvent.click(within(panel).getByRole("checkbox", { name: "Pendiente" }));
    // Hasta confirmar, el badge no cuenta nada: la seleccion es un borrador.
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.queryByText("2")).not.toBeInTheDocument();

    await userEvent.click(within(panel).getByRole("button", { name: /aplicar/i }));
    expect(onValueChange).toHaveBeenCalledWith(["activo", "pendiente"]);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());

    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /2 filtros activos/i })).toBeInTheDocument();
  });

  it("Limpiar deja el grupo en cero sin cerrar el panel", async () => {
    render(
      <FilterChip options={OPCIONES} defaultValue={["activo", "pendiente"]}>
        Filter
      </FilterChip>,
    );
    // El badge arranca con los dos filtros ya puestos.
    expect(screen.getByText("2")).toBeInTheDocument();

    const panel = await abrir();
    expect(within(panel).getByRole("checkbox", { name: "Activo" })).toHaveAttribute(
      "aria-checked",
      "true",
    );

    await userEvent.click(within(panel).getByRole("button", { name: /limpiar/i }));
    // Sigue abierto y todas las casillas quedan sueltas.
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    for (const casilla of within(panel).getAllByRole("checkbox")) {
      expect(casilla).toHaveAttribute("aria-checked", "false");
    }

    await userEvent.click(within(panel).getByRole("button", { name: /aplicar/i }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(screen.queryByText("2")).not.toBeInTheDocument();
  });

  it("el click fuera cierra el panel y descarta lo que no se aplico", async () => {
    const onValueChange = vi.fn();
    render(
      <div>
        <FilterChip options={OPCIONES} onValueChange={onValueChange}>
          Filter
        </FilterChip>
        <p data-testid="fuera">Fuera</p>
      </div>,
    );
    const panel = await abrir();
    await userEvent.click(within(panel).getByRole("checkbox", { name: "Activo" }));

    await userEvent.click(screen.getByTestId("fuera"));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.queryByText("1")).not.toBeInTheDocument();

    // Al reabrir, el borrador descartado no reaparece marcado.
    const dedos = await abrir();
    expect(within(dedos).getByRole("checkbox", { name: "Activo" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("en listas cortas aplica al instante y omite Aplicar", async () => {
    const onValueChange = vi.fn();
    render(
      <FilterChip options={OPCIONES} applyOnSelect onValueChange={onValueChange}>
        Filter
      </FilterChip>,
    );
    const panel = await abrir();
    expect(within(panel).queryByRole("button", { name: /aplicar/i })).not.toBeInTheDocument();

    await userEvent.click(within(panel).getByRole("checkbox", { name: "Archivado" }));
    expect(onValueChange).toHaveBeenCalledWith(["archivado"]);
    // El badge se entera sin confirmar y el panel sigue abierto.
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("gobierna la seleccion desde fuera cuando se pasa value", async () => {
    const onValueChange = vi.fn();
    render(
      <FilterChip options={OPCIONES} value={["archivado"]} onValueChange={onValueChange}>
        Filter
      </FilterChip>,
    );
    expect(screen.getByText("1")).toBeInTheDocument();

    const panel = await abrir();
    await userEvent.click(within(panel).getByRole("checkbox", { name: "Activo" }));
    await userEvent.click(within(panel).getByRole("button", { name: /aplicar/i }));

    // Controlado: avisa, pero no se mueve solo.
    expect(onValueChange).toHaveBeenCalledWith(["activo", "archivado"]);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("el chip abierto anuncia el popover y vuelve a cerrarlo al pulsarlo", async () => {
    render(<FilterChip options={OPCIONES}>Filter</FilterChip>);
    const chip = screen.getByRole("button", { name: /filter/i });
    expect(chip).toHaveAttribute("aria-haspopup", "dialog");
    expect(chip).toHaveAttribute("aria-expanded", "false");

    await abrir();
    expect(chip).toHaveAttribute("aria-expanded", "true");

    await userEvent.click(chip);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("deshabilitado no abre el panel", async () => {
    render(
      <FilterChip options={OPCIONES} disabled>
        Filter
      </FilterChip>,
    );
    await userEvent.click(screen.getByRole("button", { name: /filter/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
