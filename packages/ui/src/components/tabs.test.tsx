import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  SegmentedControl,
  SegmentedControlItem,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./tabs";

/* Tests de COMPORTAMIENTO. Las medidas del archivo (riel 40 r12, activa r10,
 * mono 14) se verifican contra el navegador: jsdom no aplica CSS, asi que
 * comprobar clases aqui seria tautologico. */

function Basicas(props: { activationMode?: "automatic" | "manual" }) {
  return (
    <Tabs defaultValue="dia" variant="underline" {...props}>
      <TabsList aria-label="Periodo">
        <TabsTrigger value="dia">Día</TabsTrigger>
        <TabsTrigger value="semana">Semana</TabsTrigger>
        <TabsTrigger value="mes">Mes</TabsTrigger>
      </TabsList>
      <TabsContent value="dia">Panel día</TabsContent>
      <TabsContent value="semana">Panel semana</TabsContent>
      <TabsContent value="mes">Panel mes</TabsContent>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("muestra solo el panel de la pestaña activa y lo cambia al hacer click", async () => {
    render(<Basicas />);

    expect(screen.getByRole("tabpanel")).toHaveTextContent("Panel día");
    expect(screen.getByRole("tab", { name: "Día" })).toHaveAttribute("aria-selected", "true");

    await userEvent.click(screen.getByRole("tab", { name: "Mes" }));

    expect(screen.getByRole("tabpanel")).toHaveTextContent("Panel mes");
    expect(screen.getByRole("tab", { name: "Día" })).toHaveAttribute("aria-selected", "false");
  });

  it("enlaza cada pestaña con su panel para el lector de pantalla", () => {
    render(<Basicas />);
    const tab = screen.getByRole("tab", { name: "Día" });
    const panel = screen.getByRole("tabpanel");

    expect(tab).toHaveAttribute("aria-controls", panel.id);
    expect(panel).toHaveAttribute("aria-labelledby", tab.id);
  });

  it("navega con las flechas y da la vuelta al llegar al final", async () => {
    render(<Basicas />);
    const dia = screen.getByRole("tab", { name: "Día" });
    const semana = screen.getByRole("tab", { name: "Semana" });
    const mes = screen.getByRole("tab", { name: "Mes" });

    dia.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(semana).toHaveFocus();
    // Modo automatico: mover el foco ya selecciona.
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Panel semana");

    await userEvent.keyboard("{ArrowRight}{ArrowRight}");
    expect(dia).toHaveFocus();

    await userEvent.keyboard("{ArrowLeft}");
    expect(mes).toHaveFocus();
  });

  it("con activationMode manual la flecha solo mueve el foco; activa Enter", async () => {
    render(<Basicas activationMode="manual" />);
    const dia = screen.getByRole("tab", { name: "Día" });
    const semana = screen.getByRole("tab", { name: "Semana" });

    dia.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(semana).toHaveFocus();
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Panel día");

    await userEvent.keyboard("{Enter}");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Panel semana");
  });

  it("el riel solo expone una parada de tabulador, no una por pestaña", async () => {
    render(<Basicas />);
    const semana = screen.getByRole("tab", { name: "Semana" });
    const mes = screen.getByRole("tab", { name: "Mes" });

    await userEvent.click(semana);
    // Roving focus: la seleccionada queda enfocable y el resto sale del orden.
    expect(semana).toHaveAttribute("tabindex", "0");
    expect(mes).toHaveAttribute("tabindex", "-1");

    // Y desde el riel el tabulador salta al panel, no a la siguiente pestaña.
    await userEvent.tab();
    expect(screen.getByRole("tabpanel")).toHaveFocus();
  });

  it("una pestaña deshabilitada no se selecciona ni recibe el foco de las flechas", async () => {
    render(
      <Tabs defaultValue="uno">
        <TabsList>
          <TabsTrigger value="uno">Uno</TabsTrigger>
          <TabsTrigger value="dos" disabled>
            Dos
          </TabsTrigger>
          <TabsTrigger value="tres">Tres</TabsTrigger>
        </TabsList>
        <TabsContent value="uno">Panel uno</TabsContent>
        <TabsContent value="dos">Panel dos</TabsContent>
        <TabsContent value="tres">Panel tres</TabsContent>
      </Tabs>,
    );

    await userEvent.click(screen.getByRole("tab", { name: "Dos" }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Panel uno");

    screen.getByRole("tab", { name: "Uno" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Tres" })).toHaveFocus();
  });

  it("no pone el label en mayusculas en JS, solo por CSS", () => {
    // Importa para el nombre accesible y para lo que se copia al portapapeles.
    render(<Basicas />);
    expect(screen.getByRole("tab", { name: "Semana" })).toHaveTextContent("Semana");
  });

  it("hereda la variante de la raiz y permite sobreescribir por className", () => {
    render(
      <Tabs defaultValue="a" variant="soft">
        <TabsList className="rounded-none">
          <TabsTrigger value="a">A</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Panel A</TabsContent>
      </Tabs>,
    );

    const list = screen.getByRole("tablist");
    // tailwind-merge descarta el rounded-lg del riel en vez de acumularlo.
    expect(list.className).toContain("rounded-none");
    expect(list.className).not.toContain("rounded-lg");
    // La variante soft llega al trigger sin repetirla en cada pestaña.
    expect(screen.getByRole("tab").className).toContain("py-[9px]");
  });

  it("funciona en modo controlado", async () => {
    const onValueChange = vi.fn();
    render(
      <Tabs value="dia" onValueChange={onValueChange}>
        <TabsList>
          <TabsTrigger value="dia">Día</TabsTrigger>
          <TabsTrigger value="mes">Mes</TabsTrigger>
        </TabsList>
        <TabsContent value="dia">Panel día</TabsContent>
        <TabsContent value="mes">Panel mes</TabsContent>
      </Tabs>,
    );

    await userEvent.click(screen.getByRole("tab", { name: "Mes" }));
    expect(onValueChange).toHaveBeenCalledWith("mes");
    // El padre no movio el valor, asi que el panel no cambia.
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Panel día");
  });
});

describe("SegmentedControl", () => {
  function Filtro(props: { controls?: string; onValueChange?: (v: string) => void }) {
    return (
      <>
        <SegmentedControl defaultValue="todos" aria-label="Filtrar recibos" {...props}>
          <SegmentedControlItem value="todos">Todos</SegmentedControlItem>
          <SegmentedControlItem value="pendientes">Pendientes</SegmentedControlItem>
          <SegmentedControlItem value="pagados">Pagados</SegmentedControlItem>
        </SegmentedControl>
        <ul id="recibos">
          <li>Recibo</li>
        </ul>
      </>
    );
  }

  it("selecciona por click y avisa del cambio", async () => {
    const onValueChange = vi.fn();
    render(<Filtro onValueChange={onValueChange} />);

    expect(screen.getByRole("tab", { name: "Todos" })).toHaveAttribute("aria-selected", "true");

    await userEvent.click(screen.getByRole("tab", { name: "Pagados" }));

    expect(onValueChange).toHaveBeenCalledWith("pagados");
    expect(screen.getByRole("tab", { name: "Pagados" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Todos" })).toHaveAttribute("aria-selected", "false");
  });

  it("sin panel no deja un aria-controls colgando", () => {
    render(<Filtro />);
    // Radix apunta por defecto al id del panel; sin panel ese id no existe y
    // una referencia rota es peor que la ausencia del atributo.
    for (const tab of screen.getAllByRole("tab")) {
      expect(tab).not.toHaveAttribute("aria-controls");
    }
  });

  it("apunta con aria-controls a la region que filtra cuando se declara", () => {
    render(<Filtro controls="recibos" />);
    for (const tab of screen.getAllByRole("tab")) {
      expect(tab).toHaveAttribute("aria-controls", "recibos");
    }
  });

  it("se recorre con las flechas y expone el nombre accesible del riel", async () => {
    render(<Filtro />);
    expect(screen.getByRole("tablist")).toHaveAccessibleName("Filtrar recibos");

    screen.getByRole("tab", { name: "Todos" }).focus();
    await userEvent.keyboard("{ArrowRight}");

    const pendientes = screen.getByRole("tab", { name: "Pendientes" });
    expect(pendientes).toHaveFocus();
    expect(pendientes).toHaveAttribute("aria-selected", "true");
  });

  it("deja el contador dentro de la opcion sin romper su nombre accesible", () => {
    render(
      <SegmentedControl defaultValue="todos">
        <SegmentedControlItem value="todos">
          Todos <span aria-hidden="true">12</span>
        </SegmentedControlItem>
      </SegmentedControl>,
    );
    expect(screen.getByRole("tab", { name: "Todos" })).toBeInTheDocument();
  });
});
