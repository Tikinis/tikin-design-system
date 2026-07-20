import * as React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
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
    expect(sk).toHaveAttribute("aria-live", "polite");
    // Con aria-hidden puesto, el role="status" no lo veria nadie.
    expect(sk).not.toHaveAttribute("aria-hidden");
  });

  it("la region viva lleva el texto DENTRO: es lo que el lector anuncia", () => {
    // Una live region se anuncia por su CONTENIDO al insertarse, no por su
    // aria-label. Sin texto dentro, role="status" es una region vacia: silencio.
    render(<Skeleton label="Cargando movimientos" data-testid="sk" />);
    const sk = screen.getByRole("status");

    expect(sk).toHaveTextContent("Cargando movimientos");
    // Y ese texto no puede ocupar sitio en la maqueta que se esta calcando.
    expect(sk.querySelector("span")).toHaveClass("sr-only");
  });

  it("NO pone aria-busy en la propia region viva", () => {
    // aria-busy="true" sobre la live region le dice a la AT que retenga las
    // actualizaciones hasta que vuelva a false, y aqui nunca vuelve: el
    // skeleton se desmonta. El anuncio no llegaria a emitirse.
    render(<Skeleton label="Cargando" data-testid="sk" />);
    expect(screen.getByRole("status")).not.toHaveAttribute("aria-busy");
  });

  it("el consumidor sigue pudiendo poner su propio aria-busy", () => {
    // El aria-busy correcto es el del contenedor que se rellena, y decidirlo
    // es del consumidor: el componente no debe impedirlo.
    render(<Skeleton data-testid="sk" label="Cargando" aria-busy={true} />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
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

  it("en circulo la copia va en los dos sentidos: solo alto tambien da circulo", () => {
    // Sin esto el ancho se quedaba en el size-10 de la clase (40px) frente a un
    // alto de 64: un ovalo, justo lo que la copia existe para evitar.
    render(<Skeleton data-testid="sk" shape="circle" height={64} />);
    expect(screen.getByTestId("sk")).toHaveStyle({ width: "64px", height: "64px" });
  });

  it("en circulo NO copia un alto en porcentaje", () => {
    render(<Skeleton data-testid="sk" shape="circle" height="45%" />);
    expect(screen.getByTestId("sk").style.width).toBe("");
  });

  it("con los dos ejes dados no inventa nada: el ovalo explicito se respeta", () => {
    render(<Skeleton data-testid="sk" shape="circle" width={80} height={40} />);
    expect(screen.getByTestId("sk")).toHaveStyle({ width: "80px", height: "40px" });
  });

  it("fuera de circulo no copia ningun eje", () => {
    // En linea y bloque el otro eje lo fija la clase o el flujo del padre.
    render(<Skeleton data-testid="sk" shape="block" width={200} />);
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

  /* Las variantes son visuales, pero dos cosas de ellas SI son comprobables sin
     navegador: que cada forma trae su geometria por defecto (si no, el skeleton
     deja de calcar la maqueta) y que los @keyframes solo se inyectan cuando hay
     barrido que animar. */
  it("cada forma trae la geometria por defecto del prototipo", () => {
    render(
      <>
        <Skeleton data-testid="line" />
        <Skeleton data-testid="circle" shape="circle" />
        <Skeleton data-testid="block" shape="block" />
      </>,
    );

    // Linea: 10px es el alto que mas se repite en el prototipo, radio 6.
    expect(screen.getByTestId("line")).toHaveClass("h-2.5", "w-full", "rounded-xs");
    // Circulo: el de las filas de lista, 40 y radio 50%.
    expect(screen.getByTestId("circle")).toHaveClass("size-10", "rounded-full");
    // Bloque: la tarjeta del documento, 56 y radio 10.
    expect(screen.getByTestId("block")).toHaveClass("h-14", "w-full", "rounded-md");
  });

  it("el barrido es el default y trae animacion y gradiente", () => {
    render(<Skeleton data-testid="sk" />);
    const cls = screen.getByTestId("sk").className;

    expect(cls).toContain("animate-[tk-skeleton-shimmer_1.4s_ease-in-out_infinite]");
    expect(cls).toContain("bg-size-[200%_100%]");
    // Sin esto, quien pida reduccion de movimiento se come el barrido.
    expect(cls).toContain("motion-reduce:animate-none");
  });

  it("solo el barrido inyecta los @keyframes; pulse y none no", () => {
    /* Se mira el marcado en crudo y no el <head> del documento porque React
       hoista el <style> y lo deduplica por href para todo el documento: una vez
       lo mete un skeleton anterior, ya no vuelve a insertarse y el <head> deja
       de distinguir quien lo pidio. */
    expect(renderToStaticMarkup(<Skeleton />)).toContain("@keyframes tk-skeleton-shimmer");
    // Sin gradiente que desplazar, la regla es peso muerto.
    expect(renderToStaticMarkup(<Skeleton animation="pulse" />)).not.toContain("@keyframes");
    expect(renderToStaticMarkup(<Skeleton animation="none" />)).not.toContain("@keyframes");
  });

  it("pulse anima sin gradiente y none no anima", () => {
    render(
      <>
        <Skeleton animation="pulse" data-testid="pulse" />
        <Skeleton animation="none" data-testid="none" />
      </>,
    );

    expect(screen.getByTestId("pulse")).toHaveClass("animate-pulse", "motion-reduce:animate-none");
    const none = screen.getByTestId("none").className;
    expect(none).not.toContain("animate-");
    expect(none).not.toContain("linear-gradient");
  });

  it("el consumidor puede forzar sus propios atributos ARIA", () => {
    // Caso real: un grupo entero envuelto en un contenedor que ya declara
    // role="status", donde cada bloque debe callarse aunque lleve label.
    render(<Skeleton data-testid="sk" label="Cargando" aria-hidden={true} role={undefined} />);
    expect(screen.getByTestId("sk")).toHaveAttribute("aria-hidden", "true");
  });
});
