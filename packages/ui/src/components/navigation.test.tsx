import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Sidebar,
  SidebarFooter,
  SidebarItem,
  SidebarUser,
  TabBar,
  TabBarAction,
  TabBarItem,
  TopBar,
  TopBarAction,
  TopBarLink,
} from "./navigation";

/* Estos tests cubren COMPORTAMIENTO, no apariencia. Las medidas (rail 220,
 * accion central 52, item 64) se verifican contra el navegador, no aqui: jsdom
 * no aplica CSS, asi que comprobar clases seria tautologico. */

const Dot = () => <svg data-testid="icon" />;

describe("TopBar", () => {
  it("expone el titulo como encabezado de la pantalla", () => {
    render(<TopBar title="Enviar dinero" />);
    expect(screen.getByRole("heading", { level: 1, name: "Enviar dinero" })).toBeInTheDocument();
  });

  it("solo dibuja el boton de volver si le pasan onBack, y lo llama al pulsar", async () => {
    const onBack = vi.fn();
    const { rerender } = render(<TopBar title="Paso 1" />);
    expect(screen.queryByRole("button", { name: "Volver" })).not.toBeInTheDocument();

    rerender(<TopBar title="Paso 1" onBack={onBack} />);
    await userEvent.click(screen.getByRole("button", { name: "Volver" }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("el boton de volver se activa con Enter y con Espacio", async () => {
    const onBack = vi.fn();
    render(<TopBar title="Paso 1" onBack={onBack} />);
    const back = screen.getByRole("button", { name: "Volver" });

    // Una sola parada de tabulador hasta el back: es el primer foco de la barra.
    await userEvent.tab();
    expect(back).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    expect(onBack).toHaveBeenCalledTimes(2);
  });

  it("en variante home pinta saludo y titulo grande", () => {
    render(<TopBar variant="home" greeting="Hola, Valentina" title="Inicio" />);
    expect(screen.getByText("Hola, Valentina")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Inicio" })).toBeInTheDocument();
  });

  it("en variante web envuelve los links en un nav con nombre accesible", () => {
    render(
      <TopBar variant="web" logo="tikin" navLabel="Menú">
        <TopBarLink href="#inicio" label="Inicio" active />
        <TopBarLink href="#mov" label="Movimientos" />
      </TopBar>,
    );
    const nav = screen.getByRole("navigation", { name: "Menú" });
    expect(nav).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Inicio" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Movimientos" })).not.toHaveAttribute("aria-current");
  });

  it("TopBarLink con asChild conserva el elemento del consumidor y su texto", () => {
    render(
      <TopBarLink asChild label="Bolsillos" active>
        <a href="/bolsillos" data-testid="router-link" />
      </TopBarLink>,
    );
    const link = screen.getByTestId("router-link");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/bolsillos");
    expect(link).toHaveTextContent("Bolsillos");
    expect(link).toHaveAttribute("aria-current", "page");
  });
});

describe("TopBarAction", () => {
  it("por defecto es type=button, no submit", async () => {
    // Un <button> sin type dentro de un <form> envia el formulario.
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <TopBarAction label="Ayuda">
          <Dot />
        </TopBarAction>
      </form>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Ayuda" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("el punto de aviso no aporta nombre accesible: tiene que ir en el label", () => {
    render(
      <TopBarAction label="Notificaciones, 3 sin leer" dot>
        <Dot />
      </TopBarAction>,
    );
    // El unico nombre del boton es el que pasa el consumidor. El punto queda
    // fuera del arbol de accesibilidad a proposito.
    expect(screen.getByRole("button", { name: "Notificaciones, 3 sin leer" })).toBeInTheDocument();
  });

  it("deshabilitado no dispara onClick", async () => {
    const onClick = vi.fn();
    render(
      <TopBarAction label="Buscar" disabled onClick={onClick}>
        <Dot />
      </TopBarAction>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Buscar" }));
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe("TabBar", () => {
  const bar = (onSend = vi.fn()) => (
    <TabBar
      label="Navegación inferior"
      action={
        <TabBarAction label="Enviar" onClick={onSend}>
          <Dot />
        </TabBarAction>
      }
    >
      <TabBarItem icon={<Dot />} label="Inicio" active />
      <TabBarItem icon={<Dot />} label="Movimientos" />
      <TabBarItem icon={<Dot />} label="Bolsillos" />
      <TabBarItem icon={<Dot />} label="Bonos" />
    </TabBar>
  );

  it("es un landmark de navegacion con nombre", () => {
    render(bar());
    expect(screen.getByRole("navigation", { name: "Navegación inferior" })).toBeInTheDocument();
  });

  it("marca aria-current solo en el destino activo", () => {
    render(bar());
    expect(screen.getByRole("button", { name: /Inicio/ })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: /Bonos/ })).not.toHaveAttribute("aria-current");
  });

  it("la accion central queda en mitad del orden de tabulacion", async () => {
    render(bar());
    // Va posicionada en absoluto, pero su sitio en el DOM se elige para que el
    // recorrido con teclado coincida con el orden visual.
    const order = ["Inicio", "Movimientos", "Enviar", "Bolsillos", "Bonos"];
    for (const name of order) {
      await userEvent.tab();
      expect(screen.getByRole("button", { name: new RegExp(name) })).toHaveFocus();
    }
  });

  it("la accion central se activa con teclado", async () => {
    const onSend = vi.fn();
    render(bar(onSend));
    screen.getByRole("button", { name: "Enviar" }).focus();
    await userEvent.keyboard("{Enter}");
    expect(onSend).toHaveBeenCalledTimes(1);
  });

  it("usa activeIcon cuando el destino esta activo y icon cuando no", () => {
    const { rerender } = render(
      <TabBarItem
        icon={<svg data-testid="regular" />}
        activeIcon={<svg data-testid="fill" />}
        label="Inicio"
      />,
    );
    expect(screen.getByTestId("regular")).toBeInTheDocument();
    expect(screen.queryByTestId("fill")).not.toBeInTheDocument();

    rerender(
      <TabBarItem
        icon={<svg data-testid="regular" />}
        activeIcon={<svg data-testid="fill" />}
        label="Inicio"
        active
      />,
    );
    expect(screen.getByTestId("fill")).toBeInTheDocument();
    expect(screen.queryByTestId("regular")).not.toBeInTheDocument();
  });

  it("cae en icon si no le dan activeIcon", () => {
    render(<TabBarItem icon={<svg data-testid="regular" />} label="Inicio" active />);
    expect(screen.getByTestId("regular")).toBeInTheDocument();
  });

  it("no pone el label en mayusculas en JS", () => {
    // Importa para el texto accesible y para lo que se copia al portapapeles.
    render(<TabBarItem icon={<Dot />} label="Movimientos" />);
    expect(screen.getByRole("button")).toHaveTextContent("Movimientos");
  });

  it("con asChild renderiza el enlace del consumidor sin inyectar type", () => {
    render(
      <TabBarItem asChild icon={<Dot />} label="Bolsillos" active>
        <a href="/bolsillos" />
      </TabBarItem>,
    );
    const link = screen.getByRole("link", { name: "Bolsillos" });
    expect(link).toHaveAttribute("href", "/bolsillos");
    expect(link).toHaveAttribute("aria-current", "page");
    // En un <a> el atributo `type` no significa lo mismo, asi que no se pone.
    expect(link).not.toHaveAttribute("type");
  });

  it("funciona sin accion central", () => {
    render(
      <TabBar>
        <TabBarItem icon={<Dot />} label="Inicio" />
        <TabBarItem icon={<Dot />} label="Bonos" />
      </TabBar>,
    );
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });
});

describe("Sidebar", () => {
  const rail = (
    <Sidebar brand="tikin" label="Rail">
      <SidebarItem icon={<Dot />} label="Inicio" active />
      <SidebarItem icon={<Dot />} label="Bonos" badge={3} />
      <SidebarFooter>
        <SidebarItem icon={<Dot />} label="Ayuda" />
        <SidebarUser initials="VC" name="Valentina C." handle="$valentina" />
      </SidebarFooter>
    </Sidebar>
  );

  it("es un landmark de navegacion con nombre", () => {
    render(rail);
    expect(screen.getByRole("navigation", { name: "Rail" })).toBeInTheDocument();
  });

  it("marca aria-current solo en el destino activo", () => {
    render(rail);
    expect(screen.getByRole("button", { name: /Inicio/ })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: /Ayuda/ })).not.toHaveAttribute("aria-current");
  });

  it("el contador entra en el nombre accesible del destino", () => {
    render(rail);
    // Un contador que solo se ve no existe para quien usa lector de pantalla.
    expect(screen.getByRole("button", { name: "Bonos 3" })).toBeInTheDocument();
  });

  it("recorre los destinos con Tab en orden, con el pie al final", async () => {
    render(rail);
    for (const name of ["Inicio", "Bonos", "Ayuda"]) {
      await userEvent.tab();
      expect(screen.getByRole("button", { name: new RegExp(name) })).toHaveFocus();
    }
  });

  it("las iniciales del avatar no duplican el nombre para el lector", () => {
    render(<SidebarUser initials="VC" name="Valentina C." handle="$valentina" />);
    expect(screen.getByText("Valentina C.")).toBeInTheDocument();
    expect(screen.getByText("$valentina")).toBeInTheDocument();
    // "VC" esta en el DOM pero marcado aria-hidden.
    expect(screen.getByText("VC")).toHaveAttribute("aria-hidden", "true");
  });

  it("SidebarItem con asChild renderiza el enlace del consumidor", () => {
    render(
      <SidebarItem asChild icon={<Dot />} label="Movimientos">
        <a href="/movimientos" />
      </SidebarItem>,
    );
    expect(screen.getByRole("link", { name: "Movimientos" })).toHaveAttribute(
      "href",
      "/movimientos",
    );
  });

  it("deshabilitado no dispara onClick", async () => {
    const onClick = vi.fn();
    render(<SidebarItem icon={<Dot />} label="Tarjeta" disabled onClick={onClick} />);
    await userEvent.click(screen.getByRole("button", { name: /Tarjeta/ }));
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe("className", () => {
  it("el consumidor puede sobreescribir estilos en todos los contenedores", () => {
    render(
      <>
        <TopBar data-testid="top" className="rounded-none px-0" title="T" />
        <TabBar data-testid="tab" className="bg-page" />
        <Sidebar data-testid="side" className="w-[260px]" />
      </>,
    );
    // tailwind-merge debe descartar la clase del componente, no acumularla.
    expect(screen.getByTestId("top").className).toContain("px-0");
    expect(screen.getByTestId("top").className).not.toContain("px-3.5");
    expect(screen.getByTestId("tab").className).toContain("bg-page");
    expect(screen.getByTestId("tab").className).not.toContain("bg-surface");
    expect(screen.getByTestId("side").className).toContain("w-[260px]");
    expect(screen.getByTestId("side").className).not.toContain("w-[220px]");
  });
});
