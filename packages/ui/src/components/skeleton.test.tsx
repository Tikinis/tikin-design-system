import * as React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Skeleton } from "./skeleton";

/* Estos tests cubren COMPORTAMIENTO, no apariencia. Los valores visuales
 * (el barrido de 1.4s, el gradiente entre surface-3 y surface-2, el radio 6)
 * se verifican contra el navegador, no aqui: jsdom no aplica CSS, asi que
 * comprobar clases seria tautologico.
 *
 * Lo que si es comprobable en jsdom, y es donde estan los fallos reales de un
 * skeleton: que no se cuele en el arbol de accesibilidad, que no se lleve el
 * foco, y que las medidas que calca la maqueta lleguen al DOM. */

describe("Skeleton", () => {
  it("por defecto es decorativo: queda fuera del arbol de accesibilidad", () => {
    render(<Skeleton data-testid="sk" />);
    const sk = screen.getByTestId("sk");

    // Un lector de pantalla no debe describir cajas grises.
    expect(sk).toHaveAttribute("aria-hidden", "true");
    expect(sk).not.toHaveAttribute("role");
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("con label anuncia la carga como region viva y deja de estar oculto", () => {
    render(<Skeleton label="Cargando movimientos" data-testid="sk" />);
    const sk = screen.getByRole("status");

    expect(sk).toHaveAccessibleName("Cargando movimientos");
    expect(sk).toHaveAttribute("aria-busy", "true");
    // Con aria-hidden puesto, el role="status" no lo veria nadie.
    expect(sk).not.toHaveAttribute("aria-hidden");
  });

  it("un label vacio o en blanco NO crea una region anonima", () => {
    // Seria un role="status" sin nombre accesible: ruido puro.
    render(<Skeleton label="   " data-testid="sk" />);
    expect(screen.queryByRole("status")).toBeNull();
    expect(screen.getByTestId("sk")).toHaveAttribute("aria-hidden", "true");
  });

  it("no entra en el orden de tabulacion", async () => {
    render(
      <>
        <button type="button">antes</button>
        <Skeleton data-testid="sk" />
        <button type="button">despues</button>
      </>,
    );

    screen.getByRole("button", { name: "antes" }).focus();
    await userEvent.tab();
    // Si el skeleton fuese focusable, el usuario de teclado se quedaria
    // atrapado en un hueco vacio mientras cargan los datos.
    expect(screen.getByRole("button", { name: "despues" })).toHaveFocus();
  });

  it("sigue siendo saltable por teclado cuando anuncia la carga", async () => {
    render(
      <>
        <button type="button">antes</button>
        <Skeleton label="Cargando" data-testid="sk" />
        <button type="button">despues</button>
      </>,
    );

    screen.getByRole("button", { name: "antes" }).focus();
    await userEvent.tab();
    // role="status" no debe convertirlo en parada de tabulacion.
    expect(screen.getByRole("button", { name: "despues" })).toHaveFocus();
  });

  it("emite las medidas de la maqueta: numero a px, cadena tal cual", () => {
    render(
      <>
        <Skeleton data-testid="px" width={120} height={12} />
        <Skeleton data-testid="pct" width="45%" height="1.5rem" />
      </>,
    );

    expect(screen.getByTestId("px")).toHaveStyle({ width: "120px", height: "12px" });
    // El documento expresa casi todos los anchos en porcentaje.
    expect(screen.getByTestId("pct")).toHaveStyle({ width: "45%", height: "1.5rem" });
  });

  it("en circulo copia el ancho numerico al alto para que no salga un ovalo", () => {
    render(<Skeleton data-testid="sk" shape="circle" width={64} />);
    expect(screen.getByTestId("sk")).toHaveStyle({ width: "64px", height: "64px" });
  });

  it("en circulo NO copia un ancho en porcentaje", () => {
    // Un "45%" copiado al alto se mediria contra la altura del padre, que casi
    // siempre es auto: daria 0 y el circulo desapareceria.
    render(<Skeleton data-testid="sk" shape="circle" width="45%" />);
    expect(screen.getByTestId("sk").style.height).toBe("");
  });

  it("el style del consumidor pisa las medidas de las props", () => {
    render(<Skeleton data-testid="sk" width={100} style={{ width: "50%" }} />);
    expect(screen.getByTestId("sk")).toHaveStyle({ width: "50%" });
  });

  it("permite sobreescribir estilos por className", () => {
    render(<Skeleton data-testid="sk" className="rounded-none" />);
    // tailwind-merge debe descartar el rounded-xs de la forma, no acumularlo.
    const cls = screen.getByTestId("sk").className;
    expect(cls).toContain("rounded-none");
    expect(cls).not.toContain("rounded-xs");
  });

  it("no renderiza texto que un lector pudiera leer", () => {
    render(<Skeleton data-testid="sk" width="90%" />);
    // El <style> de los keyframes lo hoista React a <head>; dentro del bloque
    // no puede quedar contenido visible ni legible.
    expect(screen.getByTestId("sk").textContent).toBe("");
  });

  it("expone la referencia al nodo del DOM", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Skeleton data-testid="sk" ref={ref} />);
    expect(ref.current).toBe(screen.getByTestId("sk"));
  });

  it("el consumidor puede forzar sus propios atributos ARIA", () => {
    // Caso real: un grupo entero envuelto en un contenedor que ya declara
    // role="status", donde cada bloque debe callarse aunque lleve label.
    render(<Skeleton data-testid="sk" label="Cargando" aria-hidden={true} role={undefined} />);
    expect(screen.getByTestId("sk")).toHaveAttribute("aria-hidden", "true");
  });
});
