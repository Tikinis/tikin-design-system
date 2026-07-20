import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NotificationAction, NotificationItem } from "./notification";

/* Estos tests cubren COMPORTAMIENTO, no apariencia. Los valores visuales
 * (circulo 40, punto 8, radio 12, fondo hueso) se verifican contra el navegador,
 * no aqui: jsdom no aplica CSS, asi que comprobar clases seria tautologico. */

/** El componente renderiza un <li>: sin lista, el DOM seria invalido. */
function renderEnLista(ui: React.ReactNode) {
  return render(<ul>{ui}</ul>);
}

describe("NotificationItem", () => {
  it("es un elemento de lista con su texto y su hora", () => {
    renderEnLista(
      <NotificationItem tone="money" time="2:14 PM">
        <strong>Recibiste $500.000</strong> de Maria Rojas
      </NotificationItem>,
    );
    const item = screen.getByRole("listitem");
    expect(item).toHaveTextContent("Recibiste $500.000 de Maria Rojas");
    expect(item).toHaveTextContent("2:14 PM");
  });

  it("sin href ni onSelect no crea ningun punto de foco", () => {
    renderEnLista(<NotificationItem time="ayer">Cumpliste tu meta</NotificationItem>);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("con onSelect el area pulsable es un boton real, no un div con onClick", async () => {
    const onSelect = vi.fn();
    renderEnLista(
      <NotificationItem onSelect={onSelect} time="2:14 PM">
        Recibiste $500.000
      </NotificationItem>,
    );
    const boton = screen.getByRole("button", { name: "Recibiste $500.000" });
    await userEvent.click(boton);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("se abre con Enter y con Espacio desde el teclado", async () => {
    const onSelect = vi.fn();
    renderEnLista(<NotificationItem onSelect={onSelect}>Nuevo inicio de sesion</NotificationItem>);

    // Un solo Tab debe bastar para llegar a la notificacion.
    await userEvent.tab();
    expect(screen.getByRole("button")).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    expect(onSelect).toHaveBeenCalledTimes(2);
  });

  it("con href es un enlace de verdad, navegable y copiable", () => {
    renderEnLista(
      <NotificationItem href="/notificaciones/12" time="9:02 AM">
        Nuevo inicio de sesion
      </NotificationItem>,
    );
    expect(screen.getByRole("link", { name: "Nuevo inicio de sesion" })).toHaveAttribute(
      "href",
      "/notificaciones/12",
    );
  });

  it("cuelga hora y estado del elemento pulsable, no solo del <li>", () => {
    // Quien navega saltando de boton en boton no oye el resto de la fila: sin
    // esto no sabria ni cuando paso ni si ya lo habia leido.
    renderEnLista(
      <NotificationItem onSelect={() => {}} time="2:14 PM" unread>
        Recibiste $500.000
      </NotificationItem>,
    );
    expect(screen.getByRole("button")).toHaveAccessibleDescription("2:14 PM Sin leer");
  });

  it("anuncia el estado sin leer con texto, no solo con el punto", () => {
    const { rerender } = render(
      <ul>
        <NotificationItem unread>Recibiste $500.000</NotificationItem>
      </ul>,
    );
    expect(screen.getByText("Sin leer")).toBeInTheDocument();

    // Al marcarla leida el estado desaparece del arbol accesible.
    rerender(
      <ul>
        <NotificationItem>Recibiste $500.000</NotificationItem>
      </ul>,
    );
    expect(screen.queryByText("Sin leer")).not.toBeInTheDocument();
  });

  it("permite traducir la etiqueta del estado", () => {
    renderEnLista(
      <NotificationItem unread unreadLabel="No leida">
        Recibiste $500.000
      </NotificationItem>,
    );
    expect(screen.getByText("No leida")).toBeInTheDocument();
  });

  it("las acciones no anidan botones dentro del area pulsable", async () => {
    const onSelect = vi.fn();
    const onPagar = vi.fn();
    renderEnLista(
      <NotificationItem
        tone="request"
        onSelect={onSelect}
        time="12:05 PM"
        actions={<NotificationAction onClick={onPagar}>Pagar</NotificationAction>}
      >
        Carlos te pide $80.000
      </NotificationItem>,
    );

    const pagar = screen.getByRole("button", { name: "Pagar" });
    // Un <button> dentro de otro <button> es HTML invalido: el navegador lo
    // reparienta y la accion deja de funcionar. Por eso la fila usa un overlay.
    expect(pagar.closest("button")).toBe(pagar);

    await userEvent.click(pagar);
    expect(onPagar).toHaveBeenCalledTimes(1);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("acepta un icono propio y no lo expone al lector de pantalla", () => {
    renderEnLista(
      <NotificationItem icon={<span data-testid="glifo">*</span>}>Novedad</NotificationItem>,
    );
    // El icono es decorativo: el significado ya esta en el texto.
    expect(screen.getByTestId("glifo").closest("[aria-hidden='true']")).not.toBeNull();
  });

  it("permite sobreescribir estilos por className", () => {
    renderEnLista(<NotificationItem className="rounded-none">X</NotificationItem>);
    // tailwind-merge debe descartar el rounded-lg de la fila, no acumularlo.
    const cls = screen.getByRole("listitem").className;
    expect(cls).toContain("rounded-none");
    expect(cls).not.toContain("rounded-lg");
  });

  it("expone la ref del <li>", () => {
    const ref = { current: null as HTMLLIElement | null };
    renderEnLista(<NotificationItem ref={ref}>X</NotificationItem>);
    expect(ref.current).toBeInstanceOf(HTMLLIElement);
  });
});

describe("NotificationAction", () => {
  it("por defecto es type=button, no submit", async () => {
    // Un centro de notificaciones puede vivir dentro de un formulario.
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <NotificationAction>Pagar</NotificationAction>
      </form>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Pagar" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("no pone el label en mayusculas en JS, solo por CSS", () => {
    // Importa para el texto accesible y para lo que se copia al portapapeles.
    render(<NotificationAction>Rechazar</NotificationAction>);
    expect(screen.getByRole("button")).toHaveTextContent("Rechazar");
  });

  it("respeta disabled", async () => {
    const onClick = vi.fn();
    render(
      <NotificationAction disabled onClick={onClick}>
        Pagar
      </NotificationAction>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });
});
