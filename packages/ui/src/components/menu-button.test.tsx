import * as React from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  ButtonGroup,
  ButtonGroupItem,
  MenuButton,
  MenuItem,
  MenuSeparator,
  SplitButton,
} from "./menu-button";

/* Tests de COMPORTAMIENTO. Los valores visuales (40 de alto, r10, divisor de
 * 1px en gris 700) se verifican contra el navegador: jsdom no aplica CSS, asi
 * que comprobar clases aqui seria tautologico.
 *
 * Lo que si se comprueba es todo lo que el documento describe como conducta:
 * abrir/cerrar, Escape, click fuera, foco de vuelta al trigger, y la regla de
 * que el group siempre tiene exactamente una opcion activa. */

/* ------------------------------------------------------------------------- */
/* Mini-cascada                                                               */
/* ------------------------------------------------------------------------- */

/* jsdom no aplica CSS, asi que para comprobar QUE UTILIDAD GANA hay que
 * modelar la cascada a mano. No es comprobar que una clase esta presente —eso
 * si seria tautologico—, es comprobar cual de las que estan presentes pinta:
 * una utilidad solo entra si TODOS sus modificadores casan con el estado, y
 * entre las que entran gana la de mayor especificidad (1 punto por la clase
 * mas 1 por cada modificador, que son todos pseudoclases o atributos), con el
 * orden en la hoja como desempate.
 *
 * Sirve para el fallo que motiva estos tests: un hover generico de la base
 * (0,3,0) le gana al data-[state=open] (0,2,0) y devuelve el fondo a claro
 * mientras el texto se queda en surface. */
interface Estado {
  hover?: boolean;
  active?: boolean;
  /** data-state=open del trigger o data-state=on del segmento. */
  on?: boolean;
  disabled?: boolean;
}

function partirClase(clase: string): string[] {
  // Los `:` de dentro de un [] no separan modificadores.
  const partes: string[] = [];
  let actual = "";
  let profundidad = 0;
  for (const ch of clase) {
    if (ch === "[") profundidad += 1;
    else if (ch === "]") profundidad -= 1;
    if (ch === ":" && profundidad === 0) {
      partes.push(actual);
      actual = "";
    } else {
      actual += ch;
    }
  }
  partes.push(actual);
  return partes;
}

function casaModificador(modificador: string, estado: Estado): boolean | undefined {
  switch (modificador) {
    case "hover":
      return Boolean(estado.hover);
    case "active":
      return Boolean(estado.active);
    case "disabled":
      return Boolean(estado.disabled);
    case "not-disabled":
      return !estado.disabled;
    case "data-[state=open]":
    case "data-[state=on]":
      return Boolean(estado.on);
    case "not-data-[state=open]":
    case "not-data-[state=on]":
      return !estado.on;
    default:
      // Modificador que no modelamos (focus-visible, first, group-*...).
      return undefined;
  }
}

/** Utilidad que acaba pintando `propiedad` con el estado dado, o undefined. */
function utilidadGanadora(
  className: string,
  propiedad: RegExp,
  estado: Estado,
): string | undefined {
  let ganadora: string | undefined;
  let mejorEspecificidad = -1;

  className
    .split(/\s+/)
    .filter(Boolean)
    .forEach((clase) => {
      const partes = partirClase(clase);
      const utilidad = partes.pop();
      if (!utilidad || !propiedad.test(utilidad)) return;
      // Si alguno de los modificadores no casa —o no sabemos modelarlo— la
      // regla no pinta en este estado.
      if (partes.some((m) => casaModificador(m, estado) !== true)) return;
      // Empate de especificidad: gana la ultima, como en la hoja de estilos.
      const especificidad = 1 + partes.length;
      if (especificidad >= mejorEspecificidad) {
        mejorEspecificidad = especificidad;
        ganadora = utilidad;
      }
    });

  return ganadora;
}

const FONDO = /^bg-/;
// Solo colores de texto: `text-sm` o `text-[13px]` son tamaño, no color.
const COLOR_TEXTO = /^text-(?:ink|surface|edge|fg-|tint-)/;

beforeAll(() => {
  // El posicionador de Radix (floating-ui) observa el tamaño del panel. jsdom
  // no trae ResizeObserver, asi que lo stubeamos con un doble inerte: aqui no
  // medimos posiciones, solo comportamiento.
  if (!("ResizeObserver" in globalThis)) {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
  }
  // Radix usa captura de puntero para distinguir click de drag sobre el
  // trigger. jsdom no implementa la Pointer Events API.
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = () => false;
    Element.prototype.setPointerCapture = () => {};
    Element.prototype.releasePointerCapture = () => {};
  }
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => {};
  }
});

function Menu(props: Partial<React.ComponentProps<typeof MenuButton>> = {}) {
  return (
    <MenuButton label="Acciones" {...props}>
      <MenuItem>Enviar dinero</MenuItem>
      <MenuItem>Recibir</MenuItem>
      <MenuSeparator />
      <MenuItem destructive>Cancelar envío</MenuItem>
    </MenuButton>
  );
}

describe("MenuButton", () => {
  it("abre el panel al pulsar el trigger y lo anuncia con aria-expanded", async () => {
    render(<Menu />);
    const trigger = screen.getByRole("button", { name: /acciones/i });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(trigger);

    expect(await screen.findByRole("menu")).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getAllByRole("menuitem")).toHaveLength(3);
  });

  it("cierra al elegir una opcion y avisa al consumidor", async () => {
    const onSelect = vi.fn();
    render(
      <MenuButton label="Acciones">
        <MenuItem onSelect={onSelect}>Enviar dinero</MenuItem>
        <MenuItem>Recibir</MenuItem>
      </MenuButton>,
    );

    await userEvent.click(screen.getByRole("button", { name: /acciones/i }));
    await userEvent.click(await screen.findByRole("menuitem", { name: "Enviar dinero" }));

    expect(onSelect).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
  });

  it("cierra con Escape y devuelve el foco al trigger", async () => {
    render(<Menu />);
    const trigger = screen.getByRole("button", { name: /acciones/i });

    await userEvent.click(trigger);
    await screen.findByRole("menu");
    await userEvent.keyboard("{Escape}");

    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
    // Perder el foco al cerrar dejaria al usuario de teclado al principio de la
    // pagina.
    expect(trigger).toHaveFocus();
  });

  it("se maneja entero con teclado: abre y recorre las opciones con las flechas", async () => {
    render(<Menu />);
    const trigger = screen.getByRole("button", { name: /acciones/i });
    trigger.focus();

    await userEvent.keyboard("{Enter}");
    const items = await screen.findAllByRole("menuitem");
    // Radix enfoca la primera opcion al abrir con teclado.
    await waitFor(() => expect(items[0]).toHaveFocus());

    await userEvent.keyboard("{ArrowDown}");
    expect(items[1]).toHaveFocus();
  });

  it("cierra al hacer click fuera del panel", async () => {
    render(
      <>
        <button type="button">Fuera</button>
        <Menu />
      </>,
    );

    await userEvent.click(screen.getByRole("button", { name: /acciones/i }));
    await screen.findByRole("menu");

    await userEvent.click(screen.getByRole("button", { name: "Fuera" }));

    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
  });

  it("no abre nada cuando esta deshabilitado", async () => {
    render(<Menu disabled />);
    const trigger = screen.getByRole("button", { name: /acciones/i });

    expect(trigger).toBeDisabled();
    await userEvent.click(trigger);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("no envia el formulario que lo contiene", async () => {
    // Un <button> sin type dentro de un <form> envia. El trigger es un boton.
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Menu />
      </form>,
    );
    await userEvent.click(screen.getByRole("button", { name: /acciones/i }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("no pone los textos en mayusculas en JS, solo por CSS", () => {
    render(<Menu />);
    // Importa para el nombre accesible y para lo que se copia al portapapeles.
    expect(screen.getByRole("button")).toHaveTextContent("Acciones");
  });

  it("permite sobreescribir estilos por className", () => {
    render(<Menu className="rounded-none" />);
    const cls = screen.getByRole("button").className;
    // tailwind-merge debe descartar el rounded-md del tamaño, no acumularlo.
    expect(cls).toContain("rounded-none");
    expect(cls).not.toContain("rounded-md");
  });
});

describe("SplitButton", () => {
  function Split(props: Partial<React.ComponentProps<typeof SplitButton>> = {}) {
    return (
      <SplitButton label="Enviar" {...props}>
        <MenuItem>Enviar a bolsillo</MenuItem>
        <MenuItem>Programar envío</MenuItem>
      </SplitButton>
    );
  }

  it("la accion por defecto se dispara sin abrir el menu", async () => {
    const onAction = vi.fn();
    render(<Split onAction={onAction} />);

    await userEvent.click(screen.getByRole("button", { name: "Enviar" }));

    expect(onAction).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("el segmento del chevron abre el menu sin disparar la accion", async () => {
    const onAction = vi.fn();
    render(<Split onAction={onAction} />);

    await userEvent.click(screen.getByRole("button", { name: "Más opciones" }));

    expect(await screen.findByRole("menu")).toBeInTheDocument();
    expect(onAction).not.toHaveBeenCalled();
  });

  it("el segmento del chevron tiene nombre accesible propio", () => {
    render(<Split menuLabel="Otras formas de enviar" />);
    // Sin texto visible, sin aria-label seria un boton anonimo para el lector.
    expect(screen.getByRole("button", { name: "Otras formas de enviar" })).toBeInTheDocument();
  });

  it("los dos segmentos se anuncian como un grupo, no como botones sueltos", () => {
    render(<Split />);
    // Sin el role, "Más opciones" queda huerfano: nada lo relaciona con "Enviar".
    const grupo = screen.getByRole("group");
    expect(grupo).toContainElement(screen.getByRole("button", { name: "Enviar" }));
    expect(grupo).toContainElement(screen.getByRole("button", { name: "Más opciones" }));
  });

  it("el consumidor puede renombrar o cambiar el role del contenedor", () => {
    render(<Split aria-label="Envío" role="toolbar" />);
    expect(screen.getByRole("toolbar", { name: "Envío" })).toBeInTheDocument();
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
  });

  it("deshabilitado no dispara la accion ni abre el menu", async () => {
    const onAction = vi.fn();
    render(<Split disabled onAction={onAction} />);

    const action = screen.getByRole("button", { name: "Enviar" });
    const menu = screen.getByRole("button", { name: "Más opciones" });
    expect(action).toBeDisabled();
    expect(menu).toBeDisabled();

    await userEvent.click(action);
    await userEvent.click(menu);

    expect(onAction).not.toHaveBeenCalled();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("ninguno de los dos segmentos envia el formulario que lo contiene", async () => {
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Split />
      </form>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Enviar" }));
    await userEvent.click(screen.getByRole("button", { name: "Más opciones" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });
});

describe("ButtonGroup", () => {
  function Group(props: Partial<React.ComponentProps<typeof ButtonGroup>> = {}) {
    return (
      <ButtonGroup defaultValue="dia" aria-label="Rango" {...props}>
        <ButtonGroupItem value="dia">Día</ButtonGroupItem>
        <ButtonGroupItem value="semana">Semana</ButtonGroupItem>
        <ButtonGroupItem value="mes">Mes</ButtonGroupItem>
      </ButtonGroup>
    );
  }

  it("arranca con exactamente una opcion activa", () => {
    render(<Group />);
    const items = screen.getAllByRole("radio");
    expect(items).toHaveLength(3);
    expect(items.filter((i) => i.getAttribute("aria-checked") === "true")).toHaveLength(1);
    expect(screen.getByRole("radio", { name: "Día" })).toBeChecked();
  });

  it("sin value ni defaultValue arranca activo el primer item", () => {
    // La regla del documento — "siempre hay exactamente una activa" — tambien
    // vale en el primer pintado: un radiogroup sin ninguna marcada no existe.
    render(
      <ButtonGroup aria-label="Rango">
        <ButtonGroupItem value="dia">Día</ButtonGroupItem>
        <ButtonGroupItem value="semana">Semana</ButtonGroupItem>
        <ButtonGroupItem value="mes">Mes</ButtonGroupItem>
      </ButtonGroup>,
    );

    const items = screen.getAllByRole("radio");
    expect(items.filter((i) => i.getAttribute("aria-checked") === "true")).toHaveLength(1);
    expect(screen.getByRole("radio", { name: "Día" })).toBeChecked();
  });

  it("encuentra el primer item aunque venga envuelto en un fragmento", () => {
    // Los items casi nunca son hijos directos: suelen salir de un .map().
    render(
      <ButtonGroup aria-label="Rango">
        <>
          {["dia", "semana"].map((v) => (
            <ButtonGroupItem key={v} value={v}>
              {v}
            </ButtonGroupItem>
          ))}
        </>
      </ButtonGroup>,
    );

    expect(screen.getByRole("radio", { name: "dia" })).toBeChecked();
  });

  it("controlado sin defaultValue respeta el valor del padre, no el primer item", () => {
    render(
      <ButtonGroup aria-label="Rango" value="mes" onValueChange={() => {}}>
        <ButtonGroupItem value="dia">Día</ButtonGroupItem>
        <ButtonGroupItem value="mes">Mes</ButtonGroupItem>
      </ButtonGroup>,
    );

    expect(screen.getByRole("radio", { name: "Mes" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Día" })).not.toBeChecked();
  });

  it("cambia la activa al pulsar otra opcion", async () => {
    const onValueChange = vi.fn();
    render(<Group onValueChange={onValueChange} />);

    await userEvent.click(screen.getByRole("radio", { name: "Semana" }));

    expect(onValueChange).toHaveBeenCalledWith("semana");
    expect(screen.getByRole("radio", { name: "Semana" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Día" })).not.toBeChecked();
  });

  it("pulsar la activa NO la desactiva: el grupo nunca se queda vacio", async () => {
    const onValueChange = vi.fn();
    render(<Group onValueChange={onValueChange} />);

    await userEvent.click(screen.getByRole("radio", { name: "Día" }));

    // Radix ToggleGroup en modo single desmarcaria por su cuenta; el componente
    // intercepta ese "" para cumplir la regla del documento.
    expect(screen.getByRole("radio", { name: "Día" })).toBeChecked();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("controlado, no cambia solo: manda el valor del padre", async () => {
    const onValueChange = vi.fn();
    render(<Group value="mes" onValueChange={onValueChange} />);

    await userEvent.click(screen.getByRole("radio", { name: "Semana" }));

    expect(onValueChange).toHaveBeenCalledWith("semana");
    // El padre no ha movido `value`, asi que la activa sigue siendo la suya.
    expect(screen.getByRole("radio", { name: "Mes" })).toBeChecked();
  });

  it("es una sola parada de tabulador y se recorre con flechas", async () => {
    render(<Group />);
    await userEvent.tab();

    const dia = screen.getByRole("radio", { name: "Día" });
    expect(dia).toHaveFocus();

    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "Semana" })).toHaveFocus();

    // loop: desde la ultima vuelve a la primera.
    await userEvent.keyboard("{ArrowRight}{ArrowRight}");
    expect(dia).toHaveFocus();
  });

  it("deshabilitado ignora los clicks pero conserva la activa", async () => {
    const onValueChange = vi.fn();
    render(<Group disabled onValueChange={onValueChange} />);

    await userEvent.click(screen.getByRole("radio", { name: "Semana" }));

    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("radio", { name: "Día" })).toBeChecked();
  });

  it("no pone los labels en mayusculas en JS", () => {
    render(<Group />);
    expect(screen.getByRole("radio", { name: "Semana" })).toHaveTextContent("Semana");
  });
});

describe("contraste del estado invertido bajo el puntero", () => {
  /* El estado open/activa se pinta invertido —fondo tinta, texto superficie— y
   * el hover generico solo describe el fondo. Si ese hover llega a ganarle al
   * estado, el fondo vuelve a claro y el texto se queda en superficie: texto
   * casi blanco sobre casi blanco. El fondo y el color de texto tienen que
   * moverse SIEMPRE juntos. */

  it("el trigger abierto sigue invertido con el puntero encima y pulsado", () => {
    render(<Menu />);
    const cls = screen.getByRole("button", { name: /acciones/i }).className;

    for (const estado of [
      { on: true },
      { on: true, hover: true },
      { on: true, hover: true, active: true },
    ]) {
      expect(utilidadGanadora(cls, FONDO, estado)).toMatch(/^bg-ink/);
      expect(utilidadGanadora(cls, COLOR_TEXTO, estado)).toBe("text-surface");
    }
  });

  it("el trigger cerrado conserva su hover claro", () => {
    render(<Menu />);
    const cls = screen.getByRole("button", { name: /acciones/i }).className;

    expect(utilidadGanadora(cls, FONDO, { hover: true })).toBe("bg-surface-2");
    expect(utilidadGanadora(cls, FONDO, { active: true })).toBe("bg-edge");
    expect(utilidadGanadora(cls, COLOR_TEXTO, { hover: true })).toBe("text-ink");
    // Deshabilitado manda sobre todo lo demas, tambien bajo el puntero.
    expect(utilidadGanadora(cls, FONDO, { hover: true, disabled: true })).toBe("bg-edge");
  });

  it("el segmento activo del group sigue invertido con el puntero encima", () => {
    render(
      <ButtonGroup defaultValue="dia" aria-label="Rango">
        <ButtonGroupItem value="dia">Día</ButtonGroupItem>
        <ButtonGroupItem value="semana">Semana</ButtonGroupItem>
      </ButtonGroup>,
    );
    const cls = screen.getByRole("radio", { name: "Día" }).className;

    for (const estado of [
      { on: true },
      { on: true, hover: true },
      { on: true, hover: true, active: true },
    ]) {
      expect(utilidadGanadora(cls, FONDO, estado)).toMatch(/^bg-ink/);
      expect(utilidadGanadora(cls, COLOR_TEXTO, estado)).toBe("text-surface");
    }

    // El inactivo mantiene el hover de la matriz de estados: superficie 2.
    expect(utilidadGanadora(cls, FONDO, { hover: true })).toBe("bg-surface-2");
    expect(utilidadGanadora(cls, COLOR_TEXTO, { hover: true })).toBe("text-ink");
  });
});
