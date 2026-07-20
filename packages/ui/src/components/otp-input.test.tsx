import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OtpInput } from "./otp-input";

/* Estos tests cubren COMPORTAMIENTO, no apariencia. Los valores visuales
 * (48x56, r12, borde 0.5px, caret 2x24) se verifican contra el navegador, no
 * aqui: jsdom no aplica CSS, asi que comprobar clases seria tautologico. */

/** Las casillas son decorativas y van aria-hidden: se leen por data-slot. */
function cells(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>('[data-slot="otp-cell"]'));
}

function digits(): string[] {
  return cells().map((cell) => cell.textContent ?? "");
}

describe("OtpInput", () => {
  it("reparte cada cifra en su casilla segun se escribe", async () => {
    render(<OtpInput />);
    const input = screen.getByRole("textbox");

    await userEvent.type(input, "314");

    expect(cells()).toHaveLength(6);
    expect(digits()).toEqual(["3", "1", "4", "", "", ""]);
  });

  it("rechaza todo lo que no sea una cifra", async () => {
    const onValueChange = vi.fn();
    render(<OtpInput onValueChange={onValueChange} />);
    const input = screen.getByRole("textbox");

    await userEvent.type(input, "a3b-1 ");

    expect(input).toHaveValue("31");
    expect(digits().slice(0, 2)).toEqual(["3", "1"]);
    // El consumidor recibe siempre el valor ya saneado, nunca la letra.
    expect(onValueChange.mock.calls.every(([v]) => /^\d*$/.test(v as string))).toBe(true);
  });

  it("no acepta mas cifras que casillas", async () => {
    render(<OtpInput length={4} />);
    const input = screen.getByRole("textbox");

    await userEvent.type(input, "123456789");

    expect(cells()).toHaveLength(4);
    expect(input).toHaveValue("1234");
  });

  it("borrar retrocede una casilla", async () => {
    render(<OtpInput defaultValue="314" />);
    const input = screen.getByRole("textbox");

    await userEvent.click(input);
    await userEvent.keyboard("{Backspace}");

    expect(digits()).toEqual(["3", "1", "", "", "", ""]);

    await userEvent.keyboard("{Backspace}{Backspace}{Backspace}");
    expect(input).toHaveValue("");
  });

  it("pegar el codigo completo lo reparte en las casillas", async () => {
    const onComplete = vi.fn();
    render(<OtpInput onComplete={onComplete} />);
    const input = screen.getByRole("textbox");

    await userEvent.click(input);
    // Con separadores: el sanitizador se queda solo con las cifras.
    await userEvent.paste("314 279");

    expect(digits()).toEqual(["3", "1", "4", "2", "7", "9"]);
    expect(onComplete).toHaveBeenCalledExactlyOnceWith("314279");
  });

  it("dispara onComplete una sola vez al llegar a la ultima casilla", async () => {
    const onComplete = vi.fn();
    render(<OtpInput onComplete={onComplete} />);
    const input = screen.getByRole("textbox");

    await userEvent.type(input, "314279");
    expect(onComplete).toHaveBeenCalledTimes(1);

    // Con el codigo ya completo, seguir tecleando no vuelve a dispararlo.
    await userEvent.type(input, "0");
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("clava el caret al final para que escribir siempre añada por la derecha", async () => {
    render(<OtpInput defaultValue="31" />);
    const input = screen.getByRole<HTMLInputElement>("textbox");

    await userEvent.click(input);
    input.setSelectionRange(0, 0);
    // El evento select lo emite el navegador; en jsdom se dispara a mano.
    await userEvent.click(input);

    expect(input.selectionStart).toBe(2);

    await userEvent.keyboard("4");
    expect(input).toHaveValue("314");
  });

  it("marca la casilla activa solo mientras el campo tiene el foco", async () => {
    render(<OtpInput defaultValue="31" />);
    const input = screen.getByRole("textbox");

    expect(cells().some((cell) => cell.hasAttribute("data-active"))).toBe(false);

    await userEvent.click(input);
    // La activa es la primera vacia, la tercera.
    expect(cells()[2]).toHaveAttribute("data-active");
    expect(cells()[1]).not.toHaveAttribute("data-active");

    await userEvent.tab();
    expect(cells().some((cell) => cell.hasAttribute("data-active"))).toBe(false);
  });

  it("deshabilitado no acepta escritura ni foco", async () => {
    const onValueChange = vi.fn();
    render(<OtpInput disabled onValueChange={onValueChange} />);
    const input = screen.getByRole("textbox");

    expect(input).toBeDisabled();
    await userEvent.type(input, "314");
    expect(onValueChange).not.toHaveBeenCalled();
    expect(digits()).toEqual(["", "", "", "", "", ""]);
  });

  it("en solo lectura muestra el codigo pero no lo deja cambiar", async () => {
    render(<OtpInput readOnly value="314279" />);
    const input = screen.getByRole("textbox");

    expect(digits()).toEqual(["3", "1", "4", "2", "7", "9"]);
    await userEvent.type(input, "0");
    expect(input).toHaveValue("314279");
  });

  /* readOnly SI es enfocable y SI entra en el orden de tabulacion. Si se
   * plegara con disabled se quedaria sin casilla activa y, como el caret nativo
   * va a opacidad 0, tabular hasta el no dibujaria absolutamente nada. */
  it("en solo lectura el foco sigue siendo visible: marca la casilla activa", async () => {
    render(<OtpInput readOnly value="314" />);

    await userEvent.tab();

    expect(screen.getByRole("textbox")).toHaveFocus();
    // La activa es la primera vacia, la cuarta.
    expect(cells()[3]).toHaveAttribute("data-active");
  });

  it("en solo lectura la casilla se pinta en reposo, no como deshabilitada", () => {
    render(<OtpInput readOnly value="314279" />);
    const cell = cells()[0]!;

    expect(cell.className).not.toContain("bg-surface-2");
    expect(cell.className).not.toContain("cursor-not-allowed");
    expect(cell.className).toContain("border-edge-2");
  });

  it("en solo lectura no dibuja caret: parpadear invitaria a teclear", async () => {
    render(<OtpInput readOnly value="314" />);

    await userEvent.tab();

    const activa = cells()[3]!;
    expect(activa).toHaveAttribute("data-active");
    expect(activa.querySelector("span")).toBeNull();
  });

  it("deshabilitado si pierde la casilla activa: no es enfocable", async () => {
    render(<OtpInput disabled defaultValue="314" />);

    await userEvent.tab();

    expect(cells().some((cell) => cell.hasAttribute("data-active"))).toBe(false);
  });

  it("controlado: el valor lo manda el padre, no el teclado", async () => {
    const onValueChange = vi.fn();
    render(<OtpInput value="31" onValueChange={onValueChange} />);
    const input = screen.getByRole("textbox");

    await userEvent.type(input, "4");

    expect(onValueChange).toHaveBeenCalledWith("314");
    // El padre no ha actualizado su estado, asi que el campo no se mueve.
    expect(input).toHaveValue("31");
  });

  it("controlado: sigue al padre cuando este cambia el valor", async () => {
    function Controlado() {
      const [code, setCode] = React.useState("");
      return (
        <>
          <OtpInput value={code} onValueChange={setCode} />
          <button type="button" onClick={() => setCode("999")}>
            rellenar
          </button>
        </>
      );
    }
    render(<Controlado />);

    await userEvent.type(screen.getByRole("textbox"), "31");
    expect(digits().slice(0, 2)).toEqual(["3", "1"]);

    await userEvent.click(screen.getByRole("button", { name: "rellenar" }));
    expect(digits()).toEqual(["9", "9", "9", "", "", ""]);
  });

  it("en error marca aria-invalid y asocia el mensaje al campo", () => {
    render(
      <OtpInput
        feedback="error"
        value="999999"
        message="Código incorrecto. Te quedan 2 intentos."
      />,
    );
    const input = screen.getByRole("textbox");

    expect(input).toHaveAttribute("aria-invalid", "true");
    const messageId = input.getAttribute("aria-describedby");
    expect(messageId).toBeTruthy();
    expect(document.getElementById(messageId!)).toHaveTextContent(
      "Código incorrecto. Te quedan 2 intentos.",
    );
  });

  /* La region live tiene que estar registrada ANTES de que llegue el texto: un
   * aria-live que se monta en el mismo commit que su contenido no se anuncia en
   * la mayoria de lectores, y el mensaje de error solo aparece al fallar. */
  it("monta la region del mensaje aunque todavia no haya mensaje", () => {
    const { container } = render(<OtpInput />);
    const live = container.querySelector('[aria-live="polite"]');

    expect(live).not.toBeNull();
    expect(live).toBeEmptyDOMElement();
  });

  it("el mensaje aparece dentro de la region live que ya existia", () => {
    const { container, rerender } = render(<OtpInput value="999999" />);
    const live = container.querySelector('[aria-live="polite"]');

    rerender(<OtpInput value="999999" feedback="error" message="Código incorrecto." />);

    // Mismo nodo, no uno nuevo: si se remontara, el anuncio se perderia.
    expect(container.querySelector('[aria-live="polite"]')).toBe(live);
    expect(live).toHaveTextContent("Código incorrecto.");
  });

  it("conserva el aria-describedby del consumidor junto al del mensaje", () => {
    render(
      <>
        <span id="ayuda-externa">Revisa tus SMS</span>
        <OtpInput message="Verificado" aria-describedby="ayuda-externa" />
      </>,
    );
    expect(screen.getByRole("textbox").getAttribute("aria-describedby")).toContain("ayuda-externa");
  });

  it("expone un unico campo accesible con el codigo entero", async () => {
    render(<OtpInput label="Código de verificación" />);
    // Un solo textbox, no seis: es lo que permite el autocompletado del SMS.
    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(1);
    expect(inputs[0]).toHaveAccessibleName("Código de verificación");
    expect(inputs[0]).toHaveAttribute("autocomplete", "one-time-code");
    expect(inputs[0]).toHaveAttribute("inputmode", "numeric");
  });

  it("propaga onChange con el valor ya saneado", async () => {
    const onChange = vi.fn<(event: React.ChangeEvent<HTMLInputElement>) => void>();
    render(<OtpInput onChange={onChange} />);

    await userEvent.type(screen.getByRole("textbox"), "3x1");

    const valores = onChange.mock.calls.map(([event]) => event.target.value);
    expect(valores.every((v) => /^\d*$/.test(v))).toBe(true);
    expect(valores.at(-1)).toBe("31");
  });

  it("reenvia la ref al input real", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<OtpInput ref={ref} />);
    expect(ref.current).toBe(screen.getByRole("textbox"));
  });

  /* Excepcion deliberada al "no comprobamos apariencia": aqui no se mide COMO
   * se ve, sino que las clases en conflicto quedan resueltas. Si se acumulan,
   * cual gana lo decide el orden de la hoja de estilos generada, no el
   * componente — y eso es exactamente el fallo que estos dos tests cierran. */
  it("en una casilla inerte el gris apagado sustituye al feedback, no se suma", () => {
    render(<OtpInput disabled feedback="error" value="314279" />);
    const cell = cells()[0]!;

    expect(cell.className).toContain("border-edge");
    expect(cell.className).toContain("bg-surface-2");
    // Si el rojo sigue ahi, las dos reglas compiten en la cascada.
    expect(cell.className).not.toContain("border-red");
    expect(cell.className).not.toContain("bg-red-tint");
    // El prototipo dibuja el deshabilitado a 0.5px tambien cuando hay feedback.
    expect(cell.className).toContain("border-[0.5px]");
    expect(cell.className).not.toContain("border-[1px]");
  });

  it("el fondo del feedback sustituye al fondo base de la casilla", () => {
    render(<OtpInput feedback="error" value="314279" />);
    const cell = cells()[0]!;

    expect(cell.className).toContain("bg-red-tint");
    expect(cell.className).not.toContain("bg-[var(--textfield-bg-default)]");
  });

  /* El prototipo especifica 1px para error y para exito, y 0.5px para el resto.
   * Heredar el 0.5px de la base pintaba la mitad del grosor. */
  it.each([
    ["error", "border-red"],
    ["success", "border-fg-success"],
  ] as const)("el feedback %s engorda el borde a 1px", (feedback, colorClass) => {
    render(<OtpInput feedback={feedback} value="314279" />);
    const cell = cells()[0]!;

    expect(cell.className).toContain("border-[1px]");
    expect(cell.className).not.toContain("border-[0.5px]");
    expect(cell.className).toContain(colorClass);
  });

  it("en reposo la casilla se queda en el 0.5px de la base", () => {
    render(<OtpInput value="314279" />);
    const cell = cells()[0]!;

    expect(cell.className).toContain("border-[0.5px]");
    expect(cell.className).not.toContain("border-[1px]");
  });

  it("en exito marca el tono del mensaje y no marca aria-invalid", () => {
    render(<OtpInput feedback="success" value="314279" message="Verificado" />);
    const input = screen.getByRole("textbox");

    expect(input).not.toHaveAttribute("aria-invalid");
    const messageId = input.getAttribute("aria-describedby");
    expect(document.getElementById(messageId!)).toHaveTextContent("Verificado");
  });

  it("permite sobreescribir estilos del bloque por wrapperClassName", () => {
    render(<OtpInput wrapperClassName="items-center" data-testid="otp" />);
    // El bloque es el abuelo del input: control -> input.
    const bloque = screen.getByTestId("otp").parentElement?.parentElement;
    expect(bloque?.className).toContain("items-center");
  });

  it("permite sobreescribir estilos del control por className", () => {
    render(<OtpInput className="w-full" data-testid="otp" />);
    // className estiliza el control; el input real queda dentro.
    const control = screen.getByTestId("otp").parentElement;
    expect(control?.className).toContain("w-full");
  });
});
