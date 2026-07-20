import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PinInput } from "./pin-input";

/* Tests de COMPORTAMIENTO, no de apariencia. La geometria (punto de 16, tecla
 * de 52, shake de 420ms) se verifica contra el navegador: jsdom no aplica CSS,
 * asi que comprobar clases seria tautologico.
 *
 * Lo que si es logica real y se prueba aqui: el filtrado a cifras, el limite de
 * longitud, la validacion automatica al llenar el ultimo punto, el borrado, el
 * teclado en pantalla, la limpieza tras el error y el enmascarado. */

/** El campo real es invisible pero enfocable; se busca por su nombre accesible. */
const campo = (nombre = "Clave de acceso") => screen.getByLabelText(nombre);

/** Estado de cada punto, tal y como lo publica el componente. */
const estados = () =>
  Array.from(document.querySelectorAll("[data-slot='pin-dot']")).map((p) =>
    p.getAttribute("data-estado"),
  );

describe("PinInput", () => {
  it("pinta un punto por digito de la longitud pedida", () => {
    render(<PinInput length={6} />);
    expect(estados()).toEqual(["vacio", "vacio", "vacio", "vacio", "vacio", "vacio"]);
  });

  it("llena un punto por cada cifra tecleada y avisa del cambio", async () => {
    const onChange = vi.fn();
    render(<PinInput onChange={onChange} />);

    await userEvent.type(campo(), "12");

    expect(onChange).toHaveBeenLastCalledWith("12");
    expect(estados()).toEqual(["lleno", "lleno", "vacio", "vacio"]);
  });

  it("ignora todo lo que no sea una cifra", async () => {
    const onChange = vi.fn();
    render(<PinInput onChange={onChange} />);

    await userEvent.type(campo(), "a-b");
    expect(onChange).not.toHaveBeenCalled();
    expect(estados()).toEqual(["vacio", "vacio", "vacio", "vacio"]);

    await userEvent.type(campo(), "1x2");
    expect(onChange).toHaveBeenLastCalledWith("12");
  });

  it("valida sola al llenar el ultimo punto, sin boton y una sola vez", async () => {
    const onComplete = vi.fn();
    render(<PinInput onComplete={onComplete} />);

    await userEvent.type(campo(), "123");
    expect(onComplete).not.toHaveBeenCalled();

    await userEvent.type(campo(), "4");
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith("1234");

    // Un quinto digito ni entra ni vuelve a validar.
    await userEvent.type(campo(), "5");
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(estados()).toEqual(["lleno", "lleno", "lleno", "lleno"]);
  });

  it("borra el ultimo digito con Backspace", async () => {
    render(<PinInput />);
    await userEvent.type(campo(), "123");
    await userEvent.type(campo(), "{Backspace}");
    expect(estados()).toEqual(["lleno", "lleno", "vacio", "vacio"]);
  });

  it("nunca muestra las cifras", async () => {
    // Sin teclado en pantalla, para que las unicas cifras posibles del DOM
    // sean las que se acaban de escribir.
    render(<PinInput keypad={false} />);
    await userEvent.type(campo(), "1234");
    // El enmascarado es semantico: tambien lo respeta el lector de pantalla.
    expect(campo()).toHaveAttribute("type", "password");
    expect(document.body).not.toHaveTextContent("1234");
    expect(estados()).toEqual(["lleno", "lleno", "lleno", "lleno"]);
  });

  it("escribe y borra con el teclado en pantalla", async () => {
    render(<PinInput />);

    await userEvent.click(screen.getByRole("button", { name: "7" }));
    await userEvent.click(screen.getByRole("button", { name: "0" }));
    expect(estados()).toEqual(["lleno", "lleno", "vacio", "vacio"]);

    await userEvent.click(screen.getByRole("button", { name: "Borrar" }));
    expect(estados()).toEqual(["lleno", "vacio", "vacio", "vacio"]);
  });

  it("deja el foco en el campo tras usar el teclado en pantalla", async () => {
    render(<PinInput />);
    await userEvent.click(screen.getByRole("button", { name: "3" }));
    // Asi el teclado fisico sigue funcionando despues de tocar la pantalla.
    expect(campo()).toHaveFocus();
  });

  it("reencamina las cifras del teclado fisico aunque el foco este en una tecla", async () => {
    render(<PinInput />);
    const tecla = screen.getByRole("button", { name: "5" });
    tecla.focus();

    await userEvent.keyboard("9");
    expect(estados()).toEqual(["lleno", "vacio", "vacio", "vacio"]);
  });

  it("sin teclado en pantalla no renderiza ninguna tecla", () => {
    render(<PinInput keypad={false} />);
    expect(screen.queryByRole("button", { name: "1" })).not.toBeInTheDocument();
  });

  it("marca el campo como invalido y se limpia sola tras el error", async () => {
    const onChange = vi.fn();
    render(<PinInput value="1234" feedback="error" errorClearDelay={10} onChange={onChange} />);

    expect(estados()).toEqual(["error", "error", "error", "error"]);
    expect(campo()).toHaveAttribute("aria-invalid", "true");

    // La limpieza la hace el componente: el consumidor sabe que fallo, pero no
    // cuando ha terminado la animacion.
    await waitFor(() => expect(onChange).toHaveBeenCalledWith(""));
  });

  it("con clearOnError=false conserva la clave para que el consumidor decida", async () => {
    const onChange = vi.fn();
    render(
      <PinInput
        value="1234"
        feedback="error"
        clearOnError={false}
        errorClearDelay={10}
        onChange={onChange}
      />,
    );

    await new Promise((resolve) => setTimeout(resolve, 40));
    expect(onChange).not.toHaveBeenCalled();
    expect(estados()).toEqual(["error", "error", "error", "error"]);
  });

  it("pinta los cuatro puntos en verde cuando la clave es correcta", () => {
    render(<PinInput value="1234" feedback="success" />);
    expect(estados()).toEqual(["exito", "exito", "exito", "exito"]);
  });

  it("anuncia el mensaje por una region viva", async () => {
    render(<PinInput hint="Clave incorrecta" feedback="error" clearOnError={false} />);
    const mensaje = screen.getByRole("status");
    expect(mensaje).toHaveTextContent("Clave incorrecta");
    expect(campo()).toHaveAttribute("aria-describedby", mensaje.id);
  });

  it("toma el nombre accesible de la etiqueta visible", async () => {
    render(<PinInput label="Ingresa tu clave" />);
    // Y pulsar la etiqueta enfoca el campo invisible.
    await userEvent.click(screen.getByText("Ingresa tu clave"));
    expect(screen.getByLabelText("Ingresa tu clave")).toHaveFocus();
  });

  it("muestra el atajo biometrico solo si hay a donde llamar", async () => {
    const onBiometric = vi.fn();
    const { rerender } = render(<PinInput />);
    expect(screen.queryByRole("button", { name: /biometr/i })).not.toBeInTheDocument();

    rerender(<PinInput onBiometric={onBiometric} />);
    await userEvent.click(screen.getByRole("button", { name: "Usar biometría" }));
    expect(onBiometric).toHaveBeenCalledTimes(1);
  });

  it("no pone el label biometrico en mayusculas en JS, solo por CSS", () => {
    // Importa para el texto accesible y para lo que se copia al portapapeles.
    render(<PinInput onBiometric={() => {}} />);
    expect(screen.getByRole("button", { name: "Usar biometría" })).toHaveTextContent(
      "Usar biometría",
    );
  });

  it("deshabilitado no acepta cifras ni por pantalla ni por teclado", async () => {
    const onChange = vi.fn();
    render(<PinInput disabled onChange={onChange} onBiometric={() => {}} />);

    expect(campo()).toBeDisabled();
    expect(screen.getByRole("button", { name: "1" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Usar biometría" })).toBeDisabled();

    await userEvent.click(screen.getByRole("button", { name: "1" }));
    expect(onChange).not.toHaveBeenCalled();
    expect(estados()).toEqual(["vacio", "vacio", "vacio", "vacio"]);
  });

  it("controlado no cambia por su cuenta", async () => {
    const onChange = vi.fn();
    render(<PinInput value="12" onChange={onChange} />);

    await userEvent.type(campo(), "3");
    expect(onChange).toHaveBeenCalledWith("123");
    // El valor lo manda el consumidor: sin rerender, los puntos no se mueven.
    expect(estados()).toEqual(["lleno", "lleno", "vacio", "vacio"]);
  });

  it("recorta un defaultValue mas largo que la longitud", () => {
    render(<PinInput defaultValue="99999" />);
    expect(estados()).toEqual(["lleno", "lleno", "lleno", "lleno"]);
    expect(campo()).toHaveValue("9999");
  });

  it("permite sobreescribir estilos por className", () => {
    const { container } = render(<PinInput className="gap-0" />);
    const raiz = container.firstElementChild as HTMLElement;
    // tailwind-merge debe descartar el gap base, no acumularlo.
    expect(raiz.className).toContain("gap-0");
    expect(raiz.className).not.toContain("gap-[22px]");
  });
});
