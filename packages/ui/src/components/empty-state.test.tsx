import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import userEvent from "@testing-library/user-event";
import { EmptyState, EmptyStateAction } from "./empty-state";

/* Estos tests cubren COMPORTAMIENTO, no apariencia. Las medidas del prototipo
 * (tile 56, radio 16, mensaje 13.5/1.5) se verifican contra el navegador, no
 * aqui: jsdom no aplica CSS, asi que comprobar cuanto miden seria tautologico.
 *
 * La excepcion son los MAPAS DE VARIANTES (tono, bordered) y las clases que son
 * contrato explicito (uppercase). Ahi la clase es un dato, no un estilo: un
 * `bg-tint-eror` compila a nada, no rompe tsc ni ningun otro test, y deja el
 * tono sin color. Por eso el tono si se comprueba por clase. */

describe("EmptyState", () => {
  it("renderiza el titulo como encabezado real, nivel 3 por defecto", () => {
    render(<EmptyState title="Aún no hay movimientos">Cuando envíes dinero.</EmptyState>);
    // Un <div> con pinta de titulo no sale en la lista de encabezados del
    // lector de pantalla y deja el vacio inalcanzable por navegacion rapida.
    expect(screen.getByRole("heading", { level: 3, name: "Aún no hay movimientos" })).toBeVisible();
  });

  it("permite ajustar el nivel del encabezado al esquema de la pagina", () => {
    render(<EmptyState title="Sin resultados" headingLevel={2} />);
    expect(screen.getByRole("heading", { level: 2, name: "Sin resultados" })).toBeVisible();
  });

  it("oculta el icono a la accesibilidad: es decorativo", () => {
    render(
      <EmptyState
        title="Sin conexión"
        tone="error"
        icon={<svg data-testid="glifo" viewBox="0 0 24 24" />}
      />,
    );
    // El icono no aporta informacion que el titulo no diga ya; anunciarlo solo
    // duplicaria el mensaje.
    expect(screen.getByTestId("glifo").closest("[aria-hidden='true']")).not.toBeNull();
  });

  it("no renderiza el tile cuando no hay icono", () => {
    const { container } = render(<EmptyState title="Todo al día" />);
    expect(container.querySelector("[aria-hidden='true']")).toBeNull();
  });

  it("omite mensaje y accion cuando no se pasan", () => {
    // "Todo al dia" del documento no lleva accion: no hay siguiente paso que
    // ofrecer y un boton vacio seria peor que ninguno.
    render(<EmptyState title="Todo al día" />);
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByRole("heading")).toBeVisible();
  });

  it("sin announce no es una region viva", () => {
    // Un vacio de primera vez ya viene en el render inicial; anunciarlo seria
    // ruido gratuito.
    const { container } = render(<EmptyState title="Crea tu primer bolsillo" />);
    expect(container.firstElementChild).not.toHaveAttribute("role");
    expect(container.firstElementChild).not.toHaveAttribute("aria-live");
  });

  it("con announce se anuncia como status polite", async () => {
    render(<EmptyState announce title="Sin resultados" />);
    const region = await screen.findByRole("status");
    expect(region).toHaveAttribute("aria-live", "polite");
    expect(region).toHaveTextContent("Sin resultados");
  });

  it("con announce la region viva se monta VACIA y el texto entra despues", () => {
    // El anuncio depende de esto: NVDA y JAWS solo vigilan regiones que ya
    // existian en el DOM. Si el primer commit ya trae el texto dentro, no hay
    // cambio que observar y el lector no dice nada.
    // El render del servidor es el primer commit sin efectos, asi que sirve de
    // radiografia exacta de lo que se inserta.
    const html = renderToStaticMarkup(
      <EmptyState announce title="Sin resultados">
        Prueba con otro nombre.
      </EmptyState>,
    );
    expect(html).toContain('role="status"');
    expect(html).not.toContain("Sin resultados");
    expect(html).not.toContain("Prueba con otro nombre.");
  });

  it("sin announce el contenido sale ya pintado en el primer commit", () => {
    // Diferir siempre penalizaria el SSR de un vacio de primera vez, que no
    // necesita anunciarse.
    const html = renderToStaticMarkup(<EmptyState title="Crea tu primer bolsillo" />);
    expect(html).toContain("Crea tu primer bolsillo");
  });

  it("un role explicito gana sobre announce", () => {
    render(
      <EmptyState announce role="alert" title="Sin conexión">
        Revisa tu internet.
      </EmptyState>,
    );
    const region = screen.getByRole("alert");
    // Si el consumidor elige el rol, no le colamos ademas un aria-live que
    // pelee con el.
    expect(region).not.toHaveAttribute("aria-live");
  });

  it("no pinta encabezado ni parrafo vacios", () => {
    // `title={cond && "..."}` es el patron habitual y cuando cond es false
    // colaba un <h3> sin texto: axe lo reporta como violacion de WCAG 2.4.6, y
    // el <p> vacio se comia ademas 12px del gap del contenedor.
    const { container } = render(<EmptyState title="">{false}</EmptyState>);
    expect(screen.queryByRole("heading")).toBeNull();
    expect(container.querySelector("p")).toBeNull();
  });

  it("aplica el color del tile segun el tono", () => {
    // El tono es la unica variante real del componente: un error tipografico en
    // una de estas clases compila a nada y deja el tile sin color sin romper
    // ningun otro test.
    const casos = [
      ["neutral", "bg-surface-2", "text-ink"],
      ["muted", "bg-surface-2", "text-ink-600"],
      ["brand", "bg-lavender", "text-on-accent"],
      ["success", "bg-tint-success", "text-fg-success"],
      ["error", "bg-tint-error", "text-fg-error"],
    ] as const;

    for (const [tone, fondo, tinta] of casos) {
      const { container, unmount } = render(
        <EmptyState tone={tone} title="X" icon={<svg viewBox="0 0 24 24" />} />,
      );
      const tile = container.querySelector("[aria-hidden='true']");
      expect(tile, tone).not.toBeNull();
      expect(tile?.className, tone).toContain(fondo);
      expect(tile?.className, tone).toContain(tinta);
      unmount();
    }
  });

  it("bordered=false quita el borde de la tarjeta", () => {
    // Un vacio embebido en una tabla o una tarjeta ya vive dentro de un borde;
    // el doble marco se ve como un fallo.
    const { container } = render(<EmptyState bordered={false} title="X" />);
    expect(container.firstElementChild?.className).not.toContain("border-edge");
  });

  it("permite sobreescribir estilos por className", () => {
    const { container } = render(<EmptyState className="rounded-none" title="X" />);
    // tailwind-merge debe descartar el rounded-xl del contenedor, no acumularlo.
    const cls = container.firstElementChild?.className ?? "";
    expect(cls).toContain("rounded-none");
    expect(cls).not.toContain("rounded-xl");
  });

  it("expone la ref del contenedor", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<EmptyState ref={ref} title="X" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe("EmptyStateAction", () => {
  it("por defecto es type=button, no submit", async () => {
    // El vacio de "sin resultados" vive justo debajo de un buscador: un boton
    // sin type enviaria ese formulario al pulsarlo.
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <EmptyState
          title="Sin resultados"
          action={<EmptyStateAction variant="quiet">Limpiar búsqueda</EmptyStateAction>}
        />
      </form>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Limpiar búsqueda" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("es alcanzable con Tab y se activa con Enter y con Espacio", async () => {
    const onClick = vi.fn();
    render(
      <EmptyState
        title="Sin conexión"
        action={
          <EmptyStateAction variant="secondary" onClick={onClick}>
            Reintentar
          </EmptyStateAction>
        }
      />,
    );

    await userEvent.tab();
    const boton = screen.getByRole("button", { name: "Reintentar" });
    expect(boton).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);

    await userEvent.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("no pone el label en mayusculas en JS, solo por CSS", () => {
    render(<EmptyStateAction>Enviar dinero</EmptyStateAction>);
    const boton = screen.getByRole("button");
    // El texto real conserva su capitalizacion: es lo que anuncia el lector de
    // pantalla y lo que se copia al portapapeles.
    expect(boton).toHaveAccessibleName("Enviar dinero");
    expect(boton.textContent).toBe("Enviar dinero");
    // Y las mayusculas si llegan, pero por CSS. Sin esta mitad el test pasaria
    // igual con un boton que nunca las aplica.
    expect(boton.className).toContain("uppercase");
  });

  it("las tres variantes definen pressed y disabled legible", () => {
    // La seccion 05 pide default/hover/pressed/disabled a todo boton del
    // sistema. Sin pressed no hay respuesta tactil al pulsar, y el disabled
    // anterior (bg-edge sobre ink-400) daba ~1.5:1: label ilegible.
    const casos = [
      ["primary", "active:not-disabled:bg-ink-strong", "disabled:text-ink-600"],
      ["secondary", "active:not-disabled:bg-ink", "disabled:text-ink-400"],
      ["quiet", "active:not-disabled:bg-surface-3", "disabled:text-ink-400"],
    ] as const;

    for (const [variant, pressed, disabled] of casos) {
      const { unmount } = render(<EmptyStateAction variant={variant}>X</EmptyStateAction>);
      const cls = screen.getByRole("button").className;
      expect(cls, variant).toContain(pressed);
      expect(cls, variant).toContain(disabled);
      // El disabled del primary ya no pinta el label sobre el borde.
      expect(cls, variant).not.toContain("disabled:bg-edge");
      unmount();
    }
  });

  it("respeta disabled", async () => {
    const onClick = vi.fn();
    render(
      <EmptyStateAction disabled onClick={onClick}>
        Crear bolsillo
      </EmptyStateAction>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renderiza el icono inicial dentro del boton sin robarle el nombre", () => {
    render(
      <EmptyStateAction startIcon={<svg data-testid="mas" viewBox="0 0 24 24" />}>
        Crear bolsillo
      </EmptyStateAction>,
    );
    expect(screen.getByRole("button")).toHaveAccessibleName("Crear bolsillo");
    expect(screen.getByTestId("mas")).toBeInTheDocument();
  });

  it("permite sobreescribir estilos por className", () => {
    render(<EmptyStateAction className="rounded-none">X</EmptyStateAction>);
    const cls = screen.getByRole("button").className;
    expect(cls).toContain("rounded-none");
    expect(cls).not.toContain("rounded-lg");
  });

  it("expone la ref del boton", () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<EmptyStateAction ref={ref}>X</EmptyStateAction>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
