import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FilterChip } from "./filter-chip";

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
    // Importa para el texto accesible y para lo que se copia al portapapeles.
    render(<FilterChip>Filtrar por estado</FilterChip>);
    expect(screen.getByRole("button")).toHaveTextContent("Filtrar por estado");
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
