import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  BreadcrumbItem,
  Breadcrumbs,
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

afterEach(() => {
  vi.restoreAllMocks();
});

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

  it("en variante web pinta el logo", () => {
    render(<TopBar variant="web" logo="tikin" />);
    expect(screen.getByText("tikin")).toBeInTheDocument();
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

  it("dibuja el punto de aviso, y fuera del arbol de accesibilidad", () => {
    const { rerender } = render(
      <TopBarAction label="Notificaciones" data-testid="campana">
        <Dot />
      </TopBarAction>,
    );
    // Sin la prop no hay punto: el assert de abajo tiene que poder fallar.
    expect(screen.getByTestId("campana").querySelector("span[aria-hidden='true']")).toBeNull();

    rerender(
      <TopBarAction label="Notificaciones, 3 sin leer" dot data-testid="campana">
        <Dot />
      </TopBarAction>,
    );
    // El punto existe de verdad en el DOM...
    const punto = screen
      .getByTestId("campana")
      .querySelector("span[aria-hidden='true']") as HTMLElement | null;
    expect(punto).not.toBeNull();
    // ...y sigue siendo decorativo: el unico nombre del boton es el del label.
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

  it("no comparte nombre de landmark con la barra web ni con el rail", () => {
    // Un layout responsive tiene las tres en el DOM aunque el CSS enseñe una:
    // con nombres repetidos el lector lista regiones indistinguibles.
    render(
      <>
        <TopBar variant="web" logo="tikin">
          <TopBarLink href="#i" label="Inicio" />
        </TopBar>
        <TabBar>
          <TabBarItem icon={<Dot />} label="Inicio" />
          <TabBarItem icon={<Dot />} label="Bonos" />
        </TabBar>
        <Sidebar />
      </>,
    );
    const nombres = screen.getAllByRole("navigation").map((nav) => nav.getAttribute("aria-label"));
    expect(nombres).toHaveLength(3);
    expect(new Set(nombres).size).toBe(3);
  });

  it("avisa en desarrollo si el reparto en mitades no cuadra", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <TabBar
        action={
          <TabBarAction label="Enviar">
            <Dot />
          </TabBarAction>
        }
      >
        <TabBarItem icon={<Dot />} label="Inicio" />
        <TabBarItem icon={<Dot />} label="Movimientos" />
        <TabBarItem icon={<Dot />} label="Bolsillos" />
      </TabBar>,
    );
    // Con 3 destinos y accion central el hueco del medio deja de estar centrado.
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0]?.[0]).toContain("mitades");
  });

  it("avisa en desarrollo si se pasan mas de 4 destinos", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <TabBar>
        {["Inicio", "Movimientos", "Bolsillos", "Bonos", "Tarjeta"].map((n) => (
          <TabBarItem key={n} icon={<Dot />} label={n} />
        ))}
      </TabBar>,
    );
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0]?.[0]).toContain("maximo en 4 destinos");
  });

  it("no avisa con 4 destinos y accion central", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(bar());
    expect(warn).not.toHaveBeenCalled();
  });

  it("disabled con asChild bloquea la activacion del enlace del consumidor", async () => {
    // En un <a> el atributo `disabled` no existe: sin traducirlo a aria-disabled
    // y cortar el click, el destino inhabilitado seguia navegando.
    const onClick = vi.fn();
    render(
      <TabBarItem asChild icon={<Dot />} label="Bolsillos" disabled onClick={onClick}>
        <a href="/bolsillos" />
      </TabBarItem>,
    );
    const link = screen.getByRole("link", { name: "Bolsillos" });
    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).toHaveAttribute("data-disabled", "");
    // `disabled` no se cuela como atributo invalido en el <a>.
    expect(link).not.toHaveAttribute("disabled");

    await userEvent.click(link);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("sin asChild conserva el atributo disabled nativo", async () => {
    const onClick = vi.fn();
    render(<TabBarItem icon={<Dot />} label="Bonos" disabled onClick={onClick} />);
    const boton = screen.getByRole("button", { name: /Bonos/ });
    expect(boton).toBeDisabled();
    await userEvent.click(boton);
    expect(onClick).not.toHaveBeenCalled();
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

  it("disabled con asChild bloquea la activacion del enlace del consumidor", async () => {
    const onClick = vi.fn();
    render(
      <SidebarItem asChild icon={<Dot />} label="Tarjeta" disabled onClick={onClick}>
        <a href="/tarjeta" />
      </SidebarItem>,
    );
    const link = screen.getByRole("link", { name: /Tarjeta/ });
    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).not.toHaveAttribute("disabled");
    await userEvent.click(link);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("el pie se renderiza y deja sus destinos alcanzables", () => {
    render(rail);
    expect(screen.getByRole("button", { name: /Ayuda/ })).toBeInTheDocument();
    expect(screen.getByText("Valentina C.")).toBeInTheDocument();
  });
});

describe("Breadcrumbs", () => {
  const ruta = (
    <Breadcrumbs>
      <BreadcrumbItem href="/inicio" label="Inicio" />
      <BreadcrumbItem href="/bolsillos" label="Bolsillos" />
      <BreadcrumbItem label="Arriendo" current />
    </Breadcrumbs>
  );

  it("es un landmark de navegacion con nombre propio", () => {
    render(ruta);
    expect(screen.getByRole("navigation", { name: "Ruta" })).toBeInTheDocument();
  });

  it("ordena los tramos en una lista: el orden ES la jerarquia", () => {
    render(ruta);
    const tramos = screen.getAllByRole("listitem");
    expect(tramos).toHaveLength(3);
    expect(tramos[0]).toHaveTextContent("Inicio");
    expect(tramos[2]).toHaveTextContent("Arriendo");
  });

  it("el tramo actual no es enlace y lleva aria-current", () => {
    render(ruta);
    // Un enlace a la pagina en la que ya estas es una parada de tabulador que
    // no lleva a ningun sitio.
    expect(screen.queryByRole("link", { name: "Arriendo" })).not.toBeInTheDocument();
    expect(screen.getByText("Arriendo")).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Inicio" })).not.toHaveAttribute("aria-current");
  });

  it("pone un separador entre tramos y ninguno al final", () => {
    const { container } = render(ruta);
    const separadores = container.querySelectorAll("li > span[aria-hidden='true']");
    // Tres tramos, dos carets. Y quedan fuera del arbol de accesibilidad: el
    // lector ya separa los <li> por su cuenta.
    expect(separadores).toHaveLength(2);
  });

  it("acepta un separador propio", () => {
    render(
      <Breadcrumbs separator={<span data-testid="barra">/</span>}>
        <BreadcrumbItem href="/inicio" label="Inicio" />
        <BreadcrumbItem label="Arriendo" current />
      </Breadcrumbs>,
    );
    expect(screen.getAllByTestId("barra")).toHaveLength(1);
  });

  it("con asChild renderiza el enlace del consumidor", () => {
    render(
      <Breadcrumbs>
        <BreadcrumbItem asChild label="Inicio">
          <a href="/inicio" data-testid="router-link" />
        </BreadcrumbItem>
        <BreadcrumbItem label="Arriendo" current />
      </Breadcrumbs>,
    );
    const link = screen.getByTestId("router-link");
    expect(link.tagName).toBe("A");
    expect(link).toHaveTextContent("Inicio");
  });

  it("el consumidor puede sobreescribir el contenedor", () => {
    render(<Breadcrumbs data-testid="ruta" className="hidden" />);
    expect(screen.getByTestId("ruta").className).toContain("hidden");
    expect(screen.getByTestId("ruta").className).not.toContain("flex");
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
