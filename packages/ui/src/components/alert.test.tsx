import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Alert, AlertAction } from "./alert";

/* Estos tests cubren COMPORTAMIENTO, no apariencia. Las medidas del prototipo
 * (padding 14/16, radio 12, titulo 14.5px) se verifican contra el navegador, no
 * aqui: jsdom no aplica CSS, asi que comprobar clases seria tautologico.
 *
 * Con UNA excepcion deliberada, el bloque "tono → color": ahi la clase no es
 * decorado sino el mapeo mismo. Cuatro pares tint/fg y cuatro glifos escritos a
 * mano se pueden desparejar (success apuntando al amarillo de warning, el
 * triangulo saliendo en error) sin que ningun test de comportamiento se entere.
 * Es lo unico que ata esas ocho constantes. */

describe("Alert", () => {
  it("expone titulo y cuerpo dentro de una region viva", () => {
    render(<Alert title="Verificación en proceso">Tu cuenta estará lista en pocos minutos.</Alert>);
    const region = screen.getByRole("status");
    expect(region).toHaveTextContent("Verificación en proceso");
    expect(region).toHaveTextContent("Tu cuenta estará lista en pocos minutos.");
  });

  it("usa role=alert solo en los tonos que exigen actuar", () => {
    // Asertivo interrumpe al lector de pantalla: se reserva a error y warning.
    const { rerender } = render(<Alert tone="error">Saldo insuficiente</Alert>);
    expect(screen.getByRole("alert")).toBeInTheDocument();

    rerender(<Alert tone="warning">Verifica tu identidad</Alert>);
    expect(screen.getByRole("alert")).toBeInTheDocument();

    rerender(<Alert tone="success">Envío completado</Alert>);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();

    rerender(<Alert tone="info">Verificación en proceso</Alert>);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("deja sobreescribir el rol", () => {
    // Un error que ya estaba en la pagina antes de llegar el usuario no deberia
    // interrumpir nada.
    render(
      <Alert tone="error" role="status">
        Saldo insuficiente
      </Alert>,
    );
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("no pinta boton de cerrar si no es descartable", () => {
    render(<Alert title="Aviso">Cuerpo</Alert>);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("descarta con raton y avisa una sola vez", async () => {
    const onDismiss = vi.fn();
    render(
      <Alert title="Aviso" onDismiss={onDismiss}>
        Cuerpo
      </Alert>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Descartar" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("la X es alcanzable con Tab y se activa con Enter y con Espacio", async () => {
    const onDismiss = vi.fn();
    render(
      <Alert title="Aviso" onDismiss={onDismiss}>
        Cuerpo
      </Alert>,
    );
    const cerrar = screen.getByRole("button", { name: "Descartar" });

    await userEvent.tab();
    expect(cerrar).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    // Es un <button> nativo: las dos teclas funcionan sin manejadores propios.
    expect(onDismiss).toHaveBeenCalledTimes(2);
  });

  it("permite renombrar el boton de cerrar", () => {
    render(<Alert onDismiss={() => {}} dismissLabel="Cerrar aviso" />);
    expect(screen.getByRole("button", { name: "Cerrar aviso" })).toBeInTheDocument();
  });

  it("el alert NO se oculta solo al descartarlo", async () => {
    // La visibilidad la decide quien lo usa: el documento demuestra el caso con
    // un boton RESTAURAR que los devuelve.
    const onDismiss = vi.fn();
    render(
      <Alert title="Sigue aquí" onDismiss={onDismiss}>
        Cuerpo
      </Alert>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Descartar" }));
    expect(screen.getByText("Sigue aquí")).toBeInTheDocument();
  });

  it("renderiza la accion y la deja pulsable junto a la X", async () => {
    const onAction = vi.fn();
    const onDismiss = vi.fn();
    render(
      <Alert
        tone="warning"
        title="Verifica tu identidad"
        action={<AlertAction onClick={onAction}>Verificar</AlertAction>}
        onDismiss={onDismiss}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Verificar" }));
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it("omite el titulo y el cuerpo cuando no se pasan", () => {
    render(<Alert title="Solo título" />);
    const region = screen.getByRole("status");
    expect(region).toHaveTextContent("Solo título");
    // Sin children no debe quedar un span vacio ocupando el gap de 2px.
    expect(region.querySelectorAll("span")).toHaveLength(1);
  });

  it("oculta el icono al lector de pantalla y lo puede sustituir", () => {
    const { container, rerender } = render(<Alert tone="success">Hecho</Alert>);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");

    rerender(
      <Alert tone="success" icon={<span data-testid="propio">!</span>}>
        Hecho
      </Alert>,
    );
    expect(screen.getByTestId("propio")).toBeInTheDocument();
    expect(container.querySelector("svg")).toBeNull();
  });

  it("con hideIcon no dibuja ningun glifo", () => {
    const { container } = render(<Alert hideIcon>Hecho</Alert>);
    expect(container.querySelector("svg")).toBeNull();
  });

  it("permite sobreescribir estilos por className", () => {
    render(<Alert className="rounded-none">Cuerpo</Alert>);
    // tailwind-merge debe descartar el rounded-lg del contenedor, no acumularlo.
    const cls = screen.getByRole("status").className;
    expect(cls).toContain("rounded-none");
    expect(cls).not.toContain("rounded-lg");
  });

  it("reenvia la ref al contenedor", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Alert ref={ref}>Cuerpo</Alert>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("reenvia al div las props que no consume", () => {
    render(
      <Alert id="aviso-kyc" data-testid="raiz" aria-describedby="pie">
        Cuerpo
      </Alert>,
    );
    const region = screen.getByTestId("raiz");
    expect(region).toHaveAttribute("id", "aviso-kyc");
    expect(region).toHaveAttribute("aria-describedby", "pie");
  });
});

describe("Alert · tono → color", () => {
  // Cada tono declara el mismo hue en las tres piezas: fondo, variable de
  // recorte del glifo y variable de tinta del icono. Desparejarlas pinta un
  // alert verde con icono amarillo sin que falle nada mas.
  const PARES = [
    ["info", "info"],
    ["success", "success"],
    ["warning", "warning"],
    ["error", "error"],
  ] as const;

  it.each(PARES)("tone=%s pinta el hue %s en las tres piezas", (tone, hue) => {
    const { container } = render(<Alert tone={tone}>Cuerpo</Alert>);
    const cls = container.firstElementChild!.className;
    expect(cls).toContain(`bg-tint-${hue}`);
    expect(cls).toContain(`[--tk-alert-bg:var(--tk-tint-${hue})]`);
    expect(cls).toContain(`[--tk-alert-fg:var(--tk-fg-${hue})]`);
  });

  it("el tono por defecto es info", () => {
    const { container } = render(<Alert>Cuerpo</Alert>);
    const cls = container.firstElementChild!.className;
    expect(cls).toContain("bg-tint-info");
    expect(cls).toContain("[--tk-alert-fg:var(--tk-fg-info)]");
  });

  it("el glifo toma su tinta de la variable del tono, no de la del texto", () => {
    const { container } = render(<Alert tone="error">Cuerpo</Alert>);
    expect(container.querySelector("svg")!.getAttribute("class")).toContain(
      "text-[var(--tk-alert-fg)]",
    );
  });

  it("cada tono dibuja SU glifo y no el del vecino", () => {
    // Los cuatro salen de una tabla escrita a mano: si se intercambian dos
    // entradas, el alert de error muestra el triangulo de warning.
    const glifo = (tone: "info" | "success" | "warning" | "error") => {
      const { container } = render(<Alert tone={tone}>Cuerpo</Alert>);
      const svg = container.querySelector("svg")!;
      return {
        redondo: svg.querySelector('circle[r="9"]') !== null,
        paths: Array.from(svg.querySelectorAll("path")).map((p) => p.getAttribute("d") ?? ""),
      };
    };

    const info = glifo("info");
    expect(info.redondo).toBe(true);
    // Punto de la i arriba y palo debajo.
    expect(info.paths.join(" ")).toContain("M10 9.1v5.2");

    const success = glifo("success");
    expect(success.redondo).toBe(true);
    expect(success.paths.join(" ")).toContain("m5.9 10.2 2.7 2.7 5.5-5.5");

    const warning = glifo("warning");
    // El unico que NO es un circulo: es el triangulo.
    expect(warning.redondo).toBe(false);
    expect(warning.paths[0]).toContain("M8.63 2.6");

    const error = glifo("error");
    expect(error.redondo).toBe(true);
    // Aspa: dos trazos cruzados dentro del circulo.
    expect(error.paths.join(" ")).toContain("m7.2 7.2 5.6 5.6M12.8 7.2l-5.6 5.6");
  });

  it("deja repintar el fondo y la variable de recorte a la vez", () => {
    // Si solo se cambiara el fondo, la marca interior del glifo se quedaria del
    // color viejo. La escapatoria documentada es cambiar las dos.
    render(<Alert className="bg-surface [--tk-alert-bg:var(--tk-surface)]">Cuerpo</Alert>);
    const cls = screen.getByRole("status").className;
    expect(cls).toContain("bg-surface");
    expect(cls).not.toContain("bg-tint-info");
    expect(cls).toContain("[--tk-alert-bg:var(--tk-surface)]");
    expect(cls).not.toContain("[--tk-alert-bg:var(--tk-tint-info)]");
  });
});

describe("Alert · icono propio", () => {
  it("no lo anuncia dentro de la region viva", () => {
    // El alert es una live region: un icono con nombre accesible se anunciaria
    // ademas del titulo y el cuerpo.
    render(
      <Alert tone="error" title="Saldo insuficiente" icon={<svg role="img" aria-label="Error" />}>
        Recarga e inténtalo de nuevo.
      </Alert>,
    );
    // queryByRole ignora los subarboles aria-hidden, que es exactamente lo que
    // hace tambien el arbol de accesibilidad del navegador.
    expect(screen.queryByRole("img", { name: "Error" })).not.toBeInTheDocument();
  });

  it("no se encoge y hereda el color pleno del hue", () => {
    // Suelto en una fila flex se comprimia por debajo de 20px con cuerpos
    // largos, y heredaba la tinta del contenedor en vez de la del tono.
    render(
      <Alert tone="warning" icon={<span data-testid="propio">!</span>}>
        Cuerpo
      </Alert>,
    );
    const hueco = screen.getByTestId("propio").parentElement!;
    expect(hueco).toHaveAttribute("aria-hidden", "true");
    expect(hueco.className).toContain("shrink-0");
    expect(hueco.className).toContain("text-[var(--tk-alert-fg)]");
  });
});

describe("AlertAction", () => {
  it("por defecto es type=button, no submit", async () => {
    // Un alert de validacion vive dentro de un formulario: sin type explicito
    // su accion enviaria el formulario entero.
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Alert tone="error" action={<AlertAction>Reintentar</AlertAction>}>
          Falló el envío
        </Alert>
      </form>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("no pone el label en mayusculas en JS, solo por CSS", () => {
    // Importa para el texto accesible y para lo que se copia al portapapeles.
    render(<AlertAction>Verificar documento</AlertAction>);
    expect(screen.getByRole("button")).toHaveAccessibleName("Verificar documento");
  });

  it("respeta disabled", async () => {
    const onClick = vi.fn();
    render(
      <AlertAction disabled onClick={onClick}>
        Verificar
      </AlertAction>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("permite sobreescribir estilos por className", () => {
    render(<AlertAction className="h-10">Verificar</AlertAction>);
    const cls = screen.getByRole("button").className;
    expect(cls).toContain("h-10");
    expect(cls).not.toContain("h-9");
  });

  it("reenvia la ref al boton", () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<AlertAction ref={ref}>Verificar</AlertAction>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("con asChild renderiza un enlace de verdad, no un boton", async () => {
    // La accion canonica de la seccion navega a la verificacion de identidad:
    // tiene que ser <a href> para conservar click derecho, abrir en pestaña
    // nueva y que el lector anuncie "enlace".
    const onClick = vi.fn((e: React.MouseEvent) => e.preventDefault());
    render(
      <AlertAction asChild>
        <a href="/verificacion" onClick={onClick}>
          Verificar
        </a>
      </AlertAction>,
    );

    const enlace = screen.getByRole("link", { name: "Verificar" });
    expect(enlace).toHaveAttribute("href", "/verificacion");
    // `type` es de <button>: en un <a> significa el MIME del destino, asi que
    // no debe colarse.
    expect(enlace).not.toHaveAttribute("type");
    expect(enlace.className).toContain("h-9");

    await userEvent.click(enlace);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("con asChild no le cuelga disabled al enlace", () => {
    // <a disabled> no existe en HTML: quedaria un atributo invalido que no
    // deshabilita nada y ensucia el DOM.
    const { container } = render(
      <AlertAction asChild disabled>
        <a href="/verificacion">Verificar</a>
      </AlertAction>,
    );
    // El enlace es la raiz: no queda ningun <button> envolviendolo.
    expect(container.firstElementChild!.tagName).toBe("A");
    expect(screen.getByRole("link")).not.toHaveAttribute("disabled");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
