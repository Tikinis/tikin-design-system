import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Banner, BannerAction } from "./banner";

/* Estos tests cubren COMPORTAMIENTO, no apariencia. Los valores visuales
 * (padding 14/18, icono 18, pill r8) se verifican contra el navegador, no aqui:
 * jsdom no aplica CSS, asi que comprobar clases seria tautologico.
 *
 * La excepcion es el test de className, que no mira el resultado visual sino
 * que cn()/tailwind-merge resuelva el conflicto en vez de acumular clases. */

describe("Banner", () => {
  it("anuncia como region viva, no como texto suelto", () => {
    render(<Banner>Tu tarjeta física ya está disponible.</Banner>);
    // role="status" anuncia sin interrumpir: el banner suele estar ya presente
    // al cargar la pantalla.
    expect(screen.getByRole("status")).toHaveTextContent("Tu tarjeta física ya está disponible.");
  });

  it("solo el tono critico interrumpe al lector de pantalla", () => {
    const { rerender } = render(<Banner tone="system">Mantenimiento programado.</Banner>);
    expect(screen.getByRole("status")).toBeInTheDocument();

    rerender(<Banner tone="critical">Verifica tu identidad.</Banner>);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("deja sobreescribir el rol", () => {
    // Un critico que ya estaba en la pagina antes de que llegue el usuario no
    // deberia interrumpir nada.
    render(
      <Banner tone="critical" role="status">
        Verifica tu identidad.
      </Banner>,
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("pinta la X y avisa al pulsarla", async () => {
    const onDismiss = vi.fn();
    render(<Banner onDismiss={onDismiss}>Invita a un amigo.</Banner>);

    await userEvent.click(screen.getByRole("button", { name: "Descartar" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("no se oculta solo al descartarlo: eso lo decide quien lo usa", async () => {
    const onDismiss = vi.fn();
    render(<Banner onDismiss={onDismiss}>Invita a un amigo.</Banner>);

    await userEvent.click(screen.getByRole("button", { name: "Descartar" }));
    // Sigue en el DOM. El documento demuestra el caso con MOSTRAR DE NUEVO, que
    // seria imposible si el componente se desmontara solo.
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("el tono critico NO se puede descartar aunque se pase onDismiss", () => {
    const onDismiss = vi.fn();
    render(
      <Banner tone="critical" onDismiss={onDismiss}>
        Verifica tu identidad para seguir enviando dinero.
      </Banner>,
    );
    // Regla "CRITICO SE FIJA": un aviso bloqueante que se puede cerrar deja de
    // ser bloqueante, asi que la X ni siquiera se pinta.
    expect(screen.queryByRole("button", { name: "Descartar" })).not.toBeInTheDocument();
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it("la X es un boton real: se llega con Tab y se activa con Enter y Espacio", async () => {
    const onDismiss = vi.fn();
    render(<Banner onDismiss={onDismiss}>Invita a un amigo.</Banner>);
    const cerrar = screen.getByRole("button", { name: "Descartar" });

    await userEvent.tab();
    expect(cerrar).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    // El documento dibuja aqui un <i> suelto en los bloques estaticos: con eso
    // ninguna de las dos teclas haria nada.
    expect(onDismiss).toHaveBeenCalledTimes(2);
  });

  it("permite renombrar el boton de cerrar", () => {
    render(
      <Banner onDismiss={() => {}} dismissLabel="Ocultar promoción">
        Invita a un amigo.
      </Banner>,
    );
    expect(screen.getByRole("button", { name: "Ocultar promoción" })).toBeInTheDocument();
  });

  it("el orden de tabulacion va accion primero y cerrar despues", async () => {
    render(
      <Banner action={<BannerAction>Pedir</BannerAction>} onDismiss={() => {}}>
        Tu tarjeta física ya está disponible.
      </Banner>,
    );

    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Pedir" })).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Descartar" })).toHaveFocus();
  });

  it("en loading marca aria-busy, y no lo pone cuando no lo esta", () => {
    const { rerender } = render(
      <Banner tone="neutral" loading>
        Sincronizando tus movimientos…
      </Banner>,
    );
    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");

    rerender(<Banner tone="neutral">Sincronizando tus movimientos…</Banner>);
    // Sin el estado, el atributo no debe quedarse en "false" colgando.
    expect(screen.getByRole("status")).not.toHaveAttribute("aria-busy");
  });

  it("muestra las dos lineas del formato doble", () => {
    render(
      <Banner tone="system" description="Regulariza antes del 30 de julio para evitar bloqueos.">
        Tu cuenta tiene un pago pendiente.
      </Banner>,
    );
    const region = screen.getByRole("status");
    expect(region).toHaveTextContent("Tu cuenta tiene un pago pendiente.");
    expect(region).toHaveTextContent("Regulariza antes del 30 de julio para evitar bloqueos.");
  });

  it("el icono es decorativo y no contamina el nombre accesible", () => {
    const { container } = render(<Banner>Invita a un amigo.</Banner>);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("con hideIcon no dibuja ningun glifo", () => {
    const { container } = render(<Banner hideIcon>Invita a un amigo.</Banner>);
    expect(container.querySelector("svg")).toBeNull();
  });

  it("permite sobreescribir estilos por className", () => {
    render(
      <Banner rounded className="rounded-none">
        X
      </Banner>,
    );
    // tailwind-merge debe descartar el rounded-lg de la variante, no acumularlo.
    const cls = screen.getByRole("status").className;
    expect(cls).toContain("rounded-none");
    expect(cls).not.toContain("rounded-lg");
  });

  it("expone la ref al elemento del DOM", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Banner ref={ref}>Invita a un amigo.</Banner>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe("BannerAction", () => {
  it("por defecto es type=button, no submit", async () => {
    // Un <button> sin type dentro de un <form> envia el formulario.
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Banner action={<BannerAction>Pedir</BannerAction>}>Tu tarjeta física ya está aquí.</Banner>
      </form>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Pedir" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("no pone el label en mayusculas en JS, solo por CSS", () => {
    // Importa para el texto que anuncia el lector de pantalla y para lo que el
    // usuario copia al portapapeles.
    render(<BannerAction>Pedir tarjeta</BannerAction>);
    expect(screen.getByRole("button")).toHaveTextContent("Pedir tarjeta");
  });

  it("dispara onClick y respeta disabled", async () => {
    const onClick = vi.fn();
    const { rerender } = render(<BannerAction onClick={onClick}>Pedir</BannerAction>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(
      <BannerAction disabled onClick={onClick}>
        Pedir
      </BannerAction>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("permite sobreescribir estilos por className", () => {
    render(<BannerAction className="rounded-none">Pedir</BannerAction>);
    const cls = screen.getByRole("button").className;
    expect(cls).toContain("rounded-none");
    expect(cls).not.toContain("rounded-sm");
  });
});
