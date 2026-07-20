import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  List,
  ListItem,
  ListItemAmount,
  ListItemCheck,
  ListItemIcon,
  ListItemValue,
} from "./list-item";

/* Estos tests cubren COMPORTAMIENTO, no apariencia. Las medidas del documento
 * (42 de avatar, 14.5 de titulo, separador de 1px) se verifican contra el
 * navegador: jsdom no aplica CSS, asi que comprobar clases seria tautologico. */

describe("ListItem", () => {
  it("sin onClick ni asChild es una fila inerte, no un boton", () => {
    render(<ListItem title="Netflix" meta="Ayer · Suscripcion" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByText("Netflix")).toBeInTheDocument();
    expect(screen.getByText("Ayer · Suscripcion")).toBeInTheDocument();
  });

  it("con onClick toda la fila es el target y responde al teclado", async () => {
    const onClick = vi.fn();
    render(<ListItem title="Idioma" meta="Español" onClick={onClick} />);
    const row = screen.getByRole("button", { name: /Idioma/ });

    await userEvent.click(row);
    expect(onClick).toHaveBeenCalledTimes(1);

    // Enter y Espacio salen gratis por ser un <button> real, no por un
    // onKeyDown escrito a mano: eso es justo lo que se quiere garantizar.
    row.focus();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it("la fila interactiva no envia el formulario que la contiene", async () => {
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <ListItem title="Guardar" onClick={() => {}} />
      </form>,
    );
    await userEvent.click(screen.getByRole("button"));
    // Un <button> sin type dentro de un form envia: por eso se fuerza a
    // type="button".
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("con disabled no dispara onClick y el boton queda inhabilitado", async () => {
    const onClick = vi.fn();
    render(<ListItem title="Cerrar sesion" tone="danger" disabled onClick={onClick} />);
    const row = screen.getByRole("button");

    expect(row).toBeDisabled();
    await userEvent.click(row);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("una fila inerte deshabilitada tampoco reacciona al clic", async () => {
    const onClick = vi.fn();
    render(<ListItem title="Idioma" disabled interactive={false} onClick={onClick} />);
    const row = screen.getByText("Idioma").closest("div");

    expect(row).toHaveAttribute("aria-disabled", "true");
    // aria-disabled es solo una promesa: un div sigue recibiendo el clic, asi
    // que el handler tiene que cortarlo.
    await userEvent.click(screen.getByText("Idioma"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("con interactive=false deja UNA sola parada de tabulador: el control interno", async () => {
    // Es la regla de "no anidar interactivos": si la fila fuese un boton, un
    // toggle dentro daria dos paradas de foco para una sola accion.
    render(
      <ListItem
        title="Notificaciones"
        interactive={false}
        trailing={<button type="button">Activar</button>}
      />,
    );
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Activar" })).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Activar" })).not.toHaveFocus();
  });

  it("selected emite aria-pressed y el check lo hereda por contexto", () => {
    const { rerender } = render(
      <ListItem
        title="Maria Rojas"
        selected={false}
        onClick={() => {}}
        trailing={<ListItemCheck data-testid="check" />}
      />,
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByTestId("check")).toHaveAttribute("data-state", "unchecked");

    rerender(
      <ListItem
        title="Maria Rojas"
        selected
        onClick={() => {}}
        trailing={<ListItemCheck data-testid="check" />}
      />,
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
    // El check no puede contradecir a lo que anuncia el lector de pantalla.
    expect(screen.getByTestId("check")).toHaveAttribute("data-state", "checked");
  });

  it("sin selected no inventa aria-pressed", () => {
    render(<ListItem title="Idioma" onClick={() => {}} />);
    expect(screen.getByRole("button")).not.toHaveAttribute("aria-pressed");
  });

  it("con asChild renderiza el destino conservando estilos y contenido", () => {
    render(
      <ListItem
        asChild
        title="Carlos Perez"
        meta="10 jul · Arriendo"
        trailing={<ListItemAmount direction="out">− $850.000</ListItemAmount>}
      >
        <a href="/movimientos/12" />
      </ListItem>,
    );
    const link = screen.getByRole("link", { name: /Carlos Perez/ });
    expect(link).toHaveAttribute("href", "/movimientos/12");
    // El contenido de la fila vive DENTRO del enlace: si quedara fuera, el
    // nombre accesible del enlace estaria vacio.
    expect(link).toHaveTextContent("10 jul · Arriendo");
    expect(link).toHaveTextContent("− $850.000");
    // Con asChild no se inyecta type: en un <a> no significa lo mismo.
    expect(link).not.toHaveAttribute("type");
  });

  it("no pone el titulo en mayusculas en JS", () => {
    // Importa para el texto accesible y para lo que se copia al portapapeles.
    render(<ListItem title="Recarga PSE" leading={<ListItemIcon>mr</ListItemIcon>} />);
    expect(screen.getByText("Recarga PSE")).toBeInTheDocument();
    // Las iniciales tambien: el uppercase es de CSS.
    expect(screen.getByText("mr")).toBeInTheDocument();
  });

  it("permite sobreescribir estilos por className", () => {
    render(<ListItem title="X" className="px-0" />);
    const cls = screen.getByText("X").closest("div")!.className;
    // tailwind-merge debe descartar el px-4 del componente, no acumularlo.
    expect(cls).toContain("px-0");
    expect(cls).not.toContain("px-4");
  });

  it("deja pasar props del DOM al elemento raiz", async () => {
    const onFocus = vi.fn();
    render(<ListItem title="Idioma" onClick={() => {}} onFocus={onFocus} id="fila-idioma" />);
    const row = screen.getByRole("button");
    expect(row).toHaveAttribute("id", "fila-idioma");
    row.focus();
    expect(onFocus).toHaveBeenCalled();
  });
});

describe("ListItemValue", () => {
  it("muestra el valor y oculta el chevron al lector de pantalla", () => {
    render(<ListItemValue data-testid="valor">Español</ListItemValue>);
    const value = screen.getByTestId("valor");
    expect(value).toHaveTextContent("Español");
    // La navegacion ya la anuncia el rol de la fila; el glifo es decoracion.
    expect(value.querySelector("[aria-hidden='true']")).not.toBeNull();
  });

  it("con showChevron=false no dibuja el glifo", () => {
    render(
      <ListItemValue data-testid="valor" showChevron={false}>
        Español
      </ListItemValue>,
    );
    expect(screen.getByTestId("valor").querySelector("svg")).toBeNull();
  });
});

describe("ListItemCheck", () => {
  it("la prop checked manda sobre el contexto de la fila", () => {
    render(
      <ListItem
        title="Laura Gomez"
        selected
        onClick={() => {}}
        trailing={<ListItemCheck data-testid="check" checked={false} />}
      />,
    );
    expect(screen.getByTestId("check")).toHaveAttribute("data-state", "unchecked");
  });

  it("fuera de una fila cae a no seleccionado", () => {
    render(<ListItemCheck data-testid="check" />);
    expect(screen.getByTestId("check")).toHaveAttribute("data-state", "unchecked");
  });
});

describe("List", () => {
  it("con asChild compone semantica de lista real", () => {
    render(
      <List asChild>
        <ul>
          {/* interactive=false: un <li> informativo no es un target. */}
          <ListItem asChild interactive={false} title="Maria Rojas">
            <li />
          </ListItem>
          <ListItem asChild interactive={false} title="Carlos Perez">
            <li />
          </ListItem>
        </ul>
      </List>,
    );
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("no impone rol de lista por defecto, para no robarselo a filas que son botones", () => {
    render(
      <List>
        <ListItem title="Maria Rojas" onClick={() => {}} />
      </List>,
    );
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Maria Rojas/ })).toBeInTheDocument();
  });

  it("permite sobreescribir estilos por className", () => {
    render(
      <List className="rounded-none" data-testid="lista">
        <ListItem title="X" />
      </List>,
    );
    const cls = screen.getByTestId("lista").className;
    expect(cls).toContain("rounded-none");
    expect(cls).not.toContain("rounded-xl");
  });
});
