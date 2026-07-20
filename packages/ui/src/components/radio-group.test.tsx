import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Radio, RadioGroup } from "./radio-group";

/* Tests de COMPORTAMIENTO, no de apariencia. Los valores visuales (22px, punto
 * de 10, anillo 1.5/2px) se verifican contra el navegador: jsdom no aplica CSS,
 * asi que comprobar clases seria tautologico. */

/* Radix monta un <input> espejo cuando detecta un <form> alrededor, y ese input
 * mide el control con ResizeObserver, que jsdom no implementa. El stub va aqui
 * y no en el setup compartido para no cambiar el entorno de otros paquetes. */
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver;

function Grupo(props: React.ComponentProps<typeof RadioGroup>) {
  return (
    <RadioGroup label="Cuenta destino" defaultValue="ahorro" {...props}>
      <Radio value="ahorro">Ahorro</Radio>
      <Radio value="corriente">Corriente</Radio>
      <Radio value="nomina">Nómina</Radio>
    </RadioGroup>
  );
}

describe("RadioGroup", () => {
  it("arranca con una opcion marcada y nunca deja el grupo vacio", async () => {
    // "Una siempre": el documento dice que no existe el estado "ninguna".
    render(<Grupo />);
    expect(screen.getByRole("radio", { name: "Ahorro" })).toBeChecked();

    // Volver a pulsar la opcion ya marcada no la desmarca.
    await userEvent.click(screen.getByRole("radio", { name: "Ahorro" }));
    expect(screen.getByRole("radio", { name: "Ahorro" })).toBeChecked();
  });

  it("selecciona por click y solo una a la vez", async () => {
    const onValueChange = vi.fn();
    render(<Grupo onValueChange={onValueChange} />);

    await userEvent.click(screen.getByRole("radio", { name: "Corriente" }));

    expect(onValueChange).toHaveBeenCalledWith("corriente");
    expect(screen.getByRole("radio", { name: "Corriente" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Ahorro" })).not.toBeChecked();
  });

  it("las cuatro flechas mueven el foco, no solo las del eje vertical", async () => {
    /* Este es el motivo de no reenviar `orientation` a Radix: en cuanto se le
     * pasa, su roving focus ignora las flechas del eje contrario. El patron
     * ARIA de radiogroup espera Abajo/Derecha para avanzar y Arriba/Izquierda
     * para retroceder. */
    render(<Grupo />);
    screen.getByRole("radio", { name: "Ahorro" }).focus();

    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("radio", { name: "Corriente" })).toHaveFocus();

    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "Nómina" })).toHaveFocus();

    await userEvent.keyboard("{ArrowLeft}");
    expect(screen.getByRole("radio", { name: "Corriente" })).toHaveFocus();

    await userEvent.keyboard("{ArrowUp}");
    expect(screen.getByRole("radio", { name: "Ahorro" })).toHaveFocus();
  });

  it("anuncia aria-orientation solo cuando el grupo es horizontal", () => {
    /* role=radiogroup implica "vertical", asi que en vertical callar es correcto
     * y en horizontal callar seria anunciar lo contrario de lo que se ve. Radix
     * no lo emite porque `orientation` no se le reenvia (ver componente). */
    const { unmount } = render(<Grupo />);
    expect(screen.getByRole("radiogroup")).not.toHaveAttribute("aria-orientation");
    unmount();

    render(<Grupo orientation="horizontal" />);
    expect(screen.getByRole("radiogroup")).toHaveAttribute("aria-orientation", "horizontal");
  });

  it("en horizontal las cuatro flechas siguen moviendo el foco", async () => {
    /* La contrapartida de declarar aria-orientation a mano: el roving focus de
     * Radix debe seguir en modo de dos ejes, no atarse al eje anunciado. */
    render(<Grupo orientation="horizontal" />);
    screen.getByRole("radio", { name: "Ahorro" }).focus();

    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "Corriente" })).toHaveFocus();

    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("radio", { name: "Nómina" })).toHaveFocus();

    await userEvent.keyboard("{ArrowUp}");
    expect(screen.getByRole("radio", { name: "Corriente" })).toHaveFocus();
  });

  it("el consumidor puede sobreescribir los aria que pone el componente", () => {
    // Los atributos van antes del spread, no despues: mandan las props.
    render(<Grupo orientation="horizontal" aria-orientation="vertical" />);
    expect(screen.getByRole("radiogroup")).toHaveAttribute("aria-orientation", "vertical");
  });

  it("la barra espaciadora selecciona la opcion enfocada", async () => {
    const onValueChange = vi.fn();
    render(<Grupo onValueChange={onValueChange} />);

    screen.getByRole("radio", { name: "Ahorro" }).focus();
    await userEvent.keyboard("{ArrowDown} ");

    expect(onValueChange).toHaveBeenCalledWith("corriente");
    expect(screen.getByRole("radio", { name: "Corriente" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Ahorro" })).not.toBeChecked();
  });

  it("el grupo es una sola parada de tabulacion", async () => {
    render(
      <>
        <button type="button">antes</button>
        <Grupo />
        <button type="button">despues</button>
      </>,
    );

    screen.getByRole("button", { name: "antes" }).focus();
    await userEvent.tab();
    // Entra por la opcion marcada, no por la primera del DOM.
    expect(screen.getByRole("radio", { name: "Ahorro" })).toHaveFocus();

    await userEvent.tab();
    expect(screen.getByRole("button", { name: "despues" })).toHaveFocus();
  });

  it("enlaza el titulo del grupo por aria-labelledby", () => {
    render(<Grupo />);
    expect(screen.getByRole("radiogroup", { name: "Cuenta destino" })).toBeInTheDocument();
  });

  it("sin label no inventa un aria-labelledby colgando", () => {
    render(
      <RadioGroup defaultValue="a">
        <Radio value="a">A</Radio>
      </RadioGroup>,
    );
    expect(screen.getByRole("radiogroup")).not.toHaveAttribute("aria-labelledby");
  });

  it("funciona como componente controlado", async () => {
    function Controlado() {
      const [value, setValue] = React.useState("ahorro");
      return (
        <>
          <Grupo value={value} onValueChange={setValue} />
          <output>{value}</output>
        </>
      );
    }
    render(<Controlado />);

    await userEvent.click(screen.getByRole("radio", { name: "Nómina" }));
    expect(screen.getByRole("status")).toHaveTextContent("nomina");
  });

  it("propaga disabled del grupo a todas las opciones", async () => {
    const onValueChange = vi.fn();
    render(<Grupo disabled onValueChange={onValueChange} />);

    for (const radio of screen.getAllByRole("radio")) {
      expect(radio).toBeDisabled();
    }
    await userEvent.click(screen.getByRole("radio", { name: "Corriente" }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("propaga invalid del grupo a las opciones y cada una puede negarlo", () => {
    render(
      <RadioGroup label="Cuenta" defaultValue="a" invalid>
        <Radio value="a">A</Radio>
        <Radio value="b" invalid={false}>
          B
        </Radio>
      </RadioGroup>,
    );
    expect(screen.getByRole("radio", { name: "A" })).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("radio", { name: "B" })).not.toHaveAttribute("aria-invalid");
  });

  it("marca el error tambien en el grupo, no solo en cada opcion", () => {
    /* Quien tabula hasta aqui aterriza en el radiogroup: si el error solo
     * viviera en las opciones, no lo percibiria hasta enfocar una. */
    const { unmount } = render(<Grupo invalid />);
    expect(screen.getByRole("radiogroup")).toHaveAttribute("aria-invalid", "true");
    unmount();

    render(<Grupo />);
    expect(screen.getByRole("radiogroup")).not.toHaveAttribute("aria-invalid");
  });
});

describe("Radio", () => {
  it("una opcion deshabilitada se salta al navegar y no se selecciona", async () => {
    const onValueChange = vi.fn();
    render(
      <RadioGroup label="Envío" defaultValue="a" onValueChange={onValueChange}>
        <Radio value="a">A</Radio>
        <Radio value="b" disabled>
          B
        </Radio>
        <Radio value="c">C</Radio>
      </RadioGroup>,
    );

    screen.getByRole("radio", { name: "A" }).focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("radio", { name: "C" })).toHaveFocus();

    await userEvent.click(screen.getByRole("radio", { name: "B" }));
    expect(onValueChange).not.toHaveBeenCalledWith("b");
    expect(screen.getByRole("radio", { name: "B" })).not.toBeChecked();
  });

  it("con descripcion, el nombre accesible es solo el label", () => {
    render(
      <RadioGroup label="Envío" defaultValue="estandar">
        <Radio value="estandar" appearance="card" description="Llega en minutos · $0">
          Envío estándar
        </Radio>
      </RadioGroup>,
    );

    const radio = screen.getByRole("radio", { name: "Envío estándar" });
    expect(radio).toHaveAccessibleDescription("Llega en minutos · $0");
  });

  it("sin descripcion no cuelga un aria-describedby vacio", () => {
    render(
      <RadioGroup defaultValue="a">
        <Radio value="a">A</Radio>
      </RadioGroup>,
    );
    expect(screen.getByRole("radio", { name: "A" })).not.toHaveAttribute("aria-describedby");
  });

  it("no altera la capitalizacion del label en JS", () => {
    // Importa para el texto accesible y para lo que se copia al portapapeles.
    render(
      <RadioGroup defaultValue="a">
        <Radio value="a">Cuenta de ahorro</Radio>
      </RadioGroup>,
    );
    // Si alguien metiera .toUpperCase(), el nombre accesible pasaria a
    // "CUENTA DE AHORRO" y ninguna de estas dos aserciones casaria.
    const radio = screen.getByRole("radio", { name: "Cuenta de ahorro" });
    expect(radio).toHaveTextContent(/^Cuenta de ahorro$/);
  });

  it("la fila ocupa el ancho completo aunque el consumidor la envuelva", async () => {
    /* "Cada fila entera es clicable" no puede depender de que Radio sea hijo
     * directo del grupo: en cuanto se envuelve (un badge al lado, un separador)
     * una regla de hijo directo dejaria de aplicar sin ningun aviso. */
    render(
      <RadioGroup defaultValue="a">
        <div className="flex items-center justify-between">
          <Radio value="a">A</Radio>
          <span>badge</span>
        </div>
        <Radio value="b">B</Radio>
      </RadioGroup>,
    );

    expect(screen.getByRole("radio", { name: "A" }).className).toContain("w-full");
    expect(screen.getByRole("radio", { name: "B" }).className).toContain("w-full");
  });

  it("en horizontal la opcion se ciñe a su contenido y el consumidor manda", () => {
    render(
      <RadioGroup defaultValue="a" orientation="horizontal">
        <Radio value="a">A</Radio>
      </RadioGroup>,
    );
    expect(screen.getByRole("radio", { name: "A" }).className).not.toContain("w-full");
  });

  it("className puede ceñir una fila concreta en vertical", () => {
    // El ancho lo pone el componente ANTES de className: no lo bloquea.
    render(
      <RadioGroup defaultValue="a">
        <Radio value="a" className="w-auto">
          A
        </Radio>
      </RadioGroup>,
    );
    const cls = screen.getByRole("radio", { name: "A" }).className;
    expect(cls).toContain("w-auto");
    expect(cls).not.toContain("w-full");
  });

  it("en tarjeta la opcion sigue siendo un unico control enfocable", async () => {
    const onValueChange = vi.fn();
    render(
      <RadioGroup label="Envío" defaultValue="estandar" onValueChange={onValueChange}>
        <Radio value="estandar" appearance="card" description="Llega en minutos · $0">
          Envío estándar
        </Radio>
        <Radio value="programado" appearance="card" description="Eliges día y hora">
          Programado
        </Radio>
      </RadioGroup>,
    );

    // El titulo de la tarjeta no es un control aparte: el click sube al radio.
    await userEvent.click(screen.getByText("Programado"));
    expect(onValueChange).toHaveBeenCalledWith("programado");

    const seleccionada = screen.getByRole("radio", { name: "Programado" });
    expect(seleccionada).toBeChecked();
    expect(seleccionada).toHaveFocus();
    expect(screen.getByRole("radio", { name: "Envío estándar" })).not.toBeChecked();
    // Cada tarjeta describe la suya, no la de al lado.
    expect(seleccionada).toHaveAccessibleDescription("Eliges día y hora");
  });

  it("toda la fila es el control, incluida la descripcion", async () => {
    const onValueChange = vi.fn();
    render(
      <RadioGroup defaultValue="a" onValueChange={onValueChange}>
        <Radio value="a">A</Radio>
        <Radio value="b" appearance="card" description="Eliges día y hora">
          Programado
        </Radio>
      </RadioGroup>,
    );

    // El click cae sobre el texto secundario, no sobre el circulo.
    await userEvent.click(screen.getByText("Eliges día y hora"));
    expect(onValueChange).toHaveBeenCalledWith("b");
  });

  it("dentro de un form aporta su valor y seleccionar no lo envia", async () => {
    // Radix monta un input espejo para que el grupo participe del form; el
    // control visible es type=button, asi que elegir no dispara el submit.
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit} data-testid="form">
        <RadioGroup name="cuenta" defaultValue="ahorro">
          <Radio value="ahorro">Ahorro</Radio>
          <Radio value="corriente">Corriente</Radio>
        </RadioGroup>
      </form>,
    );

    await userEvent.click(screen.getByRole("radio", { name: "Corriente" }));

    expect(onSubmit).not.toHaveBeenCalled();
    const form = screen.getByTestId("form") as HTMLFormElement;
    expect(new FormData(form).get("cuenta")).toBe("corriente");
  });

  it("permite sobreescribir estilos por className", () => {
    render(
      <RadioGroup defaultValue="a">
        <Radio value="a" appearance="card" className="rounded-none">
          A
        </Radio>
      </RadioGroup>,
    );
    // tailwind-merge debe descartar el rounded-xl de la tarjeta, no acumularlo.
    const cls = screen.getByRole("radio", { name: "A" }).className;
    expect(cls).toContain("rounded-none");
    expect(cls).not.toContain("rounded-xl");
  });
});
