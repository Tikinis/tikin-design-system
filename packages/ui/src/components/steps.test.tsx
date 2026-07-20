import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Steps, StepsDots, type StepItem } from "./steps";

/* Estos tests cubren COMPORTAMIENTO, no apariencia. La geometria (circulo 30,
 * conector 2px, columna 100, pildora 24x8) se verifica contra el navegador, no
 * aqui: jsdom no aplica CSS, asi que comprobar clases seria tautologico. */

const STEPS: StepItem[] = [
  { label: "Monto" },
  { label: "Destino" },
  { label: "Confirmar" },
];

describe("Steps", () => {
  it("es una lista ordenada de verdad, con un item por paso", () => {
    render(<Steps steps={STEPS} value={1} aria-label="Progreso" />);
    // El numero de paso y el total salen de la semantica del <ol>, no de texto
    // inventado: por eso el lector de pantalla los anuncia solo.
    const list = screen.getByRole("list", { name: "Progreso" });
    expect(within(list).getAllByRole("listitem")).toHaveLength(3);
  });

  it("deriva los estados de value y marca el actual con aria-current", () => {
    render(<Steps steps={STEPS} value={1} aria-label="Progreso" />);
    const items = screen.getAllByRole("listitem");

    expect(items[0]).toHaveTextContent("Completado");
    expect(items[0]).not.toHaveAttribute("aria-current");

    expect(items[1]).toHaveAttribute("aria-current", "step");
    expect(items[1]).toHaveTextContent("Paso actual");

    expect(items[2]).toHaveTextContent("Pendiente");
  });

  it("un status explicito gana sobre el derivado de la posicion", () => {
    // El error no se deduce de la posicion: es la unica forma de marcarlo.
    render(
      <Steps
        steps={[{ label: "Monto" }, { label: "Destino", status: "error" }, { label: "Confirmar" }]}
        value={1}
        aria-label="Progreso"
      />,
    );
    const items = screen.getAllByRole("listitem");
    expect(items[1]).toHaveTextContent("Con error");
    // aria-current sale de `value`, no del status: el usuario sigue estando ahi
    // aunque su piel sea de error, y la lista no puede quedarse sin paso actual.
    expect(items[1]).toHaveAttribute("aria-current", "step");
  });

  it("satura un value fuera de rango en vez de dejar la lista sin paso actual", () => {
    const { rerender } = render(<Steps steps={STEPS} value={99} aria-label="Progreso" />);
    expect(screen.getAllByRole("listitem")[2]).toHaveAttribute("aria-current", "step");

    rerender(<Steps steps={STEPS} value={-5} aria-label="Progreso" />);
    expect(screen.getAllByRole("listitem")[0]).toHaveAttribute("aria-current", "step");
  });

  it("sin onStepSelect no renderiza ningun boton: es salida, no control", () => {
    render(<Steps steps={STEPS} value={2} aria-label="Progreso" />);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("con onStepSelect solo los pasos hechos son tocables", async () => {
    const onStepSelect = vi.fn();
    render(<Steps steps={STEPS} value={2} onStepSelect={onStepSelect} aria-label="Progreso" />);

    // Hechos: Monto y Destino. El actual (Confirmar) no vuelve a si mismo.
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);

    await userEvent.click(screen.getByRole("button", { name: /Monto/ }));
    expect(onStepSelect).toHaveBeenCalledWith(0);
  });

  it("los pasos tocables se operan con teclado, sin manejadores a mano", async () => {
    const onStepSelect = vi.fn();
    render(<Steps steps={STEPS} value={2} onStepSelect={onStepSelect} aria-label="Progreso" />);

    // Son <button> nativos: Tab los alcanza en orden y Enter / Espacio activan.
    await userEvent.tab();
    expect(screen.getByRole("button", { name: /Monto/ })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(onStepSelect).toHaveBeenCalledWith(0);

    await userEvent.tab();
    expect(screen.getByRole("button", { name: /Destino/ })).toHaveFocus();
    await userEvent.keyboard(" ");
    expect(onStepSelect).toHaveBeenCalledWith(1);
  });

  it("un paso hecho pero disabled no se vuelve tocable", () => {
    render(
      <Steps
        steps={[{ label: "Monto", disabled: true }, { label: "Destino" }, { label: "Confirmar" }]}
        value={2}
        onStepSelect={vi.fn()}
        aria-label="Progreso"
      />,
    );
    expect(screen.queryByRole("button", { name: /Monto/ })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Destino/ })).toBeInTheDocument();
  });

  it("dentro de un formulario los pasos tocables no lo envian", async () => {
    // Un <button> sin type dentro de un <form> envia. Es el fallo clasico.
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Steps steps={STEPS} value={2} onStepSelect={vi.fn()} aria-label="Progreso" />
      </form>,
    );
    await userEvent.click(screen.getByRole("button", { name: /Monto/ }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("solo pinta el detalle en vertical, que es el modo pensado para el", () => {
    const conDetalle: StepItem[] = [
      { label: "Monto", description: "$250.000 COP" },
      { label: "Destino", description: "Elige a quien enviar" },
    ];

    const { rerender } = render(
      <Steps steps={conDetalle} value={1} orientation="vertical" aria-label="Progreso" />,
    );
    expect(screen.getByText("$250.000 COP")).toBeInTheDocument();

    rerender(<Steps steps={conDetalle} value={1} orientation="horizontal" aria-label="Progreso" />);
    expect(screen.queryByText("$250.000 COP")).not.toBeInTheDocument();
  });

  it("en vertical los pasos hechos tambien son tocables", async () => {
    const onStepSelect = vi.fn();
    render(
      <Steps
        steps={STEPS}
        value={1}
        orientation="vertical"
        onStepSelect={onStepSelect}
        aria-label="Progreso"
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: /Monto/ }));
    expect(onStepSelect).toHaveBeenCalledWith(0);
  });

  it("no pone las etiquetas en mayusculas en JS, solo por CSS si hiciera falta", () => {
    // Importa para el texto accesible y para lo que se copia al portapapeles.
    render(<Steps steps={[{ label: "Confirmar envio" }]} aria-label="Progreso" />);
    expect(screen.getByRole("list")).toHaveTextContent("Confirmar envio");
  });

  it("permite sobreescribir estilos por className", () => {
    render(<Steps steps={STEPS} className="w-auto" aria-label="Progreso" />);
    // tailwind-merge debe descartar el w-full del layout horizontal.
    const cls = screen.getByRole("list").className;
    expect(cls).toContain("w-auto");
    expect(cls).not.toContain("w-full");
  });

  it("acepta una lista vacia sin romperse", () => {
    render(<Steps steps={[]} value={3} aria-label="Progreso" />);
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });
});

describe("StepsDots", () => {
  it("anuncia el paso y el total en un solo texto", () => {
    render(<StepsDots count={5} value={2} />);
    // Anunciar cinco puntos uno a uno seria ruido: van todos aria-hidden.
    expect(screen.getByRole("group")).toHaveTextContent("Paso 3 de 5");
  });

  it("satura el valor y admite un formato propio", () => {
    render(<StepsDots count={4} value={99} formatLabel={(c, t) => `${c}/${t}`} />);
    expect(screen.getByRole("group")).toHaveTextContent("4/4");
  });

  it("acepta count 0 sin producir un indice negativo", () => {
    render(<StepsDots count={0} />);
    expect(screen.getByRole("group")).toHaveTextContent("Paso 0 de 0");
  });
});
