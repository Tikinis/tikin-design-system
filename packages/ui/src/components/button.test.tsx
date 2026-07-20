import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./button";

/* Estos tests cubren COMPORTAMIENTO, no apariencia. Los valores visuales
 * (48px, r12, tracking .02em) se verifican contra el navegador, no aqui:
 * jsdom no aplica CSS, asi que comprobar clases seria tautologico. */

describe("Button", () => {
  it("por defecto es type=button, no submit", async () => {
    // Un <button> sin type dentro de un <form> envia el formulario. Es el fallo
    // clasico de las librerias de componentes.
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Button>Enviar</Button>
      </form>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Enviar" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("en loading no dispara onClick pero SIGUE siendo enfocable", async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Enviar
      </Button>,
    );
    const btn = screen.getByRole("button");

    expect(btn).toHaveAttribute("aria-busy", "true");
    expect(btn).toHaveAttribute("aria-disabled", "true");
    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();

    // Deliberadamente NO usa el atributo disabled: eso sacaria el foco del
    // boton justo despues de que el usuario lo pulsara.
    expect(btn).not.toBeDisabled();
    btn.focus();
    expect(btn).toHaveFocus();
  });

  it("en loading no envia el formulario que lo contiene", async () => {
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Button type="submit" loading>
          Enviar
        </Button>
      </form>,
    );
    // Sin el atributo disabled, un type=submit enviaria igualmente: por eso el
    // handler llama a preventDefault.
    await userEvent.click(screen.getByRole("button"));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("mantiene el label en el DOM durante loading para que el ancho no salte", () => {
    render(<Button loading>Confirmar</Button>);
    // El spinner SUSTITUYE visualmente al label, pero el texto sigue ocupando
    // su sitio (invisible, no display:none) o el boton se encogeria.
    expect(screen.getByRole("button")).toHaveTextContent("Confirmar");
  });

  it("no pone el label en mayusculas en JS, solo por CSS", () => {
    // Importa para el texto accesible y para lo que se copia al portapapeles.
    render(<Button>Confirmar envio</Button>);
    expect(screen.getByRole("button")).toHaveTextContent("Confirmar envio");
  });

  it("con asChild renderiza el hijo conservando los estilos", () => {
    render(
      <Button asChild>
        <a href="/pagar">Pagar</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Pagar" });
    expect(link).toHaveAttribute("href", "/pagar");
    expect(link.className).toContain("uppercase");
    // Con asChild no inyectamos type: en un <a> no significa lo mismo.
    expect(link).not.toHaveAttribute("type");
  });

  it("permite sobreescribir estilos por className", () => {
    render(<Button className="rounded-none">X</Button>);
    // tailwind-merge debe descartar el rounded-lg del size, no acumularlo.
    const cls = screen.getByRole("button").className;
    expect(cls).toContain("rounded-none");
    expect(cls).not.toContain("rounded-lg");
  });

  it("respeta disabled explicito", async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Enviar
      </Button>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });
});
