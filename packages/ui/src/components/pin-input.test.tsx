import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PinInput, type PinFeedback } from "./pin-input";

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

/** La fila de puntos. Se remonta en cada fallo: por eso interesa su identidad. */
const fila = () => document.querySelector("[data-slot='pin-dot']")?.parentElement ?? null;

/**
 * Consumidor bien educado: devuelve `feedback` a `default` en cuanto el usuario
 * empieza a teclear de nuevo. Es el uso recomendado, y el unico con el que el
 * shake y la limpieza se repiten en cada intento — porque ambos responden a la
 * transicion a `error`, no a un contador de intentos.
 */
function ConsumidorCorrecto(props: { onIntento?: (valor: string) => void }) {
  const [pin, setPin] = React.useState("");
  const [feedback, setFeedback] = React.useState<PinFeedback>("default");
  return (
    <PinInput
      keypad={false}
      value={pin}
      feedback={feedback}
      errorClearDelay={10}
      onChange={(valor) => {
        setPin(valor);
        // Intento nuevo: el veredicto anterior ya no aplica.
        if (valor.length < 4) setFeedback("default");
      }}
      onComplete={(valor) => {
        props.onIntento?.(valor);
        setFeedback("error");
      }}
    />
  );
}

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

  it("con el PIN lleno, teclear empieza un intento nuevo en vez de no hacer nada", async () => {
    /* Este es el fallo grave de verdad del caso "feedback pegajoso": no que la
       animacion no se repita, sino que el usuario se quedaba encerrado con el
       campo lleno e incorrecto. Da igual si el consumidor limpia o no. */
    const onChange = vi.fn();
    render(<PinInput feedback="error" clearOnError={false} onChange={onChange} />);

    await userEvent.type(campo(), "1234");
    expect(campo()).toHaveValue("1234");

    await userEvent.type(campo(), "9");
    expect(campo()).toHaveValue("9");
  });

  it("un intento correcto NO se agita ni se borra aunque el error anterior siga puesto", async () => {
    /* El caso que rompia la version anterior, que contaba intentos: el contador
       subia al llenar el ultimo punto, no al conocer el resultado. Con
       validacion asincrona y `feedback` pegajoso, un PIN CORRECTO se borraba
       antes de que la validacion contestara. Castigar un acierto es peor que no
       repetir una animacion. */
    const { rerender } = render(<PinInput feedback="error" errorClearDelay={20} />);
    // Deja pasar la limpieza del PRIMER error antes de teclear, o su temporizador
    // borraria el intento siguiente y el test culparia al componente sin razon.
    await new Promise((r) => setTimeout(r, 50));

    // Segundo intento, correcto. El consumidor aun no ha contestado, asi que
    // `feedback` sigue valiendo "error".
    await userEvent.type(campo(), "1234");
    expect(campo()).toHaveValue("1234");

    await new Promise((r) => setTimeout(r, 60));
    expect(campo()).toHaveValue("1234");

    // Y cuando por fin contesta, el exito se pinta sin haber perdido el PIN.
    rerender(<PinInput feedback="success" errorClearDelay={20} />);
    expect(campo()).toHaveValue("1234");
  });

  it("pinta los cuatro puntos en verde cuando la clave es correcta", () => {
    render(<PinInput value="1234" feedback="success" />);
    expect(estados()).toEqual(["exito", "exito", "exito", "exito"]);
  });

  it("tras la autolimpieza los puntos salen del rojo aunque el feedback siga en error", async () => {
    /* El veredicto es sobre un intento completo. Antes el rojo no dependia de
       la clave: tras limpiarse sola seguian los cuatro puntos en rojo y, al
       teclear de nuevo, tampoco se movian — el usuario reescribia a ciegas
       salvo que el consumidor devolviera `feedback` a "default". */
    function Terco() {
      const [pin, setPin] = React.useState("1234");
      // Consumidor que NO resetea el feedback: el caso que se quedaba colgado.
      return (
        <PinInput
          keypad={false}
          value={pin}
          feedback="error"
          errorClearDelay={10}
          onChange={setPin}
        />
      );
    }
    render(<Terco />);
    expect(estados()).toEqual(["error", "error", "error", "error"]);

    await waitFor(() => expect(estados()).toEqual(["vacio", "vacio", "vacio", "vacio"]));

    await userEvent.type(campo(), "12");
    expect(estados()).toEqual(["lleno", "lleno", "vacio", "vacio"]);
  });

  it("no pinta el veredicto sobre una clave incompleta", () => {
    // Cuatro puntos verdes con la clave a medias anunciarian un acierto que no
    // ha ocurrido.
    render(<PinInput value="12" feedback="success" />);
    expect(estados()).toEqual(["lleno", "lleno", "vacio", "vacio"]);
  });

  it("acepta un codigo pegado con separadores", async () => {
    // `maxLength` del DOM contaba el texto EN CRUDO, antes del filtrado: con un
    // limite de 4 el navegador cortaba "12-34" en "12-3" y entraban 3 cifras.
    const onComplete = vi.fn();
    render(<PinInput keypad={false} onComplete={onComplete} />);

    await userEvent.click(campo());
    await userEvent.paste("12-34");

    expect(campo()).toHaveValue("1234");
    expect(onComplete).toHaveBeenCalledWith("1234");
    expect(estados()).toEqual(["lleno", "lleno", "lleno", "lleno"]);
  });

  it("solo pide el teclado del sistema cuando no hay teclado propio", () => {
    // Con teclado en pantalla, `none` evita que el del sistema lo tape; sin el,
    // hace falta el numerico o el usuario se queda sin cifras en movil.
    const { rerender } = render(<PinInput />);
    expect(campo()).toHaveAttribute("inputmode", "none");

    rerender(<PinInput keypad={false} />);
    expect(campo()).toHaveAttribute("inputmode", "numeric");
  });

  it("pide la clave guardada, no un codigo de un solo uso", () => {
    // `one-time-code` haria que el sistema ofreciera el ultimo SMS en vez de la
    // clave de la app. Para un OTP de verdad esta OtpInput.
    const { rerender } = render(<PinInput />);
    expect(campo()).toHaveAttribute("autocomplete", "current-password");

    rerender(<PinInput autoComplete="new-password" />);
    expect(campo()).toHaveAttribute("autocomplete", "new-password");
  });

  it("no describe el campo con un mensaje que no existe", () => {
    // El hueco del mensaje se reserva siempre; apuntarle sin texto deja al
    // lector anunciando una descripcion vacia.
    render(<PinInput />);
    expect(campo()).not.toHaveAttribute("aria-describedby");
  });

  it("el teclado en pantalla es un grupo con una sola parada de tabulacion", () => {
    /* Once paradas entre el campo y la biometria eran once de mas: el teclado
       fisico ya escribe en el campo. Lo resuelve el `Keypad` del sistema, que
       trae grupo con nombre y foco itinerante. */
    render(<PinInput />);
    // Se busca por el contrato del teclado (`data-key`), no por su rol: el
    // patron ARIA concreto es asunto suyo y este test no debe congelarlo.
    const teclas = Array.from(document.querySelectorAll<HTMLElement>("[data-key]"));
    expect(teclas).toHaveLength(11);
    expect(teclas.filter((t) => t.getAttribute("tabindex") === "0")).toHaveLength(1);

    const rejilla = teclas[0]?.parentElement?.closest("[aria-label]");
    expect(rejilla).toHaveAccessibleName();
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

describe("PinInput · consumidor que resetea el feedback", () => {
  it("agita y limpia en CADA intento fallido", async () => {
    const onIntento = vi.fn();
    render(<ConsumidorCorrecto onIntento={onIntento} />);

    await userEvent.type(campo(), "1234");
    expect(onIntento).toHaveBeenCalledTimes(1);
    const filaDelPrimerFallo = fila();
    await waitFor(() => expect(campo()).toHaveValue(""));

    // Al teclear otra vez, el consumidor devuelve `feedback` a "default", asi
    // que el segundo fallo vuelve a ser una transicion y se vuelve a disparar.
    await userEvent.type(campo(), "9999");
    expect(onIntento).toHaveBeenCalledTimes(2);
    await waitFor(() => expect(campo()).toHaveValue(""));

    // El remontado de la fila es lo unico que reinicia la animacion CSS cuando
    // la clase no cambia.
    expect(fila()).not.toBe(filaDelPrimerFallo);
  });
});
