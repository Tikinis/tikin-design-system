import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Badge, Chip } from "./chip";

/* Estos tests cubren COMPORTAMIENTO, no apariencia. Las medidas del documento
 * (pill 999, alturas 20/22/26/28, +5% de tracking) se verifican contra el
 * navegador: jsdom no aplica CSS, asi que comprobar clases seria tautologico. */

describe("Chip", () => {
  it("el chip del archivo es pintura, no un control", () => {
    render(<Chip tone="success">Completado</Chip>);
    // Feedback puntual: no recibe foco ni tiene rol interactivo.
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByText("Completado")).toBeInTheDocument();
  });

  it("no pone el label en mayusculas en JS, solo por CSS", () => {
    // Importa para el texto accesible y para lo que se copia al portapapeles.
    render(<Chip tone="warning">Pendiente de revisión</Chip>);
    expect(screen.getByText("Pendiente de revisión")).toBeInTheDocument();
  });

  it("el chip del archivo ignora icono, punto, contador y quitar", () => {
    const onRemove = vi.fn();
    render(
      <Chip
        tone="info"
        startIcon={<svg data-testid="icono" />}
        dot="success"
        count={4}
        onRemove={onRemove}
      >
        Info
      </Chip>,
    );
    // El documento lo define "sin borde, sin icono". Renderizar los extras
    // dejaria publicar como canonico algo que el archivo no define.
    expect(screen.queryByTestId("icono")).toBeNull();
    expect(screen.queryByText("4")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("action es un boton real: click y teclado", async () => {
    const onClick = vi.fn();
    render(
      <Chip variant="action" onClick={onClick}>
        Agregar etiqueta
      </Chip>,
    );
    const boton = screen.getByRole("button", { name: "Agregar etiqueta" });

    await userEvent.click(boton);
    expect(onClick).toHaveBeenCalledTimes(1);

    boton.focus();
    expect(boton).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it("action por defecto es type=button, no submit", async () => {
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Chip variant="action">Filtrar</Chip>
      </form>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Filtrar" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("filter expone su estado con aria-pressed", async () => {
    const onClick = vi.fn();
    const { rerender } = render(
      <Chip variant="filter" selected={false} onClick={onClick}>
        Movimientos
      </Chip>,
    );
    const boton = screen.getByRole("button", { name: "Movimientos" });
    expect(boton).toHaveAttribute("aria-pressed", "false");

    await userEvent.click(boton);
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(
      <Chip variant="filter" selected onClick={onClick}>
        Movimientos
      </Chip>,
    );
    expect(screen.getByRole("button", { name: "Movimientos" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("action no expone aria-pressed: no es un interruptor", () => {
    render(<Chip variant="action">Agregar</Chip>);
    expect(screen.getByRole("button")).not.toHaveAttribute("aria-pressed");
  });

  it("deshabilitado no dispara onClick", async () => {
    const onClick = vi.fn();
    render(
      <Chip variant="action" disabled onClick={onClick}>
        Agregar
      </Chip>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("el chip removible no es un boton dentro de otro boton", async () => {
    const onRemove = vi.fn();
    const onClick = vi.fn();
    render(
      // Se pide "action" a proposito: aun asi el contenedor debe bajar a span.
      <Chip variant="action" onRemove={onRemove} onClick={onClick}>
        Bolsillo · Arriendo
      </Chip>,
    );
    const botones = screen.getAllByRole("button");
    expect(botones).toHaveLength(1);
    expect(botones[0]).toHaveAccessibleName("Quitar");
    // El unico <button> del arbol no puede tener otro <button> dentro.
    expect(botones[0]?.querySelector("button")).toBeNull();

    await userEvent.click(botones[0]!);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("el boton de quitar se alcanza y se activa con teclado", async () => {
    const onRemove = vi.fn();
    render(
      <Chip variant="value" onRemove={onRemove} removeLabel="Quitar Arriendo">
        Bolsillo · Arriendo
      </Chip>,
    );
    await userEvent.tab();
    const quitar = screen.getByRole("button", { name: "Quitar Arriendo" });
    expect(quitar).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("el boton de quitar hereda disabled del chip", async () => {
    const onRemove = vi.fn();
    render(
      <Chip variant="value" disabled onRemove={onRemove}>
        Arriendo
      </Chip>,
    );
    const quitar = screen.getByRole("button", { name: "Quitar" });
    expect(quitar).toBeDisabled();
    await userEvent.click(quitar);
    expect(onRemove).not.toHaveBeenCalled();
  });

  it("el punto de estado no se anuncia al lector", () => {
    render(
      <Chip variant="filter" dot="success">
        Activo
      </Chip>,
    );
    // Redundante con el label: si se anunciara, el lector diria basura.
    expect(screen.getByRole("button")).toHaveAccessibleName("Activo");
  });

  it("muestra el contador junto al label", () => {
    render(
      <Chip variant="filter" count={4}>
        Bolsillos
      </Chip>,
    );
    expect(screen.getByRole("button")).toHaveTextContent("Bolsillos4");
  });

  it("permite sobreescribir estilos por className", () => {
    render(<Chip className="rounded-none">Info</Chip>);
    // tailwind-merge debe descartar el radio de la base, no acumularlo.
    const cls = screen.getByText("Info").className;
    expect(cls).toContain("rounded-none");
    expect(cls).not.toContain("radius-pill");
  });

  it("reenvia la ref al elemento renderizado", () => {
    const spanRef = React.createRef<HTMLElement>();
    const botonRef = React.createRef<HTMLElement>();
    render(
      <>
        <Chip ref={spanRef}>Info</Chip>
        <Chip ref={botonRef} variant="action">
          Agregar
        </Chip>
      </>,
    );
    expect(spanRef.current?.tagName).toBe("SPAN");
    expect(botonRef.current?.tagName).toBe("BUTTON");
  });
});

describe("Badge", () => {
  it("nunca es clickeable: se renderiza como texto, no como control", () => {
    render(<Badge tone="success">Completado</Badge>);
    expect(screen.queryByRole("button")).toBeNull();
    const badge = screen.getByText("Completado");
    expect(badge.tagName).toBe("SPAN");
  });

  it("no pone el label en mayusculas en JS, solo por CSS", () => {
    render(<Badge tone="error">Rechazado por el banco</Badge>);
    expect(screen.getByText("Rechazado por el banco")).toBeInTheDocument();
  });

  it("la variante dot pinta un punto que no se anuncia", () => {
    render(
      <Badge variant="dot" tone="warning" data-testid="badge">
        Pendiente
      </Badge>,
    );
    const badge = screen.getByTestId("badge");
    expect(badge).toHaveTextContent("Pendiente");
    // El punto es decoracion: mismo dato que el label.
    expect(badge.querySelectorAll('[aria-hidden="true"]')).toHaveLength(1);
  });

  it("las demas variantes no pintan punto", () => {
    render(
      <Badge variant="solid" data-testid="badge">
        Nuevo
      </Badge>,
    );
    expect(screen.getByTestId("badge").querySelectorAll('[aria-hidden="true"]')).toHaveLength(0);
  });

  it("permite sobreescribir estilos por className", () => {
    render(<Badge className="rounded-none">Neutral</Badge>);
    const cls = screen.getByText("Neutral").className;
    expect(cls).toContain("rounded-none");
    expect(cls).not.toContain("radius-pill");
  });

  it("reenvia la ref y acepta atributos de span", () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(
      <Badge ref={ref} id="estado" title="Estado del movimiento">
        Activo
      </Badge>,
    );
    expect(ref.current?.id).toBe("estado");
    expect(ref.current).toHaveAttribute("title", "Estado del movimiento");
  });
});
