import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox } from "./checkbox";

/* Estos tests cubren COMPORTAMIENTO, no apariencia. Las medidas visuales
 * (22, r6, inset 1.5px, marca 14) se verifican contra el navegador, no aqui:
 * jsdom no aplica CSS, asi que comprobar clases seria tautologico. */

/* Dentro de un <form>, Radix monta un input nativo espejo y mide la casilla con
 * ResizeObserver, que jsdom no implementa. El stub va aqui y no en el setup
 * compartido para no pisar a los demas componentes. */
if (!("ResizeObserver" in globalThis)) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

describe("Checkbox", () => {
  it("alterna al hacer clic y avisa del nuevo valor", async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Recordar este dispositivo" onCheckedChange={onCheckedChange} />);

    const box = screen.getByRole("checkbox", { name: "Recordar este dispositivo" });
    expect(box).not.toBeChecked();

    await userEvent.click(box);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(box).toBeChecked();
  });

  it("el label forma parte del nombre accesible y tambien alterna", async () => {
    // El documento pide que toda la fila sea clicable, no solo la casilla.
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Enviar y recibir" onCheckedChange={onCheckedChange} />);

    await userEvent.click(screen.getByText("Enviar y recibir"));
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("checkbox", { name: "Enviar y recibir" })).toBeChecked();
  });

  it("genera un id propio para el htmlFor y respeta el que le pasen", () => {
    const { rerender } = render(<Checkbox label="Uno" />);
    // Sin id explicito, el vinculo label/casilla debe existir igualmente.
    expect(screen.getByRole("checkbox", { name: "Uno" }).id).toBeTruthy();

    rerender(<Checkbox label="Uno" id="acepto-terminos" />);
    expect(screen.getByRole("checkbox", { name: "Uno" })).toHaveAttribute("id", "acepto-terminos");
  });

  it("se alterna con la barra espaciadora despues de tabular hasta el", async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Recordar" onCheckedChange={onCheckedChange} />);

    await userEvent.tab();
    const box = screen.getByRole("checkbox");
    expect(box).toHaveFocus();

    await userEvent.keyboard(" ");
    expect(onCheckedChange).toHaveBeenCalledWith(true);

    await userEvent.keyboard(" ");
    expect(onCheckedChange).toHaveBeenLastCalledWith(false);
  });

  it("Enter no lo alterna ni envia el formulario que lo contiene", async () => {
    // Comportamiento nativo del checkbox, que Radix reproduce: Enter no marca.
    const onCheckedChange = vi.fn();
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Checkbox label="Acepto" onCheckedChange={onCheckedChange} />
      </form>,
    );

    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("deshabilitado no alterna ni por la casilla ni por el label", async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Dispersar bonos" disabled onCheckedChange={onCheckedChange} />);

    const box = screen.getByRole("checkbox");
    expect(box).toBeDisabled();

    await userEvent.click(box);
    await userEvent.click(screen.getByText("Dispersar bonos"));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("el estado intermedio se anuncia como mixed y pasa a marcado al clicar", async () => {
    const onCheckedChange = vi.fn();
    render(
      <Checkbox
        label="Seleccionar todo"
        checked="indeterminate"
        onCheckedChange={onCheckedChange}
      />,
    );

    const box = screen.getByRole("checkbox");
    expect(box).toHaveAttribute("aria-checked", "mixed");

    await userEvent.click(box);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("controlado no cambia solo: manda la prop", async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Ahorrar" checked={false} onCheckedChange={onCheckedChange} />);

    const box = screen.getByRole("checkbox");
    await userEvent.click(box);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(box).not.toBeChecked();
  });

  it("marca aria-invalid cuando esta en error", () => {
    render(<Checkbox label="Con error" invalid />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("sin error no ensucia el DOM con aria-invalid='false'", () => {
    // Caso aparte y no un segundo render() en el test anterior: dos arboles
    // montados a la vez comparten el screen y esconden falsos positivos.
    render(<Checkbox label="Sin error" />);
    expect(screen.getByRole("checkbox")).not.toHaveAttribute("aria-invalid");
  });

  it("en error y deshabilitado a la vez sigue sin alternar y conserva aria-invalid", async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Con error" invalid disabled onCheckedChange={onCheckedChange} />);

    const box = screen.getByRole("checkbox");
    expect(box).toBeDisabled();
    expect(box).toHaveAttribute("aria-invalid", "true");

    await userEvent.click(box);
    await userEvent.click(screen.getByText("Con error"));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("dentro de un form envia el valor bajo su name", async () => {
    const { container } = render(
      <form>
        <Checkbox label="Recordar" name="recordar" value="si" />
      </form>,
    );

    // Radix añade un input nativo espejo para que el form serialice el valor.
    const mirror = container.querySelector<HTMLInputElement>('input[type="checkbox"]');
    expect(mirror).not.toBeNull();
    expect(mirror).toHaveAttribute("name", "recordar");
    expect(mirror!.checked).toBe(false);

    await userEvent.click(screen.getByRole("checkbox", { name: "Recordar" }));
    expect(mirror!.checked).toBe(true);
  });

  it("sin label renderiza solo la casilla, para componerla a mano", () => {
    render(
      <div>
        <Checkbox aria-label="Fila 3" />
      </div>,
    );
    const box = screen.getByRole("checkbox", { name: "Fila 3" });
    // No hay fila envolvente: el consumidor pone la suya.
    expect(box.parentElement?.tagName).toBe("DIV");
    expect(box.parentElement).not.toHaveClass("min-h-11");
  });

  it("la fila con label reserva los 44 de alto del area tactil", () => {
    render(<Checkbox label="Recordar" />);
    const fila = screen.getByRole("checkbox").parentElement;
    expect(fila).toHaveClass("min-h-11");
  });

  it("estira la zona de clic de la casilla a los 44 de la fila, y solo con label", () => {
    // Excepcion consciente a la regla de no mirar clases: la casilla mide 22
    // dentro de una fila de 44, y ese pseudo invisible es lo unico que hace
    // clicables las bandas de 11 de arriba y abajo. jsdom no calcula areas de
    // impacto, asi que la presencia de la utilidad es el unico guardarrail.
    const { unmount } = render(<Checkbox label="Recordar" />);
    expect(screen.getByRole("checkbox").className).toContain("before:-inset-y-[11px]");
    unmount();

    // Sin label la fila la compone el consumidor: la casilla no debe invadir.
    render(<Checkbox aria-label="Suelta" />);
    expect(screen.getByRole("checkbox").className).not.toContain("before:-inset-y-[11px]");
  });

  it("rowClassName viste la fila y no la casilla", () => {
    render(<Checkbox label="Recordar" rowClassName="w-full" className="rounded-none" />);
    const box = screen.getByRole("checkbox");
    expect(box.parentElement).toHaveClass("w-full");
    expect(box).not.toHaveClass("w-full");
    // Y al reves: className sigue yendo a la casilla, no a la fila.
    expect(box).toHaveClass("rounded-none");
    expect(box.parentElement).not.toHaveClass("rounded-none");
  });

  it("deshabilitado y marcado conserva el borde de la casilla", () => {
    // Regresion: `data-[state=checked]:shadow-none` empataba en especificidad
    // con `disabled:shadow-…` y ganaba por orden de fuente, dejando la casilla
    // deshabilitada+marcada sin borde. El refuerzo `disabled:data-[state=…]`
    // rompe el empate; jsdom no cascadea CSS, asi que se afirma la utilidad.
    render(<Checkbox label="Marcado" disabled defaultChecked />);
    const cls = screen.getByRole("checkbox").className;
    expect(cls).toContain(
      "disabled:data-[state=checked]:shadow-[inset_0_0_0_1.5px_var(--tk-border)]",
    );
    expect(cls).toContain(
      "disabled:data-[state=indeterminate]:shadow-[inset_0_0_0_1.5px_var(--tk-border)]",
    );
  });

  it("permite sobreescribir estilos de la casilla por className", () => {
    render(<Checkbox label="X" className="rounded-none" />);
    // tailwind-merge debe descartar el rounded-xs base, no acumularlo.
    const cls = screen.getByRole("checkbox").className;
    expect(cls).toContain("rounded-none");
    expect(cls).not.toContain("rounded-xs");
  });

  it("reenvia el ref a la casilla", () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Checkbox label="Ref" ref={ref} />);
    expect(ref.current).toBe(screen.getByRole("checkbox"));
  });
});
