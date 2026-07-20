import { beforeAll, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SwitchField, Toggle } from "./toggle";

/* Radix mide el control con ResizeObserver para dimensionar el input espejo que
 * hace viajar el valor en un <form>. jsdom no lo implementa. El stub va aqui y
 * no en el setup compartido para no pisar a otros componentes; por eso comprueba
 * antes si ya existe. */
beforeAll(() => {
  if (!("ResizeObserver" in globalThis)) {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
  }
});

/* Tests de COMPORTAMIENTO, no de apariencia. Las medidas (42x24, recorrido 18,
 * el rebote del thumb) se verifican contra el navegador: jsdom no aplica CSS,
 * asi que comprobar clases aqui seria tautologico. */

describe("Toggle", () => {
  it("expone role=switch con aria-checked, no un checkbox", () => {
    // El rol importa: un lector de pantalla anuncia "activado/desactivado" en
    // vez de "marcado/desmarcado", que es lo que corresponde a un interruptor.
    render(<Toggle aria-label="Notificaciones" />);
    const sw = screen.getByRole("switch", { name: "Notificaciones" });
    expect(sw).toHaveAttribute("aria-checked", "false");
  });

  it("aplica el cambio al instante con un click, sin confirmar", async () => {
    const onCheckedChange = vi.fn();
    render(<Toggle aria-label="Notificaciones" onCheckedChange={onCheckedChange} />);
    const sw = screen.getByRole("switch");

    await userEvent.click(sw);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(sw).toHaveAttribute("aria-checked", "true");

    await userEvent.click(sw);
    expect(onCheckedChange).toHaveBeenLastCalledWith(false);
    expect(sw).toHaveAttribute("aria-checked", "false");
  });

  it("se alcanza con Tab y se acciona con Espacio y con Enter", async () => {
    const onCheckedChange = vi.fn();
    render(<Toggle aria-label="Notificaciones" onCheckedChange={onCheckedChange} />);
    const sw = screen.getByRole("switch");

    await userEvent.tab();
    expect(sw).toHaveFocus();

    await userEvent.keyboard(" ");
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);

    // Enter no lo da HTML por si solo en un <button> con role=switch: lo aporta
    // Radix. Si algun dia se sustituye la primitiva, este test lo delata.
    await userEvent.keyboard("{Enter}");
    expect(onCheckedChange).toHaveBeenLastCalledWith(false);
    expect(onCheckedChange).toHaveBeenCalledTimes(2);
  });

  it("funciona controlado: sin onCheckedChange que actualice, no cambia solo", async () => {
    render(<Toggle aria-label="Notificaciones" checked={false} />);
    const sw = screen.getByRole("switch");
    await userEvent.click(sw);
    expect(sw).toHaveAttribute("aria-checked", "false");
  });

  it("respeta defaultChecked como estado inicial no controlado", () => {
    render(<Toggle aria-label="Notificaciones" defaultChecked />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("deshabilitado no reacciona ni al raton ni al teclado", async () => {
    const onCheckedChange = vi.fn();
    render(<Toggle aria-label="Notificaciones" disabled onCheckedChange={onCheckedChange} />);
    const sw = screen.getByRole("switch");

    expect(sw).toBeDisabled();
    await userEvent.click(sw);
    await userEvent.keyboard(" ");
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("con name publica su valor en el formulario que lo contiene", async () => {
    // Radix monta un input espejo. Sin el, un toggle dentro de un <form> nativo
    // no enviaria nada, porque un <button> no aporta valor al FormData.
    const onSubmit = vi.fn((e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const data = new FormData(e.currentTarget);
      expect(data.get("push")).toBe("on");
    });
    render(
      <form onSubmit={onSubmit}>
        <Toggle aria-label="Push" name="push" defaultChecked />
        <button type="submit">Guardar</button>
      </form>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Guardar" }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("permite sobreescribir estilos por className", () => {
    render(<Toggle aria-label="X" className="rounded-none" />);
    // tailwind-merge debe descartar el rounded-pill de la base, no acumularlo.
    const cls = screen.getByRole("switch").className;
    expect(cls).toContain("rounded-none");
    expect(cls).not.toContain("rounded-full");
  });

  it("expone el ref del elemento interactivo", () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Toggle aria-label="X" ref={ref} />);
    expect(ref.current).toBe(screen.getByRole("switch"));
  });
});

describe("SwitchField", () => {
  it("toma su nombre accesible del titulo y su descripcion de la segunda linea", () => {
    render(
      <SwitchField
        title="Notificaciones push"
        description="Avisos de movimientos y envios"
      />,
    );
    const sw = screen.getByRole("switch", { name: "Notificaciones push" });
    expect(sw).toHaveAccessibleDescription("Avisos de movimientos y envios");
  });

  it("sin descripcion no deja un aria-describedby colgando", () => {
    render(<SwitchField title="Notificaciones push" />);
    // Apuntar a un id que no existe deja al lector de pantalla sin nada que
    // anunciar y ensucia las auditorias de a11y.
    expect(screen.getByRole("switch")).not.toHaveAttribute("aria-describedby");
  });

  it("no pone el titulo en mayusculas en JS", () => {
    // Igual que en Button: el texto accesible y lo que se copia al portapapeles
    // deben conservar la capitalizacion original.
    render(<SwitchField title="Notificaciones push" />);
    expect(screen.getByText("Notificaciones push")).toBeInTheDocument();
  });

  it("se acciona con teclado igual que el Toggle suelto", async () => {
    const onCheckedChange = vi.fn();
    render(<SwitchField title="Notificaciones push" onCheckedChange={onCheckedChange} />);
    await userEvent.tab();
    expect(screen.getByRole("switch")).toHaveFocus();
    await userEvent.keyboard(" ");
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("dos filas sin id explicito no colisionan entre si", () => {
    render(
      <>
        <SwitchField title="Primera" description="Uno" />
        <SwitchField title="Segunda" description="Dos" />
      </>,
    );
    const switches = screen.getAllByRole("switch");
    expect(switches).toHaveLength(2);
    const [a, b] = switches as [HTMLElement, HTMLElement];
    expect(a).toHaveAccessibleName("Primera");
    expect(b).toHaveAccessibleName("Segunda");
    expect(a.getAttribute("aria-labelledby")).not.toBe(b.getAttribute("aria-labelledby"));
  });

  it("con id explicito lo usa para el control, no para el contenedor", () => {
    render(<SwitchField id="push" title="Notificaciones push" />);
    const sw = screen.getByRole("switch");
    expect(sw).toHaveAttribute("id", "push");
    expect(sw).toHaveAttribute("aria-labelledby", "push-title");
  });

  it("deshabilitado bloquea toda la fila", async () => {
    const onCheckedChange = vi.fn();
    render(<SwitchField title="Notificaciones push" disabled onCheckedChange={onCheckedChange} />);
    await userEvent.click(screen.getByRole("switch"));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
