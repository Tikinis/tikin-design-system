import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Steps, StepsDots, type StepItem } from "./steps";

/* Estos tests cubren COMPORTAMIENTO, no apariencia. La geometria (circulo 30,
 * conector 2px, columna 100, pildora 24x8) se verifica contra el navegador, no
 * aqui: jsdom no aplica CSS, asi que comprobar clases seria tautologico.
 *
 * El color del conector si se mira aqui, y no es una excepcion caprichosa:
 * llenarlo o no es la regla central del componente y es logica condicional, no
 * medida. Lo unico que se afirma es cual de las dos clases sale, nunca que pinte
 * dos pixeles. */

const STEPS: StepItem[] = [{ label: "Monto" }, { label: "Destino" }, { label: "Confirmar" }];

/** Los conectores no tienen rol ni texto: se buscan por su data-slot. */
const conectores = () =>
  Array.from(document.querySelectorAll<HTMLElement>("[data-slot='step-connector']"));

describe("Steps", () => {
  it("es una lista ordenada de verdad, con un item por paso", () => {
    render(<Steps steps={STEPS} value={1} aria-label="Progreso" />);
    // El numero de paso y el total salen de la semantica del <ol>, no de texto
    // inventado: por eso el lector de pantalla los anuncia solo.
    const list = screen.getByRole("list", { name: "Progreso" });
    expect(within(list).getAllByRole("listitem")).toHaveLength(3);
  });

  it("lleva role=list explicito para sobrevivir al reset de Tailwind", () => {
    // El preflight de Tailwind pinta `ol, ul, menu { list-style: none }`, y
    // WebKit retira la semantica de lista de cualquier lista sin viñeta: sin
    // este role, VoiceOver deja de anunciar "lista, 3 elementos" y el usuario
    // pierde el numero de paso y el total, que es TODO lo que da este
    // componente. El rol implicito de jsdom no basta: hay que pintarlo.
    render(<Steps steps={STEPS} aria-label="Progreso" />);
    expect(screen.getByRole("list")).toHaveAttribute("role", "list");
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

  it("no se queda sin paso actual con un value que no es numero", () => {
    // `Number(campo.value)` sobre un campo vacio devuelve NaN, y NaN atravesaba
    // el clamp entero: ninguna comparacion casaba, la lista quedaba toda
    // "pendiente" y sin aria-current, sin ningun error que lo delatara.
    render(<Steps steps={STEPS} value={Number.NaN} aria-label="Progreso" />);
    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveAttribute("aria-current", "step");
    expect(items[0]).toHaveTextContent("Paso actual");
  });

  it("llena el conector cuando el paso de su izquierda esta hecho, y solo entonces", () => {
    // Es la regla central del componente. Las dos clases de color viven en la
    // misma variante a proposito: si `bg-edge` volviera a la base de cva, las
    // dos saldrian juntas y quien ganara dependeria del orden de la hoja de
    // Tailwind, no del estado.
    render(<Steps steps={STEPS} value={1} aria-label="Progreso" />);

    // value=1: Monto hecho, Destino actual. Conector 1 (Monto→Destino) lleno,
    // conector 2 (Destino→Confirmar) vacio.
    const [primero, segundo] = conectores();
    expect(conectores()).toHaveLength(2);

    expect(primero).toHaveClass("bg-ink");
    expect(primero).not.toHaveClass("bg-edge");

    expect(segundo).toHaveClass("bg-edge");
    expect(segundo).not.toHaveClass("bg-ink");
  });

  it("un paso con error no llena su conector: el error no hace avanzar el flujo", () => {
    render(
      <Steps
        steps={[{ label: "Monto" }, { label: "Destino", status: "error" }, { label: "Confirmar" }]}
        value={1}
        aria-label="Progreso"
      />,
    );
    const [primero, segundo] = conectores();
    expect(primero).toHaveClass("bg-ink");
    expect(segundo).toHaveClass("bg-edge");
  });

  it("en vertical el conector cuelga del paso hecho, con la misma regla", () => {
    render(<Steps steps={STEPS} value={1} orientation="vertical" aria-label="Progreso" />);
    const [primero, segundo] = conectores();
    // El ultimo paso no lleva conector detras en ninguno de los dos ejes.
    expect(conectores()).toHaveLength(2);
    expect(primero).toHaveClass("bg-ink");
    expect(segundo).toHaveClass("bg-edge");
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

  it("en vertical el paso pendiente deja el anillo vacio, sin numero", () => {
    // Asi lo dibuja el bloque VERTICAL del documento: alli la etiqueta es un
    // titulo de 15 que ya ordena la lista, y el numero solo compite con el. En
    // horizontal la etiqueta es mono 11 y el numero si aporta.
    const { rerender } = render(
      <Steps steps={STEPS} value={1} orientation="vertical" aria-label="Progreso" />,
    );
    expect(screen.queryByText("3")).not.toBeInTheDocument();

    rerender(<Steps steps={STEPS} value={1} orientation="horizontal" aria-label="Progreso" />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("currentIndicator=number pinta la cifra del paso actual en vez del punto", () => {
    // Reproduce el ejemplo horizontal del documento, que dibuja el "2" dentro
    // del anillo. Por defecto gana el punto y no hay cifra que encontrar.
    const { rerender } = render(<Steps steps={STEPS} value={1} aria-label="Progreso" />);
    expect(screen.queryByText("2")).not.toBeInTheDocument();

    rerender(<Steps steps={STEPS} value={1} currentIndicator="number" aria-label="Progreso" />);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("statusLabels sustituye los textos que lee el lector de pantalla", () => {
    render(
      <Steps
        steps={STEPS}
        value={1}
        statusLabels={{ done: "Listo", current: "Aqui estas", pending: "Falta", error: "Falló" }}
        aria-label="Progreso"
      />,
    );
    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("Listo");
    expect(items[1]).toHaveTextContent("Aqui estas");
    expect(items[2]).toHaveTextContent("Falta");
    // Y el texto por defecto desaparece del todo, no se acumula.
    expect(screen.queryByText("Completado")).not.toBeInTheDocument();
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

  it("el grupo tiene nombre accesible, no solo texto dentro", () => {
    // `group` no calcula su nombre a partir del contenido: sin aria-label el
    // lector anunciaba "grupo" a secas al entrar. toHaveTextContent pasaba
    // igualmente, por eso hace falta preguntar por el nombre.
    render(<StepsDots count={5} value={2} />);
    expect(screen.getByRole("group", { name: "Paso 3 de 5" })).toBeInTheDocument();
  });

  it("el consumidor puede renombrar el grupo", () => {
    // aria-label va antes del spread: el de fuera manda.
    render(<StepsDots count={3} value={0} aria-label="Onboarding" />);
    expect(screen.getByRole("group", { name: "Onboarding" })).toBeInTheDocument();
  });

  it("un count que no es numero no produce un texto roto", () => {
    render(<StepsDots count={Number.NaN} />);
    expect(screen.getByRole("group", { name: "Paso 0 de 0" })).toBeInTheDocument();
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
