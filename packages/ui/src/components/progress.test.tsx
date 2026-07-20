import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Progress } from "./progress";

/* Estos tests cubren COMPORTAMIENTO, no apariencia. Las medidas del documento
 * (alto 8, r999, arco r38 con trazo 12) se verifican contra el navegador, no
 * aqui: jsdom no aplica CSS, asi que comprobar clases seria tautologico.
 *
 * Lo que si es comportamiento en un progressbar: que exponga el valor correcto
 * al arbol de accesibilidad, que sepa distinguir indeterminado de 0%, que no se
 * cuele en el orden de tabulacion, y que sanee valores fuera de rango. */

/* El circular pinta dos <circle>: la pista y, encima, el arco de relleno. Con
   TS estricto el indice de un NodeList puede ser undefined, asi que se falla el
   test aqui en vez de arrastrar el undefined hasta el assert. */
const circulos = (container: HTMLElement) => {
  const [pista, arco] = Array.from(container.querySelectorAll("svg circle"));
  if (!pista || !arco) throw new Error("el circular debe pintar pista y arco");
  return { pista, arco };
};

describe("Progress", () => {
  it("expone el valor en el arbol de accesibilidad, no solo visualmente", () => {
    render(<Progress aria-label="Progreso del envio" value={40} />);
    const bar = screen.getByRole("progressbar", { name: "Progreso del envio" });

    expect(bar).toHaveAttribute("aria-valuenow", "40");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
    // Radix genera el texto legible: un lector anuncia "40%", no "40".
    expect(bar).toHaveAttribute("aria-valuetext", "40%");
  });

  it("traduce el valor a la escala de max", () => {
    render(<Progress aria-label="Pasos" value={3} max={6} />);
    const bar = screen.getByRole("progressbar");

    expect(bar).toHaveAttribute("aria-valuenow", "3");
    expect(bar).toHaveAttribute("aria-valuemax", "6");
    expect(bar).toHaveAttribute("aria-valuetext", "50%");
  });

  it("value={null} es indeterminado y NO anuncia un valor falso", () => {
    render(<Progress aria-label="Cargando" value={null} />);
    const bar = screen.getByRole("progressbar");

    // Un aria-valuenow=0 diria "no ha avanzado nada", que es una afirmacion
    // distinta de "no se cuanto lleva".
    expect(bar).not.toHaveAttribute("aria-valuenow");
    expect(bar).toHaveAttribute("data-state", "indeterminate");
  });

  it("sin value tambien es indeterminado", () => {
    render(<Progress aria-label="Cargando" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("data-state", "indeterminate");
  });

  it("0% es determinado y se distingue del indeterminado", () => {
    render(<Progress aria-label="Progreso" value={0} />);
    const bar = screen.getByRole("progressbar");

    expect(bar).toHaveAttribute("aria-valuenow", "0");
    expect(bar).toHaveAttribute("data-state", "loading");
  });

  it("marca data-state=complete al llegar al maximo", () => {
    render(<Progress aria-label="Progreso" value={100} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("data-state", "complete");
  });

  it("sanea valores fuera de rango sin que Radix proteste por consola", () => {
    // Radix escribe un console.error si el valor no cabe en [0, max]. El
    // componente lo recorta antes, asi que un dato sucio de la API no ensucia
    // la consola del consumidor ni desborda la barra.
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const { rerender } = render(<Progress aria-label="Progreso" value={150} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");

    rerender(<Progress aria-label="Progreso" value={-20} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");

    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });

  it("con max invalido no produce NaN ni rompe el rango", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<Progress aria-label="Progreso" value={10} max={0} />);
    const bar = screen.getByRole("progressbar");

    expect(bar).toHaveAttribute("aria-valuemax", "100");
    expect(bar).toHaveAttribute("aria-valuenow", "10");
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });

  it("no entra en el orden de tabulacion: es salida, no control", async () => {
    // Un progressbar enfocable obliga al usuario de teclado a pasar por encima
    // de algo con lo que no puede hacer nada. Si hay que elegir un valor, eso
    // es un slider, no un progress.
    render(
      <div>
        <button type="button">Antes</button>
        <Progress aria-label="Progreso" value={40} />
        <button type="button">Despues</button>
      </div>,
    );

    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Antes" })).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Despues" })).toHaveFocus();
  });

  it("con showCheck reserva el hueco del check y solo lo marca al 100%", () => {
    const { container, rerender } = render(
      <Progress aria-label="Meta" tone="lime" value={72} showCheck />,
    );
    const check = container.querySelector("[data-tk-progress-check]");

    // El hueco existe siempre: si el icono apareciera de la nada, la barra se
    // encogeria de golpe justo al completarse.
    expect(check).not.toBeNull();
    expect(check).toHaveAttribute("data-state", "loading");

    rerender(<Progress aria-label="Meta" tone="lime" value={100} showCheck />);
    expect(container.querySelector("[data-tk-progress-check]")).toHaveAttribute(
      "data-state",
      "complete",
    );
  });

  it("el check no se anuncia: el estado ya lo lleva el progressbar", () => {
    const { container } = render(<Progress aria-label="Meta" value={100} showCheck />);
    expect(container.querySelector("[data-tk-progress-check]")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("el circular expone el mismo contrato de accesibilidad que el lineal", () => {
    render(<Progress aria-label="Ahorro" shape="circular" value={70} />);
    const bar = screen.getByRole("progressbar", { name: "Ahorro" });

    expect(bar).toHaveAttribute("aria-valuenow", "70");
    expect(bar).toHaveAttribute("aria-valuetext", "70%");
  });

  it("la cifra del circular es decoracion: se pinta pero no se anuncia dos veces", () => {
    const { container } = render(<Progress aria-label="Ahorro" shape="circular" value={70} />);

    // El texto esta en el DOM para quien ve la pantalla...
    expect(container.querySelector("svg text")?.textContent).toBe("70%");
    // ...pero el SVG entero va aria-hidden, o el lector leeria el 70% dos veces.
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("el circular indeterminado no pinta cifra alguna", () => {
    const { container } = render(<Progress aria-label="Ahorro" shape="circular" value={null} />);
    expect(container.querySelector("svg text")).toBeNull();
  });

  it("showValue={false} oculta la cifra del circular", () => {
    const { container } = render(
      <Progress aria-label="Ahorro" shape="circular" value={70} showValue={false} />,
    );
    expect(container.querySelector("svg text")).toBeNull();
  });

  it("acepta getValueLabel para dar contexto al lector de pantalla", () => {
    render(
      <Progress
        aria-label="Envio"
        value={2}
        max={3}
        getValueLabel={(value: number, max: number) => `paso ${value} de ${max}`}
      />,
    );
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuetext", "paso 2 de 3");
  });

  it("permite sobreescribir estilos por className", () => {
    render(<Progress aria-label="Progreso" value={40} className="rounded-none" />);
    const cls = screen.getByRole("progressbar").className;

    // tailwind-merge debe descartar el rounded-full de la pista, no acumularlo.
    expect(cls).toContain("rounded-none");
    expect(cls).not.toContain("rounded-full");
  });

  /* ---------------------------------------------------------------------
   * Geometria. `aria-valuenow` lo genera Radix a partir de value/max, asi que
   * verificarlo NO prueba que el componente traduzca el valor a pixeles. La
   * unica cuenta propia del componente es esa traduccion, y tanto el `width`
   * del indicador lineal como el `stroke-dasharray` del arco son atributos
   * observables en jsdom sin necesidad de CSS.
   * ------------------------------------------------------------------- */

  it("traduce el valor a la anchura de la barra, no solo al arbol accesible", () => {
    render(<Progress aria-label="Pasos" value={3} max={6} />);
    const relleno = screen.getByRole("progressbar").querySelector("[data-state]");

    // 3 de 6 son la mitad de la pista: si se pintara `value` en crudo saldria 3%.
    expect(relleno).toHaveStyle({ width: "50%" });
  });

  it("el saneado de valores llega hasta la anchura pintada", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const { rerender } = render(<Progress aria-label="Progreso" value={150} />);
    expect(screen.getByRole("progressbar").querySelector("[data-state]")).toHaveStyle({
      width: "100%",
    });

    rerender(<Progress aria-label="Progreso" value={-20} />);
    expect(screen.getByRole("progressbar").querySelector("[data-state]")).toHaveStyle({
      width: "0%",
    });
    error.mockRestore();
  });

  it("el arco circular recorta la circunferencia segun el valor", () => {
    // max=50 a proposito: si el arco se dibujara con el valor en crudo en vez
    // de con el porcentaje, 25 pintaria un cuarto de vuelta y no media.
    const { container } = render(
      <Progress aria-label="Ahorro" shape="circular" value={25} max={50} />,
    );
    const { arco } = circulos(container);
    const circunferencia = 2 * Math.PI * 38; // r=38 en el viewBox de 96

    const [pintado, total] = (arco.getAttribute("stroke-dasharray") ?? "").split(" ").map(Number);
    expect(total).toBeCloseTo(circunferencia, 2);
    expect(pintado).toBeCloseTo(circunferencia * 0.5, 2);
  });

  it("al 0% el arco no deja un punto suelto arriba", () => {
    // Un tramo de longitud cero con extremo redondeado se dibuja como un punto:
    // un circular vacio marcaria un avance que no existe.
    const { container } = render(<Progress aria-label="Ahorro" shape="circular" value={0} />);
    expect(circulos(container).arco).toHaveAttribute("stroke-linecap", "butt");

    const { container: conAvance } = render(
      <Progress aria-label="Ahorro" shape="circular" value={10} />,
    );
    expect(circulos(conAvance).arco).toHaveAttribute("stroke-linecap", "round");
  });

  /* ---------------------------------------------------------------------
   * Tono. Lineal y circular comparten una sola tabla de color a traves de
   * --tk-progress-fill; si la variante se rompiera, todo seguiria pintando en
   * tinta sin que ningun test de accesibilidad se enterase.
   * ------------------------------------------------------------------- */

  it("el tono viaja por --tk-progress-fill y distingue lima de tinta", () => {
    const { rerender } = render(<Progress aria-label="Progreso" value={40} />);
    expect(screen.getByRole("progressbar").className).toContain(
      "[--tk-progress-fill:var(--tk-ink)]",
    );

    rerender(<Progress aria-label="Meta" value={40} tone="lime" />);
    expect(screen.getByRole("progressbar").className).toContain(
      "[--tk-progress-fill:var(--colours-limegreen-400)]",
    );
  });

  it("el circular usa la misma tabla de color que el lineal", () => {
    render(<Progress aria-label="Meta" shape="circular" value={40} tone="lime" />);
    expect(screen.getByRole("progressbar").className).toContain(
      "[--tk-progress-fill:var(--colours-limegreen-400)]",
    );
  });

  it("la pista del circular tambien vira al completarse, igual que la lineal", () => {
    // El verde pertenece al estado, no a la forma: si solo virase el arco, el
    // mismo 100% se veria distinto en lineal y en circular.
    const { container, rerender } = render(
      <Progress aria-label="Ahorro" shape="circular" value={70} />,
    );
    expect(circulos(container).pista).toHaveAttribute("data-state", "loading");

    rerender(<Progress aria-label="Ahorro" shape="circular" value={100} />);
    const { pista } = circulos(container);
    expect(pista).toHaveAttribute("data-state", "complete");
    expect(pista.getAttribute("class")).toContain("data-[state=complete]:stroke-tint-success");
  });

  it("sin movimiento el arco indeterminado se cierra en vez de fingir un 30%", () => {
    // Congelado a 30% de circunferencia seria indistinguible de un progreso
    // determinado del 30%; cerrado y atenuado no afirma ningun valor.
    const { container } = render(<Progress aria-label="Cargando" shape="circular" value={null} />);
    const clases = circulos(container).arco.getAttribute("class") ?? "";

    expect(clases).toContain("motion-reduce:[stroke-dasharray:none]");
    expect(clases).toContain("motion-reduce:opacity-60");
  });

  it("avisa en desarrollo de que showCheck no aplica al circular", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<Progress aria-label="Ahorro" shape="circular" value={70} showCheck />);

    expect(warn).toHaveBeenCalled();
    expect(String(warn.mock.calls[0]?.[0])).toContain("showCheck");
    warn.mockRestore();
  });

  it("no avisa cuando showCheck se usa donde corresponde", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<Progress aria-label="Meta" value={70} showCheck />);
    expect(warn).not.toHaveBeenCalled();

    warn.mockClear();
    render(<Progress aria-label="Ahorro" shape="circular" value={70} />);
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it("reenvia el ref al elemento con role=progressbar", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Progress ref={ref} aria-label="Progreso" value={40} />);
    expect(ref.current).toBe(screen.getByRole("progressbar"));
  });
});
