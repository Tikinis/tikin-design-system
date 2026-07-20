import * as React from "react";
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

function BasicTable(props: { density?: "default" | "medium" | "compact" } = {}) {
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

    // medium es el bloque "CON SELECCION & ACCIONES": fila 12/14.
    rerender(<BasicTable density="medium" />);
    expect(screen.getByRole("cell", { name: "María Rojas" }).className).toContain("py-3");

    rerender(<BasicTable density="compact" />);
    expect(screen.getByRole("cell", { name: "María Rojas" }).className).toContain("py-2");
  });

  it("el marco y su contenedor son gobernables desde fuera", () => {
    // El marco lo dibuja el div que scrollea, no la <table>: sin frame no debe
    // quedar borde que se apile con el de la Card que la envuelve.
    const { rerender } = render(
      <Table containerClassName="max-h-40">
        <TableBody>
          <TableRow>
            <TableCell>Fila</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    const container = () => screen.getByRole("table").parentElement as HTMLElement;
    expect(container().className).toContain("rounded-xl");
    expect(container().className).toContain("border-edge");
    expect(container().className).toContain("max-h-40");

    rerender(
      <Table frame={false}>
        <TableBody>
          <TableRow>
            <TableCell>Fila</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(container().className).not.toContain("border-edge");
  });

  it("containerRef llega al elemento que scrollea, no a la tabla", () => {
    // Sin esto no se puede llevar el scroll horizontal a una columna: `ref`
    // apunta al <table>, que no es el que tiene overflow.
    const containerRef = React.createRef<HTMLDivElement>();
    const tableRef = React.createRef<HTMLTableElement>();
    render(
      <Table ref={tableRef} containerRef={containerRef}>
        <TableBody>
          <TableRow>
            <TableCell>Fila</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(tableRef.current?.tagName).toBe("TABLE");
    expect(containerRef.current?.tagName).toBe("DIV");
    expect(containerRef.current?.className).toContain("overflow-x-auto");
    expect(containerRef.current).toBe(tableRef.current?.parentElement);
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

describe("Table · cifras a la derecha", () => {
  it("un importe se alinea solo a la derecha, sin que el consumidor lo pida", () => {
    // Regla nº2 de la seccion. Es lo que permite comparar dos importes de un
    // vistazo: si una columna de montos se alinea a la izquierda, los digitos
    // dejan de cuadrar y hay que leerlos.
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Concepto</TableCell>
            <TableCell font="num">$120.000</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(screen.getByRole("cell", { name: "$120.000" }).className).toContain("text-right");
    // El texto corriente sigue a la izquierda.
    expect(screen.getByRole("cell", { name: "Concepto" }).className).toContain("text-left");
  });

  it("align explicito pisa la alineacion automatica del importe", () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell font="num" align="left">
              $120.000
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    const cls = screen.getByRole("cell", { name: "$120.000" }).className;
    expect(cls).toContain("text-left");
    expect(cls).not.toContain("text-right");
  });
});

describe("Table · cabecera de fila", () => {
  it("un th fuera del thead nombra su fila y se pinta como celda, no como rotulo", () => {
    // Sin esto, seguir la guia (scope="row" en la primera columna) sacaba el
    // nombre del contacto en Ubuntu Mono 10px MAYUSCULAS en medio del cuerpo.
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Contacto</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableHead>María Rojas</TableHead>
          </TableRow>
        </TableBody>
      </Table>,
    );

    const rotulo = screen.getByRole("columnheader", { name: "Contacto" });
    const nombre = screen.getByRole("rowheader", { name: "María Rojas" });

    // El th del cuerpo se resuelve a scope="row" sin que nadie lo diga.
    expect(rotulo).toHaveAttribute("scope", "col");
    expect(nombre).toHaveAttribute("scope", "row");

    expect(rotulo.className).toContain("font-meta");
    expect(rotulo.className).toContain("uppercase");

    expect(nombre.className).toContain("font-sans");
    expect(nombre.className).toContain("py-3.5");
    expect(nombre.className).not.toContain("font-meta");
    expect(nombre.className).not.toContain("uppercase");
    // Los th nacen en negrita: el archivo pinta el nombre en regular.
    expect(nombre.className).toContain("font-normal");
  });

  it("la cabecera de fila del pie sube a la tipografia de total", () => {
    render(
      <Table>
        <TableFooter>
          <TableRow>
            <TableHead scope="row">Total</TableHead>
          </TableRow>
        </TableFooter>
      </Table>,
    );

    const cls = screen.getByRole("rowheader", { name: "Total" }).className;
    expect(cls).toContain("font-display");
    expect(cls).toContain("font-semibold");
    expect(cls).not.toContain("font-normal");
  });
});

describe("Table · hover", () => {
  it("resalta las filas del cuerpo y nunca las de cabecera ni pie", () => {
    // Regla nº1: "filas separadas por linea 1px; hover en hueso".
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Contacto</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>María Rojas</TableCell>
          </TableRow>
          <TableRow hover={false}>
            <TableCell>Carlos Díaz</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    );

    const rowOf = (nombre: string) => screen.getByText(nombre).closest("tr") as HTMLTableRowElement;

    expect(rowOf("María Rojas").className).toContain("hover:bg-page");
    // Opt-out por fila para tablas de solo lectura.
    expect(rowOf("Carlos Díaz").className).not.toContain("hover:bg-page");
    expect(rowOf("Contacto").className).not.toContain("hover:bg-page");
    expect(rowOf("Total").className).not.toContain("hover:bg-page");
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

  it("la flecha cambia de glifo con el sentido del orden", () => {
    const glifo = () => [...screen.getByRole("columnheader").querySelectorAll("path")];
    const trazo = () => glifo()[0]?.getAttribute("d");

    const { rerender } = render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable>Fecha</TableHead>
          </TableRow>
        </TableHeader>
      </Table>,
    );
    // Sin orden: la doble flecha ↕ son dos trazos.
    expect(glifo()).toHaveLength(2);

    rerender(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable sortDirection="asc">
              Fecha
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>,
    );
    expect(glifo()).toHaveLength(1);
    const asc = trazo();

    rerender(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable sortDirection="desc">
              Fecha
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>,
    );
    expect(glifo()).toHaveLength(1);
    expect(trazo()).not.toBe(asc);
  });

  it("sortable sin onSort no deja un boton inerte en el recorrido de teclado", () => {
    // Un <button> que no notifica a nadie promete una accion que no existe.
    // El rotulo conserva la flecha y el aria-sort, que es lo que comunica.
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable sortDirection="asc">
              Fecha
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>,
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    const th = screen.getByRole("columnheader", { name: "Fecha" });
    expect(th).toHaveAttribute("aria-sort", "ascending");
    expect(th.querySelector("svg")).not.toBeNull();
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

  it("el pie invierte la tipografia: concepto en display y cifra grande", () => {
    render(
      <Table>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell font="num">$1.240.000</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    );

    const concepto = screen.getByRole("cell", { name: "Total" }).className;
    expect(concepto).toContain("font-display");
    expect(concepto).toContain("font-semibold");
    expect(concepto).toContain("text-[15px]");
    // El sans de la celda tiene que haber perdido, no acumularse.
    expect(concepto).not.toContain("font-sans");

    expect(screen.getByRole("cell", { name: "$1.240.000" }).className).toContain("text-base");
  });

  it("el pie no se comprime con la densidad: un total no es una fila de datos", () => {
    // Antes, una tabla compacta mezclaba cifras de 13px en el cuerpo con un pie
    // de 16px pero con el padding apretado del cuerpo: un pie a medio camino
    // que el archivo no especifica en ninguna parte.
    render(
      <Table density="compact">
        <TableBody>
          <TableRow>
            <TableCell font="num">$20.000</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell font="num">$1.240.000</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    );

    expect(screen.getByRole("cell", { name: "$20.000" }).className).toContain("py-2");

    const pie = screen.getByRole("cell", { name: "$1.240.000" }).className;
    expect(pie).toContain("px-4");
    expect(pie).toContain("py-3.5");
    expect(pie).not.toContain("py-2 ");
    expect(pie).toContain("text-base");
  });

  it("el consumidor sigue pudiendo repintar el pie por className", () => {
    // El override de seccion se aplica antes que className: si ganase el, el
    // consumidor se quedaria sin poder ajustar el pie.
    render(
      <Table>
        <TableFooter>
          <TableRow>
            <TableCell className="py-0 text-xs">Total</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    );

    const cls = screen.getByRole("cell", { name: "Total" }).className;
    expect(cls).toContain("py-0");
    expect(cls).toContain("text-xs");
    expect(cls).not.toContain("py-3.5");
    expect(cls).not.toContain("text-[15px]");
  });
});
