import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AmountDisplay, Keypad, formatAmount, parseAmount } from "./keypad";

/* Estos tests cubren COMPORTAMIENTO, no apariencia. Los valores visuales
 * (tecla de 52, r12, DM Mono 22, monto 40-56) se verifican contra el navegador,
 * no aqui: jsdom no aplica CSS, asi que comprobar clases seria tautologico. */

const tecla = (nombre: string) => screen.getByRole("button", { name: nombre });

describe("formatAmount / parseAmount", () => {
  it("agrupa miles con punto y separa decimales con coma (es-CO)", () => {
    expect(formatAmount("1250000")).toBe("1.250.000");
    expect(formatAmount("1250,5")).toBe("1.250,5");
    expect(formatAmount(1250.5)).toBe("1.250,5");
    expect(formatAmount(1250)).toBe("1.250");
  });

  it("conserva los estados intermedios de la escritura", () => {
    // Justo despues de pulsar la coma no hay decimales todavia. Intl borraria
    // esa coma y el usuario veria que su pulsacion no hizo nada.
    expect(formatAmount("1250,")).toBe("1.250,");
    expect(formatAmount("1250,0")).toBe("1.250,0");
  });

  it("un monto vacio vale cero", () => {
    expect(formatAmount("")).toBe("0");
    expect(parseAmount("")).toBe(0);
  });

  it("conserva el signo de un monto negativo", () => {
    // Pintar un ajuste o un saldo en rojo como si fuera positivo es un error de
    // importe que no avisa de nada.
    expect(formatAmount(-500)).toBe("-500");
    expect(formatAmount(-1250.5)).toBe("-1.250,5");
    expect(formatAmount("-1250")).toBe("-1.250");
    expect(parseAmount(formatAmount(-1250.5))).toBe(-1250.5);
  });

  it("no inventa un cero negativo al redondear", () => {
    // -0,004 con dos decimales es cero, y "-0" no es un monto.
    expect(formatAmount(-0.004)).toBe("0");
  });

  it("parsea tanto el crudo como el formateado", () => {
    expect(parseAmount("1250,5")).toBe(1250.5);
    expect(parseAmount("1.250,5")).toBe(1250.5);
  });
});

describe("Keypad", () => {
  it("escribe cifras y acumula el monto", async () => {
    const onValueChange = vi.fn();
    render(<Keypad onValueChange={onValueChange} />);

    await userEvent.click(tecla("1"));
    await userEvent.click(tecla("2"));
    await userEvent.click(tecla("5"));

    expect(onValueChange).toHaveBeenNthCalledWith(1, "1");
    expect(onValueChange).toHaveBeenNthCalledWith(3, "125");
  });

  it("no acepta ceros a la izquierda", async () => {
    const onValueChange = vi.fn();
    const onKeyPress = vi.fn();
    render(<Keypad onValueChange={onValueChange} onKeyPress={onKeyPress} />);

    await userEvent.click(tecla("0"));

    // La pulsacion se reporta (sirve para el feedback haptico), pero el monto
    // sigue vacio: "0" no es un monto, es el placeholder.
    expect(onKeyPress).toHaveBeenCalledWith("0");
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("el cero anclado por la coma no se queda pegado delante de la cifra", async () => {
    const onValueChange = vi.fn();
    render(<Keypad action="decimal" onValueChange={onValueChange} />);

    // Camino corto para llegar a un monto que vale exactamente "0": la coma
    // sobre el vacio ancla un cero, y borrar la coma lo deja solo.
    await userEvent.click(tecla("Coma decimal"));
    expect(onValueChange).toHaveBeenLastCalledWith("0,");
    await userEvent.click(tecla("Borrar"));
    expect(onValueChange).toHaveBeenLastCalledWith("0");

    // Ese cero es un ancla, no una cifra: la siguiente lo sustituye.
    await userEvent.click(tecla("5"));
    expect(onValueChange).toHaveBeenLastCalledWith("5");
  });

  it("un monto que ya vale cero no acumula mas ceros", async () => {
    const onValueChange = vi.fn();
    const onKeyPress = vi.fn();
    render(<Keypad defaultValue="0" onValueChange={onValueChange} onKeyPress={onKeyPress} />);

    await userEvent.click(tecla("0"));

    expect(onKeyPress).toHaveBeenCalledWith("0");
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("descarta la cifra que pasa del tope sin truncar lo escrito", async () => {
    const onValueChange = vi.fn();
    render(<Keypad defaultValue="9999999" onValueChange={onValueChange} />);

    // 7 cifras enteras = $ 9.999.999, el maximo del documento.
    await userEvent.click(tecla("9"));
    expect(onValueChange).not.toHaveBeenCalled();

    // Y lo ya escrito sigue intacto: borrar deja seis cifras, no cero.
    await userEvent.click(tecla("Borrar"));
    expect(onValueChange).toHaveBeenCalledWith("999999");
  });

  it("borra la ultima cifra y no rompe con el monto vacio", async () => {
    const onValueChange = vi.fn();
    render(<Keypad defaultValue="12" onValueChange={onValueChange} />);

    await userEvent.click(tecla("Borrar"));
    expect(onValueChange).toHaveBeenLastCalledWith("1");
    await userEvent.click(tecla("Borrar"));
    expect(onValueChange).toHaveBeenLastCalledWith("");

    onValueChange.mockClear();
    await userEvent.click(tecla("Borrar"));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("la coma decimal solo existe con action='decimal'", async () => {
    const { rerender } = render(<Keypad />);
    expect(screen.queryByRole("button", { name: "Coma decimal" })).toBeNull();

    rerender(<Keypad action="decimal" />);
    expect(screen.getByRole("button", { name: "Coma decimal" })).toBeInTheDocument();
  });

  it("solo admite una coma y como mucho dos decimales", async () => {
    const onValueChange = vi.fn();
    render(<Keypad action="decimal" defaultValue="12" onValueChange={onValueChange} />);

    await userEvent.click(tecla("Coma decimal"));
    expect(onValueChange).toHaveBeenLastCalledWith("12,");

    onValueChange.mockClear();
    await userEvent.click(tecla("Coma decimal"));
    expect(onValueChange).not.toHaveBeenCalled();

    await userEvent.click(tecla("5"));
    await userEvent.click(tecla("0"));
    expect(onValueChange).toHaveBeenLastCalledWith("12,50");

    // El 0 tras la coma SI cuenta, al contrario que el cero a la izquierda.
    onValueChange.mockClear();
    await userEvent.click(tecla("1"));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("la biometria avisa pero nunca toca el monto", async () => {
    const onBiometric = vi.fn();
    const onValueChange = vi.fn();
    render(
      <Keypad
        action="biometric"
        defaultValue="20"
        onBiometric={onBiometric}
        onValueChange={onValueChange}
      />,
    );

    await userEvent.click(tecla("Autenticar con huella"));
    expect(onBiometric).toHaveBeenCalledTimes(1);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("gobernado por el padre no cambia solo", async () => {
    const onValueChange = vi.fn();
    render(<Keypad value="30" onValueChange={onValueChange} />);

    await userEvent.click(tecla("7"));
    // Avisa del valor que tocaria, pero se queda esperando al padre.
    expect(onValueChange).toHaveBeenCalledWith("307");
    await userEvent.click(tecla("7"));
    expect(onValueChange).toHaveBeenLastCalledWith("307");
  });

  it("tiene UNA sola parada de tabulacion y las flechas mueven entre teclas", async () => {
    render(
      <>
        <Keypad />
        <button type="button">Despues</button>
      </>,
    );

    await userEvent.tab();
    expect(tecla("1")).toHaveFocus();

    await userEvent.keyboard("{ArrowRight}");
    expect(tecla("2")).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    expect(tecla("5")).toHaveFocus();
    await userEvent.keyboard("{ArrowLeft}");
    expect(tecla("4")).toHaveFocus();

    // Foco itinerante: la siguiente tabulacion sale del teclado entero, no
    // recorre las doce teclas.
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Despues" })).toHaveFocus();
  });

  it("las flechas dan la vuelta y saltan el hueco de la esquina", async () => {
    render(<Keypad />);

    await userEvent.tab();
    expect(tecla("1")).toHaveFocus();
    // Fila 1 -> 2 -> 3 -> 4. La esquina inferior izquierda esta vacia con
    // action="none", asi que el foco cae en la primera fila otra vez.
    await userEvent.keyboard("{ArrowUp}");
    expect(tecla("7")).toHaveFocus();

    await userEvent.keyboard("{ArrowLeft}");
    expect(tecla("9")).toHaveFocus();
  });

  it("con el foco dentro, el teclado fisico escribe y borra", async () => {
    const onValueChange = vi.fn();
    render(<Keypad action="decimal" onValueChange={onValueChange} />);

    await userEvent.tab();
    await userEvent.keyboard("12");
    expect(onValueChange).toHaveBeenLastCalledWith("12");

    // En un teclado numerico fisico la tecla decimal es un punto, pero quien
    // escribe pesos espera una coma.
    await userEvent.keyboard(".");
    expect(onValueChange).toHaveBeenLastCalledWith("12,");

    await userEvent.keyboard("{Backspace}");
    expect(onValueChange).toHaveBeenLastCalledWith("12");
  });

  it("Enter y Espacio siguen activando la tecla enfocada", async () => {
    const onValueChange = vi.fn();
    render(<Keypad onValueChange={onValueChange} />);

    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith("1");
    await userEvent.keyboard(" ");
    expect(onValueChange).toHaveBeenLastCalledWith("11");
  });

  it("deshabilitado no escribe ni con raton ni con teclado", async () => {
    const onValueChange = vi.fn();
    const onKeyPress = vi.fn();
    render(<Keypad disabled onValueChange={onValueChange} onKeyPress={onKeyPress} />);

    await userEvent.click(tecla("5"));
    tecla("5").focus();
    await userEvent.keyboard("7");

    expect(onValueChange).not.toHaveBeenCalled();
    expect(onKeyPress).not.toHaveBeenCalled();
  });

  it("las teclas son type=button y no envian el formulario que las contiene", async () => {
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Keypad />
      </form>,
    );
    await userEvent.click(tecla("3"));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("permite sobreescribir estilos por className", () => {
    render(<Keypad className="max-w-none" aria-label="Numpad" />);
    const rejilla = screen.getByRole("grid", { name: "Numpad" });
    // tailwind-merge debe descartar el max-w-[300px] del componente.
    expect(rejilla.className).toContain("max-w-none");
    expect(rejilla.className).not.toContain("max-w-[300px]");
  });

  it("se expone como rejilla, no como grupo: 'group' no es un rol de widget", () => {
    // Con role="group" el lector de pantalla se queda en modo exploracion, las
    // flechas mueven su cursor virtual en vez de llegar al numpad y el foco
    // itinerante ya le ha quitado el Tab a once de las doce teclas.
    render(<Keypad action="decimal" />);

    expect(screen.getByRole("grid", { name: "Teclado numérico" })).toBeInTheDocument();
    expect(screen.queryByRole("group")).toBeNull();
    // Cuatro filas de tres celdas, siempre: el hueco de la esquina tambien es
    // celda, si no la rejilla declararia filas de distinto ancho.
    expect(screen.getAllByRole("row")).toHaveLength(4);
    expect(screen.getAllByRole("gridcell")).toHaveLength(12);
  });

  it("con maxDecimals 0 no hay coma: ni tecla, ni ruta por teclado fisico", async () => {
    const onValueChange = vi.fn();
    render(<Keypad action="decimal" maxDecimals={0} onValueChange={onValueChange} />);

    // Antes se pintaba una tecla enfocable, sin `disabled` y calcada a las
    // vivas, que no hacia absolutamente nada al pulsarla.
    expect(screen.queryByRole("button", { name: "Coma decimal" })).toBeNull();
    expect(screen.getAllByRole("gridcell")).toHaveLength(12);

    await userEvent.tab();
    await userEvent.keyboard("12");
    await userEvent.keyboard(",");
    await userEvent.keyboard(".");
    expect(onValueChange).toHaveBeenLastCalledWith("12");
  });

  it("respeta topes de cifras propios", async () => {
    const onValueChange = vi.fn();
    const { unmount } = render(
      <Keypad defaultValue="123" maxIntegerDigits={3} onValueChange={onValueChange} />,
    );
    await userEvent.click(tecla("4"));
    expect(onValueChange).not.toHaveBeenCalled();
    unmount();

    const conUnDecimal = vi.fn();
    render(
      <Keypad action="decimal" defaultValue="12" maxDecimals={1} onValueChange={conUnDecimal} />,
    );
    await userEvent.click(tecla("Coma decimal"));
    await userEvent.click(tecla("5"));
    expect(conUnDecimal).toHaveBeenLastCalledWith("12,5");

    conUnDecimal.mockClear();
    await userEvent.click(tecla("7"));
    expect(conUnDecimal).not.toHaveBeenCalled();
  });

  it("si la esquina se vacia, la rejilla no se queda sin parada de tabulacion", async () => {
    const { rerender } = render(<Keypad action="decimal" />);

    await userEvent.click(tecla("Coma decimal"));
    expect(tecla("Coma decimal")).toHaveAttribute("tabindex", "0");

    // La tecla enfocada desaparece de la rejilla. Sin recalcular el indice
    // itinerante, las doce teclas quedarian con tabIndex -1 y el numpad seria
    // inalcanzable con Tab.
    rerender(<Keypad action="none" />);
    expect(tecla("1")).toHaveAttribute("tabindex", "0");

    await userEvent.tab();
    expect(tecla("1")).toHaveFocus();
  });

  it("el consumidor conserva onKeyDown y puede quedarse con la tecla", async () => {
    const onKeyDown = vi.fn((e: React.KeyboardEvent) => {
      // Atajo propio de la pantalla: Escape cierra la hoja del monto.
      if (e.key === "Escape" || e.key === "ArrowRight") e.preventDefault();
    });
    const onValueChange = vi.fn();
    render(<Keypad onKeyDown={onKeyDown} onValueChange={onValueChange} />);

    await userEvent.tab();
    await userEvent.keyboard("{Escape}");
    expect(onKeyDown).toHaveBeenCalled();

    // Consumida por el consumidor: el numpad no la reinterpreta.
    await userEvent.keyboard("{ArrowRight}");
    expect(tecla("1")).toHaveFocus();

    // Y lo que el consumidor no consume sigue funcionando.
    await userEvent.keyboard("5");
    expect(onValueChange).toHaveBeenLastCalledWith("5");
  });
});

describe("AmountDisplay", () => {
  it("muestra el placeholder mientras no hay monto", () => {
    render(<AmountDisplay label="Vas a enviar" />);
    expect(screen.getByRole("status")).toHaveTextContent("$ 0");
  });

  it("formatea el monto crudo que emite el Keypad", () => {
    render(<AmountDisplay value="1250000" />);
    expect(screen.getByRole("status")).toHaveTextContent("$ 1.250.000");
  });

  it("se puede quitar el simbolo de moneda", () => {
    render(<AmountDisplay value="1250" currency="" />);
    expect(screen.getByRole("status")).toHaveTextContent("1.250");
  });

  it("es una region viva: sin teclado del sistema no hay otro eco de la pulsacion", () => {
    render(<AmountDisplay value="1" />);
    // <output> trae role=status y aria-live=polite de serie.
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("ata la ayuda al monto con aria-describedby", () => {
    render(<AmountDisplay value="5000000" hint="Supera tu saldo" invalid />);
    const monto = screen.getByRole("status");
    const ayuda = screen.getByText("Supera tu saldo");
    expect(monto).toHaveAttribute("aria-describedby", ayuda.id);
  });

  it("no pone la etiqueta en mayusculas en JS, solo por CSS", () => {
    // Importa para el texto accesible y para lo que se copia al portapapeles.
    render(<AmountDisplay label="Vas a enviar" value="10" />);
    expect(screen.getByText("Vas a enviar")).toBeInTheDocument();
  });

  it("el monto se anuncia con su rotulo, no como un numero suelto", () => {
    // Es una region viva: cada pulsacion se anuncia. Sin nombre accesible se
    // oye "$ 1.250" sin decir de que, aunque la etiqueta este escrita al lado.
    render(<AmountDisplay label="Vas a enviar" value="1250" />);
    expect(screen.getByRole("status", { name: "Vas a enviar" })).toHaveTextContent("$ 1.250");
  });

  it("expone la ref del contenedor y deja sobreescribir estilos", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<AmountDisplay ref={ref} className="text-left" value="10" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    // tailwind-merge debe descartar el text-center del componente.
    expect(ref.current?.className).toContain("text-left");
    expect(ref.current?.className).not.toContain("text-center");
  });

  it("invalido tiñe pero no borra ni bloquea el monto", () => {
    const { rerender } = render(<AmountDisplay value="5000000" />);
    expect(screen.getByRole("status")).toHaveTextContent("$ 5.000.000");
    rerender(<AmountDisplay value="5000000" invalid />);
    expect(screen.getByRole("status")).toHaveTextContent("$ 5.000.000");
  });
});

describe("Keypad + AmountDisplay", () => {
  function Pantalla() {
    const [monto, setMonto] = React.useState("");
    const saldo = 4_250_000;
    const excede = parseAmount(monto) > saldo;
    return (
      <>
        <AmountDisplay
          label="Vas a enviar"
          value={monto}
          invalid={excede}
          hint={excede ? "Supera tu saldo" : "Saldo $ 4.250.000"}
        />
        <Keypad value={monto} onValueChange={setMonto} />
      </>
    );
  }

  it("la validacion avisa pero no impide seguir escribiendo", async () => {
    render(<Pantalla />);

    for (const d of ["5", "0", "0", "0", "0", "0", "0"]) {
      await userEvent.click(tecla(d));
    }

    expect(screen.getByRole("status")).toHaveTextContent("$ 5.000.000");
    expect(screen.getByText("Supera tu saldo")).toBeInTheDocument();

    // El documento es explicito: "sin bloquear la escritura".
    await userEvent.click(tecla("Borrar"));
    expect(screen.getByRole("status")).toHaveTextContent("$ 500.000");
    expect(screen.getByText("Saldo $ 4.250.000")).toBeInTheDocument();
  });
});
