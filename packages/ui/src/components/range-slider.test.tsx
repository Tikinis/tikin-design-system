import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RangeSlider } from "./range-slider";

/* Tests de COMPORTAMIENTO, no de apariencia. La geometria (pista 6, manija 22,
 * relleno lima) se verifica contra el navegador: jsdom no aplica CSS, asi que
 * comprobar clases seria tautologico.
 *
 * Tampoco se prueba el arrastre con puntero: Radix calcula la posicion con
 * getBoundingClientRect, y en jsdom todo mide 0x0, asi que un drag simulado
 * siempre daria el mismo valor. El teclado si es logica real y es ademas el
 * camino que tiene que funcionar por accesibilidad. */

/* Radix mide la manija con ResizeObserver para centrarla sobre la pista, y jsdom
 * no lo implementa. El stub va aqui y no en el setup compartido para no cambiar
 * el entorno de otros paquetes. */
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver;

const pesos = (v: number) => `$ ${v.toLocaleString("es-CO")}`;

function Monto(props: Partial<React.ComponentProps<typeof RangeSlider>>) {
  return (
    <RangeSlider
      min={0}
      max={1_000_000}
      step={10_000}
      defaultValue={[300_000, 750_000]}
      formatValue={pesos}
      thumbLabels={["Monto mínimo", "Monto máximo"]}
      {...props}
    />
  );
}

describe("RangeSlider", () => {
  it("expone dos manijas con rol slider y nombre accesible propio", () => {
    render(<Monto />);
    const manijas = screen.getAllByRole("slider");
    expect(manijas).toHaveLength(2);
    expect(screen.getByRole("slider", { name: "Monto mínimo" })).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: "Monto máximo" })).toBeInTheDocument();
  });

  it("usa nombres por defecto cuando el consumidor no los da", () => {
    render(<RangeSlider defaultValue={[20, 80]} />);
    expect(screen.getByRole("slider", { name: "Mínimo" })).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: "Máximo" })).toBeInTheDocument();
  });

  it("mueve la manija enfocada con las flechas respetando el step", async () => {
    const onValueChange = vi.fn();
    render(<Monto onValueChange={onValueChange} />);
    const minimo = screen.getByRole("slider", { name: "Monto mínimo" });

    minimo.focus();
    expect(minimo).toHaveFocus();

    await userEvent.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenCalledWith([310_000, 750_000]);
    expect(minimo).toHaveAttribute("aria-valuenow", "310000");

    await userEvent.keyboard("{ArrowLeft}{ArrowLeft}");
    expect(minimo).toHaveAttribute("aria-valuenow", "290000");
  });

  it("Home y End abren el rango a sus limites", async () => {
    render(<Monto />);
    const minimo = screen.getByRole("slider", { name: "Monto mínimo" });
    const maximo = screen.getByRole("slider", { name: "Monto máximo" });

    // Ojo: Home y End NO actuan sobre la manija enfocada. En un slider de rango
    // Radix manda la primera manija al minimo y la ultima al maximo, se pulsen
    // desde donde se pulsen. Es coherente: en un rango "ir al final" significa
    // abrir el intervalo, no apilar las dos manijas en el mismo extremo.
    maximo.focus();
    await userEvent.keyboard("{End}");
    expect(maximo).toHaveAttribute("aria-valuenow", "1000000");
    expect(minimo).toHaveAttribute("aria-valuenow", "300000");

    await userEvent.keyboard("{Home}");
    expect(minimo).toHaveAttribute("aria-valuenow", "0");
    expect(maximo).toHaveAttribute("aria-valuenow", "1000000");
  });

  it("la manija izquierda nunca queda por encima de la derecha", async () => {
    render(<RangeSlider min={0} max={10} defaultValue={[3, 7]} />);
    const minimo = screen.getByRole("slider", { name: "Mínimo" });
    const maximo = screen.getByRole("slider", { name: "Máximo" });

    minimo.focus();
    // Cuatro pasos justos hasta tocar a la otra manija.
    await userEvent.keyboard("{ArrowRight}".repeat(4));
    expect(minimo).toHaveAttribute("aria-valuenow", "7");
    expect(maximo).toHaveAttribute("aria-valuenow", "7");

    // Un paso mas: el par sigue ordenado. Radix no deja que se crucen, reasigna
    // los valores entre manijas para que la izquierda siga siendo la menor.
    await userEvent.keyboard("{ArrowRight}");
    const izquierda = Number(minimo.getAttribute("aria-valuenow"));
    const derecha = Number(maximo.getAttribute("aria-valuenow"));
    expect(izquierda).toBeLessThanOrEqual(derecha);
  });

  it("refleja el valor en pantalla cuando no esta controlado", async () => {
    render(<Monto />);
    expect(screen.getByText("$ 300.000")).toBeInTheDocument();

    screen.getByRole("slider", { name: "Monto mínimo" }).focus();
    await userEvent.keyboard("{ArrowRight}");

    expect(screen.getByText("$ 310.000")).toBeInTheDocument();
    expect(screen.queryByText("$ 300.000")).not.toBeInTheDocument();
  });

  it("controlado, no se mueve solo: manda la prop value", async () => {
    const onValueChange = vi.fn();
    render(<Monto value={[300_000, 750_000]} onValueChange={onValueChange} />);

    screen.getByRole("slider", { name: "Monto mínimo" }).focus();
    await userEvent.keyboard("{ArrowRight}");

    // Avisa del intento...
    expect(onValueChange).toHaveBeenCalledWith([310_000, 750_000]);
    // ...pero sin que el padre actualice la prop, el valor pintado no cambia.
    expect(screen.getByText("$ 300.000")).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: "Monto mínimo" })).toHaveAttribute(
      "aria-valuenow",
      "300000",
    );
  });

  it("aplica formatValue a los valores, a los limites y al texto accesible", () => {
    render(<Monto />);
    // Extremos elegidos arriba.
    expect(screen.getByText("$ 300.000")).toBeInTheDocument();
    expect(screen.getByText("$ 750.000")).toBeInTheDocument();
    // Limites del rango abajo.
    expect(screen.getByText("$ 0")).toBeInTheDocument();
    expect(screen.getByText("$ 1.000.000")).toBeInTheDocument();
    // Y lo que anuncia el lector de pantalla, que si no leeria "750000".
    expect(screen.getByRole("slider", { name: "Monto máximo" })).toHaveAttribute(
      "aria-valuetext",
      "$ 750.000",
    );
  });

  it("permite ocultar las filas de valores y de limites", () => {
    render(<Monto showValues={false} showBounds={false} />);
    expect(screen.queryByText("$ 300.000")).not.toBeInTheDocument();
    expect(screen.queryByText("$ 1.000.000")).not.toBeInTheDocument();
    // El control sigue siendo utilizable y anunciable.
    expect(screen.getAllByRole("slider")).toHaveLength(2);
  });

  it("deshabilitado saca las manijas del orden de tabulacion y no responde al teclado", async () => {
    const onValueChange = vi.fn();
    render(<Monto disabled onValueChange={onValueChange} />);
    const minimo = screen.getByRole("slider", { name: "Monto mínimo" });

    expect(minimo).not.toHaveAttribute("tabindex");
    minimo.focus();
    await userEvent.keyboard("{ArrowRight}");

    expect(onValueChange).not.toHaveBeenCalled();
    expect(minimo).toHaveAttribute("aria-valuenow", "300000");
  });

  it("abre en todo el rango cuando no se le da defaultValue", () => {
    render(<RangeSlider min={10} max={90} />);
    const [minimo, maximo] = screen.getAllByRole("slider");
    expect(minimo).toHaveAttribute("aria-valuenow", "10");
    expect(maximo).toHaveAttribute("aria-valuenow", "90");
  });

  it("onValueCommit entrega el par completo al consumidor", async () => {
    const onValueCommit = vi.fn();
    render(<Monto onValueCommit={onValueCommit} />);

    screen.getByRole("slider", { name: "Monto mínimo" }).focus();
    await userEvent.keyboard("{ArrowRight}");

    // Con teclado, Radix confirma en el keyup de CADA paso: es el momento en que
    // el usuario "suelta". Por eso este test no puede afirmar "solo al soltar";
    // lo unico verificable por este camino es que llega el par entero, no solo
    // la manija que se movio. El "solo al soltar" es cosa del arrastre con
    // puntero, que jsdom no puede ejercitar (getBoundingClientRect mide 0x0).
    expect(onValueCommit).toHaveBeenCalledWith([310_000, 750_000]);
  });

  it("respeta minStepsBetweenThumbs y no deja que las manijas se acerquen mas", async () => {
    render(
      <RangeSlider min={0} max={10} step={1} defaultValue={[3, 7]} minStepsBetweenThumbs={2} />,
    );
    const minimo = screen.getByRole("slider", { name: "Mínimo" });

    minimo.focus();
    // Cuatro pasos intentarian llegar a 7; el hueco de 2 lo frena en 5.
    await userEvent.keyboard("{ArrowRight}".repeat(4));
    expect(minimo).toHaveAttribute("aria-valuenow", "5");
    expect(screen.getByRole("slider", { name: "Máximo" })).toHaveAttribute("aria-valuenow", "7");
  });

  it("solo emite aria-valuetext cuando el consumidor da un formatValue propio", () => {
    // Sin formatValue el valuetext seria la misma cifra cruda que el valuenow, y
    // varios lectores anuncian el valuetext en lugar del valuenow, perdiendo el
    // formateo numerico que el propio lector aplicaria.
    const { unmount } = render(<RangeSlider min={0} max={100} defaultValue={[20, 80]} />);
    for (const manija of screen.getAllByRole("slider")) {
      expect(manija).not.toHaveAttribute("aria-valuetext");
    }
    unmount();

    render(<Monto />);
    expect(screen.getByRole("slider", { name: "Monto máximo" })).toHaveAttribute(
      "aria-valuetext",
      "$ 750.000",
    );
  });

  it("no revienta ni pinta NaN cuando min y max coinciden", () => {
    // Radix posiciona la manija con (v - min) / (max - min): sin saneo esto es
    // una division por cero, sale `left: calc(NaN% + 0px)` y jsdom lanza.
    expect(() => render(<RangeSlider min={50} max={50} />)).not.toThrow();
    const manijas = screen.getAllByRole("slider");
    expect(manijas).toHaveLength(2);
    for (const manija of manijas) {
      expect(manija.getAttribute("style") ?? "").not.toContain("NaN");
    }
  });

  it("endereza un rango invertido en vez de descartarlo", () => {
    // min y max permutados por el consumidor: se ordenan, no se ignoran.
    render(<RangeSlider min={90} max={10} />);
    const [minimo, maximo] = screen.getAllByRole("slider");
    expect(minimo).toHaveAttribute("aria-valuemin", "10");
    expect(maximo).toHaveAttribute("aria-valuemax", "90");
    // Los limites de abajo tambien salen ordenados (y ademas coinciden con los
    // valores de arriba, porque sin defaultValue el rango abre entero).
    expect(screen.getAllByText("10").length).toBeGreaterThan(0);
    expect(screen.getAllByText("90").length).toBeGreaterThan(0);
  });

  it("recorta al rango un valor que se sale de el, para que numero y manija coincidan", () => {
    render(<RangeSlider min={0} max={100} value={[-40, 300]} />);
    const [minimo, maximo] = screen.getAllByRole("slider");
    expect(minimo).toHaveAttribute("aria-valuenow", "0");
    expect(maximo).toHaveAttribute("aria-valuenow", "100");
    // Y lo pintado arriba dice lo mismo que la manija, no "-40" y "300".
    expect(screen.queryByText("-40")).not.toBeInTheDocument();
    expect(screen.queryByText("300")).not.toBeInTheDocument();
  });

  it("espeja las filas de texto cuando el recorrido va al reves", () => {
    // Radix invierte su pista con `inverted`, pero las filas de valores y de
    // limites viven fuera de su arbol: sin espejarlas, el minimo se pintaria a
    // la izquierda con la manija minima ya a la derecha.
    const { container, rerender } = render(<Monto inverted />);
    const bloque = container.firstElementChild as HTMLElement;
    // Hijos <div> directos del bloque: la fila de valores y la de limites. El
    // control de Radix es un <span>, asi que no entra.
    const filas = () => Array.from(bloque.querySelectorAll(":scope > div"));
    expect(filas()).toHaveLength(2);
    for (const fila of filas()) {
      expect(fila.className).toContain("flex-row-reverse");
    }

    rerender(<Monto />);
    for (const fila of filas()) {
      expect(fila.className).not.toContain("flex-row-reverse");
    }
  });

  it("propaga dir al bloque entero y no solo a la pista de Radix", () => {
    // El envoltorio necesita el dir para que sus filas flex se coloquen de
    // derecha a izquierda; Radix no lee el DOM, asi que lo necesita tambien.
    const { container } = render(<Monto dir="rtl" data-testid="bloque" />);
    const bloque = container.firstElementChild as HTMLElement;
    expect(bloque).toHaveAttribute("dir", "rtl");
    expect(screen.getByRole("slider", { name: "Monto mínimo" }).closest("[dir]")).toHaveAttribute(
      "dir",
      "rtl",
    );
  });

  it("permite sobreescribir estilos del bloque por className", () => {
    const { container } = render(<Monto className="gap-0" />);
    const bloque = container.firstElementChild as HTMLElement;
    // tailwind-merge debe descartar el gap-3.5 del componente, no acumularlo.
    expect(bloque.className).toContain("gap-0");
    expect(bloque.className).not.toContain("gap-3.5");
  });

  it("className, style, id, data-* y ref apuntan todos al mismo elemento raiz", () => {
    // Antes className iba al envoltorio y el resto de props al Slider.Root: un
    // data-testid acababa en un nodo distinto que la clase con la que se pinto.
    const ref = React.createRef<HTMLDivElement>();
    const { container } = render(
      <Monto ref={ref} className="mi-clase" style={{ padding: 9 }} id="foo" data-testid="bloque" />,
    );
    const bloque = container.firstElementChild as HTMLElement;

    expect(ref.current).toBe(bloque);
    expect(screen.getByTestId("bloque")).toBe(bloque);
    expect(bloque).toHaveAttribute("id", "foo");
    expect(bloque.className).toContain("mi-clase");
    expect(bloque.style.padding).toBe("9px");
  });

  it("sliderClassName llega a la caja del control, no al bloque", () => {
    const { container } = render(<Monto className="mi-bloque" sliderClassName="mi-control" />);
    const bloque = container.firstElementChild as HTMLElement;
    expect(bloque.className).not.toContain("mi-control");

    const control = container.querySelector(".mi-control") as HTMLElement;
    expect(control).not.toBeNull();
    // Es el ancestro de las manijas, o sea el Slider.Root.
    expect(control).toContainElement(screen.getByRole("slider", { name: "Monto mínimo" }));
  });

  it("la variante tone cambia la clase del relleno", () => {
    const { container, rerender } = render(<Monto />);
    // Por defecto, lima: el relleno canonico de la seccion 40.
    expect(container.querySelector(".bg-lime")).not.toBeNull();
    expect(container.querySelector(".bg-ink")).toBeNull();

    rerender(<Monto tone="ink" />);
    expect(container.querySelector(".bg-ink")).not.toBeNull();
    expect(container.querySelector(".bg-lime")).toBeNull();
  });
});
