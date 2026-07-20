import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmptyState, EmptyStateAction } from "./empty-state";

/* Estos tests cubren COMPORTAMIENTO, no apariencia. Las medidas del prototipo
 * (tile 56, radio 16, mensaje 13.5/1.5) se verifican contra el navegador, no
 * aqui: jsdom no aplica CSS, asi que comprobar clases seria tautologico. */

describe("EmptyState", () => {
  it("renderiza el titulo como encabezado real, nivel 3 por defecto", () => {
    render(<EmptyState title="Aún no hay movimientos">Cuando envíes dinero.</EmptyState>);
    // Un <div> con pinta de titulo no sale en la lista de encabezados del
    // lector de pantalla y deja el vacio inalcanzable por navegacion rapida.
    expect(screen.getByRole("heading", { level: 3, name: "Aún no hay movimientos" })).toBeVisible();
  });

  it("permite ajustar el nivel del encabezado al esquema de la pagina", () => {
    render(<EmptyState title="Sin resultados" headingLevel={2} />);
    expect(screen.getByRole("heading", { level: 2, name: "Sin resultados" })).toBeVisible();
  });

  it("oculta el icono a la accesibilidad: es decorativo", () => {
    render(
      <EmptyState
        title="Sin conexión"
        tone="error"
        icon={<svg data-testid="glifo" viewBox="0 0 24 24" />}
      />,
    );
    // El icono no aporta informacion que el titulo no diga ya; anunciarlo solo
    // duplicaria el mensaje.
    expect(screen.getByTestId("glifo").closest("[aria-hidden='true']")).not.toBeNull();
  });

  it("no renderiza el tile cuando no hay icono", () => {
    const { container } = render(<EmptyState title="Todo al día" />);
    expect(container.querySelector("[aria-hidden='true']")).toBeNull();
  });

  it("omite mensaje y accion cuando no se pasan", () => {
    // "Todo al dia" del documento no lleva accion: no hay siguiente paso que
    // ofrecer y un boton vacio seria peor que ninguno.
    render(<EmptyState title="Todo al día" />);
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByRole("heading")).toBeVisible();
  });

  it("sin announce no es una region viva", () => {
    // Un vacio de primera vez ya viene en el render inicial; anunciarlo seria
    // ruido gratuito.
    const { container } = render(<EmptyState title="Crea tu primer bolsillo" />);
    expect(container.firstElementChild).not.toHaveAttribute("role");
    expect(container.firstElementChild).not.toHaveAttribute("aria-live");
  });

  it("con announce se anuncia como status polite", async () => {
    render(<EmptyState announce title="Sin resultados" />);
    const region = await screen.findByRole("status");
    expect(region).toHaveAttribute("aria-live", "polite");
    expect(region).toHaveTextContent("Sin resultados");
  });

  it("un role explicito gana sobre announce", () => {
    render(
      <EmptyState announce role="alert" title="Sin conexión">
        Revisa tu internet.
      </EmptyState>,
    );
    const region = screen.getByRole("alert");
    // Si el consumidor elige el rol, no le colamos ademas un aria-live que
    // pelee con el.
    expect(region).not.toHaveAttribute("aria-live");
  });

  it("permite sobreescribir estilos por className", () => {
    const { container } = render(<EmptyState className="rounded-none" title="X" />);
    // tailwind-merge debe descartar el rounded-xl del contenedor, no acumularlo.
    const cls = container.firstElementChild?.className ?? "";
    expect(cls).toContain("rounded-none");
    expect(cls).not.toContain("rounded-xl");
  });

  it("expone la ref del contenedor", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<EmptyState ref={ref} title="X" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe("EmptyStateAction", () => {
  it("por defecto es type=button, no submit", async () => {
    // El vacio de "sin resultados" vive justo debajo de un buscador: un boton
    // sin type enviaria ese formulario al pulsarlo.
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <EmptyState
          title="Sin resultados"
          action={<EmptyStateAction variant="quiet">Limpiar búsqueda</EmptyStateAction>}
        />
      </form>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Limpiar búsqueda" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("es alcanzable con Tab y se activa con Enter y con Espacio", async () => {
    const onClick = vi.fn();
    render(
      <EmptyState
        title="Sin conexión"
        action={
          <EmptyStateAction variant="secondary" onClick={onClick}>
            Reintentar
          </EmptyStateAction>
        }
      />,
    );

    await userEvent.tab();
    const boton = screen.getByRole("button", { name: "Reintentar" });
    expect(boton).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);

    await userEvent.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("no pone el label en mayusculas en JS, solo por CSS", () => {
    // Importa para el texto accesible y para lo que se copia al portapapeles.
    render(<EmptyStateAction>Enviar dinero</EmptyStateAction>);
    expect(screen.getByRole("button")).toHaveAccessibleName("Enviar dinero");
  });

  it("respeta disabled", async () => {
    const onClick = vi.fn();
    render(
      <EmptyStateAction disabled onClick={onClick}>
        Crear bolsillo
      </EmptyStateAction>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renderiza el icono inicial dentro del boton sin robarle el nombre", () => {
    render(
      <EmptyStateAction startIcon={<svg data-testid="mas" viewBox="0 0 24 24" />}>
        Crear bolsillo
      </EmptyStateAction>,
    );
    expect(screen.getByRole("button")).toHaveAccessibleName("Crear bolsillo");
    expect(screen.getByTestId("mas")).toBeInTheDocument();
  });

  it("permite sobreescribir estilos por className", () => {
    render(<EmptyStateAction className="rounded-none">X</EmptyStateAction>);
    const cls = screen.getByRole("button").className;
    expect(cls).toContain("rounded-none");
    expect(cls).not.toContain("rounded-lg");
  });

  it("expone la ref del boton", () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<EmptyStateAction ref={ref}>X</EmptyStateAction>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
