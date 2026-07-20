import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Card, CardFeature, CardMedia, CardStat } from "./card";

/* Estos tests cubren COMPORTAMIENTO, no apariencia. Las medidas (r20, padding
 * 24, cifra 38, scrim al 78%) se verifican contra el navegador: jsdom no aplica
 * CSS, asi que comprobar clases seria tautologico. */

describe("Card", () => {
  it("por defecto es un contenedor mudo: sin rol ni foco", () => {
    render(<Card data-testid="card">Contenido</Card>);
    const card = screen.getByTestId("card");
    expect(card).not.toHaveAttribute("role");
    expect(card).not.toHaveAttribute("tabindex");
  });

  it("interactive expone rol de boton y entra en el orden de tabulacion", async () => {
    const onClick = vi.fn();
    render(
      <Card interactive onClick={onClick}>
        Mi bolsillo
      </Card>,
    );
    const card = screen.getByRole("button", { name: "Mi bolsillo" });
    expect(card).toHaveAttribute("tabindex", "0");

    await userEvent.tab();
    expect(card).toHaveFocus();

    await userEvent.click(card);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("interactive se activa con Enter y con Espacio", () => {
    const onClick = vi.fn();
    render(
      <Card interactive onClick={onClick}>
        Mi bolsillo
      </Card>,
    );
    const card = screen.getByRole("button");

    fireEvent.keyDown(card, { key: "Enter" });
    expect(onClick).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(card, { key: " " });
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("corta el scroll de pagina al pulsar Espacio", () => {
    render(<Card interactive>Mi bolsillo</Card>);
    // fireEvent devuelve false cuando el handler llamo a preventDefault.
    const noCancelado = fireEvent.keyDown(screen.getByRole("button"), { key: " " });
    expect(noCancelado).toBe(false);
  });

  it("no se apropia del teclado de sus hijos interactivos", () => {
    const onCardClick = vi.fn();
    render(
      <Card interactive onClick={onCardClick}>
        <span>Mi bolsillo</span>
        <button type="button">Ver detalle</button>
      </Card>,
    );
    // El keydown burbujea hasta la tarjeta, pero nacio en el boton: es suyo.
    fireEvent.keyDown(screen.getByRole("button", { name: "Ver detalle" }), { key: "Enter" });
    expect(onCardClick).not.toHaveBeenCalled();
  });

  it("con asChild delega la semantica al elemento del consumidor", () => {
    render(
      <Card asChild interactive>
        <a href="/bolsillos">Bolsillos</a>
      </Card>,
    );
    const link = screen.getByRole("link", { name: "Bolsillos" });
    expect(link).toHaveAttribute("href", "/bolsillos");
    // Un <a> ya es enfocable y ya tiene rol: añadirle role="button" y
    // tabindex seria mentirle al lector de pantalla.
    expect(link).not.toHaveAttribute("role");
    expect(link).not.toHaveAttribute("tabindex");
  });

  it("respeta el role y el tabIndex que ponga el consumidor", () => {
    render(
      <Card interactive role="link" tabIndex={-1} data-testid="card">
        Ir
      </Card>,
    );
    const card = screen.getByTestId("card");
    expect(card).toHaveAttribute("role", "link");
    expect(card).toHaveAttribute("tabindex", "-1");
  });

  it("conserva el onKeyDown del consumidor", () => {
    const onKeyDown = vi.fn();
    render(
      <Card interactive onKeyDown={onKeyDown}>
        Mi bolsillo
      </Card>,
    );
    fireEvent.keyDown(screen.getByRole("button"), { key: "ArrowDown" });
    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  it("permite sobreescribir estilos por className", () => {
    render(
      <Card className="rounded-none" data-testid="card">
        X
      </Card>,
    );
    // tailwind-merge debe descartar el rounded-2xl del radio, no acumularlo.
    const cls = screen.getByTestId("card").className;
    expect(cls).toContain("rounded-none");
    expect(cls).not.toContain("rounded-2xl");
  });
});

describe("CardFeature", () => {
  it("publica el titulo como encabezado y permite fijar su nivel", () => {
    const { rerender } = render(<CardFeature title="Bolsillos" description="Aparta plata." />);
    expect(screen.getByRole("heading", { level: 3, name: "Bolsillos" })).toBeInTheDocument();
    expect(screen.getByText("Aparta plata.")).toBeInTheDocument();

    // El nivel correcto depende de donde caiga la tarjeta en la pagina.
    rerender(<CardFeature titleAs="h2" title="Bolsillos" />);
    expect(screen.getByRole("heading", { level: 2, name: "Bolsillos" })).toBeInTheDocument();
  });

  it("funciona sin icono y sin descripcion", () => {
    render(<CardFeature title="Solo titulo" data-testid="card" />);
    expect(screen.getByTestId("card")).toHaveTextContent("Solo titulo");
  });

  it("acepta contenido extra bajo la descripcion", () => {
    render(
      <CardFeature title="Bolsillos">
        <button type="button">Crear bolsillo</button>
      </CardFeature>,
    );
    expect(screen.getByRole("button", { name: "Crear bolsillo" })).toBeInTheDocument();
  });
});

describe("CardMedia", () => {
  it("expone la accion de la esquina como boton con nombre accesible", async () => {
    const onActionClick = vi.fn();
    render(
      <CardMedia
        title="Tu tarjeta física"
        eyebrow="Tarjeta · Tikin"
        action={<svg />}
        actionLabel="Abrir detalle de la tarjeta"
        onActionClick={onActionClick}
      />,
    );
    const boton = screen.getByRole("button", { name: "Abrir detalle de la tarjeta" });
    await userEvent.click(boton);
    expect(onActionClick).toHaveBeenCalledTimes(1);
  });

  it("no pone el eyebrow en mayusculas en JS, solo por CSS", () => {
    // Importa para el texto accesible y para lo que se copia al portapapeles.
    render(<CardMedia title="Tu tarjeta" eyebrow="Tarjeta · Tikin" />);
    expect(screen.getByText("Tarjeta · Tikin")).toBeInTheDocument();
  });

  it("oculta el scrim al lector de pantalla y deja pasar la imagen del consumidor", () => {
    render(
      <CardMedia
        data-testid="card"
        title="Tu tarjeta"
        image={<img src="/tarjeta.png" alt="Tarjeta física Tikin" />}
      />,
    );
    const card = screen.getByTestId("card");
    expect(within(card).getByRole("img", { name: "Tarjeta física Tikin" })).toBeInTheDocument();
    expect(card.querySelectorAll("[aria-hidden='true']")).toHaveLength(1);
  });

  it("sin accion no renderiza ningun boton", () => {
    render(<CardMedia title="Tu tarjeta" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  /* Excepcion deliberada a "los tests cubren comportamiento, no apariencia":
   * aqui la clase ES el contrato. La media card mezclaba dos regimenes de
   * color — un fondo que se invertia con el tema (surface="ink") bajo un
   * overlay congelado en blanco fijo — y en tema oscuro el fondo subia a casi
   * blanco mientras el texto seguia blanco. Sin un contexto congelado propio,
   * cualquier blanco fijo vuelve a abrir el mismo agujero. */
  it("no mezcla regimenes de color: congela su tema y no pinta blancos fijos", () => {
    render(
      <CardMedia
        data-testid="card"
        eyebrow="Tarjeta · Tikin"
        title="Tu tarjeta física"
        description="Pídela sin costo."
        action={<svg />}
        actionLabel="Ver detalle"
      />,
    );
    const card = screen.getByTestId("card");

    // La tarjeta es una isla de tema congelado: su fondo hace de fotografia y
    // una fotografia no se invierte con el tema de la pagina.
    expect(card.className).toContain("tk-static");

    // Y dentro de esa isla el color vuelve a ser semantico: ni un solo
    // `*-white`, que es lo que congelaba el overlay al margen del fondo.
    const conBlancoFijo = [card, ...card.querySelectorAll("*")]
      // getAttribute y no .className: en SVG className es un SVGAnimatedString.
      .map((el) => el.getAttribute("class") ?? "")
      .filter((cls) => /(?:^|[\s:])(?:text|bg|border|ring|from|via|to)-white(?:\/|$|\s)/.test(cls));
    expect(conBlancoFijo).toEqual([]);
  });
});

describe("CardStat", () => {
  it("renderiza label, cifra, delta, comparacion y sparkline", () => {
    render(
      <CardStat
        data-testid="card"
        label="Ahorro del mes"
        value="$ 480.000"
        delta="12.4%"
        trend="up"
        comparison="vs $ 427.000 el mes pasado"
        chart={<svg data-testid="spark" />}
      />,
    );
    const card = screen.getByTestId("card");
    expect(card).toHaveTextContent("$ 480.000");
    expect(card).toHaveTextContent("12.4%");
    expect(card).toHaveTextContent("vs $ 427.000 el mes pasado");
    expect(screen.getByTestId("spark")).toBeInTheDocument();
  });

  it("no pone el label en mayusculas en JS, solo por CSS", () => {
    render(<CardStat label="Ahorro del mes" value="$ 480.000" />);
    expect(screen.getByText("Ahorro del mes")).toBeInTheDocument();
  });

  it("sin delta no pinta la pildora de tendencia", () => {
    render(<CardStat data-testid="card" label="Saldo" value="$ 10" trend="down" />);
    expect(screen.getByTestId("card")).toHaveTextContent("$ 10");
    expect(screen.getByTestId("card").textContent).not.toContain("%");
  });

  it("hereda el comportamiento tocable del contenedor base", async () => {
    const onClick = vi.fn();
    render(<CardStat interactive onClick={onClick} label="Ahorro" value="$ 480.000" />);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe("CardMedia · anillo de foco", () => {
  /* `tk-static` congela el tema dentro de la tarjeta para que el par
     bg-ink/text-surface signifique siempre "fondo oscuro, tinta clara". El
     efecto colateral es que tambien congelaba los tokens del anillo de foco de
     `interactive`, que son del tema de la PAGINA: sobre una pagina oscura el
     anillo salia casi negro y el hueco hueso hacia de anillo. */

  it("dibuja el anillo hacia dentro, sin depender del tema de la pagina", () => {
    render(<CardMedia interactive title="Bolsillo" data-testid="media" />);
    const clases = screen.getByTestId("media").className;

    expect(clases).toContain("focus-visible:ring-inset");
    expect(clases).toContain("focus-visible:ring-surface");
    // Sin hueco no hay banda del color de la pagina entre tarjeta y anillo.
    expect(clases).toContain("focus-visible:ring-offset-0");
  });

  it("tailwind-merge descarta el color y el hueco dependientes de la pagina", () => {
    render(<CardMedia interactive title="Bolsillo" data-testid="media" />);
    const clases = screen.getByTestId("media").className;

    // Estas dos son las que invertian el indicador al congelarse.
    expect(clases).not.toContain("focus-visible:ring-ink");
    expect(clases).not.toContain("focus-visible:ring-offset-2");

    /* `focus-visible:ring-offset-page` SI sobrevive, y es correcto que lo haga:
       tailwind-merge trata anchura y color del hueco como grupos distintos, asi
       que `ring-offset-0` no desplaza a `ring-offset-page`. Es inocuo porque
       con anchura 0 no hay banda que pintar. Se afirma aqui para que quede
       claro que es sabido y no un descuido. */
    expect(clases).toContain("focus-visible:ring-offset-0");
  });
});
