import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";

/* Estos tests cubren COMPORTAMIENTO, no apariencia. Los valores visuales
 * (r12, padding 16, caret 16 girando 150ms) se verifican contra el navegador,
 * no aqui: jsdom no aplica CSS, asi que comprobar clases seria tautologico. */

function Faq({
  type = "single",
  collapsible = true,
  disabledSegunda = false,
}: {
  type?: "single" | "multiple";
  collapsible?: boolean;
  disabledSegunda?: boolean;
} = {}) {
  const preguntas = [
    { id: "a", q: "Cuanto tarda una transferencia", a: "Entre 1 y 2 dias habiles." },
    { id: "b", q: "Puedo cancelar un envio", a: "Solo mientras siga pendiente." },
    { id: "c", q: "Hay comisiones", a: "Ninguna en los primeros cinco envios." },
  ];

  const rows = preguntas.map((p) => (
    <AccordionItem key={p.id} value={p.id} disabled={disabledSegunda && p.id === "b"}>
      <AccordionTrigger>{p.q}</AccordionTrigger>
      <AccordionContent>{p.a}</AccordionContent>
    </AccordionItem>
  ));

  return type === "single" ? (
    <Accordion type="single" collapsible={collapsible}>
      {rows}
    </Accordion>
  ) : (
    <Accordion type="multiple">{rows}</Accordion>
  );
}

const trigger = (nombre: string) => screen.getByRole("button", { name: nombre });

describe("Accordion", () => {
  it("empieza cerrado y no monta el contenido", () => {
    render(<Faq />);
    expect(trigger("Cuanto tarda una transferencia")).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Entre 1 y 2 dias habiles.")).not.toBeInTheDocument();
  });

  it("abre al pulsar cualquier punto de la fila, no solo el caret", async () => {
    render(<Faq />);
    await userEvent.click(trigger("Cuanto tarda una transferencia"));

    expect(trigger("Cuanto tarda una transferencia")).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Entre 1 y 2 dias habiles.")).toBeInTheDocument();
  });

  it("con type=single al abrir una cierra la anterior", async () => {
    render(<Faq />);
    await userEvent.click(trigger("Cuanto tarda una transferencia"));
    await userEvent.click(trigger("Puedo cancelar un envio"));

    expect(screen.queryByText("Entre 1 y 2 dias habiles.")).not.toBeInTheDocument();
    expect(screen.getByText("Solo mientras siga pendiente.")).toBeInTheDocument();
  });

  it("con collapsible cierra la fila abierta al volver a pulsarla", async () => {
    render(<Faq />);
    const btn = trigger("Cuanto tarda una transferencia");
    await userEvent.click(btn);
    await userEvent.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "false");
  });

  it("sin collapsible la fila abierta no se puede cerrar pulsandola", async () => {
    // Modo asistente por pasos: siempre queda una abierta.
    render(<Faq collapsible={false} />);
    const btn = trigger("Cuanto tarda una transferencia");
    await userEvent.click(btn);
    await userEvent.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "true");
  });

  it("con type=multiple mantiene varias abiertas a la vez", async () => {
    render(<Faq type="multiple" />);
    await userEvent.click(trigger("Cuanto tarda una transferencia"));
    await userEvent.click(trigger("Puedo cancelar un envio"));

    expect(screen.getByText("Entre 1 y 2 dias habiles.")).toBeInTheDocument();
    expect(screen.getByText("Solo mientras siga pendiente.")).toBeInTheDocument();
  });

  it("alterna con Enter y con Espacio", async () => {
    render(<Faq />);
    const btn = trigger("Cuanto tarda una transferencia");
    btn.focus();

    await userEvent.keyboard("{Enter}");
    expect(btn).toHaveAttribute("aria-expanded", "true");

    await userEvent.keyboard(" ");
    expect(btn).toHaveAttribute("aria-expanded", "false");
  });

  it("mueve el foco entre disparadores con las flechas y con Home/End", async () => {
    render(<Faq />);
    const primera = trigger("Cuanto tarda una transferencia");
    const segunda = trigger("Puedo cancelar un envio");
    const tercera = trigger("Hay comisiones");

    primera.focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(segunda).toHaveFocus();

    await userEvent.keyboard("{ArrowUp}");
    expect(primera).toHaveFocus();

    await userEvent.keyboard("{End}");
    expect(tercera).toHaveFocus();

    await userEvent.keyboard("{Home}");
    expect(primera).toHaveFocus();
  });

  it("una fila disabled ni se abre ni entra en la navegacion por flechas", async () => {
    render(<Faq disabledSegunda />);
    const segunda = trigger("Puedo cancelar un envio");
    expect(segunda).toBeDisabled();

    await userEvent.click(segunda);
    expect(screen.queryByText("Solo mientras siga pendiente.")).not.toBeInTheDocument();

    // La flecha salta la fila bloqueada y aterriza en la siguiente viva.
    trigger("Cuanto tarda una transferencia").focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(trigger("Hay comisiones")).toHaveFocus();
  });

  it("enlaza disparador y contenido, y expone el contenido como region", async () => {
    render(<Faq />);
    const btn = trigger("Cuanto tarda una transferencia");
    await userEvent.click(btn);

    const region = screen.getByRole("region", { name: "Cuanto tarda una transferencia" });
    expect(btn).toHaveAttribute("aria-controls", region.id);
    expect(region).toHaveTextContent("Entre 1 y 2 dias habiles.");
  });

  it("envuelve el disparador en un encabezado, con nivel configurable", () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="a">
          <AccordionTrigger>Por defecto</AccordionTrigger>
          <AccordionContent>a</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger headingLevel={4}>Anidado</AccordionTrigger>
          <AccordionContent>b</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    // El lector de pantalla navega los acordeones por la lista de encabezados.
    expect(screen.getByRole("heading", { level: 3, name: "Por defecto" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 4, name: "Anidado" })).toBeInTheDocument();
  });

  it("no altera la capitalizacion de la pregunta", () => {
    // Nada de .toUpperCase() en JS: rompe el nombre accesible y el portapapeles.
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="a">
          <AccordionTrigger>Cuanto tarda una transferencia</AccordionTrigger>
          <AccordionContent>x</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    expect(screen.getByRole("button")).toHaveTextContent("Cuanto tarda una transferencia");
  });

  it("avisa de los cambios de valor en modo controlado", async () => {
    const onValueChange = vi.fn();
    render(
      <Accordion type="multiple" value={["a"]} onValueChange={onValueChange}>
        <AccordionItem value="a">
          <AccordionTrigger>Uno</AccordionTrigger>
          <AccordionContent>contenido uno</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>Dos</AccordionTrigger>
          <AccordionContent>contenido dos</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    expect(screen.getByText("contenido uno")).toBeInTheDocument();
    await userEvent.click(trigger("Dos"));
    expect(onValueChange).toHaveBeenCalledWith(["a", "b"]);
    // Controlado: sin que el padre mueva el valor, la fila no se abre sola.
    expect(screen.queryByText("contenido dos")).not.toBeInTheDocument();
  });

  it("permite sobreescribir estilos por className en las cuatro piezas", async () => {
    render(
      <Accordion type="single" collapsible className="gap-0">
        <AccordionItem value="a" className="rounded-none" data-testid="fila">
          <AccordionTrigger className="p-0">Pregunta</AccordionTrigger>
          <AccordionContent className="px-0">Respuesta</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    const btn = trigger("Pregunta");
    // tailwind-merge debe descartar la clase de la variante, no acumularla.
    expect(btn.className).toContain("p-0");
    expect(btn.className).not.toContain("p-4");

    const item = screen.getByTestId("fila");
    expect(item.className).toContain("rounded-none");
    expect(item.className).not.toContain("rounded-lg");

    await userEvent.click(btn);
    const region = screen.getByRole("region");
    expect(region.className).toContain("px-0");
    expect(region.className).not.toContain("px-4");
  });

  it("hereda la variante de la raiz sin repetirla en cada fila", () => {
    render(
      <Accordion type="single" collapsible variant="flush">
        <AccordionItem value="a" data-testid="fila">
          <AccordionTrigger>Pregunta</AccordionTrigger>
          <AccordionContent>Respuesta</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    // Comprobar la clase concreta seria tautologico; lo que se verifica es que
    // el contexto llega y la fila NO se queda con la piel por defecto.
    expect(screen.getByTestId("fila").className).not.toContain("rounded-lg");
    expect(trigger("Pregunta").className).not.toContain("p-4");
  });
});
