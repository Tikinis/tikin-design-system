import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

/* Estos tests cubren COMPORTAMIENTO, no apariencia. Los valores visuales
 * (filas 14/16, mono 10 con tracking .1em, linea de total 2px) se verifican
 * contra el navegador, no aqui: jsdom no aplica CSS, asi que comprobar clases
 * seria tautologico. Las dos excepciones — densidad y override por className —
 * miran la clase a proposito, porque lo que validan es el cableado del
 * contexto y de tailwind-merge, no el pixel resultante. */

function BasicTable(props: { density?: "default" | "compact" } = {}) {
  return (
    <Table density={props.density}>
      <TableCaption>Dispersión de julio</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Contacto</TableHead>
          <TableHead align="right">Monto</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>María Rojas</TableCell>
          <TableCell font="num" tone="success">
            + $500.000
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

describe("Table", () => {
  it("renderiza semantica de tabla real, no una rejilla de divs", () => {
    render(<BasicTable />);
    const table = screen.getByRole("table");

    // Sin esto el lector de pantalla no anuncia "columna 2 de 2, MONTO".
    expect(within(table).getAllByRole("columnheader")).toHaveLength(2);
    expect(within(table).getAllByRole("row")).toHaveLength(2);
    expect(within(table).getAllByRole("cell")).toHaveLength(2);
  });

  it("el caption da nombre accesible a la tabla", () => {
    render(<BasicTable />);
    expect(screen.getByRole("table", { name: "Dispersión de julio" })).toBeInTheDocument();
  });

  it("el caption oculto sigue nombrando la tabla", () => {
    // sr-only, no display:none: lo oculto por display no lo lee nadie.
    render(
      <Table>
        <TableCaption visuallyHidden>Extracto</TableCaption>
        <TableBody>
          <TableRow>
            <TableCell>Fila</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByRole("table", { name: "Extracto" })).toBeInTheDocument();
  });

  it("la cabecera lleva scope=col por defecto y respeta el que le pasen", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Contacto</TableHead>
            <TableHead scope="rowgroup">Grupo</TableHead>
          </TableRow>
        </TableHeader>
      </Table>,
    );
    expect(screen.getByText("Contacto")).toHaveAttribute("scope", "col");
    expect(screen.getByText("Grupo")).toHaveAttribute("scope", "rowgroup");
  });

  it("no pone los rotulos en mayusculas en JS, solo por CSS", () => {
    // Importa para el texto accesible y para lo que se copia al portapapeles.
    render(<BasicTable />);
    expect(screen.getByRole("columnheader", { name: "Contacto" })).toHaveTextContent("Contacto");
  });

  it("la densidad llega a las celdas por contexto, sin repetirla columna a columna", () => {
    const { rerender } = render(<BasicTable />);
    expect(screen.getByRole("cell", { name: "María Rojas" }).className).toContain("py-3.5");

    rerender(<BasicTable density="compact" />);
    expect(screen.getByRole("cell", { name: "María Rojas" }).className).toContain("py-2");
  });

  it("permite sobreescribir estilos por className", () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="py-0">Fila</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    // tailwind-merge debe descartar el py-3.5 de la densidad, no acumularlo.
    const cls = screen.getByRole("cell", { name: "Fila" }).className;
    expect(cls).toContain("py-0");
    expect(cls).not.toContain("py-3.5");
  });
});

describe("Table · orden", () => {
  it("la columna ordenable expone un boton y avisa al pulsarlo", async () => {
    const onSort = vi.fn();
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable onSort={onSort}>
              Fecha
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Fecha" }));
    expect(onSort).toHaveBeenCalledTimes(1);
  });

  it("se ordena tambien con teclado: Tab hasta la columna, Enter y Espacio", async () => {
    const onSort = vi.fn();
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable onSort={onSort}>
              Fecha
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>,
    );

    // Es un <button> de verdad: el foco y las dos teclas vienen del navegador.
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Fecha" })).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    expect(onSort).toHaveBeenCalledTimes(2);
  });

  it("aria-sort refleja el sentido y solo existe si la columna es ordenable", () => {
    const { rerender } = render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable>Fecha</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
      </Table>,
    );

    const fecha = () => screen.getByRole("columnheader", { name: "Fecha" });
    // Ordenable pero sin orden aplicado.
    expect(fecha()).toHaveAttribute("aria-sort", "none");
    // "none" en una columna que no se puede ordenar seria enganoso.
    expect(screen.getByRole("columnheader", { name: "Estado" })).not.toHaveAttribute("aria-sort");

    rerender(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable sortDirection="asc">
              Fecha
            </TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
      </Table>,
    );
    expect(fecha()).toHaveAttribute("aria-sort", "ascending");

    rerender(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable sortDirection="desc">
              Fecha
            </TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
      </Table>,
    );
    expect(fecha()).toHaveAttribute("aria-sort", "descending");
  });

  it("una columna no ordenable no mete un boton en medio del recorrido de teclado", async () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
      </Table>,
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});

describe("Table · seleccion", () => {
  it("marca la fila seleccionada para el lector de pantalla", () => {
    render(
      <Table>
        <TableBody>
          <TableRow selected>
            <TableCell>María Rojas</TableCell>
          </TableRow>
          <TableRow selected={false}>
            <TableCell>Carlos Díaz</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    const [seleccionada, libre] = screen.getAllByRole("row");
    expect(seleccionada).toHaveAttribute("aria-selected", "true");
    expect(seleccionada).toHaveAttribute("data-state", "selected");
    expect(libre).toHaveAttribute("aria-selected", "false");
    expect(libre).not.toHaveAttribute("data-state");
  });

  it("en una tabla sin seleccion no ensucia las filas con aria-selected", () => {
    // Un aria-selected="false" en cada fila de una tabla que no se selecciona
    // es ruido puro para quien navega con lector.
    render(<BasicTable />);
    for (const row of screen.getAllByRole("row")) {
      expect(row).not.toHaveAttribute("aria-selected");
    }
  });
});

describe("Table · total", () => {
  it("el total va en tfoot para que se anuncie como resumen, no como un dato mas", () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Envíos</TableCell>
            <TableCell font="num">$1.240.000</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell font="num">$1.240.000</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    );

    const table = screen.getByRole("table");
    const foot = table.querySelector("tfoot");
    expect(foot).not.toBeNull();
    expect(within(foot as HTMLElement).getByRole("cell", { name: "Total" })).toBeInTheDocument();
    // rowgroup = thead/tbody/tfoot. Aqui hay dos: cuerpo y pie.
    expect(within(table).getAllByRole("rowgroup")).toHaveLength(2);
  });
});
