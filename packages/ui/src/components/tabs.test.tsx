import * as React from "react";
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

  it("una variante explicita en el riel o en la pestaña gana a la heredada", () => {
    render(
      <Tabs defaultValue="a" variant="segmented">
        <TabsList variant="underline">
          <TabsTrigger value="a" variant="underline">
            A
          </TabsTrigger>
        </TabsList>
        <TabsContent value="a">Panel A</TabsContent>
      </Tabs>,
    );

    // Es la unica salvaguarda para pieles mixtas: si el `variant ?? heredado` se
    // rompiera, riel y pestaña se desparejarian sin avisar.
    expect(screen.getByRole("tablist").className).toContain("border-b");
    expect(screen.getByRole("tablist").className).not.toContain("bg-surface");
    expect(screen.getByRole("tab").className).toContain("border-b-2");
    expect(screen.getByRole("tab").className).not.toContain("px-3");
  });

  it("pinta el startIcon dentro de la pestaña, antes del label", () => {
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a" startIcon={<svg data-testid="icono" aria-hidden="true" />}>
            Recibos
          </TabsTrigger>
        </TabsList>
        <TabsContent value="a">Panel A</TabsContent>
      </Tabs>,
    );

    const tab = screen.getByRole("tab", { name: "Recibos" });
    const icono = screen.getByTestId("icono");
    expect(tab).toContainElement(icono);
    // Antes del label: el icono es el primer hijo del boton.
    expect(tab.firstChild).toBe(icono);
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

    expect(screen.getByRole("radio", { name: "Todos" })).toBeChecked();

    await userEvent.click(screen.getByRole("radio", { name: "Pagados" }));

    expect(onValueChange).toHaveBeenCalledWith("pagados");
    expect(screen.getByRole("radio", { name: "Pagados" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Todos" })).not.toBeChecked();
  });

  it("no es un tablist: sin paneles que intercambiar no expone pestañas", () => {
    render(<Filtro />);
    // Regresion: montarlo sobre Radix Tabs dejaba `role=tab` dentro de un
    // `role=tablist` sin ningun `tabpanel` en el arbol.
    expect(screen.queryAllByRole("tab")).toHaveLength(0);
    expect(screen.queryByRole("tablist")).toBeNull();
    expect(screen.getByRole("radiogroup")).toHaveAccessibleName("Filtrar recibos");
    expect(screen.getAllByRole("radio")).toHaveLength(3);
  });

  it("apunta con aria-controls a la region que filtra cuando se declara", () => {
    render(<Filtro controls="recibos" />);
    // El grupo entero controla la lista; ya no hay un id por opcion que enlazar.
    expect(screen.getByRole("radiogroup")).toHaveAttribute("aria-controls", "recibos");
  });

  it("sin `controls` no deja un aria-controls colgando", () => {
    render(<Filtro />);
    expect(screen.getByRole("radiogroup")).not.toHaveAttribute("aria-controls");
    for (const opcion of screen.getAllByRole("radio")) {
      expect(opcion).not.toHaveAttribute("aria-controls");
    }
  });

  it("un aria-controls explicito gana sobre el que deriva de `controls`", () => {
    render(
      <SegmentedControl defaultValue="a" controls="recibos" aria-controls="otra-cosa">
        <SegmentedControlItem value="a">A</SegmentedControlItem>
      </SegmentedControl>,
    );
    expect(screen.getByRole("radiogroup")).toHaveAttribute("aria-controls", "otra-cosa");
  });

  it("se recorre con las flechas, da la vuelta y solo gasta una parada de tabulador", async () => {
    render(<Filtro />);

    screen.getByRole("radio", { name: "Todos" }).focus();
    await userEvent.keyboard("{ArrowRight}{ArrowRight}");
    expect(screen.getByRole("radio", { name: "Pagados" })).toHaveFocus();

    // Vuelve al principio al pasar del ultimo.
    await userEvent.keyboard("{ArrowRight}");
    const todos = screen.getByRole("radio", { name: "Todos" });
    expect(todos).toHaveFocus();

    // Roving focus: solo una opcion esta en el orden de tabulacion.
    expect(todos).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("radio", { name: "Pagados" })).toHaveAttribute("tabindex", "-1");
  });

  it("la flecha selecciona, no solo mueve el foco", async () => {
    render(<Filtro />);
    screen.getByRole("radio", { name: "Todos" }).focus();

    /* Con la tecla MANTENIDA (`{Tecla>}`): Radix mueve el foco en un timeout y
     * solo marca si la flecha sigue pulsada. Un keydown+keyup instantaneo como
     * el que emite userEvent por defecto no existe en un teclado real, pero en
     * jsdom llega antes que ese timeout y se perderia la seleccion. */
    await userEvent.keyboard("{ArrowRight>}");
    const pendientes = screen.getByRole("radio", { name: "Pendientes" });
    expect(pendientes).toHaveFocus();
    expect(pendientes).toBeChecked();
    await userEvent.keyboard("{/ArrowRight}");
  });

  it("salta las opciones deshabilitadas con las flechas", async () => {
    render(
      <SegmentedControl defaultValue="uno" aria-label="Filtro">
        <SegmentedControlItem value="uno">Uno</SegmentedControlItem>
        <SegmentedControlItem value="dos" disabled>
          Dos
        </SegmentedControlItem>
        <SegmentedControlItem value="tres">Tres</SegmentedControlItem>
      </SegmentedControl>,
    );

    await userEvent.click(screen.getByRole("radio", { name: "Dos" }));
    expect(screen.getByRole("radio", { name: "Uno" })).toBeChecked();

    screen.getByRole("radio", { name: "Uno" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "Tres" })).toHaveFocus();
  });

  it("lleva className y ref al riel, que es la propia raiz", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <SegmentedControl defaultValue="todos" aria-label="Filtro" className="w-full" ref={ref}>
        <SegmentedControlItem value="todos">Todos</SegmentedControlItem>
        <SegmentedControlItem value="pagados">Pagados</SegmentedControlItem>
      </SegmentedControl>,
    );

    const riel = screen.getByRole("radiogroup");
    expect(ref.current).toBe(riel);
    // El riel ya no vive dentro de un envoltorio con `w-fit` que anule esto.
    expect(riel.className).toContain("w-full");
    expect(riel.className).not.toContain("w-fit");
    expect(riel.parentElement?.className).not.toContain("w-fit");
  });

  it("acepta icono de 16 antes del label sin tocar el nombre accesible", () => {
    render(
      <SegmentedControl defaultValue="todos" aria-label="Filtro">
        <SegmentedControlItem
          value="todos"
          startIcon={<svg data-testid="icono" aria-hidden="true" />}
        >
          Todos
        </SegmentedControlItem>
      </SegmentedControl>,
    );

    const opcion = screen.getByRole("radio", { name: "Todos" });
    expect(opcion).toContainElement(screen.getByTestId("icono"));
  });

  it("expone el contador de la activa al lector de pantalla", () => {
    render(
      <SegmentedControl defaultValue="todos" aria-label="Filtro">
        <SegmentedControlItem value="todos">
          Todos <span className="font-num">12</span>
        </SegmentedControlItem>
      </SegmentedControl>,
    );
    // El numero es dato. Con el `aria-hidden="true"` que traian la story y este
    // test, el 12 desaparecia por completo del nombre accesible.
    expect(screen.getByRole("radio", { name: "Todos 12" })).toBeInTheDocument();
  });

  it("permite dar unidad al contador sin perder el texto visible en el nombre", () => {
    render(
      <SegmentedControl defaultValue="todos" aria-label="Filtro">
        <SegmentedControlItem value="todos" aria-label="Todos 12 recibos">
          Todos <span className="font-num">12</span>
        </SegmentedControlItem>
      </SegmentedControl>,
    );
    /* El aria-label contiene literalmente el texto visible ("Todos 12"), que es
     * lo que exige "label in name" para el control por voz. */
    const opcion = screen.getByRole("radio", { name: "Todos 12 recibos" });
    expect(opcion).toHaveTextContent("Todos 12");
  });
});
