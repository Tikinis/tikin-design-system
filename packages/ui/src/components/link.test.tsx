import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IconButton, Link } from "./link";

/* Estos tests cubren COMPORTAMIENTO, no apariencia. Los valores visuales
 * (44x44, glifo 20, subrayado 2px en pressed) se verifican contra el navegador,
 * no aqui: jsdom no aplica CSS, asi que comprobar clases seria tautologico. */

describe("Link", () => {
  it("expone role link y navega cuando esta habilitado", async () => {
    const onClick = vi.fn((e: React.MouseEvent) => e.preventDefault());
    render(
      <Link href="/movimientos" onClick={onClick}>
        Ver todos
      </Link>,
    );
    const enlace = screen.getByRole("link", { name: "Ver todos" });
    expect(enlace).toHaveAttribute("href", "/movimientos");
    await userEvent.click(enlace);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("deshabilitado deja de ser un link y no dispara onClick", async () => {
    const onClick = vi.fn();
    render(
      <Link href="/movimientos" disabled onClick={onClick}>
        Ver todos
      </Link>,
    );
    // Sin href el elemento sale del arbol de accesibilidad como link, igual que
    // haria un control nativo deshabilitado.
    expect(screen.queryByRole("link")).toBeNull();
    const enlace = screen.getByText("Ver todos");
    expect(enlace.closest("a")).toHaveAttribute("aria-disabled", "true");
    expect(enlace.closest("a")).not.toHaveAttribute("href");

    await userEvent.click(enlace);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("deshabilitado sale del orden de tabulacion", async () => {
    render(
      <>
        <button type="button">antes</button>
        <Link href="/a" disabled>
          Deshabilitado
        </Link>
        <button type="button">despues</button>
      </>,
    );
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "antes" })).toHaveFocus();
    // El siguiente Tab debe saltarse el link y aterrizar en el boton de detras.
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "despues" })).toHaveFocus();
  });

  it("habilitado si es alcanzable con Tab", async () => {
    render(
      <>
        <button type="button">antes</button>
        <Link href="/a">Centro de ayuda</Link>
      </>,
    );
    await userEvent.tab();
    await userEvent.tab();
    expect(screen.getByRole("link", { name: "Centro de ayuda" })).toHaveFocus();
  });

  it("no pone el label en mayusculas en JS, solo por CSS", () => {
    // Importa para el texto accesible y para lo que se copia al portapapeles.
    render(
      <Link variant="action" href="/a">
        Ver todos los movimientos
      </Link>,
    );
    expect(screen.getByRole("link")).toHaveTextContent("Ver todos los movimientos");
  });

  it("la flecha del tipo externo es decorativa y no ensucia el nombre accesible", () => {
    render(
      <Link variant="external" href="https://ayuda.tikin.co">
        Centro de ayuda
      </Link>,
    );
    const enlace = screen.getByRole("link", { name: "Centro de ayuda" });
    expect(enlace.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("permite sustituir la flecha por el glifo del consumidor", () => {
    render(
      <Link variant="external" href="/a" icon={<span data-testid="glifo" aria-hidden="true" />}>
        Centro de ayuda
      </Link>,
    );
    expect(screen.getByTestId("glifo")).toBeInTheDocument();
    expect(screen.getByRole("link").querySelector("svg")).toBeNull();
  });

  it("con target=_blank añade rel de seguridad y avisa de la pestaña nueva", () => {
    render(
      <Link href="https://ayuda.tikin.co" target="_blank">
        Centro de ayuda
      </Link>,
    );
    const enlace = screen.getByRole("link", { name: /Centro de ayuda/ });
    expect(enlace).toHaveAttribute("rel", "noopener noreferrer");
    // El aviso tiene que llegar al lector de pantalla como texto, no solo como
    // icono.
    expect(enlace).toHaveAccessibleName(/^Centro de ayuda\s*\(abre en una pestaña nueva\)$/);
  });

  it("no repite los tokens de rel que ya trae el consumidor", () => {
    render(
      <Link href="https://x.test" target="_blank" rel="noopener nofollow">
        X
      </Link>,
    );
    expect(screen.getByRole("link")).toHaveAttribute("rel", "noopener nofollow noreferrer");
  });

  it("sin target=_blank no toca el rel", () => {
    render(
      <Link href="/a" rel="nofollow">
        A
      </Link>,
    );
    expect(screen.getByRole("link")).toHaveAttribute("rel", "nofollow");
  });

  it("con asChild renderiza el elemento del consumidor y sigue envolviendo el label", () => {
    render(
      <Link asChild variant="external">
        <a href="/ayuda" data-testid="propio">
          Centro de ayuda
        </a>
      </Link>,
    );
    const enlace = screen.getByTestId("propio");
    expect(enlace).toHaveAttribute("href", "/ayuda");
    expect(enlace.className).toContain("font-mono");
    // El subrayado tiene que caer sobre el label, no sobre la raiz: si cayese
    // sobre la raiz la flecha quedaria subrayada tambien.
    const label = enlace.querySelector("span");
    expect(label).toHaveTextContent("Centro de ayuda");
    expect(label?.className).toContain("underline");
    // La flecha sigue siendo hermana del label dentro del elemento propio.
    expect(enlace.querySelector("svg")).not.toBeNull();
  });

  it("permite sobreescribir estilos por className", () => {
    render(
      <Link href="/a" className="text-red">
        A
      </Link>,
    );
    const cls = screen.getByRole("link").className;
    expect(cls).toContain("text-red");
    // tailwind-merge debe descartar el text-ink del estado por defecto.
    expect(cls).not.toContain("text-ink ");
  });
});

describe("IconButton", () => {
  it("el label es el nombre accesible del boton", () => {
    render(
      <IconButton label="Escanear QR">
        <svg />
      </IconButton>,
    );
    expect(screen.getByRole("button", { name: "Escanear QR" })).toBeInTheDocument();
  });

  it("no pone el label accesible en mayusculas", () => {
    // Un lector de pantalla deletrearia las siglas. Las MAYUSCULAS son
    // convencion del label VISIBLE, y aqui no hay label visible.
    render(
      <IconButton label="Filtrar">
        <svg />
      </IconButton>,
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Filtrar");
    expect(screen.getByRole("button")).toHaveAttribute("title", "Filtrar");
  });

  it("respeta un title propio sin perder el nombre accesible", () => {
    render(
      <IconButton label="Filtrar" title="3 filtros activos">
        <svg />
      </IconButton>,
    );
    const boton = screen.getByRole("button", { name: "Filtrar" });
    expect(boton).toHaveAttribute("title", "3 filtros activos");
  });

  it("por defecto es type=button, no submit", async () => {
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <IconButton label="Buscar">
          <svg />
        </IconButton>
      </form>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Buscar" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("se activa con teclado (Enter y Espacio)", async () => {
    const onClick = vi.fn();
    render(
      <IconButton label="Compartir" onClick={onClick}>
        <svg />
      </IconButton>,
    );
    await userEvent.tab();
    expect(screen.getByRole("button")).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("deshabilitado no dispara onClick", async () => {
    const onClick = vi.fn();
    render(
      <IconButton label="Eliminar" variant="destructive" disabled onClick={onClick}>
        <svg />
      </IconButton>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("el badge es decorativo y no aporta nada al nombre accesible", () => {
    render(
      <IconButton label="Filtrar" badge>
        <svg />
      </IconButton>,
    );
    const boton = screen.getByRole("button", { name: "Filtrar" });
    expect(boton.querySelector("[aria-hidden='true']")).not.toBeNull();
    expect(boton).toHaveAccessibleName("Filtrar");
  });

  it("con asChild renderiza el hijo conservando label y estilos", () => {
    render(
      <IconButton asChild label="Volver">
        <a href="/atras">
          <svg />
        </a>
      </IconButton>,
    );
    const enlace = screen.getByRole("link", { name: "Volver" });
    expect(enlace).toHaveAttribute("href", "/atras");
    expect(enlace.className).toContain("inline-flex");
    // Con asChild no inyectamos type: en un <a> no significa lo mismo.
    expect(enlace).not.toHaveAttribute("type");
  });

  it("permite sobreescribir estilos por className", () => {
    render(
      <IconButton label="X" className="rounded-none">
        <svg />
      </IconButton>,
    );
    const cls = screen.getByRole("button").className;
    expect(cls).toContain("rounded-none");
    // tailwind-merge debe descartar el rounded-lg del tamaño, no acumularlo.
    expect(cls).not.toContain("rounded-lg");
  });
});
