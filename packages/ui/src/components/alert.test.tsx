import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Alert, AlertAction } from "./alert";

/* Estos tests cubren COMPORTAMIENTO, no apariencia. Las medidas del prototipo
 * (padding 14/16, radio 12, titulo 14.5px) se verifican contra el navegador, no
 * aqui: jsdom no aplica CSS, asi que comprobar clases seria tautologico. */

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
});
